import{r as U,l as Q,v as L,m as I,j as e,L as W,z as K}from"./index-CD-UhOJ2.js";/* empty css              *//* empty css             */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as X,g as Z}from"./tableFilters-DsQgHBMv.js";import{t as tt}from"./logo-V-f8m5nN.js";import{a as k,c as _}from"./index.esm-BML82zAk.js";import{h as y,d as et,e as at,P as b,M as C,A as P}from"./DefaultLayout-GrycDKjh.js";import{C as it,a as rt}from"./CCardBody-BS7SU2uX.js";import{C as nt}from"./CCardHeader-CGdtZMoU.js";import{c as ot}from"./cil-plus-D8mtC-W5.js";import{C as st}from"./CFormControlWrapper-BAfeeQeh.js";import{C as dt}from"./CFormInput-CCQbnhW2.js";import{C as lt,a as ct,b as E,c as m,d as mt,e as c}from"./CTable-CzW9ULzA.js";import{c as ht}from"./cil-print-CPAcfqxC.js";import"./slicedToArray-Dby63wcm.js";import"./CNavItem-C1bzmovJ.js";const Ot=()=>{const{setData:z,filteredData:$,setFilteredData:G,handleFilter:M}=X([]),[T,V]=U.useState(null),{permissions:f,user:v}=Q(),S=v?.roles?.some(r=>r.name==="SUBDEALER"),O=v?.subdealer?._id;v?.subdealer?.name,y(f,C.SUBDEALER_ACCOUNT,b.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE,P.VIEW),y(f,C.SUBDEALER_ACCOUNT,b.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE,P.CREATE);const u=et(f,C.SUBDEALER_ACCOUNT,b.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE),F=at(f,C.SUBDEALER_ACCOUNT,b.SUBDEALER_ACCOUNT.ONACCOUNT_BALANCE);U.useEffect(()=>{if(!u){L("You do not have permission to view OnAccount Balance");return}q()},[u]);const q=async()=>{try{let i=(await I.get("/subdealers/financials/all")).data.data.subdealers||[];S&&O&&(i=i.filter(s=>s._id===O)),z(i),G(i)}catch(r){const i=L(r);i&&V(i)}},H=async r=>{try{const i=await I.get(`/subdealersonaccount/${r._id}/on-account/receipts`);let s=[],x=[],w=[],N=0,D=0;if(i.data&&i.data.data&&i.data.data.entries){const t=i.data.data;s=t.entries||[],N=t.totals?.onAccountBalance||0,D=N;const o=s.filter(a=>a.type==="CREDIT"||a.credit>0);x=s.filter(a=>a.type==="DEBIT"||a.debit>0).map(a=>({...a,customerDetails:{salutation:"",name:a.subdealerName||r.name||""},bookingNumber:a.receiptNo||a.id,discountedAmount:a.debit,totalAmount:a.debit,amount:a.debit,remark:a.remark||a.description,createdAt:a.timestamp,bookingDate:a.date})),s=o}else i.data&&i.data.docs&&(s=i.data.docs||[],x=i.data.subdealerBookings||[],w=i.data.accessoryBillings||[],D=i.data.totalOnAccountBalance||0,N=D);const J=`${K.baseURL}/ledger.html?ledgerId=${r._id}`;let R=0,A=0,d=0;window.open("","_blank").document.write(`
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
            .no-data {
              text-align: center;
              padding: 20mm;
              color: #666;
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
              <div><strong>Subdealer Name:</strong> ${r.name||""}</div>
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
                ${s.length>0?s.map(t=>{const o=t.type!==void 0;let n=0,a="",l="",h="",g="";o?(n=t.credit||0,a=t.date||new Date(t.timestamp).toLocaleDateString("en-GB"),l=t.remark||t.description||"",h=t.receiptNo||t.id||"",g=t.paymentMode||"N/A"):(n=t.amount||0,a=new Date(t.createdAt).toLocaleDateString("en-GB"),l=t.remark||"",h=t.refNumber||"",g=t.paymentMode||"N/A"),d+=n,R+=n;let j="";return j+=`
                      <tr>
                        <td>${a}</td>
                        <td>
                          ${o?"On-Account Payment":"OnAccount Receipt"}<br>
                          Mode: ${g}<br>
                          ${l}
                        </td>
                        <td>${h}</td>
                        <td class="text-right">${n.toLocaleString("en-IN")}</td>
                        <td class="text-right">0</td>
                        <td class="text-right">${d.toLocaleString("en-IN")}</td>
                      </tr>
                    `,!o&&t.allocations&&t.allocations.length>0&&t.allocations.forEach(p=>{const B=p.amount||0;d-=B,A+=B,j+=`
                          <tr>
                            <td>${new Date(p.allocatedAt).toLocaleDateString("en-GB")}</td>
                            <td>
                              Allocation to Booking<br>
                              Customer: ${p.booking?.customerDetails?.name||"N/A"}<br>
                              Booking No: ${p.booking?.bookingNumber||"N/A"}
                            </td>
                            <td>${p.ledger?.transactionReference||t.refNumber||""}</td>
                            <td class="text-right">0</td>
                            <td class="text-right">${B.toLocaleString("en-IN")}</td>
                            <td class="text-right">${d.toLocaleString("en-IN")}</td>
                          </tr>
                        `}),j}).join(""):'<tr><td colspan="6" class="no-data">No receipt data available</td></tr>'}

                ${x.length>0?x.map(t=>{const o=t.type!==void 0;let n=0,a="",l="",h="",g="";return o?(n=t.discountedAmount||t.debit||0,a=t.date||new Date(t.timestamp).toLocaleDateString("en-GB"),l=t.customerDetails?.name||t.subdealerName||"N/A",h=t.remark||t.description||"",g=t.bookingNumber||t.receiptNo||t.id||""):(n=t.discountedAmount||t.totalAmount||t.amount||0,a=new Date(t.bookingDate||t.createdAt).toLocaleDateString("en-GB"),l=t.customerDetails?.name||"N/A",h=t.remark||"",g=t.bookingNumber||t._id||""),d-=n,A+=n,`
                      <tr>
                        <td>${a}</td>
                        <td>
                          Booking Created<br>
                          Customer: ${l}<br>
                          ${h}
                        </td>
                        <td>${g}</td>
                        <td class="text-right">0</td>
                        <td class="text-right">${n.toLocaleString("en-IN")}</td>
                        <td class="text-right">${d.toLocaleString("en-IN")}</td>
                      </tr>
                    `}).join(""):""}
                
                ${w.length>0?w.map(t=>{const o=t.amount||0;d-=o,A+=o;const n=t.cashLocation?.name||"",a=t.paymentMode||"N/A",l=t.remark||"Accessory Billing";return`
                      <tr>
                        <td>${new Date(t.createdAt).toLocaleDateString("en-GB")}</td>
                        <td>
                          ${l}<br>
                          ${n} ${a}
                        </td>
                        <td>${t.transactionReference||t._id||""}</td>
                        <td class="text-right">0</td>
                        <td class="text-right">${o.toLocaleString("en-IN")}</td>
                        <td class="text-right">${d.toLocaleString("en-IN")}</td>
                      </tr>
                    `}).join(""):""}

                <tr>
                  <td colspan="3" class="text-left"><strong>OnAccount Balance</strong></td>
                  <td></td>
                    <td></td>
                  <td class="text-right"><strong>${N.toLocaleString("en-IN")||"0"}</strong></td>
                </tr>
                <tr>
                  <td colspan="3" class="text-left"><strong>Total</strong></td>
                  <td class="text-right"><strong>${R.toLocaleString("en-IN")}</strong></td>
                  <td class="text-right"><strong>${A.toLocaleString("en-IN")}</strong></td>
                  <td class="text-right"><strong>${d.toLocaleString("en-IN")}</strong></td>
                </tr>
              </tbody>
            </table>
            
            <div class="footer">
              <div class="footer-left">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(J)}" 
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
    `)}catch(i){console.error("Error fetching ledger:",i),L("Failed to load ledger. Please try again.")}},Y=r=>{M(r,Z("subdealer"))};return u?T?e.jsx("div",{className:"alert alert-danger",role:"alert",children:T}):e.jsxs("div",{children:[e.jsx("div",{className:"title",children:"OnAccount Balance"}),e.jsxs(it,{className:"table-container mt-4",children:[e.jsx(nt,{className:"card-header d-flex justify-content-between align-items-center",children:e.jsx("div",{children:F&&!S&&e.jsx(W,{to:"/subdealer-account/add-amount",children:e.jsxs(k,{size:"sm",className:"action-btn me-1",children:[e.jsx(_,{icon:ot,className:"icon"})," New Balance"]})})})}),e.jsxs(rt,{children:[e.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[e.jsx("div",{}),e.jsxs("div",{className:"d-flex",children:[e.jsx(st,{className:"mt-1 m-1",children:"Search:"}),e.jsx(dt,{type:"text",className:"d-inline-block square-search",onChange:r=>Y(r.target.value)})]})]}),e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(lt,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(ct,{children:e.jsxs(E,{children:[e.jsx(m,{children:"Sr.no"}),e.jsx(m,{children:"Name"}),e.jsx(m,{children:"Total Bookings"}),e.jsx(m,{children:"Total Amount"}),e.jsx(m,{children:"Total Received"}),e.jsx(m,{children:"Total Balance"}),e.jsx(m,{children:"OnAccount Balance"}),u&&e.jsx(m,{children:"Action"})]})}),e.jsx(mt,{children:$.length===0?e.jsx(E,{children:e.jsx(c,{colSpan:u?"8":"7",className:"text-center",children:S?"No on-account balance data available for your account":"No subdealers available"})}):$.map((r,i)=>e.jsxs(E,{children:[e.jsx(c,{children:i+1}),e.jsx(c,{children:r.name}),e.jsx(c,{children:r.financials.bookingSummary.totalBookings}),e.jsx(c,{children:r.financials.bookingSummary.totalBookingAmount}),e.jsx(c,{children:r.financials.bookingSummary.totalReceivedAmount}),e.jsx(c,{children:r.financials.bookingSummary.totalBalanceAmount}),e.jsx(c,{children:r.financials.onAccountSummary.totalBalance}),u&&e.jsx(c,{children:e.jsxs(k,{size:"sm",className:"action-btn",onClick:()=>H(r),children:[e.jsx(_,{icon:ht,className:"icon"})," View Ledger"]})})]},i))})]})})]})]})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view OnAccount Balance."})};export{Ot as default};
