browser.storage.local.get(function(item) {
  if (item.disabled == "true") { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true);
  } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); }  
});
function onChange() { }
function onError(error) { console.log(error); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { if (message === "disable") { browser.tabs.sendMessage(tab.id, {message: "styles disabled"}).then(response => {  }).catch(onError); } else if (message === "enable") { browser.tabs.sendMessage(tab.id, {message: "styles enabled"}).then(response => {  }).catch(onError); } else if (message === "update") { browser.tabs.sendMessage(tab.id, {message: "styles updated"}).then(response => {  }).catch(onError); } } }
function getDomain(url, subdomain) { subdomain = subdomain || false; url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (!subdomain) { url = url.split('.').slice(url.length - 2).join('.'); } if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function addStylesToList(y, styles_status, active_styles) { var currentStatus = ""; if (styles_status["styling_"+y+"_name"] === "false") { currentStatus = " checked"; } if (active_styles["styling_"+y+"_name"]) { $('#active-styles').append('<div data-id="'+y+'"><input class="check" type="checkbox"'+currentStatus+'><span>'+active_styles["styling_"+y+"_name"]+'</span><a href="edit.html?style='+y+'" class="edit"><i class="far fa-edit"></i></a><a href="#" class="delete" title="Not implemented"><i class="far fa-trash-alt"></i></a></div>');  y++; } else { y++; addStylesToList(y, styles_status, active_styles); y++; } return y; }
function loadStyles(currentURL) {
  var active_styles = [], styles_status = [], y = 1;
  browser.storage.local.get(function(item) {
    var styles = objectLength(item) - 2;
    for (var b = 1; b <= styles; b++) {
      var styleTitle = "styling_"+b+"_name", blocks = objectLength(item["styling_"+b]) - 2;
      $.extend(true, styles_status, { [styleTitle]: item["styling_"+b].disabled });
      block:
      for (var c = 1; c <= blocks; c++) {
        var urls = (objectLength(item["styling_"+b]["block_"+c]) - 1) / 2;
        for (var d = 1; d <= urls; d++) { 
          if (item["styling_"+b].block_1["url_"+d] != undefined && ((item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "url" && item["styling_"+b]["block_"+c]["url_"+d] == currentURL) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "starting" && currentURL.startsWith(item["styling_"+b]["block_"+c]["url_"+d])) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "domain" && item["styling_"+b]["block_"+c]["url_"+d] == getDomain(currentURL)) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "everything"))) {
            $.extend(true, active_styles, { [styleTitle]: item["styling_"+b].name });
            break block;
          }
        }
      }
    }
    for (x = 1; x <= objectLength(active_styles); x = x) { if (x > objectLength(active_styles)) { break; } if (active_styles["styling_"+y+"_name"]) { x++; } y = addStylesToList(y, styles_status, active_styles); }
    if (objectLength(active_styles) === 0) { $('#active-styles').append('<i>No styles for this page</i>'); }
  });
}
var currentURL;
$.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
$('#disable').change(function() { if ($(this).is(':checked')) { $('img').prop("src", "../images/StylingDisabled.png"); browser.browserAction.setIcon({path: "../images/StylingDisabled.png"}); browser.storage.local.set({ disabled: "true" }).then(onChange, onError); browser.tabs.query({currentWindow: true}).then(function(tabs) { sendMessageToTabs(tabs,"disable"); }).catch(onError); } else { $('img').prop("src", "../images/Styling.png"); browser.browserAction.setIcon({path: "../images/Styling.png"}); browser.storage.local.set({ disabled: "false" }).then(onChange, onError); browser.tabs.query({currentWindow: true}).then(function(tabs) { sendMessageToTabs(tabs,"enable"); }).catch(onError); } });
browser.tabs.query({currentWindow: true, active: true}).then(function(tabs) { currentURL = tabs[0].url; loadStyles(currentURL); });
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).then(onChange, onError); window.close(); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
  $('#url').prop('href', browser.extension.getURL("src/edit.html?new=url&target=")+currentURL);
  $('#domain').prop('href', browser.extension.getURL("src/edit.html?new=domain&target=")+getDomain(currentURL));
  $('#subdomain').prop('href', browser.extension.getURL("src/edit.html?new=domain&target=")+getDomain(currentURL, true));
  $(document).on('click', '.check', function() { 
    var currentStyle = 'styling_'+$(this).parent().data('id');
    if (currentStyle === "styling_undefined") { return false; }
    if ($(this).is(':checked')) { 
      browser.storage.local.get().then(function(item) {
        $.extend(true, item[currentStyle], { disabled: "false" });
        browser.storage.local.set({ [currentStyle]: item[currentStyle] }).then(onChange, onError);
      });
      browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError);
    } else { 
      browser.storage.local.get().then(function(item) {
        $.extend(true, item[currentStyle], { disabled: "true" });
        browser.storage.local.set({ [currentStyle]: item[currentStyle] }).then(onChange, onError);
      });
      browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); 
    } 
  });
  $(document).on('click', '.edit', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#url', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#domain', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#subdomain', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles disabled" || message.message === "styles enabled") {  } });
browser.runtime.onMessage.addListener(function(message) { if (message.message === "style updated") { $('#active-styles').empty(); loadStyles(); } });


