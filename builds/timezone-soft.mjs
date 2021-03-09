var seq = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    cache = seq.split("").reduce(function (n, o, e) {
  return n[o] = e, n;
}, {}),
    toAlphaCode = function toAlphaCode(n) {
  if (void 0 !== seq[n]) return seq[n];
  var o = 1,
      e = 36,
      t = "";

  for (; n >= e; n -= e, o++, e *= 36) {
  }

  for (; o--;) {
    var _o = n % 36;

    t = String.fromCharCode((_o < 10 ? 48 : 55) + _o) + t, n = (n - _o) / 36;
  }

  return t;
},
    fromAlphaCode = function fromAlphaCode(n) {
  if (void 0 !== cache[n]) return cache[n];
  var o = 0,
      e = 1,
      t = 36,
      r = 1;

  for (; e < n.length; o += t, e++, t *= 36) {
  }

  for (var _e = n.length - 1; _e >= 0; _e--, r *= 36) {
    var _t = n.charCodeAt(_e) - 48;

    _t > 10 && (_t -= 7), o += _t * r;
  }

  return o;
};

var encoding = {
  toAlphaCode: toAlphaCode,
  fromAlphaCode: fromAlphaCode
},
    symbols = function symbols(n) {
  var o = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");

  for (var e = 0; e < n.nodes.length; e++) {
    var t = o.exec(n.nodes[e]);

    if (!t) {
      n.symCount = e;
      break;
    }

    n.syms[encoding.fromAlphaCode(t[1])] = encoding.fromAlphaCode(t[2]);
  }

  n.nodes = n.nodes.slice(n.symCount, n.nodes.length);
};

var indexFromRef = function indexFromRef(n, o, e) {
  var t = encoding.fromAlphaCode(o);
  return t < n.symCount ? n.syms[t] : e + t + 1 - n.symCount;
},
    toArray = function toArray(n) {
  var o = [],
      e = function e(t, r) {
    var s = n.nodes[t];
    "!" === s[0] && (o.push(r), s = s.slice(1));
    var c = s.split(/([A-Z0-9,]+)/g);

    for (var _s = 0; _s < c.length; _s += 2) {
      var u = c[_s],
          i = c[_s + 1];
      if (!u) continue;
      var l = r + u;

      if ("," === i || void 0 === i) {
        o.push(l);
        continue;
      }

      var f = indexFromRef(n, i, t);
      e(f, l);
    }
  };

  return e(0, ""), o;
},
    unpack = function unpack(n) {
  var o = {
    nodes: n.split(";"),
    syms: [],
    symCount: 0
  };
  return n.match(":") && symbols(o), toArray(o);
};

var unpack_1 = unpack,
    unpack_1$1 = function unpack_1$1(n) {
  var o = n.split("|").reduce(function (n, o) {
    var e = o.split("¦");
    return n[e[0]] = e[1], n;
  }, {}),
      e = {};
  return Object.keys(o).forEach(function (n) {
    var t = unpack_1(o[n]);
    "true" === n && (n = !0);

    for (var _o2 = 0; _o2 < t.length; _o2++) {
      var r = t[_o2];
      !0 === e.hasOwnProperty(r) ? !1 === Array.isArray(e[r]) ? e[r] = [e[r], n] : e[r].push(n) : e[r] = n;
    }
  }), e;
};

var efrtUnpack_min = unpack_1$1;

