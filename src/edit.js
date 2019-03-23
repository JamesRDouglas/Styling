function onChange(item) {}
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(tab.id, { message: "update scripts" }).then(response => {}).catch(onError);
  }
}
function numOfLines(textArea, lineHeight) {
  var currentHeight = textArea.css('height'), currentPadding = textArea.css('padding');
  textArea.css({ 'height': 'auto', 'padding': '0' });
  var scrollHeight = textArea[0].scrollHeight;
  textArea.css({ 'height': currentHeight, 'padding': currentPadding });
  return Math.ceil(scrollHeight / lineHeight);
}
function updateTextarea() {
  var lines = numOfLines($('textarea.code'), document.querySelector("textarea").style.lineHeight.slice(0, 2));
  if (lines < 15) { lines = 15; }
  if (document.querySelector("textarea").value.split(/\r*\n/).length < 15) {
    var toBeAdded = 15 - document.querySelector("textarea").value.split(/\r*\n/).length;
    for (a = 1; a <= toBeAdded; a++) { var currentText = $('textarea').val(); $('textarea').val(currentText + '\n'); }
  }
  if (lines != $('.side *').length) {
    $('.side').empty();
    for (a = 1; a <= lines; a++) { $('.side').append('<span class="line">'+a+'</span>'); }
  }
  $('.side').css('height', $('textarea').css('height'));
}
$(function() {
  browser.storage.local.get().then(function(item) { 
    if (item.styling_1) {
      if (item.styling_1.block_1.url_1) { $('input.url').val(item.styling_1.block_1.url_1); }
      if (item.styling_1.block_1.url_1_type) { $('option[value='+item.styling_1.block_1.url_1_type+']').prop('selected', 'true'); }
      if (item.styling_1.block_1.url_1_type == 'everything') { $('input.url').hide(); }
      if (item.styling_1.block_1.code_1) { $('textarea.code').text(item.styling_1.block_1.code_1); }
    }
  });
  updateTextarea();
  $('#save').click(function() {
    browser.storage.local.set({ styling_1: { block_1: { url_1: $('input.url').val(), url_1_type: $('select').val(), code_1: $('textarea.code').val() } } }).then(onChange, onError); 
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  });
  $('textarea').on('scroll', function () {
    $('.side').scrollTop($(this).scrollTop());
  });
  $('#back').click(function() { window.location.replace("manage.html"); });
  $('select').change(function() { if ($(this).val() == "everything") { $('input.url').hide(); } else { $('input.url').show(); } });
  $('textarea').bind('input propertychange', function() { updateTextarea(); });
  $('.controls').on('click', '.add', function() { $(this).parent().clone().children('select').val('url').parent().find('input').val('').end().insertAfter($(this).parent()); });
  $('.controls').on('click', '.remove', function() { if ($(this).parent().parent().children('.controls').length > 1) { $(this).parent().remove(); } });
});