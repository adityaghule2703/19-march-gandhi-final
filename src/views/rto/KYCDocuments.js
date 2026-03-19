// import React, { useState } from 'react';
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
//   CButton,
//   CSpinner,
//   CBadge
// } from '@coreui/react';
// import PropTypes from 'prop-types';
// import config from '../../config';
// import { showError, showSuccess } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import '../../css/kycView.css';
// import '../../css/bookingView.css';
// import CIcon from '@coreui/icons-react';
// import { cilCloudDownload, cilCloudUpload } from '@coreui/icons';
// import { Link } from 'react-router-dom';

// const KYCDocuments = ({ open, onClose, kycData, refreshData, rtoId }) => {
//   const [actionLoading, setActionLoading] = useState(false);
//   const documents = kycData?.kycDocuments || kycData;
//   const customerInfo = kycData?.bookingDetails || kycData;

//   const confirmRtoSubmission = async () => {
//     if (!rtoId) {
//       showError('No RTO process ID found');
//       return;
//     }

//     try {
//       setActionLoading(true);
//       await axiosInstance.patch(`/rtoProcess/${rtoId}`, {
//         rtoPaperStatus: 'Submitted'
//       });

//       showSuccess('RTO papers submitted successfully!');
//       refreshData();
//       onClose();
//     } catch (error) {
//       console.log(error);
//       showError(error.response?.data?.message || 'Failed to submit RTO papers');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getDocumentUrl = (document) => {
//     if (!document) return null;
//     if (typeof document === 'string') return `${config.baseURL}${document}`;
//     if (document.original) return `${config.baseURL}${document.original}`;
//     return null;
//   };

//   const getDownloadUrl = (document) => {
//     if (!document) return null;
//     if (typeof document === 'string') return `${config.baseURL}${document}`;
//     if (document.pdf) return `${config.baseURL}${document.pdf}`;
//     if (document.original) return `${config.baseURL}${document.original}`;
//     return null;
//   };

//   const DocumentCard = ({ title, document }) => {
//     const docUrl = getDocumentUrl(document);
//     const downloadUrl = getDownloadUrl(document);

//     return (
//       <CCard className="document-card">
//         <CCardHeader className="d-flex justify-content-between align-items-center">
//           <span>{title}</span>
//           {downloadUrl && (
//             <a href={downloadUrl} download className="btn btn-sm btn-primary">
//               <CIcon icon={cilCloudDownload} /> Download
//             </a>
//           )}
//         </CCardHeader>
//         <CCardBody>
//           {docUrl ? (
//             <img src={docUrl} alt={title} className="document-image" />
//           ) : (
//             <div className="text-muted text-center py-4">No document uploaded</div>
//           )}
//         </CCardBody>
//       </CCard>
//     );
//   };

//   if (!kycData) {
//     return (
//       <CModal visible={open} onClose={onClose} size="xl">
//         <CModalHeader>
//           <CModalTitle>Loading KYC Details...</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="text-center py-4">
//             <CSpinner color="primary" />
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
//       {open && <div className="modal-overlay" onClick={onClose} />}
//       <CModal visible={open} onClose={onClose} size="xl" fullscreen="lg">
//         <CModalHeader>
//           <CModalTitle>Booking Number - {customerInfo?.bookingNumber || 'N/A'}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="kyc-documents-container">
//             <CRow className="mb-4 d-flex">
//               <CCol>
//                 <div className="customer-info-card">
//                   <p>
//                     <strong>Name:</strong> {customerInfo?.customerName || 'N/A'}
//                   </p>
//                   <p>
//                     <strong>Chassis Number:</strong> {customerInfo?.chassisNumber || 'N/A'}
//                   </p>
//                   <p>
//                     <strong>Model:</strong> {customerInfo?.model?.model_name || 'N/A'}
//                   </p>
//                 </div>
//               </CCol>
//             </CRow>

//             <CRow>
//               <CCol md={6} className="mb-4">
//                 <DocumentCard title="Aadhar Front" document={documents.aadharFront} />
//               </CCol>
//               <CCol md={6} className="mb-4">
//                 <DocumentCard title="Aadhar Back" document={documents.aadharBack} />
//               </CCol>
//             </CRow>

//             <CRow>
//               <CCol md={6} className="mb-4">
//                 <DocumentCard title="PAN Card" document={documents.panCard} />
//               </CCol>
//               <CCol md={6} className="mb-4">
//                 <DocumentCard title="Vehicle Photo" document={documents.vPhoto} />
//               </CCol>
//             </CRow>

//             <CRow>
//               <CCol md={6} className="mb-4">
//                 <DocumentCard title="Chassis Number Photo" document={documents.chasisNoPhoto} />
//               </CCol>
//               <CCol md={6} className="mb-4">
//                 <DocumentCard title="Address Proof 1" document={documents.addressProof1} />
//               </CCol>
//             </CRow>

//             {(documents.addressProof2 || documents.documentPdf) && (
//               <CRow>
//                 {documents.addressProof2 && (
//                   <CCol md={6} className="mb-4">
//                     <DocumentCard title="Address Proof 2" document={documents.addressProof2} />
//                   </CCol>
//                 )}
//                 {documents.documentPdf && (
//                   <CCol md={6} className="mb-4">
//                     <CCard className="document-card">
//                       <CCardHeader>Combined KYC PDF</CCardHeader>
//                       <CCardBody>
//                         <a
//                           href={`${config.baseURL}${documents.documentPdf}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="btn btn-primary"
//                         >
//                           <CIcon icon={cilCloudDownload} className="me-2" />
//                           View PDF
//                         </a>
//                       </CCardBody>
//                     </CCard>
//                   </CCol>
//                 )}
//               </CRow>
//             )}
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <div className="d-flex justify-content-between w-100 align-items-center">
//             <div>
//               {kycData.status === 'PENDING' && (
//                 <CButton color="primary" onClick={confirmRtoSubmission} disabled={actionLoading}>
//                   {actionLoading ? <CSpinner size="sm" /> : 'Verify KYC'}
//                 </CButton>
//               )}
//               {(kycData.status === 'REJECTED' || kycData.status === 'NOT_UPLOADED') && (
//                 <>
//                   <CBadge color="danger" className="me-2">
//                     KYC {kycData.status}
//                   </CBadge>
//                   <Link
//                     to={`/upload-kyc/${rtoId || kycData._id}`}
//                     state={{
//                       bookingId: rtoId || kycData._id,
//                       customerName: customerInfo?.customerName,
//                       chassisNumber: customerInfo?.chassisNumber
//                     }}
//                   >
//                     <CButton color="primary">
//                       <CIcon icon={cilCloudUpload} className="me-2" />
//                       Upload KYC
//                     </CButton>
//                   </Link>
//                 </>
//               )}
//               {kycData.status === 'APPROVED' && <CBadge color="success">KYC APPROVED</CBadge>}
//             </div>
//             <CButton color="secondary" onClick={onClose}>
//               Close
//             </CButton>
//           </div>
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
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       aadharBack: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       panCard: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       vPhoto: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       chasisNoPhoto: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       addressProof1: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
//           pdf: PropTypes.string,
//           mimetype: PropTypes.string,
//           originalname: PropTypes.string
//         })
//       ]),
//       addressProof2: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.shape({
//           original: PropTypes.string,
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





import React, { useState } from 'react';
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

const KYCDocuments = ({ open, onClose, kycData, refreshData, rtoId }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [activeDocument, setActiveDocument] = useState(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);

  const documents = kycData?.kycDocuments || kycData;
  const customerInfo = kycData?.bookingDetails || kycData;
  const status = kycData?.status || 'PENDING';

  const handleStatusButtonClick = (action) => {
    setCurrentAction(action);
    setShowStatusModal(true);
  };

  const handleRtoSubmission = async () => {
    try {
      setActionLoading(true);
      console.log('Submitting RTO papers for RTO ID:', rtoId);
      
      if (!rtoId) {
        showError('RTO process ID is missing');
        return;
      }

      if (!verificationNote.trim()) {
        alert('Verification note is required');
        return;
      }

      await axiosInstance.patch(`/rtoProcess/${rtoId}`, {
        rtoPaperStatus: currentAction === 'APPROVED' ? 'Submitted' : 'Rejected',
        verificationNote: verificationNote
      });

      showSuccess(`RTO papers ${currentAction === 'APPROVED' ? 'submitted' : 'rejected'} successfully!`);
      refreshData();
      setShowStatusModal(false);
      setVerificationNote('');
      onClose();
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || `Failed to update RTO status`);
    } finally {
      setActionLoading(false);
    }
  };

  const openDocumentViewer = (document, title) => {
    if (!document) return;

    let url;
    if (typeof document === 'string') {
      url = `${config.baseURL}${document}`;
    } else if (document?.original) {
      url = `${config.baseURL}${document.original}`;
    } else if (document?.pdf) {
      url = `${config.baseURL}${document.pdf}`;
    } else {
      return;
    }

    setActiveDocument({
      url: url,
      title: title,
      type: 'image' // Default to image, PDF detection can be added if needed
    });
    setDocumentViewerOpen(true);
  };

  const getDocumentUrl = (document) => {
    if (!document) return null;
    if (typeof document === 'string') return `${config.baseURL}${document}`;
    if (document.original) return `${config.baseURL}${document.original}`;
    if (document.pdf) return `${config.baseURL}${document.pdf}`;
    return null;
  };

  const getThumbnailUrl = (document) => {
    if (!document) return null;
    if (typeof document === 'string') return `${config.baseURL}${document}`;
    if (document.thumbnail) return `${config.baseURL}${document.thumbnail}`;
    if (document.original) return `${config.baseURL}${document.original}`;
    if (document.pdf) return `${config.baseURL}${document.pdf}`;
    return null;
  };

  const renderDocument = (document, altText) => {
    const docUrl = getDocumentUrl(document);
    const thumbnailUrl = getThumbnailUrl(document);

    if (!docUrl) {
      return (
        <div className="document-placeholder">
          <CIcon icon={cilXCircle} size="xl" />
          <p>No document uploaded</p>
        </div>
      );
    }

    const isPdf = docUrl?.toLowerCase().includes('.pdf') || document?.mimetype === 'application/pdf';

    return (
      <div className="document-preview-container">
        <div className="document-thumbnail" onClick={() => openDocumentViewer(document, altText)}>
          {isPdf ? (
            <div className="pdf-thumbnail">
              <div className="pdf-icon">
                <span>PDF</span>
              </div>
              <p>{document?.originalname || 'Document'}</p>
            </div>
          ) : (
            <img src={thumbnailUrl} alt={altText} className="thumbnail-image" />
          )}
          <div className="document-overlay">
            <CIcon icon={cilZoom} />
            <span>View</span>
          </div>
        </div>

        <div className="document-actions">
          <a href={docUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
            Open Full {isPdf ? 'PDF' : 'Image'}
          </a>
          <a href={docUrl} download className="btn btn-outline-success btn-sm ms-2">
            <CIcon icon={cilCloudDownload} /> Download
          </a>
        </div>
      </div>
    );
  };

  const statusColors = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
    NOT_UPLOADED: 'secondary'
  };

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
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    );
  }

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
          <div className="kyc-info-bar">
            <div className="kyc-info-item">
              <strong>Booking Number:</strong> {customerInfo?.bookingNumber || 'N/A'}
            </div>
            <div className="kyc-info-item">
              <strong>Customer:</strong> {customerInfo?.customerName || 'N/A'}
            </div>
            <div className="kyc-info-item">
              <strong>Chassis Number:</strong> {customerInfo?.chassisNumber || 'N/A'}
            </div>
            <div className="kyc-info-item">
              <strong>Model:</strong> {customerInfo?.model?.model_name || 'N/A'}
            </div>
          </div>

          <div className="kyc-documents-container">
            <CRow>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Aadhar Front
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.aadharFront, 'Aadhar Front')}</CCardBody>
                </CCard>
              </CCol>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Aadhar Back
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.aadharBack, 'Aadhar Back')}</CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    PAN Card
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.panCard, 'PAN Card')}</CCardBody>
                </CCard>
              </CCol>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Vehicle Photo
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.vPhoto, 'Vehicle Photo')}</CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Chassis Number Photo
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.chasisNoPhoto, 'Chassis Number')}</CCardBody>
                </CCard>
              </CCol>
              <CCol lg={6} className="mb-4">
                <CCard className="document-card">
                  <CCardHeader className="document-card-header">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Address Proof 1
                  </CCardHeader>
                  <CCardBody>{renderDocument(documents.addressProof1, 'Address Proof 1')}</CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {(documents.addressProof2 || documents.documentPdf) && (
              <CRow>
                {documents.addressProof2 && (
                  <CCol lg={6} className="mb-4">
                    <CCard className="document-card">
                      <CCardHeader className="document-card-header">
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        Address Proof 2
                      </CCardHeader>
                      <CCardBody>{renderDocument(documents.addressProof2, 'Address Proof 2')}</CCardBody>
                    </CCard>
                  </CCol>
                )}
                {documents.documentPdf && (
                  <CCol lg={6} className="mb-4">
                    <CCard className="document-card">
                      <CCardHeader className="document-card-header">
                        <CIcon icon={cilCheckCircle} className="me-2" />
                        Combined KYC PDF
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
                              View & Download PDF
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
                  <CButton
                    color="success"
                    onClick={() => handleStatusButtonClick('APPROVED')}
                    disabled={actionLoading}
                    className="me-2 mb-2"
                  >
                    {actionLoading ? <CSpinner size="sm" /> : 'Submit RTO Papers'}
                  </CButton>
                  <CButton 
                    color="danger" 
                    onClick={() => handleStatusButtonClick('REJECTED')} 
                    disabled={actionLoading} 
                    className="mb-2"
                  >
                    {actionLoading ? <CSpinner size="sm" /> : 'Reject RTO Papers'}
                  </CButton>
                </>
              )}
              {(status === 'REJECTED' || status === 'NOT_UPLOADED') && (
                <>
                  <CBadge color="danger" className="me-2 mb-2">
                    KYC {status}
                  </CBadge>
                  <Link
                    to={`/upload-kyc/${rtoId || kycData._id}`}
                    state={{
                      bookingId: rtoId || kycData._id,
                      customerName: customerInfo?.customerName,
                      chassisNumber: customerInfo?.chassisNumber
                    }}
                  >
                    <CButton color="primary" className="upload-kyc-btn mb-2">
                      <CIcon icon={cilCloudUpload} className="me-2" />
                      Upload KYC Documents
                    </CButton>
                  </Link>
                </>
              )}
              {status === 'APPROVED' && (
                <CBadge color="success" className="p-2">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  RTO Papers Submitted
                </CBadge>
              )}
            </div>
            <CButton color="secondary" onClick={onClose}>
              Close
            </CButton>
          </div>
        </CModalFooter>
      </CModal>

      {/* Status Update Modal */}
      <CModal visible={showStatusModal} onClose={() => !actionLoading && setShowStatusModal(false)} alignment="center">
        <CModalHeader closeButton={!actionLoading}>
          <CModalTitle>{`${currentAction === 'APPROVED' ? 'Submit' : 'Reject'} RTO Papers`}</CModalTitle>
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
          <CButton color="secondary" onClick={() => setShowStatusModal(false)} disabled={actionLoading}>
            Cancel
          </CButton>
          <CButton
            color={currentAction === 'APPROVED' ? 'success' : 'danger'}
            onClick={handleRtoSubmission}
            disabled={actionLoading || !verificationNote.trim()}
          >
            {actionLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Processing...
              </>
            ) : currentAction === 'APPROVED' ? (
              'Submit Papers'
            ) : (
              'Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Document Viewer Modal */}
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
          <CButton color="secondary" onClick={() => setDocumentViewerOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

KYCDocuments.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  rtoId: PropTypes.string,
  kycData: PropTypes.shape({
    _id: PropTypes.string,
    kycDocuments: PropTypes.shape({
      aadharFront: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          original: PropTypes.string,
          thumbnail: PropTypes.string,
          pdf: PropTypes.string,
          mimetype: PropTypes.string,
          originalname: PropTypes.string
        })
      ]),
      aadharBack: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          original: PropTypes.string,
          thumbnail: PropTypes.string,
          pdf: PropTypes.string,
          mimetype: PropTypes.string,
          originalname: PropTypes.string
        })
      ]),
      panCard: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          original: PropTypes.string,
          thumbnail: PropTypes.string,
          pdf: PropTypes.string,
          mimetype: PropTypes.string,
          originalname: PropTypes.string
        })
      ]),
      vPhoto: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          original: PropTypes.string,
          thumbnail: PropTypes.string,
          pdf: PropTypes.string,
          mimetype: PropTypes.string,
          originalname: PropTypes.string
        })
      ]),
      chasisNoPhoto: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          original: PropTypes.string,
          thumbnail: PropTypes.string,
          pdf: PropTypes.string,
          mimetype: PropTypes.string,
          originalname: PropTypes.string
        })
      ]),
      addressProof1: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          original: PropTypes.string,
          thumbnail: PropTypes.string,
          pdf: PropTypes.string,
          mimetype: PropTypes.string,
          originalname: PropTypes.string
        })
      ]),
      addressProof2: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          original: PropTypes.string,
          thumbnail: PropTypes.string,
          pdf: PropTypes.string,
          mimetype: PropTypes.string,
          originalname: PropTypes.string
        })
      ]),
      documentPdf: PropTypes.string
    }),
    bookingDetails: PropTypes.shape({
      bookingId: PropTypes.string,
      bookingNumber: PropTypes.string,
      customerName: PropTypes.string,
      chassisNumber: PropTypes.string,
      model: PropTypes.shape({
        model_name: PropTypes.string
      })
    }),
    status: PropTypes.oneOf(['PENDING', 'APPROVED', 'REJECTED', 'NOT_UPLOADED']),
    customerName: PropTypes.string,
    bookingNumber: PropTypes.string,
    chassisNumber: PropTypes.string
  })
};

KYCDocuments.defaultProps = {
  rtoId: null
};

export default KYCDocuments;
