// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../axiosInstance';

// const MOCK_RESPONSE = {
// 	"success": true,
// 	"summaryCards": {
// 		 "totalFinanceBookings": 103,
// 		 "totalProposedAmount": 8978267,
// 		 "totalActualAmount": 9080745,
// 		 "totalVariance": 102478,
// 		 "totalShortfall": 400,
// 		 "overallVariancePct": 1.14,
// 		 "realisationRate": 99.03,
// 		 "fullyRealisedCount": 102,
// 		 "partiallyRealisedCount": 1,
// 		 "pendingCount": 0
// 	},
// 	"groupedData": {
// 		 "groupBy": "branch",
// 		 "data": [
// 				{
// 					 "key": "Unknown Branch",
// 					 "label": "Unknown Branch",
// 					 "count": 64,
// 					 "totalProposedAmount": 5670137,
// 					 "totalActualAmount": 5772245,
// 					 "fullyRealisedCount": 63,
// 					 "partiallyRealisedCount": 1,
// 					 "pendingCount": 0,
// 					 "variance": 102108,
// 					 "variancePct": 1.8,
// 					 "realisationRate": 98.44
// 				},
// 				{
// 					 "key": "GANDHI TVS NASHIK",
// 					 "label": "GANDHI TVS NASHIK",
// 					 "count": 39,
// 					 "totalProposedAmount": 3308130,
// 					 "totalActualAmount": 3308500,
// 					 "fullyRealisedCount": 39,
// 					 "partiallyRealisedCount": 0,
// 					 "pendingCount": 0,
// 					 "variance": 370,
// 					 "variancePct": 0.01,
// 					 "realisationRate": 100
// 				}
// 		 ]
// 	},
// 	"financerWiseSplit": [
// 		 {
// 				"financerId": "696381f5a1842b52081bc90b",
// 				"financerName": "SHRIRAM FINANCE LTD",
// 				"count": 23,
// 				"proposedAmount": 1971090,
// 				"actualAmount": 1989881,
// 				"variance": 18791,
// 				"variancePct": 0.95,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "69bd1d63fadd9ddd6f5fdcba",
// 				"financerName": "BERAR FINANCE LIMITED",
// 				"count": 17,
// 				"proposedAmount": 1348037,
// 				"actualAmount": 1348037,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "698b336575656faf6b89f83b",
// 				"financerName": "HDFC BANK LTD.",
// 				"count": 13,
// 				"proposedAmount": 1041726,
// 				"actualAmount": 1041326,
// 				"variance": -400,
// 				"variancePct": -0.04,
// 				"shortfall": 400
// 		 },
// 		 {
// 				"financerId": "6980ae44bb829da1daa9c4f5",
// 				"financerName": "AU SMALL FINANCE BANK Ltd.",
// 				"count": 11,
// 				"proposedAmount": 933617,
// 				"actualAmount": 933617,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "6963800ea1842b52081b8d13",
// 				"financerName": "L&T FINANCE LTD",
// 				"count": 7,
// 				"proposedAmount": 767742,
// 				"actualAmount": 767742,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "69be7d6afadd9ddd6f9cd70e",
// 				"financerName": "AXIS BANK LTD",
// 				"count": 7,
// 				"proposedAmount": 657632,
// 				"actualAmount": 657632,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "698ad2751b51dc127d33764b",
// 				"financerName": "CREDIT WISE CAPITAL PVT LTD",
// 				"count": 5,
// 				"proposedAmount": 483875,
// 				"actualAmount": 483875,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "697cb4617e04e8211381a98e",
// 				"financerName": "BAJAJ FINANCE LTD",
// 				"count": 5,
// 				"proposedAmount": 448262,
// 				"actualAmount": 448262,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "6985ecc4c90944fa7493463f",
// 				"financerName": "CHOLA MANDALAM INVESTMENT & FINANCE CO. LTD.",
// 				"count": 3,
// 				"proposedAmount": 267600,
// 				"actualAmount": 267600,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "69bb9849ef29fd3d661d8af8",
// 				"financerName": "KOTAK MAHINDRA PRIME",
// 				"count": 3,
// 				"proposedAmount": 257493,
// 				"actualAmount": 341210,
// 				"variance": 83717,
// 				"variancePct": 32.51,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "698f05972c16978f72f6e793",
// 				"financerName": "IDFC FIRST BANK LTD",
// 				"count": 3,
// 				"proposedAmount": 245819,
// 				"actualAmount": 245819,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "69bd1de3fadd9ddd6f5feba5",
// 				"financerName": "Lasalgaon Merchant Cooperative Bank",
// 				"count": 2,
// 				"proposedAmount": 197000,
// 				"actualAmount": 197000,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "69c37934b1324d6c38fc12b1",
// 				"financerName": "BANK OF BARODA",
// 				"count": 1,
// 				"proposedAmount": 105000,
// 				"actualAmount": 105000,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "69ca2b070277acaaf8fff437",
// 				"financerName": "SHREE MAHESH CO OP BANK LTD NASHIK",
// 				"count": 1,
// 				"proposedAmount": 95630,
// 				"actualAmount": 96000,
// 				"variance": 370,
// 				"variancePct": 0.39,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "69c64bb64d9cfdbebfd98294",
// 				"financerName": "MANBA FINANCE Ltd",
// 				"count": 1,
// 				"proposedAmount": 87932,
// 				"actualAmount": 87932,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 },
// 		 {
// 				"financerId": "698f05522c16978f72f6e3ca",
// 				"financerName": "BANDHAN BANK LTD",
// 				"count": 1,
// 				"proposedAmount": 69812,
// 				"actualAmount": 69812,
// 				"variance": 0,
// 				"variancePct": 0,
// 				"shortfall": 0
// 		 }
// 	],
// 	"monthlyTrend": [
// 		 {
// 				"month": "2026-03",
// 				"label": "Mar 2026",
// 				"count": 20,
// 				"proposedAmount": 1759074,
// 				"actualAmount": 1861582,
// 				"variance": 102508,
// 				"variancePct": 5.83
// 		 },
// 		 {
// 				"month": "2026-04",
// 				"label": "Apr 2026",
// 				"count": 64,
// 				"proposedAmount": 5655382,
// 				"actualAmount": 5655752,
// 				"variance": 370,
// 				"variancePct": 0.01
// 		 },
// 		 {
// 				"month": "2026-05",
// 				"label": "May 2026",
// 				"count": 19,
// 				"proposedAmount": 1563811,
// 				"actualAmount": 1563411,
// 				"variance": -400,
// 				"variancePct": -0.03
// 		 }
// 	],
// 	"topShortfallBookings": [
// 		 {
// 				"bookingId": "69f88d23afc41385c5db9ce6",
// 				"bookingNumber": "BK002072",
// 				"customerName": "TEST",
// 				"branchName": "Unknown Branch",
// 				"financerName": "HDFC BANK LTD.",
// 				"proposedAmount": 1200,
// 				"actualAmount": 800,
// 				"shortfall": 400,
// 				"status": "PARTIALLY_REALISED",
// 				"createdAt": "2026-05-04T12:12:19.278Z"
// 		 }
// 	],
// 	"detailTable": {
// 		 "data": [
// 				{
// 					 "bookingId": "69fd8b1222483bd4f301e518",
// 					 "bookingNumber": "BK002120",
// 					 "bookingStatus": "ALLOCATED",
// 					 "bookingType": "SUBDEALER",
// 					 "createdAt": "2026-05-08T07:04:50.717Z",
// 					 "formattedDate": "08 May 2026",
// 					 "customerName": "Arjun ashok gangurde",
// 					 "mobile1": "8262849142",
// 					 "branchName": "Unknown Branch",
// 					 "subdealerName": "",
// 					 "seName": "LAXMAN_OMTVS",
// 					 "financerName": "CREDIT WISE CAPITAL PVT LTD",
// 					 "scheme": null,
// 					 "proposedGCAmount": 0,
// 					 "gcApplicable": true,
// 					 "proposedAmount": 79155,
// 					 "actualAmount": 79155,
// 					 "actualGCAmount": 0,
// 					 "variance": 0,
// 					 "variancePct": 0,
// 					 "shortfall": 0,
// 					 "status": "FULLY_REALISED",
// 					 "disbursementCount": 1,
// 					 "ledgerEntryCount": 1
// 				},
// 				{
// 					 "bookingId": "69f3288b58a4c521edddeba9",
// 					 "bookingNumber": "BK002007",
// 					 "bookingStatus": "ALLOCATED",
// 					 "bookingType": "SUBDEALER",
// 					 "createdAt": "2026-04-30T10:01:47.116Z",
// 					 "formattedDate": "30 Apr 2026",
// 					 "customerName": "ANANDA BHASKAR GODHADE",
// 					 "mobile1": "9270854349",
// 					 "branchName": "Unknown Branch",
// 					 "subdealerName": "",
// 					 "seName": "AJINKYA SHELKE",
// 					 "financerName": "CHOLA MANDALAM INVESTMENT & FINANCE CO. LTD.",
// 					 "scheme": null,
// 					 "proposedGCAmount": 1000,
// 					 "gcApplicable": true,
// 					 "proposedAmount": 80000,
// 					 "actualAmount": 80000,
// 					 "actualGCAmount": 0,
// 					 "variance": 0,
// 					 "variancePct": 0,
// 					 "shortfall": 0,
// 					 "status": "FULLY_REALISED",
// 					 "disbursementCount": 1,
// 					 "ledgerEntryCount": 1
// 				},
// 				{
// 					 "bookingId": "6a01d3063e5b9ccf54619309",
// 					 "bookingNumber": "BK002164",
// 					 "bookingStatus": "ALLOCATED",
// 					 "bookingType": "SUBDEALER",
// 					 "createdAt": "2026-05-11T13:00:54.462Z",
// 					 "formattedDate": "11 May 2026",
// 					 "customerName": "SIDDARATH RAMESH MORE",
// 					 "mobile1": "8007597436",
// 					 "branchName": "GANDHI TVS NASHIK",
// 					 "subdealerName": "RAJ AUTO LASALGAON",
// 					 "seName": "RAJ AUTO 1",
// 					 "financerName": "HDFC BANK LTD.",
// 					 "scheme": null,
// 					 "proposedGCAmount": 0,
// 					 "gcApplicable": true,
// 					 "proposedAmount": 56815,
// 					 "actualAmount": 56815,
// 					 "actualGCAmount": 0,
// 					 "variance": 0,
// 					 "variancePct": 0,
// 					 "shortfall": 0,
// 					 "status": "FULLY_REALISED",
// 					 "disbursementCount": 1,
// 					 "ledgerEntryCount": 1
// 				}
// 		 ],
// 		 "pagination": {
// 				"total": 103,
// 				"page": 1,
// 				"limit": 20,
// 				"totalPages": 6
// 		 }
// 	},
// 	"availableBranches": [
// 		 { "_id": "all", "name": "All Branches", "address": "", "city": "" },
// 		 { "_id": "695a3464e3a6522ef713be79", "name": "GANDHI TVS CIDCO", "address": "17,307/ASAHYADRI COMPLEX,NEXT TO HDFC BANK,OPP SYMBOSIS COLLEGE,CIDCO-PATHARDI PHATA ROAD,UPENDRA NAGAR,NASHIK", "city": "NASHIK" },
// 		 { "_id": "695a32b2e3a6522ef7138420", "name": "GANDHI TVS NASHIK", "address": "'JOGPREET',ASHER ESTATE, NEAR UPNAGAR SIGNAL,NASHIK ROAD,NASHIK", "city": "NASHIK" },
// 		 { "_id": "695a35bae3a6522ef7145cd8", "name": "GANDHI TVS PIMPALGAON BASWANT", "address": "PATIL ESTATE, NEXT TO HYUNDAI SHOWROOM, AGRA ROAD, PIMPALGAON BASWANT,NASHIK", "city": "PIMPALGAON BASWANT" }
// 	],
// 	"availableSubdealers": [ { "_id": "695a362fe3a6522ef7146f86", "name": "RAJ AUTO LASALGAON", "type": "B2C", "status": "active", "branch": "695a32b2e3a6522ef7138420" } ],
// 	"userAccessInfo": { "hasAllBranchesAccess": true, "branchAccess": "ALL", "isADBDM": false, "accessibleBranchesCount": 0, "assignedSubdealersCount": 0, "userBranch": { "_id": "695a32b2e3a6522ef7138420", "name": "GANDHI TVS NASHIK" } },
// 	"filters": { "branchId": "all", "subdealerId": "all", "financerId": null, "startDate": "2026-01-01", "endDate": "2026-12-31", "groupBy": "branch", "reportType": "GC_PROPOSED_VS_ACTUAL" },
// 	"debug": { "totalDisbursements": 121, "afterAccessFilter": 106, "uniqueBookings": 103, "totalLedgerActualEntries": 105 }
// };

