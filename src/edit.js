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
  $('#save').click(function() {
    browser.storage.local.set({ styling_1: { url: $('url').val(), code: $('code').val() } }).then(onChange, onError); 
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  });
  $('#back').click(function() {
    window.location.replace("manage.html");
  });
});