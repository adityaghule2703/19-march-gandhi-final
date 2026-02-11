import{r as c,l as z,m as j,v as f,j as e,C as V,z as G}from"./index-CD-UhOJ2.js";/* empty css              */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as F,g as M}from"./tableFilters-DsQgHBMv.js";import{u as k}from"./pagination-B7oNW1il.js";import{t as q}from"./logo-V-f8m5nN.js";import{d as H,e as _,f as Y,g as J,P as h,M as g}from"./DefaultLayout-GrycDKjh.js";import{C as w}from"./CAlert-CENR3-Ss.js";import{C as Q,a as K}from"./CCardBody-BS7SU2uX.js";import{C as W}from"./CCardHeader-CGdtZMoU.js";import{C as X}from"./CFormControlWrapper-BAfeeQeh.js";import{C as Z}from"./CFormInput-CCQbnhW2.js";import{C as ee,a as te,b as x,c as n,d as se,e as o}from"./CTable-CzW9ULzA.js";import{a as ie}from"./index.esm-BML82zAk.js";import"./slicedToArray-Dby63wcm.js";import"./createSvgIcon-70ImKnSA.js";import"./clsx-B-dksMZM.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./extends-CF3RwP-h.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./CNavItem-C1bzmovJ.js";const Te=()=>{const{setData:D,filteredData:S,setFilteredData:L,handleFilter:T}=F([]),{currentRecords:u}=k(S),[v,N]=c.useState(null),[E,C]=c.useState(!0),[$,y]=c.useState(""),[b,re]=c.useState(""),{permissions:m}=z(),a=H(m,g.ACCOUNT,h.ACCOUNT.LEDGERS);_(m,g.ACCOUNT,h.ACCOUNT.LEDGERS),Y(m,g.ACCOUNT,h.ACCOUNT.LEDGERS),J(m,g.ACCOUNT,h.ACCOUNT.LEDGERS),c.useEffect(()=>{a&&I()},[a]);const I=async()=>{try{C(!0);const r=(await j.get("/bookings")).data.data.bookings.filter(i=>i.bookingType==="BRANCH");D(r),L(r)}catch(t){const r=f(t);r&&N(r)}finally{C(!1)}},R=async t=>{if(!a){f("You do not have permission to view ledgers");return}try{const i=(await j.get(`/ledger/report/${t._id}`)).data.data,B=`${G.baseURL}/ledger.html?bookingId=${t._id}`;let A=i.entries.filter(s=>s.approvalStatus!=="Pending"),d=A;i.vehicleDetails?.isChassisAllocated===!0&&(d=A.filter(s=>s.debit!==void 0&&s.debit!==null));const p={totalCredit:d.reduce((s,l)=>s+(l.credit||0),0),totalDebit:d.reduce((s,l)=>s+(l.debit||0),0),finalBalance:d.reduce((s,l)=>{const O=l.credit||0,P=l.debit||0;return s+(P-O)},0)};window.open("","_blank").document.write(`
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
                <img src="${q}" class="logo" alt="TVS Logo">
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
                <div><strong>Customer Name:</strong> ${i.customerDetails?.name||"N/A"}</div>
                <div><strong>Ledger Date:</strong> ${i.ledgerDate||new Date().toLocaleDateString("en-GB")}</div>
                <div><strong>Customer Address:</strong> ${i.customerDetails?.address||"N/A"}</div>
                <div><strong>Customer Phone:</strong> ${i.customerDetails?.phone||"N/A"}</div>
                <div><strong>Chassis No:</strong> ${i.vehicleDetails?.chassisNo||"N/A"}</div>
                <div><strong>Engine No:</strong> ${i.vehicleDetails?.engineNo||"N/A"}</div>
                <div><strong>Chassis Allocated:</strong> ${i.vehicleDetails?.isChassisAllocated?"Yes":"No"}</div>
                <div><strong>Finance Name:</strong> ${i.financeDetails?.financer||"N/A"}</div>
                <div><strong>Sale Executive:</strong> ${i.salesExecutive||"N/A"}</div>
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
                  ${d.length>0?d.map(s=>`
                              <tr>
                                <td>${s.date||"N/A"}</td>
                                <td>${s.description||"N/A"}</td>
                                <td>${s.receiptNo||"N/A"}</td>
                                <td class="text-right">${s.credit?s.credit.toLocaleString("en-IN"):"-"}</td>
                                <td class="text-right">${s.debit!==void 0?s.debit.toLocaleString("en-IN"):"-"}</td>
                                <td class="text-right">${s.balance?s.balance.toLocaleString("en-IN"):"-"}</td>
                              </tr>
                            `).join(""):'<tr><td colspan="6" class="text-center">No approved entries found</td></tr>'}
                  ${d.length>0?`<tr>
                          <td colspan="3" class="text-left"><strong>Total</strong></td>
                          <td class="text-right"><strong>${p.totalCredit.toLocaleString("en-IN")}</strong></td>
                          <td class="text-right"><strong>${p.totalDebit.toLocaleString("en-IN")}</strong></td>
                          <td class="text-right"><strong>${p.finalBalance.toLocaleString("en-IN")}</strong></td>
                        </tr>`:""}
                </tbody>
              </table>
              
              <div class="footer">
                <div class="footer-left">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(B)}" 
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
      `)}catch(r){console.error("Error fetching ledger:",r);const i=f(r);i&&N(i)}},U=t=>{a&&(y(t),T(t,M("booking")))};return a?E?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"50vh"},children:e.jsx(V,{color:"primary"})}):e.jsxs("div",{children:[e.jsx("div",{className:"title",children:"Customer Ledger"}),b&&e.jsx(w,{color:"success",className:"mb-3",children:b}),v&&e.jsx(w,{color:"danger",className:"mb-3",children:v}),e.jsxs(Q,{className:"table-container mt-4",children:[e.jsxs(W,{className:"card-header d-flex justify-content-between align-items-center",children:[e.jsx("div",{}),e.jsxs("div",{className:"d-flex",children:[e.jsx(X,{className:"mt-1 m-1",children:"Search:"}),e.jsx(Z,{type:"text",className:"d-inline-block square-search",value:$,onChange:t=>U(t.target.value),disabled:!a})]})]}),e.jsx(K,{children:e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(ee,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(te,{children:e.jsxs(x,{children:[e.jsx(n,{children:"Sr.no"}),e.jsx(n,{children:"Booking ID"}),e.jsx(n,{children:"Model Name"}),e.jsx(n,{children:"Booking Date"}),e.jsx(n,{children:"Customer Name"}),e.jsx(n,{children:"Chassis Number"}),e.jsx(n,{children:"Total"}),e.jsx(n,{children:"Received"}),e.jsx(n,{children:"Balance"}),a&&e.jsx(n,{children:"Action"})]})}),e.jsx(se,{children:u.length===0?e.jsx(x,{children:e.jsx(o,{colSpan:a?"10":"9",className:"text-center",children:"No booking details available"})}):u.map((t,r)=>e.jsxs(x,{children:[e.jsx(o,{children:r+1}),e.jsx(o,{children:t.bookingNumber||"N/A"}),e.jsx(o,{children:t.model?.model_name||"N/A"}),e.jsx(o,{children:t.createdAt?new Date(t.createdAt).toLocaleDateString("en-GB"):"N/A"}),e.jsx(o,{children:t.customerDetails?.name||"N/A"}),e.jsx(o,{children:t.chassisAllocationStatus==="ALLOCATED"&&t.status==="ALLOCATED"&&t.chassisNumber||"N/A"}),e.jsxs(o,{children:["₹",t.discountedAmount?.toLocaleString("en-IN")||"0"]}),e.jsxs(o,{children:["₹",t.receivedAmount?.toLocaleString("en-IN")||"0"]}),e.jsxs(o,{children:["₹",t.balanceAmount?.toLocaleString("en-IN")||"0"]}),a&&e.jsx(o,{children:e.jsx(ie,{size:"sm",color:"info",className:"action-btn",onClick:()=>R(t),disabled:!a,title:a?"View Ledger":"No permission to view ledger",children:"View"})})]},t._id||r))})]})})})]})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Ledgers."})};export{Te as default};
