function onChange(item) {}
function onError(error) { console.log(`${error}`); }
function sendMessageToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, { message: "styles updated" }).then(response => {}).catch(onError); } }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function updateBlocks() { for (var a = 1; a <= $('.block').length; a++) { $('.block:nth-of-type('+a+')').prop('id', 'block_'+a).children('span:nth-of-type(2)').text(a); $('.block:nth-of-type('+a+')').find('div.code').prop('id', 'code_'+a); } $('div.code').each(function(){ aceinit.call(this); }); }
function saveOptions() {
  browser.storage.local.get().then(function(item) {
    var currentStyle = 'styling_'+style_id;
    $.extend(true, item, { [currentStyle]: { options: { tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), line_count: $('#line-count').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: $('#error-marker').prop('checked'), soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() } } }); 
    browser.storage.local.set(item).then(onChange, onError);
  });
  $('div.code').each(function(){ aceinit.call(this); });
}
function aceinit() {
  var e = ace.edit(this);
  ace.require("ace/ext/keybinding_menu", "ace/ext/language_tools", "ace/ext/searchbox");
  e.setOptions({ maxLines: Infinity, fixedWidthGutter: true, printMargin: false, navigateWithinSoftTabs: true, theme: "ace/theme/crimson_editor", useSoftTabs: $('#soft-tabs').prop('checked'), minLines: $('#line-count').val(), maxLines: $('#line-count').val(), displayIndentGuides: $('#guide-indent').prop('checked'), showInvisibles: $('#show-invisible').prop('checked'), tabSize: Number($('#tab-size').val()), fontSize: Number($('#font-size').val()), enableBasicAutocompletion: $('#autocomplete').prop('checked'), enableLiveAutocompletion: $('#autocomplete').prop('checked'), useWorker: $('#error-marker').prop('checked'), mode: "ace/mode/css" });
  if ($('#keybinding').val() !== "default") { e.setKeyboardHandler("ace/keyboard/"+$('#keybinding').val()); }
  e.resize();
  return e;
}
$(function() {
  browser.storage.local.get().then(function(item) { 
    var options = item.options; new_target = new URLSearchParams(window.location.search).get('new'), new_type = new URLSearchParams(window.location.search).get('type'), style_id = new URLSearchParams(window.location.search).get('style');
    if (new_target && new_type && typeof new_target === "string" && typeof new_type === "string") { 
      var newstyle_name, newstyle_id;
      for (a = 1; a = a; a++) { if (styles_arr.indexOf(a) === -1) { newstyle_name = "styling_"+a; break; } }
      $.extend(true, item, { [newstyle_name]: { name: "new style", disabled: "false", block_1: { code: "", url_1: [new_target], url_1_type: [new_type] }, options } });
      browser.storage.local.set(item).then(onChange, onError);
      window.location = 'edit.html?style='+newstyle_id;
    }
    if (!style_id) { window.location = 'edit.html?style=1'; }
    if (item["styling_"+style_id] === undefined || typeof style_id === "number") {
      var style_name = "styling_"+style_id;
      $.extend(true, item, { [style_name]: { name: "new style", disabled: "false", block_1: { code: "", url_1: "", url_1_type: "url" }, options } });
      browser.storage.local.set(item).then(onChange, onError);
      window.location = 'edit.html?style='+style_id;
    }
    if (item.disabled === "true") { $('#enabled').prop('disabled', true); } else { $('#enabled').prop('disabled', false); }
    if (item["styling_"+style_id] != undefined) {
      $('#style-name').val(item["styling_"+style_id].name);
      $('#line-count').val(item["styling_"+style_id].options.line_count);
      $('#tab-size').val(item["styling_"+style_id].options.tab_size);
      $('#font-size').val(item["styling_"+style_id].options.font_size);
      if (item["styling_"+style_id].disabled === "true") { $('#enabled').prop('checked', false); } else { $('#enabled').prop('checked', true); }
      if (item["styling_"+style_id].options.autocomplete === "true") { $('#autocomplete').prop("checked", true); }
      if (item["styling_"+style_id].options.error_marker === "true") { $('#error-marker').prop("checked", true); }
      if (item["styling_"+style_id].options.soft_tabs === "true") { $('#soft-tabs').prop("checked", true); }
      if (item["styling_"+style_id].options.guide_indent === "true") { $('#guide-indent').prop("checked", true); }
      if (item["styling_"+style_id].options.show_invisible === "true") { $('#show-invisible').prop("checked", true); }
      $('#keybinding').val(item["styling_"+style_id].options.keybinding);
      var blocks = objectLength(item["styling_"+style_id]) - 3;
      for (var b = 1; b <= blocks; b++) {
        if (blocks > 1 && b > 1) { $('#content > .block:last-of-type > .add_block').click(); }
        var urls = (objectLength(item["styling_"+style_id]["block_"+b]) - 1) / 2;
        for (var c = 1; c <= urls; c++) { 
          if (urls > 1 && c > 1) { $('body div.block:nth-of-type('+b+') section:last-of-type .add_target').click(); }
          if (item["styling_"+style_id]["block_"+b]["url_"+c]) { $('body .block:nth-of-type('+b+') section:nth-of-type('+c+') input.url').val(item["styling_"+style_id]["block_"+b]["url_"+c]); }
          if (item["styling_"+style_id]["block_"+b]["url_"+c+"_type"]) { $('body .block:nth-of-type('+b+') section:nth-of-type('+c+') select').val(item["styling_"+style_id]["block_"+b]["url_"+c+"_type"]); }
          if (item["styling_"+style_id]["block_"+b]["url_"+c+"_type"] == 'everything') { $('body .block:nth-of-type('+b+') section:nth-of-type('+c+') input.url').hide(); }
        }
        if (item["styling_"+style_id]["block_"+b].code) { ace.edit("code_"+b).setValue(item["styling_"+style_id]["block_"+b].code, -1); updateBlocks(); }
      }
      updateBlocks();
    }
    $('#enabled').click(function() { 
      var code = item, currentStyle = 'styling_'+style_id;
      if ($('#enabled').is(':checked')) { $.extend(true, code, { [currentStyle]: { disabled: "false" } }); browser.storage.local.set(code).then(onChange, onError); browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
      } else { $.extend(true, code, { [currentStyle]: { disabled: "true" } }); browser.storage.local.set(code).then(onChange, onError); browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError); } 
    });
  });
  updateBlocks();
  $('#save').click(function() {
    if ($('#style-name').val()) {
      browser.storage.local.get().then(function(item) {
        var currentStyle = 'styling_'+style_id;
        delete item[currentStyle];
        $.extend(true, item, { [currentStyle]: { name: $('#style-name').val(),  options: { tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), line_count: $('#line-count').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: $('#error-marker').prop('checked'), soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() } } });
        for (var c = 1; c <= $('div.block').length; c++) {
          var blockName = "block_"+c, urls = $('div.block:nth-of-type('+c+')').children('section').length;
          $.extend(true, item, { [currentStyle]: { [blockName]: { code: ace.edit("code_"+c).getValue().replace(/^|\s+$/g, '') } } });
          for (var b = 1; b <= urls; b++) { 
            var objectUrl = 'url_'+b, objectUrlType = objectUrl+'_type';
            $.extend(true, item, { [currentStyle]: { [blockName]: { [objectUrl]: $('div.block:nth-of-type('+c+')').find('section:nth-of-type('+b+')').children('input.url').val(), [objectUrlType]: $('div.block:nth-of-type('+c+')').find('section:nth-of-type('+b+')').children('select').val() } } });
          }
        }
        browser.storage.local.set(item).then(onChange, onError);
      });
      browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
    } else { alert('Please enter a name'); return false; }
  });
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


