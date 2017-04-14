function LitteraeApp(el) {
    this.el = el;
    this.btn_marker = document.getElementById('btn-marker');

    this.bindEvents();
}

LitteraeApp.prototype.bindEvents = function() {
    var self = this;
    this.btn_marker.addEventListener('click', function(e) {
        self.btn_marker.classList.toggle('active');
    });
}