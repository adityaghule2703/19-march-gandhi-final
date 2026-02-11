import{r as n,l as Y,v as y,m as h,j as t}from"./index-CD-UhOJ2.js";/* empty css              *//* empty css             */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as G,g as V}from"./tableFilters-DsQgHBMv.js";import{t as K}from"./logo-V-f8m5nN.js";import{a as x,c as A}from"./index.esm-BML82zAk.js";import{d as W,h as J,A as q,P as k,M as L}from"./DefaultLayout-GrycDKjh.js";import{C as Q,a as X}from"./CCardBody-BS7SU2uX.js";import{C as Z}from"./CCardHeader-CGdtZMoU.js";import{C as ee}from"./CAlert-CENR3-Ss.js";import{C as te}from"./CFormControlWrapper-BAfeeQeh.js";import{C as se}from"./CFormInput-CCQbnhW2.js";import{C as ae,a as oe,b as N,c as l,d as re,e as d}from"./CTable-CzW9ULzA.js";import{c as w}from"./cil-print-CPAcfqxC.js";import"./slicedToArray-Dby63wcm.js";import"./CNavItem-C1bzmovJ.js";const Se=()=>{const{setData:I,filteredData:D,setFilteredData:O,handleFilter:B}=G([]),[m,c]=n.useState(null),[R,U]=n.useState(""),[u,ie]=n.useState({chassisNumber:""}),[ne,b]=n.useState(null),[de,C]=n.useState(!1),[j,P]=n.useState([]),{permissions:S,user:g}=Y(),E=g?.roles?.some(e=>e.name==="SUBDEALER"),T=g?.subdealer?._id;g?.subdealer?.name;const f=W(S,L.SUBDEALER_BOOKING,k.SUBDEALER_BOOKING.DELIVERY_CHALLAN),p=J(S,L.SUBDEALER_BOOKING,k.SUBDEALER_BOOKING.DELIVERY_CHALLAN,q.PRINT);n.useEffect(()=>{if(!f){y("You do not have permission to view Delivery Challan");return}H()},[f]);const H=async()=>{try{let e="/bookings";E&&T&&(e+=`?subdealer=${T}`);const a=(await h.get(e)).data.data.bookings.filter(o=>o.bookingType==="SUBDEALER"&&o.status==="ALLOCATED");I(a),O(a)}catch(e){const s=y(e);s&&c(s)}};n.useEffect(()=>{(async()=>{try{const s=await h.get("/declarations?formType=delivery_challan");if(s.data.status==="success"){const a=s.data.data.declarations.sort((o,r)=>o.priority-r.priority);P(a)}}catch(s){console.error("Error fetching declarations:",s)}})()},[]),n.useEffect(()=>{const e=setTimeout(()=>{u.chassisNumber.trim().length>0&&F()},500);return()=>clearTimeout(e)},[u.chassisNumber]);const F=async()=>{C(!0),c("");try{const e=await h.get(`/bookings/chassis/${u.chassisNumber}`);e.data.success?b(e.data.data):(c("No booking found for this chassis number"),b(null))}catch(e){c("Failed to fetch booking details"),console.error(e),b(null)}finally{C(!1)}},$=()=>j.length===0?`
        I/We Authorized the dealer or its representative to register the vehicle at RTO In my/Our name as booked by us,
        However getting the vehicle insured from Insurance company & getting the vehicle registered from RTO is entirely
        my/our sole responsibility. Registration Number allotted by RTO will be acceptable to me else I will pre book for
        choice number at RTO at my own. Dealership has no role in RTO Number allocation I/We am/are exclusively responsible
        for any loss/penalty/Legal action- occurred due to non-compliance of /Delay in Insurance or RTO registration. I have
        understood and accepted all T & C about warranty as per the Warranty policy of TVS MOTOR COMPANY Ltd & agree to abide
        the same. I have also understood & accepted that the warranty for Tyres & Battery Lies with concerned Manufacturer or
        its dealer & I will not claim for warranty of these products to TVS MOTOR COMPANY or to Its Dealer I am being informed
        about the price breakup, I had understood & agreed upon the same & then had booked the vehicle, I am bound to pay penal
        interest @ 24% P.A. on delayed payment. I accept that vehicle once sold by dealer shall not be taken back /replaced for
        any reason.
      `:j.map(e=>e.content).join("<br/><br/>"),v=async(e,s)=>{if(!p){y("You do not have permission to print delivery challan");return}if(!e){c("No booking data found");return}try{const a=await h.get(`/bookings/chassis/${e.chassisNumber}`);if(a.data.success){const o=a.data.data,r=window.open("","_blank");s==="Helmet"?r.document.write(z(o)):r.document.write(M(o,s)),r.document.close(),r.focus()}else c("Failed to fetch booking details for printing")}catch(a){c("Error fetching booking details"),console.error(a)}},M=(e,s)=>{const a=new Date().toLocaleDateString("en-GB"),o=e.bookingType==="SUBDEALER"?e.subdealer?.name||"N/A":e.customerDetails.name,r=e.bookingType==="SUBDEALER"?e.subdealer?.location||"N/A":`${e.customerDetails.address}, ${e.customerDetails.taluka}, ${e.customerDetails.district}`;return`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sale/Delivery Challan - ${s}</title>
        <style>
          body {
            font-family: Courier New;
            margin: 0;
            padding: 0;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 5mm;
            box-sizing: border-box;
          }
          .header-container {
            display: flex;
            align-items: center;
            margin-bottom: 5mm;
          }
          .logo {
            width: 30mm;
            height: auto;
            margin-right: 5mm;
          }
          .header-text {
            color:#555555;
            flex-grow: 1;
            text-align: center;
            font-size: 21px;
            font-weight: 700;
          }

          table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 5mm;
}
td {
  padding: 1mm 0;
  font-size: 11pt;
}
tr.border-top-bottom td {
  padding: 1mm;
  width: auto;
}

tr.data-row td:nth-child(1) {
  width: 25%;
  padding-right: 1mm;
}
tr.data-row td:nth-child(2) {
  width: 3%;
  padding: 0;
}
tr.data-row td:nth-child(3),
tr.data-row td:nth-child(4) {
  width: auto;
  padding-left: 1mm;
}
          .border-top-bottom {
           border-top: 2px solid #AAAAAA;
           border-bottom: 2px solid #AAAAAA;
          }
          .declaration {
            font-size: 11px;
            text-align: justify;
            line-height: 1.3;
            color: #555555;
          }
          .signature {
            text-align: right;
            margin-top: 10mm;
          }
          .account-details{
          color:#555555;
          font-weight:bold;
          }
          .signature-box {
            border-top: 2px solid #AAAAAA;
            border-bottom: 2px solid #AAAAAA;
            padding: 1px 0;
            text-align: right;
            color:#555555;
           font-weight:bold;
          }
          .jurisdiction {
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            color: #555555
          }
          .bold {
          font-weight: 700;
          color:#555555;

           }
          .divider {
            margin: 5mm 0;
            padding: 2mm 0;
          }
          .copy-title {
            text-align: center;
            color:#555555;
            font-size: 21px;
            margin-bottom: 5mm;
            font-weight: 700;
          }
          @page {
            size: A4;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- Customer Copy -->
          <div class="header-container">
            <img src="${K}" class="logo" alt="TVS Logo">
            <div class="header-text"> Sale / Delivery challan</div>
          </div>

          <table>
            <tr class="border-top-bottom">
              <td width="20%">Booking No.:</td>
              <td width="25%"><span class="bold">${e.bookingNumber||"N/A"}</span></td>
              <td width="15%">Sales Date</td>
              <td width="40%"><span class="bold">${a}</span></td>
            </tr>
            <tr class="data-row">
             <td>${e.bookingType==="SUBDEALER"?"Subdealer Name":"Name"}</td>
              <td>:</td>
              <td><span class="bold">${o}</span></td>
            </tr>
            <tr class="data-row">
              <td>${e.bookingType==="SUBDEALER"?"Subdealer Address":"Address"}</td>
              <td>:</td>
              <td colspan="2"><span class="bold">${r}</span></td>
            </tr>
            <tr class="data-row">
              <td>S.E Name</td>
              <td>:</td>
              <td colspan="2"><span class="bold">${e.salesExecutive?.name||"N/A"}</span></td>
            </tr>
            <tr class="data-row">
              <td>Model</td>
              <td>:</td>
              <td><span class="bold">${e.model?.model_name||""}</span></td>
              <td>Colour : <span class="bold">${e.color?.name||"N/A"}</span></td>
            </tr>
            <tr class="data-row">
              <td>Chasis No</td>
              <td>:</td>
              <td><span class="bold">${e.chassisNumber||""}</span></td>
              <td>Key No. : <span class="bold">${e.keyNumber||"0"}</span></td>
            </tr>
            <tr class="data-row">
              <td>Engine No</td>
              <td>:</td>
              <td><span class="bold">${e.engineNumber||""}</span></td>
              <td></td>
            </tr>
            <tr class="data-row">
              <td>Financer</td>
              <td>:</td>
              <td colspan="2"><span class="bold">${e.payment.financer?.name||""}</span></td>
            </tr>
            <tr class="data-row">
              <td>Total</td>
              <td>:</td>
              <td><span class="bold">₹${e.totalAmount}</span></td>
              <td>Grand Total : <span class="bold">₹${e.discountedAmount}</span></td>
            </tr>
          </table>
           <div class='account-details'>ACC.DETAILS:
 ${e.accessories.map(i=>i.accessory?i.accessory.name:"").filter(i=>i).join(", ")}
           </div>
          <div class="signature-box">
            <div><b>Authorised Signature</b></div>
          </div>

          <p class="bold">Customer Declarations:</p>
          <p class="declaration">
            ${$()}
          </p>

          <div>
            <p class="bold">Customer Signature</p>
          </div>

          <p class="jurisdiction">Subject To Sangamner Jurisdiction</p>

          <!-- Office Copy -->
          <div style="page-break-before: always; margin-top: 10mm;">
            <div class="copy-title">Sale / Delivery challan</div>

            <table>
              <tr class="border-top-bottom">
                <td width="20%">Booking No.:</td>
                <td width="25%"><span class="bold">${e.bookingNumber||"N/A"}</span></td>
                <td width="15%">Sales Date</td>
                <td width="40%"><span class="bold">${a}</span></td>
              </tr>
              <tr>
                <td>${e.bookingType==="SUBDEALER"?"Subdealer Name":"Name"}</td>
                <td>:</td>
                <td colspan="2"><span class="bold">${o}</span></td>
              </tr>
              <tr>
                <td>${e.bookingType==="SUBDEALER"?"Subdealer Address":"Address"}</td>
                <td>:</td>
                <td colspan="2"><span class="bold">${r}</span></td>
              </tr>
              <tr>
                <td>S.E Name</td>
                <td>:</td>
                <td colspan="2"><span class="bold">${e.salesExecutive?.name||""}</span></td>
              </tr>
              <tr>
                <td>Model</td>
                <td>:</td>
                <td><span class="bold">${e.model.model_name||""}</span></td>
                <td>Colour : <span class="bold">${e.color?.name||"N/A"}</span></td>
              </tr>
              <tr>
                <td>Chasis No</td>
                <td>:</td>
                <td><span class="bold">${e.chassisNumber||""}</span></td>
                <td>Key No. : <span class="bold">${e.keyNumber||"0"}</span></td>
              </tr>
              <tr>
                <td>Engine No</td>
                <td>:</td>
                <td><span class="bold">${e.engineNumber}</span></td>
                <td></td>
              </tr>
              <tr>
                <td>Financer</td>
                <td>:</td>
                <td colspan="2"><span class="bold">${e.payment.financer?.name||""}</span></td>
              </tr>
              <tr>
                <td>Total</td>
                <td>:</td>
                <td><span class="bold">₹${e.totalAmount}</span></td>
                <td>Grand Total: <span class="bold">₹${e.discountedAmount}</span></td>
              </tr>
            </table>

            <div class='account-details'>ACC.DETAILS:
             ${e.accessories.map(i=>i.accessory?i.accessory.name:"").filter(i=>i).join(", ")}
            </div>
            <div class="signature-box">
              <div><b>Authorised Signature</b></div>
            </div>

            <p class="bold">Customer Declarations:</p>
            <p class="declaration">
              ${$()}
            </p>

            <div>
              <p class="bold">Customer Signature</p>
            </div>

            <p class="jurisdiction">Subject To Sangamner Jurisdiction</p>
          </div>
        </div>
      </body>
      </html>
    `},z=e=>{const s=new Date,a=s.getDate().toString().padStart(2,"0"),o=(s.getMonth()+1).toString().padStart(2,"0"),r=s.getFullYear(),i=`${a}/${o}/${r}`;return`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Helmet Declaration</title>
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
        .declaration-wrapper {
            width: 210mm;
            margin: 20px 0;
        }
        .declaration-body {
            font-family: 'Arial Unicode MS', 'Shivaji01', 'Shivaji02', sans-serif;
            margin: 15mm;
            padding: 0;
            font-size: 12pt;
            line-height: 1.4;
        }
        @page {
            size: A4;
            margin: 0;
        }
        .header {
            text-align: center;
            font-weight: bold;
            font-size: 18pt;
            margin-bottom: 10mm;
        }
        .content {
            margin-bottom: 5mm;
            text-align:center;
        }
        .customer-info {
            margin-bottom: 10mm;
        }
        .customer-info-row {
            margin-bottom: 2mm;
        }
        .bold {
            font-weight: bold;
        }
        .signature {
            margin-top: 15mm;
            display:flex;
            justify-content:space-between;
        }
        .jurisdiction {
            text-align: center;
            margin-top: 10mm;
            font-weight: bold;
        }
        .vehicle-details {
            margin: 5mm 0;
        }
        .declaration {
            margin-top: 10mm;
            text-align: justify;
        }
        .divider {
            border-top: 2px solid #AAAAAA;
            margin: 1mm 0;
        }
        @media print {
            html, body {
                background: none;
                display: block;
            }
            .declaration-wrapper {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="declaration-wrapper">
        <div class="declaration-body">
            <div class="header">
                हेल्मेट प्राप्ती घोषणापत्र
            </div>

            <div class="content">
                केंद्रीय मोटर वाहन नियम १३८ { ४ } { फ }
            </div>
            <div class="divider"></div>
            <div class="declaration">
                <p>
                    मी..${e.customerDetails.name}, असे घोषित करतो कि

                    दि. ${i} रोजी गांधी मोटार टि व्हि यस नासिक

                    या वितरकाकडून टि व्हि यस..${e.model.model_name}, हे वाहन खरेदी केले आहे.

                    त्याचा तपशील खालील प्रमाणे...
                </p>
                <div class="vehicle-details">
                    <div class="customer-info-row"><strong>चेसिस नंबर:</strong> ${e.chassisNumber}</div>
                    <div class="customer-info-row"><strong>इंजिन नंबर:</strong> ${e.engineNumber}</div>
                </div>

                <p>
                    केंद्रीय मोटर वाहन नियम १३८ { ४ } { फ } प्रमाणे वितरकाने दुचाकी वितरीत करते वेळी विहित
                    मानाकनाचे २ (दोन) हेल्मेट पुरवणे/विकत देणे बंधनकारक आहे. त्याचप्रमाणे मला BUREAU OF INDIA STANDARS
                    UNDER THE BUREAU OF INDIA ACT-1986 { 63 TO 1986 } या प्रमाणे हेल्मेट मिळाले आहे.
                </p>
                <p>
                    मी याद्वारे जाहीर करतो/करते की वर दिलेला तपशील माझ्या संपूर्ण माहिती प्रमाणे व तपासा्रमाणे सत्य आहे.
                </p>
            </div>

            <div class="signature">
                <div>
                    स्वाक्षरी व शिक्का
                    <br>
                    गांधी मोटर्स<br>
                    नासिक
                </div>
                <div>
                    दुचाकी खरेदिदाराची स्वाक्षरी<br>
                    नाव :- ${e.customerDetails.name}
                </div>
            </div>

            <div class="jurisdiction">
                Subject To Nashik Jurisdiction
            </div>
        </div>
    </div>
</body>
</html>
    `},_=e=>{B(e,V("booking"))};return f?m?t.jsx("div",{className:"alert alert-danger",role:"alert",children:m}):t.jsxs("div",{children:[t.jsx("div",{className:"title",children:"Delivery Challan/Helmet Declaration"}),t.jsxs(Q,{className:"table-container mt-4",children:[t.jsx(Z,{className:"card-header d-flex justify-content-between align-items-center"}),t.jsxs(X,{children:[m&&t.jsx(ee,{color:"danger",children:m}),t.jsxs("div",{className:"d-flex justify-content-between mb-3",children:[t.jsx("div",{}),t.jsxs("div",{className:"d-flex",children:[t.jsx(te,{className:"mt-1 m-1",children:"Search:"}),t.jsx(se,{type:"text",className:"d-inline-block square-search",value:R,onChange:e=>{U(e.target.value),_(e.target.value)},placeholder:"Search bookings..."})]})]}),t.jsx("div",{className:"responsive-table-wrapper",children:t.jsxs(ae,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[t.jsx(oe,{children:t.jsxs(N,{children:[t.jsx(l,{children:"Sr.no"}),t.jsx(l,{children:"Booking ID"}),t.jsx(l,{children:"Model Name"}),t.jsx(l,{children:"Customer Name"}),t.jsx(l,{children:"Chassis Number"}),t.jsx(l,{children:"Customer Copy"}),t.jsx(l,{children:"Office Copy"}),t.jsx(l,{children:"Helmet Declaration"})]})}),t.jsx(re,{children:D.length>0?D.map((e,s)=>t.jsxs(N,{children:[t.jsx(d,{children:s+1}),t.jsx(d,{children:e.bookingNumber}),t.jsx(d,{children:e.model?.model_name||""}),t.jsx(d,{children:e.customerDetails?.name||""}),t.jsx(d,{children:e.chassisNumber||""}),t.jsx(d,{children:p?t.jsxs(x,{size:"sm",className:"action-btn",onClick:()=>v(e,"Customer Copy"),children:[t.jsx(A,{icon:w,className:"icon"})," Print"]}):t.jsx("span",{className:"text-muted",children:"No permission"})}),t.jsx(d,{children:p?t.jsxs(x,{size:"sm",className:"action-btn",onClick:()=>v(e,"Office Copy"),children:[t.jsx(A,{icon:w,className:"icon"})," Print"]}):t.jsx("span",{className:"text-muted",children:"No permission"})}),t.jsx(d,{children:p?t.jsxs(x,{size:"sm",className:"action-btn",onClick:()=>v(e,"Helmet"),children:[t.jsx(A,{icon:w,className:"icon"})," Print"]}):t.jsx("span",{className:"text-muted",children:"No permission"})})]},s)):t.jsx(N,{children:t.jsx(d,{colSpan:"8",className:"text-center",children:E?"No delivery challans available for your account":"No data available"})})})]})})]})]})]}):t.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Delivery Challan."})};export{Se as default};
