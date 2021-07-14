var t=function(t,n){let e=Math.min(t.length,n.length);for(;e>0;){const o=t.slice(0,e);if(o===n.slice(0,e))return o;e-=1;}return ""},n=function(t){t.sort();for(let n=1;n<t.length;n++)t[n-1]===t[n]&&t.splice(n,1);};const e=function(){this.counts={};},o={init:function(t){void 0===this.counts[t]&&(this.counts[t]=0);},add:function(t,n){void 0===n&&(n=1),this.init(t),this.counts[t]+=n;},countOf:function(t){return this.init(t),this.counts[t]},highest:function(t){let n=[];const e=Object.keys(this.counts);for(let t=0;t<e.length;t++){const o=e[t];n.push([o,this.counts[o]]);}return n.sort((function(t,n){return n[1]-t[1]})),t&&(n=n.slice(0,t)),n}};Object.keys(o).forEach((function(t){e.prototype[t]=o[t];}));const s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",i=s.split("").reduce((function(t,n,e){return t[n]=e,t}),{});var r=function(t){if(void 0!==s[t])return s[t];let n=1,e=36,o="";for(;t>=e;t-=e,n++,e*=36);for(;n--;){const n=t%36;o=String.fromCharCode((n<10?48:55)+n)+o,t=(t-n)/36;}return o},u=function(t){if(void 0!==i[t])return i[t];let n=0,e=1,o=36,s=1;for(;e<t.length;n+=o,e++,o*=36);for(let e=t.length-1;e>=0;e--,s*=36){let o=t.charCodeAt(e)-48;o>10&&(o-=7),n+=o*s;}return n};const c=";",h=":",f=",",l="!",d=36,p=function(t,n){let e="",o="";t.isTerminal(n)&&(e+=l);const s=t.nodeProps(n);for(let i=0;i<s.length;i++){const u=s[i];if("number"==typeof n[u]){e+=o+u,o=f;continue}if(t.syms[n[u]._n]){e+=o+u+t.syms[n[u]._n],o="";continue}let c=r(n._n-n[u]._n-1+t.symCount);n[u]._g&&c.length>=n[u]._g.length&&1===n[n[u]._g]?(c=n[u]._g,e+=o+u+c,o=f):(e+=o+u+c,o="");}return e},g=function(t,n){if(t.visited(n))return;const e=t.nodeProps(n,!0);for(let o=0;o<e.length;o++){const s=e[o],i=n._n-n[s]._n-1;i<d&&t.histRel.add(i),t.histAbs.add(n[s]._n,r(i).length-1),g(t,n[s]);}},a=function(t,n){if(void 0!==n._n)return;const e=t.nodeProps(n,!0);for(let o=0;o<e.length;o++)a(t,n[e[o]]);n._n=t.pos++,t.nodes.unshift(n);},y=function(t){t.nodes=[],t.nodeCount=0,t.syms={},t.symCount=0,t.pos=0,t.optimize(),t.histAbs=new e,t.histRel=new e,a(t,t.root),t.nodeCount=t.nodes.length,t.prepDFS(),g(t,t.root),t.symCount=function(t){t.histAbs=t.histAbs.highest(d);const n=[];n[-1]=0;let e=0,o=0;const s=3+r(t.nodeCount).length;for(let i=0;i<d&&void 0!==t.histAbs[i];i++)n[i]=t.histAbs[i][1]-s-t.histRel.countOf(d-i-1)+n[i-1],n[i]>=e&&(e=n[i],o=i+1);return o}(t);for(let n=0;n<t.symCount;n++)t.syms[t.histAbs[n][0]]=r(n);for(let n=0;n<t.nodeCount;n++)t.nodes[n]=p(t,t.nodes[n]);for(let n=t.symCount-1;n>=0;n--)t.nodes.unshift(r(n)+h+r(t.nodeCount-t.histAbs[n][0]-1));return t.nodes.join(c)},m=new RegExp("[0-9A-Z,;!:|¦]"),b={insertWords:function(t){if(void 0!==t){"string"==typeof t&&(t=t.split(/[^a-zA-Z]+/));for(let n=0;n<t.length;n++)t[n]=t[n].toLowerCase();n(t);for(let n=0;n<t.length;n++)null===t[n].match(m)&&this.insert(t[n]);}},insert:function(n){this._insert(n,this.root);const e=this.lastWord;this.lastWord=n;if(t(n,e)===e)return;const o=this.uniqueNode(e,n,this.root);o&&this.combineSuffixNode(o);},_insert:function(n,e){let o,s;if(0===n.length)return;const i=Object.keys(e);for(let r=0;r<i.length;r++){const u=i[r];if(o=t(n,u),0!==o.length){if(u===o&&"object"==typeof e[u])return void this._insert(n.slice(o.length),e[u]);if(u===n&&"number"==typeof e[u])return;return s={},s[u.slice(o.length)]=e[u],this.addTerminal(s,n=n.slice(o.length)),delete e[u],e[o]=s,void this.wordCount++}}this.addTerminal(e,n),this.wordCount++;},addTerminal:function(t,n){if(n.length<=1)return void(t[n]=1);const e={};t[n[0]]=e,this.addTerminal(e,n.slice(1));},nodeProps:function(t,n){const e=[];for(const o in t)""!==o&&"_"!==o[0]&&(n&&"object"!=typeof t[o]||e.push(o));return e.sort(),e},optimize:function(){this.combineSuffixNode(this.root),this.prepDFS(),this.countDegree(this.root),this.prepDFS(),this.collapseChains(this.root);},combineSuffixNode:function(t){if(t._c)return t;let n=[];this.isTerminal(t)&&n.push("!");const e=this.nodeProps(t);for(let o=0;o<e.length;o++){const s=e[o];"object"==typeof t[s]?(t[s]=this.combineSuffixNode(t[s]),n.push(s),n.push(t[s]._c)):n.push(s);}n=n.join("-");const o=this.suffixes[n];return o||(this.suffixes[n]=t,t._c=this.cNext++,t)},prepDFS:function(){this.vCur++;},visited:function(t){return t._v===this.vCur||(t._v=this.vCur,!1)},countDegree:function(t){if(void 0===t._d&&(t._d=0),t._d++,this.visited(t))return;const n=this.nodeProps(t,!0);for(let e=0;e<n.length;e++)this.countDegree(t[n[e]]);},collapseChains:function(t){let n,e,o,s;if(!this.visited(t)){for(e=this.nodeProps(t),s=0;s<e.length;s++)n=e[s],o=t[n],"object"==typeof o&&(this.collapseChains(o),void 0===o._g||1!==o._d&&1!==o._g.length||(delete t[n],n+=o._g,t[n]=o[o._g]));1!==e.length||this.isTerminal(t)||(t._g=n);}},isTerminal:function(t){return !!t[""]},uniqueNode:function(t,n,e){const o=this.nodeProps(e,!0);for(let s=0;s<o.length;s++){const i=o[s];if(i===t.slice(0,i.length))return i!==n.slice(0,i.length)?e[i]:this.uniqueNode(t.slice(i.length),n.slice(i.length),e[i])}},pack:function(){return y(this)}};Object.keys(b).forEach((function(t){}));const j=function(t,n,e){const o=u(n);return o<t.symCount?t.syms[o]:e+o+1-t.symCount},A=function(t){const n={nodes:t.split(";"),syms:[],symCount:0};return t.match(":")&&function(t){const n=new RegExp("([0-9A-Z]+):([0-9A-Z]+)");for(let e=0;e<t.nodes.length;e++){const o=n.exec(t.nodes[e]);if(!o){t.symCount=e;break}t.syms[u(o[1])]=u(o[2]);}t.nodes=t.nodes.slice(t.symCount,t.nodes.length);}(n),function(t){const n=[],e=(o,s)=>{let i=t.nodes[o];"!"===i[0]&&(n.push(s),i=i.slice(1));const r=i.split(/([A-Z0-9,]+)/g);for(let i=0;i<r.length;i+=2){const u=r[i],c=r[i+1];if(!u)continue;const h=s+u;if(","===c||void 0===c){n.push(h);continue}const f=j(t,c,o);e(f,h);}};return e(0,""),n}(n)},O=function(t){const n=t.split("|").reduce(((t,n)=>{const e=n.split("¦");return t[e[0]]=e[1],t}),{}),e={};return Object.keys(n).forEach((function(t){const o=A(n[t]);"true"===t&&(t=!0);for(let n=0;n<o.length;n++){const s=o[n];!0===e.hasOwnProperty(s)?!1===Array.isArray(e[s])?e[s]=[e[s],t]:e[s].push(t):e[s]=t;}})),e};

