var currentURL, styles_arr = [];
function onError(error) { console.log(error); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {action: message}).catch(onError); } }
function getDomain(url, subdomain) { subdomain = subdomain || false; url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (subdomain === true) { url = url.split('.').slice(url.length - 2).join('.'); } if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function generateNewStyle(type, url) { var newStyleId; browser.storage.local.get(function(item) { var currentStyle = item.default; if (item.styles.length === 0) { item.latest = 1; newStyleId = 1; } else { item.latest++; newStyleId = item.latest; } currentStyle.id = newStyleId; currentStyle.blocks[0].urls[0].type = type; currentStyle.blocks[0].urls[0].address = url; item.styles.push(currentStyle); browser.storage.local.set(item).then(function() { browser.tabs.create({ url: browser.extension.getURL('src/edit.html?style='+newStyleId) }); window.close(); }, onError); }); }
function listStyles(currentURL) {
  var applicable_styles = [], y = 0;
  browser.storage.local.get(function(item) {
    if (item.styles !== undefined && item.styles.length > 0) {
      for (var s = 0; s < item.styles.length; s++) {
        styles_arr.push(item.styles[s].id);
        var status = (item.styles[s].enabled === true)?"enabled":"disabled";
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
              ) {
                applicable_styles.push({ id: item.styles[s].id, name: item.styles[s].name, is_enabled: item.styles[s].enabled });
                break block;
              }
            }
          }
        }
      }
      if (applicable_styles.length) { for (sl = 0; sl < applicable_styles.length; sl++) { $('#applicable-styles').append('<div data-id="'+applicable_styles[sl].id+'"><input class="enabled" type="checkbox"'+(applicable_styles[sl].is_enabled?' checked':'')+'><span>'+applicable_styles[sl].name+'</span><a href="edit.html?style='+applicable_styles[sl].id+'" class="fa fa-pencil edit" title="Edit style"></a><a href="#" class="fa fa-trash-o delete" title="Delete style"></a></div>'); } } else { $('#applicable-styles').append('<div><i>No styles for this page</i></div>'); }
    } else { $('#applicable-styles').append('<div><i>No styles installed</i></div>'); }
  });
}
browser.storage.local.get(function(item) { if (item.disabled === true) { $('img').prop("src", "../images/StylingDisabled.png"); $('input[type=checkbox]').prop("checked", true); } else { $('img').prop("src", "../images/Styling.png");  $('input[type=checkbox]').prop("checked", false); } });
$.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
$(function() {
  browser.tabs.query({currentWindow: true, active: true}).then(function(tabs) { currentURL = tabs[0].url; listStyles(currentURL); });
  $('img, label').click(function() { $('#disabled').click(); });
  $('#manage').click(function() { browser.tabs.create({ url: "manage.html" }).catch(onError); window.close(); });
  $('#details').click(function() { chrome.runtime.openOptionsPage(); window.close(); });
  $('#disabled').change(function() { if ($(this).is(':checked')) { $('img').prop("src", "../images/StylingDisabled.png"); browser.browserAction.setIcon({path: "../images/StylingDisabled.png"}); browser.storage.local.set({ disabled: true }).catch(onError); browser.tabs.query({}).then(function(tabs) { sendMessageToTabs(tabs,"disable"); }).catch(onError); } else { $('img').prop("src", "../images/Styling.png"); browser.browserAction.setIcon({path: "../images/Styling.png"}); browser.storage.local.set({ disabled: false }).catch(onError); browser.tabs.query({}).then(function(tabs) { sendMessageToTabs(tabs,"enable"); }).catch(onError); } });
  $(document).on('change', '.enabled', function() { var element = $(this), currentStyle = $(this).parent().data('id'); browser.storage.local.get(function(item) { if (item.styles !== undefined && item.styles.length > 0) { for (var s = 0; s < item.styles.length; s++) { if (currentStyle === item.styles[s].id) { item.styles[s].enabled = element.is(':checked'); browser.storage.local.set(item).catch(onError); break; } } } }); browser.tabs.query({}).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); });
  $(document).on('click', '.edit', function() { browser.tabs.create({ url: $(this).prop('href') }); window.close(); return false; });
  $(document).on('click', '.delete', function() { var element = $(this), currentStyle = $(this).parent().data('id'); browser.storage.local.get(function(item) { var style_id = styles_arr.indexOf(currentStyle); if (style_id > -1) { item.styles.splice(style_id, 1); browser.storage.local.set(item); } element.parent().remove(); if ($('#applicable-styles').is(':empty')) { $('#applicable-styles').append('<div><i>No styles for this page</i></div>'); } }); });
  $(document).on('click', '#url', function() { generateNewStyle('url', currentURL); return false; });
  $(document).on('click', '#domain', function() { generateNewStyle('domain', getDomain(currentURL)); return false; });
  $(document).on('click', '#subdomain', function() { generateNewStyle('domain', getDomain(currentURL,true)); return false; });
  browser.runtime.onMessage.addListener(function(message) { if (message.action === "disable" || message.action === "enable") { } });
  browser.runtime.onMessage.addListener(function(message) { if (message.action === "update") { $('#applicable-styles').empty(); listStyles(); } });
});
