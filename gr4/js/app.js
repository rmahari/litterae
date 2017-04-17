function LitteraeApp(el) {
		this.el = el;
		this.btn_marker = document.getElementById('btn-marker');
		this.source_text = document.getElementById('text');
		this.new_annotation = document.getElementById('new-annotation');
		this.cancel_add = document.getElementById('cancel-add');
		this.save_add = document.getElementById('save-add');
		this.category_dropdowns = document.getElementsByClassName('category'); 

		var words = this.source_text.innerHTML.split(' ');
		this.source_text.innerHTML = '';
		for (var i = 0; i < words.length; i++) {
			this.source_text.innerHTML += '<span idx='+i+'>'+words[i]+'</span>'+ ' ';
		};

		this.annotation_list = [];

		this.bindEvents();
}

LitteraeApp.prototype.bindEvents = function() {
		var self = this;
		this.btn_marker.addEventListener('click', function(e) {
				self.btn_marker.classList.toggle('active');
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

		this.source_text.addEventListener('dblclick', function(e) {
				if(e.target.tagName === 'SPAN') {
					var new_annotation = document.getElementById('new-annotation');
					new_annotation.style.display = 'block';
					var welcome = document.getElementById('welcome');
					welcome.style.display = 'none';

					var selectedWord = e.target.innerHTML.trim();
					var selectedIdx = e.target.getAttribute('idx');
					var lineHeight = parseFloat(window.getComputedStyle(self.source_text, null).getPropertyValue('line-height'));
					var lineNumber = parseInt(e.offsetY/lineHeight) + 1;

					populateWithSelection(lineNumber, selectedWord, selectedIdx);
				}		
		});

		this.source_text.addEventListener('click', function(e) {
				if(e.target.tagName === 'SPAN') {
					var all_annotations = document.getElementById('all-annotations');
					all_annotations.style.display = 'block';
					var welcome = document.getElementById('welcome');
					welcome.style.display = 'none';

					var selectedWord = e.target.innerHTML.trim();

					var lineHeight = parseFloat(window.getComputedStyle(self.source_text, null).getPropertyValue('line-height'));
					var lineNumber = parseInt(e.offsetY/lineHeight) + 1;

					show_annotations(self.annotation_list, e.target.getAttribute('idx'));
					populateWithSelection(lineNumber, selectedWord);
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
				var new_annotation = document.getElementById('new-annotation');
				new_annotation.style.display = 'none';
				var welcome = document.getElementById('welcome');
				welcome.style.display = 'block';

				clear_add_input();

		});

		this.save_add.addEventListener('click', function(e) {
			var idx = document.getElementsByClassName('selected-text')[0].getAttribute('idx');
			var annotation_text = document.getElementById('new-annotation-text').value;
			var category = document.querySelectorAll('input[name="category"]:checked')[0].id;
			var visibility = document.querySelectorAll('input[name="visibility"]:checked')[0].id;
			self.annotation_list.push([idx, annotation_text, category, visibility]);
			var span = document.querySelector('span[idx="'+idx+'"]');
			span.classList.add('annotated');
			clear_add_input();
			var new_annotation = document.getElementById('new-annotation');
			new_annotation.style.display = 'none';
			self.source_text.querySelectorAll('span[idx="'+idx+'"]')[0].click();

		});

		for (var i = 0; i < this.category_dropdowns.length; i ++) {
			this.category_dropdowns[i].addEventListener('click', function(e) {
				var annotations = this.children[0];
				if (annotations.style.display === 'none') {
					annotations.style.display = 'block';
				} else {
					annotations.style.display = 'none';
				}
			});
		};

	var show_annotations = function(annotation_list, idx) {
		var no_annotations = true;
		document.getElementById('all-annotations').style.display = 'block';
		var categories = document.getElementsByClassName('category');
		for (var i = 0; i < categories.length; i++) {
			categories[i].children[0].innerHTML = '';
		}
		for (var i = 0; i < annotation_list.length; i++) {
			if (parseInt(annotation_list[i][0]) === parseInt(idx)) {
				no_annotations = false;
				var category = annotation_list[i][2];
				var annotation_text = annotation_list[i][1];
				var categories = document.getElementsByClassName('category');
				var add_this = document.createElement('div')
				add_this.classList.add('annotation');
				var info = document.createElement('div');
				info.classList.add('annotation-info');
				var text = document.createElement('div');
				text.classList.add('annotation-text');
				text.innerHTML = annotation_text;
				add_this.append(info);
				add_this.append(text);
				categories[category[1]].children[0].append(add_this);
			}
		}
		if (no_annotations) this.welcome.style.display = 'block';
	}
}