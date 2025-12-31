// import React, { useState, useEffect } from 'react';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CButton,
//   CFormCheck,
//   CButtonGroup,
//   CFormSwitch,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CSpinner,
//   CAlert,
//   CBadge,
//   CCollapse,
//   CCard,
//   CCardBody
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilListRich, cilUser, cilCheck, cilX } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import FormButtons from 'src/utils/FormButtons';
// import '../../css/form.css';
// import '../../css/table.css';

// // Complete sidebar structure with all pages and their tabs
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

// // Map sidebar module names to API module names (both formats)
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
//   "Subdealer Account": ["SUBDEaler ACCOUNT", "SUBDEALER_ACCOUNT"],
//   "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
// };

// // Permission label mapping for display only
// const permissionLabelMap = {
//   "CREATE": "Add",
//   "VIEW": "View",
//   "UPDATE": "Edit",
//   "DELETE": "Delete"
// };

// // Tab permission label mapping (only show "Access" instead of "VIEW")
// const tabPermissionLabelMap = {
//   "VIEW": "Access",
//   "CREATE": "Create",
//   "UPDATE": "Update", 
//   "DELETE": "Delete"
// };

// // Helper to normalize tab names
// const normalizeTabName = (tabName) => {
//   if (!tabName) return '';
//   return tabName.trim().toUpperCase();
// };

// // Helper function to get display label for permission based on context
// const getPermissionDisplayLabel = (permission, isTab = false) => {
//   if (isTab) {
//     return tabPermissionLabelMap[permission] || permission;
//   }
//   return permissionLabelMap[permission] || permission;
// };

// const CreateRoleWithHierarchy = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     is_active: true
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [activeModule, setActiveModule] = useState(null);
//   const [expandedPages, setExpandedPages] = useState({});
//   const [pagePermissions, setPagePermissions] = useState({});
//   const [tabPermissions, setTabPermissions] = useState({});
//   const [mainHeaderAccess, setMainHeaderAccess] = useState({});
//   const [permissionsList, setPermissionsList] = useState([]);
//   const [permissionsLoading, setPermissionsLoading] = useState(true);

//   useEffect(() => {
//     fetchPermissions();
//   }, []);

//   useEffect(() => {
//     if (permissionsList.length > 0) {
//       if (id) {
//         fetchRole(id);
//       } else {
//         initializeEmptyPermissions();
//         setLoading(false);
//       }
//     }
//   }, [id, permissionsList]);

//   const fetchPermissions = async () => {
//     try {
//       setPermissionsLoading(true);
//       const res = await axiosInstance.get('/roles/permissions');
//       setPermissionsList(res.data.data || []);
//       setPermissionsLoading(false);
//     } catch (error) {
//       console.error('Error fetching permissions:', error);
//       setError('Failed to fetch permissions. Please try again.');
//       setPermissionsLoading(false);
//     }
//   };

//   const initializeEmptyPermissions = () => {
//     const initialMainHeaderAccess = {};
//     const initialPagePermissions = {};
//     const initialTabPermissions = {};

//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       initialMainHeaderAccess[mainHeader] = false;
      
//       const headerPages = sidebarStructure[mainHeader].pages;
//       headerPages.forEach(page => {
//         const pageKey = `${mainHeader}_${page.name}`;
        
//         // Initialize page permissions
//         initialPagePermissions[pageKey] = {};
//         sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//           initialPagePermissions[pageKey][permType] = false;
//         });
        
//         // Initialize tab permissions if page has tabs
//         if (page.tabs && page.tabs.length > 0) {
//           page.tabs.forEach(tab => {
//             const tabKey = `${mainHeader}_${page.name}_${tab}`;
//             initialTabPermissions[tabKey] = {};
            
//             sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//               initialTabPermissions[tabKey][permType] = false;
//             });
//           });
//         }
//       });
//     });

//     setMainHeaderAccess(initialMainHeaderAccess);
//     setPagePermissions(initialPagePermissions);
//     setTabPermissions(initialTabPermissions);
//   };

//   const fetchRole = async (roleId) => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(`/roles/${roleId}`);
//       const roleData = res.data.data;

//       // Set form data
//       setFormData({
//         name: roleData.name || '',
//         description: roleData.description || '',
//         is_active: roleData.is_active !== undefined ? roleData.is_active : true
//       });

//       // Initialize empty permissions first
//       initializeEmptyPermissions();

//       // Process moduleAccess (convert from uppercase to display format)
//       const newMainHeaderAccess = { ...mainHeaderAccess };
//       if (roleData.moduleAccess) {
//         console.log('moduleAccess from API:', roleData.moduleAccess);
//         Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
//           // Find the display main header name
//           const mainHeader = Object.keys(moduleNameMap).find(key => {
//             const variants = moduleNameMap[key];
//             return variants && variants.some(variant => 
//               variant.toUpperCase() === apiModuleName.toUpperCase()
//             );
//           }) || Object.keys(sidebarStructure).find(key => 
//             key.toUpperCase() === apiModuleName.toUpperCase()
//           );
          
//           if (mainHeader && sidebarStructure[mainHeader]) {
//             newMainHeaderAccess[mainHeader] = roleData.moduleAccess[apiModuleName];
//           }
//         });
//       }
//       setMainHeaderAccess(newMainHeaderAccess);

//       // Process pageAccess
//       if (roleData.pageAccess) {
//         console.log('pageAccess from API:', roleData.pageAccess);
//         const newPagePermissions = { ...pagePermissions };
//         Object.keys(roleData.pageAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           if (!mainHeader || !newMainHeaderAccess[mainHeader]) return;
          
