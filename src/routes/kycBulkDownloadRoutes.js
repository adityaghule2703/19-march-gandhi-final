import React from 'react';

const KycBulkDownload = React.lazy(() => import('../views/kyc-bulk-download/KycBulkDownload'))


export const KycBulkDownloadRoutes = [
   
    { path:'/kyc-bulk-download/kyc-bulk-download', name:'KYC Bulk Download', element: KycBulkDownload},

   
];