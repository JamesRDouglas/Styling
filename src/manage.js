function onDone(item) { }
function onError(error) { console.log(`${error}`); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function sendMessageToTabs(tabs, message) { for (let tab of tabs) { if (message === "disable") { browser.tabs.sendMessage(tab.id, {message: "styles disabled"}).then(response => {  }).catch(onError); } else if (message === "enable") { browser.tabs.sendMessage(tab.id, {message: "styles enabled"}).then(response => {  }).catch(onError); } else if (message === "update") { browser.tabs.sendMessage(tab.id, {message: "styles updated"}).then(response => {  }).catch(onError); } } }
function checkStyleExists(b, item) { if (item.styles[b]) { $('#content').append('<div class="style" id="style_'+b+'" data-id="'+b+'"><input type="checkbox"><span class="name" title="'+item.styles[b].name+'">'+item.styles[b].name+'</span><button class="edit" data-id="'+b+'">Edit</button><button class="delete" data-id="'+b+'">Delete</button><div class="url_list"></div></div>'); } else { b++; checkStyleExists(b, item); } b++; return b; }
$(function() {
  var styles_arr;
  browser.storage.local.get().then(function(item) { 
    $('#line-count').val(item.options.line_count);
    $('#tab-size').val(item.options.tab_size);
    $('#font-size').val(item.options.font_size);
    if (item.options.autocomplete === "true") { $('#autocomplete').prop("checked", true); }
    if (item.options.error_marker === "true") { $('#error-marker').prop("checked", true); }
    if (item.options.soft_tabs === "true") { $('#soft-tabs').prop("checked", true); }
    if (item.options.guide_indent === "true") { $('#guide-indent').prop("checked", true); }
    if (item.options.show_invisible === "true") { $('#show-invisible').prop("checked", true); }
    $('#keybinding').val(item.options.keybinding);
    var styles = item.styles.length, b = 0; 
    for (a = 0; a < styles; a = a) { if (a === styles) { break; } if (item.styles[b]) { a++; } b = checkStyleExists(b, item); }
    styles_arr = item.styles;
  });
  $('#write-new').click(function() { window.location.href = "edit.html?style=new"; });
  $(document).on('click', '.style', function() { window.location.href = "edit.html?style="+$(this).data("id"); });  
  $(document).on('click', '.style > input, .url_list', function(e) { e.stopPropagation(); });
  $(document).on('click', '.delete', function(e) { 
    if (confirm('Are you sure you want to delete "'+$(this).parent().find('.name').prop("title")+'"?')) { 
      e.stopPropagation(); 
      $(this).parent().remove(); 
      browser.storage.local.get(function(item) { 
        item.styles.splice($(this).data("id"),1);
        browser.storage.local.set(item).then(onDone, onError);
      });
    } 
  });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles disabled") { $('#enabled').prop('disabled', true); } else if (message.message === "styles enabled") { $('#enabled').prop('disabled', false); } });


