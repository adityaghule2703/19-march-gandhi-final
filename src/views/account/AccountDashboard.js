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








import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Table, Badge, ProgressBar } from 'react-bootstrap';
import { FiDollarSign, FiPieChart, FiTrendingUp, FiTrendingDown, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axiosInstance from '../../axiosInstance';
import '../../css/dashboard.css';

// Import permission utilities
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  ACTIONS,
  canViewPage 
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

const AccountDashboard = () => {
  const [bookingData, setBookingData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState({ bookings: true, financials: true });
  const [error, setError] = useState({ bookings: null, financials: null });

  const { permissions } = useAuth();

  // Get user data from localStorage (consistent with other components)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const branchId = storedUser.branch?._id;
  const userRole = localStorage.getItem('userRole') || 
                   (storedUser.roles?.[0]?.name || '').toUpperCase();

  // Check if user is SUPERADMIN
  const isSuperAdmin = userRole === 'SUPERADMIN' || 
                       (storedUser.roles?.[0]?.isSuperAdmin === true);

  // Page-level permission check for Account Dashboard under ACCOUNT module
  const canViewAccountDashboard = canViewPage(permissions, MODULES.ACCOUNT, PAGES.ACCOUNT.DASHBOARD);

  useEffect(() => {
    if (!canViewAccountDashboard) {
      return;
    }
    
    const fetchBookingCounts = async () => {
      try {
        let url = 'ledger/booking-counts';
        
        // Add branch filter for non-super admins
        if (!isSuperAdmin && branchId) {
          url += `?branchId=${branchId}`;
        }
        
        const response = await axiosInstance.get(url);
        if (response.data.status === 'success') {
          setBookingData(response.data.data);
        } else {
          setError((prev) => ({ ...prev, bookings: 'Failed to load booking data' }));
        }
      } catch (err) {
        setError((prev) => ({ ...prev, bookings: err.message || 'Failed to fetch booking data' }));
      } finally {
        setLoading((prev) => ({ ...prev, bookings: false }));
      }
    };

    fetchBookingCounts();
  }, [canViewAccountDashboard, isSuperAdmin, branchId]);

  useEffect(() => {
    if (!canViewAccountDashboard) {
      return;
    }
    
    const fetchFinancialSummary = async () => {
      try {
        let url = 'ledger/summary/branch';
        
        const response = await axiosInstance.get(url);
        if (response.data.status === 'success') {
          let financialData = response.data.data;
          
          // For non-super admins, filter to show only their branch data
          if (!isSuperAdmin && branchId && financialData?.byBranch) {
            // Find user's branch data
            const userBranchData = financialData.byBranch.find(branch => 
              branch.branchId === branchId || 
              branch._id === branchId ||
              (branch.branchName && storedUser.branch?.name && branch.branchName === storedUser.branch.name)
            );
            
            // If user's branch exists in the data, show only that
            if (userBranchData) {
              setFinancialData({
                ...financialData,
                byBranch: [userBranchData], // Only show user's branch
                allBranches: {
                  totalDebit: userBranchData.totalDebit || 0,
                  totalCredit: userBranchData.totalCredit || 0,
                  finalBalance: userBranchData.finalBalance || 0
                }
              });
            } else {
              // If user's branch not found in the data, show empty data
              setFinancialData({
                ...financialData,
                byBranch: [],
                allBranches: {
                  totalDebit: 0,
                  totalCredit: 0,
                  finalBalance: 0
                }
              });
            }
          } else {
            // For super admin, show all data as is
            setFinancialData(financialData);
          }
        } else {
          setError((prev) => ({ ...prev, financials: 'Failed to load financial data' }));
        }
      } catch (err) {
        setError((prev) => ({ ...prev, financials: err.message || 'Failed to fetch financial data' }));
      } finally {
        setLoading((prev) => ({ ...prev, financials: false }));
      }
    };

    fetchFinancialSummary();
  }, [canViewAccountDashboard, isSuperAdmin, branchId]);

  // Calculate completion rate
  const completionRate = bookingData && bookingData.totalBookings > 0 ? 
    (bookingData.completedBookings / bookingData.totalBookings) * 100 : 0;

  const isLoading = (key) => loading[key] && !error[key];
  const hasError = (key) => error[key] && !loading[key];
  const isOverallLoading = loading.bookings || loading.financials;
  
  if (!canViewAccountDashboard) {
    return (
      <div className="account-dashboard">
        <Row className="mb-4">
          <Col md={12}>
            <Alert variant="danger" className="my-3 border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <FiAlertCircle className="me-2" />
                <strong>Access Denied:</strong> You do not have permission to view the Account Dashboard.
              </div>
            </Alert>
          </Col>
        </Row>
      </div>
    );
  }

  if (isOverallLoading && (!bookingData && !financialData)) {
    return (
      <div className="account-dashboard">
        <Row className="mb-4">
          <Col md={12}>
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3 text-muted">Loading dashboard data...</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="account-dashboard">
      <Row className="mb-4">
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">PF/NPF Account Dashboard</h2>
              <p className="text-muted mb-0">Financial overview and application status</p>
            </div>
           
          </div>
        </Col>
      </Row>
      
      
      
      {hasError('bookings') && (
        <Alert variant="danger" className="my-3 border-0 shadow-sm">
          <div className="d-flex align-items-center">
            <FiTrendingDown className="me-2" />
            <strong>Booking Data Error:</strong> {error.bookings}
          </div>
        </Alert>
      )}
      {hasError('financials') && (
        <Alert variant="danger" className="my-3 border-0 shadow-sm">
          <div className="d-flex align-items-center">
            <FiTrendingDown className="me-2" />
            <strong>Financial Data Error:</strong> {error.financials}
          </div>
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={4} className="mb-4">
          <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2 fw-semibold small">
                    {isSuperAdmin ? 'Total PF/NPF Applications' : 'Your Branch Applications'}
                  </h6>
                  <h2 className="fw-bold text-dark mb-0">
                    {isLoading('bookings') ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      bookingData?.totalBookings?.toLocaleString() || 0
                    )}
                  </h2>
                </div>
                <div className="metric-icon bg-primary bg-opacity-10 p-3 rounded-circle">
                  <FiUsers size={20} className="text-primary" />
                </div>
              </div>
              
              <div className="metric-breakdown">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">PF Applications</span>
                  <Badge bg="primary" className="px-2 py-1">
                    {bookingData?.pfBookings || 0}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">NPF Applications</span>
                  <Badge bg="secondary" className="px-2 py-1">
                    {bookingData?.npfBookings || 0}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Completion Rate</span>
                  <div className="text-end">
                    <div className="fw-semibold text-success">{completionRate.toFixed(1)}%</div>
                    <ProgressBar 
                      now={completionRate} 
                      variant="success" 
                      className="mt-1" 
                      style={{ height: '4px', width: '80px' }}
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className={`fw-bold mb-0 ${(financialData?.allBranches?.finalBalance || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                    {isLoading('financials') ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      `₹${(financialData?.allBranches?.finalBalance || 0).toLocaleString()}`
                    )}
                  </h2>
                  <p className="text-muted small mb-0">
                    {isSuperAdmin ? 'Overall Net Balance' : 'Branch Net Balance'}
                  </p>
                </div>
                <div className="metric-icon bg-success bg-opacity-10 p-3 rounded-circle">
                  <FiDollarSign size={20} className="text-success" />
                </div>
              </div>

              <div className="financial-details mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="text-muted small">Total Credit</span>
                    <div className="fw-bold text-success">
                      {isLoading('financials') ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        `₹${(financialData?.allBranches?.totalCredit || 0).toLocaleString()}`
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-muted small">Total Debit</span>
                    <div className="fw-bold text-danger">
                      {isLoading('financials') ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        `₹${(financialData?.allBranches?.totalDebit || 0).toLocaleString()}`
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3">
                  {(financialData?.allBranches?.finalBalance || 0) >= 0 ? (
                    <FiTrendingUp className="text-success me-2" />
                  ) : (
                    <FiTrendingDown className="text-danger me-2" />
                  )}
                  <span className="small text-muted">
                    {(financialData?.allBranches?.finalBalance || 0) >= 0 ? 'Positive' : 'Negative'} Balance
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="dashboard-card metric-card h-100 border-0 shadow-hover">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-uppercase text-muted mb-2 fw-semibold small">Application Status</h6>
                  <div className="d-flex align-items-center">
                    <FiCheckCircle className="text-success me-2" />
                    <span className="fw-bold text-dark">{bookingData?.completedBookings || 0}</span>
                    <span className="text-muted small ms-1">Completed</span>
                  </div>
                </div>
                <div className="metric-icon bg-info bg-opacity-10 p-3 rounded-circle">
                  <FiPieChart size={20} className="text-info" />
                </div>
              </div>

              <div className="status-breakdown mt-4">
                <div className="status-item d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="status-indicator bg-warning me-2"></div>
                    <span className="text-muted small">Draft</span>
                  </div>
                  <Badge bg="warning" text="dark" className="px-2 py-1">
                    {bookingData?.draftBookings || 0}
                  </Badge>
                </div>
                <div className="status-item d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <div className="status-indicator bg-danger me-2"></div>
                    <span className="text-muted small">Rejected</span>
                  </div>
                  <Badge bg="danger" className="px-2 py-1">
                    {bookingData?.rejectedBookings || 0}
                  </Badge>
                </div>
                <div className="status-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="status-indicator bg-success me-2"></div>
                    <span className="text-muted small">In Progress</span>
                  </div>
                  <Badge bg="success" className="px-2 py-1">
                    {((bookingData?.totalBookings || 0) - 
                      (bookingData?.completedBookings || 0) - 
                      (bookingData?.draftBookings || 0) - 
                      (bookingData?.rejectedBookings || 0)).toLocaleString()}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {financialData?.byBranch?.length > 0 && (
        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title mb-0 fw-bold">
                    {isSuperAdmin ? 'Branch-wise Financial Summary' : 'Branch Financial Summary'}
                  </h5>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    {financialData.byBranch.length} {financialData.byBranch.length === 1 ? 'Branch' : 'Branches'}
                  </Badge>
                </div>
                <div className="table-responsive">
                  <Table hover className="table-borderless">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-4">Branch Name</th>
                        <th className="border-0 text-end">Total Debit</th>
                        <th className="border-0 text-end">Total Credit</th>
                        <th className="border-0 text-end pe-4">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.byBranch.map((branch, index) => (
                        <tr key={index} className="border-bottom">
                          <td className="ps-4 py-3 fw-semibold">{branch.branchName || 'Unnamed Branch'}</td>
                          <td className="text-end text-danger fw-semibold">
                            ₹{branch.totalDebit?.toLocaleString() || '0'}
                          </td>
                          <td className="text-end text-success fw-semibold">
                            ₹{branch.totalCredit?.toLocaleString() || '0'}
                          </td>
                          <td className={`text-end pe-4 fw-bold ${(branch.finalBalance || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                            ₹{(branch.finalBalance || 0).toLocaleString()}
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
      )}
      
      {(!bookingData && !financialData && !isOverallLoading) && (
        <Row>
          <Col md={12}>
            <Alert variant="info" className="my-3 border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <FiAlertCircle className="me-2" />
                <div>
                  <strong>No Data Available</strong>
                  <p className="mb-0">
                    {isSuperAdmin 
                      ? 'No dashboard data is currently available. Data will appear once applications are processed.' 
                      : 'No data available for your branch. Data will appear once applications are processed.'}
                  </p>
                </div>
              </div>
            </Alert>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AccountDashboard;