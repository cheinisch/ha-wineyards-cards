function St(n) {
  window.customCards = window.customCards || [], window.customCards.some((t) => t.type === n.type) || window.customCards.push(n);
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, nt = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = Symbol(), pt = /* @__PURE__ */ new WeakMap();
let Et = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (nt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = pt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && pt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Rt = (n) => new Et(typeof n == "string" ? n : n + "", void 0, ot), rt = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[o + 1], n[0]);
  return new Et(e, n, ot);
}, Ut = (n, t) => {
  if (nt) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = j.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, _t = nt ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Rt(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Wt, defineProperty: Ft, getOwnPropertyDescriptor: Vt, getOwnPropertyNames: Gt, getOwnPropertySymbols: jt, getPrototypeOf: Bt } = Object, w = globalThis, mt = w.trustedTypes, qt = mt ? mt.emptyScript : "", Jt = w.reactiveElementPolyfillSupport, T = (n, t) => n, B = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? qt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, at = (n, t) => !Wt(n, t), ft = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: at };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ft) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Ft(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = Vt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: s, set(r) {
      const l = s?.call(this);
      o?.call(this, r), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ft;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const t = Bt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const e = this.properties, i = [...Gt(e), ...jt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(_t(s));
    } else t !== void 0 && e.push(_t(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ut(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : B).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : B;
      this._$Em = s;
      const l = r.fromAttribute(e, o.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? at)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, o] of i) {
        const { wrapped: r } = o, l = this[s];
        r !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[T("elementProperties")] = /* @__PURE__ */ new Map(), S[T("finalized")] = /* @__PURE__ */ new Map(), Jt?.({ ReactiveElement: S }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, gt = (n) => n, q = M.trustedTypes, wt = q ? q.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Ct = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, kt = "?" + g, Yt = `<${kt}>`, $ = document, D = () => $.createComment(""), N = (n) => n === null || typeof n != "object" && typeof n != "function", lt = Array.isArray, Kt = (n) => lt(n) || typeof n?.[Symbol.iterator] == "function", et = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, vt = /-->/g, yt = />/g, v = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), bt = /'/g, $t = /"/g, Pt = /^(?:script|style|textarea|title)$/i, Zt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), _ = Zt(1), E = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), xt = /* @__PURE__ */ new WeakMap(), y = $.createTreeWalker($, 129);
function Tt(n, t) {
  if (!lt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return wt !== void 0 ? wt.createHTML(t) : t;
}
const Qt = (n, t) => {
  const e = n.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = P;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let h, d, c = -1, p = 0;
    for (; p < a.length && (r.lastIndex = p, d = r.exec(a), d !== null); ) p = r.lastIndex, r === P ? d[1] === "!--" ? r = vt : d[1] !== void 0 ? r = yt : d[2] !== void 0 ? (Pt.test(d[2]) && (s = RegExp("</" + d[2], "g")), r = v) : d[3] !== void 0 && (r = v) : r === v ? d[0] === ">" ? (r = s ?? P, c = -1) : d[1] === void 0 ? c = -2 : (c = r.lastIndex - d[2].length, h = d[1], r = d[3] === void 0 ? v : d[3] === '"' ? $t : bt) : r === $t || r === bt ? r = v : r === vt || r === yt ? r = P : (r = v, s = void 0);
    const m = r === v && n[l + 1].startsWith("/>") ? " " : "";
    o += r === P ? a + Yt : c >= 0 ? (i.push(h), a.slice(0, c) + Ct + a.slice(c) + g + m) : a + g + (c === -2 ? l : m);
  }
  return [Tt(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class I {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [h, d] = Qt(t, e);
    if (this.el = I.createElement(h, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = y.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Ct)) {
          const p = d[r++], m = s.getAttribute(c).split(g), A = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: o, name: A[2], strings: m, ctor: A[1] === "." ? te : A[1] === "?" ? ee : A[1] === "@" ? ie : Y }), s.removeAttribute(c);
        } else c.startsWith(g) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (Pt.test(s.tagName)) {
          const c = s.textContent.split(g), p = c.length - 1;
          if (p > 0) {
            s.textContent = q ? q.emptyScript : "";
            for (let m = 0; m < p; m++) s.append(c[m], D()), y.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[p], D());
          }
        }
      } else if (s.nodeType === 8) if (s.data === kt) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(g, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += g.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = $.createElement("template");
    return i.innerHTML = t, i;
  }
}
function C(n, t, e = n, i) {
  if (t === E) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = N(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = C(n, s._$AS(n, t.values), s, i)), t;
}
class Xt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? $).importNode(e, !0);
    y.currentNode = s;
    let o = y.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let h;
        a.type === 2 ? h = new R(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new se(o, this, t)), this._$AV.push(h), a = i[++l];
      }
      r !== a?.index && (o = y.nextNode(), r++);
    }
    return y.currentNode = $, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = C(this, t, e), N(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T($.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = I.createElement(Tt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const o = new Xt(s, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = xt.get(t.strings);
    return e === void 0 && xt.set(t.strings, e = new I(t)), e;
  }
  k(t) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new R(this.O(D()), this.O(D()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = gt(t).nextSibling;
      gt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Y {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = C(this, t, e, 0), r = !N(t) || t !== this._$AH && t !== E, r && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = C(this, l[i + a], e, a), h === E && (h = this._$AH[a]), r || (r = !N(h) || h !== this._$AH[a]), h === u ? t = u : t !== u && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class te extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class ee extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class ie extends Y {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? u) === E) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class se {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const ne = M.litHtmlPolyfillSupport;
ne?.(I, R), (M.litHtmlVersions ?? (M.litHtmlVersions = [])).push("3.3.2");
const oe = (n, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = s = new R(t.insertBefore(D(), o), o, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis;
class b extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = oe(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return E;
  }
}
b._$litElement$ = !0, b.finalized = !0, O.litElementHydrateSupport?.({ LitElement: b });
const re = O.litElementPolyfillSupport;
re?.({ LitElement: b });
(O.litElementVersions ?? (O.litElementVersions = [])).push("4.2.2");
const Mt = "wineyard-tile-button", V = `custom:${Mt}`, J = class J extends b {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(t) {
    const e = { ...t || {} }, i = (e.type || "").trim();
    e.type = V, e.tap_action || (e.tap_action = { action: "more-info" }), (!e.count_domains || !Array.isArray(e.count_domains) || e.count_domains.length === 0) && (e.count_domains = ["light"]), e.show_off_duration === void 0 && (e.show_off_duration = !0), e.show_on_total === void 0 && (e.show_on_total = !1), e.on_label || (e.on_label = "on"), e.off_label || (e.off_label = "Off"), this._config = e;
  }
  _fire(t) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _setValue(t, e) {
    const i = t.split("."), s = { ...this._config };
    let o = s;
    for (let l = 0; l < i.length - 1; l++) {
      const a = i[l];
      o[a] = { ...o[a] ?? {} }, o = o[a];
    }
    const r = i[i.length - 1];
    e === "" || e === void 0 || e === null ? delete o[r] : o[r] = e, s.type = V, this._config = s, this._fire(this._config);
  }
  _getValue(t) {
    const e = t.split(".");
    let i = this._config;
    for (const s of e) i = i?.[s];
    return i;
  }
  _onText(t, e) {
    const i = e.target.value;
    this._setValue(t, i);
  }
  _onNumber(t, e) {
    const i = e.target.value, s = Number(i);
    this._setValue(t, Number.isFinite(s) ? s : void 0);
  }
  _onBool(t, e) {
    const i = e.target.checked ?? e.target.checked;
    this._setValue(t, !!i);
  }
  _onEntityPicked(t) {
    this._setValue("entity", t?.detail?.value ?? "");
  }
  _onIconPicked(t) {
    this._setValue("icon", t?.detail?.value ?? "");
  }
  _onTapActionSelected(t) {
    const e = t?.target?.value ?? t?.detail?.value ?? "more-info", i = this._config.tap_action ?? {};
    let s;
    e === "navigate" ? s = { action: e, navigation_path: i.navigation_path ?? "" } : e === "call-service" ? s = { action: e, service: i.service ?? "", service_data: i.service_data ?? void 0 } : s = { action: e }, this._setValue("tap_action", s);
  }
  _parseDomains(t) {
    return (t || "").split(",").map((e) => e.trim()).filter(Boolean);
  }
  _stringifyJson(t) {
    if (!t) return "";
    try {
      return JSON.stringify(t);
    } catch {
      return "";
    }
  }
  _onServiceDataJson(t) {
    const e = t.target.value?.trim();
    if (!e) {
      this._setValue("tap_action.service_data", void 0);
      return;
    }
    try {
      const i = JSON.parse(e);
      this._setValue("tap_action.service_data", i);
    } catch {
    }
  }
  _tapActionExtra(t) {
    return t === "navigate" ? _`
        <ha-textfield
          label="Navigation path"
          .value=${this._getValue("tap_action.navigation_path") ?? ""}
          @input=${(e) => this._onText("tap_action.navigation_path", e)}
        ></ha-textfield>
        <div class="hint">Beispiel: /lovelace/home</div>
      ` : t === "call-service" ? _`
        <ha-textfield
          label="Service (domain.service)"
          .value=${this._getValue("tap_action.service") ?? ""}
          @input=${(e) => this._onText("tap_action.service", e)}
        ></ha-textfield>

        <ha-textfield
          label="Service data (JSON)"
          .value=${this._stringifyJson(this._getValue("tap_action.service_data"))}
          @input=${(e) => this._onServiceDataJson(e)}
        ></ha-textfield>

        <div class="hint">Beispiel: {"entity_id":"light.kitchen","brightness":200}</div>
      ` : u;
  }
  render() {
    if (!this.hass) return _``;
    const t = this._getValue("tap_action.action") ?? "more-info", e = (this._config.count_domains ?? ["light"]).join(",");
    return _`
      <div class="root">
        <div class="section">
          <div class="section-title">Basic</div>
          <div class="row">
            <ha-entity-picker
              label="Entity"
              .hass=${this.hass}
              .value=${this._config.entity ?? ""}
              @value-changed=${(i) => this._onEntityPicked(i)}
              allow-custom-entity
            ></ha-entity-picker>

            <ha-icon-picker
              label="Icon (optional)"
              .hass=${this.hass}
              .value=${this._config.icon ?? ""}
              @value-changed=${(i) => this._onIconPicked(i)}
            ></ha-icon-picker>

            <ha-textfield
              label="Title (optional)"
              .value=${this._config.title ?? ""}
              @input=${(i) => this._onText("title", i)}
            ></ha-textfield>

            <ha-textfield
              label="Subtitle (optional)"
              .value=${this._config.subtitle ?? ""}
              @input=${(i) => this._onText("subtitle", i)}
            ></ha-textfield>
            <div class="hint">
              Leer lassen = Auto-Subtitle (Gruppe: Anzahl an / Heizung: Heat – 21° / etc.)
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Tap Action</div>
          <div class="row">
            <ha-select
              label="Action"
              .value=${t}
              @selected=${(i) => this._onTapActionSelected(i)}
              @closed=${(i) => this._onTapActionSelected(i)}
            >
              <mwc-list-item value="more-info">More info</mwc-list-item>
              <mwc-list-item value="toggle">Toggle</mwc-list-item>
              <mwc-list-item value="navigate">Navigate</mwc-list-item>
              <mwc-list-item value="call-service">Call service</mwc-list-item>
              <mwc-list-item value="none">None</mwc-list-item>
            </ha-select>

            ${this._tapActionExtra(t)}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Group / Collection subtitle</div>

          <div class="row">
            <ha-textfield
              label="Count domains (comma separated)"
              .value=${e}
              @input=${(i) => this._setValue(
      "count_domains",
      this._parseDomains(i.target.value)
    )}
            ></ha-textfield>
            <div class="hint">Beispiele: light | light,switch | switch</div>

            <div class="switchrow">
              <div class="label">
                <div class="t">Show total</div>
                <div class="s">9/12 on statt 9 Lights on</div>
              </div>
              <ha-switch
                .checked=${this._config.show_on_total ?? !1}
                @change=${(i) => this._onBool("show_on_total", i)}
              ></ha-switch>
            </div>

            <div class="switchrow">
              <div class="label">
                <div class="t">Show off duration</div>
                <div class="s">Off – 10m, wenn alle aus</div>
              </div>
              <ha-switch
                .checked=${this._config.show_off_duration ?? !0}
                @change=${(i) => this._onBool("show_off_duration", i)}
              ></ha-switch>
            </div>

            <ha-textfield
              label='On label (default: "on")'
              .value=${this._config.on_label ?? "on"}
              @input=${(i) => this._onText("on_label", i)}
            ></ha-textfield>

            <ha-textfield
              label='Off label (default: "Off")'
              .value=${this._config.off_label ?? "Off"}
              @input=${(i) => this._onText("off_label", i)}
            ></ha-textfield>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Defaults</div>
          <div class="row">
            <ha-textfield
              label="Layout columns (Sections, default 2)"
              type="number"
              .value=${String(this._config.layout_options?.grid_columns ?? 2)}
              @change=${(i) => this._setValue("layout_options.grid_columns", Number(i.target.value))}
            ></ha-textfield>

            <ha-textfield
              label="Layout rows (Sections, default 2)"
              type="number"
              .value=${String(this._config.layout_options?.grid_rows ?? 2)}
              @change=${(i) => this._setValue("layout_options.grid_rows", Number(i.target.value))}
            ></ha-textfield>

            <div class="hint">
              Hinweis: Home Assistant speichert Grid-Position/Größe oft im Dashboard – diese Werte
              gelten vor allem beim Hinzufügen / als Default.
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
J.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 }
}, J.styles = rt`
    .root {
      display: grid;
      gap: 14px;
    }

    .section {
      display: grid;
      gap: 10px;
      padding: 12px;
      border-radius: 12px;
      background: var(--card-background-color, var(--ha-card-background, rgba(0, 0, 0, 0.04)));
    }

    .section-title {
      font-size: 12px;
      opacity: 0.75;
      letter-spacing: 0.02em;
      margin-bottom: 2px;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .hint {
      font-size: 12px;
      opacity: 0.7;
      line-height: 1.25;
      margin-top: -6px;
    }

    .switchrow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .switchrow .label {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .switchrow .label .t {
      font-size: 14px;
      line-height: 1.2;
    }

    .switchrow .label .s {
      font-size: 12px;
      opacity: 0.7;
      line-height: 1.2;
    }
  `;
let st = J;
customElements.get("wineyard-tile-button-editor") || customElements.define("wineyard-tile-button-editor", st);
const H = "wineyard-tile-button", G = `custom:${H}`, ae = "wineyard-tile-button-editor";
class le extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  static getConfigElement() {
    return document.createElement(ae);
  }
  static getLayoutOptions() {
    return { grid_columns: 2, grid_rows: 2 };
  }
  static getStubConfig() {
    return {
      type: G,
      layout_options: { grid_columns: 2, grid_rows: 2 },
      entity: "",
      icon: "mdi:lightbulb",
      title: "Kitchen Lights",
      // subtitle intentionally omitted => auto
      tap_action: { action: "more-info" },
      count_domains: ["light"],
      show_off_duration: !0,
      show_on_total: !1,
      on_label: "on",
      off_label: "Off"
    };
  }
  setConfig(t) {
    if (!t) throw new Error("Invalid config");
    const e = (t.type || "").trim(), i = G;
    this._config = {
      type: i,
      entity: "",
      icon: "",
      title: "",
      subtitle: void 0,
      tap_action: { action: "more-info" },
      count_domains: ["light"],
      show_off_duration: !0,
      show_on_total: !1,
      on_label: "on",
      off_label: "Off",
      layout_options: t.layout_options ?? { grid_columns: 2, grid_rows: 2 },
      ...t,
      type: i
    }, this._render();
  }
  set hass(t) {
    this._hass = t, this._render();
  }
  // ---------- helpers (subtitle + actions) ----------
  _escapeHtml(t) {
    return String(t ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  _domain(t) {
    const e = t.indexOf(".");
    return e > 0 ? t.slice(0, e) : "";
  }
  _minutesSince(t) {
    const e = t ? Date.parse(t) : NaN;
    return Number.isFinite(e) ? Math.max(0, Math.floor((Date.now() - e) / 6e4)) : 0;
  }
  _isGroupLike(t) {
    const e = t?.attributes?.entity_id;
    return Array.isArray(e) && e.length > 0;
  }
  /**
   * Generic "is on/active" check.
   * Extend anytime you want better domain semantics.
   */
  _isOnState(t, e) {
    return e ? e === "on" ? !0 : t === "cover" ? e === "open" || e === "opening" : t === "lock" ? e === "unlocked" : t === "media_player" ? e === "playing" : t === "alarm_control_panel" ? e !== "disarmed" : t === "climate" ? e !== "off" && e !== "idle" : t === "vacuum" ? e === "cleaning" || e === "returning" : !1 : !1;
  }
  _titleForDomain(t, e) {
    const s = {
      light: "Light",
      switch: "Switch",
      fan: "Fan",
      cover: "Cover",
      lock: "Lock",
      media_player: "Player",
      vacuum: "Vacuum",
      climate: "Climate"
    }[t] ?? "Device";
    return e === 1 ? s : `${s}s`;
  }
  _formatClimateSubtitle(t) {
    const e = String(t?.state ?? "").toLowerCase(), i = t?.attributes?.temperature, s = this._hass?.config?.unit_system?.temperature === "°F" ? "°F" : "°", o = e === "heat" ? "Heat" : e === "cool" ? "Cool" : e === "auto" ? "Auto" : e === "off" ? "Off" : e ? e.charAt(0).toUpperCase() + e.slice(1) : "Climate";
    return i != null && i !== "" ? `${o} – ${i}${s}` : o;
  }
  _buildGroupSubtitle(t) {
    const e = this._config, i = this._hass, s = t?.attributes?.entity_id ?? [], o = (e.count_domains?.length ? e.count_domains : ["light"]).map(String);
    let r = 0, l = 0;
    for (const d of s) {
      const c = this._domain(d);
      if (!c || o.length && !o.includes(c)) continue;
      const p = i?.states?.[d];
      p && (l++, this._isOnState(c, p.state) && r++);
    }
    if (l === 0)
      for (const d of s) {
        const c = this._domain(d), p = i?.states?.[d];
        p && (l++, this._isOnState(c, p.state) && r++);
      }
    if (r > 0) {
      const d = e.on_label ?? "on";
      if (e.show_on_total) return `${r}/${l} ${d}`;
      if ((e.count_domains?.length ?? 0) === 1) {
        const c = e.count_domains[0], p = this._titleForDomain(c, r);
        return `${r} ${p} ${d}`;
      }
      return `${r} ${d}`;
    }
    const a = e.off_label ?? "Off";
    if (e.show_off_duration === !1) return a;
    const h = this._minutesSince(t?.last_changed);
    return `${a}${h > 0 ? ` – ${h}m` : ""}`;
  }
  _buildSubtitle(t) {
    const e = this._config;
    if (e.subtitle !== void 0 && e.subtitle !== null && String(e.subtitle).trim() !== "")
      return String(e.subtitle);
    if (!t) return "";
    const i = (e.entity || "").trim();
    return this._domain(i) === "climate" ? this._formatClimateSubtitle(t) : this._isGroupLike(t) ? this._buildGroupSubtitle(t) : String(t.state ?? "");
  }
  _handleTap() {
    const t = this._config, e = this._hass;
    if (!e) return;
    const i = t.tap_action?.action ?? "more-info", s = (t.entity || "").trim();
    if (i !== "none") {
      if (i === "toggle") {
        if (!s) return;
        const o = this._domain(s);
        if (!o) return;
        e.callService(o, "toggle", { entity_id: s });
        return;
      }
      if (i === "navigate") {
        const o = t.tap_action?.navigation_path;
        o && (history.pushState(null, "", o), window.dispatchEvent(new Event("location-changed")));
        return;
      }
      if (i === "call-service") {
        const o = t.tap_action?.service || "", [r, l] = o.split(".");
        if (!r || !l) return;
        const a = t.tap_action?.service_data ?? {};
        e.callService(r, l, a);
        return;
      }
      if (s) {
        const o = new Event("hass-more-info", { bubbles: !0, composed: !0 });
        o.detail = { entityId: s }, this.dispatchEvent(o);
      }
    }
  }
  // ---------- render ----------
  _render() {
    if (!this.shadowRoot || !this._config) return;
    const t = this._config, i = this._hass?.states?.[t.entity || ""] ?? null, s = t.icon || i?.attributes?.icon || "mdi:gesture-tap-button", o = t.title || i?.attributes?.friendly_name || "Title", r = this._buildSubtitle(i), l = this._escapeHtml(s), a = this._escapeHtml(o), h = this._escapeHtml(r);
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card{
          border-radius:16px;
          padding:16px;
          height:100%;
          min-height:150px;
          cursor:pointer;
          -webkit-tap-highlight-color: transparent;
          user-select:none;
        }
        .wrap{ display:flex; flex-direction:column; gap:12px; }
        ha-icon{
          --mdc-icon-size: 50px;
          color: var(--primary-text-color);
        }
        .title{ font-size:1.08rem; font-weight:650; line-height:1.15; }
        .subtitle{ font-size:.92rem; opacity:.65; line-height:1.15; }
        ha-card:active{ transform: scale(0.99); }
      </style>

      <ha-card>
        <div class="wrap">
          <div><ha-icon icon="${l}"></ha-icon></div>
          <div>
            <div class="title">${a}</div>
            <div class="subtitle">${h}</div>
          </div>
        </div>
      </ha-card>
    `, this.shadowRoot.querySelector("ha-card")?.addEventListener("click", () => this._handleTap());
  }
  getCardSize() {
    return 2;
  }
}
customElements.get(H) || customElements.define(H, le);
St({
  type: H,
  name: "Wineyard Tile Button (2x2)",
  description: "2x2 tile button with icon, title and smart subtitle (groups, climate, etc.).",
  preview: !0
});
const At = "wineyards-security-overview";
class ce extends HTMLElement {
  constructor() {
    super(), this._built = !1, this._el = { hasIconPicker: !1 };
  }
  setConfig(t) {
    this._config = {
      type: At,
      title: "Security",
      alarm_entity: "",
      pending_timeout_s: 30,
      doors_windows_entity: "",
      doors_windows_title: "Doors / Windows",
      doors_windows_icon: "mdi:door",
      windows_entity: "",
      windows_label: "Windows",
      windows_icon: "mdi:window-closed-variant",
      ...t
    }, this._buildOrSync();
  }
  set hass(t) {
    this._hass = t, this._buildOrSync();
  }
  _buildOrSync() {
    if (!this._hass || !this._config) return;
    const t = !!customElements.get("ha-icon-picker");
    this._el.hasIconPicker = t, this._built ? (this._el.alarmPicker && (this._el.alarmPicker.hass = this._hass), this._el.groupPicker && (this._el.groupPicker.hass = this._hass), this._el.windowsPicker && (this._el.windowsPicker.hass = this._hass)) : (this.innerHTML = `
        <div class="wy-editor">
          <ha-textfield class="wy-input" label="Title"></ha-textfield>
          <ha-entity-picker class="wy-input" label="Alarm entity"></ha-entity-picker>
          <ha-textfield class="wy-input" label="Pending timeout (seconds)" type="number"></ha-textfield>

          <div class="wy-sep">Doors / Windows (Group preferred)</div>
          <ha-entity-picker class="wy-input" label="Doors/Windows group (group.*)"></ha-entity-picker>
          <ha-textfield class="wy-input" label="Doors/Windows title"></ha-textfield>

          ${t ? '<ha-icon-picker class="wy-input" label="Doors/Windows icon"></ha-icon-picker>' : '<ha-textfield class="wy-input" label="Doors/Windows icon (mdi:...)"></ha-textfield>'}

          <div class="wy-sep">Fallback (single entity)</div>
          <ha-entity-picker class="wy-input" label="Windows entity (optional)"></ha-entity-picker>
          <ha-textfield class="wy-input" label="Windows label"></ha-textfield>

          ${t ? '<ha-icon-picker class="wy-input" label="Windows icon"></ha-icon-picker>' : '<ha-textfield class="wy-input" label="Windows icon (mdi:...)"></ha-textfield>'}

          <div class="wy-hint">
            Wenn eine Gruppe gesetzt ist, zeigt die Karte offene Türen/Fenster.
            Ohne Gruppe nutzt sie optional die einzelne Windows-Entität als schnelle Anzeige.
          </div>
        </div>

        <style>
          .wy-editor{ display:grid; gap:16px; }
          .wy-input{ width:100%; }
          .wy-sep{ opacity:0.7; font-size:12px; margin-top:4px; }
          .wy-hint{ opacity:0.7; font-size:12px; line-height:1.35; }
        </style>
      `, this._el.title = this.querySelector('ha-textfield[label="Title"]'), this._el.timeout = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]'), this._el.alarmPicker = this.querySelector('ha-entity-picker[label="Alarm entity"]'), this._el.groupPicker = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]'), this._el.windowsPicker = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]'), this._el.groupTitle = this.querySelector('ha-textfield[label="Doors/Windows title"]'), this._el.windowsLabel = this.querySelector('ha-textfield[label="Windows label"]'), this._el.doorsIconEl = t ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]') : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]'), this._el.windowsIconEl = t ? this.querySelector('ha-icon-picker[label="Windows icon"]') : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]'), this._el.alarmPicker && (this._el.alarmPicker.hass = this._hass, this._el.alarmPicker.includeDomains = ["alarm_control_panel"]), this._el.groupPicker && (this._el.groupPicker.hass = this._hass, this._el.groupPicker.includeDomains = ["group"]), this._el.windowsPicker && (this._el.windowsPicker.hass = this._hass, this._el.windowsPicker.includeDomains = ["binary_sensor", "cover", "lock", "sensor"]), this._attachListeners(), this._built = !0), this._syncValues();
  }
  _isFocused(t) {
    const e = this.getRootNode()?.activeElement || document.activeElement;
    return t === e || t?.contains && t.contains(e);
  }
  _setIfChanged(t, e) {
    if (!t || this._isFocused(t)) return;
    const i = t.value ?? "", s = e ?? "";
    String(i) !== String(s) && (t.value = s);
  }
  _syncValues() {
    const t = this._config;
    this._setIfChanged(this._el.title, t.title ?? "Security"), this._setIfChanged(this._el.timeout, String(Number(t.pending_timeout_s ?? 30))), this._setIfChanged(this._el.alarmPicker, t.alarm_entity || ""), this._setIfChanged(this._el.groupPicker, t.doors_windows_entity || ""), this._setIfChanged(this._el.windowsPicker, t.windows_entity || ""), this._setIfChanged(this._el.groupTitle, t.doors_windows_title ?? "Doors / Windows"), this._setIfChanged(this._el.windowsLabel, t.windows_label ?? "Windows"), this._setIfChanged(this._el.doorsIconEl, t.doors_windows_icon ?? "mdi:door"), this._setIfChanged(this._el.windowsIconEl, t.windows_icon ?? "mdi:window-closed-variant");
  }
  _attachListeners() {
    this._el.title?.addEventListener(
      "input",
      (t) => this._update({ title: t.target.value })
    ), this._el.timeout?.addEventListener("input", (t) => {
      const e = Number(t.target.value);
      this._update({ pending_timeout_s: Number.isFinite(e) ? e : 30 });
    }), this._el.alarmPicker?.addEventListener(
      "value-changed",
      (t) => this._update({ alarm_entity: t.detail?.value || "" })
    ), this._el.groupPicker?.addEventListener(
      "value-changed",
      (t) => this._update({ doors_windows_entity: t.detail?.value || "" })
    ), this._el.windowsPicker?.addEventListener(
      "value-changed",
      (t) => this._update({ windows_entity: t.detail?.value || "" })
    ), this._el.groupTitle?.addEventListener(
      "input",
      (t) => this._update({ doors_windows_title: t.target.value })
    ), this._el.windowsLabel?.addEventListener(
      "input",
      (t) => this._update({ windows_label: t.target.value })
    ), this._el.doorsIconEl?.addEventListener(
      "value-changed",
      (t) => this._update({ doors_windows_icon: t.detail?.value ?? t.target.value })
    ), this._el.doorsIconEl?.addEventListener(
      "input",
      (t) => this._update({ doors_windows_icon: t.target.value })
    ), this._el.windowsIconEl?.addEventListener(
      "value-changed",
      (t) => this._update({ windows_icon: t.detail?.value ?? t.target.value })
    ), this._el.windowsIconEl?.addEventListener(
      "input",
      (t) => this._update({ windows_icon: t.target.value })
    );
  }
  _update(t) {
    this._config = { ...this._config, ...t, type: At }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
}
customElements.get("wineyards-security-overview-editor") || customElements.define("wineyards-security-overview-editor", ce);
const L = "wineyards-security-overview", it = `custom:${L}`, he = "wineyards-security-overview-editor";
class de extends HTMLElement {
  constructor() {
    super(), this._unsubCallService = null, this._pendingArm = !1, this._pendingUntil = 0, this.attachShadow({ mode: "open" });
  }
  static getConfigElement() {
    return document.createElement(he);
  }
  static getStubConfig() {
    return {
      type: it,
      title: "Security",
      alarm_entity: "",
      pending_timeout_s: 30,
      doors_windows_entity: "",
      doors_windows_title: "Doors / Windows",
      doors_windows_icon: "mdi:door",
      windows_entity: "",
      windows_label: "Windows",
      windows_icon: "mdi:window-closed-variant"
    };
  }
  setConfig(t) {
    if (!t) throw new Error("Invalid config");
    this._config = {
      type: it,
      title: "Security",
      alarm_entity: "",
      pending_timeout_s: 30,
      doors_windows_entity: "",
      doors_windows_title: "Doors / Windows",
      doors_windows_icon: "mdi:door",
      windows_entity: "",
      windows_label: "Windows",
      windows_icon: "mdi:window-closed-variant",
      ...t
    }, this._config.type === L && (this._config.type = it), this._render();
  }
  set hass(t) {
    this._hass = t, !this._unsubCallService && t?.connection?.subscribeEvents && t.connection.subscribeEvents((e) => this._onHaEvent(e), "call_service").then((e) => this._unsubCallService = e).catch(() => this._unsubCallService = null), this._render();
  }
  disconnectedCallback() {
    try {
      this._unsubCallService?.();
    } catch {
    }
    this._unsubCallService = null;
  }
  getCardSize() {
    return 2;
  }
  _onHaEvent(t) {
    const e = this._config;
    if (!e || !this._hass || !t?.data) return;
    const { domain: i, service: s, service_data: o } = t.data;
    if (i !== "alarm_control_panel" || s !== "alarm_arm_away") return;
    const r = (e.alarm_entity || "").trim();
    if (!r) return;
    const l = o?.entity_id;
    if (!(l === r || Array.isArray(l) && l.includes(r))) return;
    const h = Math.max(5, Number(e.pending_timeout_s || 30)) * 1e3;
    this._pendingArm = !0, this._pendingUntil = Date.now() + h, this._render();
  }
  _openMoreInfo(t) {
    if (!t) return;
    const e = new Event("hass-more-info", { bubbles: !0, composed: !0 });
    e.detail = { entityId: t }, this.dispatchEvent(e);
  }
  _getEntity(t) {
    if (!(!t || !this._hass))
      return this._hass.states[t];
  }
  _isOpenState(t) {
    const e = t?.state;
    return e === "on" || e === "open" || e === "opening";
  }
  _getGroupMembers(t) {
    const i = this._getEntity(t)?.attributes?.entity_id;
    return Array.isArray(i) ? i : [];
  }
  _formatName(t) {
    return this._getEntity(t)?.attributes?.friendly_name || t;
  }
  _formatAlarmState(t) {
    switch (t) {
      case "disarmed":
        return "deaktiviert";
      case "arming":
        return "wird aktiviert";
      case "armed_home":
        return "zuhause";
      case "armed_away":
        return "abwesend";
      case "armed_night":
        return "nacht";
      case "armed_vacation":
        return "urlaub";
      case "triggered":
        return "ausgelöst";
      case "unavailable":
        return "unavailable";
      default:
        return t || "unknown";
    }
  }
  _formatQuickState(t) {
    return t ? t === "on" ? "open" : t === "off" ? "closed" : t : "unknown";
  }
  _escapeHtml(t) {
    return String(t ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  _render() {
    if (!this.shadowRoot || !this._config || !this._hass) return;
    const t = this._config, e = (t.alarm_entity || "").trim(), s = this._getEntity(e)?.state ?? (e ? "unknown" : "not_set"), o = Date.now(), r = typeof s == "string" && s.startsWith("armed_"), l = s === "arming";
    (this._pendingArm && o > (this._pendingUntil || 0) || r) && (this._pendingArm = !1, this._pendingUntil = 0), l && (this._pendingArm = !0);
    const h = this._pendingArm && !r, c = !(s === "disarmed" || s === "unknown" || s === "unavailable" || s === "not_set") && !h, p = h ? "#ff9800" : c ? "#4caf50" : "#f44336", m = h ? "Wird aktiviert" : c ? "Aktiv" : "Inaktiv", A = h ? "mdi:shield-sync-outline" : c ? "mdi:shield-lock" : "mdi:shield-off", Dt = c || h ? "Deaktivieren" : "Aktivieren", Nt = c || h ? "mdi:shield-off-outline" : "mdi:shield-check", Z = (t.doors_windows_entity || "").trim(), W = (t.windows_entity || "").trim(), F = !!Z, It = F ? (t.doors_windows_title || "Doors / Windows").trim() || "Doors / Windows" : (t.windows_label || "Windows").trim() || "Windows", Ht = F ? t.doors_windows_icon || "mdi:door" : t.windows_icon || "mdi:window-closed-variant";
    let Q = "nicht gesetzt", X = "";
    if (F) {
      const tt = this._getGroupMembers(Z).map((f) => ({ id: f, ent: this._getEntity(f) })).filter((f) => this._isOpenState(f.ent));
      Q = tt.length === 0 ? "Keine offen" : `${tt.length} offen`;
      const ut = tt.slice(0, 4).map((f) => this._escapeHtml(this._formatName(f.id)));
      X = ut.length > 0 ? `<div class="wy-openlist">${ut.map((f) => `<span class="wy-chip">${f}</span>`).join("")}</div>` : '<div class="wy-openlist wy-muted2"></div>';
    } else if (W) {
      const k = this._getEntity(W);
      Q = this._formatQuickState(k?.state ?? "unknown"), X = '<div class="wy-openlist wy-muted2"></div>';
    }
    const dt = !e;
    this.shadowRoot.innerHTML = `
      <ha-card class="wy-card">
        <div class="wy-wrap">
          <div class="wy-title">${this._escapeHtml(t.title)}</div>

          ${dt ? '<div class="wy-setup">Bitte im Editor eine Alarm-Entität auswählen (alarm_control_panel).</div>' : ""}

          <div class="wy-grid">
            <div class="wy-item wy-status" style="--status-color:${p}">
              <ha-icon icon="${A}"></ha-icon>
              <div class="wy-label">Alarm</div>
              <div class="wy-state">${this._escapeHtml(m)}</div>
            </div>

            <div class="wy-item wy-action ${dt ? "wy-disabled" : ""}" role="button" tabindex="0">
              <ha-icon icon="${Nt}"></ha-icon>
              <div class="wy-label">${this._escapeHtml(Dt)}</div>
              <div class="wy-state wy-muted">${this._escapeHtml(this._formatAlarmState(s))}</div>
            </div>

            <div class="wy-item wy-col3 ${F || W ? "" : "wy-disabled"}" role="button" tabindex="0">
              <ha-icon icon="${this._escapeHtml(Ht)}"></ha-icon>
              <div class="wy-label">${this._escapeHtml(It)}</div>
              <div class="wy-state">${this._escapeHtml(Q)}</div>
              ${X}
            </div>
          </div>
        </div>

        <style>
          .wy-card{
            background: var(--ha-card-background, var(--card-background-color));
            border-radius: var(--ha-card-border-radius, 12px);
            padding:18px 20px;
            color: var(--primary-text-color);
            font-family: var(--primary-font-family);
            box-shadow: var(--ha-card-box-shadow, var(--card-box-shadow));
          }
          .wy-wrap{ display:flex; flex-direction:column; width:100%; }
          .wy-title{ width:100%; font-size:20px; font-weight:300; margin:0 0 14px 0; line-height:1.2; }
          .wy-setup{
            margin: 0 0 12px 0;
            padding: 10px 12px;
            border-radius: 10px;
            background: rgba(255,255,255,0.06);
            font-size: 12px;
            font-weight: 300;
            opacity: 0.9;
          }
          .wy-grid{ display:grid; grid-template-columns: repeat(3, 1fr); width:100%; text-align:center; }
          .wy-item{ display:flex; flex-direction:column; align-items:center; gap:6px; user-select:none; min-width:0; -webkit-tap-highlight-color: transparent; padding: 2px 4px; }
          .wy-status{ cursor:default; }
          .wy-action, .wy-col3{ cursor:pointer; }
          ha-icon{ width:28px; height:28px; opacity:0.95; }
          .wy-label{ font-size:13px; font-weight:300; opacity:0.7; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
          .wy-state{ font-size:16px; font-weight:500; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
          .wy-muted{ font-size:12px; font-weight:300; opacity:0.6; }
          .wy-muted2{ font-size:11px; font-weight:300; opacity:0.55; }
          .wy-status ha-icon, .wy-status .wy-state{ color: var(--status-color); }
          .wy-openlist{ display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin-top: 2px; max-width:100%; }
          .wy-chip{ font-size: 10px; line-height: 1; padding: 4px 6px; border-radius: 999px; background: rgba(255,255,255,0.08); color: var(--primary-text-color); max-width: 100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .wy-action:hover, .wy-col3:hover{ opacity:0.88; }
          .wy-action:active, .wy-col3:active{ transform: scale(0.98); }
          .wy-disabled{ opacity:0.55; cursor:default; pointer-events:none; }
        </style>
      </ha-card>
    `;
    const Lt = this.shadowRoot.querySelector(".wy-action"), zt = this.shadowRoot.querySelector(".wy-col3");
    Lt?.addEventListener("click", () => {
      this._hass && e && (c || h ? this._hass.callService("alarm_control_panel", "alarm_disarm", { entity_id: e }) : this._openMoreInfo(e));
    }), zt?.addEventListener("click", () => {
      const k = Z || W;
      k && this._openMoreInfo(k);
    });
  }
}
customElements.get(L) || customElements.define(L, de);
St({
  type: L,
  name: "Wineyards Security Overview",
  description: "3-column security overview with doors/windows group + icon selection + stable editor",
  preview: !0
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ot = (n) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(n, t);
  }) : customElements.define(n, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: at }, pe = (n = ue, t, e) => {
  const { kind: i, metadata: s } = e;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), o.set(e.name, n), i === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, a, n, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, n, l), l;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(l) {
      const a = this[r];
      t.call(this, l), this.requestUpdate(r, a, n, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ct(n) {
  return (t, e) => typeof e == "object" ? pe(n, t, e) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function K(n) {
  return ct({ ...n, state: !0, attribute: !1 });
}
var _e = Object.defineProperty, me = Object.getOwnPropertyDescriptor, U = (n, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? me(t, e) : t, o = n.length - 1, r; o >= 0; o--)
    (r = n[o]) && (s = (i ? r(t, e, s) : r(s)) || s);
  return i && s && _e(t, e, s), s;
};
let x = class extends b {
  constructor() {
    super(...arguments), this._series = null, this._seriesFetchedAt = 0, this._fetchInFlight = null;
  }
  static getConfigElement() {
    return document.createElement("wineyard-climate-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:wineyard-climate-card",
      title: "Indoor Climate",
      icon: "mdi:thermometer",
      main_entity: "sensor.wohnzimmer_temperature",
      main_unit: "°C",
      main_decimals: 0,
      graph_entity: "sensor.wohnzimmer_temperature",
      graph_hours: 12,
      graph_points: 48,
      value_1: {
        label: "Humidity",
        entity: "sensor.wohnzimmer_humidity",
        unit: "%",
        min: 30,
        max: 70,
        decimals: 0
      },
      value_2: {
        label: "PM2.5",
        entity: "sensor.wohnzimmer_pm25",
        unit: "µg/m³",
        min: 0,
        max: 25,
        decimals: 1
      }
    };
  }
  setConfig(n) {
    if (!n?.main_entity) throw new Error("main_entity is required");
    if (!n?.value_1?.entity) throw new Error("value_1.entity is required");
    if (!n?.value_2?.entity) throw new Error("value_2.entity is required");
    this._config = {
      graph_hours: 12,
      graph_points: 48,
      ...n,
      graph_entity: n.graph_entity ?? n.main_entity
    }, this._series = null, this._seriesFetchedAt = 0;
  }
  getCardSize() {
    return 3;
  }
  updated() {
    if (!this._config?.graph_entity || !this.hass) return;
    const t = Date.now(), e = 5 * 60 * 1e3;
    (!this._series || t - this._seriesFetchedAt > e) && this._ensureSeries();
  }
  async _ensureSeries() {
    if (this._fetchInFlight) return this._fetchInFlight;
    const n = this._config.graph_entity;
    if (n)
      return this._fetchInFlight = (async () => {
        try {
          const t = this._config.graph_hours ?? 12, e = this._config.graph_points ?? 48, i = /* @__PURE__ */ new Date(), o = `history/period/${new Date(i.getTime() - t * 60 * 60 * 1e3).toISOString()}?filter_entity_id=${encodeURIComponent(n)}&end_time=${encodeURIComponent(i.toISOString())}`, r = await this.hass.callApi("GET", o), a = (Array.isArray(r) && Array.isArray(r[0]) ? r[0] : []).map((h) => parseFloat(h.state)).filter((h) => Number.isFinite(h));
          if (a.length === 0)
            this._series = null;
          else if (a.length <= e)
            this._series = a;
          else {
            const h = Math.max(1, Math.floor(a.length / e)), d = [];
            for (let c = 0; c < a.length; c += h) d.push(a[c]);
            this._series = d.slice(0, e);
          }
          this._seriesFetchedAt = Date.now();
        } catch {
          this._series = null;
        } finally {
          this._fetchInFlight = null;
        }
      })(), this._fetchInFlight;
  }
  _state(n) {
    if (!n) return null;
    const t = this.hass.states[n];
    return t ? t.state : null;
  }
  _num(n) {
    const t = this._state(n);
    if (t == null) return null;
    const e = parseFloat(t);
    return Number.isFinite(e) ? e : null;
  }
  _unitFromState(n) {
    if (!n) return null;
    const t = this.hass.states[n];
    return t ? t.attributes?.unit_of_measurement ?? null : null;
  }
  _formatNumber(n, t) {
    if (!Number.isFinite(n)) return "—";
    const e = t ?? 0;
    return n.toFixed(Math.max(0, Math.min(6, e)));
  }
  _clamp01(n) {
    return Math.max(0, Math.min(1, n));
  }
  _percent(n, t, e) {
    return !Number.isFinite(n) || !Number.isFinite(t) || !Number.isFinite(e) || e === t ? 0 : this._clamp01((n - t) / (e - t));
  }
  // green(120) -> red(0)
  _hslGreenToRed(n) {
    return `hsl(${(1 - n) * 120} 90% 55%)`;
  }
  _colorFor(n, t, e) {
    return this._hslGreenToRed(this._percent(n, t, e));
  }
  _renderSparkline() {
    const n = this._series;
    if (!n || n.length < 2)
      return _`<div class="graphPlaceholder"></div>`;
    const t = 560, e = 130, i = 0, s = Math.min(...n), r = Math.max(...n) - s || 1, l = n.map((d, c) => {
      const p = i + c / (n.length - 1) * (t - i * 2), m = i + (1 - (d - s) / r) * (e - i * 2);
      return { x: p, y: m };
    }), a = `M ${l.map((d) => `${d.x.toFixed(1)} ${d.y.toFixed(1)}`).join(" L ")}`, h = `M ${l[0].x.toFixed(1)} ${e} L ${l.map((d) => `${d.x.toFixed(1)} ${d.y.toFixed(1)}`).join(" L ")} L ${l[l.length - 1].x.toFixed(1)} ${e} Z`;
    return _`
      <svg class="spark" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="wyLineGrad" x1="0" x2="1">
            <stop offset="0%" stop-color="hsl(95 90% 60%)"></stop>
            <stop offset="45%" stop-color="hsl(75 90% 60%)"></stop>
            <stop offset="100%" stop-color="hsl(55 90% 60%)"></stop>
          </linearGradient>

          <linearGradient id="wyFillGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="hsl(95 90% 60% / .22)"></stop>
            <stop offset="100%" stop-color="hsl(95 90% 60% / 0)"></stop>
          </linearGradient>

          <filter id="wyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur"></feGaussianBlur>
            <feMerge>
              <feMergeNode in="blur"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>

        <path d="${h}" fill="url(#wyFillGrad)"></path>
        <path
          d="${a}"
          fill="none"
          stroke="url(#wyLineGrad)"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#wyGlow)"
        ></path>
      </svg>
    `;
  }
  /**
   * Dots like screenshot:
   * - 5 dots
   * - only ONE dot is "active" (not a progress bar)
   * - active dot color depends on where the value lies between min/max (green -> red)
   */
  _renderDots(n, t, e) {
    if (n == null)
      return _`
        <div class="dots">
          ${Array.from({ length: 5 }).map(
        () => _`<span class="dot" style="background: var(--disabled-text-color); opacity:.30"></span>`
      )}
        </div>
      `;
    const s = this._percent(n, t, e), o = Math.round(s * 4);
    return _`
      <div class="dots">
        ${Array.from({ length: 5 }).map((r, l) => {
      const a = l === o, h = this._hslGreenToRed(l / 4);
      return _`<span
            class="dot"
            style="
              background:${a ? h : "color-mix(in srgb, var(--primary-text-color) 14%, transparent)"};
              opacity:${a ? "1" : ".55"};
            "
          ></span>`;
    })}
      </div>
    `;
  }
  _renderBottomValue(n) {
    const t = this._num(n.entity), e = n.unit ?? this._unitFromState(n.entity) ?? "", i = t == null ? "var(--secondary-text-color)" : this._colorFor(t, n.min, n.max), s = n.label ?? "", o = t == null ? "—" : this._formatNumber(t, n.decimals);
    return _`
      <div class="bottomCell">
        <div class="bottomLabel">${s}</div>

        <div class="bottomMid">
          <div class="bottomValueStack">
            <div class="bottomNumber" style="color:${i}">${o}</div>
            <div class="bottomUnit">${e}</div>
          </div>

          <div class="bottomDots">
            ${this._renderDots(t, n.min, n.max)}
          </div>
        </div>
      </div>
    `;
  }
  render() {
    if (!this._config) return u;
    const n = this._config.title ?? "Indoor Climate", t = this._config.icon, e = this._num(this._config.main_entity), i = this._config.main_unit ?? this._unitFromState(this._config.main_entity) ?? "", s = e == null ? "—" : `${this._formatNumber(e, this._config.main_decimals)}${i ? " " + i : ""}`;
    return _`
      <ha-card class="cardRoot">
        <div class="cardInner">
          <div class="topRow">
            <div class="title">${n}</div>
            ${t ? _`<ha-icon class="topIcon" icon="${t}"></ha-icon>` : u}
          </div>

          <div class="mainValue">${s}</div>

          <div class="graphWrap">
            ${this._renderSparkline()}
          </div>

          <div class="bottomRow">
            ${this._renderBottomValue(this._config.value_1)}
            ${this._renderBottomValue(this._config.value_2)}
          </div>
        </div>
      </ha-card>
    `;
  }
};
x.styles = rt`
    :host {
      display: block;
    }

    ha-card.cardRoot {
      border-radius: 26px;
      overflow: hidden;
      background: color-mix(in srgb, var(--ha-card-background, var(--card-background-color)) 92%, black);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
    }

    .cardInner {
      padding: 18px 18px 16px;
    }

    .topRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 6px;
    }

    .title {
      font-size: 18px;
      font-weight: 500;
      opacity: 0.72;
      letter-spacing: 0.2px;
    }

    .topIcon {
      opacity: 0.72;
      --mdc-icon-size: 22px;
    }

    .mainValue {
      font-size: 54px;
      font-weight: 300;
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin: 0 0 12px;
    }

    /* Graph: no padding/margin inside */
    .graphWrap {
      height: 130px;
      width: 100%;
      border-radius: 18px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-background-color) 65%, transparent);
      padding: 0;
      margin: 0;
    }

    .spark {
      width: 100%;
      height: 100%;
      display: block;
      margin: 0;
    }

    .graphPlaceholder {
      width: 100%;
      height: 100%;
      opacity: 0.35;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--primary-text-color) 10%, transparent),
        transparent
      );
    }

    /* Bottom like screenshot: two columns with center divider */
    .bottomRow {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      margin-top: 14px;
    }

    .bottomRow > .bottomCell:first-child {
      padding-right: 14px;
      border-right: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }

    .bottomRow > .bottomCell:last-child {
      padding-left: 14px;
    }

    .bottomCell {
      padding-top: 4px;
    }

    .bottomLabel {
      font-size: 14px;
      opacity: 0.65;
      margin-bottom: 8px;
    }

    .bottomMid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .bottomValueStack {
      display: grid;
      gap: 4px;
    }

    .bottomNumber {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1;
    }

    .bottomUnit {
      font-size: 12px;
      opacity: 0.6;
      line-height: 1;
    }

    .bottomDots {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .dots {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      display: inline-block;
    }
  `;
U([
  ct({ attribute: !1 })
], x.prototype, "hass", 2);
U([
  K()
], x.prototype, "_config", 2);
U([
  K()
], x.prototype, "_series", 2);
U([
  K()
], x.prototype, "_seriesFetchedAt", 2);
x = U([
  Ot("wineyard-climate-card")
], x);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "wineyard-climate-card",
  name: "Wineyard Climate Card",
  description: "Climate card with sparkline (no padding) and two min/max dot-scored values (green→red)."
});
var fe = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, ht = (n, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? ge(t, e) : t, o = n.length - 1, r; o >= 0; o--)
    (r = n[o]) && (s = (i ? r(t, e, s) : r(s)) || s);
  return i && s && fe(t, e, s), s;
};
let z = class extends b {
  setConfig(n) {
    this._config = {
      graph_hours: 12,
      graph_points: 48,
      ...n,
      graph_entity: n.graph_entity ?? n.main_entity
    };
  }
  _emit(n) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: n },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onMainChanged(n) {
    const t = n.detail?.value;
    if (!t) return;
    const e = {
      graph_hours: 12,
      graph_points: 48,
      ...t,
      type: this._config?.type ?? t.type,
      graph_entity: t.graph_entity ?? t.main_entity
    };
    this._config = e, this._emit(this._config);
  }
  _onValue1Changed(n) {
    const t = n.detail?.value, e = { ...this._config, value_1: t.value_1 };
    this._config = e, this._emit(this._config);
  }
  _onValue2Changed(n) {
    const t = n.detail?.value, e = { ...this._config, value_2: t.value_2 };
    this._config = e, this._emit(this._config);
  }
  render() {
    if (!this.hass || !this._config) return u;
    const n = [
      { name: "title", label: "Title", selector: { text: {} } },
      { name: "icon", label: "Top right icon", selector: { icon: {} } },
      { type: "divider" },
      { type: "section", label: "Main value" },
      { name: "main_entity", label: "Main entity", selector: { entity: {} } },
      { name: "main_unit", label: "Unit (optional)", selector: { text: {} } },
      {
        name: "main_decimals",
        label: "Decimals",
        selector: { number: { min: 0, max: 6, step: 1, mode: "box" } }
      },
      { type: "divider" },
      { type: "section", label: "Graph" },
      { name: "graph_entity", label: "Graph entity (optional)", selector: { entity: {} } },
      {
        name: "graph_hours",
        label: "Hours",
        selector: { number: { min: 1, max: 72, step: 1, mode: "box" } }
      },
      {
        name: "graph_points",
        label: "Points",
        selector: { number: { min: 10, max: 200, step: 1, mode: "box" } }
      }
    ], t = [
      { name: "label", label: "Label", selector: { text: {} } },
      { name: "entity", label: "Entity", selector: { entity: {} } },
      { name: "unit", label: "Unit (optional)", selector: { text: {} } },
      { name: "icon", label: "Icon (optional)", selector: { icon: {} } },
      { name: "min", label: "Min", selector: { number: { mode: "box" } } },
      { name: "max", label: "Max", selector: { number: { mode: "box" } } },
      {
        name: "decimals",
        label: "Decimals",
        selector: { number: { min: 0, max: 6, step: 1, mode: "box" } }
      }
    ];
    return _`
      <div class="wrap">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${n}
          @value-changed=${this._onMainChanged}
        ></ha-form>

        <div class="sectionTitle">Bottom Value 1</div>
        <ha-form
          .hass=${this.hass}
          .data=${{ value_1: this._config.value_1 }}
          .schema=${[
      {
        name: "value_1",
        label: "",
        selector: { object: { schema: t } }
      }
    ]}
          @value-changed=${this._onValue1Changed}
        ></ha-form>

        <div class="sectionTitle">Bottom Value 2</div>
        <ha-form
          .hass=${this.hass}
          .data=${{ value_2: this._config.value_2 }}
          .schema=${[
      {
        name: "value_2",
        label: "",
        selector: { object: { schema: t } }
      }
    ]}
          @value-changed=${this._onValue2Changed}
        ></ha-form>

        <div class="hint">
          Die zwei unteren Werte sind deine “Extras” (Option A). Min/Max bestimmen die Dot-Skala und die
          Value-Farbe (grün → rot).
        </div>
      </div>
    `;
  }
};
z.styles = rt`
    .wrap {
      display: grid;
      gap: 14px;
    }
    .sectionTitle {
      font-weight: 600;
      opacity: 0.8;
      margin-top: 8px;
    }
    .hint {
      font-size: 12px;
      opacity: 0.7;
      line-height: 1.4;
    }
  `;
ht([
  ct({ attribute: !1 })
], z.prototype, "hass", 2);
ht([
  K()
], z.prototype, "_config", 2);
z = ht([
  Ot("wineyard-climate-card-editor")
], z);
console.info("[Wineyards] cards bundle loaded");
