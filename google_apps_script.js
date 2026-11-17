/**
 * =======================================================================
 * KNOTS & FACETS ATELIER — ENTERPRISE ORDER DISPATCH & SYNC BACKEND
 * =======================================================================
 *
 * HOW TO MAKE YOUR SHEET LOOK 100% PROFESSIONAL:
 * 1. Open your Google Sheet (Knots & Facets Orders)
 * 2. Go to Extensions -> Apps Script
 * 3. Replace the entire code with this file and click Save (floppy icon).
 * 4. At the top of Apps Script, select "formatSheet" from the dropdown list.
 * 5. Click the "Run" button ▶️.
 * 6. Switch back to your Google Sheet — it will instantly look like an executive
 *    luxury e-commerce order management system with colored pill dropdowns!
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
 * to instantly style the entire sheet with executive luxury typography,
 * alternating row shading, column widths, and color-coded status pill dropdowns!
 */
function formatSheet() {
  var sheet = getTargetSheet();

  var headers = [
    "Date & Time",
    "Order ID",
    "Customer Name",
    "Email Address",
    "Phone Number",
    "City",
    "State",
    "PIN Code",
    "Items Ordered",
    "Total Amount (₹)",
    "Payment Method",
    "Fulfillment Status",
    "Courier Partner",
    "Tracking AWB",
    "Bespoke Notes"
  ];

  // 1. Set Luxury Atelier Dark Espresso Header Row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange
    .setFontWeight("bold")
    .setFontSize(10)
    .setFontFamily("Arial")
    .setBackground("#241E1A") // Deep atelier espresso
    .setFontColor("#FFFFFF")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 44);

  // 2. Freeze the Header Row so it stays locked while scrolling
  sheet.setFrozenRows(1);

  // 3. Status Dropdown Options with Strict Validation (Column L - Rows 2 to 1000)
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

  // 4. Courier Dropdown Options (Column M - Rows 2 to 1000)
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

  // 5. Executive Color-Coded Status Pills (Conditional Formatting)
  var statusRange = sheet.getRange("L2:L1000");
  var rules = [
    // Delivered -> Mint Green Pill
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Delivered")
      .setBackground("#D1FAE5")
      .setFontColor("#065F46")
      .setBold(true)
      .setRanges([statusRange])
      .build(),
    // Dispatched -> Sky Blue Pill
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Dispatched")
      .setBackground("#E0F2FE")
      .setFontColor("#0369A1")
      .setBold(true)
      .setRanges([statusRange])
      .build(),
    // Master Artisan QC -> Lavender Pill
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Master Artisan QC")
      .setBackground("#F3E8FF")
      .setFontColor("#6B21A8")
      .setBold(true)
      .setRanges([statusRange])
      .build(),
    // Crafting & Stitching -> Warm Amber Pill
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Crafting & Stitching")
      .setBackground("#FEF3C7")
      .setFontColor("#92400E")
      .setBold(true)
      .setRanges([statusRange])
      .build(),
    // Order Reserved -> Soft Rose Pill
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Order Reserved")
      .setBackground("#FEE2E2")
      .setFontColor("#991B1B")
      .setBold(true)
      .setRanges([statusRange])
      .build()
  ];
  sheet.setConditionalFormatRules(rules);

  // 6. Fix Phone Numbers in Column E to Plain Text (Eliminates #ERROR!)
  sheet.getRange("E2:E1000").setNumberFormat("@");

  // Automatically purge dummy/test orders from the sheet
  try {
    var lastRow = sheet.getLastRow();
    for (var r = lastRow; r >= 2; r--) {
      var checkId = String(sheet.getRange(r, 2).getValue() || "").trim().toUpperCase();
      if (checkId === "KF-2026-841920" || checkId === "KF-2026-181131" || checkId.indexOf("TEST") !== -1) {
        sheet.deleteRow(r);
      }
    }
  } catch (delErr) {}

  // 7. Format Total Amount in Column J as Indian Rupee Currency
  sheet.getRange("J2:J1000").setNumberFormat("₹#,##0");

  // 8. Typography, Padding & Alignments for Data Rows
  sheet.setRowHeights(2, 50, 36); // Generous padding for rows
  var dataRange = sheet.getRange("A2:O1000");
  dataRange.setVerticalAlignment("middle").setFontFamily("Arial").setFontSize(10);

  // Monospace / Centered for Order IDs & AWB
  sheet.getRange("B2:B1000").setHorizontalAlignment("center").setFontWeight("bold");
  sheet.getRange("H2:H1000").setHorizontalAlignment("center"); // PIN Code
  sheet.getRange("J2:J1000").setHorizontalAlignment("right").setFontWeight("bold"); // ₹ Amount
  sheet.getRange("L2:L1000").setHorizontalAlignment("center"); // Status
  sheet.getRange("M2:M1000").setHorizontalAlignment("center"); // Courier
  sheet.getRange("N2:N1000").setHorizontalAlignment("center").setFontFamily("Courier New"); // AWB code

  // Text Wrapping for Items & Notes
  sheet.getRange("I2:I1000").setWrap(true);
  sheet.getRange("O2:O1000").setWrap(true);

  // 9. Set Optimal Column Widths so nothing is squashed
  sheet.setColumnWidth(1, 160); // Date & Time
  sheet.setColumnWidth(2, 150); // Order ID
  sheet.setColumnWidth(3, 160); // Customer Name
  sheet.setColumnWidth(4, 220); // Email Address
  sheet.setColumnWidth(5, 150); // Phone Number
  sheet.setColumnWidth(6, 120); // City
  sheet.setColumnWidth(7, 110); // State
  sheet.setColumnWidth(8, 90);  // PIN Code
  sheet.setColumnWidth(9, 320); // Items Ordered
  sheet.setColumnWidth(10, 140); // Total Amount (₹)
  sheet.setColumnWidth(11, 180); // Payment Method
  sheet.setColumnWidth(12, 190); // Fulfillment Status Dropdown
  sheet.setColumnWidth(13, 140); // Courier Partner Dropdown
  sheet.setColumnWidth(14, 160); // Tracking AWB
  sheet.setColumnWidth(15, 250); // Bespoke Notes
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

    // Apply formatting to the newly appended row
    var lastRow = sheet.getLastRow();
    sheet.setRowHeight(lastRow, 36);
    sheet.getRange(lastRow, 5).setNumberFormat("@"); // Phone plain text
    sheet.getRange(lastRow, 10).setNumberFormat("₹#,##0"); // Currency format
    sheet.getRange(lastRow, 1, 1, 15).setVerticalAlignment("middle");

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
