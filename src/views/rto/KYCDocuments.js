// // // import React, { useState } from 'react';
// // // import {
// // //   CModal,
// // //   CModalHeader,
// // //   CModalTitle,
// // //   CModalBody,
// // //   CModalFooter,
// // //   CCard,
// // //   CCardBody,
// // //   CCardHeader,
// // //   CRow,
// // //   CCol,
// // //   CButton,
// // //   CSpinner,
// // //   CBadge
// // // } from '@coreui/react';
// // // import PropTypes from 'prop-types';
// // // import config from '../../config';
// // // import { showError, showSuccess } from '../../utils/sweetAlerts';
// // // import axiosInstance from '../../axiosInstance';
// // // import '../../css/kycView.css';
// // // import '../../css/bookingView.css';
// // // import CIcon from '@coreui/icons-react';
// // // import { cilCloudDownload, cilCloudUpload } from '@coreui/icons';
// // // import { Link } from 'react-router-dom';

// // // const KYCDocuments = ({ open, onClose, kycData, refreshData, rtoId }) => {
// // //   const [actionLoading, setActionLoading] = useState(false);
// // //   const documents = kycData?.kycDocuments || kycData;
// // //   const customerInfo = kycData?.bookingDetails || kycData;

// // //   const confirmRtoSubmission = async () => {
// // //     if (!rtoId) {
// // //       showError('No RTO process ID found');
// // //       return;
// // //     }

// // //     try {
// // //       setActionLoading(true);
// // //       await axiosInstance.patch(`/rtoProcess/${rtoId}`, {
// // //         rtoPaperStatus: 'Submitted'
// // //       });

// // //       showSuccess('RTO papers submitted successfully!');
// // //       refreshData();
// // //       onClose();
// // //     } catch (error) {
// // //       console.log(error);
// // //       showError(error.response?.data?.message || 'Failed to submit RTO papers');
// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   };

// // //   const getDocumentUrl = (document) => {
// // //     if (!document) return null;
// // //     if (typeof document === 'string') return `${config.baseURL}${document}`;
// // //     if (document.original) return `${config.baseURL}${document.original}`;
// // //     return null;
// // //   };

// // //   const getDownloadUrl = (document) => {
// // //     if (!document) return null;
// // //     if (typeof document === 'string') return `${config.baseURL}${document}`;
// // //     if (document.pdf) return `${config.baseURL}${document.pdf}`;
// // //     if (document.original) return `${config.baseURL}${document.original}`;
// // //     return null;
// // //   };

// // //   const DocumentCard = ({ title, document }) => {
// // //     const docUrl = getDocumentUrl(document);
// // //     const downloadUrl = getDownloadUrl(document);

// // //     return (
// // //       <CCard className="document-card">
// // //         <CCardHeader className="d-flex justify-content-between align-items-center">
// // //           <span>{title}</span>
// // //           {downloadUrl && (
// // //             <a href={downloadUrl} download className="btn btn-sm btn-primary">
// // //               <CIcon icon={cilCloudDownload} /> Download
// // //             </a>
// // //           )}
// // //         </CCardHeader>
// // //         <CCardBody>
// // //           {docUrl ? (
// // //             <img src={docUrl} alt={title} className="document-image" />
// // //           ) : (
// // //             <div className="text-muted text-center py-4">No document uploaded</div>
// // //           )}
// // //         </CCardBody>
// // //       </CCard>
// // //     );
// // //   };

// // //   if (!kycData) {
// // //     return (
// // //       <CModal visible={open} onClose={onClose} size="xl">
// // //         <CModalHeader>
// // //           <CModalTitle>Loading KYC Details...</CModalTitle>
// // //         </CModalHeader>
// // //         <CModalBody>
// // //           <div className="text-center py-4">
// // //             <CSpinner color="primary" />
// // //           </div>
// // //         </CModalBody>
// // //         <CModalFooter>
// // //           <CButton color="secondary" onClick={onClose}>
// // //             Close
// // //           </CButton>
// // //         </CModalFooter>
// // //       </CModal>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       {open && <div className="modal-overlay" onClick={onClose} />}
// // //       <CModal visible={open} onClose={onClose} size="xl" fullscreen="lg">
// // //         <CModalHeader>
// // //           <CModalTitle>Booking Number - {customerInfo?.bookingNumber || 'N/A'}</CModalTitle>
// // //         </CModalHeader>
// // //         <CModalBody>
// // //           <div className="kyc-documents-container">
// // //             <CRow className="mb-4 d-flex">
// // //               <CCol>
// // //                 <div className="customer-info-card">
// // //                   <p>
// // //                     <strong>Name:</strong> {customerInfo?.customerName || 'N/A'}
// // //                   </p>
// // //                   <p>
// // //                     <strong>Chassis Number:</strong> {customerInfo?.chassisNumber || 'N/A'}
// // //                   </p>
// // //                   <p>
// // //                     <strong>Model:</strong> {customerInfo?.model?.model_name || 'N/A'}
// // //                   </p>
// // //                 </div>
// // //               </CCol>
// // //             </CRow>

// // //             <CRow>
// // //               <CCol md={6} className="mb-4">
// // //                 <DocumentCard title="Aadhar Front" document={documents.aadharFront} />
// // //               </CCol>
// // //               <CCol md={6} className="mb-4">
// // //                 <DocumentCard title="Aadhar Back" document={documents.aadharBack} />
// // //               </CCol>
// // //             </CRow>

// // //             <CRow>
// // //               <CCol md={6} className="mb-4">
// // //                 <DocumentCard title="PAN Card" document={documents.panCard} />
// // //               </CCol>
// // //               <CCol md={6} className="mb-4">
// // //                 <DocumentCard title="Vehicle Photo" document={documents.vPhoto} />
// // //               </CCol>
// // //             </CRow>

// // //             <CRow>
// // //               <CCol md={6} className="mb-4">
// // //                 <DocumentCard title="Chassis Number Photo" document={documents.chasisNoPhoto} />
// // //               </CCol>
// // //               <CCol md={6} className="mb-4">
// // //                 <DocumentCard title="Address Proof 1" document={documents.addressProof1} />
// // //               </CCol>
// // //             </CRow>

// // //             {(documents.addressProof2 || documents.documentPdf) && (
// // //               <CRow>
// // //                 {documents.addressProof2 && (
// // //                   <CCol md={6} className="mb-4">
// // //                     <DocumentCard title="Address Proof 2" document={documents.addressProof2} />
// // //                   </CCol>
// // //                 )}
// // //                 {documents.documentPdf && (
// // //                   <CCol md={6} className="mb-4">
// // //                     <CCard className="document-card">
// // //                       <CCardHeader>Combined KYC PDF</CCardHeader>
// // //                       <CCardBody>
// // //                         <a
// // //                           href={`${config.baseURL}${documents.documentPdf}`}
// // //                           target="_blank"
// // //                           rel="noopener noreferrer"
// // //                           className="btn btn-primary"
// // //                         >
// // //                           <CIcon icon={cilCloudDownload} className="me-2" />
// // //                           View PDF
// // //                         </a>
// // //                       </CCardBody>
// // //                     </CCard>
// // //                   </CCol>
// // //                 )}
// // //               </CRow>
// // //             )}
// // //           </div>
// // //         </CModalBody>
// // //         <CModalFooter>
// // //           <div className="d-flex justify-content-between w-100 align-items-center">
// // //             <div>
// // //               {kycData.status === 'PENDING' && (
// // //                 <CButton color="primary" onClick={confirmRtoSubmission} disabled={actionLoading}>
// // //                   {actionLoading ? <CSpinner size="sm" /> : 'Verify KYC'}
// // //                 </CButton>
// // //               )}
// // //               {(kycData.status === 'REJECTED' || kycData.status === 'NOT_UPLOADED') && (
// // //                 <>
// // //                   <CBadge color="danger" className="me-2">
// // //                     KYC {kycData.status}
// // //                   </CBadge>
// // //                   <Link
// // //                     to={`/upload-kyc/${rtoId || kycData._id}`}
// // //                     state={{
// // //                       bookingId: rtoId || kycData._id,
// // //                       customerName: customerInfo?.customerName,
// // //                       chassisNumber: customerInfo?.chassisNumber
// // //                     }}
// // //                   >
// // //                     <CButton color="primary">
// // //                       <CIcon icon={cilCloudUpload} className="me-2" />
// // //                       Upload KYC
// // //                     </CButton>
// // //                   </Link>
// // //                 </>
// // //               )}
// // //               {kycData.status === 'APPROVED' && <CBadge color="success">KYC APPROVED</CBadge>}
// // //             </div>
// // //             <CButton color="secondary" onClick={onClose}>
// // //               Close
// // //             </CButton>
// // //           </div>
// // //         </CModalFooter>
// // //       </CModal>
// // //     </>
// // //   );
// // // };