//           Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
//             const pageKey = `${mainHeader}_${pageName}`;
//             const permissions = roleData.pageAccess[apiModuleName][pageName];
            
//             if (!newPagePermissions[pageKey]) {
//               newPagePermissions[pageKey] = {};
//             }
            
//             permissions.forEach(perm => {
//               const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//               newPagePermissions[pageKey][permKey] = true;
//             });
//           });
//         });
//         setPagePermissions(newPagePermissions);
//       }

//       // Process tabAccess
//       if (roleData.tabAccess) {
//         console.log('=== DEBUG: Processing tabAccess ===');
//         console.log('Raw tabAccess from API:', roleData.tabAccess);
        
//         const newTabPermissions = { ...tabPermissions };
//         Object.keys(roleData.tabAccess).forEach(apiModuleName => {
//           const mainHeader = findMainHeaderByModule(apiModuleName);
//           console.log(`Processing module: ${apiModuleName} -> ${mainHeader}`);
          
//           if (!mainHeader || !newMainHeaderAccess[mainHeader]) {
//             console.log(`Skipping module ${apiModuleName} - no mainHeader or no access`);
//             return;
//           }
          
//           Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
//             console.log(`  Processing page: ${pageName}`);
//             Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
//               console.log(`    Processing tab: ${tabName}`);
              
//               // Find the page config in sidebarStructure
//               const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
//               if (!pageConfig) {
//                 console.log(`    Page ${pageName} not found in sidebarStructure`);
//                 return;
//               }
              
//               // Check if this exact tab exists in sidebarStructure (case-insensitive)
//               let matchingTab = null;
//               if (pageConfig.tabs && pageConfig.tabs.length > 0) {
//                 matchingTab = pageConfig.tabs.find(tab => 
//                   tab.toUpperCase() === tabName.toUpperCase()
//                 );
                
//                 if (!matchingTab) {
//                   // Try fuzzy matching for common variations
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
//                     console.log(`    Using fuzzy match: ${tabName} -> ${matchingTab}`);
//                   }
//                 }
//               }
              
//               if (matchingTab) {
//                 const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
//                 const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                
//                 if (!newTabPermissions[tabKey]) {
//                   newTabPermissions[tabKey] = {};
//                 }
                
//                 permissions.forEach(perm => {
//                   const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
//                   newTabPermissions[tabKey][permKey] = true;
//                 });
                
//                 console.log(`    Set permissions for ${tabKey}:`, permissions);
//               } else {
//                 console.log(`    No matching tab found for ${tabName} in page ${pageName}`);
//               }
//             });
//           });
//         });
        
//         console.log('Final tabPermissions after processing:', newTabPermissions);
//         setTabPermissions(newTabPermissions);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching role:', error);
//       setError('Failed to fetch role data. Please try again.');
//       setLoading(false);
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
    
//     // If not found, try direct match with module name
//     for (const mainHeader of Object.keys(sidebarStructure)) {
//       if (mainHeader.toUpperCase() === moduleUpper) {
//         return mainHeader;
//       }
//     }
    
//     return null;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const togglePageExpansion = (pageKey) => {
//     setExpandedPages(prev => ({
//       ...prev,
//       [pageKey]: !prev[pageKey]
//     }));
//   };

//   const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
//     setMainHeaderAccess(prev => ({
//       ...prev,
//       [mainHeader]: hasAccess
//     }));

//     // If access is removed, clear all permissions for pages and tabs in this header
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
        
//         // Clear tab permissions
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
//     }
//   };

//   const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
//     const pageKey = `${mainHeader}_${page}`;
//     setPagePermissions(prev => ({
//       ...prev,
//       [pageKey]: {
//         ...prev[pageKey],
//         [permissionType]: value
//       }
//     }));
//   };

//   const handleTabPermissionChange = (mainHeader, page, tab, permissionType, value) => {
//     const tabKey = `${mainHeader}_${page}_${tab}`;
//     setTabPermissions(prev => ({
//       ...prev,
//       [tabKey]: {
//         ...prev[tabKey],
//         [permissionType]: value
//       }
//     }));
//   };

//   const handleSelectAllPagePermissions = (mainHeader, page) => {
//     const pageKey = `${mainHeader}_${page}`;
//     const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
    
//     // Only select permissions that exist in the API
//     const newPerms = {};
//     availablePermissions.forEach(perm => {
//       const exists = checkPermissionExists(mainHeader, page, perm, null);
//       newPerms[perm] = exists;
//     });
    
//     setPagePermissions(prev => ({
//       ...prev,
//       [pageKey]: newPerms
//     }));
//   };

//   const handleClearAllPagePermissions = (mainHeader, page) => {
//     const pageKey = `${mainHeader}_${page}`;
//     setPagePermissions(prev => ({
//       ...prev,
//       [pageKey]: sidebarStructure[mainHeader].availablePermissions.reduce((acc, perm) => {
//         acc[perm] = false;
//         return acc;
//       }, {})
//     }));
//   };

//   const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
//     const tabKey = `${mainHeader}_${page}_${tab}`;
//     const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
    
//     // For tabs, when clicking "All", only select VIEW permission
//     const newPerms = {};
//     availablePermissions.forEach(perm => {
//       const exists = checkPermissionExists(mainHeader, page, perm, tab);
//       // Only set VIEW to true, others to false
//       newPerms[perm] = perm === "VIEW" ? exists : false;
//     });
    