var pckd = "Africa/Abidjan¦a2bouake,daloa,san ped1t0yamoussouk1;g,ogo;ro;b0frica/timbuktu;idjan,obo|Africa/Algiers¦a5b3c2dz,oran,s1t0;ebessa,iaret;etif,idi bel abbes;hlef,onstantine;a0iskra,lida,oumerdas;b ezzouar,tna;lg0nnaba;eria,iers|Africa/Cairo¦a4bani suwayf,c3damanhur,eg2giza,halw6i1kafr ad dawwar,luxor,new c3port said,qina,s0tanta,zagazig;hibin al kawm,ohag,uez;dku,smail6;!ypt;airo;l2s0;w0yut;an; 1exandr0;ia;fayyum,m0;a0inya;hallah al kubra,nsurah|Africa/El_Aaiun¦e0laayoune,western sahara;h,l aaiun|Africa/Ceuta¦ceuta0;!melilla|Africa/Accra¦a2gh1kumasi,ta0;koradi,male;!ana;ccra,tsiaman|Africa/Bissau¦b1g0;uinea b0w;issau|Africa/Nairobi¦africa7e2kisumu,m1na0thika,yt;irobi,kuru;ayotte,ombasa;. africa standard 3a0ldoret;st0t; africa0ern africa;! 0;time; eastern,/asmera|Africa/Monrovia¦l0monrov1;iber0r;ia|Africa/Tripoli¦a3benghazi,l1misrat4t0zawi2;arhuna,ripoli;ib0y;ya;l khums,z zawiy0;ah|Africa/Casablanca¦a9casablanca,f8kenit7m4oujda angad,rabat,sa2t0;angier,e0;ma5touan;fi,le0;! al jadida;a1ekn3o0;hammedia,rocco;!rrakesh;ra;es;gadir,l hoceima|Africa/Maputo¦beira,c4ma2na1quelimane,z0;imbabwe,w;ca1mpu1;puto,to0;la;entral africa time,himoio|Africa/Windhoek¦africa central,na0windhoek;!mibia0;! standard time|Africa/Lagos¦aYbWcVeUgTiPjOkaMlKmHnFoCport harcourt,sBuAw0zarG;. central africa6a5est0; 0ern1;africa1central0; africa;! 0;s2t3;rCst,t;! s0;tandard t0;ime;gep,muah5yo;a9hagamu,okoto;kFn1w0yo;er5o;do,itsha;g,iger0newi;ia;a0in5ubi;idugu0kurdi;ri;agos,ek0;ki;du0no,tsi0;na;imeEos;badan,jebu ode,k1l0seAwo;a orangun,esa,or6;eAi7ot ekp0;ene;ombe,usau;bute ikorodu,fon alaaye,nugu;alabar,hakwama;auchi,en0;in;b2do1frica western,ku0tani;re; ekiti;a,eoku1u0;ja;ta|Africa/Khartoum¦a6c5el 4k2ny3omdurm1port sud1s0wad medani;d,inga,ud0;an;ass0hartoum,osti;ala;dae2fasher,obeid;at,entral africa;d damaz0l qadarif;in|Africa/Juba¦juba,s0winejok;outh sudan,s|Africa/Sao_Tome¦s0;ao tome,t|Africa/Ndjamena¦chad,n0td;'d0d0;jamena|Africa/Tunis¦sfax,t0;n,unis0;!ia|Africa/Johannesburg¦africa southern,bEcAd9east londBjohannesHk7newcastDp6r5s2tembisa,uitenhage,v1w0za;elkom,itbank;anderbijlpark,ereeniging;ast,o0prings;uth africa0weto;! standard time;andBichards bay,oodepoort;aarl,ietermaritzAort elizabeth,retoria;lerk0ruger0;sdorp;iepsloot,urb5;a1enturi0;on;pe town,rletonvil0;le;enoni,loemfontein,o1rakp0;an;ks0tshabelo;burg|America/Argentina/Buenos_Aires¦argentina/buenos aires|America/Argentina/Cordoba¦a0;merica/0rgentina/c1;c0rosario;ordoba|America/Argentina/Salta¦argentina/salta|America/Argentina/Jujuy¦a0;meric0rgentin0;a/jujuy|America/Argentina/Tucuman¦argentina/tucuman|America/Argentina/Catamarca¦a0;merica/0rgentina/c1;argentina/comodrivadavia,c0;atamarca|America/Argentina/La_Rioja¦argentina/la rioja|America/Argentina/San_Juan¦argentina/san juan|America/Argentina/Mendoza¦a0;meric0rgentin0;a/mendoza|America/Argentina/San_Luis¦argentina/san luis|America/Argentina/Rio_Gallegos¦argentina/rio gallegos|America/Argentina/Ushuaia¦argentina/ushuaia|America/Barbados¦b0;arbados,b|America/La_Paz¦bo1cochabamba,la paz,oruro,s0;anta cruz de la sierra,ucre;!livia0t;! time|America/Noronha¦atlantic islands,brazil/den0fernando de noronha standard time,n0;oronha|America/Belem¦ananindeua,belem,macapa,par0;auapebas,á (east) amapá|America/Fortaleza¦ca2fortaleza,imperatriz,j1m0natal,sao luis,teresina;aracanau,ossoro;oao pessoa,uazeiro do norte;mpina grande,ucaia|America/Recife¦caruaru,jaboatao2olinda,p0recife;aulista,e0;rnambuco,trolina;! dos guararapes|America/Araguaina¦araguaina,palmas,tocantins|America/Maceio¦a0maceio;lagoassergipe,racaju|America/Bahia¦bahia,camacari,feira de santa0itabu0salvador,vitoria da conquista;na|America/Sao_Paulo¦a14b0Tc0Md0Je0Hf0Fg0Ahortol09i05j02l01mXnVosasco,pLriFs4ta3uber2v0;i0olta redon18;amao,la velha,tor14;a0Ml06;boao da ser00uba0Y;a2e1oroNu0;maLzano;rXte lago0L;nt4o 0;bernardo do campo,carl03jo0leopolLpaulo,vicE;ao de meriti,se0;! do0; rio p8s camp00;a 1o0; andDs;barbara d'oes0Nluz0Rmar0R;beirao 3o0;! 0;cla0de janei0g6ver7;ro;das nev07p0;reto;asso fun8e7iraci6lanalti0Mo4r0;aia g1esidente prud0;en0E;ran0;de;nta grossa,rto aleg0;re;caW;lotYtro0D;do;iteroi,ov0;aJo hamburgo;a1o0;gi das cruzSntes clarD;ri0ua;l05n6;imei2ondri06;acarei,oinville,u0;iz de fo0ndi9;ra;ndaia2patin1ta0;bor6pevi,quaquece1;ga;tuG;andW;o3ravat2uaru0;ja,lh0;os;ai;iQvernador valadarC;loria5oz do0ran2; iguacu;. south america Gast south ameri0mbu;ca;i0uque de caxi8;adema,vi0;noL;a1o0uriti2;ntagem,tI;choeiro de itapemirBmp1no3rapicui0scavel,xias do sul;ba;in1os dos goytacaz0;es;as;a9e5lumenau,r0;!a0st,t;silia1zil0;!/east;! 0;standard time;l1t0;im;ford roxo,o horizon0;te;rueri,uru;lvora4merica3na2parecida de goi0;an0;ia;polis;na;da|America/Campo_Grande¦campo grande,mato grosso do sul|America/Cuiaba¦cuiaba,mato grosso,varzea grande|America/Santarem¦pará (west),santarem|America/Porto_Velho¦porto velho,rondônia|America/Boa_Vista¦amazon1boa vista,central brazil0roraima;!ian0;! standard time|America/Manaus¦am0brazil/west,manaus;azonas (east),t|America/Eirunepe¦a0eirunepe;cre standard time,mazonas (west)|America/Rio_Branco¦a0brazil/a0rio branco;cre|America/Nassau¦b0nassau;ahamas,s|America/Belize¦b0;elize,z|America/St_Johns¦canada/newfoundland,n0st johns;d2ewfoundland0st,t;! 0;labrador (southeast),standard time;dt,t|America/Halifax¦a2canada/atlantic,halifax,n1p0;ei,rince edward island;ew brunswick,ova scotia;dt,st,tlantic0;! - ns (most areas) pe|America/Glace_Bay¦atlantic - ns (cape breton),glace bay|America/Moncton¦atlantic - new brunswick,moncton|America/Goose_Bay¦atlantic - labrador (most areas),goose bay|America/Blanc-Sablon¦ast - qc (lower north shore),blanc sablon|America/Toronto¦america/moBb9ca7eastern - onqc (most areas),gatineau,hamilAkitchener,l4m3nepe2o0quebec,richmond hill,toronto,vaugh2windsor;n5sh0tt0;awa;an;arkham,ississauga,o7;av7on0;don on0gueuil;tario;!nada0;!/eastern;arrie,ramp0;ton;ntre0;al|America/Nipigon¦nipigon|America/Thunder_Bay¦eastern - on (thunder bay),thunder bay|America/Iqaluit¦eastern - nu (most east areas),iqaluit|America/Pangnirtung¦eastern - nu (pangnirtung),pangnirtung|America/Atikokan¦atikokan,est - on (atikokan) nu (coral h)|America/Winnipeg¦c0m1winnipeg;anada/central,entral - on (west) m0;anitoba|America/Rainy_River¦central - on (rainy rft frances),rainy river|America/Resolute¦central - nu (resolute),resolute|America/Rankin_Inlet¦central - nu (central),rankin inlet|America/Regina¦c1regina,saskat0;c1oon;anada/saskatc0st - sk (most areas);hewan|America/Swift_Current¦cst - sk (midwest),swift current|America/Edmonton¦alberta,ca0edmonton,mountain - ab bc (e) sk (w);lgary,nada/mountain|America/Cambridge_Bay¦cambridge bay,mountain - nu (west)|America/Yellowknife¦mountain - nt (central),yellowknife|America/Inuvik¦inuvik,mountain - nt (west)|America/Creston¦creston,mst - bc (creston)|America/Dawson_Creek¦dawson creek,mst - bc (dawson crft st john)|America/Fort_Nelson¦fort nelson,mst - bc (ft nelson)|America/Whitehorse¦canada/yukon,pacific - yukon (south),whitehorse|America/Dawson¦dawson,pacific - yukon (north)|America/Vancouver¦b2canada/pacific,ladn1okanagan,pacific - bc (most areas),surrey,v0yukon;ancouv0ictor2;er;ritish columb0urnaby;ia|America/Santiago¦a7c4iquique,la pintana,puente alto,rancagua,san3t1v0;alparaiso,ina del mar;alca0emuco;!huano; bernardo,tiago;hile1l0oncepcion;!st,t;! (most areas),/continental;ntofagasta,rica|America/Punta_Arenas¦punta arenas,region of magallanes|America/Bogota¦armenGbBc7dosquebradas,floridablanca,i6m5neiva,p3s1v0;alledupar,illavicencio;anta marCincelejo,o0;acha,ledad;a0erei9opayan;lmi8sto;anizales,edellin,onterA;bague,taguei;a2o0ucu6;!lombia0st,t;! standard time;li,rtagena;arran3ello,ogo2u0;caramanga,enaventu0;ra;ta;cabermeja,quilla;ia|America/Costa_Rica¦c0;osta rica,r|America/Havana¦arroyo naranjo,b7c2diez de octubre,guantan9h1las tunas,pinar del rio,sant0;a clara,iago de cuba;avana,olguin;amaguey,i2u0;!ba0;! standard time;e0udad camilo cie0;nfueg1;ay1oyer0;os;amo|America/Curacao¦curacao,s0;t maarten,x|America/Santo_Domingo¦bella vista,do5la romana,san0; pedro de macoris,t0;iago de los caballeros,o domingo0;! 0;e0oe0;ste;!minican republic|America/Guayaquil¦cuenca,ec1guayaquil,ma0quito,santo domingo de los colorados;chala,nta;!uador0;! 0;(mainland),time|America/Cayenne¦cayenne,french guiana1gf0;!t;! time|America/Nuuk¦america/godthab,nuuk|America/Danmarkshavn¦danmarkshavn,national park (east coast)|America/Scoresbysund¦e1greenland eastern,scoresbysund0;!/ittoqqortoormiit;ast greenland1g0;st,t;! standard time|America/Thule¦thule0;!/pituffik|America/Guatemala¦g0mixco,villa nueva;t,uatemala|America/Guyana¦g0;eorgetown,uyana1y0;!t;! time|America/Tegucigalpa¦h0san pedro sula,tegucigalpa;n,onduras|America/Port-au-Prince¦c2p0;etionville,ort 0;au prince,de paix;arrefour,roix des bouquets|America/Jamaica¦j1k0new k0;ingston;amaica,m|America/Martinique¦m0;artinique,q|America/Mexico_City¦a0Gb0EcVduran09ecatepec de morel07guQhPiNjalis0Ileon de los alda03mInHoGpEqDs9t4uruap01v2x1yucat01za0;catec09pop00;alapa de enriqu0Ki0Gochimil0G;e0illahermosa;nustiano carranza,racruz;a3e7la1o0uxt00;luRnaZ;huac,l0quepaque,xcaY;nepantXpT;bas09maulip01pachuW;an0oledad de graciano sanch0C; luis potosi,t0;a maria chimal0iago de q1;huN;ueretaD;achuca de soFoza rica de6ue0;bPrto vallarZ;axaGjo de agua;aucalpan02icolas rome9uevo le01;agdalena contrerRexico3i1orel0x;ia,os;choFguel0; h3;! city,/general;rap5xtapalu9zta0;cSpalapa;idalJ;a1erre0stavo adolfo made0;ro;dalajara,naj0;ua0;to;eFhiCiudad Ao3u0;au1ernava0;ca;htemoc,titlan izcalli;a4l2yo0;ac0;an;i0onia del valle;ma;cChui0tzacoalc2;la;lopez mate0nezahualcoyotl;os;ap1lpancin0;go;as;laya,ntral 0;mexic0time;an,o;enito6uenavis0;ta;capulco3guascalientes,lvaro obreg2zcapotz0;al0;co;on; de0; juar0;ez|America/Cancun¦cancun,eastern standard time - quintana roo|America/Merida¦c0merida;ampeche,entral time - campecheyucatán|America/Monterrey¦c5g4mon3sa1t0victoria de durango;ampico,orreon;ltillo,n0; nicolas de los garza,ta catarina;clova,terrey;omez palacio,uadalupe;entral time - durango coahuilanuevo leóntamaulipas (most areas),iudad 0;apodaca,general escobedo,madero,victoria|America/Matamoros¦central time us - coahuilanuevo leóntamaulipas (us border),heroica m0m0nuevo laredo,reynosa;atamoros|America/Mazatlan¦culiac1los mochis,m0tepic;azatl0exico/bajasur,ountain time - baja california surnayaritsinaloa;an|America/Chihuahua¦chihuahua,m0;exic1ountain 0;mexico,standard time (mexico),time - chihuahua (most areas);an pacific standard time,o pacific|America/Ojinaga¦ciudad juarez,mountain time us - chihuahua (us border),ojinaga|America/Hermosillo¦ciudad obregon,hermosillo,mountain standard time - sonora,nogales|America/Tijuana¦america/e1e1mexic0pacific time us - baja california,tijuana;ali,o/bajanorte;nsenada|America/Bahia_Banderas¦bahia0central time - bahía de0; banderas|America/Managua¦man1ni0;!car0;agua|America/Panama¦pa0san miguelito;!nama|America/Lima¦arequiAc6huanc9i5juliaca,lima,p2sant1t0;acna,rujillo;a anita   los ficus,iago de sur5;e0iura,ucall7;!ru0t;! standard time;ca,quitos;allao,hi1us0;co;cl0mbote;ayo;pa|America/Miquelon¦m8p6s0;aint pierre1t0; pierre a3. pierre & miquelon s2;! 0;a1s0;tandard time;nd1;ierre0m; m0;iquelon|America/Puerto_Rico¦atlantic standard time,bayamon,p0;r,uerto rico|America/Asuncion¦asuncion,c3p0san lorenzo;araguay1y0;!st,t;! standard time;apiata,iudad del este|America/Paramaribo¦paramaribo,s0;r1uriname0;! time;!t|America/El_Salvador¦el1s0;an0oyapango,v; salvador|America/Grand_Turk¦grand turk,t0;c,urks and caicos|America/Port_of_Spain¦america/virg0port of spa0;in|America/New_York¦a0Pb0Mc0Fd0Ee0Af06g04hialeah,i01jZkYlexingtonXmTnMoKpIquHrDsAt7u5v3w0yonkers;ashington1est 0inston salem,orcD;raEvirgin03;! dc;ermont,irginia0;! beach;nited states,s0;!/0J;a0enne1he bronx,oleD;llaha0mpa;ssee;outh 1t0;. petersburg,aten3;bo0AcC;a2hode1ichmo04och0;ester; is01;lei2;eens,intana roo;ennsylvanMhiladelphMittsbur0rovidence;gh;hio,rlan0;do;ew3or1y0;!c;folk,th c0;aroliD; 0ark,port news;hampshiWje8york0;! staS;a1eads,i0;ami,chig1;ine,nhatt0ryLssachusetts;an;! fayetN;entucky,nox9;acks2e0;rsey;ndia1r0;on5;na;eorg0reensboro;ia;ayette1l0ort lauderda2;!orida;vil0;le;ast0dt,st; flatbush,ern0;! 0;(most areas),standard time;elawa9urham;ape coral,h3incinnati,leve1o0;lumbus,nnecticut;la0;nd;a0esapeake;rlot0ttanooga;te;altimo1o0rooklyn,uffalo;st3;re;kr1merica 0tlanta;eastern;on|America/Detroit¦detroit,eastern - mi (most areas),grand rapids,us/michigan|America/Kentucky/Louisville¦america0kentucky0;/louisville|America/Kentucky/Monticello¦kentucky/monticello|America/Indiana/Indianapolis¦americ0indian0us/east-indiana;a/indianapolis|America/Indiana/Vincennes¦indiana/vincennes|America/Indiana/Winamac¦indiana/winamac|America/Indiana/Marengo¦indiana/marengo|America/Indiana/Petersburg¦indiana/petersburg|America/Indiana/Vevay¦indiana/vevay|America/Chicago¦aVbScQdPfort worth,gOhNiLkZlImBn7o6plano,s3t1us/02wi0;chiFsconsV;ex0ulsa;!as;a0hreveport,ou4t 1;int 0n antonio;louGpaul;klahoWmaha,verland park;ashLe1or0;th dako7;braska,w 0;orleans,south me6;adisMe5i1o0;biHntgomery;lwaukee,nne1ss0;issippi,ouri;apol6so0;ta;mph4;aredo,i0ouisiana,ubb1;ncoln,ttle r0;ock;llino0owa,rving;is;oustAunts5;arland,rand prairie;allAes moines;dt,entral0hicago,orpus christi,st;! (most areas);aton rouge,rowns0;vil0;le;laba7m5r1ust0;in;k1lingt0;on;ans0;as;arillo,erica 0;central;ma|America/Indiana/Tell_City¦indiana/tell city|America/Indiana/Knox¦indiana/knox,us/indiana-starke|America/Menominee¦central - mi (wisconsin border),menominee|America/North_Dakota/Center¦north dakota/center|America/North_Dakota/New_Salem¦north dakota/new salem|America/North_Dakota/Beulah¦north dakota/beulah|America/Denver¦a1colorado springs,denver,el paso,m0navajo,salt lake,us/mountain;dt,ountain (most areas),st;lbuquerque,merica/shiprock,urora|America/Boise¦america mountain,boise,mountain0;! 0;- id (south) or (east),standard time|America/Phoenix¦a8c7g5idaho,m4n3phoenix,s2t1u0wyoming;s/a7tah;empe,ucson;cottsd3inaloa,onora;ayarit,ew mexico;aryv1esa,onta4st - arizona (except navajo);ilbert,lend0;ale;handler,olorado;rizo0;na|America/Los_Angeles¦aZbaXcVfRgarden grove,hOirviNlJmoGnFoCp8r7s0tacoma,us/00washington state;a1eattle,f,p0tocktPunrise manor;okaLringF;cramenFn0; 1ta 0;aPclariR;bernardiNdiego,fran0jo4;!cisco;ancho cucamonga,eLiver5;a0dt,ort5st;cific1radi0;se;! standard time;ak1cean0regDxnard;side;land;evada,orth las6;des1reno0; valley;to;a1o0;ng4s angeles;!s0; vegas;ne;enders1untington0; beach;on;onta2re0;mont,s0;no;na;a2hula vis0;ta;ja ca0kersfield;lifornia;merica 0naheim;pacific|America/Anchorage¦a0us/alaska;h4k4laska0nchorage;! 1n0;! s1;(most areas),s0;tandard time;dt,st|America/Juneau¦alaska - juneau area,juneau|America/Sitka¦alaska - sitka area,sitka|America/Metlakatla¦alaska - annette island,metlakatla|America/Yakutat¦alaska - y0y0;akutat|America/Nome¦alaska (west),nome|America/Adak¦a0hawaii standard time,us/aleutian;dak,leutian islands,merica/atka|America/Montevideo¦montevideo2u0;ruguay1y0;!st,t;! standard time|America/Caracas¦alto barinJbarIcCguaAm7p6san5turmeEv0;alencia,e0;!nezuela0t;! 0n;standard t0t0;ime; cristobal,ta teresa del tuy;eta4uerto la cruz;a0ucumpiz;raca0turin;ibo,y;ren8ti0;re;a4iudad 2o1u0;a,m2;ro;bolivar,guay0;ana;bim1rac1;in0quisimeto,uta;as|Asia/Dubai¦a4dubai,g2musaff1om0ras al khaim1sharj1;!an;ah;st,ulf0;! standard time;bu dhabi,jman|Asia/Kabul¦af1herat,jalalabad,ka0mazar e sharif;bul,ndahar;!ghanistan0t;! 0;standard t0t0;ime|Asia/Yerevan¦a0caucasus1yerevan;m,rmenia0;! standard time|Asia/Baku¦az0baku,ganja,lankaran,sumqayit;!erbaijan0t;! standard time|Asia/Dhaka¦asia/dacca,bDcBd9jess8khul7mymensingh,na4pa3ra2s1t0;angail,ungi;aid8hib4ylhet;jshahi,ng7;b3ltan,r naogaon;gar5r0t3;ayan0singdi;ganj;na;ore;haka,inaj0;pur;hattogram,o0;milla,x's bazar;a0d,ogra;gerhat,ngladesh0rishal;! standard time|Asia/Brunei¦b0;dt,n1runei0;! darussalam time;!t|Asia/Thimphu¦asia/thimbu,b0thimphu;hutan0t;! time|Asia/Shanghai¦0:3I;1:38;2:36;3:39;4:3C;a3Eb31c2Nd2He30f2Cg26h1Qji1Ek1Bl0Ym0Wn0Tordos,p0Pq0Lrizh10s08t01wSxLyEz5;aoCh6i5ouc3unyi;bo,go0;a7en6ouk2u5; c3h33maWzh2;g2Vj1Izh2;b1Ung5o3D;jiakou5zh2;! shi xuanhua qu;ya0z27;an9i7u5;ci,e18n5;c3fu;b4c9n5ya0;cZgk2;c3g5ji,t2S;j17qu1sh16zh2;i6uc5;ha0;a6n5uyi0;di,gt2Nh1Fi0pu,t2Nx13ya0;m17n5;!g5ni0t0Eya0;t1ya0;aBe9u5;h6so0w1Bx5zh2;i,ue;a5u;i,n;i0Hn5;sh1zh2;fang5nxi1;di1;a8i6ong5;chuans0XhDli02sh1;an5eli0;j4sh0Z;i6ng5;gu,sh1;an,hec1Wyu1zh2;anmi0hAi8u5;i5zh2;h5zh2;ua;c5pi0;hu1;a7en6i5uangya14;jiaz15qi,y1;gli,ya0zh0G;n6o5s0I;gu1xi0;g5t2;h1Rqiu,rKyu;i5uan1J;aFn5o14qih0N;g5huangdH;dGh1N;an0Ting7rc,u5;ti1yang5;! H;ding0QxZ;an5eijYingbo;ch5ji0ni0to0ya0;a0o0;entoug2ianRuda5;njU;aEi8u5;anc3o6qi5;ao;he,ya0;a7jPn5upansh01;fTxia 5yi;chengguanI;n0Do5;c3y5;a0u1;i0Wn5ohek2;g5zh2;fa0;ai6un5;mi0sh1;fe0yu1;'1aAe9l4n6u5xi;jCt0W;an,c3g5i0zh2;de5li0zh2;zhE;ya0;musi,n8o5xi0;j6z5;uo;ia0;g5shF;m7xi;aFeBkt,ohhot,u5;a6i0Dlan ergi,m5n1;en;i7ng5y4;ga0s5;hi;'1b8n1;bi,f7ga0ng5ze;sh5ya0;ui;ei;i7n5rb4;d1g5;u,zh2;c3k2l5;ar;a9u5;an6i5li;l4ya0zh2;g5k2;do0yu1zh2;nsu,opi0;en7o6u5;ji1shQx4zh2;sh1;d2g5;hua0;a6eNong5;gu1hT;d6lian5ndo0qi0to0;!g;o5uk2;nghP;angHh5n,t;aAen7i5oYuG;fe0na5;! standard K;g5zh2;d5zho0;e,u;ng6o5;ya0zh2;ch7de,sh6zh5;i,ou;a,u;un;zh2;aBe5;i6n5;gbu,xi;'1h7jing5;! 5;time;ai;i7o5yan nur;di0t2;ou;c3sh1y4;an;he0;nAsia/5;ch6harb4;in;o5ungki0;ng5;qi0;da,qi0sh5ya0;an,un;ng|Asia/Urumqi¦a6changji,huoche5k3shihezi,turp2urumqi,xin1zh0;anjia4ongsh1;jiang time,yu0;an;a0orla;ramay,s2;ng;ksu,ral,sia/kas0;hgar|Asia/Nicosia¦cy0nicosia;!prus0;! (most areas)|Asia/Famagusta¦famagusta,northern cyprus|Asia/Tbilisi¦ge1kuta0tbil0;isi;!orgia0t;! 1n0;! 0;standard time|Asia/Hong_Kong¦h0kowloon,tsuen wan;k2ong0; kong0kong;! standard time;!st|Asia/Jakarta¦bScQdepPiNjKkediri,lJmGpArengasdengklPs4t2w0yogyakM;est0ib; indonesia,ern indonesia time;a0egal;n4sikmal3;ema4itubondo,outh tan3u0;kabumi,medaRra0;b0kF;aya;ge0;raN;a4e1robolinggo,urw0;akAokerto;ka1ma0rcut;laJtangsiantar;long2nbaru;daHl3mulaHruH;a1ed0;an;diun,laE;embaD;a0ember;k0mbi,vasumatra;arta;d,ndonesia0;! western;ok;i0urug;ampea,bino5leungsir,mahi,putat,rebon;a1e0injai,ogor;kasi,ngkulu;nd0tam;a0u1; aceh,r lampu0;ng|Asia/Pontianak¦borneo (westcentral),pontianak,tanjung pinang|Asia/Makassar¦b6c4denpa3indonesia central,k2l1ma0palu,samarinda,wita;kas2nado,taram;abuan bajo,oa jan7;endari,upang;sar;entral indonesia0ity of bal3;! time;a0orneo (eastsouth) sulawesi/celebesbalinusa tengarra timor (west);l0njarmasin;ikpap0;an|Asia/Jayapura¦ambon,east0indonesia eastern,jayapura,new guinea (west papua / irian jaya) malukus/moluccas,wit; indonesia,ern indonesia time|Asia/Jerusalem¦ashdod,beersheba,haifa,i2j0petah tiqwa,rishon leziyyon,tel aviv,west je1;e0mt;rusalem;d1l,srael0;! standard time;dt,t|Asia/Kolkata¦0:3C;1:3K;2:2D;3:3L;4:3I;5:38;a36b2Ec25d1Xe1Vf1Tg1Gh1Di19j14k0Ql0Lm0Dn06odis3KpWquthbull5rOsGtAu9v6warang2Nyamun1Q;a7el1Vi6;jayawa2Wsakha0IzianagD;doda2Prana12;daip0jja24lhasn1ttar pradesh;a9eYh8iru6umk0;chirap0Nnelve2p6vottiy0;a39p0;ane,iruvananthapur0Ooothuku2Zriss0;mb6njo1Y;ar0M;aCecunder4hAi9lst,o8r1Gu6;jan37r6;at,endr1D;l5nip2O;k3liguLngrau2rK;ahj20i6ri2Pya0M;mo1Nvaji08;har1Ylem,mbh25ng2t05ug0Z;a7e0Foh6;iJtak;ebare2iAj8m6nc1Htl0Burke37;ag6g6p0;und09;a6kot;hmund27sth2B;ch0p0;aAimp9roddat0u6;ducher24n6rn18;a6e;sa;ri;li,n8rbha7t6;ia2Vna;ni;chku2Ti6;ha2Gp22;a8e7izam4o6;i1Wwrang5;l0Tw del0Z;di2Kg8i0Fjaf2Fn6re2Oshik,vi mumb16;ded,g6;i,loi j1W;ercoil,p0;a9eerut,irz5o8u6yso0Z;lugu,mb11rwa1Jzaffar6;n1p0;nghyr,rad4;chili8d7harasht1Gleg08n6thu1Gu;ga0Jip0;hya,ur0W;patnH;a8u6;cknow,dhia6;na;l bahadur6t0; n1;aEhaCo9u6;kat7lt6rno1P;a2i;pal2;l6rXta,zhikode;h5ka1Kl6;am;nd6ragp0;wa;kina14l9marPnp0r6shmir,tih3;i7na6ol ba19;l,tW;mn1;lakuric04y12;a7han6odOunagadh;si;b0Sip0l7m6;mu,n1shedp0;andh3gHna;chalkaranji,mph0Jn6st;!d6;ia6o01;! standard time,n;a7is3ospet,u6;b2g2;o0Ip0ridw3;aDhazi4oAreater noi0Nu7wali6y05;or;jar0PlbarRnt0rg7wa6;ha12;aon;rak7sa6;ba;hp0;juw9n6ya;dh7g6;an1;in1;aka;ar6iroz4;id4rukh4;l6taw0M;loG;aBe9h7indigul,ombPurg6;!ap0;anb0Uul6;ia;hra dun,l6was;hi;rbhan6vange9;ga;a09h9o6uttack;ch7imbato6;re;in;a7enn6;ai;nd6pM;a6i0C;!nn1;aOeLhCiAor8rahm5u6;landshahr,rh6;anp0;iv2;li;d3har sharif,j5kan07l6;asp0imoD;aBi8op7u6;baneshw3sav6;al;l7wan6;di,i;ai,wa7;g7ratp0tpa6vn1yand3;ra;alp0;l6ngaluru;gaum,la6;ry;hBli,r7thin6;da;a7ddham6eilly;an;n1s6;at;a7rai6;gh;ramp0;gQhmLizawl,jmKkoRlHmDnant5rrBs7urang4va6;di;ans8ia/ca6;lcut6;ta;ol;ah;ap0;arnath,batt0r6;ava6its3oA;ti;ur;appuz7i6lah4w3;garh;ha;er;adn1ed4;ab6;ad;ag3;ar;arta6ra;la|Asia/Baghdad¦a4ba3dihok,erbil,i2k1mosul,na0ramadi;jaf,sirB;arbala,irkuk,uwait;q,raq;ghdad,sr9;bu ghurayb,d diw6l 5rab0s sulaym6;! 3i0;a0c;!n0;! 0;standard time;amar2basrah al qadim2falluj2hill2kut,mawsil al jadid2;an0;iy0;ah|Asia/Tehran¦aRbNgorgXhamWiKkCmaBn8orumiy7pasragad branch,q4rasht,s2t1varam6yazd,za0;hedWnjW;abHehrV;a0hirSirjU;bzevar,nandEri,v3;a0om;rchak,zv0;in;eh;a0eyshabur;jaf0zar0;ab4;layer,shh3;a4erman3ho0;meyni sErram0wy;ab0sD;ad;!shah;h1r0;aj;riz;r0sfahC;!an0dt,st;! standard time;a2irjand,o0uk9;jnu0ruje0;rd;b3ndar abbas;b4hv3m2r1zads0;hahr;ak,dabil;ol;az;ad0;an|Asia/Amman¦amm1irbid,jo0russeifa,wadi as sir,zarqa;!rd0;an|Asia/Tokyo¦0:11;1:19;a17ch15fu0Ygifu13h0Ni0Hj0EkYmSnLoJsEt8u7waka04y2;a5o2;k2no;kaic1Ao2;ha0Xsu0;maJo;ji,tsun0E;aka6o2sukuba;k4makom04y2;a0So2;hNna0ta;oro02us0Pyo04;m0Irazu0sa1tsu1;a4endZhi3o0u2;i0Yzu0;monose1zuo0;ita0Lk2ppoKsebo;ai,u05;dawa04i0Uka2sa0t0D;ya0Iza1;a5eyaga0Oi2umazu;i3shi2; tokyo0Hnomiya ha0F;ga0P;g2ha,ra0F;a2oW;no,o0sa1;a4i2orio0;na2to,yaza1;mirinkan,to;chiCeb3tsu2;do,m7ya06;as0H;aAi8o6u2y5;mam4r3shi2;ro;ashi1e,uG;oto;be,c0Bfu,ri2shigaJ;yaY;shiwa2takyushu;da;gosUkogawacho honmJmirenjaku,na7s4wa2;g2sa1;oe,uc05;hiZu2;g2kabe;ai;zaW;apan2dt,oetIp,st;! standard ti2;me;bara1chi3ta2wa1zu2;mi;ha4n2;omi2;ya;ra;a7i2oncho;meAr3t2;acP;a3os2;a1hiB;kaLtsu0;chi4kodate,mam2;at2;su;nohe,o2;ji;ji7ku2;i5o0s2ya3;hi2;ma;ka; sB;!sa5;i2ofu;ba,g4;geoshimo,k5mag3njo,omori,sahika2tsugi;wa;asa1;ki;as3i2;ta;hi|Asia/Bishkek¦bishkek,k0osh;g2yrgy0;stan,zstan0;! time;!t|Asia/Pyongyang¦chongjin,h5k3n2pyongya8s0won6;ariw0inui8unch'0;on;amp'o,orth korea;a0p;eso3nggye;a1ungnam,ye0;san;e1mhu0;ng;ju|Asia/Seoul¦anPbuMchHdaeGgChwaseoQiBjeAk7m6pohaFrok,s2u1wonJy0;aCeosu;ijeongbuPlsL;e1outh korea,u0;nEwH;joAo0;ngnamLul;asGokpo;imhae,orea0r,st,wangmyo7;! 0n 0;standard time;ju,on8;cCksBn6;angneu2oyaDu1wa0;ng5;mi,ns8riC;ng;gu,je4;angw3eon2in1un0;che2;ju;an,gju6;on;c1s0;an;heon2;san1ya0;ng0; si|Asia/Almaty¦a8central asia6east kazakhstan7k2nur sultan,p1s0taraz,ust kamenogorsk;emey,hymkent;avlodar,etropavl;a0z;ragandy,zakhstan0;! 0;(most areas),eastern;! standard0; time;lm0stana;aty,t|Asia/Qyzylorda¦kyzyl1qyzylorda0;!/kyzylorda/kzyl-0;orda|Asia/Qostanay¦k0q0;ostanay|Asia/Aqtobe¦a0;k1qt0;o1öbe/ak0;to0;be|Asia/Aqtau¦a1kazakhstan western,mangghystaū/mankis2west asia0;! standard3;lma1q0;tau; ata,-ata0; time|Asia/Atyrau¦atyra0;u,ū/atirau/gur'yev|Asia/Oral¦oral,west kazakhstan|Asia/Beirut¦bei2e1l0ra's bay2;b,ebanon;astern european standard time,urope eastern;rut|Asia/Colombo¦colombo,dehiwala mount lavinia,lk,moratuwa,sri lanka|Asia/Yangon¦asia/rango3b2kyain seikgyi township,m0nay pyi taw,pathein,sittwe,yang3;a0eiktila,m,onywa,yanmar;ndalay,wlamyine;ago,urma;on|Asia/Ulaanbaatar¦m2ula0;anbaatar0n bator,t;! standard time;n,ongolia0;! (most areas)|Asia/Hovd¦bayan-ölgiigovi-altaihovduvszavkhan,hov3w0;. mongolia 4est0; 0ern 0;mongolia;d0t;! 0;standard time|Asia/Choibalsan¦choibalsan,dornodsükhbaatar|Asia/Macau¦asia/macao,m0;acau,o|Asia/Kuala_Lumpur¦alor setar,bukit mertajEgeorge town,ipoh,johor bahDk8m4petali3s0taipiC;e1hah alDu0;ba1ngai petani;pa9remb7;ng jaya;ala0y;cca,ysia0;! 0;(peninsula),time;ampung baru suba3la3ota bha4ua0;la 1nt0;an;lumpur,terengganu;ng;ru;am|Asia/Kuching¦k2miri,s0tawau;a0ibu;bahsarawak,ndakan;ota kinabalu,uching|Asia/Kathmandu¦asia/kat3biratnagar,kath3n1p0;atan,okhara;epal,p0;!t;mandu|Asia/Manila¦an04bWcRdaPgeneral santOiMlJmCnaBoAp4quezIsan1ta0zamboanga;clobZguig,rlac,ytE; 1t0;a ro2ol;fernando,jose del monte,pab01;a3h1uerto prince0;sa;!ilippine0t; standard time,s;gadiRnalanoy,s0;ay,ig;longapo,rmoc;ga,votQ;a0eycauayN;balacat,gugpo poblaci4kati,l3n0;da1ila,silingLtamp0;ay;luyong,ue;ingDol6;on;a1egaspi,i0ucena;bertad,pa;pu lapu,s p4;l0mus;igCoiH;os;smar0v5;inB;a0ebu,otabato;b1gayan de oro,in5l0;amba,ooc6;anatu5uy0;ao;a4inan2u0;d0tu2;ta;!gon0;an;co1guio,tang0;as;lod,or;geles,tipo0;lo|Asia/Karachi¦bKchiniJdera ghaziHfaisalGgujraFhyderGislamGjhang sadr,kDlaCm7nawabshah,okaAp4quetta,ra3s0;a1h0ialkIukkM;ahkHekhupu8;ddiqDhiwal,rgodha;him yarDwalpindi;akistan1eshawar,k0;!t;! standard time;a3i1u0;lt9zaffar7;ngo0rpur khas;ra;lir cantonment,rd6;hore,rkana;a0otli;moke,rachi,s8;n5t;abad; kh0;an;ot;a1himber,ure0;wala;hawalp0ttagram;ur|Asia/Gaza¦gaza1p0;alestine,s;! strip|Asia/Hebron¦east jerusalem,hebron,west bank|Asia/Qatar¦ar rayyan,doha,qa0;!tar|Asia/Yekaterinburg¦chelyabin7eka5k4magnitogor7nizhn3or2perm,s1tyumen,ufa,yek0zlatoust;a4t;terlitamak,urgut;enburg,sk;evartov3y tagil;amensk ural'skiy,urgan;terinburg0;! standard time;sk|Asia/Omsk¦oms0;k0t;! standard time|Asia/Novosibirsk¦n0siber4;. central asia 4o0;rth central as2v0;osibirsk0t;! 1;ia;standard time|Asia/Barnaul¦b0;arnaul,iysk|Asia/Tomsk¦tomsk|Asia/Novokuznetsk¦kemerovo,novokuznet0prokop'yev0;sk|Asia/Krasnoyarsk¦kra0north asia1;snoyarsk0t;! standard time|Asia/Irkutsk¦angar2brat2irk0north asia east1ulan ude;t,utsk0;! standard time;sk|Asia/Chita¦chita|Asia/Yakutsk¦blagoveshchensk,yak0;t,utsk0;! standard time|Asia/Khandyga¦khandyga|Asia/Vladivostok¦k2vla0;divostok0t;! standard time;habarovsk0omsomolsk on amur;! vtoroy|Asia/Ust-Nera¦ust nera|Asia/Magadan¦mag0;adan0t;! standard time|Asia/Sakhalin¦sak0yuzhno sakhalinsk;halin0t;! standard time|Asia/Srednekolymsk¦chokurdakh,sre0;dnekolymsk0t;! standard time|Asia/Kamchatka¦kamchatka,pet0;ropavlovsk0t; kamchatsky,-kamchatski standard time|Asia/Anadyr¦ana0;dyr0t;! standard time|Asia/Riyadh¦a6burayd5dammam,ha4jedd5khamis mushait,me3najran,riyadh,sultan5ta2y0;anbu,e0;!men;'if,buk;cca,dina;'il,far al batin;ah;bha,l 0;hufuf,jubayl,kharj,mubarraz|Asia/Singapore¦s0woodlands;g1ingapore0;! standard time;!t|Asia/Damascus¦a4d3h2latak1sy0;!r0;ia;am2oms;amascus,eir ez zor;leppo,r raqq0;ah|Asia/Bangkok¦bangkok,ch8h6indochina3mueang nontha9na2pak kret,s0udon thani;amut prakan,e asia0i racha,outh east asia;! standard t3;khon ratchasima,m dinh;! 0;(most areas),t0;ime;a0ue;iphong,noi,t y2;iang m1on 0;buri;ai|Asia/Dushanbe¦dushanbe,t0;ajikistan1j0;!t;! time|Asia/Dili¦dili,east timor1tl0;!t;! time|Asia/Ashgabat¦as4t0;m2urkmen0;a3istan0;! standard time;!st,t;hga0ia/ashkhabad;bat|Asia/Taipei¦banqiao,h7k5roc,t0;a0w;i0oyu2;ch3n1pei0w1;! standard time;an;aohsi0eel0;ung;sinchu,ualien|Asia/Samarkand¦bukhara,nukus,qarshi,samarkand,uzbekistan 0;(west),standard time|Asia/Tashkent¦andij2namangan,qo`q2tashkent,uz0;!bekistan0t;! (east);on|Asia/Ho_Chi_Minh¦asia/saig4bien hoa,can tho,da 2ho chi minh,nha tr3qui nh4rach gia,sa dec,thi xa phu my,v0;ietnam0n,ung tau;! (south);lat,n0;ang;on|Atlantic/Bermuda¦b0;ermuda,m|Atlantic/Cape_Verde¦c0;a1v0;!t;bo verde,pe verde0;! standard time|Atlantic/Canary¦canary0las palmas de gran canaria,santa cruz de tenerife;! islands|Atlantic/Stanley¦f0stanley;alkland1k0;!st;! island0;!s0;! summer time|Atlantic/Faroe¦atlantic/faeroe,f0;aroe0o;! islands|Atlantic/South_Georgia¦gs,south georgia0;! time|Atlantic/Reykjavik¦i0reykjavik;celand,s|Atlantic/Madeira¦madeira0;! islands|Atlantic/Azores¦azo0hmt;res0st,t;! standard time|Australia/Lord_Howe¦australia/lhi,l0;h2ord howe0;! 0;island,standard time;dt,st|Australia/Hobart¦australia/1hobart,tasmania0;! (most areas);currie,tasmania|Australia/Melbourne¦australia/victoria,geelong,melbourne|Australia/Sydney¦au0c4new south wales (most areas),sydney,wollongong;!s0; east3tralia0;! eastern,/0n eastern 4;act,c0nsw;anberra;!ern0;! 0;standard time|Australia/Broken_Hill¦australia/yancowinna,broken hill,new south wales (yancowinna)|Australia/Brisbane¦a1brisbane,gold co3logan,queensland0townsville;! (most areas);e2ustralia0;/queensland,n e0;ast;dt,st|Australia/Lindeman¦lindeman,queensland (whitsunday islands)|Australia/Adelaide¦a2cen0south1;. australia 4tral0; australia;c3delaide,ustralia0; central,/south,n central0;! 0;standard time;dt,st|Australia/Darwin¦australia/north,darwin,northern territory|Australia/Perth¦a3perth,w0;. australia6est0; australia,ern australia0;! (most areas);ustralia1w0;dt,st; western,/west,n west0;!ern0; standard time|Australia/Eucla¦a0cw5eucla,western australia (eucla);cw6us0; central w2tralia0; centralwestern,n central western0;! 2;. 1e0;st;standard time;dt,st|Indian/Cocos¦c0;c3ocos0;! island0;!s0;! time;!t|Indian/Christmas¦c0;hristmas1x0;!t;! island0;! time|Indian/Chagos¦british indian ocean territory,c4i0;ndian 1o0;!t;c1ocean0;! time;hagos|Indian/Mauritius¦m0port louis;auritius1u0;!t;! standard time|Indian/Maldives¦m0;aldives1v0;!t;! time|Indian/Reunion¦r0;e1éunion0; time,crozetscattered islands;t,union|Indian/Mahe¦mahe,s0;c,eychelles0;! time|Indian/Kerguelen¦french southern2kerguelen1tf0;!t;!st paul islandamsterdam island;! 0;& antarctic time,and antarctic0;! lands|Europe/Andorra¦a0;d,ndorra|Europe/Tirane¦al1tiran0;a,e;!bania|Europe/Vienna¦a0donaustadt,favoriten,graz,linz,vienna;t,ustria|Europe/Brussels¦antwerpen,b0charleroi,gent,liege;e0russels;!lgium|Europe/Sofia¦b0plovdiv,sof2varna;g,u0;lgar0rgas;ia|Europe/Minsk¦b2h1m0viteb3;ahilyow,in2;omyel,rodna;abruy0elarus,rest,y;sk|Europe/Zurich¦geneve,li0swiss time,zurich;!echtenstein|Europe/Prague¦brno,ostrava,prague,s0;k,lovakia|Europe/Berlin¦a00bScQdOeMfrLgeJhaEkClAm4n3oberhaus04rostoBs1w0;andsbek,iesbad03uppert8;a0tuttgaL;arbrueck01xony;eue neustadt,uernbeY;a3e2iddle european,oenchengladba1u0;enst9ni0;ch;st,t;gdeSinz,nnheim,rienth0;al;eipzJuebe0;ck;a0iKoeln,rL;rlsruhe,ssJ;gPlle (saale),m1nnov0rM;er;burg0m;! 0;mitte,nord;lsenkirJrmany0;! (most areas);ankfurt am maDeiF;imsbuettArfu0ssH;rt;e,ortmund,resdFu0;esseldorf,isB;e0hemnitz;ntral europe,st,t;avaria,erl6iel5o2r0;aunschwe0emA;ig;chum0nn;! hord0;el;efeld;in;a2ltona,ugs0;bu0;rg;ch0;en|Europe/Copenhagen¦arhus,copenhagen,d0;enmark,k|Europe/Tallinn¦e0tallinn;e,stonia|Europe/Madrid¦aMbJcHeGfuenDgCjerez de la frontera,lBm8ovieFp6s1terrassa,v0zaragoza;alladol9igo;a1evilla,pain0;! (mainland);badell,n0; sebastian,t0; marti,ander,s montjuic;a0uente de vallecas;lma,mpD;a0ostolGurcF;dr0laga;id;atiEeganD;asteiz / vitorBijon,ran1;carral el par1labr0;ada;do;ixample,lche,s;a0iudad lineal;rabanchel,stello de la pla7;a0ilbao,urgos;da0rce0sque;lo4; coru3l0;cala de henar1icante,mer0;ia;es;na|Europe/Helsinki¦espoo,fi1helsinki,t0vantaa;ampere,urku;!nland|Europe/Paris¦bordeaux,ceDeurope central,frBl9m8n6paris,r3s0toulouE;aint 1t0; 0rasbourg;etienne;e1omance0;! A;ims,nn1;ant0i5ormandy;es;arsei1ontpellier;e havre,i0yon;lle;!an0;ce;ntral european 1rgy pontoi0;se;standard time|Europe/London¦a0Hb05c02dZeXgUhSiPjeOkingston upon hull,lJmHnBoxTp9reading,s1w0yF;arwick05igan,olverha7;heffield,o3t2u1w0;an4iH;ffolk,nderland,sUttM;afOoke on tre05;meUuth0;a1end on 0;sea;mptH;ly0orts0restG;mouth;ew4o0;r0ttinghamO;th0wD; y0amptonM;orkQ;castle upon tyne,port;ancheLi0;dlan4lton keynes;ancaMdn,e2i1o0ut6;nd5;ncolnKverP;e0icesterE;ds;!rsQ;psw1slingt0;on;ich;ampDert0;fordC;b1l0mt standard time;asgow,oucesterA;!-eA;dinburgh,s0urope/belI;sex;erby1o0udlF;rset;!sh5;a1ity of westmin0oventry,rawlC;ster;mbridge1rdiff;e8ir7lack5r2st,uckingham0;sh0;ire;adford,e1i0;st2tish;nt;po0;ol;kenhead,mingham;l1xl0;ey;fast;berdeen,rchway|Europe/Gibraltar¦gi0;!braltar|Europe/Athens¦athens,gr0thessaloniki;!eece|Europe/Budapest¦budapest,debrecen,hu0;!ngary|Europe/Dublin¦cork,dublin,eire,i0;e,reland|Europe/Rome¦b9c8florence,genoa,m7naples,p4rome,sicily,t2v0;a0eroA;!tican city;aran2rieste,u0;rin,scany;a1ra0;to;dova,lermo;essi3ilan;atan1orsica;ari,olog1resc0;ia;na|Europe/Vilnius¦k1l0vilnius;ithuania,t;aunas,laipeda|Europe/Luxembourg¦lu0;!xembourg|Europe/Riga¦e1kalt,l0riga;atvia,v;ast europe,e0;st,t|Europe/Monaco¦m0;c,onaco|Europe/Chisinau¦chisinau,europe/tiraspol,m0;d,oldova|Europe/Malta¦m0;alta,t|Europe/Amsterdam¦a3eindhov2groning2n1rot4t0utrecht;he hague,ilburg;etherlands,l;en;lmere stad,ms0;terdam|Europe/Oslo¦berg1oslo,s0;j,valbard and jan may0;en|Europe/Warsaw¦bDczestochowa,g9k7l5mokot8p3radFs2torun,w0zabrze;ars0rocl0;aw;osnowiec,zczec3;l,o0raga poludnie;land,znan;odz,ubl0;in;ato2iel3rak0;ow;d2li0;wi0;ce;ansk,ynia;i2y0;dgoszcz,t0;om;alystok,elsko biala|Europe/Lisbon¦amadora,europe western,lisbon,p2we0;st0t;! europe,ern european standard time;ort0t;o,ugal0;! (mainland)|Europe/Bucharest¦b3c2gala1iasi,oradea,ploies1ro0timisoara;!mania;ti;luj napoca,onstanta,raiova;ra0ucharest;ila,sov|Europe/Belgrade¦belgrade,n1pristina,s0;i,lovenia;is,ovi sad|Europe/Kaliningrad¦kaliningrad|Europe/Moscow¦ar0Cb09c06dzerzh05fet,grozn04ivano03kXlipet0EmQnMorel,pJrFs8t6v2w-su,y0zelenograd;a0oshkar oV;roslavl,sene01;asyl'evsky ostrHelikiLladi2o0ykhino zhulebS;l0ronezh;gograOogda;kavkaz,m07;a0uPver;ganrog,mbC;a4ever3hakhty,molen05ochi,t0yktyvkQ; 4a0;ryy osk0vrop0;ol;nRodvS;int 0rW;petersburg;ostov na donu,u1y0;azKbO;!ssia0;!n9;e1odolUsk0;ov;nza,trozavodS;a2izhn0ovorossiyR;ekamQi0;y novM;berezhnyye chelny,l'chik;a3dst,oscow1s0urmJ;d,k;! standar0;d time;khachka1r'0;ino;la;a2himki,ostroma,rasno0urG;d0gvargeisky;ar;l1z0;an;ininsk5uga;vo;yy;in8;entraln1he0;boksary,repovets;iy;el1ry0;an3;gorod;khangel'1mav0;ir;sk|Europe/Simferopol¦simferopol|Europe/Kirov¦kirov|Europe/Volgograd¦vol0;gograd,t,zhskiy|Europe/Astrakhan¦astrakhan|Europe/Saratov¦balakovo,saratov|Europe/Ulyanovsk¦ulyanovsk|Europe/Samara¦izhevsk,s0togliatti on the volga;am0yzran;ara0t;! standard time|Europe/Stockholm¦goeteborg,malmoe,s0;e,tockholm,weden|Europe/Istanbul¦a00bUcSdQeNgMiKkImDosmCs6t1u0v07zeytinburnu;eskuedYmrB;arsus,r3urkey0;! 0;standard t0t0;ime;!abzon,t;a3i1ultan0;beyJgazi;sIv0;as,erek;msun,n0;cakt5liurfa;aniye;a1er0uratpaH;kezefendi,sin;l0niF;atOt0;epe;a0irikkale,onMutahM;hramanmaras,rabaglFyseP;stanbul,zmi0;r,t;aziantep,ebze;lazig,rzurum,s0;en0kiC;l8yurt;eniz0iyarbakB;li;ankaCor0;lu,um;a1ur0;sa;gcil2hcelievl1likes5sak4t0;ikent,m9;er;ar;d5n2rnavutkoey,ta0;seh0;ir;kara,ta0;k0l0;ya;a1iyam0;an;na,paza0;ri|Europe/Kiev¦bila tserkHcherEdChorlBivano frankivDk7l6m4odessa,poltaHrivne,sumy,ternopil,u2vinnyts1z0;aporizhzh0hytomyr;ya;a,kraine0;! (most areas);a0ykolayB;ki5riupol;ut6v9;amyanske,h1iev,r0y8;emenchuk,opyv1yvyy rih;ark6erson,mel0;nytskyy;ivka;nipro,onet0;sk;kasy,ni0;h0vtsi;iv;va|Europe/Uzhgorod¦ruthenia,uzhgorod|Europe/Zaporozhye¦luhansk,sevastopol,zaporozh0;'ye/zaporizhia lugansk/luhansk (east),ye|Antarctica/Casey¦casey0;! time|Antarctica/Davis¦a1davis0;! time;ntarctica,q|Antarctica/DumontDUrville¦dumont0;-d0d1;'0’urville time;urville|Antarctica/Mawson¦mawson0;! time|Antarctica/Palmer¦chile standard time,palmer|Antarctica/Rothera¦rothera|Antarctica/Syowa¦syowa0;! time|Antarctica/Troll¦troll0;! research station|Antarctica/Vostok¦vost0;!ok0;! time|Antarctica/Macquarie¦macquarie0;! island|Pacific/Pago_Pago¦pa0samoamidway,us1;cific0go pago;/samoa|Pacific/Rarotonga¦c0rarotonga;k2ook0;! islands0;! standard time;!t|Pacific/Easter¦chile/easterisland,e0;as0mt;st,t0;!er0;! island0;! standard time|Pacific/Galapagos¦gal0;apagos,t,ápagos islands|Pacific/Fiji¦f0;iji1j0;!st,t;! standard time|Pacific/Chuuk¦chuuk1pacific/0;truk,y1;!/truky0;ap|Pacific/Pohnpei¦f3micro4p0;acific/1f,ohnpei0;!/0;ponape;m,rench poly0;nesia|Pacific/Kosrae¦kosrae0;! time|Pacific/Guam¦ch1guam,mp,northern mariana islands,west0; pacific1ern pacific;amorro0st;! standard time|Pacific/Tarawa¦gilbert islands0tarawa;! time|Pacific/Enderbury¦enderbury,phoenix islands0;! time|Pacific/Kiritimati¦ki3line islands0;! 0;standard t0t0;ime;!ri0;bati,timati0;! island|Pacific/Majuro¦m0;a0h;juro,rshall islands0;! (most areas)|Pacific/Kwajalein¦kwajalein,marshall islands time|Pacific/Noumea¦n0;c,ew caledonia0oumea;! standard time|Pacific/Nauru¦n0;auru0r;! time|Pacific/Niue¦n0;iue1u0;!t;! time|Pacific/Auckland¦auckland,christchurch,manukau,n0wellington;ew zealand1orth shore,z0;!dt,mt,st;! 0;standard t0t0;ime|Pacific/Chatham¦cha0nz-chat;dt,st,tham0;! 0;islands0s1;! s0;tandard time|Pacific/Tahiti¦society islands,tahiti0;! time|Pacific/Marquesas¦marquesas0;! 0;islands,standard t0t0;ime|Pacific/Gambier¦gambier0;! 0;islands,time|Pacific/Port_Moresby¦p0;apua new guinea0g,ort moresby;! (most areas)|Pacific/Bougainville¦bougainville,guinea0papua new guinea time;!n|Pacific/Pitcairn¦p0;itcairn0n;! time|Pacific/Palau¦p0;alau0w;! time|Pacific/Guadalcanal¦guadalcanal,s0;b,olomon0;! islands0;! time|Pacific/Fakaofo¦fakaofo,t0;k1okelau0;! time;!t|Pacific/Tongatapu¦nuku'alofa,to0;!nga0;! standard time,tapu|Pacific/Funafuti¦funafuti,t0;uvalu0v;! time|Pacific/Wake¦u2wake0;! island0;! time;m,s minor outlying islands|Pacific/Honolulu¦aleutian2h0pacific/johnston,us/hawaii;awaii0onolulu,st;! aleutian,-aleutian 1;! 0;standard time|Pacific/Efate¦efate,v0;anuatu0u;! standard time|Pacific/Wallis¦w0;allis0f;! 0;& futuna time,and futuna|Pacific/Apia¦apia,s2w0;est0s; samoa time,ern s0;amoa|ETC/GMT¦gmt|Etc/GMT¦coordinated universal1greenwich0;! mean0; time|Etc/UTC¦etc/uct,u0zulu;ct,niversal,tc|America/Argentina¦arNbKcHformosa,jGla EmBneuquen,pAquilmJr9sa1t0;ierra del fuego (tLucumán (tm);lta6n0; 2t0;a 0iago del estero;cruz (sc),fe;juan1luis0miguel de tucuman,salvador de jujuy;! (sl);! (sj);! (salpnqrn);esistencia,osario;araDilar,osadas;ar del p3e0oron;ndoza0rlo;! (mz);p0rioja (lr);lata;ose c paz,ujuy (jy);atamarca (ct) chubut (ch),or0;doba,rient0;es;ahia blanca,uenos aires0;! (bac0;f);!genti0;na|Australia/Currie¦tasmania (king island)|America/Godthab¦g3w0;est greenland1g0;st,t;! s3;l,reenland0;! 0;(most areas),s0western;tandard time|America/Kentucky¦eastern - ky (0louisville;louisville area),wayne)|America/Indiana¦central 3eastern - in (0fort wayne,indianapolis;crawfor1dadukmn),most areas),p0switzerlan1;i3ulaski);d);- in (0standard time;perry),star0;ke)|America/North_Dakota¦central - nd (0;m0oliv1;erc0orton rural);er)|Africa/Kinshasa¦c3ki2m0;a0bandaka;sina,tadi;kwit,nshasa;d,ongo|Africa/Luanda¦huambo,l0n'dalatando;obito,uanda|Africa/Addis_Ababa¦addis ababa,dire dawa,mek'ele,nazret|Africa/Dar_es_Salaam¦arusha,d1m0tanga,zanzibar;beya,orogoro,wanza;ar es salaam,odoma|Africa/Mogadishu¦berbera,hargeysa,jamaame,kismayo,m0;arka,ogadishu|Africa/Dakar¦dakar,pikine,t0;hies0ouba;! nones|Asia/Aden¦a0ibb,mukalla,sanaa,taiz;den,l hudaydah|Africa/Conakry¦c0;amayenne,onakry|Asia/Phnom_Penh¦ict,phnom penh,takeo|Africa/Harare¦bulawayo,chitungwiza,har0mut0;are|Indian/Antananarivo¦ant0toamasina;ananarivo,sirabe|Africa/Lubumbashi¦b3k2l1m0tshikapa;buji mayi,wene ditu;ikasi,ubumbashi;ananga,isanga1olwezi;e0ukavu;ni|Africa/Kampala¦kampala|Africa/Douala¦b1douala,edea,gar2kousseri,loum,m0ngaoundere,yaounde;ar1okolo;a1ert0;oua;foussam,menda|Africa/Bamako¦bamako|Africa/Brazzaville¦brazzaville,pointe noire|Africa/Lusaka¦k0lusaka,ndola;ab0it0;we|Africa/Ouagadougou¦bobo dioulasso,ouagadougou|Africa/Freetown¦freetown|Asia/Muscat¦muscat,seeb|Africa/Porto-Novo¦abomey calavi,coton0djoug0porto novo;ou|Africa/Niamey¦niamey,zinder|Africa/Lome¦lome|Africa/Kigali¦kigali|Europe/Zagreb¦split,zagreb|Europe/Sarajevo¦banja luka,sarajevo|Africa/Nouakchott¦nouakchott|Africa/Blantyre¦blantyre,lilongwe,mzuzu|Asia/Kuwait¦al ahmadi|Africa/Djibouti¦djibouti|Africa/Libreville¦libreville|Africa/Asmara¦asmara|Africa/Bangui¦bangui|Europe/Skopje¦skopje|Europe/Bratislava¦bratislava,kosice|Africa/Banjul¦serekunda|Africa/Bujumbura¦bujumbura|Europe/Ljubljana¦ljubljana|Europe/Podgorica¦podgorica|Africa/Gaborone¦gaborone|Asia/Vientiane¦vientiane|Asia/Saigon¦ho chi minh city|America/Port_Of_Spain¦vi0;!rgin islands|America/Port-au-prince¦h0;aiti,t|Pacific/Norfolk¦n0;f,orfolk 0;island0s1;! s0;tandard time|America/Buenos_Aires¦ar0;gentina standard time,st,t|Pacific/Midway¦s0;amoa standard time,dt,st|Asia/Katmandu¦nepal 0;standard t0t0;ime|Asia/Rangoon¦myanmar 0;standard t0t0;ime|Pacific/Truk¦chuuk time,truk|Pacific/Ponape¦ponape0;! time|America/Santa_Isabel¦mexico northwest,northwest mexico standard time,pacific 0;mexico,standard time (mexico)|Brazil/Acre¦act|Asia/Thimbu¦btt";

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
  'msk+09 - bering sea': 'Asia/Anadyr',
  // underscores in key names
  'antarctica/south_pole': 'Pacific/Auckland',
  'america/buenos_aires': 'America/Argentina/Buenos_Aires',
  'america/coral_harbour': 'America/Atikokan',
  'america/fort_wayne': 'America/Indiana/Indianapolis',
  'america/knox_in': 'America/Indiana/Knox',
  'america/porto_acre': 'America/Rio_Branco',
  'america/santa_isabel': 'America/Tijuana',
  'asia/tel_aviv': 'Asia/Jerusalem',
  'asia/ujung_pandang': 'Asia/Makassar',
  'asia/ulan_bator': 'Asia/Ulaanbaatar',
  'atlantic/jan_mayen': 'Europe/Oslo'
};

