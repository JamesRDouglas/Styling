function onDone() { }
function onError(error) { console.log(`${error}`); }
function insertAfter(newNode, referenceNode) { referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); }
function getDomain(url, subdomain) { subdomain = subdomain || false; url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (!subdomain) { url = url.split('.').slice(url.length - 2).join('.'); } if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function applyStyles(element) { if (document.body) { document.getElementsByTagName('html')[0].appendChild(element); } else { setTimeout(function() { applyStyles(element); }, 10); } }
function updateStyles() {
  browser.storage.local.get(function(item) {
    var default_style = item.default, styles_arr = [], newstyle_id;
    if (!item.disabled) { browser.storage.local.set({ disabled: false }).then(onDone, onError); }
    for (a = 0; a < item.styles.length; a++) { styles_arr.push(item.styles[a].id); }
    if (styles_arr.indexOf(b)) { item.styles[(item.styles.length-1)].id = b; styles_arr = b; }
    if (!item.styles[0]) { if (item.styles.length < 1) { item.styles[0] = default_style; browser.storage.local.set(item).then(function() { window.location.reload(); }, onError); } else { item.styles = item.styles.filter(val => val); } }
    for (var a = 0; a < document.getElementsByClassName('styling').length; a++) { document.getElementsByTagName("html")[0].removeChild(document.getElementsByClassName('styling')[a]); }
    var styles = item.styles.length;
    for (var b = 0; b < styles; b++) {
      if (item.styles[b] && item.styles[b].disabled === false && item.disabled === false) {
        var blocks = item.styles[b].blocks.length;
        for (var c = 0; c < blocks; c++) {
          var urls = item.styles[b].blocks[c].urls.length;
          for (var d = 0; d < urls; d++) {
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
