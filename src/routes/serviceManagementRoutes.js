import React from 'react';



const Parts = React.lazy(() => import('../views/servicemanagement/parts/Parts'))
const Labour = React.lazy(() => import('../views/servicemanagement/labour/Labour'))
const Invoice = React.lazy(() => import('../views/servicemanagement/invoice/Invoice'))

export const serviceManagementRoutes = [
 
  { path: '/service-management/parts', name: 'Parts List', element: Parts},
    { path: '/service-management/labour', name: 'Labour List', element: Labour},
    { path: '/service-management/invoice', name: 'Invoice List', element: Invoice},

];