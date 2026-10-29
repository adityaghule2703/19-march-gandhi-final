// SwapVehicleModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  CModal, CModalHeader, CModalBody, CModalFooter,
  CFormLabel, CButton, CSpinner, CAlert, CCloseButton,
  CFormTextarea,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLocationPin, cilWarning } from '@coreui/icons';
import axiosInstance from '../../../axiosInstance';
import Select from 'react-select';
import '../../../css/form.css';

const SwapVehicleModal = ({
  show,
  onClose,
  onSave,
  isLoading,
  booking,
  errorMessage = '',
  onClearError = () => {},
}) => {
  const [newChassisNumber, setNewChassisNumber] = useState('');
  const [reason, setReason] = useState('');
  const [availableChassisData, setAvailableChassisData] = useState([]);
  const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
  const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
  const [selectedChassisDetails, setSelectedChassisDetails] = useState(null);
  const [reasonError, setReasonError] = useState(false);

  const branchName = booking?.branch?.name || '';

  // ── Reset on open ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (show && booking) {
      setNewChassisNumber('');
      setReason('');
      setSelectedChassisDetails(null);
      setReasonError(false);
      fetchAvailableChassisNumbers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, booking]);

  // Auto-clear error after 10 seconds
  useEffect(() => {
    if (errorMessage && show) {
      const timer = setTimeout(() => onClearError(), 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, show, onClearError]);

  // Keep selected chassis details in sync
  useEffect(() => {
    if (newChassisNumber && availableChassisData.length > 0) {
      const selected = availableChassisData.find(
        (c) => c.chassisNumber === newChassisNumber
      );
      setSelectedChassisDetails(selected || null);
    } else {
      setSelectedChassisDetails(null);
    }
  }, [newChassisNumber, availableChassisData]);

  // ── Fetch chassis numbers (same inclusion rules as ChassisNumberModal) ────
  const fetchAvailableChassisNumbers = async () => {
    if (!booking || !booking.model || !booking.color) return;

    try {
      setLoadingChassisNumbers(true);
      const response = await axiosInstance.get(
        `/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`
      );
      const availableData = response.data.data.chassisNumbers || [];

      console.log('API Response:', availableData);

      // Get the booking's branch ID (handle branch being object or plain string id)
      const bookingBranchId =
        booking.branch && typeof booking.branch === 'object'
          ? booking.branch?._id
          : booking.branch;
      console.log('Booking Branch ID:', bookingBranchId);

      // Filter chassis numbers.
      //
      // Inclusion rules:
      //   branch    → include IFF location.id === booking branch id
      //   godown    → include IFF location.branch._id === booking branch id
      //   subdealer → ALWAYS EXCLUDE
      //
      const filteredData = availableData.filter((chassis) => {
        const loc = chassis.location;
        if (!loc) return false;

        // Never include subdealer stock
        if (loc.type === 'subdealer') {
          console.log(`Chassis ${chassis.chassisNumber}: skipped (subdealer)`);
          return false;
        }

        const chassisBranchId =
          loc.type === 'branch' ? loc.id : loc.branch?._id; // godown

        const isSameBranch = chassisBranchId === bookingBranchId;

        console.log(`Chassis ${chassis.chassisNumber}:`, {
          locationType: loc.type,
          chassisBranchId,
          bookingBranchId,
          isSameBranch,
        });
        return isSameBranch;
      });

      console.log('Filtered Chassis Numbers (branch + godown only, same branch):', filteredData);

      // Sort oldest first (FIFO)
      const sortedData = [...filteredData].sort((a, b) => b.ageInDays - a.ageInDays);

      setAvailableChassisData(sortedData);
      setAvailableChassisNumbers(sortedData.map((item) => item.chassisNumber));

      // Auto-select the oldest chassis (FIFO) if available
      if (sortedData.length > 0) {
        setNewChassisNumber(sortedData[0].chassisNumber);
      }

      if (filteredData.length === 0) {
        console.warn('No chassis numbers available in the same branch (branch + godown)');
      }
    } catch (error) {
      console.error('Error fetching chassis numbers:', error);
    } finally {
      setLoadingChassisNumbers(false);
    }
  };

  // ── Build react-select options with (Current) / age / location labels ─────
  const chassisOptions = useMemo(() => {
    return availableChassisData.map((chassis) => {
      const isCurrentChassis = booking
        ? chassis.allocatedBooking === booking?._id
        : false;

      let locationText = '';
      let ageText = '';
      let displayText;

      // Godown gets a tag; subdealer never appears
      if (chassis.location?.name) {
        const typeTag = chassis.location.type === 'godown' ? ' [Godown]' : '';
        locationText = ` - ${chassis.location.name}${typeTag}`;
      }

      if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
        const days = chassis.ageInDays;
        ageText = ` (${days} day${days !== 1 ? 's' : ''}${locationText})`;
      } else if (locationText) {
        ageText = locationText;
      }

      if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
        displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
      } else {
        displayText = `${chassis.chassisNumber}${ageText}`;
      }

      if (isCurrentChassis) {
        displayText = `${chassis.chassisNumber} (Current)${ageText}`;
      }

      return {
        value: chassis.chassisNumber,
        label: displayText,
        engineNumber: chassis.engineNumber || 'N/A',
        isCurrent: isCurrentChassis,
      };
    });
  }, [availableChassisData, booking]);

  // Custom styles for react-select (same as allocate modal)
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#80bdff' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
      '&:hover': { borderColor: '#80bdff' },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#007bff'
        : state.isFocused
        ? '#f8f9fa'
        : null,
      color: state.isSelected ? 'white' : '#495057',
      cursor: 'pointer',
      ':active': {
        backgroundColor: state.isSelected ? '#007bff' : '#e9ecef',
      },
    }),
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!newChassisNumber.trim()) return;

    // Don't allow swapping to the same chassis
    if (
      booking?.chassisNumber &&
      newChassisNumber.trim() === booking.chassisNumber
    ) {
      return;
    }

    if (!reason.trim()) {
      setReasonError(true);
      return;
    }
    setReasonError(false);

    onSave({
      newChassisNumber: newChassisNumber.trim(),
      reason: reason.trim(),
    });
  };

  const handleCloseModal = () => {
    setNewChassisNumber('');
    setReason('');
    setSelectedChassisDetails(null);
    setReasonError(false);
    onClose();
  };

  if (!booking) return null;

  const isSameAsCurrent =
    !!booking?.chassisNumber && newChassisNumber.trim() === booking.chassisNumber;

  return (
    <CModal visible={show} onClose={handleCloseModal} alignment="center" size="lg">
      <CModalHeader>
        <h5 className="modal-title mb-0">Swap Vehicle</h5>
      </CModalHeader>

      {/* ── Dynamic error banner (prefers `error` field over generic `message`) ── */}
      {errorMessage && (
        <div className="p-3 border-bottom">
          <CAlert
            color="danger"
            className="mb-0 position-relative d-flex align-items-start"
            style={{ paddingRight: '40px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
          >
            <CIcon icon={cilWarning} className="me-2 mt-1 flex-shrink-0" />
            <span>{errorMessage}</span>
            <CCloseButton
              className="position-absolute"
              style={{ top: '10px', right: '10px' }}
              onClick={onClearError}
            />
          </CAlert>
        </div>
      )}

      <CModalBody>
        <div className="mb-3">
          <CFormLabel>Model: {booking?.model?.model_name || 'N/A'}</CFormLabel>
        </div>
        <div className="mb-3">
          <CFormLabel>Color: {booking?.color?.name || 'N/A'}</CFormLabel>
        </div>
        <div className="mb-3">
          <CFormLabel>Current Chassis: {booking?.chassisNumber || 'N/A'}</CFormLabel>
        </div>

        <div className="mb-3">
          <CFormLabel htmlFor="newChassisNumber">
            New Chassis Number<span className="required">*</span>
          </CFormLabel>

          {!loadingChassisNumbers && availableChassisNumbers.length > 0 && branchName && (
            <div className="mb-2">
              <small className="text-info">
                <CIcon icon={cilLocationPin} className="me-1" />
                Showing chassis numbers from {branchName} branch only
              </small>
            </div>
          )}

          {loadingChassisNumbers ? (
            <div className="text-center">
              <CSpinner size="sm" />
              <span className="ms-2">Loading chassis numbers...</span>
            </div>
          ) : availableChassisNumbers.length > 0 ? (
            <>
              <Select
                id="newChassisNumber"
                name="newChassisNumber"
                placeholder="Search chassis number..."
                value={chassisOptions.find((o) => o.value === newChassisNumber) || null}
                onChange={(selected) => setNewChassisNumber(selected ? selected.value : '')}
                options={chassisOptions}
                styles={selectStyles}
                isClearable
                isSearchable
                noOptionsMessage={() => 'No chassis numbers available'}
                classNamePrefix="react-select"
                className={`react-select-container ${newChassisNumber ? 'valid-input' : ''}`}
              />

              {/* Engine number + location box — same as allocate modal */}
              {selectedChassisDetails && (
                <div className="mt-2 p-2 bg-light border rounded">
                  <div className="d-flex align-items-center">
                    <strong className="me-2">Engine Number:</strong>
                    <span className="text-primary fw-bold">
                      {selectedChassisDetails.engineNumber || 'N/A'}
                    </span>
                  </div>
                  {selectedChassisDetails.location?.name && (
                    <div className="mt-1 small text-muted">
                      Location: {selectedChassisDetails.location.name}
                      {selectedChassisDetails.location?.type === 'godown' ? ' (Godown)' : ''}
                    </div>
                  )}
                </div>
              )}

              {isSameAsCurrent && (
                <div className="text-danger mt-2" style={{ fontSize: '13px' }}>
                  Selected chassis is the same as the current chassis. Please pick a different one.
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-danger mb-2">
                No chassis numbers available for this model and color combination
              </div>
              {branchName && (
                <div className="alert alert-warning mt-2">
                  <CIcon icon={cilWarning} className="me-2" />
                  No chassis numbers available in {branchName} branch for this model and color combination.
                </div>
              )}
            </>
          )}
        </div>

        <div className="mb-3">
          <CFormLabel htmlFor="reason">
            Reason<span className="required">*</span>
          </CFormLabel>
          <CFormTextarea
            id="reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setReasonError(false);
            }}
            rows={3}
            placeholder="e.g. Customer changed color"
          />
          {reasonError && (
            <div className="text-danger mt-1" style={{ fontSize: '14px' }}>
              Please enter reason
            </div>
          )}
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton
          className="submit-button"
          onClick={handleSubmit}
          disabled={
            isLoading ||
            loadingChassisNumbers ||
            availableChassisNumbers.length === 0 ||
            !newChassisNumber.trim() ||
            isSameAsCurrent
          }
        >
          {isLoading ? 'Swapping...' : 'Swap Vehicle'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SwapVehicleModal;