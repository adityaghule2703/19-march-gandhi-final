// export const generateReceiptHTML = (data) => {
//     const receiptNumber = data.receiptNumber || `RCP${Date.now()}`;
//     const receiptDate = data.receiptDate || new Date().toLocaleDateString('en-IN');
//     const qrCodeImage = data.qrCode || '';
  
//     // Number to words function - defined only once inside
//     const numberToWords = (num) => {
//         if (num === 0) return 'Zero';
        
//         const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
//             'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//         const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
//         const numToWords = (n) => {
//             if (n < 20) return ones[n];
//             if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
//             if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
//             if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
//             if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
//             return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
//         };
        
//         const rupees = Math.floor(num);
//         const paise = Math.round((num - rupees) * 100);
        
//         let result = numToWords(rupees);
//         if (paise > 0) {
//             result += ' and ' + numToWords(paise) + ' Paise';
//         }
        
//         return result + ' Rupees Only';
//     };

//     return `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <title>Payment Receipt - ${receiptNumber}</title>
//     <style>
//       body {
//         font-family: "Courier New", Courier, monospace;
//         margin: 0;
//         padding: 10mm;
//         font-size: 14px;
//         color: #555555;
//       }
//       .page {
//         width: 210mm;
//         height: 297mm;
//         margin: 0 auto;
//       }
//       .receipt-copy {
//         height: 138mm;
//         page-break-inside: avoid;
//       }
//       .header-container {
//         display: flex;
//         justify-content: space-between;
//         margin-bottom: 2mm;
//         align-items: flex-start;
//       }
//       .header-left {
//         width: 60%;
//       }
//       .header-right {
//         width: 40%;
//         text-align: right;
//         display: flex;
//         flex-direction: column;
//         align-items: flex-end;
//       }
//       .logo-qr-container {
//         display: flex;
//         align-items: center;
//         gap: 5px;
//         justify-content: flex-end;
//         margin-bottom: 5px;
//         width: 100%;
//       }
//       .logo {
//         height: 30px;
//         width: auto;
//         max-width: 100px;
//         object-fit: contain;
//       }
//       .qr-code-small {
//         width: 60px;
//         height: 60px;
//         border: 1px solid #ccc;
//       }
//       .dealer-info {
//         text-align: left;
//         font-size: 12px;
//         line-height: 1.1;
//       }
//       .customer-info-container {
//         display: flex;
//         font-size:12px;
//       }
//       .customer-info-left {
//         width: 50%;
//       }
//       .customer-info-right {
//         width: 50%;
//       }
//       .customer-info-row {
//         margin: 0.5mm 0;
//         line-height: 1.1;
//       }
//       .divider {
//         border-top: 1px solid #AAAAAA;
//         margin: 2mm 0;
//       }
//       .receipt-info {
//         background-color: #f8f9fa;
//         border: 1px solid #dee2e6;
//         border-radius: 4px;
//         padding: 8px;
//         margin: 8px 0;
//         font-size: 12px;
//       }
//       .payment-info-box {
//         margin: 5px 0;
//       }
//       .signature-box {
//         margin-top: 5mm;
//         font-size: 10pt;
//         display: flex;
//         justify-content: flex-end;
//       }
//       .signature-line {
//         border-top: 1px dashed #000;
//         width: 50mm;
//         display: inline-block;
//         margin: 0 3mm;
//       }
//       .signature-content {
//         text-align: right;
//         width: 60mm;
//       }
//       .cutting-line {
//         border-top: 2px dashed #333;
//         margin: 10mm 0;
//         text-align: center;
//         position: relative;
//       }
//       .cutting-line::before {
//         content: "✂ Cut Here ✂";
//         position: absolute;
//         top: -10px;
//         left: 50%;
//         transform: translateX(-50%);
//         background: white;
//         padding: 0 10px;
//         font-size: 10px;
//         color: #666;
//       }
//       .note{
//         padding:1px;
//         margin:2px;
//         font-size: 11px;
//       }
//       .amount-in-words {
//         font-size: 12px;
//         margin-top: 5px;
//         font-weight: bold;
//       }
      
