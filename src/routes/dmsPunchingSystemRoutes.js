import React from 'react';

const InterestedVehiclesMapping = React.lazy(() => import('../views/dms-punching-system/InterestedVehiclesMapping'))


export const DmsPunchingSystemRoutes = [
   
    { path:'/dms-punching-system/interested-vehicles-mapping', name:'Interested Vehicles Mapping', element: InterestedVehiclesMapping},

   
];