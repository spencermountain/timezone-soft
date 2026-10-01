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

// Generated by scripts/build/01-pack.js. Edit data/dst-patterns.json instead.
var dstPatterns = {"usa":"2nd-sun-mar-2h|1st-sun-nov-2h","mex":"1st-sun-apr-2h|last-sun-oct-2h","egypt":"last-fri-apr-0h|last-thu-oct-24h","eu0":"last-sun-mar-0h|last-sun-oct-1h","eu1":"last-sun-mar-1h|last-sun-oct-2h","eu2":"last-sun-mar-2h|last-sun-oct-3h","eu3":"last-sun-mar-3h|last-sun-oct-4h","green":"last-sat-mar-23h|last-sun-oct-0h","aus":"1st-sun-apr-3h|1st-sun-oct-2h","lhow":"1st-sun-oct-2h|1st-sun-apr-2h","chat":"1st-sun-apr-3h|last-sun-sep-2h","nz":"1st-sun-apr-3h|last-sun-sep-2h","ant":"2nd-sun-mar-0h|1st-sun-oct-0h","troll":"last-sun-mar-1h|last-sun-oct-3h","jord":"last-fri-feb-0h|last-fri-oct-1h","leb":"last-sun-mar-0h|last-sun-oct-0h","syr":"last-fri-mar-0h|last-fri-oct-0h","isr":"last-fri-mar-2h|last-sun-oct-2h","pal":"last-sun-mar-0h|last-fri-oct-1h","saha":"last-sun-mar-3h|1st-sun-may-2h","par":"last-sun-mar-0h|1st-sun-oct-0h","cuba":"2nd-sun-mar-0h|1st-sun-nov-1h","chile":"1st-sat-sep-24h|1st-sat-apr-24h","east":"1st-sat-apr-22h|1st-sat-sep-22h","fiji":"3rd-sun-jan-3h|2nd-sun-nov-2h"};

