---
title: "Automate Weekly PDF Reports from Google Sheets Using Apps Script"
description: "Learn how to write a custom Google Apps Script to automatically convert spreadsheets into PDFs and email them before your executive sync."
publishDate: 2026-10-20T09:45:00.000Z
image: 'https://picsum.photos/seed/work-mvgbjjb3-1-c/1200/675.jpg'
category: 'automation'
tags: ["Google Sheets", "Apps Script", "Automation", "Productivity"]
theme: "Deep Ocean Cobalt"
---


My Slack was blowing up. It was 1:45 PM on a Thursday, exactly fifteen minutes before our weekly executive sync in the conference room. My VP dropped a message into our leadership channel: "Hey, can someone drop the updated Q3 pipeline summary PDF in here before we start? The old numbers from Tuesday won't cut it." Panic instantly set in. My Google Sheet had the live data, but manually formatting it, downloading it as a clean PDF without cutting off the columns, and attaching it to an email while my hands were shaking always felt like a recipe for a formatting disaster. I needed a way to make this happen instantly, and more importantly, never touch it manually again.

<div style="border-left: 4px solid #2563eb; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>The Breakthrough:</strong> Instead of fighting with manual print settings every week, you can write a short, reusable Google Apps Script function that handles the PDF conversion export parameters and fires off an email draft or direct dispatch automatically on a time-driven trigger.
</div>

![How to Write Custom Apps Script to Email Weekly PDF Reports from Google Sheets AI Automation Guide](https://picsum.photos/seed/work-mvgbjjb3-1-b/1000/550.jpg)

## Why Manual Sheet-to-PDF Exports Always Break Down

If you manage recurring team reports, you have likely run into these three classic bottlenecks:

1. The Formatting Nightmare: Google Sheets export URLs default to standard portrait letter size, chopping off your rightmost columns or squeezing 20 rows of data into an unreadable micro-font.

2. The Timing Crunch: Relying on manual memory means someone always forgets to hit export until leadership asks for the file during the actual meeting.

3. The Stale Cache Problem: Copy-pasting data into static slides or separate PDF editors breaks your single source of truth, leading to conflicting numbers across department decks.

## Step-by-Step Resolution: Building Your Custom Apps Script

Let's fix this once and for all. We are going to build a lightweight script that grabs a specific tab, formats it cleanly into a landscape PDF, and emails it to your stakeholder list.

### Step 1: Open the Script Editor
In your Google Sheet, navigate to the top menu and select Extensions > Apps Script. This opens your development environment right in the browser.

### Step 2: Paste and Customize the Automation Code
Clear out any placeholder code and paste the script below. Be sure to update the spreadsheet ID, sheet name, and recipient email address with your actual corporate details.

```javascript
function sendSheetAsPDF() {
  // 1. Define your spreadsheet and target sheet details
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Pipeline_Summary"); // Change to your exact sheet tab name
  var sheetId = sheet.getSheetId();
  
  // 2. Set export parameters for clean PDF rendering
  var url = ss.getUrl().replace(/edit$/, '');
  var exportUrl = url + 'export?' +
    'exportFormat=pdf&' +
    'format=pdf&' +
    'size=letter&' +
    'portrait=false&' + // Landscape mode prevents column clipping
    'fitw=true&' +      // Fit to width
    'gridlines=false&' +
    'printtitle=false&' +
    'sheetnames=false&' +
    'gid=' + sheetId;

  // 3. Fetch the PDF blob using OAuth token authorization
  var response = UrlFetchApp.fetch(exportUrl, {
    headers: {
      'Authorization': 'Bearer ' +  ScriptApp.getOAuthToken(),
      'MuteHttpExceptions': true
    }
  });
  
  var blob = response.getBlob().setName("Weekly_Executive_Report.pdf");

  // 4. Send the email with the attached PDF
  var emailUser = "exec-team@yourcompany.com"; // Change to your recipient
  var subject = "Automated Weekly Pipeline Report - " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy");
  var body = "Hi team,\n\nAttached is the latest automated weekly pipeline export pulled directly from the live tracking sheet.\n\nBest,\nOperations Team";
  
  GmailApp.sendEmail(emailUser, subject, body, {
    attachments: [blob],
    name: "Automated Reporting Bot"
  });
}
```

### Step 3: Set Up Your Weekly Trigger
Don't just run it manually—let's automate it on a schedule:
1. In the left sidebar of the Apps Script editor, click on the Triggers icon (looks like a clock).

2. Click Add Trigger in the bottom right corner.

3. Choose `sendSheetAsPDF` as the function to run.

4. Select event source as Time-driven, choose Week timer, and pick your preferred day and hour (e.g., every Monday at 8:00 AM).

5. Save the trigger and authorize the requested Google account permissions.

<div style="border-left: 4px solid #2563eb; padding: 12px 16px; margin: 20px 0; background-color: rgba(0,0,0,0.03); border-radius: 4px; color: #111827;">
<strong>Expert Tip:</strong> Always run the function manually once using the "Run" button in the script editor to verify that your Google account permissions are granted and that the email arrives cleanly in your inbox before relying on the automated weekly trigger.
</div>

## Frequently Asked Questions

### Can I include multiple tabs in a single PDF attachment?
The standard export URL method targets one `gid` (sheet ID) at a time. If you need multiple tabs, you can write loops in Apps Script to generate multiple blobs and pass an array of attachments into the `GmailApp.sendEmail` options object.

### Why am I getting an authorization error when the script runs?
When adding new script features that access external URLs (`UrlFetchApp`) or Gmail (`GmailApp`), Google requires explicit user consent. Simply click "Review Permissions" during your first manual test run, select your account, click "Advanced", and proceed to safety to grant access.

### How can I make sure confidential financial data stays secure?
Apps Script executes securely within your Google Workspace boundary using your organizational credentials. Ensure your Google Sheet sharing permissions are restricted strictly to authorized internal personnel so that external users cannot trigger or access the underlying financial data source.
