function setItem() { 
  document.getElementById("url").value = `${item.styling_url.value}`;
  document.getElementById("code").value = `${item.styling_code.value}`;
}
function onError(error) { 
  console.log(error) 
  var styling_url = "*";
  var styling_code = "background-color: yellow;";
  browser.storage.local.set({styling_url, styling_code}).then(setItem(), onError());
}
$('#update').click(function() {
  alert('hi');
  var styling_url = { value: document.getElementById("url").value }
  var styling_code = { value: document.getElementById("code").value }
  browser.storage.local.set({styling_url, styling_code}).then(setItem(), onError()); 
});
browser.storage.local.get("styling_url").then(setItem(), onError());
browser.storage.local.get("styling_code").then(setItem(), onError());