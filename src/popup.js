browser.storage.local.get(function(item) {
  if (item.disabled == "true") { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true);
  } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); }  
});
function onDone(item) { }
function onError(error) { console.log(error); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { if (message === "disable") { browser.tabs.sendMessage(tab.id, {message: "styles disabled"}).then(response => {  }).catch(onError); } else if (message === "enable") { browser.tabs.sendMessage(tab.id, {message: "styles enabled"}).then(response => {  }).catch(onError); } else if (message === "update") { browser.tabs.sendMessage(tab.id, {message: "styles updated"}).then(response => {  }).catch(onError); } } }
function getDomain(url, subdomain) { subdomain = subdomain || false; url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (!subdomain) { url = url.split('.').slice(url.length - 2).join('.'); } if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function addStylesToList(y, styles_status, applicable_styles) { var currentStatus = ""; if (styles_status[y] === "enabled") { currentStatus = " checked"; } if (applicable_styles[y]) { $('#applicable-styles').append('<div data-id="'+y+'"><input class="check" type="checkbox"'+currentStatus+'><span>'+applicable_styles[y]+'</span><a href="edit.html?style='+y+'" class="edit"><i class="far fa-edit"></i></a><a href="#" class="delete" title="Not implemented"><i class="far fa-trash-alt"></i></a></div>'); } else { y++; addStylesToList(y, styles_status, applicable_styles); } y++; return y; }
function loadStyles(currentURL) {
  var applicable_styles = {}, styles_status = {}, y = 0;
  browser.storage.local.get(function(item) {
    var styles = item.styles.length;
    for (var b = 0; b < styles; b++) {
      var blocks = objectLength(item.styles[b]);
      if (item.styles[b].disabled === "false") { status = "enabled"; } else { status = "disabled"; }
      $.extend(true, styles_status, { [b]: status });
      block:
      for (var c = 1; c <= blocks; c++) {
        var urls = (objectLength(item.styles[b]["block_"+c]) - 1) / 2;
        for (var d = 1; d <= urls; d++) { 
          if (item.styles[b].block_1["url_"+d] != undefined && ((item.styles[b]["block_"+c]["url_"+d+"_type"] == "url" && item.styles[b]["block_"+c]["url_"+d] == currentURL) || (item.styles[b]["block_"+c]["url_"+d+"_type"] == "starting" && currentURL.startsWith(item.styles[b]["block_"+c]["url_"+d])) || (item.styles[b]["block_"+c]["url_"+d+"_type"] == "domain" && item.styles[b]["block_"+c]["url_"+d] == getDomain(currentURL)) || (item.styles[b]["block_"+c]["url_"+d+"_type"] == "everything"))) {
            $.extend(true, applicable_styles, { [b]: item.styles[b].name });
            break block;
          }
        }
      }
    }
    for (x = 0; x < objectLength(applicable_styles); x = x) { if (x === objectLength(applicable_styles)) { break; } if (applicable_styles[y]) { x++; } y = addStylesToList(y, styles_status, applicable_styles); }
    if (objectLength(applicable_styles) === 0) { $('#applicable-styles').append('<i>No styles for this page</i>'); }
  });
}
var currentURL;
$.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
$('#disable').change(function() { if ($(this).is(':checked')) { $('img').prop("src", "../images/StylingDisabled.png"); browser.browserAction.setIcon({path: "../images/StylingDisabled.png"}); browser.storage.local.set({ disabled: "true" }).then(onDone, onError); browser.tabs.query({currentWindow: true}).then(function(tabs) { sendMessageToTabs(tabs,"disable"); }).catch(onError); } else { $('img').prop("src", "../images/Styling.png"); browser.browserAction.setIcon({path: "../images/Styling.png"}); browser.storage.local.set({ disabled: "false" }).then(onDone, onError); browser.tabs.query({currentWindow: true}).then(function(tabs) { sendMessageToTabs(tabs,"enable"); }).catch(onError); } });
browser.tabs.query({currentWindow: true, active: true}).then(function(tabs) { currentURL = tabs[0].url; loadStyles(currentURL); });
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).then(onDone, onError); window.close(); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
  $('#url').prop('href', browser.extension.getURL("src/edit.html?new=url&target=")+currentURL);
  $('#domain').prop('href', browser.extension.getURL("src/edit.html?new=domain&target=")+getDomain(currentURL));
  $('#subdomain').prop('href', browser.extension.getURL("src/edit.html?new=domain&target=")+getDomain(currentURL, true));
  $(document).on('click', '.check', function() {  
    var currentStyle = $(this).parent().data('id'); 
    if (currentStyle === undefined) { return false; } 
    browser.storage.local.get(function(item) { 
      item.styles[currentStyle].disabled = $(this).is(':checked').toString();
      browser.storage.local.set({ styles: item.styles }).then(onDone, onError); });
      browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); 
    });
  $(document).on('click', '.edit', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#url', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#domain', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#subdomain', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles disabled" || message.message === "styles enabled") {  } });
browser.runtime.onMessage.addListener(function(message) { if (message.message === "style updated") { $('#applicable-styles').empty(); loadStyles(); } });


