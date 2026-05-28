// // import React, { useEffect, useState, useCallback } from 'react';
// // import {
// //   CRow,
// //   CCol,
// //   CCard,
// //   CCardBody,
// //   CButton,
// //   CBadge,
// //   CFormSelect,
// //   CFormInput,
// //   CProgress,
// //   CListGroup,
// //   CListGroupItem,
// //   CAlert,
// //   CSpinner,
// //   CTable
// // } from '@coreui/react';
// // import {
// //   FiFilter,
// //   FiRefreshCw,
// //   FiDollarSign,
// //   FiXCircle,
// //   FiCalendar,
// //   FiPieChart,
// //   FiBarChart2,
// //   FiArrowUpRight,
// //   FiClock,
// //   FiTrendingUp
// // } from 'react-icons/fi';
// // import axiosInstance from '../../axiosInstance';
// // import {
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// //   Tooltip,
// //   Legend,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid
// // } from 'recharts';

// // const FinanceDisbursement = () => {
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [filters, setFilters] = useState({
// //     branchId: 'all',
// //     subdealerId: 'all',
// //     financerId: 'all',
// //     startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
// //     endDate: new Date().toISOString().slice(0, 10),
// //     groupBy: 'branch'
// //   });
// //   const [availableBranches, setAvailableBranches] = useState([]);
// //   const [availableSubdealers, setAvailableSubdealers] = useState([]);
// //   const [initialized, setInitialized] = useState(false);

// //   useEffect(() => {
// //     const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
// //     const defaultBranchId = storedUser.branch?._id || 'all';
// //     if (!filters.branchId || filters.branchId === 'all') {
// //       setFilters((prev) => ({ ...prev, branchId: defaultBranchId }));
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const fetchDashboard = useCallback(async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const params = new URLSearchParams();
// //       if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
// //       if (filters.subdealerId && filters.subdealerId !== 'all') params.append('subdealerId', filters.subdealerId);
// //       if (filters.financerId && filters.financerId !== 'all') params.append('financerId', filters.financerId);
// //       if (filters.startDate) params.append('startDate', filters.startDate);
// //       if (filters.endDate) params.append('endDate', filters.endDate);
// //       if (filters.groupBy) params.append('groupBy', filters.groupBy);

// //       const url = `/finance/disbursement-dashboard${params.toString() ? `?${params.toString()}` : ''}`;
// //       const resp = await axiosInstance.get(url);
// //       if (resp.data?.success) {
// //         setData(resp.data);
// //         setAvailableBranches(resp.data.availableBranches || []);
// //         setAvailableSubdealers(resp.data.availableSubdealers || []);
// //         if (!initialized && resp.data.filters) {
// //           setFilters((prev) => ({ ...prev, ...resp.data.filters }));
// //           setInitialized(true);
// //         }
// //       } else {
// //         setError(resp.data?.message || 'Failed to load disbursement dashboard');
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.message || err.message || 'Failed to fetch data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [filters, initialized]);

// //   useEffect(() => {
// //     fetchDashboard();
// //   }, [fetchDashboard]);

// //   const handleFilterChange = (key, value) => {
// //     setFilters((prev) => ({ ...prev, [key]: value }));
// //   };

// //   const formatCurrency = (value) => {
// //     if (value === undefined || value === null) return '0';
// //     const num = Number(value);
// //     if (Number.isNaN(num)) return '0';
// //     return `${num.toLocaleString('en-IN')}`;
// //   };

// //   const formatCompactCurrency = (value) => {
// //     if (value === undefined || value === null) return '0';
// //     const num = Number(value);
// //     if (Number.isNaN(num)) return '0';
// //     if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
// //     if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
// //     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
// //     return `${num.toLocaleString('en-IN')}`;
// //   };

// //   const summary = data?.summaryCards || {};
// //   const grouped = data?.groupedData?.data || [];
// //   const financerWiseSplit = data?.financerWiseSplit || [];
// //   const monthlyTrend = data?.monthlyTrend || [];
// //   const topPendingReceipts = data?.topPendingReceipts || [];
// //   const receiptUpdateRate =
// //     summary.receiptUpdateRate !== undefined && summary.receiptUpdateRate !== null
// //       ? Number(summary.receiptUpdateRate).toFixed(1)
// //       : '0';
// //   const receiptUpdateRateValue = Number(receiptUpdateRate);

// //   const pieData = [
// //     { name: 'Receipt Updated', value: summary.receiptUpdatedCount || 0, color: '#28a745' },
// //     { name: 'Receipt Pending', value: summary.receiptPendingCount || 0, color: '#ffc107' }
// //   ].filter((item) => item.value > 0);

// //   const getFinancerName = (item) => item.financerName || item.name || item.financer || 'Unknown';

// //   const activityItems = topPendingReceipts.slice(0, 4).map((receipt) => ({
// //     id: receipt._id || receipt.bookingNumber || Math.random().toString(36).slice(2),
// //     title: receipt.bookingNumber || receipt.reference || receipt._id,
// //     description: receipt.customerName || receipt.customer || 'Pending receipt follow-up',
// //     amount: formatCurrency(receipt.balanceAmount || receipt.pendingAmount || 0),
// //     status: receipt.pendingDays >= 60 ? 'Critical' : receipt.pendingDays >= 30 ? 'Review' : 'Monitor',
// //     badge: receipt.pendingDays >= 60 ? 'danger' : receipt.pendingDays >= 30 ? 'warning' : 'success',
// //     time: receipt.pendingDays ? `${receipt.pendingDays}d overdue` : 'New'
// //   }));

// //   if (loading && !data) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
// //         <CSpinner style={{ width: '3rem', height: '3rem' }} />
// //       </div>
// //     );
// //   }

// //   if (error && !data) {
// //     return (
// //       <div className="p-4">
// //         <CAlert color="danger" className="d-flex align-items-center gap-3">
// //           <FiXCircle size={24} />
// //           <div className="flex-grow-1">{error}</div>
// //           <CButton color="danger" size="sm" onClick={fetchDashboard}>
// //             <FiRefreshCw className="me-1" /> Retry
// //           </CButton>
// //         </CAlert>
// //       </div>
// //     );
// //   }

// //   const pendingStatusBadge = (days) => {
// //     if (!days) return 'secondary';
// //     if (days >= 60) return 'danger';
// //     if (days >= 30) return 'warning';
// //     return 'success';
// //   };

// //   return (
// //     <div className="finance-disbursement p-3 p-lg-4" style={{ background: '#f3f6fb', minHeight: '100vh' }}>
// //       <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
// //         <div>
// //           <p className="text-uppercase text-muted small mb-2">Finance Control Center</p>
// //           <h2 className="mb-2 fw-bold">Disbursement Analytics</h2>
// //           <p className="text-muted mb-0">Premium ERP-style financial operations dashboard for branch and financer performance.</p>
// //         </div>
// //         <div className="d-flex flex-wrap gap-2 align-items-center">
// //           <CBadge color="secondary" className="py-2 px-3 d-flex align-items-center gap-1">
// //             <FiCalendar />
// //             {filters.startDate} to {filters.endDate}
// //           </CBadge>
// //           <CButton color="outline" size="sm" onClick={fetchDashboard} className="d-flex align-items-center gap-2">
// //             <FiRefreshCw /> Refresh
// //           </CButton>
// //         </div>
// //       </div>

// //       <CCard className="border-0 shadow-sm mb-4">
// //         <CCardBody className="p-4">
// //           <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
// //             <div>
// //               <h5 className="mb-1">Filters & Controls</h5>
// //               <p className="text-muted small mb-0">Rapid filter selection for branch, financer and period analysis.</p>
// //             </div>
// //           </div>
// //           <CRow className="g-3 align-items-center">
// //             <CCol xs={12} xl={3}>
// //               <CFormSelect size="lg" value={filters.branchId} onChange={(e) => handleFilterChange('branchId', e.target.value)}>
// //                 <option value="all">All Branches</option>
// //                 {availableBranches.map((branch) => (
// //                   <option key={branch._id} value={branch._id}>{branch.name}</option>
// //                 ))}
// //               </CFormSelect>
// //             </CCol>
// //             <CCol xs={12} xl={3}>
// //               <CFormSelect size="lg" value={filters.subdealerId} onChange={(e) => handleFilterChange('subdealerId', e.target.value)}>
// //                 <option value="all">All Subdealers</option>
// //                 {availableSubdealers.map((subdealer) => (
// //                   <option key={subdealer._id} value={subdealer._id}>{subdealer.name}</option>
// //                 ))}
// //               </CFormSelect>
// //             </CCol>
// //             <CCol xs={12} xl={3}>
// //               <CFormSelect size="lg" value={filters.financerId} onChange={(e) => handleFilterChange('financerId', e.target.value)}>
// //                 <option value="all">All Financers</option>
// //                 {financerWiseSplit.map((item) => (
// //                   <option key={item._id || getFinancerName(item)} value={item._id || item.financer || getFinancerName(item)}>{getFinancerName(item)}</option>
// //                 ))}
// //               </CFormSelect>
// //             </CCol>
// //             <CCol xs={6} xl={1}>
// //               <CFormInput type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} />
// //             </CCol>
// //             <CCol xs={6} xl={1}>
// //               <CFormInput type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} />
// //             </CCol>
// //             <CCol xs={12} xl={2} className="d-flex gap-2">
// //               <CButton color="primary" className="w-100" onClick={fetchDashboard}>Apply</CButton>
// //               <CButton color="secondary" className="w-100" onClick={() => setFilters((prev) => ({ ...prev, branchId: 'all', subdealerId: 'all', financerId: 'all' }))}>Reset</CButton>
// //             </CCol>
// //           </CRow>
// //         </CCardBody>
// //       </CCard>

// //       <CRow className="g-3 mb-4">
// //         {[
// //           { label: 'Total Disbursements', value: summary.totalDisbursements || 0, details: 'Bookings completed', color: 'primary' },
// //           { label: 'Disbursed Amount', value: formatCurrency(summary.totalDisbursedAmount || 0), details: 'Total funded', color: 'info' },
// //           { label: 'Receipts Updated', value: summary.receiptUpdatedCount || 0, details: 'Receipts closed', color: 'success' },
// //           { label: 'Updated Receipt Amount', value: formatCurrency(summary.totalReceiptUpdatedAmount || 0), details: 'Amount reconciled', color: 'success' },
// //           { label: 'Receipts Pending', value: summary.receiptPendingCount || 0, details: 'Awaiting update', color: 'warning' },
// //           { label: 'Pending Amount', value: formatCurrency(summary.totalReceiptPendingAmount || 0), details: 'Amount outstanding', color: 'warning' }
// //         ].map((item, idx) => (
// //           <CCol key={idx} xs={12} sm={6} md={4} xl={2}>
// //             <CCard className="h-100 border-0 shadow-sm bg-white">
// //               <CCardBody className="p-3">
// //                 <div className="d-flex justify-content-between align-items-start mb-3">
// //                   <div>
// //                     <p className="text-uppercase text-muted small mb-1">{item.label}</p>
// //                     <h4 className="mb-1">{item.value}</h4>
// //                   </div>
// //                   <CBadge color={item.color} className="text-uppercase small py-2 px-3">{item.color}</CBadge>
// //                 </div>
// //                 <p className="text-muted small mb-0">{item.details}</p>
// //               </CCardBody>
// //             </CCard>
// //           </CCol>
// //         ))}
// //       </CRow>

// //       <CRow className="g-3 mb-4">
// //         <CCol xl={8}>
// //           <CCard className="border-0 shadow-sm h-100">
// //             <CCardBody className="p-4">
// //               <div className="d-flex justify-content-between align-items-center mb-4">
// //                 <div>
// //                   <h5 className="mb-1">Disbursement Trend</h5>
// //                   <p className="text-muted small mb-0">Branch and financer performance in a modern analytics view.</p>
// //                 </div>
// //                 <CBadge color="secondary" className="text-uppercase small">{data?.groupedData?.groupBy || 'Branch'}</CBadge>
// //               </div>
// //               {monthlyTrend.length > 0 ? (
// //                 <ResponsiveContainer width="100%" height={320}>
// //                   <BarChart
// //                     data={monthlyTrend.map((item) => ({
// //                       name: item.month || item.label || item.period || item.name || '',
// //                       disbursed: item.totalDisbursedAmount || item.disbursedAmount || item.amount || 0,
// //                       updated: item.totalReceiptUpdatedAmount || item.updatedAmount || 0,
// //                       pending: item.totalReceiptPendingAmount || item.pendingAmount || 0
// //                     }))}
// //                   >
// //                     <CartesianGrid strokeDasharray="3 3" />
// //                     <XAxis dataKey="name" tick={{ fontSize: 12 }} />
// //                     <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
// //                     <Tooltip formatter={(value) => formatCurrency(value)} />
// //                     <Legend />
// //                     <Bar dataKey="disbursed" fill="#0d6efd" name="Disbursed" radius={[6, 6, 0, 0]} />
// //                     <Bar dataKey="updated" fill="#198754" name="Updated" radius={[6, 6, 0, 0]} />
// //                     <Bar dataKey="pending" fill="#ffc107" name="Pending" radius={[6, 6, 0, 0]} />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               ) : (
// //                 <div className="text-center text-muted py-5">No monthly trend data available</div>
// //               )}
// //             </CCardBody>
// //           </CCard>
// //         </CCol>

// //         <CCol xl={4}>
// //           <CCard className="border-0 shadow-sm h-100 mb-3">
// //             <CCardBody className="p-4">
// //               <div className="d-flex justify-content-between align-items-center mb-4">
// //                 <div>
// //                   <h5 className="mb-1">Receipt Health</h5>
// //                   <p className="text-muted small mb-0">Status breakdown for updated and pending receipts.</p>
// //                 </div>
// //                 <FiPieChart className="text-muted" />
// //               </div>
// //               <div className="d-flex gap-3 flex-wrap mb-4">
// //                 <div className="flex-fill bg-light rounded-3 p-3">
// //                   <p className="text-uppercase text-muted small mb-2">Updated Count</p>
// //                   <h4 className="mb-1 text-success">{summary.receiptUpdatedCount || 0}</h4>
// //                   <p className="text-muted small mb-0">{formatCurrency(summary.totalReceiptUpdatedAmount || 0)}</p>
// //                 </div>
// //                 <div className="flex-fill bg-light rounded-3 p-3">
// //                   <p className="text-uppercase text-muted small mb-2">Pending Count</p>
// //                   <h4 className="mb-1 text-warning">{summary.receiptPendingCount || 0}</h4>
// //                   <p className="text-muted small mb-0">{formatCurrency(summary.totalReceiptPendingAmount || 0)}</p>
// //                 </div>
// //               </div>
// //               {pieData.length > 0 ? (
// //                 <ResponsiveContainer width="100%" height={240}>
// //                   <PieChart>
// //                     <Pie
// //                       data={pieData}
// //                       dataKey="value"
// //                       nameKey="name"
// //                       cx="50%"
// //                       cy="50%"
// //                       outerRadius={80}
// //                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                     >
// //                       {pieData.map((entry, idx) => (
// //                         <Cell key={`cell-${idx}`} fill={entry.color} />
// //                       ))}
// //                     </Pie>
// //                     <Tooltip formatter={(value) => formatCurrency(value)} />
// //                     <Legend verticalAlign="bottom" height={36} />
// //                   </PieChart>
// //                 </ResponsiveContainer>
// //               ) : (
// //                 <div className="text-center text-muted py-4">No receipt status data available</div>
// //               )}
// //               <div className="mt-4">
// //                 <div className="d-flex justify-content-between align-items-center mb-2">
// //                   <span className="text-muted small">Receipt Update Rate</span>
// //                   <strong>{receiptUpdateRate}%</strong>
// //                 </div>
// //                 <div className="progress" style={{ height: 10 }}>
// //                   <div
// //                     className={`progress-bar ${receiptUpdateRateValue >= 80 ? 'bg-success' : receiptUpdateRateValue >= 50 ? 'bg-warning' : 'bg-danger'}`}
// //                     style={{ width: `${receiptUpdateRateValue}%` }}
// //                     role="progressbar"
// //                     aria-valuenow={receiptUpdateRateValue}
// //                     aria-valuemin={0}
// //                     aria-valuemax={100}
// //                   />
// //                 </div>
// //               </div>
// //             </CCardBody>
// //           </CCard>

// //           <CCard className="border-0 shadow-sm h-100">
// //             <CCardBody className="p-4">
// //               <div className="d-flex justify-content-between align-items-center mb-4">
// //                 <div>
// //                   <h5 className="mb-1">Notifications</h5>
// //                   <p className="text-muted small mb-0">Real-time alerts for finance operations.</p>
// //                 </div>
// //                 <FiClock className="text-muted" />
// //               </div>
// //               <div className="border rounded-3 p-3 bg-white">
// //                 <div className="mb-3 d-flex gap-3 align-items-start">
// //                   <CBadge color="success">Live</CBadge>
// //                   <div>
// //                     <strong>{summary.receiptUpdatedCount || 0} receipt updates</strong>
// //                     <div className="text-muted small">In the last hour</div>
// //                   </div>
// //                 </div>
// //                 <div className="mb-3 d-flex gap-3 align-items-start">
// //                   <CBadge color="warning">Action</CBadge>
// //                   <div>
// //                     <strong>{summary.receiptPendingCount || 0} pending receipts</strong>
// //                     <div className="text-muted small">Requires team review</div>
// //                   </div>
// //                 </div>
// //                 <div className="d-flex gap-3 align-items-start">
// //                   <CBadge color="info">Info</CBadge>
// //                   <div>
// //                     <strong>{financerWiseSplit.length} financers active</strong>
// //                     <div className="text-muted small">Split performance enabled</div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </CCardBody>
// //           </CCard>
// //         </CCol>
// //       </CRow>

// //       <CRow className="g-3">
// //         <CCol xl={8}>
// //           <CCard className="border-0 shadow-sm h-100">
// //             <CCardBody className="p-4">
// //               <div className="d-flex justify-content-between align-items-center mb-4">
// //                 <div>
// //                   <h5 className="mb-1">Pending Disbursement Table</h5>
// //                   <p className="text-muted small mb-0">Review urgent receipts and aging disbursement cases.</p>
// //                 </div>
// //                 <CBadge color="danger" className="text-uppercase small">Priority</CBadge>
// //               </div>
// //               <div className="table-responsive" style={{ minHeight: 430 }}>
// //                 <CTable hover className="table-borderless align-middle mb-0">
// //                   <thead className="table-light">
// //                     <tr>
// //                       <th style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 5 }}>Booking</th>
// //                       <th style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 5 }}>Customer</th>
// //                       <th className="text-end" style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 5 }}>Amount</th>
// //                       <th className="text-center" style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 5 }}>Pending Days</th>
// //                       <th className="text-end" style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 5 }}>Status</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {topPendingReceipts.length > 0 ? (
// //                       topPendingReceipts.map((receipt, idx) => (
// //                         <tr key={idx} className="hover-shadow">
// //                           <td>{receipt.bookingNumber || receipt.reference || receipt._id}</td>
// //                           <td>{receipt.customerName || receipt.customer || 'N/A'}</td>
// //                           <td className="text-end">{formatCurrency(receipt.balanceAmount || receipt.pendingAmount || 0)}</td>
// //                           <td className="text-center">{receipt.pendingDays || receipt.age || '-'}</td>
// //                           <td className="text-end">
// //                             <CBadge color={pendingStatusBadge(receipt.pendingDays)}>{receipt.pendingDays >= 60 ? 'Critical' : receipt.pendingDays >= 30 ? 'Review' : 'Monitor'}</CBadge>
// //                           </td>
// //                         </tr>
// //                       ))
// //                     ) : (
// //                       <tr>
// //                         <td colSpan={5} className="text-center text-muted py-5">No pending disbursement records available</td>
// //                       </tr>
// //                     )}
// //                   </tbody>
// //                 </CTable>
// //               </div>
// //             </CCardBody>
// //           </CCard>
// //         </CCol>

// //         <CCol xl={4}>
// //           <CCard className="border-0 shadow-sm mb-3 h-100">
// //             <CCardBody className="p-4">
// //               <div className="d-flex justify-content-between align-items-center mb-4">
// //                 <div>
// //                   <h5 className="mb-1">Finance Company Performance</h5>
// //                   <p className="text-muted small mb-0">Top financers by updated efficiency.</p>
// //                 </div>
// //                 <FiTrendingUp className="text-muted" />
// //               </div>
// //               {financerWiseSplit.slice(0, 3).map((financer, idx) => {
// //                 const updated = financer.receiptUpdatedCount || 0;
// //                 const total = financer.totalDisbursements || 1;
// //                 const score = Math.round((updated / total) * 100);
// //                 return (
// //                   <div key={idx} className="mb-4 pb-3 border-bottom">
// //                     <div className="d-flex justify-content-between align-items-start mb-2">
// //                       <div>
// //                         <h6 className="mb-1">{getFinancerName(financer)}</h6>
// //                         <p className="text-muted small mb-0">{formatCurrency(financer.totalDisbursedAmount || financer.totalAmount || 0)} disbursed</p>
// //                       </div>
// //                       <CBadge color="info" className="text-uppercase small">{financer.totalDisbursements || 0}</CBadge>
// //                     </div>
// //                     <div className="d-flex justify-content-between mb-2 small text-muted">
// //                       <span>Updated</span>
// //                       <strong>{updated}</strong>
// //                     </div>
// //                     <CProgress height="8px">
// //                       <CProgress value={score} color={score >= 75 ? 'success' : score >= 45 ? 'warning' : 'danger'} />
// //                     </CProgress>
// //                     <div className="d-flex justify-content-between mt-2 small text-muted">
// //                       <span>{score}% efficiency</span>
// //                       <span>{financer.receiptPendingCount || 0} pending</span>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //               {financerWiseSplit.length === 0 && <p className="text-center text-muted">No financer split data available</p>}
// //             </CCardBody>
// //           </CCard>

// //           <CCard className="border-0 shadow-sm h-100">
// //             <CCardBody className="p-4">
// //               <div className="d-flex justify-content-between align-items-center mb-4">
// //                 <div>
// //                   <h5 className="mb-1">Recent Activity</h5>
// //                   <p className="text-muted small mb-0">Latest finance timeline items.</p>
// //                 </div>
// //                 <FiClock className="text-muted" />
// //               </div>
// //               <CListGroup flush>
// //                 {activityItems.length > 0 ? (
// //                   activityItems.map((item) => (
// //                     <CListGroupItem key={item.id} className="border-0 p-3 rounded-3 mb-2 bg-light">
// //                       <div className="d-flex justify-content-between align-items-start mb-2">
// //                         <div>
// //                           <strong>{item.title}</strong>
// //                           <p className="text-muted small mb-0">{item.description}</p>
// //                         </div>
// //                         <CBadge color={item.badge} className="text-uppercase small">{item.status}</CBadge>
// //                       </div>
// //                       <div className="d-flex justify-content-between small text-muted">
// //                         <span>{item.amount}</span>
// //                         <span>{item.time}</span>
// //                       </div>
// //                     </CListGroupItem>
// //                   ))
// //                 ) : (
// //                   <p className="text-center text-muted">No recent activity available</p>
// //                 )}
// //               </CListGroup>
// //             </CCardBody>
// //           </CCard>
// //         </CCol>
// //       </CRow>
// //     </div>
// //   );
// // };

// // export default FinanceDisbursement;


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
} from '@coreui/react';
import {
  FiRefreshCw,
  FiXCircle,
  FiCalendar,
  FiPieChart,
  FiBarChart2,
  FiArrowUpRight,
  FiClock,
  FiTrendingUp,
  FiCheckCircle,
  FiClock as FiPending,
  FiAlertCircle,
  FiDownload,
  FiShare2,
  FiStar,
  FiActivity,
  FiDollarSign,
  FiUsers
} from 'react-icons/fi';
import axiosInstance from '../../axiosInstance';
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
  Line
} from 'recharts';

const FinanceDisbursement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    branchId: 'all',
    subdealerId: 'all',
    financerId: 'all',
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    groupBy: 'branch'
  });
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableSubdealers, setAvailableSubdealers] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const defaultBranchId = storedUser.branch?._id || 'all';
    if (!filters.branchId || filters.branchId === 'all') {
      setFilters((prev) => ({ ...prev, branchId: defaultBranchId }));
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
      if (filters.subdealerId && filters.subdealerId !== 'all') params.append('subdealerId', filters.subdealerId);
      if (filters.financerId && filters.financerId !== 'all') params.append('financerId', filters.financerId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.groupBy) params.append('groupBy', filters.groupBy);

      const url = `/finance/disbursement-dashboard${params.toString() ? `?${params.toString()}` : ''}`;
      const resp = await axiosInstance.get(url);
      if (resp.data?.success) {
        setData(resp.data);
        setAvailableBranches(resp.data.availableBranches || []);
        setAvailableSubdealers(resp.data.availableSubdealers || []);
        if (!initialized && resp.data.filters) {
          setFilters((prev) => ({ 
            ...prev, 
            branchId: resp.data.filters.branchId || prev.branchId,
            subdealerId: resp.data.filters.subdealerId || prev.subdealerId,
            financerId: resp.data.filters.financerId || prev.financerId,
            startDate: resp.data.filters.startDate || prev.startDate,
            endDate: resp.data.filters.endDate || prev.endDate
          }));
          setInitialized(true);
        }
      } else {
        setError(resp.data?.message || 'Failed to load disbursement dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [filters, initialized]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '₹0';
    const num = Number(value);
    if (Number.isNaN(num)) return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const formatCompactCurrency = (value) => {
    if (value === undefined || value === null) return '₹0';
    const num = Number(value);
    if (Number.isNaN(num)) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const summary = data?.summaryCards || {};
  const financerWiseSplit = data?.financerWiseSplit || [];
  const monthlyTrend = data?.monthlyTrend || [];
  const topPendingReceipts = data?.topPendingReceipts || [];
  const receiptUpdateRate = summary.receiptUpdateRate !== undefined && summary.receiptUpdateRate !== null
    ? Number(summary.receiptUpdateRate).toFixed(1)
    : '0';
  const receiptUpdateRateValue = Number(receiptUpdateRate);

  // Transform financer data to match frontend expectations
  const transformedFinancerData = financerWiseSplit.map(item => ({
    financerId: item.financerId,
    financerName: item.financerName,
    totalDisbursements: item.totalCount || 0,  // Map totalCount to totalDisbursements
    receiptUpdatedCount: item.updatedCount || 0,  // Map updatedCount to receiptUpdatedCount
    receiptPendingCount: item.pendingCount || 0,  // Map pendingCount to receiptPendingCount
    totalDisbursedAmount: item.totalAmount || 0,  // Map totalAmount to totalDisbursedAmount
    totalReceiptUpdatedAmount: item.updatedAmount || 0,  // Map updatedAmount to totalReceiptUpdatedAmount
    totalReceiptPendingAmount: item.pendingAmount || 0,  // Map pendingAmount to totalReceiptPendingAmount
    receiptUpdateRate: item.totalCount > 0 ? ((item.updatedCount || 0) / item.totalCount) * 100 : 0
  }));

  // Transform monthly trend data to match frontend expectations
  const transformedMonthlyTrend = monthlyTrend.map(item => ({
    month: item.month,
    label: item.label,
    totalDisbursedAmount: item.disbursedAmount || 0,  // Map disbursedAmount to totalDisbursedAmount
    totalReceiptUpdatedAmount: item.updatedAmount || 0,  // Map updatedAmount to totalReceiptUpdatedAmount
    totalReceiptPendingAmount: item.pendingAmount || 0,  // Map pendingAmount to totalReceiptPendingAmount
    disbursedCount: item.disbursedCount || 0,
    updatedCount: item.updatedCount || 0,
    pendingCount: item.pendingCount || 0
  }));

  const pieData = [
    { name: 'Receipt Updated', value: summary.receiptUpdatedCount || 0, color: '#10b981', amount: summary.totalReceiptUpdatedAmount || 0 },
    { name: 'Receipt Pending', value: summary.receiptPendingCount || 0, color: '#f59e0b', amount: summary.totalReceiptPendingAmount || 0 }
  ].filter((item) => item.value > 0);

  const getFinancerName = (item) => item.financerName || item.name || item.financer || 'Unknown';

  const getPriorityColor = (days) => {
    if (!days) return '#6c757d';
    if (days >= 60) return '#dc3545';
    if (days >= 30) return '#ffc107';
    return '#28a745';
  };

  const getPriorityText = (days) => {
    if (!days) return 'Normal';
    if (days >= 60) return 'Critical';
    if (days >= 30) return 'Review';
    return 'Monitor';
  };

  const StatCard = ({ label, value, subtitle, icon: Icon, color, trend }) => (
    <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
      <CCardBody className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className={`p-2 rounded-3 bg-${color}-light`} style={{ backgroundColor: `${color === 'primary' ? '#eef2ff' : color === 'success' ? '#ecfdf5' : color === 'warning' ? '#fffbeb' : color === 'danger' ? '#fef2f2' : '#f0f9ff'}` }}>
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

  const PendingReceiptCard = ({ receipt }) => {
    const days = receipt.pendingDays || receipt.age || 0;
    const priorityColor = getPriorityColor(days);
    const priorityText = getPriorityText(days);
    
    return (
      <div className="mb-2 p-2 rounded" style={{ 
        background: '#f8fafc',
        borderLeft: `3px solid ${priorityColor}`,
        cursor: 'pointer'
      }}>
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div>
            <small className="fw-semibold" style={{ fontSize: '12px' }}>{receipt.bookingNumber || receipt.reference || receipt._id}</small>
            <div className="text-muted" style={{ fontSize: '10px' }}>{receipt.customerName || receipt.customer || 'N/A'}</div>
          </div>
          <CBadge color={days >= 60 ? 'danger' : days >= 30 ? 'warning' : 'success'} className="rounded-pill px-2" style={{ fontSize: '9px' }}>
            {priorityText}
          </CBadge>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <strong style={{ fontSize: '12px', color: priorityColor }}>{formatCompactCurrency(receipt.balanceAmount || receipt.pendingAmount || 0)}</strong>
          <small className="text-muted" style={{ fontSize: '10px' }}>{days}d overdue</small>
        </div>
        <CProgress height="2px" className="mt-1 rounded-pill">
          <CProgress value={Math.min(100, (days / 90) * 100)} color={days >= 60 ? 'danger' : days >= 30 ? 'warning' : 'success'} />
        </CProgress>
      </div>
    );
  };

  const FinancerCard = ({ financer }) => {
    const updated = financer.receiptUpdatedCount || 0;
    const total = financer.totalDisbursements || 1;
    const score = Math.round((updated / total) * 100);
    
    return (
      <div className="mb-2 p-2 rounded" style={{ background: '#f8fafc' }}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="d-flex align-items-center gap-1">
            <FiStar size={12} className="text-warning" />
            <small className="fw-semibold" style={{ fontSize: '12px' }}>{financer.financerName}</small>
          </div>
          <CBadge color={score >= 75 ? 'success' : score >= 45 ? 'warning' : 'danger'} className="rounded-pill px-2" style={{ fontSize: '9px' }}>
            {score}%
          </CBadge>
        </div>
        <div className="d-flex justify-content-between mb-1">
          <small className="text-muted" style={{ fontSize: '9px' }}>Amount: {formatCompactCurrency(financer.totalDisbursedAmount || 0)}</small>
          <small className="text-muted" style={{ fontSize: '9px' }}>Updated: {updated}</small>
        </div>
        <CProgress height="3px" className="rounded-pill">
          <CProgress value={score} color={score >= 75 ? 'success' : score >= 45 ? 'warning' : 'danger'} />
        </CProgress>
      </div>
    );
  };

  if (loading && !data) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px', background: '#f0f2f5' }}>
        <CSpinner style={{ width: '3rem', height: '3rem' }} color="primary" />
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

  // Show no data message if no disbursements found
  if (summary.totalDisbursements === 0 && !loading) {
    return (
      <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <CCard className="border-0 shadow-sm text-center" style={{ maxWidth: '500px', borderRadius: '16px' }}>
            <CCardBody className="p-5">
              <FiBarChart2 size={64} className="text-muted mb-3 opacity-25" />
              <h5 className="mb-2">No Data Available</h5>
              <p className="text-muted mb-3">No disbursement records found for the selected filters.</p>
              <CButton color="primary" onClick={fetchDashboard} className="rounded-pill px-4">
                <FiRefreshCw className="me-2" /> Refresh
              </CButton>
            </CCardBody>
          </CCard>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="mb-1 fw-bold" style={{ fontSize: '24px', color: '#1e293b' }}>Disbursement Dashboard</h1>
            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Real-time financial performance & insights</p>
          </div>
          <div className="d-flex gap-2 mt-2 mt-sm-0">
            {/* <CButton color="light" size="sm" className="d-flex align-items-center gap-2 rounded-pill px-3" style={{ fontSize: '12px' }}>
              <FiDownload size={14} /> Export
            </CButton>
            <CButton color="light" size="sm" className="d-flex align-items-center gap-2 rounded-pill px-3" style={{ fontSize: '12px' }}>
              <FiShare2 size={14} /> Share
            </CButton> */}
          </div>
        </div>
      </div>

      {/* Filters */}
      <CCard className="border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <CCardBody className="p-3">
          <CRow className="g-2 align-items-end">
            <CCol lg={3} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Branch</label>
              <CFormSelect 
                value={filters.branchId} 
                onChange={(e) => handleFilterChange('branchId', e.target.value)}
                size="sm"
                className="rounded-pill"
                style={{ fontSize: '12px' }}
              >
                <option value="all">All Branches</option>
                {availableBranches.filter(b => b._id !== 'all').map((branch) => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol lg={3} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Subdealer</label>
              <CFormSelect 
                value={filters.subdealerId} 
                onChange={(e) => handleFilterChange('subdealerId', e.target.value)}
                size="sm"
                className="rounded-pill"
                style={{ fontSize: '12px' }}
              >
                <option value="all">All Subdealers</option>
                {availableSubdealers.map((subdealer) => (
                  <option key={subdealer._id} value={subdealer._id}>{subdealer.name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol lg={3} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Financer</label>
              <CFormSelect 
                value={filters.financerId} 
                onChange={(e) => handleFilterChange('financerId', e.target.value)}
                size="sm"
                className="rounded-pill"
                style={{ fontSize: '12px' }}
              >
                <option value="all">All Financers</option>
                {transformedFinancerData.map((item) => (
                  <option key={item.financerId} value={item.financerId}>
                    {item.financerName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol lg={2} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Date Range</label>
              <div className="d-flex gap-1">
                <CFormInput 
                  type="date" 
                  value={filters.startDate} 
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  size="sm"
                  className="rounded-pill"
                  style={{ fontSize: '11px' }}
                />
                <CFormInput 
                  type="date" 
                  value={filters.endDate} 
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  size="sm"
                  className="rounded-pill"
                  style={{ fontSize: '11px' }}
                />
              </div>
            </CCol>
            <CCol lg={1} md={6}>
              {/* <CButton 
                color="primary" 
                onClick={fetchDashboard} 
                className="w-100 rounded-pill"
                size="sm"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Apply
              </CButton> */}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Stats Row - 6 cards with equal height */}
      <CRow className="g-2 mb-4">
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard 
            label="Total Disbursements" 
            value={summary.totalDisbursements || 0} 
            subtitle="Completed bookings"
            icon={FiDollarSign}
            color="primary"
            trend={summary.totalDisbursements > 0 ? 12 : 0}
          />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard 
            label="Disbursed Amount" 
            value={formatCompactCurrency(summary.totalDisbursedAmount || 0)} 
            subtitle="Total funded"
            icon={FiBarChart2}
            color="info"
            trend={summary.totalDisbursedAmount > 0 ? 8 : 0}
          />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard 
            label="Receipts Updated" 
            value={summary.receiptUpdatedCount || 0} 
            subtitle="Successfully closed"
            icon={FiCheckCircle}
            color="success"
            trend={summary.receiptUpdatedCount > 0 ? 15 : 0}
          />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard 
            label="Updated Amount" 
            value={formatCompactCurrency(summary.totalReceiptUpdatedAmount || 0)} 
            subtitle="Amount reconciled"
            icon={FiTrendingUp}
            color="success"
          />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard 
            label="Pending Receipts" 
            value={summary.receiptPendingCount || 0} 
            subtitle="Awaiting update"
            icon={FiPending}
            color="warning"
            trend={summary.receiptPendingCount > 0 ? -5 : 0}
          />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard 
            label="Pending Amount" 
            value={formatCompactCurrency(summary.totalReceiptPendingAmount || 0)} 
            subtitle="Outstanding amount"
            icon={FiAlertCircle}
            color="danger"
          />
        </CCol>
      </CRow>

      {/* Chart and Health Section */}
      <CRow className="g-3 mb-4">
        <CCol xl={8}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Financial Performance Trend</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Monthly disbursement & receipt tracking</p>
                </div>
                <CBadge color="secondary" className="px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
                  <FiCalendar className="me-1" size={10} />
                  {data?.groupedData?.groupBy || 'Branch'} Wise
                </CBadge>
              </div>
              {transformedMonthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={transformedMonthlyTrend.map((item) => ({
                    name: (item.label || item.month || '').substring(0, 6),
                    disbursed: (item.totalDisbursedAmount || 0) / 100000,
                    updated: (item.totalReceiptUpdatedAmount || 0) / 100000,
                    pending: (item.totalReceiptPendingAmount || 0) / 100000
                  }))}>
                    <defs>
                      <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUpdated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(value) => `${value}L`} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => `₹${value}L`} contentStyle={{ fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="disbursed" stroke="#3b82f6" fill="url(#colorDisbursed)" name="Disbursed (L)" strokeWidth={2} />
                    <Area type="monotone" dataKey="updated" stroke="#10b981" fill="url(#colorUpdated)" name="Updated (L)" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" stroke="#f59e0b" fill="none" name="Pending (L)" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">
                  <FiBarChart2 size={48} className="mb-2 opacity-25" />
                  <p style={{ fontSize: '12px' }}>No trend data available</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xl={4}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Receipt Health</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Updated vs Pending breakdown</p>
                </div>
                <FiPieChart className="text-muted" size={16} />
              </div>
              
              {pieData.length > 0 ? (
                <>
                  <div className="row g-2 mb-3">
                    {pieData.map((item, idx) => (
                      <div key={idx} className="col-6">
                        <div className="p-2 rounded text-center" style={{ background: `${item.color}10` }}>
                          <div className="mb-1">
                            {item.name === 'Receipt Updated' ? 
                              <FiCheckCircle color={item.color} size={16} /> : 
                              <FiPending color={item.color} size={16} />
                            }
                          </div>
                          <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>{item.value.toLocaleString()}</h6>
                          <small className="text-muted" style={{ fontSize: '9px' }}>{item.name}</small>
                          <div className="text-muted" style={{ fontSize: '9px' }}>{formatCompactCurrency(item.amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={3}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} contentStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="text-center text-muted py-4">
                  <p style={{ fontSize: '12px' }}>No receipt data available</p>
                </div>
              )}

              <div className="mt-3 pt-2 border-top">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted" style={{ fontSize: '11px' }}>Receipt Update Rate</span>
                  <strong className="text-primary" style={{ fontSize: '12px' }}>{receiptUpdateRate}%</strong>
                </div>
                <CProgress height="4px" className="rounded-pill mb-1">
                  <CProgress 
                    value={receiptUpdateRateValue} 
                    color={receiptUpdateRateValue >= 80 ? 'success' : receiptUpdateRateValue >= 50 ? 'warning' : 'danger'}
                  />
                </CProgress>
                <div className="d-flex justify-content-between">
                  <small className="text-muted" style={{ fontSize: '9px' }}>Target: 80%</small>
                  <small className="text-muted" style={{ fontSize: '9px' }}>
                    {receiptUpdateRateValue >= 80 ? 'Excellent' : receiptUpdateRateValue >= 50 ? 'Needs Improvement' : 'Critical'}
                  </small>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Bottom Section - Equal Height Cards */}
      <CRow className="g-3">
        <CCol xl={4}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Top Financers</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Performance by efficiency score</p>
                </div>
                <FiStar className="text-warning" size={16} />
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {transformedFinancerData.length > 0 ? (
                  transformedFinancerData.slice(0, 8).map((financer, idx) => (
                    <FinancerCard key={idx} financer={financer} />
                  ))
                ) : (
                  <div className="text-center text-muted py-4">
                    <FiUsers size={32} className="mb-2 opacity-25" />
                    <p style={{ fontSize: '12px' }}>No financer data available</p>
                  </div>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* <CCol xl={4}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Urgent Pending Receipts</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Requires immediate attention</p>
                </div>
                <CBadge color="danger" className="rounded-pill px-2 py-1" style={{ fontSize: '9px' }}>
                  Priority
                </CBadge>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {topPendingReceipts.length > 0 ? (
                  topPendingReceipts.slice(0, 8).map((receipt, idx) => (
                    <PendingReceiptCard key={idx} receipt={receipt} />
                  ))
                ) : (
                  <div className="text-center text-muted py-4">
                    <FiCheckCircle size={32} className="mb-2 opacity-25" />
                    <p style={{ fontSize: '12px' }}>No pending receipts</p>
                    <small style={{ fontSize: '10px' }}>All receipts are up to date</small>
                  </div>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xl={4}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>System Summary</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Quick overview & alerts</p>
                </div>
                <FiActivity className="text-primary" size={16} />
              </div>
              
              <div className="mb-3 p-2 rounded" style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' }}>
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '10px' }}>Active Financers</small>
                    <h5 className="mb-0 fw-bold" style={{ fontSize: '20px' }}>{transformedFinancerData.length}</h5>
                  </div>
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '10px' }}>Total Disbursements</small>
                    <h5 className="mb-0 fw-bold" style={{ fontSize: '20px' }}>{summary.totalDisbursements || 0}</h5>
                  </div>
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '10px' }}>Update Rate</small>
                    <h5 className="mb-0 fw-bold" style={{ fontSize: '20px' }}>{receiptUpdateRate}%</h5>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-warning bg-opacity-10 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <FiAlertCircle size={14} className="text-warning" />
                  <div>
                    <small className="fw-semibold d-block" style={{ fontSize: '11px' }}>Pending Actions</small>
                    <small className="text-muted" style={{ fontSize: '10px' }}>{summary.receiptPendingCount || 0} receipts pending update</small>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-success bg-opacity-10">
                <div className="d-flex align-items-center gap-2">
                  <FiCheckCircle size={14} className="text-success" />
                  <div>
                    <small className="fw-semibold d-block" style={{ fontSize: '11px' }}>Completed Updates</small>
                    <small className="text-muted" style={{ fontSize: '10px' }}>{summary.receiptUpdatedCount || 0} receipts updated successfully</small>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted" style={{ fontSize: '10px' }}>
                    <FiCalendar className="me-1" size={10} />
                    Period: {filters.startDate} to {filters.endDate}
                  </small>
                  <CButton 
                    color="link" 
                    size="sm" 
                    onClick={fetchDashboard}
                    className="p-0 text-decoration-none"
                    style={{ fontSize: '10px' }}
                  >
                    <FiRefreshCw size={10} className="me-1" /> Refresh
                  </CButton>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol> */}
      </CRow>
    </div>
  );
};

export default FinanceDisbursement;

