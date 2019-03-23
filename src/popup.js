browser.storage.local.get(function(item) {
  if (item.disabled == "true") { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true);
  } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); }  
});
function onChange() { }
function onError(error) { console.log(error); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
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
var active_styles = [];
browser.tabs.query({currentWindow: true, active: true}).then(function(tabs) { currentURL = tabs[0].url; });
browser.storage.local.get(function(item) {
  var styles = objectLength(item) - 1;
  for (var b = 1; b <= styles; b++) {
    var blocks = objectLength(item["styling_"+b]) - 2;
    block:
    for (var c = 1; c <= blocks; c++) {
      var urls = (objectLength(item["styling_"+b]["block_"+c]) - 1) / 2;
      for (var d = 1; d <= urls; d++) { 
        if (item["styling_"+b].block_1["url_"+d] != undefined && ((item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "url" && item["styling_"+b]["block_"+c]["url_"+d] == currentURL) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "starting" && currentURL.startsWith(item["styling_"+b]["block_"+c]["url_"+d])) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "domain" && item["styling_"+b]["block_"+c]["url_"+d] == getDomain(currentURL)) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "everything"))) {
          var styleTitle = "style_"+b+"_name";
          $.extend(true, active_styles, { [styleTitle]: item["styling_"+b].name });
          break block;
        }
      }
    }
  }
  console.log(active_styles);
  for (x = 1; x <= objectLength(active_styles); x++) { $('#active-styles').append('<div><input type="checkbox"> <span>'+active_styles["style_"+x+"_name"]+'</span><a href="edit.html?style='+x+'" class="edit">edit</a><a href="#" class="delete" title="Not implemented">delete</a></div>'); }
  if (objectLength(active_styles) === 0) { $('#active-styles').append('<i>No styles for this page</i>'); }
});
document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    window.location.reload();
  }
}
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).then(onChange, onError); window.close(); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
  $(document).on('click', '#url', function() { browser.tabs.create({ url: $(this).prop('href') }); return false; });
  $(document).on('click', '#domain', function() { browser.tabs.create({ url: $(this).prop('href') }); return false; });
  $(document).on('click', '#subdomain', function() { browser.tabs.create({ url: $(this).prop('href') }); return false; });
  $(document).on('click', '.edit', function() { browser.tabs.create({ url: $(this).prop('href') }); return false; });
});









