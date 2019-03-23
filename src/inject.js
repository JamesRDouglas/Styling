"use strict";
function onChange() { }
function onError(error) { console.log(`Error: ${error}`); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function insertAfter(el, referenceNode) { referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling); }
function getDomain(url) {
  url = url.replace(/(https?:\/\/)?(www.)?/i, '');
  if (url.indexOf('/') !== -1) { return url.split('/')[0]; }
  return url;
}
function updateStyles() {
  let localStorage = browser.storage.local.get(function(item) {
    if (!item.disabled) { browser.storage.local.set({ disabled: "false" }).then(onChange, onError); }
    if (!item.styling_1) { browser.storage.local.set({ styling_1: { block_1: { code: "", url_1: "", url_1_type: "url" } } }).then(onChange, onError); }
    if (item.styling_1) {
      var elements = document.getElementsByClassName('styling');
      for (var i = 0; i < elements.length; i++) { document.getElementsByTagName("html")[0].removeChild(elements[i]); }
      if (item.disabled == "false") {
        var urls = (objectLength(item.styling_1.block_1) - 1) / 2;
        for (a = 1; a <= urls; a++) { 
          if (item.styling_1.block_1["url_" + a] != undefined && ((item.styling_1.block_1["url_" + a + "_type"] == "url" && item.styling_1.block_1["url_" + a] == window.location.href) || (item.styling_1.block_1["url_" + a + "_type"] == "starting" && window.location.href.startsWith(item.styling_1.block_1["url_" + a])) || (item.styling_1.block_1["url_" + a + "_type"] == "domain" && item.styling_1.block_1["url_" + a] == getDomain(window.location.href)) || (item.styling_1.block_1["url_" + a + "_type"] == "everything"))) {
            var styleElement = document.createElement("style");
            styleElement.setAttribute("id", "styling-" + a);
            styleElement.setAttribute("class", "styling");
            styleElement.setAttribute("type", "text/css");
            styleElement.appendChild(document.createTextNode(item.styling_1.block_1.code.replace(/(\r\n\t|\n|\r\t)/gm,"")));
            insertAfter(styleElement, document.getElementsByTagName('html')[0]);
            //document.getElementsByTagName('html')[0].appendChild(styleElement);
          }
        }
      }
    }
  });
}
updateStyles();
browser.runtime.onMessage.addListener(request => { updateStyles(); });