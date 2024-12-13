// Main configuration
const DEFAULT_SHEET_ID = ""; // Default spreadsheet ID
const DEFAULT_FOLDER_ID = ""; // Default folder ID for file uploads

function doPost(e) {
  try {
    // Parse input parameters
    const sheetId = DEFAULT_SHEET_ID;
    const folderId = DEFAULT_FOLDER_ID;
    const sheetName = e.parameter.submission;

    // Fetch column mappings dynamically
    const sheetToColumns = getSheetToColumnsConfig(sheetId);
    if (!sheetToColumns[sheetName]) {
      throw new Error(`Sheet "${sheetName}" is not configured.`);
    }

    const parameterMap = sheetToColumns[sheetName];
    const data = mapParametersToValues(e.parameter, parameterMap);

    // Handle file uploads if provided
    if (e.parameter["filename"]) {
      const fileUrl = uploadFileToGoogleDrive(folderId, e.parameter.fileContent, e.parameter.filename);
      data["ResumeUrl"] = fileUrl; // Explicitly map the file URL to ResumeUrl
    }

    // Add data to the corresponding sheet
    addRowToSheet(sheetId, sheetName, data, parameterMap);
    return sendSuccessResponse("Data has been submitted successfully");
  } catch (error) {
    Logger.log("Error in doPost: " + error);
    return sendErrorResponse("An unexpected error occurred", error);
  }
}

// Fetch sheet-to-column mappings from a configuration sheet
function getSheetToColumnsConfig(sheetId) {
  const configSheetName = "Config"; // Name of the configuration sheet
  const doc = SpreadsheetApp.openById(sheetId);
  const configSheet = doc.getSheetByName(configSheetName);

  if (!configSheet) {
    throw new Error(`Configuration sheet "${configSheetName}" not found.`);
  }

  const rows = configSheet.getDataRange().getValues(); // Get all rows from the config sheet
  const mappings = {};

  rows.forEach((row) => {
    const [sheetName, ...columns] = row; // First column is the sheet name, rest are column headers
    if (sheetName) {
      mappings[sheetName] = columns.filter(Boolean); // Only include non-empty columns
    }
  });
  return mappings;
}

// Map parameters to values based on column definitions
function mapParametersToValues(parameters, columns) {
  const mappedValues = {};
  columns.forEach((col) => {
    mappedValues[col] = parameters[col] || ""; // Default to an empty string if parameter is missing
  });
  return mappedValues;
}

// Upload a file to Google Drive
function uploadFileToGoogleDrive(folderId, data, filename) {
  if (!data || !filename) return "";

  try {
    const contentType = data.substring(5, data.indexOf(";"));
    const bytes = Utilities.base64Decode(data.substr(data.indexOf("base64,") + 7));
    const blob = Utilities.newBlob(bytes, contentType, filename);

    const folder = DriveApp.getFolderById(folderId);
    const uploadedFile = folder.createFile(blob);

    return uploadedFile.getUrl();
  } catch (error) {
    Logger.log("File upload error: " + error);
    return "";
  }
}

// Add a row to the sheet
function addRowToSheet(sheetId, sheetName, data, columns) {
  try {
    const doc = SpreadsheetApp.openById(sheetId);
    const sheet = doc.getSheetByName(sheetName);

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }

    // Create a row with all columns, including ResumeUrl
    const row = columns.map((col) => (col === "Timestamp" ? getFormattedTimestamp() : data[col] || ""));
    sheet.appendRow(row);
  } catch (error) {
    Logger.log("Error adding row: " + error);
    sendErrorResponse("Failed to add data to the sheet", error);
  }
}

// Get formatted timestamp
function getFormattedTimestamp() {
  const timeZone = Session.getScriptTimeZone();
  return Utilities.formatDate(new Date(), timeZone, "yyyy-MM-dd HH:mm:ss");
}

// Success response
function sendSuccessResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({ success: message })).setMimeType(ContentService.MimeType.JSON);
}

// Error response
function sendErrorResponse(message, error = null) {
  const response = { error: message };
  if (error) response.details = error.toString();
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
