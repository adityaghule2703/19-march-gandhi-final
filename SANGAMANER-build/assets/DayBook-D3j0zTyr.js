import{r as i,l as $,A as m,j as e,m as v,w as k}from"./index-CD-UhOJ2.js";/* empty css             */import{t as E}from"./logo-V-f8m5nN.js";import{t as L}from"./tvssangamner-CUMk0KeD.js";import{c as j,a as M}from"./index.esm-BML82zAk.js";import{d as V,P as _,M as F}from"./DefaultLayout-GrycDKjh.js";import{C as N}from"./CInputGroup-DQZZOIho.js";import{C as w}from"./CInputGroupText-DHH1Ayfr.js";import{c as G}from"./cil-location-pin-CQr6GRP7.js";import{C as O}from"./CFormSelect-DGopBSdT.js";import{c as q}from"./cil-search-CDkY_4k-.js";import{C as z}from"./CFormInput-CCQbnhW2.js";import"./CNavItem-C1bzmovJ.js";import"./CFormControlWrapper-BAfeeQeh.js";function se(){const p=JSON.parse(localStorage.getItem("user")||"{}"),S=!!p.branch?._id,[o,y]=i.useState({branchId:S?p.branch?._id:"",date:""}),[n,u]=i.useState({}),[g,D]=i.useState([]),[d,f]=i.useState(!1),{permissions:A}=$(),c=V(A,F.FUND_MANAGEMENT,_.FUND_MANAGEMENT.DAY_BOOK);i.useEffect(()=>{if(!c){m("You do not have permission to view Day Book");return}(async()=>{try{const s=await v.get("/branches");D(s.data.data||[])}catch(s){console.error("Error fetching branches:",s),m(s)}})()},[c]);const x=a=>{const{name:s,value:l}=a.target;y(r=>({...r,[s]:l})),u(r=>({...r,[s]:""}))},C=async()=>{try{f(!0);const a=await v.get(`/vouchers/branch/${o.branchId}/daybook/${o.date}`);if(a.data.success){let s=0,l=0,r=0;const I=a.data.transactions.map(t=>(t.voucherType==="credit"?(s+=t.amount||0,r+=t.amount||0):t.voucherType==="debit"&&(l+=t.amount||0,r-=t.amount||0),{...t,balance:r})),b=g.find(t=>t._id===o.branchId)||{},h=window.open("","_blank"),T=`
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
             <img src="${E}" class="logo-left" alt="TVS Logo">
                  <div class="header-text">
                      <h1>GANDHI TVS</h1>
                       <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
                      <p>Registered office:</p>
                     </div>
              </div>
              <div>
                <img src="${L}" class="logo-right" alt="TVS Logo">
                </div>
      </div>

      <div class="header2">
        <div>
          <h4>DAY BOOK</h4>
          <p>Location: ${b.name||""}</p>
        </div>
        <div>
          <p> Ledger Date: ${new Date(o.date).toLocaleDateString("en-IN")}</p>
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
                  </tr>
                </thead>
                <tbody>
                  ${I.map(t=>`
                    <tr>
                      <td>${t.receiptNo||"-"}</td>
                       <td>${t.type||""}</td>
                      <td>${t.accountHead||"-"}</td>
                      <td>${t.particulars||""}</td>
                      <td>${t.debit||"0"}</td>
                      <td>${t.credit||"0"}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>

            
              <div class="signature">
                <p>For, Gandhi TVS</p>
                <p>Authorised Signatory</p>
              </div>
            </body>
          </html>
        `;h.document.open(),h.document.write(T),h.document.close()}else k("No data found for the selected branch and date")}catch(a){console.error("Error generating cash book:",a),m(a)}finally{f(!1)}},B=async a=>{a.preventDefault();let s={};if(o.branchId||(s.branchId="This field is required"),o.date||(s.date="This field is required"),Object.keys(s).length>0){u(s);return}await C()};return c?e.jsxs("div",{className:"form-container",children:[e.jsx("div",{className:"title",children:"Day Book Ledger"}),e.jsx("div",{className:"form-card",children:e.jsx("div",{className:"form-body",children:e.jsx("form",{onSubmit:B,children:e.jsxs("div",{className:"user-details",children:[e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Location"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(N,{children:[e.jsx(w,{className:"input-icon",children:e.jsx(j,{icon:G})}),e.jsxs(O,{name:"branchId",value:o.branchId,onChange:x,disabled:d,children:[e.jsx("option",{value:"",children:"-Select-"}),g.map(a=>e.jsx("option",{value:a._id,children:a.name},a._id))]})]}),n.branchId&&e.jsx("p",{className:"error",children:n.branchId})]}),e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Date"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(N,{children:[e.jsx(w,{className:"input-icon",children:e.jsx(j,{icon:q})}),e.jsx(z,{type:"date",name:"date",value:o.date,onChange:x,disabled:d})]}),n.date&&e.jsx("p",{className:"error",children:n.date})]}),e.jsx("div",{className:"button-container",children:e.jsx(M,{className:"submit-button",type:"submit",disabled:d,children:d?"Searching...":"Search"})})]})})})})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Day Book."})}export{se as default};
