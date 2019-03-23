function onChange(item) {}
function onError(error) { console.log(`${error}`); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function sendMessageToTabs(tabs) { for (let tab of tabs) { browser.tabs.sendMessage(tab.id, { message: "update scripts" }).then(response => {}).catch(onError); } }
function checkStyleExists(b, item, styles_arr) { if (item["styling_"+b]) { styles_arr.push(b); $('#content').append('<div class="style" id="style_'+b+'" data-id="'+b+'"><input type="checkbox"><span class="name" title="'+item["styling_"+b].name+'">'+item["styling_"+b].name+'</span><button class="edit" data-id="'+b+'">Edit</button><button class="delete" data-id="'+b+'">Delete</button><div class="url_list"></div></div>'); b++; } else { b++; checkStyleExists(b, item, styles_arr); } return b; }
function loadStyles() { browser.storage.local.get().then(function(item) { var styles = objectLength(item) - 1, b = 1; for (a = 1; a <= styles; a = a) { if (a > styles) { break; } if (item["styling_"+b] !== undefined) { a++; } b = checkStyleExists(b, item, styles_arr); } }); }
$(function() {
  var delete_id = new URLSearchParams(window.location.search).get('delete');
  if (delete_id) { browser.storage.local.get().then(function(item) { var currentStyle = 'styling_'+delete_id; browser.storage.local.remove(currentStyle).then(onChange, onError); window.location.href = "manage.html"; }); }
  var styles_arr = [];
  loadStyles();
  $('#write-new').click(function() { for (a = 1; styles_arr.indexOf(a) === -1; a++) { window.location.href = "edit.html?style="+a; } });
  $(document).on('click', '.style', function() { window.location.href = "edit.html?style="+$(this).data("id"); });
  $(document).on('click', '.style > input, .url_list', function(e) { e.stopPropagation(); });
  $(document).on('click', '.delete', function(e) { if (confirm("Are you sure you want to delete "+$(this).parent().prop("title")+"?")) { window.location.href = "manage.html?delete="+$(this).parent().data("id"); } $('#content').empty(); loadStyles(); e.stopPropagation(); });
});
browser.runtime.onMessage.addListener(function(message) { if (message.message === "all styles disabled") { $('#enabled').prop('disabled', true); } else if (message.message === "all styles enabled") { $('#enabled').prop('disabled', false); } });