import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CBackdrop,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CImage,
  CListGroup,
  CListGroupItem
} from '@coreui/react';
import { axiosInstance } from '../../../utils/tableImports';
import config from '../../../config';

const ViewInsuranceModal = ({ show, onClose, insuranceData: initialData }) => {
  const [insuranceData, setInsuranceData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [documentError, setDocumentError] = useState(false);

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      if (show && initialData?.id) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/insurance/${initialData.id}`);
          setInsuranceData(response.data.data);
        } catch (error) {
          console.error('Error fetching insurance details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInsuranceDetails();
  }, [show, initialData]);

  // Clean up object URLs when component unmounts or document changes
  useEffect(() => {
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [documentUrl]);

  if (!insuranceData) return null;

  const getDocumentTypeBadge = (type) => {
    switch (type) {
      case 'POLICY':
        return 'primary';
      case 'RECEIPT':
        return 'success';
      case 'OTHER':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllPDF = async () => {
    if (!insuranceData.documents || insuranceData.documents.length === 0) return;

    setGeneratingPDF(true);
    try {
      const token = localStorage.getItem('access_token'); // or however you store your token
      const response = await axiosInstance.get(`/insurance/${insuranceData.id}/download-pdf`, {
        responseType: 'blob',
        timeout: 60000,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Insurance_Documents_${insuranceData.booking?.bookingNumber || 'Bundle'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.get(`/insurance/${insuranceData.id}/document/${doc.id}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error downloading document. Please try again.');
    }
  };

  const handleViewDocument = async (doc) => {
    setSelectedDocument(doc);
    setDocLoading(true);
    setDocumentError(false);
    
    // Clean up previous URL
    if (documentUrl) {
      URL.revokeObjectURL(documentUrl);
      setDocumentUrl(null);
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.get(`/insurance/${insuranceData.id}/document/${doc.id}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Create a blob URL for the document
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDocumentUrl(url);
    } catch (error) {
      console.error('Error loading document:', error);
      setDocumentError(true);
    } finally {
      setDocLoading(false);
    }
  };

  const isImageFile = (fileName) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (fileName) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  const getFileIcon = (fileName) => {
    if (isImageFile(fileName)) return '🖼️';
    if (isPdfFile(fileName)) return '📄';
    return '📁';
  };

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={show} onClose={onClose} size="xl" alignment="center" scrollable>
        <CModalHeader>
          <CModalTitle>Insurance Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {loading ? (
            <div className="text-center">
              <CSpinner />
              <p>Loading insurance details...</p>
            </div>
          ) : (
            <>
              <CRow>
                <CCol md={6}>
                  <CCard className="mb-4">
                    <CCardHeader>
                      <h5>Booking Information</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">Booking Number</label>
                            <div className="info-value">{insuranceData.booking?.bookingNumber || 'N/A'}</div>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">Insurance Status</label>
                            <div className="info-value">
                              <CBadge
                                color={
                                  insuranceData.status === 'COMPLETED' ? 'success' : insuranceData.status === 'LATER' ? 'warning' : 'danger'
                                }
                              >
                                {insuranceData.status}
                              </CBadge>
                            </div>
                          </div>
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">Customer Name</label>
                            <div className="info-value">{insuranceData.booking?.customerName || 'N/A'}</div>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">Chassis Number</label>
                            <div className="info-value">{insuranceData.booking?.chassisNumber || 'N/A'}</div>
                          </div>
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">Model Name</label>
                            <div className="info-value">{insuranceData.booking?.model?.model_name || 'N/A'}</div>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">Insurance Date</label>
                            <div className="info-value">
                              {insuranceData.insuranceDate ? new Date(insuranceData.insuranceDate).toLocaleDateString('en-GB') : 'N/A'}
                            </div>
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>

                  <CCard className="mb-4">
                    <CCardHeader>
                      <h5>Insurance Details</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">Insurance Provider</label>
                            <div className="info-value">{insuranceData.insuranceProviderDetails?.provider_name || 'N/A'}</div>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">Policy Number</label>
                            <div className="info-value">{insuranceData.policyNumber || 'N/A'}</div>
                          </div>
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">RSA Policy Number</label>
                            <div className="info-value">{insuranceData.rsaPolicyNumber || 'N/A'}</div>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="info-item">
                            <label className="form-label">CMS Policy Number</label>
                            <div className="info-value">{insuranceData.cmsPolicyNumber || 'N/A'}</div>
                          </div>
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CCol md={12}>
                          <div className="info-item">
                            <label className="form-label">Remarks</label>
                            <div className="info-value">{insuranceData.remarks || 'No remarks provided'}</div>
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard className="mb-4 h-100">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                      <h5>Documents</h5>
                      {insuranceData.documents && insuranceData.documents.length > 0 && (
                        <CButton color="primary" size="sm" onClick={handleDownloadAllPDF} disabled={generatingPDF}>
                          {generatingPDF ? <CSpinner size="sm" /> : 'Download All as PDF'}
                        </CButton>
                      )}
                    </CCardHeader>
                    <CCardBody>
                      {insuranceData.documents && insuranceData.documents.length > 0 ? (
                        <>
                          <CListGroup>
                            {insuranceData.documents.map((doc, index) => (
                              <CListGroupItem
                                key={index}
                                className="d-flex justify-content-between align-items-center cursor-pointer"
                                onClick={() => handleViewDocument(doc)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div>
                                  {getFileIcon(doc.name)} {doc.name}
                                  <CBadge color={getDocumentTypeBadge(doc.type)} className="ms-2">
                                    {doc.type}
                                  </CBadge>
                                </div>
                                <CButton
                                  color="primary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument(doc);
                                  }}
                                >
                                  Download
                                </CButton>
                              </CListGroupItem>
                            ))}
                          </CListGroup>

                          {selectedDocument && (
                            <div className="mt-3">
                              <h6>Document Preview: {selectedDocument.name}</h6>
                              <div
                                className="document-preview border rounded p-2"
                                style={{ minHeight: '300px', maxHeight: '400px', overflow: 'auto' }}
                              >
                                {docLoading ? (
                                  <div className="text-center py-5">
                                    <CSpinner />
                                    <p>Loading document...</p>
                                  </div>
                                ) : documentError ? (
                                  <div className="text-center py-5 text-danger">
                                    <p>Error loading document. Please try downloading it instead.</p>
                                    <CButton
                                      color="primary"
                                      onClick={() => handleDownloadDocument(selectedDocument)}
                                    >
                                      Download File
                                    </CButton>
                                  </div>
                                ) : documentUrl ? (
                                  isImageFile(selectedDocument.name) ? (
                                    <CImage
                                      src={documentUrl}
                                      fluid
                                      className="mx-auto d-block"
                                      style={{ maxHeight: '350px' }}
                                    />
                                  ) : isPdfFile(selectedDocument.name) ? (
                                    <iframe
                                      src={documentUrl}
                                      width="100%"
                                      height="350"
                                      frameBorder="0"
                                      title={selectedDocument.name}
                                    />
                                  ) : (
                                    <div className="text-center py-5">
                                      <p>Preview not available for this file type</p>
                                      <CButton
                                        color="primary"
                                        onClick={() => handleDownloadDocument(selectedDocument)}
                                      >
                                        Download File
                                      </CButton>
                                    </div>
                                  )
                                ) : null}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-muted text-center py-4">No documents uploaded</div>
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <style jsx>{`
        .info-item {
          margin-bottom: 1rem;
        }
        .info-item label {
          font-weight: 600;
          color: #4f5d73;
          margin-bottom: 0.25rem;
        }
        .info-value {
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 0.25rem;
          min-height: 2.5rem;
          display: flex;
          align-items: center;
        }
        .document-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .document-list {
          flex: 1;
        }
        .document-preview {
          flex: 2;
          border: 1px solid #ddd;
          border-radius: 0.25rem;
          padding: 1rem;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .preview-content {
          width: 100%;
          height: 100%;
        }
        .pdf-preview {
          width: 100%;
        }
        .unsupported-file {
          padding: 2rem;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ViewInsuranceModal;