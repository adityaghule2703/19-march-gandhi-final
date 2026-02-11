import{r as n,g as se,l as ae,v as m,m as h,j as t,C as I}from"./index-CD-UhOJ2.js";/* empty css              */import"./index-vcvjuoBI.js";import"./jspdf.plugin.autotable-k796q59y.js";import{u as oe,g as ne}from"./tableFilters-DsQgHBMv.js";import{u as re}from"./pagination-B7oNW1il.js";import{d as ie,h as le,A as de,P as O,M as R,t as B}from"./DefaultLayout-GrycDKjh.js";import{a as u,c as p}from"./index.esm-BML82zAk.js";import{C as ce}from"./CAlert-CENR3-Ss.js";import{C as me,a as pe}from"./CCardBody-BS7SU2uX.js";import{C as he}from"./CCardHeader-CGdtZMoU.js";import{C as ue}from"./CFormControlWrapper-BAfeeQeh.js";import{C as ge}from"./CFormInput-CCQbnhW2.js";import{C as be,a as fe,b as j,c,d as xe,e as l}from"./CTable-CzW9ULzA.js";import{c as w}from"./cil-print-CPAcfqxC.js";import{C as ve,a as ye,b as Ne,c as je,d as we}from"./CModalTitle-Cs0DhY3v.js";import"./slicedToArray-Dby63wcm.js";import"./createSvgIcon-70ImKnSA.js";import"./clsx-B-dksMZM.js";import"./DefaultPropsProvider-BOWM1HCk.js";import"./extends-CF3RwP-h.js";import"./emotion-element-f0de968e.browser.esm-B3DMWKMu.js";import"./CNavItem-C1bzmovJ.js";const qe=()=>{const{setData:M,filteredData:z,setFilteredData:_,handleFilter:P}=oe([]),{currentRecords:C}=re(z),[b,d]=n.useState(null),[F,g]=n.useState(!0),[H,U]=n.useState(""),Y=se(),[f,Ce]=n.useState({chassisNumber:""}),[Ae,A]=n.useState(null),[D,V]=n.useState([]),[W,x]=n.useState(!1),[De,v]=n.useState(null),[S,y]=n.useState([]),[J,T]=n.useState(!1),{permissions:$=[]}=ae(),E=ie($,R.SALES,O.SALES.DELIVERY_CHALLAN),N=le($,R.SALES,O.SALES.DELIVERY_CHALLAN,de.CREATE);n.useEffect(()=>{if(!E){m("You do not have permission to view Delivery Challan"),Y("/dashboard");return}G()},[]),n.useEffect(()=>{(async()=>{try{const s=await h.get("/declarations?formType=delivery_challan");if(s.data.status==="success"){const a=s.data.data.declarations.sort((o,i)=>o.priority-i.priority);V(a)}}catch(s){const a=m(s);a&&d(a)}})()},[]),n.useEffect(()=>{const e=setTimeout(()=>{f.chassisNumber.trim().length>0&&K()},500);return()=>clearTimeout(e)},[f.chassisNumber]);const G=async()=>{try{g(!0);const s=(await h.get("/bookings")).data.data.bookings.filter(a=>a.bookingType==="BRANCH"&&a.status==="ALLOCATED");M(s),_(s)}catch(e){const s=m(e);s&&d(s)}finally{g(!1)}},K=async()=>{g(!0),d("");try{const e=await h.get(`/bookings/chassis/${f.chassisNumber}`);e.data.success?A(e.data.data):(d("No booking found for this chassis number"),A(null))}catch{const s=m(b);s&&d(s)}finally{g(!1)}},q=async e=>{try{T(!0),v(e);const s=await h.get(`/booking-templates/selected/${e}`);y(s.data.data.selections||[]),x(!0)}catch(s){const a=m(s);a&&d(a)}finally{T(!1)}},Q=async(e,s)=>{try{const o=(await h.get(`/booking-templates/preview/${e}`)).data.data,i=window.open("","_blank");i.document.write(ee(o)),i.document.close(),i.focus()}catch(a){const o=m(a);o&&d(o)}},k=()=>D.length===0?`
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
      `:D.map(e=>e.content).join("<br/><br/>"),L=(e,s)=>{if(!e){d("No booking data found");return}if(!N){m("You do not have permission to print delivery challan");return}const a=window.open("","_blank");s==="Helmet"?a.document.write(Z(e)):a.document.write(X(e,s)),a.document.close(),a.focus()},X=(e,s)=>{const a=new Date().toLocaleDateString("en-GB"),o=e.bookingType==="SUBDEALER"?e.subdealer?.name||"N/A":e.customerDetails.name,i=e.bookingType==="SUBDEALER"?e.subdealer?.location||"N/A":`${e.customerDetails.address}, ${e.customerDetails.taluka}, ${e.customerDetails.district}`;return`
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
            <img src="${B}" class="logo" alt="TVS Logo">
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
              <td colspan="2"><span class="bold">${i}</span></td>
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
              <td><span class="bold">₹${e.discountedAmount}</span></td>
            </tr>
          </table>
           <div class='account-details'>ACC.DETAILS:
 ${e.accessories.map(r=>r.accessory?r.accessory.name:"").filter(r=>r).join(", ")}
           </div>
          <div class="signature-box">
            <div><b>Authorised Signature</b></div>
          </div>

          <p class="bold">Customer Declarations:</p>
          <p class="declaration">
            ${k()}
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
                <td colspan="2"><span class="bold">${i}</span></td>
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
                <td><span class="bold">₹${e.discountedAmount}</span></td>
            </tr>
            </table>

            <div class='account-details'>ACC.DETAILS:
             ${e.accessories.map(r=>r.accessory?r.accessory.name:"").filter(r=>r).join(", ")}
            </div>
            <div class="signature-box">
              <div><b>Authorised Signature</b></div>
            </div>

            <p class="bold">Customer Declarations:</p>
            <p class="declaration">
              ${k()}
            </p>

            <div>
              <p class="bold">Customer Signature</p>
            </div>

            <p class="jurisdiction">Subject To Sangamner Jurisdiction</p>
          </div>
        </div>
      </body>
      </html>
    `},Z=e=>{const s=new Date,a=s.getDate().toString().padStart(2,"0"),o=(s.getMonth()+1).toString().padStart(2,"0"),i=s.getFullYear(),r=`${a}/${o}/${i}`;return`
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

                    दि. ${r} रोजी गांधी मोटार टि व्हि यस नासिक

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
    `},ee=e=>{const s=e.booking_info,a=e.template_info,o=e.generated_content;return`
<!DOCTYPE html>
<html>
<head>
    <title>${a.name} - ${s.booking_number}</title>
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
        .content-section {
            margin: 10mm 0;
        }
        .content-title {
            font-size: 18px;
            font-weight: bold;
            color: #555555;
            margin-bottom: 5mm;
            text-align: center;
        }
        .generated-content {
            font-size: 12px;
            line-height: 1.4;
            color: #555555;
            text-align: justify;
            white-space: pre-wrap;
        }
        .bold {
            font-weight: 700;
            color:#555555;
        }
        @page {
            size: A4;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header-container">
            <img src="${B}" class="logo" alt="TVS Logo">
            <div class="header-text">${a.name}</div>
        </div>

        <div class="content-section">
            ${o.subject?`<div class="content-title">${o.subject}</div>`:""}
            <div class="generated-content">
                ${o.content}
            </div>
        </div>
    </div>
</body>
</html>
    `},te=e=>{U(e),P(e,ne("booking"))};return E?F?t.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"50vh"},children:t.jsx(I,{color:"primary"})}):t.jsxs("div",{children:[t.jsx("div",{className:"title",children:"Delivery Challan/Documents"}),b&&t.jsx(ce,{color:"danger",className:"mb-3",children:b}),t.jsxs(me,{className:"table-container mt-4",children:[t.jsxs(he,{className:"card-header d-flex justify-content-between align-items-center",children:[t.jsx("div",{}),t.jsxs("div",{className:"d-flex",children:[t.jsx(ue,{className:"mt-1 m-1",children:"Search:"}),t.jsx(ge,{type:"text",className:"d-inline-block square-search",value:H,onChange:e=>te(e.target.value)})]})]}),t.jsx(pe,{children:t.jsx("div",{className:"responsive-table-wrapper",children:t.jsxs(be,{striped:!0,bordered:!0,hover:!0,className:"responsive-table",children:[t.jsx(fe,{children:t.jsxs(j,{children:[t.jsx(c,{children:"Sr.no"}),t.jsx(c,{children:"Booking ID"}),t.jsx(c,{children:"Model Name"}),t.jsx(c,{children:"Customer Name"}),t.jsx(c,{children:"Chassis Number"}),t.jsx(c,{children:"Customer Copy"}),t.jsx(c,{children:"Office Copy"}),t.jsx(c,{children:"Documents"})]})}),t.jsx(xe,{children:C.length===0?t.jsx(j,{children:t.jsx(l,{colSpan:"8",className:"text-center",children:"No bookings available"})}):C.map((e,s)=>t.jsxs(j,{children:[t.jsx(l,{children:s+1}),t.jsx(l,{children:e.bookingNumber}),t.jsx(l,{children:e.model?.model_name||""}),t.jsx(l,{children:e.customerDetails?.name||""}),t.jsx(l,{children:e.chassisNumber||""}),t.jsx(l,{children:N?t.jsxs(u,{size:"sm",color:"primary",className:"action-btn",onClick:()=>L(e,"Customer Copy"),children:[t.jsx(p,{icon:w,className:"me-1"}),"Print"]}):t.jsx("span",{className:"text-muted",children:"No permission"})}),t.jsx(l,{children:N?t.jsxs(u,{size:"sm",color:"info",className:"action-btn",onClick:()=>L(e,"Office Copy"),children:[t.jsx(p,{icon:w,className:"me-1"}),"Print"]}):t.jsx("span",{className:"text-muted",children:"No permission"})}),t.jsx(l,{children:t.jsxs(u,{size:"sm",color:"success",className:"action-btn",onClick:()=>q(e._id),children:[t.jsx(p,{className:"me-1"}),"View"]})})]},e._id||s))})]})})})]}),t.jsxs(ve,{visible:W,onClose:()=>{x(!1),v(null),y([])},size:"lg",children:[t.jsx(ye,{children:t.jsxs(Ne,{children:[t.jsx(p,{className:"me-2"}),"Selected Documents"]})}),t.jsx(je,{children:J?t.jsxs("div",{className:"text-center py-5",children:[t.jsx(I,{color:"primary"}),t.jsx("p",{className:"mt-3",children:"Loading documents..."})]}):S.length===0?t.jsxs("div",{className:"text-center py-5",children:[t.jsx(p,{size:"xl",className:"text-muted mb-3"}),t.jsx("p",{className:"text-muted",children:"No documents selected for this booking"})]}):t.jsx("div",{className:"border rounded p-3",children:S.map((e,s)=>t.jsxs("div",{className:"mb-3 p-2 border-bottom",children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-2",children:[t.jsxs("div",{children:[t.jsx("h6",{className:"mb-0",children:e.template.template_name}),t.jsxs("small",{className:"text-muted",children:["Selected by: ",e.selected_by.name," •",new Date(e.selected_at).toLocaleDateString()]})]}),t.jsx("div",{className:"d-flex gap-2",children:t.jsxs(u,{size:"sm",color:"primary",onClick:()=>Q(e.selection_id,e.template.template_name),children:[t.jsx(p,{icon:w,className:"me-1"}),"Preview"]})})]}),e.notes&&t.jsx("div",{className:"alert alert-info p-2 mt-2",children:t.jsxs("small",{children:[t.jsx("strong",{children:"Notes:"})," ",e.notes]})})]},e.selection_id))})}),t.jsx(we,{children:t.jsx(u,{color:"secondary",onClick:()=>{x(!1),v(null),y([])},children:"Close"})})]})]}):t.jsx("div",{className:"alert alert-danger m-3",role:"alert",children:"You do not have permission to view Delivery Challan."})};export{qe as default};
