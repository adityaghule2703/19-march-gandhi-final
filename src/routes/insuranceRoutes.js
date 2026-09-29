import React from 'react';


const AiInsuranceDashboard = React.lazy(() => import('../views/insurance/aiinsurancedashboard/AiInsuranceDashboard'))
const InsuranceDashboard = React.lazy(() => import('../views/insurance/insurance-dashboard/InsuranceDashboard'))
const InsuranceDetails = React.lazy(() => import('../views/insurance/insurance-details/InsuranceReport'))
export const insuranceRoutes = [
    { path:'/insurance-dashboard', name:'Insurance Dashboard', element:InsuranceDashboard},
  { path:'/insurance-details', name:'Insurance Details', element:InsuranceDetails},
   { path:'/ai-insurance-dashboard', name:'AI Insurance Dashboard', element:AiInsuranceDashboard},
];