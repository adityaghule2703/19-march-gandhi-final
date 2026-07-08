// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spinner, Alert, Table, Badge, ProgressBar } from 'react-bootstrap';
// import { FiDollarSign, FiPieChart, FiTrendingUp, FiTrendingDown, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
// import axiosInstance from '../../axiosInstance';
// import '../../css/dashboard.css';

// // Import permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const AccountDashboard = () => {
//   const [bookingData, setBookingData] = useState(null);
//   const [financialData, setFinancialData] = useState(null);
//   const [loading, setLoading] = useState({ bookings: true, financials: true });
//   const [error, setError] = useState({ bookings: null, financials: null });

//   const { permissions } = useAuth();

//   // Page-level permission check for Account Dashboard under ACCOUNT module
//   const canViewAccountDashboard = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DASHBOARD);

//   useEffect(() => {
//     if (!canViewAccountDashboard) {
//       return;
//     }

//     const fetchBookingCounts = async () => {
//       try {
//         const response = await axiosInstance.get('ledger/booking-counts');
//         if (response.data.status === 'success') {
//           setBookingData(response.data.data);
//         } else {
//           setError((prev) => ({ ...prev, bookings: 'Failed to load booking data' }));
//         }
//       } catch (err) {
//         setError((prev) => ({ ...prev, bookings: err.message || 'Failed to fetch booking data' }));
//       } finally {
//         setLoading((prev) => ({ ...prev, bookings: false }));
//       }
//     };

//     fetchBookingCounts();
//   }, [canViewAccountDashboard]);

//   useEffect(() => {
//     if (!canViewAccountDashboard) {
//       return;
//     }

//     const fetchFinancialSummary = async () => {
//       try {
//         const response = await axiosInstance.get('ledger/summary/branch');
//         if (response.data.status === 'success') {
//           setFinancialData(response.data.data);
//         } else {
//           setError((prev) => ({ ...prev, financials: 'Failed to load financial data' }));
//         }
//       } catch (err) {
//         setError((prev) => ({ ...prev, financials: err.message || 'Failed to fetch financial data' }));
//       } finally {
//         setLoading((prev) => ({ ...prev, financials: false }));
//       }
//     };

//     fetchFinancialSummary();
//   }, [canViewAccountDashboard]);

//   // Calculate completion rate
//   const completionRate = bookingData ? (bookingData.completedBookings / bookingData.totalBookings) * 100 : 0;

//   const isLoading = (key) => loading[key] && !error[key];
//   const hasError = (key) => error[key] && !loading[key];
//   const isOverallLoading = loading.bookings || loading.financials;

//   if (!canViewAccountDashboard) {
//     return (
//       <div className="account-dashboard">
//         <Row className="mb-4">
//           <Col md={12}>
//             <Alert variant="danger" className="my-3 border-0 shadow-sm">
//               <div className="d-flex align-items-center">
//                 <FiAlertCircle className="me-2" />
//                 <strong>Access Denied:</strong> You do not have permission to view the Account Dashboard.
//               </div>
//             </Alert>
//           </Col>
//         </Row>
//       </div>
//     );
//   }

//   if (isOverallLoading && (!bookingData && !financialData)) {
//     return (
//       <div className="account-dashboard">
//         <Row className="mb-4">
//           <Col md={12}>
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" size="lg" />
//               <p className="mt-3 text-muted">Loading dashboard data...</p>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     );
//   }

//   return (
//     <div className="account-dashboard">
//       <Row className="mb-4">
//         <Col md={12}>
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h2 className="fw-bold text-dark mb-1">PF/NPF Account Dashboard</h2>
//               <p className="text-muted mb-0">Financial overview and application status</p>
//             </div>
//             {(!canViewAccountDashboard) && (
//               <Badge bg="warning" text="dark" className="px-3 py-2">
//                 <FiAlertCircle className="me-1" /> Limited Access
//               </Badge>
//             )}
//           </div>
//         </Col>
//       </Row>

//       {hasError('bookings') && (
//         <Alert variant="danger" className="my-3 border-0 shadow-sm">
//           <div className="d-flex align-items-center">
//             <FiTrendingDown className="me-2" />
//             <strong>Booking Data Error:</strong> {error.bookings}
//           </div>
//         </Alert>
//       )}
//       {hasError('financials') && (
//         <Alert variant="danger" className="my-3 border-0 shadow-sm">
//           <div className="d-flex align-items-center">
//             <FiTrendingDown className="me-2" />
//             <strong>Financial Data Error:</strong> {error.financials}
//           </div>
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col md={4} className="mb-4">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Total PF/NPF Applications</h6>
//                   <h2 className="fw-bold text-dark mb-0">
//                     {isLoading('bookings') ? (
//                       <Spinner animation="border" size="sm" />
//                     ) : (
//                       bookingData?.totalBookings?.toLocaleString() || 0
//                     )}
//                   </h2>
//                 </div>
//                 <div className="metric-icon bg-primary bg-opacity-10 p-3 rounded-circle">
//                   <FiUsers size={20} className="text-primary" />
//                 </div>
//               </div>

//               <div className="metric-breakdown">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <span className="text-muted small">PF Applications</span>
//                   <Badge bg="primary" className="px-2 py-1">
//                     {bookingData?.pfBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <span className="text-muted small">NPF Applications</span>
//                   <Badge bg="secondary" className="px-2 py-1">
//                     {bookingData?.npfBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <span className="text-muted small">Completion Rate</span>
//                   <div className="text-end">
//                     <div className="fw-semibold text-success">{completionRate.toFixed(1)}%</div>
//                     <ProgressBar 
//                       now={completionRate} 
//                       variant="success" 
//                       className="mt-1" 
//                       style={{ height: '4px', width: '80px' }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={4} className="mb-4">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h2 className={`fw-bold mb-0 ${(financialData?.allBranches?.finalBalance || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
//                     {isLoading('financials') ? (
//                       <Spinner animation="border" size="sm" />
//                     ) : (
//                       `₹${(financialData?.allBranches?.finalBalance || 0).toLocaleString()}`
//                     )}
//                   </h2>
//                   <p className="text-muted small mb-0">Net Balance</p>
//                 </div>
//                 <div className="metric-icon bg-success bg-opacity-10 p-3 rounded-circle">
//                   <FiDollarSign size={20} className="text-success" />
//                 </div>
//               </div>

//               <div className="financial-details mt-4">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <div>
//                     <span className="text-muted small">Total Credit</span>
//                     <div className="fw-bold text-success">
//                       {isLoading('financials') ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         `₹${(financialData?.allBranches?.totalCredit || 0).toLocaleString()}`
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <span className="text-muted small">Total Debit</span>
//                     <div className="fw-bold text-danger">
//                       {isLoading('financials') ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         `₹${(financialData?.allBranches?.totalDebit || 0).toLocaleString()}`
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="d-flex align-items-center mt-3">
//                   {(financialData?.allBranches?.finalBalance || 0) >= 0 ? (
//                     <FiTrendingUp className="text-success me-2" />
//                   ) : (
//                     <FiTrendingDown className="text-danger me-2" />
//                   )}
//                   <span className="small text-muted">
//                     {(financialData?.allBranches?.finalBalance || 0) >= 0 ? 'Positive' : 'Negative'} Balance
//                   </span>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={4} className="mb-4">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Application Status</h6>
//                   <div className="d-flex align-items-center">
//                     <FiCheckCircle className="text-success me-2" />
//                     <span className="fw-bold text-dark">{bookingData?.completedBookings || 0}</span>
//                     <span className="text-muted small ms-1">Completed</span>
//                   </div>
//                 </div>
//                 <div className="metric-icon bg-info bg-opacity-10 p-3 rounded-circle">
//                   <FiPieChart size={20} className="text-info" />
//                 </div>
//               </div>

