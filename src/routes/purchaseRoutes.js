import React from 'react';





const StockDashboard = React.lazy(() => import('../views/purchase/StockDashboard'))
const PurchaseOrderDashboard = React.lazy(() => import('../views/purchase/PurchaseOrderDashboard'))
const PurchaseOrderConfig = React.lazy(() => import('../views/purchase/PurchaseOrderConfig'))
const PurchaseConfigList = React.lazy(() => import('../views/purchase/PurchaseConfigList'))
const InwardStock = React.lazy(() => import('../views/purchase/InwardStock'))
const RtoChassis = React.lazy(()=> import('../views/purchase/RtoChassis'))
const StockList = React.lazy(() => import('../views/purchase/StockList'))
const StockAlert = React.lazy(() => import('../views/purchase/StockAlert'))
const StockVerification = React.lazy(() => import('../views/purchase/StockVerification'))
const StockTransfer = React.lazy(() => import('../views/purchase/StockTransfer'))
const UploadChallan = React.lazy(() => import('../views/purchase/UploadChallan'))
export const purchaseRoutes = [
  { path: '/inward-stock', name: 'Inward Stock', element: InwardStock},
  { path: '/stock-dashboard', name: 'Stock Dashboard', element: StockDashboard},
   { path: '/purchase-order-dashboard', name: 'Purchase Order Dashboard', element: PurchaseOrderDashboard},
    { path: '/purchase-order-config', name: 'Purchase Order Dashboard', element: PurchaseOrderConfig},
      { path: '/purchase-config-list', name: 'Purchase Config List', element: PurchaseConfigList},
  {path:'/rto-chassis', name:'RTO Chassis', element: RtoChassis },
  { path: '/update-inward/:id', name: 'Update Inward Stock', element: InwardStock},
  { path: '/inward-list', name: 'Stock List', element: StockList},
  { path: '/stock-alert', name: 'Stock Alert', element: StockAlert},
  { path:'/stock-verification',name: 'Stock Verification', element: StockVerification},
  { path:'/stock-transfer',name: 'Stock Transfer', element: StockTransfer},
  { path:'/upload-challan',name: 'Upload Challan', element: UploadChallan},
];