//       @page {
//         size: A4;
//         margin: 0;
//       }
//       @media print {
//         body {
//           padding: 5mm;
//         }
//         .receipt-copy {
//           page-break-inside: avoid;
//         }
//       }
//     </style>
//   </head>
//   <body>
//     <div class="page">
//       <!-- First Copy - Customer Copy -->
//       <div class="receipt-copy">
//         <!-- Header Section with QR Code -->
//         <div class="header-container">
//           <div class="header-left">
//             <h2 style="margin:0; font-size:12pt; margin-bottom: 3px;">${data.branch?.name || 'GANDHI MOTORS PVT LTD'}</h2>
//             <div class="dealer-info">
//               Authorized Main Dealer: TVS Motor Company Ltd.<br>
//               Registered office: ${data.branch?.address || "'JOGPREET' Asher Estate, Near Ichhamani Lawns, Upnagar, Nashik Road, Nashik"}<br>
//               Phone: ${data.branch?.phone || '7498993672'}<br>
//               GSTIN: ${data.branch?.gst_number || ''}<br>
//               ${data.branch?.name || 'GANDHI TVS NASHIK'}
//             </div>
//           </div>
//           <div class="header-right">
//             <div class="logo-qr-container">
//               <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=120,height=60" 
//                    class="logo" 
//                    alt="TVS Logo"
//                    onerror="this.style.display='none'">
//             </div>
            
//             <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
//             <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
  
//             ${
//               data.bookingType === 'SUBDEALER'
//                 ? `<div style="font-size: 10px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
//                    <div style="font-size: 9px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
//                 : ''
//             }
//           </div>
//         </div>
//         <div class="divider"></div>
  
//         <!-- Receipt Information -->
//         <div class="receipt-info">
//           <div><strong>PAYMENT RECEIPT</strong></div>
//           <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//           <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//         </div>
  
//         <!-- Customer Information -->
//         <div class="customer-info-container">
//           <div class="customer-info-left">
//             <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails?.name || ''}</div>
//             <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails?.address || ''}, ${data.customerDetails?.taluka || ''}</div>
//             <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails?.mobile1 || ''}</div>
//             <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
//           </div>
//           <div class="customer-info-right">
//             <div class="customer-info-row"><strong>Model Name:</strong> ${data.model?.model_name || ''}</div>
//             <div class="customer-info-row"><strong>Payment Type:</strong> ${data.payment?.type || ''}</div>
//             <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
//             <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
//           </div>
//         </div>
  
//         <!-- Payment Details -->
//         <div class="payment-info-box">
//           <div class="receipt-info">
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 4px 0;"><strong>Receipt Amount(Rs):</strong></td>
//                 <td style="padding: 4px 0; font-size: 16px; font-weight: bold;">₹ ${data.recentPaymentAmount?.toFixed(2) || '0.00'}</td>
//               </tr>
//               ${
//                 data.recentPaymentAmountRef
//                   ? `<tr>
//                        <td style="padding: 4px 0;"><strong>Reference No:</strong></td>
//                        <td style="padding: 4px 0;">${data.recentPaymentAmountRef}</td>
//                      </tr>`
//                   : ''
//               }
//               <tr>
//                 <td style="padding: 4px 0;"><strong>Payment Mode:</strong></td>
//                 <td style="padding: 4px 0;">${data.recentPaymentAmountType || 'CASH'}</td>
//               </tr>
//                 <tr>
//                 <td style="padding: 4px 0;"><strong>Receipt Date:</strong></td>
//                 <td style="padding: 4px 0;">${receiptDate}</td>
//               </tr>
//             </table>
//           </div>
//         </div>
  
