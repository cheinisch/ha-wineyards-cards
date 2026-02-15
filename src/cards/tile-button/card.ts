import { registerCustomCard } from "../../shared/picker";

const TYPE = "wineyard-tile-button";

class WineyardTileButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static getLayoutOptions() {
    return { grid_columns: 2, grid_rows: 2 };
  }

  static getStubConfig() {
    return {
      type: TYPE,
      entity: "",
      icon: "mdi:lightbulb",
      title: "Kitchen Lights",
      subtitle: "Tap to open",
      tap_action: { action: "more-info" }
    };
  }

  setConfig(config) {
    this._config = config;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this.shadowRoot || !this._config) return;
    const entity = this._hass?.states?.[this._config.entity] ?? null;
    const icon = this._config.icon || entity?.attributes?.icon || "mdi:gesture-tap-button";
    const title = this._config.title || entity?.attributes?.friendly_name || "Title";
    const subtitle = this._config.subtitle ?? (entity ? entity.state : "");

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
          <div><ha-icon icon="${icon}"></ha-icon></div>
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">${subtitle}</div>
          </div>
        </div>
      </ha-card>
    `;
  }
}

if (!customElements.get(TYPE)) {
  customElements.define(TYPE, WineyardTileButton);
}

registerCustomCard({
  type: TYPE,
  name: "Wineyard Tile Button (2x2)",
  description: "2x2 tile button with icon, title and subtitle.",
  preview: true
});