const isOffset = /(\-?[0-9]+)h(rs)?/i;
const isNumber = /(\-?[0-9]+)/;
const utcOffset = /utc([\-+]?[0-9]+)/i;
const gmtOffset = /gmt([\-+]?[0-9]+)/i;

const toIana = function (num) {
  num = Number(num);
  if (num > -13 && num < 13) {
    num = num * -1; //it's opposite!
    num = (num > 0 ? '+' : '') + num; //add plus sign
    return 'Etc/GMT' + num
  }
  return null
};

const parseOffset = function (tz) {
  // '+5hrs'
  let m = tz.match(isOffset);
  if (m !== null) {
    return toIana(m[1])
  }
  // 'utc+5'
  m = tz.match(utcOffset);
  if (m !== null) {
    return toIana(m[1])
  }
  // 'GMT-5' (not opposite)
  m = tz.match(gmtOffset);
  if (m !== null) {
    let num = Number(m[1]) * -1;
    return toIana(num)
  }
  // '+5'
  m = tz.match(isNumber);
  if (m !== null) {
    return toIana(m[1])
  }
  return null
};

let lexicon = O(pckd);
lexicon = Object.assign(lexicon, misc);
// console.log(lexicon.ist)

// add some redundant data to our lexicon
Object.keys(lexicon).filter((k) => {
  let val = lexicon[k];
  if (typeof val === 'string') {
    val = val.toLowerCase();
    if (lexicon[val] === undefined) {
      lexicon[val] = lexicon[k];
    }
  }
});

