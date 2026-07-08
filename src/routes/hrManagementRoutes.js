import React from 'react';





const Incentives = React.lazy(() => import('../views/hrmanagement/incentives/Incentives'));
const IncentivePerformance = React.lazy(() => import('../views/hrmanagement/incentives/IncentivePerformance'));
const IncentiveSummary = React.lazy(() => import('../views/hrmanagement/incentives/IncentiveSummary'));
const Schemes = React.lazy(() => import('../views/hrmanagement/incentives/Schemes'));
const IncentiveDeviation = React.lazy(() => import('../views/hrmanagement/incentives/IncentiveDeviation'));
const AddIncentive = React.lazy(() => import('../views/hrmanagement/incentives/AddIncentive'));
const EditIncentive = React.lazy(() => import('../views/hrmanagement/incentives/EditIncentive'));
const ApplyIncentive = React.lazy(() => import('../views/hrmanagement/incentives/ApplyIncentive'));
const IncentiveTransaction = React.lazy(() => import('../views/hrmanagement/incentives/IncentiveTransaction'));

export const hrManagementRoutes = [
  { path: '/hr-management/incentives', name: 'Incentives List', element: Incentives },
  { path: '/hr-management/incentive-performance', name: 'Incentives Performance', element: IncentivePerformance },
  { path: '/hr-management/incentive-summary', name: 'Incentives Summary', element: IncentiveSummary },
   { path: '/hr-management/schemes', name: 'Schemes List', element: Schemes },
   { path: '/hr-management/incentive-deviation', name: 'Incentive Deviation', element: IncentiveDeviation },
  { path: '/hr-management/incentives/add', name: 'Add Incentive Plan', element: AddIncentive },
  { path: '/hr-management/incentives/edit/:id', name: 'Edit Incentive Plan', element: EditIncentive },
  { path: '/hr-management/incentives/apply', name: 'Apply Incentive', element: ApplyIncentive },
  { path: '/hr-management/incentives/transactions', name: 'Incentive Transactions', element: IncentiveTransaction },
];