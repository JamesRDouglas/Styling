var style_id = Number(new URLSearchParams(window.location.search).get('style')), style_index, editors = [];
var errorImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABOFBMVEX/////////QRswFAb/Ui4wFAYwFAYwFAaWGAfDRymzOSH/PxswFAb/SiUwFAYwFAbUPRvjQiDllog5HhHdRybsTi3/Tyv9Tir+Syj/UC3////XurebMBIwFAb/RSHbPx/gUzfdwL3kzMivKBAwFAbbvbnhPx66NhowFAYwFAaZJg8wFAaxKBDZurf/RB6mMxb/SCMwFAYwFAbxQB3+RB4wFAb/Qhy4Oh+4QifbNRcwFAYwFAYwFAb/QRzdNhgwFAYwFAbav7v/Uy7oaE68MBK5LxLewr/r2NXewLswFAaxJw4wFAbkPRy2PyYwFAaxKhLm1tMwFAazPiQwFAaUGAb/QBrfOx3bvrv/VC/maE4wFAbRPBq6MRO8Qynew8Dp2tjfwb0wFAbx6eju5+by6uns4uH9/f36+vr/GkHjAAAAYnRSTlMAGt+64rnWu/bo8eAA4InH3+DwoN7j4eLi4xP99Nfg4+b+/u9B/eDs1MD1mO7+4PHg2MXa347g7vDizMLN4eG+Pv7i5evs/v79yu7S3/DV7/498Yv24eH+4ufQ3Ozu/v7+y13sRqwAAADLSURBVHjaZc/XDsFgGIBhtDrshlitmk2IrbHFqL2pvXf/+78DPokj7+Fz9qpU/9UXJIlhmPaTaQ6QPaz0mm+5gwkgovcV6GZzd5JtCQwgsxoHOvJO15kleRLAnMgHFIESUEPmawB9ngmelTtipwwfASilxOLyiV5UVUyVAfbG0cCPHig+GBkzAENHS0AstVF6bacZIOzgLmxsHbt2OecNgJC83JERmePUYq8ARGkJx6XtFsdddBQgZE2nPR6CICZhawjA4Fb/chv+399kfR+MMMDGOQAAAABJRU5ErkJggg==')";
var warningImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX///8AAAD///8AAAAAAABPSzb/5sAAAAB/blH/73z/ulkAAAAAAAD85pkAAAAAAAACAgP/vGz/rkDerGbGrV7/pkQICAf////e0IsAAAD/oED/qTvhrnUAAAD/yHD/njcAAADuv2r/nz//oTj/p064oGf/zHAAAAA9Nir/tFIAAAD/tlTiuWf/tkIAAACynXEAAAAAAAAtIRW7zBpBAAAAM3RSTlMAABR1m7RXO8Ln31Z36zT+neXe5OzooRDfn+TZ4p3h2hTf4t3k3ucyrN1K5+Xaks52Sfs9CXgrAAAAjklEQVR42o3PbQ+CIBQFYEwboPhSYgoYunIqqLn6/z8uYdH8Vmdnu9vz4WwXgN/xTPRD2+sgOcZjsge/whXZgUaYYvT8QnuJaUrjrHUQreGczuEafQCO/SJTufTbroWsPgsllVhq3wJEk2jUSzX3CUEDJC84707djRc5MTAQxoLgupWRwW6UB5fS++NV8AbOZgnsC7BpEAAAAABJRU5ErkJggg==')";
function onError(error) { console.log(error); }
function malformedData() { $('#content').append('<span>Local Storage data is malformed or incomplete.</span>'); }
function noStylesDetected() { $('#content').append('<span>No styles installed. Go to <a href="/src/manage.html">manage</a> to create one;</span>'); }
function noStyleDetected(style_id) { $('#content').append('<span>No style exists with the id: "'+style_id+'".</span>'); }
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, {action: message }).catch(onError); } }
function aceinit() {
  ace.config.set('loadWorkerFromBlob', false);
  ace.require("ace/ext/keybinding_menu", "ace/ext/language_tools", "ace/ext/searchbox");
  editors = [];
  for (b = 0; b < $('.code').length; b++) {
    editors[b] = ace.edit($('.code')[b]);
    editors[b].setOptions({ maxLines: Infinity, fixedWidthGutter: true, printMargin: false, navigateWithinSoftTabs: true, theme: "ace/theme/crimson_editor", minLines: $('#line-count').val(), maxLines: $('#line-count').val(), tabSize: Number($('#tab-size').val()), fontSize: Number($('#font-size').val()), enableBasicAutocompletion: $('#autocomplete').prop('checked'), enableLiveAutocompletion: $('#autocomplete').prop('checked'), useSoftTabs: $('#soft-tabs').prop('checked'), displayIndentGuides: $('#guide-indent').prop('checked'), showInvisibles: $('#show-invisible').prop('checked'), useWorker: $('#error-marker').prop('checked'), mode: "ace/mode/css" });
    if ($('#keybinding').val() === "default") { var keyboardBindings = ""; } else { var keyboardBindings = "ace/keyboard/"+$('#keybinding').val(); }
    editors[b].setKeyboardHandler(keyboardBindings);
    editors[b].resize();
    editors[b].getSession().on('change', function() { checkForChanges(style_index); });
    editors[b].getSession().on('changeAnnotation', function() { updateErrors(); });
    editors[b].session.$worker.call('setDisabledRules', ["qualified-headings|unique-headings|order-alphabetical|outline-none|important|ids|floats|duplicate-background-images|shorthand|overqualified-elements|unqualified-attributes|universal-selector|bulletproof-font-face|underscore-property-hack|star-property-hack|fallback-colors|vendor-prefix|gradients|box-sizing|adjoining-classes|empty-rules|box-model"]);
    editors[b].session.$worker.call('setInfoRules', ["outline-none|important|floats|font-sizes|shorthand|unqualified-attributes|universal-selector|fallback-colors|vendor-prefix|empty-rules|box-model"]);
  }
  checkForChanges(style_index);
}
function saveOptions(style_id) { browser.storage.local.get().then(function(item) { item.styles[style_id].options = { tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), line_count: $('#line-count').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: { enabled: $('#error-marker').prop('checked'), errors: $('#errors').prop('checked'), warnings: $('#warnings').prop('checked'), notes: $('#notes').prop('checked') }, soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() }; browser.storage.local.set(item).catch(onError); }); aceinit(); }
function renumberBlocks() { for (var a = 1; a <= $('.block').length; a++) { $('.block:nth-of-type('+a+')').prop('id', 'block_'+a).children('span:nth-of-type(2)').text(a); $('.block:nth-of-type('+a+')').find('div.code').prop('id', 'code_'+a); } aceinit(); }
function updateErrors() { $('#errors').empty(); var error_count = 0; for (e = 0; e < editors.length; e++) { $('#errors').append('<div id="errors-'+(e+1)+'" class="code-block-errors unselectable"><div class="code-block-name"><strong>Block '+(e+1)+'</strong></div><div class="error-list"></div></div>'); var annot = editors[e].getSession().getAnnotations(); for (a = 0; a < annot.length; a++) { if (annot[a].type === 'error') { imageData = errorImage; } else if (annot[a].type === 'warning') { imageData = warningImage; } else if (annot[a].type === 'info') { break; } error_count++; if ($('div.code-block-errors#errors-'+(e+1)+' div.error-list div.error[data-type='+annot[a].type+'][data-line='+(annot[a].row+1)+']').length) { $('div.code-block-errors#errors-'+(e+1)+' div.error-list div.error[data-type='+annot[a].type+'][data-line='+(annot[a].row+1)+']').append('<div class="error-description" title="'+annot[a].text+'">'+annot[a].text+'</div>'); } else { $('div.code-block-errors#errors-'+(e+1)+' div.error-list').append('<div class="error" data-type="'+annot[a].type+'" data-line="'+(annot[a].row+1)+'"><div class="error-info" title="Line: '+(annot[a].row+1)+'"><i style="background-image: '+imageData+';"></i> — Line: '+(annot[a].row+1)+'</div><div class="error-description" title="'+annot[a].text+'">'+annot[a].text+'</div></div>'); } } if ($('div.code-block-errors#errors-'+(e+1)+' div.error-list').is(':empty')) { $('div.code-block-errors#errors-'+(e+1)).remove(); } } $('#errors-container > summary').text(error_count+' Detected Error'+((error_count===1)?'':'s')); if ($('#errors').is(':empty')) { $('#errors-container').hide(); } else if ($('#errors-container').css('display')==='none') { $('#errors-container').fadeIn(); } }
function checkForChanges(style) { browser.storage.local.get(function(item) { var currentStyle = []; for (b = 0; b < $('div.block').length; b++) { var code = editors[b].getValue().replace(/^|\s+$/g, ''), urls = $('div.block:nth-of-type('+(b+1)+')').children('section').length; currentStyle.push({ code: code, urls: [] }); for (u = 0; u < urls; u++) { var address = $('div.block:nth-of-type('+(b+1)+')').find('section:nth-of-type('+(u+1)+')').children('input.url').val(), type = $('div.block:nth-of-type('+(b+1)+')').find('section:nth-of-type('+(u+1)+')').children('select').val(); currentStyle[b].urls.push({ address: address, type: type }); } } if (JSON.stringify(item.styles[style].blocks) === JSON.stringify(currentStyle) && item.styles[style].name === $('#style-name').val()) { if ($('#save').hasClass('unsaved')) { $('#save').removeClass('unsaved'); } } else { if (!$('#save').hasClass('unsaved')) { $('#save').addClass('unsaved'); } } }); }
function loadOptions(item) {
  if (item.styles[style_index].options === undefined) { item.styles[style_index].options = default_style.options; browser.storage.local.set(item).catch(onError); }
  $('#style-name').val(item.styles[style_index].name);
  $('#line-count').val(item.styles[style_index].options.line_count);
  $('#tab-size').val(item.styles[style_index].options.tab_size);
  $('#font-size').val(item.styles[style_index].options.font_size);
  $('#enabled').prop('checked', item.styles[style_index].enabled);
  $('#autocomplete').prop('checked', item.styles[style_index].options.autocomplete);
  $('#error-marker').prop('checked', item.styles[style_index].options.error_marker.enabled);
  $('#soft-tabs').prop('checked', item.styles[style_index].options.soft_tabs);
  $('#guide-indent').prop('checked', item.styles[style_index].options.guide_indent);
  $('#show-invisible').prop('checked', item.styles[style_index].options.show_invisible);
  $('#keybinding').val(item.styles[style_index].options.keybinding);
}
function loadContent(item) {
  var blocks = item.styles[style_index].blocks.length;
  for (b = 0; b < blocks; b++) {
    if (blocks > 1 && b > 0) { $('#content > .block:last-of-type > .add_block').click(); }
    if (b === blocks) { $('#content > .block:last-of-type > .lower_block').click(); break; }
    var urls = item.styles[style_index].blocks[b].urls.length;
    for (c = 0; c < urls; c++) {
      if (urls > 1 && c > 0) { $('body div.block:nth-of-type('+(b+1)+') section:last-of-type .add_target').click(); }
      if (item.styles[style_index].blocks[b].urls[c].address) { $('body .block:nth-of-type('+(b+1)+') section:nth-of-type('+(c+1)+') input.url').val(item.styles[style_index].blocks[b].urls[c].address); }
      if (item.styles[style_index].blocks[b].urls[c].type) { $('body .block:nth-of-type('+(b+1)+') section:nth-of-type('+(c+1)+') select').val(item.styles[style_index].blocks[b].urls[c].type); }
      if (item.styles[style_index].blocks[b].urls[c].type === "everything") { $('body .block:nth-of-type('+(b+1)+') section:nth-of-type('+(c+1)+') select').nextAll().hide(); }
    }
    if (item.styles[style_index].blocks[b].code) { ace.edit($('.code')[b]).setValue(item.styles[style_index].blocks[b].code, -1); }
  }
  renumberBlocks();
  editors[0].focus();
}
$(function() {
  browser.storage.local.get().then(function(item) {
    if (style_id === undefined || style_id <= 0) { window.location.href = 'edit.html?style=1'; return false; }
    if (item.default !== undefined && item.styles !== undefined) {
      var default_style = item.default, styles_arr = [];
      for (a = 0; a < item.styles.length; a++) { styles_arr.push(item.styles[a].id); }
      if (styles_arr.length) {
        style_index = styles_arr.indexOf(style_id);
        if (style_index > -1) {
          loadOptions(item);
          loadContent(item);
        } else { noStyleDetected(style_id); }
      } else { noStylesDetected(); }
    } else { malformedData(); }
  });
  //window.onbeforeunload = function() { if ($('#save').hasClass('unsaved')) { return 'Are you sure you want to navigate away from this page?'; } };
  $('#save').click(function() { if ($('#style-name').val()) { browser.storage.local.get().then(function(item) { item.styles[style_index].name = $('#style-name').val(); item.styles[style_index].blocks = []; for (c = 0; c < $('div.block').length; c++) { var urls = $('div.block:nth-of-type('+(c+1)+')').children('section').length, code = editors[c].getValue().replace(/^|\s+$/g, ''); item.styles[style_index].blocks.push({ code: code, urls: [] }); for (b = 0; b < urls; b++) { var address = $('div.block:nth-of-type('+(c+1)+')').find('section:nth-of-type('+(b+1)+')').children('input.url').val(), type = $('div.block:nth-of-type('+(c+1)+')').find('section:nth-of-type('+(b+1)+')').children('select').val(); item.styles[style_index].blocks[c].urls.push({ address: address, type: type }); } } browser.storage.local.set(item).then(function() { $('.unsaved').removeClass('unsaved'); }, onError); }); browser.tabs.query({}).then(function(tabs) { sendMessageToTabs(tabs, 'update'); }).catch(onError); } else { alert('Please enter a name for this style'); return false; } });
  $('#enabled').click(function() { browser.storage.local.get(function(item) { item.styles[style_index].enabled = $('#enabled').is(':checked'); browser.storage.local.set(item).catch(onError); browser.tabs.query({}).then(function(tabs) { sendMessageToTabs(tabs,"update"); }).catch(onError); }); });
  $('#beautify').click(function() { for (e = 0; e < editors.length; e++) { editors[e].setValue(css_beautify(editors[e].getValue(), { 'indent_size': 2, 'selector_separator_newline': false, 'space_around_selector_separator': true })); } });
  $('#back').click(function() { window.location.replace("manage.html"); });
  $('#text').click(function() { if ($('#hidden').hasClass('hidden')) { $('#hidden').removeClass('hidden'); $('#error-marker-container').addClass('opened'); } else { $('#hidden').addClass('hidden'); $('#error-marker-container').removeClass('opened'); } });
  $(document).on('change paste keyup', '#style-name, .url, select:not(.options)', function() { checkForChanges(style_index); });
  $(document).on('click', '.add_block', function() { $(this).parent().clone().find('input').val('').end().find('section:not(:first-of-type)').remove().end().find('.code').empty().end().prop('id', '').insertAfter($(this).parent()); renumberBlocks(); });
  $(document).on('click', '.remove_block', function() { $(this).parent().remove(); renumberBlocks(); });
  $(document).on('click', '.raise_block', function() { if ($(this).parent().prev()) { $(this).parent().insertBefore($(this).parent().prev()); } renumberBlocks(); });
  $(document).on('click', '.lower_block', function() { if ($(this).parent().next()) { $(this).parent().insertAfter($(this).parent().next()); } renumberBlocks(); });
  $(document).on('click', '.clone_block', function() { $(this).parent().find('.add_block').click(); $(this).parent().next().find('section').remove(); $(this).parent().clone().find('section').insertAfter($(this).parent().next().find('.code')); let blockIndex = $('.block').index($(this).closest('.block')); renumberBlocks(); editors[(blockIndex+1)].setValue(editors[blockIndex].getValue(), -1); });
  $(document).on('click', '.beautify_block', function() { let blockIndex = $('.block').index($(this).closest('.block')); editors[blockIndex].setValue(css_beautify(editors[blockIndex].getValue(), { 'indent_size': 2, 'selector_separator_newline': false, 'space_around_selector_separator': false })); checkForChanges(style_index); });
  $(document).on('click', '.add_target', function() { $(this).parent().clone().find('select').val($(this).parent().find('select').val()).end().find('input.url').val('').end().insertAfter($(this).parent()); checkForChanges(style_index); });
  $(document).on('click', '.remove_target', function() { if ($(this).parent().parent().children('.target').length > 1) { $(this).parent().remove(); } checkForChanges(style_index); });
  $(document).on('change', 'select', function() { if ($(this).val() == "everything") { $(this).nextAll().hide(); $(this).parent().addClass('current').parent().children('div.target:not(.current)').remove(); } else { $(this).nextAll().show(); } });
  $(document).on('change', '.options', function() { saveOptions(style_index); if (item.styles[style_index].options.error_marker.enabled) { updateErrors(); $('#errors-container').fadeIn(); } else { $('#errors-container').hide(); $('#errors').empty(); } });
  browser.runtime.onMessage.addListener(function(message) { if (message.action === "disable") { $('#favicon').attr('href','/images/StylingDisabled.png'); } else if (message.action === "enable") { $('#favicon').attr('href','/images/Styling.png'); } });
  browser.runtime.onMessage.addListener(function(message) { if (message.action === "update") { browser.storage.local.get().then(function(item) { $('#enabled').prop('checked', item.styles[style_index].enabled); }); } });
});
