
import React from 'react';

const AddInsurancePercentage = React.lazy(() => import('../views/aiMaster/insurancepercentage/AddInsurancePercentage'));
const UpdateInsurancePercentage = React.lazy(() => import('../views/aiMaster/insurancepercentage/UpdateInsurancePercentage'));
const InsurancePercentageList = React.lazy(() => import('../views/aiMaster/insurancepercentage/InsurancePercentageList'));

const RSAPlanList = React.lazy(() => import('../views/aiMaster/rsaplan/RSAPlanList'));
const AddRSAPlan = React.lazy(() => import('../views/aiMaster/RsaPlan/AddRSAPlan'));
const UpdateRSAPlan = React.lazy(() => import('../views/aiMaster/RsaPlan/AddRSAPlan'));




export const aiMasterRoutes = [
    

    { path:'/rsa-plan/rsa-plan-list',name:"RSA Plan", element:RSAPlanList},
    { path:'/rsa-plan/add-rsa-plan',name:"RSA Add Plan", element:AddRSAPlan},
    { path:'/rsa-plan/update-rsa-plan/:id',name:"RSA Update Plan", element:AddRSAPlan},
 { path:'/insurance-percentage', name:'Insurance Percentage', element:InsurancePercentageList},
     { path:'/insurance-percentage/add-insurance-percentage', name:'Insurance ADD Percentage', element:AddInsurancePercentage},
     { path:'/insurance-percentage/update-insurance-percentage/:id', name:'Insurance UPDATE Percentage', element:UpdateInsurancePercentage},
  
   
];