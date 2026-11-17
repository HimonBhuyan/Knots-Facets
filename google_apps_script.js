/**
 * =======================================================================
 * KNOTS & FACETS — ZERO-CODE GOOGLE SHEETS ORDER BACKEND
 * =======================================================================
 *
 * HOW TO SET THIS UP (Takes 2 minutes):
 * 1. Open Google Sheets (https://sheets.new) and name it "Knots & Facets Orders".
 * 2. In the top menu, click: Extensions -> Apps Script.
 * 3. Delete any default code inside the editor, and paste this entire file.
 * 4. Click the blue "Deploy" button (top right) -> "New deployment".
 * 5. Click the gear icon next to "Select type" -> choose "Web app".
 * 6. Set:
 *    - Description: "Knots & Facets Order Sync"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"  <-- (CRITICAL: Allows your website to send & read orders)
 * 7. Click "Deploy" -> click "Authorize access" -> choose your Google Account -> Advanced -> Go to project (unsafe) -> Allow.
 * 8. Copy the "Web app URL" (looks like https://script.google.com/macros/s/AKfycb.../exec).
 * 9. Paste this URL into `src/config/sheetConfig.ts` in your website!
 *
 * HOW IT WORKS FOR THE ADMIN:
 * - When a customer places an order, a new row appears automatically in your Google Sheet!
 * - When you want to update the order status, simply change the "Status" column to:
 *   "Crafting", "QC Stamping", "Dispatched", or "Delivered".
 * - If you enter a Courier (e.g. Delhivery) and Tracking AWB (e.g. DLV12345),
 *   the customer's order tracker will immediately show: "Dispatched via Delhivery (AWB: DLV12345)".
 */

// Your Knots & Facets Google Sheet ID (from your browser URL)
var SPREADSHEET_ID = "1adBeEeapIzq6UXbx6gdlUNThr8P7hKpV6WF77KH2cas";

function getTargetSheet() {
  try {
    if (SPREADSHEET_ID) {
      return SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    }
  } catch (err) {
    // fallback if openById fails
  }
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

function setupHeadersIfBlank(sheet) {
  if (sheet.getLastRow() === 0) {
    formatSheet();
  }
}

/**
 * Run this function once in Apps Script (Click 'Run' button above)
 * to instantly style the sheet, fix columns, and add the Status & Courier dropdowns!
 */
function formatSheet() {
  var sheet = getTargetSheet();

  var headers = [
    "Timestamp",
    "Order ID",
    "Customer Name",
    "Email",
    "Phone",
    "City",
    "State",
    "Postal Code",
    "Items Purchased",
    "Total Amount (₹)",
    "Payment Method",
    "Status",
    "Courier",
    "Tracking AWB",
    "Customer Notes"
  ];

  // If row 1 is empty or doesn't have headers, set them
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange
    .setFontWeight("bold")
    .setBackground("#29231F") // Atelier espresso theme
    .setFontColor("#FFFCF8")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 36);

  // 1. Freeze top header row so it stays visible while scrolling
  sheet.setFrozenRows(1);

  // 2. Status Dropdown (Column L - Rows 2 to 1000)
  var statusOptions = [
    "Order Reserved",
    "Crafting & Stitching",
    "Master Artisan QC",
    "Dispatched",
    "Delivered"
  ];
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusOptions, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("L2:L1000").setDataValidation(statusRule);

  // 3. Courier Dropdown (Column M - Rows 2 to 1000)
  var courierOptions = [
    "Delhivery",
    "Blue Dart",
    "DTDC",
    "India Post",
    "Shiprocket",
    "Speed Post"
  ];
  var courierRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(courierOptions, true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange("M2:M1000").setDataValidation(courierRule);

  // 4. Format Column E (Phone) as Plain Text to avoid #ERROR!
  sheet.getRange("E1:E1000").setNumberFormat("@");

  // 5. Format Column J (Total Amount) as Indian Rupee
  sheet.getRange("J2:J1000").setNumberFormat("₹#,##0");

  // 6. Set clean column widths
  sheet.setColumnWidth(1, 160); // Timestamp
  sheet.setColumnWidth(2, 140); // Order ID
  sheet.setColumnWidth(3, 150); // Customer Name
  sheet.setColumnWidth(4, 200); // Email
  sheet.setColumnWidth(5, 140); // Phone
  sheet.setColumnWidth(6, 120); // City
  sheet.setColumnWidth(7, 100); // State
  sheet.setColumnWidth(8, 100); // Postal Code
  sheet.setColumnWidth(9, 280); // Items Purchased
  sheet.setColumnWidth(10, 130); // Total Amount
  sheet.setColumnWidth(11, 180); // Payment Method
  sheet.setColumnWidth(12, 180); // Status Dropdown
  sheet.setColumnWidth(13, 130); // Courier Dropdown
  sheet.setColumnWidth(14, 160); // Tracking AWB
  sheet.setColumnWidth(15, 220); // Customer Notes

  // 7. Text Wrap & Alignments
  sheet.getRange("I2:I1000").setWrap(true);
  sheet.getRange("O2:O1000").setWrap(true);
  sheet.getRange("B2:B1000").setHorizontalAlignment("center").setFontWeight("bold");
  sheet.getRange("J2:J1000").setHorizontalAlignment("right").setFontWeight("bold");
  sheet.getRange("L2:L1000").setHorizontalAlignment("center").setFontWeight("bold");
}

// Handles incoming customer orders from the website checkout
function doPost(e) {
  try {
    var sheet = getTargetSheet();
    setupHeadersIfBlank(sheet);

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (pErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var cleanPhone = data.phone ? "'" + String(data.phone).replace(/^'+/, '') : "";

    var row = [
      data.date || new Date().toLocaleString(),
      data.orderId || "",
      data.customerName || "",
      data.email || "",
      cleanPhone,
      data.city || "",
      data.state || "",
      data.postalCode || "",
      data.items || "",
      data.totalINR || data.totalUSD || 0,
      data.paymentMethod || "",
      data.initialStatus || "Order Reserved",
      "", // Courier (Admin selects from dropdown)
      "", // Tracking AWB (Admin enters tracking code)
      data.giftNote || ""
    ];

    sheet.appendRow(row);

    // Apply data validation to newly created row if needed
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 5).setNumberFormat("@"); // Phone plain text
    sheet.getRange(lastRow, 10).setNumberFormat("₹#,##0"); // Currency format

    return ContentService.createTextOutput(JSON.stringify({ result: "success", orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handles customer queries in the Atelier Order Tracker
function doGet(e) {
  try {
    var orderId = (e.parameter.orderId || "").trim().toUpperCase();
    var sheet = getTargetSheet();
    var values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ found: false, message: "No orders in sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Find row by Order ID (Column index 1 is Order ID)
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var rowOrderId = String(row[1]).trim().toUpperCase();

      if (rowOrderId === orderId) {
        var status = String(row[11] || "Order Reserved");
        var courier = String(row[12] || "");
        var awb = String(row[13] || "");
        var notes = String(row[14] || "");

        return ContentService.createTextOutput(JSON.stringify({
          found: true,
          orderId: orderId,
          status: status,
          courier: courier,
          trackingAwb: awb,
          notes: notes
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ found: false, orderId: orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