//     setTabPermissions(prev => ({
//       ...prev,
//       [tabKey]: newPerms
//     }));
//   };

//   const handleClearAllTabPermissions = (mainHeader, page, tab) => {
//     const tabKey = `${mainHeader}_${page}_${tab}`;
//     setTabPermissions(prev => ({
//       ...prev,
//       [tabKey]: sidebarStructure[mainHeader].availablePermissions.reduce((acc, perm) => {
//         acc[perm] = false;
//         return acc;
//       }, {})
//     }));
//   };

//   const validate = () => {
//     const { name } = formData;
//     const errs = {};

//     if (!name.trim()) errs.name = 'Role name is required';

//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const generatePayload = () => {
//     const payload = {
//       name: formData.name,
//       description: formData.description,
//       is_active: formData.is_active,
//       moduleAccess: {},
//       pageAccess: {},
//       tabAccess: {},
//       permissions: []
//     };

//     // Helper function to convert main header to API module name format
//     const getApiModuleName = (mainHeader) => {
//       // Use the first variant from moduleNameMap, or convert to uppercase
//       const variants = moduleNameMap[mainHeader];
//       if (variants && variants.length > 0) {
//         // Return the first variant in uppercase (as per your API example)
//         return variants[0].toUpperCase();
//       }
//       // Fallback: convert to uppercase
//       return mainHeader.toUpperCase();
//     };

//     // Build moduleAccess, pageAccess, tabAccess and permissions
//     Object.keys(sidebarStructure).forEach(mainHeader => {
//       const hasAccess = mainHeaderAccess[mainHeader] || false;
//       const apiModuleName = getApiModuleName(mainHeader);
      
//       // Set module access (uppercase keys)
//       payload.moduleAccess[apiModuleName] = hasAccess;
      
//       if (hasAccess) {
//         // Initialize page access for this module
//         payload.pageAccess[apiModuleName] = {};
//         payload.tabAccess[apiModuleName] = {};
        
//         sidebarStructure[mainHeader].pages.forEach(page => {
//           const pageKey = `${mainHeader}_${page.name}`;
//           const pagePerms = pagePermissions[pageKey] || {};
          
//           // Get selected permissions for this page
//           const selectedPagePermissions = [];
//           sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//             if (pagePerms[permType]) {
//               selectedPagePermissions.push(permType.toUpperCase());
//             }
//           });
          
//           // Add to pageAccess if there are selected permissions
//           if (selectedPagePermissions.length > 0) {
//             payload.pageAccess[apiModuleName][page.name] = selectedPagePermissions;
//           }
          
//           // Check for tab permissions
//           if (page.tabs && page.tabs.length > 0) {
//             // Initialize tab access for this page
//             payload.tabAccess[apiModuleName][page.name] = {};
            
//             page.tabs.forEach(tab => {
//               const tabKey = `${mainHeader}_${page.name}_${tab}`;
//               const tabPerms = tabPermissions[tabKey] || {};
              
//               // Get selected permissions for this tab
//               const selectedTabPermissions = [];
//               sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
//                 if (tabPerms[permType]) {
//                   selectedTabPermissions.push(permType.toUpperCase());
//                 }
//               });
              
//               // Add to tabAccess if there are selected permissions
//               if (selectedTabPermissions.length > 0) {
//                 payload.tabAccess[apiModuleName][page.name][tab] = selectedTabPermissions;
//               }
              
//               // Add to permissions array for each selected tab permission
//               selectedTabPermissions.forEach(permType => {
//                 if (checkPermissionExists(mainHeader, page.name, permType, tab)) {
//                   payload.permissions.push({
//                     module: apiModuleName,
//                     page: page.name,
//                     tab: tab,
//                     action: permType.toUpperCase()
//                   });
//                 }
//               });
//             });
            
//             // Remove empty tab access objects
//             if (Object.keys(payload.tabAccess[apiModuleName][page.name]).length === 0) {
//               delete payload.tabAccess[apiModuleName][page.name];
//             }
//           } else {
//             // No tabs - add page-level permissions to permissions array
//             selectedPagePermissions.forEach(permType => {
//               if (checkPermissionExists(mainHeader, page.name, permType, null)) {
//                 payload.permissions.push({
//                   module: apiModuleName,
//                   page: page.name,
//                   action: permType.toUpperCase()
//                 });
//               }
//             });
//           }
//         });
        
//         // Remove empty module entries
//         if (Object.keys(payload.pageAccess[apiModuleName]).length === 0) {
//           delete payload.pageAccess[apiModuleName];
//         }
//         if (Object.keys(payload.tabAccess[apiModuleName]).length === 0) {
//           delete payload.tabAccess[apiModuleName];
//         }
//       }
//     });

//     console.log('Generated Payload:', payload);
//     return payload;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     const payload = generatePayload();
    
//     try {
//       if (id) {
//         await axiosInstance.put(`/roles/${id}`, payload);
//         await showFormSubmitToast('Role updated successfully!', () => navigate('/roles/all-role'));
//       } else {
//         await axiosInstance.post('/roles', payload);
//         await showFormSubmitToast('Role created successfully!', () => navigate('/roles/all-role'));
//       }
//     } catch (error) {
//       console.error('Role save error:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => navigate('/roles/all-role');

//   // Check if a permission exists in the API
//   const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
//     const apiModuleNames = moduleNameMap[mainHeader];
//     if (!apiModuleNames || !apiModuleNames.length) return false;
    
//     // Try to find permission with any of the module name variants
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

//   if (permissionsLoading || loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container my-4">
//         <CAlert color="danger">{error}</CAlert>
//       </div>
//     );
//   }

//   return (
//     <div className='form-container'>
//       <div className='title'>{id ? 'Edit' : 'Add'} Role</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             {/* ------------ Details block ------------- */}
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Role Name</span>
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
//                     placeholder="Enter role name" 
//                   />
//                 </CInputGroup>
//                 {errors.name && <p className="error">{errors.name}</p>}
//               </div>

//               {/* Description */}
//               <div className="input-box">
//                 <span className="details">Description</span>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilListRich} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     placeholder="Enter role description"
//                   />
//                 </CInputGroup>
//               </div>

//               <div className="input-box">
//                 <span className="details">Active Status</span>
//                 <CFormSwitch
//                   label={formData.is_active ? 'Active' : 'Inactive'}
//                   checked={formData.is_active}
//                   onChange={() => setFormData((prev) => ({ ...prev, is_active: !prev.is_active }))}
//                   style={{ height: '20px' }}
//                 />
//               </div>
//             </div>

//             {/* ------------ Permissions Section ------------- */}
//             <div className="permissions-container mt-4">
//               <h5 className="mb-3">Permissions Configuration</h5>
//               <p className="text-muted mb-4">
//                 Total permissions available: {permissionsList.length}
//               </p>
              
//               <CAccordion activeItemKey={activeModule}>
//                 {Object.keys(sidebarStructure).map((mainHeader) => {
//                   const hasAccess = mainHeaderAccess[mainHeader] || false;
//                   const pageCount = sidebarStructure[mainHeader].pages.length;

//                   return (
//                     <CAccordionItem key={mainHeader} itemKey={mainHeader}>
//                       <CAccordionHeader>
//                         <div className="d-flex justify-content-between w-100 me-3 align-items-center">
//                           <div>
//                             <h6 className="mb-0">{mainHeader}</h6>
//                             <small className="text-muted">{pageCount} pages</small>
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <CBadge color={hasAccess ? "success" : "secondary"} className="me-2">
//                               {hasAccess ? 'Access Granted' : 'No Access'}
//                             </CBadge>
//                             <CButtonGroup size="sm">
//                               <CButton 
//                                 color={hasAccess ? "success" : "secondary"} 
//                                 variant={hasAccess ? "outline" : "outline"}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   e.preventDefault();
//                                   handleMainHeaderAccessChange(mainHeader, true);
//                                 }}
//                               >
//                                 <CIcon icon={cilCheck} /> Yes
//                               </CButton>
//                               <CButton 
//                                 color={!hasAccess ? "danger" : "secondary"} 
//                                 variant={!hasAccess ? "outline" : "outline"}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   e.preventDefault();
//                                   handleMainHeaderAccessChange(mainHeader, false);
//                                 }}
//                               >
//                                 <CIcon icon={cilX} /> No
//                               </CButton>
//                             </CButtonGroup>
//                           </div>
//                         </div>
//                       </CAccordionHeader>
//                       <CAccordionBody>
//                         {hasAccess ? (
//                           <div className="pages-permissions">
//                             {sidebarStructure[mainHeader].pages.map((page) => {
//                               const pageKey = `${mainHeader}_${page.name}`;
//                               const isExpanded = expandedPages[pageKey] || false;
//                               const pageHasTabs = page.tabs && page.tabs.length > 0;
//                               const availableTabs = getAvailableTabsForPage(mainHeader, page.name);
//                               const hasTabPermissions = availableTabs.length > 0;
                              
//                               return (
//                                 <CCard key={pageKey} className="mb-3">
//                                   <CCardBody>
//                                     <div className="d-flex justify-content-between align-items-center mb-2">
//                                       <h6 className="mb-0">{page.name}</h6>
//                                       <div className="d-flex align-items-center gap-2">
//                                         {pageHasTabs && hasTabPermissions && (
//                                           <CButton
//                                             size="sm"
//                                             color="link"
//                                             onClick={() => togglePageExpansion(pageKey)}
//                                             className="p-0"
//                                           >
//                                             {isExpanded ? 'Hide Tabs' : 'Show Tabs'}
//                                           </CButton>
//                                         )}
//                                       </div>
//                                     </div>
                                    
//                                     {/* Page-level permissions */}
//                                     {renderPermissionsTable(mainHeader, page.name, false)}
                                    
//                                     {/* Tab-level permissions (if available) */}
//                                     {pageHasTabs && hasTabPermissions && (
//                                       <CCollapse visible={isExpanded}>
//                                         <div className="mt-3">
//                                           <h6 className="mb-2">Tab Permissions</h6>
//                                           {availableTabs.map((tab) => (
//                                             <div key={`${pageKey}_${tab}`} className="mb-3">
//                                               {renderPermissionsTable(mainHeader, page.name, true, tab)}
//                                             </div>
//                                           ))}
//                                         </div>
//                                       </CCollapse>
//                                     )}
//                                   </CCardBody>
//                                 </CCard>
//                               );
//                             })}
//                           </div>
//                         ) : (
//                           <div className="text-center py-4">
//                             <CIcon icon={cilX} size="xl" className="text-muted mb-2" />
//                             <p className="text-muted mb-0">No access granted for {mainHeader}</p>
//                             <small>Click "Yes" to grant access and configure permissions</small>
//                           </div>
//                         )}
//                       </CAccordionBody>
//                     </CAccordionItem>
//                   );
//                 })}
//               </CAccordion>
//             </div>