// const FinanceReportDashboard = () => {
// 	const [loading, setLoading] = useState(false);
// 	const [resp, setResp] = useState(null);

// 	useEffect(() => {
// 		const fetchReport = async () => {
// 			setLoading(true);
// 			try {
// 				const res = await axiosInstance.get('/finance/fd-proposed-vs-actual', {
// 					params: {
// 						branchId: 'all',
// 						subdealerId: 'all',
// 						startDate: '2026-01-01',
// 						endDate: '2026-12-31',
// 						groupBy: 'branch',
// 						page: 1,
// 						limit: 20,
// 					},
// 				});

// 				// If API returns data shape, use it; otherwise fallback to mock
// 				setResp(res.data && res.data.success ? res.data : MOCK_RESPONSE);
// 			} catch (err) {
// 				console.warn('Failed to fetch finance report, using mock response', err);
// 				setResp(MOCK_RESPONSE);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchReport();
// 	}, []);

// 	if (loading) return <div>Loading finance report...</div>;
// 	if (!resp) return <div>No data</div>;

// 	const { summaryCards, groupedData, financerWiseSplit, monthlyTrend, topShortfallBookings, detailTable } = resp;

// 	return (
// 		<div style={{ padding: 12 }}>
// 			<h2>Finance: Proposed vs Actual</h2>

// 			<section>
// 				<h3>Summary</h3>
// 				<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
// 					<div><strong>Total Bookings:</strong> {summaryCards.totalFinanceBookings}</div>
// 					<div><strong>Proposed:</strong> {summaryCards.totalProposedAmount}</div>
// 					<div><strong>Actual:</strong> {summaryCards.totalActualAmount}</div>
// 					<div><strong>Variance:</strong> {summaryCards.totalVariance}</div>
// 					<div><strong>Shortfall:</strong> {summaryCards.totalShortfall}</div>
// 					<div><strong>Variance %:</strong> {summaryCards.overallVariancePct}%</div>
// 					<div><strong>Realisation Rate:</strong> {summaryCards.realisationRate}%</div>
// 				</div>
// 			</section>

// 			<section style={{ marginTop: 16 }}>
// 				<h3>Grouped ({groupedData.groupBy})</h3>
// 				<table border="1" cellPadding="6">
// 					<thead>
// 						<tr>
// 							<th>Label</th>
// 							<th>Count</th>
// 							<th>Proposed</th>
// 							<th>Actual</th>
// 							<th>Variance</th>
// 							<th>Realisation %</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{groupedData.data.map((g) => (
// 							<tr key={g.key}>
// 								<td>{g.label}</td>
// 								<td>{g.count}</td>
// 								<td>{g.totalProposedAmount}</td>
// 								<td>{g.totalActualAmount}</td>
// 								<td>{g.variance}</td>
// 								<td>{g.realisationRate}%</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</section>

// 			<section style={{ marginTop: 16 }}>
// 				<h3>Financer Wise Split</h3>
// 				<table border="1" cellPadding="6">
// 					<thead>
// 						<tr>
// 							<th>Financer</th>
// 							<th>Count</th>
// 							<th>Proposed</th>
// 							<th>Actual</th>
// 							<th>Variance</th>
// 							<th>Shortfall</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{financerWiseSplit.map((f) => (
// 							<tr key={f.financerId}>
// 								<td>{f.financerName}</td>
// 								<td>{f.count}</td>
// 								<td>{f.proposedAmount}</td>
// 								<td>{f.actualAmount}</td>
// 								<td>{f.variance}</td>
// 								<td>{f.shortfall}</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</section>

// 			<section style={{ marginTop: 16 }}>
// 				<h3>Monthly Trend</h3>
// 				<table border="1" cellPadding="6">
// 					<thead>
// 						<tr>
// 							<th>Month</th>
// 							<th>Count</th>
// 							<th>Proposed</th>
// 							<th>Actual</th>
// 							<th>Variance</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{monthlyTrend.map((m) => (
// 							<tr key={m.month}>
// 								<td>{m.label}</td>
// 								<td>{m.count}</td>
// 								<td>{m.proposedAmount}</td>
// 								<td>{m.actualAmount}</td>
// 								<td>{m.variance}</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</section>

// 			<section style={{ marginTop: 16 }}>
// 				<h3>Top Shortfall Bookings</h3>
// 				<ul>
// 					{topShortfallBookings.map((b) => (
// 						<li key={b.bookingId}>{b.bookingNumber} — {b.customerName} — {b.shortfall}</li>
// 					))}
// 				</ul>
// 			</section>

// 			<section style={{ marginTop: 16 }}>
// 				<h3>Details (first {detailTable.data.length} rows)</h3>
// 				<table border="1" cellPadding="6">
// 					<thead>
// 						<tr>
// 							<th>Booking #</th>
// 							<th>Date</th>
// 							<th>Customer</th>
// 							<th>Branch</th>
// 							<th>Financer</th>
// 							<th>Proposed</th>
// 							<th>Actual</th>
// 							<th>Shortfall</th>
// 							<th>Status</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{detailTable.data.map((d) => (
// 							<tr key={d.bookingId}>
// 								<td>{d.bookingNumber}</td>
// 								<td>{d.formattedDate}</td>
// 								<td>{d.customerName}</td>
// 								<td>{d.branchName}</td>
// 								<td>{d.financerName}</td>
// 								<td>{d.proposedAmount}</td>
// 								<td>{d.actualAmount}</td>
// 								<td>{d.shortfall}</td>
// 								<td>{d.status}</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 				<div style={{ marginTop: 8 }}>
// 					<strong>Pagination:</strong> {detailTable.pagination.page} / {detailTable.pagination.totalPages} (total {detailTable.pagination.total})
// 				</div>
// 			</section>
// 		</div>
// 	);
// };

// export default FinanceReportDashboard;

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
//   FiArrowDownRight,
//   FiTrendingUp,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiDollarSign,
//   FiUsers,
//   FiFileText,
//   FiSearch,
//   FiFilter,
//   FiDownload,
//   FiEye,
//   FiChevronLeft,
//   FiChevronRight,
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
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
// } from 'recharts';
// import axiosInstance from '../../axiosInstance';

