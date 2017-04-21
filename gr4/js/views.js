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
