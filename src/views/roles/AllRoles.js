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
  CAlert,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilFolder,
  cilLockLocked,
  cilCheck,
  cilX
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

  // Get unique modules from moduleAccess (only modules with access = true)
  const getModuleCount = (role) => {
    if (!role.moduleAccess) return 0;
    return Object.values(role.moduleAccess).filter(hasAccess => hasAccess === true).length;
  };

  // Get page count from pageAccess
  const getPageCount = (role) => {
    if (!role.pageAccess) return 0;
    let count = 0;
    Object.values(role.pageAccess).forEach(modulePages => {
      count += Object.keys(modulePages).length;
    });
    return count;
  };

  // Get total permissions count
  const getTotalPermissionsCount = (role) => {
    if (role.permissionsCount) return role.permissionsCount;
    if (role.permissions) return role.permissions.length;
    return 0;
  };

  const showRoleDetails = (role) => {
    setSelectedRole(role);
    setModalVisible(true);
  };

  // Format module name for display
  const formatModuleName = (moduleName) => {
    return moduleName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Render module access in a readable format
  const renderModuleAccess = (role) => {
    if (!role.moduleAccess) return <span className="text-muted">No module access</span>;
    
    const modulesWithAccess = Object.entries(role.moduleAccess)
      .filter(([_, hasAccess]) => hasAccess === true)
      .map(([module]) => module);
    
    if (modulesWithAccess.length === 0) {
      return <span className="text-muted">No modules with access</span>;
    }
    
    return (
      <div className="d-flex flex-wrap gap-1">
        {modulesWithAccess.slice(0, 3).map((module, idx) => (
          <CBadge key={idx} color="primary" className="px-2 py-1">
            {formatModuleName(module)}
          </CBadge>
        ))}
        {modulesWithAccess.length > 3 && (
          <CBadge color="secondary" className="px-2 py-1">
            +{modulesWithAccess.length - 3} more
          </CBadge>
        )}
      </div>
    );
  };

  // Render page access summary
  const renderPageAccessSummary = (role) => {
    if (!role.pageAccess) return <span className="text-muted">No page access</span>;
    
    let totalPages = 0;
    Object.values(role.pageAccess).forEach(modulePages => {
      totalPages += Object.keys(modulePages).length;
    });
    
    return `${totalPages} page${totalPages !== 1 ? 's' : ''}`;
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
                  <CTableHeaderCell>Pages</CTableHeaderCell>
                  <CTableHeaderCell>Permissions</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((role, index) => {
                    const moduleCount = getModuleCount(role);
                    const pageCount = getPageCount(role);
                    const totalPermissions = getTotalPermissionsCount(role);

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
                                <div className="modules-summary">
                                  {renderModuleAccess(role)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">No modules</span>
                            )}
                          </div>
                        </CTableDataCell>
                        
                        {/* Pages Cell */}
                        <CTableDataCell>
                          <div 
                            className="permissions-cell clickable-cell"
                            onClick={() => showRoleDetails(role)}
                          >
                            {pageCount > 0 ? (
                              <div className="d-flex align-items-center gap-2">
                                <CBadge color="info" className="permission-badge">
                                  <CIcon icon={cilLockLocked} className="me-1" />
                                  {pageCount}
                                </CBadge>
                                <span className="permissions-text">
                                  {renderPageAccessSummary(role)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted">No pages</span>
                            )}
                          </div>
                        </CTableDataCell>
                        
                        {/* Permissions Cell */}
                        <CTableDataCell>
                          <div className="text-center">
                            <CBadge color="success" className="permission-badge">
                              {totalPermissions}
                            </CBadge>
                            <div className="small text-muted mt-1">
                              permissions
                            </div>
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
                    <CTableDataCell colSpan={showActionColumn ? "8" : "7"} className="text-center">
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
        scrollable
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
                  <CCol md={3}>
                    <div className="p-3 bg-light rounded text-center">
                      <h6 className="mb-1">Status</h6>
                      <CBadge color={selectedRole.is_active ? "success" : "danger"}>
                        {selectedRole.is_active ? "Active" : "Inactive"}
                      </CBadge>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="p-3 bg-primary bg-opacity-10 rounded text-center">
                      <h2 className="text-primary">{getModuleCount(selectedRole)}</h2>
                      <p className="mb-0">Active Modules</p>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="p-3 bg-info bg-opacity-10 rounded text-center">
                      <h2 className="text-info">{getPageCount(selectedRole)}</h2>
                      <p className="mb-0">Total Pages</p>
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="p-3 bg-success bg-opacity-10 rounded text-center">
                      <h2 className="text-success">{getTotalPermissionsCount(selectedRole)}</h2>
                      <p className="mb-0">Total Permissions</p>
                    </div>
                  </CCol>
                </CRow>
              </div>
              
              <div className="mb-3">
                <h6>Module Access</h6>
                {selectedRole.moduleAccess ? (
                  <div className="table-responsive">
                    <CTable bordered hover size="sm" className="mb-0">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Module</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Access</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {Object.entries(selectedRole.moduleAccess).map(([module, hasAccess], idx) => (
                          <CTableRow key={idx}>
                            <CTableDataCell>
                              <strong>{formatModuleName(module)}</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {hasAccess ? (
                                <CBadge color="success">
                                  <CIcon icon={cilCheck} className="me-1" />
                                  Granted
                                </CBadge>
                              ) : (
                                <CBadge color="secondary">
                                  <CIcon icon={cilX} className="me-1" />
                                  Denied
                                </CBadge>
                              )}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                ) : (
                  <div className="alert alert-light text-center mb-3">
                    No module access configured
                  </div>
                )}
              </div>
              
              {/* Page Access Details */}
              {selectedRole.pageAccess && Object.keys(selectedRole.pageAccess).length > 0 && (
                <div className="mb-3">
                  <h6 className="mb-3">Page Access Details</h6>
                  <CAccordion>
                    {Object.entries(selectedRole.pageAccess).map(([module, pages], moduleIdx) => (
                      <CAccordionItem key={moduleIdx} itemKey={moduleIdx.toString()}>
                        <CAccordionHeader>
                          <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                            <div>
                              <strong>{formatModuleName(module)}</strong>
                              <span className="text-muted small ms-2">
                                ({Object.keys(pages).length} page{Object.keys(pages).length !== 1 ? 's' : ''})
                              </span>
                            </div>
                          </div>
                        </CAccordionHeader>
                        <CAccordionBody>
                          <div className="table-responsive">
                            <CTable bordered hover size="sm" className="mb-0">
                              <CTableHead>
                                <CTableRow>
                                  <CTableHeaderCell>Page</CTableHeaderCell>
                                  <CTableHeaderCell>Permissions</CTableHeaderCell>
                                  <CTableHeaderCell>Tab Permissions</CTableHeaderCell>
                                </CTableRow>
                              </CTableHead>
                              <CTableBody>
                                {Object.entries(pages).map(([page, pagePerms], pageIdx) => {
                                  const tabAccess = selectedRole.tabAccess?.[module]?.[page];
                                  const hasTabPermissions = tabAccess && Object.keys(tabAccess).length > 0;
                                  
                                  return (
                                    <CTableRow key={pageIdx}>
                                      <CTableDataCell>
                                        <strong>{page}</strong>
                                      </CTableDataCell>
                                      <CTableDataCell>
                                        <div className="d-flex flex-wrap gap-1">
                                          {pagePerms.map((perm, permIdx) => (
                                            <CBadge key={permIdx} color="success" className="px-2 py-1">
                                              {perm}
                                            </CBadge>
                                          ))}
                                        </div>
                                      </CTableDataCell>
                                      <CTableDataCell>
                                        {hasTabPermissions ? (
                                          <div className="small">
                                            {Object.keys(tabAccess).map((tab, tabIdx) => (
                                              <div key={tabIdx} className="mb-1">
                                                <div className="fw-bold">{tab}:</div>
                                                <div className="d-flex flex-wrap gap-1">
                                                  {tabAccess[tab].map((perm, permIdx) => (
                                                    <CBadge key={permIdx} color="info" className="px-2 py-1">
                                                      {perm}
                                                    </CBadge>
                                                  ))}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-muted small">No tab permissions</span>
                                        )}
                                      </CTableDataCell>
                                    </CTableRow>
                                  );
                                })}
                              </CTableBody>
                            </CTable>
                          </div>
                        </CAccordionBody>
                      </CAccordionItem>
                    ))}
                  </CAccordion>
                </div>
              )}
              
              {/* All Permissions List */}
              {selectedRole.permissions && selectedRole.permissions.length > 0 && (
                <div className="mb-3">
                  <h6>All Permissions List</h6>
                  <div className="alert alert-info">
                    <strong>Note:</strong> This shows all individual permission entries. 
                    {selectedRole.permissionsCount && (
                      <span> Total: {selectedRole.permissionsCount} permissions</span>
                    )}
                  </div>
                  <div className="table-responsive">
                    <CTable bordered hover size="sm" className="mb-0">
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Module</CTableHeaderCell>
                          <CTableHeaderCell>Page</CTableHeaderCell>
                          <CTableHeaderCell>Tab</CTableHeaderCell>
                          <CTableHeaderCell>Action</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {selectedRole.permissions.slice(0, 50).map((perm, idx) => (
                          <CTableRow key={idx}>
                            <CTableDataCell>{idx + 1}</CTableDataCell>
                            <CTableDataCell>{formatModuleName(perm.module)}</CTableDataCell>
                            <CTableDataCell>{perm.page}</CTableDataCell>
                            <CTableDataCell>{perm.tab || '-'}</CTableDataCell>
                            <CTableDataCell>
                              <CBadge color="success">{perm.action}</CBadge>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                        {selectedRole.permissions.length > 50 && (
                          <CTableRow>
                            <CTableDataCell colSpan="5" className="text-center">
                              <CBadge color="secondary">
                                ... and {selectedRole.permissions.length - 50} more permissions
                              </CBadge>
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </div>
                </div>
              )}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          {canUpdateAllRole && selectedRole && (
            <Link to={`/roles/update-role/${selectedRole._id}`}>
              <CButton color="primary">
                <CIcon icon={cilPencil} className="me-1" />
                Edit Role
              </CButton>
            </Link>
          )}
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
        
        .modules-summary {
          flex: 1;
          min-width: 0;
        }
        
        .modules-summary .badge {
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default AllRoles;