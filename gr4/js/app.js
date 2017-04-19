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
		this.selected_idx = [];

		this.prepareText();

		this.annotation_list = [];

		this.bindEvents();
}

LitteraeApp.prototype.bindEvents = function() {
	var self = this;
	this.btn_marker.addEventListener('click', function(e) {
			self.btn_marker.classList.toggle('active');
			self.btn_marker.style.opacity = "50%";
	});

    this.text.addEventListener('mouseup', function(e) {
		var sel = document.getSelection();
		if (sel.type != 'Range') return; // ignore Caret, None
		
		// make a,b the word id's where the selection starts,ends respectively
		var ids = [ parseInt(sel.anchorNode.parentElement.id.substr(1)), 
		            parseInt(sel.focusNode.parentElement.id.substr(1)) ].sort();
		
		self.annotate(ids[0], ids[1]);
    });

	var populateWithSelection = function(lineNums) {
		var selectedIdx = self.selected_idx;
		var lineNumField = document.getElementsByClassName('selected-line-num');
		var selectedField = document.getElementsByClassName('selected-text-annotation');
		for (var i = 0; i < lineNumField.length; i++) {
			lineNumField[i].innerHTML = lineNums;
			/*for (var j = 0; j < lineNums.length; j++) {
				var span = document.createElement('span');
				span.innerHTML = lineNums[j];
				lineNumField[i].appendChild(span);
			}*/
		}
		for (var i = 0; i < selectedField.length; i++) {
			selectedField[i].innerHTML = '';
			for (var j = 0; j < selectedIdx.length; j++) {
				var span = document.createElement('span');
				span.setAttribute('idx', selectedIdx[j]);
				span.innerHTML = document.getElementById('w'+selectedIdx[j]).innerHTML;
				selectedField[i].appendChild(span);
				selectedField[i].innerHTML += ' ';
			}
		}  	
	};

	var populateWithWord = function(lineNums, word, idx) {
		var lineNumField = document.getElementsByClassName('selected-line-num');
		var selectedField = document.getElementsByClassName('selected-text');
		for (var i = 0; i < lineNumField.length; i++) {
			lineNumField[i].innerHTML = lineNums;
			/*for (var j = 0; j < lineNums.length; j++) {
				var span = document.createElement('span');
				span.innerHTML = lineNums[j];
				lineNumField[i].appendChild(span);
			}*/
		}
		for (var i = 0; i < selectedField.length; i++) {
			selectedField[i].innerHTML = word;
			selectedField[i].setAttribute('idx', idx);
		}  	
	};

	this.text.addEventListener('dblclick', function(e) {
			if(e.target.tagName === 'SPAN') {
				self.focus = true;
				var new_annotation = document.getElementById('new-annotation');
				new_annotation.style.display = 'block';
				var welcome = document.getElementById('welcome');
				welcome.style.display = 'none';
				e.target.classList.add('highlight1');

				var selectedIdx = e.target.id.substr(1);
				self.selected_idx.push(selectedIdx);
				var lineHeight = parseFloat(window.getComputedStyle(self.text, null).getPropertyValue('line-height'));
				var lineNumber = parseInt(e.target.offsetTop/lineHeight) + 1;
				populateWithSelection(lineNumber);
				populateWithWord(lineNumber, e.target.innerHTML, selectedIdx);
			}		
	});

	this.text.addEventListener('click', function(e) {
			if(e.target.tagName === 'SPAN') {
					self.focus = true;
					if (document.getElementById('new-annotation').style.display == 'none') {
					var all_annotations = document.getElementById('all-annotations');
					all_annotations.style.display = 'block';
					var welcome = document.getElementById('welcome');
					welcome.style.display = 'none';
					var selectedWord = e.target.innerHTML.trim();
					var selectedIdx = e.target.id.substr(1);

					var lineHeight = parseFloat(window.getComputedStyle(self.text, null).getPropertyValue('line-height'));
					var lineNumber = parseInt(e.target.offsetTop/lineHeight) + 1;
					show_annotations(self.annotation_list, e.target.id.substr(1));
					populateWithWord(lineNumber, selectedWord, selectedIdx);
				}
			}		
	});

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
				populateWithWord(lineNumber, selectedWord, selectedIdx);
			}		
	});

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
		self.selected_idx = [];
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
		var annotation_text = document.getElementById('new-annotation-text').value;
		var category = document.querySelectorAll('input[name="category"]:checked')[0].id.substr(2);
		var visibility = document.querySelectorAll('input[name="visibility"]:checked')[0].id.substr(2);
		self.annotation_list.push([self.selected_idx.slice(0), annotation_text, category, visibility]);
		for (var i = 0; i < self.selected_idx.length; i ++) {
			var idx = self.selected_idx[i];
			var span = document.getElementById('w' + idx);
			document.getElementById('c0'+visibility).checked = true;
			span.classList.add('annotated');
			span.classList.remove('highlight1');
			span.classList.remove('highlight');
		}
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
	};

	var show_annotations = function(annotation_list, idx) {
		var no_annotations = true;
		document.getElementById('all-annotations').style.display = 'block';
		var categories = document.getElementsByClassName('category');
		for (var i = 0; i < categories.length; i++) {
			categories[i].querySelectorAll('div')[0].innerHTML = '';
		}
		for (var i = 0; i < annotation_list.length; i++) {
			if (annotation_list[i][0].indexOf(idx) > -1) {
				var category = annotation_list[i][2];
				if (document.getElementById('c0'+annotation_list[i][3]).checked) {
					no_annotations = false;
					var annotation_text = annotation_list[i][1];
					var categories = document.getElementsByClassName('category');
					var add_this = document.createElement('div')
					add_this.classList.add('annotation');
					add_this.classList.add('c0'+annotation_list[i][3]+"-annotation");
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
		if (no_annotations) this.welcome.style.display = 'block';
	};

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
    var src = this.text.innerText;
    var words = src.split(' ');
    Utils.clearChildNodes(this.text);
    for (var i=0; i<words.length; i++) {
        var span = document.createElement('span');
        span.id = "w"+i;
        span.appendChild(document.createTextNode(words[i]));
        this.text.appendChild(span);
        this.text.appendChild(document.createTextNode(' '));
    }
}

/*
* get interface ready to add annotation for range w1-w2
*/
LitteraeApp.prototype.annotate = function(w1, w2) {
	var els = document.getElementsByClassName('highlight');
	for (var i=els.length-1; i>=0; i--) { // backwards iteration over live nodelist
		els.item(i).classList.remove('highlight');
	}
	for (var w = w1; w<=w2; w++) {
		document.getElementById('w'+w).classList.add('highlight');
	}
	document.getSelection().removeAllRanges();
}