var _data = "Africa/Abidjan¦a2bouake,daloa,san ped1t0yamoussouk1;g,ogo;ro;b0frica/timbuktu;idjan,obo|Africa/Accra¦a2gh1kumasi,ta0;koradi,male;!ana;ccra,tsiaman|Africa/Addis_Ababa¦addis ababa,dire dawa,mek'ele,nazret|Africa/Algiers¦a5b3c2dz,oran,s1t0;ebessa,iaret;etif,idi bel abbes;hlef,onstantine;a0iskra,lida,oumerdas;b ezzouar,tna;lg0nnaba;eria,iers|Africa/Asmara¦asmara|Africa/Asmera¦a0;frica/asma0sme0;ra|Africa/Bamako¦bamako|Africa/Bangui¦bangui|Africa/Banjul¦banjul,serekunda|Africa/Bissau¦b1g0;uinea b0w;issau|Africa/Blantyre¦blantyre,lilongwe,mzuzu|Africa/Brazzaville¦brazzaville,pointe noire|Africa/Bujumbura¦bujumbura|Africa/Cairo¦a4bani suwayf,c3damanhur,eg2giza,halw6i1kafr ad dawwar,luxor,new c3port said,qina,s0tanta,zagazig;hibin al kawm,ohag,uez;dku,smail6;!ypt;airo;l2s0;w0yut;an; 1exandr0;ia;fayyum,m0;a0inya;hallah al kubra,nsurah|Africa/Casablanca¦a9casablanca,f8kenit7m4oujda angad,rabat,sa2t0;angier,e0;ma5touan;fi,le0;! al jadida;a1ekn3o0;hammedia,rocco;!rrakesh;ra;es;gadir,l hoceima|Africa/Ceuta¦ceuta0;!melilla|Africa/Conakry¦c0;amayenne,onakry|Africa/Dakar¦dakar,pikine,t0;hies0ouba;! nones|Africa/Dar_es_Salaam¦arusha,d1m0tanga,zanzibar;beya,orogoro,wanza;ar es salaam,odoma|Africa/Djibouti¦djibouti|Africa/Douala¦b1douala,edea,gar2kousseri,loum,m0ngaoundere,yaounde;ar1okolo;a1ert0;oua;foussam,menda|Africa/El_Aaiun¦e0laayoune,western sahara;h,l aaiun|Africa/Freetown¦etc,freetown,greenwich standard time|Africa/Gaborone¦gaborone|Africa/Harare¦bulawayo,chitungwiza,har0mut0;are|Africa/Johannesburg¦bFcBdAeast londCjohannesIk8newcastEp7r6s2tembisa,uitenhage,v1w0za;elkom,itbank;anderbijlpark,ereeniging;ast,o0prings;uth0weto; africa0ern africa;! standard time,n;andBichards bay,oodepoort;aarl,ietermaritzAort elizabeth,retoria;lerk0ruger0;sdorp;iepsloot,urb5;a1enturi0;on;pe town,rletonvil0;le;enoni,loemfontein,o1rakp0;an;ks0tshabelo;burg|Africa/Juba¦juba,s0winejok;outh sudan,s|Africa/Kampala¦kampala|Africa/Khartoum¦a7c5el 4k2ny3omdurm1port sud1s0wad medani;d,inga,ud0;an;ass0hartoum,osti;ala;dae3fasher,obeid;at,entral africa0;! time;d damaz0l qadarif;in|Africa/Kigali¦kigali|Africa/Kinshasa¦c3ki2m0;a0bandaka;sina,tadi;kwit,nshasa;d,ongo|Africa/Lagos¦aUbScReQgPiLjKkaIlGmDnBo8port harcourt,s7u6w0zarC;a4est0; africa0ern africa;! 0n;standard t0t0;ime;r9st,t;gep,muah5yo;a9hagamu,okoto;kFn1w0yo;er5o;do,itsha;g,iger0newi;ia;a0in5ubi;idugu0kurdi;ri;agos,ek0;ki;du0no,tsi0;na;imeEos;badan,jebu ode,k1l0seAwo;a orangun,esa,or6;eAi7ot ekp0;ene;ombe,usau;bute ikorodu,fon alaaye,nugu;alabar,hakwama;auchi,en0;in;b2do1ku0tani;re; ekiti;a,eoku1u0;ja;ta|Africa/Libreville¦libreville|Africa/Lome¦lome|Africa/Luanda¦huambo,l0n'dalatando;obito,uanda|Africa/Lubumbashi¦b3k2l1m0tshikapa;buji mayi,wene ditu;ikasi,ubumbashi;ananga,isanga1olwezi;e0ukavu;ni|Africa/Lusaka¦k0lusaka,ndola;ab0it0;we|Africa/Malabo¦malabo|Africa/Maputo¦beira,c4ma2na1quelimane,z0;imbabwe,w;ca1mpu1;puto,to0;la;entral africa time,himoio|Africa/Maseru¦maseru|Africa/Mbabane¦mbabane|Africa/Mogadishu¦berbera,hargeysa,jamaame,kismayo,m0;arka,ogadishu|Africa/Monrovia¦l0monrov1;iber0r;ia|Africa/Nairobi¦africa/asmera,e2kisumu,m1na0thika,yt;irobi,kuru;ayotte,ombasa;a0ldoret;st0t; africa0ern africa;! time,n|Africa/Ndjamena¦chad,n0td;'d0d0;jamena|Africa/Niamey¦niamey,zinder|Africa/Nouakchott¦nouakchott|Africa/Ouagadougou¦bobo dioulasso,ouagadougou|Africa/Porto-Novo¦abomey calavi,coton0djoug0porto novo;ou|Africa/Sao_Tome¦s0;ao tome,t|Africa/Timbuktu¦timbuktu|Africa/Tripoli¦a3benghazi,l1misrat4t0zawi2;arhuna,ripoli;ib0y;ya;l khums,z zawiy0;ah|Africa/Tunis¦sfax,t0;n,unis0;!ia|Africa/Windhoek¦na0windhoek;!mibia|America/Adak¦a0us/aleutian;dak,leutian islands,merica/atka|America/Anchorage¦a0us/alaska;h3k3laska0nchorage;! (most areas),n 0;daylight0standard0; time;dt,st|America/Anguilla¦anguilla|America/Antigua¦antigua|America/Araguaina¦araguaina,palmas,tocantins|America/Argentina¦aNbKcHformosa,jGla EmBneuquen,pAquilmJr9sa1t0;ierra del fuego (tLucumán (tm);lta6n0; 2t0;a 0iago del estero;cruz (sc),fe;juan1luis0miguel de tPsalvador de jM;! (sl);! (sj);! (salpnqrn);esistencQoH;araEilar,osadas;ar del p3e0oron;ndoza0rlo;! (mz);p0rioja (lr);laG;ose c paz,ujuy (jy);atamarca (ct) chubut (ch),or0;dGrient0;es;ahia blanHuenos aires0;! (bac0;f);merica/2r0;!genti0;na;argentina/3bCc2j1mendoza,ro0;sario;ujuy;a7ord5;b8c2sal1t0;ucuman;ta;a3o0;modrivadav1rd0;oba;ia;tamar0;ca;uenos0;|America/Aruba¦aruba|America/Asuncion¦asuncion,c5p0san lorenzo;araguay1y0;!st,t;! 0;summer t0t0;ime;apiata,iudad del este|America/Atikokan¦a0est - on (atikokan) nu (coral h);merica/coral0tikokan;|America/Atka¦atka|America/Bahia¦bahia,camacari,feira de santa0itabu0salvador,vitoria da conquista;na|America/Bahia_Banderas¦bahia0central time - bahía de0; banderas|America/Barbados¦b0;arbados,b|America/Belem¦ananindeua,belem,macapa,par0;auapebas,á (east) amapá|America/Belize¦b0;elize,z|America/Blanc-sablon¦blanc sablon|America/Boa_Vista¦boa vista,roraima|America/Bogota¦armenGbBc7dosquebradas,floridablanca,i6m5neiva,p3s1v0;alledupar,illavicencio;anta marCincelejo,o0;acha,ledad;a0erei9opayan;lmi8sto;anizales,edellin,onterA;bague,taguei;a2o0ucu6;!lombia0t;! time,n;li,rtagena;arran3ello,ogo2u0;caramanga,enaventu0;ra;ta;cabermeja,quilla;ia|America/Boise¦boise,mountain - id (south) or (east)|America/Cambridge_Bay¦cambridge bay,mountain - nu (west)|America/Campo_Grande¦campo grande,mato grosso do sul|America/Cancun¦cancun,eastern standard time - quintana roo|America/Caracas¦alto barinHbarGcAgua8m5p4san3turmeCv0;alencia,e0;!nezuela0t;!n standard time; cristobal,ta teresa del tuy;eta4uerto la cruz;a0ucumpiz;raca0turin;ibo,y;ren8ti0;re;a4iudad 2o1u0;a,m2;ro;bolivar,guay0;ana;bim1rac1;in0quisimeto,uta;as|America/Catamarca¦catamarca|America/Cayenne¦cayenne,french guiana,gf0;!t|America/Cayman¦cayman|America/Chicago¦aTbQcPdOfort worth,gNhMiKkXlHmAn6o5plano,s2t1us/central,wi0;chiEsconsT;exWulsa;a0hreveport,ou4t 1;int 0n antonio;louGpaul;klahoTmaha,verland park;ashKe1or0;th dako7;braska,w 0;orleans,south me6;adisLe5i1o0;biGntgomery;lwaukee,nne1ss0;issippi,ouri;apol6so0;ta;mph4;aredo,i0ouisiana,ubb1;ncoln,ttle r0;ock;llino0owa,rving;is;oust9unts4;arland,rand prairie;all9es moines;entral (most areas),hicago,orpus christi;aton rouge,rowns0;vil0;le;laba5marillo,r1ust0;in;k1lingt0;on;ans0;as;ma|America/Chihuahua¦chihuahua,mountain time - chihuahua (most areas)|America/Coral_Harbour¦america/atikokan,coral harbour|America/Costa_Rica¦c0;osta rica,r|America/Creston¦creston,mst - bc (creston)|America/Cuiaba¦cuiaba,mato grosso,varzea grande|America/Curacao¦curacao,s0;t maarten,x|America/Danmarkshavn¦danmarkshavn,national park (east coast)|America/Dawson¦dawson,pacific - yukon (north)|America/Dawson_Creek¦dawson creek,mst - bc (dawson crft st john)|America/Denver¦a0colorado springs,denver,el paso,mountain (most areas),navajo,salt lake,us/mountain;lbuquerque,merica/shiprock,urora|America/Detroit¦detroit,eastern - mi (most areas),grand rapids,us/michigan|America/Dominica¦dominica|America/Edmonton¦alberta,ca0edmonton,mountain - ab bc (e) sk (w);lgary,nada/mountain|America/Eirunepe¦a0eirunepe;c0mazonas (west);re time,t|America/El_Salvador¦el1s0;an0oyapango,v; salvador|America/Tijuana¦america/1e3mexic0pacific time us - baja california,tijuana;ali,o/bajanorte;e1santa0;;nsenada|America/Indiana¦america/6central - in (4eastern - in (1fort wayne,i9us/0;east-indiana,indiana-starke;crawfor1dadukmn),most areas),p0switzerlan1;i2ulaski);d);perry),star0;ke);fort4indiana0knox4;/0p2;i0knox;ndianap0;olis;|America/Fortaleza¦ca2fortaleza,imperatriz,j1m0natal,sao luis,teresina;aracanau,ossoro;oao pessoa,uazeiro do norte;mpina grande,ucaia|America/Glace_Bay¦atlantic - ns (cape breton),glace bay|America/Godthab¦g2w0;est greenland,g0;st,t;l,odthab,reenland0;! (most areas)|America/Goose_Bay¦atlantic - labrador (most areas),goose bay|America/Grand_Turk¦grand turk,t0;c,urks and caicos|America/Grenada¦grenada|America/Guadeloupe¦guadeloupe|America/Guatemala¦g0mixco,villa nueva;t,uatemala|America/Guayaquil¦cuenca,ec1guayaquil,ma0quito,santo domingo de los colorados;chala,nta;!uador0;! (mainland)|America/Guyana¦g0;eorgetown,uyana,y0;!t|America/Halifax¦atlantic - ns (most areas) pe,canada/atlantic,halifax,n1p0;ei,rince edward island;ew brunswick,ova scotia|America/Havana¦arroyo naranjo,b9c2diez de octubre,guantanBh1las tunas,pinar del rio,sant0;a clara,iago de cuba;avana,olguin;amaguey,dt,i4st,u0;!ba0;! 0n;daylight0standard0; time;e0udad camilo cie0;nfueg1;ay1oyer0;os;amo|America/Hermosillo¦ciudad obregon,hermosillo,mountain standard time - sonora,nogales|America/New_York¦a0Lb0Ic0Bd0Aeast09f06g04hialeah,i01jZkYlexingtonXmTnMoKpIquHrDsAt7u5v3w0yonkers;ashington1est 0inston salem,orcD;raEvirgin03;! dc;ermont,irginia0;! beach;nited states,s0;!/eastern;a0enne1he bronx,oleD;llaha0mpa;ssee;outh 1t0;. petersburg,aten3;bo06cC;a2hode1ichmo00och0;ester; isX;lei2;eens,intana roo;ennsylvanMhiladelphMittsbur0rovidence;gh;hio,rlan0;do;ew3or1y0;!c;folk,th c0;aroliD; 0ark,port news;hampshiSje8york0;! staO;a1eads,i0;ami,chig1;ine,nhatt0ryHssachusetts;an;! fayetJ;entucky,nox8;acks2e0;rsey;ndia1r0;on4;na;eorg0reensboro;ia;ayette0lorida,ort lauderda1;vil0;le; flatbush,ern (most areas);elawa9urham;ape coral,h3incinnati,leve1o0;lumbus,nnecticut;la0;nd;a0esapeake;rlot0ttanooga;te;altimo1o0rooklyn,uffalo;st2;re;kr0tlanta;on|America/Inuvik¦inuvik,mountain - nt (west)|America/Iqaluit¦eastern - nu (most east areas),iqaluit|America/Jamaica¦j1k0new k0;ingston;amaica,m|America/Jujuy¦america/argentina/j0j0;ujuy|America/Juneau¦alaska - juneau area,juneau|America/Knox_In¦knox in|America/Kralendijk¦kralendijk|America/La_Paz¦bo1cochabamba,la paz,oruro,s0;anta cruz de la sierra,ucre;!livia0t;! time,n|America/Lima¦arequiAc6huanc9i5juliaca,lima,p2sant1t0;acna,rujillo;a anita   los ficus,iago de sur5;e0iura,ucall7;!ru0t;! time;ca,quitos;allao,hi1us0;co;cl0mbote;ayo;pa|America/Los_Angeles¦anaheim,baWcUfQgarden grove,hNirviMlImoFnEoBp9r8s1tacoma,us/pacific0washington state;!-new;a1eattle,f,p0tocktNunrise manor;okaJringD;cramenDn0; 1ta 0;aNclariP;bernardiLdiego,fran0jo3;!cisco;ancho cucamonga,eJiver3;aradi0ort3;se;ak1cean0regDxnard;side;land;evada,orth las6;des1reno0; valley;to;a1o0;ng4s angeles;!s0; vegas;ne;enders1untington0; beach;on;onta2re0;mont,s0;no;na;a2hula vis0;ta;ja ca0kersfield;lifornia|America/Kentucky¦america/1eastern - ky (0l2;louisville area),wayne);kentucky/l0l0;ouisville|America/Lower_Princes¦lower princes|America/Maceio¦a0maceio;lagoassergipe,racaju|America/Managua¦man1ni0;!car0;agua|America/Manaus¦am0brazil/west,manaus;azon0t; time,as (east),ian|America/Marigot¦marigot|America/Martinique¦m0;artinique,q|America/Matamoros¦central time us - coahuilanuevo leóntamaulipas (us border),heroica m0m0nuevo laredo,reynosa;atamoros|America/Mazatlan¦culiac1los mochis,m0tepic;azatl0exico/bajasur,ountain time - baja california surnayaritsinaloa;an|America/Menominee¦central - mi (wisconsin border),menominee|America/Merida¦c0merida;ampeche,entral time - campecheyucatán|America/Metlakatla¦alaska - annette island,metlakatla|America/Mexico_City¦a0Eb0CcVduran09ecatepec de morel07guQhPiNjalis0Gleon de los alda03mInHoGpEqDs9t4uruap01v2x1yucat01za0;catec09pop00;alapa de enriqu0Ii0Eochimil0E;e0illahermosa;nustiano carranza,racruz;a3e7la1o0uxt00;luRnaZ;huac,l0quepaque,xcaY;nepantXpT;bas07maulip01pachuW;an0oledad de graciano sanch0A; luis potosi,t0;a maria chimal0iago de q1;huN;ueretaD;achuca de soFoza rica de6ue0;bPrto vallarX;axaGjo de agua;aucalpan00icolas rome9uevo leZ;agdalena contrerRexico3i1orel0x;ia,os;choFguel0; h3;! city,/general;rap5xtapalu9zta0;cQpalapa;idalJ;a1erre0stavo adolfo made0;ro;dalajara,naj0;ua0;to;eFhiCiudad Ao3u0;au1ernava0;ca;htemoc,titlan izcalli;a4l2yo0;ac0;an;i0onia del valle;ma;cAhui0tzacoalc2;la;lopez mate0nezahualcoyotl;os;ap1lpancin0;go;as;laya,ntral time;enito6uenavis0;ta;capulco3guascalientes,lvaro obreg2zcapotz0;al0;co;on; de0; juar0;ez|America/Miquelon¦m0pm,st pierre and m0;iquelon|America/Moncton¦atlantic - new brunswick,moncton|America/Monterrey¦c5g4mon3sa1t0victoria de durango;ampico,orreon;ltillo,n0; nicolas de los garza,ta catarina;clova,terrey;omez palacio,uadalupe;entral time - durango coahuilanuevo leóntamaulipas (most areas),iudad 0;apodaca,general escobedo,madero,victoria|America/Montevideo¦montevideo,u0;ruguay1y0;!t;! time|America/Toronto¦america/moBb9ca7eastern - onqc (most areas),gatineau,hamilAkitchener,l4m3nepe2o0quebec,richmond hill,toronto,vaugh2windsor;n5sh0tt0;awa;an;arkham,ississauga,o7;av7on0;don on0gueuil;tario;!nada0;!/eastern;arrie,ramp0;ton;ntre0;al|America/Montserrat¦montserrat|America/Nassau¦b0nassau;ahamas,s|America/Nipigon¦nipigon|America/Nome¦alaska (west),nome|America/Noronha¦atlantic islands,brazil/den0n0;oronha|America/Ojinaga¦ciudad juarez,mountain time us - chihuahua (us border),ojinaga|America/Panama¦pa0san miguelito;!nama|America/Pangnirtung¦eastern - nu (pangnirtung),pangnirtung|America/Paramaribo¦paramaribo,s0;r0uriname;!t|America/Phoenix¦a8c7g5idaho,m4n3phoenix,s2t1u0wyoming;s/a7tah;empe,ucson;cottsd3inaloa,onora;ayarit,ew mexico;aryv1esa,onta4st - arizona (except navajo);ilbert,lend0;ale;handler,olorado;rizo0;na|America/Port-au-Prince¦c2p0;etionville,ort 0;au prince,de paix;arrefour,roix des bouquets|America/Port_Of_Spain¦america/virg1port of spa1vi0;!rgin islands;in|America/Porto_Acre¦porto acre|America/Porto_Velho¦porto velho,rondônia|America/Puerto_Rico¦bayamon,p0;r,uerto rico|America/Punta_Arenas¦c0punta arenas,region of magallanes;hile s1l0;dt,st;tandard0ummer0; time|America/Rainy_River¦central - on (rainy rft frances),rainy river|America/Rankin_Inlet¦central - nu (central),rankin inlet|America/Recife¦caruaru,jaboatao2olinda,p0recife;aulista,e0;rnambuco,trolina;! dos guararapes|America/Regina¦c1regina,saskat0;c3oon;anada/0st - sk (most areas);east-s0s0;askatc0;hewan|America/Resolute¦central - nu (resolute),resolute|America/Rio_Branco¦a0brazil/ac2rio branco;c1merica/porto0;;re|America/Santa_Isabel¦santa isabel|America/Santarem¦pará (west),santarem|America/Santiago¦a7c4iquique,la pintana,puente alto,rancagua,san3t1v0;alparaiso,ina del mar;alca0emuco;!huano; bernardo,tiago;hile1l0oncepcion;!t;! (most areas),/continental;ntofagasta,rica|America/Santo_Domingo¦bella vista,do5la romana,san0; pedro de macoris,t0;iago de los caballeros,o domingo0;! 0;e0oe0;ste;!minican republic|America/Sao_Paulo¦a11b0Rc0Kd0Hembu,f0Fg0Ahortol09i05j02l01mXnVosasco,pLriFs4ta3uber2v0;i0olta redon15;amao,la velha,tor11;a0Kl06;boao da ser00uba0V;a2e1oroNu0;maLzano;rXte lago0J;nt4o 0;bernardo do campo,carl03jo0leopolLpaulo,vicE;ao de meriti,se0;! do0; rio p8s camp00;a 1o0; andDs;barbara d'oes0Kluz0Omar0O;beirao 3o0;! 0;cla0de janei0g6ver7;ro;das nev05p0;reto;asso fun8e7iraci6lanalti0Jo4r0;aia g1esidente prud0;en0B;ran0;de;nta grossa,rto aleg0;re;caU;lotWtro0A;do;iteroi,ov0;aJo hamburgo;a1o0;gi das cruzQntes clarD;ri0ua;l02n6;imei2ondri03;acarei,oinville,u0;iz de fo0ndi9;ra;ndaia2patin1ta0;bor6pevi,quaquece1;ga;tuE;andT;o3ravat2uaru0;ja,lh0;os;ai;iNvernador valadarA;loria3oz do0ranca; iguacu;i0uque de caxi8;adema,vi0;noK;a1o0uriti2;ntagem,tH;choeiro de itapemirAmp1no3rapicui0scavel,xias do sul;ba;in1os dos goytacaz0;es;as;a8e4lumenau,r0;!a0st,t;s1zil0;! time,/east,ian;il7íl7;l1t0;im;ford roxo,o horizon0;te;rueri,uru;lvora4merica3na2parecida de goi0;an0;ia;polis;na;da|America/Scoresbysund¦e1scoresbysund0;!/ittoqqortoormiit;ast greenland,g0;st,t|America/Shiprock¦shiprock|America/Sitka¦alaska - sitka area,sitka|America/St_Barthelemy¦st barthelemy|America/St_Johns¦canada/newfoundland,n0st johns;d2ewfoundland 0st,t;daylight0labrador (southeast),standard0; time;dt,t|America/St_Kitts¦st kitts|America/St_Lucia¦st lucia|America/St_Thomas¦st thomas|America/St_Vincent¦st vincent|America/Swift_Current¦cst - sk (midwest),swift current|America/Tegucigalpa¦h0san pedro sula,tegucigalpa;n,onduras|America/Thule¦thule0;!/pituffik|America/Thunder_Bay¦eastern - on (thunder bay),thunder bay|America/Tortola¦tortola|America/Vancouver¦b2canada/pacific,ladn1okanagan,pacific - bc (most areas),surrey,v0yukon;ancouv0ictor2;er;ritish columb0urnaby;ia|America/Virgin¦virgin|America/Whitehorse¦canada/yukon,pacific - yukon (south),whitehorse|America/Winnipeg¦c0m1winnipeg;anada/central,entral - on (west) m0;anitoba|America/Yakutat¦alaska - y0y0;akutat|America/Yellowknife¦mountain - nt (central),yellowknife|Antarctica/Casey¦casey|Antarctica/Davis¦a0davis;ntarctica,q|Antarctica/Dumontdurville¦dumontdurville|Antarctica/Macquarie¦macquarie0;! island|Antarctica/Mawson¦mawson|Antarctica/Mcmurdo¦mcmurdo|Antarctica/Palmer¦palmer|Antarctica/Rothera¦rothera|Antarctica/South_Pole¦south pole|Antarctica/Syowa¦syowa|Antarctica/Troll¦troll|Antarctica/Vostok¦vost0;!ok|Arctic/Longyearbyen¦longyearbyen|Asia/Aden¦a0ibb,mukalla,sanaa,taiz;den,l hudaydah|Asia/Almaty¦alm5k2nur sultan,p1s0taraz,ust kamenogorsk;emey,hymkent;avlodar,etropavl;a0z;ragandy,zakhstan0;! (most areas);a0t; ata,-ata time,ty|Asia/Amman¦amm1irbid,jo0russeifa,wadi as sir,zarqa;!rd0;an|Asia/Anadyr¦ana0;dyr0t;! time|Asia/Aqtau¦aq0mangghystaū/mankis0;tau|Asia/Aqtobe¦a0;k1qt0;o1öbe/ak0;to0;be|Asia/Ashgabat¦as4t0;m2urkmen0;a3istan0;! time;!t;hga0ia/ashkhabad;bat|Asia/Ashkhabad¦ashkhabad|Asia/Atyrau¦atyra0;u,ū/atirau/gur'yev|Asia/Baghdad¦a4ba3dihok,erbil,i2k1mosul,na0ramadi;jaf,sir9;arbala,irkuk;q,raq;ghdad,sr7;bu ghurayb,d diw4l 3rab1s0; sulaym3t;!ic0;! standard time;amar2basrah al qadim2falluj2hill2kut,mawsil al jadid2;an0;iy0;ah|Asia/Bahrain¦bahrain|Asia/Baku¦az0baku,ganja,lankaran,sumqayit;!erbaijan0t;! time|Asia/Bangkok¦bangkok,ch6h4i2mueang nontha7na1pak kret,s0udon thani;amut prakan,i racha,outh east asia;khon ratchasima,m dinh;ct,ndochina 0;(most areas),time;a0ue;iphong,noi,t y2;iang m1on 0;buri;ai|Asia/Barnaul¦b0;arnaul,iysk|Asia/Beirut¦bei1l0ra's bay1;b,ebanon;rut|Asia/Bishkek¦bishkek,k0osh;g1yrgyzstan0;! time;!t|Asia/Brunei¦b0;dt,n1runei0;! darussalam time;!t|Asia/Kolkata¦0:3C;1:3K;2:2D;3:3L;4:3I;5:38;a36b2Ec25d1Xe1Vf1Tg1Gh1Di19j14k0Ql0Lm0Dn06odis3KpWquthbull5rOsGtAu9v6warang2Nyamun1Q;a7el1Vi6;jayawa2Wsakha0IzianagD;doda2Prana12;daip0jja24lhasn1ttar pradesh;a9eYh8iru6umk0;chirap0Nnelve2p6vottiy0;a39p0;ane,iruvananthapur0Ooothuku2Zriss0;mb6njo1Y;ar0M;aCecunder4hAi9lst,o8r1Gu6;jan37r6;at,endr1D;l5nip2O;k3liguLngrau2rK;ahj20i6ri2Pya0M;mo1Nvaji08;har1Ylem,mbh25ng2t05ug0Z;a7e0Foh6;iJtak;ebare2iAj8m6nc1Htl0Burke37;ag6g6p0;und09;a6kot;hmund27sth2B;ch0p0;aAimp9roddat0u6;ducher24n6rn18;a6e;sa;ri;li,n8rbha7t6;ia2Vna;ni;chku2Ti6;ha2Gp22;a8e7izam4o6;i1Wwrang5;l0Tw del0Z;di2Kg8i0Fjaf2Fn6re2Oshik,vi mumb16;ded,g6;i,loi j1W;ercoil,p0;a9eerut,irz5o8u6yso0Z;lugu,mb11rwa1Jzaffar6;n1p0;nghyr,rad4;chili8d7harasht1Gleg08n6thu1Gu;ga0Jip0;hya,ur0W;patnH;a8u6;cknow,dhia6;na;l bahadur6t0; n1;aEhaCo9u6;kat7lt6rno1P;a2i;pal2;l6rXta,zhikode;h5ka1Kl6;am;nd6ragp0;wa;kina14l9marPnp0r6shmir,tih3;i7na6ol ba19;l,tW;mn1;lakuric04y12;a7han6odOunagadh;si;b0Sip0l7m6;mu,n1shedp0;andh3gHna;chalkaranji,mph0Jn6st;!d6;ia6o01;! standard time,n;a7is3ospet,u6;b2g2;o0Ip0ridw3;aDhazi4oAreater noi0Nu7wali6y05;or;jar0PlbarRnt0rg7wa6;ha12;aon;rak7sa6;ba;hp0;juw9n6ya;dh7g6;an1;in1;aka;ar6iroz4;id4rukh4;l6taw0M;loG;aBe9h7indigul,ombPurg6;!ap0;anb0Uul6;ia;hra dun,l6was;hi;rbhan6vange9;ga;a09h9o6uttack;ch7imbato6;re;in;a7enn6;ai;nd6pM;a6i0C;!nn1;aOeLhCiAor8rahm5u6;landshahr,rh6;anp0;iv2;li;d3har sharif,j5kan07l6;asp0imoD;aBi8op7u6;baneshw3sav6;al;l7wan6;di,i;ai,wa7;g7ratp0tpa6vn1yand3;ra;alp0;l6ngaluru;gaum,la6;ry;hBli,r7thin6;da;a7ddham6eilly;an;n1s6;at;a7rai6;gh;ramp0;gQhmLizawl,jmKkoRlHmDnant5rrBs7urang4va6;di;ans8ia/ca6;lcut6;ta;ol;ah;ap0;arnath,batt0r6;ava6its3oA;ti;ur;appuz7i6lah4w3;garh;ha;er;adn1ed4;ab6;ad;ag3;ar;arta6ra;la|Asia/Chita¦chita|Asia/Choibalsan¦choibalsan,dornodsükhbaatar|Asia/Shanghai¦0:3J;1:37;2:39;3:3A;4:3D;a3Fb32c2Nd2He31f2Cg26h1Qji1Ek1Bl0Ym0Wn0Tordos,p0Pq0Lrizh10s08t01wSxLyEz5;aoCh6i5ouc3unyi;bo,go0;a7en6ouk1u5; c3h34maWzh1;g2Wj1Izh1;b1Ung5o3E;jiakou5zh1;! shi xuanhua qu;ya0z27;an9i7u5;ci,e18n5;c3fu;b4c9n5ya0;cZgk1;c3g5ji,t2T;j17qu2sh16zh1;i6uc5;ha0;a6n5uyi0;di,gt2Oh1Fi0pu,t2Ox13ya0;m17n5;!g5ni0t0Eya0;t2ya0;aBe9u5;h6so0w1Bx5zh1;i,ue;a5u;i,n;i0Hn5;sh2zh1;fang5nxi2;di2;a8i6ong5;chuans0XhDli02sh2;an5eli0;j4sh0Z;i6ng5;gu,sh2;an,hec1Xyu2zh1;anmi0hAi8u5;i5zh1;h5zh1;ua;c5pi0;hu2;a7en6i5uangya14;jiaz15qi,y2;gli,ya0zh0G;n6o5s0I;gu2xi0;g5t1;h1Sqiu,rKyu;i5uan1K;aFn5o14qih0N;g5huangdH;dGh1O;an0Ting7rc,u5;ti2yang5;! H;ding0QxZ;an5eijYingbo;ch5ji0ni0to0ya0;a0o0;entoug1ianRuda5;njU;aEi8u5;anc3o6qi5;ao;he,ya0;a7jPn5upansh01;fTxia 5yi;chengguanI;n0Do5;c3y5;a0u2;i0Xn5ohek1;g5zh1;fa0;ai6un5;mi0sh2;fe0yu2;'2aAe9l4n6u5xi;jCt0X;an,c3g5i0zh1;de5li0zh1;zhE;ya0;musi,n8o5xi0;j6z5;uo;ia0;g5shF;m7xi;aFeBohhot,u5;a6i0Elan ergi,m5n2;en;i7ng5y4;ga0s5;hi;'2b8n2;bi,f7ga0ng5ze;sh5ya0;ui;ei;i7n5rb4;d2g5;u,zh1;c3k1l5;ar;a9u5;an6i5li;l4ya0zh1;g5k1;do0yu2zh1;nsu,opi0;en7o6u5;ji2shRx4zh1;sh2;d1g5;hua0;a6eOong5;gu2hU;d6lian5ndo0qi0to0;!g;o5uk1;nghQ;angIh5n,t;aBen8i5oZuH;fe0n5;a5ese;! standard K;g5zh1;d5zho0;e,u;ng6o5;ya0zh1;ch7de,sh6zh5;i,ou;a,u;un;zh1;aBe5;i6n5;gbu,xi;'2h7jing5;! 5;time;ai;i7o5yan nur;di0t1;ou;c3sh2y4;an;he0;nAsia/5;ch6harb4;in;o5ungki0;ng5;qi0;da,qi0sh5ya0;an,un;ng|Asia/Chungking¦chungking|Asia/Colombo¦colombo,dehiwala mount lavinia,lk,moratuwa,sri lanka|Asia/Dacca¦dacca|Asia/Damascus¦a4d3h2latak1sy0;!r0;ia;am2oms;amascus,eir ez zor;leppo,r raqq0;ah|Asia/Dhaka¦asia/dacca,bDcBd9jess8khul7mymensingh,na4pa3ra2s1t0;angail,ungi;aid8hib4ylhet;jshahi,ng7;b3ltan,r naogaon;gar5r0t3;ayan0singdi;ganj;na;ore;haka,inaj0;pur;hattogram,o0;milla,x's bazar;a0d,ogra;gerhat,ngladesh,rishal|Asia/Dili¦dili,east timor,tl0;!t|Asia/Dubai¦a4dubai,g2musaff1om0ras al khaim1sharj1uae;!an;ah;st,ulf0;! standard time;bu dhabi,jman|Asia/Dushanbe¦dushanbe,t0;ajikistan,j0;!t|Asia/Gaza¦gaza1p0;alestine,s;! strip|Asia/Hebron¦east jerusalem,hebron,west bank|Asia/Ho_Chi_Minh¦asia/saig4bien hoa,can tho,da 2ho chi minh,nha tr3qui nh4rach gia,sa dec,thi xa phu my,v0;ietnam0n,ung tau;! (south);lat,n0;ang;on|Asia/Hong_Kong¦h0kowloon,tsuen wan;k2ong0; kong0kong;! time;!t|Asia/Hovd¦bayan-ölgiigovi-altaihovduvszavkhan,hov0;d,t|Asia/Irkutsk¦angar1brat1irk0ulan ude;t,ut0;sk|Europe/Istanbul¦aZbTcRdPeMgLiJkHmCosmBs5t1u0v07zeytinburnu;eskuedXmrA;arsus,r2urk0;ey0ish;! standard time;!abzon,t;a3i1ultan0;beyJgazi;sIv0;as,erek;msun,n0;cakt5liurfa;aniye;a1er0uratpaH;kezefendi,sin;l0niF;atPt0;epe;a0irikkale,onNutahN;hramanmaras,rabaglFyseQ;sIzmi0;r,t;aziantep,ebze;lazig,rzurum,s0;en0kiC;l8yurt;eniz0iyarbakB;li;ankaDor0;lu,um;a1ur0;sa;gcil2hcelievl1likes5sak4t0;ikent,mA;er;ar;d6n3rnavutkoey,sia/is2ta0;seh0;ir;tanbul;kara,ta0;k0l0;ya;a1iyam0;an;na,paza0;ri|Asia/Jakarta¦bScQdepPiNjKkediri,lJmGpArengasdengklPs4t2w0yogyakM;est0ib; inMern indonesian time;a0egal;n4sikmal3;ema4itubondo,outh tan3u0;kabumi,medaRra0;b0kF;aya;ge0;raN;a4e1robolinggo,urw0;akAokerto;ka1ma0rcut;laJtangsiantar;long2nbaru;daHl3mulaHruH;a1ed0;an;diun,laE;embaD;a0ember;k0mbi,vasumatra;arta;d,n0;donesia;ok;i0urug;ampea,bino5leungsir,mahi,putat,rebon;a1e0injai,ogor;kasi,ngkulu;nd0tam;a0u1; aceh,r lampu0;ng|Asia/Jayapura¦ambon,east indonesia,jayapura,new guinea (west papua / irian jaya) malukus/moluccas,wit|Asia/Jerusalem¦as8beersheba,haifa,i2j0petah tiqwa,rishon leziyyon,tel aviv,west je1;e0mt;rusalem;d4l,s0;rael0t;! 0i;daylight0standard0; time;dt,t;hdod,ia/tel0;|Asia/Kabul¦af1herat,jalalabad,ka0mazar e sharif;bul,ndahar;!ghanistan0t;! time|Asia/Kamchatka¦kamchatka1pet0;ropavlovsk kamchatsky,t;! time|Asia/Karachi¦bKchiniJdera ghaziHfaisalGgujraFhyderGislamGjhang sadr,kDlaCm7nawabshah,okaAp4quetta,ra3s0;a1h0ialkIukkM;ahkHekhupu8;ddiqDhiwal,rgodha;him yarDwalpindi;akistan1eshawar,k0;!t;! standard time;a3i1u0;lt9zaffar7;ngo0rpur khas;ra;lir cantonment,rd6;hore,rkana;a0otli;moke,rachi,s8;n5t;abad; kh0;an;ot;a1himber,ure0;wala;hawalp0ttagram;ur|Asia/Urumqi¦a6changji,huoche5k3shihezi,turp2urumqi,xin1zh0;anjia4ongsh1;jiang time,yu0;an;a0orla;ramay,s2;ng;ksu,ral,sia/kas0;hgar|Asia/Kathmandu¦asia/kat2biratnagar,kath2n1p0;atan,okhara;epal,p;mandu|Asia/Katmandu¦asia/kath1kat1n0;epal time,pt;mandu|Asia/Khandyga¦khandyga|Asia/Krasnoyarsk¦kra0;snoyarsk0t;! time|Asia/Kuala_Lumpur¦alor setar,bukit mertajFgeorge town,ipoh,johor bahEk9m4petali3s0taipiD;e1hah alEu0;ba1ngai petani;paAremb8;ng jaya;ala1y0;!t;cca,ysia0;! 0;(peninsula),time;ampung baru suba3la3ota bha4ua0;la 1nt0;an;lumpur,terengganu;ng;ru;am|Asia/Kuching¦k2miri,s0tawau;a0ibu;bahsarawak,ndakan;ota kinabalu,uching|Asia/Kuwait¦al ahmadi,kuwait|Asia/Macao¦macao|Asia/Macau¦asia/macao,m0;acau,o|Asia/Magadan¦mag0;adan,t|Asia/Makassar¦asia/ujungAb6c4denpa3k2l1ma0palu,samarinda,wita;kas2nado,taram;abuan bajo,oa jan7;endari,upang;sar;entral indonesia0ity of bal3;!n time;a0orneo (eastsouth) sulawesi/celebesbalinusa tengarra timor (west);l0njarmasin;ikpap0;an;|Asia/Manila¦an04bWcRdaPgeneral santOiMlJmCnaBoAp4quezIsan1ta0zamboanga;clobZguig,rlac,ytE; 1t0;a ro2ol;fernando,jose del monte,pab01;a3h1uerto prince0;sa;!ilippine0t; time,s;gadiRnalanoy,s0;ay,ig;longapo,rmoc;ga,votQ;a0eycauayN;balacat,gugpo poblaci4kati,l3n0;da1ila,silingLtamp0;ay;luyong,ue;ingDol6;on;a1egaspi,i0ucena;bertad,pa;pu lapu,s p4;l0mus;igCoiH;os;smar0v5;inB;a0ebu,otabato;b1gayan de oro,in5l0;amba,ooc6;anatu5uy0;ao;a4inan2u0;d0tu2;ta;!gon0;an;co1guio,tang0;as;lod,or;geles,tipo0;lo|Asia/Muscat¦muscat,seeb|Asia/Nicosia¦cy1europe/n0n0;icosia;!prus0;! (most areas)|Asia/Novokuznetsk¦kemerovo,novokuznet0prokop'yev0;sk|Asia/Novosibirsk¦nov0siberia;osibirsk,t|Asia/Omsk¦oms0;k,t|Asia/Oral¦ora0west kazakhstan;l0t;! time|Asia/Phnom_Penh¦phnom penh,takeo|Asia/Pontianak¦borneo (westcentral),pontianak,tanjung pinang|Asia/Pyongyang¦chongjin,h5k3n2pyongya8s0won6;ariw0inui8unch'0;on;amp'o,orth korea;a0p;eso3nggye;a1ungnam,ye0;san;e1mhu0;ng;ju|Asia/Qatar¦ar rayyan,doha,qa0;!tar|Asia/Qyzylorda¦kyzyl1qyzylorda0;!/kyzylorda/kzyl-0;orda|Asia/Rangoon¦asia/yang1m0rango1;mt,yanmar time;on|Asia/Riyadh¦a6burayd5dammam,ha4jedd5khamis mushait,me3najran,riyadh,sultan5ta2y0;anbu,e0;!men;'if,buk;cca,dina;'il,far al batin;ah;bha,l 0;hufuf,jubayl,kharj,mubarraz|Asia/Saigon¦asia/ho0saigon;|Asia/Sakhalin¦sak0yuzhno sakhalinsk;halin,t|Asia/Samarkand¦bukhara,nukus,qarshi,samarkand,uz0;bekistan 0t;(west),time|Asia/Seoul¦anObuLchGdaeFgBhwaseoPiAje9k7m6pohaErok,s2u1wonIy0;aBeosu;ijeongbuOlsK;e1outh korea,u0;nDwG;jo9o0;ngnamKul;asFokpo;imhae,orea0r,st,wangmyo6;! standard time,n;ju,on8;cCksBn6;angneu2oyaDu1wa0;ng5;mi,ns8riC;ng;gu,je4;angw3eon2in1un0;che2;ju;an,gju6;on;c1s0;an;heon2;san1ya0;ng0; si|Asia/Singapore¦s0woodlands;g1ingapore0;! time;!t|Asia/Srednekolymsk¦sre0;dnekolymsk,t|Asia/Taipei¦banqiao,h6k4roc,t0;a0w;i0oyu1;ch2n0pei,w0;an;aohsi0eel0;ung;sinchu,ualien|Asia/Tashkent¦andij2namangan,qo`q2tashkent,uz0;!bekistan0;! (east);on|Asia/Tbilisi¦ge1kuta0tbil0;isi;!orgia0t;! standard time|Asia/Tehran¦aTbPgorgZhamYiKkCmaBn8orumiy7pasragad branch,q4rasht,s2t1varam6yazd,za0;hedYnjY;abHehrX;a0hirUirjW;bzevar,nandEri,v3;a0om;rchak,zv0;in;eh;a0eyshabur;jaf0zar0;ab4;layer,shh3;a4erman3ho0;meyni sGrram0wy;ab0sF;ad;!shah;h1r0;aj;riz;r0sfahE;!an0dt,st;! 0iC;daylight0standard0; time;a2irjand,o0uk9;jnu0ruje0;rd;b3ndar abbas;b4hv3m2r1zads0;hahr;ak,dabil;ol;az;ad0;an|Asia/Thimbu¦btt,thimbu|Asia/Thimphu¦asia/thimbu,b0thimphu;hutan,t|Asia/Tokyo¦0:11;1:19;a17ch15fu0Ygifu13h0Ni0Hj0EkYmSnLoJsEt8u7waka04y2;a5o2;k2no;kaic1Ao2;ha0Xsu0;maJo;ji,tsun0E;aka6o2sukuba;k4makom04y2;a0So2;hNna0ta;oro02us0Pyo;m0Irazu0sa1tsu1;a4endZhi3o0u2;i0Yzu0;monose1zuo0;ita0Lk2ppoKsebo;ai,u05;dawa04i0Uka2sa0t0D;ya0Iza1;a5eyaga0Oi2umazu;i3shi2; tokyo0Hnomiya ha0F;ga0P;g2ha,ra0F;a2oW;no,o0sa1;a4i2orio0;na2to,yaza1;mirinkan,to;chiCeb3tsu2;do,m7ya06;as0H;aAi8o6u2y5;mam4r3shi2;ro;ashi1e,uG;oto;be,c0Bfu,ri2shigaJ;yaY;shiwa2takyushu;da;gosUkogawacho honmJmirenjaku,na7s4wa2;g2sa1;oe,uc05;hiZu2;g2kabe;ai;zaW;apan2oetIp,st;! standard ti2;me;bara1chi3ta2wa1zu2;mi;ha4n2;omi2;ya;ra;a7i2oncho;meAr3t2;acP;a3os2;a1hiB;kaLtsu0;chi4kodate,mam2;at2;su;nohe,o2;ji;ji7ku2;i5o0s2ya3;hi2;ma;ka; sB;!sa5;i2ofu;ba,g4;geoshimo,k5mag3njo,omori,sahika2tsugi;wa;asa1;ki;as3i2;ta;hi|Asia/Tomsk¦tomsk|Asia/Ujung_Pandang¦ujung pandang|Asia/Ulaanbaatar¦asia/ulan4m2ula0;anbaatar0n bator,t;! time;n,ongolia0;! (most areas);|Asia/Ust-nera¦ust nera|Asia/Vientiane¦vientiane|Asia/Vladivostok¦k2vla0;divostok0t;! time;habarovsk0omsomolsk on amur;! vtoroy|Asia/Yakutsk¦blagoveshchensk,yak0;t,utsk0;! time|Asia/Yekaterinburg¦chelyabin6k5magnitogor6nizhn4or2perm,s1tyumen,ufa,yek0zlatoust;ateri2t;terlitamak,urgut;e0sk;nburg;evartov1y tagil;amensk ural'skiy,urgan;sk|Asia/Yerevan¦a0yerevan;m,rmenia|Europe/Volgograd¦vol0;gograd0t,zhskiy;! time|Atlantic/Azores¦azo0hmt;res,st,t|Atlantic/Bermuda¦b0;ermuda,m|Atlantic/Canary¦canary0las palmas de gran canaria,santa cruz de tenerife;! islands|Atlantic/Cape_Verde¦c0;ape verde,v0;!t|Atlantic/Faeroe¦faeroe|Atlantic/Faroe¦f0;aroe0o;! islands|Atlantic/Jan_Mayen¦jan mayen|Atlantic/Madeira¦madeira0;! islands|Atlantic/Reykjavik¦is,reykjavik|Atlantic/South_Georgia¦gs,south georgia|Atlantic/St_Helena¦st helena|Atlantic/Stanley¦f0stanley;alkland island1k0;!st;!s|Australia/Act¦act|Australia/Adelaide¦a0south australia;c4delaide,ustralia0; central,/south,n central0;! 0;daylight0standard0; time;dt,st|Australia/Brisbane¦a1brisbane,gold co6logan,queensland0townsville;! (most areas);e5ustralia0; e3/queensland,n east0;!ern 0;daylight0standard0; time;ast;dt,st|Australia/Broken_Hill¦australia/yancowinna,broken hill,new south wales (yancowinna)|Australia/Sydney¦au0c3new south wales (most areas),sydney,wollongong;!stralia0;!/0;act,c0nsw;anberra|Australia/Currie¦currie,tasmania (king island)|Australia/Darwin¦australia/north,darwin,northern territory|Australia/Eucla¦a0cw3eucla,western australia (eucla);cw2ustralia0; central we1n central western0;! standard time;st|Australia/Hobart¦australia/tasmania,hobart,tasmania0;! (most areas)|Australia/Lhi¦lhi|Australia/Lindeman¦lindeman,queensland (whitsunday islands)|Australia/Lord_Howe¦australia/lhi,l0;h3ord howe0;! 0;daylight0island,standard0; time;dt,st|Australia/Melbourne¦australia/victoria,geelong,melbourne|Australia/Nsw¦nsw|Australia/North¦north|Australia/Perth¦a0perth,western australia (most areas);ustralia1w0;dt,st; 3/3n west0;!ern 0;daylight0standard0; time;west|Australia/South¦south|Brazil/West¦west|Europe/Lisbon¦amadora,lisbon,p5we0;st0t;! europe,ern europe0;!an 0;summer t0t0;ime;ort0t;o,ugal0;! (mainland)|Australia/Yancowinna¦yancowinna|Brazil/Denoronha¦denoronha|Brazil/East¦east|Canada/Eastern¦e0;ast0dt,st;!ern0;! 0;daylight0standard0; time|Chile/EasterIsland¦e0;as0mt;st,t0;!er0; island0island;! s0;tandard0ummer0; time|Canada/Atlantic¦a0;dt,st,tlantic0;! 0;daylight0standard0; time|Canada/Central¦c0;dt,entral0st;! 0;daylight0standard0; time|Canada/East-saskatchewan¦east saskatchewan|Canada/Mountain¦m0;dt,ountain0st;! 0;daylight0standard0; time|Canada/Newfoundland¦newfoundland|Canada/Pacific¦p0;acific0dt,st;! 0;daylight0standard0; time|Chile/Continental¦continental|Europe/Amsterdam¦a3eindhov2groning2n1rot4t0utrecht;he hague,ilburg;etherlands,l;en;lmere stad,ms0;terdam|Europe/Andorra¦a0;d,ndorra|Europe/Astrakhan¦astrakhan|Europe/Athens¦athens,gr0thessaloniki;!eece|Europe/London¦a0Kb05c02dZeXgUhSiPjeOkingston upon hull,lJmHnBoxTp9reading,s1w0yF;arwick05igan,olverha7;heffield,o3t2u1w0;an4iH;ffolk,nderland,sUttM;afOoke on tre08;meUuth0;a1end on 0;sea;mptH;ly0orts0restG;mouth;ew4o0;r0ttinghamO;th0wD; y0amptonM;orkQ;castle upon tyne,port;ancheLi0;dlan4lton keynes;ancaMdn,e2i1o0ut6;nd5;ncolnKverS;e0icesterE;ds;!rsT;psw1slingt0;on;ich;ampDert0;fordC;b1l0reenwich standardH;asgow,oucesterA;!-eA;dinburgh,s0urope/belL;sex;erby1o0udlI;rset;!sh5;a1ity of westmin0oventry,rawlF;ster;mbridge1rdiff;eBirAlack8r2st,uckingham0;sh0;ire;adford,e4i0;st5t0;ain,ish0;! summer0; time;nt;po0;ol;kenhead,mingham;l1xl0;ey;fast;berdeen,rchway|Europe/Belgrade¦belgrade,n1pristina,s0;i,lovenia;is,ovi sad|Europe/Berlin¦a04bWcRdPeNfrMgeKhaFkDlBm5n4oberhaus08ro3s1w0;andsbek,iesbad07uppert9;a0tuttgaM;arbrueck05xony;mance,sto8;eue neustadt,uernbe01;a3e2iddle european,oenchengladba1u0;enst9ni0;ch;st,t;gdeVinz,nnheim,rienth0;al;eipzMuebe0;ck;a0iNoeln,rO;rlsruhe,ssM;gSlle (saale),m1nnov0rP;er;burg0m;! 0;mitte,nord;lsenkirMrmany0;! (most areas);ankfurt am maGeiI;imsbuettDrfu0ssK;rt;e,ortmund,resdIu0;esseldorf,isE;e0hemnitz;ntral europe0st,t;!an 0;summer t0t0;ime;avaria,erl6iel5o2r0;aunschwe0emA;ig;chum0nn;! hord0;el;efeld;in;a2ltona,ugs0;bu0;rg;ch0;en|Europe/Bratislava¦bratislava,kosice|Europe/Brussels¦antwerpen,b0charleroi,gent,liege;e0russels;!lgium|Europe/Bucharest¦b3c2gala1iasi,oradea,ploies1ro0timisoara;!mania;ti;luj napoca,onstanta,raiova;ra0ucharest;ila,sov|Europe/Budapest¦budapest,debrecen,hu0;!ngary|Europe/Busingen¦busingen|Europe/Chisinau¦chisinau,europe/tiraspol,m0;d,oldova|Europe/Copenhagen¦arhus,copenhagen,d0;enmark,k|Europe/Dublin¦cork,dublin,eire,greenwich standard2i0;e,r0st;eland,ish summer0; time|Europe/Gibraltar¦gi0;!braltar|Europe/Guernsey¦guernsey|Europe/Helsinki¦espoo,fi1helsinki,t0vantaa;ampere,urku;!nland|Europe/Isle_Of_Man¦isle of man|Europe/Kaliningrad¦kaliningrad|Europe/Kirov¦kirov|Europe/Kiev¦bila tserkHcherEdChorlBivano frankivDk7l6m4odessa,poltaHrivne,sumy,ternopil,u2vinnyts1z0;aporizhzh0hytomyr;ya;a,kraine0;! (most areas);a0ykolayB;ki5riupol;ut6v9;amyanske,h1iev,r0y8;emenchuk,opyv1yvyy rih;ark6erson,mel0;nytskyy;ivka;nipro,onet0;sk;kasy,ni0;h0vtsi;iv;va|Europe/Ljubljana¦ljubljana|Europe/Luxembourg¦lu0;!xembourg|Europe/Madrid¦aMbJcHeGfuenDgCjerez de la frontera,lBm8ovieFp6s1terrassa,v0zaragoza;alladol9igo;a1evilla,pain0;! (mainland);badell,n0; sebastian,t0; marti,ander,s montjuic;a0uente de vallecas;lma,mpD;a0ostolGurcF;dr0laga;id;atiEeganD;asteiz / vitorBijon,ran1;carral el par1labr0;ada;do;ixample,lche,s;a0iudad lineal;rabanchel,stello de la pla7;a0ilbao,urgos;da0rce0sque;lo4; coru3l0;cala de henar1icante,mer0;ia;es;na|Europe/Malta¦m0;alta,t|Europe/Mariehamn¦mariehamn|Europe/Minsk¦b2h1m0viteb3;ahilyow,in2;omyel,rodna;abruy0elarus,rest,y;sk|Europe/Monaco¦m0;c,onaco|Europe/Moscow¦ar0Ab07c04dzerzh03fet,grozn02ivano01kVlipet0CmQnMorel,pJrEs7t5v2w-su,y0zelenograd;a0oshkar oT;roslavl,seneZ;asyl'evsky ostrHelikiLladi1o0ykhino zhulebQ;logda,ronezh;kavkaz,m06;a0uOver;ganrog,mbD;a4ever3hakhty,molen04ochi,t0yktyvkP; 4a0;ryy osk0vrop0;ol;nQodvR;int 0rV;petersburg;ostov na donu,u1y0;azJbN;!ssia0;!n0;! standard time;e1odolSsk0;ov;nza,trozavodQ;a2izhn0ovorossiyP;ekamOi0;y novK;berezhnyye chelny,l'chik;a1dst,oscow,s0urmH;d,k;khachka1r'0;ino;la;a2himki,ostroma,rasno0urG;d0gvargeisky;ar;l1z0;an;ininsk5uga;vo;yy;in8;entraln1he0;boksary,repovets;iy;el1ry0;an3;gorod;khangel'1mav0;ir;sk|Europe/Oslo¦atlantic/jan2berg1oslo,s0;j,valbard and jan may0;en;|Europe/Paris¦bordeaux,cergy pontoiBfr9l7m6n4paris,re3s0toulouB;aint 1t0; 0rasbourg;etienne;ims,nn1;ant0i5ormandy;es;arsei1ontpellier;e havre,i0yon;lle;!an0;ce;se|Europe/Podgorica¦podgorica|Europe/Prague¦brno,ostrava,prague,s0;k,lovakia|Europe/Riga¦e1kalt,l0riga;atvia,v;ast1e0;st,t; europe,ern europe0;!an 0;summer t0t0;ime|Europe/Rome¦b9c8florence,genoa,m7naples,p4rome,sicily,t2v0;a0eroA;!tican city;aran2rieste,u0;rin,scany;a1ra0;to;dova,lermo;essi3ilan;atan1orsica;ari,olog1resc0;ia;na|Europe/Samara¦izhevsk,s0togliatti on the volga;am0yzran;ara,t|Europe/Saratov¦balakovo,saratov|Europe/San_Marino¦san marino|Europe/Sarajevo¦banja luka,sarajevo|Europe/Simferopol¦simferopol|Europe/Skopje¦skopje|Europe/Sofia¦b0plovdiv,sof2varna;g,u0;lgar0rgas;ia|Europe/Stockholm¦goeteborg,malmoe,s0;e,tockholm,weden|Europe/Tallinn¦e0tallinn;e,stonia|Europe/Tirane¦al1tiran0;a,e;!bania|Europe/Tiraspol¦tiraspol|Europe/Ulyanovsk¦ulyanovsk|Europe/Uzhgorod¦ruthenia,uzhgorod|Europe/Vaduz¦vaduz|Europe/Vatican¦vatican|Europe/Vienna¦a0donaustadt,favoriten,graz,linz,vienna;t,ustria|Europe/Vilnius¦k1l0vilnius;ithuania,t;aunas,laipeda|Europe/Warsaw¦bDczestochowa,g9k7l5mokot8p3radFs2torun,w0zabrze;ars0rocl0;aw;osnowiec,zczec3;l,o0raga poludnie;land,znan;odz,ubl0;in;ato2iel3rak0;ow;d2li0;wi0;ce;ansk,ynia;i2y0;dgoszcz,t0;om;alystok,elsko biala|Europe/Zagreb¦split,zagreb|Europe/Zaporozhye¦luhansk,sevastopol,zaporozh0;'ye/zaporizhia lugansk/luhansk (east),ye|Europe/Zurich¦geneve,li0swiss time,zurich;!echtenstein|Indian/Antananarivo¦ant0toamasina;ananarivo,sirabe|Indian/Chagos¦british indian ocean territory,c3i0;ndian 1o0;!t;c0ocean time;hagos|Indian/Christmas¦c0;hristmas1x0;!t;! island|Indian/Cocos¦c0;c2ocos0;! island0;!s;!t|Indian/Comoro¦comoro|Indian/Kerguelen¦french southern and antarctic2kerguelen1tf0;!t;!st paul islandamsterdam island;! lands|Indian/Mahe¦mahe,s0;c,eychelles|Indian/Maldives¦m0;aldives1v0;!t;! time|Indian/Mauritius¦m0;auritius1u0;!t;! time|Indian/Mayotte¦mayotte|Indian/Reunion¦r0;e0éunioncrozetscattered islands;t,union|Mexico/Bajanorte¦bajanorte|Mexico/Bajasur¦bajasur|Pacific/Apia¦apia,s1w0;estern s0s;amoa|Pacific/Auckland¦a6christchurch,manukau,n0wellington;ew zealand1orth shore,z0;!dt,mt,st;! 0;daylight0standard0t1; t0;ime;ntarctica/south0uckland;|Pacific/Bougainville¦bougainville,p0;apua new guinea time,gt|Pacific/Chatham¦cha0nz-chat;dt,st,tham0;! island0; 0s;daylight0standard0; time|Pacific/Chuuk¦chuuk1pacific/0;truk,y1;!/truky0;ap|Pacific/Easter¦chile/easterisland,easter|Pacific/Efate¦efate,v0;anuatu,u|Pacific/Enderbury¦enderbury,phoenix islands|Pacific/Fakaofo¦fakaofo,t0;k0okelau;!t|Pacific/Fiji¦f0;iji,j0;!st,t|Pacific/Funafuti¦funafuti,t0;uvalu,v|Pacific/Galapagos¦gal0;apagos,t,ápagos islands|Pacific/Gambier¦gambier0;! islands|Pacific/Guadalcanal¦guadalcanal,s0;b,olomon islands|Pacific/Guam¦ch0guam,mp,northern mariana islands;amorro standard time,st|Pacific/Honolulu¦aleutian,h0pacific/johnston,us/hawaii;awaii0onolulu,st;!an standard time|Pacific/Johnston¦johnston|Pacific/Kiritimati¦ki0line islands;!ri0;b0tim0;ati|Pacific/Kosrae¦kosrae|Pacific/Kwajalein¦kwajalein,m0;arshall islands time,ht|Pacific/Majuro¦m0;a0h;juro,rshall islands0;! (most areas)|Pacific/Marquesas¦marquesas0;! islands|Pacific/Midway¦midway,s0;amoa standard time,dt,omoan,st|Pacific/Nauru¦n0;auru,r|Pacific/Niue¦n0;iue,u0;!t|Pacific/Noumea¦n0;c,ew caledonia,oumea|Pacific/Pago_Pago¦pa0samoamidway,us1;cific0go pago;/samoa|Pacific/Palau¦p0;alau,w|Pacific/Pitcairn¦p0;itcairn,n|Pacific/Pohnpei¦f3micro4p0;acific/1f,ohnpei0;!/0;ponape;m,rench poly0;nesia|Pacific/Ponape¦p0;acific/pohnpei,onape|Pacific/Port_Moresby¦p0;apua new guinea0g,ort moresby;! (most areas)|Pacific/Rarotonga¦c0rarotonga;k0ook islands;!t|Pacific/Saipan¦saipan|Pacific/Samoa¦samoa|Pacific/Tahiti¦society islands,tahiti|Pacific/Tarawa¦gilbert islands,tarawa|Pacific/Tongatapu¦to0;!nga0;!tapu|Pacific/Truk¦pacific/chu0tr0;uk|Pacific/Wake¦u1wake0;! island;m,s minor outlying islands|Pacific/Wallis¦w0;allis0f;! and futuna|Pacific/Yap¦yap|etc/Gmt¦etc/gr1g0;mt,r0;eenwich|Etc/Utc¦etc/2u1z0;!u2;ct,tc;u1zu0;lu;ct,niversal|etc/Utc¦universal|Antarctica/DumontDUrville¦dumont-d'urville|America/Blanc-Sablon¦ast - qc (lower north shore)|America/Fort_Nelson¦mst - bc (ft nelson)|Asia/Famagusta¦northern cyprus|America/North_Dakota¦central - nd (0;m0oliv1;erc0orton rural);er)|Asia/Yangon¦asia/rango3b2kyain seikgyi township,m0nay pyi taw,pathein,sittwe,yang3;a0eiktila,m,onywa,yanmar;ndalay,wlamyine;ago,urma;on|Asia/Qostanay¦kostanay|atlantic/Faroe¦atlantic/faeroe|atlantic/Reykjavik¦iceland|America/Mendoza¦america/argentina/mendoza|atlantic/Faeroe¦atlantic/faroe|America/Port-au-prince¦h0;aiti,t|Pacific/Norfolk¦n0;f,orfolk island|America/Buenos_Aires¦ar0;gentin0t;a time,ian";

