function setItem() { console.log("OK"); }
function onError(error) { console.log(error) }
function update() { 
  var styling_url = { value: document.getElementById("url").value }
  var styling_code = { value: document.getElementById("code").value }
  browser.storage.local.set({styling_url, styling_code}).then(setItem(), onError()); 
}
if (!browser.storage.local.get("styling_url")) {
  var styling_url = "*";
  var styling_code = "background-color: yellow;";
  browser.storage.local.set({styling_url, styling_code}).then(setItem(), onError());
} else {
  browser.storage.local.get("styling_url").then(setItem(), onError());
  browser.storage.local.get("styling_code").then(setItem(), onError());
  document.getElementById("url").value = `${item.styling_url.value}`;
  document.getElementById("code").value = `${item.styling_code.value}`;
}
