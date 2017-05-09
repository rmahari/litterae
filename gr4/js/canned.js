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
    a3.setImage("https://cdn.thinglink.me/api/image/743685285547606017/1024/10/scaletowidth");

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

    var h7 = new Highlight();
    h7.addRange(54,58);
    var a7 = new Annotation(h7);
    a7.author = me;
    a7.setText('non grata hallos intra nos muros');
    a7.setCategory(2);
    a7.setImage("https://upload.wikimedia.org/wikipedia/commons/b/ba/Map_Gallia_Tribes_Towns.png");

    var h8 = new Highlight();
    h8.addRange(94,98);
    var a8 = new Annotation(h8);
    a8.author = me;
    a8.setText('viv o tradio non est persona');
    a8.setCategory(2);
    a8.setImage("http://www.hellenism.net/images/ancient-greece.jpg");

    var h9 = new Highlight();
    h9.addRange(126,129);
    var a9 = new Annotation(h9);
    a9.author = me;
    a9.setText('ist nos patribus non sic sit amet');
    a9.setCategory(1);

    var h10 = new Highlight();
    h10.addRange(133,137);
    var a10 = new Annotation(h10);
    a10.author = me;
    a10.setText('hallos intra nos muros');
    a10.setCategory(0);

    return [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10];   
}