//         <!-- Amount in Words -->
//         <div class="amount-in-words">
//           <strong>Amount in Words:</strong>
//           ${numberToWords(data.recentPaymentAmount)}
//         </div>
//         <!-- Signature Section - Authorized Signatory Only -->
//         <div class="signature-box">
//           <div class="signature-content">
//             <div class="signature-line"></div>
//             <div style="margin-top: 2px;">AUTHORIZED SIGNATORY OF GANDHI MOTORS PVT LTD</div>
//           </div>
//         </div>
//       </div>
  
//       <!-- Cutting Line -->
//       <div class="cutting-line"></div>
  
//       <!-- Second Copy - Office Copy -->
//       <div class="receipt-copy">
//         <!-- Similar header as above but marked as OFFICE COPY -->
//         <div class="header-container">
//           <div class="header-left">
//             <h2 style="margin:0; font-size:12pt; margin-bottom: 3px;">${data.branch?.name || 'GANDHI MOTORS PVT LTD'}</h2>
//             <div class="dealer-info">
//               Authorized Main Dealer: TVS Motor Company Ltd.<br>
//               Registered office: ${data.branch?.address || "'JOGPREET' Asher Estate, Near Ichhamani Lawns, Upnagar, Nashik Road, Nashik"}<br>
//               Phone: ${data.branch?.phone || '7498993672'}<br>
//               GSTIN: ${data.branch?.gst_number || ''}<br>
//               ${data.branch?.name || 'GANDHI TVS NASHIK'}
//             </div>
//           </div>
//           <div class="header-right">
//             <div class="logo-qr-container">
//               <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=120,height=60" 
//                    class="logo" 
//                    alt="TVS Logo"
//                    onerror="this.style.display='none'">
//             </div>
            
//             <div style="margin-top: 3px; font-size: 11px;">Date: ${receiptDate}</div>
//             <div style="margin-top: 3px; font-size: 11px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
  
//             ${
//               data.bookingType === 'SUBDEALER'
//                 ? `<div style="font-size: 10px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
//                    <div style="font-size: 9px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
//                 : ''
//             }
//           </div>
//         </div>
//         <div class="divider"></div>
  
//         <!-- Receipt Information -->
//         <div class="receipt-info">
//           <div><strong>PAYMENT RECEIPT (OFFICE COPY)</strong></div>
//           <div><strong>Booking Number:</strong> ${data.bookingNumber}</div>
//           <div><strong>Receipt Date:</strong> ${receiptDate}</div>
//         </div>
  
//         <div class="customer-info-container">
//           <div class="customer-info-left">
//             <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails?.name || ''}</div>
//             <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails?.address || ''}, ${data.customerDetails?.taluka || ''}</div>
//             <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails?.mobile1 || ''}</div>
//             <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
//           </div>
//           <div class="customer-info-right">
//             <div class="customer-info-row"><strong>Model Name:</strong> ${data.model?.model_name || ''}</div>
//             <div class="customer-info-row"><strong>Payment Type:</strong> ${data.payment?.type || ''}</div>
//             <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
//             <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
//           </div>
//         </div>
  
//         <!-- Payment Details -->
//         <div class="payment-info-box">
//           <div class="receipt-info">
//             <table style="width: 100%; border-collapse: collapse;">
//               <tr>
//                 <td style="padding: 4px 0;"><strong>Receipt Amount(Rs):</strong></td>
//                 <td style="padding: 4px 0; font-size: 16px; font-weight: bold;">₹ ${data.recentPaymentAmount?.toFixed(2) || '0.00'}</td>
//               </tr>
//               ${
//                 data.recentPaymentAmountRef
//                   ? `<tr>
//                        <td style="padding: 4px 0;"><strong>Reference No:</strong></td>
//                        <td style="padding: 4px 0;">${data.recentPaymentAmountRef}</td>
//                      </tr>`
//                   : ''
//               }
//               <tr>
//                 <td style="padding: 4px 0;"><strong>Payment Mode:</strong></td>
//                 <td style="padding: 4px 0;">${data.recentPaymentAmountType || 'CASH'}</td>
//               </tr>
//                 <tr>
//                 <td style="padding: 4px 0;"><strong>Receipt Date:</strong></td>
//                 <td style="padding: 4px 0;">${receiptDate}</td>
//               </tr>
//             </table>
//           </div>
//         </div>
//         <div class="amount-in-words">
//           <strong>Amount in Words:</strong>
//           ${numberToWords(data.recentPaymentAmount)}
//         </div>
//         <!-- Signature Section - Authorized Signatory Only -->
//         <div class="signature-box">
//           <div class="signature-content">
//             <div class="signature-line"></div>
//             <div style="margin-top: 2px;">AUTHORIZED SIGNATORY OF GANDHI MOTORS PVT LTD</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </body>
//   </html>
//     `;
//   };
  
//   function numberToWords(num) {
//     if (num === 0) return 'Zero';
    
//     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
//       'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
//     const numToWords = (n) => {
//       if (n < 20) return ones[n];
//       if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
//       if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
//       if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
//       if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
//       return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
//     };
    
//     const rupees = Math.floor(num);
//     const paise = Math.round((num - rupees) * 100);
    
//     let result = numToWords(rupees);
//     if (paise > 0) {
//       result += ' and ' + numToWords(paise) + ' Paise';
//     }
    
//     return result;
//   }