//               <div className="status-breakdown mt-4">
//                 <div className="status-item d-flex justify-content-between align-items-center mb-3">
//                   <div className="d-flex align-items-center">
//                     <div className="status-indicator bg-warning me-2"></div>
//                     <span className="text-muted small">Draft</span>
//                   </div>
//                   <Badge bg="warning" text="dark" className="px-2 py-1">
//                     {bookingData?.draftBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="status-item d-flex justify-content-between align-items-center mb-3">
//                   <div className="d-flex align-items-center">
//                     <div className="status-indicator bg-danger me-2"></div>
//                     <span className="text-muted small">Rejected</span>
//                   </div>
//                   <Badge bg="danger" className="px-2 py-1">
//                     {bookingData?.rejectedBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="status-item d-flex justify-content-between align-items-center">
//                   <div className="d-flex align-items-center">
//                     <div className="status-indicator bg-success me-2"></div>
//                     <span className="text-muted small">In Progress</span>
//                   </div>
//                   <Badge bg="success" className="px-2 py-1">
//                     {((bookingData?.totalBookings || 0) - 
//                       (bookingData?.completedBookings || 0) - 
//                       (bookingData?.draftBookings || 0) - 
//                       (bookingData?.rejectedBookings || 0)).toLocaleString()}
//                   </Badge>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {financialData?.byBranch?.length > 0 && (
//         <Row>
//           <Col md={12}>
//             <Card className="border-0 shadow-sm">
//               <Card.Body className="p-4">
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                   <h5 className="card-title mb-0 fw-bold">Branch-wise Financial Summary</h5>
//                   <Badge bg="light" text="dark" className="px-3 py-2">
//                     {financialData.byBranch.length} Branches
//                   </Badge>
//                 </div>
//                 <div className="table-responsive">
//                   <Table hover className="table-borderless">
//                     <thead className="table-light">
//                       <tr>
//                         <th className="border-0 ps-4">Branch Name</th>
//                         <th className="border-0 text-end">Total Debit</th>
//                         <th className="border-0 text-end">Total Credit</th>
//                         <th className="border-0 text-end pe-4">Balance</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {financialData.byBranch.map((branch, index) => (
//                         <tr key={index} className="border-bottom">
//                           <td className="ps-4 py-3 fw-semibold">{branch.branchName || 'Unnamed Branch'}</td>
//                           <td className="text-end text-danger fw-semibold">
//                             ₹{branch.totalDebit?.toLocaleString() || '0'}
//                           </td>
//                           <td className="text-end text-success fw-semibold">
//                             ₹{branch.totalCredit?.toLocaleString() || '0'}
//                           </td>
//                           <td className={`text-end pe-4 fw-bold ${(branch.finalBalance || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
//                             ₹{(branch.finalBalance || 0).toLocaleString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {(!bookingData && !financialData && !isOverallLoading) && (
//         <Row>
//           <Col md={12}>
//             <Alert variant="info" className="my-3 border-0 shadow-sm">
//               <div className="d-flex align-items-center">
//                 <FiAlertCircle className="me-2" />
//                 <div>
//                   <strong>No Data Available</strong>
//                   <p className="mb-0">No dashboard data is currently available. Data will appear once applications are processed.</p>
//                 </div>
//               </div>
//             </Alert>
//           </Col>
//         </Row>
//       )}
//     </div>
//   );
// };

// export default AccountDashboard;








// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spinner, Alert, Table, Badge, ProgressBar } from 'react-bootstrap';
// import { FiDollarSign, FiPieChart, FiTrendingUp, FiTrendingDown, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
// import axiosInstance from '../../axiosInstance';
// import '../../css/dashboard.css';

