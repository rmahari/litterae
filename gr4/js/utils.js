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
Utils.removeAll = function(els) {
    for (var i=els.length-1; i>=0; i--) {
        els[i].remove();
    }
}
Utils.numericalSort = function(a,b) {
    return a - b;
}

Utils.getUrlHashVars = function() {
    var hash = top.location.hash.replace('#', '');
    var params = hash.split('&');
    var result = {};
    for(var i = 0; i < params.length; i++){
       var propval = params[i].split('=');
       result[propval[0]] = propval[1];
    }
    return result;
}

Utils.getRandomHash = function(n) {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var out = '';
    for (var i=0; i < n; i++ )
        out += possible.charAt(Math.floor(Math.random() * possible.length));
    return out;
}

/*
* For if we want to switch to listener model based updates...
*/

// if you pass in an object, the EventHost will install
// its methods onto it.
Utils.EventHost = function(o) {
    this.events = {};

    if (o) {
        o.on = this.on.bind(this);
        o.off = this.off.bind(this);
        o.trigger = this.trigger.bind(this);
    }
}
// tie a function f as listeren to events
// e, a space separated list of events
Utils.EventHost.prototype.on = function(e, f) {
    e = e.split(' ');
    for (var i=0; i<e.length; i++) {
        if (!this.events[e[i]]) this.events[e[i]]=[];
        this.events[e[i]].push(f);
    }
}
// turn off one or all events
Utils.EventHost.prototype.off = function(event) {
    if (event) {
        this.events[event] = [];
    } else {
        this.events = {};
    }
}
// trigger events
// e, a space separated list of events
Utils.EventHost.prototype.trigger = function(e) {
    e = e.split(' ');
    for (var i=0; i<e.length; i++) {
        if (this.events[e[i]]) {
            for (var j=0; j<this.events[e[i]].length; j++) {
                // pass all but the first argument (the event name)
                // to the listener function
                this.events[e[i]][j].apply(this,
                    Array.prototype.slice.call(arguments,1)
                );
            }
        }
    }
}