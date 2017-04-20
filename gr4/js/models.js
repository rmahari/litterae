function Highlight(ranges) {
    this.ranges = [];
    this.anchor = null;

    if (ranges) {
        for (var i=0; i<ranges.length; i++) {
            this.addRange(ranges[i][0], ranges[i][1]);
        }
    }
}
Highlight.prototype.addRange = function(wid1, wid2) {
    this.ranges.push([wid1,wid2]);
    if (!this.anchor) this.anchor = wid1; // TO-DO: What if someone adds a range before the first one?
}
Highlight.prototype.contains = function(wid) {
    return false
}
Highlight.prototype.clear = function() {
    this.ranges = [];
}
Highlight.prototype.forEachWord = function(f) {
    for (var i=0; i<this.ranges.length; i++) {
        for (var wid=this.ranges[i][0]; wid <= this.ranges[i][1]; wid++) {
            f(wid);
        }
    }
}
Highlight.prototype.contains = function(wid) {
    for (var i=0; i<this.ranges.length; i++) {
        if (wid >= this.ranges[i][0] && wid <= this.ranges[i][1]) return true;
    }
    return false;
}
Highlight.prototype.text = function() {
    var chunks = [];
    this.ranges.forEach((r) => {
        chunks.push( 'l.'+app.getLineNumber(r[0]) + ": " + 
                      app.words[r[0]] + ' ... ' + 
                      app.words[r[1]] );
    })
    return chunks.join(', ');
}

/**
 * UNUSED
 */
function Text() {
    this.words = [];
}
Text.prototype.fromPlain = function(text) {

}
Text.prototype.getWord = function(i) {
    return this.words[i];
}

/**
 * UNUSED
 */
function Annotation() {
    this.anchor = undefined;
    this.type = 'note'; // note/subscript/supscript/pointer ?
    this.content = '';
}
Annotation.prototype.idk = function() {

}