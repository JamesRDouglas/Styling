function onChange(item) {}
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(tab.id, { message: "update scripts" }).then(response => {}).catch(onError);
  }
}
$(function() {
});