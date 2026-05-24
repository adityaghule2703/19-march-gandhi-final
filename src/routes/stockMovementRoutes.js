import React from 'react';



const StockMovement = React.lazy(() => import('../views/stockmovement/StockMovement'))
const StockMovementHistory = React.lazy(() => import('../views/stockmovement/StockMovementHistory'))
const StockMovementRequests = React.lazy(() => import('../views/stockmovement/StockMovementRequests'))

export const stockMovementRoutes = [
  { path: '/stock-movement', name: 'INTER DEALER TRANSFER List', element: StockMovement},
   { path: '/stock-movement-history', name: 'INTER DEALER TRANSFER History', element: StockMovementHistory},
      { path: '/stock-movement-requests', name: 'INTER DEALER TRANSFER Requests', element: StockMovementRequests},
 
];