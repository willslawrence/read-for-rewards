// Apps Script — bound to the "Read for Rewards" Google Sheet
// Deploy as Web App: Execute as "Me", Access "Anyone"
// This handles progress updates from the dashboard

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var readersSheet = ss.getSheetByName("Readers");
    
    if (data.action === "updateProgress") {
      var name = data.name;
      var book = data.book;
      var currentPage = parseInt(data.currentPage);
      var totalPages = parseInt(data.totalPages);
      // When finished → pending_review (needs Will's approval)
      // Use explicit status from client if provided, otherwise determine from pages
      var status = data.status || (currentPage >= totalPages ? "pending_review" : "reading");
      
      // Find existing row for this reader + book
      var dataRange = readersSheet.getDataRange();
      var values = dataRange.getValues();
      var found = false;
      
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === name && values[i][1] === book) {
          // Update existing row
          readersSheet.getRange(i + 1, 4).setValue(currentPage);  // Current Page
          readersSheet.getRange(i + 1, 5).setValue(totalPages);   // Total Pages
          readersSheet.getRange(i + 1, 6).setValue(status);       // Status
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Add new row
        var today = Utilities.formatDate(new Date(), "Asia/Riyadh", "yyyy-MM-dd");
        readersSheet.appendRow([name, book, today, currentPage, totalPages, status]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: status === "pending_review" ? "Completed! Awaiting Will's approval." : "Progress updated"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "approveReading") {
      var name = data.name;
      var book = data.book;
      
      var dataRange = readersSheet.getDataRange();
      var values = dataRange.getValues();
      
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === name && values[i][1] === book) {
          readersSheet.getRange(i + 1, 6).setValue("approved");
          break;
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Reading approved!"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "deleteProgress") {
      var name = data.name;
      var book = data.book;
      
      var dataRange = readersSheet.getDataRange();
      var values = dataRange.getValues();
      
      for (var i = values.length - 1; i >= 1; i--) {
        if (values[i][0] === name && values[i][1] === book) {
          readersSheet.deleteRow(i + 1);
          break;
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Reading deleted"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "addReader") {
      var today = Utilities.formatDate(new Date(), "Asia/Riyadh", "yyyy-MM-dd");
      readersSheet.appendRow([data.name, data.book, today, 0, data.totalPages, "reading"]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Reader added"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Unknown action"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Read for Rewards API is running").setMimeType(ContentService.MimeType.TEXT);
}
