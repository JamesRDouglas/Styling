window.onload = function() {
	var styleElement = document.getElementById("styling-id");
	if (styleElement === 0) { return false; }
	styleElement = document.createElement("style");
	styleElement.setAttribute("id", "styling-id");
	styleElement.setAttribute("class", "styling");
	styleElement.setAttribute("type", "text/css");
	styleElement.appendChild(document.createTextNode("body { background-color: yellow; }"));
	document.head.appendChild(styleElement);
};