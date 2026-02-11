import{r as a,g as F,l as R,v as A,j as i,C as G,m as H}from"./index-CD-UhOJ2.js";/* empty css                */import{c as l,a as g}from"./index.esm-BML82zAk.js";/* empty css             */import{d as P,h as M,u as L,A as k,P as T,M as N}from"./DefaultLayout-GrycDKjh.js";import{C as z}from"./CAlert-CENR3-Ss.js";import{C as _}from"./CInputGroup-DQZZOIho.js";import{C as S}from"./CInputGroupText-DHH1Ayfr.js";import{C as V}from"./CFormInput-CCQbnhW2.js";import{c as y}from"./cil-print-CPAcfqxC.js";import{c as Y}from"./cil-reload-6LI_qKMh.js";import"./CNavItem-C1bzmovJ.js";import"./CFormControlWrapper-BAfeeQeh.js";function ot(){const[C,u]=a.useState({chassisNumber:"",amount:""}),[c,r]=a.useState(null),[n,v]=a.useState(!1),[x,o]=a.useState(""),[d,$]=a.useState(null),b=F(),t={particulars:"TVS HELMET",hsnCode:"000000",quantity:2,unitCost:1500,taxableValue:1271.2,cgstRate:9,cgstAmount:114.4,sgstRate:9,sgstAmount:114.4,totalTaxable:1271.2,totalGST:228.8,grandTotal:1500,roundOff:0,netTotal:1500},{permissions:p=[]}=R(),m=P(p,N.SALES,T.SALES.HELMET_INVOICE),f=M(p,N.SALES,T.SALES.HELMET_INVOICE,k.CREATE);a.useEffect(()=>{if(!m){A("You do not have permission to view Helmet Invoice"),b("/dashboard");return}return()=>{d&&clearTimeout(d)}},[d,m,b]);const E=async e=>{if(!e){o("Please enter a chassis number");return}v(!0),o("");try{const s=await H.get(`bookings/chassis/${e}`);s.data.success?r(s.data.data):(o("No booking found for this chassis number"),r(null))}catch(s){o("Failed to fetch invoice details"),r(null),console.error(s)}finally{v(!1)}},I=e=>{const{name:s,value:h}=e.target;u(O=>({...O,[s]:h})),s==="chassisNumber"&&(d&&clearTimeout(d),$(setTimeout(()=>{h.trim().length>0?E(h):(r(null),o(""))},500)))},w=()=>{u({chassisNumber:"",amount:""}),r(null),o("")},D=e=>{const s=new Date(e.createdAt).toLocaleDateString("en-GB");return`
<!DOCTYPE html>
<html>
<head>
    <title>Helmet Invoice</title>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .invoice-wrapper {
            width: 210mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .invoice-body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10mm;
            font-size: 12px;
            color: #000;
        }
        .header-container {
            display: flex;
            justify-content: space-between;
        }
        .left-header {
            display: flex;
            flex-direction: column;
        }
        .invoice-title {
            font-size: 16px;
            font-weight: bold;
            text-align: right;
            align-self: flex-start;
        }
        .info-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3mm;
        }
        .dealer-info, .customer-info {
            text-align: left;
            line-height: 1.2;
            font-size: 14px;
            width: 48%;
        }
        .divider {
            border-top: 2px solid #AAAAAA;
            margin: 1mm 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2mm 0;
            font-size: 12px;
        }
        th, td {
            border: none;
            padding: 1mm 2mm;
            text-align: left;
        }
        .table-border thead tr {
            border-bottom: 2px solid #AAAAAA;
        }
        .table-border tbody tr:nth-child(2) {
            border-top: 2px solid #AAAAAA;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .bold {
            font-weight: bold;
        }
        .part-details {
            margin-top: 5mm;
            font-size: 12px;
        }
        .signature {
            margin-top: 10mm;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
        }
        .last-text {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
        }
        .footer {
            margin-top: 5mm;
            font-size: 14px;
        }
        .logo {
            height: 70px;
        }
        @page {
            size: A4;
            margin: 0;
        }
        @media print {
            html, body {
                background: none;
                display: block;
            }
            .invoice-wrapper {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-wrapper">
        <div class="invoice-body">
            <div class="header-container">
                <div class="left-header">
                    <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="Dealer Logo">
                    <div>Invoice No: ${e.bookingNumber||"21731"}</div>
                    <div>Invoice Date: ${s}</div>
                </div>
                <div class="invoice-title">TAX Invoice</div>
            </div>
        
            <div class="divider"></div>
        
            <div class="info-container">
                <div class="dealer-info">
                    <div class="bold">GANDHI MOTORS</div>
                    <div>'JOGPREET' ASHER ESTATE UPNAGAR, NASHIK ROAD, NASHIK 422101.</div>
                    <div>Phone:</div>
                    <div>GSTIN NO.-27AATC68896K1ZN</div>
                </div>
                <div class="customer-info">
                    <div>${e.customerDetails.salutation||"MR/Mrs/MS."} ${e.customerDetails.name||""}</div>
                    <div>Address: ${e.customerDetails.address||""}</div>
                    <div>Mobile: ${e.customerDetails.mobile1||""}</div>
                    <div>Aadhar: ${e.customerDetails.aadharNumber||""}</div>
                    <div>Bill Type: ${e.payment?.type||""}</div>
                </div>
            </div>
        
            <div class="divider"></div>
        
            <table class="table-border">
                <thead>
                    <tr>
                        <th>Particulars</th>
                        <th>HSN Code</th>
                        <th>Qty</th>
                        <th>Unit Cost</th>
                        <th>Taxable</th>
                        <th>CGST%</th>
                        <th>CGST Amount</th>
                        <th>SGST%</th>
                        <th>SGST Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${t.particulars}</td>
                        <td>${t.hsnCode}</td>
                        <td class="text-right">${t.quantity}</td>
                        <td class="text-right">${t.unitCost.toFixed(2)}</td>
                        <td class="text-right">${t.taxableValue.toFixed(2)}</td>
                        <td class="text-right">${t.cgstRate.toFixed(0)}%</td>
                        <td class="text-right">${t.cgstAmount.toFixed(2)}</td>
                        <td class="text-right">${t.sgstRate.toFixed(0)}%</td>
                        <td class="text-right">${t.sgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="bold">Total</td>
                        <td class="text-right bold">${t.totalTaxable.toFixed(2)}</td>
                        <td class="text-right bold"></td>
                        <td class="text-right bold">${t.cgstAmount.toFixed(2)}</td>
                        <td class="text-right bold"></td>
                        <td class="text-right bold">${t.sgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="text-right bold">GRAND TOTAL</td>
                        <td class="text-right bold">${t.grandTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" >ROUND OFF</td>
                        <td class="text-right">+${t.roundOff.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="text-right bold">NET TOTAL</td>
                        <td class="text-right bold">₹ ${t.netTotal}</td>
                    </tr>
                </tbody>
            </table>
        
            <div class="divider"></div>
            
            <table style="margin-top: 10mm;">
                <tr>
                    <td width="50%"><strong>Description</strong></td>
                    <td width="50%" class="text-right"><strong>Amount</strong></td>
                </tr>
                <tr>
                    <td>Total Taxable</td>
                    <td class="text-right">₹${t.totalTaxable.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Total GST</td>
                    <td class="text-right">₹${t.totalGST.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Grand Total (${t.totalTaxable.toFixed(2)} + ${t.totalGST.toFixed(2)})</td>
                    <td class="text-right">₹${t.grandTotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Round Off</td>
                    <td class="text-right">+${t.roundOff.toFixed(2)}</td>
                </tr>
                <tr>
                    <td><strong>NET TOTAL</strong></td>
                    <td class="text-right"><strong>₹ ${t.netTotal}</strong></td>
                </tr>
            </table>
        
            <div class="divider"></div>
            <table class="table-border">
                <thead>
                    <tr>
                        <th>PART DESCRIPTION</th>
                        <th>FRAME NO</th>
                        <th>ENGINE NO</th>
                        <th>CWI BOOKLET NO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${e.model?.model_name||""}</td>
                        <td>${e.chassisNumber||""}</td>
                        <td>${e.engineNumber||""}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        
            <div class="footer">
                Message from Dealer:- Certified that goods covered by this bill suffered tax at hands of supplier. 
                Vehicle once sold shall not be taken back /replaced for any reason.
            </div>
        
            <div class="divider"></div>
        
            <div class="signature">
                <div>(${e.customerDetails.salutation||"MR/Mrs/MS."} ${e.customerDetails.name||""})</div>
                <div class="bold">For (GANDHI MOTORS)<br> Authorised Signatory</div>
            </div>
            <div class="last-text">Subject To Nashik Jurisdiction</div>
            <div class="divider"></div>
        </div>
    </div>
</body>
</html>
  `},j=()=>{if(!c){o("Please fetch invoice details first");return}if(!f){A("You do not have permission to print Helmet Invoice");return}const e=window.open("","_blank");e.document.write(D(c)),e.document.close(),e.focus()};return m?i.jsxs("div",{className:"invoice-container",children:[i.jsx("h4",{className:"mb-4",children:"Invoice"}),x&&i.jsx(z,{color:"danger",className:"mb-3",children:x}),i.jsxs("div",{className:"p-3",children:[i.jsx("h5",{children:"Helmet Invoice"}),i.jsxs(_,{className:"mb-3",children:[i.jsx(S,{children:i.jsx(l,{className:"icon",icon:L})}),i.jsx(V,{placeholder:"Enter Chassis Number",name:"chassisNumber",value:C.chassisNumber,onChange:I,disabled:n}),n&&i.jsx(S,{children:i.jsx(G,{size:"sm",color:"primary"})})]}),i.jsxs("div",{className:"d-flex gap-2",children:[f?i.jsxs(g,{className:"submit-button",onClick:j,disabled:!c||n,children:[i.jsx(l,{icon:y,className:"me-2"}),"Print"]}):i.jsxs(g,{className:"submit-button",disabled:!0,title:"You don't have permission to print",children:[i.jsx(l,{icon:y,className:"me-2"}),"Print (No Permission)"]}),i.jsxs(g,{className:"cancel-button",onClick:w,disabled:n,children:[i.jsx(l,{icon:Y,className:"me-2"}),"Clear"]})]})]})]}):i.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Helmet Invoice."})}export{ot as default};
