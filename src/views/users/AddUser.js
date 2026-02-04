// import React, { useState, useEffect, useContext } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CCard,
//   CCardBody,
//   CCollapse
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../../context/AuthContext';

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete",
//   "READ": "View",
//   "WRITE": "Edit"
// };

// // Tab permission label mapping (only show "Access" instead of "VIEW" for tabs)
// const tabPermissionLabelMap = {
//   "VIEW": "Access",
//   "CREATE": "Create",
//   "UPDATE": "Update", 
//   "DELETE": "Delete"
// };

// // Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
// const sidebarStructure = {
//   "Dashboard": {
//     pages: [{
//       name: "Dashboard",
//       tabs: null
//     }],
//     availablePermissions: ["VIEW"]
//   },
//   "Purchase": {
//     pages: [
//       { name: "Inward Stock", tabs: null },
//       { 
//         name: "Stock Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
//       },
//       { name: "Stock Transfer", tabs: null },
//       { name: "Upload Challan", tabs: null },
//       { name: "RTO Chassis", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       },
//       { name: "Self Insurance", tabs: null },
//       { name: "Delivery Challan", tabs: null },
//       { name: "GST Invoice", tabs: null },
//       { name: "Helmet Invoice", tabs: null },
//       { name: "Deal Form", tabs: null },
//       { name: "Upload Deal Form & Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales Report": {
//     pages: [
//       { name: "Sales Person Wise", tabs: null },
//       { name: "Periodic Report", tabs: null }
//     ],
//     availablePermissions: ["VIEW"]
//   },
//   "Quotation": {
//     pages: [
//       { name: "Quotation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Account": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Receipts", 
//         tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
//       },
//       { name: "Debit Note", tabs: null },
//       { name: "Refund", tabs: null },
//       { 
//         name: "Cancelled Booking", 
//         tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
//       },
//       { name: "All Receipts", tabs: null },
//       { name: "Ledgers", tabs: null },
//       { name: "Exchange Ledger", tabs: null },
//       { 
//         name: "Broker Payment Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Insurance": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Insurance Details", 
//         tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "RTO": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Application", 
//         tabs: ["RTO PENDING", "APPLIED FOR"]
//       },
//       { 
//         name: "RTO Paper", 
//         tabs: ["RTO PAPER PENDING", "COMPLETED"]
//       },
//       { 
//         name: "RTO Tax", 
//         tabs: ["RTO PENDING TAX", "TAX PAID"]
//       },
//       { 
//         name: "HSRP Ordering", 
//         tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
//       },
//       { 
//         name: "HSRP Installation", 
//         tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
//       },
//       { 
//         name: "RC Confirmation", 
//         tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Management": {
//     pages: [
//       { name: "Cash Voucher", tabs: null },
//       { name: "Contra Voucher", tabs: null },
//       { 
//         name: "Contra Approval", 
//         tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
//       },
//       { name: "Workshop Cash Receipt", tabs: null },
//       { name: "All Cash Receipt", tabs: null },
//       { name: "Cash Book", tabs: null },
//       { name: "Day Book", tabs: null },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Masters": {
//     pages: [
//       { name: "Location", tabs: null },
//       { name: "Headers", tabs: null },
//       { name: "Vehicles", tabs: null },
//       { name: "Minimum Booking Amount", tabs: null },
//       { name: "Template List", tabs: null },
//       { name: "Accessories", tabs: null },
//       { name: "Colour", tabs: null },
//       { name: "Documents", tabs: null },
//       { name: "Terms & Conditions", tabs: null },
//       { name: "Offer", tabs: null },
//       { name: "Attachments", tabs: null },
//       { name: "Declaration", tabs: null },
//       { name: "RTO", tabs: null },
//       { name: "Financer", tabs: null },
//       { name: "Finance Rates", tabs: null },
//       { name: "Insurance Providers", tabs: null },
//       { name: "Brokers", tabs: null },
//       { name: "Broker Commission Range", tabs: null },
//       { name: "Vertical Masters", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Master": {
//     pages: [
//       { name: "Cash Account Master", tabs: null },
//       { name: "Bank Account Master", tabs: null },
//       { name: "Payment Mode", tabs: null },
//       { name: "Expense Master", tabs: null },
//       { name: "Add Opening Balance", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Accessories Billing": {
//     pages: [
//       { name: "Accessories Billing", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Customers": {
//     pages: [
//       { name: "Customers", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer": {
//     pages: [
//       { 
//         name: "Subdealer Stock Audit", 
//         tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Master": {
//     pages: [
//       { name: "Subdealer List", tabs: null },
//       { name: "Subdealer Audit List", tabs: null },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Calculate Commission", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Booking": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
//       },
//       { name: "Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Management": {
//     pages: [
//       { 
//         name: "Subdealer Management", 
//         tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Account": {
//     pages: [
//       { name: "Add Balance", tabs: null },
//       { name: "OnAccount Balance", tabs: null },
//       { name: "Add Amount", tabs: null },
//       { 
//         name: "Finance Payment", 
//         tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
//       },
//       { 
//         name: "Payment Verification", 
//         tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
//       },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Payment Summary", tabs: null },
//       { 
//         name: "Subdealer Ledger", 
//         tabs: ["SUB DEALER", "SUB DEALER UTR"]
//       },
//       { name: "Customer Ledger", tabs: null },
//       { 
//         name: "Summary", 
//         tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "User Management": {
//     pages: [
//       { name: "Create Role", tabs: null },
//       { name: "All Role", tabs: null },
//       { name: "Add User", tabs: null },
//       { name: "User List", tabs: null },
//       { name: "Buffer Report", tabs: null },
//       { name: "Manager Deviation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   }
// };

// // Map sidebar module names to API module names
// const moduleNameMap = {
//   "Dashboard": ["DASHBOARD"],
//   "Purchase": ["PURCHASE"],
//   "Sales": ["SALES"],
//   "Sales Report": ["SALES REPORT", "SALES_REPORT"],
//   "Quotation": ["QUOTATION"],
//   "Account": ["ACCOUNT"],
//   "Insurance": ["INSURANCE"],
//   "RTO": ["RTO"],
//   "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
//   "Masters": ["MASTERS"],
//   "Fund Master": ["FUND MASTER", "FUND_MASTER"],
//   "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
//   "Customers": ["CUSTOMERS"],
//   "Subdealer": ["SUBDEALER"],
//   "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
//   "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
//   "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
//   "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   if (isTab) {
//     return tabPermissionLabelMap[permission] || permission;
//   }
//   return permissionLabelMap[permission] || permission;
// };

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealer: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const { refreshPermissions } = useContext(AuthContext)
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     fetchRoles();
//     fetchBranches();
//     fetchSubdealers();
//     fetchVerticles();
//     fetchAllPermissions();
//     if (id) fetchUser(id);
//   }, [id]);

// const fetchUser = async (userId) => {
//   try {
//     const res = await axiosInstance.get(`/users/${userId}`);
//     const userData = res.data.data;
    
//     console.log('User data for debugging:', userData);
    
//     // DEBUG: Check the raw permissions structure
//     console.log('Raw permissions from API:', userData.permissions);
//     console.log('Permissions type:', typeof userData.permissions);
    
//     // FIX: Properly extract permission IDs
//     let userPermissions = [];
//     if (Array.isArray(userData.permissions)) {
//       userPermissions = userData.permissions.map(p => {
//         // If it's already a string ID
//         if (typeof p === 'string' && p.length > 0) {
//           return p;
//         }
//         // If it's null or undefined, skip it
//         if (!p) return null;
//         // If it's an object with _id
//         if (typeof p === 'object' && p._id) {
//           return p._id;
//         }
//         // If it's an object with permission property
//         if (typeof p === 'object' && p.permission) {
//           if (typeof p.permission === 'string') {
//             return p.permission;
//           } else if (p.permission._id) {
//             return p.permission._id;
//           }
//         }
//         return null;
//       }).filter(id => id !== null && id !== undefined);
//     }
    
//     console.log('Extracted permissions:', userPermissions);
    
//     let userVerticles = [];

//     // Extract just the IDs from verticles
//     if (Array.isArray(userData.verticles)) {
//       userVerticles = userData.verticles.map(v => v._id || v.id);
//     }

//     // Alternative: Extract from verticlesDetails
//     if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//       if (userData.verticlesDetails.length > 0) {
//         userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
//       }
//     }
    
//     setFormData({
//       name: userData.name,
//       type: userData.type || 'employee',
//       branch: userData.branch?._id || '',
//       subdealer: userData.subdealer || '',
//       roleId: userData.roles[0]?._id || '',
//       email: userData.email,
//       mobile: userData.mobile,
//       discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
//       permissions: userPermissions,
//       totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
//       perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
//       verticles: userVerticles
//     });

//     if (userData.roles[0]?._id) {
//       setShowPermissions(true);
//       // Load user's existing permissions from userData
//       await loadUserPermissions(userData);
//     }
//   } catch (error) {
//     const message = showError(error);
//     if (message) {
//        setError(message);
//      }
//   }
// };

// // New function to load user permissions
// const loadUserPermissions = async (userData) => {
//   setIsLoadingPermissions(true);
//   try {
//     // Initialize permissions
//     const initialMainHeaderAccess = {};
//     const initialPagePermissions = {};
//     const initialTabPermissions = {};

//     // First, set all to false
//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       initialMainHeaderAccess[mainHeader] = false;
      
//       const headerPages = sidebarStructure[mainHeader].pages;
//       headerPages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//           pagePerms[permType] = false;
//         });
//         initialPagePermissions[pageKey] = pagePerms;
        
//         // Initialize tab permissions
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               tabPerms[permType] = false;
//             });
//             initialTabPermissions[tabKey] = tabPerms;
//           });
//         }
//       });
//     });

//     // Set main header access from user's moduleAccess
//     if (userData.moduleAccess) {
//       Object.keys(userData.moduleAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && sidebarStructure[mainHeader]) {
//           initialMainHeaderAccess[mainHeader] = userData.moduleAccess[apiModuleName];
//         }
//       });
//     }

//     // Set page permissions from user's pageAccess
//     if (userData.pageAccess) {
//       Object.keys(userData.pageAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && userData.pageAccess[apiModuleName]) {
//           Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
//             const pageKey = `${mainHeader}_${pageName}`;
//             const permissionsArray = userData.pageAccess[apiModuleName][pageName];
            
//             if (initialPagePermissions[pageKey]) {
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 initialPagePermissions[pageKey][permType] = 
//                   permissionsArray.includes(permType.toUpperCase());
//               });
//             }
//           });
//         }
//       });
//     }

//     // Set tab permissions from user's tabAccess
//     if (userData.tabAccess) {
//       Object.keys(userData.tabAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && userData.tabAccess[apiModuleName]) {
//           Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
//             Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//               const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//               if (!pageConfig) return;
              
//               let matchingTab = null;
//               if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                 matchingTab = pageConfig.tabs.find(tab => 
//                   tab.toUpperCase() === tabName.toUpperCase()
//                 );
                
//                 if (!matchingTab) {
//                   const fuzzyMatches = {
//                     'PENDING APPROVALS': 'PENDING APPROVALS',
//                     'PENDING APPROVAL': 'PENDING APPROVALS',
//                     'APPROVED': 'APPROVED',
//                     'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                     'ALLOCATED': 'ALLOCATED',
//                     'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                     'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                     'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                     'SUBMITTED': 'SUBMITTED',
//                     'REJECTED': 'REJECTED'
//                   };
                  
//                   const upperTabName = tabName.toUpperCase();
//                   if (fuzzyMatches[upperTabName]) {
//                     matchingTab = fuzzyMatches[upperTabName];
//                   }
//                 }
//               }
              
//               if (matchingTab) {
//                 const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                 const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                
//                 if (!initialTabPermissions[tabKey]) {
//                   initialTabPermissions[tabKey] = {};
//                 }
                
//                 permissions.forEach(perm => {
//                   const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                   initialTabPermissions[tabKey][permKey] = true;
//                 });
//               }
//             });
//           });
//         }
//       });
//     }

//     setMainHeaderAccess(initialMainHeaderAccess);
//     setPagePermissions(initialPagePermissions);
//     setTabPermissions(initialTabPermissions);

//   } catch (error) {
//     console.error('Error loading user permissions:', error);
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }    
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setVerticles(verticlesData);
//     } catch (error) {
//       const message = showError(error);
//       if (message) {
//         setError(message);
//       }
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching permissions:', error);
//     }
//   };

//   const fetchRolePermissionsData = async (roleId) => {
//     if (!roleId) return;
    
//     setIsLoadingPermissions(true);
//     try {
//       const res = await axiosInstance.get(`/roles/${roleId}`);
//       const roleData = res.data.data;
      
//       console.log('Role data for permissions:', roleData);

//       // Initialize permissions
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           // Initialize tab permissions
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Now populate with role data
//       if (roleData.moduleAccess) {
//         Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = roleData.moduleAccess[apiModuleName];
//           }
//         });
//       }

//       if (roleData.pageAccess) {
//         Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.pageAccess[apiModuleName]) {
//             Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   initialPagePermissions[pageKey][permType] = 
//                     permissionsArray.includes(permType.toUpperCase());
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Process tab access
//       if (roleData.tabAccess) {
//         Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.tabAccess[apiModuleName]) {
//             Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   permissions.forEach(perm => {
//                     const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                     initialTabPermissions[tabKey][permKey] = true;
//                   });
//                 }
//               });
//             });
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);

//     } catch (error) {
//       console.error('Error fetching role permissions:', error);
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   // Helper to find main header by module name
//   const findMainHeaderByModule = (moduleName) => {
//     const moduleUpper = moduleName.toUpperCase();
//     for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
//       if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
//         return mainHeader;
//       }
//     }
    
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//  const handleChange = async (e) => {
//   const { name, value } = e.target;
//   setFormData(prev => ({ ...prev, [name]: value }));
//   setErrors(prev => ({ ...prev, [name]: '' }));

//   if (name === 'roleId') {
//     console.log('Role selected:', value);
//     setShowPermissions(true);
    
//     // If editing an existing user, preserve their current permissions
//     if (id) {
//       // Just fetch role permissions but keep user's existing permissions
//       await fetchRolePermissionsData(value);
//     } else {
//       // For new user, load role permissions
//       await fetchRolePermissionsData(value);
//     }
//   }

//   if (name === 'type') {
//     if (value === 'subdealer') {
//       const subdealerRole = roles.find(role => role.name.toLowerCase() === 'subdealer');
//       if (subdealerRole) {
//         setFormData(prev => ({ 
//           ...prev, 
//           type: value,
//           roleId: subdealerRole._id
//         }));
//         await fetchRolePermissionsData(subdealerRole._id);
//         setShowPermissions(true);
//       }
//     } else {
//       setFormData(prev => ({ 
//         ...prev, 
//         type: value,
//         subdealer: ''
//       }));
//     }
//   }
// };

//   const handleVerticalChange = (e) => {
//     const selectedId = e.target.value;
//     if (selectedId && !formData.verticles.includes(selectedId)) {
//       setFormData(prev => ({
//         ...prev,
//         verticles: [...prev.verticles, selectedId]
//       }));
//     }
//     setErrors(prev => ({ ...prev, verticles: '' }));
//   };

//   const removeVertical = (verticalId) => {
//     setFormData(prev => {
//       const newVerticles = prev.verticles.filter(id => id !== verticalId);
//       return {
//         ...prev,
//         verticles: newVerticles
//       };
//     });
//   };

//   const togglePageExpansion = (pageKey) => {
//     setExpandedPages(prev => ({
//       ...prev,
//       [pageKey]: !prev[pageKey]
//     }));
//   };

//   // Check if a permission exists in the system
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     const apiModuleNames = moduleNameMap[mainHeader];
//     if (!apiModuleNames || !apiModuleNames.length) return false;
    
//     return permissionsList.some(perm => 
//       apiModuleNames.some(apiModuleName => 
//         perm.module.toUpperCase() === apiModuleName.toUpperCase()
//       ) && 
//       perm.page === page && 
//       perm.action === permissionType.toUpperCase() &&
//       ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
//     );
//   };

//   // Get all tab permissions that exist in API for a page
//   const getAvailableTabsForPage = (mainHeader, page) => {
//     const apiModuleNames = moduleNameMap[mainHeader];
//     if (!apiModuleNames || !apiModuleNames.length) return [];
    
//     const tabs = new Set();
//     permissionsList.forEach(perm => {
//       if (apiModuleNames.some(apiModuleName => 
//         perm.module.toUpperCase() === apiModuleName.toUpperCase()
//       ) && 
//       perm.page === page && 
//       perm.tab) {
//         tabs.add(perm.tab);
//       }
//     });
    
//     return Array.from(tabs);
//   };

//   // Handle page permission change
//  const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//   const pageKey = `${mainHeader}_${page}`;
  
//   // Update the page permissions state
//   setPagePermissions(prev => ({
//     ...prev,
//     [pageKey]: {
//       ...prev[pageKey],
//       [permissionType]: value
//     }
//   }));

//   // Find the permission ID
//   const apiModuleNames = moduleNameMap[mainHeader];
//   const permission = permissionsList.find(perm => 
//     apiModuleNames.some(apiModuleName => 
//       perm.module.toUpperCase() === apiModuleName.toUpperCase()
//     ) && 
//     perm.page === page && 
//     perm.action === permissionType.toUpperCase() &&
//     !perm.tab
//   );

//   if (permission) {
//     setFormData(prev => {
//       if (value) {
//         // Add permission if not already present
//         if (!prev.permissions.includes(permission._id)) {
//           return { ...prev, permissions: [...prev.permissions, permission._id] };
//         }
//       } else {
//         // Remove permission if present
//         return { 
//           ...prev, 
//           permissions: prev.permissions.filter(id => id !== permission._id) 
//         };
//       }
//       return prev;
//     });
//   }
// };

//   // Handle tab permission change
//  const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//   const tabKey = `${mainHeader}_${page}_${tab}`;
//   setTabPermissions(prev => ({
//     ...prev,
//     [tabKey]: {
//       ...prev[tabKey],
//       [permissionType]: value
//     }
//   }));

//   // Find the permission ID
//   const apiModuleNames = moduleNameMap[mainHeader];
//   const permission = permissionsList.find(perm => 
//     apiModuleNames.some(apiModuleName => 
//       perm.module.toUpperCase() === apiModuleName.toUpperCase()
//     ) && 
//     perm.page === page && 
//     perm.action === permissionType.toUpperCase() &&
//     perm.tab === tab
//   );

//   if (permission) {
//     setFormData(prev => {
//       if (value) {
//         if (!prev.permissions.includes(permission._id)) {
//           return { ...prev, permissions: [...prev.permissions, permission._id] };
//         }
//       } else {
//         return { 
//           ...prev, 
//           permissions: prev.permissions.filter(id => id !== permission._id) 
//         };
//       }
//       return prev;
//     });
//   }
// };

//   // Handle select all permissions for a page
//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     const pageKey = `${mainHeader}_${page}`;
//     const apiModuleNames = moduleNameMap[mainHeader];
//     const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
    
//     const newPagePerms = {};
//     const newPermissionIds = [...formData.permissions];
    
//     availablePermissions.forEach(permType => {
//       const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
//       if (permissionExists) {
//         newPagePerms[permType] = true;
        
//         const permission = permissionsList.find(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           perm.page === page && 
//           perm.action === permType.toUpperCase() &&
//           !perm.tab
//         );
        
//         if (permission && !newPermissionIds.includes(permission._id)) {
//           newPermissionIds.push(permission._id);
//         }
//       } else {
//         newPagePerms[permType] = false;
//       }
//     });
    
//     setPagePermissions(prev => ({
//       ...prev,
//       [pageKey]: newPagePerms
//     }));
    
//     setFormData(prev => ({
//       ...prev,
//       permissions: newPermissionIds
//     }));
//   };

//   // Handle clear all permissions for a page
//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     const pageKey = `${mainHeader}_${page}`;
//     const apiModuleNames = moduleNameMap[mainHeader];
//     const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
    
//     const newPagePerms = {};
//     let newPermissionIds = [...formData.permissions];
    
//     availablePermissions.forEach(permType => {
//       newPagePerms[permType] = false;
      
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permType.toUpperCase() &&
//         !perm.tab
//       );
      
//       if (permission) {
//         newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//       }
//     });
    
//     setPagePermissions(prev => ({
//       ...prev,
//       [pageKey]: newPagePerms
//     }));
    
//     setFormData(prev => ({
//       ...prev,
//       permissions: newPermissionIds
//     }));
//   };

//   // Handle select all tab permissions
//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     const tabKey = `${mainHeader}_${page}_${tab}`;
//     const apiModuleNames = moduleNameMap[mainHeader];
//     const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
    
//     const newPerms = {};
//     const newPermissionIds = [...formData.permissions];
    
//     availablePermissions.forEach(perm => {
//       const exists = checkPermissionExists(mainHeader, page, perm, tab);
//       newPerms[perm] = perm === "VIEW" ? exists : false;
      
//       if (perm === "VIEW" && exists) {
//         const permission = permissionsList.find(p => 
//           apiModuleNames.some(apiModuleName => 
//             p.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           p.page === page && 
//           p.action === "VIEW" &&
//           p.tab === tab
//         );
        
//         if (permission && !newPermissionIds.includes(permission._id)) {
//           newPermissionIds.push(permission._id);
//         }
//       }
//     });
    
//     setTabPermissions(prev => ({
//       ...prev,
//       [tabKey]: newPerms
//     }));
    
//     setFormData(prev => ({
//       ...prev,
//       permissions: newPermissionIds
//     }));
//   };

//   // Handle clear all tab permissions
//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     const tabKey = `${mainHeader}_${page}_${tab}`;
//     const apiModuleNames = moduleNameMap[mainHeader];
    
//     const newPerms = {};
//     let newPermissionIds = [...formData.permissions];
    
//     sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//       newPerms[perm] = false;
      
//       const permission = permissionsList.find(p => 
//         apiModuleNames.some(apiModuleName => 
//           p.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         p.page === page && 
//         p.action === perm.toUpperCase() &&
//         p.tab === tab
//       );
      
//       if (permission) {
//         newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//       }
//     });
    
//     setTabPermissions(prev => ({
//       ...prev,
//       [tabKey]: newPerms
//     }));
    
//     setFormData(prev => ({
//       ...prev,
//       permissions: newPermissionIds
//     }));
//   };

//   // Handle global actions for the three buttons
//   const handleGlobalAction = (actionType) => {
//     switch (actionType) {
//       case 'none':
//         setFormData(prev => ({ ...prev, permissions: [] }));
        
//         const clearedPagePermissions = {};
//         const clearedTabPermissions = {};
//         Object.keys(sidebarStructure).forEach(mainHeader => {
//           sidebarStructure[mainHeader].pages.forEach(page => {
//             const pageKey = `${mainHeader}_${page.name}`;
//             const pagePerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               pagePerms[permType] = false;
//             });
//             clearedPagePermissions[pageKey] = pagePerms;
            
//             if (page.tabs && page.tabs.length > 0) {
//               page.tabs.forEach(tab => {
//                 const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                 const tabPerms = {};
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   tabPerms[permType] = false;
//                 });
//                 clearedTabPermissions[tabKey] = tabPerms;
//               });
//             }
//           });
//         });
//         setPagePermissions(clearedPagePermissions);
//         setTabPermissions(clearedTabPermissions);
//         break;
        
//       case 'selectAll':
//         const allPermissionIds = permissionsList.map(perm => perm._id);
//         setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
        
//         const allPagePermissions = {};
//         const allTabPermissions = {};
//         Object.keys(sidebarStructure).forEach(mainHeader => {
//           sidebarStructure[mainHeader].pages.forEach(page => {
//             const pageKey = `${mainHeader}_${page.name}`;
//             const pagePerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//             });
//             allPagePermissions[pageKey] = pagePerms;
            
//             if (page.tabs && page.tabs.length > 0) {
//               page.tabs.forEach(tab => {
//                 const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                 const tabPerms = {};
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                 });
//                 allTabPermissions[tabKey] = tabPerms;
//               });
//             }
//           });
//         });
//         setPagePermissions(allPagePermissions);
//         setTabPermissions(allTabPermissions);
//         break;
        
//       case 'viewOnly':
//         const viewPermissionIds = permissionsList
//           .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
//           .map(perm => perm._id);
//         setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
        
//         const viewPagePermissions = {};
//         const viewTabPermissions = {};
//         Object.keys(sidebarStructure).forEach(mainHeader => {
//           sidebarStructure[mainHeader].pages.forEach(page => {
//             const pageKey = `${mainHeader}_${page.name}`;
//             const pagePerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               if (permType === 'VIEW') {
//                 pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//               } else {
//                 pagePerms[permType] = false;
//               }
//             });
//             viewPagePermissions[pageKey] = pagePerms;
            
//             if (page.tabs && page.tabs.length > 0) {
//               page.tabs.forEach(tab => {
//                 const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                 const tabPerms = {};
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   if (permType === 'VIEW') {
//                     tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                   } else {
//                     tabPerms[permType] = false;
//                   }
//                 });
//                 viewTabPermissions[tabKey] = tabPerms;
//               });
//             }
//           });
//         });
//         setPagePermissions(viewPagePermissions);
//         setTabPermissions(viewTabPermissions);
//         break;
        
//       default:
//         break;
//     }
//   };

//   // Handle main header access change
//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     setMainHeaderAccess(prev => ({
//       ...prev,
//       [mainHeader]: hasAccess
//     }));

//     if (!hasAccess) {
//       const newPagePermissions = { ...pagePermissions };
//       const newTabPermissions = { ...tabPermissions };
      
//       sidebarStructure[mainHeader].pages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const perms = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//           perms[perm] = false;
//         });
//         newPagePermissions[pageKey] = perms;
        
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//               tabPerms[perm] = false;
//             });
//             newTabPermissions[tabKey] = tabPerms;
//           });
//         }
//       });
      
//       setPagePermissions(newPagePermissions);
//       setTabPermissions(newTabPermissions);
      
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const modulePermissions = permissionsList.filter(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         )
//       );
//       const modulePermissionIds = modulePermissions.map(perm => perm._id);
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
//       }));
//     }
//   };

//   // Render permissions table for a page
//   const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
//     const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
//     const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
//     const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
    
//     // For tabs, only show VIEW permission (renamed to "Access")
//     const displayPermissions = isTab ? ["VIEW"] : availablePermissions;
    
//     return (
//       <CTable bordered responsive hover small className="permission-table mt-2">
//         <CTableHead color="light">
//           <CTableRow>
//             <CTableHeaderCell scope="col" className="text-nowrap">
//               {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
//             </CTableHeaderCell>
//             {displayPermissions.map((perm) => (
//               <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
//                 {getPermissionDisplayLabel(perm, isTab)}
//               </CTableHeaderCell>
//             ))}
//             <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           <CTableRow>
//             <CTableDataCell>
//               <strong>{isTab ? tabName : page}</strong>
//             </CTableDataCell>
//             {displayPermissions.map((perm) => {
//               const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
//               const isChecked = permissions[perm] || false;
              
//               return (
//                 <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
//                   {permissionExists ? (
//                     <CFormCheck
//                       type="checkbox"
//                       checked={isChecked}
//                       onChange={(e) => {
//                         if (isTab) {
//                           handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
//                         } else {
//                           handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
//                         }
//                       }}
//                       aria-label={`${page}-${perm}`}
//                       title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
//                     />
//                   ) : (
//                     <span className="text-muted" title="Permission not available in system">
//                       N/A
//                     </span>
//                   )}
//                 </CTableDataCell>
//               );
//             })}
//             <CTableDataCell className="text-center">
//               <CButtonGroup size="sm">
//                 <CButton 
//                   color="primary" 
//                   size="sm" 
//                   variant="outline"
//                   onClick={() => {
//                     if (isTab) {
//                       handleSelectAllTabPermissions(mainHeader, page, tabName);
//                     } else {
//                       handleSelectAllPagePermissions(mainHeader, page);
//                     }
//                   }}
//                   title="Select all available permissions"
//                 >
//                   All
//                 </CButton>
//                 <CButton 
//                   color="secondary" 
//                   size="sm" 
//                   variant="outline"
//                   onClick={() => {
//                     if (isTab) {
//                       handleClearAllTabPermissions(mainHeader, page, tabName);
//                     } else {
//                       handleClearAllPagePermissions(mainHeader, page);
//                     }
//                   }}
//                   title="Clear all permissions"
//                 >
//                   None
//                 </CButton>
//               </CButtonGroup>
//             </CTableDataCell>
//           </CTableRow>
//         </CTableBody>
//       </CTable>
//     );
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.type) newErrors.type = 'Type is required';
//     if (formData.type === 'employee' && !formData.branch) {
//       newErrors.branch = 'Branch is required for employee';
//     }
//     if (formData.type === 'subdealer' && !formData.subdealer) {
//       newErrors.subdealer = 'Subdealer is required';
//     }
//     if (!formData.roleId) newErrors.roleId = 'Role is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
//     if (!formData.discount) newErrors.discount = 'Discount is required';
//     const selectedRole = roles.find(role => role._id === formData.roleId);
//     if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
//       if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//       if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   // Filter out null/undefined values from permissions
//   const validPermissions = formData.permissions.filter(perm => 
//     perm !== null && perm !== undefined && perm !== ''
//   );
  
//   const payload = {
//     name: formData.name,
//     type: formData.type,
//     roleId: formData.roleId,
//     email: formData.email,
//     mobile: formData.mobile,
//     permissions: validPermissions,
//     verticles: formData.verticles,
//     ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//     ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
//     ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
//     ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//     ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//   };

//   console.log('Submitting payload:', payload);

//   try {
//     if (id) {
//       await axiosInstance.put(`/users/${id}`, payload);
//       await refreshPermissions();
//       await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//     } else {
//       await axiosInstance.post('/auth/register', payload);
//       await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//     }
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     showFormSubmitError(error);
//   }
// };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
//  const getSelectedVerticalNames = () => {
//   return formData.verticles.map(item => {
//     // If item is an object, extract the ID
//     const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
    
//     // Find the vertical in the verticles array
//     const vertical = verticles.find(v => 
//       v._id === verticalId || v.id === verticalId
//     );
    
//     // Return the name if found
//     if (vertical) {
//       return vertical.name || String(verticalId);
//     }
    
//     // Return as string
//     return String(verticalId);
//   });
// };
  
//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }
  
//   return (
//     <div className="form-container">
//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="text" 
//                     name="name" 
//                     value={formData.name} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.name && <p className="error">{errors.name}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilPeople} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="type" 
//                     value={formData.type} 
//                     onChange={handleChange}
//                   >
//                     <option value="employee">Employee</option>
//                     <option value="subdealer">Subdealer</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.type && <p className="error">{errors.type}</p>}
//               </div>
              
//               {formData.type === 'employee' && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Branch</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilLocationPin} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="branch" 
//                       value={formData.branch} 
//                       onChange={handleChange}
//                     >
//                       <option value="">-Select-</option>
//                       {branches.map(branch => (
//                         <option key={branch._id} value={branch._id}>
//                           {branch.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.branch && <p className="error">{errors.branch}</p>}
//                 </div>
//               )}

//               {formData.type === 'subdealer' && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Subdealer Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="subdealer" 
//                       value={formData.subdealer} 
//                       onChange={handleChange}
//                     >
//                       <option value="">-Select Subdealer-</option>
//                       {subdealers.map(subdealer => (
//                         <option key={subdealer.id} value={subdealer.id}>
//                           {subdealer.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                 </div>
//               )}
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Role</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="roleId" 
//                     value={formData.roleId} 
//                     onChange={handleChange}
//                     disabled={formData.type === 'subdealer'}
//                   >
//                     <option value="">-Select-</option>
//                     {roles.map(role => (
//                       <option key={role._id} value={role._id}>
//                         {role.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.roleId && <p className="error">{errors.roleId}</p>}
//                 {formData.type === 'subdealer' && (
//                   <small className="text-muted">Role is automatically set to Subdealer</small>
//                 )}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Email</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilEnvelopeClosed} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="email" 
//                     name="email" 
//                     value={formData.email} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.email && <p className="error">{errors.email}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Mobile number</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilPhone} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="tel" 
//                     name="mobile" 
//                     value={formData.mobile} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.mobile && <p className="error">{errors.mobile}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Discount</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="number" 
//                     name="discount" 
//                     value={formData.discount} 
//                     onChange={handleChange} 
//                     min="0"
//                     step="0.01"
//                   />
//                 </CInputGroup>
//                 {errors.discount && <p className="error">{errors.discount}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Verticles</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilTag} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="vertical" 
//                     value="" 
//                     onChange={handleVerticalChange}
//                   >
//                     <option value="">-Select Verticle-</option>
//                     {verticles
//                       .filter(vertical => vertical.status === 'active')
//                       .map(vertical => (
//                         <option 
//                           key={vertical._id} 
//                           value={vertical._id}
//                           disabled={formData.verticles.includes(vertical._id)}
//                         >
//                           {vertical.name}
//                         </option>
//                       ))}
//                   </CFormSelect>
//                 </CInputGroup>
                
//                 <div className="mt-2">
//                   <div className="d-flex flex-wrap gap-2">
//                     {getSelectedVerticalNames().map((verticalName, index) => {
//   const verticalId = formData.verticles[index];
//   return (
//     <CBadge 
//       key={`${verticalId}_${index}`} 
//       color="primary"
//       className="d-flex align-items-center"
//       style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//     >
//       {String(verticalName)}  {/* Ensure it's a string */}
//       <CCloseButton 
//         className="ms-2"
//         onClick={() => removeVertical(verticalId)}
//         style={{ fontSize: '0.75rem' }}
//       />
//     </CBadge>
//   );
// })}
//                   </div>
//                   <small className="text-muted">
//                     {formData.verticles.length} verticle(s) selected (Optional)
//                   </small>
//                 </div>
//               </div>

//               {isManager && (
//                 <>
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Total Deviation Amount</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilDollar} />
//                       </CInputGroupText>
//                       <CFormInput 
//                         type="number" 
//                         name="totalDeviationAmount" 
//                         value={formData.totalDeviationAmount} 
//                         onChange={handleChange} 
//                         min="0"
//                         step="0.01"
//                       />
//                     </CInputGroup>
//                     {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Per Transaction Deviation Limit</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilDollar} />
//                       </CInputGroupText>
//                       <CFormInput 
//                         type="number" 
//                         name="perTransactionDeviationLimit" 
//                         value={formData.perTransactionDeviationLimit} 
//                         onChange={handleChange} 
//                         min="0"
//                         step="0.01"
//                       />
//                     </CInputGroup>
//                     {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                   </div>
//                 </>
//               )}
//             </div>

//             {showPermissions && (
//               <div className="permissions-container mt-4">
//                 <h5 className="mb-3">User Permissions Configuration</h5>
//                 <p className="text-muted mb-4">
//                   These permissions are in addition to the role permissions. 
//                   Total system permissions: {permissionsList.length}
//                 </p>
                
//                 {/* Three global permission buttons added here */}
//                 <div className="mb-3">
//                   <CButtonGroup>
//                     <CButton 
//                       color="secondary" 
//                       onClick={() => handleGlobalAction('none')} 
//                       variant="outline"
//                     >
//                       None
//                     </CButton>
//                     <CButton 
//                       color="secondary" 
//                       onClick={() => handleGlobalAction('selectAll')} 
//                       variant="outline"
//                     >
//                       Select All
//                     </CButton>
//                     <CButton 
//                       color="secondary" 
//                       onClick={() => handleGlobalAction('viewOnly')} 
//                       variant="outline"
//                     >
//                       View Only
//                     </CButton>
//                   </CButtonGroup>
//                 </div>

//                 {isLoadingPermissions ? (
//                   <div className="d-flex justify-content-center align-items-center py-4">
//                     <CSpinner color="primary" />
//                     <span className="ms-2">Loading permissions...</span>
//                   </div>
//                 ) : (
//                   <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                     {Object.keys(sidebarStructure).map((mainHeader) => {
//                       const hasAccess = mainHeaderAccess[mainHeader] || false;
//                       const pageCount = sidebarStructure[mainHeader].pages.length;

//                       return (
//                         <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                         <CAccordionHeader>
//   <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//     <div>
//       <h6 className="mb-0">{mainHeader}</h6>
//       <small className="text-muted">{pageCount} pages</small>
//     </div>
//     <div className="d-flex align-items-center gap-2">
//       <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//         {hasAccess ? 'Access Granted' : 'No Access'}
//       </CBadge>
//       <div className="d-flex" role="group">
//         <button
//           type="button"
//           className={`btn btn-sm ${hasAccess ? 'btn-success' : 'btn-secondary'} btn-outline me-1`}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleMainHeaderAccessChange(mainHeader, true);
//           }}
//         >
//           <CIcon icon={cilCheck} /> Yes
//         </button>
//         <button
//           type="button"
//           className={`btn btn-sm ${!hasAccess ? 'btn-danger' : 'btn-secondary'} btn-outline`}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleMainHeaderAccessChange(mainHeader, false);
//           }}
//         >
//           <CIcon icon={cilX} /> No
//         </button>
//       </div>
//     </div>
//   </div>
// </CAccordionHeader>
//                           <CAccordionBody>
//                             {hasAccess ? (
//                               <div className="pages-permissions">
//                                 {sidebarStructure[mainHeader].pages.map((page) => {
//                                   const pageKey = `${mainHeader}_${page.name}`;
//                                   const isExpanded = expandedPages[pageKey] || false;
//                                   const pageHasTabs = page.tabs && page.tabs.length > 0;
//                                   const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                                   const hasTabPermissions = availableTabs.length > 0;
                                  
//                                   return (
//                                     <CCard key={pageKey} className="mb-3">
//                                       <CCardBody>
//                                         <div className="d-flex justify-content-between align-items-center mb-2">
//                                           <h6 className="mb-0">{page.name}</h6>
//                                           <div className="d-flex align-items-center gap-2">
//                                             {pageHasTabs && hasTabPermissions && (
//                                               <CButton
//                                                 size="sm"
//                                                 color="link"
//                                                 onClick={() => togglePageExpansion(pageKey)}
//                                                 className="p-0"
//                                               >
//                                                 {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                               </CButton>
//                                             )}
//                                           </div>
//                                         </div>
                                        
//                                         {/* Page-level permissions */}
//                                         {renderPermissionsTable(mainHeader, page.name, false)}
                                        
//                                         {/* Tab-level permissions (if available) */}
//                                         {pageHasTabs && hasTabPermissions && (
//                                           <CCollapse visible={isExpanded}>
//                                             <div className="mt-3">
//                                               <h6 className="mb-2">Tab Permissions</h6>
//                                               {availableTabs.map((tab) => (
//                                                 <div key={`${pageKey}_${tab}`} className="mb-3">
//                                                   {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                                 </div>
//                                               ))}
//                                             </div>
//                                           </CCollapse>
//                                         )}
//                                       </CCardBody>
//                                     </CCard>
//                                   );
//                                 })}
//                               </div>
//                             ) : (
//                               <div className="text-center py-4">
//                                 <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                                 <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                                 <small>Click "Yes" to grant access and configure permissions</small>
//                               </div>
//                             )}
//                           </CAccordionBody>
//                         </CAccordionItem>
//                       );
//                     })}
//                   </CAccordion>
//                 )}
//               </div>
//             )}

//             <div className="form-footer">
//               <button type="submit" className="cancel-button">
//                 Save
//               </button>
//               <button type="button" className="submit-button" onClick={handleCancel}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;










// import React, { useState, useEffect, useContext } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CCard,
//   CCardBody,
//   CCollapse
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich, cilWarning } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../../context/AuthContext';

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete",
//   "READ": "View",
//   "WRITE": "Edit"
// };

// // Tab permission label mapping (only show "Access" instead of "VIEW" for tabs)
// const tabPermissionLabelMap = {
//   "VIEW": "Access",
//   "CREATE": "Create",
//   "UPDATE": "Update", 
//   "DELETE": "Delete"
// };

// // Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
// const sidebarStructure = {
//   "Dashboard": {
//     pages: [{
//       name: "Dashboard",
//       tabs: null
//     }],
//     availablePermissions: ["VIEW"]
//   },
//   "Purchase": {
//     pages: [
//       { name: "Inward Stock", tabs: null },
//       { 
//         name: "Stock Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
//       },
//       { name: "Stock Transfer", tabs: null },
//       { name: "Upload Challan", tabs: null },
//       { name: "RTO Chassis", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       },
//       { name: "Self Insurance", tabs: null },
//       { name: "Delivery Challan", tabs: null },
//       { name: "GST Invoice", tabs: null },
//       { name: "Helmet Invoice", tabs: null },
//       { name: "Deal Form", tabs: null },
//       { name: "Upload Deal Form & Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales Report": {
//     pages: [
//       { name: "Sales Person Wise", tabs: null },
//       { name: "Periodic Report", tabs: null }
//     ],
//     availablePermissions: ["VIEW"]
//   },
//   "Quotation": {
//     pages: [
//       { name: "Quotation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Account": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Receipts", 
//         tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
//       },
//       { name: "Debit Note", tabs: null },
//       { name: "Refund", tabs: null },
//       { 
//         name: "Cancelled Booking", 
//         tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
//       },
//       { name: "All Receipts", tabs: null },
//       { name: "Ledgers", tabs: null },
//       { name: "Exchange Ledger", tabs: null },
//       { 
//         name: "Broker Payment Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Insurance": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Insurance Details", 
//         tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "RTO": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Application", 
//         tabs: ["RTO PENDING", "APPLIED FOR"]
//       },
//       { 
//         name: "RTO Paper", 
//         tabs: ["RTO PAPER PENDING", "COMPLETED"]
//       },
//       { 
//         name: "RTO Tax", 
//         tabs: ["RTO PENDING TAX", "TAX PAID"]
//       },
//       { 
//         name: "HSRP Ordering", 
//         tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
//       },
//       { 
//         name: "HSRP Installation", 
//         tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
//       },
//       { 
//         name: "RC Confirmation", 
//         tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Management": {
//     pages: [
//       { name: "Cash Voucher", tabs: null },
//       { name: "Contra Voucher", tabs: null },
//       { 
//         name: "Contra Approval", 
//         tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
//       },
//       { name: "Workshop Cash Receipt", tabs: null },
//       { name: "All Cash Receipt", tabs: null },
//       { name: "Cash Book", tabs: null },
//       { name: "Day Book", tabs: null },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Masters": {
//     pages: [
//       { name: "Location", tabs: null },
//       { name: "Headers", tabs: null },
//       { name: "Vehicles", tabs: null },
//       { name: "Minimum Booking Amount", tabs: null },
//       { name: "Template List", tabs: null },
//       { name: "Accessories", tabs: null },
//       { name: "Colour", tabs: null },
//       { name: "Documents", tabs: null },
//       { name: "Terms & Conditions", tabs: null },
//       { name: "Offer", tabs: null },
//       { name: "Attachments", tabs: null },
//       { name: "Declaration", tabs: null },
//       { name: "RTO", tabs: null },
//       { name: "Financer", tabs: null },
//       { name: "Finance Rates", tabs: null },
//       { name: "Insurance Providers", tabs: null },
//       { name: "Brokers", tabs: null },
//       { name: "Broker Commission Range", tabs: null },
//       { name: "Vertical Masters", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Master": {
//     pages: [
//       { name: "Cash Account Master", tabs: null },
//       { name: "Bank Account Master", tabs: null },
//       { name: "Payment Mode", tabs: null },
//       { name: "Expense Master", tabs: null },
//       { name: "Add Opening Balance", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Accessories Billing": {
//     pages: [
//       { name: "Accessories Billing", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Customers": {
//     pages: [
//       { name: "Customers", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer": {
//     pages: [
//       { 
//         name: "Subdealer Stock Audit", 
//         tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Master": {
//     pages: [
//       { name: "Subdealer List", tabs: null },
//       { name: "Subdealer Audit List", tabs: null },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Calculate Commission", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Booking": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
//       },
//       { name: "Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Management": {
//     pages: [
//       { 
//         name: "Subdealer Management", 
//         tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Account": {
//     pages: [
//       { name: "Add Balance", tabs: null },
//       { name: "OnAccount Balance", tabs: null },
//       { name: "Add Amount", tabs: null },
//       { 
//         name: "Finance Payment", 
//         tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
//       },
//       { 
//         name: "Payment Verification", 
//         tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
//       },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Payment Summary", tabs: null },
//       { 
//         name: "Subdealer Ledger", 
//         tabs: ["SUB DEALER", "SUB DEALER UTR"]
//       },
//       { name: "Customer Ledger", tabs: null },
//       { 
//         name: "Summary", 
//         tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "User Management": {
//     pages: [
//       { name: "Create Role", tabs: null },
//       { name: "All Role", tabs: null },
//       { name: "Add User", tabs: null },
//       { name: "User List", tabs: null },
//       { name: "Buffer Report", tabs: null },
//       { name: "Manager Deviation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   }
// };

// // Map sidebar module names to API module names
// const moduleNameMap = {
//   "Dashboard": ["DASHBOARD"],
//   "Purchase": ["PURCHASE"],
//   "Sales": ["SALES"],
//   "Sales Report": ["SALES REPORT", "SALES_REPORT"],
//   "Quotation": ["QUOTATION"],
//   "Account": ["ACCOUNT"],
//   "Insurance": ["INSURANCE"],
//   "RTO": ["RTO"],
//   "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
//   "Masters": ["MASTERS"],
//   "Fund Master": ["FUND MASTER", "FUND_MASTER"],
//   "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
//   "Customers": ["CUSTOMERS"],
//   "Subdealer": ["SUBDEALER"],
//   "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
//   "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
//   "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
//   "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   if (isTab) {
//     return tabPermissionLabelMap[permission] || permission;
//   }
//   return permissionLabelMap[permission] || permission;
// };

// // Error boundary component for form sections
// const FormErrorBoundary = ({ children, section }) => {
//   const [hasError, setHasError] = useState(false);
//   const [error, setError] = useState(null);

//   return hasError ? (
//     <CAlert color="danger" className="mt-3">
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilWarning} className="me-2" />
//         <div>
//           <strong>Error in {section}</strong>
//           <p className="mb-0">{error?.message || 'An unexpected error occurred'}</p>
//         </div>
//       </div>
//     </CAlert>
//   ) : (
//     <ErrorBoundaryWrapper setHasError={setHasError} setError={setError}>
//       {children}
//     </ErrorBoundaryWrapper>
//   );
// };

// const ErrorBoundaryWrapper = ({ children, setHasError, setError }) => {
//   useEffect(() => {
//     const errorHandler = (error) => {
//       console.error('Component error:', error);
//       setHasError(true);
//       setError(error);
//     };
    
//     window.addEventListener('error', errorHandler);
//     return () => window.removeEventListener('error', errorHandler);
//   }, [setHasError, setError]);
  
//   return children;
// };

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealer: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchErrors, setFetchErrors] = useState({
//     roles: null,
//     branches: null,
//     subdealers: null,
//     verticles: null,
//     permissions: null
//   });
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const { refreshPermissions } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Error handling utility functions
//   const handleApiError = (error, context = 'Operation') => {
//     console.error(`${context} error:`, error);
    
//     let errorMessage = 'An unexpected error occurred';
    
//     if (error.response) {
//       // Server responded with error status
//       const { data, status } = error.response;
      
//       if (data && data.message) {
//         errorMessage = data.message;
//       } else if (status === 401) {
//         errorMessage = 'Authentication failed. Please login again.';
//       } else if (status === 403) {
//         errorMessage = 'You do not have permission to perform this action.';
//       } else if (status === 404) {
//         errorMessage = 'Resource not found.';
//       } else if (status >= 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else {
//         errorMessage = `Request failed with status ${status}`;
//       }
//     } else if (error.request) {
//       // Request made but no response
//       errorMessage = 'Network error. Please check your connection.';
//     } else {
//       // Something else happened
//       errorMessage = error.message || errorMessage;
//     }
    
//     return errorMessage;
//   };

//   const showApiErrorAlert = (errorMessage, context = 'Error') => {
//     setApiError({
//       message: errorMessage,
//       context: context,
//       timestamp: new Date().toISOString()
//     });
    
//     // Auto-clear after 10 seconds
//     setTimeout(() => {
//       setApiError(null);
//     }, 10000);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//         showApiErrorAlert('Invalid authentication token. Please login again.', 'Authentication');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setIsLoading(true);
//         await Promise.all([
//           fetchRoles(),
//           fetchBranches(),
//           fetchSubdealers(),
//           fetchVerticles(),
//           fetchAllPermissions()
//         ]);
        
//         if (id) {
//           await fetchUser(id);
//         }
//       } catch (error) {
//         const errorMessage = handleApiError(error, 'Initialization');
//         showApiErrorAlert(errorMessage, 'Initialization Error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     initializeData();
//   }, [id]);

//   const fetchUser = async (userId) => {
//     try {
//       const res = await axiosInstance.get(`/users/${userId}`);
//       const userData = res.data.data;
      
//       if (!userData) {
//         throw new Error('User data not found');
//       }
      
//       // Extract permission IDs
//       let userPermissions = [];
//       if (Array.isArray(userData.permissions)) {
//         userPermissions = userData.permissions
//           .map(p => {
//             if (!p) return null;
//             if (typeof p === 'string' && p.length > 0) return p;
//             if (typeof p === 'object') {
//               if (p._id) return p._id;
//               if (p.permission) {
//                 if (typeof p.permission === 'string') return p.permission;
//                 if (p.permission._id) return p.permission._id;
//               }
//             }
//             return null;
//           })
//           .filter(id => id !== null && id !== undefined);
//       }
      
//       // Extract verticle IDs
//       let userVerticles = [];
//       if (Array.isArray(userData.verticles)) {
//         userVerticles = userData.verticles.map(v => v._id || v.id);
//       }
//       if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//         userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
//       }
      
//       setFormData({
//         name: userData.name || '',
//         type: userData.type || 'employee',
//         branch: userData.branch?._id || '',
//         subdealer: userData.subdealer || '',
//         roleId: userData.roles?.[0]?._id || '',
//         email: userData.email || '',
//         mobile: userData.mobile || '',
//         discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
//         permissions: userPermissions,
//         totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
//         perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
//         verticles: userVerticles
//       });

//       if (userData.roles?.[0]?._id) {
//         setShowPermissions(true);
//         await loadUserPermissions(userData);
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch User');
//       showApiErrorAlert(errorMessage, 'User Fetch Error');
//       throw error;
//     }
//   };

//   const loadUserPermissions = async (userData) => {
//     setIsLoadingPermissions(true);
//     try {
//       // Initialize permissions
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           // Initialize tab permissions
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Set main header access
//       if (userData.moduleAccess) {
//         Object.keys(userData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = Boolean(userData.moduleAccess[apiModuleName]);
//           }
//         });
//       }

//       // Set page permissions
//       if (userData.pageAccess) {
//         Object.keys(userData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && userData.pageAccess[apiModuleName]) {
//             Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = userData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   initialPagePermissions[pageKey][permType] = 
//                     Array.isArray(permissionsArray) && 
//                     permissionsArray.includes(permType.toUpperCase());
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Set tab permissions
//       if (userData.tabAccess) {
//         Object.keys(userData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && userData.tabAccess[apiModuleName]) {
//             Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   if (Array.isArray(permissions)) {
//                     permissions.forEach(perm => {
//                       const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                       initialTabPermissions[tabKey][permKey] = true;
//                     });
//                   }
//                 }
//               });
//             });
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);

//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Load Permissions');
//       showApiErrorAlert(errorMessage, 'Permissions Load Error');
//       throw error;
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, roles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Roles');
//       setFetchErrors(prev => ({ ...prev, roles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, branches: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Branches');
//       setFetchErrors(prev => ({ ...prev, branches: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//       setFetchErrors(prev => ({ ...prev, subdealers: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Subdealers');
//       setFetchErrors(prev => ({ ...prev, subdealers: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setVerticles(verticlesData);
//       setFetchErrors(prev => ({ ...prev, verticles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Verticles');
//       setFetchErrors(prev => ({ ...prev, verticles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//       setFetchErrors(prev => ({ ...prev, permissions: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Permissions');
//       setFetchErrors(prev => ({ ...prev, permissions: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchRolePermissionsData = async (roleId) => {
//     if (!roleId) return;
    
//     setIsLoadingPermissions(true);
//     try {
//       const res = await axiosInstance.get(`/roles/${roleId}`);
//       const roleData = res.data.data;

//       if (!roleData) {
//         throw new Error('Role data not found');
//       }

//       // Initialize permissions
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           // Initialize tab permissions
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Now populate with role data
//       if (roleData.moduleAccess) {
//         Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = Boolean(roleData.moduleAccess[apiModuleName]);
//           }
//         });
//       }

//       if (roleData.pageAccess) {
//         Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.pageAccess[apiModuleName]) {
//             Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   initialPagePermissions[pageKey][permType] = 
//                     Array.isArray(permissionsArray) && 
//                     permissionsArray.includes(permType.toUpperCase());
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Process tab access
//       if (roleData.tabAccess) {
//         Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.tabAccess[apiModuleName]) {
//             Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   if (Array.isArray(permissions)) {
//                     permissions.forEach(perm => {
//                       const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                       initialTabPermissions[tabKey][permKey] = true;
//                     });
//                   }
//                 }
//               });
//             });
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);

//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Role Permissions');
//       showApiErrorAlert(errorMessage, 'Role Permissions Error');
//       throw error;
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   // Helper to find main header by module name
//   const findMainHeaderByModule = (moduleName) => {
//     if (!moduleName) return null;
    
//     const moduleUpper = moduleName.toUpperCase();
//     for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
//       if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
//         return mainHeader;
//       }
//     }
    
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
    
//     try {
//       setFormData(prev => ({ ...prev, [name]: value }));
//       setErrors(prev => ({ ...prev, [name]: '' }));

//       if (name === 'roleId') {
//         setShowPermissions(true);
        
//         if (id) {
//           // For editing, preserve user permissions but fetch role data
//           await fetchRolePermissionsData(value);
//         } else {
//           // For new user, load role permissions
//           await fetchRolePermissionsData(value);
//         }
//       }

//       if (name === 'type') {
//         if (value === 'subdealer') {
//           const subdealerRole = roles.find(role => role.name.toLowerCase() === 'subdealer');
//           if (subdealerRole) {
//             setFormData(prev => ({ 
//               ...prev, 
//               type: value,
//               roleId: subdealerRole._id
//             }));
//             await fetchRolePermissionsData(subdealerRole._id);
//             setShowPermissions(true);
//           }
//         } else {
//           setFormData(prev => ({ 
//             ...prev, 
//             type: value,
//             subdealer: ''
//           }));
//         }
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Change');
//       showApiErrorAlert(errorMessage, 'Form Change Error');
//     }
//   };

//   const handleVerticalChange = (e) => {
//     try {
//       const selectedId = e.target.value;
//       if (selectedId && !formData.verticles.includes(selectedId)) {
//         setFormData(prev => ({
//           ...prev,
//           verticles: [...prev.verticles, selectedId]
//         }));
//       }
//       setErrors(prev => ({ ...prev, verticles: '' }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Vertical Change');
//       showApiErrorAlert(errorMessage, 'Vertical Selection Error');
//     }
//   };

//   const removeVertical = (verticalId) => {
//     try {
//       setFormData(prev => {
//         const newVerticles = prev.verticles.filter(id => id !== verticalId);
//         return {
//           ...prev,
//           verticles: newVerticles
//         };
//       });
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Remove Vertical');
//       showApiErrorAlert(errorMessage, 'Vertical Removal Error');
//     }
//   };

//   const togglePageExpansion = (pageKey) => {
//     try {
//       setExpandedPages(prev => ({
//         ...prev,
//         [pageKey]: !prev[pageKey]
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Toggle Page Expansion');
//       showApiErrorAlert(errorMessage, 'UI Error');
//     }
//   };

//   // Check if a permission exists in the system
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return false;
      
//       return permissionsList.some(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
//       );
//     } catch (error) {
//       console.error('Error checking permission existence:', error);
//       return false;
//     }
//   };

//   // Get all tab permissions that exist in API for a page
//   const getAvailableTabsForPage = (mainHeader, page) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return [];
      
//       const tabs = new Set();
//       permissionsList.forEach(perm => {
//         if (apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.tab) {
//           tabs.add(perm.tab);
//         }
//       });
      
//       return Array.from(tabs);
//     } catch (error) {
//       console.error('Error getting available tabs:', error);
//       return [];
//     }
//   };

//   // Handle page permission change
//   const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: {
//           ...prev[pageKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         !perm.tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Page Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle tab permission change
//   const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: {
//           ...prev[tabKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         perm.tab === tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Tab Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all permissions for a page
//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
//         if (permissionExists) {
//           newPagePerms[permType] = true;
          
//           const permission = permissionsList.find(perm => 
//             apiModuleNames.some(apiModuleName => 
//               perm.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             perm.page === page && 
//             perm.action === permType.toUpperCase() &&
//             !perm.tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         } else {
//           newPagePerms[permType] = false;
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all permissions for a page
//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         newPagePerms[permType] = false;
        
//         const permission = permissionsList.find(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           perm.page === page && 
//           perm.action === permType.toUpperCase() &&
//           !perm.tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all tab permissions
//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(perm => {
//         const exists = checkPermissionExists(mainHeader, page, perm, tab);
//         newPerms[perm] = perm === "VIEW" ? exists : false;
        
//         if (perm === "VIEW" && exists) {
//           const permission = permissionsList.find(p => 
//             apiModuleNames.some(apiModuleName => 
//               p.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             p.page === page && 
//             p.action === "VIEW" &&
//             p.tab === tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all tab permissions
//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       const newPerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//         newPerms[perm] = false;
        
//         const permission = permissionsList.find(p => 
//           apiModuleNames.some(apiModuleName => 
//             p.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           p.page === page && 
//           p.action === perm.toUpperCase() &&
//           p.tab === tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle global actions for the three buttons
//   const handleGlobalAction = (actionType) => {
//     try {
//       switch (actionType) {
//         case 'none':
//           setFormData(prev => ({ ...prev, permissions: [] }));
          
//           const clearedPagePermissions = {};
//           const clearedTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = false;
//               });
//               clearedPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = false;
//                   });
//                   clearedTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(clearedPagePermissions);
//           setTabPermissions(clearedTabPermissions);
//           break;
          
//         case 'selectAll':
//           const allPermissionIds = permissionsList.map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
          
//           const allPagePermissions = {};
//           const allTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//               });
//               allPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                   });
//                   allTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(allPagePermissions);
//           setTabPermissions(allTabPermissions);
//           break;
          
//         case 'viewOnly':
//           const viewPermissionIds = permissionsList
//             .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
//             .map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
          
//           const viewPagePermissions = {};
//           const viewTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 if (permType === 'VIEW') {
//                   pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//                 } else {
//                   pagePerms[permType] = false;
//                 }
//               });
//               viewPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     if (permType === 'VIEW') {
//                       tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                     } else {
//                       tabPerms[permType] = false;
//                     }
//                   });
//                   viewTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(viewPagePermissions);
//           setTabPermissions(viewTabPermissions);
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Global Permission Action');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle main header access change
//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     try {
//       setMainHeaderAccess(prev => ({
//         ...prev,
//         [mainHeader]: hasAccess
//       }));

//       if (!hasAccess) {
//         const newPagePermissions = { ...pagePermissions };
//         const newTabPermissions = { ...tabPermissions };
        
//         sidebarStructure[mainHeader].pages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const perms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//             perms[perm] = false;
//           });
//           newPagePermissions[pageKey] = perms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//                 tabPerms[perm] = false;
//               });
//               newTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
        
//         setPagePermissions(newPagePermissions);
//         setTabPermissions(newTabPermissions);
        
//         const apiModuleNames = moduleNameMap[mainHeader];
//         const modulePermissions = permissionsList.filter(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           )
//         );
//         const modulePermissionIds = modulePermissions.map(perm => perm._id);
        
//         setFormData(prev => ({
//           ...prev,
//           permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
//         }));
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Main Header Access Change');
//       showApiErrorAlert(errorMessage, 'Access Control Error');
//     }
//   };

//   // Render permissions table for a page
//   const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
//     try {
//       const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
//       const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       // For tabs, only show VIEW permission (renamed to "Access")
//       const displayPermissions = isTab ? ["VIEW"] : availablePermissions;
      
//       return (
//         <CTable bordered responsive hover small className="permission-table mt-2">
//           <CTableHead color="light">
//             <CTableRow>
//               <CTableHeaderCell scope="col" className="text-nowrap">
//                 {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
//               </CTableHeaderCell>
//               {displayPermissions.map((perm) => (
//                 <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
//                   {getPermissionDisplayLabel(perm, isTab)}
//                 </CTableHeaderCell>
//               ))}
//               <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             <CTableRow>
//               <CTableDataCell>
//                 <strong>{isTab ? tabName : page}</strong>
//               </CTableDataCell>
//               {displayPermissions.map((perm) => {
//                 const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
//                 const isChecked = permissions[perm] || false;
                
//                 return (
//                   <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
//                     {permissionExists ? (
//                       <CFormCheck
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={(e) => {
//                           if (isTab) {
//                             handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
//                           } else {
//                             handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
//                           }
//                         }}
//                         aria-label={`${page}-${perm}`}
//                         title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
//                       />
//                     ) : (
//                       <span className="text-muted" title="Permission not available in system">
//                         N/A
//                       </span>
//                     )}
//                   </CTableDataCell>
//                 );
//               })}
//               <CTableDataCell className="text-center">
//                 <CButtonGroup size="sm">
//                   <CButton 
//                     color="primary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleSelectAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleSelectAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Select all available permissions"
//                   >
//                     All
//                   </CButton>
//                   <CButton 
//                     color="secondary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleClearAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleClearAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Clear all permissions"
//                   >
//                     None
//                   </CButton>
//                 </CButtonGroup>
//               </CTableDataCell>
//             </CTableRow>
//           </CTableBody>
//         </CTable>
//       );
//     } catch (error) {
//       console.error('Error rendering permissions table:', error);
//       return (
//         <CAlert color="danger">
//           Error rendering permissions table. Please refresh the page.
//         </CAlert>
//       );
//     }
//   };

//   const validateForm = () => {
//     try {
//       const newErrors = {};
//       if (!formData.name.trim()) newErrors.name = 'Name is required';
//       if (!formData.type) newErrors.type = 'Type is required';
//       if (formData.type === 'employee' && !formData.branch) {
//         newErrors.branch = 'Branch is required for employee';
//       }
//       if (formData.type === 'subdealer' && !formData.subdealer) {
//         newErrors.subdealer = 'Subdealer is required';
//       }
//       if (!formData.roleId) newErrors.roleId = 'Role is required';
//       if (!formData.email.trim()) newErrors.email = 'Email is required';
//       if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
//       if (!formData.discount) newErrors.discount = 'Discount is required';
      
//       // Email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (formData.email && !emailRegex.test(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
      
//       // Mobile validation (basic)
//       const mobileRegex = /^[0-9]{10}$/;
//       if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
//         newErrors.mobile = 'Please enter a valid 10-digit mobile number';
//       }
      
//       const selectedRole = roles.find(role => role._id === formData.roleId);
//       if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
//         if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//         if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
        
//         // Validate numeric values
//         if (formData.totalDeviationAmount && isNaN(parseFloat(formData.totalDeviationAmount))) {
//           newErrors.totalDeviationAmount = 'Please enter a valid number';
//         }
//         if (formData.perTransactionDeviationLimit && isNaN(parseFloat(formData.perTransactionDeviationLimit))) {
//           newErrors.perTransactionDeviationLimit = 'Please enter a valid number';
//         }
//       }
      
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Form Validation');
//       showApiErrorAlert(errorMessage, 'Validation Error');
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsLoading(true);
    
//     try {
//       // Filter out null/undefined values from permissions
//       const validPermissions = formData.permissions.filter(perm => 
//         perm !== null && perm !== undefined && perm !== ''
//       );
      
//       const payload = {
//         name: formData.name.trim(),
//         type: formData.type,
//         roleId: formData.roleId,
//         email: formData.email.trim(),
//         mobile: formData.mobile.trim(),
//         permissions: validPermissions,
//         verticles: formData.verticles,
//         ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//         ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
//         ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
//         ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//         ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//       };

//       console.log('Submitting payload:', payload);

//       if (id) {
//         await axiosInstance.put(`/users/${id}`, payload);
//         await refreshPermissions();
//         await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//       } else {
//         await axiosInstance.post('/auth/register', payload);
//         await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Submit Form');
      
//       // Show detailed error in alert
//       showApiErrorAlert(errorMessage, 'Submission Error');
      
//       // Also show the sweet alert for form submission errors
//       showFormSubmitError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  
//   const getSelectedVerticalNames = () => {
//     return formData.verticles.map(item => {
//       const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
//       const vertical = verticles.find(v => 
//         v._id === verticalId || v.id === verticalId
//       );
//       return vertical ? vertical.name || String(verticalId) : String(verticalId);
//     });
//   };

//   // Render fetch errors if any
//   const renderFetchErrors = () => {
//     const errorMessages = Object.entries(fetchErrors)
//       .filter(([_, error]) => error !== null)
//       .map(([key, error]) => `${key}: ${error}`);

//     if (errorMessages.length === 0) return null;

//     return (
//       <CAlert color="warning" className="mb-3">
//         <div className="d-flex align-items-center">
//           <CIcon icon={cilWarning} className="me-2" />
//           <div>
//             <strong>Some data failed to load:</strong>
//             <ul className="mb-0 mt-1">
//               {errorMessages.map((msg, index) => (
//                 <li key={index}>{msg}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </CAlert>
//     );
//   };

//   if (isLoading && !id) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//         <span className="ms-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       {/* Global API Error Alert */}
//       {apiError && (
//         <CAlert 
//           color="danger" 
//           className="mb-3" 
//           dismissible
//           onClose={() => setApiError(null)}
//         >
//           <div className="d-flex align-items-center">
//             <CIcon icon={cilWarning} className="me-2" />
//             <div>
//               <strong>{apiError.context}</strong>
//               <p className="mb-0">{apiError.message}</p>
//             </div>
//           </div>
//         </CAlert>
//       )}

//       {/* Fetch Errors Alert */}
//       {renderFetchErrors()}

//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <FormErrorBoundary section="User Details">
//               <div className="user-details">
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Name</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="text" 
//                       name="name" 
//                       value={formData.name} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="Enter full name"
//                     />
//                   </CInputGroup>
//                   {errors.name && <p className="error">{errors.name}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPeople} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="type" 
//                       value={formData.type} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                     >
//                       <option value="employee">Employee</option>
//                       <option value="subdealer">Subdealer</option>
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.type && <p className="error">{errors.type}</p>}
//                 </div>
                
//                 {formData.type === 'employee' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Branch</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="branch" 
//                         value={formData.branch} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.branches}
//                       >
//                         <option value="">-Select-</option>
//                         {branches.map(branch => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.branch && <p className="error">{errors.branch}</p>}
//                     {fetchErrors.branches && (
//                       <small className="text-warning">Branches data unavailable: {fetchErrors.branches}</small>
//                     )}
//                   </div>
//                 )}

//                 {formData.type === 'subdealer' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="subdealer" 
//                         value={formData.subdealer} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.subdealers}
//                       >
//                         <option value="">-Select Subdealer-</option>
//                         {subdealers.map(subdealer => (
//                           <option key={subdealer.id} value={subdealer.id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {fetchErrors.subdealers && (
//                       <small className="text-warning">Subdealers data unavailable: {fetchErrors.subdealers}</small>
//                     )}
//                   </div>
//                 )}
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Role</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="roleId" 
//                       value={formData.roleId} 
//                       onChange={handleChange}
//                       disabled={isLoading || formData.type === 'subdealer' || fetchErrors.roles}
//                     >
//                       <option value="">-Select-</option>
//                       {roles.map(role => (
//                         <option key={role._id} value={role._id}>
//                           {role.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.roleId && <p className="error">{errors.roleId}</p>}
//                   {formData.type === 'subdealer' && (
//                     <small className="text-muted">Role is automatically set to Subdealer</small>
//                   )}
//                   {fetchErrors.roles && (
//                     <small className="text-warning">Roles data unavailable: {fetchErrors.roles}</small>
//                   )}
//                 </div>
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Email</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilEnvelopeClosed} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="email" 
//                       name="email" 
//                       value={formData.email} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="user@example.com"
//                     />
//                   </CInputGroup>
//                   {errors.email && <p className="error">{errors.email}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Mobile number</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPhone} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="tel" 
//                       name="mobile" 
//                       value={formData.mobile} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="10-digit mobile number"
//                     />
//                   </CInputGroup>
//                   {errors.mobile && <p className="error">{errors.mobile}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Discount</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilDollar} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="number" 
//                       name="discount" 
//                       value={formData.discount} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       min="0"
//                       step="0.01"
//                       placeholder="0.00"
//                     />
//                   </CInputGroup>
//                   {errors.discount && <p className="error">{errors.discount}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Verticles</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilTag} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="vertical" 
//                       value="" 
//                       onChange={handleVerticalChange}
//                       disabled={isLoading || fetchErrors.verticles}
//                     >
//                       <option value="">-Select Verticle-</option>
//                       {verticles
//                         .filter(vertical => vertical.status === 'active')
//                         .map(vertical => (
//                           <option 
//                             key={vertical._id} 
//                             value={vertical._id}
//                             disabled={formData.verticles.includes(vertical._id)}
//                           >
//                             {vertical.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
                  
//                   <div className="mt-2">
//                     <div className="d-flex flex-wrap gap-2">
//                       {getSelectedVerticalNames().map((verticalName, index) => {
//                         const verticalId = formData.verticles[index];
//                         return (
//                           <CBadge 
//                             key={`${verticalId}_${index}`} 
//                             color="primary"
//                             className="d-flex align-items-center"
//                             style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//                           >
//                             {String(verticalName)}
//                             <CCloseButton 
//                               className="ms-2"
//                               onClick={() => removeVertical(verticalId)}
//                               style={{ fontSize: '0.75rem' }}
//                               disabled={isLoading}
//                             />
//                           </CBadge>
//                         );
//                       })}
//                     </div>
//                     <small className="text-muted">
//                       {formData.verticles.length} verticle(s) selected (Optional)
//                     </small>
//                     {fetchErrors.verticles && (
//                       <small className="text-warning d-block">Verticles data unavailable: {fetchErrors.verticles}</small>
//                     )}
//                   </div>
//                 </div>

//                 {isManager && (
//                   <>
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Total Deviation Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="totalDeviationAmount" 
//                           value={formData.totalDeviationAmount} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                     </div>

//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Per Transaction Deviation Limit</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="perTransactionDeviationLimit" 
//                           value={formData.perTransactionDeviationLimit} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </FormErrorBoundary>

//             {showPermissions && (
//               <FormErrorBoundary section="Permissions Configuration">
//                 <div className="permissions-container mt-4">
//                   <h5 className="mb-3">User Permissions Configuration</h5>
//                   <p className="text-muted mb-4">
//                     These permissions are in addition to the role permissions. 
//                     Total system permissions: {permissionsList.length}
//                     {fetchErrors.permissions && (
//                       <span className="text-warning ms-2">(Permissions data incomplete: {fetchErrors.permissions})</span>
//                     )}
//                   </p>
                  
//                   {/* Three global permission buttons added here */}
//                   <div className="mb-3">
//                     <CButtonGroup>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('none')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         None
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('selectAll')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         Select All
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('viewOnly')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         View Only
//                       </CButton>
//                     </CButtonGroup>
//                   </div>

//                   {isLoadingPermissions ? (
//                     <div className="d-flex justify-content-center align-items-center py-4">
//                       <CSpinner color="primary" />
//                       <span className="ms-2">Loading permissions...</span>
//                     </div>
//                   ) : (
//                     <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                       {Object.keys(sidebarStructure).map((mainHeader) => {
//                         const hasAccess = mainHeaderAccess[mainHeader] || false;
//                         const pageCount = sidebarStructure[mainHeader].pages.length;

//                         return (
//                           <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                             <CAccordionHeader>
//                               <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//                                 <div>
//                                   <h6 className="mb-0">{mainHeader}</h6>
//                                   <small className="text-muted">{pageCount} pages</small>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2">
//                                   <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//                                     {hasAccess ? 'Access Granted' : 'No Access'}
//                                   </CBadge>
//                                   <div className="d-flex" role="group">
//                                     <button
//                                       type="button"
//                                       className={`btn btn-sm ${hasAccess ? 'btn-success' : 'btn-secondary'} btn-outline me-1`}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, true);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilCheck} /> Yes
//                                     </button>
//                                     <button
//                                       type="button"
//                                       className={`btn btn-sm ${!hasAccess ? 'btn-danger' : 'btn-secondary'} btn-outline`}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, false);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilX} /> No
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CAccordionHeader>
//                             <CAccordionBody>
//                               {hasAccess ? (
//                                 <div className="pages-permissions">
//                                   {sidebarStructure[mainHeader].pages.map((page) => {
//                                     const pageKey = `${mainHeader}_${page.name}`;
//                                     const isExpanded = expandedPages[pageKey] || false;
//                                     const pageHasTabs = page.tabs && page.tabs.length > 0;
//                                     const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                                     const hasTabPermissions = availableTabs.length > 0;
                                    
//                                     return (
//                                       <CCard key={pageKey} className="mb-3">
//                                         <CCardBody>
//                                           <div className="d-flex justify-content-between align-items-center mb-2">
//                                             <h6 className="mb-0">{page.name}</h6>
//                                             <div className="d-flex align-items-center gap-2">
//                                               {pageHasTabs && hasTabPermissions && (
//                                                 <CButton
//                                                   size="sm"
//                                                   color="link"
//                                                   onClick={() => togglePageExpansion(pageKey)}
//                                                   className="p-0"
//                                                   disabled={isLoading || isLoadingPermissions}
//                                                 >
//                                                   {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                                 </CButton>
//                                               )}
//                                             </div>
//                                           </div>
                                          
//                                           {/* Page-level permissions */}
//                                           {renderPermissionsTable(mainHeader, page.name, false)}
                                          
//                                           {/* Tab-level permissions (if available) */}
//                                           {pageHasTabs && hasTabPermissions && (
//                                             <CCollapse visible={isExpanded}>
//                                               <div className="mt-3">
//                                                 <h6 className="mb-2">Tab Permissions</h6>
//                                                 {availableTabs.map((tab) => (
//                                                   <div key={`${pageKey}_${tab}`} className="mb-3">
//                                                     {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             </CCollapse>
//                                           )}
//                                         </CCardBody>
//                                       </CCard>
//                                     );
//                                   })}
//                                 </div>
//                               ) : (
//                                 <div className="text-center py-4">
//                                   <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                                   <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                                   <small>Click "Yes" to grant access and configure permissions</small>
//                                 </div>
//                               )}
//                             </CAccordionBody>
//                           </CAccordionItem>
//                         );
//                       })}
//                     </CAccordion>
//                   )}
//                 </div>
//               </FormErrorBoundary>
//             )}

//             <div className="form-footer">
//               <button 
//                 type="submit" 
//                 className="cancel-button"
//                 disabled={isLoading || isLoadingPermissions}
//               >
//                 {isLoading ? (
//                   <>
//                     <CSpinner size="sm" className="me-2" />
//                     {id ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//               <button 
//                 type="button" 
//                 className="submit-button" 
//                 onClick={handleCancel}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;










// import React, { useState, useEffect, useContext } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CCard,
//   CCardBody,
//   CCollapse
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich, cilWarning } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../../context/AuthContext';

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete",
//   "READ": "View",
//   "WRITE": "Edit"
// };

// // Tab permission label mapping (only show "Access" instead of "VIEW" for tabs)
// const tabPermissionLabelMap = {
//   "VIEW": "Access",
//   "CREATE": "Create",
//   "UPDATE": "Update", 
//   "DELETE": "Delete"
// };

// // Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
// const sidebarStructure = {
//   "Dashboard": {
//     pages: [{
//       name: "Dashboard",
//       tabs: null
//     }],
//     availablePermissions: ["VIEW"]
//   },
//   "Purchase": {
//     pages: [
//       { name: "Inward Stock", tabs: null },
//       { 
//         name: "Stock Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
//       },
//       { name: "Stock Transfer", tabs: null },
//       { name: "Upload Challan", tabs: null },
//       { name: "RTO Chassis", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       },
//       { name: "Self Insurance", tabs: null },
//       { name: "Delivery Challan", tabs: null },
//       { name: "GST Invoice", tabs: null },
//       { name: "Helmet Invoice", tabs: null },
//       { name: "Deal Form", tabs: null },
//       { name: "Upload Deal Form & Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales Report": {
//     pages: [
//       { name: "Sales Person Wise", tabs: null },
//       { name: "Periodic Report", tabs: null }
//     ],
//     availablePermissions: ["VIEW"]
//   },
//   "Quotation": {
//     pages: [
//       { name: "Quotation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Account": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Receipts", 
//         tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
//       },
//       { name: "Debit Note", tabs: null },
//       { name: "Refund", tabs: null },
//       { 
//         name: "Cancelled Booking", 
//         tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
//       },
//       { name: "All Receipts", tabs: null },
//       { name: "Ledgers", tabs: null },
//       { name: "Exchange Ledger", tabs: null },
//       { 
//         name: "Broker Payment Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Insurance": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Insurance Details", 
//         tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "RTO": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Application", 
//         tabs: ["RTO PENDING", "APPLIED FOR"]
//       },
//       { 
//         name: "RTO Paper", 
//         tabs: ["RTO PAPER PENDING", "COMPLETED"]
//       },
//       { 
//         name: "RTO Tax", 
//         tabs: ["RTO PENDING TAX", "TAX PAID"]
//       },
//       { 
//         name: "HSRP Ordering", 
//         tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
//       },
//       { 
//         name: "HSRP Installation", 
//         tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
//       },
//       { 
//         name: "RC Confirmation", 
//         tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Management": {
//     pages: [
//       { name: "Cash Voucher", tabs: null },
//       { name: "Contra Voucher", tabs: null },
//       { 
//         name: "Contra Approval", 
//         tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
//       },
//       { name: "Workshop Cash Receipt", tabs: null },
//       { name: "All Cash Receipt", tabs: null },
//       { name: "Cash Book", tabs: null },
//       { name: "Day Book", tabs: null },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Masters": {
//     pages: [
//       { name: "Location", tabs: null },
//       { name: "Headers", tabs: null },
//       { name: "Vehicles", tabs: null },
//       { name: "Minimum Booking Amount", tabs: null },
//       { name: "Template List", tabs: null },
//       { name: "Accessories", tabs: null },
//       { name: "Colour", tabs: null },
//       { name: "Documents", tabs: null },
//       { name: "Terms & Conditions", tabs: null },
//       { name: "Offer", tabs: null },
//       { name: "Attachments", tabs: null },
//       { name: "Declaration", tabs: null },
//       { name: "RTO", tabs: null },
//       { name: "Financer", tabs: null },
//       { name: "Finance Rates", tabs: null },
//       { name: "Insurance Providers", tabs: null },
//       { name: "Brokers", tabs: null },
//       { name: "Broker Commission Range", tabs: null },
//       { name: "Vertical Masters", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Master": {
//     pages: [
//       { name: "Cash Account Master", tabs: null },
//       { name: "Bank Account Master", tabs: null },
//       { name: "Payment Mode", tabs: null },
//       { name: "Expense Master", tabs: null },
//       { name: "Add Opening Balance", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Accessories Billing": {
//     pages: [
//       { name: "Accessories Billing", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Customers": {
//     pages: [
//       { name: "Customers", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer": {
//     pages: [
//       { 
//         name: "Subdealer Stock Audit", 
//         tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Master": {
//     pages: [
//       { name: "Subdealer List", tabs: null },
//       { name: "Subdealer Audit List", tabs: null },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Calculate Commission", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Booking": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
//       },
//       { name: "Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Management": {
//     pages: [
//       { 
//         name: "Subdealer Management", 
//         tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Account": {
//     pages: [
//       { name: "Add Balance", tabs: null },
//       { name: "OnAccount Balance", tabs: null },
//       { name: "Add Amount", tabs: null },
//       { 
//         name: "Finance Payment", 
//         tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
//       },
//       { 
//         name: "Payment Verification", 
//         tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
//       },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Payment Summary", tabs: null },
//       { 
//         name: "Subdealer Ledger", 
//         tabs: ["SUB DEALER", "SUB DEALER UTR"]
//       },
//       { name: "Customer Ledger", tabs: null },
//       { 
//         name: "Summary", 
//         tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "User Management": {
//     pages: [
//       { name: "Create Role", tabs: null },
//       { name: "All Role", tabs: null },
//       { name: "Add User", tabs: null },
//       { name: "User List", tabs: null },
//       { name: "Buffer Report", tabs: null },
//       { name: "Manager Deviation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   }
// };

// // Map sidebar module names to API module names
// const moduleNameMap = {
//   "Dashboard": ["DASHBOARD"],
//   "Purchase": ["PURCHASE"],
//   "Sales": ["SALES"],
//   "Sales Report": ["SALES REPORT", "SALES_REPORT"],
//   "Quotation": ["QUOTATION"],
//   "Account": ["ACCOUNT"],
//   "Insurance": ["INSURANCE"],
//   "RTO": ["RTO"],
//   "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
//   "Masters": ["MASTERS"],
//   "Fund Master": ["FUND MASTER", "FUND_MASTER"],
//   "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
//   "Customers": ["CUSTOMERS"],
//   "Subdealer": ["SUBDEALER"],
//   "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
//   "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
//   "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
//   "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   if (isTab) {
//     return tabPermissionLabelMap[permission] || permission;
//   }
//   return permissionLabelMap[permission] || permission;
// };

// // Error boundary component for form sections
// const FormErrorBoundary = ({ children, section }) => {
//   const [hasError, setHasError] = useState(false);
//   const [error, setError] = useState(null);

//   return hasError ? (
//     <CAlert color="danger" className="mt-3">
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilWarning} className="me-2" />
//         <div>
//           <strong>Error in {section}</strong>
//           <p className="mb-0">{error?.message || 'An unexpected error occurred'}</p>
//         </div>
//       </div>
//     </CAlert>
//   ) : (
//     <ErrorBoundaryWrapper setHasError={setHasError} setError={setError}>
//       {children}
//     </ErrorBoundaryWrapper>
//   );
// };

// const ErrorBoundaryWrapper = ({ children, setHasError, setError }) => {
//   useEffect(() => {
//     const errorHandler = (error) => {
//       console.error('Component error:', error);
//       setHasError(true);
//       setError(error);
//     };
    
//     window.addEventListener('error', errorHandler);
//     return () => window.removeEventListener('error', errorHandler);
//   }, [setHasError, setError]);
  
//   return children;
// };

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealer: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchErrors, setFetchErrors] = useState({
//     roles: null,
//     branches: null,
//     subdealers: null,
//     verticles: null,
//     permissions: null
//   });
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const { refreshPermissions } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Error handling utility functions
//   const handleApiError = (error, context = 'Operation') => {
//     console.error(`${context} error:`, error);
    
//     let errorMessage = 'An unexpected error occurred';
    
//     if (error.response) {
//       // Server responded with error status
//       const { data, status } = error.response;
      
//       if (data && data.message) {
//         errorMessage = data.message;
//       } else if (status === 401) {
//         errorMessage = 'Authentication failed. Please login again.';
//       } else if (status === 403) {
//         errorMessage = 'You do not have permission to perform this action.';
//       } else if (status === 404) {
//         errorMessage = 'Resource not found.';
//       } else if (status >= 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else {
//         errorMessage = `Request failed with status ${status}`;
//       }
//     } else if (error.request) {
//       // Request made but no response
//       errorMessage = 'Network error. Please check your connection.';
//     } else {
//       // Something else happened
//       errorMessage = error.message || errorMessage;
//     }
    
//     return errorMessage;
//   };

//   const showApiErrorAlert = (errorMessage, context = 'Error') => {
//     setApiError({
//       message: errorMessage,
//       context: context,
//       timestamp: new Date().toISOString()
//     });
    
//     // Auto-clear after 10 seconds
//     setTimeout(() => {
//       setApiError(null);
//     }, 10000);
//   };

//   // Handle role auto-selection when type changes to subdealer
//   useEffect(() => {
//     if (formData.type === 'subdealer' && roles.length > 0 && !formData.roleId) {
//       const subdealerRole = roles.find(role => 
//         role.name.toLowerCase() === 'subdealer' || 
//         role.name.toLowerCase().includes('subdealer')
//       );
      
//       if (subdealerRole) {
//         setFormData(prev => ({ 
//           ...prev, 
//           roleId: subdealerRole._id
//         }));
        
//         // Load permissions for subdealer role
//         fetchRolePermissionsData(subdealerRole._id);
//         setShowPermissions(true);
//       }
//     }
//   }, [formData.type, roles, formData.roleId]);

//   // Also handle when user switches from subdealer back to employee
//   useEffect(() => {
//     if (formData.type !== 'subdealer' && !id) {
//       // For new users, clear role when switching from subdealer to employee
//       setFormData(prev => ({ 
//         ...prev, 
//         roleId: '',
//         subdealer: ''
//       }));
//       setShowPermissions(false);
//     }
//   }, [formData.type, id]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//         showApiErrorAlert('Invalid authentication token. Please login again.', 'Authentication');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setIsLoading(true);
//         await Promise.all([
//           fetchRoles(),
//           fetchBranches(),
//           fetchSubdealers(),
//           fetchVerticles(),
//           fetchAllPermissions()
//         ]);
        
//         if (id) {
//           await fetchUser(id);
//         }
//       } catch (error) {
//         const errorMessage = handleApiError(error, 'Initialization');
//         showApiErrorAlert(errorMessage, 'Initialization Error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     initializeData();
//   }, [id]);

//   const fetchUser = async (userId) => {
//     try {
//       const res = await axiosInstance.get(`/users/${userId}`);
//       const userData = res.data.data;
      
//       if (!userData) {
//         throw new Error('User data not found');
//       }
      
//       // Extract permission IDs
//       let userPermissions = [];
//       if (Array.isArray(userData.permissions)) {
//         userPermissions = userData.permissions
//           .map(p => {
//             if (!p) return null;
//             if (typeof p === 'string' && p.length > 0) return p;
//             if (typeof p === 'object') {
//               if (p._id) return p._id;
//               if (p.permission) {
//                 if (typeof p.permission === 'string') return p.permission;
//                 if (p.permission._id) return p.permission._id;
//               }
//             }
//             return null;
//           })
//           .filter(id => id !== null && id !== undefined);
//       }
      
//       // Extract verticle IDs
//       let userVerticles = [];
//       if (Array.isArray(userData.verticles)) {
//         userVerticles = userData.verticles.map(v => v._id || v.id);
//       }
//       if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//         userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
//       }
      
//       // Extract role ID
//       let userRoleId = '';
//       if (Array.isArray(userData.roles) && userData.roles.length > 0) {
//         userRoleId = userData.roles[0]._id || '';
//       }
      
//       // Extract subdealer ID - handle both string and object formats
//       let userSubdealerId = '';
//       if (userData.subdealer) {
//         if (typeof userData.subdealer === 'string') {
//           userSubdealerId = userData.subdealer;
//         } else if (typeof userData.subdealer === 'object') {
//           userSubdealerId = userData.subdealer._id || userData.subdealer.id || '';
//         }
//       }
      
//       // Extract branch ID
//       let userBranchId = '';
//       if (userData.branch) {
//         if (typeof userData.branch === 'string') {
//           userBranchId = userData.branch;
//         } else if (typeof userData.branch === 'object') {
//           userBranchId = userData.branch._id || '';
//         }
//       }
      
//       // Determine user type
//       let userType = 'employee';
//       if (userData.type === 'subdealer') {
//         userType = 'subdealer';
//       } else if (userData.subdealer) {
//         userType = 'subdealer';
//       }
      
//       setFormData({
//         name: userData.name || '',
//         type: userType,
//         branch: userBranchId,
//         subdealer: userSubdealerId,
//         roleId: userRoleId,
//         email: userData.email || '',
//         mobile: userData.mobile || '',
//         discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
//         permissions: userPermissions,
//         totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
//         perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
//         verticles: userVerticles
//       });

//       if (userRoleId) {
//         setShowPermissions(true);
//         await loadUserPermissions(userData);
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch User');
//       showApiErrorAlert(errorMessage, 'User Fetch Error');
//       throw error;
//     }
//   };

//   const loadUserPermissions = async (userData) => {
//     setIsLoadingPermissions(true);
//     try {
//       // Initialize permissions
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           // Initialize tab permissions
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Set main header access
//       if (userData.moduleAccess) {
//         Object.keys(userData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = Boolean(userData.moduleAccess[apiModuleName]);
//           }
//         });
//       }

//       // Set page permissions
//       if (userData.pageAccess) {
//         Object.keys(userData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && userData.pageAccess[apiModuleName]) {
//             Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = userData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   initialPagePermissions[pageKey][permType] = 
//                     Array.isArray(permissionsArray) && 
//                     permissionsArray.includes(permType.toUpperCase());
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Set tab permissions
//       if (userData.tabAccess) {
//         Object.keys(userData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && userData.tabAccess[apiModuleName]) {
//             Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   if (Array.isArray(permissions)) {
//                     permissions.forEach(perm => {
//                       const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                       initialTabPermissions[tabKey][permKey] = true;
//                     });
//                   }
//                 }
//               });
//             });
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);

//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Load Permissions');
//       showApiErrorAlert(errorMessage, 'Permissions Load Error');
//       throw error;
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, roles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Roles');
//       setFetchErrors(prev => ({ ...prev, roles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, branches: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Branches');
//       setFetchErrors(prev => ({ ...prev, branches: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//       setFetchErrors(prev => ({ ...prev, subdealers: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Subdealers');
//       setFetchErrors(prev => ({ ...prev, subdealers: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setVerticles(verticlesData);
//       setFetchErrors(prev => ({ ...prev, verticles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Verticles');
//       setFetchErrors(prev => ({ ...prev, verticles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//       setFetchErrors(prev => ({ ...prev, permissions: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Permissions');
//       setFetchErrors(prev => ({ ...prev, permissions: errorMessage }));
//       throw error;
//     }
//   };

//  const fetchRolePermissionsData = async (roleId) => {
//   if (!roleId) return;
  
//   setIsLoadingPermissions(true);
//   try {
//     const res = await axiosInstance.get(`/roles/${roleId}`);
//     const roleData = res.data.data;

//     if (!roleData) {
//       throw new Error('Role data not found');
//     }

//     // Initialize permissions
//     const initialMainHeaderAccess = {};
//     const initialPagePermissions = {};
//     const initialTabPermissions = {};

//     // Track all permission IDs from the role
//     let rolePermissionIds = [];

//     // First, set all to false
//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       initialMainHeaderAccess[mainHeader] = false;
      
//       const headerPages = sidebarStructure[mainHeader].pages;
//       headerPages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//           pagePerms[permType] = false;
//         });
//         initialPagePermissions[pageKey] = pagePerms;
        
//         // Initialize tab permissions
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               tabPerms[permType] = false;
//             });
//             initialTabPermissions[tabKey] = tabPerms;
//           });
//         }
//       });
//     });

//     // Now populate with role data
//     if (roleData.moduleAccess) {
//       Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && sidebarStructure[mainHeader]) {
//           initialMainHeaderAccess[mainHeader] = Boolean(roleData.moduleAccess[apiModuleName]);
//         }
//       });
//     }

//     if (roleData.pageAccess) {
//       Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && roleData.pageAccess[apiModuleName]) {
//           Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//             const pageKey = `${mainHeader}_${pageName}`;
//             const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
            
//             if (initialPagePermissions[pageKey]) {
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 const hasPermission = Array.isArray(permissionsArray) && 
//                   permissionsArray.includes(permType.toUpperCase());
                
//                 initialPagePermissions[pageKey][permType] = hasPermission;
                
//                 // If permission exists in role, find and add its ID
//                 if (hasPermission) {
//                   const apiModuleNames = moduleNameMap[mainHeader];
//                   const permission = permissionsList.find(perm => 
//                     apiModuleNames.some(apiModuleName => 
//                       perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                     ) && 
//                     perm.page === pageName && 
//                     perm.action === permType.toUpperCase() &&
//                     !perm.tab
//                   );
                  
//                   if (permission && !rolePermissionIds.includes(permission._id)) {
//                     rolePermissionIds.push(permission._id);
//                   }
//                 }
//               });
//             }
//           });
//         }
//       });
//     }

//     // Process tab access
//     if (roleData.tabAccess) {
//       Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && roleData.tabAccess[apiModuleName]) {
//           Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//             Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//               const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//               if (!pageConfig) return;
              
//               let matchingTab = null;
//               if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                 matchingTab = pageConfig.tabs.find(tab => 
//                   tab.toUpperCase() === tabName.toUpperCase()
//                 );
                
//                 if (!matchingTab) {
//                   const fuzzyMatches = {
//                     'PENDING APPROVALS': 'PENDING APPROVALS',
//                     'PENDING APPROVAL': 'PENDING APPROVALS',
//                     'APPROVED': 'APPROVED',
//                     'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                     'ALLOCATED': 'ALLOCATED',
//                     'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                     'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                     'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                     'SUBMITTED': 'SUBMITTED',
//                     'REJECTED': 'REJECTED'
//                   };
                  
//                   const upperTabName = tabName.toUpperCase();
//                   if (fuzzyMatches[upperTabName]) {
//                     matchingTab = fuzzyMatches[upperTabName];
//                   }
//                 }
//               }
              
//               if (matchingTab) {
//                 const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                 const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                
//                 if (!initialTabPermissions[tabKey]) {
//                   initialTabPermissions[tabKey] = {};
//                 }
                
//                 if (Array.isArray(permissions)) {
//                   permissions.forEach(perm => {
//                     const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                     initialTabPermissions[tabKey][permKey] = true;
                    
//                     // Add tab permission ID to the list
//                     const apiModuleNames = moduleNameMap[mainHeader];
//                     const permission = permissionsList.find(p => 
//                       apiModuleNames.some(apiModuleName => 
//                         p.module.toUpperCase() === apiModuleName.toUpperCase()
//                       ) && 
//                       p.page === pageName && 
//                       p.action === permKey &&
//                       p.tab === matchingTab
//                     );
                    
//                     if (permission && !rolePermissionIds.includes(permission._id)) {
//                       rolePermissionIds.push(permission._id);
//                     }
//                   });
//                 }
//               }
//             });
//           });
//         }
//       });
//     }

//     // Also check if role has direct permissions array
//     if (Array.isArray(roleData.permissions) && roleData.permissions.length > 0) {
//       roleData.permissions.forEach(perm => {
//         const permId = typeof perm === 'string' ? perm : (perm._id || perm.id);
//         if (permId && !rolePermissionIds.includes(permId)) {
//           rolePermissionIds.push(permId);
//         }
//       });
//     }

//     // Update all states
//     setMainHeaderAccess(initialMainHeaderAccess);
//     setPagePermissions(initialPagePermissions);
//     setTabPermissions(initialTabPermissions);
    
//     // Set the formData permissions with role permissions
//     // For new users, replace existing permissions with role permissions
//     // For existing users, preserve their custom permissions
//     setFormData(prev => ({
//       ...prev,
//       permissions: id ? [...prev.permissions, ...rolePermissionIds] : rolePermissionIds
//     }));

//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch Role Permissions');
//     showApiErrorAlert(errorMessage, 'Role Permissions Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   // Helper to find main header by module name
//   const findMainHeaderByModule = (moduleName) => {
//     if (!moduleName) return null;
    
//     const moduleUpper = moduleName.toUpperCase();
//     for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
//       if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
//         return mainHeader;
//       }
//     }
    
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//   // Helper to find subdealer role
//   const findSubdealerRole = () => {
//     if (!roles || roles.length === 0) return null;
    
//     return roles.find(role => 
//       role.name.toLowerCase() === 'subdealer' || 
//       role.name.toLowerCase().includes('subdealer')
//     );
//   };

//   // Helper to extract permission IDs from current visual state
// const extractPermissionIdsFromState = () => {
//   const permissionIds = [];
  
//   Object.keys(mainHeaderAccess).forEach(mainHeader => {
//     if (mainHeaderAccess[mainHeader]) {
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       sidebarStructure[mainHeader].pages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = pagePermissions[pageKey] || {};
        
//         // Add page permission IDs
//         Object.keys(pagePerms).forEach(permType => {
//           if (pagePerms[permType]) {
//             const permission = permissionsList.find(perm => 
//               apiModuleNames.some(apiModuleName => 
//                 perm.module.toUpperCase() === apiModuleName.toUpperCase()
//               ) && 
//               perm.page === page.name && 
//               perm.action === permType.toUpperCase() &&
//               !perm.tab
//             );
            
//             if (permission) {
//               permissionIds.push(permission._id);
//             }
//           }
//         });
        
//         // Add tab permission IDs
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = tabPermissions[tabKey] || {};
            
//             Object.keys(tabPerms).forEach(permType => {
//               if (tabPerms[permType]) {
//                 const permission = permissionsList.find(perm => 
//                   apiModuleNames.some(apiModuleName => 
//                     perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                   ) && 
//                   perm.page === page.name && 
//                   perm.action === permType.toUpperCase() &&
//                   perm.tab === tab
//                 );
                
//                 if (permission) {
//                   permissionIds.push(permission._id);
//                 }
//               }
//             });
//           });
//         }
//       });
//     }
//   });
  
//   return [...new Set(permissionIds)]; // Remove duplicates
// };

//  const handleChange = async (e) => {
//   const { name, value } = e.target;
  
//   try {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
      
//       // Clear existing permissions when selecting a new role (for new users)
//       if (!id) {
//         setFormData(prev => ({ 
//           ...prev, 
//           permissions: [] 
//         }));
//       }
      
//       // Fetch role permissions
//       await fetchRolePermissionsData(value);
//     }

//     if (name === 'type') {
//       if (value === 'subdealer') {
//         const subdealerRole = findSubdealerRole();
//         if (subdealerRole) {
//           // Clear permissions when switching to subdealer
//           setFormData(prev => ({ 
//             ...prev, 
//             type: value,
//             roleId: subdealerRole._id,
//             permissions: []
//           }));
//           await fetchRolePermissionsData(subdealerRole._id);
//           setShowPermissions(true);
//         }
//       } else {
//         setFormData(prev => ({ 
//           ...prev, 
//           type: value,
//           roleId: '',
//           subdealer: '',
//           permissions: [] // Clear permissions when switching from subdealer
//         }));
//         setShowPermissions(false);
//       }
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Handle Change');
//     showApiErrorAlert(errorMessage, 'Form Change Error');
//   }
// };

//   const handleVerticalChange = (e) => {
//     try {
//       const selectedId = e.target.value;
//       if (selectedId && !formData.verticles.includes(selectedId)) {
//         setFormData(prev => ({
//           ...prev,
//           verticles: [...prev.verticles, selectedId]
//         }));
//       }
//       setErrors(prev => ({ ...prev, verticles: '' }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Vertical Change');
//       showApiErrorAlert(errorMessage, 'Vertical Selection Error');
//     }
//   };

//   const removeVertical = (verticalId) => {
//     try {
//       setFormData(prev => {
//         const newVerticles = prev.verticles.filter(id => id !== verticalId);
//         return {
//           ...prev,
//           verticles: newVerticles
//         };
//       });
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Remove Vertical');
//       showApiErrorAlert(errorMessage, 'Vertical Removal Error');
//     }
//   };

//   const togglePageExpansion = (pageKey) => {
//     try {
//       setExpandedPages(prev => ({
//         ...prev,
//         [pageKey]: !prev[pageKey]
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Toggle Page Expansion');
//       showApiErrorAlert(errorMessage, 'UI Error');
//     }
//   };

//   // Check if a permission exists in the system
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return false;
      
//       return permissionsList.some(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
//       );
//     } catch (error) {
//       console.error('Error checking permission existence:', error);
//       return false;
//     }
//   };

//   // Get all tab permissions that exist in API for a page
//   const getAvailableTabsForPage = (mainHeader, page) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return [];
      
//       const tabs = new Set();
//       permissionsList.forEach(perm => {
//         if (apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.tab) {
//           tabs.add(perm.tab);
//         }
//       });
      
//       return Array.from(tabs);
//     } catch (error) {
//       console.error('Error getting available tabs:', error);
//       return [];
//     }
//   };

//   // Handle page permission change
//   const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: {
//           ...prev[pageKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         !perm.tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Page Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle tab permission change
//   const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: {
//           ...prev[tabKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         perm.tab === tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Tab Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all permissions for a page
//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
//         if (permissionExists) {
//           newPagePerms[permType] = true;
          
//           const permission = permissionsList.find(perm => 
//             apiModuleNames.some(apiModuleName => 
//               perm.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             perm.page === page && 
//             perm.action === permType.toUpperCase() &&
//             !perm.tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         } else {
//           newPagePerms[permType] = false;
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all permissions for a page
//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         newPagePerms[permType] = false;
        
//         const permission = permissionsList.find(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           perm.page === page && 
//           perm.action === permType.toUpperCase() &&
//           !perm.tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all tab permissions
//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(perm => {
//         const exists = checkPermissionExists(mainHeader, page, perm, tab);
//         newPerms[perm] = perm === "VIEW" ? exists : false;
        
//         if (perm === "VIEW" && exists) {
//           const permission = permissionsList.find(p => 
//             apiModuleNames.some(apiModuleName => 
//               p.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             p.page === page && 
//             p.action === "VIEW" &&
//             p.tab === tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all tab permissions
//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       const newPerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//         newPerms[perm] = false;
        
//         const permission = permissionsList.find(p => 
//           apiModuleNames.some(apiModuleName => 
//             p.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           p.page === page && 
//           p.action === perm.toUpperCase() &&
//           p.tab === tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle global actions for the three buttons
//   const handleGlobalAction = (actionType) => {
//     try {
//       switch (actionType) {
//         case 'none':
//           setFormData(prev => ({ ...prev, permissions: [] }));
          
//           const clearedPagePermissions = {};
//           const clearedTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = false;
//               });
//               clearedPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = false;
//                   });
//                   clearedTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(clearedPagePermissions);
//           setTabPermissions(clearedTabPermissions);
//           break;
          
//         case 'selectAll':
//           const allPermissionIds = permissionsList.map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
          
//           const allPagePermissions = {};
//           const allTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//               });
//               allPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                   });
//                   allTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(allPagePermissions);
//           setTabPermissions(allTabPermissions);
//           break;
          
//         case 'viewOnly':
//           const viewPermissionIds = permissionsList
//             .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
//             .map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
          
//           const viewPagePermissions = {};
//           const viewTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 if (permType === 'VIEW') {
//                   pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//                 } else {
//                   pagePerms[permType] = false;
//                 }
//               });
//               viewPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     if (permType === 'VIEW') {
//                       tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                     } else {
//                       tabPerms[permType] = false;
//                     }
//                   });
//                   viewTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(viewPagePermissions);
//           setTabPermissions(viewTabPermissions);
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Global Permission Action');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle main header access change
//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     try {
//       setMainHeaderAccess(prev => ({
//         ...prev,
//         [mainHeader]: hasAccess
//       }));

//       if (!hasAccess) {
//         const newPagePermissions = { ...pagePermissions };
//         const newTabPermissions = { ...tabPermissions };
        
//         sidebarStructure[mainHeader].pages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const perms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//             perms[perm] = false;
//           });
//           newPagePermissions[pageKey] = perms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//                 tabPerms[perm] = false;
//               });
//               newTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
        
//         setPagePermissions(newPagePermissions);
//         setTabPermissions(newTabPermissions);
        
//         const apiModuleNames = moduleNameMap[mainHeader];
//         const modulePermissions = permissionsList.filter(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           )
//         );
//         const modulePermissionIds = modulePermissions.map(perm => perm._id);
        
//         setFormData(prev => ({
//           ...prev,
//           permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
//         }));
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Main Header Access Change');
//       showApiErrorAlert(errorMessage, 'Access Control Error');
//     }
//   };

//   // Render permissions table for a page
//   const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
//     try {
//       const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
//       const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       // For tabs, only show VIEW permission (renamed to "Access")
//       const displayPermissions = isTab ? ["VIEW"] : availablePermissions;
      
//       return (
//         <CTable bordered responsive hover small className="permission-table mt-2">
//           <CTableHead color="light">
//             <CTableRow>
//               <CTableHeaderCell scope="col" className="text-nowrap">
//                 {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
//               </CTableHeaderCell>
//               {displayPermissions.map((perm) => (
//                 <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
//                   {getPermissionDisplayLabel(perm, isTab)}
//                 </CTableHeaderCell>
//               ))}
//               <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             <CTableRow>
//               <CTableDataCell>
//                 <strong>{isTab ? tabName : page}</strong>
//               </CTableDataCell>
//               {displayPermissions.map((perm) => {
//                 const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
//                 const isChecked = permissions[perm] || false;
                
//                 return (
//                   <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
//                     {permissionExists ? (
//                       <CFormCheck
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={(e) => {
//                           if (isTab) {
//                             handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
//                           } else {
//                             handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
//                           }
//                         }}
//                         aria-label={`${page}-${perm}`}
//                         title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
//                       />
//                     ) : (
//                       <span className="text-muted" title="Permission not available in system">
//                         N/A
//                       </span>
//                     )}
//                   </CTableDataCell>
//                 );
//               })}
//               <CTableDataCell className="text-center">
//                 <CButtonGroup size="sm">
//                   <CButton 
//                     color="primary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleSelectAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleSelectAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Select all available permissions"
//                   >
//                     All
//                   </CButton>
//                   <CButton 
//                     color="secondary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleClearAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleClearAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Clear all permissions"
//                   >
//                     None
//                   </CButton>
//                 </CButtonGroup>
//               </CTableDataCell>
//             </CTableRow>
//           </CTableBody>
//         </CTable>
//       );
//     } catch (error) {
//       console.error('Error rendering permissions table:', error);
//       return (
//         <CAlert color="danger">
//           Error rendering permissions table. Please refresh the page.
//         </CAlert>
//       );
//     }
//   };

//   const validateForm = () => {
//     try {
//       const newErrors = {};
//       if (!formData.name.trim()) newErrors.name = 'Name is required';
//       if (!formData.type) newErrors.type = 'Type is required';
      
//       if (formData.type === 'employee') {
//         if (!formData.branch) newErrors.branch = 'Branch is required for employee';
//         if (!formData.roleId) newErrors.roleId = 'Role is required for employee';
//       }
      
//       if (formData.type === 'subdealer') {
//         if (!formData.subdealer) newErrors.subdealer = 'Subdealer is required';
//         // Role is auto-selected for subdealer, so no validation needed
//       }
      
//       if (!formData.email.trim()) newErrors.email = 'Email is required';
//       if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
//       if (!formData.discount) newErrors.discount = 'Discount is required';
      
//       // Email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (formData.email && !emailRegex.test(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
      
//       // Mobile validation (basic)
//       const mobileRegex = /^[0-9]{10}$/;
//       if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
//         newErrors.mobile = 'Please enter a valid 10-digit mobile number';
//       }
      
//       const selectedRole = roles.find(role => role._id === formData.roleId);
//       if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
//         if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//         if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
        
//         // Validate numeric values
//         if (formData.totalDeviationAmount && isNaN(parseFloat(formData.totalDeviationAmount))) {
//           newErrors.totalDeviationAmount = 'Please enter a valid number';
//         }
//         if (formData.perTransactionDeviationLimit && isNaN(parseFloat(formData.perTransactionDeviationLimit))) {
//           newErrors.perTransactionDeviationLimit = 'Please enter a valid number';
//         }
//       }
      
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Form Validation');
//       showApiErrorAlert(errorMessage, 'Validation Error');
//       return false;
//     }
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) return;

//   setIsLoading(true);
  
//   try {
//     // Sync permissions from visual state to formData
//     const syncedPermissionIds = extractPermissionIdsFromState();
    
//     // Filter out null/undefined values from permissions
//     const validPermissions = [...new Set([...syncedPermissionIds, ...formData.permissions])].filter(perm => 
//       perm !== null && perm !== undefined && perm !== ''
//     );
    
//     const payload = {
//       name: formData.name.trim(),
//       type: formData.type,
//       roleId: formData.roleId,
//       email: formData.email.trim(),
//       mobile: formData.mobile.trim(),
//       permissions: validPermissions,
//       verticles: formData.verticles,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//       ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
//       ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
//       ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//       ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//     };

//     console.log('Submitting payload:', payload);
//     console.log('Permission count:', validPermissions.length);

//     if (id) {
//       await axiosInstance.put(`/users/${id}`, payload);
//       await refreshPermissions();
//       await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//     } else {
//       await axiosInstance.post('/auth/register', payload);
//       await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Submit Form');
    
//     // Show detailed error in alert
//     showApiErrorAlert(errorMessage, 'Submission Error');
    
//     // Also show the sweet alert for form submission errors
//     showFormSubmitError(error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  
//   const getSelectedVerticalNames = () => {
//     return formData.verticles.map(item => {
//       const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
//       const vertical = verticles.find(v => 
//         v._id === verticalId || v.id === verticalId
//       );
//       return vertical ? vertical.name || String(verticalId) : String(verticalId);
//     });
//   };

//   // Render fetch errors if any
//   const renderFetchErrors = () => {
//     const errorMessages = Object.entries(fetchErrors)
//       .filter(([_, error]) => error !== null)
//       .map(([key, error]) => `${key}: ${error}`);

//     if (errorMessages.length === 0) return null;

//     return (
//       <CAlert color="warning" className="mb-3">
//         <div className="d-flex align-items-center">
//           <CIcon icon={cilWarning} className="me-2" />
//           <div>
//             <strong>Some data failed to load:</strong>
//             <ul className="mb-0 mt-1">
//               {errorMessages.map((msg, index) => (
//                 <li key={index}>{msg}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </CAlert>
//     );
//   };

//   if (isLoading && !id) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//         <span className="ms-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       {/* Global API Error Alert */}
//       {apiError && (
//         <CAlert 
//           color="danger" 
//           className="mb-3" 
//           dismissible
//           onClose={() => setApiError(null)}
//         >
//           <div className="d-flex align-items-center">
//             <CIcon icon={cilWarning} className="me-2" />
//             <div>
//               <strong>{apiError.context}</strong>
//               <p className="mb-0">{apiError.message}</p>
//             </div>
//           </div>
//         </CAlert>
//       )}

//       {/* Fetch Errors Alert */}
//       {renderFetchErrors()}

//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <FormErrorBoundary section="User Details">
//               <div className="user-details">
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Name</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="text" 
//                       name="name" 
//                       value={formData.name} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="Enter full name"
//                     />
//                   </CInputGroup>
//                   {errors.name && <p className="error">{errors.name}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPeople} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="type" 
//                       value={formData.type} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                     >
//                       <option value="employee">Employee</option>
//                       <option value="subdealer">Subdealer</option>
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.type && <p className="error">{errors.type}</p>}
//                 </div>
                
//                 {formData.type === 'employee' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Branch</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="branch" 
//                         value={formData.branch} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.branches}
//                       >
//                         <option value="">-Select-</option>
//                         {branches.map(branch => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.branch && <p className="error">{errors.branch}</p>}
//                     {fetchErrors.branches && (
//                       <small className="text-warning">Branches data unavailable: {fetchErrors.branches}</small>
//                     )}
//                   </div>
//                 )}

//                 {formData.type === 'subdealer' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="subdealer" 
//                         value={formData.subdealer} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.subdealers}
//                       >
//                         <option value="">-Select Subdealer-</option>
//                         {subdealers.map(subdealer => (
//                           <option key={subdealer.id} value={subdealer.id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {fetchErrors.subdealers && (
//                       <small className="text-warning">Subdealers data unavailable: {fetchErrors.subdealers}</small>
//                     )}
//                   </div>
//                 )}
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Role</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="roleId" 
//                       value={formData.roleId} 
//                       onChange={handleChange}
//                       disabled={isLoading || fetchErrors.roles || formData.type === 'subdealer'}
//                     >
//                       <option value="">-Select-</option>
//                       {roles.map(role => (
//                         <option key={role._id} value={role._id}>
//                           {role.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.roleId && <p className="error">{errors.roleId}</p>}
//                   {formData.type === 'subdealer' ? (
//                     <small className="text-muted">Role is automatically set to Subdealer and cannot be changed</small>
//                   ) : (
//                     <small className="text-muted">Select the role for this user</small>
//                   )}
//                   {fetchErrors.roles && (
//                     <small className="text-warning">Roles data unavailable: {fetchErrors.roles}</small>
//                   )}
//                 </div>
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Email</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilEnvelopeClosed} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="email" 
//                       name="email" 
//                       value={formData.email} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="user@example.com"
//                     />
//                   </CInputGroup>
//                   {errors.email && <p className="error">{errors.email}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Mobile number</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPhone} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="tel" 
//                       name="mobile" 
//                       value={formData.mobile} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="10-digit mobile number"
//                     />
//                   </CInputGroup>
//                   {errors.mobile && <p className="error">{errors.mobile}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Discount</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilDollar} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="number" 
//                       name="discount" 
//                       value={formData.discount} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       min="0"
//                       step="0.01"
//                       placeholder="0.00"
//                     />
//                   </CInputGroup>
//                   {errors.discount && <p className="error">{errors.discount}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Verticles</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilTag} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="vertical" 
//                       value="" 
//                       onChange={handleVerticalChange}
//                       disabled={isLoading || fetchErrors.verticles}
//                     >
//                       <option value="">-Select Verticle-</option>
//                       {verticles
//                         .filter(vertical => vertical.status === 'active')
//                         .map(vertical => (
//                           <option 
//                             key={vertical._id} 
//                             value={vertical._id}
//                             disabled={formData.verticles.includes(vertical._id)}
//                           >
//                             {vertical.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
                  
//                   <div className="mt-2">
//                     <div className="d-flex flex-wrap gap-2">
//                       {getSelectedVerticalNames().map((verticalName, index) => {
//                         const verticalId = formData.verticles[index];
//                         return (
//                           <CBadge 
//                             key={`${verticalId}_${index}`} 
//                             color="primary"
//                             className="d-flex align-items-center"
//                             style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//                           >
//                             {String(verticalName)}
//                             <CCloseButton 
//                               className="ms-2"
//                               onClick={() => removeVertical(verticalId)}
//                               style={{ fontSize: '0.75rem' }}
//                               disabled={isLoading}
//                             />
//                           </CBadge>
//                         );
//                       })}
//                     </div>
//                     <small className="text-muted">
//                       {formData.verticles.length} verticle(s) selected (Optional)
//                     </small>
//                     {fetchErrors.verticles && (
//                       <small className="text-warning d-block">Verticles data unavailable: {fetchErrors.verticles}</small>
//                     )}
//                   </div>
//                 </div>

//                 {isManager && (
//                   <>
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Total Deviation Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="totalDeviationAmount" 
//                           value={formData.totalDeviationAmount} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                     </div>

//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Per Transaction Deviation Limit</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="perTransactionDeviationLimit" 
//                           value={formData.perTransactionDeviationLimit} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </FormErrorBoundary>

//             {showPermissions && (
//               <FormErrorBoundary section="Permissions Configuration">
//                 <div className="permissions-container mt-4">
//                   <h5 className="mb-3">User Permissions Configuration</h5>
//                   <p className="text-muted mb-4">
//                     These permissions are in addition to the role permissions. 
//                     Total system permissions: {permissionsList.length}
//                     {fetchErrors.permissions && (
//                       <span className="text-warning ms-2">(Permissions data incomplete: {fetchErrors.permissions})</span>
//                     )}
//                   </p>
                  
//                   {/* Three global permission buttons added here */}
//                   <div className="mb-3">
//                     <CButtonGroup>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('none')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         None
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('selectAll')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         Select All
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('viewOnly')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         View Only
//                       </CButton>
//                     </CButtonGroup>
//                   </div>

//                   {isLoadingPermissions ? (
//                     <div className="d-flex justify-content-center align-items-center py-4">
//                       <CSpinner color="primary" />
//                       <span className="ms-2">Loading permissions...</span>
//                     </div>
//                   ) : (
//                     <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                       {Object.keys(sidebarStructure).map((mainHeader) => {
//                         const hasAccess = mainHeaderAccess[mainHeader] || false;
//                         const pageCount = sidebarStructure[mainHeader].pages.length;

//                         return (
//                           <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                             <CAccordionHeader>
//                               <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//                                 <div>
//                                   <h6 className="mb-0">{mainHeader}</h6>
//                                   <small className="text-muted">{pageCount} pages</small>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2">
//                                   <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//                                     {hasAccess ? 'Access Granted' : 'No Access'}
//                                   </CBadge>
//                                   <div className="d-flex" role="group">
//                                     <button
//                                       type="button"
//                                       className={`btn btn-sm ${hasAccess ? 'btn-success' : 'btn-secondary'} btn-outline me-1`}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, true);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilCheck} /> Yes
//                                     </button>
//                                     <button
//                                       type="button"
//                                       className={`btn btn-sm ${!hasAccess ? 'btn-danger' : 'btn-secondary'} btn-outline`}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, false);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilX} /> No
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CAccordionHeader>
//                             <CAccordionBody>
//                               {hasAccess ? (
//                                 <div className="pages-permissions">
//                                   {sidebarStructure[mainHeader].pages.map((page) => {
//                                     const pageKey = `${mainHeader}_${page.name}`;
//                                     const isExpanded = expandedPages[pageKey] || false;
//                                     const pageHasTabs = page.tabs && page.tabs.length > 0;
//                                     const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                                     const hasTabPermissions = availableTabs.length > 0;
                                    
//                                     return (
//                                       <CCard key={pageKey} className="mb-3">
//                                         <CCardBody>
//                                           <div className="d-flex justify-content-between align-items-center mb-2">
//                                             <h6 className="mb-0">{page.name}</h6>
//                                             <div className="d-flex align-items-center gap-2">
//                                               {pageHasTabs && hasTabPermissions && (
//                                                 <CButton
//                                                   size="sm"
//                                                   color="link"
//                                                   onClick={() => togglePageExpansion(pageKey)}
//                                                   className="p-0"
//                                                   disabled={isLoading || isLoadingPermissions}
//                                                 >
//                                                   {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                                 </CButton>
//                                               )}
//                                             </div>
//                                           </div>
                                          
//                                           {/* Page-level permissions */}
//                                           {renderPermissionsTable(mainHeader, page.name, false)}
                                          
//                                           {/* Tab-level permissions (if available) */}
//                                           {pageHasTabs && hasTabPermissions && (
//                                             <CCollapse visible={isExpanded}>
//                                               <div className="mt-3">
//                                                 <h6 className="mb-2">Tab Permissions</h6>
//                                                 {availableTabs.map((tab) => (
//                                                   <div key={`${pageKey}_${tab}`} className="mb-3">
//                                                     {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             </CCollapse>
//                                           )}
//                                         </CCardBody>
//                                       </CCard>
//                                     );
//                                   })}
//                                 </div>
//                               ) : (
//                                 <div className="text-center py-4">
//                                   <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                                   <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                                   <small>Click "Yes" to grant access and configure permissions</small>
//                                 </div>
//                               )}
//                             </CAccordionBody>
//                           </CAccordionItem>
//                         );
//                       })}
//                     </CAccordion>
//                   )}
//                 </div>
//               </FormErrorBoundary>
//             )}

//             <div className="form-footer">
//               <button 
//                 type="submit" 
//                 className="cancel-button"
//                 disabled={isLoading || isLoadingPermissions}
//               >
//                 {isLoading ? (
//                   <>
//                     <CSpinner size="sm" className="me-2" />
//                     {id ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//               <button 
//                 type="button" 
//                 className="submit-button" 
//                 onClick={handleCancel}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;



















// import React, { useState, useEffect, useContext } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CCard,
//   CCardBody,
//   CCollapse
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich, cilWarning } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../../context/AuthContext';

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete",
//   "READ": "View",
//   "WRITE": "Edit"
// };

// // Tab permission label mapping (only show "Access" instead of "VIEW" for tabs)
// const tabPermissionLabelMap = {
//   "VIEW": "Access",
//   "CREATE": "Create",
//   "UPDATE": "Update", 
//   "DELETE": "Delete"
// };

// // Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
// const sidebarStructure = {
//   "Dashboard": {
//     pages: [{
//       name: "Dashboard",
//       tabs: null
//     }],
//     availablePermissions: ["VIEW"]
//   },
//   "Purchase": {
//     pages: [
//       { name: "Inward Stock", tabs: null },
//       { 
//         name: "Stock Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
//       },
//       { name: "Stock Transfer", tabs: null },
//       { name: "Upload Challan", tabs: null },
//       { name: "RTO Chassis", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       },
//       { name: "Self Insurance", tabs: null },
//       { name: "Delivery Challan", tabs: null },
//       { name: "GST Invoice", tabs: null },
//       { name: "Helmet Invoice", tabs: null },
//       { name: "Deal Form", tabs: null },
//       { name: "Upload Deal Form & Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales Report": {
//     pages: [
//       { name: "Sales Person Wise", tabs: null },
//       { name: "Periodic Report", tabs: null }
//     ],
//     availablePermissions: ["VIEW"]
//   },
//   "Quotation": {
//     pages: [
//       { name: "Quotation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Account": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Receipts", 
//         tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
//       },
//       { name: "Debit Note", tabs: null },
//       { name: "Refund", tabs: null },
//       { 
//         name: "Cancelled Booking", 
//         tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
//       },
//       { name: "All Receipts", tabs: null },
//       { name: "Ledgers", tabs: null },
//       { name: "Exchange Ledger", tabs: null },
//       { 
//         name: "Broker Payment Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Insurance": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Insurance Details", 
//         tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "RTO": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Application", 
//         tabs: ["RTO PENDING", "APPLIED FOR"]
//       },
//       { 
//         name: "RTO Paper", 
//         tabs: ["RTO PAPER PENDING", "COMPLETED"]
//       },
//       { 
//         name: "RTO Tax", 
//         tabs: ["RTO PENDING TAX", "TAX PAID"]
//       },
//       { 
//         name: "HSRP Ordering", 
//         tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
//       },
//       { 
//         name: "HSRP Installation", 
//         tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
//       },
//       { 
//         name: "RC Confirmation", 
//         tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Management": {
//     pages: [
//       { name: "Cash Voucher", tabs: null },
//       { name: "Contra Voucher", tabs: null },
//       { 
//         name: "Contra Approval", 
//         tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
//       },
//       { name: "Workshop Cash Receipt", tabs: null },
//       { name: "All Cash Receipt", tabs: null },
//       { name: "Cash Book", tabs: null },
//       { name: "Day Book", tabs: null },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Masters": {
//     pages: [
//       { name: "Location", tabs: null },
//       { name: "Headers", tabs: null },
//       { name: "Vehicles", tabs: null },
//       { name: "Minimum Booking Amount", tabs: null },
//       { name: "Template List", tabs: null },
//       { name: "Accessories", tabs: null },
//       { name: "Colour", tabs: null },
//       { name: "Documents", tabs: null },
//       { name: "Terms & Conditions", tabs: null },
//       { name: "Offer", tabs: null },
//       { name: "Attachments", tabs: null },
//       { name: "Declaration", tabs: null },
//       { name: "RTO", tabs: null },
//       { name: "Financer", tabs: null },
//       { name: "Finance Rates", tabs: null },
//       { name: "Insurance Providers", tabs: null },
//       { name: "Brokers", tabs: null },
//       { name: "Broker Commission Range", tabs: null },
//       { name: "Vertical Masters", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Master": {
//     pages: [
//       { name: "Cash Account Master", tabs: null },
//       { name: "Bank Account Master", tabs: null },
//       { name: "Payment Mode", tabs: null },
//       { name: "Expense Master", tabs: null },
//       { name: "Add Opening Balance", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Accessories Billing": {
//     pages: [
//       { name: "Accessories Billing", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Customers": {
//     pages: [
//       { name: "Customers", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer": {
//     pages: [
//       { 
//         name: "Subdealer Stock Audit", 
//         tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Master": {
//     pages: [
//       { name: "Subdealer List", tabs: null },
//       { name: "Subdealer Audit List", tabs: null },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Calculate Commission", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Booking": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
//       },
//       { name: "Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Management": {
//     pages: [
//       { 
//         name: "Subdealer Management", 
//         tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Account": {
//     pages: [
//       { name: "Add Balance", tabs: null },
//       { name: "OnAccount Balance", tabs: null },
//       { name: "Add Amount", tabs: null },
//       { 
//         name: "Finance Payment", 
//         tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
//       },
//       { 
//         name: "Payment Verification", 
//         tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
//       },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Payment Summary", tabs: null },
//       { 
//         name: "Subdealer Ledger", 
//         tabs: ["SUB DEALER", "SUB DEALER UTR"]
//       },
//       { name: "Customer Ledger", tabs: null },
//       { 
//         name: "Summary", 
//         tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "User Management": {
//     pages: [
//       { name: "Create Role", tabs: null },
//       { name: "All Role", tabs: null },
//       { name: "Add User", tabs: null },
//       { name: "User List", tabs: null },
//       { name: "Buffer Report", tabs: null },
//       { name: "Manager Deviation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   }
// };

// // Map sidebar module names to API module names
// const moduleNameMap = {
//   "Dashboard": ["DASHBOARD"],
//   "Purchase": ["PURCHASE"],
//   "Sales": ["SALES"],
//   "Sales Report": ["SALES REPORT", "SALES_REPORT"],
//   "Quotation": ["QUOTATION"],
//   "Account": ["ACCOUNT"],
//   "Insurance": ["INSURANCE"],
//   "RTO": ["RTO"],
//   "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
//   "Masters": ["MASTERS"],
//   "Fund Master": ["FUND MASTER", "FUND_MASTER"],
//   "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
//   "Customers": ["CUSTOMERS"],
//   "Subdealer": ["SUBDEALER"],
//   "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
//   "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
//   "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
//   "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   if (isTab) {
//     return tabPermissionLabelMap[permission] || permission;
//   }
//   return permissionLabelMap[permission] || permission;
// };

// // Error boundary component for form sections
// const FormErrorBoundary = ({ children, section }) => {
//   const [hasError, setHasError] = useState(false);
//   const [error, setError] = useState(null);

//   return hasError ? (
//     <CAlert color="danger" className="mt-3">
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilWarning} className="me-2" />
//         <div>
//           <strong>Error in {section}</strong>
//           <p className="mb-0">{error?.message || 'An unexpected error occurred'}</p>
//         </div>
//       </div>
//     </CAlert>
//   ) : (
//     <ErrorBoundaryWrapper setHasError={setHasError} setError={setError}>
//       {children}
//     </ErrorBoundaryWrapper>
//   );
// };

// const ErrorBoundaryWrapper = ({ children, setHasError, setError }) => {
//   useEffect(() => {
//     const errorHandler = (error) => {
//       console.error('Component error:', error);
//       setHasError(true);
//       setError(error);
//     };
    
//     window.addEventListener('error', errorHandler);
//     return () => window.removeEventListener('error', errorHandler);
//   }, [setHasError, setError]);
  
//   return children;
// };

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealer: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchErrors, setFetchErrors] = useState({
//     roles: null,
//     branches: null,
//     subdealers: null,
//     verticles: null,
//     permissions: null
//   });
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const { refreshPermissions, user: authUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Check if logged-in user is a subdealer
//   const isLoggedInSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const loggedInUserSubdealerId = authUser?.subdealer?._id;
//   const loggedInUserSubdealerName = authUser?.subdealer?.name;

//   // Error handling utility functions
//   const handleApiError = (error, context = 'Operation') => {
//     console.error(`${context} error:`, error);
    
//     let errorMessage = 'An unexpected error occurred';
    
//     if (error.response) {
//       // Server responded with error status
//       const { data, status } = error.response;
      
//       if (data && data.message) {
//         errorMessage = data.message;
//       } else if (status === 401) {
//         errorMessage = 'Authentication failed. Please login again.';
//       } else if (status === 403) {
//         errorMessage = 'You do not have permission to perform this action.';
//       } else if (status === 404) {
//         errorMessage = 'Resource not found.';
//       } else if (status >= 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else {
//         errorMessage = `Request failed with status ${status}`;
//       }
//     } else if (error.request) {
//       // Request made but no response
//       errorMessage = 'Network error. Please check your connection.';
//     } else {
//       // Something else happened
//       errorMessage = error.message || errorMessage;
//     }
    
//     return errorMessage;
//   };

//   const showApiErrorAlert = (errorMessage, context = 'Error') => {
//     setApiError({
//       message: errorMessage,
//       context: context,
//       timestamp: new Date().toISOString()
//     });
    
//     // Auto-clear after 10 seconds
//     setTimeout(() => {
//       setApiError(null);
//     }, 10000);
//   };

//   // Handle role auto-selection when type changes to subdealer
//   useEffect(() => {
//     if (formData.type === 'subdealer' && roles.length > 0 && !formData.roleId) {
//       const subdealerRole = roles.find(role => 
//         role.name.toLowerCase() === 'subdealer' || 
//         role.name.toLowerCase().includes('subdealer')
//       );
      
//       if (subdealerRole) {
//         setFormData(prev => ({ 
//           ...prev, 
//           roleId: subdealerRole._id
//         }));
        
//         // Load permissions for subdealer role
//         fetchRolePermissionsData(subdealerRole._id);
//         setShowPermissions(true);
//       }
//     }
//   }, [formData.type, roles, formData.roleId]);

//   // Also handle when user switches from subdealer back to employee
//   useEffect(() => {
//     if (formData.type !== 'subdealer' && !id) {
//       // For new users, clear role when switching from subdealer to employee
//       setFormData(prev => ({ 
//         ...prev, 
//         roleId: '',
//         subdealer: ''
//       }));
//       setShowPermissions(false);
//     }
//   }, [formData.type, id]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//         showApiErrorAlert('Invalid authentication token. Please login again.', 'Authentication');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setIsLoading(true);
//         await Promise.all([
//           fetchRoles(),
//           fetchBranches(),
//           fetchSubdealers(),
//           fetchVerticles(),
//           fetchAllPermissions()
//         ]);
        
//         if (id) {
//           await fetchUser(id);
//         }
//       } catch (error) {
//         const errorMessage = handleApiError(error, 'Initialization');
//         showApiErrorAlert(errorMessage, 'Initialization Error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     initializeData();
//   }, [id]);

//   const fetchUser = async (userId) => {
//     try {
//       const res = await axiosInstance.get(`/users/${userId}`);
//       const userData = res.data.data;
      
//       if (!userData) {
//         throw new Error('User data not found');
//       }
      
//       // Extract permission IDs
//       let userPermissions = [];
//       if (Array.isArray(userData.permissions)) {
//         userPermissions = userData.permissions
//           .map(p => {
//             if (!p) return null;
//             if (typeof p === 'string' && p.length > 0) return p;
//             if (typeof p === 'object') {
//               if (p._id) return p._id;
//               if (p.permission) {
//                 if (typeof p.permission === 'string') return p.permission;
//                 if (p.permission._id) return p.permission._id;
//               }
//             }
//             return null;
//           })
//           .filter(id => id !== null && id !== undefined);
//       }
      
//       // Extract verticle IDs
//       let userVerticles = [];
//       if (Array.isArray(userData.verticles)) {
//         userVerticles = userData.verticles.map(v => v._id || v.id);
//       }
//       if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//         userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
//       }
      
//       // Extract role ID
//       let userRoleId = '';
//       if (Array.isArray(userData.roles) && userData.roles.length > 0) {
//         userRoleId = userData.roles[0]._id || '';
//       }
      
//       // Extract subdealer ID - handle both string and object formats
//       let userSubdealerId = '';
//       if (userData.subdealer) {
//         if (typeof userData.subdealer === 'string') {
//           userSubdealerId = userData.subdealer;
//         } else if (typeof userData.subdealer === 'object') {
//           userSubdealerId = userData.subdealer._id || userData.subdealer.id || '';
//         }
//       }
      
//       // Extract branch ID
//       let userBranchId = '';
//       if (userData.branch) {
//         if (typeof userData.branch === 'string') {
//           userBranchId = userData.branch;
//         } else if (typeof userData.branch === 'object') {
//           userBranchId = userData.branch._id || '';
//         }
//       }
      
//       // Determine user type
//       let userType = 'employee';
//       if (userData.type === 'subdealer') {
//         userType = 'subdealer';
//       } else if (userData.subdealer) {
//         userType = 'subdealer';
//       }
      
//       setFormData({
//         name: userData.name || '',
//         type: userType,
//         branch: userBranchId,
//         subdealer: userSubdealerId,
//         roleId: userRoleId,
//         email: userData.email || '',
//         mobile: userData.mobile || '',
//         discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
//         permissions: userPermissions,
//         totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
//         perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
//         verticles: userVerticles
//       });

//       if (userRoleId) {
//         setShowPermissions(true);
//         await loadUserPermissions(userData);
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch User');
//       showApiErrorAlert(errorMessage, 'User Fetch Error');
//       throw error;
//     }
//   };

//   const loadUserPermissions = async (userData) => {
//     setIsLoadingPermissions(true);
//     try {
//       // Initialize permissions
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           // Initialize tab permissions
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Set main header access
//       if (userData.moduleAccess) {
//         Object.keys(userData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = Boolean(userData.moduleAccess[apiModuleName]);
//           }
//         });
//       }

//       // Set page permissions
//       if (userData.pageAccess) {
//         Object.keys(userData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && userData.pageAccess[apiModuleName]) {
//             Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = userData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   initialPagePermissions[pageKey][permType] = 
//                     Array.isArray(permissionsArray) && 
//                     permissionsArray.includes(permType.toUpperCase());
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Set tab permissions
//       if (userData.tabAccess) {
//         Object.keys(userData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && userData.tabAccess[apiModuleName]) {
//             Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   if (Array.isArray(permissions)) {
//                     permissions.forEach(perm => {
//                       const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                       initialTabPermissions[tabKey][permKey] = true;
//                     });
//                   }
//                 }
//               });
//             });
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);

//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Load Permissions');
//       showApiErrorAlert(errorMessage, 'Permissions Load Error');
//       throw error;
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, roles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Roles');
//       setFetchErrors(prev => ({ ...prev, roles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, branches: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Branches');
//       setFetchErrors(prev => ({ ...prev, branches: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//       setFetchErrors(prev => ({ ...prev, subdealers: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Subdealers');
//       setFetchErrors(prev => ({ ...prev, subdealers: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setVerticles(verticlesData);
//       setFetchErrors(prev => ({ ...prev, verticles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Verticles');
//       setFetchErrors(prev => ({ ...prev, verticles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//       setFetchErrors(prev => ({ ...prev, permissions: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Permissions');
//       setFetchErrors(prev => ({ ...prev, permissions: errorMessage }));
//       throw error;
//     }
//   };

//  const fetchRolePermissionsData = async (roleId) => {
//   if (!roleId) return;
  
//   setIsLoadingPermissions(true);
//   try {
//     const res = await axiosInstance.get(`/roles/${roleId}`);
//     const roleData = res.data.data;

//     if (!roleData) {
//       throw new Error('Role data not found');
//     }

//     // Initialize permissions
//     const initialMainHeaderAccess = {};
//     const initialPagePermissions = {};
//     const initialTabPermissions = {};

//     // Track all permission IDs from the role
//     let rolePermissionIds = [];

//     // First, set all to false
//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       initialMainHeaderAccess[mainHeader] = false;
      
//       const headerPages = sidebarStructure[mainHeader].pages;
//       headerPages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//           pagePerms[permType] = false;
//         });
//         initialPagePermissions[pageKey] = pagePerms;
        
//         // Initialize tab permissions
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               tabPerms[permType] = false;
//             });
//             initialTabPermissions[tabKey] = tabPerms;
//           });
//         }
//       });
//     });

//     // Now populate with role data
//     if (roleData.moduleAccess) {
//       Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && sidebarStructure[mainHeader]) {
//           initialMainHeaderAccess[mainHeader] = Boolean(roleData.moduleAccess[apiModuleName]);
//         }
//       });
//     }

//     if (roleData.pageAccess) {
//       Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && roleData.pageAccess[apiModuleName]) {
//           Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//             const pageKey = `${mainHeader}_${pageName}`;
//             const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
            
//             if (initialPagePermissions[pageKey]) {
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 const hasPermission = Array.isArray(permissionsArray) && 
//                   permissionsArray.includes(permType.toUpperCase());
                
//                 initialPagePermissions[pageKey][permType] = hasPermission;
                
//                 // If permission exists in role, find and add its ID
//                 if (hasPermission) {
//                   const apiModuleNames = moduleNameMap[mainHeader];
//                   const permission = permissionsList.find(perm => 
//                     apiModuleNames.some(apiModuleName => 
//                       perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                     ) && 
//                     perm.page === pageName && 
//                     perm.action === permType.toUpperCase() &&
//                     !perm.tab
//                   );
                  
//                   if (permission && !rolePermissionIds.includes(permission._id)) {
//                     rolePermissionIds.push(permission._id);
//                   }
//                 }
//               });
//             }
//           });
//         }
//       });
//     }

//     // Process tab access
//     if (roleData.tabAccess) {
//       Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && roleData.tabAccess[apiModuleName]) {
//           Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//             Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//               const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//               if (!pageConfig) return;
              
//               let matchingTab = null;
//               if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                 matchingTab = pageConfig.tabs.find(tab => 
//                   tab.toUpperCase() === tabName.toUpperCase()
//                 );
                
//                 if (!matchingTab) {
//                   const fuzzyMatches = {
//                     'PENDING APPROVALS': 'PENDING APPROVALS',
//                     'PENDING APPROVAL': 'PENDING APPROVALS',
//                     'APPROVED': 'APPROVED',
//                     'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                     'ALLOCATED': 'ALLOCATED',
//                     'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                     'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                     'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                     'SUBMITTED': 'SUBMITTED',
//                     'REJECTED': 'REJECTED'
//                   };
                  
//                   const upperTabName = tabName.toUpperCase();
//                   if (fuzzyMatches[upperTabName]) {
//                     matchingTab = fuzzyMatches[upperTabName];
//                   }
//                 }
//               }
              
//               if (matchingTab) {
//                 const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                 const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                
//                 if (!initialTabPermissions[tabKey]) {
//                   initialTabPermissions[tabKey] = {};
//                 }
                
//                 if (Array.isArray(permissions)) {
//                   permissions.forEach(perm => {
//                     const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                     initialTabPermissions[tabKey][permKey] = true;
                    
//                     // Add tab permission ID to the list
//                     const apiModuleNames = moduleNameMap[mainHeader];
//                     const permission = permissionsList.find(p => 
//                       apiModuleNames.some(apiModuleName => 
//                         p.module.toUpperCase() === apiModuleName.toUpperCase()
//                       ) && 
//                       p.page === pageName && 
//                       p.action === permKey &&
//                       p.tab === matchingTab
//                     );
                    
//                     if (permission && !rolePermissionIds.includes(permission._id)) {
//                       rolePermissionIds.push(permission._id);
//                     }
//                   });
//                 }
//               }
//             });
//           });
//         }
//       });
//     }

//     // Also check if role has direct permissions array
//     if (Array.isArray(roleData.permissions) && roleData.permissions.length > 0) {
//       roleData.permissions.forEach(perm => {
//         const permId = typeof perm === 'string' ? perm : (perm._id || perm.id);
//         if (permId && !rolePermissionIds.includes(permId)) {
//           rolePermissionIds.push(permId);
//         }
//       });
//     }

//     // Update all states
//     setMainHeaderAccess(initialMainHeaderAccess);
//     setPagePermissions(initialPagePermissions);
//     setTabPermissions(initialTabPermissions);
    
//     // Set the formData permissions with role permissions
//     // For new users, replace existing permissions with role permissions
//     // For existing users, preserve their custom permissions
//     setFormData(prev => ({
//       ...prev,
//       permissions: id ? [...prev.permissions, ...rolePermissionIds] : rolePermissionIds
//     }));

//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch Role Permissions');
//     showApiErrorAlert(errorMessage, 'Role Permissions Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   // Helper to find main header by module name
//   const findMainHeaderByModule = (moduleName) => {
//     if (!moduleName) return null;
    
//     const moduleUpper = moduleName.toUpperCase();
//     for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
//       if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
//         return mainHeader;
//       }
//     }
    
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//   // Helper to find subdealer role
//   const findSubdealerRole = () => {
//     if (!roles || roles.length === 0) return null;
    
//     return roles.find(role => 
//       role.name.toLowerCase() === 'subdealer' || 
//       role.name.toLowerCase().includes('subdealer')
//     );
//   };

//   // Helper to extract permission IDs from current visual state
// const extractPermissionIdsFromState = () => {
//   const permissionIds = [];
  
//   Object.keys(mainHeaderAccess).forEach(mainHeader => {
//     if (mainHeaderAccess[mainHeader]) {
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       sidebarStructure[mainHeader].pages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = pagePermissions[pageKey] || {};
        
//         // Add page permission IDs
//         Object.keys(pagePerms).forEach(permType => {
//           if (pagePerms[permType]) {
//             const permission = permissionsList.find(perm => 
//               apiModuleNames.some(apiModuleName => 
//                 perm.module.toUpperCase() === apiModuleName.toUpperCase()
//               ) && 
//               perm.page === page.name && 
//               perm.action === permType.toUpperCase() &&
//               !perm.tab
//             );
            
//             if (permission) {
//               permissionIds.push(permission._id);
//             }
//           }
//         });
        
//         // Add tab permission IDs
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = tabPermissions[tabKey] || {};
            
//             Object.keys(tabPerms).forEach(permType => {
//               if (tabPerms[permType]) {
//                 const permission = permissionsList.find(perm => 
//                   apiModuleNames.some(apiModuleName => 
//                     perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                   ) && 
//                   perm.page === page.name && 
//                   perm.action === permType.toUpperCase() &&
//                   perm.tab === tab
//                 );
                
//                 if (permission) {
//                   permissionIds.push(permission._id);
//                 }
//               }
//             });
//           });
//         }
//       });
//     }
//   });
  
//   return [...new Set(permissionIds)]; // Remove duplicates
// };

//  const handleChange = async (e) => {
//   const { name, value } = e.target;
  
//   try {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
      
//       // Clear existing permissions when selecting a new role (for new users)
//       if (!id) {
//         setFormData(prev => ({ 
//           ...prev, 
//           permissions: [] 
//         }));
//       }
      
//       // Fetch role permissions
//       await fetchRolePermissionsData(value);
//     }

//     if (name === 'type') {
//       if (value === 'subdealer') {
//         const subdealerRole = findSubdealerRole();
//         if (subdealerRole) {
//           // Auto-select logged-in user's subdealer if they are a subdealer
//           let selectedSubdealer = '';
//           if (isLoggedInSubdealer && loggedInUserSubdealerId) {
//             selectedSubdealer = loggedInUserSubdealerId;
//           }
          
//           setFormData(prev => ({ 
//             ...prev, 
//             type: value,
//             roleId: subdealerRole._id,
//             subdealer: selectedSubdealer,
//             permissions: []
//           }));
//           await fetchRolePermissionsData(subdealerRole._id);
//           setShowPermissions(true);
//         }
//       } else {
//         setFormData(prev => ({ 
//           ...prev, 
//           type: value,
//           roleId: '',
//           subdealer: '',
//           permissions: [] // Clear permissions when switching from subdealer
//         }));
//         setShowPermissions(false);
//       }
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Handle Change');
//     showApiErrorAlert(errorMessage, 'Form Change Error');
//   }
// };

//   const handleVerticalChange = (e) => {
//     try {
//       const selectedId = e.target.value;
//       if (selectedId && !formData.verticles.includes(selectedId)) {
//         setFormData(prev => ({
//           ...prev,
//           verticles: [...prev.verticles, selectedId]
//         }));
//       }
//       setErrors(prev => ({ ...prev, verticles: '' }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Vertical Change');
//       showApiErrorAlert(errorMessage, 'Vertical Selection Error');
//     }
//   };

//   const removeVertical = (verticalId) => {
//     try {
//       setFormData(prev => {
//         const newVerticles = prev.verticles.filter(id => id !== verticalId);
//         return {
//           ...prev,
//           verticles: newVerticles
//         };
//       });
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Remove Vertical');
//       showApiErrorAlert(errorMessage, 'Vertical Removal Error');
//     }
//   };

//   const togglePageExpansion = (pageKey) => {
//     try {
//       setExpandedPages(prev => ({
//         ...prev,
//         [pageKey]: !prev[pageKey]
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Toggle Page Expansion');
//       showApiErrorAlert(errorMessage, 'UI Error');
//     }
//   };

//   // Check if a permission exists in the system
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return false;
      
//       return permissionsList.some(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
//       );
//     } catch (error) {
//       console.error('Error checking permission existence:', error);
//       return false;
//     }
//   };

//   // Get all tab permissions that exist in API for a page
//   const getAvailableTabsForPage = (mainHeader, page) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return [];
      
//       const tabs = new Set();
//       permissionsList.forEach(perm => {
//         if (apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.tab) {
//           tabs.add(perm.tab);
//         }
//       });
      
//       return Array.from(tabs);
//     } catch (error) {
//       console.error('Error getting available tabs:', error);
//       return [];
//     }
//   };

//   // Handle page permission change
//   const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: {
//           ...prev[pageKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         !perm.tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Page Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle tab permission change
//   const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: {
//           ...prev[tabKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         perm.tab === tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Tab Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all permissions for a page
//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
//         if (permissionExists) {
//           newPagePerms[permType] = true;
          
//           const permission = permissionsList.find(perm => 
//             apiModuleNames.some(apiModuleName => 
//               perm.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             perm.page === page && 
//             perm.action === permType.toUpperCase() &&
//             !perm.tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         } else {
//           newPagePerms[permType] = false;
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all permissions for a page
//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         newPagePerms[permType] = false;
        
//         const permission = permissionsList.find(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           perm.page === page && 
//           perm.action === permType.toUpperCase() &&
//           !perm.tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all tab permissions
//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(perm => {
//         const exists = checkPermissionExists(mainHeader, page, perm, tab);
//         newPerms[perm] = perm === "VIEW" ? exists : false;
        
//         if (perm === "VIEW" && exists) {
//           const permission = permissionsList.find(p => 
//             apiModuleNames.some(apiModuleName => 
//               p.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             p.page === page && 
//             p.action === "VIEW" &&
//             p.tab === tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all tab permissions
//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       const newPerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//         newPerms[perm] = false;
        
//         const permission = permissionsList.find(p => 
//           apiModuleNames.some(apiModuleName => 
//             p.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           p.page === page && 
//           p.action === perm.toUpperCase() &&
//           p.tab === tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle global actions for the three buttons
//   const handleGlobalAction = (actionType) => {
//     try {
//       switch (actionType) {
//         case 'none':
//           setFormData(prev => ({ ...prev, permissions: [] }));
          
//           const clearedPagePermissions = {};
//           const clearedTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = false;
//               });
//               clearedPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = false;
//                   });
//                   clearedTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(clearedPagePermissions);
//           setTabPermissions(clearedTabPermissions);
//           break;
          
//         case 'selectAll':
//           const allPermissionIds = permissionsList.map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
          
//           const allPagePermissions = {};
//           const allTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//               });
//               allPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                   });
//                   allTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(allPagePermissions);
//           setTabPermissions(allTabPermissions);
//           break;
          
//         case 'viewOnly':
//           const viewPermissionIds = permissionsList
//             .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
//             .map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
          
//           const viewPagePermissions = {};
//           const viewTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 if (permType === 'VIEW') {
//                   pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//                 } else {
//                   pagePerms[permType] = false;
//                 }
//               });
//               viewPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     if (permType === 'VIEW') {
//                       tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                     } else {
//                       tabPerms[permType] = false;
//                     }
//                   });
//                   viewTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(viewPagePermissions);
//           setTabPermissions(viewTabPermissions);
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Global Permission Action');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle main header access change
//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     try {
//       setMainHeaderAccess(prev => ({
//         ...prev,
//         [mainHeader]: hasAccess
//       }));

//       if (!hasAccess) {
//         const newPagePermissions = { ...pagePermissions };
//         const newTabPermissions = { ...tabPermissions };
        
//         sidebarStructure[mainHeader].pages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const perms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//             perms[perm] = false;
//           });
//           newPagePermissions[pageKey] = perms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//                 tabPerms[perm] = false;
//               });
//               newTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
        
//         setPagePermissions(newPagePermissions);
//         setTabPermissions(newTabPermissions);
        
//         const apiModuleNames = moduleNameMap[mainHeader];
//         const modulePermissions = permissionsList.filter(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           )
//         );
//         const modulePermissionIds = modulePermissions.map(perm => perm._id);
        
//         setFormData(prev => ({
//           ...prev,
//           permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
//         }));
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Main Header Access Change');
//       showApiErrorAlert(errorMessage, 'Access Control Error');
//     }
//   };

//   // Render permissions table for a page
//   const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
//     try {
//       const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
//       const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       // For tabs, only show VIEW permission (renamed to "Access")
//       const displayPermissions = isTab ? ["VIEW"] : availablePermissions;
      
//       return (
//         <CTable bordered responsive hover small className="permission-table mt-2">
//           <CTableHead color="light">
//             <CTableRow>
//               <CTableHeaderCell scope="col" className="text-nowrap">
//                 {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
//               </CTableHeaderCell>
//               {displayPermissions.map((perm) => (
//                 <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
//                   {getPermissionDisplayLabel(perm, isTab)}
//                 </CTableHeaderCell>
//               ))}
//               <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             <CTableRow>
//               <CTableDataCell>
//                 <strong>{isTab ? tabName : page}</strong>
//               </CTableDataCell>
//               {displayPermissions.map((perm) => {
//                 const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
//                 const isChecked = permissions[perm] || false;
                
//                 return (
//                   <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
//                     {permissionExists ? (
//                       <CFormCheck
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={(e) => {
//                           if (isTab) {
//                             handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
//                           } else {
//                             handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
//                           }
//                         }}
//                         aria-label={`${page}-${perm}`}
//                         title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
//                       />
//                     ) : (
//                       <span className="text-muted" title="Permission not available in system">
//                         N/A
//                       </span>
//                     )}
//                   </CTableDataCell>
//                 );
//               })}
//               <CTableDataCell className="text-center">
//                 <CButtonGroup size="sm">
//                   <CButton 
//                     color="primary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleSelectAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleSelectAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Select all available permissions"
//                   >
//                     All
//                   </CButton>
//                   <CButton 
//                     color="secondary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleClearAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleClearAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Clear all permissions"
//                   >
//                     None
//                   </CButton>
//                 </CButtonGroup>
//               </CTableDataCell>
//             </CTableRow>
//           </CTableBody>
//         </CTable>
//       );
//     } catch (error) {
//       console.error('Error rendering permissions table:', error);
//       return (
//         <CAlert color="danger">
//           Error rendering permissions table. Please refresh the page.
//         </CAlert>
//       );
//     }
//   };

//   const validateForm = () => {
//     try {
//       const newErrors = {};
//       if (!formData.name.trim()) newErrors.name = 'Name is required';
//       if (!formData.type) newErrors.type = 'Type is required';
      
//       if (formData.type === 'employee') {
//         if (!formData.branch) newErrors.branch = 'Branch is required for employee';
//         if (!formData.roleId) newErrors.roleId = 'Role is required for employee';
//       }
      
//       if (formData.type === 'subdealer') {
//         if (!formData.subdealer) newErrors.subdealer = 'Subdealer is required';
//         // Role is auto-selected for subdealer, so no validation needed
//       }
      
//       if (!formData.email.trim()) newErrors.email = 'Email is required';
//       if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
//       if (!formData.discount) newErrors.discount = 'Discount is required';
      
//       // Email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (formData.email && !emailRegex.test(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
      
//       // Mobile validation (basic)
//       const mobileRegex = /^[0-9]{10}$/;
//       if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
//         newErrors.mobile = 'Please enter a valid 10-digit mobile number';
//       }
      
//       const selectedRole = roles.find(role => role._id === formData.roleId);
//       if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
//         if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//         if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
        
//         // Validate numeric values
//         if (formData.totalDeviationAmount && isNaN(parseFloat(formData.totalDeviationAmount))) {
//           newErrors.totalDeviationAmount = 'Please enter a valid number';
//         }
//         if (formData.perTransactionDeviationLimit && isNaN(parseFloat(formData.perTransactionDeviationLimit))) {
//           newErrors.perTransactionDeviationLimit = 'Please enter a valid number';
//         }
//       }
      
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Form Validation');
//       showApiErrorAlert(errorMessage, 'Validation Error');
//       return false;
//     }
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) return;

//   setIsLoading(true);
  
//   try {
//     // Sync permissions from visual state to formData
//     const syncedPermissionIds = extractPermissionIdsFromState();
    
//     // Filter out null/undefined values from permissions
//     const validPermissions = [...new Set([...syncedPermissionIds, ...formData.permissions])].filter(perm => 
//       perm !== null && perm !== undefined && perm !== ''
//     );
    
//     const payload = {
//       name: formData.name.trim(),
//       type: formData.type,
//       roleId: formData.roleId,
//       email: formData.email.trim(),
//       mobile: formData.mobile.trim(),
//       permissions: validPermissions,
//       verticles: formData.verticles,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//       ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
//       ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
//       ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//       ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//     };

//     console.log('Submitting payload:', payload);
//     console.log('Permission count:', validPermissions.length);

//     if (id) {
//       await axiosInstance.put(`/users/${id}`, payload);
//       await refreshPermissions();
//       await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//     } else {
//       await axiosInstance.post('/auth/register', payload);
//       await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Submit Form');
    
//     // Show detailed error in alert
//     showApiErrorAlert(errorMessage, 'Submission Error');
    
//     // Also show the sweet alert for form submission errors
//     showFormSubmitError(error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  
//   const getSelectedVerticalNames = () => {
//     return formData.verticles.map(item => {
//       const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
//       const vertical = verticles.find(v => 
//         v._id === verticalId || v.id === verticalId
//       );
//       return vertical ? vertical.name || String(verticalId) : String(verticalId);
//     });
//   };

//   // Get the selected subdealer name for display
//   const getSelectedSubdealerName = () => {
//     if (!formData.subdealer) return '';
    
//     const subdealer = subdealers.find(s => s.id === formData.subdealer || s._id === formData.subdealer);
//     return subdealer ? subdealer.name : formData.subdealer;
//   };

//   // Render fetch errors if any
//   const renderFetchErrors = () => {
//     const errorMessages = Object.entries(fetchErrors)
//       .filter(([_, error]) => error !== null)
//       .map(([key, error]) => `${key}: ${error}`);

//     if (errorMessages.length === 0) return null;

//     return (
//       <CAlert color="warning" className="mb-3">
//         <div className="d-flex align-items-center">
//           <CIcon icon={cilWarning} className="me-2" />
//           <div>
//             <strong>Some data failed to load:</strong>
//             <ul className="mb-0 mt-1">
//               {errorMessages.map((msg, index) => (
//                 <li key={index}>{msg}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </CAlert>
//     );
//   };

//   if (isLoading && !id) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//         <span className="ms-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       {/* Global API Error Alert */}
//       {apiError && (
//         <CAlert 
//           color="danger" 
//           className="mb-3" 
//           dismissible
//           onClose={() => setApiError(null)}
//         >
//           <div className="d-flex align-items-center">
//             <CIcon icon={cilWarning} className="me-2" />
//             <div>
//               <strong>{apiError.context}</strong>
//               <p className="mb-0">{apiError.message}</p>
//             </div>
//           </div>
//         </CAlert>
//       )}

//       {/* Fetch Errors Alert */}
//       {renderFetchErrors()}

//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <FormErrorBoundary section="User Details">
//               <div className="user-details">
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Name</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="text" 
//                       name="name" 
//                       value={formData.name} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="Enter full name"
//                     />
//                   </CInputGroup>
//                   {errors.name && <p className="error">{errors.name}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPeople} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="type" 
//                       value={formData.type} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                     >
//                       <option value="employee">Employee</option>
//                       <option value="subdealer">Subdealer</option>
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.type && <p className="error">{errors.type}</p>}
//                 </div>
                
//                 {formData.type === 'employee' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Branch</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="branch" 
//                         value={formData.branch} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.branches}
//                       >
//                         <option value="">-Select-</option>
//                         {branches.map(branch => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.branch && <p className="error">{errors.branch}</p>}
//                     {fetchErrors.branches && (
//                       <small className="text-warning">Branches data unavailable: {fetchErrors.branches}</small>
//                     )}
//                   </div>
//                 )}

//                 {formData.type === 'subdealer' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="subdealer" 
//                         value={formData.subdealer} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.subdealers || (isLoggedInSubdealer && !id)}
//                       >
//                         <option value="">-Select Subdealer-</option>
//                         {subdealers.map(subdealer => (
//                           <option key={subdealer.id} value={subdealer.id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {fetchErrors.subdealers && (
//                       <small className="text-warning">Subdealers data unavailable: {fetchErrors.subdealers}</small>
//                     )}
                   
//                   </div>
//                 )}
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Role</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="roleId" 
//                       value={formData.roleId} 
//                       onChange={handleChange}
//                       disabled={isLoading || fetchErrors.roles || formData.type === 'subdealer'}
//                     >
//                       <option value="">-Select-</option>
//                       {roles.map(role => (
//                         <option key={role._id} value={role._id}>
//                           {role.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.roleId && <p className="error">{errors.roleId}</p>}
//                   {formData.type === 'subdealer' ? (
//                     <small className="text-muted">Role is automatically set to Subdealer and cannot be changed</small>
//                   ) : (
//                     <small className="text-muted">Select the role for this user</small>
//                   )}
//                   {fetchErrors.roles && (
//                     <small className="text-warning">Roles data unavailable: {fetchErrors.roles}</small>
//                   )}
//                 </div>
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Email</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilEnvelopeClosed} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="email" 
//                       name="email" 
//                       value={formData.email} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="user@example.com"
//                     />
//                   </CInputGroup>
//                   {errors.email && <p className="error">{errors.email}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Mobile number</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPhone} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="tel" 
//                       name="mobile" 
//                       value={formData.mobile} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="10-digit mobile number"
//                     />
//                   </CInputGroup>
//                   {errors.mobile && <p className="error">{errors.mobile}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Discount</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilDollar} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="number" 
//                       name="discount" 
//                       value={formData.discount} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       min="0"
//                       step="0.01"
//                       placeholder="0.00"
//                     />
//                   </CInputGroup>
//                   {errors.discount && <p className="error">{errors.discount}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Verticles</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilTag} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="vertical" 
//                       value="" 
//                       onChange={handleVerticalChange}
//                       disabled={isLoading || fetchErrors.verticles}
//                     >
//                       <option value="">-Select Verticle-</option>
//                       {verticles
//                         .filter(vertical => vertical.status === 'active')
//                         .map(vertical => (
//                           <option 
//                             key={vertical._id} 
//                             value={vertical._id}
//                             disabled={formData.verticles.includes(vertical._id)}
//                           >
//                             {vertical.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
                  
//                   <div className="mt-2">
//                     <div className="d-flex flex-wrap gap-2">
//                       {getSelectedVerticalNames().map((verticalName, index) => {
//                         const verticalId = formData.verticles[index];
//                         return (
//                           <CBadge 
//                             key={`${verticalId}_${index}`} 
//                             color="primary"
//                             className="d-flex align-items-center"
//                             style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//                           >
//                             {String(verticalName)}
//                             <CCloseButton 
//                               className="ms-2"
//                               onClick={() => removeVertical(verticalId)}
//                               style={{ fontSize: '0.75rem' }}
//                               disabled={isLoading}
//                             />
//                           </CBadge>
//                         );
//                       })}
//                     </div>
//                     <small className="text-muted">
//                       {formData.verticles.length} verticle(s) selected (Optional)
//                     </small>
//                     {fetchErrors.verticles && (
//                       <small className="text-warning d-block">Verticles data unavailable: {fetchErrors.verticles}</small>
//                     )}
//                   </div>
//                 </div>

//                 {isManager && (
//                   <>
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Total Deviation Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="totalDeviationAmount" 
//                           value={formData.totalDeviationAmount} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                     </div>

//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Per Transaction Deviation Limit</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="perTransactionDeviationLimit" 
//                           value={formData.perTransactionDeviationLimit} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </FormErrorBoundary>

//             {showPermissions && (
//               <FormErrorBoundary section="Permissions Configuration">
//                 <div className="permissions-container mt-4">
//                   <h5 className="mb-3">User Permissions Configuration</h5>
//                   <p className="text-muted mb-4">
//                     These permissions are in addition to the role permissions. 
//                     Total system permissions: {permissionsList.length}
//                     {fetchErrors.permissions && (
//                       <span className="text-warning ms-2">(Permissions data incomplete: {fetchErrors.permissions})</span>
//                     )}
//                   </p>
                  
//                   {/* Three global permission buttons added here */}
//                   <div className="mb-3">
//                     <CButtonGroup>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('none')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         None
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('selectAll')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         Select All
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('viewOnly')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         View Only
//                       </CButton>
//                     </CButtonGroup>
//                   </div>

//                   {isLoadingPermissions ? (
//                     <div className="d-flex justify-content-center align-items-center py-4">
//                       <CSpinner color="primary" />
//                       <span className="ms-2">Loading permissions...</span>
//                     </div>
//                   ) : (
//                     <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                       {Object.keys(sidebarStructure).map((mainHeader) => {
//                         const hasAccess = mainHeaderAccess[mainHeader] || false;
//                         const pageCount = sidebarStructure[mainHeader].pages.length;

//                         return (
//                           <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                             <CAccordionHeader>
//                               <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//                                 <div>
//                                   <h6 className="mb-0">{mainHeader}</h6>
//                                   <small className="text-muted">{pageCount} pages</small>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2">
//                                   <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//                                     {hasAccess ? 'Access Granted' : 'No Access'}
//                                   </CBadge>
//                                   <div className="d-flex" role="group">
//                                     <button
//                                       type="button"
//                                       className={`btn btn-sm ${hasAccess ? 'btn-success' : 'btn-secondary'} btn-outline me-1`}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, true);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilCheck} /> Yes
//                                     </button>
//                                     <button
//                                       type="button"
//                                       className={`btn btn-sm ${!hasAccess ? 'btn-danger' : 'btn-secondary'} btn-outline`}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, false);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilX} /> No
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CAccordionHeader>
//                             <CAccordionBody>
//                               {hasAccess ? (
//                                 <div className="pages-permissions">
//                                   {sidebarStructure[mainHeader].pages.map((page) => {
//                                     const pageKey = `${mainHeader}_${page.name}`;
//                                     const isExpanded = expandedPages[pageKey] || false;
//                                     const pageHasTabs = page.tabs && page.tabs.length > 0;
//                                     const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                                     const hasTabPermissions = availableTabs.length > 0;
                                    
//                                     return (
//                                       <CCard key={pageKey} className="mb-3">
//                                         <CCardBody>
//                                           <div className="d-flex justify-content-between align-items-center mb-2">
//                                             <h6 className="mb-0">{page.name}</h6>
//                                             <div className="d-flex align-items-center gap-2">
//                                               {pageHasTabs && hasTabPermissions && (
//                                                 <CButton
//                                                   size="sm"
//                                                   color="link"
//                                                   onClick={() => togglePageExpansion(pageKey)}
//                                                   className="p-0"
//                                                   disabled={isLoading || isLoadingPermissions}
//                                                 >
//                                                   {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                                 </CButton>
//                                               )}
//                                             </div>
//                                           </div>
                                          
//                                           {/* Page-level permissions */}
//                                           {renderPermissionsTable(mainHeader, page.name, false)}
                                          
//                                           {/* Tab-level permissions (if available) */}
//                                           {pageHasTabs && hasTabPermissions && (
//                                             <CCollapse visible={isExpanded}>
//                                               <div className="mt-3">
//                                                 <h6 className="mb-2">Tab Permissions</h6>
//                                                 {availableTabs.map((tab) => (
//                                                   <div key={`${pageKey}_${tab}`} className="mb-3">
//                                                     {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             </CCollapse>
//                                           )}
//                                         </CCardBody>
//                                       </CCard>
//                                     );
//                                   })}
//                                 </div>
//                               ) : (
//                                 <div className="text-center py-4">
//                                   <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                                   <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                                   <small>Click "Yes" to grant access and configure permissions</small>
//                                 </div>
//                               )}
//                             </CAccordionBody>
//                           </CAccordionItem>
//                         );
//                       })}
//                     </CAccordion>
//                   )}
//                 </div>
//               </FormErrorBoundary>
//             )}

//             <div className="form-footer">
//               <button 
//                 type="submit" 
//                 className="cancel-button"
//                 disabled={isLoading || isLoadingPermissions}
//               >
//                 {isLoading ? (
//                   <>
//                     <CSpinner size="sm" className="me-2" />
//                     {id ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//               <button 
//                 type="button" 
//                 className="submit-button" 
//                 onClick={handleCancel}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;










// import React, { useState, useEffect, useContext } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CCard,
//   CCardBody,
//   CCollapse
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich, cilWarning } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../../context/AuthContext';

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete",
//   "READ": "View",
//   "WRITE": "Edit"
// };

// // Tab permission label mapping (only show "Access" instead of "VIEW" for tabs)
// const tabPermissionLabelMap = {
//   "VIEW": "Access",
//   "CREATE": "Create",
//   "UPDATE": "Update", 
//   "DELETE": "Delete"
// };

// // Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
// const sidebarStructure = {
//   "Dashboard": {
//     pages: [{
//       name: "Dashboard",
//       tabs: null
//     }],
//     availablePermissions: ["VIEW"]
//   },
//   "Purchase": {
//     pages: [
//       { name: "Inward Stock", tabs: null },
//       { 
//         name: "Stock Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
//       },
//       { name: "Stock Transfer", tabs: null },
//       { name: "Upload Challan", tabs: null },
//       { name: "RTO Chassis", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       },
//       { name: "Self Insurance", tabs: null },
//       { name: "Delivery Challan", tabs: null },
//       { name: "GST Invoice", tabs: null },
//       { name: "Helmet Invoice", tabs: null },
//       { name: "Deal Form", tabs: null },
//       { name: "Upload Deal Form & Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales Report": {
//     pages: [
//       { name: "Sales Person Wise", tabs: null },
//       { name: "Periodic Report", tabs: null }
//     ],
//     availablePermissions: ["VIEW"]
//   },
//   "Quotation": {
//     pages: [
//       { name: "Quotation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Account": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Receipts", 
//         tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
//       },
//       { name: "Debit Note", tabs: null },
//       { name: "Refund", tabs: null },
//       { 
//         name: "Cancelled Booking", 
//         tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
//       },
//       { name: "All Receipts", tabs: null },
//       { name: "Ledgers", tabs: null },
//       { name: "Exchange Ledger", tabs: null },
//       { 
//         name: "Broker Payment Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Insurance": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Insurance Details", 
//         tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "RTO": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Application", 
//         tabs: ["RTO PENDING", "APPLIED FOR"]
//       },
//       { 
//         name: "RTO Paper", 
//         tabs: ["RTO PAPER PENDING", "COMPLETED"]
//       },
//       { 
//         name: "RTO Tax", 
//         tabs: ["RTO PENDING TAX", "TAX PAID"]
//       },
//       { 
//         name: "HSRP Ordering", 
//         tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
//       },
//       { 
//         name: "HSRP Installation", 
//         tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
//       },
//       { 
//         name: "RC Confirmation", 
//         tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Management": {
//     pages: [
//       { name: "Cash Voucher", tabs: null },
//       { name: "Contra Voucher", tabs: null },
//       { 
//         name: "Contra Approval", 
//         tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
//       },
//       { name: "Workshop Cash Receipt", tabs: null },
//       { name: "All Cash Receipt", tabs: null },
//       { name: "Cash Book", tabs: null },
//       { name: "Day Book", tabs: null },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Masters": {
//     pages: [
//       { name: "Location", tabs: null },
//       { name: "Headers", tabs: null },
//       { name: "Vehicles", tabs: null },
//       { name: "Minimum Booking Amount", tabs: null },
//       { name: "Template List", tabs: null },
//       { name: "Accessories", tabs: null },
//       { name: "Colour", tabs: null },
//       { name: "Documents", tabs: null },
//       { name: "Terms & Conditions", tabs: null },
//       { name: "Offer", tabs: null },
//       { name: "Attachments", tabs: null },
//       { name: "Declaration", tabs: null },
//       { name: "RTO", tabs: null },
//       { name: "Financer", tabs: null },
//       { name: "Finance Rates", tabs: null },
//       { name: "Insurance Providers", tabs: null },
//       { name: "Brokers", tabs: null },
//       { name: "Broker Commission Range", tabs: null },
//       { name: "Vertical Masters", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Master": {
//     pages: [
//       { name: "Cash Account Master", tabs: null },
//       { name: "Bank Account Master", tabs: null },
//       { name: "Payment Mode", tabs: null },
//       { name: "Expense Master", tabs: null },
//       { name: "Add Opening Balance", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Accessories Billing": {
//     pages: [
//       { name: "Accessories Billing", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Customers": {
//     pages: [
//       { name: "Customers", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer": {
//     pages: [
//       { 
//         name: "Subdealer Stock Audit", 
//         tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Master": {
//     pages: [
//       { name: "Subdealer List", tabs: null },
//       { name: "Subdealer Audit List", tabs: null },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Calculate Commission", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Booking": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
//       },
//       { name: "Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Management": {
//     pages: [
//       { 
//         name: "Subdealer Management", 
//         tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Account": {
//     pages: [
//       { name: "Add Balance", tabs: null },
//       { name: "OnAccount Balance", tabs: null },
//       { name: "Add Amount", tabs: null },
//       { 
//         name: "Finance Payment", 
//         tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
//       },
//       { 
//         name: "Payment Verification", 
//         tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
//       },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Payment Summary", tabs: null },
//       { 
//         name: "Subdealer Ledger", 
//         tabs: ["SUB DEALER", "SUB DEALER UTR"]
//       },
//       { name: "Customer Ledger", tabs: null },
//       { 
//         name: "Summary", 
//         tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "User Management": {
//     pages: [
//       { name: "Create Role", tabs: null },
//       { name: "All Role", tabs: null },
//       { name: "Add User", tabs: null },
//       { name: "User List", tabs: null },
//       { name: "Buffer Report", tabs: null },
//       { name: "Manager Deviation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   }
// };

// // Map sidebar module names to API module names
// const moduleNameMap = {
//   "Dashboard": ["DASHBOARD"],
//   "Purchase": ["PURCHASE"],
//   "Sales": ["SALES"],
//   "Sales Report": ["SALES REPORT", "SALES_REPORT"],
//   "Quotation": ["QUOTATION"],
//   "Account": ["ACCOUNT"],
//   "Insurance": ["INSURANCE"],
//   "RTO": ["RTO"],
//   "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
//   "Masters": ["MASTERS"],
//   "Fund Master": ["FUND MASTER", "FUND_MASTER"],
//   "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
//   "Customers": ["CUSTOMERS"],
//   "Subdealer": ["SUBDEALER"],
//   "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
//   "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
//   "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
//   "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   if (isTab) {
//     return tabPermissionLabelMap[permission] || permission;
//   }
//   return permissionLabelMap[permission] || permission;
// };

// // Error boundary component for form sections
// const FormErrorBoundary = ({ children, section }) => {
//   const [hasError, setHasError] = useState(false);
//   const [error, setError] = useState(null);

//   return hasError ? (
//     <CAlert color="danger" className="mt-3">
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilWarning} className="me-2" />
//         <div>
//           <strong>Error in {section}</strong>
//           <p className="mb-0">{error?.message || 'An unexpected error occurred'}</p>
//         </div>
//       </div>
//     </CAlert>
//   ) : (
//     <ErrorBoundaryWrapper setHasError={setHasError} setError={setError}>
//       {children}
//     </ErrorBoundaryWrapper>
//   );
// };

// const ErrorBoundaryWrapper = ({ children, setHasError, setError }) => {
//   useEffect(() => {
//     const errorHandler = (error) => {
//       console.error('Component error:', error);
//       setHasError(true);
//       setError(error);
//     };
    
//     window.addEventListener('error', errorHandler);
//     return () => window.removeEventListener('error', errorHandler);
//   }, [setHasError, setError]);
  
//   return children;
// };

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealer: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     csd: false, // Added CSD field
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchErrors, setFetchErrors] = useState({
//     roles: null,
//     branches: null,
//     subdealers: null,
//     verticles: null,
//     permissions: null
//   });
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const { refreshPermissions, user: authUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Check if logged-in user is a subdealer
//   const isLoggedInSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const loggedInUserSubdealerId = authUser?.subdealer?._id;
//   const loggedInUserSubdealerName = authUser?.subdealer?.name;

//   // Check if logged-in user has SUBDEALER role
//   const loggedInUserRole = authUser?.roles?.[0]?.name || '';
//   const isLoggedInSubdealerRole = loggedInUserRole === 'SUBDEALER';

//   // Error handling utility functions
//   const handleApiError = (error, context = 'Operation') => {
//     console.error(`${context} error:`, error);
    
//     let errorMessage = 'An unexpected error occurred';
    
//     if (error.response) {
//       // Server responded with error status
//       const { data, status } = error.response;
      
//       if (data && data.message) {
//         errorMessage = data.message;
//       } else if (status === 401) {
//         errorMessage = 'Authentication failed. Please login again.';
//       } else if (status === 403) {
//         errorMessage = 'You do not have permission to perform this action.';
//       } else if (status === 404) {
//         errorMessage = 'Resource not found.';
//       } else if (status >= 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else {
//         errorMessage = `Request failed with status ${status}`;
//       }
//     } else if (error.request) {
//       // Request made but no response
//       errorMessage = 'Network error. Please check your connection.';
//     } else {
//       // Something else happened
//       errorMessage = error.message || errorMessage;
//     }
    
//     return errorMessage;
//   };

//   const showApiErrorAlert = (errorMessage, context = 'Error') => {
//     setApiError({
//       message: errorMessage,
//       context: context,
//       timestamp: new Date().toISOString()
//     });
    
//     // Auto-clear after 10 seconds
//     setTimeout(() => {
//       setApiError(null);
//     }, 10000);
//   };

//   // Handle role auto-selection when type changes to subdealer
//   useEffect(() => {
//     if (formData.type === 'subdealer' && roles.length > 0 && !formData.roleId) {
//       const subdealerRole = roles.find(role => 
//         role.name.toLowerCase() === 'subdealer' || 
//         role.name.toLowerCase().includes('subdealer')
//       );
      
//       if (subdealerRole) {
//         setFormData(prev => ({ 
//           ...prev, 
//           roleId: subdealerRole._id
//         }));
        
//         // Load permissions for subdealer role
//         fetchRolePermissionsData(subdealerRole._id);
//         setShowPermissions(true);
//       }
//     }
//   }, [formData.type, roles, formData.roleId]);

//   // Also handle when user switches from subdealer back to employee
//   useEffect(() => {
//     if (formData.type !== 'subdealer' && !id) {
//       // For new users, clear role when switching from subdealer to employee
//       setFormData(prev => ({ 
//         ...prev, 
//         roleId: '',
//         subdealer: ''
//       }));
//       setShowPermissions(false);
//     }
//   }, [formData.type, id]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//         showApiErrorAlert('Invalid authentication token. Please login again.', 'Authentication');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setIsLoading(true);
//         await Promise.all([
//           fetchRoles(),
//           fetchBranches(),
//           fetchSubdealers(),
//           fetchVerticles(),
//           fetchAllPermissions()
//         ]);
        
//         if (id) {
//           await fetchUser(id);
//         }
//       } catch (error) {
//         const errorMessage = handleApiError(error, 'Initialization');
//         showApiErrorAlert(errorMessage, 'Initialization Error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     initializeData();
//   }, [id]);

//   const fetchUser = async (userId) => {
//     try {
//       const res = await axiosInstance.get(`/users/${userId}`);
//       const userData = res.data.data;
      
//       if (!userData) {
//         throw new Error('User data not found');
//       }
      
//       // Extract permission IDs
//       let userPermissions = [];
//       if (Array.isArray(userData.permissions)) {
//         userPermissions = userData.permissions
//           .map(p => {
//             if (!p) return null;
//             if (typeof p === 'string' && p.length > 0) return p;
//             if (typeof p === 'object') {
//               if (p._id) return p._id;
//               if (p.permission) {
//                 if (typeof p.permission === 'string') return p.permission;
//                 if (p.permission._id) return p.permission._id;
//               }
//             }
//             return null;
//           })
//           .filter(id => id !== null && id !== undefined);
//       }
      
//       // Extract verticle IDs
//       let userVerticles = [];
//       if (Array.isArray(userData.verticles)) {
//         userVerticles = userData.verticles.map(v => v._id || v.id);
//       }
//       if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//         userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
//       }
      
//       // Extract role ID
//       let userRoleId = '';
//       if (Array.isArray(userData.roles) && userData.roles.length > 0) {
//         userRoleId = userData.roles[0]._id || '';
//       }
      
//       // Extract subdealer ID - handle both string and object formats
//       let userSubdealerId = '';
//       if (userData.subdealer) {
//         if (typeof userData.subdealer === 'string') {
//           userSubdealerId = userData.subdealer;
//         } else if (typeof userData.subdealer === 'object') {
//           userSubdealerId = userData.subdealer._id || userData.subdealer.id || '';
//         }
//       }
      
//       // Extract branch ID
//       let userBranchId = '';
//       if (userData.branch) {
//         if (typeof userData.branch === 'string') {
//           userBranchId = userData.branch;
//         } else if (typeof userData.branch === 'object') {
//           userBranchId = userData.branch._id || '';
//         }
//       }
      
//       // Determine user type
//       let userType = 'employee';
//       if (userData.type === 'subdealer') {
//         userType = 'subdealer';
//       } else if (userData.subdealer) {
//         userType = 'subdealer';
//       }
      
//       setFormData({
//         name: userData.name || '',
//         type: userType,
//         branch: userBranchId,
//         subdealer: userSubdealerId,
//         roleId: userRoleId,
//         email: userData.email || '',
//         mobile: userData.mobile || '',
//         discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
//         csd: userData.csd || false, // Load CSD field
//         permissions: userPermissions,
//         totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
//         perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
//         verticles: userVerticles
//       });

//       if (userRoleId) {
//         setShowPermissions(true);
//         await loadUserPermissions(userData);
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch User');
//       showApiErrorAlert(errorMessage, 'User Fetch Error');
//       throw error;
//     }
//   };

//   const loadUserPermissions = async (userData) => {
//     setIsLoadingPermissions(true);
//     try {
//       // Initialize permissions
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           // Initialize tab permissions
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Set main header access
//       if (userData.moduleAccess) {
//         Object.keys(userData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = Boolean(userData.moduleAccess[apiModuleName]);
//           }
//         });
//       }

//       // Set page permissions
//       if (userData.pageAccess) {
//         Object.keys(userData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && userData.pageAccess[apiModuleName]) {
//             Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = userData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   initialPagePermissions[pageKey][permType] = 
//                     Array.isArray(permissionsArray) && 
//                     permissionsArray.includes(permType.toUpperCase());
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Set tab permissions
//       if (userData.tabAccess) {
//         Object.keys(userData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && userData.tabAccess[apiModuleName]) {
//             Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   if (Array.isArray(permissions)) {
//                     permissions.forEach(perm => {
//                       const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                       initialTabPermissions[tabKey][permKey] = true;
//                     });
//                   }
//                 }
//               });
//             });
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);

//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Load Permissions');
//       showApiErrorAlert(errorMessage, 'Permissions Load Error');
//       throw error;
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, roles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Roles');
//       setFetchErrors(prev => ({ ...prev, roles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, branches: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Branches');
//       setFetchErrors(prev => ({ ...prev, branches: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//       setFetchErrors(prev => ({ ...prev, subdealers: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Subdealers');
//       setFetchErrors(prev => ({ ...prev, subdealers: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setVerticles(verticlesData);
//       setFetchErrors(prev => ({ ...prev, verticles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Verticles');
//       setFetchErrors(prev => ({ ...prev, verticles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//       setFetchErrors(prev => ({ ...prev, permissions: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Permissions');
//       setFetchErrors(prev => ({ ...prev, permissions: errorMessage }));
//       throw error;
//     }
//   };

//  const fetchRolePermissionsData = async (roleId) => {
//   if (!roleId) return;
  
//   setIsLoadingPermissions(true);
//   try {
//     const res = await axiosInstance.get(`/roles/${roleId}`);
//     const roleData = res.data.data;

//     if (!roleData) {
//       throw new Error('Role data not found');
//     }

//     // Initialize permissions
//     const initialMainHeaderAccess = {};
//     const initialPagePermissions = {};
//     const initialTabPermissions = {};

//     // Track all permission IDs from the role
//     let rolePermissionIds = [];

//     // First, set all to false
//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       initialMainHeaderAccess[mainHeader] = false;
      
//       const headerPages = sidebarStructure[mainHeader].pages;
//       headerPages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//           pagePerms[permType] = false;
//         });
//         initialPagePermissions[pageKey] = pagePerms;
        
//         // Initialize tab permissions
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               tabPerms[permType] = false;
//             });
//             initialTabPermissions[tabKey] = tabPerms;
//           });
//         }
//       });
//     });

//     // Now populate with role data
//     if (roleData.moduleAccess) {
//       Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && sidebarStructure[mainHeader]) {
//           initialMainHeaderAccess[mainHeader] = Boolean(roleData.moduleAccess[apiModuleName]);
//         }
//       });
//     }

//     if (roleData.pageAccess) {
//       Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && roleData.pageAccess[apiModuleName]) {
//           Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//             const pageKey = `${mainHeader}_${pageName}`;
//             const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
            
//             if (initialPagePermissions[pageKey]) {
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 const hasPermission = Array.isArray(permissionsArray) && 
//                   permissionsArray.includes(permType.toUpperCase());
                
//                 initialPagePermissions[pageKey][permType] = hasPermission;
                
//                 // If permission exists in role, find and add its ID
//                 if (hasPermission) {
//                   const apiModuleNames = moduleNameMap[mainHeader];
//                   const permission = permissionsList.find(perm => 
//                     apiModuleNames.some(apiModuleName => 
//                       perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                     ) && 
//                     perm.page === pageName && 
//                     perm.action === permType.toUpperCase() &&
//                     !perm.tab
//                   );
                  
//                   if (permission && !rolePermissionIds.includes(permission._id)) {
//                     rolePermissionIds.push(permission._id);
//                   }
//                 }
//               });
//             }
//           });
//         }
//       });
//     }

//     // Process tab access
//     if (roleData.tabAccess) {
//       Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && roleData.tabAccess[apiModuleName]) {
//           Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//             Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//               const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//               if (!pageConfig) return;
              
//               let matchingTab = null;
//               if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                 matchingTab = pageConfig.tabs.find(tab => 
//                   tab.toUpperCase() === tabName.toUpperCase()
//                 );
                
//                 if (!matchingTab) {
//                   const fuzzyMatches = {
//                     'PENDING APPROVALS': 'PENDING APPROVALS',
//                     'PENDING APPROVAL': 'PENDING APPROVALS',
//                     'APPROVED': 'APPROVED',
//                     'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                     'ALLOCATED': 'ALLOCATED',
//                     'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                     'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                     'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                     'SUBMITTED': 'SUBMITTED',
//                     'REJECTED': 'REJECTED'
//                   };
                  
//                   const upperTabName = tabName.toUpperCase();
//                   if (fuzzyMatches[upperTabName]) {
//                     matchingTab = fuzzyMatches[upperTabName];
//                   }
//                 }
//               }
              
//               if (matchingTab) {
//                 const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                 const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                
//                 if (!initialTabPermissions[tabKey]) {
//                   initialTabPermissions[tabKey] = {};
//                 }
                
//                 if (Array.isArray(permissions)) {
//                   permissions.forEach(perm => {
//                     const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                     initialTabPermissions[tabKey][permKey] = true;
                    
//                     // Add tab permission ID to the list
//                     const apiModuleNames = moduleNameMap[mainHeader];
//                     const permission = permissionsList.find(p => 
//                       apiModuleNames.some(apiModuleName => 
//                         p.module.toUpperCase() === apiModuleName.toUpperCase()
//                       ) && 
//                       p.page === pageName && 
//                       p.action === permKey &&
//                       p.tab === matchingTab
//                     );
                    
//                     if (permission && !rolePermissionIds.includes(permission._id)) {
//                       rolePermissionIds.push(permission._id);
//                     }
//                   });
//                 }
//               }
//             });
//           });
//         }
//       });
//     }

//     // Also check if role has direct permissions array
//     if (Array.isArray(roleData.permissions) && roleData.permissions.length > 0) {
//       roleData.permissions.forEach(perm => {
//         const permId = typeof perm === 'string' ? perm : (perm._id || perm.id);
//         if (permId && !rolePermissionIds.includes(permId)) {
//           rolePermissionIds.push(permId);
//         }
//       });
//     }

//     // Update all states
//     setMainHeaderAccess(initialMainHeaderAccess);
//     setPagePermissions(initialPagePermissions);
//     setTabPermissions(initialTabPermissions);
    
//     // Set the formData permissions with role permissions
//     // For new users, replace existing permissions with role permissions
//     // For existing users, preserve their custom permissions
//     setFormData(prev => ({
//       ...prev,
//       permissions: id ? [...prev.permissions, ...rolePermissionIds] : rolePermissionIds
//     }));

//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch Role Permissions');
//     showApiErrorAlert(errorMessage, 'Role Permissions Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   // Helper to find main header by module name
//   const findMainHeaderByModule = (moduleName) => {
//     if (!moduleName) return null;
    
//     const moduleUpper = moduleName.toUpperCase();
//     for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
//       if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
//         return mainHeader;
//       }
//     }
    
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//   // Helper to find subdealer role
//   const findSubdealerRole = () => {
//     if (!roles || roles.length === 0) return null;
    
//     return roles.find(role => 
//       role.name.toLowerCase() === 'subdealer' || 
//       role.name.toLowerCase().includes('subdealer')
//     );
//   };

//   // Helper to extract permission IDs from current visual state
// const extractPermissionIdsFromState = () => {
//   const permissionIds = [];
  
//   Object.keys(mainHeaderAccess).forEach(mainHeader => {
//     if (mainHeaderAccess[mainHeader]) {
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       sidebarStructure[mainHeader].pages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = pagePermissions[pageKey] || {};
        
//         // Add page permission IDs
//         Object.keys(pagePerms).forEach(permType => {
//           if (pagePerms[permType]) {
//             const permission = permissionsList.find(perm => 
//               apiModuleNames.some(apiModuleName => 
//                 perm.module.toUpperCase() === apiModuleName.toUpperCase()
//               ) && 
//               perm.page === page.name && 
//               perm.action === permType.toUpperCase() &&
//               !perm.tab
//             );
            
//             if (permission) {
//               permissionIds.push(permission._id);
//             }
//           }
//         });
        
//         // Add tab permission IDs
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = tabPermissions[tabKey] || {};
            
//             Object.keys(tabPerms).forEach(permType => {
//               if (tabPerms[permType]) {
//                 const permission = permissionsList.find(perm => 
//                   apiModuleNames.some(apiModuleName => 
//                     perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                   ) && 
//                   perm.page === page.name && 
//                   perm.action === permType.toUpperCase() &&
//                   perm.tab === tab
//                 );
                
//                 if (permission) {
//                   permissionIds.push(permission._id);
//                 }
//               }
//             });
//           });
//         }
//       });
//     }
//   });
  
//   return [...new Set(permissionIds)]; // Remove duplicates
// };

//  const handleChange = async (e) => {
//   const { name, value, type, checked } = e.target;
  
//   try {
//     // Handle checkbox inputs
//     if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
      
//       // Clear existing permissions when selecting a new role (for new users)
//       if (!id) {
//         setFormData(prev => ({ 
//           ...prev, 
//           permissions: [] 
//         }));
//       }
      
//       // Fetch role permissions
//       await fetchRolePermissionsData(value);
//     }

//     if (name === 'type') {
//       if (value === 'subdealer') {
//         const subdealerRole = findSubdealerRole();
//         if (subdealerRole) {
//           // Auto-select logged-in user's subdealer if they are a subdealer
//           let selectedSubdealer = '';
//           if (isLoggedInSubdealer && loggedInUserSubdealerId) {
//             selectedSubdealer = loggedInUserSubdealerId;
//           }
          
//           setFormData(prev => ({ 
//             ...prev, 
//             type: value,
//             roleId: subdealerRole._id,
//             subdealer: selectedSubdealer,
//             permissions: []
//           }));
//           await fetchRolePermissionsData(subdealerRole._id);
//           setShowPermissions(true);
//         }
//       } else {
//         setFormData(prev => ({ 
//           ...prev, 
//           type: value,
//           roleId: '',
//           subdealer: '',
//           permissions: [] // Clear permissions when switching from subdealer
//         }));
//         setShowPermissions(false);
//       }
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Handle Change');
//     showApiErrorAlert(errorMessage, 'Form Change Error');
//   }
// };

//   const handleVerticalChange = (e) => {
//     try {
//       const selectedId = e.target.value;
//       if (selectedId && !formData.verticles.includes(selectedId)) {
//         setFormData(prev => ({
//           ...prev,
//           verticles: [...prev.verticles, selectedId]
//         }));
//       }
//       setErrors(prev => ({ ...prev, verticles: '' }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Vertical Change');
//       showApiErrorAlert(errorMessage, 'Vertical Selection Error');
//     }
//   };

//   const removeVertical = (verticalId) => {
//     try {
//       setFormData(prev => {
//         const newVerticles = prev.verticles.filter(id => id !== verticalId);
//         return {
//           ...prev,
//           verticles: newVerticles
//         };
//       });
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Remove Vertical');
//       showApiErrorAlert(errorMessage, 'Vertical Removal Error');
//     }
//   };

//   const togglePageExpansion = (pageKey) => {
//     try {
//       setExpandedPages(prev => ({
//         ...prev,
//         [pageKey]: !prev[pageKey]
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Toggle Page Expansion');
//       showApiErrorAlert(errorMessage, 'UI Error');
//     }
//   };

//   // Check if a permission exists in the system
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return false;
      
//       return permissionsList.some(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
//       );
//     } catch (error) {
//       console.error('Error checking permission existence:', error);
//       return false;
//     }
//   };

//   // Get all tab permissions that exist in API for a page
//   const getAvailableTabsForPage = (mainHeader, page) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return [];
      
//       const tabs = new Set();
//       permissionsList.forEach(perm => {
//         if (apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.tab) {
//           tabs.add(perm.tab);
//         }
//       });
      
//       return Array.from(tabs);
//     } catch (error) {
//       console.error('Error getting available tabs:', error);
//       return [];
//     }
//   };

//   // Handle page permission change
//   const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: {
//           ...prev[pageKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         !perm.tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Page Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle tab permission change
//   const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: {
//           ...prev[tabKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         perm.tab === tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Tab Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all permissions for a page
//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
//         if (permissionExists) {
//           newPagePerms[permType] = true;
          
//           const permission = permissionsList.find(perm => 
//             apiModuleNames.some(apiModuleName => 
//               perm.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             perm.page === page && 
//             perm.action === permType.toUpperCase() &&
//             !perm.tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         } else {
//           newPagePerms[permType] = false;
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all permissions for a page
//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         newPagePerms[permType] = false;
        
//         const permission = permissionsList.find(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           perm.page === page && 
//           perm.action === permType.toUpperCase() &&
//           !perm.tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all tab permissions
//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(perm => {
//         const exists = checkPermissionExists(mainHeader, page, perm, tab);
//         newPerms[perm] = perm === "VIEW" ? exists : false;
        
//         if (perm === "VIEW" && exists) {
//           const permission = permissionsList.find(p => 
//             apiModuleNames.some(apiModuleName => 
//               p.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             p.page === page && 
//             p.action === "VIEW" &&
//             p.tab === tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all tab permissions
//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       const newPerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//         newPerms[perm] = false;
        
//         const permission = permissionsList.find(p => 
//           apiModuleNames.some(apiModuleName => 
//             p.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           p.page === page && 
//           p.action === perm.toUpperCase() &&
//           p.tab === tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle global actions for the three buttons
//   const handleGlobalAction = (actionType) => {
//     try {
//       switch (actionType) {
//         case 'none':
//           setFormData(prev => ({ ...prev, permissions: [] }));
          
//           const clearedPagePermissions = {};
//           const clearedTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = false;
//               });
//               clearedPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = false;
//                   });
//                   clearedTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(clearedPagePermissions);
//           setTabPermissions(clearedTabPermissions);
//           break;
          
//         case 'selectAll':
//           const allPermissionIds = permissionsList.map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
          
//           const allPagePermissions = {};
//           const allTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//               });
//               allPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                   });
//                   allTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(allPagePermissions);
//           setTabPermissions(allTabPermissions);
//           break;
          
//         case 'viewOnly':
//           const viewPermissionIds = permissionsList
//             .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
//             .map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
          
//           const viewPagePermissions = {};
//           const viewTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 if (permType === 'VIEW') {
//                   pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//                 } else {
//                   pagePerms[permType] = false;
//                 }
//               });
//               viewPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     if (permType === 'VIEW') {
//                       tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                     } else {
//                       tabPerms[permType] = false;
//                     }
//                   });
//                   viewTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(viewPagePermissions);
//           setTabPermissions(viewTabPermissions);
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Global Permission Action');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle main header access change
//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     try {
//       setMainHeaderAccess(prev => ({
//         ...prev,
//         [mainHeader]: hasAccess
//       }));

//       if (!hasAccess) {
//         const newPagePermissions = { ...pagePermissions };
//         const newTabPermissions = { ...tabPermissions };
        
//         sidebarStructure[mainHeader].pages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const perms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//             perms[perm] = false;
//           });
//           newPagePermissions[pageKey] = perms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//                 tabPerms[perm] = false;
//               });
//               newTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
        
//         setPagePermissions(newPagePermissions);
//         setTabPermissions(newTabPermissions);
        
//         const apiModuleNames = moduleNameMap[mainHeader];
//         const modulePermissions = permissionsList.filter(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           )
//         );
//         const modulePermissionIds = modulePermissions.map(perm => perm._id);
        
//         setFormData(prev => ({
//           ...prev,
//           permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
//         }));
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Main Header Access Change');
//       showApiErrorAlert(errorMessage, 'Access Control Error');
//     }
//   };

//   // Render permissions table for a page
//   const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
//     try {
//       const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
//       const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       // For tabs, only show VIEW permission (renamed to "Access")
//       const displayPermissions = isTab ? ["VIEW"] : availablePermissions;
      
//       return (
//         <CTable bordered responsive hover small className="permission-table mt-2">
//           <CTableHead color="light">
//             <CTableRow>
//               <CTableHeaderCell scope="col" className="text-nowrap">
//                 {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
//               </CTableHeaderCell>
//               {displayPermissions.map((perm) => (
//                 <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
//                   {getPermissionDisplayLabel(perm, isTab)}
//                 </CTableHeaderCell>
//               ))}
//               <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             <CTableRow>
//               <CTableDataCell>
//                 <strong>{isTab ? tabName : page}</strong>
//               </CTableDataCell>
//               {displayPermissions.map((perm) => {
//                 const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
//                 const isChecked = permissions[perm] || false;
                
//                 return (
//                   <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
//                     {permissionExists ? (
//                       <CFormCheck
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={(e) => {
//                           if (isTab) {
//                             handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
//                           } else {
//                             handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
//                           }
//                         }}
//                         aria-label={`${page}-${perm}`}
//                         title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
//                       />
//                     ) : (
//                       <span className="text-muted" title="Permission not available in system">
//                         N/A
//                       </span>
//                     )}
//                   </CTableDataCell>
//                 );
//               })}
//               <CTableDataCell className="text-center">
//                 <CButtonGroup size="sm">
//                   <CButton 
//                     color="primary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleSelectAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleSelectAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Select all available permissions"
//                   >
//                     All
//                   </CButton>
//                   <CButton 
//                     color="secondary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleClearAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleClearAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Clear all permissions"
//                   >
//                     None
//                   </CButton>
//                 </CButtonGroup>
//               </CTableDataCell>
//             </CTableRow>
//           </CTableBody>
//         </CTable>
//       );
//     } catch (error) {
//       console.error('Error rendering permissions table:', error);
//       return (
//         <CAlert color="danger">
//           Error rendering permissions table. Please refresh the page.
//         </CAlert>
//       );
//     }
//   };

//   const validateForm = () => {
//     try {
//       const newErrors = {};
//       if (!formData.name.trim()) newErrors.name = 'Name is required';
//       if (!formData.type) newErrors.type = 'Type is required';
      
//       if (formData.type === 'employee') {
//         if (!formData.branch) newErrors.branch = 'Branch is required for employee';
//         if (!formData.roleId) newErrors.roleId = 'Role is required for employee';
//       }
      
//       if (formData.type === 'subdealer') {
//         if (!formData.subdealer) newErrors.subdealer = 'Subdealer is required';
//         // Role is auto-selected for subdealer, so no validation needed
//       }
      
//       if (!formData.email.trim()) newErrors.email = 'Email is required';
//       if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
      
//       // Only validate discount if user type is NOT subdealer AND logged-in user is not SUBDEALER
//       if (formData.type !== 'subdealer' && !isLoggedInSubdealerRole && !formData.discount) {
//         newErrors.discount = 'Discount is required';
//       }
      
//       // Email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (formData.email && !emailRegex.test(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
      
//       // Mobile validation (basic)
//       const mobileRegex = /^[0-9]{10}$/;
//       if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
//         newErrors.mobile = 'Please enter a valid 10-digit mobile number';
//       }
      
//       const selectedRole = roles.find(role => role._id === formData.roleId);
//       if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
//         if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//         if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
        
//         // Validate numeric values
//         if (formData.totalDeviationAmount && isNaN(parseFloat(formData.totalDeviationAmount))) {
//           newErrors.totalDeviationAmount = 'Please enter a valid number';
//         }
//         if (formData.perTransactionDeviationLimit && isNaN(parseFloat(formData.perTransactionDeviationLimit))) {
//           newErrors.perTransactionDeviationLimit = 'Please enter a valid number';
//         }
//       }
      
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Form Validation');
//       showApiErrorAlert(errorMessage, 'Validation Error');
//       return false;
//     }
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) return;

//   setIsLoading(true);
  
//   try {
//     // Sync permissions from visual state to formData
//     const syncedPermissionIds = extractPermissionIdsFromState();
    
//     // Filter out null/undefined values from permissions
//     const validPermissions = [...new Set([...syncedPermissionIds, ...formData.permissions])].filter(perm => 
//       perm !== null && perm !== undefined && perm !== ''
//     );
    
//     const payload = {
//       name: formData.name.trim(),
//       type: formData.type,
//       roleId: formData.roleId,
//       email: formData.email.trim(),
//       mobile: formData.mobile.trim(),
//       csd: formData.csd, // Include CSD field
//       permissions: validPermissions,
//       verticles: formData.verticles,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//       ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
//       ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
//       ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//       ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//     };

//     console.log('Submitting payload:', payload);
//     console.log('Permission count:', validPermissions.length);

//     if (id) {
//       await axiosInstance.put(`/users/${id}`, payload);
//       await refreshPermissions();
//       await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//     } else {
//       await axiosInstance.post('/auth/register', payload);
//       await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Submit Form');
    
//     // Show detailed error in alert
//     showApiErrorAlert(errorMessage, 'Submission Error');
    
//     // Also show the sweet alert for form submission errors
//     showFormSubmitError(error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  
//   const getSelectedVerticalNames = () => {
//     return formData.verticles.map(item => {
//       const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
//       const vertical = verticles.find(v => 
//         v._id === verticalId || v.id === verticalId
//       );
//       return vertical ? vertical.name || String(verticalId) : String(verticalId);
//     });
//   };

//   // Get the selected subdealer name for display
//   const getSelectedSubdealerName = () => {
//     if (!formData.subdealer) return '';
    
//     const subdealer = subdealers.find(s => s.id === formData.subdealer || s._id === formData.subdealer);
//     return subdealer ? subdealer.name : formData.subdealer;
//   };

//   // Render fetch errors if any
//   const renderFetchErrors = () => {
//     const errorMessages = Object.entries(fetchErrors)
//       .filter(([_, error]) => error !== null)
//       .map(([key, error]) => `${key}: ${error}`);

//     if (errorMessages.length === 0) return null;

//     return (
//       <CAlert color="warning" className="mb-3">
//         <div className="d-flex align-items-center">
//           <CIcon icon={cilWarning} className="me-2" />
//           <div>
//             <strong>Some data failed to load:</strong>
//             <ul className="mb-0 mt-1">
//               {errorMessages.map((msg, index) => (
//                 <li key={index}>{msg}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </CAlert>
//     );
//   };

//   if (isLoading && !id) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//         <span className="ms-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       {/* Global API Error Alert */}
//       {apiError && (
//         <CAlert 
//           color="danger" 
//           className="mb-3" 
//           dismissible
//           onClose={() => setApiError(null)}
//         >
//           <div className="d-flex align-items-center">
//             <CIcon icon={cilWarning} className="me-2" />
//             <div>
//               <strong>{apiError.context}</strong>
//               <p className="mb-0">{apiError.message}</p>
//             </div>
//           </div>
//         </CAlert>
//       )}

//       {/* Fetch Errors Alert */}
//       {renderFetchErrors()}

//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <FormErrorBoundary section="User Details">
//               <div className="user-details">
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Name</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="text" 
//                       name="name" 
//                       value={formData.name} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="Enter full name"
//                     />
//                   </CInputGroup>
//                   {errors.name && <p className="error">{errors.name}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPeople} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="type" 
//                       value={formData.type} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                     >
//                       <option value="employee">Employee</option>
//                       <option value="subdealer">Subdealer</option>
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.type && <p className="error">{errors.type}</p>}
//                 </div>
                
//                 {formData.type === 'employee' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Branch</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="branch" 
//                         value={formData.branch} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.branches}
//                       >
//                         <option value="">-Select-</option>
//                         {branches.map(branch => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.branch && <p className="error">{errors.branch}</p>}
//                     {fetchErrors.branches && (
//                       <small className="text-warning">Branches data unavailable: {fetchErrors.branches}</small>
//                     )}
//                   </div>
//                 )}

//                 {formData.type === 'subdealer' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="subdealer" 
//                         value={formData.subdealer} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.subdealers || (isLoggedInSubdealer && !id)}
//                       >
//                         <option value="">-Select Subdealer-</option>
//                         {subdealers.map(subdealer => (
//                           <option key={subdealer.id} value={subdealer.id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {fetchErrors.subdealers && (
//                       <small className="text-warning">Subdealers data unavailable: {fetchErrors.subdealers}</small>
//                     )}
                   
//                   </div>
//                 )}
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Role</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="roleId" 
//                       value={formData.roleId} 
//                       onChange={handleChange}
//                       disabled={isLoading || fetchErrors.roles || formData.type === 'subdealer'}
//                     >
//                       <option value="">-Select-</option>
//                       {roles.map(role => (
//                         <option key={role._id} value={role._id}>
//                           {role.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.roleId && <p className="error">{errors.roleId}</p>}
//                   {formData.type === 'subdealer' ? (
//                     <small className="text-muted">Role is automatically set to Subdealer and cannot be changed</small>
//                   ) : (
//                     <small className="text-muted">Select the role for this user</small>
//                   )}
//                   {fetchErrors.roles && (
//                     <small className="text-warning">Roles data unavailable: {fetchErrors.roles}</small>
//                   )}
//                 </div>
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Email</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilEnvelopeClosed} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="email" 
//                       name="email" 
//                       value={formData.email} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="user@example.com"
//                     />
//                   </CInputGroup>
//                   {errors.email && <p className="error">{errors.email}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Mobile number</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPhone} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="tel" 
//                       name="mobile" 
//                       value={formData.mobile} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="10-digit mobile number"
//                     />
//                   </CInputGroup>
//                   {errors.mobile && <p className="error">{errors.mobile}</p>}
//                 </div>

//                 {/* Only show discount field if NOT creating a subdealer AND logged-in user is NOT a SUBDEALER */}
//                 {formData.type !== 'subdealer' && !isLoggedInSubdealerRole && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Discount</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilDollar} />
//                       </CInputGroupText>
//                       <CFormInput 
//                         type="number" 
//                         name="discount" 
//                         value={formData.discount} 
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         min="0"
//                         step="0.01"
//                         placeholder="0.00"
//                       />
//                     </CInputGroup>
//                     {errors.discount && <p className="error">{errors.discount}</p>}
//                   </div>
//                 )}

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Verticles</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilTag} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="vertical" 
//                       value="" 
//                       onChange={handleVerticalChange}
//                       disabled={isLoading || fetchErrors.verticles}
//                     >
//                       <option value="">-Select Verticle-</option>
//                       {verticles
//                         .filter(vertical => vertical.status === 'active')
//                         .map(vertical => (
//                           <option 
//                             key={vertical._id} 
//                             value={vertical._id}
//                             disabled={formData.verticles.includes(vertical._id)}
//                           >
//                             {vertical.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
                  
//                   <div className="mt-2">
//                     <div className="d-flex flex-wrap gap-2">
//                       {getSelectedVerticalNames().map((verticalName, index) => {
//                         const verticalId = formData.verticles[index];
//                         return (
//                           <CBadge 
//                             key={`${verticalId}_${index}`} 
//                             color="primary"
//                             className="d-flex align-items-center"
//                             style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//                           >
//                             {String(verticalName)}
//                             <CCloseButton 
//                               className="ms-2"
//                               onClick={() => removeVertical(verticalId)}
//                               style={{ fontSize: '0.75rem' }}
//                               disabled={isLoading}
//                             />
//                           </CBadge>
//                         );
//                       })}
//                     </div>
//                     <small className="text-muted">
//                       {formData.verticles.length} verticle(s) selected (Optional)
//                     </small>
//                     {fetchErrors.verticles && (
//                       <small className="text-warning d-block">Verticles data unavailable: {fetchErrors.verticles}</small>
//                     )}
//                   </div>
//                 </div>

//                 {/* Only show CSD field to non-subdealer users */}
//                {/* Only show CSD field to non-subdealer users AND when creating/editing non-subdealer users */}
// {!isLoggedInSubdealerRole && formData.type !== 'subdealer' && (
//   <div className="input-box">
//     <div className="details-container">
//       <span className="details">CSD</span>
//     </div>
//     <CInputGroup>
//       <CInputGroupText className="input-icon">
//         <CIcon icon={cilUser} />
//       </CInputGroupText>
//       <div className="form-check form-switch mt-2 ms-2">
//         <input
//           className="form-check-input"
//           type="checkbox"
//           name="csd"
//           id="csdCheckbox"
//           checked={formData.csd}
//           onChange={handleChange}
//           disabled={isLoading}
//           style={{ width: '3em', height: '1.5em' }}
//         />
//         <label className="form-check-label ms-2" htmlFor="csdCheckbox">
//           {formData.csd ? 'Yes' : 'No'}
//         </label>
//       </div>
//     </CInputGroup>
//     <small className="text-muted">
//       Customer Service Department access
//     </small>
//   </div>
// )}

//                 {isManager && (
//                   <>
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Total Deviation Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="totalDeviationAmount" 
//                           value={formData.totalDeviationAmount} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                     </div>

//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Per Transaction Deviation Limit</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="perTransactionDeviationLimit" 
//                           value={formData.perTransactionDeviationLimit} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </FormErrorBoundary>

//             {showPermissions && (
//               <FormErrorBoundary section="Permissions Configuration">
//                 <div className="permissions-container mt-4">
//                   <h5 className="mb-3">User Permissions Configuration</h5>
//                   <p className="text-muted mb-4">
//                     These permissions are in addition to the role permissions. 
//                     Total system permissions: {permissionsList.length}
//                     {fetchErrors.permissions && (
//                       <span className="text-warning ms-2">(Permissions data incomplete: {fetchErrors.permissions})</span>
//                     )}
//                   </p>
                  
//                   {/* Three global permission buttons added here */}
//                   <div className="mb-3">
//                     <CButtonGroup>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('none')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         None
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('selectAll')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         Select All
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('viewOnly')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         View Only
//                       </CButton>
//                     </CButtonGroup>
//                   </div>

//                   {isLoadingPermissions ? (
//                     <div className="d-flex justify-content-center align-items-center py-4">
//                       <CSpinner color="primary" />
//                       <span className="ms-2">Loading permissions...</span>
//                     </div>
//                   ) : (
//                     <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                       {Object.keys(sidebarStructure).map((mainHeader) => {
//                         const hasAccess = mainHeaderAccess[mainHeader] || false;
//                         const pageCount = sidebarStructure[mainHeader].pages.length;

//                         return (
//                           <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                             <CAccordionHeader>
//                               <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//                                 <div>
//                                   <h6 className="mb-0">{mainHeader}</h6>
//                                   <small className="text-muted">{pageCount} pages</small>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2">
//                                   <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//                                     {hasAccess ? 'Access Granted' : 'No Access'}
//                                   </CBadge>
//                                   <div className="d-flex align-items-center" role="group">
//                                     <CButton
//                                       size="sm"
//                                       color={hasAccess ? "success" : "secondary"}
//                                       variant="outline"
//                                       className="me-1"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, true);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilCheck} /> Yes
//                                     </CButton>
//                                     <CButton
//                                       size="sm"
//                                       color={!hasAccess ? "danger" : "secondary"}
//                                       variant="outline"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, false);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilX} /> No
//                                     </CButton>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CAccordionHeader>
//                             <CAccordionBody>
//                               {hasAccess ? (
//                                 <div className="pages-permissions">
//                                   {sidebarStructure[mainHeader].pages.map((page) => {
//                                     const pageKey = `${mainHeader}_${page.name}`;
//                                     const isExpanded = expandedPages[pageKey] || false;
//                                     const pageHasTabs = page.tabs && page.tabs.length > 0;
//                                     const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                                     const hasTabPermissions = availableTabs.length > 0;
                                    
//                                     return (
//                                       <CCard key={pageKey} className="mb-3">
//                                         <CCardBody>
//                                           <div className="d-flex justify-content-between align-items-center mb-2">
//                                             <h6 className="mb-0">{page.name}</h6>
//                                             <div className="d-flex align-items-center gap-2">
//                                               {pageHasTabs && hasTabPermissions && (
//                                                 <CButton
//                                                   size="sm"
//                                                   color="link"
//                                                   onClick={() => togglePageExpansion(pageKey)}
//                                                   className="p-0"
//                                                   disabled={isLoading || isLoadingPermissions}
//                                                 >
//                                                   {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                                 </CButton>
//                                               )}
//                                             </div>
//                                           </div>
                                          
//                                           {/* Page-level permissions */}
//                                           {renderPermissionsTable(mainHeader, page.name, false)}
                                          
//                                           {/* Tab-level permissions (if available) */}
//                                           {pageHasTabs && hasTabPermissions && (
//                                             <CCollapse visible={isExpanded}>
//                                               <div className="mt-3">
//                                                 <h6 className="mb-2">Tab Permissions</h6>
//                                                 {availableTabs.map((tab) => (
//                                                   <div key={`${pageKey}_${tab}`} className="mb-3">
//                                                     {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             </CCollapse>
//                                           )}
//                                         </CCardBody>
//                                       </CCard>
//                                     );
//                                   })}
//                                 </div>
//                               ) : (
//                                 <div className="text-center py-4">
//                                   <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                                   <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                                   <small>Click "Yes" to grant access and configure permissions</small>
//                                 </div>
//                               )}
//                             </CAccordionBody>
//                           </CAccordionItem>
//                         );
//                       })}
//                     </CAccordion>
//                   )}
//                 </div>
//               </FormErrorBoundary>
//             )}

//             <div className="form-footer">
//               <button 
//                 type="submit" 
//                 className="cancel-button"
//                 disabled={isLoading || isLoadingPermissions}
//               >
//                 {isLoading ? (
//                   <>
//                     <CSpinner size="sm" className="me-2" />
//                     {id ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//               <button 
//                 type="button" 
//                 className="submit-button" 
//                 onClick={handleCancel}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;








// import React, { useState, useEffect, useContext } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CCard,
//   CCardBody,
//   CCollapse
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich, cilWarning } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../../context/AuthContext';

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete",
//   "READ": "View",
//   "WRITE": "Edit"
// };

// // Tab permission label mapping (only show "Access" instead of "VIEW" for tabs)
// const tabPermissionLabelMap = {
//   "VIEW": "Access",
//   "CREATE": "Create",
//   "UPDATE": "Update", 
//   "DELETE": "Delete"
// };

// // Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
// const sidebarStructure = {
//   "Dashboard": {
//     pages: [{
//       name: "Dashboard",
//       tabs: null
//     }],
//     availablePermissions: ["VIEW"]
//   },
//   "Purchase": {
//     pages: [
//       { name: "Inward Stock", tabs: null },
//       { 
//         name: "Stock Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
//       },
//       { name: "Stock Transfer", tabs: null },
//       { name: "Upload Challan", tabs: null },
//       { name: "RTO Chassis", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       },
//       { name: "Self Insurance", tabs: null },
//       { name: "Delivery Challan", tabs: null },
//       { name: "GST Invoice", tabs: null },
//       { name: "Helmet Invoice", tabs: null },
//       { name: "Deal Form", tabs: null },
//       { name: "Upload Deal Form & Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales Report": {
//     pages: [
//       { name: "Sales Person Wise", tabs: null },
//       { name: "Periodic Report", tabs: null }
//     ],
//     availablePermissions: ["VIEW"]
//   },
//   "Quotation": {
//     pages: [
//       { name: "Quotation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Account": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Receipts", 
//         tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
//       },
//       { name: "Debit Note", tabs: null },
//       { name: "Refund", tabs: null },
//       { 
//         name: "Cancelled Booking", 
//         tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
//       },
//       { name: "All Receipts", tabs: null },
//       { name: "Ledgers", tabs: null },
//       { name: "Exchange Ledger", tabs: null },
//       { 
//         name: "Broker Payment Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Insurance": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Insurance Details", 
//         tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "RTO": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Application", 
//         tabs: ["RTO PENDING", "APPLIED FOR"]
//       },
//       { 
//         name: "RTO Paper", 
//         tabs: ["RTO PAPER PENDING", "COMPLETED"]
//       },
//       { 
//         name: "RTO Tax", 
//         tabs: ["RTO PENDING TAX", "TAX PAID"]
//       },
//       { 
//         name: "HSRP Ordering", 
//         tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
//       },
//       { 
//         name: "HSRP Installation", 
//         tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
//       },
//       { 
//         name: "RC Confirmation", 
//         tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Management": {
//     pages: [
//       { name: "Cash Voucher", tabs: null },
//       { name: "Contra Voucher", tabs: null },
//       { 
//         name: "Contra Approval", 
//         tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
//       },
//       { name: "Workshop Cash Receipt", tabs: null },
//       { name: "All Cash Receipt", tabs: null },
//       { name: "Cash Book", tabs: null },
//       { name: "Day Book", tabs: null },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Masters": {
//     pages: [
//       { name: "Location", tabs: null },
//       { name: "Headers", tabs: null },
//       { name: "Vehicles", tabs: null },
//       { name: "Minimum Booking Amount", tabs: null },
//       { name: "Template List", tabs: null },
//       { name: "Accessories", tabs: null },
//       { name: "Colour", tabs: null },
//       { name: "Documents", tabs: null },
//       { name: "Terms & Conditions", tabs: null },
//       { name: "Offer", tabs: null },
//       { name: "Attachments", tabs: null },
//       { name: "Declaration", tabs: null },
//       { name: "RTO", tabs: null },
//       { name: "Financer", tabs: null },
//       { name: "Finance Rates", tabs: null },
//       { name: "Insurance Providers", tabs: null },
//       { name: "Brokers", tabs: null },
//       { name: "Broker Commission Range", tabs: null },
//       { name: "Vertical Masters", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Master": {
//     pages: [
//       { name: "Cash Account Master", tabs: null },
//       { name: "Bank Account Master", tabs: null },
//       { name: "Payment Mode", tabs: null },
//       { name: "Expense Master", tabs: null },
//       { name: "Add Opening Balance", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Accessories Billing": {
//     pages: [
//       { name: "Accessories Billing", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Customers": {
//     pages: [
//       { name: "Customers", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer": {
//     pages: [
//       { 
//         name: "Subdealer Stock Audit", 
//         tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Master": {
//     pages: [
//       { name: "Subdealer List", tabs: null },
//       { name: "Subdealer Audit List", tabs: null },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Calculate Commission", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Booking": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
//       },
//       { name: "Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Management": {
//     pages: [
//       { 
//         name: "Subdealer Management", 
//         tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Account": {
//     pages: [
//       { name: "Add Balance", tabs: null },
//       { name: "OnAccount Balance", tabs: null },
//       { name: "Add Amount", tabs: null },
//       { 
//         name: "Finance Payment", 
//         tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
//       },
//       { 
//         name: "Payment Verification", 
//         tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
//       },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Payment Summary", tabs: null },
//       { 
//         name: "Subdealer Ledger", 
//         tabs: ["SUB DEALER", "SUB DEALER UTR"]
//       },
//       { name: "Customer Ledger", tabs: null },
//       { 
//         name: "Summary", 
//         tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "User Management": {
//     pages: [
//       { name: "Create Role", tabs: null },
//       { name: "All Role", tabs: null },
//       { name: "Add User", tabs: null },
//       { name: "User List", tabs: null },
//       { name: "Buffer Report", tabs: null },
//       { name: "Manager Deviation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   }
// };

// // Map sidebar module names to API module names
// const moduleNameMap = {
//   "Dashboard": ["DASHBOARD"],
//   "Purchase": ["PURCHASE"],
//   "Sales": ["SALES"],
//   "Sales Report": ["SALES REPORT", "SALES_REPORT"],
//   "Quotation": ["QUOTATION"],
//   "Account": ["ACCOUNT"],
//   "Insurance": ["INSURANCE"],
//   "RTO": ["RTO"],
//   "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
//   "Masters": ["MASTERS"],
//   "Fund Master": ["FUND MASTER", "FUND_MASTER"],
//   "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
//   "Customers": ["CUSTOMERS"],
//   "Subdealer": ["SUBDEALER"],
//   "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
//   "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
//   "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
//   "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   if (isTab) {
//     return tabPermissionLabelMap[permission] || permission;
//   }
//   return permissionLabelMap[permission] || permission;
// };

// // Error boundary component for form sections
// const FormErrorBoundary = ({ children, section }) => {
//   const [hasError, setHasError] = useState(false);
//   const [error, setError] = useState(null);

//   return hasError ? (
//     <CAlert color="danger" className="mt-3">
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilWarning} className="me-2" />
//         <div>
//           <strong>Error in {section}</strong>
//           <p className="mb-0">{error?.message || 'An unexpected error occurred'}</p>
//         </div>
//       </div>
//     </CAlert>
//   ) : (
//     <ErrorBoundaryWrapper setHasError={setHasError} setError={setError}>
//       {children}
//     </ErrorBoundaryWrapper>
//   );
// };

// const ErrorBoundaryWrapper = ({ children, setHasError, setError }) => {
//   useEffect(() => {
//     const errorHandler = (error) => {
//       console.error('Component error:', error);
//       setHasError(true);
//       setError(error);
//     };
    
//     window.addEventListener('error', errorHandler);
//     return () => window.removeEventListener('error', errorHandler);
//   }, [setHasError, setError]);
  
//   return children;
// };

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealer: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     csd: false, // Added CSD field
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchErrors, setFetchErrors] = useState({
//     roles: null,
//     branches: null,
//     subdealers: null,
//     verticles: null,
//     permissions: null
//   });
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const { refreshPermissions, user: authUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Check if logged-in user is a subdealer
//   const isLoggedInSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const loggedInUserSubdealerId = authUser?.subdealer?._id;
//   const loggedInUserSubdealerName = authUser?.subdealer?.name;

//   // Check if logged-in user has SUBDEALER role
//   const loggedInUserRole = authUser?.roles?.[0]?.name || '';
//   const isLoggedInSubdealerRole = loggedInUserRole === 'SUBDEALER';

//   // Error handling utility functions
//   const handleApiError = (error, context = 'Operation') => {
//     console.error(`${context} error:`, error);
    
//     let errorMessage = 'An unexpected error occurred';
    
//     if (error.response) {
//       // Server responded with error status
//       const { data, status } = error.response;
      
//       if (data && data.message) {
//         errorMessage = data.message;
//       } else if (status === 401) {
//         errorMessage = 'Authentication failed. Please login again.';
//       } else if (status === 403) {
//         errorMessage = 'You do not have permission to perform this action.';
//       } else if (status === 404) {
//         errorMessage = 'Resource not found.';
//       } else if (status >= 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else {
//         errorMessage = `Request failed with status ${status}`;
//       }
//     } else if (error.request) {
//       // Request made but no response
//       errorMessage = 'Network error. Please check your connection.';
//     } else {
//       // Something else happened
//       errorMessage = error.message || errorMessage;
//     }
    
//     return errorMessage;
//   };

//   const showApiErrorAlert = (errorMessage, context = 'Error') => {
//     setApiError({
//       message: errorMessage,
//       context: context,
//       timestamp: new Date().toISOString()
//     });
    
//     // Auto-clear after 10 seconds
//     setTimeout(() => {
//       setApiError(null);
//     }, 10000);
//   };

//   // Handle role auto-selection when type changes to subdealer
//   useEffect(() => {
//     if (formData.type === 'subdealer' && roles.length > 0 && !formData.roleId) {
//       const subdealerRole = roles.find(role => 
//         role.name.toLowerCase() === 'subdealer' || 
//         role.name.toLowerCase().includes('subdealer')
//       );
      
//       if (subdealerRole) {
//         setFormData(prev => ({ 
//           ...prev, 
//           roleId: subdealerRole._id
//         }));
        
//         // Load permissions for subdealer role
//         fetchRolePermissionsData(subdealerRole._id);
//         setShowPermissions(true);
//       }
//     }
//   }, [formData.type, roles, formData.roleId]);

//   // Also handle when user switches from subdealer back to employee
//   useEffect(() => {
//     if (formData.type !== 'subdealer' && !id) {
//       // For new users, clear role when switching from subdealer to employee
//       setFormData(prev => ({ 
//         ...prev, 
//         roleId: '',
//         subdealer: ''
//       }));
//       setShowPermissions(false);
//     }
//   }, [formData.type, id]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//         showApiErrorAlert('Invalid authentication token. Please login again.', 'Authentication');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setIsLoading(true);
//         await Promise.all([
//           fetchRoles(),
//           fetchBranches(),
//           fetchSubdealers(),
//           fetchVerticles(),
//           fetchAllPermissions()
//         ]);
        
//         if (id) {
//           await fetchUser(id);
//         }
//       } catch (error) {
//         const errorMessage = handleApiError(error, 'Initialization');
//         showApiErrorAlert(errorMessage, 'Initialization Error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     initializeData();
//   }, [id]);

//  const fetchUser = async (userId) => {
//   try {
//     const res = await axiosInstance.get(`/users/${userId}`);
//     const userData = res.data.data;
    
//     if (!userData) {
//       throw new Error('User data not found');
//     }
    
//     // Extract permission IDs from user's permissions array
//     let userPermissions = [];
//     if (Array.isArray(userData.permissions)) {
//       userPermissions = userData.permissions
//         .map(p => {
//           if (!p) return null;
//           if (typeof p === 'string' && p.length > 0) return p;
//           if (typeof p === 'object') {
//             if (p._id) return p._id;
//             if (p.permission) {
//               if (typeof p.permission === 'string') return p.permission;
//               if (p.permission._id) return p.permission._id;
//             }
//           }
//           return null;
//         })
//         .filter(id => id !== null && id !== undefined);
//     }
    
//     // Extract verticle IDs
//     let userVerticles = [];
//     if (Array.isArray(userData.verticles)) {
//       userVerticles = userData.verticles.map(v => v._id || v.id);
//     }
//     if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//       userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
//     }
    
//     // Extract role ID
//     let userRoleId = '';
//     if (Array.isArray(userData.roles) && userData.roles.length > 0) {
//       userRoleId = userData.roles[0]._id || '';
//     }
    
//     // Extract subdealer ID
//     let userSubdealerId = '';
//     if (userData.subdealer) {
//       if (typeof userData.subdealer === 'string') {
//         userSubdealerId = userData.subdealer;
//       } else if (typeof userData.subdealer === 'object') {
//         userSubdealerId = userData.subdealer._id || userData.subdealer.id || '';
//       }
//     }
    
//     // Extract branch ID
//     let userBranchId = '';
//     if (userData.branch) {
//       if (typeof userData.branch === 'string') {
//         userBranchId = userData.branch;
//       } else if (typeof userData.branch === 'object') {
//         userBranchId = userData.branch._id || '';
//       }
//     }
    
//     // Determine user type
//     let userType = 'employee';
//     if (userData.type === 'subdealer') {
//       userType = 'subdealer';
//     } else if (userData.subdealer) {
//       userType = 'subdealer';
//     }
    
//     setFormData({
//       name: userData.name || '',
//       type: userType,
//       branch: userBranchId,
//       subdealer: userSubdealerId,
//       roleId: userRoleId,
//       email: userData.email || '',
//       mobile: userData.mobile || '',
//       discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
//       csd: userData.csd || false,
//       permissions: userPermissions, // Set user's actual permissions
//       totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
//       perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
//       verticles: userVerticles
//     });

//     if (userRoleId) {
//       setShowPermissions(true);
//       // Only load user permissions, don't merge with role permissions
//       await loadUserPermissions(userData, userPermissions);
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch User');
//     showApiErrorAlert(errorMessage, 'User Fetch Error');
//     throw error;
//   }
// };

//  const loadUserPermissions = async (userData, userPermissions = []) => {
//   setIsLoadingPermissions(true);
//   try {
//     // Initialize permissions
//     const initialMainHeaderAccess = {};
//     const initialPagePermissions = {};
//     const initialTabPermissions = {};

//     // First, set all to false
//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       initialMainHeaderAccess[mainHeader] = false;
      
//       const headerPages = sidebarStructure[mainHeader].pages;
//       headerPages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//           pagePerms[permType] = false;
//         });
//         initialPagePermissions[pageKey] = pagePerms;
        
//         // Initialize tab permissions
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               tabPerms[permType] = false;
//             });
//             initialTabPermissions[tabKey] = tabPerms;
//           });
//         }
//       });
//     });

//     // Set main header access from user's moduleAccess
//     if (userData.moduleAccess) {
//       Object.keys(userData.moduleAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && sidebarStructure[mainHeader]) {
//           initialMainHeaderAccess[mainHeader] = Boolean(userData.moduleAccess[apiModuleName]);
//         }
//       });
//     } else {
//       // If no moduleAccess in user data, check from user's actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             initialMainHeaderAccess[mainHeader] = true;
//           }
//         }
//       });
//     }

//     // Set page permissions from user's pageAccess or from actual permissions
//     if (userData.pageAccess) {
//       Object.keys(userData.pageAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && userData.pageAccess[apiModuleName]) {
//           Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
//             const pageKey = `${mainHeader}_${pageName}`;
//             const permissionsArray = userData.pageAccess[apiModuleName][pageName];
            
//             if (initialPagePermissions[pageKey]) {
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 initialPagePermissions[pageKey][permType] = 
//                   Array.isArray(permissionsArray) && 
//                   permissionsArray.includes(permType.toUpperCase());
//               });
//             }
//           });
//         }
//       });
//     } else {
//       // If no pageAccess in user data, set from actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission && !permission.tab) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             const pageKey = `${mainHeader}_${permission.page}`;
//             if (initialPagePermissions[pageKey]) {
//               initialPagePermissions[pageKey][permission.action.toUpperCase()] = true;
//             }
//           }
//         }
//       });
//     }

//     // Set tab permissions from user's tabAccess or from actual permissions
//     if (userData.tabAccess) {
//       Object.keys(userData.tabAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && userData.tabAccess[apiModuleName]) {
//           Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
//             Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//               const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//               if (!pageConfig) return;
              
//               let matchingTab = null;
//               if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                 matchingTab = pageConfig.tabs.find(tab => 
//                   tab.toUpperCase() === tabName.toUpperCase()
//                 );
                
//                 if (!matchingTab) {
//                   const fuzzyMatches = {
//                     'PENDING APPROVALS': 'PENDING APPROVALS',
//                     'PENDING APPROVAL': 'PENDING APPROVALS',
//                     'APPROVED': 'APPROVED',
//                     'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                     'ALLOCATED': 'ALLOCATED',
//                     'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                     'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                     'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                     'SUBMITTED': 'SUBMITTED',
//                     'REJECTED': 'REJECTED'
//                   };
                  
//                   const upperTabName = tabName.toUpperCase();
//                   if (fuzzyMatches[upperTabName]) {
//                     matchingTab = fuzzyMatches[upperTabName];
//                   }
//                 }
//               }
              
//               if (matchingTab) {
//                 const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                 const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                
//                 if (!initialTabPermissions[tabKey]) {
//                   initialTabPermissions[tabKey] = {};
//                 }
                
//                 if (Array.isArray(permissions)) {
//                   permissions.forEach(perm => {
//                     const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                     initialTabPermissions[tabKey][permKey] = true;
//                   });
//                 }
//               }
//             });
//           });
//         }
//       });
//     } else {
//       // If no tabAccess in user data, set from actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission && permission.tab) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             const tabKey = `${mainHeader}_${permission.page}_${permission.tab}`;
//             if (!initialTabPermissions[tabKey]) {
//               initialTabPermissions[tabKey] = {};
//             }
//             initialTabPermissions[tabKey][permission.action.toUpperCase()] = true;
//           }
//         }
//       });
//     }

//     setMainHeaderAccess(initialMainHeaderAccess);
//     setPagePermissions(initialPagePermissions);
//     setTabPermissions(initialTabPermissions);

//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Load Permissions');
//     showApiErrorAlert(errorMessage, 'Permissions Load Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, roles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Roles');
//       setFetchErrors(prev => ({ ...prev, roles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, branches: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Branches');
//       setFetchErrors(prev => ({ ...prev, branches: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//       setFetchErrors(prev => ({ ...prev, subdealers: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Subdealers');
//       setFetchErrors(prev => ({ ...prev, subdealers: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setVerticles(verticlesData);
//       setFetchErrors(prev => ({ ...prev, verticles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Verticles');
//       setFetchErrors(prev => ({ ...prev, verticles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//       setFetchErrors(prev => ({ ...prev, permissions: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Permissions');
//       setFetchErrors(prev => ({ ...prev, permissions: errorMessage }));
//       throw error;
//     }
//   };

// const fetchRolePermissionsData = async (roleId) => {
//   if (!roleId) return;
  
//   setIsLoadingPermissions(true);
//   try {
//     const res = await axiosInstance.get(`/roles/${roleId}`);
//     const roleData = res.data.data;

//     if (!roleData) {
//       throw new Error('Role data not found');
//     }

//     // Only initialize if it's a new user (not editing)
//     if (!id) {
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Now populate with role data
//       if (roleData.moduleAccess) {
//         Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = Boolean(roleData.moduleAccess[apiModuleName]);
//           }
//         });
//       }

//       if (roleData.pageAccess) {
//         Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.pageAccess[apiModuleName]) {
//             Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   const hasPermission = Array.isArray(permissionsArray) && 
//                     permissionsArray.includes(permType.toUpperCase());
                  
//                   initialPagePermissions[pageKey][permType] = hasPermission;
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Process tab access
//       if (roleData.tabAccess) {
//         Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.tabAccess[apiModuleName]) {
//             Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   if (Array.isArray(permissions)) {
//                     permissions.forEach(perm => {
//                       const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                       initialTabPermissions[tabKey][permKey] = true;
//                     });
//                   }
//                 }
//               });
//             });
//           }
//         });
//       }

//       // Also get permission IDs from role
//       let rolePermissionIds = [];
//       if (Array.isArray(roleData.permissions) && roleData.permissions.length > 0) {
//         roleData.permissions.forEach(perm => {
//           const permId = typeof perm === 'string' ? perm : (perm._id || perm.id);
//           if (permId && !rolePermissionIds.includes(permId)) {
//             rolePermissionIds.push(permId);
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);
      
//       // Set the formData permissions with role permissions for new user only
//       setFormData(prev => ({
//         ...prev,
//         permissions: rolePermissionIds
//       }));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch Role Permissions');
//     showApiErrorAlert(errorMessage, 'Role Permissions Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   // Helper to find main header by module name
//   const findMainHeaderByModule = (moduleName) => {
//     if (!moduleName) return null;
    
//     const moduleUpper = moduleName.toUpperCase();
//     for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
//       if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
//         return mainHeader;
//       }
//     }
    
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//   // Helper to find subdealer role
//   const findSubdealerRole = () => {
//     if (!roles || roles.length === 0) return null;
    
//     return roles.find(role => 
//       role.name.toLowerCase() === 'subdealer' || 
//       role.name.toLowerCase().includes('subdealer')
//     );
//   };

//   // Helper to extract permission IDs from current visual state
// const extractPermissionIdsFromState = () => {
//   const permissionIds = [];
  
//   Object.keys(mainHeaderAccess).forEach(mainHeader => {
//     if (mainHeaderAccess[mainHeader]) {
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       sidebarStructure[mainHeader].pages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = pagePermissions[pageKey] || {};
        
//         // Add page permission IDs
//         Object.keys(pagePerms).forEach(permType => {
//           if (pagePerms[permType]) {
//             const permission = permissionsList.find(perm => 
//               apiModuleNames.some(apiModuleName => 
//                 perm.module.toUpperCase() === apiModuleName.toUpperCase()
//               ) && 
//               perm.page === page.name && 
//               perm.action === permType.toUpperCase() &&
//               !perm.tab
//             );
            
//             if (permission) {
//               permissionIds.push(permission._id);
//             }
//           }
//         });
        
//         // Add tab permission IDs
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = tabPermissions[tabKey] || {};
            
//             Object.keys(tabPerms).forEach(permType => {
//               if (tabPerms[permType]) {
//                 const permission = permissionsList.find(perm => 
//                   apiModuleNames.some(apiModuleName => 
//                     perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                   ) && 
//                   perm.page === page.name && 
//                   perm.action === permType.toUpperCase() &&
//                   perm.tab === tab
//                 );
                
//                 if (permission) {
//                   permissionIds.push(permission._id);
//                 }
//               }
//             });
//           });
//         }
//       });
//     }
//   });
  
//   return [...new Set(permissionIds)]; // Remove duplicates
// };

//  const handleChange = async (e) => {
//   const { name, value, type, checked } = e.target;
  
//   try {
//     // Handle checkbox inputs
//     if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
      
//       // For new users, clear existing permissions when selecting a new role
//       if (!id) {
//         setFormData(prev => ({ 
//           ...prev, 
//           permissions: [] 
//         }));
//       }
      
//       // Fetch role permissions (won't affect existing user's permissions)
//       await fetchRolePermissionsData(value);
//     }

//     if (name === 'type') {
//       if (value === 'subdealer') {
//         const subdealerRole = findSubdealerRole();
//         if (subdealerRole) {
//           // Auto-select logged-in user's subdealer if they are a subdealer
//           let selectedSubdealer = '';
//           if (isLoggedInSubdealer && loggedInUserSubdealerId) {
//             selectedSubdealer = loggedInUserSubdealerId;
//           }
          
//           setFormData(prev => ({ 
//             ...prev, 
//             type: value,
//             roleId: subdealerRole._id,
//             subdealer: selectedSubdealer,
//             permissions: []
//           }));
//           await fetchRolePermissionsData(subdealerRole._id);
//           setShowPermissions(true);
//         }
//       } else {
//         setFormData(prev => ({ 
//           ...prev, 
//           type: value,
//           roleId: '',
//           subdealer: '',
//           permissions: [] // Clear permissions when switching from subdealer
//         }));
//         setShowPermissions(false);
//       }
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Handle Change');
//     showApiErrorAlert(errorMessage, 'Form Change Error');
//   }
// };

//   const handleVerticalChange = (e) => {
//     try {
//       const selectedId = e.target.value;
//       if (selectedId && !formData.verticles.includes(selectedId)) {
//         setFormData(prev => ({
//           ...prev,
//           verticles: [...prev.verticles, selectedId]
//         }));
//       }
//       setErrors(prev => ({ ...prev, verticles: '' }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Vertical Change');
//       showApiErrorAlert(errorMessage, 'Vertical Selection Error');
//     }
//   };

//   const removeVertical = (verticalId) => {
//     try {
//       setFormData(prev => {
//         const newVerticles = prev.verticles.filter(id => id !== verticalId);
//         return {
//           ...prev,
//           verticles: newVerticles
//         };
//       });
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Remove Vertical');
//       showApiErrorAlert(errorMessage, 'Vertical Removal Error');
//     }
//   };

//   const togglePageExpansion = (pageKey) => {
//     try {
//       setExpandedPages(prev => ({
//         ...prev,
//         [pageKey]: !prev[pageKey]
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Toggle Page Expansion');
//       showApiErrorAlert(errorMessage, 'UI Error');
//     }
//   };

//   // Check if a permission exists in the system
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return false;
      
//       return permissionsList.some(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
//       );
//     } catch (error) {
//       console.error('Error checking permission existence:', error);
//       return false;
//     }
//   };

//   // Get all tab permissions that exist in API for a page
//   const getAvailableTabsForPage = (mainHeader, page) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return [];
      
//       const tabs = new Set();
//       permissionsList.forEach(perm => {
//         if (apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.tab) {
//           tabs.add(perm.tab);
//         }
//       });
      
//       return Array.from(tabs);
//     } catch (error) {
//       console.error('Error getting available tabs:', error);
//       return [];
//     }
//   };

//   // Handle page permission change
//   const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: {
//           ...prev[pageKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         !perm.tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Page Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle tab permission change
//   const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: {
//           ...prev[tabKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         perm.tab === tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Tab Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all permissions for a page
//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
//         if (permissionExists) {
//           newPagePerms[permType] = true;
          
//           const permission = permissionsList.find(perm => 
//             apiModuleNames.some(apiModuleName => 
//               perm.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             perm.page === page && 
//             perm.action === permType.toUpperCase() &&
//             !perm.tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         } else {
//           newPagePerms[permType] = false;
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all permissions for a page
//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         newPagePerms[permType] = false;
        
//         const permission = permissionsList.find(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           perm.page === page && 
//           perm.action === permType.toUpperCase() &&
//           !perm.tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all tab permissions
//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(perm => {
//         const exists = checkPermissionExists(mainHeader, page, perm, tab);
//         newPerms[perm] = perm === "VIEW" ? exists : false;
        
//         if (perm === "VIEW" && exists) {
//           const permission = permissionsList.find(p => 
//             apiModuleNames.some(apiModuleName => 
//               p.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             p.page === page && 
//             p.action === "VIEW" &&
//             p.tab === tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all tab permissions
//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       const newPerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//         newPerms[perm] = false;
        
//         const permission = permissionsList.find(p => 
//           apiModuleNames.some(apiModuleName => 
//             p.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           p.page === page && 
//           p.action === perm.toUpperCase() &&
//           p.tab === tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle global actions for the three buttons
//   const handleGlobalAction = (actionType) => {
//     try {
//       switch (actionType) {
//         case 'none':
//           setFormData(prev => ({ ...prev, permissions: [] }));
          
//           const clearedPagePermissions = {};
//           const clearedTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = false;
//               });
//               clearedPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = false;
//                   });
//                   clearedTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(clearedPagePermissions);
//           setTabPermissions(clearedTabPermissions);
//           break;
          
//         case 'selectAll':
//           const allPermissionIds = permissionsList.map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
          
//           const allPagePermissions = {};
//           const allTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//               });
//               allPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                   });
//                   allTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(allPagePermissions);
//           setTabPermissions(allTabPermissions);
//           break;
          
//         case 'viewOnly':
//           const viewPermissionIds = permissionsList
//             .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
//             .map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
          
//           const viewPagePermissions = {};
//           const viewTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 if (permType === 'VIEW') {
//                   pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//                 } else {
//                   pagePerms[permType] = false;
//                 }
//               });
//               viewPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     if (permType === 'VIEW') {
//                       tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                     } else {
//                       tabPerms[permType] = false;
//                     }
//                   });
//                   viewTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(viewPagePermissions);
//           setTabPermissions(viewTabPermissions);
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Global Permission Action');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle main header access change
//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     try {
//       setMainHeaderAccess(prev => ({
//         ...prev,
//         [mainHeader]: hasAccess
//       }));

//       if (!hasAccess) {
//         const newPagePermissions = { ...pagePermissions };
//         const newTabPermissions = { ...tabPermissions };
        
//         sidebarStructure[mainHeader].pages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const perms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//             perms[perm] = false;
//           });
//           newPagePermissions[pageKey] = perms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//                 tabPerms[perm] = false;
//               });
//               newTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
        
//         setPagePermissions(newPagePermissions);
//         setTabPermissions(newTabPermissions);
        
//         const apiModuleNames = moduleNameMap[mainHeader];
//         const modulePermissions = permissionsList.filter(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           )
//         );
//         const modulePermissionIds = modulePermissions.map(perm => perm._id);
        
//         setFormData(prev => ({
//           ...prev,
//           permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
//         }));
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Main Header Access Change');
//       showApiErrorAlert(errorMessage, 'Access Control Error');
//     }
//   };

//   // Render permissions table for a page
//   const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
//     try {
//       const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
//       const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       // For tabs, only show VIEW permission (renamed to "Access")
//       const displayPermissions = isTab ? ["VIEW"] : availablePermissions;
      
//       return (
//         <CTable bordered responsive hover small className="permission-table mt-2">
//           <CTableHead color="light">
//             <CTableRow>
//               <CTableHeaderCell scope="col" className="text-nowrap">
//                 {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
//               </CTableHeaderCell>
//               {displayPermissions.map((perm) => (
//                 <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
//                   {getPermissionDisplayLabel(perm, isTab)}
//                 </CTableHeaderCell>
//               ))}
//               <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             <CTableRow>
//               <CTableDataCell>
//                 <strong>{isTab ? tabName : page}</strong>
//               </CTableDataCell>
//               {displayPermissions.map((perm) => {
//                 const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
//                 const isChecked = permissions[perm] || false;
                
//                 return (
//                   <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
//                     {permissionExists ? (
//                       <CFormCheck
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={(e) => {
//                           if (isTab) {
//                             handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
//                           } else {
//                             handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
//                           }
//                         }}
//                         aria-label={`${page}-${perm}`}
//                         title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
//                       />
//                     ) : (
//                       <span className="text-muted" title="Permission not available in system">
//                         N/A
//                       </span>
//                     )}
//                   </CTableDataCell>
//                 );
//               })}
//               <CTableDataCell className="text-center">
//                 <CButtonGroup size="sm">
//                   <CButton 
//                     color="primary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleSelectAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleSelectAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Select all available permissions"
//                   >
//                     All
//                   </CButton>
//                   <CButton 
//                     color="secondary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleClearAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleClearAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Clear all permissions"
//                   >
//                     None
//                   </CButton>
//                 </CButtonGroup>
//               </CTableDataCell>
//             </CTableRow>
//           </CTableBody>
//         </CTable>
//       );
//     } catch (error) {
//       console.error('Error rendering permissions table:', error);
//       return (
//         <CAlert color="danger">
//           Error rendering permissions table. Please refresh the page.
//         </CAlert>
//       );
//     }
//   };

//   const validateForm = () => {
//     try {
//       const newErrors = {};
//       if (!formData.name.trim()) newErrors.name = 'Name is required';
//       if (!formData.type) newErrors.type = 'Type is required';
      
//       if (formData.type === 'employee') {
//         if (!formData.branch) newErrors.branch = 'Branch is required for employee';
//         if (!formData.roleId) newErrors.roleId = 'Role is required for employee';
//       }
      
//       if (formData.type === 'subdealer') {
//         if (!formData.subdealer) newErrors.subdealer = 'Subdealer is required';
//         // Role is auto-selected for subdealer, so no validation needed
//       }
      
//       if (!formData.email.trim()) newErrors.email = 'Email is required';
//       if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
      
//       // Only validate discount if user type is NOT subdealer AND logged-in user is not SUBDEALER
//       if (formData.type !== 'subdealer' && !isLoggedInSubdealerRole && !formData.discount) {
//         newErrors.discount = 'Discount is required';
//       }
      
//       // Email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (formData.email && !emailRegex.test(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
      
//       // Mobile validation (basic)
//       const mobileRegex = /^[0-9]{10}$/;
//       if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
//         newErrors.mobile = 'Please enter a valid 10-digit mobile number';
//       }
      
//       const selectedRole = roles.find(role => role._id === formData.roleId);
//       if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
//         if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//         if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
        
//         // Validate numeric values
//         if (formData.totalDeviationAmount && isNaN(parseFloat(formData.totalDeviationAmount))) {
//           newErrors.totalDeviationAmount = 'Please enter a valid number';
//         }
//         if (formData.perTransactionDeviationLimit && isNaN(parseFloat(formData.perTransactionDeviationLimit))) {
//           newErrors.perTransactionDeviationLimit = 'Please enter a valid number';
//         }
//       }
      
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Form Validation');
//       showApiErrorAlert(errorMessage, 'Validation Error');
//       return false;
//     }
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) return;

//   setIsLoading(true);
  
//   try {
//     // Sync permissions from visual state to formData
//     const syncedPermissionIds = extractPermissionIdsFromState();
    
//     // Filter out null/undefined values from permissions
//     const validPermissions = [...new Set([...syncedPermissionIds, ...formData.permissions])].filter(perm => 
//       perm !== null && perm !== undefined && perm !== ''
//     );
    
//     const payload = {
//       name: formData.name.trim(),
//       type: formData.type,
//       roles: formData.roleId,
//       email: formData.email.trim(),
//       mobile: formData.mobile.trim(),
//       csd: formData.csd, // Include CSD field
//       permissions: validPermissions,
//       verticles: formData.verticles,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//       ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
//       ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
//       ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//       ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//     };

//     console.log('Submitting payload:', payload);
//     console.log('Permission count:', validPermissions.length);

//     if (id) {
//       await axiosInstance.put(`/users/${id}`, payload);
//       await refreshPermissions();
//       await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//     } else {
//       await axiosInstance.post('/auth/register', payload);
//       await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Submit Form');
    
//     // Show detailed error in alert
//     showApiErrorAlert(errorMessage, 'Submission Error');
    
//     // Also show the sweet alert for form submission errors
//     showFormSubmitError(error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  
//   // Check if the selected role is SALES_EXECUTIVE
//   const isSalesExecutiveRole = selectedRole && selectedRole.name && selectedRole.name.toUpperCase() === 'SALES_EXECUTIVE';
  
//   const getSelectedVerticalNames = () => {
//     return formData.verticles.map(item => {
//       const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
//       const vertical = verticles.find(v => 
//         v._id === verticalId || v.id === verticalId
//       );
//       return vertical ? vertical.name || String(verticalId) : String(verticalId);
//     });
//   };

//   // Get the selected subdealer name for display
//   const getSelectedSubdealerName = () => {
//     if (!formData.subdealer) return '';
    
//     const subdealer = subdealers.find(s => s.id === formData.subdealer || s._id === formData.subdealer);
//     return subdealer ? subdealer.name : formData.subdealer;
//   };

//   // Render fetch errors if any
//   const renderFetchErrors = () => {
//     const errorMessages = Object.entries(fetchErrors)
//       .filter(([_, error]) => error !== null)
//       .map(([key, error]) => `${key}: ${error}`);

//     if (errorMessages.length === 0) return null;

//     return (
//       <CAlert color="warning" className="mb-3">
//         <div className="d-flex align-items-center">
//           <CIcon icon={cilWarning} className="me-2" />
//           <div>
//             <strong>Some data failed to load:</strong>
//             <ul className="mb-0 mt-1">
//               {errorMessages.map((msg, index) => (
//                 <li key={index}>{msg}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </CAlert>
//     );
//   };

//   if (isLoading && !id) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//         <span className="ms-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       {/* Global API Error Alert */}
//       {apiError && (
//         <CAlert 
//           color="danger" 
//           className="mb-3" 
//           dismissible
//           onClose={() => setApiError(null)}
//         >
//           <div className="d-flex align-items-center">
//             <CIcon icon={cilWarning} className="me-2" />
//             <div>
//               <strong>{apiError.context}</strong>
//               <p className="mb-0">{apiError.message}</p>
//             </div>
//           </div>
//         </CAlert>
//       )}

//       {/* Fetch Errors Alert */}
//       {renderFetchErrors()}

//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <FormErrorBoundary section="User Details">
//               <div className="user-details">
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Name</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="text" 
//                       name="name" 
//                       value={formData.name} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="Enter full name"
//                     />
//                   </CInputGroup>
//                   {errors.name && <p className="error">{errors.name}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPeople} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="type" 
//                       value={formData.type} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                     >
//                       <option value="employee">Employee</option>
//                       <option value="subdealer">Subdealer</option>
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.type && <p className="error">{errors.type}</p>}
//                 </div>
                
//                 {formData.type === 'employee' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Branch</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilLocationPin} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="branch" 
//                         value={formData.branch} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.branches}
//                       >
//                         <option value="">-Select-</option>
//                         {branches.map(branch => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.branch && <p className="error">{errors.branch}</p>}
//                     {fetchErrors.branches && (
//                       <small className="text-warning">Branches data unavailable: {fetchErrors.branches}</small>
//                     )}
//                   </div>
//                 )}

//                 {formData.type === 'subdealer' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="subdealer" 
//                         value={formData.subdealer} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.subdealers || (isLoggedInSubdealer && !id)}
//                       >
//                         <option value="">-Select Subdealer-</option>
//                         {subdealers.map(subdealer => (
//                           <option key={subdealer.id} value={subdealer.id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {fetchErrors.subdealers && (
//                       <small className="text-warning">Subdealers data unavailable: {fetchErrors.subdealers}</small>
//                     )}
                   
//                   </div>
//                 )}
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Role</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="roleId" 
//                       value={formData.roleId} 
//                       onChange={handleChange}
//                       disabled={isLoading || fetchErrors.roles || formData.type === 'subdealer'}
//                     >
//                       <option value="">-Select-</option>
//                       {roles.map(role => (
//                         <option key={role._id} value={role._id}>
//                           {role.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.roleId && <p className="error">{errors.roleId}</p>}
//                   {formData.type === 'subdealer' ? (
//                     <small className="text-muted">Role is automatically set to Subdealer and cannot be changed</small>
//                   ) : (
//                     <small className="text-muted">Select the role for this user</small>
//                   )}
//                   {fetchErrors.roles && (
//                     <small className="text-warning">Roles data unavailable: {fetchErrors.roles}</small>
//                   )}
//                 </div>
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Email</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilEnvelopeClosed} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="email" 
//                       name="email" 
//                       value={formData.email} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="user@example.com"
//                     />
//                   </CInputGroup>
//                   {errors.email && <p className="error">{errors.email}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Mobile number</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPhone} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="tel" 
//                       name="mobile" 
//                       value={formData.mobile} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="10-digit mobile number"
//                     />
//                   </CInputGroup>
//                   {errors.mobile && <p className="error">{errors.mobile}</p>}
//                 </div>

//                 {/* Only show discount field if NOT creating a subdealer AND logged-in user is NOT a SUBDEALER */}
//                 {formData.type !== 'subdealer' && !isLoggedInSubdealerRole && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Discount</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilDollar} />
//                       </CInputGroupText>
//                       <CFormInput 
//                         type="number" 
//                         name="discount" 
//                         value={formData.discount} 
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         min="0"
//                         step="0.01"
//                         placeholder="0.00"
//                       />
//                     </CInputGroup>
//                     {errors.discount && <p className="error">{errors.discount}</p>}
//                   </div>
//                 )}

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Verticles</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilTag} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="vertical" 
//                       value="" 
//                       onChange={handleVerticalChange}
//                       disabled={isLoading || fetchErrors.verticles}
//                     >
//                       <option value="">-Select Verticle-</option>
//                       {verticles
//                         .filter(vertical => vertical.status === 'active')
//                         .map(vertical => (
//                           <option 
//                             key={vertical._id} 
//                             value={vertical._id}
//                             disabled={formData.verticles.includes(vertical._id)}
//                           >
//                             {vertical.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
                  
//                   <div className="mt-2">
//                     <div className="d-flex flex-wrap gap-2">
//                       {getSelectedVerticalNames().map((verticalName, index) => {
//                         const verticalId = formData.verticles[index];
//                         return (
//                           <CBadge 
//                             key={`${verticalId}_${index}`} 
//                             color="primary"
//                             className="d-flex align-items-center"
//                             style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//                           >
//                             {String(verticalName)}
//                             <CCloseButton 
//                               className="ms-2"
//                               onClick={() => removeVertical(verticalId)}
//                               style={{ fontSize: '0.75rem' }}
//                               disabled={isLoading}
//                             />
//                           </CBadge>
//                         );
//                       })}
//                     </div>
//                     <small className="text-muted">
//                       {formData.verticles.length} verticle(s) selected (Optional)
//                     </small>
//                     {fetchErrors.verticles && (
//                       <small className="text-warning d-block">Verticles data unavailable: {fetchErrors.verticles}</small>
//                     )}
//                   </div>
//                 </div>

//                 {/* Only show CSD field when all these conditions are met:
//                     1. Logged-in user is NOT a SUBDEALER
//                     2. User type is NOT 'subdealer'
//                     3. Selected role is NOT 'SALES_EXECUTIVE'
//                 */}
//                 {!isLoggedInSubdealerRole && formData.type !== 'subdealer' && !isSalesExecutiveRole && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">CSD</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <div className="form-check form-switch mt-2 ms-2">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           name="csd"
//                           id="csdCheckbox"
//                           checked={formData.csd}
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           style={{ width: '3em', height: '1.5em' }}
//                         />
//                         <label className="form-check-label ms-2" htmlFor="csdCheckbox">
//                           {formData.csd ? 'Yes' : 'No'}
//                         </label>
//                       </div>
//                     </CInputGroup>
//                     <small className="text-muted">
//                       Customer Service Department access
//                     </small>
//                   </div>
//                 )}

//                 {isManager && (
//                   <>
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Total Deviation Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="totalDeviationAmount" 
//                           value={formData.totalDeviationAmount} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                     </div>

//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Per Transaction Deviation Limit</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="perTransactionDeviationLimit" 
//                           value={formData.perTransactionDeviationLimit} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </FormErrorBoundary>

//             {showPermissions && (
//               <FormErrorBoundary section="Permissions Configuration">
//                 <div className="permissions-container mt-4">
//                   <h5 className="mb-3">User Permissions Configuration</h5>
//                   <p className="text-muted mb-4">
//                     These permissions are in addition to the role permissions. 
//                     Total system permissions: {permissionsList.length}
//                     {fetchErrors.permissions && (
//                       <span className="text-warning ms-2">(Permissions data incomplete: {fetchErrors.permissions})</span>
//                     )}
//                   </p>
                  
//                   {/* Three global permission buttons added here */}
//                   <div className="mb-3">
//                     <CButtonGroup>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('none')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         None
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('selectAll')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         Select All
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('viewOnly')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         View Only
//                       </CButton>
//                     </CButtonGroup>
//                   </div>

//                   {isLoadingPermissions ? (
//                     <div className="d-flex justify-content-center align-items-center py-4">
//                       <CSpinner color="primary" />
//                       <span className="ms-2">Loading permissions...</span>
//                     </div>
//                   ) : (
//                     <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                       {Object.keys(sidebarStructure).map((mainHeader) => {
//                         const hasAccess = mainHeaderAccess[mainHeader] || false;
//                         const pageCount = sidebarStructure[mainHeader].pages.length;

//                         return (
//                           <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                             <CAccordionHeader>
//                               <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//                                 <div>
//                                   <h6 className="mb-0">{mainHeader}</h6>
//                                   <small className="text-muted">{pageCount} pages</small>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2">
//                                   <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//                                     {hasAccess ? 'Access Granted' : 'No Access'}
//                                   </CBadge>
//                                   <div className="d-flex align-items-center" role="group">
//                                     <CButton
//                                       size="sm"
//                                       color={hasAccess ? "success" : "secondary"}
//                                       variant="outline"
//                                       className="me-1"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, true);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilCheck} /> Yes
//                                     </CButton>
//                                     <CButton
//                                       size="sm"
//                                       color={!hasAccess ? "danger" : "secondary"}
//                                       variant="outline"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, false);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilX} /> No
//                                     </CButton>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CAccordionHeader>
//                             <CAccordionBody>
//                               {hasAccess ? (
//                                 <div className="pages-permissions">
//                                   {sidebarStructure[mainHeader].pages.map((page) => {
//                                     const pageKey = `${mainHeader}_${page.name}`;
//                                     const isExpanded = expandedPages[pageKey] || false;
//                                     const pageHasTabs = page.tabs && page.tabs.length > 0;
//                                     const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                                     const hasTabPermissions = availableTabs.length > 0;
                                    
//                                     return (
//                                       <CCard key={pageKey} className="mb-3">
//                                         <CCardBody>
//                                           <div className="d-flex justify-content-between align-items-center mb-2">
//                                             <h6 className="mb-0">{page.name}</h6>
//                                             <div className="d-flex align-items-center gap-2">
//                                               {pageHasTabs && hasTabPermissions && (
//                                                 <CButton
//                                                   size="sm"
//                                                   color="link"
//                                                   onClick={() => togglePageExpansion(pageKey)}
//                                                   className="p-0"
//                                                   disabled={isLoading || isLoadingPermissions}
//                                                 >
//                                                   {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                                 </CButton>
//                                               )}
//                                             </div>
//                                           </div>
                                          
//                                           {/* Page-level permissions */}
//                                           {renderPermissionsTable(mainHeader, page.name, false)}
                                          
//                                           {/* Tab-level permissions (if available) */}
//                                           {pageHasTabs && hasTabPermissions && (
//                                             <CCollapse visible={isExpanded}>
//                                               <div className="mt-3">
//                                                 <h6 className="mb-2">Tab Permissions</h6>
//                                                 {availableTabs.map((tab) => (
//                                                   <div key={`${pageKey}_${tab}`} className="mb-3">
//                                                     {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             </CCollapse>
//                                           )}
//                                         </CCardBody>
//                                       </CCard>
//                                     );
//                                   })}
//                                 </div>
//                               ) : (
//                                 <div className="text-center py-4">
//                                   <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                                   <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                                   <small>Click "Yes" to grant access and configure permissions</small>
//                                 </div>
//                               )}
//                             </CAccordionBody>
//                           </CAccordionItem>
//                         );
//                       })}
//                     </CAccordion>
//                   )}
//                 </div>
//               </FormErrorBoundary>
//             )}

//             <div className="form-footer">
//               <button 
//                 type="submit" 
//                 className="cancel-button"
//                 disabled={isLoading || isLoadingPermissions}
//               >
//                 {isLoading ? (
//                   <>
//                     <CSpinner size="sm" className="me-2" />
//                     {id ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//               <button 
//                 type="button" 
//                 className="submit-button" 
//                 onClick={handleCancel}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;





// import React, { useState, useEffect, useContext } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CCard,
//   CCardBody,
//   CCollapse
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich, cilWarning, cilBuilding } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../../context/AuthContext';

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete",
//   "READ": "View",
//   "WRITE": "Edit"
// };

// // Tab permission label mapping (only show "Access" instead of "VIEW" for tabs)
// const tabPermissionLabelMap = {
//   "VIEW": "Access",
//   "CREATE": "Create",
//   "UPDATE": "Update", 
//   "DELETE": "Delete"
// };

// // Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
// const sidebarStructure = {
//   "Dashboard": {
//     pages: [{
//       name: "Dashboard",
//       tabs: null
//     }],
//     availablePermissions: ["VIEW"]
//   },
//   "Purchase": {
//     pages: [
//       { name: "Inward Stock", tabs: null },
//       { 
//         name: "Stock Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
//       },
//       { name: "Stock Transfer", tabs: null },
//       { name: "Upload Challan", tabs: null },
//       { name: "RTO Chassis", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       },
//       { name: "Self Insurance", tabs: null },
//       { name: "Delivery Challan", tabs: null },
//       { name: "GST Invoice", tabs: null },
//       { name: "Helmet Invoice", tabs: null },
//       { name: "Deal Form", tabs: null },
//       { name: "Upload Deal Form & Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales Report": {
//     pages: [
//       { name: "Sales Person Wise", tabs: null },
//       { name: "Periodic Report", tabs: null }
//     ],
//     availablePermissions: ["VIEW"]
//   },
//   "Quotation": {
//     pages: [
//       { name: "Quotation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Account": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Receipts", 
//         tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
//       },
//       { name: "Debit Note", tabs: null },
//       { name: "Refund", tabs: null },
//       { 
//         name: "Cancelled Booking", 
//         tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
//       },
//       { name: "All Receipts", tabs: null },
//       { name: "Ledgers", tabs: null },
//       { name: "Exchange Ledger", tabs: null },
//       { 
//         name: "Broker Payment Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Insurance": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Insurance Details", 
//         tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "RTO": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Application", 
//         tabs: ["RTO PENDING", "APPLIED FOR"]
//       },
//       { 
//         name: "RTO Paper", 
//         tabs: ["RTO PAPER PENDING", "COMPLETED"]
//       },
//       { 
//         name: "RTO Tax", 
//         tabs: ["RTO PENDING TAX", "TAX PAID"]
//       },
//       { 
//         name: "HSRP Ordering", 
//         tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
//       },
//       { 
//         name: "HSRP Installation", 
//         tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
//       },
//       { 
//         name: "RC Confirmation", 
//         tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Management": {
//     pages: [
//       { name: "Cash Voucher", tabs: null },
//       { name: "Contra Voucher", tabs: null },
//       { 
//         name: "Contra Approval", 
//         tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
//       },
//       { name: "Workshop Cash Receipt", tabs: null },
//       { name: "All Cash Receipt", tabs: null },
//       { name: "Cash Book", tabs: null },
//       { name: "Day Book", tabs: null },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Masters": {
//     pages: [
//       { name: "Location", tabs: null },
//       { name: "Headers", tabs: null },
//       { name: "Vehicles", tabs: null },
//       { name: "Minimum Booking Amount", tabs: null },
//       { name: "Template List", tabs: null },
//       { name: "Accessories", tabs: null },
//       { name: "Colour", tabs: null },
//       { name: "Documents", tabs: null },
//       { name: "Terms & Conditions", tabs: null },
//       { name: "Offer", tabs: null },
//       { name: "Attachments", tabs: null },
//       { name: "Declaration", tabs: null },
//       { name: "RTO", tabs: null },
//       { name: "Financer", tabs: null },
//       { name: "Finance Rates", tabs: null },
//       { name: "Insurance Providers", tabs: null },
//       { name: "Brokers", tabs: null },
//       { name: "Broker Commission Range", tabs: null },
//       { name: "Vertical Masters", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Master": {
//     pages: [
//       { name: "Cash Account Master", tabs: null },
//       { name: "Bank Account Master", tabs: null },
//       { name: "Payment Mode", tabs: null },
//       { name: "Expense Master", tabs: null },
//       { name: "Add Opening Balance", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Accessories Billing": {
//     pages: [
//       { name: "Accessories Billing", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Customers": {
//     pages: [
//       { name: "Customers", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer": {
//     pages: [
//       { 
//         name: "Subdealer Stock Audit", 
//         tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Master": {
//     pages: [
//       { name: "Subdealer List", tabs: null },
//       { name: "Subdealer Audit List", tabs: null },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Calculate Commission", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Booking": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
//       },
//       { name: "Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Management": {
//     pages: [
//       { 
//         name: "Subdealer Management", 
//         tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Account": {
//     pages: [
//       { name: "Add Balance", tabs: null },
//       { name: "OnAccount Balance", tabs: null },
//       { name: "Add Amount", tabs: null },
//       { 
//         name: "Finance Payment", 
//         tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
//       },
//       { 
//         name: "Payment Verification", 
//         tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
//       },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Payment Summary", tabs: null },
//       { 
//         name: "Subdealer Ledger", 
//         tabs: ["SUB DEALER", "SUB DEALER UTR"]
//       },
//       { name: "Customer Ledger", tabs: null },
//       { 
//         name: "Summary", 
//         tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "User Management": {
//     pages: [
//       { name: "Create Role", tabs: null },
//       { name: "All Role", tabs: null },
//       { name: "Add User", tabs: null },
//       { name: "User List", tabs: null },
//       { name: "Buffer Report", tabs: null },
//       { name: "Manager Deviation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   }
// };

// // Map sidebar module names to API module names
// const moduleNameMap = {
//   "Dashboard": ["DASHBOARD"],
//   "Purchase": ["PURCHASE"],
//   "Sales": ["SALES"],
//   "Sales Report": ["SALES REPORT", "SALES_REPORT"],
//   "Quotation": ["QUOTATION"],
//   "Account": ["ACCOUNT"],
//   "Insurance": ["INSURANCE"],
//   "RTO": ["RTO"],
//   "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
//   "Masters": ["MASTERS"],
//   "Fund Master": ["FUND MASTER", "FUND_MASTER"],
//   "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
//   "Customers": ["CUSTOMERS"],
//   "Subdealer": ["SUBDEALER"],
//   "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
//   "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
//   "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
//   "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   if (isTab) {
//     return tabPermissionLabelMap[permission] || permission;
//   }
//   return permissionLabelMap[permission] || permission;
// };

// // Error boundary component for form sections
// const FormErrorBoundary = ({ children, section }) => {
//   const [hasError, setHasError] = useState(false);
//   const [error, setError] = useState(null);

//   return hasError ? (
//     <CAlert color="danger" className="mt-3">
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilWarning} className="me-2" />
//         <div>
//           <strong>Error in {section}</strong>
//           <p className="mb-0">{error?.message || 'An unexpected error occurred'}</p>
//         </div>
//       </div>
//     </CAlert>
//   ) : (
//     <ErrorBoundaryWrapper setHasError={setHasError} setError={setError}>
//       {children}
//     </ErrorBoundaryWrapper>
//   );
// };

// const ErrorBoundaryWrapper = ({ children, setHasError, setError }) => {
//   useEffect(() => {
//     const errorHandler = (error) => {
//       console.error('Component error:', error);
//       setHasError(true);
//       setError(error);
//     };
    
//     window.addEventListener('error', errorHandler);
//     return () => window.removeEventListener('error', errorHandler);
//   }, [setHasError, setError]);
  
//   return children;
// };

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealer: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     csd: false,
//     branchAccess: 'OWN',
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchErrors, setFetchErrors] = useState({
//     roles: null,
//     branches: null,
//     subdealers: null,
//     verticles: null,
//     permissions: null
//   });
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const { refreshPermissions, user: authUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Check if logged-in user is a subdealer
//   const isLoggedInSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const loggedInUserSubdealerId = authUser?.subdealer?._id;
//   const loggedInUserSubdealerName = authUser?.subdealer?.name;

//   // Check if logged-in user has SUBDEALER role
//   const loggedInUserRole = authUser?.roles?.[0]?.name || '';
//   const isLoggedInSubdealerRole = loggedInUserRole === 'SUBDEALER';

//   // Error handling utility functions
//   const handleApiError = (error, context = 'Operation') => {
//     console.error(`${context} error:`, error);
    
//     let errorMessage = 'An unexpected error occurred';
    
//     if (error.response) {
//       // Server responded with error status
//       const { data, status } = error.response;
      
//       if (data && data.message) {
//         errorMessage = data.message;
//       } else if (status === 401) {
//         errorMessage = 'Authentication failed. Please login again.';
//       } else if (status === 403) {
//         errorMessage = 'You do not have permission to perform this action.';
//       } else if (status === 404) {
//         errorMessage = 'Resource not found.';
//       } else if (status >= 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else {
//         errorMessage = `Request failed with status ${status}`;
//       }
//     } else if (error.request) {
//       // Request made but no response
//       errorMessage = 'Network error. Please check your connection.';
//     } else {
//       // Something else happened
//       errorMessage = error.message || errorMessage;
//     }
    
//     return errorMessage;
//   };

//   const showApiErrorAlert = (errorMessage, context = 'Error') => {
//     setApiError({
//       message: errorMessage,
//       context: context,
//       timestamp: new Date().toISOString()
//     });
    
//     // Auto-clear after 10 seconds
//     setTimeout(() => {
//       setApiError(null);
//     }, 10000);
//   };

//   // Handle role auto-selection when type changes to subdealer
//   useEffect(() => {
//     if (formData.type === 'subdealer' && roles.length > 0 && !formData.roleId) {
//       const subdealerRole = roles.find(role => 
//         role.name.toLowerCase() === 'subdealer' || 
//         role.name.toLowerCase().includes('subdealer')
//       );
      
//       if (subdealerRole) {
//         setFormData(prev => ({ 
//           ...prev, 
//           roleId: subdealerRole._id
//         }));
        
//         // Load permissions for subdealer role
//         fetchRolePermissionsData(subdealerRole._id);
//         setShowPermissions(true);
//       }
//     }
//   }, [formData.type, roles, formData.roleId]);

//   // Also handle when user switches from subdealer back to employee
//   useEffect(() => {
//     if (formData.type !== 'subdealer' && !id) {
//       // For new users, clear role when switching from subdealer to employee
//       setFormData(prev => ({ 
//         ...prev, 
//         roleId: '',
//         subdealer: ''
//       }));
//       setShowPermissions(false);
//     }
//   }, [formData.type, id]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//         showApiErrorAlert('Invalid authentication token. Please login again.', 'Authentication');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setIsLoading(true);
//         await Promise.all([
//           fetchRoles(),
//           fetchBranches(),
//           fetchSubdealers(),
//           fetchVerticles(),
//           fetchAllPermissions()
//         ]);
        
//         if (id) {
//           await fetchUser(id);
//         }
//       } catch (error) {
//         const errorMessage = handleApiError(error, 'Initialization');
//         showApiErrorAlert(errorMessage, 'Initialization Error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     initializeData();
//   }, [id]);

//  const fetchUser = async (userId) => {
//   try {
//     const res = await axiosInstance.get(`/users/${userId}`);
//     const userData = res.data.data;
    
//     if (!userData) {
//       throw new Error('User data not found');
//     }
    
//     // Extract permission IDs from user's permissions array
//     let userPermissions = [];
//     if (Array.isArray(userData.permissions)) {
//       userPermissions = userData.permissions
//         .map(p => {
//           if (!p) return null;
//           if (typeof p === 'string' && p.length > 0) return p;
//           if (typeof p === 'object') {
//             if (p._id) return p._id;
//             if (p.permission) {
//               if (typeof p.permission === 'string') return p.permission;
//               if (p.permission._id) return p.permission._id;
//             }
//           }
//           return null;
//         })
//         .filter(id => id !== null && id !== undefined);
//     }
    
//     // Extract verticle IDs
//     let userVerticles = [];
//     if (Array.isArray(userData.verticles)) {
//       userVerticles = userData.verticles.map(v => v._id || v.id);
//     }
//     if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//       userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
//     }
    
//     // Extract role ID
//     let userRoleId = '';
//     if (Array.isArray(userData.roles) && userData.roles.length > 0) {
//       userRoleId = userData.roles[0]._id || '';
//     }
    
//     // Extract subdealer ID
//     let userSubdealerId = '';
//     if (userData.subdealer) {
//       if (typeof userData.subdealer === 'string') {
//         userSubdealerId = userData.subdealer;
//       } else if (typeof userData.subdealer === 'object') {
//         userSubdealerId = userData.subdealer._id || userData.subdealer.id || '';
//       }
//     }
    
//     // Extract branch ID
//     let userBranchId = '';
//     if (userData.branch) {
//       if (typeof userData.branch === 'string') {
//         userBranchId = userData.branch;
//       } else if (typeof userData.branch === 'object') {
//         userBranchId = userData.branch._id || '';
//       }
//     }
    
//     // Determine user type
//     let userType = 'employee';
//     if (userData.type === 'subdealer') {
//       userType = 'subdealer';
//     } else if (userData.subdealer) {
//       userType = 'subdealer';
//     }
    
//     // Extract branchAccess
//     let userBranchAccess = userData.branchAccess || 'OWN';
    
//     setFormData({
//       name: userData.name || '',
//       type: userType,
//       branch: userBranchId,
//       subdealer: userSubdealerId,
//       roleId: userRoleId,
//       email: userData.email || '',
//       mobile: userData.mobile || '',
//       discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
//       csd: userData.csd || false,
//       branchAccess: userBranchAccess,
//       permissions: userPermissions,
//       totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
//       perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
//       verticles: userVerticles
//     });

//     if (userRoleId) {
//       setShowPermissions(true);
//       // Only load user permissions, don't merge with role permissions
//       await loadUserPermissions(userData, userPermissions);
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch User');
//     showApiErrorAlert(errorMessage, 'User Fetch Error');
//     throw error;
//   }
// };

//  const loadUserPermissions = async (userData, userPermissions = []) => {
//   setIsLoadingPermissions(true);
//   try {
//     // Initialize permissions
//     const initialMainHeaderAccess = {};
//     const initialPagePermissions = {};
//     const initialTabPermissions = {};

//     // First, set all to false
//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       initialMainHeaderAccess[mainHeader] = false;
      
//       const headerPages = sidebarStructure[mainHeader].pages;
//       headerPages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//           pagePerms[permType] = false;
//         });
//         initialPagePermissions[pageKey] = pagePerms;
        
//         // Initialize tab permissions
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               tabPerms[permType] = false;
//             });
//             initialTabPermissions[tabKey] = tabPerms;
//           });
//         }
//       });
//     });

//     // Set main header access from user's moduleAccess
//     if (userData.moduleAccess) {
//       Object.keys(userData.moduleAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && sidebarStructure[mainHeader]) {
//           initialMainHeaderAccess[mainHeader] = Boolean(userData.moduleAccess[apiModuleName]);
//         }
//       });
//     } else {
//       // If no moduleAccess in user data, check from user's actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             initialMainHeaderAccess[mainHeader] = true;
//           }
//         }
//       });
//     }

//     // Set page permissions from user's pageAccess or from actual permissions
//     if (userData.pageAccess) {
//       Object.keys(userData.pageAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && userData.pageAccess[apiModuleName]) {
//           Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
//             const pageKey = `${mainHeader}_${pageName}`;
//             const permissionsArray = userData.pageAccess[apiModuleName][pageName];
            
//             if (initialPagePermissions[pageKey]) {
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 initialPagePermissions[pageKey][permType] = 
//                   Array.isArray(permissionsArray) && 
//                   permissionsArray.includes(permType.toUpperCase());
//               });
//             }
//           });
//         }
//       });
//     } else {
//       // If no pageAccess in user data, set from actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission && !permission.tab) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             const pageKey = `${mainHeader}_${permission.page}`;
//             if (initialPagePermissions[pageKey]) {
//               initialPagePermissions[pageKey][permission.action.toUpperCase()] = true;
//             }
//           }
//         }
//       });
//     }

//     // Set tab permissions from user's tabAccess or from actual permissions
//     if (userData.tabAccess) {
//       Object.keys(userData.tabAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && userData.tabAccess[apiModuleName]) {
//           Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
//             Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//               const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//               if (!pageConfig) return;
              
//               let matchingTab = null;
//               if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                 matchingTab = pageConfig.tabs.find(tab => 
//                   tab.toUpperCase() === tabName.toUpperCase()
//                 );
                
//                 if (!matchingTab) {
//                   const fuzzyMatches = {
//                     'PENDING APPROVALS': 'PENDING APPROVALS',
//                     'PENDING APPROVAL': 'PENDING APPROVALS',
//                     'APPROVED': 'APPROVED',
//                     'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                     'ALLOCATED': 'ALLOCATED',
//                     'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                     'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                     'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                     'SUBMITTED': 'SUBMITTED',
//                     'REJECTED': 'REJECTED'
//                   };
                  
//                   const upperTabName = tabName.toUpperCase();
//                   if (fuzzyMatches[upperTabName]) {
//                     matchingTab = fuzzyMatches[upperTabName];
//                   }
//                 }
//               }
              
//               if (matchingTab) {
//                 const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                 const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                
//                 if (!initialTabPermissions[tabKey]) {
//                   initialTabPermissions[tabKey] = {};
//                 }
                
//                 if (Array.isArray(permissions)) {
//                   permissions.forEach(perm => {
//                     const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                     initialTabPermissions[tabKey][permKey] = true;
//                   });
//                 }
//               }
//             });
//           });
//         }
//       });
//     } else {
//       // If no tabAccess in user data, set from actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission && permission.tab) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             const tabKey = `${mainHeader}_${permission.page}_${permission.tab}`;
//             if (!initialTabPermissions[tabKey]) {
//               initialTabPermissions[tabKey] = {};
//             }
//             initialTabPermissions[tabKey][permission.action.toUpperCase()] = true;
//           }
//         }
//       });
//     }

//     setMainHeaderAccess(initialMainHeaderAccess);
//     setPagePermissions(initialPagePermissions);
//     setTabPermissions(initialTabPermissions);

//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Load Permissions');
//     showApiErrorAlert(errorMessage, 'Permissions Load Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, roles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Roles');
//       setFetchErrors(prev => ({ ...prev, roles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, branches: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Branches');
//       setFetchErrors(prev => ({ ...prev, branches: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//       setFetchErrors(prev => ({ ...prev, subdealers: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Subdealers');
//       setFetchErrors(prev => ({ ...prev, subdealers: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setVerticles(verticlesData);
//       setFetchErrors(prev => ({ ...prev, verticles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Verticles');
//       setFetchErrors(prev => ({ ...prev, verticles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//       setFetchErrors(prev => ({ ...prev, permissions: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Permissions');
//       setFetchErrors(prev => ({ ...prev, permissions: errorMessage }));
//       throw error;
//     }
//   };

// const fetchRolePermissionsData = async (roleId) => {
//   if (!roleId) return;
  
//   setIsLoadingPermissions(true);
//   try {
//     const res = await axiosInstance.get(`/roles/${roleId}`);
//     const roleData = res.data.data;

//     if (!roleData) {
//       throw new Error('Role data not found');
//     }

//     // Only initialize if it's a new user (not editing)
//     if (!id) {
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Now populate with role data
//       if (roleData.moduleAccess) {
//         Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = Boolean(roleData.moduleAccess[apiModuleName]);
//           }
//         });
//       }

//       if (roleData.pageAccess) {
//         Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.pageAccess[apiModuleName]) {
//             Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   const hasPermission = Array.isArray(permissionsArray) && 
//                     permissionsArray.includes(permType.toUpperCase());
                  
//                   initialPagePermissions[pageKey][permType] = hasPermission;
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Process tab access
//       if (roleData.tabAccess) {
//         Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.tabAccess[apiModuleName]) {
//             Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   if (Array.isArray(permissions)) {
//                     permissions.forEach(perm => {
//                       const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                       initialTabPermissions[tabKey][permKey] = true;
//                     });
//                   }
//                 }
//               });
//             });
//           }
//         });
//       }

//       // Also get permission IDs from role
//       let rolePermissionIds = [];
//       if (Array.isArray(roleData.permissions) && roleData.permissions.length > 0) {
//         roleData.permissions.forEach(perm => {
//           const permId = typeof perm === 'string' ? perm : (perm._id || perm.id);
//           if (permId && !rolePermissionIds.includes(permId)) {
//             rolePermissionIds.push(permId);
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);
      
//       // Set the formData permissions with role permissions for new user only
//       setFormData(prev => ({
//         ...prev,
//         permissions: rolePermissionIds
//       }));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch Role Permissions');
//     showApiErrorAlert(errorMessage, 'Role Permissions Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   // Helper to find main header by module name
//   const findMainHeaderByModule = (moduleName) => {
//     if (!moduleName) return null;
    
//     const moduleUpper = moduleName.toUpperCase();
//     for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
//       if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
//         return mainHeader;
//       }
//     }
    
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//   // Helper to find subdealer role
//   const findSubdealerRole = () => {
//     if (!roles || roles.length === 0) return null;
    
//     return roles.find(role => 
//       role.name.toLowerCase() === 'subdealer' || 
//       role.name.toLowerCase().includes('subdealer')
//     );
//   };

//   // Helper to extract permission IDs from current visual state
// const extractPermissionIdsFromState = () => {
//   const permissionIds = [];
  
//   Object.keys(mainHeaderAccess).forEach(mainHeader => {
//     if (mainHeaderAccess[mainHeader]) {
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       sidebarStructure[mainHeader].pages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = pagePermissions[pageKey] || {};
        
//         // Add page permission IDs
//         Object.keys(pagePerms).forEach(permType => {
//           if (pagePerms[permType]) {
//             const permission = permissionsList.find(perm => 
//               apiModuleNames.some(apiModuleName => 
//                 perm.module.toUpperCase() === apiModuleName.toUpperCase()
//               ) && 
//               perm.page === page.name && 
//               perm.action === permType.toUpperCase() &&
//               !perm.tab
//             );
            
//             if (permission) {
//               permissionIds.push(permission._id);
//             }
//           }
//         });
        
//         // Add tab permission IDs
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = tabPermissions[tabKey] || {};
            
//             Object.keys(tabPerms).forEach(permType => {
//               if (tabPerms[permType]) {
//                 const permission = permissionsList.find(perm => 
//                   apiModuleNames.some(apiModuleName => 
//                     perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                   ) && 
//                   perm.page === page.name && 
//                   perm.action === permType.toUpperCase() &&
//                   perm.tab === tab
//                 );
                
//                 if (permission) {
//                   permissionIds.push(permission._id);
//                 }
//               }
//             });
//           });
//         }
//       });
//     }
//   });
  
//   return [...new Set(permissionIds)]; // Remove duplicates
// };

//  const handleChange = async (e) => {
//   const { name, value, type, checked } = e.target;
  
//   try {
//     // Handle checkbox inputs
//     if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
      
//       // For new users, clear existing permissions when selecting a new role
//       if (!id) {
//         setFormData(prev => ({ 
//           ...prev, 
//           permissions: [] 
//         }));
//       }
      
//       // Fetch role permissions (won't affect existing user's permissions)
//       await fetchRolePermissionsData(value);
//     }

//     if (name === 'type') {
//       if (value === 'subdealer') {
//         const subdealerRole = findSubdealerRole();
//         if (subdealerRole) {
//           // Auto-select logged-in user's subdealer if they are a subdealer
//           let selectedSubdealer = '';
//           if (isLoggedInSubdealer && loggedInUserSubdealerId) {
//             selectedSubdealer = loggedInUserSubdealerId;
//           }
          
//           setFormData(prev => ({ 
//             ...prev, 
//             type: value,
//             roleId: subdealerRole._id,
//             subdealer: selectedSubdealer,
//             permissions: []
//           }));
//           await fetchRolePermissionsData(subdealerRole._id);
//           setShowPermissions(true);
//         }
//       } else {
//         setFormData(prev => ({ 
//           ...prev, 
//           type: value,
//           roleId: '',
//           subdealer: '',
//           permissions: [] // Clear permissions when switching from subdealer
//         }));
//         setShowPermissions(false);
//       }
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Handle Change');
//     showApiErrorAlert(errorMessage, 'Form Change Error');
//   }
// };

//   const handleVerticalChange = (e) => {
//     try {
//       const selectedId = e.target.value;
//       if (selectedId && !formData.verticles.includes(selectedId)) {
//         setFormData(prev => ({
//           ...prev,
//           verticles: [...prev.verticles, selectedId]
//         }));
//       }
//       setErrors(prev => ({ ...prev, verticles: '' }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Vertical Change');
//       showApiErrorAlert(errorMessage, 'Vertical Selection Error');
//     }
//   };

//   const removeVertical = (verticalId) => {
//     try {
//       setFormData(prev => {
//         const newVerticles = prev.verticles.filter(id => id !== verticalId);
//         return {
//           ...prev,
//           verticles: newVerticles
//         };
//       });
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Remove Vertical');
//       showApiErrorAlert(errorMessage, 'Vertical Removal Error');
//     }
//   };

//   const togglePageExpansion = (pageKey) => {
//     try {
//       setExpandedPages(prev => ({
//         ...prev,
//         [pageKey]: !prev[pageKey]
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Toggle Page Expansion');
//       showApiErrorAlert(errorMessage, 'UI Error');
//     }
//   };

//   // Check if a permission exists in the system
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return false;
      
//       return permissionsList.some(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
//       );
//     } catch (error) {
//       console.error('Error checking permission existence:', error);
//       return false;
//     }
//   };

//   // Get all tab permissions that exist in API for a page
//   const getAvailableTabsForPage = (mainHeader, page) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return [];
      
//       const tabs = new Set();
//       permissionsList.forEach(perm => {
//         if (apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.tab) {
//           tabs.add(perm.tab);
//         }
//       });
      
//       return Array.from(tabs);
//     } catch (error) {
//       console.error('Error getting available tabs:', error);
//       return [];
//     }
//   };

//   // Handle page permission change
//   const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: {
//           ...prev[pageKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         !perm.tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Page Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle tab permission change
//   const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: {
//           ...prev[tabKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         perm.tab === tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Tab Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all permissions for a page
//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
//         if (permissionExists) {
//           newPagePerms[permType] = true;
          
//           const permission = permissionsList.find(perm => 
//             apiModuleNames.some(apiModuleName => 
//               perm.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             perm.page === page && 
//             perm.action === permType.toUpperCase() &&
//             !perm.tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         } else {
//           newPagePerms[permType] = false;
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all permissions for a page
//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         newPagePerms[permType] = false;
        
//         const permission = permissionsList.find(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           perm.page === page && 
//           perm.action === permType.toUpperCase() &&
//           !perm.tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all tab permissions
//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(perm => {
//         const exists = checkPermissionExists(mainHeader, page, perm, tab);
//         newPerms[perm] = perm === "VIEW" ? exists : false;
        
//         if (perm === "VIEW" && exists) {
//           const permission = permissionsList.find(p => 
//             apiModuleNames.some(apiModuleName => 
//               p.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             p.page === page && 
//             p.action === "VIEW" &&
//             p.tab === tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all tab permissions
//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       const newPerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//         newPerms[perm] = false;
        
//         const permission = permissionsList.find(p => 
//           apiModuleNames.some(apiModuleName => 
//             p.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           p.page === page && 
//           p.action === perm.toUpperCase() &&
//           p.tab === tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle global actions for the three buttons
//   const handleGlobalAction = (actionType) => {
//     try {
//       switch (actionType) {
//         case 'none':
//           setFormData(prev => ({ ...prev, permissions: [] }));
          
//           const clearedPagePermissions = {};
//           const clearedTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = false;
//               });
//               clearedPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = false;
//                   });
//                   clearedTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(clearedPagePermissions);
//           setTabPermissions(clearedTabPermissions);
//           break;
          
//         case 'selectAll':
//           const allPermissionIds = permissionsList.map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
          
//           const allPagePermissions = {};
//           const allTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//               });
//               allPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                   });
//                   allTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(allPagePermissions);
//           setTabPermissions(allTabPermissions);
//           break;
          
//         case 'viewOnly':
//           const viewPermissionIds = permissionsList
//             .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
//             .map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
          
//           const viewPagePermissions = {};
//           const viewTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 if (permType === 'VIEW') {
//                   pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//                 } else {
//                   pagePerms[permType] = false;
//                 }
//               });
//               viewPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     if (permType === 'VIEW') {
//                       tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                     } else {
//                       tabPerms[permType] = false;
//                     }
//                   });
//                   viewTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(viewPagePermissions);
//           setTabPermissions(viewTabPermissions);
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Global Permission Action');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle main header access change
//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     try {
//       setMainHeaderAccess(prev => ({
//         ...prev,
//         [mainHeader]: hasAccess
//       }));

//       if (!hasAccess) {
//         const newPagePermissions = { ...pagePermissions };
//         const newTabPermissions = { ...tabPermissions };
        
//         sidebarStructure[mainHeader].pages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const perms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//             perms[perm] = false;
//           });
//           newPagePermissions[pageKey] = perms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//                 tabPerms[perm] = false;
//               });
//               newTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
        
//         setPagePermissions(newPagePermissions);
//         setTabPermissions(newTabPermissions);
        
//         const apiModuleNames = moduleNameMap[mainHeader];
//         const modulePermissions = permissionsList.filter(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           )
//         );
//         const modulePermissionIds = modulePermissions.map(perm => perm._id);
        
//         setFormData(prev => ({
//           ...prev,
//           permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
//         }));
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Main Header Access Change');
//       showApiErrorAlert(errorMessage, 'Access Control Error');
//     }
//   };

//   // Render permissions table for a page
//   const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
//     try {
//       const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
//       const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       // For tabs, only show VIEW permission (renamed to "Access")
//       const displayPermissions = isTab ? ["VIEW"] : availablePermissions;
      
//       return (
//         <CTable bordered responsive hover small className="permission-table mt-2">
//           <CTableHead color="light">
//             <CTableRow>
//               <CTableHeaderCell scope="col" className="text-nowrap">
//                 {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
//               </CTableHeaderCell>
//               {displayPermissions.map((perm) => (
//                 <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
//                   {getPermissionDisplayLabel(perm, isTab)}
//                 </CTableHeaderCell>
//               ))}
//               <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             <CTableRow>
//               <CTableDataCell>
//                 <strong>{isTab ? tabName : page}</strong>
//               </CTableDataCell>
//               {displayPermissions.map((perm) => {
//                 const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
//                 const isChecked = permissions[perm] || false;
                
//                 return (
//                   <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
//                     {permissionExists ? (
//                       <CFormCheck
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={(e) => {
//                           if (isTab) {
//                             handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
//                           } else {
//                             handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
//                           }
//                         }}
//                         aria-label={`${page}-${perm}`}
//                         title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
//                       />
//                     ) : (
//                       <span className="text-muted" title="Permission not available in system">
//                         N/A
//                       </span>
//                     )}
//                   </CTableDataCell>
//                 );
//               })}
//               <CTableDataCell className="text-center">
//                 <CButtonGroup size="sm">
//                   <CButton 
//                     color="primary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleSelectAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleSelectAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Select all available permissions"
//                   >
//                     All
//                   </CButton>
//                   <CButton 
//                     color="secondary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleClearAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleClearAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Clear all permissions"
//                   >
//                     None
//                   </CButton>
//                 </CButtonGroup>
//               </CTableDataCell>
//             </CTableRow>
//           </CTableBody>
//         </CTable>
//       );
//     } catch (error) {
//       console.error('Error rendering permissions table:', error);
//       return (
//         <CAlert color="danger">
//           Error rendering permissions table. Please refresh the page.
//         </CAlert>
//       );
//     }
//   };

//   const validateForm = () => {
//     try {
//       const newErrors = {};
//       if (!formData.name.trim()) newErrors.name = 'Name is required';
//       if (!formData.type) newErrors.type = 'Type is required';
      
//       if (formData.type === 'employee') {
//         if (!formData.branch) newErrors.branch = 'Branch is required for employee';
//         if (!formData.roleId) newErrors.roleId = 'Role is required for employee';
//       }
      
//       if (formData.type === 'subdealer') {
//         if (!formData.subdealer) newErrors.subdealer = 'Subdealer is required';
//         // Role is auto-selected for subdealer, so no validation needed
//       }
      
//       if (!formData.email.trim()) newErrors.email = 'Email is required';
//       if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
      
//       // Only validate discount if user type is NOT subdealer AND logged-in user is not SUBDEALER
//       if (formData.type !== 'subdealer' && !isLoggedInSubdealerRole && !formData.discount) {
//         newErrors.discount = 'Discount is required';
//       }
      
//       // Email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (formData.email && !emailRegex.test(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
      
//       // Mobile validation (basic)
//       const mobileRegex = /^[0-9]{10}$/;
//       if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
//         newErrors.mobile = 'Please enter a valid 10-digit mobile number';
//       }
      
//       const selectedRole = roles.find(role => role._id === formData.roleId);
//       if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
//         if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//         if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
        
//         // Validate numeric values
//         if (formData.totalDeviationAmount && isNaN(parseFloat(formData.totalDeviationAmount))) {
//           newErrors.totalDeviationAmount = 'Please enter a valid number';
//         }
//         if (formData.perTransactionDeviationLimit && isNaN(parseFloat(formData.perTransactionDeviationLimit))) {
//           newErrors.perTransactionDeviationLimit = 'Please enter a valid number';
//         }
//       }
      
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Form Validation');
//       showApiErrorAlert(errorMessage, 'Validation Error');
//       return false;
//     }
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) return;

//   setIsLoading(true);
  
//   try {
//     // Sync permissions from visual state to formData
//     const syncedPermissionIds = extractPermissionIdsFromState();
    
//     // Filter out null/undefined values from permissions
//     const validPermissions = [...new Set([...syncedPermissionIds, ...formData.permissions])].filter(perm => 
//       perm !== null && perm !== undefined && perm !== ''
//     );
    
//     const payload = {
//       name: formData.name.trim(),
//       type: formData.type,
//       roles: formData.roleId,
//       email: formData.email.trim(),
//       mobile: formData.mobile.trim(),
//       csd: formData.csd,
//       branchAccess: formData.branchAccess,
//       permissions: validPermissions,
//       verticles: formData.verticles,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//       ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
//       ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
//       ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//       ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//     };

//     console.log('Submitting payload:', payload);
//     console.log('Permission count:', validPermissions.length);

//     if (id) {
//       await axiosInstance.put(`/users/${id}`, payload);
//       await refreshPermissions();
//       await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//     } else {
//       await axiosInstance.post('/auth/register', payload);
//       await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Submit Form');
    
//     // Show detailed error in alert
//     showApiErrorAlert(errorMessage, 'Submission Error');
    
//     // Also show the sweet alert for form submission errors
//     showFormSubmitError(error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  
//   // Check if the selected role is SALES_EXECUTIVE
//   const isSalesExecutiveRole = selectedRole && selectedRole.name && selectedRole.name.toUpperCase() === 'SALES_EXECUTIVE';
  
//   const getSelectedVerticalNames = () => {
//     return formData.verticles.map(item => {
//       const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
//       const vertical = verticles.find(v => 
//         v._id === verticalId || v.id === verticalId
//       );
//       return vertical ? vertical.name || String(verticalId) : String(verticalId);
//     });
//   };

//   // Get the selected subdealer name for display
//   const getSelectedSubdealerName = () => {
//     if (!formData.subdealer) return '';
    
//     const subdealer = subdealers.find(s => s.id === formData.subdealer || s._id === formData.subdealer);
//     return subdealer ? subdealer.name : formData.subdealer;
//   };

//   // Render fetch errors if any
//   const renderFetchErrors = () => {
//     const errorMessages = Object.entries(fetchErrors)
//       .filter(([_, error]) => error !== null)
//       .map(([key, error]) => `${key}: ${error}`);

//     if (errorMessages.length === 0) return null;

//     return (
//       <CAlert color="warning" className="mb-3">
//         <div className="d-flex align-items-center">
//           <CIcon icon={cilWarning} className="me-2" />
//           <div>
//             <strong>Some data failed to load:</strong>
//             <ul className="mb-0 mt-1">
//               {errorMessages.map((msg, index) => (
//                 <li key={index}>{msg}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </CAlert>
//     );
//   };

//   if (isLoading && !id) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//         <span className="ms-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       {/* Global API Error Alert */}
//       {apiError && (
//         <CAlert 
//           color="danger" 
//           className="mb-3" 
//           dismissible
//           onClose={() => setApiError(null)}
//         >
//           <div className="d-flex align-items-center">
//             <CIcon icon={cilWarning} className="me-2" />
//             <div>
//               <strong>{apiError.context}</strong>
//               <p className="mb-0">{apiError.message}</p>
//             </div>
//           </div>
//         </CAlert>
//       )}

//       {/* Fetch Errors Alert */}
//       {renderFetchErrors()}

//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <FormErrorBoundary section="User Details">
//               <div className="user-details">
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Name</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="text" 
//                       name="name" 
//                       value={formData.name} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="Enter full name"
//                     />
//                   </CInputGroup>
//                   {errors.name && <p className="error">{errors.name}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPeople} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="type" 
//                       value={formData.type} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                     >
//                       <option value="employee">Employee</option>
//                       <option value="subdealer">Subdealer</option>
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.type && <p className="error">{errors.type}</p>}
//                 </div>
                
//                 {formData.type === 'employee' && (
//                   <>
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Branch</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilLocationPin} />
//                         </CInputGroupText>
//                         <CFormSelect 
//                           name="branch" 
//                           value={formData.branch} 
//                           onChange={handleChange}
//                           disabled={isLoading || fetchErrors.branches}
//                         >
//                           <option value="">-Select-</option>
//                           {branches.map(branch => (
//                             <option key={branch._id} value={branch._id}>
//                               {branch.name}
//                             </option>
//                           ))}
//                         </CFormSelect>
//                       </CInputGroup>
//                       {errors.branch && <p className="error">{errors.branch}</p>}
//                       {fetchErrors.branches && (
//                         <small className="text-warning">Branches data unavailable: {fetchErrors.branches}</small>
//                       )}
//                     </div>

//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Branch Access</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilBuilding} />
//                         </CInputGroupText>
//                         <CFormSelect 
//                           name="branchAccess" 
//                           value={formData.branchAccess} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                         >
//                           <option value="OWN">OWN - Only own branch</option>
//                           <option value="ASSIGNED">ASSIGNED - Selected branches</option>
//                           <option value="ALL">ALL - All branches</option>
//                         </CFormSelect>
//                       </CInputGroup>
//                       <small className="text-muted">
//                         Defines which branches the user can access
//                       </small>
//                     </div>
//                   </>
//                 )}

//                 {formData.type === 'subdealer' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="subdealer" 
//                         value={formData.subdealer} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.subdealers || (isLoggedInSubdealer && !id)}
//                       >
//                         <option value="">-Select Subdealer-</option>
//                         {subdealers.map(subdealer => (
//                           <option key={subdealer.id} value={subdealer.id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {fetchErrors.subdealers && (
//                       <small className="text-warning">Subdealers data unavailable: {fetchErrors.subdealers}</small>
//                     )}
//                   </div>
//                 )}
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Role</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="roleId" 
//                       value={formData.roleId} 
//                       onChange={handleChange}
//                       disabled={isLoading || fetchErrors.roles || formData.type === 'subdealer'}
//                     >
//                       <option value="">-Select-</option>
//                       {roles.map(role => (
//                         <option key={role._id} value={role._id}>
//                           {role.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.roleId && <p className="error">{errors.roleId}</p>}
//                   {formData.type === 'subdealer' ? (
//                     <small className="text-muted">Role is automatically set to Subdealer and cannot be changed</small>
//                   ) : (
//                     <small className="text-muted">Select the role for this user</small>
//                   )}
//                   {fetchErrors.roles && (
//                     <small className="text-warning">Roles data unavailable: {fetchErrors.roles}</small>
//                   )}
//                 </div>
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Email</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilEnvelopeClosed} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="email" 
//                       name="email" 
//                       value={formData.email} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="user@example.com"
//                     />
//                   </CInputGroup>
//                   {errors.email && <p className="error">{errors.email}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Mobile number</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPhone} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="tel" 
//                       name="mobile" 
//                       value={formData.mobile} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="10-digit mobile number"
//                     />
//                   </CInputGroup>
//                   {errors.mobile && <p className="error">{errors.mobile}</p>}
//                 </div>

//                 {/* Only show discount field if NOT creating a subdealer AND logged-in user is NOT a SUBDEALER */}
//                 {formData.type !== 'subdealer' && !isLoggedInSubdealerRole && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Discount</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilDollar} />
//                       </CInputGroupText>
//                       <CFormInput 
//                         type="number" 
//                         name="discount" 
//                         value={formData.discount} 
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         min="0"
//                         step="0.01"
//                         placeholder="0.00"
//                       />
//                     </CInputGroup>
//                     {errors.discount && <p className="error">{errors.discount}</p>}
//                   </div>
//                 )}

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Verticles</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilTag} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="vertical" 
//                       value="" 
//                       onChange={handleVerticalChange}
//                       disabled={isLoading || fetchErrors.verticles}
//                     >
//                       <option value="">-Select Verticle-</option>
//                       {verticles
//                         .filter(vertical => vertical.status === 'active')
//                         .map(vertical => (
//                           <option 
//                             key={vertical._id} 
//                             value={vertical._id}
//                             disabled={formData.verticles.includes(vertical._id)}
//                           >
//                             {vertical.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
                  
//                   <div className="mt-2">
//                     <div className="d-flex flex-wrap gap-2">
//                       {getSelectedVerticalNames().map((verticalName, index) => {
//                         const verticalId = formData.verticles[index];
//                         return (
//                           <CBadge 
//                             key={`${verticalId}_${index}`} 
//                             color="primary"
//                             className="d-flex align-items-center"
//                             style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//                           >
//                             {String(verticalName)}
//                             <CCloseButton 
//                               className="ms-2"
//                               onClick={() => removeVertical(verticalId)}
//                               style={{ fontSize: '0.75rem' }}
//                               disabled={isLoading}
//                             />
//                           </CBadge>
//                         );
//                       })}
//                     </div>
//                     <small className="text-muted">
//                       {formData.verticles.length} verticle(s) selected (Optional)
//                     </small>
//                     {fetchErrors.verticles && (
//                       <small className="text-warning d-block">Verticles data unavailable: {fetchErrors.verticles}</small>
//                     )}
//                   </div>
//                 </div>

//                 {/* Only show CSD field when all these conditions are met:
//                     1. Logged-in user is NOT a SUBDEALER
//                     2. User type is NOT 'subdealer'
//                     3. Selected role is NOT 'SALES_EXECUTIVE'
//                 */}
//                 {!isLoggedInSubdealerRole && formData.type !== 'subdealer' && !isSalesExecutiveRole && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">CSD</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <div className="form-check form-switch mt-2 ms-2">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           name="csd"
//                           id="csdCheckbox"
//                           checked={formData.csd}
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           style={{ width: '3em', height: '1.5em' }}
//                         />
//                         <label className="form-check-label ms-2" htmlFor="csdCheckbox">
//                           {formData.csd ? 'Yes' : 'No'}
//                         </label>
//                       </div>
//                     </CInputGroup>
//                     <small className="text-muted">
//                       Customer Service Department access
//                     </small>
//                   </div>
//                 )}

//                 {isManager && (
//                   <>
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Total Deviation Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="totalDeviationAmount" 
//                           value={formData.totalDeviationAmount} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                     </div>

//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Per Transaction Deviation Limit</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="perTransactionDeviationLimit" 
//                           value={formData.perTransactionDeviationLimit} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </FormErrorBoundary>

//             {showPermissions && (
//               <FormErrorBoundary section="Permissions Configuration">
//                 <div className="permissions-container mt-4">
//                   <h5 className="mb-3">User Permissions Configuration</h5>
//                   <p className="text-muted mb-4">
//                     These permissions are in addition to the role permissions. 
//                     Total system permissions: {permissionsList.length}
//                     {fetchErrors.permissions && (
//                       <span className="text-warning ms-2">(Permissions data incomplete: {fetchErrors.permissions})</span>
//                     )}
//                   </p>
                  
//                   {/* Three global permission buttons added here */}
//                   <div className="mb-3">
//                     <CButtonGroup>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('none')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         None
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('selectAll')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         Select All
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('viewOnly')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         View Only
//                       </CButton>
//                     </CButtonGroup>
//                   </div>

//                   {isLoadingPermissions ? (
//                     <div className="d-flex justify-content-center align-items-center py-4">
//                       <CSpinner color="primary" />
//                       <span className="ms-2">Loading permissions...</span>
//                     </div>
//                   ) : (
//                     <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                       {Object.keys(sidebarStructure).map((mainHeader) => {
//                         const hasAccess = mainHeaderAccess[mainHeader] || false;
//                         const pageCount = sidebarStructure[mainHeader].pages.length;

//                         return (
//                           <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                             <CAccordionHeader>
//                               <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//                                 <div>
//                                   <h6 className="mb-0">{mainHeader}</h6>
//                                   <small className="text-muted">{pageCount} pages</small>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2">
//                                   <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//                                     {hasAccess ? 'Access Granted' : 'No Access'}
//                                   </CBadge>
//                                   <div className="d-flex align-items-center" role="group">
//                                     <CButton
//                                       size="sm"
//                                       color={hasAccess ? "success" : "secondary"}
//                                       variant="outline"
//                                       className="me-1"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, true);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilCheck} /> Yes
//                                     </CButton>
//                                     <CButton
//                                       size="sm"
//                                       color={!hasAccess ? "danger" : "secondary"}
//                                       variant="outline"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, false);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilX} /> No
//                                     </CButton>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CAccordionHeader>
//                             <CAccordionBody>
//                               {hasAccess ? (
//                                 <div className="pages-permissions">
//                                   {sidebarStructure[mainHeader].pages.map((page) => {
//                                     const pageKey = `${mainHeader}_${page.name}`;
//                                     const isExpanded = expandedPages[pageKey] || false;
//                                     const pageHasTabs = page.tabs && page.tabs.length > 0;
//                                     const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                                     const hasTabPermissions = availableTabs.length > 0;
                                    
//                                     return (
//                                       <CCard key={pageKey} className="mb-3">
//                                         <CCardBody>
//                                           <div className="d-flex justify-content-between align-items-center mb-2">
//                                             <h6 className="mb-0">{page.name}</h6>
//                                             <div className="d-flex align-items-center gap-2">
//                                               {pageHasTabs && hasTabPermissions && (
//                                                 <CButton
//                                                   size="sm"
//                                                   color="link"
//                                                   onClick={() => togglePageExpansion(pageKey)}
//                                                   className="p-0"
//                                                   disabled={isLoading || isLoadingPermissions}
//                                                 >
//                                                   {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                                 </CButton>
//                                               )}
//                                             </div>
//                                           </div>
                                          
//                                           {/* Page-level permissions */}
//                                           {renderPermissionsTable(mainHeader, page.name, false)}
                                          
//                                           {/* Tab-level permissions (if available) */}
//                                           {pageHasTabs && hasTabPermissions && (
//                                             <CCollapse visible={isExpanded}>
//                                               <div className="mt-3">
//                                                 <h6 className="mb-2">Tab Permissions</h6>
//                                                 {availableTabs.map((tab) => (
//                                                   <div key={`${pageKey}_${tab}`} className="mb-3">
//                                                     {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             </CCollapse>
//                                           )}
//                                         </CCardBody>
//                                       </CCard>
//                                     );
//                                   })}
//                                 </div>
//                               ) : (
//                                 <div className="text-center py-4">
//                                   <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                                   <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                                   <small>Click "Yes" to grant access and configure permissions</small>
//                                 </div>
//                               )}
//                             </CAccordionBody>
//                           </CAccordionItem>
//                         );
//                       })}
//                     </CAccordion>
//                   )}
//                 </div>
//               </FormErrorBoundary>
//             )}

//             <div className="form-footer">
//               <button 
//                 type="submit" 
//                 className="cancel-button"
//                 disabled={isLoading || isLoadingPermissions}
//               >
//                 {isLoading ? (
//                   <>
//                     <CSpinner size="sm" className="me-2" />
//                     {id ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//               <button 
//                 type="button" 
//                 className="submit-button" 
//                 onClick={handleCancel}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;




// import React, { useState, useEffect, useContext } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CCard,
//   CCardBody,
//   CCollapse
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich, cilWarning, cilBuilding } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContext } from '../../context/AuthContext';

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete",
//   "READ": "View",
//   "WRITE": "Edit"
// };

// // Tab permission label mapping - SAME AS PAGES
// const tabPermissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit", 
//   "DELETE": "Delete"
// };

// // Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
// const sidebarStructure = {
//   "Dashboard": {
//     pages: [{
//       name: "Dashboard",
//       tabs: null
//     }],
//     availablePermissions: ["VIEW"]
//   },
//   "Purchase": {
//     pages: [
//       { name: "Inward Stock", tabs: null },
//       { 
//         name: "Stock Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
//       },
//       { name: "Stock Transfer", tabs: null },
//       { name: "Upload Challan", tabs: null },
//       { name: "RTO Chassis", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       },
//       { name: "Self Insurance", tabs: null },
//       { name: "Delivery Challan", tabs: null },
//       { name: "GST Invoice", tabs: null },
//       { name: "Helmet Invoice", tabs: null },
//       { name: "Deal Form", tabs: null },
//       { name: "Upload Deal Form & Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Sales Report": {
//     pages: [
//       { name: "Sales Person Wise", tabs: null },
//       { name: "Periodic Report", tabs: null }
//     ],
//     availablePermissions: ["VIEW"]
//   },
//   "Quotation": {
//     pages: [
//       { name: "Quotation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Account": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Receipts", 
//         tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
//       },
//       { name: "Debit Note", tabs: null },
//       { name: "Refund", tabs: null },
//       { 
//         name: "Cancelled Booking", 
//         tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
//       },
//       { name: "All Receipts", tabs: null },
//       { name: "Ledgers", tabs: null },
//       { name: "Exchange Ledger", tabs: null },
//       { 
//         name: "Broker Payment Verification", 
//         tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Insurance": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Insurance Details", 
//         tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "RTO": {
//     pages: [
//       { name: "Dashboard", tabs: null },
//       { 
//         name: "Application", 
//         tabs: ["RTO PENDING", "APPLIED FOR"]
//       },
//       { 
//         name: "RTO Paper", 
//         tabs: ["RTO PAPER PENDING", "COMPLETED"]
//       },
//       { 
//         name: "RTO Tax", 
//         tabs: ["RTO PENDING TAX", "TAX PAID"]
//       },
//       { 
//         name: "HSRP Ordering", 
//         tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
//       },
//       { 
//         name: "HSRP Installation", 
//         tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
//       },
//       { 
//         name: "RC Confirmation", 
//         tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
//       },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Management": {
//     pages: [
//       { name: "Cash Voucher", tabs: null },
//       { name: "Contra Voucher", tabs: null },
//       { 
//         name: "Contra Approval", 
//         tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
//       },
//       { name: "Workshop Cash Receipt", tabs: null },
//       { name: "All Cash Receipt", tabs: null },
//       { name: "Cash Book", tabs: null },
//       { name: "Day Book", tabs: null },
//       { name: "Report", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Masters": {
//     pages: [
//       { name: "Location", tabs: null },
//       { name: "Headers", tabs: null },
//       { name: "Vehicles", tabs: null },
//       { name: "Minimum Booking Amount", tabs: null },
//       { name: "Template List", tabs: null },
//       { name: "Accessories", tabs: null },
//       { name: "Colour", tabs: null },
//       { name: "Documents", tabs: null },
//       { name: "Terms & Conditions", tabs: null },
//       { name: "Offer", tabs: null },
//       { name: "Attachments", tabs: null },
//       { name: "Declaration", tabs: null },
//       { name: "RTO", tabs: null },
//       { name: "Financer", tabs: null },
//       { name: "Finance Rates", tabs: null },
//       { name: "Insurance Providers", tabs: null },
//       { name: "Brokers", tabs: null },
//       { name: "Broker Commission Range", tabs: null },
//       { name: "Vertical Masters", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Fund Master": {
//     pages: [
//       { name: "Cash Account Master", tabs: null },
//       { name: "Bank Account Master", tabs: null },
//       { name: "Payment Mode", tabs: null },
//       { name: "Expense Master", tabs: null },
//       { name: "Add Opening Balance", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Accessories Billing": {
//     pages: [
//       { name: "Accessories Billing", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Customers": {
//     pages: [
//       { name: "Customers", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer": {
//     pages: [
//       { 
//         name: "Subdealer Stock Audit", 
//         tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Master": {
//     pages: [
//       { name: "Subdealer List", tabs: null },
//       { name: "Subdealer Audit List", tabs: null },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Calculate Commission", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Booking": {
//     pages: [
//       { name: "New Booking", tabs: null },
//       { 
//         name: "All Booking", 
//         tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
//       },
//       { name: "Delivery Challan", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Management": {
//     pages: [
//       { 
//         name: "Subdealer Management", 
//         tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "Subdealer Account": {
//     pages: [
//       { name: "Add Balance", tabs: null },
//       { name: "OnAccount Balance", tabs: null },
//       { name: "Add Amount", tabs: null },
//       { 
//         name: "Finance Payment", 
//         tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
//       },
//       { 
//         name: "Payment Verification", 
//         tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
//       },
//       { name: "Subdealer Commission", tabs: null },
//       { name: "Payment Summary", tabs: null },
//       { 
//         name: "Subdealer Ledger", 
//         tabs: ["SUB DEALER", "SUB DEALER UTR"]
//       },
//       { name: "Customer Ledger", tabs: null },
//       { 
//         name: "Summary", 
//         tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
//       }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   },
//   "User Management": {
//     pages: [
//       { name: "Create Role", tabs: null },
//       { name: "All Role", tabs: null },
//       { name: "Add User", tabs: null },
//       { name: "User List", tabs: null },
//       { name: "Buffer Report", tabs: null },
//       { name: "Manager Deviation", tabs: null }
//     ],
//     availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
//   }
// };

// // Map sidebar module names to API module names
// const moduleNameMap = {
//   "Dashboard": ["DASHBOARD"],
//   "Purchase": ["PURCHASE"],
//   "Sales": ["SALES"],
//   "Sales Report": ["SALES REPORT", "SALES_REPORT"],
//   "Quotation": ["QUOTATION"],
//   "Account": ["ACCOUNT"],
//   "Insurance": ["INSURANCE"],
//   "RTO": ["RTO"],
//   "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
//   "Masters": ["MASTERS"],
//   "Fund Master": ["FUND MASTER", "FUND_MASTER"],
//   "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
//   "Customers": ["CUSTOMERS"],
//   "Subdealer": ["SUBDEALER"],
//   "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
//   "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
//   "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
//   "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   // Use the same labels for both pages and tabs
//   return permissionLabelMap[permission] || permission;
// };

// // Error boundary component for form sections
// const FormErrorBoundary = ({ children, section }) => {
//   const [hasError, setHasError] = useState(false);
//   const [error, setError] = useState(null);

//   return hasError ? (
//     <CAlert color="danger" className="mt-3">
//       <div className="d-flex align-items-center">
//         <CIcon icon={cilWarning} className="me-2" />
//         <div>
//           <strong>Error in {section}</strong>
//           <p className="mb-0">{error?.message || 'An unexpected error occurred'}</p>
//         </div>
//       </div>
//     </CAlert>
//   ) : (
//     <ErrorBoundaryWrapper setHasError={setHasError} setError={setError}>
//       {children}
//     </ErrorBoundaryWrapper>
//   );
// };

// const ErrorBoundaryWrapper = ({ children, setHasError, setError }) => {
//   useEffect(() => {
//     const errorHandler = (error) => {
//       console.error('Component error:', error);
//       setHasError(true);
//       setError(error);
//     };
    
//     window.addEventListener('error', errorHandler);
//     return () => window.removeEventListener('error', errorHandler);
//   }, [setHasError, setError]);
  
//   return children;
// };

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealer: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     csd: false,
//     branchAccess: 'OWN',
//     accessibleBranches: [],
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchErrors, setFetchErrors] = useState({
//     roles: null,
//     branches: null,
//     subdealers: null,
//     verticles: null,
//     permissions: null
//   });
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const { refreshPermissions, user: authUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Check if logged-in user is a subdealer
//   const isLoggedInSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
//   const loggedInUserSubdealerId = authUser?.subdealer?._id;
//   const loggedInUserSubdealerName = authUser?.subdealer?.name;

//   // Check if logged-in user has SUBDEALER role
//   const loggedInUserRole = authUser?.roles?.[0]?.name || '';
//   const isLoggedInSubdealerRole = loggedInUserRole === 'SUBDEALER';

//   // Error handling utility functions
//   const handleApiError = (error, context = 'Operation') => {
//     console.error(`${context} error:`, error);
    
//     let errorMessage = 'An unexpected error occurred';
    
//     if (error.response) {
//       // Server responded with error status
//       const { data, status } = error.response;
      
//       if (data && data.message) {
//         errorMessage = data.message;
//       } else if (status === 401) {
//         errorMessage = 'Authentication failed. Please login again.';
//       } else if (status === 403) {
//         errorMessage = 'You do not have permission to perform this action.';
//       } else if (status === 404) {
//         errorMessage = 'Resource not found.';
//       } else if (status >= 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else {
//         errorMessage = `Request failed with status ${status}`;
//       }
//     } else if (error.request) {
//       // Request made but no response
//       errorMessage = 'Network error. Please check your connection.';
//     } else {
//       // Something else happened
//       errorMessage = error.message || errorMessage;
//     }
    
//     return errorMessage;
//   };

//   const showApiErrorAlert = (errorMessage, context = 'Error') => {
//     setApiError({
//       message: errorMessage,
//       context: context,
//       timestamp: new Date().toISOString()
//     });
    
//     // Auto-clear after 10 seconds
//     setTimeout(() => {
//       setApiError(null);
//     }, 10000);
//   };

//   // Handle role auto-selection when type changes to subdealer
//   useEffect(() => {
//     if (formData.type === 'subdealer' && roles.length > 0 && !formData.roleId) {
//       const subdealerRole = roles.find(role => 
//         role.name.toLowerCase() === 'subdealer' || 
//         role.name.toLowerCase().includes('subdealer')
//       );
      
//       if (subdealerRole) {
//         setFormData(prev => ({ 
//           ...prev, 
//           roleId: subdealerRole._id
//         }));
        
//         // Load permissions for subdealer role
//         fetchRolePermissionsData(subdealerRole._id);
//         setShowPermissions(true);
//       }
//     }
//   }, [formData.type, roles, formData.roleId]);

//   // Also handle when user switches from subdealer back to employee
//   useEffect(() => {
//     if (formData.type !== 'subdealer' && !id) {
//       // For new users, clear role when switching from subdealer to employee
//       setFormData(prev => ({ 
//         ...prev, 
//         roleId: '',
//         subdealer: '',
//         accessibleBranches: []
//       }));
//       setShowPermissions(false);
//     }
//   }, [formData.type, id]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//         showApiErrorAlert('Invalid authentication token. Please login again.', 'Authentication');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setIsLoading(true);
//         await Promise.all([
//           fetchRoles(),
//           fetchBranches(),
//           fetchSubdealers(),
//           fetchVerticles(),
//           fetchAllPermissions()
//         ]);
        
//         if (id) {
//           await fetchUser(id);
//         }
//       } catch (error) {
//         const errorMessage = handleApiError(error, 'Initialization');
//         showApiErrorAlert(errorMessage, 'Initialization Error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     initializeData();
//   }, [id]);

//  const fetchUser = async (userId) => {
//   try {
//     const res = await axiosInstance.get(`/users/${userId}`);
//     const userData = res.data.data;
    
//     if (!userData) {
//       throw new Error('User data not found');
//     }
    
//     // Extract permission IDs from user's permissions array
//     let userPermissions = [];
//     if (Array.isArray(userData.permissions)) {
//       userPermissions = userData.permissions
//         .map(p => {
//           if (!p) return null;
//           if (typeof p === 'string' && p.length > 0) return p;
//           if (typeof p === 'object') {
//             if (p._id) return p._id;
//             if (p.permission) {
//               if (typeof p.permission === 'string') return p.permission;
//               if (p.permission._id) return p.permission._id;
//             }
//           }
//           return null;
//         })
//         .filter(id => id !== null && id !== undefined);
//     }
    
//     // Extract verticle IDs
//     let userVerticles = [];
//     if (Array.isArray(userData.verticles)) {
//       userVerticles = userData.verticles.map(v => v._id || v.id);
//     }
//     if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//       userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
//     }
    
//     // Extract role ID
//     let userRoleId = '';
//     if (Array.isArray(userData.roles) && userData.roles.length > 0) {
//       userRoleId = userData.roles[0]._id || '';
//     }
    
//     // Extract subdealer ID
//     let userSubdealerId = '';
//     if (userData.subdealer) {
//       if (typeof userData.subdealer === 'string') {
//         userSubdealerId = userData.subdealer;
//       } else if (typeof userData.subdealer === 'object') {
//         userSubdealerId = userData.subdealer._id || userData.subdealer.id || '';
//       }
//     }
    
//     // Extract branch ID
//     let userBranchId = '';
//     if (userData.branch) {
//       if (typeof userData.branch === 'string') {
//         userBranchId = userData.branch;
//       } else if (typeof userData.branch === 'object') {
//         userBranchId = userData.branch._id || '';
//       }
//     }
    
//     // Extract accessibleBranches IDs
//     let userAccessibleBranches = [];
//     if (Array.isArray(userData.accessibleBranches)) {
//       userAccessibleBranches = userData.accessibleBranches.map(b => {
//         if (typeof b === 'string') return b;
//         if (typeof b === 'object') return b._id || b.id || '';
//         return '';
//       }).filter(id => id !== '');
//     }
    
//     // Determine user type
//     let userType = 'employee';
//     if (userData.type === 'subdealer') {
//       userType = 'subdealer';
//     } else if (userData.subdealer) {
//       userType = 'subdealer';
//     }
    
//     // Extract branchAccess
//     let userBranchAccess = userData.branchAccess || 'OWN';
    
//     setFormData({
//       name: userData.name || '',
//       type: userType,
//       branch: userBranchId,
//       subdealer: userSubdealerId,
//       roleId: userRoleId,
//       email: userData.email || '',
//       mobile: userData.mobile || '',
//       discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
//       csd: userData.csd || false,
//       branchAccess: userBranchAccess,
//       accessibleBranches: userAccessibleBranches,
//       permissions: userPermissions,
//       totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
//       perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
//       verticles: userVerticles
//     });

//     if (userRoleId) {
//       setShowPermissions(true);
//       // Only load user permissions, don't merge with role permissions
//       await loadUserPermissions(userData, userPermissions);
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch User');
//     showApiErrorAlert(errorMessage, 'User Fetch Error');
//     throw error;
//   }
// };

//  const loadUserPermissions = async (userData, userPermissions = []) => {
//   setIsLoadingPermissions(true);
//   try {
//     // Initialize permissions
//     const initialMainHeaderAccess = {};
//     const initialPagePermissions = {};
//     const initialTabPermissions = {};

//     // First, set all to false
//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       initialMainHeaderAccess[mainHeader] = false;
      
//       const headerPages = sidebarStructure[mainHeader].pages;
//       headerPages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//           pagePerms[permType] = false;
//         });
//         initialPagePermissions[pageKey] = pagePerms;
        
//         // Initialize tab permissions
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = {};
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               tabPerms[permType] = false;
//             });
//             initialTabPermissions[tabKey] = tabPerms;
//           });
//         }
//       });
//     });

//     // Set main header access from user's moduleAccess
//     if (userData.moduleAccess) {
//       Object.keys(userData.moduleAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && sidebarStructure[mainHeader]) {
//           initialMainHeaderAccess[mainHeader] = Boolean(userData.moduleAccess[apiModuleName]);
//         }
//       });
//     } else {
//       // If no moduleAccess in user data, check from user's actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             initialMainHeaderAccess[mainHeader] = true;
//           }
//         }
//       });
//     }

//     // Set page permissions from user's pageAccess or from actual permissions
//     if (userData.pageAccess) {
//       Object.keys(userData.pageAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && userData.pageAccess[apiModuleName]) {
//           Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
//             const pageKey = `${mainHeader}_${pageName}`;
//             const permissionsArray = userData.pageAccess[apiModuleName][pageName];
            
//             if (initialPagePermissions[pageKey]) {
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 initialPagePermissions[pageKey][permType] = 
//                   Array.isArray(permissionsArray) && 
//                   permissionsArray.includes(permType.toUpperCase());
//               });
//             }
//           });
//         }
//       });
//     } else {
//       // If no pageAccess in user data, set from actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission && !permission.tab) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             const pageKey = `${mainHeader}_${permission.page}`;
//             if (initialPagePermissions[pageKey]) {
//               initialPagePermissions[pageKey][permission.action.toUpperCase()] = true;
//             }
//           }
//         }
//       });
//     }

//     // Set tab permissions from user's tabAccess or from actual permissions
//     if (userData.tabAccess) {
//       Object.keys(userData.tabAccess).forEach(apiModuleName => {
//         const mainHeader = findMainHeaderByModule(apiModuleName);
//         if (mainHeader && userData.tabAccess[apiModuleName]) {
//           Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
//             Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//               const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//               if (!pageConfig) return;
              
//               let matchingTab = null;
//               if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                 matchingTab = pageConfig.tabs.find(tab => 
//                   tab.toUpperCase() === tabName.toUpperCase()
//                 );
                
//                 if (!matchingTab) {
//                   const fuzzyMatches = {
//                     'PENDING APPROVALS': 'PENDING APPROVALS',
//                     'PENDING APPROVAL': 'PENDING APPROVALS',
//                     'APPROVED': 'APPROVED',
//                     'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                     'ALLOCATED': 'ALLOCATED',
//                     'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                     'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                     'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                     'SUBMITTED': 'SUBMITTED',
//                     'REJECTED': 'REJECTED'
//                   };
                  
//                   const upperTabName = tabName.toUpperCase();
//                   if (fuzzyMatches[upperTabName]) {
//                     matchingTab = fuzzyMatches[upperTabName];
//                   }
//                 }
//               }
              
//               if (matchingTab) {
//                 const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                 const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                
//                 if (!initialTabPermissions[tabKey]) {
//                   initialTabPermissions[tabKey] = {};
//                 }
                
//                 if (Array.isArray(permissions)) {
//                   permissions.forEach(perm => {
//                     const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                     initialTabPermissions[tabKey][permKey] = true;
//                   });
//                 }
//               }
//             });
//           });
//         }
//       });
//     } else {
//       // If no tabAccess in user data, set from actual permissions
//       userPermissions.forEach(permId => {
//         const permission = permissionsList.find(p => p._id === permId);
//         if (permission && permission.tab) {
//           const mainHeader = findMainHeaderByModule(permission.module);
//           if (mainHeader) {
//             const tabKey = `${mainHeader}_${permission.page}_${permission.tab}`;
//             if (!initialTabPermissions[tabKey]) {
//               initialTabPermissions[tabKey] = {};
//             }
//             initialTabPermissions[tabKey][permission.action.toUpperCase()] = true;
//           }
//         }
//       });
//     }

//     setMainHeaderAccess(initialMainHeaderAccess);
//     setPagePermissions(initialPagePermissions);
//     setTabPermissions(initialTabPermissions);

//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Load Permissions');
//     showApiErrorAlert(errorMessage, 'Permissions Load Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, roles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Roles');
//       setFetchErrors(prev => ({ ...prev, roles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//       setFetchErrors(prev => ({ ...prev, branches: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Branches');
//       setFetchErrors(prev => ({ ...prev, branches: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//       setFetchErrors(prev => ({ ...prev, subdealers: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Subdealers');
//       setFetchErrors(prev => ({ ...prev, subdealers: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       setVerticles(verticlesData);
//       setFetchErrors(prev => ({ ...prev, verticles: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Verticles');
//       setFetchErrors(prev => ({ ...prev, verticles: errorMessage }));
//       throw error;
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//       setFetchErrors(prev => ({ ...prev, permissions: null }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Fetch Permissions');
//       setFetchErrors(prev => ({ ...prev, permissions: errorMessage }));
//       throw error;
//     }
//   };

// const fetchRolePermissionsData = async (roleId) => {
//   if (!roleId) return;
  
//   setIsLoadingPermissions(true);
//   try {
//     const res = await axiosInstance.get(`/roles/${roleId}`);
//     const roleData = res.data.data;

//     if (!roleData) {
//       throw new Error('Role data not found');
//     }

//     // Only initialize if it's a new user (not editing)
//     if (!id) {
//       const initialMainHeaderAccess = {};
//       const initialPagePermissions = {};
//       const initialTabPermissions = {};

//       // First, set all to false
//       Object.keys(sidebarStructure).forEach(mainHeader => {
//         initialMainHeaderAccess[mainHeader] = false;
        
//         const headerPages = sidebarStructure[mainHeader].pages;
//         headerPages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             pagePerms[permType] = false;
//           });
//           initialPagePermissions[pageKey] = pagePerms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 tabPerms[permType] = false;
//               });
//               initialTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
//       });

//       // Now populate with role data
//       if (roleData.moduleAccess) {
//         Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             initialMainHeaderAccess[mainHeader] = Boolean(roleData.moduleAccess[apiModuleName]);
//           }
//         });
//       }

//       if (roleData.pageAccess) {
//         Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.pageAccess[apiModuleName]) {
//             Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//               const pageKey = `${mainHeader}_${pageName}`;
//               const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
              
//               if (initialPagePermissions[pageKey]) {
//                 sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                   const hasPermission = Array.isArray(permissionsArray) && 
//                     permissionsArray.includes(permType.toUpperCase());
                  
//                   initialPagePermissions[pageKey][permType] = hasPermission;
//                 });
//               }
//             });
//           }
//         });
//       }

//       // Process tab access
//       if (roleData.tabAccess) {
//         Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (mainHeader && roleData.tabAccess[apiModuleName]) {
//             Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//               Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//                 const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//                 if (!pageConfig) return;
                
//                 let matchingTab = null;
//                 if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                   matchingTab = pageConfig.tabs.find(tab => 
//                     tab.toUpperCase() === tabName.toUpperCase()
//                   );
                  
//                   if (!matchingTab) {
//                     const fuzzyMatches = {
//                       'PENDING APPROVALS': 'PENDING APPROVALS',
//                       'PENDING APPROVAL': 'PENDING APPROVALS',
//                       'APPROVED': 'APPROVED',
//                       'PENDING ALLOCATED': 'PENDING ALLOCATED',
//                       'ALLOCATED': 'ALLOCATED',
//                       'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
//                       'CANCELLED BOOKING': 'CANCELLED BOOKING',
//                       'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
//                       'SUBMITTED': 'SUBMITTED',
//                       'REJECTED': 'REJECTED'
//                     };
                    
//                     const upperTabName = tabName.toUpperCase();
//                     if (fuzzyMatches[upperTabName]) {
//                       matchingTab = fuzzyMatches[upperTabName];
//                     }
//                   }
//                 }
                
//                 if (matchingTab) {
//                   const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                   const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                  
//                   if (!initialTabPermissions[tabKey]) {
//                     initialTabPermissions[tabKey] = {};
//                   }
                  
//                   if (Array.isArray(permissions)) {
//                     permissions.forEach(perm => {
//                       const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                       initialTabPermissions[tabKey][permKey] = true;
//                     });
//                   }
//                 }
//               });
//             });
//           }
//         });
//       }

//       // Also get permission IDs from role
//       let rolePermissionIds = [];
//       if (Array.isArray(roleData.permissions) && roleData.permissions.length > 0) {
//         roleData.permissions.forEach(perm => {
//           const permId = typeof perm === 'string' ? perm : (perm._id || perm.id);
//           if (permId && !rolePermissionIds.includes(permId)) {
//             rolePermissionIds.push(permId);
//           }
//         });
//       }

//       setMainHeaderAccess(initialMainHeaderAccess);
//       setPagePermissions(initialPagePermissions);
//       setTabPermissions(initialTabPermissions);
      
//       // Set the formData permissions with role permissions for new user only
//       setFormData(prev => ({
//         ...prev,
//         permissions: rolePermissionIds
//       }));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Fetch Role Permissions');
//     showApiErrorAlert(errorMessage, 'Role Permissions Error');
//     throw error;
//   } finally {
//     setIsLoadingPermissions(false);
//   }
// };

//   // Helper to find main header by module name
//   const findMainHeaderByModule = (moduleName) => {
//     if (!moduleName) return null;
    
//     const moduleUpper = moduleName.toUpperCase();
//     for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
//       if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
//         return mainHeader;
//       }
//     }
    
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//   // Helper to find subdealer role
//   const findSubdealerRole = () => {
//     if (!roles || roles.length === 0) return null;
    
//     return roles.find(role => 
//       role.name.toLowerCase() === 'subdealer' || 
//       role.name.toLowerCase().includes('subdealer')
//     );
//   };

//   // Helper to extract permission IDs from current visual state
// const extractPermissionIdsFromState = () => {
//   const permissionIds = [];
  
//   Object.keys(mainHeaderAccess).forEach(mainHeader => {
//     if (mainHeaderAccess[mainHeader]) {
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       sidebarStructure[mainHeader].pages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
//         const pagePerms = pagePermissions[pageKey] || {};
        
//         // Add page permission IDs
//         Object.keys(pagePerms).forEach(permType => {
//           if (pagePerms[permType]) {
//             const permission = permissionsList.find(perm => 
//               apiModuleNames.some(apiModuleName => 
//                 perm.module.toUpperCase() === apiModuleName.toUpperCase()
//               ) && 
//               perm.page === page.name && 
//               perm.action === permType.toUpperCase() &&
//               !perm.tab
//             );
            
//             if (permission) {
//               permissionIds.push(permission._id);
//             }
//           }
//         });
        
//         // Add tab permission IDs
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             const tabPerms = tabPermissions[tabKey] || {};
            
//             Object.keys(tabPerms).forEach(permType => {
//               if (tabPerms[permType]) {
//                 const permission = permissionsList.find(perm => 
//                   apiModuleNames.some(apiModuleName => 
//                     perm.module.toUpperCase() === apiModuleName.toUpperCase()
//                   ) && 
//                   perm.page === page.name && 
//                   perm.action === permType.toUpperCase() &&
//                   perm.tab === tab
//                 );
                
//                 if (permission) {
//                   permissionIds.push(permission._id);
//                 }
//               }
//             });
//           });
//         }
//       });
//     }
//   });
  
//   return [...new Set(permissionIds)]; // Remove duplicates
// };

//  const handleChange = async (e) => {
//   const { name, value, type, checked } = e.target;
  
//   try {
//     // Handle checkbox inputs
//     if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
      
//       // For new users, clear existing permissions when selecting a new role
//       if (!id) {
//         setFormData(prev => ({ 
//           ...prev, 
//           permissions: [] 
//         }));
//       }
      
//       // Fetch role permissions (won't affect existing user's permissions)
//       await fetchRolePermissionsData(value);
//     }

//     if (name === 'type') {
//       if (value === 'subdealer') {
//         const subdealerRole = findSubdealerRole();
//         if (subdealerRole) {
//           // Auto-select logged-in user's subdealer if they are a subdealer
//           let selectedSubdealer = '';
//           if (isLoggedInSubdealer && loggedInUserSubdealerId) {
//             selectedSubdealer = loggedInUserSubdealerId;
//           }
          
//           setFormData(prev => ({ 
//             ...prev, 
//             type: value,
//             roleId: subdealerRole._id,
//             subdealer: selectedSubdealer,
//             branch: '', // Clear branch for subdealer
//             permissions: []
//           }));
//           await fetchRolePermissionsData(subdealerRole._id);
//           setShowPermissions(true);
//         }
//       } else {
//         setFormData(prev => ({ 
//           ...prev, 
//           type: value,
//           roleId: '',
//           subdealer: '',
//           accessibleBranches: [],
//           permissions: [] // Clear permissions when switching from subdealer
//         }));
//         setShowPermissions(false);
//       }
//     }
    
//     // Clear accessibleBranches when branchAccess is not ASSIGNED
//     if (name === 'branchAccess' && value !== 'ASSIGNED') {
//       setFormData(prev => ({ ...prev, accessibleBranches: [] }));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Handle Change');
//     showApiErrorAlert(errorMessage, 'Form Change Error');
//   }
// };

//   const handleVerticalChange = (e) => {
//     try {
//       const selectedId = e.target.value;
//       if (selectedId && !formData.verticles.includes(selectedId)) {
//         setFormData(prev => ({
//           ...prev,
//           verticles: [...prev.verticles, selectedId]
//         }));
//       }
//       setErrors(prev => ({ ...prev, verticles: '' }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Vertical Change');
//       showApiErrorAlert(errorMessage, 'Vertical Selection Error');
//     }
//   };

//   const handleAccessibleBranchChange = (e) => {
//     try {
//       const selectedId = e.target.value;
//       if (selectedId && !formData.accessibleBranches.includes(selectedId)) {
//         setFormData(prev => ({
//           ...prev,
//           accessibleBranches: [...prev.accessibleBranches, selectedId]
//         }));
//       }
//       setErrors(prev => ({ ...prev, accessibleBranches: '' }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Handle Accessible Branch Change');
//       showApiErrorAlert(errorMessage, 'Branch Selection Error');
//     }
//   };

//   const removeVertical = (verticalId) => {
//     try {
//       setFormData(prev => {
//         const newVerticles = prev.verticles.filter(id => id !== verticalId);
//         return {
//           ...prev,
//           verticles: newVerticles
//         };
//       });
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Remove Vertical');
//       showApiErrorAlert(errorMessage, 'Vertical Removal Error');
//     }
//   };

//   const removeAccessibleBranch = (branchId) => {
//     try {
//       setFormData(prev => {
//         const newBranches = prev.accessibleBranches.filter(id => id !== branchId);
//         return {
//           ...prev,
//           accessibleBranches: newBranches
//         };
//       });
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Remove Accessible Branch');
//       showApiErrorAlert(errorMessage, 'Branch Removal Error');
//     }
//   };

//   const togglePageExpansion = (pageKey) => {
//     try {
//       setExpandedPages(prev => ({
//         ...prev,
//         [pageKey]: !prev[pageKey]
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Toggle Page Expansion');
//       showApiErrorAlert(errorMessage, 'UI Error');
//     }
//   };

//   // Check if a permission exists in the system
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return false;
      
//       return permissionsList.some(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
//       );
//     } catch (error) {
//       console.error('Error checking permission existence:', error);
//       return false;
//     }
//   };

//   // Get all tab permissions that exist in API for a page
//   const getAvailableTabsForPage = (mainHeader, page) => {
//     try {
//       const apiModuleNames = moduleNameMap[mainHeader];
//       if (!apiModuleNames || !apiModuleNames.length) return [];
      
//       const tabs = new Set();
//       permissionsList.forEach(perm => {
//         if (apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.tab) {
//           tabs.add(perm.tab);
//         }
//       });
      
//       return Array.from(tabs);
//     } catch (error) {
//       console.error('Error getting available tabs:', error);
//       return [];
//     }
//   };

//   // Handle page permission change
// const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//   try {
//     const pageKey = `${mainHeader}_${page}`;
    
//     // Update page permissions
//     setPagePermissions(prev => ({
//       ...prev,
//       [pageKey]: {
//         ...prev[pageKey],
//         [permissionType]: value
//       }
//     }));

//     const apiModuleNames = moduleNameMap[mainHeader];
//     const permission = permissionsList.find(perm => 
//       apiModuleNames.some(apiModuleName => 
//         perm.module.toUpperCase() === apiModuleName.toUpperCase()
//       ) && 
//       perm.page === page && 
//       perm.action === permissionType.toUpperCase() &&
//       !perm.tab
//     );

//     // Handle form data update for page permission
//     if (permission) {
//       setFormData(prev => {
//         if (value) {
//           if (!prev.permissions.includes(permission._id)) {
//             return { ...prev, permissions: [...prev.permissions, permission._id] };
//           }
//         } else {
//           return { 
//             ...prev, 
//             permissions: prev.permissions.filter(id => id !== permission._id) 
//           };
//         }
//         return prev;
//       });
//     }

//     // If unchecking a permission, also uncheck the same permission for all tabs
//     if (!value) {
//       const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === page);
//       if (pageConfig?.tabs && pageConfig.tabs.length > 0) {
//         pageConfig.tabs.forEach(tab => {
//           const tabKey = `${mainHeader}_${page}_${tab}`;
          
//           // Update tab permissions
//           setTabPermissions(prev => ({
//             ...prev,
//             [tabKey]: {
//               ...prev[tabKey],
//               [permissionType]: false
//             }
//           }));

//           // Remove tab permission from form data
//           const tabPermission = permissionsList.find(perm => 
//             apiModuleNames.some(apiModuleName => 
//               perm.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             perm.page === page && 
//             perm.action === permissionType.toUpperCase() &&
//             perm.tab === tab
//           );

//           if (tabPermission) {
//             setFormData(prev => ({
//               ...prev,
//               permissions: prev.permissions.filter(id => id !== tabPermission._id)
//             }));
//           }
//         });
//       }
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Page Permission Change');
//     showApiErrorAlert(errorMessage, 'Permission Error');
//   }
// };

//   // Handle tab permission change
//   const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: {
//           ...prev[tabKey],
//           [permissionType]: value
//         }
//       }));

//       const apiModuleNames = moduleNameMap[mainHeader];
//       const permission = permissionsList.find(perm => 
//         apiModuleNames.some(apiModuleName => 
//           perm.module.toUpperCase() === apiModuleName.toUpperCase()
//         ) && 
//         perm.page === page && 
//         perm.action === permissionType.toUpperCase() &&
//         perm.tab === tab
//       );

//       if (permission) {
//         setFormData(prev => {
//           if (value) {
//             if (!prev.permissions.includes(permission._id)) {
//               return { ...prev, permissions: [...prev.permissions, permission._id] };
//             }
//           } else {
//             return { 
//               ...prev, 
//               permissions: prev.permissions.filter(id => id !== permission._id) 
//             };
//           }
//           return prev;
//         });
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Tab Permission Change');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all permissions for a page
//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
//         if (permissionExists) {
//           newPagePerms[permType] = true;
          
//           const permission = permissionsList.find(perm => 
//             apiModuleNames.some(apiModuleName => 
//               perm.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             perm.page === page && 
//             perm.action === permType.toUpperCase() &&
//             !perm.tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         } else {
//           newPagePerms[permType] = false;
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all permissions for a page
//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     try {
//       const pageKey = `${mainHeader}_${page}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPagePerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(permType => {
//         newPagePerms[permType] = false;
        
//         const permission = permissionsList.find(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           perm.page === page && 
//           perm.action === permType.toUpperCase() &&
//           !perm.tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setPagePermissions(prev => ({
//         ...prev,
//         [pageKey]: newPagePerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Page Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle select all tab permissions
//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       const newPerms = {};
//       const newPermissionIds = [...formData.permissions];
      
//       availablePermissions.forEach(perm => {
//         const exists = checkPermissionExists(mainHeader, page, perm, tab);
//         // Select all available permissions for tabs
//         newPerms[perm] = exists;
        
//         if (exists) {
//           const permission = permissionsList.find(p => 
//             apiModuleNames.some(apiModuleName => 
//               p.module.toUpperCase() === apiModuleName.toUpperCase()
//             ) && 
//             p.page === page && 
//             p.action === perm.toUpperCase() &&
//             p.tab === tab
//           );
          
//           if (permission && !newPermissionIds.includes(permission._id)) {
//             newPermissionIds.push(permission._id);
//           }
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Select All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle clear all tab permissions
//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     try {
//       const tabKey = `${mainHeader}_${page}_${tab}`;
//       const apiModuleNames = moduleNameMap[mainHeader];
      
//       const newPerms = {};
//       let newPermissionIds = [...formData.permissions];
      
//       sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//         newPerms[perm] = false;
        
//         const permission = permissionsList.find(p => 
//           apiModuleNames.some(apiModuleName => 
//             p.module.toUpperCase() === apiModuleName.toUpperCase()
//           ) && 
//           p.page === page && 
//           p.action === perm.toUpperCase() &&
//           p.tab === tab
//         );
        
//         if (permission) {
//           newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
//         }
//       });
      
//       setTabPermissions(prev => ({
//         ...prev,
//         [tabKey]: newPerms
//       }));
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: newPermissionIds
//       }));
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Clear All Tab Permissions');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle global actions for the three buttons
//   const handleGlobalAction = (actionType) => {
//     try {
//       switch (actionType) {
//         case 'none':
//           setFormData(prev => ({ ...prev, permissions: [] }));
          
//           const clearedPagePermissions = {};
//           const clearedTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = false;
//               });
//               clearedPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = false;
//                   });
//                   clearedTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(clearedPagePermissions);
//           setTabPermissions(clearedTabPermissions);
//           break;
          
//         case 'selectAll':
//           const allPermissionIds = permissionsList.map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
          
//           const allPagePermissions = {};
//           const allTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//               });
//               allPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                   });
//                   allTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(allPagePermissions);
//           setTabPermissions(allTabPermissions);
//           break;
          
//         case 'viewOnly':
//           const viewPermissionIds = permissionsList
//             .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
//             .map(perm => perm._id);
//           setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
          
//           const viewPagePermissions = {};
//           const viewTabPermissions = {};
//           Object.keys(sidebarStructure).forEach(mainHeader => {
//             sidebarStructure[mainHeader].pages.forEach(page => {
//               const pageKey = `${mainHeader}_${page.name}`;
//               const pagePerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 if (permType === 'VIEW') {
//                   pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
//                 } else {
//                   pagePerms[permType] = false;
//                 }
//               });
//               viewPagePermissions[pageKey] = pagePerms;
              
//               if (page.tabs && page.tabs.length > 0) {
//                 page.tabs.forEach(tab => {
//                   const tabKey = `${mainHeader}_${page.name}_${tab}`;
//                   const tabPerms = {};
//                   sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                     if (permType === 'VIEW') {
//                       tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
//                     } else {
//                       tabPerms[permType] = false;
//                     }
//                   });
//                   viewTabPermissions[tabKey] = tabPerms;
//                 });
//               }
//             });
//           });
//           setPagePermissions(viewPagePermissions);
//           setTabPermissions(viewTabPermissions);
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Global Permission Action');
//       showApiErrorAlert(errorMessage, 'Permission Error');
//     }
//   };

//   // Handle main header access change
//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     try {
//       setMainHeaderAccess(prev => ({
//         ...prev,
//         [mainHeader]: hasAccess
//       }));

//       if (!hasAccess) {
//         const newPagePermissions = { ...pagePermissions };
//         const newTabPermissions = { ...tabPermissions };
        
//         sidebarStructure[mainHeader].pages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const perms = {};
//           sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//             perms[perm] = false;
//           });
//           newPagePermissions[pageKey] = perms;
          
//           if (page.tabs && page.tabs.length > 0) {
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = {};
//               sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
//                 tabPerms[perm] = false;
//               });
//               newTabPermissions[tabKey] = tabPerms;
//             });
//           }
//         });
        
//         setPagePermissions(newPagePermissions);
//         setTabPermissions(newTabPermissions);
        
//         const apiModuleNames = moduleNameMap[mainHeader];
//         const modulePermissions = permissionsList.filter(perm => 
//           apiModuleNames.some(apiModuleName => 
//             perm.module.toUpperCase() === apiModuleName.toUpperCase()
//           )
//         );
//         const modulePermissionIds = modulePermissions.map(perm => perm._id);
        
//         setFormData(prev => ({
//           ...prev,
//           permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
//         }));
//       }
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Main Header Access Change');
//       showApiErrorAlert(errorMessage, 'Access Control Error');
//     }
//   };

//   // Render permissions table for a page
//   const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
//     try {
//       const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
//       const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
//       const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
//       // For tabs, show ALL available permissions, not just VIEW
//       const displayPermissions = availablePermissions;
      
//       return (
//         <CTable bordered responsive hover small className="permission-table mt-2">
//           <CTableHead color="light">
//             <CTableRow>
//               <CTableHeaderCell scope="col" className="text-nowrap">
//                 {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
//               </CTableHeaderCell>
//               {displayPermissions.map((perm) => (
//                 <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
//                   {getPermissionDisplayLabel(perm, isTab)}
//                 </CTableHeaderCell>
//               ))}
//               <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             <CTableRow>
//               <CTableDataCell>
//                 <strong>{isTab ? tabName : page}</strong>
//               </CTableDataCell>
//               {displayPermissions.map((perm) => {
//                 const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
//                 const isChecked = permissions[perm] || false;
                
//                 return (
//                   <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
//                     {permissionExists ? (
//                       <CFormCheck
//                         type="checkbox"
//                         checked={isChecked}
//                         onChange={(e) => {
//                           if (isTab) {
//                             handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
//                           } else {
//                             handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
//                           }
//                         }}
//                         aria-label={`${page}-${perm}`}
//                         title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
//                       />
//                     ) : (
//                       <span className="text-muted" title="Permission not available in system">
//                         N/A
//                       </span>
//                     )}
//                   </CTableDataCell>
//                 );
//               })}
//               <CTableDataCell className="text-center">
//                 <CButtonGroup size="sm">
//                   <CButton 
//                     color="primary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleSelectAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleSelectAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Select all available permissions"
//                   >
//                     All
//                   </CButton>
//                   <CButton 
//                     color="secondary" 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => {
//                       if (isTab) {
//                         handleClearAllTabPermissions(mainHeader, page, tabName);
//                       } else {
//                         handleClearAllPagePermissions(mainHeader, page);
//                       }
//                     }}
//                     title="Clear all permissions"
//                   >
//                     None
//                   </CButton>
//                 </CButtonGroup>
//               </CTableDataCell>
//             </CTableRow>
//           </CTableBody>
//         </CTable>
//       );
//     } catch (error) {
//       console.error('Error rendering permissions table:', error);
//       return (
//         <CAlert color="danger">
//           Error rendering permissions table. Please refresh the page.
//         </CAlert>
//       );
//     }
//   };

//   const validateForm = () => {
//     try {
//       const newErrors = {};
//       if (!formData.name.trim()) newErrors.name = 'Name is required';
//       if (!formData.type) newErrors.type = 'Type is required';
      
//       if (formData.type === 'employee') {
//         if (!formData.branch) newErrors.branch = 'Branch is required for employee';
//         if (!formData.roleId) newErrors.roleId = 'Role is required for employee';
//       }
      
//       if (formData.type === 'subdealer') {
//         if (!formData.subdealer) newErrors.subdealer = 'Subdealer is required';
//         // Role is auto-selected for subdealer, so no validation needed
        
//         // Validate accessibleBranches if branchAccess is ASSIGNED
//         if (formData.branchAccess === 'ASSIGNED' && formData.accessibleBranches.length === 0) {
//           newErrors.accessibleBranches = 'At least one branch must be selected when Branch Access is ASSIGNED';
//         }
//       }
      
//       if (!formData.email.trim()) newErrors.email = 'Email is required';
//       if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
      
//       // Only validate discount if user type is NOT subdealer AND logged-in user is not SUBDEALER
//       if (formData.type !== 'subdealer' && !isLoggedInSubdealerRole && !formData.discount) {
//         newErrors.discount = 'Discount is required';
//       }
      
//       // Email validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (formData.email && !emailRegex.test(formData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
      
//       // Mobile validation (basic)
//       const mobileRegex = /^[0-9]{10}$/;
//       if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
//         newErrors.mobile = 'Please enter a valid 10-digit mobile number';
//       }
      
//       const selectedRole = roles.find(role => role._id === formData.roleId);
//       if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
//         if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//         if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
        
//         // Validate numeric values
//         if (formData.totalDeviationAmount && isNaN(parseFloat(formData.totalDeviationAmount))) {
//           newErrors.totalDeviationAmount = 'Please enter a valid number';
//         }
//         if (formData.perTransactionDeviationLimit && isNaN(parseFloat(formData.perTransactionDeviationLimit))) {
//           newErrors.perTransactionDeviationLimit = 'Please enter a valid number';
//         }
//       }
      
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     } catch (error) {
//       const errorMessage = handleApiError(error, 'Form Validation');
//       showApiErrorAlert(errorMessage, 'Validation Error');
//       return false;
//     }
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!validateForm()) return;

//   setIsLoading(true);
  
//   try {
//     // Sync permissions from visual state to formData
//     const syncedPermissionIds = extractPermissionIdsFromState();
    
//     // Filter out null/undefined values from permissions
//     const validPermissions = [...new Set([...syncedPermissionIds, ...formData.permissions])].filter(perm => 
//       perm !== null && perm !== undefined && perm !== ''
//     );
    
//     const payload = {
//       name: formData.name.trim(),
//       type: formData.type,
//       roles: formData.roleId,
//       email: formData.email.trim(),
//       mobile: formData.mobile.trim(),
//       csd: formData.csd,
//       branchAccess: formData.branchAccess,
//       permissions: validPermissions,
//       verticles: formData.verticles,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//       ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
//       ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
//       ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//       ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//     };

//     // Add accessibleBranches if branchAccess is ASSIGNED and accessibleBranches is not empty
//     if (formData.branchAccess === 'ASSIGNED' && formData.accessibleBranches.length > 0) {
//       payload.accessibleBranches = formData.accessibleBranches;
//     }

//     console.log('Submitting payload:', payload);
//     console.log('Permission count:', validPermissions.length);

//     if (id) {
//       await axiosInstance.put(`/users/${id}`, payload);
//       await refreshPermissions();
//       await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//     } else {
//       await axiosInstance.post('/auth/register', payload);
//       await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//     }
//   } catch (error) {
//     const errorMessage = handleApiError(error, 'Submit Form');
    
//     // Show detailed error in alert
//     showApiErrorAlert(errorMessage, 'Submission Error');
    
//     // Also show the sweet alert for form submission errors
//     showFormSubmitError(error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  
//   // Check if the selected role is SALES_EXECUTIVE
//   const isSalesExecutiveRole = selectedRole && selectedRole.name && selectedRole.name.toUpperCase() === 'SALES_EXECUTIVE';
  
//   const getSelectedVerticalNames = () => {
//     return formData.verticles.map(item => {
//       const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
//       const vertical = verticles.find(v => 
//         v._id === verticalId || v.id === verticalId
//       );
//       return vertical ? vertical.name || String(verticalId) : String(verticalId);
//     });
//   };

//   const getSelectedAccessibleBranchNames = () => {
//     return formData.accessibleBranches.map(item => {
//       const branchId = typeof item === 'object' ? (item._id || item.id) : item;
//       const branch = branches.find(b => 
//         b._id === branchId || b.id === branchId
//       );
//       return branch ? branch.name || String(branchId) : String(branchId);
//     });
//   };

//   // Get the selected subdealer name for display
//   const getSelectedSubdealerName = () => {
//     if (!formData.subdealer) return '';
    
//     const subdealer = subdealers.find(s => s.id === formData.subdealer || s._id === formData.subdealer);
//     return subdealer ? subdealer.name : formData.subdealer;
//   };

//   // Render fetch errors if any
//   const renderFetchErrors = () => {
//     const errorMessages = Object.entries(fetchErrors)
//       .filter(([_, error]) => error !== null)
//       .map(([key, error]) => `${key}: ${error}`);

//     if (errorMessages.length === 0) return null;

//     return (
//       <CAlert color="warning" className="mb-3">
//         <div className="d-flex align-items-center">
//           <CIcon icon={cilWarning} className="me-2" />
//           <div>
//             <strong>Some data failed to load:</strong>
//             <ul className="mb-0 mt-1">
//               {errorMessages.map((msg, index) => (
//                 <li key={index}>{msg}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </CAlert>
//     );
//   };

//   if (isLoading && !id) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//         <span className="ms-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       {/* Global API Error Alert */}
//       {apiError && (
//         <CAlert 
//           color="danger" 
//           className="mb-3" 
//           dismissible
//           onClose={() => setApiError(null)}
//         >
//           <div className="d-flex align-items-center">
//             <CIcon icon={cilWarning} className="me-2" />
//             <div>
//               <strong>{apiError.context}</strong>
//               <p className="mb-0">{apiError.message}</p>
//             </div>
//           </div>
//         </CAlert>
//       )}

//       {/* Fetch Errors Alert */}
//       {renderFetchErrors()}

//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <FormErrorBoundary section="User Details">
//               <div className="user-details">
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Name</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="text" 
//                       name="name" 
//                       value={formData.name} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="Enter full name"
//                     />
//                   </CInputGroup>
//                   {errors.name && <p className="error">{errors.name}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPeople} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="type" 
//                       value={formData.type} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                     >
//                       <option value="employee">Employee</option>
//                       <option value="subdealer">Subdealer</option>
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.type && <p className="error">{errors.type}</p>}
//                 </div>
                
//              {formData.type === 'employee' && (
//   <div className="input-box">
//     <div className="details-container">
//       <span className="details">Branch</span>
//       <span className="required">*</span>
//     </div>
//     <CInputGroup>
//       <CInputGroupText className="input-icon">
//         <CIcon icon={cilLocationPin} />
//       </CInputGroupText>
//       <CFormSelect 
//         name="branch" 
//         value={formData.branch} 
//         onChange={handleChange}
//         disabled={isLoading || fetchErrors.branches}
//       >
//         <option value="">-Select-</option>
//         {branches.map(branch => (
//           <option key={branch._id} value={branch._id}>
//             {branch.name}
//           </option>
//         ))}
//       </CFormSelect>
//     </CInputGroup>
//     {errors.branch && <p className="error">{errors.branch}</p>}
//     {fetchErrors.branches && (
//       <small className="text-warning">Branches data unavailable: {fetchErrors.branches}</small>
//     )}
//   </div>
// )}

//                 {formData.type === 'subdealer' && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Subdealer Type</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormSelect 
//                         name="subdealer" 
//                         value={formData.subdealer} 
//                         onChange={handleChange}
//                         disabled={isLoading || fetchErrors.subdealers || (isLoggedInSubdealer && !id)}
//                       >
//                         <option value="">-Select Subdealer-</option>
//                         {subdealers.map(subdealer => (
//                           <option key={subdealer.id} value={subdealer.id}>
//                             {subdealer.name}
//                           </option>
//                         ))}
//                       </CFormSelect>
//                     </CInputGroup>
//                     {errors.subdealer && <p className="error">{errors.subdealer}</p>}
//                     {fetchErrors.subdealers && (
//                       <small className="text-warning">Subdealers data unavailable: {fetchErrors.subdealers}</small>
//                     )}
//                   </div>
//                 )}
                
//                <div className="input-box">
//   <div className="details-container">
//     <span className="details">Role</span>
//     <span className="required">*</span>
//   </div>
//   <CInputGroup>
//     <CInputGroupText className="input-icon">
//       <CIcon icon={cilUser} />
//     </CInputGroupText>
//     <CFormSelect 
//       name="roleId" 
//       value={formData.roleId} 
//       onChange={handleChange}
//       disabled={isLoading || fetchErrors.roles || formData.type === 'subdealer'}
//     >
//       <option value="">-Select-</option>
//       {roles.map(role => (
//         <option key={role._id} value={role._id}>
//           {role.name}
//         </option>
//       ))}
//     </CFormSelect>
//   </CInputGroup>
//   {errors.roleId && <p className="error">{errors.roleId}</p>}
//   {formData.type === 'subdealer' ? (
//     <small className="text-muted">Role is automatically set to Subdealer and cannot be changed</small>
//   ) : (
//     <small className="text-muted">Select the role for this user</small>
//   )}
//   {fetchErrors.roles && (
//     <small className="text-warning">Roles data unavailable: {fetchErrors.roles}</small>
//   )}
// </div>


//                 {/* Only show Branch Access field if role is not SALES_EXECUTIVE */}
//             {/* Only show Branch Access field if role is not SALES_EXECUTIVE AND type is not subdealer */}
// {!isSalesExecutiveRole && formData.type !== 'subdealer' && (
//   <div className="input-box">
//     <div className="details-container">
//       <span className="details">Branch Access</span>
//       <span className="required">*</span>
//     </div>
//     <CInputGroup>
//       <CInputGroupText className="input-icon">
//         <CIcon icon={cilBuilding} />
//       </CInputGroupText>
//       <CFormSelect 
//         name="branchAccess" 
//         value={formData.branchAccess} 
//         onChange={handleChange}
//         disabled={isLoading}
//       >
//         <option value="OWN">OWN - Only own branch</option>
//         {/* <option value="ASSIGNED">ASSIGNED - Selected branches</option> */}
//         <option value="ALL">ALL - All branches</option>
//       </CFormSelect>
//     </CInputGroup>
//     <small className="text-muted">
//       Defines which branches the user can access
//     </small>
//   </div>
// )}

//                 {/* Accessible Branches Field - Only shown when branchAccess is ASSIGNED AND role is not SALES_EXECUTIVE */}
//                {!isSalesExecutiveRole && formData.type !== 'subdealer' && formData.branchAccess === 'ASSIGNED' && (
//   <div className="input-box">
//     <div className="details-container">
//       <span className="details">Accessible Branches</span>
//       <span className="required">*</span>
//     </div>
//     <CInputGroup>
//       <CInputGroupText className="input-icon">
//         <CIcon icon={cilBuilding} />
//       </CInputGroupText>
//       <CFormSelect 
//         name="accessibleBranch" 
//         value="" 
//         onChange={handleAccessibleBranchChange}
//         disabled={isLoading || fetchErrors.branches}
//       >
//         <option value="">-Select Branch-</option>
//         {branches.map(branch => (
//           <option 
//             key={branch._id} 
//             value={branch._id}
//             disabled={formData.accessibleBranches.includes(branch._id)}
//           >
//             {branch.name}
//           </option>
//         ))}
//       </CFormSelect>
//     </CInputGroup>
    
//     <div className="mt-2">
//       <div className="d-flex flex-wrap gap-2">
//         {getSelectedAccessibleBranchNames().map((branchName, index) => {
//           const branchId = formData.accessibleBranches[index];
//           return (
//             <CBadge 
//               key={`${branchId}_${index}`} 
//               color="info"
//               className="d-flex align-items-center"
//               style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//             >
//               {String(branchName)}
//               <CCloseButton 
//                 className="ms-2"
//                 onClick={() => removeAccessibleBranch(branchId)}
//                 style={{ fontSize: '0.75rem' }}
//                 disabled={isLoading}
//               />
//             </CBadge>
//           );
//         })}
//       </div>
//       <small className="text-muted">
//         {formData.accessibleBranches.length} branch(es) selected
//       </small>
//       {errors.accessibleBranches && <p className="error">{errors.accessibleBranches}</p>}
//       {fetchErrors.branches && (
//         <small className="text-warning d-block">Branches data unavailable: {fetchErrors.branches}</small>
//       )}
//     </div>
//   </div>
// )}
                
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Email</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilEnvelopeClosed} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="email" 
//                       name="email" 
//                       value={formData.email} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="user@example.com"
//                     />
//                   </CInputGroup>
//                   {errors.email && <p className="error">{errors.email}</p>}
//                 </div>

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Mobile number</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilPhone} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="tel" 
//                       name="mobile" 
//                       value={formData.mobile} 
//                       onChange={handleChange}
//                       disabled={isLoading}
//                       placeholder="10-digit mobile number"
//                     />
//                   </CInputGroup>
//                   {errors.mobile && <p className="error">{errors.mobile}</p>}
//                 </div>

//                 {/* Only show discount field if NOT creating a subdealer AND logged-in user is NOT a SUBDEALER */}
//                 {formData.type !== 'subdealer' && !isLoggedInSubdealerRole && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Discount</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilDollar} />
//                       </CInputGroupText>
//                       <CFormInput 
//                         type="number" 
//                         name="discount" 
//                         value={formData.discount} 
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         min="0"
//                         step="0.01"
//                         placeholder="0.00"
//                       />
//                     </CInputGroup>
//                     {errors.discount && <p className="error">{errors.discount}</p>}
//                   </div>
//                 )}

//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Verticles</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilTag} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="vertical" 
//                       value="" 
//                       onChange={handleVerticalChange}
//                       disabled={isLoading || fetchErrors.verticles}
//                     >
//                       <option value="">-Select Verticle-</option>
//                       {verticles
//                         .filter(vertical => vertical.status === 'active')
//                         .map(vertical => (
//                           <option 
//                             key={vertical._id} 
//                             value={vertical._id}
//                             disabled={formData.verticles.includes(vertical._id)}
//                           >
//                             {vertical.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
                  
//                   <div className="mt-2">
//                     <div className="d-flex flex-wrap gap-2">
//                       {getSelectedVerticalNames().map((verticalName, index) => {
//                         const verticalId = formData.verticles[index];
//                         return (
//                           <CBadge 
//                             key={`${verticalId}_${index}`} 
//                             color="primary"
//                             className="d-flex align-items-center"
//                             style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//                           >
//                             {String(verticalName)}
//                             <CCloseButton 
//                               className="ms-2"
//                               onClick={() => removeVertical(verticalId)}
//                               style={{ fontSize: '0.75rem' }}
//                               disabled={isLoading}
//                             />
//                           </CBadge>
//                         );
//                       })}
//                     </div>
//                     <small className="text-muted">
//                       {formData.verticles.length} verticle(s) selected (Optional)
//                     </small>
//                     {fetchErrors.verticles && (
//                       <small className="text-warning d-block">Verticles data unavailable: {fetchErrors.verticles}</small>
//                     )}
//                   </div>
//                 </div>

//                 {/* Only show CSD field when all these conditions are met:
//                     1. Logged-in user is NOT a SUBDEALER
//                     2. User type is NOT 'subdealer'
//                     3. Selected role is NOT 'SALES_EXECUTIVE'
//                 */}
//                 {!isLoggedInSubdealerRole && formData.type !== 'subdealer' && !isSalesExecutiveRole && (
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">CSD</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <div className="form-check form-switch mt-2 ms-2">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           name="csd"
//                           id="csdCheckbox"
//                           checked={formData.csd}
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           style={{ width: '3em', height: '1.5em' }}
//                         />
//                         <label className="form-check-label ms-2" htmlFor="csdCheckbox">
//                           {formData.csd ? 'Yes' : 'No'}
//                         </label>
//                       </div>
//                     </CInputGroup>
//                     <small className="text-muted">
//                       Customer Service Department access
//                     </small>
//                   </div>
//                 )}

//                 {isManager && (
//                   <>
//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Total Deviation Amount</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="totalDeviationAmount" 
//                           value={formData.totalDeviationAmount} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                     </div>

//                     <div className="input-box">
//                       <div className="details-container">
//                         <span className="details">Per Transaction Deviation Limit</span>
//                         <span className="required">*</span>
//                       </div>
//                       <CInputGroup>
//                         <CInputGroupText className="input-icon">
//                           <CIcon icon={cilDollar} />
//                         </CInputGroupText>
//                         <CFormInput 
//                           type="number" 
//                           name="perTransactionDeviationLimit" 
//                           value={formData.perTransactionDeviationLimit} 
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                         />
//                       </CInputGroup>
//                       {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </FormErrorBoundary>

//             {showPermissions && (
//               <FormErrorBoundary section="Permissions Configuration">
//                 <div className="permissions-container mt-4">
//                   <h5 className="mb-3">User Permissions Configuration</h5>
//                   <p className="text-muted mb-4">
//                     These permissions are in addition to the role permissions. 
//                     Total system permissions: {permissionsList.length}
//                     {fetchErrors.permissions && (
//                       <span className="text-warning ms-2">(Permissions data incomplete: {fetchErrors.permissions})</span>
//                     )}
//                   </p>
                  
//                   {/* Three global permission buttons added here */}
//                   <div className="mb-3">
//                     <CButtonGroup>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('none')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         None
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('selectAll')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         Select All
//                       </CButton>
//                       <CButton 
//                         color="secondary" 
//                         onClick={() => handleGlobalAction('viewOnly')} 
//                         variant="outline"
//                         disabled={isLoading || isLoadingPermissions}
//                       >
//                         View Only
//                       </CButton>
//                     </CButtonGroup>
//                   </div>

//                   {isLoadingPermissions ? (
//                     <div className="d-flex justify-content-center align-items-center py-4">
//                       <CSpinner color="primary" />
//                       <span className="ms-2">Loading permissions...</span>
//                     </div>
//                   ) : (
//                     <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                       {Object.keys(sidebarStructure).map((mainHeader) => {
//                         const hasAccess = mainHeaderAccess[mainHeader] || false;
//                         const pageCount = sidebarStructure[mainHeader].pages.length;

//                         return (
//                           <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                             <CAccordionHeader>
//                               <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//                                 <div>
//                                   <h6 className="mb-0">{mainHeader}</h6>
//                                   <small className="text-muted">{pageCount} pages</small>
//                                 </div>
//                                 <div className="d-flex align-items-center gap-2">
//                                   <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//                                     {hasAccess ? 'Access Granted' : 'No Access'}
//                                   </CBadge>
//                                   <div className="d-flex align-items-center" role="group">
//                                     <CButton
//                                       size="sm"
//                                       color={hasAccess ? "success" : "secondary"}
//                                       variant="outline"
//                                       className="me-1"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, true);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilCheck} /> Yes
//                                     </CButton>
//                                     <CButton
//                                       size="sm"
//                                       color={!hasAccess ? "danger" : "secondary"}
//                                       variant="outline"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleMainHeaderAccessChange(mainHeader, false);
//                                       }}
//                                       disabled={isLoading || isLoadingPermissions}
//                                     >
//                                       <CIcon icon={cilX} /> No
//                                     </CButton>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CAccordionHeader>
//                             <CAccordionBody>
//                               {hasAccess ? (
//                                 <div className="pages-permissions">
//                                   {sidebarStructure[mainHeader].pages.map((page) => {
//                                     const pageKey = `${mainHeader}_${page.name}`;
//                                     const isExpanded = expandedPages[pageKey] || false;
//                                     const pageHasTabs = page.tabs && page.tabs.length > 0;
//                                     const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                                     const hasTabPermissions = availableTabs.length > 0;
                                    
//                                     return (
//                                       <CCard key={pageKey} className="mb-3">
//                                         <CCardBody>
//                                           <div className="d-flex justify-content-between align-items-center mb-2">
//                                             <h6 className="mb-0">{page.name}</h6>
//                                             <div className="d-flex align-items-center gap-2">
//                                               {pageHasTabs && hasTabPermissions && (
//                                                 <CButton
//                                                   size="sm"
//                                                   color="link"
//                                                   onClick={() => togglePageExpansion(pageKey)}
//                                                   className="p-0"
//                                                   disabled={isLoading || isLoadingPermissions}
//                                                 >
//                                                   {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                                 </CButton>
//                                               )}
//                                             </div>
//                                           </div>
                                          
//                                           {/* Page-level permissions */}
//                                           {renderPermissionsTable(mainHeader, page.name, false)}
                                          
//                                           {/* Tab-level permissions (if available) */}
//                                           {pageHasTabs && hasTabPermissions && (
//                                             <CCollapse visible={isExpanded}>
//                                               <div className="mt-3">
//                                                 <h6 className="mb-2">Tab Permissions</h6>
//                                                 {availableTabs.map((tab) => (
//                                                   <div key={`${pageKey}_${tab}`} className="mb-3">
//                                                     {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             </CCollapse>
//                                           )}
//                                         </CCardBody>
//                                       </CCard>
//                                     );
//                                   })}
//                                 </div>
//                               ) : (
//                                 <div className="text-center py-4">
//                                   <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                                   <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                                   <small>Click "Yes" to grant access and configure permissions</small>
//                                 </div>
//                               )}
//                             </CAccordionBody>
//                           </CAccordionItem>
//                         );
//                       })}
//                     </CAccordion>
//                   )}
//                 </div>
//               </FormErrorBoundary>
//             )}

//             <div className="form-footer">
//               <button 
//                 type="submit" 
//                 className="cancel-button"
//                 disabled={isLoading || isLoadingPermissions}
//               >
//                 {isLoading ? (
//                   <>
//                     <CSpinner size="sm" className="me-2" />
//                     {id ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   'Save'
//                 )}
//               </button>
//               <button 
//                 type="button" 
//                 className="submit-button" 
//                 onClick={handleCancel}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;













import React, { useState, useEffect, useContext } from 'react';
import '../../css/permission.css';
import '../../css/form.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CButtonGroup,
  CBadge,
  CCloseButton,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CSpinner,
  CAlert,
  CCard,
  CCardBody,
  CCollapse,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilCheck, cilX, cilFolder, cilListRich, cilWarning, cilBuilding, cilInfo, cilShieldAlt } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
import axiosInstance from 'src/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../context/AuthContext';

// Permission label mapping for display only
const permissionLabelMap = {
  "CREATE": "Add",
  "VIEW": "View",
  "UPDATE": "Edit",
  "DELETE": "Delete",
  "READ": "View",
  "WRITE": "Edit"
};

// Tab permission label mapping - SAME AS PAGES
const tabPermissionLabelMap = {
  "CREATE": "Add",
  "VIEW": "View",
  "UPDATE": "Edit", 
  "DELETE": "Delete"
};

// Permission descriptions mapping
const permissionDescriptions = {
  "Purchase": {
    "Inward Stock": {
      "CREATE": "New Stock, Export Excel, Import Excel, Print QR",
      "VIEW": "Search",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Stock Verification": {
      "CREATE": "Verify",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Stock Transfer": {
      "CREATE": "Transfer",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Upload Challan": {
      "CREATE": "Upload",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "RTO Chassis": {
      "CREATE": "Download Template, Upload CSV, Export to Excel",
      "VIEW": "View Details, Filter by Batch",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  "Sales": {
    "New Booking": {
      "CREATE": "Create new bookings",
      "VIEW": "View booking form",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "All Booking": {
      "CREATE": "New Booking, Upload Finance, Upload KYC, Print,Approve Chassis,Reject Chassis,Back To Normal, Approve, Reject, Allocate Chassis",
      "VIEW": "View Booking, Available Documents, View Finance Letter, View KYC",
      "UPDATE": "Edit, Change Vehicle",
      "DELETE": "Delete"
    },
    "Self Insurance": {
      "CREATE": "Approve, Reject",
      "VIEW": "View Self Insurance",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Delivery Challan": {
      "CREATE": "Print",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "GST Invoice": {
      "CREATE": "Print, Clear",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Helmet Invoice": {
      "CREATE": "Print, Clear",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Deal Form": {
      "CREATE": "Print, Clear",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Upload Deal Form & Delivery Challan": {
      "CREATE": "Upload",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  "Sales Report": {
    "Sales Person Wise": {
      "VIEW": "Export to Excel"
    },
    "Periodic Report": {
      "VIEW": "Export to Excel"
    }
  },
  "Quotation": {
    "Quotation": {
      "CREATE": "New, Export Excel, Download",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  "Account": {
    "Dashboard": {
      "VIEW": "View account dashboard (overview, summary)"
    },
    "Receipts": {
      "CREATE": "Add Payment, Receipt, Verify",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Debit Note": {
      "CREATE": "Add",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Refund": {
      "CREATE": "Add",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Cancelled Booking": {
      "CREATE": "Process Refund",
      "VIEW": "View",
      "UPDATE": "edit",
      "DELETE": "Delete"
    },
    "All Receipts": {
      "VIEW": "View"
    },
    "Ledgers": {
      "VIEW": "View"
    },
    "Exchange Ledger": {
      "CREATE":"Add Payment",
      "VIEW": "View ledger, Search"
    },
    "Broker Payment Verification": {
      "CREATE": "Verify",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Report": {
      "VIEW": "Export to Excel"
    }
  },
  "Insurance": {
    "Dashboard": {
      "VIEW": "View insurance dashboard (overview, summary)"
    },
    "Insurance Details": {
      "CREATE": "Add",
      "VIEW": "View",
      "UPDATE": "Update",
      "DELETE": "Delete"
    }
  },
  "RTO": {
    "Dashboard": {
      "VIEW": "View RTO dashboard (overview, summary)"
    },
    "Application": {
      "CREATE": "Add Deviation, Update RTO Application",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "RTO Paper": {
      "CREATE": "Upload KYC",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "RTO Tax": {
      "CREATE": "Update",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "HSRP Ordering": {
      "CREATE": "Verify",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "HSRP Installation": {
      "CREATE": "Update",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "RC Confirmation": {
      "CREATE": "Update",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Report": {
      "VIEW": "Export"
    }
  },
  "Fund Management": {
    "Cash Voucher": {
      "CREATE": "Save, Cancel",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Contra Voucher": {
      "CREATE": "Save, Cancel",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Contra Approval": {
      "CREATE": "Approve, Reject",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Workshop Cash Receipt": {
      "CREATE": "Save, Cancel",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "All Cash Receipt": {
      "VIEW": "View PDF"
    },
    "Cash Book": {
      "VIEW": "Search"
    },
    "Day Book": {
      "VIEW": "Search"
    },
    "Report": {
      "VIEW": "Export"
    }
  },
  "Masters": {
    "Location": {
      "CREATE": "New Branch, Deactivate",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Headers": {
      "CREATE": "New Header, Export Excel",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Vehicles": {
      "CREATE": "New Model, Import Excel, Mark as Inactive",
      "VIEW": "View, Filter",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Minimum Booking Amount": {
      "CREATE": "Set minimum booking amounts (configure)",
      "VIEW": "View booking amount settings",
      "UPDATE": "Edit booking amounts",
      "DELETE": "Delete amount settings"
    },
    "Template List": {
      "CREATE": "Add",
      "VIEW": "Preview",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Accessories": {
      "CREATE": "New Accessory, Part Number Status",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Colour": {
      "CREATE": "New Color",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Documents": {
      "CREATE": "New Document",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Terms & Conditions": {
      "CREATE": "New Condition",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Offer": {
      "CREATE": "New Offer",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Attachments": {
      "CREATE": "New Attachment, Documents",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Declaration": {
      "CREATE": "New Declaration, Deactivate",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "RTO": {
      "CREATE": "New RTO",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Financer": {
      "CREATE": "New Financer",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Finance Rates": {
      "CREATE": "New Rates",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Insurance Providers": {
      "CREATE": "New Provider",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Brokers": {
      "CREATE": "New Broker, OTP Required",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Broker Commission Range": {
      "CREATE": "New Range",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Vertical Masters": {
      "CREATE": "New Verticle Master, Mark as Inactive",
      "VIEW": "View, Filter",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  // ===== ADD BRANCH STOCK AUDIT PERMISSION DESCRIPTIONS =====
  "BRANCH STOCK AUDIT": {
    "Branch Stock Audit": {
      "CREATE": "Create new branch stock audits",
      "VIEW": "View branch stock audit list and details",
      "UPDATE": "Edit branch stock audit details, Approve/Reject audits",
      "DELETE": "Delete branch stock audit records"
    }
  },
  "Fund Master": {
    "Cash Account Master": {
      "CREATE": "New, Deactivate",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Bank Account Master": {
      "CREATE": "New, Deactivate",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Payment Mode": {
      "CREATE": "New",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Expense Master": {
      "CREATE": "New",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Add Opening Balance": {
      "CREATE": "New, Reset Balance",
      "VIEW": "View History",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  "Accessories Billing": {
    "Accessories Billing": {
      "CREATE": "Save, Cancel",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  "Customers": {
    "Customers": {
      "CREATE": "New Customer",
      "VIEW": "View Ledger",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  "Subdealer": {
    "Subdealer Stock Audit": {
      "CREATE": "New Audit Schedule",
      "VIEW": "Filter",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  "Subdealer Master": {
    "Subdealer List": {
      "CREATE": "New Subdealer, Apply Penalty, Deactivate",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Subdealer Audit List": {
      "CREATE": "New Audit Schedule, Deactivate",
      "VIEW": "Filter",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Subdealer Commission": {
      "CREATE": "Add, Date Range, Import, Export",
      "VIEW": "Filter",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Calculate Commission": {
      "CREATE": "Generate Report",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  },
  "Subdealer Booking": {
    "New Booking": {
      "CREATE": "New Booking",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Cancel"
    },
    "All Booking": {
      "CREATE": "Upload KYC, Print, Allocate Chassis, Change Vehicle",
      "VIEW": "View Booking, Available Documents, View Finance Letter",
      "UPDATE": "Edit",
      "DELETE": "Delete booking records"
    },
    "Delivery Challan": {
      "CREATE": "Generate delivery challans for subdealers",
      "VIEW": "View subdealer challan history",
      "UPDATE": "Edit challan details",
      "DELETE": "Delete challan records"
    }
  },
  "Subdealer Management": {
    "Subdealer Management": {
      "CREATE": "Approve, Reject, Back to Normal",
      "VIEW": "View subdealer management console",
      "UPDATE": "Edit management settings",
      "DELETE": "Delete management records"
    }
  },
  "Subdealer Account": {
    "Add Balance": {
      "CREATE": "Add",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "OnAccount Balance": {
      "CREATE":"New Balance",
      "VIEW": "ViewLedgeron-account balances"
    },
    "Add Amount": {
      "CREATE": "Save, Cancel",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Finance Payment": {
      "CREATE": "Add",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Payment Verification": {
      "CREATE": "Verify",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Subdealer Commission": {
      "CREATE": "Save, Cancel",
      "VIEW": "View commission records",
      "UPDATE": "Edit commission details",
      "DELETE": "Delete commission records"
    },
    "Payment Summary": {
      "VIEW": "Generate Receipt"
    },
    "Subdealer Ledger": {
      "VIEW": "View Ledger"
    },
    "Customer Ledger": {
      "VIEW": "View Ledger"
    },
    "Summary": {
      "VIEW": "View"
    }
  },
  "User Management": {
    "Create Role": {
      "CREATE": "Save, Cancel",
      "VIEW": "View role creation interface",
      "UPDATE": "Edit role during creation",
      "DELETE": "Cancel role creation"
    },
    "All Role": {
      "CREATE": "New Role",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Add User": {
      "CREATE": "Save, Cancel",
      "VIEW": "View user addition interface",
      "UPDATE": "Edit user during creation",
      "DELETE": "Cancel user addition"
    },
    "User List": {
      "CREATE": "New User",
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    },
    "Buffer Report": {
      "VIEW": "View buffer reports"
    },
    "Manager Deviation": {
     
      "VIEW": "View",
      "UPDATE": "Edit",
      "DELETE": "Delete"
    }
  }
};

// Updated sidebar structure with tabs (same as CreateRoleWithHierarchy)
const sidebarStructure = {
  "Dashboard": {
    pages: [{
      name: "Dashboard",
      tabs: null
    }],
    availablePermissions: ["VIEW"]
  },
  "Purchase": {
    pages: [
      { name: "Inward Stock", tabs: null },
      { 
        name: "Stock Verification", 
        tabs: ["PENDING VERIFICATION", "VERIFIED STOCK"]
      },
      { name: "Stock Transfer", tabs: null },
      { name: "Upload Challan", tabs: null },
      { name: "RTO Chassis", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Sales": {
    pages: [
      { name: "New Booking", tabs: null },
      { 
        name: "All Booking", 
        tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED", "REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
      },
      { name: "Self Insurance", tabs: null },
      { name: "Delivery Challan", tabs: null },
      { name: "GST Invoice", tabs: null },
      { name: "Helmet Invoice", tabs: null },
      { name: "Deal Form", tabs: null },
      { name: "Upload Deal Form & Delivery Challan", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Sales Report": {
    pages: [
      { name: "Sales Person Wise", tabs: null },
      { name: "Periodic Report", tabs: null }
    ],
    availablePermissions: ["VIEW"]
  },
  "Quotation": {
    pages: [
      { name: "Quotation", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Account": {
    pages: [
      { name: "Dashboard", tabs: null },
      { 
        name: "Receipts", 
        tabs: ["CUSTOMER", "PAYMENT VERIFICATION", "COMPLETE PAYMENT", "PENDING LIST", "VERIFIED LIST"]
      },
      { name: "Debit Note", tabs: null },
      { name: "Refund", tabs: null },
      { 
        name: "Cancelled Booking", 
        tabs: ["PROCESS REFUND", "COMPLETED REFUND"]
      },
      { name: "All Receipts", tabs: null },
      { name: "Ledgers", tabs: null },
      { name: "Exchange Ledger", tabs: null },
      { 
        name: "Broker Payment Verification", 
        tabs: ["PENDING VERIFICATION", "VERIFIED PAYMENTS"]
      },
      { name: "Report", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Insurance": {
    pages: [
      { name: "Dashboard", tabs: null },
      { 
        name: "Insurance Details", 
        tabs: ["PENDING INSURANCE", "COMPLETE INSURANCE", "UPDATE LATER"]
      }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "RTO": {
    pages: [
      { name: "Dashboard", tabs: null },
      { 
        name: "Application", 
        tabs: ["RTO PENDING", "APPLIED FOR"]
      },
      { 
        name: "RTO Paper", 
        tabs: ["RTO PAPER PENDING", "COMPLETED"]
      },
      { 
        name: "RTO Tax", 
        tabs: ["RTO PENDING TAX", "TAX PAID"]
      },
      { 
        name: "HSRP Ordering", 
        tabs: ["RTO PENDING HSRP ORDERING", "COMPLETED HSRP ORDERING"]
      },
      { 
        name: "HSRP Installation", 
        tabs: ["RTO PENDING HSRP INSTALLATION", "COMPLETED HSRP INSTALLATION"]
      },
      { 
        name: "RC Confirmation", 
        tabs: ["RTO PENDING RC CONFIRMATION", "COMPLETED RC"]
      },
      { name: "Report", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Fund Management": {
    pages: [
      { name: "Cash Voucher", tabs: null },
      { name: "Contra Voucher", tabs: null },
      { 
        name: "Contra Approval", 
        tabs: ["PENDING APPROVAL", "COMPLETE REPORT", "REJECT REPORT"]
      },
      { name: "Workshop Cash Receipt", tabs: null },
      { name: "All Cash Receipt", tabs: null },
      { name: "Cash Book", tabs: null },
      { name: "Day Book", tabs: null },
      { name: "Report", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Masters": {
    pages: [
      { name: "Location", tabs: null },
      { name: "Branch Audit List", tabs: null },
      { name: "Headers", tabs: null },
      { name: "Vehicles", tabs: null },
      { name: "Minimum Booking Amount", tabs: null },
      { name: "Template List", tabs: null },
      { name: "Accessories", tabs: null },
      { name: "Colour", tabs: null },
      { name: "Documents", tabs: null },
      { name: "Terms & Conditions", tabs: null },
      { name: "Offer", tabs: null },
      { name: "Attachments", tabs: null },
      { name: "Declaration", tabs: null },
      { name: "RTO", tabs: null },
      { name: "Financer", tabs: null },
      { name: "Finance Rates", tabs: null },
      { name: "Insurance Providers", tabs: null },
      { name: "Brokers", tabs: null },
      { name: "Broker Commission Range", tabs: null },
      { name: "Vertical Masters", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  // ===== ADD BRANCH STOCK AUDIT HERE =====
  "BRANCH STOCK AUDIT": {
    pages: [
      { name: "Branch Stock Audit", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Fund Master": {
    pages: [
      { name: "Cash Account Master", tabs: null },
      { name: "Bank Account Master", tabs: null },
      { name: "Payment Mode", tabs: null },
      { name: "Expense Master", tabs: null },
      { name: "Add Opening Balance", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Accessories Billing": {
    pages: [
      { name: "Accessories Billing", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Customers": {
    pages: [
      { name: "Customers", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer": {
    pages: [
      { 
        name: "Subdealer Stock Audit", 
        tabs: ["SUBMITTED", "APPROVED", "REJECTED"]
      }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer Master": {
    pages: [
      { name: "Subdealer List", tabs: null },
      { name: "Subdealer Audit List", tabs: null },
      { name: "Subdealer Commission", tabs: null },
      { name: "Calculate Commission", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer Booking": {
    pages: [
      { name: "New Booking", tabs: null },
      { 
        name: "All Booking", 
        tabs: ["PENDING APPROVALS", "APPROVED", "PENDING ALLOCATED", "ALLOCATED"]
      },
      { name: "Delivery Challan", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer Management": {
    pages: [
      { 
        name: "Subdealer Management", 
        tabs: ["REJECTED DISCOUNT", "CANCELLED BOOKING", "REJECTED CANCELLED BOOKING"]
      }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "Subdealer Account": {
    pages: [
      { name: "Add Balance", tabs: null },
      { name: "OnAccount Balance", tabs: null },
      { name: "Add Amount", tabs: null },
      { 
        name: "Finance Payment", 
        tabs: ["PENDING PAYMENT", "COMPLETE PAYMENT"]
      },
      { 
        name: "Payment Verification", 
        tabs: ["PAYMENT VERIFICATION", "VERIFIED LIST"]
      },
      { name: "Subdealer Commission", tabs: null },
      { name: "Payment Summary", tabs: null },
      { 
        name: "Subdealer Ledger", 
        tabs: ["SUB DEALER", "SUB DEALER UTR"]
      },
      { name: "Customer Ledger", tabs: null },
      { 
        name: "Summary", 
        tabs: ["CUSTOMER", "SUB DEALER", "COMPLETE PAYMENT", "PENDING LIST"]
      }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  },
  "User Management": {
    pages: [
      { name: "Create Role", tabs: null },
      { name: "All Role", tabs: null },
      { name: "Add User", tabs: null },
      { name: "User List", tabs: null },
      { name: "Buffer Report", tabs: null },
      { name: "Manager Deviation", tabs: null }
    ],
    availablePermissions: ["CREATE", "UPDATE", "DELETE", "VIEW"]
  }
};

// Map sidebar module names to API module names
const moduleNameMap = {
  "Dashboard": ["DASHBOARD"],
  "Purchase": ["PURCHASE"],
  "Sales": ["SALES"],
  "Sales Report": ["SALES REPORT", "SALES_REPORT"],
  "Quotation": ["QUOTATION"],
  "Account": ["ACCOUNT"],
  "Insurance": ["INSURANCE"],
  "RTO": ["RTO"],
  "Fund Management": ["FUND MANAGEMENT", "FUND_MANAGEMENT"],
  "Masters": ["MASTERS"],
  // Add this new module mapping
  "BRANCH STOCK AUDIT": ["BRANCH STOCK AUDIT"],
  "Fund Master": ["FUND MASTER", "FUND_MASTER"],
  "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
  "Customers": ["CUSTOMERS"],
  "Subdealer": ["SUBDEALER"],
  "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
  "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
  "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
  "Subdealer Account": ["SUBDEALER ACCOUNT", "SUBDEALER_ACCOUNT"],
  "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
};

// Helper to get permission description
const getPermissionDescription = (module, page, permission) => {
  if (permissionDescriptions[module] && 
      permissionDescriptions[module][page] && 
      permissionDescriptions[module][page][permission]) {
    return permissionDescriptions[module][page][permission];
  }
  return "No description available";
};

// Helper function to get display label for permission based on context
const getPermissionDisplayLabel = (permission, isTab = false) => {
  // Use the same labels for both pages and tabs
  return permissionLabelMap[permission] || permission;
};

// Error boundary component for form sections
const FormErrorBoundary = ({ children, section }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  return hasError ? (
    <CAlert color="danger" className="mt-3">
      <div className="d-flex align-items-center">
        <CIcon icon={cilWarning} className="me-2" />
        <div>
          <strong>Error in {section}</strong>
          <p className="mb-0">{error?.message || 'An unexpected error occurred'}</p>
        </div>
      </div>
    </CAlert>
  ) : (
    <ErrorBoundaryWrapper setHasError={setHasError} setError={setError}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

const ErrorBoundaryWrapper = ({ children, setHasError, setError }) => {
  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Component error:', error);
      setHasError(true);
      setError(error);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, [setHasError, setError]);
  
  return children;
};

function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'employee',
    branch: '',
    subdealer: '',
    roleId: '',
    email: '',
    mobile: '',
    discount: '',
    csd: false,
    branchAccess: 'OWN',
    accessibleBranches: [],
    permissions: [],
    totalDeviationAmount: '',
    perTransactionDeviationLimit: '',
    verticles: [],
    isStockTransferOTP: false // Added new field with default value false
  });

  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [verticles, setVerticles] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPermissions, setShowPermissions] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fetchErrors, setFetchErrors] = useState({
    roles: null,
    branches: null,
    subdealers: null,
    verticles: null,
    permissions: null
  });
  const [activeModule, setActiveModule] = useState(null);
  const [expandedPages, setExpandedPages] = useState({});
  const [pagePermissions, setPagePermissions] = useState({});
  const [tabPermissions, setTabPermissions] = useState({});
  const [mainHeaderAccess, setMainHeaderAccess] = useState({});
  const { refreshPermissions, user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  // Check if logged-in user is a subdealer
  const isLoggedInSubdealer = authUser?.roles?.some(role => role.name === 'SUBDEALER');
  const loggedInUserSubdealerId = authUser?.subdealer?._id;
  const loggedInUserSubdealerName = authUser?.subdealer?.name;

  // Check if logged-in user has SUBDEALER role
  const loggedInUserRole = authUser?.roles?.[0]?.name || '';
  const isLoggedInSubdealerRole = loggedInUserRole === 'SUBDEALER';

  // Error handling utility functions
  const handleApiError = (error, context = 'Operation') => {
    console.error(`${context} error:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response;
      
      if (data && data.message) {
        errorMessage = data.message;
      } else if (status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        errorMessage = 'Resource not found.';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = `Request failed with status ${status}`;
      }
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage;
    }
    
    return errorMessage;
  };

  const showApiErrorAlert = (errorMessage, context = 'Error') => {
    setApiError({
      message: errorMessage,
      context: context,
      timestamp: new Date().toISOString()
    });
    
    // Auto-clear after 10 seconds
    setTimeout(() => {
      setApiError(null);
    }, 10000);
  };

  // Handle role auto-selection when type changes to subdealer
  useEffect(() => {
    if (formData.type === 'subdealer' && roles.length > 0 && !formData.roleId) {
      const subdealerRole = roles.find(role => 
        role.name.toLowerCase() === 'subdealer' || 
        role.name.toLowerCase().includes('subdealer')
      );
      
      if (subdealerRole) {
        setFormData(prev => ({ 
          ...prev, 
          roleId: subdealerRole._id
        }));
        
        // Load permissions for subdealer role
        fetchRolePermissionsData(subdealerRole._id);
        setShowPermissions(true);
      }
    }
  }, [formData.type, roles, formData.roleId]);

  // Also handle when user switches from subdealer back to employee
  useEffect(() => {
    if (formData.type !== 'subdealer' && !id) {
      // For new users, clear role when switching from subdealer to employee
      setFormData(prev => ({ 
        ...prev, 
        roleId: '',
        subdealer: '',
        accessibleBranches: []
      }));
      setShowPermissions(false);
    }
  }, [formData.type, id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.user_id) {
          setFormData(prev => ({
            ...prev,
            created_by: decoded.user_id
          }));
        }
      } catch (error) {
        console.error('Invalid token:', error);
        showApiErrorAlert('Invalid authentication token. Please login again.', 'Authentication');
      }
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchRoles(),
          fetchBranches(),
          fetchSubdealers(),
          fetchVerticles(),
          fetchAllPermissions()
        ]);
        
        if (id) {
          await fetchUser(id);
        }
      } catch (error) {
        const errorMessage = handleApiError(error, 'Initialization');
        showApiErrorAlert(errorMessage, 'Initialization Error');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, [id]);

 const fetchUser = async (userId) => {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    const userData = res.data.data;
    
    if (!userData) {
      throw new Error('User data not found');
    }
    
    // Extract permission IDs from user's permissions array
    let userPermissions = [];
    if (Array.isArray(userData.permissions)) {
      userPermissions = userData.permissions
        .map(p => {
          if (!p) return null;
          if (typeof p === 'string' && p.length > 0) return p;
          if (typeof p === 'object') {
            if (p._id) return p._id;
            if (p.permission) {
              if (typeof p.permission === 'string') return p.permission;
              if (p.permission._id) return p.permission._id;
            }
          }
          return null;
        })
        .filter(id => id !== null && id !== undefined);
    }
    
    // Extract verticle IDs
    let userVerticles = [];
    if (Array.isArray(userData.verticles)) {
      userVerticles = userData.verticles.map(v => v._id || v.id);
    }
    if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
      userVerticles = userData.verticlesDetails.map(v => v._id || v.id);
    }
    
    // Extract role ID
    let userRoleId = '';
    if (Array.isArray(userData.roles) && userData.roles.length > 0) {
      userRoleId = userData.roles[0]._id || '';
    }
    
    // Extract subdealer ID
    let userSubdealerId = '';
    if (userData.subdealer) {
      if (typeof userData.subdealer === 'string') {
        userSubdealerId = userData.subdealer;
      } else if (typeof userData.subdealer === 'object') {
        userSubdealerId = userData.subdealer._id || userData.subdealer.id || '';
      }
    }
    
    // Extract branch ID
    let userBranchId = '';
    if (userData.branch) {
      if (typeof userData.branch === 'string') {
        userBranchId = userData.branch;
      } else if (typeof userData.branch === 'object') {
        userBranchId = userData.branch._id || '';
      }
    }
    
    // Extract accessibleBranches IDs
    let userAccessibleBranches = [];
    if (Array.isArray(userData.accessibleBranches)) {
      userAccessibleBranches = userData.accessibleBranches.map(b => {
        if (typeof b === 'string') return b;
        if (typeof b === 'object') return b._id || b.id || '';
        return '';
      }).filter(id => id !== '');
    }
    
    // Determine user type
    let userType = 'employee';
    if (userData.type === 'subdealer') {
      userType = 'subdealer';
    } else if (userData.subdealer) {
      userType = 'subdealer';
    }
    
    // Extract branchAccess
    let userBranchAccess = userData.branchAccess || 'OWN';
    
    // Extract isStockTransferOTP field - default to false if not present
    let userIsStockTransferOTP = false;
    if (userData.isStockTransferOTP !== undefined) {
      userIsStockTransferOTP = Boolean(userData.isStockTransferOTP);
    }
    
    setFormData({
      name: userData.name || '',
      type: userType,
      branch: userBranchId,
      subdealer: userSubdealerId,
      roleId: userRoleId,
      email: userData.email || '',
      mobile: userData.mobile || '',
      discount: userData.discount !== undefined && userData.discount !== null ? String(userData.discount) : '',
      csd: userData.csd || false,
      branchAccess: userBranchAccess,
      accessibleBranches: userAccessibleBranches,
      permissions: userPermissions,
      totalDeviationAmount: userData.totalDeviationAmount !== undefined && userData.totalDeviationAmount !== null ? String(userData.totalDeviationAmount) : '',
      perTransactionDeviationLimit: userData.perTransactionDeviationLimit !== undefined && userData.perTransactionDeviationLimit !== null ? String(userData.perTransactionDeviationLimit) : '',
      verticles: userVerticles,
      isStockTransferOTP: userIsStockTransferOTP // Set the new field from fetched data
    });

    if (userRoleId) {
      setShowPermissions(true);
      // Only load user permissions, don't merge with role permissions
      await loadUserPermissions(userData, userPermissions);
    }
  } catch (error) {
    const errorMessage = handleApiError(error, 'Fetch User');
    showApiErrorAlert(errorMessage, 'User Fetch Error');
    throw error;
  }
};

 const loadUserPermissions = async (userData, userPermissions = []) => {
  setIsLoadingPermissions(true);
  try {
    // Initialize permissions
    const initialMainHeaderAccess = {};
    const initialPagePermissions = {};
    const initialTabPermissions = {};

    // First, set all to false
    Object.keys(sidebarStructure).forEach(mainHeader => {
      initialMainHeaderAccess[mainHeader] = false;
      
      const headerPages = sidebarStructure[mainHeader].pages;
      headerPages.forEach(page => {
        const pageKey = `${mainHeader}_${page.name}`;
        const pagePerms = {};
        sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
          pagePerms[permType] = false;
        });
        initialPagePermissions[pageKey] = pagePerms;
        
        // Initialize tab permissions
        if (page.tabs && page.tabs.length > 0) {
          page.tabs.forEach(tab => {
            const tabKey = `${mainHeader}_${page.name}_${tab}`;
            const tabPerms = {};
            sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
              tabPerms[permType] = false;
            });
            initialTabPermissions[tabKey] = tabPerms;
          });
        }
      });
    });

    // Set main header access from user's moduleAccess
    if (userData.moduleAccess) {
      Object.keys(userData.moduleAccess).forEach(apiModuleName => {
        const mainHeader = findMainHeaderByModule(apiModuleName);
        if (mainHeader && sidebarStructure[mainHeader]) {
          initialMainHeaderAccess[mainHeader] = Boolean(userData.moduleAccess[apiModuleName]);
        }
      });
    } else {
      // If no moduleAccess in user data, check from user's actual permissions
      userPermissions.forEach(permId => {
        const permission = permissionsList.find(p => p._id === permId);
        if (permission) {
          const mainHeader = findMainHeaderByModule(permission.module);
          if (mainHeader) {
            initialMainHeaderAccess[mainHeader] = true;
          }
        }
      });
    }

    // Set page permissions from user's pageAccess or from actual permissions
    if (userData.pageAccess) {
      Object.keys(userData.pageAccess).forEach(apiModuleName => {
        const mainHeader = findMainHeaderByModule(apiModuleName);
        if (mainHeader && userData.pageAccess[apiModuleName]) {
          Object.keys(userData.pageAccess[apiModuleName]).forEach(pageName => {
            const pageKey = `${mainHeader}_${pageName}`;
            const permissionsArray = userData.pageAccess[apiModuleName][pageName];
            
            if (initialPagePermissions[pageKey]) {
              sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                initialPagePermissions[pageKey][permType] = 
                  Array.isArray(permissionsArray) && 
                  permissionsArray.includes(permType.toUpperCase());
              });
            }
          });
        }
      });
    } else {
      // If no pageAccess in user data, set from actual permissions
      userPermissions.forEach(permId => {
        const permission = permissionsList.find(p => p._id === permId);
        if (permission && !permission.tab) {
          const mainHeader = findMainHeaderByModule(permission.module);
          if (mainHeader) {
            const pageKey = `${mainHeader}_${permission.page}`;
            if (initialPagePermissions[pageKey]) {
              initialPagePermissions[pageKey][permission.action.toUpperCase()] = true;
            }
          }
        }
      });
    }

    // Set tab permissions from user's tabAccess or from actual permissions
    if (userData.tabAccess) {
      Object.keys(userData.tabAccess).forEach(apiModuleName => {
        const mainHeader = findMainHeaderByModule(apiModuleName);
        if (mainHeader && userData.tabAccess[apiModuleName]) {
          Object.keys(userData.tabAccess[apiModuleName]).forEach(pageName => {
            Object.keys(userData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
              const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
              if (!pageConfig) return;
              
              let matchingTab = null;
              if (pageConfig.tabs && pageConfig.tabs.length > 0) {
                matchingTab = pageConfig.tabs.find(tab => 
                  tab.toUpperCase() === tabName.toUpperCase()
                );
                
                if (!matchingTab) {
                  const fuzzyMatches = {
                    'PENDING APPROVALS': 'PENDING APPROVALS',
                    'PENDING APPROVAL': 'PENDING APPROVALS',
                    'APPROVED': 'APPROVED',
                    'PENDING ALLOCATED': 'PENDING ALLOCATED',
                    'ALLOCATED': 'ALLOCATED',
                    'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
                    'CANCELLED BOOKING': 'CANCELLED BOOKING',
                    'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
                    'SUBMITTED': 'SUBMITTED',
                    'REJECTED': 'REJECTED'
                  };
                  
                  const upperTabName = tabName.toUpperCase();
                  if (fuzzyMatches[upperTabName]) {
                    matchingTab = fuzzyMatches[upperTabName];
                  }
                }
              }
              
              if (matchingTab) {
                const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
                const permissions = userData.tabAccess[apiModuleName][pageName][tabName];
                
                if (!initialTabPermissions[tabKey]) {
                  initialTabPermissions[tabKey] = {};
                }
                
                if (Array.isArray(permissions)) {
                  permissions.forEach(perm => {
                    const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
                    initialTabPermissions[tabKey][permKey] = true;
                  });
                }
              }
            });
          });
        }
      });
    } else {
      // If no tabAccess in user data, set from actual permissions
      userPermissions.forEach(permId => {
        const permission = permissionsList.find(p => p._id === permId);
        if (permission && permission.tab) {
          const mainHeader = findMainHeaderByModule(permission.module);
          if (mainHeader) {
            const tabKey = `${mainHeader}_${permission.page}_${permission.tab}`;
            if (!initialTabPermissions[tabKey]) {
              initialTabPermissions[tabKey] = {};
            }
            initialTabPermissions[tabKey][permission.action.toUpperCase()] = true;
          }
        }
      });
    }

    setMainHeaderAccess(initialMainHeaderAccess);
    setPagePermissions(initialPagePermissions);
    setTabPermissions(initialTabPermissions);

  } catch (error) {
    const errorMessage = handleApiError(error, 'Load Permissions');
    showApiErrorAlert(errorMessage, 'Permissions Load Error');
    throw error;
  } finally {
    setIsLoadingPermissions(false);
  }
};

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles');
      setRoles(response.data.data || []);
      setFetchErrors(prev => ({ ...prev, roles: null }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Fetch Roles');
      setFetchErrors(prev => ({ ...prev, roles: errorMessage }));
      throw error;
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
      setFetchErrors(prev => ({ ...prev, branches: null }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Fetch Branches');
      setFetchErrors(prev => ({ ...prev, branches: errorMessage }));
      throw error;
    }
  };

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data?.subdealers || []);
      setFetchErrors(prev => ({ ...prev, subdealers: null }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Fetch Subdealers');
      setFetchErrors(prev => ({ ...prev, subdealers: errorMessage }));
      throw error;
    }
  };

  const fetchVerticles = async () => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setVerticles(verticlesData);
      setFetchErrors(prev => ({ ...prev, verticles: null }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Fetch Verticles');
      setFetchErrors(prev => ({ ...prev, verticles: errorMessage }));
      throw error;
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const res = await axiosInstance.get('/roles/permissions');
      setPermissionsList(res.data.data || []);
      setFetchErrors(prev => ({ ...prev, permissions: null }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Fetch Permissions');
      setFetchErrors(prev => ({ ...prev, permissions: errorMessage }));
      throw error;
    }
  };

const fetchRolePermissionsData = async (roleId) => {
  if (!roleId) return;
  
  setIsLoadingPermissions(true);
  try {
    const res = await axiosInstance.get(`/roles/${roleId}`);
    const roleData = res.data.data;

    if (!roleData) {
      throw new Error('Role data not found');
    }

    // Only initialize if it's a new user (not editing)
    if (!id) {
      const initialMainHeaderAccess = {};
      const initialPagePermissions = {};
      const initialTabPermissions = {};

      // First, set all to false
      Object.keys(sidebarStructure).forEach(mainHeader => {
        initialMainHeaderAccess[mainHeader] = false;
        
        const headerPages = sidebarStructure[mainHeader].pages;
        headerPages.forEach(page => {
          const pageKey = `${mainHeader}_${page.name}`;
          const pagePerms = {};
          sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
            pagePerms[permType] = false;
          });
          initialPagePermissions[pageKey] = pagePerms;
          
          if (page.tabs && page.tabs.length > 0) {
            page.tabs.forEach(tab => {
              const tabKey = `${mainHeader}_${page.name}_${tab}`;
              const tabPerms = {};
              sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                tabPerms[permType] = false;
              });
              initialTabPermissions[tabKey] = tabPerms;
            });
          }
        });
      });

      // Now populate with role data
      if (roleData.moduleAccess) {
        Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
          const mainHeader = findMainHeaderByModule(apiModuleName);
          if (mainHeader && sidebarStructure[mainHeader]) {
            initialMainHeaderAccess[mainHeader] = Boolean(roleData.moduleAccess[apiModuleName]);
          }
        });
      }

      if (roleData.pageAccess) {
        Object.keys(roleData.pageAccess).forEach(apiModuleName => {
          const mainHeader = findMainHeaderByModule(apiModuleName);
          if (mainHeader && roleData.pageAccess[apiModuleName]) {
            Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
              const pageKey = `${mainHeader}_${pageName}`;
              const permissionsArray = roleData.pageAccess[apiModuleName][pageName];
              
              if (initialPagePermissions[pageKey]) {
                sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                  const hasPermission = Array.isArray(permissionsArray) && 
                    permissionsArray.includes(permType.toUpperCase());
                  
                  initialPagePermissions[pageKey][permType] = hasPermission;
                });
              }
            });
          }
        });
      }

      // Process tab access
      if (roleData.tabAccess) {
        Object.keys(roleData.tabAccess).forEach(apiModuleName => {
          const mainHeader = findMainHeaderByModule(apiModuleName);
          if (mainHeader && roleData.tabAccess[apiModuleName]) {
            Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
              Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
                const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
                if (!pageConfig) return;
                
                let matchingTab = null;
                if (pageConfig.tabs && pageConfig.tabs.length > 0) {
                  matchingTab = pageConfig.tabs.find(tab => 
                    tab.toUpperCase() === tabName.toUpperCase()
                  );
                  
                  if (!matchingTab) {
                    const fuzzyMatches = {
                      'PENDING APPROVALS': 'PENDING APPROVALS',
                      'PENDING APPROVAL': 'PENDING APPROVALS',
                      'APPROVED': 'APPROVED',
                      'PENDING ALLOCATED': 'PENDING ALLOCATED',
                      'ALLOCATED': 'ALLOCATED',
                      'REJECTED DISCOUNT': 'REJECTED DISCOUNT',
                      'CANCELLED BOOKING': 'CANCELLED BOOKING',
                      'REJECTED CANCELLED BOOKING': 'REJECTED CANCELLED BOOKING',
                      'SUBMITTED': 'SUBMITTED',
                      'REJECTED': 'REJECTED'
                    };
                    
                    const upperTabName = tabName.toUpperCase();
                    if (fuzzyMatches[upperTabName]) {
                      matchingTab = fuzzyMatches[upperTabName];
                    }
                  }
                }
                
                if (matchingTab) {
                  const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
                  const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                  
                  if (!initialTabPermissions[tabKey]) {
                    initialTabPermissions[tabKey] = {};
                  }
                  
                  if (Array.isArray(permissions)) {
                    permissions.forEach(perm => {
                      const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
                      initialTabPermissions[tabKey][permKey] = true;
                    });
                  }
                }
              });
            });
          }
        });
      }

      // Also get permission IDs from role
      let rolePermissionIds = [];
      if (Array.isArray(roleData.permissions) && roleData.permissions.length > 0) {
        roleData.permissions.forEach(perm => {
          const permId = typeof perm === 'string' ? perm : (perm._id || perm.id);
          if (permId && !rolePermissionIds.includes(permId)) {
            rolePermissionIds.push(permId);
          }
        });
      }

      setMainHeaderAccess(initialMainHeaderAccess);
      setPagePermissions(initialPagePermissions);
      setTabPermissions(initialTabPermissions);
      
      // Set the formData permissions with role permissions for new user only
      setFormData(prev => ({
        ...prev,
        permissions: rolePermissionIds
      }));
    }
  } catch (error) {
    const errorMessage = handleApiError(error, 'Fetch Role Permissions');
    showApiErrorAlert(errorMessage, 'Role Permissions Error');
    throw error;
  } finally {
    setIsLoadingPermissions(false);
  }
};

  // Helper to find main header by module name
  const findMainHeaderByModule = (moduleName) => {
    if (!moduleName) return null;
    
    const moduleUpper = moduleName.toUpperCase();
    for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
      if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
        return mainHeader;
      }
    }
    
    for (const mainHeader of Object.keys(sidebarStructure)) {
      if (mainHeader.toUpperCase() === moduleUpper) {
        return mainHeader;
      }
    }
    
    return null;
  };

  // Helper to find subdealer role
  const findSubdealerRole = () => {
    if (!roles || roles.length === 0) return null;
    
    return roles.find(role => 
      role.name.toLowerCase() === 'subdealer' || 
      role.name.toLowerCase().includes('subdealer')
    );
  };

  // Helper to extract permission IDs from current visual state
const extractPermissionIdsFromState = () => {
  const permissionIds = [];
  
  Object.keys(mainHeaderAccess).forEach(mainHeader => {
    if (mainHeaderAccess[mainHeader]) {
      const apiModuleNames = moduleNameMap[mainHeader];
      
      sidebarStructure[mainHeader].pages.forEach(page => {
        const pageKey = `${mainHeader}_${page.name}`;
        const pagePerms = pagePermissions[pageKey] || {};
        
        // Add page permission IDs
        Object.keys(pagePerms).forEach(permType => {
          if (pagePerms[permType]) {
            const permission = permissionsList.find(perm => 
              apiModuleNames.some(apiModuleName => 
                perm.module.toUpperCase() === apiModuleName.toUpperCase()
              ) && 
              perm.page === page.name && 
              perm.action === permType.toUpperCase() &&
              !perm.tab
            );
            
            if (permission) {
              permissionIds.push(permission._id);
            }
          }
        });
        
        // Add tab permission IDs
        if (page.tabs && page.tabs.length > 0) {
          page.tabs.forEach(tab => {
            const tabKey = `${mainHeader}_${page.name}_${tab}`;
            const tabPerms = tabPermissions[tabKey] || {};
            
            Object.keys(tabPerms).forEach(permType => {
              if (tabPerms[permType]) {
                const permission = permissionsList.find(perm => 
                  apiModuleNames.some(apiModuleName => 
                    perm.module.toUpperCase() === apiModuleName.toUpperCase()
                  ) && 
                  perm.page === page.name && 
                  perm.action === permType.toUpperCase() &&
                  perm.tab === tab
                );
                
                if (permission) {
                  permissionIds.push(permission._id);
                }
              }
            });
          });
        }
      });
    }
  });
  
  return [...new Set(permissionIds)]; // Remove duplicates
};

 const handleChange = async (e) => {
  const { name, value, type, checked } = e.target;
  
  try {
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // For select dropdowns, convert string 'true'/'false' to boolean for isStockTransferOTP
      if (name === 'isStockTransferOTP') {
        setFormData(prev => ({ ...prev, [name]: value === 'true' }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
    
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'roleId') {
      setShowPermissions(true);
      
      // For new users, clear existing permissions when selecting a new role
      if (!id) {
        setFormData(prev => ({ 
          ...prev, 
          permissions: [] 
        }));
      }
      
      // Fetch role permissions (won't affect existing user's permissions)
      await fetchRolePermissionsData(value);
    }

    if (name === 'type') {
      if (value === 'subdealer') {
        const subdealerRole = findSubdealerRole();
        if (subdealerRole) {
          // Auto-select logged-in user's subdealer if they are a subdealer
          let selectedSubdealer = '';
          if (isLoggedInSubdealer && loggedInUserSubdealerId) {
            selectedSubdealer = loggedInUserSubdealerId;
          }
          
          setFormData(prev => ({ 
            ...prev, 
            type: value,
            roleId: subdealerRole._id,
            subdealer: selectedSubdealer,
            branch: '', // Clear branch for subdealer
            permissions: []
          }));
          await fetchRolePermissionsData(subdealerRole._id);
          setShowPermissions(true);
        }
      } else {
        setFormData(prev => ({ 
          ...prev, 
          type: value,
          roleId: '',
          subdealer: '',
          accessibleBranches: [],
          permissions: [] // Clear permissions when switching from subdealer
        }));
        setShowPermissions(false);
      }
    }
    
    // Clear accessibleBranches when branchAccess is not ASSIGNED
    if (name === 'branchAccess' && value !== 'ASSIGNED') {
      setFormData(prev => ({ ...prev, accessibleBranches: [] }));
    }
  } catch (error) {
    const errorMessage = handleApiError(error, 'Handle Change');
    showApiErrorAlert(errorMessage, 'Form Change Error');
  }
};

  const handleVerticalChange = (e) => {
    try {
      const selectedId = e.target.value;
      if (selectedId && !formData.verticles.includes(selectedId)) {
        setFormData(prev => ({
          ...prev,
          verticles: [...prev.verticles, selectedId]
        }));
      }
      setErrors(prev => ({ ...prev, verticles: '' }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Handle Vertical Change');
      showApiErrorAlert(errorMessage, 'Vertical Selection Error');
    }
  };

  const handleAccessibleBranchChange = (e) => {
    try {
      const selectedId = e.target.value;
      if (selectedId && !formData.accessibleBranches.includes(selectedId)) {
        setFormData(prev => ({
          ...prev,
          accessibleBranches: [...prev.accessibleBranches, selectedId]
        }));
      }
      setErrors(prev => ({ ...prev, accessibleBranches: '' }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Handle Accessible Branch Change');
      showApiErrorAlert(errorMessage, 'Branch Selection Error');
    }
  };

  const removeVertical = (verticalId) => {
    try {
      setFormData(prev => {
        const newVerticles = prev.verticles.filter(id => id !== verticalId);
        return {
          ...prev,
          verticles: newVerticles
        };
      });
    } catch (error) {
      const errorMessage = handleApiError(error, 'Remove Vertical');
      showApiErrorAlert(errorMessage, 'Vertical Removal Error');
    }
  };

  const removeAccessibleBranch = (branchId) => {
    try {
      setFormData(prev => {
        const newBranches = prev.accessibleBranches.filter(id => id !== branchId);
        return {
          ...prev,
          accessibleBranches: newBranches
        };
      });
    } catch (error) {
      const errorMessage = handleApiError(error, 'Remove Accessible Branch');
      showApiErrorAlert(errorMessage, 'Branch Removal Error');
    }
  };

  const togglePageExpansion = (pageKey) => {
    try {
      setExpandedPages(prev => ({
        ...prev,
        [pageKey]: !prev[pageKey]
      }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Toggle Page Expansion');
      showApiErrorAlert(errorMessage, 'UI Error');
    }
  };

  // Check if a permission exists in the system
  const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
    try {
      const apiModuleNames = moduleNameMap[mainHeader];
      if (!apiModuleNames || !apiModuleNames.length) return false;
      
      return permissionsList.some(perm => 
        apiModuleNames.some(apiModuleName => 
          perm.module.toUpperCase() === apiModuleName.toUpperCase()
        ) && 
        perm.page === page && 
        perm.action === permissionType.toUpperCase() &&
        ((tab === null && !perm.tab) || (tab !== null && perm.tab === tab))
      );
    } catch (error) {
      console.error('Error checking permission existence:', error);
      return false;
    }
  };

  // Get all tab permissions that exist in API for a page
  const getAvailableTabsForPage = (mainHeader, page) => {
    try {
      const apiModuleNames = moduleNameMap[mainHeader];
      if (!apiModuleNames || !apiModuleNames.length) return [];
      
      const tabs = new Set();
      permissionsList.forEach(perm => {
        if (apiModuleNames.some(apiModuleName => 
          perm.module.toUpperCase() === apiModuleName.toUpperCase()
        ) && 
        perm.page === page && 
        perm.tab) {
          tabs.add(perm.tab);
        }
      });
      
      return Array.from(tabs);
    } catch (error) {
      console.error('Error getting available tabs:', error);
      return [];
    }
  };

  // Handle page permission change
const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
  try {
    const pageKey = `${mainHeader}_${page}`;
    
    // Update page permissions
    setPagePermissions(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [permissionType]: value
      }
    }));

    const apiModuleNames = moduleNameMap[mainHeader];
    const permission = permissionsList.find(perm => 
      apiModuleNames.some(apiModuleName => 
        perm.module.toUpperCase() === apiModuleName.toUpperCase()
      ) && 
      perm.page === page && 
      perm.action === permissionType.toUpperCase() &&
      !perm.tab
    );

    // Handle form data update for page permission
    if (permission) {
      setFormData(prev => {
        if (value) {
          if (!prev.permissions.includes(permission._id)) {
            return { ...prev, permissions: [...prev.permissions, permission._id] };
          }
        } else {
          return { 
            ...prev, 
            permissions: prev.permissions.filter(id => id !== permission._id) 
          };
        }
        return prev;
      });
    }

    // If unchecking a permission, also uncheck the same permission for all tabs
    if (!value) {
      const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === page);
      if (pageConfig?.tabs && pageConfig.tabs.length > 0) {
        pageConfig.tabs.forEach(tab => {
          const tabKey = `${mainHeader}_${page}_${tab}`;
          
          // Update tab permissions
          setTabPermissions(prev => ({
            ...prev,
            [tabKey]: {
              ...prev[tabKey],
              [permissionType]: false
            }
          }));

          // Remove tab permission from form data
          const tabPermission = permissionsList.find(perm => 
            apiModuleNames.some(apiModuleName => 
              perm.module.toUpperCase() === apiModuleName.toUpperCase()
            ) && 
            perm.page === page && 
            perm.action === permissionType.toUpperCase() &&
            perm.tab === tab
          );

          if (tabPermission) {
            setFormData(prev => ({
              ...prev,
              permissions: prev.permissions.filter(id => id !== tabPermission._id)
            }));
          }
        });
      }
    }
  } catch (error) {
    const errorMessage = handleApiError(error, 'Page Permission Change');
    showApiErrorAlert(errorMessage, 'Permission Error');
  }
};

  // Handle tab permission change
  const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
    try {
      const tabKey = `${mainHeader}_${page}_${tab}`;
      setTabPermissions(prev => ({
        ...prev,
        [tabKey]: {
          ...prev[tabKey],
          [permissionType]: value
        }
      }));

      const apiModuleNames = moduleNameMap[mainHeader];
      const permission = permissionsList.find(perm => 
        apiModuleNames.some(apiModuleName => 
          perm.module.toUpperCase() === apiModuleName.toUpperCase()
        ) && 
        perm.page === page && 
        perm.action === permissionType.toUpperCase() &&
        perm.tab === tab
      );

      if (permission) {
        setFormData(prev => {
          if (value) {
            if (!prev.permissions.includes(permission._id)) {
              return { ...prev, permissions: [...prev.permissions, permission._id] };
            }
          } else {
            return { 
              ...prev, 
              permissions: prev.permissions.filter(id => id !== permission._id) 
            };
          }
          return prev;
        });
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Tab Permission Change');
      showApiErrorAlert(errorMessage, 'Permission Error');
    }
  };

  // Handle select all permissions for a page
  const handleSelectAllPagePermissions = (mainHeader, page) => {
    try {
      const pageKey = `${mainHeader}_${page}`;
      const apiModuleNames = moduleNameMap[mainHeader];
      const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
      const newPagePerms = {};
      const newPermissionIds = [...formData.permissions];
      
      availablePermissions.forEach(permType => {
        const permissionExists = checkPermissionExists(mainHeader, page, permType, null);
        if (permissionExists) {
          newPagePerms[permType] = true;
          
          const permission = permissionsList.find(perm => 
            apiModuleNames.some(apiModuleName => 
              perm.module.toUpperCase() === apiModuleName.toUpperCase()
            ) && 
            perm.page === page && 
            perm.action === permType.toUpperCase() &&
            !perm.tab
          );
          
          if (permission && !newPermissionIds.includes(permission._id)) {
            newPermissionIds.push(permission._id);
          }
        } else {
          newPagePerms[permType] = false;
        }
      });
      
      setPagePermissions(prev => ({
        ...prev,
        [pageKey]: newPagePerms
      }));
      
      setFormData(prev => ({
        ...prev,
        permissions: newPermissionIds
      }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Select All Page Permissions');
      showApiErrorAlert(errorMessage, 'Permission Error');
    }
  };

  // Handle clear all permissions for a page
  const handleClearAllPagePermissions = (mainHeader, page) => {
    try {
      const pageKey = `${mainHeader}_${page}`;
      const apiModuleNames = moduleNameMap[mainHeader];
      const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
      const newPagePerms = {};
      let newPermissionIds = [...formData.permissions];
      
      availablePermissions.forEach(permType => {
        newPagePerms[permType] = false;
        
        const permission = permissionsList.find(perm => 
          apiModuleNames.some(apiModuleName => 
            perm.module.toUpperCase() === apiModuleName.toUpperCase()
          ) && 
          perm.page === page && 
          perm.action === permType.toUpperCase() &&
          !perm.tab
        );
        
        if (permission) {
          newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
        }
      });
      
      setPagePermissions(prev => ({
        ...prev,
        [pageKey]: newPagePerms
      }));
      
      setFormData(prev => ({
        ...prev,
        permissions: newPermissionIds
      }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Clear All Page Permissions');
      showApiErrorAlert(errorMessage, 'Permission Error');
    }
  };

  // Handle select all tab permissions
  const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
    try {
      const tabKey = `${mainHeader}_${page}_${tab}`;
      const apiModuleNames = moduleNameMap[mainHeader];
      const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
      const newPerms = {};
      const newPermissionIds = [...formData.permissions];
      
      availablePermissions.forEach(perm => {
        const exists = checkPermissionExists(mainHeader, page, perm, tab);
        // Select all available permissions for tabs
        newPerms[perm] = exists;
        
        if (exists) {
          const permission = permissionsList.find(p => 
            apiModuleNames.some(apiModuleName => 
              p.module.toUpperCase() === apiModuleName.toUpperCase()
            ) && 
            p.page === page && 
            p.action === perm.toUpperCase() &&
            p.tab === tab
          );
          
          if (permission && !newPermissionIds.includes(permission._id)) {
            newPermissionIds.push(permission._id);
          }
        }
      });
      
      setTabPermissions(prev => ({
        ...prev,
        [tabKey]: newPerms
      }));
      
      setFormData(prev => ({
        ...prev,
        permissions: newPermissionIds
      }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Select All Tab Permissions');
      showApiErrorAlert(errorMessage, 'Permission Error');
    }
  };

  // Handle clear all tab permissions
  const handleClearAllTabPermissions = (mainHeader, page, tab) => {
    try {
      const tabKey = `${mainHeader}_${page}_${tab}`;
      const apiModuleNames = moduleNameMap[mainHeader];
      
      const newPerms = {};
      let newPermissionIds = [...formData.permissions];
      
      sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
        newPerms[perm] = false;
        
        const permission = permissionsList.find(p => 
          apiModuleNames.some(apiModuleName => 
            p.module.toUpperCase() === apiModuleName.toUpperCase()
          ) && 
          p.page === page && 
          p.action === perm.toUpperCase() &&
          p.tab === tab
        );
        
        if (permission) {
          newPermissionIds = newPermissionIds.filter(id => id !== permission._id);
        }
      });
      
      setTabPermissions(prev => ({
        ...prev,
        [tabKey]: newPerms
      }));
      
      setFormData(prev => ({
        ...prev,
        permissions: newPermissionIds
      }));
    } catch (error) {
      const errorMessage = handleApiError(error, 'Clear All Tab Permissions');
      showApiErrorAlert(errorMessage, 'Permission Error');
    }
  };

  // Handle global actions for the three buttons
  const handleGlobalAction = (actionType) => {
    try {
      switch (actionType) {
        case 'none':
          setFormData(prev => ({ ...prev, permissions: [] }));
          
          const clearedPagePermissions = {};
          const clearedTabPermissions = {};
          Object.keys(sidebarStructure).forEach(mainHeader => {
            sidebarStructure[mainHeader].pages.forEach(page => {
              const pageKey = `${mainHeader}_${page.name}`;
              const pagePerms = {};
              sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                pagePerms[permType] = false;
              });
              clearedPagePermissions[pageKey] = pagePerms;
              
              if (page.tabs && page.tabs.length > 0) {
                page.tabs.forEach(tab => {
                  const tabKey = `${mainHeader}_${page.name}_${tab}`;
                  const tabPerms = {};
                  sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                    tabPerms[permType] = false;
                  });
                  clearedTabPermissions[tabKey] = tabPerms;
                });
              }
            });
          });
          setPagePermissions(clearedPagePermissions);
          setTabPermissions(clearedTabPermissions);
          break;
          
        case 'selectAll':
          const allPermissionIds = permissionsList.map(perm => perm._id);
          setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
          
          const allPagePermissions = {};
          const allTabPermissions = {};
          Object.keys(sidebarStructure).forEach(mainHeader => {
            sidebarStructure[mainHeader].pages.forEach(page => {
              const pageKey = `${mainHeader}_${page.name}`;
              const pagePerms = {};
              sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
              });
              allPagePermissions[pageKey] = pagePerms;
              
              if (page.tabs && page.tabs.length > 0) {
                page.tabs.forEach(tab => {
                  const tabKey = `${mainHeader}_${page.name}_${tab}`;
                  const tabPerms = {};
                  sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                    tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
                  });
                  allTabPermissions[tabKey] = tabPerms;
                });
              }
            });
          });
          setPagePermissions(allPagePermissions);
          setTabPermissions(allTabPermissions);
          break;
          
        case 'viewOnly':
          const viewPermissionIds = permissionsList
            .filter(perm => perm.action === 'VIEW' || perm.action === 'READ')
            .map(perm => perm._id);
          setFormData(prev => ({ ...prev, permissions: viewPermissionIds }));
          
          const viewPagePermissions = {};
          const viewTabPermissions = {};
          Object.keys(sidebarStructure).forEach(mainHeader => {
            sidebarStructure[mainHeader].pages.forEach(page => {
              const pageKey = `${mainHeader}_${page.name}`;
              const pagePerms = {};
              sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                if (permType === 'VIEW') {
                  pagePerms[permType] = checkPermissionExists(mainHeader, page.name, permType, null);
                } else {
                  pagePerms[permType] = false;
                }
              });
              viewPagePermissions[pageKey] = pagePerms;
              
              if (page.tabs && page.tabs.length > 0) {
                page.tabs.forEach(tab => {
                  const tabKey = `${mainHeader}_${page.name}_${tab}`;
                  const tabPerms = {};
                  sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                    if (permType === 'VIEW') {
                      tabPerms[permType] = checkPermissionExists(mainHeader, page.name, permType, tab);
                    } else {
                      tabPerms[permType] = false;
                    }
                  });
                  viewTabPermissions[tabKey] = tabPerms;
                });
              }
            });
          });
          setPagePermissions(viewPagePermissions);
          setTabPermissions(viewTabPermissions);
          break;
          
        default:
          break;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Global Permission Action');
      showApiErrorAlert(errorMessage, 'Permission Error');
    }
  };

  // Handle main header access change
  const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
    try {
      setMainHeaderAccess(prev => ({
        ...prev,
        [mainHeader]: hasAccess
      }));

      if (!hasAccess) {
        const newPagePermissions = { ...pagePermissions };
        const newTabPermissions = { ...tabPermissions };
        
        sidebarStructure[mainHeader].pages.forEach(page => {
          const pageKey = `${mainHeader}_${page.name}`;
          const perms = {};
          sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
            perms[perm] = false;
          });
          newPagePermissions[pageKey] = perms;
          
          if (page.tabs && page.tabs.length > 0) {
            page.tabs.forEach(tab => {
              const tabKey = `${mainHeader}_${page.name}_${tab}`;
              const tabPerms = {};
              sidebarStructure[mainHeader].availablePermissions.forEach(perm => {
                tabPerms[perm] = false;
              });
              newTabPermissions[tabKey] = tabPerms;
            });
          }
        });
        
        setPagePermissions(newPagePermissions);
        setTabPermissions(newTabPermissions);
        
        const apiModuleNames = moduleNameMap[mainHeader];
        const modulePermissions = permissionsList.filter(perm => 
          apiModuleNames.some(apiModuleName => 
            perm.module.toUpperCase() === apiModuleName.toUpperCase()
          )
        );
        const modulePermissionIds = modulePermissions.map(perm => perm._id);
        
        setFormData(prev => ({
          ...prev,
          permissions: prev.permissions.filter(id => !modulePermissionIds.includes(id))
        }));
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Main Header Access Change');
      showApiErrorAlert(errorMessage, 'Access Control Error');
    }
  };

  // Render permission guide modal
  const renderPermissionGuideModal = () => {
    return (
      <CModal 
        visible={showPermissionGuide} 
        onClose={() => setShowPermissionGuide(false)}
        size="xl"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>Permissions Guide - What Each Permission Allows</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="permission-guide-container">
            {Object.keys(sidebarStructure)
              .filter(module => module !== "Dashboard")
              .map((module) => (
                <div key={module} className="mb-4">
                  <h5 className="text-primary mb-3">{module}</h5>
                  {sidebarStructure[module].pages.map((page) => (
                    <CCard key={page.name} className="mb-3">
                      <CCardBody>
                        <h6 className="mb-3">{page.name}</h6>
                        <div className="row">
                          {sidebarStructure[module].availablePermissions.map((permission) => {
                            const description = getPermissionDescription(module, page.name, permission);
                            return (
                              <div key={permission} className="col-md-6 mb-2">
                                <div className="d-flex align-items-start">
                                  <CBadge 
                                    color={
                                      permission === "CREATE" ? "success" :
                                      permission === "VIEW" ? "info" :
                                      permission === "UPDATE" ? "warning" :
                                      "danger"
                                    }
                                    className="me-2"
                                    style={{ minWidth: '70px' }}
                                  >
                                    {permissionLabelMap[permission] || permission}
                                  </CBadge>
                                  <div>
                                    <strong>{getPermissionDisplayLabel(permission, false)}</strong>
                                    <div className="text-muted small">{description}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Tab permissions if available */}
                        {page.tabs && page.tabs.length > 0 && (
                          <div className="mt-3">
                            <div className="text-muted small mb-2">Available tabs for this page:</div>
                            <div className="d-flex flex-wrap gap-2">
                              {page.tabs.map((tab) => (
                                <CBadge key={tab} color="secondary" className="px-2 py-1">
                                  {tab}
                                </CBadge>
                              ))}
                            </div>
                            <div className="text-muted small mt-2">
                              * Tab permissions inherit page permissions with specific access control
                            </div>
                          </div>
                        )}
                      </CCardBody>
                    </CCard>
                  ))}
                </div>
              ))}
            
            {/* Legend */}
            <CCard className="mt-4">
              <CCardBody>
                <h6 className="mb-3">Permission Legend</h6>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <div className="d-flex align-items-center">
                      <CBadge color="success" className="me-2">CREATE</CBadge>
                      <span>Add new records</span>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="d-flex align-items-center">
                      <CBadge color="info" className="me-2">VIEW</CBadge>
                      <span>View/read records</span>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="d-flex align-items-center">
                      <CBadge color="warning" className="me-2">UPDATE</CBadge>
                      <span>Edit/modify records</span>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="d-flex align-items-center">
                      <CBadge color="danger" className="me-2">DELETE</CBadge>
                      <span>Remove records</span>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPermissionGuide(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  // Render permissions table for a page
  const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
    try {
      const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
      const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
      const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
      // For tabs, show ALL available permissions, not just VIEW
      const displayPermissions = availablePermissions;
      
      return (
        <CTable bordered responsive hover small className="permission-table mt-2">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell scope="col" className="text-nowrap">
                {isTab ? `Tab: ${tabName}` : `Page: ${page}`}
              </CTableHeaderCell>
              {displayPermissions.map((perm) => (
                <CTableHeaderCell key={perm} scope="col" className="text-center text-nowrap">
                  {getPermissionDisplayLabel(perm, isTab)}
                </CTableHeaderCell>
              ))}
              <CTableHeaderCell scope="col" className="text-center text-nowrap">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>
                <strong>{isTab ? tabName : page}</strong>
              </CTableDataCell>
              {displayPermissions.map((perm) => {
                const permissionExists = checkPermissionExists(mainHeader, page, perm, isTab ? tabName : null);
                const isChecked = permissions[perm] || false;
                
                return (
                  <CTableDataCell key={`${pageKey}-${perm}`} className="text-center">
                    {permissionExists ? (
                      <CFormCheck
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (isTab) {
                            handleTabPermissionChange(mainHeader, page, tabName, perm, e.target.checked);
                          } else {
                            handlePagePermissionChange(mainHeader, page, perm, e.target.checked);
                          }
                        }}
                        aria-label={`${page}-${perm}`}
                        title={`${getPermissionDisplayLabel(perm, isTab)} permission for ${isTab ? `${page} - ${tabName}` : page}`}
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
                    onClick={() => {
                      if (isTab) {
                        handleSelectAllTabPermissions(mainHeader, page, tabName);
                      } else {
                        handleSelectAllPagePermissions(mainHeader, page);
                      }
                    }}
                    title="Select all available permissions"
                  >
                    All
                  </CButton>
                  <CButton 
                    color="secondary" 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (isTab) {
                        handleClearAllTabPermissions(mainHeader, page, tabName);
                      } else {
                        handleClearAllPagePermissions(mainHeader, page);
                      }
                    }}
                    title="Clear all permissions"
                  >
                    None
                  </CButton>
                </CButtonGroup>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      );
    } catch (error) {
      console.error('Error rendering permissions table:', error);
      return (
        <CAlert color="danger">
          Error rendering permissions table. Please refresh the page.
        </CAlert>
      );
    }
  };

  const validateForm = () => {
    try {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.type) newErrors.type = 'Type is required';
      
      if (formData.type === 'employee') {
        if (!formData.branch) newErrors.branch = 'Branch is required for employee';
        if (!formData.roleId) newErrors.roleId = 'Role is required for employee';
      }
      
      if (formData.type === 'subdealer') {
        if (!formData.subdealer) newErrors.subdealer = 'Subdealer is required';
        // Role is auto-selected for subdealer, so no validation needed
        
        // Validate accessibleBranches if branchAccess is ASSIGNED
        if (formData.branchAccess === 'ASSIGNED' && formData.accessibleBranches.length === 0) {
          newErrors.accessibleBranches = 'At least one branch must be selected when Branch Access is ASSIGNED';
        }
      }
      
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
      
      // Only validate discount if user type is NOT subdealer AND logged-in user is not SUBDEALER
      if (formData.type !== 'subdealer' && !isLoggedInSubdealerRole && !formData.discount) {
        newErrors.discount = 'Discount is required';
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Mobile validation (basic)
      const mobileRegex = /^[0-9]{10}$/;
      if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
      
      const selectedRole = roles.find(role => role._id === formData.roleId);
      if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
        if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
        if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
        
        // Validate numeric values
        if (formData.totalDeviationAmount && isNaN(parseFloat(formData.totalDeviationAmount))) {
          newErrors.totalDeviationAmount = 'Please enter a valid number';
        }
        if (formData.perTransactionDeviationLimit && isNaN(parseFloat(formData.perTransactionDeviationLimit))) {
          newErrors.perTransactionDeviationLimit = 'Please enter a valid number';
        }
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Form Validation');
      showApiErrorAlert(errorMessage, 'Validation Error');
      return false;
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsLoading(true);
  
  try {
    // Sync permissions from visual state to formData
    const syncedPermissionIds = extractPermissionIdsFromState();
    
    // Filter out null/undefined values from permissions
    const validPermissions = [...new Set([...syncedPermissionIds, ...formData.permissions])].filter(perm => 
      perm !== null && perm !== undefined && perm !== ''
    );
    
    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      roles: formData.roleId,
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      csd: formData.csd,
      branchAccess: formData.branchAccess,
      permissions: validPermissions,
      verticles: formData.verticles,
      isStockTransferOTP: formData.isStockTransferOTP, // Added new field
      ...(formData.discount !== '' && { discount: Number(formData.discount) }),
      ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
      ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
      ...(formData.totalDeviationAmount !== '' && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
      ...(formData.perTransactionDeviationLimit !== '' && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
    };

    // Add accessibleBranches if branchAccess is ASSIGNED and accessibleBranches is not empty
    if (formData.branchAccess === 'ASSIGNED' && formData.accessibleBranches.length > 0) {
      payload.accessibleBranches = formData.accessibleBranches;
    }

    console.log('Submitting payload:', payload);
    console.log('Permission count:', validPermissions.length);
    console.log('isStockTransferOTP:', formData.isStockTransferOTP);

    if (id) {
      await axiosInstance.put(`/users/${id}`, payload);
      await refreshPermissions();
      await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
    } else {
      await axiosInstance.post('/auth/register', payload);
      await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
    }
  } catch (error) {
    const errorMessage = handleApiError(error, 'Submit Form');
    
    // Show detailed error in alert
    showApiErrorAlert(errorMessage, 'Submission Error');
    
    // Also show the sweet alert for form submission errors
    showFormSubmitError(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = () => {
    navigate('/users/users-list');
  };

  const selectedRole = roles.find(role => role._id === formData.roleId);
  const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  
  // Check if the selected role is SALES_EXECUTIVE
  const isSalesExecutiveRole = selectedRole && selectedRole.name && selectedRole.name.toUpperCase() === 'SALES_EXECUTIVE';
  
  const getSelectedVerticalNames = () => {
    return formData.verticles.map(item => {
      const verticalId = typeof item === 'object' ? (item._id || item.id) : item;
      const vertical = verticles.find(v => 
        v._id === verticalId || v.id === verticalId
      );
      return vertical ? vertical.name || String(verticalId) : String(verticalId);
    });
  };

  const getSelectedAccessibleBranchNames = () => {
    return formData.accessibleBranches.map(item => {
      const branchId = typeof item === 'object' ? (item._id || item.id) : item;
      const branch = branches.find(b => 
        b._id === branchId || b.id === branchId
      );
      return branch ? branch.name || String(branchId) : String(branchId);
    });
  };

  // Get the selected subdealer name for display
  const getSelectedSubdealerName = () => {
    if (!formData.subdealer) return '';
    
    const subdealer = subdealers.find(s => s.id === formData.subdealer || s._id === formData.subdealer);
    return subdealer ? subdealer.name : formData.subdealer;
  };

  // Render fetch errors if any
  const renderFetchErrors = () => {
    const errorMessages = Object.entries(fetchErrors)
      .filter(([_, error]) => error !== null)
      .map(([key, error]) => `${key}: ${error}`);

    if (errorMessages.length === 0) return null;

    return (
      <CAlert color="warning" className="mb-3">
        <div className="d-flex align-items-center">
          <CIcon icon={cilWarning} className="me-2" />
          <div>
            <strong>Some data failed to load:</strong>
            <ul className="mb-0 mt-1">
              {errorMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      </CAlert>
    );
  };

  if (isLoading && !id) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <CSpinner color="primary" size="lg" />
        <span className="ms-2">Loading form data...</span>
      </div>
    );
  }

  return (
    <div className="form-container">
      {/* Global API Error Alert */}
      {apiError && (
        <CAlert 
          color="danger" 
          className="mb-3" 
          dismissible
          onClose={() => setApiError(null)}
        >
          <div className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-2" />
            <div>
              <strong>{apiError.context}</strong>
              <p className="mb-0">{apiError.message}</p>
            </div>
          </div>
        </CAlert>
      )}

      {/* Fetch Errors Alert */}
      {renderFetchErrors()}

      <div className='title'>{id ? 'Edit' : 'Add'} User</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <FormErrorBoundary section="User Details">
              <div className="user-details">
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Name</span>
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
                      disabled={isLoading}
                      placeholder="Enter full name"
                    />
                  </CInputGroup>
                  {errors.name && <p className="error">{errors.name}</p>}
                </div>

                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Type</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilPeople} />
                    </CInputGroupText>
                    <CFormSelect 
                      name="type" 
                      value={formData.type} 
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      <option value="employee">Employee</option>
                      <option value="subdealer">Subdealer</option>
                    </CFormSelect>
                  </CInputGroup>
                  {errors.type && <p className="error">{errors.type}</p>}
                </div>
                
             {formData.type === 'employee' && (
  <div className="input-box">
    <div className="details-container">
      <span className="details">Branch</span>
      <span className="required">*</span>
    </div>
    <CInputGroup>
      <CInputGroupText className="input-icon">
        <CIcon icon={cilLocationPin} />
      </CInputGroupText>
      <CFormSelect 
        name="branch" 
        value={formData.branch} 
        onChange={handleChange}
        disabled={isLoading || fetchErrors.branches}
      >
        <option value="">-Select-</option>
        {branches.map(branch => (
          <option key={branch._id} value={branch._id}>
            {branch.name}
          </option>
        ))}
      </CFormSelect>
    </CInputGroup>
    {errors.branch && <p className="error">{errors.branch}</p>}
    {fetchErrors.branches && (
      <small className="text-warning">Branches data unavailable: {fetchErrors.branches}</small>
    )}
  </div>
)}

                {formData.type === 'subdealer' && (
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Subdealer Type</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect 
                        name="subdealer" 
                        value={formData.subdealer} 
                        onChange={handleChange}
                        disabled={isLoading || fetchErrors.subdealers || (isLoggedInSubdealer && !id)}
                      >
                        <option value="">-Select Subdealer-</option>
                        {subdealers.map(subdealer => (
                          <option key={subdealer.id} value={subdealer.id}>
                            {subdealer.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    {errors.subdealer && <p className="error">{errors.subdealer}</p>}
                    {fetchErrors.subdealers && (
                      <small className="text-warning">Subdealers data unavailable: {fetchErrors.subdealers}</small>
                    )}
                  </div>
                )}
                
               <div className="input-box">
  <div className="details-container">
    <span className="details">Role</span>
    <span className="required">*</span>
  </div>
  <CInputGroup>
    <CInputGroupText className="input-icon">
      <CIcon icon={cilUser} />
    </CInputGroupText>
    <CFormSelect 
      name="roleId" 
      value={formData.roleId} 
      onChange={handleChange}
      disabled={isLoading || fetchErrors.roles || formData.type === 'subdealer'}
    >
      <option value="">-Select-</option>
      {roles.map(role => (
        <option key={role._id} value={role._id}>
          {role.name}
        </option>
      ))}
    </CFormSelect>
  </CInputGroup>
  {errors.roleId && <p className="error">{errors.roleId}</p>}
  {formData.type === 'subdealer' ? (
    <small className="text-muted">Role is automatically set to Subdealer and cannot be changed</small>
  ) : (
    <small className="text-muted">Select the role for this user</small>
  )}
  {fetchErrors.roles && (
    <small className="text-warning">Roles data unavailable: {fetchErrors.roles}</small>
  )}
</div>


                {/* Only show Branch Access field if role is not SALES_EXECUTIVE AND type is not subdealer */}
{!isSalesExecutiveRole && formData.type !== 'subdealer' && (
  <div className="input-box">
    <div className="details-container">
      <span className="details">Branch Access</span>
      <span className="required">*</span>
    </div>
    <CInputGroup>
      <CInputGroupText className="input-icon">
        <CIcon icon={cilBuilding} />
      </CInputGroupText>
      <CFormSelect 
        name="branchAccess" 
        value={formData.branchAccess} 
        onChange={handleChange}
        disabled={isLoading}
      >
        <option value="OWN">OWN - Only own branch</option>
        {/* <option value="ASSIGNED">ASSIGNED - Selected branches</option> */}
        <option value="ALL">ALL - All branches</option>
      </CFormSelect>
    </CInputGroup>
    <small className="text-muted">
      Defines which branches the user can access
    </small>
  </div>
)}

                {/* Accessible Branches Field - Only shown when branchAccess is ASSIGNED AND role is not SALES_EXECUTIVE */}
               {!isSalesExecutiveRole && formData.type !== 'subdealer' && formData.branchAccess === 'ASSIGNED' && (
  <div className="input-box">
    <div className="details-container">
      <span className="details">Accessible Branches</span>
      <span className="required">*</span>
    </div>
    <CInputGroup>
      <CInputGroupText className="input-icon">
        <CIcon icon={cilBuilding} />
      </CInputGroupText>
      <CFormSelect 
        name="accessibleBranch" 
        value="" 
        onChange={handleAccessibleBranchChange}
        disabled={isLoading || fetchErrors.branches}
      >
        <option value="">-Select Branch-</option>
        {branches.map(branch => (
          <option 
            key={branch._id} 
            value={branch._id}
            disabled={formData.accessibleBranches.includes(branch._id)}
          >
            {branch.name}
          </option>
        ))}
      </CFormSelect>
    </CInputGroup>
    
    <div className="mt-2">
      <div className="d-flex flex-wrap gap-2">
        {getSelectedAccessibleBranchNames().map((branchName, index) => {
          const branchId = formData.accessibleBranches[index];
          return (
            <CBadge 
              key={`${branchId}_${index}`} 
              color="info"
              className="d-flex align-items-center"
              style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
            >
              {String(branchName)}
              <CCloseButton 
                className="ms-2"
                onClick={() => removeAccessibleBranch(branchId)}
                style={{ fontSize: '0.75rem' }}
                disabled={isLoading}
              />
            </CBadge>
          );
        })}
      </div>
      <small className="text-muted">
        {formData.accessibleBranches.length} branch(es) selected
      </small>
      {errors.accessibleBranches && <p className="error">{errors.accessibleBranches}</p>}
      {fetchErrors.branches && (
        <small className="text-warning d-block">Branches data unavailable: {fetchErrors.branches}</small>
      )}
    </div>
  </div>
)}
                
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Email</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="user@example.com"
                    />
                  </CInputGroup>
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Mobile number</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput 
                      type="tel" 
                      name="mobile" 
                      value={formData.mobile} 
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="10-digit mobile number"
                    />
                  </CInputGroup>
                  {errors.mobile && <p className="error">{errors.mobile}</p>}
                </div>

                {/* Only show discount field if NOT creating a subdealer AND logged-in user is NOT a SUBDEALER */}
                {formData.type !== 'subdealer' && !isLoggedInSubdealerRole && (
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Discount</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilDollar} />
                      </CInputGroupText>
                      <CFormInput 
                        type="number" 
                        name="discount" 
                        value={formData.discount} 
                        onChange={handleChange}
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </CInputGroup>
                    {errors.discount && <p className="error">{errors.discount}</p>}
                  </div>
                )}

                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Verticles</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilTag} />
                    </CInputGroupText>
                    <CFormSelect 
                      name="vertical" 
                      value="" 
                      onChange={handleVerticalChange}
                      disabled={isLoading || fetchErrors.verticles}
                    >
                      <option value="">-Select Verticle-</option>
                      {verticles
                        .filter(vertical => vertical.status === 'active')
                        .map(vertical => (
                          <option 
                            key={vertical._id} 
                            value={vertical._id}
                            disabled={formData.verticles.includes(vertical._id)}
                          >
                            {vertical.name}
                          </option>
                        ))}
                    </CFormSelect>
                  </CInputGroup>
                  
                  <div className="mt-2">
                    <div className="d-flex flex-wrap gap-2">
                      {getSelectedVerticalNames().map((verticalName, index) => {
                        const verticalId = formData.verticles[index];
                        return (
                          <CBadge 
                            key={`${verticalId}_${index}`} 
                            color="primary"
                            className="d-flex align-items-center"
                            style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                          >
                            {String(verticalName)}
                            <CCloseButton 
                              className="ms-2"
                              onClick={() => removeVertical(verticalId)}
                              style={{ fontSize: '0.75rem' }}
                              disabled={isLoading}
                            />
                          </CBadge>
                        );
                      })}
                    </div>
                    <small className="text-muted">
                      {formData.verticles.length} verticle(s) selected (Optional)
                    </small>
                    {fetchErrors.verticles && (
                      <small className="text-warning d-block">Verticles data unavailable: {fetchErrors.verticles}</small>
                    )}
                  </div>
                </div>

                {/* Only show CSD field when all these conditions are met:
                    1. Logged-in user is NOT a SUBDEALER
                    2. User type is NOT 'subdealer'
                    3. Selected role is NOT 'SALES_EXECUTIVE'
                */}
                {!isLoggedInSubdealerRole && formData.type !== 'subdealer' && !isSalesExecutiveRole && (
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">CSD</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <div className="form-check form-switch mt-2 ms-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="csd"
                          id="csdCheckbox"
                          checked={formData.csd}
                          onChange={handleChange}
                          disabled={isLoading}
                          style={{ width: '3em', height: '1.5em' }}
                        />
                        <label className="form-check-label ms-2" htmlFor="csdCheckbox">
                          {formData.csd ? 'Yes' : 'No'}
                        </label>
                      </div>
                    </CInputGroup>
                    <small className="text-muted">
                      Customer Service Department access
                    </small>
                  </div>
                )}

                {/* New Stock Transfer OTP Field - Added here */}
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Stock Transfer OTP</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilShieldAlt} />
                    </CInputGroupText>
                    <CFormSelect 
                      name="isStockTransferOTP" 
                      value={formData.isStockTransferOTP} 
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      <option value="false">False - No OTP required for stock transfer</option>
                      <option value="true">True - OTP required for stock transfer</option>
                    </CFormSelect>
                  </CInputGroup>
                  <small className="text-muted">
                    Enable OTP verification for stock transfer operations
                  </small>
                </div>

                {isManager && (
                  <>
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Total Deviation Amount</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilDollar} />
                        </CInputGroupText>
                        <CFormInput 
                          type="number" 
                          name="totalDeviationAmount" 
                          value={formData.totalDeviationAmount} 
                          onChange={handleChange}
                          disabled={isLoading}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </CInputGroup>
                      {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
                    </div>

                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Per Transaction Deviation Limit</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilDollar} />
                        </CInputGroupText>
                        <CFormInput 
                          type="number" 
                          name="perTransactionDeviationLimit" 
                          value={formData.perTransactionDeviationLimit} 
                          onChange={handleChange}
                          disabled={isLoading}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </CInputGroup>
                      {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
                    </div>
                  </>
                )}
              </div>
            </FormErrorBoundary>

            {showPermissions && (
              <FormErrorBoundary section="Permissions Configuration">
                <div className="permissions-container mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">User Permissions Configuration</h5>
                    <CButton 
                      color="info" 
                      variant="outline" 
                      onClick={() => setShowPermissionGuide(true)}
                      disabled={isLoading || isLoadingPermissions}
                    >
                      <CIcon icon={cilInfo} className="me-2" />
                      View Permissions Guide
                    </CButton>
                  </div>
                  
                  <p className="text-muted mb-4">
                    These permissions are in addition to the role permissions. 
                    Total system permissions: {permissionsList.length}
                    {fetchErrors.permissions && (
                      <span className="text-warning ms-2">(Permissions data incomplete: {fetchErrors.permissions})</span>
                    )}
                  </p>
                  
                  {/* Three global permission buttons added here */}
                  <div className="mb-3">
                    <CButtonGroup>
                      <CButton 
                        color="secondary" 
                        onClick={() => handleGlobalAction('none')} 
                        variant="outline"
                        disabled={isLoading || isLoadingPermissions}
                      >
                        None
                      </CButton>
                      <CButton 
                        color="secondary" 
                        onClick={() => handleGlobalAction('selectAll')} 
                        variant="outline"
                        disabled={isLoading || isLoadingPermissions}
                      >
                        Select All
                      </CButton>
                      <CButton 
                        color="secondary" 
                        onClick={() => handleGlobalAction('viewOnly')} 
                        variant="outline"
                        disabled={isLoading || isLoadingPermissions}
                      >
                        View Only
                      </CButton>
                    </CButtonGroup>
                  </div>

                  {isLoadingPermissions ? (
                    <div className="d-flex justify-content-center align-items-center py-4">
                      <CSpinner color="primary" />
                      <span className="ms-2">Loading permissions...</span>
                    </div>
                  ) : (
                    <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
                      {Object.keys(sidebarStructure).map((mainHeader) => {
                        const hasAccess = mainHeaderAccess[mainHeader] || false;
                        const pageCount = sidebarStructure[mainHeader].pages.length;

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
                                  <div className="d-flex align-items-center" role="group">
                                    <CButton
                                      size="sm"
                                      color={hasAccess ? "success" : "secondary"}
                                      variant="outline"
                                      className="me-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMainHeaderAccessChange(mainHeader, true);
                                      }}
                                      disabled={isLoading || isLoadingPermissions}
                                    >
                                      <CIcon icon={cilCheck} /> Yes
                                    </CButton>
                                    <CButton
                                      size="sm"
                                      color={!hasAccess ? "danger" : "secondary"}
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMainHeaderAccessChange(mainHeader, false);
                                      }}
                                      disabled={isLoading || isLoadingPermissions}
                                    >
                                      <CIcon icon={cilX} /> No
                                    </CButton>
                                  </div>
                                </div>
                              </div>
                            </CAccordionHeader>
                            <CAccordionBody>
                              {hasAccess ? (
                                <div className="pages-permissions">
                                  {sidebarStructure[mainHeader].pages.map((page) => {
                                    const pageKey = `${mainHeader}_${page.name}`;
                                    const isExpanded = expandedPages[pageKey] || false;
                                    const pageHasTabs = page.tabs && page.tabs.length > 0;
                                    const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
                                    const hasTabPermissions = availableTabs.length > 0;
                                    
                                    return (
                                      <CCard key={pageKey} className="mb-3">
                                        <CCardBody>
                                          <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">{page.name}</h6>
                                            <div className="d-flex align-items-center gap-2">
                                              {pageHasTabs && hasTabPermissions && (
                                                <CButton
                                                  size="sm"
                                                  color="link"
                                                  onClick={() => togglePageExpansion(pageKey)}
                                                  className="p-0"
                                                  disabled={isLoading || isLoadingPermissions}
                                                >
                                                  {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
                                                </CButton>
                                              )}
                                            </div>
                                          </div>
                                          
                                          {/* Page-level permissions */}
                                          {renderPermissionsTable(mainHeader, page.name, false)}
                                          
                                          {/* Tab-level permissions (if available) */}
                                          {pageHasTabs && hasTabPermissions && (
                                            <CCollapse visible={isExpanded}>
                                              <div className="mt-3">
                                                <h6 className="mb-2">Tab Permissions</h6>
                                                {availableTabs.map((tab) => (
                                                  <div key={`${pageKey}_${tab}`} className="mb-3">
                                                    {renderPermissionsTable(mainHeader, page.name, true, tab)}
                                                  </div>
                                                ))}
                                              </div>
                                            </CCollapse>
                                          )}
                                        </CCardBody>
                                      </CCard>
                                    );
                                  })}
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
                  )}
                </div>
              </FormErrorBoundary>
            )}

            <div className="form-footer">
              <button 
                type="submit" 
                className="cancel-button"
                disabled={isLoading || isLoadingPermissions}
              >
                {isLoading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    {id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  'Save'
                )}
              </button>
              <button 
                type="button" 
                className="submit-button" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Permission Guide Modal */}
      {renderPermissionGuideModal()}
    </div>
  );
}

export default AddUser;