// const MOCK_RESPONSE = {
//   success: true,
//   summaryCards: {
//     totalFinanceBookings: 103,
//     totalProposedAmount: 8978267,
//     totalActualAmount: 9080745,
//     totalVariance: 102478,
//     totalShortfall: 400,
//     overallVariancePct: 1.14,
//     realisationRate: 99.03,
//     fullyRealisedCount: 102,
//     partiallyRealisedCount: 1,
//     pendingCount: 0,
//   },
//   groupedData: {
//     groupBy: 'branch',
//     data: [
//       {
//         key: 'Unknown Branch',
//         label: 'Unknown Branch',
//         count: 64,
//         totalProposedAmount: 5670137,
//         totalActualAmount: 5772245,
//         fullyRealisedCount: 63,
//         partiallyRealisedCount: 1,
//         pendingCount: 0,
//         variance: 102108,
//         variancePct: 1.8,
//         realisationRate: 98.44,
//       },
//       {
//         key: 'GANDHI TVS NASHIK',
//         label: 'GANDHI TVS NASHIK',
//         count: 39,
//         totalProposedAmount: 3308130,
//         totalActualAmount: 3308500,
//         fullyRealisedCount: 39,
//         partiallyRealisedCount: 0,
//         pendingCount: 0,
//         variance: 370,
//         variancePct: 0.01,
//         realisationRate: 100,
//       },
//     ],
//   },
//   financerWiseSplit: [
//     {
//       financerId: '696381f5a1842b52081bc90b',
//       financerName: 'SHRIRAM FINANCE LTD',
//       count: 23,
//       proposedAmount: 1971090,
//       actualAmount: 1989881,
//       variance: 18791,
//       variancePct: 0.95,
//       shortfall: 0,
//     },
//     {
//       financerId: '69bd1d63fadd9ddd6f5fdcba',
//       financerName: 'BERAR FINANCE LIMITED',
//       count: 17,
//       proposedAmount: 1348037,
//       actualAmount: 1348037,
//       variance: 0,
//       variancePct: 0,
//       shortfall: 0,
//     },
//     {
//       financerId: '698b336575656faf6b89f83b',
//       financerName: 'HDFC BANK LTD.',
//       count: 13,
//       proposedAmount: 1041726,
//       actualAmount: 1041326,
//       variance: -400,
//       variancePct: -0.04,
//       shortfall: 400,
//     },
//   ],
//   monthlyTrend: [
//     {
//       month: '2026-03',
//       label: 'Mar 2026',
//       count: 20,
//       proposedAmount: 1759074,
//       actualAmount: 1861582,
//       variance: 102508,
//       variancePct: 5.83,
//     },
//     {
//       month: '2026-04',
//       label: 'Apr 2026',
//       count: 64,
//       proposedAmount: 5655382,
//       actualAmount: 5655752,
//       variance: 370,
//       variancePct: 0.01,
//     },
//     {
//       month: '2026-05',
//       label: 'May 2026',
//       count: 19,
//       proposedAmount: 1563811,
//       actualAmount: 1563411,
//       variance: -400,
//       variancePct: -0.03,
//     },
//   ],
//   topShortfallBookings: [
//     {
//       bookingId: '69f88d23afc41385c5db9ce6',
//       bookingNumber: 'BK002072',
//       customerName: 'TEST',
//       branchName: 'Unknown Branch',
//       financerName: 'HDFC BANK LTD.',
//       proposedAmount: 1200,
//       actualAmount: 800,
//       shortfall: 400,
//       status: 'PARTIALLY_REALISED',
//       createdAt: '2026-05-04T12:12:19.278Z',
//     },
//   ],
//   detailTable: {
//     data: [],
//     pagination: {
//       total: 103,
//       page: 1,
//       limit: 20,
//       totalPages: 6,
//     },
//   },
//   availableBranches: [
//     { _id: 'all', name: 'All Branches' },
//     { _id: '695a3464e3a6522ef713be79', name: 'GANDHI TVS CIDCO' },
//     { _id: '695a32b2e3a6522ef7138420', name: 'GANDHI TVS NASHIK' },
//     { _id: '695a35bae3a6522ef7145cd8', name: 'GANDHI TVS PIMPALGAON BASWANT' },
//   ],
//   availableSubdealers: [{ _id: '695a362fe3a6522ef7146f86', name: 'RAJ AUTO LASALGAON' }],
// };

// const FinanceReportDashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [filters, setFilters] = useState({
//     branchId: 'all',
//     subdealerId: 'all',
//     startDate: '2026-01-01',
//     endDate: '2026-12-31',
//     groupBy: 'branch',
//     page: 1,
//     limit: 20,
//   });

//   const fetchReport = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axiosInstance.get('/finance/fd-proposed-vs-actual', {
//         params: filters,
//       });
//       setData(res.data && res.data.success ? res.data : MOCK_RESPONSE);
//     } catch (err) {
//       console.warn('Failed to fetch finance report, using mock response', err);
//       setData(MOCK_RESPONSE);
//       setError(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   useEffect(() => {
//     fetchReport();
//   }, [fetchReport]);

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

//   if (loading && !data) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px', background: '#f0f2f5' }}>
//         <div className="text-center">
//           <CSpinner style={{ width: '3rem', height: '3rem' }} color="primary" />
//           <p className="mt-3 text-muted">Loading finance report...</p>
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
//           <CButton color="danger" size="sm" onClick={fetchReport} className="rounded-pill">
//             <FiRefreshCw className="me-1" /> Retry
//           </CButton>
//         </CAlert>
//       </div>
//     );
//   }

//   if (!data) return null;

//   const { summaryCards, groupedData, financerWiseSplit, monthlyTrend, topShortfallBookings, detailTable, availableBranches, availableSubdealers } = data;

//   const pieData = [
//     { name: 'Fully Realised', value: summaryCards.fullyRealisedCount || 0, color: '#10b981' },
//     { name: 'Partially Realised', value: summaryCards.partiallyRealisedCount || 0, color: '#f59e0b' },
//     { name: 'Pending', value: summaryCards.pendingCount || 0, color: '#ef4444' },
//   ].filter((item) => item.value > 0);

//   const varianceColor = summaryCards.overallVariancePct >= 0 ? 'success' : 'danger';
//   const varianceIcon = summaryCards.overallVariancePct >= 0 ? FiArrowUpRight : FiArrowDownRight;

//   const StatCard = ({ label, value, subtitle, icon: Icon, color, trend, trendValue }) => (
//     <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
//       <CCardBody className="p-3">
//         <div className="d-flex justify-content-between align-items-start mb-2">
//           <div className={`p-2 rounded-3`} style={{ backgroundColor: `${color === 'primary' ? '#eef2ff' : color === 'success' ? '#ecfdf5' : color === 'warning' ? '#fffbeb' : color === 'danger' ? '#fef2f2' : '#f0f9ff'}` }}>
//             <Icon size={20} color={color === 'primary' ? '#3b82f6' : color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : color === 'danger' ? '#ef4444' : '#06b6d4'} />
//           </div>
//           {trend && (
//             <CBadge color={trend > 0 ? 'success' : 'danger'} className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
//               {trend > 0 ? <FiArrowUpRight size={10} /> : <FiArrowDownRight size={10} />}
//               <span>{Math.abs(trend)}%</span>
//             </CBadge>
//           )}
//         </div>
//         <h6 className="text-muted mb-1 small text-uppercase fw-semibold" style={{ fontSize: '11px' }}>{label}</h6>
//         <h4 className="mb-1 fw-bold" style={{ fontSize: '20px' }}>{value}</h4>
//         {subtitle && <p className="text-muted small mb-0" style={{ fontSize: '10px' }}>{subtitle}</p>}
//         {trendValue && <small className="text-muted" style={{ fontSize: '9px' }}>{trendValue}</small>}
//       </CCardBody>
//     </CCard>
//   );

//   const ShortfallCard = ({ booking }) => (
//     <div className="mb-2 p-2 rounded" style={{ background: '#fef2f2', borderLeft: '3px solid #ef4444', cursor: 'pointer' }} onClick={() => { setSelectedBooking(booking); setModalVisible(true); }}>
//       <div className="d-flex justify-content-between align-items-start mb-1">
//         <div>
//           <small className="fw-semibold" style={{ fontSize: '12px' }}>{booking.bookingNumber}</small>
//           <div className="text-muted" style={{ fontSize: '10px' }}>{booking.customerName}</div>
//         </div>
//         <CBadge color="danger" className="rounded-pill px-2" style={{ fontSize: '9px' }}>Shortfall</CBadge>
//       </div>
//       <div className="d-flex justify-content-between align-items-center mt-1">
//         <div>
//           <small className="text-muted" style={{ fontSize: '9px' }}>Shortfall Amount</small>
//           <div className="fw-bold text-danger" style={{ fontSize: '12px' }}>{formatCompactCurrency(booking.shortfall)}</div>
//         </div>
//         <small className="text-muted" style={{ fontSize: '9px' }}>{booking.financerName}</small>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
//       {/* Header */}
//       <div className="mb-4">
//         <div className="d-flex flex-wrap justify-content-between align-items-center">
//           <div>
//             <h1 className="mb-1 fw-bold" style={{ fontSize: '24px', color: '#1e293b' }}>Finance Report: Proposed vs Actual</h1>
//             <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Track GC disbursement performance and variance analysis</p>
//           </div>
//           <div className="d-flex gap-2 mt-2 mt-sm-0">
//             <CButton color="light" size="sm" className="d-flex align-items-center gap-2 rounded-pill px-3" style={{ fontSize: '12px' }} onClick={fetchReport}>
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
//             <CCol lg={3} md={6}>
//               <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Date Range</label>
//               <div className="d-flex gap-1">
//                 <CFormInput type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '11px' }} />
//                 <CFormInput type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '11px' }} />
//               </div>
//             </CCol>
//             <CCol lg={3} md={6}>
//               <CButton color="primary" onClick={fetchReport} className="w-100 rounded-pill" size="sm" style={{ fontSize: '12px', padding: '6px 12px' }}>
//                 <FiSearch className="me-1" size={12} /> Apply Filters
//               </CButton>
//             </CCol>
//           </CRow>
//         </CCardBody>
//       </CCard>

//       {/* Summary Cards */}
//       <CRow className="g-2 mb-4">
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Total Bookings" value={summaryCards.totalFinanceBookings || 0} subtitle="Finance bookings" icon={FiFileText} color="primary" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Proposed Amount" value={formatCompactCurrency(summaryCards.totalProposedAmount || 0)} subtitle="Proposed GC amount" icon={FiDollarSign} color="info" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Actual Amount" value={formatCompactCurrency(summaryCards.totalActualAmount || 0)} subtitle="Actual disbursed" icon={FiCheckCircle} color="success" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Variance" value={formatCompactCurrency(summaryCards.totalVariance || 0)} subtitle="Proposed vs Actual" icon={varianceIcon} color={varianceColor} trend={summaryCards.overallVariancePct} />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Shortfall" value={formatCompactCurrency(summaryCards.totalShortfall || 0)} subtitle="Amount shortfall" icon={FiAlertCircle} color="danger" />
//         </CCol>
//         <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
//           <StatCard label="Realisation Rate" value={`${summaryCards.realisationRate || 0}%`} subtitle="Actual vs Proposed" icon={FiTrendingUp} color="success" />
//         </CCol>
//       </CRow>

//       {/* Charts Section */}
//       <CRow className="g-3 mb-4">
//         <CCol xl={7}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Monthly Trend Analysis</h6>
//                   <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Proposed vs Actual amount over time</p>
//                 </div>
//                 <CBadge color="secondary" className="px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
//                   <FiCalendar className="me-1" size={10} /> 2026
//                 </CBadge>
//               </div>
//               {monthlyTrend?.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={280}>
//                   <BarChart data={monthlyTrend.map((item) => ({ name: item.label, proposed: item.proposedAmount / 100000, actual: item.actualAmount / 100000 }))}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                     <XAxis dataKey="name" tick={{ fontSize: 10 }} />
//                     <YAxis tickFormatter={(value) => `${value}L`} tick={{ fontSize: 10 }} />
//                     <Tooltip formatter={(value) => `₹${value}L`} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
//                     <Legend wrapperStyle={{ fontSize: '11px' }} />
//                     <Bar dataKey="proposed" fill="#3b82f6" name="Proposed (L)" radius={[6, 6, 0, 0]} />
//                     <Bar dataKey="actual" fill="#10b981" name="Actual (L)" radius={[6, 6, 0, 0]} />
//                   </BarChart>
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
//                   <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Realisation Status</h6>
//                   <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Booking realisation breakdown</p>
//                 </div>
//                 <FiPieChart className="text-muted" size={16} />
//               </div>
//               {pieData.length > 0 ? (
//                 <>
//                   <div className="row g-2 mb-3">
//                     {pieData.map((item, idx) => (
//                       <div key={idx} className="col-4">
//                         <div className="p-2 rounded text-center" style={{ background: `${item.color}10` }}>
//                           <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>{item.value}</h6>
//                           <small className="text-muted" style={{ fontSize: '9px' }}>{item.name}</small>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <ResponsiveContainer width="100%" height={160}>
//                     <PieChart>
//                       <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3}>
//                         {pieData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
//                       </Pie>
//                       <Tooltip contentStyle={{ fontSize: '11px' }} />
//                       <Legend wrapperStyle={{ fontSize: '10px' }} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </>
//               ) : (
//                 <div className="text-center text-muted py-4"><p style={{ fontSize: '12px' }}>No realisation data available</p></div>
//               )}
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {/* Financer Performance & Shortfalls */}
//       <CRow className="g-3 mb-4">
//         <CCol xl={6}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Financer Performance</h6>
//                   <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Top financers by disbursement volume</p>
//                 </div>
//                 <FiUsers className="text-muted" size={16} />
//               </div>
//               <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
//                 {financerWiseSplit?.slice(0, 8).map((financer, idx) => {
//                   const variancePct = financer.variancePct || 0;
//                   return (
//                     <div key={idx} className="mb-2 p-2 rounded" style={{ background: '#f8fafc' }}>
//                       <div className="d-flex justify-content-between align-items-center mb-1">
//                         <small className="fw-semibold" style={{ fontSize: '12px' }}>{financer.financerName}</small>
//                         <CBadge color={variancePct === 0 ? 'success' : variancePct > 0 ? 'warning' : 'danger'} className="rounded-pill px-2" style={{ fontSize: '9px' }}>
//                           {variancePct > 0 ? `+${variancePct}%` : `${variancePct}%`}
//                         </CBadge>
//                       </div>
//                       <div className="d-flex justify-content-between mb-1">
//                         <small className="text-muted" style={{ fontSize: '9px' }}>Count: {financer.count}</small>
//                         <small className="text-muted" style={{ fontSize: '9px' }}>Shortfall: {formatCompactCurrency(financer.shortfall || 0)}</small>
//                       </div>
//                       <CProgress height="3px" className="rounded-pill">
//                         <CProgress value={Math.min(100, (financer.actualAmount / financer.proposedAmount) * 100)} color="success" />
//                       </CProgress>
//                       <div className="d-flex justify-content-between mt-1">
//                         <small className="text-muted" style={{ fontSize: '8px' }}>Proposed: {formatCompactCurrency(financer.proposedAmount)}</small>
//                         <small className="text-muted" style={{ fontSize: '8px' }}>Actual: {formatCompactCurrency(financer.actualAmount)}</small>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 {(!financerWiseSplit || financerWiseSplit.length === 0) && (
//                   <div className="text-center text-muted py-4"><FiUsers size={32} className="mb-2 opacity-25" /><p>No financer data available</p></div>
//                 )}
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol xl={6}>
//           <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
//             <CCardBody className="p-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Top Shortfall Bookings</h6>
//                   <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Bookings requiring attention</p>
//                 </div>
//                 <CBadge color="danger" className="rounded-pill px-2 py-1" style={{ fontSize: '9px' }}>Action Required</CBadge>
//               </div>
//               <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
//                 {topShortfallBookings?.length > 0 ? (
//                   topShortfallBookings.slice(0, 8).map((booking, idx) => <ShortfallCard key={idx} booking={booking} />)
//                 ) : (
//                   <div className="text-center text-muted py-4"><FiCheckCircle size={32} className="mb-2 opacity-25" /><p style={{ fontSize: '12px' }}>No shortfall bookings</p><small>All bookings are fully realised</small></div>
//                 )}
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       {/* Details Section */}
//       <CCard className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
//         <CCardBody className="p-0">
//           <div className="p-3 border-bottom">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Booking Details</h6>
//                 <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Detailed booking information</p>
//               </div>
//               <div className="text-muted" style={{ fontSize: '12px' }}>Total: {detailTable?.pagination?.total || 0} bookings</div>
//             </div>
//           </div>
//           <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
//             <table className="table table-hover mb-0" style={{ fontSize: '12px' }}>
//               <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
//                 <tr>
//                   <th className="border-0">Booking #</th>
//                   <th className="border-0">Date</th>
//                   <th className="border-0">Customer</th>
//                   <th className="border-0">Branch</th>
//                   <th className="border-0">Financer</th>
//                   <th className="border-0 text-end">Proposed</th>
//                   <th className="border-0 text-end">Actual</th>
//                   <th className="border-0 text-end">Variance</th>
//                   <th className="border-0 text-center">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {detailTable?.data?.map((booking) => {
//                   const variance = (booking.actualAmount || 0) - (booking.proposedAmount || 0);
//                   return (
//                     <tr key={booking.bookingId} style={{ cursor: 'pointer' }} onClick={() => { setSelectedBooking(booking); setModalVisible(true); }}>
//                       <td className="fw-semibold">{booking.bookingNumber}</td>
//                       <td>{booking.formattedDate}</td>
//                       <td>{booking.customerName}</td>
//                       <td>{booking.branchName}</td>
//                       <td>{booking.financerName}</td>
//                       <td className="text-end">{formatCompactCurrency(booking.proposedAmount)}</td>
//                       <td className="text-end">{formatCompactCurrency(booking.actualAmount)}</td>
//                       <td className={`text-end ${variance > 0 ? 'text-success' : variance < 0 ? 'text-danger' : 'text-muted'}`}>
//                         {variance > 0 ? '+' : ''}{formatCompactCurrency(variance)}
//                       </td>
//                       <td className="text-center">
//                         <CBadge color={booking.status === 'FULLY_REALISED' ? 'success' : 'warning'} className="rounded-pill px-2" style={{ fontSize: '9px' }}>
//                           {booking.status?.replace('_', ' ') || 'N/A'}
//                         </CBadge>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {(!detailTable?.data || detailTable.data.length === 0) && (
//                   <tr><td colSpan={9} className="text-center text-muted py-5">No booking details available</td></tr>
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

