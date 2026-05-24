import React, { useState, useEffect } from 'react';
import { 
  FileText, DollarSign, Clock, CheckCircle, 
  AlertCircle, TrendingUp, Activity,
  Wallet, Calendar, Users
} from 'lucide-react';

import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import './ClaimDashboard.css';

const ClaimDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for API data
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalClaims: 0,
      totalClaimAmount: 0,
      totalAmountReceived: 0,
      totalAmountPending: 0,
      averageClaimAmount: 0,
      recoveryRate: 0
    },
    claimsByStatus: {
      PENDING: 0,
      PAID: 0
    },
    claimsByMonth: [],
    recentClaims: [],
    lastUpdated: null
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/claims/summary`;
      
      console.log(`🟡 Fetching claims dashboard data from: ${url}`);
      
      const response = await axiosInstance.get(url);
      console.log('✅ Claims Dashboard API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data);
        console.log('✅ Claims dashboard data loaded successfully');
      } else {
        console.warn('⚠️ Claims API returned success=false or no data');
        setError('Failed to fetch claims dashboard data');
      }
    } catch (error) {
      console.error('❌ Error fetching claims dashboard:', error);
      setError(error.response?.data?.message || 'Network error. Please check your connection.');
      showError(error.response?.data?.message || 'Failed to load claims dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('🟡 Initial load - fetching claims dashboard data');
    fetchDashboardData();
  }, []);

  const stats = [
    { 
      title: 'Total Claims', 
      value: formatNumber(dashboardData.summary?.totalClaims || 0), 
      icon: FileText, 
      color: "#183883",
      bgColor: "#E8EEF9"
    },
    { 
      title: 'Total Claim Amount', 
      value: formatCurrency(dashboardData.summary?.totalClaimAmount || 0), 
      icon: DollarSign, 
      color: "#DF2C2A",
      bgColor: "#FDE8E8"
    },
    { 
      title: 'Amount Received', 
      value: formatCurrency(dashboardData.summary?.totalAmountReceived || 0), 
      icon: CheckCircle, 
      color: "#183883",
      bgColor: "#E8EEF9"
    },
    { 
      title: 'Amount Pending', 
      value: formatCurrency(dashboardData.summary?.totalAmountPending || 0), 
      icon: Clock, 
      color: "#DF2C2A",
      bgColor: "#FDE8E8"
    }
  ];

  // Claims Bar Chart Component
  const ClaimsBarChart = () => {
    const claimsData = dashboardData.claimsByMonth || [];
    
    if (claimsData.length === 0) {
      return (
        <div className="empty-chart">
          <Calendar size={48} />
          <p>No claims data available</p>
        </div>
      );
    }

    const maxAmount = Math.max(...claimsData.map(c => c.amount), 1);
    const chartWidth = 700;
    const chartHeight = 400;
    const padding = { top: 20, right: 80, bottom: 80, left: 100 };
    const graphWidth = chartWidth - padding.left - padding.right;
    const graphHeight = chartHeight - padding.top - padding.bottom;
    
    const barWidth = 50;
    const barSpacing = 40;
    
    const getX = (index) => {
      const totalBarsWidth = claimsData.length * barWidth;
      const totalSpacing = (claimsData.length - 1) * barSpacing;
      const startX = padding.left + (graphWidth - (totalBarsWidth + totalSpacing)) / 2;
      return startX + index * (barWidth + barSpacing);
    };
    
    const getY = (amount) => {
      return chartHeight - padding.bottom - (amount / maxAmount) * graphHeight;
    };
    
    const getBarHeight = (amount) => {
      return (amount / maxAmount) * graphHeight;
    };

    // Format month label
    const formatMonthLabel = (monthStr) => {
      if (!monthStr) return '';
      const [year, month] = monthStr.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    };

    return (
      <div className="claims-chart-container">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" className="claims-chart-svg">
          {/* Y-axis */}
          <line 
            x1={padding.left} 
            y1={padding.top} 
            x2={padding.left} 
            y2={chartHeight - padding.bottom} 
            stroke="#183883" 
            strokeWidth="2" 
          />
          
          {/* X-axis */}
          <line 
            x1={padding.left} 
            y1={chartHeight - padding.bottom} 
            x2={chartWidth - padding.right} 
            y2={chartHeight - padding.bottom} 
            stroke="#183883" 
            strokeWidth="2" 
          />
          
          {/* Y-axis labels and grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = getY(maxAmount * ratio);
            const value = maxAmount * ratio;
            return (
              <g key={ratio}>
                <line 
                  x1={padding.left} 
                  y1={y} 
                  x2={chartWidth - padding.right} 
                  y2={y} 
                  stroke="#E8EEF9" 
                  strokeWidth="1" 
                  strokeDasharray="4" 
                />
                <text 
                  x={padding.left - 10} 
                  y={y} 
                  textAnchor="end" 
                  fontSize="10" 
                  fill="#183883"
                  dominantBaseline="middle"
                >
                  {formatCurrency(value)}
                </text>
              </g>
            );
          })}
          
          {/* Bars */}
          {claimsData.map((item, index) => {
            const x = getX(index);
            const barHeight = getBarHeight(item.amount);
            const y = getY(item.amount);
            
            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#gradient)"
                  rx="4"
                  ry="4"
                  className="claims-bar-rect"
                >
                  <title>{`${formatMonthLabel(item.month)}: ${formatCurrency(item.amount)} (${item.count} claims)`}</title>
                </rect>
                
                {/* Value on top of bar */}
                <text 
                  x={x + barWidth / 2} 
                  y={y - 5} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#DF2C2A" 
                  fontWeight="bold"
                >
                  {item.count}
                </text>
                
                {/* X-axis label */}
                <text 
                  x={x + barWidth / 2} 
                  y={chartHeight - padding.bottom + 20} 
                  textAnchor="middle" 
                  fontSize="11" 
                  fill="#183883" 
                  fontWeight="500"
                  className="claims-name-label"
                >
                  {formatMonthLabel(item.month)}
                </text>
              </g>
            );
          })}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#DF2C2A", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#183883", stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Axis Labels */}
        <div className="axis-labels">
          <div className="y-axis-label">Claim Amount →</div>
          <div className="x-axis-label">Months →</div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="claim-dashboard-loading">
        <div className="claim-dashboard-loading-content">
          <div className="claim-dashboard-loading-spinner"></div>
          <p>Loading claims dashboard data...</p>
        </div>
      </div>
    );
  }

  const totalClaims = dashboardData.summary?.totalClaims || 0;
  const pendingClaims = dashboardData.claimsByStatus?.PENDING || 0;
  const paidClaims = dashboardData.claimsByStatus?.PAID || 0;
  const pendingPercentage = totalClaims > 0 ? (pendingClaims / totalClaims) * 100 : 0;
  const paidPercentage = totalClaims > 0 ? (paidClaims / totalClaims) * 100 : 0;

  return (
    <div className="claim-dashboard">
      {/* Header */}
      <div className="claim-dashboard-header">
        <div>
          <h1 className="claim-dashboard-title">Claims Dashboard</h1>
          <p className="claim-dashboard-subtitle">
            Last updated: {dashboardData.lastUpdated ? formatDateTime(dashboardData.lastUpdated) : 'Just now'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="claim-error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="claim-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="claim-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="claim-stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="claim-stat-content">
                <div className="claim-stat-info">
                  <p className="claim-stat-title">{stat.title}</p>
                  <p className="claim-stat-value">{stat.value}</p>
                </div>
                <div className="claim-stat-icon" style={{ backgroundColor: stat.bgColor }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="claim-charts-section">
        <div className="claim-main-chart">
          <div className="claim-chart-header">
            <div>
              <h3 className="claim-chart-title">Claims Overview</h3>
              <p className="claim-chart-subtitle">Monthly claims amount and count</p>
            </div>
            <div className="claim-chart-legend">
              <div className="claim-legend-item">
                <div className="claim-legend-color claim-revenue-legend"></div>
                <span>Claim Amount (₹)</span>
              </div>
            </div>
          </div>
          <div className="claim-chart-body">
            <ClaimsBarChart />
          </div>
        </div>

        {/* Right Side Stats */}
        <div className="claim-side-stats">
          <div className="claim-status-card">
            <div className="claim-status-header">
              <h4 className="claim-status-title">Claims by Status</h4>
              <Activity size={16} />
            </div>
            <div className="claim-status-metrics">
              <div className="claim-metric-item">
                <div className="claim-metric-header">
                  <span>Pending Claims</span>
                  <span>{pendingClaims} claims</span>
                </div>
                <div className="claim-progress-bar">
                  <div 
                    className="claim-progress-pending"
                    style={{ width: `${pendingPercentage}%` }}
                  ></div>
                </div>
                <div className="claim-metric-amount">
                  Amount: {formatCurrency(dashboardData.summary?.totalAmountPending || 0)}
                </div>
              </div>
              <div className="claim-metric-item">
                <div className="claim-metric-header">
                  <span>Paid Claims</span>
                  <span>{paidClaims} claims</span>
                </div>
                <div className="claim-progress-bar">
                  <div 
                    className="claim-progress-paid"
                    style={{ width: `${paidPercentage}%` }}
                  ></div>
                </div>
                <div className="claim-metric-amount">
                  Amount: {formatCurrency(dashboardData.summary?.totalAmountReceived || 0)}
                </div>
              </div>
            </div>
          </div>

          <div className="claim-summary-card">
            <div className="claim-summary-header">
              <h4 className="claim-summary-title">Quick Summary</h4>
              <Wallet size={16} />
            </div>
            <div className="claim-summary-content">
              <div className="claim-summary-item">
                <span className="claim-summary-label">Total Claims Filed</span>
                <span className="claim-summary-value">{formatNumber(totalClaims)}</span>
              </div>
              <div className="claim-summary-item">
                <span className="claim-summary-label">Pending Amount</span>
                <span className="claim-summary-value">{formatCurrency(dashboardData.summary?.totalAmountPending || 0)}</span>
              </div>
              <div className="claim-summary-item">
                <span className="claim-summary-label">Received Amount</span>
                <span className="claim-summary-value">{formatCurrency(dashboardData.summary?.totalAmountReceived || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className="claim-recent-section">
        <div className="claim-table-header">
          <h3 className="claim-table-title">Recent Claims</h3>
          <p className="claim-table-subtitle">Latest claims filed</p>
        </div>
        <div className="claim-table-container">
          <table className="claim-data-table">
            <thead>
              <tr>
                <th>Booking No.</th>
                <th>Customer Name</th>
                <th>Model</th>
                <th>Claim Amount</th>
                <th>Received</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentClaims && dashboardData.recentClaims.length > 0 ? (
                dashboardData.recentClaims.map((claim, idx) => (
                  <tr key={idx}>
                    <td className="claim-booking-number">{claim.bookingNumber}</td>
                    <td className="claim-customer-name">{claim.customerName}</td>
                    <td className="claim-model-name">{claim.modelName}</td>
                    <td className="claim-amount-text">{formatCurrency(claim.claimAmount)}</td>
                    <td className="claim-amount-text">{formatCurrency(claim.receivedAmount)}</td>
                    <td>
                      <span className={`claim-status-badge ${claim.status === 'PENDING' ? 'status-pending' : 'status-paid'}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="claim-date-text">{formatDate(claim.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="claim-empty-state">
                    <FileText size={48} />
                    <p>No recent claims available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClaimDashboard;