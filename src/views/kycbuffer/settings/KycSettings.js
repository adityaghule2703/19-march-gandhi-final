import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  showError,
  showSuccess,
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
import { Link } from 'react-router-dom';

const KycSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, usersRes] = await Promise.all([
        axiosInstance.get(`/kyc-buffer/settings`),
        axiosInstance.get(`/users`)
      ]);

      setSettings(settingsRes.data.data);

      // Filter only MANAGER role users
      const users = Array.isArray(usersRes.data.data) ? usersRes.data.data : [];
      const managerUsers = users.filter((user) =>
        Array.isArray(user.roles)
          ? user.roles.some(
              (r) =>
                typeof r?.name === 'string' &&
                r.name.trim().toUpperCase() === 'MANAGER'
            )
          : false
      );
      setManagers(managerUsers);
    } catch (error) {
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getManagerName = (id) => {
    const m = managers.find((u) => u._id === id);
    return m ? m.name : id;
  };

  const getManagerEmail = (id) => {
    const m = managers.find((u) => u._id === id);
    return m ? m.email : '';
  };

  const overrides = settings?.managerOverrides || {};
  const overrideEntries = Object.entries(overrides);

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
      <div className='title'>KYC Buffer Settings</div>

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <Link to="/kyc-buffer-master/kyc-settings/update">
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> Update Settings
              </CButton>
            </Link>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Summary Cards Row */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="p-3 border rounded">
                <div className="text-muted small">Default KYC Days</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  {settings?.defaultKYCDays ?? '—'}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border rounded">
                <div className="text-muted small">Status</div>
                <CBadge color={settings?.isActive ? 'success' : 'secondary'}>
                  {settings?.isActive ? 'Active' : 'Inactive'}
                </CBadge>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border rounded">
                <div className="text-muted small">Note</div>
                <div>{settings?.note || <CBadge color="secondary">—</CBadge>}</div>
              </div>
            </div>
          </div>

          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Manager</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Max Days</CTableHeaderCell>
                  <CTableHeaderCell>Reason</CTableHeaderCell>
                  <CTableHeaderCell>Set By</CTableHeaderCell>
                  <CTableHeaderCell>Set At</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {overrideEntries.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      No manager overrides configured
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  overrideEntries.map(([managerId, override], index) => (
                    <CTableRow key={managerId}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{getManagerName(managerId)}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getManagerEmail(managerId) || (
                          <CBadge color="secondary">—</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{override.maxDays} days</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {override.reason || <CBadge color="secondary">—</CBadge>}
                      </CTableDataCell>
                      <CTableDataCell>
                        {override.setBy ? getManagerName(override.setBy) : (
                          <CBadge color="secondary">—</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {override.setAt
                          ? new Date(override.setAt).toLocaleString()
                          : <CBadge color="secondary">—</CBadge>}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default KycSettings;