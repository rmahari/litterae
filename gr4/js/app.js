function LitteraeApp(el) {
		// tie in DOM elements
		this.el = el;
		this.el_btn_marker = document.getElementById('btn-marker');
		this.el_text = document.getElementById('text');
		this.els_filters = document.querySelectorAll('input[name="show"]');
		this.el_welcome = document.getElementById('welcome');
		this.el_inspect = document.getElementById('inspect');
		this.el_inspectpos = document.getElementById('inspect-pos');

		// load models
		this.user = new User();
		this.user.name = 'Ben Bitdiddle';
		this.user.isInstructor = true;

		this.annotation_list = [];

		// application state
		this.state = 'welcome'; // welcome / highlight / inspect
		this.filter = [false, false, false, false];

		this.words = [];
		this.word_els = [];

		this.highlighted = new Highlight();  	

		this.editor = null;
		this.inspectList = new AnnotationListView();
		this.el_inspect.appendChild(this.inspectList.el);
		
		//finalize initialization
		this.prepareText();
		this.bindEvents();
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
		
		// make a,b the word id's where the selection starts,ends respectively
		var ids = [ parseInt(sel.anchorNode.parentElement.id.substr(1)), 
		            parseInt(sel.focusNode.parentElement.id.substr(1)) ].sort(Utils.numericalSort);
		
		self.highlight(ids[0], ids[1]);
    });

	for(var i = 0; i < this.els_filters.length; i++) {
		this.els_filters[i].addEventListener('change', function(e) {
			self.setFilter(parseInt(e.target.id.substr(2)), e.target.checked);
		});
	}
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
			return self.isFilterOn(annotation.visibility) //TO-DO: do we actually wants this?
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
		self.setFilter(annotation.visibility, true);
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
		self.editor.el.remove();
		self.editor = null;
		self.setState('inspect');
	});

	document.getElementById('col-right').prepend(this.editor.el);
}

LitteraeApp.prototype.setFilter = function(visibility, on) {
	var self = this;

	self.filter[visibility] = on;
	document.getElementById('c0'+visibility).checked = on;

	// apply filter to text
	for (var i = 0; i < self.annotation_list.length; i++) {
		var annotation = self.annotation_list[i];
		if (annotation.visibility == visibility) {
			annotation.highlight.forEachWord(function(wid) {
				self.word_els[wid].classList.toggle('annotated-'+visibility, on);
			});
		}
	}
}
LitteraeApp.prototype.isFilterOn = function(visibility) {
	return this.filter[visibility];
}

/*
* Set the application state
*/
LitteraeApp.prototype.setState = function(state) {
	if (['welcome','highlight','inspect'].indexOf(state)<0) return;
	this.state = state;
	this.el_btn_marker.classList.toggle('active', (state=='highlight'));
	if (this.editor) this.editor.cancel();
	this.clearHighlights();
}

/*
* Highlight the range [w1, w2] in the text.
*/
LitteraeApp.prototype.highlight = function(w1, w2) {
	// create new highlight span
	var h = document.createElement('span');
	h.classList.add('highlight');

	// position highlight span
	this.el_text.insertBefore(h, this.word_els[w1]);

	// move all words into highlight span
	for (var w = w1; w<=w2; w++) h.appendChild(this.word_els[w]);

	// clear browser selection
	document.getSelection().removeAllRanges();

	this.highlighted.addRange(w1,w2);

	if (this.editor) {
		this.editor.annotation.setHighlight(this.highlighted);
	} else {
		this.newAnnotation(this.highlighted);
	}
}
LitteraeApp.prototype.clearHighlights = function() {
	this.highlighted.clear();

	//get or create highlight span
	var hs = document.getElementsByClassName('highlight');
	for (var i=hs.length-1; i>=0; i--) {
		var h = hs[i];  
		//unwrap it
		while (h.firstChild) h.parentNode.insertBefore(h.firstChild, h);
		//remove from the dom
		h.remove();
	}
}

LitteraeApp.prototype.getLineNumber = function(wid) {
    var lineHeight = parseFloat(window.getComputedStyle(this.el_text, null).getPropertyValue('line-height'));
	var lineNumber = parseInt(this.word_els[wid].offsetTop/lineHeight) + 1;
	return lineNumber;
}