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
$('#url').prop('href', browser.extension.getURL("src/manage.html?create=url&target="));
$('#domain').prop('href', browser.extension.getURL("src/manage.html?create=domain&target="));
$('#subdomain').prop('href', browser.extension.getURL("src/manage.html?create=domain&target="));
  var active_styles;
  browser.storage.local.get(function(item) {
    var styles = objectLength(item) - 1;
    style:
    for (var b = 1; b <= styles; b++) {
      if (item.styling_1 && item.styling_1.disabled != "true" && item.disabled == "false") {
        var blocks = objectLength(item["styling_"+b]) - 2;
        block:
        for (var c = 1; c <= blocks; c++) {
          var urls = (objectLength(item["styling_"+b]["block_"+c]) - 1) / 2;
          url:
          for (var d = 1; d <= urls; d++) { 
            if (item["styling_"+b].block_1["url_"+d] != undefined && ((item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "url" && item["styling_"+b]["block_"+c]["url_"+d] == window.location.href) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "starting" && window.location.href.startsWith(item["styling_"+b]["block_"+c]["url_"+d])) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "domain" && item["styling_"+b]["block_"+c]["url_"+d] == getDomain(window.location.href)) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "everything"))) {
              $.extend(true, active_styles, { "style_name": item["styling_"+b].name });
              break block;
            }
          }
        }
      }
    }
    console.log(active_styles);
  });
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).then(onChange, onError); window.close(); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
});