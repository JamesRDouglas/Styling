"use strict";
function onChange() { }
function onError(error) { console.log(`${error}`
  ); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function insertAfter(newNode, referenceNode) { referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); }
function getDomain(url) { url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function applyStyles(element) { if (document.body) { document.getElementsByTagName('html')[0].appendChild(element); } else { setTimeout(function() { applyStyles(element); }, 10); } }
function updateStyles() {
  browser.storage.local.get(function(item) {
    var options = item.options;
    if (!item.disabled) { browser.storage.local.set({ disabled: "false" }).then(onChange, onError); }
    if (!item.options) { browser.storage.local.set({ options: { tab_size: "2", font_size: "11", line_count: "15", autocomplete: "true", error_marker: "true", soft_tabs: "true", guide_indent: "false", show_invisible: "false", keybinding: "default" } }).then(onChange, onError); options = item.options; }
    if (!item.styling_1) { browser.storage.local.set({ styling_1: { name: "new style", disabled: "false", block_1: { code: "", url_1: "", url_1_type: "url" }, options } }).then(onChange, onError); }
    for (var a = 0; a < document.getElementsByClassName('styling').length; a++) { document.getElementsByTagName("html")[0].removeChild(document.getElementsByClassName('styling')[a]); }
    var styles = objectLength(item) - 2;
    for (var b = 1; b <= styles; b++) {
      if (item["styling_"+b] && item["styling_"+b].disabled != "true" && item.disabled == "false") {
        var blocks = objectLength(item["styling_"+b]) - 2;
        for (var c = 1; c <= blocks; c++) {
          var urls = (objectLength(item["styling_"+b]["block_"+c]) - 1) / 2;
          for (var d = 1; d <= urls; d++) { 
            if (item["styling_"+b].block_1["url_"+d] != undefined && ((item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "url" && item["styling_"+b]["block_"+c]["url_"+d] == window.location.href) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "starting" && window.location.href.startsWith(item["styling_"+b]["block_"+c]["url_"+d])) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "domain" && item["styling_"+b]["block_"+c]["url_"+d] == getDomain(window.location.href)) || (item["styling_"+b]["block_"+c]["url_"+d+"_type"] == "everything"))) {
              var styleElement = document.createElement("style");
              styleElement.setAttribute("id", "styling-"+b+"-"+c);
              styleElement.setAttribute("data-name", item["styling_"+b].name);
              styleElement.setAttribute("class", "styling");
              styleElement.setAttribute("type", "text/css");
              styleElement.appendChild(document.createTextNode(item["styling_"+b]["block_"+c].code.replace(/(\r\n\t|\n|\r\t)/gm,"")));
              applyStyles(styleElement);
              break;
            }
          }
        }
      }
    }
  });
}
updateStyles();
browser.runtime.onMessage.addListener(function(message) { if (message.message === "all styles disabled" || message.message === "all styles enabled" || message.message === "styles updated") { updateStyles(); } });