var ne = Object.defineProperty;
var ie = (h, t, e) => t in h ? ne(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var k = (h, t, e) => ie(h, typeof t != "symbol" ? t + "" : t, e);
const R = { exec: () => null };
function g(h, t = "") {
  let e = typeof h == "string" ? h : h.source;
  const n = {
    replace: (l, i) => {
      let a = typeof i == "string" ? i : i.source;
      return a = a.replace(d.caret, "$1"), e = e.replace(l, a), n;
    },
    getRegex: () => new RegExp(e, t)
  };
  return n;
}
const d = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (h) => new RegExp(`^( {0,3}${h})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (h) => new RegExp(`^ {0,${Math.min(3, h - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (h) => new RegExp(`^ {0,${Math.min(3, h - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (h) => new RegExp(`^ {0,${Math.min(3, h - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (h) => new RegExp(`^ {0,${Math.min(3, h - 1)}}#`),
  htmlBeginRegex: (h) => new RegExp(`^ {0,${Math.min(3, h - 1)}}<(?:[a-z].*>|!--)`, "i")
}, le = /^(?:[ \t]*(?:\n|$))+/, se = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, re = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, $ = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ae = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, P = /(?:[*+-]|\d{1,9}[.)])/, M = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ce = g(M).replace(/bull/g, P).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), oe = g(M).replace(/bull/g, P).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), O = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, he = /^[^\n]+/, T = /(?!\s*\])(?:\\.|[^\[\]\\])+/, ue = g(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", T).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), pe = g(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, P).getRegex(), y = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", v = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ge = g(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", v).replace("tag", y).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), j = g(O).replace("hr", $).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", y).getRegex(), fe = g(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", j).getRegex(), X = {
  blockquote: fe,
  code: se,
  def: ue,
  fences: re,
  heading: ae,
  hr: $,
  html: ge,
  lheading: ce,
  list: pe,
  newline: le,
  paragraph: j,
  table: R,
  text: he
}, D = g(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", $).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", y).getRegex(), be = {
  ...X,
  lheading: oe,
  table: D,
  paragraph: g(O).replace("hr", $).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", D).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", y).getRegex()
}, xe = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, me = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, F = /^( {2,}|\\)\n(?!\s*$)/, de = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, _ = /[\p{P}\p{S}]/u, I = /[\s\p{P}\p{S}]/u, H = /[^\s\p{P}\p{S}]/u, ke = g(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, I).getRegex(), U = /(?!~)[\p{P}\p{S}]/u, we = /(?!~)[\s\p{P}\p{S}]/u, Se = /(?:[^\s\p{P}\p{S}]|~)/u, Re = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, W = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, $e = g(W, "u").replace(/punct/g, _).getRegex(), ye = g(W, "u").replace(/punct/g, U).getRegex(), J = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", _e = g(J, "gu").replace(/notPunctSpace/g, H).replace(/punctSpace/g, I).replace(/punct/g, _).getRegex(), Ae = g(J, "gu").replace(/notPunctSpace/g, Se).replace(/punctSpace/g, we).replace(/punct/g, U).getRegex(), Ce = g(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, H).replace(/punctSpace/g, I).replace(/punct/g, _).getRegex(), Le = g(/\\(punct)/, "gu").replace(/punct/g, _).getRegex(), Be = g(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Pe = g(v).replace("(?:-->|$)", "-->").getRegex(), Te = g(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", Pe).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), K = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Ie = g(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", K).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), V = g(/^!?\[(label)\]\[(ref)\]/).replace("label", K).replace("ref", T).getRegex(), Y = g(/^!?\[(ref)\](?:\[\])?/).replace("ref", T).getRegex(), ze = g("reflink|nolink(?!\\()", "g").replace("reflink", V).replace("nolink", Y).getRegex(), ee = {
  _backpedal: R,
  // only used for GFM url
  anyPunctuation: Le,
  autolink: Be,
  blockSkip: Re,
  br: F,
  code: me,
  del: R,
  emStrongLDelim: $e,
  emStrongRDelimAst: _e,
  emStrongRDelimUnd: Ce,
  escape: xe,
  link: Ie,
  nolink: Y,
  punctuation: ke,
  reflink: V,
  reflinkSearch: ze,
  tag: Te,
  text: de,
  url: R
}, B = {
  ...ee,
  emStrongRDelimAst: Ae,
  emStrongLDelim: ye,
  url: g(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Ze = {
  ...B,
  br: g(F).replace("{2,}", "*").getRegex(),
  text: g(B.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, G = {
  normal: X,
  gfm: be
}, L = {
  normal: ee,
  gfm: B,
  breaks: Ze
};
function N(h, t) {
  var i;
  const e = h.replace(d.findPipe, (a, r, c) => {
    let o = !1, s = r;
    for (; --s >= 0 && c[s] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), n = e.split(d.splitPipe);
  let l = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !((i = n.at(-1)) != null && i.trim()) && n.pop(), t)
    if (n.length > t)
      n.splice(t);
    else
      for (; n.length < t; ) n.push("");
  for (; l < n.length; l++)
    n[l] = n[l].trim().replace(d.slashPipe, "|");
  return n;
}
function w(h, t, e) {
  const n = h.length;
  if (n === 0)
    return "";
  let l = 0;
  for (; l < n && h.charAt(n - l - 1) === t; )
    l++;
  return h.slice(0, n - l);
}
function qe(h, t) {
  if (h.indexOf(t[1]) === -1)
    return -1;
  let e = 0;
  for (let n = 0; n < h.length; n++)
    if (h[n] === "\\")
      n++;
    else if (h[n] === t[0])
      e++;
    else if (h[n] === t[1] && (e--, e < 0))
      return n;
  return -1;
}
function Q(h, t, e, n, l) {
  const i = t.href, a = t.title || null, r = h[1].replace(l.other.outputLinkReplace, "$1");
  if (h[0].charAt(0) !== "!") {
    n.state.inLink = !0;
    const c = {
      type: "link",
      raw: e,
      href: i,
      title: a,
      text: r,
      tokens: n.inlineTokens(r)
    };
    return n.state.inLink = !1, c;
  }
  return {
    type: "image",
    raw: e,
    href: i,
    title: a,
    text: r
  };
}
function Ee(h, t, e) {
  const n = h.match(e.other.indentCodeCompensation);
  if (n == null) return t;
  const l = n[1];
  return t.split(`
`).map((i) => {
    const a = i.match(e.other.beginningSpace);
    if (a === null)
      return i;
    const [r] = a;
    return r.length >= l.length ? i.slice(l.length) : i;
  }).join(`
`);
}
class Ge {
  constructor(t = {}) {
    k(this, "rules");
    k(this, "tokens");
    k(this, "state", {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    });
    k(this, "inlineQueue", []);
    this.options = t, this.tokens = [], this.tokens.links = {}, this.rules = {
      other: d,
      block: G.normal,
      inline: L.normal
    }, this.options.gfm && (this.rules.block = G.gfm, this.rules.inline = L.gfm, this.options.gfmLineBreaks && (this.rules.inline = L.breaks));
  }
  lex(t) {
    t = t.replace(d.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let e = 0; e < this.inlineQueue.length; e++) {
      const n = this.inlineQueue[e];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, e = [], n = !1) {
    var l;
    for (; t; ) {
      let i;
      if (i = this.space(t)) {
        t = t.substring(i.raw.length);
        const r = e.at(-1);
        i.raw.length === 1 && r !== void 0 ? r.raw += `
` : e.push(i);
        continue;
      }
      if (i = this.code(t)) {
        t = t.substring(i.raw.length);
        const r = e.at(-1);
        (r == null ? void 0 : r.type) === "paragraph" || (r == null ? void 0 : r.type) === "text" ? (r.raw += `
` + i.raw, r.text += `
` + i.text, this.inlineQueue.at(-1).src = r.text) : e.push(i);
        continue;
      }
      if (i = this.fences(t)) {
        t = t.substring(i.raw.length), e.push(i);
        continue;
      }
      if (i = this.heading(t)) {
        t = t.substring(i.raw.length), e.push(i);
        continue;
      }
      if (i = this.hr(t)) {
        t = t.substring(i.raw.length), e.push(i);
        continue;
      }
      if (i = this.blockquote(t)) {
        t = t.substring(i.raw.length), e.push(i);
        continue;
      }
      if (i = this.list(t)) {
        t = t.substring(i.raw.length), e.push(i);
        continue;
      }
      if (i = this.html(t)) {
        t = t.substring(i.raw.length), e.push(i);
        continue;
      }
      if (i = this.def(t)) {
        t = t.substring(i.raw.length);
        const r = e.at(-1);
        (r == null ? void 0 : r.type) === "paragraph" || (r == null ? void 0 : r.type) === "text" ? (r.raw += `
` + i.raw, r.text += `
` + i.raw, this.inlineQueue.at(-1).src = r.text) : this.tokens.links[i.tag] || (this.tokens.links[i.tag] = {
          href: i.href,
          title: i.title
        });
        continue;
      }
      if (i = this.table(t)) {
        t = t.substring(i.raw.length), e.push(i);
        continue;
      }
      if (i = this.lheading(t)) {
        t = t.substring(i.raw.length), e.push(i);
        continue;
      }
      let a = t;
      if ((l = this.options.extensions) != null && l.startBlock) {
        let r = 1 / 0;
        const c = t.slice(1);
        let o;
        this.options.extensions.startBlock.forEach((s) => {
          o = s.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (r = Math.min(r, o));
        }), r < 1 / 0 && r >= 0 && (a = t.substring(0, r + 1));
      }
      if (this.state.top && (i = this.paragraph(a))) {
        const r = e.at(-1);
        n && (r == null ? void 0 : r.type) === "paragraph" ? (r.raw += `
` + i.raw, r.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : e.push(i), n = a.length !== t.length, t = t.substring(i.raw.length);
        continue;
      }
      if (i = this.text(t)) {
        t = t.substring(i.raw.length);
        const r = e.at(-1);
        (r == null ? void 0 : r.type) === "text" ? (r.raw += `
` + i.raw, r.text += `
` + i.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = r.text) : e.push(i);
        continue;
      }
      if (t)
        throw new Error("Infinite loop on byte: " + t.charCodeAt(0));
    }
    return this.state.top = !0, e;
  }
  inline(t, e = []) {
    return this.inlineQueue.push({ src: t, tokens: e }), e;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(t, e = []) {
    var r, c, o;
    let n = t, l = null;
    if (this.tokens.links) {
      const s = Object.keys(this.tokens.links);
      if (s.length > 0)
        for (; (l = this.rules.inline.reflinkSearch.exec(n)) != null; )
          s.includes(l[0].slice(l[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, l.index) + "[" + "a".repeat(l[0].length - 2) + "]" + n.slice(this.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (l = this.rules.inline.blockSkip.exec(n)) != null; )
      n = n.slice(0, l.index) + "[" + "a".repeat(l[0].length - 2) + "]" + n.slice(this.rules.inline.blockSkip.lastIndex);
    for (; (l = this.rules.inline.anyPunctuation.exec(n)) != null; )
      n = n.slice(0, l.index) + "++" + n.slice(this.rules.inline.anyPunctuation.lastIndex);
    let i = !1, a = "";
    for (; t; ) {
      i || (a = ""), i = !1;
      let s;
      if ((c = (r = this.options.extensions) == null ? void 0 : r.inline) != null && c.some((u) => (s = u.call({ lexer: this }, t, e)) ? (t = t.substring(s.raw.length), e.push(s), !0) : !1))
        continue;
      if (s = this.escape(t)) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      if (s = this.tag(t)) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      if (s = this.link(t)) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      if (s = this.reflink(t, this.tokens.links)) {
        t = t.substring(s.raw.length);
        const u = e.at(-1);
        s.type === "text" && (u == null ? void 0 : u.type) === "text" ? (u.raw += s.raw, u.text += s.text) : e.push(s);
        continue;
      }
      if (s = this.emStrong(t, n, a)) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      if (s = this.codespan(t)) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      if (s = this.br(t)) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      if (s = this.del(t)) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      if (s = this.autolink(t)) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      if (!this.state.inLink && (s = this.url(t))) {
        t = t.substring(s.raw.length), e.push(s);
        continue;
      }
      let x = t;
      if ((o = this.options.extensions) != null && o.startInline) {
        let u = 1 / 0;
        const p = t.slice(1);
        let b;
        this.options.extensions.startInline.forEach((f) => {
          b = f.call({ lexer: this }, p), typeof b == "number" && b >= 0 && (u = Math.min(u, b));
        }), u < 1 / 0 && u >= 0 && (x = t.substring(0, u + 1));
      }
      if (s = this.inlineText(x)) {
        t = t.substring(s.raw.length), s.raw.slice(-1) !== "_" && (a = s.raw.slice(-1)), i = !0;
        const u = e.at(-1);
        (u == null ? void 0 : u.type) === "text" ? (u.raw += s.raw, u.text += s.text) : e.push(s);
        continue;
      }
      if (t)
        throw new Error("Infinite loop on byte: " + t.charCodeAt(0));
    }
    return e;
  }
  // --- Lexicon --- //
  space(t) {
    const e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(t) {
    const e = this.rules.block.code.exec(t);
    if (e) {
      const n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: w(n, `
`)
      };
    }
  }
  fences(t) {
    const e = this.rules.block.fences.exec(t);
    if (e) {
      const n = e[0], l = Ee(n, e[3] || "", this.rules);
      return {
        type: "code",
        raw: n,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: l
      };
    }
  }
  heading(t) {
    const e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        const l = w(n, "#");
        (!l || this.rules.other.endingSpaceChar.test(l)) && (n = l.trim());
      }
      return {
        type: "heading",
        raw: e[0],
        depth: e[1].length,
        text: n,
        tokens: this.inline(n)
      };
    }
  }
  hr(t) {
    const e = this.rules.block.hr.exec(t);
    if (e)
      return {
        type: "hr",
        raw: w(e[0], `
`)
      };
  }
  blockquote(t) {
    const e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = w(e[0], `
`).split(`
`), l = "", i = "";
      const a = [];
      for (; n.length > 0; ) {
        let r = !1;
        const c = [];
        let o;
        for (o = 0; o < n.length; o++)
          if (this.rules.other.blockquoteStart.test(n[o]))
            c.push(n[o]), r = !0;
          else if (!r)
            c.push(n[o]);
          else
            break;
        n = n.slice(o);
        const s = c.join(`
`), x = s.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        l = l ? `${l}
${s}` : s, i = i ? `${i}
${x}` : x;
        const u = this.state.top;
        if (this.state.top = !0, this.blockTokens(x, a, !0), this.state.top = u, n.length === 0)
          break;
        const p = a.at(-1);
        if ((p == null ? void 0 : p.type) === "code")
          break;
        if ((p == null ? void 0 : p.type) === "blockquote") {
          const b = p, f = b.raw + `
` + n.join(`
`), m = this.blockquote(f);
          a[a.length - 1] = m, l = l.substring(0, l.length - b.raw.length) + m.raw, i = i.substring(0, i.length - b.text.length) + m.text;
          break;
        } else if ((p == null ? void 0 : p.type) === "list") {
          const b = p, f = b.raw + `
` + n.join(`
`), m = this.list(f);
          a[a.length - 1] = m, l = l.substring(0, l.length - p.raw.length) + m.raw, i = i.substring(0, i.length - b.raw.length) + m.raw, n = f.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: l,
        tokens: a,
        text: i
      };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim();
      const l = n.length > 1, i = {
        type: "list",
        raw: "",
        ordered: l,
        start: l ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = l ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`;
      const a = this.rules.other.listItemRegex(n);
      let r = !1;
      for (; t; ) {
        let o = !1, s = "", x = "";
        if (!(e = a.exec(t)) || this.rules.block.hr.test(t))
          break;
        s = e[0], t = t.substring(s.length);
        let u = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (A) => " ".repeat(3 * A.length)), p = t.split(`
`, 1)[0], b = !u.trim(), f = 0;
        if (b ? f = e[1].length + 1 : (f = e[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, x = u.slice(f), f += e[1].length), b && this.rules.other.blankLine.test(p) && (s += p + `
`, t = t.substring(p.length + 1), o = !0), !o) {
          const A = this.rules.other.nextBulletRegex(f), Z = this.rules.other.hrRegex(f), q = this.rules.other.fencesBeginRegex(f), E = this.rules.other.headingBeginRegex(f), te = this.rules.other.htmlBeginRegex(f);
          for (; t; ) {
            const C = t.split(`
`, 1)[0];
            let S;
            if (p = C, S = p.replace(this.rules.other.tabCharGlobal, "    "), q.test(p) || E.test(p) || te.test(p) || A.test(p) || Z.test(p))
              break;
            if (S.search(this.rules.other.nonSpaceChar) >= f || !p.trim())
              x += `
` + S.slice(f);
            else {
              if (b || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || q.test(u) || E.test(u) || Z.test(u))
                break;
              x += `
` + p;
            }
            !b && !p.trim() && (b = !0), s += C + `
`, t = t.substring(C.length + 1), u = S.slice(f);
          }
        }
        i.loose || (r ? i.loose = !0 : this.rules.other.doubleBlankLine.test(s) && (r = !0));
        let m = null, z;
        this.options.gfm && (m = this.rules.other.listIsTask.exec(x), m && (z = m[0] !== "[ ] ", x = x.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: s,
          task: !!m,
          checked: z,
          loose: !1,
          text: x,
          tokens: []
        }), i.raw += s;
      }
      const c = i.items.at(-1);
      if (c)
        c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let o = 0; o < i.items.length; o++)
        if (this.state.top = !1, i.items[o].tokens = this.blockTokens(i.items[o].text, []), !i.loose) {
          const s = i.items[o].tokens.filter((u) => u.type === "space"), x = s.length > 0 && s.some((u) => this.rules.other.anyLine.test(u.raw));
          i.loose = x;
        }
      if (i.loose)
        for (let o = 0; o < i.items.length; o++)
          i.items[o].loose = !0;
      return i;
    }
  }
  html(t) {
    const e = this.rules.block.html.exec(t);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(t) {
    const e = this.rules.block.def.exec(t);
    if (e) {
      const n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), l = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: n,
        raw: e[0],
        href: l,
        title: i
      };
    }
  }
  table(t) {
    var r;
    const e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const n = N(e[1]), l = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = (r = e[3]) != null && r.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (n.length === l.length) {
      for (const c of l)
        this.rules.other.tableAlignRight.test(c) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(c) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(c) ? a.align.push("left") : a.align.push(null);
      for (let c = 0; c < n.length; c++)
        a.header.push({
          text: n[c],
          tokens: this.inline(n[c]),
          header: !0,
          align: a.align[c]
        });
      for (const c of i)
        a.rows.push(N(c, a.header.length).map((o, s) => ({
          text: o,
          tokens: this.inline(o),
          header: !1,
          align: a.align[s]
        })));
      return a;
    }
  }
  lheading(t) {
    const e = this.rules.block.lheading.exec(t);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.inline(e[1])
      };
  }
  paragraph(t) {
    const e = this.rules.block.paragraph.exec(t);
    if (e) {
      const n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return {
        type: "paragraph",
        raw: e[0],
        text: n,
        tokens: this.inline(n)
      };
    }
  }
  text(t) {
    const e = this.rules.block.text.exec(t);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.inline(e[0])
      };
  }
  escape(t) {
    const e = this.rules.inline.escape.exec(t);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: e[1]
      };
  }
  tag(t) {
    const e = this.rules.inline.tag.exec(t);
    if (e)
      return !this.state.inLink && this.rules.other.startATag.test(e[0]) ? this.state.inLink = !0 : this.state.inLink && this.rules.other.endATag.test(e[0]) && (this.state.inLink = !1), !this.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.state.inRawBlock = !0 : this.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.state.inRawBlock = !1), {
        type: "html",
        raw: e[0],
        inLink: this.state.inLink,
        inRawBlock: this.state.inRawBlock,
        block: !1,
        text: e[0]
      };
  }
  link(t) {
    const e = this.rules.inline.link.exec(t);
    if (e == null) return;
    const n = e[2].trim();
    if (this.rules.other.startAngleBracket.test(n)) {
      if (!this.rules.other.endAngleBracket.test(n))
        return;
      const a = w(n.slice(0, -1), "\\");
      if ((n.length - a.length) % 2 === 0)
        return;
    } else {
      const a = qe(e[2], "()");
      if (a > -1) {
        const c = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + a;
        e[2] = e[2].substring(0, a), e[0] = e[0].substring(0, c).trim(), e[3] = "";
      }
    }
    let l = e[2], i = "";
    return i = e[3] ? e[3].slice(1, -1) : "", l = l.trim(), this.rules.other.startAngleBracket.test(l) && (l = l.slice(1, -1)), Q(e, {
      href: l && l.replace(this.rules.inline.anyPunctuation, "$1"),
      title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
    }, e[0], this, this.rules);
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      const l = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = e[l.toLowerCase()];
      if (!i) {
        const a = n[0].charAt(0);
        return {
          type: "text",
          raw: a,
          text: a
        };
      }
      return Q(n, i, n[0], this, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let l = this.rules.inline.emStrongLDelim.exec(t);
    if (!l || l[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(l[1] || l[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const a = [...l[0]].length - 1;
      let r, c, o = a, s = 0;
      const x = l[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (x.lastIndex = 0, e = e.slice(-1 * t.length + a); (l = x.exec(e)) != null; ) {
        if (r = l[1] || l[2] || l[3] || l[4] || l[5] || l[6], !r) continue;
        if (c = [...r].length, l[3] || l[4]) {
          o += c;
          continue;
        } else if ((l[5] || l[6]) && a % 3 && !((a + c) % 3)) {
          s += c;
          continue;
        }
        if (o -= c, o > 0) continue;
        c = Math.min(c, c + o + s);
        const u = [...l[0]][0].length, p = t.slice(0, a + l.index + u + c);
        if (Math.min(a, c) % 2) {
          const f = p.slice(1, -1);
          return {
            type: "em",
            raw: p,
            text: f,
            tokens: this.inlineTokens(f)
          };
        }
        const b = p.slice(2, -2);
        return {
          type: "strong",
          raw: p,
          text: b,
          tokens: this.inlineTokens(b)
        };
      }
    }
  }
  codespan(t) {
    const e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const l = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return l && i && (n = n.substring(1, n.length - 1)), {
        type: "codespan",
        raw: e[0],
        text: n
      };
    }
  }
  br(t) {
    const e = this.rules.inline.br.exec(t);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(t) {
    const e = this.rules.inline.del.exec(t);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.inlineTokens(e[2])
      };
  }
  autolink(t) {
    const e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, l;
      return e[2] === "@" ? (n = e[1], l = "mailto:" + n) : (n = e[1], l = n), {
        type: "link",
        raw: e[0],
        text: n,
        href: l,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  url(t) {
    var n;
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let l, i;
      if (e[2] === "@")
        l = e[0], i = "mailto:" + l;
      else {
        let a;
        do
          a = e[0], e[0] = ((n = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : n[0]) ?? "";
        while (a !== e[0]);
        l = e[0], e[1] === "www." ? i = "http://" + e[0] : i = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: l,
        href: i,
        tokens: [
          {
            type: "text",
            raw: l,
            text: l
          }
        ]
      };
    }
  }
  inlineText(t) {
    const e = this.rules.inline.text.exec(t);
    if (e) {
      const n = this.state.inRawBlock;
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        escaped: n
      };
    }
  }
}
export {
  Ge as Lexer
};
//# sourceMappingURL=index.js.map
