browser.storage.local.get(function(item) {
  if (item.disabled == "true") { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true);
  } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); }  
});
function onChange() { }
function onError(error) { console.log(`${error}`); }
function getURL() { browser.tabs.query({currentWindow: true, active: true}).then(function(tabs) { return tabs[0].url; }); }
function sendDisableToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {message: "all styles disabled"}).then(response => {  }).catch(onError); } }
function sendEnableToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {message: "all styles enabled"}).then(response => {  }).catch(onError); } }
function getDomain(url, subdomain) {
  subdomain = subdomain || false;
  url = url.replace(/(https?:\/\/)?(www.)?/i, '');
  if (!subdomain) { url = url.split('.').slice(url.length - 2).join('.'); }
  if (url.indexOf('/') !== -1) { return url.split('/')[0]; }
  return url;
}
$.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
$('#disable').change(function() {
  if ($(this).is(':checked')) {
    $('img').prop("src", "../images/StylingDisabled.png");
    browser.browserAction.setIcon({path: "../images/StylingDisabled.png"});
    browser.storage.local.set({ disabled: "true" }).then(onChange, onError);
    browser.tabs.query({currentWindow: true}).then(sendDisableToTabs).catch(onError);
  } else {
    $('img').prop("src", "../images/Styling.png");
    browser.browserAction.setIcon({path: "../images/Styling.png"});
    browser.storage.local.set({ disabled: "false" }).then(onChange, onError);
    browser.tabs.query({currentWindow: true}).then(sendEnableToTabs).catch(onError);
  }
});
$('#url').prop('href', browser.extension.getURL("src/manage.html?action=create&type=url&target='"+getURL()+"'"));
$('#domain').prop('href', browser.extension.getURL("src/manage.html?action=create&type=domain&target='"+getDomain(getURL(), false)+"'"));
$('#subdomain').prop('href', browser.extension.getURL("src/manage.html?action=create&type=domain&target='"+getDomain(getURL(), true)+"'"));
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).then(onChange, onError); window.close(); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
});