// // // KYCDocuments.propTypes = {
// // //   open: PropTypes.bool.isRequired,
// // //   onClose: PropTypes.func.isRequired,
// // //   refreshData: PropTypes.func.isRequired,
// // //   rtoId: PropTypes.string,
// // //   kycData: PropTypes.shape({
// // //     _id: PropTypes.string,
// // //     kycDocuments: PropTypes.shape({
// // //       aadharFront: PropTypes.oneOfType([
// // //         PropTypes.string,
// // //         PropTypes.shape({
// // //           original: PropTypes.string,
// // //           pdf: PropTypes.string,
// // //           mimetype: PropTypes.string,
// // //           originalname: PropTypes.string
// // //         })
// // //       ]),
// // //       aadharBack: PropTypes.oneOfType([
// // //         PropTypes.string,
// // //         PropTypes.shape({
// // //           original: PropTypes.string,
// // //           pdf: PropTypes.string,
// // //           mimetype: PropTypes.string,
// // //           originalname: PropTypes.string
// // //         })
// // //       ]),
// // //       panCard: PropTypes.oneOfType([
// // //         PropTypes.string,
// // //         PropTypes.shape({
// // //           original: PropTypes.string,
// // //           pdf: PropTypes.string,
// // //           mimetype: PropTypes.string,
// // //           originalname: PropTypes.string
// // //         })
// // //       ]),
// // //       vPhoto: PropTypes.oneOfType([
// // //         PropTypes.string,
// // //         PropTypes.shape({
// // //           original: PropTypes.string,
// // //           pdf: PropTypes.string,
// // //           mimetype: PropTypes.string,
// // //           originalname: PropTypes.string
// // //         })
// // //       ]),
// // //       chasisNoPhoto: PropTypes.oneOfType([
// // //         PropTypes.string,
// // //         PropTypes.shape({
// // //           original: PropTypes.string,
// // //           pdf: PropTypes.string,
// // //           mimetype: PropTypes.string,
// // //           originalname: PropTypes.string
// // //         })
// // //       ]),
// // //       addressProof1: PropTypes.oneOfType([
// // //         PropTypes.string,
// // //         PropTypes.shape({
// // //           original: PropTypes.string,
// // //           pdf: PropTypes.string,
// // //           mimetype: PropTypes.string,
// // //           originalname: PropTypes.string
// // //         })
// // //       ]),
// // //       addressProof2: PropTypes.oneOfType([
// // //         PropTypes.string,
// // //         PropTypes.shape({
// // //           original: PropTypes.string,
// // //           pdf: PropTypes.string,
// // //           mimetype: PropTypes.string,
// // //           originalname: PropTypes.string
// // //         })
// // //       ]),
// // //       documentPdf: PropTypes.string
// // //     }),
// // //     bookingDetails: PropTypes.shape({
// // //       bookingId: PropTypes.string,
// // //       bookingNumber: PropTypes.string,
// // //       customerName: PropTypes.string,
// // //       chassisNumber: PropTypes.string,
// // //       model: PropTypes.shape({
// // //         model_name: PropTypes.string
// // //       })
// // //     }),
// // //     status: PropTypes.oneOf(['PENDING', 'APPROVED', 'REJECTED', 'NOT_UPLOADED']),
// // //     customerName: PropTypes.string,
// // //     bookingNumber: PropTypes.string,
// // //     chassisNumber: PropTypes.string
// // //   })
// // // };

// // // KYCDocuments.defaultProps = {
// // //   rtoId: null
// // // };

// // // export default KYCDocuments;





// // import React, { useState } from 'react';
// // import {
// //   CModal,
// //   CModalHeader,
// //   CModalTitle,
// //   CModalBody,
// //   CModalFooter,
// //   CCard,
// //   CCardBody,
// //   CCardHeader,
// //   CRow,
// //   CCol,
// //   CBadge,
// //   CButton,
// //   CFormInput,
// //   CFormLabel,
// //   CSpinner
// // } from '@coreui/react';
// // import PropTypes from 'prop-types';
// // import config from '../../config';
// // import { showError, showSuccess } from '../../utils/sweetAlerts';
// // import axiosInstance from '../../axiosInstance';
// // import '../../css/kycView.css';
// // import '../../css/bookingView.css';
// // import { Link } from 'react-router-dom';
// // import CIcon from '@coreui/icons-react';
// // import { cilCloudUpload, cilCheckCircle, cilXCircle, cilZoom, cilCloudDownload } from '@coreui/icons';

// // const KYCDocuments = ({ open, onClose, kycData, refreshData, rtoId }) => {
// //   const [actionLoading, setActionLoading] = useState(false);
// //   const [showStatusModal, setShowStatusModal] = useState(false);
// //   const [currentAction, setCurrentAction] = useState(null);
// //   const [verificationNote, setVerificationNote] = useState('');
// //   const [activeDocument, setActiveDocument] = useState(null);
// //   const [documentViewerOpen, setDocumentViewerOpen] = useState(false);

// //   const documents = kycData?.kycDocuments || kycData;
// //   const customerInfo = kycData?.bookingDetails || kycData;
// //   const status = kycData?.status || 'PENDING';

// //   const handleStatusButtonClick = (action) => {
// //     setCurrentAction(action);
// //     setShowStatusModal(true);
// //   };

// //   const handleRtoSubmission = async () => {
// //     try {
// //       setActionLoading(true);
// //       console.log('Submitting RTO papers for RTO ID:', rtoId);
      
// //       if (!rtoId) {
// //         showError('RTO process ID is missing');
// //         return;
// //       }

// //       if (!verificationNote.trim()) {
// //         alert('Verification note is required');
// //         return;
// //       }

// //       await axiosInstance.patch(`/rtoProcess/${rtoId}`, {
// //         rtoPaperStatus: currentAction === 'APPROVED' ? 'Submitted' : 'Rejected',
// //         verificationNote: verificationNote
// //       });

