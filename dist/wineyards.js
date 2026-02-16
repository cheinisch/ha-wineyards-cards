function wt(n) {
  window.customCards = window.customCards || [], window.customCards.some((t) => t.type === n.type) || window.customCards.push(n);
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, Z = z.ShadowRoot && (z.ShadyCSS === void 0 || z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), st = /* @__PURE__ */ new WeakMap();
let yt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = st.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && st.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const kt = (n) => new yt(typeof n == "string" ? n : n + "", void 0, Q), Pt = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[o + 1], n[0]);
  return new yt(e, n, Q);
}, Tt = (n, t) => {
  if (Z) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = z.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, nt = Z ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return kt(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ot, defineProperty: Wt, getOwnPropertyDescriptor: Ht, getOwnPropertyNames: Mt, getOwnPropertySymbols: Dt, getPrototypeOf: Ut } = Object, y = globalThis, ot = y.trustedTypes, Nt = ot ? ot.emptyScript : "", Lt = y.reactiveElementPolyfillSupport, C = (n, t) => n, I = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Nt : null;
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
} }, X = (n, t) => !Ot(n, t), rt = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = rt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Wt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = Ht(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: s, set(r) {
      const c = s?.call(this);
      o?.call(this, r), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = Ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, i = [...Mt(e), ...Dt(e)];
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
      for (const s of i) e.unshift(nt(s));
    } else t !== void 0 && e.push(nt(t));
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
    return Tt(t, this.constructor.elementStyles), t;
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
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : I).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : I;
      this._$Em = s;
      const c = r.fromAttribute(e, o.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? X)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
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
        const { wrapped: r } = o, c = this[s];
        r !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, o, c);
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
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[C("elementProperties")] = /* @__PURE__ */ new Map(), b[C("finalized")] = /* @__PURE__ */ new Map(), Lt?.({ ReactiveElement: b }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis, at = (n) => n, j = k.trustedTypes, lt = j ? j.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, mt = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + w, qt = `<${gt}>`, v = document, O = () => v.createComment(""), W = (n) => n === null || typeof n != "object" && typeof n != "function", tt = Array.isArray, Rt = (n) => tt(n) || typeof n?.[Symbol.iterator] == "function", F = `[ 	
\f\r]`, x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, ht = />/g, m = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), dt = /'/g, ut = /"/g, vt = /^(?:script|style|textarea|title)$/i, zt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), q = zt(1), A = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), g = v.createTreeWalker(v, 129);
function $t(n, t) {
  if (!tt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(t) : t;
}
const It = (n, t) => {
  const e = n.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = x;
  for (let c = 0; c < e; c++) {
    const a = n[c];
    let d, h, l = -1, p = 0;
    for (; p < a.length && (r.lastIndex = p, h = r.exec(a), h !== null); ) p = r.lastIndex, r === x ? h[1] === "!--" ? r = ct : h[1] !== void 0 ? r = ht : h[2] !== void 0 ? (vt.test(h[2]) && (s = RegExp("</" + h[2], "g")), r = m) : h[3] !== void 0 && (r = m) : r === m ? h[0] === ">" ? (r = s ?? x, l = -1) : h[1] === void 0 ? l = -2 : (l = r.lastIndex - h[2].length, d = h[1], r = h[3] === void 0 ? m : h[3] === '"' ? ut : dt) : r === ut || r === dt ? r = m : r === ct || r === ht ? r = x : (r = m, s = void 0);
    const _ = r === m && n[c + 1].startsWith("/>") ? " " : "";
    o += r === x ? a + qt : l >= 0 ? (i.push(d), a.slice(0, l) + mt + a.slice(l) + w + _) : a + w + (l === -2 ? c : _);
  }
  return [$t(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const c = t.length - 1, a = this.parts, [d, h] = It(t, e);
    if (this.el = H.createElement(d, i), g.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = g.nextNode()) !== null && a.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(mt)) {
          const p = h[r++], _ = s.getAttribute(l).split(w), $ = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: o, name: $[2], strings: _, ctor: $[1] === "." ? Bt : $[1] === "?" ? Vt : $[1] === "@" ? Gt : V }), s.removeAttribute(l);
        } else l.startsWith(w) && (a.push({ type: 6, index: o }), s.removeAttribute(l));
        if (vt.test(s.tagName)) {
          const l = s.textContent.split(w), p = l.length - 1;
          if (p > 0) {
            s.textContent = j ? j.emptyScript : "";
            for (let _ = 0; _ < p; _++) s.append(l[_], O()), g.nextNode(), a.push({ type: 2, index: ++o });
            s.append(l[p], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === gt) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(w, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += w.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = v.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(n, t, e = n, i) {
  if (t === A) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = W(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = E(n, s._$AS(n, t.values), s, i)), t;
}
class jt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? v).importNode(e, !0);
    g.currentNode = s;
    let o = g.nextNode(), r = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new U(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Jt(o, this, t)), this._$AV.push(d), a = i[++c];
      }
      r !== a?.index && (o = g.nextNode(), r++);
    }
    return g.currentNode = v, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class U {
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
    t = E(this, t, e), W(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && W(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = H.createElement($t(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const o = new jt(s, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = pt.get(t.strings);
    return e === void 0 && pt.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    tt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new U(this.O(O()), this.O(O()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = at(t).nextSibling;
      at(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class V {
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
    if (o === void 0) t = E(this, t, e, 0), r = !W(t) || t !== this._$AH && t !== A, r && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = E(this, c[i + a], e, a), d === A && (d = this._$AH[a]), r || (r = !W(d) || d !== this._$AH[a]), d === u ? t = u : t !== u && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Vt extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Gt extends V {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? u) === A) return;
    const i = this._$AH, s = t === u && i !== u || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Jt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Kt = k.litHtmlPolyfillSupport;
Kt?.(H, U), (k.litHtmlVersions ?? (k.litHtmlVersions = [])).push("3.3.2");
const Yt = (n, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = s = new U(t.insertBefore(O(), o), o, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis;
class T extends b {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Yt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
T._$litElement$ = !0, T.finalized = !0, P.litElementHydrateSupport?.({ LitElement: T });
const Ft = P.litElementPolyfillSupport;
Ft?.({ LitElement: T });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Zt = (n) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(n, t);
  }) : customElements.define(n, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: X }, Xt = (n = Qt, t, e) => {
  const { kind: i, metadata: s } = e;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), o.set(e.name, n), i === "accessor") {
    const { name: r } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, n, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, n, c), c;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, n, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function bt(n) {
  return (t, e) => typeof e == "object" ? Xt(n, t, e) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function te(n) {
  return bt({ ...n, state: !0, attribute: !1 });
}
var ee = Object.defineProperty, ie = Object.getOwnPropertyDescriptor, et = (n, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? ie(t, e) : t, o = n.length - 1, r; o >= 0; o--)
    (r = n[o]) && (s = (i ? r(t, e, s) : r(s)) || s);
  return i && s && ee(t, e, s), s;
};
const se = "wineyard-tile-button", _t = `custom:${se}`;
let M = class extends T {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(n) {
    this._config = { ...n }, this._config.type = _t;
  }
  _value(n) {
    const t = n.split(".");
    let e = this._config;
    for (const i of t) e = e?.[i];
    return e;
  }
  _setValue(n, t) {
    const e = n.split("."), i = { ...this._config };
    let s = i;
    for (let r = 0; r < e.length - 1; r++) {
      const c = e[r];
      s[c] = { ...s[c] ?? {} }, s = s[c];
    }
    const o = e[e.length - 1];
    t === "" || t === void 0 || t === null ? delete s[o] : s[o] = t, i.type = _t, this._config = i, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _onInput(n, t) {
    const e = n.target;
    this._setValue(t, e.value);
  }
  _onSelect(n, t) {
    const e = n.target;
    this._setValue(t, e.value);
  }
  _renderTapActionExtra(n) {
    return n === "navigate" ? q`
        <ha-textfield
          label="Navigation path"
          .value=${this._value("tap_action.navigation_path") ?? ""}
          @input=${(t) => this._onInput(t, "tap_action.navigation_path")}
        ></ha-textfield>
        <div class="hint">Beispiel: /lovelace/home</div>
      ` : n === "call-service" ? q`
        <ha-textfield
          label="Service (domain.service)"
          .value=${this._value("tap_action.service") ?? ""}
          @input=${(t) => this._onInput(t, "tap_action.service")}
        ></ha-textfield>

        <ha-textfield
          label="Service data (JSON)"
          .value=${this._stringify(this._value("tap_action.service_data"))}
          @input=${(t) => this._onServiceDataJson(t)}
        ></ha-textfield>

        <div class="hint">Beispiel: {"entity_id":"light.kitchen","brightness":200}</div>
      ` : u;
  }
  _stringify(n) {
    if (!n) return "";
    try {
      return JSON.stringify(n);
    } catch {
      return "";
    }
  }
  _onServiceDataJson(n) {
    const t = n.target.value?.trim();
    if (!t) {
      this._setValue("tap_action.service_data", void 0);
      return;
    }
    try {
      const e = JSON.parse(t);
      this._setValue("tap_action.service_data", e);
    } catch {
    }
  }
  render() {
    if (!this.hass) return q``;
    const n = this._value("tap_action.action") ?? "more-info";
    return q`
      <div class="row">
        <ha-entity-picker
          label="Entity"
          .hass=${this.hass}
          .value=${this._config.entity ?? ""}
          @value-changed=${(t) => this._setValue("entity", t.detail.value)}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-icon-picker
          label="Icon"
          .hass=${this.hass}
          .value=${this._config.icon ?? "mdi:lightbulb"}
          @value-changed=${(t) => this._setValue("icon", t.detail.value)}
        ></ha-icon-picker>

        <ha-textfield
          label="Title"
          .value=${this._config.title ?? ""}
          @input=${(t) => this._onInput(t, "title")}
        ></ha-textfield>

        <ha-textfield
          label="Subtitle"
          .value=${this._config.subtitle ?? ""}
          @input=${(t) => this._onInput(t, "subtitle")}
        ></ha-textfield>

        <ha-select
          label="Tap action"
          .value=${n}
          @selected=${(t) => this._onSelect(t, "tap_action.action")}
          @closed=${(t) => this._onSelect(t, "tap_action.action")}
        >
          <mwc-list-item value="more-info">More info</mwc-list-item>
          <mwc-list-item value="toggle">Toggle</mwc-list-item>
          <mwc-list-item value="navigate">Navigate</mwc-list-item>
          <mwc-list-item value="call-service">Call service</mwc-list-item>
          <mwc-list-item value="none">None</mwc-list-item>
        </ha-select>

        ${this._renderTapActionExtra(n)}
      </div>
    `;
  }
};
M.styles = Pt`
    .row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 4px 0;
    }
    .hint {
      opacity: 0.7;
      font-size: 12px;
      line-height: 1.2;
      margin-top: -8px;
    }
  `;
et([
  bt({ attribute: !1 })
], M.prototype, "hass", 2);
et([
  te()
], M.prototype, "_config", 2);
M = et([
  Zt("wineyard-tile-button-editor")
], M);
const D = "wineyard-tile-button", R = `custom:${D}`, ne = "wineyard-tile-button-editor";
class oe extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  // Editor GUI
  static getConfigElement() {
    return document.createElement(ne);
  }
  // Layout for section view / grid
  static getLayoutOptions() {
    return { grid_columns: 4, grid_rows: 2 };
  }
  // Stub config used by card picker (MUST be YAML type)
  static getStubConfig() {
    return {
      type: R,
      entity: "",
      icon: "mdi:lightbulb",
      title: "Kitchen Lights",
      subtitle: "Tap to open",
      tap_action: { action: "more-info" }
    };
  }
  setConfig(t) {
    if (!t) throw new Error("Invalid config");
    const e = (t.type || "").trim(), i = R;
    this._config = {
      type: i,
      entity: "",
      icon: "",
      title: "",
      subtitle: "",
      tap_action: { action: "more-info" },
      ...t,
      type: i
    }, this._render();
  }
  set hass(t) {
    this._hass = t, this._render();
  }
  _handleTap() {
    const t = this._config, e = this._hass;
    if (!e) return;
    const i = t.tap_action?.action ?? "more-info", s = (t.entity || "").trim();
    if (i !== "none") {
      if (i === "toggle") {
        if (!s) return;
        const o = s.split(".")[0];
        e.callService(o, "toggle", { entity_id: s });
        return;
      }
      if (i === "navigate") {
        const o = t.tap_action?.navigation_path;
        o && history.pushState(null, "", o), window.dispatchEvent(new Event("location-changed"));
        return;
      }
      if (i === "call-service") {
        const o = t.tap_action?.service || "", [r, c] = o.split(".");
        if (!r || !c) return;
        const a = t.tap_action?.service_data ?? {};
        e.callService(r, c, a);
        return;
      }
      if (s) {
        const o = new Event("hass-more-info", { bubbles: !0, composed: !0 });
        o.detail = { entityId: s }, this.dispatchEvent(o);
      }
    }
  }
  _escapeHtml(t) {
    return String(t ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  _render() {
    if (!this.shadowRoot || !this._config) return;
    const t = this._config, i = this._hass?.states?.[t.entity || ""] ?? null, s = t.icon || i?.attributes?.icon || "mdi:gesture-tap-button", o = t.title || i?.attributes?.friendly_name || "Title", r = t.subtitle ?? (i ? i.state : ""), c = this._escapeHtml(s), a = this._escapeHtml(o), d = this._escapeHtml(r);
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card {
          border-radius:16px;
          padding:16px;
          height:100%;
          min-height:150px;
          cursor:pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .wrap{ display:flex; flex-direction:column; gap:12px; }
        ha-icon{ --mdc-icon-size:50px; color:var(--primary-text-color); }
        .title{ font-size:1.08rem; font-weight:650; }
        .subtitle{ font-size:.92rem; opacity:.65; }
        ha-card:active { transform: scale(0.99); }
      </style>

      <ha-card>
        <div class="wrap">
          <div><ha-icon icon="${c}"></ha-icon></div>
          <div>
            <div class="title">${a}</div>
            <div class="subtitle">${d}</div>
          </div>
        </div>
      </ha-card>
    `, this.shadowRoot.querySelector("ha-card")?.addEventListener("click", () => this._handleTap());
  }
  getCardSize() {
    return 2;
  }
}
customElements.get(D) || customElements.define(D, oe);
wt({
  type: D,
  name: "Wineyard Tile Button (2x2)",
  description: "2x2 tile button with icon, title and subtitle.",
  preview: !0
});
const B = "wineyards-security-overview", re = "wineyards-security-overview-editor";
class ae extends HTMLElement {
  constructor() {
    super(), this._unsubCallService = null, this._pendingArm = !1, this._pendingUntil = 0, this.attachShadow({ mode: "open" });
  }
  static getConfigElement() {
    return document.createElement(re);
  }
  // Picker-stabil: ohne custom:
  static getStubConfig() {
    return {
      type: B,
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
    if (!t.alarm_entity) throw new Error("alarm_entity is required");
    this._config = {
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
    }, this._render();
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
  _onHaEvent(t) {
    const e = this._config;
    if (!e || !this._hass || !t?.data) return;
    const { domain: i, service: s, service_data: o } = t.data;
    if (i !== "alarm_control_panel" || s !== "alarm_arm_away") return;
    const r = e.alarm_entity, c = o?.entity_id;
    if (!(c === r || Array.isArray(c) && c.includes(r))) return;
    const d = Math.max(5, Number(e.pending_timeout_s || 30)) * 1e3;
    this._pendingArm = !0, this._pendingUntil = Date.now() + d, this._render();
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
    const t = this._config, i = this._getEntity(t.alarm_entity)?.state ?? "unknown", s = Date.now(), o = typeof i == "string" && i.startsWith("armed_"), r = i === "arming";
    (this._pendingArm && s > (this._pendingUntil || 0) || o) && (this._pendingArm = !1, this._pendingUntil = 0), r && (this._pendingArm = !0);
    const a = this._pendingArm && !o, h = !(i === "disarmed" || i === "unknown" || i === "unavailable") && !a, l = a ? "#ff9800" : h ? "#4caf50" : "#f44336", p = a ? "Wird aktiviert" : h ? "Aktiv" : "Inaktiv", _ = a ? "mdi:shield-sync-outline" : h ? "mdi:shield-lock" : "mdi:shield-off", $ = h || a ? "Deaktivieren" : "Aktivieren", At = h || a ? "mdi:shield-off-outline" : "mdi:shield-check", G = (t.doors_windows_entity || "").trim(), N = (t.windows_entity || "").trim(), L = !!G, Et = L ? (t.doors_windows_title || "Doors / Windows").trim() || "Doors / Windows" : (t.windows_label || "Windows").trim() || "Windows", St = L ? t.doors_windows_icon || "mdi:door" : t.windows_icon || "mdi:window-closed-variant";
    let J = "nicht gesetzt", K = "";
    if (L) {
      const Y = this._getGroupMembers(G).map((f) => ({ id: f, ent: this._getEntity(f) })).filter((f) => this._isOpenState(f.ent));
      J = Y.length === 0 ? "Keine offen" : `${Y.length} offen`;
      const it = Y.slice(0, 4).map((f) => this._escapeHtml(this._formatName(f.id)));
      K = it.length > 0 ? `<div class="wy-openlist">${it.map((f) => `<span class="wy-chip">${f}</span>`).join("")}</div>` : '<div class="wy-openlist wy-muted2"></div>';
    } else if (N) {
      const S = this._getEntity(N);
      J = this._formatQuickState(S?.state ?? "unknown"), K = '<div class="wy-openlist wy-muted2"></div>';
    }
    this.shadowRoot.innerHTML = `
      <ha-card class="wy-card">
        <div class="wy-wrap">
          <div class="wy-title">${this._escapeHtml(t.title)}</div>

          <div class="wy-grid">
            <div class="wy-item wy-status" style="--status-color:${l}">
              <ha-icon icon="${_}"></ha-icon>
              <div class="wy-label">Alarm</div>
              <div class="wy-state">${p}</div>
            </div>

            <div class="wy-item wy-action" role="button" tabindex="0">
              <ha-icon icon="${At}"></ha-icon>
              <div class="wy-label">${this._escapeHtml($)}</div>
              <div class="wy-state wy-muted">${this._escapeHtml(this._formatAlarmState(i))}</div>
            </div>

            <div class="wy-item wy-col3 ${L || N ? "" : "wy-disabled"}" role="button" tabindex="0">
              <ha-icon icon="${this._escapeHtml(St)}"></ha-icon>
              <div class="wy-label">${this._escapeHtml(Et)}</div>
              <div class="wy-state">${this._escapeHtml(J)}</div>
              ${K}
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
          .wy-disabled{ opacity:0.55; cursor:default; }
        </style>
      </ha-card>
    `;
    const xt = this.shadowRoot.querySelector(".wy-action"), Ct = this.shadowRoot.querySelector(".wy-col3");
    xt?.addEventListener("click", () => {
      this._hass && (h || a ? this._hass.callService("alarm_control_panel", "alarm_disarm", { entity_id: t.alarm_entity }) : this._openMoreInfo(t.alarm_entity));
    }), Ct?.addEventListener("click", () => {
      const S = G || N;
      S && this._openMoreInfo(S);
    });
  }
  getCardSize() {
    return 2;
  }
}
customElements.get(B) || customElements.define(B, ae);
wt({
  type: B,
  name: "Wineyards Security Overview",
  description: "3-column security overview with doors/windows group + icon selection + stable editor",
  preview: !0
});
const ft = "wineyards-security-overview";
class le extends HTMLElement {
  constructor() {
    super(), this._built = !1;
  }
  setConfig(t) {
    this._config = {
      type: ft,
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
    if (!this._built) {
      this.innerHTML = `
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
            Wenn eine <b>Gruppe</b> gesetzt ist, zeigt die Karte offene Türen/Fenster.
            Ohne Gruppe nutzt sie optional die einzelne Windows-Entität als schnelle Anzeige.
          </div>
        </div>

        <style>
          .wy-editor{ display:grid; gap:16px; }
          .wy-input{ width:100%; }
          .wy-sep{ opacity:0.7; font-size:12px; margin-top:4px; }
          .wy-hint{ opacity:0.7; font-size:12px; line-height:1.35; }
        </style>
      `;
      const e = this.querySelector('ha-entity-picker[label="Alarm entity"]'), i = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]'), s = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');
      e && (e.hass = this._hass, e.includeDomains = ["alarm_control_panel"]), i && (i.hass = this._hass, i.includeDomains = ["group"]), s && (s.hass = this._hass, s.includeDomains = ["binary_sensor", "cover", "lock", "sensor"]), this._attachListeners(t), this._built = !0;
    }
    this._syncValues(t);
  }
  _syncValues(t) {
    const e = this._config, i = this.querySelector('ha-textfield[label="Title"]'), s = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]'), o = this.querySelector('ha-entity-picker[label="Alarm entity"]'), r = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]'), c = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]'), a = this.querySelector('ha-textfield[label="Doors/Windows title"]'), d = this.querySelector('ha-textfield[label="Windows label"]'), h = t ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]') : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]'), l = t ? this.querySelector('ha-icon-picker[label="Windows icon"]') : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]');
    i && (i.value = e.title ?? "Security"), s && (s.value = String(Number(e.pending_timeout_s ?? 30))), o && (o.hass = this._hass, o.value = e.alarm_entity || ""), r && (r.hass = this._hass, r.value = e.doors_windows_entity || ""), c && (c.hass = this._hass, c.value = e.windows_entity || ""), a && (a.value = e.doors_windows_title ?? "Doors / Windows"), d && (d.value = e.windows_label ?? "Windows"), h && (h.value = e.doors_windows_icon ?? "mdi:door"), l && (l.value = e.windows_icon ?? "mdi:window-closed-variant");
  }
  _attachListeners(t) {
    const e = this.querySelector('ha-textfield[label="Title"]'), i = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]'), s = this.querySelector('ha-entity-picker[label="Alarm entity"]'), o = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]'), r = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]'), c = this.querySelector('ha-textfield[label="Doors/Windows title"]'), a = this.querySelector('ha-textfield[label="Windows label"]'), d = t ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]') : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]'), h = t ? this.querySelector('ha-icon-picker[label="Windows icon"]') : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]');
    e?.addEventListener("change", (l) => this._update({ title: l.target.value })), i?.addEventListener("change", (l) => {
      const p = Number(l.target.value);
      this._update({ pending_timeout_s: Number.isFinite(p) ? p : 30 });
    }), s?.addEventListener(
      "value-changed",
      (l) => this._update({ alarm_entity: l.detail?.value || "" })
    ), o?.addEventListener(
      "value-changed",
      (l) => this._update({ doors_windows_entity: l.detail?.value || "" })
    ), r?.addEventListener(
      "value-changed",
      (l) => this._update({ windows_entity: l.detail?.value || "" })
    ), c?.addEventListener("change", (l) => this._update({ doors_windows_title: l.target.value })), a?.addEventListener("change", (l) => this._update({ windows_label: l.target.value })), d?.addEventListener(
      "value-changed",
      (l) => this._update({ doors_windows_icon: l.detail?.value ?? l.target.value })
    ), d?.addEventListener(
      "change",
      (l) => this._update({ doors_windows_icon: l.target.value })
    ), h?.addEventListener(
      "value-changed",
      (l) => this._update({ windows_icon: l.detail?.value ?? l.target.value })
    ), h?.addEventListener(
      "change",
      (l) => this._update({ windows_icon: l.target.value })
    );
  }
  _update(t) {
    this._config = { ...this._config, ...t, type: ft }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
}
customElements.get("wineyards-security-overview-editor") || customElements.define("wineyards-security-overview-editor", le);
console.info("[Wineyards] cards bundle loaded");
