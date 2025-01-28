import fs from "fs";
import PDFDocument from "pdfkit";
import {
  number2Words,
  number2WordsWithDecimal,
  splitGST,
  splitPriceFromTax,
} from "../utils/registration.utils.js";
import { request, Request, Response } from "express";
import path from "path";

const options = {
  font_path: "C:/Windows/Fonts/Arial.ttf",
};

interface OrderItem {
  id: number;
  name: string;
  market_retail_price: number;
  quantity: number;
  shoora_price: number;
  tax_rate: string;
}
interface Address {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  phoneNumber: number;
  email: string;
}
interface User {
  smId: string;
  name: string;
  phoneNumber: number;
  address: Address;
  gst_no: number;
}

interface Seller {
  branch_name: string;
  address: Address;
  gst_no: number;
  fssai_no: number;
  branch_id: string;
  email_address: string;
}
interface InvoiceRequestBody {
  orderDate: string;
  orderId: string;
  orderValue: string;
  deliveryCharge: string;
  user: User;
  seller: Seller;
  orderItems: OrderItem[];
}

let pageNumber: number = 1;

export const generateInvoice = async (request: Request, response: Response) => {
  try {
    const { orderId } = request.body;
    let doc = new PDFDocument({ margin: 50 });
    doc.registerFont("Arial", "/usr/share/fonts/dejavu/DejaVuSans.ttf");

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

export const downloadInvoice = (request: Request, response: Response) => {
  const filename = request.params.filename;
  const filePath = path.join("invoices", filename);

  if (fs.existsSync(filePath)) {
    response.download(filePath, (err) => {
      if (err) {
        console.error("Error sending the file:", err);
      }
    });
  } else {
    response.status(404).json({ error: "Invoice not found" });
  }
};

function generateHeader(doc: PDFKit.PDFDocument) {
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

function generateCustomerInformation(
  doc: PDFKit.PDFDocument,
  data: InvoiceRequestBody
) {
  console.log(data);

  doc.fillColor("#000000").fontSize(20).text("Invoice", 35, 140);
  const invoiceDate = new Date(data.orderDate);

  generateHr(doc, 125, "#000000");

  const customerInformationTop = 170;

  doc
    .fontSize(9)
    .font("Arial")
    .text("Invoice Number:", 35, customerInformationTop)
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
    .fontSize(12)
    .text("Invoice From:", 35, customerInformationTop + 22)
    .text("Invoice To:", 320, customerInformationTop + 22)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(
      `Name : ${data.user.address.name ?? data.user.name} (${data.user.smId})`,
      320,
      customerInformationTop + 40
    )
    .text(
      `Name : ${data.seller.branch_name} (${data.seller.branch_id})`,
      35,
      customerInformationTop + 40
    )
    .font("Helvetica")
    .fontSize(8)
    .text(
      `Address:  ${data.user.address.address}`,
      320,
      customerInformationTop + 55
    )
    .text(
      `Address:  ${data.seller.address.address}`,
      35,
      customerInformationTop + 55
    )
    .text(
      data.user.address.city +
        ", " +
        data.user.address.state +
        ", " +
        data.user.address.pincode,
      358,
      customerInformationTop + 70
    )
    .text(
      data.seller.address.city +
        ", " +
        data.seller.address.state +
        ", " +
        data.seller.address.pincode,
      73,
      customerInformationTop + 70
    )
    .text(
      `Phone:     ${
        data.user.address.phoneNumber ?? data.user.phoneNumber ?? "NA"
      }`,
      320,
      customerInformationTop + 85
    )
    .text(
      `Phone:     ${data.seller.address.phoneNumber ?? "NA"}`,
      35,
      customerInformationTop + 85
    )
    .text(
      `Email:      ${data.user.address.email ?? "NA"}`,
      320,
      customerInformationTop + 100
    )
    .text(
      `Email:      ${data.seller.email_address ?? "NA"}`,
      35,
      customerInformationTop + 100
    )
    .text(
      `GSTIN:     ${data.user.gst_no ?? "NA"}`,
      320,
      customerInformationTop + 115
    )
    .text(
      `GSTIN:     ${data.seller.gst_no ?? "NA"}`,
      35,
      customerInformationTop + 115
    )
    .text(
      `FSSAI License No. :  ${data.seller.fssai_no ?? "NA"}`,
      35,
      customerInformationTop + 130
    )
    .moveDown();

  generateHr(doc, 320, "#000000");
}

function generateInvoiceTable(
  doc: PDFKit.PDFDocument,
  data: InvoiceRequestBody
) {
  let invoiceTableTop = 340;

  doc.font("Helvetica-Bold");
  generateTableRow(
    6,
    doc,
    invoiceTableTop,
    "S.No.",
    "Product ID",
    "Item",
    "MRP",
    "Discount",
    "Unit Price",
    "Quantity",
    "IGST",
    "CGST",
    "SGST",
    "Tax Rate",
    "Tax Amount",
    "Line Total (SM Price)"
  );

  const taxType = "IGST";
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Arial");

  let resetFlag = 0;
  data.orderItems.forEach((item, index) => {
    const position = invoiceTableTop + (index - resetFlag + 1) * 30;
    const priceFromTaxSplit = splitPriceFromTax(
      item.tax_rate,
      item.shoora_price
    );
    const gstSplit = splitGST(
      priceFromTaxSplit.tax,
      data.user.address.state,
      data.seller.address.state
    );
    generateTableRow(
      6,
      doc,
      position,
      `${index + 1}`,
      `${item.id}`,
      `${item.name}`,
      `₹${item.market_retail_price}`,
      `-₹${(item.market_retail_price - item.shoora_price).toFixed(2)}`,
      `₹${priceFromTaxSplit.price}`,
      `${item.quantity}`,
      gstSplit.igst ? `₹${gstSplit.igst * item.quantity}` : "NA",
      gstSplit.cgst ? `₹${gstSplit.cgst * item.quantity}` : "NA",
      gstSplit.sgst ? `₹${gstSplit.sgst * item.quantity}` : "NA",
      `${item.tax_rate}%`,
      `₹${priceFromTaxSplit.tax * item.quantity}`,
      `₹${(item.shoora_price * item.quantity).toFixed(2)}`
    );
    generateHr(doc, position + 20);
    if (
      index === 9 ||
      index === 30 ||
      index === 50 ||
      index === 70 ||
      index === 90 ||
      index === 110 ||
      index === 130 ||
      index === 150 ||
      index === 170 ||
      index === 190 ||
      index === 210 ||
      index === 230 ||
      index === 250 ||
      index === 270 ||
      index === 290 ||
      index === 310 ||
      index === 330 ||
      index === 350 ||
      index === 370 ||
      index === 390 ||
      index === 410
    ) {
      doc.addPage();
      pageNumber++;
      invoiceTableTop = 0;
      generateHr(doc, invoiceTableTop + 50);
      resetFlag = index;
    }
  });

  const subtotalPosition =
    invoiceTableTop + (data.orderItems.length - resetFlag + 1) * 30;
  row(doc, subtotalPosition, 25, 20, 430);
  row(doc, subtotalPosition, 455, 20, 120);

  doc.fontSize(8);

  textInRowFirst(
    doc,
    `In Words: ${number2WordsWithDecimal(
      data.orderValue as unknown as number
    )}`,
    subtotalPosition + 6,
    30
  );

  textInRowFirst(
    doc,
    `Grand Total: ₹${data.orderValue}`,
    subtotalPosition + 6,
    470
  );

  row(doc, subtotalPosition + 30, 25, 50, 185);
  row(doc, subtotalPosition + 30, 210, 50, 185);
  row(doc, subtotalPosition + 30, 395, 50, 180);

  textInRowFirst(
    doc,
    `Company GSTIN: 23CUHPS9677Q1ZD`,
    subtotalPosition + 50,
    30
  );

  textInRowFirst(
    doc,
    `Delivery Charge: ₹${data.deliveryCharge}`,
    subtotalPosition + 50,
    220
  );

  textInRowFirst(
    doc,
    `Declaration: We declare that this invoice shows actual price of the goods described inclusive of taxes and that all particulars are true and correct.`,
    subtotalPosition + 90,
    30
  );

  textInRowFirst(doc, `For Authorised Signatory`, subtotalPosition + 36, 400);
}

function generateFooter(doc: PDFKit.PDFDocument) {
  generateHr(doc, 750);
}
const x: number = 35;
function generateTableRow(
  fontSize: number,
  doc: PDFKit.PDFDocument,
  y: number,
  sNo: string,
  productId: string,
  description: string,
  mrp: string,
  discount: string,
  taxableValue: string,
  quantity: string,
  IGST: string,
  CGST: string,
  SGST: string,
  taxRate: string,
  taxAmount: string,
  lineTotal: string
) {
  doc
    .fontSize(fontSize)
    .text(sNo, x, y, { width: 20, align: "left" })
    .text(productId, x + 20, y, { width: 40, align: "left" })
    .text(description, x + 60, y, { width: 90, align: "left" })
    .text(mrp, x + 150, y, { width: 40, align: "right" })
    .text(discount, x + 190, y, { width: 40, align: "right" })
    .text(taxableValue, x + 230, y, { width: 50, align: "right" })
    .text(quantity, x + 280, y, { width: 40, align: "center" })
    .text(IGST, x + 310, y, { width: 40, align: "right" })
    .text(CGST, x + 350, y, { width: 40, align: "right" })
    .text(SGST, x + 390, y, { width: 40, align: "right" })
    .text(taxRate, x + 430, y, { width: 20, align: "right" })
    .text(taxAmount, x + 450, y, { width: 40, align: "right" })
    .text(lineTotal, x + 490, y, { width: 40, align: "right" });
}

function generateHr(doc: PDFKit.PDFDocument, y: number, color = "#aaaaaa") {
  doc.strokeColor(color).lineWidth(1).moveTo(25, y).lineTo(575, y).stroke();
}

function textInRowFirst(
  doc: PDFKit.PDFDocument,
  text: string,
  height: number,
  x: number
) {
  doc.y = height;
  doc.x = x;
  doc.fillColor("black");
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: "justify",
    columns: 1,
  });
}

function row(
  doc: PDFKit.PDFDocument,
  height: number,
  x: number,
  rectHeight: number,
  rectWidth: number
) {
  doc.lineJoin("miter").rect(x, height, rectWidth, rectHeight).stroke();
}