// //       showSuccess(`RTO papers ${currentAction === 'APPROVED' ? 'submitted' : 'rejected'} successfully!`);
// //       refreshData();
// //       setShowStatusModal(false);
// //       setVerificationNote('');
// //       onClose();
// //     } catch (error) {
// //       console.log(error);
// //       showError(error.response?.data?.message || `Failed to update RTO status`);
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const openDocumentViewer = (document, title) => {
// //     if (!document) return;

// //     let url;
// //     if (typeof document === 'string') {
// //       url = `${config.baseURL}${document}`;
// //     } else if (document?.original) {
// //       url = `${config.baseURL}${document.original}`;
// //     } else if (document?.pdf) {
// //       url = `${config.baseURL}${document.pdf}`;
// //     } else {
// //       return;
// //     }

// //     setActiveDocument({
// //       url: url,
// //       title: title,
// //       type: 'image' // Default to image, PDF detection can be added if needed
// //     });
// //     setDocumentViewerOpen(true);
// //   };

// //   const getDocumentUrl = (document) => {
// //     if (!document) return null;
// //     if (typeof document === 'string') return `${config.baseURL}${document}`;
// //     if (document.original) return `${config.baseURL}${document.original}`;
// //     if (document.pdf) return `${config.baseURL}${document.pdf}`;
// //     return null;
// //   };

// //   const getThumbnailUrl = (document) => {
// //     if (!document) return null;
// //     if (typeof document === 'string') return `${config.baseURL}${document}`;
// //     if (document.thumbnail) return `${config.baseURL}${document.thumbnail}`;
// //     if (document.original) return `${config.baseURL}${document.original}`;
// //     if (document.pdf) return `${config.baseURL}${document.pdf}`;
// //     return null;
// //   };

// //   const renderDocument = (document, altText) => {
// //     const docUrl = getDocumentUrl(document);
// //     const thumbnailUrl = getThumbnailUrl(document);

// //     if (!docUrl) {
// //       return (
// //         <div className="document-placeholder">
// //           <CIcon icon={cilXCircle} size="xl" />
// //           <p>No document uploaded</p>
// //         </div>
// //       );
// //     }

// //     const isPdf = docUrl?.toLowerCase().includes('.pdf') || document?.mimetype === 'application/pdf';

// //     return (
// //       <div className="document-preview-container">
// //         <div className="document-thumbnail" onClick={() => openDocumentViewer(document, altText)}>
// //           {isPdf ? (
// //             <div className="pdf-thumbnail">
// //               <div className="pdf-icon">
// //                 <span>PDF</span>
// //               </div>
// //               <p>{document?.originalname || 'Document'}</p>
// //             </div>
// //           ) : (
// //             <img src={thumbnailUrl} alt={altText} className="thumbnail-image" />
// //           )}
// //           <div className="document-overlay">
// //             <CIcon icon={cilZoom} />
// //             <span>View</span>
// //           </div>
// //         </div>

// //         <div className="document-actions">
// //           <a href={docUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
// //             Open Full {isPdf ? 'PDF' : 'Image'}
// //           </a>
// //           <a href={docUrl} download className="btn btn-outline-success btn-sm ms-2">
// //             <CIcon icon={cilCloudDownload} /> Download
// //           </a>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const statusColors = {
// //     PENDING: 'warning',
// //     APPROVED: 'success',
// //     REJECTED: 'danger',
// //     NOT_UPLOADED: 'secondary'
// //   };

// //   if (!kycData) {
// //     return (
// //       <CModal visible={open} onClose={onClose} size="xl" className="kyc-modal">
// //         <CModalHeader closeButton>
// //           <CModalTitle>Loading KYC Details...</CModalTitle>
// //         </CModalHeader>
// //         <CModalBody>
// //           <div className="text-center py-4">
// //             <CSpinner color="primary" />
// //             <p className="mt-2">Loading KYC information...</p>
// //           </div>
// //         </CModalBody>
// //         <CModalFooter>
// //           <CButton color="secondary" onClick={onClose}>
// //             Close
// //           </CButton>
// //         </CModalFooter>
// //       </CModal>
// //     );
// //   }

// //   return (
// //     <>
// //       <CModal visible={open} onClose={onClose} size="xl" className="kyc-modal" backdrop="static">
// //         <CModalHeader closeButton>
// //           <CModalTitle>
// //             KYC Documents - Booking #{customerInfo?.bookingNumber || 'N/A'}
// //             <CBadge color={statusColors[status]} className="ms-2 status-badge">
// //               {status.replace('_', ' ')}
// //             </CBadge>
// //           </CModalTitle>
// //         </CModalHeader>
// //         <CModalBody className="kyc-modal-body">
// //           <div className="kyc-info-bar">
// //             <div className="kyc-info-item">
// //               <strong>Booking Number:</strong> {customerInfo?.bookingNumber || 'N/A'}
// //             </div>
// //             <div className="kyc-info-item">
// //               <strong>Customer:</strong> {customerInfo?.customerName || 'N/A'}
// //             </div>
// //             <div className="kyc-info-item">
// //               <strong>Chassis Number:</strong> {customerInfo?.chassisNumber || 'N/A'}
// //             </div>
// //             <div className="kyc-info-item">
// //               <strong>Model:</strong> {customerInfo?.model?.model_name || 'N/A'}
// //             </div>
// //           </div>

// //           <div className="kyc-documents-container">
// //             <CRow>
// //               <CCol lg={6} className="mb-4">
// //                 <CCard className="document-card">
// //                   <CCardHeader className="document-card-header">
// //                     <CIcon icon={cilCheckCircle} className="me-2" />
// //                     Aadhar Front
// //                   </CCardHeader>
// //                   <CCardBody>{renderDocument(documents.aadharFront, 'Aadhar Front')}</CCardBody>
// //                 </CCard>
// //               </CCol>
// //               <CCol lg={6} className="mb-4">
// //                 <CCard className="document-card">
// //                   <CCardHeader className="document-card-header">
// //                     <CIcon icon={cilCheckCircle} className="me-2" />
// //                     Aadhar Back
// //                   </CCardHeader>
// //                   <CCardBody>{renderDocument(documents.aadharBack, 'Aadhar Back')}</CCardBody>
// //                 </CCard>
// //               </CCol>
// //             </CRow>

// //             <CRow>
// //               <CCol lg={6} className="mb-4">
// //                 <CCard className="document-card">
// //                   <CCardHeader className="document-card-header">
// //                     <CIcon icon={cilCheckCircle} className="me-2" />
// //                     PAN Card
// //                   </CCardHeader>
// //                   <CCardBody>{renderDocument(documents.panCard, 'PAN Card')}</CCardBody>
// //                 </CCard>
// //               </CCol>
// //               <CCol lg={6} className="mb-4">
// //                 <CCard className="document-card">
// //                   <CCardHeader className="document-card-header">
// //                     <CIcon icon={cilCheckCircle} className="me-2" />
// //                     Vehicle Photo
// //                   </CCardHeader>
// //                   <CCardBody>{renderDocument(documents.vPhoto, 'Vehicle Photo')}</CCardBody>
// //                 </CCard>
// //               </CCol>
// //             </CRow>

// //             <CRow>
// //               <CCol lg={6} className="mb-4">
// //                 <CCard className="document-card">
// //                   <CCardHeader className="document-card-header">
// //                     <CIcon icon={cilCheckCircle} className="me-2" />
// //                     Chassis Number Photo
// //                   </CCardHeader>
// //                   <CCardBody>{renderDocument(documents.chasisNoPhoto, 'Chassis Number')}</CCardBody>
// //                 </CCard>
// //               </CCol>
// //               <CCol lg={6} className="mb-4">
// //                 <CCard className="document-card">
// //                   <CCardHeader className="document-card-header">
// //                     <CIcon icon={cilCheckCircle} className="me-2" />
// //                     Address Proof 1
// //                   </CCardHeader>
// //                   <CCardBody>{renderDocument(documents.addressProof1, 'Address Proof 1')}</CCardBody>
// //                 </CCard>
// //               </CCol>
// //             </CRow>

// //             {(documents.addressProof2 || documents.documentPdf) && (
// //               <CRow>
// //                 {documents.addressProof2 && (
// //                   <CCol lg={6} className="mb-4">
// //                     <CCard className="document-card">
// //                       <CCardHeader className="document-card-header">
// //                         <CIcon icon={cilCheckCircle} className="me-2" />
// //                         Address Proof 2
// //                       </CCardHeader>
// //                       <CCardBody>{renderDocument(documents.addressProof2, 'Address Proof 2')}</CCardBody>
// //                     </CCard>
// //                   </CCol>
// //                 )}
// //                 {documents.documentPdf && (
// //                   <CCol lg={6} className="mb-4">
// //                     <CCard className="document-card">
// //                       <CCardHeader className="document-card-header">
// //                         <CIcon icon={cilCheckCircle} className="me-2" />
// //                         Combined KYC PDF
// //                       </CCardHeader>
// //                       <CCardBody>
// //                         <div className="document-preview-container">
// //                           <div className="document-actions">
// //                             <a 
// //                               href={`${config.baseURL}${documents.documentPdf}`} 
// //                               target="_blank" 
// //                               rel="noopener noreferrer" 
// //                               className="btn btn-primary"
// //                             >
// //                               <CIcon icon={cilCloudDownload} className="me-2" />
// //                               View & Download PDF
// //                             </a>
// //                           </div>
// //                         </div>
// //                       </CCardBody>
// //                     </CCard>
// //                   </CCol>
// //                 )}
// //               </CRow>
// //             )}
// //           </div>
// //         </CModalBody>
// //         <CModalFooter>
// //           <div className="d-flex justify-content-between w-100 flex-wrap">
// //             <div className="action-buttons">
// //               {status === 'PENDING' && (
// //                 <>
// //                   <CButton
// //                     color="success"
// //                     onClick={() => handleStatusButtonClick('APPROVED')}
// //                     disabled={actionLoading}
// //                     className="me-2 mb-2"
// //                   >
// //                     {actionLoading ? <CSpinner size="sm" /> : 'Submit RTO Papers'}
// //                   </CButton>
// //                   <CButton 
// //                     color="danger" 
// //                     onClick={() => handleStatusButtonClick('REJECTED')} 
// //                     disabled={actionLoading} 
// //                     className="mb-2"
// //                   >
// //                     {actionLoading ? <CSpinner size="sm" /> : 'Reject RTO Papers'}
// //                   </CButton>
// //                 </>
// //               )}
// //               {(status === 'REJECTED' || status === 'NOT_UPLOADED') && (
// //                 <>
// //                   <CBadge color="danger" className="me-2 mb-2">
// //                     KYC {status}
// //                   </CBadge>
// //                   <Link
// //                     to={`/upload-kyc/${rtoId || kycData._id}`}
// //                     state={{
// //                       bookingId: rtoId || kycData._id,
// //                       customerName: customerInfo?.customerName,
// //                       chassisNumber: customerInfo?.chassisNumber
// //                     }}
// //                   >
// //                     <CButton color="primary" className="upload-kyc-btn mb-2">
// //                       <CIcon icon={cilCloudUpload} className="me-2" />
// //                       Upload KYC Documents
// //                     </CButton>
// //                   </Link>
// //                 </>
// //               )}
// //               {status === 'APPROVED' && (
// //                 <CBadge color="success" className="p-2">
// //                   <CIcon icon={cilCheckCircle} className="me-2" />
// //                   RTO Papers Submitted
// //                 </CBadge>
// //               )}
// //             </div>
// //             <CButton color="secondary" onClick={onClose}>
// //               Close
// //             </CButton>
// //           </div>
// //         </CModalFooter>
// //       </CModal>

// //       {/* Status Update Modal */}
// //       <CModal visible={showStatusModal} onClose={() => !actionLoading && setShowStatusModal(false)} alignment="center">
// //         <CModalHeader closeButton={!actionLoading}>
// //           <CModalTitle>{`${currentAction === 'APPROVED' ? 'Submit' : 'Reject'} RTO Papers`}</CModalTitle>
// //         </CModalHeader>
// //         <CModalBody>
// //           <div className="mb-3">
// //             <CFormLabel htmlFor="verificationNote">
// //               Verification Note <span className="text-danger">*</span>
// //             </CFormLabel>
// //             <CFormInput
// //               id="verificationNote"
// //               type="text"
// //               placeholder={`Enter ${currentAction === 'APPROVED' ? 'submission' : 'rejection'} note`}
// //               value={verificationNote}
// //               onChange={(e) => setVerificationNote(e.target.value)}
// //               required
// //               disabled={actionLoading}
// //             />
// //             <div className="form-text">This note will be recorded with the verification action.</div>
// //           </div>
// //         </CModalBody>
// //         <CModalFooter>
// //           <CButton color="secondary" onClick={() => setShowStatusModal(false)} disabled={actionLoading}>
// //             Cancel
// //           </CButton>
// //           <CButton
// //             color={currentAction === 'APPROVED' ? 'success' : 'danger'}
// //             onClick={handleRtoSubmission}
// //             disabled={actionLoading || !verificationNote.trim()}
// //           >
// //             {actionLoading ? (
// //               <>
// //                 <CSpinner size="sm" className="me-2" />
// //                 Processing...
// //               </>
// //             ) : currentAction === 'APPROVED' ? (
// //               'Submit Papers'
// //             ) : (
// //               'Reject'
// //             )}
// //           </CButton>
// //         </CModalFooter>
// //       </CModal>

// //       {/* Document Viewer Modal */}
// //       <CModal
// //         visible={documentViewerOpen}
// //         onClose={() => setDocumentViewerOpen(false)}
// //         size="xl"
// //         className="document-viewer-modal"
// //         fullscreen
// //       >
// //         <CModalHeader closeButton>
// //           <CModalTitle>{activeDocument?.title}</CModalTitle>
// //         </CModalHeader>
// //         <CModalBody className="document-viewer-body">
// //           {activeDocument?.type === 'pdf' ? (
// //             <iframe src={activeDocument.url} title={activeDocument.title} className="document-iframe" frameBorder="0" />
// //           ) : (
// //             <img src={activeDocument?.url} alt={activeDocument?.title} className="document-full-image" />
// //           )}
// //         </CModalBody>
// //         <CModalFooter>
// //           <a href={activeDocument?.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2">
// //             Open in New Tab
// //           </a>
// //           <CButton color="secondary" onClick={() => setDocumentViewerOpen(false)}>
// //             Close
// //           </CButton>
// //         </CModalFooter>
// //       </CModal>
// //     </>
// //   );
// // };

// // KYCDocuments.propTypes = {
// //   open: PropTypes.bool.isRequired,
// //   onClose: PropTypes.func.isRequired,
// //   refreshData: PropTypes.func.isRequired,
// //   rtoId: PropTypes.string,
// //   kycData: PropTypes.shape({
// //     _id: PropTypes.string,
// //     kycDocuments: PropTypes.shape({
// //       aadharFront: PropTypes.oneOfType([
// //         PropTypes.string,
// //         PropTypes.shape({
// //           original: PropTypes.string,
// //           thumbnail: PropTypes.string,
// //           pdf: PropTypes.string,
// //           mimetype: PropTypes.string,
// //           originalname: PropTypes.string
// //         })
// //       ]),
// //       aadharBack: PropTypes.oneOfType([
// //         PropTypes.string,
// //         PropTypes.shape({
// //           original: PropTypes.string,
// //           thumbnail: PropTypes.string,
// //           pdf: PropTypes.string,
// //           mimetype: PropTypes.string,
// //           originalname: PropTypes.string
// //         })
// //       ]),
// //       panCard: PropTypes.oneOfType([
// //         PropTypes.string,
// //         PropTypes.shape({
// //           original: PropTypes.string,
// //           thumbnail: PropTypes.string,
// //           pdf: PropTypes.string,
// //           mimetype: PropTypes.string,
// //           originalname: PropTypes.string
// //         })
// //       ]),
// //       vPhoto: PropTypes.oneOfType([
// //         PropTypes.string,
// //         PropTypes.shape({
// //           original: PropTypes.string,
// //           thumbnail: PropTypes.string,
// //           pdf: PropTypes.string,
// //           mimetype: PropTypes.string,
// //           originalname: PropTypes.string
// //         })
// //       ]),
// //       chasisNoPhoto: PropTypes.oneOfType([
// //         PropTypes.string,
// //         PropTypes.shape({
// //           original: PropTypes.string,
// //           thumbnail: PropTypes.string,
// //           pdf: PropTypes.string,
// //           mimetype: PropTypes.string,
// //           originalname: PropTypes.string
// //         })
// //       ]),
// //       addressProof1: PropTypes.oneOfType([
// //         PropTypes.string,
// //         PropTypes.shape({
// //           original: PropTypes.string,
// //           thumbnail: PropTypes.string,
// //           pdf: PropTypes.string,
// //           mimetype: PropTypes.string,
// //           originalname: PropTypes.string
// //         })
// //       ]),
// //       addressProof2: PropTypes.oneOfType([
// //         PropTypes.string,
// //         PropTypes.shape({
// //           original: PropTypes.string,
// //           thumbnail: PropTypes.string,
// //           pdf: PropTypes.string,
// //           mimetype: PropTypes.string,
// //           originalname: PropTypes.string
// //         })
// //       ]),
// //       documentPdf: PropTypes.string
// //     }),
// //     bookingDetails: PropTypes.shape({
// //       bookingId: PropTypes.string,
// //       bookingNumber: PropTypes.string,
// //       customerName: PropTypes.string,
// //       chassisNumber: PropTypes.string,
// //       model: PropTypes.shape({
// //         model_name: PropTypes.string
// //       })
// //     }),
// //     status: PropTypes.oneOf(['PENDING', 'APPROVED', 'REJECTED', 'NOT_UPLOADED']),
// //     customerName: PropTypes.string,
// //     bookingNumber: PropTypes.string,
// //     chassisNumber: PropTypes.string
// //   })
// // };

// // KYCDocuments.defaultProps = {
// //   rtoId: null
// // };

// // export default KYCDocuments;







// import React, { useState, useRef } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CRow,
//   CCol,
//   CBadge,
//   CButton,
//   CFormInput,
//   CFormLabel,
//   CSpinner
// } from '@coreui/react';
// import PropTypes from 'prop-types';
// import config from '../../config';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import '../../css/kycView.css';
// import '../../css/bookingView.css';
// import { Link } from 'react-router-dom';
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilCheckCircle, cilXCircle, cilZoom, cilCloudDownload } from '@coreui/icons';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// const KYCDocuments = ({ open, onClose, kycData, refreshData, rtoId }) => {
//   const [actionLoading, setActionLoading] = useState(false);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [currentAction, setCurrentAction] = useState(null);
//   const [verificationNote, setVerificationNote] = useState('');
//   const [activeDocument, setActiveDocument] = useState(null);
//   const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
//   const [downloadingDoc, setDownloadingDoc] = useState(null);
  
