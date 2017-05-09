function AnnotationView(annotation) {
    var self = this;
    this.annotation = annotation;

    var template = document.getElementById('tpl-annotation');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_nr     = this.el.getElementsByClassName('nr')[0];
    this.el_pos    = this.el.getElementsByClassName('pos')[0];
    this.el_text   = this.el.getElementsByClassName('text')[0];
    this.el_author = this.el.getElementsByClassName('author')[0];
    this.el_edit   = this.el.getElementsByClassName('edit')[0];
    this.el_delete = this.el.getElementsByClassName('delete')[0];
    this.el_mask   = this.el.getElementsByClassName('deleted-annotation')[0];
    this.el_undo   = this.el.getElementsByClassName('undo')[0];
    this.el_image  = this.el.getElementsByClassName('annotation-img')[0];

    this.el_edit.addEventListener('click', this.edit.bind(this));
    this.el_delete.addEventListener('click', this.delete.bind(this));
    this.el_undo.addEventListener('click', this.undo.bind(this));
    this.el.addEventListener('mouseover', function(){self.hover(true)});
    this.el.addEventListener('mouseout', function(){self.hover(false)});
    this.annotation.on('update', this.update.bind(this));
    this.update();
}
AnnotationView.prototype.update = function() {
    Utils.setText(this.el_pos,    this.annotation.highlight.text());
    Utils.setText(this.el_text,   this.annotation.text);
    Utils.setText(this.el_author, this.annotation.author.name);

    if (this.annotation.image_src !== null && this.annotation.category == 2) {
        this.el_image.src = this.annotation.image_src;
    }

    this.el.classList.remove('category-0', 'category-1', 'category-2', 'category-3');
    this.el.classList.add('category-' + this.annotation.category);
    this.el.classList.toggle('instructor', this.annotation.author.isInstructor);
}
AnnotationView.prototype.edit = function(e) {
    app.edit(this.annotation);
}
AnnotationView.prototype.delete = function() {
    this.hover(false);
    this.el_mask.classList.remove('default');
    app.delete(this.annotation);
}
AnnotationView.prototype.undo = function() {
    app.annotation_list.push(this.annotation);
    this.el_mask.classList.add('default');
    app.showAnnotationsOnText();
}
AnnotationView.prototype.hover = function(on) {
    var category = this.annotation.category;
    this.annotation.highlight.forEachWord(function(wid) {
        app.word_els[wid].classList.toggle('hovered', on);
        app.word_els[wid].classList.toggle('category-'+category, on);
    });
}

function AnnotationEditView(annotation) {
    this.annotation = annotation;

    var template = document.getElementById('tpl-annotation-edit');
    this.el = template.firstElementChild.cloneNode(true);

    this.el_pos = this.el.getElementsByClassName('pos')[0];
    this.el_text = this.el.getElementsByClassName('text')[0];
    this.el_save = this.el.getElementsByClassName('save')[0];
    this.el_cancel = this.el.getElementsByClassName('cancel')[0];
    this.el_form = this.el.getElementsByClassName('form')[0];
    this.els_category   = this.el.getElementsByClassName('category');
    this.el_file_upload = this.el.getElementsByClassName('file-upload')[0];
    this.el_uploaded_img = this.el.getElementsByClassName('uploaded-img')[0];

    //events
    this.el_save.addEventListener('click', this.save.bind(this));
    this.el_cancel.addEventListener('click', this.cancel.bind(this));

    this.els_category[0].addEventListener('click', this.otherRadioClick.bind(this));
    this.els_category[1].addEventListener('click', this.otherRadioClick.bind(this));
    this.els_category[2].addEventListener('click', this.mediaRadioClick.bind(this));
    this.els_category[3].addEventListener('click', this.otherRadioClick.bind(this));


   	this.el_text.addEventListener('keyup', this.validate.bind(this));
	this.el.addEventListener('click', this.validate.bind(this));
    this.el_file_upload.addEventListener("change", this.handleFileUpload(this));

    this.eventhost = new Utils.EventHost(this);

    this.annotation.on('update-highlight', this.updateHighlight.bind(this));
    this.update();
}

