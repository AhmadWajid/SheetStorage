<p align="center">
    <img src="https://qualitytraining.be/content/uploads/2022/07/formation-google-sheet-belgique.png" align="center" width="20%">
</p>
# SheetStorage ( Dynamic File Upload and Submission System)
This project provides a flexible, dynamic web form for file uploads and submissions, leveraging Google Sheets as a backend storage solution using Google Apps Script.

## Features

- **Dynamic Form Generation**: Automatically adjusts form fields based on selected submission type
- **File Upload Support**: Seamless file uploading to Google Drive
- **Google Sheets Integration**: Stores submission data in configurable spreadsheets
- **Bootstrap Styling**: Responsive and modern user interface
- **Error Handling**: Comprehensive error management and user feedback

## Detailed Setup Guide

### Step 1: Prepare Google Workspace

1. **Create a Google Account**
   - If you don't have one, sign up at [accounts.google.com](https://accounts.google.com)

2. **Create a New Google Sheet and a folder to upload files to **
   - Open a new folder in drive and create Google Sheets
   - Click "Blank" to create a new spreadsheet
   - Give it a name
   - In the same folder as the Google Sheets, create a folder to store the files
   ![Should look like this ](/images/Folder.png)

3. **Set Up Configuration Sheet**
   - Rename the first sheet to "Config"
   - Add column headers for your submission types
   
   Example Config Sheet:
   ```
   A1: Emails    | B1: Email
   A2: Resume    | B2: JobTitle | C2: Name | D2: Email | E2: Message | F2: ResumeUrl
   ```

   ![Create Google Sheet Config](/images/Config.png)

### Step 2: Create Google Apps Script

1. **Open Script Editor**
   - In your Google Sheet, go to navigation ribbon Extensions > Apps Script
   
   ![Open Apps Script](/images/open-apps-script.png)

2. **Copy Project Code**
   - Replace the default script with the provided `Code.gs`
   - Replace `DEFAULT_SHEET_ID` with your sheet's ID (you can find it in the url enclosed between /ID/)
      ![Sheet ID](/images/sheet-id.png)
   - Replace `DEFAULT_FOLDER_ID` with a Google Drive folder ID for uploads
      ![Folder ID](/images/folder-id.png)

3. **Deploy Web App**
   - Click "Deploy" > "New Deployment"
   - Choose "Web app" as deployment type
   - Set "Execute as" to your Google account
   - Set "Who has access" to "Anyone"
   

4. **Copy Web App URL**
   - After deployment, copy the provided web app URL
   - Replace `APILINK` in the HTML file with this URL

### Step 3: Frontend Setup

1. **Download Project Files**
   - Clone or download the project repository
   
2. **Modify HTML**
   - Open `index.html`
   - Update `APILINK` with your Google Apps Script web app URL
   
   ```javascript
   const APILINK = "YOUR_COPIED_WEB_APP_URL";
   ```

### Step 4: Testing

1. **Open HTML File**
   - Open `index.html` in a web browser
   
2. **Test Submission Types**
   - Try "Emails" and "Resume" submission types
   - Upload files, fill out forms
   
3. **Verify Google Sheet**
   - Check your Google Sheet to confirm data is being recorded
   
## Troubleshooting

### Common Issues

1. **Authorization Errors**
   - Ensure you've deployed the web app and set correct permissions
   - Re-deploy if authentication fails

2. **File Upload Problems**
   - Check Google Drive folder permissions
   - Verify file size and type restrictions

3. **Form Not Submitting**
   - Check browser console for JavaScript errors
   - Verify web app URL is correct

## Advanced Customization

### Adding New Submission Types

1. Update `formConfigurations` in HTML
2. Modify Config sheet in Google Sheets
3. Add corresponding columns in target sheets

### Styling and Responsiveness

- Modify Bootstrap classes in HTML
- Add custom CSS as needed

## Security Notes

- Use Google Workspace security settings
- Implement input validation
- Be cautious with sensitive data

## Technology Stack

- Frontend: HTML5, JavaScript, Bootstrap 5
- Backend: Google Apps Script
- Storage: Google Sheets
- File Storage: Google Drive