//   // Ref to store image elements
//   const imageRefs = useRef({});

//   const documents = kycData?.kycDocuments || kycData;
//   const customerInfo = kycData?.bookingDetails || kycData;
//   const status = kycData?.status || 'PENDING';

//   const handleStatusButtonClick = (action) => {
//     setCurrentAction(action);
//     setShowStatusModal(true);
//   };

//   const handleRtoSubmission = async () => {
//     try {
//       setActionLoading(true);
//       console.log('Submitting RTO papers for RTO ID:', rtoId);
      
//       if (!rtoId) {
//         showError('RTO process ID is missing');
//         return;
//       }

//       if (!verificationNote.trim()) {
//         alert('Verification note is required');
//         return;
//       }

//       await axiosInstance.patch(`/rtoProcess/${rtoId}`, {
//         rtoPaperStatus: currentAction === 'APPROVED' ? 'Submitted' : 'Rejected',
//         verificationNote: verificationNote
//       });

//       showSuccess(`RTO papers ${currentAction === 'APPROVED' ? 'submitted' : 'rejected'} successfully!`);
//       refreshData();
//       setShowStatusModal(false);
//       setVerificationNote('');
//       onClose();
//     } catch (error) {
//       console.log(error);
//       showError(error.response?.data?.message || `Failed to update RTO status`);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const openDocumentViewer = (document, title) => {
//     if (!document) return;

//     let url;
//     if (typeof document === 'string') {
//       url = `${config.baseURL}${document}`;
//     } else if (document?.original) {
//       url = `${config.baseURL}${document.original}`;
//     } else if (document?.pdf) {
//       url = `${config.baseURL}${document.pdf}`;
//     } else {
//       return;
//     }

//     setActiveDocument({
//       url: url,
//       title: title,
//       type: 'image'
//     });
//     setDocumentViewerOpen(true);
//   };

//   // Function to download image as PDF
//  const handleDownloadAsPDF = async (imageId, fileName) => {
//   try {
//     const imgElement = imageRefs.current[imageId];
    
//     if (!imgElement) {
//       showError('Image not found');
//       return;
//     }

//     setDownloadingDoc(fileName);
//     showSuccess('Converting to PDF, please wait...');

//     // Fetch the image as blob to avoid CORS issues
//     const response = await fetch(imgElement.src, {
//       mode: 'cors',
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch image');
//     }
    
//     const blob = await response.blob();
//     const imageUrl = URL.createObjectURL(blob);
    
//     // Create image element to load the blob
//     const img = new Image();
//     img.crossOrigin = 'Anonymous';
    
//     await new Promise((resolve, reject) => {
//       img.onload = resolve;
//       img.onerror = reject;
//       img.src = imageUrl;
//     });
    
//     // Create canvas from the loaded image
//     const canvas = document.createElement('canvas');
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
//     // Convert to PDF
//     const imgData = canvas.toDataURL('image/jpeg', 1.0);
//     const pdf = new jsPDF({
//       orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
//       unit: 'px',
//       format: [canvas.width, canvas.height]
//     });
    
//     pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
//     pdf.save(`${fileName}.pdf`);
    
//     // Clean up
//     URL.revokeObjectURL(imageUrl);
    
//     showSuccess('PDF downloaded successfully!');
//   } catch (error) {
//     console.error('PDF generation error:', error);
//     showError('Failed to generate PDF. Please try again.');
//   } finally {
//     setDownloadingDoc(null);
//   }
// };

