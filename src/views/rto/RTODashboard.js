// import React, { useState, useEffect } from 'react';
// import { 
//   CCard,
//   CCardBody,
//   CCol,
//   CRow,
//   CBadge,
//   CSpinner,
//   CAlert
// } from '@coreui/react';
// import { 
//   FiFileText, 
//   FiCheckCircle, 
//   FiDollarSign, 
//   FiPackage, 
//   FiTruck 
// } from 'react-icons/fi';
// import axiosInstance from '../../axiosInstance';
// import '../../css/dashboard.css';

// // Import the permission utilities
// import { 
//   hasSafePagePermission,
//   MODULES, 
//   PAGES,
//   ACTIONS,
//   canViewPage
// } from '../../utils/modulePermissions';
// import { useAuth } from '../../context/AuthContext';

// const RTODashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [bookingData, setBookingData] = useState(null);
//   const [loading, setLoading] = useState({ dashboard: true, bookings: true });
//   const [error, setError] = useState({ dashboard: null, bookings: null });

//   const { permissions } = useAuth();
  
//   // Page-level permission check for RTO Dashboard page under RTO module
//   const canViewRTODashboard = canViewPage(
//     permissions, 
//     MODULES.RTO, 
//     PAGES.RTO.DASHBOARD
//   );

//   useEffect(() => {
//     if (!canViewRTODashboard) {
//       setError({ dashboard: 'Permission denied', bookings: 'Permission denied' });
//       setLoading({ dashboard: false, bookings: false });
//       return;
//     }
    
//     const fetchDashboardData = async () => {
//       try {
//         const response = await axiosInstance.get('/rtoProcess/stats');
//         if (response.data.success) {
//           setDashboardData(response.data.data);
//         } else {
//           setError((prev) => ({ ...prev, dashboard: 'Failed to load dashboard data' }));
//         }
//       } catch (err) {
//         setError((prev) => ({ ...prev, dashboard: err.message || 'Failed to fetch dashboard data' }));
//       } finally {
//         setLoading((prev) => ({ ...prev, dashboard: false }));
//       }
//     };

//     const fetchBookingCounts = async () => {
//       try {
//         const response = await axiosInstance.get('/ledger/booking-counts');
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

//     fetchDashboardData();
//     fetchBookingCounts();
//   }, [canViewRTODashboard]);

//   // Check if user has permission to view the page
//   if (!canViewRTODashboard) {
//     return (
//       <div className="alert alert-danger m-3" role="alert">
//         You do not have permission to view RTO Dashboard.
//       </div>
//     );
//   }

//   if (loading.dashboard || loading.bookings) {
//     return (
//       <div className="text-center py-4">
//         <CSpinner color="primary" />
//         <p>Loading dashboard data...</p>
//       </div>
//     );
//   }

//   const isLoading = (key) => loading[key] && !error[key];
//   const hasError = (key) => error[key] && !loading[key];

//   const summaryCards = [
//     {
//       title: 'Total PF/NPF Applications',
//       count: bookingData?.totalBookings || 0,
//       color: 'primary',
//       icon: FiFileText,
//       details: {
//         pf: bookingData?.pfBookings || 0,
//         npf: bookingData?.npfBookings || 0
//       }
//     },
//     {
//       title: 'Total RTO Applications',
//       count: dashboardData?.totalApplications?.total || 0,
//       color: 'info',
//       icon: FiFileText,
//       details: {
//         monthly: dashboardData?.totalApplications?.monthly || 0,
//         daily: dashboardData?.totalApplications?.daily || 0
//       }
//     },
//     {
//       title: 'Paper Verification',
//       count: dashboardData?.rtoPaperVerify?.total || 0,
//       color: 'success',
//       icon: FiCheckCircle,
//       details: {
//         monthly: dashboardData?.rtoPaperVerify?.monthly || 0,
//         daily: dashboardData?.rtoPaperVerify?.daily || 0
//       }
//     },
//     {
//       title: 'Tax Update',
//       count: dashboardData?.rtoTaxUpdate?.total || 0,
//       color: 'warning',
//       icon: FiDollarSign,
//       details: {
//         monthly: dashboardData?.rtoTaxUpdate?.monthly || 0,
//         daily: dashboardData?.rtoTaxUpdate?.daily || 0
//       }
//     }
//   ];

