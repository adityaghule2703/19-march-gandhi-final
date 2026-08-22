import React, { useState, useEffect, useRef } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilX,
  cilReload,
  cilInfo,
  cilCheckCircle,
  cilWarning,
  cilClock,
  cilUser,
  cilSettings,
  cilShieldAlt,
  cilSync,
  cilMediaPlay,
  cilMediaPause,
  
} from '@coreui/icons';

import { showError } from '../../../utils/sweetAlerts';
import axiosInstance from '../../../axiosInstance';

const InsuranceLive = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const timerRef = useRef(null);
  const refreshInterval = 300000; // 5 minutes in milliseconds

  // Fetch insurance booking data
  const fetchInsuranceBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/current/current-booking');
      
      if (response.data.success) {
        setBookingData(response.data.booking);
        setLastUpdated(new Date());
      } else {
        setError(response.data.message || 'Failed to fetch booking data');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Error fetching insurance booking';
      setError(message);
      showError(message);
      console.error('Error fetching insurance booking:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when modal opens
  useEffect(() => {
    if (visible) {
      fetchInsuranceBooking();
    }
  }, [visible]);

  // Auto-refresh timer
  useEffect(() => {
    if (visible && autoRefresh) {
      timerRef.current = setInterval(() => {
        fetchInsuranceBooking();
      }, refreshInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [visible, autoRefresh]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchInsuranceBooking();
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      // If turning on auto-refresh, do an immediate fetch
      fetchInsuranceBooking();
    }
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    if (!status) return 'secondary';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'processing' || lowerStatus === 'in-progress') return 'warning';
    if (lowerStatus === 'completed' || lowerStatus === 'approved') return 'success';
    if (lowerStatus === 'pending' || lowerStatus === 'waiting') return 'info';
    if (lowerStatus === 'rejected' || lowerStatus === 'cancelled') return 'danger';
    return 'secondary';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    if (!status) return cilInfo;
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'processing' || lowerStatus === 'in-progress') return cilSync;
    if (lowerStatus === 'completed' || lowerStatus === 'approved') return cilCheckCircle;
    if (lowerStatus === 'pending' || lowerStatus === 'waiting') return cilClock;
    if (lowerStatus === 'rejected' || lowerStatus === 'cancelled') return cilWarning;
    return cilInfo;
  };

  // Get status label
  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Render progress based on current step
  const renderProgress = (step) => {
    const steps = [
      'Filling insurance form',
      'Reviewing documents',
      'Processing application',
      'Approval pending',
      'Insurance issued'
    ];

    let currentStepIndex = steps.findIndex(s => 
      step?.toLowerCase().includes(s.toLowerCase())
    );
    
    if (currentStepIndex === -1) {
      // Try to match partial
      currentStepIndex = 0;
      if (step?.toLowerCase().includes('review')) currentStepIndex = 1;
      else if (step?.toLowerCase().includes('process')) currentStepIndex = 2;
      else if (step?.toLowerCase().includes('approv')) currentStepIndex = 3;
      else if (step?.toLowerCase().includes('issue') || step?.toLowerCase().includes('complete')) currentStepIndex = 4;
    }

    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
      <div className="mt-2">
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted small">Progress</span>
          <span className="text-muted small">{Math.round(progress)}%</span>
        </div>
        <CProgress 
          value={progress} 
          color={progress >= 80 ? 'success' : progress >= 50 ? 'info' : 'warning'}
          style={{ height: '8px' }}
        />
        <div className="d-flex justify-content-between mt-1">
          <span className="text-muted small">Started</span>
          <span className="text-muted small">{step || 'In progress'}</span>
        </div>
      </div>
    );
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="lg"
      scrollable
      alignment="center"
    >
      <CModalHeader
        style={{ borderBottom: '1px solid #e9ecef', paddingBottom: 12 }}
        closeButton={false}
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(13,110,253,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <CIcon icon={cilShieldAlt} size="sm" style={{ color: '#0d6efd' }} />
            </div>
            <div>
              <CModalTitle style={{ fontSize: 15, fontWeight: 600, marginBottom: 0 }}>
                Live Insurance
              </CModalTitle>
              <p style={{ fontSize: 12, color: '#6c757d', margin: 0 }}>
                Current insurance booking status
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <CButton
              size="sm"
              color={autoRefresh ? 'success' : 'secondary'}
              variant="outline"
              onClick={toggleAutoRefresh}
              title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
            >
              <CIcon icon={autoRefresh ? cilMediaPlay : cilMediaPause} size="sm" className="me-1" />
              {autoRefresh ? 'Auto' : 'Manual'}
            </CButton>
            <CButton
              size="sm"
              color="primary"
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh now"
            >
              <CIcon icon={cilReload} size="sm" className={loading ? 'fa-spin' : ''} />
            </CButton>
            <button
              onClick={onClose}
              style={{
                background: '#f1f3f5',
                border: '1px solid #dee2e6',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <CIcon icon={cilX} size="sm" style={{ color: '#6c757d' }} />
            </button>
          </div>
        </div>
      </CModalHeader>

      <CModalBody style={{ padding: '16px 20px' }}>
        {/* Auto-refresh indicator */}
        {autoRefresh && (
          <div className="d-flex align-items-center gap-2 mb-3 text-muted" style={{ fontSize: 12 }}>
           
            <span>Auto-refreshing every 5 minutes</span>
            {lastUpdated && (
              <span className="ms-2">
                Last updated: {formatTime(lastUpdated)}
              </span>
            )}
          </div>
        )}

        {loading && !bookingData ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
            <p className="mt-3 mb-0 text-muted" style={{ fontSize: 13 }}>
              Loading insurance booking...
            </p>
          </div>
        ) : error ? (
          <CAlert color="danger" className="mb-0" style={{ fontSize: 13 }}>
            <CIcon icon={cilWarning} className="me-2" />
            {error}
          </CAlert>
        ) : bookingData ? (
          <>
            {/* Status Banner */}
            <div className={`alert alert-${getStatusBadgeColor(bookingData.status)} d-flex align-items-center gap-3 mb-4`}>
              <CIcon icon={getStatusIcon(bookingData.status)} size="lg" />
              <div>
                <div className="fw-bold">{getStatusLabel(bookingData.status)}</div>
                <div className="small">
                  Booking #{bookingData.number || 'N/A'} • {bookingData.currentStep || 'Processing...'}
                </div>
              </div>
              <CBadge 
                color={getStatusBadgeColor(bookingData.status)} 
                className="ms-auto"
                style={{ fontSize: 12, padding: '6px 14px' }}
              >
                {getStatusLabel(bookingData.status)}
              </CBadge>
            </div>

            {/* Progress Section */}
            {bookingData.currentStep && (
              <CCard className="mb-4">
                <CCardBody>
                  <h6 className="mb-3 d-flex align-items-center gap-2">
                    <CIcon icon={cilClock} size="sm" />
                    Current Progress
                  </h6>
                  {renderProgress(bookingData.currentStep)}
                </CCardBody>
              </CCard>
            )}

            {/* Booking Details */}
            <CCard>
              <CCardHeader style={{ background: '#f8f9fa', padding: '10px 16px' }}>
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <CIcon icon={cilInfo} size="sm" />
                  Booking Details
                </h6>
              </CCardHeader>
              <CCardBody style={{ padding: '16px' }}>
                <CTable bordered size="sm" className="mb-0">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell style={{ width: '40%', fontWeight: 600, background: '#f8f9fa' }}>
                        <CIcon icon={cilSettings} className="me-2" />
                        Booking Number
                      </CTableDataCell>
                      <CTableDataCell>{bookingData.number || 'N/A'}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell style={{ fontWeight: 600, background: '#f8f9fa' }}>
                        <CIcon icon={cilShieldAlt} className="me-2" />
                        Service
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{bookingData.service || 'Insurance'}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell style={{ fontWeight: 600, background: '#f8f9fa' }}>
                        <CIcon icon={cilUser} className="me-2" />
                        Customer
                      </CTableDataCell>
                      <CTableDataCell>{bookingData.customer || 'N/A'}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell style={{ fontWeight: 600, background: '#f8f9fa' }}>
                      
                        Model
                      </CTableDataCell>
                      <CTableDataCell>{bookingData.model || 'N/A'}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell style={{ fontWeight: 600, background: '#f8f9fa' }}>
                       
                        Chassis Number
                      </CTableDataCell>
                      <CTableDataCell>{bookingData.chassis || 'N/A'}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell style={{ fontWeight: 600, background: '#f8f9fa' }}>
                        <CIcon icon={cilSync} className="me-2" />
                        Current Step
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="warning">{bookingData.currentStep || 'N/A'}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>

            {/* Last updated timestamp */}
            {lastUpdated && (
              <div className="text-muted text-end mt-3" style={{ fontSize: 11 }}>
                <CIcon icon={cilClock} size="sm" className="me-1" />
                Last updated: {formatTime(lastUpdated)}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <CIcon icon={cilInfo} size="xl" style={{ color: '#dee2e6' }} />
            <p className="mt-2 mb-0 text-muted" style={{ fontSize: 14 }}>
              No active insurance booking found
            </p>
          </div>
        )}
      </CModalBody>

      <CModalFooter
        style={{
          background: '#f8f9fa',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 12, color: '#6c757d' }}>
          <CIcon icon={cilInfo} size="sm" className="me-1" />
          Auto-refresh every 5 minutes
        </div>
        <div className="d-flex gap-2">
          <CButton
            color="secondary"
            variant="outline"
            onClick={onClose}
            style={{ fontSize: 13 }}
          >
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={handleRefresh}
            disabled={loading}
            style={{ fontSize: 13 }}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Refreshing...
              </>
            ) : (
              <>
                <CIcon icon={cilReload} className="me-1" />
                Refresh Now
              </>
            )}
          </CButton>
        </div>
      </CModalFooter>
    </CModal>
  );
};

export default InsuranceLive;