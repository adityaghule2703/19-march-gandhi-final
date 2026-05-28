import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Package, AlertTriangle,
  Download, RefreshCw, Activity, Bell, AlertCircle,
  TrendingUp as TrendUp, TrendingDown as TrendDown,
  Download as DownloadIcon, Users, 
  CheckCircle, XCircle, Clock, Building2,
  Car, Gauge, Target, Flag, Wallet
} from 'lucide-react';

import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import './StockDashboard.css';

const StockDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  
  // State for API data
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalModelsWithSales: 0,
      totalStock: 0,
      totalMonthlySales: 0,
      salesVelocity: {
        high: 0,
        medium: 0,
        low: 0,
        highPercentage: "0",
        mediumPercentage: "0",
        lowPercentage: "0"
      },
      stockStatus: {
        critical: 0,
        lowStock: 0,
        moderate: 0,
        healthy: 0,
        criticalPercentage: "0",
        lowStockPercentage: "0"
      },
      alertsSummary: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        info: 0,
        averageDaysUntilOutOfStock: 0
      },
      financial: {
        estimatedInventoryValue: 0,
        estimatedMonthlyRevenue: 0,
        estimatedAnnualRevenue: 0,
        averageInventoryTurnoverRate: "0"
      },
      performance: {
        averageDaysOfInventory: "0",
        stockToSalesRatio: "0",
        topSellingModels: [],
        criticalStockModels: []
      },
      bestSeller: {
        modelName: "",
        totalSold: 0,
        currentStock: 0,
        daysOfInventory: 0
      },
      worstStock: {
        modelName: "",
        totalSold: 0,
        currentStock: 0,
        daysOfInventory: 0,
        status: "",
        recommendation: ""
      }
    },
    quickStats: {
      totalValueAtRisk: 0,
      reorderUrgency: "LOW",
      topPriorityModel: "",
      estimatedLossIfOutOfStock: 0
    }
  });

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
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

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setApiCalled(false);
    
    try {
      const url = `/low-stock/summary`;
      
      console.log('🟡 Fetching stock dashboard data from:', url);
      setApiCalled(true);
      
      const response = await axiosInstance.get(url);
      console.log('✅ Stock Dashboard API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data);
        console.log('✅ Stock dashboard data loaded successfully');
      } else {
        console.warn('⚠️ Stock Dashboard API returned success=false or no data');
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('❌ Error fetching stock dashboard:', error);
      setError(error.response?.data?.message || 'Network error. Please check your connection.');
      showError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('🟡 StockDashboard mounted - fetching data');
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
      console.log('🟡 Exporting stock report...');
      const response = await axiosInstance.get('/low-stock/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stock_report_${Date.now()}.csv`);
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
      title: 'Total Models', 
      value: formatNumber(dashboardData.summary?.totalModelsWithSales), 
      icon: Car, 
      color: "#2E7D32",
      bgColor: "#E8F5E9"
    },
    { 
      title: 'Total Stock', 
      value: formatNumber(dashboardData.summary?.totalStock), 
      icon: Package, 
      color: "#1976D2",
      bgColor: "#E3F2FD"
    },
    { 
      title: 'Monthly Sales', 
      value: formatNumber(dashboardData.summary?.totalMonthlySales), 
      icon: TrendingUp, 
      color: "#FF6F00",
      bgColor: "#FFF3E0"
    },
    { 
      title: 'Critical Alerts', 
      value: formatNumber(dashboardData.summary?.alertsSummary?.critical), 
      icon: AlertTriangle, 
      color: "#F44336",
      bgColor: "#FFEBEE"
    },
  ];

  // Sales Velocity Component
  const SalesVelocityChart = () => {
    const velocity = dashboardData.summary?.salesVelocity || {};
    const high = parseFloat(velocity.highPercentage) || 0;
    const medium = parseFloat(velocity.mediumPercentage) || 0;
    const low = parseFloat(velocity.lowPercentage) || 0;
    
    return (
      <div className="sd-velocity-chart">
        <div className="sd-velocity-item">
          <div className="sd-velocity-header">
            <span className="sd-velocity-label sd-high">High Velocity</span>
            <span className="sd-velocity-value">{velocity.high || 0} models ({high}%)</span>
          </div>
          <div className="sd-progress-bar">
            <div className="sd-progress-fill sd-high-fill" style={{ width: `${high}%` }}></div>
          </div>
        </div>
        <div className="sd-velocity-item">
          <div className="sd-velocity-header">
            <span className="sd-velocity-label sd-medium">Medium Velocity</span>
            <span className="sd-velocity-value">{velocity.medium || 0} models ({medium}%)</span>
          </div>
          <div className="sd-progress-bar">
            <div className="sd-progress-fill sd-medium-fill" style={{ width: `${medium}%` }}></div>
          </div>
        </div>
        <div className="sd-velocity-item">
          <div className="sd-velocity-header">
            <span className="sd-velocity-label sd-low">Low Velocity</span>
            <span className="sd-velocity-value">{velocity.low || 0} models ({low}%)</span>
          </div>
          <div className="sd-progress-bar">
            <div className="sd-progress-fill sd-low-fill" style={{ width: `${low}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  // Stock Status Component
  const StockStatusChart = () => {
    const status = dashboardData.summary?.stockStatus || {};
    const critical = parseFloat(status.criticalPercentage) || 0;
    const lowStock = parseFloat(status.lowStockPercentage) || 0;
    const moderate = status.moderate || 0;
    const healthy = status.healthy || 0;
    const total = critical + lowStock + moderate + healthy;
    const moderatePercent = total > 0 ? (moderate / total) * 100 : 0;
    const healthyPercent = total > 0 ? (healthy / total) * 100 : 0;
    
    return (
      <div className="sd-stock-status-chart">
        <div className="sd-status-item">
          <div className="sd-status-header">
            <span className="sd-status-label sd-critical">Critical Stock</span>
            <span className="sd-status-value">{status.critical || 0} models ({critical}%)</span>
          </div>
          <div className="sd-progress-bar">
            <div className="sd-progress-fill sd-critical-fill" style={{ width: `${critical}%` }}></div>
          </div>
        </div>
        <div className="sd-status-item">
          <div className="sd-status-header">
            <span className="sd-status-label sd-low">Low Stock</span>
            <span className="sd-status-value">{status.lowStock || 0} models ({lowStock}%)</span>
          </div>
          <div className="sd-progress-bar">
            <div className="sd-progress-fill sd-low-fill" style={{ width: `${lowStock}%` }}></div>
          </div>
        </div>
        <div className="sd-status-item">
          <div className="sd-status-header">
            <span className="sd-status-label sd-moderate">Moderate Stock</span>
            <span className="sd-status-value">{moderate} models ({moderatePercent.toFixed(1)}%)</span>
          </div>
          <div className="sd-progress-bar">
            <div className="sd-progress-fill sd-moderate-fill" style={{ width: `${moderatePercent}%` }}></div>
          </div>
        </div>
        <div className="sd-status-item">
          <div className="sd-status-header">
            <span className="sd-status-label sd-healthy">Healthy Stock</span>
            <span className="sd-status-value">{healthy} models ({healthyPercent.toFixed(1)}%)</span>
          </div>
          <div className="sd-progress-bar">
            <div className="sd-progress-fill sd-healthy-fill" style={{ width: `${healthyPercent}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  // Alerts Summary Component
  const AlertsSummary = () => {
    const alerts = dashboardData.summary?.alertsSummary || {};
    
    return (
      <div className="sd-alerts-summary">
        <div className="sd-alert-stats">
          <div className="sd-alert-stat sd-critical">
            <div className="sd-alert-count">{alerts.critical || 0}</div>
            <div className="sd-alert-label">Critical</div>
          </div>
          <div className="sd-alert-stat sd-high">
            <div className="sd-alert-count">{alerts.high || 0}</div>
            <div className="sd-alert-label">High</div>
          </div>
          <div className="sd-alert-stat sd-medium">
            <div className="sd-alert-count">{alerts.medium || 0}</div>
            <div className="sd-alert-label">Medium</div>
          </div>
          <div className="sd-alert-stat sd-info">
            <div className="sd-alert-count">{alerts.info || 0}</div>
            <div className="sd-alert-label">Info</div>
          </div>
        </div>
        <div className="sd-alert-footer">
          <div className="sd-alert-days">
            <Clock size={16} />
            <span>Avg. Days Until Out of Stock: {alerts.averageDaysUntilOutOfStock || 0} days</span>
          </div>
        </div>
      </div>
    );
  };

  // Top Selling Models Table
  const TopSellingModelsTable = () => {
    const models = dashboardData.summary?.performance?.topSellingModels || [];
    
    return (
      <div className="sd-models-table-container">
        <table className="sd-data-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Monthly Sales</th>
              <th>Current Stock</th>
              <th>Days of Inventory</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {models.length > 0 ? (
              models.map((model, idx) => {
                const status = model.daysOfInventory < 15 ? 'Critical' : 
                              model.daysOfInventory < 30 ? 'Low' : 
                              model.daysOfInventory < 60 ? 'Moderate' : 'Healthy';
                const statusClass = status === 'Critical' ? 'sd-status-critical' : 
                                   status === 'Low' ? 'sd-status-low' : 
                                   status === 'Moderate' ? 'sd-status-moderate' : 'sd-status-healthy';
                return (
                  <tr key={idx}>
                    <td className="sd-model-name">{model.name}</td>
                    <td className="sd-text-right">{formatNumber(model.sales)}</td>
                    <td className="sd-text-right">{formatNumber(model.stock)}</td>
                    <td className="sd-text-right">{model.daysOfInventory}</td>
                    <td className="sd-text-center">
                      <span className={`sd-status-badge ${statusClass}`}>{status}</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="sd-empty-state">
                  <Car size={48} />
                  <p>No data available</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Critical Stock Models Table
  const CriticalStockModelsTable = () => {
    const models = dashboardData.summary?.performance?.criticalStockModels || [];
    
    return (
      <div className="sd-models-table-container">
        <table className="sd-data-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Current Stock</th>
              <th>Monthly Sales</th>
              <th>Days of Inventory</th>
            </tr>
          </thead>
          <tbody>
            {models.length > 0 ? (
              models.map((model, idx) => (
                <tr key={idx}>
                  <td className="sd-model-name sd-critical">{model.name}</td>
                  <td className="sd-text-right sd-critical-value">{formatNumber(model.stock)}</td>
                  <td className="sd-text-right">{formatNumber(model.monthlySales)}</td>
                  <td className="sd-text-right">{model.daysOfInventory}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="sd-empty-state">
                  <CheckCircle size={48} color="#4CAF50" />
                  <p>No critical stock issues!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Loading state
  if (loading && !apiCalled) {
    return (
      <div className="sd-dashboard-loading">
        <div className="sd-dashboard-loading-content">
          <RefreshCw className="sd-dashboard-loading-spinner" />
          <p>Loading stock dashboard data...</p>
        </div>
      </div>
    );
  }

  const bestSeller = dashboardData.summary?.bestSeller;
  const worstStock = dashboardData.summary?.worstStock;
  const quickStats = dashboardData.quickStats;
  const financial = dashboardData.summary?.financial;

  return (
    <div className="stock-dashboard">
      {/* Header */}
      <div className="sd-header">
        <div>
          <h1 className="sd-title">Stock Dashboard</h1>
          <p className="sd-subtitle">Inventory management and stock monitoring</p>
        </div>
        {/* <div className="sd-actions">
          <button onClick={() => setShowAlerts(!showAlerts)} className="sd-icon-btn">
            <Bell size={20} />
            <span className="sd-alert-badge">{dashboardData.summary?.alertsSummary?.total || 0}</span>
          </button>
          <button onClick={handleExport} className="sd-icon-btn">
            <DownloadIcon size={20} />
          </button>
          <button onClick={handleRefresh} className="sd-icon-btn">
            <RefreshCw className={isRefreshing ? 'sd-spin' : ''} size={20} />
          </button>
        </div> */}
      </div>

      {/* Urgency Banner */}
      {quickStats?.reorderUrgency === 'HIGH' && (
        <div className="sd-urgency-banner sd-high">
          <AlertTriangle size={20} />
          <span>
            URGENT: High reorder urgency detected! {quickStats.topPriorityModel} needs immediate attention.
            Estimated loss if out of stock: {formatCurrency(quickStats.estimatedLossIfOutOfStock)}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="sd-error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="sd-retry-btn">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="sd-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="sd-stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="sd-stat-content">
                <div className="sd-stat-info">
                  <p className="sd-stat-title">{stat.title}</p>
                  <p className="sd-stat-value">{stat.value}</p>
                </div>
                <div className="sd-stat-icon" style={{ backgroundColor: stat.bgColor }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="sd-charts-section">
        {/* Sales Velocity */}
        <div className="sd-velocity-card">
          <div className="sd-chart-header">
            <div>
              <h3 className="sd-chart-title">Sales Velocity</h3>
              <p className="sd-chart-subtitle">Model sales speed distribution</p>
            </div>
            <Gauge size={20} style={{ color: '#FF6F00' }} />
          </div>
          <div className="sd-chart-body">
            <SalesVelocityChart />
          </div>
        </div>

        {/* Stock Status */}
        <div className="sd-stock-status-card">
          <div className="sd-chart-header">
            <div>
              <h3 className="sd-chart-title">Stock Status</h3>
              <p className="sd-chart-subtitle">Inventory health distribution</p>
            </div>
            <Package size={20} style={{ color: '#1976D2' }} />
          </div>
          <div className="sd-chart-body">
            <StockStatusChart />
          </div>
        </div>

        {/* Alerts Summary */}
        <div className="sd-alerts-card">
          <div className="sd-chart-header">
            <div>
              <h3 className="sd-chart-title">Alerts Summary</h3>
              <p className="sd-chart-subtitle">Stock alert distribution</p>
            </div>
            <Bell size={20} style={{ color: '#F44336' }} />
          </div>
          <div className="sd-chart-body">
            <AlertsSummary />
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="sd-financial-section">
        <div className="sd-financial-card">
          <div className="sd-financial-header">
            <h3 className="sd-financial-title">Financial Overview</h3>
            <Wallet size={20} style={{ color: '#FF6F00' }} />
          </div>
          <div className="sd-financial-stats">
            <div className="sd-financial-stat-item">
              <p className="sd-financial-stat-label">Estimated Inventory Value</p>
              <p className="sd-financial-stat-value">{formatCurrency(financial?.estimatedInventoryValue || 0)}</p>
            </div>
            <div className="sd-financial-stat-item">
              <p className="sd-financial-stat-label">Monthly Revenue</p>
              <p className="sd-financial-stat-value">{formatCurrency(financial?.estimatedMonthlyRevenue || 0)}</p>
            </div>
            <div className="sd-financial-stat-item">
              <p className="sd-financial-stat-label">Annual Revenue</p>
              <p className="sd-financial-stat-value">{formatCurrency(financial?.estimatedAnnualRevenue || 0)}</p>
            </div>
            <div className="sd-financial-stat-item">
              <p className="sd-financial-stat-label">Inventory Turnover Rate</p>
              <p className="sd-financial-stat-value">{financial?.averageInventoryTurnoverRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="sd-metrics-section">
        <div className="sd-metric-card">
          <div className="sd-metric-header">
            <Target size={20} style={{ color: '#2E7D32' }} />
            <h4>Best Seller</h4>
          </div>
          <div className="sd-metric-body">
            <p className="sd-metric-model">{bestSeller?.modelName || 'N/A'}</p>
            <div className="sd-metric-details">
              <span>Sold: {formatNumber(bestSeller?.totalSold || 0)} units</span>
              <span>Stock: {formatNumber(bestSeller?.currentStock || 0)} units</span>
              <span>DOI: {bestSeller?.daysOfInventory || 0} days</span>
            </div>
          </div>
        </div>

        <div className="sd-metric-card sd-warning">
          <div className="sd-metric-header">
            <AlertTriangle size={20} style={{ color: '#F44336' }} />
            <h4>Worst Stock</h4>
          </div>
          <div className="sd-metric-body">
            <p className="sd-metric-model">{worstStock?.modelName || 'N/A'}</p>
            <div className="sd-metric-details">
              <span>Status: {worstStock?.status || 'N/A'}</span>
              <span>Stock: {formatNumber(worstStock?.currentStock || 0)} units</span>
              <span>DOI: {worstStock?.daysOfInventory || 0} days</span>
            </div>
            {worstStock?.recommendation && (
              <div className="sd-metric-recommendation">
                ⚠️ {worstStock.recommendation}
              </div>
            )}
          </div>
        </div>

        <div className="sd-metric-card">
          <div className="sd-metric-header">
            <Flag size={20} style={{ color: '#FF6F00' }} />
            <h4>Quick Stats</h4>
          </div>
          <div className="sd-metric-body">
            <div className="sd-quick-stats">
              <div className="sd-quick-stat">
                <span>Value at Risk</span>
                <strong>{formatCurrency(quickStats?.totalValueAtRisk || 0)}</strong>
              </div>
              <div className="sd-quick-stat">
                <span>Reorder Urgency</span>
                <strong className={`sd-urgency-${(quickStats?.reorderUrgency || 'LOW').toLowerCase()}`}>
                  {quickStats?.reorderUrgency || 'LOW'}
                </strong>
              </div>
              <div className="sd-quick-stat">
                <span>Top Priority</span>
                <strong>{quickStats?.topPriorityModel || 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="sd-performance-section">
        <div className="sd-performance-card">
          <div className="sd-performance-header">
            <h3 className="sd-performance-title">Performance Metrics</h3>
          </div>
          <div className="sd-performance-stats">
            <div className="sd-performance-stat">
              <span className="sd-stat-label">Avg. Days of Inventory</span>
              <span className="sd-stat-value">{dashboardData.summary?.performance?.averageDaysOfInventory || 0} days</span>
            </div>
            <div className="sd-performance-stat">
              <span className="sd-stat-label">Stock to Sales Ratio</span>
              <span className="sd-stat-value">{dashboardData.summary?.performance?.stockToSalesRatio || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Models Section */}
      <div className="sd-top-models-section">
        <div className="sd-table-header">
          <h3 className="sd-table-title">Top Selling Models</h3>
          <p className="sd-table-subtitle">Best performing models by sales volume</p>
        </div>
        <TopSellingModelsTable />
      </div>

      {/* Critical Stock Models Section */}
      <div className="sd-critical-models-section">
        <div className="sd-table-header">
          <h3 className="sd-table-title">Critical Stock Models</h3>
          <p className="sd-table-subtitle">Models requiring immediate attention</p>
        </div>
        <CriticalStockModelsTable />
      </div>
    </div>
  );
};

export default StockDashboard;