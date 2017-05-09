function getCannedCurrentUser() {
    var u = new User();
	u.name = 'Ben Bitdiddle';
	u.isInstructor = true;
    return u;
}

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

function getCannedGroups() {
    var i1 = new User();
    i1.name = "Prof. Frampton";
    i1.isinstructor = true;

    var u1 = new User();
    u1.name = "Sarah Shader";

    var u2 = new User();
    u2.name = "Lisandro Jimenez Leon";

    var u3 = new User();
    u3.name = "Leopoldo Calderas";
    
    var u4 = new User();
    u4.name = "Joren Lauwers";
  
    var t1 = new Text();
    t1.id = 0;
    t1.title = 'C. IVLI CAESARIS COMMENTARIORVM DE BELLO GALLICO LIBER PRIMVS';
    t1.content = "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur. Hi omnes lingua, institutis, legibus inter se differunt. Gallos ab Aquitanis Garumna flumen, a Belgis Matrona et Sequana dividit. Horum omnium fortissimi sunt Belgae, propterea quod a cultu atque humanitate provinciae longissime absunt, minimeque ad eos mercatores saepe commeant atque ea quae ad effeminandos animos pertinent important, proximique sunt Germanis, qui trans Rhenum incolunt, quibuscum continenter bellum gerunt. Qua de causa Helvetii quoque reliquos Gallos virtute praecedunt, quod fere cotidianis proeliis cum Germanis contendunt, cum aut suis finibus eos prohibent aut ipsi in eorum finibus bellum gerunt. Eorum una pars, quam Gallos obtinere dictum est, initium capit a flumine Rhodano, continetur Garumna flumine, Oceano, finibus Belgarum, attingit etiam ab Sequanis et Helvetiis flumen Rhenum, vergit ad septentriones. Belgae ab extremis Galliae finibus oriuntur, pertinent ad inferiorem partem fluminis Rheni, spectant in septentrionem et orientem solem. Aquitania a Garumna flumine ad Pyrenaeos montes et eam partem Oceani quae est ad Hispaniam pertinet; spectat inter occasum solis et septentriones.";

    var t2 = new Text();
    t2.id = 1;
    t2.title = 'P. VERGILI MARONIS AENEIDOS LIBER PRIMVS';
    t2.content = "Arma virumque canō, Trōiae quī prīmus ab orīs Ītaliam, fātō profugus, Lāvīniaque vēnit lītora, multum ille et terrīs iactātus et altō vī superum saevae memorem Iūnōnis ob īram; multa quoque et bellō passūs, dum conderet urbem, inferretque deōs Latiō, genus unde Latīnum, Albānīque patrēs, atque altae moenia Rōmae. Mūsa, mihī causās memorā, quō nūmine laesō, quidve dolēns, rēgīna deum tot volvere cāsūs īnsīgnem pietāte virum, tot adīre labōrēs impulerit. Tantaene animīs caelestibus īrae?";
    
    var t3 = new Text();
    t3.id = 2;
    t3.title = "C. PLINIUS TACITO SUO S.";
    t3.content = "1 Ais te adductum litteris quas exigenti tibi de morte avunculi mei scripsi, cupere cognoscere, quos ego Miseni relictus — id enim ingressus abruperam — non solum metus verum etiam casus pertulerim. Quamquam animus meminisse horret, ... incipiam.' 2 Profecto avunculo ipse reliquum tempus studiis — ideo enim remanseram — impendi; mox balineum cena somnus inquietus et brevis. 3 Praecesserat per multos dies tremor terrae, minus formidolosus quia Campaniae solitus; illa vero nocte ita invaluit, ut non moveri omnia sed verti crederentur. 4 Irrupit cubiculum meum mater; surgebam invicem, si quiesceret excitaturus. Resedimus in area domus, quae mare a tectis modico spatio dividebat. 5 Dubito, constantiam vocare an imprudentiam debeam — agebam enim duodevicensimum annum -: posco librum Titi Livi, et quasi per otium lego atque etiam ut coeperam excerpo. Ecce amicus avunculi qui nuper ad eum ex Hispania venerat, ut me et matrem sedentes, me vero etiam legentem videt, illius patientiam securitatem meam corripit. Nihilo segnius ego intentus in librum. 6 Iam hora diei prima, et adhuc dubius et quasi languidus dies. Iam quassatis circumiacentibus tectis, quamquam in aperto loco, angusto tamen, magnus et certus ruinae metus. 7 Tum demum excedere oppido visum; sequitur vulgus attonitum, quodque in pavore simile prudentiae, alienum consilium suo praefert, ingentique agmine abeuntes premit et impellit. 8 Egressi tecta consistimus. Multa ibi miranda, multas formidines patimur. Nam vehicula quae produci iusseramus, quamquam in planissimo campo, in contrarias partes agebantur, ac ne lapidibus quidem fulta in eodem vestigio quiescebant. 9 Praeterea mare in se resorberi et tremore terrae quasi repelli videbamus. Certe processerat litus, multaque animalia maris siccis harenis detinebat. Ab altero latere nubes atra et horrenda, ignei spiritus tortis vibratisque discursibus rupta, in longas flammarum figuras dehiscebat; fulguribus illae et similes et maiores erant. 10 Tum vero idem ille ex Hispania amicus acrius et instantius 'Si frater' inquit 'tuus, tuus avunculus vivit, vult esse vos salvos; si periit, superstites voluit. Proinde quid cessatis evadere?' Respondimus non commissuros nos ut de salute illius incerti nostrae consuleremus. 11 Non moratus ultra proripit se effusoque cursu periculo aufertur. Nec multo post illa nubes descendere in terras, operire maria; cinxerat Capreas et absconderat, Miseni quod procurrit abstulerat. 12 Tum mater orare hortari iubere, quoquo modo fugerem; posse enim iuvenem, se et annis et corpore gravem bene morituram, si mihi causa mortis non fuisset. Ego contra salvum me nisi una non futurum; dein manum eius amplexus addere gradum cogo. Paret aegre incusatque se, quod me moretur. 13 Iam cinis, adhuc tamen rarus. Respicio: densa caligo tergis imminebat, quae nos torrentis modo infusa terrae sequebatur. 'Deflectamus' inquam 'dum videmus, ne in via strati comitantium turba in tenebris obteramur.' 14 Vix consideramus, et nox — non qualis illunis aut nubila, sed qualis in locis clausis lumine exstincto. Audires ululatus feminarum, infantum quiritatus, clamores virorum; alii parentes alii liberos alii coniuges vocibus requirebant, vocibus noscitabant; hi suum casum, illi suorum miserabantur; erant qui metu mortis mortem precarentur; 15 multi ad deos manus tollere, plures nusquam iam deos ullos aeternamque illam et novissimam noctem mundo interpretabantur. Nec defuerunt qui fictis mentitisque terroribus vera pericula augerent. Aderant qui Miseni illud ruisse illud ardere falso sed credentibus nuntiabant. 16 Paulum reluxit, quod non dies nobis, sed adventantis ignis indicium videbatur. Et ignis quidem longius substitit; tenebrae rursus cinis rursus, multus et gravis. Hunc identidem assurgentes excutiebamus; operti alioqui atque etiam oblisi pondere essemus. 17 Possem gloriari non gemitum mihi, non vocem parum fortem in tantis periculis excidisse, nisi me cum omnibus, omnia mecum perire misero, magno tamen mortalitatis solacio credidissem. 18 Tandem illa caligo tenuata quasi in fumum nebulamve discessit; mox dies verus; sol etiam effulsit, luridus tamen qualis esse cum deficit solet. Occursabant trepidantibus adhuc oculis mutata omnia altoque cinere tamquam nive obducta. 19 Regressi Misenum curatis utcumque corporibus suspensam dubiamque noctem spe ac metu exegimus. Metus praevalebat; nam et tremor terrae perseverabat, et plerique lymphati terrificis vaticinationibus et sua et aliena mala ludificabantur. 20 Nobis tamen ne tunc quidem, quamquam et expertis periculum et exspectantibus, abeundi consilium, donec de avunculo nuntius. Haec nequaquam historia digna non scripturus leges et tibi scilicet qui requisisti imputabis, si digna ne epistula quidem videbuntur. Vale.";
    
    var g1 = new Group();
    g1.name = "Harvard Latin 2";
    g1.instructor = i1;
    g1.members.push(u1, u2, u3, u4);
    g1.texts.push(t1, t2, t3);

    var g2 = new Group();
    g2.name = "Harvard Latin 3";
    g2.instructor = i1;
    g2.members.push(u1, u2, u3, u4);
    g2.texts.push(t2, t3, t1);

    var g3 = new Group();
    g3.name = "MIT Latin - Group 1";
    g3.instructor = i1;
    g3.members.push(u1, u2, u3, u4);
    g3.texts.push(t3, t1, t2);

    return [g1,g2,g3];
}