// Generated by scripts/build/01-pack.js. Edit data/ instead.
var pcked = {"Africa":{"Abidjan":["true¦abobo,bouake,c4daloa,g1ivory coast,kumasi,piki5san ped0touba,utc,yamoussouk0zulu;ro;h0mt,reenwich mean;!a0;!na;amayen0ote divoire;ne","Greenwich Mean"],"Algiers":["true¦:a2enitnatsnoc,f1naro,rauozze b3s0terait,zd;adremuob,ebba leb idis;elhc,ites;banna,dilb,iregla,nt0rksib,ssebet,zd;ab","Central European"],"Bissau":["true¦g0utc,zulu;mt,nb,reenwich mean,uinea bissau,w","Greenwich Mean"],"Cairo":["true¦:!1:#$:k la ,na;a8dias trop,fyawus i$b,g7ha5m4$w3oriac wen,r2t0ukdi,y1zeus;py0uysa;ge;awwad da rfak,oxul,uh$mad;lah,sa;uyyaf 6wa#nibi1;myah#arbu0rus$3;hs;ahos,e,izagaz;i1niq,rbu#hallaha0t$t,yni0zig;m 1;liamsi,rd$xe0;la","Eastern European","egypt"],"Casablanca":["true¦:a2dagna adjuo,el7hsekarram,if7nauot4occor6r1se0tabar;f,nkem;am,eignat,idaga;didaj la el4idemmah3m2r0;am0tinek;et;!iecoh la;om;as","Morocco Standard"],"Ceuta":["true¦ceutamelilla,spain","Central European","eu2"],"El_Aaiun":["true¦casablanca,e0laayoune,morocco,western sahara;h,sh","Morocco Standard"],"Johannesburg":["true¦!1:#$%&(:er,africa,ast,on,et;$ south#n,bEcAd9e% l&dBgqeb#ha,k7newc%Dp6r5s3tembisa,uitenhage,v2w1za0;!f;elkom,itbank;and#bijlpark,#eeniging;%,o0prings;uth $,w(o;andBichards bay,oodepoort;aarl,i(#maritzAort elizab(h,r(oria;l#k0rug#0;sdorp;iepsloot,urb5;a1enturi0;&;pe town,rl(&vil0;le;en&i,loemf&tein,o1rakp0;an;ks0tshabelo;burg","South Africa"],"Juba":["true¦c2s0winejok;outh sudan,s0;!d;at,entral africa","Central Africa"],"Khartoum":["true¦a7c6el 5k3ny4omdurm2port sud2s0wad medani;d0inga,ud1;!n;an;ass0hartoum north,osti;ala;dae2fasher,obeid;at,entral africa;d damaz0l qadarif;in","Central Africa"],"Lagos":["true¦:aKdJeDi7n5o2pegu,rabalac,soj,t1u0;asug,doroki etube,gune,magahs;aw,ruocrah trEsaw;dRgnoc,nLtokos,w1y0;o,u;i,o;adabi,i0retsew acirfa,ugnaro aG;neb,roF;bum,druk4hcuab,k3nata,r1tike 0wenn;esi,oda;r0ugudi2;aw,ewo;as,kel;am;bmog,d4ne3r0yaala nofe;i0uka;ki,on etni0;op;ko,pke to9;nuoay,o ubeji;c,oc;ba,cirfa Ahsti9i7j4mawkahc,n2se1t0;emij,ukoe4;li;ist0nim,ud0;ak;e1u0;ba;ki;haumu,r0;az,egin;no;lartnec 0nret1t1;t0w;sew","West Africa"],"Maputo":["true¦:!1:#$%:lartnec,cirfa,na;a3e1i0keohdniw,# a$,oiomihc,tac,wz;%g%sik,yam ijubm;%mileuq,rarah,uqibmazom,w0;babmiz,gnolil,z;$ #,g%%k,ibim1l0rieb;ac0otam,upm0;an","Central Africa"],"Monrovia":["true¦g1l0utc,zulu;br,iberia,r;mt,reenwich mean","Greenwich Mean"],"Nairobi":["true¦africa eastern,e2k1m0nakuru,thika,yt;ayotte,ombasa,wanza,yt;akamega,enya,isumu; 2a0ldoret;st0t; 0ern 0;africa","East Africa"],"Ndjamena":["true¦:acirfa 2d1nretsew acirfa,t0;aw,saw;ahc,ct,t;lartnec 0nret1t1;t0w;sew","West Africa"],"Sao_Tome":["true¦g4s0utc,zulu;ao tome 1t0;!p;and p0p0;rincipe;mt,reenwich mean","Greenwich Mean"],"Tripoli":["true¦a2benghazi,l0misrat3tarhuna,zawi1;by,ib0y;ya;l khums,z zawiy0;ah","Eastern European"],"Tunis":["true¦sfax,t0;n,un0;!isia","Central European"],"Windhoek":["true¦africa central,c2na0;!m0;!ibia;at,entral africa","Central Africa"]},"America":{"Adak":["true¦aleutian4h3nwt,u0;nited states1s0;!a;! of america;awaii s2dt,st;! 0;islands,s0;tandard","Aleutian Standard","usa"],"Anchorage":["true¦a3u0;nited states1s0;!a;! of america;h4k3laska0;! 1n0;! 0;standard;dt,st,t;dt,st","Alaska","usa"],"Araguaina":["true¦!1:#: south ameri;br1e0palmas,tocantins;#ca 3ast#ca;a0t;silia0zil;! 0;standard","Brasilia"],"Argentina/Buenos_Aires":["true¦:anitnegra0gra,ra;!/acirema","Argentina"],"Argentina/Catamarca":["true¦argentina","Argentina"],"Argentina/Cordoba":["true¦argentina","Argentina"],"Argentina/Jujuy":["true¦argentina","Argentina"],"Argentina/La_Rioja":["true¦ar0;gentina0st,t;! standard","Argentina"],"Argentina/Mendoza":["true¦argentina","Argentina"],"Argentina/Rio_Gallegos":["true¦ar0;gentina0st,t;! standard","Argentina"],"Argentina/Salta":["true¦ar0;gentina0st,t;! standard","Argentina"],"Argentina/San_Juan":["true¦ar0;gentina,st,t","Argentina"],"Argentina/San_Luis":["true¦ar0;gentina,st,t","Argentina"],"Argentina/Tucuman":["true¦ar0;gentina,st,t","Argentina"],"Argentina/Ushuaia":["true¦ar0;gentina,st,t","Argentina"],"Asuncion":["true¦c2p0san lorenzo;araguay,ry,y0;!st,t;apiata,iudad del este","Paraguay"],"Bahia":["true¦!1:#: south ameri;br2camacari,e1feira de santa0itabu0salvador,vitoria da conquista;na;#ca 3ast#ca;a0t;silia0zil;! 0;standard","Brasilia"],"Bahia_Banderas":["true¦bahia de banderas,c0guadalajara,mexico;entral 0st;mexic0standard;an,o","Central Mexico"],"Barbados":["true¦a1b0;arbados,b,rb;st,tlantic standard","Atlantic"],"Belem":["true¦!1:#: south ameri;ananindeua,br3e2mac1para0; east am0uapebas;apa;#ca 3ast#ca;a0t;silia0zil;! 0;standard","Brasilia"],"Belize":["true¦b1c0;entral standard,st;elize,lz,z","Central"],"Boa_Vista":["true¦am2brazil,c0roraima;entral brazil0uiaba;!ian1;azon0t;! standard","Amazon"],"Bogota":["true¦:!1:#$%&:ne,ra,ll,na;a5dadelEeugabi,i4lDn3o2$pude%av,s1t0yden#k;oc,sC;adarbeuqsod,elazi&m;c,ic#civa%iv,jelecnis,%eb,ts6;ayapop,i%edem;eugati,l5;c&lbadirolf,g&ma$c9hca8i6jemrebac5%iuq5#gatr4r1t0vien;$m at&s,ucuc;i0ut#va#7;erep,ml0;ap;ac;&r$b;bmol0#m$,retnom;oc;os;ub","Colombia"],"Boise":["true¦!1:#$:america,ountain;# m$,idaho,m3u0;nited states1s0;!a;! of #;$0pt,st,t;! 0;id,standard","Mountain","usa"],"Cambridge_Bay":["true¦america mountain,canada,m0;ddt,ountain0st,t;! standard","Mountain","usa"],"Campo_Grande":["true¦am0brazil,mato grosso do sul;azon standard,t","Amazon"],"Cancun":["true¦e0mexico,quintana roo;astern standard,st","Eastern"],"Caracas":["true¦alto barinHbarGcBgua9m6p5san4turmeDv0;alencia,e0;!n0t;!ezuela0;! standard,n; cristobal,ta teresa del tuy;eta4uerto la cruz;a0ucumpiz;raca0turin;ibo,y;ren7ti0;re;abim5iudad 2o1u0;a,m2;ro;bolivar,guay0;ana;in0quisimeto,uta;as","Venezuela"],"Cayenne":["true¦:anaiug1f0tfg;g,ug;! hcnerf","French Guiana"],"Chicago":["true¦!2;:!1:#$%&(:na,uo,ra,ro,ni;aVd#l%g,eQg(vri,ht&w t&f,iOkLlFnBoAs2t0x8yremogtnU;c,dc0&peverhs,sc;!\\gtsc;a4e3i0#el&2u;hpmem0lopaUo(lli,$lC;! ht$s0; wY;(om sed,tY;llad,s#k1x0;et;!%;de%l,inot# n7lli%9#lp;i2locnBo0;sidam,t0;g(l%,s$h;snocsMtsua;artnec3uap0; t0;(0s;as;! acire0;ma;co0%p d#lrevo;bbul,r eltt0;il;ppissi0r$0tsirhc sup&c;ss9;ekuawl8g$r notab,iriarp d#rg,l0;ib2liv0;hsan,s0;nworb,tnuh;om;cirema fo set9hamo,ksarb8m7#isi$l,s6t0woi;ihc4o0;kad ht2s0;enn0;im;&n,$s;iw;lut,u;abala,ohalko;en;ats detinu","Central","usa"],"Chihuahua":["true¦:cificap 4naltazam,ocixem1xmp0;eh,h,nh;! 0;dradnats n0n0;iatnuom;na0o0;cixem","Central Mexico"],"Ciudad_Juarez":["true¦juarez,mexico","Mountain","usa"],"Coyhaique":["true¦aysen,c0;hile,oihaique","Aysen"],"Costa_Rica":["true¦c0sjmt;entral standard,osta rica,r0st;!i","Central"],"Cuiaba":["true¦am0brazil,mato grosso,varzea grande;azon standard,t","Amazon"],"Danmarkshavn":["true¦denmark,g0utc,zulu;mt,reen0;land,wich mean","Greenwich Mean"],"Dawson":["true¦canada,m2y0;d0pt,wt;dt,t;ountain standard,st","Mountain"],"Dawson_Creek":["true¦canada,m1p0;pt,wt;ountain standard,st,t","Mountain"],"Denver":["true¦!2;!1:#$:ountain,merica;a6colorado springs,el paso,m3navajo,salt lake,u0;nited states1s0;!a;! of a$;dt,#1st0t;!\\hmdt;! standard;lbuquerque,$ m#,urora","Mountain","usa"],"Detroit":["true¦!1:#$:america,astern;# e$,e3grand rapids,u0;nited states1s0;!a;! of #;$0pt,st,t,wt;! 0;mi,standard","Eastern","usa"],"Edmonton":["true¦a3ca2m0;ountain0st,t;! standard;lgary,nada;lberta,merica mountain","Alberta and Northwest Territories"],"Eirunepe":["true¦a0brazil;c0mazonas west;re0t;! standard","Acre"],"El_Salvador":["true¦c2el1s0;an0lv,oyapango,v; salvador;entral standard,st","Central"],"Fort_Nelson":["true¦british columbia,canada,m0;ountain standard,st,t","Mountain"],"Fortaleza":["true¦!1:#$: south ameri,ca;br5$4e3imperatriz,j2m0natal,sao luis,teresina;a0ossoro;picernpb,ra$nau;oao pessoa,uazeiro do norte;#$ 4ast#$;mpina grande,u$ia;a0t;silia0zil;! 0;standard","Brasilia"],"Glace_Bay":["true¦a1ca0;nada,pe breton;st,t0;!lantic0;! standard","Atlantic","usa"],"Goose_Bay":["true¦a0canada,labrador,npt;st,t0;!lantic0;! standard","Atlantic","usa"],"Grand_Turk":["true¦!1:#$%:astern,caicos,and;america e#,e6kmt,t0;c4urks 0;% $0$ 1;! 0;is0;!l%s;!a;#0st,t;! st%ard","Eastern","usa"],"Guatemala":["true¦c2g0mixco,villa nueva;t0uatemala;!m;entral standard,st","Central"],"Guayaquil":["true¦cuenca,ec2ma1q0santo domingo de los colorados;mt,uito;chala,nta;!t,u0;!ador0;! mainland","Ecuador"],"Guyana":["true¦g0;eorgetown,uy1y0;!t;!ana","Guyana"],"Halifax":["true¦a3ca2n1p0;ei,rince edward island;ew brunswick,ova scotia;!nada;dt,st,t0;!lantic0;! 0;ns,standard","Atlantic","usa"],"Havana":["true¦:a7b6dradnats ab6erbutco ed zeid,niugloh,o4s1uc0yeugamac;!eh,h,nh;anut sal,o0;geufneic0reyob;! olimac daduic;ir led ranip,jnaran oyorra,ma0;natnaug,yab;uc;buc0ralc a1;! ed ogai0;tnas","Cuba","cuba"],"Hermosillo":["true¦ciudad obregon,hnpmx,mexic0nogales,sonora;an pacific standard,o","Mexican Pacific"],"Indiana/Indianapolis":["true¦america/i5crawford,dadukmn,eastern in,i5p3star4u0;nited states1s0;!a;! of america;erry,i0ulaski;ke;ndiana","Eastern","usa"],"Indiana/Knox":["true¦c3indiana,u0;nited states1s0;!a;! of america;entral standard,st","Central","usa"],"Indiana/Marengo":["true¦e3indiana,u0;nited states1s0;!a;! of america;astern standard,st","Eastern","usa"],"Indiana/Petersburg":["true¦e3indiana,u0;nited states1s0;!a;! of america;astern standard,st","Eastern","usa"],"Indiana/Tell_City":["true¦c3indiana,u0;nited states1s0;!a;! of america;entral standard,st","Central","usa"],"Indiana/Vevay":["true¦e3indiana,u0;nited states1s0;!a;! of america;astern standard,st","Eastern","usa"],"Indiana/Vincennes":["true¦e3indiana,u0;nited states1s0;!a;! of america;astern standard,st","Eastern","usa"],"Indiana/Winamac":["true¦e3indiana,u0;nited states1s0;!a;! of america;astern standard,st","Eastern","usa"],"Inuvik":["true¦america mountain,canada,m0pddt;ountain0st,t;! standard","Alberta and Northwest Territories"],"Iqaluit":["true¦america eastern,canada,e0;astern0ddt,st,t;! standard","Eastern","usa"],"Jamaica":["true¦e3j1k0new k0;ingston;am0m;!aica;astern standard,st","Eastern"],"Juneau":["true¦a3u0;nited states1s0;!a;! of america;k4laska0;! 1n0;! s1;juneau area,s0;tandard;st,t","Alaska","usa"],"Kentucky/Louisville":["true¦america/k3eastern 4k3u0wayne;nited states1s0;!a;! of america;entuc0;ky","Eastern","usa"],"Kentucky/Monticello":["true¦e3kentucky,u0;nited states1s0;!a;! of america;astern standard,st","Eastern","usa"],"La_Paz":["true¦bo1cochabamba,oruro,s0;anta cruz de la sierra,ucre;!l0t;!ivia","Bolivia"],"Lima":["true¦arequiBc7huancAi6juliaca,p2sant1t0;acna,rujillo;a anita los ficus,iago de sur6;e0iura,ucall8;!r0t;!u0;! standard;ca,quitos;allao,hi1us0;co;cl0mbote;ayo;pa","Peru"],"Los_Angeles":["true¦!2;:!1:#$%&()*:na,ir,no,cific,ro,ts,ema;aP&apOdKeEfs,hcaeb Dmieha#,nAo5(#m es$nus,s3t1yellav 0;gn$Honer6;dp0%m7p,sp;!\\i)p;agev sal0eSu;! ht(n;csic#6geidAn2t0;n*rcMsed0;om;er,idranreb7s0;erf;a1o0;ge(,sredneh,tkco);rf3;g%l,%tgnitnuh;dis4lttaes,n2s0ta) %tgnihsaw,vorg nedrag;idar6oj0; nC;ako0ivri;ps;#eco,rev$;leifsrekA#l2ra0;d#) &0nxo;ap;kao,t(p;! ac$*;c$* fo se6daven,g%macuc ohc#r,in(filac4l,mocat,#1su,t0;$alc 1siv aluhc; 0t%f;atn0;as;! aj0;ab;ta) detinu","Pacific","usa"],"Maceio":["true¦!1:#: south ameri;a5br1e0;#ca 3ast#ca;a0t;silia0zil;! 0;standard;lagoassergipe,racaju","Brasilia"],"Managua":["true¦c2ni0;!c0;!aragua;entral standard,st","Central"],"Manaus":["true¦am3brazil,c0;entral brazil0uiaba;!ian0;! 2;azon0t;! 0as east;standard","Amazon"],"Martinique":["true¦a3f1m0;a1q,tq;fmt,ort de france,rench ma0;rtinique;st,tlantic standard","Atlantic"],"Matamoros":["true¦america central,c0heroica matamoros,mexico,nuevo laredo,reynosa;entral0st,t;! standard","Central","usa"],"Mazatlan":["true¦:!1:#$%:dradnats ,ficap ,cixem;auhauhihc,ci4#ci$na5nacailuc,o%1sihcom sol,xmp0;h,nh;! 0;#n0n0;iatnuom;$o0pet;%","Mexican Pacific"],"Menominee":["true¦!1:#$:america,entral;# c$,c3u0wisconsin;nited states1s0;!a;! of #;$0st,t;! standard","Central","usa"],"Merida":["true¦c0guadalajara,mexico;ampeche2entral 0st;mexic0standard;an,o;!yucatan","Central Mexico"],"Metlakatla":["true¦a3u0;nited states1s0;!a;! of america;k4laska0;! 1n0;! s1;annette island,s0;tandard;st,t","Alaska","usa"],"Mexico_City":["true¦:!1:#$%&()*+-./<=>?@[: ed ,ed ,la,ac,na, o,ap,al,at,oc,hc,ra,re,et,eu,da,lerom;a0Ac08d<d(ts 07e06i04ltoy.%uhazen03nToBs6t5x4z0;e0urca=v;/(s)(icarg#@delos,<uj 0uqirne#*a%x;$0otineb;(p%cuan,.lup&a;em,m;sc,wc;a2>nei%csauga,o0;c%.azta.,>am zepolV[0;!#cep>&e;c>&Np0=rtn. ane%dgam;a8iluam-;cAg5r2t0;au0os#&u/*;ja(ug,pari;-e=uq1e0;@m)flo@)v-sYmor s+.in,r=Y;!#ogaitO;%dih2n0;arud,ic(pl0;i/;! 0;$&ir azop,l?gG;ix4l1s0;abUi%j;a0imi/ox;ca0ztop&za;.,tO;!em0;! E;a1o0;el)v?n,gerbo)<v%;c2p0t&uy;auru,lQop0;az;a0ixem 8;o1uh0;>,%mi/ ai<m -4;/0yI;im; @duic;l%czi (ltit4sotop siul 0;(s;/epm&,l%v l$ainolDuq*?qG;%rtn4;auhEom>h0;uaH;cDi[,l6m5pa%p-4<ja%@3som=h+liv,t2uga#ojo,y+1z(rr&)(itsun0;ev;ec;r+%v)tr7sivan?b;ug;zi;ad% sol#noel,il3;a4b3iuha2t1u/*0;-;(penl3xut;.;?p;cx0not;+t;a1ul0;*-xi,ot;van=0xao;uc","Central Mexico"],"Miquelon":["true¦:!1:#$:rreip,noleuqim ;dradnats 4e5mp3$0;dna e# t1e#0;! t0;n3s;!h,nh,s;e0$e# ts;# tn0;ias","St. Pierre & Miquelon","usa"],"Moncton":["true¦a0canada,hepm,new brunswick;st,t0;!lantic0;! standard","Atlantic","usa"],"Monterrey":["true¦:a5dradnats 4epu6n3o0tsc;ci0debocse lareneg7gnarud ed airotciv,icalap zemog,llitl6redam7;pmat,xem0;! 1;acixem 0oerrot;lartnec;cadopa2irotciv2niratac atn1raja0volcnom,zrag sol ed salocin n1;ladaug;as; daduic","Central Mexico"],"Montevideo":["true¦montevideo 4u0;r1y0;!st,t;uguay0y;! 0;standard","Uruguay"],"New_York":["true¦!2;:!1:#$%&()*+-./<:ts,re,ni,ro,al,no,ne,ta,or,ae,ih,el;a08c06dZePgrubs$tep #,hNiLkKlJmInBo8$#e7s4t2x)rb eht,y0;es$j0kcut*k,n;! S;de0e,)m$v,se,ucitcenn3;!\\f#e;d.m,e0D*e4$k)y,ttesuhcassYu0wen t&pP;!bmul0;oc;c&w,hc-;d1/o,laffub,- anat%0&bs*erg;uq;<ot,n(&;a5o1$#.0ylko-b;! aci$ma;rka,t0;g%1sob0;! htuW;hQxB;g/c4t+hnL;ahrud,<as )#%w;a&c epac,f;lofrSra9;ma0+n%c%c;im;.la/,c.b ai%griv,g0subt(f C;i<arRrubsttip;c*div-p,ess8k.paseRl5%Dr3t0;a# k&y 3t0;eyaf )tg%x0olraP;<;aw(ed,/spmah 0omitlab;wen;ad$du( t&f,liv0;etteyaf,)0xonk;ri,skcaj;ah(lAen*t;n1radna# n$0;#.;(0omhcir;ev<c,si 1yr0;am;edohr,*+0;#;d )tg%h0yn;saw;ci$ma fo se9di&lf,goonat+8i5n1pm0su,tn(+;at;aid%,il-ac ht0;r1u0;os;on;g&eg,hpled(/p,n0;avlysn*p,igriv0;! #ew;hc;+# detinu","Eastern","usa"],"Nipigon":["true¦america eastern,canada,e0;astern0st,t;! standard","Eastern","usa"],"Nome":["true¦a3u0;nited states1s0;!a;! of america;k4laska0;! 1n0;! s1;s0west;tandard;st,t","Alaska","usa"],"Noronha":["true¦atlantic islands,brazil,f0;ernando de noronha0nt;! standard","Fernando de Noronha"],"North_Dakota/Beulah":["true¦c3north dakota,u0;nited states1s0;!a;! of america;entral standard,st","Central","usa"],"North_Dakota/Center":["true¦c4merc3north dakota,oliv3u0;nited states1s0;!a;! of america;er;entral standard,st","Central","usa"],"North_Dakota/New_Salem":["true¦c3north dakota,u0;nited states1s0;!a;! of america;entral standard,st","Central","usa"],"Nuuk":["true¦g1wg0;st,t;l,r0;eenland,l","West Greenland","green"],"Ojinaga":["true¦america central,c0mexico;entral0hihuahua,st,t;! standard","Central","usa"],"Panama":["true¦atikokan,coral h,e2pa0san miguelito;!n0;!ama;astern standard,st","Eastern"],"Pangnirtung":["true¦a2baffin island,canada,e0nunavit;astern0st,t;! standard;ddt,merica eastern","Eastern","usa"],"Paramaribo":["true¦s0;r1ur0;!iname;!t","Suriname"],"Phoenix":["true¦!2;arizoDcBg9idaho,m6n5s4t3u0wyoming;nited states1s0tah;!a;! of america;empe,ucson;cottsd5inaloa,onora;ayarit,ew mexico;aryv3esa,o1st0t,wt;!\\hmdt;nta4untain standard;ilbert,lend0;ale;h0olorado;andler,ihuahua;na","Mountain"],"Port-au-Prince":["true¦:dradnats nretsae,ellivnoitep,it2nretsae1ruoferrac,steuquob sed xiorc,t0xiap ed trop;e,h,se;! acirema;h,iah","Eastern","usa"],"Porto_Velho":["true¦am2brazil,c0rondonia;entral brazil0uiaba;!ian1;azon0t;! standard","Amazon"],"Puerto_Rico":["true¦a2bayamon,p0;r0uerto rico;!i;st,tlantic standard","Atlantic"],"Punta_Arenas":["true¦c0region of magallanes;hile0lt;! standard","Magallanes"],"Rainy_River":["true¦america central,c0ft frances;anada,entral0st,t;! standard","Central","usa"],"Rankin_Inlet":["true¦america central,c0;anada,ddt,entral0st,t;! standard","Central","usa"],"Recife":["true¦!1:#$: south ameri,ar;br4c$u$u,e3jaboatao2olinda,p0;aulista,e0;rnambuco,trolina;! dos gu$$apes;#ca 3ast#ca;a0t;silia0zil;! 0;stand$d","Brasilia"],"Regina":["true¦c2s0;askat0k;chewan,oon;anada,entral standard,st","Central"],"Resolute":["true¦america central,c0;anada,entral0st,t;! standard","Central","usa"],"Rio_Branco":["true¦ac0brazil;re0t;! standard","Acre"],"Santarem":["true¦!1:#: south ameri;br1e0para west;#ca 3ast#ca;a0t;silia0zil;! 0;standard","Brasilia"],"Santiago":["true¦a7c3iquique,la pintana,puente alto,rancagua,san bernardo,t1v0;alparaiso,ina del mar;alca0emuco;!huano;h1l0oncepcion;!st,t;ile0l;! standard;ntofagasta,rica","Chile","chile"],"Santo_Domingo":["true¦a7bella vista,do5la romana,s0;an0dmt; pedro de macoris,t0;iago de los caballeros,o domingo 0;e0oe0;ste;!m0;!inican republic;st,tlantic standard","Atlantic"],"Sao_Paulo":["true¦:!1:#$%&()*+-./<=>: o,d ,irema htuos ,na, e,ra,ir,re,ac,at,ro,sa,rb,iv;0:11;a08d)d&ts a07eTiQlPmNoG=,s4t3u1;anemulb,bme,caugi 1ruQ;aJo$zof;=,s=;a8e5ilop2o1;hl0Cl)cUpm- sD)lc setn6t&s;a&,o1;n1rt6;a*olf,>id;)dalav /dan+vog,ven <d#aAz1;-.yog so$so5urc <$ig1;om;ix-($euqud,ni3o2tol1;ep;gal(tes,n0;pm0;ama>,c<so,d6grubmah#5*,&zLpm-#d#d)n+bJr4terp#1xor d/flG;a2* 1;o$esG;riebM;alcJie&j(dJ;von;lopoelDnuf#s<p;eg.nWi1;rimep.i(d#rieohc0t8;ev-s0iza=,us#$<ix0;a2e)caj,o+tin,+ur1t*em(d#a8vep09;ab;idnL/b07tavarg;d9ll>nioj,r7s5t1;abuIn1seo$a)b)bR;e2oz*oh#l1;eb;c>2durp(tnedise9;oj1;#O;am1d&#Mgela#tr9;us;&rg 2+v1;#2;aia2o1;*;rp;c%e,ili<J;bPcOdNgniLhlev alKiAj9meda8n6r2ssorg .n1uM;op;b,iemil,of($zi3+s1;! ad#aob1;.;uj;-*ema,i1;rdnol,tla&lp;id;u)ug;d&l9li7&iog6r2t1zul3;oc;am1ot8; a1;tn1;as;!($adice)pa;r5<1;=;ot/h,rC;>;r1tapi;am;a/vla,noder .lov;%t<e,&rf;a5i3ut1;aiadni,eceuqauq1;.i;t*uc,ucipar0;-;c2r1;ebu;icarip,o/s","Brasilia"],"Scoresbysund":["true¦!1:#:greenland;e3#2h0ittoqqortoormiit;e0neg;eg,g;! eastern;ast #1g0;st,t;! standard","East Greenland","green"],"Sitka":["true¦a3u0;nited states1s0;!a;! of america;k4laska0;! s1n0;! st1;itka area,t0;andard;st,t","Alaska","usa"],"St_Johns":["true¦canada,h4n0;d2ewfoundland0st,t;! 0;labrador,standard;dt,t;e0n0tn;tn","Newfoundland","usa"],"Swift_Current":["true¦c0saskatchewan;anada,entral standard,st","Central"],"Tegucigalpa":["true¦c2h0san pedro sula;n0onduras;!d;entral standard,st","Central"],"Thule":["true¦a0greenland,pituffik;st,t0;!lantic0;! standard","Atlantic","usa"],"Thunder_Bay":["true¦canada,e0;astern,st,t","Eastern","usa"],"Tijuana":["true¦america pacific,baja california,ensenada,h3mexic2p0;acific0st,t;! standard;ali,o;e0n0;nomx","Pacific","usa"],"Toronto":["true¦:aAcebeuq,dradnats nretsae,eirrab,l7mahkram,n3oiratno2r1t0uaenitag;e,se;enehctik,osdniw;! nod5;a2ot1retsae0;! acirema;limah,pmarb;c,epen,hguav;a1iueug0lih dnomhcir;nol;ertnom,val;c,danac,guassissim,wa0;hso,tto","Eastern","usa"],"Vancouver":["true¦america pacific,b4ca3ladner,okanagan,p0surrey,victor5yukon;acific0st,t;! 0;bc,standard;!nada;ritish columb0urnaby;ia","British Columbia"],"Whitehorse":["true¦canada,m0yst;ountain standard,st","Mountain"],"Winnipeg":["true¦america central,c1m0west m0;anitoba;anada,entral0st,t;! standard","Manitoba"],"Yakutat":["true¦a3u0;nited states1s0;!a;! of america;k4laska0;! 1n0;! s1;s0yakutat;tandard;st,t","Alaska","usa"],"Yellowknife":["true¦america mountain,canada,m0;ountain0st,t;! standard","Mountain","usa"]},"Antarctica":{"Palmer":["true¦antarctica","Palmer"],"Casey":["true¦antarctica,cast","Casey"],"Davis":["true¦a0davt;ntarctica,q,ta","Davis"],"Macquarie":["true¦a0macquarie island;e4us0; east1tralia0;! eastern;!ern0;! standard;st,t","Eastern Australia","aus"],"Mawson":["true¦antarctica,mawt","Mawson"],"Rothera":["true¦a0;ntarctica,r0;gentina,st,t","Argentina"],"Troll":["true¦antarctica,g0troll research station;mt,reenwich mean","Troll","troll"],"Vostok":["true¦!2;antarctica,msk+\\e,vost","Vostok"]},"Asia":{"Urumqi":["true¦china,kashgar,urumchi,wulumuqi,xinjiang","Xinjiang"],"Almaty":["true¦a7central asia,east kazakhs6k2nur sul6p1s0taraz,ust kamenogorsk;emey,hymkent;avlodar,etropavl;a0z;ragandy,z0;!akhstan0;! eastern;tan;lm0stana;a ata,t","East Kazakhstan"],"Amman":["true¦eet,irbid,jo0russeifa,wadi as sir,zarqa;!r0;!dan","Jordan"],"Anadyr":["true¦anat,petropavlovsk kamchatsky,russia0;!n federation","Anadyr"],"Aqtau":["true¦alm1kazakhstan0mangghystau/mankistau,tashkent,west asia;! western;a ata,t","West Kazakhstan"],"Aqtobe":["true¦a1kazakhstan0tashkent,west asia;! western;ktobe,lm0;a ata,t","West Kazakhstan"],"Ashgabat":["true¦t0;km,m1urkmen0;abat,istan;!st,t","Turkmenistan"],"Atyrau":["true¦a1guryev,kazakhstan0tashkent,west asia;! western;lm0tirau;a ata,t","West Kazakhstan"],"Baghdad":["true¦a5basrDdihok,erbil,i3k2mosul,na1r0sadr;amadi,iyadh;jaf,sirA;arbala,irkuk,uwait;q,r0;aq,q;bu ghurayb,d diw5l 4rab1s0; sulaym4t;!i0;a0c;!n;amar2basrah al qadim2falluj2hill2kut,mawsil al jadid2;an0;iy0;ah","Arabian"],"Baku":["true¦az0ganja,lankar2sumqayit;!e0t;!rbaij0;an","Azerbaijan"],"Bangkok":["true¦:a6dnaliaht,euh,gnohpi5hnid m7i1nakarp tumas,t0;ci,erk kap;a1naht nodu,on3rub0; no1ahtnon gnaeum;m gnai0y t1;hc;ah;hcar is,isa 1misahctar nohk0nihcodni,trakaj;an;es,tsae htuos","Indochina"],"Barnaul":["true¦biysk,krat,north asia,russia0;!n federation","Krasnoyarsk"],"Beirut":["true¦e2l0ras bayrut;b0ebanon;!n;et,urope eastern","Eastern European","leb"],"Bishkek":["true¦k0osh;g2yrgy0;s0zs0;tan;!t,z","Kyrgyzstan"],"Brunei":["true¦b0;dt,n2r0;n,unei0;! darussalam;!t","Brunei Darussalam"],"Chita":["true¦russia1yak0;t,utsk;!n federation","Yakutsk"],"Choibalsan":["true¦dornodsukh1mongolia,ula0;an0t;baatar","Ulaanbaatar"],"Colombo":["true¦chenn4dehiwala mount lavinia,i2kolkata,lk1m0new delhi,sri lanka;oratuwa,umb3;!a;ndia0st;!n;ai","India"],"Damascus":["true¦a3deir ez zor,eet,h2latakia,sy0;!r0;!ia;am1oms;leppo,r raqq0;ah","Syria"],"Dhaka":["true¦bCcAdinaj9gazi9jess8khul7mymensingh,na4pa3ra2s1t0;angail,ungi;aid7hib4ylhet;jshahi,ng6;b3ltan,r naogaon;gar4r0t3;ayan0singdi;ganj;na;ore;pur;hattogram,o0;milla,xs bazar;a0d,gd,ogra,st;gerhat,ngladesh,rishal","Bangladesh"],"Dili":["true¦east timor,t0;imor leste,l0;!s,t","East Timor"],"Dubai":["true¦a5g4mus2om1ras al khaim3sharj3u0;ae,nited arab emirates;!an,n;aff0cat;ah;st,ulf;bu dhabi,jm0rabi0;an","Gulf"],"Dushanbe":["true¦t0;ajikistan,j0;!k,t","Tajikistan"],"Famagusta":["true¦:nretsae eporue,surpyc0tee;! nrehtron","Eastern European","eu3"],"Gaza":["true¦eet,gaza strip,p0;alestin1s0;!e;e,ian territories","Eastern European","pal"],"Hebron":["true¦e1palestin0west bank;e,ian territories;ast jerusalem,et","Eastern European","pal"],"Ho_Chi_Minh":["true¦bien hoa,can tho,da 4nha tr5qui nhon,rach gia,sa dec,thi xa phu my,v0;iet1n0ung tau;!m; nam,nam0;! south;lat,n0;ang","Indochina"],"Hong_Kong":["true¦h0kowloon,new territories,tsuen wan;k3ong0; kong0kong;! 0;island,sar china;!g,st,t","Hong Kong"],"Hovd":["true¦bayan olgiigovi altaihovduvszavkhan,hovt,m1west0; m0ern m0;ongolia","Hovd"],"Irkutsk":["true¦angar1brat1irkt,north asia east,russia0ulan ude;!n federation;sk","Irkutsk"],"Jakarta":["true¦:!1:#$%&:gn,isenodni,am,at;aObiw,di,gBheca Ei9ko8laget,m&Fn4o3r2t1u0;luk#9rabn5;&upXucr5;&nais#&%4ebmSis#uelWogob;dnobutis,g#iloborp,trekowN;a0di,oberUretsew a$,uid%;dem,#ol0;ak0;ep;lk#edsa#er,ped;ajnib,bmKh%PmubakIridek,sak0;eb;n0uruc;a3onibMu0;dn1pmal r0r6;adn0;ab;bmel6d5l2r0;%es,e#&0;! htuos;%1um0;ap;!ep;ap,em5;!ap;epmaA$7r4traka1ya0;bar2l%kis&;r1w0ygoy;rup;us;ap1t%usav0;aj;ej;! 0;nret0t0;sew;ic","Western Indonesia"],"Jayapura":["true¦!1:#:indonesia;ambon,east2#1m0new guinea,wit;alukus,oluccas;! eastern; 0ern 0;#","Eastern Indonesia"],"Jerusalem":["true¦ashdod,beersheba,haifa,i0jmt,petah tiqwa,rishon leziyyon,tel aviv,west jerusalem;d2l,s0;r0t;!ael;dt,t","Israel","isr"],"Kabul":["true¦af0herat,jalalabad,kandahar,mazar e sharif;!g0t;!hanistan","Afghanistan"],"Kamchatka":["true¦anadyr,pet1russia0;!n federation;ropavlovsk kamchatsk0t;i,y","Petropavlovsk-Kamchatski"],"Karachi":["true¦!1:#$%:ha,wal,ra;bKchiniJde% g#ziHfaisalGguj%FhyderGislamGj#ng sadr,kDlaCm7nawabs#h,okaAp4quetta,%3s0;a1h0ialkIukkM;ahkHekhupu8;ddiqDhi$,rgod#;him yarD$pindi;ak1es#war,k0;!t;!istB;a3i1u0;lt9zaffar7;ngo0rpur k#s;%;lir cantonment,rd6;hore,rkana;a0otli;moke,s8;n5t;abad; kh0;an;ot;a1himber,ure0;$a;#$p0nnu,ttag%m;ur","Pakistan"],"Kathmandu":["true¦biratnagar,n1p0;atan,okhara;epal,p0;!l,t","Nepal"],"Khandyga":["true¦russia1yak0;t,utsk;!n federation","Yakutsk"],"Kolkata":["true¦:!1:#$%&()*+-./<=>?@[]^_`~:na,ra,ah,ar,la,ab,hs,hc,ma,aj,dn,ag,an,ru,gn,ta,ih,am,ht,ir,ga,ok;0:2P;1:2Y;2:3L;3:2X;a2Ed23e1Ufi$* $hib,g>d,h1Ki0Uj&`y&p,k0Sl0Om0Fn09rCsawed,t7u6wonkcul,y4;llie$b,r4;alleb,/umh0Cre+udup;],gulum,m-j,>(?eb;a5epsoh,~j1s4ureem;i,ls;j iol?3pin5r4sa$b;.ug,us;ap,os;aNeMh%sd#lLim*2oKu4yh?om;+i1kmut,p6ss_^,t4yittov10;a4nug,t)-;ddorp,l;aBde*-j,`Ah9i7(6m&5#4p0XrOsalib,@$0;hrGjh%s,k,$has,yg;!%),_*;b.,`0;a4#m;du,j,r;doj,k&og;n,r1X;g7h6jib,l4mh&b,t##,zrim;lub^uq,o4;*,s;!l~;#rwon,>d;guas,i(wg;ub;mja,#kib;dFg=7h6kis,riv,s5w4;di$h,*e#bu0(;[,t_-;d#(j,it2; Aa8da1Fi7m5#d0Rr4s%lu,va0;affazum;a4_2;j,y*;hd#g,rs;g#g,nu-y,r4;),/e>s;ijavi*,>d%) (l;ib,#ya0;a7i6o<5ud &h4;ed;e(m,(j,>g;!.ju,+oc;^s4i/i,m%dd$b,yl2;.1;a6e(5u<l4;eb;pidupas1s;/ug8l7n@p6r4;a4up%t##vur[t;b-t,`#iziv;%kasiv,ili+];l~,t1;]1m1;a5iocreg3o4ugi/id,wazia;onrRs#sa;g#$w,h4nr2po0vasu0;bmKpmi;atDcattuc,i*3;rp;aRdQ?3hNj#$kl%ci,lDnAr9s8t4;a4lL;h4pHv&-;awug,i4$m2;=,#p;a#$v,#hj;p08ugilis;a5et,i4;hor;hb$p,wi0;aAbuh,e8g6(p5u&?is,vi4;bArob;p&i+7@kA;n4uh;as;$be1vlen4;urit;b,p,tl5vib4;mod;uk;c5led4;! wen;i>kall2n1;ava,#wi0uku^ooO;bmum4li0nne+,>d];! iv3;a9d<=uj,g8$g4sed&p $ttu,t=$-;f.3i5#j4;us;d4(;#+;) lor2i&h);r4wate;$,w4;oh;ud;d~[z~,nAr4;eg#vad,o4;/i,jn7l5sym,t)mi4;oc;<nRle4;!n,v;at;a4up;^;a4e/3ni;b5id3w+ni+ _p4;mip;a4#hd;d6g#>a,h5iz%g,-zin,red4zorif;nuces,yh;al(,kur5;&6e5i4;$f;mha;om;b0Ed06g02hZiVkaTlNnJrAs8t7w5y4;<,hdA;/4er;%k;~,tuc(c;=Rr4;is;a7`,o5p%c,t*a$h4u^4;];%,mil4;ib;dod7p@0w4;li0r4;um;hb;av;a[d6l5@4;p,s;.;ul;a7e4~a,uk+n8;k>1r3;=;&;it4t$`;ap;t=r2wuj4;<;d6lu5nr4;up;hd;ni;or5sido,zuppa4;(;-;#hbr6omi5$bl4;ug;*;ad;a8ion7n4;a5[t4;);+;! re@erg;nik2way.4;iv;ak;as5r4;~;og","India"],"Krasnoyarsk":["true¦krat,north asia,russia0;!n federation","Krasnoyarsk"],"Kuala_Lumpur":["true¦alor setar,bukit mertajCgeorge town,ipoh,johor bahBk7m4petali3s0taipiA;e1hah alBu0;ba1ngai petani;pa7remb6;ng jaya;ala1y0;!s,t;cca,ysia;ampung baru suba2la2ota bha3ua0;la terengganu,nt0;an;ng;ru;am","Malaysia"],"Kuching":["true¦kota kinabalu,m2s0tawau;a0ibu;bahsarawak,ndakan;alaysia,iri,yt","Malaysia"],"Macau":["true¦beij7c4m0urumqi;ac0o;!a0;o0u;! sar chi2;h0st;i0ongq1;na;ing","China"],"Magadan":["true¦magt,russia0;!n federation","Magadan"],"Makassar":["true¦!1:#$%:indonesia,ar,ntral;ba6ce5denpas$,#4k3l2ma1palu,s0wita;am$inda,ulawesi;nado,t$am;abuan bajo,oa jan4;end$i,upang;! ce%;lebesbalinusa,% #;likpap0nj$masin;an","Central Indonesia"],"Manila":["true¦!1:#$%&():an,in,ta,ga,lo,lac;#04bWcRdaPgeneral s#tOiMlJmCnaBoAp4quezIs#1%0zambo#&;c(bZguig,r),ytE; 1t0;a ro2ol;fern#do,jose del monte,pab(;a3h1uerto pr$ce0;sa;!ilipp$e0l,st,t;!s;&diRnal#oy,s0;ay,ig;(n&po,rmoc;&,votQ;a0eycauayN;ba)at,gugpo pob)i4kati,l3n0;da1sil$gL%mp0;ay;luyong,ue;$gDol6;on;a1e&spi,i0ucena;ber%d,pa;pu lapu,s p4;l0mus;igCoiH;os;smar0v5;$B;a0ebu,o%bato;b1&y# de oro,$5l0;amba,ooc6;#atu5uy0;ao;a4$#2u0;d0tu2;%;!gon0;#;co1guio,t#g0;as;(d,or;geles,tipo0;(","Philippine"],"Nicosia":["true¦cy1e0;astern european,et,urope eastern;!p0;!rus","Eastern European","eu3"],"Novokuznetsk":["true¦k1north asia,prokopyevsk,russia0;!n federation;emerovo,rat","Krasnoyarsk"],"Novosibirsk":["true¦no1russia0siber2;!n federation;rth central as0vt;ia","Novosibirsk"],"Omsk":["true¦omst,russia0;!n federation","Omsk"],"Oral":["true¦!1:#:kazakhstan;alm2#1tashkent,west 0;asia,#;! western;a ata,t","West Kazakhstan"],"Pontianak":["true¦!1:#:indonesia;b3#2tanjung pinang,w0;est0ib; b1ern #;! western;orneo","Western Indonesia"],"Pyongyang":["true¦chongjin,dpBh6k3n2pBs0won7;ariw0eoul,inui9unch0;on;ampo,orth korea;a1orea0p,st;! north,n;eso3nggye;a1ungnam,ye0;san;e1mhu0;ng;ju;rk","Korean"],"Qatar":["true¦a2doha,kuwait,qa0riyadh;!t0;!ar;r0st; rayyan,ab0;!i0;a0c;!n","Arabian"],"Qostanay":["true¦!1:#$:stan,azakh;a2central asia,east k$#,k0;$#0o#ay;! eastern;lmt,#a","East Kazakhstan"],"Qyzylorda":["true¦alm3k0tashkent,west asia;azakhstan1yzyl0zyl 0;orda;! western;a ata,t","West Kazakhstan"],"Riyadh":["true¦aDburaydCdammam,haBjeddCk9m6najran,s4ta3y0;anbu,e0;!m0;!en;buk,if;a0ultan7yot;naa,udi arabia;a1e0;cca,dina;din3kk3;hamis mush0uw0;ait;far al batin,il;ah;bha,l 3rab0st;!i0;a0c;!n;hufuf,jubayl,kharj,mubarraz","Arabian"],"Sakhalin":["true¦russia1sak0yuzhno sakhalinsk;halin island,t;!n federation","Sakhalin"],"Samarkand":["true¦bukhara,nukus,qarshi,uz0;bekistan0t;! west","Uzbekistan"],"Seoul":["true¦:!1:#$%:gn,htuos,oe;aerokTeahmik,#Q$ aePiFkor,n6opkom,r5tsk,u0;g9j0s%y;ej,#a2n0;iGo0;ej,w;wg,y;k,ok;a6o0;e1w0;#aAus;hcn1j0;ead;i,u0;hc,s;eBn4s0;am,ki,lu,n9ub;m8s 0;#5ir7man#oBn3u0;b#%jiu,j#0;%0;hc;asna,%hc0;i,ub;ay0%sawh;na,og;ug;rok;ahop,o0uen#ag;j0ym#awk;es;! 0;fo cilbuper,$","Korean"],"Shanghai":["true¦:!1:#$%&()*+-./<=>?@[]^_:gn,na,uh,oa,ix,eh,hc,iq,ab,ug,il,ij,ay,ad,hz,iy,ah,uy,uw,ul;0:3G;1:4F;2:43;a4Ecrp,e48#28i1Fn04oWrUsodro,tSu3;b#eb,dg2Dfn],gQhP+Zo6p4q a%$ux ihs uoka43s$g,wi3yZ;al,y;#3n(;=,+;d3Eguotnem,?6k4t3;$0&b;a3X)&l,#@,i[,$.,u3;d>,o2;>,eG#DiAn5o4u3;f,hE/,l,s,w,x;a*,b;a6e4i3;j,q;h3w;c,z;g,l,uq,w;a4em,u3;g,h,s;l,t;a3e2<,oy;c,h3.,y;!c,z;!d,h;sg3W^;#L$h;c3kh,ohhoh,sc;!irtsid %o_;a3un $y-;h+Ali[;a5b4u3;hsXtup,z&1;#in,iz;d#5?ir,i4r3tZ;#a0;lg3Kq_;a%n3+;+;aKc,eF*,i9u3;c6h3;c4s3;$,uf;g3E@;)i3#atg17;at;b7j$6l4xuf,y3;a%,g0Bi-;i3];j,.;it,p;@,r[;fn/,?4m3;a(,g05%;ed#1n3;a.#)c 3e0;a(n/,#=I;dnUhMiFnD&b,tgCu4y3;#ol,i0;g9*7l,q6y3;#4ia3&/;k,t;a.,+;#=;is,n3;@;g0Q&0;$(;i3%;a%,ew,j;a8d6eb,j5l>,qus,t4ur,x3;!n6;up;!uf;amu2#af3;aw;t,%;s3^;=#au0),#7i6n4o3;-,f;a3ew,uk;!/,p;-,em;at,id#ip,o3;?,t;[;aNb),cMdn(,eJgre $l%,hHjFlEqDsuma1%9x5yn3;i3uz;l,x;g5i4neb,u3;p,w;c,j;$1;n(,s3ux;#),@,$3;i3pu/;j,t;i0muru;#e0.;n3&b;=;s3zg1S;a0g19$%cg1Q;b4f),w3;#o2^;a2ia%;];h5t3;#(,n3u1;=,(;#4iU$n,u3;?,w;+,o3;d3+;!>;aZeSiBo3;d8giz,h4s^,t3;>,$n;c$n,z3;-,g4n3^;[,<;n)c;#a.,n3up;>;dHjFlEmCn9p7q6x5y3;g3u(;nod;a1@,&0;>,#o*,$,&2;is,o3;ag;i4$3up;(,n;j,x;n3&m;as,uk;eit,#1;i3$n,uq;eb;a1o3;-;fi8*3; u2i5n3&/,uoz;a3<,];_,y;a3ef;b,h;ak,*;f03gWhSiH%Dy3;eB#Ai9n6o4u3;f,p;a3_;*,/,z;a3e0(;!i3n;m,x;.,y;aA),+;<,];g5z3;a<i0&z;hs;nef;j7l6x3;#4n3;(;ef,ip;>,_;#7i6n3&1u1;a3e2<;dum,?,i3;l,q;en,l;=,os;c3nim;@,n4u3;w,x;an;a7),g5i4n]$3;/;.;$3;%;<#a2;?;#3iew;al;d#7h5<ib,ux4z3;);^;n6o3;_;aAeA;d$,hsg8ni9%4yn3;as;g5i4n1;<;us;not;$3;*","China"],"Singapore":["true¦kuala lumpur,s0woodlands;g0ingapore;!p,t","Singapore"],"Srednekolymsk":["true¦chokurdakh,russia0sret;!n federation","Srednekolymsk"],"Taipei":["true¦:cor,gnu2iepiat wen,n0oaiqnab,tsc,uhcnish,wt;a0eilauh,wt;ni1uyo1wi1;hci0ishoak,leek;at","Taipei"],"Tashkent":["true¦andij4namangan,qo3uz0;!b0t;!ekistan0;! east; q0q0;on","Uzbekistan"],"Tbilisi":["true¦ge0kutaisi;!o0t;!rgia0;!n","Georgia"],"Tehran":["true¦:!1:#$%&:ba,ri,hs,ra;dRhNirPjaLkaJlGmoq,n7r5sab# &dnIt3ywYz0;a1ir0;#t,hK;$%,vha;d0%ar,s0;$;avezbJeyalPha%0i,u#%yen; inyemRdaza,mQ;a1i0$;ma&v,vzB;d3grog,haf2j1kub,mG$0;! fo cilbuper cimal1;n2$s;si;a1eh0;az;#,mah;i#d&,o0;b0ma;ab;hcr0&;aq;dnan3r0;ak;a%nam2cnarb dagarsap,e0;v0yimuro;as;rek;a2naj$b,r0zay;ejur0unj0;ob;#1h%0;am;faj2m0&z2;arr0;ohk;an","Iran"],"Thimphu":["true¦b0;hutan,t0;!n","Bhutan"],"Tokyo":["true¦:!1:#$%&()*+-./<:ih,am,hc,an,ka,st,ok,im,ak,ot,oy,uk;a04eXiEnCo5pj,t4u0;fo2hsuy(tik,(jner+-,)0z$un;$a0eoj,o;(t,mY;%,k;dj,sj;ay,besas,du5%noh,jna,m#soega,n4r3t0;&C+,o0;m0yk;$Qu2;#sPoppas;ag&,/;)$;a0pj;knir+&5paj;aHgu)a,hBj9k1m0romoa;ati,uzi;a0esonom0P#sarIu)0H;rabi,s2wi,za0;ko,y0;+;a0or#;g0(t,wZ;a0#c;ma,n;em#,oBu0;!f;c3s0; 1a0;be$,h0G(;ar&,i<uf,/k. Zufig;a0i-08*,u3;mnoh o%awag*Pt#;dnes,g6kUm*$.;b4hon2mur1o0r1tad*3;gawM;<;#c0;ah;-0*;usH;b0Ad07h&,kQmCr9t5w2y0;ag#sJ+on0og&;i9u)u;a0#sD;gayen,k#asa,sijYz0;&Bor*.;a1i0/Z;(,o,us;g0kO;$ay,iG;a0<C;hi0wado;%i;a4#s0;o1<0;.,uf;g0rH;-;h5ti4y0;-2ir1.,u0;kI)O;*;aw,o;as; ay+on0oA;#s0;in;aCo8u0;s3z0;ar0us;-0;at;o2t0;ar0;#;k/;ag6irom,s,u0;k1z0;#s;uf;n0so;/0;.;&;aw#s1#c0;$;ik;i0<u);%","Japan"],"Tomsk":["true¦omst,russia0;!n federation","Tomsk"],"Ulaanbaatar":["true¦m1ula0;n bator,t;n0ongolia;!g","Ulaanbaatar"],"Ust-Nera":["true¦russia1vla0;divostok,t;!n federation","Vladivostok"],"Vladivostok":["true¦!2;k1msk+\\e,russia0vlat;!n federation;habarovsk0omsomolsk on amur;! vtoroy","Vladivostok"],"Yakutsk":["true¦blagoveshchensk,russia0yakt;!n federation","Yakutsk"],"Yangon":["true¦b4kyain seikgyi township,m0nay pyi taw,pathein,sittwe;a2eiktila,m1onywa,yanmar0;! bu3;!r,t;ndalay,wlamyine;ago,u0;rma","Myanmar"],"Yekaterinburg":["true¦chelyabin6ekateri5k4magnitogor6nizhn3or2perm,russia1s0tyumen,ufa,yekt,zlatoust;terlitamak,urgut;!n federation;e2sk;evartov2y tagil;amensk uralskiy,urgan;nburg;sk","Yekaterinburg"],"Yerevan":["true¦a0caucasus;m1rm0;!enia;!t","Armenia"]},"Atlantic":{"Azores":["true¦a0hmt,portugal;tlantic,zo0;st,t","Azores","eu0"],"Bermuda":["true¦a2b0;ermuda,m0;!u;st,t0;!lantic","Atlantic","usa"],"Canary":["true¦!1:#$%:an,europe,stern;atl#tic,c#ary isl#ds,$ we%,las palmas de gr# c#aria,s1we0;% $#,t;#ta cruz de tenerife,pain","Western European","eu1"],"Cape_Verde":["true¦atlantic,c0;a1pv,v0;!t;bo verde0pe verde;! is","Cape Verde"],"Faroe":["true¦atlantic,f0;aroe islands,o,ro","Western European","eu1"],"Madeira":["true¦atlantic,europe western,madeira islands,portugal,we0;stern european,t","Western European","eu1"],"Reykjavik":["true¦atlantic,g2i0utc,zulu;celand,s0;!l;mt,reenwich mean","Greenwich Mean"],"South_Georgia":["true¦atlantic,gs4s0;gs,outh georgia 0;and t0s1t0;he s0;outh sandwich islands;!t","South Georgia"],"Stanley":["true¦atlantic,f0;alkland1k0lk;!st,t;! island0;!s","Falkland Islands"]},"Australia":{"Adelaide":["true¦!1:#:tral;a2cen0south 1; 0# 0;aus#ia;c2us#ia0;! 0n 0;cen#;dt,st,t","Central Australia","aus"],"Brisbane":["true¦a0gold coa3logan,queensland,townsville;e2ustralia0;!n east0;!ern;st","Brisbane"],"Broken_Hill":["true¦!1:#:ustralia;a1cen0yancowinna; a# standard,tral a#;c1delaide,#0;! central;st,t","Central Australia","aus"],"Darwin":["true¦a0northern territory;cst,ustralia0;!n central","Australian Central"],"Eucla":["true¦!1:#: central w;a0cw4;cw4us0;#1tralia0;!n#estern;!e0;st;dt,st,t","Australian Central Western"],"Hobart":["true¦a1canberra,eastern austral0king island,tasman0;ia;e5us0; east2tralia0;! 0n 0;easte1;!e0;rn;dt,st,t","Eastern Australia","aus"],"Lindeman":["true¦a0whitsunday islands;est,ustralia0;!n eastern","Brisbane"],"Lord_Howe":["true¦australia,l0;h0ord howe island;dt,st,t","Lord Howe","lhow"],"Melbourne":["true¦!1:#$:east,tralia;a0canberra,#ern aus$,geelong;e5us0; #2$0;! 0n 0;#e1;!e0;rn;dt,st,t","Eastern Australia","aus"],"Perth":["true¦!1:#$:ustralia,est;a3w0; 1$0; 0ern 0;a#;#1w0;dt,st,t;! w$e1n w$0;!e0;rn","Western Australia"],"Sydney":["true¦a0new south wales,wollongong;e6u0;!s0;! east2tralia0;! 0n 0;easte1;!e0;rn;dt,st,t","Eastern Australia","aus"]},"Etc":{"GMT":["true¦etc,greenwich0;! mean","Greenwich Mean"],"UTC":["true¦etc,u0zulu;ct,niversal","UTC"]},"Europe":{"Berlin":["true¦germany,hamburg,koln,munich","Central European","eu2"],"Simferopol":["true¦aqmescit,ukraine","Moscow"],"Amsterdam":["true¦a6ce5e3groning4n1rotterdam,t0utrecht;he hague,ilburg;etherlands,l0;!d;indhov0urope central;en;ntral european,st,t;lmere stad,mt","Central European","eu2"],"Andorra":["true¦a1ce0europe central;ntral european,st,t;d,nd0;!orra","Central European","eu2"],"Astrakhan":["true¦m2russia0st petersburg;!n0;! federation;oscow,sk","Astrakhan"],"Athens":["true¦e1gr0thessaloniki;!c,eece;astern european,et,urope eastern","Eastern European","eu3"],"Belgrade":["true¦ce3europe central,n2pristina,s0;erb0i,loven0vn;ia;is,ovi sad;ntral european,st,t","Central European","eu2"],"Brussels":["true¦antwerpen,b2c0europe central,gent,liege;e0harleroi;ntral european,st,t;e0mt;!l0;!gium","Central European","eu2"],"Bucharest":["true¦bra4c3e2gala1iasi,oradea,ploies1ro0timisoara;!mania,u;ti;astern european,et,urope eastern;luj napoca,onstanta,raiova;ila,sov","Eastern European","eu3"],"Budapest":["true¦ce2debrecen,europe central,hu0pest;!n0;!gary;ntral european,st,t","Central European","eu2"],"Busingen":["true¦b3ce2de1europe central,germa0saxo0;ny;!u;ntral european,st,t;avaria,remen","Central European","eu2"],"Chisinau":["true¦e3m0republic of mo1;d1o0;ldova;!a;astern european,et,urope eastern","Eastern European","eu2"],"Copenhagen":["true¦arhus,c1d0europe central;enmark,k,nk;e0mt;ntral european,st,t","Central European","eu2"],"Dublin":["true¦:d7e6hgrubnide,k4l8n2t0yawlag;m0si;d,g;aem hciwneerg,o0;bs1dnol;cirem0roc;il;ca,i,rie,st;nale0rofretaw;ri","Irish","eu1"],"Gibraltar":["true¦b3ce2europe central,gi0;!b0;!raltar;ntral european,st,t;dst,st","Central European","eu2"],"Helsinki":["true¦e3fi1t0vantaa;ampere,urku;!n0;!land;astern european,et,spoo,urope eastern","Eastern European","eu3"],"Istanbul":["true¦:!1:#$%&:na,ra,ru,ne;aWeRgizale,iKkerevPmurJnFpet#izag,r6s4t2u1ye0;kToktuvan$;lroc,n%bnityez;im5&kitFr0;t,uy&8;a0us$t;$m#marhGvJ;a6el4i0t,ut,ık2;hes2k1m0sekilA;zi;ab$yid;ata,ik1kas7;&0veilech6;se;deukseu,l0;gabar7icg3;a0isAozbart,usmN;m0v;ayiKt0;ab;oc,uzre;d&fezek5l2r0zag3;azapaGesy0;ak;s1yeb0zi&d;#tlus;is;rem;lakkirik,pet3yi0zbeg;k1#0;mso,rmu;%t;kacn7l4;f%iln6#5$k4s2y0;ak#c,hatuk,k0l0nok,tal2;at2;apta%m,in0%b;am;#;da;as","Turkey"],"Kaliningrad":["true¦e1russia0;!n federation;astern european,et","Eastern European"],"Kyiv":["true¦!1:#$%:tern,iv,urope;bila tserkKcherHdFeEhorlD$ano frank$Gk9l8m6odes5poltaKr$4sumy,#opil,u2vinnyts1z0;aporizhzh0hytomyr;ya;a,kr0;!ai0;ne;a,sa;a0ykolayC;ki5riupol;ut7vA;amyanske,h1iev,r0;emenchuk,opyv1yvyy rih;ark7erson,mel0;nytskyy;$ka;as# e%an,et,% eas#;nipro,onet0;sk;kasy,ni0;h0vtsi;$;va","Eastern European","eu3"],"Kirov":["true¦m2russia0st petersburg;!n0;! federation;oscow,sk","Moscow"],"Lisbon":["true¦!1:#:europe;amadora,# western,p2we0;st0t;! #,ern #an;ort0rt,t;o,ugal0;! mainland","Western European","eu1"],"London":["true¦!1:#$%&()*+:ing,on ,er,st,an,re,en,ham;a0Kb06c04d01eZgThRiOj%sey,k#&$up$hull,lKmInCoxSpA)ad#,s2u1w0yG;arwick06igUolv%ha8;k,nited k#dom;heffield,o3t2u1w0;(4indL;ffolk,nd%l(d,r)y,sVttK;afMoke $t)nt;meVuth0;a1*d $0;sea;mptF;ly0orts0)&E;mouth;ew4o0;r0tt#+P;th0wB; y0amptonN;orkQ;ca&le up$tyne,port;(che&%,i0;dl(3lt$keynes;(caMdn,e1i0ut4;ncolnLsb3v%T;e0ice&%G;ds;psw1sl#t0;on;ich;ampF%t0;fordE;b4l3mt2)0;at britain,*wich me0;(;! &(daH;asgow,ouce&%9;! e9;dinburgh,s0;sex;%by1o0udlH;rset;!sh4;a0ov*try,rawlE;mbridge1rdiff;eBirAlack8r2&,uck#+0;sh0;i);adfo4e3i0;&5t0;ain0ish;! uk;nt;rd;po0;ol;k*head,m#+;lfa&,xl0;ey;b%de*,rchway","British","eu1"],"Luxembourg":["true¦ce2europe central,lu0;!x0;!embourg;ntral european,st,t","Central European","eu2"],"Madrid":["true¦:!1:#$%&()*: ed ,al,tn,na,la,eporue,ra;aFciuj%om sDdBeAit*m Dl8n5o3pse,red&Ds1t0;ec,mew,s6;acel(v#e%eup,e0ogrub;!lotsom,&gel,*neh#$acK;ablib,d0giv;eivo,*p le (r*cK;a0i6ojig;) (r%0itsabes n7;ec;a0ehc&barAledab5;enil daduic,r%ec );c&mor,hcle,lpmaxie,%aciCuqs7;ilod$(v,n$niam ni0;aps;%0;as;da8g$am,i5llives,ml4n0re%orf $#zerej,ssarret,zoga*z;$p $#ollets2it$,ol0uroc a;ad0ecr0pm2;ab;ac;ap;crum,r0;em0otiv/zietsag;(;&rg,rb$0;neuf","Central European","eu2"],"Malta":["true¦ce1europe central,m0;alta,lt,t;ntral european,st,t","Central European","eu2"],"Minsk":["true¦b3h2m0russian,st petersburg,viteb4;ahily0osc0sk;ow;omyel,rodna;abruy0elarus,lr,rest,y;sk","Moscow"],"Monaco":["true¦ce2europe central,m0;c0onaco;!o;ntral european,st,t","Central European","eu2"],"Moscow":["true¦:!1:#$%&()*:or,ak,on,hz,ks,hc,hk;a08d04g00&en#ov,iZkPlLnGoDr8s6t5u4vo3y0z$v$A;i1(iegravgBnle) eyyn&erebXraskob6t*ahs,yn0;rRz#g;(nini0Anlartnec;bmZ(p,rtso y(velysav;nod anDr,s w;ef,sdm;tevoper0ur;e);a2evt,i0;m0vamN;idalv;d0kvytkys;%sark;ni1v0;enes7%avi;belu& %i*yv,rV;a2o0;d no0itaredef naiU; vots#;iSza0;k,yr;ero,o1vals#0;ay;(o yyr0p#v0;ats;i)l8s0;dovaz#tIl5m4n0ruk,tepil,yiss#ov%;a2eloms,i0;byr,&rezd,vd#0;eves;mrum,r7yrb;!$enB;egna*0odop;ra;an;)os,kmi*;#nag2rubsretep t0;ni0s;as;at;arg%elez,#og0sm;leb,v% yi0;kilev,n0;&in;dgol5gu4i3l1m#tsok,zn0;ep;$)a*0o r$hsoy,ut;am;ssur;l$;ov","Moscow"],"Oslo":["true¦bergen,ce1europe central,norway,sj0;!m;ntral european,st,t","Central European","eu2"],"Paris":["true¦bordeaux,ceDeurope central,frAl8m7n5r3s0toulouE;aint 1t0; 0rasbourg;etienne;e0oman8;ims,nn1;ant0i6ormandy;es;arsei1et,ontpellier;e havre,i0yon;lle;!a0;!n0;ce;ntral european,rgy pontoi0st,t;se","Central European","eu2"],"Prague":["true¦brno,c1europe central,ostrava,pmt,s0;k,lovakia,vk;e1zech0; republic,ia;ntral european,st,t","Central European","eu2"],"Riga":["true¦!1:#:urope;e2kalt,l0;atvia,st,v0;!a;ast1e0# eastern;st,t; e#,ern e#an","Eastern European","eu3"],"Rome":["true¦bFcCeurope central,floreBgenoa,itaAm9naples,p6r5siciAt3v0;a0eroG;!t0;!icB;aran3rieste,u0;rin,scany;mt,oma5;a1ra0;to;dova,lermo;essi7il4;ly;nce;atan3e0orsica;ntral europe0st,t;an;ari,olog1resc0;ia;na","Central European","eu2"],"Samara":["true¦izhevsk,russia1s0togliatti on the volga;amt,yzran;!n federation","Samara"],"Saratov":["true¦balakovo,izhevsk,russia0samt;!n federation","Samara"],"Sofia":["true¦b1e0imt,plovdiv,varna;astern european,et,urope eastern;g1u0;lgaria,rgas;!r","Eastern European","eu3"],"Stockholm":["true¦ce3europe central,goeteborg,malmoe,s0;e1we0;!den;!t;ntral european,st,t","Central European","eu2"],"Tallinn":["true¦e0;astern european,e1st0urope eastern;!onia;!t","Eastern European","eu3"],"Tirane":["true¦al1ce0europe central,tirana;ntral european,st,t;!b0;!ania","Central European","eu2"],"Ulyanovsk":["true¦m2russia0st petersburg;!n0;! federation;oscow,sk","Ulyanovsk"],"Uzhgorod":["true¦e0ruthenia,ukraine;astern european,et,urope eastern","Eastern European","eu3"],"Vienna":["true¦a1ce0donaustadt,europe central,favoriten,graz,linz;ntral european,st,t;t,u0;stria,t","Central European","eu2"],"Vilnius":["true¦e3k2l0;ithuania,t0;!u;aunas,laipeda;astern european,et,urope eastern","Eastern European","eu3"],"Volgograd":["true¦m3russia1st petersburg,vol0;t,zhskiy;!n0;! federation;oscow,sk","Moscow"],"Warsaw":["true¦bFcCeurope central,g8k6l4mokot7p1radHs0torun,wroclaw,zabrze;osnowiec,zczec4;l,o0raga poludnie;l0znB;!and;odz,ubl0;in;ato2iel3rak0;ow;d2li0;wi0;ce;ansk,ynia;e0zestochowa;ntral europe0st,t;an;i2y0;dgoszcz,t0;om;alystok,elsko biala","Central European","eu2"],"Zaporozhye":["true¦e1luhansk0sevastopol,ukraine,zaporizhia lugansk;! east;astern european,et,urope eastern","Eastern European","eu3"],"Zurich":["true¦ce3europe central,geneve,li1swi0;ss,tzerland;!e0;!chtenstein;ntral european,st,t","Central European","eu2"]},"Indian":{"Chagos":["true¦british indian ocean territory,i0;ndian1o0;!t;! 0;chagos,ocean","Indian Ocean"],"Christmas":["true¦c0indian;hristmas island,x0;!r,t","Christmas Island"],"Cocos":["true¦c0indian;c2ocos 0;island0keeling islands;!s;!k,t","Cocos Islands"],"Kerguelen":["true¦!1:#$%:tarctic,an,er;a6french s1indi$,k%guelenst paul7tf0;!t; t%r,outh%n0;! 0;$0t%ritories;d $#0#;! l$ds;mst%dam0tf; isl$d","French Southern & Antarctic"],"Mahe":["true¦indian,s0;c0eychelles,yc;!t","Seychelles"],"Maldives":["true¦indian,m0;aldives,dv,v0;!t","Maldives"],"Mauritius":["true¦indian,m0port louis;auritius,u0;!s,t","Mauritius"],"Reunion":["true¦indian,re0;t,union","Réunion"]},"Pacific":{"Apia":["true¦pacific,samoa4w0;est1s0;!m,t; 0ern 0;samoa;! western","West Samoa"],"Auckland":["true¦christchurch,manukau,n0pacific,wellington;ew zealand,orth shore,z0;!dt,l,mt,st,t","New Zealand","nz"],"Bougainville":["true¦guinea2p0;a0gt,ng;cific,pua new guinea;!n","Bougainville"],"Chatham":["true¦cha1n0pacific;ew zealand,z chat;dt,st,t0;!ham islands","Chatham","chat"],"Chuuk":["true¦chu1federated states of m0m0pacific;icronesia;t,uk/trukyap","Chuuk"],"Easter":["true¦chile,e0pacific;as0mt;st,t0;!er island","Easter Island","east"],"Efate":["true¦pacific,v0;anuatu,u0;!t","Vanuatu"],"Fakaofo":["true¦pacific,t0;k0okelau;!l,t","Tokelau"],"Fiji":["true¦f0pacific;iji,j0;!i,st,t","Fiji"],"Funafuti":["true¦pacific,t0;uv1v0;!t;!alu","Tuvalu"],"Galapagos":["true¦co1ecuador,gal0pacific;apagos islands,t;lombia,st,t","Galapagos"],"Gambier":["true¦french polynesia,gam0pacific;bier islands,t","Gambier"],"Guadalcanal":["true¦pacific,s0;b1lb,olomon0;! islands;!t","Solomon Islands"],"Guam":["true¦:cificap2maug,orroma1p0sdnalsi anairam nrehtron,ts1ybserom trop;m,nm;hc;! 0;nret0t0;sew","Chamorro"],"Honolulu":["true¦aleutian6h3pacific,u0;nited states1s0;!a;! of america;a0st;dt,st,t,waii0;! aleutian;! islands","Hawaii"],"Kanton":["true¦kiribati,p0;acific,ho0;enix islands,t","Phoenix Islands"],"Kiritimati":["true¦ki1lin0pacific;e islands,t;!r0;!i0;bati,timati island","Line Islands"],"Kosrae":["true¦federated states of m0kost,m0pacific;icronesia","Kosrae"],"Kwajalein":["true¦m0pacific;arshall islands,ht","Marshall Islands"],"Majuro":["true¦m0pacific;arshall islands,h0;!l,t","Marshall Islands"],"Marquesas":["true¦french polynesia,mar0pacific;quesas islands,t","Marquesas"],"Nauru":["true¦n0pacific;auru,r0;!t,u","Nauru"],"Niue":["true¦n0pacific;iu1u0;!t;!e","Niue"],"Norfolk":["true¦n0pacific;f0orfolk island;!dt,k,t","Norfolk Island","aus"],"Noumea":["true¦n0pacific;c0ew caledonia;!l,t","New Caledonia"],"Pago_Pago":["true¦:!1:#$:nacirema,aomas;$0cificap,# $,tss,yawdim;! #","Samoa"],"Palau":["true¦p0;a1lw,w0;!t;cific,lau","Palau"],"Pitcairn":["true¦!2;p0utc-\\a\\i;acific,cn,itcairn0n,st;! islands","Pitcairn"],"Pohnpei":["true¦f2m3p0;acific,f,o0yf;hnpei/ponape,nt;ederated states of m0rench poly1;icro0;nesia","Ponape"],"Port_Moresby":["true¦dumont durville,guinea3p0;a1g0ng;!t;cific,pua new guinea;!n","Papua New Guinea"],"Rarotonga":["true¦c0pacific;k2o0;k,ok0;! islands;!t","Cook Islands"],"Tahiti":["true¦french polynesia,pacific,society islands,taht","Tahiti"],"Tarawa":["true¦gil0kiribati,pacific;bert islands,t","Gilbert Islands"],"Tongatapu":["true¦nukualofa,pacific,to0;!n0t;!ga","Tonga"],"Wake":["true¦:cificap,dnalsi e2imu,mu,sdnalsi gniyltuo 0t2;ronim s0su;etats detinu,u;kaw","Wake Island"],"Wallis":["true¦pacific,w0;allis 1f0lf;!t;and f0f0;utuna","Wallis & Futuna"]}};

