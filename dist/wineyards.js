var H = Object.defineProperty;
var M = (u, n, t) => n in u ? H(u, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[n] = t;
var p = (u, n, t) => M(u, typeof n != "symbol" ? n + "" : n, t);
function D(u) {
  window.customCards = window.customCards || [], window.customCards.some((n) => n.type === u.type) || window.customCards.push(u);
}
const g = "wineyard-tile-button";
class O extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  static getLayoutOptions() {
    return { grid_columns: 2, grid_rows: 2 };
  }
  static getStubConfig() {
    return {
      type: g,
      entity: "",
      icon: "mdi:lightbulb",
      title: "Kitchen Lights",
      subtitle: "Tap to open",
      tap_action: { action: "more-info" }
    };
  }
  setConfig(n) {
    this._config = n, this.render();
  }
  set hass(n) {
    this._hass = n, this.render();
  }
  render() {
    var o, r, d, c;
    if (!this.shadowRoot || !this._config) return;
    const n = ((r = (o = this._hass) == null ? void 0 : o.states) == null ? void 0 : r[this._config.entity]) ?? null, t = this._config.icon || ((d = n == null ? void 0 : n.attributes) == null ? void 0 : d.icon) || "mdi:gesture-tap-button", e = this._config.title || ((c = n == null ? void 0 : n.attributes) == null ? void 0 : c.friendly_name) || "Title", i = this._config.subtitle ?? (n ? n.state : "");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card { border-radius:16px; padding:16px; height:100%; min-height:150px; cursor:pointer; }
        .wrap{ display:flex; flex-direction:column; gap:12px; }
        ha-icon{ --mdc-icon-size:30px; color:var(--primary-text-color); }
        .title{ font-size:1.08rem; font-weight:650; }
        .subtitle{ font-size:.92rem; opacity:.65; }
      </style>
      <ha-card>
        <div class="wrap">
          <div><ha-icon icon="${t}"></ha-icon></div>
          <div>
            <div class="title">${e}</div>
            <div class="subtitle">${i}</div>
          </div>
        </div>
      </ha-card>
    `;
  }
}
customElements.get(g) || customElements.define(g, O);
D({
  type: g,
  name: "Wineyard Tile Button (2x2)",
  description: "2x2 tile button with icon, title and subtitle.",
  preview: !0
});
const P = "wineyard-tile-button";
class R extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  setConfig(n) {
    this._config = n || {}, this._config.type = P, this.render();
  }
  render() {
    this.shadowRoot && (this.shadowRoot.innerHTML = `
      <div style="padding:8px;">
        <p>Basic Editor (extend as needed)</p>
      </div>
    `);
  }
}
customElements.get("wineyard-tile-button-editor") || customElements.define("wineyard-tile-button-editor", R);
const v = "wineyards-security-overview", N = "wineyards-security-overview-editor";
class G extends HTMLElement {
  constructor() {
    super();
    p(this, "_hass");
    p(this, "_config");
    p(this, "_unsubCallService", null);
    p(this, "_pendingArm", !1);
    p(this, "_pendingUntil", 0);
    this.attachShadow({ mode: "open" });
  }
  static getConfigElement() {
    return document.createElement(N);
  }
  // Picker-stabil: ohne custom:
  static getStubConfig() {
    return {
      type: v,
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
    var e;
    this._hass = t, !this._unsubCallService && ((e = t == null ? void 0 : t.connection) != null && e.subscribeEvents) && t.connection.subscribeEvents((i) => this._onHaEvent(i), "call_service").then((i) => this._unsubCallService = i).catch(() => this._unsubCallService = null), this._render();
  }
  disconnectedCallback() {
    var t;
    try {
      (t = this._unsubCallService) == null || t.call(this);
    } catch {
    }
    this._unsubCallService = null;
  }
  _onHaEvent(t) {
    const e = this._config;
    if (!e || !this._hass || !(t != null && t.data)) return;
    const { domain: i, service: o, service_data: r } = t.data;
    if (i !== "alarm_control_panel" || o !== "alarm_arm_away") return;
    const d = e.alarm_entity, c = r == null ? void 0 : r.entity_id;
    if (!(c === d || Array.isArray(c) && c.includes(d))) return;
    const w = Math.max(5, Number(e.pending_timeout_s || 30)) * 1e3;
    this._pendingArm = !0, this._pendingUntil = Date.now() + w, this._render();
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
    const e = t == null ? void 0 : t.state;
    return e === "on" || e === "open" || e === "opening";
  }
  _getGroupMembers(t) {
    var o;
    const e = this._getEntity(t), i = (o = e == null ? void 0 : e.attributes) == null ? void 0 : o.entity_id;
    return Array.isArray(i) ? i : [];
  }
  _formatName(t) {
    var i;
    const e = this._getEntity(t);
    return ((i = e == null ? void 0 : e.attributes) == null ? void 0 : i.friendly_name) || t;
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
    const t = this._config, e = this._getEntity(t.alarm_entity), i = (e == null ? void 0 : e.state) ?? "unknown", o = Date.now(), r = typeof i == "string" && i.startsWith("armed_"), d = i === "arming";
    (this._pendingArm && o > (this._pendingUntil || 0) || r) && (this._pendingArm = !1, this._pendingUntil = 0), d && (this._pendingArm = !0);
    const h = this._pendingArm && !r, l = !(i === "disarmed" || i === "unknown" || i === "unavailable") && !h, s = h ? "#ff9800" : l ? "#4caf50" : "#f44336", a = h ? "Wird aktiviert" : l ? "Aktiv" : "Inaktiv", L = h ? "mdi:shield-sync-outline" : l ? "mdi:shield-lock" : "mdi:shield-off", T = l || h ? "Deaktivieren" : "Aktivieren", C = l || h ? "mdi:shield-off-outline" : "mdi:shield-check", b = (t.doors_windows_entity || "").trim(), m = (t.windows_entity || "").trim(), f = !!b, $ = f ? (t.doors_windows_title || "Doors / Windows").trim() || "Doors / Windows" : (t.windows_label || "Windows").trim() || "Windows", z = f ? t.doors_windows_icon || "mdi:door" : t.windows_icon || "mdi:window-closed-variant";
    let x = "nicht gesetzt", S = "";
    if (f) {
      const E = this._getGroupMembers(b).map((y) => ({ id: y, ent: this._getEntity(y) })).filter((y) => this._isOpenState(y.ent));
      x = E.length === 0 ? "Keine offen" : `${E.length} offen`;
      const q = E.slice(0, 4).map((y) => this._escapeHtml(this._formatName(y.id)));
      S = q.length > 0 ? `<div class="wy-openlist">${q.map((y) => `<span class="wy-chip">${y}</span>`).join("")}</div>` : '<div class="wy-openlist wy-muted2"></div>';
    } else if (m) {
      const _ = this._getEntity(m);
      x = this._formatQuickState((_ == null ? void 0 : _.state) ?? "unknown"), S = '<div class="wy-openlist wy-muted2"></div>';
    }
    this.shadowRoot.innerHTML = `
      <ha-card class="wy-card">
        <div class="wy-wrap">
          <div class="wy-title">${this._escapeHtml(t.title)}</div>

          <div class="wy-grid">
            <div class="wy-item wy-status" style="--status-color:${s}">
              <ha-icon icon="${L}"></ha-icon>
              <div class="wy-label">Alarm</div>
              <div class="wy-state">${a}</div>
            </div>

            <div class="wy-item wy-action" role="button" tabindex="0">
              <ha-icon icon="${C}"></ha-icon>
              <div class="wy-label">${this._escapeHtml(T)}</div>
              <div class="wy-state wy-muted">${this._escapeHtml(this._formatAlarmState(i))}</div>
            </div>

            <div class="wy-item wy-col3 ${f || m ? "" : "wy-disabled"}" role="button" tabindex="0">
              <ha-icon icon="${this._escapeHtml(z)}"></ha-icon>
              <div class="wy-label">${this._escapeHtml($)}</div>
              <div class="wy-state">${this._escapeHtml(x)}</div>
              ${S}
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
    const k = this.shadowRoot.querySelector(".wy-action"), W = this.shadowRoot.querySelector(".wy-col3");
    k == null || k.addEventListener("click", () => {
      this._hass && (l || h ? this._hass.callService("alarm_control_panel", "alarm_disarm", { entity_id: t.alarm_entity }) : this._openMoreInfo(t.alarm_entity));
    }), W == null || W.addEventListener("click", () => {
      const _ = b || m;
      _ && this._openMoreInfo(_);
    });
  }
  getCardSize() {
    return 2;
  }
}
customElements.get(v) || customElements.define(v, G);
D({
  type: v,
  name: "Wineyards Security Overview",
  description: "3-column security overview with doors/windows group + icon selection + stable editor",
  preview: !0
});
const A = "wineyards-security-overview";
class I extends HTMLElement {
  constructor() {
    super();
    p(this, "_hass");
    p(this, "_config");
    p(this, "_built", !1);
  }
  setConfig(t) {
    this._config = {
      type: A,
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
      const e = this.querySelector('ha-entity-picker[label="Alarm entity"]'), i = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]'), o = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');
      e && (e.hass = this._hass, e.includeDomains = ["alarm_control_panel"]), i && (i.hass = this._hass, i.includeDomains = ["group"]), o && (o.hass = this._hass, o.includeDomains = ["binary_sensor", "cover", "lock", "sensor"]), this._attachListeners(t), this._built = !0;
    }
    this._syncValues(t);
  }
  _syncValues(t) {
    const e = this._config, i = this.querySelector('ha-textfield[label="Title"]'), o = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]'), r = this.querySelector('ha-entity-picker[label="Alarm entity"]'), d = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]'), c = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]'), h = this.querySelector('ha-textfield[label="Doors/Windows title"]'), w = this.querySelector('ha-textfield[label="Windows label"]'), l = t ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]') : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]'), s = t ? this.querySelector('ha-icon-picker[label="Windows icon"]') : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]');
    i && (i.value = e.title ?? "Security"), o && (o.value = String(Number(e.pending_timeout_s ?? 30))), r && (r.hass = this._hass, r.value = e.alarm_entity || ""), d && (d.hass = this._hass, d.value = e.doors_windows_entity || ""), c && (c.hass = this._hass, c.value = e.windows_entity || ""), h && (h.value = e.doors_windows_title ?? "Doors / Windows"), w && (w.value = e.windows_label ?? "Windows"), l && (l.value = e.doors_windows_icon ?? "mdi:door"), s && (s.value = e.windows_icon ?? "mdi:window-closed-variant");
  }
  _attachListeners(t) {
    const e = this.querySelector('ha-textfield[label="Title"]'), i = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]'), o = this.querySelector('ha-entity-picker[label="Alarm entity"]'), r = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]'), d = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]'), c = this.querySelector('ha-textfield[label="Doors/Windows title"]'), h = this.querySelector('ha-textfield[label="Windows label"]'), w = t ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]') : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]'), l = t ? this.querySelector('ha-icon-picker[label="Windows icon"]') : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]');
    e == null || e.addEventListener("change", (s) => this._update({ title: s.target.value })), i == null || i.addEventListener("change", (s) => {
      const a = Number(s.target.value);
      this._update({ pending_timeout_s: Number.isFinite(a) ? a : 30 });
    }), o == null || o.addEventListener(
      "value-changed",
      (s) => {
        var a;
        return this._update({ alarm_entity: ((a = s.detail) == null ? void 0 : a.value) || "" });
      }
    ), r == null || r.addEventListener(
      "value-changed",
      (s) => {
        var a;
        return this._update({ doors_windows_entity: ((a = s.detail) == null ? void 0 : a.value) || "" });
      }
    ), d == null || d.addEventListener(
      "value-changed",
      (s) => {
        var a;
        return this._update({ windows_entity: ((a = s.detail) == null ? void 0 : a.value) || "" });
      }
    ), c == null || c.addEventListener("change", (s) => this._update({ doors_windows_title: s.target.value })), h == null || h.addEventListener("change", (s) => this._update({ windows_label: s.target.value })), w == null || w.addEventListener(
      "value-changed",
      (s) => {
        var a;
        return this._update({ doors_windows_icon: ((a = s.detail) == null ? void 0 : a.value) ?? s.target.value });
      }
    ), w == null || w.addEventListener(
      "change",
      (s) => this._update({ doors_windows_icon: s.target.value })
    ), l == null || l.addEventListener(
      "value-changed",
      (s) => {
        var a;
        return this._update({ windows_icon: ((a = s.detail) == null ? void 0 : a.value) ?? s.target.value });
      }
    ), l == null || l.addEventListener(
      "change",
      (s) => this._update({ windows_icon: s.target.value })
    );
  }
  _update(t) {
    this._config = { ...this._config, ...t, type: A }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
}
customElements.get("wineyards-security-overview-editor") || customElements.define("wineyards-security-overview-editor", I);
console.info("[Wineyards] cards bundle loaded");
