// import React, { useEffect, useRef, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import {
//   CContainer,
//   CHeader,
//   CHeaderNav,
//   CHeaderToggler,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CBadge,
//   CSpinner,
//   CAlert,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilMenu,
//   cilBell,
//   cilWarning,
//   cilCheckCircle,
//   cilX,
//   cilClock,
//   cilBadge,
//   cilShieldAlt,
//   cilInfo,
// } from '@coreui/icons'


// import { AppBreadcrumb } from './index'
// import { AppHeaderDropdown } from './header/index'
// import axiosInstance from '../axiosInstance'

// const AppHeader = () => {
//   const headerRef = useRef()
//   const dispatch = useDispatch()
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   const [notificationModal, setNotificationModal] = useState(false)
//   const [notificationData, setNotificationData] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const fetchNotificationCounts = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await axiosInstance.get('/bookings/pending-counts')
//       if (response.data.success) {
//         setNotificationData(response.data.data)
//       } else {
//         setError('Failed to fetch notification data')
//       }
//     } catch (err) {
//       const message = showError(err)
//       setError(message || 'Error fetching notifications')
//       console.error('Error fetching notifications:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleNotificationClick = () => {
//     setNotificationModal(true)
//     if (!notificationData) {
//       fetchNotificationCounts()
//     }
//   }

//   useEffect(() => {
//     const handleScroll = () => {
//       headerRef.current &&
//         headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
//     }
//     document.addEventListener('scroll', handleScroll)
//     return () => document.removeEventListener('scroll', handleScroll)
//   }, [])

//   const formatNumber = (num) => num?.toLocaleString() || 0

//   /* ─── inline styles ─────────────────────────────────────────── */
//   const s = {
//     /* modal header */
//     iconCircle: {
//       width: 34,
//       height: 34,
//       borderRadius: '50%',
//       background: 'rgba(13,110,253,0.1)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       flexShrink: 0,
//     },
//     headerSub: { fontSize: 12, color: '#6c757d', margin: 0 },

//     /* summary tiles - removed totalPendingIssues and uniqueBookingsAffected as they don't exist in API */
//     warningStrip: {
//       display: 'flex',
//       alignItems: 'flex-start',
//       gap: 8,
//       background: 'rgba(255,193,7,0.12)',
//       padding: '12px 16px',
//       margin: '12px 20px',
//       borderRadius: 8,
//       borderLeft: '3px solid #ffc107',
//     },
//     warnText: { fontSize: 13, color: '#856404', margin: 0, lineHeight: 1.5 },

//     /* section */
//     sectionWrap: { padding: '14px 20px' },
//     sectionHeader: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginBottom: 10,
//     },
//     sectionTitle: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: 7,
//       fontSize: 13,
//       fontWeight: 600,
//       color: '#212529',
//       margin: 0,
//     },
//     sectionBadge: {
//       fontSize: 12,
//       background: '#f1f3f5',
//       color: '#495057',
//       padding: '2px 12px',
//       borderRadius: 20,
//       border: '1px solid #dee2e6',
//       fontWeight: 500,
//     },
//     rowList: {
//       borderRadius: 8,
//       overflow: 'hidden',
//       border: '1px solid #e9ecef',
//     },
//     row: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '9px 14px',
//       background: '#fff',
//     },
//     rowLabel: { fontSize: 13, color: '#6c757d', margin: 0 },
//     rowValue: { fontSize: 13, fontWeight: 600, color: '#212529', margin: 0 },
//     rowDivider: { height: 1, background: '#f1f3f5' },
//     rowSub: {
//       fontSize: 11,
//       color: '#868e96',
//       margin: '0',
//       padding: '0 14px 8px',
//       display: 'flex',
//       alignItems: 'center',
//       gap: 4,
//     },

//     /* divider between sections */
//     sectionDivider: { height: 1, background: '#f1f3f5', margin: '0 20px' },

//     /* both-issues callout */
//     bothCard: {
//       borderRadius: 8,
//       border: '1px solid rgba(220,53,69,0.25)',
//       background: 'rgba(220,53,69,0.07)',
//       padding: '10px 14px',
//       margin: '0 20px 18px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       gap: 12,
//     },
//     bothLabel: { fontSize: 13, fontWeight: 600, color: '#842029', margin: '0 0 2px' },
//     bothSub: { fontSize: 12, color: '#842029', opacity: 0.8, margin: 0 },
//     bothCount: { fontSize: 16, fontWeight: 600, color: '#842029', flexShrink: 0 },

//     /* footer */
//     footer: { background: '#f8f9fa', borderTop: '1px solid #e9ecef' },
//     btnClose: {
//       fontSize: 13,
//       padding: '6px 18px',
//       borderRadius: 6,
//       border: '1px solid #dee2e6',
//       background: 'transparent',
//       color: '#6c757d',
//       cursor: 'pointer',
//     },
//     btnRefresh: {
//       fontSize: 13,
//       padding: '6px 18px',
//       borderRadius: 6,
//       border: '1px solid rgba(13,110,253,0.3)',
//       background: 'rgba(13,110,253,0.08)',
//       color: '#0d6efd',
//       fontWeight: 600,
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       gap: 6,
//     },
//   }

//   /* ─── sub-components ─────────────────────────────────────────── */
//   const Section = ({ icon, title, data }) => (
//     <>
//       <div style={s.sectionWrap}>
//         <div style={s.sectionHeader}>
//           <p style={s.sectionTitle}>
//             <CIcon icon={icon} size="sm" style={{ color: '#868e96' }} />
//             {title}
//           </p>
//           <span style={s.sectionBadge}>Total: {formatNumber(data?.count)}</span>
//         </div>
//         {data?.breakdown?.length > 0 && (
//           <div style={s.rowList}>
//             {data.breakdown.map((item, idx) => (
//               <div key={idx}>
//                 {idx > 0 && <div style={s.rowDivider} />}
//                 <div style={s.row}>
//                   <p style={s.rowLabel}>{item._id}</p>
//                   <p style={s.rowValue}>{formatNumber(item.count)}</p>
//                 </div>
//                 {item.selfInsuranceCount !== undefined && (
//                   <p style={s.rowSub}>
//                     <CIcon icon={cilInfo} size="sm" />
//                     Self insurance: {formatNumber(item.selfInsuranceCount)}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   )

//   return (
//     <>
//       {/* ── Header bar ─────────────────────────────────────────── */}
//       <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//         <CContainer className="border-bottom px-4" fluid>
//           <CHeaderToggler
//             onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//             style={{ marginInlineStart: '-14px' }}
//           >
//             <CIcon icon={cilMenu} size="lg" />
//           </CHeaderToggler>

//           <CHeaderNav className="align-items-center">
//             <div
//               className="position-relative d-flex align-items-center justify-content-center"
//               style={{ cursor: 'pointer', width: 36, height: 36, marginRight: 12 }}
//               onClick={handleNotificationClick}
//             >
//               <CIcon icon={cilBell} size="xl" className="d-block" />
//               {/* Show total count from awaitingApproval + kycNotUpdated + insuranceNotUpdated */}
//               {notificationData && (
//                 (() => {
//                   const total = (notificationData.awaitingApproval?.count || 0) + 
//                                (notificationData.kycNotUpdated?.count || 0) + 
//                                (notificationData.insuranceNotUpdated?.count || 0)
//                   return total > 0 && (
//                     <CBadge
//                       color="danger"
//                       shape="rounded-pill"
//                       className="position-absolute"
//                       style={{
//                         top: -4,
//                         right: -4,
//                         fontSize: 11,
//                         padding: '3px 6px',
//                         minWidth: 18,
//                         height: 18,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontWeight: 'bold',
//                       }}
//                     >
//                       {total}
//                     </CBadge>
//                   )
//                 })()
//               )}
//             </div>
//             <AppHeaderDropdown />
//           </CHeaderNav>
//         </CContainer>

