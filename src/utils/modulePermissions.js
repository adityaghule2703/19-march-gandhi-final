// src/utils/modulePermissions.js

/**
 * Safe permission checking utilities with page-level granularity
 * This file provides safe wrappers around permission checks to avoid errors
 */

// Default empty permissions array
const DEFAULT_PERMISSIONS = [];

// Available actions
export const ACTIONS = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  PRINT: 'PRINT',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT'
};

// All module constants (matching your sidebar structure)
export const MODULES = {
  DASHBOARD: 'DASHBOARD',
  PURCHASE: 'PURCHASE',
  SALES: 'SALES',
  SALES_REPORT: 'SALES REPORT',
  QUOTATION: 'QUOTATION',
  ACCOUNT: 'ACCOUNT',
  INSURANCE: 'INSURANCE',
  RTO: 'RTO',
  FUND_MANAGEMENT: 'FUND MANAGEMENT',
  MASTERS: 'MASTERS',
  FUND_MASTER: 'FUND MASTER',
  ACCESSORIES_BILLING: 'ACCESSORIES BILLING',
  CUSTOMERS: 'CUSTOMERS',
  SUBDEALER: 'SUBDEALER',
  SUBDEALER_MASTER: 'SUBDEALER MASTER',
  SUBDEALER_BOOKING: 'SUBDEALER BOOKING',
  SUBDEALER_ACCOUNT: 'SUBDEALER ACCOUNT',
  USER_MANAGEMENT: 'USER MANAGEMENT',
  ROLES: 'ROLES',
  USER: 'USER',
  BUFFER_REPORT: 'BUFFER REPORT',
  MANAGER_DEVIATION: 'MANAGER DEVIATION'
};