AnnotationEditView.prototype.mediaRadioClick = function() {
    this.el_file_upload.classList.add("visible");
    this.el_file_upload.classList.remove("hidden");
    this.el_uploaded_img.classList.add("visible");
    this.el_uploaded_img.classList.remove("hidden");

    if (this.el_uploaded_img.src.length === 0) {
        this.el_file_upload.required = true;
    } else {
        this.el_file_upload.required = false;
    }
}

AnnotationEditView.prototype.otherRadioClick = function() {
    this.el_file_upload.classList.remove("visible");
    this.el_file_upload.classList.add("hidden");
    this.el_uploaded_img.classList.remove("visible");
    this.el_uploaded_img.classList.add("hidden");
    this.el_file_upload.required = false;
}

AnnotationEditView.prototype.handleFileUpload = function (edit_view) {

    return_fn = function (evt) {
        var files = evt.target.files;
        if (files.length !== 1){
            return;
        }
        var img_file = files[0];

        var reader = new FileReader();
        reader.onload = (function (edit_view) {
            return function (e) {
                edit_view.el_uploaded_img.src = e.target.result;
                edit_view.validate();
            }
        })(edit_view);
        reader.readAsDataURL(img_file);
    }
    return return_fn;
}

AnnotationEditView.prototype.validate = function() {
    var valid = this.el_form.elements['category'].value &&
                this.el_text.value.length > 0;

    if (this.el_form.elements['category'].value == 2 && this.el_uploaded_img.src.length === 0) {
        valid = false;
    }

    this.el_save.classList.toggle("disabled", !valid);
    return valid;
}
AnnotationEditView.prototype.update = function() {
    this.el_text.value = this.annotation.text;
    if (this.annotation.category != null) {
        this.els_category[this.annotation.category].checked = true;
    }
    if (this.annotation.category == 2 && this.annotation.image_src !== null) {
        this.el_uploaded_img.src = this.annotation.image_src;
        this.mediaRadioClick();
    }
    this.updateHighlight();
}

AnnotationEditView.prototype.updateHighlight = function() {
    Utils.setText(this.el_pos, this.annotation.highlight.text());
}

AnnotationEditView.prototype.save = function() {
    if (!this.validate()) return;
    this.annotation.setText(this.el_text.value);
    this.annotation.setCategory(  this.el_form.elements['category'].value );
    if (this.el_uploaded_img.src.length > 0) {
        this.annotation.setImage(this.el_uploaded_img.src);
    }
    this.trigger('save');
}
AnnotationEditView.prototype.cancel = function() {
    this.trigger('cancel');
}

function AnnotationListView(annotations) {
    var self = this;

    // state
    this.annotations = annotations || [];
    
    // DOM elements
    var template = document.getElementById('tpl-annotationlist');
    this.el = template.firstElementChild.cloneNode(true);
    this.els_header  = this.el.getElementsByClassName('header');
    this.els_count   = this.el.getElementsByClassName('count');
    this.els_content = this.el.getElementsByClassName('content');

    // bind events
    for (var i=0; i<this.els_content.length; i++) {((i) => {
        this.els_header[i].addEventListener('click', function() {
            self.toggleCategory(i);
        });
    })(i)}

    this.update();
}
AnnotationListView.prototype.setList = function(annotations) {
    this.annotations = annotations;
    this.update();
}

AnnotationListView.prototype.toggleCategory = function(category) {
    if (!this.els_header[category].classList.contains("empty")) {
        var open = this.els_content[category].classList.toggle('open');
        this.els_header[category].classList.toggle('open', open);
    }
}
AnnotationListView.prototype.update = function() {
    var counts = [];
    for (var c=0; c<this.els_content.length; c++) {
        Utils.clearChildNodes(this.els_content[c]);
        counts[c] = 0;
    }
    
    var key = function(annotation) {return annotation.category*1e6 + annotation.highlight.anchor;}
    this.annotations.sort(function(ann1, ann2) {return key(ann1) - key(ann2);});

    for (var i=0; i<this.annotations.length; i++) {
        var view = new AnnotationView(this.annotations[i]);
        this.els_content[this.annotations[i].category].appendChild(view.el);
        Utils.setText(view.el_nr, i+1);
        counts[this.annotations[i].category] ++;
    }
    for (c = 0; c<this.els_content.length; c++) {
        Utils.setText(this.els_count[c], (counts[c] == 0) ? '' : '('+counts[c]+')');
        this.els_header[c].classList.toggle('empty', counts[c]==0);
    }
}