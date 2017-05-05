/*
right now, this is just experimental
*/

function createPrintWindow() {
    printWindow = window.open('');
    printWindow.document.addEventListener('readystatechange', function() {
        console.log('printwindow load', printWindow.document.readyState);
    });

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    var url = window.location.href;
    link.href = url.substring(0, url.lastIndexOf('/')) + '/css/print.css';
    printWindow.document.head.appendChild(link);
    printWindow.document.title = 'Litterae print-out';
    setTimeout(function() {
        var pages = [];
        var lastPage = null;
        for (var w=0; w<app.words.length; w++) {
            if (!lastPage || lastPage.full) {
                lastPage = new PrintPageView(w);
                printWindow.document.body.appendChild(lastPage.el);
                pages.push(lastPage);
            }
            lastPage.addWord();

            if (lastPage.overflows) {
                lastPage.removeLastWord();
                w --;
            }
        }
    }, 200);
}

function PrintPageView(wid_start) {
    this.word_els = [];
    this.wid_start = wid_start;
    this.wid_end   = wid_start;
    this.overflows = false;
    this.full = false;

    var template = document.getElementById('tpl-print-page');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_text =        this.el.getElementsByClassName('text')[0];
    this.el_annotations = this.el.getElementsByClassName('annotations')[0];

    this.annotations = []
    this.annotationsView = new AnnotationListView(this.annotations);

    this.el_annotations.appendChild(this.annotationsView.el);

}
PrintPageView.prototype.addWord = function() {
    var wid = this.wid_end; 
    this.wid_end ++;

    var span = document.createElement('span');
    span.appendChild(document.createTextNode(app.words[wid]));
    span.appendChild(document.createTextNode(' '));
    this.word_els.push(span);
    this.el_text.appendChild(span);

    this.update();
}
PrintPageView.prototype.removeLastWord = function() {
    this.wid_end --;
    this.el_text.lastChild.remove();

    this.update();
}
PrintPageView.prototype.update = function() {
    var self = this;
    this.annotations = app.annotation_list.filter(function(ann) {
        var inFragment = false;
        for (var w=self.wid_start; w<self.wid_end; w++) {
            inFragment |= ann.highlight.contains(w);
        }
        return inFragment && app.isVisible(ann); //TO-DO: do we actually wants this?
    });
    
    this.annotationsView.setList(this.annotations);

    var r = this.el.getBoundingClientRect();
    var h = parseInt(r.height);
    var w = parseInt(r.width);
    this.overflows = (h>0) && (w>0) && ( (h/w) > (11/8.5) );
    this.full |= this.overflows;
}