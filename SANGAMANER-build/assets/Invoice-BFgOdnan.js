import{r as n,g as tt,l as et,v as L,j as s,C as st,m as ot}from"./index-CD-UhOJ2.js";/* empty css                *//* empty css             */import{c as u,a as A}from"./index.esm-BML82zAk.js";import{d as it,h as rt,u as nt,A as at,P as F,M as U}from"./DefaultLayout-GrycDKjh.js";import{C as dt}from"./CAlert-CENR3-Ss.js";import{C as lt}from"./CInputGroup-DQZZOIho.js";import{C as M}from"./CInputGroupText-DHH1Ayfr.js";import{C as ct}from"./CFormInput-CCQbnhW2.js";import{c as B}from"./cil-print-CPAcfqxC.js";import{c as mt}from"./cil-reload-6LI_qKMh.js";import"./CNavItem-C1bzmovJ.js";import"./CFormControlWrapper-BAfeeQeh.js";function yt(){const[_,x]=n.useState({chassisNumber:"",amount:""}),[v,a]=n.useState(null),[h,N]=n.useState(!1),[C,r]=n.useState(""),[d,z]=n.useState(null),S=tt(),{permissions:T=[]}=et(),b=it(T,U.SALES,F.SALES.GST_INVOICE),w=rt(T,U.SALES,F.SALES.GST_INVOICE,at.CREATE);n.useEffect(()=>{if(!b){L("You do not have permission to view GST Invoice"),S("/dashboard");return}return()=>{d&&clearTimeout(d)}},[d,b,S]);const Y=async t=>{if(!t){r("Please enter a chassis number");return}N(!0),r("");try{const i=await ot.get(`bookings/chassis/${t}`);i.data.success?a(i.data.data):(r("No booking found for this chassis number"),a(null))}catch(i){r("Failed to fetch invoice details"),a(null),console.error(i)}finally{N(!1)}},K=t=>{const{name:i,value:l}=t.target;x(p=>({...p,[i]:l})),i==="chassisNumber"&&(d&&clearTimeout(d),z(setTimeout(()=>{l.trim().length>0?Y(l):(a(null),r(""))},500)))},X=()=>{x({chassisNumber:"",amount:""}),a(null),r("")},J=t=>{const i=t.exchange&&t.exchangeDetails?.broker?.name||"",l=t.exchange&&t.exchangeDetails?.vehicleNumber||"",p=new Date().toLocaleDateString("en-GB"),q=t.customerDetails.dob?new Date(t.customerDetails.dob).toLocaleDateString("en-GB"):"N/A",y=t.priceComponents.filter(e=>{const o=e.header.header_key.toUpperCase(),c=/INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES	/i.test(o),m=/RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(o),g=/HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(o);return!(c||m||g)}).map(e=>{const o=parseFloat(e.header.metadata.gst_rate)||0,c=e.originalValue,m=e.discountedValue<e.originalValue?e.originalValue-e.discountedValue:0,g=e.discountedValue,j=g*100/(100+o),H=g-j,V=H/2,k=H/2,Z=V+k;return{...e,unitCost:c,taxableValue:j,cgstAmount:V,sgstAmount:k,gstAmount:Z,gstRatePercentage:o,discount:m,lineTotal:g}}),f=e=>t.priceComponents.find(o=>{const c=o.header.header_key.toUpperCase();return e.some(m=>c.includes(m))}),E=f(["INSURANCE","INSURCANCE","INSURANCE CHARGES","INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS"]),I=E?E.originalValue:0,R=f(["RTO","RTO TAX & REGISTRATION CHARGES"]),$=R?R.originalValue:0,D=f(["HYPOTHECATION","HPA","HPA (if applicable)"]),P=D?D.originalValue:t.hypothecationCharges||0,G=y.reduce((e,o)=>e+o.lineTotal,0),O=I+$+P,Q=G+O;return`
 <!DOCTYPE html>
<html>
<head>
  <title>GST Invoice</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 10mm;
      font-size: 14px;
      color: ##555555;;
    }
    .page {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
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
      font-size:14px;
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
      font-size:14px;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .bold { 
    font-weight: bold; 
    }
    .section-title {
      font-weight: bold;
      margin: 1mm 0;
    }
    .signature-box {
      margin-top: 5mm;
      font-size: 9pt;
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
    .broker-info{
       display:flex;
       justify-content:space-between;
       padding:1px;
    }
    .note{
       padding:1px
       margin:2px;
       }
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        padding: 5mm;
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
          GSTIN: ${t.branch?.gst_number||""}<br>
          GANDHI TVS PIMPALGAON
        </div>
      </div>
      <div class="header-right">
        <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
        <div>Date: ${p}</div>

        ${t.bookingType==="SUBDEALER"?`<div><b>Subdealer:</b> ${t.subdealer?.name||""}</div>
        <div><b>Address:</b> ${t.subdealer?.location||""}</div>
          
          `:""}
        
      </div>
    </div>
    <div class="divider"></div>
    <div class="rto-type">RTO TYPE: ${t.rto}</div>
    <div class="divider"></div>

    <!-- Customer Information -->
    <div class="customer-info-container">
      <div class="customer-info-left">
        <div class="customer-info-row"><strong>Invoice Number:</strong> ${t.bookingNumber}</div>
        <div class="customer-info-row"><strong>Customer Name:</strong> ${t.customerDetails.name}</div>
        <div class="customer-info-row"><strong>Address:</strong> ${t.customerDetails.address}, ${t.customerDetails.taluka}</div>
        <div class="customer-info-row"><strong>Taluka:</strong> ${t.customerDetails.taluka}</div>
        <div class="customer-info-row"><strong>Mobile No.:</strong> ${t.customerDetails.mobile1}</div>
         <div class="customer-info-row"><strong>Exchange Mode:</strong> ${t.exchange?"YES":"NO"}</div>
          <div class="customer-info-row"><strong>Aadhar No.:</strong> ${t.customerDetails.aadharNumber}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${t.hpa?"YES":"NO"}</div>
      </div>
      <div class="customer-info-right">
        <div class="customer-info-row"><strong>GSTIN:</strong> ${t.gstin||" "}</div>
       <div class="customer-info-row"><strong>District:</strong> ${t.customerDetails.district||"N/A"}</div>
        <div class="customer-info-row"><strong>Pincode:</strong> ${t.customerDetails.pincode||"N/A"}</div>
        <div class="customer-info-row"><strong>D.O.B:</strong> ${q}</div>
        <div class="customer-info-row"><strong>Payment Mode:</strong> ${t.payment?.type||"CASH"}</div>
         <div class="customer-info-row"><strong>Financer:</strong> ${t.payment?.financer?.name||""}</div>
        <div class="customer-info-row"><strong>Sales Representative Name:</strong> ${t.salesExecutive?.name||"N/A"}</div>
      </div>
    </div>
    <div class="divider"></div>

    <!-- Purchase Details -->
    <div class="section-title">Purchase Details:</div>
    <table class="no-border">
      <tr>
        <td class="no-border" style="width:50%"><strong>Model Name:</strong> ${t.model.model_name}</td>
         <td class="no-border"><strong>Battery No:</strong> ${t.batteryNumber||"000"}</td>
      </tr>
      <tr>
        <td class="no-border"><strong>Chasis No:</strong> ${t.chassisNumber}</td>
        <td class="no-border"><strong>Colour:</strong> ${t.color?.name||""}</td>
      </tr>
       <tr>
        <td class="no-border"><strong>Engine No:</strong> ${t.engineNumber}</td>
        <td class="no-border"><strong>Key No.:</strong> ${t.keyNumber||"000"}</td>
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

      ${y.map(e=>`
        <tr>
          <td>${e.header.header_key}</td>
          <td>${e.header.metadata.hsn_code}</td>
          <td >${e.originalValue.toFixed(2)}</td>
          <td >${e.taxableValue.toFixed(2)}</td>
          <td >${(e.gstRatePercentage/2).toFixed(2)}%</td>
<td >${e.cgstAmount.toFixed(2)}</td>
<td >${(e.gstRatePercentage/2).toFixed(2)}%</td>
<td >${e.sgstAmount.toFixed(2)}</td>
          <td >${Math.round(e.discount||"0.00")}</td>
          <td >${e.lineTotal.toFixed(2)}</td>
        </tr>
      `).join("")}
    </table>

    <!-- Totals Section - No Borders -->
     <table class="totals-table">
      <tr>
        <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
        <td class="no-border text-right"><strong>${G.toFixed(2)}</strong></td>
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
        <td class="no-border text-right"><strong>${P.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>TOTAL(B)</strong></td>
        <td class="no-border text-right"><strong>${O.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
        <td class="no-border text-right"><strong>${Q.toFixed(2)}</strong></td>
      </tr>
    </table>
    <div class="broker-info">
      <div><strong>Ex. Broker/ Sub Dealer:</strong>${i}</div>
      <div><strong>Ex. Veh No:</strong>${l}</div>
    </div>
    <div class="note"><strong>Notes:</strong></div>
   <div class="divider"></div>
   <div style="margin-top:2mm;">
  <div><strong>ACC.DETAILS: </strong>
    ${t.accessories.map(e=>e.accessory?e.accessory.name:"").filter(e=>e).join(", ")}
  </div>
</div>
    <div class="divider"></div>

    <!-- Removed Declarations Section -->

    <!-- Signature Section - Adjusted to fit properly -->
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
  `},W=()=>{if(!v){r("Please fetch invoice details first");return}if(!w){L("You do not have permission to print GST Invoice");return}const t=window.open("","_blank");t.document.write(J(v)),t.document.close(),t.focus()};return b?s.jsxs("div",{className:"invoice-container",children:[s.jsx("h4",{className:"mb-4",children:"Invoice"}),C&&s.jsx(dt,{color:"danger",className:"mb-3",children:C}),s.jsxs("div",{className:"p-3",children:[s.jsx("h5",{children:"Customer GST Invoice"}),s.jsxs(lt,{className:"mb-3",children:[s.jsx(M,{children:s.jsx(u,{className:"icon",icon:nt})}),s.jsx(ct,{placeholder:"Enter Chassis Number",name:"chassisNumber",value:_.chassisNumber,onChange:K,disabled:h}),h&&s.jsx(M,{children:s.jsx(st,{size:"sm",color:"primary"})})]}),s.jsxs("div",{className:"d-flex gap-2",children:[w?s.jsxs(A,{className:"submit-button",onClick:W,disabled:!v||h,children:[s.jsx(u,{icon:B,className:"me-2"}),"Print"]}):s.jsxs(A,{className:"submit-button",disabled:!0,title:"You don't have permission to print",children:[s.jsx(u,{icon:B,className:"me-2"}),"Print (No Permission)"]}),s.jsxs(A,{className:"cancel-button",onClick:X,disabled:h,children:[s.jsx(u,{icon:mt,className:"me-2"}),"Clear"]})]})]})]}):s.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view GST Invoice."})}export{yt as default};
