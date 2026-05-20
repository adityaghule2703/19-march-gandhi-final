import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingCart, 
  Award, Eye, Download, RefreshCw,
  BarChart3, Activity, Wallet, 
  Bell, AlertCircle, TrendingUp as TrendUp, 
  TrendingDown as TrendDown,
  Download as DownloadIcon, Filter,
  Car, Building2, Users, XCircle
} from 'lucide-react';

import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import './SalesDashboard.css';

const SalesDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedChart, setSelectedChart] = useState('line');
  const [showAlerts, setShowAlerts] = useState(true);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('');
  const [apiCalled, setApiCalled] = useState(false);
  
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

  const periods = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

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

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      console.log('🟡 Fetching branches from API...');
      const response = await axiosInstance.get('/branches');
      console.log('✅ Branches API Response:', response.data);
      
      if (response.data.success) {
        setBranches(response.data.data || []);
        console.log(`✅ Loaded ${response.data.data?.length || 0} branches`);
      } else {
        console.warn('⚠️ Branches API returned success=false');
      }
    } catch (error) {
      console.error('❌ Error fetching branches:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Don't show error for branches, just continue with empty list
    }
  };

  // Fetch dashboard data from API
  const fetchDashboardData = async (period, branchId = 'all', startDate = null, endDate = null) => {
    setLoading(true);
    setError(null);
    setApiCalled(false);
    
    try {
      let url = `/dashboard/sales?period=${period}`;
      
      if (branchId && branchId !== 'all') {
        url += `&branchId=${branchId}`;
      }
      
      if (period === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      if (period === 'month' && startDate) {
        url += `&selectedDate=${startDate}`;
      }
      
      console.log(`🟡 Fetching dashboard data from: ${url}`);
      setApiCalled(true);
      
      const response = await axiosInstance.get(url);
      console.log('✅ Dashboard API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data);
        setDateRange(response.data.data.filters?.dateRange || '');
        console.log('✅ Dashboard data loaded successfully:', {
          totalSales: response.data.data.summary?.totalSales,
          totalRevenue: response.data.data.summary?.totalRevenue,
          executives: response.data.data.topSalesExecutives?.length,
          models: response.data.data.modelWiseSales?.length,
          branches: response.data.data.branchWiseSales?.length,
          trends: response.data.data.trends?.length
        });
      } else {
        console.warn('⚠️ Dashboard API returned success=false or no data');
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Network error. Please check your connection.');
      showError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Combined fetch function
  const fetchAllData = async () => {
    console.log('🟡 Starting to fetch all data...');
    await fetchBranches();
    await fetchDashboardData(selectedPeriod, selectedBranchId);
    console.log('✅ Finished fetching all data');
  };

  // Initial load and when period/branch changes
  useEffect(() => {
    console.log('🟡 useEffect triggered - period/ branch changed:', { selectedPeriod, selectedBranchId });
    fetchAllData();
  }, [selectedPeriod, selectedBranchId]);

  const handleRefresh = () => {
    console.log('🟡 Manual refresh triggered');
    setIsRefreshing(true);
    fetchAllData().finally(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  const handlePeriodChange = (period) => {
    console.log('🟡 Period changed to:', period);
    if (period !== 'custom') {
      setSelectedPeriod(period);
      setShowCustomPicker(false);
    } else {
      setShowCustomPicker(true);
    }
  };

  const handleBranchChange = (branchId) => {
    console.log('🟡 Branch changed to:', branchId);
    setSelectedBranchId(branchId);
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      console.log('🟡 Custom range applied:', { customStartDate, customEndDate });
      fetchDashboardData('custom', selectedBranchId, customStartDate, customEndDate);
      setSelectedPeriod('custom');
      setShowCustomPicker(false);
    } else {
      showError('Please select both start and end dates');
    }
  };

  const handleExport = async () => {
    try {
      console.log('🟡 Exporting report...');
      const response = await axiosInstance.get(`/dashboard/sales/export?period=${selectedPeriod}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales_report_${selectedPeriod}_${Date.now()}.csv`);
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

  const getChartData = () => {
    if (dashboardData.trends && dashboardData.trends.length > 0) {
      const labels = dashboardData.trends.map(item => item.label);
      const salesData = dashboardData.trends.map(item => item.sales);
      const revenueData = dashboardData.trends.map(item => item.revenue);
      return { labels, purchase: salesData, sale: revenueData };
    }
    
    // Fallback data if no trends available
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      purchase: [0, 0, 0, 0],
      sale: [0, 0, 0, 0]
    };
  };

  const stats = [
    { 
      title: 'Total Sales', 
      value: formatNumber(dashboardData.summary?.totalSales || 0), 
      change: dashboardData.summary?.salesGrowth ? `${dashboardData.summary.salesGrowth > 0 ? '+' : ''}${dashboardData.summary.salesGrowth.toFixed(1)}%` : "+0%", 
      changeType: dashboardData.summary?.salesGrowth > 0 ? "increase" : "decrease",
      icon: ShoppingCart, 
      color: "#2E7D32",
      bgColor: "#E8F5E9"
    },
    { 
      title: 'Total Revenue', 
      value: formatCurrency(dashboardData.summary?.totalRevenue || 0), 
      change: dashboardData.summary?.revenueGrowth ? `${dashboardData.summary.revenueGrowth > 0 ? '+' : ''}${dashboardData.summary.revenueGrowth.toFixed(1)}%` : "+0%", 
      changeType: dashboardData.summary?.revenueGrowth > 0 ? "increase" : "decrease",
      icon: DollarSign, 
      color: "#FF6F00",
      bgColor: "#FFF3E0"
    },
    { 
      title: 'Average Deal Size', 
      value: formatCurrency(dashboardData.summary?.averageDealSize || 0), 
      change: "0%", 
      changeType: "increase",
      icon: TrendingUp, 
      color: "#43A047",
      bgColor: "#E8F5E9"
    },
    { 
      title: 'Total Executives', 
      value: formatNumber(dashboardData.topSalesExecutives?.length || 0), 
      change: "+0", 
      changeType: "increase",
      icon: Users, 
      color: "#FF8F00",
      bgColor: "#FFF3E0"
    },
  ];

  const LineChart = () => {
    const chartData = getChartData();
    const maxValue = Math.max(...chartData.purchase, ...chartData.sale, 1);
    const height = 200;
    const width = 500;
    const padding = 40;
    
    const getPoints = (values) => {
      if (values.length === 0) return '';
      const step = (width - padding * 2) / (values.length - 1);
      return values.map((value, index) => {
        const x = padding + index * step;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        return `${x},${y}`;
      }).join(' ');
    };

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + (1 - ratio) * (height - padding * 2);
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#E8F5E9" strokeWidth="1" strokeDasharray="4" />
              <text x={padding - 5} y={y} textAnchor="end" fontSize="10" fill="#8D6E63">
                ₹{(maxValue * ratio).toFixed(0)}
              </text>
            </g>
          );
        })}
        
        {chartData.purchase.length > 0 && chartData.purchase.some(v => v > 0) && (
          <polyline
            points={getPoints(chartData.purchase)}
            fill="none"
            stroke="#2E7D32"
            strokeWidth="2.5"
            className="line-chart-purchase"
          />
        )}
        
        {chartData.sale.length > 0 && chartData.sale.some(v => v > 0) && (
          <polyline
            points={getPoints(chartData.sale)}
            fill="none"
            stroke="#FF6F00"
            strokeWidth="2.5"
            className="line-chart-sale"
          />
        )}
        
        {chartData.labels.map((label, index) => {
          const step = (width - padding * 2) / (chartData.labels.length - 1);
          const x = padding + index * step;
          return (
            <text key={index} x={x} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#8D6E63">
              {label}
            </text>
          );
        })}
      </svg>
    );
  };

  // Loading state
  if (loading && !apiCalled) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-content">
          <RefreshCw className="dashboard-loading-spinner" />
          <p>Loading dashboard data...</p>
          <p className="debug-text">Calling API: /dashboard/sales?period={selectedPeriod}</p>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const topModel = dashboardData.insights?.topPerformingModel;
  const topBranch = dashboardData.insights?.topPerformingBranch;
  const topExecutive = dashboardData.insights?.topPerformingSE;

  return (
    <div className="sales-dashboard">
     

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Sales Dashboard</h1>
          <p className="dashboard-subtitle">
            Last updated: {dashboardData.generatedAt ? formatDateTime(dashboardData.generatedAt) : 'Just now'}
          </p>
        </div>
        <div className="dashboard-actions">
          <div className="period-selector">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                className={`period-btn ${selectedPeriod === period.value && !showCustomPicker ? 'period-btn-active' : ''}`}
              >
                {period.label}
              </button>
            ))}
          </div>

          <select
            value={selectedBranchId}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="branch-select"
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>

          {showCustomPicker && (
            <div className="custom-picker">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="date-input"
              />
              <span>→</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="date-input"
              />
              <button onClick={handleCustomApply} className="apply-btn">
                Apply
              </button>
              <button onClick={() => setShowCustomPicker(false)} className="close-picker-btn">
                <XCircle size={16} />
              </button>
            </div>
          )}

          <button onClick={() => setShowAlerts(!showAlerts)} className="icon-btn">
            <Bell size={20} />
            <span className="alert-badge">3</span>
          </button>
          <button onClick={handleExport} className="icon-btn">
            <DownloadIcon size={20} />
          </button>
          <button onClick={handleRefresh} className="icon-btn">
            <RefreshCw className={isRefreshing ? 'spin' : ''} size={20} />
          </button>
        </div>
      </div>

      {/* Date Range Display */}
      {dateRange && (
        <div className="date-range-badge">
          📅 {dateRange}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchAllData} className="retry-btn">
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

      {/* Charts Section */}
      <div className="charts-section">
        {/* Main Chart */}
        <div className="main-chart">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Revenue Overview</h3>
              <p className="chart-subtitle">Sales vs Revenue trends over time</p>
            </div>
            <div className="chart-controls">
              <div className="chart-period-btns">
                {['week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`chart-period-btn ${selectedPeriod === period ? 'chart-period-active' : ''}`}
                  >
                    {period === 'week' ? 'Weekly' : 'Monthly'}
                  </button>
                ))}
              </div>
              <div className="chart-type-btns">
                <button
                  onClick={() => setSelectedChart('line')}
                  className={`chart-type-btn ${selectedChart === 'line' ? 'chart-type-active' : ''}`}
                >
                  <TrendUp size={16} />
                </button>
                <button
                  onClick={() => setSelectedChart('bar')}
                  className={`chart-type-btn ${selectedChart === 'bar' ? 'chart-type-active' : ''}`}
                >
                  <BarChart3 size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="chart-body">
            {selectedChart === 'line' ? (
              <LineChart />
            ) : (
              <div className="bar-chart">
                {chartData.labels.map((label, idx) => {
                  const purchaseValue = chartData.purchase[idx] || 0;
                  const saleValue = chartData.sale[idx] || 0;
                  const maxValue = Math.max(...chartData.purchase, ...chartData.sale, 1);
                  
                  return (
                    <div key={idx} className="bar-item">
                      <div className="bar-labels">
                        <span className="bar-label">{label}</span>
                        <div className="bar-values">
                          <span className="bar-sales">Sales: {formatNumber(purchaseValue)} units</span>
                          <span className="bar-revenue">Revenue: {formatCurrency(saleValue)}</span>
                        </div>
                      </div>
                      <div className="bars-container">
                        <div 
                          className="bar-purchase"
                          style={{ width: `${(purchaseValue / maxValue) * 100}%` }}
                        >
                          <div className="bar-tooltip">{formatNumber(purchaseValue)} units</div>
                        </div>
                        <div 
                          className="bar-sale"
                          style={{ width: `${(saleValue / maxValue) * 100}%` }}
                        >
                          <div className="bar-tooltip">{formatCurrency(saleValue)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color sales-legend"></div>
                <span>Sales (Units)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color revenue-legend"></div>
                <span>Revenue (₹)</span>
              </div>
            </div>
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

      {/* Model Wise & Branch Wise Sales Tables */}
      <div className="tables-section">
        {/* Model Wise Sales */}
        <div className="model-table">
          <div className="table-header">
            <h3 className="table-title">Model Wise Sales</h3>
            <p className="table-subtitle">Sales breakdown by vehicle model</p>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Revenue</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.modelWiseSales && dashboardData.modelWiseSales.length > 0 ? (
                  dashboardData.modelWiseSales.slice(0, 5).map((model, idx) => (
                    <tr key={model.id || idx}>
                      <td className="model-name">{model.name}</td>
                      <td className="text-center">
                        <span className={`model-type-badge ${model.type === 'EV' ? 'type-ev' : 'type-ice'}`}>
                          {model.type}
                        </span>
                      </td>
                      <td className="text-right">{model.quantity}</td>
                      <td className="text-right revenue-text">{formatCurrency(model.totalRevenue)}</td>
                      <td className="text-right">
                        <div className="share-container">
                          <div className="share-bar-bg">
                            <div className="share-bar" style={{ width: `${model.revenuePercentage}%` }}></div>
                          </div>
                          <span className="share-value">{model.revenuePercentage?.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <Car size={48} />
                      <p>No model data available</p>
                      {!loading && <p className="debug-hint">Try selecting a different period or branch</p>}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Branch Wise Sales */}
        <div className="branch-table">
          <div className="table-header">
            <h3 className="table-title">Branch Wise Sales</h3>
            <p className="table-subtitle">Sales breakdown by branch location</p>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>City</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                  <th>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.branchWiseSales && dashboardData.branchWiseSales.length > 0 ? (
                  dashboardData.branchWiseSales.map((branch, idx) => (
                    <tr key={branch.id || idx}>
                      <td className="branch-name">{branch.name}</td>
                      <td>{branch.city}</td>
                      <td className="text-right">{branch.quantity} units</td>
                      <td className="text-right revenue-text">{formatCurrency(branch.totalRevenue)}</td>
                      <td className="text-right">
                        <div className="share-container">
                          <div className="share-bar-bg">
                            <div className="share-bar-orange" style={{ width: `${branch.contributionPercentage}%` }}></div>
                          </div>
                          <span className="share-value">{branch.contributionPercentage?.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <Building2 size={48} />
                      <p>No branch data available</p>
                      {!loading && <p className="debug-hint">Try selecting a different period or branch</p>}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Sales Executives Section */}
      <div className="executives-section">
        <div className="table-header">
          <h3 className="table-title">Top Sales Executives</h3>
          <p className="table-subtitle">Best performing sales representatives</p>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Executive</th>
                <th>Contact</th>
                <th>Total Sales</th>
                <th>Total Revenue</th>
                <th>Avg. Deal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.topSalesExecutives && dashboardData.topSalesExecutives.length > 0 ? (
                dashboardData.topSalesExecutives.map((exec, idx) => (
                  <tr key={exec.id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="executive-name">{exec.name}</div>
                      <div className="executive-id">ID: {exec.id?.slice(-8)}</div>
                    </td>
                    <td>
                      <div>{exec.mobile}</div>
                      <div className="executive-email">{exec.email}</div>
                    </td>
                    <td className="text-right">{exec.totalSales} units</td>
                    <td className="text-right revenue-text">{formatCurrency(exec.totalRevenue)}</td>
                    <td className="text-right">{formatCurrency(exec.averageDealSize || (exec.totalRevenue / exec.totalSales))}</td>
                    <td className="text-center">
                      <button className="view-btn">
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <Users size={48} />
                    <p>No executive data available</p>
                    {!loading && <p className="debug-hint">Try selecting a different period or branch</p>}
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

export default SalesDashboard;