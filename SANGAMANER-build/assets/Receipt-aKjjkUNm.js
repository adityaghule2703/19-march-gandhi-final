import{r as F,g as sr,j as e,m as ee,n as ar,l as cr,v as ie,C as tn,S as Ie,F as lr}from"./index-CD-UhOJ2.js";import{F as nn}from"./index-vcvjuoBI.js";import{f as dr,b as ur}from"./index-C3Vny5Su.js";import"./jspdf.plugin.autotable-k796q59y.js";import{g as mr}from"./tableFilters-DsQgHBMv.js";/* empty css                *//* empty css              *//* empty css                *//* empty css             */import{r as hr,h as J,T as se,A as Q,P as W,M as X,C as gr,a as fr,b as pr,c as vr,j as xr,i as br}from"./DefaultLayout-GrycDKjh.js";import{C as Bn,a as Mn,b as Ln,c as kn,d as Fn}from"./CModalTitle-Cs0DhY3v.js";import{C as xe}from"./CAlert-CENR3-Ss.js";import{C as rt,a as te}from"./CRow--g2qTLFu.js";import{C as fe}from"./CFormInput-CCQbnhW2.js";import{C as yr}from"./CForm-CevvQQOo.js";import{C as gt}from"./CFormSelect-DGopBSdT.js";import{a as De,c as ft}from"./index.esm-BML82zAk.js";import{C as Cr,a as Ar}from"./CCardBody-BS7SU2uX.js";import{C as Nr}from"./CNav-Cyg_fwvj.js";import{b as ot,a as it}from"./CNavItem-C1bzmovJ.js";import{C as wr}from"./CFormControlWrapper-BAfeeQeh.js";import{C as Er,a as st}from"./CTabPane-Dx1WyKKV.js";import{L as Tr,e as Rr,A as Sr}from"./en-IN-DqIMVgVJ.js";import{D as rn}from"./DatePicker-BJteVLIz.js";import{T as yt}from"./TextField-yo76IxFz.js";import{C as at,a as ct,b as Z,c as I,d as lt,e as R}from"./CTable-CzW9ULzA.js";import{c as jr}from"./cil-print-CPAcfqxC.js";import{M as Pr}from"./Menu-DZGW0kW4.js";import{M as Ir}from"./MenuItem-FukuNeBD.js";import{c as Dr}from"./cil-plus-D8mtC-W5.js";import{c as Br}from"./cil-check-circle-BlU9eaow.js";import"./slicedToArray-Dby63wcm.js";import"./extends-CF3RwP-h.js";import"./setPrototypeOf-C3V6guyq.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./clsx-B-dksMZM.js";import"./isWithinInterval-DaYQ2mcw.js";import"./format-BZUhodlP.js";import"./Button-DAEbvaln.js";import"./createSvgIcon-70ImKnSA.js";import"./emotion-react.browser.esm-HxER6ccQ.js";import"./TransitionGroup-CT7_5huu.js";import"./Transition-DXUjlb7_.js";const Mr=({show:i,onClose:s,bookingData:a,canCreateReceipts:o,cashLocations:n})=>{const[t,c]=F.useState({bookingId:a?._id||"",totalAmount:a?.discountedAmount||0,balanceAmount:a?.balanceAmount||0,modeOfPayment:"",amount:"",remark:"",cashLocation:"",bank:"",subPaymentMode:"",gcAmount:a?.payment?.gcAmount||0,transactionReference:"",amountToBeCredited:0}),[d,l]=F.useState(n||[]),[u,f]=F.useState([]),[S,v]=F.useState([]),[m,j]=F.useState(!1),[B,O]=F.useState(null),[P,M]=F.useState(null),D=sr(),E=g=>{const{name:p,value:h}=g.target;c(b=>{const y={...b,[p]:h};if(p==="amount"){const A=parseFloat(h)||0,N=parseFloat(b.gcAmount)||0;y.amountToBeCredited=A-N}return y})},H=async g=>{if(g.preventDefault(),!o){O("You do not have permission to create receipts");return}j(!0),O(null),M(null);try{let p={bookingId:t.bookingId,paymentMode:t.modeOfPayment,amount:parseFloat(parseFloat(t.amount).toFixed(2)),remark:t.remark,transactionReference:t.transactionReference};switch(t.modeOfPayment){case"Cash":p.cashLocation=t.cashLocation;break;case"Bank":p.bank=t.bank,p.subPaymentMode=t.subPaymentMode;break;case"Finance Disbursement":p.financer=a?.payment?.financer?._id||a?.payment?.financer,p.gcAmount=parseFloat(parseFloat(t.gcAmount).toFixed(2)),p.amountToBeCredited=parseFloat(parseFloat(t.amountToBeCredited).toFixed(2));break;case"Exchange":case"Pay Order":p.bank=t.bank;break;default:break}const h=await ee.post("/ledger/receipt",p);console.log("Payment response:",h.data);let b=h.data.data?.receipt||h.data.data?.ledger||h.data.data;if(!b)throw new Error("No receipt data returned from server");const y={_id:b._id,id:b.id||b._id,receiptNumber:b.receiptNumber,amount:b.amount,receiptDate:b.receiptDate||b.createdAt,paymentMode:b.paymentMode,transactionReference:b.transactionReference,display:{amount:b.display?.amount||`₹${b.amount}`,date:b.display?.date||(b.receiptDate?new Date(b.receiptDate).toLocaleDateString("en-GB"):new Date().toLocaleDateString("en-GB"))}},A=y._id||y.id;if(!A)throw new Error("Receipt ID not returned from server");M("Payment successfully recorded! Opening receipt..."),c({bookingId:a?._id||"",totalAmount:a?.discountedAmount||0,balanceAmount:a?.balanceAmount||0,modeOfPayment:"",amount:"",remark:"",cashLocation:"",bank:"",subPaymentMode:"",gcAmount:a?.payment?.gcAmount||0,transactionReference:"",amountToBeCredited:0}),setTimeout(async()=>{try{const T=(await ee.get(`/ledger/booking/${t.bookingId}`)).data.data.allReceipts||[];console.log("All receipts:",T);const ne=T.findIndex(ye=>ye._id===A||ye.id===A||ye.receiptNumber===y.receiptNumber);console.log("New receipt index:",ne);const Y=T.length===1;console.log("Total receipts:",T.length,"Is first receipt ever:",Y),typeof window.printReceiptCallback=="function"?(console.log("Calling printReceiptCallback with:",A,t.bookingId,Y?0:1),window.printReceiptCallback(A,t.bookingId,Y?0:1)):console.error("printReceiptCallback is not defined on window!")}catch(N){console.error("Error fetching receipts:",N),typeof window.printReceiptCallback=="function"&&window.printReceiptCallback(A,t.bookingId,1)}},1500),setTimeout(()=>{s(),setTimeout(()=>D("/view-ledgers"),500)},3e3)}catch(p){console.error("Payment error:",p),O(p.response?.data?.error||p.response?.data?.message||p.message||"Failed to process payment. Please try again.")}finally{j(!1)}};F.useEffect(()=>{const g=async()=>{try{const h=await ee.get("/banks");f(h.data.data.banks)}catch(h){console.error("Error fetching bank locations:",h)}},p=async()=>{try{const h=await ee.get("/banksubpaymentmodes");v(h.data.data||[])}catch(h){console.error("Error fetching payment sub-modes:",h),v([])}};if(i){n&&n.length>0?l(n):(async()=>{try{const y=await ee.get("/cash-locations");l(y.data.data.cashLocations)}catch(y){console.error("Error fetching cash locations:",y)}})(),g(),p();const h=a?.payment?.gcAmount||0;c({bookingId:a?._id||"",totalAmount:a?.discountedAmount||0,balanceAmount:a?.balanceAmount||0,modeOfPayment:"",amount:"",remark:"",cashLocation:"",bank:"",subPaymentMode:"",gcAmount:h,transactionReference:"",amountToBeCredited:0-h}),O(null),M(null)}},[i,a,n]);const C=()=>{switch(t.modeOfPayment){case"Cash":return e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Cash Location"}),e.jsxs(gt,{name:"cashLocation",value:t.cashLocation,onChange:E,required:!0,disabled:m,children:[e.jsx("option",{value:"",children:"Select Cash Location"}),d.map(g=>e.jsx("option",{value:g.id||g._id,children:g.name||g.locationName||"Unnamed Location"},g.id||g._id))]})]});case"Bank":return e.jsxs(e.Fragment,{children:[e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Payment Sub Mode"}),e.jsxs(gt,{name:"subPaymentMode",value:t.subPaymentMode,onChange:E,required:!0,disabled:m,children:[e.jsx("option",{value:"",children:"Select Payment Sub Mode"}),S.map(g=>e.jsx("option",{value:g.id||g._id,children:g.payment_mode||g.name},g.id||g._id))]})]}),e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Bank Location"}),e.jsxs(gt,{name:"bank",value:t.bank,onChange:E,required:!0,disabled:m,children:[e.jsx("option",{value:"",children:"Select Bank Location"}),u.map(g=>e.jsx("option",{value:g.id||g._id,children:g.name},g.id||g._id))]})]})]});case"Finance Disbursement":return e.jsxs(e.Fragment,{children:[e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Financer Name"}),e.jsx(fe,{type:"text",value:a?.payment?.financer?.name||"N/A",readOnly:!0,className:"bg-light"})]}),e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"GC Amount (₹)"}),e.jsx(fe,{type:"number",name:"gcAmount",value:t.gcAmount?parseFloat(t.gcAmount).toFixed(2):"0.00",readOnly:!0,className:"bg-light"})]}),e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label mt-3",children:"Amount Credited To Customer Ledger (₹)"}),e.jsx(fe,{type:"number",name:"amountToBeCredited",value:t.amountToBeCredited?parseFloat(t.amountToBeCredited).toFixed(2):"0.00",readOnly:!0,className:"bg-light"})]})]});default:return null}};return e.jsxs(e.Fragment,{children:[e.jsx(hr,{visible:i,className:"modal-backdrop",style:{backgroundColor:"rgba(0, 0, 0, 0.5)"}}),e.jsxs(Bn,{visible:i,onClose:s,size:"lg",alignment:"center",children:[e.jsx(Mn,{children:e.jsx(Ln,{children:"Account Receipt"})}),e.jsxs(kn,{children:[B&&e.jsx(xe,{color:"danger",children:B}),P&&e.jsxs(xe,{color:"success",children:[P,m&&e.jsx("div",{className:"mt-2",children:e.jsx("small",{children:"Processing payment and generating receipt..."})})]}),e.jsxs(rt,{className:"mb-3",children:[e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Customer Name"}),e.jsx(fe,{type:"text",value:a?.customerDetails?.name||"",readOnly:!0,className:"bg-light"})]}),e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Chassis Number"}),e.jsx(fe,{type:"text",value:a?.chassisNumber||"",readOnly:!0,className:"bg-light"})]})]}),e.jsxs(rt,{className:"mb-3",children:[e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Total Amount (₹)"}),e.jsx(fe,{type:"number",name:"totalAmount",value:t.totalAmount?parseFloat(t.totalAmount).toFixed(2):"0.00",readOnly:!0,className:"bg-light font-weight-bold"})]}),e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Balance Amount (₹)"}),e.jsx(fe,{type:"number",name:"balanceAmount",value:t.balanceAmount?parseFloat(t.balanceAmount).toFixed(2):"0.00",readOnly:!0,className:`bg-light font-weight-bold ${parseFloat(t.balanceAmount)>0?"text-danger":"text-success"}`})]})]}),e.jsxs(yr,{onSubmit:H,children:[e.jsxs(rt,{className:"mb-3",children:[e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Amount (₹)"}),e.jsx(fe,{type:"number",name:"amount",value:t.amount,onChange:E,required:!0,min:"0",step:"0.01",disabled:m})]}),e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Mode of Payment"}),e.jsxs(gt,{name:"modeOfPayment",value:t.modeOfPayment,onChange:E,required:!0,disabled:m,children:[e.jsx("option",{value:"",children:"--Select--"}),e.jsx("option",{value:"Cash",children:"Cash"}),e.jsx("option",{value:"Bank",children:"Bank"}),e.jsx("option",{value:"Finance Disbursement",children:"Finance Disbursement"}),e.jsx("option",{value:"Exchange",children:"Exchange"}),e.jsx("option",{value:"Pay Order",children:"Pay Order"})]})]})]}),e.jsx(rt,{className:"mb-3",children:C()}),e.jsxs(rt,{className:"mb-3",children:[e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Reference Number"}),e.jsx(fe,{type:"text",name:"transactionReference",value:t.transactionReference,onChange:E,disabled:m})]}),e.jsxs(te,{md:6,children:[e.jsx("label",{className:"form-label",children:"Remark"}),e.jsx(fe,{type:"text",name:"remark",value:t.remark,onChange:E,placeholder:"Enter any remarks...",disabled:m})]})]})]})]}),e.jsxs(Fn,{children:[e.jsx("div",{children:e.jsx(De,{color:"primary",onClick:H,className:"me-2 submit-button",disabled:m||!o,children:m?"Processing...":"Save Payment & Print Receipt"})}),e.jsx(De,{color:"secondary",onClick:s,disabled:m,children:"Close"})]})]})]})},Lr=i=>{if(i===0)return"Zero";const s=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"],a=["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],o=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],n=u=>{let f="";return u>=100&&(f+=s[Math.floor(u/100)]+" Hundred",u%=100,u>0&&(f+=" and ")),u>=20?(f+=o[Math.floor(u/10)],u%=10,u>0&&(f+=" "+s[u])):u>=10?f+=a[u-10]:u>0&&(f+=s[u]),f},t=u=>{if(u===0)return"";let f="";const S=Math.floor(u/1e7),v=Math.floor(u%1e7/1e5),m=Math.floor(u%1e5/1e3),j=u%1e3;return S>0&&(f+=n(S)+" Crore",(v>0||m>0||j>0)&&(f+=" ")),v>0&&(f+=n(v)+" Lakh",(m>0||j>0)&&(f+=" ")),m>0&&(f+=n(m)+" Thousand",j>0&&(f+=" ")),j>0&&(f+=n(j)),f},c=Math.floor(i),d=Math.round((i-c)*100);let l="";return c>0?l=t(c)+" Rupees":l="Zero Rupees",d>0&&(c>0&&(l+=" and "),l+=t(d)+" Paise"),l.trim()};var Ve={},Ct,on;function kr(){return on||(on=1,Ct=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),Ct}var At={},Ne={},sn;function Be(){if(sn)return Ne;sn=1;let i;const s=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return Ne.getSymbolSize=function(o){if(!o)throw new Error('"version" cannot be null or undefined');if(o<1||o>40)throw new Error('"version" should be in range from 1 to 40');return o*4+17},Ne.getSymbolTotalCodewords=function(o){return s[o]},Ne.getBCHDigit=function(a){let o=0;for(;a!==0;)o++,a>>>=1;return o},Ne.setToSJISFunction=function(o){if(typeof o!="function")throw new Error('"toSJISFunc" is not a valid function.');i=o},Ne.isKanjiModeEnabled=function(){return typeof i<"u"},Ne.toSJIS=function(o){return i(o)},Ne}var Nt={},an;function zt(){return an||(an=1,(function(i){i.L={bit:1},i.M={bit:0},i.Q={bit:3},i.H={bit:2};function s(a){if(typeof a!="string")throw new Error("Param is not a string");switch(a.toLowerCase()){case"l":case"low":return i.L;case"m":case"medium":return i.M;case"q":case"quartile":return i.Q;case"h":case"high":return i.H;default:throw new Error("Unknown EC Level: "+a)}}i.isValid=function(o){return o&&typeof o.bit<"u"&&o.bit>=0&&o.bit<4},i.from=function(o,n){if(i.isValid(o))return o;try{return s(o)}catch{return n}}})(Nt)),Nt}var wt,cn;function Fr(){if(cn)return wt;cn=1;function i(){this.buffer=[],this.length=0}return i.prototype={get:function(s){const a=Math.floor(s/8);return(this.buffer[a]>>>7-s%8&1)===1},put:function(s,a){for(let o=0;o<a;o++)this.putBit((s>>>a-o-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(s){const a=Math.floor(this.length/8);this.buffer.length<=a&&this.buffer.push(0),s&&(this.buffer[a]|=128>>>this.length%8),this.length++}},wt=i,wt}var Et,ln;function Or(){if(ln)return Et;ln=1;function i(s){if(!s||s<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=s,this.data=new Uint8Array(s*s),this.reservedBit=new Uint8Array(s*s)}return i.prototype.set=function(s,a,o,n){const t=s*this.size+a;this.data[t]=o,n&&(this.reservedBit[t]=!0)},i.prototype.get=function(s,a){return this.data[s*this.size+a]},i.prototype.xor=function(s,a,o){this.data[s*this.size+a]^=o},i.prototype.isReserved=function(s,a){return this.reservedBit[s*this.size+a]},Et=i,Et}var Tt={},dn;function _r(){return dn||(dn=1,(function(i){const s=Be().getSymbolSize;i.getRowColCoords=function(o){if(o===1)return[];const n=Math.floor(o/7)+2,t=s(o),c=t===145?26:Math.ceil((t-13)/(2*n-2))*2,d=[t-7];for(let l=1;l<n-1;l++)d[l]=d[l-1]-c;return d.push(6),d.reverse()},i.getPositions=function(o){const n=[],t=i.getRowColCoords(o),c=t.length;for(let d=0;d<c;d++)for(let l=0;l<c;l++)d===0&&l===0||d===0&&l===c-1||d===c-1&&l===0||n.push([t[d],t[l]]);return n}})(Tt)),Tt}var Rt={},un;function Ur(){if(un)return Rt;un=1;const i=Be().getSymbolSize,s=7;return Rt.getPositions=function(o){const n=i(o);return[[0,0],[n-s,0],[0,n-s]]},Rt}var St={},mn;function Vr(){return mn||(mn=1,(function(i){i.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const s={N1:3,N2:3,N3:40,N4:10};i.isValid=function(n){return n!=null&&n!==""&&!isNaN(n)&&n>=0&&n<=7},i.from=function(n){return i.isValid(n)?parseInt(n,10):void 0},i.getPenaltyN1=function(n){const t=n.size;let c=0,d=0,l=0,u=null,f=null;for(let S=0;S<t;S++){d=l=0,u=f=null;for(let v=0;v<t;v++){let m=n.get(S,v);m===u?d++:(d>=5&&(c+=s.N1+(d-5)),u=m,d=1),m=n.get(v,S),m===f?l++:(l>=5&&(c+=s.N1+(l-5)),f=m,l=1)}d>=5&&(c+=s.N1+(d-5)),l>=5&&(c+=s.N1+(l-5))}return c},i.getPenaltyN2=function(n){const t=n.size;let c=0;for(let d=0;d<t-1;d++)for(let l=0;l<t-1;l++){const u=n.get(d,l)+n.get(d,l+1)+n.get(d+1,l)+n.get(d+1,l+1);(u===4||u===0)&&c++}return c*s.N2},i.getPenaltyN3=function(n){const t=n.size;let c=0,d=0,l=0;for(let u=0;u<t;u++){d=l=0;for(let f=0;f<t;f++)d=d<<1&2047|n.get(u,f),f>=10&&(d===1488||d===93)&&c++,l=l<<1&2047|n.get(f,u),f>=10&&(l===1488||l===93)&&c++}return c*s.N3},i.getPenaltyN4=function(n){let t=0;const c=n.data.length;for(let l=0;l<c;l++)t+=n.data[l];return Math.abs(Math.ceil(t*100/c/5)-10)*s.N4};function a(o,n,t){switch(o){case i.Patterns.PATTERN000:return(n+t)%2===0;case i.Patterns.PATTERN001:return n%2===0;case i.Patterns.PATTERN010:return t%3===0;case i.Patterns.PATTERN011:return(n+t)%3===0;case i.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(t/3))%2===0;case i.Patterns.PATTERN101:return n*t%2+n*t%3===0;case i.Patterns.PATTERN110:return(n*t%2+n*t%3)%2===0;case i.Patterns.PATTERN111:return(n*t%3+(n+t)%2)%2===0;default:throw new Error("bad maskPattern:"+o)}}i.applyMask=function(n,t){const c=t.size;for(let d=0;d<c;d++)for(let l=0;l<c;l++)t.isReserved(l,d)||t.xor(l,d,a(n,l,d))},i.getBestMask=function(n,t){const c=Object.keys(i.Patterns).length;let d=0,l=1/0;for(let u=0;u<c;u++){t(u),i.applyMask(u,n);const f=i.getPenaltyN1(n)+i.getPenaltyN2(n)+i.getPenaltyN3(n)+i.getPenaltyN4(n);i.applyMask(u,n),f<l&&(l=f,d=u)}return d}})(St)),St}var pt={},hn;function On(){if(hn)return pt;hn=1;const i=zt(),s=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],a=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return pt.getBlocksCount=function(n,t){switch(t){case i.L:return s[(n-1)*4+0];case i.M:return s[(n-1)*4+1];case i.Q:return s[(n-1)*4+2];case i.H:return s[(n-1)*4+3];default:return}},pt.getTotalCodewordsCount=function(n,t){switch(t){case i.L:return a[(n-1)*4+0];case i.M:return a[(n-1)*4+1];case i.Q:return a[(n-1)*4+2];case i.H:return a[(n-1)*4+3];default:return}},pt}var jt={},dt={},gn;function Hr(){if(gn)return dt;gn=1;const i=new Uint8Array(512),s=new Uint8Array(256);return(function(){let o=1;for(let n=0;n<255;n++)i[n]=o,s[o]=n,o<<=1,o&256&&(o^=285);for(let n=255;n<512;n++)i[n]=i[n-255]})(),dt.log=function(o){if(o<1)throw new Error("log("+o+")");return s[o]},dt.exp=function(o){return i[o]},dt.mul=function(o,n){return o===0||n===0?0:i[s[o]+s[n]]},dt}var fn;function qr(){return fn||(fn=1,(function(i){const s=Hr();i.mul=function(o,n){const t=new Uint8Array(o.length+n.length-1);for(let c=0;c<o.length;c++)for(let d=0;d<n.length;d++)t[c+d]^=s.mul(o[c],n[d]);return t},i.mod=function(o,n){let t=new Uint8Array(o);for(;t.length-n.length>=0;){const c=t[0];for(let l=0;l<n.length;l++)t[l]^=s.mul(n[l],c);let d=0;for(;d<t.length&&t[d]===0;)d++;t=t.slice(d)}return t},i.generateECPolynomial=function(o){let n=new Uint8Array([1]);for(let t=0;t<o;t++)n=i.mul(n,new Uint8Array([1,s.exp(t)]));return n}})(jt)),jt}var Pt,pn;function zr(){if(pn)return Pt;pn=1;const i=qr();function s(a){this.genPoly=void 0,this.degree=a,this.degree&&this.initialize(this.degree)}return s.prototype.initialize=function(o){this.degree=o,this.genPoly=i.generateECPolynomial(this.degree)},s.prototype.encode=function(o){if(!this.genPoly)throw new Error("Encoder not initialized");const n=new Uint8Array(o.length+this.degree);n.set(o);const t=i.mod(n,this.genPoly),c=this.degree-t.length;if(c>0){const d=new Uint8Array(this.degree);return d.set(t,c),d}return t},Pt=s,Pt}var It={},Dt={},Bt={},vn;function _n(){return vn||(vn=1,Bt.isValid=function(s){return!isNaN(s)&&s>=1&&s<=40}),Bt}var ve={},xn;function Un(){if(xn)return ve;xn=1;const i="[0-9]+",s="[A-Z $%*+\\-./:]+";let a="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";a=a.replace(/u/g,"\\u");const o="(?:(?![A-Z0-9 $%*+\\-./:]|"+a+`)(?:.|[\r
]))+`;ve.KANJI=new RegExp(a,"g"),ve.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),ve.BYTE=new RegExp(o,"g"),ve.NUMERIC=new RegExp(i,"g"),ve.ALPHANUMERIC=new RegExp(s,"g");const n=new RegExp("^"+a+"$"),t=new RegExp("^"+i+"$"),c=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return ve.testKanji=function(l){return n.test(l)},ve.testNumeric=function(l){return t.test(l)},ve.testAlphanumeric=function(l){return c.test(l)},ve}var bn;function Me(){return bn||(bn=1,(function(i){const s=_n(),a=Un();i.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},i.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},i.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},i.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},i.MIXED={bit:-1},i.getCharCountIndicator=function(t,c){if(!t.ccBits)throw new Error("Invalid mode: "+t);if(!s.isValid(c))throw new Error("Invalid version: "+c);return c>=1&&c<10?t.ccBits[0]:c<27?t.ccBits[1]:t.ccBits[2]},i.getBestModeForData=function(t){return a.testNumeric(t)?i.NUMERIC:a.testAlphanumeric(t)?i.ALPHANUMERIC:a.testKanji(t)?i.KANJI:i.BYTE},i.toString=function(t){if(t&&t.id)return t.id;throw new Error("Invalid mode")},i.isValid=function(t){return t&&t.bit&&t.ccBits};function o(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return i.NUMERIC;case"alphanumeric":return i.ALPHANUMERIC;case"kanji":return i.KANJI;case"byte":return i.BYTE;default:throw new Error("Unknown mode: "+n)}}i.from=function(t,c){if(i.isValid(t))return t;try{return o(t)}catch{return c}}})(Dt)),Dt}var yn;function $r(){return yn||(yn=1,(function(i){const s=Be(),a=On(),o=zt(),n=Me(),t=_n(),c=7973,d=s.getBCHDigit(c);function l(v,m,j){for(let B=1;B<=40;B++)if(m<=i.getCapacity(B,j,v))return B}function u(v,m){return n.getCharCountIndicator(v,m)+4}function f(v,m){let j=0;return v.forEach(function(B){const O=u(B.mode,m);j+=O+B.getBitsLength()}),j}function S(v,m){for(let j=1;j<=40;j++)if(f(v,j)<=i.getCapacity(j,m,n.MIXED))return j}i.from=function(m,j){return t.isValid(m)?parseInt(m,10):j},i.getCapacity=function(m,j,B){if(!t.isValid(m))throw new Error("Invalid QR Code version");typeof B>"u"&&(B=n.BYTE);const O=s.getSymbolTotalCodewords(m),P=a.getTotalCodewordsCount(m,j),M=(O-P)*8;if(B===n.MIXED)return M;const D=M-u(B,m);switch(B){case n.NUMERIC:return Math.floor(D/10*3);case n.ALPHANUMERIC:return Math.floor(D/11*2);case n.KANJI:return Math.floor(D/13);case n.BYTE:default:return Math.floor(D/8)}},i.getBestVersionForData=function(m,j){let B;const O=o.from(j,o.M);if(Array.isArray(m)){if(m.length>1)return S(m,O);if(m.length===0)return 1;B=m[0]}else B=m;return l(B.mode,B.getLength(),O)},i.getEncodedBits=function(m){if(!t.isValid(m)||m<7)throw new Error("Invalid QR Code version");let j=m<<12;for(;s.getBCHDigit(j)-d>=0;)j^=c<<s.getBCHDigit(j)-d;return m<<12|j}})(It)),It}var Mt={},Cn;function Gr(){if(Cn)return Mt;Cn=1;const i=Be(),s=1335,a=21522,o=i.getBCHDigit(s);return Mt.getEncodedBits=function(t,c){const d=t.bit<<3|c;let l=d<<10;for(;i.getBCHDigit(l)-o>=0;)l^=s<<i.getBCHDigit(l)-o;return(d<<10|l)^a},Mt}var Lt={},kt,An;function Yr(){if(An)return kt;An=1;const i=Me();function s(a){this.mode=i.NUMERIC,this.data=a.toString()}return s.getBitsLength=function(o){return 10*Math.floor(o/3)+(o%3?o%3*3+1:0)},s.prototype.getLength=function(){return this.data.length},s.prototype.getBitsLength=function(){return s.getBitsLength(this.data.length)},s.prototype.write=function(o){let n,t,c;for(n=0;n+3<=this.data.length;n+=3)t=this.data.substr(n,3),c=parseInt(t,10),o.put(c,10);const d=this.data.length-n;d>0&&(t=this.data.substr(n),c=parseInt(t,10),o.put(c,d*3+1))},kt=s,kt}var Ft,Nn;function Kr(){if(Nn)return Ft;Nn=1;const i=Me(),s=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function a(o){this.mode=i.ALPHANUMERIC,this.data=o}return a.getBitsLength=function(n){return 11*Math.floor(n/2)+6*(n%2)},a.prototype.getLength=function(){return this.data.length},a.prototype.getBitsLength=function(){return a.getBitsLength(this.data.length)},a.prototype.write=function(n){let t;for(t=0;t+2<=this.data.length;t+=2){let c=s.indexOf(this.data[t])*45;c+=s.indexOf(this.data[t+1]),n.put(c,11)}this.data.length%2&&n.put(s.indexOf(this.data[t]),6)},Ft=a,Ft}var Ot,wn;function Jr(){if(wn)return Ot;wn=1;const i=Me();function s(a){this.mode=i.BYTE,typeof a=="string"?this.data=new TextEncoder().encode(a):this.data=new Uint8Array(a)}return s.getBitsLength=function(o){return o*8},s.prototype.getLength=function(){return this.data.length},s.prototype.getBitsLength=function(){return s.getBitsLength(this.data.length)},s.prototype.write=function(a){for(let o=0,n=this.data.length;o<n;o++)a.put(this.data[o],8)},Ot=s,Ot}var _t,En;function Qr(){if(En)return _t;En=1;const i=Me(),s=Be();function a(o){this.mode=i.KANJI,this.data=o}return a.getBitsLength=function(n){return n*13},a.prototype.getLength=function(){return this.data.length},a.prototype.getBitsLength=function(){return a.getBitsLength(this.data.length)},a.prototype.write=function(o){let n;for(n=0;n<this.data.length;n++){let t=s.toSJIS(this.data[n]);if(t>=33088&&t<=40956)t-=33088;else if(t>=57408&&t<=60351)t-=49472;else throw new Error("Invalid SJIS character: "+this.data[n]+`
Make sure your charset is UTF-8`);t=(t>>>8&255)*192+(t&255),o.put(t,13)}},_t=a,_t}var Ut={exports:{}},Tn;function Wr(){return Tn||(Tn=1,(function(i){var s={single_source_shortest_paths:function(a,o,n){var t={},c={};c[o]=0;var d=s.PriorityQueue.make();d.push(o,0);for(var l,u,f,S,v,m,j,B,O;!d.empty();){l=d.pop(),u=l.value,S=l.cost,v=a[u]||{};for(f in v)v.hasOwnProperty(f)&&(m=v[f],j=S+m,B=c[f],O=typeof c[f]>"u",(O||B>j)&&(c[f]=j,d.push(f,j),t[f]=u))}if(typeof n<"u"&&typeof c[n]>"u"){var P=["Could not find a path from ",o," to ",n,"."].join("");throw new Error(P)}return t},extract_shortest_path_from_predecessor_list:function(a,o){for(var n=[],t=o;t;)n.push(t),a[t],t=a[t];return n.reverse(),n},find_path:function(a,o,n){var t=s.single_source_shortest_paths(a,o,n);return s.extract_shortest_path_from_predecessor_list(t,n)},PriorityQueue:{make:function(a){var o=s.PriorityQueue,n={},t;a=a||{};for(t in o)o.hasOwnProperty(t)&&(n[t]=o[t]);return n.queue=[],n.sorter=a.sorter||o.default_sorter,n},default_sorter:function(a,o){return a.cost-o.cost},push:function(a,o){var n={value:a,cost:o};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};i.exports=s})(Ut)),Ut.exports}var Rn;function Xr(){return Rn||(Rn=1,(function(i){const s=Me(),a=Yr(),o=Kr(),n=Jr(),t=Qr(),c=Un(),d=Be(),l=Wr();function u(P){return unescape(encodeURIComponent(P)).length}function f(P,M,D){const E=[];let H;for(;(H=P.exec(D))!==null;)E.push({data:H[0],index:H.index,mode:M,length:H[0].length});return E}function S(P){const M=f(c.NUMERIC,s.NUMERIC,P),D=f(c.ALPHANUMERIC,s.ALPHANUMERIC,P);let E,H;return d.isKanjiModeEnabled()?(E=f(c.BYTE,s.BYTE,P),H=f(c.KANJI,s.KANJI,P)):(E=f(c.BYTE_KANJI,s.BYTE,P),H=[]),M.concat(D,E,H).sort(function(g,p){return g.index-p.index}).map(function(g){return{data:g.data,mode:g.mode,length:g.length}})}function v(P,M){switch(M){case s.NUMERIC:return a.getBitsLength(P);case s.ALPHANUMERIC:return o.getBitsLength(P);case s.KANJI:return t.getBitsLength(P);case s.BYTE:return n.getBitsLength(P)}}function m(P){return P.reduce(function(M,D){const E=M.length-1>=0?M[M.length-1]:null;return E&&E.mode===D.mode?(M[M.length-1].data+=D.data,M):(M.push(D),M)},[])}function j(P){const M=[];for(let D=0;D<P.length;D++){const E=P[D];switch(E.mode){case s.NUMERIC:M.push([E,{data:E.data,mode:s.ALPHANUMERIC,length:E.length},{data:E.data,mode:s.BYTE,length:E.length}]);break;case s.ALPHANUMERIC:M.push([E,{data:E.data,mode:s.BYTE,length:E.length}]);break;case s.KANJI:M.push([E,{data:E.data,mode:s.BYTE,length:u(E.data)}]);break;case s.BYTE:M.push([{data:E.data,mode:s.BYTE,length:u(E.data)}])}}return M}function B(P,M){const D={},E={start:{}};let H=["start"];for(let C=0;C<P.length;C++){const g=P[C],p=[];for(let h=0;h<g.length;h++){const b=g[h],y=""+C+h;p.push(y),D[y]={node:b,lastCount:0},E[y]={};for(let A=0;A<H.length;A++){const N=H[A];D[N]&&D[N].node.mode===b.mode?(E[N][y]=v(D[N].lastCount+b.length,b.mode)-v(D[N].lastCount,b.mode),D[N].lastCount+=b.length):(D[N]&&(D[N].lastCount=b.length),E[N][y]=v(b.length,b.mode)+4+s.getCharCountIndicator(b.mode,M))}}H=p}for(let C=0;C<H.length;C++)E[H[C]].end=0;return{map:E,table:D}}function O(P,M){let D;const E=s.getBestModeForData(P);if(D=s.from(M,E),D!==s.BYTE&&D.bit<E.bit)throw new Error('"'+P+'" cannot be encoded with mode '+s.toString(D)+`.
 Suggested mode is: `+s.toString(E));switch(D===s.KANJI&&!d.isKanjiModeEnabled()&&(D=s.BYTE),D){case s.NUMERIC:return new a(P);case s.ALPHANUMERIC:return new o(P);case s.KANJI:return new t(P);case s.BYTE:return new n(P)}}i.fromArray=function(M){return M.reduce(function(D,E){return typeof E=="string"?D.push(O(E,null)):E.data&&D.push(O(E.data,E.mode)),D},[])},i.fromString=function(M,D){const E=S(M,d.isKanjiModeEnabled()),H=j(E),C=B(H,D),g=l.find_path(C.map,"start","end"),p=[];for(let h=1;h<g.length-1;h++)p.push(C.table[g[h]].node);return i.fromArray(m(p))},i.rawSplit=function(M){return i.fromArray(S(M,d.isKanjiModeEnabled()))}})(Lt)),Lt}var Sn;function Zr(){if(Sn)return At;Sn=1;const i=Be(),s=zt(),a=Fr(),o=Or(),n=_r(),t=Ur(),c=Vr(),d=On(),l=zr(),u=$r(),f=Gr(),S=Me(),v=Xr();function m(C,g){const p=C.size,h=t.getPositions(g);for(let b=0;b<h.length;b++){const y=h[b][0],A=h[b][1];for(let N=-1;N<=7;N++)if(!(y+N<=-1||p<=y+N))for(let T=-1;T<=7;T++)A+T<=-1||p<=A+T||(N>=0&&N<=6&&(T===0||T===6)||T>=0&&T<=6&&(N===0||N===6)||N>=2&&N<=4&&T>=2&&T<=4?C.set(y+N,A+T,!0,!0):C.set(y+N,A+T,!1,!0))}}function j(C){const g=C.size;for(let p=8;p<g-8;p++){const h=p%2===0;C.set(p,6,h,!0),C.set(6,p,h,!0)}}function B(C,g){const p=n.getPositions(g);for(let h=0;h<p.length;h++){const b=p[h][0],y=p[h][1];for(let A=-2;A<=2;A++)for(let N=-2;N<=2;N++)A===-2||A===2||N===-2||N===2||A===0&&N===0?C.set(b+A,y+N,!0,!0):C.set(b+A,y+N,!1,!0)}}function O(C,g){const p=C.size,h=u.getEncodedBits(g);let b,y,A;for(let N=0;N<18;N++)b=Math.floor(N/3),y=N%3+p-8-3,A=(h>>N&1)===1,C.set(b,y,A,!0),C.set(y,b,A,!0)}function P(C,g,p){const h=C.size,b=f.getEncodedBits(g,p);let y,A;for(y=0;y<15;y++)A=(b>>y&1)===1,y<6?C.set(y,8,A,!0):y<8?C.set(y+1,8,A,!0):C.set(h-15+y,8,A,!0),y<8?C.set(8,h-y-1,A,!0):y<9?C.set(8,15-y-1+1,A,!0):C.set(8,15-y-1,A,!0);C.set(h-8,8,1,!0)}function M(C,g){const p=C.size;let h=-1,b=p-1,y=7,A=0;for(let N=p-1;N>0;N-=2)for(N===6&&N--;;){for(let T=0;T<2;T++)if(!C.isReserved(b,N-T)){let ne=!1;A<g.length&&(ne=(g[A]>>>y&1)===1),C.set(b,N-T,ne),y--,y===-1&&(A++,y=7)}if(b+=h,b<0||p<=b){b-=h,h=-h;break}}}function D(C,g,p){const h=new a;p.forEach(function(T){h.put(T.mode.bit,4),h.put(T.getLength(),S.getCharCountIndicator(T.mode,C)),T.write(h)});const b=i.getSymbolTotalCodewords(C),y=d.getTotalCodewordsCount(C,g),A=(b-y)*8;for(h.getLengthInBits()+4<=A&&h.put(0,4);h.getLengthInBits()%8!==0;)h.putBit(0);const N=(A-h.getLengthInBits())/8;for(let T=0;T<N;T++)h.put(T%2?17:236,8);return E(h,C,g)}function E(C,g,p){const h=i.getSymbolTotalCodewords(g),b=d.getTotalCodewordsCount(g,p),y=h-b,A=d.getBlocksCount(g,p),N=h%A,T=A-N,ne=Math.floor(h/A),Y=Math.floor(y/A),ye=Y+1,Ce=ne-Y,ut=new l(Ce);let Le=0;const we=new Array(A),He=new Array(A);let $=0;const mt=new Uint8Array(C.buffer);for(let ae=0;ae<A;ae++){const de=ae<T?Y:ye;we[ae]=mt.slice(Le,Le+de),He[ae]=ut.encode(we[ae]),Le+=de,$=Math.max($,de)}const qe=new Uint8Array(h);let G=0,ce,le;for(ce=0;ce<$;ce++)for(le=0;le<A;le++)ce<we[le].length&&(qe[G++]=we[le][ce]);for(ce=0;ce<Ce;ce++)for(le=0;le<A;le++)qe[G++]=He[le][ce];return qe}function H(C,g,p,h){let b;if(Array.isArray(C))b=v.fromArray(C);else if(typeof C=="string"){let ne=g;if(!ne){const Y=v.rawSplit(C);ne=u.getBestVersionForData(Y,p)}b=v.fromString(C,ne||40)}else throw new Error("Invalid data");const y=u.getBestVersionForData(b,p);if(!y)throw new Error("The amount of data is too big to be stored in a QR Code");if(!g)g=y;else if(g<y)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+y+`.
`);const A=D(g,p,b),N=i.getSymbolSize(g),T=new o(N);return m(T,g),j(T),B(T,g),P(T,p,0),g>=7&&O(T,g),M(T,A),isNaN(h)&&(h=c.getBestMask(T,P.bind(null,T,p))),c.applyMask(h,T),P(T,p,h),{modules:T,version:g,errorCorrectionLevel:p,maskPattern:h,segments:b}}return At.create=function(g,p){if(typeof g>"u"||g==="")throw new Error("No input text");let h=s.M,b,y;return typeof p<"u"&&(h=s.from(p.errorCorrectionLevel,s.M),b=u.from(p.version),y=c.from(p.maskPattern),p.toSJISFunc&&i.setToSJISFunction(p.toSJISFunc)),H(g,b,h,y)},At}var Vt={},Ht={},jn;function Vn(){return jn||(jn=1,(function(i){function s(a){if(typeof a=="number"&&(a=a.toString()),typeof a!="string")throw new Error("Color should be defined as hex string");let o=a.slice().replace("#","").split("");if(o.length<3||o.length===5||o.length>8)throw new Error("Invalid hex color: "+a);(o.length===3||o.length===4)&&(o=Array.prototype.concat.apply([],o.map(function(t){return[t,t]}))),o.length===6&&o.push("F","F");const n=parseInt(o.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+o.slice(0,6).join("")}}i.getOptions=function(o){o||(o={}),o.color||(o.color={});const n=typeof o.margin>"u"||o.margin===null||o.margin<0?4:o.margin,t=o.width&&o.width>=21?o.width:void 0,c=o.scale||4;return{width:t,scale:t?4:c,margin:n,color:{dark:s(o.color.dark||"#000000ff"),light:s(o.color.light||"#ffffffff")},type:o.type,rendererOpts:o.rendererOpts||{}}},i.getScale=function(o,n){return n.width&&n.width>=o+n.margin*2?n.width/(o+n.margin*2):n.scale},i.getImageWidth=function(o,n){const t=i.getScale(o,n);return Math.floor((o+n.margin*2)*t)},i.qrToImageData=function(o,n,t){const c=n.modules.size,d=n.modules.data,l=i.getScale(c,t),u=Math.floor((c+t.margin*2)*l),f=t.margin*l,S=[t.color.light,t.color.dark];for(let v=0;v<u;v++)for(let m=0;m<u;m++){let j=(v*u+m)*4,B=t.color.light;if(v>=f&&m>=f&&v<u-f&&m<u-f){const O=Math.floor((v-f)/l),P=Math.floor((m-f)/l);B=S[d[O*c+P]?1:0]}o[j++]=B.r,o[j++]=B.g,o[j++]=B.b,o[j]=B.a}}})(Ht)),Ht}var Pn;function eo(){return Pn||(Pn=1,(function(i){const s=Vn();function a(n,t,c){n.clearRect(0,0,t.width,t.height),t.style||(t.style={}),t.height=c,t.width=c,t.style.height=c+"px",t.style.width=c+"px"}function o(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}i.render=function(t,c,d){let l=d,u=c;typeof l>"u"&&(!c||!c.getContext)&&(l=c,c=void 0),c||(u=o()),l=s.getOptions(l);const f=s.getImageWidth(t.modules.size,l),S=u.getContext("2d"),v=S.createImageData(f,f);return s.qrToImageData(v.data,t,l),a(S,u,f),S.putImageData(v,0,0),u},i.renderToDataURL=function(t,c,d){let l=d;typeof l>"u"&&(!c||!c.getContext)&&(l=c,c=void 0),l||(l={});const u=i.render(t,c,l),f=l.type||"image/png",S=l.rendererOpts||{};return u.toDataURL(f,S.quality)}})(Vt)),Vt}var qt={},In;function to(){if(In)return qt;In=1;const i=Vn();function s(n,t){const c=n.a/255,d=t+'="'+n.hex+'"';return c<1?d+" "+t+'-opacity="'+c.toFixed(2).slice(1)+'"':d}function a(n,t,c){let d=n+t;return typeof c<"u"&&(d+=" "+c),d}function o(n,t,c){let d="",l=0,u=!1,f=0;for(let S=0;S<n.length;S++){const v=Math.floor(S%t),m=Math.floor(S/t);!v&&!u&&(u=!0),n[S]?(f++,S>0&&v>0&&n[S-1]||(d+=u?a("M",v+c,.5+m+c):a("m",l,0),l=0,u=!1),v+1<t&&n[S+1]||(d+=a("h",f),f=0)):l++}return d}return qt.render=function(t,c,d){const l=i.getOptions(c),u=t.modules.size,f=t.modules.data,S=u+l.margin*2,v=l.color.light.a?"<path "+s(l.color.light,"fill")+' d="M0 0h'+S+"v"+S+'H0z"/>':"",m="<path "+s(l.color.dark,"stroke")+' d="'+o(f,u,l.margin)+'"/>',j='viewBox="0 0 '+S+" "+S+'"',O='<svg xmlns="http://www.w3.org/2000/svg" '+(l.width?'width="'+l.width+'" height="'+l.width+'" ':"")+j+' shape-rendering="crispEdges">'+v+m+`</svg>
`;return typeof d=="function"&&d(null,O),O},qt}var Dn;function no(){if(Dn)return Ve;Dn=1;const i=kr(),s=Zr(),a=eo(),o=to();function n(t,c,d,l,u){const f=[].slice.call(arguments,1),S=f.length,v=typeof f[S-1]=="function";if(!v&&!i())throw new Error("Callback required as last argument");if(v){if(S<2)throw new Error("Too few arguments provided");S===2?(u=d,d=c,c=l=void 0):S===3&&(c.getContext&&typeof u>"u"?(u=l,l=void 0):(u=l,l=d,d=c,c=void 0))}else{if(S<1)throw new Error("Too few arguments provided");return S===1?(d=c,c=l=void 0):S===2&&!c.getContext&&(l=d,d=c,c=void 0),new Promise(function(m,j){try{const B=s.create(d,l);m(t(B,c,l))}catch(B){j(B)}})}try{const m=s.create(d,l);u(null,t(m,c,l))}catch(m){u(m)}}return Ve.create=s.create,Ve.toCanvas=n.bind(null,a.render),Ve.toDataURL=n.bind(null,a.renderToDataURL),Ve.toString=n.bind(null,function(t,c,d){return o.render(t,d)}),Ve}var ro=no();const oo=ar(ro);function Qo(){const[i,s]=F.useState(0),[a,o]=F.useState(!1),[n,t]=F.useState(null),[c,d]=F.useState([]),[l,u]=F.useState([]),[f,S]=F.useState([]),[v,m]=F.useState(""),[j,B]=F.useState(!0),[O,P]=F.useState(null),[M,D]=F.useState(null),[E,H]=F.useState(null),[C,g]=F.useState(""),[p,h]=F.useState({}),[b,y]=F.useState([]),[A,N]=F.useState(!1),[T,ne]=F.useState(null),[Y,ye]=F.useState(null),[Ce,ut]=F.useState(""),[Le,we]=F.useState(!1),[He,$]=F.useState(""),[mt,qe]=F.useState([]),{permissions:G=[],user:ce}=cr(),le=ce?.branchAccess==="ALL",ae=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.VIEW),de=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.CREATE),Ee=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.VIEW,se.RECEIPTS.CUSTOMER),Te=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.VIEW,se.RECEIPTS.PAYMENT_VERIFICATION),ke=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.VIEW,se.RECEIPTS.COMPLETE_PAYMENT),Fe=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.VIEW,se.RECEIPTS.PENDING_LIST),Re=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.VIEW,se.RECEIPTS.VERIFIED_LIST),ze=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.CREATE,se.RECEIPTS.CUSTOMER),$e=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.CREATE,se.RECEIPTS.PAYMENT_VERIFICATION),Hn=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.CREATE,se.RECEIPTS.COMPLETE_PAYMENT),qn=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.CREATE,se.RECEIPTS.PENDING_LIST),zn=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.CREATE,se.RECEIPTS.VERIFIED_LIST);J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.UPDATE,se.RECEIPTS.CUSTOMER),J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.UPDATE,se.RECEIPTS.PAYMENT_VERIFICATION);const vt=J(G,X.ACCOUNT,W.ACCOUNT.RECEIPTS,Q.VIEW,se.RECEIPTS.CUSTOMER)||Ee,Ae=Ee||Te||ke||Fe||Re;F.useEffect(()=>{if(!Ae)return;const r=[];Ee&&r.push(0),Te&&r.push(1),ke&&r.push(2),Fe&&r.push(3),Re&&r.push(4),r.length>0&&!r.includes(i)&&s(r[0])},[Ae,Ee,Te,ke,Fe,Re,i]),F.useEffect(()=>{if(!ae){ie("You do not have permission to view Receipts"),B(!1);return}if(!Ae){ie("You do not have permission to view any Receipt tabs"),B(!1);return}Yn(),$t(),Gt(),$n(),Gn()},[ae,Ae]),F.useEffect(()=>(window.printReceiptCallback=en,()=>{delete window.printReceiptCallback}),[]);const $n=async()=>{try{const r=["/cash-locations","/cashlocations","/settings/cash-locations","/master/cash-locations"];for(const w of r)try{const U=await ee.get(w);if(U.data.success&&U.data.data){y(U.data.data),console.log("Cash locations loaded:",U.data.data);return}}catch{console.log(`Endpoint ${w} not available`)}console.warn("Could not fetch cash locations from any endpoint"),y([])}catch(r){console.error("Error fetching cash locations:",r),y([])}},Gn=async()=>{try{const r=await ee.get("/branches");qe(r.data.data)}catch(r){const w=ie(r);w&&P(w)}},Yn=async()=>{try{B(!0);const w=(await ee.get("/bookings")).data.data.bookings.filter(k=>k.bookingType==="BRANCH");d(w);const U=w.map(async k=>{try{const x=await ee.get(`/ledger/booking/${k._id}`);return{bookingId:k._id,receipts:x.data.data.allReceipts||[]}}catch(x){return console.error(`Error fetching receipts for booking ${k._id}:`,x),{bookingId:k._id,receipts:[]}}}),L=await Promise.all(U),V={};L.forEach(k=>{V[k.bookingId]=k.receipts}),h(V)}catch(r){const w=ie(r);w&&P(w)}finally{B(!1)}},$t=async()=>{if(!(!ae||!Te))try{const r=await ee.get("/ledger/pending");u(r.data.data.ledgerEntries)}catch(r){const w=ie(r);w&&P(w)}},Gt=async()=>{if(!(!ae||!Re))try{const r=await ee.get("/payment/verified/bank/ledger");S(r.data.data.ledgerEntries)}catch(r){const w=ie(r);w&&P(w)}},Yt=r=>{if(!r)return"";const w=String(r.getDate()).padStart(2,"0"),U=String(r.getMonth()+1).padStart(2,"0"),L=r.getFullYear();return`${w}-${U}-${L}`},Kt=r=>{if(!r)return"";const w=r.getFullYear(),U=String(r.getMonth()+1).padStart(2,"0"),L=String(r.getDate()).padStart(2,"0");return`${w}-${U}-${L}`},Ge=(r,w)=>{if(!w)return r;const U=mr("receipts"),L=w.toLowerCase();return r.filter(V=>U.some(k=>{const x=k.split(".").reduce((_,z)=>_?z.match(/^\d+$/)?_[parseInt(z)]:_[z]:"",V);return x==null?!1:typeof x=="boolean"?(x?"yes":"no").includes(L):k==="createdAt"&&x instanceof Date?x.toLocaleDateString("en-GB").includes(L):typeof x=="number"?String(x).includes(L):String(x).toLowerCase().includes(L)}))},Jt=Ge(c,v),Qt=Ge(c.filter(r=>parseFloat(r.balanceAmount||0)===0),v),Wt=Ge(c.filter(r=>parseFloat(r.balanceAmount||0)!==0),v),Xt=Ge(l,v),Zt=Ge(f,v),Kn=(r,w)=>{D(r.currentTarget),H(w)},xt=()=>{D(null),H(null)},Jn=r=>{if(!ze){ie("You do not have permission to add payments");return}t(r),o(!0),xt()},Qn=async r=>{if(!$e){ie("You do not have permission to verify payments");return}try{(await lr({title:"Confirm Payment Verification",text:`Are you sure you want to verify the payment of ₹${r.amount} for booking ${r.bookingDetails?.bookingNumber||r.booking}?`,confirmButtonText:"Yes, verify it!"})).isConfirmed&&(await ee.patch(`/ledger/approve/${r._id}`,{remark:""}),g("Payment verified successfully!"),setTimeout(()=>g(""),3e3),$t(),Gt())}catch(w){console.error("Error verifying payment:",w),ie(w,"Failed to verify payment")}},Ye=r=>{Ae&&(s(r),m(""))},Wn=()=>{if(!de){ie("You do not have permission to export data");return}N(!0),$("")},bt=()=>{N(!1),ne(null),ye(null),ut(""),$("")},Xn=async()=>{if(!de){ie("You do not have permission to export data");return}if($(""),!Ce){$("Please select a branch");return}if(!T||!Y){$("Please select both start and end dates");return}if(T>Y){$("Start date cannot be after end date");return}try{we(!0);const r=Kt(T),w=Kt(Y),U=new URLSearchParams({branchId:Ce,startDate:r,endDate:w,format:"excel"}),L=await ee.get(`/reports/receipts?${U.toString()}`,{responseType:"blob"}),V=L.headers["content-type"];if(V&&V.includes("application/json")){const Se=await new Promise((Oe,je)=>{const me=new FileReader;me.onload=()=>Oe(me.result),me.onerror=je,me.readAsText(L.data)}),be=JSON.parse(Se);if(!be.success&&be.message){$(be.message),Ie.fire({icon:"error",title:"Export Failed",text:be.message});return}}const k=new Blob([L.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),x=window.URL.createObjectURL(k),_=document.createElement("a");_.href=x;const z=mt.find(Se=>Se._id===Ce)?.name||"Branch",re=Yt(T),K=Yt(Y),ue=`Receipts_${z}_${re}_to_${K}.xlsx`;_.setAttribute("download",ue),document.body.appendChild(_),_.click(),_.remove(),window.URL.revokeObjectURL(x),Ie.fire({toast:!0,position:"top-end",icon:"success",title:"Excel exported successfully!",showConfirmButton:!1,timer:3e3,timerProgressBar:!0}),bt()}catch(r){if(console.error("Error exporting report:",r),r.response&&r.response.data instanceof Blob)try{const w=await new Promise((L,V)=>{const k=new FileReader;k.onload=()=>L(k.result),k.onerror=V,k.readAsText(r.response.data)}),U=JSON.parse(w);U.message&&($(U.message),Ie.fire({icon:"error",title:"Export Failed",text:U.message}))}catch(w){console.error("Error parsing error response:",w),$("Failed to export report"),Ie.fire({icon:"error",title:"Export Failed",text:"Failed to export report"})}else r.response?.data?.message?($(r.response.data.message),Ie.fire({icon:"error",title:"Export Failed",text:r.response.data.message})):r.message?($(r.message),Ie.fire({icon:"error",title:"Export Failed",text:r.message})):($("Failed to export report"),Ie.fire({icon:"error",title:"Export Failed",text:"Failed to export report"}))}finally{we(!1)}},en=async(r,w,U=0)=>{if(!vt){ie("You do not have permission to print invoices");return}try{const V=(await ee.get(`/ledger/receipt/${r}`)).data.data.receipt,k=await ee.get(`/bookings/booking-payment-status/${w}`),x=k.data.data.bookingDetails,_=k.data.data.finalStatus||"",z=V.qrCodeData||{},re=x.subsidyAmount||0,K=x.model?.type==="EV",ue=x.priceComponents||[],be=ue.filter(oe=>{const pe=oe.header?.header_key?.toUpperCase()||"",_e=/INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES/i.test(pe),Ue=/RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(pe),ht=/HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(pe);return!(_e||Ue||ht)}).reduce((oe,pe)=>oe+(pe.discountedValue||0),0),Oe=oe=>ue.find(pe=>{const _e=pe.header?.header_key?.toUpperCase()||"";return oe.some(Ue=>_e.includes(Ue))}),je=Oe(["INSURANCE","INSURCANCE","INSURANCE CHARGES","INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS"]),me=je?je.originalValue:0,Ke=Oe(["RTO","RTO TAX & REGISTRATION CHARGES"]),Je=Ke?Ke.originalValue:0,Qe=Oe(["HYPOTHECATION","HPA","HPA (if applicable)"]),We=Qe?Qe.originalValue:x.hypothecationCharges||0,Xe=me+Je+We,Ze=K&&re>0?re:0,et=be+Xe-Ze,tt=`GANDHI MOTORS PVT LTD
Booking Number: ${z.bookingNumber||x.bookingNumber}
Customer: ${z.customerName||x.customerDetails?.name}
Mobile: ${z.mobileNo||x.customerDetails?.mobile1}
Model: ${z.modelName||x.model?.model_name}
Type: ${x.model?.type||"N/A"}
Chassis: ${z.chassisNo||x.chassisNumber||"Not allocated"}
Payment Type: ${z.paymentType||x.payment?.type}
Total Amount: ₹${et.toFixed(2)}
${K&&re>0?`Subsidy: -₹${re.toFixed(2)}`:""}
Receipt: ${V.receiptNumber||"N/A"}
Amount: ${V.display?.amount||`₹${V.amount?.toFixed(2)||"0"}`}
Payment Mode: ${V.paymentMode||"Cash"}
Reference: ${V.transactionReference||"N/A"}
Date: ${new Date(V.receiptDate).toLocaleDateString("en-GB")}`;let nt="";try{nt=await oo.toDataURL(tt,{width:250,margin:3,color:{dark:"#000000",light:"#FFFFFF"},errorCorrectionLevel:"H"})}catch(oe){console.error("Error generating QR code:",oe),nt="data:image/svg+xml;base64,"+btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250">
          <rect width="250" height="250" fill="white"/>
          <rect x="20" y="20" width="210" height="210" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
          <text x="125" y="115" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">QR CODE</text>
          <text x="125" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">Receipt: ${V.receiptNumber}</text>
          <text x="125" y="160" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">Scan for details</text>
        </svg>
      `)}const q={bookingNumber:x.bookingNumber,bookingType:x.bookingType,rto:x.rto,hpa:x.hpa,hypothecationCharges:x.hypothecationCharges||0,gstin:x.gstin||"",model:{model_name:x.model?.model_name||"N/A",type:x.model?.type||"N/A"},chassisNumber:z.chassisNo||x.chassisNumber,engineNumber:x.vehicle?.engineNumber||x.engineNumber,batteryNumber:x.vehicle?.batteryNumber||"",keyNumber:x.vehicle?.keyNumber||"",color:{name:x.color?.name||""},customerDetails:{name:x.customerDetails?.name||"N/A",address:x.customerDetails?.address||"",taluka:x.customerDetails?.taluka||"",district:x.customerDetails?.district||"",pincode:x.customerDetails?.pincode||"",mobile1:x.customerDetails?.mobile1||"",dob:x.customerDetails?.dob||"",aadharNumber:x.customerDetails?.aadharNumber||""},exchange:x.exchange,exchangeDetails:x.exchangeDetails,payment:{type:x.payment?.type||"CASH",financer:x.payment?.financer},salesExecutive:x.salesExecutive,branch:{gst_number:x.branch?.gst_number||""},accessories:x.accessories||[],priceComponents:x.priceComponents||[],subdealer:x.subdealer||"",receivedAmount:x.receivedAmount||0,finalStatus:_||"",recentPayment:V,qrCodeData:z,qrCodeImage:nt,qrCodeText:tt,recentPaymentAmount:V.amount||0,bookingDetails:x,subsidyAmount:re,calculatedTotals:{totalA:be,totalB:Xe,grandTotal:et,insuranceCharges:me,rtoCharges:Je,hpCharges:We,subsidyDisplay:Ze}},Pe=Zn(q,U===0),ge=window.open("","_blank");ge.document.write(Pe),ge.document.close(),ge.onload=function(){ge.focus(),ge.print()}}catch(L){console.error("Error generating receipt invoice:",L),ie(L,"Failed to generate receipt invoice")}},Zn=(r,w=!0)=>{const U=r.exchange&&r.exchangeDetails?.broker?.name||"",L=r.exchange&&r.exchangeDetails?.vehicleNumber||"",V=new Date().toLocaleDateString("en-GB"),k=r.recentPayment?.receiptDate?new Date(r.recentPayment.receiptDate).toLocaleDateString("en-GB"):V,x=r.recentPaymentAmount||0,_=r.recentPayment?.transactionReference||"-",z=Lr(x),re=r.recentPayment?.paymentMode||"-",K=r.recentPayment?.receiptNumber||"-";r.qrCodeData;const ue=r.qrCodeImage||"",Se=r.bookingDetails?.subsidyAmount||r.subsidyAmount||0,be=r.bookingDetails?.model?.type==="EV"||r.model?.type==="EV";if(w){const je=r.priceComponents.filter(q=>{const he=q.header?.header_key?.toUpperCase()||"",Pe=/INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES/i.test(he),ge=/RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(he),oe=/HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(he);return!(Pe||ge||oe)}).map(q=>{const he=parseFloat(q.header?.metadata?.gst_rate)||0,Pe=q.originalValue,ge=0,oe=q.originalValue,pe=oe*100/(100+he),_e=oe-pe,Ue=_e/2,ht=_e/2,ir=Ue+ht;return{...q,unitCost:Pe,taxableValue:pe,cgstAmount:Ue,sgstAmount:ht,gstAmount:ir,gstRatePercentage:he,discount:ge,lineTotal:oe}}),me=q=>r.priceComponents.find(he=>{const Pe=he.header?.header_key?.toUpperCase()||"";return q.some(ge=>Pe.includes(ge))}),Ke=me(["INSURANCE","INSURCANCE","INSURANCE CHARGES","INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS"]),Je=Ke?Ke.originalValue:0,Qe=me(["RTO","RTO TAX & REGISTRATION CHARGES"]),We=Qe?Qe.originalValue:0,Xe=me(["HYPOTHECATION","HPA","HPA (if applicable)"]),Ze=Xe?Xe.originalValue:r.hypothecationCharges||0,et=je.reduce((q,he)=>q+he.lineTotal,0),tt=Je+We+Ze,nt=et+tt;return`
<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt - ${K}</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 10mm;
      font-size: 14px;
      color: #555555;
    }
    .page {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      align-items: flex-start;
    }
    .header-left {
      width: 60%;
    }
    .header-right {
      width: 40%;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .logo-qr-container {
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: flex-end;
      margin-bottom: 10px;
      width: 100%;
    }
    .logo {
      height: 80px;
    }
    .qr-code-extra-big {
      width: 150px;
      height: 150px;
      border: 1px solid #ccc;
    }
    .dealer-info {
      text-align: left;
      font-size: 14px;
      line-height: 1.2;
    }
    .customer-info-container {
      display: flex;
      font-size:14px;
    }

    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
      width: 50%;
    }
    .customer-info-row {
      margin: 1mm 0;
      line-height: 1.2;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin: 2mm 0;
    }
    th, td {
      padding: 1mm;
      border: 1px solid #000;
      vertical-align: top;
    }
    .no-border { 
      border: none !important; 
      font-size:14px;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .bold { 
      font-weight: bold; 
    }
    .section-title {
      font-weight: bold;
      margin: 1mm 0;
    }
    .signature-box {
      margin-top: 5mm;
      font-size: 9pt;
    }
    .signature-line {
      border-top: 1px dashed #000;
      width: 40mm;
      display: inline-block;
      margin: 0 5mm;
    }
    .footer {
      font-size: 8pt;
      text-align: justify;
      line-height: 1.2;
      margin-top: 3mm;
    }
    .divider {
      border-top: 2px solid #AAAAAA;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      margin: 2mm 0;
    }
    .totals-table td {
      border: none;
      padding: 1mm;
    }
    .total-divider {
      border-top: 2px solid #AAAAAA;
      height: 1px;
      margin: 2px 0;
    }
    .broker-info{
      display:flex;
      justify-content:space-between;
      padding:1px;
    }
    .status-box {
      background-color: #e8f5e8;
      border: 2px solid #c3e6c3;
      border-radius: 4px;
      padding: 15px;
      margin: 10px 0;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      color: #495057;
    }
    .payment-info-title {
      font-weight: bold;
      margin-bottom: 5px;
      color: #155724;
      font-size: 16px;
    }
    .amount-in-words {
      font-style: italic;
      margin-top: 5px;
      color: #333;
      padding: 5px;
    }

    .note{
      padding:1px;
      margin:2px;
    }
    
    /* QR Code at bottom - even bigger */
    .qr-bottom-section {
      margin-top: 10mm;
      text-align: center;
      page-break-inside: avoid;
    }
    .qr-bottom-big {
      width: 180px;
      height: 180px;
      border: 1px solid #ccc;
      margin: 0 auto;
      display: block;
    }
    .qr-scan-text {
      font-size: 10pt;
      color: #777;
      margin-top: 3mm;
    }
    
    .receipt-info {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        padding: 5mm;
      }
      .qr-bottom-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header Section with QR Code -->
    <div class="header-container">
      <div class="header-left">
        <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
        <div class="dealer-info">
          Authorized Main Dealer: TVS Motor Company Ltd.<br>
          Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
          Upnagar, Nashik Road, Nashik, 7498993672<br>
          GSTIN: ${r.branch?.gst_number||""}<br>
          GANDHI TVS PIMPALGAON
        </div>
      </div>
      <div class="header-right">
        <!-- Logo and QR code side by side -->
        <div class="logo-qr-container">
          <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
          ${ue?`<img src="${ue}" class="qr-code-extra-big" alt="QR Code" />`:""}
        </div>
        
        <div style="margin-top: 5px; font-size: 13px;">Date: ${k}</div>
        <div style="margin-top: 5px; font-size: 13px;"><strong>Receipt No:</strong> ${K}</div>

        ${r.bookingType==="SUBDEALER"?`<div style="font-size: 12px;"><b>Subdealer:</b> ${r.subdealer?.name||""}</div>
        <div style="font-size: 11px;"><b>Address:</b> ${r.subdealer?.location||""}</div>
          
          `:""}
        
      </div>
    </div>
    <div class="divider"></div>

    <!-- Receipt Information -->
    <div class="receipt-info">
      <div><strong>Payment Receipt</strong></div>
      <div><strong>Booking Number:</strong> ${r.bookingNumber}</div>
      <div><strong>Receipt Date:</strong> ${k}</div>
    </div>

    <!-- Customer Information -->
    <div class="customer-info-container">
      <div class="customer-info-left">
        <div class="customer-info-row"><strong>Booking Number:</strong> ${r.bookingNumber}</div>
        <div class="customer-info-row"><strong>Customer Name:</strong> ${r.customerDetails.name}</div>
        <div class="customer-info-row"><strong>Address:</strong> ${r.customerDetails.address}, ${r.customerDetails.taluka},${r.customerDetails.pincode||""}</div>
        <div class="customer-info-row"><strong>Mobile No.:</strong> ${r.customerDetails.mobile1}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${r.hpa?"YES":"NO"}</div>
      </div>
      <div class="customer-info-right">
        <div class="customer-info-row"><strong>Model Name:</strong> ${r.model.model_name}</div>
       <div class="customer-info-row"><strong>Chassis No:</strong> ${r.chassisNumber}</div>
        <div class="customer-info-row"><strong>Payment Type:</strong> ${r.payment?.type||"CASH"}</div>
         <div class="customer-info-row"><strong>Financer:</strong> ${r.payment?.financer?.name||""}</div>
        <div class="customer-info-row"><strong>Sales Executive:</strong> ${r.salesExecutive?.name||"N/A"}</div>
      </div>
    </div>

    <!-- Received Amount Section -->
    <div class="payment-info-box">
      <div class="receipt-info">
        <div><strong>Receipt Amount (Rs):</strong> ₹${r.recentPaymentAmount.toFixed(2)}</div>
        <div><strong>Receipt Number:</strong> ${K}</div>
        <div><strong>Reference No:</strong> ${_}</div>
        <div><strong>Payment Mode:</strong> ${re}</div>
        <div><strong>Receipt Date:</strong> ${k}</div>
      </div>
      <div class="amount-in-words">
        <strong>(In Words):</strong> ${z} Only
      </div>
    </div>
    <!-- Price Breakdown Table -->
    <table>
      <tr>
        <th style="width:25%">Particulars</th>
        <th style="width:8%">HSN CODE</th>
        <th style="width:8%">Unit Cost</th>
        <th style="width:8%">Taxable</th>
        <th style="width:5%">CGST</th>
        <th style="width:8%">CGST AMOUNT</th>
        <th style="width:5%">SGST</th>
        <th style="width:8%">SGST AMOUNT</th>
        <th style="width:7%">DISCOUNT</th>
        <th style="width:10%">LINE TOTAL</th>
      </tr>

      ${je.map(q=>`
        <tr>
          <td>${q.header?.header_key||""}</td>
          <td>${q.header?.metadata?.hsn_code||""}</td>
          <td >${q.unitCost.toFixed(2)}</td>
          <td >${q.taxableValue.toFixed(2)}</td>
          <td >${(q.gstRatePercentage/2).toFixed(2)}%</td>
          <td >${q.cgstAmount.toFixed(2)}</td>
          <td >${(q.gstRatePercentage/2).toFixed(2)}%</td>
          <td >${q.sgstAmount.toFixed(2)}</td>
          <td >${q.discount.toFixed(2)}</td>
          <td >${q.lineTotal.toFixed(2)}</td>
        </tr>
      `).join("")}
    </table>

    <!-- Totals Section - No Borders -->
     <table class="totals-table">
      <tr>
        <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
        <td class="no-border text-right"><strong>${et.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
        <td class="no-border text-right"><strong>${Je.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
        <td class="no-border text-right"><strong>${We.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>HP CHARGES</strong></td>
        <td class="no-border text-right"><strong>${Ze.toFixed(2)}</strong></td>
      </tr>
        ${be&&Se>0?`
      <tr>
        <td class="no-border"><strong>SUBSIDY AMOUNT</strong></td>
        <td class="no-border text-right" style="color: green;"><strong>-${Se.toFixed(2)}</strong></td>
      </tr>
      `:""}
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>TOTAL(B)</strong></td>
        <td class="no-border text-right"><strong>${tt.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
        <td class="no-border text-right"><strong>${nt.toFixed(2)}</strong></td>
      </tr>
    </table>
    <div class="broker-info">
      <div><strong>Ex. Broker/ Sub Dealer:</strong>${U}</div>
      <div><strong>Ex. Veh No:</strong>${L}</div>
    </div>
    <div class="note"><strong>Notes:Booking Awaiting approval as discount exceed</strong></div>
    <div class="divider"></div>
    <div style="margin-top:2mm;">
      <div><strong>Booking Status: </strong>
      </div>
      <div class="status-box">
        ${r.finalStatus||"Status: Not Available"}
      </div>
    </div>
    <div class="divider"></div>

    <!-- BIG QR Code at Bottom -->
    
    <div class="divider" style="margin-top: 5mm;"></div>

    <!-- Signature Section - Adjusted to fit properly -->
    <div class="signature-box">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Customer's Signature</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Sales Executive</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Manager</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Accountant</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `}else return`
<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt - ${K}</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 10mm;
      font-size: 14px;
      color: #555555;
    }
    .page {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
    }
    .receipt-copy {
      height: 138mm; /* Half of A4 page */
      page-break-inside: avoid;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
      align-items: flex-start;
    }
    .header-left {
      width: 60%;
    }
    .header-right {
      width: 40%;
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .logo-qr-container {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: flex-end;
      margin-bottom: 5px;
      width: 100%;
    }
    .logo {
      height: 60px;
    }
    .qr-code-small {
      width: 100px;
      height: 100px;
      border: 1px solid #ccc;
    }
    .dealer-info {
      text-align: left;
      font-size: 12px;
      line-height: 1.1;
    }
    .customer-info-container {
      display: flex;
      font-size:12px;
    }
    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
      width: 50%;
    }
    .customer-info-row {
      margin: 0.5mm 0;
      line-height: 1.1;
    }
    .divider {
      border-top: 1px solid #AAAAAA;
      margin: 2mm 0;
    }
    .receipt-info {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 8px;
      margin: 8px 0;
      font-size: 12px;
    }
    .payment-info-box {
      margin: 5px 0;
    }
    .signature-box {
      margin-top: 3mm;
      font-size: 8pt;
    }
    .signature-line {
      border-top: 1px dashed #000;
      width: 35mm;
      display: inline-block;
      margin: 0 3mm;
    }
    .cutting-line {
      border-top: 2px dashed #333;
      margin: 10mm 0;
      text-align: center;
      position: relative;
    }
    .cutting-line::before {
      content: "✂ Cut Here ✂";
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 0 10px;
      font-size: 10px;
      color: #666;
    }
    .note{
      padding:1px;
      margin:2px;
      font-size: 11px;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        padding: 5mm;
      }
      .receipt-copy {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- First Copy -->
    <div class="receipt-copy">
      <!-- Header Section with QR Code -->
      <div class="header-container">
        <div class="header-left">
          <h2 style="margin:2;font-size:12pt;">GANDHI MOTORS PVT LTD</h2>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik, 7498993672<br>
            GSTIN: ${r.branch?.gst_number||""}<br>
            GANDHI TVS PIMPALGAON
          </div>
        </div>
        <div class="header-right">
          <!-- Logo and QR code side by side -->
          <div class="logo-qr-container">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            ${ue?`<img src="${ue}" class="qr-code-small" alt="QR Code" />`:""}
          </div>
          
          <div style="margin-top: 3px; font-size: 11px;">Date: ${k}</div>
          <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${K}</div>

          ${r.bookingType==="SUBDEALER"?`<div style="font-size: 10px;"><b>Subdealer:</b> ${r.subdealer?.name||""}</div>
          <div style="font-size: 9px;"><b>Address:</b> ${r.subdealer?.location||""}</div>`:""}
        </div>
      </div>
      <div class="divider"></div>

      <!-- Receipt Information -->
      <div class="receipt-info">
        <div><strong>Payment Receipt</strong></div>
        <div><strong>Booking Number:</strong> ${r.bookingNumber}</div>
        <div><strong>Receipt Date:</strong> ${k}</div>
      </div>

      <!-- Customer Information -->
      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Booking Number:</strong> ${r.bookingNumber}</div>
          <div class="customer-info-row"><strong>Customer Name:</strong> ${r.customerDetails.name}</div>
          <div class="customer-info-row"><strong>Address:</strong> ${r.customerDetails.address}, ${r.customerDetails.taluka}</div>
          <div class="customer-info-row"><strong>Mobile No.:</strong> ${r.customerDetails.mobile1}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${r.hpa?"YES":"NO"}</div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Model Name:</strong> ${r.model.model_name}</div>
          <div class="customer-info-row"><strong>Chassis No:</strong> ${r.chassisNumber}</div>
          <div class="customer-info-row"><strong>Payment Type:</strong> ${r.payment?.type||"CASH"}</div>
          <div class="customer-info-row"><strong>Financer:</strong> ${r.payment?.financer?.name||""}</div>
          <div class="customer-info-row"><strong>Sales Executive:</strong> ${r.salesExecutive?.name||"N/A"}</div>
        </div>
      </div>

      <!-- Received Amount Section -->
      <div class="payment-info-box">
        <div class="receipt-info">
          <div><strong>Receipt Amount (Rs):</strong> ₹${r.recentPaymentAmount.toFixed(2)}</div>
          <div><strong>Receipt Number:</strong> ${K}</div>
          <div><strong>Reference No:</strong> ${_}</div>
          <div><strong>Payment Mode:</strong> ${re}</div>
          <div><strong>Receipt Date:</strong> ${k}</div>
        </div>
      </div>

      <div class="note"><strong>Notes:</strong></div>
      <div class="divider"></div>

      <!-- Signature Section -->
      <div class="signature-box">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div style="text-align:center; width: 22%;">
            <div class="signature-line"></div>
            <div>Customer's Signature</div>
          </div>
          <div style="text-align:center; width: 22%;">
            <div class="signature-line"></div>
            <div>Sales Executive</div>
          </div>
          <div style="text-align:center; width: 22%;">
            <div class="signature-line"></div>
            <div>Manager</div>
          </div>
          <div style="text-align:center; width: 22%;">
            <div class="signature-line"></div>
            <div>Accountant</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cutting Line -->
    <div class="cutting-line"></div>

    <!-- Second Copy (Duplicate) -->
    <div class="receipt-copy">
      <!-- Header Section with QR Code -->
      <div class="header-container">
        <div class="header-left">
          <h2 style="margin:2;font-size:12pt;">GANDHI MOTORS PVT LTD</h2>
          <div class="dealer-info">
            Authorized Main Dealer: TVS Motor Company Ltd.<br>
            Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
            Upnagar, Nashik Road, Nashik, 7498993672<br>
            GSTIN: ${r.branch?.gst_number||""}<br>
            GANDHI TVS PIMPALGAON
          </div>
        </div>
        <div class="header-right">
          <!-- Logo and QR code side by side -->
          <div class="logo-qr-container">
            <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
            ${ue?`<img src="${ue}" class="qr-code-small" alt="QR Code" />`:""}
          </div>
          
          <div style="margin-top: 3px; font-size: 11px;">Date: ${k}</div>
          <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${K}</div>

          ${r.bookingType==="SUBDEALER"?`<div style="font-size: 10px;"><b>Subdealer:</b> ${r.subdealer?.name||""}</div>
          <div style="font-size: 9px;"><b>Address:</b> ${r.subdealer?.location||""}</div>`:""}
        </div>
      </div>
      <div class="divider"></div>

      <!-- Receipt Information -->
      <div class="receipt-info">
        <div><strong>Payment Receipt (DUPLICATE)</strong></div>
        <div><strong>Booking Number:</strong> ${r.bookingNumber}</div>
        <div><strong>Receipt Date:</strong> ${k}</div>
      </div>

      <!-- Customer Information -->
      <div class="customer-info-container">
        <div class="customer-info-left">
          <div class="customer-info-row"><strong>Booking Number:</strong> ${r.bookingNumber}</div>
          <div class="customer-info-row"><strong>Customer Name:</strong> ${r.customerDetails.name}</div>
          <div class="customer-info-row"><strong>Address:</strong> ${r.customerDetails.address}, ${r.customerDetails.taluka}</div>
          <div class="customer-info-row"><strong>Mobile No.:</strong> ${r.customerDetails.mobile1}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${r.hpa?"YES":"NO"}</div>
        </div>
        <div class="customer-info-right">
          <div class="customer-info-row"><strong>Model Name:</strong> ${r.model.model_name}</div>
          <div class="customer-info-row"><strong>Chassis No:</strong> ${r.chassisNumber}</div>
          <div class="customer-info-row"><strong>Payment Type:</strong> ${r.payment?.type||"CASH"}</div>
          <div class="customer-info-row"><strong>Financer:</strong> ${r.payment?.financer?.name||""}</div>
          <div class="customer-info-row"><strong>Sales Executive:</strong> ${r.salesExecutive?.name||"N/A"}</div>
        </div>
      </div>

      <!-- Received Amount Section -->
      <div class="payment-info-box">
        <div class="receipt-info">
          <div><strong>Receipt Amount (Rs):</strong> ₹${r.recentPaymentAmount.toFixed(2)}</div>
          <div><strong>Receipt Number:</strong> ${K}</div>
          <div><strong>Reference No:</strong> ${_}</div>
          <div><strong>Payment Mode:</strong> ${re}</div>
          <div><strong>Receipt Date:</strong> ${k}</div>
        </div>
      </div>

      <div class="note"><strong>Notes:</strong></div>
      <div class="divider"></div>

      <!-- Signature Section -->
      <div class="signature-box">
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div style="text-align:center; width: 22%;">
            <div class="signature-line"></div>
            <div>Customer's Signature</div>
          </div>
          <div style="text-align:center; width: 22%;">
            <div class="signature-line"></div>
            <div>Sales Executive</div>
          </div>
          <div style="text-align:center; width: 22%;">
            <div class="signature-line"></div>
            <div>Manager</div>
          </div>
          <div style="text-align:center; width: 22%;">
            <div class="signature-line"></div>
            <div>Accountant</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `},er=()=>{if(!Ee)return e.jsx("div",{className:"text-center py-4",children:e.jsx(xe,{color:"warning",children:"You do not have permission to view the Customer tab."})});const r=ze||vt,w=ze,U=vt;return e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(at,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(ct,{children:e.jsxs(Z,{children:[e.jsx(I,{scope:"col",children:"Sr.no"}),e.jsx(I,{scope:"col",children:"Booking ID"}),e.jsx(I,{scope:"col",children:"Model Name"}),e.jsx(I,{scope:"col",children:"Booking Date"}),e.jsx(I,{scope:"col",children:"Customer Name"}),e.jsx(I,{scope:"col",children:"Mobile Number"}),e.jsx(I,{scope:"col",children:"Chassis Number"}),e.jsx(I,{scope:"col",children:"Total"}),e.jsx(I,{scope:"col",children:"Received"}),e.jsx(I,{scope:"col",children:"Balance"}),e.jsx(I,{scope:"col",children:"Receipts"}),r&&e.jsx(I,{scope:"col",children:"Action"})]})}),e.jsx(lt,{children:Jt.length===0?e.jsx(Z,{children:e.jsx(R,{colSpan:r?"12":"11",style:{color:"red",textAlign:"center"},children:v?"No matching bookings found":"No booking available"})}):Jt.map((L,V)=>{const x=[...p[L._id]||[]].sort((_,z)=>{const re=new Date(_.receiptDate||_.createdAt||0),K=new Date(z.receiptDate||z.createdAt||0);return re-K});return e.jsxs(Z,{children:[e.jsx(R,{children:V+1}),e.jsx(R,{children:L.bookingNumber}),e.jsx(R,{children:L.model?.model_name||"N/A"}),e.jsx(R,{children:L.createdAt?new Date(L.createdAt).toLocaleDateString("en-GB"):" "}),e.jsx(R,{children:L.customerDetails?.name||"N/A"}),e.jsx(R,{children:L.customerDetails?.mobile1||"N/A"}),e.jsx(R,{children:L.chassisAllocationStatus==="ALLOCATED"&&L.status==="ALLOCATED"&&L.chassisNumber||""}),e.jsx(R,{children:Math.round(L.discountedAmount)||"0"}),e.jsx(R,{children:Math.round(L.receivedAmount)||"0"}),e.jsx(R,{children:Math.round(L.balanceAmount)||"0"}),e.jsx(R,{children:x.length>0?e.jsxs(gr,{children:[e.jsxs(fr,{size:"sm",color:"info",variant:"outline",disabled:!U,children:[x.length," Receipt",x.length>1?"s":""]}),e.jsx(pr,{children:x.map((_,z)=>e.jsx(vr,{onClick:()=>en(_.id,L._id,z),children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx(ft,{icon:jr,className:"me-2"}),e.jsxs("div",{children:[e.jsx("div",{children:e.jsxs("strong",{children:["Receipt #",z+1]})}),e.jsxs("small",{children:[_.display?.amount||`₹${_.amount}`," -",_.display?.date||new Date(_.receiptDate).toLocaleDateString("en-GB")]})]})]})},_.id))})]}):e.jsx("span",{className:"text-muted",children:"No receipts"})}),r&&e.jsxs(R,{children:[e.jsxs(De,{size:"sm",className:"option-button btn-sm",onClick:_=>Kn(_,L._id),disabled:!w,children:[e.jsx(ft,{icon:xr}),"Options"]}),e.jsx(Pr,{id:`action-menu-${L._id}`,anchorEl:M,open:E===L._id,onClose:xt,anchorOrigin:{vertical:"bottom",horizontal:"right"},transformOrigin:{vertical:"top",horizontal:"right"},children:w&&e.jsxs(Ir,{onClick:()=>{Jn(L),xt()},children:[e.jsx(ft,{icon:Dr,className:"me-2"}),"Add Payment"]})})]})]},V)})})]})})},tr=()=>Te?e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(at,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(ct,{children:e.jsxs(Z,{children:[e.jsx(I,{scope:"col",children:"Sr.no"}),e.jsx(I,{scope:"col",children:"Booking ID"}),e.jsx(I,{scope:"col",children:"Payment Mode"}),e.jsx(I,{scope:"col",children:"Amount"}),e.jsx(I,{scope:"col",children:"Transaction Reference"}),e.jsx(I,{scope:"col",children:"Date"}),e.jsx(I,{scope:"col",children:"Status"}),$e&&e.jsx(I,{scope:"col",children:"Action"})]})}),e.jsx(lt,{children:Xt.length===0?e.jsx(Z,{children:e.jsx(R,{colSpan:$e?"8":"7",style:{color:"red",textAlign:"center"},children:v?"No matching pending payments found":"No pending payments available"})}):Xt.map((r,w)=>e.jsxs(Z,{children:[e.jsx(R,{children:w+1}),e.jsx(R,{children:r.bookingDetails?.bookingNumber||r.booking||""}),e.jsx(R,{children:r.paymentMode||""}),e.jsx(R,{children:r.amount||""}),e.jsx(R,{children:r.transactionReference||""}),e.jsx(R,{children:r.updatedAt?new Date(r.updatedAt).toLocaleDateString("en-GB"):" "}),e.jsx(R,{children:e.jsx(br,{color:r.approvalStatus==="Pending"?"danger":"success",shape:"rounded-pill",children:r.approvalStatus==="Pending"?"PENDING":"VERIFIED"})}),$e&&e.jsx(R,{children:r.approvalStatus==="Pending"?e.jsxs(De,{size:"sm",className:"action-btn",onClick:()=>Qn(r),children:[e.jsx(ft,{icon:Br,className:"me-1"}),"Verify"]}):e.jsx("span",{className:"text-muted",children:"Verified"})})]},w))})]})}):e.jsx("div",{className:"text-center py-4",children:e.jsx(xe,{color:"warning",children:"You do not have permission to view the Payment Verification tab."})}),nr=()=>ke?e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(at,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(ct,{children:e.jsxs(Z,{children:[e.jsx(I,{scope:"col",children:"Sr.no"}),e.jsx(I,{scope:"col",children:"Booking ID"}),e.jsx(I,{scope:"col",children:"Model Name"}),e.jsx(I,{scope:"col",children:"Booking Date"}),e.jsx(I,{scope:"col",children:"Customer Name"}),e.jsx(I,{scope:"col",children:"Mobile Number"}),e.jsx(I,{scope:"col",children:"Chassis Number"}),e.jsx(I,{scope:"col",children:"Total"}),e.jsx(I,{scope:"col",children:"Received"}),e.jsx(I,{scope:"col",children:"Balance"})]})}),e.jsx(lt,{children:Qt.length===0?e.jsx(Z,{children:e.jsx(R,{colSpan:"10",style:{color:"red",textAlign:"center"},children:v?"No matching complete payments found":"No complete payments available"})}):Qt.map((r,w)=>e.jsxs(Z,{children:[e.jsx(R,{children:w+1}),e.jsx(R,{children:r.bookingNumber||""}),e.jsx(R,{children:r.model?.model_name||"N/A"}),e.jsx(R,{children:r.createdAt?new Date(r.createdAt).toLocaleDateString("en-GB"):" "}),e.jsx(R,{children:r.customerDetails?.name||"N/A"}),e.jsx(R,{children:r.customerDetails?.mobile1||"N/A"}),e.jsx(R,{children:r.chassisAllocationStatus==="ALLOCATED"&&r.status==="ALLOCATED"&&r.chassisNumber||""}),e.jsx(R,{children:Math.round(r.discountedAmount)||"0"}),e.jsx(R,{children:Math.round(r.receivedAmount)||"0"}),e.jsx(R,{style:{color:"green"},children:Math.round(r.balanceAmount)||"0"})]},w))})]})}):e.jsx("div",{className:"text-center py-4",children:e.jsx(xe,{color:"warning",children:"You do not have permission to view the Complete Payment tab."})}),rr=()=>Fe?e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(at,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(ct,{children:e.jsxs(Z,{children:[e.jsx(I,{scope:"col",children:"Sr.no"}),e.jsx(I,{scope:"col",children:"Booking ID"}),e.jsx(I,{scope:"col",children:"Model Name"}),e.jsx(I,{scope:"col",children:"Booking Date"}),e.jsx(I,{scope:"col",children:"Customer Name"}),e.jsx(I,{scope:"col",children:"Mobile Number"}),e.jsx(I,{scope:"col",children:"Chassis Number"}),e.jsx(I,{scope:"col",children:"Total"}),e.jsx(I,{scope:"col",children:"Received"}),e.jsx(I,{scope:"col",children:"Balance"})]})}),e.jsx(lt,{children:Wt.length===0?e.jsx(Z,{children:e.jsx(R,{colSpan:"10",style:{color:"red",textAlign:"center"},children:v?"No matching pending payments found":"No pending payments available"})}):Wt.map((r,w)=>e.jsxs(Z,{children:[e.jsx(R,{children:w+1}),e.jsx(R,{children:r.bookingNumber||""}),e.jsx(R,{children:r.model?.model_name||"N/A"}),e.jsx(R,{children:r.createdAt?new Date(r.createdAt).toLocaleDateString("en-GB"):" "}),e.jsx(R,{children:r.customerDetails?.name||"N/A"}),e.jsx(R,{children:r.customerDetails?.mobile1||"N/A"}),e.jsx(R,{children:r.chassisAllocationStatus==="ALLOCATED"&&r.status==="ALLOCATED"&&r.chassisNumber||""}),e.jsx(R,{children:Math.round(r.discountedAmount)||"0"}),e.jsx(R,{children:Math.round(r.receivedAmount)||"0"}),e.jsx(R,{style:{color:"red"},children:Math.round(r.balanceAmount)||"0"})]},w))})]})}):e.jsx("div",{className:"text-center py-4",children:e.jsx(xe,{color:"warning",children:"You do not have permission to view the Pending List tab."})}),or=()=>Re?e.jsx("div",{className:"responsive-table-wrapper",children:e.jsxs(at,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[e.jsx(ct,{children:e.jsxs(Z,{children:[e.jsx(I,{scope:"col",children:"Sr.no"}),e.jsx(I,{scope:"col",children:"Booking ID"}),e.jsx(I,{scope:"col",children:"Customer Name"}),e.jsx(I,{scope:"col",children:"Payment Mode"}),e.jsx(I,{scope:"col",children:"Amount"}),e.jsx(I,{scope:"col",children:"Transaction Reference"}),e.jsx(I,{scope:"col",children:"Date"}),e.jsx(I,{scope:"col",children:"Verified By"})]})}),e.jsx(lt,{children:Zt.length===0?e.jsx(Z,{children:e.jsx(R,{colSpan:"8",style:{color:"red",textAlign:"center"},children:v?"No matching verified payments found":"No verified payments available"})}):Zt.map((r,w)=>e.jsxs(Z,{children:[e.jsx(R,{children:w+1}),e.jsx(R,{children:r.booking||""}),e.jsx(R,{children:r.bookingDetails?.customerDetails?.name||""}),e.jsx(R,{children:r.paymentMode}),e.jsx(R,{children:r.amount}),e.jsx(R,{children:r.transactionReference}),e.jsx(R,{children:r.updatedAt?new Date(r.updatedAt).toLocaleDateString("en-GB"):" "}),e.jsx(R,{children:r.receivedByDetails?.name||""})]},w))})]})}):e.jsx("div",{className:"text-center py-4",children:e.jsx(xe,{color:"warning",children:"You do not have permission to view the Verified List tab."})});return ae?Ae?j?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"50vh"},children:e.jsx(tn,{color:"primary"})}):O?e.jsx("div",{className:"alert alert-danger",role:"alert",children:O}):e.jsxs("div",{children:[e.jsx("div",{className:"title",children:"Receipt Management"}),C&&e.jsx(xe,{color:"success",className:"mb-3",children:C}),e.jsx(Cr,{className:"table-container mt-4",children:e.jsx(Ar,{children:Ae?e.jsxs(e.Fragment,{children:[de&&e.jsx("div",{className:"d-flex mb-3",children:e.jsxs(De,{size:"sm",className:"action-btn",onClick:Wn,title:"Export Excel",children:[e.jsx(nn,{icon:dr,className:"me-1"}),"Export Excel"]})}),e.jsxs(Nr,{variant:"tabs",className:"mb-3 border-bottom",children:[Ee&&e.jsx(ot,{children:e.jsxs(it,{active:i===0,onClick:()=>Ye(0),style:{cursor:"pointer",borderTop:i===0?"4px solid #2759a2":"3px solid transparent",color:"black",borderBottom:"none"},children:["Customer",!ze&&e.jsx("span",{className:"ms-1 text-muted small",children:"(View Only)"})]})}),Te&&e.jsx(ot,{children:e.jsxs(it,{active:i===1,onClick:()=>Ye(1),style:{cursor:"pointer",borderTop:i===1?"4px solid #2759a2":"3px solid transparent",borderBottom:"none",color:"black"},children:["Payment Verification",!$e&&e.jsx("span",{className:"ms-1 text-muted small",children:"(View Only)"})]})}),ke&&e.jsx(ot,{children:e.jsxs(it,{active:i===2,onClick:()=>Ye(2),style:{cursor:"pointer",borderTop:i===2?"4px solid #2759a2":"3px solid transparent",borderBottom:"none",color:"black"},children:["Complete Payment",!Hn&&e.jsx("span",{className:"ms-1 text-muted small",children:"(View Only)"})]})}),Fe&&e.jsx(ot,{children:e.jsxs(it,{active:i===3,onClick:()=>Ye(3),style:{cursor:"pointer",borderTop:i===3?"4px solid #2759a2":"3px solid transparent",borderBottom:"none",color:"black"},children:["Pending List",!qn&&e.jsx("span",{className:"ms-1 text-muted small",children:"(View Only)"})]})}),Re&&e.jsx(ot,{children:e.jsxs(it,{active:i===4,onClick:()=>Ye(4),style:{cursor:"pointer",borderTop:i===4?"4px solid #2759a2":"3px solid transparent",borderBottom:"none",color:"black"},children:["Verified List",!zn&&e.jsx("span",{className:"ms-1 text-muted small",children:"(View Only)"})]})})]}),e.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[e.jsx("div",{}),e.jsxs("div",{className:"d-flex",children:[e.jsx(wr,{className:"mt-1 m-1",children:"Search:"}),e.jsx(fe,{type:"text",style:{maxWidth:"350px",height:"30px",borderRadius:"0"},className:"d-inline-block square-search",value:v,onChange:r=>m(r.target.value),disabled:!Ae})]})]}),e.jsxs(Er,{children:[Ee&&e.jsx(st,{visible:i===0,children:er()}),Te&&e.jsx(st,{visible:i===1,children:tr()}),ke&&e.jsx(st,{visible:i===2,children:nr()}),Fe&&e.jsx(st,{visible:i===3,children:rr()}),Re&&e.jsx(st,{visible:i===4,children:or()})]})]}):e.jsx(xe,{color:"warning",className:"text-center",children:"You don't have permission to view any tabs in Receipts."})})}),e.jsx(Mr,{show:a,onClose:()=>o(!1),bookingData:n,canCreateReceipts:ze,cashLocations:b}),e.jsxs(Bn,{alignment:"center",visible:A,onClose:bt,children:[e.jsx(Mn,{children:e.jsxs(Ln,{children:[e.jsx(nn,{icon:ur,className:"me-2"}),"Select Date Range for Receipts Export"]})}),e.jsxs(kn,{children:[He&&e.jsx(xe,{color:"warning",className:"mb-3",children:He}),e.jsxs(Tr,{dateAdapter:Sr,adapterLocale:Rr,children:[e.jsx("div",{className:"mb-3",children:e.jsx(rn,{label:"Start Date",value:T,onChange:r=>{ne(r),$("")},renderInput:r=>e.jsx(yt,{...r,fullWidth:!0,size:"small"}),inputFormat:"dd/MM/yyyy",mask:"__/__/____",views:["day","month","year"],disabled:!de})}),e.jsx("div",{className:"mb-3",children:e.jsx(rn,{label:"End Date",value:Y,onChange:r=>{ye(r),$("")},renderInput:r=>e.jsx(yt,{...r,fullWidth:!0,size:"small"}),inputFormat:"dd/MM/yyyy",mask:"__/__/____",minDate:T,views:["day","month","year"],disabled:!de})})]}),e.jsxs(yt,{select:!0,value:Ce,onChange:r=>{ut(r.target.value),$("")},fullWidth:!0,size:"small",SelectProps:{native:!0},disabled:!de,children:[e.jsx("option",{value:"",children:"-- Select Branch --"}),le&&e.jsx("option",{value:"all",children:"All Branch"}),mt.map(r=>e.jsx("option",{value:r._id,children:r.name},r._id))]})]}),e.jsxs(Fn,{children:[e.jsx(De,{color:"secondary",onClick:bt,children:"Cancel"}),e.jsx(De,{className:"submit-button",onClick:Xn,disabled:!T||!Y||!Ce||!de||Le,children:Le?e.jsxs(e.Fragment,{children:[e.jsx(tn,{size:"sm",className:"me-2"}),"Exporting..."]}):"Export"})]})]})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view any tabs in Receipts."}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Receipts."})}export{Qo as default};