//   const getDocumentUrl = (document) => {
//     if (!document) return null;
//     if (typeof document === 'string') return `${config.baseURL}${document}`;
//     if (document.original) return `${config.baseURL}${document.original}`;
//     if (document.pdf) return `${config.baseURL}${document.pdf}`;
//     return null;
//   };

//   const getThumbnailUrl = (document) => {
//     if (!document) return null;
//     if (typeof document === 'string') return `${config.baseURL}${document}`;
//     if (document.thumbnail) return `${config.baseURL}${document.thumbnail}`;
//     if (document.original) return `${config.baseURL}${document.original}`;
//     if (document.pdf) return `${config.baseURL}${document.pdf}`;
//     return null;
//   };

//   const renderDocument = (document, altText) => {
//     const docUrl = getDocumentUrl(document);
//     const thumbnailUrl = getThumbnailUrl(document);
//     const imageId = `${altText.replace(/\s/g, '_')}_${Date.now()}_${Math.random()}`;

//     if (!docUrl) {
//       return (
//         <div className="document-placeholder">
//           <CIcon icon={cilXCircle} size="xl" />
//           <p>No document uploaded</p>
//         </div>
//       );
//     }

//     const isPdf = docUrl?.toLowerCase().includes('.pdf') || document?.mimetype === 'application/pdf';

//     return (
//       <div className="document-preview-container">
//         <div className="document-thumbnail" onClick={() => openDocumentViewer(document, altText)}>
//           {isPdf ? (
//             <div className="pdf-thumbnail">
//               <div className="pdf-icon">
//                 <span>PDF</span>
//               </div>
//               <p>{document?.originalname || 'Document'}</p>
//             </div>
//           ) : (
//             <img 
//               ref={el => {
//                 if (el) imageRefs.current[imageId] = el;
//               }}
//               src={thumbnailUrl} 
//               alt={altText} 
//               className="thumbnail-image" 
//             />
//           )}
//           <div className="document-overlay">
//             <CIcon icon={cilZoom} />
//             <span>View</span>
//           </div>
//         </div>

//         <div className="document-actions">
//           <a href={docUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
//             Open Full {isPdf ? 'PDF' : 'Image'}
//           </a>
//           {!isPdf && (
//             <CButton 
//               size="sm" 
//               color="success" 
//               className="ms-2"
//               onClick={() => handleDownloadAsPDF(imageId, altText.replace(/\s/g, '_'))}
//               disabled={downloadingDoc === altText}
//             >
//               {downloadingDoc === altText ? (
//                 <>
//                   <CSpinner size="sm" className="me-1" />
//                   Converting...
//                 </>
//               ) : (
//                 <>
//                   <CIcon icon={cilCloudDownload} /> PDF Download
//                 </>
//               )}
//             </CButton>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const statusColors = {
//     PENDING: 'warning',
//     APPROVED: 'success',
//     REJECTED: 'danger',
//     NOT_UPLOADED: 'secondary'
//   };

//   if (!kycData) {
//     return (
//       <CModal visible={open} onClose={onClose} size="xl" className="kyc-modal">
//         <CModalHeader closeButton>
//           <CModalTitle>Loading KYC Details...</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="text-center py-4">
//             <CSpinner color="primary" />
//             <p className="mt-2">Loading KYC information...</p>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     );
//   }

//   return (
//     <>
//       <CModal visible={open} onClose={onClose} size="xl" className="kyc-modal" backdrop="static">
//         <CModalHeader closeButton>
//           <CModalTitle>
//             KYC Documents - Booking #{customerInfo?.bookingNumber || 'N/A'}
//             <CBadge color={statusColors[status]} className="ms-2 status-badge">
//               {status.replace('_', ' ')}
//             </CBadge>
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody className="kyc-modal-body">
//           <div className="kyc-info-bar">
//             <div className="kyc-info-item">
//               <strong>Booking Number:</strong> {customerInfo?.bookingNumber || 'N/A'}
//             </div>
//             <div className="kyc-info-item">
//               <strong>Customer:</strong> {customerInfo?.customerName || 'N/A'}
//             </div>
//             <div className="kyc-info-item">
//               <strong>Chassis Number:</strong> {customerInfo?.chassisNumber || 'N/A'}
//             </div>
//             <div className="kyc-info-item">
//               <strong>Model:</strong> {customerInfo?.model?.model_name || 'N/A'}
//             </div>
//           </div>

//           <div className="kyc-documents-container">
//             <CRow>
//               <CCol lg={6} className="mb-4">
//                 <CCard className="document-card">
//                   <CCardHeader className="document-card-header">
//                     <CIcon icon={cilCheckCircle} className="me-2" />
//                     Aadhar Front
//                   </CCardHeader>
//                   <CCardBody>{renderDocument(documents.aadharFront, 'Aadhar_Front')}</CCardBody>
//                 </CCard>
//               </CCol>
//               <CCol lg={6} className="mb-4">
//                 <CCard className="document-card">
//                   <CCardHeader className="document-card-header">
//                     <CIcon icon={cilCheckCircle} className="me-2" />
//                     Aadhar Back
//                   </CCardHeader>
//                   <CCardBody>{renderDocument(documents.aadharBack, 'Aadhar_Back')}</CCardBody>
//                 </CCard>
//               </CCol>
//             </CRow>

//             <CRow>
//               <CCol lg={6} className="mb-4">
//                 <CCard className="document-card">
//                   <CCardHeader className="document-card-header">
//                     <CIcon icon={cilCheckCircle} className="me-2" />
//                     PAN Card
//                   </CCardHeader>
//                   <CCardBody>{renderDocument(documents.panCard, 'PAN_Card')}</CCardBody>
//                 </CCard>
//               </CCol>
//               <CCol lg={6} className="mb-4">
//                 <CCard className="document-card">
//                   <CCardHeader className="document-card-header">
//                     <CIcon icon={cilCheckCircle} className="me-2" />
//                     Vehicle Photo
//                   </CCardHeader>
//                   <CCardBody>{renderDocument(documents.vPhoto, 'Vehicle_Photo')}</CCardBody>
//                 </CCard>
//               </CCol>
//             </CRow>

//             <CRow>
//               <CCol lg={6} className="mb-4">
//                 <CCard className="document-card">
//                   <CCardHeader className="document-card-header">
//                     <CIcon icon={cilCheckCircle} className="me-2" />
//                     Chassis Number Photo
//                   </CCardHeader>
//                   <CCardBody>{renderDocument(documents.chasisNoPhoto, 'Chassis_Number_Photo')}</CCardBody>
//                 </CCard>
//               </CCol>
//               <CCol lg={6} className="mb-4">
//                 <CCard className="document-card">
//                   <CCardHeader className="document-card-header">
//                     <CIcon icon={cilCheckCircle} className="me-2" />
//                     Address Proof 1
//                   </CCardHeader>
//                   <CCardBody>{renderDocument(documents.addressProof1, 'Address_Proof_1')}</CCardBody>
//                 </CCard>
//               </CCol>
//             </CRow>

//             {(documents.addressProof2 || documents.documentPdf) && (
//               <CRow>
//                 {documents.addressProof2 && (
//                   <CCol lg={6} className="mb-4">
//                     <CCard className="document-card">
//                       <CCardHeader className="document-card-header">
//                         <CIcon icon={cilCheckCircle} className="me-2" />
//                         Address Proof 2
//                       </CCardHeader>
//                       <CCardBody>{renderDocument(documents.addressProof2, 'Address_Proof_2')}</CCardBody>
//                     </CCard>
//                   </CCol>
//                 )}
//                 {documents.documentPdf && (
//                   <CCol lg={6} className="mb-4">
//                     <CCard className="document-card">
//                       <CCardHeader className="document-card-header">
//                         <CIcon icon={cilCheckCircle} className="me-2" />
//                         Combined KYC PDF
//                       </CCardHeader>
//                       <CCardBody>
//                         <div className="document-preview-container">
//                           <div className="document-actions">
//                             <a 
//                               href={`${config.baseURL}${documents.documentPdf}`} 
//                               target="_blank" 
//                               rel="noopener noreferrer" 
//                               className="btn btn-primary"
//                             >
//                               <CIcon icon={cilCloudDownload} className="me-2" />
//                               View & Download PDF
//                             </a>
//                           </div>
//                         </div>
//                       </CCardBody>
//                     </CCard>
//                   </CCol>
//                 )}
//               </CRow>
//             )}
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <div className="d-flex justify-content-between w-100 flex-wrap">
//             <div className="action-buttons">
//               {status === 'PENDING' && (
//                 <>
//                   <CButton
//                     color="success"
//                     onClick={() => handleStatusButtonClick('APPROVED')}
//                     disabled={actionLoading}
//                     className="me-2 mb-2"
//                   >
//                     {actionLoading ? <CSpinner size="sm" /> : 'Submit RTO Papers'}
//                   </CButton>
//                   <CButton 
//                     color="danger" 
//                     onClick={() => handleStatusButtonClick('REJECTED')} 
//                     disabled={actionLoading} 
//                     className="mb-2"
//                   >
//                     {actionLoading ? <CSpinner size="sm" /> : 'Reject RTO Papers'}
//                   </CButton>
//                 </>
//               )}
//               {(status === 'REJECTED' || status === 'NOT_UPLOADED') && (
//                 <>
//                   <CBadge color="danger" className="me-2 mb-2">
//                     KYC {status}
//                   </CBadge>
//                   <Link
//                     to={`/upload-kyc/${rtoId || kycData._id}`}
//                     state={{
//                       bookingId: rtoId || kycData._id,
//                       customerName: customerInfo?.customerName,
//                       chassisNumber: customerInfo?.chassisNumber
//                     }}
//                   >
//                     <CButton color="primary" className="upload-kyc-btn mb-2">
//                       <CIcon icon={cilCloudUpload} className="me-2" />
//                       Upload KYC Documents
//                     </CButton>
//                   </Link>
//                 </>
//               )}
//               {status === 'APPROVED' && (
//                 <CBadge color="success" className="p-2">
//                   <CIcon icon={cilCheckCircle} className="me-2" />
//                   RTO Papers Submitted
//                 </CBadge>
//               )}
//             </div>
//             <CButton color="secondary" onClick={onClose}>
//               Close
//             </CButton>
//           </div>
//         </CModalFooter>
//       </CModal>

