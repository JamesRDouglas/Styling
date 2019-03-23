styleElement = document.createElement("style");
styleElement.setAttribute("id", "styling-id");
styleElement.setAttribute("class", "styling");
styleElement.setAttribute("type", "text/css");
styleElement.appendChild(document.createTextNode("body { background-color: yellow; }"));
document.appendChild(styleElement);

window.onload = function() {
	styleElement = document.createElement("style");
	styleElement.setAttribute("id", "styling-id");
	styleElement.setAttribute("class", "styling");
	styleElement.setAttribute("type", "text/css");
	styleElement.appendChild(document.createTextNode("body { background-color: yellow; }"));
	document.appendChild(styleElement);
};