import{r as n,l as ae,v as A,m as B,j as e,C as re}from"./index-CD-UhOJ2.js";import{t as oe}from"./logo-V-f8m5nN.js";import{d as ne,e as ie,P,M as z}from"./DefaultLayout-GrycDKjh.js";import{b as le,a as C}from"./index.esm-BML82zAk.js";import{C as c,a as l}from"./CRow--g2qTLFu.js";import{C as de,a as me}from"./CCardBody-BS7SU2uX.js";import{C as ce}from"./CCardHeader-CGdtZMoU.js";import{C as D}from"./CFormControlWrapper-BAfeeQeh.js";import{C as he}from"./CFormInput-CCQbnhW2.js";import{C as O}from"./CFormSelect-DGopBSdT.js";import{C as pe,a as xe,b as ue,c as ge,d as be}from"./CModalTitle-Cs0DhY3v.js";import{C as je,a as fe,b as ve,c as Ce}from"./CAccordionItem-Dak0-4gO.js";import{C as Ne}from"./CTable-CzW9ULzA.js";import{C as ye}from"./CAlert-CENR3-Ss.js";import{f as Se}from"./format-BZUhodlP.js";import{p as _e}from"./parseISO-CWrxnvMW.js";import"./CNavItem-C1bzmovJ.js";const Ue=()=>{const[g,U]=n.useState([]),[i,M]=n.useState(""),[h,E]=n.useState(new Date().getFullYear()),[d,b]=n.useState(""),[G,V]=n.useState([]),[j,H]=n.useState([]),[R,I]=n.useState(!1),[t,f]=n.useState(null),[L,$]=n.useState(!1),[k,p]=n.useState(null),[J,N]=n.useState(!1),{user:y,permissions:T}=ae(),S=y?.roles?.some(s=>s.name==="SUBDEALER"),F=y?.subdealer?._id,_=y?.subdealer?.name,x=ne(T,z.SUBDEALER_MASTER,P.SUBDEALER_MASTER.CALCULATE_COMMISSION),w=ie(T,z.SUBDEALER_MASTER,P.SUBDEALER_MASTER.CALCULATE_COMMISSION);n.useEffect(()=>{if(!x){A("You do not have permission to view Commission Report");return}q(),K()},[x]),n.useEffect(()=>{W()},[h]);const q=async()=>{I(!0);try{const s=await B.get("/subdealers"),a=s.data.data.subdealers||s.data.data||[];U(a),S&&F&&M(F)}catch(s){const a=A(s);a&&p(a)}finally{I(!1)}},K=()=>{const s=new Date().getFullYear(),a=[];for(let o=2020;o<=s+1;o++)a.push(o);V(a),E(s)},W=()=>{const s=new Date,a=s.getFullYear(),o=s.getMonth()+1;let u=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((v,te)=>({value:te+1,name:v,disabled:!1}));parseInt(h)===a&&(u=u.map(v=>({...v,disabled:v.value>o}))),H(u),!d&&parseInt(h)===a?b(o):d||b(1)},Q=async()=>{if(!w){A("You do not have permission to generate commission report");return}if(!i){p("Please select a subdealer");return}if(!h||!d){p("Please select both year and month");return}$(!0),p(null);try{const s=await B.get(`commission-master/${i}/monthly-report?year=${h}&month=${d}`);s.data.status==="success"?(f(s.data.data),N(!0)):p("Failed to fetch commission report")}catch(s){console.error("Error fetching commission report:",s),p("Failed to fetch commission report")}finally{$(!1)}},X=s=>{M(s.target.value),f(null)},Z=s=>{E(parseInt(s.target.value)),b(""),f(null)},ee=s=>{b(s),f(null)},m=s=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:2,maximumFractionDigits:2}).format(s),Y=s=>{try{return Se(_e(s),"dd MMM yyyy")}catch{return s}},se=()=>{if(!t)return;const s=window.open("","_blank"),a=j.find(r=>r.value===parseInt(t.month))?.name,o=g.find(r=>r._id===i)?.name||g.find(r=>r._id===i)?.companyName||_||"Subdealer";s.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Commission Ledger - ${o} - ${a} ${t.year}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm 10mm;
            }
            body {
              font-family: Courier New;
              width: 100%;
              margin: 0;
              padding: 0;
              font-size: 14px;
              line-height: 1.3;
            }
            .container {
              width: 190mm;
              margin: 0 auto;
              padding: 5mm;
            }
            .header-container {
              display: flex;
              justify-content: space-between;
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
            .report-info {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 2mm;
              margin-bottom: 5mm;
              font-size: 14px;
            }
            .report-info strong {
              min-width: 40mm;
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
            .text-right {
              text-align: right;
            }
            .breakdown-table {
              width: 95%;
              margin: 3mm auto;
              border: 1px solid #999;
              font-size: 12px;
            }
            .breakdown-table th, .breakdown-table td {
              border: 1px solid #999;
              padding: 1.5mm;
            }
            .footer {
              margin-top: 10mm;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-size: 14px;
            }
            @media print {
              body {
                width: 190mm;
                height: 277mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header-container">
              <img src="${oe}" class="logo" alt="TVS Logo">
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
            
            <div class="report-info">
              <div><strong>Subdealer:</strong> ${o}</div>
              <div><strong>Total Bookings:</strong> ${t.total_bookings}</div>
              <div><strong>Period:</strong> ${a} ${t.year}</div>
              <div><strong>Report Date:</strong> ${new Date().toLocaleDateString("en-GB")}</div>
              <div><strong>Total Commission:</strong>${m(t.total_commission)}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th width="15%">Date</th>
                  <th width="45%">Description</th>
                  <th width="20%">Booking Number</th>
                  <th width="20%" class="text-right">Commission (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${t.booking_commissions?.map(r=>`
                  <tr>
                    <td>${Y(r.booking_date)}</td>
                    <td>${r.customer_name} - ${r.model}</td>
                    <td>${r.booking_number}</td>
                    <td class="text-right">${r.total_commission.toLocaleString("en-IN",{minimumFractionDigits:2})}</td>
                  </tr>
                  <tr>
                    <td colspan="4">
                      <table class="breakdown-table">
                        <thead>
                          <tr>
                            <th>Header</th>
                            <th class="text-right">Commission (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${r.commission_breakdown.map(u=>`
                              <tr>
                                <td>${u.header}</td>
                                <td class="text-right">${u.commission.toLocaleString("en-IN",{minimumFractionDigits:2})}</td>
                              </tr>
                            `).join("")}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                `).join("")}
                <tr>
                  <td colspan="3" class="text-right"><strong>Total Commission</strong></td>
                  <td class="text-right"><strong>${t.total_commission.toLocaleString("en-IN",{minimumFractionDigits:2})}</strong></td>
                </tr>
              </tbody>
            </table>
            
            <div class="footer">
              <div>
                <p>Generated on: ${new Date().toLocaleString("en-GB")}</p>
              </div>
              <div>
                <p>For, Gandhi TVS</p>
                <p>Authorised Signature</p>
                <p>_________________________</p>
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
    `)};return x?k?e.jsx("div",{className:"alert alert-danger",role:"alert",children:k}):e.jsxs(le,{className:"my-4",children:[e.jsx(c,{className:"justify-content-center",children:e.jsx(l,{md:10,lg:8,children:e.jsxs(de,{children:[e.jsxs(ce,{children:[e.jsx("h4",{className:"mb-0",children:"Subdealer Commission Report"}),e.jsx("p",{className:"text-muted small mb-0",children:"Select a subdealer and time period to generate a commission report"})]}),e.jsxs(me,{children:[e.jsxs("div",{className:"mb-3",children:[e.jsxs(D,{htmlFor:"subdealerSelect",className:"fw-semibold",children:["Subdealer ",e.jsx("span",{className:"text-danger",children:"*"})]}),S?e.jsxs("div",{children:[e.jsx(he,{type:"text",value:`${_||"Your Subdealer Account"}`,readOnly:!0,disabled:!0,className:"mb-2"}),e.jsx("div",{className:"text-muted small",children:"Subdealers can only view commission reports for their own account"})]}):e.jsxs(O,{id:"subdealerSelect",value:i,onChange:X,disabled:R||!x,className:i?"":"border-warning",children:[e.jsx("option",{value:"",children:R?"Loading subdealers...":"Choose a subdealer"}),g.map(s=>e.jsx("option",{value:s._id,children:s.name||s.companyName||s.email},s._id))]}),!i&&!S&&e.jsx("div",{className:"form-text text-warning",children:"Please select a subdealer to continue"})]}),e.jsx(c,{children:e.jsx(l,{md:12,children:e.jsxs("div",{className:"mb-3",children:[e.jsxs(D,{htmlFor:"yearSelect",className:"fw-semibold",children:["Select Year ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx(O,{id:"yearSelect",value:h,onChange:Z,className:"border-primary",disabled:!x,children:G.map(s=>e.jsx("option",{value:s,children:s},s))})]})})}),e.jsx(c,{children:e.jsx(l,{md:12,children:e.jsxs("div",{className:"mb-3",children:[e.jsxs(D,{className:"fw-semibold d-block",children:["Select Month ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("div",{className:"month-buttons-container",children:e.jsx(c,{className:"g-2",children:j.map(s=>e.jsx(l,{xs:4,sm:3,children:e.jsx(C,{color:d===s.value?"primary":"outline-secondary",disabled:s.disabled||!x,className:"w-100 month-button",onClick:()=>ee(s.value),size:"sm",children:s.name})},s.value))})}),!d&&e.jsx("div",{className:"form-text text-warning mt-2",children:"Please select a month"})]})})}),e.jsxs("div",{className:"d-grid gap-2 mt-4",children:[e.jsx(C,{color:"primary",size:"lg",onClick:Q,disabled:!i||!d||L||!w,className:"fw-semibold",children:L?e.jsxs(e.Fragment,{children:[e.jsx(re,{component:"span",size:"sm","aria-hidden":"true",className:"me-2"}),"Generating Report..."]}):"Generate Report"}),(!i||!d)&&e.jsx("div",{className:"text-center text-muted small",children:"Please complete all required fields to generate a report"}),!w&&i&&d&&e.jsx("div",{className:"alert alert-warning text-center small",children:"You don't have permission to generate commission reports"})]})]})]})})}),e.jsxs(pe,{visible:J,onClose:()=>N(!1),size:"lg",scrollable:!0,className:"commission-report-modal",children:[e.jsx(xe,{children:e.jsxs(ue,{children:["Commission Report: ",j.find(s=>s.value===parseInt(t?.month))?.name," ",t?.year]})}),e.jsx(ge,{children:e.jsx("div",{id:"report-content",children:t&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"report-summary mb-4 p-3 bg-light rounded",children:[e.jsxs(c,{children:[e.jsxs(l,{md:6,children:[e.jsxs("p",{className:"mb-1",children:[e.jsx("strong",{children:"Subdealer ID:"})," ",t.subdealer._id]}),e.jsxs("p",{className:"mb-0",children:[e.jsx("strong",{children:"Subdealer:"})," ",g.find(s=>s._id===i)?.name||g.find(s=>s._id===i)?.companyName||_||"Selected subdealer"]})]}),e.jsx(l,{md:6,className:"text-md-end",children:e.jsxs("p",{className:"mb-1",children:[e.jsx("strong",{children:"Period:"})," ",j.find(s=>s.value===parseInt(t.month))?.name," ",t.year]})})]}),e.jsxs(c,{className:"mt-3",children:[e.jsx(l,{md:6,children:e.jsxs("div",{className:"p-3 bg-white rounded border",children:[e.jsx("h6",{className:"text-muted",children:"Total Bookings"}),e.jsx("h3",{className:"text-primary",children:t.total_bookings})]})}),e.jsx(l,{md:6,children:e.jsxs("div",{className:"p-3 bg-white rounded border",children:[e.jsx("h6",{className:"text-muted",children:"Total Commission"}),e.jsx("h3",{className:"text-success",children:m(t.total_commission)})]})})]})]}),e.jsx("h6",{className:"mb-3",children:"Booking Details"}),t.booking_commissions&&t.booking_commissions.length>0?e.jsx(je,{children:t.booking_commissions.map((s,a)=>e.jsxs(fe,{itemKey:a,children:[e.jsx(ve,{children:e.jsxs("div",{className:"d-flex justify-content-between w-100 me-3",children:[e.jsxs("span",{children:[e.jsx("strong",{children:s.booking_number})," - ",s.model]}),e.jsx("span",{className:"badge bg-primary rounded-pill",children:m(s.total_commission)})]})}),e.jsxs(Ce,{children:[e.jsx("div",{className:"mb-3",children:e.jsxs(c,{children:[e.jsxs(l,{md:6,children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Booking Date:"})," ",Y(s.booking_date)]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Customer:"})," ",s.customer_name]})]}),e.jsxs(l,{md:6,children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Total Amount:"})," ",m(s.total_amount)]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Commission:"})," ",m(s.total_commission)]})]})]})}),e.jsx("h6",{className:"mb-3",children:"Commission Breakdown"}),e.jsx("div",{className:"table-responsive",children:e.jsxs(Ne,{striped:!0,responsive:!0,size:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Item"}),e.jsx("th",{className:"text-end",children:"Rate"}),e.jsx("th",{className:"text-end",children:"Commission"})]})}),e.jsx("tbody",{children:s.commission_breakdown.map((o,r)=>e.jsxs("tr",{children:[e.jsx("td",{children:o.header}),e.jsx("td",{className:"text-end",children:o.rate}),e.jsx("td",{className:"text-end",children:m(o.commission)})]},r))}),e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("th",{colSpan:3,className:"text-end",children:"Total Commission:"}),e.jsx("th",{className:"text-end",children:m(s.total_commission)})]})})]})})]})]},s.booking_id))}):e.jsx(ye,{color:"info",children:"No bookings found for the selected period."})]})})}),e.jsxs(be,{children:[e.jsx(C,{color:"secondary",onClick:()=>N(!1),children:"Close"}),e.jsx(C,{color:"primary",onClick:se,children:"Print Ledger"})]})]}),e.jsx("style",{jsx:!0,children:`
        .month-button {
          transition: all 0.2s ease;
        }
        .month-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        :global(.commission-report-modal) {
          z-index: 9999 !important;
        }

        :global(.modal-backdrop) {
          z-index: 9998 !important;
        }
      `})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Commission Report."})};export{Ue as default};