//       {/* Status Update Modal */}
//       <CModal visible={showStatusModal} onClose={() => !actionLoading && setShowStatusModal(false)} alignment="center">
//         <CModalHeader closeButton={!actionLoading}>
//           <CModalTitle>{`${currentAction === 'APPROVED' ? 'Submit' : 'Reject'} RTO Papers`}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel htmlFor="verificationNote">
//               Verification Note <span className="text-danger">*</span>
//             </CFormLabel>
//             <CFormInput
//               id="verificationNote"
//               type="text"
//               placeholder={`Enter ${currentAction === 'APPROVED' ? 'submission' : 'rejection'} note`}
//               value={verificationNote}
//               onChange={(e) => setVerificationNote(e.target.value)}
//               required
//               disabled={actionLoading}
//             />
//             <div className="form-text">This note will be recorded with the verification action.</div>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setShowStatusModal(false)} disabled={actionLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             color={currentAction === 'APPROVED' ? 'success' : 'danger'}
//             onClick={handleRtoSubmission}
//             disabled={actionLoading || !verificationNote.trim()}
//           >
//             {actionLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Processing...
//               </>
//             ) : currentAction === 'APPROVED' ? (
//               'Submit Papers'
//             ) : (
//               'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Document Viewer Modal */}
//       <CModal
//         visible={documentViewerOpen}
//         onClose={() => setDocumentViewerOpen(false)}
//         size="xl"
//         className="document-viewer-modal"
//         fullscreen
//       >
//         <CModalHeader closeButton>
//           <CModalTitle>{activeDocument?.title}</CModalTitle>
//         </CModalHeader>
//         <CModalBody className="document-viewer-body">
//           {activeDocument?.type === 'pdf' ? (
//             <iframe src={activeDocument.url} title={activeDocument.title} className="document-iframe" frameBorder="0" />
//           ) : (
//             <img src={activeDocument?.url} alt={activeDocument?.title} className="document-full-image" />
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <a href={activeDocument?.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2">
//             Open in New Tab
//           </a>
//           <CButton color="secondary" onClick={() => setDocumentViewerOpen(false)}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// KYCDocuments.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   refreshData: PropTypes.func.isRequired,
//   rtoId: PropTypes.string,
//   kycData: PropTypes.shape({
//     _id: PropTypes.string,
//     kycDocuments: PropTypes.shape({
//       aadharFront: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           thumbnail: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       aadharBack: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           thumbnail: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       panCard: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           thumbnail: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       vPhoto: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           thumbnail: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       chasisNoPhoto: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           thumbnail: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       addressProof1: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           thumbnail: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       addressProof2: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           thumbnail: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       documentPdf: PropTypes.string
//     }),
//     bookingDetails: PropTypes.shape({
//       bookingId: PropTypes.string,
//       bookingNumber: PropTypes.string,
//       customerName: PropTypes.string,
//       chassisNumber: PropTypes.string,
//       model: PropTypes.shape({
//         model_name: PropTypes.string
//       })
//     }),
//     status: PropTypes.oneOf(['PENDING', 'APPROVED', 'REJECTED', 'NOT_UPLOADED']),
//     customerName: PropTypes.string,
//     bookingNumber: PropTypes.string,
//     chassisNumber: PropTypes.string
//   })
// };

// KYCDocuments.defaultProps = {
//   rtoId: null
// };

// export default KYCDocuments;






import React, { useState, useRef } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
  CButton,
  CFormInput,
  CFormLabel,
  CSpinner
} from '@coreui/react';
import PropTypes from 'prop-types';
import config from '../../config';
import { showError, showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import '../../css/kycView.css';
import '../../css/bookingView.css';
import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload, cilCheckCircle, cilXCircle, cilZoom, cilCloudDownload } from '@coreui/icons';
import jsPDF from 'jspdf';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MAX_DOWNLOAD_SIZE_BYTES = 200 * 1024; // 200 KB hard limit for downloads

// ─── DEBUG LOGGER ─────────────────────────────────────────────────────────────
const dbg = (tag, msg, extra = '') =>
  console.log(`[KYC-DOWNLOAD] [${tag}] ${msg}${extra ? ' | ' + extra : ''}`);

const kb = (bytes) => (bytes / 1024).toFixed(2) + ' KB';

// ─────────────────────────────────────────────────────────────────────────────
// compressImageBlobTo200KB
//
// Takes a Blob/File that is an image and iteratively compresses it
// until it is under MAX_DOWNLOAD_SIZE_BYTES (200 KB).
//
// Steps:
//   1. Draw image onto canvas
//   2. Quality loop: 0.85 → 0.10 in steps of 0.05
//   3. If still too large → resize canvas (halve dimensions) and retry
//   4. Nuclear: 400px wide + quality 0.05
//
// Returns a JPEG Blob guaranteed (best-effort) to be ≤ 200 KB.
// ─────────────────────────────────────────────────────────────────────────────
const compressImageBlobTo200KB = async (blob, label = 'file') => {
  dbg('COMPRESS', `START "${label}"`, `originalSize=${kb(blob.size)}`);

  if (blob.size <= MAX_DOWNLOAD_SIZE_BYTES) {
    dbg('COMPRESS', `SKIP "${label}" — already within 200 KB`);
    return blob;
  }

  // Load into an Image element
  const imageBitmap = await createImageBitmap(blob);
  let width  = imageBitmap.width;
  let height = imageBitmap.height;
  dbg('COMPRESS', `Original dimensions: ${width}×${height}`);

  const drawToCanvas = (w, h) => {
    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, w, h);
    return canvas;
  };

  const canvasToBlob = (canvas, quality) =>
    new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );

  // ── Step 1: Quality loop at original dimensions ─────────────────────────
  dbg('COMPRESS', `Step 1 — quality loop at ${width}×${height}`);
  let canvas = drawToCanvas(width, height);
  for (let q = 0.85; q >= 0.10; q = Math.round((q - 0.05) * 100) / 100) {
    const attempt = await canvasToBlob(canvas, q);
    dbg('COMPRESS', `  quality=${q} → ${kb(attempt.size)}`, attempt.size <= MAX_DOWNLOAD_SIZE_BYTES ? '✓ FITS' : '✗ too large');
    if (attempt.size <= MAX_DOWNLOAD_SIZE_BYTES) {
      dbg('COMPRESS', `SUCCESS at quality=${q}`, `${kb(blob.size)} → ${kb(attempt.size)}`);
      return attempt;
    }
  }

  // ── Step 2: Resize down + quality loop ──────────────────────────────────
  const scaleFactors = [0.75, 0.5, 0.35, 0.25, 0.15];
  for (const scale of scaleFactors) {
    const w = Math.round(width  * scale);
    const h = Math.round(height * scale);
    dbg('COMPRESS', `Step 2 — resize to ${w}×${h} (scale=${scale})`);
    canvas = drawToCanvas(w, h);

    for (let q = 0.85; q >= 0.10; q = Math.round((q - 0.05) * 100) / 100) {
      const attempt = await canvasToBlob(canvas, q);
      dbg('COMPRESS', `  scale=${scale} quality=${q} → ${kb(attempt.size)}`, attempt.size <= MAX_DOWNLOAD_SIZE_BYTES ? '✓ FITS' : '✗ too large');
      if (attempt.size <= MAX_DOWNLOAD_SIZE_BYTES) {
        dbg('COMPRESS', `SUCCESS scale=${scale} quality=${q}`, `${kb(blob.size)} → ${kb(attempt.size)}`);
        return attempt;
      }
    }
  }

  // ── Step 3: Nuclear option ───────────────────────────────────────────────
  dbg('COMPRESS', `Step 3 NUCLEAR — 400px wide, quality=0.05`);
  const nuclearW = 400;
  const nuclearH = Math.round((height / width) * nuclearW);
  const nuclearCanvas = drawToCanvas(nuclearW, nuclearH);
  const nuclear = await canvasToBlob(nuclearCanvas, 0.05);
  dbg('COMPRESS', `NUCLEAR result`, `${kb(blob.size)} → ${kb(nuclear.size)}`);
  return nuclear;
};

