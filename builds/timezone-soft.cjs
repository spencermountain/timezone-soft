/*! spencermountain/timezone-soft 1.5.2 MIT */
'use strict';

/* eslint-disable no-empty */
const BASE = 36;
const seq = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const cache = seq.split('').reduce(function (h, c, i) {
  h[c] = i;
  return h
}, {});

// 0, 1, 2, ..., A, B, C, ..., 00, 01, ... AA, AB, AC, ..., AAA, AAB, ...
const toAlphaCode = function (n) {
  if (seq[n] !== undefined) {
    return seq[n]
  }
  let places = 1;
  let range = BASE;
  let s = '';
  for (; n >= range; n -= range, places++, range *= BASE) {}
  for (; places > 0; places--) {
    const d = n % BASE;
    s = String.fromCharCode((d < 10 ? 48 : 55) + d) + s;
    n = (n - d) / BASE;
  }
  return s
};

const fromAlphaCode = function (s) {
  if (cache[s] !== undefined) {
    return cache[s]
  }
  let n = 0;
  let places = 1;
  let range = BASE;
  let pow = 1;
  for (; places < s.length; n += range, places++, range *= BASE) {}
  for (let i = s.length - 1; i >= 0; i--, pow *= BASE) {
    let d = s.charCodeAt(i) - 48;
    if (d > 10) {
      d -= 7;
    }
    n += d * pow;
  }
  return n
};

var encoding = {
  toAlphaCode,
  fromAlphaCode
};

const symbols = function (t) {
  const reSymbol = /^([0-9A-Z]+):([0-9A-Z]+)$/;
  for (let i = 0; i < t.nodes.length; i++) {
    if (!t.nodes[i].includes(':')) {
      break
    }
    const m = reSymbol.exec(t.nodes[i]);
    if (!m || m[0].length !== t.nodes[i].length || encoding.fromAlphaCode(m[1]) !== i) {
      throw new SyntaxError('Invalid efrt packed data: symbol definition')
    }
    t.syms.push(encoding.fromAlphaCode(m[2]));
  }
  t.symCount = t.syms.length;
  t.nodes = t.nodes.slice(t.symCount);
  if (t.nodes.length === 0 || t.syms.some((index) => !Number.isSafeInteger(index) || index >= t.nodes.length)) {
    throw new SyntaxError('Invalid efrt packed data: symbol target')
  }
};

const unescapeLabel = function (text) {
  return text.replace(/\\([\s\S]|$)/g, (match, char) => {
    if (char === '\\') {
      return '\\'
    }
    if (char >= 'a' && char <= 'j') {
      return String(char.charCodeAt(0) - 97)
    }
    throw new SyntaxError('Invalid efrt packed data: label escape')
  })
};

const dictionary = function (trie) {
  if (!trie.nodes[0].startsWith('!1:')) {
    return
  }
  const header = trie.nodes.shift().split(':');
  const tokens = Array.from(header[1]);
  const fragments = (header[2] || '').split(',');
  if (header.length !== 3 || tokens.length === 0 || tokens.length !== fragments.length ||
    new Set(tokens).size !== tokens.length || trie.nodes.length === 0 ||
    tokens.some((token) => token.length !== 1 || token.charCodeAt(0) < 33 ||
      token.charCodeAt(0) > 126 || /[A-Za-z0-9,;!:|]/.test(token) ||
      (trie.versioned && token === '\\')) ||
    fragments.some((text) => !text || /[A-Z0-9,;!:|¦]/.test(text))) {
    throw new SyntaxError('Invalid efrt packed data: fragment dictionary')
  }
  trie.dictionary = Object.create(null);
  for (let i = 0; i < tokens.length; i++) {
    trie.dictionary[tokens[i]] = trie.versioned ? unescapeLabel(fragments[i]) : fragments[i];
  }
};

// References are either absolute (symbol) or relative (1 - based)
const indexFromRef = function (trie, ref, index) {
  const dnode = encoding.fromAlphaCode(ref);
  const target = dnode < trie.symCount ? trie.syms[dnode] : index + dnode + 1 - trie.symCount;
  // The encoder emits nodes in topological order. Every edge must point
  // forward, which also rules out cycles before expansion starts.
  if (!Number.isSafeInteger(target) || target <= index || target >= trie.nodes.length) {
    throw new SyntaxError('Invalid efrt packed data: node reference')
  }
  return target
};

const parseNodes = function (trie) {
  return trie.nodes.map((node, index) => {
    if (node === '' && trie.nodes.length !== 1) {
      throw new SyntaxError('Invalid efrt packed data: empty node')
    }
    const terminal = node[0] === '!';
    const body = terminal ? node.slice(1) : node;
    const edges = [];
    // Match only at the current offset. Searching later positions would
    // repeatedly rescan a long malformed fragment before rejecting it.
    const token = /([^A-Z0-9,;!:|¦]+)([A-Z0-9]+|,|$)/y;
    for (let offset = 0; offset < body.length; offset = token.lastIndex) {
      const match = token.exec(body);
      if (!match || match.index !== offset || (match[2] === ',' && token.lastIndex === body.length)) {
        throw new SyntaxError('Invalid efrt packed data: node syntax')
      }
      const ref = match[2];
      const label = trie.versioned ? unescapeLabel(match[1]) : match[1];
      const text = trie.dictionary ? Array.from(label,
        (char) => trie.dictionary[char] || char).join('') : label;
      edges.push({
        text,
        target: ref === '' || ref === ',' ? -1 : indexFromRef(trie, ref, index)
      });
    }
    return { terminal, edges }
  })
};

const toArray = function (trie) {
  const nodes = parseNodes(trie);
  const all = [];
  const stack = [{ index: 0, pref: '', edge: -1 }];
  for (; stack.length > 0;) {
    const frame = stack[stack.length - 1];
    const node = nodes[frame.index];
    if (frame.edge === -1) {
      if (node.terminal) {
        all.push(frame.pref);
      }
      frame.edge = 0;
    }
    if (frame.edge === node.edges.length) {
      stack.pop();
      continue
    }
    const edge = node.edges[frame.edge++];
    const word = frame.pref + edge.text;
    if (edge.target === -1) {
      all.push(word);
    } else {
      stack.push({ index: edge.target, pref: word, edge: -1 });
    }
  }
  return all
};

//PackedTrie - Trie traversal of the Trie packed-string representation.
const unpack$1 = function (str, versioned = false) {
  const trie = {
    nodes: str.split(';'),
    syms: [],
    symCount: 0,
    versioned
  };
  dictionary(trie);
  //process symbols, if they have them
  if (str.match(':')) {
    symbols(trie);
  }
  return toArray(trie)
};

