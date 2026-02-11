import{r as n,j as e,m as A,g as gt,l as Nt,v as c,C as yt,x as ie}from"./index-CD-UhOJ2.js";/* empty css             */import{a as I,c as S}from"./index.esm-BML82zAk.js";import{t as Ve,h as Ne,d as St,e as vt,g as Ct,k as le,m as ye,P as Y,M as z,A as Se}from"./DefaultLayout-GrycDKjh.js";import{C as Ge,a as Je}from"./CCardBody-BS7SU2uX.js";import{C as Qe,a as Xe,b as X,c as h,d as Ze,e as d}from"./CTable-CzW9ULzA.js";import{C as Tt}from"./CCardHeader-CGdtZMoU.js";import{c as Fe}from"./cil-file-CeQgYs_D.js";import{C as Ue}from"./CAlert-CENR3-Ss.js";import{C as B}from"./CInputGroup-DQZZOIho.js";import{C as D}from"./CInputGroupText-DHH1Ayfr.js";import{C as Q}from"./CFormSelect-DGopBSdT.js";import{C as ve}from"./CFormInput-CCQbnhW2.js";import{C as wt,a as $e}from"./CRow--g2qTLFu.js";import{c as At}from"./cil-search-CDkY_4k-.js";import{C as Ot}from"./CFormCheck-ClsekPUR.js";import{C as He,a as Ye,b as ze,c as We,d as qe}from"./CModalTitle-Cs0DhY3v.js";import{L as Rt,e as Et,A as kt}from"./en-IN-DqIMVgVJ.js";import{D as Ke}from"./DatePicker-BJteVLIz.js";import{T as Ce}from"./TextField-yo76IxFz.js";import"./CNavItem-C1bzmovJ.js";import"./CFormControlWrapper-BAfeeQeh.js";import"./extends-CF3RwP-h.js";import"./setPrototypeOf-C3V6guyq.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./clsx-B-dksMZM.js";import"./Menu-DZGW0kW4.js";import"./TransitionGroup-CT7_5huu.js";import"./emotion-react.browser.esm-HxER6ccQ.js";import"./Transition-DXUjlb7_.js";import"./isWithinInterval-DaYQ2mcw.js";import"./format-BZUhodlP.js";import"./Button-DAEbvaln.js";import"./createSvgIcon-70ImKnSA.js";const Bt=({transferDetails:r,fromBranch:M,toBranch:m,toSubdealer:Z,toType:ee,vehicles:O})=>{const[f,ce]=n.useState([]),W=i=>{const l={year:"numeric",month:"numeric",day:"numeric"};return new Date(i).toLocaleDateString("en-GB",l).replace(/\//g,"-")};n.useEffect(()=>{(async()=>{try{const l=await A.get("/declarations?formType=stock_transfer");if(l.data.status==="success"){const u=l.data.data.declarations.sort((k,de)=>k.priority-de.priority);ce(u)}}catch(l){console.error("Error fetching declarations:",l)}})()},[]);const V=()=>ee==="branch"?{label:"Unload Location",name:m?.name||"N/A"}:{label:"Subdealer",name:Z?.name||"N/A"},R=()=>f.length===0?`
        I/We Authorised the dealer or its representative to register the vehicle at RTO in my/Our name as booked by
        us, However getting the vehicle insured from Insurance company & getting the vehicle registered from RTO is entirely my/our sole
        responsibility. Registration Number alloted by RTO will be acceptable to me as else I will pre book for choise number at RTO at
        my own. Dealership has no role in RTO Number allocation. I/We are exclusively responsible for any loss /personally/legal action
        occurred due to non-compliance or Delay in Insurance or RTO registration. I have understood and accepted all the T & C about
        warranty as per the Warranty policy of TVS MOTOR COMPANY Ltd & agree to abide the same. I have also understood & accepted that
        the warranty for Tyres & Battery lies with concerned Manufacturer or its dealer & I will not claim for warranty of these
        products to TVS MOTOR COMPANY or to its Dealer. I am being informed about the price breakup, I had understood & agreed upon the
        same & then had booked the vehicle.
      `:f.map(i=>`
      <b>${i.title}</b> - ${i.content}
    `).join("<br/><br/>"),te=()=>{const i=W(r?.createdAt||new Date),l=V();return`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transfer Challan</title>
      <style>
         body {
            font-family: Courier New;
            margin: 0;
            padding: 0;
          }
          .page {
            width: 250mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 5mm;
            box-sizing: border-box;
          }
          .challan-header {
            margin-bottom: 10px;
            text-align: center;
          }
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .header-content h2 {
            flex: 1;
            text-align: center;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .header-logo {
            height: 25px;
            margin-left: 20px;
          }
          .header2 {
            display: flex;
            justify-content: space-between;
          }
          .dealer-name {
            font-size: 16px;
            font-weight: bold;
          }
          .challan-date {
            font-size: 14px;
          }
          .locations-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 2px 0 0 0;
            border-top: 3px solid #AAAAAA;
            border-bottom: 3px solid #AAAAAA;
          }
          .location-item {
            flex: 1;
            padding: 0 15px;
          }
          .location-label {
            font-weight: bold;
          }
          .vehicle-details-table {
            width: 100%;
            margin-bottom: 10px;
            border-collapse: collapse;
          }
          .vehicle-details-table th {
            font-weight: bold;
            text-align: center;
            padding: 4px;
          }
          .vehicle-details-table td {
            padding: 2px;
            text-align: center;
            text-transform: uppercase;
          }
          .notes-section {
            margin-bottom: 20px;
            padding-top: 15px;
            border-top: 3px solid #AAAAAA;
          }
          .notes-text {
            font-size: 12px;
            line-height: 1.4;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .signatures-section {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 20px;
          }
          .signature-line {
            border-top: 1px dashed #000;
            width: 45%;
            padding-top: 10px;
            text-align: center;
          }
          .signature-line p {
            font-weight: bold;
            margin: 0;
          }
          @page {
            size: A4;
            margin: 0;
          }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="challan-header">
            <div class="header-content">
              <h2>SALES / DELIVERY CHALLAN</h2>
              <img src="${Ve}" class="header-logo" alt="TVS Logo" />
            </div>
          </div>
          <div class="header2">
            <p class="dealer-name">Authorized Main Dealer: TVS Motor Company Ltd.</p>
            <p class="challan-date">Date: ${i}</p>
          </div>
          <div class="locations-container">
            <div class="location-item">
              <p>
                <span class="location-label">Load Location:</span>
                ${M?.name||"N/A"}
              </p>
            </div>
            <div class="location-item">
              <p>
                <span class="location-label">${l.label}:</span>
                ${l.name}
              </p>
            </div>
          </div>
        <div class="vehicle-section">
          <table class="vehicle-details-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Colour</th>
                <th>Key NO</th>
                <th>Chassis NO</th>
                <th>Engine NO</th>
                <th>Motor NO</th>
                <th>Battery NO</th>
              </tr>
            </thead>
            <tbody>
              ${O.map((u,k)=>`
                  <tr>
                    <td><strong>${u.modelName||"N/A"}</strong></td>
                    <td>${u.color?.name||"N/A"}</td>
                    <td>${u.keyNumber||"0"}</td>
                    <td>${u.chassisNumber||"N/A"}</td>
                    <td>${u.engineNumber||"N/A"}</td>
                    <td>${u.motorNumber||"N/A"}</td>
                    <td>${u.batteryNumber||"N/A"}</td>
                  </tr>
                `).join("")}
            </tbody>
          </table>
        </div>

        <div class="notes-section">
          <p class="section-title">Notes: All Standard Fitments Received</p>
          <p class="notes-text">
            ${R()}
          </p>
        </div>

        <div class="signatures-section">
          <div class="signature-line">
            <p>Transporter's Signature</p>
          </div>
          <div class="signature-line">
            <p>Receiver's Signature</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `},se=()=>f.length===0?e.jsx("p",{className:"notes-text",children:"I/We Authorised the dealer or its representative to register the vehicle at RTO in my/Our name as booked by us, However getting the vehicle insured from Insurance company & getting the vehicle registered from RTO is entirely my/our sole responsibility. Registration Number alloted by RTO will be acceptable to me as else I will pre book for choise number at RTO at my own. Dealership has no role in RTO Number allocation. I/We are exclusively responsible for any loss /personally/legal action occurred due to non-compliance or Delay in Insurance or RTO registration. I have understood and accepted all the T & C about warranty as per the Warranty policy of TVS MOTOR COMPANY Ltd & agree to abide the same. I have also understood & accepted that the warranty for Tyres & Battery lies with concerned Manufacturer or its dealer & I will not claim for warranty of these products to TVS MOTOR COMPANY or to its Dealer. I am being informed about the price breakup, I had understood & agreed upon the same & then had booked the vehicle."}):e.jsx("div",{className:"notes-text",children:f.map((i,l)=>e.jsxs("p",{children:[i.content,l<f.length-1]},i._id))}),F=()=>{const i=window.open("","_blank");i.document.write(te()),i.document.close(),i.focus()},E=V();return e.jsx(Ge,{className:"mb-4 challan-card",children:e.jsxs(Je,{className:"challan-body",children:[e.jsx("div",{className:"challan-header",children:e.jsxs("div",{className:"header-content",children:[e.jsx("h2",{children:"SALES / DELIVERY CHALLAN"}),e.jsx("img",{src:Ve,alt:"TVS Logo",className:"header-logo"})]})}),e.jsxs("div",{className:"header2",children:[e.jsx("p",{className:"dealer-name",children:"Authorized Main Dealer: TVS Motor Company Ltd."}),e.jsxs("p",{className:"challan-date",children:["Date: ",W(r?.createdAt||new Date)]})]}),e.jsxs("div",{className:"locations-container",children:[e.jsx("div",{className:"location-item",children:e.jsxs("p",{children:[e.jsx("span",{className:"location-label",children:"Load Location:"}),M?.name||"N/A"]})}),e.jsx("div",{className:"location-item",children:e.jsxs("p",{children:[e.jsxs("span",{className:"location-label",children:[E.label,":"]}),E.name]})})]}),e.jsx("div",{className:"vehicle-section",children:e.jsxs(Qe,{className:"vehicle-details-table",children:[e.jsx(Xe,{children:e.jsxs(X,{children:[e.jsx(h,{children:"Sr. No"}),e.jsx(h,{children:"Model Name"}),e.jsx(h,{children:"Colour"}),e.jsx(h,{children:"Key NO"}),e.jsx(h,{children:"Chassis NO"}),e.jsx(h,{children:"Engine NO"}),e.jsx(h,{children:"Motor NO"}),e.jsx(h,{children:"Battery NO"})]})}),e.jsx(Ze,{children:O.map((i,l)=>e.jsxs(X,{children:[e.jsx(d,{children:l+1}),e.jsx(d,{children:e.jsx("strong",{children:i.modelName||"N/A"})}),e.jsx(d,{children:i.color?.name||"N/A"}),e.jsx(d,{children:i.keyNumber||"0"}),e.jsx(d,{children:i.chassisNumber||"N/A"}),e.jsx(d,{children:i.engineNumber||"N/A"}),e.jsx(d,{children:i.motorNumber||"N/A"}),e.jsx(d,{children:i.batteryNumber||"N/A"})]},i._id||l))})]})}),e.jsxs("div",{className:"notes-section",children:[e.jsx("p",{className:"section-title",children:"Notes: All Standard Fitments Received"}),se()]}),e.jsxs("div",{className:"signatures-section",children:[e.jsx("div",{className:"signature-line",children:e.jsx("p",{children:"Transporter's Signature"})}),e.jsx("div",{className:"signature-line",children:e.jsx("p",{children:"Receiver's Signature"})})]}),e.jsx("div",{className:"challan-actions",children:e.jsx(I,{color:"primary",onClick:F,children:"Print Challan"})})]})})};function us(){const[r,M]=n.useState({fromBranch:"",toType:"branch",toBranch:"",toSubdealer:""}),[m,Z]=n.useState({}),[ee,O]=n.useState(null),[f,ce]=n.useState([]),[W,V]=n.useState([]),[R,te]=n.useState([]),[se,F]=n.useState([]),[E,i]=n.useState([]),[l,u]=n.useState(!1),[k,de]=n.useState(""),[et,Te]=n.useState(!1),[we,tt]=n.useState(null),[g,he]=n.useState([]),[st,me]=n.useState(!1),[N,pe]=n.useState(""),[q,ae]=n.useState(!1),[v,K]=n.useState({otp:"",otpMethod:"SMS"}),[Ae,Oe]=n.useState(!1),[ue,Re]=n.useState(!1),[C,P]=n.useState(!1),[at,Ee]=n.useState(!1),[_,ke]=n.useState(null),[U,Be]=n.useState(null),[G,De]=n.useState(""),[Me,p]=n.useState(""),[xe,Pe]=n.useState(!1),rt=gt(),{permissions:$=[]}=Nt();Ne($,z.PURCHASE,Y.PURCHASE.STOCK_TRANSFER,Se.VIEW),Ne($,z.PURCHASE,Y.PURCHASE.STOCK_TRANSFER,Se.CREATE),Ne($,z.PURCHASE,Y.PURCHASE.STOCK_TRANSFER,Se.DELETE);const T=St($,z.PURCHASE,Y.PURCHASE.STOCK_TRANSFER),x=vt($,z.PURCHASE,Y.PURCHASE.STOCK_TRANSFER);Ct($,z.PURCHASE,Y.PURCHASE.STOCK_TRANSFER);const L=x,fe=t=>{if(!t)return"";try{const s=new Date(t);if(isNaN(s.getTime()))return"";const a=String(s.getDate()).padStart(2,"0"),o=String(s.getMonth()+1).padStart(2,"0"),b=s.getFullYear();return`${a}-${o}-${b}`}catch(s){return console.error("Error formatting date:",s),""}},_e=t=>{if(!t)return"";const s=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${s}-${a}-${o}`};n.useEffect(()=>{if(!T){c("You do not have permission to view Stock Transfer");return}nt()},[]),n.useEffect(()=>{if(!T)return;(async()=>{if(r.fromBranch)try{const s=await A.get(`/subdealers/branch/${r.fromBranch}`);V(s.data.data?.subdealers||[])}catch(s){const a=c(s);a&&O(a)}else V([])})()},[r.fromBranch]),n.useEffect(()=>{T&&(r.fromBranch?ot(r.fromBranch):(he([]),me(!1),pe(""),ae(!1),P(!1),K({otp:"",otpMethod:"SMS"})))},[r.fromBranch]);const nt=async()=>{if(T)try{const t=await A.get("/branches");ce(t.data.data||[])}catch(t){const s=c(t);s&&O(s)}},ot=async t=>{if(T)try{const o=((await A.get("/users")).data.data||[]).filter(b=>b.branch===t&&b.isStockTransferOTP===!0);he(o),o.length===0?(me(!1),P(!0)):me(!0)}catch(s){const a=c(s);a&&O(a),he([])}},Le=async t=>{if(T)try{const a=((await A.get(`/vehicles/branch/${t}?locationType=branch`)).data.data.vehicles||[]).filter(o=>o.status==="in_stock");te(a),F(a),i([])}catch(s){const a=c(s);a&&O(a)}};n.useEffect(()=>{if(T)if(k){const t=R.filter(s=>{const a=k.toLowerCase();return s.chassisNumber&&s.chassisNumber.toLowerCase().includes(a)||s.engineNumber&&s.engineNumber.toLowerCase().includes(a)||s.motorNumber&&s.motorNumber.toLowerCase().includes(a)||s.model?.model_name&&s.model.model_name.toLowerCase().includes(a)||s.type&&s.type.toLowerCase().includes(a)||s.batteryNumber&&s.batteryNumber.toLowerCase().includes(a)||s.keyNumber&&s.keyNumber.toLowerCase().includes(a)||s.chargerNumber&&s.chargerNumber.toLowerCase().includes(a)||s.unloadLocation?.name&&s.unloadLocation.name.toLowerCase().includes(a)});F(t)}else F(R)},[k,R]);const re=t=>{if(!T)return;const{name:s,value:a}=t.target;M(s==="toType"?o=>({...o,[s]:a,toBranch:"",toSubdealer:""}):s==="fromBranch"?o=>({...o,[s]:a,toBranch:"",toSubdealer:""}):o=>({...o,[s]:a})),Z(o=>({...o,[s]:""})),s==="fromBranch"&&a?Le(a):s==="fromBranch"&&(te([]),F([]),i([]),V([]))},it=(t,s)=>{if(!x){c("You do not have permission to select vehicles for transfer");return}i(a=>s?[...a,t]:a.filter(o=>o!==t))},lt=async()=>{if(!N){c("Please select a user to send OTP");return}Oe(!0);try{const t=await A.post("/transfers/request-otp",{userId:N});ie("OTP sent successfully!"),ae(!0),P(!1),K({...v,otpMethod:J()})}catch(t){c(t)}finally{Oe(!1)}},ct=async()=>{if(!v.otp||v.otp.length<6){c("Please enter a valid 6-digit OTP");return}Re(!0);try{const t=await A.post("/transfers/verify-otp",{userId:N,otp:v.otp,otpMethod:J()});ie("OTP verified successfully!"),P(!0)}catch(t){c(t),P(!1)}finally{Re(!1)}},J=()=>g.find(s=>s._id===N)?.otpMethod||"SMS",dt=()=>g.find(s=>s._id===N)?.name||"",ht=()=>{if(!L){c("You do not have permission to export reports");return}Ee(!0),p("")},be=()=>{ke(null),Be(null),De(""),p(""),Ee(!1)},mt=async()=>{if(!L){c("You do not have permission to export reports");return}if(p(""),!G){p("Please select a branch");return}if(!_||!U){p("Please select both start and end dates");return}if(_>U){p("Start date cannot be after end date");return}try{Pe(!0);const t=_e(_),s=_e(U),a=new URLSearchParams({branchId:G,startDate:t,endDate:s,format:"excel"}),o=await A.get(`/reports/stock/transfers?${a.toString()}`,{responseType:"blob"}),b=o.headers["content-type"];if(b&&b.includes("application/json")){const ge=await new Promise((bt,jt)=>{const oe=new FileReader;oe.onload=()=>bt(oe.result),oe.onerror=jt,oe.readAsText(o.data)}),ne=JSON.parse(ge);if(!ne.success&&ne.message){p(ne.message),c(ne.message);return}}const y=new Blob([o.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),H=window.URL.createObjectURL(y),w=document.createElement("a");w.href=H;const je=f.find(ge=>ge._id===G)?.name||"Branch",j=fe(_),xt=fe(U),ft=`Stock_Transfers_Report_${je}_${j}_to_${xt}.xlsx`;w.setAttribute("download",ft),document.body.appendChild(w),w.click(),w.remove(),window.URL.revokeObjectURL(H),ie("Stock transfers report exported successfully!"),be()}catch(t){if(console.error("Error exporting stock transfers report:",t),t.response&&t.response.data instanceof Blob)try{const s=await new Promise((o,b)=>{const y=new FileReader;y.onload=()=>o(y.result),y.onerror=b,y.readAsText(t.response.data)}),a=JSON.parse(s);a.message&&(p(a.message),c(a.message))}catch(s){console.error("Error parsing error response:",s),p("Failed to export stock transfers report"),c("Failed to export stock transfers report")}else t.response?.data?.message?(p(t.response.data.message),c(t.response.data.message)):t.message?(p(t.message),c(t.message)):(p("Failed to export stock transfers report"),c("Failed to export stock transfers report"))}finally{Pe(!1)}},pt=async t=>{if(t.preventDefault(),!x){c("You do not have permission to transfer stock");return}if(g.length>0&&!C){c("Please complete OTP verification before transferring stock");return}u(!0);const s={};if(r.fromBranch||(s.fromBranch="From branch is required"),r.toType||(s.toType="Type is required"),r.toType==="branch"&&!r.toBranch?s.toBranch="To branch is required":r.toType==="subdealer"&&!r.toSubdealer&&(s.toSubdealer="Subdealer is required"),E.length===0&&(s.vehicles="Please select at least one vehicle"),Object.keys(s).length>0){Z(s),u(!1);return}try{const a={fromBranch:r.fromBranch,toType:r.toType,toBranch:r.toType==="branch"?r.toBranch:void 0,toSubdealer:r.toType==="subdealer"?r.toSubdealer:void 0,items:E.map(j=>({vehicle:j}))};g.length>0&&C&&N&&(a.otpData={userId:N,otp:v.otp,otpMethod:J()});const o=await A.post("/transfers",a),b=f.find(j=>j._id===r.fromBranch);let y=null,H=null,w="";r.toType==="branch"?(y=f.find(j=>j._id===r.toBranch),w=y?.name||""):(H=W.find(j=>j._id===r.toSubdealer),w=H?.name||"");const je=R.filter(j=>E.includes(j._id));tt({transferDetails:o.data,fromBranch:b,toBranch:y,toSubdealer:H,toType:r.toType,vehicles:je,destinationName:w}),ie("Stock transferred successfully!").then(()=>{Te(!0)}),M({fromBranch:r.fromBranch,toType:"branch",toBranch:"",toSubdealer:""}),pe(""),ae(!1),P(!1),K({otp:"",otpMethod:"SMS"}),Le(r.fromBranch),i([])}catch(a){const o=c(a);o&&O(o)}finally{u(!1)}},ut=()=>{rt("/upload-challan")},Ie=()=>{Te(!1)};return T?e.jsxs("div",{children:[e.jsx("div",{className:"title",children:"Transfer Stock to Network"}),e.jsxs(Ge,{className:"table-container mt-4",children:[e.jsx(Tt,{className:"card-header d-flex justify-content-between align-items-center",children:e.jsx("div",{children:L&&e.jsxs(I,{size:"sm",className:"action-btn me-1",onClick:ht,title:"Export Stock Transfers Report",style:{backgroundColor:"#321fdb",borderColor:"#321fdb",color:"white"},onMouseEnter:t=>{t.target.style.backgroundColor="#2a1ab8",t.target.style.borderColor="#2a1ab8"},onMouseLeave:t=>{t.target.style.backgroundColor="#321fdb",t.target.style.borderColor="#321fdb"},children:[e.jsx(S,{icon:Fe,className:"me-1"})," Export Report"]})})}),e.jsx(Je,{children:e.jsxs("div",{className:"form-container",children:[ee&&e.jsx(Ue,{color:"danger",children:ee}),e.jsx("div",{className:"form-card",children:e.jsxs("div",{className:"form-body",children:[x?null:e.jsxs("div",{className:"alert alert-warning mb-4",children:[e.jsx("strong",{children:"Note:"})," You have VIEW permission only. You can view stock transfer information but cannot create new transfers."]}),e.jsxs("form",{onSubmit:pt,children:[e.jsxs("div",{className:"user-details",children:[e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"From Branch"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(B,{children:[e.jsx(D,{className:"input-icon",children:e.jsx(S,{icon:le})}),e.jsxs(Q,{name:"fromBranch",value:r.fromBranch,onChange:re,invalid:!!m.fromBranch,disabled:l||!x,children:[e.jsx("option",{value:"",children:"-Select-"}),f.map(t=>e.jsx("option",{value:t._id,children:t.name},t._id))]})]}),m.fromBranch&&e.jsx("div",{className:"invalid-feedback",children:m.fromBranch})]}),e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Transfer Type"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(B,{children:[e.jsx(D,{className:"input-icon",children:e.jsx(S,{icon:le})}),e.jsxs(Q,{name:"toType",value:r.toType,onChange:re,invalid:!!m.toType,disabled:!r.fromBranch||l||!x,children:[e.jsx("option",{value:"branch",children:"Branch"}),e.jsx("option",{value:"subdealer",children:"Subdealer"})]})]}),m.toType&&e.jsx("div",{className:"invalid-feedback",children:m.toType})]}),st&&g.length>0&&e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"OTP User"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(B,{children:[e.jsx(D,{className:"input-icon",children:e.jsx(S,{icon:ye})}),e.jsxs(Q,{value:N,onChange:t=>{pe(t.target.value),ae(!1),P(!1),K({otp:"",otpMethod:J()})},disabled:q||l,invalid:!N&&g.length>0,children:[e.jsx("option",{value:"",children:"-Select User-"}),g.map(t=>e.jsxs("option",{value:t._id,children:[t.name," (",t.otpMethod,")"]},t._id))]})]}),e.jsx("div",{className:"mt-2",children:e.jsx(I,{color:"primary",size:"sm",onClick:lt,disabled:!N||Ae||q,children:Ae?"Sending...":"Send OTP"})})]}),r.toType==="branch"&&e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"To Branch"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(B,{children:[e.jsx(D,{className:"input-icon",children:e.jsx(S,{icon:le})}),e.jsxs(Q,{name:"toBranch",value:r.toBranch,onChange:re,invalid:!!m.toBranch,disabled:!r.fromBranch||l||!x,children:[e.jsx("option",{value:"",children:"-Select-"}),f.filter(t=>t._id!==r.fromBranch).map(t=>e.jsx("option",{value:t._id,children:t.name},t._id))]})]}),m.toBranch&&e.jsx("div",{className:"invalid-feedback",children:m.toBranch})]}),r.toType==="subdealer"&&e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"To Subdealer"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(B,{children:[e.jsx(D,{className:"input-icon",children:e.jsx(S,{icon:le})}),e.jsxs(Q,{name:"toSubdealer",value:r.toSubdealer,onChange:re,invalid:!!m.toSubdealer,disabled:!r.fromBranch||l||!x,children:[e.jsx("option",{value:"",children:"-Select-"}),W.map(t=>e.jsx("option",{value:t._id,children:t.name},t._id))]})]}),m.toSubdealer&&e.jsx("div",{className:"invalid-feedback",children:m.toSubdealer})]}),q&&!C&&e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Enter OTP"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(B,{children:[e.jsx(D,{className:"input-icon",children:e.jsx(S,{icon:ye})}),e.jsx(ve,{type:"text",maxLength:"6",placeholder:"6-digit OTP",value:v.otp,onChange:t=>K({...v,otp:t.target.value}),disabled:ue}),e.jsx(I,{color:"success",onClick:ct,disabled:!v.otp||v.otp.length<6||ue,children:ue?"Verifying...":"Verify"})]}),e.jsxs("small",{className:"text-muted d-block mt-1",children:["OTP sent to ",dt()," via ",J()]})]}),C&&e.jsxs("div",{className:"input-box",children:[e.jsx("div",{className:"details-container",children:e.jsx("span",{className:"details",children:"OTP Status"})}),e.jsxs(B,{children:[e.jsx(D,{className:"input-icon bg-success text-white",children:e.jsx(S,{icon:ye})}),e.jsx(ve,{type:"text",value:"✓ OTP Verified",readOnly:!0,className:"bg-success bg-opacity-25 text-success border-success"})]}),e.jsx("small",{className:"text-success d-block mt-1",children:"You can now proceed with stock transfer"})]}),!q&&!C&&r.toType==="branch"&&e.jsx("div",{className:"input-box"}),!q&&!C&&r.toType==="subdealer"&&e.jsx("div",{className:"input-box"})]}),m.vehicles&&e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-12",children:e.jsx("div",{className:"alert alert-danger mt-2",children:m.vehicles})})}),e.jsx("div",{className:"form-footer",children:x?e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"submit",className:"submit-button",disabled:l||g.length>0&&!C,title:g.length>0&&!C?"Please complete OTP verification first":"",children:l?"Transferring...":"Transfer"}),e.jsx("button",{type:"button",className:"cancel-button",onClick:ut,disabled:l,children:"Cancel"})]}):e.jsxs("div",{className:"alert alert-info",children:[e.jsx("strong",{children:"View Mode:"})," You have VIEW permission only. To create transfers, contact your administrator."]})})]}),R.length>0&&r.fromBranch?e.jsxs("div",{className:"vehicle-table mt-4 p-3",children:[e.jsxs("h5",{children:["In-Stock Vehicle Details (",R.length," vehicles available)"]}),e.jsxs(wt,{className:"mb-3",children:[e.jsx($e,{md:6,children:e.jsxs(B,{children:[e.jsx(D,{children:e.jsx(S,{icon:At,style:{width:"20px"}})}),e.jsx(ve,{value:k,onChange:t=>de(t.target.value),placeholder:"Search by chassis, model, type...",disabled:!x})]})}),e.jsx($e,{md:6,className:"text-end",children:e.jsxs("span",{className:"badge bg-info",children:["Selected: ",E.length," vehicles"]})})]}),e.jsxs(Qe,{striped:!0,bordered:!0,hover:!0,responsive:!0,children:[e.jsx(Xe,{className:"table-header-fixed",children:e.jsxs(X,{children:[x&&e.jsx(h,{children:"Select"}),e.jsx(h,{children:"Sr. No"}),e.jsx(h,{children:"Unload Location"}),e.jsx(h,{children:"Inward Date"}),e.jsx(h,{children:"Type"}),e.jsx(h,{children:"Vehicle Model"}),e.jsx(h,{children:"Color"}),e.jsx(h,{children:"Chassis No"}),e.jsx(h,{children:"Current Status"})]})}),e.jsx(Ze,{children:se.length>0?se.map((t,s)=>e.jsxs(X,{children:[x&&e.jsx(d,{children:e.jsx(Ot,{onChange:a=>it(t._id,a.target.checked),checked:E.includes(t._id),disabled:l||g.length>0&&!C})}),e.jsx(d,{children:s+1}),e.jsx(d,{children:t.unloadLocation?.name||""}),e.jsx(d,{children:fe(t.createdAt)}),e.jsx(d,{children:t.type}),e.jsx(d,{children:t.modelName||""}),e.jsx(d,{children:t.color?.name||""}),e.jsx(d,{children:t.chassisNumber}),e.jsx(d,{children:t.status})]},t._id)):e.jsx(X,{children:e.jsx(d,{colSpan:x?9:8,className:"text-center",children:k?"No vehicles match your search criteria":"No in-stock vehicles found"})})})]})]}):r.fromBranch?e.jsx("div",{className:"alert alert-info mt-4",children:"No in-stock vehicles found for the selected branch."}):null]})})]})})]}),e.jsxs(He,{alignment:"center",visible:at,onClose:be,children:[e.jsx(Ye,{children:e.jsxs(ze,{children:[e.jsx(S,{icon:Fe,className:"me-2"}),"Export Stock Transfers Report"]})}),e.jsxs(We,{children:[Me&&e.jsx(Ue,{color:"warning",className:"mb-3",children:Me}),e.jsxs(Rt,{dateAdapter:kt,adapterLocale:Et,children:[e.jsx("div",{className:"mb-3",children:e.jsx(Ke,{label:"Start Date",value:_,onChange:t=>{ke(t),p("")},renderInput:t=>e.jsx(Ce,{...t,fullWidth:!0,size:"small"}),inputFormat:"dd/MM/yyyy",mask:"__/__/____",views:["day","month","year"],disabled:!L})}),e.jsx("div",{className:"mb-3",children:e.jsx(Ke,{label:"End Date",value:U,onChange:t=>{Be(t),p("")},renderInput:t=>e.jsx(Ce,{...t,fullWidth:!0,size:"small"}),inputFormat:"dd/MM/yyyy",mask:"__/__/____",minDate:_,views:["day","month","year"],disabled:!L})})]}),e.jsxs(Ce,{select:!0,value:G,onChange:t=>{De(t.target.value),p("")},fullWidth:!0,size:"small",SelectProps:{native:!0},disabled:!L,children:[e.jsx("option",{value:"",children:"-- Select Branch --"}),f.map(t=>e.jsx("option",{value:t._id,children:t.name},t._id))]})]}),e.jsxs(qe,{children:[e.jsx(I,{color:"secondary",onClick:be,disabled:xe,children:"Cancel"}),e.jsx(I,{className:"submit-button",onClick:mt,disabled:!_||!U||!G||!L||xe,children:xe?e.jsxs(e.Fragment,{children:[e.jsx(yt,{size:"sm",className:"me-2"}),"Exporting..."]}):"Export"})]})]}),e.jsxs(He,{visible:et,onClose:Ie,size:"xl",scrollable:!0,children:[e.jsx(Ye,{closeButton:!0,children:e.jsx(ze,{children:"Transfer Challan Preview"})}),e.jsx(We,{children:we&&e.jsx(Bt,{...we})}),e.jsx(qe,{children:e.jsx(I,{color:"secondary",onClick:Ie,children:"Close"})})]})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Stock Transfer."})}export{us as default};
