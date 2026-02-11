import{r as i,j as e,m as P,z as _,l as V,v as k,C as q}from"./index-CD-UhOJ2.js";/* empty css              */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as G,g as H}from"./tableFilters-DsQgHBMv.js";import{u as Y}from"./pagination-B7oNW1il.js";/* empty css                */import{t as J}from"./logo-V-f8m5nN.js";import{r as Q,d as K,e as W,f as X,g as Z,P as D,M as T}from"./DefaultLayout-GrycDKjh.js";import{C as ee,a as te,b as se,c as ae,d as re}from"./CModalTitle-Cs0DhY3v.js";import{C as I}from"./CAlert-CENR3-Ss.js";import{C as L,a as g}from"./CRow--g2qTLFu.js";import{C as x}from"./CFormInput-CCQbnhW2.js";import{C as ne}from"./CForm-CevvQQOo.js";import{C as oe}from"./CFormSelect-DGopBSdT.js";import{a as E}from"./index.esm-BML82zAk.js";import{C as ie,a as le}from"./CCardBody-BS7SU2uX.js";import{C as de}from"./CCardHeader-CGdtZMoU.js";import{C as ce}from"./CFormControlWrapper-BAfeeQeh.js";import{C as me,a as he,b as O,c as l,d as ue,e as o}from"./CTable-CzW9ULzA.js";import"./slicedToArray-Dby63wcm.js";import"./createSvgIcon-70ImKnSA.js";import"./clsx-B-dksMZM.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./extends-CF3RwP-h.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./CNavItem-C1bzmovJ.js";const ge=({show:N,onClose:f,bookingData:r})=>{const[n,p]=i.useState({bookingId:r?._id||"",totalAmount:r?.discountedAmount||0,balanceAmount:r?.balanceAmount||0,debitReason:"",amount:"",remark:""}),[d,v]=i.useState(!1),[A,b]=i.useState(null),[y,j]=i.useState(null),C=m=>{const{name:s,value:h}=m.target;p(c=>({...c,[s]:h})),s==="amount"&&p(c=>({...c}))},w=async m=>{m.preventDefault(),v(!0),b(null),j(null);try{let s={bookingId:r._id,debitReason:n.debitReason,amount:parseFloat(n.amount),remark:n.remark};const h=await P.post("/ledger/debit",s);j("Payment successfully recorded!"),console.log("Payment response:",h.data),p({bookingId:r?._id||"",totalAmount:r?.discountedAmount||0,balanceAmount:r?.balanceAmount||0,debitReason:"",amount:"",remark:""}),setTimeout(()=>{f()},2e3)}catch(s){console.error("Payment error:",s),b(s.response?.data?.message||"Failed to process payment. Please try again.")}finally{v(!1)}},$=async()=>{try{const s=(await P.get(`/ledger/report/${r._id}`)).data.data,h=`${_.baseURL}/ledger.html?bookingId=${r._id}`;window.open("","_blank").document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Customer Ledger</title>
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
                <img src="${J}" class="logo" alt="TVS Logo">
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
                <div><strong>Customer Name:</strong> ${s.customerDetails?.name||""}</div>
                <div><strong>Ledger Date:</strong> ${s.ledgerDate||new Date().toLocaleDateString("en-GB")}</div>
                <div><strong>Customer Address:</strong> ${s.customerDetails?.address||""}</div>
                <div><strong>Customer Phone:</strong> ${s.customerDetails?.phone||""}</div>
                <div><strong>Chassis No:</strong> ${s.vehicleDetails?.chassisNo||""}</div>
                <div><strong>Engine No:</strong> ${s.vehicleDetails?.engineNo||""}</div>
                <div><strong>Finance Name:</strong> ${s.financeDetails?.financer||""}</div>
                <div><strong>Sale Executive:</strong> ${s.salesExecutive||""}</div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th width="15%">Date</th>
                    <th width="35%">Description</th>
                    <th width="15%">Receipt/VC No</th>
                    <th width="10%" class="text-right">Credit (₹)</th>
                    <th width="10%" class="text-right">Debit (₹)</th>
                    <th width="15%" class="text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.entries?.map(a=>`
                    <tr>
                      <td>${a.date}</td>
                      <td>${a.description||""}</td>
                      <td>${a.receiptNo||""}</td>
                      <td class="text-right">${a.credit?a.credit.toLocaleString("en-IN"):"-"}</td>
                      <td class="text-right">${a.debit?a.debit.toLocaleString("en-IN"):"-"}</td>
                      <td class="text-right">${a.balance?a.balance.toLocaleString("en-IN"):"-"}</td>
                    </tr>
                  `).join("")}
                  <tr>
                    <td colspan="3" class="text-left"><strong>Total</strong></td>
                    <td class="text-right"><strong>${s.totals?.totalCredit?.toLocaleString("en-IN")||"0"}</strong></td>
                    <td class="text-right"><strong>${s.totals?.totalDebit?.toLocaleString("en-IN")||"0"}</strong></td>
                    <td class="text-right"><strong>${s.totals?.finalBalance?.toLocaleString("en-IN")||"0"}</strong></td>
                  </tr>
                </tbody>
              </table>
              
              <div class="footer">
                <div class="footer-left">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(h)}" 
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
      `)}catch(m){console.error("Error fetching ledger:",m),b("Failed to load ledger. Please try again.")}};return e.jsxs(e.Fragment,{children:[e.jsx(Q,{visible:N,className:"modal-backdrop",style:{backgroundColor:"rgba(0, 0, 0, 0.5)"}}),e.jsxs(ee,{visible:N,onClose:f,size:"lg",alignment:"center",children:[e.jsx(te,{children:e.jsx(se,{children:"Account Receipt"})}),e.jsxs(ae,{children:[A&&e.jsx(I,{color:"danger",children:A}),y&&e.jsx(I,{color:"success",children:y}),e.jsxs(L,{className:"mb-3",children:[e.jsxs(g,{md:6,children:[e.jsx("label",{className:"form-label",children:"Customer Name"}),e.jsx(x,{type:"text",value:r?.customerDetails?.name||"",readOnly:!0,className:"bg-light"})]}),e.jsxs(g,{md:6,children:[e.jsx("label",{className:"form-label",children:"Chassis Number"}),e.jsx(x,{type:"text",value:r?.chassisNumber||"",readOnly:!0,className:"bg-light"})]})]}),e.jsxs(L,{className:"mb-3",children:[e.jsxs(g,{md:6,children:[e.jsx("label",{className:"form-label",children:"Total Amount (₹)"}),e.jsx(x,{type:"number",name:"totalAmount",value:n.totalAmount,readOnly:!0,className:"bg-light font-weight-bold"})]}),e.jsxs(g,{md:6,children:[e.jsx("label",{className:"form-label",children:"Balance Amount (₹)"}),e.jsx(x,{type:"number",name:"balanceAmount",value:n.balanceAmount,readOnly:!0,className:`bg-light font-weight-bold ${parseFloat(n.balanceAmount)>0?"text-danger":"text-success"}`})]})]}),e.jsxs(ne,{onSubmit:w,children:[e.jsxs(L,{className:"mb-3",children:[e.jsxs(g,{md:6,children:[e.jsx("label",{className:"form-label",children:"Reason of Debit"}),e.jsxs(oe,{name:"debitReason",value:n.debitReason,onChange:C,disabled:d,children:[e.jsx("option",{value:"",children:"--Select--"}),e.jsx("option",{value:"Late Payment",children:"Late Payment"}),e.jsx("option",{value:"Panelty",children:"Panelty"}),e.jsx("option",{value:"Cheque Bounse",children:"Cheque Bounse"}),e.jsx("option",{value:"Insurance Endoreshment Debit",children:"Insurance Endoreshment Debit"}),e.jsx("option",{value:"Other",children:"Other"})]})]}),e.jsxs(g,{md:6,children:[e.jsx("label",{className:"form-label",children:"Amount (₹)"}),e.jsx(x,{type:"number",name:"amount",value:n.amount,onChange:C,required:!0,min:"0",step:"0.01",disabled:d})]})]}),e.jsx(L,{className:"mb-3",children:e.jsxs(g,{md:6,children:[e.jsx("label",{className:"form-label",children:"Remark"}),e.jsx(x,{type:"text",name:"remark",value:n.remark,onChange:C,placeholder:"Enter any remarks...",disabled:d})]})})]})]}),e.jsxs(re,{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx(E,{color:"primary",onClick:w,className:"me-2",disabled:d,children:d?"Processing...":"Save Payment"}),e.jsx(E,{color:"info",variant:"outline",onClick:$,children:"View Ledger"})]}),e.jsx(E,{color:"secondary",onClick:f,disabled:d,children:"Close"})]})]})]})},_e=()=>{const{setData:N,filteredData:f,setFilteredData:r,handleFilter:n}=G([]),{currentRecords:p}=Y(f||[]),[d,v]=i.useState(null),[A,b]=i.useState(!0),[y,j]=i.useState(!1),[C,w]=i.useState(null),[$,m]=i.useState(""),[s,h]=i.useState(""),{permissions:c}=V(),a=K(c,T.ACCOUNT,D.ACCOUNT.DEBIT_NOTE),S=W(c,T.ACCOUNT,D.ACCOUNT.DEBIT_NOTE);X(c,T.ACCOUNT,D.ACCOUNT.DEBIT_NOTE),Z(c,T.ACCOUNT,D.ACCOUNT.DEBIT_NOTE);const B=S;i.useEffect(()=>{a&&R()},[a]);const R=async()=>{try{b(!0);const u=(await P.get("/bookings")).data.data.bookings.filter(z=>z.bookingType==="BRANCH");N(u),r(u)}catch(t){const u=k(t);u&&v(u)}finally{b(!1)}},F=t=>{if(!S){k("You do not have permission to add debit notes");return}console.log("Selected booking:",t),w(t),j(!0)},M=t=>{m(t),n(t,H("booking"))},U=t=>{h(t),setTimeout(()=>h(""),3e3),R()};return a?A?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"50vh"},children:e.jsx(q,{color:"primary"})}):e.jsxs("div",{children:[e.jsx("div",{className:"title",children:"Debit Note"}),s&&e.jsx(I,{color:"success",className:"mb-3",children:s}),d&&e.jsx(I,{color:"danger",className:"mb-3",children:d}),e.jsxs(ie,{className:"table-container mt-4",children:[e.jsxs(de,{className:"card-header d-flex justify-content-between align-items-center",children:[e.jsx("div",{}),e.jsxs("div",{className:"d-flex",children:[e.jsx(ce,{className:"mt-1 m-1",children:"Search:"}),e.jsx(x,{type:"text",className:"d-inline-block square-search",value:$,onChange:t=>M(t.target.value),disabled:!a})]})]}),e.jsx(le,{children:e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(me,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(he,{children:e.jsxs(O,{children:[e.jsx(l,{children:"Sr.no"}),e.jsx(l,{children:"Booking ID"}),e.jsx(l,{children:"Model Name"}),e.jsx(l,{children:"Booking Date"}),e.jsx(l,{children:"Customer Name"}),e.jsx(l,{children:"Chassis Number"}),e.jsx(l,{children:"Total"}),e.jsx(l,{children:"Received"}),e.jsx(l,{children:"Balance"}),B&&e.jsx(l,{children:"Action"})]})}),e.jsx(ue,{children:p.length===0?e.jsx(O,{children:e.jsx(o,{colSpan:B?"10":"9",className:"text-center",children:"No booking details available"})}):p.map((t,u)=>e.jsxs(O,{children:[e.jsx(o,{children:u+1}),e.jsx(o,{children:t.bookingNumber||"N/A"}),e.jsx(o,{children:t.model?.model_name||"N/A"}),e.jsx(o,{children:t.createdAt?new Date(t.createdAt).toLocaleDateString("en-GB"):"N/A"}),e.jsx(o,{children:t.customerDetails?.name||"N/A"}),e.jsx(o,{children:t.chassisAllocationStatus==="ALLOCATED"&&t.status==="ALLOCATED"&&t.chassisNumber||"N/A"}),e.jsxs(o,{children:["₹",t.discountedAmount?.toLocaleString("en-IN")||"0"]}),e.jsxs(o,{children:["₹",t.receivedAmount?.toLocaleString("en-IN")||"0"]}),e.jsxs(o,{children:["₹",t.balanceAmount?.toLocaleString("en-IN")||"0"]}),B&&e.jsx(o,{children:e.jsx(E,{size:"sm",color:"primary",className:"action-btn",onClick:()=>F(t),disabled:!S,children:"Add"})})]},t._id||u))})]})})})]}),e.jsx(ge,{show:y,onClose:()=>j(!1),bookingData:C,onDebitNoteSaved:U,canCreateDebitNote:S})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Debit Notes."})};export{_e as default};