//         <CContainer className="px-4" fluid>
//           <AppBreadcrumb />
//         </CContainer>
//       </CHeader>

//       {/* ── Notification Modal ─────────────────────────────────── */}
//       <CModal
//         visible={notificationModal}
//         onClose={() => setNotificationModal(false)}
//         size="lg"
//         scrollable
//         alignment="center"
//       >
//         {/* Header */}
//         <CModalHeader
//           style={{ borderBottom: '1px solid #e9ecef', paddingBottom: 12 }}
//           closeButton={false}
//         >
//           <div className="d-flex align-items-center justify-content-between w-100">
//             <div className="d-flex align-items-center gap-2">
//               <div style={s.iconCircle}>
//                 <CIcon icon={cilBell} size="sm" style={{ color: '#0d6efd' }} />
//               </div>
//               <div>
//                 <CModalTitle style={{ fontSize: 15, fontWeight: 600, marginBottom: 0 }}>
//                   Notifications
//                 </CModalTitle>
//                 <p style={s.headerSub}>Booking status overview</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setNotificationModal(false)}
//               style={{
//                 background: '#f1f3f5',
//                 border: '1px solid #dee2e6',
//                 borderRadius: '50%',
//                 width: 28,
//                 height: 28,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 padding: 0,
//               }}
//             >
//               <CIcon icon={cilX} size="sm" style={{ color: '#6c757d' }} />
//             </button>
//           </div>
//         </CModalHeader>

//         {/* Body */}
//         <CModalBody style={{ padding: 0 }}>
//           {/* Loading */}
//           {loading && (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3 mb-0 text-muted" style={{ fontSize: 13 }}>
//                 Loading notifications...
//               </p>
//             </div>
//           )}

//           {/* Error */}
//           {error && (
//             <div style={{ padding: '16px 20px' }}>
//               <CAlert color="danger" className="mb-0" style={{ fontSize: 13 }}>
//                 {error}
//               </CAlert>
//             </div>
//           )}

//           {/* Content */}
//           {notificationData && !loading && (
//             <>
//               {/* Warnings from API */}
//               {notificationData.warnings && notificationData.warnings.length > 0 && (
//                 <div style={s.warningStrip}>
//                   <CIcon icon={cilWarning} size="sm" style={{ color: '#856404', flexShrink: 0, marginTop: 1 }} />
//                   <div>
//                     {notificationData.warnings.map((w, i) => (
//                       <p key={i} style={s.warnText}>{w}</p>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Sections - only show what API provides */}
//               <Section
//                 icon={cilClock}
//                 title="Awaiting approval"
//                 data={notificationData.awaitingApproval}
//               />
//               <div style={s.sectionDivider} />
//               <Section
//                 icon={cilBadge}
//                 title="KYC not updated"
//                 data={notificationData.kycNotUpdated}
//               />
//               <div style={s.sectionDivider} />
//               <Section
//                 icon={cilShieldAlt}
//                 title="Insurance not updated"
//                 data={notificationData.insuranceNotUpdated}
//               />

//               {/* Both issues callout - only if exists in API */}
//               {notificationData.bothIssues && (
//                 <div style={s.bothCard}>
//                   <div className="d-flex align-items-center gap-2">
//                     <CIcon icon={cilWarning} size="sm" style={{ color: '#842029', flexShrink: 0 }} />
//                     <div>
//                       <p style={s.bothLabel}>Both KYC and insurance pending</p>
//                       <p style={s.bothSub}>
//                         {notificationData.bothIssues.description || 'Requires immediate attention'}
//                       </p>
//                     </div>
//                   </div>
//                   <p style={s.bothCount}>
//                     {formatNumber(notificationData.bothIssues.count)}
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </CModalBody>

//         {/* Footer */}
//         <CModalFooter
//           style={{ ...s.footer, display: 'flex', justifyContent: 'flex-end', gap: 8 }}
//         >
//           <button style={s.btnClose} onClick={() => setNotificationModal(false)}>
//             Close
//           </button>
//           {notificationData && (
//             <button style={s.btnRefresh} onClick={fetchNotificationCounts}>
//               <CIcon icon={cilCheckCircle} size="sm" />
//               Refresh
//             </button>
//           )}
//         </CModalFooter>
//       </CModal>
//     </>
//   )
// }

// export default AppHeader







// import React, { useEffect, useRef, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import {
//   CContainer,
//   CHeader,
//   CHeaderNav,
//   CHeaderToggler,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton,
//   CBadge,
//   CSpinner,
//   CAlert,
//   CFormInput,
//   CForm,
//   CInputGroup,
//   CInputGroupText,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilMenu,
//   cilBell,
//   cilWarning,
//   cilCheckCircle,
//   cilX,
//   cilClock,
//   cilBadge,
//   cilShieldAlt,
//   cilInfo,
//   cilLockLocked,
//   cilPlus,
//   cilReload,
//   cilList,
// } from '@coreui/icons'


// import { AppBreadcrumb } from './index'
// import { AppHeaderDropdown } from './header/index'
// import axiosInstance from '../axiosInstance'

// const AppHeader = () => {
//   const headerRef = useRef()
//   const dispatch = useDispatch()
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   const [notificationModal, setNotificationModal] = useState(false)
//   const [notificationData, setNotificationData] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   // OTP states
//   const [otpModal, setOtpModal] = useState(false)
//   const [otpData, setOtpData] = useState(null)
//   const [otpLoading, setOtpLoading] = useState(false)
//   const [otpError, setOtpError] = useState(null)
//   const [otpCode, setOtpCode] = useState('')
//   const [otpSuccess, setOtpSuccess] = useState(null)
//   const [isCreatingOtp, setIsCreatingOtp] = useState(false)

//   const fetchNotificationCounts = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await axiosInstance.get('/bookings/pending-counts')
//       if (response.data.success) {
//         setNotificationData(response.data.data)
//       } else {
//         setError('Failed to fetch notification data')
//       }
//     } catch (err) {
//       const message = showError(err)
//       setError(message || 'Error fetching notifications')
//       console.error('Error fetching notifications:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleNotificationClick = () => {
//     setNotificationModal(true)
//     if (!notificationData) {
//       fetchNotificationCounts()
//     }
//   }

//   // OTP handlers
//   const handleOtpClick = () => {
//     setOtpModal(true)
//     fetchOtps()
//   }

//   const fetchOtps = async () => {
//     setOtpLoading(true)
//     setOtpError(null)
//     try {
//       const response = await axiosInstance.get('/otp')
//       if (response.data.status === 'success') {
//         // Handle the new response structure with single OTP object
//         setOtpData(response.data.data)
//         setOtpSuccess(null)
//       } else {
//         setOtpError('Failed to fetch OTP')
//       }
//     } catch (err) {
//       setOtpError('Error fetching OTP')
//       console.error('Error fetching OTP:', err)
//     } finally {
//       setOtpLoading(false)
//     }
//   }

