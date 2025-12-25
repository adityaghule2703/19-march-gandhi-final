import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilLocationPin,
  cilGlobeAlt,
  cilDollar
} from '@coreui/icons';
import { Link } from 'react-router-dom';
import { CFormLabel } from '@coreui/react';
import {
  React as ReactHook,
  useState as useStateHook,
  useEffect as useEffectHook,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import { useAuth } from '../../context/AuthContext';
import { 
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  MODULES,
  PAGES 
} from '../../utils/modulePermissions';

const SubdealerList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions } = useAuth();
  
  // Page-level permission checks for Subdealer List page under Subdealer Master module
  const canViewSubdealer = canViewPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  const canCreateSubdealer = canCreateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  const canUpdateSubdealer = canUpdateInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  const canDeleteSubdealer = canDeleteInPage(permissions, MODULES.SUBDEALER_MASTER, PAGES.SUBDEALER_MASTER.SUBDEALER_LIST);
  
  const showActionColumn = canUpdateSubdealer || canDeleteSubdealer;

  useEffect(() => {
    if (!canViewSubdealer) {
      showError('You do not have permission to view Subdealer List');
      return;
    }
    
    fetchData();
  }, [canViewSubdealer]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/subdealers`);
      const subdealers = response.data.data?.subdealers || [];
      setData(subdealers);
      setFilteredData(subdealers);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchValue) => {
    // Update search fields to include new structure
    const searchFields = ['name', 'type', 'branchDetails.name'];
    handleFilter(searchValue, searchFields);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleToggleActive = async (subdealerId, currentStatus) => {
    if (!canUpdateSubdealer) {
      showError('You do not have permission to update subdealer status');
      return;
    }
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await axiosInstance.patch(`/subdealers/${subdealerId}/status`, {
        status: newStatus
      });
      setData((prevData) => prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []);
      setFilteredData((prevData) =>
        prevData?.map((subdealer) => (subdealer._id === subdealerId ? { ...subdealer, status: newStatus } : subdealer)) || []
      );
      showSuccess('Subdealer status updated successfully!');
      handleClose();
    } catch (error) {
      console.error('Error toggling subdealer status:', error);
      showError('Failed to update subdealer status');
    }
  };

  const handleDelete = async (id) => {
    if (!canDeleteSubdealer) {
      showError('You do not have permission to delete subdealer');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/subdealers/${id}`);
        setData(data?.filter((subdealer) => subdealer._id !== id) || []);
        setFilteredData(filteredData?.filter((subdealer) => subdealer._id !== id) || []);
        showSuccess('Subdealer deleted successfully!');
        handleClose();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  // Helper function to get location display
  const getLocationDisplay = (subdealer) => {
    if (subdealer.latLong?.address) {
      return subdealer.latLong.address;
    } else if (subdealer.location) {
      return subdealer.location; // Fallback for old data
    }
    return 'N/A';
  };

  // Helper function to get coordinates display
  const getCoordinatesDisplay = (subdealer) => {
    if (subdealer.latLong?.coordinates && subdealer.latLong.coordinates.length === 2) {
      return `(${subdealer.latLong.coordinates[1]}, ${subdealer.latLong.coordinates[0]})`;
    }
    return 'N/A';
  };

  if (!canViewSubdealer) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view Subdealer List.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
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
      <div className='title'>Subdealer List</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateSubdealer && (
              <Link to='/add-subdealer'>
                <CButton size="sm" className="action-btn me-1" disabled={!canCreateSubdealer}>
                  <CIcon icon={cilPlus} className='icon'/> New Subdealer
                </CButton>
              </Link>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                disabled={!canViewSubdealer}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Address</CTableHeaderCell>
                  <CTableHeaderCell>Coordinates</CTableHeaderCell>
                  <CTableHeaderCell>Rate Of Interest (%)</CTableHeaderCell>
                  <CTableHeaderCell>Discount (%)</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((subdealer, index) => (
                    <CTableRow key={subdealer?._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{subdealer?.name || ''}</CTableDataCell>
                      <CTableDataCell>{subdealer?.branchDetails?.name || ''}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilLocationPin} className="me-1" />
                          {getLocationDisplay(subdealer)}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                        
                          {getCoordinatesDisplay(subdealer)}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          
                          {subdealer?.rateOfInterest ? `${subdealer.rateOfInterest}%` : '0%'}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {subdealer?.discount ? `${subdealer.discount}%` : '0%'}
                      </CTableDataCell>
                      <CTableDataCell>{subdealer?.type || ''}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={subdealer?.status === 'active' ? 'success' : 'secondary'}>
                          {subdealer?.status === 'active' ? (
                            <>
                              <CIcon icon={cilCheckCircle} className="me-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilXCircle} className="me-1" />
                              Inactive
                            </>
                          )}
                        </CBadge>
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, subdealer?._id)}
                            disabled={!canUpdateSubdealer && !canDeleteSubdealer}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${subdealer?._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === subdealer?._id} 
                            onClose={handleClose}
                          >
                            {canUpdateSubdealer && (
                              <Link className="Link" to={`/update-subdealer/${subdealer?._id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />Edit
                                </MenuItem>
                              </Link>
                            )}
                            {canUpdateSubdealer && (
                              <MenuItem onClick={() => handleToggleActive(subdealer?._id, subdealer?.status)}>
                                <CIcon icon={subdealer?.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
                                {subdealer?.status === 'active' ? 'Deactivate' : 'Activate'}
                              </MenuItem>
                            )}
                            {canDeleteSubdealer && (
                              <MenuItem onClick={() => handleDelete(subdealer?._id)}>
                                <CIcon icon={cilTrash} className="me-2" />Delete
                              </MenuItem>
                            )}
                          </Menu>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "11" : "10"} className="text-center">
                      No subdealers available
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default SubdealerList;