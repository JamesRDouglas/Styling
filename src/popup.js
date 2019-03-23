browser.storage.local.get().then(onGot, onError);
function onGot(item) { 
  if (item.disabled == "true") { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true);
  } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); }
}
function onChange() { }
function onError(error) { console.log(`Error: ${error}`); }
function getDomain(url) { url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function sendDisableToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {message: "all styles disabled"}).then(response => {  }).catch(onError); } }
function sendEnableToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {message: "all styles enabled"}).then(response => {  }).catch(onError); } }
$.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
$('#disable').change(function() {
  if ($(this).is(':checked')) {
    $('img').prop("src", "../images/StylingDisabled.png");
    browser.browserAction.setIcon({path: "../images/StylingDisabled.png"});
    browser.storage.local.set({ disabled: "true" }).then(onChange, onError);
    browser.tabs.query({ currentWindow: true }).then(sendDisableToTabs).catch(onError);
  } else {
    $('img').prop("src", "../images/Styling.png");
    browser.browserAction.setIcon({path: "../images/Styling.png"});
    browser.storage.local.set({ disabled: "false" }).then(onChange, onError);
    browser.tabs.query({ currentWindow: true }).then(sendEnableToTabs).catch(onError);
  }
});
$('#url').prop('title', window.location.href);
$('#domain').prop('title', getDomain(window.location.href));
$('#subdomain').prop('title', getDomain(window.location.href));
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).then(onChange, onError); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
});