//   const createOtp = async () => {
//     if (!otpCode.trim()) {
//       setOtpError('Please enter an OTP code')
//       return
//     }

//     setIsCreatingOtp(true)
//     setOtpError(null)
//     setOtpSuccess(null)

//     try {
//       const response = await axiosInstance.post('/otp', { code: otpCode })
//       if (response.data.status === 'success') {
//         setOtpSuccess('OTP created successfully!')
//         setOtpCode('')
//         // Refresh the OTP
//         await fetchOtps()
//         setTimeout(() => setOtpSuccess(null), 3000)
//       } else {
//         setOtpError('Failed to create OTP')
//       }
//     } catch (err) {
//       setOtpError('Error creating OTP')
//       console.error('Error creating OTP:', err)
//     } finally {
//       setIsCreatingOtp(false)
//     }
//   }

//   useEffect(() => {
//     const handleScroll = () => {
//       headerRef.current &&
//         headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
//     }
//     document.addEventListener('scroll', handleScroll)
//     return () => document.removeEventListener('scroll', handleScroll)
//   }, [])

//   const formatNumber = (num) => num?.toLocaleString() || 0

//   /* ─── inline styles ─────────────────────────────────────────── */
//   const s = {
//     /* modal header */
//     iconCircle: {
//       width: 34,
//       height: 34,
//       borderRadius: '50%',
//       background: 'rgba(13,110,253,0.1)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       flexShrink: 0,
//     },
//     headerSub: { fontSize: 12, color: '#6c757d', margin: 0 },

//     /* summary tiles */
//     warningStrip: {
//       display: 'flex',
//       alignItems: 'flex-start',
//       gap: 8,
//       background: 'rgba(255,193,7,0.12)',
//       padding: '12px 16px',
//       margin: '12px 20px',
//       borderRadius: 8,
//       borderLeft: '3px solid #ffc107',
//     },
//     warnText: { fontSize: 13, color: '#856404', margin: 0, lineHeight: 1.5 },

//     /* section */
//     sectionWrap: { padding: '14px 20px' },
//     sectionHeader: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginBottom: 10,
//     },
//     sectionTitle: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: 7,
//       fontSize: 13,
//       fontWeight: 600,
//       color: '#212529',
//       margin: 0,
//     },
//     sectionBadge: {
//       fontSize: 12,
//       background: '#f1f3f5',
//       color: '#495057',
//       padding: '2px 12px',
//       borderRadius: 20,
//       border: '1px solid #dee2e6',
//       fontWeight: 500,
//     },
//     rowList: {
//       borderRadius: 8,
//       overflow: 'hidden',
//       border: '1px solid #e9ecef',
//     },
//     row: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '9px 14px',
//       background: '#fff',
//     },
//     rowLabel: { fontSize: 13, color: '#6c757d', margin: 0 },
//     rowValue: { fontSize: 13, fontWeight: 600, color: '#212529', margin: 0 },
//     rowDivider: { height: 1, background: '#f1f3f5' },
//     rowSub: {
//       fontSize: 11,
//       color: '#868e96',
//       margin: '0',
//       padding: '0 14px 8px',
//       display: 'flex',
//       alignItems: 'center',
//       gap: 4,
//     },

//     /* divider between sections */
//     sectionDivider: { height: 1, background: '#f1f3f5', margin: '0 20px' },

//     /* both-issues callout */
//     bothCard: {
//       borderRadius: 8,
//       border: '1px solid rgba(220,53,69,0.25)',
//       background: 'rgba(220,53,69,0.07)',
//       padding: '10px 14px',
//       margin: '0 20px 18px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       gap: 12,
//     },
//     bothLabel: { fontSize: 13, fontWeight: 600, color: '#842029', margin: '0 0 2px' },
//     bothSub: { fontSize: 12, color: '#842029', opacity: 0.8, margin: 0 },
//     bothCount: { fontSize: 16, fontWeight: 600, color: '#842029', flexShrink: 0 },

//     /* footer */
//     footer: { background: '#f8f9fa', borderTop: '1px solid #e9ecef' },
//     btnClose: {
//       fontSize: 13,
//       padding: '6px 18px',
//       borderRadius: 6,
//       border: '1px solid #dee2e6',
//       background: 'transparent',
//       color: '#6c757d',
//       cursor: 'pointer',
//       transition: 'all 0.2s',
//     },
//     btnRefresh: {
//       fontSize: 13,
//       padding: '6px 18px',
//       borderRadius: 6,
//       border: '1px solid rgba(13,110,253,0.3)',
//       background: 'rgba(13,110,253,0.08)',
//       color: '#0d6efd',
//       fontWeight: 600,
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       gap: 6,
//       transition: 'all 0.2s',
//     },
//     // OTP styles
//     otpContainer: { padding: '20px' },
//     otpItem: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '16px 20px',
//       background: '#f8f9fa',
//       borderRadius: 8,
//       border: '1px solid #e9ecef',
//     },
//     otpCode: {
//       fontSize: 20,
//       fontWeight: 700,
//       color: '#0d6efd',
//       fontFamily: 'monospace',
//       letterSpacing: 3,
//     },
//     otpId: { fontSize: 12, color: '#6c757d', fontFamily: 'monospace', marginTop: 4 },
//     otpEmpty: {
//       textAlign: 'center',
//       padding: '30px 20px',
//       color: '#6c757d',
//     },
//     createOtpSection: {
//       background: '#f8f9fa',
//       padding: '16px',
//       borderRadius: 8,
//       border: '1px solid #e9ecef',
//       marginBottom: 20,
//     },
//     otpDetailCard: {
//       background: 'white',
//       padding: '16px',
//       borderRadius: 8,
//       border: '1px solid #e9ecef',
//     },
//     otpLabel: {
//       fontSize: 12,
//       color: '#6c757d',
//       marginBottom: 4,
//       textTransform: 'uppercase',
//       letterSpacing: 0.5,
//     },
//   }

//   /* ─── sub-components ─────────────────────────────────────────── */
//   const Section = ({ icon, title, data }) => (
//     <>
//       <div style={s.sectionWrap}>
//         <div style={s.sectionHeader}>
//           <p style={s.sectionTitle}>
//             <CIcon icon={icon} size="sm" style={{ color: '#868e96' }} />
//             {title}
//           </p>
//           <span style={s.sectionBadge}>Total: {formatNumber(data?.count)}</span>
//         </div>
//         {data?.breakdown?.length > 0 && (
//           <div style={s.rowList}>
//             {data.breakdown.map((item, idx) => (
//               <div key={idx}>
//                 {idx > 0 && <div style={s.rowDivider} />}
//                 <div style={s.row}>
//                   <p style={s.rowLabel}>{item._id}</p>
//                   <p style={s.rowValue}>{formatNumber(item.count)}</p>
//                 </div>
//                 {item.selfInsuranceCount !== undefined && (
//                   <p style={s.rowSub}>
//                     <CIcon icon={cilInfo} size="sm" />
//                     Self insurance: {formatNumber(item.selfInsuranceCount)}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   )

