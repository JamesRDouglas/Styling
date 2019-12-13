browser.storage.local.get(function(item) { if (item.disabled === true) { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true); } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); } });
function onError(error) { console.log(error); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {action: message}).catch(onError); } }
function getDomain(url, subdomain) { subdomain = subdomain || false; url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (subdomain === true) { url = url.split('.').slice(url.length - 2).join('.'); } if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function generateNewStyle(type,url) { browser.storage.local.get(function(item) { var currentStyle = item.default, currentStyleId; if (item.styles.length === 0) { currentStyle.id = 1; currentStyleId = 1; } else { currentStyle.id = item.styles.length+1; currentStyleId = item.styles.length+1; } currentStyle.blocks[0].urls[0].type = type; currentStyle.blocks[0].urls[0].address = url; item.styles.push(currentStyle); browser.storage.local.set(item).catch(onError); }); browser.tabs.create({ url: browser.extension.getURL('src/edit.html?style='+currentStyleId) }); window.close(); return false; }
function loadStyles(currentURL) {
  var applicable_styles = [], y = 0;
  browser.storage.local.get(function(item) {
    if (typeof item.styles !== "undefined" && item.styles.length > 0) {
      for (var s = 0; s < item.styles.length; s++) {
        var status = (item.styles[s].disabled === false)?"enabled":"disabled";
        block:
        for (var b = 0; b < item.styles[s].blocks.length; b++) {
          var urls = item.styles[s].blocks[b].urls.length;
          for (var u = 0; u < urls; u++) {
            if (item.styles[s].blocks[0].urls[u]) {
              if (
                (item.styles[s].blocks[b].urls[u].type === "url" && item.styles[s].blocks[b].urls[u].address === currentURL) ||
                (item.styles[s].blocks[b].urls[u].type === "starting" && currentURL.startsWith(item.styles[s].blocks[b].urls[u].address)) ||
                (item.styles[s].blocks[b].urls[u].type === "domain" && item.styles[s].blocks[b].urls[u].address === getDomain(currentURL)) ||
                (item.styles[s].blocks[b].urls[u].type === "everything")
              ) { applicable_styles.push({ id: item.styles[s].id, name: item.styles[s].name, is_disabled: item.styles[s].disabled }); break block; }
            }
          }
        }
      }
      if (applicable_styles.length) { for (sl = 0; sl < applicable_styles.length; sl++) { $('#applicable-styles').append('<div data-id="'+applicable_styles[sl].id+'"><input class="check" type="checkbox"'+(applicable_styles[sl].is_disabled?'':' checked')+'><span>'+applicable_styles[sl].name+'</span><a href="edit.html?style='+applicable_styles[sl].id+'" class="fa fa-edit" title="Edit style"></a><a href="#" class="fa fa-trash-alt" title="Not implemented"></a></div>'); } } else { $('#applicable-styles').append('<i>No styles for this page</i>'); }
    } else { $('#applicable-styles').append('<i>No styles installed</i>'); }
  });
}
var currentURL;
$.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
$('#disable').change(function() { if ($(this).is(':checked')) { $('img').prop("src", "../images/StylingDisabled.png"); browser.browserAction.setIcon({path: "../images/StylingDisabled.png"}); browser.storage.local.set({ disabled: true }).catch(onError); browser.tabs.query({}).then(function(tabs) { sendMessageToTabs(tabs,"disable"); }).catch(onError); } else { $('img').prop("src", "../images/Styling.png"); browser.browserAction.setIcon({path: "../images/Styling.png"}); browser.storage.local.set({ disabled: false }).catch(onError); browser.tabs.query({}).then(function(tabs) { sendMessageToTabs(tabs,"enable"); }).catch(onError); } });
browser.tabs.query({currentWindow: true, active: true}).then(function(tabs) { currentURL = tabs[0].url; loadStyles(currentURL); });
$(function() {
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).catch(onError); window.close(); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
  $(document).on('change', '.check', function() { var currentStyle = $(this).parent().data('id'), value; if (currentStyle === undefined) { return false; } browser.storage.local.get(function(item) { item.styles[currentStyle].disabled = ($(this).is(':checked') === "true"); browser.storage.local.set(item).catch(onError); }); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); });
  $(document).on('click', '.edit', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '#url', function() { generateNewStyle('url',currentURL); });
  $(document).on('click', '#domain', function() { generateNewStyle('url',getDomain(currentURL)); });
  $(document).on('click', '#subdomain', function() { generateNewStyle('url',getDomain(currentURL,true)); });
});
browser.runtime.onMessage.addListener(function(message) { if (message.action === "disable" || message.action === "enable") { } });
browser.runtime.onMessage.addListener(function(message) { if (message.action === "update") { $('#applicable-styles').empty(); loadStyles(); } });