const unpack = function (str) {
  if (str === '' || str === null || str === undefined) {
    return {}
  }
  if (typeof str !== 'string') {
    throw new TypeError('efrt unpack expects a string')
  }
  //turn the weird string into a key-value object again
  const obj = str.split('|').reduce((h, s) => {
    const arr = s.split('¦');
    if (arr.length !== 2 || Object.prototype.hasOwnProperty.call(h, arr[0])) {
      throw new SyntaxError('Invalid efrt packed data: category separator or duplicate category')
    }
    h[arr[0]] = arr[1];
    return h
  }, Object.create(null));
  const all = {};
  Object.keys(obj).forEach(function (cat) {
    let data = obj[cat];
    const versioned = data.startsWith('!2;');
    if (versioned) {
      data = data.slice(3);
      if (!data || data === ':') {
        throw new SyntaxError('Invalid efrt packed data: missing versioned trie')
      }
    }
    const reversed = data[0] === ':';
    const arr = unpack$1(reversed ? data.slice(1) : data, versioned);
    //special case, for botched-boolean
    if (cat === 'true') {
      cat = true;
    }
    for (let i = 0; i < arr.length; i++) {
      const k = reversed ? Array.from(arr[i]).reverse().join('') : arr[i];
      if (Object.prototype.hasOwnProperty.call(all, k)) {
        if (Array.isArray(all[k]) === false) {
          if (all[k] !== cat) {
            all[k] = [all[k], cat];
          }
        } else if (!all[k].includes(cat)) {
          all[k].push(cat);
        }
      } else {
        Object.defineProperty(all, k, {
          value: cat,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
  });
  return all
};

// these are the folk heuristics that timezones use to set their dst change dates
// for example, the US changes:
// the second Sunday of March -> first Sunday of November
// http://www.webexhibits.org/daylightsaving/g.html
const patterns = {
  usa: '2nd-sun-mar-2h|1st-sun-nov-2h',// (From 1987 to 2006)
  // mexico
  mex: '1st-sun-apr-2h|last-sun-oct-2h',
  // Egypt since 2023. 24h means midnight at the end of the last Thursday.
  // https://data.iana.org/time-zones/tzdb/africa (reviewed 2026-09-30)
  egypt: 'last-fri-apr-0h|last-thu-oct-24h',

  // European Union zone
  eu0: 'last-sun-mar-0h|last-sun-oct-1h',
  eu1: 'last-sun-mar-1h|last-sun-oct-2h',
  eu2: 'last-sun-mar-2h|last-sun-oct-3h',
  eu3: 'last-sun-mar-3h|last-sun-oct-4h',
  //greenland
  green: 'last-sat-mar-23h|last-sun-oct-0h',

  // australia
  aus: '1st-sun-apr-3h|1st-sun-oct-2h',
  //lord howe australia
  lhow: '1st-sun-oct-2h|1st-sun-apr-2h',
  // new zealand
  chat: '1st-sun-apr-3h|last-sun-sep-2h', //technically 3:45h -> 2:45h
  // new Zealand, antarctica
  nz: '1st-sun-apr-3h|last-sun-sep-2h',
  // casey - antarctica
  ant: '2nd-sun-mar-0h|1st-sun-oct-0h',
  // troll - antarctica
  troll: 'last-sun-mar-1h|last-sun-oct-3h',

  //jordan
  jord: 'last-fri-feb-0h|last-fri-oct-1h',
  // lebanon
  leb: 'last-sun-mar-0h|last-sun-oct-0h',
  // syria
  syr: 'last-fri-mar-0h|last-fri-oct-0h',
  //israel
  // Start: Last Friday before April 2 -> The Sunday between Rosh Hashana and Yom Kippur
  isr: 'last-fri-mar-2h|last-sun-oct-2h',
  //palestine
  pal: 'last-sun-mar-0h|last-fri-oct-1h',

  // el aaiun
  //this one seems to be on arabic calendar?
  saha: 'last-sun-mar-3h|1st-sun-may-2h',

  // paraguay
  par: 'last-sun-mar-0h|1st-sun-oct-0h',
  //cuba
  cuba: '2nd-sun-mar-0h|1st-sun-nov-1h',
  //chile
  chile: '1st-sat-sep-24h|1st-sat-apr-24h',
  //easter island
  east: '1st-sat-apr-22h|1st-sat-sep-22h',
  //fiji
  fiji: '3rd-sun-jan-3h|2nd-sun-nov-2h',
};

// Generated by scripts/pack.js. Edit data/ instead.
var pcked = {"Africa":{"Abidjan":["true¦a5bouake,coordinated universal4daloa,g1san ped0utc,yamoussouk0zulu;ro;h0mt,reenwich mean2;!a0;!na; ti3;b4frica0tlantic/st_helena;!/0;accra,ba1conakry,dakar,freetown,lo0nouakchott,ouagadougou,timbuktu;me;mako,njul;idjan,obo","Greenwich Mean"],"Algiers":["true¦a8b6c3dz2or5s1t0;ebessa,iaret;etif,idi bel abbes;!a;e0hlef,onstantine;ntral europe0t;an;a0iskra,lida,oumerdas;b ezzouar,tna;frica,lg0nnaba;eria,iers","Central European"],"Bissau":["true¦africa,b2coordinated universal1g0utc,zulu;mt,nb,reenwich mean0uinea b1w; time;issau","Greenwich Mean"],"Cairo":["true¦a6bani suwayf,c5damanhur,e2giza,halw8i1kafr ad dawwar,luxor,new c5port said,qina,s0tanta,zagazig;hibin al kawm,ohag,uez;dku,smail8;astern europe5et,g0;!y0;!pt;airo;frica,l2s0;w0yut;an; 1exandr0;ia;fayyum,m0;a0inya;hallah al kubra,nsurah","Eastern European","egypt"],"Casablanca":["true¦aCcasablanDfBkenitAm6oujda angad,rabat,sa4t1we0;stern europe2t;angier,e0;ma7tou0;an;fi,le0;! al jadida;a1ekn4o0;hammedia,rocco;!r0;!rakesh;ra;es;fri0gadir,l hoceima;ca","Morocco Standard"],"Ceuta":["true¦africa,brussels,c0europe central,madrid,paris,romance;e0openhagen;ntral european,t,uta0;!melilla","Central European","eu2"],"El_Aaiun":["true¦afri3casablan3e2laayoune,morocco,we0;stern 0t;european,sahara;h,l_aaiun,sh;ca","Morocco Standard"],"Johannesburg":["true¦africaIbEcAd9east londBharare,johannesHk7newcastDp6r5s3tembisa,uitenhage,v2w1za0;!f;elkom,itbank;anderbijlpark,ereeniging;ast,o0prings;uth africa,weto;andBichards bay,oodepoort;aarl,ietermaritzAort elizabeth,retoria;lerk0ruger0;sdorp;iepsloot,urb5;a1enturi0;on;pe town,rletonvil0;le;enoni,loemfontein,o1rakp0;an;ks0tshabelo;burg;! southern,/m0;aseru,babane","South Africa"],"Juba":["true¦a3c2juba,s0winejok;outh sudan,s0;!d;at,entral a0;frica","Central Africa"],"Khartoum":["true¦a7c6el 5k3ny4omdurm2port sud2s0wad medani;d0inga,ud1;!n;an;ass0hartoum,osti;ala;dae3fasher,obeid;at,entral af1;d damaz1f0l qadarif;rica;in","Central Africa"],"Lagos":["true¦aVbTcReQgPiLjKkaIlGmDnnewi,oAport harcourt,s9u7w0zar8; c3a2est0; 0ern3;a3c1;rBst,t;entral0; a0;frica;gep,muah0yo;ia;a7hagamu,okoto;kDn1w0yo;er3o;do,itsha;a0in5ubi;idugu0kurdi;ri;agos,ek0;ki;du0no,tsi0;na;imeLos;badan,jebu ode,k1l0seHwo;a orangun,eDor7;eHi8ot ekp0;ene;ombe,usau;bute ikorodu,fon alaaye,nugu;alabar,d,hakwama,o0;d,ngo;auchi,en0;in;b8do7frica1ku0tani;re;! western,/0;b2douala,kinsha1l0malabo,niamey,porto-novo;ibre2uanda;sa;angui,razza0;ville; ekiti;a,eoku1u0;ja;ta","West Africa"],"Maputo":["true¦africa7beiCc6ma4na2quelimaAwindhoek,z0;imbabwe,w0;!e;ca2m0;ibia,pu1;puto,to0;la;at,entral africa,himoio;! central,/0;b2gaboro1hara4kigali,lu0;bumbashi,saka;ne;lanty1ujumbu0;ra;re","Central Africa"],"Monrovia":["true¦africa,coordinated universal3g2l0monrov1utc,zulu;br,iber0r;ia;mt,reenwich mean0; time","Greenwich Mean"],"Nairobi":["true¦africa8e4indian/2kisumu,m1na0thika,yt;irobi,kuru;a1ombasa,yt;antananarivo,comoro,ma0;yotte; 2a0ldoret;st0t; 0ern 0;africa;! eastern,/0;a1d0kampala,mogadishu;ar_es_salaam,jibouti;ddis_ababa,sm0;a0e0;ra","East Africa"],"Ndjamena":["true¦africaAchad,n8t7w0; c3a2est0; 0ern3;a3c1;st,t;entral0; a0;frica;cd,d;'d0d0;jamena;! western","West Africa"],"Sao_Tome":["true¦africa,coordinated universal5g4s0utc,zulu;ao1t0;!p; 0_0;to2;mt,reenwich mean0; ti0;me","Greenwich Mean"],"Tripoli":["true¦a4benghazi,e3l1misrat5t0zawi2;arhuna,ripoli;by,ib0y;ya;astern european,et;frica,l khums,z zawiy0;ah","Eastern European"],"Tunis":["true¦africa,ce3sfax,t0;n,un0;!is0;!ia;ntral european,t","Central European"],"Windhoek":["true¦africa3c2na0windhoek;!m0;!ibia;at,entral africa;! central","Central Africa"]},"America":{"Adak":["true¦a1h0nwt,us/aleutian;awaii s3dt,st;dak,leutian0merica/atka;! 0;islands,s0;tandard time","Aleutian Standard","usa"],"Anchorage":["true¦a0us/alaska;h6k5laska0merica,nchorage;! 1n0;! s1;s0t1;tandard t0;ime;dt,st,t;dt,st","Alaska","usa"],"Araguaina":["true¦araguaina,br1e0palmas,tocantins; south america s4ast south america;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Argentina/Buenos_Aires":["true¦a0buenos 4;merica/2r0;!g0;!e2;arge1buenos_0;aires;ntina","Argentina"],"Argentina/Catamarca":["true¦a0c2;merica/0rgentina;argentina/comodrivadavia,c0;atamarca","Argentina"],"Argentina/Cordoba":["true¦a0c2;merica/0rgentina;c0rosario;ordoba","Argentina"],"Argentina/Jujuy":["true¦a0j1;merica/j0rgentina;ujuy","Argentina"],"Argentina/La_Rioja":["true¦ar1b0city of b0la rioja;uenos aires;gentina0st,t;! 0;standard t0t0;ime","Argentina"],"Argentina/Mendoza":["true¦a0m1;merica/m0rgentina;endoza","Argentina"],"Argentina/Rio_Gallegos":["true¦ar1b0city of b0rio_gallegos;uenos aires;gentina0st,t;! 0;standard t0t0;ime","Argentina"],"Argentina/Salta":["true¦ar1b0city of b0salta;uenos aires;gentina0st,t;! 0;standard t0t0;ime","Argentina"],"Argentina/San_Juan":["true¦ar1b0city of b0san juan;uenos aires;gentina0st,t;! time","Argentina"],"Argentina/San_Luis":["true¦ar1b0city of b0san luis;uenos aires;gentina0st,t;! time","Argentina"],"Argentina/Tucuman":["true¦ar1b0city of b0tucuman;uenos aires;gentina0st,t;! time","Argentina"],"Argentina/Ushuaia":["true¦ar1b0city of b0ushuaia;uenos aires;gentina0st,t;! time","Argentina"],"Asuncion":["true¦asuncion,c3p0san lorenzo;araguay1ry,y0;!st,t;! time;apiata,iudad del este","Paraguay"],"Bahia":["true¦b2camacari,e1feira de santa0itabu0salvador,vitoria da conquista;na; south america s5ast south america;ahia,r0;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Bahia_Banderas":["true¦bah7c2guadalajara,m0;exico0onterrey;! city;entral 0st;mexic0standard 2;an,o0;! 0;time;ia_0ía de 0;banderas","Central Mexico"],"Barbados":["true¦a1b0;arbados,b,rb;st,tlantic standard time","Atlantic"],"Belem":["true¦ananindeua,b2e1macapa,par0;auapebas,á east amapá; south america s5ast south america;elem,r0;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Belize":["true¦b1c0;entral standard time,st;elize,lz,z","Central"],"Boa_Vista":["true¦am3boa vista,c0roraima;entral brazil0uiaba;!ian0;! s3;azon0t;! 0;s0t1;tandard t0;ime","Amazon"],"Bogota":["true¦armenGbBc7dosquebradas,floridablanca,i6m5neiva,p3s1v0;alledupar,illavicencio;anta marCincelejo,o0;acha,ledad;a0erei9opayan;lmi8sto;anizales,edellin,onterA;bague,taguei;a2o0ucu6;!l0st,t;!omb6;li,rtagena;arran3ello,ogo2u0;caramanga,enaventu0;ra;ta;cabermeja,quilla;ia","Colombia"],"Boise":["true¦america4boise,idaho,m0;ountain0pt,st,t;! 0;id,standard t0t0;ime;! mountain","Mountain","usa"],"Cambridge_Bay":["true¦america4cambridge bay,m0;ddt,ountain0st,t;! 0;standard t0t0;ime;! mountain","Mountain","usa"],"Campo_Grande":["true¦am0brazil,campo grande,mato grosso do sul;azon standard time,t","Amazon"],"Cancun":["true¦cancun,e0mexico,quintana roo;astern standard time,st","Eastern"],"Caracas":["true¦alto barinKbarJcDguaBm8p7san6turmeFv0;alencia,e0;!n0t;!ezuela0;! 0n;standard t0t0;ime; cristobal,ta teresa del tuy;eta4uerto la cruz;a0ucumpiz;raca0turin;ibo,y;ren8ti0;re;a4iudad 2o1u0;a,m2;ro;bolivar,guay0;ana;bim1rac1;in0quisimeto,uta;as","Venezuela"],"Cayenne":["true¦cayenne,french guiana3g0;f1u0;f,iana;!t;! time","French Guiana"],"Chicago":["true¦!2;aXbUcRdQfort worth,gPhOiMk01lJmCn8o7plano,s4t2us1wi0;chiGsconsX;/03a;ex0ulsa;!as;a0hreveport,ou4t 1;int 0n antonio;louGpaul;klahoYmaha,verland park;ashMe1or0;th dako7;braska,w 0;orleans,south me6;adisNe5i1o0;biIntgomery;lwaukee,nne1ss0;issippi,ouri;apol6so0;ta;mph4;aredo,i0ouisiana,ubb1;ncoln,ttle r0;ock;llino0owa,rving;is;oustBunts6;arland,rand prairie;allBes moines;dt,entral1hicago,orpus christi,st0t;!\\gcdt;! time;aton rouge,rowns0;vil0;le;laba8m5r1ust0;in;k1lingt0;on;ans0;as;arillo,erica0;! 0;central;ma","Central","usa"],"Chihuahua":["true¦chihuahua,h5la paz,m0;azatlan,exic1ountain 0;mexico,standard time (mexico);an pacific1o0;! pacific;! time;ep0np0p0;mx","Central Mexico"],"Ciudad_Juarez":["true¦america/ciudad_jua1ciudad ju0ju0;a0á0;rez","Mountain","usa"],"Coyhaique":["true¦a1co0;i2y2;merica/coy1ys0;en,én;haique","Aysen"],"Costa_Rica":["true¦c0sjmt;entral standard time,osta rica,r0st;!i","Central"],"Cuiaba":["true¦am0brazil,cuiaba,mato grosso,varzea grande;azon standard time,t","Amazon"],"Danmarkshavn":["true¦coordinated universal2d1g0utc,zulu;mt,reenwich mean1;anmarkshavn,enmark; time","Greenwich Mean"],"Dawson":["true¦canada,dawson,m2y0;d0pt,wt;dt,t;ountain standard time,st","Mountain"],"Dawson_Creek":["true¦canada,dawson creek,m1p0;pt,wt;ountain standard time,st,t","Mountain"],"Denver":["true¦!2;a6colorado springs,denver,el paso,m1navajo,salt lake,us0;/7a;dt,ountain1st0t;!\\hmdt;! 0;standard t0t0;ime;lbuquerque,merica0urora;! 0/shiprock;mountain","Mountain","usa"],"Detroit":["true¦america4detroit,e0grand rapids,us/michigan;astern0pt,st,t,wt;! 0;mi,standard t0t0;ime;! eastern","Eastern","usa"],"Edmonton":["true¦a6ca4edmonton,m0;ountain0st,t;! 0;standard t0t0;ime;lgary,nada0;!/1;lberta,merica 0;mountain","Alberta and Northwest Territories"],"Eirunepe":["true¦a0brazil,eirunepe;c0mazonas west;re0t;! 0;standard t0t0;ime","Acre"],"El_Salvador":["true¦c2el1s0;an0lv,oyapango,v; salvador;entral standard time,st","Central"],"Fort_Nelson":["true¦british columbia,canada,fort nelson,m0;ountain standard time,st,t","Mountain"],"Fortaleza":["true¦br5ca4e3fortaleza,imperatriz,j2m0natal,sao luis,teresina;a0ossoro;picernpb,racanau;oao pessoa,uazeiro do norte; south america s5ast south america;mpina grande,ucaia;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Glace_Bay":["true¦a1ca0glace_bay;nada,pe breton;st,t0;!lantic0;! 0;standard t0t0;ime","Atlantic","usa"],"Goose_Bay":["true¦a0canada,goose_bay,labrador,npt;st,t0;!lantic0;! 0;standard t0t0;ime","Atlantic","usa"],"Grand_Turk":["true¦america eastern,e2grand turk,kmt,t0;c0urks and caicos;!a;astern0st,t;! 0;standard t0t0;ime","Eastern","usa"],"Guatemala":["true¦c2g0mixco,villa nueva;t0uatemala;!m;entral standard time,st","Central"],"Guayaquil":["true¦cuenca,ec2guayaquil,ma1q0santo domingo de los colorados;mt,uito;chala,nta;!t,u0;!ador0;! 0;mainland,time","Ecuador"],"Guyana":["true¦g0;eorgetown,uy1y0;!t;!ana0;! time","Guyana"],"Halifax":["true¦a4ca2halifax,n1p0;ei,rince edward island;ew brunswick,ova scotia;!nada0;!/atlantic;dt,st,t0;!lantic0;! 0;ns,standard t0t0;ime","Atlantic","usa"],"Havana":["true¦arroyo naranjo,bBc3diez de octubre,guantanDh1las tunas,pinar del rio,sant0;a clara,iago de cuba;avana,cu,e0n0olguin;cu;amaguey,i5u0;!b0;!a0;! 0;standard t0t0;ime;e0udad camilo cie0;nfueg1;ay1oyer0;os;amo","Cuba","cuba"],"Hermosillo":["true¦ciudad obregon,h1mexic0nogales,sonora;an pacific standard time,o;ermosillo,npmx","Mexican Pacific"],"Indiana/Indianapolis":["true¦america2crawford,dadukmn,eastern in,i4p0star1us/east-indiana;erry,i0ulaski;ke;!/0;fort_wayne,i0;ndiana0;!polis","Eastern","usa"],"Indiana/Knox":["true¦america1c0indiana,knox,us/indiana-starke;entral standard time,st;!/knox_in","Central","usa"],"Indiana/Marengo":["true¦america,e0indiana,marengo;astern standard time,st","Eastern","usa"],"Indiana/Petersburg":["true¦america,e0indiana,petersburg;astern standard time,st","Eastern","usa"],"Indiana/Tell_City":["true¦america,c0indiana,tell_city;entral standard time,st","Central","usa"],"Indiana/Vevay":["true¦america,e0indiana,vevay;astern standard time,st","Eastern","usa"],"Indiana/Vincennes":["true¦america,e0indiana,vincennes;astern standard time,st","Eastern","usa"],"Indiana/Winamac":["true¦america,e0indiana,winamac;astern standard time,st","Eastern","usa"],"Inuvik":["true¦america mountain,canada,inuvik,m0pddt;ountain0st,t;! 0;standard t0t0;ime","Alberta and Northwest Territories"],"Iqaluit":["true¦america eastern,canada,e0iqaluit;astern0ddt,st,t;! 0;standard t0t0;ime","Eastern","usa"],"Jamaica":["true¦e3j1k0new k0;ingston;am0m;!aica;astern standard time,st","Eastern"],"Juneau":["true¦a0juneau;k5laska0merica;! 1n0;! s1;juneau area,s0t1;tandard t0;ime;st,t","Alaska","usa"],"Kentucky/Louisville":["true¦america0eastern 4k3l2wayne;!/0;k1l0;ouisville;entuc0;ky","Eastern","usa"],"Kentucky/Monticello":["true¦america,e0kentucky,monticello;astern standard time,st","Eastern","usa"],"La_Paz":["true¦bo1cochabamba,la paz,oruro,s0;anta cruz de la sierra,ucre;!l0t;!ivia0;! time","Bolivia"],"Lima":["true¦arequiDc9huancCi8juliaca,lima,p2sant1t0;acna,rujillo;a anita   los ficus,iago de sur8;e0iura,ucallA;!r0t;!u0;! 0;standard t0t0;ime;ca,quitos;allao,hi1us0;co;cl0mbote;ayo;pa","Peru"],"Los_Angeles":["true¦!2;a06ba04c01fXgarden grove,hUirviTlNmoKnJoGp9r8s1tacoma,us0washington state;/07a;a1eattle,f,p0tocktUunrise manor;okaQringI;cramenIn0; 1ta 0;aUclariW;bernardiSdiego,fran0jo5;!cisco;ancho cucamonga,eQiver8;a1dt,ort8st0t;!\\ipdt;cific1radi0;se;! 0;standard t0t0;ime;ak1cean0regFxnard;side;land;evada,orth las8;des1reno0; valley;to;a3o0;ng6s0; 0_0;angeles;!s0; vegas;ne;enders1untington0; beach;on;onta2re0;mont,s0;no;na;ali1hula vis0;ta;!f1;ja calif0kersfield;ornia;merica0naheim;! 0;pacific","Pacific","usa"],"Maceio":["true¦a6br1e0maceio; south america s3ast south america;asilia0t;! 0;s0t1;tandard t0;ime;lagoassergipe,racaju","Brasilia"],"Managua":["true¦c3man2ni0;!c0;!ar0;agua;entral standard time,st","Central"],"Manaus":["true¦am4brazil3c0manaus;entral brazil0uiaba;!ian0;! s5;!/we2;azon0t;! 1as ea0;st;s0t1;tandard t0;ime","Amazon"],"Martinique":["true¦a3f1m0;a1q,tq;fmt,ort de france,rench ma0;rtinique;st,tlantic standard time","Atlantic"],"Matamoros":["true¦america central,c2heroica ma1m0nuevo laredo,reynosa;a0exico;tamoros;entral0st,t;! 0;standard t0t0;ime","Central","usa"],"Mazatlan":["true¦cAh8l7m0tep4;azatlAexic1ountain 0;mexico,standard time (mexico);an pacific 2o0;! pacif0/bajasur;ic;standard t0t0;ime;a paz,os mochis;np0p0;mx;hihuahua,uliac0;an","Mexican Pacific"],"Menominee":["true¦america4c0menominee,wisconsin;entral0st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Merida":["true¦c3guadalajara,m0;e0onterrey;rida,xico0;! city;ampeche4entral 0st;mexic0standard 2;an,o0;! 0;time;!yucatán","Central Mexico"],"Metlakatla":["true¦a0metlakatla;k5laska0merica;! 1n0;! s1;annette island,s0t1;tandard t0;ime;st,t","Alaska","usa"],"Mexico_City":["true¦a0Lb0JcYdurango,ecatepec de morelos,guThSiQjalisco,leon de los aldama,mInHoGpEqDs9t4uruapan,v2x1yucatan,za0;catecas,popan;alapa de enriquez,ico,ochimilco;e0illahermosa;nustiano carranza,racruz;a3e7la1o0uxtla;luUnala;huac,l0quepaque,xcala;nepantla,pW;basco,maulipas,pachuZ;an0oledad de graciano sanchez; luis potosi,t0;a maria chimal0iago de q1;huQ;ueretaG;achuca de soIoza rica de7ue0;bSrto vallarta;axaJjo de agua;aucalpan07icolas romeCuevo leon;agdalena contrerUex4i2o0x;nterrey,rel0;ia,os;choHguel0; h5;!ico0;! 0/general,_0;city;rap5xtapalu9zta0;cUpalapa;idalJ;a1erre0stavo adolfo made0;ro;dalajara,naj0;ua0;to;ampeche,eFhiCiudad Ao3st,u0wt;au1ernava0;ca;htemoc,titlan izcalli;a4l2yo0;ac0;an;i0onia del valle;ma;cEhui0tzacoalc2;la;lopez mate0nezahualcoyotl;os;ap1lpancin0;go;as;laya,ntral 0;mexic0standard 2;an,o0;! 0;time;enito6uenavis0;ta;capulco3guascalientes,lvaro obreg2zcapotz0;al0;co;on; de0; juar0;ez","Central Mexico"],"Miquelon":["true¦hBmAp8s0;aint pierre2pm,t pierre 0;& miquelon 0a5;s2t3;! 0;a2s0;tandard t0;ime;nd1;ierre0m; m0;iquelon;npm,pm","St. Pierre & Miquelon","usa"],"Moncton":["true¦a0canada,hepm,moncton,new brunswick;st,t0;!lantic0;! 0;standard t0t0;ime","Atlantic","usa"],"Monterrey":["true¦c8g6m3sa1t0victoria de durango;ampico,orreon;ltillo,n0; nicolas de los garza,ta catarina;exico1on0;clova,terrey;! city;omez palacio,uadal0;ajara,upe;entral 1iudad 0st;apodaca,general escobedo,madero,victoria;mexic0standard 2;an,o0;! 0;time","Central Mexico"],"Montevideo":["true¦montevideo5u0;r1y0;!st,t;uguay0y;! 0;s1t2;! s0;tandard t0;ime","Uruguay"],"New_York":["true¦!2;a0Sb0Pc0Id0He0Bf07g05hialeah,i02j00kZlexingtonYmUnMoKpIquHrDsAt7u5v3w0yonkers;ashington1est 0inston salem,orcD;raEvirginia;! dc;ermont,irginia0;! beach;nited states,s0;!/0Na;a0enne1he bronx,oleD;llaha0mpa;ssee;outh 1t0; petersburg,aten3;bo0DcC;a2hode1ichmond,och0;ester; is04;lei2;eens,intana roo;ennsylvanNhiladelphNittsbur0rovidence;gh;hio,rlan0;do;ew3or1y0;!c;folk,th c0;aroliE; 1_yo0a0port news;rk;hampshiYje8york0;! staU;a1eads,i0;ami,chig1;ine,nhatt0ryNssachusetts;an;! fayetP;entucky,nox9;acks2e0;rsey;ndia1r0;on5;na;eorg0reensboro;ia;ayette1l0ort lauderda2;!orida;vil0;le;ast1dt,st0t;!\\fedt; flatbush,ern0;! 0;standard t0t0;ime;elawa9urham;ape coral,h3incinnati,leve1o0;lumbus,nnecticut;la0;nd;a0esapeake;rlot0ttanooga;te;altimo1o0rooklyn,uffalo;st4;re;kr2merica0tlanta;! 0;eastern;on","Eastern","usa"],"Nipigon":["true¦america eastern,canada,e0nipigon;astern0st,t;! 0;standard t0t0;ime","Eastern","usa"],"Nome":["true¦a0no5;k5laska0merica;! 1n0;! s1;s0ti1west;tandard ti0;me;st,t","Alaska","usa"],"Noronha":["true¦atlantic islands,brazil3f0n4;ernando de noronha 0nt;standard t0t0;ime;!/den0;oronha","Fernando de Noronha"],"North_Dakota/Beulah":["true¦america,beulah,c0north dakota;entral standard time,st","Central","usa"],"North_Dakota/Center":["true¦america,c1merc0north dakota,oliv0;er;ent0st;er,ral standard time","Central","usa"],"North_Dakota/New_Salem":["true¦america,c1n0;ew_salem,orth dakota;entral standard time,st","Central","usa"],"Nuuk":["true¦america3g1nuuk,wg0;st,t;l,r0;eenland,l;!/godthab","West Greenland","green"],"Ojinaga":["true¦america4c0ojinaga;entral0hihuahua,st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Panama":["true¦a3coral h,e2pa0san miguelito;!n0;!ama;astern standard time,st;merica/0t2;at1c0;aym1oral_harbour;ikok0;an","Eastern"],"Pangnirtung":["true¦a4baffin island,canada,e0nunavit,pangnirtung;astern0st,t;! 0;standard t0t0;ime;ddt,merica eastern","Eastern","usa"],"Paramaribo":["true¦paramaribo,s0;r2ur0;!iname0;! time;!t","Suriname"],"Phoenix":["true¦!2;aBc9g7idaho,m4n3phoenix,s2t1u0wyoming;s/arBtah;empe,ucsD;cottsd5inaloa,onora;ayarit,ew mexico;aryv3esa,o1st0t,wt;!\\hmdt;nta6untain standard time;ilbert,lend0;ale;h0olorado;andler,ihuahua;merica2r0;izo0;na;!/crest0;on","Mountain"],"Port-au-Prince":["true¦america eastern,cAe6h4p0;etionville,ort0; 0-au-1;au 0de paix;prince;aiti,t0;!i;astern0st,t;! 0;standard t0t0;ime;arrefour,roix des bouquets","Eastern","usa"],"Porto_Velho":["true¦am5brazil,c2porto0rondônia; 0_0;velho;entral brazil0uiaba;!ian0;! s3;azon0t;! 0;s0t1;tandard t0;ime","Amazon"],"Puerto_Rico":["true¦a2bayam9p0;r0uerto rico;!i;merica0st,tlantic standard time;!/0;a5blanc-sabl4curacao,dominica,g3kralendijk,lower_princes,m2port_of_spa1st_0torto7virg1;barthelemy,kitts,lucia,thomas,vincent;in;arigot,ontserrat;renada,uadeloupe;on;n0ruba;guil0tigua;la","Atlantic"],"Punta_Arenas":["true¦c0punta arenas,region of magallanes;hile0lt;! standard time","Magallanes"],"Rainy_River":["true¦america4c0ft frances,rainy river;entral0st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Rankin_Inlet":["true¦america4c0rankin inlet;ddt,entral0st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Recife":["true¦aAbr4caruaru,e3jaboatao2olinda,p0;aulista,e0;rnambuco,trolina;! dos guararapes; south america s4ast south a6;a0t;silia0zil;! 0;s0t1;tandard t0;ime;merica","Brasilia"],"Regina":["true¦c2regina,s0;askat0k;c2oon;anada0entral standard time,st;!/saskatc0;hewan","Central"],"Resolute":["true¦america4c0resolute;entral0st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Rio_Branco":["true¦a1brazil0rio branco;!/1;c1merica/porto_0;acre;re0t;! 0;standard t0t0;ime","Acre"],"Santarem":["true¦br1e0pará west,santarem; south america s4ast south america;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Santiago":["true¦aAc4iquique,la pintana,puente alto,rancagua,san3t1v0;alparaiso,ina del mar;alca0emuco;!huano; bernardo,tiago;h1l0oncepcion;!st,t;ile0l;! 0/continental;standard t0t0;ime;ntofagasta,rica","Chile","chile"],"Santo_Domingo":["true¦a8bella vista,do6la romana,s0;an0dmt; pedro de macoris,t0;iago de los caballeros,o domingo0;! 0;e0oe0;ste;!m0;!inican republic;st,tlantic standard time","Atlantic"],"Sao_Paulo":["true¦a16b0Tc0Md0Je0Hf0Fg0Ahortol09i05j02l01mXnVosasco,pLriFs4ta3uber2v0;i0olta redonda;amao,la velha,toria;aba,l06;boao da serra,ubate;a2e1oroNu0;maLzano;rXte lagoas;nt4o 0;bernardo do campo,carlos,jo0leopolLpaulo,vicE;ao de meriti,se0;! do0; rio p8s campos;a 1o0; andDs;barbara d'oeste,luzia,maria;beirao 3o0;! 0;cla0de janei0g6ver7;ro;das neves,p0;reto;asso fun8e7iraci6lanaltina,o4r0;aia g1esidente prud0;ente;ran0;de;nta grossa,rto aleg0;re;caW;lotYtro0F;do;iteroi,ov0;aJo hamburgo;a1o0;gi das cruzSntes clarD;ri0ua;lia,n6;imei2ondrina;acarei,oinville,u0;iz de fo0ndi9;ra;ndaia2patin1ta0;bor6pevi,quaquece1;ga;tuG;andY;o3ravat2uaru0;ja,lh0;os;ai;iSvernador valadarC;loria5oz do0ran2; iguacu; south america sHast south ameri0mbu;ca;i0uque de caxi8;adema,vi0;noN;a1o0uriti2;ntagem,tK;choeiro de itapemirDmp1no3rapicui0scavel,xias do sul;ba;in1os dos goytacaz0;es;as;aBe7lumenau,r0;!a0st,t;!silia1zil0;!/east;! 0;s0t1;tandard t0;ime;l1t0;im;ford roxo,o horizon0;te;rueri,uru;lvora4merica3na2parecida de goi0;an0;ia;polis;na;da","Brasilia"],"Scoresbysund":["true¦e3greenland2h0ittoqqortoormiit,scoresbysund;e0neg;eg,g;! eastern;ast greenland1g0;st,t;! 0;standard t0t0;ime","East Greenland","green"],"Sitka":["true¦a0sitka;k6laska0merica;! 1n0;! st2;s0t2;itka area,t0;andard t0;ime;st,t","Alaska","usa"],"St_Johns":["true¦canada7h5n0st johns;d3ewfoundland0st,t;! 0;labrador,standard t0t0;ime;dt,t;e0n0tn;tn;!/newfoundland","Newfoundland","usa"],"Swift_Current":["true¦c1s0;askatchewan,wift current;anada,entral standard time,st","Central"],"Tegucigalpa":["true¦c2h0san pedro sula,tegucigalpa;n0onduras;!d;entral standard time,st","Central"],"Thule":["true¦a0pituffik,thule;st,t0;!lantic0;! 0;standard t0t0;ime","Atlantic","usa"],"Thunder_Bay":["true¦canada,e0thunder bay;astern0st,t;! time","Eastern","usa"],"Tijuana":["true¦america8baja california,eAh6mexic4p0tijuana;acific0st,t;! 0;standard t0t0;ime;ali,o0;!/bajanorte;e0n0;nomx; pacific,/0;e0santa_isabel;nsenada","Pacific","usa"],"Toronto":["true¦americaGbEcaBe7gatineIhamilFkitchener,l4m3nepe2o0quebec,richmond hill,toronto,vaugh2windsor;n5sh0tt0;awa;an;arkham,ississauga,oF;avFon0;don on0gueuil;tario;astern0st,t;! 0;standard t0t0;ime;!n0;!ada0;!/7;arrie,ramp0;ton; 4/0;mo1nass0;au;ntre0;al;eastern","Eastern","usa"],"Vancouver":["true¦america 9b7ca5ladn4okanagan,p1surrey,v0yukon;ancouv3ictor7;acific0st,t;! 0;bc,standard time;er;!nada0;!/2;ritish columb0urnaby;ia;pacific","British Columbia"],"Whitehorse":["true¦canada1m0whitehorse,yst;ountain standard time,st;!/yukon","Mountain"],"Winnipeg":["true¦america 7c2m1w0;est m0innipeg;anitoba;anada3entral0st,t;! 0;standard t0t0;ime;!/0;central","Manitoba"],"Yakutat":["true¦a0y4;k6laska0merica;! 1n0;! s2;s1t2y0;akutat;tandard t0;ime;st,t","Alaska","usa"],"Yellowknife":["true¦america mountain,canada,m0yellowknife;ountain0st,t;! 0;standard t0t0;ime","Mountain","usa"]},"Antarctica":{"Palmer":["true¦antarctica/p0p0;almer","Palmer"],"Casey":["true¦antarctica,cas0;ey,t","Casey"],"Davis":["true¦a1dav0;is,t;ntarctica,q,ta","Davis"],"Macquarie":["true¦a2canberra,eastern australia6m0sydney;acquarie0elbourne;! island;e4ntarctica,us0; east0tralia eastern;!ern0;! standard0; time;st,t","Eastern Australia","aus"],"Mawson":["true¦antarctica,maw0;son,t","Mawson"],"Rothera":["true¦a1b0city of b0rothera;uenos aires;ntarctica1r0;gentina,st,t;!/palmer","Argentina"],"Troll":["true¦antarctica,g2troll0;! 0;research station,t1;mt,reenwich mean t0;ime","Troll","troll"],"Vostok":["true¦!2;antarctica,msk+\\e,vost0;!ok","Vostok"]},"Asia":{"Urumqi":["true¦asia/1k3urum0wulumu2xinjiang time,ürüm2;chi,qi;k1urum0;qi;ashgar","Xinjiang"],"Almaty":["true¦a6central asia,east kazakhstan time,k2nur sultan,p1s0taraz,ust kamenogorsk;emey,hymkent;avlodar,etropavl;a0z;ragandy,z0;!akhstan0;! eastern;lm1s0;ia,tana;a0t; ata,ty","East Kazakhstan"],"Amman":["true¦a2eet,irbid,jo0russeifa,wadi as sir,zarqa;!r0;!d1;mm0sia;an","Jordan"],"Anadyr":["true¦a0petropavlovsk kamchatsky;na0sia;dyr0t;! time","Anadyr"],"Aqtau":["true¦a1kazakhstan western,mangghystaū/mankis3tashkent,west 0;asia,kazakhstan5;lm2q1s0;hgabat,ia;tau;a0t; ata,-ata0; time","West Kazakhstan"],"Aqtobe":["true¦a1kazakhstan western,tashkent,west 0;asia,kazakhstan5;kto5lm2qt1s0;hgabat,ia;o3ö3;a0t; ata,-ata0; time;be","West Kazakhstan"],"Ashgabat":["true¦as4t0;km,m2urkmen0;a4istan0;! time;!st,t;hga1ia0;!/ashkhabad;bat","Turkmenistan"],"Atyrau":["true¦a1gur'yev,kazakhstan western,tashkent,west 0;asia,kazakhstan6;lm3s2t0;irau,yra0;u,ū;hgabat,ia;a0t; ata,-ata0; time","West Kazakhstan"],"Baghdad":["true¦a6ba5dihok,erbil,i3k2mosul,na1r0;amadi,iyadh;jaf,sirC;arbala,irkuk,uwait;q,r0;aq,q;ghdad,sr9;bu ghurayb,d diw6l 5rab1s0; sulaym5ia,t;!i0;a0c;!n0;! time;amar2basrah al qadim2falluj2hill2kut,mawsil al jadid2;an0;iy0;ah","Arabian"],"Baku":["true¦a0baku,ganja,lankaran,sumqayit;sia,z0;!e0t;!rbaijan0;! time","Azerbaijan"],"Bangkok":["true¦asiaAbangkok,ch7h5i3jakarta,mueang nontha8na2pak kret,s0udon thani;amut prakan,e0i racha,outh east0; asia;khon ratchasima,m di9;ct,ndochina0;! time;a0ue;iphong,noi,t y2;iang m1on 0;buri;ai;!/0;phnom_pe0vientiane;nh","Indochina"],"Barnaul":["true¦a3b2kra0north a3;snoyarsk0t;! time;arnaul,iysk;sia","Krasnoyarsk"],"Beirut":["true¦asia,bei3e2l0ra's bay3;b0ebanon;!n;astern european time,et,urope eastern;rut","Eastern European","leb"],"Bishkek":["true¦asia,bishkek,k0osh;g2yrgy0;stan,zstan0;! time;!t,z","Kyrgyzstan"],"Brunei":["true¦asia,b0;dt,n2r0;n,unei0;! darussalam time;!t","Brunei Darussalam"],"Chita":["true¦asia,chita,yak0;t,utsk0;! time","Yakutsk"],"Choibalsan":["true¦as2choibalsan,dornodsükhbaatar,mongol2ula0;anbaatar0t;! time;ia","Ulaanbaatar"],"Colombo":["true¦as6c4dehiwala mount lavin6i2kolkata,lk1m0new delhi,sri lanka;oratuwa,umb4;!a;ndia0st;! time,n;henn0olombo;ai;ia","India"],"Damascus":["true¦a4d3eet,h2latak5sy0;!r0;!ia;am3oms;amascus,eir ez zor;leppo,r raqq1s0;ia;ah","Syria"],"Dhaka":["true¦asiaGbDcBd9jess8khul7mymensingh,na4pa3ra2s1t0;angail,ungi;aid8hib4ylhet;jshahi,ng7;b3ltan,r naogaon;gar5r0t3;ayan0singdi;ganj;na;ore;haka,inaj0;pur;hattogram,o0;milla,x's bazar;a0d,gd,ogra,st;gerhat,ngladesh0rishal;! time;!/dacca","Bangladesh"],"Dili":["true¦asia,dili,east timor1tl0;!s,t;! time","East Timor"],"Dubai":["true¦a5dubai,g3mus1om0ras al khaim2sharj2;!an,n;aff0c5;ah;st,ulf0;! time;bu dhabi,jm2rabi2sia0;!/musc0;at;an","Gulf"],"Dushanbe":["true¦asia,dushanbe,t0;ajikistan1j0;!k,t;! time","Tajikistan"],"Famagusta":["true¦asia,e0famagusta,northern cyprus;astern european time,et,urope eastern","Eastern European","eu3"],"Gaza":["true¦asia,eet,gaza2p0;alestine,s0;!e;! strip","Eastern European","pal"],"Hebron":["true¦asia,e0hebron,west bank;ast jerusalem,et","Eastern European","pal"],"Ho_Chi_Minh":["true¦asia7bien hoa,can tho,da 5ho3nha tr6qui nh8rach gia,sa dec,thi xa phu my,v0;ietnam1n0ung tau;!m;! south; chi 0_chi_0;minh;lat,n0;ang;!/saig0;on","Indochina"],"Hong_Kong":["true¦asia,h0kowloon,tsuen wan;k3ong0; kong1_k0k0;ong;! time;!g,st,t","Hong Kong"],"Hovd":["true¦as4bayan-ölgiigovi-altaihovduvszavkhan,hov2west0; 0ern 0;mongol2;d0t;! time;ia","Hovd"],"Irkutsk":["true¦a2brat3irk0north asia east,ulan ude;t,utsk0;! time;ngar0sia;sk","Irkutsk"],"Jakarta":["true¦aZbTcRdepQiNjKkediri,lJmGpArengasdengklQs4t2w0yogyakM;est0ib; indoneXern indonesia time;a0egal;n4sikmal3;ema4itubondo,outh tan3u0;kabumi,medaSra0;b0kF;aya;ge0;raO;a4e1robolinggo,urw0;akAokerto;ka1ma0rcut;laKtangsiantar;long2nbaru;daIl3mulaIruI;a1ed0;an;diun,laF;embaE;a0ember;k0mbi,vasumatra;arta;d1ndonesia0;! western;!n;ok;i0urug;ampea,bino5leungsir,mahi,putat,rebon;a1e0injai,ogor;kasi,ngkulu;nd0tam;a0u1; aceh,r lampu0;ng;sia","Western Indonesia"],"Jayapura":["true¦a2east1indonesia eastern,jayapura,m0new guinea,wit;alukus,oluccas; indones1ern indonesia time;mbon,s0;ia","Eastern Indonesia"],"Jerusalem":["true¦as7beersheba,haifa,i2j0petah tiqwa,rishon leziyyon,tel 9west je1;e0mt;rusalem;d3l,s0;r0t;!ael0;! time;dt,t;hdod,ia0;!/tel_0;aviv","Israel","isr"],"Kabul":["true¦a1herat,jalalabad,ka0mazar e sharif;bul,ndahar;f0sia;!g0t;!hanistan0;! time","Afghanistan"],"Kamchatka":["true¦a2kamchatka,pet0;ropavlovsk0t; kamchatsky,-kamchatski time;nadyr,sia","Petropavlovsk-Kamchatski"],"Karachi":["true¦asia,bLchiniKdera ghaziIfaisalHgujraGhyderHislamHjhang sadr,kElaDm8nawabshah,okaBp4quetta,ra3s0;a1h0ialkJukkN;ahkIekhupu9;ddiqEhiwal,rgodha;him yarEwalpindi;ak1eshawar,k0;!t;!istan0;! time;a3i1u0;lt9zaffar7;ngo0rpur khas;ra;lir cantonment,rd6;hore,rkana;a0otli;moke,rachi,s8;n5t;abad; kh0;an;ot;a1himber,ure0;wala;hawalp0ttagram;ur","Pakistan"],"Kathmandu":["true¦asia3biratnagar,kath4n1p0;atan,okhara;epal,p0;!l,t;!/kat0;mandu","Nepal"],"Khandyga":["true¦asia,khandyga,yak0;t,utsk0;! time","Yakutsk"],"Kolkata":["true¦0:3D;1:3L;2:2D;3:3M;4:3J;a35b2Dc24d1We1Uf1Sg1Fh1Ci18j13k0Pl0Km0Cn05odisha,pVquthbull3DrNsFt9u8v5warangal,yamun1P;a6el1Ui5;jayawada,sakha0HzianagC;dodara,ranasi;daip0jjain,lhasn1ttar pradesh;a8eXh7iru5umk0;chirap0Mnelve2p5vottiy0;ati,p0;ane,iruvananthapuram,oothukudi,riss0;mb5njore;aram;aBecunder4h9i8lst,o7r1Fu5;jan37r5;at,endr1C;l2Znipat;k3liguKngrau2rJ;ahj1Zi5ri2Oya0L;moga,vaji07;har1Xlem,mbhal,ng2tna,ugor;a6ewa,oh5;iItak;ebare2i9j7m5nchi,tlam,urkela;ag5g5p0;undam;a5kot;hmundry,sthan;ch0p0;a9imp8roddat0u5;ducherry,n5rnia;a5e;sa;ri;li,n7rbha6t5;iala,na;ni;chkula,i5;hati,pat;a7e6izam4o5;ida,wrang2B;l0Sw delhi;diad,g7i0Ejaf2Fn5rela,shik,vi mumbai;ded,g5;i,loi jat;ercoil,p0;a8eerut,irz25o7u5ysore;lugu,mbai,rwara,zaffar5;n1p0;nghyr,rad4;chili7d6harashtra,leg07n5thura,u;ga0Iip0;hya,urai;patnG;a7u5;cknow,dhia5;na;l bahadur5t0; n1;aDhaBo8u5;kat6lt5rnool;a2i;pal2;l5rWta,zhikode;h1Nkata,l5;am;nd5ragp0;wa;kinada,l8marOnp0r5shmir,tih3;i6na5ol bagh;l,tV;mn1;lakurichi,yan;a6han5odNunagadh;si;b0Rip0l6m5;mu,n1shedp0;andh3gGna;chalkaranji,mphal,n5st;!d5;!ia5ore;! time,n;a6is3ospet,u5;b2g2;ora,p0ridw3;aChazi4o9reater noida,u6wali5y04;or;jarat,lbarQnt0rg6wa5;hati;aon;rak6sa5;ba;hp0;juw8n5ya;dh6g5;an1;in1;aka;ar5iroz4;id4rukh4;l5tawah;loF;aAe8h6indigul,ombOurg5;!ap0;anbad,ul5;ia;hra dun,l5was;hi;rbhan5vange8;ga;a09h8o5uttack;ch6imbato5;re;in;a6enn5;ai;nd5pL;a5i0C;!nn1;aNeKhBi9or7rahm04u5;landshahr,rh5;anp0;iv2;li;d3har sharif,jZkaner,l5;asp0imoC;aAi7op6u5;baneshw3sav5;al;l6wan5;di,i;ai,wa6;g6ratp0tpa5vn1yand3;ra;alp0;l5ngaluru;gaum,la5;ry;hAli,r6thin5;da;a6ddham5eilly;an;n1s5;at;a6rai5;gh;ramp0;gQhmLizawl,jmKkoRlHmDnantCrrBs6urang4va5;di;ans8ia5;!/ca5;lcut5;ta;ol;ah;ap0;arnath,batt0r5;ava5its3o9;ti;ur;appuz6i5lah4w3;garh;ha;er;adn1ed4;ab5;ad;ag3;ar;arta5ra;la","India"],"Krasnoyarsk":["true¦a2kra0north a2;snoyarsk0t;! time;sia","Krasnoyarsk"],"Kuala_Lumpur":["true¦aHbukit mertajGgeorge town,ipoh,johor bahFk8m4petali3s0taipiE;e1hah alFu0;ba1ngai petani;paBremb7;ng jaya;ala1y0;!s,t;cca,ysia0;! time;ampung baru suba5la5ota bha6ua0;la1nt0;an; 0_l1;l0terengganu;umpur;ng;ru;am;lor setar,sia","Malaysia"],"Kuching":["true¦asia,k4m2s0tawau;a0ibu;bahsarawak,ndakan;alaysia0iri,yt;! time;ota kinabalu,uching","Malaysia"],"Macau":["true¦asia6beiji5c2hong ko5m0urumqi;ac0o;!au;h0st;ina0ongqi1;! time;ng;!/macao","China"],"Magadan":["true¦asia,mag0;adan0t;! time","Magadan"],"Makassar":["true¦asiaBba8c5denpa4indonesia central,k3l2ma1palu,s0wita;amarinda,ulawesi;kas2nado,taram;abuan bajo,oa jan7;endari,up8;sar;e0ity of bal3;lebesbalinusa,ntral indonesia0;! time;l0njarmasin;ikpap0;an;!/ujung_pand0;ang","Central Indonesia"],"Manila":["true¦a04bWcRdaPgeneral santOiMlJmCnaBoAp4quezIsan1ta0zamboanga;clobZguig,rlac,ytE; 1t0;a ro2ol;fernando,jose del monte,pablo;a3h1uerto prince0;sa;!ilippine0l,st,t; time,s;gadiRnalanoy,s0;ay,ig;longapo,rmoc;ga,votQ;a0eycauayN;balacat,gugpo poblaci4kati,l3n0;da1ila,silingLtamp0;ay;luyong,ue;ingDol6;on;a1egaspi,i0ucena;bertad,pa;pu lapu,s p4;l0mus;igCoiI;os;smar0v5;inB;a0ebu,otabato;b1gayan de oro,in5l0;amba,ooc6;anatu5uy0;ao;a4inan2u0;d0tu2;ta;!gon0;an;co1guio,tang0;as;lod,or;n0sia;geles,tipo0;lo","Philippine"],"Nicosia":["true¦a5cy3e0n2;astern european time,et,urope0; eastern,/n0;ico2;!p0;!rus;sia","Eastern European","eu3"],"Novokuznetsk":["true¦a5k2no0prokop'yev1;rth a4vokuznet0;sk;emerovo,ra0;snoyarsk0t;! time;sia","Krasnoyarsk"],"Novosibirsk":["true¦as3no0siber3;rth central as2v0;osibirsk0t;! time;ia","Novosibirsk"],"Omsk":["true¦asia,oms0;k0t;! time","Omsk"],"Oral":["true¦a2kazakhstan western,oral,tashkent,west 0;asia,kazakhstan0;! 4;lm1s0;hgabat,ia;a0t; ata,-ata 0;time","West Kazakhstan"],"Pontianak":["true¦asia,b2indonesia western,pontianak,tanjung pinang,w0;est0ib; b0ern indonesia time;orneo","Western Indonesia"],"Pyongyang":["true¦asia,chongjin,h7k4n3p2s0won8;ariw0eoul,inuiAunch'0;on;rk,yongya7;amp'o,orth korea;a1orea0p,st;!n time;eso3nggye;a1ungnam,ye0;san;e1mhu0;ng;ju","Korean"],"Qatar":["true¦a2doha,kuwait,qa0riyadh;!t0;!ar;r2s0;ia0t;!/bahrain; rayyan,ab0;!i0;a0c;!n0;! time","Arabian"],"Qostanay":["true¦a2central asia,east kazakhstan time,k0qo1;azakhstan eastern,o0;stanay;lmt,s0;ia,tana","East Kazakhstan"],"Qyzylorda":["true¦a4k1qy2tashkent,west 0;asia,kazakhstan7;azakhstan western,y0zyl-1;zyl0;orda;lm1s0;hgabat,ia;a0t; ata,-ata0; time","West Kazakhstan"],"Riyadh":["true¦a9burayd8dammam,ha7jedd8k6me5najran,riyadh,s4ta3y0;anbu,e0;!m0;!en;'if,buk;ultan3yot;cca,dina;hamis mush6uw6;'il,far al batin;ah;bha,l 8ntarctica/syowa,rab4s0;ia0t;!/0;aden,kuw0;ait;!i0;a0c;!n0;! time;hufuf,jubayl,kharj,mubarraz","Arabian"],"Sakhalin":["true¦asia,sak0yuzhno sakhalinsk;halin0t;! 0;island,time","Sakhalin"],"Samarkand":["true¦asia,bukhara,nukus,qarshi,samarkand,uz0;bekistan0t;! 0;time,west","Uzbekistan"],"Seoul":["true¦aPbuMchHdaeGgChwaseoRiBjeAk7m6pohaFrok,s2u1wonJy0;aCeosu;ijeongbuQlsL;e1outh korea,u0;nEwH;joAo0;ngnamMul;asGokpo;imhae,or0r,st,wangmyo7;!ea0;!n time;ju,on8;cCksBn6;angneu2oyaEu1wa0;ng5;mi,ns8riD;ng;gu,je4;angw3eon2in1un0;che2;ju;an,gju7;on;c1s0;an;heon3;n0sia;san1ya0;ng0; si","Korean"],"Shanghai":["true¦0:3I;1:37;2:35;3:38;4:3C;a3Db32c2Od2Ie31f2Dg27h1Qji1Ek1Bl0Ym0Wn0Tordos,p0Pq0Lrizhao,s08t01urumqi,wSxLyEz5;aoCh6i5ouc3unyi;bo,go0;a7en6ouk2u5; c3hai,maWzh2;g2Wj1Izh2;bei,ng5o3D;jiakou5zh2;! shi xuanhua qu;ya0z28;an9i7u5;ci,e18n5;c3fu;b4c9n5ya0;cZgk2;c3g5ji,tai;j17qu1shuo,zh2;i6uc5;ha0;a6n5uyi0;di,gtai,hui,i0pu,tai,x13ya0;men,n5;!g5ni0tao,ya0;t1ya0;aBe9u5;h6so0wei,x5zh2;i,ue;a5u;i,n;i0Hn5;sh1zh2;fang5nxi1;di1;a8i6ong5;chuanshi,hDliao,sh1;an5eli0;j4shui;i6ng5;gu,sh1;an,hecun,yu1zh2;anmi0hAi8u5;i5zh2;h5zh2;ua;c5pi0;hu1;a7en6i5uangya15;jiaz16qi,y1;gli,ya0zhen;n6o5shi;gu1xi0;g5t2;hai,qiu,rKyu;i5uan1K;aFn5o15qihar;g5huangdH;dGhai;an0Uing7rc,u5;ti1yang5;! H;ding0RxZ;an5eijYingbo;ch5ji0ni0to0ya0;a0o0;entoug2ianRuda5;njU;aEi8u5;anc3o6qi5;ao;he,ya0;a7jPn5upanshui;fTxia 5yi;chengguanI;n0Eo5;c3y5;a0u1;i0Xn5ohek2;g5zh2;fa0;ai6un5;mi0sh1;fe0yu1;'1aAe9l4n6u5xi;jCtai;an,c3g5i0zh2;de5li0zh2;zhE;ya0;musi,n8o5xi0;j6z5;uo;ia0;g5shG;m7xi;aGeCkt,oBu5;a6i0Elan ergi,m5n1;en;i7ng5y4;ga0s5;hi;'1b9n1;hhot,ng ko0;bi,f7ga0ng5ze;sh5ya0;ui;ei;i7n5rb4;d1g5;u,zh2;c3k2l5;ar;a9u5;an6i5li;l4ya0zh2;g5k2;do0yu1zh2;nsu,opi0;en7o6u5;ji1shQx4zh2;sh1;d2g5;hua0;a6eNong5;gu1hR;d6lian5ndo0qi0to0;!g;o5uk2;nghN;angHh5n,st,t;aAen7i5n,oXuG;fe0na5;! time;g5zh2;d5zho0;e,u;ng6o5;ya0zh2;ch7de,sh6zh5;i,ou;a,u;un;zh2;a9e5;i6n5;gbu,xi;'1h5ji0;ai;i7o5yan nur;di0t2;ou;c3sh1y4;an;he0;nBsia5;!/5;ch6harb4;in;o5ungki0;ng5;qi0;da,qi0sh5ya0;an,un;ng","China"],"Singapore":["true¦asia,kuala lumpur,s0woodlands;g0ingapore;!p,t","Singapore"],"Srednekolymsk":["true¦asia,chokurdakh,sre0;dnekolymsk,t","Srednekolymsk"],"Taipei":["true¦asia,banqiao,cst,h7k5roc,t0;a1w0;!n;i0oyu1;ch2n0pei,w0;an;aohsi0eel0;ung;sinchu,ualien","Taipei"],"Tashkent":["true¦a3namangan,qo`q4tashkent,uz0;!b0t;!ekistan0;! east;ndij0sia;on","Uzbekistan"],"Tbilisi":["true¦asia,ge1kuta0tbil0;isi;!o0t;!rgia0;!n","Georgia"],"Tehran":["true¦aQbMgorgWhamViKkCmaBn8orumiy7pasragad branch,q4rasht,s2t1varam6yazd,za0;hedVnjV;abHehrU;a0hirRirjT;bzevar,nandEri,v3;a0om;rchak,zv0;in;eh;a0eyshabur;jaf0zar0;ab4;layer,shh3;a4erman3ho0;meyni sDrram0wy;ab0sC;ad;!shah;h1r0;aj;riz;r0sfahB;!an,dt,n,st;a2irjand,o0uk9;jnu0ruje0;rd;b3ndar abbas;b4hv3m2r1sia,zads0;hahr;ak,dabil;ol;az;ad0;an","Iran"],"Thimphu":["true¦asia2b0thimphu;hutan,t0;!n;!/thimbu","Bhutan"],"Tokyo":["true¦0:11;1:1A;2:10;a18ch16fu0Zgifu14h0Oi0Ij0FkZmTnMoKsFt9u8waka05y3;a6o3;k3no;kaichi,o3;ha2su0;maKo;ji,tsun0F;aka7o3sukuba;k5makomai,y3;a2o3;hOna0ta;oro03us0Qyo;m0Jrazu0sa1tsu1;a5endai,hi4o0u3;ita,zu0;monose1zuo0;ita2k3ppoLsebo;ai,ura;dawara,ita,ka3sa0tsu;ya2za1;a6eyagawa,i3umazu;i4shi3; tokyo0Inomiya ha2;gata;g3ha,ra0G;a3oX;no,o0sa1;a5i3orio0;na3to,yaza1;mirinkOto;chiDeb4tsu3;do,m8ya2;ashi;aBi9o7u3y6;mam5r4shi3;ro;ashi1e,ume;oto;be,chi,fu,ri3shigaK;ya2;shiwa3takyushu;da;gosVkogawacho honmKmirenjaku,na8s5wa3;g3sa1;oe,uchi;hiwa,u3;g3kabe;ai;zaY;ap4dt,oetJp3st;!n;an;bara1chi4ta3wa1zu3;mi;ha5n3;omi3;ya;ra;a8i3oncho;meBr4t3;acR;a4os3;a1hi2;kaNtsu0;chi5kodate,mam3;at3;su;nohe,o3;ji;ji8ku3;i6o0s3ya2;hi2;ma;ka; sD;!sa7;i3ofu;ba,g6;geoshimo,k7mag5njo,omori,s3tsugi;ahika3ia;wa;asa1;ki;as4i3;ta;hi","Japan"],"Tomsk":["true¦asia,oms0tomsk;k,t","Tomsk"],"Ulaanbaatar":["true¦asia3m1ula0;anbaatar,n 3t;n0ongolia;!g;!/ulan_0;bator","Ulaanbaatar"],"Ust-Nera":["true¦asia,ust-nera,vla0;divostok,t","Vladivostok"],"Vladivostok":["true¦!2;asia,k1msk+\\e,vla0;divostok,t;habarovsk0omsomolsk on amur;! vtoroy","Vladivostok"],"Yakutsk":["true¦asia,blagoveshchen1yak0;t,ut0;sk","Yakutsk"],"Yangon":["true¦asia4b3kyain seikgyi township,m0nay pyi taw,pathein,sittwe,yang5;a1eiktila,m0onywa;!r,t;ndalay,wlamyine;ago,urma;!/rango0;on","Myanmar"],"Yekaterinburg":["true¦asia,chelyabin7eka5k4magnitogor7nizhn3or2perm,s1tyumen,ufa,yek0zlatoust;a4t;terlitamak,urgut;e3sk;evartov3y tagil;amensk ural'skiy,urgan;teri0;nburg;sk","Yekaterinburg"],"Yerevan":["true¦a0caucasus,yerevan;m2rm0s1;!en0;ia;!t","Armenia"]},"Atlantic":{"Azores":["true¦a0hmt;tlantic,zo0;res,st,t","Azores","eu0"],"Bermuda":["true¦a2b0;ermuda,m0;!u;st,t0;!lantic","Atlantic","usa"],"Canary":["true¦atlantic,canary1europe western,las palmas de gran canaria,santa cruz de tenerife,we0;stern european,t;! islands","Western European","eu1"],"Cape_Verde":["true¦atlantic,c0;a1pv,v0;!t;bo verde0pe verde;! is","Cape Verde"],"Faroe":["true¦atlantic2f0;aroe0o,ro;! islands;!/faeroe","Western European","eu1"],"Madeira":["true¦atlantic,europe western,madeira1we0;stern european,t;! islands","Western European","eu1"],"Reykjavik":["true¦atlantic,coordinated universal3g2i0reykjavik,utc,zulu;celand,s0;!l;mt,reenwich mean0; time","Greenwich Mean"],"South_Georgia":["true¦atlantic,gs1s0;gs,outh georgia;!t","South Georgia"],"Stanley":["true¦atlantic,f0stanley;alkland1k0lk;!st,t;! island0;!s","Falkland Islands"]},"Australia":{"Adelaide":["true¦a2cen0south 1; 0tral 0;australia;c2delaide,ustralia0;! 0/south,n 0;central;dt,st,t","Central Australia","aus"],"Brisbane":["true¦a1brisbane0gold coa5logan,q4townsville;! time;e3ustralia0;!/q1n east0;!ern;ueensland;st","Brisbane"],"Broken_Hill":["true¦a1broken_hill,cen0y3; australia standard time,tral australia;c2delaide,ustralia0;! central,/y0;ancowinna;st,t","Central Australia","aus"],"Darwin":["true¦a0darwin,northern territory;cst,ustralia0;!/north,n central","Australian Central"],"Eucla":["true¦a0cw4eucla;cw4us0; central w1tralia0;!n central western;!e0;st;dt,st,t","Australian Central Western"],"Hobart":["true¦a0canberra,eastern austral5hobart,king island,melbourne,sydney,t4;e8us0; east5tralia0;! 3/0n 3;currie,t0;asman0;ia;easte1;!e0;rn;dt,st,t","Eastern Australia","aus"],"Lindeman":["true¦a0brisbane time,lindeman,whitsunday islands;est,ustralia0;!n eastern","Brisbane"],"Lord_Howe":["true¦australia3l0;h1ord howe0;! island;dt,st,t;!/lhi","Lord Howe","lhow"],"Melbourne":["true¦a0canberra,eastern austral4geelong,melbourne,sydney,v3;e7us0; east4tralia0;! 2/v0n 2;ictor0;ia;easte1;!e0;rn;dt,st,t","Eastern Australia","aus"],"Perth":["true¦a4perth,w0; 2est0; 1ern australia0;! time;australia;ustralia1w0;dt,st,t;! weste1/west,n west0;!e0;rn","Western Australia"],"Sydney":["true¦a0c5eastern australia time,melbourne,new south wales,sydney,wollongong;e8u0;!s0;! east4tralia0;! 2/0n 2;act,c0nsw;anberra;easte1;!e0;rn;dt,st,t","Eastern Australia","aus"]},"Etc":{"GMT":["true¦!2;etc3g0;mt1reenwich0;! mean time;!+\\a,-\\a,\\a;!/g0;mt0reenwich;+\\a,-\\a,\\a","Greenwich Mean"],"UTC":["true¦coordinated universal time,etc1u0z3;ct,n4tc;!/0;u1z0;ulu;ct,n0;iversal","UTC"]},"Europe":{"Berlin":["true¦b0europe/b0;erlin","Central European","eu2"],"Simferopol":["true¦europe/s0s0;imferopol","Moscow"],"Amsterdam":["true¦a9brussels,c6e4groning7madrid,n2paris,ro1t0utrecht;he hague,ilburg;mance,t9;etherlands,l0;!d;indhov2urope0;! central;e1openhag0;en;ntral european,st,t;lmere stad,m0;s0t;terdam","Central European","eu2"],"Andorra":["true¦a3brussels,c1europe0madrid,paris,romance;! central;e0openhagen;ntral european,st,t;d,nd0;!orra","Central European","eu2"],"Astrakhan":["true¦astrakh1europe,m0russi1st petersburg,volgograd time;oscow,sk;an","Astrakhan"],"Athens":["true¦athens,e1gr0thessaloniki;!c,eece;astern european,et,urope0;! eastern","Eastern European","eu3"],"Belgrade":["true¦b9c7europe3madrid,n2p1romance,s0;i,lovenia,vn;aris,risti4;is,ovi sad;! central,/0;ljublja1podgorica,s0zagreb;arajevo,kopje;na;e0openhagen;ntral european,st,t;elgrade,russels","Central European","eu2"],"Brussels":["true¦antwerp6b3c1europe0gent,liege,madrid,paris,romance;! central;e0harleroi,openhag4;ntral european,st,t;e0mt,russels;!l0;!gium;en","Central European","eu2"],"Bucharest":["true¦b5c4e2gala1iasi,oradea,ploies1ro0timisoara;!mania,u;ti;astern european,et,urope0;! eastern;luj napoca,onstanta,raiova;ra0ucharest;ila,sov","Eastern European","eu3"],"Budapest":["true¦b6c3debrec4europe2hu0madrid,paris,romance;!n0;!gary;! central;e1openhag0;en;ntral european,st,t;russels,udapest","Central European","eu2"],"Busingen":["true¦b5c3de2europe1germa0madrid,paris,romance,saxo0;ny;! central,/berlin;!u;e0openhag3;ntral european,st,t;avaria,r0using1;em0ussels;en","Central European","eu2"],"Chisinau":["true¦chisinau,e2m0;d0oldova;!a;astern european,et,urope0;! eastern,/tiraspol","Eastern European","eu2"],"Copenhagen":["true¦arhus,brussels,c2d1europe0madrid,paris,romance;! central;enmark,k,nk;e0mt,openhagen;ntral european,st,t","Central European","eu2"],"Dublin":["true¦ace,british8cork,d7e6g5i3l0tse,waterford;i0ond1;merick,sb0;on;e,r0st;eland,l;alway,mt,reenwich mean2;dinburgh,ire,urope;mt,ublin; time","Irish","eu1"],"Gibraltar":["true¦b5c3europe2gi0madrid,paris,romance;!b0;!raltar;! central;e0openhagen;ntral european,st,t;dst,russels,st","Central European","eu2"],"Helsinki":["true¦e3fi1helsinki,t0vantaa;ampere,urku;!n0;!land;astern european,et,spoo,urope0;! eastern,/mariehamn","Eastern European","eu3"],"Istanbul":["true¦aYbScQdOeKgJiHkFmBosmAs4t1u0van,zeytinburnu;eskuedWmr9;arsus,r1ur0;!kZ;!abzon,t;a3i1ultan0;beyJgazi;sIv0;as,erek;msun,n0;cakteBliurfa;aniye;a1er0uratpaH;kezefendi,sin;l0niF;atQte6;a0irikkale,onPutahP;hramanmaras,rabaglGyseS;sJzmi0;r,t;aziantep,ebze;lazig,rzurum,s1uro0;pe;en0kiC;l8yurt;eniz0iyarbakB;li;ankaEor0;lu,um;a1ur0;sa;gcil2hcelievl1likes5sak4t0;ikent,mB;er;ar;d7n4rnavutko3sia/is2ta0;seh0;ir;tanbul;ey;kara,ta0;k0l0;ya;a1iyam0;an;na,paza0;ri","Turkey"],"Kaliningrad":["true¦e0kaliningrad;astern european,et,urope","Eastern European"],"Kyiv":["true¦bila tserkLcherIdGeDhorlCivano frankivHk8l7m5odessa,poltaLriv4sumy,ternopil,u2vinnyts1z0;aporizhzh0hytomyr;ya;a,kr0;!ai0;ne;a0ykolayE;ki5riu8;ut9vC;amyanske,h1iev,r0yB;emenchuk,opyv1yvyy rih;ark9erson,mel0;nytskyy;ivka;astern european,et,urope0;! eastern,/simfero0;pol;nipro,onet0;sk;kasy,ni0;h0vtsi;iv;va","Eastern European","eu3"],"Kirov":["true¦europe,kirov,m0russian,st petersburg,volgograd time;oscow,sk","Moscow"],"Lisbon":["true¦amadora,europe5lisbon,p2we0;st0t;! europe,ern european;ort0rt,t;o,ugal0;! mainland;! western","Western European","eu1"],"London":["true¦a0Ob0Ac07d03eXgThRiOj00kingston upon hull,lJmHnBoxSp9reading,s1w0yF;arwick0Aigan,olverha7;heffield,o3t2u1w0;an4iH;ffolk,nderland,rrey,sYttL;afNoke on trent;meZuth0;a1end on 0;sea;mptG;ly0orts0restF;mouth;ew4o0;r0ttinghamT;th0wC; y0amptonR;orkV;castle upon tyne,port;ancheQi0;dlan4lton keynes;ancaRdn,e2i1o0ut5;nd4;ncolnPsb3verW;e0icesterJ;ds;psw1slingt0;on;ich;ampJert0;fordI;b2l1mt0reenwich mean M;! standard L;asgow,oucesterF;!-eF;dinburgh,s4urope0;!/0;belNguernsMisle_of_m1j0;ersL;an;sex;erby2o1u0;blin,dlH;rset;!sh5;a1ity of westmin0oventry,rawlE;ster;mbridge1rdiff;eAir9lack7r2st,uckingham0;sh0;ire;adford,e3i0;st4tish0;! 0;time;nt;po0;ol;kenhead,mingham;l1xl0;ey;fast;berdeen,rchway","British","eu1"],"Luxembourg":["true¦brussels,c3europe2lu0madrid,paris,romance;!x0;!embourg;! central;e0openhagen;ntral european,st,t","Central European","eu2"],"Madrid":["true¦aRbOcJeGfuenDgCjerez de la frontera,lBm8ovieFp6romance,s1terrassa,v0wemt,zaragoza;alladol9igo;a1evilla,pain0;! mainland;badell,n0; sebastiHt0; marti,ander,s montjuic;a0uente de vallecas;lma,mpIris;a0ostolLurcK;dr0laga;id;atiJeganI;asteiz/vitorGijon,ran1;carral el par1labr0;ada;do;ixample,lche,s1urope0;! centr2;!p;a3e1iudad line0openhagen;al;ntral europe0st,t;an;rabanchel,stello de la pla7;a0ilbao,russels,urgos;da0rce0sque;lo4; coru3l0;cala de henar1icante,mer0;ia;es;na","Central European","eu2"],"Malta":["true¦brussels,c3europe2m0paris,romance;a0lt,t;drid,lta;! central;e0openhagen;ntral european,st,t","Central European","eu2"],"Minsk":["true¦b4europe,h3m1russian,st petersburg,v0;iteb4olgograd time;ahily0in3osc0sk;ow;omyel,rodna;abruy0elarus,lr,rest,y;sk","Moscow"],"Monaco":["true¦brussels,c3europe2m0paris,romance;adrid,c0onaco;!o;! central;e0openhagen;ntral european,st,t","Central European","eu2"],"Moscow":["true¦ar0Db0Ac07dzerzh06europe,fet,groznyy,ivanovo,kYlipetsk,mRnNorel,pKrFs8t6v2w-su,y0zelenograd;a0oshkar oW;roslavl,senevo;asyl'evsky ostrIelikiMladi2o0ykhino zhulebT;l0ronezh;gograd Pogda;kavkaz,mir;a0uQver;ganrog,mbD;a4ever3hakhty,molensk,ochi,t0yktyvkR; 4a0;ryy osk0vrop0;ol;nSodvT;int 0rX;petersburg;ostov na donu,u1y0;azLbP;!s0;!sia0;!n;e1odolUsk0;ov;nza,trozavodS;a2izhn0ovorossiyR;ekamQi0;y novM;berezhnyye chelny,l'chik;a3dst,oscow1s0urmJ;d,k;! 0;time;khachka1r'0;ino;la;a2himki,ostroma,rasno0urG;d0gvargeisky;ar;l1z0;an;ininsk5uga;vo;yy;in8;entraln1he0;boksary,repovets;iy;el1ry0;an3;gorod;khangel'1mav0;ir;sk","Moscow"],"Oslo":["true¦a6b5c3europe2madrid,oslo,paris,romance,s0;j0valbard and jan 6;!m;! central;e0openhag4;ntral european,st,t;erg2russels;rctic/longyearby1tlantic/jan_0;may0;en","Central European","eu2"],"Paris":["true¦bIcFeuropeEfrBl9m7n5paris,r3s0toulouH;aint 1t0; 0rasbourg;etienne;e0oman9;ims,nn1;ant0i7ormandy;es;a0et,ontpellier;drid,rsei1;e havre,i0yon;lle;!a0;!n0;ce;! central;e0openhagen;ntral european,rgy pontoi0st,t;se;ordeaux,russels","Central European","eu2"],"Prague":["true¦br6c4europe2madrid,ostr3p1romance,s0;k,lovakia,vk;aris,mt,rague;! central,/bratisl0;ava;e0openhagen;ntral european,st,t;no,ussels","Central European","eu2"],"Riga":["true¦e2kalt,l0riga;atvia,st,v0;!a;ast2e1urope0;! eastern;st,t; europe,ern european","Eastern European","eu3"],"Rome":["true¦bIcEeuropeCfloreBgenoa,mAnaples,p7r5sicily,t3v0;a0eroK;!t0;!ican city;aran4rieste,u0;rin,scany;mt,om0;a4e;a1ra0;to;dova,lermo,ris;adrid,essiAil6;nce;! central,/0;san_marino,vatic3;atan5e1o0;penhagen,rsica;ntral europe0st,t;an;ari,olog2r0;esc0ussels;ia;na","Central European","eu2"],"Samara":["true¦europe,izhevsk,s0togliatti on the volga;am0yzran;ara,t","Samara"],"Saratov":["true¦balakovo,europe,izhevsk,sa0;m0ratov;ara,t","Samara"],"Sofia":["true¦b2e0imt,plovdiv,sof4varna;astern european,et,urope0;! eastern;g2u0;lgar0rgas;ia;!r","Eastern European","eu3"],"Stockholm":["true¦brussels,c5europe4goeteborg,ma3paris,romance,s0;e1tockholm,we0;!d4;!t;drid,lmoe;! central;e1openhag0;en;ntral european,st,t","Central European","eu2"],"Tallinn":["true¦e0tallinn;astern european,e2st1urope0;! eastern;!onia;!t","Eastern European","eu3"],"Tirane":["true¦al4brussels,c2europe1madrid,paris,romance,tiran0;a,e;! central;e0openhagen;ntral european,st,t;!b0;!ania","Central European","eu2"],"Ulyanovsk":["true¦europe,m0russian,st petersburg,ulyanovsk,volgograd 2;oscow0sk;! 0;time","Ulyanovsk"],"Uzhgorod":["true¦e0ruthenia,uzhgorod;astern european,et,urope0;! eastern","Eastern European","eu3"],"Vienna":["true¦a4brussels,c1donaustadt,europe0favorit2graz,linz,madrid,paris,romance,vienna;! central;e1openhag0;en;ntral european,st,t;t,u0;stria,t","Central European","eu2"],"Vilnius":["true¦e3k2l0vilnius;ithuania,t0;!u;aunas,laipeda;astern european,et,urope0;! eastern","Eastern European","eu3"],"Volgograd":["true¦europe,m2russian,st petersburg,vol0;gograd0t,zhskiy;! time;oscow,sk","Moscow"],"Warsaw":["true¦bKcHeuropeGgCkAl8m7p4r3s2torun,w0zabrze;ars0rocl0;aw;osnowiec,zczec6;adIomanA;aris,l,o0raga poludnie;l0znD;!and;adrid,okot3;odz,ubl0;in;ato2iel3rak0;ow;d2li0;wi0;ce;ansk,ynia;! central;e0openhagen,zestochowa;ntral europe0st,t;an;i2russels,y0;dgoszcz,t0;om;alystok,elsko biala","Central European","eu2"],"Zaporozhye":["true¦e3luhansk2sevastopol,zapor0;izhia lugansk,ozh0;'ye,ye;! east;astern european,et,urope0;! eastern","Eastern European","eu3"],"Zurich":["true¦brussels,c4europe2geneve,li0madrid,paris,romance,swiss time,zurich;!e0;!chtenstein;! central,/0;busin1vaduz;e1openha0;gen;ntral european,st,t","Central European","eu2"]},"Indian":{"Chagos":["true¦british indian ocean territory,c4i0;ndian1o0;!t;! 0;c0ocean;hagos","Indian Ocean"],"Christmas":["true¦c0indian;hristmas1x0;!r,t;! island","Christmas Island"],"Cocos":["true¦c0indian;c2ocos0;! island0;!s;!k,t","Cocos Islands"],"Kerguelen":["true¦a5french southern2indian,kerguelen1tf0;!t;!st paul4;! 0;& antarctic time,and antarctic0;! lands;msterdam0tf; island","French Southern & Antarctic"],"Mahe":["true¦indian,mahe,s0;c0eychelles,yc;!t","Seychelles"],"Maldives":["true¦indian,m0;aldives,dv,v0;!t","Maldives"],"Mauritius":["true¦indian,m0port louis;auritius,u0;!s,t","Mauritius"],"Reunion":["true¦indian,r0;e0éu1;t,u0;nion","Réunion"]},"Pacific":{"Apia":["true¦apia,pacific,s2w0;est s1s0;!m,t;amoa","West Samoa"],"Auckland":["true¦a2christchurch,manukau,n0pacific,wellington;ew zea2orth shore,z0;!dt,l,mt,st,t;ntarctica/1uck0;land;mcmurdo,south_pole","New Zealand","nz"],"Bougainville":["true¦bougainville,guinea2p0;a0gt;cific,pua new guinea;!n","Bougainville"],"Chatham":["true¦cha0nz-chat,pacific;dt,st,t0;!ham0;! 0;islands,time","Chatham","chat"],"Chuuk":["true¦chu2pacific0;!/0;truk,y2;t,uk0;!/truky0;ap","Chuuk"],"Easter":["true¦chile/easter4e0pacific;as0mt;st,t0;!er0;! 0;island","Easter Island","east"],"Efate":["true¦efate,pacific,v0;anuatu,u0;!t","Vanuatu"],"Fakaofo":["true¦fakaofo,pacific,t0;k0okelau;!l,t","Tokelau"],"Fiji":["true¦f0pacific;iji,j0;!i,st,t","Fiji"],"Funafuti":["true¦funafuti,pacific,t0;uv1v0;!t;!alu","Tuvalu"],"Galapagos":["true¦co1gal0pacific;apagos,t,ápagos islands;lombia,st,t","Galapagos"],"Gambier":["true¦gam0pacific;bier0t;! islands","Gambier"],"Guadalcanal":["true¦guadalcanal,pacific,s0;b1lb,olomon0;! islands;!t","Solomon Islands"],"Guam":["true¦ch5guam,m4northern mariana islands,p2west0; 0ern 0;pacific;acific0ort moresby;!/saipan;np,p;amorro,st","Chamorro"],"Honolulu":["true¦aleutian4h1pacific0us/hawaii;!/johnston;a0onolulu,st;dt,st,t,waii0;! aleutian;! islands","Hawaii"],"Kanton":["true¦kanton,p0;acific1ho0;enix islands,t;!/enderbury","Phoenix Islands"],"Kiritimati":["true¦ki1lin0pacific;e islands,t;!r0;!i0;bati,timati0;! island","Line Islands"],"Kosrae":["true¦kos0pacific;rae,t","Kosrae"],"Kwajalein":["true¦kwajalein,m0pacific;arshall islands,ht","Marshall Islands"],"Majuro":["true¦m0pacific;a1h0;!l,t;juro,rshall islands","Marshall Islands"],"Marquesas":["true¦mar0pacific;quesas0t;! islands","Marquesas"],"Nauru":["true¦n0pacific;auru,r0;!t,u","Nauru"],"Niue":["true¦n0pacific;iu1u0;!t;!e","Niue"],"Norfolk":["true¦n0pacific;f1orfolk0;! island;!dt,k,t","Norfolk Island","aus"],"Noumea":["true¦n0pacific;c0ew caledonia,oumea;!l,t","New Caledonia"],"Pago_Pago":["true¦m5pa1s0us/sa4;a3st;cific0go_pago;!/0;m1sa0;moa;idway","Samoa"],"Palau":["true¦p0;a1lw,w0;!t;cific,lau","Palau"],"Pitcairn":["true¦!2;p0utc-\\a\\i;acific,cn,itcairn,n,st","Pitcairn"],"Pohnpei":["true¦french polynesia,p0;acific1f,o0yf;hnpei0nt;!/ponape","Ponape"],"Port_Moresby":["true¦antarctica/dumontd6dumont-d'6guinea5p0;a3g2ng,ort0; 0_0;moresby;!t;cific,pua new guinea;!n;urville","Papua New Guinea"],"Rarotonga":["true¦c0pacific,rarotonga;k2o0;k,ok0;! islands;!t","Cook Islands"],"Tahiti":["true¦pacific,society islands,tah0;iti,t","Tahiti"],"Tarawa":["true¦gil0pacific,tarawa;bert islands,t","Gilbert Islands"],"Tongatapu":["true¦nuku'alofa,pacific,to0;!n0t;!ga0;!tapu","Tonga"],"Wake":["true¦pacific,u2wak0;e0t;! island;m0s minor outlying islands;!i","Wake Island"],"Wallis":["true¦pacific,w0;allis1f0lf;!t;! 0;&0and0; futuna","Wallis & Futuna"]}};

// strings that don't pack properly
var misc = {
  'gmt+0': ['Etc/GMT'],
  'gmt-0': ['Etc/GMT'],
  gmt0: ['Etc/GMT'],
  'etc/gmt+0': ['Etc/GMT'],
  'etc/gmt-0': ['Etc/GMT'],
  'etc/gmt0': ['Etc/GMT'],
  'msk+00': ['Europe/Moscow'],
  'msk-01 - kaliningrad': ['Europe/Kaliningrad'],
  'msk+00 - moscow area': ['Europe/Moscow'],
  'msk+00 - crimea': ['Europe/Kyiv'],
  'msk+00 - volgograd': ['Europe/Volgograd'],
  'msk+00 - kirov': ['Europe/Kirov'],
  'msk+01 - astrakhan': ['Europe/Astrakhan'],
  'msk+01 - saratov': ['Europe/Saratov'],
  'msk+01 - ulyanovsk': ['Europe/Ulyanovsk'],
  'msk+01 - samaraudmurtia': ['Europe/Samara'],
  'msk+02 - urals': ['Asia/Yekaterinburg'],
  'msk+03': ['Asia/Omsk'],
  'msk+04 - novosibirsk': ['Asia/Novosibirsk'],
  'msk+04 - altai': ['Asia/Barnaul'],
  'msk+04': ['Asia/Tomsk'],
  'msk+04 - kemerovo': ['Asia/Novokuznetsk'],
  'msk+04 - krasnoyarsk area': ['Asia/Krasnoyarsk'],
  'msk+05 - irkutskburyatia': ['Asia/Irkutsk'],
  'msk+06 - zabaykalsky': ['Asia/Chita'],
  'msk+06 - lena river': ['Asia/Yakutsk'],
  'msk+06 - tomponskyust-maysky': ['Asia/Khandyga'],
  'msk+07 - amur river': ['Asia/Vladivostok'],
  'msk+07 - oymyakonsky': ['Asia/Ust-Nera'],
  'msk+08 - magadan': ['Asia/Magadan'],
  'msk+08 - sakhalin island': ['Asia/Sakhalin'],
  'msk+08 - sakha (e) north kuril is': ['Asia/Srednekolymsk'],
  'msk+09': ['Asia/Kamchatka'],
  'msk+09 - bering sea': ['Asia/Anadyr'],
  "russia time zone 11": ["Asia/Anadyr"],
  "russia time zone 10": ["Asia/Srednekolymsk"],
  "russia time zone 3": ["Europe/Samara"],
  "coordinated universal time-09": ["Pacific/Gambier"],
  "utc-09": ["Pacific/Gambier"],
  "coordinated universal time-08": ["Pacific/Pitcairn"]
};

const addEtc = function (zones) {
  for (let i = 0; i <= 14; i += 1) {
    zones[`Etc/GMT-${i}`] = {
      offset: i,
      meta: `gmt-${i}`
    };
    if (i <= 12) zones[`Etc/GMT+${i}`] = {
      offset: i * -1,
      meta: `gmt+${i}`
    };
  }
};

// IANA tzdata2026d Zone and Link records (main files plus backward).
// Source: https://data.iana.org/time-zones/releases/tzdata2026d.tar.gz
// Generated by scripts/import-iana-identifiers.js; display metadata is maintained separately.
// Rows contain a canonical basename followed by aliases; /aliases share its directory.
const directories = {
  "Africa": [
    "Abidjan /Accra /Bamako /Banjul /Conakry /Dakar /Freetown /Lome /Nouakchott /Ouagadougou /Timbuktu Atlantic/Reykjavik Atlantic/St_Helena Iceland",
    "Algiers",
    "Bissau",
    "Cairo Egypt",
    "Casablanca",
    "Ceuta",
    "El_Aaiun",
    "Johannesburg /Maseru /Mbabane",
    "Juba",
    "Khartoum",
    "Lagos /Bangui /Brazzaville /Douala /Kinshasa /Libreville /Luanda /Malabo /Niamey /Porto-Novo",
    "Maputo /Blantyre /Bujumbura /Gaborone /Harare /Kigali /Lubumbashi /Lusaka",
    "Monrovia",
    "Nairobi /Addis_Ababa /Asmara /Asmera /Dar_es_Salaam /Djibouti /Kampala /Mogadishu Indian/Antananarivo Indian/Comoro Indian/Mayotte",
    "Ndjamena",
    "Sao_Tome",
    "Tripoli Libya",
    "Tunis",
    "Windhoek"
  ],
  "America": [
    "Adak /Atka US/Aleutian",
    "Anchorage US/Alaska",
    "Araguaina",
    "Asuncion",
    "Bahia",
    "Bahia_Banderas",
    "Barbados",
    "Belem",
    "Belize",
    "Boa_Vista",
    "Bogota",
    "Boise",
    "Cambridge_Bay",
    "Campo_Grande",
    "Cancun",
    "Caracas",
    "Cayenne",
    "Chicago US/Central",
    "Chihuahua",
    "Ciudad_Juarez",
    "Costa_Rica",
    "Coyhaique",
    "Cuiaba",
    "Danmarkshavn",
    "Dawson",
    "Dawson_Creek",
    "Denver /Shiprock Navajo US/Mountain",
    "Detroit US/Michigan",
    "Edmonton /Yellowknife Canada/Mountain",
    "Eirunepe",
    "El_Salvador",
    "Fort_Nelson",
    "Fortaleza",
    "Glace_Bay",
    "Goose_Bay",
    "Grand_Turk",
    "Guatemala",
    "Guayaquil",
    "Guyana",
    "Halifax Canada/Atlantic",
    "Havana Cuba",
    "Hermosillo",
    "Inuvik",
    "Iqaluit /Pangnirtung",
    "Jamaica Jamaica",
    "Juneau",
    "La_Paz",
    "Lima",
    "Los_Angeles US/Pacific",
    "Maceio",
    "Managua",
    "Manaus Brazil/West",
    "Martinique",
    "Matamoros",
    "Mazatlan Mexico/BajaSur",
    "Menominee",
    "Merida",
    "Metlakatla",
    "Mexico_City Mexico/General",
    "Miquelon",
    "Moncton",
    "Monterrey",
    "Montevideo",
    "New_York US/Eastern",
    "Nome",
    "Noronha Brazil/DeNoronha",
    "Nuuk /Godthab",
    "Ojinaga",
    "Panama /Atikokan /Cayman /Coral_Harbour EST",
    "Paramaribo",
    "Phoenix /Creston MST US/Arizona",
    "Port-au-Prince",
    "Porto_Velho",
    "Puerto_Rico /Anguilla /Antigua /Aruba /Blanc-Sablon /Curacao /Dominica /Grenada /Guadeloupe /Kralendijk /Lower_Princes /Marigot /Montserrat /Port_of_Spain /St_Barthelemy /St_Kitts /St_Lucia /St_Thomas /St_Vincent /Tortola /Virgin",
    "Punta_Arenas",
    "Rankin_Inlet",
    "Recife",
    "Regina Canada/Saskatchewan",
    "Resolute",
    "Rio_Branco /Porto_Acre Brazil/Acre",
    "Santarem",
    "Santiago Chile/Continental",
    "Santo_Domingo",
    "Sao_Paulo Brazil/East",
    "Scoresbysund",
    "Sitka",
    "St_Johns Canada/Newfoundland",
    "Swift_Current",
    "Tegucigalpa",
    "Thule",
    "Tijuana /Ensenada /Santa_Isabel Mexico/BajaNorte",
    "Toronto /Montreal /Nassau /Nipigon /Thunder_Bay Canada/Eastern",
    "Vancouver Canada/Pacific",
    "Whitehorse Canada/Yukon",
    "Winnipeg /Rainy_River Canada/Central",
    "Yakutat"
  ],
  "America/Argentina": [
    "Buenos_Aires America/Buenos_Aires",
    "Catamarca /ComodRivadavia America/Catamarca",
    "Cordoba America/Cordoba America/Rosario",
    "Jujuy America/Jujuy",
    "La_Rioja",
    "Mendoza America/Mendoza",
    "Rio_Gallegos",
    "Salta",
    "San_Juan",
    "San_Luis",
    "Tucuman",
    "Ushuaia"
  ],
  "America/Indiana": [
    "Indianapolis America/Fort_Wayne America/Indianapolis US/East-Indiana",
    "Knox America/Knox_IN US/Indiana-Starke",
    "Marengo",
    "Petersburg",
    "Tell_City",
    "Vevay",
    "Vincennes",
    "Winamac"
  ],
  "America/Kentucky": [
    "Louisville America/Louisville",
    "Monticello"
  ],
  "America/North_Dakota": [
    "Beulah",
    "Center",
    "New_Salem"
  ],
  "Antarctica": [
    "Casey",
    "Davis",
    "Macquarie",
    "Mawson",
    "Palmer",
    "Rothera",
    "Troll",
    "Vostok"
  ],
  "Asia": [
    "Almaty",
    "Amman",
    "Anadyr",
    "Aqtau",
    "Aqtobe",
    "Ashgabat /Ashkhabad",
    "Atyrau",
    "Baghdad",
    "Baku",
    "Bangkok /Phnom_Penh /Vientiane Indian/Christmas",
    "Barnaul",
    "Beirut",
    "Bishkek",
    "Chita",
    "Colombo",
    "Damascus",
    "Dhaka /Dacca",
    "Dili",
    "Dubai /Muscat Indian/Mahe Indian/Reunion",
    "Dushanbe",
    "Famagusta",
    "Gaza",
    "Hebron",
    "Ho_Chi_Minh /Saigon",
    "Hong_Kong Hongkong",
    "Hovd",
    "Irkutsk",
    "Jakarta",
    "Jayapura",
    "Jerusalem /Tel_Aviv Israel",
    "Kabul",
    "Kamchatka",
    "Karachi",
    "Kathmandu /Katmandu",
    "Khandyga",
    "Kolkata /Calcutta",
    "Krasnoyarsk",
    "Kuching /Brunei",
    "Macau /Macao",
    "Magadan",
    "Makassar /Ujung_Pandang",
    "Manila",
    "Nicosia Europe/Nicosia",
    "Novokuznetsk",
    "Novosibirsk",
    "Omsk",
    "Oral",
    "Pontianak",
    "Pyongyang",
    "Qatar /Bahrain",
    "Qostanay",
    "Qyzylorda",
    "Riyadh Antarctica/Syowa /Aden /Kuwait",
    "Sakhalin",
    "Samarkand",
    "Seoul ROK",
    "Shanghai /Chongqing /Chungking /Harbin PRC",
    "Singapore /Kuala_Lumpur Singapore",
    "Srednekolymsk",
    "Taipei ROC",
    "Tashkent",
    "Tbilisi",
    "Tehran Iran",
    "Thimphu /Thimbu",
    "Tokyo Japan",
    "Tomsk",
    "Ulaanbaatar /Choibalsan /Ulan_Bator",
    "Urumqi /Kashgar",
    "Ust-Nera",
    "Vladivostok",
    "Yakutsk",
    "Yangon /Rangoon Indian/Cocos",
    "Yekaterinburg",
    "Yerevan"
  ],
  "Atlantic": [
    "Azores",
    "Bermuda",
    "Canary",
    "Cape_Verde",
    "Faroe /Faeroe",
    "Madeira",
    "South_Georgia",
    "Stanley"
  ],
  "Australia": [
    "Adelaide /South",
    "Brisbane /Queensland",
    "Broken_Hill /Yancowinna",
    "Darwin /North",
    "Eucla",
    "Hobart /Currie /Tasmania",
    "Lindeman",
    "Lord_Howe /LHI",
    "Melbourne /Victoria",
    "Perth /West",
    "Sydney /ACT /Canberra /NSW"
  ],
  "": [
    "CST6CDT",
    "EST5EDT",
    "MST7MDT",
    "PST8PDT"
  ],
  "Etc": [
    "GMT /GMT+0 /GMT-0 /GMT0 /Greenwich GMT GMT+0 GMT-0 GMT0 Greenwich",
    "GMT+1",
    "GMT+10",
    "GMT+11",
    "GMT+12",
    "GMT+2",
    "GMT+3",
    "GMT+4",
    "GMT+5",
    "GMT+6",
    "GMT+7",
    "GMT+8",
    "GMT+9",
    "GMT-1",
    "GMT-10",
    "GMT-11",
    "GMT-12",
    "GMT-13",
    "GMT-14",
    "GMT-2",
    "GMT-3",
    "GMT-4",
    "GMT-5",
    "GMT-6",
    "GMT-7",
    "GMT-8",
    "GMT-9",
    "UTC /UCT /Universal /Zulu UCT UTC Universal Zulu"
  ],
  "Europe": [
    "Andorra",
    "Astrakhan",
    "Athens EET",
    "Belgrade /Ljubljana /Podgorica /Sarajevo /Skopje /Zagreb",
    "Berlin Arctic/Longyearbyen Atlantic/Jan_Mayen /Copenhagen /Oslo /Stockholm",
    "Brussels CET /Amsterdam /Luxembourg MET",
    "Bucharest",
    "Budapest",
    "Chisinau /Tiraspol",
    "Dublin Eire",
    "Gibraltar",
    "Helsinki /Mariehamn",
    "Istanbul Asia/Istanbul Turkey",
    "Kaliningrad",
    "Kirov",
    "Kyiv /Kiev /Uzhgorod /Zaporozhye",
    "Lisbon Portugal WET",
    "London /Belfast /Guernsey /Isle_of_Man /Jersey GB GB-Eire",
    "Madrid",
    "Malta",
    "Minsk",
    "Moscow W-SU",
    "Paris /Monaco",
    "Prague /Bratislava",
    "Riga",
    "Rome /San_Marino /Vatican",
    "Samara",
    "Saratov",
    "Simferopol",
    "Sofia",
    "Tallinn",
    "Tirane",
    "Ulyanovsk",
    "Vienna",
    "Vilnius",
    "Volgograd",
    "Warsaw Poland",
    "Zurich /Busingen /Vaduz"
  ],
  "Indian": [
    "Chagos",
    "Maldives /Kerguelen",
    "Mauritius"
  ],
  "Pacific": [
    "Apia",
    "Auckland Antarctica/McMurdo Antarctica/South_Pole NZ",
    "Bougainville",
    "Chatham NZ-CHAT",
    "Easter Chile/EasterIsland",
    "Efate",
    "Fakaofo",
    "Fiji",
    "Galapagos",
    "Gambier",
    "Guadalcanal /Pohnpei /Ponape",
    "Guam /Saipan",
    "Honolulu HST /Johnston US/Hawaii",
    "Kanton /Enderbury",
    "Kiritimati",
    "Kosrae",
    "Kwajalein Kwajalein",
    "Marquesas",
    "Nauru",
    "Niue",
    "Norfolk",
    "Noumea",
    "Pago_Pago /Midway /Samoa US/Samoa",
    "Palau",
    "Pitcairn",
    "Port_Moresby Antarctica/DumontDUrville /Chuuk /Truk /Yap",
    "Rarotonga",
    "Tahiti",
    "Tarawa /Funafuti /Majuro /Wake /Wallis",
    "Tongatapu"
  ]
};
const identifiers = {};
for (const [directory, rows] of Object.entries(directories)) {
  for (const row of rows) {
    const [name, ...aliases] = row.split(' ');
    const target = directory ? directory + '/' + name : name;
    identifiers[target] = target;
    for (const alias of aliases) {
      identifiers[alias.startsWith('/') ? directory + alias : alias] = target;
    }
  }
}

//try to match these against iana form
const one = (str) => {
  str = str.toLowerCase().trim().replace(/\s+/g, ' ');
  str = str.replace(/^in /g, '');
  str = str.replace(/ time/g, '');
  str = str.replace(/ (standard|daylight|summer)/g, '');
  str = str.replace(/ - .*/g, ''); //`Eastern Time - US & Canada`
  str = str.replace(/, .*/g, ''); //`mumbai, india`
  str = str.replace(/\./g, '');//st. petersberg
  return str.trim()
};

//some more aggressive transformations
const two = function (str) {
  str = str.replace(/\b(east|west|north|south)ern/g, '$1');
  str = str.replace(/\b(africa|america|australia)n/g, '$1');
  str = str.replace(/\beuropean/g, 'europe');
  str = str.replace(/\islands/g, 'island');
  str = str.replace(/.*\//g, '');
  return str.trim()
};
// even-more agressive
const three = function (str) {
  str = str.replace(/\(.*\)/, '');//anything in brackets
  str = str.replace(/  +/g, ' ');//extra spaces
  return str.trim()
};

const fold = str => str.normalize('NFD').replace(/\p{M}/gu, '');

var normalize = { one, two, three, fold };

// unpack our lexicon of words
const zones = {};
const lexicon = Object.assign({}, misc);
Object.keys(pcked).forEach(top => {
  Object.keys(pcked[top]).forEach(name => {
    const [words, meta, dst] = pcked[top][name];
    const id = `${top}/${name}`;
    zones[id] = { meta };
    const keys = Object.keys(unpack(words));
    keys.forEach(k => {
      lexicon[k] = lexicon[k] || [];
      lexicon[k].push(id);
      // use iana aliases
      if (/\//.test(k)) {
        const arr = k.split(/\//);
        const last = arr[arr.length - 1].toLowerCase();
        lexicon[last] = lexicon[last] || [];
        lexicon[last].push(id);
      }
    });
    zones[id].wordCount = keys.length;
    if (dst) {
      zones[id].dst = patterns[dst].split(/\|/);
    }
  });
});

addEtc(zones);

const canonicalIds = Object.fromEntries(Object.entries(identifiers).map(([id, target]) => [id.toLowerCase(), target]));
const canonicalize = id => canonicalIds[id.toLowerCase()] || id;

const unique = function (arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i += 1) {
    obj[arr[i]] = true;
  }
  return Object.keys(obj)
};

// sort by num of aliases
Object.keys(lexicon).forEach(k => {
  if (lexicon[k].length > 1) {
    lexicon[k] = unique(lexicon[k]);
    lexicon[k] = lexicon[k].sort((a, b) => {
      if (zones[a].wordCount > zones[b].wordCount) {
        return -1
      } else if (zones[a].wordCount < zones[b].wordCount) {
        return 1
      }
      return 0
    });
  }
});
// Only accented aliases need a second index; ordinary lookups keep their ranking.
const foldedLexicon = {};
for (const [alias, ids] of Object.entries(lexicon)) {
  const folded = normalize.fold(alias);
  if (folded === alias) continue
  foldedLexicon[folded] = [...new Set([...(foldedLexicon[folded] || []), ...ids])]
    .sort((a, b) => zones[b].wordCount - zones[a].wordCount);
}

const isOffset = /^([-+]?[0-9]+)h(r?s)?$/i;
const isNumber = /^([-+]?[0-9]+)$/;
const utcOffset = /^utc([\-+]?[0-9]+)$/i;
const gmtOffset = /^(?:etc\/)?gmt([\-+]?[0-9]+)$/i;

const toIana = function (num) {
  num = Number(num);
  if (num === 0) {
    return 'Etc/GMT'
  }
  if (num >= -12 && num <= 14) {
    num = num * -1; //it's opposite!
    num = (num > 0 ? '+' : '') + num; //add plus sign
    return 'Etc/GMT' + num
  }
  return null
};

const parseOffset = function (tz) {
  tz = tz.trim();
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
    const num = Number(m[1]) * -1;
    return toIana(num)
  }
  // '+5'
  m = tz.match(isNumber);
  if (m !== null) {
    return toIana(m[1])
  }
  return null
};

const reserved = input => {
  if (['utc', 'uct', 'universal', 'zulu', 'coordinated universal', 'coordinated universal time'].includes(input)) return 'Etc/UTC'
  if (input === 'gmt') return 'Etc/GMT'
  return null
};

// match some text to an iana code
const find = function (str) {
  const input = str.trim().toLowerCase();
  const special = reserved(input);
  if (special) return special
  // Explicit identifiers use IANA links, never informal alias ranking.
  if (input.includes('/')) {
    const id = canonicalIds[input];
    if (id) return Object.hasOwn(zones, id) ? id : null
    // Some curated informal phrases contain a slash but are not IANA IDs.
    return Object.hasOwn(lexicon, input) ? lexicon[input] : null
  }
  // perfect id match
  if (zones.hasOwnProperty(str)) {
    return str
  }
  // lookup known word
  if (lexicon.hasOwnProperty(str)) {
    return lexicon[str]
  }
  // -8hrs
  if (/[0-9]/.test(str)) {
    const etc = parseOffset(str);
    if (etc) {
      return [etc]
    }
  }
  // try a sequence of normalization steps
  const candidates = [input];
  for (const step of [normalize.one, normalize.two, normalize.three]) {
    str = step(str);
    candidates.push(str);
    const id = reserved(str);
    if (id) return id
    if (Object.hasOwn(lexicon, str)) return lexicon[str]
  }
  // Exact spellings at every normalization stage take precedence over folding.
  for (const candidate of candidates) {
    const folded = normalize.fold(candidate);
    const id = reserved(folded);
    if (id) return id
    if (Object.hasOwn(lexicon, folded)) return lexicon[folded]
    if (Object.hasOwn(foldedLexicon, folded)) return foldedLexicon[folded]
  }
  return null
};

// Generated by scripts/pack.js. Edit data/metas.js instead.
var metas = {"British Columbia":{"name":"British Columbia Time","std":["MST",-7,"Mountain Standard Time"],"long":"(UTC-07:00) British Columbia"},"Alberta and Northwest Territories":{"name":"Alberta and Northwest Territories Time","std":["CST",-6,"Central Standard Time"],"long":"(UTC-06:00) Alberta and Northwest Territories"},"Manitoba":{"name":"Manitoba Time","std":["EST",-5,"Eastern Standard Time"],"long":"(UTC-05:00) Manitoba"},"Ulyanovsk":{"std":["+04",4,"Ulyanovsk Time"]},"Astrakhan":{"std":["+04",4,"Astrakhan Time"]},"Tomsk":{"std":["+07",7,"Tomsk Time"]},"Syria":{"std":["+03",3,"Syria Time"]},"Jordan":{"std":["+03",3,"Jordan Time"]},"Bougainville":{"std":["+11",11,"Bougainville Time"]},"Magallanes":{"std":["-03",-3,"Magallanes Time"],"long":"(UTC-03:00) Punta Arenas"},"Galapagos":{"std":["GALT",-6],"long":"(UTC-06:00) Galapagos Islands"},"Hawaii":{"name":"Hawaii Time","std":["HST",-10,"Hawaii Standard Time"],"long":"(UTC-10:00) Hawaii"},"UTC":{"name":"Coordinated Universal Time","std":["UTC",0,"Coordinated Universal Time"],"long":"(UTC+00:00) Coordinated Universal Time"},"Aysen":{"name":"Aysen Time","std":["-03",-3,"Aysen Time"],"long":"(UTC-03:00) Coyhaique"},"Palmer":{"std":["-03",-3,"Palmer Time"],"long":"(UTC-03:00) Palmer"},"Xinjiang":{"std":["+06",6,"Xinjiang Time"],"name":"Xinjiang Time","long":"(UTC+06:00) Xinjiang Time"},"India":{"std":["IST",5.5],"long":"(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi"},"China":{"std":["CST",8],"long":"(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi"},"Central European":{"std":["CET",1],"dst":["CEST",2,"Central European Summer Time"],"long":"(UTC+01:00) Brussels, Copenhagen, Madrid, Paris"},"Atlantic":{"std":["AST",-4],"dst":["ADT",-3],"long":"(UTC-04:00) Atlantic Time (Canada)"},"Greenwich Mean":{"std":["GMT",0],"long":"(UTC) Coordinated Universal Time"},"Eastern European":{"std":["EET",2],"dst":["EEST",3,"Eastern European Summer Time"]},"Central":{"std":["CST",-6],"dst":["CDT",-5],"long":"(UTC-06:00) Central Time (US & Canada)"},"Eastern":{"std":["EST",-5],"dst":["EDT",-4],"long":"(UTC-05:00) Eastern Time (US & Canada)"},"Argentina":{"std":["ART",-3],"long":"(UTC-03:00) City of Buenos Aires"},"East Africa":{"std":["EAT",3],"long":"(UTC+03:00) Nairobi"},"West Africa":{"std":["WAT",1],"long":"(UTC+01:00) West Central Africa"},"Moscow":{"std":["MSK",3],"long":"(UTC+03:00) Moscow, St. Petersburg"},"Brasilia":{"std":["BRT",-3],"long":"(UTC-03:00) Brasilia"},"Mountain":{"std":["MST",-7],"dst":["MDT",-6],"long":"(UTC-07:00) Mountain Time (US & Canada)"},"Central Africa":{"std":["CAT",2],"long":"(UTC+02:00) Windhoek"},"Arabian":{"std":["AST",3],"long":"(UTC+03:00) Kuwait, Riyadh"},"Alaska":{"std":["AKST",-9],"dst":["AKDT",-8],"long":"(UTC-09:00) Alaska"},"British":{"std":["GMT",0],"dst":["BST",1,"British Summer Time"],"long":"(UTC+00:00) Dublin, Edinburgh, Lisbon, London"},"Irish":{"std":["GMT",0,"Greenwich Mean Time"],"dst":["IST",1,"Irish Standard Time"]},"West Kazakhstan":{"std":["ALMT",5],"long":"(UTC+05:00) Ashgabat, Tashkent"},"Eastern Australia":{"std":["AEST",10],"dst":["AEDT",11,"Australian Eastern Daylight Time"],"long":"(UTC+10:00) Canberra, Melbourne, Sydney"},"Western European":{"std":["WET",0],"dst":["WEST",1,"Western European Summer Time"]},"Indochina":{"std":["ICT",7],"long":"(UTC+07:00) Bangkok, Hanoi, Jakarta"},"Central Mexico":{"long":"(UTC-06:00) Guadalajara, Mexico City, Monterrey","std":["CST",-6],"dst":["CDT",-5,"Central Daylight Time"]},"South Africa":{"std":["SAST",2],"long":"(UTC+02:00) Harare, Pretoria"},"Krasnoyarsk":{"std":["KRAT",7],"long":"(UTC+07:00) Krasnoyarsk"},"Yakutsk":{"std":["YAKT",9],"long":"(UTC+09:00) Yakutsk"},"Pacific":{"std":["PST",-8],"dst":["PDT",-7],"long":"(UTC-08:00) Pacific Time (US & Canada)"},"Amazon":{"std":["AMT",-4],"long":"(UTC-04:00) Cuiaba"},"Morocco Standard":{"long":"(UTC+00:00) Casablanca","std":["+00",0]},"Gulf":{"std":["GST",4],"long":"(UTC+04:00) Abu Dhabi, Muscat"},"Samara":{"std":["SAMT",4],"long":"(UTC+04:00) Izhevsk, Samara"},"Uzbekistan":{"std":["UZT",5]},"East Kazakhstan":{"std":["ALMT",5],"long":"(UTC+05:00) Astana"},"Omsk":{"std":["OMST",6],"long":"(UTC+06:00) Omsk"},"Western Indonesia":{"std":["WIB",7]},"Ulaanbaatar":{"std":["ULAT",8],"long":"(UTC+08:00) Ulaanbaatar"},"Malaysia":{"std":["MYT",8]},"Korean":{"std":["KST",9],"long":"(UTC+09:00) Seoul"},"Central Australia":{"std":["ACST",9.5],"dst":["ACDT",10.5,"Australian Central Daylight Time"],"long":"(UTC+09:30) Adelaide"},"Brisbane":{"std":["AEST",10]},"Vladivostok":{"std":["VLAT",10],"long":"(UTC+10:00) Vladivostok"},"Chamorro":{"std":["ChST",10],"long":"(UTC+10:00) Guam, Port Moresby"},"Papua New Guinea":{"std":["PGT",10]},"New Zealand":{"std":["NZST",12],"dst":["NZDT",13],"long":"(UTC+12:00) Auckland, Wellington"},"Marshall Islands":{"std":["MHT",12]},"Samoa":{"std":["SST",-11],"long":"(UTC+13:00) Samoa"},"Mexican Pacific":{"std":["HNPMX",-7],"dst":["HEPMX",-6],"long":"(UTC-07:00) Chihuahua, La Paz, Mazatlan"},"Colombia":{"std":["COT",-5]},"Acre":{"std":["ACT",-5]},"Chile":{"std":["CLT",-4],"dst":["CLST",-3,"Chile Summer Time"]},"Troll":{"std":["GMT",0],"dst":["+02",2,"Troll Summer Time"]},"East Greenland":{"std":["EGT",-2],"dst":["EGST",-1,"East Greenland Summer Time"]},"Israel":{"std":["IST",2],"dst":["IDT",3],"long":"(UTC+02:00) Jerusalem"},"Turkey":{"std":["TRT",3],"long":"(UTC+03:00) Istanbul"},"Iran":{"std":["IRST",3.5],"dst":["IRDT",4.5],"long":"(UTC+03:30) Tehran"},"Azerbaijan":{"std":["AZT",4],"long":"(UTC+04:00) Baku"},"Georgia":{"std":["GET",4],"long":"(UTC+04:00) Tbilisi"},"Armenia":{"std":["AMT",4],"long":"(UTC+04:00) Yerevan"},"Seychelles":{"std":["SCT",4]},"Mauritius":{"std":["MUT",4],"long":"(UTC+04:00) Port Louis"},"Réunion":{"std":["RET",4]},"Afghanistan":{"std":["AFT",4.5],"long":"(UTC+04:30) Kabul"},"Mawson":{"std":["MAWT",5]},"Turkmenistan":{"std":["TMT",5]},"Tajikistan":{"std":["TJT",5]},"Pakistan":{"std":["PKT",5],"long":"(UTC+05:00) Islamabad, Karachi"},"Yekaterinburg":{"std":["YEKT",5],"long":"(UTC+05:00) Ekaterinburg"},"French Southern & Antarctic":{"std":["TFT",5]},"Maldives":{"std":["MVT",5]},"Nepal":{"std":["NPT",5.75],"long":"(UTC+05:45) Kathmandu"},"Vostok":{"std":["+05",5]},"Kyrgyzstan":{"std":["KGT",6]},"Bangladesh":{"std":["BST",6],"long":"(UTC+06:00) Dhaka"},"Bhutan":{"std":["BT",6]},"Indian Ocean":{"std":["IOT",6]},"Myanmar":{"std":["MMT",6.5],"long":"(UTC+06:30) Yangon (Rangoon)"},"Cocos Islands":{"std":["CCT",6.5]},"Davis":{"std":["DAVT",7]},"Hovd":{"std":["HOVT",7],"long":"(UTC+07:00) Hovd"},"Novosibirsk":{"std":["NOVT",7],"long":"(UTC+07:00) Novosibirsk"},"Christmas Island":{"std":["CXT",7]},"Brunei Darussalam":{"std":["BNT",8]},"Hong Kong":{"std":["HKT",8]},"Irkutsk":{"std":["IRKT",8],"long":"(UTC+08:00) Irkutsk"},"Central Indonesia":{"std":["WITA",8]},"Philippine":{"std":["PHST",8]},"Singapore":{"std":["SGT",8],"long":"(UTC+08:00) Kuala Lumpur, Singapore"},"Taipei":{"std":["CST",8],"long":"(UTC+08:00) Taipei"},"Western Australia":{"std":["AWST",8],"long":"(UTC+08:00) Perth"},"Australian Central Western":{"std":["ACWST",8.75],"long":"(UTC+08:45) Eucla"},"East Timor":{"std":["TLT",9]},"Eastern Indonesia":{"std":["WIT",9]},"Japan":{"std":["JST",9],"long":"(UTC+09:00) Osaka, Sapporo, Tokyo"},"Palau":{"std":["PWT",9]},"Australian Central":{"std":["ACST",9.5]},"Chuuk":{"std":["CHUT",10]},"Lord Howe":{"std":["LHST",10.5],"dst":["LHDT",11],"long":"(UTC+10:30) Lord Howe Island"},"Casey":{"std":["CAST",8]},"Magadan":{"std":["MAGT",11],"long":"(UTC+11:00) Magadan"},"Sakhalin":{"std":["SAKT",11],"long":"(UTC+11:00) Sakhalin"},"Srednekolymsk":{"std":["SRET",11],"long":"(UTC+11:00) Chokurdakh"},"Vanuatu":{"std":["VUT",11]},"Solomon Islands":{"std":["SBT",11]},"Kosrae":{"std":["KOST",11]},"New Caledonia":{"std":["NCT",11]},"Ponape":{"std":["PONT",11]},"Anadyr":{"std":["ANAT",12],"long":"(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky"},"Petropavlovsk-Kamchatski":{"std":["PETT",12],"long":"(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky"},"Fiji":{"std":["FJT",12],"long":"(UTC+12:00) Fiji"},"Tuvalu":{"std":["TVT",12]},"Nauru":{"std":["NRT",12]},"Norfolk Island":{"std":["NFT",11],"dst":["NFDT",12],"long":"(UTC+11:00) Norfolk Island"},"Gilbert Islands":{"std":["GILT",12]},"Wake Island":{"std":["WAKT",12]},"Wallis & Futuna":{"std":["WFT",12]},"Chatham":{"std":["CHAST",12.75],"dst":["CHADT",13.75],"long":"(UTC+12:45) Chatham Islands"},"West Samoa":{"std":["WST",13],"dst":["WST",14,"West Samoa Summer Time"]},"Phoenix Islands":{"std":["PHOT",13]},"Tokelau":{"std":["TKT",13]},"Tonga":{"std":["TOT",13],"long":"(UTC+13:00) Nuku'alofa"},"Line Islands":{"std":["LINT",14],"long":"(UTC+14:00) Kiritimati Island"},"Niue":{"std":["NUT",-11]},"Cook Islands":{"std":["CKT",-10]},"Tahiti":{"std":["TAHT",-10]},"Marquesas":{"std":["MART",-9.5],"long":"(UTC-09:30) Marquesas Islands"},"Aleutian Standard":{"std":["HST",-10],"dst":["HDT",-9,"Hawaii Daylight Time"]},"Gambier":{"std":["GAMT",-9],"long":"(UTC-09:00) Coordinated Universal Time-09"},"Pitcairn":{"std":["PST",-8],"long":"(UTC-08:00) Coordinated Universal Time-08"},"Easter Island":{"std":["EAST",-6],"dst":["EASST",-5,"Easter Island Summer Time"],"long":"(UTC-06:00) Easter Island"},"Ecuador":{"std":["ECT",-5]},"Cuba":{"std":["HNCU",-5],"dst":["HECU",-4],"long":"(UTC-05:00) Havana"},"Peru":{"std":["PET",-5]},"Paraguay":{"std":["PYT",-3],"long":"(UTC-03:00) Asuncion"},"Venezuela":{"std":["VET",-4],"long":"(UTC-04:00) Caracas"},"Guyana":{"std":["GYT",-4]},"Bolivia":{"std":["BOT",-4]},"Newfoundland":{"std":["HNTN",-3.5],"dst":["HETN",-2.5],"long":"(UTC-03:30) Newfoundland"},"French Guiana":{"std":["GFT",-3]},"West Greenland":{"std":["WGT",-2],"dst":["WGST",-1,"West Greenland Summer Time"],"long":"(UTC-02:00) Greenland"},"St. Pierre & Miquelon":{"std":["HNPM",-3],"dst":["HEPM",-2],"long":"(UTC-03:00) Saint Pierre and Miquelon"},"Uruguay":{"std":["UYT",-3],"long":"(UTC-03:00) Montevideo"},"Suriname":{"std":["SRT",-3]},"Falkland Islands":{"std":["FKST",-3]},"Fernando de Noronha":{"std":["FNT",-2]},"South Georgia":{"std":["GST",-2]},"Azores":{"std":["AZOT",-1],"dst":["AZOST",0,"Azores Summer Time"],"long":"(UTC-01:00) Azores"},"Cape Verde":{"std":["CVT",-1],"long":"(UTC-01:00) Cabo Verde Is."}};

const formatOffset = offset => {
  const minutes = Math.round(Math.abs(offset) * 60);
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const remainder = String(minutes % 60).padStart(2, '0');
  return `UTC${offset < 0 ? '-' : '+'}${hours}:${remainder}`
};

/* eslint-disable no-console */

for (let i = 0; i <= 14; i += 1) {
  metas[`gmt-${i}`] = {
    name: `Etc/GMT-${i}`,
    std: [`GMT-${i}`, i],
    long: `(${formatOffset(i)}) Coordinated Universal Time`
  };
  if (i <= 12) metas[`gmt+${i}`] = {
    name: `Etc/GMT+${i}`,
    std: [`GMT+${i}`, -i],
    long: `(${formatOffset(-i)}) Coordinated Universal Time`
  };
}

const display = function (id) {
  if (!id) {
    return null
  }
  if (!zones[id]) {
    console.error(`missing id ${id}`);
    return null
  }
  const metaName = zones[id].meta;
  if (!metas[metaName]) {
    console.error(`missing tz-meta ${metaName}`);
  }
  const meta = metas[metaName] || {};
  let dst = null;
  if (zones[id].dst && meta.dst) {
    let [abbr, offset, name] = meta.dst;
    name = name || `${metaName} Daylight Time`;
    const [start, end] = zones[id].dst || [];
    dst = { abbr, offset, name, start, end };
  }

  const [abbr, offset, standardName] = meta.std;
  const name = meta.name || `${metaName} Time`;
  const long = meta.long || `(${formatOffset(offset)}) ${name}`;
  return {
    name: name,
    iana: id,
    standard: { abbr, offset, name: standardName || meta.name || `${metaName} Standard Time` },
    daylight: dst || null,
    long: long,
  }
};

// Generated by scripts/version.js.
var version = '1.5.2';

const soft = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('timezone-soft expects a string')
  }
  let ids = find(str) || [];
  if (typeof ids === 'string') {
    ids = [ids];
  }
  ids = [...new Set(ids.map(canonicalize))].filter(id => Object.hasOwn(zones, id));
  ids = ids.map(id => display(id));
  return ids
};
soft.version = version;
soft.prototype.version = version; // retain compatibility with earlier releases

module.exports = soft;
