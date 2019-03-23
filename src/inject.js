"use strict";
function onChange() { }
function onError(error) { console.log(`Error: ${error}`); }
function getDomain(url) {
  url = url.replace(/(https?:\/\/)?(www.)?/i, '');
  if (url.indexOf('/') !== -1) { return url.split('/')[0]; }
  return url;
}
function updateStyles() {
  let localStorage = browser.storage.local.get(function(item) {
    if (!item.disabled) {
      browser.storage.local.set({ disabled: "false" }).then(onChange, onError);
    }
    if (item.styling_1) {
      var elements = document.getElementsByClassName('styling');
      for (var i = 0; i < elements.length; i++) { document.getElementsByTagName("html")[0].removeChild(elements[i]); }
      if (item.disabled == "false") {
      	var regularExpression = new RegExp(item.styling_1.block_1.url_1);
        if (item.styling_1.block_1.url_1 != undefined && ((item.styling_1.block_1.url_1_type == "url" && item.styling_1.block_1.url_1 == window.location.href) || (item.styling_1.block_1.url_1_type == "starting" && window.location.href.startsWith(item.styling_1.block_1.url_1)) || (item.styling_1.block_1.url_1_type == "domain" && item.styling_1.block_1.url_1 == getDomain(window.location.href)) || (item.styling_1.block_1.url_1_type == "regexp" &&  regularExpression.test(window.location.href)) || (item.styling_1.block_1.url_1_type == "everything"))) {
          var styleElement = document.createElement("style");
          styleElement.setAttribute("id", "styling-1");
          styleElement.setAttribute("class", "styling");
          styleElement.setAttribute("type", "text/css");
          styleElement.appendChild(document.createTextNode(item.styling_1.block_1.code_1.replace(/(\r\n\t|\n|\r\t)/gm,"")));
          document.getElementsByTagName('html')[0].appendChild(styleElement);
        }
      }
    }
  });
}
updateStyles();
browser.runtime.onMessage.addListener(request => { updateStyles(); });