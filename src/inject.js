"use strict";
function onChange() { }
function onError(error) { console.log(`Error: ${error}`); }
function updateStyles() {
  let localStorage = browser.storage.local.get(function(item) {
    if (!item.disabled) {
      browser.storage.local.set({ disabled: "false" }).then(onChange, onError);
    }
    if (item.styling_1) {
      function apply() {
        if (item.disabled == "false") {
          var styleElement = document.createElement("style");
          styleElement.setAttribute("id", "styling-1");
          styleElement.setAttribute("class", "styling");
          styleElement.setAttribute("type", "text/css");
          styleElement.appendChild(document.createTextNode(item.styling_1.block_1.code));
          document.getElementsByTagName('html')[0].appendChild(styleElement);
        } else {
          var elements = document.getElementsByClassName('styling');
          for (var i = 0; i < elements.length; i++) { document.getElementsByTagName("html")[0].removeChild(elements[i]); }
        }
      }
      if (item.styling_1.block_1.url_1 && (item.styling_1.block_1.url_1_type == "url" && item.styling_1.block_1.url_1 == window.location.href) || (item.styling_1.block_1.url_1_type == "starting" && window.location.href.startsWith(item.styling_1.block_1.url_1)) || (item.styling_1.block_1.url_1_type == "domain" && item.styling_1.block_1.url_1 == location.hostname) || (item.styling_1.block_1.url_1_type == "everything")) {
        apply();
      }
    }
  });
}
updateStyles();
browser.runtime.onMessage.addListener(request => { updateStyles(); });