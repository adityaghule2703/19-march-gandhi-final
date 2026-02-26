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
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPrint, cilCheckCircle, cilXCircle } from '@coreui/icons';
import config from '../../../config';

const DisbursementView = ({ visible, onClose, bookingId, bookingDetails, disbursements }) => {
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Finance Letter - ${bookingDetails?.bookingNumber || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2759a2; margin-bottom: 5px; }
            .header h3 { color: #666; margin-top: 0; }
            .details { margin-bottom: 30px; }
            .details table { width: 100%; border-collapse: collapse; }
            .details td { padding: 8px; border: 1px solid #ddd; }
            .details td:first-child { font-weight: bold; width: 200px; background: #f5f5f5; }
            .disbursements { margin-top: 30px; }
            .disbursements table { width: 100%; border-collapse: collapse; }
            .disbursements th { background: #2759a2; color: white; padding: 10px; text-align: left; }
            .disbursements td { padding: 10px; border: 1px solid #ddd; }
            .disbursements tr:nth-child(even) { background: #f9f9f9; }
            .status-badge { padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .status-completed { background: #d4edda; color: #155724; }
            .status-pending { background: #fff3cd; color: #856404; }
            .total { margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FINANCE DISBURSEMENT LETTER</h1>
            <h3>Booking #${bookingDetails?.bookingNumber || ''}</h3>
          </div>
          
          <div class="details">
            <h2>Booking Details</h2>
            <table>
              <tr><td>Customer Name</td><td>${bookingDetails?.customerName || 'N/A'}</td></tr>
              <tr><td>Customer Phone</td><td>${bookingDetails?.customerPhone || 'N/A'}</td></tr>
              <tr><td>Payment Type</td><td>${bookingDetails?.paymentType || 'N/A'}</td></tr>
              <tr><td>Vehicle Model</td><td>${bookingDetails?.vehicleModel || 'N/A'}</td></tr>
              <tr><td>Vehicle Variant</td><td>${bookingDetails?.vehicleVariant || 'N/A'}</td></tr>
              <tr><td>Vehicle Color</td><td>${bookingDetails?.vehicleColor || 'N/A'}</td></tr>
              <tr><td>Chassis Number</td><td>${bookingDetails?.chassisNumber || 'N/A'}</td></tr>
              <tr><td>Engine Number</td><td>${bookingDetails?.engineNumber || 'N/A'}</td></tr>
              <tr><td>Total Deal Amount</td><td>₹${bookingDetails?.totalDealAmount?.toLocaleString() || '0'}</td></tr>
              <tr><td>Branch Name</td><td>${bookingDetails?.branchName || 'N/A'}</td></tr>
            </table>
          </div>
          
          <div class="disbursements">
            <h2>Disbursement History</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Disbursement Amount</th>
                  <th>GC Amount</th>
                  <th>Down Payment Expected</th>
                  <th>Status</th>
                  <th>Deviation Applied</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${disbursements?.map(d => `
                  <tr>
                    <td>${new Date(d.disbursementDate).toLocaleDateString('en-GB')}</td>
                    <td>₹${d.disbursementAmount?.toLocaleString() || '0'}</td>
                    <td>₹${d.gcAmount?.toLocaleString() || '0'}</td>
                    <td>₹${d.downPaymentExpected?.toLocaleString() || '0'}</td>
                    <td><span class="status-badge status-${d.status?.toLowerCase()}">${d.status || 'N/A'}</span></td>
                    <td>${d.deviationApplied ? 'Yes' : 'No'}</td>
                    <td>${d.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="total">
            Total Disbursed: ₹${disbursements?.reduce((sum, d) => sum + (d.disbursementAmount || 0), 0)?.toLocaleString() || '0'}
          </div>
          
          <div class="footer">
            Generated on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString()}
            <br>GANDHI TVS
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const totalDisbursed = disbursements?.reduce((sum, d) => sum + (d.disbursementAmount || 0), 0) || 0;

  return (
    <CModal visible={visible} onClose={onClose} size="xl" backdrop="static">
      <CModalHeader>
        <CModalTitle>
          Finance Disbursement Details - {bookingDetails?.bookingNumber || ''}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Booking Information</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <p><strong>Customer Name:</strong> {bookingDetails?.customerName || 'N/A'}</p>
                <p><strong>Customer Phone:</strong> {bookingDetails?.customerPhone || 'N/A'}</p>
                <p><strong>Payment Type:</strong> {bookingDetails?.paymentType || 'N/A'}</p>
                <p><strong>Total Deal Amount:</strong> ₹{bookingDetails?.totalDealAmount?.toLocaleString() || '0'}</p>
              </CCol>
              <CCol md={6}>
                <p><strong>Vehicle Model:</strong> {bookingDetails?.vehicleModel || 'N/A'}</p>
                <p><strong>Vehicle Color:</strong> {bookingDetails?.vehicleColor || 'N/A'}</p>
                <p><strong>Chassis Number:</strong> {bookingDetails?.chassisNumber || 'N/A'}</p>
                <p><strong>Branch:</strong> {bookingDetails?.branchName || 'N/A'}</p>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <CCard>
          <CCardHeader>
            <strong>Disbursement History</strong>
            <span className="float-end">
              Total Disbursed: <strong>₹{totalDisbursed.toLocaleString()}</strong>
            </span>
          </CCardHeader>
          <CCardBody>
            {disbursements && disbursements.length > 0 ? (
              <CTable striped bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Disbursement Amount</CTableHeaderCell>
                    <CTableHeaderCell>GC Amount</CTableHeaderCell>
                    <CTableHeaderCell>Down Payment Expected</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Deviation</CTableHeaderCell>
                    <CTableHeaderCell>Notes</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {disbursements.map((d, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        {new Date(d.disbursementDate).toLocaleDateString('en-GB')}
                      </CTableDataCell>
                      <CTableDataCell>₹{d.disbursementAmount?.toLocaleString() || '0'}</CTableDataCell>
                      <CTableDataCell>₹{d.gcAmount?.toLocaleString() || '0'}</CTableDataCell>
                      <CTableDataCell>₹{d.downPaymentExpected?.toLocaleString() || '0'}</CTableDataCell>
                      <CTableDataCell>
                        <span className={`status-badge ${d.status?.toLowerCase() || ''}`}>
                          {d.status || 'N/A'}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        {d.deviationApplied ? (
                          <CIcon icon={cilCheckCircle} className="text-success" size="lg" />
                        ) : (
                          <CIcon icon={cilXCircle} className="text-danger" size="lg" />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{d.notes || '-'}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <p className="text-center text-muted my-3">No disbursement records found</p>
            )}
          </CCardBody>
        </CCard>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handlePrint}>
          <CIcon icon={cilPrint} className="me-2" />
          Print Finance Letter
        </CButton>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default DisbursementView;