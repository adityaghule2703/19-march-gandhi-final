import{r as m,l as $,v,m as b,j as e,z as y}from"./index-CD-UhOJ2.js";/* empty css              *//* empty css             */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as I,g as R}from"./tableFilters-DsQgHBMv.js";import{t as U}from"./logo-V-f8m5nN.js";import{a as B,c as z}from"./index.esm-BML82zAk.js";import{h as P,d as _,A as O,P as C,M as j}from"./DefaultLayout-GrycDKjh.js";import{C as V,a as F}from"./CCardBody-BS7SU2uX.js";import{C as G}from"./CCardHeader-CGdtZMoU.js";import{C as k}from"./CAlert-CENR3-Ss.js";import{C as M}from"./CFormControlWrapper-BAfeeQeh.js";import{C as q}from"./CFormInput-CCQbnhW2.js";import{C as H,a as Y,b as h,c as a,d as J,e as s}from"./CTable-CzW9ULzA.js";import{c as Q}from"./cil-print-CPAcfqxC.js";import"./slicedToArray-Dby63wcm.js";import"./CNavItem-C1bzmovJ.js";const xe=()=>{const{setData:N,filteredData:g,setFilteredData:w,handleFilter:D}=I([]),[d,p]=m.useState(null),[S,A]=m.useState(""),{permissions:x,user:n}=$(),u=n?.roles?.some(t=>t.name==="SUBDEALER"),f=n?.subdealer?._id;n?.subdealer?.name,P(x,j.SUBDEALER_ACCOUNT,C.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER,O.VIEW);const l=_(x,j.SUBDEALER_ACCOUNT,C.SUBDEALER_ACCOUNT.CUSTOMER_LEDGER);m.useEffect(()=>{if(!l){v("You do not have permission to view Customer Ledger");return}L()},[l]);const L=async()=>{try{let t="/bookings";u&&f&&(t+=`?subdealer=${f}`);const r=(await b.get(t)).data.data.bookings.filter(c=>c.bookingType==="SUBDEALER");N(r),w(r)}catch(t){const i=v(t);i&&p(i)}},E=async t=>{try{const r=(await b.get(`/ledger/report/${t._id}`)).data.data,c=`${y.baseURL}/ledger.html?bookingId=${t._id}`;window.open("","_blank").document.write(`
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
                  <img src="${U}" class="logo" alt="TVS Logo">
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
                <div><strong>Subdealer Name:</strong> ${r.subdealerDetails?.name||""}</div>
                  <div><strong>Subdealer Address:</strong> ${r.subdealerDetails?.address||""}</div>
                  <div><strong>Customer Name:</strong> ${r.customerDetails?.name||""}</div>
                  <div><strong>Ledger Date:</strong> ${r.ledgerDate||new Date().toLocaleDateString("en-GB")}</div>
                  <div><strong>Customer Address:</strong> ${r.customerDetails?.address||""}</div>
                  <div><strong>Customer Phone:</strong> ${r.customerDetails?.phone||""}</div>
                  <div><strong>Chassis No:</strong> ${r.vehicleDetails?.chassisNo||""}</div>
                  <div><strong>Engine No:</strong> ${r.vehicleDetails?.engineNo||""}</div>
                  <div><strong>Finance Name:</strong> ${r.financeDetails?.financer||""}</div>
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
                    ${r.entries?.map(o=>`
                      <tr>
                        <td>${o.date}</td>
                        <td>${o.description||""}</td>
                        <td>${o.receiptNo||""}</td>
                        <td class="text-right">${o.credit?o.credit.toLocaleString("en-IN"):"-"}</td>
                        <td class="text-right">${o.debit?o.debit.toLocaleString("en-IN"):"-"}</td>
                        <td class="text-right">${o.balance?o.balance.toLocaleString("en-IN"):"-"}</td>
                      </tr>
                    `).join("")}
                    <tr>
                      <td colspan="3" class="text-left"><strong>Total</strong></td>
                      <td class="text-right"><strong>${r.totals?.totalCredit?.toLocaleString("en-IN")||"0"}</strong></td>
                      <td class="text-right"><strong>${r.totals?.totalDebit?.toLocaleString("en-IN")||"0"}</strong></td>
                      <td class="text-right"><strong>${r.totals?.finalBalance?.toLocaleString("en-IN")||"0"}</strong></td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="footer">
                  <div class="footer-left">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(c)}" 
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
        `)}catch(i){console.error("Error fetching ledger:",i),p("Failed to load ledger. Please try again.")}},T=t=>{D(t,R("booking"))};return l?d?e.jsx("div",{className:"alert alert-danger",role:"alert",children:d}):e.jsxs("div",{children:[e.jsx("div",{className:"title",children:"Customer Ledger"}),e.jsxs(V,{className:"table-container mt-4",children:[e.jsx(G,{className:"card-header d-flex justify-content-between align-items-center"}),e.jsxs(F,{children:[d&&e.jsx(k,{color:"danger",children:d}),e.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[e.jsx("div",{}),e.jsxs("div",{className:"d-flex",children:[e.jsx(M,{className:"mt-1 m-1",children:"Search:"}),e.jsx(q,{type:"text",className:"d-inline-block square-search",value:S,onChange:t=>{A(t.target.value),T(t.target.value)}})]})]}),e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(H,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(Y,{children:e.jsxs(h,{children:[e.jsx(a,{children:"Sr.no"}),e.jsx(a,{children:"Booking ID"}),e.jsx(a,{children:"Model Name"}),e.jsx(a,{children:"Booking Date"}),e.jsx(a,{children:"Customer Name"}),e.jsx(a,{children:"Chassis Number"}),e.jsx(a,{children:"Total"}),e.jsx(a,{children:"Received"}),e.jsx(a,{children:"Balance"}),e.jsx(a,{children:"Action"})]})}),e.jsx(J,{children:g.length===0?e.jsx(h,{children:e.jsx(s,{colSpan:"10",className:"text-center",children:u?"No customer ledgers available for your account":"No ledger details available"})}):g.map((t,i)=>e.jsxs(h,{children:[e.jsx(s,{children:i+1}),e.jsx(s,{children:t.bookingNumber}),e.jsx(s,{children:t.model?.model_name||""}),e.jsx(s,{children:t.createdAt?new Date(t.createdAt).toLocaleDateString("en-GB"):""}),e.jsx(s,{children:t.customerDetails?.name||""}),e.jsx(s,{children:t.chassisNumber||""}),e.jsx(s,{children:t.discountedAmount?.toLocaleString("en-IN")||"0"}),e.jsx(s,{children:t.receivedAmount?.toLocaleString("en-IN")||"0"}),e.jsx(s,{children:t.balanceAmount?.toLocaleString("en-IN")||"0"}),e.jsx(s,{children:e.jsxs(B,{size:"sm",className:"action-btn",onClick:()=>E(t),children:[e.jsx(z,{icon:Q,className:"icon"})," View Ledger"]})})]},i))})]})})]})]})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Customer Ledger."})};export{xe as default};