// Generated by scripts/build/01-pack.js. Edit data/aliases.json instead.
var misc = {"coordinated universal time":["Africa/Abidjan","Africa/Bissau","Africa/Monrovia","Africa/Sao_Tome","America/Danmarkshavn","Atlantic/Reykjavik","Etc/UTC"],"eastern european time":["Asia/Beirut","Asia/Famagusta"],"argentina time":["America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia"],"mexico city":["America/Bahia_Banderas","America/Merida","America/Mexico_City","America/Monterrey"],"mexico_city":["America/Mexico_City"],"mexican pacific time":["America/Chihuahua","America/Mazatlan"],"atlantic time":["America/Glace_Bay","America/Goose_Bay","America/Halifax","America/Moncton","America/Thule"],"pacific time":["America/Los_Angeles","America/Tijuana"],"chile time":["America/Santiago"],"eastern australia time":["Antarctica/Macquarie","Australia/Sydney"],"alma-ata time":["Asia/Aqtau","Asia/Aqtobe","Asia/Atyrau","Asia/Oral","Asia/Qyzylorda"],"anadyr time":["Asia/Anadyr"],"west kazakhstan time":["Asia/Aqtau","Asia/Aqtobe","Asia/Atyrau","Asia/Oral","Asia/Qyzylorda"],"arabian time":["Asia/Baghdad","Asia/Qatar","Asia/Riyadh"],"yakutsk time":["Asia/Chita","Asia/Khandyga"],"ulaanbaatar time":["Asia/Choibalsan"],"hong kong time":["Asia/Hong_Kong"],"hong_kong":["Asia/Hong_Kong"],"omsk time":["Asia/Omsk"],"brisbane time":["Australia/Brisbane","Australia/Lindeman"],"moscow time":["Europe/Moscow","Europe/Ulyanovsk"],"volgograd time":["Europe/Astrakhan","Europe/Kirov","Europe/Minsk","Europe/Moscow","Europe/Ulyanovsk","Europe/Volgograd"],"british time":["Europe/Dublin","Europe/London"],"port_moresby":["Pacific/Port_Moresby"],"ürümqi":["Asia/Urumqi"],"mangghystaū/mankistau":["Asia/Aqtau"],"osaka, sapporo, tokyo":["Asia/Tokyo"],"brussels, copenhagen, madrid, paris":["Europe/Rome","Europe/Stockholm","Europe/Tirane","Europe/Vienna","Europe/Warsaw","Europe/Zurich"],"izhevsk, samara":["Europe/Samara","Europe/Saratov"],"moscow, st petersburg":["Europe/Ulyanovsk","Europe/Volgograd"],"gmt+0":["Etc/GMT"],"gmt-0":["Etc/GMT"],"gmt0":["Etc/GMT"],"etc/gmt+0":["Etc/GMT"],"etc/gmt-0":["Etc/GMT"],"etc/gmt0":["Etc/GMT"],"msk+00":["Europe/Moscow"],"msk-01 - kaliningrad":["Europe/Kaliningrad"],"msk+00 - moscow area":["Europe/Moscow"],"msk+00 - crimea":["Europe/Kyiv"],"msk+00 - volgograd":["Europe/Volgograd"],"msk+00 - kirov":["Europe/Kirov"],"msk+01 - astrakhan":["Europe/Astrakhan"],"msk+01 - saratov":["Europe/Saratov"],"msk+01 - ulyanovsk":["Europe/Ulyanovsk"],"msk+01 - samaraudmurtia":["Europe/Samara"],"msk+02 - urals":["Asia/Yekaterinburg"],"msk+03":["Asia/Omsk"],"msk+04 - novosibirsk":["Asia/Novosibirsk"],"msk+04 - altai":["Asia/Barnaul"],"msk+04":["Asia/Tomsk"],"msk+04 - kemerovo":["Asia/Novokuznetsk"],"msk+04 - krasnoyarsk area":["Asia/Krasnoyarsk"],"msk+05 - irkutskburyatia":["Asia/Irkutsk"],"msk+06 - zabaykalsky":["Asia/Chita"],"msk+06 - lena river":["Asia/Yakutsk"],"msk+06 - tomponskyust-maysky":["Asia/Khandyga"],"msk+07 - amur river":["Asia/Vladivostok"],"msk+07 - oymyakonsky":["Asia/Ust-Nera"],"msk+08 - magadan":["Asia/Magadan"],"msk+08 - sakhalin island":["Asia/Sakhalin"],"msk+08 - sakha (e) north kuril is":["Asia/Srednekolymsk"],"msk+09":["Asia/Kamchatka"],"msk+09 - bering sea":["Asia/Anadyr"],"russia time zone 11":["Asia/Anadyr"],"russia time zone 10":["Asia/Srednekolymsk"],"russia time zone 3":["Europe/Samara"],"coordinated universal time-09":["Pacific/Gambier"],"utc-09":["Pacific/Gambier"],"coordinated universal time-08":["Pacific/Pitcairn"]};

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