// strings that don't pack properly
var misc = {
  'gmt+0': 'etc/Gmt',
  'gmt-0': 'etc/Gmt',
  gmt0: 'etc/Gmt',
  'etc/gmt+0': 'Etc/Gmt',
  'etc/gmt-0': 'Etc/Gmt',
  'etc/gmt0': 'Etc/Gmt',
  'msk-01 - kaliningrad': 'Europe/Kaliningrad',
  'msk+00 - moscow area': 'Europe/Moscow',
  'msk+00 - crimea': 'Europe/Simferopol',
  'msk+00 - volgograd': 'Europe/Volgograd',
  'msk+00 - kirov': 'Europe/Kirov',
  'msk+01 - astrakhan': 'Europe/Astrakhan',
  'msk+01 - saratov': 'Europe/Saratov',
  'msk+01 - ulyanovsk': 'Europe/Ulyanovsk',
  'msk+01 - samaraudmurtia': 'Europe/Samara',
  'msk+02 - urals': 'Asia/Yekaterinburg',
  'msk+03 - omsk': 'Asia/Omsk',
  'msk+04 - novosibirsk': 'Asia/Novosibirsk',
  'msk+04 - altai': 'Asia/Barnaul',
  'msk+04 - tomsk': 'Asia/Tomsk',
  'msk+04 - kemerovo': 'Asia/Novokuznetsk',
  'msk+04 - krasnoyarsk area': 'Asia/Krasnoyarsk',
  'msk+05 - irkutskburyatia': 'Asia/Irkutsk',
  'msk+06 - zabaykalsky': 'Asia/Chita',
  'msk+06 - lena river': 'Asia/Yakutsk',
  'msk+06 - tomponskyust-maysky': 'Asia/Khandyga',
  'msk+07 - amur river': 'Asia/Vladivostok',
  'msk+07 - oymyakonsky': 'Asia/Ust-Nera',
  'msk+08 - magadan': 'Asia/Magadan',
  'msk+08 - sakhalin island': 'Asia/Sakhalin',
  'msk+08 - sakha (e) north kuril is': 'Asia/Srednekolymsk',
  'msk+09 - kamchatka': 'Asia/Kamchatka',
  'msk+09 - bering sea': 'Asia/Anadyr'
};

