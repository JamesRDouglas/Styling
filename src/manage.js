function onDone(item) { }
function onError(error) { console.log(error); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { if (message === "disable") { browser.tabs.sendMessage(tab.id, {message: "styles disabled"}).then(response => {  }).catch(onError); } else if (message === "enable") { browser.tabs.sendMessage(tab.id, {message: "styles enabled"}).then(response => {  }).catch(onError); } else if (message === "update") { browser.tabs.sendMessage(tab.id, {message: "styles updated"}).then(response => {  }).catch(onError); } } }
function checkStyleExists(b, item) { if (item.styles[b]) { $('#content').append('<div class="style" id="style_'+b+'" data-id="'+b+'"><input type="checkbox"><span class="name" title="'+item.styles[b].name+'">'+item.styles[b].name+'</span><button class="edit" data-id="'+b+'">Edit</button><button class="delete" data-id="'+b+'">Delete</button><div class="url_list"></div></div>'); } else { b++; checkStyleExists(b, item); } b++; return b; }
function saveOptions() { 
  browser.storage.local.get().then(function(item) { 
    item.default.options = { tab_size: $('#tab-size').val(), font_size: $('#font-size').val(), line_count: $('#line-count').val(), autocomplete: $('#autocomplete').prop('checked'), error_marker: $('#error-marker').prop('checked'), soft_tabs: $('#soft-tabs').prop('checked'), guide_indent: $('#guide-indent').prop('checked'), show_invisible: $('#show-invisible').prop('checked'), keybinding: $('#keybinding').val() }; 
    browser.storage.local.set(item).then(onDone, onError); 
  }); 
}
$(function() {
  var styles_arr;
  browser.storage.local.get().then(function(item) { 
    $('#line-count').val(item.default.options.line_count);
    $('#tab-size').val(item.default.options.tab_size);
    $('#font-size').val(item.default.options.font_size);
    if (item.default.options.autocomplete === true) { $('#autocomplete').prop("checked", true); }
    if (item.default.options.error_marker === true) { $('#error-marker').prop("checked", true); }
    if (item.default.options.soft_tabs === true) { $('#soft-tabs').prop("checked", true); }
    if (item.default.options.guide_indent === true) { $('#guide-indent').prop("checked", true); }
    if (item.default.options.show_invisible === true) { $('#show-invisible').prop("checked", true); }
    $('#keybinding').val(item.default.options.keybinding);
    var styles = item.styles.length, b = 0; 
    for (a = 0; a < styles; a = a) { if (a === styles) { break; } if (item.styles[b]) { a++; } b = checkStyleExists(b, item); }
    styles_arr = item.styles;
  });
  $('#write-new').click(function() { window.location.href = "edit.html?style=new"; });
  $(document).on('click', '.style', function() { window.location.href = "edit.html?style="+$(this).data("id"); });  
  $(document).on('click', '.style > input, .url_list', function(e) { e.stopPropagation(); });
  $(document).on('click', '.delete', function(e) { if (confirm('Are you sure you want to delete "'+$(this).parent().find('.name').prop("title")+'"?')) { e.stopPropagation(); $(this).parent().remove(); var style_id = $(this).data("id"); browser.storage.local.get(function(item) { item.styles.splice(style_id,1); browser.storage.local.set(item).then(onDone, onError); }); } });
  $(document).on('change', '.options', function() { saveOptions(); });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles disabled") { $('#enabled').prop('disabled', true); } else if (message.message === "styles enabled") { $('#enabled').prop('disabled', false); } });