// // Import permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage 
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const AccountDashboard = () => {
//   const [bookingData, setBookingData] = useState(null);
//   const [financialData, setFinancialData] = useState(null);
//   const [loading, setLoading] = useState({ bookings: true, financials: true });
//   const [error, setError] = useState({ bookings: null, financials: null });

//   const { permissions } = useAuth();

//   // Get user data from localStorage (consistent with other components)
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const branchId = storedUser.branch?._id;
//   const userRole = localStorage.getItem('userRole') || 
//                    (storedUser.roles?.[0]?.name || '').toUpperCase();

//   // Check if user is SUPERADMIN
//   const isSuperAdmin = userRole === 'SUPERADMIN' || 
//                        (storedUser.roles?.[0]?.isSuperAdmin === true);

//   // Page-level permission check for Account Dashboard under ACCOUNT module
//   const canViewAccountDashboard = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DASHBOARD);

//   useEffect(() => {
//     if (!canViewAccountDashboard) {
//       return;
//     }

//     const fetchBookingCounts = async () => {
//       try {
//         let url = 'ledger/booking-counts';

//         // Add branch filter for non-super admins
//         if (!isSuperAdmin && branchId) {
//           url += `?branchId=${branchId}`;
//         }

//         const response = await axiosInstance.get(url);
//         if (response.data.status === 'success') {
//           setBookingData(response.data.data);
//         } else {
//           setError((prev) => ({ ...prev, bookings: 'Failed to load booking data' }));
//         }
//       } catch (err) {
//         setError((prev) => ({ ...prev, bookings: err.message || 'Failed to fetch booking data' }));
//       } finally {
//         setLoading((prev) => ({ ...prev, bookings: false }));
//       }
//     };

//     fetchBookingCounts();
//   }, [canViewAccountDashboard, isSuperAdmin, branchId]);

//   useEffect(() => {
//     if (!canViewAccountDashboard) {
//       return;
//     }

//     const fetchFinancialSummary = async () => {
//       try {
//         let url = 'ledger/summary/branch';

//         const response = await axiosInstance.get(url);
//         if (response.data.status === 'success') {
//           let financialData = response.data.data;

//           // For non-super admins, filter to show only their branch data
//           if (!isSuperAdmin && branchId && financialData?.byBranch) {
//             // Find user's branch data
//             const userBranchData = financialData.byBranch.find(branch => 
//               branch.branchId === branchId || 
//               branch._id === branchId ||
//               (branch.branchName && storedUser.branch?.name && branch.branchName === storedUser.branch.name)
//             );

//             // If user's branch exists in the data, show only that
//             if (userBranchData) {
//               setFinancialData({
//                 ...financialData,
//                 byBranch: [userBranchData], // Only show user's branch
//                 allBranches: {
//                   totalDebit: userBranchData.totalDebit || 0,
//                   totalCredit: userBranchData.totalCredit || 0,
//                   finalBalance: userBranchData.finalBalance || 0
//                 }
//               });
//             } else {
//               // If user's branch not found in the data, show empty data
//               setFinancialData({
//                 ...financialData,
//                 byBranch: [],
//                 allBranches: {
//                   totalDebit: 0,
//                   totalCredit: 0,
//                   finalBalance: 0
//                 }
//               });
//             }
//           } else {
//             // For super admin, show all data as is
//             setFinancialData(financialData);
//           }
//         } else {
//           setError((prev) => ({ ...prev, financials: 'Failed to load financial data' }));
//         }
//       } catch (err) {
//         setError((prev) => ({ ...prev, financials: err.message || 'Failed to fetch financial data' }));
//       } finally {
//         setLoading((prev) => ({ ...prev, financials: false }));
//       }
//     };

//     fetchFinancialSummary();
//   }, [canViewAccountDashboard, isSuperAdmin, branchId]);

//   // Calculate completion rate
//   const completionRate = bookingData && bookingData.totalBookings > 0 ? 
//     (bookingData.completedBookings / bookingData.totalBookings) * 100 : 0;

//   const isLoading = (key) => loading[key] && !error[key];
//   const hasError = (key) => error[key] && !loading[key];
//   const isOverallLoading = loading.bookings || loading.financials;

//   if (!canViewAccountDashboard) {
//     return (
//       <div className="account-dashboard">
//         <Row className="mb-4">
//           <Col md={12}>
//             <Alert variant="danger" className="my-3 border-0 shadow-sm">
//               <div className="d-flex align-items-center">
//                 <FiAlertCircle className="me-2" />
//                 <strong>Access Denied:</strong> You do not have permission to view the Account Dashboard.
//               </div>
//             </Alert>
//           </Col>
//         </Row>
//       </div>
//     );
//   }

//   if (isOverallLoading && (!bookingData && !financialData)) {
//     return (
//       <div className="account-dashboard">
//         <Row className="mb-4">
//           <Col md={12}>
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" size="lg" />
//               <p className="mt-3 text-muted">Loading dashboard data...</p>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     );
//   }

//   return (
//     <div className="account-dashboard">
//       <Row className="mb-4">
//         <Col md={12}>
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h2 className="fw-bold text-dark mb-1">PF/NPF Account Dashboard</h2>
//               <p className="text-muted mb-0">Financial overview and application status</p>
//             </div>

//           </div>
//         </Col>
//       </Row>



//       {hasError('bookings') && (
//         <Alert variant="danger" className="my-3 border-0 shadow-sm">
//           <div className="d-flex align-items-center">
//             <FiTrendingDown className="me-2" />
//             <strong>Booking Data Error:</strong> {error.bookings}
//           </div>
//         </Alert>
//       )}
//       {hasError('financials') && (
//         <Alert variant="danger" className="my-3 border-0 shadow-sm">
//           <div className="d-flex align-items-center">
//             <FiTrendingDown className="me-2" />
//             <strong>Financial Data Error:</strong> {error.financials}
//           </div>
//         </Alert>
//       )}

//       <Row className="mb-4">
//         <Col md={4} className="mb-4">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2 fw-semibold small">
//                     {isSuperAdmin ? 'Total PF/NPF Applications' : 'Your Branch Applications'}
//                   </h6>
//                   <h2 className="fw-bold text-dark mb-0">
//                     {isLoading('bookings') ? (
//                       <Spinner animation="border" size="sm" />
//                     ) : (
//                       bookingData?.totalBookings?.toLocaleString() || 0
//                     )}
//                   </h2>
//                 </div>
//                 <div className="metric-icon bg-primary bg-opacity-10 p-3 rounded-circle">
//                   <FiUsers size={20} className="text-primary" />
//                 </div>
//               </div>

//               <div className="metric-breakdown">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <span className="text-muted small">PF Applications</span>
//                   <Badge bg="primary" className="px-2 py-1">
//                     {bookingData?.pfBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <span className="text-muted small">NPF Applications</span>
//                   <Badge bg="secondary" className="px-2 py-1">
//                     {bookingData?.npfBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <span className="text-muted small">Completion Rate</span>
//                   <div className="text-end">
//                     <div className="fw-semibold text-success">{completionRate.toFixed(1)}%</div>
//                     <ProgressBar 
//                       now={completionRate} 
//                       variant="success" 
//                       className="mt-1" 
//                       style={{ height: '4px', width: '80px' }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={4} className="mb-4">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h2 className={`fw-bold mb-0 ${(financialData?.allBranches?.finalBalance || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
//                     {isLoading('financials') ? (
//                       <Spinner animation="border" size="sm" />
//                     ) : (
//                       `₹${(financialData?.allBranches?.finalBalance || 0).toLocaleString()}`
//                     )}
//                   </h2>
//                   <p className="text-muted small mb-0">
//                     {isSuperAdmin ? 'Overall Net Balance' : 'Branch Net Balance'}
//                   </p>
//                 </div>
//                 <div className="metric-icon bg-success bg-opacity-10 p-3 rounded-circle">
//                   <FiDollarSign size={20} className="text-success" />
//                 </div>
//               </div>

//               <div className="financial-details mt-4">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <div>
//                     <span className="text-muted small">Total Credit</span>
//                     <div className="fw-bold text-success">
//                       {isLoading('financials') ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         `₹${(financialData?.allBranches?.totalCredit || 0).toLocaleString()}`
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <span className="text-muted small">Total Debit</span>
//                     <div className="fw-bold text-danger">
//                       {isLoading('financials') ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         `₹${(financialData?.allBranches?.totalDebit || 0).toLocaleString()}`
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="d-flex align-items-center mt-3">
//                   {(financialData?.allBranches?.finalBalance || 0) >= 0 ? (
//                     <FiTrendingUp className="text-success me-2" />
//                   ) : (
//                     <FiTrendingDown className="text-danger me-2" />
//                   )}
//                   <span className="small text-muted">
//                     {(financialData?.allBranches?.finalBalance || 0) >= 0 ? 'Positive' : 'Negative'} Balance
//                   </span>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={4} className="mb-4">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Application Status</h6>
//                   <div className="d-flex align-items-center">
//                     <FiCheckCircle className="text-success me-2" />
//                     <span className="fw-bold text-dark">{bookingData?.completedBookings || 0}</span>
//                     <span className="text-muted small ms-1">Completed</span>
//                   </div>
//                 </div>
//                 <div className="metric-icon bg-info bg-opacity-10 p-3 rounded-circle">
//                   <FiPieChart size={20} className="text-info" />
//                 </div>
//               </div>

//               <div className="status-breakdown mt-4">
//                 <div className="status-item d-flex justify-content-between align-items-center mb-3">
//                   <div className="d-flex align-items-center">
//                     <div className="status-indicator bg-warning me-2"></div>
//                     <span className="text-muted small">Draft</span>
//                   </div>
//                   <Badge bg="warning" text="dark" className="px-2 py-1">
//                     {bookingData?.draftBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="status-item d-flex justify-content-between align-items-center mb-3">
//                   <div className="d-flex align-items-center">
//                     <div className="status-indicator bg-danger me-2"></div>
//                     <span className="text-muted small">Rejected</span>
//                   </div>
//                   <Badge bg="danger" className="px-2 py-1">
//                     {bookingData?.rejectedBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="status-item d-flex justify-content-between align-items-center">
//                   <div className="d-flex align-items-center">
//                     <div className="status-indicator bg-success me-2"></div>
//                     <span className="text-muted small">In Progress</span>
//                   </div>
//                   <Badge bg="success" className="px-2 py-1">
//                     {((bookingData?.totalBookings || 0) - 
//                       (bookingData?.completedBookings || 0) - 
//                       (bookingData?.draftBookings || 0) - 
//                       (bookingData?.rejectedBookings || 0)).toLocaleString()}
//                   </Badge>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {financialData?.byBranch?.length > 0 && (
//         <Row>
//           <Col md={12}>
//             <Card className="border-0 shadow-sm">
//               <Card.Body className="p-4">
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                   <h5 className="card-title mb-0 fw-bold">
//                     {isSuperAdmin ? 'Branch-wise Financial Summary' : 'Branch Financial Summary'}
//                   </h5>
//                   <Badge bg="light" text="dark" className="px-3 py-2">
//                     {financialData.byBranch.length} {financialData.byBranch.length === 1 ? 'Branch' : 'Branches'}
//                   </Badge>
//                 </div>
//                 <div className="table-responsive">
//                   <Table hover className="table-borderless">
//                     <thead className="table-light">
//                       <tr>
//                         <th className="border-0 ps-4">Branch Name</th>
//                         <th className="border-0 text-end">Total Debit</th>
//                         <th className="border-0 text-end">Total Credit</th>
//                         <th className="border-0 text-end pe-4">Balance</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {financialData.byBranch.map((branch, index) => (
//                         <tr key={index} className="border-bottom">
//                           <td className="ps-4 py-3 fw-semibold">{branch.branchName || 'Unnamed Branch'}</td>
//                           <td className="text-end text-danger fw-semibold">
//                             ₹{branch.totalDebit?.toLocaleString() || '0'}
//                           </td>
//                           <td className="text-end text-success fw-semibold">
//                             ₹{branch.totalCredit?.toLocaleString() || '0'}
//                           </td>
//                           <td className={`text-end pe-4 fw-bold ${(branch.finalBalance || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
//                             ₹{(branch.finalBalance || 0).toLocaleString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {(!bookingData && !financialData && !isOverallLoading) && (
//         <Row>
//           <Col md={12}>
//             <Alert variant="info" className="my-3 border-0 shadow-sm">
//               <div className="d-flex align-items-center">
//                 <FiAlertCircle className="me-2" />
//                 <div>
//                   <strong>No Data Available</strong>
//                   <p className="mb-0">
//                     {isSuperAdmin 
//                       ? 'No dashboard data is currently available. Data will appear once applications are processed.' 
//                       : 'No data available for your branch. Data will appear once applications are processed.'}
//                   </p>
//                 </div>
//               </div>
//             </Alert>
//           </Col>
//         </Row>
//       )}
//     </div>
//   );
// };

// export default AccountDashboard;





// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spinner, Alert, Table, Badge, ProgressBar } from 'react-bootstrap';
// import {
//     FiDollarSign,
//     FiPieChart,
//     FiTrendingUp,
//     FiTrendingDown,
//     FiUsers,
//     FiCheckCircle,
//     FiAlertCircle,
//     FiCalendar,
//     FiClock,
//     FiFilter,
//     FiBarChart2,
//     FiList,
//     FiFileText,
//     FiTruck
// } from 'react-icons/fi';
// import axiosInstance from '../../axiosInstance';
// import '../../css/dashboard.css';
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     ResponsiveContainer,
//     Legend,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid
// } from 'recharts';

// const OutstandingDashboard = () => {
//         const [dashboardData, setDashboardData] = useState(null);
//         const [loading, setLoading] = useState(true);
//         const [error, setError] = useState(null);
//         const [filters, setFilters] = useState({
//             modelType: 'EV',
//             branchId: ''
//         });
//         const [availableBranches, setAvailableBranches] = useState([]);

//         // Get user data from localStorage
//         const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

//         const userRole =
//             localStorage.getItem('userRole') ||
//             (storedUser.roles?.[0]?.name || '').toUpperCase();

//         const isSuperAdmin =
//             userRole === 'SUPERADMIN' ||
//             (storedUser.roles?.[0]?.isSuperAdmin === true);

//         const defaultBranchId = storedUser.branch?._id || '';

//         // Fetch dashboard data
//         const fetchDashboardData = async() => {
//                 setLoading(true);
//                 setError(null);

//                 try {
//                     const params = new URLSearchParams();
//                     if (filters.modelType && filters.modelType !== 'ALL') params.append('modelType', filters.modelType);
//                     if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);

//                     const url = `/finance/outstanding-dashboard${params.toString() ? `?${params.toString()}` : ''}`;
//                     const response = await axiosInstance.get(url);

//                     if (response.data.success) {
//                         setDashboardData(response.data);
//                         setAvailableBranches(response.data.availableBranches || []);
//                     } else {
//                         setError('Failed to load dashboard data');
//                     }
//                 } catch (err) {
//       console.error('Error fetching outstanding dashboard:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize branch filter based on user role
//   useEffect(() => {
//     if (!isSuperAdmin && defaultBranchId) {
//       setFilters(prev => ({ ...prev, branchId: defaultBranchId }));
//     }
//   }, [isSuperAdmin, defaultBranchId]);

//   // Fetch data when filters change
//   useEffect(() => {
//     fetchDashboardData();
//   }, [filters.modelType, filters.branchId]);

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     if (amount === undefined || amount === null) return '₹0';
//     return `₹${amount.toLocaleString('en-IN')}`;
//   };

//   // Get badge color for aging bucket
//   const getAgingBadgeColor = (bucket) => {
//     switch(bucket) {
//       case '0-30': return 'success';
//       case '31-60': return 'warning';
//       case '61-90': return 'danger';
//       case '90+': return 'dark';
//       default: return 'secondary';
//     }
//   };

//   const CHART_COLORS = ['#28a745', '#ffc107', '#dc3545', '#343a40', '#17a2b8'];

// const PAYMENT_COLORS = {
//   CASH: '#28a745',
//   FINANCE: '#17a2b8'
// };

//   // Get status badge color
//   const getStatusBadgeColor = (status) => {
//     if (status?.includes('PENDING_APPROVAL')) return 'warning';
//     if (status?.includes('ALLOCATED')) return 'info';
//     if (status?.includes('REJECTED')) return 'danger';
//     if (status?.includes('COMPLETED')) return 'success';
//     return 'secondary';
//   };

//   if (loading && !dashboardData) {
//     return (
//       <div className="outstanding-dashboard">
//         <Row className="mb-4">
//           <Col md={12}>
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" size="lg" />
//               <p className="mt-3 text-muted">Loading outstanding dashboard...</p>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="outstanding-dashboard">
//         <Row className="mb-4">
//           <Col md={12}>
//             <Alert variant="danger" className="my-3 border-0 shadow-sm">
//               <div className="d-flex align-items-center">
//                 <FiAlertCircle className="me-2" size={20} />
//                 <div>
//                   <strong>Error Loading Dashboard:</strong>
//                   <p className="mb-0">{error}</p>
//                 </div>
//               </div>
//             </Alert>
//           </Col>
//         </Row>
//       </div>
//     );
//   }

//   const { summaryCards, agingDistribution, paymentTypeSplit, statusWiseSplit, monthlyTrend, topOutstandingBookings, userAccessInfo } = dashboardData || {};

//   return (
//     <div className="outstanding-dashboard">
//       {/* Header Section */}
//       <Row className="mb-4">
//         <Col md={12}>
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h2 className="fw-bold text-dark mb-1">EV Outstanding Dashboard</h2>
//               <p className="text-muted mb-0">
//                 Track outstanding payments, aging analysis, and collection efficiency
//                 {userAccessInfo?.userBranch?.name && (
//                   <span className="ms-2 text-primary">• {userAccessInfo.userBranch.name}</span>
//                 )}
//               </p>
//             </div>
            
//             {/* Filters */}
//             <div className="d-flex gap-3 align-items-center">
//               <div className="d-flex align-items-center gap-2">
//                 <FiFilter className="text-muted" />
//                 <select 
//                   className="form-select form-select-sm"
//                   value={filters.modelType}
//                   onChange={(e) => handleFilterChange('modelType', e.target.value)}
//                   style={{ width: '120px' }}
//                 >
//                   <option value="EV">EV Only</option>
//                   <option value="ALL">All Models</option>
//                   <option value="ICE">ICE Only</option>
//                 </select>
//               </div>
              
//               {isSuperAdmin && (
//                 <select 
//                   className="form-select form-select-sm"
//                   value={filters.branchId}
//                   onChange={(e) => handleFilterChange('branchId', e.target.value)}
//                   style={{ width: '200px' }}
//                 >
//                   <option value="all">All Branches</option>
//                   {availableBranches.filter(b => b._id !== 'all').map(branch => (
//                     <option key={branch._id} value={branch._id}>{branch.name}</option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           </div>
//         </Col>
//       </Row>

//       {/* Summary Cards */}
//       <Row className="mb-4">
//         <Col md={3} className="mb-3">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Outstanding Bookings</h6>
//                   <h2 className="fw-bold text-primary mb-0">
//                     {summaryCards?.outstandingBookingsCount || 0}
//                   </h2>
//                 </div>
//                 <div className="metric-icon bg-primary bg-opacity-10 p-3 rounded-circle">
//                   <FiFileText size={20} className="text-primary" />
//                 </div>
//               </div>
//               <div className="small text-muted">
//                 Fully Paid: {summaryCards?.fullyPaidBookingsCount || 0}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3} className="mb-3">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Total Deal Amount</h6>
//                   <h2 className="fw-bold text-dark mb-0">
//                     {formatCurrency(summaryCards?.totalDealAmount)}
//                   </h2>
//                 </div>
//                 <div className="metric-icon bg-success bg-opacity-10 p-3 rounded-circle">
//                   <FiDollarSign size={20} className="text-success" />
//                 </div>
//               </div>
//               <div className="small text-muted">
//                 Received: {formatCurrency(summaryCards?.totalReceivedAmount)}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3} className="mb-3">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Balance Amount</h6>
//                   <h2 className="fw-bold text-warning mb-0">
//                     {formatCurrency(summaryCards?.totalBalanceAmount)}
//                   </h2>
//                 </div>
//                 <div className="metric-icon bg-warning bg-opacity-10 p-3 rounded-circle">
//                   <FiTrendingUp size={20} className="text-warning" />
//                 </div>
//               </div>
//               <div className="small text-muted">
//                 Pending: {formatCurrency(summaryCards?.totalPendingAmount)}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={3} className="mb-3">
//           <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Collection Efficiency</h6>
//                   <h2 className={`fw-bold mb-0 ${(summaryCards?.collectionEfficiency || 0) >= 50 ? 'text-success' : 'text-danger'}`}>
//                     {summaryCards?.collectionEfficiency?.toFixed(1) || 0}%
//                   </h2>
//                 </div>
//                 <div className="metric-icon bg-info bg-opacity-10 p-3 rounded-circle">
//                   <FiBarChart2 size={20} className="text-info" />
//                 </div>
//               </div>
//               <ProgressBar 
//                 now={summaryCards?.collectionEfficiency || 0} 
//                 variant={summaryCards?.collectionEfficiency >= 50 ? 'success' : 'danger'}
//                 className="mt-2"
//                 style={{ height: '6px' }}
//               />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Aging Distribution & Payment Type Split */}
//       <Row className="mb-4">
//         <Col md={6} className="mb-3">
//           <Card className="border-0 shadow-sm h-100">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h5 className="fw-bold mb-0">Aging Distribution</h5>
//                 <FiClock className="text-muted" />
//               </div>
//               {agingDistribution && agingDistribution.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={agingDistribution}
//                       dataKey="balanceAmount"
//                       nameKey="bucket"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
//                       label={({ bucket, percent }) => `${bucket}: ${(percent * 100).toFixed(0)}%`}
//                     >
//                       <Cell fill="#28a745" />
//                       <Cell fill="#ffc107" />
//                       <Cell fill="#dc3545" />
//                       <Cell fill="#343a40" />
//                     </Pie>
//                     <Tooltip 
//                       formatter={(value) => formatCurrency(value)}
//                       contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }}
//                     />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="text-center text-muted py-4">
//                   <p>No aging data available</p>
//                 </div>
//               )}
//               <div className="mt-3 pt-3 border-top">
//                 <small className="text-muted d-block mb-2 fw-semibold">Breakdown:</small>
//                 {agingDistribution?.map((item, idx) => (
//                   <div key={idx} className="d-flex justify-content-between align-items-center mb-2 small">
//                     <span>
//                       <Badge bg={getAgingBadgeColor(item.bucket)} className="me-2">
//                         {item.bucket} Days
//                       </Badge>
//                       ({item.bookingCount} bookings)
//                     </span>
//                     <strong>{formatCurrency(item.balanceAmount)}</strong>
//                   </div>
//                 ))}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={6} className="mb-3">
//           <Card className="border-0 shadow-sm h-100">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h5 className="fw-bold mb-0">Payment Type Split</h5>
//                 <FiPieChart className="text-muted" />
//               </div>
//               {paymentTypeSplit && paymentTypeSplit.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={paymentTypeSplit}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
//                     <XAxis dataKey="bookingType" />
//                     <YAxis 
//                       tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
//                     />
//                     <Tooltip 
//                       formatter={(value) => formatCurrency(value)}
//                       contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }}
//                     />
//                     <Bar dataKey="balanceAmount" fill="#17a2b8" name="Balance" radius={[8, 8, 0, 0]} />
//                     <Bar dataKey="receivedAmount" fill="#28a745" name="Received" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="text-center text-muted py-4">
//                   <p>No payment data available</p>
//                 </div>
//               )}
//               <div className="mt-3 pt-3 border-top">
//                 <small className="text-muted d-block mb-2 fw-semibold">Summary:</small>
//                 {paymentTypeSplit?.map((item, idx) => (
//                   <div key={idx} className="mb-3">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <div>
//                         <Badge bg={item.bookingType === 'CASH' ? 'success' : 'info'} className="me-2">
//                           {item.bookingType}
//                         </Badge>
//                         <span className="text-muted small">({item.bookingCount} bookings)</span>
//                       </div>
//                     </div>
//                     <div className="small text-muted">
//                       <div className="d-flex justify-content-between mb-1">
//                         <span>Balance:</span>
//                         <strong className="text-dark">{formatCurrency(item.balanceAmount)}</strong>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span>Received:</span>
//                         <strong className="text-success">{formatCurrency(item.receivedAmount)}</strong>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Status Wise Split */}
//       <Row className="mb-4">
//         <Col md={12}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h5 className="fw-bold mb-0">Status Wise Breakdown</h5>
//                 <FiList className="text-muted" />
//               </div>
//               <div className="table-responsive">
//                 <Table hover className="table-borderless">
//                   <thead className="table-light">
//                     <tr>
//                       <th className="border-0 ps-4">Status</th>
//                       <th className="border-0 text-center">Bookings</th>
//                       <th className="border-0 text-end">Deal Amount</th>
//                       <th className="border-0 text-end">Received</th>
//                       <th className="border-0 text-end pe-4">Balance</th>
//                       <th className="border-0 text-center">Aging (0-30/31-60/61-90/90+)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {statusWiseSplit?.map((item, idx) => (
//                       <tr key={idx} className="border-bottom">
//                         <td className="ps-4 py-3">
//                           <Badge bg={getStatusBadgeColor(item.status)}>
//                             {item.status}
//                           </Badge>
//                         </td>
//                         <td className="text-center fw-semibold">{item.bookingCount}</td>
//                         <td className="text-end">{formatCurrency(item.dealAmount)}</td>
//                         <td className="text-end text-success">{formatCurrency(item.receivedAmount)}</td>
//                         <td className="text-end pe-4 text-warning fw-bold">{formatCurrency(item.balanceAmount)}</td>
//                         <td className="text-center">
//                           <div className="d-flex justify-content-center gap-2">
//                             <Badge bg="success">{item.agingBreakdown?.['0-30'] || 0}</Badge>
//                             <Badge bg="warning">{item.agingBreakdown?.['31-60'] || 0}</Badge>
//                             <Badge bg="danger">{item.agingBreakdown?.['61-90'] || 0}</Badge>
//                             <Badge bg="dark">{item.agingBreakdown?.['90+'] || 0}</Badge>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Monthly Trend */}
//       <Row className="mb-4">
//         <Col md={12}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h5 className="fw-bold mb-0">Monthly Collection Trend</h5>
//                 <FiTrendingUp className="text-muted" />
//               </div>
//               <div className="table-responsive">
//                 <Table hover className="table-borderless">
//                   <thead className="table-light">
//                     <tr>
//                       <th className="border-0 ps-4">Month</th>
//                       <th className="border-0 text-center">Bookings</th>
//                       <th className="border-0 text-end">Deal Amount</th>
//                       <th className="border-0 text-end">Received</th>
//                       <th className="border-0 text-end">Balance</th>
//                       <th className="border-0 text-end pe-4">Collection Efficiency</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {monthlyTrend?.map((item, idx) => (
//                       <tr key={idx} className="border-bottom">
//                         <td className="ps-4 py-3 fw-semibold">{item.label}</td>
//                         <td className="text-center">{item.bookingCount}</td>
//                         <td className="text-end">{formatCurrency(item.dealAmount)}</td>
//                         <td className="text-end text-success">{formatCurrency(item.receivedAmount)}</td>
//                         <td className="text-end text-warning">{formatCurrency(item.balanceAmount)}</td>
//                         <td className="text-end pe-4">
//                           <Badge bg={item.collectionEfficiency >= 90 ? 'success' : item.collectionEfficiency >= 50 ? 'warning' : 'danger'}>
//                             {item.collectionEfficiency?.toFixed(1)}%
//                           </Badge>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Top Outstanding Bookings */}
//       <Row className="mb-4">
//         <Col md={12}>
//           <Card className="border-0 shadow-sm">
//             <Card.Body className="p-4">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h5 className="fw-bold mb-0">Top Outstanding Bookings</h5>
//                 <span className="text-muted small">Total: {topOutstandingBookings?.length || 0} bookings with balance</span>
//               </div>
//               <div className="table-responsive">
//                 <Table hover className="table-borderless">
//                   <thead className="table-light">
//                     <tr>
//                       <th className="border-0 ps-4">Booking #</th>
//                       <th className="border-0">Customer</th>
//                       <th className="border-0">Model</th>
//                       <th className="border-0">Payment Type</th>
//                       <th className="border-0 text-end">Deal Amount</th>
//                       <th className="border-0 text-end">Received</th>
//                       <th className="border-0 text-end pe-4">Balance</th>
//                       <th className="border-0 text-center">Aging</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {topOutstandingBookings?.slice(0, 10).map((booking, idx) => (
//                       <tr key={idx} className="border-bottom">
//                         <td className="ps-4 py-3">
//                           <span className="fw-semibold">{booking.bookingNumber}</span>
//                           <br />
//                           <small className="text-muted">{booking.formattedBookingDate}</small>
//                         </td>
//                         <td>
//                           {booking.customerName}
//                           <br />
//                           <small className="text-muted">{booking.mobile1}</small>
//                         </td>
//                         <td className="text-truncate" style={{ maxWidth: '180px' }}>
//                           <small>{booking.model}</small>
//                         </td>
//                         <td>
//                           <Badge bg={booking.bookingType === 'CASH' ? 'success' : 'info'}>
//                             {booking.bookingType}
//                           </Badge>
//                           {booking.financierName && (
//                             <div><small className="text-muted">{booking.financierName}</small></div>
//                           )}
//                         </td>
//                         <td className="text-end">{formatCurrency(booking.dealAmount)}</td>
//                         <td className="text-end text-success">{formatCurrency(booking.totalReceivedAmount)}</td>
//                         <td className="text-end pe-4 text-warning fw-bold">{formatCurrency(booking.balanceAmount)}</td>
//                         <td className="text-center">
//                           <Badge bg={getAgingBadgeColor(booking.agingBucket)}>
//                             {booking.agingBucket} Days
//                           </Badge>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//               {topOutstandingBookings?.length === 0 && (
//                 <div className="text-center py-4 text-muted">
//                   <FiCheckCircle size={40} className="mb-2 text-success" />
//                   <p>No outstanding bookings found!</p>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Footer / Summary */}
//       <Row>
//         <Col md={12}>
//           <div className="text-center text-muted small py-3">
//             <FiTruck className="me-1" /> Data as of latest update | {summaryCards?.outstandingBookingsCount || 0} outstanding bookings | Total balance: {formatCurrency(summaryCards?.totalBalanceAmount)}
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default OutstandingDashboard;

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Table, Badge, ProgressBar } from 'react-bootstrap';
import {
    FiDollarSign,
    FiPieChart,
    FiTrendingUp,
    FiTrendingDown,
    FiUsers,
    FiCheckCircle,
    FiAlertCircle,
    FiCalendar,
    FiClock,
    FiFilter,
    FiBarChart2,
    FiList,
    FiFileText,
    FiTruck
} from 'react-icons/fi';
import axiosInstance from '../../axiosInstance';
import '../../css/dashboard.css';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