var isOffset = /(\-?[0-9]+)h(rs)?/i;
var isNumber = /(\-?[0-9]+)/;
var utcOffset = /utc([\-+]?[0-9]+)/i;
var gmtOffset = /gmt([\-+]?[0-9]+)/i;

var toIana = function toIana(num) {
  num = Number(num);

  if (num > -13 && num < 13) {
    num = num * -1; //it's opposite!

    num = (num > 0 ? '+' : '') + num; //add plus sign

    return 'Etc/GMT' + num;
  }

  return null;
};

var parseOffset = function parseOffset(tz) {
  // '+5hrs'
  var m = tz.match(isOffset);

  if (m !== null) {
    return toIana(m[1]);
  } // 'utc+5'


  m = tz.match(utcOffset);

  if (m !== null) {
    return toIana(m[1]);
  } // 'GMT-5' (not opposite)


  m = tz.match(gmtOffset);

  if (m !== null) {
    var num = Number(m[1]) * -1;
    return toIana(num);
  } // '+5'


  m = tz.match(isNumber);

  if (m !== null) {
    return toIana(m[1]);
  }

  return null;
};

var parseOffset_1 = parseOffset;

var lexicon = efrtUnpack_min(_data);
lexicon = Object.assign(lexicon, misc); // console.log(lexicon.ist)
// add some redundant data to our lexicon

