
/**
 * Called when an add-on is installed.
 * @param {Object} e Apps Script onInstall event object
 */
function onInstall(e) {
  onOpen(e);
}


/**
 * Called when a spreadsheet that is associated with this add-on is opened.
 * @param {Object} e Apps Script onInstall event object
 */
function onOpen(e) {
  var addonMenu = SpreadsheetApp.getUi().createAddonMenu();
  addonMenu.addItem('Test Button', 'onTestButton');
  addonMenu.addToUi();
}

function onTestButton() {

  console.log('Test Button clicked', app.countSheets());
}
