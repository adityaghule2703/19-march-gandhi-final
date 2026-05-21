import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingCart, 
  Award, Activity, Wallet, 
  AlertCircle, TrendingUp as TrendUp, 
  TrendingDown as TrendDown,
  Car, Building2, Users
} from 'lucide-react';

import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import './SalesDashboard.css';

const SalesDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('');
  
  // State for API data
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalSales: 0,
      totalRevenue: 0,
      averageDealSize: 0,
      revenueGrowth: 0,
      salesGrowth: 0
    },
    topSalesExecutives: [],
    modelWiseSales: [],
    branchWiseSales: [],
    trends: [],
    insights: {
      topPerformingModel: null,
      topPerformingBranch: null,
      topPerformingSE: null,
      bookingTypeBreakdown: { branch: 0, subdealer: 0 },
      modelTypeBreakdown: { ev: 0, ice: 0 }
    },
    generatedAt: null
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
  const fetchDashboardData = async (period = 'month') => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/dashboard/sales?period=${period}`;
      
      console.log(`🟡 Fetching dashboard data from: ${url}`);
      
      const response = await axiosInstance.get(url);
      console.log('✅ Dashboard API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data);
        setDateRange(response.data.data.filters?.dateRange || '');
        console.log('✅ Dashboard data loaded successfully');
      } else {
        console.warn('⚠️ Dashboard API returned success=false or no data');
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      setError(error.response?.data?.message || 'Network error. Please check your connection.');
      showError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('🟡 Initial load - fetching dashboard data');
    fetchDashboardData('month');
  }, []);

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    fetchDashboardData(period);
  };

  const stats = [
    { 
      title: 'Total Sales', 
      value: formatNumber(dashboardData.summary?.totalSales || 0), 
      change: dashboardData.summary?.salesGrowth ? `${dashboardData.summary.salesGrowth > 0 ? '+' : ''}${dashboardData.summary.salesGrowth.toFixed(1)}%` : "+0%", 
      changeType: dashboardData.summary?.salesGrowth > 0 ? "increase" : "decrease",
      icon: ShoppingCart, 
      color: "#183883",
      bgColor: "#E8EEF9"
    },
    { 
      title: 'Total Revenue', 
      value: formatCurrency(dashboardData.summary?.totalRevenue || 0), 
      change: dashboardData.summary?.revenueGrowth ? `${dashboardData.summary.revenueGrowth > 0 ? '+' : ''}${dashboardData.summary.revenueGrowth.toFixed(1)}%` : "+0%", 
      changeType: dashboardData.summary?.revenueGrowth > 0 ? "increase" : "decrease",
      icon: DollarSign, 
      color: "#DF2C2A",
      bgColor: "#FDE8E8"
    },
    { 
      title: 'Average Deal Size', 
      value: formatCurrency(dashboardData.summary?.averageDealSize || 0), 
      change: "0%", 
      changeType: "increase",
      icon: TrendingUp, 
      color: "#183883",
      bgColor: "#E8EEF9"
    },
    { 
      title: 'Total Executives', 
      value: formatNumber(dashboardData.topSalesExecutives?.length || 0), 
      change: "+0", 
      changeType: "increase",
      icon: Users, 
      color: "#DF2C2A",
      bgColor: "#FDE8E8"
    },
  ];

  // Branch Bar Chart Component with X and Y Axis
  const BranchBarChart = () => {
    const branchData = dashboardData.branchWiseSales || [];
    
    if (branchData.length === 0) {
      return (
        <div className="empty-chart">
          <Building2 size={48} />
          <p>No branch data available</p>
        </div>
      );
    }

    const maxRevenue = Math.max(...branchData.map(b => b.totalRevenue), 1);
    // Calculate dynamic width based on number of branches
    const barWidth = 50;
    const barSpacing = 30;
    const chartWidth = Math.max(600, (barWidth + barSpacing) * branchData.length + 200);
    const chartHeight = 450;
    const padding = { top: 20, right: 80, bottom: 80, left: 100 };
    const graphWidth = chartWidth - padding.left - padding.right;
    const graphHeight = chartHeight - padding.top - padding.bottom;
    
    const getX = (index) => {
      const totalBarsWidth = branchData.length * barWidth;
      const totalSpacing = (branchData.length - 1) * barSpacing;
      const startX = padding.left + (graphWidth - (totalBarsWidth + totalSpacing)) / 2;
      return startX + index * (barWidth + barSpacing);
    };
    
    const getY = (revenue) => {
      return chartHeight - padding.bottom - (revenue / maxRevenue) * graphHeight;
    };
    
    const getBarHeight = (revenue) => {
      return (revenue / maxRevenue) * graphHeight;
    };

    // Function to truncate branch name
    const truncateName = (name, maxLength = 12) => {
      return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
    };

    return (
      <div className="branch-chart-container">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" className="branch-chart-svg">
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
            const y = getY(maxRevenue * ratio);
            const value = maxRevenue * ratio;
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
          {branchData.map((branch, index) => {
            const x = getX(index);
            const barHeight = getBarHeight(branch.totalRevenue);
            const y = getY(branch.totalRevenue);
            
            return (
              <g key={branch.id || index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#gradient)"
                  rx="4"
                  ry="4"
                  className="branch-bar-rect"
                >
                  <title>{`${branch.name}: ${formatCurrency(branch.totalRevenue)} (${branch.quantity} units)`}</title>
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
                  {branch.quantity}
                </text>
                
                {/* X-axis label (branch name) - Horizontal */}
                <text 
                  x={x + barWidth / 2} 
                  y={chartHeight - padding.bottom + 20} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#183883" 
                  fontWeight="500"
                  className="branch-name-label"
                >
                  {truncateName(branch.name, 12)}
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
          <div className="y-axis-label">Revenue →</div>
          <div className="x-axis-label">Branches →</div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-content">
          <div className="dashboard-loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const topModel = dashboardData.insights?.topPerformingModel;
  const topBranch = dashboardData.insights?.topPerformingBranch;
  const topExecutive = dashboardData.insights?.topPerformingSE;

  return (
    <div className="sales-dashboard">
      {/* Header with Filters */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Sales Dashboard</h1>
          <p className="dashboard-subtitle">
            Last updated: {dashboardData.generatedAt ? formatDateTime(dashboardData.generatedAt) : 'Just now'}
          </p>
        </div>
        <div className="filter-buttons">
          <button 
            onClick={() => handlePeriodChange('day')}
            className={`filter-btn ${selectedPeriod === 'day' ? 'filter-btn-active' : ''}`}
          >
            Today
          </button>
          <button 
            onClick={() => handlePeriodChange('month')}
            className={`filter-btn ${selectedPeriod === 'month' ? 'filter-btn-active' : ''}`}
          >
            Month
          </button>
          <button 
            onClick={() => handlePeriodChange('year')}
            className={`filter-btn ${selectedPeriod === 'year' ? 'filter-btn-active' : ''}`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => fetchDashboardData(selectedPeriod)} className="retry-btn">
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
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                  <div className="stat-change">
                    {isIncrease ? <TrendUp size={12} /> : <TrendDown size={12} />}
                    <span className={isIncrease ? 'change-positive' : 'change-negative'}>
                      {stat.change}
                    </span>
                    <span className="change-label">from last period</span>
                  </div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section - Branch Wise Sales with X/Y Axis */}
      <div className="charts-section">
        <div className="main-chart">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Branch Wise Sales Overview</h3>
              <p className="chart-subtitle">Revenue comparison across branches</p>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color revenue-legend"></div>
                <span>Revenue (₹)</span>
              </div>
            </div>
          </div>
          <div className="chart-body">
            <BranchBarChart />
          </div>
        </div>

        {/* Right Side Stats */}
        <div className="side-stats">
          <div className="revenue-card">
            <div className="revenue-card-content">
              <div>
                <p className="revenue-label">Total Revenue</p>
                <p className="revenue-value">{formatCurrency(dashboardData.summary?.totalRevenue || 0)}</p>
                <p className="revenue-subtext">from all branches</p>
              </div>
              <Wallet size={32} />
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-header">
              <h4 className="performance-title">Performance Overview</h4>
              <Activity size={16} />
            </div>
            <div className="performance-metrics">
              <div className="metric-item">
                <div className="metric-header">
                  <span>EV vs ICE Sales</span>
                  <span>
                    EV: {dashboardData.insights?.modelTypeBreakdown?.ev || 0} | 
                    ICE: {dashboardData.insights?.modelTypeBreakdown?.ice || 0}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-ev"
                    style={{ width: `${((dashboardData.insights?.modelTypeBreakdown?.ev || 0) / ((dashboardData.insights?.modelTypeBreakdown?.ev || 0) + (dashboardData.insights?.modelTypeBreakdown?.ice || 1)) * 100)}%` }}
                  ></div>
                  <div 
                    className="progress-ice"
                    style={{ width: `${((dashboardData.insights?.modelTypeBreakdown?.ice || 0) / ((dashboardData.insights?.modelTypeBreakdown?.ev || 0) + (dashboardData.insights?.modelTypeBreakdown?.ice || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-header">
                  <span>Booking Type</span>
                  <span>
                    Branch: {dashboardData.insights?.bookingTypeBreakdown?.branch || 0} | 
                    Subdealer: {dashboardData.insights?.bookingTypeBreakdown?.subdealer || 0}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-branch"
                    style={{ width: `${((dashboardData.insights?.bookingTypeBreakdown?.branch || 0) / ((dashboardData.insights?.bookingTypeBreakdown?.branch || 0) + (dashboardData.insights?.bookingTypeBreakdown?.subdealer || 1)) * 100)}%` }}
                  ></div>
                  <div 
                    className="progress-subdealer"
                    style={{ width: `${((dashboardData.insights?.bookingTypeBreakdown?.subdealer || 0) / ((dashboardData.insights?.bookingTypeBreakdown?.branch || 0) + (dashboardData.insights?.bookingTypeBreakdown?.subdealer || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="performers-card">
            <div className="performers-header">
              <h4 className="performers-title">Top Performers</h4>
              <Award size={16} />
            </div>
            <div className="performers-list">
              <div className="performer-item">
                <div>
                  <p className="performer-label">Top Model</p>
                  <p className="performer-name">{topModel?.name || 'No data available'}</p>
                </div>
                <span className="performer-value">{topModel?.quantity || '-'} units</span>
              </div>
              <div className="performer-item">
                <div>
                  <p className="performer-label">Top Branch</p>
                  <p className="performer-name">{topBranch?.name || 'No data available'}</p>
                </div>
                <span className="performer-value">{formatCurrency(topBranch?.totalRevenue || 0)}</span>
              </div>
              <div className="performer-item">
                <div>
                  <p className="performer-label">Top Executive</p>
                  <p className="performer-name">{topExecutive?.name || 'No data available'}</p>
                </div>
                <span className="performer-value">{topExecutive?.totalSales || '-'} sales</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;