function AnnotationView(annotation) {
    this.annotation = annotation;

    var template = document.getElementById('tpl-annotation');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_text   = this.el.getElementsByClassName('text')[0];
    this.el_author = this.el.getElementsByClassName('author')[0];
    this.el_edit   = this.el.getElementsByClassName('edit')[0];

    this.el_edit.addEventListener('click', this.edit_click.bind(this));

    this.update();
}
AnnotationView.prototype.update = function() {
    Utils.setText(this.el_text,   this.annotation.text);
    Utils.setText(this.el_author, this.annotation.author.name);

    this.el.classList.remove('c00-annotation', 'c01-annotation', 'c02-annotation', 'c03-annotation');
    this.el.classList.add('c0' + this.annotation.visibility + "-annotation");
}
AnnotationView.prototype.edit_click = function(e) {
    //TO-DO: add edit functionality
    console.log('edit!');
    e.stopPropagation();
    return false;
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