styleElement = document.createElement("style");
styleElement.setAttribute("id", "styling-id");
styleElement.setAttribute("class", "styling");
styleElement.setAttribute("type", "text/css");
styleElement.appendChild(document.createTextNode("body { background-color: yellow; }"));
//document.getElementsByTagName('html')[0].insertAfter(styleElement);
ROOT.document.getElementsByTagName('html')[0].insertAfter(styleElement);