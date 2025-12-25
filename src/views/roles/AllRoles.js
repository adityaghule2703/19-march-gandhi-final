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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CCol,
  CRow,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilFolder,
  cilLockLocked
} from '@coreui/icons';
import { Link } from 'react-router-dom';
import { CFormLabel } from '@coreui/react';
import {
  getDefaultSearchFields,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import { 
  MODULES, 
  PAGES,
  ACTIONS,
  hasSafePagePermission,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage
} from 'src/utils/modulePermissions';
import { useAuth } from '../../context/AuthContext';

const AllRoles = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { permissions } = useAuth();

  // Page-level permission checks for All Role page under USER_MANAGEMENT module
  const canViewAllRole = canViewPage(
    permissions, 
    MODULES.USER_MANAGEMENT,
    PAGES.ROLES.ALL_ROLE
  );
  
  const canCreateAllRole = canCreateInPage(
    permissions, 
    MODULES.USER_MANAGEMENT,
    PAGES.ROLES.ALL_ROLE
  );

  const canUpdateAllRole = canUpdateInPage(
    permissions, 
    MODULES.USER_MANAGEMENT,
    PAGES.ROLES.ALL_ROLE
  );

  const canDeleteAllRole = canDeleteInPage(
    permissions, 
    MODULES.USER_MANAGEMENT,
    PAGES.ROLES.ALL_ROLE
  );

  const showActionColumn = canUpdateAllRole || canDeleteAllRole;

  useEffect(() => {
    if (!canViewAllRole) {
      showError('You do not have permission to view All Roles');
      return;
    }
    
    fetchData();
  }, [canViewAllRole]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/roles`);
      
      // Check if response has success status and data array
      if (response.data.status === 'success') {
        // Filter out 'ad' role if needed
        const filteredRoles = response.data.data.filter((role) => 
          role.name.toLowerCase() !== 'ad'
        );
        setData(filteredRoles);
        setFilteredData(filteredRoles);
      } else {
        throw new Error('Failed to fetch roles');
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

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    const searchFields = getDefaultSearchFields('roles') || ['name', 'description'];
    const filtered = data.filter(item =>
      searchFields.some(field => {
        const fieldValue = item[field]?.toString().toLowerCase() || '';
        return fieldValue.includes(searchValue.toLowerCase());
      })
    );
    setFilteredData(filtered);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    if (!canDeleteAllRole) {
      showError('You do not have permission to delete roles');
      return;
    }
    
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/roles/${id}`);
        setData(data.filter((role) => role._id !== id));
        setFilteredData(filteredData.filter((role) => role._id !== id));
        showSuccess('Role deleted successfully!');
        fetchData(); // Refresh data
        handleClose();
      } catch (error) {
        showError(error);
      }
    }
  };

  // Updated function to group permissions by module and page
  const groupPermissions = (permissions) => {
    if (!permissions || !permissions.length) return {};
    
    return permissions.reduce((acc, permission) => {
      const module = permission.module || 'Uncategorized';
      const page = permission.page || 'General';
      
      if (!acc[module]) {
        acc[module] = {};
      }
      
      if (!acc[module][page]) {
        acc[module][page] = [];
      }
      
      acc[module][page].push(permission.action);
      return acc;
    }, {});
  };

  // Get unique modules from permissions
  const getModuleCount = (role) => {
    if (!role.permissions || !role.permissions.length) return 0;
    const modules = new Set();
    role.permissions.forEach(permission => {
      if (permission.module) {
        modules.add(permission.module);
      }
    });
    return modules.size;
  };

  // Get page count from permissions
  const getPageCount = (role) => {
    if (!role.permissions || !role.permissions.length) return 0;
    const pages = new Set();
    role.permissions.forEach(permission => {
      if (permission.page) {
        pages.add(`${permission.module}-${permission.page}`);
      }
    });
    return pages.size;
  };

  const showRoleDetails = (role) => {
    setSelectedRole(role);
    setModalVisible(true);
  };

  if (!canViewAllRole) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        You do not have permission to view All Roles.
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
      <div className='title'>All Roles</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {canCreateAllRole && (
              <Link to='/roles/create-role'>
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Role
                </CButton>
              </Link>
            )}
          </div>
          <div className="d-flex align-items-center">
            <CBadge color="primary" className="me-3">
              Total: {data.length}
            </CBadge>
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or description..."
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Role Name</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Modules</CTableHeaderCell>
                  <CTableHeaderCell>Permissions</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((role, index) => {
                    const moduleCount = getModuleCount(role);
                    const permissionCount = role.permissions?.length || 0;
                    const pageCount = getPageCount(role);

                    return (
                      <CTableRow key={role._id} className="table-row">
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>
                          <strong>{role.name}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="description-truncate" title={role.description}>
                            {role.description || '-'}
                          </div>
                        </CTableDataCell>
                        
                        {/* Modules Cell */}
                        <CTableDataCell>
                          <div 
                            className="modules-cell clickable-cell"
                            onClick={() => showRoleDetails(role)}
                          >
                            {moduleCount > 0 ? (
                              <div className="d-flex align-items-center gap-2">
                                <CBadge color="primary" className="module-badge">
                                  <CIcon icon={cilFolder} className="me-1" />
                                  {moduleCount}
                                </CBadge>
                                <span className="modules-text">
                                  {moduleCount === 1 ? 'Module' : 'Modules'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted">No modules</span>
                            )}
                          </div>
                        </CTableDataCell>
                        
                        {/* Permissions Cell */}
                        <CTableDataCell>
                          <div 
                            className="permissions-cell clickable-cell"
                            onClick={() => showRoleDetails(role)}
                          >
                            {permissionCount > 0 ? (
                              <div className="d-flex align-items-center gap-2">
                                <CBadge color="info" className="permission-badge">
                                  <CIcon icon={cilLockLocked} className="me-1" />
                                  {permissionCount}
                                </CBadge>
                                <span className="permissions-text">
                                  {permissionCount === 1 ? 'Permission' : 'Permissions'}
                                </span>
                                <small className="text-muted ms-2">
                                  ({pageCount} pages)
                                </small>
                              </div>
                            ) : (
                              <span className="text-muted">No permissions</span>
                            )}
                          </div>
                        </CTableDataCell>
                        
                        {/* Status Cell */}
                        <CTableDataCell>
                          <CBadge color={role.is_active ? "success" : "danger"}>
                            {role.is_active ? "Active" : "Inactive"}
                          </CBadge>
                        </CTableDataCell>
                        
                        {showActionColumn && (
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                              {canUpdateAllRole && (
                                <Link to={`/roles/update-role/${role._id}`}>
                                  <CButton size="sm" color="primary" variant="outline">
                                    <CIcon icon={cilPencil} />
                                  </CButton>
                                </Link>
                              )}
                              {canDeleteAllRole && (
                                <CButton 
                                  size="sm" 
                                  color="danger" 
                                  variant="outline"
                                  onClick={() => handleDelete(role._id)}
                                  disabled={!canDeleteAllRole}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              )}
                            </div>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    );
                  })
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "7" : "6"} className="text-center">
                      {searchTerm ? 'No matching roles found' : 'No roles available'}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Role Details Modal */}
      <CModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>
            <CIcon icon={cilFolder} className="me-2" />
            Role Details: {selectedRole?.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRole && (
            <div>
              <div className="mb-4">
                <h6>Description</h6>
                <p className="p-2 bg-light rounded">{selectedRole.description || 'No description provided'}</p>
              </div>
              
              <div className="mb-4">
                <h6 className="mb-3">Status & Statistics</h6>
                <CRow>
                  <CCol md={4}>
                    <div className="p-3 bg-light rounded text-center">
                      <h6 className="mb-1">Status</h6>
                      <CBadge color={selectedRole.is_active ? "success" : "danger"}>
                        {selectedRole.is_active ? "Active" : "Inactive"}
                      </CBadge>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="p-3 bg-primary bg-opacity-10 rounded text-center">
                      <h2 className="text-primary">{getModuleCount(selectedRole)}</h2>
                      <p className="mb-0">Total Modules</p>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="p-3 bg-info bg-opacity-10 rounded text-center">
                      <h2 className="text-info">{selectedRole.permissions?.length || 0}</h2>
                      <p className="mb-0">Total Permissions</p>
                    </div>
                  </CCol>
                </CRow>
              </div>
              
              <div className="mb-3">
                <h6>Module Access</h6>
                {selectedRole.moduleAccess && Object.keys(selectedRole.moduleAccess).length > 0 ? (
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {Object.entries(selectedRole.moduleAccess).map(([module, hasAccess], idx) => (
                      <CBadge key={idx} color={hasAccess ? "success" : "secondary"} className="px-3 py-2">
                        <CIcon icon={hasAccess ? cilFolder : cilFolder} className="me-1" />
                        {module}: {hasAccess ? 'Yes' : 'No'}
                      </CBadge>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light text-center mb-3">
                    No module access configured
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <h6>Detailed Permissions by Module & Page</h6>
                {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                  <div className="permissions-details">
                    {Object.entries(groupPermissions(selectedRole.permissions)).map(([module, pages], idx) => (
                      <div key={idx} className="permission-module mb-3 p-3 border rounded">
                        <div className="d-flex align-items-center mb-2">
                          <CBadge color="primary" className="me-2 px-3 py-2">
                            <CIcon icon={cilFolder} className="me-2" />
                            {module}
                          </CBadge>
                          <span className="text-muted small">
                            ({Object.keys(pages).length} {Object.keys(pages).length === 1 ? 'page' : 'pages'})
                          </span>
                        </div>
                        
                        {Object.entries(pages).map(([page, actions], pageIdx) => (
                          <div key={pageIdx} className="mb-2 p-2 bg-light rounded">
                            <div className="d-flex align-items-center mb-1">
                              <strong className="text-dark">{page}</strong>
                              <span className="text-muted small ms-2">
                                ({actions.length} {actions.length === 1 ? 'permission' : 'permissions'})
                              </span>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              {actions.map((action, actionIdx) => (
                                <CBadge key={actionIdx} color="success" className="px-3 py-2">
                                  <CIcon icon={cilLockLocked} className="me-1" />
                                  {action}
                                </CBadge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light text-center">
                    No permissions assigned to this role
                  </div>
                )}
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <style jsx>{`
        .description-truncate {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .module-badge, .permission-badge {
          font-size: 0.8rem;
          padding: 0.4rem 0.7rem;
          display: flex;
          align-items: center;
          min-width: 40px;
          justify-content: center;
        }
        
        .clickable-cell {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .clickable-cell:hover {
          background-color: rgba(0, 123, 255, 0.05);
          transform: translateY(-1px);
        }
        
        .modules-cell, .permissions-cell {
          height: 100%;
          display: flex;
          align-items: center;
        }
        
        .table-row td {
          vertical-align: middle;
          height: 60px;
        }
        
        .modules-text, .permissions-text {
          font-size: 0.9rem;
          color: #495057;
        }
        
        .permissions-details {
          max-height: 400px;
          overflow-y: auto;
          margin-top: 10px;
        }
        
        .permission-module {
          background-color: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .permission-module:hover {
          background-color: #e9ecef;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default AllRoles;