// All page name constants (matching your API response and sidebar)
export const PAGES = {
  // Dashboard module pages
  DASHBOARD: {
    ANALYTICS: 'Dashboard'
  },
  
  // Purchase module pages
  PURCHASE: {
    INWARD_STOCK: 'Inward Stock',
    STOCK_VERIFICATION: 'Stock Verification',
    STOCK_TRANSFER: 'Stock Transfer',
    UPLOAD_CHALLAN: 'Upload Challan',
    RTO_CHASSIS: 'RTO Chassis'
  },
  
  // Sales module pages
  SALES: {
    NEW_BOOKING: 'New Booking',
    ALL_BOOKING: 'All Booking',
    SELF_INSURANCE: 'Self Insurance',
    DELIVERY_CHALLAN: 'Delivery Challan',
    GST_INVOICE: 'GST Invoice',
    HELMET_INVOICE: 'Helmet Invoice',
    DEAL_FORM: 'Deal Form',
    UPLOAD_DEAL_FORM: 'Upload Deal Form & Delivery Challan'
  },
  
  // Sales Report module pages
  SALES_REPORT: {
    SALES_PERSON_WISE: 'Sales Person Wise',
    PERIODIC_REPORT: 'Periodic Report'
  },
  
  // Quotation module pages
  QUOTATION: {
    QUOTATION_LIST: 'Quotation'
  },
  
  // Account module pages
  ACCOUNT: {
    DASHBOARD: 'Dashboard',
    RECEIPTS: 'Receipts',
    DEBIT_NOTE: 'Debit Note',
    REFUND: 'Refund',
    CANCELLED_BOOKING: 'Cancelled Booking',
    ALL_RECEIPTS: 'All Receipts',
    LEDGERS: 'Ledgers',
    EXCHANGE_LEDGER: 'Exchange Ledger',
    BROKER_PAYMENT_VERIFICATION: 'Broker Payment Verification',
    REPORT: 'Report'
  },
  
  // Insurance module pages
  INSURANCE: {
    DASHBOARD: 'Dashboard',
    INSURANCE_DETAILS: 'Insurance Details'
  },
  
  // RTO module pages
  RTO: {
    DASHBOARD: 'Dashboard',
    APPLICATION: 'Application',
    RTO_PAPER: 'RTO Paper',
    RTO_TAX: 'RTO Tax',
    HSRP_ORDERING: 'HSRP Ordering',
    HSRP_INSTALLATION: 'HSRP Installation',
    RC_CONFIRMATION: 'RC Confirmation',
    REPORT: 'Report'
  },
  
  // Fund Management module pages
  FUND_MANAGEMENT: {
    CASH_VOUCHER: 'Cash Voucher',
    CONTRA_VOUCHER: 'Contra Voucher',
    CONTRA_APPROVAL: 'Contra Approval',
    WORKSHOP_CASH_RECEIPT: 'Workshop Cash Receipt',
    ALL_CASH_RECEIPT: 'All Cash Receipt',
    CASH_BOOK: 'Cash Book',
    DAY_BOOK: 'Day Book',
    REPORT: 'Report'
  },
  
  // Masters module pages
  MASTERS: {
    LOCATION: 'Location',
    HEADERS: 'Headers',
    VEHICLES: 'Vehicles',
    MINIMUM_BOOKING_AMOUNT: 'Minimum Booking Amount',
    TEMPLATE_LIST: 'Template List',
    ACCESSORIES: 'Accessories',
    COLOUR: 'Colour',
    DOCUMENTS: 'Documents',
    TERMS_CONDITIONS: 'Terms & Conditions',
    OFFER: 'Offer',
    ATTACHMENTS: 'Attachments',
    DECLARATION: 'Declaration',
    RTO_MASTER: 'RTO',
    FINANCER: 'Financer',
    FINANCE_RATES: 'Finance Rates',
    INSURANCE_PROVIDERS: 'Insurance Providers',
    BROKERS: 'Brokers',
    BROKER_COMMISSION_RANGE: 'Broker Commission Range',
    VERTICAL_MASTERS: 'Vertical Masters'
  },
  
  // Fund Master module pages
  FUND_MASTER: {
    CASH_ACCOUNT_MASTER: 'Cash Account Master',
    BANK_ACCOUNT_MASTER: 'Bank Account Master',
    PAYMENT_MODE: 'Payment Mode',
    EXPENSE_MASTER: 'Expense Master',
    ADD_OPENING_BALANCE: 'Add Opening Balance'
  },
  
  // Accessories Billing module pages
  ACCESSORIES_BILLING: {
    ACCESSORIES_BILLING: 'Accessories Billing'
  },
  
  // Customers module pages
  CUSTOMERS: {
    ALL_CUSTOMERS: 'Customers'
  },
  
  // Subdealer module pages
  SUBDEALER: {
    STOCK_AUDIT: 'Subdealer Stock Audit'
  },
  
  // Subdealer Master module pages
  SUBDEALER_MASTER: {
    SUBDEALER_LIST: 'Subdealer List',
    SUBDEALER_AUDIT_LIST: 'Subdealer Audit List',
    SUBDEALER_COMMISSION: 'Subdealer Commission',
    CALCULATE_COMMISSION: 'Calculate Commission'
  },
  
  // Subdealer Booking module pages
  SUBDEALER_BOOKING: {
    NEW_BOOKING: 'New Booking',
    ALL_BOOKING: 'All Booking',
    DELIVERY_CHALLAN: 'Delivery Challan'
  },
  
  // Subdealer Account module pages
  SUBDEALER_ACCOUNT: {
    ADD_BALANCE: 'Add Balance',
    ONACCOUNT_BALANCE: 'OnAccount Balance',
    ADD_AMOUNT: 'Add Amount',
    FINANCE_PAYMENT: 'Finance Payment',
    PAYMENT_VERIFICATION: 'Payment Verification',
    SUBDEALER_COMMISSION: 'Subdealer Commission',
    PAYMENT_SUMMARY: 'Payment Summary',
    SUBDEALER_LEDGER: 'Subdealer Ledger',
    CUSTOMER_LEDGER: 'Customer Ledger',
    SUMMARY: 'Summary'
  },
  
  // Roles module pages (under User Management)
  ROLES: {
    CREATE_ROLE: 'Create Role',
    ALL_ROLE: 'All Role'
  },
  
  // User module pages (under User Management)
  USER: {
    ADD_USER: 'Add User',
    USER_LIST: 'User List'
  },
  
  // Buffer Report module pages
  BUFFER_REPORT: {
    BUFFER_LIST: 'Buffer Report'
  },
  
  // Manager Deviation module pages
  MANAGER_DEVIATION: {
    MANAGER_DEVIATION: 'Manager Deviation'
  }
};

// Helper to get page name from route path (optional, but useful)
export const getPageFromRoute = (routePath) => {
  const routeMap = {
    // Dashboard
    '/app/dashboard/analytics': PAGES.DASHBOARD.ANALYTICS,
    
    // Purchase
    '/inward-list': PAGES.PURCHASE.INWARD_STOCK,
    '/stock-verification': PAGES.PURCHASE.STOCK_VERIFICATION,
    '/stock-transfer': PAGES.PURCHASE.STOCK_TRANSFER,
    '/upload-challan': PAGES.PURCHASE.UPLOAD_CHALLAN,
    '/rto-chassis': PAGES.PURCHASE.RTO_CHASSIS,
    
    // Sales
    '/new-booking': PAGES.SALES.NEW_BOOKING,
    '/booking-list': PAGES.SALES.ALL_BOOKING,
    '/self-insurance': PAGES.SALES.SELF_INSURANCE,
    '/delivery-challan': PAGES.SALES.DELIVERY_CHALLAN,
    '/invoice': PAGES.SALES.GST_INVOICE,
    '/helmet-invoice': PAGES.SALES.HELMET_INVOICE,
    '/deal-form': PAGES.SALES.DEAL_FORM,
    '/upload-deal': PAGES.SALES.UPLOAD_DEAL_FORM,
    
    // Sales Report
    '/sales-report': PAGES.SALES_REPORT.SALES_PERSON_WISE,
    '/periodic-report': PAGES.SALES_REPORT.PERIODIC_REPORT,
    
    // Quotation
    '/quotation-list': PAGES.QUOTATION.QUOTATION_LIST,
    
    // Account
    '/account-dashboard': PAGES.ACCOUNT.DASHBOARD,
    '/account/receipt': PAGES.ACCOUNT.RECEIPTS,
    '/debit-note': PAGES.ACCOUNT.DEBIT_NOTE,
    '/refund': PAGES.ACCOUNT.REFUND,
    '/cancelled-booking': PAGES.ACCOUNT.CANCELLED_BOOKING,
    '/account/all-receipt': PAGES.ACCOUNT.ALL_RECEIPTS,
    '/view-ledgers': PAGES.ACCOUNT.LEDGERS,
    '/exchange-ledgers': PAGES.ACCOUNT.EXCHANGE_LEDGER,
    '/broker-payment': PAGES.ACCOUNT.BROKER_PAYMENT_VERIFICATION,
    '/receipt-report': PAGES.ACCOUNT.REPORT,
    
    // Insurance
    '/insurance-dashboard': PAGES.INSURANCE.DASHBOARD,
    '/insurance-details': PAGES.INSURANCE.INSURANCE_DETAILS,
    
    // RTO
    '/rto-dashboard': PAGES.RTO.DASHBOARD,
    '/rto/application': PAGES.RTO.APPLICATION,
    '/rto/rto-paper': PAGES.RTO.RTO_PAPER,
    '/rto/rto-tax': PAGES.RTO.RTO_TAX,
    '/rto/hsrp-ordering': PAGES.RTO.HSRP_ORDERING,
    '/rto/hsrp-installation': PAGES.RTO.HSRP_INSTALLATION,
    '/rto/rc-confirmation': PAGES.RTO.RC_CONFIRMATION,
    '/rto/rto-report': PAGES.RTO.REPORT,
    
    // Fund Management
    '/cash-voucher': PAGES.FUND_MANAGEMENT.CASH_VOUCHER,
    '/contra-voucher': PAGES.FUND_MANAGEMENT.CONTRA_VOUCHER,
    '/contra-approval': PAGES.FUND_MANAGEMENT.CONTRA_APPROVAL,
    '/workshop-receipt': PAGES.FUND_MANAGEMENT.WORKSHOP_CASH_RECEIPT,
    '/cash-receipt': PAGES.FUND_MANAGEMENT.ALL_CASH_RECEIPT,
    '/cash-book': PAGES.FUND_MANAGEMENT.CASH_BOOK,
    '/day-book': PAGES.FUND_MANAGEMENT.DAY_BOOK,
    '/fund-report': PAGES.FUND_MANAGEMENT.REPORT,
    
    // Masters
    '/branch/branch-list': PAGES.MASTERS.LOCATION,
    '/headers/headers-list': PAGES.MASTERS.HEADERS,
    '/model/model-list': PAGES.MASTERS.VEHICLES,
    '/minimumbookingamount/minimum-booking-amount-list': PAGES.MASTERS.MINIMUM_BOOKING_AMOUNT,
    '/templateform/template-list': PAGES.MASTERS.TEMPLATE_LIST,
    '/accessories/accessories-list': PAGES.MASTERS.ACCESSORIES,
    '/color/color-list': PAGES.MASTERS.COLOUR,
    '/documents/documents-list': PAGES.MASTERS.DOCUMENTS,
    '/conditions/conditions-list': PAGES.MASTERS.TERMS_CONDITIONS,
    '/offers/offer-list': PAGES.MASTERS.OFFER,
    '/attachments/attachments-list': PAGES.MASTERS.ATTACHMENTS,
    '/declaration-master': PAGES.MASTERS.DECLARATION,
    '/rto/rto-list': PAGES.MASTERS.RTO_MASTER,
    '/financer/financer-list': PAGES.MASTERS.FINANCER,
    '/financer-rates/rates-list': PAGES.MASTERS.FINANCE_RATES,
    '/insurance-provider/provider-list': PAGES.MASTERS.INSURANCE_PROVIDERS,
    '/broker/broker-list': PAGES.MASTERS.BROKERS,
    '/broker/commission-range': PAGES.MASTERS.BROKER_COMMISSION_RANGE,
    '/vertical-master/vertical-master-list': PAGES.MASTERS.VERTICAL_MASTERS,
    
    // Fund Master
    '/cash-master': PAGES.FUND_MASTER.CASH_ACCOUNT_MASTER,
    '/bank-master': PAGES.FUND_MASTER.BANK_ACCOUNT_MASTER,
    '/payment-mode': PAGES.FUND_MASTER.PAYMENT_MODE,
    '/expense': PAGES.FUND_MASTER.EXPENSE_MASTER,
    '/opening-balance': PAGES.FUND_MASTER.ADD_OPENING_BALANCE,
    
    // Accessories Billing
    '/accessories-billing': PAGES.ACCESSORIES_BILLING.ACCESSORIES_BILLING,
    
    // Customers
    '/all-customers': PAGES.CUSTOMERS.ALL_CUSTOMERS,
    
    // Subdealer
    '/stock-audit-list': PAGES.SUBDEALER.STOCK_AUDIT,
    
    // Subdealer Master
    '/subdealer-list': PAGES.SUBDEALER_MASTER.SUBDEALER_LIST,
    '/subdealer-audit-list': PAGES.SUBDEALER_MASTER.SUBDEALER_AUDIT_LIST,
    '/subdealer-commission': PAGES.SUBDEALER_MASTER.SUBDEALER_COMMISSION,
    '/subdealer/calculate-commission': PAGES.SUBDEALER_MASTER.CALCULATE_COMMISSION,
    
    // Subdealer Booking
    '/subdealer-booking': PAGES.SUBDEALER_BOOKING.NEW_BOOKING,
    '/subdealer-all-bookings': PAGES.SUBDEALER_BOOKING.ALL_BOOKING,
    '/subdealer/delivery-challan': PAGES.SUBDEALER_BOOKING.DELIVERY_CHALLAN,
    
    // Subdealer Account
    '/subdealer-account/add-balance': PAGES.SUBDEALER_ACCOUNT.ADD_BALANCE,
    '/subdealer-account/onaccount-balance': PAGES.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE,
    '/subdealer-account/add-amount': PAGES.SUBDEALER_ACCOUNT.ADD_AMOUNT,
    '/subdealer-account/receipt': PAGES.SUBDEALER_ACCOUNT.FINANCE_PAYMENT,
    '/subdealer/payment-verification': PAGES.SUBDEALER_ACCOUNT.PAYMENT_VERIFICATION,
    '/subdealer/payment': PAGES.SUBDEALER_ACCOUNT.SUBDEALER_COMMISSION,
    '/subdealer/payment-summary': PAGES.SUBDEALER_ACCOUNT.PAYMENT_SUMMARY,
    '/subdealer-ledger': PAGES.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER,
    '/subdealer/customer-ledger': PAGES.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER,
    '/subdealer/summary': PAGES.SUBDEALER_ACCOUNT.SUMMARY,
    
    // Roles (User Management)
    '/roles/create-role': PAGES.ROLES.CREATE_ROLE,
    '/roles/all-role': PAGES.ROLES.ALL_ROLE,
    
    // User (User Management)
    '/users/add-user': PAGES.USER.ADD_USER,
    '/users/users-list': PAGES.USER.USER_LIST,
    
    // Buffer Report
    '/buffer/buffer-list': PAGES.BUFFER_REPORT.BUFFER_LIST,
    
    // Manager Deviation
    '/manager-deviation': PAGES.MANAGER_DEVIATION.MANAGER_DEVIATION
  };
  
  return routeMap[routePath] || null;
};

// Helper to get module from route path
export const getModuleFromRoute = (routePath) => {
  const moduleMap = {
    // Dashboard
    '/app/dashboard/analytics': MODULES.DASHBOARD,
    
    // Purchase
    '/inward-list': MODULES.PURCHASE,
    '/stock-verification': MODULES.PURCHASE,
    '/stock-transfer': MODULES.PURCHASE,
    '/upload-challan': MODULES.PURCHASE,
    '/rto-chassis': MODULES.PURCHASE,
    
    // Sales
    '/new-booking': MODULES.SALES,
    '/booking-list': MODULES.SALES,
    '/self-insurance': MODULES.SALES,
    '/delivery-challan': MODULES.SALES,
    '/invoice': MODULES.SALES,
    '/helmet-invoice': MODULES.SALES,
    '/deal-form': MODULES.SALES,
    '/upload-deal': MODULES.SALES,
    
    // Sales Report
    '/sales-report': MODULES.SALES_REPORT,
    '/periodic-report': MODULES.SALES_REPORT,
    
    // Quotation
    '/quotation-list': MODULES.QUOTATION,
    
    // Account
    '/account-dashboard': MODULES.ACCOUNT,
    '/account/receipt': MODULES.ACCOUNT,
    '/debit-note': MODULES.ACCOUNT,
    '/refund': MODULES.ACCOUNT,
    '/cancelled-booking': MODULES.ACCOUNT,
    '/account/all-receipt': MODULES.ACCOUNT,
    '/view-ledgers': MODULES.ACCOUNT,
    '/exchange-ledgers': MODULES.ACCOUNT,
    '/broker-payment': MODULES.ACCOUNT,
    '/receipt-report': MODULES.ACCOUNT,
    
    // Insurance
    '/insurance-dashboard': MODULES.INSURANCE,
    '/insurance-details': MODULES.INSURANCE,
    
    // RTO
    '/rto-dashboard': MODULES.RTO,
    '/rto/application': MODULES.RTO,
    '/rto/rto-paper': MODULES.RTO,
    '/rto/rto-tax': MODULES.RTO,
    '/rto/hsrp-ordering': MODULES.RTO,
    '/rto/hsrp-installation': MODULES.RTO,
    '/rto/rc-confirmation': MODULES.RTO,
    '/rto/rto-report': MODULES.RTO,
    
    // Fund Management
    '/cash-voucher': MODULES.FUND_MANAGEMENT,
    '/contra-voucher': MODULES.FUND_MANAGEMENT,
    '/contra-approval': MODULES.FUND_MANAGEMENT,
    '/workshop-receipt': MODULES.FUND_MANAGEMENT,
    '/cash-receipt': MODULES.FUND_MANAGEMENT,
    '/cash-book': MODULES.FUND_MANAGEMENT,
    '/day-book': MODULES.FUND_MANAGEMENT,
    '/fund-report': MODULES.FUND_MANAGEMENT,
    
    // Masters
    '/branch/branch-list': MODULES.MASTERS,
    '/headers/headers-list': MODULES.MASTERS,
    '/model/model-list': MODULES.MASTERS,
    '/minimumbookingamount/minimum-booking-amount-list': MODULES.MASTERS,
    '/templateform/template-list': MODULES.MASTERS,
    '/accessories/accessories-list': MODULES.MASTERS,
    '/color/color-list': MODULES.MASTERS,
    '/documents/documents-list': MODULES.MASTERS,
    '/conditions/conditions-list': MODULES.MASTERS,
    '/offers/offer-list': MODULES.MASTERS,
    '/attachments/attachments-list': MODULES.MASTERS,
    '/declaration-master': MODULES.MASTERS,
    '/rto/rto-list': MODULES.MASTERS,
    '/financer/financer-list': MODULES.MASTERS,
    '/financer-rates/rates-list': MODULES.MASTERS,
    '/insurance-provider/provider-list': MODULES.MASTERS,
    '/broker/broker-list': MODULES.MASTERS,
    '/broker/commission-range': MODULES.MASTERS,
    '/vertical-master/vertical-master-list': MODULES.MASTERS,
    
    // Fund Master
    '/cash-master': MODULES.FUND_MASTER,
    '/bank-master': MODULES.FUND_MASTER,
    '/payment-mode': MODULES.FUND_MASTER,
    '/expense': MODULES.FUND_MASTER,
    '/opening-balance': MODULES.FUND_MASTER,
    
    // Accessories Billing
    '/accessories-billing': MODULES.ACCESSORIES_BILLING,
    
    // Customers
    '/all-customers': MODULES.CUSTOMERS,
    
    // Subdealer
    '/stock-audit-list': MODULES.SUBDEALER,
    
    // Subdealer Master
    '/subdealer-list': MODULES.SUBDEALER_MASTER,
    '/subdealer-audit-list': MODULES.SUBDEALER_MASTER,
    '/subdealer-commission': MODULES.SUBDEALER_MASTER,
    '/subdealer/calculate-commission': MODULES.SUBDEALER_MASTER,
    
    // Subdealer Booking
    '/subdealer-booking': MODULES.SUBDEALER_BOOKING,
    '/subdealer-all-bookings': MODULES.SUBDEALER_BOOKING,
    '/subdealer/delivery-challan': MODULES.SUBDEALER_BOOKING,
    
    // Subdealer Account
    '/subdealer-account/add-balance': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer-account/onaccount-balance': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer-account/add-amount': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer-account/receipt': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer/payment-verification': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer/payment': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer/payment-summary': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer-ledger': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer/customer-ledger': MODULES.SUBDEALER_ACCOUNT,
    '/subdealer/summary': MODULES.SUBDEALER_ACCOUNT,
    
    // Roles (User Management)
    '/roles/create-role': MODULES.ROLES,
    '/roles/all-role': MODULES.ROLES,
    
    // User (User Management)
    '/users/add-user': MODULES.USER,
    '/users/users-list': MODULES.USER,
    
    // Buffer Report
    '/buffer/buffer-list': MODULES.BUFFER_REPORT,
    
    // Manager Deviation
    '/manager-deviation': MODULES.MANAGER_DEVIATION
  };
  
  return moduleMap[routePath] || null;
};

/**
 * Safe permission check with page-level granularity
 * @param {Array} permissions - User's permissions array
 * @param {string} module - Module name (e.g., 'PURCHASE')
 * @param {string} page - Page name (e.g., 'Stock Verification')
 * @param {string} action - Action name (e.g., 'VIEW', 'CREATE')
 * @returns {boolean} - Whether user has permission
 */
export const hasSafePagePermission = (permissions, module, page, action) => {
  try {
    // If permissions is null/undefined or not an array, use default
    const safePermissions = permissions && Array.isArray(permissions) ? permissions : DEFAULT_PERMISSIONS;
    
    // If any parameter is missing, return false
    if (!module || !page || !action || 
        typeof module !== 'string' || 
        typeof page !== 'string' || 
        typeof action !== 'string') {
      console.warn('Invalid module, page, or action parameter in hasSafePagePermission');
      return false;
    }
    
    const moduleUpper = module.toUpperCase();
    const pageUpper = page;
    const actionUpper = action.toUpperCase();
    
    // Check if any permission matches
    return safePermissions.some(permission => {
      if (!permission || typeof permission !== 'object') {
        return false;
      }
      
      const permModule = permission.module ? String(permission.module).toUpperCase() : '';
      const permPage = permission.page ? String(permission.page) : '';
      const permAction = permission.action ? String(permission.action).toUpperCase() : '';
      
      return (
        permModule === moduleUpper && 
        permPage === pageUpper && 
        permAction === actionUpper
      );
    });
  } catch (error) {
    console.error('Error in hasSafePagePermission:', error);
    return false;
  }
};

/**
 * Safe module-level permission check (backward compatibility)
 * @param {Array} permissions - User's permissions array
 * @param {string} module - Module name
 * @param {string} action - Action name
 * @returns {boolean} - Whether user has any permission for this module and action
 */
export const hasSafePermission = (permissions, module, action) => {
  try {
    const safePermissions = permissions && Array.isArray(permissions) ? permissions : DEFAULT_PERMISSIONS;
    
    if (!module || !action || typeof module !== 'string' || typeof action !== 'string') {
      console.warn('Invalid module or action parameter in hasSafePermission');
      return false;
    }
    
    const moduleUpper = module.toUpperCase();
    const actionUpper = action.toUpperCase();
    
    // Check if user has ANY permission for this module and action (regardless of page)
    return safePermissions.some(permission => {
      if (!permission || typeof permission !== 'object') {
        return false;
      }
      
      const permModule = permission.module ? String(permission.module).toUpperCase() : '';
      const permAction = permission.action ? String(permission.action).toUpperCase() : '';
      
      return permModule === moduleUpper && permAction === actionUpper;
    });
  } catch (error) {
    console.error('Error in hasSafePermission:', error);
    return false;
  }
};

/**
 * Check if user can view a specific page
 * @param {Array} permissions - User permissions
 * @param {string} module - Module name
 * @param {string} page - Page name
 * @returns {boolean} - Whether user can view the page
 */
export const canViewPage = (permissions, module, page) => {
  return hasSafePagePermission(permissions, module, page, ACTIONS.VIEW);
};

/**
 * Check if user can create in a specific page
 * @param {Array} permissions - User permissions
 * @param {string} module - Module name
 * @param {string} page - Page name
 * @returns {boolean} - Whether user can create
 */
export const canCreateInPage = (permissions, module, page) => {
  return hasSafePagePermission(permissions, module, page, ACTIONS.CREATE);
};

/**
 * Check if user can update in a specific page
 * @param {Array} permissions - User permissions
 * @param {string} module - Module name
 * @param {string} page - Page name
 * @returns {boolean} - Whether user can update
 */
export const canUpdateInPage = (permissions, module, page) => {
  return hasSafePagePermission(permissions, module, page, ACTIONS.UPDATE);
};

/**
 * Check if user can delete in a specific page
 * @param {Array} permissions - User permissions
 * @param {string} module - Module name
 * @param {string} page - Page name
 * @returns {boolean} - Whether user can delete
 */
export const canDeleteInPage = (permissions, module, page) => {
  return hasSafePagePermission(permissions, module, page, ACTIONS.DELETE);
};

/**
 * Get all permissions for a specific page
 * @param {Array} permissions - User permissions
 * @param {string} module - Module name
 * @param {string} page - Page name
 * @returns {Array} - Array of actions user has for this page
 */
export const getPagePermissions = (permissions, module, page) => {
  try {
    const safePermissions = permissions && Array.isArray(permissions) ? permissions : DEFAULT_PERMISSIONS;
    
    if (!module || !page || typeof module !== 'string' || typeof page !== 'string') {
      return [];
    }
    
    const moduleUpper = module.toUpperCase();
    const pageUpper = page;
    
    return safePermissions
      .filter(permission => {
        if (!permission || typeof permission !== 'object') {
          return false;
        }
        
        const permModule = permission.module ? String(permission.module).toUpperCase() : '';
        const permPage = permission.page ? String(permission.page) : '';
        
        return permModule === moduleUpper && permPage === pageUpper;
      })
      .map(permission => permission.action)
      .filter(action => action);
  } catch (error) {
    console.error('Error in getPagePermissions:', error);
    return [];
  }
};

/**
 * Check if user can view a route (using route path)
 * @param {Array} permissions - User permissions
 * @param {string} routePath - Route path (e.g., '/inward-list')
 * @returns {boolean} - Whether user can view the route
 */
export const canViewRoute = (permissions, routePath) => {
  const module = getModuleFromRoute(routePath);
  const page = getPageFromRoute(routePath);
  
  if (!module || !page) {
    console.warn(`Could not determine module/page for route: ${routePath}`);
    return false;
  }
  
  return canViewPage(permissions, module, page);
};

/**
 * Get all accessible routes for a user
 * @param {Array} permissions - User permissions
 * @returns {Array} - Array of accessible route paths
 */
export const getAccessibleRoutes = (permissions) => {
  const allRoutes = Object.keys(getPageFromRoute);
  return allRoutes.filter(route => canViewRoute(permissions, route));
};

/**
 * Permission guard component for page-level permissions
 * @param {Object} props
 * @param {Array} props.permissions - User permissions
 * @param {string} props.module - Required module
 * @param {string} props.page - Required page
 * @param {string} props.action - Required action
 * @param {React.ReactNode} props.children - Children to render if permission granted
 * @param {React.ReactNode} props.fallback - Fallback to render if no permission
 * @returns {React.ReactNode}
 */
export const SafePagePermissionGuard = ({ 
  permissions, 
  module, 
  page,
  action = ACTIONS.VIEW, 
  children, 
  fallback = null 
}) => {
  if (hasSafePagePermission(permissions, module, page, action)) {
    return children;
  }
  return fallback;
};

/**
 * Route-based permission guard component
 * @param {Object} props
 * @param {Array} props.permissions - User permissions
 * @param {string} props.routePath - Route path
 * @param {string} props.action - Required action
 * @param {React.ReactNode} props.children - Children to render if permission granted
 * @param {React.ReactNode} props.fallback - Fallback to render if no permission
 * @returns {React.ReactNode}
 */
