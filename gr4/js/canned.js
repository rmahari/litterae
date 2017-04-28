function getCannedAnnotations(me) {
    var l = [];

    var user1 = new User();
    user1.name = "Alyssa P. Hacker";

    var h1 = new Highlight();
    h1.addRange(3,5);
    var a1 = new Annotation(h1);
    a1.author = me;
    a1.setText('lorem ipsum dolor sit amet');
    a1.setCategory(0);

    var h2 = new Highlight();
    h2.addRange(10,15);
    var a2 = new Annotation(h2);
    a2.author = me;
    a2.setText('lipsum quid est in nostrem hallos intra nos muros');
    a2.setCategory(1);

    var h3 = new Highlight();
    h3.addRange(20,20);
    var a3 = new Annotation(h3);
    a3.author = me;
    a3.setText('lorem ipsum dolor sit amet lipsum quid est in nostrem hallos intra nos muros');
    a3.setCategory(2);

    var h4 = new Highlight();
    h4.addRange(30,33);
    var a4 = new Annotation(h4);
    a4.author = me;
    a4.setText('lorem ipsum dolor sit amet lipsum quid est in nostrem hallos intra nos muros');
    a4.setCategory(3);

    var h5 = new Highlight();
    h5.addRange(6,8);
    var a5 = new Annotation(h5);
    a5.author = user1;
    a5.setText('lorem ipsum dolor ed ist nos patribus non sic sit amet');
    a5.setCategory(0);

    var h6 = new Highlight();
    h6.addRange(21,25);
    var a6 = new Annotation(h6);
    a6.author = user1;
    a6.setText('lipsum quid est in nostrem roto non est persona non grata hallos intra nos muros');
    a6.setCategory(1);

    return [a1,a2,a3,a4,a5,a6];   
}