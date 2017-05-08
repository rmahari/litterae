function LitteraeApp(el) {
		// tie in DOM elements
		this.el = el;
		this.el_btn_marker = document.getElementById('btn-marker');
		this.el_btn_print = document.getElementById('btn-print');
		this.el_btn_settings = document.getElementById('btn-settings');
		this.el_text = document.getElementById('text');
		this.els_filters = document.querySelectorAll('#category-sel .category-icon');
		this.el_scope = document.getElementById('scope-sel')
		this.el_welcome = document.getElementById('welcome');
		this.el_inspect = document.getElementById('inspect');
		this.el_inspectpos = document.getElementById('inspect-pos');

		// load models
		this.user = getCannedCurrentUser();
		this.annotation_list = getCannedAnnotations(this.user);

		// application state
		this.state = 'welcome'; // welcome / highlight / inspect
		this.filter = [false, false, false, false];
		this.scope = 'all'; // instructor / all / mine

		this.words = [];
		this.word_els = [];

		this.highlighted = new Highlight();  	
		this.lastTextSelection = null;

		this.editor = null;
		this.inspectList = new AnnotationListView();
		this.el_inspect.appendChild(this.inspectList.el);
		
		//finalize initialization
		this.prepareText();
		this.bindEvents();
		this.turnOnAllFilters();
}

LitteraeApp.prototype.bindEvents = function() {
	var self = this;
	this.el_btn_marker.addEventListener('click', function(e) {
		if (self.state=='highlight') {
			self.setState('inspect');
		} else {
			self.setState('highlight');
			if (self.lastTextSelection) {
				self.highlight(self.lastTextSelection[0], self.lastTextSelection[1]);
			}
		}
	});
	this.el_btn_print.addEventListener('click', function() {
		self.print();
	});

	this.el_text.addEventListener('mouseup', function(e) {
		if (self.state != 'highlight') return;
		var sel = document.getSelection();
		if (sel.type != 'Range') return; // ignore Caret, None
		
		// user dragged from word a to word b to highlight
		var a = parseInt(sel.anchorNode.parentElement.id.substr(1));
		var b = parseInt(sel.focusNode.parentElement.id.substr(1));

		// The case where a == b is taken care of by an onclick listener set in this.prepareText.
		// Having two calls to self.highlight causes one to undo the other.
		if (a !== b) {
			self.highlight(a, b);
		}
	});

	for(var i = 0; i < this.els_filters.length; i++) { (function(i) {
		self.els_filters[i].addEventListener('click', function(e) {
			self.setFilter(i, !self.filter[i]);
		});
	})(i);}
	this.el_scope.addEventListener('change', function() {
		self.setScope(self.el_scope.value);
	});

	document.addEventListener('selectionchange', function() {
		var sel = document.getSelection();
		if (sel.anchorNode && self.el_text.contains(sel.anchorNode)) {
			self.lastTextSelection = [
				parseInt(sel.anchorNode.parentElement.id.substr(1)),
				parseInt(sel.focusNode.parentElement.id.substr(1))
			];
		} else if (!(sel.anchorNode && self.el_btn_marker.contains(sel.anchorNode))) {
			self.lastTextSelection = null;
		} 
	});

	this.el_btn_settings.addEventListener('click', function() {
        window.open('index.htm', '_self');
    })

}

/*
* Takes the contents of the text fragment, and wrappes it all in span elements that
* are assigned word ID's. You'd obviously do this differently if the text were pulled
* from a backend.
*/
LitteraeApp.prototype.prepareText = function() {
	var self = this;
    var src = this.el_text.innerText;
    self.words = src.split(' ');
    Utils.clearChildNodes(this.el_text);
    for (var i=0; i<self.words.length; i++) { (function(i) {
        var span = document.createElement('span');
        span.id = "w"+i;
        span.appendChild(document.createTextNode(self.words[i]));
		span.appendChild(document.createTextNode(' '));
		span.addEventListener('click', function() {
			if (self.state=='highlight') {
				self.highlight(i,i);
			} else {
				self.inspect(i);
			}
		});
		self.word_els[i] = span;
        self.el_text.appendChild(span);
	})(i)}
}

/*
* Opens all annotations for one word, with word ID 'wid'.
 */
LitteraeApp.prototype.inspect = function(wid) {
	var self = this;

	Utils.show(this.el_inspect);
	Utils.hide(this.el_welcome);

	category_annotations = [];

	this.inspectList.setList(
		this.annotation_list.filter(function(annotation) {
			return self.isVisible(annotation) //TO-DO: do we actually wants this?
				   && annotation.highlight.contains(wid);
		})
	);

	Utils.setText(this.el_inspectpos, this.words[wid]);

	for (var i=0; i<this.word_els.length; i++) this.word_els[i].classList.remove('inspected');
	this.word_els[wid].classList.add('inspected');
}