//   return (
//     <>
//       {/* ── Header bar ─────────────────────────────────────────── */}
//       <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
//         <CContainer className="border-bottom px-4" fluid>
//           <CHeaderToggler
//             onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//             style={{ marginInlineStart: '-14px' }}
//           >
//             <CIcon icon={cilMenu} size="lg" />
//           </CHeaderToggler>

//           <CHeaderNav className="align-items-center">
//             {/* Today's OTP Button */}
//             <div
//               className="d-flex align-items-center justify-content-center"
//               style={{
//                 cursor: 'pointer',
//                 padding: '4px 12px',
//                 borderRadius: 6,
//                 border: '1px solid #dee2e6',
//                 background: '#f8f9fa',
//                 marginRight: 12,
//                 transition: 'all 0.2s',
//                 gap: 6,
//               }}
//               onClick={handleOtpClick}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = '#e9ecef'
//                 e.currentTarget.style.borderColor = '#ced4da'
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = '#f8f9fa'
//                 e.currentTarget.style.borderColor = '#dee2e6'
//               }}
//             >
//               <CIcon icon={cilLockLocked} size="sm" style={{ color: '#0d6efd' }} />
//               <span style={{ fontSize: 13, fontWeight: 500, color: '#212529' }}>Today's OTP</span>
//             </div>

//             {/* Notification Bell */}
//             <div
//               className="position-relative d-flex align-items-center justify-content-center"
//               style={{ cursor: 'pointer', width: 36, height: 36, marginRight: 12 }}
//               onClick={handleNotificationClick}
//             >
//               <CIcon icon={cilBell} size="xl" className="d-block" />
//               {notificationData && (
//                 (() => {
//                   const total = (notificationData.awaitingApproval?.count || 0) + 
//                                (notificationData.kycNotUpdated?.count || 0) + 
//                                (notificationData.insuranceNotUpdated?.count || 0)
//                   return total > 0 && (
//                     <CBadge
//                       color="danger"
//                       shape="rounded-pill"
//                       className="position-absolute"
//                       style={{
//                         top: -4,
//                         right: -4,
//                         fontSize: 11,
//                         padding: '3px 6px',
//                         minWidth: 18,
//                         height: 18,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontWeight: 'bold',
//                       }}
//                     >
//                       {total}
//                     </CBadge>
//                   )
//                 })()
//               )}
//             </div>
//             <AppHeaderDropdown />
//           </CHeaderNav>
//         </CContainer>

//         <CContainer className="px-4" fluid>
//           <AppBreadcrumb />
//         </CContainer>
//       </CHeader>

//       {/* ── Notification Modal ─────────────────────────────────── */}
//       <CModal
//         visible={notificationModal}
//         onClose={() => setNotificationModal(false)}
//         size="lg"
//         scrollable
//         alignment="center"
//       >
//         <CModalHeader
//           style={{ borderBottom: '1px solid #e9ecef', paddingBottom: 12 }}
//           closeButton={false}
//         >
//           <div className="d-flex align-items-center justify-content-between w-100">
//             <div className="d-flex align-items-center gap-2">
//               <div style={s.iconCircle}>
//                 <CIcon icon={cilBell} size="sm" style={{ color: '#0d6efd' }} />
//               </div>
//               <div>
//                 <CModalTitle style={{ fontSize: 15, fontWeight: 600, marginBottom: 0 }}>
//                   Notifications
//                 </CModalTitle>
//                 <p style={s.headerSub}>Booking status overview</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setNotificationModal(false)}
//               style={{
//                 background: '#f1f3f5',
//                 border: '1px solid #dee2e6',
//                 borderRadius: '50%',
//                 width: 28,
//                 height: 28,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 padding: 0,
//               }}
//             >
//               <CIcon icon={cilX} size="sm" style={{ color: '#6c757d' }} />
//             </button>
//           </div>
//         </CModalHeader>

//         <CModalBody style={{ padding: 0 }}>
//           {loading && (
//             <div className="text-center py-5">
//               <CSpinner color="primary" />
//               <p className="mt-3 mb-0 text-muted" style={{ fontSize: 13 }}>
//                 Loading notifications...
//               </p>
//             </div>
//           )}

//           {error && (
//             <div style={{ padding: '16px 20px' }}>
//               <CAlert color="danger" className="mb-0" style={{ fontSize: 13 }}>
//                 {error}
//               </CAlert>
//             </div>
//           )}

//           {notificationData && !loading && (
//             <>
//               {notificationData.warnings && notificationData.warnings.length > 0 && (
//                 <div style={s.warningStrip}>
//                   <CIcon icon={cilWarning} size="sm" style={{ color: '#856404', flexShrink: 0, marginTop: 1 }} />
//                   <div>
//                     {notificationData.warnings.map((w, i) => (
//                       <p key={i} style={s.warnText}>{w}</p>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <Section
//                 icon={cilClock}
//                 title="Awaiting approval"
//                 data={notificationData.awaitingApproval}
//               />
//               <div style={s.sectionDivider} />
//               <Section
//                 icon={cilBadge}
//                 title="KYC not updated"
//                 data={notificationData.kycNotUpdated}
//               />
//               <div style={s.sectionDivider} />
//               <Section
//                 icon={cilShieldAlt}
//                 title="Insurance not updated"
//                 data={notificationData.insuranceNotUpdated}
//               />

//               {notificationData.bothIssues && (
//                 <div style={s.bothCard}>
//                   <div className="d-flex align-items-center gap-2">
//                     <CIcon icon={cilWarning} size="sm" style={{ color: '#842029', flexShrink: 0 }} />
//                     <div>
//                       <p style={s.bothLabel}>Both KYC and insurance pending</p>
//                       <p style={s.bothSub}>
//                         {notificationData.bothIssues.description || 'Requires immediate attention'}
//                       </p>
//                     </div>
//                   </div>
//                   <p style={s.bothCount}>
//                     {formatNumber(notificationData.bothIssues.count)}
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </CModalBody>

//         <CModalFooter
//           style={{ ...s.footer, display: 'flex', justifyContent: 'flex-end', gap: 8 }}
//         >
//           <button style={s.btnClose} onClick={() => setNotificationModal(false)}>
//             Close
//           </button>
//           {notificationData && (
//             <button style={s.btnRefresh} onClick={fetchNotificationCounts}>
//               <CIcon icon={cilCheckCircle} size="sm" />
//               Refresh
//             </button>
//           )}
//         </CModalFooter>
//       </CModal>

//       {/* ── OTP Modal ─────────────────────────────────── */}
//       <CModal
//         visible={otpModal}
//         onClose={() => setOtpModal(false)}
//         size="md"
//         scrollable
//         alignment="center"
//       >
//         <CModalHeader
//           style={{ borderBottom: '1px solid #e9ecef', paddingBottom: 12 }}
//           closeButton={false}
//         >
//           <div className="d-flex align-items-center justify-content-between w-100">
//             <div className="d-flex align-items-center gap-2">
//               <div style={s.iconCircle}>
//                 <CIcon icon={cilLockLocked} size="sm" style={{ color: '#0d6efd' }} />
//               </div>
//               <div>
//                 <CModalTitle style={{ fontSize: 15, fontWeight: 600, marginBottom: 0 }}>
//                   Today's OTP
//                 </CModalTitle>
//                 <p style={s.headerSub}>Manage OTP codes</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setOtpModal(false)}
//               style={{
//                 background: '#f1f3f5',
//                 border: '1px solid #dee2e6',
//                 borderRadius: '50%',
//                 width: 28,
//                 height: 28,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 padding: 0,
//               }}
//             >
//               <CIcon icon={cilX} size="sm" style={{ color: '#6c757d' }} />
//             </button>
//           </div>
//         </CModalHeader>