// Generated from data/iana-identifiers.json (IANA tzdata2026d).
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

// Keep identifier separators and signed offsets meaningful.
const normalizeAlias = input => {
  let name = normalizeWhitespace(foldDiacritics(normalizeCase(input)));
  if (name.includes('/') || /(?:gmt|utc|msk)?[+-]\d/i.test(name)) {
    return name
  }
  name = normalizeApostrophes(name)
    .replace(/['.]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\b(?:time|city)\b/g, '');
  return normalizeWhitespace(name)
};

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
      zones[id].dst = dstPatterns[dst].split(/\|/);
    }
  });
});

addEtc(zones);

const canonicalIds = Object.fromEntries(Object.entries(identifiers).map(([id, target]) => [id.toLowerCase(), target]));
const canonicalize = (id) => canonicalIds[id.toLowerCase()] || id;

// Derive city spellings from IANA IDs instead of storing IDs in zone names.
Object.entries(identifiers).forEach(([id, target]) => {
  if (!id.includes('/') || id.startsWith('Etc/') || !Object.hasOwn(zones, target)) {
    return
  }
  const name = id.split('/').pop().toLowerCase();
  const names = new Set([name, normalizeAlias(name)]);
  names.forEach(alias => {
    if (alias) {
      lexicon[alias] = lexicon[alias] || [];
      lexicon[alias].push(target);
    }
  });
});

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

