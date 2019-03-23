function insertAfter(newNode, referenceNode) { referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); }
if (browser.storage.local.get().disabled.value == "false") {
  styleElement = document.createElement("style");
  styleElement.setAttribute("id", "styling-id");
  styleElement.setAttribute("class", "styling");
  styleElement.setAttribute("type", "text/css");
  styleElement.appendChild(document.createTextNode("body { background-color: yellow; }"));
  insertAfter(styleElement, document.getElementsByTagName('html')[0]);
  insertAfter(styleElement, ROOT.document.getElementsByTagName('html')[0]);
}