LitteraeApp.prototype.newAnnotation = function(highlight) {
	var self = this;

	Utils.hide(this.el_welcome); //TO-DO: move to setState ?
	Utils.hide(this.el_inspect);
	for (var i=0; i<this.word_els.length; i++) this.word_els[i].classList.remove('inspected');

	var annotation = new Annotation(highlight);
	annotation.author = this.user;
	this.editor = new AnnotationEditView(annotation);
	this.editor.on('save', function() {
		self.annotation_list.push(annotation);
		self.setFilter(annotation.category, true);
		self.clearHighlights();
		self.editor.el.remove();
		self.editor = null;
		self.inspect(annotation.highlight.anchor);
	});
	this.editor.on('cancel', function() {
		self.editor.el.remove();
		self.editor = null;
		self.clearHighlights();
		self.inspect(annotation.highlight.anchor);
		//self.setState('inspect');
	});

	document.getElementById('col-right').prepend(this.editor.el);
}

LitteraeApp.prototype.edit = function(annotation) {
	var self = this;
	if (this.editor) this.editor.cancel();
	this.setState('highlight');
	this.highlighted = new Highlight(annotation.highlight);
	this.showHighlightOnText(this.highlighted);

	this.editor = new AnnotationEditView(annotation);
	this.editor.on('save cancel', function() {
		self.setFilter(annotation.category, true);
		self.clearHighlights();
		self.editor.el.remove();
		self.editor = null;
		self.inspect(annotation.highlight.anchor);
	});
	document.getElementById('col-right').prepend(this.editor.el);
}

LitteraeApp.prototype.delete = function(annotation) {
	var self = this;
	var idx = self.annotation_list.indexOf(annotation);
	self.annotation_list.splice(idx, 1);
	self.clearHighlights();
	self.showAnnotationsOnText();
}

LitteraeApp.prototype.setFilter = function(visibility, on) {
	var self = this;
	self.filter[visibility] = on;
    self.els_filters[visibility].classList.toggle('inactive', !on);
	self.showAnnotationsOnText();
}
LitteraeApp.prototype.turnOnAllFilters = function() {
	var self = this;
	for (var i = self.filter.length - 1; i >= 0; i--) {
		self.setFilter(i, true);
	}
}
LitteraeApp.prototype.showAnnotationsOnText = function() {
	var self = this;
	for (var w=0; w<self.word_els.length; w++) {
		self.word_els[w].classList.remove('annotated-0', 'annotated-1', 'annotated-2', 'annotated-3', 'mine', 'instructor');
	}
	for (var i = 0; i < self.annotation_list.length; i++) {
		var annotation = self.annotation_list[i];
		annotation.highlight.forEachWord(function(wid) {
			if (self.isVisible(annotation)) {
				if (annotation.author.isInstructor) {self.word_els[wid].classList.add('instructor')};
				if (annotation.author == self.user) {self.word_els[wid].classList.add('mine')};
				for (var f = 0; f < self.filter.length; f++) {
					if (annotation.category==f) {self.word_els[wid].classList.toggle('annotated-'+f, self.isVisible(annotation) && annotation.category==f)};
				}
			}
		});
	}
}
LitteraeApp.prototype.isFilterOn = function(visibility) {
	return this.filter[visibility];
}
LitteraeApp.prototype.setScope = function(scope) {
	if (scope != 'instructor' && scope != 'all' && scope != 'mine') return;
	this.scope = scope;
	this.el_scope.value = scope;
	this.showAnnotationsOnText();
}
LitteraeApp.prototype.isVisible = function(annotation) {
	return this.filter[annotation.category] &&
		   ((this.scope == 'all') || 
		    (this.scope == 'instructor' && annotation.author.isInstructor) ||
			(this.scope == 'mine' && annotation.author == this.user));
}

/*
* Set the application state
*/
LitteraeApp.prototype.setState = function(state) {
	if (['welcome','highlight','inspect'].indexOf(state)<0) return;
	this.state = state;
	this.el_btn_marker.classList.toggle('active', (state=='highlight'));
	this.el_text.classList.toggle('selection-highlight-yellow', (state=='highlight'));
	if (this.editor) this.editor.cancel();
	this.clearHighlights();
}

/*
* Handles a drag from the highlighter from word w1 to word w2
*/
LitteraeApp.prototype.highlight = function(w1, w2) {
	// clear browser selection
	document.getSelection().removeAllRanges();

	var ws = [w1, w2].sort(Utils.numericalSort);
	var l = ws[0];
	var r = ws[1];

	if (this.highlighted.contains(w2)) {
		this.highlighted.removeRange(l,r);
		if (this.highlighted.ranges.length === 0) {
			this.editor.cancel();
		}
	} else {
		this.highlighted.addRange(l,r);
	}
	this.showHighlightOnText(this.highlighted);

	if (this.editor) {
		this.editor.annotation.setHighlight(this.highlighted);
	} else if (this.highlighted.ranges.length != 0) {
		this.newAnnotation(this.highlighted);
	}
}
LitteraeApp.prototype.showHighlightOnText = function(highlight) {
	var self = this;
	for (var w=0; w<this.word_els.length; w++) {
		this.word_els[w].classList.toggle('highlight', highlight.contains(w));
	}
}
LitteraeApp.prototype.clearHighlights = function() {
	this.highlighted.clear();

	var hs = document.getElementsByClassName('highlight');
	for (var i=hs.length-1; i>=0; i--) hs[i].classList.remove('highlight');
}
LitteraeApp.prototype.print = function() {
	new PrintView();
}