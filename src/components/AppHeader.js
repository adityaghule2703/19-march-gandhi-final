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
  CFormInput,
  CForm,
  CInputGroup,
  CInputGroupText,
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
  cilLockLocked,
  cilPlus,
  cilReload,
  cilList,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

import InsuranceLive from '../views/insurance/insurance-live/InsuranceLive'
import axiosInstance from '../axiosInstance'


const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [notificationModal, setNotificationModal] = useState(false)
  const [notificationData, setNotificationData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Insurance Live states
  const [insuranceModal, setInsuranceModal] = useState(false)

  // OTP states
  const [otpModal, setOtpModal] = useState(false)
  const [otpData, setOtpData] = useState(null)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState(null)
  const [otpCode, setOtpCode] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(null)
  const [isCreatingOtp, setIsCreatingOtp] = useState(false)

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

  // OTP handlers
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
    warningStrip: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      background: 'rgba(255,193,7,0.12)',
      padding: '12px 16px',
      margin: '12px 20px',
      borderRadius: 8,
      borderLeft: '3px solid #ffc107',
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
      margin: '0 20px 18px',
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
              style={{ cursor: 'pointer', width: 36, height: 36, marginRight: 12 }}
              onClick={handleNotificationClick}
            >
              <CIcon icon={cilBell} size="xl" className="d-block" />
              {notificationData && (
                (() => {
                  const total = (notificationData.awaitingApproval?.count || 0) + 
                               (notificationData.kycNotUpdated?.count || 0) + 
                               (notificationData.insuranceNotUpdated?.count || 0)
                  return total > 0 && (
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
                      {total}
                    </CBadge>
                  )
                })()
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

        <CModalBody style={{ padding: 0 }}>
          {loading && (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-3 mb-0 text-muted" style={{ fontSize: 13 }}>
                Loading notifications...
              </p>
            </div>
          )}

          {error && (
            <div style={{ padding: '16px 20px' }}>
              <CAlert color="danger" className="mb-0" style={{ fontSize: 13 }}>
                {error}
              </CAlert>
            </div>
          )}

          {notificationData && !loading && (
            <>
              {notificationData.warnings && notificationData.warnings.length > 0 && (
                <div style={s.warningStrip}>
                  <CIcon icon={cilWarning} size="sm" style={{ color: '#856404', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    {notificationData.warnings.map((w, i) => (
                      <p key={i} style={s.warnText}>{w}</p>
                    ))}
                  </div>
                </div>
              )}

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

              {notificationData.bothIssues && (
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
              )}
            </>
          )}
        </CModalBody>

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