Object.keys(lexicon).filter(function (k) {
  var val = lexicon[k];

  if (typeof val === 'string') {
    val = val.toLowerCase();

    if (lexicon[val] === undefined) {
      lexicon[val] = lexicon[k];
    }
  }
}); //try to match these against iana form

var normalizeOne = function normalizeOne(tz) {
  tz = tz.replace(/^in /g, '');
  tz = tz.replace(/ time/g, '');
  tz = tz.replace(/ (standard|daylight|summer)/g, '');
  tz = tz.replace(/ - .*/g, ''); //`Eastern Time - US & Canada`

  tz = tz.replace(/, .*/g, ''); //`mumbai, india`

  return tz.trim();
}; //some more aggressive transformations


var normalizeTwo = function normalizeTwo(tz) {
  tz = tz.replace(/\b(east|west|north|south)ern/g, '$1');
  tz = tz.replace(/\b(africa|america|australia)n/g, '$1');
  tz = tz.replace(/\beuropean/g, 'europe');
  tz = tz.replace(/\islands/g, 'island');
  tz = tz.replace(/.*\//g, '');
  return tz.trim();
}; // even-more agressive


var normalizeThree = function normalizeThree(tz) {
  tz = tz.replace(/\(.*\)/, '');
  return tz.trim();
}; //


var find = function find(str) {
  if (!str) {
    return null;
  }

  str = str.toLowerCase().trim(); // lookup known abbreviations

  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str];
  } // -8hrs


  if (/[0-9]/.test(str)) {
    var etc = parseOffset_1(str);

    if (etc) {
      return [etc];
    }
  } // start fuzzy-match against iana timezones


  str = normalizeOne(str);

  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str];
  } // 'eastern daylight'


  var tmp = str + ' time';

  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp];
  } // 'pacific'


  tmp = str + ' standard time';

  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp];
  } // -- harder normalizations --


  str = normalizeTwo(str);

  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str];
  } // -- HARDER normalizations --


  str = normalizeThree(str);

  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str];
  } // 'eastern daylight'


  tmp = str + ' time';

  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp];
  } // 'pacific'


  tmp = str + ' standard time';

  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp];
  }

  return null;
};

