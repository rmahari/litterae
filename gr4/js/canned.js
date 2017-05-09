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

function getCannedTexts() {
    var t1 = new Text();
    t1.id = 0;
    t1.title = 'C. IVLI CAESARIS COMMENTARIORVM DE BELLO GALLICO LIBER PRIMVS';
    t1.content = "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur. Hi omnes lingua, institutis, legibus inter se differunt. Gallos ab Aquitanis Garumna flumen, a Belgis Matrona et Sequana dividit. Horum omnium fortissimi sunt Belgae, propterea quod a cultu atque humanitate provinciae longissime absunt, minimeque ad eos mercatores saepe commeant atque ea quae ad effeminandos animos pertinent important, proximique sunt Germanis, qui trans Rhenum incolunt, quibuscum continenter bellum gerunt. Qua de causa Helvetii quoque reliquos Gallos virtute praecedunt, quod fere cotidianis proeliis cum Germanis contendunt, cum aut suis finibus eos prohibent aut ipsi in eorum finibus bellum gerunt. Eorum una pars, quam Gallos obtinere dictum est, initium capit a flumine Rhodano, continetur Garumna flumine, Oceano, finibus Belgarum, attingit etiam ab Sequanis et Helvetiis flumen Rhenum, vergit ad septentriones. Belgae ab extremis Galliae finibus oriuntur, pertinent ad inferiorem partem fluminis Rheni, spectant in septentrionem et orientem solem. Aquitania a Garumna flumine ad Pyrenaeos montes et eam partem Oceani quae est ad Hispaniam pertinet; spectat inter occasum solis et septentriones.";

    var t2 = new Text();
    t2.id = 1;
    t2.title = 'P. OVIDI NASONIS EPISTVLAE HEROIDVM';
    t2.content = "Mittor ad Alciden a coniuge conscia mentislittera si coniunx Deianira tua est.Gratulor Oechaliam titulis accedere nostris, victorem victae succubuisse queror. fama Pelasgiadas subito pervenit in urbes decolor et factis infitianda tuis, quem numquam Iuno seriesque inmensa laborum fregerit, huic Iolen inposuisse iugum. hoc velit Eurystheus, velit hoc germana Tonantis, laetaque sit vitae labe noverca tuae.at non ille velit, cui nox (si creditur) una non tanti, ut tantus conciperere, fuit. Plus tibi quam Iuno nocuit Venus: illa premendo sustulit, haec humili sub pede colla tenet. respice vindicibus pacatum viribus orbem, qua latam Nereus caerulus ambit humum. se tibi pax terrae, tibi se tuta aequora debent;implesti meritis Solis utramque domum. quod te laturum est, caelum prius ipse tulisti:     Hercule supposito sidera fulsit Atlans. quid nisi notitia est misero quaesita pudori,si cumulas sturpi facta priora nota?tene ferunt geminos pressisse tenaciter angues,cum tener in cunis iam Iove dignus eras? coepisti melius quam desinis; ultima primiscedunt: dissimiles hic vir et ille puer. quem non mille ferae, quem non Stheneleius hostis,non potuit Iuno vincere, vincit Amor. At bene nupta feror, quia nominer Herculis uxor,sitque socer, rapidis qui tonat altus equis. quam male inaequales veniunt ad aratra iuvenci,tam premitur magno coniuge nupta minor. non honor est sed onus species laesura ferentes:     siqua voles apte nubere, nube pari. vir mihi semper abest, et coniuge notior hospes     monstraque terribiles persequiturque feras. ipsa domo vidua votis operata pudicistorqueor, infesto ne vir ab hoste cadat; inter serpentes aprosque avidosque leonesiactor et haesuros terna per ora canes. me pecudum fibrae simulacraque inania somniominaque arcana nocte petita movent.aucupor infelix incertae murmura famae     speque timor dubia spesque timore cadit. mater abest queriturque deo placuisse potenti,nec pater Amphitryon nec puer Hyllus adest.arbiter Eurystheus astu Iunonis iniquaesentitur nobis iraque longa deae.Haec mihi ferre parum; peregrinos addis amores,et mater de te quaelibet esse potest. non ego Partheniis temeratam vallibus Augen     nec referam partus, Ormeni nympha, tuos; non tibi crimen erunt, Teuthrantia turba, sorores,quarum de populo nulla relicta tibi est. una, recens crimen, referetur adultera nobis,unde ego sum Lydo facta noverca Lamo. Maeandros, totiens qui terris errat in isdem,qui lassas in se saepe retorquet aquas, vidit in Herculeo suspensa monilia collo,     illo, cui caelum sarcina parva fuit. non puduit fortes auro cohibere lacertos     et solidis gemmas opposuisse toris? nempe sub his animam pestis Nemeaea lacertisedidit, unde umerus tegmina laevus habet.ausus es hirsutos mitra redimire capillos!aptior Herculeae populus alba comae. nec te Maeonia lascivae more puellaeincingi zona dedecuisse pudet? non tibi succurrit crudi Diomedis imago,efferus humana qui dape pavit equas? si te vidisset cultu Busiris in isto,huic victor victo nempe pudendus eras!detrahat Antaeus duro redimicula collo,ne pigeat molli succubuisse viro!Inter Ioniacas calathum tenuisse puellasdiceris et dominae pertimuisse minas. non fugis, Alcide, victricem mille laborumrasilibus calathis inposuisse manumcrassaque robusto deducis pollice fila     aequaque formosae pensa rependis erae? a! quotiens, digitis dum torques stamina duris,praevalidae fusos conminuere manus! [Crederis infelix scuticae tremefactis habenis     ante pedes dominae pertimuisse minas ...eximiis pompis, immania semina laudim]     factaque narrabas dissimulanda tibi:scilicet: immanes elisis faucibus hydrosinfantem caudis involuisse manum;ut Tegeaeus aper cupressifero Erymanthoincubet et vasto pondere laedat humum;non tibi Threiciis adfixa penatibus ora,non hominum pingues caede tacentur equae,prodigiumque triplex, armenti dives HiberiGeryones, quamvis in tribus unus erat; inque canes totidem trunco digestus ab unoCerberos implicitis angue minante comis; quaeque redundabat fecundo vulnere serpensfertilis et damnis dives ab ipsa suis,quique inter laevumque latus laevumque lacertumpraegrave conpressa fauce pependit onus,et male confisum pedibus formaque bimembripulsum Thessalicis agmen equestre iugis. Haec tu Sidonio potes insignitus amictudicere? non cultu lingua retenta silet? se quoque nympha tuis ornavit Dardanis armiset tulit a capto nota tropaea viro.i nunc, tolle animos et fortia gesta recense:  quo tu non esses, iure vir illa fuit. qua tanto minor es, quanto te, maxime rerum,quam quos vicisti, vincere maius erat. illi procedit rerum mensura tuarum, cede bonis: heres laudis amica tuae. o pudor! hirsuti costis exuta leonisaspera texerunt vellera molle latus! falleris et nescis: non sunt spolia illa leonis,sed tua, tuque feri";
    
    var t3 = new Text();
    t3.id = 2;
    t3.title = "C. PLINIUS TACITO SUO S.";
    t3.content = "1 Ais te adductum litteris quas exigenti tibi de morte avunculi mei scripsi, cupere cognoscere, quos ego Miseni relictus — id enim ingressus abruperam — non solum metus verum etiam casus pertulerim. Quamquam animus meminisse horret, ... incipiam.' 2 Profecto avunculo ipse reliquum tempus studiis — ideo enim remanseram — impendi; mox balineum cena somnus inquietus et brevis. 3 Praecesserat per multos dies tremor terrae, minus formidolosus quia Campaniae solitus; illa vero nocte ita invaluit, ut non moveri omnia sed verti crederentur. 4 Irrupit cubiculum meum mater; surgebam invicem, si quiesceret excitaturus. Resedimus in area domus, quae mare a tectis modico spatio dividebat. 5 Dubito, constantiam vocare an imprudentiam debeam — agebam enim duodevicensimum annum -: posco librum Titi Livi, et quasi per otium lego atque etiam ut coeperam excerpo. Ecce amicus avunculi qui nuper ad eum ex Hispania venerat, ut me et matrem sedentes, me vero etiam legentem videt, illius patientiam securitatem meam corripit. Nihilo segnius ego intentus in librum. 6 Iam hora diei prima, et adhuc dubius et quasi languidus dies. Iam quassatis circumiacentibus tectis, quamquam in aperto loco, angusto tamen, magnus et certus ruinae metus. 7 Tum demum excedere oppido visum; sequitur vulgus attonitum, quodque in pavore simile prudentiae, alienum consilium suo praefert, ingentique agmine abeuntes premit et impellit. 8 Egressi tecta consistimus. Multa ibi miranda, multas formidines patimur. Nam vehicula quae produci iusseramus, quamquam in planissimo campo, in contrarias partes agebantur, ac ne lapidibus quidem fulta in eodem vestigio quiescebant. 9 Praeterea mare in se resorberi et tremore terrae quasi repelli videbamus. Certe processerat litus, multaque animalia maris siccis harenis detinebat. Ab altero latere nubes atra et horrenda, ignei spiritus tortis vibratisque discursibus rupta, in longas flammarum figuras dehiscebat; fulguribus illae et similes et maiores erant. 10 Tum vero idem ille ex Hispania amicus acrius et instantius 'Si frater' inquit 'tuus, tuus avunculus vivit, vult esse vos salvos; si periit, superstites voluit. Proinde quid cessatis evadere?' Respondimus non commissuros nos ut de salute illius incerti nostrae consuleremus. 11 Non moratus ultra proripit se effusoque cursu periculo aufertur. Nec multo post illa nubes descendere in terras, operire maria; cinxerat Capreas et absconderat, Miseni quod procurrit abstulerat. 12 Tum mater orare hortari iubere, quoquo modo fugerem; posse enim iuvenem, se et annis et corpore gravem bene morituram, si mihi causa mortis non fuisset. Ego contra salvum me nisi una non futurum; dein manum eius amplexus addere gradum cogo. Paret aegre incusatque se, quod me moretur. 13 Iam cinis, adhuc tamen rarus. Respicio: densa caligo tergis imminebat, quae nos torrentis modo infusa terrae sequebatur. 'Deflectamus' inquam 'dum videmus, ne in via strati comitantium turba in tenebris obteramur.' 14 Vix consideramus, et nox — non qualis illunis aut nubila, sed qualis in locis clausis lumine exstincto. Audires ululatus feminarum, infantum quiritatus, clamores virorum; alii parentes alii liberos alii coniuges vocibus requirebant, vocibus noscitabant; hi suum casum, illi suorum miserabantur; erant qui metu mortis mortem precarentur; 15 multi ad deos manus tollere, plures nusquam iam deos ullos aeternamque illam et novissimam noctem mundo interpretabantur. Nec defuerunt qui fictis mentitisque terroribus vera pericula augerent. Aderant qui Miseni illud ruisse illud ardere falso sed credentibus nuntiabant. 16 Paulum reluxit, quod non dies nobis, sed adventantis ignis indicium videbatur. Et ignis quidem longius substitit; tenebrae rursus cinis rursus, multus et gravis. Hunc identidem assurgentes excutiebamus; operti alioqui atque etiam oblisi pondere essemus. 17 Possem gloriari non gemitum mihi, non vocem parum fortem in tantis periculis excidisse, nisi me cum omnibus, omnia mecum perire misero, magno tamen mortalitatis solacio credidissem. 18 Tandem illa caligo tenuata quasi in fumum nebulamve discessit; mox dies verus; sol etiam effulsit, luridus tamen qualis esse cum deficit solet. Occursabant trepidantibus adhuc oculis mutata omnia altoque cinere tamquam nive obducta. 19 Regressi Misenum curatis utcumque corporibus suspensam dubiamque noctem spe ac metu exegimus. Metus praevalebat; nam et tremor terrae perseverabat, et plerique lymphati terrificis vaticinationibus et sua et aliena mala ludificabantur. 20 Nobis tamen ne tunc quidem, quamquam et expertis periculum et exspectantibus, abeundi consilium, donec de avunculo nuntius. Haec nequaquam historia digna non scripturus leges et tibi scilicet qui requisisti imputabis, si digna ne epistula quidem videbuntur. Vale.";

    return [t1,t2,t3];
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
  
    var t = getCannedTexts();
    
    var g1 = new Group();
    g1.name = "Harvard Latin 2";
    g1.instructor = i1;
    g1.members.push(u1, u2, u3, u4);
    g1.texts.push(t[0], t[1], t[2]);

    var g2 = new Group();
    g2.name = "Harvard Latin 3";
    g2.instructor = i1;
    g2.members.push(u1, u2, u3, u4);
    g2.texts.push(t[1], t[2], t[0]);

    var g3 = new Group();
    g3.name = "MIT Latin - Group 1";
    g3.instructor = i1;
    g3.members.push(u1, u2, u3, u4);
    g3.texts.push(t[2], t[0], t[1]);

    return [g1,g2,g3];
}
