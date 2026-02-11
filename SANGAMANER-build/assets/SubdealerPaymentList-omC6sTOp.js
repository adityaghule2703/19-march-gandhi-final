import{r as l,l as ee,v as R,j as e,C as te,m as k}from"./index-CD-UhOJ2.js";import{h as U,d as se,e as ae,P as v,M as y,i as ne,A as D}from"./DefaultLayout-GrycDKjh.js";import{C as le,a as ie,b as re,c as oe,d as de}from"./CModalTitle-Cs0DhY3v.js";import{C as f}from"./CFormSelect-DGopBSdT.js";import{a as O}from"./index.esm-BML82zAk.js";import"./CNavItem-C1bzmovJ.js";import"./CFormControlWrapper-BAfeeQeh.js";const ve=()=>{const[ce,N]=l.useState([]),[c,A]=l.useState([]),[w,Y]=l.useState([]),[a,b]=l.useState(null),[i,j]=l.useState(""),[r,_]=l.useState(""),[L,x]=l.useState(!1),[B,M]=l.useState(!1),[E,p]=l.useState(null),{user:S}=ee(),g=S?.permissions||[],u=S?.roles?.some(t=>t.name==="SUBDEALER"),o=S?.subdealer;U(g,y.SUBDEALER_ACCOUNT,v.SUBDEALER_ACCOUNT.PAYMENT_SUMMARY,D.VIEW),U(g,y.SUBDEALER_ACCOUNT,v.SUBDEALER_ACCOUNT.PAYMENT_SUMMARY,D.CREATE);const C=se(g,y.SUBDEALER_ACCOUNT,v.SUBDEALER_ACCOUNT.PAYMENT_SUMMARY),$=ae(g,y.SUBDEALER_ACCOUNT,v.SUBDEALER_ACCOUNT.PAYMENT_SUMMARY),I=[{value:"",label:"All Months"},{value:"1",label:"January"},{value:"2",label:"February"},{value:"3",label:"March"},{value:"4",label:"April"},{value:"5",label:"May"},{value:"6",label:"June"},{value:"7",label:"July"},{value:"8",label:"August"},{value:"9",label:"September"},{value:"10",label:"October"},{value:"11",label:"November"},{value:"12",label:"December"}],P=new Date().getFullYear(),J=[{value:"",label:"All Years"},...Array.from({length:6},(t,s)=>({value:(P-s).toString(),label:(P-s).toString()}))];l.useEffect(()=>{if(!C){R("You do not have permission to view Commission Payments");return}(async()=>{try{const n=(await k.get("/subdealers")).data.data.subdealers||[];if(Y(n),u&&o){const h=n.find(m=>m.id===o._id);b(h||{id:o._id,name:o.name,location:o.latLong?.address||"",type:o.type})}}catch(s){const n=R(s);n&&p(n)}})()},[C,u,o]);const G=async()=>{M(!0),p(null);try{let t="/commission-payments";const s=new URLSearchParams;a?.id&&s.append("subdealer_id",a.id),i&&s.append("month",i),r&&s.append("year",r),s.toString()&&(t+=`?${s.toString()}`);const n=await k.get(t);N(n.data.data.payments||[]),A(n.data.data.payments||[])}catch(t){console.error("Error fetching payments",t),p("Failed to load commission payments")}finally{M(!1)}},z=()=>{x(!0)},V=t=>{if(u)return;const s=t.target.value,n=w.find(h=>h.id===s);b(n||null)},W=t=>{j(t.target.value)},q=t=>{_(t.target.value)},H=()=>{G(),x(!1)},K=()=>{u&&o?(j(""),_("")):(b(null),j(""),_("")),N([]),A([]),x(!1)},Q=()=>{if(!a||!i||!r){p("Please select month, and year to generate receipt");return}const t={subdealer:a,month:parseInt(i),year:parseInt(r),totalCommission:c.reduce((s,n)=>s+n.total_commission,0),paymentDate:new Date().toISOString(),receiptNumber:`RC-${Math.floor(1e3+Math.random()*9e3)}`,payments:c};X(t)},X=t=>{const s=window.open("","_blank");if(!s){p("Please allow popups for this site to generate receipts");return}const n=m=>{const d={year:"numeric",month:"short",day:"numeric"};return new Date(m).toLocaleDateString(void 0,d)},h=m=>["January","February","March","April","May","June","July","August","September","October","November","December"][m-1]||"";s.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Commission Payment Receipt</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          body {
            font-family: Courier New;
            background-color: #f8f9fa;
            padding: 20px;
            font-size:13px;
          }
          .receipt-container {
            width: 21cm;
            min-height: 29.7cm;
            padding: 1cm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .receipt-company-header {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3c4b64;
          }
          .receipt-company-header h2 {
            color: #3c4b64;
            margin-bottom: 5px;
          }
          .receipt-company-header p {
            margin: 2px 0;
            color: #6c757d;
          }
          .receipt-details {
            margin-bottom: 25px;
          }
          .detail-group {
            display: flex;
            margin-bottom: 5px;
          }
          .detail-group label {
            font-weight: 600;
            min-width: 150px;
            color: #495057;
          }
          .detail-group span {
            color: #3c4b64;
          }
          .receipt-summary {
            margin-bottom: 30px;
            text-align: center;
          }
          .summary-card {
            display: inline-block;
            background: linear-gradient(135deg, #3c4b64 0%, #2c3e50 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .summary-card h4 {
            margin: 0 0 10px 0;
            font-size: 1.1rem;
          }
          .summary-card .amount {
            font-size: 1.8rem;
            font-weight: bold;
          }
          .receipt-payments h5 {
            color: #3c4b64;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
          }
          .receipt-payments table {
            border: 1px solid #dee2e6;
            width: 100%;
          }
          .receipt-payments th {
            background-color: #f8f9fa;
            color: #3c4b64;
            font-weight: 600;
            padding: 10px;
            text-align: left;
          }
          .receipt-payments td {
            padding: 10px;
            border-top: 1px solid #dee2e6;
          }
          .authorized-signature, .subdealer-signature {
            text-align: center;
            margin-top: 10px;
          }
          .authorized-signature p, .subdealer-signature p {
            margin: 5px 0;
          }
          .receipt-notes {
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #3c4b64;
            margin-top: 10px;
          }
          .receipt-notes ul {
            padding-left: 20px;
          }
          @media print {
            body {
              padding: 0;
              background: white;
            }
            .receipt-container {
              width: 100%;
              height: 100%;
              padding: 0;
              margin: 0;
              box-shadow: none;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-company-header">
            <h4>Gandhi TVS</h4>
            <p>Authorised Main Dealer: TVS Motor Company Ltd.
Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,
Upnagar, Nashik Road, Nashik - 422101</p>
            <p>Phone: 7498903672</p>
          </div>
          
          <div class="receipt-details">
            <div class="row">
              <div class="col-md-6">
                <div class="detail-group">
                  <label>Receipt Number:</label>
                  <span>${t.receiptNumber}</span>
                </div>
                <div class="detail-group">
                  <label>Issue Date:</label>
                  <span>${n(t.paymentDate)}</span>
                </div>
                <div class="detail-group">
                  <label>Payment Period:</label>
                  <span>${h(t.month)} ${t.year}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="detail-group">
                  <label>Subdealer Name:</label>
                  <span>${t.subdealer.name}</span>
                </div>
                <div class="detail-group">
                  <label>Location:</label>
                  <span>${t.subdealer.location||""}</span>
                </div>
                <div class="detail-group">
                  <label>Type:</label>
                  <span>${t.subdealer.type}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="receipt-payments">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Customer</th>
                    <th>Model</th>
                    <th>Booking Date</th>
                    <th class="text-end">Commission Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${t.payments.flatMap(m=>m.booking_commissions.map(d=>`
                      <tr>
                        <td>${d.booking_number}</td>
                        <td>${d.customer_name}</td>
                        <td>${d.model}</td>
                        <td>${n(d.booking_date)}</td>
                        <td class="text-end">₹${d.total_commission.toFixed(2)}</td>
                      </tr>
                    `).join("")).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4" class="text-end"><strong>Total Commission:</strong></td>
                    <td class="text-end"><strong>₹${t.totalCommission.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div class="receipt-footer">
            <div class="row">
              <div class="col-md-6">
                <div class="authorized-signature">
                  <p>_________________________</p>
                  <p>Authorized Signature</p>
                  <p>Gandhi TVS</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="subdealer-signature">
                  <p>_________________________</p>
                  <p>Subdealer Signature</p>
                  <p>${t.subdealer.name}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="receipt-notes">
            <p><strong>Notes:</strong></p>
            <ul>
              <li>This receipt serves as confirmation of commission payment for the specified period.</li>
              <li>Please retain this document for your records.</li>
              <li>For any queries, contact Gandhi TVS</li>
            </ul>
          </div>

          <div class="text-center mt-4 no-print">
            <button class="btn btn-primary" onclick="window.print()">
              <i class="fas fa-print"></i> Print Receipt
            </button>
            <button class="btn btn-secondary ms-2" onclick="window.close()">
              <i class="fas fa-times"></i> Close
            </button>
          </div>
        </div>
      </body>
      </html>
    `),s.document.close()},F=t=>{const s={year:"numeric",month:"short",day:"numeric"};return new Date(t).toLocaleDateString(void 0,s)},T=t=>["January","February","March","April","May","June","July","August","September","October","November","December"][t-1]||"",Z=t=>{let s="secondary";return t==="PROCESSED"&&(s="success"),t==="PENDING"&&(s="warning"),t==="FAILED"&&(s="danger"),e.jsx(ne,{color:s,children:t})};return C?E?e.jsx("div",{className:"alert alert-danger",role:"alert",children:E}):e.jsxs("div",{className:"commission-payments-container",children:[e.jsxs("div",{className:"header-section",children:[e.jsx("h4",{children:"Commission Payments"}),e.jsxs("div",{className:"action-buttons",children:[e.jsxs("button",{className:"btn btn-primary filter-btn",onClick:z,children:[e.jsx("i",{className:"fas fa-filter"})," Filter"]}),$&&e.jsxs("button",{className:"btn btn-success receipt-btn",onClick:Q,disabled:!a||!i||!r||c.length===0,children:[e.jsx("i",{className:"fas fa-receipt"})," Generate Receipt"]})]})]}),(a||i||r)&&e.jsxs("div",{className:"active-filters",children:[e.jsx("h5",{children:"Active Filters:"}),e.jsxs("div",{className:"filter-badges",children:[a&&e.jsxs("span",{className:"badge bg-primary",children:["Subdealer: ",a.name]}),i&&e.jsxs("span",{className:"badge bg-info text-dark",children:["Month: ",T(parseInt(i))]}),r&&e.jsxs("span",{className:"badge bg-info text-dark",children:["Year: ",r]})]})]}),B?e.jsxs("div",{className:"text-center py-5",children:[e.jsx(te,{color:"primary"}),e.jsx("p",{className:"mt-2",children:"Loading commission payments..."})]}):c.length>0?e.jsxs("div",{className:"payments-table-container",children:[a&&e.jsxs("div",{className:"subdealer-info",children:[e.jsx("h4",{children:a.name}),e.jsxs("p",{children:[a.location," • ",a.type]})]}),e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-striped",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Month/Year"}),e.jsx("th",{children:"Total Commission"}),e.jsx("th",{children:"Payment Method"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Remarks"}),e.jsx("th",{children:"Created On"})]})}),e.jsx("tbody",{children:c.map(t=>e.jsxs("tr",{children:[e.jsxs("td",{children:[T(t.month)," ",t.year]}),e.jsxs("td",{children:["₹",t.total_commission.toFixed(2)]}),e.jsx("td",{children:t.payment_method==="ON_ACCOUNT"?"On Account":t.payment_method}),e.jsx("td",{children:Z(t.status)}),e.jsx("td",{children:t.remarks}),e.jsx("td",{children:F(t.created_at)})]},t._id))})]})}),c[0]?.booking_commissions&&e.jsxs("div",{className:"booking-commissions mt-5",children:[e.jsx("h4",{children:"Booking Commissions"}),e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Booking #"}),e.jsx("th",{children:"Model"}),e.jsx("th",{children:"Booking Date"}),e.jsx("th",{children:"Customer"}),e.jsx("th",{children:"Total Amount"}),e.jsx("th",{children:"Commission"})]})}),e.jsx("tbody",{children:c[0].booking_commissions.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.booking_number}),e.jsx("td",{children:t.model}),e.jsx("td",{children:F(t.booking_date)}),e.jsx("td",{children:t.customer_name}),e.jsxs("td",{children:["₹",t.total_amount.toFixed(2)]}),e.jsxs("td",{children:["₹",t.total_commission.toFixed(2)]})]},t.booking_id))})]})})]})]}):e.jsxs("div",{className:"text-center py-5 no-data",children:[e.jsx("i",{className:"fas fa-receipt fa-3x mb-3"}),e.jsx("p",{children:"No commission payments found. Apply filters to view payments."})]}),e.jsxs(le,{visible:L,onClose:()=>x(!1),children:[e.jsx(ie,{children:e.jsx(re,{children:"Filter Commission Payments"})}),e.jsxs(oe,{children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"subdealerSelect",className:"form-label",children:"Select Subdealer"}),u?e.jsxs("div",{children:[e.jsx(f,{id:"subdealerSelect",value:a?.id||"",disabled:!0,className:"bg-light",children:e.jsx("option",{value:a?.id||"",children:a?.name||"Your Subdealer Account"})}),e.jsx("div",{className:"text-muted small mt-1",children:"Subdealers can only view their own commission payments"})]}):e.jsxs(f,{id:"subdealerSelect",onChange:V,value:a?.id||"",children:[e.jsx("option",{value:"",children:"Select a subdealer..."}),w.map(t=>e.jsxs("option",{value:t.id,children:[t.name," - ",t.location]},t.id))]})]}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-6 mb-3",children:[e.jsx("label",{htmlFor:"monthSelect",className:"form-label",children:"Select Month"}),e.jsx(f,{id:"monthSelect",onChange:W,value:i,children:I.map(t=>e.jsx("option",{value:t.value,children:t.label},t.value))})]}),e.jsxs("div",{className:"col-md-6 mb-3",children:[e.jsx("label",{htmlFor:"yearSelect",className:"form-label",children:"Select Year"}),e.jsx(f,{id:"yearSelect",onChange:q,value:r,children:J.map(t=>e.jsx("option",{value:t.value,children:t.label},t.value))})]})]})]}),e.jsxs(de,{children:[e.jsx(O,{color:"secondary",onClick:K,children:"Clear Filter"}),e.jsx(O,{color:"primary",onClick:H,children:"Apply Filter"})]})]})]}):e.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Commission Payments."})};export{ve as default};