//             {/* ------------ Buttons ------------- */}
//             <FormButtons onCancel={handleCancel} />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRoleWithHierarchy;





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
  CBadge,
  CCollapse,
  CCard,
  CCardBody
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilListRich, cilUser, cilCheck, cilX, cilWarning } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
import axiosInstance from 'src/axiosInstance';
import FormButtons from 'src/utils/FormButtons';
import '../../css/form.css';
import '../../css/table.css';

// Complete sidebar structure with all pages and their tabs
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

// Map sidebar module names to API module names (both formats)
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
  "Fund Master": ["FUND MASTER", "FUND_MASTER"],
  "Accessories Billing": ["ACCESSORIES BILLING", "ACCESSORIES_BILLING"],
  "Customers": ["CUSTOMERS"],
  "Subdealer": ["SUBDEALER"],
  "Subdealer Master": ["SUBDEALER MASTER", "SUBDEALER_MASTER"],
  "Subdealer Booking": ["SUBDEALER BOOKING", "SUBDEALER_BOOKING"],
  "Subdealer Management": ["SUBDEALER MANAGEMENT", "SUBDEALER_MANAGEMENT"],
  "Subdealer Account": ["SUBDEaler ACCOUNT", "SUBDEALER_ACCOUNT"],
  "User Management": ["USER MANAGEMENT", "USER_MANAGEMENT"]
};

// Permission label mapping for display only
const permissionLabelMap = {
  "CREATE": "Add",
  "VIEW": "View",
  "UPDATE": "Edit",
  "DELETE": "Delete"
};

// Tab permission label mapping (only show "Access" instead of "VIEW")
const tabPermissionLabelMap = {
  "VIEW": "Access",
  "CREATE": "Create",
  "UPDATE": "Update", 
  "DELETE": "Delete"
};

// Helper to normalize tab names
const normalizeTabName = (tabName) => {
  if (!tabName) return '';
  return tabName.trim().toUpperCase();
};

// Helper function to get display label for permission based on context
const getPermissionDisplayLabel = (permission, isTab = false) => {
  if (isTab) {
    return tabPermissionLabelMap[permission] || permission;
  }
  return permissionLabelMap[permission] || permission;
};

// Error handling utility function
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

