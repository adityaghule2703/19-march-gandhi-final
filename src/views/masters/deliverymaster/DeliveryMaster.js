// DeliveryMaster.jsx
import React, { useState, useEffect } from 'react';
import '../../../css/table.css';
import {
  showError,
  axiosInstance
} from '../../../utils/tableImports';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import EditDeliveryMaster from './EditDeliveryMaster';

const DeliveryMaster = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deliveryMaster, setDeliveryMaster] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/delivery-master');

      if (response.data.success) {
        setDeliveryMaster(response.data.data || null);
      } else {
        throw new Error('Failed to fetch Delivery Master');
      }
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
      setDeliveryMaster(null);
    } finally {
      setLoading(false);
    }
  };

  const handleShowEditModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '50vh' }}
      >
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="title">Delivery Master</div>

      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-semibold">Delivery Master Settings</span>
          </div>
          <div className="text-muted">
            Total Records: {deliveryMaster ? 1 : 0}
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Key</CTableHeaderCell>
                  <CTableHeaderCell>Is Expected</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {!deliveryMaster ? (
                  <CTableRow>
                    <CTableDataCell colSpan="4" className="text-center">
                      No Delivery Master details available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  <CTableRow key={deliveryMaster._id}>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>{deliveryMaster.key || ''}</CTableDataCell>
                    <CTableDataCell>
                      {deliveryMaster.isExpected ? 'Yes' : 'No'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        className="option-button btn-sm"
                        onClick={handleShowEditModal}
                      >
                        <CIcon icon={cilPencil} className="me-1" />
                        Edit
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      <EditDeliveryMaster
        show={showModal}
        onClose={handleCloseModal}
        onSaved={handleSaved}
        deliveryMaster={deliveryMaster}
      />
    </div>
  );
};

export default DeliveryMaster;