function onChange(item) {}
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(tab.id, { message: "update scripts" }).then(response => {}).catch(onError);
  }
}
$(function() {
  browser.storage.local.get().then(function(item) { 
    if (item.styling_1) {
      if (item.styling_1.block_1.url_1) { $('input').val(item.styling_1.block_1.url_1); }
      if (item.styling_1.block_1.url_1_type) { $('option[value='+item.styling_1.block_1.url_1_type+']').prop('selected', 'true'); }
      if (item.styling_1.block_1.code_1) { $('textarea').text(item.styling_1.block_1.code_1); }
    }
  });
  $('#save').click(function() {
    browser.storage.local.set({ styling_1: { block_1: { url_1: $('url').val(), url_1_type: $('select').val(), code_1: $('code').val() } } }).then(onChange, onError); 
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  });
  $('#back').click(function() {
    window.location.replace("manage.html");
  });
});