function onChange(item) {}
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, { message: "update scripts" }).then(response => {}).catch(onError); } }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function updateTextarea(textarea) {
  var lines = textarea.value.split(/\r*\n/).length;
  if (lines != textarea.prev('.side *').length) {
    textarea.prev('.side').empty();
    for (a = 1; a <= lines; a++) { textarea.prev('.side').append('<span class="line">'+a+'</span>'); }
  }
  textarea.prev('.side').css('height', $('textarea').css('height'));
}
$(function() {
  browser.storage.local.get().then(function(item) { 
    if (item.styling_1) {
      var urls = (objectLength(item.styling_1.block_1) - 1) / 2;
      for (a = 1; a <= urls; a++) { 
        if (eval('item.styling_1.block_1.url_' + urls)) { $('div.controls:nth-of-type(' + urls + ') input.url').val(eval('item.styling_1.block_1.url_' + urls)); }
        if (eval('item.styling_1.block_1.url_' + urls + '_type')) { $('div.controls:nth-of-type(' + urls + ') select').val(eval('item.styling_1.block_1.url_' + urls + '_type')); }
        if (eval('item.styling_1.block_1.url_' + urls + '_type') == 'everything') { $('div.controls:nth-of-type(' + urls + ') input.url').hide(); }
      }
      if (item.styling_1.block_1.code) { $('textarea.code').text(item.styling_1.block_1.code); }
    }
  });
  updateTextarea();
  $('#save').click(function() {
    browser.storage.local.set({ styling_1: { block_1: { code: $('textarea.code').val().replace(/^|\s+$/g, ''), url_1: $('input.url').val(), url_1_type: $('select').val() } } }).then(onChange, onError); 
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  });
  $('textarea').on('scroll', function () { $('.side').scrollTop($(this).scrollTop()); });
  $('#back').click(function() { window.location.replace("manage.html"); });
  $('select').change(function() { if ($(this).val() == "everything") { $(this).next('input.url').hide(); $(this).parent().addClass('current').parent().children('div.controls:not(.current)').remove(); } else { $(this).next('input.url').show(); } });
  $('textarea').bind('input propertychange', function() { updateTextarea($(this)); });
  $('textarea').resize(function() { $(this).prev('.side').css('height', $('textarea').css('height')); });
  $(document).on('click', '.add', function() { $(this).parent().clone().children('select').val('url').parent().find('input').val('').end().insertAfter($(this).parent()); });
  $(document).on('click', '.remove', function() { if ($(this).parent().parent().children('.controls').length > 1) { $(this).parent().remove(); } });
});