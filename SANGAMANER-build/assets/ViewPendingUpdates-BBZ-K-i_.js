import{r as c,j as e,C as te,L as ge,z as Z,v as W,m as K,x as le,P as a}from"./index-CD-UhOJ2.js";/* empty css                */import{a as F,c as E}from"./index.esm-BML82zAk.js";import{C as q,a as G,b as H,c as J,d as X}from"./CModalTitle-Cs0DhY3v.js";import{i as fe,r as be}from"./DefaultLayout-GrycDKjh.js";import{C as I,a as P}from"./CRow--g2qTLFu.js";import{C as $,a as O}from"./CCardBody-BS7SU2uX.js";import{C as U}from"./CCardHeader-CGdtZMoU.js";import{c as V}from"./cil-check-circle-BlU9eaow.js";import{c as ce}from"./cil-x-circle-Bi9E-sdv.js";import{c as ve}from"./cil-cloud-upload-Ca9_6_ej.js";import{C as je}from"./CFormControlWrapper-BAfeeQeh.js";import{C as M}from"./CFormInput-CCQbnhW2.js";import{c as ye}from"./cil-zoom-CDkY_4k-.js";import{c as Ce}from"./createSvgIcon-70ImKnSA.js";import{b as Ne,n as ne}from"./Menu-DZGW0kW4.js";import{T,I as we,a as ie,C as De,B as L}from"./Button-DAEbvaln.js";import{c as me}from"./clsx-B-dksMZM.js";import{t as Pe,v as ke,a as Ae,C as _e,T as Ee,w as Se,u as Re,e as Fe,s as ue,m as he}from"./DefaultPropsProvider-BOWM1HCk.js";import{g as Le,M as re}from"./MenuItem-FukuNeBD.js";import{g as Te,T as R,d as Be,I as $e,S as Oe}from"./TextField-yo76IxFz.js";import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{C as de}from"./CAlert-CENR3-Ss.js";import{C as Ue}from"./CForm-CevvQQOo.js";function Ve(i={}){const{themeId:t,defaultTheme:s,defaultClassName:n="MuiBox-root",generateClassName:g}=i,o=Pe("div",{shouldForwardProp:f=>f!=="theme"&&f!=="sx"&&f!=="as"})(ke);return c.forwardRef(function(m,u){const w=Ne(s),{className:x,component:D="div",...d}=Te(m);return e.jsx(o,{as:D,ref:u,className:me(x,g?g(n):n),theme:t&&w[t]||w,...d})})}const Me=Ae("MuiBox",["root"]),Ie=Se(),k=Ve({themeId:Ee,defaultTheme:Ie,defaultClassName:Me.root,generateClassName:_e.generate}),We=i=>{const{absolute:t,children:s,classes:n,flexItem:g,light:o,orientation:l,textAlign:f,variant:m}=i;return Fe({root:["root",t&&"absolute",m,o&&"light",l==="vertical"&&"vertical",g&&"flexItem",s&&"withChildren",s&&l==="vertical"&&"withChildrenVertical",f==="right"&&l!=="vertical"&&"textAlignRight",f==="left"&&l!=="vertical"&&"textAlignLeft"],wrapper:["wrapper",l==="vertical"&&"wrapperVertical"]},Le,n)},Ye=ue("div",{name:"MuiDivider",slot:"Root",overridesResolver:(i,t)=>{const{ownerState:s}=i;return[t.root,s.absolute&&t.absolute,t[s.variant],s.light&&t.light,s.orientation==="vertical"&&t.vertical,s.flexItem&&t.flexItem,s.children&&t.withChildren,s.children&&s.orientation==="vertical"&&t.withChildrenVertical,s.textAlign==="right"&&s.orientation!=="vertical"&&t.textAlignRight,s.textAlign==="left"&&s.orientation!=="vertical"&&t.textAlignLeft]}})(he(({theme:i})=>({margin:0,flexShrink:0,borderWidth:0,borderStyle:"solid",borderColor:(i.vars||i).palette.divider,borderBottomWidth:"thin",variants:[{props:{absolute:!0},style:{position:"absolute",bottom:0,left:0,width:"100%"}},{props:{light:!0},style:{borderColor:i.alpha((i.vars||i).palette.divider,.08)}},{props:{variant:"inset"},style:{marginLeft:72}},{props:{variant:"middle",orientation:"horizontal"},style:{marginLeft:i.spacing(2),marginRight:i.spacing(2)}},{props:{variant:"middle",orientation:"vertical"},style:{marginTop:i.spacing(1),marginBottom:i.spacing(1)}},{props:{orientation:"vertical"},style:{height:"100%",borderBottomWidth:0,borderRightWidth:"thin"}},{props:{flexItem:!0},style:{alignSelf:"stretch",height:"auto"}},{props:({ownerState:t})=>!!t.children,style:{display:"flex",textAlign:"center",border:0,borderTopStyle:"solid",borderLeftStyle:"solid","&::before, &::after":{content:'""',alignSelf:"center"}}},{props:({ownerState:t})=>t.children&&t.orientation!=="vertical",style:{"&::before, &::after":{width:"100%",borderTop:`thin solid ${(i.vars||i).palette.divider}`,borderTopStyle:"inherit"}}},{props:({ownerState:t})=>t.orientation==="vertical"&&t.children,style:{flexDirection:"column","&::before, &::after":{height:"100%",borderLeft:`thin solid ${(i.vars||i).palette.divider}`,borderLeftStyle:"inherit"}}},{props:({ownerState:t})=>t.textAlign==="right"&&t.orientation!=="vertical",style:{"&::before":{width:"90%"},"&::after":{width:"10%"}}},{props:({ownerState:t})=>t.textAlign==="left"&&t.orientation!=="vertical",style:{"&::before":{width:"10%"},"&::after":{width:"90%"}}}]}))),Ke=ue("span",{name:"MuiDivider",slot:"Wrapper",overridesResolver:(i,t)=>{const{ownerState:s}=i;return[t.wrapper,s.orientation==="vertical"&&t.wrapperVertical]}})(he(({theme:i})=>({display:"inline-block",paddingLeft:`calc(${i.spacing(1)} * 1.2)`,paddingRight:`calc(${i.spacing(1)} * 1.2)`,whiteSpace:"nowrap",variants:[{props:{orientation:"vertical"},style:{paddingTop:`calc(${i.spacing(1)} * 1.2)`,paddingBottom:`calc(${i.spacing(1)} * 1.2)`}}]}))),oe=c.forwardRef(function(t,s){const n=Re({props:t,name:"MuiDivider"}),{absolute:g=!1,children:o,className:l,orientation:f="horizontal",component:m=o||f==="vertical"?"div":"hr",flexItem:u=!1,light:w=!1,role:x=m!=="hr"?"separator":void 0,textAlign:D="center",variant:d="fullWidth",...A}=n,r={...n,absolute:g,component:m,flexItem:u,light:w,orientation:f,role:x,textAlign:D,variant:d},h=We(r);return e.jsx(Ye,{as:m,className:me(h.root,l),role:x,ref:s,ownerState:r,"aria-orientation":x==="separator"&&(m!=="hr"||f==="vertical")?f:void 0,...A,children:o?e.jsx(Ke,{className:h.wrapper,ownerState:r,children:o}):null})});oe&&(oe.muiSkipListHighlight=!0);const ze=Ce(e.jsx("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})),qe=({open:i,onClose:t,kycData:s,refreshData:n,bookingId:g})=>{const[o,l]=c.useState(!1),[f,m]=c.useState(!1),[u,w]=c.useState(null),[x,D]=c.useState(""),[d,A]=c.useState(null),[r,h]=c.useState(!1),j=C=>{w(C),m(!0)};c.useEffect(()=>{g?console.log("KYCView received valid bookingId:",g):console.warn("KYCView received null bookingId!")},[g]);const B=async()=>{try{if(l(!0),console.log("Fetching KYC for booking ID:",g),!g){W("Booking ID is missing");return}if(!x.trim()){alert("Verification note is required");return}await K.post(`/kyc/${g}/verify`,{status:u,verificationNote:x}),le(`KYC ${u.toLowerCase()} successfully!`),n(),m(!1),D(""),t()}catch(C){console.log(C),W(C.response?.data?.message||"Failed to update KYC status")}finally{l(!1)}},S=(C,Y)=>{C?.original&&(A({url:`${Z.baseURL}${C.original}`,title:Y,type:C.mimetype==="application/pdf"?"pdf":"image"}),h(!0))},y=(C,Y)=>{if(!C?.original)return e.jsxs("div",{className:"document-placeholder",children:[e.jsx(E,{icon:ce,size:"xl"}),e.jsx("p",{children:"No document uploaded"})]});const Q=C.mimetype==="application/pdf",ee=`${Z.baseURL}${C.original}`,N=C.thumbnail?`${Z.baseURL}${C.thumbnail}`:ee;return e.jsxs("div",{className:"document-preview-container",children:[e.jsxs("div",{className:"document-thumbnail",onClick:()=>S(C,Y),children:[Q?e.jsxs("div",{className:"pdf-thumbnail",children:[e.jsx("div",{className:"pdf-icon",children:e.jsx("span",{children:"PDF"})}),e.jsx("p",{children:C.originalname||"Document"})]}):e.jsx("img",{src:N,alt:Y,className:"thumbnail-image"}),e.jsxs("div",{className:"document-overlay",children:[e.jsx(E,{icon:ye}),e.jsx("span",{children:"View"})]})]}),e.jsx("div",{className:"document-actions",children:e.jsxs("a",{href:ee,target:"_blank",rel:"noopener noreferrer",className:"btn btn-outline-primary btn-sm",children:["Open Full ",Q?"PDF":"Image"]})})]})};if(!s||!s.kycDocuments)return e.jsxs(q,{visible:i,onClose:t,size:"xl",className:"kyc-modal",children:[e.jsx(G,{closeButton:!0,children:e.jsx(H,{children:"Loading KYC Details..."})}),e.jsx(J,{children:e.jsxs("div",{className:"text-center py-4",children:[e.jsx(te,{color:"primary"}),e.jsx("p",{className:"mt-2",children:"Loading KYC information..."})]})}),e.jsx(X,{children:e.jsx(F,{color:"secondary",onClick:t,children:"Close"})})]});const{kycDocuments:b,status:p,customerName:v,address:_}=s,z={PENDING:"warning",APPROVED:"success",REJECTED:"danger",NOT_UPLOADED:"secondary"};return e.jsxs(e.Fragment,{children:[e.jsxs(q,{visible:i,onClose:t,size:"xl",className:"kyc-modal",backdrop:"static",children:[e.jsx(G,{closeButton:!0,children:e.jsxs(H,{children:["KYC Documents",e.jsx(fe,{color:z[p],className:"ms-2 status-badge",children:p.replace("_"," ")})]})}),e.jsxs(J,{className:"kyc-modal-body",children:[e.jsxs("div",{className:"kyc-info-bar",children:[e.jsxs("div",{className:"kyc-info-item",children:[e.jsx("strong",{children:"Booking ID:"})," ",g]}),v&&e.jsxs("div",{className:"kyc-info-item",children:[e.jsx("strong",{children:"Customer:"})," ",v]}),_&&e.jsxs("div",{className:"kyc-info-item",children:[e.jsx("strong",{children:"Address:"})," ",_]})]}),e.jsxs("div",{className:"kyc-documents-container",children:[e.jsxs(I,{children:[e.jsx(P,{lg:6,className:"mb-4",children:e.jsxs($,{className:"document-card",children:[e.jsxs(U,{className:"document-card-header",children:[e.jsx(E,{icon:V,className:"me-2"}),"Aadhar Front"]}),e.jsx(O,{children:y(b.aadharFront,"Aadhar Front")})]})}),e.jsx(P,{lg:6,className:"mb-4",children:e.jsxs($,{className:"document-card",children:[e.jsxs(U,{className:"document-card-header",children:[e.jsx(E,{icon:V,className:"me-2"}),"Aadhar Back"]}),e.jsx(O,{children:y(b.aadharBack,"Aadhar Back")})]})})]}),e.jsxs(I,{children:[e.jsx(P,{lg:6,className:"mb-4",children:e.jsxs($,{className:"document-card",children:[e.jsxs(U,{className:"document-card-header",children:[e.jsx(E,{icon:V,className:"me-2"}),"PAN Card"]}),e.jsx(O,{children:y(b.panCard,"PAN Card")})]})}),e.jsx(P,{lg:6,className:"mb-4",children:e.jsxs($,{className:"document-card",children:[e.jsxs(U,{className:"document-card-header",children:[e.jsx(E,{icon:V,className:"me-2"}),"Vehicle Photo"]}),e.jsx(O,{children:y(b.vPhoto,"Vehicle Photo")})]})})]}),e.jsxs(I,{children:[e.jsx(P,{lg:6,className:"mb-4",children:e.jsxs($,{className:"document-card",children:[e.jsxs(U,{className:"document-card-header",children:[e.jsx(E,{icon:V,className:"me-2"}),"Chassis Number Photo"]}),e.jsx(O,{children:y(b.chasisNoPhoto,"Chassis Number")})]})}),e.jsx(P,{lg:6,className:"mb-4",children:e.jsxs($,{className:"document-card",children:[e.jsxs(U,{className:"document-card-header",children:[e.jsx(E,{icon:V,className:"me-2"}),"Address Proof 1"]}),e.jsx(O,{children:y(b.addressProof1,"Address Proof 1")})]})})]}),e.jsxs(I,{children:[e.jsx(P,{lg:6,className:"mb-4",children:e.jsxs($,{className:"document-card",children:[e.jsxs(U,{className:"document-card-header",children:[e.jsx(E,{icon:V,className:"me-2"}),"Address Proof 2"]}),e.jsx(O,{children:y(b.addressProof2,"Address Proof 2")})]})}),e.jsx(P,{lg:6,className:"mb-4",children:e.jsxs($,{className:"document-card",children:[e.jsxs(U,{className:"document-card-header",children:[e.jsx(E,{icon:V,className:"me-2"}),"KYC Document PDF"]}),e.jsx(O,{children:b.documentPdf?y({original:b.documentPdf,mimetype:"application/pdf",originalname:"KYC Document"},"Combined KYC Document"):e.jsxs("div",{className:"document-placeholder",children:[e.jsx(E,{icon:ce,size:"xl"}),e.jsx("p",{children:"No PDF available"})]})})]})})]})]})]}),e.jsx(X,{children:e.jsxs("div",{className:"d-flex justify-content-between w-100 flex-wrap",children:[e.jsxs("div",{className:"action-buttons",children:[p==="PENDING"&&e.jsxs(e.Fragment,{children:[e.jsx(F,{color:"success",onClick:()=>j("APPROVED"),disabled:o,className:"me-2 mb-2",children:o?e.jsx(te,{size:"sm"}):"Approve KYC"}),e.jsx(F,{color:"danger",onClick:()=>j("REJECTED"),disabled:o,className:"mb-2",children:o?e.jsx(te,{size:"sm"}):"Reject KYC"})]}),(p==="REJECTED"||p==="NOT_UPLOADED")&&e.jsx(e.Fragment,{children:e.jsx(ge,{to:`/upload-kyc/${g}`,state:{bookingId:g,customerName:v,address:_},children:e.jsxs(F,{color:"primary",className:"upload-kyc-btn mb-2",children:[e.jsx(E,{icon:ve,className:"me-2"}),"Upload KYC Documents"]})})})]}),e.jsx(F,{color:"secondary",onClick:t,children:"Close"})]})})]}),e.jsxs(q,{visible:f,onClose:()=>!o&&m(!1),alignment:"center",children:[e.jsx(G,{closeButton:!o,children:e.jsx(H,{children:`${u==="APPROVED"?"Approve":"Reject"} KYC`})}),e.jsx(J,{children:e.jsxs("div",{className:"mb-3",children:[e.jsxs(je,{htmlFor:"verificationNote",children:["Verification Note ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx(M,{id:"verificationNote",type:"text",placeholder:`Enter ${u==="APPROVED"?"approval":"rejection"} note`,value:x,onChange:C=>D(C.target.value),required:!0,disabled:o}),e.jsx("div",{className:"form-text",children:"This note will be recorded with the verification action."})]})}),e.jsxs(X,{children:[e.jsx(F,{color:"secondary",onClick:()=>m(!1),disabled:o,children:"Cancel"}),e.jsx(F,{color:u==="APPROVED"?"success":"danger",onClick:B,disabled:o||!x.trim(),children:o?e.jsxs(e.Fragment,{children:[e.jsx(te,{size:"sm",className:"me-2"}),"Processing..."]}):u==="APPROVED"?"Approve":"Reject"})]})]}),e.jsxs(q,{visible:r,onClose:()=>h(!1),size:"xl",className:"document-viewer-modal",fullscreen:!0,children:[e.jsx(G,{closeButton:!0,children:e.jsx(H,{children:d?.title})}),e.jsx(J,{className:"document-viewer-body",children:d?.type==="pdf"?e.jsx("iframe",{src:d.url,title:d.title,className:"document-iframe",frameBorder:"0"}):e.jsx("img",{src:d?.url,alt:d?.title,className:"document-full-image"})}),e.jsxs(X,{children:[e.jsx("a",{href:d?.url,target:"_blank",rel:"noopener noreferrer",className:"btn btn-primary me-2",children:"Open in New Tab"}),e.jsx(F,{color:"secondary",onClick:()=>h(!1),children:"Close"})]})]})]})};qe.propTypes={open:a.bool.isRequired,onClose:a.func.isRequired,refreshData:a.func.isRequired,bookingId:a.string.isRequired,kycData:a.shape({kycDocuments:a.shape({aadharFront:a.shape({original:a.string,thumbnail:a.string,mimetype:a.string,originalname:a.string}),aadharBack:a.shape({original:a.string,thumbnail:a.string,mimetype:a.string,originalname:a.string}),panCard:a.shape({original:a.string,thumbnail:a.string,mimetype:a.string,originalname:a.string}),vPhoto:a.shape({original:a.string,thumbnail:a.string,mimetype:a.string,originalname:a.string}),chasisNoPhoto:a.shape({original:a.string,thumbnail:a.string,mimetype:a.string,originalname:a.string}),addressProof1:a.shape({original:a.string,thumbnail:a.string,mimetype:a.string,originalname:a.string}),addressProof2:a.shape({original:a.string,thumbnail:a.string,mimetype:a.string,originalname:a.string}),documentPdf:a.string}),status:a.oneOf(["PENDING","APPROVED","REJECTED","NOT_UPLOADED"]),customerName:a.string,address:a.string,id:a.string})};const jt=({open:i,onClose:t,financeData:s,bookingId:n,refreshData:g})=>{const[o,l]=c.useState(null),[f,m]=c.useState(!0),[u,w]=c.useState(null),[x,D]=c.useState(!0),[d,A]=c.useState(null),[r,h]=c.useState(!1),[j,B]=c.useState(null),[S,y]=c.useState(""),[b,p]=c.useState(!1),v="rgb(46, 216, 182)",_="#ff5370";c.useEffect(()=>{i&&n?z():(u&&(URL.revokeObjectURL(u),w(null)),y(""),h(!1),B(null),A(null))},[i,n]);const z=async()=>{try{m(!0),D(!0);const N=await K.get(`/finance-letters/${n}`);if(l(N.data.data),N.data.data?.financeLetter){const se=N.data.data.financeLetter;if(se.split(".").pop().toLowerCase()==="pdf"){A("pdf");try{const ae=await K.get(`/finance-letters/${n}/download`,{responseType:"blob"}),pe=new Blob([ae.data],{type:"application/pdf"}),xe=URL.createObjectURL(pe);w(xe)}catch(ae){console.error("Error fetching PDF:",ae),w(`${Z.baseURL}${se}`)}}else A("image"),w(`${Z.baseURL}${se}`)}}catch(N){console.error("Error fetching finance details:",N),W("Failed to fetch finance details")}finally{m(!1),D(!1)}},C=()=>{if(!u)return;const N=document.createElement("a");N.href=u,N.download=`finance-letter-${n}.${d==="pdf"?"pdf":"jpg"}`,document.body.appendChild(N),N.click(),document.body.removeChild(N)},Y=N=>{B(N),h(!0)},Q=async()=>{try{if(p(!0),!S.trim()){W("Verification note is required");return}await K.post(`/finance-letters/${n}/verify`,{status:j,verificationNote:S.trim()}),le(`Finance ${j.toLowerCase()} successfully!`),g(),h(!1),t()}catch(N){console.log(N),W(N.response?.data?.message||"Failed to update Finance status")}finally{p(!1)}},ee=()=>d==="pdf"?e.jsx("iframe",{src:`${u}#toolbar=0`,title:"Finance Letter",width:"100%",height:"500px",style:{border:"none"},onLoad:()=>D(!1)}):d==="image"?e.jsx("img",{src:u,alt:"Finance Letter",style:{maxWidth:"100%",maxHeight:"500px",display:"block",margin:"0 auto"},onLoad:()=>D(!1)}):null;return e.jsxs(e.Fragment,{children:[e.jsx(ne,{open:i,onClose:t,children:e.jsxs(k,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"80%",maxWidth:"900px",bgcolor:"background.paper",boxShadow:24,borderRadius:2,p:3,maxHeight:"90vh",overflowY:"auto"},children:[e.jsxs(k,{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2,children:[e.jsx(T,{variant:"h5",component:"h2",children:"Finance Letter Details"}),e.jsx(we,{onClick:t,children:e.jsx(ze,{})})]}),f?e.jsx(k,{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"200px",children:e.jsx(ie,{})}):e.jsxs(e.Fragment,{children:[e.jsxs(k,{mb:3,children:[e.jsxs(T,{variant:"subtitle1",children:[e.jsx("strong",{children:"Booking ID:"})," ",o?.bookingId||n]}),e.jsxs(T,{variant:"subtitle1",children:[e.jsx("strong",{children:"Customer Name:"})," ",o?.customerName||s?.customerName]}),e.jsx(k,{mt:1,children:e.jsx(De,{label:o?.status||s?.status,color:o?.status==="APPROVED"?"success":o?.status==="REJECTED"?"error":"warning"})})]}),e.jsx(oe,{sx:{my:2}}),u?e.jsxs(k,{children:[e.jsx(k,{sx:{border:"1px solid #e0e0e0",borderRadius:1,p:2,mb:2,minHeight:"500px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},children:x?e.jsx(ie,{}):ee()}),e.jsxs(k,{display:"flex",justifyContent:"space-between",children:[e.jsx(k,{children:(o?.status==="PENDING"||s?.status==="PENDING")&&e.jsxs(e.Fragment,{children:[e.jsx(L,{variant:"contained",style:{backgroundColor:"#2ed8b6"},onClick:()=>Y("APPROVED"),sx:{mr:2},children:"Approve Finance"}),e.jsx(L,{variant:"contained",style:{backgroundColor:"#ff5370"},onClick:()=>Y("REJECTED"),children:"Reject Finance"})]})}),e.jsxs(k,{children:[e.jsxs(L,{variant:"contained",onClick:C,sx:{mr:2},children:["Download ",d==="pdf"?"PDF":"Image"]}),e.jsx(L,{variant:"outlined",onClick:t,children:"Close"})]})]})]}):e.jsx(T,{variant:"body1",color:"textSecondary",textAlign:"center",py:4,children:"No finance letter document available"})]})]})}),e.jsx(ne,{open:r,onClose:()=>!b&&h(!1),children:e.jsxs(k,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:400,bgcolor:"background.paper",boxShadow:24,borderRadius:2,p:3},children:[e.jsx(T,{variant:"h6",component:"h2",mb:2,children:`${j==="APPROVED"?"Approve":"Reject"} Finance`}),e.jsx(R,{fullWidth:!0,label:"Verification Note",variant:"outlined",value:S,onChange:N=>y(N.target.value),placeholder:`Enter ${j==="APPROVED"?"approval":"rejection"} note`,required:!0,sx:{mb:3}}),e.jsxs(k,{display:"flex",justifyContent:"flex-end",gap:2,children:[e.jsx(L,{variant:"outlined",onClick:()=>h(!1),disabled:b,children:"Cancel"}),e.jsx(L,{variant:"contained",sx:{backgroundColor:j==="APPROVED"?v:_,"&:hover":{backgroundColor:j==="APPROVED"?"rgb(36, 196, 162)":void 0}},onClick:Q,disabled:b||!S.trim(),children:b?e.jsxs(e.Fragment,{children:[e.jsx(ie,{size:20,sx:{mr:1}}),"Processing..."]}):j==="APPROVED"?"Approve":"Reject"})]})]})})]})},yt=({show:i,onClose:t,bookingId:s})=>{const[n,g]=c.useState(null),[o,l]=c.useState(!1),[f,m]=c.useState(""),[u,w]=c.useState(""),[x,D]=c.useState("");c.useEffect(()=>{i&&s&&(d(),m(""),w(""),D(""))},[i,s]);const d=async()=>{try{l(!0);const v=(await K.get(`/bookings/${s}`)).data.data;g(v)}catch(p){console.error("Error fetching booking details:",p),m("Failed to fetch booking details")}finally{l(!1)}},A=p=>{const v=p.target.value;(v===""||!isNaN(v))&&D(v)},r=()=>{if(!n)return 0;const p=n.discountedAmount||0,v=n.payment?.gcAmount||0,_=n?.exchangeDetails?.price||0,z=parseFloat(x)||0;return p+v-z-_},h=async()=>{try{if(!x||x===""){m("Please enter finance disbursement amount"),W("Please enter finance disbursement amount");return}const p=parseFloat(x);if(isNaN(p)||p<=0){m("Please enter a valid finance disbursement amount"),W("Please enter a valid finance disbursement amount");return}l(!0),m("");const v={bookingId:s,disbursementAmount:p,downPaymentExpected:r()};console.log("Submitting disbursement data:",v);const _=await K.post("/disbursements",v);if(_.data.success)w("Disbursement details saved successfully"),le("Disbursement details saved successfully"),setTimeout(()=>{b(),t()},1e3);else throw new Error(_.data.message||"Failed to save disbursement details")}catch(p){console.error("Error saving disbursement details:",p);const v=p.response?.data?.message||"Failed to save disbursement details";m(v),W(v)}finally{l(!1)}},j=n?.discountedAmount||0,B=n?.payment?.gcAmount||0,S=n?.exchangeDetails?.price||0,y=r(),b=()=>{if(!n)return;const p=window.open("","_blank"),v=new Date().toLocaleDateString("en-GB"),_=parseFloat(x)||0;p.document.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FINANCER's ASSURANCE LETTER</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 10mm auto;
            padding: 15mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            box-sizing: border-box;
        }
        .content {
            width: 100%;
        }
        .subject {
            font-weight: bold;
            margin: 15px 0;
            text-align: left;
        }
        .salutation {
            margin: 15px 0;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .details-table, .details-table td {
            border: 1px solid black;
        }
        .details-table td {
            padding: 8px;
            vertical-align: top;
        }
        .left-col {
            width: 70%;
            font-weight: bold;
        }
        .instruction-text {
            margin: 15px 0;
            text-align: justify;
        }
        .signature-block {
            margin-top: 40px;
        }
        .signature-line {
            border-top: 1px solid black;
            width: 70%;
            margin-top: 40px;
            padding-top: 5px;
        }
         .signature-box {
  width: 25%;
  border-top: 1px dashed black;
  margin-top: 5px;
  margin-left: auto;
  padding: 1px 0;
  text-align: right;
  color: #555555;
  font-weight: bold;
}
        @media print {
            body {
                background: white;
            }
            .page {
                box-shadow: none;
                margin: 0;
                padding: 0;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="content">
            <div style="text-align: right;">Date: <strong>${v}</strong></div>
            
            <div class="salutation">
                To,<br>
                The Director/Manager,<br>
                Gandhi Motors Pvt Ltd,<br>
                Nasik
            </div>
            
            <div class="subject">
                Sub:- Delivery Order & Disbursement Assurance letter.
            </div>
            
            <div class="salutation">
                Dear sir,
            </div>
            
            <div>
                We have sanctioned a loan for purchase of a two-wheeler to our below mentioned customer:
            </div>
            
            <div style="margin: 15px 0;">
                Name : Mr./Mrs. : ${n.customerDetails?.name||""}
            </div>
            
            <div style="margin: 15px 0;">
                Vehicle make & model :<b> ${n.model?.model_name||""}</b> &nbsp;&nbsp;&nbsp;
                Booking Number: ${n.bookingNumber}
            </div>
            
            <table class="details-table">
                <tr>
                    <td class="left-col">Total Deal Amount including On road price + Accessories + Addons</td>
                    <td>${j.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                    <td class="left-col">Disbursement Amount assured by finance company</td>
                    <td>${_.toLocaleString("en-IN")}</td>
                </tr>
            
                <tr>
                    <td class="left-col">Net Down Payment to be taken from Customer</td>
                    <td>${y.toLocaleString("en-IN")}</td>
                </tr>
            </table>
            
            <div class="instruction-text">
                The loan process for the purchase of abovesaid vehicle has been completed and the Loan amount will be disbursed to your bank account within two working days from the date of issuance of this letter.
            </div>
            
            <div class="instruction-text">
                This letter is non revokable & we promise to pay you the above-mentioned loan amount within stipulated time.
            </div>
            
            <div class="instruction-text">
                You are hereby requested to endorse our hypothecation mark on the vehicle and deliver the same to the above-mentioned customer after registering the vehicle with the respective RTO Office & give us the details of RTO registration along with the invoice, insurance & Down payment receipt.
            </div>
            
            <div class="instruction-text">
                Please do the needful.
            </div>
            
            <div class="signature-block">
                <div>For & on behalf of</div>
                <div>Financer's / Bank</div>
                <div>Name:<b>${n.payment.financer.name}</b></div>
                <div style="margin-top: 15px;">Employee Name:________________________________</div>
                <div style="margin-top: 15px;">Mobile No:________________________________</div>
            </div>
             <div class="signature-box">
            <div><b>Authorised Signature</b></div>
          </div>
        </div>
    </div>
    
    <script>
        window.onload = function() {
            setTimeout(() => { window.print(); }, 500);
        };
    <\/script>
</body>
</html>
    `)};return e.jsxs(e.Fragment,{children:[e.jsx(be,{visible:i,className:"modal-backdrop",style:{backgroundColor:"rgba(0, 0, 0, 0.5)"}}),e.jsxs(q,{visible:i,onClose:t,size:"lg",alignment:"center",children:[e.jsx(G,{className:"text-white",style:{backgroundColor:"#243c7c"},children:e.jsx(H,{className:"text-white",children:"Disbursement Details"})}),e.jsxs(J,{children:[f&&e.jsx(de,{color:"danger",children:f}),u&&e.jsx(de,{color:"success",children:u}),e.jsx("div",{className:"booking-header mb-2 p-1 bg-light rounded",children:e.jsxs("h5",{className:"mb-0",children:["Booking Number: ",e.jsx("strong",{children:n?.bookingNumber||""})]})}),e.jsx("hr",{}),e.jsxs(I,{className:"mb-3",children:[e.jsxs(P,{md:6,children:[e.jsx("label",{className:"form-label",children:"Customer Name"}),e.jsx(M,{type:"text",value:n?.customerDetails?.name||"",readOnly:!0,className:"bg-light"})]}),e.jsxs(P,{md:6,children:[e.jsx("label",{className:"form-label",children:"Model Name"}),e.jsx(M,{type:"text",value:n?.model?.model_name||"",readOnly:!0,className:"bg-light"})]})]}),e.jsxs(I,{className:"mb-3",children:[e.jsxs(P,{md:6,children:[e.jsx("label",{className:"form-label",children:"Deal Amount (₹)"}),e.jsx(M,{type:"text",value:j.toLocaleString(),readOnly:!0,className:"bg-light font-weight-bold"})]}),e.jsxs(P,{md:6,children:[e.jsx("label",{className:"form-label",children:"GC Amount (₹)"}),e.jsx(M,{type:"text",value:B.toLocaleString(),readOnly:!0,className:"bg-light font-weight-bold"})]})]}),e.jsxs(Ue,{children:[e.jsxs(I,{className:"mb-3",children:[e.jsxs(P,{md:6,children:[e.jsx("label",{className:"form-label",children:"Exchange Amount (₹)"}),e.jsx(M,{type:"text",value:S.toLocaleString(),readOnly:!0,className:"bg-light font-weight-bold"})]}),e.jsxs(P,{md:6,children:[e.jsx("label",{className:"form-label",children:"Finance Disbursement Amount (₹)"}),e.jsx(M,{type:"number",value:x,onChange:A,placeholder:"Enter finance disbursement amount",disabled:o})]})]}),e.jsx(I,{className:"mb-3",children:e.jsxs(P,{md:6,children:[e.jsx("label",{className:"form-label",children:"Downpayment Amount (₹)"}),e.jsx(M,{type:"number",value:y,readOnly:!0,className:"bg-light font-weight-bold"})]})})]})]}),e.jsxs(X,{className:"d-flex justify-content-between",children:[e.jsx("div",{children:e.jsx(F,{color:"primary",onClick:h,className:"me-2",disabled:o||!x,children:o?"Processing...":"Save & Print"})}),e.jsx(F,{color:"secondary",onClick:t,disabled:o,children:"Close"})]})]})]})},Ct=({open:i,onClose:t,updateData:s,onApprove:n,onReject:g,onUpdateField:o})=>{const[l,f]=c.useState({}),[m,u]=c.useState([]),[w,x]=c.useState(!1);c.useEffect(()=>{if(s){const r=s.model?._id||s.model?.id;r&&D(r),f({...s.pendingUpdates,color:s.pendingUpdates?.color?._id||s.pendingUpdates?.color||"",note:s.updateRequestNote||""})}},[s]);const D=async r=>{try{x(!0);const h=await K.get(`colors/model/${r}`);u(h.data.data.colors||[])}catch(h){console.error("Failed to fetch model colors:",h),u([])}finally{x(!1)}},d=(r,h)=>{const j=r.split(".");f(B=>{const S={...B};let y=S;for(let b=0;b<j.length-1;b++)y[j[b]]||(y[j[b]]={}),y=y[j[b]];return y[j[j.length-1]]=h,S})},A=r=>{const h={note:l.note,updates:{...l}};delete h.updates.note,r==="approve"?n(h):g(h)};return s?e.jsx(ne,{open:i,onClose:t,children:e.jsxs(k,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"80%",maxWidth:"800px",bgcolor:"background.paper",boxShadow:24,p:4,maxHeight:"90vh",overflowY:"auto"},children:[e.jsxs(T,{variant:"h6",gutterBottom:!0,children:["Pending Update Details - ",s.bookingNumber]}),e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsx(T,{variant:"subtitle1",gutterBottom:!0,children:"Current Information"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsx(R,{label:"Customer Name",value:s.customerName,variant:"outlined",fullWidth:!0,disabled:!0}),e.jsx(R,{label:"Current Color",value:s.color?.name||"",variant:"outlined",fullWidth:!0,disabled:!0})]})]}),e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsx(T,{variant:"subtitle1",gutterBottom:!0,children:"Requested Updates"}),e.jsx(R,{label:"Update Note",value:l.note||"",onChange:r=>d("note",r.target.value),variant:"outlined",fullWidth:!0,multiline:!0,rows:2,sx:{mb:2}}),e.jsx(T,{variant:"subtitle2",gutterBottom:!0,children:"Customer Details"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"},children:[e.jsx(R,{label:"Salutation",value:l.customerDetails?.salutation||"",onChange:r=>d("customerDetails.salutation",r.target.value),variant:"outlined",fullWidth:!0}),e.jsx(R,{label:"Name",value:l.customerDetails?.name||"",onChange:r=>d("customerDetails.name",r.target.value),variant:"outlined",fullWidth:!0}),e.jsx(R,{label:"Mobile 1",value:l.customerDetails?.mobile1||"",onChange:r=>d("customerDetails.mobile1",r.target.value),variant:"outlined",fullWidth:!0}),e.jsx(R,{label:"Mobile 2",value:l.customerDetails?.mobile2||"",onChange:r=>d("customerDetails.mobile2",r.target.value),variant:"outlined",fullWidth:!0}),e.jsx(R,{label:"Address",value:l.customerDetails?.address||"",onChange:r=>d("customerDetails.address",r.target.value),variant:"outlined",fullWidth:!0,multiline:!0,rows:2}),e.jsx(R,{label:"Pincode",value:l.customerDetails?.pincode||"",onChange:r=>d("customerDetails.pincode",r.target.value),variant:"outlined",fullWidth:!0}),e.jsx(R,{label:"Requested Color",value:l.color||"",variant:"outlined",fullWidth:!0})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"},children:e.jsxs(Be,{fullWidth:!0,children:[e.jsx($e,{children:"Available Color"}),e.jsx(Oe,{value:l.color?._id||"",onChange:r=>d("color",r.target.value),label:"Requested Color",disabled:w,children:w?e.jsx(re,{value:"",disabled:!0,children:"Loading colors..."}):m.length>0?m.map(r=>e.jsx(re,{value:r.name,children:r.name},r._id)):e.jsx(re,{value:"",disabled:!0,children:"No colors available"})})]})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"},children:[e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsx(L,{variant:"contained",onClick:()=>A("reject"),style:{backgroundColor:"#ff5370",color:"white","&:hover":{backgroundColor:"#e53935"}},children:"Reject"}),e.jsx(L,{variant:"contained",onClick:()=>A("approve"),style:{backgroundColor:"#2ed8b6",color:"white","&:hover":{backgroundColor:"#26c6da"}},children:"Approve"})]}),e.jsx(L,{variant:"outlined",onClick:t,children:"Close"})]})]})}):null};export{jt as F,qe as K,yt as P,Ct as a};
