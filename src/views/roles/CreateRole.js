import React, { useState, useEffect } from 'react';
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CFormCheck,
  CButtonGroup,
  CFormSwitch,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CSpinner,
  CAlert,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilListRich, cilUser, cilCheck, cilX } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
import axiosInstance from 'src/axiosInstance';
import FormButtons from 'src/utils/FormButtons';
import '../../css/form.css';
import '../../css/table.css';
import { showError } from '../../utils/sweetAlerts';

// Complete sidebar structure with all pages
const sidebarStructure = {
  "Dashboard": {
    pages: ["Dashboard"],
    availablePermissions: ["VIEW"]
  },
  "Purchase": {
    pages: ["Inward Stock", "Stock Verification", "Stock Transfer", "Upload Challan", "RTO Chassis"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Sales": {
    pages: ["New Booking", "All Booking", "Self Insurance", "Delivery Challan", "GST Invoice", "Helmet Invoice", "Deal Form", "Upload Deal Form & Delivery Challan"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Sales Report": {
    pages: ["Sales Person Wise", "Periodic Report"],
    availablePermissions: ["VIEW"]
  },
  "Quotation": {
    pages: ["Quotation"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Account": {
    pages: ["Dashboard", "Receipts", "Debit Note", "Refund", "Cancelled Booking", "All Receipts", "Ledgers", "Exchange Ledger", "Broker Payment Verification", "Report"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Insurance": {
    pages: ["Dashboard", "Insurance Details"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "RTO": {
    pages: ["Dashboard", "Application", "RTO Paper", "RTO Tax", "HSRP Ordering", "HSRP Installation", "RC Confirmation", "Report"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Fund Management": {
    pages: ["Cash Voucher", "Contra Voucher", "Contra Approval", "Workshop Cash Receipt", "All Cash Receipt", "Cash Book", "Day Book", "Report"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Masters": {
    pages: ["Location", "Headers", "Vehicles", "Minimum Booking Amount", "Template List", "Accessories", "Colour", "Documents", "Terms & Conditions", "Offer", "Attachments", "Declaration", "RTO", "Financer", "Finance Rates", "Insurance Providers", "Brokers", "Broker Commission Range", "Vertical Masters"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Fund Master": {
    pages: ["Cash Account Master", "Bank Account Master", "Payment Mode", "Expense Master", "Add Opening Balance"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Accessories Billing": {
    pages: ["Accessories Billing"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Customers": {
    pages: ["Customers"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer": {
    pages: ["Subdealer Stock Audit"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer Master": {
    pages: ["Subdealer List", "Subdealer Audit List", "Subdealer Commission", "Calculate Commission"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer Booking": {
    pages: ["New Booking", "All Booking", "Delivery Challan"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer Account": {
    pages: ["Add Balance", "OnAccount Balance", "Add Amount", "Finance Payment", "Payment Verification", "Subdealer Commission", "Payment Summary", "Subdealer Ledger", "Customer Ledger", "Summary"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "User Management": {
    pages: ["Create Role", "All Role", "Add User", "User List", "Buffer Report", "Manager Deviation"],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  }
};

// Map sidebar module names to API module names
const moduleNameMap = {
  "Dashboard": "DASHBOARD",
  "Purchase": "PURCHASE",
  "Sales": "SALES",
  "Sales Report": "SALES_REPORT",
  "Quotation": "QUOTATION",
  "Account": "ACCOUNT",
  "Insurance": "INSURANCE",
  "RTO": "RTO",
  "Fund Management": "FUND_MANAGEMENT",
  "Masters": "MASTERS",
  "Fund Master": "FUND_MASTER",
  "Accessories Billing": "ACCESSORIES_BILLING",
  "Customers": "CUSTOMERS",
  "Subdealer": "SUBDEALER",
  "Subdealer Master": "SUBDEALER_MASTER",
  "Subdealer Booking": "SUBDEALER_BOOKING",
  "Subdealer Account": "SUBDEALER_ACCOUNT",
  "User Management": "USER_MANAGEMENT"
};

const CreateRoleWithHierarchy = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeModule, setActiveModule] = useState(null);
  const [pagePermissions, setPagePermissions] = useState({});
  const [mainHeaderAccess, setMainHeaderAccess] = useState({});
  const [permissionsList, setPermissionsList] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (permissionsList.length > 0) {
      if (id) {
        fetchRole(id);
      } else {
        initializeEmptyPermissions();
        setLoading(false);
      }
    }
  }, [id, permissionsList]);

  const fetchPermissions = async () => {
    try {
      setPermissionsLoading(true);
      const res = await axiosInstance.get('/roles/permissions');
      setPermissionsList(res.data.data || []);
      setPermissionsLoading(false);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setError('Failed to fetch permissions. Please try again.');
      setPermissionsLoading(false);
    }
  };

  const initializeEmptyPermissions = () => {
    const initialMainHeaderAccess = {};
    const initialPagePermissions = {};

    Object.keys(sidebarStructure).forEach(mainHeader => {
      initialMainHeaderAccess[mainHeader] = false;
      
      const headerPages = sidebarStructure[mainHeader].pages;
      headerPages.forEach(page => {
        const pageKey = `${mainHeader}_${page}`;
        const pagePerms = {};
        
        // Check what permissions are available in the API for this page
        const apiModuleName = moduleNameMap[mainHeader];
        const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
        
        availablePermissions.forEach(permType => {
          // Check if this permission exists in the API
          const hasPermissionInAPI = permissionsList.some(perm => 
            perm.module === apiModuleName && 
            perm.page === page && 
            perm.action === permType.toUpperCase()
          );
          
          pagePerms[permType] = false; // Initialize as false
        });
        
        initialPagePermissions[pageKey] = pagePerms;
      });
    });

    setMainHeaderAccess(initialMainHeaderAccess);
    setPagePermissions(initialPagePermissions);
  };

  const fetchRole = async (roleId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/roles/${roleId}`);
      const roleData = res.data.data;

      // Set form data
      setFormData({
        name: roleData.name || '',
        description: roleData.description || '',
        is_active: roleData.is_active !== undefined ? roleData.is_active : true
      });

      // Initialize main header access and page permissions from API data
      const initialMainHeaderAccess = {};
      const initialPagePermissions = {};

      // First, set all to false
      Object.keys(sidebarStructure).forEach(mainHeader => {
        initialMainHeaderAccess[mainHeader] = false;
        
        const headerPages = sidebarStructure[mainHeader].pages;
        headerPages.forEach(page => {
          const pageKey = `${mainHeader}_${page}`;
          const pagePerms = {};
          sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
            pagePerms[permType] = false;
          });
          initialPagePermissions[pageKey] = pagePerms;
        });
      });

      // Now populate with API data
      if (roleData.moduleAccess) {
        Object.keys(roleData.moduleAccess).forEach(module => {
          if (sidebarStructure[module]) {
            initialMainHeaderAccess[module] = roleData.moduleAccess[module];
          }
        });
      }

      if (roleData.pageAccess) {
        Object.keys(roleData.pageAccess).forEach(module => {
          if (sidebarStructure[module] && roleData.pageAccess[module]) {
            Object.keys(roleData.pageAccess[module]).forEach(page => {
              const pageKey = `${module}_${page}`;
              const permissionsArray = roleData.pageAccess[module][page];
              
              if (initialPagePermissions[pageKey]) {
                sidebarStructure[module].availablePermissions.forEach(permType => {
                  initialPagePermissions[pageKey][permType] = 
                    permissionsArray.includes(permType.toUpperCase());
                });
              }
            });
          }
        });
      }

      setMainHeaderAccess(initialMainHeaderAccess);
      setPagePermissions(initialPagePermissions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching role:', error);
      setError('Failed to fetch role data. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
    setMainHeaderAccess(prev => ({
      ...prev,
      [mainHeader]: hasAccess
    }));

    // If access is removed, clear all permissions for pages in this header
    if (!hasAccess) {
      const newPagePermissions = { ...pagePermissions };
      sidebarStructure[mainHeader].pages.forEach(page => {
        const pageKey = `${mainHeader}_${page}`;
        const perms = {};
        sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
          perms[perm] = false;
        });
        newPagePermissions[pageKey] = perms;
      });
      setPagePermissions(newPagePermissions);
    }
  };

  const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
    const pageKey = `${mainHeader}_${page}`;
    setPagePermissions(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [permissionType]: value
      }
    }));
  };

  const handleSelectAllPagePermissions = (mainHeader, page) => {
    const pageKey = `${mainHeader}_${page}`;
    const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
    
    setPagePermissions(prev => ({
      ...prev,
      [pageKey]: availablePermissions.reduce((acc, perm) => {
        acc[perm] = true;
        return acc;
      }, {})
    }));
  };

  const handleClearAllPagePermissions = (mainHeader, page) => {
    const pageKey = `${mainHeader}_${page}`;
    setPagePermissions(prev => ({
      ...prev,
      [pageKey]: sidebarStructure[mainHeader].availablePermissions.reduce((acc, perm) => {
        acc[perm] = false;
        return acc;
      }, {})
    }));
  };

  const validate = () => {
    const { name } = formData;
    const errs = {};

    if (!name.trim()) errs.name = 'Role name is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generatePayload = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      is_active: formData.is_active,
      moduleAccess: { ...mainHeaderAccess },
      pageAccess: {}
    };

    // Build pageAccess structure
    Object.keys(sidebarStructure).forEach(mainHeader => {
      if (mainHeaderAccess[mainHeader]) {
        const pageAccessForModule = {};
        
        sidebarStructure[mainHeader].pages.forEach(page => {
          const pageKey = `${mainHeader}_${page}`;
          const pagePerms = pagePermissions[pageKey] || {};
          
          // Convert boolean permissions to array of permission strings
          const permissionsArray = [];
          sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
            if (pagePerms[permType]) {
              permissionsArray.push(permType.toUpperCase());
            }
          });
          
          if (permissionsArray.length > 0) {
            pageAccessForModule[page] = permissionsArray;
          }
        });
        
        if (Object.keys(pageAccessForModule).length > 0) {
          payload.pageAccess[mainHeader] = pageAccessForModule;
        }
      }
    });

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = generatePayload();
    
    try {
      if (id) {
        await axiosInstance.put(`/roles/${id}`, payload);
        await showFormSubmitToast('Role updated successfully!', () => navigate('/roles/all-role'));
      } else {
        await axiosInstance.post('/roles', payload);
        await showFormSubmitToast('Role created successfully!', () => navigate('/roles/all-role'));
      }
    } catch (error) {
      console.error('Role save error:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => navigate('/roles/all-role');

  const checkPermissionExists = (mainHeader, page, permissionType) => {
    const apiModuleName = moduleNameMap[mainHeader];
    if (!apiModuleName) return false;
    
    return permissionsList.some(perm => 
      perm.module === apiModuleName && 
      perm.page === page && 
      perm.action === permissionType.toUpperCase()
    );
  };

  if (permissionsLoading || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-4">
        <CAlert color="danger">{error}</CAlert>
      </div>
    );
  }

  return (
    <div className='form-container'>
      <div className='title'>{id ? 'Edit' : 'Add'} Role</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            {/* ------------ Details block ------------- */}
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Role Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Enter role name" 
                  />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="input-box">
                <span className="details">Description</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilListRich} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter role description"
                  />
                </CInputGroup>
              </div>

              <div className="input-box">
                <span className="details">Active Status</span>
                <CFormSwitch
                  label={formData.is_active ? 'Active' : 'Inactive'}
                  checked={formData.is_active}
                  onChange={() => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))}
                  style={{ height: '20px' }}
                />
              </div>
            </div>

            {/* ------------ Permissions Section ------------- */}
            <div className="permissions-container mt-4">
              <h5 className="mb-3">Permissions Configuration</h5>
              <p className="text-muted mb-4">
                Total permissions available: {permissionsList.length}
              </p>
              
              <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
                {Object.keys(sidebarStructure).map((mainHeader) => {
                  const hasAccess = mainHeaderAccess[mainHeader] || false;
                  const pageCount = sidebarStructure[mainHeader].pages.length;
                  const availablePerms = sidebarStructure[mainHeader].availablePermissions;

                  return (
                    <CAccordionItem key={mainHeader} itemKey={mainHeader}>
                      <CAccordionHeader>
                        <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                          <div>
                            <h6 className="mb-0">{mainHeader}</h6>
                            <small className="text-muted">{pageCount} pages</small>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
                              {hasAccess ? 'Access Granted' : 'No Access'}
                            </CBadge>
                            <CButtonGroup size="sm">
                              <CButton 
                                color={hasAccess ? "success" : "secondary"} 
                                variant={hasAccess ? "outline" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMainHeaderAccessChange(mainHeader, true);
                                }}
                              >
                                <CIcon icon={cilCheck} /> Yes
                              </CButton>
                              <CButton 
                                color={!hasAccess ? "danger" : "secondary"} 
                                variant={!hasAccess ? "outline" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMainHeaderAccessChange(mainHeader, false);
                                }}
                              >
                                <CIcon icon={cilX} /> No
                              </CButton>
                            </CButtonGroup>
                          </div>
                        </div>
                      </CAccordionHeader>
                      <CAccordionBody>
                        {hasAccess ? (
                          <div className="pages-permissions">
                            <div className="table-responsive">
                              <CTable bordered responsive hover small className="permission-table">
                                <CTableHead color="light">
                                  <CTableRow>
                                    <CTableHeaderCell scope="col">Page</CTableHeaderCell>
                                    {availablePerms.map((perm) => (
                                      <CTableHeaderCell key={perm} scope="col" className="text-center">
                                        {perm}
                                      </CTableHeaderCell>
                                    ))}
                                    <CTableHeaderCell scope="col" className="text-center">Actions</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                  {sidebarStructure[mainHeader].pages.map((page) => {
                                    const pageKey = `${mainHeader}_${page}`;
                                    const pagePerms = pagePermissions[pageKey] || {};

                                    return (
                                      <CTableRow key={pageKey}>
                                        <CTableHeaderCell scope="row">
                                          {page}
                                        </CTableHeaderCell>
                                        {availablePerms.map((perm) => {
                                          const permissionExists = checkPermissionExists(mainHeader, page, perm);
                                          const isChecked = pagePerms[perm] || false;
                                          
                                          return (
                                            <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
                                              {permissionExists ? (
                                                <CFormCheck
                                                  type="checkbox"
                                                  checked={isChecked}
                                                  onChange={(e) => handlePagePermissionChange(mainHeader, page, perm, e.target.checked)}
                                                  aria-label={`${page}-${perm}`}
                                                />
                                              ) : (
                                                <span className="text-muted" title="Permission not available in system">
                                                  N/A
                                                </span>
                                              )}
                                            </CTableDataCell>
                                          );
                                        })}
                                        <CTableDataCell className="text-center">
                                          <CButtonGroup size="sm">
                                            <CButton 
                                              color="primary" 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => handleSelectAllPagePermissions(mainHeader, page)}
                                              title="Select all available permissions"
                                            >
                                              All
                                            </CButton>
                                            <CButton 
                                              color="secondary" 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => handleClearAllPagePermissions(mainHeader, page)}
                                              title="Clear all permissions"
                                            >
                                              None
                                            </CButton>
                                          </CButtonGroup>
                                        </CTableDataCell>
                                      </CTableRow>
                                    );
                                  })}
                                </CTableBody>
                              </CTable>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
                            <p className="text-muted mb-0">No access granted for {mainHeader}</p>
                            <small>Click "Yes" to grant access and configure permissions</small>
                          </div>
                        )}
                      </CAccordionBody>
                    </CAccordionItem>
                  );
                })}
              </CAccordion>
            </div>

            {/* ------------ Buttons ------------- */}
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleWithHierarchy;