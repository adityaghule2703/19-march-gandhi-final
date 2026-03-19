import React, { useState, useEffect } from 'react';
import { 
  CBadge, 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CSpinner,
  CFormLabel,
  CAlert
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import UpdateHSRPVahanPortal from './UpdateHSRPVahanPortal';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { showSuccess } from '../../utils/sweetAlerts';

// Import the permission utilities (using RC_CONFIRMATION permissions for now)
import { 
  hasSafePagePermission,
  MODULES, 
  PAGES,
  TABS,
  ACTIONS
} from '../../utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

function HSRPUpdateOnVahanPortal() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions } = useAuth();

  // Using RC_CONFIRMATION permissions for now as requested
  const canViewPage = hasSafePagePermission(
    permissions, 
    MODULES.RTO, 
    PAGES.RTO.RC_CONFIRMATION, 
    ACTIONS.VIEW
  );

  // Tab-level VIEW permission checks (using RC_CONFIRMATION tabs)
  const canViewPendingHSRPTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.VIEW,
    TABS.RC_CONFIRMATION.RTO_PENDING_RC_CONFIRMATION
  );
  
  const canViewCompletedHSRPTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.VIEW,
    TABS.RC_CONFIRMATION.COMPLETED_RC
  );
  
  // Tab-level CREATE permission for PENDING HSRP UPDATE tab (for Update button)
  const canCreateInPendingHSRPTab = hasSafePagePermission(
    permissions,
    MODULES.RTO,
    PAGES.RTO.RC_CONFIRMATION,
    ACTIONS.CREATE,
    TABS.RC_CONFIRMATION.RTO_PENDING_RC_CONFIRMATION
  );
  
  // Check if user can view at least one tab
  const canViewAnyTab = canViewPendingHSRPTab || canViewCompletedHSRPTab;

  // Adjust activeTab when permissions change
  useEffect(() => {
    if (!canViewAnyTab) {
      return;
    }
    
    // If current active tab is hidden due to permissions, find first visible tab
    const visibleTabs = [];
    if (canViewPendingHSRPTab) visibleTabs.push(0);
    if (canViewCompletedHSRPTab) visibleTabs.push(1);
    
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0]);
    }
  }, [canViewAnyTab, canViewPendingHSRPTab, canViewCompletedHSRPTab, activeTab]);

  const {
    data: allHSRPData,
    setData: setAllHSRPData,
    filteredData: filteredHSRPData,
    setFilteredData: setFilteredHSRPData,
    handleFilter: handleHSRPFilter
  } = useTableFilter([]);

  const {
    data: completedData,
    setData: setCompletedData,
    filteredData: filteredCompletedData,
    setFilteredData: setFilteredCompletedData,
    handleFilter: handleCompletedFilter
  } = useTableFilter([]);

  // Derive pending data (records without vahanPortalDate)
  const pendingData = allHSRPData.filter(item => !item.vahanPortalDate);
  const filteredPendingData = filteredHSRPData.filter(item => !item.vahanPortalDate);

  useEffect(() => {
    if (!canViewPage) {
      showError('You do not have permission to view HSRP Update On Vahan Portal');
      setLoading(false);
      return;
    }
    
    fetchHSRPData();
    if (canViewCompletedHSRPTab) {
      fetchCompletedData();
    }
  }, [canViewPage]);

  const fetchHSRPData = async () => {
    if (!canViewPage) {
      return;
    }
    
    try {
      setLoading(true);
      // Using the /rtoProcess/hsrpinstallation API endpoint
      const response = await axiosInstance.get(`/rtoProcess/hsrpinstallation`);
      
      if (response.data && response.data.success) {
        const data = response.data.data || [];
        setAllHSRPData(data);
        setFilteredHSRPData(data);
      } else {
        setAllHSRPData([]);
        setFilteredHSRPData([]);
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedData = async () => {
    if (!canViewPage) {
      return;
    }
    
    try {
      setCompletedLoading(true);
      // Using the /rtoProcess/vahan-completed API endpoint
      const response = await axiosInstance.get(`/rtoProcess/vahan-completed`);
      
      if (response.data && response.data.success) {
        const data = response.data.data || [];
        setCompletedData(data);
        setFilteredCompletedData(data);
      } else {
        setCompletedData([]);
        setFilteredCompletedData([]);
      }
    } catch (error) {
      console.log('Error fetching completed data', error);
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setCompletedLoading(false);
    }
  };

  const handleUpdateClick = (record) => {
    // Check CREATE permission for the PENDING HSRP UPDATE tab
    if (!canCreateInPendingHSRPTab) {
      showError('You do not have permission to update HSRP Vahan Portal date');
      return;
    }
    
    setSelectedBooking(record);
    setShowModal(true);
  };

  const refreshAllData = () => {
    fetchHSRPData();
    fetchCompletedData();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const renderFirstTab = () => {
    // Check if user has permission to view this tab
    if (!canViewPendingHSRPTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view this tab.
          </CAlert>
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Application Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">RTO Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Number Plate</CTableHeaderCell>
              <CTableHeaderCell scope="col">HSRP Installation Status</CTableHeaderCell>
              {canCreateInPendingHSRPTab && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendingData.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={canCreateInPendingHSRPTab ? "11" : "10"} style={{ color: 'red', textAlign: 'center' }}>
                  No pending HSRP updates available (all records have Vahan Portal Date)
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendingData.map((item, index) => (
                <CTableRow key={item._id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.chassisNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.applicationNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.rtoStatus === 'pending' ? 'warning' : 'success'} shape="rounded-pill">
                      {item.rtoStatus || 'N/A'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{item.numberPlate || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.displayStatus?.hsrpInstall === 'Verified' ? 'success' : 'warning'} shape="rounded-pill">
                      {item.displayStatus?.hsrpInstall || 'Pending'}
                    </CBadge>
                  </CTableDataCell>
                  {canCreateInPendingHSRPTab && (
                    <CTableDataCell>
                      <CButton 
                        size="sm" 
                        className="action-btn"
                        onClick={() => handleUpdateClick(item)}
                      >
                        <CIcon icon={cilPencil} className="me-1" />
                        Update
                      </CButton>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  const renderSecondTab = () => {
    // Check if user has permission to view this tab
    if (!canViewCompletedHSRPTab) {
      return (
        <div className="text-center py-4">
          <CAlert color="warning">
            You do not have permission to view this tab.
          </CAlert>
        </div>
      );
    }

    if (completedLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <CSpinner color="primary" />
        </div>
      );
    }

    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Application Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">RTO Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Vahan Portal Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Vahan Status</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Display Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Updated By</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Updated At</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredCompletedData.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="12" style={{ color: 'red', textAlign: 'center' }}>
                  No completed vahan updates available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredCompletedData.map((item, index) => (
                <CTableRow key={item._id || index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.bookingNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.customerMobile || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bookingId?.model?.display_name || item.bookingId?.model?.model_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.applicationNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.rtoStatus === 'pending' ? 'warning' : 'success'} shape="rounded-pill">
                      {item.rtoStatus || 'N/A'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.vahanPortalDate ? new Date(item.vahanPortalDate).toLocaleDateString('en-GB') : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.vahanStatus === 'completed' ? 'success' : 'info'} shape="rounded-pill">
                      {item.vahanStatus || 'N/A'}
                    </CBadge>
                  </CTableDataCell>
                  {/* <CTableDataCell>
                    <div className="d-flex flex-wrap gap-1">
                      {Object.entries(item.displayStatus || {}).map(([key, value]) => (
                        <CBadge key={key} color={value === 'Verified' ? 'success' : 'warning'} size="sm" className="me-1">
                          {key}: {value}
                        </CBadge>
                      ))}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{item.updatedBy || 'N/A'}</CTableDataCell> */}
                  <CTableDataCell>
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB') : 'N/A'}
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  // Check if user has permission to view the page
  if (!canViewPage) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view HSRP Update On Vahan Portal.
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
      <div className='title'>HSRP Update On Vahan Portal</div>
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          {/* Show tabs only if user has permission to view at least one tab */}
          {canViewAnyTab ? (
            <>
              <CNav variant="tabs" className="mb-3 border-bottom">
                {canViewPendingHSRPTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 0}
                      onClick={() => handleTabChange(0)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                        color: 'black',
                        borderBottom: 'none'
                      }}
                    >
                      PENDING HSRP UPDATES ({pendingData.length})
                      {!canCreateInPendingHSRPTab && (
                        <span className="ms-1 text-muted small">(View Only)</span>
                      )}
                    </CNavLink>
                  </CNavItem>
                )}
                {canViewCompletedHSRPTab && (
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 1}
                      onClick={() => handleTabChange(1)}
                      style={{ 
                        cursor: 'pointer',
                        borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
                        borderBottom: 'none',
                        color: 'black'
                      }}
                    >
                      VAHAN COMPLETED ({completedData.length})
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>

              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (activeTab === 0) {
                        handleHSRPFilter(e.target.value, getDefaultSearchFields('rto'));
                      } else {
                        handleCompletedFilter(e.target.value, getDefaultSearchFields('rto'));
                      }
                    }}
                    disabled={!canViewAnyTab}
                  />
                </div>
              </div>

              <CTabContent>
                {canViewPendingHSRPTab && (
                  <CTabPane visible={activeTab === 0}>
                    {renderFirstTab()}
                  </CTabPane>
                )}
                {canViewCompletedHSRPTab && (
                  <CTabPane visible={activeTab === 1}>
                    {renderSecondTab()}
                  </CTabPane>
                )}
              </CTabContent>
            </>
          ) : (
            <CAlert color="warning" className="text-center">
              You don't have permission to view any tabs in HSRP Update On Vahan Portal.
            </CAlert>
          )}
        </CCardBody>
      </CCard>

      <UpdateHSRPVahanPortal
        show={showModal}
        onClose={() => setShowModal(false)}
        record={selectedBooking}
        onUpdateSuccess={refreshAllData}
      />
    </div>
  );
}

export default HSRPUpdateOnVahanPortal;