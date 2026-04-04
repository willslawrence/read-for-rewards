// Apps Script — bound to the "Read for Rewards" Google Sheet
// Deploy as Web App: Execute as "Me", Access "Anyone"
// Version 3 — approval flow + email notifications

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
      var status = data.status || (currentPage >= totalPages ? "pending_review" : "reading");
      
      var dataRange = readersSheet.getDataRange();
      var values = dataRange.getValues();
      var found = false;
      
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === name && values[i][1] === book) {
          readersSheet.getRange(i + 1, 4).setValue(currentPage);
          readersSheet.getRange(i + 1, 5).setValue(totalPages);
          readersSheet.getRange(i + 1, 6).setValue(status);
          found = true;
          break;
        }
      }
      
      if (!found) {
        var today = Utilities.formatDate(new Date(), "Asia/Riyadh", "yyyy-MM-dd");
        readersSheet.appendRow([name, book, today, currentPage, totalPages, status]);
      }
      
      // Notify Will when someone finishes a book
      if (status === "pending_review") {
        notifyWill(name, book);
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: status === "pending_review" ? "Completed! Awaiting approval." : "Progress updated"
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
        success: true, message: "Approved!"
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
        success: true, message: "Deleted"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === "addReader") {
      var today = Utilities.formatDate(new Date(), "Asia/Riyadh", "yyyy-MM-dd");
      readersSheet.appendRow([data.name, data.book, today, 0, data.totalPages, "reading"]);
      return ContentService.createTextOutput(JSON.stringify({
        success: true, message: "Added"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false, message: "Unknown action"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false, message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function notifyWill(readerName, bookTitle) {
  try {
    var subject = "📚 Read for Rewards: " + readerName + " finished \"" + bookTitle + "\"!";
    var body = "Hey Will,\n\n" +
      readerName + " just finished reading \"" + bookTitle + "\" and is waiting for your interview/approval.\n\n" +
      "Head to the dashboard to review:\nhttps://willslawrence.github.io/read-for-rewards/\n\n" +
      "(Triple-click the version number to enter admin mode and approve.)";
    
    MailApp.sendEmail({
      to: "wlawrence@helicopter.com.sa",
      subject: subject,
      body: body
    });
  } catch(err) {
    // Don't let notification failure break the main flow
    console.log("Email notification failed: " + err.toString());
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Read for Rewards API is running").setMimeType(ContentService.MimeType.TEXT);
}
