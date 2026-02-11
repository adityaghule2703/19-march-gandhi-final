import{r as n,l as D,A as m,j as t,m as v,w as T}from"./index-CD-UhOJ2.js";/* empty css             */import{t as k}from"./logo-V-f8m5nN.js";import{t as M}from"./tvssangamner-CUMk0KeD.js";import{c as N,a as G}from"./index.esm-BML82zAk.js";import{d as O,P as V,M as _}from"./DefaultLayout-GrycDKjh.js";import{C as j}from"./CInputGroup-DQZZOIho.js";import{C}from"./CInputGroupText-DHH1Ayfr.js";import{c as F}from"./cil-location-pin-CQr6GRP7.js";import{C as H}from"./CFormSelect-DGopBSdT.js";import{c as P}from"./cil-search-CDkY_4k-.js";import{C as q}from"./CFormInput-CCQbnhW2.js";import"./CNavItem-C1bzmovJ.js";import"./CFormControlWrapper-BAfeeQeh.js";function ot(){const p=JSON.parse(localStorage.getItem("user")||"{}"),S=!!p.branch?._id,[o,w]=n.useState({branchId:S?p.branch?._id:"",date:""}),[i,u]=n.useState({}),[g,A]=n.useState([]),[d,x]=n.useState(!1),{permissions:I}=D(),c=O(I,_.FUND_MANAGEMENT,V.FUND_MANAGEMENT.CASH_BOOK);n.useEffect(()=>{if(!c){m("You do not have permission to view Cash Book");return}(async()=>{try{const a=await v.get("/branches");A(a.data.data||[])}catch(a){console.error("Error fetching branches:",a),m(a)}})()},[c]);const f=e=>{const{name:a,value:l}=e.target;w(r=>({...r,[a]:l})),u(r=>({...r,[a]:""}))},B=async()=>{try{x(!0);const e=await v.get(`/vouchers/branch/${o.branchId}/cashbook/${o.date}`);if(e.data.success){let a=e.data.totals.totalCredit,l=e.data.totals.totalDebit;const r=e.data.transactions.map(s=>({...s})),b=g.find(s=>s._id===o.branchId)||{},$=e.data.openingBalance||0,L=e.data.totals.closingBalance||0,h=window.open("","_blank"),E=`
          <html>
            <head>
              <title>Cash Book - ${b.name||""} - ${o.date}</title>
              <style>
                @page {
          size: A4;
          margin: 10mm;
        }
        body {
          font-family: Courier New;
          width: 210mm;
          margin: 0 auto;
          padding: 10mm;
        }
        .header-container {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-left {
          width: 30mm;
          height: auto;
        }
        .logo-right {
          width: 30mm;
          height: auto;
        }
        .header-text {
          flex-grow: 1;
        }
        .header-text h1 {
          margin: 0;
          font-size: 24px;
        }
        .header-text p {
          margin: 2px 0;
          font-size: 14px;
        }
                .header2 {
          display: flex;
          justify-content: space-between;
          border-top: 2px solid #AAAAAA;
          padding-top: 5px;
          margin: 5px 0 15px 0;
        }
                .header2 div {
                  margin: 0;
                }
                .header2 h4 {
                  margin: 0 0 5px 0;
                }
                .header2 p {
                  margin: 0;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 15px 0;
                  font-size: 14px;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 6px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                  text-align: center;
                }
                .total-row {
                  font-weight: bold;
                }
                .signature {
                  text-align: right;
                  margin-top: 10px;
                }
                .balance {
                  font-weight: bold;
                  color: red;
                }
              </style>
            </head>
            <body>
              <div class="header-container">
              <div>
             <img src="${k}" class="logo-left" alt="TVS Logo">
                  <div class="header-text">
                      <h1>GANDHI TVS</h1>
                       <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
                      <p>Registered office:</p>
                     </div>
              </div>
              <div>
                <img src="${M}" class="logo-right" alt="TVS Logo">
                </div>
      </div>

      <div class="header2">
        <div>
          <h4>CASH BOOK</h4>
          <p>Location: ${b.name||""}</p>
        </div>
        <div>
          <p>Date: ${new Date(o.date).toLocaleDateString("en-IN")}</p>
          <p class="balance">OPENING BALANCE: ${$.toLocaleString("en-IN")}</p>
        </div>
      </div>

              <table>
                <thead>
                  <tr>
                    <th>Receipt/VC No</th>
                    <th>Voucher Type</th>
                    <th>Account Head</th>
                    <th>Narration</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${r.map(s=>`
                    <tr>
                      <td>${s.receiptNo||"-"}</td>
                      <td>${s.type}</td>
                      <td>${s.accountHead||"-"}</td>
                      <td>${s.particulars||""}</td>
                       <td>${s.debit||"0"}</td>
                      <td>${s.credit||"0"}</td>
                      <td>${Math.round(s.balance||"0")}</td>
                    </tr>
                  `).join("")}
                  <tr class="total-row">
                    <td colspan="4">Total</td>
                    <td>${l.toLocaleString("en-IN")}</td>
                    <td>${a.toLocaleString("en-IN")}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <div class="balance">
                CLOSING BALANCE: ${L.toLocaleString("en-IN")}
              </div>

              <div class="signature">
                <p>For, Gandhi TVS</p>
                <p>Authorised Signatory</p>
              </div>
            </body>
          </html>
        `;h.document.open(),h.document.write(E),h.document.close()}else T("No data found for the selected branch and date")}catch(e){console.error("Error generating cash book:",e),m(e)}finally{x(!1)}},y=async e=>{e.preventDefault();let a={};if(o.branchId||(a.branchId="This field is required"),o.date||(a.date="This field is required"),Object.keys(a).length>0){u(a);return}await B()};return c?t.jsxs("div",{className:"form-container",children:[t.jsx("div",{className:"title",children:"Cash Account Master"}),t.jsx("div",{className:"form-card",children:t.jsx("div",{className:"form-body",children:t.jsx("form",{onSubmit:y,children:t.jsxs("div",{className:"user-details",children:[t.jsxs("div",{className:"input-box",children:[t.jsxs("div",{className:"details-container",children:[t.jsx("span",{className:"details",children:"Location"}),t.jsx("span",{className:"required",children:"*"})]}),t.jsxs(j,{children:[t.jsx(C,{className:"input-icon",children:t.jsx(N,{icon:F})}),t.jsxs(H,{name:"branchId",value:o.branchId,onChange:f,disabled:d,children:[t.jsx("option",{value:"",children:"-Select-"}),g.map(e=>t.jsx("option",{value:e._id,children:e.name},e._id))]})]}),i.branchId&&t.jsx("p",{className:"error",children:i.branchId})]}),t.jsxs("div",{className:"input-box",children:[t.jsxs("div",{className:"details-container",children:[t.jsx("span",{className:"details",children:"Date"}),t.jsx("span",{className:"required",children:"*"})]}),t.jsxs(j,{children:[t.jsx(C,{className:"input-icon",children:t.jsx(N,{icon:P})}),t.jsx(q,{type:"date",name:"date",value:o.date,onChange:f,disabled:d})]}),i.date&&t.jsx("p",{className:"error",children:i.date})]}),t.jsx("div",{className:"button-container",children:t.jsx(G,{className:"submit-button",type:"submit",disabled:d,children:d?"Searching...":"Search"})})]})})})})]}):t.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Cash Book."})}export{ot as default};
