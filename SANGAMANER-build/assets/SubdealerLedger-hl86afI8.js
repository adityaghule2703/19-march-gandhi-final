import{r as n,l as Ne,v as A,m as B,j as t,z as Ae}from"./index-CD-UhOJ2.js";/* empty css                *//* empty css              *//* empty css             */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as Ce,g as ee}from"./tableFilters-DsQgHBMv.js";import{t as De}from"./logo-V-f8m5nN.js";import{a as G,c as je}from"./index.esm-BML82zAk.js";import{d as Ee,h as te,T as ae,A as se,P,M as z}from"./DefaultLayout-GrycDKjh.js";import{C as Re,a as Te}from"./CCardBody-BS7SU2uX.js";import{C as Le}from"./CCardHeader-CGdtZMoU.js";import{C as Be}from"./CNav-Cyg_fwvj.js";import{b as oe,a as ie}from"./CNavItem-C1bzmovJ.js";import{C as ke,a as re}from"./CTabPane-Dx1WyKKV.js";import{C as V}from"./CFormControlWrapper-BAfeeQeh.js";import{C as ye}from"./CFormInput-CCQbnhW2.js";import{C as Ue,a as _e,b as q,c as N,d as $e,e as x}from"./CTable-CzW9ULzA.js";import{c as Ie}from"./cil-print-CPAcfqxC.js";import{C as Oe}from"./CAlert-CENR3-Ss.js";import{C as Fe,a as H}from"./CRow--g2qTLFu.js";import{C as M}from"./CFormSelect-DGopBSdT.js";import"./slicedToArray-Dby63wcm.js";function nt(){const[p,W]=n.useState(0),[le,de]=n.useState([]),[k,y]=n.useState([]),[m,U]=n.useState(""),[ce,_]=n.useState(""),[C,D]=n.useState(""),[Y,$]=n.useState(""),{user:I}=Ne(),O=I?.permissions||[],u=I?.roles?.some(a=>a.name==="SUBDEALER"),l=I?.subdealer,F=Ee(O,z.SUBDEALER_ACCOUNT,P.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER),j=te(O,z.SUBDEALER_ACCOUNT,P.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER,se.VIEW,ae.SUBDEALER_LEDGER.SUB_DEALER),E=te(O,z.SUBDEALER_ACCOUNT,P.SUBDEALER_ACCOUNT.SUBDEALER_LEDGER,se.VIEW,ae.SUBDEALER_LEDGER.SUB_DEALER_UTR);n.useEffect(()=>{!j&&p===0&&E&&W(1)},[j,E,p]);const{setData:ne,filteredData:J,setFilteredData:me,handleFilter:K}=Ce([]);n.useEffect(()=>{if(!F){A("You do not have permission to view Subdealer Ledger");return}he(),pe()},[F]),n.useEffect(()=>{u&&l&&!m&&U(l._id)},[u,l,m]),n.useEffect(()=>{m?ge():(y([]),_(""))},[m]);const he=async()=>{try{let s=(await B.get("/subdealers")).data.data.subdealers||[];u&&l&&(s=s.filter(g=>g._id===l._id||g.id===l._id)),ne(s),me(s)}catch(a){const s=A(a);s&&D(s)}},pe=async()=>{try{const s=(await B.get("/subdealers")).data.data.subdealers||[];de(s),u&&l&&s.some(S=>S._id===l._id||S.id===l._id)&&U(l._id)}catch(a){const s=A(a);s&&D(s)}},ge=async()=>{try{const a=await B.get(`/subdealersonaccount/${m}/on-account/receipts`);y(a.data.docs||[]),D("")}catch(a){const s=A(a);s&&D(s),y([])}},ue=a=>{u||(U(a.target.value),_(""))},be=a=>{_(a.target.value)},fe=a=>{$(a),K(a,ee("subdealer"))},Q=a=>{W(a),$("")},xe=()=>{$(""),K("",ee("subdealer"))},Se=async a=>{try{const s=await B.get(`/subdealersonaccount/${a._id}/on-account/receipts`);let g=[],S=[],X=[],R=0;if(s.data&&s.data.data){const e=s.data.data;g=e.entries||[],R=e.totals?.onAccountBalance||0,S=g.filter(o=>o.source==="BOOKING").map(o=>({...o,customerDetails:{salutation:"",name:o.customerName||a.name||""},bookingNumber:o.receiptNo||o.bookingNumber,discountedAmount:o.debit,amount:o.debit,remark:o.remark||o.description,createdAt:o.timestamp,bookingDate:o.date}))}else s.data&&s.data.docs&&(g=s.data.docs||[],S=s.data.subdealerBookings||[],X=s.data.accessoryBillings||[],R=s.data.totalOnAccountBalance||0);const we=`${Ae.baseURL}/ledger.html?ledgerId=${a._id}`;let T=0,L=0,h=0;const b=[];S.forEach(e=>{b.push({type:"booking",data:e,date:new Date(e.createdAt||e.bookingDate||e.receivedDate),debit:e.discountedAmount||0})}),X.forEach(e=>{e.isDebit&&b.push({type:"accessory",data:e,date:new Date(e.createdAt),debit:e.amount||0})}),g.forEach(e=>{e.source==="ON_ACCOUNT_RECEIPT"?(b.push({type:"receipt",data:e,date:new Date(e.timestamp||e.createdAt),credit:e.credit||0,isReceipt:!0}),e.receiptDetails&&e.receiptDetails.allocationBreakdown&&e.receiptDetails.allocationBreakdown.length>0&&e.receiptDetails.allocationBreakdown.forEach((o,f)=>{b.push({type:"allocation",data:o,parentReceipt:e,date:new Date(o.allocatedAt||e.timestamp),credit:o.allocatedAmount||0,isAllocation:!0,receiptNo:e.receiptNo})})):e.source==="ALLOCATION"&&b.push({type:"allocation",data:e,date:new Date(e.timestamp||e.createdAt),credit:e.credit||0,debit:e.debit||0})}),b.sort((e,o)=>e.date.getTime()-o.date.getTime());const Z=b.map(e=>{let o="",f="",w="",v="",d=0,c=0;if(e.type==="booking"){const i=e.data;c=e.debit||0,h+=c,L+=c,o=`Booking Created<br>Customer: ${i.customerDetails?.salutation||""} ${i.customerDetails?.name||"N/A"}<br>${i.remark||""}`,f=i.bookingNumber||"";const r=e.date||new Date(i.bookingDate)||new Date(i.createdAt)||(e.parentReceipt?new Date(e.parentReceipt.createdAt):new Date);w=r,v=r.toLocaleDateString("en-GB")}else if(e.type==="accessory"){const i=e.data;c=e.debit||0,h+=c,L+=c,o=`Accessory Billing<br>${i.remark||"Accessory Purchase"}`,f=i.transactionReference||"";const r=e.date||new Date(i.createdAt);w=r,v=r.toLocaleDateString("en-GB")}else if(e.type==="receipt"){const i=e.data;d=i.credit||0,h-=d,T+=d,o=`On-Account Payment Received<br>${i.remark||""}`,f=i.receiptNo||"";const r=e.date||new Date(i.timestamp);w=r,v=r.toLocaleDateString("en-GB")}else if(e.type==="allocation"){const i=e.data;if(e.isAllocation){d=i.allocatedAmount||0,h+=d,T+=d,o=`Payment Allocated to Booking ${i.bookingNumber}<br>Customer: ${i.customerName}`,i.remark&&(o+=`<br>${i.remark}`),f=e.receiptNo||"";const r=e.date||new Date(i.allocatedAt);w=r,v=r.toLocaleDateString("en-GB")}else{d=i.credit||0,c=i.debit||0,d>0&&(h-=d,T+=d),c>0&&(h+=c,L+=c),o=i.description||"Payment Allocation",i.remark&&(o+=`<br>${i.remark}`),f=i.receiptNo||"";const r=e.date||new Date(i.timestamp);w=r,v=r.toLocaleDateString("en-GB")}}return{date:v,rawDate:w,description:o,referenceNo:f,credit:d||0,debit:c||0,balance:h,isAllocation:e.isAllocation,isReceipt:e.isReceipt}});Z.sort((e,o)=>e.rawDate.getTime()-o.rawDate.getTime());const ve=h-R;window.open("","_blank").document.write(`
<!DOCTYPE html>
<html>
  <head>
    <title>Subdealer Ledger</title>
    <style>
      @page {
        size: A4;
        margin: 15mm 10mm;
      }
      body {
        font-family: Arial;
        width: 100%;
        margin: 0;
        padding: 0;
        font-size: 14px;
        line-height: 1.3;
        font-family: Courier New;
      }
      .container {
        width: 190mm;
        margin: 0 auto;
        padding: 5mm;
      }
      .header-container {
        display: flex;
        justify-content:space-between;
        margin-bottom: 3mm;
      }
      .header-text{
        font-size:20px;
        font-weight:bold;
      }
      .logo {
        width: 30mm;
        height: auto;
        margin-right: 5mm;
      } 
      .header {
        text-align: left;
      }
      .divider {
        border-top: 2px solid #AAAAAA;
        margin: 3mm 0;
      }
      .header h2 {
        margin: 2mm 0;
        font-size: 12pt;
        font-weight: bold;
      }
      .header div {
        font-size: 14px;
      }
      .customer-info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2mm;
        margin-bottom: 5mm;
        font-size: 14px;
      }
      .customer-info div {
        display: flex;
      }
      .customer-info strong {
        min-width: 30mm;
        display: inline-block;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 5mm;
        font-size: 14px;
        page-break-inside: avoid;
      }
      th, td {
        border: 1px solid #000;
        padding: 2mm;
        text-align: left;
      }
      th {
        background-color: #f0f0f0;
        font-weight: bold;
      }
      .footer {
        margin-top: 10mm;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 14px;
      }
      .footer-left {
        text-align: left;
      }
      .footer-right {
        text-align: right;
      }
      .qr-code {
        width: 35mm;
        height: 35mm;
      }
      .text-right {
        text-align: right;
      }
      .text-left {
        text-align: left;
      }
      .text-center {
        text-align: center;
      }
      .bold-row {
        font-weight: bold;
        background-color: #f8f9fa;
      }
      .total-row {
        font-weight: bold;
        background-color: #e9ecef;
      }
      .allocation-row {
        font-style: italic;
        background-color: #f9f9f9;
      }
      @media print {
        body {
          width: 190mm;
          height: 277mm;
        }
        .no-print {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header-container">
        <img src="${De}" class="logo" alt="TVS Logo">
        <div class="header-text"> GANDHI TVS</div>
      </div>
      <div class="header">
        <div>
          Authorised Main Dealer: TVS Motor Company Ltd.<br>
          Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
          Upnagar, Nashik Road, Nashik - 422101<br>
          Phone: 7498903672
        </div>
      </div>
      <div class="divider"></div>
      <div class="customer-info">
        <div><strong>Subdealer Name:</strong> ${a.name||""}</div>
        <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString("en-GB")}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th width="15%">Date</th>
            <th width="35%">Description</th>
            <th width="15%">Reference No</th>
            <th width="10%" class="text-right">Credit (₹)</th>
            <th width="10%" class="text-right">Debit (₹)</th>
            <th width="15%" class="text-right">Balance (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${Z.map(e=>`
              <tr class="${e.isAllocation?"allocation-row":""}">
                <td>${e.date}</td>
                <td>${e.description}</td>
                <td>${e.referenceNo}</td>
                <td class="text-right">${e.credit>0?e.credit.toLocaleString("en-IN"):"0"}</td>
                <td class="text-right">${e.debit>0?e.debit.toLocaleString("en-IN"):"0"}</td>
                <td class="text-right">${e.balance.toLocaleString("en-IN")}</td>
              </tr>
            `).join("")}
          
          <!-- Total Row -->
          <tr class="total-row">
            <td colspan="3" class="text-left">Total</td>
            <td class="text-right">${T.toLocaleString("en-IN")}</td>
            <td class="text-right">${L.toLocaleString("en-IN")}</td>
            <td class="text-right">${h.toLocaleString("en-IN")}</td>
          </tr>
          
          <!-- On Account Balance Row - shown below total -->
          <tr class="bold-row">
            <td colspan="5" class="text-left">On Account Balance</td>
            <td class="text-right">${R.toLocaleString("en-IN")}</td>
          </tr>
          
          <!-- Final Balance Row -->
          <tr class="bold-row">
            <td colspan="5" class="text-left">Final Balance</td>
            <td class="text-right">${ve.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        <div class="footer-left">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(we)}" 
               class="qr-code" 
               alt="QR Code" />
        </div>
        <div class="footer-right">
          <p>For, Gandhi TVS</p>
          <p>Authorised Signatory</p>
        </div>
      </div>
    </div>
    
    <script>
      window.onload = function() {
        setTimeout(() => {
          window.print();
        }, 300);
      };
    <\/script>
  </body>
</html>
`)}catch(s){console.error("Error fetching ledger:",s),A("Failed to load ledger. Please try again.")}};return F?C?t.jsx("div",{className:"alert alert-danger",role:"alert",children:C}):t.jsxs("div",{children:[t.jsx("div",{className:"title",children:"Subdealer Ledger"}),t.jsxs(Re,{className:"table-container mt-4",children:[t.jsx(Le,{className:"card-header d-flex justify-content-between align-items-center",children:t.jsxs(Be,{variant:"tabs",className:"mb-0 border-bottom",children:[j&&t.jsx(oe,{children:t.jsx(ie,{active:p===0,onClick:()=>Q(0),style:{cursor:"pointer",borderTop:p===0?"4px solid #2759a2":"3px solid transparent",color:"black",borderBottom:"none"},children:"Sub Dealer"})}),E&&t.jsx(oe,{children:t.jsx(ie,{active:p===1,onClick:()=>Q(1),style:{cursor:"pointer",borderTop:p===1?"4px solid #2759a2":"3px solid transparent",borderBottom:"none",color:"black"},children:"Sub Dealer UTR"})})]})}),t.jsx(Te,{children:t.jsxs(ke,{children:[j&&t.jsxs(re,{visible:p===0,className:"p-0",children:[t.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[t.jsx("div",{}),t.jsxs("div",{className:"d-flex",children:[t.jsx(V,{className:"mt-1 m-1",children:"Search:"}),t.jsx(ye,{type:"text",style:{maxWidth:"350px",height:"30px",borderRadius:"0"},className:"d-inline-block square-search",value:Y,onChange:a=>fe(a.target.value)}),Y&&t.jsx(G,{size:"sm",color:"secondary",className:"action-btn ms-2",onClick:xe,children:"Reset"})]})]}),t.jsx("div",{className:"responsive-table-wrapper",children:t.jsxs(Ue,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[t.jsx(_e,{children:t.jsxs(q,{children:[t.jsx(N,{scope:"col",children:"Sr.no"}),t.jsx(N,{scope:"col",children:"Name"}),t.jsx(N,{scope:"col",children:"Location"}),t.jsx(N,{scope:"col",children:"Rate Of Interest"}),t.jsx(N,{scope:"col",children:"Type"}),t.jsx(N,{scope:"col",children:"Action"})]})}),t.jsx($e,{children:J.length===0?t.jsx(q,{children:t.jsx(x,{colSpan:"7",style:{color:"red",textAlign:"center"},children:u?"No ledger data available for your account":"No subdealers available"})}):J.map((a,s)=>t.jsxs(q,{children:[t.jsx(x,{children:s+1}),t.jsx(x,{children:a.name}),t.jsx(x,{children:a.location}),t.jsx(x,{children:a.rateOfInterest}),t.jsx(x,{children:a.type}),t.jsx(x,{children:t.jsxs(G,{size:"sm",className:"action-btn",onClick:()=>Se(a),children:[t.jsx(je,{icon:Ie,className:"icon"})," View Ledger"]})})]},s))})]})})]}),E&&t.jsxs(re,{visible:p===1,className:"p-0",children:[C&&t.jsx(Oe,{color:"danger",className:"mb-3",children:C}),t.jsxs(Fe,{className:"mb-4",children:[t.jsxs(H,{md:5,children:[t.jsx(V,{htmlFor:"subdealerSelect",className:"fw-bold",children:"Select Subdealer"}),u?t.jsxs("div",{children:[t.jsx(M,{id:"subdealerSelect",value:m,className:"square-select bg-light",disabled:!0,children:t.jsx("option",{value:m,children:l?.name||"Your Subdealer Account"})}),t.jsx("div",{className:"text-muted small mt-1",children:"Subdealers can only view their own ledger"})]}):t.jsxs(M,{id:"subdealerSelect",value:m,onChange:ue,className:"square-select",children:[t.jsx("option",{value:"",children:"-- Select Subdealer --"}),le.map(a=>t.jsxs("option",{value:a._id||a.id,children:[a.name," - ",a.location]},a._id||a.id))]})]}),t.jsxs(H,{md:5,children:[t.jsx(V,{htmlFor:"receiptSelect",className:"fw-bold",children:"Select UTR/Receipt"}),t.jsxs(M,{id:"receiptSelect",value:ce,onChange:be,disabled:!m||k.length===0,className:"square-select",children:[t.jsx("option",{value:"",children:"-- Select UTR/Receipt --"}),k.map(a=>{const s=a.amount-(a.allocatedTotal||0);return t.jsxs("option",{value:a._id||a.id,disabled:s<=0,children:[a.refNumber||"No reference"," - ₹",s.toLocaleString()," remaining"]},a._id||a.id)})]}),t.jsx("small",{className:"text-muted",children:k.length===0&&m?"No receipts available":"Select a UTR to allocate payments"})]}),t.jsx(H,{md:2,className:"d-flex align-items-end",children:t.jsx(G,{className:"action-btn w-100",children:"View"})})]})]})]})})]})]}):t.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Subdealer Ledger."})}export{nt as default};