//   const processCards = [
//     {
//       title: 'HSRP Ordering',
//       count: dashboardData?.hsrpOrdering?.total || 0,
//       color: 'danger',
//       icon: FiPackage,
//       details: {
//         monthly: dashboardData?.hsrpOrdering?.monthly || 0,
//         daily: dashboardData?.hsrpOrdering?.daily || 0
//       }
//     },
//     {
//       title: 'HSRP Installation',
//       count: dashboardData?.hsrpInstallation?.total || 0,
//       color: 'info',
//       icon: FiTruck,
//       details: {
//         monthly: dashboardData?.hsrpInstallation?.monthly || 0,
//         daily: dashboardData?.hsrpInstallation?.daily || 0
//       }
//     },
//     {
//       title: 'RC Confirmation',
//       count: dashboardData?.rcConfirmation?.total || 0,
//       color: 'success',
//       icon: FiCheckCircle,
//       details: {
//         monthly: dashboardData?.rcConfirmation?.monthly || 0,
//         daily: dashboardData?.rcConfirmation?.daily || 0
//       }
//     }
//   ];

//   const DashboardCard = ({ title, count, color, icon: Icon, details }) => (
//     <CCard className={`text-center bg-${color} text-white`}>
//       <CCardBody>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <div className="text-start">
//             <h4 className="mb-0">{count}</h4>
//             <p className="mb-0 small">{title}</p>
//           </div>
//           <div>
//             <Icon size={32} className="text-white" />
//           </div>
//         </div>
        
//         <div className="d-flex justify-content-around mt-3 pt-2 border-top border-white border-opacity-25">
//           {details.pf !== undefined && (
//             <>
//               <div>
//                 <small className="d-block">PF</small>
//                 <strong>{details.pf}</strong>
//               </div>
//               <div>
//                 <small className="d-block">NPF</small>
//                 <strong>{details.npf}</strong>
//               </div>
//             </>
//           )}
//           {details.monthly !== undefined && (
//             <>
//               <div>
//                 <small className="d-block">Monthly</small>
//                 <strong>{details.monthly}</strong>
//               </div>
//               <div>
//                 <small className="d-block">Daily</small>
//                 <strong>{details.daily}</strong>
//               </div>
//             </>
//           )}
//         </div>
//       </CCardBody>
//     </CCard>
//   );

//   return (
//     <div>
//       <div className='title'>RTO Dashboard</div>
      
//       {/* Summary Cards */}
//       <CRow className="mb-4">
//         {summaryCards.map((card, index) => (
//           <CCol md={3} key={index}>
//             <DashboardCard
//               title={card.title}
//               count={card.count}
//               color={card.color}
//               icon={card.icon}
//               details={card.details}
//             />
//           </CCol>
//         ))}
//       </CRow>

//       {/* Process Cards */}
//       <CRow className="mb-4">
//         {processCards.map((card, index) => (
//           <CCol md={4} key={index}>
//             <DashboardCard
//               title={card.title}
//               count={card.count}
//               color={card.color}
//               icon={card.icon}
//               details={card.details}
//             />
//           </CCol>
//         ))}
//       </CRow>

//       {/* Error Messages */}
//       {hasError('dashboard') && (
//         <CAlert color="danger" className="my-3">
//           RTO Data Error: {error.dashboard}
//         </CAlert>
//       )}
//       {hasError('bookings') && (
//         <CAlert color="danger" className="my-3">
//           Booking Data Error: {error.bookings}
//         </CAlert>
//       )}
//     </div>
//   );
// };

// export default RTODashboard;




