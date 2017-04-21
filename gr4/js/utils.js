var Utils = {}
Utils.toggle = function(obj, property, one, two) {
    obj[property] = (obj[property]==one) ? two : one;
}

Utils.clearChildNodes = function(el) {
	while (el.firstChild) el.removeChild(el.firstChild);
}

Utils.setText = function(el, text) {
    Utils.clearChildNodes(el);
    el.appendChild(document.createTextNode(text));
}

Utils.show = function(el) {
    el.style.display = 'block';
}
Utils.hide = function(el) {
    el.style.display = 'none';
}

Utils.numericalSort = function(a,b) {
    return a - b;
}