"use strict";
function updateStyles() {
  let localStorage = browser.storage.local.get(function(item) {
    if (item.disabled.value == "false") {
      var styleElement = document.createElement("style");
      styleElement.setAttribute("id", "styling-id");
      styleElement.setAttribute("class", "styling");
      styleElement.setAttribute("type", "text/css");
      styleElement.appendChild(document.createTextNode("body { background-color: yellow; }"));
      document.getElementsByTagName('html')[0].appendChild(styleElement);
    } else {
      document.getElementsByClassName('styling').remove();
    }
  });
}
updateStyles();
browser.runtime.onMessage.addListener(request => {
  updateStyles();
  return Promise.resolve({ response: "Hi" });
});