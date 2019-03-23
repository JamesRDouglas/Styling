function onChange(item) {}
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, { message: "update scripts" }).then(response => {}).catch(onError); } }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function updateTextarea() {
  $('textarea').each(function() {
    if ($(this).val().split(/\r*\n/).length != $(this).prev('.side *').length) {
      $(this).prev('div.side').empty();
      for (a = 1; a <= $(this).val().split(/\r*\n/).length; a++) { $(this).prev('div.side').append('<span class="line">'+a+'</span>'); }
    }
  });
}
$(function() {
  browser.storage.local.get().then(function(item) { 
    if (item.styling_1) {
      var urls = (objectLength(item.styling_1.block_1) - 1) / 2;
      for (var a = 1; a <= urls; a++) { 
        if (urls > 1 && a > 1) { $('body section:first-of-type .add').click(); }
        if (item.styling_1.block_1["url_" + a]) { $('section.controls:nth-of-type(' + a + ') input.url').val(item.styling_1.block_1["url_" + a]); }
        if (item.styling_1.block_1["url_" + a + "_type"]) { $('section.controls:nth-of-type(' + a + ') select').val(item.styling_1.block_1["url_" + a + "_type"]); }
        if (item.styling_1.block_1["url_" + a + "_type"] == 'everything') { $('section.controls:nth-of-type(' + a + ') input.url').hide(); }
      }
      if (item.styling_1.block_1.code) { $('textarea.code').text(item.styling_1.block_1.code); }
    }
  });
  updateTextarea();
  $('#save').click(function() {
    var saved_code = { styling_1: { block_1: { code: $('body block_1 textarea.code').val().replace(/^|\s+$/g, '') } } }; 
    var urls = $('body block_1 section').length;
    for (var b = 1; b <= urls; b++) { 
      var objectUrl = 'url_' + b;
      var objectUrlType = objectUrl + '_type';
      $.extend(true, saved_code, { styling_1: { block_1: { [objectUrl]: $('body block_1 section:nth-of-type('+b+') input.url').val(), [objectUrlType]: $('body block_1 section:nth-of-type('+b+') select').val() } } });
    }
    browser.storage.local.set(saved_code).then(onChange, onError);
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  });
  $('textarea').on('scroll', function () { $('.side').scrollTop($(this).scrollTop()); });
  $('#back').click(function() { window.location.replace("manage.html"); });
  $('select').change(function() { if ($(this).val() == "everything") { $(this).next('input.url').hide(); $(this).parent().addClass('current').parent().children('div.controls:not(.current)').remove(); } else { $(this).next('input.url').show(); } });
  $('textarea').bind('input propertychange', function() { updateTextarea($(this)); });
  $('textarea').resize(function() { $(this).parent('div.container').css('height', $(this).height()); });
  $(document).on('click', '.add', function() { $(this).parent().clone().find('input').val('').end().insertAfter($(this).parent()); });
  $(document).on('click', '.remove', function() { if ($(this).parent().parent().children('.controls').length > 1) { $(this).parent().remove(); } });
});