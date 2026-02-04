import React from 'react';

const BranchStockAudit = React.lazy(() => import('../views/branchstockaudit/BranchStockAudit'))
export const branchStockAuditRoutes = [
  { path:'/branch-stock-audit', name:'Branch Stock Audit', element:BranchStockAudit},
];