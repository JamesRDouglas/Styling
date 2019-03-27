function onDone(item) { }
function onError(error) { console.log(error); }
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { if (message === "disable") { browser.tabs.sendMessage(tab.id, {message: "styles disabled"}).then(response => {  }).catch(onError); } else if (message === "enable") { browser.tabs.sendMessage(tab.id, {message: "styles enabled"}).then(response => {  }).catch(onError); } else if (message === "update") { browser.tabs.sendMessage(tab.id, {message: "styles updated"}).then(response => {  }).catch(onError); } } }
function saveOptions() {
  browser.storage.local.get().then(function(item) {
    item.default.options = { tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), line_count: $('#line-count').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: $('#error-marker').prop('checked'), soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() };
    browser.storage.local.set(item).then(onDone, onError);
  });
}
$(function() {
  var styles_arr = [], status;
  browser.storage.local.get().then(function(item) {
    if (!item.default || !item.default.name || !item.default.disabled || !item.default.blocks) { item.default = { name: "new style", id: "1", disabled: false, blocks: [ { code: "", urls: [ { address: "", type: "" } ] } ] }; }
    if (!item.default.options) { item.default.options = { tab_size: "2", font_size: "11", line_count: "15", autocomplete: true, error_marker: true, soft_tabs: true, guide_indent: false, show_invisible: false, keybinding: "default" }; browser.storage.local.set(item).then(onDone, onError); default_style = item.default; }
    if (!item.styles[0]) { item.styles[0] = default_style; browser.storage.local.set(item).then(onDone, onError); }
    if (item.styles[0].id !== "1") { item.styles[0].id = "1"; browser.storage.local.set(item).then(onDone, onError); }
    $('#line-count').val(item.default.options.line_count);
    $('#tab-size').val(item.default.options.tab_size);
    $('#font-size').val(item.default.options.font_size);
    if (item.default.options.autocomplete === true) { $('#autocomplete').prop("checked", true); }
    if (item.default.options.error_marker === true) { $('#error-marker').prop("checked", true); }
    if (item.default.options.soft_tabs === true) { $('#soft-tabs').prop("checked", true); }
    if (item.default.options.guide_indent === true) { $('#guide-indent').prop("checked", true); }
    if (item.default.options.show_invisible === true) { $('#show-invisible').prop("checked", true); }
    $('#keybinding').val(item.default.options.keybinding);
    for (a = 0; a < item.styles.length; a = a) {
      if (item.styles[a].disabled === false) { status = ' checked'; } else { status = ''; }
      if (item.styles[a]) {
        styles_arr.push(item.styles[a].id);
        $('#content').append('<div class="style" id="style_'+styles_arr[a]+'" data-id="'+styles_arr[a]+'"><input type="checkbox" class="check"'+status+'><span class="name" title="'+item.styles[a].name+'">'+item.styles[a].name+'</span><button class="edit" data-id="'+styles_arr[a]+'">Edit</button><button class="delete" data-id="'+a+'">Delete</button><div class="url_list"></div></div>');
        a++;
      }
    }
  });
  $('#write-new').click(function() { window.location.href = "edit.html?style=new"; });
  $(document).on('click', '.style', function() { window.location.href = "edit.html?style="+$(this).data("id"); });
  $(document).on('click', '.style > input, .url_list', function(e) { e.stopPropagation(); });
  $(document).on('click', '.check', function() { var style_id = $(this).nextAll().eq(2).data('id'), isChecked = $(this).is(':checked'); browser.storage.local.get(function(item) { if (isChecked) { item.styles[style_id].disabled = false; browser.storage.local.set(item).then(onDone, onError); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); } else { item.styles[style_id].disabled = true; browser.storage.local.set(item).then(onDone, onError); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); } }); });
  $(document).on('click', '.delete', function(e) { e.stopPropagation(); if (confirm('Are you sure you want to delete "'+$(this).parent().find('.name').prop("title")+'"?')) { $(this).parent().remove(); var style_id = $(this).data("id"); browser.storage.local.get(function(item) { item.styles.splice(style_id,1); browser.storage.local.set(item).then(onDone, onError); }); } });
  $(document).on('change', '.options', function() { saveOptions(); });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles disabled") { $('#enabled').prop('disabled', true); } else if (message.message === "styles enabled") { $('#enabled').prop('disabled', false); } });
