(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/*

  all we do is take the sections in the template, determine the first one, eg
  with id="start", otherwise literally the first one, then show just that

  when the user navigates, we hide the current one, and show the new one


  stage 1
  
  with no handlers add, the interpreter just clones the section and returns it
  as is

  stage 2

  with the statekey handler, the interpreter modifies the section according to
  any filter test attributes or tags, and modifies the state according to any
  state changes caused by attributes or tags
  
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamePlayer = void 0;
const h_1 = require("@nrkn/h");
const dom_1 = require("../lib/dom");
const configs_1 = require("../mfml/configs");
// root is Node instead of HTMLElement, it could be a DocumentFragment, or in
// future maybe eg an SVGElement
const gamePlayer = (state, targetEl) => {
    const secMap = new Map();
    const missing = [];
    let isFirst = true;
    let current = 'start';
    let missingMessage = '';
    let interp;
    const start = (gameRoot, stage = 1) => {
        secMap.clear();
        missing.length = 0;
        isFirst = true;
        targetEl.innerHTML = '';
        interp = configs_1.stages[`s${stage}`];
        if (!(0, dom_1.isHtmlElement)(gameRoot) && !(0, dom_1.isFragment)(gameRoot)) {
            targetEl.append((0, h_1.p)('gameRoot must be an HTMLElement or DocumentFragment, but it is a ', gameRoot.constructor.name));
            return;
        }
        // this will discard any sections with no id, there's no way to get to them 
        // we should warn the user
        const sections = Array.from(gameRoot.querySelectorAll('section'));
        for (let i = 0; i < sections.length; i++) {
            const s = sections[i];
            const { id } = s;
            if (id === '') {
                // use 1-based indexing for the user message
                missing.push(i + 1);
                continue;
            }
            secMap.set(id, s);
        }
        if (secMap.size === 0) {
            targetEl.append((0, h_1.p)('gameRoot must contain at least one section with an id'));
            return;
        }
        // we will add this to targetEl for the first section, but not subsequent
        missingMessage = missing.length > 0 ?
            `Section(s) [${missing.join(', ')}] have no id and were discarded` :
            '';
        current = secMap.has('start') ? 'start' : secMap.keys().next().value;
        playSection();
    };
    const playSection = () => {
        const section = secMap.get(current);
        const output = (0, h_1.div)(interp(state)(section));
        const messageEl = (0, h_1.p)(missingMessage);
        if (isFirst && missingMessage !== '') {
            targetEl.append(messageEl);
        }
        targetEl.append(output);
        const links = output.querySelectorAll('a');
        for (const link of links) {
            const target = link.getAttribute('href');
            if (target === null)
                continue;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (isFirst) {
                    if (missingMessage !== '')
                        messageEl.remove();
                    isFirst = false;
                }
                current = target.startsWith('#') ? target.slice(1) : target;
                output.remove();
                playSection();
            });
        }
    };
    const stop = () => {
        targetEl.innerHTML = '';
    };
    return { start, stop };
};
exports.gamePlayer = gamePlayer;

},{"../lib/dom":3,"../mfml/configs":5,"@nrkn/h":8}],2:[function(require,module,exports){
"use strict";
// this is the root for browserifying the gamePlayer 
Object.defineProperty(exports, "__esModule", { value: true });
const h_1 = require("@nrkn/h");
const game_player_1 = require("./game-player");
// for now
const stage = 1;
const state = stage === 1 ? {} : new Set();
const target = (0, h_1.div)();
document.body.prepend(target);
const template = document.querySelector('template');
if (template === null) {
    const msg = 'No template found';
    target.append(msg);
    throw Error(msg);
}
const gp = (0, game_player_1.gamePlayer)(state, target);
gp.start(template.content, stage);

},{"./game-player":1,"@nrkn/h":8}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findChild = exports.findDescendent = exports.unwrap = exports.getAttrs = exports.removeAttrs = exports.isFragment = exports.isHtmlElement = exports.isNode = void 0;
const ELEMENT_NODE = 1;
const DOCUMENT_FRAGMENT_NODE = 11;
const isNode = (node) => node && typeof node.nodeType === 'number';
exports.isNode = isNode;
// slight lie - could also be any Element - but more useful to us for now
const isHtmlElement = (node) => node.nodeType === ELEMENT_NODE;
exports.isHtmlElement = isHtmlElement;
const isFragment = (node) => node.nodeType === DOCUMENT_FRAGMENT_NODE;
exports.isFragment = isFragment;
const removeAttrs = (attrs) => (node) => attrs.forEach(k => node.removeAttribute(k));
exports.removeAttrs = removeAttrs;
const getAttrs = (attrs) => (node) => attrs.map(k => node.getAttribute(k));
exports.getAttrs = getAttrs;
const unwrap = (node) => {
    const children = document.createDocumentFragment();
    while (node.firstChild) {
        children.append(node.firstChild);
    }
    return children;
};
exports.unwrap = unwrap;
const findDescendent = (predicate) => (node) => {
    if (predicate(node))
        return node;
    for (let i = 0; i < node.childNodes.length; i++) {
        const result = (0, exports.findDescendent)(predicate)(node.childNodes[i]);
        if (result !== undefined)
            return result;
    }
};
exports.findDescendent = findDescendent;
const findChild = (predicate) => (node) => {
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (predicate(child))
            return child;
    }
};
exports.findChild = findChild;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceSeparated = void 0;
const spaceSeparated = (value) => value.split(' ').map(s => s.trim()).filter(s => s !== '');
exports.spaceSeparated = spaceSeparated;

},{}],5:[function(require,module,exports){
"use strict";
// assemble just what's needed for stage 1, stage 2 etc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.stages = void 0;
const interpret_1 = require("./interpret");
const key_state_1 = require("./key-state");
exports.stages = {
    s1: () => (node) => (0, interpret_1.interpret)()(node),
    s2: (keys) => (node) => (0, interpret_1.interpret)((0, key_state_1.handleKeyState)(keys))(node)
};

},{"./interpret":6,"./key-state":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpret = void 0;
const interpret = (...handlers) => (node) => inter(handlers)(node.cloneNode(true));
exports.interpret = interpret;
const inter = (handlers) => (node) => {
    for (const handler of handlers) {
        let newNode = handler(node);
        if (newNode !== node) {
            newNode = inter(handlers)(newNode);
            if (node.parentNode === null)
                throw Error('node.parentNode is null');
            node.parentNode.replaceChild(newNode, node);
            node = newNode;
            break;
        }
    }
    const childNodes = Array.from(node.childNodes);
    for (const childNode of childNodes) {
        inter(handlers)(childNode);
    }
    return node;
};

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKeyState = void 0;
const dom_1 = require("../lib/dom");
const util_1 = require("../lib/util");
const qattrs = ['q-if', 'q-or', 'q-not'];
const sattrs = ['k-give', 'k-take'];
const removeQueryAttrs = (0, dom_1.removeAttrs)(qattrs);
const removeStateAttrs = (0, dom_1.removeAttrs)(sattrs);
const removeElseAttr = (node) => node.removeAttribute('q-else');
const getQueryKeys = (node) => {
    const [qif, qor, qnot] = (0, dom_1.getAttrs)(qattrs)(node);
    const ifKeys = qif !== null ? (0, util_1.spaceSeparated)(qif) : [];
    const orKeys = qor !== null ? (0, util_1.spaceSeparated)(qor) : [];
    const notKeys = qnot !== null ? (0, util_1.spaceSeparated)(qnot) : [];
    return [ifKeys, orKeys, notKeys];
};
const isQuery = (ifKeys, orKeys, notKeys) => ifKeys.length > 0 || orKeys.length > 0 || notKeys.length > 0;
const isFirstAttr = (node) => node.hasAttribute('q-first');
const isElseAttr = (node) => (0, dom_1.isHtmlElement)(node) && node.hasAttribute('q-else');
const unwrapMf = (node) => {
    if (!(0, dom_1.isHtmlElement)(node))
        return node;
    if (node.localName !== 'm-f') {
        return node;
    }
    return (0, dom_1.unwrap)(node);
};
const handleQ = (keys) => (node) => {
    // handle query first, because if it fails the query, we don't want to 
    // give/take keys or handle first    
    const [ifKeys, orKeys, notKeys] = getQueryKeys(node);
    const isQ = isQuery(ifKeys, orKeys, notKeys);
    if (isQ) {
        removeQueryAttrs(node);
        const isValid = testKeys(keys)(ifKeys, orKeys, notKeys);
        const elseNode = findElseChild(node);
        // it's a query node, but it's not valid
        if (!isValid) {
            if (elseNode !== undefined) {
                removeElseAttr(elseNode);
                return unwrapMf(elseNode);
            }
            return document.createDocumentFragment();
        }
        // it was valid so remove the elseNode if necessary
        if (elseNode !== undefined) {
            elseNode.remove();
        }
    }
    return node;
};
const handleS = (keys) => (node) => {
    const [give, take] = (0, dom_1.getAttrs)(sattrs)(node);
    const giveKeys = give !== null ? (0, util_1.spaceSeparated)(give) : [];
    const takeKeys = take !== null ? (0, util_1.spaceSeparated)(take) : [];
    setKeys(keys)(giveKeys, takeKeys);
    removeStateAttrs(node);
};
const handleL = (keys) => (node) => {
    const first = findValidQuery(keys)(node);
    if (first !== undefined) {
        removeQueryAttrs(first);
        return unwrapMf(first);
    }
    const elseNode = findElseChild(node);
    if (elseNode !== undefined) {
        removeElseAttr(elseNode);
        return unwrapMf(elseNode);
    }
    return document.createDocumentFragment();
};
const handleKeyState = (keys) => (node) => {
    if (!(0, dom_1.isHtmlElement)(node)) {
        return node;
    }
    // handle query first, because if it fails the query, we don't want to give/take keys
    // or handle qfirst    
    const maybeQ = handleQ(keys)(node);
    if (node !== maybeQ)
        return maybeQ;
    // handle state attrs
    // no need to reassign, it doesn't change node
    handleS(keys)(node);
    // handle qfirst
    if (isFirstAttr(node))
        return handleL(keys)(node);
    return unwrapMf(node);
};
exports.handleKeyState = handleKeyState;
// we need to cast - shame we can't infer from the predicate  
const findElseChild = (0, dom_1.findChild)(isElseAttr);
const isValidQuery = (keys) => (n) => {
    if (!(0, dom_1.isHtmlElement)(n))
        return false;
    const [ifKeys, orKeys, notKeys] = getQueryKeys(n);
    const isQ = isQuery(ifKeys, orKeys, notKeys);
    // we only test queries
    if (!isQ)
        return false;
    const isValid = testKeys(keys)(ifKeys, orKeys, notKeys);
    return isValid;
};
const findValidQuery = (keys) => (0, dom_1.findChild)(isValidQuery(keys));
const testKey = (keys) => (key) => {
    const isNot = key.startsWith('!');
    return isNot ? !keys.has(key.slice(1)) : keys.has(key);
};
const testKeys = (keys) => (ifKeys, orKeys, notKeys) => {
    const hasIf = ifKeys.length > 0;
    const hasOr = orKeys.length > 0;
    const hasNot = notKeys.length > 0;
    if (!hasIf && !hasOr && !hasNot) {
        return true;
    }
    const tk = testKey(keys);
    if (!ifKeys.every(tk))
        return false;
    if (hasOr && !orKeys.some(tk))
        return false;
    if (notKeys.some(tk))
        return false;
    return true;
};
const setKeys = (keys) => (giveKeys, takeKeys) => {
    giveKeys.forEach(key => keys.add(key));
    takeKeys.forEach(key => keys.delete(key));
};

},{"../lib/dom":3,"../lib/util":4}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.head = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.form = exports.footer = exports.figure = exports.figcaption = exports.fieldset = exports.embed = exports.em = exports.dt = exports.dl = exports.div = exports.dialog = exports.dfn = exports.details = exports.del = exports.dd = exports.datalist = exports.data = exports.colgroup = exports.col = exports.code = exports.cite = exports.caption = exports.canvas = exports.button = exports.br = exports.body = exports.blockquote = exports.bdo = exports.bdi = exports.base = exports.b = exports.audio = exports.aside = exports.article = exports.area = exports.address = exports.abbr = exports.a = exports.fragment = exports.text = exports.attr = exports.s = exports.h = void 0;
exports.table = exports.sup = exports.summary = exports.sub = exports.style = exports.strong = exports.span = exports.source = exports.small = exports.slot = exports.select = exports.section = exports.script = exports.samp = exports.$s = exports.ruby = exports.rt = exports.rp = exports.q = exports.progress = exports.pre = exports.picture = exports.p = exports.output = exports.option = exports.optgroup = exports.ol = exports.object = exports.noscript = exports.nav = exports.meter = exports.meta = exports.menu = exports.mark = exports.map = exports.main = exports.link = exports.li = exports.legend = exports.label = exports.kbd = exports.ins = exports.input = exports.img = exports.iframe = exports.i = exports.html = exports.hr = exports.hgroup = exports.header = void 0;
exports.g = exports.foreignObject = exports.filter = exports.feTurbulence = exports.feTile = exports.feSpotLight = exports.feSpecularLighting = exports.fePointLight = exports.feOffset = exports.feMorphology = exports.feMergeNode = exports.feMerge = exports.feImage = exports.feGaussianBlur = exports.feFuncR = exports.feFuncG = exports.feFuncB = exports.feFuncA = exports.feFlood = exports.feDropShadow = exports.feDistantLight = exports.feDisplacementMap = exports.feDiffuseLighting = exports.feConvolveMatrix = exports.feComposite = exports.feComponentTransfer = exports.feColorMatrix = exports.feBlend = exports.ellipse = exports.desc = exports.defs = exports.clipPath = exports.circle = exports.$a = exports.wbr = exports.video = exports.$var = exports.ul = exports.u = exports.track = exports.tr = exports.title = exports.time = exports.thead = exports.th = exports.tfoot = exports.textarea = exports.template = exports.td = exports.tbody = void 0;
exports.view = exports.use = exports.tspan = exports.$title = exports.textPath = exports.$text = exports.symbol = exports.$switch = exports.svg = exports.$style = exports.stop = exports.$script = exports.rect = exports.radialGradient = exports.polyline = exports.polygon = exports.pattern = exports.path = exports.metadata = exports.mask = exports.marker = exports.linearGradient = exports.line = exports.image = void 0;
const h_1 = require("./lib/h");
const s_1 = require("./lib/s");
var h_2 = require("./lib/h");
Object.defineProperty(exports, "h", { enumerable: true, get: function () { return h_2.h; } });
var s_2 = require("./lib/s");
Object.defineProperty(exports, "s", { enumerable: true, get: function () { return s_2.s; } });
var attr_1 = require("./lib/attr");
Object.defineProperty(exports, "attr", { enumerable: true, get: function () { return attr_1.attr; } });
var util_1 = require("./lib/util");
Object.defineProperty(exports, "text", { enumerable: true, get: function () { return util_1.text; } });
Object.defineProperty(exports, "fragment", { enumerable: true, get: function () { return util_1.fragment; } });
// html
const a = (...args) => (0, h_1.h)('a', ...args);
exports.a = a;
const abbr = (...args) => (0, h_1.h)('abbr', ...args);
exports.abbr = abbr;
const address = (...args) => (0, h_1.h)('address', ...args);
exports.address = address;
const area = (...args) => (0, h_1.h)('area', ...args);
exports.area = area;
const article = (...args) => (0, h_1.h)('article', ...args);
exports.article = article;
const aside = (...args) => (0, h_1.h)('aside', ...args);
exports.aside = aside;
const audio = (...args) => (0, h_1.h)('audio', ...args);
exports.audio = audio;
const b = (...args) => (0, h_1.h)('b', ...args);
exports.b = b;
const base = (...args) => (0, h_1.h)('base', ...args);
exports.base = base;
const bdi = (...args) => (0, h_1.h)('bdi', ...args);
exports.bdi = bdi;
const bdo = (...args) => (0, h_1.h)('bdo', ...args);
exports.bdo = bdo;
const blockquote = (...args) => (0, h_1.h)('blockquote', ...args);
exports.blockquote = blockquote;
const body = (...args) => (0, h_1.h)('body', ...args);
exports.body = body;
const br = (...args) => (0, h_1.h)('br', ...args);
exports.br = br;
const button = (...args) => (0, h_1.h)('button', ...args);
exports.button = button;
const canvas = (...args) => (0, h_1.h)('canvas', ...args);
exports.canvas = canvas;
const caption = (...args) => (0, h_1.h)('caption', ...args);
exports.caption = caption;
const cite = (...args) => (0, h_1.h)('cite', ...args);
exports.cite = cite;
const code = (...args) => (0, h_1.h)('code', ...args);
exports.code = code;
const col = (...args) => (0, h_1.h)('col', ...args);
exports.col = col;
const colgroup = (...args) => (0, h_1.h)('colgroup', ...args);
exports.colgroup = colgroup;
const data = (...args) => (0, h_1.h)('data', ...args);
exports.data = data;
const datalist = (...args) => (0, h_1.h)('datalist', ...args);
exports.datalist = datalist;
const dd = (...args) => (0, h_1.h)('dd', ...args);
exports.dd = dd;
const del = (...args) => (0, h_1.h)('del', ...args);
exports.del = del;
const details = (...args) => (0, h_1.h)('details', ...args);
exports.details = details;
const dfn = (...args) => (0, h_1.h)('dfn', ...args);
exports.dfn = dfn;
const dialog = (...args) => (0, h_1.h)('dialog', ...args);
exports.dialog = dialog;
const div = (...args) => (0, h_1.h)('div', ...args);
exports.div = div;
const dl = (...args) => (0, h_1.h)('dl', ...args);
exports.dl = dl;
const dt = (...args) => (0, h_1.h)('dt', ...args);
exports.dt = dt;
const em = (...args) => (0, h_1.h)('em', ...args);
exports.em = em;
const embed = (...args) => (0, h_1.h)('embed', ...args);
exports.embed = embed;
const fieldset = (...args) => (0, h_1.h)('fieldset', ...args);
exports.fieldset = fieldset;
const figcaption = (...args) => (0, h_1.h)('figcaption', ...args);
exports.figcaption = figcaption;
const figure = (...args) => (0, h_1.h)('figure', ...args);
exports.figure = figure;
const footer = (...args) => (0, h_1.h)('footer', ...args);
exports.footer = footer;
const form = (...args) => (0, h_1.h)('form', ...args);
exports.form = form;
const h1 = (...args) => (0, h_1.h)('h1', ...args);
exports.h1 = h1;
const h2 = (...args) => (0, h_1.h)('h2', ...args);
exports.h2 = h2;
const h3 = (...args) => (0, h_1.h)('h3', ...args);
exports.h3 = h3;
const h4 = (...args) => (0, h_1.h)('h4', ...args);
exports.h4 = h4;
const h5 = (...args) => (0, h_1.h)('h5', ...args);
exports.h5 = h5;
const h6 = (...args) => (0, h_1.h)('h6', ...args);
exports.h6 = h6;
const head = (...args) => (0, h_1.h)('head', ...args);
exports.head = head;
const header = (...args) => (0, h_1.h)('header', ...args);
exports.header = header;
const hgroup = (...args) => (0, h_1.h)('hgroup', ...args);
exports.hgroup = hgroup;
const hr = (...args) => (0, h_1.h)('hr', ...args);
exports.hr = hr;
const html = (...args) => (0, h_1.h)('html', ...args);
exports.html = html;
const i = (...args) => (0, h_1.h)('i', ...args);
exports.i = i;
const iframe = (...args) => (0, h_1.h)('iframe', ...args);
exports.iframe = iframe;
const img = (...args) => (0, h_1.h)('img', ...args);
exports.img = img;
const input = (...args) => (0, h_1.h)('input', ...args);
exports.input = input;
const ins = (...args) => (0, h_1.h)('ins', ...args);
exports.ins = ins;
const kbd = (...args) => (0, h_1.h)('kbd', ...args);
exports.kbd = kbd;
const label = (...args) => (0, h_1.h)('label', ...args);
exports.label = label;
const legend = (...args) => (0, h_1.h)('legend', ...args);
exports.legend = legend;
const li = (...args) => (0, h_1.h)('li', ...args);
exports.li = li;
const link = (...args) => (0, h_1.h)('link', ...args);
exports.link = link;
const main = (...args) => (0, h_1.h)('main', ...args);
exports.main = main;
const map = (...args) => (0, h_1.h)('map', ...args);
exports.map = map;
const mark = (...args) => (0, h_1.h)('mark', ...args);
exports.mark = mark;
const menu = (...args) => (0, h_1.h)('menu', ...args);
exports.menu = menu;
const meta = (...args) => (0, h_1.h)('meta', ...args);
exports.meta = meta;
const meter = (...args) => (0, h_1.h)('meter', ...args);
exports.meter = meter;
const nav = (...args) => (0, h_1.h)('nav', ...args);
exports.nav = nav;
const noscript = (...args) => (0, h_1.h)('noscript', ...args);
exports.noscript = noscript;
const object = (...args) => (0, h_1.h)('object', ...args);
exports.object = object;
const ol = (...args) => (0, h_1.h)('ol', ...args);
exports.ol = ol;
const optgroup = (...args) => (0, h_1.h)('optgroup', ...args);
exports.optgroup = optgroup;
const option = (...args) => (0, h_1.h)('option', ...args);
exports.option = option;
const output = (...args) => (0, h_1.h)('output', ...args);
exports.output = output;
const p = (...args) => (0, h_1.h)('p', ...args);
exports.p = p;
const picture = (...args) => (0, h_1.h)('picture', ...args);
exports.picture = picture;
const pre = (...args) => (0, h_1.h)('pre', ...args);
exports.pre = pre;
const progress = (...args) => (0, h_1.h)('progress', ...args);
exports.progress = progress;
const q = (...args) => (0, h_1.h)('q', ...args);
exports.q = q;
const rp = (...args) => (0, h_1.h)('rp', ...args);
exports.rp = rp;
const rt = (...args) => (0, h_1.h)('rt', ...args);
exports.rt = rt;
const ruby = (...args) => (0, h_1.h)('ruby', ...args);
exports.ruby = ruby;
const $s = (...args) => (0, h_1.h)('s', ...args);
exports.$s = $s;
const samp = (...args) => (0, h_1.h)('samp', ...args);
exports.samp = samp;
const script = (...args) => (0, h_1.h)('script', ...args);
exports.script = script;
const section = (...args) => (0, h_1.h)('section', ...args);
exports.section = section;
const select = (...args) => (0, h_1.h)('select', ...args);
exports.select = select;
const slot = (...args) => (0, h_1.h)('slot', ...args);
exports.slot = slot;
const small = (...args) => (0, h_1.h)('small', ...args);
exports.small = small;
const source = (...args) => (0, h_1.h)('source', ...args);
exports.source = source;
const span = (...args) => (0, h_1.h)('span', ...args);
exports.span = span;
const strong = (...args) => (0, h_1.h)('strong', ...args);
exports.strong = strong;
const style = (...args) => (0, h_1.h)('style', ...args);
exports.style = style;
const sub = (...args) => (0, h_1.h)('sub', ...args);
exports.sub = sub;
const summary = (...args) => (0, h_1.h)('summary', ...args);
exports.summary = summary;
const sup = (...args) => (0, h_1.h)('sup', ...args);
exports.sup = sup;
const table = (...args) => (0, h_1.h)('table', ...args);
exports.table = table;
const tbody = (...args) => (0, h_1.h)('tbody', ...args);
exports.tbody = tbody;
const td = (...args) => (0, h_1.h)('td', ...args);
exports.td = td;
const template = (...args) => (0, h_1.h)('template', ...args);
exports.template = template;
const textarea = (...args) => (0, h_1.h)('textarea', ...args);
exports.textarea = textarea;
const tfoot = (...args) => (0, h_1.h)('tfoot', ...args);
exports.tfoot = tfoot;
const th = (...args) => (0, h_1.h)('th', ...args);
exports.th = th;
const thead = (...args) => (0, h_1.h)('thead', ...args);
exports.thead = thead;
const time = (...args) => (0, h_1.h)('time', ...args);
exports.time = time;
const title = (...args) => (0, h_1.h)('title', ...args);
exports.title = title;
const tr = (...args) => (0, h_1.h)('tr', ...args);
exports.tr = tr;
const track = (...args) => (0, h_1.h)('track', ...args);
exports.track = track;
const u = (...args) => (0, h_1.h)('u', ...args);
exports.u = u;
const ul = (...args) => (0, h_1.h)('ul', ...args);
exports.ul = ul;
const $var = (...args) => (0, h_1.h)('var', ...args);
exports.$var = $var;
const video = (...args) => (0, h_1.h)('video', ...args);
exports.video = video;
const wbr = (...args) => (0, h_1.h)('wbr', ...args);
exports.wbr = wbr;
// svg
const $a = (...args) => (0, s_1.s)('a', ...args);
exports.$a = $a;
const circle = (...args) => (0, s_1.s)('circle', ...args);
exports.circle = circle;
const clipPath = (...args) => (0, s_1.s)('clipPath', ...args);
exports.clipPath = clipPath;
const defs = (...args) => (0, s_1.s)('defs', ...args);
exports.defs = defs;
const desc = (...args) => (0, s_1.s)('desc', ...args);
exports.desc = desc;
const ellipse = (...args) => (0, s_1.s)('ellipse', ...args);
exports.ellipse = ellipse;
const feBlend = (...args) => (0, s_1.s)('feBlend', ...args);
exports.feBlend = feBlend;
const feColorMatrix = (...args) => (0, s_1.s)('feColorMatrix', ...args);
exports.feColorMatrix = feColorMatrix;
const feComponentTransfer = (...args) => (0, s_1.s)('feComponentTransfer', ...args);
exports.feComponentTransfer = feComponentTransfer;
const feComposite = (...args) => (0, s_1.s)('feComposite', ...args);
exports.feComposite = feComposite;
const feConvolveMatrix = (...args) => (0, s_1.s)('feConvolveMatrix', ...args);
exports.feConvolveMatrix = feConvolveMatrix;
const feDiffuseLighting = (...args) => (0, s_1.s)('feDiffuseLighting', ...args);
exports.feDiffuseLighting = feDiffuseLighting;
const feDisplacementMap = (...args) => (0, s_1.s)('feDisplacementMap', ...args);
exports.feDisplacementMap = feDisplacementMap;
const feDistantLight = (...args) => (0, s_1.s)('feDistantLight', ...args);
exports.feDistantLight = feDistantLight;
const feDropShadow = (...args) => (0, s_1.s)('feDropShadow', ...args);
exports.feDropShadow = feDropShadow;
const feFlood = (...args) => (0, s_1.s)('feFlood', ...args);
exports.feFlood = feFlood;
const feFuncA = (...args) => (0, s_1.s)('feFuncA', ...args);
exports.feFuncA = feFuncA;
const feFuncB = (...args) => (0, s_1.s)('feFuncB', ...args);
exports.feFuncB = feFuncB;
const feFuncG = (...args) => (0, s_1.s)('feFuncG', ...args);
exports.feFuncG = feFuncG;
const feFuncR = (...args) => (0, s_1.s)('feFuncR', ...args);
exports.feFuncR = feFuncR;
const feGaussianBlur = (...args) => (0, s_1.s)('feGaussianBlur', ...args);
exports.feGaussianBlur = feGaussianBlur;
const feImage = (...args) => (0, s_1.s)('feImage', ...args);
exports.feImage = feImage;
const feMerge = (...args) => (0, s_1.s)('feMerge', ...args);
exports.feMerge = feMerge;
const feMergeNode = (...args) => (0, s_1.s)('feMergeNode', ...args);
exports.feMergeNode = feMergeNode;
const feMorphology = (...args) => (0, s_1.s)('feMorphology', ...args);
exports.feMorphology = feMorphology;
const feOffset = (...args) => (0, s_1.s)('feOffset', ...args);
exports.feOffset = feOffset;
const fePointLight = (...args) => (0, s_1.s)('fePointLight', ...args);
exports.fePointLight = fePointLight;
const feSpecularLighting = (...args) => (0, s_1.s)('feSpecularLighting', ...args);
exports.feSpecularLighting = feSpecularLighting;
const feSpotLight = (...args) => (0, s_1.s)('feSpotLight', ...args);
exports.feSpotLight = feSpotLight;
const feTile = (...args) => (0, s_1.s)('feTile', ...args);
exports.feTile = feTile;
const feTurbulence = (...args) => (0, s_1.s)('feTurbulence', ...args);
exports.feTurbulence = feTurbulence;
const filter = (...args) => (0, s_1.s)('filter', ...args);
exports.filter = filter;
const foreignObject = (...args) => (0, s_1.s)('foreignObject', ...args);
exports.foreignObject = foreignObject;
const g = (...args) => (0, s_1.s)('g', ...args);
exports.g = g;
const image = (...args) => (0, s_1.s)('image', ...args);
exports.image = image;
const line = (...args) => (0, s_1.s)('line', ...args);
exports.line = line;
const linearGradient = (...args) => (0, s_1.s)('linearGradient', ...args);
exports.linearGradient = linearGradient;
const marker = (...args) => (0, s_1.s)('marker', ...args);
exports.marker = marker;
const mask = (...args) => (0, s_1.s)('mask', ...args);
exports.mask = mask;
const metadata = (...args) => (0, s_1.s)('metadata', ...args);
exports.metadata = metadata;
const path = (...args) => (0, s_1.s)('path', ...args);
exports.path = path;
const pattern = (...args) => (0, s_1.s)('pattern', ...args);
exports.pattern = pattern;
const polygon = (...args) => (0, s_1.s)('polygon', ...args);
exports.polygon = polygon;
const polyline = (...args) => (0, s_1.s)('polyline', ...args);
exports.polyline = polyline;
const radialGradient = (...args) => (0, s_1.s)('radialGradient', ...args);
exports.radialGradient = radialGradient;
const rect = (...args) => (0, s_1.s)('rect', ...args);
exports.rect = rect;
const $script = (...args) => (0, s_1.s)('script', ...args);
exports.$script = $script;
const stop = (...args) => (0, s_1.s)('stop', ...args);
exports.stop = stop;
const $style = (...args) => (0, s_1.s)('style', ...args);
exports.$style = $style;
const svg = (...args) => (0, s_1.s)('svg', ...args);
exports.svg = svg;
const $switch = (...args) => (0, s_1.s)('switch', ...args);
exports.$switch = $switch;
const symbol = (...args) => (0, s_1.s)('symbol', ...args);
exports.symbol = symbol;
const $text = (...args) => (0, s_1.s)('text', ...args);
exports.$text = $text;
const textPath = (...args) => (0, s_1.s)('textPath', ...args);
exports.textPath = textPath;
const $title = (...args) => (0, s_1.s)('title', ...args);
exports.$title = $title;
const tspan = (...args) => (0, s_1.s)('tspan', ...args);
exports.tspan = tspan;
const use = (...args) => (0, s_1.s)('use', ...args);
exports.use = use;
const view = (...args) => (0, s_1.s)('view', ...args);
exports.view = view;
//

},{"./lib/attr":10,"./lib/h":12,"./lib/s":15,"./lib/util":16}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textFromArg = exports.handleChildArg = exports.handleArg = void 0;
const predicates_1 = require("./predicates");
const next_1 = require("./next");
const noop = () => { };
const handleArg = (el, arg) => (0, exports.handleChildArg)(el, arg, () => handleObjectArg(el, arg));
exports.handleArg = handleArg;
const handleChildArg = (el, arg, next = noop) => {
    if (typeof arg === 'string')
        arg = document.createTextNode(arg);
    if ((0, predicates_1.isNode)(arg))
        return el.appendChild(arg);
    next();
};
exports.handleChildArg = handleChildArg;
const handleObjectArg = (el, arg) => {
    // arg cannot be string by this point but ts doesn't know that, hence cast
    for (const key in arg) {
        chain.handle(el, key, arg[key]);
    }
};
const textFromArg = (arg) => typeof arg === 'string' ?
    arg :
    typeof arg === 'number' ?
        String(arg) :
        (0, predicates_1.isTextNode)(arg) ?
            arg.data :
            (0, predicates_1.isElement)(arg) && arg.textContent ?
                arg.textContent :
                '';
exports.textFromArg = textFromArg;
const handleEvent = (el, key, value, next) => typeof value === 'function' ? el.addEventListener(key, value) : next();
const handleStyle = (el, key, value, next) => key === 'style' ?
    typeof value === 'string' ?
        el.setAttribute('style', value) :
        Object.assign(el.style, value) :
    next();
const handleDataset = (el, key, value, next) => key === 'data' ?
    Object.keys(value).forEach(key => el.dataset[key] = String(value[key])) :
    next();
const handleAttribute = (el, key, value) => {
    if (value === true) {
        el.setAttribute(key, '');
        return;
    }
    if (value === undefined || value === null || value === false) {
        el.removeAttribute(key);
        return;
    }
    if (Array.isArray(value)) {
        el.setAttribute(key, value.join(' '));
        return;
    }
    el.setAttribute(key, String(value));
};
//
const chain = (0, next_1.createFunctionChain)();
chain.registerHandler(handleEvent);
chain.registerHandler(handleStyle);
chain.registerHandler(handleDataset);
chain.registerHandler(handleAttribute);

},{"./next":13,"./predicates":14}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attr = void 0;
const args_1 = require("./args");
const attr = (el, ...args) => {
    for (const arg of args)
        (0, args_1.handleArg)(el, arg);
    return el;
};
exports.attr = attr;

},{"./args":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgNs = void 0;
exports.svgNs = 'http://www.w3.org/2000/svg';

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.h = void 0;
const args_1 = require("./args");
const h = (tagName, ...args) => {
    const element = document.createElement(tagName);
    for (const arg of args)
        (0, args_1.handleArg)(element, arg);
    return element;
};
exports.h = h;

},{"./args":9}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFunctionChain = void 0;
// allows you to handle function chaining by registering multiple functions
// that take a next argument as their last argument. Each function may 
// call the next function if it doesn't handle the argument.
const createFunctionChain = () => {
    const handlers = [];
    const registerHandler = (fn) => {
        handlers.push(fn);
    };
    const handle = (...args) => {
        let i = 0;
        const next = () => {
            const fn = handlers[i++];
            if (fn)
                fn(...args, next);
        };
        next();
    };
    return { registerHandler, handle };
};
exports.createFunctionChain = createFunctionChain;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHTMLOrSVGElement = exports.isSVGElement = exports.isTextNode = exports.isElement = exports.isNode = void 0;
const const_1 = require("./const");
const isNode = (value) => value && typeof value.nodeType === 'number';
exports.isNode = isNode;
const isElement = (value) => value && value['nodeType'] === 1;
exports.isElement = isElement;
const isTextNode = (value) => value && value['nodeType'] === 3;
exports.isTextNode = isTextNode;
const isSVGElement = (value) => (0, exports.isElement)(value) && value.namespaceURI === const_1.svgNs;
exports.isSVGElement = isSVGElement;
const isHTMLOrSVGElement = (value) => (0, exports.isElement)(value) && 'dataset' in value;
exports.isHTMLOrSVGElement = isHTMLOrSVGElement;

},{"./const":11}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s = void 0;
const args_1 = require("./args");
const const_1 = require("./const");
const s = (tagName, ...args) => {
    const element = document.createElementNS(const_1.svgNs, tagName);
    for (const arg of args)
        (0, args_1.handleArg)(element, arg);
    return element;
};
exports.s = s;

},{"./args":9,"./const":11}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragment = exports.text = void 0;
const args_1 = require("./args");
const text = (...args) => {
    let data = '';
    args.forEach(arg => data += (0, args_1.textFromArg)(arg));
    return document.createTextNode(data);
};
exports.text = text;
const fragment = (...args) => {
    const documentFragment = document.createDocumentFragment();
    args.forEach(arg => (0, args_1.handleChildArg)(documentFragment, arg));
    return documentFragment;
};
exports.fragment = fragment;

},{"./args":9}]},{},[2]);