//       {/* Booking Details Modal */}
//       <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" alignment="center">
//         <CModalHeader onClose={() => setModalVisible(false)}>
//           <CModalTitle>Booking Details: {selectedBooking?.bookingNumber}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedBooking && (
//             <div className="p-2">
//               <CRow className="g-3">
//                 <CCol md={6}>
//                   <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <small className="text-muted d-block mb-1">Customer Information</small>
//                     <p className="mb-1"><strong>Name:</strong> {selectedBooking.customerName}</p>
//                     <p className="mb-1"><strong>Mobile:</strong> {selectedBooking.mobile1 || 'N/A'}</p>
//                     <p className="mb-0"><strong>Branch:</strong> {selectedBooking.branchName}</p>
//                   </div>
//                 </CCol>
//                 <CCol md={6}>
//                   <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <small className="text-muted d-block mb-1">Financial Information</small>
//                     <p className="mb-1"><strong>Proposed Amount:</strong> {formatCurrency(selectedBooking.proposedAmount)}</p>
//                     <p className="mb-1"><strong>Actual Amount:</strong> {formatCurrency(selectedBooking.actualAmount)}</p>
//                     <p className="mb-0"><strong>Shortfall:</strong> {formatCurrency(selectedBooking.shortfall || 0)}</p>
//                   </div>
//                 </CCol>
//                 <CCol md={6}>
//                   <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <small className="text-muted d-block mb-1">Booking Information</small>
//                     <p className="mb-1"><strong>Booking Date:</strong> {selectedBooking.formattedDate}</p>
//                     <p className="mb-1"><strong>Status:</strong> {selectedBooking.status}</p>
//                     <p className="mb-0"><strong>Financer:</strong> {selectedBooking.financerName}</p>
//                   </div>
//                 </CCol>
//                 <CCol md={6}>
//                   <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
//                     <small className="text-muted d-block mb-1">GC Information</small>
//                     <p className="mb-1"><strong>GC Applicable:</strong> {selectedBooking.gcApplicable ? 'Yes' : 'No'}</p>
//                     <p className="mb-1"><strong>Proposed GC:</strong> {formatCurrency(selectedBooking.proposedGCAmount)}</p>
//                     <p className="mb-0"><strong>Actual GC:</strong> {formatCurrency(selectedBooking.actualGCAmount)}</p>
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

//       <style jsx>{`
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

// export default FinanceReportDashboard;


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
  FiArrowDownRight,
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
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import axiosInstance from '../../axiosInstance';

const FinanceReportDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    branchId: 'all',
    subdealerId: 'all',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    groupBy: 'branch',
    page: 1,
    limit: 20,
  });

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/finance/fd-proposed-vs-actual', {
        params: filters,
      });
      if (res.data && res.data.success) {
        setData(res.data);
      } else {
        // Set empty data structure when API fails
        setData({
          success: false,
          summaryCards: {
            totalFinanceBookings: 0,
            totalProposedAmount: 0,
            totalActualAmount: 0,
            totalVariance: 0,
            totalShortfall: 0,
            overallVariancePct: 0,
            realisationRate: 0,
            fullyRealisedCount: 0,
            partiallyRealisedCount: 0,
            pendingCount: 0,
          },
          groupedData: { groupBy: 'branch', data: [] },
          financerWiseSplit: [],
          monthlyTrend: [],
          topShortfallBookings: [],
          detailTable: { data: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } },
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
          totalFinanceBookings: 0,
          totalProposedAmount: 0,
          totalActualAmount: 0,
          totalVariance: 0,
          totalShortfall: 0,
          overallVariancePct: 0,
          realisationRate: 0,
          fullyRealisedCount: 0,
          partiallyRealisedCount: 0,
          pendingCount: 0,
        },
        groupedData: { groupBy: 'branch', data: [] },
        financerWiseSplit: [],
        monthlyTrend: [],
        topShortfallBookings: [],
        detailTable: { data: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } },
        availableBranches: [],
        availableSubdealers: [],
      });
      setError(null); // Clear error to show dashboard with zeros
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

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

  if (loading && !data) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px', background: '#f0f2f5' }}>
        <div className="text-center">
          <CSpinner style={{ width: '3rem', height: '3rem' }} color="primary" />
          <p className="mt-3 text-muted">Loading finance report...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { summaryCards, groupedData, financerWiseSplit, monthlyTrend, topShortfallBookings, detailTable, availableBranches, availableSubdealers } = data;

  const pieData = [
    { name: 'Fully Realised', value: summaryCards.fullyRealisedCount || 0, color: '#10b981' },
    { name: 'Partially Realised', value: summaryCards.partiallyRealisedCount || 0, color: '#f59e0b' },
    { name: 'Pending', value: summaryCards.pendingCount || 0, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  const varianceColor = summaryCards.overallVariancePct >= 0 ? 'success' : 'danger';
  const varianceIcon = summaryCards.overallVariancePct >= 0 ? FiArrowUpRight : FiArrowDownRight;

  const StatCard = ({ label, value, subtitle, icon: Icon, color, trend }) => (
    <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
      <CCardBody className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className={`p-2 rounded-3`} style={{ backgroundColor: `${color === 'primary' ? '#eef2ff' : color === 'success' ? '#ecfdf5' : color === 'warning' ? '#fffbeb' : color === 'danger' ? '#fef2f2' : '#f0f9ff'}` }}>
            <Icon size={20} color={color === 'primary' ? '#3b82f6' : color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : color === 'danger' ? '#ef4444' : '#06b6d4'} />
          </div>
          {trend && (
            <CBadge color={trend > 0 ? 'success' : 'danger'} className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
              {trend > 0 ? <FiArrowUpRight size={10} /> : <FiArrowDownRight size={10} />}
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

  const ShortfallCard = ({ booking }) => (
    <div className="mb-2 p-2 rounded" style={{ background: '#fef2f2', borderLeft: '3px solid #ef4444', cursor: 'pointer' }} onClick={() => { setSelectedBooking(booking); setModalVisible(true); }}>
      <div className="d-flex justify-content-between align-items-start mb-1">
        <div>
          <small className="fw-semibold" style={{ fontSize: '12px' }}>{booking.bookingNumber}</small>
          <div className="text-muted" style={{ fontSize: '10px' }}>{booking.customerName}</div>
        </div>
        <CBadge color="danger" className="rounded-pill px-2" style={{ fontSize: '9px' }}>Shortfall</CBadge>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-1">
        <div>
          <small className="text-muted" style={{ fontSize: '9px' }}>Shortfall Amount</small>
          <div className="fw-bold text-danger" style={{ fontSize: '12px' }}>{formatCompactCurrency(booking.shortfall)}</div>
        </div>
        <small className="text-muted" style={{ fontSize: '9px' }}>{booking.financerName}</small>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="mb-1 fw-bold" style={{ fontSize: '24px', color: '#1e293b' }}>Finance Report: Proposed vs Actual</h1>
            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Track GC disbursement performance and variance analysis</p>
          </div>
          <div className="d-flex gap-2 mt-2 mt-sm-0">
            <CButton color="light" size="sm" className="d-flex align-items-center gap-2 rounded-pill px-3" style={{ fontSize: '12px' }} onClick={fetchReport}>
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
            <CCol lg={3} md={6}>
              <label className="form-label small fw-semibold text-muted mb-1" style={{ fontSize: '11px' }}>Date Range</label>
              <div className="d-flex gap-1">
                <CFormInput type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '11px' }} />
                <CFormInput type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} size="sm" className="rounded-pill" style={{ fontSize: '11px' }} />
              </div>
            </CCol>
            <CCol lg={3} md={6}>
              <CButton color="primary" onClick={fetchReport} className="w-100 rounded-pill" size="sm" style={{ fontSize: '12px', padding: '6px 12px' }}>
                <FiSearch className="me-1" size={12} /> Apply Filters
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Summary Cards */}
      <CRow className="g-2 mb-4">
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Total Bookings" value={summaryCards.totalFinanceBookings || 0} subtitle="Finance bookings" icon={FiFileText} color="primary" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Proposed Amount" value={formatCompactCurrency(summaryCards.totalProposedAmount || 0)} subtitle="Proposed GC amount" icon={FiDollarSign} color="info" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Actual Amount" value={formatCompactCurrency(summaryCards.totalActualAmount || 0)} subtitle="Actual disbursed" icon={FiCheckCircle} color="success" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Variance" value={formatCompactCurrency(summaryCards.totalVariance || 0)} subtitle="Proposed vs Actual" icon={varianceIcon} color={varianceColor} trend={summaryCards.overallVariancePct} />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Shortfall" value={formatCompactCurrency(summaryCards.totalShortfall || 0)} subtitle="Amount shortfall" icon={FiAlertCircle} color="danger" />
        </CCol>
        <CCol xl={2} lg={4} md={4} sm={6} xs={12}>
          <StatCard label="Realisation Rate" value={`${summaryCards.realisationRate || 0}%`} subtitle="Actual vs Proposed" icon={FiTrendingUp} color="success" />
        </CCol>
      </CRow>

      {/* Charts Section */}
      <CRow className="g-3 mb-4">
        <CCol xl={7}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Monthly Trend Analysis</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Proposed vs Actual amount over time</p>
                </div>
                <CBadge color="secondary" className="px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>
                  <FiCalendar className="me-1" size={10} /> 2026
                </CBadge>
              </div>
              {monthlyTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyTrend.map((item) => ({ name: item.label, proposed: item.proposedAmount / 100000, actual: item.actualAmount / 100000 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(value) => `${value}L`} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => `₹${value}L`} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="proposed" fill="#3b82f6" name="Proposed (L)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="actual" fill="#10b981" name="Actual (L)" radius={[6, 6, 0, 0]} />
                  </BarChart>
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
        <CCol xl={5}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Realisation Status</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Booking realisation breakdown</p>
                </div>
                <FiPieChart className="text-muted" size={16} />
              </div>
              {pieData.length > 0 ? (
                <>
                  <div className="row g-2 mb-3">
                    {pieData.map((item, idx) => (
                      <div key={idx} className="col-4">
                        <div className="p-2 rounded text-center" style={{ background: `${item.color}10` }}>
                          <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>{item.value}</h6>
                          <small className="text-muted" style={{ fontSize: '9px' }}>{item.name}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3}>
                        {pieData.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="text-center text-muted py-4">
                  <p style={{ fontSize: '12px' }}>No realisation data available</p>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Financer Performance & Shortfalls */}
      <CRow className="g-3 mb-4">
        <CCol xl={6}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Financer Performance</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Top financers by disbursement volume</p>
                </div>
                <FiUsers className="text-muted" size={16} />
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {financerWiseSplit?.length > 0 ? (
                  financerWiseSplit.slice(0, 8).map((financer, idx) => {
                    const variancePct = financer.variancePct || 0;
                    return (
                      <div key={idx} className="mb-2 p-2 rounded" style={{ background: '#f8fafc' }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="fw-semibold" style={{ fontSize: '12px' }}>{financer.financerName}</small>
                          <CBadge color={variancePct === 0 ? 'success' : variancePct > 0 ? 'warning' : 'danger'} className="rounded-pill px-2" style={{ fontSize: '9px' }}>
                            {variancePct > 0 ? `+${variancePct}%` : `${variancePct}%`}
                          </CBadge>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-muted" style={{ fontSize: '9px' }}>Count: {financer.count}</small>
                          <small className="text-muted" style={{ fontSize: '9px' }}>Shortfall: {formatCompactCurrency(financer.shortfall || 0)}</small>
                        </div>
                        <CProgress height="3px" className="rounded-pill">
                          <CProgress value={Math.min(100, (financer.actualAmount / financer.proposedAmount) * 100)} color="success" />
                        </CProgress>
                        <div className="d-flex justify-content-between mt-1">
                          <small className="text-muted" style={{ fontSize: '8px' }}>Proposed: {formatCompactCurrency(financer.proposedAmount)}</small>
                          <small className="text-muted" style={{ fontSize: '8px' }}>Actual: {formatCompactCurrency(financer.actualAmount)}</small>
                        </div>
                      </div>
                    );
                  })
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
        <CCol xl={6}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CCardBody className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Top Shortfall Bookings</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Bookings requiring attention</p>
                </div>
                <CBadge color="danger" className="rounded-pill px-2 py-1" style={{ fontSize: '9px' }}>Action Required</CBadge>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {topShortfallBookings?.length > 0 ? (
                  topShortfallBookings.slice(0, 8).map((booking, idx) => <ShortfallCard key={idx} booking={booking} />)
                ) : (
                  <div className="text-center text-muted py-4">
                    <FiCheckCircle size={32} className="mb-2 opacity-25" />
                    <p style={{ fontSize: '12px' }}>No shortfall bookings</p>
                    <small style={{ fontSize: '10px' }}>All bookings are fully realised</small>
                  </div>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Details Section */}
      <CCard className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <CCardBody className="p-0">
          <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>Booking Details</h6>
                <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Detailed booking information</p>
              </div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Total: {detailTable?.pagination?.total || 0} bookings</div>
            </div>
          </div>
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-hover mb-0" style={{ fontSize: '12px' }}>
              <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th className="border-0">Booking #</th>
                  <th className="border-0">Date</th>
                  <th className="border-0">Customer</th>
                  <th className="border-0">Branch</th>
                  <th className="border-0">Financer</th>
                  <th className="border-0 text-end">Proposed</th>
                  <th className="border-0 text-end">Actual</th>
                  <th className="border-0 text-end">Variance</th>
                  <th className="border-0 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {detailTable?.data?.length > 0 ? (
                  detailTable.data.map((booking) => {
                    const variance = (booking.actualAmount || 0) - (booking.proposedAmount || 0);
                    return (
                      <tr key={booking.bookingId} style={{ cursor: 'pointer' }} onClick={() => { setSelectedBooking(booking); setModalVisible(true); }}>
                        <td className="fw-semibold">{booking.bookingNumber}</td>
                        <td>{booking.formattedDate}</td>
                        <td>{booking.customerName}</td>
                        <td>{booking.branchName}</td>
                        <td>{booking.financerName}</td>
                        <td className="text-end">{formatCompactCurrency(booking.proposedAmount)}</td>
                        <td className="text-end">{formatCompactCurrency(booking.actualAmount)}</td>
                        <td className={`text-end ${variance > 0 ? 'text-success' : variance < 0 ? 'text-danger' : 'text-muted'}`}>
                          {variance > 0 ? '+' : ''}{formatCompactCurrency(variance)}
                        </td>
                        <td className="text-center">
                          <CBadge color={booking.status === 'FULLY_REALISED' ? 'success' : 'warning'} className="rounded-pill px-2" style={{ fontSize: '9px' }}>
                            {booking.status?.replace('_', ' ') || 'N/A'}
                          </CBadge>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-5">No booking details available</td>
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

      {/* Booking Details Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" alignment="center">
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>Booking Details: {selectedBooking?.bookingNumber}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBooking && (
            <div className="p-2">
              <CRow className="g-3">
                <CCol md={6}>
                  <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
                    <small className="text-muted d-block mb-1">Customer Information</small>
                    <p className="mb-1"><strong>Name:</strong> {selectedBooking.customerName}</p>
                    <p className="mb-1"><strong>Mobile:</strong> {selectedBooking.mobile1 || 'N/A'}</p>
                    <p className="mb-0"><strong>Branch:</strong> {selectedBooking.branchName}</p>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
                    <small className="text-muted d-block mb-1">Financial Information</small>
                    <p className="mb-1"><strong>Proposed Amount:</strong> {formatCurrency(selectedBooking.proposedAmount)}</p>
                    <p className="mb-1"><strong>Actual Amount:</strong> {formatCurrency(selectedBooking.actualAmount)}</p>
                    <p className="mb-0"><strong>Shortfall:</strong> {formatCurrency(selectedBooking.shortfall || 0)}</p>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
                    <small className="text-muted d-block mb-1">Booking Information</small>
                    <p className="mb-1"><strong>Booking Date:</strong> {selectedBooking.formattedDate}</p>
                    <p className="mb-1"><strong>Status:</strong> {selectedBooking.status}</p>
                    <p className="mb-0"><strong>Financer:</strong> {selectedBooking.financerName}</p>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="p-2 rounded" style={{ background: '#f8fafc' }}>
                    <small className="text-muted d-block mb-1">GC Information</small>
                    <p className="mb-1"><strong>GC Applicable:</strong> {selectedBooking.gcApplicable ? 'Yes' : 'No'}</p>
                    <p className="mb-1"><strong>Proposed GC:</strong> {formatCurrency(selectedBooking.proposedGCAmount)}</p>
                    <p className="mb-0"><strong>Actual GC:</strong> {formatCurrency(selectedBooking.actualGCAmount)}</p>
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

export default FinanceReportDashboard;