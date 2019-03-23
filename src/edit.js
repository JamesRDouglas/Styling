function onChange(item) {}
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, { message: "styles updated" }).then(response => {}).catch(onError); } }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function updateBlocks() { for (var a = 1; a <= $('.block').length; a++) { $('.block:nth-of-type('+a+')').prop('id', 'block_'+a).children('span:nth-of-type(2)').text(a); $('.block:nth-of-type('+a+')').find('div.code').prop('id', 'code_'+a); } $('div.code').each(function(){ aceinit.call(this); }); }
function aceinit(){
  var e = ace.edit(this), t = $(this);
  e.setTheme("ace/theme/crimson_editor");
  e.setOptions({ maxLines: Infinity, tabSize: 2, fontSize: 12, useSoftTabs: false, fixedWidthGutter: true, printMargin: false, minLines: 15, maxLines: 15 }); 
  e.getSession().setMode("ace/mode/css");
  return e;
}
$(function() {
  browser.storage.local.get().then(function(item) { 
    if (item.styling_1) {
      $('#style_name').val(item.styling_1.name);
      var blocks = objectLength(item.styling_1) - 2;
      for (var e = 1; e <= blocks; e++) {
        if (blocks > 1 && e > 1) { $('#content > .block:last-of-type > .add_block').click(); }
        var urls = (objectLength(item.styling_1["block_"+e]) - 1) / 2;
        for (var a = 1; a <= urls; a++) { 
          if (urls > 1 && a > 1) { $('body div.block:nth-of-type('+e+') section:last-of-type .add_controls').click(); }
          if (item.styling_1["block_"+e]["url_"+a]) { $('body .block:nth-of-type('+e+') section:nth-of-type('+a+') input.url').val(item.styling_1["block_"+e]["url_"+a]); }
          if (item.styling_1["block_"+e]["url_"+a+"_type"]) { $('body .block:nth-of-type('+e+') section:nth-of-type('+a+') select').val(item.styling_1["block_"+e]["url_"+a+"_type"]); }
          if (item.styling_1["block_"+e]["url_"+a+"_type"] == 'everything') { $('body .block:nth-of-type('+e+') section:nth-of-type('+a+') input.url').hide(); }
        }
        if (item.styling_1["block_"+e].code) { ace.edit("code_"+e).setValue(item.styling_1["block_"+e].code, -1); updateBlocks(); }
        if (item.styling_1.disabled === "true") { $('#enabled').prop('checked', false); } else { $('#enabled').prop('checked', true); }
        if (item.disabled === "true") { $('#enabled').prop('disabled', true); } else { $('#enabled').prop('disabled', false); }
      }
    }
    $('#enabled').click(function() { 
      var code = item; 
      if ($('#enabled').is(':checked')) { 
        $.extend(true, code, { styling_1: { disabled: "false" } });
        browser.storage.local.set(code).then(onChange, onError);
        browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
      } else { 
        $.extend(true, code, { styling_1: { disabled: "true" } }); 
        browser.storage.local.set(code).then(onChange, onError);
        browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
      } 
    });
  });
  updateBlocks();
  $('#save').click(function() {
    if ($('#style_name').val()) {
      browser.storage.local.get().then(function(item) { $.extend(true, item, { styling_1: { name: $('#style_name').val() } }); browser.storage.local.set(item).then(onChange, onError); });
      alert('pre-loop');
      for (var c = 1; c <= $('div.block').length; c++) {
        var blockName = "block_"+c, saved_code = { styling_1: { [blockName]: { code: ace.edit("code_"+c).getValue().replace(/^|\s+$/g, '') } } }, urls = $('div.block:nth-of-type('+c+')').children('section').length;
        for (var b = 1; b <= urls; b++) { 
          var objectUrl = 'url_'+b, objectUrlType = objectUrl+'_type';
          $.extend(true, saved_code, { styling_1: { [blockName]: { [objectUrl]: $('div.block:nth-of-type('+c+')').find('section:nth-of-type('+b+')').children('input.url').val(), [objectUrlType]: $('div.block:nth-of-type('+c+')').find('section:nth-of-type('+b+')').children('select').val() } } });
        }
        var extendedItem;
        browser.storage.local.get().then(function(item) { $.extend(true, item, saved_code); extendedItem = item; });
        browser.storage.local.set(extendedItem).then(onChange, onError);
      }
      browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
    } else { alert('Please enter a name'); return false; }
  });
  $('#beautify').click(function() { alert('beautify all'); ace.require("ace/ext/beautify").beautify(ace.edit($(this).parent().children('div:first-of-type').prop('id')).session); });
  $('#back').click(function() { window.location.replace("manage.html"); });
  $(document).on('click', '.add_block', function() { $(this).parent().clone().find('input').val('').end().find('section:not(:first-of-type)').remove().end().prop('id', '').insertAfter($(this).parent()); updateBlocks(); });
  $(document).on('click', '.remove_block', function() { $(this).parent().remove(); updateBlocks(); });
  $(document).on('click', '.clone_block', function() { $(this).parent().clone().find('select').val($(this).parent().find('select').val()).end().insertAfter($(this).parent()); updateBlocks(); });
  $(document).on('click', '.beautify_block', function() { alert('beautify'); ace.require("ace/ext/beautify").beautify(ace.edit($(this).parent().children('div:first-of-type').prop('id')).session); });
  $(document).on('click', '.add_controls', function() { $(this).parent().clone().find('select').val($(this).parent().find('select').val()).end().find('input.url').val('').end().insertAfter($(this).parent()); });
  $(document).on('click', '.remove_controls', function() { if ($(this).parent().parent().children('.controls').length > 1) { $(this).parent().remove(); } });
  $(document).on('change', 'select', function() { if ($(this).val() == "everything") { $(this).next('input.url').hide(); $(this).parent().addClass('current').parent().children('div.controls:not(.current)').remove(); } else { $(this).next('input.url').show(); } });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "all styles disabled") { $('#enabled').prop('disabled', true); } else if (message.message === "all styles enabled") { $('#enabled').prop('disabled', false); } });