//         <CModalBody>
//           <div style={s.otpContainer}>
//             {/* Create OTP Section */}
//             <div style={s.createOtpSection}>
//               <CForm onSubmit={(e) => { e.preventDefault(); createOtp(); }}>
//                 <div className="d-flex align-items-center gap-2">
//                   <CInputGroup>
//                     <CInputGroupText>
//                       <CIcon icon={cilPlus} size="sm" />
//                     </CInputGroupText>
//                     <CFormInput
//                       placeholder="Enter OTP code (e.g., 123456)"
//                       value={otpCode}
//                       onChange={(e) => setOtpCode(e.target.value)}
//                       disabled={isCreatingOtp}
//                       style={{ fontSize: 14 }}
//                     />
//                   </CInputGroup>
//                   <CButton
//                     color="primary"
//                     onClick={createOtp}
//                     disabled={isCreatingOtp || !otpCode.trim()}
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     {isCreatingOtp ? (
//                       <>
//                         <CSpinner size="sm" className="me-1" />
//                         Creating...
//                       </>
//                     ) : (
//                       'Create OTP'
//                     )}
//                   </CButton>
//                 </div>
//                 {otpError && (
//                   <CAlert color="danger" className="mt-2 mb-0" style={{ fontSize: 13 }}>
//                     {otpError}
//                   </CAlert>
//                 )}
//                 {otpSuccess && (
//                   <CAlert color="success" className="mt-2 mb-0" style={{ fontSize: 13 }}>
//                     {otpSuccess}
//                   </CAlert>
//                 )}
//               </CForm>
//             </div>

//             {/* OTP Display */}
//             {otpLoading ? (
//               <div className="text-center py-4">
//                 <CSpinner color="primary" />
//                 <p className="mt-2 mb-0 text-muted" style={{ fontSize: 13 }}>
//                   Loading OTP...
//                 </p>
//               </div>
//             ) : otpData?.otp ? (
//               <div>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <span style={{ fontSize: 13, color: '#6c757d' }}>
//                     Current OTP
//                   </span>
//                   {/* <CButton
//                     color="link"
//                     size="sm"
//                     onClick={fetchOtps}
//                     style={{ textDecoration: 'none', padding: 0 }}
//                   >
//                     <CIcon icon={cilReload} size="sm" className="me-1" />
//                     Refresh
//                   </CButton> */}
//                 </div>
//                 <div style={s.otpItem}>
//                   <div>
//                     <div style={s.otpLabel}>OTP Code</div>
//                     <div style={s.otpCode}>{otpData.otp.code}</div>
                    
//                   </div>
//                   <CBadge color="success" style={{ fontSize: 12, padding: '6px 14px' }}>
//                     Active
//                   </CBadge>
//                 </div>
//               </div>
//             ) : (
//               <div style={s.otpEmpty}>
//                 <CIcon icon={cilList} size="xl" style={{ color: '#dee2e6', marginBottom: 12 }} />
//                 <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>No OTP found</p>
//                 <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6c757d' }}>
//                   Create an OTP code using the form above
//                 </p>
//               </div>
//             )}
//           </div>
//         </CModalBody>

//         <CModalFooter
//           style={{ ...s.footer, display: 'flex', justifyContent: 'flex-end', gap: 8 }}
//         >
//           <button style={s.btnClose} onClick={() => setOtpModal(false)}>
//             Close
//           </button>
//         </CModalFooter>
//       </CModal>
//     </>
//   )
// }

// export default AppHeader



import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from 'src/context/AuthContext'
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
  CFormInput,
  CForm,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilMenu,
  cilBell,
  cilCheckCircle,
  cilX,
  cilShieldAlt,
  cilInfo,
  cilLockLocked,
  cilPlus,
  cilReload,
  cilList,
  cilWarning,
  cilCheck,
  cilEnvelopeOpen,
  cilCalendar,
  cilUser,
  cilBookmark,
  cilClock,
  cilBan,
  cilCart,
  cilDescription,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

import InsuranceLive from '../views/insurance/insurance-live/InsuranceLive'
import axiosInstance from '../axiosInstance'

/* ─── Roles allowed to see notifications (case-sensitive, must match API) ─── */
const ALLOWED_NOTIFICATION_ROLES = [
  'ADMIN',
  'MANAGER',
  'GENERAL_MANAGER',
  
]

/* ─── Notification Tab Configuration ───────────────────────────── */
const NOTIFICATION_TABS = [
  { key: 'ALL', label: 'All', icon: cilBell },
  { key: 'NEW_BOOKING', label: 'New Bookings', icon: cilCart },
  { key: 'APPROVED_BOOKING', label: 'Approved', icon: cilCheckCircle },
  { key: 'PENDING_INSURANCE', label: 'Pending Insurance', icon: cilShieldAlt },
  { key: 'COMPLETED_INSURANCE', label: 'Completed Insurance', icon: cilShieldAlt },
  { key: 'SELF_INSURANCE_BOOKING', label: 'Self Insurance', icon: cilDescription },
]

/* ─── Severity helpers ─────────────────────────────────────────── */
const severityStyles = {
  warning: { bg: 'rgba(255,193,7,0.12)', border: '#ffc107', text: '#856404', icon: cilWarning },
  success: { bg: 'rgba(25,135,84,0.10)', border: '#198754', text: '#0f5132', icon: cilCheckCircle },
  error: { bg: 'rgba(220,53,69,0.10)', border: '#dc3545', text: '#842029', icon: cilWarning },
  info: { bg: 'rgba(13,110,253,0.10)', border: '#0d6efd', text: '#084298', icon: cilInfo },
}

const getSeverity = (sev) => severityStyles[sev] || severityStyles.info

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

const formatFullDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const PAGE_LIMIT = 20

/* ─── Main Component ───────────────────────────────────────────── */
const AppHeader = () => {
  const { user } = useAuth()

  // Extract role names from user object (roles is an array of objects with `name`)
  const userRoleNames = (user?.roles || [])
    .map((role) => (typeof role === 'string' ? role : role?.name))
    .filter(Boolean)

  const canSeeNotifications = userRoleNames.some((name) =>
    ALLOWED_NOTIFICATION_ROLES.includes(name),
  )

  const headerRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  /* Notification states */
  const [notificationModal, setNotificationModal] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeTab, setActiveTab] = useState('ALL')
  /**
   * Cache structure:
   * {
   *   [tabKey]: {
   *     items: [],
   *     page: 1,
   *     hasMore: false,
   *     loading: false,
   *     error: null,
   *     loaded: false,
   *   }
   * }
   */
  const [tabCache, setTabCache] = useState({})
  const [markingAll, setMarkingAll] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  /* Insurance Live states */
  const [insuranceModal, setInsuranceModal] = useState(false)

  /* OTP states */
  const [otpModal, setOtpModal] = useState(false)
  const [otpData, setOtpData] = useState(null)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState(null)
  const [otpCode, setOtpCode] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(null)
  const [isCreatingOtp, setIsCreatingOtp] = useState(false)

  const activeCache = tabCache[activeTab] || {
    items: [],
    page: 1,
    hasMore: false,
    loading: false,
    error: null,
    loaded: false,
  }

  /* ─── Notification API ─────────────────────────────────────── */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/NotificationMs/unread-count')
      if (response.data.success) {
        setUnreadCount(response.data.data.unreadCount || 0)
      }
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }, [])

  const fetchByType = useCallback(async (tabKey, page = 1, append = false) => {
    setTabCache((prev) => ({
      ...prev,
      [tabKey]: {
        ...(prev[tabKey] || {
          items: [],
          page: 1,
          hasMore: false,
          loaded: false,
        }),
        loading: true,
        error: null,
      },
    }))

    try {
      const url =
        tabKey === 'ALL'
          ? '/NotificationMs'
          : `/NotificationMs/by-type/${tabKey}`

      const response = await axiosInstance.get(url, {
        params: {
          page,
          limit: PAGE_LIMIT,
          includeResolved: false,
        },
      })

      if (response.data.success) {
        // NEW_BOOKING API returns bookings[] instead of notifications[]
        const data = response.data.data || {}

        let incoming = data.notifications || []

        // Specific booking APIs return bookings[] instead of notifications[]
        if (Array.isArray(data.bookings)) {
          const meta = data.meta || {}

          incoming = data.bookings.map((booking) => ({
            _id: booking._id,
            type: tabKey,
            category: meta.category || 'BOOKING',
            severity: meta.severity || 'info',
            title: meta.label || 'Booking Notification',
            message:
              tabKey === 'NEW_BOOKING'
                ? `New booking ${booking.bookingNumber || ''} has been created.`
                : `${meta.label || 'Booking'} for ${booking.bookingNumber || ''}.`,
            bookingNumber: booking.bookingNumber || '',
            customerName: booking.customerDetails?.name || 'Unknown Customer',
            modelName: booking.model?.model_name || '',
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            isRead: false,
            isSynthetic: true,
            meta: {
              bookingId: booking._id,
              status: booking.status,
              insuranceStatus: booking.insuranceStatus,
              chassisAllocationStatus: booking.chassisAllocationStatus,
            },
          }))
        }

        setTabCache((prev) => {
          const existing = prev[tabKey] || { items: [] }

          return {
            ...prev,
            [tabKey]: {
              items: append ? [...existing.items, ...incoming] : incoming,
              page,
              hasMore: incoming.length === PAGE_LIMIT,
              loading: false,
              error: null,
              loaded: true,
            },
          }
        })
      } else {
        setTabCache((prev) => ({
          ...prev,
          [tabKey]: {
            ...(prev[tabKey] || {}),
            loading: false,
            error: 'Failed to fetch notifications',
            loaded: true,
          },
        }))
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)

      setTabCache((prev) => ({
        ...prev,
        [tabKey]: {
          ...(prev[tabKey] || {}),
          loading: false,
          error: 'Error fetching notifications',
          loaded: true,
        },
      }))
    }
  }, [])

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    try {
      const response = await axiosInstance.patch('/NotificationMs/read-all')
      if (response.data.success) {
        setTabCache((prev) => {
          const next = {}
          Object.keys(prev).forEach((k) => {
            next[k] = {
              ...prev[k],
              items: prev[k].items.map((n) => ({ ...n, isRead: true })),
            }
          })
          return next
        })
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Error marking all as read:', err)
    } finally {
      setMarkingAll(false)
    }
  }

  const handleNotificationRead = async (notification) => {
    if (notification.isRead || notification.isSynthetic) return
    try {
      const response = await axiosInstance.patch(`/NotificationMs/${notification._id}/read`)
      if (response.data.success) {
        setTabCache((prev) => {
          const next = {}
          Object.keys(prev).forEach((k) => {
            next[k] = {
              ...prev[k],
              items: prev[k].items.map((n) =>
                n._id === notification._id ? { ...n, isRead: true } : n,
              ),
            }
          })
          return next
        })
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleNotificationClick = () => {
    if (!canSeeNotifications) return
    setNotificationModal(true)
    fetchUnreadCount()
    if (!tabCache[activeTab]?.loaded) {
      fetchByType(activeTab, 1, false)
    }
  }

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setExpandedId(null)
    if (!tabCache[tabKey]?.loaded) {
      fetchByType(tabKey, 1, false)
    }
  }

  const handleLoadMore = () => {
    if (!activeCache.loading && activeCache.hasMore) {
      fetchByType(activeTab, activeCache.page + 1, true)
    }
  }

  const handleNotificationItemClick = (n) => {
    setExpandedId((prev) => (prev === n._id ? null : n._id))
    handleNotificationRead(n)
  }

  const handleRefresh = () => {
    fetchUnreadCount()
    fetchByType(activeTab, 1, false)
  }

  /* ─── OTP handlers ─────────────────────────────────────────── */
  const handleOtpClick = () => {
    setOtpModal(true)
    fetchOtps()
  }

  const fetchOtps = async () => {
    setOtpLoading(true)
    setOtpError(null)
    try {
      const response = await axiosInstance.get('/otp')
      if (response.data.status === 'success') {
        setOtpData(response.data.data)
        setOtpSuccess(null)
      } else {
        setOtpError('Failed to fetch OTP')
      }
    } catch (err) {
      setOtpError('Error fetching OTP')
      console.error('Error fetching OTP:', err)
    } finally {
      setOtpLoading(false)
    }
  }

  const createOtp = async () => {
    if (!otpCode.trim()) {
      setOtpError('Please enter an OTP code')
      return
    }

    setIsCreatingOtp(true)
    setOtpError(null)
    setOtpSuccess(null)

    try {
      const response = await axiosInstance.post('/otp', { code: otpCode })
      if (response.data.status === 'success') {
        setOtpSuccess('OTP created successfully!')
        setOtpCode('')
        await fetchOtps()
        setTimeout(() => setOtpSuccess(null), 3000)
      } else {
        setOtpError('Failed to create OTP')
      }
    } catch (err) {
      setOtpError('Error creating OTP')
      console.error('Error creating OTP:', err)
    } finally {
      setIsCreatingOtp(false)
    }
  }

  /* ─── Poll unread count periodically ───────────────────────── */
  useEffect(() => {
    if (!canSeeNotifications) return
    fetchUnreadCount()

    const interval = setInterval(fetchUnreadCount, 60000)

    return () => clearInterval(interval)
  }, [canSeeNotifications, fetchUnreadCount])

  /* ─── Auto-open notifications after login (role-gated) ─────── */
  useEffect(() => {
    // Wait until user object (with roles) is actually loaded
    if (!user?.roles?.length) return

    const shouldOpen =
      localStorage.getItem('openNotificationsAfterLogin') === 'true'

    if (!shouldOpen) return

    // Clear the flag regardless so it doesn't loop
    localStorage.removeItem('openNotificationsAfterLogin')

    if (canSeeNotifications) {
      setNotificationModal(true)
      fetchUnreadCount()
      fetchByType('ALL', 1, false)
    }
  }, [user, canSeeNotifications, fetchUnreadCount, fetchByType])

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

    /* tabs */
    tabsBar: {
      display: 'flex',
      gap: 4,
      padding: '8px 16px',
      overflowX: 'auto',
      overflowY: 'hidden',
      background: '#fff',
      borderBottom: '1px solid #e9ecef',
      scrollbarWidth: 'thin',
      minHeight: '50px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 2,
      flexShrink: 0,
    },
    tab: (isActive) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12.5,
      fontWeight: isActive ? 600 : 500,
      color: isActive ? '#fff' : '#495057',
      background: isActive ? '#0d6efd' : '#f1f3f5',
      border: `1px solid ${isActive ? '#0d6efd' : '#e9ecef'}`,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.15s',
      flexShrink: 0,
    }),

    /* notification list */
    notifList: { padding: '6px 0' },
    notifItem: (isRead) => ({
      display: 'flex',
      gap: 12,
      padding: '12px 20px',
      cursor: 'pointer',
      background: isRead ? '#fff' : 'rgba(13,110,253,0.04)',
      borderLeft: isRead ? '3px solid transparent' : '3px solid #0d6efd',
      transition: 'background 0.15s',
    }),
    notifIcon: (sev) => ({
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: getSeverity(sev).bg,
      border: `1px solid ${getSeverity(sev).border}33`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }),
    notifBody: { flex: 1, minWidth: 0 },
    notifTitle: {
      fontSize: 13.5,
      fontWeight: 600,
      color: '#212529',
      margin: '0 0 2px',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    notifMsg: {
      fontSize: 12.5,
      color: '#495057',
      margin: 0,
      lineHeight: 1.5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    notifMsgExpanded: {
      fontSize: 12.5,
      color: '#495057',
      margin: 0,
      lineHeight: 1.5,
    },
    notifMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 6,
      fontSize: 11.5,
      color: '#868e96',
      flexWrap: 'wrap',
    },
    notifChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '1px 8px',
      borderRadius: 12,
      background: '#f1f3f5',
      fontSize: 11,
      color: '#495057',
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#0d6efd',
      flexShrink: 0,
      marginTop: 6,
    },
    notifDetail: {
      marginTop: 8,
      padding: '10px 12px',
      background: '#f8f9fa',
      borderRadius: 6,
      border: '1px solid #e9ecef',
      fontSize: 12,
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '3px 0',
      gap: 12,
    },
    detailLabel: { color: '#868e96', flexShrink: 0 },
    detailValue: { color: '#212529', fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' },

    /* divider */
    sectionDivider: { height: 1, background: '#f1f3f5' },

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
      transition: 'all 0.2s',
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
      transition: 'all 0.2s',
    },
    btnMarkAll: {
      fontSize: 13,
      padding: '6px 18px',
      borderRadius: 6,
      border: '1px solid rgba(25,135,84,0.3)',
      background: 'rgba(25,135,84,0.08)',
      color: '#198754',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 0.2s',
    },
    loadMoreBtn: {
      width: '100%',
      padding: '10px',
      background: '#f8f9fa',
      border: 'none',
      borderTop: '1px solid #e9ecef',
      color: '#0d6efd',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
    },
    emptyState: {
      textAlign: 'center',
      padding: '50px 20px',
      color: '#6c757d',
    },
    // OTP styles
    otpContainer: { padding: '20px' },
    otpItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      background: '#f8f9fa',
      borderRadius: 8,
      border: '1px solid #e9ecef',
    },
    otpCode: {
      fontSize: 20,
      fontWeight: 700,
      color: '#0d6efd',
      fontFamily: 'monospace',
      letterSpacing: 3,
    },
    otpId: { fontSize: 12, color: '#6c757d', fontFamily: 'monospace', marginTop: 4 },
    otpEmpty: {
      textAlign: 'center',
      padding: '30px 20px',
      color: '#6c757d',
    },
    createOtpSection: {
      background: '#f8f9fa',
      padding: '16px',
      borderRadius: 8,
      border: '1px solid #e9ecef',
      marginBottom: 20,
    },
    otpDetailCard: {
      background: 'white',
      padding: '16px',
      borderRadius: 8,
      border: '1px solid #e9ecef',
    },
    otpLabel: {
      fontSize: 12,
      color: '#6c757d',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  }

  /* ─── Notification item renderer ───────────────────────────── */
  const NotificationItem = ({ n }) => {
    const sev = getSeverity(n.severity)
    const isExpanded = expandedId === n._id
    return (
      <div
        style={s.notifItem(n.isRead)}
        onClick={() => handleNotificationItemClick(n)}
        onMouseEnter={(e) => {
          if (n.isRead) e.currentTarget.style.background = '#f8f9fa'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = n.isRead ? '#fff' : 'rgba(13,110,253,0.04)'
        }}
      >
        <div style={s.notifIcon(n.severity)}>
          <CIcon icon={sev.icon} size="sm" style={{ color: sev.text }} />
        </div>
        <div style={s.notifBody}>
          <div style={s.notifTitle}>
            {n.title}
            {!n.isRead && <span style={s.unreadDot} />}
          </div>
          <p style={isExpanded ? s.notifMsgExpanded : s.notifMsg}>{n.message}</p>

          <div style={s.notifMeta}>
            {n.bookingNumber && (
              <span style={s.notifChip}>
                <CIcon icon={cilCalendar} size="sm" /> {n.bookingNumber}
              </span>
            )}
            {n.customerName && (
              <span style={s.notifChip}>
                <CIcon icon={cilUser} size="sm" /> {n.customerName}
              </span>
            )}
            <span style={{ marginLeft: 'auto' }}>{timeAgo(n.createdAt)}</span>
          </div>

          {isExpanded && (
            <div style={s.notifDetail}>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Type</span>
                <span style={s.detailValue}>{n.type}</span>
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Category</span>
                <span style={s.detailValue}>{n.category}</span>
              </div>
              {n.modelName && (
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Model</span>
                  <span style={s.detailValue}>{n.modelName}</span>
                </div>
              )}
              {n.meta?.chassisNumber && (
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Chassis</span>
                  <span style={s.detailValue}>{n.meta.chassisNumber}</span>
                </div>
              )}
              {n.meta?.status && (
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Status</span>
                  <span style={s.detailValue}>{n.meta.status}</span>
                </div>
              )}
              {n.eventAt && (
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Event At</span>
                  <span style={s.detailValue}>{formatFullDate(n.eventAt)}</span>
                </div>
              )}
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Created</span>
                <span style={s.detailValue}>{formatFullDate(n.createdAt)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

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
            {/* Today's OTP Button */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: 6,
                border: '1px solid #dee2e6',
                background: '#f8f9fa',
                marginRight: 12,
                transition: 'all 0.2s',
                gap: 6,
              }}
              onClick={handleOtpClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e9ecef'
                e.currentTarget.style.borderColor = '#ced4da'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f9fa'
                e.currentTarget.style.borderColor = '#dee2e6'
              }}
            >
              <CIcon icon={cilLockLocked} size="sm" style={{ color: '#0d6efd' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#212529' }}>Today's OTP</span>
            </div>

            {/* Live Insurance Button */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: 6,
                border: '1px solid #dee2e6',
                background: '#f8f9fa',
                marginRight: 12,
                transition: 'all 0.2s',
                gap: 6,
              }}
              onClick={() => setInsuranceModal(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e9ecef'
                e.currentTarget.style.borderColor = '#ced4da'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f9fa'
                e.currentTarget.style.borderColor = '#dee2e6'
              }}
            >
              <CIcon icon={cilShieldAlt} size="sm" style={{ color: '#0d6efd' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#212529' }}>Live Insurance</span>
            </div>

            {/* Notification Bell */}
            <div
              className="position-relative d-flex align-items-center justify-content-center"
              style={{
                cursor: 'pointer',
                width: 36,
                height: 36,
                marginRight: 12,
                display: canSeeNotifications ? 'flex' : 'none',
              }}
              onClick={handleNotificationClick}
            >
              <CIcon icon={cilBell} size="xl" className="d-block" />
              {unreadCount > 0 && (
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
                  {unreadCount > 99 ? '99+' : unreadCount}
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
        size="xl"
        scrollable
        alignment="center"
      >
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
                  {unreadCount > 0 && (
                    <CBadge color="danger" shape="rounded-pill" className="ms-2" style={{ fontSize: 11 }}>
                      {unreadCount > 99 ? '99+' : unreadCount} unread
                    </CBadge>
                  )}
                </CModalTitle>
                <p style={s.headerSub}>Browse by category</p>
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

        {/* ── Tabs bar ───────────────────────────────────────── */}
        <div style={s.tabsBar}>
          {NOTIFICATION_TABS.map((tab) => (
            <button
              key={tab.key}
              style={s.tab(activeTab === tab.key)}
              onClick={() => handleTabChange(tab.key)}
            >
              <CIcon icon={tab.icon} size="sm" />
              {tab.label}
            </button>
          ))}
        </div>

        <CModalBody style={{ padding: 0, minHeight: 400 }}>
          {activeCache.loading && activeCache.items.length === 0 && (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3 mb-0 text-muted" style={{ fontSize: 13 }}>
                Loading notifications...
              </p>
            </div>
          )}

          {activeCache.error && activeCache.items.length === 0 && (
            <div style={{ padding: '16px 20px' }}>
              <CAlert color="danger" className="mb-0" style={{ fontSize: 13 }}>
                {activeCache.error}
              </CAlert>
            </div>
          )}

          {!activeCache.loading && !activeCache.error && activeCache.items.length === 0 && (
            <div style={s.emptyState}>
              <CIcon icon={cilEnvelopeOpen} size="xl" style={{ color: '#dee2e6', marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>No notifications</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6c757d' }}>
                Nothing in this category yet
              </p>
            </div>
          )}

          {activeCache.items.length > 0 && (
            <div style={s.notifList}>
              {activeCache.items.map((n, idx) => (
                <div key={n._id}>
                  {idx > 0 && <div style={s.sectionDivider} />}
                  <NotificationItem n={n} />
                </div>
              ))}
              {activeCache.hasMore && (
                <button
                  style={s.loadMoreBtn}
                  onClick={handleLoadMore}
                  disabled={activeCache.loading}
                >
                  {activeCache.loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilReload} size="sm" className="me-1" />
                      Load more
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </CModalBody>

        <CModalFooter style={{ ...s.footer, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <button style={s.btnClose} onClick={() => setNotificationModal(false)}>
            Close
          </button>
          <div className="d-flex gap-2">
            {unreadCount > 0 && (
              <button style={s.btnMarkAll} onClick={handleMarkAllRead} disabled={markingAll}>
                {markingAll ? (
                  <>
                    <CSpinner size="sm" className="me-1" />
                    Marking...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilCheck} size="sm" />
                    Mark all as read
                  </>
                )}
              </button>
            )}
            <button style={s.btnRefresh} onClick={handleRefresh}>
              <CIcon icon={cilReload} size="sm" />
              Refresh
            </button>
          </div>
        </CModalFooter>
      </CModal>

      {/* ── OTP Modal ─────────────────────────────────── */}
      <CModal
        visible={otpModal}
        onClose={() => setOtpModal(false)}
        size="md"
        scrollable
        alignment="center"
      >
        <CModalHeader
          style={{ borderBottom: '1px solid #e9ecef', paddingBottom: 12 }}
          closeButton={false}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center gap-2">
              <div style={s.iconCircle}>
                <CIcon icon={cilLockLocked} size="sm" style={{ color: '#0d6efd' }} />
              </div>
              <div>
                <CModalTitle style={{ fontSize: 15, fontWeight: 600, marginBottom: 0 }}>
                  Today's OTP
                </CModalTitle>
                <p style={s.headerSub}>Manage OTP codes</p>
              </div>
            </div>
            <button
              onClick={() => setOtpModal(false)}
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

        <CModalBody>
          <div style={s.otpContainer}>
            {/* Create OTP Section */}
            <div style={s.createOtpSection}>
              <CForm onSubmit={(e) => { e.preventDefault(); createOtp(); }}>
                <div className="d-flex align-items-center gap-2">
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilPlus} size="sm" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Enter OTP code (e.g., 123456)"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      disabled={isCreatingOtp}
                      style={{ fontSize: 14 }}
                    />
                  </CInputGroup>
                  <CButton
                    color="primary"
                    onClick={createOtp}
                    disabled={isCreatingOtp || !otpCode.trim()}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isCreatingOtp ? (
                      <>
                        <CSpinner size="sm" className="me-1" />
                        Creating...
                      </>
                    ) : (
                      'Create OTP'
                    )}
                  </CButton>
                </div>
                {otpError && (
                  <CAlert color="danger" className="mt-2 mb-0" style={{ fontSize: 13 }}>
                    {otpError}
                  </CAlert>
                )}
                {otpSuccess && (
                  <CAlert color="success" className="mt-2 mb-0" style={{ fontSize: 13 }}>
                    {otpSuccess}
                  </CAlert>
                )}
              </CForm>
            </div>

            {/* OTP Display */}
            {otpLoading ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
                <p className="mt-2 mb-0 text-muted" style={{ fontSize: 13 }}>
                  Loading OTP...
                </p>
              </div>
            ) : otpData?.otp ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ fontSize: 13, color: '#6c757d' }}>
                    Current OTP
                  </span>
                </div>
                <div style={s.otpItem}>
                  <div>
                    <div style={s.otpLabel}>OTP Code</div>
                    <div style={s.otpCode}>{otpData.otp.code}</div>
                  </div>
                  <CBadge color="success" style={{ fontSize: 12, padding: '6px 14px' }}>
                    Active
                  </CBadge>
                </div>
              </div>
            ) : (
              <div style={s.otpEmpty}>
                <CIcon icon={cilList} size="xl" style={{ color: '#dee2e6', marginBottom: 12 }} />
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>No OTP found</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6c757d' }}>
                  Create an OTP code using the form above
                </p>
              </div>
            )}
          </div>
        </CModalBody>

        <CModalFooter
          style={{ ...s.footer, display: 'flex', justifyContent: 'flex-end', gap: 8 }}
        >
          <button style={s.btnClose} onClick={() => setOtpModal(false)}>
            Close
          </button>
        </CModalFooter>
      </CModal>

      {/* ── Insurance Live Modal ─────────────────────────────────── */}
      <InsuranceLive
        visible={insuranceModal}
        onClose={() => setInsuranceModal(false)}
      />
    </>
  )
}

export default AppHeader