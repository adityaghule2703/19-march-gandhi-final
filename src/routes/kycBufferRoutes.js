import React from 'react';


 

const KycSettings = React.lazy(() => import('../views/kycbuffer/settings/KycSettings'))
const UpdateKycSettings = React.lazy(() => import('../views/kycbuffer/settings/UpdateKycSettings'))
const GrantBuffer = React.lazy(() => import('../views/kycbuffer/grant/GrantBuffer'))
const AddGrantBuffer = React.lazy(() => import('../views/kycbuffer/grant/AddGrantBuffer'))

export const kycBufferMaster = [
   
    { path:'/kyc-buffer-master/kyc-settings', name:'KYC Settings', element: KycSettings},
    { path:'/kyc-buffer-master/kyc-settings/update', name:'KYC Settings', element: UpdateKycSettings},
    { path:'/kyc-buffer-master/grant-buffer', name:'Grant Buffer', element: GrantBuffer},
    { path:'/kyc-buffer-master/grant-buffer/add', name:'Grant Buffer', element: AddGrantBuffer},
   
];