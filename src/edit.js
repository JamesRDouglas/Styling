function onDone(item) { }
function onError(error) { console.log(error); }
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { if (message === "disable") { browser.tabs.sendMessage(tab.id, {message: "styles disabled"}).then(onDone, onError); } else if (message === "enable") { browser.tabs.sendMessage(tab.id, {message: "styles enabled"}).then(onDone, onError); } else if (message === "update") { browser.tabs.sendMessage(tab.id, {message: "styles updated"}).then(onDone, onError); } } }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function updateBlocks() { for (var a = 1; a <= $('.block').length; a++) { $('.block:nth-of-type('+a+')').prop('id', 'block_'+a).children('span:nth-of-type(2)').text(a); $('.block:nth-of-type('+a+')').find('div.code').prop('id', 'code_'+a); } $('div.code').each(function(){ aceinit.call(this); }); }
function saveOptions() { 
  var style_id = new URLSearchParams(window.location.search).get('style');
  browser.storage.local.get().then(function(item) { 
    item.styles[style_id].options = { 
      options: { 
        tab_size: $('#tab-size').val(), 
        font_size: $('#font-size').val(), 
        line_count: $('#line-count').val(), 
        autocomplete: $('#autocomplete').prop('checked'), 
        error_marker: $('#error-marker').prop('checked'), 
        soft_tabs: $('#soft-tabs').prop('checked'), 
        guide_indent: $('#guide-indent').prop('checked'), 
        show_invisible: $('#show-invisible').prop('checked'), 
        keybinding: $('#keybinding').val() 
      } 
    }; 
    browser.storage.local.set(item).then(onDone, onError); 
  }); 
  $('div.code').each(function(){ aceinit.call(this); }); 
}
function aceinit() { ace.config.set('loadWorkerFromBlob', false); var e = ace.edit(this); ace.require("ace/ext/keybinding_menu", "ace/ext/language_tools", "ace/ext/searchbox"); e.setOptions({ maxLines: Infinity, fixedWidthGutter: true, printMargin: false, navigateWithinSoftTabs: true, theme: "ace/theme/crimson_editor", useSoftTabs: $('#soft-tabs').prop('checked'), minLines: $('#line-count').val(), maxLines: $('#line-count').val(), displayIndentGuides: $('#guide-indent').prop('checked'), showInvisibles: $('#show-invisible').prop('checked'), tabSize: Number($('#tab-size').val()), fontSize: Number($('#font-size').val()), enableBasicAutocompletion: $('#autocomplete').prop('checked'), enableLiveAutocompletion: $('#autocomplete').prop('checked'), useWorker: $('#error-marker').prop('checked'), mode: "ace/mode/css" }); if ($('#keybinding').val() !== "default") { e.setKeyboardHandler("ace/keyboard/"+$('#keybinding').val()); } e.resize(); return e; }
$(function() {
  browser.storage.local.get().then(function(item) { 
    var options = item.options; default_style = { name: "new style", disabled: "false", block_1: { code: "", url_1: "", url_1_type: "url" }, options }; new_target = new URLSearchParams(window.location.search).get('new'), new_type = new URLSearchParams(window.location.search).get('type'), style_id = new URLSearchParams(window.location.search).get('style');
    if (new_target && new_type && typeof new_target === "string" && typeof new_type === "string") { var newstyle_id; for (a = 1; a = a; a++) { if (!item.styles[a]) { newstyle_id = a; break; } } item.styles[newstyle_id] = default_style; browser.storage.local.set(item).then(onDone, onError); window.location = 'edit.html?style='+newstyle_id; }
    if (!style_id) { window.location = 'edit.html?style=0'; }
    if (item.styles[style_id] === undefined && typeof style_id === "number") { item.styles[style_id] = default_style; browser.storage.local.set(item).then(onDone, onError); window.location = 'edit.html?style='+style_id; }
    if (!item.styles[style_id].options) { item.styles[style_id].options = options; browser.storage.local.set(item).then(onDone, onError); }
    if (item.disabled === "true") { $('#enabled').prop('disabled', true); } else { $('#enabled').prop('disabled', false); }
    $('#style-name').val(item.styles[style_id].name);
    $('#line-count').val(item.styles[style_id].options.line_count);
    $('#tab-size').val(item.styles[style_id].options.tab_size);
    $('#font-size').val(item.styles[style_id].options.font_size);
    if (item.styles[style_id].disabled === "true") { $('#enabled').prop('checked', false); } else { $('#enabled').prop('checked', true); }
    if (item.styles[style_id].options.autocomplete === "true") { $('#autocomplete').prop("checked", true); }
    if (item.styles[style_id].options.error_marker === "true") { $('#error-marker').prop("checked", true); }
    if (item.styles[style_id].options.soft_tabs === "true") { $('#soft-tabs').prop("checked", true); }
    if (item.styles[style_id].options.guide_indent === "true") { $('#guide-indent').prop("checked", true); }
    if (item.styles[style_id].options.show_invisible === "true") { $('#show-invisible').prop("checked", true); }
    $('#keybinding').val(item.styles[style_id].options.keybinding);
    var blocks = objectLength(item.styles[style_id]) - 3;
    for (var b = 1; b <= blocks; b++) {
      if (blocks > 1 && b > 1) { $('#content > .block:last-of-type > .add_block').click(); }
      var urls = (objectLength(item.styles[style_id]["block_"+b]) - 1) / 2;
      for (var c = 1; c <= urls; c++) { 
        if (urls > 1 && c > 1) { $('body div.block:nth-of-type('+b+') section:last-of-type .add_target').click(); }
        if (item.styles[style_id]["block_"+b]["url_"+c]) { $('body .block:nth-of-type('+b+') section:nth-of-type('+c+') input.url').val(item.styles[style_id]["block_"+b]["url_"+c]); }
        if (item.styles[style_id]["block_"+b]["url_"+c+"_type"]) { $('body .block:nth-of-type('+b+') section:nth-of-type('+c+') select').val(item.styles[style_id]["block_"+b]["url_"+c+"_type"]); }
        if (item.styles[style_id]["block_"+b]["url_"+c+"_type"] == 'everything') { $('body .block:nth-of-type('+b+') section:nth-of-type('+c+') input.url').hide(); }
      }
      if (item.styles[style_id]["block_"+b].code) { ace.edit("code_"+b).setValue(item.styles[style_id]["block_"+b].code, -1); updateBlocks(); }
    }
    updateBlocks();
  });
  updateBlocks();
  $('#save').click(function() {
    if ($('#style-name').val()) {
      browser.storage.local.get().then(function(item) {
        item.styles[style_id] = { name: $('#style-name').val(), disabled: $('#enabled').prop('disabled').toString(), options: { tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), line_count: $('#line-count').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: $('#error-marker').prop('checked'), soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() } };
        for (var c = 1; c <= $('div.block').length; c++) {
          var blockName = "block_"+c, urls = $('div.block:nth-of-type('+c+')').children('section').length;
          item.styles[style_id][blockName] = { code: ace.edit("code_"+c).getValue().replace(/^|\s+$/g, '') };
          for (var b = 1; b <= urls; b++) { 
            var objectUrl = 'url_'+b, objectUrlType = objectUrl+'_type';
            item.styles[style_id][blockName][objectUrl] = $('div.block:nth-of-type('+c+')').find('section:nth-of-type('+b+')').children('input.url').val(), item.styles[style_id][blockName][objectUrlType] = $('div.block:nth-of-type('+c+')').find('section:nth-of-type('+b+')').children('select').val();
          }
        }
        browser.storage.local.set(item).then(onDone, onError);
      });
      browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError);
    } else { alert('Please enter a name'); return false; }
  });
  $('#enabled').click(function() { browser.storage.local.get(function(item) { if ($('#enabled').is(':checked')) { item.styles[style_id].disabled = "false"; browser.storage.local.set(item).then(onDone, onError); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); } else { item.styles[style_id].disabled = "true"; browser.storage.local.set(item).then(onDone, onError); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); } }); });
  $('#beautify').click(function() { $('div.code').each(function(){ ace.edit(this).setValue(css_beautify(ace.edit(this).getValue(), { 'indent_size': 2, 'selector_separator_newline': false, 'space_around_selector_separator': true })); }); });
  $('#back').click(function() { window.location.replace("manage.html"); });
  $(document).on('click', '.add_block', function() { $(this).parent().clone().find('input').val('').end().find('section:not(:first-of-type)').remove().end().find('.code').empty().end().prop('id', '').insertAfter($(this).parent()); updateBlocks(); });
  $(document).on('click', '.remove_block', function() { $(this).parent().remove(); updateBlocks(); });
  $(document).on('click', '.raise_block', function() { $(this).parent().insertBefore($(this).parent().prev()); updateBlocks(); });
  $(document).on('click', '.lower_block', function() { $(this).parent().insertAfter($(this).parent().next()); updateBlocks(); });
  $(document).on('click', '.clone_block', function() { $(this).parent().clone().insertAfter($(this).parent()); ace.edit($(this).parent().next().find('code')).setValue(ace.edit($(this).parent().find('.code').getValue())); updateBlocks(); });
  $(document).on('click', '.beautify_block', function() { ace.edit($(this).parent().find('div.code')[0]).setValue(css_beautify(ace.edit($(this).parent().find('div.code')[0]).getValue(), { 'indent_size': 2, 'selector_separator_newline': false, 'space_around_selector_separator': true })); });
  $(document).on('click', '.add_target', function() { $(this).parent().clone().find('select').val($(this).parent().find('select').val()).end().find('input.url').val('').end().insertAfter($(this).parent()); });
  $(document).on('click', '.remove_target', function() { if ($(this).parent().parent().children('.target').length > 1) { $(this).parent().remove(); } });
  $(document).on('change', 'select', function() { if ($(this).val() == "everything") { $(this).next('input.url').hide(); $(this).parent().addClass('current').parent().children('div.target:not(.current)').remove(); } else { $(this).next('input.url').show(); } });
  $(document).on('change', '.options', function() { saveOptions(); });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles disabled") { $('#enabled').prop('disabled', true); } else if (message.message === "styles enabled") { $('#enabled').prop('disabled', false); } });
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles updated") { browser.storage.local.get().then(function(item) { var style_id = new URLSearchParams(window.location.search).get('style'); if (item.styles[style_id].disabled === "true") { $('#enabled').prop('checked', false); } else { $('#enabled').prop('checked', true); } }); } });


