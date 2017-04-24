function LitteraeApp(el) {
		// tie in DOM elements
		this.el = el;
		this.btn_marker = document.getElementById('btn-marker');
		this.text = document.getElementById('text');
		this.category_dropdowns = document.getElementsByClassName('category');
		this.filters = document.querySelectorAll('input[name="show"]');

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

		//finalize initialization
		this.prepareText();
		this.bindEvents();
}

LitteraeApp.prototype.bindEvents = function() {
	var self = this;
	this.btn_marker.addEventListener('click', function(e) {
		if (self.state=='highlight') {
			self.setState('inspect');
		} else {
			self.setState('highlight');
		}
	});

    this.text.addEventListener('mouseup', function(e) {
		if (self.state != 'highlight') return;
		var sel = document.getSelection();
		if (sel.type != 'Range') return; // ignore Caret, None
		
		// make a,b the word id's where the selection starts,ends respectively
		var ids = [ parseInt(sel.anchorNode.parentElement.id.substr(1)), 
		            parseInt(sel.focusNode.parentElement.id.substr(1)) ].sort(Utils.numericalSort);
		
		self.highlight(ids[0], ids[1]);
    });

	// might want to move this into a separate view for the annotation list
	for (var i = 0; i < this.category_dropdowns.length; i ++) {
		this.category_dropdowns[i].addEventListener('click', function(e) {
			if (e.target.tagName != 'DIV') {
				var annotations = this.querySelectorAll('div')[0];
				if (annotations.style.display === 'none') {
					this.style.backgroundColor
					this.getElementsByClassName('dropdown-icon')[0].classList.add("rotated");
					annotations.style.display = 'block';
				} else {
					this.getElementsByClassName('dropdown-icon')[0].classList.remove("rotated");
					annotations.style.display = 'none';
				}
			}
		});
	}

	for(var i = 0; i < this.filters.length; i++) {
		this.filters[i].addEventListener('change', function(e) {
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
    var src = this.text.innerText;
    self.words = src.split(' ');
    Utils.clearChildNodes(this.text);
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
        this.text.appendChild(span);
	})(i)}
}

/*
* Opens all annotations for one word, with word ID 'wid'.
 */
LitteraeApp.prototype.inspect = function(wid) {
	var self = this;

	Utils.show(document.getElementById('all-annotations'));
	Utils.hide(document.getElementById('welcome'));
	
	var no_annotations = true;
	Utils.show(document.getElementById('all-annotations'));

	var categories = document.getElementsByClassName('category');
	category_annotations = [];
	for (var i = 0; i < categories.length; i++) {
		categories[i].querySelectorAll('div')[0].innerHTML = '';
		category_annotations[i] = this.annotation_list.filter(function(annotation) {
			return annotation.category == i && annotation.highlight.contains(wid);
		});
		if (category_annotations[i].length > 0) {
			categories[i].getElementsByClassName("annotation-count")[0].innerHTML = " - " + category_annotations[i].length;
		} else {
			categories[i].getElementsByClassName("annotation-count")[0].innerHTML = "";
		}
	}
	for (var i = 0; i < this.annotation_list.length; i++) {
		var ann = this.annotation_list[i];
		if (ann.highlight.contains(wid)) {
			no_annotations = false;
			if (this.isFilterOn(ann.visibility)) {
				var categories = document.getElementsByClassName('category'); //TO-DO: Should be templated view of Annotation obj

				var view = new AnnotationView(ann);
				categories[ann.category].querySelectorAll('div')[0].append(view.el);
			}
		}
	}
	Utils.hide(document.getElementById('welcome'));

	var lineNumField = document.getElementsByClassName('selected-line-num');
	var selectedField = document.getElementsByClassName('selected-text');
	var lineNumber = this.getLineNumber(wid);
	document.getElementById('all-annotations-pos').innerHTML = 'Line '+lineNumber+': '+this.words[wid];
}

LitteraeApp.prototype.newAnnotation = function(highlight) {
	var self = this;

	Utils.hide(document.getElementById('welcome')); //TO-DO: move to setState ?
	Utils.hide(document.getElementById('all-annotations'));

	var annotation = new Annotation(highlight);
	annotation.author = this.user;
	this.editor = new AnnotationEditView(annotation);
	this.editor.on('save', function() {
		console.log('save annotation', annotation);
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
	this.btn_marker.classList.toggle('active', (state=='highlight'));
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
	this.text.insertBefore(h, this.word_els[w1]);

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
    var lineHeight = parseFloat(window.getComputedStyle(this.text, null).getPropertyValue('line-height'));
	var lineNumber = parseInt(this.word_els[wid].offsetTop/lineHeight) + 1;
	return lineNumber;
}