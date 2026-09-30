/*! spencermountain/timezone-soft 1.6.0 MIT */
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

// Generated by scripts/build/01-pack.js. Edit data/ instead.
var pcked = {"Africa":{"Abidjan":["true¦a5bouake,coordinated universal4daloa,g1san ped0utc,yamoussouk0zulu;ro;h0mt,reenwich mean2;!a0;!na; ti3;b4frica0tlantic/st_helena;!/0;accra,ba1conakry,dakar,freetown,lo0nouakchott,ouagadougou,timbuktu;me;mako,njul;idjan,obo","Greenwich Mean"],"Algiers":["true¦:a4enitnatsnoc,f3na2rauozze b5s1te0zd;c,rait;adremuob,ebba leb idis,rei4;eporue lartnec,ro;elhc,ites;banna,cirfa,dilb,ire1nt0rksib,ssebet,zd;ab;gla","Central European"],"Bissau":["true¦africa,b2coordinated universal1g0utc,zulu;mt,nb,reenwich mean0uinea b1w; time;issau","Greenwich Mean"],"Cairo":["true¦:a8dias trop,fyawus inab,g7harusna9m6na4oriac3r2t0ukdi,y1zeus;ee,py0uysa;ge;awwad da rfak,oxul,uhnamad;! wen;eporue nretsae,w0;lah,sa;uyyaf 4wak la nibihs;ahos,e,izagaz;cirfa,i1niq,rbuk la hallaha0tnat,yni0zig;m 1;liamsi,rdnaxe0;la","Eastern European","egypt"],"Casablanca":["true¦aCcasablanDfBkenitAm6oujda angad,rabat,sa4t1we0;stern europe2t;angier,e0;ma7tou0;an;fi,le0;! al jadida;a1ekn4o0;hammedia,rocco;!r0;!rakesh;ra;es;fri0gadir,l hoceima;ca","Morocco Standard"],"Ceuta":["true¦africa,brussels,c0europe central,madrid,paris,romance;e0openhagen;ntral european,t,uta0;!melilla","Central European","eu2"],"El_Aaiun":["true¦afri3casablan3e2laayoune,morocco,we0;stern 0t;european,sahara;h,l_aaiun,sh;ca","Morocco Standard"],"Johannesburg":["true¦!1:#$%&()*:er,africa,ar,an,ast,on,et;$IbEcAd9e( l)dBh%%e,joh&nesHk7newc(Dp6r5s3tembisa,uitenhage,v2w1za0;!f;elkom,itb&k;&d#bijlp%k,#eeniging;(,o0prings;uth $,w*o;&dBich%ds bay,oodepoort;a%l,i*#m%itzAort elizab*h,r*oria;l#k0rug#0;sdorp;iepsloot,urb5;a1enturi0;);pe town,rl*)vil0;le;en)i,loemf)tein,o1rakp0;&;ks0tshabelo;burg;! south#n,/m0;as#u,bab&e","South Africa"],"Juba":["true¦a3c2juba,s0winejok;outh sudan,s0;!d;at,entral a0;frica","Central Africa"],"Khartoum":["true¦:a7d5firadaq la,i4muotrahk,n0rehsaf6tac;a1ds,i0;ead4zamad da;dus0mrudmo;! trop;nadem daw,tsok;iebo0s; le;cirfa1gnis,la0;ssak,yn;! lartnec","Central Africa"],"Lagos":["true¦!1:#$%&(:ala,or,ha,frica,an;aVbTcReQgPiLjKkaIlGmDnnewi,oAp$t %rcourt,s9u7w0zar8; c3a2est0; 0ern3;a3c1;rBst,t;entral0; a0;&;gep,muah0yo;ia;a7%gamu,okoto;kDn1w0yo;er3o;do,its%;a0in5ubi;idugu0kurdi;ri;agos,ek0;ki;du0no,tsi0;na;imeLos;bad(,jebu ode,k1l0seHwo;a $(gun,eD$in;eHi8ot ekp0;ene;ombe,usau;bute ik$odu,fon #aye,nugu;#bar,d,%kwama,o0;d,ngo;auchi,enin0;! city;b8do7&1ku0t(i;re;! western,/0;b2dou#,kins%1l0m#bo,niamey,p$to-novo;ibre2u(da;sa;(gui,razza0;ville; ekiti;a,eoku1u0;ja;ta","West Africa"],"Maputo":["true¦africa7beiCc6ma4na2quelimaAwindhoek,z0;imbabwe,w0;!e;ca2m0;ibia,pu1;puto,to0;la;at,entral africa,himoio;! central,/0;b2gaboro1hara4kigali,lu0;bumbashi,saka;ne;lanty1ujumbu0;ra;re","Central Africa"],"Monrovia":["true¦africa,coordinated universal3g2l0monrov1utc,zulu;br,iber0r;ia;mt,reenwich mean0; time","Greenwich Mean"],"Nairobi":["true¦africa8e4indian/2kisumu,m1na0thika,yt;irobi,kuru;a1ombasa,yt;antananarivo,comoro,ma0;yotte; 2a0ldoret;st0t; 0ern 0;africa;! eastern,/0;a1d0kampala,mogadishu;ar_es_salaam,jibouti;ddis_ababa,sm0;a0e0;ra","East Africa"],"Ndjamena":["true¦:a2d1nretsew acirfa,t0;aw,saw;ahc,ct,t;cirfa1nemajd0;'n,n;! 0;lartnec 0nret1t1;t0w;sew","West Africa"],"Sao_Tome":["true¦:acirfa,ctu,em1pts,t0uluz;mg,s;it 2ot0; 0_0;oas;lasrevinu detanidrooc,naem hciwneerg","Greenwich Mean"],"Tripoli":["true¦a4benghazi,e3l1misrat5t0zawi2;arhuna,ripoli;by,ib0y;ya;astern european,et;frica,l khums,z zawiy0;ah","Eastern European"],"Tunis":["true¦africa,ce3sfax,t0;n,un0;!is0;!ia;ntral european,t","Central European"],"Windhoek":["true¦africa3c2na0windhoek;!m0;!ibia;at,entral africa;! central","Central Africa"]},"America":{"Adak":["true¦a1h0nwt,us/aleutian;awaii s3dt,st;dak,leutian0merica/atka;! 0;islands,s0;tandard time","Aleutian Standard","usa"],"Anchorage":["true¦a0us/alaska;h6k5laska0merica,nchorage;! 1n0;! s1;s0t1;tandard t0;ime;dt,st,t;dt,st","Alaska","usa"],"Araguaina":["true¦!1:#: south ameri;araguaina,br1e0palmas,tocantins;#ca s4ast#ca;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Argentina/Buenos_Aires":["true¦:anitnegra1gra,ra,seria0; soneub,_soneub/1;!/0;acirema","Argentina"],"Argentina/Catamarca":["true¦a0c2;merica/0rgentina;argentina/comodrivadavia,c0;atamarca","Argentina"],"Argentina/Cordoba":["true¦a0c2;merica/0rgentina;c0rosario;ordoba","Argentina"],"Argentina/Jujuy":["true¦a0j1;merica/j0rgentina;ujuy","Argentina"],"Argentina/La_Rioja":["true¦ar1b0city of b0la rioja;uenos aires;gentina0st,t;! 0;standard t0t0;ime","Argentina"],"Argentina/Mendoza":["true¦a0m1;merica/m0rgentina;endoza","Argentina"],"Argentina/Rio_Gallegos":["true¦ar1b0city of b0rio_gallegos;uenos aires;gentina0st,t;! 0;standard t0t0;ime","Argentina"],"Argentina/Salta":["true¦ar1b0city of b0salta;uenos aires;gentina0st,t;! 0;standard t0t0;ime","Argentina"],"Argentina/San_Juan":["true¦ar1b0city of b0san juan;uenos aires;gentina0st,t;! time","Argentina"],"Argentina/San_Luis":["true¦ar1b0city of b0san luis;uenos aires;gentina0st,t;! time","Argentina"],"Argentina/Tucuman":["true¦ar1b0city of b0tucuman;uenos aires;gentina0st,t;! time","Argentina"],"Argentina/Ushuaia":["true¦ar1b0city of b0ushuaia;uenos aires;gentina0st,t;! time","Argentina"],"Asuncion":["true¦asuncion,c3p0san lorenzo;araguay1ry,y0;!st,t;! time;apiata,iudad del este","Paraguay"],"Bahia":["true¦!1:#: south ameri;b2camacari,e1feira de santa0itabu0salvador,vitoria da conquista;na;#ca s5ast#ca;ahia,r0;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Bahia_Banderas":["true¦bah7c2guadalajara,m0;exico0onterrey;! city;entral 0st;mexic0standard 2;an,o0;! 0;time;ia_0ía de 0;banderas","Central Mexico"],"Barbados":["true¦a1b0;arbados,b,rb;st,tlantic standard time","Atlantic"],"Belem":["true¦:!1:#$:cirema htuos, tsae;a3emit 1liza5meleb,sabepaua0t5ápama$ á0;rap;ai2dradnats a0;# e,i1;#$,i0pacam,uedninana;lisa0;rb","Brasilia"],"Belize":["true¦b1c0;entral standard time,st;elize,lz,z","Central"],"Boa_Vista":["true¦:a5emit 0l4n1t3;dradnats n0no1;ail2o0;za0;ma;izarb lartnec;baiuc,miaror,tsiv aob","Amazon"],"Bogota":["true¦!1:#$%&:an,ar,en,ll;$m%GbBc7dosquebradas,floridabl#ca,i6m5neiva,p3s1v0;a&edup$,i&avic%cio;#ta m$Cincelejo,o0;acha,ledad;a0erei9opay#;lmi8sto;#izales,ede&in,onterA;bague,taguei;a2o0ucu6;!l0st,t;!omb6;li,rtag%a;$r#3e&o,ogo2u0;c$am#ga,%av%tu0;ra;ta;cabermeja,qui&a;ia","Colombia"],"Boise":["true¦america4boise,idaho,m0;ountain0pt,st,t;! 0;id,standard t0t0;ime;! mountain","Mountain","usa"],"Cambridge_Bay":["true¦america4cambridge bay,m0;ddt,ountain0st,t;! 0;standard t0t0;ime;! mountain","Mountain","usa"],"Campo_Grande":["true¦am0brazil,campo grande,mato grosso do sul;azon standard time,t","Amazon"],"Cancun":["true¦cancun,e0mexico,quintana roo;astern standard time,st","Eastern"],"Caracas":["true¦alto barinKbarJcDguaBm8p7san6turmeFv0;alencia,e0;!n0t;!ezuela0;! 0n;standard t0t0;ime; cristobal,ta teresa del tuy;eta4uerto la cruz;a0ucumpiz;raca0turin;ibo,y;ren8ti0;re;a4iudad 2o1u0;a,m2;ro;bolivar,guay0;ana;bim1rac1;in0quisimeto,uta;as","Venezuela"],"Cayenne":["true¦cayenne,french guiana3g0;f1u0;f,iana;!t;! time","French Guiana"],"Chicago":["true¦!2;:!1:#$%&():na,uo,ra,ro,artnec,ni;aTd#l%g,eOg)vri,ht&w t&f,iMkJlEnAo9s2t0x7yremogtnS;c,dc0&peverhs,sc;!\\gtsc;a3e)om sed,i0#el&2;hpmem0lopaSo)lli,$lB;! ht$s0; wW;llad,s#k1x0;et;!%;de%l,gacihc,inot# n7lli%U#lp;i2locnAo0;sidam,t0;g)l%,s$h;snocsLtsua;(3uap0; t0;)0s;as;! acK/su;co0%p d#lrevo;bbul,r eltt0;il;ppissi0r$0tsirhc sup&c;ss9;ekuawl8g$r notab,iriarp d#rg,l0mit l(;ib2liv0;hsan,s0;nworb,tnuh;om;c9hamo,ksarb8m7#isi$l,s6t0woi;ihc4o0;kad ht2s0;enn0;im;&n,$s;iw;lut,u;abala,ohalko;en;ire0;ma","Central","usa"],"Chihuahua":["true¦!1:#$%: pacific,exic, time;chihuahua,h5la paz,m0;azatlan,$1ountain 0;m$o,standard% (m$o);an#1o0;!#;!%;ep0np0p0;mx","Central Mexico"],"Ciudad_Juarez":["true¦america/ciudad_jua1ciudad ju0ju0;a0á0;rez","Mountain","usa"],"Coyhaique":["true¦a1co0;i2y2;merica/coy1ys0;en,én;haique","Aysen"],"Costa_Rica":["true¦c0sjmt;entral standard time,osta rica,r0st;!i","Central"],"Cuiaba":["true¦am0brazil,cuiaba,mato grosso,varzea grande;azon standard time,t","Amazon"],"Danmarkshavn":["true¦coordinated universal2d1g0utc,zulu;mt,reenwich mean1;anmarkshavn,enmark; time","Greenwich Mean"],"Dawson":["true¦canada,dawson,m2y0;d0pt,wt;dt,t;ountain standard time,st","Mountain"],"Dawson_Creek":["true¦canada,dawson creek,m1p0;pt,wt;ountain standard time,st,t","Mountain"],"Denver":["true¦!2;a6colorado springs,denver,el paso,m1navajo,salt lake,us0;/7a;dt,ountain1st0t;!\\hmdt;! 0;standard t0t0;ime;lbuquerque,merica0urora;! 0/shiprock;mountain","Mountain","usa"],"Detroit":["true¦america4detroit,e0grand rapids,us/michigan;astern0pt,st,t,wt;! 0;mi,standard t0t0;ime;! eastern","Eastern","usa"],"Edmonton":["true¦a6ca4edmonton,m0;ountain0st,t;! 0;standard t0t0;ime;lgary,nada0;!/1;lberta,merica 0;mountain","Alberta and Northwest Territories"],"Eirunepe":["true¦a0brazil,eirunepe;c0mazonas west;re0t;! 0;standard t0t0;ime","Acre"],"El_Salvador":["true¦c2el1s0;an0lv,oyapango,v; salvador;entral standard time,st","Central"],"Fort_Nelson":["true¦british columbia,canada,fort nelson,m0;ountain standard time,st,t","Mountain"],"Fortaleza":["true¦!1:#$: south ameri,ca;br5$4e3fortaleza,imperatriz,j2m0natal,sao luis,teresina;a0ossoro;picernpb,ra$nau;oao pessoa,uazeiro do norte;#$ s5ast#$;mpina grande,u$ia;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Glace_Bay":["true¦:adan3c2emit 1noterb ep3t0yab_ecalg;a,sa;c0dradnats c0;itnalta;ac","Atlantic","usa"],"Goose_Bay":["true¦:adanac,c2emit 1rodarbal,t0yab_esoog;a,pn,sa;c0dradnats c0;itnalta","Atlantic","usa"],"Grand_Turk":["true¦america eastern,e2grand turk,kmt,t0;c0urks and caicos;!a;astern0st,t;! 0;standard t0t0;ime","Eastern","usa"],"Guatemala":["true¦c2g0mixco,villa nueva;t0uatemala;!m;entral standard time,st","Central"],"Guayaquil":["true¦cuenca,ec2guayaquil,ma1q0santo domingo de los colorados;mt,uito;chala,nta;!t,u0;!ador0;! 0;mainland,time","Ecuador"],"Guyana":["true¦g0;eorgetown,uy1y0;!t;!ana0;! time","Guyana"],"Halifax":["true¦a4ca2halifax,n1p0;ei,rince edward island;ew brunswick,ova scotia;!nada0;!/atlantic;dt,st,t0;!lantic0;! 0;ns,standard t0t0;ime","Atlantic","usa"],"Havana":["true¦:a9b8e6niugloh,o4s1uc0yeugamac;!eh,h,nh;anut sal,o0;geufneic0reyob;! olimac daduic;ir led ranip,jnaran oyorra,ma0;natnaug,yab;mit 0rbutco ed zeid;ab0dradnats ab0;uc;buc0navah,ralc a1;! ed ogai0;tnas","Cuba","cuba"],"Hermosillo":["true¦ciudad obregon,h1mexic0nogales,sonora;an pacific standard time,o;ermosillo,npmx","Mexican Pacific"],"Indiana/Indianapolis":["true¦america2crawford,dadukmn,eastern in,i4p0star1us/east-indiana;erry,i0ulaski;ke;!/0;fort_wayne,i0;ndiana0;!polis","Eastern","usa"],"Indiana/Knox":["true¦america1c0indiana,knox,us/indiana-starke;entral standard time,st;!/knox_in","Central","usa"],"Indiana/Marengo":["true¦america,e0indiana,marengo;astern standard time,st","Eastern","usa"],"Indiana/Petersburg":["true¦america,e0indiana,petersburg;astern standard time,st","Eastern","usa"],"Indiana/Tell_City":["true¦america,c0indiana,tell_city;entral standard time,st","Central","usa"],"Indiana/Vevay":["true¦america,e0indiana,vevay;astern standard time,st","Eastern","usa"],"Indiana/Vincennes":["true¦america,e0indiana,vincennes;astern standard time,st","Eastern","usa"],"Indiana/Winamac":["true¦america,e0indiana,winamac;astern standard time,st","Eastern","usa"],"Inuvik":["true¦america mountain,canada,inuvik,m0pddt;ountain0st,t;! 0;standard t0t0;ime","Alberta and Northwest Territories"],"Iqaluit":["true¦america eastern,canada,e0iqaluit;astern0ddt,st,t;! 0;standard t0t0;ime","Eastern","usa"],"Jamaica":["true¦e3j1k0new k0;ingston;am0m;!aica;astern standard time,st","Eastern"],"Juneau":["true¦a0juneau;k5laska0merica;! 1n0;! s1;juneau area,s0t1;tandard t0;ime;st,t","Alaska","usa"],"Kentucky/Louisville":["true¦:a3e1yk0; nretsae,cutnek1;llivsiuol0nyaw;!/a0;cirema","Eastern","usa"],"Kentucky/Monticello":["true¦america,e0kentucky,monticello;astern standard time,st","Eastern","usa"],"La_Paz":["true¦bo1cochabamba,la paz,oruro,s0;anta cruz de la sierra,ucre;!l0t;!ivia0;! time","Bolivia"],"Lima":["true¦:a9e5o1r8s0t8ur8;otiuqi,ucif sol atina a3;allac,c1llijurt,ya0;cnauh,lc3;rus ed ogai0suc;tnas;mit 1p,tobm0;ihc;dradnats ur0ur0;ep;c1mil,ncat,p0ruip;iuqera,llacup;ailuj,i","Peru"],"Los_Angeles":["true¦!2;:!1:#$%&(:na,gn,ro,ir,dra;aScificapRdPeGfs,hcaeb Eilac,mieha#,nBo6%#m es&nus,s3t1yellav 0;$&Joner7;dp0nom8p,sp;!\\itsp;agev sal1eleg#0; sA_sA;! ht%n;csic#6geidBn2t0;nemarcOsed0;om;er,i(nreb8s0;erf;a1o0;ge%,sredneh,tkcots;rf4;$0not$itnuh;ol;dis7lttaes,mit 4n2s0tats not$ihsaw,vorg ne(g;idar5oj0; nD;ako0ivri;ps;c0(d#ts c0;ific0;ap;#eco,rev&;leifsrek8#l0ranxo;kao,t%p;! ac7/su;c6daven,$omacuc ohc#r,in%filac4l,mocat,#1su,t0;&alc 1siv aluhc; 0tnof;atn0;as;! aj0;ab;&ema","Pacific","usa"],"Maceio":["true¦!1:#: south ameri;a6br1e0maceio;#ca s3ast#ca;asilia0t;! 0;s0t1;tandard t0;ime;lagoassergipe,racaju","Brasilia"],"Managua":["true¦c3man2ni0;!c0;!ar0;agua;entral standard time,st","Central"],"Manaus":["true¦am4brazil3c0manaus;entral brazil0uiaba;!ian0;! s5;!/we2;azon0t;! 1as ea0;st;s0t1;tandard t0;ime","Amazon"],"Martinique":["true¦a3f1m0;a1q,tq;fmt,ort de france,rench ma0;rtinique;st,tlantic standard time","Atlantic"],"Matamoros":["true¦america central,c2heroica ma1m0nuevo laredo,reynosa;a0exico;tamoros;entral0st,t;! 0;standard t0t0;ime","Central","usa"],"Mazatlan":["true¦:!1:#$%&:cixem,dradnats ,ficap ,emit ;)o#( &$7auhauhihc,ci5&3na2o#1rusajab/o6sihcom sol,xmp0zap al;h,nh;! 5;cailuc,ltazam;c0$c0;i%na1;%o0pet;#;niatnuom","Mexican Pacific"],"Menominee":["true¦america4c0menominee,wisconsin;entral0st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Merida":["true¦c3guadalajara,m0;e0onterrey;rida,xico0;! city;ampeche4entral 0st;mexic0standard 2;an,o0;! 0;time;!yucatán","Central Mexico"],"Metlakatla":["true¦a0metlakatla;k5laska0merica;! 1n0;! s1;annette island,s0t1;tandard t0;ime;st,t","Alaska","usa"],"Mexico_City":["true¦!1:#$%&()*+-.<=>?@[]^`:al, de,an,ca,la,pa,co,o ,ta,ue,re,ma,ua,ch,er,te,os,en,za;a0Lb0JcYdur%go,e&[pec$ mo<l],guThSiQj#is*,leon$ l] #da=,mInHoGpEqDs9t4ur>p%,v2x1yu&t%,`0;&[&s,pop%;#a)$ ^riq.z,i*,o?imil*;e0il(h@m]a;nusti%+&rr%`,racruz;a3e7(1o0uxt(;luUn#a;h>c,l0q.)q.,xc#a;nep%t(,pW;bas*,=uli)s,)?uZ;%0oledad$ graci%+s%?ez; luis pot]i,t0;a =ria ?im#0iago$ q1;huQ;.<-G;a?u&$ soIo` ri&$7.0;bSrt+v#(r-;axaJjo$ ag>;auc#p%07i*(s romeC.v+leon;agd#^a *nt<rUex4i2o0x;nt@<y,<l0;ia,];?oHg.l0; h5;!i*0;! 0/g^@#,_0;city;rap5x-p#u9z-0;cUp#a);id#J;a1@<0s-v+adolf+=de0;ro;d#ajara,naj0;>0;to;ampe?e,eFhiCiudad Ao3st,u0wt;au1@nava0;&;h[moc,titl% izc#li;a4l2yo0;ac0;%;i0onia$l v#le;=;cEhui0t`*#c2;(;lopez =[0ne`hu#*yotl;];ap1lp%cin0;go;as;(ya,ntr# 0;mexic0st%dard 2;%,o0;! 0;time;^ito6.navis0;-;&pul*3g>sc#i^[s,lvar+ob<g2z&potz0;#0;*;on;$0; j>r0;ez","Central Mexico"],"Miquelon":["true¦!1:#$:ierre,iquelon;hBmAp8s0;aint p#2pm,t p# 0;& m$ 0a5;s2t3;! 0;a2s0;tandard t0;ime;nd1;#0m; m0;$;npm,pm","St. Pierre & Miquelon","usa"],"Moncton":["true¦a0canada,hepm,moncton,new brunswick;st,t0;!lantic0;! 0;standard t0t0;ime","Atlantic","usa"],"Monterrey":["true¦!1:#$:victoria,ico;c8g6m3sa1t0# de durango;amp$,orreon;ltillo,n0; n$las de los garza,ta catarina;ex$1on0;clova,terrey;! city;omez palacio,uadal0;ajara,upe;entral 1iudad 0st;apodaca,general escobedo,madero,#;mexic0standard 2;an,o0;! 0;time","Central Mexico"],"Montevideo":["true¦montevideo5u0;r1y0;!st,t;uguay0y;! 0;s1t2;! s0;tandard t0;ime","Uruguay"],"New_York":["true¦!2;:!1:#$%&()*+-.<=:ts,ni,re,ro,et,al,no,ne,or,ae,ih,el;a0Cc0Adn05eRgrubs%tep #,hPiNkKlJmInBo8%#e7s4t2x*rb eht,y0;es%j0kcut+k,n,ticU;! V;de0e,*m%v,se,ucitcenn3;!\\f#e;d.m,(a# d(inu,+e4%k*y,ttesuhcassam,u0wen t&pS;!bmul0;oc;c&w,hc-;d1<o,laffub,- anat$0&bs+erg;uq;=ot,n)&;a5o1%#.0ylko-b;! ac09/su;rka,t0;g$1sob0;! htuos;hUxD;g<c6ttahnP;ahrud,=as *#$w;a&c epac,f;lofrWr0;aBoy0; A_A;ma0tan$c$c;im;.la<,c.b ai$griv,g0subt)f A;i=arTrubsttip;c+div-p,essCk.paseTl9mit 6$Fr4t0;a#2t0;eyaf *tg$x0olraR;=; k&y 1;aw)ed,<spmah 0omitlab;wen;dradna# n0n0;%0;#.;ad%du) t&f,liv0;(teyaf,*0xonk;ri,skcaj;ah)l8enn(;)0omhcir;ev=c,si 1yr0;am;edohr,n(a0;#;d *tg$h0yn;saw;c9di&lf,goonatta8i5n1pm0su,tn)ta;at;aid$,il-ac ht0;r1u0;os;on;g&eg,hpled)<p,n0;avlysn+p,igriv0;! #ew;hc;i%ma","Eastern","usa"],"Nipigon":["true¦america eastern,canada,e0nipigon;astern0st,t;! 0;standard t0t0;ime","Eastern","usa"],"Nome":["true¦a0no5;k5laska0merica;! 1n0;! s1;s0ti1west;tandard ti0;me;st,t","Alaska","usa"],"Noronha":["true¦atlantic islands,brazil3f0n4;ernando de noronha 0nt;standard t0t0;ime;!/den0;oronha","Fernando de Noronha"],"North_Dakota/Beulah":["true¦america,beulah,c0north dakota;entral standard time,st","Central","usa"],"North_Dakota/Center":["true¦:a2emit dradnats lart1re0tsc;crem,t0vilo;nec;cirema,tokad htron","Central","usa"],"North_Dakota/New_Salem":["true¦america,c1n0;ew_salem,orth dakota;entral standard time,st","Central","usa"],"Nuuk":["true¦america3g1nuuk,wg0;st,t;l,r0;eenland,l;!/godthab","West Greenland","green"],"Ojinaga":["true¦america4c0ojinaga;entral0hihuahua,st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Panama":["true¦:a4emit dradnats nretsae,h laroc,na0otileugim nas,ruobrah_laro1tse;kokita1mya0p;c/1;!/0;acirema;manap,p","Eastern"],"Pangnirtung":["true¦a4baffin island,canada,e0nunavit,pangnirtung;astern0st,t;! 0;standard t0t0;ime;ddt,merica eastern","Eastern","usa"],"Paramaribo":["true¦paramaribo,s0;r2ur0;!iname0;! time;!t","Suriname"],"Phoenix":["true¦!2;:a6e3gnimoyw,hatu,no2o1reldna7t0xineohp;dm\\htsm,irayan,m,reblig,sm,wm;cixem wen,daroloc,hadi;scut,tserc/ac8;la0mit dradnats niatnu6pmet;d0vyram;nelg,sttocs;c4n1olanis,ronos,sem,uhauhi0;hc;atn1ozira0;!/su;om;irema","Mountain"],"Port-au-Prince":["true¦:e3it2nretsae1ruoferrac,steuquob sed xiorc,t0xiap ed 7;e,h,se;! acirema;h,iah;cnirp2llivnoitep,mit 0;dradnats n0n0;retsae; ua 0-ua-0;trop","Eastern","usa"],"Porto_Velho":["true¦:a8emit 3lizarb2n4ohlev0t6; 0_0;otrop;! 4;dradnats n0no1;ailizarb 2o0;za0;ma;lartnec;baiuc,inôdnor","Amazon"],"Puerto_Rico":["true¦a2bayam9p0;r0uerto rico;!i;merica0st,tlantic standard time;!/0;a5blanc-sabl4curacao,dominica,g3kralendijk,lower_princes,m2port_of_spa1st_0torto7virg1;barthelemy,kitts,lucia,thomas,vincent;in;arigot,ontserrat;renada,uadeloupe;on;n0ruba;guil0tigua;la","Atlantic"],"Punta_Arenas":["true¦c0punta arenas,region of magallanes;hile0lt;! standard time","Magallanes"],"Rainy_River":["true¦america4c0ft frances,rainy river;entral0st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Rankin_Inlet":["true¦america4c0rankin inlet;ddt,entral0st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Recife":["true¦:!1:#$%: htuos ,cirema,ra;a4emit 2liza7o0sepa%%ug sod oa1t7u%u%c;a0cubmanr4;taobaj;ai3d%dnats a0;$#e,i2;$3dnilo,i1nilort0tsiluap;ep;lisa0;rb;!#tsae","Brasilia"],"Regina":["true¦c2regina,s0;askat0k;c2oon;anada0entral standard time,st;!/saskatc0;hewan","Central"],"Resolute":["true¦america4c0resolute;entral0st,t;! 0;standard t0t0;ime;! central","Central","usa"],"Rio_Branco":["true¦a1brazil0rio branco;!/1;c1merica/porto_0;acre;re0t;! 0;standard t0t0;ime","Acre"],"Santarem":["true¦!1:#: south ameri;br1e0pará west,santarem;#ca s4ast#ca;a0t;silia0zil;! 0;s0t1;tandard t0;ime","Brasilia"],"Santiago":["true¦aAc4iquique,la pintana,puente alto,rancagua,san3t1v0;alparaiso,ina del mar;alca0emuco;!huano; bernardo,tiago;h1l0oncepcion;!st,t;ile0l;! 0/continental;standard t0t0;ime;ntofagasta,rica","Chile","chile"],"Santo_Domingo":["true¦a8bella vista,do6la romana,s0;an0dmt; pedro de macoris,t0;iago de los caballeros,o domingo0;! 0;e0oe0;ste;!m0;!inican republic;st,tlantic standard time","Atlantic"],"Sao_Paulo":["true¦:!1:#$%&()*+-.<=>: o,d ,irema htuos ,na, e,ra,ir,re,ac,ro,at, s,ai;0:14;a0BeUiRlQmOoHrb,s5t3u1;anemulb,bme,caugi 1ruR;aKo$zof;rb,s1;ae/liz0Prb;a8e5ilop2o1;hl0El)cUpm-=D)lc=etn6t&s;a&,o1;n1rt6;a*olf,ivid;)dalav .dan+vog,ven=ad#aAz1;-<yog=o$so5urc=a$ig1;om;ix-($euqud,ni3o2tol1;ep;gal(tes,n0;pm0;am>v,csaso,d6grubmah#5*,luapJ&zLpm-#d#d)n+bJr4terp#1xor d.flG;a2* 1;o$esG;riebP;alcMie&j(dM;von;lopoelDnuf#ssap;eg<nYi1;rimep<i(d#rieohc0t8;ev-s0iz03us#$s>x0;a2e)caj,o+tin,+ur1t*em(d#a8vep0B;ab;idnN.b09tavarg;dCllivnioj,mit 9r7s5t1;abuKn1seo'$a)b)bT;e2oz*oh#l1;eb;civ2durp(tnediseC;oj1;#Q;am1d&#Ogela#trB;us;>2d)d&ts a1;c%e,i1;lisO;&rg 2+v1;#2;>a2o1;*;rp;bPcOdNgniLhlev alKiAj9meda8n6r2ssorg <n1uM;op;b,iemil,of($zi3+s1;! ad#aob1;<;uj;-*ema,i1;rdnol,tla&lp;id;u)ug;d&l9li7&iog6r2t1zul3;oc;am1ot8; a1;tn1;as;!($adice)pa;r5s1;arb;ot.h,rC;iv;r1tapi;am;a.vla,noder <lov;%tsae,&rf;a5i3ut1;>adni,eceuqauq1;<i;t*uc,ucipar0;-;c2r1;ebu;icarip,o.s","Brasilia"],"Scoresbysund":["true¦!1:#:greenland;e3#2h0ittoqqortoormiit,scoresbysund;e0neg;eg,g;! eastern;ast #1g0;st,t;! 0;standard t0t0;ime","East Greenland","green"],"Sitka":["true¦a0sitka;k6laska0merica;! 1n0;! st2;s0t2;itka area,t0;andard t0;ime;st,t","Alaska","usa"],"St_Johns":["true¦!1:#:ewfoundland;canada7h5n0st johns;d3#0st,t;! 0;labrador,standard t0t0;ime;dt,t;e0n0tn;tn;!/n#","Newfoundland","usa"],"Swift_Current":["true¦c1s0;askatchewan,wift current;anada,entral standard time,st","Central"],"Tegucigalpa":["true¦c2h0san pedro sula,tegucigalpa;n0onduras;!d;entral standard time,st","Central"],"Thule":["true¦a0pituffik,thule;st,t0;!lantic0;! 0;standard t0t0;ime","Atlantic","usa"],"Thunder_Bay":["true¦canada,e0thunder bay;astern0st,t;! time","Eastern","usa"],"Tijuana":["true¦america8baja california,eAh6mexic4p0tijuana;acific0st,t;! 0;standard t0t0;ime;ali,o0;!/bajanorte;e0n0;nomx; pacific,/0;e0santa_isabel;nsenada","Pacific","usa"],"Toronto":["true¦:aHcebeuq,eEl9mahkram,n5o3r2t1ua0;enitag,ssan/C;e,se;enehctik,osdniw;iratno0tnorot;! nod5;a2ot1retsae0;! 6/adC;limah,pmarb;c,epen,hguav;a1iueug0lih dnomhcir;nol;ertnom0val;!/0;acirema;irrab,mit 0;dradnats n0n0;retsae;c,d1guassissim,wa0;hso,tto;anac","Eastern","usa"],"Vancouver":["true¦america 9b7ca5ladn4okanagan,p1surrey,v0yukon;ancouv3ictor7;acific0st,t;! 0;bc,standard time;er;!nada0;!/2;ritish columb0urnaby;ia;pacific","British Columbia"],"Whitehorse":["true¦canada1m0whitehorse,yst;ountain standard time,st;!/yukon","Mountain"],"Winnipeg":["true¦america 7c2m1w0;est m0innipeg;anitoba;anada3entral0st,t;! 0;standard t0t0;ime;!/0;central","Manitoba"],"Yakutat":["true¦a0y4;k6laska0merica;! 1n0;! s2;s1t2y0;akutat;tandard t0;ime;st,t","Alaska","usa"],"Yellowknife":["true¦america mountain,canada,m0yellowknife;ountain0st,t;! 0;standard t0t0;ime","Mountain","usa"]},"Antarctica":{"Palmer":["true¦antarctica/p0p0;almer","Palmer"],"Casey":["true¦antarctica,cas0;ey,t","Casey"],"Davis":["true¦a1dav0;is,t;ntarctica,q,ta","Davis"],"Macquarie":["true¦!1:#$%:east,tralia,ern;a2canberra,#% aus$6m0sydney;acquarie0elbourne;! island;e4ntarctica,us0; #0$ #%;!%0;! standard0; time;st,t","Eastern Australia","aus"],"Mawson":["true¦antarctica,maw0;son,t","Mawson"],"Rothera":["true¦a1b0city of b0rothera;uenos aires;ntarctica1r0;gentina,st,t;!/palmer","Argentina"],"Troll":["true¦:acitcratna,emit 0l1noitats hcraeser l1tmg;l0naem hciwneerg;lort","Troll","troll"],"Vostok":["true¦!2;antarctica,msk+\\e,vost0;!ok","Vostok"]},"Asia":{"Urumqi":["true¦:emit gnaijnix,i0raghsak3;hcmuru,q0;m0umuluw;uru0ürü;!/aisa","Xinjiang"],"Almaty":["true¦a6central asia,east kazakhstan time,k2nur sultan,p1s0taraz,ust kamenogorsk;emey,hymkent;avlodar,etropavl;a0z;ragandy,z0;!akhstan0;! eastern;lm1s0;ia,tana;a0t; ata,ty","East Kazakhstan"],"Amman":["true¦a2eet,irbid,jo0russeifa,wadi as sir,zarqa;!r0;!d1;mm0sia;an","Jordan"],"Anadyr":["true¦a0petropavlovsk kamchatsky;na0sia;dyr0t;! time","Anadyr"],"Aqtau":["true¦!1:#$:kazakhstan,ta;a1# western,mangghys$ū/mankis3$shkent,west 0;asia,#5;lm2q1s0;hgabat,ia;$u;a0t; a$,-a$0; time","West Kazakhstan"],"Aqtobe":["true¦!1:#:kazakhstan;a1# western,tashkent,west 0;asia,#5;kto5lm2qt1s0;hgabat,ia;o3ö3;a0t; ata,-ata0; time;be","West Kazakhstan"],"Ashgabat":["true¦as4t0;km,m2urkmen0;a4istan0;! time;!st,t;hga1ia0;!/ashkhabad;bat","Turkmenistan"],"Atyrau":["true¦!1:#:kazakhstan;a1gur'yev,# western,tashkent,west 0;asia,#6;lm3s2t0;irau,yra0;u,ū;hgabat,ia;a0t; ata,-ata0; time","West Kazakhstan"],"Baghdad":["true¦a6ba5dihok,erbil,i3k2mosul,na1r0;amadi,iyadh;jaf,sirC;arbala,irkuk,uwait;q,r0;aq,q;ghdad,sr9;bu ghurayb,d diw6l 5rab1s0; sulaym5ia,t;!i0;a0c;!n0;! time;amar2basrah al qadim2falluj2hill2kut,mawsil al jadid2;an0;iy0;ah","Arabian"],"Baku":["true¦a0baku,ganja,lankaran,sumqayit;sia,z0;!e0t;!rbaijan0;! time","Azerbaijan"],"Bangkok":["true¦:a9e7gnohpi6hn5i1kokgnab,nakarp tumas,t0;ci,erk kap;a1naht nodu,on4rub0; no1ahtnon gnaeum;m gnai0y t2;hc;ep_monhp2id m5;ah;mit an2naitneiv0uh;/aisa;hcar is,isa2misahctar nohk1n0trakaj;ihcodni;an;! 0;es,tsae htuos","Indochina"],"Barnaul":["true¦a3b2kra0north a3;snoyarsk0t;! time;arnaul,iysk;sia","Krasnoyarsk"],"Beirut":["true¦asia,bei3e2l0ra's bay3;b0ebanon;!n;astern european time,et,urope eastern;rut","Eastern European","leb"],"Bishkek":["true¦asia,bishkek,k0osh;g2yrgy0;stan,zstan0;! time;!t,z","Kyrgyzstan"],"Brunei":["true¦asia,b0;dt,n2r0;n,unei0;! darussalam time;!t","Brunei Darussalam"],"Chita":["true¦asia,chita,yak0;t,utsk0;! time","Yakutsk"],"Choibalsan":["true¦as2choibalsan,dornodsükhbaatar,mongol2ula0;anbaatar0t;! time;ia","Ulaanbaatar"],"Colombo":["true¦as6c4dehiwala mount lavin6i2kolkata,lk1m0new delhi,sri lanka;oratuwa,umb4;!a;ndia0st;! time,n;henn0olombo;ai;ia","India"],"Damascus":["true¦a4d3eet,h2latak5sy0;!r0;!ia;am3oms;amascus,eir ez zor;leppo,r raqq1s0;ia;ah","Syria"],"Dhaka":["true¦asiaGbDcBd9jess8khul7mymensingh,na4pa3ra2s1t0;angail,ungi;aid8hib4ylhet;jshahi,ng7;b3ltan,r naogaon;gar5r0t3;ayan0singdi;ganj;na;ore;haka,inaj0;pur;hattogram,o0;milla,x's bazar;a0d,gd,ogra,st;gerhat,ngladesh0rishal;! time;!/dacca","Bangladesh"],"Dili":["true¦asia,dili,east timor1tl0;!s,t;! time","East Timor"],"Dubai":["true¦a5dubai,g3mus1om0ras al khaim2sharj2;!an,n;aff0c5;ah;st,ulf0;! time;bu dhabi,jm2rabi2sia0;!/musc0;at;an","Gulf"],"Dushanbe":["true¦asia,dushanbe,t0;ajikistan1j0;!k,t;! time","Tajikistan"],"Famagusta":["true¦asia,e0famagusta,northern cyprus;astern european time,et,urope eastern","Eastern European","eu3"],"Gaza":["true¦asia,eet,gaza2p0;alestine,s0;!e;! strip","Eastern European","pal"],"Hebron":["true¦asia,e0hebron,west bank;ast jerusalem,et","Eastern European","pal"],"Ho_Chi_Minh":["true¦asia7bien hoa,can tho,da 5ho3nha tr6qui nh8rach gia,sa dec,thi xa phu my,v0;ietnam1n0ung tau;!m;! south; chi minh0_chi_minh;! city;lat,n0;ang;!/saig0;on","Indochina"],"Hong_Kong":["true¦asia,h0kowloon,tsuen wan;k3ong0; kong1_k0k0;ong;! time;!g,st,t","Hong Kong"],"Hovd":["true¦as4bayan-ölgiigovi-altaihovduvszavkhan,hov2west0; 0ern 0;mongol2;d0t;! time;ia","Hovd"],"Irkutsk":["true¦a2brat3irk0north asia east,ulan ude;t,utsk0;! time;ngar0sia;sk","Irkutsk"],"Jakarta":["true¦:!1:#$%&(:enodni,gn,is,am,at;aObiw,di,emit a%# nreWgBheca Ei9ko8laget,m(Fn4o3r2t1u0;luk$9rabn5;(upVucr5;(na%$(&4ebmej,%$uelUogob;dnobut%,g$iloborp,trekowN;a0di,oberSretsew a%#,uid&;dem,$ol0;ak0;ep;lk$edsa$er,ped;ajnib,bmJh&NmubakIridek,sak0;eb;n0uruc;a3onibKu0;dn1pmal r0r6;adn0;ab;bmel6d5l2r0;&es,e$(0;! htuos;&1um0;ap;!ep;ap,em5;!ap;epma8%5rt&usav4traka1ya0;bar2l&k%(;j,r1w0ygoy;rup;us;aj;a,#0;! 0;tsew;ic","Western Indonesia"],"Jayapura":["true¦!1:#:indones;a2east1#ia eastern,jayapura,m0new guinea,wit;alukus,oluccas; #1ern #ia time;mbon,s0;ia","Eastern Indonesia"],"Jerusalem":["true¦as7beersheba,haifa,i2j0petah tiqwa,rishon leziyyon,tel 9west je1;e0mt;rusalem;d3l,s0;r0t;!ael0;! time;dt,t;hdod,ia0;!/tel_0;aviv","Israel","isr"],"Kabul":["true¦a1herat,jalalabad,ka0mazar e sharif;bul,ndahar;f0sia;!g0t;!hanistan0;! time","Afghanistan"],"Kamchatka":["true¦!1:#:kamchat;a2#ka,pet0;ropavlovsk0t; #sky,-#ski time;nadyr,sia","Petropavlovsk-Kamchatski"],"Karachi":["true¦!1:#$%&:ha,wal,ra,hi;asia,bLc&niKde% g#ziIfaisalHguj%GhyderHislamHj#ng sadr,kElaDm8nawabs#h,okaBp4quetta,%3s0;a1h0ialkJukkN;ahkIekhupu9;ddiqE&$,rgod#;&m yarE$pindi;ak1es#war,k0;!t;!istan0;! time;a3i1u0;lt9zaffar7;ngo0rpur k#s;%;lir cantonment,rd6;hore,rkana;a0otli;moke,%c&,s8;n5t;abad; kh0;an;ot;a1&mber,ure0;$a;#$p0ttag%m;ur","Pakistan"],"Kathmandu":["true¦asia3biratnagar,kath4n1p0;atan,okhara;epal,p0;!l,t;!/kat0;mandu","Nepal"],"Khandyga":["true¦asia,khandyga,yak0;t,utsk0;! time","Yakutsk"],"Kolkata":["true¦:!1:#$%&()*+-.<=>?@[]^_`~:na,ah,ra,ar,hs,dn,la,hc,ag,an,ru,gn,ta,ma,am,ok,ht,sa,ug,ir,aj;0:2K;1:3G;2:2T;3:2S;4:3B;5:2O;a29d1Ze1Qf`$s r$ib,g<d,h1Ii0Tk0Sl0Om0Gn0ArE^wed,t9u8wonkcul,y6;llier4r6;alleb,)umh0Dre+udup;@,gulum,mm5<*=eb;a7epsoh,[j2s6ureem;i,ls;j iol=3pin7r6s&4;~_,us;ap,os;aOeNh$sd#lMim(1oLu6yh=om;+i2kmut,p8ss`],t6yittov0Z;a6n_,>b?;ddorp,l;aDde(m5gaChBi9*8m&7#6p0WrP^lib,>%0;hrHjh$s,k,r$as,yg;!$4`(;b5ga0;a6#m;du,j,r;doj,k&og;n,r1S;g8h7jib,l6mh&b,t##,zrim;lub]uq,os;!l[;#rwon,<d;guas,i*wg;ub;mja,#kib;dHg.9h8kis,s7w6;d`$,(e#bu0*;ih,t`?;d#l5it1; CaAda1Bi9m7#d0Qr6s$lu,va0;affazum;a6`1;j,y(;hd#g,rs;g#g,nu?y,r6;ab,)e<s;ijavi(,<d$ab *l;ib,#ya0;a9i8o-7ud &h6;ed;e*m,l5<g;!~ju,+oc;]s6i)i,m$ddr4yl1;~2;a7elWu-l6;eb;)_Al9n>p8r6;a6up$t##vuri];b?t,ga#iziv;$kasiv,ili+@;l[,t2;@2m2;a7iocreg3o6_i)id,wazia;onrRs#^;g#%w,h6nr1po0vasu0;bmLpmi;atEcattuc,i(3;aSdR=3hOj#%kl$ci,lFnCrBsAt6;a6lM;h6pJv&?;aw_,i6%m1;.,#p;a#%v,#hj;pmip,_ilis;a7et,i6;hor;hb%p,wi0;aCbuh,eAg8*p7u&=is,vi6;bmod,rob;p&i+9>kB;n6uh;as;%be2vlen6;urit;b,p,tl6;uk;c7led6;! wen;i<kall1n2;ava,#wi0uku]ooO;bmum6li0nne+,<d@;! iv3;aBd-.uj,gA%g6sed&p %ttu,t.%?;f~3i7#j6;us;d6*;#+;ab lor1i&h4;r%,wate;ud;d[ihz[,mit ai)i,nCr6;eg#vad,o6;)i,jn9l7sym,>bmi6;oc;-nUle6;!n,v;at;a6up;];a6e)3ni;b6id3;a6#hd;d8g#<a,h7iz$g,?zin,red6zorif;nuces,yh;al*,kur7;&8e7i6;%f;mha;om;b0Id0Ag06h03iZkaXlRnNrEsCt9w7y6;-,hdE;)6er;$k;akl[,[,tuc*c6;!/ai6;^;.Tr6;is;a9ga,o7p$c,t(&$6u]6;@;$,mil6;ib;dod9p>0w6;li0r6;um;hb;av;aihd8l5>6;p,s;~;ul;a9e6[a,uk+nA;k<2r3;.;&;it6t%ga;ap;t.r1wuj6;-;d8lu7nr6^;up;hd;ni;or7sido,zuppa6;*;?;#hbr8omi7%bl6;_;(;ad;aAion9n6;a7i]4;ab;+;! re>erg;nik1way~6;iv;ak;as7r6;[;og","India"],"Krasnoyarsk":["true¦a2kra0north a2;snoyarsk0t;! time;sia","Krasnoyarsk"],"Kuala_Lumpur":["true¦aHbukit mertajGgeorge town,ipoh,johor bahFk8m4petali3s0taipiE;e1hah alFu0;ba1ngai petani;paBremb7;ng jaya;ala1y0;!s,t;cca,ysia0;! time;ampung baru suba5la5ota bha6ua0;la1nt0;an; 0_l1;l0terengganu;umpur;ng;ru;am;lor setar,sia","Malaysia"],"Kuching":["true¦asia,k4m2s0tawau;a0ibu;bahsarawak,ndakan;alaysia0iri,yt;! time;ota kinabalu,uching","Malaysia"],"Macau":["true¦asia6beiji5c2hong ko5m0urumqi;ac0o;!au;h0st;ina0ongqi1;! time;ng;!/macao","China"],"Magadan":["true¦asia,mag0;adan0t;! time","Magadan"],"Makassar":["true¦!1:#$%&:indonesia,ntral,ar,an;asiaBba8c5denpa4# ce$,k3l2ma1palu,s0wita;am%inda,ulawesi;kas2nado,t%am;abu& bajo,oa j&7;end%i,up8;s%;e0ity of bal3;lebesbalinusa,$ #0;! time;l0nj%masin;ikpap0;&;!/ujung_p&d0;&g","Central Indonesia"],"Manila":["true¦!1:#$%&():an,in,on,ta,ga,la;a04bWcRdaPgeneral s#tOiMlJmDnaCoBp5quez%4s#1&0zambo#(;clobZguig,r)c,ytF; 1t0;a ro3ol;fern#do,jose del m%te,pablo;! city;a3h1uerto pr$ce0;sa;!ilipp$e0l,st,t; time,s;(diQnal#oy,s0;ay,ig;l%(po,rmoc;(,votP;a0eycauayM;ba)cat,gugpo pob)ci%,kati,l3n0;da1i),sil$gK&mp0;ay;luy%g,ue;$gCol5;a1e(spi,i0ucena;ber&d,pa;pu )pu,s p4;l0mus;igCoiI;os;smar0v5;$B;a0ebu,o&bato;b1(y# de oro,$5l0;amba,ooc6;#atu5uy0;ao;a4$#2u0;d0tu2;&;!g%0;#;co1guio,t#g0;as;lod,or;n0sia;geles,tipo0;lo","Philippine"],"Nicosia":["true¦:!1:#$:nretsae,eporue;ais1emit na$ #,# 3p0surp0tee,yc;yc;a,ocin0;!/0;$","Eastern European","eu3"],"Novokuznetsk":["true¦a5k2no0prokop'yev1;rth a4vokuznet0;sk;emerovo,ra0;snoyarsk0t;! time;sia","Krasnoyarsk"],"Novosibirsk":["true¦as3no0siber3;rth central as2v0;osibirsk0t;! time;ia","Novosibirsk"],"Omsk":["true¦asia,oms0;k0t;! time","Omsk"],"Oral":["true¦!1:#:kazakhstan;a2# western,oral,tashkent,west 0;asia,#0;! 4;lm1s0;hgabat,ia;a0t; ata,-ata 0;time","West Kazakhstan"],"Pontianak":["true¦!1:#:indonesia ;asia,b2#western,pontianak,tanjung pinang,w0;est0ib; b0ern #time;orneo","Western Indonesia"],"Pyongyang":["true¦asia,chongjin,h7k4n3p2s0won8;ariw0eoul,inuiAunch'0;on;rk,yongya7;amp'o,orth korea;a1orea0p,st;!n time;eso3nggye;a1ungnam,ye0;san;e1mhu0;ng;ju","Korean"],"Qatar":["true¦a2doha,kuwait,qa0riyadh;!t0;!ar;r2s0;ia0t;!/bahrain; rayyan,ab0;!i0;a0c;!n0;! time","Arabian"],"Qostanay":["true¦:!1:#$: natshkazak,tsa;a1emit# $e,nre$e#,tmla,yanatso0;k,q;isa0na$;! lartnec","East Kazakhstan"],"Qyzylorda":["true¦:!1:#:natshkazak;a2emit 1nretsew #,t0;abaghsa,m3nekhsat;ata-1# 4;dro4isa2ta 0;am0;la;! 0;tsew;-lyzk,lyzy0;k,q","West Kazakhstan"],"Riyadh":["true¦a9burayd8dammam,ha7jedd8k6me5najran,riyadh,s4ta3y0;anbu,e0;!m0;!en;'if,buk;ultan3yot;cca,dina;hamis mush6uw6;'il,far al batin;ah;bha,l 8ntarctica/syowa,rab4s0;ia0t;!/0;aden,kuw0;ait;!i0;a0c;!n0;! time;hufuf,jubayl,kharj,mubarraz","Arabian"],"Sakhalin":["true¦asia,sak0yuzhno sakhalinsk;halin0t;! 0;island,time","Sakhalin"],"Samarkand":["true¦asia,bukhara,nukus,qarshi,samarkand,uz0;bekistan0t;! 0;time,west","Uzbekistan"],"Seoul":["true¦:!1:#$:gn,oe;aTeS#PiFkor,luoRn6opkom,r5tsk,u0;g9j0s$y;ej,#a2n0;iGo0;ej,w;wg,y;k,ok;a6o0;e1w0;#aAus;hcn1j0;ead;i,u0;hc,s;n4s0;am,ki,lu,n9ub;m8s 0;#5ir7man#oAn3u0;b#$jiu,j#0;$0;hc;asna,$hc0;i,ub;ay0$sawh;na,og;ug;ahop,o0uen#ag;j0ym#awk;es;ahmik,mit naerok;erok0isa;! htuos","Korean"],"Shanghai":["true¦:!1:#$%&()*+-.<=>?@[:gn,na,uh,ij,hc,oa,eh,ni,il,iq,ia,ad,hz,ug,uw,ix;0:2T;1:2X;2:33;a3Lcrp,e3G#1Oi11nZoRrPsodro,tOu3;b#eb,d1Sfnuy,gMhL.Uo3pn1q a%$ux ihs uoka7s$g,yU;d2Uguotnem,>7k4t3;$0)b;a4*)l,#iy,<h,n1Ru3;d=,o2;&#a2;eE#Bi8n4)(,u3;f,h5s,w;a5e3&;h3w;c,z;l,uq;a4u3;g,h,s;l,t;a3e2&;c,h3?,y;!c,z;!d;s35@;#I$h;c,kh,ohhoh,sc;a3un $yab;h.Al<h;a5b4u3;hsg2Iz)&;#in,iz;d#5>ir,i4r3tS;#a0;lg2Tqul;a%n3.;.;aGc,eB(,i7u3;c*i5h3;c2Qs3;$,uf;at;b5j$it,li4xOy3;a%,<b;j,?;iy,rah0U;f+l,>4m3;a1gX%;ed#&,n3;a?#e( 3e0;a[+l,#ayF;'iPdnOhIiCnAtg9u3yi0;g7(5qg1Wy3;#0I<3)-;k,t;is,n3;iy;#od,)0;$1;i3%;a%,j;at,d6j5l=,t4x3;!n6;up;uf;amu2#af3;aw;s3@;ay#au0#5<b,n3of;a3ew,uk;!-,p;at,idg15o3;>,t;ah;a%,eb,j;aHb*,cGdn1eEgre $l%,hCj19lBqAsuma&,%6x4yn3;-,uz;g3&,neb,@;$&;n1s3;#*,$3;i3pu-;j,t;i0muru;#e0?;s3z1G;a0g12$%cg1D;b3f*,w@;a2<%;uy;h5t3;#1n3u&;ay,[;#4iTu3;>,w;a0.,o3;d3.;!=;aXeQiAo3;d7giz,h5k #4s@,t3;=,$n;oh;c$n,z3;#e(;#3$d;a?;doHjFk#%c/ElCmnBn8p6q4x3yu1;a&,)0;=,#o(3$,)2;!/B;is,o3;ag;i4$3;[,n;j,x;as,uk;e3#Z;it;aisa;i3$n;eb;ab;fi8(3; u2<6n4)3uoz;-;a3&,uy;ul,y;b,h;ak,(;fXgU(SiG%Cy3;eA#9i8n5o3up;a3ul;(,-,z;a3e0[;!i3n;m,x;?,y;a1*;&,uy;g5z3;a&i0)z;hs;nef;j7l6x3;g4n1;[;+p;=;g8i7n4)3u3;&;a4e2;>;dum,.;en,l;$y;iy,n3ux;an;*,g3;$3;%;#3iew;al;d#6ho5mit a+Cux4z3;*;@;ul;a8e8;d$,hs6i5+7%3;g3ius;not;sa;#a3;(","China"],"Singapore":["true¦asia,kuala lumpur,s0woodlands;g0ingapore;!p,t","Singapore"],"Srednekolymsk":["true¦asia,chokurdakh,sre0;dnekolymsk,t","Srednekolymsk"],"Taipei":["true¦:aisa,cor,gnu2iepi3n0oaiqnab,tsc,uhcnish,wt;a0eilauh,wt;ni1uyo1wi1;hci0ishoak,leek;at","Taipei"],"Tashkent":["true¦a3namangan,qo'q4tashkent,uz0;!b0t;!ekistan0;! east;ndij0sia;on","Uzbekistan"],"Tbilisi":["true¦asia,ge1kuta0tbil0;isi;!o0t;!rgia0;!n","Georgia"],"Tehran":["true¦:!1:#$%&:ba,hs,ra,ri;aisa,dQhMirOjaKkaIlFmoq,n7r5sab# %dnHt3ywXz0;a1ir0;#t,hJ;&$,vha;d0$ar,s0;&;avezbIeyalOha$0i,u#$yen; inyemQdaza,mP;a1i0&;ma%v,vzA;d2grog,hafsi,j1kub,mFr0;het,i;n1&s;a1eh0;az;#,mah;i#d%,o0;b0ma;ab;hcr0%;aq;dnan3r0;ak;a$nam2cnarb dagarsap,e0;v0yimuro;as;rek;a2naj&b,r0zay;ejur0unj0;ob;#1h$0;am;faj2m0%z2;arr0;ohk;an","Iran"],"Thimphu":["true¦asia2b0thimphu;hutan,t0;!n;!/thimbu","Bhutan"],"Tokyo":["true¦:!1:#$%&()*+-./<=:ih,am,hc,an,ka,st,ot,ok,im,ak,sa,oy,uk;a04eXiEnCo5pj,t4u0;fo2hsuy(tik,(jner-.,)0z$un;$a0eoj,o;(t,mY;%,k;dj,sj;ay,be/s,du5%noh,jna,m#soega,n4r3t0yk*;&C-,o0;m0yk;$Qu2;#sPoppas;ag&,<;)$;a0pj;knir-&5paj;aHgu)a,hBj9k1m0romoa;ati,uzi;a0esonom0P#/rIu)0H;rabi,s2wi,za0;ko,y0;-;a0or#;g0(t,wZ;a0#c;ma,n;em#,oBu0;!f;c3s0; 1a0;be$,h0G(;ar&,i=uf,<k* Zufig;a0i.08+,u3;mnoh o%awag+Pt#;dnes,g6kUm+$*;b4hon2mur1o0r1tad+3;gawM;=;#c0;ah;.0+;usH;b0Bd08h&,i/,kQmCr9t5w2y0;ag#sJ-on0og&;i9u)u;a0#sD;gayen,k#a/,sijYz0;&Bor+*;a1i0<Z;(,o,us;g0kO;$ay,iG;a0=C;hi0wado;%i;a4#s0;o1=0;*,uf;g0rH;.;h5ti4y0;.2ir1*,u0;kI)P;+;aw,o;as; ay-on0oA;#s0;in;aCo8u0;s3z0;ar0us;.0;at;o2t0;ar0;#;k<;ag7irom,s,u0;k1z0;#s;uf;n0so;<0;*;/;&;aw#s1#c0;$;ik;i0=u);%","Japan"],"Tomsk":["true¦asia,oms0tomsk;k,t","Tomsk"],"Ulaanbaatar":["true¦asia3m1ula0;anbaatar,n 3t;n0ongolia;!g;!/ulan_0;bator","Ulaanbaatar"],"Ust-Nera":["true¦asia,ust-nera,vla0;divostok,t","Vladivostok"],"Vladivostok":["true¦!2;asia,k1msk+\\e,vla0;divostok,t;habarovsk0omsomolsk on amur;! vtoroy","Vladivostok"],"Yakutsk":["true¦asia,blagoveshchen1yak0;t,ut0;sk","Yakutsk"],"Yangon":["true¦asia4b3kyain seikgyi township,m0nay pyi taw,pathein,sittwe,yang5;a1eiktila,m0onywa;!r,t;ndalay,wlamyine;ago,urma;!/rango0;on","Myanmar"],"Yekaterinburg":["true¦:a8grubn6k2ligat y4mrep,n1t0yiks'laru ksnemak;key,suotalz,ugrus;agruk,emuyt;amatilrets,s0;nibaylehc,ro1votrave0;nhzin;!gotingam;ero,iretake0;!y;fu,isa","Yekaterinburg"],"Yerevan":["true¦a0caucasus,yerevan;m2rm0s1;!en0;ia;!t","Armenia"]},"Atlantic":{"Azores":["true¦a0hmt;tlantic,zo0;res,st,t","Azores","eu0"],"Bermuda":["true¦a2b0;ermuda,m0;!u;st,t0;!lantic","Atlantic","usa"],"Canary":["true¦!1:#$%:an,europe,stern;atl#tic,c#ary1$ we%,las palmas de gr# c#aria,s#ta cruz de tenerife,we0;% $#,t;! isl#ds","Western European","eu1"],"Cape_Verde":["true¦atlantic,c0;a1pv,v0;!t;bo verde0pe verde;! is","Cape Verde"],"Faroe":["true¦atlantic2f0;aroe0o,ro;! islands;!/faeroe","Western European","eu1"],"Madeira":["true¦atlantic,europe western,madeira1we0;stern european,t;! islands","Western European","eu1"],"Reykjavik":["true¦atlantic,coordinated universal3g2i0reykjavik,utc,zulu;celand,s0;!l;mt,reenwich mean0; time","Greenwich Mean"],"South_Georgia":["true¦atlantic,gs1s0;gs,outh georgia;!t","South Georgia"],"Stanley":["true¦atlantic,f0stanley;alkland1k0lk;!st,t;! island0;!s","Falkland Islands"]},"Australia":{"Adelaide":["true¦!1:#$:tral,south;a2cen0$ 1; 0# 0;aus#ia;c2delaide,us#ia0;! 0/$,n 0;cen#;dt,st,t","Central Australia","aus"],"Brisbane":["true¦a1brisbane0gold coa5logan,q4townsville;! time;e3ustralia0;!/q1n east0;!ern;ueensland;st","Brisbane"],"Broken_Hill":["true¦!1:#:ustralia;a1broken_hill,cen0y3; a# standard time,tral a#;c2delaide,#0;! central,/y0;ancowinna;st,t","Central Australia","aus"],"Darwin":["true¦a0darwin,northern territory;cst,ustralia0;!/north,n central","Australian Central"],"Eucla":["true¦!1:#: central w;a0cw4eucla;cw4us0;#1tralia0;!n#estern;!e0;st;dt,st,t","Australian Central Western"],"Hobart":["true¦:a4dnalsi gnik,e3nretsae 2t0yendys;dea,ea,raboh,s0;ae s6ea;a4na4s5;irruc/a3nruoblem;i0rrebnac;lartsua3namsat0;!/a0;ilarts0;ua;! nretsae","Eastern Australia","aus"],"Lindeman":["true¦a0brisbane time,lindeman,whitsunday islands;est,ustralia0;!n eastern","Brisbane"],"Lord_Howe":["true¦australia3l0;h1ord howe0;! island;dt,st,t;!/lhi","Lord Howe","lhow"],"Melbourne":["true¦a0canberra,eastern austral4geelong,melbourne,sydney,v3;e7us0; east4tralia0;! 2/v0n 2;ictor0;ia;easte1;!e0;rn;dt,st,t","Eastern Australia","aus"],"Perth":["true¦!1:#$:ustralia,st;a4perth,w0; 2e$0; 1ern a#0;! time;a#;#1w0;dt,$,t;! we$e1/we$,n we$0;!e0;rn","Western Australia"],"Sydney":["true¦!1:#$:east,tralia;a0c5#ern aus$ time,melbourne,new south wales,sydney,wollongong;e8u0;!s0;! #4$0;! 2/0n 2;act,c0nsw;anberra;#e1;!e0;rn;dt,st,t","Eastern Australia","aus"]},"Etc":{"GMT":["true¦!2;:!1:#:hciwneerg;\\a0c3emit naem #,#2tmg;+t0-t0t0;mg0;!/c0;te","Greenwich Mean"],"UTC":["true¦:!1:#:lasrevinu;ct1emit # detanidrooc,#0tcu0uluz0;!/cte;e,u","UTC"]},"Europe":{"Berlin":["true¦b0europe/b0hamburg;erlin","Central European","eu2"],"Simferopol":["true¦europe/s0s0;imferopol","Moscow"],"Amsterdam":["true¦a9brussels,c6e4groning7madrid,n2paris,ro1t0utrecht;he hague,ilburg;mance,t9;etherlands,l0;!d;indhov2urope0;! central;e1openhag0;en;ntral european,st,t;lmere stad,m0;s0t;terdam","Central European","eu2"],"Andorra":["true¦a3brussels,c1europe0madrid,paris,romance;! central;e0openhagen;ntral european,st,t;d,nd0;!orra","Central European","eu2"],"Astrakhan":["true¦astrakh1europe,m0russi1st petersburg,volgograd time;oscow,sk;an","Astrakhan"],"Athens":["true¦athens,e1gr0thessaloniki;!c,eece;astern european,et,urope0;! eastern","Eastern European","eu3"],"Belgrade":["true¦b9c7europe3madrid,n2p1romance,s0;i,lovenia,vn;aris,risti4;is,ovi sad;! central,/0;ljublja1podgorica,s0zagreb;arajevo,kopje;na;e0openhagen;ntral european,st,t;elgrade,russels","Central European","eu2"],"Brussels":["true¦antwerp6b3c1europe0gent,liege,madrid,paris,romance;! central;e0harleroi,openhag4;ntral european,st,t;e0mt,russels;!l0;!gium;en","Central European","eu2"],"Bucharest":["true¦b5c4e2gala1iasi,oradea,ploies1ro0timisoara;!mania,u;ti;astern european,et,urope0;! eastern;luj napoca,onstanta,raiova;ra0ucharest;ila,sov","Eastern European","eu3"],"Budapest":["true¦b6c3debrec4europe2hu0madrid,paris,romance;!n0;!gary;! central;e1openhag0;en;ntral european,st,t;russels,udapest","Central European","eu2"],"Busingen":["true¦b5c3de2europe1germa0madrid,paris,romance,saxo0;ny;! central,/berlin;!u;e0openhag3;ntral european,st,t;avaria,r0using1;em0ussels;en","Central European","eu2"],"Chisinau":["true¦chisinau,e2m0;d0oldova;!a;astern european,et,urope0;! eastern,/tiraspol","Eastern European","eu2"],"Copenhagen":["true¦arhus,brussels,c2d1europe0madrid,paris,romance;! central;enmark,k,nk;e0mt,openhagen;ntral european,st,t","Central European","eu2"],"Dublin":["true¦:d8e6hgrubnide,k4l9n2t0yawlag;m0si;d,g;ilbud,o0;bs1dnol;cirem0roc;il;ca,i,mit 0porue,rie,st;hsitirb,naem hciwneerg;nale0rofretaw;ri","Irish","eu1"],"Gibraltar":["true¦b5c3europe2gi0madrid,paris,romance;!b0;!raltar;! central;e0openhagen;ntral european,st,t;dst,russels,st","Central European","eu2"],"Helsinki":["true¦e3fi1helsinki,t0vantaa;ampere,urku;!n0;!land;astern european,et,spoo,urope0;! eastern,/mariehamn","Eastern European","eu3"],"Istanbul":["true¦:!1:#$%&:na,ru,ra,ne;aVeRgizale,iKkerevPlub#tsiJmurInEpet#izag,r6s4t2u1ye0;k$t,oktuvan%;lroc,n$bnityez;im5&kitEr0;t,uy&7;a0us%t;%m#marhGvJ;a5el3i0t,ut;hes1kab%yid,m0sekil9;zi;ata,ik1kas7;&0veilech6;se;deukseu,l0;gabar8icg3;a0isBozbart,usmN;m0v;ayiKt0;ab;oc,uzre;!/aisa;d&fezek5l2r0zag3;azapaFesy0;ak;s1yeb0zi&d;#tlus;is;rem;lakkirik,p1yi#0zbeg;mso,rmu;et0o$e;kacn7l4;f$iln6#5%k4s2y0;ak#c,hatuk,k0l0nok,tal2;at2;apta$m,in0$b;am;#;da;as","Turkey"],"Kaliningrad":["true¦e0kaliningrad;astern european,et,urope","Eastern European"],"Kyiv":["true¦!1:#$%:er,iv,urope;bila ts#kLch#IdGeDhorlC$ano frank$Hk8l7m5odessa,poltaLr$4sumy,t#nopil,u2vinnyts1z0;aporizhzh0hytomyr;ya;a,kr0;!ai0;ne;a0ykolayE;ki5riu8;ut9vC;amyanske,h1iev,r0yB;emenchuk,opyv1yvyy rih;ark9#son,mel0;nytskyy;$ka;ast#n e%an,et,%0;! east#n,/simf#o0;pol;nipro,onet0;sk;kasy,ni0;h0vtsi;$;va","Eastern European","eu3"],"Kirov":["true¦europe,kirov,m0russian,st petersburg,volgograd time;oscow,sk","Moscow"],"Lisbon":["true¦!1:#:europe;amadora,#5lisbon,p2we0;st0t;! #,ern #an;ort0rt,t;o,ugal0;! mainland;! western","Western European","eu1"],"London":["true¦!1:#$%&()*+.:ing,st,on ,er,an,re,en,or,ham;a0Ob0Ac07d03eXgThRiOj00k#$%up%hull,lJmHnBoxSp9)ad#,s1w0yF;arwick0Aig(,olv&ha7;heffield,o3t2u1w0;(4iH;ffolk,nd&l(d,r)y,sYttL;afNoke %t)nt;meZuth0;a1*d %0;sea;mptG;ly0+ts0)$F;mouth;ew4o0;r0tt#.T;th0wC; y0amptonR;+kV;ca$le up%tyne,p+t;(cheQi0;dl(4lt%keynes;(caRdn,e2i1o0ut5;nd4;ncolnPsb3v&W;e0ice$&J;ds;psw1sl#t0;on;ich;ampJ&t0;f+dI;b2l1mt0)*wich me( M;! $(dard L;asgow,ouce$&F;!-eF;dinburgh,s4urope0;!/0;belNgu&nsMisle_of_m1j0;&sL;(;sex;&by2o1u0;blin,dlH;rset;!sh5;a1ity of we$min0ov*try,rawlE;$&;mbridge1rdiff;eAir9lack7r2$,uck#.0;sh0;i);adf+d,e3i0;$4tish0;! 0;time;nt;po0;ol;k*head,m#.;l1xl0;ey;fa$;b&de*,rchway","British","eu1"],"Luxembourg":["true¦brussels,c3europe2lu0madrid,paris,romance;!x0;!embourg;! central;e0openhagen;ntral european,st,t","Central European","eu2"],"Madrid":["true¦!1:#$%&()*: de ,la,an,ra,en,te,urope;aRbOcJeGfu(DgCjerez#$ fron)&,lBm8ovieFp6rom%ce,s1)r&ssa,v0wemt,za&goza;al$dol9igo;a1evil$,pain0;! main$nd;badell,n0; sebastiHt0; marti,%der,s montjuic;a0u()#vallecas;lma,mpIris;a0ostolLurcK;dr0$ga;id;atiJeg%I;as)iz/vitorGijon,r%1;car&l el par1$br0;ada;do;ixample,lche,s1*0;! c(tr2;!p;a3e1iudad line0op(hag(;al;nt&l e*0st,t;%;&b%chel,s)llo#$ p$7;a0ilbao,russels,urgos;da0rce0sque;lo4; coru3l0;ca$#h(ar1ic%),mer0;ia;es;na","Central European","eu2"],"Malta":["true¦brussels,c3europe2m0paris,romance;a0lt,t;drid,lta;! central;e0openhagen;ntral european,st,t","Central European","eu2"],"Minsk":["true¦b4europe,h3m1russian,st petersburg,v0;iteb4olgograd time;ahily0in3osc0sk;ow;omyel,rodna;abruy0elarus,lr,rest,y;sk","Moscow"],"Monaco":["true¦brussels,c3europe2m0paris,romance;adrid,c0onaco;!o;! central;e0openhagen;ntral european,st,t","Central European","eu2"],"Moscow":["true¦:!1:#$%&()*+:or,so,ak,on,hz,le,hc,hk;a07d03e00gW(en#ov,iVkMlInaGoDr8s6t5u4vo3w02y0z%v%A;i1ksiegravgBn)* eyyn(erebTraskob6t+ahs,yn0;rOz#g;ksnini09nlartnec;bmVksp,rt$ yksve'lysav;nod an vots#,r,s-w;ef,sdm;tevoper0ur;e*;a2evt,i0;m0vamJ;idalv;d0kvytkys;&sark;ni1v0;enes4&avi;'rUbelu( &i+yv;iUza0;k,yr;ero,o1vals#0;ay;k$ yyr0p#v0;ats;i*'l7s0;')gna+5dovaz#tKlodop,m4n0ruk,tepil,yiss#ov&;a2eloms,i0;byr,(rezd,vd#0;eves;mrum,r6yrb;!%enD;ra;an;*os,kmi+;#nag2rubsretep t0;ni0s;as;at;mit 0p#ue;dargoglBw0;oc$m;arg&e)z,#og0sm;)b,v& yi0;ki)v,n0;(in;dgol5gu4i3l1m#t$k,zn0;ep;%*a+0o r%h$y,ut;am;ssur;l%;ov","Moscow"],"Oslo":["true¦!1:#$%:europe,an,ntral;a6b5c3#2madrid,oslo,paris,rom$ce,s0;j0valbard $d j$ 6;!m;! ce%;e0openhag4;% #$,st,t;erg2russels;rctic/longyearby1tl$tic/j$_0;may0;en","Central European","eu2"],"Paris":["true¦:arf,dirdFe7gruobsarts,lartnec epAn6r5s2t0xuaedrob,ydnamron;e0s8;c,m;e0irap,lessurb,mi1;nn0tnan;er;eilleptnom,f;aeporue lartn2egahnepoc,oyl;c5lli4nneite t3p2rvah el,s0;iotnop ygr0uoluot;ec;orue;nias,s;esr2l;in,na0;mor,rf;am","Central European","eu2"],"Prague":["true¦br6c4europe2madrid,ostr3p1romance,s0;k,lovakia,vk;aris,mt,rague;! central,/bratisl0;ava;e0openhagen;ntral european,st,t;no,ussels","Central European","eu2"],"Riga":["true¦!1:#:urope;e2kalt,l0riga;atvia,st,v0;!a;ast2e1#0;! eastern;st,t; e#,ern e#an","Eastern European","eu3"],"Rome":["true¦!1:#$%&:europe,an,ri,ntral;bIcE#CfloreBgenoa,mAnaples,p7r5sicily,t3v0;a0eroK;!t0;!ic$ city;ar$4%este,u0;%n,sc$y;mt,om0;a4e;a1ra0;to;dova,lermo,%s;ad%d,essiAil6;nce;! ce&,/0;s$_ma%no,vatic3;at$5e1o0;penhagen,rsica;& #0st,t;$;a%,olog2r0;esc0ussels;ia;na","Central European","eu2"],"Samara":["true¦europe,izhevsk,s0togliatti on the volga;am0yzran;ara,t","Samara"],"Saratov":["true¦balakovo,europe,izhevsk,sa0;m0ratov;ara,t","Samara"],"Sofia":["true¦b2e0imt,plovdiv,sof4varna;astern european,et,urope0;! eastern;g2u0;lgar0rgas;ia;!r","Eastern European","eu3"],"Stockholm":["true¦brussels,c5europe4goeteborg,ma3paris,romance,s0;e1tockholm,we0;!d4;!t;drid,lmoe;! central;e1openhag0;en;ntral european,st,t","Central European","eu2"],"Tallinn":["true¦e0tallinn;astern european,e2st1urope0;! eastern;!onia;!t","Eastern European","eu3"],"Tirane":["true¦al4brussels,c2europe1madrid,paris,romance,tiran0;a,e;! central;e0openhagen;ntral european,st,t;!b0;!ania","Central European","eu2"],"Ulyanovsk":["true¦europe,m0russian,st petersburg,ulyanovsk,volgograd 2;oscow0sk;! 0;time","Ulyanovsk"],"Uzhgorod":["true¦e0ruthenia,uzhgorod;astern european,et,urope0;! eastern","Eastern European","eu3"],"Vienna":["true¦a4brussels,c1donaustadt,europe0favorit2graz,linz,madrid,paris,romance,vienna;! central;e1openhag0;en;ntral european,st,t;t,u0;stria,t","Central European","eu2"],"Vilnius":["true¦e3k2l0vilnius;ithuania,t0;!u;aunas,laipeda;astern european,et,urope0;! eastern","Eastern European","eu3"],"Volgograd":["true¦europe,m2russian,st petersburg,vol0;gograd0t,zhskiy;! time;oscow,sk","Moscow"],"Warsaw":["true¦bKcHeuropeGgCkAl8m7p4r3s2torun,w0zabrze;ars0rocl0;aw;osnowiec,zczec6;adIomanA;aris,l,o0raga poludnie;l0znD;!and;adrid,okot3;odz,ubl0;in;ato2iel3rak0;ow;d2li0;wi0;ce;ansk,ynia;! central;e0openhagen,zestochowa;ntral europe0st,t;an;i2russels,y0;dgoszcz,t0;om;alystok,elsko biala","Central European","eu2"],"Zaporozhye":["true¦e3luhansk2sevastopol,zapor0;izhia lugansk,ozh0;'ye,ye;! east;astern european,et,urope0;! eastern","Eastern European","eu3"],"Zurich":["true¦brussels,c4europe2geneve,li0madrid,paris,romance,swiss time,zurich;!e0;!chtenstein;! central,/0;busin1vaduz;e1openha0;gen;ntral european,st,t","Central European","eu2"]},"Indian":{"Chagos":["true¦british indian ocean territory,c4i0;ndian1o0;!t;! 0;c0ocean;hagos","Indian Ocean"],"Christmas":["true¦c0indian;hristmas1x0;!r,t;! island","Christmas Island"],"Cocos":["true¦c0indian;c2ocos0;! island0;!s;!k,t","Cocos Islands"],"Kerguelen":["true¦!1:#$: antarctic,and;a5french southern2indian,kerguelen1tf0;!t;!st paul4;! 0;&# time,$#0;! l$s;msterdam0tf; isl$","French Southern & Antarctic"],"Mahe":["true¦indian,mahe,s0;c0eychelles,yc;!t","Seychelles"],"Maldives":["true¦indian,m0;aldives,dv,v0;!t","Maldives"],"Mauritius":["true¦indian,m0port louis;auritius,u0;!s,t","Mauritius"],"Reunion":["true¦:n0ter;aidni,oinu0;er,ér","Réunion"]},"Pacific":{"Apia":["true¦apia,pacific,s2w0;est s1s0;!m,t;amoa","West Samoa"],"Auckland":["true¦a2christchurch,manukau,n0pacific,wellington;ew zea2orth shore,z0;!dt,l,mt,st,t;ntarctica/1uck0;land;mcmurdo,south_pole","New Zealand","nz"],"Bougainville":["true¦bougainville,guinea2p0;a0gt;cific,pua new guinea;!n","Bougainville"],"Chatham":["true¦cha0nz-chat,pacific;dt,st,t0;!ham0;! 0;islands,time","Chatham","chat"],"Chuuk":["true¦chu2pacific0;!/0;truk,y2;t,uk0;!/truky0;ap","Chuuk"],"Easter":["true¦chile/easter4e0pacific;as0mt;st,t0;!er0;! 0;island","Easter Island","east"],"Efate":["true¦efate,pacific,v0;anuatu,u0;!t","Vanuatu"],"Fakaofo":["true¦fakaofo,pacific,t0;k0okelau;!l,t","Tokelau"],"Fiji":["true¦f0pacific;iji,j0;!i,st,t","Fiji"],"Funafuti":["true¦funafuti,pacific,t0;uv1v0;!t;!alu","Tuvalu"],"Galapagos":["true¦co1gal0pacific;apagos,t,ápagos islands;lombia,st,t","Galapagos"],"Gambier":["true¦gam0pacific;bier0t;! islands","Gambier"],"Guadalcanal":["true¦guadalcanal,pacific,s0;b1lb,olomon0;! islands;!t","Solomon Islands"],"Guam":["true¦ch5guam,m4northern mariana islands,p2west0; 0ern 0;pacific;acific0ort moresby;!/saipan;np,p;amorro,st","Chamorro"],"Honolulu":["true¦aleutian4h1pacific0us/hawaii;!/johnston;a0onolulu,st;dt,st,t,waii0;! aleutian;! islands","Hawaii"],"Kanton":["true¦kanton,p0;acific1ho0;enix islands,t;!/enderbury","Phoenix Islands"],"Kiritimati":["true¦ki1lin0pacific;e islands,t;!r0;!i0;bati,timati0;! island","Line Islands"],"Kosrae":["true¦kos0pacific;rae,t","Kosrae"],"Kwajalein":["true¦kwajalein,m0pacific;arshall islands,ht","Marshall Islands"],"Majuro":["true¦m0pacific;a1h0;!l,t;juro,rshall islands","Marshall Islands"],"Marquesas":["true¦mar0pacific;quesas0t;! islands","Marquesas"],"Nauru":["true¦n0pacific;auru,r0;!t,u","Nauru"],"Niue":["true¦n0pacific;iu1u0;!t;!e","Niue"],"Norfolk":["true¦n0pacific;f1orfolk0;! island;!dt,k,t","Norfolk Island","aus"],"Noumea":["true¦n0pacific;c0ew caledonia,oumea;!l,t","New Caledonia"],"Pago_Pago":["true¦:aomas1c3ogap_og4tss,yawdim0;!/c2;!/0;c0su;ific0;ap","Samoa"],"Palau":["true¦p0;a1lw,w0;!t;cific,lau","Palau"],"Pitcairn":["true¦!2;p0utc-\\a\\i;acific,cn,itcairn,n,st","Pitcairn"],"Pohnpei":["true¦french polynesia,p0;acific1f,o0yf;hnpei0nt;!/ponape","Ponape"],"Port_Moresby":["true¦antarctica/dumontd6dumont-d'6guinea5p0;a3g2ng,ort0; 0_0;moresby;!t;cific,pua new guinea;!n;urville","Papua New Guinea"],"Rarotonga":["true¦c0pacific,rarotonga;k2o0;k,ok0;! islands;!t","Cook Islands"],"Tahiti":["true¦pacific,society islands,tah0;iti,t","Tahiti"],"Tarawa":["true¦gil0pacific,tarawa;bert islands,t","Gilbert Islands"],"Tongatapu":["true¦nuku'alofa,pacific,to0;!n0t;!ga0;!tapu","Tonga"],"Wake":["true¦pacific,u2wak0;e0t;! island;m0s minor outlying islands;!i","Wake Island"],"Wallis":["true¦pacific,w0;allis1f0lf;!t;! 0;&0and0; futuna","Wallis & Futuna"]}};

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
    if (i <= 12) {
      zones[`Etc/GMT+${i}`] = {
        offset: i * -1,
        meta: `gmt+${i}`
      };
    }
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

const normalizeCase = (input) => input.trim().toLowerCase();

const normalizeWhitespace = (input) => input.replace(/\s+/g, ' ').trim();

const simplifyTimezonePhrase = (input) => {
  let phrase = normalizeWhitespace(normalizeCase(input));
  phrase = phrase.replace(/^in /, ''); // "in Toronto" → "Toronto"
  phrase = phrase.replace(/ time/g, '');
  phrase = phrase.replace(/ (standard|daylight|summer)/g, '');
  phrase = phrase.replace(/ - .*/g, ''); // "Eastern Time - US & Canada"
  phrase = phrase.replace(/\./g, ''); // "St. Petersburg" → "St Petersburg"
  return phrase.trim()
};

const simplifyGeographicWords = (input) =>
  input
    .replace(/\b(east|west|north|south)ern/g, '$1')
    .replace(/\b(africa|america|australia)n/g, '$1')
    .replace(/\beuropean/g, 'europe')
    .replace(/islands/g, 'island')
    .trim();

const normalizeApostrophes = input => input.replace(/[‘’ʼ＇]/g, "'");

const removeApostrophes = input => input.replace(/'/g, '');

const useIdentifierSpacing = input => input.replace(/ /g, '_');

// Lookup checkpoints, ordered from least to most transformed.
const getAliasCandidates = (input) => {
  const phrase = simplifyTimezonePhrase(input);
  const geographic = simplifyGeographicWords(phrase);
  const spaced = normalizeWhitespace(geographic);
  const apostrophes = normalizeApostrophes(spaced);
  const city = removeApostrophes(apostrophes);
  return [phrase, geographic, spaced, apostrophes, city, useIdentifierSpacing(city)]
};

// Accent folding runs only after all ordinary alias checkpoints have failed.
const foldDiacritics = (input) => input.normalize('NFD').replace(/\p{M}/gu, '');

// unpack our lexicon of words
const zones = {};
const lexicon = Object.assign({}, misc);
Object.keys(pcked).forEach((top) => {
  Object.keys(pcked[top]).forEach((name) => {
    const [words, meta, dst] = pcked[top][name];
    const id = `${top}/${name}`;
    zones[id] = { meta };
    const keys = Object.keys(unpack(words));
    keys.forEach((k) => {
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
const canonicalize = (id) => canonicalIds[id.toLowerCase()] || id;

const unique = function (arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i += 1) {
    obj[arr[i]] = true;
  }
  return Object.keys(obj)
};

// sort by num of aliases
Object.keys(lexicon).forEach((k) => {
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
// Add accent-free spellings without replacing existing aliases or their ranking.
Object.entries(lexicon).forEach(([alias, ids]) => {
  const folded = foldDiacritics(alias);
  if (!Object.hasOwn(lexicon, folded)) {
    lexicon[folded] = [...ids];
  }
});

const isOffset = /^([-+]?[0-9]+)h(r?s)?$/i;
const isNumber = /^([-+]?[0-9]+)$/;
const utcOffset = /^utc([\-+]?[0-9]+)$/i;
const gmtOffset = /^(?:etc\/)?gmt([\-+]?[0-9]+)$/i;

const toIana = (num) => {
  num = Number(num);
  if (num === 0) {
    return 'Etc/GMT'
  }
  if (num >= -12 && num <= 14) {
    num = num * -1; // IANA Etc/GMT signs are reversed.
    num = (num > 0 ? '+' : '') + num;
    return 'Etc/GMT' + num
  }
  return null
};

const parseOffset = (tz) => {
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

const utcNames = ['utc', 'uct', 'universal', 'zulu', 'coordinated universal', 'coordinated universal time'];

const matchReservedName = (input) => {
  if (utcNames.includes(input)) {
    return 'Etc/UTC'
  }
  if (input === 'gmt') {
    return 'Etc/GMT'
  }
  return null
};

const matchAlias = (input) => (Object.hasOwn(lexicon, input) ? lexicon[input] : null);

const matchNormalizedAlias = (input) => matchReservedName(input) || matchAlias(input);

// Complete-input matching only; compound fallbacks run afterward.
const matchWhole = (input) => {
  const normalized = normalizeCase(input);

  // 1. Reserved UTC/GMT names take precedence over geographic aliases.
  const reserved = matchReservedName(normalized);
  if (reserved) {
    return reserved
  }

  // 2. Slash inputs require a known IANA ID or exact curated alias.
  if (normalized.includes('/')) {
    const id = canonicalIds[normalized];
    if (id) {
      return Object.hasOwn(zones, id) ? id : null
    }
    return matchAlias(normalized)
  }

  // 3. Preserve an exact alias before changing its spelling.
  const exact = matchAlias(input);
  if (exact) {
    return exact
  }

  // 4. Parse whole-hour offsets, such as UTC+5, GMT-5, or +5hrs.
  if (/[0-9]/.test(input)) {
    const offset = parseOffset(input);
    if (offset) {
      return [offset]
    }
  }

  // 5. Try phrase, geographic, punctuation, and city-spelling checkpoints.
  const candidates = getAliasCandidates(input);
  for (let i = 0; i < candidates.length; i += 1) {
    const match = matchNormalizedAlias(candidates[i]);
    if (match) {
      return match
    }
  }

  // 6. Fold accents after exact spellings, including the case-only candidate.
  const foldCandidates = [normalized, ...candidates];
  for (let i = 0; i < foldCandidates.length; i += 1) {
    const folded = foldDiacritics(foldCandidates[i]);
    const match = matchNormalizedAlias(folded);
    if (match) {
      return match
    }
  }
  return null
};

const matchPart = (input) => {
  const found = matchWhole(input);
  const ids = typeof found === 'string' ? [found] : found || [];
  return [...new Set(ids.map(canonicalize))]
};

// Preserve the first part's ranking while removing candidates absent elsewhere.
const intersect = (lists) => lists[0].filter((id) => lists.every((list) => list.includes(id)));

const matchSeparatedParts = (input) => {
  const parts = input
    .split(/[,()]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const matches = parts.map(matchPart).filter((ids) => ids.length);
  // Ignore unknown parts; conflicting known parts keep an empty intersection.
  return matches.length ? intersect(matches) : null
};

const matchWordPairs = (input) => {
  const words = input.trim().split(/\s+/);
  // Try splits left to right. Both sides must resolve: "CST China".
  for (let boundary = 1; boundary < words.length; boundary += 1) {
    const left = matchPart(words.slice(0, boundary).join(' '));
    if (!left.length) {
      continue
    }
    const right = matchPart(words.slice(boundary).join(' '));
    if (!right.length) {
      continue
    }
    const shared = intersect([left, right]);
    if (shared.length) {
      return shared
    }
  }
  return null
};

const find = (input) => {
  // Whole input, including normalization and accent folding.
  const whole = matchWhole(input);
  if (whole) {
    return whole
  }

  // Unknown identifiers cannot fall back to partial matches.
  if (input.includes('/')) {
    return null
  }

  // Explicit separators take precedence over word-pair guesses.
  if (/[,()]/.test(input)) {
    return matchSeparatedParts(input)
  }

  // Last resort: intersect two recognized phrases.
  return matchWordPairs(input)
};

// Generated by scripts/build/01-pack.js. Edit data/metas.js instead.
var metas = {"British Columbia":{"name":"British Columbia Time","std":["MST",-7,"Mountain Standard Time"],"long":"(UTC-07:00) British Columbia"},"Alberta and Northwest Territories":{"name":"Alberta and Northwest Territories Time","std":["CST",-6,"Central Standard Time"],"long":"(UTC-06:00) Alberta and Northwest Territories"},"Manitoba":{"name":"Manitoba Time","std":["EST",-5,"Eastern Standard Time"],"long":"(UTC-05:00) Manitoba"},"Ulyanovsk":{"std":["+04",4,"Ulyanovsk Time"]},"Astrakhan":{"std":["+04",4,"Astrakhan Time"]},"Tomsk":{"std":["+07",7,"Tomsk Time"]},"Syria":{"std":["+03",3,"Syria Time"]},"Jordan":{"std":["+03",3,"Jordan Time"]},"Bougainville":{"std":["+11",11,"Bougainville Time"]},"Magallanes":{"std":["-03",-3,"Magallanes Time"],"long":"(UTC-03:00) Punta Arenas"},"Galapagos":{"std":["GALT",-6],"long":"(UTC-06:00) Galapagos Islands"},"Hawaii":{"name":"Hawaii Time","std":["HST",-10,"Hawaii Standard Time"],"long":"(UTC-10:00) Hawaii"},"UTC":{"name":"Coordinated Universal Time","std":["UTC",0,"Coordinated Universal Time"],"long":"(UTC+00:00) Coordinated Universal Time"},"Aysen":{"name":"Aysen Time","std":["-03",-3,"Aysen Time"],"long":"(UTC-03:00) Coyhaique"},"Palmer":{"std":["-03",-3,"Palmer Time"],"long":"(UTC-03:00) Palmer"},"Xinjiang":{"std":["+06",6,"Xinjiang Time"],"name":"Xinjiang Time","long":"(UTC+06:00) Xinjiang Time"},"India":{"std":["IST",5.5],"long":"(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi"},"China":{"std":["CST",8],"long":"(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi"},"Central European":{"std":["CET",1],"dst":["CEST",2,"Central European Summer Time"],"long":"(UTC+01:00) Brussels, Copenhagen, Madrid, Paris"},"Atlantic":{"std":["AST",-4],"dst":["ADT",-3],"long":"(UTC-04:00) Atlantic Time (Canada)"},"Greenwich Mean":{"std":["GMT",0],"long":"(UTC) Coordinated Universal Time"},"Eastern European":{"std":["EET",2],"dst":["EEST",3,"Eastern European Summer Time"]},"Central":{"std":["CST",-6],"dst":["CDT",-5],"long":"(UTC-06:00) Central Time (US & Canada)"},"Eastern":{"std":["EST",-5],"dst":["EDT",-4],"long":"(UTC-05:00) Eastern Time (US & Canada)"},"Argentina":{"std":["ART",-3],"long":"(UTC-03:00) City of Buenos Aires"},"East Africa":{"std":["EAT",3],"long":"(UTC+03:00) Nairobi"},"West Africa":{"std":["WAT",1],"long":"(UTC+01:00) West Central Africa"},"Moscow":{"std":["MSK",3],"long":"(UTC+03:00) Moscow, St. Petersburg"},"Brasilia":{"std":["BRT",-3],"long":"(UTC-03:00) Brasilia"},"Mountain":{"std":["MST",-7],"dst":["MDT",-6],"long":"(UTC-07:00) Mountain Time (US & Canada)"},"Central Africa":{"std":["CAT",2],"long":"(UTC+02:00) Windhoek"},"Arabian":{"std":["AST",3],"long":"(UTC+03:00) Kuwait, Riyadh"},"Alaska":{"std":["AKST",-9],"dst":["AKDT",-8],"long":"(UTC-09:00) Alaska"},"British":{"std":["GMT",0],"dst":["BST",1,"British Summer Time"],"long":"(UTC+00:00) Dublin, Edinburgh, Lisbon, London"},"Irish":{"std":["GMT",0,"Greenwich Mean Time"],"dst":["IST",1,"Irish Standard Time"]},"West Kazakhstan":{"std":["ALMT",5],"long":"(UTC+05:00) Ashgabat, Tashkent"},"Eastern Australia":{"std":["AEST",10],"dst":["AEDT",11,"Australian Eastern Daylight Time"],"long":"(UTC+10:00) Canberra, Melbourne, Sydney"},"Western European":{"std":["WET",0],"dst":["WEST",1,"Western European Summer Time"]},"Indochina":{"std":["ICT",7],"long":"(UTC+07:00) Bangkok, Hanoi, Jakarta"},"Central Mexico":{"long":"(UTC-06:00) Guadalajara, Mexico City, Monterrey","std":["CST",-6],"dst":["CDT",-5,"Central Daylight Time"]},"South Africa":{"std":["SAST",2],"long":"(UTC+02:00) Harare, Pretoria"},"Krasnoyarsk":{"std":["KRAT",7],"long":"(UTC+07:00) Krasnoyarsk"},"Yakutsk":{"std":["YAKT",9],"long":"(UTC+09:00) Yakutsk"},"Pacific":{"std":["PST",-8],"dst":["PDT",-7],"long":"(UTC-08:00) Pacific Time (US & Canada)"},"Amazon":{"std":["AMT",-4],"long":"(UTC-04:00) Cuiaba"},"Morocco Standard":{"long":"(UTC+00:00) Casablanca","std":["+00",0]},"Gulf":{"std":["GST",4],"long":"(UTC+04:00) Abu Dhabi, Muscat"},"Samara":{"std":["SAMT",4],"long":"(UTC+04:00) Izhevsk, Samara"},"Uzbekistan":{"std":["UZT",5]},"East Kazakhstan":{"std":["ALMT",5],"long":"(UTC+05:00) Astana"},"Omsk":{"std":["OMST",6],"long":"(UTC+06:00) Omsk"},"Western Indonesia":{"std":["WIB",7]},"Ulaanbaatar":{"std":["ULAT",8],"long":"(UTC+08:00) Ulaanbaatar"},"Malaysia":{"std":["MYT",8]},"Korean":{"std":["KST",9],"long":"(UTC+09:00) Seoul"},"Central Australia":{"std":["ACST",9.5],"dst":["ACDT",10.5,"Australian Central Daylight Time"],"long":"(UTC+09:30) Adelaide"},"Brisbane":{"std":["AEST",10]},"Vladivostok":{"std":["VLAT",10],"long":"(UTC+10:00) Vladivostok"},"Chamorro":{"std":["ChST",10],"long":"(UTC+10:00) Guam, Port Moresby"},"Papua New Guinea":{"std":["PGT",10]},"New Zealand":{"std":["NZST",12],"dst":["NZDT",13],"long":"(UTC+12:00) Auckland, Wellington"},"Marshall Islands":{"std":["MHT",12]},"Samoa":{"std":["SST",-11],"long":"(UTC+13:00) Samoa"},"Mexican Pacific":{"std":["HNPMX",-7],"dst":["HEPMX",-6],"long":"(UTC-07:00) Chihuahua, La Paz, Mazatlan"},"Colombia":{"std":["COT",-5]},"Acre":{"std":["ACT",-5]},"Chile":{"std":["CLT",-4],"dst":["CLST",-3,"Chile Summer Time"]},"Troll":{"std":["GMT",0],"dst":["+02",2,"Troll Summer Time"]},"East Greenland":{"std":["EGT",-2],"dst":["EGST",-1,"East Greenland Summer Time"]},"Israel":{"std":["IST",2],"dst":["IDT",3],"long":"(UTC+02:00) Jerusalem"},"Turkey":{"std":["TRT",3],"long":"(UTC+03:00) Istanbul"},"Iran":{"std":["IRST",3.5],"dst":["IRDT",4.5],"long":"(UTC+03:30) Tehran"},"Azerbaijan":{"std":["AZT",4],"long":"(UTC+04:00) Baku"},"Georgia":{"std":["GET",4],"long":"(UTC+04:00) Tbilisi"},"Armenia":{"std":["AMT",4],"long":"(UTC+04:00) Yerevan"},"Seychelles":{"std":["SCT",4]},"Mauritius":{"std":["MUT",4],"long":"(UTC+04:00) Port Louis"},"Réunion":{"std":["RET",4]},"Afghanistan":{"std":["AFT",4.5],"long":"(UTC+04:30) Kabul"},"Mawson":{"std":["MAWT",5]},"Turkmenistan":{"std":["TMT",5]},"Tajikistan":{"std":["TJT",5]},"Pakistan":{"std":["PKT",5],"long":"(UTC+05:00) Islamabad, Karachi"},"Yekaterinburg":{"std":["YEKT",5],"long":"(UTC+05:00) Ekaterinburg"},"French Southern & Antarctic":{"std":["TFT",5]},"Maldives":{"std":["MVT",5]},"Nepal":{"std":["NPT",5.75],"long":"(UTC+05:45) Kathmandu"},"Vostok":{"std":["+05",5]},"Kyrgyzstan":{"std":["KGT",6]},"Bangladesh":{"std":["BST",6],"long":"(UTC+06:00) Dhaka"},"Bhutan":{"std":["BT",6]},"Indian Ocean":{"std":["IOT",6]},"Myanmar":{"std":["MMT",6.5],"long":"(UTC+06:30) Yangon (Rangoon)"},"Cocos Islands":{"std":["CCT",6.5]},"Davis":{"std":["DAVT",7]},"Hovd":{"std":["HOVT",7],"long":"(UTC+07:00) Hovd"},"Novosibirsk":{"std":["NOVT",7],"long":"(UTC+07:00) Novosibirsk"},"Christmas Island":{"std":["CXT",7]},"Brunei Darussalam":{"std":["BNT",8]},"Hong Kong":{"std":["HKT",8]},"Irkutsk":{"std":["IRKT",8],"long":"(UTC+08:00) Irkutsk"},"Central Indonesia":{"std":["WITA",8]},"Philippine":{"std":["PHST",8]},"Singapore":{"std":["SGT",8],"long":"(UTC+08:00) Kuala Lumpur, Singapore"},"Taipei":{"std":["CST",8],"long":"(UTC+08:00) Taipei"},"Western Australia":{"std":["AWST",8],"long":"(UTC+08:00) Perth"},"Australian Central Western":{"std":["ACWST",8.75],"long":"(UTC+08:45) Eucla"},"East Timor":{"std":["TLT",9]},"Eastern Indonesia":{"std":["WIT",9]},"Japan":{"std":["JST",9],"long":"(UTC+09:00) Osaka, Sapporo, Tokyo"},"Palau":{"std":["PWT",9]},"Australian Central":{"std":["ACST",9.5]},"Chuuk":{"std":["CHUT",10]},"Lord Howe":{"std":["LHST",10.5],"dst":["LHDT",11],"long":"(UTC+10:30) Lord Howe Island"},"Casey":{"std":["CAST",8]},"Magadan":{"std":["MAGT",11],"long":"(UTC+11:00) Magadan"},"Sakhalin":{"std":["SAKT",11],"long":"(UTC+11:00) Sakhalin"},"Srednekolymsk":{"std":["SRET",11],"long":"(UTC+11:00) Chokurdakh"},"Vanuatu":{"std":["VUT",11]},"Solomon Islands":{"std":["SBT",11]},"Kosrae":{"std":["KOST",11]},"New Caledonia":{"std":["NCT",11]},"Ponape":{"std":["PONT",11]},"Anadyr":{"std":["ANAT",12],"long":"(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky"},"Petropavlovsk-Kamchatski":{"std":["PETT",12],"long":"(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky"},"Fiji":{"std":["FJT",12],"long":"(UTC+12:00) Fiji"},"Tuvalu":{"std":["TVT",12]},"Nauru":{"std":["NRT",12]},"Norfolk Island":{"std":["NFT",11],"dst":["NFDT",12],"long":"(UTC+11:00) Norfolk Island"},"Gilbert Islands":{"std":["GILT",12]},"Wake Island":{"std":["WAKT",12]},"Wallis & Futuna":{"std":["WFT",12]},"Chatham":{"std":["CHAST",12.75],"dst":["CHADT",13.75],"long":"(UTC+12:45) Chatham Islands"},"West Samoa":{"std":["WST",13],"dst":["WST",14,"West Samoa Summer Time"]},"Phoenix Islands":{"std":["PHOT",13]},"Tokelau":{"std":["TKT",13]},"Tonga":{"std":["TOT",13],"long":"(UTC+13:00) Nuku'alofa"},"Line Islands":{"std":["LINT",14],"long":"(UTC+14:00) Kiritimati Island"},"Niue":{"std":["NUT",-11]},"Cook Islands":{"std":["CKT",-10]},"Tahiti":{"std":["TAHT",-10]},"Marquesas":{"std":["MART",-9.5],"long":"(UTC-09:30) Marquesas Islands"},"Aleutian Standard":{"std":["HST",-10],"dst":["HDT",-9,"Hawaii Daylight Time"]},"Gambier":{"std":["GAMT",-9],"long":"(UTC-09:00) Coordinated Universal Time-09"},"Pitcairn":{"std":["PST",-8],"long":"(UTC-08:00) Coordinated Universal Time-08"},"Easter Island":{"std":["EAST",-6],"dst":["EASST",-5,"Easter Island Summer Time"],"long":"(UTC-06:00) Easter Island"},"Ecuador":{"std":["ECT",-5]},"Cuba":{"std":["HNCU",-5],"dst":["HECU",-4],"long":"(UTC-05:00) Havana"},"Peru":{"std":["PET",-5]},"Paraguay":{"std":["PYT",-3],"long":"(UTC-03:00) Asuncion"},"Venezuela":{"std":["VET",-4],"long":"(UTC-04:00) Caracas"},"Guyana":{"std":["GYT",-4]},"Bolivia":{"std":["BOT",-4]},"Newfoundland":{"std":["HNTN",-3.5],"dst":["HETN",-2.5],"long":"(UTC-03:30) Newfoundland"},"French Guiana":{"std":["GFT",-3]},"West Greenland":{"std":["WGT",-2],"dst":["WGST",-1,"West Greenland Summer Time"],"long":"(UTC-02:00) Greenland"},"St. Pierre & Miquelon":{"std":["HNPM",-3],"dst":["HEPM",-2],"long":"(UTC-03:00) Saint Pierre and Miquelon"},"Uruguay":{"std":["UYT",-3],"long":"(UTC-03:00) Montevideo"},"Suriname":{"std":["SRT",-3]},"Falkland Islands":{"std":["FKST",-3]},"Fernando de Noronha":{"std":["FNT",-2]},"South Georgia":{"std":["GST",-2]},"Azores":{"std":["AZOT",-1],"dst":["AZOST",0,"Azores Summer Time"],"long":"(UTC-01:00) Azores"},"Cape Verde":{"std":["CVT",-1],"long":"(UTC-01:00) Cabo Verde Is."}};

const formatOffset = (offset) => {
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
  if (i <= 12) {
    metas[`gmt+${i}`] = {
      name: `Etc/GMT+${i}`,
      std: [`GMT+${i}`, -i],
      long: `(${formatOffset(-i)}) Coordinated Universal Time`
    };
  }
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
    long: long
  }
};

// Generated by scripts/build/02-version.js.
var version = '1.6.0';

const soft = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('timezone-soft expects a string')
  }
  let ids = find(str) || [];
  if (typeof ids === 'string') {
    ids = [ids];
  }
  ids = [...new Set(ids.map(canonicalize))].filter((id) => Object.hasOwn(zones, id));
  ids = ids.map((id) => display(id));
  return ids
};
soft.version = version;
soft.prototype.version = version; // retain compatibility with earlier releases

module.exports = soft;
