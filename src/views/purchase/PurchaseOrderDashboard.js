import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Package, AlertTriangle,
  Download, RefreshCw, Activity, Bell, AlertCircle,
  TrendingUp as TrendUp, TrendingDown as TrendDown,
  Download as DownloadIcon, Search,
  Eye, Clock, Truck,
  BarChart3, Target, Flag, XCircle,
  CheckCircle, Minus
} from 'lucide-react';

import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import './PurchaseOrderDashboard.css';

const PurchaseOrderDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrend, setFilterTrend] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // State for API data
  const [dashboardData, setDashboardData] = useState({
    analytics: [],
    summary: {
      totalModelsWithSales: 0,
      totalStock: 0,
      total120DaySales: 0,
      averageMonthlySales: "0",
      trendDistribution: {
        increasing: 0,
        decreasing: 0,
        stable: 0,
        increasingPercentage: "0",
        decreasingPercentage: "0"
      },
      topGrowingModels: [],
      decliningModels: []
    },
    periodType: "120_DAYS",
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
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setApiCalled(false);
    
    try {
      const url = `/low-stock/dashboard-120day`;
      
      console.log('🟡 Fetching inventory analytics data from:', url);
      setApiCalled(true);
      
      const response = await axiosInstance.get(url);
      console.log('✅ Inventory Analytics API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data);
        console.log('✅ Inventory analytics loaded successfully');
      } else {
        console.warn('⚠️ Inventory Analytics API returned success=false or no data');
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('❌ Error fetching inventory analytics:', error);
      setError(error.response?.data?.message || 'Network error. Please check your connection.');
      showError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('🟡 PurchaseOrderDashboard mounted - fetching data');
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
      console.log('🟡 Exporting inventory report...');
      const response = await axiosInstance.get('/low-stock/dashboard-120day/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory_analytics_120day_${Date.now()}.csv`);
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

  const handleViewDetails = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  // Get trend icon and color
  const getTrendInfo = (trend, percentage) => {
    if (trend === 'INCREASING') {
      return { icon: <TrendUp size={16} />, color: '#4CAF50', sign: '+', bgColor: '#E8F5E9' };
    } else if (trend === 'DECREASING') {
      return { icon: <TrendDown size={16} />, color: '#F44336', sign: '', bgColor: '#FFEBEE' };
    } else {
      return { icon: <Minus size={16} />, color: '#FF9800', sign: '', bgColor: '#FFF3E0' };
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'CRITICAL':
        return { text: '🔴 CRITICAL', class: 'pod-status-critical' };
      case 'LOW_STOCK':
        return { text: '🟡 LOW STOCK', class: 'pod-status-low' };
      case 'MODERATE':
        return { text: '🟠 MODERATE', class: 'pod-status-moderate' };
      default:
        return { text: '🟢 HEALTHY', class: 'pod-status-healthy' };
    }
  };

  // Filter analytics data
  const filteredAnalytics = dashboardData.analytics?.filter(item => {
    const matchesSearch = item.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrend = filterTrend === 'all' || item.trend === filterTrend.toUpperCase();
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus.toUpperCase();
    const matchesType = filterType === 'all' || item.modelType === filterType.toUpperCase();
    return matchesSearch && matchesTrend && matchesStatus && matchesType;
  }) || [];

  // Calculate alerts
  const criticalModels = dashboardData.analytics?.filter(item => item.status === 'CRITICAL') || [];
  const lowStockModels = dashboardData.analytics?.filter(item => item.status === 'LOW_STOCK') || [];
  const highGrowthModels = dashboardData.summary?.topGrowingModels?.slice(0, 3) || [];

  // Stats cards
  const stats = [
    { title: 'Total Stock', value: formatNumber(dashboardData.summary?.totalStock), icon: Package, color: '#2E7D32', bgColor: '#E8F5E9' },
    { title: '120 Days Sales', value: formatNumber(dashboardData.summary?.total120DaySales), icon: TrendingUp, color: '#1976D2', bgColor: '#E3F2FD' },
    { title: 'Avg Monthly Sales', value: dashboardData.summary?.averageMonthlySales, icon: Activity, color: '#FF6F00', bgColor: '#FFF3E0' },
    { title: 'Total SKUs', value: formatNumber(dashboardData.summary?.totalModelsWithSales), icon: Package, color: '#9C27B0', bgColor: '#F3E5F5' }
  ];

  // Loading state
  if (loading && !apiCalled) {
    return (
      <div className="pod-dashboard-loading">
        <div className="pod-dashboard-loading-content">
          <RefreshCw className="pod-dashboard-loading-spinner" />
          <p>Loading inventory analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-order-dashboard">
      {/* Header */}
      <div className="pod-header">
        <div>
          <h1 className="pod-title">
            <BarChart3 size={24} className="pod-title-icon" />
            Inventory Analytics Dashboard (120 Days Trend)
          </h1>
          <p className="pod-subtitle">
            Generated: {dashboardData.generatedAt ? formatDateTime(dashboardData.generatedAt) : 'Just now'}
          </p>
        </div>
        {/* <div className="pod-actions">
          <button onClick={() => setShowAlerts(!showAlerts)} className="pod-icon-btn">
            <Bell size={20} />
            <span className="pod-alert-badge">{criticalModels.length + lowStockModels.length}</span>
          </button>
          <button onClick={handleExport} className="pod-icon-btn">
            <DownloadIcon size={20} />
          </button>
          <button onClick={handleRefresh} className="pod-icon-btn">
            <RefreshCw className={isRefreshing ? 'pod-spin' : ''} size={20} />
          </button>
        </div> */}
      </div>

      {/* Error Message */}
      {error && (
        <div className="pod-error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="pod-retry-btn">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="pod-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="pod-stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="pod-stat-content">
                <div className="pod-stat-info">
                  <p className="pod-stat-title">{stat.title}</p>
                  <p className="pod-stat-value">{stat.value}</p>
                </div>
                <div className="pod-stat-icon" style={{ backgroundColor: stat.bgColor }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Distribution Section */}
      <div className="pod-trend-section">
        <div className="pod-trend-card">
          <div className="pod-trend-header">
            <h3 className="pod-trend-title">Trend Distribution</h3>
          </div>
          <div className="pod-trend-distribution">
            <div className="pod-trend-item">
              <div className="pod-trend-label">
                <span className="pod-trend-increasing">▲ Increasing</span>
                <span className="pod-trend-count">{dashboardData.summary?.trendDistribution?.increasing || 0} models</span>
              </div>
              <div className="pod-progress-bar-bg">
                <div 
                  className="pod-progress-bar-fill pod-increasing-fill" 
                  style={{ width: `${dashboardData.summary?.trendDistribution?.increasingPercentage || 0}%` }}
                ></div>
              </div>
              <span className="pod-trend-percentage">{dashboardData.summary?.trendDistribution?.increasingPercentage || 0}%</span>
            </div>
            <div className="pod-trend-item">
              <div className="pod-trend-label">
                <span className="pod-trend-stable">● Stable</span>
                <span className="pod-trend-count">{dashboardData.summary?.trendDistribution?.stable || 0} models</span>
              </div>
              <div className="pod-progress-bar-bg">
                <div 
                  className="pod-progress-bar-fill pod-stable-fill" 
                  style={{ width: `${((dashboardData.summary?.trendDistribution?.stable || 0) / (dashboardData.summary?.totalModelsWithSales || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="pod-trend-percentage">{((dashboardData.summary?.trendDistribution?.stable || 0) / (dashboardData.summary?.totalModelsWithSales || 1) * 100).toFixed(1)}%</span>
            </div>
            <div className="pod-trend-item">
              <div className="pod-trend-label">
                <span className="pod-trend-decreasing">▼ Decreasing</span>
                <span className="pod-trend-count">{dashboardData.summary?.trendDistribution?.decreasing || 0} models</span>
              </div>
              <div className="pod-progress-bar-bg">
                <div 
                  className="pod-progress-bar-fill pod-decreasing-fill" 
                  style={{ width: `${dashboardData.summary?.trendDistribution?.decreasingPercentage || 0}%` }}
                ></div>
              </div>
              <span className="pod-trend-percentage">{dashboardData.summary?.trendDistribution?.decreasingPercentage || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="pod-filters-section">
        <div className="pod-filters-container">
          <div className="pod-filter-group">
            <label>Model Type:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="pod-filter-select">
              <option value="all">All Types</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </select>
          </div>
          <div className="pod-filter-group">
            <label>Trend:</label>
            <select value={filterTrend} onChange={(e) => setFilterTrend(e.target.value)} className="pod-filter-select">
              <option value="all">All Trends</option>
              <option value="INCREASING">Increasing</option>
              <option value="STABLE">Stable</option>
              <option value="DECREASING">Decreasing</option>
            </select>
          </div>
          <div className="pod-filter-group">
            <label>Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="pod-filter-select">
              <option value="all">All Status</option>
              <option value="CRITICAL">Critical</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="MODERATE">Moderate</option>
              <option value="HEALTHY">Healthy</option>
            </select>
          </div>
          <div className="pod-search-group">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pod-search-input"
            />
          </div>
        </div>
      </div>

      {/* Model Inventory Table */}
      <div className="pod-inventory-table-section">
        <div className="pod-table-header">
          <h3 className="pod-table-title">Model Inventory List</h3>
          <p className="pod-table-subtitle">Showing {filteredAnalytics.length} of {dashboardData.analytics?.length} models</p>
        </div>
        <div className="pod-table-container">
          <table className="pod-inventory-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Type</th>
                <th>Trend</th>
                <th>120D Sales</th>
                <th>Current Stock</th>
                <th>Forecast (Next 30D)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalytics.length > 0 ? (
                filteredAnalytics.map((item, idx) => {
                  const trendInfo = getTrendInfo(item.trend, item.trendPercentage);
                  const statusBadge = getStatusBadge(item.status);
                  return (
                    <tr key={item.modelId} className={item.status === 'CRITICAL' ? 'pod-critical-row' : ''}>
                      <td className="pod-model-name">{item.modelName}</td>
                      <td className="pod-text-center">
                        <span className={`pod-model-type-badge ${item.modelType === 'EV' ? 'pod-type-ev' : 'pod-type-ice'}`}>
                          {item.modelType}
                        </span>
                      </td>
                      <td>
                        <div className="pod-trend-indicator" style={{ backgroundColor: trendInfo.bgColor }}>
                          {trendInfo.icon}
                          <span style={{ color: trendInfo.color }}>
                            {trendInfo.sign}{item.trendPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="pod-text-right">{formatNumber(item.totalSold120Days)}</td>
                      <td className={`pod-text-right ${item.currentStock === 0 ? 'pod-stock-zero' : ''}`}>
                        {formatNumber(item.currentStock)}
                      </td>
                      <td className="pod-text-right pod-forecast-value">{formatNumber(Math.round(item.forecastNextMonth))}</td>
                      <td className="pod-text-center">
                        <span className={`pod-status-badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="pod-empty-state">
                    <Package size={48} />
                    <p>No models found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts & Recommendations */}
      <div className="pod-alerts-section">
        <div className="pod-alerts-card">
          <div className="pod-alerts-header">
            <AlertTriangle size={20} style={{ color: '#F44336' }} />
            <h3 className="pod-alerts-title">Alerts & Recommendations</h3>
          </div>
          <div className="pod-alerts-list">
            {criticalModels.length > 0 && (
              <div className="pod-alert-item pod-critical">
                <XCircle size={18} />
                <span>
                  <strong>CRITICAL:</strong> {criticalModels.length} model{criticalModels.length > 1 ? 's are' : ' is'} out of stock – Order immediately
                </span>
              </div>
            )}
            {lowStockModels.length > 0 && (
              <div className="pod-alert-item pod-warning">
                <AlertTriangle size={18} />
                <span>
                  <strong>LOW STOCK:</strong> {lowStockModels.length} model{lowStockModels.length > 1 ? 's are' : ' is'} below safety buffer
                </span>
              </div>
            )}
            {highGrowthModels.map((model, idx) => (
              <div key={idx} className="pod-alert-item pod-info">
                <TrendUp size={18} />
                <span>
                  <strong>HIGH GROWTH:</strong> {model.name} needs {formatNumber(Math.max(0, Math.round(model.forecastNextMonth - (model.currentStock || 0))))} additional units next month
                </span>
              </div>
            ))}
            {criticalModels.length === 0 && lowStockModels.length === 0 && highGrowthModels.length === 0 && (
              <div className="pod-alert-item pod-success">
                <CheckCircle size={18} />
                <span>No critical alerts. Inventory levels are healthy!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Growing & Declining Models */}
      <div className="pod-growth-decline-section">
        <div className="pod-growth-card">
          <div className="pod-growth-header">
            <TrendUp size={20} style={{ color: '#4CAF50' }} />
            <h4>Top Growing Models</h4>
          </div>
          <div className="pod-growth-list">
            {dashboardData.summary?.topGrowingModels?.slice(0, 5).map((model, idx) => (
              <div key={idx} className="pod-growth-item">
                <div className="pod-growth-info">
                  <span className="pod-growth-name">{model.name}</span>
                  <span className="pod-growth-stock">Stock: {formatNumber(model.currentStock)}</span>
                </div>
                <div className="pod-growth-stats">
                  <span className="pod-growth-percent pod-positive">+{model.growth}%</span>
                  <span className="pod-growth-forecast">Forecast: {formatNumber(Math.round(model.forecastNextMonth))}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pod-decline-card">
          <div className="pod-decline-header">
            <TrendDown size={20} style={{ color: '#F44336' }} />
            <h4>Declining Models</h4>
          </div>
          <div className="pod-decline-list">
            {dashboardData.summary?.decliningModels?.slice(0, 5).map((model, idx) => (
              <div key={idx} className="pod-decline-item">
                <div className="pod-decline-info">
                  <span className="pod-decline-name">{model.name}</span>
                  <span className="pod-decline-stock">Stock: {formatNumber(model.currentStock)}</span>
                </div>
                <div className="pod-decline-stats">
                  <span className="pod-decline-percent pod-negative">-{model.decline}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Model Details */}
      {showModal && selectedModel && (
        <div className="pod-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="pod-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pod-modal-header">
              <h3>Model Details</h3>
              <button className="pod-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="pod-modal-body">
              <div className="pod-detail-row">
                <span className="pod-detail-label">Model Name:</span>
                <span className="pod-detail-value">{selectedModel.modelName}</span>
              </div>
              <div className="pod-detail-row">
                <span className="pod-detail-label">Model Type:</span>
                <span className="pod-detail-value">{selectedModel.modelType}</span>
              </div>
              <div className="pod-detail-row">
                <span className="pod-detail-label">120 Days Sales:</span>
                <span className="pod-detail-value">{formatNumber(selectedModel.totalSold120Days)}</span>
              </div>
              <div className="pod-detail-row">
                <span className="pod-detail-label">Average Monthly Sales:</span>
                <span className="pod-detail-value">{formatNumber(selectedModel.averageMonthlySales)}</span>
              </div>
              <div className="pod-detail-row">
                <span className="pod-detail-label">Trend:</span>
                <span className="pod-detail-value">{selectedModel.trend} ({selectedModel.trendPercentage > 0 ? '+' : ''}{selectedModel.trendPercentage}%)</span>
              </div>
              <div className="pod-detail-row">
                <span className="pod-detail-label">Current Stock:</span>
                <span className="pod-detail-value">{formatNumber(selectedModel.currentStock)}</span>
              </div>
              <div className="pod-detail-row">
                <span className="pod-detail-label">Forecast (Next Month):</span>
                <span className="pod-detail-value">{formatNumber(Math.round(selectedModel.forecastNextMonth))}</span>
              </div>
            </div>
            <div className="pod-modal-footer">
              <button className="pod-btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button className="pod-btn-primary">Create Purchase Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderDashboard;