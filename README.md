# Toggl.com Reports add-on for Google Sheets

## Install the dependences

Perform the command:
    ```
    npm install
    ```

## Development

### Prepare

To get the initial setup working for you, perform the following steps.

1. Get Google Drive Credentials like described in the [node-google-apps-script Documentation](https://www.npmjs.com/package/node-google-apps-script#1-get-google-drive-credentials)
2. Authenticate gapps like described in the [node-google-apps-script Documentation](https://www.npmjs.com/package/node-google-apps-script#2-authenticate-gapps)
3. Create a [new Google Spreadsheet](https://docs.google.com/spreadsheets/create), and copy the ID of the file. The file ID is found in the URL to the spreadsheet:
	docs.google.com/spreadsheets/d/***DRIVE_FILE_ID***/edit#gid=123
4. Open the file *src/environments/dev/debug.local.config.js*, and replace DRIVE_FILE_ID with the ID that you copied.
5. Create a new standalone [Google Apps Script](https://script.google.com) project, and copy the ID of the script. The file ID is found in the URL to the script project:
	script.google.com/a/macros/google.com/d/***DRIVE_FILE_ID***/edit
6. Perform the following commands:

    ```
    mkdir build
    cd build
    mkdir dev
    cd dev
    gapps init *DRIVE_FILE_ID*
    cd ../..
    gulp upload-latest --env dev
    ```

7. Refresh your Apps Script project. You should now see a copy of some of the files from the local source location.

### To upload and test the code

1. Perform the following command to upload the changes:

    ```
    gulp upload-latest --env dev
    ```

2. Open the Apps Script project and make sure, that code is updated.
3. Select 'Publish' > 'Test as add-on...'

