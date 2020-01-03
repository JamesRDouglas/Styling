function onError(error) { console.log(error); }
function malformedData() { $('#content').append('<span>Local Storage data is malformed or incomplete.</span>'); }
function noStylesDetected() { $('#content').append('<span>No styles installed. Go to <a href="/src/manage.html">manage</a> to create one;</span>'); }
function noStyleDetected(style_id) { $('#content').append('<span>No style exists with the id: "'+style_id+'".</span>'); }
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {action: message }).catch(onError); } }
function updateBlocks(loadErrorSide) { if (loadErrorSide === undefined) { loadErrorSide = true; } for (var a = 1; a <= $('.block').length; a++) { $('.block:nth-of-type('+a+')').prop('id', 'block_'+a).children('span:nth-of-type(2)').text(a); $('.block:nth-of-type('+a+')').find('div.code').prop('id', 'code_'+a); } $('div.code').each(function(){ aceinit.call(this); }); if (loadErrorSide) { updateErrors(); } }
function updateErrors() { $('#errors').empty(); for (num_a = 0; num_a < $('.code').length; num_a++) { var editor = ace.edit($('.code')[num_a]); if (editor.session.$worker !== null) { editor.session.$worker.call('setDisabledRules', ["qualified-headings|unique-headings|order-alphabetical|outline-none|important|ids|floats|duplicate-background-images|shorthand|overqualified-elements|unqualified-attributes|universal-selector|bulletproof-font-face|underscore-property-hack|star-property-hack|fallback-colors|vendor-prefix|gradients|box-sizing|adjoining-classes|empty-rules|box-model"]); editor.session.$worker.call('setInfoRules', ["outline-none|important|floats|font-sizes|shorthand|unqualified-attributes|universal-selector|fallback-colors|vendor-prefix|empty-rules|box-model"]); } $('#errors').append('<div class="block-container unselectable"><span>Block '+(num_a+1)+'</span><div class="error-container"></div></div>'); } $('div.block-container').find('small').remove(); for (num_2 = 0; num_2 < $('.code').length; num_2++) { var editor = ace.edit('code_'+(num_2+1)); var annot = editor.getSession().getAnnotations(); for (num_3 = 0; num_3 < annot.length; num_3++) { if (annot[num_3].type === 'error') { imageData = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABOFBMVEX/////////QRswFAb/Ui4wFAYwFAYwFAaWGAfDRymzOSH/PxswFAb/SiUwFAYwFAbUPRvjQiDllog5HhHdRybsTi3/Tyv9Tir+Syj/UC3////XurebMBIwFAb/RSHbPx/gUzfdwL3kzMivKBAwFAbbvbnhPx66NhowFAYwFAaZJg8wFAaxKBDZurf/RB6mMxb/SCMwFAYwFAbxQB3+RB4wFAb/Qhy4Oh+4QifbNRcwFAYwFAYwFAb/QRzdNhgwFAYwFAbav7v/Uy7oaE68MBK5LxLewr/r2NXewLswFAaxJw4wFAbkPRy2PyYwFAaxKhLm1tMwFAazPiQwFAaUGAb/QBrfOx3bvrv/VC/maE4wFAbRPBq6MRO8Qynew8Dp2tjfwb0wFAbx6eju5+by6uns4uH9/f36+vr/GkHjAAAAYnRSTlMAGt+64rnWu/bo8eAA4InH3+DwoN7j4eLi4xP99Nfg4+b+/u9B/eDs1MD1mO7+4PHg2MXa347g7vDizMLN4eG+Pv7i5evs/v79yu7S3/DV7/498Yv24eH+4ufQ3Ozu/v7+y13sRqwAAADLSURBVHjaZc/XDsFgGIBhtDrshlitmk2IrbHFqL2pvXf/+78DPokj7+Fz9qpU/9UXJIlhmPaTaQ6QPaz0mm+5gwkgovcV6GZzd5JtCQwgsxoHOvJO15kleRLAnMgHFIESUEPmawB9ngmelTtipwwfASilxOLyiV5UVUyVAfbG0cCPHig+GBkzAENHS0AstVF6bacZIOzgLmxsHbt2OecNgJC83JERmePUYq8ARGkJx6XtFsdddBQgZE2nPR6CICZhawjA4Fb/chv+399kfR+MMMDGOQAAAABJRU5ErkJggg==")'; } else if (annot[num_3].type === 'warning') { imageData = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX///8AAAD///8AAAAAAABPSzb/5sAAAAB/blH/73z/ulkAAAAAAAD85pkAAAAAAAACAgP/vGz/rkDerGbGrV7/pkQICAf////e0IsAAAD/oED/qTvhrnUAAAD/yHD/njcAAADuv2r/nz//oTj/p064oGf/zHAAAAA9Nir/tFIAAAD/tlTiuWf/tkIAAACynXEAAAAAAAAtIRW7zBpBAAAAM3RSTlMAABR1m7RXO8Ln31Z36zT+neXe5OzooRDfn+TZ4p3h2hTf4t3k3ucyrN1K5+Xaks52Sfs9CXgrAAAAjklEQVR42o3PbQ+CIBQFYEwboPhSYgoYunIqqLn6/z8uYdH8Vmdnu9vz4WwXgN/xTPRD2+sgOcZjsge/whXZgUaYYvT8QnuJaUrjrHUQreGczuEafQCO/SJTufTbroWsPgsllVhq3wJEk2jUSzX3CUEDJC84707djRc5MTAQxoLgupWRwW6UB5fS++NV8AbOZgnsC7BpEAAAAABJRU5ErkJggg==")'; } else if (annot[num_3].type === 'info') { break; } $('div.block-container:nth-of-type('+(num_2+1)+') div.error-container').append("<small><i style='background-image: "+imageData+";'></i> — Line: "+(annot[num_3].row+1)+", Col:  "+(annot[num_3].column+1)+"<br><span>"+annot[num_3].text+"</span></small>"); } if ($('div.block-container:nth-of-type('+(num_2+1)+') div.error-container > small').length) { $('div.block-container:nth-of-type('+(num_2+1)+')').css('display', 'block'); } else { $('div.block-container:nth-of-type('+(num_2+1)+')').remove(); } } if ($('#errors').is(':empty')) { $('#errors-container details').removeAttr('open'); $('#errors').append('<i>No errors detected</i>'); } else { $('#errors-container details').attr('open',''); } }
function saveOptions(style_id) { browser.storage.local.get().then(function(item) { item.styles[style_id].options = { tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), line_count: $('#line-count').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: { enabled: $('#error-marker').prop('checked'), errors: $('#errors').prop('checked'), warnings: $('#warnings').prop('checked'), notes: $('#notes').prop('checked') }, soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() }; browser.storage.local.set(item).catch(onError); }); $('div.code').each(function() { aceinit.call(this); }); }
function checkForChanges(style) {
  browser.storage.local.get(function(item) {
    currentItem = item;
    currentItem.styles[style].name = $('#style-name').val();
    currentItem.styles[style].disabled = $('#enabled').prop('disabled');
    currentItem.styles[style].blocks = [];
    for (b = 0; b < $('div.block').length; b++) {
      var urls = $('div.block:nth-of-type('+(b+1)+')').children('section').length, code = ace.edit("code_"+(b+1)).getValue().replace(/^|\s+$/g, '');
      currentItem.styles[style].blocks.push({ code: code, urls: [] });
      for (u = 0; u < urls; u++) {
        var address = $('div.block:nth-of-type('+(b+1)+')').find('section:nth-of-type('+(u+1)+')').children('input.url').val(), type = $('div.block:nth-of-type('+(b+1)+')').find('section:nth-of-type('+(u+1)+')').children('select').val();
        currentItem.styles[style].blocks[b].urls.push({ address: address, type: type });
      }
    }
    if (item.styles[style].blocks === currentItem.styles[style].blocks) { if ($('#save').hasClass('unsaved')) { $('#save').removeClass('unsaved'); } } else { if (!$('#save').hasClass('unsaved')) { $('#save').addClass('unsaved'); } }
  });
}
function aceinit() { ace.config.set('loadWorkerFromBlob', false); var editor = ace.edit(this); ace.require("ace/ext/keybinding_menu", "ace/ext/language_tools", "ace/ext/searchbox"); editor.setOptions({ maxLines: Infinity, fixedWidthGutter: true, printMargin: false, navigateWithinSoftTabs: true, theme: "ace/theme/crimson_editor", minLines: $('#line-count').val(), maxLines: $('#line-count').val(), tabSize: Number($('#tab-size').val()), fontSize: Number($('#font-size').val()), enableBasicAutocompletion: $('#autocomplete').prop('checked'), enableLiveAutocompletion: $('#autocomplete').prop('checked'), useSoftTabs: $('#soft-tabs').prop('checked'), displayIndentGuides: $('#guide-indent').prop('checked'), showInvisibles: $('#show-invisible').prop('checked'), useWorker: $('#error-marker').prop('checked'), mode: "ace/mode/css" }); if ($('#keybinding').val() === "default") { var keyboardBindings = ""; } else { var keyboardBindings = "ace/keyboard/"+$('#keybinding').val(); } editor.setKeyboardHandler(keyboardBindings); editor.resize(); editor.getSession().on('changeAnnotation', function() { updateErrors(); }); return editor; }
$(function() {
  var style_id, style_index;
  browser.storage.local.get().then(function(item) {
    if (item.default !== undefined && item.styles !== undefined) {
      style_id = Number(new URLSearchParams(window.location.search).get('style'));
      var default_style = item.default, styles_arr = [];
      if (style_id === undefined || style_id <= 0) { window.location.href = 'edit.html?style=1'; }
      for (a = 0; a < item.styles.length; a++) { styles_arr.push(item.styles[a].id); }
      if (styles_arr.length) {
        style_index = styles_arr.indexOf(style_id);
        if (style_index !== undefined) {
          if (item.styles[style_index].options === undefined) { item.styles[style_index].options = default_style.options; browser.storage.local.set(item).catch(onError); }
          $('#style-name').val(item.styles[style_index].name);
          $('#line-count').val(item.styles[style_index].options.line_count);
          $('#tab-size').val(item.styles[style_index].options.tab_size);
          $('#font-size').val(item.styles[style_index].options.font_size);
          if (item.styles[style_index].disabled === true) { $('#enabled').prop('checked', false); } else { $('#enabled').prop('checked', true); }
          if (item.styles[style_index].options.autocomplete === true) { $('#autocomplete').prop('checked', true); }
          if (item.styles[style_index].options.error_marker.enabled === true) { $('#error-marker').prop('checked', true); }
          if (item.styles[style_index].options.soft_tabs === true) { $('#soft-tabs').prop("checked", true); }
          if (item.styles[style_index].options.guide_indent === true) { $('#guide-indent').prop("checked", true); }
          if (item.styles[style_index].options.show_invisible === true) { $('#show-invisible').prop("checked", true); }
          $('#keybinding').val(item.styles[style_index].options.keybinding);
          var blocks = item.styles[style_index].blocks.length;
          for (b = 0; b < blocks; b++) {
            if (blocks > 1 && b > 0) { $('#content > .block:last-of-type > .add_block').click(); }
            if (b === blocks) { $('#content > .block:last-of-type > .lower_block').click(); break; }
            var urls = item.styles[style_index].blocks[b].urls.length;
            for (c = 0; c < urls; c++) {
              if (urls > 1 && c > 0) { $('body div.block:nth-of-type('+(b+1)+') section:last-of-type .add_target').click(); }
              if (item.styles[style_index].blocks[b].urls[c].address) { $('body .block:nth-of-type('+(b+1)+') section:nth-of-type('+(c+1)+') input.url').val(item.styles[style_index].blocks[b].urls[c].address); }
              if (item.styles[style_index].blocks[b].urls[c].type) { $('body .block:nth-of-type('+(b+1)+') section:nth-of-type('+(c+1)+') select').val(item.styles[style_index].blocks[b].urls[c].type); }
              if (item.styles[style_index].blocks[b].urls[c].type === "everything") { $('body .block:nth-of-type('+(b+1)+') section:nth-of-type('+(c+1)+') input.url').hide(); }
            }
            if (item.styles[style_index].blocks[b].code) { ace.edit("code_"+(b+1)).setValue(item.styles[style_index].blocks[b].code, -1); updateBlocks(false); }
          }
          updateBlocks(false);
          $('#options-container, #errors-container, #content > .block').fadeIn();
          var editors = [];
          for (b = 0; b < $('.code').length; b++) {
            editors[b] = ace.edit($('.code')[b]);
            editors[b].getSession().on('change', function() { checkForChanges(style_index); });
            if (b === 0) { editors[b].focus(); }
          }
          $(document).on('change paste keyup', '.url, select:not(.options)', function() { if (!$('#save').hasClass('unsaved')) { $('#save').addClass('unsaved'); } });
          $(document).on('click', '.add_block, .remove_block, .raise_block, .lower_block, .clone_block, .beautify_block, .add_target, .remove_target', function() { if (!$('#save').hasClass('unsaved')) { $('#save').addClass('unsaved'); } });
        } else { noStyleDetected(style_id); }
      } else { noStylesDetected(); }
    } else { malformedData(); }
  });
  updateBlocks(false);
  window.onbeforeunload = function() { if ($('#save').hasClass('unsaved')) { return 'Are you sure you want to navigate away from this page?'; } };
  $('#save').click(function() {
    if ($('#style-name').val()) {
      browser.storage.local.get().then(function(item) {
        item.styles[style_index].name = $('#style-name').val();
        item.styles[style_index].disabled = $('#enabled').prop('disabled');
        item.styles[style_index].blocks = [];
        for (c = 0; c < $('div.block').length; c++) {
          var urls = $('div.block:nth-of-type('+(c+1)+')').children('section').length, code = ace.edit("code_"+(c+1)).getValue().replace(/^|\s+$/g, '');
          item.styles[style_index].blocks.push({ code: code, urls: [] });
          for (b = 0; b < urls; b++) {
            var address = $('div.block:nth-of-type('+(c+1)+')').find('section:nth-of-type('+(b+1)+')').children('input.url').val(), type = $('div.block:nth-of-type('+(c+1)+')').find('section:nth-of-type('+(b+1)+')').children('select').val();
            item.styles[style_index].blocks[c].urls.push({ address: address, type: type });
          }
        }
        browser.storage.local.set(item).then(function() {
          $('.unsaved').removeClass('unsaved');
        }, onError);
      });
      browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError);
    } else {
      alert('Please enter a name'); return false;
    }
  });
  $('#enabled').click(function() { browser.storage.local.get(function(item) { if ($('#enabled').is(':checked')) { item.styles[style_index].disabled = false; browser.storage.local.set(item).catch(onError); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); } else { item.styles[style_index].disabled = true; browser.storage.local.set(item).catch(onError); browser.tabs.query({ currentWindow: true }).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); } }); });
  $('#beautify').click(function() { $('div.code').each(function(){ ace.edit(this).setValue(css_beautify(ace.edit(this).getValue(), { 'indent_size': 2, 'selector_separator_newline': false, 'space_around_selector_separator': true })); }); });
  $('#back').click(function() { window.location.replace("manage.html"); });
  $('#text').click(function() { if ($('#hidden').hasClass('hidden')) { $('#hidden').removeClass('hidden'); $('#error-marker-container').addClass('opened'); } else { $('#hidden').addClass('hidden'); $('#error-marker-container').removeClass('opened'); } });
  $(document).on('click', '.add_block', function() { $(this).parent().clone().find('input').val('').end().find('section:not(:first-of-type)').remove().end().find('.code').empty().end().prop('id', '').insertAfter($(this).parent()); updateBlocks(); });
  $(document).on('click', '.remove_block', function() { $(this).parent().remove(); updateBlocks(); });
  $(document).on('click', '.raise_block', function() { if ($(this).parent().prev()) { $(this).parent().insertBefore($(this).parent().prev()); } updateBlocks(); });
  $(document).on('click', '.lower_block', function() { if ($(this).parent().next()) { $(this).parent().insertAfter($(this).parent().next()); } updateBlocks(); });
  $(document).on('click', '.clone_block', function() { $(this).parent().find('.add_block').click(); $(this).parent().next().find('section').remove(); $(this).parent().clone().find('section').insertAfter($(this).parent().next().find('.code')); ace.edit($(this).parent().next().find('.code')[0].id).setValue(ace.edit($(this).parent().find('.code')[0].id).getValue(), -1); updateBlocks(); });
  $(document).on('click', '.beautify_block', function() { ace.edit($(this).parent().find('div.code')[0]).setValue(css_beautify(ace.edit($(this).parent().find('div.code')[0]).getValue(), { 'indent_size': 2, 'selector_separator_newline': false, 'space_around_selector_separator': true })); });
  $(document).on('click', '.add_target', function() { $(this).parent().clone().find('select').val($(this).parent().find('select').val()).end().find('input.url').val('').end().insertAfter($(this).parent()); });
  $(document).on('click', '.remove_target', function() { if ($(this).parent().parent().children('.target').length > 1) { $(this).parent().remove(); } });
  $(document).on('change', 'select', function() { if ($(this).val() == "everything") { $(this).next('input.url').hide(); $(this).parent().addClass('current').parent().children('div.target:not(.current)').remove(); } else { $(this).next('input.url').show(); } });
  $(document).on('change', '.options', function() { saveOptions(style_index); updateErrors(); });
});
browser.runtime.onMessage.addListener(function(message) { if (message.action === "disable") { $('#favicon').attr('href','/images/StylingDisabled.ico'); } else if (message.message === "enable") { $('#favicon').attr('href','/images/Styling.ico'); } });
browser.runtime.onMessage.addListener(function(message) { if (message.action === "update") {
  browser.storage.local.get().then(function(item) {
    if (item.styles[style_id].disabled === true) {
      $('#enabled').prop('checked', false);
    } else {
      $('#enabled').prop('checked', true);
    }
  });
 }
});