var find_1 = find;

//From https://Github.com/Mj1856/Timezonenames
// and from  https://Github.com/Nodatime/Nodatime/Blob/Master/Data/Cldr/Windowszones-35.xml
// do some ad-hoc compression
var eu = 'Europe/';
var af = 'Africa/';
var am = 'America/';
var au = 'Australia/';
var as = 'Asia/';
var pa = 'Pacific/';
var _05Metazones = [//gmt-0, with daylight savings
{
  std: {
    name: 'Greenwich Standard Time',
    abbrev: 'GMT'
  },
  dl: {
    name: 'British Summer Time',
    abbrev: 'BST'
  },
  alias: ['british', 'britain'],
  pick: eu + 'London',
  offset: 1,
  ids: [eu + 'Guernsey', eu + 'Isle_Of_Man', eu + 'Jersey', eu + 'London', 'Europe/Belfast']
}, {
  std: {
    name: 'Greenwich Standard Time',
    abbrev: 'GMT'
  },
  dl: {
    name: 'Irish Summer Time',
    abbrev: 'IST'
  },
  alias: ['ireland'],
  offset: 1,
  ids: [eu + 'Dublin']
}, //gmt-0, no daylight savings
{
  std: {
    name: 'Greenwich Standard Time',
    abbrev: 'GMT'
  },
  pick: af + 'Freetown',
  alias: ['etc', 'utc'],
  offset: 0,
  ids: [af + 'Abidjan', af + 'Accra', af + 'Bamako', af + 'Banjul', af + 'Bissau', af + 'Conakry', af + 'Dakar', af + 'Freetown', af + 'Lome', af + 'Monrovia', af + 'Nouakchott', af + 'Ouagadougou', af + 'Sao_Tome', am + 'Danmarkshavn', 'Antarctica/Troll', 'Atlantic/Reykjavik', 'Atlantic/St_Helena', 'ETC/GMT', 'Atlantic/Azores', 'Africa/Timbuktu', 'America/Scoresbysund']
}, //North america
{
  std: {
    name: 'Central Standard Time',
    abbrev: 'CST'
  },
  dl: {
    name: 'Central Daylight Time',
    abbrev: 'CDT'
  },
  pick: 'Canada/Central',
  offset: -5,
  ids: [am + 'Bahia_Banderas', am + 'Belize', am + 'Chicago', am + 'Costa_Rica', am + 'El_Salvador', am + 'Guatemala', am + 'Indiana', am + 'Managua', am + 'Matamoros', am + 'Menominee', am + 'Merida', am + 'Mexico_City', am + 'Monterrey', am + 'North_Dakota', am + 'North_Dakota', am + 'North_Dakota', am + 'Rainy_River', am + 'Rankin_Inlet', am + 'Regina', am + 'Resolute', am + 'Swift_Current', am + 'Tegucigalpa', am + 'Winnipeg', 'Canada/Central', 'Mexico/General', 'America/Knox_In', 'America/Atikokan', 'America/Guayaquil', 'America/Porto_Acre']
}, {
  std: {
    name: 'Mountain Standard Time',
    abbrev: 'MST'
  },
  dl: {
    name: 'Mountain Daylight Time',
    abbrev: 'MDT'
  },
  pick: 'Canada/Mountain',
  offset: -6,
  ids: [am + 'Boise', am + 'Cambridge_Bay', am + 'Creston', am + 'Dawson_Creek', am + 'Denver', am + 'Edmonton', am + 'Fort_Nelson', am + 'Inuvik', am + 'Ojinaga', am + 'Phoenix', am + 'Yellowknife', // add mexico
  am + 'Chihuahua', am + 'Hermosillo', am + 'Mazatlan', 'Canada/Mountain', 'Pacific/Easter', 'Mexico/Bajasur', 'America/Shiprock', 'Canada/Saskatchewan', 'Pacific/Galapagos']
}, {
  std: {
    name: 'Atlantic Standard Time',
    abbrev: 'AST'
  },
  dl: {
    name: 'Atlantic Daylight Time',
    abbrev: 'ADT'
  },
  pick: 'Canada/Atlantic',
  offset: -4,
  ids: [am + 'Anguilla', am + 'Antigua', am + 'Aruba', am + 'Barbados', am + 'Blanc-sablon', am + 'Curacao', am + 'Dominica', am + 'Glace_Bay', am + 'Goose_Bay', am + 'Grenada', am + 'Guadeloupe', am + 'Halifax', am + 'Kralendijk', am + 'Lower_Princes', am + 'Marigot', am + 'Martinique', am + 'Moncton', am + 'Montserrat', am + 'Port_Of_Spain', am + 'Puerto_Rico', am + 'Santo_Domingo', am + 'St_Barthelemy', am + 'St_Kitts', am + 'St_Lucia', am + 'St_Thomas', am + 'St_Vincent', am + 'Thule', am + 'Tortola', 'Atlantic/Bermuda', 'Canada/Atlantic', 'Chile/Continental', 'America/Fort_Wayne', 'America/Guyana', 'America/Virgin']
}, {
  std: {
    name: 'Eastern Standard Time',
    abbrev: 'EST'
  },
  dl: {
    name: 'Eastern Daylight Time',
    abbrev: 'EDT'
  },
  pick: 'Canada/Eastern',
  alias: ['eastern', 'east'],
  offset: -5,
  ids: [am + 'Cancun', am + 'Cayman', am + 'Coral_Harbour', am + 'Detroit', am + 'Grand_Turk', am + 'Indiana', am + 'Indianapolis', am + 'Iqaluit', am + 'Jamaica', am + 'Kentucky', am + 'Louisville', am + 'Nassau', am + 'New_York', am + 'Nipigon', am + 'Panama', am + 'Pangnirtung', am + 'Port-au-prince', am + 'Thunder_Bay', am + 'Toronto', am + 'Montreal', 'Canada/Eastern']
}, {
  std: {
    name: 'Pacific Standard Time',
    abbrev: 'PST'
  },
  dl: {
    name: 'Pacific Daylight Time',
    abbrev: 'PDT'
  },
  pick: 'Canada/Pacific',
  offset: -7,
  ids: [am + 'Dawson', am + 'Los_Angeles', am + 'Tijuana', am + 'Vancouver', am + 'Whitehorse', 'Canada/Pacific']
}, {
  std: {
    name: 'Alaskan Standard Time',
    abbrev: 'AHST'
  },
  dl: {
    name: 'Alaskan Daylight Time',
    abbrev: 'AHDT'
  },
  pick: am + 'Anchorage',
  offset: -8,
  ids: [am + 'Anchorage', am + 'Juneau', am + 'Metlakatla', am + 'Nome', am + 'Sitka', am + 'Yakutat']
}, {
  std: {
    name: 'Hawaiian Standard Time',
    abbrev: 'HST'
  },
  alias: ['aleutian', 'hawaii'],
  pick: pa + 'Honolulu',
  offset: -9,
  ids: [am + 'Adak', pa + 'Honolulu', pa + 'Johnston']
}, {
  std: {
    name: 'Newfoundland Standard Time',
    abbrev: 'NST'
  },
  dl: {
    name: 'Newfoundland Daylight Time',
    abbrev: 'NDT'
  },
  pick: am + 'St_Johns',
  offset: -2.5,
  ids: [am + 'St_Johns', 'Canada/Newfoundland']
}, ///Europe
{
  std: {
    name: 'Central European Time',
    abbrev: 'CET'
  },
  dl: {
    name: 'Central European Summer Time',
    abbrev: 'CEST'
  },
  alias: ['romance', 'central europe'],
  pick: eu + 'Berlin',
  offset: 1,
  ids: [af + 'Algiers', af + 'Ceuta', af + 'Tunis', 'arctic/Longyearbyen', eu + 'Amsterdam', eu + 'Andorra', eu + 'Belgrade', eu + 'Berlin', eu + 'Bratislava', eu + 'Brussels', eu + 'Budapest', eu + 'Busingen', eu + 'Copenhagen', eu + 'Gibraltar', eu + 'Ljubljana', eu + 'Luxembourg', eu + 'Madrid', eu + 'Malta', eu + 'Monaco', eu + 'Oslo', eu + 'Paris', eu + 'Podgorica', eu + 'Prague', eu + 'Rome', eu + 'San_Marino', eu + 'Sarajevo', eu + 'Skopje', eu + 'Stockholm', eu + 'Tirane', eu + 'Vaduz', eu + 'Vatican', eu + 'Vienna', eu + 'Warsaw', eu + 'Zagreb', eu + 'Zurich']
}, {
  std: {
    name: 'Eastern European Time',
    abbrev: 'EET'
  },
  dl: {
    name: 'Eastern European Summer Time',
    abbrev: 'EEST'
  },
  alias: ['eastern europe'],
  pick: eu + 'Riga',
  offset: 2,
  ids: [af + 'Cairo', af + 'Tripoli', as + 'Amman', as + 'Beirut', as + 'Damascus', as + 'Famagusta', as + 'Gaza', as + 'Hebron', as + 'Nicosia', eu + 'Athens', eu + 'Bucharest', eu + 'Chisinau', eu + 'Helsinki', eu + 'Kaliningrad', eu + 'Kiev', eu + 'Mariehamn', eu + 'Riga', eu + 'Sofia', eu + 'Tallinn', eu + 'Uzhgorod', eu + 'Vilnius', eu + 'Zaporozhye']
}, {
  std: {
    name: 'Western European Time',
    abbrev: 'WET'
  },
  dl: {
    name: 'Western European Summer Time',
    abbrev: 'WEST'
  },
  alias: ['western europe'],
  pick: eu + 'Lisbon',
  offset: 1,
  ids: [af + 'Casablanca', af + 'El_Aaiun', 'Atlantic/Canary', 'Atlantic/Faeroe', 'Atlantic/Madeira', eu + 'Lisbon']
}, {
  std: {
    name: 'Turkey Standard Time',
    abbrev: 'TRT'
  },
  alias: ['turkish'],
  pick: eu + 'Istanbul',
  offset: 3,
  ids: [eu + 'Istanbul', 'Asia/Istanbul']
}, // samara: [eu + 'Samara', eu + 'Saratov'],
//Africa
{
  std: {
    name: 'East Africa Time',
    abbrev: 'EAT'
  },
  alias: ['east african', 'eastern africa'],
  pick: af + 'Nairobi',
  offset: 3,
  ids: [af + 'Addis_Ababa', af + 'Asmera', af + 'Dar_Es_Salaam', af + 'Djibouti', af + 'Juba', af + 'Kampala', af + 'Mogadishu', af + 'Nairobi', 'Indian/Antananarivo', 'Indian/Comoro', 'Indian/Mayotte', 'Antarctica/Syowa', 'Europe/Nicosia', 'Europe/Tiraspol', 'Africa/Asmara']
}, {
  std: {
    name: 'Central Africa Time',
    abbrev: 'CAT'
  },
  pick: af + 'Khartoum',
  alias: ['central africa'],
  offset: 2,
  ids: [af + 'Blantyre', af + 'Bujumbura', af + 'Gaborone', af + 'Harare', af + 'Khartoum', af + 'Kigali', af + 'Lubumbashi', af + 'Lusaka', af + 'Maputo', af + 'Windhoek']
}, {
  std: {
    name: 'South Africa Standard Time',
    abbrev: 'SAST'
  },
  alias: ['southern africa', 'south african'],
  pick: af + 'Johannesburg',
  offset: 2,
  ids: [af + 'Johannesburg', af + 'Maseru', af + 'Mbabane']
}, {
  std: {
    name: 'West Africa Standard Time',
    abbrev: 'WAT'
  },
  alias: ['western africa', 'west african'],
  pick: af + 'Lagos',
  offset: 1,
  ids: [af + 'Bangui', af + 'Brazzaville', af + 'Douala', af + 'Kinshasa', af + 'Lagos', af + 'Libreville', af + 'Luanda', af + 'Malabo', af + 'Ndjamena', af + 'Niamey', af + 'Porto-novo']
}, //Australia
{
  std: {
    name: 'Australian Central Standard Time',
    abbrev: 'ACST'
  },
  dl: {
    name: 'Australian Central Daylight Time',
    abbrev: 'ACDT'
  },
  alias: ['australia central'],
  pick: au + 'Adelaide',
  offset: 9.5,
  ids: [au + 'Adelaide', au + 'Broken_Hill', au + 'Darwin', 'Australia/South', 'Australia/Yancowinna', 'Australia/North']
}, {
  std: {
    name: 'Australian Eastern Standard Time',
    abbrev: 'AEST'
  },
  dl: {
    name: 'Australian Eastern Daylight Time',
    abbrev: 'AEDT'
  },
  alias: ['australia east'],
  pick: au + 'Brisbane',
  offset: 10,
  ids: [au + 'Brisbane', au + 'Currie', au + 'Hobart', au + 'Lindeman', au + 'Melbourne', au + 'Sydney', 'Australia/Act', 'Australia/Canberra', 'Australia/Nsw', 'Australia/Tasmania', 'Australia/Victoria', 'Antarctica/Dumontdurville', 'Australia/Queensland', 'Pacific/Chuuk', 'Pacific/Truk', 'Pacific/Yap']
}, {
  std: {
    name: 'Australian Western Standard Time',
    abbrev: 'AWST'
  },
  dl: {
    name: 'Australian Western Daylight Time',
    abbrev: 'AWDT'
  },
  alias: ['australia west'],
  pick: au + 'Perth',
  offset: 8,
  ids: ['Antarctica/Casey', au + 'Perth']
}, {
  std: {
    name: 'Australian Central Western Standard Time',
    abbrev: 'ACWST'
  },
  alias: ['australia central west'],
  pick: au + 'Eucla',
  offset: 8.75,
  ids: [au + 'Eucla']
}, {
  std: {
    name: 'Lord Howe Standard Time',
    abbrev: 'LHST'
  },
  dl: {
    name: 'Lord Howe Daylight Time',
    abbrev: 'LHDT'
  },
  pick: au + 'Lord_Howe',
  offset: 10.5,
  ids: [au + 'Lord_Howe']
}, {
  std: {
    name: 'New Zealand Standard Time',
    abbrev: 'NZST'
  },
  dl: {
    name: 'New Zealand Daylight Time',
    abbrev: 'NZDT'
  },
  pick: pa + 'Auckland',
  offset: 12,
  ids: ['Antarctica/Mcmurdo', pa + 'Auckland', 'Pacific/Fiji', 'Asia/Srednekolymsk', 'Pacific/Funafuti', 'Pacific/Nauru', 'Pacific/Tarawa', 'Pacific/Wake', 'Pacific/Wallis']
}, {
  std: {
    name: 'Chatham Island Standard Time',
    abbrev: 'CHAST'
  },
  dl: {
    name: 'Chatham Island Daylight Time',
    abbrev: 'CHADT'
  },
  pick: pa + 'Chatham',
  offset: 12.75,
  ids: [pa + 'Chatham']
}, //Russia
{
  std: {
    name: 'Russian Standard Time',
    abbrev: 'MSK'
  },
  alias: ['russian'],
  pick: eu + 'Moscow',
  offset: 4,
  ids: [eu + 'Astrakhan', eu + 'Minsk', eu + 'Moscow', eu + 'Simferopol', eu + 'Ulyanovsk', eu + 'Kirov', 'Asia/Yerevan', 'Europe/Samara', 'Europe/Saratov', 'Asia/Volgograd']
}, {
  std: {
    name: 'Volgograd Time',
    abbrev: 'VOLT'
  },
  offset: 4,
  ids: [eu + 'Volgograd']
}, //South america
{
  std: {
    name: 'Brazil Time',
    abbrev: 'BRT'
  },
  alias: ['brasília', 'brasilia', 'brazilian'],
  pick: am + 'Sao_Paulo',
  offset: -3,
  ids: [am + 'Araguaina', am + 'Bahia', am + 'Belem', am + 'Fortaleza', am + 'Maceio', am + 'Recife', am + 'Santarem', am + 'Sao_Paulo', 'Brazil/Acre', 'Brazil/Denoronha', 'Brazil/East', 'Brazil/West']
}, {
  std: {
    name: 'Argentina Time',
    abbrev: 'ART'
  },
  alias: ['argentinian'],
  pick: am + 'Buenos_Aires',
  offset: -3,
  ids: [am + 'Argentina', am + 'Buenos_Aires', am + 'Catamarca', am + 'Cordoba', am + 'Jujuy', am + 'Mendoza']
}, {
  std: {
    name: 'Amazon Time',
    abbrev: 'AMT'
  },
  alias: ['amazonian'],
  pick: am + 'Manaus',
  offset: -4,
  ids: [am + 'Boa_Vista', am + 'Campo_Grande', am + 'Cuiaba', //Has dst?
  am + 'Manaus', am + 'Porto_Velho']
}, {
  std: {
    name: 'Easter Island Standard Time',
    abbrev: 'EAST'
  },
  dl: {
    name: 'Easter Island Summer Time',
    abbrev: 'EASST'
  },
  offset: -6,
  ids: ['Chile/EasterIsland']
}, {
  std: {
    name: 'Venezuelan Standard Time',
    abbrev: 'VET'
  },
  alias: ['venezuela'],
  offset: -4,
  ids: [am + 'Caracas']
}, {
  std: {
    name: 'Paraguay Time',
    abbrev: 'PYT'
  },
  dl: {
    name: 'Paraguay Summer Time',
    abbrev: 'PYST'
  },
  offset: -4,
  ids: [am + 'Asuncion']
}, {
  std: {
    name: 'Cuba Standard Time',
    abbrev: 'CST'
  },
  dl: {
    name: 'Cuba Daylight Time',
    abbrev: 'CDT'
  },
  alias: ['cuban'],
  offset: -4,
  ids: [am + 'Havana']
}, {
  std: {
    name: 'Bolivia Time',
    abbrev: 'BOT'
  },
  alias: ['bolivian'],
  offset: -4,
  ids: [am + 'La_Paz']
}, {
  std: {
    name: 'Colombia Time',
    abbrev: 'COT'
  },
  alias: ['colombian'],
  offset: -5,
  ids: [am + 'Bogota']
}, {
  std: {
    name: 'Acre Time',
    abbrev: 'ACT'
  },
  pick: null,
  offset: -5,
  ids: [am + 'Eirunepe', am + 'Rio_Branco']
}, {
  std: {
    name: 'Peru Time',
    abbrev: 'PET'
  },
  offset: -5,
  ids: [am + 'Lima']
}, {
  std: {
    name: 'Chile Standard Time',
    abbrev: 'CLST'
  },
  dl: {
    name: 'Chile Summer Time',
    abbrev: 'CLDT'
  },
  pick: null,
  offset: -3,
  ids: [am + 'Punta_Arenas', am + 'Santiago', 'Antarctica/Palmer']
}, {
  std: {
    name: 'Uruguay Time',
    abbrev: 'UYT'
  },
  offset: -3,
  ids: [am + 'Montevideo']
}, // argentina_Western: [am + 'Argentina/San_Luis'],
// french_Guiana: [am + 'Cayenne'],
// greenland_Western: [am + 'Godthab'],
// ecuador: [am + 'Guayaquil'],
// guyana: [am + 'Guyana'],
// pierre_Miquelon: [am + 'Miquelon'],
// noronha: [am + 'Noronha'],
// suriname: [am + 'Paramaribo'],
// mexico_Northwest: [am + 'Santa_Isabel'],
//Middle-east
{
  std: {
    name: 'Arabic Standard Time',
    abbrev: 'AST'
  },
  pick: as + 'Baghdad',
  alias: ['arabic', 'arab'],
  offset: 3,
  ids: [as + 'Aden', as + 'Baghdad', as + 'Bahrain', as + 'Kuwait', as + 'Qatar', as + 'Riyadh']
}, {
  std: {
    name: 'Iran Standard Time',
    abbrev: 'IRST'
  },
  dl: {
    name: 'Iran Daylight Time',
    abbrev: 'IRDT'
  },
  alias: ['iranian'],
  pick: as + 'Tehran',
  offset: 4.5,
  ids: [as + 'Tehran']
}, {
  std: {
    name: 'Pakistan Standard Time',
    abbrev: 'PKT'
  },
  pick: as + 'Karachi',
  offset: 5,
  ids: [as + 'Karachi']
}, {
  std: {
    name: 'India Standard Time',
    abbrev: 'IST'
  },
  alias: ['indian'],
  pick: as + 'Kolkata',
  offset: 5.5,
  ids: [as + 'Kolkata', as + 'Colombo', 'Asia/Calcutta']
}, {
  std: {
    name: 'Indochina Time',
    abbrev: 'ICT'
  },
  alias: ['South East Asia'],
  pick: as + 'Bangkok',
  offset: 7,
  ids: [as + 'Bangkok', as + 'Phnom_Penh', as + 'Saigon', as + 'Vientiane']
}, {
  std: {
    name: 'China Standard Time',
    abbrev: 'CT'
  },
  //cst?
  alias: ['chinese'],
  pick: as + 'Shanghai',
  offset: 8,
  ids: [as + 'Macau', as + 'Shanghai', as + 'Taipei']
}, {
  std: {
    name: 'Alma-Ata Time',
    abbrev: 'ALMT'
  },
  pick: as + 'Almaty',
  offset: 6,
  ids: [as + 'Almaty', as + 'Qostanay']
}, {
  std: {
    name: 'Oral Time',
    abbrev: 'ORAT'
  },
  pick: as + 'Oral',
  offset: 5,
  ids: [as + 'Aqtau', as + 'Aqtobe', as + 'Atyrau', as + 'Oral', as + 'Qyzylorda']
}, {
  std: {
    name: 'Yakutsk Time',
    abbrev: 'YAKT'
  },
  pick: as + 'Yakutsk',
  offset: 9,
  ids: [as + 'Chita', as + 'Khandyga', as + 'Yakutsk']
}, {
  std: {
    name: 'Gulf Standard Time',
    abbrev: 'GST'
  },
  pick: as + 'Dubai',
  alias: ['uae'],
  offset: 4,
  ids: [as + 'Dubai', as + 'Muscat']
}, {
  std: {
    name: 'Hong Kong Time',
    abbrev: 'HKT'
  },
  offset: 8,
  ids: [as + 'Hong_Kong']
}, {
  std: {
    name: 'Western Indonesian Time',
    abbrev: 'WIB'
  },
  alias: ['indonesia'],
  //most of it
  offset: 7,
  ids: [as + 'Jakarta', as + 'Pontianak', as + 'Jayapura']
}, {
  std: {
    name: 'Central Indonesian Time',
    abbrev: 'WITA'
  },
  offset: 8,
  ids: [as + 'Makassar']
}, {
  std: {
    name: 'Israel Daylight Time',
    abbrev: 'IDT'
  },
  dl: {
    name: 'Israel Standard Time',
    abbrev: 'IST'
  },
  alias: ['israeli'],
  offset: 3,
  ids: [as + 'Jerusalem', 'Asia/Tel_Aviv']
}, {
  std: {
    name: 'Krasnoyarsk Time',
    abbrev: 'KRAT'
  },
  offset: 7,
  ids: [as + 'Krasnoyarsk', as + 'Novokuznetsk', as + 'Barnaul']
}, {
  std: {
    name: 'Malaysia Time',
    abbrev: 'MYT'
  },
  offset: 8,
  ids: [as + 'Kuala_Lumpur', as + 'Kuching']
}, {
  std: {
    name: 'Singapore Time',
    abbrev: 'SGT'
  },
  offset: 8,
  ids: [as + 'Singapore']
}, {
  std: {
    name: 'Korea Standard Time',
    abbrev: 'KST'
  },
  pick: as + 'Seoul',
  alias: ['korean'],
  offset: 9,
  ids: [as + 'Pyongyang', as + 'Seoul']
}, {
  std: {
    name: 'Uzbekistan Time',
    abbrev: 'UZT'
  },
  offset: 5,
  ids: [as + 'Samarkand', as + 'Tashkent']
}, {
  std: {
    name: 'Vladivostok Time',
    abbrev: 'VLAT'
  },
  pick: as + 'Vladivostok',
  offset: 10,
  ids: [as + 'Ust-nera', as + 'Vladivostok']
}, {
  std: {
    name: 'Anadyr Time',
    abbrev: 'ANAT'
  },
  offset: 12,
  ids: [as + 'Anadyr']
}, {
  std: {
    name: 'Turkmenistan Time',
    abbrev: 'TMT'
  },
  offset: 5,
  ids: [as + 'Ashgabat']
}, {
  std: {
    name: 'Azerbaijan Time',
    abbrev: 'AZT'
  },
  offset: 5,
  ids: [as + 'Baku']
}, {
  std: {
    name: 'Kyrgyzstan Time',
    abbrev: 'KGT'
  },
  offset: 6,
  ids: [as + 'Bishkek']
}, {
  std: {
    name: 'Brunei Darussalam Time',
    abbrev: 'BNT'
  },
  offset: 8,
  ids: [as + 'Brunei']
}, // choibalsan: [as+ 'Choibalsan'],
// east_Timor: [as+ 'Dili'],
// tajikistan: [as+ 'Dushanbe'],
// hovd: [as+ 'Hovd'],
// irkutsk: [as+ 'Irkutsk'],
{
  std: {
    name: 'Afghanistan Time',
    abbrev: 'AFT'
  },
  offset: 4.5,
  ids: [as + 'Kabul']
}, {
  std: {
    name: 'Kamchatka Time',
    abbrev: 'PETT'
  },
  offset: 12,
  ids: [as + 'Kamchatka']
}, {
  std: {
    name: 'Nepal Time',
    abbrev: 'NPT'
  },
  offset: 5.75,
  ids: [as + 'Katmandu']
}, // magadan: [as+ 'Magadan'],
{
  std: {
    name: 'Philippine Time',
    abbrev: 'PHT'
  },
  offset: 8,
  ids: [as + 'Manila']
}, // novosibirsk: [as+ 'Novosibirsk'],
// omsk: [as+ 'Omsk'],
{
  std: {
    name: 'Myanmar Time',
    abbrev: 'MMT'
  },
  offset: 6.5,
  ids: [as + 'Rangoon', 'Asia/yangon']
}, // sakhalin: [as+ 'Sakhalin'],
// srednekolymsk: [as+ 'Srednekolymsk'],
{
  std: {
    name: 'Georgia Standard Time',
    abbrev: 'GET'
  },
  offset: 4,
  ids: [as + 'Tbilisi']
}, // bhutan: [as+ 'Thimphu'],
{
  std: {
    name: 'Japan Standard Time',
    abbrev: 'JST'
  },
  offset: 9,
  ids: [as + 'Tokyo']
}, {
  std: {
    name: 'Ulaanbaatar Time',
    abbrev: 'ULAT'
  },
  offset: 8,
  ids: [as + 'Ulaanbaatar']
}, // urumqi: [as+ 'Urumqi'],
// yekaterinburg: [as+ 'Yekaterinburg'],
// armenia: [as+ 'Yerevan'],
// azores: ['Atlantic/Azores'],
// cape_Verde: ['Atlantic/Cape_Verde'],
// south_Georgia: ['Atlantic/South_Georgia'],
// falkland: ['Atlantic/Stanley'],
//India
{
  std: {
    name: 'Maldives Time',
    abbrev: 'MVT'
  },
  offset: 5,
  ids: ['Indian/Maldives']
}, {
  std: {
    name: 'Mauritius Time',
    abbrev: 'MUT'
  },
  offset: 4,
  ids: ['Indian/Mauritius']
}, {
  std: {
    name: 'Marshall Islands Time',
    abbrev: 'MHT'
  },
  offset: 12,
  ids: [pa + 'Kwajalein', pa + 'Majuro']
}, {
  std: {
    name: 'Samoa Standard Time',
    abbrev: 'SST'
  },
  alias: ['somoan'],
  offset: -11,
  ids: [pa + 'Midway', pa + 'Pago_Pago']
}, {
  std: {
    name: 'Chamorro Standard Time',
    abbrev: 'CHST'
  },
  offset: 10,
  ids: [pa + 'Guam', pa + 'Saipan']
}, {
  std: {
    name: 'Papua New Guinea Time',
    abbrev: 'PGT'
  },
  offset: 11,
  ids: [pa + 'Bougainville', pa + 'Port_Moresby', 'Antarctica/Macquarie', 'Asia/Magadan', 'Asia/Sakhalin', 'Pacific/Efate', 'Pacific/Guadalcanal', 'Pacific/Kosrae', 'Pacific/Noumea', 'Pacific/Pohnpei', 'Pacific/Ponape']
}, // ambiguous abbrevs
// { std: { name: 'Bangladesh Standard Time', abbrev: 'BST' },  offset: 0, ids: [as + 'Dhaka'] }
{
  std: {
    name: 'Indian Ocean Time',
    abbrev: 'IOT'
  },
  offset: 6,
  ids: ['Indian/Chagos']
} // christmas: ['Indian/Christmas'],
// cocos: ['Indian/Cocos'],
// french_Southern: ['Indian/Kerguelen'],
// seychelles: ['Indian/Mahe'],
// reunion: ['Indian/Reunion'],
//Pacific
// apia: [pa+ 'Apia'],
// easter: [pa+ 'Easter'],
// vanuatu: [pa+ 'Efate'],
// phoenix_Islands: [pa+ 'Enderbury'],
// tokelau: [pa+ 'Fakaofo'],
// fiji: [pa+ 'Fiji'],
// tuvalu: [pa+ 'Funafuti'],
// galapagos: [pa+ 'Galapagos'],
// gambier: [pa+ 'Gambier'],
// solomon: [pa+ 'Guadalcanal'],
// line_Islands: [pa+ 'Kiritimati'],
// kosrae: [pa+ 'Kosrae'],
// marquesas: [pa+ 'Marquesas'],
// nauru: [pa+ 'Nauru'],
// niue: [pa+ 'Niue'],
// norfolk: [pa+ 'Norfolk'],
// new_Caledonia: [pa+ 'Noumea'],
// palau: [pa+ 'Palau'],
// pitcairn: [pa+ 'Pitcairn'],
// ponape: [pa+ 'Ponape'],
// cook: [pa+ 'Rarotonga'],
// tahiti: [pa+ 'Tahiti'],
// gilbert_Islands: [pa+ 'Tarawa'],
// tonga: [pa+ 'Tongatapu'],
// truk: [pa+ 'Truk'],
// wake: [pa+ 'Wake'],
// wallis: [pa+ 'Wallis'],
// tomsk: [as+ 'Tomsk']
// antarctic
// greenland_Eastern: [am + 'Scoresbysund'],
// davis: ['Antarctica/Davis'],
// dumontdurville: ['Antarctica/Dumontdurville'],
// macquarie: ['Antarctica/Macquarie'],
// mawson: ['Antarctica/Mawson'],
// rothera: ['Antarctica/Rothera'],
// syowa: ['Antarctica/Syowa'],
// vostok: ['Antarctica/Vostok'],
];

