(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const h_1 = require("@nrkn/h");
const games_1 = require("./views/games");
const redirect_1 = require("./redirect");
// probably we will make a standard template for the system and have a container in it be targetEl, but body is fine for prototyping
const targetEl = document.body;
const notImplementedYetView = (name) => async () => (0, h_1.h1)('Not implemented yet: ' + name);
const views = {
    games: games_1.gamesView,
    play: notImplementedYetView('play'),
    editGame: notImplementedYetView('editGame'),
    createGame: notImplementedYetView('createGame'),
};
(0, redirect_1.setOnRedirect)(async (path) => {
    const parts = path.split('/');
    const [head, ...args] = parts;
    if (!head.startsWith('#')) {
        throw Error('Invalid path');
    }
    const viewName = head.slice(1);
    const viewNode = await views[viewName](...args);
    targetEl.innerHTML = '';
    targetEl.append(viewNode);
    targetEl.id = 'view_' + viewName;
});
const hasAnchor = window.location.hash.length > 0;
if (hasAnchor) {
    (0, redirect_1.redirect)(window.location.hash);
}
else {
    (0, redirect_1.redirect)('#games');
}
window.addEventListener('hashchange', () => {
    (0, redirect_1.redirect)(window.location.hash);
});

},{"./redirect":2,"./views/games":4,"@nrkn/h":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOnRedirect = exports.redirect = void 0;
const redirect = (path) => {
    // set anchor part of location to the path (which starts with #)
    window.location.hash = path;
    onRedirect(path);
};
exports.redirect = redirect;
let onRedirect = () => { };
const setOnRedirect = (fn) => {
    onRedirect = fn;
};
exports.setOnRedirect = setOnRedirect;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putGame = exports.postGame = exports.deleteGame = exports.getGame = exports.getGameNames = void 0;
const join = (...args) => args.join('/');
const rootPath = '/games';
const apiPath = '/api' + rootPath;
const getGameNames = async () => {
    const res = await fetch(apiPath);
    if (res.status !== 200) {
        throw Error('Failed to fetch game names');
    }
    return res.json();
};
exports.getGameNames = getGameNames;
const getGame = async (name) => {
    const path = join(rootPath, name, 'index.html');
    const res = await fetch(path);
    if (res.status !== 200) {
        throw Error(`Failed to fetch game "${name}"`);
    }
    return res.text();
};
exports.getGame = getGame;
const deleteGame = async (name) => {
    const path = join(apiPath, name);
    const res = await fetch(path, { method: 'DELETE' });
    if (res.status !== 204) {
        throw Error(`Failed to delete game "${name}"`);
    }
};
exports.deleteGame = deleteGame;
const postGame = async (name, html) => {
    const path = join(apiPath, name);
    const res = await fetch(path, { method: 'POST', body: html });
    if (res.status !== 201) {
        throw Error(`Failed to create game "${name}"`);
    }
};
exports.postGame = postGame;
const putGame = async (name, html) => {
    const path = join(apiPath, name);
    const res = await fetch(path, { method: 'PUT', body: html });
    if (res.status !== 204) {
        throw Error(`Failed to update game "${name}"`);
    }
};
exports.putGame = putGame;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesView = void 0;
const h_1 = require("@nrkn/h");
const game_1 = require("../store/game");
const ul_from_1 = require("./ul-from");
const redirect_1 = require("../redirect");
const gamesView = async (id = 'games') => {
    const gameNames = await (0, game_1.getGameNames)();
    const gamesHeader = (0, h_1.h1)('Games');
    const createButton = (0, h_1.button)('Create a game');
    createButton.addEventListener('click', () => {
        (0, redirect_1.redirect)('#createGame');
    });
    const gameToNode = (name) => {
        const playButton = (0, h_1.button)('Play');
        const editButton = (0, h_1.button)('Edit');
        const deleteButton = (0, h_1.button)('Delete');
        const gameEl = (0, h_1.div)((0, h_1.p)(name), (0, ul_from_1.ulFrom)(playButton, editButton, deleteButton));
        playButton.addEventListener('click', () => {
            (0, redirect_1.redirect)('#play/' + name);
        });
        editButton.addEventListener('click', () => {
            (0, redirect_1.redirect)('#editGame/' + name);
        });
        deleteButton.addEventListener('click', async () => {
            if (!confirm(`Are you sure you want to delete "${name}"?`))
                return;
            await (0, game_1.deleteGame)(name);
            gameEl.remove();
        });
        return gameEl;
    };
    const gamesViewEl = (0, h_1.div)({ id }, gamesHeader, (0, ul_from_1.ulFrom)(createButton), gameNames.length > 0 ?
        (0, ul_from_1.ulFrom)(...gameNames.map(gameToNode)) :
        (0, h_1.p)('No games - why not make one?'));
    return gamesViewEl;
};
exports.gamesView = gamesView;

},{"../redirect":2,"../store/game":3,"./ul-from":5,"@nrkn/h":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ulFrom = void 0;
const h_1 = require("@nrkn/h");
const ulFrom = (...nodes) => (0, h_1.ul)(...nodes.map(n => (0, h_1.li)(n)));
exports.ulFrom = ulFrom;

},{"@nrkn/h":6}],6:[function(require,module,exports){
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

},{"./lib/attr":8,"./lib/h":10,"./lib/s":13,"./lib/util":14}],7:[function(require,module,exports){
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

},{"./next":11,"./predicates":12}],8:[function(require,module,exports){
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

},{"./args":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgNs = void 0;
exports.svgNs = 'http://www.w3.org/2000/svg';

},{}],10:[function(require,module,exports){
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

},{"./args":7}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./const":9}],13:[function(require,module,exports){
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

},{"./args":7,"./const":9}],14:[function(require,module,exports){
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

},{"./args":7}]},{},[1]);
