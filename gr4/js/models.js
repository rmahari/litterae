/*
* Highlight represents a selected part of a test that an annotation belongs to.
* it consists of any number of disjoint, continuous ranges of words.
*/

function Highlight(highlight) {
    this.ranges = [];
    this.anchor = null;

    if (highlight && highlight.ranges) {
        for (var i=0; i<highlight.ranges.length; i++) {
            this.addRange(highlight.ranges[i][0], highlight.ranges[i][1]);
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
        if (r[0]==r[1]) {
            chunks.push(app.words[r[0]]); //cringe... shouldn't be using the app global
        } else {
            chunks.push( 'l.'+app.getLineNumber(r[0]) + ": " + 
                      app.words[r[0]] + ((r[1]-r[0]==1) ? ' ' :  ' ... ') + 
                      app.words[r[1]] );
        }
    });
    return chunks.join(', ');
}


/**
 * Annotation
 */
function Annotation(highlight) {
    this.type = 'note'; // note/subscript/supscript/pointer ?
    this.highlight = new Highlight(highlight);
    this.author = null;
    this.text = '';
    this.visibility = null;
    this.category = null;

    this.eventHost = new Utils.EventHost(this);
}
Annotation.prototype.setHighlight = function(highlight) {
    this.highlight = new Highlight(highlight);
}
Annotation.prototype.setText = function(text) {
    //TO-DO: input-validation;
    this.text = text;
}
Annotation.prototype.setVisibility = function(visibility) {
    /*
    I want to use this, but right now, visibility is an int 0,1,2,3

    if ((visibility != Annotation.VISIBILITY_PRIVATE) &&
        (visibility != Annotation.VISIBILITY_SHARED)) return false;
    */
    this.visibility = parseInt(visibility);
}
Annotation.prototype.setCategory = function(category) {
    //TO-DO: input validation
    this.category = parseInt(category);
}

Annotation.VISIBILITY_PRIVATE = 0;
Annotation.VISIBILITY_SHARED = 1;

/**
 * User
 */
function User() {
    this.id = 0;
    this.name = '';
    this.isInstructor = false;
}
User.prototype.canSee = function(annotation) {
    if (this.isInstructor) {
        return true;
    } else {
        return annotation.user === this;
    } 
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