var offsets = {
  'asia/dili': '+9',
  'pacific/palau': '+9',
  'australia/west': '+8',
  'asia/ulan_bator': '+8/+7',
  'asia/choibalsan': '+8',
  'asia/chongqing': '+8',
  'asia/chungking': '+8',
  'asia/harbin': '+8',
  'asia/irkutsk': '+8',
  'asia/macao': '+8',
  'asia/ujung_pandang': '+8',
  'antarctica/davis': '+7',
  'indian/christmas': '+7',
  'asia/ho_chi_minh': '+7',
  'asia/hovd': '+7',
  'asia/novosibirsk': '+7',
  'asia/tomsk': '+7',
  'antarctica/vostok': '+6',
  'asia/dacca': '+6',
  'asia/dhaka': '+6',
  'asia/kashgar': '+6',
  'asia/omsk': '+6',
  'asia/thimbu': '+6',
  'asia/thimphu': '+6',
  'asia/urumqi': '+6',
  'indian/cocos': '+6.5',
  'antarctica/mawson': '+5',
  'indian/kerguelen': '+5',
  'asia/ashkhabad': '+5',
  'asia/dushanbe': '+5',
  'asia/yekaterinburg': '+5',
  'asia/kathmandu': '+5.75',
  'indian/reunion': '+4',
  'indian/mahe': '+4',
  'atlantic/jan_mayen': '+2/+1',
  'atlantic/faroe': '+1/0',
  'pacific/kiritimati': '+14',
  'pacific/apia': '+13/+12',
  'pacific/tongatapu': '+13/+12',
  'pacific/enderbury': '+13',
  'pacific/fakaofo': '+13',
  'antarctica/south_pole': '+12/+11',
  'pacific/norfolk': '+11.5/+10.5',
  'australia/lhi': '+10.5/+9.5',
  'etc/greenwich': '0',
  'etc/utc': '0',
  'etc/universal': '0',
  'etc/zulu': '0',
  'america/atka': '-9/-10',
  'pacific/gambier': '-9',
  'pacific/marquesas': '-9.5',
  'pacific/pitcairn': '-8',
  'america/ensenada': '-7/-8',
  'america/santa_isabel': '-7/-8',
  'mexico/bajanorte': '-7/-8',
  'canada/yukon': '-7/-8',
  'canada/east-saskatchewan': '-6',
  'antarctica/rothera': '-3',
  'atlantic/stanley': '-3',
  'america/nuuk': '-3/-4',
  'america/cayenne': '-3',
  'america/paramaribo': '-3',
  'america/rosario': '-3',
  'america/godthab': '-2/-3',
  'america/miquelon': '-2/-3',
  'america/noronha': '-2',
  'atlantic/south_georgia': '-2',
  'atlantic/cape_verde': '-1',
  'pacific/niue': '-11',
  'pacific/samoa': '-11',
  'pacific/rarotonga': '-10',
  'pacific/tahiti': '-10'
};

var titleCase = function titleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

var display = function display(id) {
  if (!id) {
    return null;
  }

  var meta = _05Metazones.find(function (obj) {
    return obj.ids.find(function (tz) {
      return tz === id;
    });
  });

  if (!meta) {
    var offset = offsets[id.toLowerCase()];

    if (offset !== undefined) {
      var abbrev = "UTC".concat(offset);
      var parts = id.split(/\//);
      var name = titleCase(parts[parts.length - 1]);
      name = name.replace(/_/g, ' ');
      name += ' Time';
      meta = {
        std: {
          name: name,
          abbrev: abbrev
        },
        offset: null
      };
    } else {
      meta = {
        std: {
          name: id,
          abbrev: id
        },
        // 'Etc/GMT+5'
        offset: null
      };
    }
  }

  return {
    iana: id,
    standard: meta.std || null,
    daylight: meta.dl || null // offset: meta.offset - 1 || null

  };
};

var display_1 = display;

var _version = '1.1.0';

var soft = function soft(str) {
  var ids = find_1(str) || [];

  if (typeof ids === 'string') {
    ids = [ids];
  }

  ids = ids.map(function (id) {
    return display_1(id);
  });
  return ids;
};

soft.prototype.version = _version;
var src = soft;

export default src;
