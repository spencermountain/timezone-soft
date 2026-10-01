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
var pcked = {"Africa":{"Abidjan":["true¦abobo,bNcLdaloa,gCivory coast,k9m7pikiMs3t0utc,yamoussouk6zulu;a1g,hies,o0;go,uba;koradi,male;an ped2e1i0l,n;erra leoHkK;negal,rekunda;ro;a0l,r;li,uritanB;o0uma1;rhogo,umas0;si;amb7h5in,m4n,reenwich2u0;ediawaye,inea0;!n;! 0;mean,standard;!t;!a0;!na;ia;amayen0i,ote divoire;ne;f,o0urkina fa2;bo dioul0uake;as0;so","Greenwich"],"Algiers":["true¦a9b7c3dz2europe central,oran,s1t0;ebessa,iaret;etif,idi bel abbes;!a;e0hlef,onstantine;ntral europe0t;!an0;! standard;a0iskra,lida,oumerdas;b ezzouar,tna;lgeria0nnaba;!n","Central European Standard"],"Bissau":["true¦g0utc,zulu;mt,nb,reenwich0uinea bissau,w;! 0;mean,standard","Greenwich"],"Cairo":["true¦!2;!1:#$%&: al ,an,astern,urope;\\gth of octobRaHb$i suwayf,damEe5giza,ha4i3k2luxor,madinat $ nasr,new cairo,port said,qi6rosFs0t$Gzagazig;h0ohag,uez;ibin#kawm,ubra#khaymO;afr ad dawwar,om ombo;dku,smailI;daiq#qubbLlwE;% e&5e4g1s0& e%;na;!y0;!pt0;!i9;st,t;!$0;! s0;t$dard,ummD;$hur,i0;et0;ta;l3s0;si1w0y1;$;ut; 1ex$dr0;ia;fayyum,khusus,m0qahirah#jadid2;a0inya;hallah#kubra,nsur0;ah;er","Eastern European","egypt"],"Casablanca":["true¦aDfCkenitBm5oujda4rabat,sa2t0;angier,e0;ma9touan;fi,le0;! al jadida;! angad;a3ekn6o0;hammedia,rocc0;an,o0;! standard;!r0;!rakesh;ra;es;gadir,l hoceima","Morocco"],"Ceuta":["true¦brussels copenhagen madrid paris,ce2e1spa0;in,nish;s,urope central;ntral europe0st,t,utamelilla;!an0;! s0;tandard,ummer","Central European","eu2"],"El_Aaiun":["true¦casablanca,e1laayoune,morocco0western sahara;! standard;h,sh","Morocco"],"Johannesburg":["true¦!1:#$%&()*:er,an,africa,ast,en,ar,et;% south#n,bLcHdGeDgqeb#ha,kBlAnewc&Kp9r8s5t3uit(hage,v2w1za0;!f;elkom,itb$k;$d#bijlp)k,#e(iging;e0he0;mbisa;&,o0prings,w9z;sh$guve,uth %0w*o;! st$d)d,n;$dFich)ds bay,oodepoort,ust(F;a)l,i*#m)itzEort elizab*h,r*oria;esotho,s;l#k0rug#0;sdorp;& lond4malahleBswatini0vat4;! sw0;azil$d;iepsloot,urb5;a1(turi0;on;pe town,rl*onvil0;le;(o3loemfontein,o1rakp0;$;ks0tshabelo;burg;ni","South Africa"],"Juba":["true¦c2s0winejok;outh sudan,s0;!d;at,entral africa0;! standard","Central Africa"],"Khartoum":["true¦a8c6el 5k3ny4omdurm2port sud2s0wad medani;d0inga,ud1;!n;an;ass0hartoum north,osti;ala;dae3fasher,obeid;at,entral africa0;! standard;d damaz0l qadarif;in","Central Africa"],"Lagos":["true¦!1:#$%&()*+-./<=>:frica,epublic of ,in,en,al,an,er,da,re,gu,to,ou,ha,ngo;a15b0Yc0Ld0Ee0Dg09h08i00jZkUlTmLnIoFpoErDsBt(a/Yu9viaYw2y1z0;ar9%d*;a<nde,&agoa,ola; c4a3est0; 0*n4;a#0c2;! st)+rd,n;rLst,t;&tr(0; a#;gep,ige,muah0yo;ia;a0=gamu,oko/;ki,mba,pele,urimo;amir9$t04;%te noi-,rt =rc<rt;b(&Rgbomoso,kQn1sogbo,w0yo;*Bo;do,its=;e,g,ig*0newi,ova vi+;!ia0;!n;a2b)+ka,%Cu0;bi,l&v0;os;i2kur1l)je,r0si9ta1;a0<a;di;a01du.0;ri;ekki,obiSubaQ;a2i0;k0ma kieza;olo,wit;du0no,tsi0;na;imeta,os;bad),jebu o6k4l1se0wo; 09y1;a or).n,e1or0;%; i6sa;a-,eja,i-,ot ekp0;&e;de;oji ya hUuamR;a2boko,o0q,usau;l0mbe;fe;!bI;bute ikorodu,fon (aaye,nu.,qua/ri( .%ea;emocratic 1r0; 3c;co3r$0;co2t0;he 0;co0;>;a6d,&tr( a#n -p5f,g,=kwaAm,o1ui0;/;d,>0/n<;! 0;brazzavilJdem r0k%s=sa,r0;ep;!ublic;b%Bl4m1ze0;nga;a1*o0;on;ma;abar,um2;a3&2i0;+,m0;bo;.e4%;f<ssam,m0uchi;&0;+;b6do 5# west*n,ge4je.n3k1limosho,>0o,t)i;la;owonjo,u0;-;le;ge;ekiti;a,eoku1omey c(avi,u0;ja;ta","West Africa"],"Maputo":["true¦:!1:#$%:na,lartnec,gno;aDcrd,dCe8i6$ acirfa,mz,#ibmNo1per medFtac,uvakLw0zm;b,m,r,z;%c0iomCyawalJ;! 0;c1eht f0f0rd;o cilbuper c0;itarcomed;b,dnurE#g#s3sak4walCyam ijubm,zewlo0;k,s;#mileuq,rarah,tet,uqibmazom,w0;babmiz,%l1t0z;ik;il;c,oc,rad#ts acC;cBd#wr,g##k,i6l3#wstob,pakihst,ri2sahsnik1tap0ziwgnut0;ihc; o%c;eb,vu;ac6o0upm6;dn,t0;am;b1n0;ub;im1m0;az;an;irfa $","Central Africa"],"Monrovia":["true¦g1l0utc,zulu;br,iberia,r;mt,reenwich0;! 0;mean,standard","Greenwich"],"Nairobi":["true¦!1:#$%:frica,an,ar;a01bWcomoros,dVeLgJh%geysa,jijiIkEmBna8ruiAs5t2u0w%Kyt,z$zib%;g0nited republic of t$z$6;!$daN;a0hika,oamasi6z;bora,n0;ga,z$I;o0umbaw$C;!mal0;ia;ku1nsa0zH;na;ru;a1beLekele,g,o0w$za,yt;mbaProgoro;dagascMyotte;a2e1i0m;kuyu,ra,sumu;!nya8;haGkame0;ga;eita,on0;der; 8a5ldo4r2t0;!hiop0;ia1;!itrea0;!n;ret;st0t; a#0ern 1;! st$d%d,n;a#;ire dawa,odo2;a2ora1unamwa0;ya;ma;hir d0lbala;%;# eastern,rusha,wa0;sa","East Africa"],"Ndjamena":["true¦!1:#:africa;# western,chad,t7w0; c4a3est0; 0ern4;#0c2;! standard,n;st,t;entral0; #;cd,d","West Africa"],"Sao_Tome":["true¦g4p3s0utc,zulu;ao tome1t0;!p;! p0;rincipe;mt,reenwich0;! 0;mean,standard","Greenwich"],"Tripoli":["true¦a5benghazi,e2l0misrat6tarhuna,zawiya;by,ibya0y;!n;astern europe0et,urope eastern;!an0;! standard;l khums,z zawiy0;ah","Eastern European Standard"],"Tunis":["true¦ce3europe central,sfax,t0;n,un0;!isia0;!n;ntral europe0t;!an0;! standard","Central European Standard"],"Windhoek":["true¦africa central,c2na0;!m0;!ibia;at,entral africa0;! standard","Central Africa"]},"America":{"Adak":["true¦a4h3nwt,u0;nited states1s0;!a;! of america;awaii daylight,dt,st;leutian1merica0;!n;! 0;islands,standard","Aleutian","usa"],"Anchorage":["true¦a3u0;nited states1s0;!a;! of america;h4k3laska1merica0;!n;! 0n;daylight,standard;dt,st,t;dt,st","Alaska","usa"],"Araguaina":["true¦!1:#:south americ;br0east #a,palmas,#an east,tocantins;!a0st,t;silia1zil0;!ian;! standard,n","Brasilia"],"Argentina/Buenos_Aires":["true¦a0mar del plata;merica/argentina,r0vellaneda;!g0st,t;!entin0;a0e,ian;! standard","Argentina"],"Argentina/Catamarca":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Cordoba":["true¦ar0corrientes,posadas,santa fe;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Jujuy":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/La_Rioja":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Mendoza":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Rio_Gallegos":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Salta":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/San_Juan":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/San_Luis":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Argentina/Tucuman":["true¦ar0san miguel de tucum2;!gentin0st,t;a1e,i0;an;! standard","Argentina"],"Argentina/Ushuaia":["true¦ar0;!gentin0st,t;a0e,ian;! standard","Argentina"],"Asuncion":["true¦c3p0san lorenzo;araguay1ry,y0;!st,t;! standard;apiata,iudad del este","Paraguay"],"Bahia":["true¦!1:#$:outh america,st;br2camacari,ea$ s#,feira de santa1itabu1s0vitoria da conqui$a;alvador,#n ea$;na;!a0$,t;silia1zil0;!ian;! $andard,n","Brasilia"],"Bahia_Banderas":["true¦:arajaladaug,dradnats ocixem 3lartnec xm,na1o1sarednab ed aihab,t0xm2;irayan,sc;cixem0;! 0;lartnec","Central Mexico"],"Barbados":["true¦a1b0us atlantic;arbados,b,rb;st,t0;!lantic0;! standard","Atlantic Standard"],"Belem":["true¦!1:#$%:south americ,east,an;%%indeua,br2$ #a,mac1para0#% $; $ am0uapebas;apa;!a0st,t;silia1zil0;!i%;! st%dard,n","Brasilia"],"Belize":["true¦american3b2c0us3;entral0st,t;! standard;elize,lz,z; central","Central Standard"],"Boa_Vista":["true¦am3br1central brazil0roraima;!ian3;!azil0;!ian;azon0t;! standard","Amazon"],"Bogota":["true¦!1:#$%&:an,ar,en,ll;$m%HbDc7dosquebradas,floridabl#ca,i6k%nedy,m5neiva,p3s1v0;a&edup$,i&avic%cio;#ta m$6incelejo,o0;acha,ledad;a0ereiBopay#;lmiAsto;#izales,ede&in,onterB;bague,taguei;a4o1ucu0;ta;!l0st,t;!ombia0;! st#d$d,n;li,rtag%a;$r#2e&o,u0;c$am#ga,%av%tu0;ra;cabermeja,qui&a;ia","Colombia"],"Boise":["true¦america6idaho,m3u0;nited states1s0;!a;! of america;dt,ountain0st;! 0;daylight,id,standard;!n","Mountain","usa"],"Cambridge_Bay":["true¦ca4m0;d2ountain0st;! 0;daylight,standard;dt,t;!nad0;a,ian","Mountain","usa"],"Campo_Grande":["true¦am2br0mato grosso do sul;!azil0;!ian;azon0t;! standard","Amazon"],"Cancun":["true¦america easte5e3m1quintana roo,us east0;!e4;exic0x;an,o;astern0st,t;! standard;rn","Eastern Standard"],"Caracas":["true¦alto barinIbarHcCguaAm7p6san5turmeEv0;alencia3e0;!n0t;!ezuela0;! standard,n;! venezuela; cristobal,ta teresa del tuy;eta4uerto la cruz;a0ucumpiz;raca0turin;ibo,y;ren7ti0;re;abim5iudad 2o1u0;a,m2;ro;bolivar,guay0;ana;in0quisimeto,uta;as","Venezuela"],"Cayenne":["true¦french guiana3g0;f1u0;f,iana;!t;! standard","French Guiana"],"Chicago":["true¦!2;:!1:#$%&()*:na,uo,ra,ro,artnec,ni,ts;aZdXeSg)vri,ht&w t&f,iQkNlFnBoAs2t0x8yremogtnW;c,dc0hgilyadX&peverhs,sc;!\\g*c;a4e3i0#el&2u;hpmem0lopaYo)lli,$lC;! ht$s0; wen;)om sed,t03;llad,s#k1x0;et;!%;de%l,inot# n7lli%B#lp;a9i2locnDo0;sidam,t0;g)l%,s$h;snocsQ*ua;(3uap0; t0;)0s;as;! 0;#0su;cire0;ma;co0%p d#lrevo;bbul,r eltt0;il;ppissi0r$0*irhc sup&c;ssB;ekuawlAg$r notab,iriarp d#rg,l0;ib2liv0;hsan,s0;nworb,tnuh;om;#l%g,%d#*0; l(;cirema9hamo,ksarb8m7#isi$l,s6t0woi;ihc4o0;kad ht2s0;enn0;im;&n,$s;iw;lut,u;abala,ohalko;en;! fo set0;a* detinu","Central","usa"],"Chihuahua":["true¦:dradnats ocixem 2lartnec xm,na0o0tsc,xm1;cixem0;! 0;lartnec","Central Mexico"],"Ciudad_Juarez":["true¦juarez,m0;dt,exic2ountain0st,x;! 0;daylight,standard;an,o","Mountain","usa"],"Coyhaique":["true¦aysen,c0;hile0l,oihaique;!an","Aysen"],"Costa_Rica":["true¦american4c0sjmt,us4;entral2osta rica1r0st,t;!i;!n;! standard; central","Central Standard"],"Cuiaba":["true¦am2br0mato grosso,varzea grande;!azil0;!ian;azon0t;! standard","Amazon"],"Danmarkshavn":["true¦g0utc,zulu;l,mt,reen0;land,wich0;! 0;mean,standard","Greenwich"],"Dawson":["true¦ca4m2y0;d0pt,wt;dt,t;ountain0st;! standard;!nad0;a,ian","Mountain Standard"],"Dawson_Creek":["true¦british columbia,ca2m1p0;pt,wt;ountain standard,st;!nad0;a,ian","British Columbia"],"Denver":["true¦!2;aAcolorado9el paso,m4n3salt lake,u0wyoming;nited states1s0tah;!a;! of america;avajo,ew mexico;dt,o1st0;!\\hmdt;ntana,untain0;! 0;daylight,standard;! springs;lbuquerque,merica0urora;!n","Mountain","usa"],"Detroit":["true¦!1:#$:america,st;#7e4grand rapids,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,pt,$,t,wt;! 0;daylight,mi,$andard;! ea$e0n;rn","Eastern","usa"],"Edmonton":["true¦alberta3c0n4;a0entral standard,st;! mountain,lgary,nad0;a,ian;! and n0;orthwest territories","Alberta and Northwest Territories"],"Eirunepe":["true¦a2br0;!azil0;!ian;c0mazonas west;re0t;! standard","Acre"],"El_Salvador":["true¦american4c2el1s0us4;an0lv,oyapango,v; salvador;entral0st,t;! standard; central","Central Standard"],"Fort_Nelson":["true¦british columbia,ca1m0;ountain standard,st;!nad0;a,ian","British Columbia"],"Fortaleza":["true¦!1:#:outh america;br5ca4east s#,imperatriz,j3m1natal,s0teresina;ao luis,#n east;a0ossoro;picernpb,racanau;oao pessoa,uazeiro do norte;mpina grande,ucaia;!a0st,t;silia1zil0;!ian;! standard,n","Brasilia"],"Glace_Bay":["true¦a2ca0us atlantic;!nad0pe breton;a,ian;dt,st,t0;!lantic0;! 0;daylight,standard","Atlantic","usa"],"Goose_Bay":["true¦a2ca0labrador,npt,us atlantic;!nad0;a,ian;dt,st,t0;!lantic0;! 0;daylight,standard","Atlantic","usa"],"Grand_Turk":["true¦america easte9c8e5kmt,t1us east0;!e8;c2urks0;! 0;and c4c4;!a;astern0dt,st,t;! 0;daylight,standard;aicos;rn","Eastern","usa"],"Guatemala":["true¦american4c2g0mixco,us4villa nueva;t0uatemala;!m;entral0st,t;! standard; central","Central Standard"],"Guayaquil":["true¦amba7cuenca,e2ma1portoviejo,q0santo domingo de los colorados;mt,ui6;chala,nta;c0loy alfaro;!t,u0;!ador0;! 0ian;mainland,standard;to","Ecuador"],"Guyana":["true¦g0;eorgetown,uy1y0;!t;!ana0;! standard","Guyana"],"Halifax":["true¦a4ca2n1p0us atlantic;ei,rince edward island;ew brunswick,ova scotia;!nad0;a,ian;dt,st,t0;!lantic0;! 0;daylight,standard","Atlantic","usa"],"Havana":["true¦:a9b8dradnats7erbutco ed zeid,n6o4s1thgilyad7uc0yeugamac;!eh,h,nh;anut sal,o0;geufneic0reyob;! olimac daduic;ir led ranip,jnaran oyorra,ma0;natnaug,yab;ab1iugloh; ab0;uc;buc0ralc a1;! ed ogai0;tnas","Cuba","cuba"],"Hermosillo":["true¦ciudad obregon,hnpmx,m0nogales,sonora;exic0x;an0o;! pacific0;! standard","Mexican Pacific"],"Indiana/Indianapolis":["true¦!1:#$:america,st;#Acrawfo9dadukmn,e6iBp4$ar5u0;nited $ates2s0;! ea$0a;!e9;! of #;erry,i0ulaski;ke;a$ern0dt,$,t;! 0;daylight,in,$anda0;rd;! ea$e1/i0n;ndiana;rn","Eastern","usa"],"Indiana/Knox":["true¦!1:#$:america,entral;#6c3indiana,u0;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"Indiana/Marengo":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Indiana/Petersburg":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Indiana/Tell_City":["true¦!1:#$:america,entral;#6c3indiana,u0;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"Indiana/Vevay":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Indiana/Vincennes":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Indiana/Winamac":["true¦!1:#$:america,st;#7e4indiana,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"Inuvik":["true¦alberta and n3c0n3pddt;a0entral standard,st;!nad0;a,ian;orthwest territories","Alberta and Northwest Territories"],"Iqaluit":["true¦america easte7ca5e1us east0;!e6;astern1d0st,t;dt,t;! 0;daylight,standard;!nad0;a,ian;rn","Eastern","usa"],"Jamaica":["true¦america easte7e5j2k1new k1us east0;!e6;ingston;am0m;!aica0;!n;astern0st,t;! standard;rn","Eastern Standard"],"Juneau":["true¦a3u0;nited states1s0;!a;! of america;k3laska1merica0;!n;! 0n;daylight,standard;dt,st,t","Alaska","usa"],"Kentucky/Louisville":["true¦!1:#$:america,st;#7e4k8u0wayne;nited $ates2s0;! ea$0a;!e6;! of #;a$ern0dt,$,t;! 0;daylight,ky,$andard;! ea$e1/k0n;entucky;rn","Eastern","usa"],"Kentucky/Monticello":["true¦!1:#$:america,st;#7e4kentucky,u0;nited $ates2s0;! ea$0a;!e5;! of #;a$ern0dt,$,t;! 0;daylight,$andard;! ea$e0n;rn","Eastern","usa"],"La_Paz":["true¦bo1cochabamba,oruro,s0;anta cruz de la sierra,ucre;!l0t;!ivia0;! standard,n","Bolivia"],"Lima":["true¦arequiBc7huancAi6juliaca,p2sant1t0;acna,rujillo;a anita los ficus,iago de sur6;e0iura,ucall8;!r0t;!u0;! standard,vian;ca,quitos;allao,hi1us0;co;cl0mbote;ayo;pa","Peru"],"Los_Angeles":["true¦!2;:!1:#$%&()*:na,ir,no,cific,ro,ts,ema;aS&apPdKeEfs,hcaeb Dmieha#,nAo5(#m es$nus,s3t1yellav 0;gn$Honer6;dp0hgilyadK%m7p,sp;!\\i)p;agev sal0eWu;! ht(n;csic#rfAgeidAn2t0;n*rcPsed0;om;er,idranreb7s0;erf;a1o0;ge(,sredneh,tkco);cErf3;g%l,%tgnitnuh;dis4lttaes,n2s0ta) %tgnihsaw,vorg nedrag;idar7oj0; nF;ako0ivri;ps;#eco,rev$;leifsrekD#l3ra0;d#)0nxo; &0;ap;kao,t(p;! 0;ac0su;$*;c$*6daven,g%macuc ohc#r,in(filac4l,mocat,#1su,t0;$alc 1siv aluhc; 0t%f;atn0;as;! aj0;ab;! fo se0;ta) detinu","Pacific","usa"],"Maceio":["true¦!1:#:south americ;a4br0east #a,#an east;!a0st,t;silia1zil0;!ian;! standard,n;lagoassergipe,racaju","Brasilia"],"Managua":["true¦american4c2ni0us4;!c0;!aragua;entral0st,t;! standard; central","Central Standard"],"Manaus":["true¦am3br0central bra1;!a0;zil0;!ian;azon0t;! standard,as east","Amazon"],"Martinique":["true¦a3f1m0us atlantic;a1q,tq;fmt,ort de france,rench ma0;rtinique;st,t0;!lantic0;! standard","Atlantic Standard"],"Matamoros":["true¦american5c2heroica matamoros,m0nuevo laredo,reynosa,us5;exic0x;an,o;dt,entral0st,t;! 0;daylight,standard; central","Central","usa"],"Mazatlan":["true¦!1:#$:standard, pacif;culiacan,h8los mochis,m0nayarit,sinaloa,tep5;exic2ountain 0x;m0# m0;exico;an2o0;!$0;ic;!$ic0;! #;ep0np0p0;mx","Mexican Pacific"],"Menominee":["true¦!1:#$:america,entral;#6c3u0wisconsin;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"Merida":["true¦:a5dradnats ocixem 4e3lartnec xm,na0oc1tsc,xm2;c0tacuye2;ixem0;! 1;hcepmac;lartnec;l0rajaladaug,somrehalliv;txut,uhcapat","Central Mexico"],"Metlakatla":["true¦a3u0;nited states1s0;!a;! of america;k3laska1merica0;!n;! 0n;annette island,daylight,standard;dt,st,t","Alaska","usa"],"Mexico_City":["true¦:!1:#$%&()*+-./<=>?@[: ed ,ed ,la,ac,na, o,oc,ra,at,ar,hc,ug,eu,ne,et,da,lerom;a0Cc0Ad+d(ts)cixem 09e08i06l04nToBs6t5x4z0;e0urc.ev;/(s)(ic.g#@delos,+uj 0uqir>#apa%x;$0oti>b;(p%cuan,*lup&a;em,mU;sc,wc;a2?>i%csa<a,o0;c%*azta*,?am zepolX[0;!#cep?&e;c?&Np0rertn* a>%dgam;a8iluamD;cAg5r2t0;au0os#&u/ap;ja(<,p.i;-er=q1e0;@m)flo@)v-s<,mor sal*in,rre<;!#ogaitQ;%dih2n0;.ud,ic(pl0;i/;! 0;$&ir azop,le<H;ix5l2s0;ab0i%j;-;a0imi/ox;ca0ztop&za;*,tP;!em6;a1o0;el)v=n,gerbo)+v%;c2p0t&uy;auru,lQop0;az;a1ixem0;! 9;o1uh0;?,%mi/ ai+m -5;/0yH;im;.t>c xm,toy*%uhazen0; @duic;l%czi (ltit4sotop siul 0;(s;/epm&,l%v l$ainolBuqap=qE;%rtn4;auhCom?h0;uaF;cBi[,l6m5pa%p-4+ja%@3t2<a#ojo,yal1z(rr&)(itsun0;ev;ec;+l%v)tr5sivan=b;<;zi;ad% sol#noel,il1;a2b1iuha0t(penl3;*;=p;cx0not;alt;a1ul0;ap-xi,ot;vanre0xao;uc","Central Mexico"],"Miquelon":["true¦:!1:#$:noleuqim ,rreip;dradnats6e4mp3#0thgilyad6;dna e3e$0;! t0;n2s;!eh,h,nh,s;$ tn0;ias; #e$ ts","St. Pierre & Miquelon","usa"],"Moncton":["true¦a2ca0hepm,new brunswick,us atlantic;!nad0;a,ian;dt,st,t0;!lantic0;! 0;daylight,standard","Atlantic","usa"],"Monterrey":["true¦:!1:#$%:lartnec,irotciv,ra;a6d%dnats ocixem 5epu7# xm,n2o0tsc,xm4ze%uj otineb9;ci0debocse lareneg8gnarud ed a$,icalap zemog,llitl7redam8;pmat,x1;acix0oerrot;em0;! 0;#;cadopa2$2ni%tac atn1%ja0volcnom,z%g sol ed salocin n1;ladaug;as; daduic","Central Mexico"],"Montevideo":["true¦montevideo 4u0;r1y0;!st,t;uguay0y;! 0an;standard","Uruguay"],"New_York":["true¦!2;:!1:#$%&()*+-./<=:ts,ni,re,ro,al,no,ne,ae,ta,or,ih,el,su;a0Bc09d02eShQiOkNlMmLnCo9%#e8s5t2x)rb eht,y0;es%j0kcut*k,n;! V;de1e,hgilyad00)m%v,s0ucitcenn4;+ =,e;!\\f#e;d+m,e0F*e4%k)y,tte=hcassam,u0wen t&pR;!bmul0;oc;c&w,hc.;d1/o,laffub,. anat$0&bs*erg;uq;<ot,n(&;a6o2%#+0ylko.b;! 0;ac5=;rka,t0;g$1sob0;! htuW;hRxC;c0g/c5t-hnN;i%ma;ahrud,<as )#$w;a&c epac,f;lofrRra9;ma0-n$c$c;im;+la/,c+b ai$griv,g0=bt(f D;i<arQrubsttip;c*div.p,ess8k+paseQl5$Er3t0;a# k&y 3t0;eyaf )tg$x0olraO;<;aw(ed,/spmah 0omitlab;wen;ad%du( t&f,liv0;etteyaf,)0xonk;ri,skcaj;ah(lAen*t;n2radna#0; n%0;#+;(0omhcir;ev<c,si 1yr0;am;edohr,*-#;d )tg$h0yn;saw;ci%ma8di&lf,goonat-7i4$l.ac ht1pm0=,tn(-;at;r1u0;os;on;g&eg,hpled(/p,n0;avlysn*p,igriv0;! #ew;hc;! fo se0;-# detinu","Eastern","usa"],"Nipigon":["true¦america easte6ca4e1us east0;!e5;astern0dt,st,t;! 0;daylight,standard;!nad0;a,ian;rn","Eastern","usa"],"Nome":["true¦a3u0west alaskan;nited states1s0;!a;! of america;k3laska1merica0;!n;! 0n;daylight,standard,west;dt,st,t","Alaska","usa"],"Noronha":["true¦atlantic islands,br2f0;ernando de noronha0nt;! standard;!azil0;!ian","Fernando de Noronha"],"North_Dakota/Beulah":["true¦!1:#$:america,entral;#6c3north dakota,u0;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"North_Dakota/Center":["true¦!1:#$:america,entral;#7c4merc3north dakota,oliv3u0;nited states1s0;! 7a;! of #;er;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"North_Dakota/New_Salem":["true¦!1:#$:america,entral;#6c3north dakota,u0;nited states1s0;! 6a;! of #;dt,$0st,t;! 0;daylight,standard;!n0;! 0;c$","Central","usa"],"Nuuk":["true¦g4w0;est greenland1g0;st,t;! s0;tandard,ummer;l,r0;eenland,l","West Greenland","green"],"Ojinaga":["true¦american5c2m0us5;exic0x;an,o;dt,entral0st,t;! 0;daylight,standard; central","Central","usa"],"Panama":["true¦a5e3pa1san miguelito,us east0;!e5;!n0;!ama;astern0st,t;! standard;merica easte0tikokan;rn","Eastern Standard"],"Pangnirtung":["true¦a6baffin island,ca4e1nunavit,us east0;!e6;astern0dt,st,t;! 0;daylight,standard;!nad0;a,ian;ddt,merica easte0;rn","Eastern","usa"],"Paramaribo":["true¦s0;r2ur0;!iname0;! standard;!t","Suriname"],"Phoenix":["true¦a8chandler,g6m4scottsd7t3u0;nited states1s0;!a;! of america;empe,ucson;aryv2esa,ountain0st,t,wt;! standard;ilbert,lend0;ale;merica0rizona;!n","Mountain Standard"],"Port-au-Prince":["true¦:dradnats7ellivnoitep,it6nretsae4ruoferrac,s3t0xiap ed trop;de,e,h1s0;ae su,e;!gilyad4;amled,teuquob sed xiorc;! 0;acirema,su;h,iah; nretsae","Eastern","usa"],"Porto_Velho":["true¦am3br1central brazil0rondonia;!ian3;!azil0;!ian;azon0t;! standard","Amazon"],"Puerto_Rico":["true¦:adubrab augitna,citnaltaJdHgGiFlEnAo8qb,rp,s1t0xs;a,sa,t;dnal2iven0t1;! st0;tik ts;rehte9si nigriv0;! 0;hsitirb,ku,s0;etats detinu,u;cir otreup,gabot0;! da8;etraam t0k,omayab;ni0s1;as,s0;! hctud;n naebbirac;rp,v;a,v;a0radnats citnalta;dinirt;! su","Atlantic Standard"],"Punta_Arenas":["true¦c1m0region of m0;agallanes;hile1l0;!t;! standard,an","Magallanes"],"Rainy_River":["true¦ca1e0ft frances,manitoba;astern standard,st;!nad0;a,ian","Manitoba"],"Rankin_Inlet":["true¦american6c0us6;a3d2entral0st,t;! 0;daylight,standard;dt,t;!nad0;a,ian; central","Central","usa"],"Recife":["true¦!1:#$%:south americ,ar,st;br3c$u$u,ea% #a,jaboatao2olinda,p0#an ea%;auli%a,e0;rnambuco,trolina;! dos gu$$apes;!a0%,t;silia1zil0;!ian;! %and$d,n","Brasilia"],"Regina":["true¦american7c2s0us7;askat0k;chew4oon;a1entral0st,t;! standard;!nad0;a,i0;an; central","Central Standard"],"Resolute":["true¦american5c0us5;a2dt,entral0st,t;! 0;daylight,standard;!nad0;a,ian; central","Central","usa"],"Rio_Branco":["true¦ac2br0;!azil0;!ian;re0t;! standard","Acre"],"Santarem":["true¦!1:#:south americ;br1east #a,para we0#an ea0;st;!a0st,t;silia1zil0;!ian;! standard,n","Brasilia"],"Santiago":["true¦a8c3iquique,la pintana,maipu,puente alto,rancagua,san bernardo,t1v0;alparaiso,ina del mar;alca0emuco;!huano;h1l0oncepcion;!st,t;ile0l;! s0an;tandard,ummer;ntofagasta,rica","Chile","chile"],"Santo_Domingo":["true¦a9bella vista,do5la romana,s0us atlant8;an0dmt; pedro de macoris,t0;iago de los caballeros,o domingo 0;e0oe0;ste;!m0;!inican0;! republ0;ic;st,t0;!lantic0;! standard","Atlantic Standard"],"Sao_Paulo":["true¦:!1:#$%&()*+-./<=>?:d , o,na,ra, a,ac,ir,re, e,ar,at,ma htuos, s,ni,iv;0:18;a0Cd&d%ts(ilis0VeYiVlUmS%iliRoKrb,s6t4u1;a2bme,caugi 1ruab;aNo#zof;jUnemulb;rb,s1;ae %c*e<,rb;aAe7i2o1;hl0Fl&cXpm)5&lc=etn8t%s;ah>p4lop1;a%,o1;n1rt7;a*olf,?id;=A;&dalav rodan+vog,ven=a#oaAz1;)/yog=o#so5urc=a#ig1;om;ix)-#euqud,>3o2tol1;ep;gal-tes,n0;pm0;ama?,csaso,d6grubmah$5*,%zMpm)$#od&n+bKr4terp$1xor droflH;a2* 1;o#esH;riebN;alcKie%j-dK;von;lopoelEnuf$ssap;s04z04;eg/nWi1;rimep/i-#orieohc0t8;ev)s0iz01us$#saix0;a1e&cQo+tin,+u&b,t*em-#oa8vep0B;idnLrob0Atav1;.g;d9ll?>oj,r7s5t1;abuHn1seo#a&b&bR;e2oz*oh$l1;eb;c?2durp-tnedise9;oj1;$O;am1d%$Mgela$tr8;us;%rg 2+v1;$2;aia2o1;*;rp;bScPdOg>Mhlev(lLiBjAleg% midr9meda8n6r2ssorg(tn1uN;op;b,iemil,of-#zi3+s1;!(#oaob1;/;uj;)*ema,i1;rdnol,tla%lp;id;aj;u&ug;d%l9li7%iog6r2t1zul3;oc;am1ot8;(1;tn1;as;!-#adice&pa;r5s1;.b;otroh,rE;?;r1tapi;am;.ovla,noder(tlov;i2%rf,ujit(#.r1;ab;ca*0+< tsae;a5i3ut1;aiad>,eceuqauq1;/i;t*uc,ucip.0;);c2r1;ebu;ic.ip,or1;os","Brasilia"],"Scoresbysund":["true¦e4g2h0ittoqqortoormiit;e0neg;eg,g;l,reenland0;! eastern;ast greenland1g0;st,t;! s0;tandard,ummer","East Greenland","green"],"Sitka":["true¦a3u0;nited states1s0;!a;! of america;k3laska1merica0;!n;! 0n;daylight,standard;dt,st,t","Alaska","usa"],"St_Johns":["true¦ca6h4n0;d2ewfoundland0st,t;! 0;daylight,labrador,standard;dt,t;e0n0tn;tn;!nad0;a,ian","Newfoundland","usa"],"Swift_Current":["true¦american5c0saskatchew4us5;a1entral0st,t;! standard;!nad0;a,i0;an; central","Central Standard"],"Tegucigalpa":["true¦american4c2h0san pedro sula,us4;n0onduras;!d;entral0st,t;! standard; central","Central Standard"],"Thule":["true¦a1g0pituffik,us atlantic;l,reenland;dt,st,t0;!lantic0;! 0;daylight,standard","Atlantic","usa"],"Thunder_Bay":["true¦america easte6ca4e1us east0;!e5;astern0dt,st,t;! 0;daylight,standard;!nad0;a,ian;rn","Eastern","usa"],"Tijuana":["true¦america8baja california,ensenada,h6m3p0us8;acific0dt,st,t;! 0;daylight,standard;exic0x;a0o;li,n;e0n0;nomx; pacific","Pacific","usa"],"Toronto":["true¦:!1:#$%:no,retsae,ma;aIcebeuq,dradnatsHeFlC%hkram,n5oirat#4r3s2t0uaenitag;de,e,hgilyadG#,s0;ae su,e;a%hDb;enehctik,osdniw;! 5;a5o2$0;! 0;acire%,su; 1t0;li%h,p%rb;#d2;c,epen,hguav,id8;a1iueug0lih d#mhcir;#l;ert#m,val;irr0kocibote;ab; n$;c,d1guassissim,wa0;hso,tto;anac","Eastern","usa"],"Vancouver":["true¦america pacific,b4ca1ladner,m0okanag3pacific bc,surrey,victor5yukon;ountain standard,st;!nad0;a,i0;an;ritish columb0urnaby;ia","British Columbia"],"Whitehorse":["true¦ca2m0yst;ountain0st;! standard;!nad0;a,ian","Mountain Standard"],"Winnipeg":["true¦ca2e1m0west m0;anitoba;astern standard,st;!nad0;a,ian","Manitoba"],"Yakutat":["true¦a3u0;nited states1s0;!a;! of america;k3laska1merica0;!n;! 0n;daylight,standard;dt,st,t","Alaska","usa"],"Yellowknife":["true¦alberta and northwest territories,c0;a0entral standard,st;!nad0;a,ian","Alberta and Northwest Territories"]},"Antarctica":{"Palmer":["true¦a0palmer;ntarctica,q","Palmer"],"Casey":["true¦a2cas0;ey0t;! standard;ntarctica,q","Casey"],"Davis":["true¦a2dav0;is0t;! standard;ntarctica,q,ta","Davis"],"Macquarie":["true¦!1:#$%:east,ern,tralia;a0#$ aus%8macquarie island;e8u0;!s0;! #4%0;! #2n0;! #0;!$ daylight;!$;!$0;! standard;dt,st,t","Eastern Australia","aus"],"Mawson":["true¦a2maw0;son0t;! standard;ntarctica,q","Mawson"],"Rothera":["true¦a0;ntarctica,q,r0;gentin0st,t;a0ian;! standard","Argentina"],"Troll":["true¦a3gmt,troll0;! 0;research station,s0;tandard,ummer;ntarctica,q","Troll","troll"],"Vostok":["true¦!2;a2msk+\\e,vost0;!ok0;! standard;ntarctica,q","Vostok"]},"Asia":{"Urumqi":["true¦aqsu,c3gujangbagh,huoche2k1shihezi,urumchi,wulumu0xinjia2ürüm0;qi;ashgar,orla;ng;hin0n;a,ese","Xinjiang"],"Almaty":["true¦!1:#$:stan,st ka;a7central asia,ea$zakh#6k2nur sultan,p1s0taraz,u$menogorsk;emey,hymkent;avlodar,etropavl;a0z;ragandy,z0;!akh#0;! eastern;! #dard;lm0#a;a0t; ata,-ata time","East Kazakhstan"],"Amman":["true¦irbid,jo0russeifa,wadi as sir,zarqa;!r0;!dan0;!ian","Jordan"],"Anadyr":["true¦!2;ana5bering sea,msk+\\a\\j,petropavlovsk kamchatsky,ru0;!ssia0;! 1n0;! federation;time z0z0;one \\b\\b;dyr0t;! standard","Anadyr"],"Aqtau":["true¦!1:#$:azakhstan,sta;alm9k7man2west 0;asia,k#0;! $ndard;gghy$0k3;u0ū/1;!/0;mank0;i$u;#0z;! western;a ata,t","West Kazakhstan"],"Aqtobe":["true¦!1:#:azakhstan;a4k2west 0;asia,k#0;! standard;#0z;! western;ktobe,lm0;a ata,t","West Kazakhstan"],"Ashgabat":["true¦t0;km,m2urkmen0;abat,istan0;! standard;!st,t","Turkmenistan"],"Atyrau":["true¦!1:#:azakhstan;a4guryev,k2west 0;asia,k#0;! standard;#0z;! western;lm0tirau;a ata,t","West Kazakhstan"],"Baghdad":["true¦a7basrJdihok,erbil,i4k3mosul,na2r1s0;adr,u8;amadi,iyadh;jaf,sirF;arbala,irkuk,uwait;q,r0;aq0q;!i;bu Cd d8l 6rab2s0; su0t;laym7;!i0;a0c;!n0;! standard;amar4basrah al qadim4d1falluj4hill4kut,ma0;hmud2wsil al jadid3;iw0;an0;iy0;ah;al kahsib,ghurayb","Arabian"],"Baku":["true¦az2ganja,lankaran,sum0;g0q0;ayit;!e0t;!rbaijan0;! standard","Azerbaijan"],"Bangkok":["true¦:!1:#$%:gn,ah, no;aHcilbuper citarcomed selpoeFdEeuh,#Ch9i4mal aig,n1oekat,rdFsGt0ul aoh;ci,erk kap;a1e0os ih#;ib #ol,yu# iF;idJkarp tumas;a2n$t%du,on8r0;t teiv,ub0;%1$tnon #aeum;ht,m #ai0y t5;hc;k,ni0t;d0v,đ0; m8;aig cab,ohpi0urt ab i0;$;nali3radnats an4;p 0;oal;hcar is,i3l,mis$ctar%hk2n1oh hn0trakaj,đ #ođ;$t;ihcodni;an;d1sa 0;es,tsae htuos;obmac","Indochina"],"Barnaul":["true¦!2;altai,biysk,krat,msk+\\a\\e,north asia,ru0;!ssia0;!n0;! federation","Krasnoyarsk"],"Beirut":["true¦e3l0ras bayrut;b1eban0;ese,on;!n;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","leb"],"Bishkek":["true¦k0osh;g2yrgy0;stan,zstan0;! standard;!t,z","Kyrgyzstan"],"Brunei":["true¦b0;dt,n3r0;n,unei0;! darussalam0;! standard;!t","Brunei Darussalam"],"Chita":["true¦!2;msk+\\a\\g,ru2yak0zabaykalsky;t,utsk0;! standard;!ssia0;!n0;! federation","Yakutsk"],"Choibalsan":["true¦dornodsukhbaatar,m2ula0;anbaatar0t;! standard;n,ongolia0;!n","Ulaanbaatar"],"Colombo":["true¦chenn5dehiwala mount lavinia,i3kolkata,lk2m1new delhi,sri lanka0;!n;oratuwa,umb3;!a;ndia0st;! standard,n;ai","India"],"Damascus":["true¦a4deir ez zor,h3latakia,sy0tartus;!r0;!ia0;!n;am2oms;l0r raqq1; hasak0eppo;ah","Syria"],"Dhaka":["true¦!1:#$:ha,ng;bFcDdinajCgaziC#t#zari,jessBk9m8na5pa3ra2s1t0;a$ail,u$i;aidAhib5ylhet;js#hi,$9;b6l0r naogaon;labi,tan;gar6r0t5;ayan0si$di;ganj;irpur model t#1o#mmad3ymensi$h;afrul,hul0;na;ore;pur;#ttogram,o0;milla,xs bazar;a1d,gd,#ta0og0st;ra;ger#t,$ladesh0ris#l;! standard,i","Bangladesh"],"Dili":["true¦east timor2t0;imor leste,l0;!s,t;! standard","East Timor"],"Dubai":["true¦a7bawshar,dayr6g4mus3om2ras al khaim6s1u0;ae,nited arab emirates;eeb,harj4;!an,n;aff2cat;st,ulf0;! standard;ah;bu dhabi,e,jman,l ain","Gulf"],"Dushanbe":["true¦t0;ajikistan1j0;!k,t;! standard","Tajikistan"],"Famagusta":["true¦cy5e0northern cyp6;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;!p0;rus","Eastern European","eu3"],"Gaza":["true¦e4gaza strip,p0;alestin1s0;!e;e,ian0;! territories;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","pal"],"Hebron":["true¦e3p0west bank;alestin0s;e,ian0;! territories;ast1e0urope eastern;st,t; jerusalem,ern europe0;!an0;! s0;tandard,ummer","Eastern European","pal"],"Ho_Chi_Minh":["true¦!1:#$%:an, t, m;#KbGcFdBi9nha$rEqu7rach gia,sa dec,th4v0;iet1n0ung$au;!m; nam,nam0;! south,ese;i xa phu%y,u0; 0#6;dau%Ađuc;#%uoi0iC;!%8;ct,ndochina0;! st#dard;a 1i0; #;l5n0;#g;#$ho,ho l5;ac$u liem,en c2i1uon%a$hu0;ot;en hoa,nh$h#h;at; nh0;on","Indochina"],"Hong_Kong":["true¦h5jungwah,k4new territories,sha2t0victoria,wong tai s3yahnmahn;s0uen mun;eung kwan o,uen wan; t0m shui po;in;owloon,wai chu7;eung go6k4ong0; kong0ko5;! 0;island,s0;ar china,tandard;!g,s0t;ar,t;ng","Hong Kong"],"Hovd":["true¦bayan olgiigovi altaihovduvszavkhan,hov4m2west0; 0ern 0;mongolia;n,ongolia0;!n;d0t;! standard","Hovd"],"Irkutsk":["true¦!2;angar5brat5irk3msk+\\a\\f,north asia east,ru0ulan ude;!ssia0;!n0;! federation;t,utsk0;! standard,buryatia;sk","Irkutsk"],"Jakarta":["true¦:!1:#$%&(:senodni,gn,at,am,ak;aUbiw,dTgFheca IiCkoBlaget,m%Jn4o3r2t1u0;luk$Crabn8;%upic,ucr8;%nais$%&7ebmYis$u3ogob;dnobutis,g$iloborp,trekowT;a2di,o0retsew ai3uid&;beric,g0;elZ;dem,$ol1i0;#;(0;ep;lk$edsa$er,ped;a1bmNh&Tmub(Lridek,s(0;eb;jnib,mud;n0uruc;a3onibPu0;dn1pmal r0r7;adn0;ab;bmel7d6l3r0war(;&es,e0;$%0s;! htuos;&1um0;ap;!ep;ap,em6;!ap;i,radn%s ai# nA;epmaBi#7r4tr(a1ya0;bar2l&kis%;r1w0ygoy;rup;us;ap1t&usav0;aj;ej;! 0;n0t1;ret0;sew;ic","Western Indonesia"],"Jayapura":["true¦!1:#:ndonesia;ambon,east3i1m0new guinea,wit;alukus,oluccas;d,#0;! eastern,n; i#,ern i#0;! standard","Eastern Indonesia"],"Jerusalem":["true¦ashdod,beersheba,haifa,i0jmt,petah tiqwa,rishon leziyyon,tel aviv,west jerusalem;d4l,s0;r0t;!ael0;! 0i;daylight,standard;dt,t","Israel","isr"],"Kabul":["true¦af0herat,jalalabad,kandahar,mazar e sharif;!g0t;!hanistan0;! standard","Afghanistan"],"Kamchatka":["true¦!2;anadyr,msk+\\a\\j,pet3ru0;!ssia0;!n0;! federation;ropavlovsk kamchatsk0t;i0y;! standard","Petropavlovsk-Kamchatski"],"Karachi":["true¦!1:#$%&(:al,ha,an,ar,ra;&ifXbSchOde( Mfais#Lguj(KhJislamLjIkGlaFmBnawabs$h,okaRp6quetta,(5s1t%do 0wah c%tt;#lahy7bago;a2h1i0ukkU;#kNnjhoro;ahkMekhupuN;ddiqGhiw#,rgod$;him y&Hw#pindi;ak2es$w1indi b$ttiIk0;!t;&;!ist%0;! st%d&d,i;a2i1u0;ltCzaff&8;ngoDrpur k$s;lir c%tonment,rdA;hore,rkE;a0otli;moke,sE;##pur pirE$ng sadr;afiz1yder1;nCt;abad;g$zi0ismail0; kh1;ak jhum2ini1uni0;%;ot;(;a2h0ure4;aw0imber;%a;$w#p0nnu,ttag(m;ur;w#a","Pakistan"],"Kathmandu":["true¦b4h5n1p0;atan,okhara;epal1p0;!l,t;! standard,ese,i;h0iratnagar;aratpur","Nepal"],"Khandyga":["true¦!2;msk+\\a\\g,ru2tomponsky,yak0;t,utsk0;! standard;!ssia0;!n0;! federation","Yakutsk"],"Kolkata":["true¦:!1:#$%&()*+-./<=>?@[]^_`~:na,ra,ah,ar,dn,hs,ru,hc,am,la,an,ag,ma,ih,ga,al,ug,ht,ab,ni,ir,ok;0:45;1:3E;2:35;3:3Z;4:3D;5:39;a2Wd2Le2Afi$) $hib,g*d,h20i13j&?y&p,k11l0Xm0On0Ho$kob,rIsawed,tDu9wonkcul,y6;ll7r6;@13(umh0Rre+udup;apt1Hier3;-8gulum,mm5*6;.gn6sym;-,eb;!j5;a7epsoh,~j1s6ureem;i,ls;j iolgn4pin7r6s&3;aj[,us;ap,os;aQePh%sd#lOim)0oNu6yhgnom;+i1kmut,n#y/0p8ss`],t6yittov1A;a6n[,t^=;ddorp,l;aEde)m5?DhCiA.9m&8#7p17$6s@ib;fRnos *pj1;hrIjh%s,k,$has,yg;!%3`);b5?2;a6#m;du,j,r;doj,k&og;n,r2A;g9h8jib,l6mh&b,t##,zrim;lub]uq,o6;),s;!l~;#rwon,*d;guas,i.wg;ub;mja,#kib;dIg/Ah9kis,riv,s8w6;di$h,)6.,s6;e#bu2;>,t`=;d#l5it0; CaAd-ha,i9m7#d11$f6s%lu,va2;fazum;a6`0;j,y);dom,hd#g,rs;g#g,nu=y,r6yl>a;^,(e*s;ij2Q*d%^ .l;ib,#ya2;aBiAo<9ud6; a6a6;rh6;ed;el-,l5*g;!ajju,+oc;]sBi(i,m%ddr3yl0;a7e.6u<M;pidupas1s;([BlAntap9r6;a6gu*g,up%t##vur>t;b=t,?#iziv,v&(eh-6;aj1;%kasiv,ili+-;l~,t1;-1m1;a7iocreg4o6[i(id,wazia;onrZs#sa;g#$w,h6nr0po2vasu2;bmRpmi;atHcattuc,i)4;rp;a00dZgYhVj#$kl%ci,lHnErDsCt8va6;?6$hd;leb;a6lR;h6pMv&=;aw[,i6$m0;/,#p;a#$v,#hj;@l3p0H[ilis;a7et,i6ol;hor;hb$p,wi2;aGbFeDgB.8u&g_s,vi6;bGr6;ob;bbCp6;p&i+At6;akD;n6uh;as;$be1vlen6;urit;uh;b,p,tl7vib6;mod;uk;c7led6;! wen;i*k@l0n1~;&ub@0n4;ava,#wi2uku]ooR;bmum6li2nne+,*d-;! iv4;aBd</uj,gA$g6sed&p $ttu,t/$=;faj4i7#j6;us;d6.;#+;^ lor0i&h3;r6wate;$,w6;oh;ud;doFluhd,nDr6;eg#vad,o6;(i,jnAl8s7t^mi6;oc;ym;<#m,le6;!n,v;at;a6up;];k>z~,re;a6e(4_,$d#ts ai(i;b7id4w+_+ `p6;mip;a6#hd;d8g#*a,h7iz%g,=zin,red6zorif;nuces,yh;@.,kur7;&8em7i6;$f;ha;om;b0Kd0Bg06h03iZkaXlPnLpad0rCsAt9w7y6;<,hdU;(6er;%k;~,tuc.c;/Vr6;is;a9?,o7p%c,t)a$hOu6;]Np09;%,mil6;ib;dod9pta2w6;li2r6;um;hb;av;a>d8l5ta6;p,s;aj;ul;a9e6~a,uk+nC;k*1r4;/;&;it8t6;)eh6$?;-;ap;t/r0wuj6;<;d8lu7nr6;up;hd;_;or7sido,zuppa6;.;=;gom8#hbr7omi9$bl6;[;ad;avi6;);aAion9n6;a7>t3;^;+;! retaerg;_k0w6;ayaj6;iv;ak;as7r6;~;og","India"],"Krasnoyarsk":["true¦!2;krat,msk+\\a\\e,north asia,ru0;!ssia0;!n0;! federation","Krasnoyarsk"],"Kuala_Lumpur":["true¦alor setar,bukit mertajDgeorge town,ipoh,johor bahCk8m4petali3s0taipiB;e1hah alCu0;ba1ngai petani;pa8remb7;ng jaya;ala1y0;!s,t;cca,ysia0;! standard,n;ampung baru suba2la2ota bha3ua0;la terengganu,nt0;an;ng;ru;am","Malaysia"],"Kuching":["true¦kota kinabalu,m2s0tawau;a0ibu;bahsarawak,ndakan;alaysia1iri,y0;!t;! standard,n","Malaysia"],"Macau":["true¦beij7c4m0urumqi;ac0o;!a0;o0u;! sar china;h0st;ina0ongq1;! standard;ing","China"],"Magadan":["true¦!2;m3ru0;!ssia0;!n0;! federation;ag0sk+\\a\\i;adan0t;! standard","Magadan"],"Makassar":["true¦!1:#$%&:ndonesia,ar,an,ntral;ba8ce6denpas$,i4k3l2ma1palu,s0wita;am$inda,ulawesi;nado,t$am;abu% bajo,oa j%6;end$i,up%g;d,#0;! ce&,n;lebesbalinusa,& i#0;! st%d$d;likpap0nj$masin;%","Central Indonesia"],"Manila":["true¦!1:#$%&()*:an,in,ta,la,ga,ue,lo;#07bZcTdaRfilip$o,general s#tQiOlKmDnaCoBp5q)zJs#1%0valenz)&,zambo#(;c*b#,guig,r&c,ytF; 1t0;a ro3ol;fern#do,jose del monte,p0;ab*,edR;a3h1)rto pr$ce0;sa;!ilipp$e0l,st,t;! st#dard,s;(diTnal#oy,r#aq),s0;ay,ig;*n(po,rmoc;(,votS;a0eycauayPunt$lupa;ba&cat,gugpo pob&ci4kati,l3n0riki6;da1sil$gN%mp0;ay;luyong,);ab0$gFol7;on;a2e(spi,i1uce0;na;ber%d,pa;pu &pu,s p4;l0mus;igDoiI;os;smar0v6;$C;a0ebu,o%bato;b2(y# de o1$6l0;amba,ooc7;ro;#atu5uy0;ao;a4$#2u0;d0tu2;%;!gon0;#;co1guio,t#g0;as;*d,or;geles,tipo0;*","Philippine"],"Nicosia":["true¦cy5e0;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;!p0;!rus","Eastern European","eu3"],"Novokuznetsk":["true¦!2;k3msk+\\a\\e,north asia,prokopyevsk,ru0;!ssia0;!n0;! federation;emerovo,rat","Krasnoyarsk"],"Novosibirsk":["true¦!2;msk+\\a\\e,no3ru0siber6;!ssia0;!n0;! federation;rth central as2v0;osibirsk0t;! standard;ia","Novosibirsk"],"Omsk":["true¦!2;msk+\\a\\d,oms3ru0;!ssia0;!n0;! federation;k0t;! standard","Omsk"],"Oral":["true¦!1:#:azakhstan;alm4k2west 0;asia,k#0;! standard;#0z;! western;a ata,t","West Kazakhstan"],"Pontianak":["true¦b5i3palangkaraya,tanjung pinang,w0;est0ib; b3ern indonesia0;! standard;d,ndonesia0;! western,n;orneo","Western Indonesia"],"Pyongyang":["true¦chongjin,dpFhAk4mangyongdae ri,n2pFs0wonB;ariwon0eoul,inuiDunc8;! si;ampo,orth korea0;!n;a2orea0p,st;! north,n0;! standard;e0nggye;c0so4;hon;a1ungnam,ye0;san;e1mhu0;ng;ju;rk","Korean"],"Qatar":["true¦a2doha,kuwait,qa0riyadh;!t0;!ar;r0st; rayyan,ab0;!i0;a0c;!n0;! standard","Arabian"],"Qostanay":["true¦!1:#$:stan,azakh;a3central asia,east k$#2k0;$#0o#ay,z;! eastern;! #dard;lmt,#a","East Kazakhstan"],"Qyzylorda":["true¦!1:#:azakhstan;alm6k2west 0;asia,k#0;! standard;#2yzyl1z0;!yl 0;orda;! western;a ata,t","West Kazakhstan"],"Riyadh":["true¦aFburMdammam,haEibb,jeddNkCm9najran,s5ta3y0;anbu,e0;!m0;!en;buk,i0;f,z;a0ultanHyot;!naa,udi0;! arabia0;!n;a1e0ukalla;cca,dina;dinBkkB;hamis mush0uw0;ait;far al batin,il;bha,l 4rab0st;!i0;a0c;!n0;! standard;ahmadi,hu0jubayl,kharj,mubarraz;d0fuf;ayd0;ah","Arabian"],"Sakhalin":["true¦!2;msk+\\a\\i,ru3sak0yuzhno sakhalinsk;halin0t;! 0;island,standard;!ssia0;!n0;! federation","Sakhalin"],"Samarkand":["true¦bukhara,nukus,qarshi,uz0;!bekistan0t;! 0;standard,west","Uzbekistan"],"Seoul":["true¦!1:#$%&(:an,ng,eo, korea,ju;#TbuQchLdaeKgGhwas%UiFjeEkAm9p8r7s3u2woNy0;#g0%su;(,sP;ij%$buSlsO;e2outh&1u0;nHwK;!n;joCo$namO;epublic of&,ok;ohaAy%$taek;asHokpo;imhae,or0r,st,w#gmyo8;!ea0;! south,n0;! st#dard;(,o8;cCksBn6;#gneu2oyaDu1w#g0;(,my%1;mi,ns8riC;$;gu,je4;#gw3%n2i1un0;che2;n(;#,g(6;on;c1s0;#;h%n2;s#1ya0;$0; si","Korean"],"Shanghai":["true¦:!1:#$%&()*+-./<=>?@[]^_`~:gn,na,uh,oa,au,ij,hc,ug,ad,ab,eh,il,iq,hz,ne,ay,ix,uy,ia,uw,ul,hs;0:4G;1:4J;2:5M;3:4O;a5Sbaq$lu,crp,dr-$ts a5Re5C#2Yi1Zn0Fo05r03sodro,t00u4;b#eb,d#Yfn],gXhW=Vo9p6q 5s$g,wi0Uy4;g08n1;a%$ux i~ uoka5G$+g32;#4n1;a4=;%,y;d4Aguot1T>9k6t4;$4&b;~,t;a59/&l,#5^h,$+,u4;d-,o2;iy,oh;-,eI#FiCn7o5u4;f,hG<,l,q,s,w,x;a4b,u0;*,);a7e5i4;b,j,q,x;h4w;c,z;g,l,t,uq,w,y;a5em,*,j,p,u4;g,h,s;l,t;a4e2),oy;c,h4+,y;!c,z;!d,h;gH$;sg56_;#at,$h;e*,ip;c5kh,oh4sc;hPn<1;!irtsid %o`;a4iubn`%,un $y.;h==,l^h;a7b6u4;~#@,lg7s.,tup,z4;g2F&3;#in,iz;d7>ir,i5rg4t05;$0;lg4Pq4;$n,`;#4`%;a%n=,=;aQc,eK*,iColdnBu4;c7h4;c5s4;$,uf;g4Kiy;/5#4;atg1Nod;!^t;oh;b9j$8l6mn1xuf,y4;a%,#4i.;a3ip;i4];j,+;it,p;i4rah;al,y;fn<,>6m4;a1#4%;a3);ed#3n4;(g#e* 4e0;a[n<,#@J;@,dnZgXhMiGnD&b,tgCu5y4;#ol,i0;g9*8l,q7y4;/,#5^4&<,+;k,t;(g,i2Q;#@,u3;/,g3Ris,niy,_;g1M&0;$1;a5i4%;a%,ew,j;b,y;aId7eb,j6l-,qus,t5ur,x4;!n7;up;!uf;amu2#af4;aw;s4_;@#(0eC#8i7n5o4uo2;.,f;a4ew,),uk;!am,<,p;.,em,uzi0;a6i5o4;>,l,t;dg1Zq;t,%;h,l;n4&1;(g,);ah;aTbSc],dQeNgre $l%,hLjJlIm&g,qHsuma3%Cx8y5zg4;?m;#5n4;i0Zuz;a*,[;#6i5?b,u4;p,w;al,c,j;a3id;n1s4ux;#Ii6$4;i4pu<;j,t;l,s,y;i0muru;#e0+;#oy,n4&b;@;cAs4zg2M;a0g1R$%cg2I;b5f8w4;#o2$0_;a2^%;n1u4;ol;/;h6t4;#1n4u3;@,[;#6ie5nZu4;>,w;b,w;=,o4;d4=;!-;a07eWiCo4;dAgiz,h6[%c,ln5s_,t4;-,nR&2;];cnPz4;.,g5n4&<,_;ah,);?*;#(g,nIup;dMjJlGmDnAp7q6x5y4;gOu1;a3iy,&0;-,gC$,&2;is,$5o4;ag;n,];g1Pi5$4up;[,n,w;j,us,x;g5n4&m;as,uk;no*;eit,#5$#[4;-;),ot;i5n4uq;an;eb;a3&b;fiDh4;c5sg4;nod; u2am,i8n5&<,u4;>,oz;a4),];h,u4y;l,x;a4ef;b,h;ak,*;c0Af08g05hZiLk$,uFy4;eD#CiBn8o5u4;f,p;a4`;h4<,z;c,s;a4e0[;!i4n;m,x;al,+,y,z;a1/,=;d,),];g7h4;g5z4;a)i0&z;?f;#Kuo0;~;j9l7x4;#5n1;[;ef,ip,o2;-,g4`;nip;#9i8n5&3u3;);a4e2);dum,>,i4;l,q;en,>,l;@,o4;h,s;c5n4;im;-,i6n5u4;w,x;an,ew;x,y;aI/,g5i4n]$9;+;$T;#4iew;al;i5n4;<;at;d#HhC)9s7ux6y5z4;/,#ep;-,g9;_;eEi4;.;a4ib;)g4;$2;#6^t5nHo4;`;=;(2od;>;aEeEin;niD;dD~gB[?mnAko9niCsa9%4ynA;g7i5n4;(x,);a4>$p,us;%;not;hl;as;$4;*;$","China"],"Singapore":["true¦!1:#$%&(:an,la,ta,ar, pu;bukit rahm#(tBiAk6mu5p4s0%m# pe%li8woodl#ds;e2g1ingapore0;! st#d&d,#;!p,t;$y#g b&u u%7%pak;asir guda3elento3ucho3;&,kim($i;ampung 2lua1o% 0ua$ lumpur;dam#sa3kua$ muda;ng;k#gk& teberau,$rkin $ma;ndonesia central,sk#d&(teri;ra","Singapore"],"Srednekolymsk":["true¦!2;chokurdakh,msk+\\a\\i,ru5s0;akha 2re0;dnekolymsk0t;! standard;(e)0e0; north kuril is;!ssia0;! 1n0;! federation;time z0z0;one \\b\\a","Srednekolymsk"],"Taipei":["true¦banqiao,cst,fengsh9h8k6new taipei,roc,t0;a1w0;!n;i0oyu6;ch3n5pei1wan0;!ese;! standard;aohsi0eel0;ung;sinchu,ualien;an","Taipei"],"Tashkent":["true¦andij5namangan,qo4uz0yunusobod;!b0t;!ekistan0;! 0;east,standard; q0q0;on","Uzbekistan"],"Tbilisi":["true¦ge0kutaisi;!o0t;!rgia0;! standard,n","Georgia"],"Tehran":["true¦:!1:#$%&():ba,ri,hs,ma,na,ra;dWhSirUjaQkaOlLmKnAr5s4t3yw04z0;a1ir0;#t,hP;$6vha;dW%ar,sW;ab# )dnIdF;a2eyalWha%0i,u#%yen; inyemXdaza,&0;lse,rrW;irha0vezbL;%;a1i0$;&)v,vzD;d4grog,h2iMj1kub,mI$0;! fo cilbuper ci&l2;n3$s;af0sB;si;a1eh0;az;#,&h;oq;i#d),o0;b0&;ab;hcr0);aq;d(n3r0;ak;a%(m2c(rb dagarsap,e0;v0yimuro;as;rek;a4(j$b,r0zay;ad(ts 1ejur0unj0;ob;(0;$;#1h%0;am;faj1&rr0)z1;ohk;an","Iran"],"Thimphu":["true¦b0;hutan1t0;!n;! standard","Bhutan"],"Tokyo":["true¦:!1:#$%&()*+-./<=>:ihs,ih,us,am,hc,at,ot,ok,im,ag,as,uk,uf,ak;0:1L;1:1R;a0Ddradn)s 0Be04iJnHo9pj,t8u2;f5hsuyk)ik,k4st2z&un;&a2eoj,o;k),mah;ajner-0ujn1G;ig,o2;(,k;dj,sj;ay,bes/,du8(noh,jna,m#oega,n6r5t2;anG-,o2;k,m2yk;&Vu5;#Uopp/;a2oy;g1k1;st&;a2pj;knir-an8pV;aLg%ta,hEjCk4m2romoa;a2uzi;nig%,ti;a2esonom0Z#arL%t0S;rabi,s4wi,za2;ko,y2;-;a2or$;g2k),w0;a2$c;ma,n;em$,oEu2;!f;c6s2; 4a2;b2h0Tka;)i,e&;ar1i<=,oyk* 09=ig;a2i>0H+,u5;da,mnoh o(aw.+0t$;dnGg8k/,m+&*;b6hon4mur3o2r3se8tad+5w.ode;gaw0;<;$c2;ah;>2+;%0;nap2;aj;b0Kd0Hh1kYmLrItCw7y2;.4-on2og1;$2%tu;ci,sU;)2#O;es;a2#0;ga4k$3sij=,z2;an0or+*;/a,ci;nYyen;a5i3o2;!y*;k2o,%;!a;g2kP;&ay,iH;a2<D;hi2wado;a,(i,m.B;a5#2;o3<2;*,=;g0rQt;h7ti6y2;>4ir3*,u2;kJstS;+;aw,o;/; ay-on2oB;#2;in;aE#%t0o9u2;s5z2;ar2%;>2;);o3t2;arA;koy;.1irom,s,u2;k3z2;#;=;>;n4so2;!#.2;$;oy2;*;an;aw#3$c2;&;ik;i2<%t;(","Japan"],"Tomsk":["true¦!2;msk+\\a\\e,omst,ru0tomsk;!ssia0;!n0;! federation","Tomsk"],"Ulaanbaatar":["true¦m2ula0;anbaatar0n bator,t;! standard;n1ongolia0;!n;!g","Ulaanbaatar"],"Ust-Nera":["true¦!2;msk+\\a\\h,oymyakonsky,ru2vla0;divostok0t;! standard;!ssia0;!n0;! federation","Vladivostok"],"Vladivostok":["true¦!2;amur river,k6msk+5ru2vla0;divostok0t;! standard;!ssia0;!n0;! federation;\\a\\h,\\e;habarovsk0omsomolsk on amur;! vtoroy","Vladivostok"],"Yakutsk":["true¦!2;blagoveshchensk,lena river,msk+\\a\\g,ru2yak0;t,utsk0;! standard;!ssia0;!n0;! federation","Yakutsk"],"Yangon":["true¦b5hlaingthaya,k4m0nay pyi taw,pathein,sittwe;a2eiktila,m1onywa,yanmar0;! standard;!r,t;ndalay,wlamyine;alemyo,yain seikgyi township;ago,urm0;a,ese","Myanmar"],"Yekaterinburg":["true¦!2;!1:#$%:urg,ateri,sk;chelyabinCek$BkAm9nizhn8or7perm,ru4s3tyumen,u2yek0zlatoust;$nb#0t;! standard;fa,rals;terlitamak,#ut;!ssia0;!n0;! federation;e3%;evartov3y tagil;agnitogor2%+\\a\\c;amen% ural%iy,#an;nb#;%","Yekaterinburg"],"Yerevan":["true¦a0caucasus;m2rm0;!enia0;! standard,n;!t","Armenia"]},"Atlantic":{"Azores":["true¦azo2hmt,p0;ortug0t;al,uese;res0st,t;! s0;tandard,ummer","Azores","eu0"],"Bermuda":["true¦:adumreb,citnalta2dradnats1mb,t0umb;a,da,hgilyad0sa; citnalta;! su","Atlantic","usa"],"Canary":["true¦canary islands,es,las palmas de gran canaria,s4we0;st0t;!ern european0;! s0;tandard,ummer;anta cruz de tenerife,pa0;in,nish","Western European","eu1"],"Cape_Verde":["true¦c0;a1pv,v0;!t;bo verde1pe verde0;! standard;! is","Cape Verde"],"Faroe":["true¦f4we0;st0t;!ern european0;! s0;tandard,ummer;aroe islands,o,ro","Western European","eu1"],"Madeira":["true¦madeira islands,p4we0;st0t;!ern european0;! s0;tandard,ummer;ortug0t;al,uese","Western European","eu1"],"Reykjavik":["true¦g3i0utc,zulu;celand1s0;!l;!ic;mt,reenwich0;! 0;mean,standard","Greenwich"],"South_Georgia":["true¦gs3s0;gs,outh 0;georgia0sandwich;! standard;!t","South Georgia"],"Stanley":["true¦f0;alkland1k0lk;!st,t;! island0;!s0;! standard","Falkland Islands"]},"Australia":{"Adelaide":["true¦!1:#$:tral,cen;a3$0south 2; 1# aus#ia0;! standard;aus#ia;c6u0;!s0;! 3#ia0;! 2n0;! $#0;! daylight;$#;dt,st,t","Central Australia","aus"],"Brisbane":["true¦a2brisbane1gold0logan,queensland,sunshine0townsville; coa7;! standard;e5u0;!s0;!tralia0;!n0;! east0;!ern;st","Brisbane"],"Broken_Hill":["true¦!1:#$:tral,cen;a2$0yancowinna; aus#ia,# aus#ia0;! standard;c6u0;!s0;! 3#ia0;! 2n0;! $#0;! daylight;$#;dt,st","Central Australia","aus"],"Darwin":["true¦a0northern territory;cst,u0;!s0;! central,tralia0;!n0;! central0;! standard","Australian Central"],"Eucla":["true¦!1:#: central w;a0cw7;cw7u0;!s0;!#3tralia0;!n0;!#estern0;! standard;!e0;st;dt,st,t","Australian Central Western"],"Hobart":["true¦!1:#$%:east,tralia,ern;a1canberra,#% aus$0king island,tasmania;! standard;e7u0;!s0;! 3$0;! 2n0;! #0;!% daylight;#0;!%;dt,st,t","Eastern Australia","aus"],"Lindeman":["true¦a1brisbane0whitsunday islands;! standard;est,u0;!s0;!tralia0;!n","Brisbane"],"Lord_Howe":["true¦au4l0;h2ord howe0;! 0;daylight,island,standard;dt,st,t;!s0;!tralia0;!n","Lord Howe","lhow"],"Melbourne":["true¦!1:#$%:east,tralia,ern;a1canberra,#% aus$0geelong;! standard;e7u0;!s0;! 3$0;! 2n0;! #0;!% daylight;#0;!%;dt,st,t","Eastern Australia","aus"],"Perth":["true¦!1:#$:tralia,st;a4w0; 2e$0; 1ern aus#0;! $andard;aus#;u1w0;dt,$,t;!s0;! 3#0;! 2n0;! we$0;!e1;we$e0;rn","Western Australia"],"Sydney":["true¦!1:#$%:ast,tral,ern;a2cen$ co#,e#% aus$ia1new0wollongong; south wales,c#le;! standard;e8u0;!s0;! 4$ia0;! 3n0;! e#0;!%0;! daylight;e#0;!%;dt,st,t","Eastern Australia","aus"]},"Etc":{"GMT":["true¦etc,g0;mt,reenwich0;! 0;mean,standard","Greenwich"],"UTC":["true¦:ct1lasrevinu0tcu,uluz;! detanidrooc;e,u","UTC"]},"Europe":{"Berlin":["true¦!1:#$%&:an,ur, ma,en;bNceHdDeBfr#kf$t am%in,g9ha7j6koln,leipzig,m3n$embeGs1w0;#dsbek,uppertB;j,tuttgart,valbard0;! j3;a1un0;ich,stG;lmo,nnheim;#%yI;mb$g0nnovD;! noD;erm#0oth&5;!y;ssD$ope c&tr0;al;e,ortmund,resdBu0;is0sseldorf;bu0;rg;ntral e$ope0st,t;!#0;! s0;t#da1umm0;er;rd;ielefeld,o2r0;em0ussels cop&hag&%drid paris;&;chum,nn","Central European","eu2"],"Simferopol":["true¦!2;aqmescit,bakhchysarai,crimea,m2sevastopol,u0yalta;a,krain0;e,ian;oscow2s0;d,k0t;!+\\a\\a;! standard","Moscow"],"Amsterdam":["true¦a9brussels copenhagen madrid paris,ce5dutch,e3groning4n1rotterdam,t0utrecht;he hague,ilburg;etherlands,l0;!d;indhov0urope central;en;ntral europe0st,t;!an0;! s0;tandard,ummer;lmere stad,mt","Central European","eu2"],"Andorra":["true¦a4brussels copenhagen madrid paris,ce0europe central;ntral europe0st,t;!an0;! s0;tandard,ummer;d,nd0;!orra","Central European","eu2"],"Astrakhan":["true¦!2;astrakhan,msk+\\a\\b,ru0;!ssia0;!n0;! federation","Astrakhan"],"Athens":["true¦e2gr0thessaloniki;!c,ee0;ce,k;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Belgrade":["true¦bCc5europe central,hr,m4n1pristErs,s0;erb5i,love2vn;is,o0;rth macedo0vi sad;nia;e,k,ontenegro;e2roat0;ia0;!n;ntral europe0st,t;!an0;! s0;tandard,ummer;a,osnia0russels copenhagen madrid paris;! herzegov0;ina","Central European","eu2"],"Brussels":["true¦antwerp9b5c0europe central,gent,liege;e0harleroi;ntral europe0st,t;!an0;! s0;tandard,ummer;e0mt,russels copenhagen madrid paris;!l0;!gi0;an,um;!en","Central European","eu2"],"Bucharest":["true¦!2;braAc9e4gala3iasi,oradea,ploies3ro1sector 0timisoara;\\d,\\g;!mania0u;!n;ti;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;luj napoca,onstanta,raiova;ila,sov","Eastern European","eu3"],"Budapest":["true¦b7ce3debrecen,europe central,hu0pest;!n0;!gar0;ian,y;ntral europe0st,t;!an0;! s0;tandard,ummer;russels copenhagen madrid paris,uda","Central European","eu2"],"Busingen":["true¦b6ce2de1europe central,german0saxony;!y;!u;ntral europe0st,t;!an0;! s0;tandard,ummer;avaria,russels copenhagen madrid paris","Central European","eu2"],"Chisinau":["true¦e3m0republic of mo1;d1o0;ldova;!a;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu2"],"Copenhagen":["true¦arhus,brussels copenhagen madrid paris,c1d0europe central;anish,enmark,k,nk;e0mt;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Dublin":["true¦ace,cork,dmt,e5g4i0limerick,tse,waterfo3;e,r0st;eland,ish0l;! standa0;rd;alway,mt,reenwich mean;dinburgh,ire","Irish","eu1"],"Gibraltar":["true¦b6ce2europe central,gi0;!b0;!raltar;ntral europe0st,t;!an0;! s0;tandard,ummer;dst,russels copenhagen madrid paris,st","Central European","eu2"],"Helsinki":["true¦!1:#$%:land,astern,urope;a8e3fi1t0vantaa;ampere,urku;!n0;!#,nish;$ e%1e0spoo,% e$;st,t;!an0;! s0;tandard,ummer;# is#s,x","Eastern European","eu3"],"Istanbul":["true¦:!1:#$%&:na,ra,ru,ne;a04d$d#ts yek03eZgXhWiQkOmurNnJpet#izag,r7s5t3u2y0;a$ska,e0;k01oktuvan$;lroc,n%bnityez,zudkilyeb;im5&kitIr0;t,uy&9;a0us$t;$m#marhak,vN;a7e4i0t,ut,ık2;hes2k1m0sekilD;zi;ab$yid;ata,ik2kasA;fulin,l0;&0veilech8;se;d2l0;gabarWi0ı0;cg4;eukseu,uksu;a0isBozbart,usmW;m0v;ayiQt0;ab;oc,uzre;a0erev5;nok,su;d&fezek4l1r0zag2;azapaKesyL;s1yeb0zi&d;#tlus;is;rem;itaf,sik6;i0ı0;zale;cemkeckuc8lakkirik,pet2yi0zbeg;k2#0;mso,rmu;kacnDl7;%t;f%9kayısr8#7$k6s4vonrob,y0;ak#c,hat2k1l1n0tal4;ala,ok;at3;uk;apta%m,in0%b;am;#;da;ak;i0ı0;ln0;as","Turkey"],"Kaliningrad":["true¦!2;baltiy6chernyakhov6e3msk-\\a\\b,ru0sovet6;!ssia0;!n0;! federation;astern europe0et,urope eastern;!an0;! standard;sk","Eastern European Standard"],"Kyiv":["true¦!1:#$%&:er,an,iv,urope;bila ts#kVch#SdMeHhorliG%$o fr$k%NkClBm8odes7p6r%ne,s4t#nopil,u1vinQz0;aporizhzhQhytomyr;a,kr0;!ain0;e,i$;alt%0umy;ka,sJ;oltaOravyi b#eh;a,sa;a0ykolayL;ki0riupol;i5yi5;utBvI;amy$ske,h1iev,r0;emenchuk,opyv1yvyy rih;arkF#son,mel0;nytskyy;vka;ast#n e&1e0& east#n;st,t;!$0;! s0;t$dard,umm#;ar3esna,nipro1onet0;sk;!vs0;kyi;nyts0;ya;kasy,ni0;h0vtsi;%;va","Eastern European","eu3"],"Kirov":["true¦!2;m3ru0;!ssia0;!n0;! federation;oscow2s0;d,k0t;!+\\a\\a;! standard","Moscow"],"Lisbon":["true¦!1:#:europe;amadora,# western,p4we0;st0t;! #,ern #an0;! s0;tandard,ummer;ort0rt,t;o,ug0;al0uese;! mainland","Western European","eu1"],"London":["true¦!1:#$%&()*+:ing,er,on ,st,an,re,en,ha;0:0P;a0Ob06c04d01eZgWhUiQj$sey,k#&%up%hull,lMmKnDoxVpB)ad#,s3tri&( da cun+,u2w1yH;arwick06igRolv$+9)x0K;k,nited k#dom;aint hel*a,heffield,o4t3u2w1;(5ind0;ffolk,nd$l(d,r)y,sVtt0;afPoke %t)nt;meVuth1;a2*d %1;sea;mpt0;ly1orts1)&0;mouth;ew5o1;r1tt#+mP;th1wE; y1amptonN;orkQ;ca&le1port;! up%tyne;(che&Ui1;dl(4lt%keynes;(caLdn,e2i1ut0;ncolnKv$V;e1ice&$F;ds;psw3sl1;e of m1#t0;(;ich;ampD$t1;fordC;b2l1mt,)at britaJu$nsR;asgow,ouce&$A;! eA;dinburgh,s1;sex;$by2o1udlM;rset;!sh5;a1ov*try,rawlJ;mbridge2rdiff;eGirElackCr3&,uck#+m1;sh1;i);adfo8e7i1;&9t1;a4ish1;! s1;t(da4umm1;$;in;nt;rd;po1;ol;k*head,m#1;+m;lfa&,xl1;ey;b$de*,rchway,sc*si0;on","British","eu1"],"Luxembourg":["true¦brussels copenhagen madrid paris,ce2europe central,lu0;!x0;!embourg;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Madrid":["true¦:!1:#$%&()*: ed ,na,al,ne,ra,la,et;aJciujtnom sHdCeBhsinGit(m Hl9n6o4pse,re3s1t0;ec,mew,sE;acel)v#*&up,e0i(p dirdam &gah&poc slessurb,ogrub;!lotsom,$gel,(&h#%acO;d$Dmmu9;ablib,d0giv;eivo,(p le )r(cP;a1iaps0ojig;! aic&L;ep5itsabes n9;a0ehc$barDledab8;enil daduic,rt&c eporue;c$mor,hcle,lpmaxie,p2t$ciFuqsA;ilod%G$lniam ni3(d$t0;s $ep0;orue )rtn0;ec;aps;tn0;as;daAg%am,i5llives,ml4n0r*norf %#zerej,ssarr*,zoga(z;%p %#oll*s2it%,ol0uroc a;ad0ecr0pm2;ab;ac;ap;c2r0;em0otiv/zi*sag;);&0rum;)v;$rg,rb%0;&uf","Central European","eu2"],"Malta":["true¦brussels copenhagen madrid paris,ce2europe central,m0;alt0lt,t;a,ese;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Minsk":["true¦b4h3m0viteb6;ahilyow,oscow1s0;d,k,t;! standard;omyel,rodna;abruy1elarus0lr,rest,y;!ian;sk","Moscow"],"Monaco":["true¦brussels copenhagen madrid paris,ce2europe central,m0;c0onaco;!o;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Moscow":["true¦!2;!1:#$%&()*-./:ro,ar,sk,os,er,an,no,ov,el,zh;$0Gb0Dc0Adz(/09fet,g#znyy,iv)-o,k01lipet%,mRnNor.,pKrCs7t5v2w su,y0z.e*grad;a0&hk$ oZ;#slavl,senevo;asylev%y &trI.ikiMladi1o0ykhi* /ulebW;logda,#ne/;kavkaz,mir;a0uUv(;g)#g,mbE;$06ev(3hakhty,molen%,ochi,t0yktyvkV; Oa0;ryy o%0v#p0;ol;nWodvX;&t- 5u1y0;azRbV;!s0;!sia0;!n0;! fed(ati1;na donu,on d0;on;e1odolX%0;-;nza,t#zavodV;a2i/n0-o#ssiyU;ekamTi0;y *vP;b(e/nyye ch.ny,lchik;a6dst,&cow2s0urmM;d,k0t;!+\\a\\a;! 0;$ea,st0; 0)d$d;pet(sburg;khachka1r0;i*;la;a2himki,&t#ma,ras*0urG;d0gv$gei%y;$;l1z0;);inin%5uga;vo;yy;in8;entraln1he0;boks$y,rep-ets;iy;.1ry0;)3;go#d;kh)g.1mav0;ir;%","Moscow"],"Oslo":["true¦b7ce3europe central,no1sj0;!m;!rw0;ay,egian;ntral europe0st,t;!an0;! s0;tandard,ummer;ergen,russels copenhagen madrid paris","Central European","eu2"],"Paris":["true¦bKceEeurope central,frBl9m7n5r3s0toulouF;aint 1t0; 0rasbourg;etienne;e0oman9;ims,nn1;ant0i7ormandy;es;ar0et,ontpelliB;ne la vallee,sei1;e havre,i0yon;lle;!a0ench;!n0;ce;ntral europe1rgy pontoi0st,t;se;!an0;! s0;tandard,umm0;er;ordeaux,russels copenhagen madrid paris","Central European","eu2"],"Prague":["true¦br8c1europe central,ostrava,pmt,s0;k,lovakia,vk;e2z0;!ech0;! republic,ia;ntral europe0st,t;!an0;! s0;tandard,ummer;no,ussels copenhagen madrid paris","Central European","eu2"],"Riga":["true¦e3kalt,l0;atvia1st,v0;!a;!n;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Rome":["true¦!1:#$%&:europe,an,ntral,ri;bJcE# ce%,floreDgenoa,itAm9naples,p6r5sicily,t3v0;a0eroL;!t0;!ic9;ar$3&este,u0;&n,sc$y;mt,oma7;a1ra0;to;dova,lermo;essiCil2;!al0;i0y;$;nce;at$6e0orsica;% #0st,t;!$0;! s0;t$dard,ummer;a&,olog2r0;esc0ussels copenhagen mad&d pa&s;ia;na","Central European","eu2"],"Samara":["true¦!2;izhevsk,msk+\\a\\b,ru4s1to0;gliatti on the volga,lyatti;am0yzran;ara0t;! standard,udmurtia;!ssia0;! 1n0;! federation;time z0z0;one \\d","Samara"],"Saratov":["true¦!2;balakovo,izhevsk,msk+\\a\\b,ru2sam0;ara0t;! standard;!ssia0;!n0;! federation","Samara"],"Sofia":["true¦b5e0imt,plovdiv,varna;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer;g2u0;lgaria0rgas;!n;!r","Eastern European","eu3"],"Stockholm":["true¦brussels copenhagen madrid paris,ce4europe central,goeteborg,malmoe,s0;e2we0;!d0;en,ish;!t;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"],"Tallinn":["true¦e0narva,tartu,viljandi;astern europe2e1stonia0urope eastern;!n;!st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Tirane":["true¦al4brussels copenhagen madrid paris,ce0europe central,tirana;ntral europe0st,t;!an0;! s0;tandard,ummer;!b0;!ania0;!n","Central European","eu2"],"Ulyanovsk":["true¦!2;msk+\\a\\b,ru0ulyanovsk;!ssia0;!n0;! federation","Ulyanovsk"],"Uzhgorod":["true¦e2ruthenia,u0;a,krain0;e,ian;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Vienna":["true¦a4brussels copenhagen madrid paris,ce0donaustadt,europe central,favoriten,graz,linz;ntral europe0st,t;!an0;! s0;tandard,ummer;t,u0;stria0t;!n","Central European","eu2"],"Vilnius":["true¦e4k3l0;ithuania1t0;!u;!n;aunas,laipeda;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Volgograd":["true¦!2;m5ru2st petersburg,vol0;t,zhsk0;iy,y;!ssia0;!n0;! federation;oscow2s0;d,k0t;!+\\a\\a;! standard","Moscow"],"Warsaw":["true¦bKcFeurope central,gBk9l6mokotAp3radMs2torun,wroc0zabrze,ło8;l0ł0;aw;osnowiec,zczec4;l,o0raga poludnie;l0znan;!and,ish;o1ubl0;in;dz;ato2iel3rak0;ow;d2li0;wi0;ce;ansk,ynia;e0zestochowa;ntral europe0st,t;!an0;! s0;tandard,ummer;i2russels copenhagen madrid paris,y0;dgoszcz,t0;om;alystok,elsko biala","Central European","eu2"],"Zaporozhye":["true¦e3luhansk2u0zaporizhia lugansk;a,krain0;e,ian;! east;astern europe1e0urope eastern;st,t;!an0;! s0;tandard,ummer","Eastern European","eu3"],"Zurich":["true¦brussels copenhagen madrid paris,c3europe central,geneve,li1swi0;ss,tzerland;!e0;!chtenstein;e0h;ntral europe0st,t;!an0;! s0;tandard,ummer","Central European","eu2"]},"Indian":{"Chagos":["true¦british indian ocean territory,i0;ndian 1o0;!t;chagos,ocean0;! standard","Indian Ocean"],"Christmas":["true¦c0;hristmas island1x0;!r,t;! standard","Christmas Island"],"Cocos":["true¦c0;c3ocos 0;island0keeling islands;!s0;! standard;!k,t","Cocos Islands"],"Kerguelen":["true¦!1:#$%:mcdonald,and,tarctic;aBfrench 3h1kerguelenst paulCtf0;!t;eard 0m;$ # is7iA#;southern0t2;! 0;an1t0;erritories;d an%1%0;! st$ard;! 0;l$s;msterdam0tf; i0;sl$","French Southern & Antarctic"],"Mahe":["true¦s0;c1eychelles0yc;! standard;!t","Seychelles"],"Maldives":["true¦m0;aldives1dv,v0;!t;! standard","Maldives"],"Mauritius":["true¦m0port louis;auritius1u0;!s,t;! standard","Mauritius"],"Reunion":["true¦re0;!t,union0;! standard","Réunion"]},"Pacific":{"Apia":["true¦!1:#:samoa;#4w0;est1s0;!m,t; #0ern #;! standard;! western","West Samoa"],"Auckland":["true¦christchurch,manukau,n0wellington;ew zealand1orth shore,z0;!dt,l,mt,st,t;! 0;daylight,standard","New Zealand","nz"],"Bougainville":["true¦bougainville,p0;apua new guinea,g0ng;!t","Bougainville"],"Chatham":["true¦cha2n0;ew zealand,z0;! chat;dt,st,t0;!ham0;! 0;daylight,islands,standard","Chatham","chat"],"Chuuk":["true¦chu2f0m1;ederated states of m0m;icronesia;t,uk0;! standard,/trukyap","Chuuk"],"Easter":["true¦c5e0;as0mt;st,t0;!er island0;! s0;tandard,ummer;hile0l;!an","Easter Island","east"],"Efate":["true¦v0;anuatu1u0;!t;! standard","Vanuatu"],"Fakaofo":["true¦t0;k1okelau0;! standard;!l,t","Tokelau"],"Fiji":["true¦f0;iji1j0;!i,st,t;! standard,an","Fiji"],"Funafuti":["true¦t0;uv1v0;!t;!alu0;! standard","Tuvalu"],"Galapagos":["true¦ec3gal0;apagos0t;! 0;islands,standard;!uador0;!ian","Galapagos"],"Gambier":["true¦!2;coordinated universal time-\\a\\j,french polynesia,gam1p0;f,yf;bier0t;! 0;islands,standard","Gambier"],"Guadalcanal":["true¦s0;b2lb,olomon0;! islands0;! standard;!t","Solomon Islands"],"Guam":["true¦ch4gu3m2northern mariana islands,port moresby,west0; 0ern 0;pacific;np,p;!am;amorro0st;! standard","Chamorro"],"Honolulu":["true¦!1:#$:leutian,merica;a7h3u0;nited states1s0;!a;! of a$;a0st;dt,st,t,waii0;! 0;a#,standard;#1$0;!n;! islands","Hawaii"],"Kanton":["true¦ki2pho0;enix islands0t;! standard;!ribati","Phoenix Islands"],"Kiritimati":["true¦ki2lin0;e islands0t;! standard;!r0;!i0;bati,timati island","Line Islands"],"Kosrae":["true¦f2kos0m3;rae0t;! standard;ederated states of m0m;icronesia","Kosrae"],"Kwajalein":["true¦m0;arshall islands1h0;!t;! standard","Marshall Islands"],"Majuro":["true¦m0;arshall islands1h0;!l,t;! standard","Marshall Islands"],"Marquesas":["true¦french polynesia,mar1p0;f,yf;quesas0t;! 0;islands,standard","Marquesas"],"Nauru":["true¦n0;auru1r0;!t,u;! standard","Nauru"],"Niue":["true¦n0;iu1u0;!t;!e0;! standard","Niue"],"Norfolk":["true¦n0;f3orfolk0;! island0;! 0;daylight,standard;!dt,k,t","Norfolk Island","aus"],"Noumea":["true¦n0;c1ew caledonia0;! standard;!l,t","New Caledonia"],"Pago_Pago":["true¦a2midway,s0;amoa0st;! standard;merican samoa,s","Samoa"],"Palau":["true¦p0;alau1lw,w0;!t;! standard","Palau"],"Pitcairn":["true¦!2;coordinated universal time3p0utc3;cn,itcairn0n,st;! 0;islands,standard;-\\a\\i","Pitcairn"],"Pohnpei":["true¦f3m4po0;hnpei/ponape,n0;ape0t;! standard;ederated states of m0m;icronesia","Ponape"],"Port_Moresby":["true¦dumont durville,p0;apua new guinea1g0ng;!t;! standard","Papua New Guinea"],"Rarotonga":["true¦c0;k3o0;k,ok0;! islands0;! standard;!t","Cook Islands"],"Tahiti":["true¦french polynesia,p2society islands,tah0;iti0t;! standard;f,yf","Tahiti"],"Tarawa":["true¦gil1ki0;!ribati;bert islands0t;! standard","Gilbert Islands"],"Tongatapu":["true¦nukualofa,to0;!n0t;!ga0;! standard","Tonga"],"Wake":["true¦u2wak0;e island0t;! standard;m3nited states m1s 0;m0o1;inor o0;utlying islands;!i","Wake Island"],"Wallis":["true¦w0;allis 1f0lf;!t;and futuna,futuna0;! standard","Wallis & Futuna"]}};

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
const lexicon = {};
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
  ['dst', ''],
  ['timezone', ''],
  ['savings', ''],
  // west/east/south/north
  ['west', 'western'],
  ['east', 'eastern'],
  ['south', 'southern'],
  ['north', 'northern'],
  ['western', 'west'],
  ['eastern', 'east'],
  ['southern', 'south'],
  ['northern', 'north'],
  // place-name cruft
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
  ['city', ''],
  ['township', ''],
  ['of', ''],
  ['the', ''],
  // generic place names
  ['region', ''],
  ['country', ''],
  ['county', ''],
  ['regional', ''],
  ['district', ''],
  ['province', ''],
  ['state', ''],
  ['metro', ''],
  ['greater', ''],
  ['metropolitan', ''],
  ['area', '']
];

const maxCandidates = 96;
const clean = (value) => value.toLowerCase().split(' ').filter(Boolean).join(' ');
const ignored = new Set(replacements.filter(([, to]) => !to).map(([from]) => from));

const getAlternatives = (input, includeWords = true) => {
  const name = clean(input);
  const candidates = new Set();
  const add = (value) => {
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
    phrases.forEach((phrase) => phrase.split(' ').forEach(add));
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
var metas = {"British Columbia":{"name":"British Columbia Time","std":["MST",-7,"Mountain Standard Time"],"long":"(UTC-07:00) British Columbia"},"Alberta and Northwest Territories":{"name":"Alberta and Northwest Territories Time","std":["CST",-6,"Central Standard Time"],"long":"(UTC-06:00) Alberta and Northwest Territories"},"Manitoba":{"name":"Manitoba Time","std":["EST",-5,"Eastern Standard Time"],"long":"(UTC-05:00) Manitoba"},"Ulyanovsk":{"std":["+04",4,"Ulyanovsk Time"]},"Astrakhan":{"std":["+04",4,"Astrakhan Time"]},"Tomsk":{"std":["+07",7,"Tomsk Time"]},"Syria":{"std":["+03",3,"Syria Time"]},"Jordan":{"std":["+03",3,"Jordan Time"]},"Bougainville":{"std":["+11",11,"Bougainville Time"]},"Magallanes":{"std":["-03",-3,"Magallanes Time"],"long":"(UTC-03:00) Punta Arenas"},"Galapagos":{"std":["GALT",-6],"long":"(UTC-06:00) Galapagos Islands"},"Hawaii":{"name":"Hawaii Time","std":["HST",-10,"Hawaii Standard Time"],"long":"(UTC-10:00) Hawaii"},"UTC":{"name":"Coordinated Universal Time","std":["UTC",0,"Coordinated Universal Time"],"long":"(UTC+00:00) Coordinated Universal Time"},"Aysen":{"name":"Aysen Time","std":["-03",-3,"Aysen Time"],"long":"(UTC-03:00) Coyhaique"},"Palmer":{"std":["-03",-3,"Palmer Time"],"long":"(UTC-03:00) Palmer"},"Xinjiang":{"std":["+06",6,"Xinjiang Time"],"name":"Xinjiang Time","long":"(UTC+06:00) Xinjiang Time"},"India":{"std":["IST",5.5],"long":"(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi"},"China":{"std":["CST",8],"long":"(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi"},"Central European":{"std":["CET",1],"dst":["CEST",2,"Central European Summer Time"],"long":"(UTC+01:00) Brussels, Copenhagen, Madrid, Paris"},"Atlantic":{"std":["AST",-4],"dst":["ADT",-3],"long":"(UTC-04:00) Atlantic Time (Canada)"},"Greenwich":{"std":["GMT",0],"long":"(UTC) Coordinated Universal Time"},"Eastern European":{"std":["EET",2],"dst":["EEST",3,"Eastern European Summer Time"]},"Central":{"std":["CST",-6],"dst":["CDT",-5],"long":"(UTC-06:00) Central Time (US & Canada)"},"Eastern":{"std":["EST",-5],"dst":["EDT",-4],"long":"(UTC-05:00) Eastern Time (US & Canada)"},"Argentina":{"std":["ART",-3],"long":"(UTC-03:00) City of Buenos Aires"},"East Africa":{"std":["EAT",3],"long":"(UTC+03:00) Nairobi"},"West Africa":{"std":["WAT",1],"long":"(UTC+01:00) West Central Africa"},"Moscow":{"std":["MSK",3],"long":"(UTC+03:00) Moscow, St. Petersburg"},"Brasilia":{"std":["BRT",-3],"long":"(UTC-03:00) Brasilia"},"Mountain":{"std":["MST",-7],"dst":["MDT",-6],"long":"(UTC-07:00) Mountain Time (US & Canada)"},"Central Africa":{"std":["CAT",2],"long":"(UTC+02:00) Windhoek"},"Arabian":{"std":["AST",3],"long":"(UTC+03:00) Kuwait, Riyadh"},"Alaska":{"std":["AKST",-9],"dst":["AKDT",-8],"long":"(UTC-09:00) Alaska"},"British":{"std":["GMT",0],"dst":["BST",1,"British Summer Time"],"long":"(UTC+00:00) Dublin, Edinburgh, Lisbon, London"},"Irish":{"std":["GMT",0,"Greenwich Mean Time"],"dst":["IST",1,"Irish Standard Time"]},"West Kazakhstan":{"std":["ALMT",5],"long":"(UTC+05:00) Ashgabat, Tashkent"},"Eastern Australia":{"std":["AEST",10],"dst":["AEDT",11,"Australian Eastern Daylight Time"],"long":"(UTC+10:00) Canberra, Melbourne, Sydney"},"Western European":{"std":["WET",0],"dst":["WEST",1,"Western European Summer Time"]},"Indochina":{"std":["ICT",7],"long":"(UTC+07:00) Bangkok, Hanoi, Jakarta"},"Central Mexico":{"long":"(UTC-06:00) Guadalajara, Mexico City, Monterrey","std":["CST",-6]},"South Africa":{"std":["SAST",2],"long":"(UTC+02:00) Harare, Pretoria"},"Krasnoyarsk":{"std":["KRAT",7],"long":"(UTC+07:00) Krasnoyarsk"},"Yakutsk":{"std":["YAKT",9],"long":"(UTC+09:00) Yakutsk"},"Pacific":{"std":["PST",-8],"dst":["PDT",-7],"long":"(UTC-08:00) Pacific Time (US & Canada)"},"Amazon":{"std":["AMT",-4],"long":"(UTC-04:00) Cuiaba"},"Morocco":{"long":"(UTC+00:00) Casablanca","std":["+00",0]},"Gulf":{"std":["GST",4],"long":"(UTC+04:00) Abu Dhabi, Muscat"},"Samara":{"std":["SAMT",4],"long":"(UTC+04:00) Izhevsk, Samara"},"Uzbekistan":{"std":["UZT",5]},"East Kazakhstan":{"std":["ALMT",5],"long":"(UTC+05:00) Astana"},"Omsk":{"std":["OMST",6],"long":"(UTC+06:00) Omsk"},"Western Indonesia":{"std":["WIB",7]},"Ulaanbaatar":{"std":["ULAT",8],"long":"(UTC+08:00) Ulaanbaatar"},"Malaysia":{"std":["MYT",8]},"Korean":{"std":["KST",9],"long":"(UTC+09:00) Seoul"},"Central Australia":{"std":["ACST",9.5],"dst":["ACDT",10.5,"Australian Central Daylight Time"],"long":"(UTC+09:30) Adelaide"},"Brisbane":{"std":["AEST",10]},"Vladivostok":{"std":["VLAT",10],"long":"(UTC+10:00) Vladivostok"},"Chamorro":{"std":["ChST",10],"long":"(UTC+10:00) Guam, Port Moresby"},"Papua New Guinea":{"std":["PGT",10]},"New Zealand":{"std":["NZST",12],"dst":["NZDT",13],"long":"(UTC+12:00) Auckland, Wellington"},"Marshall Islands":{"std":["MHT",12]},"Samoa":{"std":["SST",-11],"long":"(UTC-11:00) American Samoa"},"Mexican Pacific":{"std":["HNPMX",-7],"long":"(UTC-07:00) Hermosillo, La Paz, Mazatlan"},"Colombia":{"std":["COT",-5]},"Acre":{"std":["ACT",-5]},"Chile":{"std":["CLT",-4],"dst":["CLST",-3,"Chile Summer Time"]},"Troll":{"std":["GMT",0],"dst":["+02",2,"Troll Summer Time"]},"East Greenland":{"std":["EGT",-2],"dst":["EGST",-1,"East Greenland Summer Time"]},"Israel":{"std":["IST",2],"dst":["IDT",3],"long":"(UTC+02:00) Jerusalem"},"Turkey":{"std":["TRT",3],"long":"(UTC+03:00) Istanbul"},"Iran":{"std":["IRST",3.5],"long":"(UTC+03:30) Tehran"},"Azerbaijan":{"std":["AZT",4],"long":"(UTC+04:00) Baku"},"Georgia":{"std":["GET",4],"long":"(UTC+04:00) Tbilisi"},"Armenia":{"std":["AMT",4],"long":"(UTC+04:00) Yerevan"},"Seychelles":{"std":["SCT",4]},"Mauritius":{"std":["MUT",4],"long":"(UTC+04:00) Port Louis"},"Réunion":{"std":["RET",4]},"Afghanistan":{"std":["AFT",4.5],"long":"(UTC+04:30) Kabul"},"Mawson":{"std":["MAWT",5]},"Turkmenistan":{"std":["TMT",5]},"Tajikistan":{"std":["TJT",5]},"Pakistan":{"std":["PKT",5],"long":"(UTC+05:00) Islamabad, Karachi"},"Yekaterinburg":{"std":["YEKT",5],"long":"(UTC+05:00) Ekaterinburg"},"French Southern & Antarctic":{"std":["TFT",5]},"Maldives":{"std":["MVT",5]},"Nepal":{"std":["NPT",5.75],"long":"(UTC+05:45) Kathmandu"},"Vostok":{"std":["+05",5]},"Kyrgyzstan":{"std":["KGT",6]},"Bangladesh":{"std":["BST",6],"long":"(UTC+06:00) Dhaka"},"Bhutan":{"std":["BT",6]},"Indian Ocean":{"std":["IOT",6]},"Myanmar":{"std":["MMT",6.5],"long":"(UTC+06:30) Yangon (Rangoon)"},"Cocos Islands":{"std":["CCT",6.5]},"Davis":{"std":["DAVT",7]},"Hovd":{"std":["HOVT",7],"long":"(UTC+07:00) Hovd"},"Novosibirsk":{"std":["NOVT",7],"long":"(UTC+07:00) Novosibirsk"},"Christmas Island":{"std":["CXT",7]},"Brunei Darussalam":{"std":["BNT",8]},"Hong Kong":{"std":["HKT",8]},"Irkutsk":{"std":["IRKT",8],"long":"(UTC+08:00) Irkutsk"},"Central Indonesia":{"std":["WITA",8]},"Philippine":{"std":["PHST",8]},"Singapore":{"std":["SGT",8],"long":"(UTC+08:00) Kuala Lumpur, Singapore"},"Taipei":{"std":["CST",8],"long":"(UTC+08:00) Taipei"},"Western Australia":{"std":["AWST",8],"long":"(UTC+08:00) Perth"},"Australian Central Western":{"std":["ACWST",8.75],"long":"(UTC+08:45) Eucla"},"East Timor":{"std":["TLT",9]},"Eastern Indonesia":{"std":["WIT",9]},"Japan":{"std":["JST",9],"long":"(UTC+09:00) Osaka, Sapporo, Tokyo"},"Palau":{"std":["PWT",9]},"Australian Central":{"std":["ACST",9.5]},"Chuuk":{"std":["CHUT",10]},"Lord Howe":{"std":["LHST",10.5],"dst":["LHDT",11],"long":"(UTC+10:30) Lord Howe Island"},"Casey":{"std":["CAST",8]},"Magadan":{"std":["MAGT",11],"long":"(UTC+11:00) Magadan"},"Sakhalin":{"std":["SAKT",11],"long":"(UTC+11:00) Sakhalin"},"Srednekolymsk":{"std":["SRET",11],"long":"(UTC+11:00) Chokurdakh"},"Vanuatu":{"std":["VUT",11]},"Solomon Islands":{"std":["SBT",11]},"Kosrae":{"std":["KOST",11]},"New Caledonia":{"std":["NCT",11]},"Ponape":{"std":["PONT",11]},"Anadyr":{"std":["ANAT",12],"long":"(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky"},"Petropavlovsk-Kamchatski":{"std":["PETT",12],"long":"(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky"},"Fiji":{"std":["FJT",12],"long":"(UTC+12:00) Fiji"},"Tuvalu":{"std":["TVT",12]},"Nauru":{"std":["NRT",12]},"Norfolk Island":{"std":["NFT",11],"dst":["NFDT",12],"long":"(UTC+11:00) Norfolk Island"},"Gilbert Islands":{"std":["GILT",12]},"Wake Island":{"std":["WAKT",12]},"Wallis & Futuna":{"std":["WFT",12]},"Chatham":{"std":["CHAST",12.75],"dst":["CHADT",13.75],"long":"(UTC+12:45) Chatham Islands"},"West Samoa":{"std":["WST",13]},"Phoenix Islands":{"std":["PHOT",13]},"Tokelau":{"std":["TKT",13]},"Tonga":{"std":["TOT",13],"long":"(UTC+13:00) Nuku'alofa"},"Line Islands":{"std":["LINT",14],"long":"(UTC+14:00) Kiritimati Island"},"Niue":{"std":["NUT",-11]},"Cook Islands":{"std":["CKT",-10]},"Tahiti":{"std":["TAHT",-10]},"Marquesas":{"std":["MART",-9.5],"long":"(UTC-09:30) Marquesas Islands"},"Aleutian":{"std":["HST",-10],"dst":["HDT",-9,"Hawaii Daylight Time"]},"Gambier":{"std":["GAMT",-9],"long":"(UTC-09:00) Coordinated Universal Time-09"},"Pitcairn":{"std":["PST",-8],"long":"(UTC-08:00) Coordinated Universal Time-08"},"Easter Island":{"std":["EAST",-6],"dst":["EASST",-5,"Easter Island Summer Time"],"long":"(UTC-06:00) Easter Island"},"Ecuador":{"std":["ECT",-5]},"Cuba":{"std":["HNCU",-5],"dst":["HECU",-4],"long":"(UTC-05:00) Havana"},"Peru":{"std":["PET",-5]},"Paraguay":{"std":["PYT",-3],"long":"(UTC-03:00) Asuncion"},"Venezuela":{"std":["VET",-4],"long":"(UTC-04:00) Caracas"},"Guyana":{"std":["GYT",-4]},"Bolivia":{"std":["BOT",-4]},"Newfoundland":{"std":["HNTN",-3.5],"dst":["HETN",-2.5],"long":"(UTC-03:30) Newfoundland"},"French Guiana":{"std":["GFT",-3]},"West Greenland":{"std":["WGT",-2],"dst":["WGST",-1,"West Greenland Summer Time"],"long":"(UTC-02:00) Greenland"},"St. Pierre & Miquelon":{"std":["HNPM",-3],"dst":["HEPM",-2],"long":"(UTC-03:00) Saint Pierre and Miquelon"},"Uruguay":{"std":["UYT",-3],"long":"(UTC-03:00) Montevideo"},"Suriname":{"std":["SRT",-3]},"Falkland Islands":{"std":["FKST",-3]},"Fernando de Noronha":{"std":["FNT",-2]},"South Georgia":{"std":["GST",-2]},"Azores":{"std":["AZOT",-1],"dst":["AZOST",0,"Azores Summer Time"],"long":"(UTC-01:00) Azores"},"Cape Verde":{"std":["CVT",-1],"long":"(UTC-01:00) Cabo Verde Is."},"Central European Standard":{"name":"Central European Time","std":["CET",1,"Central European Standard Time"],"long":"(UTC+01:00) Central European Standard Time"},"Eastern European Standard":{"name":"Eastern European Time","std":["EET",2,"Eastern European Standard Time"],"long":"(UTC+02:00) Eastern European Standard Time"},"Atlantic Standard":{"name":"Atlantic Time","std":["AST",-4,"Atlantic Standard Time"],"long":"(UTC-04:00) Atlantic Standard Time"},"Central Standard":{"name":"Central Time","std":["CST",-6,"Central Standard Time"],"long":"(UTC-06:00) Central Standard Time"},"Mountain Standard":{"name":"Mountain Time","std":["MST",-7,"Mountain Standard Time"],"long":"(UTC-07:00) Mountain Standard Time"},"Eastern Standard":{"name":"Eastern Time","std":["EST",-5,"Eastern Standard Time"],"long":"(UTC-05:00) Eastern Standard Time"}};

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
