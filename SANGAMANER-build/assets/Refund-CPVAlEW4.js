import{r as l,g as Y,j as e,m as y,z as J,l as Q,v as _,C as K}from"./index-CD-UhOJ2.js";/* empty css              */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as W,g as X}from"./tableFilters-DsQgHBMv.js";import{u as Z}from"./pagination-B7oNW1il.js";/* empty css                */import{t as ee}from"./logo-V-f8m5nN.js";import{r as te,d as ae,e as se,f as ne,g as re,P as I,M as O}from"./DefaultLayout-GrycDKjh.js";import{C as oe,a as ie,b as le,c as de,d as ce}from"./CModalTitle-Cs0DhY3v.js";import{C as U}from"./CAlert-CENR3-Ss.js";import{C as R,a as u}from"./CRow--g2qTLFu.js";import{C as p}from"./CFormInput-CCQbnhW2.js";import{C as me}from"./CForm-CevvQQOo.js";import{C as $}from"./CFormSelect-DGopBSdT.js";import{a as F}from"./index.esm-BML82zAk.js";import{C as he,a as ue}from"./CCardBody-BS7SU2uX.js";import{C as ge}from"./CCardHeader-CGdtZMoU.js";import{C as fe}from"./CFormControlWrapper-BAfeeQeh.js";import{C as pe,a as xe,b as V,c as g,d as be,e as m}from"./CTable-CzW9ULzA.js";import"./slicedToArray-Dby63wcm.js";import"./createSvgIcon-70ImKnSA.js";import"./clsx-B-dksMZM.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./extends-CF3RwP-h.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./CNavItem-C1bzmovJ.js";const je=({show:x,onClose:N,bookingData:c})=>{const[s,S]=l.useState({bookingId:c?._id||"",modeOfPayment:"",amount:"",remark:"",cashLocation:"",bank:"",subPaymentMode:"",gcAmount:c?.payment?.gcAmount||0,transactionReference:"",refundReason:""}),[P,z]=l.useState([]),[q,D]=l.useState([]),[T,E]=l.useState([]),[h,A]=l.useState(!1),[M,b]=l.useState(null),[w,j]=l.useState(null),C=Y(),d=a=>{const{name:o,value:n}=a.target;S(t=>({...t,[o]:n}))},f=async a=>{a.preventDefault(),A(!0),b(null),j(null);try{let o={bookingId:s.bookingId,paymentMode:s.modeOfPayment,amount:parseFloat(s.amount),remark:s.remark,transactionReference:s.transactionReference,refundReason:s.refundReason};switch(s.modeOfPayment){case"Cash":o.cashLocation=s.cashLocation;break;case"Bank":o.bank=s.bank,o.subPaymentMode=s.subPaymentMode;break;default:break}const n=await y.post("/ledger/refund",o);j("Payment successfully recorded!"),console.log("Payment response:",n.data),S({bookingId:c?._id||"",modeOfPayment:"",amount:"",remark:"",cashLocation:"",bank:"",subPaymentMode:"",gcAmount:c?.payment?.gcAmount||0,transactionReference:"",refundReason:""}),setTimeout(()=>{N()},2e3),C("/view-ledgers")}catch(o){console.error("Payment error:",o),b(o.response?.data?.error||"Failed to process payment. Please try again.")}finally{A(!1)}};l.useEffect(()=>{const a=async()=>{try{const t=await y.get("/cash-locations");z(t.data.data.cashLocations)}catch(t){console.error("Error fetching cash locations:",t)}},o=async()=>{try{const t=await y.get("/banks");D(t.data.data.banks)}catch(t){console.error("Error fetching bank locations:",t)}},n=async()=>{try{const t=await y.get("/banksubpaymentmodes");E(t.data.data||[])}catch(t){console.error("Error fetching payment sub-modes:",t),E([])}};if(x){a(),o(),n();const t=c?.payment?.gcAmount||0;S({bookingId:c?._id||"",modeOfPayment:"",amount:"",remark:"",cashLocation:"",bank:"",subPaymentMode:"",gcAmount:t,transactionReference:"",refundReason:""}),b(null),j(null)}},[x,c]);const L=async a=>{try{const n=(await y.get(`/ledger/report/${a._id}`)).data.data,t=`${J.baseURL}/ledger.html?bookingId=${a._id}`,i=n.entries.filter(r=>r.approvalStatus!="Pending"),k={totalCredit:i.reduce((r,v)=>r+(v.credit||0),0),totalDebit:i.reduce((r,v)=>r+(v.debit||0),0),finalBalance:i.reduce((r,v)=>{const G=v.credit||0,H=v.debit||0;return r+(G-H)},0)};window.open("","_blank").document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Customer Ledger - Approved Entries Only</title>
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
                .note {
                  font-style: italic;
                  color: #666;
                  margin-bottom: 5mm;
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
                  <img src="${ee}" class="logo" alt="TVS Logo">
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
                  <div><strong>Customer Name:</strong> ${n.customerDetails?.name||""}</div>
                  <div><strong>Ledger Date:</strong> ${n.ledgerDate||new Date().toLocaleDateString("en-GB")}</div>
                  <div><strong>Customer Address:</strong> ${n.customerDetails?.address||""}</div>
                  <div><strong>Customer Phone:</strong> ${n.customerDetails?.phone||""}</div>
                  <div><strong>Chassis No:</strong> ${n.vehicleDetails?.chassisNo||""}</div>
                  <div><strong>Engine No:</strong> ${n.vehicleDetails?.engineNo||""}</div>
                  <div><strong>Finance Name:</strong> ${n.financeDetails?.financer||""}</div>
                  <div><strong>Sale Executive:</strong> ${n.salesExecutive||""}</div>
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
                    ${i.length>0?i.map(r=>`
                          <tr>
                            <td>${r.date}</td>
                            <td>${r.description||""}</td>
                            <td>${r.receiptNo||""}</td>
                            <td class="text-right">${r.credit?r.credit.toLocaleString("en-IN"):"-"}</td>
                            <td class="text-right">${r.debit?r.debit.toLocaleString("en-IN"):"-"}</td>
                            <td class="text-right">${r.balance?r.balance.toLocaleString("en-IN"):"-"}</td>
                          </tr>
                        `).join(""):'<tr><td colspan="6" class="text-center">No approved entries found</td></tr>'}
                    <tr>
                      <td colspan="3" class="text-left"><strong>Total</strong></td>
                      <td class="text-right"><strong>${k.totalCredit.toLocaleString("en-IN")}</strong></td>
                      <td class="text-right"><strong>${k.totalDebit.toLocaleString("en-IN")}</strong></td>
                      <td class="text-right"><strong>${k.finalBalance.toLocaleString("en-IN")}</strong></td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="footer">
                  <div class="footer-left">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(t)}" 
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
        `)}catch(o){console.error("Error fetching ledger:",o),b("Failed to load ledger. Please try again.")}},B=()=>{switch(s.modeOfPayment){case"Cash":return e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Cash Location"}),e.jsxs($,{name:"cashLocation",value:s.cashLocation,onChange:d,required:!0,disabled:h,children:[e.jsx("option",{value:"",children:"Select Cash Location"}),P.map(a=>e.jsx("option",{value:a.id,children:a.name},a.id))]})]});case"Bank":return e.jsxs(e.Fragment,{children:[e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Payment Sub Mode"}),e.jsxs($,{name:"subPaymentMode",value:s.subPaymentMode,onChange:d,required:!0,disabled:h,children:[e.jsx("option",{value:"",children:"Select Payment Sub Mode"}),T.map(a=>e.jsx("option",{value:a.id,children:a.payment_mode},a.id))]})]}),e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Bank Location"}),e.jsxs($,{name:"bank",value:s.bank,onChange:d,required:!0,disabled:h,children:[e.jsx("option",{value:"",children:"Select Bank Location"}),q.map(a=>e.jsx("option",{value:a.id,children:a.name},a.id))]})]})]});default:return null}};return e.jsxs(e.Fragment,{children:[e.jsx(te,{visible:x,className:"modal-backdrop",style:{backgroundColor:"rgba(0, 0, 0, 0.5)"}}),e.jsxs(oe,{visible:x,onClose:N,size:"lg",alignment:"center",children:[e.jsx(ie,{children:e.jsx(le,{children:"Account Receipt"})}),e.jsxs(de,{children:[M&&e.jsx(U,{color:"danger",children:M}),w&&e.jsx(U,{color:"success",children:w}),e.jsxs(R,{className:"mb-3",children:[e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Customer Name"}),e.jsx(p,{type:"text",value:c?.customerDetails?.name||"",readOnly:!0,className:"bg-light"})]}),e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Chassis Number"}),e.jsx(p,{type:"text",value:c?.chassisNumber||"",readOnly:!0,className:"bg-light"})]})]}),e.jsxs(me,{onSubmit:f,children:[e.jsxs(R,{className:"mb-3",children:[e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Amount (₹)"}),e.jsx(p,{type:"number",name:"amount",value:s.amount,onChange:d,required:!0,min:"0",step:"0.01",disabled:h})]}),e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Mode of Payment"}),e.jsxs($,{name:"modeOfPayment",value:s.modeOfPayment,onChange:d,disabled:h,children:[e.jsx("option",{value:"",children:"--Select--"}),e.jsx("option",{value:"Cash",children:"Cash"}),e.jsx("option",{value:"Bank",children:"Bank"})]})]})]}),e.jsx(R,{className:"mb-3",children:B()}),e.jsxs(R,{className:"mb-3",children:[e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Refund Reason"}),e.jsx(p,{type:"text",name:"refundReason",value:s.refundReason,onChange:d})]}),e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Reference Number"}),e.jsx(p,{type:"text",name:"transactionReference",value:s.transactionReference,onChange:d})]})]}),e.jsx(R,{children:e.jsxs(u,{md:6,children:[e.jsx("label",{className:"form-label",children:"Remark"}),e.jsx(p,{type:"text",name:"remark",value:s.remark,onChange:d,placeholder:"Enter any remarks..."})]})})]})]}),e.jsxs(ce,{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx(F,{color:"primary",onClick:f,className:"me-2",disabled:h,children:h?"Processing...":"Save Payment"}),e.jsx(F,{color:"info",variant:"outline",onClick:L,children:"View Ledger"})]}),e.jsx(F,{color:"secondary",onClick:N,disabled:h,children:"Close"})]})]})]})},Je=()=>{const{setData:x,filteredData:N,setFilteredData:c,handleFilter:s}=W([]),[S,P]=l.useState(!1),[z,q]=l.useState(null),{currentRecords:D}=Z(N),[T,E]=l.useState(null),[h,A]=l.useState(!0),[M,b]=l.useState(""),[w,j]=l.useState(""),{permissions:C}=Q(),d=ae(C,O.ACCOUNT,I.ACCOUNT.REFUND),f=se(C,O.ACCOUNT,I.ACCOUNT.REFUND);ne(C,O.ACCOUNT,I.ACCOUNT.REFUND),re(C,O.ACCOUNT,I.ACCOUNT.REFUND);const L=f;l.useEffect(()=>{d&&B()},[d]);const B=async()=>{try{A(!0);const i=(await y.get("/bookings")).data.data.bookings.filter(k=>k.bookingType==="BRANCH");x(i),c(i)}catch(t){const i=_(t);i&&E(i)}finally{A(!1)}},a=t=>{if(!f){_("You do not have permission to process refunds");return}q(t),P(!0)},o=t=>{b(t),s(t,X("booking"))},n=t=>{j(t),setTimeout(()=>j(""),3e3),B()};return d?h?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"50vh"},children:e.jsx(K,{color:"primary"})}):e.jsxs("div",{children:[e.jsx("div",{className:"title",children:"Customer Refund"}),w&&e.jsx(U,{color:"success",className:"mb-3",children:w}),T&&e.jsx(U,{color:"danger",className:"mb-3",children:T}),e.jsxs(he,{className:"table-container mt-4",children:[e.jsxs(ge,{className:"card-header d-flex justify-content-between align-items-center",children:[e.jsx("div",{}),e.jsxs("div",{className:"d-flex",children:[e.jsx(fe,{className:"mt-1 m-1",children:"Search:"}),e.jsx(p,{type:"text",className:"d-inline-block square-search",value:M,onChange:t=>o(t.target.value),disabled:!d})]})]}),e.jsx(ue,{children:e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(pe,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(xe,{children:e.jsxs(V,{children:[e.jsx(g,{children:"Sr.no"}),e.jsx(g,{children:"Booking ID"}),e.jsx(g,{children:"Model Name"}),e.jsx(g,{children:"Booking Date"}),e.jsx(g,{children:"Customer Name"}),e.jsx(g,{children:"Chassis Number"}),e.jsx(g,{children:"Total"}),e.jsx(g,{children:"Received"}),e.jsx(g,{children:"Balance"}),L&&e.jsx(g,{children:"Action"})]})}),e.jsx(be,{children:D.length===0?e.jsx(V,{children:e.jsx(m,{colSpan:L?"10":"9",className:"text-center",children:"No booking details available"})}):D.map((t,i)=>e.jsxs(V,{children:[e.jsx(m,{children:i+1}),e.jsx(m,{children:t.bookingNumber||"N/A"}),e.jsx(m,{children:t.model?.model_name||"N/A"}),e.jsx(m,{children:t.createdAt?new Date(t.createdAt).toLocaleDateString("en-GB"):"N/A"}),e.jsx(m,{children:t.customerDetails?.name||"N/A"}),e.jsx(m,{children:t.chassisAllocationStatus==="ALLOCATED"&&t.status==="ALLOCATED"&&t.chassisNumber||"N/A"}),e.jsxs(m,{children:["₹",t.discountedAmount?.toLocaleString("en-IN")||"0"]}),e.jsxs(m,{children:["₹",t.receivedAmount?.toLocaleString("en-IN")||"0"]}),e.jsxs(m,{children:["₹",t.balanceAmount?.toLocaleString("en-IN")||"0"]}),L&&e.jsx(m,{children:e.jsx(F,{size:"sm",color:"primary",className:"action-btn",onClick:()=>a(t),disabled:!f,children:"Add"})})]},t._id||i))})]})})})]}),e.jsx(je,{show:S,onClose:()=>P(!1),bookingData:z,onRefundSaved:n,canCreateRefund:f})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Refunds."})};export{Je as default};
