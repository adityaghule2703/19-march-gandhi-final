import{r,j as e,m as E,l as Fe,v as z,C as Re,z as ze}from"./index-CD-UhOJ2.js";/* empty css              */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as Ue}from"./tableFilters-DsQgHBMv.js";import{u as Ge}from"./pagination-B7oNW1il.js";import{t as De}from"./logo-V-f8m5nN.js";/* empty css                *//* empty css             */import{r as qe,d as Ve,e as He,f as Xe,g as Ye,j as xe,P as Z,M as K}from"./DefaultLayout-GrycDKjh.js";import{C as je,a as Ce,b as ye,c as Ne,d as Ae}from"./CModalTitle-Cs0DhY3v.js";import{C as ce}from"./CAlert-CENR3-Ss.js";import{C as Je}from"./CForm-CevvQQOo.js";import{C as W,a as S}from"./CRow--g2qTLFu.js";import{C as M}from"./CFormSelect-DGopBSdT.js";import{C as ne}from"./CFormInput-CCQbnhW2.js";import{a as k,c as $}from"./index.esm-BML82zAk.js";import{C as Qe,a as Ze}from"./CCardBody-BS7SU2uX.js";import{C as Ke}from"./CCardHeader-CGdtZMoU.js";import{c as We}from"./cil-search-CDkY_4k-.js";import{c as et}from"./cil-zoom-out-CKQIhtD9.js";import{C as fe}from"./CFormControlWrapper-BAfeeQeh.js";import{C as tt,a as nt,b as ee,c as p,d as at,e as i}from"./CTable-CzW9ULzA.js";import{M as be}from"./Menu-DZGW0kW4.js";import{M as te}from"./MenuItem-FukuNeBD.js";import{c as pe}from"./cil-plus-D8mtC-W5.js";import"./slicedToArray-Dby63wcm.js";import"./createSvgIcon-70ImKnSA.js";import"./clsx-B-dksMZM.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./extends-CF3RwP-h.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./CNavItem-C1bzmovJ.js";import"./TransitionGroup-CT7_5huu.js";import"./setPrototypeOf-C3V6guyq.js";import"./emotion-react.browser.esm-HxER6ccQ.js";import"./Transition-DXUjlb7_.js";const st=({show:B,onClose:L,brokerData:f,refreshData:O})=>{const C=f?.branchId,[l,N]=r.useState({brokerId:f?.broker?._id||"",branch:C||"",type:"",modeOfPayment:"",amount:"",remark:"",referenceNumber:"",cashLocation:"",bank:"",subPaymentMode:""}),[F,ae]=r.useState([]),[se,oe]=r.useState([]),[U,re]=r.useState([]),[G,de]=r.useState([]),[b,w]=r.useState(!1),[D,P]=r.useState(null),[I,T]=r.useState(null),[ie,R]=r.useState(null),[q,u]=r.useState(!1);r.useEffect(()=>{if(f?.broker?.branches?.length>0){const s=C?f.broker.branches.find(d=>d.branchId===C):f.broker.branches.find(d=>d.isActive);s&&(R({type:s.commissionType,range:s.commissionRange,fixedAmount:s.fixedCommission}),s.commissionType==="FIXED"&&s.fixedCommission&&N(d=>({...d,amount:s.fixedCommission})))}},[f,C]);const j=s=>{const{name:d,value:y}=s.target;if(N(A=>({...A,[d]:y})),d==="amount"){const A=parseFloat(y)||0;N(h=>({...h,balanceAmount:parseFloat(h.totalAmount)-A}))}},V=async s=>{if(s.preventDefault(),w(!0),P(null),T(null),!l.branch){P("Please select a branch/location"),w(!1);return}try{let d={brokerId:l.brokerId,type:l.type,modeOfPayment:l.modeOfPayment,amount:parseFloat(l.amount),remark:l.remark,referenceNumber:l.referenceNumber};switch(l.modeOfPayment){case"Cash":d.cashLocation=l.cashLocation;break;case"Bank":d.bank=l.bank,d.subPaymentMode=l.subPaymentMode;break;default:break}const y=await E.post(`/broker-ledger/on-account/${l.brokerId}/${l.branch}`,d);T("Payment successfully recorded!"),O&&O(),L(),N({brokerId:f?.broker?._id||"",branch:C||"",type:"",modeOfPayment:"",amount:"",remark:"",referenceNumber:"",cashLocation:"",bank:"",subPaymentMode:""}),u(!1)}catch(d){console.error("Payment error:",d),P(d.response?.data?.message||"Failed to process payment. Please try again.")}finally{w(!1)}};r.useEffect(()=>{const s=async()=>{try{const h=await E.get("/cash-locations");ae(h.data.data.cashLocations)}catch(h){console.error("Error fetching cash locations:",h)}},d=async()=>{try{const h=await E.get("/banks");oe(h.data.data.banks)}catch(h){console.error("Error fetching bank locations:",h)}},y=async()=>{try{const h=await E.get("/banksubpaymentmodes");re(h.data.data)}catch(h){console.error("Error fetching bank submode:",h)}},A=async()=>{try{const h=await E.get("/branches");de(h.data.data)}catch(h){console.error("Error fetching locations:",h)}};B&&(s(),d(),y(),A(),N({brokerId:f?.broker?._id||"",branch:C||"",type:"",modeOfPayment:"",amount:f?.broker?.branches?.[0]?.commissionType==="FIXED"?f.broker.branches[0].fixedCommission:"",remark:"",referenceNumber:"",cashLocation:"",bank:"",subPaymentMode:""}),P(null),T(null),u(!1))},[B,f,C]);const H=()=>{switch(l.modeOfPayment){case"Cash":return e.jsxs(S,{md:6,children:[e.jsx("label",{className:"form-label",children:"Cash Location"}),e.jsxs(M,{name:"cashLocation",value:l.cashLocation,onChange:j,required:!0,disabled:b,children:[e.jsx("option",{value:"",children:"Select Cash Location"}),F.map(s=>e.jsx("option",{value:s._id,children:s.name},s._id))]})]});case"Bank":return e.jsxs(e.Fragment,{children:[e.jsxs(S,{md:6,children:[e.jsx("label",{className:"form-label",children:"Submode"}),e.jsxs(M,{name:"subPaymentMode",value:l.subPaymentMode,onChange:j,required:!0,disabled:b,children:[e.jsx("option",{value:"",children:"Select submode"}),U.map(s=>e.jsx("option",{value:s._id,children:s.payment_mode},s._id))]})]}),e.jsxs(S,{md:6,children:[e.jsx("label",{className:"form-label",children:"Bank"}),e.jsxs(M,{name:"bank",value:l.bank,onChange:j,required:!0,disabled:b,children:[e.jsx("option",{value:"",children:"Select Bank"}),se.map(s=>e.jsx("option",{value:s._id,children:s.name},s._id))]})]})]});default:return null}};return e.jsxs(e.Fragment,{children:[e.jsx(qe,{visible:B,className:"modal-backdrop",style:{backgroundColor:"rgba(0, 0, 0, 0.5)"}}),e.jsxs(je,{visible:B,onClose:L,size:"lg",alignment:"center",children:[e.jsx(Ce,{children:e.jsx(ye,{children:"Add Balance"})}),e.jsxs(Ne,{children:[D&&e.jsx(ce,{color:"danger",children:D}),I&&e.jsx(ce,{color:"success",children:I}),e.jsxs(Je,{onSubmit:V,children:[e.jsxs(W,{className:"mb-3",children:[e.jsxs(S,{md:6,children:[e.jsx("label",{className:"form-label",children:"Location"}),e.jsxs(M,{name:"branch",value:l.branch,onChange:j,required:!0,disabled:b||!!C,children:[e.jsx("option",{value:"",children:"Select Location"}),G.map(s=>e.jsx("option",{value:s._id,children:s.name},s._id))]})]}),e.jsxs(S,{md:6,children:[e.jsx("label",{className:"form-label",children:"Mode of Payment"}),e.jsxs(M,{name:"modeOfPayment",value:l.modeOfPayment,onChange:j,required:!0,disabled:b,children:[e.jsx("option",{value:"",children:"-- Select Mode --"}),e.jsx("option",{value:"Cash",children:"Cash"}),e.jsx("option",{value:"Bank",children:"Bank"}),e.jsx("option",{value:"Exchange",children:"Exchange"}),e.jsx("option",{value:"UPI",children:"UPI"}),e.jsx("option",{value:"Pay Order",children:"Pay Order"})]})]})]}),e.jsx(W,{className:"mb-3",children:H()}),e.jsxs(W,{className:"mb-3",children:[e.jsxs(S,{md:6,children:[e.jsx("label",{className:"form-label",children:"Amount (₹)"}),e.jsx(ne,{type:"number",name:"amount",value:l.amount,onChange:j,required:!0,min:"0",step:"0.01",disabled:b||ie?.type==="FIXED"&&!q})]}),e.jsxs(S,{md:6,children:[e.jsx("label",{className:"form-label",children:"Reference Number"}),e.jsx(ne,{type:"text",name:"referenceNumber",value:l.referenceNumber,onChange:j,disabled:b})]})]}),e.jsx(W,{className:"mb-3",children:e.jsxs(S,{md:6,children:[e.jsx("label",{className:"form-label",children:"Remark"}),e.jsx(ne,{type:"text",name:"remark",value:l.remark,onChange:j,placeholder:"Enter remarks...",disabled:b})]})})]})]}),e.jsxs(Ae,{children:[e.jsx("div",{children:e.jsx(k,{color:"primary",onClick:V,className:"me-2",disabled:b,children:b?"Processing...":"Save Payment"})}),e.jsx(k,{color:"secondary",onClick:L,disabled:b,children:"Close"})]})]})]})},Dt=()=>{const[B,L]=r.useState(null),[f,O]=r.useState(null),[C,l]=r.useState(!0),[N,F]=r.useState(null),[ae,se]=r.useState(""),[oe,U]=r.useState(!1),[re,G]=r.useState(null),[de,b]=r.useState([]),[w,D]=r.useState({}),[P,I]=r.useState(!1),[T,ie]=r.useState([]),[R,q]=r.useState(""),[u,j]=r.useState(!1),[V,H]=r.useState(""),[s,d]=r.useState(""),{data:y,setData:A,filteredData:h,setFilteredData:ve,handleFilter:Se}=Ue([]),{currentRecords:me}=Ge(h),{permissions:X}=Fe(),c=Ve(X,K.ACCOUNT,Z.ACCOUNT.EXCHANGE_LEDGER),v=He(X,K.ACCOUNT,Z.ACCOUNT.EXCHANGE_LEDGER);Xe(X,K.ACCOUNT,Z.ACCOUNT.EXCHANGE_LEDGER),Ye(X,K.ACCOUNT,Z.ACCOUNT.EXCHANGE_LEDGER);const Y=v||c;r.useEffect(()=>{c&&(_(),ke())},[c]),r.useEffect(()=>{if(y.length>0){const t=Ie(y,u);b(t),ve(t)}},[y,u]);const ke=async()=>{if(c)try{const t=await E.get("/branches");ie(t.data.data)}catch(t){const m=z(t);m&&F(m)}},_=async(t=null)=>{if(c)try{l(!0);let m="/broker-ledger/summary/detailed";t&&(m=`/broker-ledger/summary/branch/${t}`);const n=await E.get(m);if(t){const a=T.find(g=>g._id===t)?.name||"Selected Branch";H(a);const o=n.data.data.brokers.map(g=>({broker:g.broker,branch:{_id:n.data.data.branch,name:a},bookings:{total:g.totalBookings,details:[]},financials:{totalExchangeAmount:g.totalExchangeAmount,ledger:{currentBalance:g.ledger.currentBalance,onAccount:g.ledger.onAccount,totalCredit:g.ledger.totalCredit||0,totalDebit:g.ledger.totalDebit||0,outstandingAmount:g.ledger.outstandingAmount||0,transactions:g.ledger.transactions||0},summary:{totalReceived:g.summary?.totalReceived||0,totalPayable:g.summary?.totalPayable||0,netBalance:g.ledger.currentBalance}},recentTransactions:[],association:{isActive:!0}}));A(o),j(!0)}else A(n.data.data.brokers),j(!1),H("")}catch(m){const n=z(m);n&&F(n)}finally{l(!1)}},Ee=async()=>{c&&(R?await _(R):await _(),I(!1))},Be=async()=>{c&&(q(""),await _(),I(!1))},Ie=(t,m=!1)=>{const n={};return t.forEach(a=>{const o=a.broker._id;n[o]||(n[o]={broker:a.broker,branches:[],totalBookings:0,totalExchangeAmount:0,totalCredit:0,totalDebit:0,onAccount:0,currentBalance:0,outstandingAmount:0}),m?(n[o].branches=[{name:a.branch.name,branchId:a.branch._id,bookings:a.bookings.total,exchangeAmount:a.financials.totalExchangeAmount,credit:a.financials.ledger.totalCredit,debit:a.financials.ledger.totalDebit,onAccount:a.financials.ledger.onAccount,currentBalance:a.financials.ledger.currentBalance,outstandingAmount:a.financials.ledger.outstandingAmount}],n[o].totalBookings=a.bookings.total,n[o].totalExchangeAmount=a.financials.totalExchangeAmount,n[o].totalCredit=a.financials.ledger.totalCredit,n[o].totalDebit=a.financials.ledger.totalDebit,n[o].onAccount=a.financials.ledger.onAccount,n[o].currentBalance=a.financials.ledger.currentBalance,n[o].outstandingAmount=a.financials.ledger.outstandingAmount):(n[o].branches.push({name:a.branch.name,branchId:a.branch._id,bookings:a.bookings.total,exchangeAmount:a.financials.totalExchangeAmount,credit:a.financials.ledger.totalCredit,debit:a.financials.ledger.totalDebit,onAccount:a.financials.ledger.onAccount,currentBalance:a.financials.ledger.currentBalance,outstandingAmount:a.financials.ledger.outstandingAmount}),n[o].totalBookings+=a.bookings.total,n[o].totalExchangeAmount+=a.financials.totalExchangeAmount,n[o].totalCredit+=a.financials.ledger.totalCredit,n[o].totalDebit+=a.financials.ledger.totalDebit,n[o].onAccount+=a.financials.ledger.onAccount,n[o].currentBalance+=a.financials.ledger.currentBalance,n[o].outstandingAmount+=a.financials.ledger.outstandingAmount)}),Object.values(n)},Le=t=>{c&&(u||D(m=>({...m,[t]:!m[t]})))},he=(t,m,n=null,a=null)=>{!c&&!v||(L(t.currentTarget),O(m),n&&G({...n,branchId:a}))},J=()=>{L(null),O(null)},ue=(t,m=null)=>{if(!v){z("You do not have permission to add payments");return}G({...t,branchId:m}),U(!0),J()},ge=async(t,m=null)=>{if(!c){z("You do not have permission to view ledgers");return}try{let n=`/broker-ledger/statement/${t.broker?._id}`;m&&(n+=`?branchId=${m}`);const o=(await E.get(n)).data.data,g=`${ze.baseURL}/brokerData.html?ledgerId=${t._id}`;let Q=0,le=0;const $e=o.summary?.totalOnAccount??o.onAccountBalance??0;o.transactions?.forEach(x=>{x.type==="CREDIT"?Q+=x.amount:x.type==="DEBIT"&&(le+=x.amount)});const Me=le-Q,Oe=$e-Q;window.open("","_blank").document.write(`
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
                  <div><strong>Broker Name:</strong> ${o.broker?.name||"N/A"}</div>
                  <div><strong>Ledger Date:</strong> ${o.ledgerDate||new Date().toLocaleDateString("en-GB")}</div>
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
                    ${o.transactions?.map(x=>`
                      <tr>
                        <td>${new Date(x.date).toLocaleDateString()||"N/A"}</td>
                        <td>
                          Booking No: ${x.booking?.bookingNumber||"-"}<br>
                           Customer: ${x.booking?.customerName||"-"}<br>
                           Chassis Number:${x.booking?.chassisNumber||"-"}
                           ${x.mode||""}
                        </td>
                        <td>${x.referenceNumber||""}</td>
                       <td class="text-right">${x.type==="CREDIT"?x.amount.toLocaleString("en-IN"):"-"}</td>
                       <td class="text-right">${x.type==="DEBIT"?x.amount.toLocaleString("en-IN"):"-"}</td>
                       <td class="text-right">

                       </td>
                      </tr>
                    `).join("")}
                      <tr>
                      <td colspan="3" class="text-left"><strong>Total OnAccount</strong></td>
                      <td class="text-right"></td>
                      <td class="text-right"></td>
                      <td class="text-right"><strong>${Oe.toLocaleString("en-IN")}</strong></td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-left"><strong>Total</strong></td>
                      <td class="text-right"><strong>${Q.toLocaleString("en-IN")}</strong></td>
                      <td class="text-right"><strong>${le.toLocaleString("en-IN")}</strong></td>
                      <td class="text-right"><strong>${Me.toLocaleString("en-IN")}</strong></td>
                    </tr>

                  </tbody>
                </table>

                <div class="footer">
                  <div class="footer-left">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(g)}"
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
        `)}catch(n){console.error("Error fetching ledger:",n);const a=z(n);a&&F(a)}J()},we=t=>{c&&(se(t),Se(t,["broker.name"]))},Pe=t=>{d(t),setTimeout(()=>d(""),3e3),_()};if(!c)return e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Exchange Ledger."});if(C)return e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"50vh"},children:e.jsx(Re,{color:"primary"})});if(N)return e.jsx("div",{className:"alert alert-danger",role:"alert",children:N});const Te=u?11:12,_e=Y?1:0;return e.jsxs("div",{children:[e.jsxs("div",{className:"title",children:["Exchange Ledger ",u&&`- ${V}`]}),s&&e.jsx(ce,{color:"success",className:"mb-3",children:s}),e.jsxs(Qe,{className:"table-container mt-4",children:[e.jsx(Ke,{className:"card-header d-flex justify-content-between align-items-center",children:e.jsxs("div",{children:[e.jsxs(k,{size:"sm",className:"action-btn me-1",onClick:()=>I(!0),disabled:!c,children:[e.jsx($,{icon:We,className:"me-1"}),"Search"]}),u&&e.jsxs(k,{size:"sm",className:"action-btn me-1",onClick:Be,disabled:!c,children:[e.jsx($,{icon:et,className:"me-1"}),"Clear Filter"]})]})}),e.jsxs(Ze,{children:[e.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[e.jsx("div",{}),e.jsxs("div",{className:"d-flex",children:[e.jsx(fe,{className:"mt-1 m-1",children:"Search:"}),e.jsx(ne,{type:"text",className:"d-inline-block square-search",value:ae,onChange:t=>we(t.target.value),disabled:!c})]})]}),e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(tt,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(nt,{children:e.jsxs(ee,{children:[!u&&e.jsx(p,{}),e.jsx(p,{children:"Sr.no"}),e.jsx(p,{children:"Exchange Broker Name"}),e.jsx(p,{children:"Mobile"}),!u&&e.jsx(p,{children:"Branch"}),e.jsx(p,{children:"Total Bookings"}),e.jsx(p,{children:"Total Exchange Amount"}),e.jsx(p,{children:"Total Received"}),e.jsx(p,{children:"Total Payable"}),e.jsx(p,{children:"Opening Balance"}),e.jsx(p,{children:"Current Balance"}),e.jsx(p,{children:"Outstanding Amount"}),Y&&e.jsx(p,{children:"Actions"})]})}),e.jsx(at,{children:me.length===0?e.jsx(ee,{children:e.jsx(i,{colSpan:Te+_e,className:"text-center",children:"No ledger details available"})}):me.map((t,m)=>e.jsxs(e.Fragment,{children:[e.jsxs(ee,{className:"broker-summary-row",children:[!u&&e.jsx(i,{children:e.jsx(k,{color:"link",size:"sm",onClick:()=>Le(t.broker._id),disabled:!c,children:w[t.broker._id]?"▼":"►"})}),e.jsx(i,{children:m+1}),e.jsx(i,{children:t.broker.name||"N/A"}),e.jsx(i,{children:t.broker.mobile||"N/A"}),!u&&e.jsx(i,{children:"All Branches"}),e.jsx(i,{children:t.totalBookings||0}),e.jsx(i,{children:t.totalExchangeAmount?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:t.totalCredit?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:t.totalDebit?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:t.onAccount?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:t.currentBalance?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:t.outstandingAmount?.toLocaleString("en-IN")||"0"}),Y&&e.jsxs(i,{children:[e.jsxs(k,{size:"sm",className:"option-button btn-sm",onClick:n=>he(n,t.broker._id,t),disabled:!v&&!c,children:[e.jsx($,{icon:xe}),"Options"]}),e.jsxs(be,{id:`action-menu-${t.broker._id}`,anchorEl:B,open:f===t.broker._id,onClose:J,children:[v&&e.jsxs(te,{onClick:()=>ue(t,u?t.branches[0]?.branchId:null),children:[e.jsx($,{icon:pe,className:"me-2"}),"Add Payment"]}),c&&e.jsx(te,{onClick:()=>ge(t,u?t.branches[0]?.branchId:null),children:"View Ledger"})]})]})]},t.broker._id),!u&&w[t.broker._id]&&t.branches.map((n,a)=>e.jsxs(ee,{className:"branch-detail-row",children:[e.jsx(i,{}),e.jsx(i,{}),e.jsx(i,{}),e.jsx(i,{}),e.jsx(i,{children:n.name||"N/A"}),e.jsx(i,{children:n.bookings||0}),e.jsx(i,{children:n.exchangeAmount?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:n.credit?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:n.debit?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:n.onAccount?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:n.currentBalance?.toLocaleString("en-IN")||"0"}),e.jsx(i,{children:n.outstandingAmount?.toLocaleString("en-IN")||"0"}),Y&&e.jsxs(i,{children:[e.jsxs(k,{size:"sm",className:"option-button btn-sm",onClick:o=>he(o,`${t.broker._id}-${n.branchId}`,t,n.branchId),disabled:!v&&!c,children:[e.jsx($,{icon:xe}),"Options"]}),e.jsxs(be,{id:`action-menu-${t.broker._id}-${n.branchId}`,anchorEl:B,open:f===`${t.broker._id}-${n.branchId}`,onClose:J,children:[v&&e.jsxs(te,{onClick:()=>ue(t,n.branchId),children:[e.jsx($,{icon:pe,className:"me-2"}),"Add Payment"]}),c&&e.jsx(te,{onClick:()=>ge(t,n.branchId),children:"View Ledger"})]})]})]},`${t.broker._id}-${n.branchId}`))]}))})]})})]})]}),e.jsxs(je,{alignment:"center",visible:P,onClose:()=>I(!1),children:[e.jsx(Ce,{children:e.jsx(ye,{children:"Search"})}),e.jsx(Ne,{children:e.jsxs("div",{className:"mb-3",children:[e.jsx(fe,{children:"Select Branch"}),e.jsxs(M,{value:R,onChange:t=>q(t.target.value),disabled:!c,children:[e.jsx("option",{value:"",children:"All Branches"}),T.map(t=>e.jsx("option",{value:t._id,children:t.name||"N/A"},t._id))]})]})}),e.jsx(Ae,{children:e.jsx(k,{color:"primary",onClick:Ee,disabled:!c,children:"Search"})})]}),e.jsx(st,{show:oe,onClose:()=>U(!1),brokerData:re,refreshData:_,onPaymentSaved:Pe,canCreateExchangeLedger:v})]})};export{Dt as default};
