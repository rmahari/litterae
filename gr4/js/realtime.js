var socket = io();

function LitteraeRealtime(app) {
    socket.on('loadannotations', function(annotations) {
        console.log('loadannotations', annotations);
        for (id in annotations) {
            app.annotation_list.push(Annotation.unpack(annotations[id]));
        }
        app.showAnnotationsOnText();
    });

    app.on('newannotation', function(annotation) {
        socket.emit('newannotation', annotation.pack());
    });
    socket.on('newannotation', function(annotation) {
        console.log('newannotation', annotation);
        app.annotation_list.push(Annotation.unpack(annotation));
        app.showAnnotationsOnText();
    });

    app.on('deleteannotation', function(annotation) {
        socket.emit('deleteannotation', annotation.id);
    });
    socket.on('deleteannotation', function(aid) {
        for (var i=0; i<app.annotation_list.length; i++) {
            if (app.annotation_list[i].id == aid) {
                app.annotation_list.splice(i,1);
            }
        }
        app.showAnnotationsOnText();
    });

    app.on('editannotation', function(annotation) {
        socket.emit('editannotation', annotation.pack());
    });
    socket.on('editannotation', function(annotation) {
        for (var i=0; i<app.annotation_list.length; i++) {
            var ann = app.annotation_list[i];
            if (ann.id == annotation.id) {
                ann.applyEdits(Annotation.unpack(annotation));
            }
        }
        app.showAnnotationsOnText();
    });

    socket.emit('requestload');
}