export const generateReceiptHTML = (data) => {
    const receiptNumber = data.receiptNumber || `RCP${Date.now()}`;
    const receiptDate = data.receiptDate || new Date().toLocaleDateString('en-IN');
    const qrCodeImage = data.qrCode || '';
  
    // Number to words function - defined only once inside
    const numberToWords = (num) => {
        if (num === 0) return 'Zero';
        
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
        const numToWords = (n) => {
            if (n < 20) return ones[n];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
            if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
            if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
            if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
            return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
        };
        
        const rupees = Math.floor(num);
        const paise = Math.round((num - rupees) * 100);
        
        let result = numToWords(rupees);
        if (paise > 0) {
            result += ' and ' + numToWords(paise) + ' Paise';
        }
        
        return result + ' Rupees Only';
    };

    return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Payment Receipt - ${receiptNumber}</title>
    <style>
      body {
        font-family: "Courier New", Courier, monospace;
        margin: 0;
        padding: 10mm;
        font-size: 15px;  /* Increased by 1px */
        color: #555555;
      }
      .page {
        width: 210mm;
        height: 297mm;
        margin: 0 auto;
      }
      .receipt-copy {
        height: 138mm;
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
        gap: 5px;
        justify-content: flex-end;
        margin-bottom: 5px;
        width: 100%;
      }
      .logo {
        height: 31px;  /* Increased by 1px */
        width: auto;
        max-width: 101px;  /* Increased by 1px */
        object-fit: contain;
      }
      .qr-code-small {
        width: 61px;  /* Increased by 1px */
        height: 61px;
        border: 1px solid #ccc;
      }
      .dealer-info {
        text-align: left;
        font-size: 13px;  /* Increased by 1px */
        line-height: 1.1;
      }
      .customer-info-container {
        display: flex;
        font-size:13px;  /* Increased by 1px */
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
      /* Style for values in customer info */
      .customer-info-row .value {
        font-weight: 700;
      }
      .divider {
        border-top: 1px solid #AAAAAA;
        margin: 2mm 0;
      }
      .receipt-info {
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 9px;  /* Increased by 1px */
        margin: 9px 0;  /* Increased by 1px */
        font-size: 13px;  /* Increased by 1px */
      }
      .receipt-info .value {
        font-weight: 700;
      }
      .payment-info-box {
        margin: 6px 0;  /* Increased by 1px */
      }
      .signature-box {
        margin-top: 6mm;  /* Increased by 1mm */
        font-size: 11pt;  /* Increased by 1pt */
        display: flex;
        justify-content: flex-end;
      }
      .signature-line {
        border-top: 1px dashed #000;
        width: 51mm;  /* Increased by 1mm */
        display: inline-block;
        margin: 0 3mm;
      }
      .signature-content {
        text-align: right;
        width: 61mm;  /* Increased by 1mm */
      }
      .cutting-line {
        border-top: 2px dashed #333;
        margin: 11mm 0;  /* Increased by 1mm */
        text-align: center;
        position: relative;
      }
      .cutting-line::before {
        content: "✂ Cut Here ✂";
        position: absolute;
        top: -11px;  /* Adjusted */
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 0 11px;  /* Increased by 1px */
        font-size: 11px;  /* Increased by 1px */
        color: #666;
      }
      .note{
        padding:2px;  /* Increased by 1px */
        margin:3px;  /* Increased by 1px */
        font-size: 12px;  /* Increased by 1px */
      }
      .note .value {
        font-weight: 700;
      }
      .amount-in-words {
        font-size: 13px;  /* Increased by 1px */
        margin-top: 6px;  /* Increased by 1px */
        font-weight: bold;
      }
      .amount-in-words .value {
        font-weight: 700;
      }
      /* 2-column grid for payment info */
      .payment-grid-2col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px 15px;
        padding: 4px;
        font-size: 13px;
      }
      .payment-grid-item {
        padding: 2px 0;
        line-height: 1.2;
      }
      .payment-grid-item strong {
        font-weight: 600;
        margin-right: 5px;
        min-width: 110px;
        display: inline-block;
      }
      .payment-grid-item .value {
        font-weight: 700;
      }
      /* Preserve existing table styles */
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td {
        padding: 4px 0;
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
      <!-- First Copy - Customer Copy -->
      <div class="receipt-copy">
        <!-- Header Section with QR Code -->
        <div class="header-container">
          <div class="header-left">
            <h2 style="margin:0; font-size:13pt; margin-bottom: 3px;">${data.branch?.name || 'GANDHI MOTORS PVT LTD'}</h2>
            <div class="dealer-info">
              Authorized Main Dealer: TVS Motor Company Ltd.<br>
              Registered office: ${data.branch?.address || "'JOGPREET' Asher Estate, Near Ichhamani Lawns, Upnagar, Nashik Road, Nashik"}<br>
              Phone: ${data.branch?.phone || '7498993672'}<br>
              GSTIN: ${data.branch?.gst_number || ''}<br>
              ${data.branch?.name || 'GANDHI TVS NASHIK'}
            </div>
          </div>
          <div class="header-right">
            <div class="logo-qr-container">
              <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=120,height=60" 
                   class="logo" 
                   alt="TVS Logo"
                   onerror="this.style.display='none'">
            </div>
            
            <div style="margin-top: 4px; font-size: 12px;">Date: ${receiptDate}</div>
            <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
  
            ${
              data.bookingType === 'SUBDEALER'
                ? `<div style="font-size: 11px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
                   <div style="font-size: 10px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
                : ''
            }
          </div>
        </div>
        <div class="divider"></div>
  
        <!-- Receipt Information -->
        <div class="receipt-info">
          <div><strong>PAYMENT RECEIPT</strong></div>
          <div><strong>Booking Number:</strong> <span class="value">${data.bookingNumber}</span></div>
          <div><strong>Receipt Date:</strong> <span class="value">${receiptDate}</span></div>
        </div>
  
        <!-- Customer Information -->
        <div class="customer-info-container">
          <div class="customer-info-left">
            <div class="customer-info-row"><strong>Customer Name:</strong> <span class="value">${data.customerDetails?.name || ''}</span></div>
            <div class="customer-info-row"><strong>Address:</strong> <span class="value">${data.customerDetails?.address || ''}, ${data.customerDetails?.taluka || ''}</span></div>
            <div class="customer-info-row"><strong>Mobile No.:</strong> <span class="value">${data.customerDetails?.mobile1 || ''}</span></div>
            <div class="customer-info-row"><strong>HPA:</strong> <span class="value">${data.hpa ? 'YES' : 'NO'}</span></div>
          </div>
          <div class="customer-info-right">
            <div class="customer-info-row"><strong>Model Name:</strong> <span class="value">${data.model?.model_name || ''}</span></div>
            <div class="customer-info-row"><strong>Payment Type:</strong> <span class="value">${data.payment?.type || ''}</span></div>
            <div class="customer-info-row"><strong>Financer:</strong> <span class="value">${data.payment?.financer?.name || ''}</span></div>
            <div class="customer-info-row"><strong>Sales Executive:</strong> <span class="value">${data.salesExecutive?.name || 'N/A'}</span></div>
          </div>
        </div>
  
        <!-- Payment Details - Updated to 2-column grid -->
        <div class="payment-info-box">
          <div class="receipt-info" style="padding: 5px;">
            <!-- Payment Information Grid - 2 columns (2 rows) -->
            <div class="payment-grid-2col">
              <div class="payment-grid-item"><strong>Receipt Amount:</strong> <span class="value">₹ ${data.recentPaymentAmount?.toFixed(2) || '0.00'}</span></div>
              <div class="payment-grid-item"><strong>Receipt Number:</strong> <span class="value">${receiptNumber}</span></div>
              
              <div class="payment-grid-item"><strong>Payment Mode:</strong> <span class="value">${data.recentPaymentAmountType || 'CASH'}</span></div>
              <div class="payment-grid-item"><strong>Receipt Date:</strong> <span class="value">${receiptDate}</span></div>
            </div>
            
            ${data.recentPaymentAmountRef ? `
            <div style="margin-top: 8px; padding-top: 4px; border-top: 1px dashed #ccc;">
              <strong>Reference No:</strong> <span class="value">${data.recentPaymentAmountRef}</span>
            </div>
            ` : ''}
          </div>
        </div>
  
        <!-- Amount in Words -->
        <div class="amount-in-words">
          <strong>Amount in Words:</strong> <span class="value">${numberToWords(data.recentPaymentAmount)}</span>
        </div>
        
        <!-- Signature Section - Authorized Signatory Only -->
        <div class="signature-box">
          <div class="signature-content">
            <div class="signature-line"></div>
            <div style="margin-top: 2px;">AUTHORIZED SIGNATORY OF GANDHI MOTORS PVT LTD</div>
          </div>
        </div>
      </div>
  
      <!-- Cutting Line -->
      <div class="cutting-line"></div>
  
      <!-- Second Copy - Office Copy -->
      <div class="receipt-copy">
        <!-- Similar header as above but marked as OFFICE COPY -->
        <div class="header-container">
          <div class="header-left">
            <h2 style="margin:0; font-size:13pt; margin-bottom: 3px;">${data.branch?.name || 'GANDHI MOTORS PVT LTD'}</h2>
            <div class="dealer-info">
              Authorized Main Dealer: TVS Motor Company Ltd.<br>
              Registered office: ${data.branch?.address || "'JOGPREET' Asher Estate, Near Ichhamani Lawns, Upnagar, Nashik Road, Nashik"}<br>
              Phone: ${data.branch?.phone || '7498993672'}<br>
              GSTIN: ${data.branch?.gst_number || ''}<br>
              ${data.branch?.name || 'GANDHI TVS NASHIK'}
            </div>
          </div>
          <div class="header-right">
            <div class="logo-qr-container">
              <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=120,height=60" 
                   class="logo" 
                   alt="TVS Logo"
                   onerror="this.style.display='none'">
            </div>
            
            <div style="margin-top: 4px; font-size: 12px;">Date: ${receiptDate}</div>
            <div style="margin-top: 4px; font-size: 12px;"><strong>Receipt No:</strong> ${receiptNumber}</div>
  
            ${
              data.bookingType === 'SUBDEALER'
                ? `<div style="font-size: 11px;"><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
                   <div style="font-size: 10px;"><b>Address:</b> ${data.subdealer?.location || ''}</div>`
                : ''
            }
          </div>
        </div>
        <div class="divider"></div>
  
        <!-- Receipt Information -->
        <div class="receipt-info">
          <div><strong>PAYMENT RECEIPT (OFFICE COPY)</strong></div>
          <div><strong>Booking Number:</strong> <span class="value">${data.bookingNumber}</span></div>
          <div><strong>Receipt Date:</strong> <span class="value">${receiptDate}</span></div>
        </div>
  
        <div class="customer-info-container">
          <div class="customer-info-left">
            <div class="customer-info-row"><strong>Customer Name:</strong> <span class="value">${data.customerDetails?.name || ''}</span></div>
            <div class="customer-info-row"><strong>Address:</strong> <span class="value">${data.customerDetails?.address || ''}, ${data.customerDetails?.taluka || ''}</span></div>
            <div class="customer-info-row"><strong>Mobile No.:</strong> <span class="value">${data.customerDetails?.mobile1 || ''}</span></div>
            <div class="customer-info-row"><strong>HPA:</strong> <span class="value">${data.hpa ? 'YES' : 'NO'}</span></div>
          </div>
          <div class="customer-info-right">
            <div class="customer-info-row"><strong>Model Name:</strong> <span class="value">${data.model?.model_name || ''}</span></div>
            <div class="customer-info-row"><strong>Payment Type:</strong> <span class="value">${data.payment?.type || ''}</span></div>
            <div class="customer-info-row"><strong>Financer:</strong> <span class="value">${data.payment?.financer?.name || ''}</span></div>
            <div class="customer-info-row"><strong>Sales Executive:</strong> <span class="value">${data.salesExecutive?.name || 'N/A'}</span></div>
          </div>
        </div>
  
        <!-- Payment Details - Updated to 2-column grid -->
        <div class="payment-info-box">
          <div class="receipt-info" style="padding: 5px;">
            <!-- Payment Information Grid - 2 columns (2 rows) -->
            <div class="payment-grid-2col">
              <div class="payment-grid-item"><strong>Receipt Amount:</strong> <span class="value">₹ ${data.recentPaymentAmount?.toFixed(2) || '0.00'}</span></div>
              <div class="payment-grid-item"><strong>Receipt Number:</strong> <span class="value">${receiptNumber}</span></div>
              
              <div class="payment-grid-item"><strong>Payment Mode:</strong> <span class="value">${data.recentPaymentAmountType || 'CASH'}</span></div>
              <div class="payment-grid-item"><strong>Receipt Date:</strong> <span class="value">${receiptDate}</span></div>
            </div>
            
            ${data.recentPaymentAmountRef ? `
            <div style="margin-top: 8px; padding-top: 4px; border-top: 1px dashed #ccc;">
              <strong>Reference No:</strong> <span class="value">${data.recentPaymentAmountRef}</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="amount-in-words">
          <strong>Amount in Words:</strong> <span class="value">${numberToWords(data.recentPaymentAmount)}</span>
        </div>
        
        <!-- Signature Section - Authorized Signatory Only -->
        <div class="signature-box">
          <div class="signature-content">
            <div class="signature-line"></div>
            <div style="margin-top: 2px;">AUTHORIZED SIGNATORY OF GANDHI MOTORS PVT LTD</div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
    `;
  };
  
  function numberToWords(num) {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numToWords = (n) => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
      return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };
    
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    
    let result = numToWords(rupees);
    if (paise > 0) {
      result += ' and ' + numToWords(paise) + ' Paise';
    }
    
    return result;
  }