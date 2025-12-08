const PDFDocument = require('pdfkit');
const { amountToWords } = require('./amountToWords');

/**
 * Generate bill PDF matching the sample format
 * @param {Object} bill - Bill document with populated fields
 * @param {Object} company - Company details
 * @returns {PDFDocument} - PDF stream
 */
function generateBillPDF(bill, company) {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
    });

    const pageWidth = doc.page.width;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);

    let y = margin;

    // Add company logo if exists
    if (company.logo && company.logoMimeType) {
        try {
            const logo = Buffer.from(company.logo, 'base64');
            doc.image(logo, margin, y, { width: 80, height: 80 });
        } catch (err) {
            console.error('Error adding logo:', err);
        }
    }

    // Company header
    doc.fontSize(20).font('Helvetica-Bold');
    doc.text(company.name.toUpperCase(), margin + 100, y + 10, {
        width: contentWidth - 100,
        align: 'center',
    });

    y += 35;

    // Company address
    doc.fontSize(9).font('Helvetica');
    const addressText = [
        company.address,
        `${company.city}${company.state ? ', ' + company.state : ''}${company.pincode ? ', ' + company.pincode : ''}`,
        company.phone,
    ].filter(Boolean).join('\n');

    doc.text(addressText, margin + 100, y, {
        width: contentWidth - 100,
        align: 'center',
    });

    y += 50;

    // Bill type (CHALLAN)
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text(bill.billType, margin, y, { width: contentWidth, align: 'center' });

    y += 25;

    // Draw horizontal line
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
    y += 10;

    // Customer and Bill details section
    const leftColumnX = margin;
    const rightColumnX = pageWidth - margin - 150;

    doc.fontSize(10).font('Helvetica');
    doc.text('M/s. :', leftColumnX, y);
    doc.font('Helvetica-Bold').text(bill.customerName, leftColumnX + 30, y);

    doc.font('Helvetica').text('Ch. No. :', rightColumnX, y);
    doc.font('Helvetica-Bold').text(bill.billNumber, rightColumnX + 50, y);

    y += 20;

    doc.font('Helvetica').text('Mo. :', leftColumnX, y);
    doc.font('Helvetica-Bold').text(bill.customerMobile, leftColumnX + 30, y);

    doc.font('Helvetica').text('D te :', rightColumnX, y);
    const billDate = new Date(bill.date);
    doc.font('Helvetica-Bold').text(billDate.toLocaleDateString('en-GB'), rightColumnX + 50, y);

    y += 20;

    doc.font('Helvetica').text('Time :', rightColumnX, y);
    doc.font('Helvetica-Bold').text(billDate.toLocaleTimeString('en-GB'), rightColumnX + 50, y);

    y += 25;

    // Table headers
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
    y += 5;

    const tableTop = y;
    const col1 = margin + 5;           // Sr No
    const col2 = margin + 30;          // Product Name
    const col3 = pageWidth - margin - 320; // Pcs
    const col4 = pageWidth - margin - 270; // Mtr
    const col5 = pageWidth - margin - 210; // Total Mtr
    const col6 = pageWidth - margin - 140; // Rate
    const col7 = pageWidth - margin - 70;  // Amount

    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('SrNo', col1, y);
    doc.text('Product Name', col2, y);
    doc.text('Pcs', col3, y);
    doc.text('Mtr', col4, y);
    doc.text('Total Mtr', col5, y);
    doc.text('Rate', col6, y);
    doc.text('Amount', col7, y);

    y += 15;
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
    y += 5;

    // Table items
    doc.font('Helvetica');
    bill.items.forEach((item) => {
        if (y > doc.page.height - 200) {
            doc.addPage();
            y = margin;
        }

        doc.text(item.srNo.toString(), col1, y);
        doc.text(item.productName, col2, y, { width: 150 });
        doc.text(item.quantity.toString(), col3, y);
        doc.text(item.rate.toFixed(3), col4, y);
        doc.text(item.totalMtr ? item.totalMtr.toFixed(3) : '-', col5, y);
        doc.text(item.rate.toFixed(2), col6, y);
        doc.text(item.amount.toFixed(2), col7, y);

        y += 20;
    });

    // Draw line before totals
    y += 10;
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
    y += 10;

    // Totals
    const totalQty = bill.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalMtr = bill.items.reduce((sum, item) => sum + (item.totalMtr || 0), 0);

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(totalQty.toString(), col3, y);
    doc.text(totalMtr.toFixed(3), col5, y);
    doc.text(bill.total.toFixed(2), col7, y);

    y += 25;

    // Amount in words
    doc.fontSize(9).font('Helvetica');
    doc.text('Rs.(in words) :', margin, y);
    doc.font('Helvetica-Oblique').text(
        bill.amountInWords || amountToWords(bill.total),
        margin + 80,
        y,
        { width: 250 }
    );

    // Previous and Closing balance
    if (bill.previousBalance > 0) {
        doc.font('Helvetica').text('Pre. Amount', rightColumnX - 30, y);
        doc.text(bill.previousBalance.toFixed(2), rightColumnX + 50, y);

        y += 15;
        doc.text('Clo. Amount', rightColumnX - 30, y);
        doc.text(bill.closingBalance.toFixed(2), rightColumnX + 50, y);
    }

    y += 30;

    // Terms & Conditions
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
    y += 10;

    doc.fontSize(8).font('Helvetica-Bold');
    doc.text('Terms & Condition :', margin, y);
    y += 12;

    doc.font('Helvetica').fontSize(7);
    const terms = company.termsAndConditions && company.termsAndConditions.length > 0
        ? company.termsAndConditions
        : [
            '1. No Gaurenty No Clame.',
            '2. Cheque Return Charges 200/- Rs.',
            '3. Goods Once Sold Will Not Be accepted.',
        ];

    terms.forEach((term) => {
        doc.text(term, margin, y);
        y += 10;
    });

    y += 10;

    // Signature
    doc.fontSize(9).font('Helvetica');
    doc.text(`For, ${company.name.toUpperCase()}`, rightColumnX, y);

    y += 30;

    // Add signature image if exists
    if (company.signature) {
        try {
            const signature = Buffer.from(company.signature, 'base64');
            doc.image(signature, rightColumnX, y, { width: 100, height: 40 });
            y += 45;
        } catch (err) {
            console.error('Error adding signature:', err);
            y += 20;
        }
    } else {
        y += 20;
    }

    doc.font('Helvetica-Oblique').fontSize(8);
    doc.text('(Authorised Signatory)', rightColumnX, y);

    doc.end();

    return doc;
}

module.exports = { generateBillPDF };
