import React from 'react';



const StockMovement = React.lazy(() => import('../views/stockmovement/StockMovement'))
const StockMovementHistory = React.lazy(() => import('../views/stockmovement/StockMovementHistory'))
const StockMovementRequests = React.lazy(() => import('../views/stockmovement/StockMovementRequests'))

export const stockMovementRoutes = [
  { path: '/stock-movement', name: 'Stock Movement', element: StockMovement},
   { path: '/stock-movement-history', name: 'Stock Movement History', element: StockMovementHistory},
      { path: '/stock-movement-requests', name: 'Stock Movement Requests', element: StockMovementRequests},
 
];