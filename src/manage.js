function onError(error) { console.log(error); }
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {action: message}).catch(onError); } }
function saveOptions() { browser.storage.local.get().then(function(item) { item.default.options = { line_count: $('#line-count').val(), tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: { enabled: $('#error-marker').prop('checked'), errors: $('#error-marker').next('#hidden').find('#errors').prop('checked'), warnings: $('#error-marker').next('#hidden').find('#warnings').prop('checked'), notes: $('#error-marker').next('#hidden').find('#notes').prop('checked') }, soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() }; browser.storage.local.set(item).catch(onError); }); }
function noStylesDetected() { $('#content').append('<div style="padding: 1rem 0 0 2rem;">No styles are currently installed.</div>'); }
function generateNewStyle() { browser.storage.local.get(function(item) { var currentStyle = item.default, currentStyleId; if (item.styles.length === 0) { currentStyle.id = 1; currentStyleId = 1; } else { currentStyle.id = item.styles.length+1; currentStyleId = item.styles.length+1; } item.styles.push(currentStyle); browser.storage.local.set(item).catch(onError); window.location = 'edit.html?style='+currentStyleId; }); }
function loadOptions() {
  browser.storage.local.get().then(function(item) {
    if (item.default !== undefined && item.default.options !== undefined) {
      $('#line-count').val(item.default.options.line_count);
      $('#tab-size').val(item.default.options.tab_size);
      $('#font-size').val(item.default.options.font_size);
      if (item.default.options.autocomplete === true) { $('#autocomplete').prop("checked", true); }
      if (item.default.options.error_marker.enabled === true) { $('#error-marker').prop("checked", true); }
      if (item.default.options.soft_tabs === true) { $('#soft-tabs').prop("checked", true); }
      if (item.default.options.guide_indent === true) { $('#guide-indent').prop("checked", true); }
      if (item.default.options.show_invisible === true) { $('#show-invisible').prop("checked", true); }
      $('#keybinding').val(item.default.options.keybinding);
    }
  });
}
function loadContent() {
  $('#content').empty();
  browser.storage.local.get().then(function(item) {
    if (item.default !== undefined && item.default.name !== undefined && item.default.enabled !== undefined && item.default.blocks !== undefined && item.default.options !== undefined && item.styles !== undefined && item.styles[0] !== undefined) {
      for (s = 0; s < item.styles.length; s++) { styles_arr.push(item.styles[s].id); $('#content').append('<div class="style" id="style_'+item.styles[s].id+'" data-id="'+item.styles[s].id+'"><input type="checkbox" class="enabled"'+(item.styles[s].enabled?' checked':'')+'><span class="name" title="'+item.styles[s].name+'">'+item.styles[s].name+'</span><button>Edit</button><button class="delete">Delete</button><div class="url_list"></div></div>'); }
    } else { noStylesDetected(); }
  });
}
var styles_arr = [], status;
$(function() {
  loadOptions();
  loadContent();
  $('#write-new').click(function() { generateNewStyle(); });
  $(document).on('click', '.style', function() { window.location.href = "edit.html?style="+$(this).data("id"); });
  $(document).on('click', '.style > input, .url_list', function(e) { e.stopPropagation(); });
  $(document).on('click', '.enabled', function() { var style_id = styles_arr.indexOf($(this).parent().data('id')), isChecked = $(this).is(':checked'); browser.storage.local.get(function(item) { item.styles[style_id].enabled = isChecked; browser.storage.local.set(item).catch(onError); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); }); });
  $(document).on('click', '.delete', function(e) { e.stopPropagation(); if (confirm('Are you sure you want to delete "'+$(this).parent().find('.name').prop("title")+'"?')) { var style_id = $(this).parent().data("id"), element = $(this).parent(); browser.storage.local.get(function(item) { item.styles.splice(style_id,1); browser.storage.local.set(item).then(function() { element.remove(); if ($('#content').is(':empty')) { noStylesDetected(); } }, onError); }); } });
  $(document).on('change', '.options', function() { saveOptions(); });
});
browser.runtime.onMessage.addListener(function(message) { if (message.action === "disable") { $('#enabled').prop('disabled', true); $('#favicon').attr('href','/images/StylingDisabled.ico'); } else if (message.action === "enable") { $('#enabled').prop('disabled', false); $('#favicon').attr('href','/images/Styling.ico'); } });
browser.runtime.onMessage.addListener(function(message) { if (message.action === "update") { loadOptions(); loadContent(); } });
//todo:
/*
fix injection for sidebars and other windows
make ui better for differently sized screens
fix changing of url type
fix second and above url's not applying sometimes
add importing/exporting
add live preview?
add ui interface for syntax validation options
*/