// ─────────────────────────────────────────────────────────────────────────────
// fetchAndCompressToBlob
//
// Fetches a remote URL, checks if it's an image, compresses it to ≤200 KB,
// and returns the final Blob + its object URL.
// ─────────────────────────────────────────────────────────────────────────────
const fetchAndCompressToBlob = async (url, label) => {
  dbg('FETCH', `Fetching "${label}"`, url);

  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${url}`);

  const contentType = response.headers.get('content-type') || '';
  const rawBlob     = await response.blob();

  dbg('FETCH', `Got "${label}"`, `size=${kb(rawBlob.size)}, type=${contentType}`);

  const isImage = contentType.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(url);

  if (isImage) {
    const compressed = await compressImageBlobTo200KB(rawBlob, label);
    const objectUrl  = URL.createObjectURL(compressed);
    dbg('FETCH', `Final "${label}"`, `size=${kb(compressed.size)}, objectUrl=${objectUrl}`);
    return { blob: compressed, objectUrl, isImage: true, contentType: 'image/jpeg' };
  }

  // Non-image (PDF etc.) — return as-is but warn if over limit
  if (rawBlob.size > MAX_DOWNLOAD_SIZE_BYTES) {
    console.warn(`[KYC-DOWNLOAD] "${label}" is ${kb(rawBlob.size)} — PDF compression not supported client-side. Serving original.`);
  }
  const objectUrl = URL.createObjectURL(rawBlob);
  return { blob: rawBlob, objectUrl, isImage: false, contentType };
};

// ─────────────────────────────────────────────────────────────────────────────
// KYCDocuments Component
// ─────────────────────────────────────────────────────────────────────────────
const KYCDocuments = ({ open, onClose, kycData, refreshData, rtoId }) => {
  const [actionLoading,      setActionLoading]      = useState(false);
  const [showStatusModal,    setShowStatusModal]     = useState(false);
  const [currentAction,      setCurrentAction]       = useState(null);
  const [verificationNote,   setVerificationNote]    = useState('');
  const [activeDocument,     setActiveDocument]      = useState(null);
  const [documentViewerOpen, setDocumentViewerOpen]  = useState(false);
  const [downloadingDoc,     setDownloadingDoc]      = useState(null); // docKey being processed

  const documents   = kycData?.kycDocuments || kycData;
  const customerInfo = kycData?.bookingDetails || kycData;
  const status      = kycData?.status || 'PENDING';

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getDocumentUrl = (document) => {
    if (!document) return null;
    if (typeof document === 'string') return `${config.baseURL}${document}`;
    if (document.original)  return `${config.baseURL}${document.original}`;
    if (document.pdf)        return `${config.baseURL}${document.pdf}`;
    return null;
  };

  const isPdfDoc = (document, url) => {
    if (!document) return false;
    if (document?.mimetype === 'application/pdf') return true;
    if (typeof url === 'string' && url.toLowerCase().endsWith('.pdf')) return true;
    return false;
  };

  // ── Open document viewer (compressed image preview) ───────────────────────
  const openDocumentViewer = async (document, title) => {
    if (!document) return;
    const url = getDocumentUrl(document);
    if (!url) return;

    const isPdf = isPdfDoc(document, url);

    if (isPdf) {
      // PDFs just open directly
      setActiveDocument({ url, title, type: 'pdf' });
      setDocumentViewerOpen(true);
      return;
    }

    // Images — fetch + compress before preview
    try {
      dbg('VIEWER', `Opening viewer for "${title}"`);
      const { objectUrl } = await fetchAndCompressToBlob(url, title);
      setActiveDocument({ url: objectUrl, title, type: 'image' });
      setDocumentViewerOpen(true);
    } catch (err) {
      console.error('Error loading document for viewer:', err);
      // Fallback: open original url
      setActiveDocument({ url, title, type: 'image' });
      setDocumentViewerOpen(true);
    }
  };

  // ── Download as PDF (compressed ≤200 KB) ──────────────────────────────────
  const handleDownloadAsPDF = async (document, docKey, label) => {
    const url = getDocumentUrl(document);
    if (!url) { showError('Document URL not found'); return; }

    const isPdf = isPdfDoc(document, url);

    try {
      setDownloadingDoc(docKey);
      dbg('DOWNLOAD', `START "${label}"`, `url=${url}, isPdf=${isPdf}`);

      if (isPdf) {
        // PDF: fetch + force-download directly (cannot compress client-side)
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob      = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a         = document_createElement_a(objectUrl, `${label}.pdf`);
        a.click();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
        dbg('DOWNLOAD', `PDF downloaded directly`, kb(blob.size));
        showSuccess('PDF downloaded!');
        return;
      }

      // Image: fetch + compress to ≤200 KB → build PDF
      showSuccess('Compressing to under 200 KB, please wait...');
      const { blob: compressedBlob } = await fetchAndCompressToBlob(url, label);

      dbg('DOWNLOAD', `Compressed image size: ${kb(compressedBlob.size)}`);

      // Convert blob → base64
      const base64 = await blobToBase64(compressedBlob);

      // Build PDF from the compressed image
      const img        = await loadImage(base64);
      const imgW       = img.width;
      const imgH       = img.height;
      const isLandscape = imgW > imgH;

      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit:        'px',
        format:      [imgW, imgH]
      });

      pdf.addImage(base64, 'JPEG', 0, 0, imgW, imgH);

      const pdfBlob   = pdf.output('blob');
      dbg('DOWNLOAD', `PDF blob size: ${kb(pdfBlob.size)}`);

      const objectUrl = URL.createObjectURL(pdfBlob);
      const a         = document_createElement_a(objectUrl, `${label}.pdf`);
      a.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);

      showSuccess(`Downloaded! Image compressed to ${kb(compressedBlob.size)} before PDF creation.`);
    } catch (err) {
      console.error('[KYC-DOWNLOAD] Error:', err);
      showError('Failed to download. Please try again.');
    } finally {
      setDownloadingDoc(null);
    }
  };

  // ── RTO status handlers ────────────────────────────────────────────────────
  const handleStatusButtonClick = (action) => {
    setCurrentAction(action);
    setShowStatusModal(true);
  };

  const handleRtoSubmission = async () => {
    try {
      setActionLoading(true);
      if (!rtoId)                    { showError('RTO process ID is missing'); return; }
      if (!verificationNote.trim())  { alert('Verification note is required'); return; }

      await axiosInstance.patch(`/rtoProcess/${rtoId}`, {
        rtoPaperStatus:   currentAction === 'APPROVED' ? 'Submitted' : 'Rejected',
        verificationNote: verificationNote
      });

      showSuccess(`RTO papers ${currentAction === 'APPROVED' ? 'submitted' : 'rejected'} successfully!`);
      refreshData();
      setShowStatusModal(false);
      setVerificationNote('');
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update RTO status');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Render individual document card ───────────────────────────────────────
  const renderDocument = (document, docKey, altText) => {
    const docUrl = getDocumentUrl(document);
    if (!docUrl) {
      return (
        <div className="document-placeholder">
          <CIcon icon={cilXCircle} size="xl" />
          <p>No document uploaded</p>
        </div>
      );
    }

    const isPdf       = isPdfDoc(document, docUrl);
    const isProcessing = downloadingDoc === docKey;

    return (
      <div className="document-preview-container">

        {/* Thumbnail / preview */}
        <div className="document-thumbnail" onClick={() => openDocumentViewer(document, altText)}>
          {isPdf ? (
            <div className="pdf-thumbnail">
              <div className="pdf-icon"><span>PDF</span></div>
              <p>{document?.originalname || 'Document'}</p>
            </div>
          ) : (
            <img
              src={docUrl}
              alt={altText}
              className="thumbnail-image"
            />
          )}
          <div className="document-overlay">
            <CIcon icon={cilZoom} />
            <span>View</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="document-actions mt-2">
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm"
          >
            Open {isPdf ? 'PDF' : 'Image'}
          </a>

          {/* Download as compressed PDF button */}
          <CButton
            size="sm"
            color="success"
            className="ms-2"
            onClick={() => handleDownloadAsPDF(document, docKey, altText)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Compressing...
              </>
            ) : (
              <>
                <CIcon icon={cilCloudDownload} className="me-1" />
                Download PDF
              </>
            )}
          </CButton>
        </div>

        {/* Size info badge */}
        <small className="text-muted d-block mt-1">
          {isPdf ? 'PDF document (original)' : 'Image — compressed to ≤200 KB on download'}
        </small>
      </div>
    );
  };

  const statusColors = {
    PENDING:      'warning',
    APPROVED:     'success',
    REJECTED:     'danger',
    NOT_UPLOADED: 'secondary'
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!kycData) {
    return (
      <CModal visible={open} onClose={onClose} size="xl" className="kyc-modal">
        <CModalHeader closeButton>
          <CModalTitle>Loading KYC Details...</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <p className="mt-2">Loading KYC information...</p>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>Close</CButton>
        </CModalFooter>
      </CModal>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      <CModal visible={open} onClose={onClose} size="xl" className="kyc-modal" backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>
            KYC Documents - Booking #{customerInfo?.bookingNumber || 'N/A'}
            <CBadge color={statusColors[status]} className="ms-2 status-badge">
              {status.replace('_', ' ')}
            </CBadge>
          </CModalTitle>
        </CModalHeader>

        <CModalBody className="kyc-modal-body">
          {/* Info bar */}
          <div className="kyc-info-bar">
            <div className="kyc-info-item"><strong>Booking Number:</strong> {customerInfo?.bookingNumber || 'N/A'}</div>
            <div className="kyc-info-item"><strong>Customer:</strong> {customerInfo?.customerName || 'N/A'}</div>
            <div className="kyc-info-item"><strong>Chassis Number:</strong> {customerInfo?.chassisNumber || 'N/A'}</div>
            <div className="kyc-info-item"><strong>Model:</strong> {customerInfo?.model?.model_name || 'N/A'}</div>
          </div>

          {/* Documents grid */}
          <div className="kyc-documents-container">
            <CRow>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />Aadhar Front
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.aadharFront, 'aadharFront', 'Aadhar Front')}</CCardBody>
                </CCard>
              </CCol>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />Aadhar Back
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.aadharBack, 'aadharBack', 'Aadhar Back')}</CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />PAN Card
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.panCard, 'panCard', 'PAN Card')}</CCardBody>
                </CCard>
              </CCol>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />Vehicle Photo
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.vPhoto, 'vPhoto', 'Vehicle Photo')}</CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />Chassis Number Photo
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.chasisNoPhoto, 'chasisNoPhoto', 'Chassis Number Photo')}</CCardBody>
                </CCard>
              </CCol>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />Address Proof 1
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.addressProof1, 'addressProof1', 'Address Proof 1')}</CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {(documents.addressProof2 || documents.documentPdf) && (
              <CRow>
                {documents.addressProof2 && (
                  <CCol lg={6} className="mb-4">
                    <CCard className="document-card">
                      <CCardHeader className="document-card-header">
                        <CIcon icon={cilCheckCircle} className="me-2" />Address Proof 2
                      </CCardHeader>
                      <CCardBody>{renderDocument(documents.addressProof2, 'addressProof2', 'Address Proof 2')}</CCardBody>
                    </CCard>
                  </CCol>
                )}
                {documents.documentPdf && (
                  <CCol lg={6} className="mb-4">
                    <CCard className="document-card">
                      <CCardHeader className="document-card-header">
                        <CIcon icon={cilCheckCircle} className="me-2" />Combined KYC PDF
                      </CCardHeader>
                      <CCardBody>
                        <div className="document-preview-container">
                          <div className="document-actions">
                            <a
                              href={`${config.baseURL}${documents.documentPdf}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                            >
                              <CIcon icon={cilCloudDownload} className="me-2" />
                              View &amp; Download Combined PDF
                            </a>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                )}
              </CRow>
            )}
          </div>
        </CModalBody>

        <CModalFooter>
          <div className="d-flex justify-content-between w-100 flex-wrap">
            <div className="action-buttons">
              {status === 'PENDING' && (
                <>
                  <CButton color="success" onClick={() => handleStatusButtonClick('APPROVED')} disabled={actionLoading} className="me-2 mb-2">
                    {actionLoading ? <CSpinner size="sm" /> : 'Submit RTO Papers'}
                  </CButton>
                  <CButton color="danger" onClick={() => handleStatusButtonClick('REJECTED')} disabled={actionLoading} className="mb-2">
                    {actionLoading ? <CSpinner size="sm" /> : 'Reject RTO Papers'}
                  </CButton>
                </>
              )}
              {(status === 'REJECTED' || status === 'NOT_UPLOADED') && (
                <>
                  <CBadge color="danger" className="me-2 mb-2">KYC {status}</CBadge>
                  <Link
                    to={`/upload-kyc/${rtoId || kycData._id}`}
                    state={{ bookingId: rtoId || kycData._id, customerName: customerInfo?.customerName, chassisNumber: customerInfo?.chassisNumber }}
                  >
                    <CButton color="primary" className="upload-kyc-btn mb-2">
                      <CIcon icon={cilCloudUpload} className="me-2" />Upload KYC Documents
                    </CButton>
                  </Link>
                </>
              )}
              {status === 'APPROVED' && (
                <CBadge color="success" className="p-2">
                  <CIcon icon={cilCheckCircle} className="me-2" />RTO Papers Submitted
                </CBadge>
              )}
            </div>
            <CButton color="secondary" onClick={onClose}>Close</CButton>
          </div>
        </CModalFooter>
      </CModal>

      {/* ── Status Update Modal ── */}
      <CModal visible={showStatusModal} onClose={() => !actionLoading && setShowStatusModal(false)} alignment="center">
        <CModalHeader closeButton={!actionLoading}>
          <CModalTitle>{currentAction === 'APPROVED' ? 'Submit' : 'Reject'} RTO Papers</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="verificationNote">
              Verification Note <span className="text-danger">*</span>
            </CFormLabel>
            <CFormInput
              id="verificationNote"
              type="text"
              placeholder={`Enter ${currentAction === 'APPROVED' ? 'submission' : 'rejection'} note`}
              value={verificationNote}
              onChange={(e) => setVerificationNote(e.target.value)}
              required
              disabled={actionLoading}
            />
            <div className="form-text">This note will be recorded with the verification action.</div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowStatusModal(false)} disabled={actionLoading}>Cancel</CButton>
          <CButton
            color={currentAction === 'APPROVED' ? 'success' : 'danger'}
            onClick={handleRtoSubmission}
            disabled={actionLoading || !verificationNote.trim()}
          >
            {actionLoading ? (
              <><CSpinner size="sm" className="me-2" />Processing...</>
            ) : currentAction === 'APPROVED' ? 'Submit Papers' : 'Reject'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ── Document Viewer Modal ── */}
      <CModal
        visible={documentViewerOpen}
        onClose={() => setDocumentViewerOpen(false)}
        size="xl"
        className="document-viewer-modal"
        fullscreen
      >
        <CModalHeader closeButton>
          <CModalTitle>{activeDocument?.title}</CModalTitle>
        </CModalHeader>
        <CModalBody className="document-viewer-body">
          {activeDocument?.type === 'pdf' ? (
            <iframe src={activeDocument.url} title={activeDocument.title} className="document-iframe" frameBorder="0" />
          ) : (
            <img src={activeDocument?.url} alt={activeDocument?.title} className="document-full-image" />
          )}
        </CModalBody>
        <CModalFooter>
          <a href={activeDocument?.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2">
            Open in New Tab
          </a>
          <CButton color="secondary" onClick={() => setDocumentViewerOpen(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

// ─── Private helpers (outside component to avoid re-creation) ─────────────────

// Creates a temporary <a> element and triggers download
const document_createElement_a = (href, filename) => {
  const a    = window.document.createElement('a');
  a.href     = href;
  a.download = filename;
  a.style.display = 'none';
  window.document.body.appendChild(a);
  setTimeout(() => window.document.body.removeChild(a), 1000);
  return a;
};

// Converts a Blob to a base64 data URL string
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader    = new FileReader();
    reader.onload   = () => resolve(reader.result);
    reader.onerror  = reject;
    reader.readAsDataURL(blob);
  });

// Loads a base64 data URL into an HTMLImageElement and resolves with it
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img   = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = src;
  });

