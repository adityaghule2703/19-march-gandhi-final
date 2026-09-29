import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CButton, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilReload } from '@coreui/icons';
import {
  Cpu, CheckCircle, AlertCircle,
  Car, User, Hash, Activity, Clock, Inbox,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

import { showError, showSuccess } from '../../../utils/sweetAlerts';
import axiosInstance from '../../../axiosInstance';
import './AiInsuranceDashboard.css';

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */
const API_BASE = '/insurancepaneldashboard';
const CURRENT_BOOKING_API = '/current/current-booking';
const BOOKING_TYPE = 'BRANCH';
const POLL_INTERVAL = 5000;

const BUCKETS = [
  {
    key: 'TOTAL_CHASSIS',
    exportKey: 'TOTAL_CHASSIS',
    label: 'Total Chassis Today',
    shortLabel: 'Total',
    color: '#5E35B1',
    bgColor: '#EDE7F6',
    icon: Car,
  },
  {
    key: 'FILLED_BY_AI',
    exportKey: 'FILLED_BY_AI',
    label: 'Filled by AI',
    shortLabel: 'AI Filled',
    color: '#1976D2',
    bgColor: '#E3F2FD',
    icon: Cpu,
  },
  {
    key: 'FILLED_MANUALLY',
    exportKey: 'FILLED_MANUALLY',
    label: 'Filled Manually',
    shortLabel: 'Manual',
    color: '#F57C00',
    bgColor: '#FFF3E0',
    icon: User,
  },
  {
    key: 'REMAINING',
    exportKey: 'REMAINING',
    label: 'Remaining',
    shortLabel: 'Remaining',
    color: '#0288D1',
    bgColor: '#E1F5FE',
    icon: Clock,
  },
  {
    key: 'FAILED',
    exportKey: 'FAILED',
    label: 'Failed / Stale',
    shortLabel: 'Failed',
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: AlertCircle,
  },
];

const RANGES = [
  { key: 'today',  label: 'Today' },
  { key: 'week',   label: 'This Week' },
  { key: 'custom', label: 'Custom' },
];

const SUMMARY_MAP = {
  TOTAL_CHASSIS:   'totalChassisToday',
  FILLED_BY_AI:    'filledByAI',
  FILLED_MANUALLY: 'filledManually',
  REMAINING:       'remaining',
  FAILED:          'failed',
};

/* Map backend current-booking status -> visual treatment */
const STATUS_MAP = {
  processing: {
    label: 'Processing',
    color: '#1976D2',
    bg: '#E3F2FD',
    icon: Clock,
    pulse: true,
  },
  success: {
    label: 'Completed',
    color: '#2E7D32',
    bg: '#E8F5E9',
    icon: CheckCircle,
    pulse: false,
  },
  failed: {
    label: 'Failed',
    color: '#F44336',
    bg: '#FFEBEE',
    icon: AlertCircle,
    pulse: false,
  },
  idle: {
    label: 'Idle',
    color: '#8a6f63',
    bg: '#f1efe9',
    icon: Inbox,
    pulse: false,
  },
};

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */
const fmtNum = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '';

const todayISO = () => new Date().toISOString().split('T')[0];

const resolveStatus = (status) =>
  STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.idle;

const isUnknown = (val) =>
  !val || ['unknown', 'n/a', 'na', '-', ''].includes(String(val).trim().toLowerCase());

/* ------------------------------------------------------------------ */
/* CURRENT BOOKING CARD                                                */
/* ------------------------------------------------------------------ */
const CurrentBookingCard = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchCurrent = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(CURRENT_BOOKING_API);
      if (data.success && data.booking) {
        setBooking(data.booking);
        setError(null);
      } else {
        setBooking(null);
        setError(data.message || 'No active booking');
      }
    } catch (e) {
      setBooking(null);
      setError(e.response?.data?.message || e.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCurrent(); }, [fetchCurrent]);

  /* auto-poll while processing */
  useEffect(() => {
    if (!booking || booking.status?.toLowerCase() !== 'processing') return undefined;
    const id = setInterval(() => fetchCurrent({ silent: true }), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [booking, fetchCurrent]);

  /* ----- derived (all null-safe) ----- */
  const status      = resolveStatus(booking?.status);
  const StatusIcon  = status.icon;
  const currentStep = booking?.currentStep || '';

  const rows = booking
    ? [
        { icon: Hash,     label: 'Booking No.', value: booking.number },
        { icon: Car,      label: 'Service',     value: booking.service },
        { icon: User,     label: 'Customer',    value: booking.customer },
        { icon: Cpu,      label: 'Model',       value: booking.model },
        { icon: Activity, label: 'Chassis',     value: booking.chassis },
      ]
    : [];

  /* Explicit empty state — booking missing AND no error */
  const isEmpty = !loading && !error && !booking;

  return (
    <div className="current-booking-card">
      <div className="cb-header">
        <div className="cb-header-left">
          <span className="cb-eyebrow">
            <span
              className={`cb-live-dot ${status.pulse ? 'pulse' : ''}`}
              style={{ background: status.color }}
            />
            Live
          </span>
          <h3 className="cb-title">Current Booking</h3>
        </div>

        <button
          type="button"
          className="cb-refresh"
          onClick={() => fetchCurrent()}
          disabled={loading}
          aria-label="Refresh current booking"
        >
          <CIcon icon={cilReload} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="cb-state">
          <CSpinner size="sm" />
          <span>Loading current booking…</span>
        </div>
      ) : error || isEmpty ? (
        <div className="cb-state cb-state--empty">
          <Inbox size={26} />
          <p>{error || 'No active booking right now'}</p>
          <button type="button" className="cb-retry" onClick={() => fetchCurrent()}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <div
            className="cb-status-banner"
            style={{ background: status.bg, color: status.color }}
          >
            <StatusIcon size={18} />
            <span className="cb-status-label">{status.label}</span>
            {currentStep && (
              <span className="cb-status-step">• {currentStep}</span>
            )}
          </div>

          <div className="cb-grid">
            {rows.map(({ icon: Icon, label, value }) => {
              const empty = isUnknown(value);
              return (
                <div className="cb-row" key={label}>
                  <div className="cb-row-icon">
                    <Icon size={15} />
                  </div>
                  <div className="cb-row-content">
                    <span className="cb-row-label">{label}</span>
                    <span className={`cb-row-value ${empty ? 'is-empty' : ''}`}>
                      {empty ? '—' : value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* MAIN DASHBOARD                                                      */
/* ------------------------------------------------------------------ */
const AiInsuranceDashboard = () => {
  /* ---------- filter state ---------- */
  const [range, setRange]         = useState('today');
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate]     = useState(todayISO());

  /* ---------- summary state ---------- */
  const [summary, setSummary]               = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError]     = useState(null);

  /* ---------- export state ---------- */
  const [exportingBucket, setExportingBucket] = useState(null);

  /* ---------- derived range params ---------- */
  const rangeParams = useMemo(() => {
    if (range === 'custom') {
      if (!startDate || !endDate) return null;
      return { range: 'custom', startDate, endDate };
    }
    return { range };
  }, [range, startDate, endDate]);

  /* ---------- fetch summary ---------- */
  const fetchSummary = useCallback(async () => {
    if (!rangeParams) return;
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const { data } = await axiosInstance.get(`${API_BASE}/summary/mis-today`, {
        params: { ...rangeParams, bookingType: BOOKING_TYPE },
      });
      if (data.success) setSummary(data);
      else setSummaryError('Failed to load summary');
    } catch (e) {
      setSummaryError(e.response?.data?.message || e.message);
    } finally {
      setSummaryLoading(false);
    }
  }, [rangeParams]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const statCards = useMemo(() => {
    const d = summary?.data || {};
    return BUCKETS.map((b) => ({
      ...b,
      value: d[SUMMARY_MAP[b.key]] ?? 0,
    }));
  }, [summary]);

  const handleRefresh = () => {
    fetchSummary();
    showSuccess('Dashboard refreshed');
  };

  const handleExport = async (bucketKey) => {
    try {
      setExportingBucket(bucketKey);
      const bucketConfig = BUCKETS.find((b) => b.key === bucketKey);
      const exportBucket = bucketConfig?.exportKey || bucketKey;

      const params = { bucket: exportBucket };
      if (range === 'custom') {
        params.range = 'custom';
        params.startDate = startDate;
        params.endDate = endDate;
      } else {
        params.range = range;
      }

      const response = await axiosInstance.get(`${API_BASE}/export`, {
        params,
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const text = await response.data.text();
        const err = JSON.parse(text);
        throw new Error(err.message || 'Export failed');
      }

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const fileName =
        response.headers['content-disposition']?.match(/filename="?([^"]+)"?/)?.[1]
        || `${exportBucket}_${range}_${Date.now()}.xlsx`;

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess(`${bucketConfig?.label || bucketKey} exported successfully`);
    } catch (err) {
      console.error('Export error:', err);
      showError(err.message || 'Failed to export');
    } finally {
      setExportingBucket(null);
    }
  };

  const rangeLabel = useMemo(() => {
    if (!summary?.range) return '';
    return `${fmtDate(summary.range.start)} → ${fmtDate(summary.range.end)}`;
  }, [summary]);

  /* ================================================================== */
  return (
    <div className="insurance-dashboard">
      {/* ---------- HEADER ---------- */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Insurance AI Dashboard</h1>
          <p className="dashboard-subtitle">
            Monitor AI processing, MIS availability &amp; failures
            {rangeLabel && <span className="dashboard-range-chip">{rangeLabel}</span>}
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={handleRefresh}
            disabled={summaryLoading}
            aria-label="Refresh dashboard"
          >
            <CIcon icon={cilReload} className={summaryLoading ? 'spin' : ''} />
            <span className="icon-btn-label">Refresh</span>
          </button>
        </div>
      </div>

      {/* ---------- FILTER BAR ---------- */}
      <div className="ai-filter-bar">
        <div className="filter-group">
          <label className="filter-label">Range</label>
          <div className="range-tabs" role="tablist" aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                role="tab"
                aria-selected={range === r.key}
                className={`range-tab ${range === r.key ? 'active' : ''}`}
                onClick={() => setRange(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {range === 'custom' && (
          <>
            <div className="filter-group">
              <label className="filter-label" htmlFor="ai-dash-start">Start date</label>
              <input
                id="ai-dash-start"
                type="date"
                className="filter-input"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label" htmlFor="ai-dash-end">End date</label>
              <input
                id="ai-dash-end"
                type="date"
                className="filter-input"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {/* ---------- SUMMARY STAT CARDS ---------- */}
      {summaryError && (
        <div className="error-message" role="alert">
          <AlertCircle size={18} />
          <span>{summaryError}</span>
          <button type="button" className="retry-btn" onClick={fetchSummary}>
            Retry
          </button>
        </div>
      )}

      <div className="stats-grid">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className="stat-card"
              style={{ '--stat-color': s.color }}
            >
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-title">{s.label}</p>
                  {summaryLoading ? (
                    <div className="stat-value-skeleton" aria-hidden="true" />
                  ) : (
                    <p className="stat-value">{fmtNum(s.value)}</p>
                  )}
                </div>
                <div className="stat-icon" style={{ backgroundColor: s.bgColor }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- CURRENT BOOKING (LIVE) ---------- */}
      <CurrentBookingCard />

      {/* ---------- EXPORT TOOLBAR ---------- */}
      <div className="ai-export-toolbar">
        <div className="ai-export-toolbar-label">
          <FontAwesomeIcon icon={faFileExcel} />
          Export reports
        </div>
        <div className="ai-export-toolbar-buttons">
          {BUCKETS.map((b) => {
            const isExporting = exportingBucket === b.key;
            return (
              <CButton
                key={b.key}
                size="sm"
                className="ai-export-btn"
                style={{ '--btn-color': b.color }}
                disabled={isExporting}
                onClick={() => handleExport(b.key)}
                title={`Export ${b.label}`}
              >
                {isExporting ? (
                  <>
                    <CSpinner size="sm" />
                    Exporting…
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faFileExcel} />
                    {b.shortLabel}
                  </>
                )}
              </CButton>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AiInsuranceDashboard;