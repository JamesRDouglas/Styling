function onChange(item) { /*console.log("changed");*/ }
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(tab.id, { message: "update scripts" }).then(response => {}).catch(onError);
  }
}
$(function() {
  browser.storage.local.get().then(function(item) {
    $('textarea').text(item.styling_1.code.value);
  });
  $('#update').click(function() {
    var stylingCode = { value: document.getElementById("code").value };
    browser.storage.local.set({ styling_1: { code: stylingCode } }).then(onChange, onError); 
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  });
});