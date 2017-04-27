function AnnotationView(annotation) {
    this.annotation = annotation;

    var template = document.getElementById('tpl-annotation');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_text   = this.el.getElementsByClassName('text')[0];
    this.el_author = this.el.getElementsByClassName('author')[0];
    this.el_edit   = this.el.getElementsByClassName('edit')[0];

    this.el_edit.addEventListener('click', this.edit.bind(this));

    this.annotation.on('update', this.update.bind(this));
    this.update();
}
AnnotationView.prototype.update = function() {
    Utils.setText(this.el_text,   this.annotation.text);
    Utils.setText(this.el_author, this.annotation.author.name);

    this.el.classList.remove('c00-annotation', 'c01-annotation', 'c02-annotation', 'c03-annotation');
    this.el.classList.add('c0' + this.annotation.visibility + "-annotation");
}
AnnotationView.prototype.edit = function(e) {
    app.edit(this.annotation);
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
    this.els_visibility = this.el.getElementsByClassName('visibility');

    //events
    this.el_save.addEventListener('click', this.save.bind(this));
    this.el_cancel.addEventListener('click', this.cancel.bind(this));


   	this.el_text.addEventListener('keyup', this.validate.bind(this));
	this.el.addEventListener('click', this.validate.bind(this));

    this.eventhost = new Utils.EventHost(this);

    this.annotation.on('update', this.update.bind(this));
    this.update();
}

AnnotationEditView.prototype.validate = function() {
    var valid = this.el_form.elements['visibility'].value &&
                this.el_form.elements['category'].value &&
                this.el_text.value.length > 0;

    this.el_save.disabled = !valid;
    return valid;
}
AnnotationEditView.prototype.update = function() {
    Utils.setText(this.el_pos, this.annotation.highlight.text());
    this.el_text.value = this.annotation.text;
    if (this.annotation.category != null) {
        this.els_category[this.annotation.category].checked = true;
    }
    if (this.annotation.visibility != null) {
        this.els_visibility[this.annotation.visibility].checked = true;
    }
}

AnnotationEditView.prototype.save = function() {
    if (!this.validate()) return;
    this.annotation.setText(this.el_text.value);
    this.annotation.setVisibility(this.el_form.elements['visibility'].value );
    this.annotation.setCategory(  this.el_form.elements['category'].value );
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
    for (var i=0; i<this.annotations.length; i++) {
        var view = new AnnotationView(this.annotations[i]);
        this.els_content[this.annotations[i].category].appendChild(view.el);
        counts[this.annotations[i].category] ++;
    }
    for (c = 0; c<this.els_content.length; c++) {
        Utils.setText(this.els_count[c], (counts[c] == 0) ? '' : '('+counts[c]+')');
        this.els_header[c].classList.toggle('empty', counts[c]==0);
    }
}