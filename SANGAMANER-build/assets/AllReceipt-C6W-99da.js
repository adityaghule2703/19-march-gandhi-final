import{r as d,l as M,m as A,v as m,j as t,C as V,z as w}from"./index-CD-UhOJ2.js";/* empty css              */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as B,g as _}from"./tableFilters-DsQgHBMv.js";import{u as H}from"./pagination-B7oNW1il.js";import{j as z,k as q,g as G}from"./index-ChSUmQOv.js";import{t as W}from"./logo-V-f8m5nN.js";import{t as Y}from"./tvssangamner-CUMk0KeD.js";import{d as J,e as K,f as Q,g as Z,P as p,M as g}from"./DefaultLayout-GrycDKjh.js";import{C as X}from"./CAlert-CENR3-Ss.js";import{C as ee,a as te}from"./CCardBody-BS7SU2uX.js";import{C as se}from"./CCardHeader-CGdtZMoU.js";import{C as ie}from"./CFormControlWrapper-BAfeeQeh.js";import{C as re}from"./CFormInput-CCQbnhW2.js";import{C as ae,a as oe,b as u,c as n,d as ne,e as i}from"./CTable-CzW9ULzA.js";import{a as le}from"./index.esm-BML82zAk.js";import"./slicedToArray-Dby63wcm.js";import"./createSvgIcon-70ImKnSA.js";import"./clsx-B-dksMZM.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./extends-CF3RwP-h.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./iconBase-BKuf68_k.js";import"./CNavItem-C1bzmovJ.js";const De=()=>{const{setData:T,filteredData:y,setFilteredData:S,handleFilter:L}=B([]),{currentRecords:v}=H(y),[R,C]=d.useState(!0),[E,I]=d.useState(""),[f,j]=d.useState(null),[N,ce]=d.useState(""),{permissions:h}=M(),r=J(h,g.ACCOUNT,p.ACCOUNT.ALL_RECEIPTS);K(h,g.ACCOUNT,p.ACCOUNT.ALL_RECEIPTS),Q(h,g.ACCOUNT,p.ACCOUNT.ALL_RECEIPTS),Z(h,g.ACCOUNT,p.ACCOUNT.ALL_RECEIPTS),d.useEffect(()=>{r&&$()},[r]);const $=async()=>{try{C(!0);const e=await A.get("/vouchers");console.log("API Response:",e.data),T(e.data.transactions),S(e.data.transactions)}catch(e){const s=m(e);s&&j(s)}finally{C(!1)}},F=async e=>{if(!r){m("You do not have permission to view receipts");return}try{const a=(await A.get(`/vouchers/${e}`)).data.data,l=U(a),c=window.open("","_blank");c.document.write(l),c.document.close(),c.focus()}catch{const a=m(f);a&&j(a)}},P=e=>{if(!e)return null;const s=e.split(".").pop().toLowerCase();return s==="pdf"?t.jsx(z,{className:"file-icon pdf"}):["jpg","jpeg","png","webp","gif"].includes(s)?t.jsx(q,{className:"file-icon image"}):t.jsx(G,{className:"file-icon other"})},D=e=>{if(!r){m("You do not have permission to view bills");return}if(!e)return;const s=`${w.baseURL}${e}`,a=e.split(".").pop().toLowerCase();if(["jpg","jpeg","png","webp","gif"].includes(a))window.open(s,"_blank");else if(a==="pdf")window.open(s,"_blank");else{const l=document.createElement("a");l.href=s,l.download=e.split("/").pop(),document.body.appendChild(l),l.click(),document.body.removeChild(l)}},O=e=>{if(e===0)return"Zero";const s=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],a=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],l=["","Thousand","Lakh","Crore"],c=o=>o===0?"":o<20?s[o]:o<100?`${a[Math.floor(o/10)]} ${s[o%10]}`.trim():`${s[Math.floor(o/100)]} Hundred ${c(o%100)}`.trim();let x="",b=0;for(;e>0;){const o=e%1e3;o&&(x=`${c(o)} ${l[b]} ${x}`.trim()),e=Math.floor(e/1e3),b++}return x},U=e=>{const s=O(e.amount),a=`${w.baseURL}/ledger.html?customerId=${e._id}`;return`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Account Customer Receipt</title>
        <style>
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
           border-bottom: 2px solid #AAAAAA;
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
        
        
          .section { 
          margin-bottom: 10px; 
          }
        
          .signature { margin-top: 30px; text-align: right; font-weight: bold; }
          hr { margin: 15px 0; }
          @page { size: A4; margin: 20mm; }

          .header2 h4{
             padding:5px;
            font-weight:700;
            color:#555555;
          }
            .divider{
            border: 1px solid #AAAAAA;
            }
            .main-section{
              display:flex;
              justify-content:space-between;
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
        </style>
      </head>
      <body>

       <div class="header-container">
              <div>
             <img src="${W}" class="logo-left" alt="TVS Logo">
                  <div class="header-text">
                      <h1>GANDHI TVS</h1>
                       <p>Authorised Main Dealer: TVS Motor Company Ltd.</p>
                      <p>Registered office:'JOGPREET' Asher Estate, Near Ichhamani Lawns, Upnagar,<br> Nashik Road, Nashik ,7498903672</p>
                     </div>
              </div>
              <div>
                <img src="${Y}" class="logo-right" alt="TVS Logo">
                </div>
      </div>
        <div class="main-section">
          <div class="section"><strong>Receipt No:</strong> ${e.voucherId}</div>
          <div class="section"><strong>Receipt Date:</strong> ${new Date(e.date).toLocaleDateString("en-GB")}</div>
        </div>
    
        <div class="section"><strong>Recipient:</strong> ${e.recipientName}</div>
        <div class="section"><strong>Payment Mode:</strong> ${e.paymentMode}</div>
        <div class="section">Amount: ₹${e.amount}</div>
        <div class="section">( In Words ) &nbsp; ${s} Only</div>
        <div class="divider"></div>

        <div class='header2'>
        <h4>NOTE- THIS RECEIPT IS VALID SUBJECT TO BANK REALISATION</h4>
        </div>
       
       <div class="footer">
                  <div class="footer-left">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(a)}"
                         class="qr-code"
                         alt="QR Code" />
                  </div>
                  <div class="footer-right">
                    <p>For, Gandhi TVS</p>
                    <p>Authorised Signatory</p>
                  </div>
                </div>
      </body>
      </html>
    `},k=e=>{r&&(I(e),L(e,_("allReceipts")))};return r?R?t.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"50vh"},children:t.jsx(V,{color:"primary"})}):f?t.jsx("div",{className:"alert alert-danger",role:"alert",children:f}):t.jsxs("div",{children:[t.jsx("div",{className:"title",children:"Cash Receipt"}),N&&t.jsx(X,{color:"success",className:"mb-3",children:N}),t.jsxs(ee,{className:"table-container mt-4",children:[t.jsxs(se,{className:"card-header d-flex justify-content-between align-items-center",children:[t.jsx("div",{}),t.jsxs("div",{className:"d-flex",children:[t.jsx(ie,{className:"mt-1 m-1",children:"Search:"}),t.jsx(re,{type:"text",className:"d-inline-block square-search",value:E,onChange:e=>k(e.target.value),disabled:!r})]})]}),t.jsx(te,{children:t.jsx("div",{className:"responsive-table-wrapper",children:t.jsxs(ae,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[t.jsx(oe,{children:t.jsxs(u,{children:[t.jsx(n,{children:"Sr.no"}),t.jsx(n,{children:"Voucher ID"}),t.jsx(n,{children:"Recipient Name"}),t.jsx(n,{children:"Date"}),t.jsx(n,{children:"Debit"}),t.jsx(n,{children:"Credit"}),t.jsx(n,{children:"Payment Mode"}),t.jsx(n,{children:"Bank Location"}),t.jsx(n,{children:"Cash Location"}),t.jsx(n,{children:"Bill"}),t.jsx(n,{children:"Action"})]})}),t.jsx(ne,{children:v.length===0?t.jsx(u,{children:t.jsx(i,{colSpan:"11",className:"text-center",children:"No cash receipts available"})}):v.map((e,s)=>t.jsxs(u,{children:[t.jsx(i,{children:s+1}),t.jsx(i,{children:e.receiptNo||"N/A"}),t.jsx(i,{children:e.accountHead||"N/A"}),t.jsx(i,{children:e.date||"N/A"}),t.jsxs(i,{children:["₹",e.debit?.toLocaleString("en-IN")||"0"]}),t.jsxs(i,{children:["₹",e.credit?.toLocaleString("en-IN")||"0"]}),t.jsx(i,{children:e.paymentMode||"N/A"}),t.jsx(i,{children:e.bankLocation||"N/A"}),t.jsx(i,{children:e.cashLocation||"N/A"}),t.jsx(i,{children:e.billUrl?t.jsxs("div",{className:"bill-cell",onClick:()=>D(e.billUrl),style:{cursor:r?"pointer":"not-allowed"},title:r?"View Bill":"No permission to view bill",children:[P(e.billUrl),t.jsx("span",{className:"bill-text",children:"View Bill"})]}):"No bill"}),t.jsx(i,{children:t.jsx(le,{size:"sm",color:"info",className:"action-btn",onClick:()=>F(e.id||e._id),disabled:!r,title:r?"View Receipt":"No permission to view receipt",children:"View"})})]},e.id||e._id||s))})]})})})]})]}):t.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view All Receipts."})};export{De as default};
