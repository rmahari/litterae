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
    if (!this.anchor) this.anchor = wid1; // TO-DO: What if someone adds a range before the first one?
    this.ranges.push([wid1,wid2]);

    //sort ranges by start index
    this.ranges.sort((a, b) => (a[0]-b[0]));

    //iterate over them and join where overlapping or adjacent
    for (var i=0; i<this.ranges.length-1; i++) {
        if (this.ranges[i][1] >= this.ranges[i+1][0] - 1) {
            this.ranges[i][1] = Math.max(this.ranges[i][1], this.ranges[i+1][1]);
            this.ranges.splice(i+1, 1); i--;
        }
    }
}
Highlight.prototype.removeRange = function(l, r) {
    var L, R;
    // iterate over each range [L,R], and test if/in which way
    // it overlaps with the range we're removing, [l, r]
    for (var i=0; i<this.ranges.length; i++) {
        L = this.ranges[i][0];
        R = this.ranges[i][1];
        if (l<=L && R<=r) {
            //remove range entirely
            this.ranges.splice(i, 1); i--;
        } else if (l<=L && L<=r) {
            // trim left
            this.ranges[i][0] = r+1;
        } else if (l<=R && R<=r) {
            // trim right
            this.ranges[i][1] = l-1;
        } else if (L<l && r<R) {
            // split
            this.ranges[i] = [L  , l-1];
            this.ranges.push([r+1, R  ]);
        }
    }
    //sort ranges by start index
    this.ranges.sort((a, b) => (a[0]-b[0]));
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
            chunks.push(app.words[r[0]] + ((r[1]-r[0]==1) ? ' ' :  ' ... ') + 
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
    this.approved = false;

    this.eventHost = new Utils.EventHost(this);
}
Annotation.prototype.setHighlight = function(highlight) {
    this.highlight = new Highlight(highlight);
    this.trigger('update update-highlight');
}
Annotation.prototype.setText = function(text) {
    //TO-DO: input-validation;
    this.text = text;
    this.trigger('update');
}
Annotation.prototype.setVisibility = function(visibility) {
    /*
    I want to use this, but right now, visibility is an int 0,1,2,3

    if ((visibility != Annotation.VISIBILITY_PRIVATE) &&
        (visibility != Annotation.VISIBILITY_SHARED)) return false;
    */
    this.visibility = parseInt(visibility);
    this.trigger('update');
}
Annotation.prototype.setCategory = function(category) {
    //TO-DO: input validation
    this.category = parseInt(category);
    this.trigger('update');
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

User.prototype.canApprove = function(annotation) {
    if ((this.isInstructor) && (annotation.user != this)) {
        return true;
    } else {
        return false;
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