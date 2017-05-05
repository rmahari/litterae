/*
A PrintView represents the entire text from the LitteraeApp in a
paged, printable format. Each page fits just enough text, so that
the page gets filled with all the annotations that belong.
*/

function PrintView() {
    var self = this;

    //view state
    this.pages = [];

    //create the new window that hosts the printview
    printWindow = window.open('');
    printWindow.document.title = 'Litterae Print-out';

    //add the print stylesheet
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    var url = window.location.href;
    link.href = url.substring(0, url.lastIndexOf('/')) + '/css/print.css';
    printWindow.document.head.appendChild(link);

    setTimeout(function() {
        var lastPage = null;
        for (var w=0; w<app.words.length; w++) {
            // add each word to the page one by one. If the page is full,
            // remove it from the last page and create a new page.
            if (!lastPage || lastPage.full) {
                lastPage = new PrintPageView(w);
                printWindow.document.body.appendChild(lastPage.el);
                self.pages.push(lastPage);
            }
            lastPage.addWord();
            if (lastPage.overflows) {
                lastPage.removeLastWord();
                w --;
            }
        }
    }, 200); 
    // this is bad. Without a delay, the DOM in the new isn't ready,
    // and I can't seem to bind to onload/DOMContentReady/readystatechange
}

function PrintPageView(wid_start) {
    // state
    this.wid_start = wid_start;
    this.wid_end   = wid_start;
    this.overflows = false;
    this.full = false;

    // DOM
    var template = document.getElementById('tpl-print-page');
    this.el = template.firstElementChild.cloneNode(true);
    this.el_text =        this.el.getElementsByClassName('text')[0];
    this.el_annotations = this.el.getElementsByClassName('annotations')[0];
    this.word_els = [];

    this.annotationsView = new AnnotationListView();

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
    this.annotationsView.setList(app.annotation_list.filter(function(ann) {
        var inFragment = false;
        for (var w=self.wid_start; w<self.wid_end; w++) {
            inFragment |= ann.highlight.contains(w);
        }
        return inFragment && app.isVisible(ann); //TO-DO: do we actually wants this?
    }));

    var r = this.el.getBoundingClientRect();
    var h = parseInt(r.height);
    var w = parseInt(r.width);
    this.overflows = (h>0) && (w>0) && ( (h/w) > (11/8.5) );
    this.full |= this.overflows;
}