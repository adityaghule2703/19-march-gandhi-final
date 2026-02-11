import{r as o,g as ce,q as de,j as e,m as y,v as b,w as le}from"./index-CD-UhOJ2.js";/* empty css             */import{c as d}from"./index.esm-BML82zAk.js";import{F as me}from"./FormButtons-Cj9XZ_1j.js";/* empty css              */import{t as pe}from"./logo-V-f8m5nN.js";import{C as l}from"./CInputGroup-DQZZOIho.js";import{C as m}from"./CInputGroupText-DHH1Ayfr.js";import{k as v,v as z,x as A,o as ue}from"./DefaultLayout-GrycDKjh.js";import{C as u}from"./CFormSelect-DGopBSdT.js";import{c as V}from"./cil-location-pin-CQr6GRP7.js";import"./CNavItem-C1bzmovJ.js";import"./CFormControlWrapper-BAfeeQeh.js";function Le(){const[t,h]=o.useState({customer_type:"",branch_id:"",booking_id:"",subdealer_id:"",payment_mode:"",bankLocation:"",subPaymentMode:"",cashLocation:"",items:[],invoiceNumber:`INV-${Date.now()}`,date:new Date().toISOString().split("T")[0],customer_id:"",customer_name:"",sales_executive:"",payment_type:"",remark:""}),[r,C]=o.useState({}),[g,E]=o.useState([]),[f,L]=o.useState([]),[N,T]=o.useState([]),[j,S]=o.useState(null),[w,P]=o.useState([]),[_,I]=o.useState(null),[M,q]=o.useState([]),[$,B]=o.useState([]),[R,D]=o.useState([]),[U,F]=o.useState([]),[O,x]=o.useState(null),[he,W]=o.useState(null),[Q,G]=o.useState(!0),H=ce(),{id:xe}=de();o.useEffect(()=>{(async()=>{try{const a=await y.get("/accessories");E(a.data.data.accessories||[])}catch(a){const i=b(a);i&&x(i),E([])}})()},[]),o.useEffect(()=>{(async()=>{G(!0);try{await Promise.all([J(),Z(),K(),X(),ee()])}catch(a){console.error("Error initializing data:",a)}finally{G(!1)}})()},[]);const J=async()=>{try{const s=await y.get("/customers"),a=s.data.data?.customers||s.data.customers||[];L(Array.isArray(a)?a:[])}catch(s){const a=b(s);a&&x(a),L([])}},Z=async()=>{try{const s=await y.get("/branches"),a=s.data.data||s.data||[];P(Array.isArray(a)?a:[])}catch(s){const a=b(s);a&&x(a),P([])}},K=async()=>{try{const s=await y.get("/banksubpaymentmodes"),a=s.data.data||s.data||[];D(Array.isArray(a)?a:[])}catch(s){const a=b(s);a&&x(a),D([])}},X=async()=>{try{const s=await y.get("/cash-locations"),a=s.data.data?.cashLocations||s.data.cashLocations||s.data.data||s.data||[];B(Array.isArray(a)?a:[])}catch(s){const a=b(s);a&&x(a),B([])}},ee=async()=>{try{const s=await y.get("/users"),a=s.data.data?.salesExecutives||s.data.salesExecutives||s.data.data||s.data||[];F(Array.isArray(a)?a:[])}catch(s){const a=b(s);a&&x(a),F([])}};o.useEffect(()=>{(async()=>{try{const a=await y.get("/banks"),i=a.data.data?.banks||a.data.banks||a.data.data||a.data||[];q(Array.isArray(i)?i:[])}catch(a){const i=b(a);i&&x(i),q([])}})()},[]),o.useEffect(()=>{(async()=>{try{const a=await y.get("/subdealers"),i=a.data.data?.subdealers||a.data.subdealers||a.data.data||a.data||[];T(Array.isArray(i)?i:[])}catch(a){console.error("Error fetching subdealers:",a);const i=b(a);i&&x(i),T([])}})()},[]);const p=s=>{const{name:a,value:i}=s.target;if(h(n=>({...n,[a]:i})),C(n=>({...n,[a]:""})),a==="customer_type")i==="SUBDEALER"?(h(n=>({...n,customer_type:i,branch_id:"",booking_id:"",customer_id:"",customer_name:"",sales_executive:"",payment_type:"",payment_mode:"",cashLocation:"",bankLocation:"",subPaymentMode:""})),S(null)):i==="CUSTOMER"&&(h(n=>({...n,customer_type:i,subdealer_id:"",payment_type:"",payment_mode:"",cashLocation:"",bankLocation:"",subPaymentMode:""})),I(null));else if(a==="booking_id"){const n=f.find(c=>c._id===i);n?(S(n),h(c=>({...c,customer_id:n.custId||"",customer_name:n.name||""}))):(S(null),h(c=>({...c,customer_id:"",customer_name:""})))}else if(a==="subdealer_id"){const n=N.find(c=>c._id===i);I(n||null),n&&h(c=>({...c,customer_name:n.name||""}))}else a==="payment_type"&&i==="PAY_LETTER"&&h(n=>({...n,payment_mode:"",cashLocation:"",bankLocation:"",subPaymentMode:""}))},se=s=>{h(a=>{if(a.items.some(n=>n.accessory_id===s))return{...a,items:a.items.filter(n=>n.accessory_id!==s)};{const n=g.find(c=>c._id===s||c.id===s);return n?{...a,items:[...a.items,{accessory_id:s,quantity:1,price:n.price,name:n.name,part_number:n.part_number}]}:a}})},ae=(s,a)=>{a<1||h(i=>{const n=i.items.map(c=>c.accessory_id===s?{...c,quantity:parseInt(a)}:c);return{...i,items:n}})},k=s=>s.price*s.quantity,Y=()=>t.items.reduce((s,a)=>s+k(a),0),te=()=>`
      <div class="invoice">
        <div class="invoice-header">
          <div class="company-info">
            <img src="${pe}" alt="Company Logo" class="company-logo" />
            <p>
              Authorized Main Dealer: TVS Motor Company Ltd.<br>
              Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br> Upnagar, Nashik Road, Nashik, 7498993672<br>
              <strong>GSTIN:</strong>27AAAAP0267H2ZN
            </p>
          </div>
          <div class="invoice-info">
            <h5>INVOICE</h5>
            <p>Invoice #: ${t.invoiceNumber}</p>
            <p>Date: ${new Date(t.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="invoice-body">
          <div class="billing-details">
            <div class="billed-to">
              <h5>Billed To:</h5>
              ${t.customer_type==="CUSTOMER"&&j?`
                <p>${j.name}</p>
                <p>Customer ID: ${j.custId}</p>
                <p>${j.address}</p>
                <p>${j.mobile1}</p>
              `:t.customer_type==="SUBDEALER"&&_?`
                <p>${_.name}</p>
                <p>${_.address}</p>
                <p>${_.contactNumber}</p>
                <p>GSTIN: ${_.gstin}</p>
              `:""}
              ${t.remark?`<p><strong>Remark:</strong> ${t.remark}</p>`:""}
              ${t.customer_type==="CUSTOMER"&&t.payment_type?`<p><strong>Payment Type:</strong> ${t.payment_type==="INSTANT_PAYMENT"?"Instant Payment":"Pay Letter"}</p>`:""}
              ${t.customer_type==="CUSTOMER"&&t.payment_mode?`<p><strong>Payment Mode:</strong> ${t.payment_mode}</p>`:""}
            </div>
          </div>

          <table class="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Part Number</th>
                <th>Price (incl. GST)</th>
                <th>Quantity</th>
                <th>Total (incl. GST)</th>
              </tr>
            </thead>
            <tbody>
              ${t.items.map((s,a)=>`
                <tr key="${s.accessory_id}">
                  <td>${a+1}</td>
                  <td>${s.name}</td>
                  <td>${s.part_number}</td>
                  <td>₹${s.price.toFixed(2)}</td>
                  <td>${s.quantity}</td>
                  <td>₹${k(s).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="text-align: right; font-weight: bold;">
                  Grand Total:
                </td>
                <td></td>
                <td style="font-weight: bold;">₹${Y().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="terms">
            <h5>Terms & Conditions:</h5>
            <p>1. Goods once sold will not be taken back.</p>
            <p>2. Warranty as per company policy.</p>
            <p>3. Subject to Gandhi TVS.</p>
          </div>

          <div class="signature">
            <p>Authorized Signature</p>
          </div>
        </div>
      </div>
    `,ne=()=>{const s=window.open("","_blank","width=1000,height=700"),a=te();s.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${t.invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #f5f5f5;
          }
          .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .invoice {
            border: 1px solid #ddd;
            padding: 20px;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #ddd;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .company-info {
            flex: 2;
          }
          .company-logo {
            max-width: 120px;
            margin-bottom: 10px;
          }
          .invoice-info {
            flex: 1;
            text-align: right;
          }
          .invoice-info h5 {
            margin: 0 0 10px 0;
            font-size: 24px;
            color: #333;
          }
          .billing-details {
            margin-bottom: 20px;
          }
        
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .invoice-table th, .invoice-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          .invoice-table th {
            background-color: #f5f5f5;
          }
          .terms {
            margin-bottom: 30px;
          }
          .terms h5 {
            margin-bottom: 10px;
          }
          .signature {
            margin-top: 60px;
            text-align: right;
          }
          .print-instructions {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .print-buttons {
            text-align: center;
            margin: 20px 0;
          }
          .print-buttons button {
            margin: 0 10px;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          .btn-print {
            background-color: #007bff;
            color: white;
          }
          .btn-close {
            background-color: #6c757d;
            color: white;
          }
          @media print {
            body {
              padding: 0;
              background-color: white;
            }
            .invoice-container {
              box-shadow: none;
              padding: 0;
            }
            .invoice {
              border: none;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${a}
          
          <div class="print-instructions no-print">
            <h3>Invoice Ready</h3>
            <p>Your invoice has been generated successfully. You can:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>Press <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac) to print</li>
              <li>Use the print button below</li>
              <li>Right-click and select "Print" from the menu</li>
            </ul>
          </div>
          
          <div class="print-buttons no-print">
            <button class="btn-print" onclick="window.print()">Print Invoice</button>
            <button class="btn-close" onclick="window.close()">Close Window</button>
          </div>
        </div>
        
        <script>
          // Auto-focus on the new window and attempt to print
          window.focus();
        <\/script>
      </body>
      </html>
    `),s.document.close()},ie=async s=>{s.preventDefault();let a={};if(t.customer_type||(a.customer_type="Type is required"),t.customer_type==="CUSTOMER"?(t.booking_id||(a.booking_id="Customer is required"),t.branch_id||(a.branch_id="Branch is required"),t.sales_executive||(a.sales_executive="Sales Executive is required"),t.payment_type||(a.payment_type="Payment Type is required"),t.payment_type==="INSTANT_PAYMENT"&&(t.payment_mode||(a.payment_mode="Payment Mode is required"),t.payment_mode==="Cash"&&!t.cashLocation&&(a.cashLocation="Cash Location is required"),t.payment_mode==="Bank"&&(t.subPaymentMode||(a.subPaymentMode="Submode is required"),t.bankLocation||(a.bankLocation="Bank Location is required")))):t.customer_type==="SUBDEALER"&&(t.subdealer_id||(a.subdealer_id="Subdealer is required")),t.items.length===0&&(a.items="Please select at least one accessory"),Object.keys(a).length>0){C(a);return}await oe()},re=()=>{H(-1)},oe=async()=>{try{let s={customer_type:t.customer_type,items:t.items.map(i=>({accessory_id:i.accessory_id,quantity:i.quantity})),remark:t.remark||""};t.customer_type==="CUSTOMER"?(s={...s,branch_id:t.branch_id,booking_id:t.booking_id,customer_id:t.customer_id,customer_name:t.customer_name,sales_executive:t.sales_executive,payment_type:t.payment_type},t.payment_type==="INSTANT_PAYMENT"&&(s.payment_mode=t.payment_mode,t.payment_mode==="Cash"?s.cashLocation=t.cashLocation:t.payment_mode==="Bank"&&(s.subPaymentMode=t.subPaymentMode,s.bankLocation=t.bankLocation))):t.customer_type==="SUBDEALER"&&(s={...s,subdealer_id:t.subdealer_id});const a=await y.post("/accessory-billing",s);W(a.data.data._id),le("Invoice saved successfully!"),ne()}catch(s){console.error("Error saving invoice:",s);const a=b(s);a&&x(a)}};return Q?e.jsx("div",{className:"form-container",children:"Loading..."}):O?e.jsx("div",{className:"alert alert-danger",role:"alert",children:O}):e.jsxs("div",{className:"form-container",children:[e.jsx("div",{className:"title",children:"Accessories Billing"}),e.jsx("div",{className:"form-card",children:e.jsx("div",{className:"form-body",children:e.jsxs("form",{onSubmit:ie,children:[e.jsxs("div",{className:"user-details",children:[e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Type"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:v})}),e.jsxs(u,{name:"customer_type",value:t.customer_type,onChange:p,children:[e.jsx("option",{value:"",children:"-Select-"}),e.jsx("option",{value:"CUSTOMER",children:"Customer"}),e.jsx("option",{value:"SUBDEALER",children:"Subdealer"})]})]}),r.customer_type&&e.jsx("p",{className:"error",children:r.customer_type})]}),t.customer_type==="CUSTOMER"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Branch"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:V})}),e.jsxs(u,{name:"branch_id",value:t.branch_id,onChange:p,children:[e.jsx("option",{value:"",children:"-Select-"}),Array.isArray(w)&&w.map(s=>e.jsx("option",{value:s._id,children:s.name},s._id))]})]}),r.branch_id&&e.jsx("p",{className:"error",children:r.branch_id})]}),e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Customer"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:v})}),e.jsxs(u,{name:"booking_id",value:t.booking_id,onChange:p,children:[e.jsx("option",{value:"",children:"-Select-"}),Array.isArray(f)&&f.map(s=>e.jsxs("option",{value:s._id,children:[s.name," (ID: ",s.custId,")"]},s._id))]})]}),r.booking_id&&e.jsx("p",{className:"error",children:r.booking_id})]}),e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Sales Executive"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:v})}),e.jsxs(u,{name:"sales_executive",value:t.sales_executive,onChange:p,children:[e.jsx("option",{value:"",children:"-Select-"}),Array.isArray(U)&&U.map(s=>e.jsx("option",{value:s._id,children:s.name},s._id))]})]}),r.sales_executive&&e.jsx("p",{className:"error",children:r.sales_executive})]}),e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Payment Type"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:z})}),e.jsxs(u,{name:"payment_type",value:t.payment_type,onChange:p,children:[e.jsx("option",{value:"",children:"-Select-"}),e.jsx("option",{value:"INSTANT_PAYMENT",children:"Instant Payment"}),e.jsx("option",{value:"PAY_LETTER",children:"Pay Letter"})]})]}),r.payment_type&&e.jsx("p",{className:"error",children:r.payment_type})]}),t.payment_type==="INSTANT_PAYMENT"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Payment Mode"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:z})}),e.jsxs(u,{name:"payment_mode",value:t.payment_mode,onChange:p,children:[e.jsx("option",{value:"",children:"-Select-"}),e.jsx("option",{value:"Cash",children:"Cash"}),e.jsx("option",{value:"Bank",children:"Bank"})]})]}),r.payment_mode&&e.jsx("p",{className:"error",children:r.payment_mode})]}),t.payment_mode==="Bank"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Submode"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:A})}),e.jsxs(u,{name:"subPaymentMode",value:t.subPaymentMode,onChange:p,children:[e.jsx("option",{value:"",children:"-Select-"}),Array.isArray(R)&&R.map(s=>e.jsx("option",{value:s._id,children:s.payment_mode},s._id))]})]}),r.subPaymentMode&&e.jsx("p",{className:"error",children:r.subPaymentMode})]}),e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Bank Location"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:A})}),e.jsxs(u,{name:"bankLocation",value:t.bankLocation,onChange:p,invalid:!!r.bankLocation,children:[e.jsx("option",{value:"",children:"-Select-"}),Array.isArray(M)&&M.map(s=>e.jsx("option",{value:s._id,children:s.name},s._id))]})]}),r.bankLocation&&e.jsx("p",{className:"error",children:r.bankLocation})]})]}),t.payment_mode==="Cash"&&e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Cash Location"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:A})}),e.jsxs(u,{name:"cashLocation",value:t.cashLocation,onChange:p,invalid:!!r.cashLocation,children:[e.jsx("option",{value:"",children:"-Select-"}),Array.isArray($)&&$.map(s=>e.jsx("option",{value:s._id,children:s.name},s._id))]})]}),r.cashLocation&&e.jsx("p",{className:"error",children:r.cashLocation})]})]}),t.customer_id&&e.jsxs("div",{className:"input-box",children:[e.jsx("div",{className:"details-container",children:e.jsx("span",{className:"details",children:"Customer ID"})}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:v})}),e.jsx("input",{type:"text",className:"form-control",value:t.customer_id,readOnly:!0,disabled:!0})]})]})]}),t.customer_type==="SUBDEALER"&&e.jsxs("div",{className:"input-box",children:[e.jsxs("div",{className:"details-container",children:[e.jsx("span",{className:"details",children:"Subdealer"}),e.jsx("span",{className:"required",children:"*"})]}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:V})}),e.jsxs(u,{name:"subdealer_id",value:t.subdealer_id,onChange:p,children:[e.jsx("option",{value:"",children:"-Select-"}),Array.isArray(N)&&N.map(s=>e.jsx("option",{value:s._id,children:s.name},s._id))]})]}),r.subdealer_id&&e.jsx("p",{className:"error",children:r.subdealer_id})]}),e.jsxs("div",{className:"input-box",children:[e.jsx("div",{className:"details-container",children:e.jsx("span",{className:"details",children:"Remark"})}),e.jsxs(l,{children:[e.jsx(m,{className:"input-icon",children:e.jsx(d,{icon:ue})}),e.jsx("input",{type:"text",className:"form-control",name:"remark",value:t.remark,onChange:p,placeholder:"Enter any remarks"})]})]})]}),e.jsx("div",{className:"offer-container",children:e.jsxs("div",{className:"permissions-form",children:[e.jsxs("h4",{children:["Select Accessories ",e.jsx("span",{className:"required",children:"*"})]}),e.jsxs("div",{className:"permissions-grid",children:[Array.isArray(g)&&g.map(s=>{const a=s._id||s.id,i=t.items.some(n=>n.accessory_id===a);return e.jsxs("div",{className:"permission-item accessory-item",children:[e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",checked:i,onChange:()=>se(a)}),s.name," - ₹",s.price.toFixed(2)," (incl. GST)"]}),i&&e.jsxs("div",{className:"quantity-control",children:[e.jsx("span",{children:"Qty: "}),e.jsx("input",{type:"number",min:"1",value:t.items.find(n=>n.accessory_id===a)?.quantity||1,onChange:n=>ae(a,n.target.value),className:"quantity-input"})]})]},a)}),r.items&&e.jsx("p",{className:"error",children:r.items})]})]})}),e.jsxs("div",{className:"selected-items",children:[e.jsx("h4",{children:"Selected Accessories"}),t.items.length>0?e.jsxs("ul",{children:[t.items.map(s=>e.jsxs("li",{children:[s.name," - ₹",s.price," x ",s.quantity," = ₹",k(s).toFixed(2)]},s.accessory_id)),e.jsxs("li",{className:"total",children:["Grand Total: ₹",Y().toFixed(2)]})]}):e.jsx("p",{children:"No accessories selected"})]}),e.jsx(me,{onCancel:re,submitText:"Save Invoice"})]})})})]})}export{Le as default};
