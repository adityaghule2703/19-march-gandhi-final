import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CBadge,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilMenu,
  cilBell,
  cilWarning,
  cilCheckCircle,
  cilX,
  cilClock,
  cilBadge,
  cilShieldAlt,
  cilInfo,
} from '@coreui/icons'


import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import axiosInstance from '../axiosInstance'

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [notificationModal, setNotificationModal] = useState(false)
  const [notificationData, setNotificationData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotificationCounts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get('/bookings/pending-counts')
      if (response.data.success) {
        setNotificationData(response.data.data)
      } else {
        setError('Failed to fetch notification data')
      }
    } catch (err) {
      const message = showError(err)
      setError(message || 'Error fetching notifications')
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = () => {
    setNotificationModal(true)
    if (!notificationData) {
      fetchNotificationCounts()
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  const formatNumber = (num) => num?.toLocaleString() || 0

  /* ─── inline styles ─────────────────────────────────────────── */
  const s = {
    /* modal header */
    iconCircle: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'rgba(13,110,253,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    headerSub: { fontSize: 12, color: '#6c757d', margin: 0 },

    /* summary tiles */
    tileGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 0 },
    tile: (bg) => ({
      background: bg,
      borderRadius: 8,
      padding: '14px 16px',
    }),
    tileLabel: (color) => ({
      fontSize: 11,
      fontWeight: 600,
      color,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      margin: '0 0 4px',
    }),
    tileValue: (color) => ({
      fontSize: 28,
      fontWeight: 500,
      color,
      margin: 0,
      lineHeight: 1,
    }),

    /* warning strip */
    warnStrip: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      background: 'rgba(255,193,7,0.12)',
      padding: '10px 16px',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    },
    warnText: { fontSize: 13, color: '#856404', margin: 0, lineHeight: 1.5 },

    /* section */
    sectionWrap: { padding: '14px 20px' },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 13,
      fontWeight: 600,
      color: '#212529',
      margin: 0,
    },
    sectionBadge: {
      fontSize: 12,
      background: '#f1f3f5',
      color: '#495057',
      padding: '2px 12px',
      borderRadius: 20,
      border: '1px solid #dee2e6',
      fontWeight: 500,
    },
    rowList: {
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid #e9ecef',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '9px 14px',
      background: '#fff',
    },
    rowLabel: { fontSize: 13, color: '#6c757d', margin: 0 },
    rowValue: { fontSize: 13, fontWeight: 600, color: '#212529', margin: 0 },
    rowDivider: { height: 1, background: '#f1f3f5' },
    rowSub: {
      fontSize: 11,
      color: '#868e96',
      margin: '0',
      padding: '0 14px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },

    /* divider between sections */
    sectionDivider: { height: 1, background: '#f1f3f5', margin: '0 20px' },

    /* both-issues callout */
    bothCard: {
      borderRadius: 8,
      border: '1px solid rgba(220,53,69,0.25)',
      background: 'rgba(220,53,69,0.07)',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    bothLabel: { fontSize: 13, fontWeight: 600, color: '#842029', margin: '0 0 2px' },
    bothSub: { fontSize: 12, color: '#842029', opacity: 0.8, margin: 0 },
    bothCount: { fontSize: 16, fontWeight: 600, color: '#842029', flexShrink: 0 },

    /* footer */
    footer: { background: '#f8f9fa', borderTop: '1px solid #e9ecef' },
    btnClose: {
      fontSize: 13,
      padding: '6px 18px',
      borderRadius: 6,
      border: '1px solid #dee2e6',
      background: 'transparent',
      color: '#6c757d',
      cursor: 'pointer',
    },
    btnRefresh: {
      fontSize: 13,
      padding: '6px 18px',
      borderRadius: 6,
      border: '1px solid rgba(13,110,253,0.3)',
      background: 'rgba(13,110,253,0.08)',
      color: '#0d6efd',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
  }

  /* ─── sub-components ─────────────────────────────────────────── */
  const Section = ({ icon, title, data }) => (
    <>
      <div style={s.sectionWrap}>
        <div style={s.sectionHeader}>
          <p style={s.sectionTitle}>
            <CIcon icon={icon} size="sm" style={{ color: '#868e96' }} />
            {title}
          </p>
          <span style={s.sectionBadge}>Total: {formatNumber(data?.count)}</span>
        </div>
        {data?.breakdown?.length > 0 && (
          <div style={s.rowList}>
            {data.breakdown.map((item, idx) => (
              <div key={idx}>
                {idx > 0 && <div style={s.rowDivider} />}
                <div style={s.row}>
                  <p style={s.rowLabel}>{item._id}</p>
                  <p style={s.rowValue}>{formatNumber(item.count)}</p>
                </div>
                {item.selfInsuranceCount !== undefined && (
                  <p style={s.rowSub}>
                    <CIcon icon={cilInfo} size="sm" />
                    Self insurance: {formatNumber(item.selfInsuranceCount)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* ── Header bar ─────────────────────────────────────────── */}
      <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          <CHeaderNav className="align-items-center">
            <div
              className="position-relative d-flex align-items-center justify-content-center"
              style={{ cursor: 'pointer', width: 36, height: 36, marginRight: 12 }}
              onClick={handleNotificationClick}
            >
              <CIcon icon={cilBell} size="xl" className="d-block" />
              {notificationData && notificationData.summary?.totalPendingIssues > 0 && (
                <CBadge
                  color="danger"
                  shape="rounded-pill"
                  className="position-absolute"
                  style={{
                    top: -4,
                    right: -4,
                    fontSize: 11,
                    padding: '3px 6px',
                    minWidth: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {notificationData.summary.totalPendingIssues}
                </CBadge>
              )}
            </div>
            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>

        <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>

      {/* ── Notification Modal ─────────────────────────────────── */}
      <CModal
        visible={notificationModal}
        onClose={() => setNotificationModal(false)}
        size="lg"
        scrollable
        alignment="center"
      >
        {/* Header */}
        <CModalHeader
          style={{ borderBottom: '1px solid #e9ecef', paddingBottom: 12 }}
          closeButton={false}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center gap-2">
              <div style={s.iconCircle}>
                <CIcon icon={cilBell} size="sm" style={{ color: '#0d6efd' }} />
              </div>
              <div>
                <CModalTitle style={{ fontSize: 15, fontWeight: 600, marginBottom: 0 }}>
                  Notifications
                </CModalTitle>
                <p style={s.headerSub}>Booking status overview</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationModal(false)}
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
        </CModalHeader>

        {/* Body */}
        <CModalBody style={{ padding: 0 }}>
          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3 mb-0 text-muted" style={{ fontSize: 13 }}>
                Loading notifications...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ padding: '16px 20px' }}>
              <CAlert color="danger" className="mb-0" style={{ fontSize: 13 }}>
                {error}
              </CAlert>
            </div>
          )}

          {/* Content */}
          {notificationData && !loading && (
            <>
              {/* Summary tiles */}
              <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid #e9ecef' }}>
                <div style={s.tileGrid}>
                  <div style={s.tile('rgba(220,53,69,0.08)')}>
                    <p style={s.tileLabel('#842029')}>Total pending issues</p>
                    <p style={s.tileValue('#dc3545')}>
                      {formatNumber(notificationData.summary?.totalPendingIssues)}
                    </p>
                  </div>
                  <div style={s.tile('rgba(13,110,253,0.08)')}>
                    <p style={s.tileLabel('#084298')}>Bookings affected</p>
                    <p style={s.tileValue('#0d6efd')}>
                      {formatNumber(notificationData.summary?.uniqueBookingsAffected)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning strip */}
              {notificationData.warnings?.length > 0 && (
                <div style={s.warnStrip}>
                  <CIcon icon={cilWarning} size="sm" style={{ color: '#856404', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    {notificationData.warnings.map((w, i) => (
                      <p key={i} style={s.warnText}>{w}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections */}
              <Section
                icon={cilClock}
                title="Awaiting approval"
                data={notificationData.awaitingApproval}
              />
              <div style={s.sectionDivider} />
              <Section
                icon={cilBadge}
                title="KYC not updated"
                data={notificationData.kycNotUpdated}
              />
              <div style={s.sectionDivider} />
              <Section
                icon={cilShieldAlt}
                title="Insurance not updated"
                data={notificationData.insuranceNotUpdated}
              />

              {/* Both issues callout */}
              {notificationData.bothIssues && (
                <div style={{ padding: '0 20px 18px' }}>
                  <div style={s.bothCard}>
                    <div className="d-flex align-items-center gap-2">
                      <CIcon icon={cilWarning} size="sm" style={{ color: '#842029', flexShrink: 0 }} />
                      <div>
                        <p style={s.bothLabel}>Both KYC and insurance pending</p>
                        <p style={s.bothSub}>
                          {notificationData.bothIssues.description || 'Requires immediate attention'}
                        </p>
                      </div>
                    </div>
                    <p style={s.bothCount}>
                      {formatNumber(notificationData.bothIssues.count)}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </CModalBody>

        {/* Footer */}
        <CModalFooter
          style={{ ...s.footer, display: 'flex', justifyContent: 'flex-end', gap: 8 }}
        >
          <button style={s.btnClose} onClick={() => setNotificationModal(false)}>
            Close
          </button>
          {notificationData && (
            <button style={s.btnRefresh} onClick={fetchNotificationCounts}>
              <CIcon icon={cilCheckCircle} size="sm" />
              Refresh
            </button>
          )}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeader