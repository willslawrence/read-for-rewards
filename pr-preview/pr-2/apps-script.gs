// Apps Script — bound to the "Read for Rewards" Google Sheet
// Deploy as Web App: Execute as "Me", Access "Anyone"
// Version 4 — approval flow + email notifications + Books write-back

// Books tab column order, 1-indexed to match getRange()
var BOOK_COLS = {
  title: 1, author: 2, cover: 3, reward: 4, summary: 5,
  rating: 6, genre: 7, totalPages: 8, category: 9,
  recommended: 10, isNew: 11
};

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
    
    if (data.action === "addBook") {
      var booksSheet = ss.getSheetByName("Books");
      if (findBookRow(booksSheet, data.title) !== -1) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false, message: "A book titled \"" + data.title + "\" already exists"
        })).setMimeType(ContentService.MimeType.JSON);
      }
      booksSheet.appendRow([
        data.title, data.author || "", data.cover || "", data.reward || 0,
        data.summary || "", data.rating || "", data.genre || "",
        data.totalPages || "", data.category || "",
        data.recommended ? "yes" : "", data.isNew ? "yes" : ""
      ]);
      return ContentService.createTextOutput(JSON.stringify({
        success: true, message: "Added \"" + data.title + "\""
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === "updateBook") {
      var booksSheet = ss.getSheetByName("Books");
      var row = findBookRow(booksSheet, data.title);
      if (row === -1) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false, message: "No book titled \"" + data.title + "\""
        })).setMimeType(ContentService.MimeType.JSON);
      }
      // Only the fields present in the request are touched; the rest keep their values.
      var updated = [];
      for (var field in BOOK_COLS) {
        if (field === "title" || !data.hasOwnProperty(field)) continue;
        var value = data[field];
        if (field === "recommended" || field === "isNew") value = value ? "yes" : "";
        booksSheet.getRange(row, BOOK_COLS[field]).setValue(value);
        updated.push(field);
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true, message: "Updated " + updated.join(", ") + " on \"" + data.title + "\""
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

// Returns the 1-indexed sheet row for a book title, or -1. Titles are the join key
// between the Books and Readers tabs, so the match is exact and case-sensitive.
function findBookRow(booksSheet, title) {
  var values = booksSheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][BOOK_COLS.title - 1] === title) return i + 1;
  }
  return -1;
}

function notifyWill(readerName, bookTitle) {
  try {
    var subject = "📚 Read for Rewards: " + readerName + " finished \"" + bookTitle + "\"!";
    var body = "Hey Will,\n\n" +
      readerName + " just finished reading \"" + bookTitle + "\" and is waiting for your interview/approval.\n\n" +
      "Head to the dashboard to review:\nhttps://willslawrence.github.io/read-for-rewards/\n\n" +
      "(Triple-click the version number to enter admin mode and approve.)";
    
    MailApp.sendEmail({
      to: "willurd@gmail.com",
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
