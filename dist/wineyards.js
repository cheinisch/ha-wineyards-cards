function l(i) {
  window.customCards = window.customCards || [], window.customCards.some((t) => t.type === i.type) || window.customCards.push(i);
}
const e = "wineyard-tile-button";
class h extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  static getLayoutOptions() {
    return { grid_columns: 2, grid_rows: 2 };
  }
  static getStubConfig() {
    return {
      type: e,
      entity: "",
      icon: "mdi:lightbulb",
      title: "Kitchen Lights",
      subtitle: "Tap to open",
      tap_action: { action: "more-info" }
    };
  }
  setConfig(t) {
    this._config = t, this.render();
  }
  set hass(t) {
    this._hass = t, this.render();
  }
  render() {
    var s, o, n, d;
    if (!this.shadowRoot || !this._config) return;
    const t = ((o = (s = this._hass) == null ? void 0 : s.states) == null ? void 0 : o[this._config.entity]) ?? null, r = this._config.icon || ((n = t == null ? void 0 : t.attributes) == null ? void 0 : n.icon) || "mdi:gesture-tap-button", a = this._config.title || ((d = t == null ? void 0 : t.attributes) == null ? void 0 : d.friendly_name) || "Title", c = this._config.subtitle ?? (t ? t.state : "");
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
          <div><ha-icon icon="${r}"></ha-icon></div>
          <div>
            <div class="title">${a}</div>
            <div class="subtitle">${c}</div>
          </div>
        </div>
      </ha-card>
    `;
  }
}
customElements.get(e) || customElements.define(e, h);
l({
  type: e,
  name: "Wineyard Tile Button (2x2)",
  description: "2x2 tile button with icon, title and subtitle.",
  preview: !0
});
const u = "wineyard-tile-button";
class p extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  setConfig(t) {
    this._config = t || {}, this._config.type = u, this.render();
  }
  render() {
    this.shadowRoot && (this.shadowRoot.innerHTML = `
      <div style="padding:8px;">
        <p>Basic Editor (extend as needed)</p>
      </div>
    `);
  }
}
customElements.get("wineyard-tile-button-editor") || customElements.define("wineyard-tile-button-editor", p);
console.info("[Wineyards] cards bundle loaded");
