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
var pcked = {"Africa":{"Abidjan":["true¦abobo,bo8c6daloa,g1ivory coast,kumasi,piki7san ped0touba,utc,yamoussouk0zulu;ro;h2mt,reenwich0;! 0;mean,standard;!a0;!na;amayen0i,ote divoire;ne;bo dioulasso,uake","Greenwich"],"Algiers":["true¦aAb8c3dz2europe central,oran,s1t0;ebessa,iaret;etif,idi bel abbes;!a;e0hlef,onstantine;ntral europe0st,t;!an0;! s0;tandard,ummer;a0iskra,lida,oumerdas;b ezzouar,tna;lgeria0nnaba;!n","Central European"],"Bissau":["true¦g0utc,zulu;mt,nb,reenwich0uinea bissau,w;! 0;mean,standard","Greenwich"],"Cairo":["true¦:!1:#$%&:k la ,na,retsae,porue;aFdCeEfyawus i$b,gBha9m8n4oriac wen,r3t0ukdi,y7zeus;ee,py6see,u0;is0y0;sa;awwad da rfak,emmu9oxul,san $ tanidam,uh$mad;a0% e&;e8itpy1w0;lah,sa;ge;uyyaf 9wa#nibi1;myah#arbu0rus$6;hs;ahos,e,izagaz;ias trop,rad$t0;s $e0;& n%;i1niq,rbu#hallaha0t$t,yni0zig;m 1;liamsi,rd$xe0;la","Eastern European","egypt"],"Casablanca":["true¦aDfCkenitBm5oujda4rabat,sa2t0;angier,e0;ma9touan;fi,le0;! al jadida;! angad;a3ekn6o0;hammedia,rocc0;an,o0;! standard;!r0;!rakesh;ra;es;gadir,l hoceima","Morocco"],"Ceuta":["true¦ce2e1spa0;in,nish;s,urope central;ntral europe0st,t,utamelilla;!an0;! s0;tandard,ummer","Central European","eu2"],"El_Aaiun":["true¦casablanca,e1laayoune,morocco0western sahara;! standard;h,sh","Morocco"],"Johannesburg":["true¦!1:#$%&()*:er,africa,an,ast,ar,et,on;$ south#n,bIcEdDeCgqeb#ha,kAnewc&Hp9r8s5t3uitenhage,v2w1za0;!f;elkom,itb%k;%d#bijlp(k,#eeniging;e0he0;mbisa;&,o0prings;sh%guve,uth $0w)o;! st%d(d,n;%dCich(ds bay,oodepoort;a(l,i)#m(itzBort elizab)h,r)oria;l#k0rug#0;sdorp;& l*d2vat2;iepsloot,urb5;a1enturi0;*;pe town,rl)*vil0;le;en*i,loemf*tein,o1rakp0;%;ks0tshabelo;burg","South Africa"],"Juba":["true¦c2s0winejok;outh sudan,s0;!d;at,entral africa0;! standard","Central Africa"],"Khartoum":["true¦a8c6el 5k3ny4omdurm2port sud2s0wad medani;d0inga,ud1;!n;an;ass0hartoum north,osti;ala;dae3fasher,obeid;at,entral africa0;! standard;d damaz0l qadarif;in","Central Africa"],"Lagos":["true¦!1:#$%:frica,an,gu;a0Db0Bc03e02gZhYiSjRkNlLmGnEoBpoAs9u7viaQw0yaounXzar8; c4a3est0; 0ern4;a#0c2;! st$dard,n;rFst,t;entral0; a#;gep,muah0yo;ia;aChagamu,okoto;inte noire,rt harcourt;kKn1sogXw0yo;er7o;do,itsha;g,igeria0newi;!n;a1in9u0;bi,lenvos;i0kurdi;$ga,du%0;ri;ek0ub$J;ki;a1ik0;olo,wit;du0no,tsi0;na;imeQos;bad$,jebu o4k2l0seMwo;a or$%n,e0orin; i6sa;eLiIot ekp0;ene;de;oji ya heBuamA;o0usau;l0mbe;fe;bute ikorodu,fon alaaye,nu%;a2d,hakw3o0;d,n0tonou;go;bi3l1m0;ama;abar,um0;bo;nda;auchi,en0;%ela,in;b2do1# western,gege,je%nle,ku0t$i;re; ekiti;a,eoku1u0;ja;ta","West Africa"],"Maputo":["true¦:!1:#$:lartnec,na;a7drad$ts acBe3i2keohdniw,# acirfa,o0tac,uvak1wz,zm;iomihc,yawal0;ub;$g$s2sak3yam ijubm,zewlok;$mileuq,rarah,uqibmazom,w0;babmiz,gnol1t0z;ik;il;c3g$$k,ibim2l0pakihst,rieb;ac1o0upm1;dn,tam;an;irfa #","Central Africa"],"Monrovia":["true¦g1l0utc,zulu;br,iberia,r;mt,reenwich0;! 0;mean,standard","Greenwich"],"Nairobi":["true¦!1:#:frica;aCbAdodoBe5k2m1na0thika,yt,zanzibar;kuru,nsana;ayotte,beya,ombasa,wanza,yt;akamega,e0isumu;!nya0;!n; 3a0ldoret;st0t; a#0ern 1;! standard,n;a#;albala,ora0;ma;# eastern,rusha","East Africa"],"Ndjamena":["true¦!1:#:africa;# western,chad,t7w0; c4a3est0; 0ern4;#0c2;! standard,n;st,t;entral0; #;cd,d","West Africa"],"Sao_Tome":["true¦g4p3s0utc,zulu;ao tome1t0;!p;! p0;rincipe;mt,reenwich0;! 0;mean,standard","Greenwich"],"Tripoli":["true¦a7benghazi,e2l0misrat8tarhuna,zawiya;by,ibya0y;!n;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;l khums,z zawiy0;ah","Eastern European"],"Tunis":["true¦ce3europe central,sfax,t0;n,un0;!isia0;!n;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European"],"Windhoek":["true¦africa central,c2na0;!m0;!ibia;at,entral africa0;! standard","Central Africa"]},"America":{"Adak":["true¦a5h3nwt,u0;nited states1s0;!a;! of america;awaii0dt,st;! daylight;leutian1merica0;!n;! 0;islands,standard","Aleutian","usa"],"Anchorage":["true¦a3u0;nited states1s0;!a;! of america;h6k5laska1merica0;!n;! 1n0;! s1;daylight,s0;tandard;dt,st,t;dt,st","Alaska","usa"],"Araguaina":["true¦!1:#:south americ;br0east #a,palmas,#an east,tocantins;!a0st,t;silia1zil0;!ian;! standard,n","Brasilia"],"Argentina/Buenos_Aires":["true¦a0mar del plata;merica/argentina,r0;!g0st,t;!entin0;a0e,ian;! standard","Argentina"],"Argentina/Catamarca":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Cordoba":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Jujuy":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/La_Rioja":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Mendoza":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Rio_Gallegos":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Salta":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/San_Juan":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/San_Luis":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Tucuman":["true¦ar0san miguel de tucum2;!gentin0st,t;a1e,i0;an;! standard","Argentina"],"Argentina/Ushuaia":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Asuncion":["true¦c3p0san lorenzo;araguay1ry,y0;!st,t;! standard;apiata,iudad del este","Paraguay"],"Bahia":["true¦!1:#$:outh america,st;br2camacari,ea$ s#,feira de santa1itabu1s0vitoria da conqui$a;alvador,#n ea$;na;!a0$,t;silia1zil0;!ian;! $andard,n","Brasilia"],"Bahia_Banderas":["true¦:arajaladaug,dradnats ocixem 3lartnec xm,na1o1sarednab ed aihab,t0xm2;dc,hgilyad 2sc;cixem0;! 0;lartnec","Central Mexico"],"Barbados":["true¦a1b0us atlantic;arbados,b,rb;dt,st,t0;!lantic0;! 0;canada,daylight,standard","Atlantic"],"Belem":["true¦!1:#$%:south americ,east,an;%%indeua,br2$ #a,mac1para0#% $; $ am0uapebas;apa;!a0st,t;silia1zil0;!i%;! st%dard,n","Brasilia"],"Belize":["true¦american4b3c0us4;dt,entral0st,t;! 0;daylight,standard;elize,lz,z; central","Central"],"Boa_Vista":["true¦am3br1central brazil0roraima;!ian3;!azil0;!ian;azon0t;! standard","Amazon"],"Bogota":["true¦!1:#$%&:an,ar,en,ll;$m%HbDc7dosquebradas,floridabl#ca,i6k%nedy,m5neiva,p3s1v0;a&edup$,i&avic%cio;#ta m$6incelejo,o0;acha,ledad;a0ereiBopay#;lmiAsto;#izales,ede&in,onterB;bague,taguei;a4o1ucu0;ta;!l0st,t;!ombia0;! st#d$d,n;li,rtag%a;$r#2e&o,u0;c$am#ga,%av%tu0;ra;cabermeja,qui&a;ia","Colombia"],"Boise":["true¦america6idaho,m3u0;nited states1s0;!a;! of america;dt,ountain0st;! 0;daylight,id,standard;!n","Mountain","usa"],"Cambridge_Bay":["true¦ca4m0;d2ountain0st;! 0;daylight,standard;dt,t;!nad0;a,ian","Mountain","usa"],"Campo_Grande":["true¦am2br0mato grosso do sul;!azil0;!ian;azon0t;! standard","Amazon"],"Cancun":["true¦america easte6e3m1quintana roo,us east0;!e5;exic0x;an,o;astern0dt,st,t;! 0;daylight,standard;rn","Eastern"],"Caracas":["true¦alto barinIbarHcCguaAm7p6san5turmeEv0;alencia3e0;!n0t;!ezuela0;! standard,n;! venezuela; cristobal,ta teresa del tuy;eta4uerto la cruz;a0ucumpiz;raca0turin;ibo,y;ren7ti0;re;abim5iudad 2o1u0;a,m2;ro;bolivar,guay0;ana;in0quisimeto,uta;as","Venezuela"],"Cayenne":["true¦french guiana3g0;f1u0;f,iana;!t;! standard","French Guiana"],"Chicago":["true¦!2;:!1:#$%&()*:na,uo,ra,ro,artnec,ni,ts;aZdXeSg)vri,ht&w t&f,iQkNlFnBoAs2t0x8yremogtnW;c,dc0hgilyadX&peverhs,sc;!\\g*c;a4e3i0#el&2u;hpmem0lopaYo)lli,$lC;! ht$s0; wen;)om sed,t03;llad,s#k1x0;et;!%;de%l,inot# n7lli%B#lp;a9i2locnDo0;sidam,t0;g)l%,s$h;snocsQ*ua;(3uap0; t0;)0s;as;! 0;#0su;cire0;ma;co0%p d#lrevo;bbul,r eltt0;il;ppissi0r$0*irhc sup&c;ssB;ekuawlAg$r notab,iriarp d#rg,l0;ib2liv0;hsan,s0;nworb,tnuh;om;#l%g,%d#*0; l(;cirema9hamo,ksarb8m7#isi$l,s6t0woi;ihc4o0;kad ht2s0;enn0;im;&n,$s;iw;lut,u;abala,ohalko;en;! fo set0;a* detinu","Central","usa"],"Chihuahua":["true¦!1:#$%:standard,exic,entral;c8h6m0;azatlan,$3ountain 1x0;! c%;m0# m0;$o;an0o0;! pacific;ep0np0p0;mx;dt,% 0st;daylight,m0;$0x;an,o0;! #","Central Mexico"],"Ciudad_Juarez":["true¦juarez,m0;dt,exic2ountain0st,x;! 0;daylight,standard;an,o","Mountain","usa"],"Coyhaique":["true¦aysen,c0;hile0l,oihaique;!an","Aysen"],"Costa_Rica":["true¦american5c0sjmt,us5;dt,entral2osta rica1r0st,t;!i;!n;! 0;daylight,standard; central","Central"],"Cuiaba":["true¦am2br0mato grosso,varzea grande;!azil0;!ian;azon0t;! standard","Amazon"],"Danmarkshavn":["true¦denmark,g0utc,zulu;l,mt,reen0;land,wich0;! 0;mean,standard","Greenwich"],"Dawson":["true¦ca5m2y0;d0pt,wt;dt,t;dt,ountain0st;! 0;daylight,standard;!nad0;a,ian","Mountain"],"Dawson_Creek":["true¦ca4m1p0;pt,wt;dt,ountain0st;! 0;daylight,standard;!nad0;a,ian","Mountain"],"Denver":["true¦!2;a7colorado springs,el paso,m3navajo,salt lake,u0;nited states1s0;!a;! of america;dt,ountain1st0;!\\hmdt;! 0;daylight,standard;lbuquerque,merica0urora;!n","Mountain","usa"],"Detroit":["true¦!1:#$:america,st;#7e4grand rapids,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,pt,$,t,wt;! 0;daylight,mi,$andard;! ea$e0n;rn","Eastern","usa"],"Edmonton":["true¦alberta3c0;a0entral standard,st;! mountain,lgary,nad0;a,ian;! and northwest territories","Alberta and Northwest Territories"],"Eirunepe":["true¦a2br0;!azil0;!ian;c0mazonas west;re0t;! standard","Acre"],"El_Salvador":["true¦american5c2el1s0us5;an0lv,oyapango,v; salvador;dt,entral0st,t;! 0;daylight,standard; central","Central"],"Fort_Nelson":["true¦british columbia,ca3m0;dt,ountain0st;! 0;daylight,standard;!nad0;a,ian","Mountain"],"Fortaleza":["true¦!1:#:outh america;br5ca4east s#,imperatriz,j3m1natal,s0teresina;ao luis,#n east;a0ossoro;picernpb,racanau;oao pessoa,uazeiro do norte;mpina grande,ucaia;!a0st,t;silia1zil0;!ian;! standard,n","Brasilia"],"Glace_Bay":["true¦a2ca0us atlantic;!nad0pe breton;a,ian;dt,st,t0;!lantic0;! 0;canada,daylight,standard","Atlantic","usa"],"Goose_Bay":["true¦a2ca0labrador,npt,us atlantic;!nad0;a,ian;dt,st,t0;!lantic0;! 0;canada,daylight,standard","Atlantic","usa"],"Grand_Turk":["true¦america easte9c8e5kmt,t1us east0;!e8;c2urks0;! 0;and c4c4;!a;astern0dt,st,t;! 0;daylight,standard;aicos;rn","Eastern","usa"],"Guatemala":["true¦american5c2g0mixco,us5villa nueva;t0uatemala;!m;dt,entral0st,t;! 0;daylight,standard; central","Central"],"Guayaquil":["true¦cuenca,ec2ma1q0santo domingo de los colorados;mt,uito;chala,nta;!t,u0;!ador0;! 0ian;mainland,standard","Ecuador"],"Guyana":["true¦g0;eorgetown,uy1y0;!t;!ana0;! standard","Guyana"],"Halifax":["true¦a4ca2n1p0us atlantic;ei,rince edward island;ew brunswick,ova scotia;!nad0;a,ian;dt,st,t0;!lantic0;! 0;canada,daylight,standard","Atlantic","usa"],"Havana":["true¦:a9b8dradnats7erbutco ed zeid,n6o4s1thgilyad7uc0yeugamac;!eh,h,nh;anut sal,o0;geufneic0reyob;! olimac daduic;ir led ranip,jnaran oyorra,ma0;natnaug,yab;ab1iugloh; ab0;uc;buc0ralc a1;! ed ogai0;tnas","Cuba","cuba"],"Hermosillo":["true¦ciudad obregon,h5m0nogales,sonora;exic0x;an0o;! pacific0;! 0;daylight,standard;e0n0;pmx","Mexican Pacific"],"Indiana/Indianapolis":["true¦!1:#$:america,st;#Acrawfo9dadukmn,e6iBp4$ar5u0;nited $ates2s0;! ea$0a;!e9;! of #;erry,i0ulaski;ke;a$ern0dt,$,t;! 0;daylight,in,$anda0;rd;! ea$e1/i0n;ndiana;rn","Eastern","usa"],"Indiana/Knox":["true¦!1:#$:america,entral;#6c3indiana,u0;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"Indiana/Marengo":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Indiana/Petersburg":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Indiana/Tell_City":["true¦!1:#$:america,entral;#6c3indiana,u0;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"Indiana/Vevay":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Indiana/Vincennes":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Indiana/Winamac":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Inuvik":["true¦alberta and northwest territories,c0pddt;a0entral standard,st;!nad0;a,ian","Alberta and Northwest Territories"],"Iqaluit":["true¦america easte7ca5e1us east0;!e6;astern1d0st,t;dt,t;! 0;daylight,standard;!nad0;a,ian;rn","Eastern","usa"],"Jamaica":["true¦america easte8e5j2k1new k1us east0;!e7;ingston;am0m;!aica0;!n;astern0dt,st,t;! 0;daylight,standard;rn","Eastern"],"Juneau":["true¦a3u0;nited states1s0;!a;! of america;k3laska1merica0;!n;! 0n;daylight,juneau area,standard;dt,st,t","Alaska","usa"],"Kentucky/Louisville":["true¦!1:#$:america,st;#7e4k8u0wayne;nited $ates2s0;! ea$0a;!e6;! of #;a$ern0dt,$,t;! 0;daylight,ky,$andard;! ea$e1/k0n;entucky;rn","Eastern","usa"],"Kentucky/Monticello":["true¦!1:#$:america,st;#7e4kentucky,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"La_Paz":["true¦bo1cochabamba,oruro,s0;anta cruz de la sierra,ucre;!l0t;!ivia0;! standard,n","Bolivia"],"Lima":["true¦arequiBc7huancAi6juliaca,p2sant1t0;acna,rujillo;a anita los ficus,iago de sur6;e0iura,ucall8;!r0t;!u0;! standard,vian;ca,quitos;allao,hi1us0;co;cl0mbote;ayo;pa","Peru"],"Los_Angeles":["true¦!2;:!1:#$%&()*:na,ir,no,cific,ro,ts,ema;aS&apPdKeEfs,hcaeb Dmieha#,nAo5(#m es$nus,s3t1yellav 0;gn$Honer6;dp0hgilyadK%m7p,sp;!\\i)p;agev sal0eWu;! ht(n;csic#rfAgeidAn2t0;n*rcPsed0;om;er,idranreb7s0;erf;a1o0;ge(,sredneh,tkco);cErf3;g%l,%tgnitnuh;dis4lttaes,n2s0ta) %tgnihsaw,vorg nedrag;idar7oj0; nF;ako0ivri;ps;#eco,rev$;leifsrekD#l3ra0;d#)0nxo; &0;ap;kao,t(p;! 0;ac0su;$*;c$*6daven,g%macuc ohc#r,in(filac4l,mocat,#1su,t0;$alc 1siv aluhc; 0t%f;atn0;as;! aj0;ab;! fo se0;ta) detinu","Pacific","usa"],"Maceio":["true¦!1:#:south americ;a4br0east #a,#an east;!a0st,t;silia1zil0;!ian;! standard,n;lagoassergipe,racaju","Brasilia"],"Managua":["true¦american5c2ni0us5;!c0;!aragua;dt,entral0st,t;! 0;daylight,standard; central","Central"],"Manaus":["true¦am3br0central bra1;!a0;zil0;!ian;azon0t;! standard,as east","Amazon"],"Martinique":["true¦:adanac5citnalta4dradnats5e2q1t0;a,da,hgilyad4mff,sa;m,tm;cnarf ed trof,uqinitram0;! hcnerf;! su; citnalta","Atlantic"],"Matamoros":["true¦american5c2heroica matamoros,m0nuevo laredo,reynosa,us5;exic0x;an,o;dt,entral0st,t;! 0;daylight,standard; central","Central","usa"],"Mazatlan":["true¦!1:#$:standard, pacif;culiacan,h9los mochis,m0tep5;exic2ountain 0x;m0# m0;exico;an2o0;!$0;ic;!$ic0;! 0;daylight,#;ep0np0p0;mx","Mexican Pacific"],"Menominee":["true¦!1:#$:america,entral;#6c3u0wisconsin;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"Merida":["true¦c3guadalajara,m0tuxtla;exic1x0;! central;an,o;ampeche4dt,entral 0st;daylight,m0;exic0x;an,o0;! standard;!yucatan","Central Mexico"],"Metlakatla":["true¦a3u0;nited states1s0;!a;! of america;k3laska1merica0;!n;! 0n;annette island,daylight,standard;dt,st,t","Alaska","usa"],"Mexico_City":["true¦:!1:#$%&()*+-./<=>?@[]^: ed ,ed ,la,ac,na, o,oc,ap,al,ad,at,hc,ar,au,re,ne,et,am,lerom;a0Bc09dr.(ts)cixem 08e07i05l03nSoBs6t5x4z0;e0urc=ev;<(s)(ic=g#d.elos,r>j 0uqir@#+a%x;$0oti@b;(p%cuan,*lup&a;em,mT;dc,hgily. 02sc,wc;a2[@i%cs>ga,o0;c%*azta*,[] zepolW^0;!#cep[&e;c[&Mp0?rtn* a@%dg];a8ilu]/;cAg5r2t0;>0os#&u<+;ja(ug,p=i;/e?uq1e0;d])floda)v/sZmor s-*in,r?Z;!#ogaitP;%dih2n0;=ud,ic(pl0;i<;! 0;$&ir azop,leugG;ix4l1s0;abVi%j;a0imi<ox;ca0ztop&za;*,tP;!em6;a1o0;el)veun,gerbo)rav%;c2p0t&uy;>ru,lRop0;az;a1ixem0;! 9;o1uh0;[,%mi< air] /5;<0yI;im;=t@c xm,toy*%uhazen0; d.uic;l%czi (ltit4sotop siul 0;(s;<epm&,l%v l$ainolCuq+euqF;%rtn4;>hDom[h0;uaG;cCi^,l6m5pa%p/4raja%da3som?h-liv,t2uga#ojo,y-1z(rr&)(itsun0;ev;ec;r-%v)tr6siva@ub;ug;zi;.% sol#noel,il2;a3b2iuha1t(penl4u<+0;/;*;eup;cx0not;-t;a1ul0;+/xi,ot;van?0xao;uc","Central Mexico"],"Miquelon":["true¦:!1:#$:noleuqim ,rreip;dradnats6e4mp3#0thgilyad6;dna e3e$0;! t0;n2s;!eh,h,nh,s;$ tn0;ias; #e$ ts","St. Pierre & Miquelon","usa"],"Moncton":["true¦a2ca0hepm,new brunswick,us atlantic;!nad0;a,ian;dt,st,t0;!lantic0;! 0;canada,daylight,standard","Atlantic","usa"],"Monterrey":["true¦:!1:#$%:lartnec,irotciv,ad;a7dr%nats ocixem 6epu8# xm,n3o1t0xm5;dc,hgily% 5sc;ci0debocse lareneg8gnarud ed a$,icalap zemog,llitl7redam8;pmat,x1;acix0oerrot;em0;! 0;#;c%opa2$2niratac atn1raja0volcnom,zrag sol ed salocin n1;l%aug;as; d%uic","Central Mexico"],"Montevideo":["true¦montevideo 4u0;r1y0;!st,t;uguay0y;! 0an;standard","Uruguay"],"New_York":["true¦!2;:!1:#$%&()*+-./<=:ts,ni,re,ro,al,no,ne,ae,ta,or,ih,el,su;a0Bc09d02eShQiOkNlMmLnCo9%#e8s5t2x)rb eht,y0;es%j0kcut*k,n;! V;de1e,hgilyad00)m%v,s0ucitcenn4;+ =,e;!\\f#e;d+m,e0F*e4%k)y,tte=hcassam,u0wen t&pR;!bmul0;oc;c&w,hc.;d1/o,laffub,. anat$0&bs*erg;uq;<ot,n(&;a6o2%#+0ylko.b;! 0;ac5=;rka,t0;g$1sob0;! htuW;hRxC;c0g/c5t-hnN;i%ma;ahrud,<as )#$w;a&c epac,f;lofrRra9;ma0-n$c$c;im;+la/,c+b ai$griv,g0=bt(f D;i<arQrubsttip;c*div.p,ess8k+paseQl5$Er3t0;a# k&y 3t0;eyaf )tg$x0olraO;<;aw(ed,/spmah 0omitlab;wen;ad%du( t&f,liv0;etteyaf,)0xonk;ri,skcaj;ah(lAen*t;n2radna#0; n%0;#+;(0omhcir;ev<c,si 1yr0;am;edohr,*-#;d )tg$h0yn;saw;ci%ma8di&lf,goonat-7i4$l.ac ht1pm0=,tn(-;at;r1u0;os;on;g&eg,hpled(/p,n0;avlysn*p,igriv0;! #ew;hc;! fo se0;-# detinu","Eastern","usa"],"Nipigon":["true¦america easte6ca4e1us east0;!e5;astern0dt,st,t;! 0;daylight,standard;!nad0;a,ian;rn","Eastern","usa"],"Nome":["true¦a3u0;nited states1s0;!a;! of america;k5laska1merica0;!n;! 1n0;! s1;daylight,s0west;tandard;dt,st,t","Alaska","usa"],"Noronha":["true¦atlantic islands,br2f0;ernando de noronha0nt;! standard;!azil0;!ian","Fernando de Noronha"],"North_Dakota/Beulah":["true¦!1:#$:america,entral;#6c3north dakota,u0;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"North_Dakota/Center":["true¦!1:#$:america,entral;#7c4merc3north dakota,oliv3u0;nited states1s0;! 7a;! of #;er;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"North_Dakota/New_Salem":["true¦!1:#$:america,entral;#6c3north dakota,u0;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"Nuuk":["true¦g4w0;est greenland1g0;st,t;! s0;tandard,ummer;l,r0;eenland,l","West Greenland","green"],"Ojinaga":["true¦american5c2m0us5;exic0x;an,o;dt,entral0st,t;! 0;daylight,standard; central","Central","usa"],"Panama":["true¦a6e3pa1san miguelito,us east0;!e6;!n0;!ama;astern0dt,st,t;! 0;daylight,standard;merica easte0tikokan;rn","Eastern"],"Pangnirtung":["true¦a6baffin island,ca4e1nunavit,us east0;!e6;astern0dt,st,t;! 0;daylight,standard;!nad0;a,ian;ddt,merica easte0;rn","Eastern","usa"],"Paramaribo":["true¦s0;r2ur0;!iname0;! standard;!t","Suriname"],"Phoenix":["true¦!2;aEcDgBidaho,m6n5s4t3u0wyoming;nited states1s0tah;!a;! of america;empe,ucson;cottsd7inaloa,onora;ayarit,ew mexico;aryv5dt,esa,o1st0t,wt;!\\hmdt;nta6untain0;! 0;daylight,standard;ilbert,lend0;ale;handler,olorado;merica1rizo0;na;!n","Mountain"],"Port-au-Prince":["true¦:dradnats6ellivnoitep,it5nretsae3ruoferrac,steuquob sed xiorc,t0xiap ed trop;de,e,h1s0;ae su,e;!gilyad3;! 0;acirema,su;h,iah; nretsae","Eastern","usa"],"Porto_Velho":["true¦am3br1central brazil0rondonia;!ian3;!azil0;!ian;azon0t;! standard","Amazon"],"Puerto_Rico":["true¦a2bayamon,p0us atlantic;r0uerto rico;!i;dt,st,t0;!lantic0;! 0;canada,daylight,standard","Atlantic"],"Punta_Arenas":["true¦c1m0region of m0;agallanes;hile1l0;!t;! standard,an","Magallanes"],"Rainy_River":["true¦american5c0ft frances,us5;a2dt,entral0st,t;! 0;daylight,standard;!nad0;a,ian; central","Central","usa"],"Rankin_Inlet":["true¦american6c0us6;a3d2entral0st,t;! 0;daylight,standard;dt,t;!nad0;a,ian; central","Central","usa"],"Recife":["true¦!1:#$%:south americ,ar,st;br3c$u$u,ea% #a,jaboatao2olinda,p0#an ea%;auli%a,e0;rnambuco,trolina;! dos gu$$apes;!a0%,t;silia1zil0;!ian;! %and$d,n","Brasilia"],"Regina":["true¦american8c2s0us8;askat0k;chew5oon;a2dt,entral0st,t;! 0;daylight,standard;!nad0;a,i0;an; central","Central"],"Resolute":["true¦american5c0us5;a2dt,entral0st,t;! 0;daylight,standard;!nad0;a,ian; central","Central","usa"],"Rio_Branco":["true¦ac2br0;!azil0;!ian;re0t;! standard","Acre"],"Santarem":["true¦!1:#:south americ;br1east #a,para we0#an ea0;st;!a0st,t;silia1zil0;!ian;! standard,n","Brasilia"],"Santiago":["true¦a8c3iquique,la pintana,puente alto,rancagua,san bernardo,t1v0;alparaiso,ina del mar;alca0emuco;!huano;h1l0oncepcion;!st,t;ile0l;! s0an;tandard,ummer;ntofagasta,rica","Chile","chile"],"Santo_Domingo":["true¦:a9ci5dradnatsAetse2m8n7od,s1t0;a,da,hgilyad9mds,sa;irocam ed ordep 2orellabac sol ed ogait2; 0o 0;ognimod ot0;nas;lbuper n1tnalta0;! su;acinim0;od;danac0namor al,tsiv alleb; citnalta","Atlantic"],"Sao_Paulo":["true¦:!1:#$%&()*+-./<=>:ac, o,na,d ,irema htuos, ed,ra,ir,re, e,at,ai,ar, s;a08d*d%ts <lis0QeUiRlQmO%iliNoGrb,s4t2u0;anemulb,bme,caugi 0ruR;aJo&zof;rb,s0;ae n#(,rb;a7e4ilop1o0;hl0Blr#Upm#>C*lc>etn5t%s;a%,o0;n0rt5;a+olf,ivid;*dalav rodan-vog,ven>ad$a9z0;#/yog>o&so4urc>a&ig0;om;ix#.&euqud,ni2o1tol0;ep;gal.tes,n#;pm#;am<v,csaso,d5grubmah$4+,%zLpm#$d$d*n-bJr3terp$0xor droflG;a1+ 0;o&esG;riebM;alcJie%j)J;von;lopoelDnuf$ssap;s02z02;eg/nUi0;rimep/i)$rieohc#,t7;ev#s#,izZus$&s<x#;a1er#aj,o-tin,-ur0t+em)$a7vep07;ab;idnJrob05tav=g;d8llivnioj,r6s4t0;abuGn0seo&a*b*bP;e1oz+oh$l0;eb;civ1durp.tnedise8;oj0;$M;am0d%$Kgela$tr7;us;%rg 1-v0;$1;<a1o0;+;rp;bOcNdMgniKhlev alJi9j8meda7n5r1ssorg /n0uL;op;b,iemil,of.&zi2-s0;! ad$aob0;/;uj;#+ema,i0;rdnol,tla%lp;id;u*ug;d%l8li6%iog5r1t0zul2;oc;am0ot7; a0;tn0;as;!.&adice*pa;r4s0;=b;otroh,rB;iv;r0tapi;am;=ovla,noder /lov;( tsae,%rf;a4i2ut0;<adni,eceuqauq0;/i;t+uc,ucip=0;#;c1r0;ebu;ic=ip,or0;os","Brasilia"],"Scoresbysund":["true¦e4g2h0ittoqqortoormiit;e0neg;eg,g;l,reenland0;! eastern;ast greenland1g0;st,t;! s0;tandard,ummer","East Greenland","green"],"Sitka":["true¦a3u0;nited states1s0;!a;! of america;k6laska1merica0;!n;! 1n0;! st2;daylight,s0;itka area,t0;andard;dt,st,t","Alaska","usa"],"St_Johns":["true¦ca6h4n0;d2ewfoundland0st,t;! 0;daylight,labrador,standard;dt,t;e0n0tn;tn;!nad0;a,ian","Newfoundland","usa"],"Swift_Current":["true¦american6c0saskatchew5us6;a2dt,entral0st,t;! 0;daylight,standard;!nad0;a,i0;an; central","Central"],"Tegucigalpa":["true¦american5c2h0san pedro sula,us5;n0onduras;!d;dt,entral0st,t;! 0;daylight,standard; central","Central"],"Thule":["true¦a1g0pituffik,us atlantic;l,reenland;dt,st,t0;!lantic0;! 0;canada,daylight,standard","Atlantic","usa"],"Thunder_Bay":["true¦america easte6ca4e1us east0;!e5;astern0dt,st,t;! 0;daylight,standard;!nad0;a,ian;rn","Eastern","usa"],"Tijuana":["true¦america8baja california,ensenada,h6m3p0us8;acific0dt,st,t;! 0;daylight,standard;exic0x;a0o;li,n;e0n0;nomx; pacific","Pacific","usa"],"Toronto":["true¦:aDcebeuq,dradnatsCeirrab,l9mahkram,n4oiratno3r2t0uaenitag;de,e,hgilyadBs0;ae su,e;enehctik,osdniw;! nod6;a3ot2retsae0;! 0;acirema,su;limah,pmarb;c,epen,hguav,id6;a1iueug0lih dnomhcir;nol;ertnom,val; nretsae;c,d1guassissim,wa0;hso,tto;anac","Eastern","usa"],"Vancouver":["true¦america pacific,b4ca1ladner,m0okanag3pacific bc,surrey,victor5yukon;ountain standard,st;!nad0;a,i0;an;ritish columb0urnaby;ia","British Columbia"],"Whitehorse":["true¦ca3m0yst;dt,ountain0st;! 0;daylight,standard;!nad0;a,ian","Mountain"],"Winnipeg":["true¦ca2e1m0west m0;anitoba;astern standard,st;!nad0;a,ian","Manitoba"],"Yakutat":["true¦a3u0;nited states1s0;!a;! of america;k5laska1merica0;!n;! 1n0;! s1;daylight,s0yakutat;tandard;dt,st,t","Alaska","usa"],"Yellowknife":["true¦ca3m0;dt,ountain0st;! 0;daylight,standard;!nad0;a,ian","Mountain","usa"]},"Antarctica":{"Palmer":["true¦a0palmer;ntarctica,q","Palmer"],"Casey":["true¦a2cas0;ey0t;! standard;ntarctica,q","Casey"],"Davis":["true¦a2dav0;is0t;! standard;ntarctica,q,ta","Davis"],"Macquarie":["true¦!1:#$:eastern,tralia;a0# aus$6macquarie island;e6u0;!s0; east2$0;! #,n0;! # daylight;!ern0;! standard;dt,st,t","Eastern Australia","aus"],"Mawson":["true¦a2maw0;son0t;! standard;ntarctica,q","Mawson"],"Rothera":["true¦a0;ntarctica,q,r0;gentin0st,t;a0ian;! standard","Argentina"],"Troll":["true¦a3gmt,troll0;! 0;research station,s0;tandard,ummer;ntarctica,q","Troll","troll"],"Vostok":["true¦!2;a2msk+\\e,vost0;!ok0;! standard;ntarctica,q","Vostok"]},"Asia":{"Urumqi":["true¦aqsu,c1k0shihezi,urumchi,wulumuqi,xinjiang;ashgar,orla;hin0n;a,ese","Xinjiang"],"Almaty":["true¦!1:#$:stan,st ka;a7central asia,ea$zakh#6k2nur sultan,p1s0taraz,u$menogorsk;emey,hymkent;avlodar,etropavl;a0z;ragandy,z0;!akh#0;! eastern;! #dard;lm0#a;a ata,t","East Kazakhstan"],"Amman":["true¦irbid,jo0russeifa,wadi as sir,zarqa;!r0;!dan0;!ian","Jordan"],"Anadyr":["true¦ana3petropavlovsk kamchatsky,ru0;!ssia0;!n0;! federation;dyr0t;! standard","Anadyr"],"Aqtau":["true¦!1:#$:sta,azakh;alm4k2mangghy#u/manki#u,west 0;asia,k$#n0;! #ndard;$#n0z;! western;a ata,t","West Kazakhstan"],"Aqtobe":["true¦!1:#:azakhstan;a4k2west 0;asia,k#0;! standard;#0z;! western;ktobe,lm0;a ata,t","West Kazakhstan"],"Ashgabat":["true¦t0;km,m2urkmen0;abat,istan0;! standard;!st,t","Turkmenistan"],"Atyrau":["true¦!1:#:azakhstan;a4guryev,k2west 0;asia,k#0;! standard;#0z;! western;lm0tirau;a ata,t","West Kazakhstan"],"Baghdad":["true¦a7basrHdihok,erbil,i4k3mosul,na2r1s0;adr,u8;amadi,iyadh;jaf,sirD;arbala,irkuk,uwait;q,r0;aq0q;!i;bu ghurayb,d diw7l 6rab2s0; su0t;laym5;!i0;a0c;!n0;! standard;amar2basrah al qadim2falluj2hill2kut,mawsil al jadid2;an0;iy0;ah","Arabian"],"Baku":["true¦az0ganja,lankaran,sumqayit;!e0t;!rbaijan0;! standard","Azerbaijan"],"Bangkok":["true¦:a9d8euh,gnohpi7h5i1nakarp tumas,oekat,t0;ci,erk kap;a1naht nodu,on5rub0; no1ahtnon gnaeum;ht,m gnai0y t3;hc;ni0t;d m5v;ah;nali1radnats an2;hcar is,isa 3misahctar nohk2n1oh hn0trakaj;aht;ihcodni;an;es,tsae htuos","Indochina"],"Barnaul":["true¦biysk,krat,north asia,ru0;!ssia0;!n0;! federation","Krasnoyarsk"],"Beirut":["true¦e3l0ras bayrut;b1eban0;ese,on;!n;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","leb"],"Bishkek":["true¦k0osh;g2yrgy0;stan,zstan0;! standard;!t,z","Kyrgyzstan"],"Brunei":["true¦b0;dt,n3r0;n,unei0;! darussalam0;! standard;!t","Brunei Darussalam"],"Chita":["true¦ru2yak0;t,utsk0;! standard;!ssia0;!n0;! federation","Yakutsk"],"Choibalsan":["true¦dornodsukhbaatar,m2ula0;anbaatar0t;! standard;n,ongolia0;!n","Ulaanbaatar"],"Colombo":["true¦chenn5dehiwala mount lavinia,i3kolkata,lk2m1new delhi,sri lanka0;!n;oratuwa,umb3;!a;ndia0st;! standard,n;ai","India"],"Damascus":["true¦a4deir ez zor,h3latakia,sy0;!r0;!ia0;!n;am1oms;leppo,r raqq0;ah","Syria"],"Dhaka":["true¦bEcCdinajBgaziBjessAkhul9m8na5pa3ra2s1t0;angail,ungi;aid9hib5ylhet;jshahi,ng8;b5l0r naogaon;labi,tan;gar5r0t4;ayan0singdi;ganj;irpur model tha0ohammad2ymensingh;na;ore;pur;hattogram,o0;milla,xs bazar;a0d,gd,ogra,st;gerhat,ngladesh0rishal;! standard,i","Bangladesh"],"Dili":["true¦east timor2t0;imor leste,l0;!s,t;! standard","East Timor"],"Dubai":["true¦a6g4mus2om1ras al khaim3sharj3u0;ae,nited arab emirates;!an,n;aff0cat;ah;st,ulf0;! standard;bu dhabi,e,jm0l ain,rabi0;an","Gulf"],"Dushanbe":["true¦t0;ajikistan1j0;!k,t;! standard","Tajikistan"],"Famagusta":["true¦cy5e0northern cyp6;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;!p0;rus","Eastern European","eu3"],"Gaza":["true¦e4gaza strip,p0;alestin1s0;!e;e,ian0;! territories;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","pal"],"Hebron":["true¦e3p0west bank;alestin0s;e,ian0;! territories;ast1e0urope eastern;st,t; jerusalem,ern europe0;!an0;! s0;tandard,ummer","Eastern European","pal"],"Ho_Chi_Minh":["true¦biCcAda 8i6nha tr9qui nhBrach gia,sa dec,th4v0;iet1n0ung tau;!m; nam,nam0;! south,ese;i xa phu my,u0; đuc,an an;ct,ndochina0;! standard;lat,n0;ang;an tho,ho l0;on;en hoa,nh thanh","Indochina"],"Hong_Kong":["true¦h1jungwah,kowloon,new territories,t0victoria,yahnmahn;suen wan,uen mun;eung g6k4ong0; kong0k5;! 0;island,s0;ar china,tandard;!g,s0t;ar,t;ong","Hong Kong"],"Hovd":["true¦bayan olgiigovi altaihovduvszavkhan,hov4m2west0; 0ern 0;mongolia;n,ongolia0;!n;d0t;! standard","Hovd"],"Irkutsk":["true¦angar5brat5irk3north asia east,ru0ulan ude;!ssia0;!n0;! federation;t,utsk0;! standard;sk","Irkutsk"],"Jakarta":["true¦:!1:#$%&:senodni,gn,at,am;aRbiw,dQgCheca FiAko9laget,m%Gn4o3r2t1u0;luk$Arabn6;%upic,ucr6;%nais$%&5ebmVis$uelic,ogob;dnobutis,g$iloborp,trekowQ;a0di,oberYretsew ai1uid&;dem,$ol1i0;#;ak0;ep;lk$edsa$er,ped;ajnib,bmMh&SmubakKridek,sak0;eb;n0uruc;a3onibPu0;dn1pmal r0r7;adn0;ab;bmel7d6l3r0;&es,e0;$%0s;! htuos;&1um0;ap;!ep;ap,em6;!ap;i,radn%s ai# nA;epmaBi#7r4traka1ya0;bar2l&kis%;r1w0ygoy;rup;us;ap1t&usav0;aj;ej;! 0;n0t1;ret0;sew;ic","Western Indonesia"],"Jayapura":["true¦!1:#:ndonesia;ambon,east3i1m0new guinea,wit;alukus,oluccas;d,#0;! eastern,n; i#,ern i#0;! standard","Eastern Indonesia"],"Jerusalem":["true¦ashdod,beersheba,haifa,i0jmt,petah tiqwa,rishon leziyyon,tel aviv,west jerusalem;d4l,s0;r0t;!ael0;! 0i;daylight,standard;dt,t","Israel","isr"],"Kabul":["true¦af0herat,jalalabad,kandahar,mazar e sharif;!g0t;!hanistan0;! standard","Afghanistan"],"Kamchatka":["true¦anadyr,pet3ru0;!ssia0;!n0;! federation;ropavlovsk kamchatsk0t;i0y;! standard","Petropavlovsk-Kamchatski"],"Karachi":["true¦!1:#$%&(:ha,wal,an,ar,ra;&ifQbNchKde( IfaisalHguj(GhyderHislamHj#ng sadr,kElaDm8nawabs#h,okaBp4quetta,(3s0;a1h0ialkLukkO;ahkKekhupu9;ddiqEhi$,rgod#;him y&F$pindi;ak1es#w&,k0;!t;!ist%0;! st%d&d,i;a3i1u0;ltBzaff&7;ngo0rpur k#s;(;lir c%tonment,rd8;hore,rk%a;a0otli;moke,s9;n9t;abad;g#zi0ismail0; kh1;ini1uni0;%;ot;a0himber,ure2;#$p0nnu,ttag(m;ur;$a","Pakistan"],"Kathmandu":["true¦biratnagar,n1p0;atan,okhara;epal1p0;!l,t;! standard,ese,i","Nepal"],"Khandyga":["true¦ru2yak0;t,utsk0;! standard;!ssia0;!n0;! federation","Yakutsk"],"Kolkata":["true¦:!1:#$%&()*+-./<=>?@[]^_`~:na,ra,ah,ar,la,ab,hs,dn,hc,aj,ru,ma,an,ag,ta,ih,am,ug,ht,ni,ir,ga;0:3W;1:30;2:39;3:38;a2Pd2Ee23fi$* $hib,g/d,h1Ti0Zj&~y&p,k0Xl0Tm0Kn0Co$kob,rEsawed,t9u6wonkcul,y4;llie$b,r4;alleb,+umh0Hre-udup;[5gulum,mm.,/4;(gneb,sym;!j.;a5epsoh,okj2s4ureem;i,ls;j iolgn3pin5r4sa$b;.],us;ap,os;aNeMh%sd#lLim*0oKu4yhgnom;-i2kmut,n#y=0p6ss`^,t4yittov15;a4n],t)<;ddorp,l;aBde*m.,~Ah9i7(6m&5#4p12rPsalib,?$1;hrGjh%s,k,$has,yg;!%),`*;b.,~1;a4#m;du,j,r;doj,k&og;n,r26;g7h6jib,l4mh&b,t##,zrim;lub^uq,o4;*,s;!lok;#rwon,/d;guas,i(wg;ub;mja,#kib;dGg=8h7kis,riv,s6w4;di$h,*4(,s4;e#bu1;@,t`<;d#(j,it0; Aa8da1Ni7m5#d0Xr4s%lu,va1;affazum;a4`0;j,y*;hd#g,rs;g#g,nu<y,r4;),+e/s;ijavi*,/d%) (l;ib,#ya1;a9i8o>7ud4; a4a4;rh4;ed;e(m,(j,/g;!.ju,-oc;^s4i+i,m%dd$b,yl0;.2;a6e(5u>l4;eb;pidupas2s;+]8l7n?p6r4;a4gu/g,up%t##vur@t;b<t,~#iziv;%kasiv,ili-[;lok,t2;[2m2;a5iocreg3o4]i+id,wazia;onrUs#sa;g#$w,h4nr0po1vasu1;bmMpmi;atDcattuc,i*3;rp;aVdUgThQj#$kl%ci,lDnAr9s8t4va$hd;a4lO;h4pJv&<;aw],i4$m0;=,#p;a#$v,#hj;p0E]ilis;a5et,i4ol;hor;hb$p,wi1;aDbCeAg8(6u&g_s,vi4;bDr4;ob;bb9p4;p&i-7?kB;n4uh;as;$be2vlen4;urit;uh;b,p,tl5vib4;mod;uk;c5led4;! wen;i/kall0n2ok;&ubal0n3;ava,#wi1uku^ooP;bmum4li1nne-,/d[;! iv3;a9d>=uj,g8$g4sed&p $ttu,t=$<;f.3i5#j4;us;d4(;#-;) lor0i&h);r4wate;$,w4;oh;ud;doDnBr4;eg#vad,o4;+i,jn8l6s5t)mi4;oc;ym;>nSle4;!n,v;at;a4up;^;k@zok,re;a4e+3_,$d#ts ai+i;b5id3w-_- `p4;mip;a4#hd;d6g#/a,h5iz%g,<zin,red4zorif;nuces,yh;al(,kur5;&6e5i4;$f;mha;om;b0Ed06g02hZiVkaTlNnJrAs8t7w5y4;>,hdA;+4er;%k;ok,tuc(c;=Rr4;is;a7~,o5p%c,t*a$h4u^4;[;%,mil4;ib;dod7p?1w4;li1r4;um;hb;av;a@d6l5?4;p,s;.;ul;a7e4oka,uk-n8;k/2r3;=;&;it4t$~;ap;t=r0wuj4;>;d6lu5nr4;up;hd;_;or5sido,zuppa4;(;<;#hbr6omi5$bl4;];*;ad;a8ion7n4;a5@t4;);-;! re?erg;_k0way.4;iv;ak;as5r4;ok;og","India"],"Krasnoyarsk":["true¦krat,north asia,ru0;!ssia0;!n0;! federation","Krasnoyarsk"],"Kuala_Lumpur":["true¦alor setar,bukit mertajDgeorge town,ipoh,johor bahCk8m4petali3s0taipiB;e1hah alCu0;ba1ngai petani;pa8remb7;ng jaya;ala1y0;!s,t;cca,ysia0;! standard,n;ampung baru suba2la2ota bha3ua0;la terengganu,nt0;an;ng;ru;am","Malaysia"],"Kuching":["true¦kota kinabalu,m2s0tawau;a0ibu;bahsarawak,ndakan;alaysia1iri,y0;!t;! standard,n","Malaysia"],"Macau":["true¦beij7c4m0urumqi;ac0o;!a0;o0u;! sar china;h0st;ina0ongq1;! standard;ing","China"],"Magadan":["true¦mag3ru0;!ssia0;!n0;! federation;adan0t;! standard","Magadan"],"Makassar":["true¦!1:#$%&:ndonesia,ar,an,ntral;ba8ce6denpas$,i4k3l2ma1palu,s0wita;am$inda,ulawesi;nado,t$am;abu% bajo,oa j%6;end$i,up%g;d,#0;! ce&,n;lebesbalinusa,& i#0;! st%d$d;likpap0nj$masin;%","Central Indonesia"],"Manila":["true¦!1:#$%&()*:an,in,ta,la,ga,ue,lo;#04bWcRdaPfilip$o,general s#tOiMlJmCnaBoAp4q)zIs#1%0valenz)&,zambo#(;c*bZguig,r&c,ytE; 1t0;a ro2ol;fern#do,jose del monte,pab*;a3h1)rto pr$ce0;sa;!ilipp$e0l,st,t;! st#dard,s;(diRnal#oy,r#aq),s0;ay,ig;*n(po,rmoc;(,votQ;a0eycauayNunt$lupa;ba&cat,gugpo pob&ci4kati,l3n0;da1sil$gL%mp0;ay;luyong,);$gDol6;on;a1e(spi,i0ucena;ber%d,pa;pu &pu,s p4;l0mus;igCoiH;os;smar0v5;$B;a0ebu,o%bato;b1(y# de oro,$5l0;amba,ooc6;#atu5uy0;ao;a4$#2u0;d0tu2;%;!gon0;#;co1guio,t#g0;as;*d,or;geles,tipo0;*","Philippine"],"Nicosia":["true¦cy5e0;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;!p0;!rus","Eastern European","eu3"],"Novokuznetsk":["true¦k3north asia,prokopyevsk,ru0;!ssia0;!n0;! federation;emerovo,rat","Krasnoyarsk"],"Novosibirsk":["true¦no3ru0siber6;!ssia0;!n0;! federation;rth central as2v0;osibirsk0t;! standard;ia","Novosibirsk"],"Omsk":["true¦oms3ru0;!ssia0;!n0;! federation;k0t;! standard","Omsk"],"Oral":["true¦!1:#:azakhstan;alm4k2west 0;asia,k#0;! standard;#0z;! western;a ata,t","West Kazakhstan"],"Pontianak":["true¦b5i3tanjung pinang,w0;est0ib; b3ern indonesia0;! standard;d,ndonesia0;! western,n;orneo","Western Indonesia"],"Pyongyang":["true¦chongjin,dpDh8k4n2pDs0won9;ariw0eoul,inuiBunch0;on;ampo,orth korea0;!n;a2orea0p,st;! north,n0;! standard;eso3nggye;a1ungnam,ye0;san;e1mhu0;ng;ju;rk","Korean"],"Qatar":["true¦a2doha,kuwait,qa0riyadh;!t0;!ar;r0st; rayyan,ab0;!i0;a0c;!n0;! standard","Arabian"],"Qostanay":["true¦!1:#$:stan,azakh;a3central asia,east k$#2k0;$#0o#ay,z;! eastern;! #dard;lmt,#a","East Kazakhstan"],"Qyzylorda":["true¦!1:#:azakhstan;alm6k2west 0;asia,k#0;! standard;#2yzyl1z0;!yl 0;orda;! western;a ata,t","West Kazakhstan"],"Riyadh":["true¦aFburMdammam,haEibb,jeddNkCm9najran,s5ta3y0;anbu,e0;!m0;!en;buk,i0;f,z;a0ultanHyot;!naa,udi0;! arabia0;!n;a1e0ukalla;cca,dina;dinBkkB;hamis mush0uw0;ait;far al batin,il;bha,l 4rab0st;!i0;a0c;!n0;! standard;ahmadi,hu0jubayl,kharj,mubarraz;d0fuf;ayd0;ah","Arabian"],"Sakhalin":["true¦ru3sak0yuzhno sakhalinsk;halin0t;! 0;island,standard;!ssia0;!n0;! federation","Sakhalin"],"Samarkand":["true¦bukhara,nukus,qarshi,uz0;!bekistan0t;! 0;standard,west","Uzbekistan"],"Seoul":["true¦:!1:#$%:gn,erok,oe;a$Udradnats nTeahmik,#Qhtuos TiGkor,n6opkom,r5tsk,u0;g9j0s%y;ej,#a2n0;iHo0;ej,w;wg,y;k,ok;a6o0;e1w0;#aBus;hcn1j0;ead;i,u0;hc,s;$1n5s0;am,ki,lu,nAub;! hG;m8s 0;#5ir7man#oAn3u0;b#%jiu,j#0;%0;hc;asna,%hc0;i,ub;ay0%sawh;na,og;ug;ahop,o0uen#ag;j0ym#awk;es;a$;! 0;fo cilbuper,h0;tuos","Korean"],"Shanghai":["true¦:!1:#$%&()*+-./<=>?@[]^_`~:gn,na,uh,au,ij,oa,hc,eh,ad,ug,ne,il,iq,hz,ay,ix,at,uy,ah,uw,ul,iy;0:3Y;1:42;2:53;3:4Y;4:4V;a55baq$lu,crp,dr-$ts a54e4T#2Mi1Sn0Bo02r00sodro,tYu5;b#eb,d#Wfn],gVhU=g05o9p6q a%$ux ihs uoka4Os$g,wi0Oy5;g04n1;#5n1;a5=;%,y;d3Xguot1N>9k6t5;$0o4;a4H+)l,#6i^,$.,u5;d-,o3;~,oh;-,eJ#GiDn8o6u5;f,hH<,l,q,s,w,x;a5b;*,(;a8e6i5;b,j,q,x;h5w;c,z;g,l,uq,w;a6em,*,u5;g,h,s;l,t;a5e3(,oy;c,h5.,y;!c,z;!d,h;sg4L_;#[,$h;e*,ip;c5kh,ohhOsc;!irtsid %o`;a5un $y4;h=Dli^;a7b6u5;hs03lg7tup,z)2;#in,iz;d7>ir,i6rg5t04;$0;lg47q`;#5`%;a%n5=;=;aPc,eJ*,iColdnBu5;c8h5;c6s5;$,uf;g41~;+i[,#5;[g1Fod;oh;b9j$8l6mn1xuf,y5;a%,g0Ii4;i5];j,.;it,p;i5r^;al,y;fn<,>7m5;a1#5%;a2(;ed#2n5;&g#e* 5e0;a@n<,#?J;?,dnZgXhNiGnEo4tgDu6y5;#ol,i0;gA*9l,q8y5;#6ia5)<;k,t;&g,i2G;#?;is,n~,_;g1F)0;$1;ab,i5%;a%,ew,j;aAd8eb,j7l-,qus,t6ur,x5;!n8;up;!uf;amu3#af5;aw;t,%;s5_;?#&0eC#9i8n6o5uo3;ab,f;a5ew,(,uk;!am,<,p;ab,em,uzi0;[,i6o5;>,t;dg1Qq;h,l;n5)1;&g,(;^;aPb+,c],dn1eMgre $l%,hKjIlHqGsuma2%Bx7yn6zg5;/m;i0Tuz;g7i6/b,u5;p,w;c,j;$2;n1s5ux;#+,i7$5;i5pu<;j,t;s,y;i0muru;#e0.;n5o4;?;s5zg28;a0g1J$%cg25;b6f+,w5;#o3_;a3ia%;h7t5;#1n5u2;?,@;#7ie6nYu5;>,w;b,w;=,o5;d5=;!-;a05eViCo5;dAgiz,h6@%c,s_,t5;-,nQ)3;cnPz5;ab,g6n5_;^,(;/*;#&g,nJup;dMjJlHmEnBp8q7x6y5;gOu1;a2~,)0;-,gD$,)3;is,$6o5;ag;];g1Fi6$5up;@,n,w;j,us,x;g6n5)m;as,uk;no*;eit,#2$#@5;-;i6n5uq;an;eb;a2o4;fiDh5;c6sg5;nod; u3i8n5)<,uoz;a5(,];u5y;l,x;a5ef;b,h;ak,*;ci[,f07g02hXiLk$,uGy5;eE#DiCn9o6u5;f,p;a5`;h5<,z;c,s;a5e0@;!i5n;m,x;al,.,y,z;a1+,=;d,(,];g#Mh5;g7z5;a(i0)z;hs;/f;jAl8x5;#6n1;@;ef,ip;-,g5`;nip;#9i8n5)2u2;a5e3(;dum,>,i5;l,q;en,l;?,os;c6n5;im;~,n6u5;w,x;an,ew;a8+,g7i6n]$5;<;.;$P;(gB;#5iew;al;[;d#EhB(ib,s9ux8y6z5;+;-,g5;$3;_;eAi4;ab;#&3nFo5;`;>;aEeE;niD;dDhsgB@/mnAniCs^l,%5ynA;g8i6n2;(;a5>$p,us;%;not;as;$5;*;$","China"],"Singapore":["true¦bukit rahman put7i6k5mukim pulai,p3s0woodlands;elayang baru uta6g1ingapore0;! standard,an;!p,t;asir guda0elento0;ng;ota kuala muda,uala lumpur;ndonesia central,skandar puteri;ra","Singapore"],"Srednekolymsk":["true¦chokurdakh,ru2sre0;dnekolymsk0t;! standard;!ssia0;!n0;! federation","Srednekolymsk"],"Taipei":["true¦banqiao,cst,h9k7new taipei,roc,t0;a1w0;!n;i0oyu3;ch4n2pei1wan0;!ese;! standard;an;aohsi0eel0;ung;sinchu,ualien","Taipei"],"Tashkent":["true¦andij5namangan,qo4uz0;!b0t;!ekistan0;! 0;east,standard; q0q0;on","Uzbekistan"],"Tbilisi":["true¦ge0kutaisi;!o0t;!rgia0;! standard,n","Georgia"],"Tehran":["true¦:!1:#$%&(:ba,ri,na,ra,hs;dRhNirPjaLkaJlGmoq,n7r5sab# &dnIt3yw00z0;a1ir0;#t,hK;$(,vha;dRh0sR;gilyad Psar;avezbJeyalRha(0i,u#(yen; inyemTdaza,mS;a1i0$;ma&v,vzB;d3grog,haf2iKj1kub,mG$0;! fo cilbuper cimal1;n2$s;si;a1eh0;az;#,mah;i#d&,o0;b0ma;ab;hcr0&;aq;d%n3r0;ak;a(%m2c%rb dagarsap,e0;v0yimuro;as;rek;a4%j$b,r0zay;ad%ts 1ejur0unj0;ob;%0;$;#1h(0;am;faj2m0&z2;arr0;ohk;an","Iran"],"Thimphu":["true¦b0;hutan1t0;!n;! standard","Bhutan"],"Tokyo":["true¦:!1:#$%&()*+-./<:ih,ka,am,an,us,ak,ot,ok,im,ag,uk,uf;a08dradnats 06eZiEnCo5pj,t4u0;fo2hsuy$tik,$jner-),st0z%un;%a0eoj,o;$t,mah;hc,k;dj,sj;ay,besas,du5hcnoh,jna,m#soega,n4r3t0;&D-,o0;k,m0yk;%Su2;#sRoppas;.&,oy;st%;a0pj;knir-&6pT;aJg(ta,hCjAk2m0romoa;a0uzi;nig(,ti;a0esonom0W#sarJ(t0O;rabi,s2wi,za0;ko,y0;-;a0or#;g0$t,w);a0#c;ma,n;em#,oCu0;!f;c4s0; 2a0;b0h0N$;ati,e%;ar&,i/<,oyk* 05<ig;a0i)0E+,u3;da,mnoh ohcaw.+Vt#;dnDg6$s,mo$m*;b4hon2mur1o0r1se6tad+3w.ode;gawS;/;#c0;ah;)0+;(N;nap0;aj;b0Ed0Bh&,kUmGrCt7w4y0;.1-on0og&;#D(tu;at0#sL;es;a0#sF;gayen,k#asa,sij<,z0;&Dor+*;a2i1o0;!y*;$,o,(;g0kP;%ay,iH;a0/D;hi0wado;a,h0m.B;ci;a4#s0;o1/0;*,<;g0rH;);h5ti4y0;)2ir1*,u0;kIstO;+;aw,o;as; ay-on0oA;#s0;in;aCo8u0;s3z0;ar0(;)0;at;o2t0;ar0;#;koy;.6irom,s,u0;k1z0;#s;<;n0so;oy0;*;&;aw#s1#c0;%;ik;i0/(t;hc","Japan"],"Tomsk":["true¦omst,ru0tomsk;!ssia0;!n0;! federation","Tomsk"],"Ulaanbaatar":["true¦m2ula0;anbaatar0n bator,t;! standard;n1ongolia0;!n;!g","Ulaanbaatar"],"Ust-Nera":["true¦ru2vla0;divostok0t;! standard;!ssia0;!n0;! federation","Vladivostok"],"Vladivostok":["true¦!2;k5msk+\\e,ru2vla0;divostok0t;! standard;!ssia0;!n0;! federation;habarovsk0omsomolsk on amur;! vtoroy","Vladivostok"],"Yakutsk":["true¦blagoveshchensk,ru2yak0;t,utsk0;! standard;!ssia0;!n0;! federation","Yakutsk"],"Yangon":["true¦b4hlaingthaya,kyain seikgyi township,m0nay pyi taw,pathein,sittwe;a2eiktila,m1onywa,yanmar0;! standard;!r,t;ndalay,wlamyine;ago,urm0;a,ese","Myanmar"],"Yekaterinburg":["true¦chelyabinAekateri9k8magnitogorAnizhn7or6perm,ru3s2tyumen,ufa,yek0zlatoust;aterinburg0t;! standard;terlitamak,urgut;!ssia0;!n0;! federation;e2sk;evartov2y tagil;amensk uralskiy,urgan;nburg;sk","Yekaterinburg"],"Yerevan":["true¦a0caucasus;m2rm0;!enia0;! standard,n;!t","Armenia"]},"Atlantic":{"Azores":["true¦azo2hmt,p0;ortug0t;al,uese;res0st,t;! s0;tandard,ummer","Azores","eu0"],"Bermuda":["true¦:ad2citnalta1dradnats3mb,t0umb;a,da,hgilyad2sa;! su;anac0umreb; citnalta","Atlantic","usa"],"Canary":["true¦canary islands,es,las palmas de gran canaria,s4we0;st0t;!ern european0;! s0;tandard,ummer;anta cruz de tenerife,pa0;in,nish","Western European","eu1"],"Cape_Verde":["true¦c0;a1pv,v0;!t;bo verde1pe verde0;! standard;! is","Cape Verde"],"Faroe":["true¦f4we0;st0t;!ern european0;! s0;tandard,ummer;aroe islands,o,ro","Western European","eu1"],"Madeira":["true¦madeira islands,p4we0;st0t;!ern european0;! s0;tandard,ummer;ortug0t;al,uese","Western European","eu1"],"Reykjavik":["true¦g3i0utc,zulu;celand1s0;!l;!ic;mt,reenwich0;! 0;mean,standard","Greenwich"],"South_Georgia":["true¦gs3s0;gs,outh 0;georgia0sandwich islands;! standard;!t","South Georgia"],"Stanley":["true¦f0;alkland1k0lk;!st,t;! island0;!s0;! standard","Falkland Islands"]},"Australia":{"Adelaide":["true¦!1:#$:tral,cen;a3$0south 2; 1# aus#ia0;! standard;aus#ia;c6u0;!s0; 3#ia0;! 2n0;! $#0;! daylight;$#;dt,st,t","Central Australia","aus"],"Brisbane":["true¦a1brisbane0gold coa6logan,queensland,townsville;! standard;e4u0;!stralia0;!n0;! east0;!ern;st","Brisbane"],"Broken_Hill":["true¦!1:#$:tral,cen;a2$0yancowinna; aus#ia,# aus#ia0;! standard;c6u0;!s0; 3#ia0;! 2n0;! $#0;! daylight;$#;dt,st","Central Australia","aus"],"Darwin":["true¦a0northern territory;cst,u0;!s0; central,tralia0;!n0;! central0;! standard","Australian Central"],"Eucla":["true¦!1:#: central w;a0cw7;cw7u0;!s0;#3tralia0;!n0;!#estern0;! standard;!e0;st;dt,st,t","Australian Central Western"],"Hobart":["true¦!1:#$:east,tralia;a1canberra,#ern aus$0king island,tasmania;! standard;e7u0;!s0; #3$0;! #e3n0;! #ern0;! daylight;!e0;rn;dt,st,t","Eastern Australia","aus"],"Lindeman":["true¦a1brisbane0whitsunday islands;! standard;est,u0;!stralia0;!n0;! eastern","Brisbane"],"Lord_Howe":["true¦au4l0;h2ord howe0;! 0;daylight,island,standard;dt,st,t;!stralia0;!n","Lord Howe","lhow"],"Melbourne":["true¦!1:#$:east,tralia;a1canberra,#ern aus$0geelong;! standard;e7u0;!s0; #3$0;! #e3n0;! #ern0;! daylight;!e0;rn;dt,st,t","Eastern Australia","aus"],"Perth":["true¦!1:#$:tralia,st;a4w0; 2e$0; 1ern aus#0;! $andard;aus#;u1w0;dt,$,t;!s0; 3#0;! 2n0;! we$0;!e1;we$e0;rn","Western Australia"],"Sydney":["true¦!1:#$:east,tralia;a2#ern aus$1new0wollongong; south wales,castle;! standard;e7u0;!s0;! #3$0;! #e3n0;! #ern0;! daylight;!e0;rn;dt,st,t","Eastern Australia","aus"]},"Etc":{"GMT":["true¦etc,g0;mt,reenwich0;! 0;mean,standard","Greenwich"],"UTC":["true¦:ct1lasrevinu0tcu,uluz;! detanidrooc;e,u","UTC"]},"Europe":{"Berlin":["true¦bremDce8d4e3frankfurt am main,g1ha0koln,leipzig,munich,nurembe7stuttgart;m5nnovB;erman0othen4;!y;ss9urope central;e,ortmund,resd8u0;is0sseldorf;bu0;rg;ntral europe0st,t;!an0;! s0;tandard,umm0;er;en","Central European","eu2"],"Simferopol":["true¦aqmescit,bakhchysarai,m2sevastopol,u0yalta;a,krain0;e,ian;oscow1s0;d,k,t;! standard","Moscow"],"Amsterdam":["true¦a9ce5dutch,e3groning4n1rotterdam,t0utrecht;he hague,ilburg;etherlands,l0;!d;indhov0urope central;en;ntral europe0st,t;!an0;! s0;tandard,ummer;lmere stad,mt","Central European","eu2"],"Andorra":["true¦a4ce0europe central;ntral europe0st,t;!an0;! s0;tandard,ummer;d,nd0;!orra","Central European","eu2"],"Astrakhan":["true¦astrakhan,m3ru0st petersburg;!ssia0;!n0;! federation;oscow,sk","Astrakhan"],"Athens":["true¦e2gr0thessaloniki;!c,ee0;ce,k;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Belgrade":["true¦ce3europe central,n2pristina,rs,s0;erbia0i,lovenia,vn;!n;is,ovi sad;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Brussels":["true¦antwerp9b5c0europe central,gent,liege;e0harleroi;ntral europe0st,t;!an0;! s0;tandard,ummer;e0mt;!l0;!gi0;an,um;!en","Central European","eu2"],"Bucharest":["true¦bra9c8e3gala2iasi,oradea,ploies2ro0timisoara;!mania0u;!n;ti;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;luj napoca,onstanta,raiova;ila,sov","Eastern European","eu3"],"Budapest":["true¦buda,ce3debrecen,europe central,hu0pest;!n0;!gar0;ian,y;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Busingen":["true¦bavaria,ce2de1europe central,german0saxony;!y;!u;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Chisinau":["true¦e3m0republic of mo1;d1o0;ldova;!a;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu2"],"Copenhagen":["true¦arhus,c1d0europe central;anish,enmark,k,nk;e0mt;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Dublin":["true¦ace,cork,dmt,e6g5i1l0tse,waterfo4;imerick,ondon;e,r0st;eland,ish0l;! standa0;rd;alway,mt,reenwich mean;dinburgh,ire","Irish","eu1"],"Gibraltar":["true¦b6ce2europe central,gi0;!b0;!raltar;ntral europe0st,t;!an0;! s0;tandard,ummer;dst,st","Central European","eu2"],"Helsinki":["true¦e3fi1t0vantaa;ampere,urku;!n0;!land,nish;astern europe1e0spoo,urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Istanbul":["true¦:!1:#$%&:na,ra,ru,ne;aZd$d#ts yekYeUgizale,hsikYiNkerevSmurMnIpet#izag,r6s4t2u1ye0;kXoktuvan$;lroc,n%bnityez;im5&kitIr0;t,uy&9;a0us$t;$m#marhJvM;a7e4i0t,ut,ık2;hes2k1m0sekilD;zi;ab$yid;ata,ik2kasA;fulin,l0;&0veilech8;se;d2l0;gabar9i0ı0;cg4;eukseu,uksu;a0isAozbart,usmO;m0v;ayiLt0;ab;oc,uzre;d&fezek5l2r0zag3;azapaHesy0;ak;s1yeb0zi&d;#tlus;is;rem;cemkeckuc7lakkirik,pet2yi0zbeg;k2#0;mso,rmu;kacn9l6;%t;f%iln7#6$k5s3y0;ak#c,hat1k0l0nok,tal3;at3;uk;apta%m,in0%b;am;#;da;as","Turkey"],"Kaliningrad":["true¦baltiy8chernyakhov8e3ru0sovet8;!ssia0;!n0;! federation;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;sk","Eastern European"],"Kyiv":["true¦!1:#$%&:er,an,iv,urope;bila ts#kOch#LdJeEhorlD%$o fr$k%Kk9l8m6odes5poltaOr%ne,sumy,t#nopil,u2vinnyts1z0;aporizhzh0hytomyr;ya;a,kr0;!ain0;e,i$;a,sa;a0ykolayG;ki5riupol;utBvE;amy$ske,h1iev,r0;emenchuk,opyv1yvyy rih;arkB#son,mel0;nytskyy;%ka;ast#n e&1e0& east#n;st,t;!$0;! s0;t$dard,umm#;nipro,onet0;sk;kasy,ni0;h0vtsi;%;va","Eastern European","eu3"],"Kirov":["true¦m3ru0;!ssia0;!n0;! federation;oscow1s0;d,k,t;! standard","Moscow"],"Lisbon":["true¦!1:#:europe;amadora,# western,p4we0;st0t;! #,ern #an0;! s0;tandard,ummer;ort0rt,t;o,ug0;al0uese;! mainland","Western European","eu1"],"London":["true¦!1:#$%&()*+:ing,er,on ,st,an,re,en,ha;0:0P;a0Ob06c04d01eZgWhUiQj$sey,k#&%up%hull,lMmKnDoxVpB)ad#,s3tri&( da cun+,u2w1yH;arwick06igRolv$+9)x0K;k,nited k#dom;aint hel*a,heffield,o4t3u2w1;(5ind0;ffolk,nd$l(d,r)y,sVtt0;afPoke %t)nt;meVuth1;a2*d %1;sea;mpt0;ly1orts1)&0;mouth;ew5o1;r1tt#+mP;th1wE; y1amptonN;orkQ;ca&le1port;! up%tyne;(che&Ui1;dl(4lt%keynes;(caLdn,e2i1ut0;ncolnKv$V;e1ice&$F;ds;psw3sl1;e of m1#t0;(;ich;ampD$t1;fordC;b2l1mt,)at britaJu$nsR;asgow,ouce&$A;! eA;dinburgh,s1;sex;$by2o1udlM;rset;!sh5;a1ov*try,rawlJ;mbridge2rdiff;eGirElackCr3&,uck#+m1;sh1;i);adfo8e7i1;&9t1;a4ish1;! s1;t(da4umm1;$;in;nt;rd;po1;ol;k*head,m#1;+m;lfa&,xl1;ey;b$de*,rchway,sc*si0;on","British","eu1"],"Luxembourg":["true¦ce2europe central,lu0;!x0;!embourg;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Madrid":["true¦:!1:#$%&(): ed ,na,al,tn,la,ra;aJciuj&om sHdCeBhsinGit)m Hl9n6o4pse,re3s1t0;ec,mew,sE;acel(v#e&eup,e0ogrub;!lotsom,$gel,)neh#%acO;d$Dmmu9;ablib,d0giv;eivo,)p le (r)cP;a1iaps0ojig;! aicneL;ep5itsabes n9;a0ehc$barDledab8;enil daduic,r&ec eporue;c$mor,hcle,lpmaxie,p2t$ciFuqsA;ilod%G$lniam ni3)d$t0;s $ep0;orue (r&0;ec;aps;&0;as;daAg%am,i5llives,ml4n0re&orf %#zerej,ssarret,zoga)z;%p %#ollets2it%,ol0uroc a;ad0ecr0pm2;ab;ac;ap;c2r0;em0otiv/zietsag;(;ne0rum;(v;$rg,rb%0;neuf","Central European","eu2"],"Malta":["true¦ce2europe central,m0;alt0lt,t;a,ese;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Minsk":["true¦b4h3m0viteb6;ahilyow,oscow1s0;d,k,t;! standard;omyel,rodna;abruy1elarus0lr,rest,y;!ian;sk","Moscow"],"Monaco":["true¦ce2europe central,m0;c0onaco;!o;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Moscow":["true¦:!1:#$%&()*+:or,so,ra,ak,on,hz,hc,hk;a08d03g00)en#ov,iZkPlMnHoEr9s7t5u4vo3w04y0z&v&B;i1ksieg%vgCnle* eyyn)erebX%skob7t+ahs,yn0;rRz#g;ksnini0Anlartnec;bmYksp,rt$ yksvelysav;nod anEr,s w;ef,s0;dm,m;tevoper0ur;e*;a2evt,i0;m0vamM;idalv;d0kvytkys;(sark;ni1v0;enes7(avi;belu) (i+yv,rU;a2o0;d no0itaredef naiT; vots#;iRza0;k,yr;ero,o1vals#0;ay;k$ yy%Cp#vaC;i*l8s0;dovaz#tIl5m4n0ruk,tepil,yiss#ov(;a2eloms,i0;byr,)rezd,vd#0;eves;mrum,%s,yrb;!&enB;egna+0odop;%;an;*os,kmi+;#nag1rubsretep 0;ts;at;arg(elez,#og1%dnats w0sm;oc$m;leb,v( yi0;kilev,n0;)in;dgol5gu4i3l1m#t$k,zn0;ep;&*a+0o %kh$y,ut;am;ssur;l&;ov","Moscow"],"Oslo":["true¦bergen,ce3europe central,no1sj0;!m;!rw0;ay,egian;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Paris":["true¦bordeaux,ceDeurope central,frAl8m7n5r3s0toulouE;aint 1t0; 0rasbourg;etienne;e0oman8;ims,nn1;ant0i6ormandy;es;arsei1et,ontpelliA;e havre,i0yon;lle;!a0ench;!n0;ce;ntral europe1rgy pontoi0st,t;se;!an0;! s0;tandard,umm0;er","Central European","eu2"],"Prague":["true¦brno,c1europe central,ostrava,pmt,s0;k,lovakia,vk;e2z0;!ech0;! republic,ia;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Riga":["true¦e3kalt,l0;atvia1st,v0;!a;!n;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Rome":["true¦!1:#$%:europe,an,ntral;bJcE# ce%,floreDgenoa,itAm9naples,p6r5sicily,t3v0;a0eroK;!t0;!ic9;ar$3rieste,u0;rin,sc$y;mt,oma7;a1ra0;to;dova,lermo;essiBil2;!al0;i0y;$;nce;at$5e0orsica;% #0st,t;!$0;! s0;t$dard,ummer;ari,olog1resc0;ia;na","Central European","eu2"],"Samara":["true¦izhevsk,ru4s1to0;gliatti on the volga,lyatti;am0yzran;ara0t;! standard;!ssia0;!n0;! federation","Samara"],"Saratov":["true¦balakovo,izhevsk,ru2sam0;ara0t;! standard;!ssia0;!n0;! federation","Samara"],"Sofia":["true¦b5e0imt,plovdiv,varna;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;g2u0;lgaria0rgas;!n;!r","Eastern European","eu3"],"Stockholm":["true¦ce4europe central,goeteborg,malmoe,s0;e2we0;!d0;en,ish;!t;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Tallinn":["true¦e0narva,tartu,viljandi;astern europe2e1stonia0urope eastern;!n;!st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Tirane":["true¦al4ce0europe central,tirana;ntral europe0st,t;!an0;! s0;tandard,ummer;!b0;!ania0;!n","Central European","eu2"],"Ulyanovsk":["true¦m3ru0st petersburg,ulyanovsk;!ssia0;!n0;! federation;oscow,sk","Ulyanovsk"],"Uzhgorod":["true¦e2ruthenia,u0;a,krain0;e,ian;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Vienna":["true¦a4ce0donaustadt,europe central,favoriten,graz,linz;ntral europe0st,t;!an0;! s0;tandard,ummer;t,u0;stria0t;!n","Central European","eu2"],"Vilnius":["true¦e4k3l0;ithuania1t0;!u;!n;aunas,laipeda;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Volgograd":["true¦m4ru1st petersburg,vol0;t,zhskiy;!ssia0;!n0;! federation;oscow1s0;d,k,t;! standard","Moscow"],"Warsaw":["true¦bKcFeurope central,gBk9l6mokotAp3radMs2torun,wroc0zabrze,ło8;l0ł0;aw;osnowiec,zczec4;l,o0raga poludnie;l0znan;!and,ish;o1ubl0;in;dz;ato2iel3rak0;ow;d2li0;wi0;ce;ansk,ynia;e0zestochowa;ntral europe0st,t;!an0;! s0;tandard,ummer;i2y0;dgoszcz,t0;om;alystok,elsko biala","Central European","eu2"],"Zaporozhye":["true¦e3luhansk2u0zaporizhia lugansk;a,krain0;e,ian;! east;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Zurich":["true¦c3europe central,geneve,li1swi0;ss,tzerland;!e0;!chtenstein;e0h;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"]},"Indian":{"Chagos":["true¦british indian ocean territory,i0;ndian 1o0;!t;chagos,ocean0;! standard","Indian Ocean"],"Christmas":["true¦c0;hristmas island1x0;!r,t;! standard","Christmas Island"],"Cocos":["true¦c0;c3ocos 0;island0keeling islands;!s0;! standard;!k,t","Cocos Islands"],"Kerguelen":["true¦a8french 1kerguelenst paul9tf0;!t;southern0t2;! 0;an1t0;erritories;d antarctic1tarctic0;! standard;! lands;msterdam0tf; island","French Southern & Antarctic"],"Mahe":["true¦s0;c1eychelles0yc;! standard;!t","Seychelles"],"Maldives":["true¦m0;aldives1dv,v0;!t;! standard","Maldives"],"Mauritius":["true¦m0port louis;auritius1u0;!s,t;! standard","Mauritius"],"Reunion":["true¦re0;!t,union0;! standard","Réunion"]},"Pacific":{"Apia":["true¦!1:#:samoa;#5w0;est1s0;!m,t; #0ern #;! s0;tandard,ummer;! western","West Samoa"],"Auckland":["true¦christchurch,manukau,n0wellington;ew zealand1orth shore,z0;!dt,l,mt,st,t;! 0;daylight,standard","New Zealand","nz"],"Bougainville":["true¦bougainville,guinea2p0;apua new guinea,g0ng;!t;!n","Bougainville"],"Chatham":["true¦cha2n0;ew zealand,z0;! chat;dt,st,t0;!ham0;! 0;daylight,islands,standard","Chatham","chat"],"Chuuk":["true¦chu2f0m1;ederated states of m0m;icronesia;t,uk0;! standard,/trukyap","Chuuk"],"Easter":["true¦c5e0;as0mt;st,t0;!er island0;! s0;tandard,ummer;hile0l;!an","Easter Island","east"],"Efate":["true¦v0;anuatu1u0;!t;! standard","Vanuatu"],"Fakaofo":["true¦t0;k1okelau0;! standard;!l,t","Tokelau"],"Fiji":["true¦f0;iji1j0;!i,st,t;! standard,an","Fiji"],"Funafuti":["true¦t0;uv1v0;!t;!alu0;! standard","Tuvalu"],"Galapagos":["true¦co5ec3gal0;apagos0t;! 0;islands,standard;!uador0;!ian;lombia,st,t","Galapagos"],"Gambier":["true¦french polynesia,gam0pf;bier0t;! 0;islands,standard","Gambier"],"Guadalcanal":["true¦s0;b2lb,olomon0;! islands0;! standard;!t","Solomon Islands"],"Guam":["true¦ch4gu3m2northern mariana islands,port moresby,west0; 0ern 0;pacific;np,p;!am;amorro0st;! standard","Chamorro"],"Honolulu":["true¦!1:#$:leutian,merica;a7h3u0;nited states1s0;!a;! of a$;a0st;dt,st,t,waii0;! 0;a#,standard;#1$0;!n;! islands","Hawaii"],"Kanton":["true¦ki2pho0;enix islands0t;! standard;!ribati","Phoenix Islands"],"Kiritimati":["true¦ki2lin0;e islands0t;! standard;!r0;!i0;bati,timati island","Line Islands"],"Kosrae":["true¦f2kos0m3;rae0t;! standard;ederated states of m0m;icronesia","Kosrae"],"Kwajalein":["true¦m0;arshall islands1h0;!t;! standard","Marshall Islands"],"Majuro":["true¦m0;arshall islands1h0;!l,t;! standard","Marshall Islands"],"Marquesas":["true¦french polynesia,mar0pf;quesas0t;! 0;islands,standard","Marquesas"],"Nauru":["true¦n0;auru1r0;!t,u;! standard","Nauru"],"Niue":["true¦n0;iu1u0;!t;!e0;! standard","Niue"],"Norfolk":["true¦n0;f3orfolk0;! island0;! 0;daylight,standard;!dt,k,t","Norfolk Island","aus"],"Noumea":["true¦n0;c1ew caledonia0;! standard;!l,t","New Caledonia"],"Pago_Pago":["true¦a2midway,s0;amoa0st;! standard;merican samoa,s","Samoa"],"Palau":["true¦p0;alau1lw,w0;!t;! standard","Palau"],"Pitcairn":["true¦!2;p0utc-\\a\\i;cn,itcairn0n,st;! 0;islands,standard","Pitcairn"],"Pohnpei":["true¦f4m5p0;f,o0yf;hnpei/ponape,n0;ape0t;! standard;ederated states of m0m,rench poly1;icro0;nesia","Ponape"],"Port_Moresby":["true¦dumont durville,guinea3p0;apua new guinea1g0ng;!t;! standard;!n","Papua New Guinea"],"Rarotonga":["true¦c0;k3o0;k,ok0;! islands0;! standard;!t","Cook Islands"],"Tahiti":["true¦french polynesia,pf,society islands,tah0;iti0t;! standard","Tahiti"],"Tarawa":["true¦gil1ki0;!ribati;bert islands0t;! standard","Gilbert Islands"],"Tongatapu":["true¦nukualofa,to0;!n0t;!ga0;! standard","Tonga"],"Wake":["true¦u2wak0;e island0t;! standard;m3nited states m1s 0;m0o1;inor o0;utlying islands;!i","Wake Island"],"Wallis":["true¦w0;allis 1f0lf;!t;and futuna,futuna0;! standard","Wallis & Futuna"]}};

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

// Earlier replacements are preferred. Empty strings remove whole words.
const replacements = [
  ['&', 'and'],
  ['&', ''],
  ['and', ''],
  ['st.', 'saint'],
  ['st', 'saint'],
  ['saint', 'st'],
  ['saint', ''],
  ['st', ''],
  ['islands', ''],
  ['island', ''],
  ['isl', 'island'],
  // dst name cruft
  ['standard', ''],
  ['daylight', ''],
  // west/east/south/north
  ['west', 'western'],
  ['east', 'eastern'],
  ['south', 'southern'],
  ['north', 'northern'],
  ['western', 'west'],
  ['eastern', 'east'],
  ['southern', 'south'],
  ['northern', 'north'],
  // country-name cruft
  ['democratic', ''],
  ['socialist', ''],
  ['republic', ''],
  ['peoples', ''],
  ["people's", ''],
  ['federal', ''],
  ['federated', ''],
  ['islamic', ''],
  ['united', ''],
  ['kingdom', ''],
  ['of', ''],
  ['the', ''],
];

const maxCandidates = 96;
const clean = value => value.toLowerCase().split(' ').filter(Boolean).join(' ');
const ignored = new Set(replacements.filter(([, to]) => !to).map(([from]) => from));

const getAlternatives = (input, includeWords = true) => {
  const name = clean(input);
  const candidates = new Set();
  const add = value => {
    const candidate = clean(value);
    if (candidate && candidate !== name && !ignored.has(candidate)) {
      candidates.add(candidate);
    }
  };

  // Try each replacement alone and accumulate replacements in their listed order.
  let combined = name;
  replacements.forEach(([from, to]) => {
    add(name.replaceAll(from, ` ${to} `));
    combined = combined.replaceAll(from, ` ${to} `);
    add(combined);
  });
  if (includeWords) {
    const phrases = [name, ...candidates];
    phrases.forEach(phrase => phrase.split(' ').forEach(add));
  }
  // console.log(candidates)
  return [...candidates].slice(0, maxCandidates)
};

const matchPart = (input) => {
  const found = matchWhole(input);
  const ids = typeof found === 'string' ? [found] : found || [];
  return [...new Set(ids.map(canonicalize))]
};

const matchAlternativeSpellings = (input, includeWords = true) => {
  const candidates = getAlternatives(input, includeWords);
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

const longName = /^\s*\(utc(?:[+-]\d{2}:\d{2})?\)\s*([^()]+?)(?:\s*\([^()]*\))?\s*$/i;

const find = (input) => {
  // "(UTC-06:00) Central Time (US & Canada)" → "Central Time".
  input = input.replace(longName, '$1').trim();

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
var metas = {"British Columbia":{"name":"British Columbia Time","std":["MST",-7,"Mountain Standard Time"],"long":"(UTC-07:00) British Columbia"},"Alberta and Northwest Territories":{"name":"Alberta and Northwest Territories Time","std":["CST",-6,"Central Standard Time"],"long":"(UTC-06:00) Alberta and Northwest Territories"},"Manitoba":{"name":"Manitoba Time","std":["EST",-5,"Eastern Standard Time"],"long":"(UTC-05:00) Manitoba"},"Ulyanovsk":{"std":["+04",4,"Ulyanovsk Time"]},"Astrakhan":{"std":["+04",4,"Astrakhan Time"]},"Tomsk":{"std":["+07",7,"Tomsk Time"]},"Syria":{"std":["+03",3,"Syria Time"]},"Jordan":{"std":["+03",3,"Jordan Time"]},"Bougainville":{"std":["+11",11,"Bougainville Time"]},"Magallanes":{"std":["-03",-3,"Magallanes Time"],"long":"(UTC-03:00) Punta Arenas"},"Galapagos":{"std":["GALT",-6],"long":"(UTC-06:00) Galapagos Islands"},"Hawaii":{"name":"Hawaii Time","std":["HST",-10,"Hawaii Standard Time"],"long":"(UTC-10:00) Hawaii"},"UTC":{"name":"Coordinated Universal Time","std":["UTC",0,"Coordinated Universal Time"],"long":"(UTC+00:00) Coordinated Universal Time"},"Aysen":{"name":"Aysen Time","std":["-03",-3,"Aysen Time"],"long":"(UTC-03:00) Coyhaique"},"Palmer":{"std":["-03",-3,"Palmer Time"],"long":"(UTC-03:00) Palmer"},"Xinjiang":{"std":["+06",6,"Xinjiang Time"],"name":"Xinjiang Time","long":"(UTC+06:00) Xinjiang Time"},"India":{"std":["IST",5.5],"long":"(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi"},"China":{"std":["CST",8],"long":"(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi"},"Central European":{"std":["CET",1],"dst":["CEST",2,"Central European Summer Time"],"long":"(UTC+01:00) Brussels, Copenhagen, Madrid, Paris"},"Atlantic":{"std":["AST",-4],"dst":["ADT",-3],"long":"(UTC-04:00) Atlantic Time (Canada)"},"Greenwich":{"std":["GMT",0],"long":"(UTC) Coordinated Universal Time"},"Eastern European":{"std":["EET",2],"dst":["EEST",3,"Eastern European Summer Time"]},"Central":{"std":["CST",-6],"dst":["CDT",-5],"long":"(UTC-06:00) Central Time (US & Canada)"},"Eastern":{"std":["EST",-5],"dst":["EDT",-4],"long":"(UTC-05:00) Eastern Time (US & Canada)"},"Argentina":{"std":["ART",-3],"long":"(UTC-03:00) City of Buenos Aires"},"East Africa":{"std":["EAT",3],"long":"(UTC+03:00) Nairobi"},"West Africa":{"std":["WAT",1],"long":"(UTC+01:00) West Central Africa"},"Moscow":{"std":["MSK",3],"long":"(UTC+03:00) Moscow, St. Petersburg"},"Brasilia":{"std":["BRT",-3],"long":"(UTC-03:00) Brasilia"},"Mountain":{"std":["MST",-7],"dst":["MDT",-6],"long":"(UTC-07:00) Mountain Time (US & Canada)"},"Central Africa":{"std":["CAT",2],"long":"(UTC+02:00) Windhoek"},"Arabian":{"std":["AST",3],"long":"(UTC+03:00) Kuwait, Riyadh"},"Alaska":{"std":["AKST",-9],"dst":["AKDT",-8],"long":"(UTC-09:00) Alaska"},"British":{"std":["GMT",0],"dst":["BST",1,"British Summer Time"],"long":"(UTC+00:00) Dublin, Edinburgh, Lisbon, London"},"Irish":{"std":["GMT",0,"Greenwich Mean Time"],"dst":["IST",1,"Irish Standard Time"]},"West Kazakhstan":{"std":["ALMT",5],"long":"(UTC+05:00) Ashgabat, Tashkent"},"Eastern Australia":{"std":["AEST",10],"dst":["AEDT",11,"Australian Eastern Daylight Time"],"long":"(UTC+10:00) Canberra, Melbourne, Sydney"},"Western European":{"std":["WET",0],"dst":["WEST",1,"Western European Summer Time"]},"Indochina":{"std":["ICT",7],"long":"(UTC+07:00) Bangkok, Hanoi, Jakarta"},"Central Mexico":{"long":"(UTC-06:00) Guadalajara, Mexico City, Monterrey","std":["CST",-6],"dst":["CDT",-5,"Central Daylight Time"]},"South Africa":{"std":["SAST",2],"long":"(UTC+02:00) Harare, Pretoria"},"Krasnoyarsk":{"std":["KRAT",7],"long":"(UTC+07:00) Krasnoyarsk"},"Yakutsk":{"std":["YAKT",9],"long":"(UTC+09:00) Yakutsk"},"Pacific":{"std":["PST",-8],"dst":["PDT",-7],"long":"(UTC-08:00) Pacific Time (US & Canada)"},"Amazon":{"std":["AMT",-4],"long":"(UTC-04:00) Cuiaba"},"Morocco":{"long":"(UTC+00:00) Casablanca","std":["+00",0]},"Gulf":{"std":["GST",4],"long":"(UTC+04:00) Abu Dhabi, Muscat"},"Samara":{"std":["SAMT",4],"long":"(UTC+04:00) Izhevsk, Samara"},"Uzbekistan":{"std":["UZT",5]},"East Kazakhstan":{"std":["ALMT",5],"long":"(UTC+05:00) Astana"},"Omsk":{"std":["OMST",6],"long":"(UTC+06:00) Omsk"},"Western Indonesia":{"std":["WIB",7]},"Ulaanbaatar":{"std":["ULAT",8],"long":"(UTC+08:00) Ulaanbaatar"},"Malaysia":{"std":["MYT",8]},"Korean":{"std":["KST",9],"long":"(UTC+09:00) Seoul"},"Central Australia":{"std":["ACST",9.5],"dst":["ACDT",10.5,"Australian Central Daylight Time"],"long":"(UTC+09:30) Adelaide"},"Brisbane":{"std":["AEST",10]},"Vladivostok":{"std":["VLAT",10],"long":"(UTC+10:00) Vladivostok"},"Chamorro":{"std":["ChST",10],"long":"(UTC+10:00) Guam, Port Moresby"},"Papua New Guinea":{"std":["PGT",10]},"New Zealand":{"std":["NZST",12],"dst":["NZDT",13],"long":"(UTC+12:00) Auckland, Wellington"},"Marshall Islands":{"std":["MHT",12]},"Samoa":{"std":["SST",-11],"long":"(UTC+13:00) Samoa"},"Mexican Pacific":{"std":["HNPMX",-7],"dst":["HEPMX",-6],"long":"(UTC-07:00) Chihuahua, La Paz, Mazatlan"},"Colombia":{"std":["COT",-5]},"Acre":{"std":["ACT",-5]},"Chile":{"std":["CLT",-4],"dst":["CLST",-3,"Chile Summer Time"]},"Troll":{"std":["GMT",0],"dst":["+02",2,"Troll Summer Time"]},"East Greenland":{"std":["EGT",-2],"dst":["EGST",-1,"East Greenland Summer Time"]},"Israel":{"std":["IST",2],"dst":["IDT",3],"long":"(UTC+02:00) Jerusalem"},"Turkey":{"std":["TRT",3],"long":"(UTC+03:00) Istanbul"},"Iran":{"std":["IRST",3.5],"dst":["IRDT",4.5],"long":"(UTC+03:30) Tehran"},"Azerbaijan":{"std":["AZT",4],"long":"(UTC+04:00) Baku"},"Georgia":{"std":["GET",4],"long":"(UTC+04:00) Tbilisi"},"Armenia":{"std":["AMT",4],"long":"(UTC+04:00) Yerevan"},"Seychelles":{"std":["SCT",4]},"Mauritius":{"std":["MUT",4],"long":"(UTC+04:00) Port Louis"},"Réunion":{"std":["RET",4]},"Afghanistan":{"std":["AFT",4.5],"long":"(UTC+04:30) Kabul"},"Mawson":{"std":["MAWT",5]},"Turkmenistan":{"std":["TMT",5]},"Tajikistan":{"std":["TJT",5]},"Pakistan":{"std":["PKT",5],"long":"(UTC+05:00) Islamabad, Karachi"},"Yekaterinburg":{"std":["YEKT",5],"long":"(UTC+05:00) Ekaterinburg"},"French Southern & Antarctic":{"std":["TFT",5]},"Maldives":{"std":["MVT",5]},"Nepal":{"std":["NPT",5.75],"long":"(UTC+05:45) Kathmandu"},"Vostok":{"std":["+05",5]},"Kyrgyzstan":{"std":["KGT",6]},"Bangladesh":{"std":["BST",6],"long":"(UTC+06:00) Dhaka"},"Bhutan":{"std":["BT",6]},"Indian Ocean":{"std":["IOT",6]},"Myanmar":{"std":["MMT",6.5],"long":"(UTC+06:30) Yangon (Rangoon)"},"Cocos Islands":{"std":["CCT",6.5]},"Davis":{"std":["DAVT",7]},"Hovd":{"std":["HOVT",7],"long":"(UTC+07:00) Hovd"},"Novosibirsk":{"std":["NOVT",7],"long":"(UTC+07:00) Novosibirsk"},"Christmas Island":{"std":["CXT",7]},"Brunei Darussalam":{"std":["BNT",8]},"Hong Kong":{"std":["HKT",8]},"Irkutsk":{"std":["IRKT",8],"long":"(UTC+08:00) Irkutsk"},"Central Indonesia":{"std":["WITA",8]},"Philippine":{"std":["PHST",8]},"Singapore":{"std":["SGT",8],"long":"(UTC+08:00) Kuala Lumpur, Singapore"},"Taipei":{"std":["CST",8],"long":"(UTC+08:00) Taipei"},"Western Australia":{"std":["AWST",8],"long":"(UTC+08:00) Perth"},"Australian Central Western":{"std":["ACWST",8.75],"long":"(UTC+08:45) Eucla"},"East Timor":{"std":["TLT",9]},"Eastern Indonesia":{"std":["WIT",9]},"Japan":{"std":["JST",9],"long":"(UTC+09:00) Osaka, Sapporo, Tokyo"},"Palau":{"std":["PWT",9]},"Australian Central":{"std":["ACST",9.5]},"Chuuk":{"std":["CHUT",10]},"Lord Howe":{"std":["LHST",10.5],"dst":["LHDT",11],"long":"(UTC+10:30) Lord Howe Island"},"Casey":{"std":["CAST",8]},"Magadan":{"std":["MAGT",11],"long":"(UTC+11:00) Magadan"},"Sakhalin":{"std":["SAKT",11],"long":"(UTC+11:00) Sakhalin"},"Srednekolymsk":{"std":["SRET",11],"long":"(UTC+11:00) Chokurdakh"},"Vanuatu":{"std":["VUT",11]},"Solomon Islands":{"std":["SBT",11]},"Kosrae":{"std":["KOST",11]},"New Caledonia":{"std":["NCT",11]},"Ponape":{"std":["PONT",11]},"Anadyr":{"std":["ANAT",12],"long":"(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky"},"Petropavlovsk-Kamchatski":{"std":["PETT",12],"long":"(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky"},"Fiji":{"std":["FJT",12],"long":"(UTC+12:00) Fiji"},"Tuvalu":{"std":["TVT",12]},"Nauru":{"std":["NRT",12]},"Norfolk Island":{"std":["NFT",11],"dst":["NFDT",12],"long":"(UTC+11:00) Norfolk Island"},"Gilbert Islands":{"std":["GILT",12]},"Wake Island":{"std":["WAKT",12]},"Wallis & Futuna":{"std":["WFT",12]},"Chatham":{"std":["CHAST",12.75],"dst":["CHADT",13.75],"long":"(UTC+12:45) Chatham Islands"},"West Samoa":{"std":["WST",13],"dst":["WST",14,"West Samoa Summer Time"]},"Phoenix Islands":{"std":["PHOT",13]},"Tokelau":{"std":["TKT",13]},"Tonga":{"std":["TOT",13],"long":"(UTC+13:00) Nuku'alofa"},"Line Islands":{"std":["LINT",14],"long":"(UTC+14:00) Kiritimati Island"},"Niue":{"std":["NUT",-11]},"Cook Islands":{"std":["CKT",-10]},"Tahiti":{"std":["TAHT",-10]},"Marquesas":{"std":["MART",-9.5],"long":"(UTC-09:30) Marquesas Islands"},"Aleutian":{"std":["HST",-10],"dst":["HDT",-9,"Hawaii Daylight Time"]},"Gambier":{"std":["GAMT",-9],"long":"(UTC-09:00) Coordinated Universal Time-09"},"Pitcairn":{"std":["PST",-8],"long":"(UTC-08:00) Coordinated Universal Time-08"},"Easter Island":{"std":["EAST",-6],"dst":["EASST",-5,"Easter Island Summer Time"],"long":"(UTC-06:00) Easter Island"},"Ecuador":{"std":["ECT",-5]},"Cuba":{"std":["HNCU",-5],"dst":["HECU",-4],"long":"(UTC-05:00) Havana"},"Peru":{"std":["PET",-5]},"Paraguay":{"std":["PYT",-3],"long":"(UTC-03:00) Asuncion"},"Venezuela":{"std":["VET",-4],"long":"(UTC-04:00) Caracas"},"Guyana":{"std":["GYT",-4]},"Bolivia":{"std":["BOT",-4]},"Newfoundland":{"std":["HNTN",-3.5],"dst":["HETN",-2.5],"long":"(UTC-03:30) Newfoundland"},"French Guiana":{"std":["GFT",-3]},"West Greenland":{"std":["WGT",-2],"dst":["WGST",-1,"West Greenland Summer Time"],"long":"(UTC-02:00) Greenland"},"St. Pierre & Miquelon":{"std":["HNPM",-3],"dst":["HEPM",-2],"long":"(UTC-03:00) Saint Pierre and Miquelon"},"Uruguay":{"std":["UYT",-3],"long":"(UTC-03:00) Montevideo"},"Suriname":{"std":["SRT",-3]},"Falkland Islands":{"std":["FKST",-3]},"Fernando de Noronha":{"std":["FNT",-2]},"South Georgia":{"std":["GST",-2]},"Azores":{"std":["AZOT",-1],"dst":["AZOST",0,"Azores Summer Time"],"long":"(UTC-01:00) Azores"},"Cape Verde":{"std":["CVT",-1],"long":"(UTC-01:00) Cabo Verde Is."}};

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
