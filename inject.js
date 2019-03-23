styleElement = document.createElement("style");
styleElement.setAttribute("id", "styling-id");
styleElement.setAttribute("class", "styling");
styleElement.setAttribute("type", "text/css");
styleElement.appendChild(document.createTextNode("body { background-color: yellow; }"));
ROOT.document.getElementsByTagName('html')[0].appendChild(styleElement);
document.getElementsByTagName('html')[0].appendChild(styleElement);