// Generated by scripts/build/01-pack.js from zone country codes.
var countryZones = {"australia":["Antarctica/Macquarie"]};

const regions = {};
const ids = [...new Set(Object.keys(zones).map(canonicalize))].sort();
ids.forEach(id => {
  if (!Object.hasOwn(zones, id)) {
    return
  }
  const region = id.split('/')[0].toLowerCase();
  regions[region] = regions[region] || [];
  regions[region].push(id);
});
Object.entries(countryZones).forEach(([region, extra]) => {
  regions[region] = [...new Set([...(regions[region] || []), ...extra.map(canonicalize)])]
    .filter(id => Object.hasOwn(zones, id)).sort();
});

const matchRegion = input => {
  const region = normalizeCase(input);
  return Object.hasOwn(regions, region) ? regions[region] : null
};

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
  // 7. Match the upkeep spelling after exact and historical spellings.
  const alias = normalizeAlias(input);
  if (alias && !utcNames.includes(alias) && alias !== 'gmt') {
    return matchAlias(alias)
  }
  return null
};

const maxPhrases = 48;
const maxCandidates = 96;
const descriptions = /\b(?:democratic|republic|of|the|peoples|people's|federal|federated|islamic|plurinational|bolivarian|kingdom)\b/g;
const clean = input => input.replace(/\s+/g, ' ').trim().toLowerCase();
const meaningful = input => clean(input.replace(descriptions, '').replace(/\b(?:and|st|saint)\b|&/g, ''));

const alternativeSpellings = (input, includeWords = true) => {
  const name = clean(input);
  const phrases = [name];
  const seen = new Set(phrases);
  const add = value => {
    const candidate = clean(value);
    if (candidate && meaningful(candidate) && !seen.has(candidate) && phrases.length < maxPhrases) {
      seen.add(candidate);
      phrases.push(candidate);
    }
  };

  // Expand each phrase once, stopping at a fixed budget rather than all permutations.
  for (let i = 0; i < phrases.length && i < maxPhrases; i += 1) {
    const phrase = phrases[i];
    add(phrase.replace(/&/g, ' and '));
    add(phrase.replace(/&|\band\b/g, ' '));
    add(phrase.replace(/\bst\b\.?/g, 'saint'));
    add(phrase.replace(/\bsaint\b/g, 'st'));
    add(phrase.replace(descriptions, ' '));
    const terms = new Set(phrase.match(descriptions) || []);
    terms.forEach(term => add(phrase.replace(new RegExp(`\\b${term}\\b`, 'g'), ' ')));
    add(normalizeAlias(phrase));
  }

  const candidates = phrases.slice(1)
    .sort((a, b) => Number(b.includes(' ')) - Number(a.includes(' ')));
  if (!includeWords) {
    return candidates
  }
  const addPart = value => {
    const part = clean(value);
    if (part && meaningful(part) && !seen.has(part) && candidates.length < maxCandidates) {
      seen.add(part);
      candidates.push(part);
    }
  };
  // Complete alternatives precede separated phrases, which precede single words.
  phrases.forEach(phrase => phrase.split(/&|\band\b|[,()]/).forEach(addPart));
  phrases.forEach(phrase => normalizeAlias(phrase).split(/\s+/).forEach(addPart));
  return candidates
};

const matchPart = (input) => {
  const found = matchWhole(input);
  const ids = typeof found === 'string' ? [found] : found || [];
  return [...new Set(ids.map(canonicalize))]
};

const matchAlternativeSpellings = (input, includeWords = true) => {
  const candidates = alternativeSpellings(input, includeWords);
  if (!candidates.length) {
    return null
  }
  // Keep curated exact aliases ahead of spelling guesses.
  const exact = input.trim().toLowerCase();
  if (Object.hasOwn(lexicon, exact)) {
    return [...new Set(lexicon[exact].map(canonicalize))]
  }
  for (let i = 0; i < candidates.length; i += 1) {
    const found = matchPart(candidates[i]);
    if (found.length) {
      return found
    }
  }
  return null
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
  // Region names must include every supported zone, not just curated aliases.
  const region = matchRegion(input);
  if (region) {
    return region
  }

  // Try complete spelling variants before normalization drops punctuation.
  // Keep explicit identifier and qualifier handling separate.
  if (input.includes('&') && !/[\/,()]/.test(input)) {
    const alternative = matchAlternativeSpellings(input, false);
    if (alternative) {
      return alternative
    }
  }

  // Whole input, including normalization and accent folding.
  const whole = matchWhole(input);
  if (whole) {
    return whole
  }

  // Unknown identifiers cannot fall back to partial matches.
  if (input.includes('/')) {
    return null
  }

  const alternative = matchAlternativeSpellings(input, false);
  if (alternative) {
    return alternative
  }

  // Explicit separators take precedence over word-pair guesses.
  if (/[,()]/.test(input)) {
    return matchSeparatedParts(input)
  }

  // Preserve qualifier intersections before trying individual words.
  const pair = matchWordPairs(input);
  if (pair) {
    return pair
  }
  // Don't turn arbitrary unknown phrases into matches for one familiar word.
  if (/&|\b(?:and|st|saint|democratic|republic|of|the|peoples|federal|federated|islamic|plurinational|bolivarian|kingdom)\b/i.test(input)) {
    return matchAlternativeSpellings(input)
  }
  return null
};

// Generated by scripts/build/01-pack.js. Edit data/metas.json instead.
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
