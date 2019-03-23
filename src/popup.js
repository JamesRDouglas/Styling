browser.storage.local.get().then(onGot, onError);
function onGot(item) { 
  if (item.disabled.value == "true") { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true);
  } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); }
}
function onChange() { /*console.log("changed");*/ }
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(tab.id, {greeting: "Hi from background script"}).then(response => { console.log("done"); }).catch(onError);
  }
}
$.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
$('#disable').change(function() {
  if ($(this).is(':checked')) {
    $('img').prop("src", "../images/StylingDisabled.png");
    browser.browserAction.setIcon({path: "../images/StylingDisabled.png"});
    browser.storage.local.set({ disabled: { value: "true" } }).then(onChange, onError);
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  } else {
    $('img').prop("src", "../images/Styling.png");
    browser.browserAction.setIcon({path: "../images/Styling.png"});
    browser.storage.local.set({ disabled: { value: "false" } }).then(onChange, onError);
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  }
});
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url:"manage.html" }).then(onChange, onError); });
  $('#details').click(function() { browser.tabs.create({ url:"manage.html" }).then(onChange, onError); });
});