// ─── PropTypes ────────────────────────────────────────────────────────────────
KYCDocuments.propTypes = {
  open:        PropTypes.bool.isRequired,
  onClose:     PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  rtoId:       PropTypes.string,
  kycData: PropTypes.shape({
    _id:      PropTypes.string,
    kycDocuments: PropTypes.shape({
      aadharFront:  PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ original: PropTypes.string, thumbnail: PropTypes.string, pdf: PropTypes.string, mimetype: PropTypes.string, originalname: PropTypes.string })]),
      aadharBack:   PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ original: PropTypes.string, thumbnail: PropTypes.string, pdf: PropTypes.string, mimetype: PropTypes.string, originalname: PropTypes.string })]),
      panCard:      PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ original: PropTypes.string, thumbnail: PropTypes.string, pdf: PropTypes.string, mimetype: PropTypes.string, originalname: PropTypes.string })]),
      vPhoto:       PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ original: PropTypes.string, thumbnail: PropTypes.string, pdf: PropTypes.string, mimetype: PropTypes.string, originalname: PropTypes.string })]),
      chasisNoPhoto:PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ original: PropTypes.string, thumbnail: PropTypes.string, pdf: PropTypes.string, mimetype: PropTypes.string, originalname: PropTypes.string })]),
      addressProof1:PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ original: PropTypes.string, thumbnail: PropTypes.string, pdf: PropTypes.string, mimetype: PropTypes.string, originalname: PropTypes.string })]),
      addressProof2:PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ original: PropTypes.string, thumbnail: PropTypes.string, pdf: PropTypes.string, mimetype: PropTypes.string, originalname: PropTypes.string })]),
      documentPdf:  PropTypes.string
    }),
    bookingDetails: PropTypes.shape({
      bookingId:     PropTypes.string,
      bookingNumber: PropTypes.string,
      customerName:  PropTypes.string,
      chassisNumber: PropTypes.string,
      model:         PropTypes.shape({ model_name: PropTypes.string })
    }),
    status:        PropTypes.oneOf(['PENDING', 'APPROVED', 'REJECTED', 'NOT_UPLOADED']),
    customerName:  PropTypes.string,
    bookingNumber: PropTypes.string,
    chassisNumber: PropTypes.string
  })
};

KYCDocuments.defaultProps = { rtoId: null };

export default KYCDocuments;