//try to match these against iana form
const normalizeOne = (tz) => {
  tz = tz.replace(/^in /g, '');
  tz = tz.replace(/ time/g, '');
  tz = tz.replace(/ (standard|daylight|summer)/g, '');
  tz = tz.replace(/ - .*/g, ''); //`Eastern Time - US & Canada`
  tz = tz.replace(/, .*/g, ''); //`mumbai, india`
  return tz.trim()
};

//some more aggressive transformations
const normalizeTwo = function (tz) {
  tz = tz.replace(/\b(east|west|north|south)ern/g, '$1');
  tz = tz.replace(/\b(africa|america|australia)n/g, '$1');
  tz = tz.replace(/\beuropean/g, 'europe');
  tz = tz.replace(/\islands/g, 'island');
  tz = tz.replace(/.*\//g, '');
  return tz.trim()
};
// even-more agressive
const normalizeThree = function (tz) {
  tz = tz.replace(/\(.*\)/, '');
  return tz.trim()
};
//
const find = function (str) {
  if (!str) {
    return null
  }
  str = str.toLowerCase().trim();
  // lookup known abbreviations
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }

  // -8hrs
  if (/[0-9]/.test(str)) {
    let etc = parseOffset(str);
    if (etc) {
      return [etc]
    }
  }

  // start fuzzy-match against iana timezones
  str = normalizeOne(str);
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  // 'eastern daylight'
  let tmp = str + ' time';
  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp]
  }
  // 'pacific'
  tmp = str + ' standard time';
  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp]
  }

  // -- harder normalizations --
  str = normalizeTwo(str);
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  // -- HARDER normalizations --
  str = normalizeThree(str);
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  // 'eastern daylight'
  tmp = str + ' time';
  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp]
  }
  // 'pacific'
  tmp = str + ' standard time';
  if (lexicon.hasOwnProperty(tmp)) {
    return lexicon[tmp]
  }

  return null
};

