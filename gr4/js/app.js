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

		/*		var words = this.text.innerHTML.split(' ');
		this.text.innerHTML = '';
		for (var i = 0; i < words.length; i++) {
			this.text.innerHTML += '<span idx='+i+'>'+words[i]+'</span>'+ ' ';
		};
		*/

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

	var populateWithSelection = function(lineNumber, selectedWord, selectedIdx) {
		var lineNumField = document.getElementsByClassName('selected-line-num');
		var selectedField = document.getElementsByClassName('selected-text');
		for (var i = 0; i < lineNumField.length; i++) {
			lineNumField[i].innerHTML = lineNumber;
		}
		for (var i = 0; i < selectedField.length; i++) {
			selectedField[i].setAttribute('idx', selectedIdx);
			selectedField[i].innerHTML  = selectedWord;
		}  	
	};

	this.text.addEventListener('dblclick', function(e) {
			if(e.target.tagName === 'SPAN') {
				self.focus = true;
				var new_annotation = document.getElementById('new-annotation');
				new_annotation.style.display = 'block';
				var welcome = document.getElementById('welcome');
				welcome.style.display = 'none';

				var selectedWord = e.target.innerHTML.trim();
				var selectedIdx = e.target.id.substr(1);
				var lineHeight = parseFloat(window.getComputedStyle(self.text, null).getPropertyValue('line-height'));
				var lineNumber = parseInt(e.target.offsetTop/lineHeight) + 1;
				populateWithSelection(lineNumber, selectedWord, selectedIdx);
			}		
	});

	this.text.addEventListener('click', function(e) {
			if(e.target.tagName === 'SPAN') {
				self.focus = true;
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
					this.classList.add("expanded-dropdown");
					this.getElementsByClassName('dropdown-icon')[0].classList.add("rotated");
					annotations.style.display = 'block';
				} else {
					this.classList.remove("expanded-dropdown");
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
		category_annotations = [];
		for (var i = 0; i < categories.length; i++) {
			categories[i].querySelectorAll('div')[0].innerHTML = '';
			category_annotations[i] = annotation_list.filter(function(annotation) {
				return annotation[2] == i && annotation[0] == idx;
			});
			if (category_annotations[i].length > 0) {
				categories[i].classList.remove("disabled-dropdown");
				categories[i].getElementsByClassName("annotation-count")[0].innerHTML = " - " + category_annotations[i].length;
			} else {
				categories[i].classList.add("disabled-dropdown");
				categories[i].getElementsByClassName("annotation-count")[0].innerHTML = "";
			}
		}
		for (var i = 0; i < annotation_list.length; i++) {
			if (parseInt(annotation_list[i][0]) === parseInt(idx)) {
				no_annotations = false;
				var category = annotation_list[i][2];
				if (document.getElementById('c0'+annotation_list[i][3]).checked) {
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