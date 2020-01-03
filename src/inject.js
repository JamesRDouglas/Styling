function onError(error) { console.log(error); }
function insertAfter(newNode, referenceNode) { referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); }
function getDomain(url, subdomain) { subdomain = subdomain || false; url = url.replace(/(https?:\/\/)?(www.)?/i, ''); if (subdomain === true) { url = url.split('.').slice(url.length - 2).join('.'); } if (url.indexOf('/') !== -1) { return url.split('/')[0]; } return url; }
function updateStyles() {
  browser.storage.local.get(function(item) {
    if (item.default !== undefined && item.default.name !== undefined && item.default.enabled !== undefined && item.default.blocks !== undefined && item.default.options !== undefined && item.styles !== undefined && item.styles[0] !== undefined) {
      for (var o = 0; o < document.getElementsByClassName('styling').length; o++) { document.getElementsByTagName("html")[0].removeChild(document.getElementsByClassName('styling')[o]); }
      if (item.disabled === false) {
        for (var s = 0; s < item.styles.length; s++) {
          if (item.styles[s] && item.styles[s].enabled === true) {
            for (var b = 0; b < item.styles[s].blocks.length; b++) {
              if (item.styles[s].blocks[b]) {
                for (var u = 0; u < item.styles[s].blocks[b].urls.length; u++) {
                  if (item.styles[s].blocks[b].urls[u]) {
                    if (
                      (item.styles[s].blocks[b].urls[u].type === "url" && item.styles[s].blocks[b].urls[u].address === window.location.href) ||
                      (item.styles[s].blocks[b].urls[u].type === "starting" && window.location.href.startsWith(item.styles[s].blocks[b].urls[u].address)) ||
                      (item.styles[s].blocks[b].urls[u].type === "domain" && item.styles[s].blocks[b].urls[u].address === getDomain(window.location.href)) ||
                      (item.styles[s].blocks[b].urls[u].type === "everything")
                    ) {
                      var styleElement = document.createElement("style");
                      styleElement.setAttribute("id", "styling-"+item.styles[s].id+"-"+(b+1));
                      styleElement.setAttribute("data-name", item.styles[s].name);
                      styleElement.setAttribute("class", "styling");
                      styleElement.setAttribute("type", "text/css");
                      styleElement.appendChild(document.createTextNode(item.styles[s].blocks[b].code.replace(/(\r\n\t|\n|\r\t)/gm,"")));
                      document.documentElement.appendChild(styleElement);
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
}
updateStyles();
browser.runtime.onMessage.addListener(function(message) { if (message.action === "disable" || message.action === "enable" || message.action === "update") { updateStyles(); } });
