var Utils = {}
Utils.toggle = function(obj, property, one, two) {
    obj[property] = (obj[property]==one) ? two : one;
}

Utils.clearChildNodes = function(el) {
	while (el.firstChild) el.removeChild(el.firstChild);
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