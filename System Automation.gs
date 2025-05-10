function onTaskSheetChange(e) {
  const scriptProperties = PropertiesService.getScriptProperties();
  var lastRunTime = scriptProperties.getProperty('lastTaskRunTime');
  var now = new Date();
  var timeDiff = now.getTime() - (lastRunTime ? parseInt(lastRunTime) : 0);

  var editedSheet = e.source.getActiveSheet();
  var sheetName = editedSheet.getSheetName();

  if (sheetName !== "Task Dashboard") return;
  Logger.log(`Change in sheet: ${sheetName} | timeDiff: ${timeDiff}`);

  if (timeDiff < 5000) {
    Logger.log("Function recently ran, skipping to prevent duplicate trigger.");
    return;
  }

  scriptProperties.setProperty('lastTaskRunTime', now.getTime());
  Utilities.sleep(2500);
  checkNewTasks();
}


function checkNewTasks() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Task Dashboard");
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var taskName = row[0];           // A: Task Name
    var assignee = row[1];           // B: Assigned To
    var dueDate = row[2];            // C: Due Date
    var status = row[3];             // D: Status
    var processed = row[4];          // E: Processed (Yes/No)

    if (processed !== "Yes" && taskName !== "") {
      Logger.log(`New Task Found: Row ${i+1} | Task: ${taskName}`);

      // Optional: Send WhatsApp/email notification here
      // sendTaskNotification(taskName, assignee, dueDate);

      // Mark task as processed
      sheet.getRange(i + 1, 5).setValue("Yes"); // Set "Yes" in column E
    }
  }

  Logger.log("Task check complete.");
}
