browser.storage.local.get(function(item) { if (item.disabled === true) { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true); } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); } });
function onDone(item) { }
function onError(error) { console.log(error); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { if (message === "disable") { browser.tabs.sendMessage(tab.id, {message: "styles disabled"}).then(response => {  }).catch(onError); } else if (message === "enable") { browser.tabs.sendMessage(tab.id, {message: "styles enabled"}).then(response => {  }).catch(onError); } else if (message === "update") { browser.tabs.sendMessage(tab.id, {message: "styles updated"}).then(response => {  }).catch(onError); } } }
function getDomain(url, subdomain) { subdomain = subdomain || false; url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (!subdomain) { url = url.split('.').slice(url.length - 2).join('.'); } if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function addStylesToList(y, styles_status, applicable_styles) { var currentStatus = ""; if (styles_status[y] === "enabled") { currentStatus = " checked"; } if (applicable_styles[y]) { $('#applicable-styles').append('<div data-id="'+y+'"><input class="check" type="checkbox"'+currentStatus+'><span>'+applicable_styles[y]+'</span><a href="edit.html?style='+y+'" class="edit" title="Edit style"><i class="far fa-edit"></i></a><a href="#" class="delete" title="Not implemented"><i class="far fa-trash-alt"></i></a></div>'); } else { y++; addStylesToList(y, styles_status, applicable_styles); } y++; return y; }
function loadStyles(currentURL) {
  var applicable_styles = {}, styles_status = {}, y = 0;
  browser.storage.local.get(function(item) {
    if (!item.default || !item.default.name || !item.default.disabled || !item.default.blocks) { browser.storage.local.set({ default: { name: "new style", disabled: false, blocks: [ { code: "", urls: [ { address: "", type: "" } ] } ] } }).then(onDone, onError); default_style = item.default; }
    if (!item.default.options) { item.default.options = { tab_size: "2", font_size: "11", line_count: "15", autocomplete: true, error_marker: true, soft_tabs: true, guide_indent: false, show_invisible: false, keybinding: "default" }; browser.storage.local.set(item).then(onDone, onError); default_style = item.default; }
    var styles = item.styles.length;
    for (var b = 0; b < styles; b++) {
      var blocks = item.styles[b].length;
      if (item.styles[b].disabled === false) { status = "enabled"; } else { status = "disabled"; }
      $.extend(true, styles_status, { [b]: status });
      block:
      for (var c = 0; c < blocks; c++) {
        var urls = item.styles[b].blocks[c].urls.length;
        for (var d = 0; d < urls; d++) { 
          if (item.styles[b].blocks[0].urls[d]) {
            if ((item.styles[b].blocks[c].urls[d].type === "url" && item.styles[b].blocks[c].urls[d].address === currentURL) || (item.styles[b].blocks[c].urls[d].type === "starting" && currentURL.startsWith(item.styles[b].blocks[c].urls[d].address)) || (item.styles[b].blocks[c].urls[d].address === "domain" && item.styles[b].blocks[c].urls[d].address === getDomain(currentURL)) || (item.styles[b].blocks[c].urls[d].type === "everything")) {
              $.extend(true, applicable_styles, { [b]: item.styles[b].name });
              break block;
            }
          } else { item.styles[b].blocks[0] = item.default.blocks[0]; window.location.reload(); }
        }
      }
    }
    for (x = 0; x > -1; x++) { if (x === 0 && y === objectLength(applicable_styles)) { break; } y = addStylesToList(y, styles_status, applicable_styles); if (y > objectLength(applicable_styles)) { break; } }
    if (objectLength(applicable_styles) === 0) { $('#applicable-styles').append('<i>No styles for this page</i>'); }
  });
}
var currentURL;
$.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
$('#disable').change(function() { if ($(this).is(':checked')) { $('img').prop("src", "../images/StylingDisabled.png"); browser.browserAction.setIcon({path: "../images/StylingDisabled.png"}); browser.storage.local.set({ disabled: true }).then(onDone, onError); browser.tabs.query({currentWindow: true}).then(function(tabs) { sendMessageToTabs(tabs,"disable"); }).catch(onError); } else { $('img').prop("src", "../images/Styling.png"); browser.browserAction.setIcon({path: "../images/Styling.png"}); browser.storage.local.set({ disabled: false }).then(onDone, onError); browser.tabs.query({currentWindow: true}).then(function(tabs) { sendMessageToTabs(tabs,"enable"); }).catch(onError); } });
browser.tabs.query({currentWindow: true, active: true}).then(function(tabs) { currentURL = tabs[0].url; loadStyles(currentURL); });
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).then(onDone, onError); window.close(); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
  $('#url').prop('href', browser.extension.getURL("src/edit.html?new=url&target=")+currentURL);
  $('#domain').prop('href', browser.extension.getURL("src/edit.html?new=domain&target=")+getDomain(currentURL));
  $('#subdomain').prop('href', browser.extension.getURL("src/edit.html?new=domain&target=")+getDomain(currentURL, true));
  $(document).on('change', '.check', function() { var currentStyle = $(this).parent().data('id'), value; if (currentStyle === undefined) { return false; } browser.storage.local.get(function(item) { item.styles[currentStyle].disabled = ($(this).is(':checked') === "true"); browser.storage.local.set(item).then(onDone, onError); }); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); });
  $(document).on('click', '.edit', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#url', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#domain', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#subdomain', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles disabled" || message.message === "styles enabled") {  } });
browser.runtime.onMessage.addListener(function(message) { if (message.message === "style updated") { $('#applicable-styles').empty(); loadStyles(); } });


