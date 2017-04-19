function LitteraeApp(el) {
		this.el = el;
		this.btn_marker = document.getElementById('btn-marker');
		this.text = document.getElementById('text');
		this.new_annotation = document.getElementById('new-annotation');
		this.cancel_add = document.getElementById('cancel-add');
		this.save_add = document.getElementById('save-add');
		this.category_dropdowns = document.getElementsByClassName('category');
		this.filters = document.querySelectorAll('input[name="show"]');
		this.focus = false;

		this.state = 'welcome'; // welcome / highlight / inspect

		this.words = [];
		this.word_els = [];
		

		this.prepareText();

		this.annotation_list = [];

		this.bindEvents();
}

LitteraeApp.prototype.bindEvents = function() {
	var self = this;
	this.btn_marker.addEventListener('click', function(e) {
		var on = self.btn_marker.classList.toggle('active');
		if (on) {
			self.setState('highlight');
		} else {
			self.setState('inspect');
		}
	});

    this.text.addEventListener('mouseup', function(e) {
		if (self.state != 'highlight') return;
		var sel = document.getSelection();
		if (sel.type != 'Range') return; // ignore Caret, None
		
		// make a,b the word id's where the selection starts,ends respectively
		var ids = [ parseInt(sel.anchorNode.parentElement.id.substr(1)), 
		            parseInt(sel.focusNode.parentElement.id.substr(1)) ].sort();
		
		self.highlight(ids[0], ids[1]);
    });

	this.text.addEventListener('dblclick', function(e) {
		if(e.target.tagName === 'SPAN') {

		}		
	});

	/* 
	this.text.addEventListener('mouseover', function(e) {
			if(e.target.tagName === 'SPAN' && self.focus === false) {
				var all_annotations = document.getElementById('all-annotations');
				all_annotations.style.display = 'block';
				var welcome = document.getElementById('welcome');
				welcome.style.display = 'none';
				var selectedWord = e.target.innerHTML.trim();
				var selectedIdx = e.target.id.substr(1);

				var lineHeight = parseFloat(window.getComputedStyle(self.text, null).getPropertyValue('line-height'));
				var lineNumber = parseInt(e.target.offsetTop/lineHeight) + 1;
				show_annotations(self.annotation_list, e.target.id.substr(1));
				populateWithSelection(lineNumber, selectedWord, selectedIdx);
			}		
	});
	*/

	var save_validation = function(e) {
		var radios = document.querySelectorAll('input[type="radio"]:checked');
			var value = radios.length;

			var annotation = document.getElementById('new-annotation-text');
			if (value === 2 && annotation.value.length > 0){
				document.getElementById('save-add').disabled = false;
			}
			else {
				document.getElementById('save-add').disabled = true;
			}
		};

	this.new_annotation.addEventListener('keyup', save_validation);
	this.new_annotation.addEventListener('click', save_validation);

	var clear_add_input = function() {
		document.getElementById('new-annotation-text').value = '';
		var radios = document.querySelectorAll('input[type="radio"]:checked');
		for (var i = 0; i < radios.length; i++) {
			radios[i].checked = false;
		}
	};

	this.cancel_add.addEventListener('click', function(e) {
		self.focus = false;
		var new_annotation = document.getElementById('new-annotation');
		new_annotation.style.display = 'none';
		var welcome = document.getElementById('welcome');
		welcome.style.display = 'block';

		clear_add_input();
	});

	this.save_add.addEventListener('click', function(e) {
		var idx = document.getElementsByClassName('selected-text')[0].getAttribute('idx');
		var annotation_text = document.getElementById('new-annotation-text').value;
		var category = document.querySelectorAll('input[name="category"]:checked')[0].id.substr(2);
		var visibility = document.querySelectorAll('input[name="visibility"]:checked')[0].id.substr(2);
		self.annotation_list.push([idx, annotation_text, category, visibility]);
		var span = document.getElementById('w' + idx);
		document.getElementById('c0'+visibility).checked = true;
		span.classList.add('annotated');
		span.classList.remove('highlight');
		clear_add_input();
		var new_annotation = document.getElementById('new-annotation');
		new_annotation.style.display = 'none';
		document.getElementById('w'+idx).click();
		self.focus = false;
	});

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

	var filter = function(e, annotation_list) {
		var change = e.target.id.substr(2);
		for (var i = 0; i < annotation_list.length; i++) {
			var annotation = annotation_list[i];
			if (annotation[3] == change) {
				document.getElementById('w'+annotation[0]).classList.toggle('annotated');
			}
		}
	}

	for(var i = 0; i < this.filters.length; i++) {
		this.filters[i].addEventListener('change', function(e) {
			filter(e, self.annotation_list);
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
		span.addEventListener('click', function() {self.inspect(i);})
		self.word_els[i] = span;
        this.text.appendChild(span);
	})(i)}
}

/*
* Opens all annotations for one word, with word ID 'wid'.
 */
