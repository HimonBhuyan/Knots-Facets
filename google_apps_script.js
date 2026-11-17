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

function setupHeadersIfBlank(sheet) {
  if (sheet.getLastRow() === 0) {
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
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#F5EFEB");
  }
}

// Handles incoming customer orders from the website checkout
function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    setupHeadersIfBlank(sheet);

    var data = JSON.parse(e.postData.contents);

    var row = [
      data.date || new Date().toLocaleString(),
      data.orderId || "",
      data.customerName || "",
      data.email || "",
      data.phone || "",
      data.city || "",
      data.state || "",
      data.postalCode || "",
      data.items || "",
      data.totalINR || data.totalUSD || 0,
      data.paymentMethod || "",
      data.initialStatus || "Order Reserved",
      "", // Courier (Admin fills when dispatched)
      "", // Tracking AWB (Admin fills when dispatched)
      data.giftNote || ""
    ];

    sheet.appendRow(row);
    lock.releaseLock();

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
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
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