const CreateRoleWithHierarchy = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeModule, setActiveModule] = useState(null);
  const [expandedPages, setExpandedPages] = useState({});
  const [pagePermissions, setPagePermissions] = useState({});
  const [tabPermissions, setTabPermissions] = useState({});
  const [mainHeaderAccess, setMainHeaderAccess] = useState({});
  const [permissionsList, setPermissionsList] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

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

  const showErrorAlert = (errorMessage, context = 'Error') => {
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

  const fetchPermissions = async () => {
    try {
      setPermissionsLoading(true);
      const res = await axiosInstance.get('/roles/permissions');
      setPermissionsList(res.data.data || []);
      setPermissionsLoading(false);
    } catch (error) {
      const errorMessage = handleApiError(error, 'Fetch Permissions');
      showErrorAlert(errorMessage, 'Permissions Load Error');
      setFetchError(errorMessage);
      setPermissionsLoading(false);
    }
  };

  const initializeEmptyPermissions = () => {
    try {
      const initialMainHeaderAccess = {};
      const initialPagePermissions = {};
      const initialTabPermissions = {};

      Object.keys(sidebarStructure).forEach(mainHeader => {
        initialMainHeaderAccess[mainHeader] = false;
        
        const headerPages = sidebarStructure[mainHeader].pages;
        headerPages.forEach(page => {
          const pageKey = `${mainHeader}_${page.name}`;
          
          // Initialize page permissions
          initialPagePermissions[pageKey] = {};
          sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
            initialPagePermissions[pageKey][permType] = false;
          });
          
          // Initialize tab permissions if page has tabs
          if (page.tabs && page.tabs.length > 0) {
            page.tabs.forEach(tab => {
              const tabKey = `${mainHeader}_${page.name}_${tab}`;
              initialTabPermissions[tabKey] = {};
              
              sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                initialTabPermissions[tabKey][permType] = false;
              });
            });
          }
        });
      });

      setMainHeaderAccess(initialMainHeaderAccess);
      setPagePermissions(initialPagePermissions);
      setTabPermissions(initialTabPermissions);
    } catch (error) {
      console.error('Error initializing permissions:', error);
      showErrorAlert('Failed to initialize permissions. Please refresh the page.', 'Initialization Error');
    }
  };

  const fetchRole = async (roleId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/roles/${roleId}`);
      const roleData = res.data.data;

      if (!roleData) {
        throw new Error('Role data not found');
      }

      // Set form data
      setFormData({
        name: roleData.name || '',
        description: roleData.description || '',
        is_active: roleData.is_active !== undefined ? roleData.is_active : true
      });

      // Initialize empty permissions first
      initializeEmptyPermissions();

      // Process moduleAccess (convert from uppercase to display format)
      const newMainHeaderAccess = { ...mainHeaderAccess };
      if (roleData.moduleAccess) {
        console.log('moduleAccess from API:', roleData.moduleAccess);
        Object.keys(roleData.moduleAccess).forEach(apiModuleName => {
          try {
            // Find the display main header name
            const mainHeader = Object.keys(moduleNameMap).find(key => {
              const variants = moduleNameMap[key];
              return variants && variants.some(variant => 
                variant.toUpperCase() === apiModuleName.toUpperCase()
              );
            }) || Object.keys(sidebarStructure).find(key => 
              key.toUpperCase() === apiModuleName.toUpperCase()
            );
            
            if (mainHeader && sidebarStructure[mainHeader]) {
              newMainHeaderAccess[mainHeader] = roleData.moduleAccess[apiModuleName];
            }
          } catch (error) {
            console.error(`Error processing module ${apiModuleName}:`, error);
          }
        });
      }
      setMainHeaderAccess(newMainHeaderAccess);

      // Process pageAccess
      if (roleData.pageAccess) {
        console.log('pageAccess from API:', roleData.pageAccess);
        const newPagePermissions = { ...pagePermissions };
        Object.keys(roleData.pageAccess).forEach(apiModuleName => {
          try {
            const mainHeader = findMainHeaderByModule(apiModuleName);
            if (!mainHeader || !newMainHeaderAccess[mainHeader]) return;
            
            Object.keys(roleData.pageAccess[apiModuleName]).forEach(pageName => {
              const pageKey = `${mainHeader}_${pageName}`;
              const permissions = roleData.pageAccess[apiModuleName][pageName];
              
              if (!newPagePermissions[pageKey]) {
                newPagePermissions[pageKey] = {};
              }
              
              if (Array.isArray(permissions)) {
                permissions.forEach(perm => {
                  const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
                  newPagePermissions[pageKey][permKey] = true;
                });
              }
            });
          } catch (error) {
            console.error(`Error processing page access for module ${apiModuleName}:`, error);
          }
        });
        setPagePermissions(newPagePermissions);
      }

      // Process tabAccess
      if (roleData.tabAccess) {
        console.log('=== DEBUG: Processing tabAccess ===');
        console.log('Raw tabAccess from API:', roleData.tabAccess);
        
        const newTabPermissions = { ...tabPermissions };
        Object.keys(roleData.tabAccess).forEach(apiModuleName => {
          try {
            const mainHeader = findMainHeaderByModule(apiModuleName);
            console.log(`Processing module: ${apiModuleName} -> ${mainHeader}`);
            
            if (!mainHeader || !newMainHeaderAccess[mainHeader]) {
              console.log(`Skipping module ${apiModuleName} - no mainHeader or no access`);
              return;
            }
            
            Object.keys(roleData.tabAccess[apiModuleName]).forEach(pageName => {
              console.log(`  Processing page: ${pageName}`);
              Object.keys(roleData.tabAccess[apiModuleName][pageName]).forEach(tabName => {
                console.log(`    Processing tab: ${tabName}`);
                
                // Find the page config in sidebarStructure
                const pageConfig = sidebarStructure[mainHeader]?.pages?.find(p => p.name === pageName);
                if (!pageConfig) {
                  console.log(`    Page ${pageName} not found in sidebarStructure`);
                  return;
                }
                
                // Check if this exact tab exists in sidebarStructure (case-insensitive)
                let matchingTab = null;
                if (pageConfig.tabs && pageConfig.tabs.length > 0) {
                  matchingTab = pageConfig.tabs.find(tab => 
                    tab.toUpperCase() === tabName.toUpperCase()
                  );
                  
                  if (!matchingTab) {
                    // Try fuzzy matching for common variations
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
                      console.log(`    Using fuzzy match: ${tabName} -> ${matchingTab}`);
                    }
                  }
                }
                
                if (matchingTab) {
                  const tabKey = `${mainHeader}_${pageName}_${matchingTab}`;
                  const permissions = roleData.tabAccess[apiModuleName][pageName][tabName];
                  
                  if (!newTabPermissions[tabKey]) {
                    newTabPermissions[tabKey] = {};
                  }
                  
                  if (Array.isArray(permissions)) {
                    permissions.forEach(perm => {
                      const permKey = perm.toUpperCase() === 'ADD' ? 'CREATE' : perm.toUpperCase();
                      newTabPermissions[tabKey][permKey] = true;
                    });
                  }
                  
                  console.log(`    Set permissions for ${tabKey}:`, permissions);
                } else {
                  console.log(`    No matching tab found for ${tabName} in page ${pageName}`);
                }
              });
            });
          } catch (error) {
            console.error(`Error processing tab access for module ${apiModuleName}:`, error);
          }
        });
        
        console.log('Final tabPermissions after processing:', newTabPermissions);
        setTabPermissions(newTabPermissions);
      }

      setLoading(false);
    } catch (error) {
      const errorMessage = handleApiError(error, 'Fetch Role');
      showErrorAlert(errorMessage, 'Role Fetch Error');
      setFetchError(errorMessage);
      setLoading(false);
    }
  };

  // Helper to find main header by module name
  const findMainHeaderByModule = (moduleName) => {
    if (!moduleName) return null;
    
    try {
      const moduleUpper = moduleName.toUpperCase();
      for (const [mainHeader, moduleVariants] of Object.entries(moduleNameMap)) {
        if (moduleVariants.some(variant => variant.toUpperCase() === moduleUpper)) {
          return mainHeader;
        }
      }
      
      // If not found, try direct match with module name
      for (const mainHeader of Object.keys(sidebarStructure)) {
        if (mainHeader.toUpperCase() === moduleUpper) {
          return mainHeader;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error finding main header:', error);
      return null;
    }
  };

  const handleChange = (e) => {
    try {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (error) {
      console.error('Error handling form change:', error);
    }
  };

  const togglePageExpansion = (pageKey) => {
    try {
      setExpandedPages(prev => ({
        ...prev,
        [pageKey]: !prev[pageKey]
      }));
    } catch (error) {
      console.error('Error toggling page expansion:', error);
    }
  };

  const handleMainHeaderAccessChange = (mainHeader, hasAccess) => {
    try {
      setMainHeaderAccess(prev => ({
        ...prev,
        [mainHeader]: hasAccess
      }));

      // If access is removed, clear all permissions for pages and tabs in this header
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
          
          // Clear tab permissions
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
      }
    } catch (error) {
      console.error('Error handling main header access change:', error);
      showErrorAlert('Failed to update access. Please try again.', 'Access Control Error');
    }
  };

  const handlePagePermissionChange = (mainHeader, page, permissionType, value) => {
    try {
      const pageKey = `${mainHeader}_${page}`;
      setPagePermissions(prev => ({
        ...prev,
        [pageKey]: {
          ...prev[pageKey],
          [permissionType]: value
        }
      }));
    } catch (error) {
      console.error('Error handling page permission change:', error);
    }
  };

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
    } catch (error) {
      console.error('Error handling tab permission change:', error);
    }
  };

  const handleSelectAllPagePermissions = (mainHeader, page) => {
    try {
      const pageKey = `${mainHeader}_${page}`;
      const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
      // Only select permissions that exist in the API
      const newPerms = {};
      availablePermissions.forEach(perm => {
        const exists = checkPermissionExists(mainHeader, page, perm, null);
        newPerms[perm] = exists;
      });
      
      setPagePermissions(prev => ({
        ...prev,
        [pageKey]: newPerms
      }));
    } catch (error) {
      console.error('Error selecting all page permissions:', error);
    }
  };

  const handleClearAllPagePermissions = (mainHeader, page) => {
    try {
      const pageKey = `${mainHeader}_${page}`;
      setPagePermissions(prev => ({
        ...prev,
        [pageKey]: sidebarStructure[mainHeader].availablePermissions.reduce((acc, perm) => {
          acc[perm] = false;
          return acc;
        }, {})
      }));
    } catch (error) {
      console.error('Error clearing all page permissions:', error);
    }
  };

  const handleSelectAllTabPermissions = (mainHeader, page, tab) => {
    try {
      const tabKey = `${mainHeader}_${page}_${tab}`;
      const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
      // For tabs, when clicking "All", only select VIEW permission
      const newPerms = {};
      availablePermissions.forEach(perm => {
        const exists = checkPermissionExists(mainHeader, page, perm, tab);
        // Only set VIEW to true, others to false
        newPerms[perm] = perm === "VIEW" ? exists : false;
      });
      
      setTabPermissions(prev => ({
        ...prev,
        [tabKey]: newPerms
      }));
    } catch (error) {
      console.error('Error selecting all tab permissions:', error);
    }
  };

  const handleClearAllTabPermissions = (mainHeader, page, tab) => {
    try {
      const tabKey = `${mainHeader}_${page}_${tab}`;
      setTabPermissions(prev => ({
        ...prev,
        [tabKey]: sidebarStructure[mainHeader].availablePermissions.reduce((acc, perm) => {
          acc[perm] = false;
          return acc;
        }, {})
      }));
    } catch (error) {
      console.error('Error clearing all tab permissions:', error);
    }
  };

  const validate = () => {
    try {
      const { name } = formData;
      const errs = {};

      if (!name.trim()) errs.name = 'Role name is required';

      setErrors(errs);
      return Object.keys(errs).length === 0;
    } catch (error) {
      console.error('Validation error:', error);
      showErrorAlert('Form validation failed. Please check your inputs.', 'Validation Error');
      return false;
    }
  };

  const generatePayload = () => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active,
        moduleAccess: {},
        pageAccess: {},
        tabAccess: {},
        permissions: []
      };

      // Helper function to convert main header to API module name format
      const getApiModuleName = (mainHeader) => {
        // Use the first variant from moduleNameMap, or convert to uppercase
        const variants = moduleNameMap[mainHeader];
        if (variants && variants.length > 0) {
          // Return the first variant in uppercase (as per your API example)
          return variants[0].toUpperCase();
        }
        // Fallback: convert to uppercase
        return mainHeader.toUpperCase();
      };

      // Build moduleAccess, pageAccess, tabAccess and permissions
      Object.keys(sidebarStructure).forEach(mainHeader => {
        const hasAccess = mainHeaderAccess[mainHeader] || false;
        const apiModuleName = getApiModuleName(mainHeader);
        
        // Set module access (uppercase keys)
        payload.moduleAccess[apiModuleName] = hasAccess;
        
        if (hasAccess) {
          // Initialize page access for this module
          payload.pageAccess[apiModuleName] = {};
          payload.tabAccess[apiModuleName] = {};
          
          sidebarStructure[mainHeader].pages.forEach(page => {
            const pageKey = `${mainHeader}_${page.name}`;
            const pagePerms = pagePermissions[pageKey] || {};
            
            // Get selected permissions for this page
            const selectedPagePermissions = [];
            sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
              if (pagePerms[permType]) {
                selectedPagePermissions.push(permType.toUpperCase());
              }
            });
            
            // Add to pageAccess if there are selected permissions
            if (selectedPagePermissions.length > 0) {
              payload.pageAccess[apiModuleName][page.name] = selectedPagePermissions;
            }
            
            // Check for tab permissions
            if (page.tabs && page.tabs.length > 0) {
              // Initialize tab access for this page
              payload.tabAccess[apiModuleName][page.name] = {};
              
              page.tabs.forEach(tab => {
                const tabKey = `${mainHeader}_${page.name}_${tab}`;
                const tabPerms = tabPermissions[tabKey] || {};
                
                // Get selected permissions for this tab
                const selectedTabPermissions = [];
                sidebarStructure[mainHeader].availablePermissions.forEach(permType => {
                  if (tabPerms[permType]) {
                    selectedTabPermissions.push(permType.toUpperCase());
                  }
                });
                
                // Add to tabAccess if there are selected permissions
                if (selectedTabPermissions.length > 0) {
                  payload.tabAccess[apiModuleName][page.name][tab] = selectedTabPermissions;
                }
                
                // Add to permissions array for each selected tab permission
                selectedTabPermissions.forEach(permType => {
                  if (checkPermissionExists(mainHeader, page.name, permType, tab)) {
                    payload.permissions.push({
                      module: apiModuleName,
                      page: page.name,
                      tab: tab,
                      action: permType.toUpperCase()
                    });
                  }
                });
              });
              
              // Remove empty tab access objects
              if (Object.keys(payload.tabAccess[apiModuleName][page.name]).length === 0) {
                delete payload.tabAccess[apiModuleName][page.name];
              }
            } else {
              // No tabs - add page-level permissions to permissions array
              selectedPagePermissions.forEach(permType => {
                if (checkPermissionExists(mainHeader, page.name, permType, null)) {
                  payload.permissions.push({
                    module: apiModuleName,
                    page: page.name,
                    action: permType.toUpperCase()
                  });
                }
              });
            }
          });
          
          // Remove empty module entries
          if (Object.keys(payload.pageAccess[apiModuleName]).length === 0) {
            delete payload.pageAccess[apiModuleName];
          }
          if (Object.keys(payload.tabAccess[apiModuleName]).length === 0) {
            delete payload.tabAccess[apiModuleName];
          }
        }
      });

      console.log('Generated Payload:', payload);
      return payload;
    } catch (error) {
      console.error('Error generating payload:', error);
      showErrorAlert('Failed to generate form data. Please try again.', 'Data Generation Error');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = generatePayload();
    if (!payload) return;
    
    setIsSubmitting(true);
    
    try {
      if (id) {
        await axiosInstance.put(`/roles/${id}`, payload);
        await showFormSubmitToast('Role updated successfully!', () => navigate('/roles/all-role'));
      } else {
        await axiosInstance.post('/roles', payload);
        await showFormSubmitToast('Role created successfully!', () => navigate('/roles/all-role'));
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Save Role');
      showErrorAlert(errorMessage, 'Save Error');
      showFormSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate('/roles/all-role');

  // Check if a permission exists in the API
  const checkPermissionExists = (mainHeader, page, permissionType, tab = null) => {
    try {
      const apiModuleNames = moduleNameMap[mainHeader];
      if (!apiModuleNames || !apiModuleNames.length) return false;
      
      // Try to find permission with any of the module name variants
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

  // Render permissions table for a page
  const renderPermissionsTable = (mainHeader, page, isTab = false, tabName = null) => {
    try {
      const pageKey = tabName ? `${mainHeader}_${page}_${tabName}` : `${mainHeader}_${page}`;
      const permissions = isTab ? tabPermissions[pageKey] || {} : pagePermissions[pageKey] || {};
      const availablePermissions = sidebarStructure[mainHeader].availablePermissions;
      
      // For tabs, only show VIEW permission (renamed to "Access")
      const displayPermissions = isTab ? ["VIEW"] : availablePermissions;
      
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
                        disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
        <CAlert color="danger" size="sm">
          Error rendering permissions table. Please refresh the page.
        </CAlert>
      );
    }
  };

  if (permissionsLoading || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" size="lg" />
        <span className="ms-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className='form-container'>
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

      {/* Fetch Error Alert */}
      {fetchError && (
        <CAlert 
          color="warning" 
          className="mb-3"
        >
          <div className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-2" />
            <div>
              <strong>Data Load Error</strong>
              <p className="mb-0">{fetchError}</p>
              <small>Some features may be limited. You can still create/edit roles with basic functionality.</small>
            </div>
          </div>
        </CAlert>
      )}

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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* ------------ Permissions Section ------------- */}
            <div className="permissions-container mt-4">
              <h5 className="mb-3">Permissions Configuration</h5>
              <p className="text-muted mb-4">
                Total permissions available: {permissionsList.length}
                {fetchError && (
                  <span className="text-warning ms-2">(Permissions data may be incomplete)</span>
                )}
              </p>
              
              <CAccordion activeItemKey={activeModule}>
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
                            <CButtonGroup size="sm">
                              <CButton 
                                color={hasAccess ? "success" : "secondary"} 
                                variant={hasAccess ? "outline" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleMainHeaderAccessChange(mainHeader, true);
                                }}
                                disabled={isSubmitting}
                              >
                                <CIcon icon={cilCheck} /> Yes
                              </CButton>
                              <CButton 
                                color={!hasAccess ? "danger" : "secondary"} 
                                variant={!hasAccess ? "outline" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleMainHeaderAccessChange(mainHeader, false);
                                }}
                                disabled={isSubmitting}
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
                                            disabled={isSubmitting}
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
            </div>

            {/* ------------ Buttons ------------- */}
            <FormButtons 
              onCancel={handleCancel} 
              submitLabel={isSubmitting ? (id ? 'Updating...' : 'Creating...') : undefined}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleWithHierarchy;