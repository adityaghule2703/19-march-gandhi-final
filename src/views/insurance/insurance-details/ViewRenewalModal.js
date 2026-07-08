import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilZoom } from '@coreui/icons';

const ViewRenewalModal = ({ show, onClose, renewalData }) => {
  if (!renewalData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING': 'warning',
      'COMPLETED': 'success',
      'CANCELLED': 'danger'
    };
    return colors[status] || 'secondary';
  };

  return (
    <CModal size="lg" visible={show} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilZoom} className="me-2" />
          Insurance Renewal Details
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="row">
          {/* Customer Details */}
          <div className="col-md-12 mb-4">
            <h6 className="border-bottom pb-2">Customer Details</h6>
            <div className="row">
              <div className="col-md-12">
                <p><strong>Customer Name:</strong> {renewalData.customerName || '-'}</p>
              </div>
            </div>
          </div>

         

          {/* New Insurance Details */}
          <div className="col-md-12 mb-4">
            <h6 className="border-bottom pb-2">New Insurance Details</h6>
            <div className="row">
              <div className="col-md-6">
                <p><strong>New Policy Number:</strong> {renewalData.newPolicyNumber || '-'}</p>
                <p><strong>New Insurance Company:</strong> {renewalData.newInsuranceCompany || '-'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>New Premium:</strong> {renewalData.newPremium || 0}</p>
                <p><strong>Start Date:</strong> {formatDate(renewalData.newStartDate)}</p>
                <p><strong>Expiry Date:</strong> {formatDate(renewalData.newExpiryDate)}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="col-md-12 mb-4">
            <h6 className="border-bottom pb-2">Payment Details</h6>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Payment Mode:</strong> {renewalData.paymentMode || '-'}</p>
                {renewalData.paymentSubMode && (
                  <p><strong>Payment Sub Mode:</strong> {renewalData.paymentSubMode || '-'}</p>
                )}
                {renewalData.bankLocation && (
                  <p><strong>Bank Location:</strong> {renewalData.bankLocation || '-'}</p>
                )}
                <p><strong>Payment Reference:</strong> {renewalData.paymentReference || '-'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Payment Date:</strong> {formatDate(renewalData.paymentDate)}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="col-md-12">
            <h6 className="border-bottom pb-2">Additional Information</h6>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Status:</strong> 
                  <CBadge color={getStatusBadge(renewalData.status)} className="ms-2">
                    {renewalData.status || 'PENDING'}
                  </CBadge>
                </p>
                <p><strong>Payment Status:</strong> 
                  <CBadge color={renewalData.paymentStatus === 'COMPLETED' ? 'success' : 'warning'} className="ms-2">
                    {renewalData.paymentStatus || 'PENDING'}
                  </CBadge>
                </p>
                <p><strong>Remarks:</strong> {renewalData.remarks || '-'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Created By:</strong> {renewalData.createdBy?.name || '-'}</p>
                <p><strong>Created At:</strong> {formatDate(renewalData.createdAt)}</p>
                <p><strong>Days Until Expiry:</strong> {renewalData.daysUntilExpiryDisplay || '-'}</p>
                <p><strong>Internal Notes:</strong> {renewalData.internalNotes || '-'}</p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {renewalData.documents && renewalData.documents.length > 0 && (
            <div className="col-md-12 mt-3">
              <h6 className="border-bottom pb-2">Documents</h6>
              <CTable bordered hover responsive size="sm">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Document Name</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Uploaded Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {renewalData.documents.map((doc, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{doc.name || '-'}</CTableDataCell>
                      <CTableDataCell>{doc.type || '-'}</CTableDataCell>
                      <CTableDataCell>{formatDate(doc.uploadedAt)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ViewRenewalModal;