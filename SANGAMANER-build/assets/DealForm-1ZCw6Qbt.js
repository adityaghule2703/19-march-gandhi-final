import{r as a,g as re,l as ie,v as M,j as s,C as ne,m as U}from"./index-CD-UhOJ2.js";/* empty css                */import{c as p,a as A}from"./index.esm-BML82zAk.js";/* empty css             */import{d as ae,h as de,u as le,A as ce,P as _,M as z}from"./DefaultLayout-GrycDKjh.js";import{C as me}from"./CAlert-CENR3-Ss.js";import{C as ge}from"./CInputGroup-DQZZOIho.js";import{C as B}from"./CInputGroupText-DHH1Ayfr.js";import{C as he}from"./CFormInput-CCQbnhW2.js";import{c as Y}from"./cil-print-CPAcfqxC.js";import{c as ue}from"./cil-reload-6LI_qKMh.js";import"./CNavItem-C1bzmovJ.js";import"./CFormControlWrapper-BAfeeQeh.js";function Re(){const[K,y]=a.useState({chassisNumber:"",amount:""}),[v,d]=a.useState(null),[u,N]=a.useState(!1),[C,i]=a.useState(""),[l,W]=a.useState(null),[T,X]=a.useState([]),w=re(),{permissions:S=[]}=ie(),b=ae(S,z.SALES,_.SALES.DEAL_FORM),D=de(S,z.SALES,_.SALES.DEAL_FORM,ce.CREATE);a.useEffect(()=>{if(!b){M("You do not have permission to view Deal Form"),w("/dashboard");return}return(async()=>{try{const o=await U.get("/declarations?formType=deal_form");if(o.data.status==="success"){const n=o.data.data.declarations.sort((c,f)=>c.priority-f.priority);X(n)}}catch(o){console.error("Error fetching declarations:",o)}})(),()=>{l&&clearTimeout(l)}},[l,b,w]);const J=async e=>{if(!e){i("Please enter a chassis number");return}N(!0),i("");try{const o=await U.get(`bookings/chassis/${e}`);o.data.success?d(o.data.data):(i("No booking found for this chassis number"),d(null))}catch(o){i("Failed to fetch invoice details"),d(null),console.error(o)}finally{N(!1)}},q=e=>{const{name:o,value:n}=e.target;y(c=>({...c,[o]:n})),o==="chassisNumber"&&(l&&clearTimeout(l),W(setTimeout(()=>{n.trim().length>0?J(n):(d(null),i(""))},500)))},Q=()=>{y({chassisNumber:"",amount:""}),d(null),i("")},Z=()=>T.length===0?`
        Declaration- I/We Authorize the Dealer to register the vehicle at RTO in my/our name .2) Getting the vehicle insured from insurance company is my entire responsibility & there will be no liability on dealer for any loss. 3) Getting the vehicle registered from RTO is solely my responsibility & exclusively I/we shall/will be responsible for any loss/penalty/legal charge from RTO/Police for not getting the vehicle registered or for delayed registration. 4) Registration Number allotted by RTO will be acceptable to me else I will pre book for choice number at RTO at my own. Dealership has no role in RTO Number allocation 5) I had been informed & understood the T&C about warranty policy as laid by TVS MOTOR CO. LTD & I agree to abide the same 6) I/We agree that the price at the time of delivery will be applicable. 7) I am being informed about the price breakup, I had understood & agreed upon the same & then had booked the vehicle 8)I am bound to pay an interest @24% p.a. as penalty if payment is delayed for more than 5 days from the date of booking. 9) Subject to sanguimer Jurisdication. I accept that vehicle once sold by dealer shall not be taken back /replaced for any reason.
      `:T.map(e=>`${e.priority}) ${e.content}`).join(". "),ee=e=>{const o=e.exchange&&e.exchangeDetails?.broker?.name||"",n=e.exchange&&e.exchangeDetails?.vehicleNumber||"",c=new Date().toLocaleDateString("en-GB"),f=e.customerDetails.dob?new Date(e.customerDetails.dob).toLocaleDateString("en-GB"):"N/A",E=e.priceComponents.filter(t=>{const r=t.header.header_key.toUpperCase(),m=/INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES	/i.test(r),g=/RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(r),h=/HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(r);return!(m||g||h)}).map(t=>{const r=parseFloat(t.header.metadata.gst_rate)||0,m=t.originalValue,g=t.discountedValue<t.originalValue?t.originalValue-t.discountedValue:0,h=t.discountedValue,H=h*100/(100+r),j=h-H,L=j/2,V=j/2,oe=L+V;return{...t,unitCost:m,taxableValue:H,cgstAmount:L,sgstAmount:V,gstAmount:oe,gstRatePercentage:r,discount:g,lineTotal:h}}),x=t=>e.priceComponents.find(r=>{const m=r.header.header_key.toUpperCase();return t.some(g=>m.includes(g))}),R=x(["INSURANCE","INSURCANCE","INSURANCE CHARGES","INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS"]),I=R?R.originalValue:0,O=x(["RTO","RTO TAX & REGISTRATION CHARGES"]),$=O?O.originalValue:0,P=x(["HYPOTHECATION","HPA","HPA (if applicable)"]),k=P?P.originalValue:e.hypothecationCharges||0,F=E.reduce((t,r)=>t+r.lineTotal,0),G=I+$+k,se=F+G;return`
<!DOCTYPE html>
<html>
<head>
  <title>Deal Form</title>
  <style>
    @page {
      margin: 10mm;
      size: A4;
      
      @bottom-left {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 10pt;
        font-family: "Courier New", Courier, monospace;
      }

      @bottom-right {
        content: "GANDHI MOTORS PVT LTD";
        font-size: 10pt;
        font-family: "Courier New", Courier, monospace;
      }
    }
    
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 0;
      font-size: 14px;
      color: #555555;
      counter-reset: page;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 10mm;
      box-sizing: border-box;
      position: relative;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
    }
    
    .header-left {
      width: 70%;
    }
    
    .header-right {
      width: 30%;
      text-align: right;
    }
    
    .logo {
      height: 50px;
      margin-bottom: 2mm;
    }
    
    .dealer-info {
      text-align: left;
      font-size: 14px;
      line-height: 1.2;
    }
    
    .rto-type {
      text-align: left;
      margin: 1mm 0;
      font-weight: bold;
    }
    
    .customer-info-container {
      display: flex;
      font-size: 14px;
    }

    .customer-info-left {
      width: 50%;
    }
    
    .customer-info-right {
      width: 50%;
    }
    
    .customer-info-row {
      margin: 1mm 0;
      line-height: 1.2;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin: 2mm 0;
    }
    
    th, td {
      padding: 1mm;
      border: 1px solid #000;
      vertical-align: top;
    }
    
    .no-border {
      border: none !important;
      font-size: 14px;
    }
    
    .text-right { 
      text-align: right; 
    }
    
    .text-center { 
      text-align: center; 
    }
    
    .bold {
      font-weight: bold;
    }
    
    .section-title {
      font-weight: bold;
      margin: 1mm 0;
    }
    
    .signature-box {
      margin-top: 10mm;
      font-size: 9pt;
      width: 100%;
      page-break-inside: avoid;
    }
    
    .signature-line {
      border-top: 1px dashed #000;
      width: 40mm;
      display: inline-block;
      margin: 0 5mm;
    }
    
    .footer {
      font-size: 8pt;
      text-align: justify;
      line-height: 1.2;
      margin-top: 3mm;
      page-break-inside: avoid;
    }
    
    .divider {
      border-top: 2px solid #AAAAAA;
    }
    
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      margin: 2mm 0;
    }
    
    .totals-table td {
      border: none;
      padding: 1mm;
    }
    
    .total-divider {
      border-top: 2px solid #AAAAAA;
      height: 1px;
      margin: 2px 0;
    }
    
    .broker-info {
      display: flex;
      justify-content: space-between;
      padding: 1px;
    }
    
    .note {
      padding: 1px;
      margin: 2px;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    .declaration-container {
      page-break-inside: avoid;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      
      .page {
        page-break-after: always;
      }
      
      .signature-box {
        position: fixed;
        bottom: -1mm;
        width: 180mm;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header Section -->
    <div class="header">
      <div class="header-left">
        <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
        <div class="dealer-info">
          Authorized Main Dealer: TVS Motor Company Ltd.<br>
          Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
          Upnagar, Nashik Road, Nashik, 7498993672<br>
          GSTIN: ${e.branch?.gst_number||""}<br>
          GANDHI TVS PIMPALGAON
        </div>
      </div>
      <div class="header-right">
        <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
        <div>Date: ${c}</div>
         ${e.bookingType==="SUBDEALER"?`<div><b>Subdealer:</b> ${e.subdealer?.name||""}</div>
        <div><b>Address:</b> ${e.subdealer?.location||""}</div>`:""}
        
      </div>
    </div>
    <div class="divider"></div>
    <div class="rto-type">RTO TYPE: ${e.rto}</div>
    <div class="divider"></div>

    <!-- Customer Information -->
    <div class="customer-info-container">
      <div class="customer-info-left">
        <div class="customer-info-row"><strong>Invoice Number:</strong> ${e.bookingNumber}</div>
        <div class="customer-info-row"><strong>Customer Name:</strong> ${e.customerDetails.name}</div>
        <div class="customer-info-row"><strong>Address:</strong> ${e.customerDetails.address}, ${e.customerDetails.taluka}</div>
        <div class="customer-info-row"><strong>Taluka:</strong> ${e.customerDetails.taluka}</div>
        <div class="customer-info-row"><strong>Mobile No.:</strong> ${e.customerDetails.mobile1}</div>
         <div class="customer-info-row"><strong>Exchange Mode:</strong> ${e.exchange?"YES":"NO"}</div>
          <div class="customer-info-row"><strong>Aadhar No.:</strong> ${e.customerDetails.aadharNumber}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${e.hpa?"YES":"NO"}</div>
      </div>
      <div class="customer-info-right">
        <div class="customer-info-row"><strong>GSTIN:</strong> ${e.gstin||" "}</div>
       <div class="customer-info-row"><strong>District:</strong> ${e.customerDetails.district||"N/A"}</div>
        <div class="customer-info-row"><strong>Pincode:</strong> ${e.customerDetails.pincode||"N/A"}</div>
        <div class="customer-info-row"><strong>D.O.B:</strong> ${f}</div>
        <div class="customer-info-row"><strong>Payment Mode:</strong> ${e.payment?.type||"CASH"}</div>
         <div class="customer-info-row"><strong>Financer:</strong> ${e.payment?.financer?.name||""}</div>
        <div class="customer-info-row"><strong>Sales Representative Name:</strong> ${e.salesExecutive?.name||"N/A"}</div>
      </div>
    </div>
    <div class="divider"></div>

    <!-- Purchase Details -->
    <div class="section-title">Purchase Details:</div>
    <table class="no-border">
      <tr>
        <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${e.model.model_name}</td>
         <td class="no-border"><strong>Battery No:</strong> ${e.batteryNumber||"000"}</td>
      </tr>
      <tr>
        <td class="no-border"><strong>Chasis No:</strong> ${e.chassisNumber}</td>
        <td class="no-border"><strong>Colour:</strong> ${e.color.name}</td>
      </tr>
       <tr>
        <td class="no-border"><strong>Engine No:</strong> ${e.engineNumber}</td>
        <td class="no-border"><strong>Key No.:</strong> ${e.keyNumber||"000"}</td>
      </tr>
    </table>
    
    <!-- Price Breakdown Table -->
    <table>
      <tr>
        <th style="width:25%">Particulars</th>
        <th style="width:8%">HSN CODE</th>
        <th style="width:8%">Unit Cost</th>
        <th style="width:8%">Taxable</th>
        <th style="width:5%">CGST</th>
        <th style="width:8%">CGST AMOUNT</th>
        <th style="width:5%">SGST</th>
        <th style="width:8%">SGST AMOUNT</th>
        <th style="width:7%">DISCOUNT</th>
        <th style="width:10%">LINE TOTAL</th>
      </tr>

      ${E.map(t=>`
        <tr>
          <td>${t.header.header_key}</td>
          <td>${t.header.metadata.hsn_code}</td>
          <td class="text-right">${t.originalValue.toFixed(2)}</td>
          <td class="text-right">${t.taxableValue.toFixed(2)}</td>
          <td >${(t.gstRatePercentage/2).toFixed(2)}%</td>
           <td >${t.cgstAmount.toFixed(2)}</td>
          <td >${(t.gstRatePercentage/2).toFixed(2)}%</td>
           <td >${t.sgstAmount.toFixed(2)}</td>
          <td class="text-right">${t.discount.toFixed(2)}</td>
          <td class="text-right">${t.lineTotal.toFixed(2)}</td>
        </tr>
      `).join("")}
    </table>

    <!-- Totals Section - No Borders -->
     <table class="totals-table">
      <tr>
        <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
        <td class="no-border text-right"><strong>${F.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
        <td class="no-border text-right"><strong>${I.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
        <td class="no-border text-right"><strong>${$.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>HP CHARGES</strong></td>
        <td class="no-border text-right"><strong>${k.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>TOTAL(B)</strong></td>
        <td class="no-border text-right"><strong>${G.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
        <td class="no-border text-right"><strong>${se.toFixed(2)}</strong></td>
      </tr>
    </table>
    
    <div class="broker-info">
      <div><strong>Ex. Broker/ Sub Dealer:</strong>${o}</div>
      <div><strong>Ex. Veh No:</strong>${n}</div>
    </div>
    
    <div class="note"><strong>Notes:</strong></div>
    <div class="divider"></div>
    
    <div style="margin-top:2mm;">
      <div><strong>ACC.DETAILS: </strong>
        ${e.accessories.map(t=>t.accessory?t.accessory.name:"").filter(t=>t).join(", ")}
      </div>
    </div>
    
    <div class="divider"></div>

    <!-- Footer Declarations -->
    <div class="footer declaration-container">
      <p><strong>DECLARATIONS:</strong> ${Z()}</p>
    </div>

    <!-- Signature Section - Fixed position for printing -->
    <div class="signature-box">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Customer's Signature</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Sales Executive</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Manager</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Accountant</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `},te=()=>{if(!v){i("Please fetch invoice details first");return}if(!D){M("You do not have permission to print Deal Form");return}const e=window.open("","_blank");e.document.write(ee(v)),e.document.close(),e.focus()};return b?s.jsxs("div",{className:"invoice-container",children:[s.jsx("h4",{className:"mb-4",children:"Deal Form"}),C&&s.jsx(me,{color:"danger",className:"mb-3",children:C}),s.jsxs("div",{className:"p-3",children:[s.jsx("h5",{children:"Customer Deal Form"}),s.jsxs(ge,{className:"mb-3",children:[s.jsx(B,{children:s.jsx(p,{className:"icon",icon:le})}),s.jsx(he,{placeholder:"Enter Chassis Number",name:"chassisNumber",value:K.chassisNumber,onChange:q,disabled:u}),u&&s.jsx(B,{children:s.jsx(ne,{size:"sm",color:"primary"})})]}),s.jsxs("div",{className:"d-flex gap-2",children:[D?s.jsxs(A,{className:"submit-button",onClick:te,disabled:!v||u,children:[s.jsx(p,{icon:Y,className:"me-2"}),"Print"]}):s.jsxs(A,{className:"submit-button",disabled:!0,title:"You don't have permission to print",children:[s.jsx(p,{icon:Y,className:"me-2"}),"Print (No Permission)"]}),s.jsxs(A,{className:"cancel-button",onClick:Q,disabled:u,children:[s.jsx(p,{icon:ue,className:"me-2"}),"Clear"]})]})]})]}):s.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Deal Form."})}export{Re as default};
