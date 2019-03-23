"use strict";
function updateStyles() {
  let localStorage = browser.storage.local.get(function(item) {
    if (item.styling_1) {
      function apply() {
        if (item.disabled == "false") {
          var styleElement = document.createElement("style");
          styleElement.setAttribute("id", "styling-1");
          styleElement.setAttribute("class", "styling");
          styleElement.setAttribute("type", "text/css");
          styleElement.appendChild(document.createTextNode(item.styling_1.code));
          document.getElementsByTagName('html')[0].appendChild(styleElement);
        } else {
          var elements = document.getElementsByClassName('styling');
          for (var i = 0; i < elements.length; i++) { document.getElementsByTagName("html")[0].removeChild(elements[i]); }
        }
      }
      if (item.styling_1.url && item.styling_1.url == window.location.href) {
        apply();
      } else if (item.styling_1.url && item.styling_1.url == "") {
        apply();
      }
    }
  });
}
updateStyles();
browser.runtime.onMessage.addListener(request => { updateStyles(); });
window.onhashchange = function() { updateStyles(); }
document.onload = function() { updateStyles(); }