const OutstandingDashboard = () => {
        const [dashboardData, setDashboardData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [filters, setFilters] = useState({
            modelType: 'EV',
            branchId: '',
            fromDate: '',
            toDate: ''
        });
        const [availableBranches, setAvailableBranches] = useState([]);

        // Get user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        const userRole =
            localStorage.getItem('userRole') ||
            (storedUser.roles?.[0]?.name || '').toUpperCase();

        const isSuperAdmin =
            userRole === 'SUPERADMIN' ||
            (storedUser.roles?.[0]?.isSuperAdmin === true);

        const defaultBranchId = storedUser.branch?._id || '';

        // Get heading based on selected model type
        const getDashboardHeading = () => {
            switch(filters.modelType) {
                case 'EV':
                    return 'EV Outstanding Dashboard';
                case 'ICE':
                    return 'ICE Outstanding Dashboard';
                case 'ALL':
                    return 'All Models Outstanding Dashboard';
                default:
                    return 'Outstanding Dashboard';
            }
        };

        // Fetch dashboard data
        const fetchDashboardData = async() => {
                setLoading(true);
                setError(null);

                try {
                    const params = new URLSearchParams();
                    if (filters.modelType && filters.modelType !== 'ALL') params.append('modelType', filters.modelType);
                    if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
                    if (filters.fromDate) params.append('fromDate', filters.fromDate);
                    if (filters.toDate) params.append('toDate', filters.toDate);

                    const url = `/finance/outstanding-dashboard${params.toString() ? `?${params.toString()}` : ''}`;
                    const response = await axiosInstance.get(url);

                    if (response.data.success) {
                        setDashboardData(response.data);
                        setAvailableBranches(response.data.availableBranches || []);
                    } else {
                        setError('Failed to load dashboard data');
                    }
                } catch (err) {
      console.error('Error fetching outstanding dashboard:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initialize branch filter based on user role
  useEffect(() => {
    if (!isSuperAdmin && defaultBranchId) {
      setFilters(prev => ({ ...prev, branchId: defaultBranchId }));
    }
  }, [isSuperAdmin, defaultBranchId]);

  // Fetch data when filters change
  useEffect(() => {
    // Fetch data if at least modelType is selected (dates are optional)
    fetchDashboardData();
  }, [filters.modelType, filters.branchId, filters.fromDate, filters.toDate]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Get badge color for aging bucket
  const getAgingBadgeColor = (bucket) => {
    switch(bucket) {
      case '0-30': return 'success';
      case '31-60': return 'warning';
      case '61-90': return 'danger';
      case '90+': return 'dark';
      default: return 'secondary';
    }
  };

  const CHART_COLORS = ['#28a745', '#ffc107', '#dc3545', '#343a40', '#17a2b8'];

const PAYMENT_COLORS = {
  CASH: '#28a745',
  FINANCE: '#17a2b8'
};

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    if (status?.includes('PENDING_APPROVAL')) return 'warning';
    if (status?.includes('ALLOCATED')) return 'info';
    if (status?.includes('REJECTED')) return 'danger';
    if (status?.includes('COMPLETED')) return 'success';
    return 'secondary';
  };

  if (loading && !dashboardData) {
    return (
      <div className="outstanding-dashboard">
        <Row className="mb-4">
          <Col md={12}>
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3 text-muted">Loading outstanding dashboard...</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  if (error) {
    return (
      <div className="outstanding-dashboard">
        <Row className="mb-4">
          <Col md={12}>
            <Alert variant="danger" className="my-3 border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <FiAlertCircle className="me-2" size={20} />
                <div>
                  <strong>Error Loading Dashboard:</strong>
                  <p className="mb-0">{error}</p>
                </div>
              </div>
            </Alert>
          </Col>
        </Row>
      </div>
    );
  }

  const { summaryCards, agingDistribution, paymentTypeSplit, statusWiseSplit, monthlyTrend, topOutstandingBookings, userAccessInfo } = dashboardData || {};

  return (
    <div className="outstanding-dashboard">
      {/* Header Section */}
      <Row className="mb-4">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="fw-bold text-dark mb-1">{getDashboardHeading()}</h2>
              <p className="text-muted mb-0">
                Track outstanding payments, aging analysis, and collection efficiency
                {userAccessInfo?.userBranch?.name && (
                  <span className="ms-2 text-primary">• {userAccessInfo.userBranch.name}</span>
                )}
              </p>
              {filters.fromDate && filters.toDate && (
                <small className="text-muted d-block mt-1">
                  <FiCalendar className="me-1" /> 
                  {new Date(filters.fromDate).toLocaleDateString()} - {new Date(filters.toDate).toLocaleDateString()}
                </small>
              )}
            </div>
            
            {/* Filters */}
            <div className="d-flex gap-3 align-items-center flex-wrap">
              {/* Date Range Filters */}
              <div className="d-flex align-items-center gap-2">
                <FiCalendar className="text-muted" />
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  style={{ width: '140px' }}
                  placeholder="From Date"
                />
                <span className="text-muted">to</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  style={{ width: '140px' }}
                  placeholder="To Date"
                />
              </div>

              {/* Model Type Filter */}
              <div className="d-flex align-items-center gap-2">
                <FiFilter className="text-muted" />
                <select 
                  className="form-select form-select-sm"
                  value={filters.modelType}
                  onChange={(e) => handleFilterChange('modelType', e.target.value)}
                  style={{ width: '120px' }}
                >
                  <option value="EV">EV Only</option>
                  <option value="ALL">All Models</option>
                  <option value="ICE">ICE Only</option>
                </select>
              </div>
              
              {/* Branch Filter - Only for Super Admin */}
              {isSuperAdmin && (
                <select 
                  className="form-select form-select-sm"
                  value={filters.branchId}
                  onChange={(e) => handleFilterChange('branchId', e.target.value)}
                  style={{ width: '200px' }}
                >
                  <option value="all">All Branches</option>
                  {availableBranches.filter(b => b._id !== 'all').map(branch => (
                    <option key={branch._id} value={branch._id}>{branch.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Outstanding Bookings</h6>
                  <h2 className="fw-bold text-primary mb-0">
                    {summaryCards?.outstandingBookingsCount || 0}
                  </h2>
                </div>
                <div className="metric-icon bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FiFileText size={20} className="text-primary" />
                </div>
              </div>
              <div className="small text-muted">
                Fully Paid: {summaryCards?.fullyPaidBookingsCount || 0}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Total Deal Amount</h6>
                  <h2 className="fw-bold text-dark mb-0">
                    {formatCurrency(summaryCards?.totalDealAmount)}
                  </h2>
                </div>
                <div className="metric-icon bg-success bg-opacity-10 p-3 rounded-circle">
                  <FiDollarSign size={20} className="text-success" />
                </div>
              </div>
              <div className="small text-muted">
                Received: {formatCurrency(summaryCards?.totalReceivedAmount)}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Balance Amount</h6>
                  <h2 className="fw-bold text-warning mb-0">
                    {formatCurrency(summaryCards?.totalBalanceAmount)}
                  </h2>
                </div>
                <div className="metric-icon bg-warning bg-opacity-10 p-3 rounded-circle">
                  <FiTrendingUp size={20} className="text-warning" />
                </div>
              </div>
              <div className="small text-muted">
                Pending: {formatCurrency(summaryCards?.totalPendingAmount)}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Collection Efficiency</h6>
                  <h2 className={`fw-bold mb-0 ${(summaryCards?.collectionEfficiency || 0) >= 50 ? 'text-success' : 'text-danger'}`}>
                    {summaryCards?.collectionEfficiency?.toFixed(1) || 0}%
                  </h2>
                </div>
                <div className="metric-icon bg-info bg-opacity-10 p-3 rounded-circle">
                  <FiBarChart2 size={20} className="text-info" />
                </div>
              </div>
              <ProgressBar 
                now={summaryCards?.collectionEfficiency || 0} 
                variant={summaryCards?.collectionEfficiency >= 50 ? 'success' : 'danger'}
                className="mt-2"
                style={{ height: '6px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Aging Distribution & Payment Type Split */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Aging Distribution</h5>
                <FiClock className="text-muted" />
              </div>
              {agingDistribution && agingDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={agingDistribution}
                      dataKey="balanceAmount"
                      nameKey="bucket"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ bucket, percent }) => `${bucket}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#28a745" />
                      <Cell fill="#ffc107" />
                      <Cell fill="#dc3545" />
                      <Cell fill="#343a40" />
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-4">
                  <p>No aging data available</p>
                </div>
              )}
              <div className="mt-3 pt-3 border-top">
                <small className="text-muted d-block mb-2 fw-semibold">Breakdown:</small>
                {agingDistribution?.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center mb-2 small">
                    <span>
                      <Badge bg={getAgingBadgeColor(item.bucket)} className="me-2">
                        {item.bucket} Days
                      </Badge>
                      ({item.bookingCount} bookings)
                    </span>
                    <strong>{formatCurrency(item.balanceAmount)}</strong>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Payment Type Split</h5>
                <FiPieChart className="text-muted" />
              </div>
              {paymentTypeSplit && paymentTypeSplit.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={paymentTypeSplit}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                    <XAxis dataKey="bookingType" />
                    <YAxis 
                      tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }}
                    />
                    <Bar dataKey="balanceAmount" fill="#17a2b8" name="Balance" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="receivedAmount" fill="#28a745" name="Received" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-4">
                  <p>No payment data available</p>
                </div>
              )}
              <div className="mt-3 pt-3 border-top">
                <small className="text-muted d-block mb-2 fw-semibold">Summary:</small>
                {paymentTypeSplit?.map((item, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <Badge bg={item.bookingType === 'CASH' ? 'success' : 'info'} className="me-2">
                          {item.bookingType}
                        </Badge>
                        <span className="text-muted small">({item.bookingCount} bookings)</span>
                      </div>
                    </div>
                    <div className="small text-muted">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Balance:</span>
                        <strong className="text-dark">{formatCurrency(item.balanceAmount)}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Received:</span>
                        <strong className="text-success">{formatCurrency(item.receivedAmount)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Status Wise Split */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Status Wise Breakdown</h5>
                <FiList className="text-muted" />
              </div>
              <div className="table-responsive">
                <Table hover className="table-borderless">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 ps-4">Status</th>
                      <th className="border-0 text-center">Bookings</th>
                      <th className="border-0 text-end">Deal Amount</th>
                      <th className="border-0 text-end">Received</th>
                      <th className="border-0 text-end pe-4">Balance</th>
                      <th className="border-0 text-center">Aging (0-30/31-60/61-90/90+)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusWiseSplit?.map((item, idx) => (
                      <tr key={idx} className="border-bottom">
                        <td className="ps-4 py-3">
                          <Badge bg={getStatusBadgeColor(item.status)}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="text-center fw-semibold">{item.bookingCount}</td>
                        <td className="text-end">{formatCurrency(item.dealAmount)}</td>
                        <td className="text-end text-success">{formatCurrency(item.receivedAmount)}</td>
                        <td className="text-end pe-4 text-warning fw-bold">{formatCurrency(item.balanceAmount)}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <Badge bg="success">{item.agingBreakdown?.['0-30'] || 0}</Badge>
                            <Badge bg="warning">{item.agingBreakdown?.['31-60'] || 0}</Badge>
                            <Badge bg="danger">{item.agingBreakdown?.['61-90'] || 0}</Badge>
                            <Badge bg="dark">{item.agingBreakdown?.['90+'] || 0}</Badge>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Monthly Trend */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Monthly Collection Trend</h5>
                <FiTrendingUp className="text-muted" />
              </div>
              <div className="table-responsive">
                <Table hover className="table-borderless">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 ps-4">Month</th>
                      <th className="border-0 text-center">Bookings</th>
                      <th className="border-0 text-end">Deal Amount</th>
                      <th className="border-0 text-end">Received</th>
                      <th className="border-0 text-end">Balance</th>
                      <th className="border-0 text-end pe-4">Collection Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyTrend?.map((item, idx) => (
                      <tr key={idx} className="border-bottom">
                        <td className="ps-4 py-3 fw-semibold">{item.label}</td>
                        <td className="text-center">{item.bookingCount}</td>
                        <td className="text-end">{formatCurrency(item.dealAmount)}</td>
                        <td className="text-end text-success">{formatCurrency(item.receivedAmount)}</td>
                        <td className="text-end text-warning">{formatCurrency(item.balanceAmount)}</td>
                        <td className="text-end pe-4">
                          <Badge bg={item.collectionEfficiency >= 90 ? 'success' : item.collectionEfficiency >= 50 ? 'warning' : 'danger'}>
                            {item.collectionEfficiency?.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Outstanding Bookings */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Top Outstanding Bookings</h5>
                <span className="text-muted small">Total: {topOutstandingBookings?.length || 0} bookings with balance</span>
              </div>
              <div className="table-responsive">
                <Table hover className="table-borderless">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 ps-4">Booking #</th>
                      <th className="border-0">Customer</th>
                      <th className="border-0">Model</th>
                      <th className="border-0">Payment Type</th>
                      <th className="border-0 text-end">Deal Amount</th>
                      <th className="border-0 text-end">Received</th>
                      <th className="border-0 text-end pe-4">Balance</th>
                      <th className="border-0 text-center">Aging</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topOutstandingBookings?.slice(0, 10).map((booking, idx) => (
                      <tr key={idx} className="border-bottom">
                        <td className="ps-4 py-3">
                          <span className="fw-semibold">{booking.bookingNumber}</span>
                          <br />
                          <small className="text-muted">{booking.formattedBookingDate}</small>
                        </td>
                        <td>
                          {booking.customerName}
                          <br />
                          <small className="text-muted">{booking.mobile1}</small>
                        </td>
                        <td className="text-truncate" style={{ maxWidth: '180px' }}>
                          <small>{booking.model}</small>
                        </td>
                        <td>
                          <Badge bg={booking.bookingType === 'CASH' ? 'success' : 'info'}>
                            {booking.bookingType}
                          </Badge>
                          {booking.financierName && (
                            <div><small className="text-muted">{booking.financierName}</small></div>
                          )}
                        </td>
                        <td className="text-end">{formatCurrency(booking.dealAmount)}</td>
                        <td className="text-end text-success">{formatCurrency(booking.totalReceivedAmount)}</td>
                        <td className="text-end pe-4 text-warning fw-bold">{formatCurrency(booking.balanceAmount)}</td>
                        <td className="text-center">
                          <Badge bg={getAgingBadgeColor(booking.agingBucket)}>
                            {booking.agingBucket} Days
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {topOutstandingBookings?.length === 0 && (
                <div className="text-center py-4 text-muted">
                  <FiCheckCircle size={40} className="mb-2 text-success" />
                  <p>No outstanding bookings found!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Footer / Summary */}
      <Row>
        <Col md={12}>
          <div className="text-center text-muted small py-3">
            <FiTruck className="me-1" /> Data as of latest update | {summaryCards?.outstandingBookingsCount || 0} outstanding bookings | Total balance: {formatCurrency(summaryCards?.totalBalanceAmount)}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OutstandingDashboard;