import fs from "fs";
import PDFDocument from "pdfkit";
import { getPriceAfterTax } from "../utils/Utils.js";

const options = {
  font_path: "C:/Windows/Fonts/Arial.ttf",
};

export const generateInvoice = async (request, response) => {
  try {
    const { orderId } = request.body;
    let doc = new PDFDocument({ margin: 50 });
    doc.registerFont("Arial", "C:/Windows/Fonts/Arial.ttf");

    generateHeader(doc);
    generateCustomerInformation(doc, request.body);
    generateInvoiceTable(doc, request.body);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(`invoices/${orderId}-invoice.pdf`));
    console.log("Created invoice successfully!");
    response.json({ success: true });
  } catch (error) {
    console.log("Error in generating invoice: ", error);
    response.json({ success: false });
  }
};

function generateHeader(doc) {
  doc
    .image("app/assets/images/shoormall-logo-final-transparent.png", 40, 2, {
      width: 200,
    })
    .font("Times-Bold")
    .fillColor("#000000")
    .fontSize(12)
    .text("Kash Technologies", 200, 50, { align: "center" })
    .fillColor("#444444")
    .font("Times-Roman")
    .fontSize(10)
    .text("Office: 2/B, Karoli Nagar, Dewas, Madhya Pradesh, 455001", 200, 65, {
      align: "center",
    })
    .text("Visit Us: shooramall.com", 200, 80, { align: "center" })
    .text("Mail Us: support@shooramall.com", 200, 95, { align: "center" })
    .moveDown();
}

export const downloadInvoice = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(invoiceDir, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error sending the file:", err);
      }
    });
  } else {
    res.status(404).json({ error: "Invoice not found" });
  }
};

function generateCustomerInformation(doc, data) {
  doc.fillColor("#000000").fontSize(20).text("Invoice", 50, 140);
  const invoiceDate = new Date(data.orderDate);

  generateHr(doc, 125, "#000000");

  const customerInformationTop = 170;

  doc
    .fontSize(9)
    .font("Arial")
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(`#${data.orderId}`, 120, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 320, customerInformationTop)
    .font("Helvetica-Bold")
    .text(
      invoiceDate.toDateString() + "  " + invoiceDate.toLocaleTimeString(),
      390,
      customerInformationTop
    )
    .fontSize(10)
    .text("Invoice From:", 50, customerInformationTop + 20)
    .text("Invoice To:", 320, customerInformationTop + 20)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(
      `${data.user.name}   (SM ID - ${data.user.smId})`,
      320,
      customerInformationTop + 40
    )
    .text(
      `${data.seller.name}   (Seller ID - ${data.seller.sellerId})`,
      50,
      customerInformationTop + 40
    )
    .font("Helvetica")
    .fontSize(8)
    .text(`Address:  ${data.user.address}`, 320, customerInformationTop + 55)
    .text(`Address:  ${data.seller.address}`, 50, customerInformationTop + 55)
    .text(
      data.user.city + ", " + data.user.state + ", " + data.user.pincode,
      358,
      customerInformationTop + 70
    )
    .text(
      data.seller.city + ", " + data.seller.state + ", " + data.seller.pincode,
      88,
      customerInformationTop + 70
    )
    .text(
      `Phone:     ${data.user.phoneNumber}`,
      320,
      customerInformationTop + 85
    )
    .text(
      `Phone:     ${data.seller.phoneNumber}`,
      50,
      customerInformationTop + 85
    )
    .text(
      `Email:      ${data.user.email ?? "NA"}`,
      320,
      customerInformationTop + 100
    )
    .text(
      `Email:      ${data.seller.email ?? "NA"}`,
      50,
      customerInformationTop + 100
    )
    .text(
      `GST No.:  ${data.user.gstNumber ?? "NA"}`,
      320,
      customerInformationTop + 115
    )
    .text(
      `GST No.:  ${data.seller.gstNumber ?? "NA"}`,
      50,
      customerInformationTop + 115
    )
    .moveDown();

  generateHr(doc, 310, "#000000");
}

function generateInvoiceTable(doc, data) {
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "S.No.",
    "Product ID",
    "Item",
    "MRP",
    "Taxable Value",
    "Quantity",
    "Tax Type",
    "Tax Rate",
    "Tax Amount",
    "Discount",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Arial");

  data.orderItems.forEach((item, index) => {
    const position = invoiceTableTop + (index + 1) * 30;
    generateTableRow(
      doc,
      position,
      `${index}`,
      `${item.id}`,
      `${item.name}`,
      `${item.market_retail_price}`,
      `₹${getPriceAfterTax(item.taxRate, item.market_retail_price).price}`,
      `${item.quantity}`,
      `${item.taxType}`,
      `${item.taxRate}%`,
      `₹${getPriceAfterTax(item.taxRate, item.market_retail_price).tax}`,
      `${-(item.market_retail_price - item.shoora_price)}`,
      `₹${item.shoora_price * item.quantity}`
    );

    generateHr(doc, position + 20);
  });

  const subtotalPosition = invoiceTableTop + (invoice.items.length + 1) * 30;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    "",
    "",
    "",
    "Subtotal: ",
    data.orderValue
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  generateHr(doc, 750);
}

function generateTableRow(
  doc,
  y,
  sNo,
  productId,
  description,
  mrp,
  taxableValue,
  quantity,
  taxType,
  taxRate,
  taxAmount,
  lineTotal
) {
  doc
    .fontSize(8)
    .text(sNo, 50, y, { width: 30, align: "left" })
    .text(productId, 80, y, { width: 50, align: "left" })
    .text(description, 130, y, { width: 90, align: "left" })
    .text(mrp, 220, y, { width: 50, align: "right" })
    .text(taxableValue, 270, y, { width: 90, align: "right" })
    .text(quantity, 310, y, { width: 90, align: "right" })
    .text(taxType, 350, y, { width: 90, align: "right" })
    .text(taxRate, 450, y, { width: 90, align: "right" })
    .text(taxAmount, 500, y, { width: 90, align: "right" })
    .text(discount, 4, y, { width: 90, align: "right" })
    .text(lineTotal, 450, y, { width: 90, align: "right" });
}

function generateHr(doc, y, color = "#aaaaaa") {
  doc.strokeColor(color).lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111,
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000,
      taxRate: 5,
      taxAmount: 300,
      taxType: "IGST",
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000,
      taxRate: 5,
      taxAmount: 100,
      taxType: "IGST",
    },
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234,
  date: "01/01/2021",
};
