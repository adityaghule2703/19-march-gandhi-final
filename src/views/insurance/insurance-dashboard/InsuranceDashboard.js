import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingCart, Shield, 
  Award, Eye, Download, RefreshCw, FileText, 
  Activity, Wallet, Bell, AlertCircle, 
  TrendingUp as TrendUp, TrendingDown as TrendDown,
  Download as DownloadIcon, Filter, Users, 
  CheckCircle, XCircle, Clock, Calendar, Building2,
  PieChart, BarChart3, Car
} from 'lucide-react';

import { showError, showSuccess } from '../../../utils/sweetAlerts';
import axiosInstance from '../../../axiosInstance';
import './InsuranceDashboard.css';

const InsuranceDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedChart, setSelectedChart] = useState('pie');
  const [showAlerts, setShowAlerts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  
  // State for API data
  const [dashboardData, setDashboardData] = useState({
    totalVehiclesSold: 0,
    withInsurance: 0,
    withoutInsurance: 0,
    insuranceCoverageRate: 0,
    policyGeneration: {
      completed: 0,
      pending: 0,
      later: 0,
      completionRate: 0
    },
    rsaDetails: {
      totalRSA: 0,
      rsaCoverageRate: 0
    },
    cmsDetails: {
      totalCMS: 0,
      cmsCoverageRate: 0
    },
    financials: {
      totalInsuranceAmount: 0,
      averagePremium: 0
    },
    providerBreakdown: [],
    appliedFilters: {}
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
      const url = `/insurance-dashboard/stats`;
      
      console.log('🟡 Fetching insurance dashboard data from:', url);
      setApiCalled(true);
      
      const response = await axiosInstance.get(url);
      console.log('✅ Insurance Dashboard API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data);
        console.log('✅ Insurance dashboard data loaded successfully:', {
          totalVehiclesSold: response.data.data.totalVehiclesSold,
          withInsurance: response.data.data.withInsurance,
          insuranceCoverageRate: response.data.data.insuranceCoverageRate,
          providers: response.data.data.providerBreakdown?.length
        });
      } else {
        console.warn('⚠️ Insurance Dashboard API returned success=false or no data');
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('❌ Error fetching insurance dashboard:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Network error. Please check your connection.');
      showError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('🟡 InsuranceDashboard mounted - fetching data');
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
      console.log('🟡 Exporting insurance report...');
      const response = await axiosInstance.get('/insurance-dashboard/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `insurance_report_${Date.now()}.csv`);
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
      title: 'Total Vehicles Sold', 
      value: formatNumber(dashboardData.totalVehiclesSold), 
      change: "+0%", 
      changeType: "increase",
      icon: Car, 
      color: "#2E7D32",
      bgColor: "#E8F5E9"
    },
    { 
      title: 'With Insurance', 
      value: formatNumber(dashboardData.withInsurance), 
      change: `${dashboardData.insuranceCoverageRate}%`, 
      changeType: dashboardData.insuranceCoverageRate > 30 ? "increase" : "decrease",
      icon: Shield, 
      color: "#1976D2",
      bgColor: "#E3F2FD"
    },
    { 
      title: 'Without Insurance', 
      value: formatNumber(dashboardData.withoutInsurance), 
      change: `${(100 - dashboardData.insuranceCoverageRate).toFixed(1)}%`, 
      changeType: "decrease",
      icon: AlertCircle, 
      color: "#F44336",
      bgColor: "#FFEBEE"
    },
    { 
      title: 'Policy Completion Rate', 
      value: `${dashboardData.policyGeneration?.completionRate || 0}%`, 
      change: "+0%", 
      changeType: "increase",
      icon: FileText, 
      color: "#FF6F00",
      bgColor: "#FFF3E0"
    },
  ];

  // Policy status data
  const policyStats = [
    { 
      title: 'Completed', 
      value: formatNumber(dashboardData.policyGeneration?.completed || 0), 
      icon: CheckCircle, 
      color: "#4CAF50",
      bgColor: "#E8F5E9"
    },
    { 
      title: 'Pending', 
      value: formatNumber(dashboardData.policyGeneration?.pending || 0), 
      icon: Clock, 
      color: "#FF9800",
      bgColor: "#FFF3E0"
    },
    { 
      title: 'Later', 
      value: formatNumber(dashboardData.policyGeneration?.later || 0), 
      icon: Calendar, 
      color: "#9E9E9E",
      bgColor: "#F5F5F5"
    },
  ];

  // Coverage stats
  const coverageStats = [
    {
      title: 'RSA Coverage',
      value: `${dashboardData.rsaDetails?.rsaCoverageRate || 0}%`,
      subtitle: `${formatNumber(dashboardData.rsaDetails?.totalRSA || 0)} vehicles`,
      icon: Shield,
      color: "#2196F3",
      bgColor: "#E3F2FD"
    },
    {
      title: 'CMS Coverage',
      value: `${dashboardData.cmsDetails?.cmsCoverageRate || 0}%`,
      subtitle: `${formatNumber(dashboardData.cmsDetails?.totalCMS || 0)} vehicles`,
      icon: FileText,
      color: "#9C27B0",
      bgColor: "#F3E5F5"
    }
  ];

  // Donut Chart Component
  const DonutChart = () => {
    const withInsurance = dashboardData.withInsurance || 0;
    const withoutInsurance = dashboardData.withoutInsurance || 0;
    const total = withInsurance + withoutInsurance;
    
    const withPercentage = total > 0 ? (withInsurance / total) * 100 : 0;
    const withoutPercentage = total > 0 ? (withoutInsurance / total) * 100 : 0;
    
    const size = 180;
    const strokeWidth = 30;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    const withOffset = circumference - (withPercentage / 100) * circumference;
    const withoutOffset = circumference - (withoutPercentage / 100) * circumference;
    
    return (
      <div className="donut-chart-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E8F5E9"
            strokeWidth={strokeWidth}
          />
          {/* With Insurance segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1976D2"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={withOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="donut-segment"
          />
          {/* Without Insurance segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F44336"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={withOffset + withoutOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="donut-segment"
          />
          <text
            x={size / 2}
            y={size / 2 - 10}
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill="#1B5E20"
          >
            {dashboardData.insuranceCoverageRate || 0}%
          </text>
          <text
            x={size / 2}
            y={size / 2 + 15}
            textAnchor="middle"
            fontSize="11"
            fill="#8D6E63"
          >
            Coverage Rate
          </text>
        </svg>
        <div className="donut-legend">
          <div className="donut-legend-item">
            <div className="donut-legend-color" style={{ backgroundColor: '#1976D2' }}></div>
            <span>With Insurance ({withPercentage.toFixed(1)}%)</span>
          </div>
          <div className="donut-legend-item">
            <div className="donut-legend-color" style={{ backgroundColor: '#F44336' }}></div>
            <span>Without Insurance ({withoutPercentage.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    );
  };

  // Bar Chart Component for Providers
  const ProvidersBarChart = () => {
    const providers = dashboardData.providerBreakdown || [];
    const maxCount = Math.max(...providers.map(p => p.count), 1);
    
    return (
      <div className="providers-chart">
        {providers.length > 0 ? (
          providers.map((provider, idx) => (
            <div key={idx} className="provider-bar-item">
              <div className="provider-bar-header">
                <span className="provider-name">{provider.provider}</span>
                <span className="provider-count">{formatNumber(provider.count)} vehicles</span>
              </div>
              <div className="provider-bar-bg">
                <div 
                  className="provider-bar-fill"
                  style={{ width: `${(provider.count / maxCount) * 100}%` }}
                >
                  <div className="provider-bar-tooltip">
                    {formatNumber(provider.count)} vehicles
                  </div>
                </div>
              </div>
              {provider.totalAmount > 0 && (
                <div className="provider-amount">
                  Total Amount: {formatCurrency(provider.totalAmount)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state-small">
            <Building2 size={32} />
            <p>No provider data available</p>
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (loading && !apiCalled) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-content">
          <RefreshCw className="dashboard-loading-spinner" />
          <p>Loading insurance dashboard data...</p>
          <p className="debug-text">Calling API: /insurance-dashboard/stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insurance-dashboard">
      {/* Debug Info - Remove in production */}
    

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Insurance Dashboard</h1>
          <p className="dashboard-subtitle">
            Insurance coverage and policy tracking
          </p>
        </div>
        {/* <div className="dashboard-actions">
          <button 
            onClick={() => setShowAlerts(!showAlerts)}
            className="icon-btn"
          >
            <Bell size={20} />
            <span className="alert-badge">2</span>
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
                    <span className="change-label">vs target</span>
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

      {/* Main Content Grid */}
      <div className="charts-section">
        {/* Insurance Coverage Donut Chart */}
        <div className="coverage-chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Insurance Coverage</h3>
              <p className="chart-subtitle">Vehicle insurance distribution</p>
            </div>
          </div>
          <div className="chart-body">
            <DonutChart />
          </div>
        </div>

        {/* Policy Status */}
        <div className="policy-status-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Policy Generation Status</h3>
              <p className="chart-subtitle">Policy completion tracking</p>
            </div>
          </div>
          <div className="policy-stats">
            {policyStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="policy-stat-item">
                  <div className="policy-stat-icon" style={{ backgroundColor: stat.bgColor }}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                  <div className="policy-stat-info">
                    <p className="policy-stat-title">{stat.title}</p>
                    <p className="policy-stat-value">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="completion-rate">
            <div className="completion-rate-header">
              <span>Completion Rate</span>
              <span className="completion-rate-value">
                {dashboardData.policyGeneration?.completionRate || 0}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${dashboardData.policyGeneration?.completionRate || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Coverage Details */}
        <div className="coverage-details-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Coverage Details</h3>
              <p className="chart-subtitle">RSA & CMS coverage</p>
            </div>
          </div>
          <div className="coverage-details">
            {coverageStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="coverage-detail-item">
                  <div className="coverage-detail-icon" style={{ backgroundColor: stat.bgColor }}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                  <div className="coverage-detail-info">
                    <p className="coverage-detail-title">{stat.title}</p>
                    <p className="coverage-detail-value">{stat.value}</p>
                    <p className="coverage-detail-subtitle">{stat.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="financial-section">
        <div className="financial-card">
          <div className="financial-header">
            <h3 className="financial-title">Financial Summary</h3>
            <Wallet size={20} style={{ color: '#FF6F00' }} />
          </div>
          <div className="financial-stats">
            <div className="financial-stat-item">
              <p className="financial-stat-label">Total Insurance Amount</p>
              <p className="financial-stat-value">
                {formatCurrency(dashboardData.financials?.totalInsuranceAmount || 0)}
              </p>
            </div>
            <div className="financial-stat-item">
              <p className="financial-stat-label">Average Premium</p>
              <p className="financial-stat-value">
                {formatCurrency(dashboardData.financials?.averagePremium || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Breakdown Section */}
      <div className="providers-section">
        <div className="table-header">
          <h3 className="table-title">Insurance Provider Breakdown</h3>
          <p className="table-subtitle">Distribution by insurance provider</p>
        </div>
        <div className="providers-container">
          <ProvidersBarChart />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-section">
        <div className="summary-card">
          <div className="summary-card-header">
            <Shield size={20} style={{ color: '#1976D2' }} />
            <h4>Key Insights</h4>
          </div>
          <div className="summary-card-body">
            <div className="insight-item">
              <span className="insight-label">Insurance Coverage Rate:</span>
              <span className="insight-value">{dashboardData.insuranceCoverageRate || 0}%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Policy Completion Rate:</span>
              <span className="insight-value">{dashboardData.policyGeneration?.completionRate || 0}%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">RSA Coverage:</span>
              <span className="insight-value">{dashboardData.rsaDetails?.rsaCoverageRate || 0}%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">CMS Coverage:</span>
              <span className="insight-value">{dashboardData.cmsDetails?.cmsCoverageRate || 0}%</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-card-header">
            <Users size={20} style={{ color: '#FF6F00' }} />
            <h4>Quick Stats</h4>
          </div>
          <div className="summary-card-body">
            <div className="insight-item">
              <span className="insight-label">Total Vehicles:</span>
              <span className="insight-value">{formatNumber(dashboardData.totalVehiclesSold)}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Insured Vehicles:</span>
              <span className="insight-value">{formatNumber(dashboardData.withInsurance)}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Uninsured Vehicles:</span>
              <span className="insight-value">{formatNumber(dashboardData.withoutInsurance)}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Active Policies:</span>
              <span className="insight-value">{formatNumber(dashboardData.policyGeneration?.completed || 0)}</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-card-header">
            <Building2 size={20} style={{ color: '#9C27B0' }} />
            <h4>Provider Info</h4>
          </div>
          <div className="summary-card-body">
            <div className="insight-item">
              <span className="insight-label">Active Providers:</span>
              <span className="insight-value">{dashboardData.providerBreakdown?.length || 0}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Top Provider:</span>
              <span className="insight-value">
                {dashboardData.providerBreakdown?.[0]?.provider || 'N/A'}
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Provider Share:</span>
              <span className="insight-value">
                {dashboardData.providerBreakdown?.[0]?.count || 0} vehicles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDashboard;