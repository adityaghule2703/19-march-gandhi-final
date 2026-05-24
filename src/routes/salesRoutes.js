import React from 'react';





const NewBooking = React.lazy(() => import('../views/sales/booking/NewBooking'))
const SelfInsurance = React.lazy(() => import('../views/sales/booking/SelfInsurance'))
const BookingList = React.lazy(() => import('../views/sales/booking/BookingList'))
const DeliveryChallan = React.lazy(() => import('../views/sales/delivery-challan/DeliveryChallan'))
const Invoice = React.lazy(() => import('../views/sales/Invoice'))
const DummyInvoice = React.lazy(() => import('../views/sales/DummyInvoice'))
const HelmetInvoice = React.lazy(() => import('../views/sales/HelmetInvoice'))
const DealForm = React.lazy(() => import('../views/sales/DealForm'))
const UploadDealForm = React.lazy(() => import('../views/sales/UploadDealForm'))
const UploadFinance = React.lazy(() => import('../views/sales/UploadFinance'))
const uploadKYC = React.lazy(() => import('../views/sales/UploadKYC'))
const UploadKYCRto = React.lazy(() => import('../views/sales/UploadKYCRto'))
const SalesReport = React.lazy(() => import('../views/sales-report/SalesReport'))
const SalesDashboard = React.lazy(() => import('../views/sales-report/SalesDashboard'))
const ClaimDashboard = React.lazy(() => import('../views/sales-report/ClaimDashboard'))
const SalesDetailedReport = React.lazy(() => import('../views/sales-report/SalesDetailedReport'))
const PeriodicReport = React.lazy(() => import('../views/sales-report/PeriodicReport'))
export const salesRoutes = [
    { path:'/new-booking', name:'New Booking', element:NewBooking},
    { path:'/self-insurance', name:'Self Insurance', element:SelfInsurance},
    { path:'/booking-form/:id', name:'Edit Booking', element:NewBooking},
    { path:'/booking-list', name:'Booking List', element:BookingList},
    { path:'/update-booking/:id', name:'Edit Booking', element:NewBooking},
    { path:'/upload-finance/:id', name:'Upload Finance', element:UploadFinance},
    { path:'/upload-kyc/:id', name:'Upload KYC', element:uploadKYC},
    { path:'/upload-kyc-rto/:id', name:'Upload KYC RTO', element:UploadKYCRto},
  
    { path:'/delivery-challan', name:'Delivery Challan', element:DeliveryChallan},
    { path:'/invoice', name:'GST Invoice', element:Invoice},
    
     { path:'/dummy-invoice', name:'Proforma Invoice', element:DummyInvoice},
    { path:'/helmet-invoice', name:'Helmet Invoice', element:HelmetInvoice},
    { path:'/deal-form', name:'Deal Form', element:DealForm},
    { path:'/upload-deal', name:'Upload Deal', element:UploadDealForm},
    
    { path:'/sales-report', name:'Sales Report', element:SalesReport},
    { path:'/sales-dashboard', name:'Sales Dashboard', element:SalesDashboard},
     { path:'/claim-dashboard', name:'Claim Dashboard', element:ClaimDashboard},
    { path:'/sales-detailed-report', name:'Sales Detailed Report', element:SalesDetailedReport},
    { path:'/periodic-report', name:'Periodic Report', element:PeriodicReport},
  
];