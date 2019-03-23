function onChange(item) {}
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(tab.id, { message: "update scripts" }).then(response => {}).catch(onError);
  }
}
$(function() {
  browser.storage.local.get().then(function(item) { 
    if (item.styling_1.url) { $('input').val(item.styling_1.url); }
    if (item.styling_1.code) { $('textarea').text(item.styling_1.code); }
  });
  $('#update').click(function() {
    var stylingUrl = document.getElementById("url").value;
    var stylingCode = document.getElementById("code").value;
    browser.storage.local.set({ styling_1: { url: stylingUrl, code: stylingCode } }).then(onChange, onError); 
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  });
});