import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingCart, Package, 
  Award, Eye, Download, RefreshCw, AlertTriangle,
  Activity, Wallet, Bell, AlertCircle, 
  TrendingUp as TrendUp, TrendingDown as TrendDown,
  Download as DownloadIcon, Filter, Users, 
  CheckCircle, XCircle, Clock, Calendar, Building2,
  PieChart, BarChart3, Car, FileText, ClipboardCheck,
  Truck, CreditCard, Printer, MessageCircle, Signature,
  Send, Receipt, Shield
} from 'lucide-react';

import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import './RTODashboard.css';

const RTODashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [showAlerts, setShowAlerts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  
  // State for API data
  const [dashboardData, setDashboardData] = useState({
    kyc: {
      totalVehicles: 0,
      uploaded: 0,
      percentage: "0"
    },
    portalFeeding: {
      totalVehicles: 0,
      uploaded: 0,
      percentage: "0"
    },
    registration: {
      totalVehicles: 0,
      withRegistration: 0,
      percentage: "0"
    },
    hsrpOrder: {
      totalWithReg: 0,
      ordered: 0,
      percentage: 0
    },
    hsrpReceipt: {
      totalOrders: 0,
      receiptGenerated: 0,
      whatsappSent: 0,
      receiptPercentage: "0",
      whatsappPercentage: "0"
    },
    hsrpInstallation: {
      totalVehicles: 0,
      installed: 0,
      signatureCollected: 0,
      installationPercentage: "0",
      signaturePercentage: "0"
    },
    rcDispatch: {
      totalVehicles: 0,
      dispatched: 0,
      vahanCompleted: 0,
      dispatchPercentage: "0"
    }
  });

  const [reportInfo, setReportInfo] = useState({
    reportDate: null,
    reportGeneratedBy: ""
  });

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setApiCalled(false);
    
    try {
      const url = `/vahan-dashboard/summary`;
      
      console.log('🟡 Fetching RTO dashboard data from:', url);
      setApiCalled(true);
      
      const response = await axiosInstance.get(url);
      console.log('✅ RTO Dashboard API Response:', response.data);
      
      if (response.data.success && response.data.summary) {
        setDashboardData(response.data.summary);
        setReportInfo({
          reportDate: response.data.reportDate,
          reportGeneratedBy: response.data.reportGeneratedBy
        });
        console.log('✅ RTO dashboard data loaded successfully:', {
          totalVehicles: response.data.summary.kyc?.totalVehicles,
          portalFeeding: response.data.summary.portalFeeding?.percentage,
          registration: response.data.summary.registration?.percentage,
          hsrpInstallation: response.data.summary.hsrpInstallation?.installationPercentage,
          rcDispatch: response.data.summary.rcDispatch?.dispatchPercentage
        });
      } else {
        console.warn('⚠️ RTO Dashboard API returned success=false or no data');
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('❌ Error fetching RTO dashboard:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Network error. Please check your connection.');
      showError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('🟡 RTODashboard mounted - fetching data');
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    console.log('🟡 Manual refresh triggered');
    setIsRefreshing(true);
    fetchDashboardData().finally(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  const handleExport = async () => {
    try {
      console.log('🟡 Exporting RTO report...');
      const response = await axiosInstance.get('/vahan-dashboard/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rto_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Report exported successfully');
      showSuccess('Report exported successfully!');
    } catch (error) {
      console.error('❌ Export error:', error);
      showError('Failed to export report');
    }
  };

  // Stats for the dashboard
  const stats = [
    { 
      title: 'Total Vehicles', 
      value: formatNumber(dashboardData.kyc?.totalVehicles || 0), 
      change: "+0", 
      changeType: "increase",
      icon: Car, 
      color: "#2E7D32",
      bgColor: "#E8F5E9"
    },
    { 
      title: 'KYC Uploaded', 
      value: `${dashboardData.kyc?.percentage || 0}%`, 
      change: `${dashboardData.kyc?.uploaded || 0}/${dashboardData.kyc?.totalVehicles || 0}`,
      changeType: dashboardData.kyc?.percentage > 50 ? "increase" : "decrease",
      icon: FileText, 
      color: "#1976D2",
      bgColor: "#E3F2FD"
    },
    { 
      title: 'Registration', 
      value: `${dashboardData.registration?.percentage || 0}%`, 
      change: `${dashboardData.registration?.withRegistration || 0} vehicles`,
      changeType: dashboardData.registration?.percentage > 0 ? "increase" : "decrease",
      icon: ClipboardCheck, 
      color: "#FF6F00",
      bgColor: "#FFF3E0"
    },
    { 
      title: 'HSRP Installation', 
      value: `${dashboardData.hsrpInstallation?.installationPercentage || 0}%`, 
      change: `${dashboardData.hsrpInstallation?.installed || 0} installed`,
      changeType: dashboardData.hsrpInstallation?.installationPercentage > 0 ? "increase" : "decrease",
      icon: Shield, 
      color: "#9C27B0",
      bgColor: "#F3E5F5"
    },
  ];

  // Progress Card Component
  const ProgressCard = ({ title, icon, total, completed, percentage, color, bgColor, subtitle }) => {
    const Icon = icon;
    const percent = parseFloat(percentage) || 0;
    
    return (
      <div className="progress-card">
        <div className="progress-card-header">
          <div className="progress-card-icon" style={{ backgroundColor: bgColor }}>
            <Icon size={20} style={{ color: color }} />
          </div>
          <h4 className="progress-card-title">{title}</h4>
        </div>
        <div className="progress-card-body">
          <div className="progress-stats">
            <span className="progress-completed">{formatNumber(completed)}</span>
            <span className="progress-total">/ {formatNumber(total)}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: color }}></div>
            </div>
            <span className="progress-percentage">{percent.toFixed(2)}%</span>
          </div>
          {subtitle && <p className="progress-subtitle">{subtitle}</p>}
        </div>
      </div>
    );
  };

  // HSRP Receipt Card
  const HSRPReceiptCard = () => {
    const receipt = dashboardData.hsrpReceipt || {};
    const receiptPercent = parseFloat(receipt.receiptPercentage) || 0;
    const whatsappPercent = parseFloat(receipt.whatsappPercentage) || 0;
    
    return (
      <div className="hsrp-receipt-card">
        <div className="card-header">
          <h3 className="card-title">HSRP Receipt</h3>
          <Receipt size={20} style={{ color: '#FF6F00' }} />
        </div>
        <div className="receipt-stats">
          <div className="receipt-stat">
            <div className="receipt-stat-header">
              <span>Total Orders</span>
              <strong>{formatNumber(receipt.totalOrders || 0)}</strong>
            </div>
            <div className="receipt-stat-header">
              <span>Receipt Generated</span>
              <strong>{formatNumber(receipt.receiptGenerated || 0)}</strong>
            </div>
            <div className="progress-bar-container small">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${receiptPercent}%`, backgroundColor: '#4CAF50' }}></div>
              </div>
              <span className="progress-percentage">{receiptPercent.toFixed(2)}%</span>
            </div>
          </div>
          <div className="receipt-stat">
            <div className="receipt-stat-header">
              <span>WhatsApp Sent</span>
              <strong>{formatNumber(receipt.whatsappSent || 0)}</strong>
            </div>
            <div className="progress-bar-container small">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${whatsappPercent}%`, backgroundColor: '#2196F3' }}></div>
              </div>
              <span className="progress-percentage">{whatsappPercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // HSRP Installation Details Card
  const HSRPInstallationCard = () => {
    const installation = dashboardData.hsrpInstallation || {};
    const installPercent = parseFloat(installation.installationPercentage) || 0;
    const signaturePercent = parseFloat(installation.signaturePercentage) || 0;
    
    return (
      <div className="installation-card">
        <div className="card-header">
          <h3 className="card-title">HSRP Installation</h3>
          <Truck size={20} style={{ color: '#9C27B0' }} />
        </div>
        <div className="installation-stats">
          <div className="installation-stat">
            <div className="installation-stat-header">
              <span>Installed</span>
              <strong>{formatNumber(installation.installed || 0)}</strong>
              <span className="stat-total">/ {formatNumber(installation.totalVehicles || 0)}</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${installPercent}%`, backgroundColor: '#9C27B0' }}></div>
              </div>
              <span className="progress-percentage">{installPercent.toFixed(2)}%</span>
            </div>
          </div>
          <div className="installation-stat">
            <div className="installation-stat-header">
              <span>Signature Collected</span>
              <strong>{formatNumber(installation.signatureCollected || 0)}</strong>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${signaturePercent}%`, backgroundColor: '#FF9800' }}></div>
              </div>
              <span className="progress-percentage">{signaturePercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading && !apiCalled) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-content">
          <RefreshCw className="dashboard-loading-spinner" />
          <p>Loading RTO dashboard data...</p>
          <p className="debug-text">Calling API: /vahan-dashboard/summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rto-dashboard">
     

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">RTO Dashboard</h1>
          <p className="dashboard-subtitle">
            Vehicle registration and documentation tracking
          </p>
        </div>
        {/* <div className="dashboard-actions">
          <button 
            onClick={() => setShowAlerts(!showAlerts)}
            className="icon-btn"
          >
            <Bell size={20} />
          </button>
          <button onClick={handleExport} className="icon-btn">
            <DownloadIcon size={20} />
          </button>
          <button onClick={handleRefresh} className="icon-btn">
            <RefreshCw className={isRefreshing ? 'spin' : ''} size={20} />
          </button>
        </div> */}
      </div>

   

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isIncrease = stat.changeType === 'increase';
          return (
            <div 
              key={index} 
              className="stat-card" 
              style={{ borderLeftColor: stat.color }}
            >
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                  {/* <div className="stat-change">
                    {isIncrease ? <TrendUp size={12} /> : <TrendDown size={12} />}
                    <span className={isIncrease ? 'change-positive' : 'change-negative'}>
                      {stat.change}
                    </span>
                    <span className="change-label">completed</span>
                  </div> */}
                </div>
                <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Progress Cards Grid */}
      <div className="progress-section">
        <ProgressCard
          title="KYC Upload"
          icon={FileText}
          total={dashboardData.kyc?.totalVehicles || 0}
          completed={dashboardData.kyc?.uploaded || 0}
          percentage={dashboardData.kyc?.percentage || "0"}
          color="#1976D2"
          bgColor="#E3F2FD"
        />
        
        <ProgressCard
          title="Portal Feeding"
          icon={ClipboardCheck}
          total={dashboardData.portalFeeding?.totalVehicles || 0}
          completed={dashboardData.portalFeeding?.uploaded || 0}
          percentage={dashboardData.portalFeeding?.percentage || "0"}
          color="#4CAF50"
          bgColor="#E8F5E9"
        />
        
        <ProgressCard
          title="Vehicle Registration"
          icon={Car}
          total={dashboardData.registration?.totalVehicles || 0}
          completed={dashboardData.registration?.withRegistration || 0}
          percentage={dashboardData.registration?.percentage || "0"}
          color="#FF6F00"
          bgColor="#FFF3E0"
          subtitle={`${dashboardData.hsrpOrder?.ordered || 0} HSRP orders placed`}
        />
      </div>

      {/* HSRP Section */}
      <div className="hsrp-section">
        <HSRPReceiptCard />
        <HSRPInstallationCard />
        
        {/* RC Dispatch Card */}
        <div className="rc-dispatch-card">
          <div className="card-header">
            <h3 className="card-title">RC Dispatch</h3>
            <Send size={20} style={{ color: '#F44336' }} />
          </div>
          <div className="dispatch-stats">
            <div className="dispatch-stat">
              <div className="dispatch-stat-header">
                <span>Dispatched</span>
                <strong>{formatNumber(dashboardData.rcDispatch?.dispatched || 0)}</strong>
                <span className="stat-total">/ {formatNumber(dashboardData.rcDispatch?.totalVehicles || 0)}</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${parseFloat(dashboardData.rcDispatch?.dispatchPercentage || 0)}%`, backgroundColor: '#F44336' }}></div>
                </div>
                <span className="progress-percentage">{parseFloat(dashboardData.rcDispatch?.dispatchPercentage || 0).toFixed(2)}%</span>
              </div>
            </div>
            <div className="dispatch-stat">
              <div className="dispatch-stat-header">
                <span>Vahan Completed</span>
                <strong>{formatNumber(dashboardData.rcDispatch?.vahanCompleted || 0)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-section">
        <div className="summary-card">
          <div className="summary-card-header">
            <Shield size={20} style={{ color: '#1976D2' }} />
            <h4>HSRP Order Status</h4>
          </div>
          <div className="summary-card-body">
            <div className="insight-item">
              <span className="insight-label">Total Vehicles with Registration:</span>
              <span className="insight-value">{formatNumber(dashboardData.hsrpOrder?.totalWithReg || 0)}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">HSRP Ordered:</span>
              <span className="insight-value">{formatNumber(dashboardData.hsrpOrder?.ordered || 0)}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Order Percentage:</span>
              <span className="insight-value">{dashboardData.hsrpOrder?.percentage || 0}%</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <MessageCircle size={20} style={{ color: '#4CAF50' }} />
            <h4>Communication Status</h4>
          </div>
          <div className="summary-card-body">
            <div className="insight-item">
              <span className="insight-label">Receipt Generated:</span>
              <span className="insight-value">{dashboardData.hsrpReceipt?.receiptPercentage || 0}%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">WhatsApp Sent:</span>
              <span className="insight-value">{dashboardData.hsrpReceipt?.whatsappPercentage || 0}%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Signature Collected:</span>
              <span className="insight-value">{dashboardData.hsrpInstallation?.signaturePercentage || 0}%</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <Truck size={20} style={{ color: '#FF6F00' }} />
            <h4>Installation Progress</h4>
          </div>
          <div className="summary-card-body">
            <div className="insight-item">
              <span className="insight-label">HSRP Installed:</span>
              <span className="insight-value">{dashboardData.hsrpInstallation?.installationPercentage || 0}%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Installed Vehicles:</span>
              <span className="insight-value">{formatNumber(dashboardData.hsrpInstallation?.installed || 0)}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Pending Installation:</span>
              <span className="insight-value">{formatNumber((dashboardData.hsrpInstallation?.totalVehicles || 0) - (dashboardData.hsrpInstallation?.installed || 0))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="quick-stats-footer">
        <div className="quick-stat-item">
          <CheckCircle size={16} style={{ color: '#4CAF50' }} />
          <span>Portal Feeding Complete</span>
          <strong>{dashboardData.portalFeeding?.percentage || 0}%</strong>
        </div>
        <div className="quick-stat-item">
          <Receipt size={16} style={{ color: '#FF9800' }} />
          <span>Receipt Generation</span>
          <strong>{dashboardData.hsrpReceipt?.receiptPercentage || 0}%</strong>
        </div>
        <div className="quick-stat-item">
          <Signature size={16} style={{ color: '#9C27B0' }} />
          <span>Signature Collection</span>
          <strong>{dashboardData.hsrpInstallation?.signaturePercentage || 0}%</strong>
        </div>
        <div className="quick-stat-item">
          <Send size={16} style={{ color: '#F44336' }} />
          <span>RC Dispatch</span>
          <strong>{dashboardData.rcDispatch?.dispatchPercentage || 0}%</strong>
        </div>
      </div>
    </div>
  );
};

export default RTODashboard;