function onError(error) { console.log(error); }
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {action: message}).catch(onError); } }
function saveOptions() { browser.storage.local.get().then(function(item) { item.default.options = { line_count: $('#line-count').val(), tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: { enabled: $('#error-marker').prop('checked'), errors: $('#error-marker').next('#hidden').find('#errors').prop('checked'), warnings: $('#error-marker').next('#hidden').find('#warnings').prop('checked'), notes: $('#error-marker').next('#hidden').find('#notes').prop('checked') }, soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() }; browser.storage.local.set(item).catch(onError); }); }
function noStylesDetected() { $('#content').append('<div style="padding: 1rem 0 0 2rem;">No styles are currently installed.</div>'); }
function generateStylesArr(item) { styles_arr = []; for (s = 0; s < item.styles.length; s++) { styles_arr.push(item.styles[s].id); } }
function generateNewStyle() { browser.storage.local.get(function(item) { var currentStyle = item.default, newStyleId; if (item.styles.length === 0) { newStyleId = 1; } else { item.latest++; newStyleId = item.latest; } currentStyle.id = newStyleId; item.styles.push(currentStyle); browser.storage.local.set(item).then(function() { window.location = 'edit.html?style='+newStyleId; }).catch(onError); }); }
function toggleStyle(style_id) { browser.storage.local.get().then(function(item) { generateStylesArr(item); var style_index = styles_arr.indexOf(style_id), isChecked = $(this).is(':checked'); item.styles[style_index].enabled = isChecked; browser.storage.local.set(item).catch(onError); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); }); }
function deleteStyle(style_name,style_id) { if (confirm('Are you sure you want to delete "'+style_name+'"?')) { browser.storage.local.get().then(function(item) { generateStylesArr(item); var style_index = styles_arr.indexOf(style_id); if (style_index > -1) { item.styles.splice(style_index,1); browser.storage.local.set(item).then(function() { sendMessageToTabs(tabs,"update"); }).catch(onError); loadContent(); } else { alert('The style "'+style_name+'" could not be deleted. Perhaps it has already been removed?'); } }); } }
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
      generateStylesArr(item);
      for (s = 0; s < styles_arr.length; s++) { $('#content').append('<div class="style" id="style_'+item.styles[s].id+'" data-id="'+item.styles[s].id+'"><input type="checkbox" class="enabled"'+(item.styles[s].enabled?' checked':'')+'><span class="name" title="'+item.styles[s].name+'">'+item.styles[s].name+'</span><button>Edit</button><button class="delete">Delete</button><div class="url_list"></div></div>'); }
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
  $(document).on('click', '.enabled', function() { toggleStyle($(this).parent().data('id')); });
  $(document).on('click', '.delete', function(e) { e.stopPropagation(); deleteStyle($(this).parent().find('.name').prop('title'),$(this).parent().data('id')); });
  $(document).on('change', '.options', function() { saveOptions(); });
  browser.runtime.onMessage.addListener(function(message) { if (message.action === "disable") { $('#enabled').prop('disabled', true); $('#favicon').attr('href','/images/StylingDisabled.png'); } else if (message.action === "enable") { $('#enabled').prop('disabled', false); $('#favicon').attr('href','/images/Styling.png'); } });
  browser.runtime.onMessage.addListener(function(message) { if (message.action === "update") { loadOptions(); loadContent(); } });
});
