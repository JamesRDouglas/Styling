function onChange(item) {}
function onError(error) { console.log(`Error: ${error}`); }
function sendMessageToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, { message: "styles updated" }).then(response => {}).catch(onError); } }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function updateTextarea() {
  for (var a = 1; a <= $('.block').length; a++) { $('.block:nth-of-type('+a+')').prop('id', 'block_'+a).children('span:nth-of-type(2)').text(a); }
  $('textarea').each(function() {
    if ($(this).val().split(/\r*\n/).length != $(this).prev('.side *').length) {
      $(this).prev('div.side').empty();
      for (var b = 1; b <= $(this).val().split(/\r*\n/).length; b++) { $(this).prev('div.side').append('<span class="line">'+b+'</span>'); }
    }
  });
}
$(function() {
  browser.storage.local.get().then(function(item) { 
    if (item.styling_1) {
      var urls = (objectLength(item.styling_1.block_1) - 1) / 2;
      for (var a = 1; a <= urls; a++) { 
        if (urls > 1 && a > 1) { $('body section:first-of-type .add').click(); }
        if (item.styling_1.block_1["url_"+a]) { $('section.controls:nth-of-type('+a+') input.url').val(item.styling_1.block_1["url_"+a]); }
        if (item.styling_1.block_1["url_"+a+"_type"]) { $('section.controls:nth-of-type('+a+') select').val(item.styling_1.block_1["url_"+a+"_type"]); }
        if (item.styling_1.block_1["url_"+a+"_type"] == 'everything') { $('section.controls:nth-of-type('+a+') input.url').hide(); }
      }
      if (item.styling_1.block_1.code) { $('textarea.code').text(item.styling_1.block_1.code); updateTextarea(); }
      if (item.disabled === "true") { $('#enabled').prop('disabled', true); } else { $('#enabled').prop('disabled', false); }
    }
    $('#enabled').click(function() { var code = item; if ($('#enabled').is(':checked')) { 
      $.extend(true, code, { styling_1: { disabled: "false" } });
    } else { 
      $.extend(true, code, { styling_1: { disabled: "true" } }); 
    } });
  });
  updateTextarea();
  $('#save').click(function() {
    $('textarea.code').each(function() {
      var saved_code = { styling_1: { block_1: { code: $(this).val().replace(/^|\s+$/g, '') } } }; 
      var urls = $(this).parent().parent().children('section').length;
      for (var b = 1; b <= urls; b++) { 
        var objectUrl = 'url_'+b;
        var objectUrlType = objectUrl+'_type';
        $.extend(true, saved_code, { styling_1: { block_1: { [objectUrl]: $(this).parent().parent().children('section:nth-of-type('+b+')').children('input.url').val(), [objectUrlType]: $(this).parent().parent().children('section:nth-of-type('+b+')').children('select').val() } } });
      }
      browser.storage.local.set(saved_code).then(onChange, onError);
    });
    browser.tabs.query({ currentWindow: true }).then(sendMessageToTabs).catch(onError);
  });
  $('#back').click(function() { window.location.replace("manage.html"); });
  $(document).on('change', 'select', function() { if ($(this).val() == "everything") { $(this).next('input.url').hide(); $(this).parent().addClass('current').parent().children('div.controls:not(.current)').remove(); } else { $(this).next('input.url').show(); } });
  $(document).on('keydown', 'textarea', function() { updateTextarea(); });
  $(document).on('scroll', 'textarea', function () { $('.side').scrollTop($(this).scrollTop()); });
  $(document).on('resize', 'textarea', function() { $(this).parent('div.container').css('height', $(this).height()); });
  $(document).on('click', '.add_controls', function() { $(this).parent().clone().find('select').val($(this).parent().find('select').val()).end().find('input.url').val('').end().insertAfter($(this).parent()); });
  $(document).on('click', '.remove_controls', function() { if ($(this).parent().parent().children('.controls').length > 1) { $(this).parent().remove(); } });
  $(document).on('click', '.add_block', function() { $(this).parent().clone().find('textarea.code').val('').end().find('input').val('').end().prop('id', '').insertAfter($(this).parent()); updateTextarea(); });
  $(document).on('click', '.add_block', function() { $(this).parent().remove(); updateTextarea(); });
  $(document).on('click', '.clone_block', function() { $(this).parent().clone().find('select').val($(this).parent().find('select').val()).end().insertAfter($(this).parent()); updateTextarea(); });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "all styles disabled") { $('#enabled').prop('disabled', true); } else if (message.message === "all styles enabled") { $('#enabled').prop('disabled', false); } });