LitteraeApp.prototype.inspect = function(wid) {
	console.log('inspect word '+wid);

	this.focus = true;

	Utils.show(document.getElementById('all-annotations'));
	Utils.hide(document.getElementById('welcome'));
	
	var no_annotations = true;
	var categories = document.getElementsByClassName('category');
	for (var i = 0; i < categories.length; i++) {
		categories[i].querySelectorAll('div')[0].innerHTML = '';
	}
	for (var i = 0; i < this.annotation_list.length; i++) {
		if (parseInt(this.annotation_list[i][0]) === wid) {
			no_annotations = false;
			var category = this.annotation_list[i][2];
			if (document.getElementById('c0'+this.annotation_list[i][3]).checked) {
				var annotation_text = this.annotation_list[i][1];
				var categories = document.getElementsByClassName('category');
				var add_this = document.createElement('div')
				add_this.classList.add('annotation');
				var info = document.createElement('div');
				info.classList.add('annotation-info');
				var edit = document.createElement('button');
				edit.innerHTML = 'Edit';
				info.append(edit);
				var text = document.createElement('div');
				text.classList.add('annotation-text');
				text.innerHTML = annotation_text;
				add_this.append(info);
				add_this.append(text);
				categories[category].querySelectorAll('div')[0].append(add_this);
			}
		}
	}
	if (no_annotations) Utils.show(document.getElementById('welcome'));

	var no_annotations = true;
	Utils.show(document.getElementById('all-annotations'));

	var categories = document.getElementsByClassName('category');
	category_annotations = [];
	for (var i = 0; i < categories.length; i++) {
		categories[i].querySelectorAll('div')[0].innerHTML = '';
		category_annotations[i] = this.annotation_list.filter(function(annotation) {
			return annotation[2] == i && annotation[0] == wid;
		});
		if (category_annotations[i].length > 0) {
			categories[i].getElementsByClassName("annotation-count")[0].innerHTML = " - " + category_annotations[i].length;
		} else {
			categories[i].getElementsByClassName("annotation-count")[0].innerHTML = "";
		}
	}
	for (var i = 0; i < this.annotation_list.length; i++) {
		if (parseInt(this.annotation_list[i][0]) === parseInt(wid)) {
			no_annotations = false;
			var category = this.annotation_list[i][2];
			if (document.getElementById('c0'+this.annotation_list[i][3]).checked) {
				var annotation_text = this.annotation_list[i][1];
				var categories = document.getElementsByClassName('category');
				var add_this = document.createElement('div')
				add_this.classList.add('annotation');
				add_this.classList.add('c0'+this.annotation_list[i][3]+"-annotation");
				var info = document.createElement('div');
				info.classList.add('annotation-info');
				var edit = document.createElement('button');
				edit.innerHTML = 'Edit';
				edit.classList.add("edit-button");
				info.innerHTML = 'Added by Ben';
				info.prepend(edit);
				var text = document.createElement('div');
				text.classList.add('annotation-text');
				text.innerHTML = annotation_text;
				add_this.append(info);
				add_this.append(text);
				categories[category].querySelectorAll('div')[0].append(add_this);

			}
		}
	}
	Utils.hide(document.getElementById('welcome'));

	this.populateWithSelection(wid);
}

LitteraeApp.prototype.newAnnotation = function(wid) {
	this.focus = true;
	Utils.show(document.getElementById('new-annotation'));
	Utils.hide(document.getElementById('welcome'));
	
	this.populateWithSelection(wid);
}

LitteraeApp.prototype.populateWithSelection = function(wid) {
	var lineNumField = document.getElementsByClassName('selected-line-num');
	var selectedField = document.getElementsByClassName('selected-text');
	var lineNumber = this.getLineNumber(wid);
	for (var i = 0; i < lineNumField.length; i++) {
		lineNumField[i].innerHTML = lineNumber;
	}
	for (var i = 0; i < selectedField.length; i++) {
		selectedField[i].setAttribute('idx', wid);
		selectedField[i].innerHTML  = this.words[wid];
	}  	
}

/*
* Set the application state
*/
LitteraeApp.prototype.setState = function(state) {
	if (['welcome','highlight','inspect'].indexOf(state)<0) return;
	this.state = state;
	this.clearHighlights();
}

/*
* Highlight the range [w1, w2] in the text.
*/
LitteraeApp.prototype.highlight = function(w1, w2) {
	//get or create highlight span
	var h = document.getElementById('highlight') || document.createElement('span');
	h.id = 'highlight';
	h.classList.add('highlight');

	//unwrap it
	while (h.firstChild) h.parentNode.insertBefore(h.firstChild, h);

	// position highlight span
	this.text.insertBefore(h, document.getElementById('w'+w1));

	// move all words into highlight span
	for (var w = w1; w<=w2; w++) h.appendChild(document.getElementById('w'+w));

	document.getSelection().removeAllRanges();

	this.newAnnotation(w1);
}
LitteraeApp.prototype.clearHighlights = function() {
	//get or create highlight span
	var h = document.getElementById('highlight');
	if (!h) return;

	//unwrap it
	while (h.firstChild) h.parentNode.insertBefore(h.firstChild, h);

	h.remove();
}

LitteraeApp.prototype.getLineNumber = function(wid) {
    var lineHeight = parseFloat(window.getComputedStyle(this.text, null).getPropertyValue('line-height'));
	var lineNumber = parseInt(this.word_els[wid].offsetTop/lineHeight) + 1;
	return lineNumber;
}