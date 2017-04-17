function LitteraeApp(el) {
    this.el = el;
    this.btn_marker = document.getElementById('btn-marker');
    this.source_text = document.getElementById('text');
    this.new_annotation = document.getElementById('new-annotation');
    this.cancel_add = document.getElementById('cancel-add');

    this.bindEvents();
}

LitteraeApp.prototype.bindEvents = function() {
    var self = this;
    this.btn_marker.addEventListener('click', function(e) {
        self.btn_marker.classList.toggle('active');
    });

    this.source_text.addEventListener('dblclick', function(e) {
    		var new_annotation = document.getElementById('new-annotation');
    		new_annotation.style.display = 'block';
    		var welcome = document.getElementById('welcome');
    		welcome.style.display = 'none';

    		var selectedWord = (document.selection && document.selection.createRange().text) ||
             (window.getSelection && window.getSelection().toString());

      	var lineHeight = parseFloat(window.getComputedStyle(self.source_text, null).getPropertyValue('line-height'));
  			var lineNumber = parseInt(e.offsetY/lineHeight) + 1;

  			var lineNumField = document.getElementById('selected-line-num');
  			var selectedField = document.getElementById('selected-text');
  			lineNumField.innerHTML = lineNumber;
  			selectedField.innerHTML  = selectedWord;
    });

    var save_validation = function(e) {
    	var radios = document.querySelectorAll('input[type="radio"]:checked');
				var value = radios.length;

				var annotation = document.getElementById('annotation');
				if (value === 2 && annotation.value.length > 0){
					document.getElementById('save-add').disabled = false;
				}
				else {
					document.getElementById('save-add').disabled = true;
				}
    	};

    this.new_annotation.addEventListener('keyup', save_validation);
    this.new_annotation.addEventListener('click', save_validation);

    this.cancel_add.addEventListener('click', function(e) {
    	  var new_annotation = document.getElementById('new-annotation');
    		new_annotation.style.display = 'none';
    		var welcome = document.getElementById('welcome');
    		welcome.style.display = 'block';

    		document.getElementById('annotation').value = '';
    		var radios = document.querySelectorAll('input[type="radio"]:checked');
    		for (var i = 0; i < radios.length; i++) {
    			radios[i].checked = false;
    		}
    });

}