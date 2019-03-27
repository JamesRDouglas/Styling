function onDone() { }
function onError(error) { console.log(`${error}`); }
function objectLength(object) { var length = 0; for(var key in object) { if( object.hasOwnProperty(key) ) { ++length; } } return length; };
function insertAfter(newNode, referenceNode) { referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); }
function getDomain(url, subdomain) { subdomain = subdomain || false; url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (!subdomain) { url = url.split('.').slice(url.length - 2).join('.'); } if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function applyStyles(element) { if (document.body) { document.getElementsByTagName('html')[0].appendChild(element); } else { setTimeout(function() { applyStyles(element); }, 10); } }
function updateStyles() {
  browser.storage.local.get(function(item) {
    var default_style = item.default;
    if (!item.disabled) { browser.storage.local.set({ disabled: false }).then(onDone, onError); }
    if (!item.default.options) { browser.storage.local.set({ options: { tab_size: "2", font_size: "11", line_count: "15", autocomplete: true, error_marker: true, soft_tabs: true, guide_indent: false, show_invisible: false, keybinding: "default" } }).then(onDone, onError); default_style = item.default; }
    if (!item.styles[0]) { item.styles[0] = default_style; browser.storage.local.set(item).then(onDone, onError); }
    for (var a = 0; a < document.getElementsByClassName('styling').length; a++) { document.getElementsByTagName("html")[0].removeChild(document.getElementsByClassName('styling')[a]); }
    var styles = item.styles.length;
    for (var b = 0; b < styles; b++) {
      if (item.styles[b] && item.styles[b].disabled === false && item.disabled === false) {
        var blocks = item.styles[b].blocks.length;
        for (var c = 1; c <= blocks; c++) {
          var urls = item.styles[b].blocks[c].urls.length;
          for (var d = 1; d <= urls; d++) { 
            if (item.styles[b].blocks[0].urls[d]) {
              if ((item.styles[b].blocks[c].urls[d].type === "url" && item.styles[b].blocks[c].urls[d].address === window.location.href) || (item.styles[b].blocks[c].urls[d].type === "starting" && window.location.href.startsWith(item.styles[b].blocks[c].urls[d].address)) || (item.styles[b].blocks[c].urls[d].type === "domain" && item.styles[b].blocks[c].urls[d].address === getDomain(window.location.href)) || (item.styles[b].blocks[c].urls[d].type === "everything")) {
                var styleElement = document.createElement("style");
                styleElement.setAttribute("id", "styling-"+b+"-"+c+"-"+d);
                styleElement.setAttribute("data-name", item.styles[b].name);
                styleElement.setAttribute("class", "styling");
                styleElement.setAttribute("type", "text/css");
                styleElement.appendChild(document.createTextNode(item.styles[b].blocks[c].code.replace(/(\r\n\t|\n|\r\t)/gm,"")));
                applyStyles(styleElement);
                break;
              }
            }
          }
        }
      }
    }
  });
}
updateStyles(); 
browser.runtime.onMessage.addListener(function(message) { if (message.message === "styles disabled" || message.message === "styles enabled" || message.message === "styles updated") { updateStyles(); } });