export const SafeRoutePermissionGuard = ({ 
  permissions, 
  routePath,
  action = ACTIONS.VIEW, 
  children, 
  fallback = null 
}) => {
  const module = getModuleFromRoute(routePath);
  const page = getPageFromRoute(routePath);
  
  if (!module || !page) {
    console.warn(`Could not determine module/page for route: ${routePath}`);
    return fallback;
  }
  
  if (hasSafePagePermission(permissions, module, page, action)) {
    return children;
  }
  return fallback;
};

/**
 * Custom hook for safe page-level permission checking
 * @returns {Object} - Permission checking utilities
 */
export const useSafePagePermissions = () => {
  let permissions = [];
  
  try {
    // Try to get permissions from localStorage as fallback
    const storedPermissions = localStorage.getItem('userPermissions');
    if (storedPermissions) {
      permissions = JSON.parse(storedPermissions) || [];
    }
  } catch (error) {
    console.error('Error reading permissions from localStorage:', error);
    permissions = [];
  }
  
  return {
    // Check specific page permission
    hasPagePermission: (module, page, action) => hasSafePagePermission(permissions, module, page, action),
    
    // Check specific module permission (backward compatibility)
    hasPermission: (module, action) => hasSafePermission(permissions, module, action),
    
    // Check route permission
    hasRoutePermission: (routePath, action = ACTIONS.VIEW) => {
      const module = getModuleFromRoute(routePath);
      const page = getPageFromRoute(routePath);
      return module && page ? hasSafePagePermission(permissions, module, page, action) : false;
    },
    
    // Convenience functions
    canViewPage: (module, page) => canViewPage(permissions, module, page),
    canCreateInPage: (module, page) => canCreateInPage(permissions, module, page),
    canUpdateInPage: (module, page) => canUpdateInPage(permissions, module, page),
    canDeleteInPage: (module, page) => canDeleteInPage(permissions, module, page),
    
    // Route-based convenience functions
    canViewRoute: (routePath) => canViewRoute(permissions, routePath),
    
    // Get all permissions for a page
    getPagePermissions: (module, page) => getPagePermissions(permissions, module, page),
    
    // Get accessible routes
    getAccessibleRoutes: () => getAccessibleRoutes(permissions),
    
    // Raw permissions
    permissions: permissions
  };
};

/**
 * Higher-order component for page-level route protection
 * @param {React.Component} Component - Component to wrap
 * @param {string} module - Required module
 * @param {string} page - Required page
 * @param {string} action - Required action
 * @returns {React.Component} - Protected component
 */
export const withSafePagePermission = (Component, module, page, action = ACTIONS.VIEW) => {
  return function SafeProtectedComponent(props) {
    const { hasPagePermission } = useSafePagePermissions();
    
    if (!hasPagePermission(module, page, action)) {
      return (
        <div className="alert alert-danger m-3" role="alert">
          You do not have permission to access this page.
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

/**
 * Higher-order component for route-based protection
 * @param {React.Component} Component - Component to wrap
 * @param {string} routePath - Route path
 * @param {string} action - Required action
 * @returns {React.Component} - Protected component
 */
export const withRoutePermission = (Component, routePath, action = ACTIONS.VIEW) => {
  return function SafeRouteProtectedComponent(props) {
    const { hasRoutePermission } = useSafePagePermissions();
    
    if (!hasRoutePermission(routePath, action)) {
      return (
        <div className="alert alert-danger m-3" role="alert">
          You do not have permission to access this page.
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// Backward compatibility functions (for modules without page-level permissions)
export const canViewModule = (permissions, module) => {
  return hasSafePermission(permissions, module, ACTIONS.VIEW);
};

export const canCreateInModule = (permissions, module) => {
  return hasSafePermission(permissions, module, ACTIONS.CREATE);
};

export const canUpdateInModule = (permissions, module) => {
  return hasSafePermission(permissions, module, ACTIONS.UPDATE);
};

export const canDeleteInModule = (permissions, module) => {
  return hasSafePermission(permissions, module, ACTIONS.DELETE);
};

// Export all utilities
export default {
  ACTIONS,
  MODULES,
  PAGES,
  getPageFromRoute,
  getModuleFromRoute,
  hasSafePermission,
  hasSafePagePermission,
  canViewPage,
  canCreateInPage,
  canUpdateInPage,
  canDeleteInPage,
  canViewRoute,
  getPagePermissions,
  getAccessibleRoutes,
  SafePagePermissionGuard,
  SafeRoutePermissionGuard,
  useSafePagePermissions,
  withSafePagePermission,
  withRoutePermission,
  canViewModule,
  canCreateInModule,
  canUpdateInModule,
  canDeleteInModule
};