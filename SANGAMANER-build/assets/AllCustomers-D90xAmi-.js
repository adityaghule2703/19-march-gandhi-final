import{r as f,l as W,v as N,m as $,j as e,C as J,z as Q}from"./index-CD-UhOJ2.js";/* empty css              */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as X,g as K}from"./tableFilters-DsQgHBMv.js";import{u as Z}from"./pagination-B7oNW1il.js";import{t as tt}from"./logo-V-f8m5nN.js";import{d as A,e as et,f as st,g as rt,P as b,M as p}from"./DefaultLayout-GrycDKjh.js";import{C as it}from"./CAlert-CENR3-Ss.js";import{C as at,a as ot}from"./CCardBody-BS7SU2uX.js";import{C as nt}from"./CCardHeader-CGdtZMoU.js";import{a as E}from"./index.esm-BML82zAk.js";import{C as dt}from"./CFormControlWrapper-BAfeeQeh.js";import{C as lt}from"./CFormInput-CCQbnhW2.js";import{C as ct,a as mt,b as S,c as l,d as ht,e as d}from"./CTable-CzW9ULzA.js";import"./slicedToArray-Dby63wcm.js";import"./createSvgIcon-70ImKnSA.js";import"./clsx-B-dksMZM.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./extends-CF3RwP-h.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./CNavItem-C1bzmovJ.js";const Ut=()=>{const[R,v]=f.useState(!0),[w,j]=f.useState(null),[T,k]=f.useState(""),{setData:I,filteredData:M,setFilteredData:U,handleFilter:B}=X([]),{currentRecords:D}=Z(M),{permissions:h}=W(),x=A(h,p.CUSTOMERS,b.CUSTOMERS.ALL_CUSTOMERS),y=et(h,p.CUSTOMERS,b.CUSTOMERS.ALL_CUSTOMERS);st(h,p.CUSTOMERS,b.CUSTOMERS.ALL_CUSTOMERS),rt(h,p.CUSTOMERS,b.CUSTOMERS.ALL_CUSTOMERS);const g=A(h,p.CUSTOMERS,b.CUSTOMERS.ALL_CUSTOMERS);f.useEffect(()=>{if(!x){N("You do not have permission to view Customers");return}O()},[x]);const O=async()=>{try{v(!0);const s=await $.get("/customers");I(s.data.data.customers),U(s.data.data.customers)}catch(s){const c=N(s);c&&j(c)}finally{v(!1)}},G=async s=>{if(!g){N("You do not have permission to view customer ledger");return}try{const i=(await $.get(`/ledger/customer/${s._id}`)).data.data,z=`${Q.baseURL}/ledger.html?customerId=${s._id}`,_=i.bookingWiseSummary.map(t=>{const n=t.chassisNumber&&t.chassisNumber.trim()!=="",o=`
            <tr>
              <td>${new Date(t.lastTransactionDate).toLocaleDateString("en-GB")}</td>
              <td>Booking: ${t.vehicleModel||"Unknown Model"}</td>
              <td>${t.bookingNumber}</td>
              <td class="text-right">-</td>
              <td class="text-right">${n?t.totalDebited.toLocaleString("en-IN"):"-"}</td>
              <td class="text-right">${n?t.totalDebited.toLocaleString("en-IN"):"-"}</td>
            </tr>
          `,a=t.ledgerEntries.filter(r=>r.type==="CREDIT").map(r=>`
              <tr>
                <td>${new Date(r.date).toLocaleDateString("en-GB")}</td>
                <td>${r.description}</td>
                <td>${t.bookingNumber}</td>
                <td class="text-right">${r.credit.toLocaleString("en-IN")}</td>
                <td class="text-right">-</td>
                <td class="text-right">${r.balance.toLocaleString("en-IN")}</td>
              </tr>
            `).join("");return o+a}).join(""),V=i.transactions.filter(t=>t.type.includes("ACCESSORY_BILLING")).map(t=>{const n=t.netAmount||t.amount,o=t.booking?.bookingNumber||"-",a=i.bookingWiseSummary.find(m=>m.bookingNumber===o),r=a?.chassisNumber&&a.chassisNumber.trim()!=="";return`
            <tr>
              <td>${new Date(t.receiptDate||t.createdAt).toLocaleDateString("en-GB")}</td>
              <td>${t.type}: ${t.remark||""}</td>
              <td>${o}</td>
              <td class="text-right">-</td>
              <td class="text-right">${r?n.toLocaleString("en-IN"):"-"}</td>
              <td class="text-right"></td>
            </tr>
          `}).join(""),F=i.transactions.filter(t=>t.type.includes("EXCHANGE_CREDIT")).map(t=>{const n=t.netAmount||t.amount,o=t.booking?.bookingNumber||"-";return`
            <tr>
              <td>${new Date(t.receiptDate||t.createdAt).toLocaleDateString("en-GB")}</td>
              <td>${t.type}: ${t.remark||""}</td>
              <td>${o}</td>
              <td class="text-right">${n.toLocaleString("en-IN")}</td>
              <td class="text-right">-</td>
              <td class="text-right"></td>
            </tr>
          `}).join("");let u=0,C=0;i.bookingWiseSummary.forEach(t=>{if(t.chassisNumber&&t.chassisNumber.trim()!==""){u+=t.totalDebited||0;const o=i.transactions.filter(a=>a.type.includes("ACCESSORY_BILLING")&&a.booking?.bookingNumber===t.bookingNumber).reduce((a,r)=>a+(r.netAmount||r.amount||0),0);u+=o}}),i.transactions.forEach(t=>{const n=t.isDebit===!0,o=t.booking?.bookingNumber||"-",a=i.bookingWiseSummary.find(m=>m.bookingNumber===o),r=a?.chassisNumber&&a.chassisNumber.trim()!=="";n&&r&&(u+=t.netAmount||t.amount||0)});const L=i.customerDetails?.totalReceived||0;C=L-u;const Y=i.transactions.map(t=>{const n=t.netAmount||t.amount,o=t.booking?.bookingNumber||"-",a=t.receiptDate||t.createdAt,r=t.isDebit===!0,m=i.bookingWiseSummary.find(H=>H.bookingNumber===o),q=m?.chassisNumber&&m.chassisNumber.trim()!=="";return`
            <tr>
              <td>${new Date(a).toLocaleDateString("en-GB")}</td>
              <td>${t.remark||""}</td>
              <td>${o}</td>
              <td class="text-right">${r?"-":n.toLocaleString("en-IN")}</td>
              <td class="text-right">${r&&q?n.toLocaleString("en-IN"):"-"}</td>
              <td class="text-right"></td>
            </tr>
          `}).join("");window.open("","_blank").document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Customer Ledger - Booking Summary</title>
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
                  <img src="${tt}" class="logo" alt="TVS Logo">
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
                  <div><strong>Customer ID:</strong> ${i.customerDetails?.custId||""}</div>
                  <div><strong>Customer Name:</strong> ${i.customerDetails?.customerName||""}</div>
                  <div><strong>Ledger Date:</strong> ${new Date().toLocaleDateString("en-GB")}</div>
                  <div><strong>Aadhar No:</strong> ${i.customerDetails?.customerAadhaar||""}</div>
                  <div><strong>Pan No:</strong> ${i.customerDetails?.customerPan||""}</div>
                  <div><strong>Current Balance:</strong> ₹${C.toLocaleString("en-IN")}</div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th width="15%">Date</th>
                      <th width="25%">Description</th>
                      <th width="20%">Booking No</th>
                      <th width="10%" class="text-right">Credit (₹)</th>
                      <th width="10%" class="text-right">Debit (₹)</th>
                      <th width="20%" class="text-right">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${_}
                    ${V}
                    ${F}
                    ${Y}
                    <tr>
                      <td colspan="2" class="text-left"><strong>Total</strong></td>
                      <td class="text-center"><strong>-</strong></td>
                      <td class="text-right"><strong>${L.toLocaleString("en-IN")}</strong></td>
                      <td class="text-right"><strong>${u.toLocaleString("en-IN")}</strong></td>
                      <td class="text-right"><strong>${C.toLocaleString("en-IN")}</strong></td>
                    </tr>
                  </tbody>
                </table>

                <div class="footer">
                  <div class="footer-left">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(z)}"
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
        `)}catch(c){console.error("Error fetching ledger:",c),j("Failed to load ledger. Please try again.")}},P=s=>{k(s),B(s,K("allCustomers"))};return x?R?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"50vh"},children:e.jsx(J,{color:"primary"})}):e.jsxs("div",{children:[e.jsx("div",{className:"title",children:"Customer Ledger"}),w&&e.jsx(it,{color:"danger",className:"mb-3",children:w}),e.jsxs(at,{className:"table-container mt-4",children:[e.jsx(nt,{className:"card-header d-flex justify-content-between align-items-center",children:e.jsx("div",{children:y&&e.jsx(E,{size:"sm",className:"action-btn me-1",disabled:!y,children:"New Customer"})})}),e.jsxs(ot,{children:[e.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[e.jsx("div",{}),e.jsxs("div",{className:"d-flex",children:[e.jsx(dt,{className:"mt-1 m-1",children:"Search:"}),e.jsx(lt,{type:"text",className:"d-inline-block square-search",value:T,onChange:s=>P(s.target.value),disabled:!x})]})]}),e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(ct,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(mt,{children:e.jsxs(S,{children:[e.jsx(l,{children:"Sr.no"}),e.jsx(l,{children:"Customer ID"}),e.jsx(l,{children:"Customer Name"}),e.jsx(l,{children:"Address"}),e.jsx(l,{children:"Mobile1"}),e.jsx(l,{children:"Mobile2"}),e.jsx(l,{children:"Date"}),e.jsx(l,{children:"Aadhar Number"}),e.jsx(l,{children:"PAN Number"}),g&&e.jsx(l,{children:"Action"})]})}),e.jsx(ht,{children:D.length===0?e.jsx(S,{children:e.jsx(d,{colSpan:g?"10":"9",className:"text-center",children:"No ledger details available"})}):D.map((s,c)=>e.jsxs(S,{children:[e.jsx(d,{children:c+1}),e.jsx(d,{children:s.custId||""}),e.jsx(d,{children:s.name||""}),e.jsx(d,{children:s.address||""}),e.jsx(d,{children:s.mobile1||""}),e.jsx(d,{children:s.mobile2||""}),e.jsx(d,{children:s.createdAt?new Date(s.createdAt).toLocaleDateString("en-GB"):""}),e.jsx(d,{children:s.aadhaar||""}),e.jsx(d,{children:s.pan||""}),g&&e.jsx(d,{children:e.jsx(E,{size:"sm",className:"option-button btn-sm",onClick:()=>G(s),disabled:!g,children:"View Ledger"})})]},s._id||c))})]})})]})]})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Customers."})};export{Ut as default};