var metas = [
  {
    name: 'India Time',
    abbr: null,
    aliases: [
      'india',
      'indian',
      'india standard time',
      'chennai',
      'kolkata',
      'mumbai',
      'new delhi'
    ],
    ids: ['Asia/Kolkata', 'Asia/Calcutta', 'Asia/Colombo'],
    std: {
      name: 'India Standard Time',
      abbr: 'IST',
      offset: 5.5
    },
    dst: {},
    long: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    hem: 'n'
  },
  {
    name: 'China Time',
    abbr: null,
    aliases: ['china', 'china standard time', 'beijing', 'chongqing', 'hong kong', 'urumqi'],
    ids: ['Asia/Shanghai', 'Asia/Macau', 'Asia/Urumqi'],
    std: {
      abbr: 'CST',
      name: 'China Standard Time',
      offset: 8
    },
    dst: {},
    long: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
    hem: 'n'
  },
  {
    name: 'Central European Time',
    abbr: null,
    aliases: [
      'europe central',
      'romance standard time',
      'brussels',
      'copenhagen',
      'madrid',
      'paris',
      'romance'
    ],
    ids: [
      'Europe/Paris',
      'Africa/Ceuta',
      'Arctic/Longyearbyen',
      'Europe/Amsterdam',
      'Europe/Andorra',
      'Europe/Belgrade',
      'Europe/Berlin',
      'Europe/Bratislava',
      'Europe/Brussels',
      'Europe/Budapest',
      'Europe/Busingen',
      'Europe/Copenhagen',
      'Europe/Gibraltar',
      'Europe/Ljubljana',
      'Europe/Luxembourg',
      'Europe/Madrid',
      'Europe/Malta',
      'Europe/Monaco',
      'Europe/Oslo',
      'Europe/Podgorica',
      'Europe/Prague',
      'Europe/Rome',
      'Europe/San_Marino',
      'Europe/Sarajevo',
      'Europe/Skopje',
      'Europe/Stockholm',
      'Europe/Tirane',
      'Europe/Vaduz',
      'Europe/Vatican',
      'Europe/Vienna',
      'Europe/Warsaw',
      'Europe/Zagreb',
      'Europe/Zurich'
    ],
    std: {
      abbr: 'CET',
      name: 'Central European Standard Time',
      offset: 1
    },
    dst: {
      abbr: 'CEST',
      name: 'Central European Summer Time',
      offset: 2
    },
    long: '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    ids: [
      'America/Puerto_Rico',
      'America/Montserrat',
      'America/Port_of_Spain',
      'America/Santo_Domingo',
      'America/St_Barthelemy',
      'America/St_Kitts',
      'America/St_Lucia',
      'America/St_Thomas',
      'America/St_Vincent',
      'America/Tortola',
      'America/Grenada',
      'America/Guadeloupe',
      'America/Kralendijk',
      'America/Lower_Princes',
      'America/Marigot',
      'America/Martinique',
      'America/Anguilla',
      'America/Antigua',
      'America/Aruba',
      'America/Barbados',
      'America/Blanc-Sablon',
      'America/Curacao',
      'America/Dominica'
    ],
    std: {
      name: 'Atlantic Standard Time',
      abbr: 'AST',
      offset: -4
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Greenwich Mean Time',
    abbr: null,
    aliases: ['gmt', 'zulu', 'utc', 'coordinated universal time'],
    ids: [
      'Etc/GMT',
      'Africa/Abidjan',
      'Africa/Accra',
      'Africa/Bamako',
      'Africa/Banjul',
      'Africa/Bissau',
      'Africa/Conakry',
      'Africa/Dakar',
      'Africa/Freetown',
      'Africa/Lome',
      'Africa/Monrovia',
      'Africa/Nouakchott',
      'Africa/Ouagadougou',
      'Africa/Sao_Tome',
      'America/Danmarkshavn',
      'Atlantic/Reykjavik',
      'Atlantic/St_Helena',
      'Etc/UTC'
    ],
    std: {
      name: 'Greenwich Mean Time',
      abbr: 'GMT',
      offset: 0
    },
    dst: {},
    long: '(UTC) Coordinated Universal Time',
    hem: 'n'
  },
  {
    name: 'Eastern European Time',
    abbr: null,
    aliases: ['europe eastern'],
    ids: [
      'Asia/Beirut',
      'Asia/Famagusta',
      'Asia/Nicosia',
      'Europe/Athens',
      'Europe/Bucharest',
      'Europe/Chisinau',
      'Europe/Helsinki',
      'Europe/Kiev',
      'Europe/Mariehamn',
      'Europe/Riga',
      'Europe/Sofia',
      'Europe/Tallinn',
      'Europe/Uzhgorod',
      'Europe/Vilnius',
      'Europe/Zaporozhye'
    ],
    std: {
      abbr: 'EET',
      name: 'Eastern European Standard Time',
      offset: 2
    },
    dst: {
      abbr: 'EEST',
      name: 'Eastern European Summer Time',
      offset: 3
    },
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    ids: [
      'America/Indiana',
      'America/North_Dakota',
      'America/Belize',
      'America/Costa_Rica',
      'America/El_Salvador',
      'America/Guatemala',
      'America/Indiana/Knox',
      'America/Indiana/Tell_City',
      'America/Managua',
      'America/North_Dakota/Beulah',
      'America/North_Dakota/Center',
      'America/North_Dakota/New_Salem',
      'America/Regina',
      'America/Swift_Current',
      'America/Tegucigalpa'
    ],
    std: {
      name: 'Central Standard Time',
      abbr: 'CST',
      offset: -6
    },
    hem: 'n'
  },
  {
    name: 'Eastern Time',
    abbr: 'ET',
    aliases: ['america eastern', 'eastern standard time', 'eastern'],
    ids: [
      'America/New_York',
      'America/Detroit',
      'America/Grand_Turk',
      'America/Indianapolis',
      'America/Iqaluit',
      'America/Louisville',
      'America/Nassau',
      'America/Nipigon',
      'America/Pangnirtung',
      'America/Port-au-Prince',
      'America/Thunder_Bay',
      'America/Toronto',
      'America/Montreal',
      'America/Kentucky'
    ],
    std: {
      name: 'Eastern Standard Time',
      abbr: 'EST',
      offset: -5
    },
    dst: {
      name: 'Eastern Daylight Time',
      abbr: 'EDT',
      offset: -4
    },
    long: '(UTC-05:00) Eastern Time (US & Canada)',
    hem: 'n'
  },
  {
    name: 'Argentina Time',
    abbr: 'ART',
    aliases: ['argentina', 'arst', 'argentina standard time', 'buenos aires'],
    ids: [
      'America/Buenos_Aires',
      'America/Argentina/La_Rioja',
      'America/Argentina/Rio_Gallegos',
      'America/Argentina/Salta',
      'America/Argentina/San_Juan',
      'America/Argentina/San_Luis',
      'America/Argentina/Tucuman',
      'America/Argentina/Ushuaia',
      'America/Catamarca',
      'America/Cordoba',
      'America/Jujuy',
      'America/Mendoza',
      'Antarctica/Rothera',
      'America/Argentina'
    ],
    std: {
      name: 'Argentina Standard Time',
      abbr: 'ART',
      offset: -3
    },
    dst: {},
    long: '(UTC-03:00) City of Buenos Aires',
    hem: 's'
  },
  {
    name: '',
    dupe: true,
    ids: [
      'America/Coral_Harbour',
      'America/Indiana/Marengo',
      'America/Indiana/Petersburg',
      'America/Indiana/Vevay',
      'America/Indiana/Vincennes',
      'America/Indiana/Winamac',
      'America/Kentucky/Monticello',
      'America/Cancun',
      'America/Cayman',
      'America/Jamaica',
      'America/Panama'
    ],
    std: {
      name: 'Eastern Standard Time',
      abbr: 'EST',
      offset: -5
    },
    hem: 'n'
  },
  {
    name: 'East Africa Time',
    abbr: null,
    aliases: [
      'africa eastern',
      'e. africa standard time',
      'nairobi',
      'east africa',
      'eastern africa'
    ],
    ids: [
      'Africa/Nairobi',
      'Africa/Addis_Ababa',
      'Africa/Asmera',
      'Africa/Dar_es_Salaam',
      'Africa/Djibouti',
      'Africa/Kampala',
      'Africa/Mogadishu',
      'Indian/Comoro',
      'Indian/Mayotte'
    ],
    std: {
      name: 'East Africa Time',
      abbr: 'EAT',
      offset: 3
    },
    dst: {},
    long: '(UTC+03:00) Nairobi',
    hem: 'n'
  },
  {
    name: 'West Africa Time',
    abbr: 'WAT',
    aliases: [
      'africa western',
      'wast',
      'western africa',
      'w. central africa standard time',
      'west central africa',
      'w. central africa'
    ],
    ids: [
      'Africa/Lagos',
      'Africa/Bangui',
      'Africa/Douala',
      'Africa/Libreville',
      'Africa/Malabo',
      'Africa/Ndjamena',
      'Africa/Niamey',
      'Africa/Porto-Novo'
    ],
    std: {
      name: 'West Africa Standard Time',
      abbr: 'WAT',
      offset: 1
    },
    long: '(UTC+01:00) West Central Africa',
    hem: 'n'
  },
  {
    name: 'Moscow Time',
    abbr: null,
    aliases: ['moscow', 'russian standard time', 'st. petersburg', 'russian', 'volgograd time'],
    ids: [
      'Europe/Moscow',
      'Europe/Astrakhan',
      'Europe/Minsk',
      'Europe/Simferopol',
      'Europe/Ulyanovsk',
      'Europe/Kirov',
      'Europe/Volgograd',
      'Asia/Volgograd'
    ],
    std: {
      abbr: 'MSK',
      name: 'Moscow Standard Time',
      offset: 3
    },
    dst: {},
    long: '(UTC+03:00) Moscow, St. Petersburg',
    hem: 'n'
  },
  {
    name: 'Brasilia Time',
    abbr: null,
    aliases: ['brasilia', 'e. south america standard time', 'east south america'],
    ids: [
      'America/Sao_Paulo',
      'America/Araguaina',
      'America/Bahia',
      'America/Belem',
      'America/Fortaleza',
      'America/Maceio',
      'America/Recife',
      'America/Santarem'
    ],
    std: {
      abbr: 'BRT',
      name: 'Brasilia Standard Time',
      offset: -3
    },
    dst: {},
    long: '(UTC-03:00) Brasilia',
    hem: 's'
  },
  {
    name: 'Mountain Time',
    abbr: 'MT',
    aliases: ['america mountain', 'mountain standard time', 'mountain'],
    ids: [
      'America/Boise',
      'America/Cambridge_Bay',
      'America/Denver',
      'America/Edmonton',
      'America/Inuvik',
      'America/Ojinaga',
      'America/Yellowknife'
    ],
    std: {
      name: 'Mountain Standard Time',
      abbr: 'MST',
      offset: -7
    },
    dst: {
      name: 'Mountain Daylight Time',
      abbr: 'MDT',
      offset: -6
    },
    long: '(UTC-07:00) Mountain Time (US & Canada)',
    hem: 'n'
  },
  {
    name: 'Central Time',
    abbr: 'CT',
    aliases: ['america central', 'central standard time', 'central'],
    ids: [
      'America/Chicago',
      'America/Matamoros',
      'America/Menominee',
      'America/Rainy_River',
      'America/Rankin_Inlet',
      'America/Resolute',
      'America/Winnipeg'
    ],
    std: {
      name: 'Central Standard Time',
      abbr: 'CST',
      offset: -6
    },
    dst: {
      name: 'Central Daylight Time',
      abbr: 'CDT',
      offset: -5
    },
    long: '(UTC-06:00) Central Time (US & Canada)',
    hem: 'n'
  },
  {
    name: 'Central Africa Time',
    abbr: null,
    aliases: ['africa central', 'namibia standard time', 'windhoek', 'namibia'],
    ids: [
      'Africa/Windhoek',
      'Africa/Gaborone',
      'Africa/Harare',
      'Africa/Lubumbashi',
      'Africa/Lusaka',
      'Africa/Maputo'
    ],
    std: {
      name: 'Central Africa Time',
      abbr: 'CAT',
      offset: 2
    },
    dst: {},
    long: '(UTC+02:00) Windhoek',
    hem: 's'
  },
  {
    name: 'Arabian Time',
    abbr: null,
    aliases: ['arabian', 'arab standard time', 'kuwait', 'riyadh', 'arab', 'arabia', 'arabic'],
    ids: ['Asia/Baghdad', 'Asia/Aden', 'Asia/Bahrain', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Riyadh'],
    std: {
      abbr: 'AST',
      name: 'Arabian Standard Time',
      offset: 3
    },
    dst: {},
    long: '(UTC+03:00) Kuwait, Riyadh',
    hem: 'n'
  },
  {
    name: 'Alaska Time',
    abbr: 'AKT',
    aliases: ['alaska', 'alaskan standard time', 'alaskan'],
    ids: [
      'America/Anchorage',
      'America/Juneau',
      'America/Metlakatla',
      'America/Nome',
      'America/Sitka',
      'America/Yakutat'
    ],
    std: {
      name: 'Alaska Standard Time',
      abbr: 'AKST',
      offset: -9
    },
    dst: {
      name: 'Alaska Daylight Time',
      abbr: 'AKDT',
      offset: -8
    },
    long: '(UTC-09:00) Alaska',
    hem: 'n'
  },
  {
    name: 'Atlantic Time',
    abbr: 'AT',
    aliases: ['atlantic', 'atlantic standard time'],
    ids: [
      'America/Halifax',
      'America/Glace_Bay',
      'America/Goose_Bay',
      'America/Moncton',
      'America/Thule',
      'Atlantic/Bermuda'
    ],
    std: {
      name: 'Atlantic Standard Time',
      abbr: 'AST',
      offset: -4
    },
    dst: {
      name: 'Atlantic Daylight Time',
      abbr: 'ADT',
      offset: -3
    },
    long: '(UTC-04:00) Atlantic Time (Canada)',
    hem: 'n'
  },
  {
    name: 'British Time',
    abbr: null,
    aliases: ['gmt', 'gmt standard time', 'dublin', 'edinburgh', 'lisbon', 'london'],
    ids: [
      'Europe/London',
      'Europe/Dublin',
      'Europe/Guernsey',
      'Europe/Isle_of_Man',
      'Europe/Jersey'
    ],
    std: {
      name: 'Greenwich Mean Time',
      abbr: 'GMT',
      offset: 0
    },
    dst: {
      name: 'British Summer Time',
      abbr: 'BST',
      offset: 1
    },
    long: '(UTC+00:00) Dublin, Edinburgh, Lisbon, London',
    hem: 'n'
  },
  {
    name: 'Central Africa Time',
    dupe: true,
    ids: ['Africa/Blantyre', 'Africa/Bujumbura', 'Africa/Juba', 'Africa/Khartoum', 'Africa/Kigali'],
    std: {
      name: 'Central Africa Time',
      abbr: 'CAT',
      offset: 2
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'West Kazakhstan Time',
    abbr: null,
    aliases: [
      'kazakhstan western',
      'west asia standard time',
      'ashgabat',
      'tashkent',
      'west asia',
      'alma ata'
    ],
    ids: ['Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Atyrau', 'Asia/Oral', 'Asia/Qyzylorda'],
    std: {
      abbr: 'ALMT',
      name: 'Alma-Ata Time',
      offset: 5
    },
    dst: {},
    long: '(UTC+05:00) Ashgabat, Tashkent',
    hem: 'n'
  },
  {
    name: 'Eastern Australia Time',
    abbr: 'AET',
    aliases: [
      'australia eastern',
      'aus eastern standard time',
      'canberra',
      'melbourne',
      'sydney',
      'aus eastern',
      'aus east'
    ],
    ids: [
      'Australia/Sydney',
      'Antarctica/Macquarie',
      'Australia/Currie',
      'Australia/Hobart',
      'Australia/Melbourne'
    ],
    std: {
      name: 'Australian Eastern Standard Time',
      abbr: 'AEST',
      offset: 10
    },
    dst: {
      name: 'Australian Eastern Daylight Time',
      abbr: 'AEDT',
      offset: 11
    },
    long: '(UTC+10:00) Canberra, Melbourne, Sydney',
    hem: 's'
  },
  {
    name: 'Western European Time',
    abbr: null,
    aliases: ['europe western'],
    ids: ['Europe/Lisbon', 'Atlantic/Canary', 'Atlantic/Faeroe', 'Atlantic/Madeira'],
    std: {
      abbr: 'WET',
      name: 'Western European Standard Time',
      offset: 0
    },
    dst: {
      abbr: 'WEST',
      name: 'Western European Summer Time',
      offset: 1
    },
    hem: 'n'
  },
  {
    name: 'Indochina Time',
    abbr: null,
    aliases: [
      'indochina',
      'se asia standard time',
      'bangkok',
      'hanoi',
      'jakarta',
      'se asia',
      'south east asia'
    ],
    ids: ['Asia/Bangkok', 'Asia/Phnom_Penh', 'Asia/Saigon', 'Asia/Vientiane'],
    std: {
      abbr: 'ICT',
      name: 'Indochina Time',
      offset: 7
    },
    dst: {},
    long: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    abbr: 'MT',
    std: {
      name: 'Mountain Standard Time',
      abbr: 'MST',
      offset: -7
    },
    ids: ['America/Phoenix', 'America/Creston', 'America/Dawson_Creek', 'America/Fort_Nelson'],
    hem: 'n'
  },
  {
    name: 'Central Mexico Time',
    long: '(UTC-06:00) Guadalajara, Mexico City, Monterrey',
    aliases: ['guadalajara', 'mexico city', 'monterrey', 'central mexico', 'central mexican'],
    ids: ['America/Mexico_City', 'America/Merida', 'America/Monterrey', 'America/Bahia_Banderas'],
    std: {
      name: 'Central Standard Time',
      abbr: 'CST',
      offset: -6
    },
    dst: {
      name: 'Central Daylight Time',
      abbr: 'CDT',
      offset: -5
    },
    hem: 'n'
  },
  {
    name: 'West Africa Time',
    dupe: true,
    ids: ['Africa/Luanda', 'Africa/Kinshasa', 'Africa/Brazzaville'],
    std: {
      name: 'West Africa Standard Time',
      abbr: 'WAT',
      offset: 1
    },
    hem: 's'
  },
  {
    name: '',
    dupe: true,
    ids: ['Africa/Cairo', 'Africa/Tripoli', 'Europe/Kaliningrad'],
    std: {
      abbr: 'EET',
      name: 'Eastern European Standard Time',
      offset: 2
    },
    hem: 'n'
  },
  {
    name: 'South Africa Time',
    abbr: null,
    aliases: [
      'africa southern',
      'south africa standard time',
      'harare',
      'pretoria',
      'south africa'
    ],
    ids: ['Africa/Johannesburg', 'Africa/Maseru', 'Africa/Mbabane'],
    std: {
      name: 'South Africa Standard Time',
      abbr: 'SAST',
      offset: 2
    },
    dst: {},
    long: '(UTC+02:00) Harare, Pretoria',
    hem: 's'
  },
  {
    name: 'Krasnoyarsk Time',
    abbr: null,
    aliases: ['krasnoyarsk', 'north asia standard time', 'north asia'],
    ids: ['Asia/Krasnoyarsk', 'Asia/Novokuznetsk', 'Asia/Barnaul'],
    std: {
      abbr: 'KRAT',
      name: 'Krasnoyarsk Standard Time',
      offset: 7
    },
    dst: {},
    long: '(UTC+07:00) Krasnoyarsk',
    hem: 'n'
  },
  {
    name: 'Yakutsk Time',
    abbr: null,
    aliases: ['yakutsk', 'yakutsk standard time'],
    ids: ['Asia/Yakutsk', 'Asia/Chita', 'Asia/Khandyga'],
    std: {
      abbr: 'YAKT',
      name: 'Yakutsk Standard Time',
      offset: 9
    },
    dst: {},
    long: '(UTC+09:00) Yakutsk',
    hem: 'n'
  },
  {
    name: 'Pacific Time',
    abbr: 'PT',
    aliases: ['america pacific', 'pacific standard time', 'pacific'],
    ids: ['America/Los_Angeles', 'America/Tijuana', 'America/Vancouver'],
    std: {
      name: 'Pacific Standard Time',
      abbr: 'PST',
      offset: -8
    },
    dst: {
      name: 'Pacific Daylight Time',
      abbr: 'PDT',
      offset: -7
    },
    long: '(UTC-08:00) Pacific Time (US & Canada)',
    hem: 'n'
  },
  {
    name: 'Amazon Time',
    abbr: null,
    aliases: [
      'amazon',
      'central brazilian standard time',
      'cuiaba',
      'central brazilian',
      'central brazil'
    ],
    ids: ['America/Boa_Vista', 'America/Manaus', 'America/Porto_Velho'],
    std: {
      abbr: 'AMT',
      name: 'Amazon Standard Time',
      offset: -4
    },
    dst: {},
    long: '(UTC-04:00) Cuiaba',
    hem: 'n'
  },
  {
    name: 'Morocco Standard Time',
    offset: 1,
    long: '(UTC+00:00) Casablanca',
    aliases: ['casablanca', 'morocco'],
    ids: ['Africa/Casablanca', 'Africa/El_Aaiun'],
    std: {
      abbr: 'WET',
      name: 'Western European Standard Time',
      offset: 1
    },
    dst: {
      abbr: 'WEST',
      name: 'Western European Summer Time',
      offset: 0
    },
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    ids: ['Africa/Algiers', 'Africa/Tunis'],
    std: {
      abbr: 'CET',
      name: 'Central European Standard Time',
      offset: 1
    },
    dst: {
      abbr: 'CEST',
      name: 'Central European Summer Time',
      offset: 2
    },
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    ids: ['Asia/Gaza', 'Asia/Hebron'],
    std: {
      abbr: 'EET',
      name: 'Eastern European Standard Time',
      offset: 2
    },
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    ids: ['Asia/Damascus', 'Asia/Amman'],
    std: {
      abbr: 'EET',
      name: 'Eastern European Standard Time',
      offset: 2
    },
    hem: 'n'
  },
  {
    name: 'Gulf Time',
    abbr: null,
    aliases: ['gulf', 'arabian standard time', 'abu dhabi', 'muscat', 'arabian'],
    ids: ['Asia/Dubai', 'Asia/Muscat'],
    std: {
      name: 'Gulf Standard Time',
      abbr: 'GST',
      offset: 4
    },
    dst: {},
    long: '(UTC+04:00) Abu Dhabi, Muscat',
    hem: 'n'
  },
  {
    name: 'Samara Time',
    abbr: null,
    aliases: ['samara', 'russia time zone 3', 'izhevsk'],
    ids: ['Europe/Samara', 'Europe/Saratov'],
    std: {
      abbr: 'SAMT',
      name: 'Samara Standard Time',
      offset: 4
    },
    dst: {},
    long: '(UTC+04:00) Izhevsk, Samara',
    hem: 'n'
  },
  {
    name: 'Uzbekistan Time',
    abbr: null,
    aliases: ['uzbekistan'],
    ids: ['Asia/Samarkand', 'Asia/Tashkent'],
    std: {
      abbr: 'UZT',
      name: 'Uzbekistan Standard Time',
      offset: 5
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'East Kazakhstan Time',
    abbr: null,
    aliases: ['kazakhstan eastern', 'central asia standard time', 'astana', 'central asia'],
    ids: ['Asia/Almaty', 'Asia/Qostanay'],
    std: {
      abbr: 'ALMT',
      name: 'East Kazakhstan Time',
      offset: 6
    },
    dst: {},
    long: '(UTC+06:00) Astana',
    hem: 'n'
  },
  {
    name: 'Omsk Time',
    abbr: null,
    aliases: ['omsk', 'omsk standard time'],
    ids: ['Asia/Omsk', 'Asia/Tomsk'],
    std: {
      abbr: 'OMST',
      name: 'Omsk Standard Time',
      offset: 6
    },
    dst: {},
    long: '(UTC+06:00) Omsk',
    hem: 'n'
  },
  {
    name: 'Western Indonesia Time',
    abbr: null,
    aliases: ['indonesia western'],
    ids: ['Asia/Jakarta', 'Asia/Pontianak'],
    std: {
      name: 'Western Indonesia Time',
      abbr: 'WIB',
      offset: 7
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Ulaanbaatar Time',
    abbr: null,
    aliases: ['mongolia', 'ulaanbaatar standard time', 'ulaanbaatar'],
    ids: ['Asia/Ulaanbaatar', 'Asia/Choibalsan'],
    std: {
      abbr: 'ULAT',
      name: 'Ulaanbaatar Standard Time',
      offset: 8
    },
    dst: {},
    long: '(UTC+08:00) Ulaanbaatar',
    hem: 'n'
  },
  {
    name: 'Malaysia Time',
    abbr: null,
    aliases: ['malaysia'],
    ids: ['Asia/Kuala_Lumpur', 'Asia/Kuching'],
    std: {
      name: 'Malaysia Time',
      abbr: 'MYT',
      offset: 8
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Korean Time',
    abbr: null,
    aliases: ['korea', 'korea standard time', 'seoul'],
    ids: ['Asia/Seoul', 'Asia/Pyongyang'],
    std: {
      abbr: 'KST',
      name: 'Korean Standard Time',
      offset: 9
    },
    dst: {},
    long: '(UTC+09:00) Seoul',
    hem: 'n'
  },
  {
    name: 'Central Australia Time',
    abbr: 'ACT',
    aliases: ['australia central', 'cen. australia standard time', 'adelaide', 'central australia'],
    ids: ['Australia/Adelaide', 'Australia/Broken_Hill'],
    std: {
      name: 'Australian Central Standard Time',
      abbr: 'ACST',
      offset: 9.5
    },
    dst: {
      name: 'Australian Central Daylight Time',
      abbr: 'ACDT',
      offset: 10.5
    },
    long: '(UTC+09:30) Adelaide',
    hem: 's'
  },
  {
    name: 'Brisbane Time',
    dupe: true,
    ids: ['Australia/Brisbane', 'Australia/Lindeman'],
    std: {
      name: 'Australian Eastern Standard Time',
      abbr: 'AEST',
      offset: 10
    },
    hem: 's'
  },
  {
    name: 'Vladivostok Time',
    abbr: null,
    aliases: ['vladivostok', 'vladivostok standard time'],
    ids: ['Asia/Vladivostok', 'Asia/Ust-Nera'],
    std: {
      abbr: 'VLAT',
      name: 'Vladivostok Standard Time',
      offset: 10
    },
    dst: {},
    long: '(UTC+10:00) Vladivostok',
    hem: 'n'
  },
  {
    name: 'Chamorro Time',
    abbr: null,
    aliases: [
      'chamorro',
      'west pacific standard time',
      'guam',
      'port moresby',
      'west pacific',
      'western pacific'
    ],
    ids: ['Pacific/Guam', 'Pacific/Saipan'],
    std: {
      name: 'Chamorro Standard Time',
      abbr: 'ChST',
      offset: 10
    },
    dst: {},
    long: '(UTC+10:00) Guam, Port Moresby',
    hem: 'n'
  },
  {
    name: 'Papua New Guinea Time',
    abbr: null,
    aliases: ['papua new guinea', 'guinea', 'guinean'],
    ids: ['Pacific/Bougainville', 'Pacific/Port_Moresby'],
    std: {
      abbr: 'PGT',
      name: 'Papua New Guinea Time',
      offset: 11
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'New Zealand Time',
    abbr: 'NZT',
    aliases: ['new zealand', 'new zealand standard time', 'auckland', 'wellington'],
    ids: ['Pacific/Auckland', 'Antarctica/McMurdo'],
    std: {
      name: 'New Zealand Standard Time',
      abbr: 'NZST',
      offset: 12
    },
    dst: {
      name: 'New Zealand Daylight Time',
      abbr: 'NZDT',
      offset: 13
    },
    long: '(UTC+12:00) Auckland, Wellington',
    hem: 's'
  },
  {
    name: 'Marshall Islands Time',
    abbr: null,
    aliases: ['marshall islands'],
    ids: ['Pacific/Kwajalein', 'Pacific/Majuro'],
    std: {
      abbr: 'MHT',
      name: 'Marshall Islands Time',
      offset: 12
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Samoa Time',
    abbr: 'SST',
    aliases: ['samoa', 'samoa standard time'],
    ids: ['Pacific/Midway', 'Pacific/Pago_Pago'],
    std: {
      abbr: 'SST',
      name: 'Samoa Standard Time',
      offset: -11
    },
    dst: {},
    long: '(UTC+13:00) Samoa',
    hem: 'n'
  },
  {
    name: 'Hawaii-Aleutian Time',
    abbr: 'HAT',
    aliases: ['hawaii aleutian', 'aleutian standard time', 'aleutian'],
    ids: ['Pacific/Honolulu', 'Pacific/Johnston'],
    std: {
      name: 'Hawaii-Aleutian Standard Time',
      abbr: 'HAST',
      offset: -9
    },
    dst: {
      name: 'Hawaii-Aleutian Daylight Time',
      abbr: 'HADT',
      offset: -8
    },
    long: '(UTC-09:00) Aleutian Islands',
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    std: {
      name: 'Mountain Standard Time',
      abbr: 'MST',
      offset: -7
    },
    ids: ['America/Dawson', 'America/Whitehorse'],
    hem: 'n'
  },
  {
    name: 'Mexican Pacific Time',
    abbr: 'HPMX',
    aliases: [
      'mexico pacific',
      'mountain standard time (mexico)',
      'chihuahua',
      'la paz',
      'mazatlan',
      'mountain mexico'
    ],
    ids: ['America/Chihuahua', 'America/Mazatlan'],
    std: {
      name: 'Mexican Pacific Standard Time',
      abbr: 'HNPMX',
      offset: -7
    },
    dst: {
      name: 'Mexican Pacific Daylight Time',
      abbr: 'HEPMX',
      offset: -6
    },
    long: '(UTC-07:00) Chihuahua, La Paz, Mazatlan',
    hem: 'n'
  },
  {
    name: 'Colombia Time',
    abbr: 'COT',
    aliases: ['colombia', 'cost'],
    ids: ['America/Bogota', 'Pacific/Galapagos'],
    std: {
      name: 'Colombia Standard Time',
      abbr: 'COT',
      offset: -5
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Acre Time',
    abbr: null,
    aliases: ['acre'],
    ids: ['America/Eirunepe', 'America/Rio_Branco'],
    std: {
      abbr: 'ACT',
      name: 'Acre Standard Time',
      offset: -5
    },
    dst: {},
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    ids: ['America/Campo_Grande', 'America/Cuiaba'],
    std: {
      abbr: 'AMT',
      name: 'Amazon Standard Time',
      offset: -4
    },
    hem: 's'
  },
  {
    name: '',
    dupe: true,
    ids: ['Antarctica/Palmer', 'America/Punta_Arenas'],
    std: {
      name: 'Chile Standard Time',
      abbr: 'CLT',
      offset: -3
    },
    hem: 's'
  },
  {
    name: 'Troll Time',
    dupe: true,
    abbr: null,
    aliases: ['troll research station'],
    ids: ['Antarctica/Troll'],
    std: {
      name: 'Greenwich Mean Time',
      abbr: 'GMT',
      offset: 0
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'East Greenland Time',
    abbr: 'HEG',
    aliases: ['greenland eastern'],
    ids: ['America/Scoresbysund'],
    std: {
      name: 'East Greenland Standard Time',
      abbr: 'HNEG',
      offset: 0
    },
    dst: {
      name: 'East Greenland Summer Time',
      abbr: 'HEEG',
      offset: 1
    },
    hem: 'n'
  },
  {
    name: 'Israel Time',
    abbr: null,
    aliases: ['israel', 'israel standard time', 'jerusalem'],
    ids: ['Asia/Jerusalem'],
    std: {
      abbr: 'IST',
      name: 'Israel Standard Time',
      offset: 2
    },
    dst: {
      name: 'Israel Daylight Time',
      offset: 3
    },
    long: '(UTC+02:00) Jerusalem',
    hem: 'n'
  },
  {
    name: 'East Africa Time',
    dupe: true,
    ids: ['Indian/Antananarivo'],
    std: {
      name: 'East Africa Time',
      abbr: 'EAT',
      offset: 3
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Syowa Time',
    abbr: null,
    aliases: ['syowa'],
    ids: ['Antarctica/Syowa'],
    std: {
      abbr: 'SYOT',
      name: 'Syowa Time',
      offset: 3
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Turkey Time',
    abbr: 'TRT',
    aliases: ['turkey', 'turkey standard time', 'istanbul'],
    ids: ['Europe/Istanbul'],
    std: {
      name: 'Turkey Time',
      abbr: 'TRT',
      offset: 3
    },
    dst: {},
    long: '(UTC+03:00) Istanbul',
    hem: 'n'
  },
  {
    name: 'Iran Time',
    abbr: null,
    aliases: ['iran', 'iran standard time', 'tehran'],
    ids: ['Asia/Tehran'],
    std: {
      abbr: 'IRST',
      name: 'Iran Standard Time',
      offset: 3.5
    },
    dst: {
      abbr: 'IRDT',
      name: 'Iran Daylight Time',
      offset: 4.5
    },
    long: '(UTC+03:30) Tehran',
    hem: 'n'
  },
  {
    name: 'Azerbaijan Time',
    abbr: null,
    aliases: ['azerbaijan', 'azerbaijan standard time', 'baku'],
    ids: ['Asia/Baku'],
    std: {
      abbr: 'AZT',
      name: 'Azerbaijan Standard Time',
      offset: 4
    },
    dst: {},
    long: '(UTC+04:00) Baku',
    hem: 'n'
  },
  {
    name: 'Georgia Time',
    abbr: 'GET',
    aliases: ['georgia', 'georgian standard time', 'tbilisi', 'georgian'],
    ids: ['Asia/Tbilisi'],
    std: {
      abbr: 'GET',
      name: 'Georgia Standard Time',
      offset: 4
    },
    dst: {},
    long: '(UTC+04:00) Tbilisi',
    hem: 'n'
  },
  {
    name: 'Armenia Time',
    abbr: 'AMT',
    aliases: ['armenia', 'caucasus standard time', 'yerevan', 'caucasus'],
    ids: ['Asia/Yerevan'],
    std: {
      abbr: 'AMT',
      name: 'Armenia Standard Time',
      offset: 4
    },
    dst: {},
    long: '(UTC+04:00) Yerevan',
    hem: 'n'
  },
  {
    name: 'Seychelles Time',
    abbr: null,
    aliases: ['seychelles'],
    ids: ['Indian/Mahe'],
    std: {
      abbr: 'SCT',
      name: 'Seychelles Time',
      offset: 4
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Mauritius Time',
    abbr: null,
    aliases: ['mauritius', 'mauritius standard time', 'port louis'],
    ids: ['Indian/Mauritius'],
    std: {
      abbr: 'MUT',
      name: 'Mauritius Standard Time',
      offset: 4
    },
    dst: {},
    long: '(UTC+04:00) Port Louis',
    hem: 'n'
  },
  {
    name: 'Réunion Time',
    abbr: null,
    aliases: ['reunion'],
    ids: ['Indian/Reunion'],
    std: {
      abbr: 'RET',
      name: 'Réunion Time',
      offset: 4
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Afghanistan Time',
    abbr: null,
    aliases: ['afghanistan', 'afghanistan standard time', 'kabul'],
    ids: ['Asia/Kabul'],
    std: {
      abbr: 'AFT',
      name: 'Afghanistan Time',
      offset: 4.5
    },
    dst: {},
    long: '(UTC+04:30) Kabul',
    hem: 'n'
  },
  {
    name: 'Mawson Time',
    abbr: null,
    aliases: ['mawson'],
    ids: ['Antarctica/Mawson'],
    std: {
      abbr: 'MAWT',
      name: 'Mawson Time',
      offset: 5
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Turkmenistan Time',
    abbr: 'TMT',
    aliases: ['turkmenistan', 'tmst'],
    ids: ['Asia/Ashgabat'],
    std: {
      name: 'Turkmenistan Standard Time',
      abbr: 'TMT',
      offset: 5
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Tajikistan Time',
    abbr: null,
    aliases: ['tajikistan'],
    ids: ['Asia/Dushanbe'],
    std: {
      abbr: 'TJT',
      name: 'Tajikistan Time',
      offset: 5
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Pakistan Time',
    abbr: null,
    aliases: ['pakistan', 'pakistan standard time', 'islamabad', 'karachi'],
    ids: ['Asia/Karachi'],
    std: {
      abbr: 'PKT',
      name: 'Pakistan Standard Time',
      offset: 5
    },
    dst: {},
    long: '(UTC+05:00) Islamabad, Karachi',
    hem: 'n'
  },
  {
    name: 'Yekaterinburg Time',
    abbr: 'YEKT',
    aliases: ['yekaterinburg', 'ekaterinburg standard time', 'ekaterinburg'],
    ids: ['Asia/Yekaterinburg'],
    std: {
      abbr: 'YEKT',
      name: 'Yekaterinburg Standard Time',
      offset: 5
    },
    dst: {},
    long: '(UTC+05:00) Ekaterinburg',
    hem: 'n'
  },
  {
    name: 'French Southern & Antarctic Time',
    abbr: null,
    aliases: ['french southern'],
    ids: ['Indian/Kerguelen'],
    std: {
      abbr: 'TFT',
      name: 'French Southern & Antarctic Time',
      offset: 5
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Maldives Time',
    abbr: null,
    aliases: ['maldives'],
    ids: ['Indian/Maldives'],
    std: {
      abbr: 'MVT',
      name: 'Maldives Time',
      offset: 5
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Nepal Time',
    abbr: null,
    aliases: ['nepal', 'nepal standard time', 'kathmandu'],
    ids: ['Asia/Katmandu'],
    std: {
      abbr: 'NPT',
      name: 'Nepal Time',
      offset: 5.75
    },
    dst: {},
    long: '(UTC+05:45) Kathmandu',
    hem: 'n'
  },
  {
    name: 'Vostok Time',
    abbr: null,
    aliases: ['vostok'],
    ids: ['Antarctica/Vostok'],
    std: {
      abbr: 'MSK+4',
      name: 'Vostok Time',
      offset: 6
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Kyrgyzstan Time',
    abbr: null,
    aliases: ['kyrgystan'],
    ids: ['Asia/Bishkek'],
    std: {
      abbr: 'KGT',
      name: 'Kyrgyzstan Time',
      offset: 6
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Bangladesh Time',
    abbr: 'BST',
    aliases: ['bangladesh', 'bangladesh standard time', 'dhaka'],
    ids: ['Asia/Dhaka'],
    std: {
      abbr: 'BST',
      name: 'Bangladesh Standard Time',
      offset: 6
    },
    dst: {},
    long: '(UTC+06:00) Dhaka',
    hem: 'n'
  },
  {
    name: 'Bhutan Time',
    abbr: null,
    aliases: ['bhutan'],
    ids: ['Asia/Thimphu'],
    std: {
      name: 'Bhutan Time',
      abbr: 'BT',
      offset: 6
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Indian Ocean Time',
    abbr: null,
    aliases: ['indian ocean', 'indian chagos'],
    ids: ['Indian/Chagos'],
    std: {
      abbr: 'IOT',
      name: 'Indian Ocean Time',
      offset: 6
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Myanmar Time',
    abbr: null,
    aliases: ['myanmar', 'myanmar standard time'],
    ids: ['Asia/Rangoon'],
    std: {
      abbr: 'MMT',
      name: 'Myanmar Time',
      offset: 6.5
    },
    dst: {},
    long: '(UTC+06:30) Yangon (Rangoon)',
    hem: 'n'
  },
  {
    name: 'Cocos Islands Time',
    abbr: null,
    aliases: ['cocos'],
    ids: ['Indian/Cocos'],
    std: {
      abbr: 'CCT',
      name: 'Cocos Islands Time',
      offset: 6.5
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Davis Time',
    abbr: null,
    aliases: ['davis'],
    ids: ['Antarctica/Davis'],
    std: {
      abbr: 'DAVT',
      name: 'Davis Time',
      offset: 7
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Hovd Time',
    abbr: null,
    aliases: ['hovd', 'w. mongolia standard time', 'west mongolia', 'western mongolia'],
    ids: ['Asia/Hovd'],
    std: {
      abbr: 'HOVT',
      name: 'Hovd Standard Time',
      offset: 7
    },
    dst: {},
    long: '(UTC+07:00) Hovd',
    hem: 'n'
  },
  {
    name: 'Novosibirsk Time',
    abbr: null,
    aliases: ['novosibirsk', 'n. central asia standard time', 'north central asia'],
    ids: ['Asia/Novosibirsk'],
    std: {
      abbr: 'NOVT',
      name: 'Novosibirsk Standard Time',
      offset: 7
    },
    dst: {},
    long: '(UTC+07:00) Novosibirsk',
    hem: 'n'
  },
  {
    name: 'Christmas Island Time',
    abbr: null,
    aliases: ['christmas'],
    ids: ['Indian/Christmas'],
    std: {
      abbr: 'CXT',
      name: 'Christmas Island Time',
      offset: 7
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Brunei Darussalam Time',
    abbr: null,
    aliases: ['brunei'],
    ids: ['Asia/Brunei'],
    std: {
      abbr: 'BNT',
      name: 'Brunei Darussalam Time',
      offset: 8
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Hong Kong Time',
    abbr: 'HKT',
    aliases: ['hong kong', 'hkst'],
    ids: ['Asia/Hong_Kong'],
    std: {
      name: 'Hong Kong Standard Time',
      abbr: 'HKT',
      offset: 8
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Irkutsk Time',
    abbr: null,
    aliases: ['irkutsk', 'north asia east standard time', 'north asia east'],
    ids: ['Asia/Irkutsk'],
    std: {
      abbr: 'IRKT',
      name: 'Irkutsk Standard Time',
      offset: 8
    },
    dst: {},
    long: '(UTC+08:00) Irkutsk',
    hem: 'n'
  },
  {
    name: 'Central Indonesia Time',
    abbr: null,
    aliases: ['indonesia central'],
    ids: ['Asia/Makassar'],
    std: {
      name: 'Central Indonesia Time',
      abbr: 'WITA',
      offset: 8
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Philippine Time',
    abbr: null,
    aliases: ['philippines'],
    ids: ['Asia/Manila'],
    std: {
      abbr: 'PHST',
      name: 'Philippine Standard Time',
      offset: 8
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Singapore Time',
    abbr: null,
    aliases: ['singapore', 'singapore standard time', 'kuala lumpur'],
    ids: ['Asia/Singapore'],
    std: {
      name: 'Singapore Standard Time',
      abbr: 'SGT',
      offset: 8
    },
    dst: {},
    long: '(UTC+08:00) Kuala Lumpur, Singapore',
    hem: 's'
  },
  {
    name: 'Taipei Time',
    abbr: null,
    aliases: ['taipei', 'taipei standard time'],
    ids: ['Asia/Taipei'],
    std: {
      abbr: 'CST',
      name: 'Taipei Standard Time',
      offset: 8
    },
    dst: {},
    long: '(UTC+08:00) Taipei',
    hem: 'n'
  },
  {
    name: 'Western Australia Time',
    abbr: 'AWT',
    aliases: [
      'australia western',
      'awdt',
      'w. australia standard time',
      'perth',
      'western australia',
      'west australia'
    ],
    ids: ['Australia/Perth'],
    std: {
      name: 'Australian Western Standard Time',
      abbr: 'AWST',
      offset: 8
    },
    dst: {},
    long: '(UTC+08:00) Perth',
    hem: 's'
  },
  {
    name: 'Australian Central Western Time',
    abbr: 'ACWT',
    aliases: [
      'australia centralwestern',
      'acwdt',
      'aus central w. standard time',
      'eucla',
      'aus central west'
    ],
    ids: ['Australia/Eucla'],
    std: {
      name: 'Australian Central Western Standard Time',
      abbr: 'ACWST',
      offset: 8.75
    },
    dst: {},
    long: '(UTC+08:45) Eucla',
    hem: 's'
  },
  {
    name: 'East Timor Time',
    abbr: 'TLT',
    aliases: ['east timor'],
    ids: ['Asia/Dili'],
    std: {
      abbr: 'TLT',
      name: 'East Timor Time',
      offset: 9
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Eastern Indonesia Time',
    abbr: null,
    aliases: ['indonesia eastern'],
    ids: ['Asia/Jayapura'],
    std: {
      name: 'Eastern Indonesia Time',
      abbr: 'WIT',
      offset: 9
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Japan Time',
    abbr: null,
    aliases: ['japan', 'jdt', 'tokyo standard time', 'osaka', 'sapporo', 'tokyo'],
    ids: ['Asia/Tokyo'],
    std: {
      name: 'Japan Standard Time',
      abbr: 'JST',
      offset: 9
    },
    dst: {},
    long: '(UTC+09:00) Osaka, Sapporo, Tokyo',
    hem: 'n'
  },
  {
    name: 'Palau Time',
    abbr: null,
    aliases: ['palau'],
    ids: ['Pacific/Palau'],
    std: {
      abbr: 'PWT',
      name: 'Palau Time',
      offset: 9
    },
    dst: {},
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    ids: ['Australia/Darwin'],
    std: {
      name: 'Australian Central Standard Time',
      abbr: 'ACST',
      offset: 9.5
    },
    hem: 's'
  },
  {
    name: 'Dumont-d’Urville Time',
    abbr: null,
    aliases: ['dumontdurville'],
    ids: ['Antarctica/DumontDUrville'],
    std: {
      abbr: 'CLST',
      name: 'Dumont-d’Urville Time',
      offset: 10
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Chuuk Time',
    abbr: null,
    aliases: ['truk'],
    ids: ['Pacific/Truk'],
    std: {
      abbr: 'CHUT',
      name: 'Chuuk Time',
      offset: 10
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Lord Howe Time',
    abbr: 'LHT',
    aliases: ['lord howe', 'lord howe standard time'],
    ids: ['Australia/Lord_Howe'],
    std: {
      name: 'Lord Howe Standard Time',
      abbr: 'LHST',
      offset: 10.5
    },
    dst: {
      name: 'Lord Howe Daylight Time',
      abbr: 'LHDT',
      offset: 11.5
    },
    long: '(UTC+10:30) Lord Howe Island',
    hem: 's'
  },
  {
    name: 'Casey Time',
    abbr: 'CAST',
    aliases: ['casey'],
    ids: ['Antarctica/Casey'],
    std: {
      abbr: 'CAST',
      name: 'Casey Time',
      offset: 11
    },
    dst: {
      name: 'Casey Summer Time',
      offset: 8
    },
    hem: 's'
  },
  {
    name: 'Magadan Time',
    abbr: null,
    aliases: ['magadan', 'magadan standard time'],
    ids: ['Asia/Magadan'],
    std: {
      abbr: 'MAGT',
      name: 'Magadan Standard Time',
      offset: 11
    },
    dst: {},
    long: '(UTC+11:00) Magadan',
    hem: 'n'
  },
  {
    name: 'Sakhalin Time',
    abbr: null,
    aliases: ['sakhalin', 'sakhalin standard time'],
    ids: ['Asia/Sakhalin'],
    std: {
      abbr: 'SAKT',
      name: 'Sakhalin Standard Time',
      offset: 11
    },
    dst: {},
    long: '(UTC+11:00) Sakhalin',
    hem: 'n'
  },
  {
    name: 'Srednekolymsk Time',
    abbr: 'SRET',
    aliases: ['srednekolymsk', 'russia time zone 10', 'chokurdakh'],
    ids: ['Asia/Srednekolymsk'],
    std: {
      abbr: 'SRET',
      name: 'Srednekolymsk Standard Time',
      offset: 11
    },
    dst: {},
    long: '(UTC+11:00) Chokurdakh',
    hem: 'n'
  },
  {
    name: 'Vanuatu Time',
    abbr: null,
    aliases: ['vanuatu'],
    ids: ['Pacific/Efate'],
    std: {
      abbr: 'VUT',
      name: 'Vanuatu Standard Time',
      offset: 11
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Solomon Islands Time',
    abbr: null,
    aliases: ['solomon'],
    ids: ['Pacific/Guadalcanal'],
    std: {
      abbr: 'SBT',
      name: 'Solomon Islands Time',
      offset: 11
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Kosrae Time',
    abbr: null,
    aliases: ['kosrae'],
    ids: ['Pacific/Kosrae'],
    std: {
      abbr: 'KOST',
      name: 'Kosrae Time',
      offset: 11
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'New Caledonia Time',
    abbr: null,
    aliases: ['new caledonia'],
    ids: ['Pacific/Noumea'],
    std: {
      abbr: 'NCT',
      name: 'New Caledonia Standard Time',
      offset: 11
    },
    dst: {
      name: 'New Caledonia Summer Time'
    },
    hem: 'n'
  },
  {
    name: 'Ponape Time',
    abbr: null,
    aliases: ['ponape'],
    ids: ['Pacific/Ponape'],
    std: {
      abbr: 'PONT',
      name: 'Ponape Time',
      offset: 11
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Anadyr Time',
    abbr: null,
    aliases: ['anadyr', 'russia time zone 11', 'petropavlovsk kamchatsky'],
    ids: ['Asia/Anadyr'],
    std: {
      abbr: 'ANAT',
      name: 'Anadyr Standard Time',
      offset: 12
    },
    dst: {},
    long: '(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky',
    hem: 'n'
  },
  {
    name: 'Petropavlovsk-Kamchatski Time',
    abbr: null,
    aliases: ['kamchatka', 'russia time zone 11', 'anadyr', 'petropavlovsk kamchatsky'],
    ids: ['Asia/Kamchatka'],
    std: {
      abbr: 'PETT',
      name: 'Petropavlovsk-Kamchatski Standard Time',
      offset: 12
    },
    dst: {},
    long: '(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky',
    hem: 'n'
  },
  {
    name: 'Fiji Time',
    abbr: 'FJT',
    aliases: ['fiji', 'fiji standard time'],
    ids: ['Pacific/Fiji'],
    std: {
      abbr: 'FJT',
      name: 'Fiji Standard Time',
      offset: 12
    },
    dst: {
      abbr: 'FJT',
      name: 'Fiji Summer Time',
      offset: 13
    },
    long: '(UTC+12:00) Fiji',
    hem: 's'
  },
  {
    name: 'Tuvalu Time',
    abbr: 'TVT',
    aliases: ['tuvalu'],
    ids: ['Pacific/Funafuti'],
    std: {
      abbr: 'TVT',
      name: 'Tuvalu Time',
      offset: 12
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Nauru Time',
    abbr: null,
    aliases: ['nauru'],
    ids: ['Pacific/Nauru'],
    std: {
      abbr: 'NRT',
      name: 'Nauru Time',
      offset: 12
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Norfolk Island Time',
    abbr: null,
    aliases: ['norfolk', 'norfolk standard time', 'norfolk island'],
    ids: ['Pacific/Norfolk'],
    std: {
      abbr: 'NFT',
      name: 'Norfolk Island Standard Time',
      offset: 12
    },
    dst: {
      abbr: 'NFDT',
      name: 'Norfolk Island Daylight Time',
      offset: 11
    },
    long: '(UTC+11:00) Norfolk Island',
    hem: 'n'
  },
  {
    name: 'Gilbert Islands Time',
    abbr: null,
    aliases: ['gilbert islands'],
    ids: ['Pacific/Tarawa'],
    std: {
      abbr: 'GILT',
      name: 'Gilbert Islands Time',
      offset: 12
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Wake Island Time',
    abbr: null,
    aliases: ['wake'],
    ids: ['Pacific/Wake'],
    std: {
      abbr: 'WAKT',
      name: 'Wake Island Time',
      offset: 12
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Wallis & Futuna Time',
    abbr: null,
    aliases: ['wallis'],
    ids: ['Pacific/Wallis'],
    std: {
      abbr: 'WFT',
      name: 'Wallis & Futuna Time',
      offset: 12
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Chatham Time',
    abbr: 'CHAT',
    aliases: ['chatham', 'chatham islands standard time', 'chatham islands'],
    ids: ['Pacific/Chatham'],
    std: {
      name: 'Chatham Standard Time',
      abbr: 'CHAST',
      offset: 12.75
    },
    dst: {
      name: 'Chatham Daylight Time',
      abbr: 'CHADT',
      offset: 13.75
    },
    long: '(UTC+12:45) Chatham Islands',
    hem: 's'
  },
  {
    name: 'West Samoa Time',
    abbr: 'WST',
    aliases: ['apia'],
    ids: ['Pacific/Apia'],
    std: {
      abbr: 'WST',
      name: 'West Samoa Time',
      offset: 13
    },
    dst: {
      abbr: 'WST',
      name: 'West Samoa Summer Time',
      offset: 14
    },
    hem: 's'
  },
  {
    name: 'Phoenix Islands Time',
    abbr: null,
    aliases: ['phoenix islands'],
    ids: ['Pacific/Enderbury'],
    std: {
      abbr: 'PHOT',
      name: 'Phoenix Islands Time',
      offset: 13
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Tokelau Time',
    abbr: null,
    aliases: ['tokelau'],
    ids: ['Pacific/Fakaofo'],
    std: {
      abbr: 'TKT',
      name: 'Tokelau Time',
      offset: 13
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Tonga Time',
    abbr: null,
    aliases: ['tonga', 'tonga standard time', "nuku'alofa"],
    ids: ['Pacific/Tongatapu'],
    std: {
      abbr: 'TOT',
      name: 'Tonga Standard Time',
      offset: 13
    },
    dst: {
      name: 'Tonga Summer Time',
      offset: 14
    },
    long: "(UTC+13:00) Nuku'alofa",
    hem: 's'
  },
  {
    name: 'Line Islands Time',
    abbr: null,
    aliases: ['line islands', 'line islands standard time', 'kiritimati island'],
    ids: ['Pacific/Kiritimati'],
    std: {
      abbr: 'LINT',
      name: 'Line Islands Time',
      offset: 14
    },
    dst: {},
    long: '(UTC+14:00) Kiritimati Island',
    hem: 'n'
  },
  {
    name: 'Niue Time',
    abbr: null,
    aliases: ['niue'],
    ids: ['Pacific/Niue'],
    std: {
      abbr: 'NUT',
      name: 'Niue Time',
      offset: -11
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Cook Islands Time',
    abbr: 'CKT',
    aliases: ['cook'],
    ids: ['Pacific/Rarotonga'],
    std: {
      abbr: 'CKT',
      name: 'Cook Islands Standard Time',
      offset: -10
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Tahiti Time',
    abbr: null,
    aliases: ['tahiti'],
    ids: ['Pacific/Tahiti'],
    std: {
      abbr: 'TAHT',
      name: 'Tahiti Time',
      offset: -10
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Marquesas Time',
    abbr: null,
    aliases: ['marquesas', 'marquesas standard time'],
    ids: ['Pacific/Marquesas'],
    std: {
      abbr: 'MART',
      name: 'Marquesas Time',
      offset: -9.5
    },
    dst: {},
    long: '(UTC-09:30) Marquesas Islands',
    hem: 'n'
  },
  {
    name: 'Aleutian Standard Time',
    iso: '(UTC-10:00) Aleutian Islands',
    aliases: ['aleutian'],
    ids: ['America/Adak'],
    abbr: 'HST',
    std: {
      name: 'Hawaii Standard Time',
      abbr: 'HST',
      offset: -10
    },
    dst: {
      name: 'Hawaii Daylight Time',
      abbr: 'HDT',
      offset: -9
    },
    hem: 'n'
  },
  {
    name: 'Gambier Time',
    abbr: null,
    aliases: ['gambier', 'utc-09', 'coordinated universal time-09'],
    ids: ['Pacific/Gambier'],
    std: {
      abbr: 'GAMT',
      name: 'Gambier Time',
      offset: -9
    },
    dst: {},
    long: '(UTC-09:00) Coordinated Universal Time-09',
    hem: 'n'
  },
  {
    name: 'Pitcairn Time',
    abbr: null,
    aliases: ['pitcairn', 'utc-08', 'coordinated universal time-08'],
    ids: ['Pacific/Pitcairn'],
    std: {
      abbr: 'PST',
      name: 'Pitcairn Time',
      offset: -8
    },
    dst: {},
    long: '(UTC-08:00) Coordinated Universal Time-08',
    hem: 'n'
  },
  {
    name: '',
    dupe: true,
    ids: ['America/Hermosillo'],
    std: {
      name: 'Mexican Pacific Standard Time',
      abbr: 'HNPMX',
      offset: -7
    },
    hem: 'n'
  },
  {
    name: 'Northwest Mexico Time',
    abbr: 'HNOMX',
    aliases: [
      'mexico northwest',
      'pacific standard time (mexico)',
      'baja california',
      'pacific mexico'
    ],
    ids: ['America/Santa_Isabel'],
    std: {
      name: 'Northwest Mexico Standard Time',
      abbr: 'HNNOMX',
      offset: -6
    },
    dst: {
      name: 'Northwest Mexico Daylight Time',
      abbr: 'HENOMX',
      offset: -5
    },
    long: '(UTC-08:00) Baja California',
    hem: 'n'
  },
  {
    name: 'Easter Island Time',
    abbr: null,
    aliases: ['easter', 'easter island standard time', 'easter island'],
    ids: ['Pacific/Easter'],
    std: {
      name: 'Easter Island Standard Time',
      abbr: 'EAST',
      offset: -6
    },
    dst: {
      name: 'Easter Island Summer Time',
      abbr: 'EASST',
      offset: -5
    },
    long: '(UTC-06:00) Easter Island',
    hem: 's'
  },
  {
    name: 'Ecuador Time',
    abbr: null,
    aliases: ['ecuador'],
    ids: ['America/Guayaquil'],
    std: {
      name: 'Ecuador Time',
      abbr: 'ECT',
      offset: -5
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Cuba Time',
    abbr: 'HCU',
    aliases: ['cuba', 'cuba standard time', 'havana'],
    ids: ['America/Havana'],
    std: {
      name: 'Cuba Standard Time',
      abbr: 'HNCU',
      offset: -5
    },
    dst: {
      name: 'Cuba Daylight Time',
      abbr: 'HECU',
      offset: -4
    },
    long: '(UTC-05:00) Havana',
    hem: 'n'
  },
  {
    name: 'Peru Time',
    abbr: null,
    aliases: ['peru'],
    ids: ['America/Lima'],
    std: {
      abbr: 'PET',
      name: 'Peru Standard Time',
      offset: -5
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Paraguay Time',
    abbr: null,
    aliases: ['paraguay', 'paraguay standard time', 'asuncion'],
    ids: ['America/Asuncion'],
    std: {
      abbr: 'PYT',
      name: 'Paraguay Standard Time',
      offset: -4
    },
    dst: {
      name: 'Paraguay Summer Time',
      offset: -3
    },
    long: '(UTC-04:00) Asuncion',
    hem: 's'
  },
  {
    name: 'Venezuela Time',
    abbr: null,
    aliases: ['venezuela', 'venezuelan', 'venezuela standard time', 'caracas'],
    ids: ['America/Caracas'],
    std: {
      name: 'Venezuela Time',
      abbr: 'VET',
      offset: -4
    },
    dst: {},
    long: '(UTC-04:00) Caracas',
    hem: 'n'
  },
  {
    name: 'Guyana Time',
    abbr: null,
    aliases: ['guyana'],
    ids: ['America/Guyana'],
    std: {
      name: 'Guyana Time',
      abbr: 'GYT',
      offset: -4
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Bolivia Time',
    abbr: null,
    aliases: ['bolivia'],
    ids: ['America/La_Paz'],
    std: {
      name: 'Bolivia Time',
      abbr: 'BOT',
      offset: -4
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Newfoundland Time',
    abbr: 'HTN',
    aliases: ['newfoundland', 'newfoundland standard time'],
    ids: ['America/St_Johns'],
    std: {
      name: 'Newfoundland Standard Time',
      abbr: 'HNTN',
      offset: -3.5
    },
    dst: {
      name: 'Newfoundland Daylight Time',
      abbr: 'HETN',
      offset: -2.5
    },
    long: '(UTC-03:30) Newfoundland',
    hem: 'n'
  },
  {
    name: 'French Guiana Time',
    abbr: null,
    aliases: ['french guiana'],
    ids: ['America/Cayenne'],
    std: {
      name: 'French Guiana Time',
      abbr: 'GFT',
      offset: -3
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'West Greenland Time',
    abbr: 'HOG',
    aliases: ['greenland western', 'greenland standard time', 'greenland'],
    ids: ['America/Godthab'],
    std: {
      name: 'West Greenland Standard Time',
      abbr: 'HNOG',
      offset: -3
    },
    dst: {
      name: 'West Greenland Summer Time',
      abbr: 'HEOG',
      offset: -2
    },
    long: '(UTC-03:00) Greenland',
    hem: 'n'
  },
  {
    name: 'St. Pierre & Miquelon Time',
    abbr: 'HPM',
    aliases: [
      'pierre miquelon',
      'saint pierre standard time',
      'saint pierre and miquelon',
      'saint pierre'
    ],
    ids: ['America/Miquelon'],
    std: {
      name: 'St. Pierre & Miquelon Standard Time',
      abbr: 'HNPM',
      offset: -3
    },
    dst: {
      name: 'St. Pierre & Miquelon Daylight Time',
      abbr: 'HEPM',
      offset: -2
    },
    long: '(UTC-03:00) Saint Pierre and Miquelon',
    hem: 'n'
  },
  {
    name: 'Uruguay Time',
    abbr: 'UYT',
    aliases: ['uruguay', 'uyst', 'montevideo standard time', 'montevideo'],
    ids: ['America/Montevideo'],
    std: {
      name: 'Uruguay Standard Time',
      abbr: 'UYT',
      offset: -3
    },
    dst: {},
    long: '(UTC-03:00) Montevideo',
    hem: 's'
  },
  {
    name: 'Suriname Time',
    abbr: null,
    aliases: ['suriname'],
    ids: ['America/Paramaribo'],
    std: {
      name: 'Suriname Time',
      abbr: 'SRT',
      offset: -3
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Chile Time',
    abbr: 'CLT',
    aliases: ['chile'],
    ids: ['America/Santiago'],
    std: {
      name: 'Chile Standard Time',
      abbr: 'CLT',
      offset: -3
    },
    dst: {
      name: 'Chile Summer Time',
      abbr: 'CLST',
      offset: -4
    },
    hem: 's'
  },
  {
    name: 'Falkland Islands Time',
    abbr: 'FKT',
    aliases: ['falkland'],
    ids: ['Atlantic/Stanley'],
    std: {
      abbr: 'FKST',
      name: 'Falkland Islands Summer Time',
      offset: -3
    },
    dst: {},
    hem: 's'
  },
  {
    name: 'Fernando de Noronha Time',
    abbr: null,
    aliases: ['noronha'],
    ids: ['America/Noronha'],
    std: {
      abbr: 'FNT',
      name: 'Fernando de Noronha Standard Time',
      offset: -2
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'South Georgia Time',
    abbr: null,
    aliases: ['south georgia'],
    ids: ['Atlantic/South_Georgia'],
    std: {
      abbr: 'GST',
      name: 'South Georgia Time',
      offset: -2
    },
    dst: {},
    hem: 'n'
  },
  {
    name: 'Azores Time',
    abbr: 'AZOT',
    aliases: ['azores', 'azores standard time'],
    ids: ['Atlantic/Azores'],
    std: {
      abbr: 'AZOT',
      name: 'Azores Standard Time',
      offset: -1
    },
    dst: {
      name: 'Azores Summer Time',
      abbr: 'AZOST',
      offset: 0
    },
    long: '(UTC-01:00) Azores',
    hem: 'n'
  },
  {
    name: 'Cape Verde Time',
    abbr: null,
    aliases: ['cape verde', 'cape verde standard time', 'cabo verde'],
    ids: ['Atlantic/Cape_Verde'],
    std: {
      abbr: 'CVT',
      name: 'Cape Verde Standard Time',
      offset: -1
    },
    dst: {},
    long: '(UTC-01:00) Cabo Verde Is.',
    hem: 'n'
  }
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

const titleCase = function (str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
};

const display = function (id) {
  if (!id) {
    return null
  }
  let meta = metas.find((obj) => {
    return obj.ids.find((tz) => {
      return tz === id
    })
  });
  if (!meta) {
    let offset = offsets[id.toLowerCase()];
    if (offset !== undefined) {
      let abbr = `UTC${offset}`;
      let parts = id.split(/\//);
      let name = titleCase(parts[parts.length - 1]);
      name = name.replace(/_/g, ' ');
      name += ' Time';
      meta = {
        std: { name: name, abbr: abbr },
        offset: null
      };
    } else {
      let abbr = id.replace(/^etc\//i, '');
      meta = {
        std: { name: id, abbr: abbr }, // 'Etc/GMT+5'
        offset: null
      };
    }
  }
  return {
    iana: id,
    standard: meta.std || null,
    daylight: meta.dst || null
    // offset: meta.offset - 1 || null
  }
};

var version = '1.1.0';

const soft = function (str) {
  let ids = find(str) || [];
  if (typeof ids === 'string') {
    ids = [ids];
  }
  ids = ids.map((id) => display(id, str));
  return ids
};
soft.prototype.version = version;
// export { find, display, version }

export default soft;
