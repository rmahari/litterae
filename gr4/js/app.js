function LitteraeApp(el) {
		// tie in DOM elements
		this.el = el;
		this.el_btn_marker = document.getElementById('btn-marker');
		this.el_text = document.getElementById('text');
		this.els_filters = document.querySelectorAll('#category-sel .category-icon');
		this.el_scope = document.getElementById('scope-sel')
		this.el_welcome = document.getElementById('welcome');
		this.el_inspect = document.getElementById('inspect');
		this.el_inspectpos = document.getElementById('inspect-pos');

		// load models
		this.user = new User();
		this.user.name = 'Ben Bitdiddle';
		this.user.isInstructor = true;

		this.annotation_list = getCannedAnnotations(this.user);

		// application state
		this.state = 'welcome'; // welcome / highlight / inspect
		this.filter = [false, false, false, false];
		this.scope = 'all'; // instructor / all / mine

		this.words = [];
		this.word_els = [];

		this.highlighted = new Highlight();  	

		this.editor = null;
		this.inspectList = new AnnotationListView();
		this.el_inspect.appendChild(this.inspectList.el);
		
		//finalize initialization
		this.prepareText();
		this.bindEvents();
		this.showAnnotationsOnText();
}

LitteraeApp.prototype.bindEvents = function() {
	var self = this;
	this.el_btn_marker.addEventListener('click', function(e) {
		if (self.state=='highlight') {
			self.setState('inspect');
		} else {
			self.setState('highlight');
		}
	});

	this.el_text.addEventListener('mouseup', function(e) {
		if (self.state != 'highlight') return;
		var sel = document.getSelection();
		if (sel.type != 'Range') return; // ignore Caret, None
		
		// user dragged from word a to word b to highlight
		var a = parseInt(sel.anchorNode.parentElement.id.substr(1));
		var b = parseInt(sel.focusNode.parentElement.id.substr(1));
		self.highlight(a, b);
	});

	for(var i = 0; i < this.els_filters.length; i++) { (function(i) {
		self.els_filters[i].addEventListener('click', function(e) {
			self.setFilter(i, !self.filter[i]);
		});
	})(i);}
	this.el_scope.addEventListener('change', function() {
		self.setScope(self.el_scope.value);
	});
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
	);;

	var lineNumber = this.getLineNumber(wid);
	Utils.setText(this.el_inspectpos, 'Line '+lineNumber+': '+this.words[wid]);
}

LitteraeApp.prototype.newAnnotation = function(highlight) {
	var self = this;

	Utils.hide(this.el_welcome); //TO-DO: move to setState ?
	Utils.hide(this.el_inspect);

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
		self.setState('inspect');
	});

	document.getElementById('col-right').prepend(this.editor.el);
}

LitteraeApp.prototype.edit = function(annotation) {
	var self = this;
	if (this.editor) this.editor.cancel();
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

LitteraeApp.prototype.setFilter = function(visibility, on) {
	var self = this;
	self.filter[visibility] = on;
    self.els_filters[visibility].classList.toggle('inactive', !on);
	self.showAnnotationsOnText();
}
LitteraeApp.prototype.showAnnotationsOnText = function() {
	var self = this;
	for (var i = 0; i < self.annotation_list.length; i++) {
		var annotation = self.annotation_list[i];
		annotation.highlight.forEachWord(function(wid) {
			for (var f =0; f < self.filter.length; f++) {
				self.word_els[wid].classList.toggle('annotated-'+f, self.isVisible(annotation) && annotation.category==f);
				self.word_els[wid].classList.toggle('instructor', self.isVisible(annotation) && annotation.author.isInstructor);
				self.word_els[wid].classList.toggle('mine', self.isVisible(annotation) && annotation.author == self.user);
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
	} else {
		this.highlighted.addRange(l,r);
	}
	this.showHighlightOnText(this.highlighted);

	if (this.editor) {
		this.editor.annotation.setHighlight(this.highlighted);
	} else {
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

LitteraeApp.prototype.getLineNumber = function(wid) {
    var lineHeight = parseFloat(window.getComputedStyle(this.el_text, null).getPropertyValue('line-height'));
	var lineNumber = parseInt(this.word_els[wid].offsetTop/lineHeight) + 1;
	return lineNumber;
}