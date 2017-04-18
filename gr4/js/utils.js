var Utils = {}
Utils.toggle = function(obj, property, one, two) {
    obj[property] = (obj[property]==one) ? two : one;
}

Utils.clearChildNodes = function(el) {
	while (el.firstChild) el.removeChild(el.firstChild);
}