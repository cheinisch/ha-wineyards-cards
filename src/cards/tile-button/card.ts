import { registerCustomCard } from "../../shared/picker";
import "./editor";

const TAG = "wineyard-tile-button";          // Custom Element Tag (ohne custom:)
const YAML_TYPE = `custom:${TAG}`;           // Lovelace/YAML type (mit custom:)
const EDITOR_TAG = "wineyard-tile-button-editor";

type TapAction =
  | { action: "more-info" }
  | { action: "toggle" }
  | { action: "navigate"; navigation_path: string }
  | { action: "call-service"; service: string; service_data?: Record<string, any> }
  | { action: "none" };

type Config = {
  type?: string;
  entity?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
  tap_action?: TapAction;
};

class WineyardTileButton extends HTMLElement {
  private _hass: any;
  private _config!: Config;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Editor GUI
  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  // Layout for section view / grid
  static getLayoutOptions() {
    return { grid_columns: 4, grid_rows: 2 };
  }

  // Stub config used by card picker (MUST be YAML type)
  static getStubConfig() {
    return {
      type: YAML_TYPE,
      entity: "",
      icon: "mdi:lightbulb",
      title: "Kitchen Lights",
      subtitle: "Tap to open",
      tap_action: { action: "more-info" },
    } satisfies Config;
  }

  setConfig(config: Config) {
    if (!config) throw new Error("Invalid config");

    // Normalize type: allow user to paste old configs without custom:
    const inType = (config.type || "").trim();
    const normalizedType =
      inType === TAG || inType === YAML_TYPE || inType === "" ? YAML_TYPE : YAML_TYPE;

    this._config = {
      type: normalizedType,
      entity: "",
      icon: "",
      title: "",
      subtitle: "",
      tap_action: { action: "more-info" },
      ...config,
      type: normalizedType,
    };

    this._render();
  }

  set hass(hass: any) {
    this._hass = hass;
    this._render();
  }

  private _handleTap() {
    const cfg = this._config;
    const hass = this._hass;
    if (!hass) return;

    const action = cfg.tap_action?.action ?? "more-info";
    const entityId = (cfg.entity || "").trim();

    if (action === "none") return;

    if (action === "toggle") {
      if (!entityId) return;
      const domain = entityId.split(".")[0];
      const service =
        domain === "light"
          ? "toggle"
          : domain === "switch"
          ? "toggle"
          : domain === "input_boolean"
          ? "toggle"
          : "toggle";
      hass.callService(domain, service, { entity_id: entityId });
      return;
    }

    if (action === "navigate") {
      const path = (cfg.tap_action as any)?.navigation_path;
      if (path) history.pushState(null, "", path);
      window.dispatchEvent(new Event("location-changed"));
      return;
    }

    if (action === "call-service") {
      const serviceStr = (cfg.tap_action as any)?.service || "";
      const [domain, service] = serviceStr.split(".");
      if (!domain || !service) return;
      const data = (cfg.tap_action as any)?.service_data ?? {};
      hass.callService(domain, service, data);
      return;
    }

    // more-info (default)
    if (entityId) {
      const ev: any = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId };
      this.dispatchEvent(ev);
    }
  }

  private _escapeHtml(v: any) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  private _render() {
    if (!this.shadowRoot || !this._config) return;

    const cfg = this._config;
    const hass = this._hass;

    const entity = hass?.states?.[cfg.entity || ""] ?? null;

    const icon =
      cfg.icon || entity?.attributes?.icon || "mdi:gesture-tap-button";

    const title =
      cfg.title || entity?.attributes?.friendly_name || "Title";

    const subtitle =
      cfg.subtitle ?? (entity ? entity.state : "");

    // Keep HTML safe
    const safeIcon = this._escapeHtml(icon);
    const safeTitle = this._escapeHtml(title);
    const safeSubtitle = this._escapeHtml(subtitle);

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
          <div><ha-icon icon="${safeIcon}"></ha-icon></div>
          <div>
            <div class="title">${safeTitle}</div>
            <div class="subtitle">${safeSubtitle}</div>
          </div>
        </div>
      </ha-card>
    `;

    const card = this.shadowRoot.querySelector("ha-card") as HTMLElement | null;
    card?.addEventListener("click", () => this._handleTap());
  }

  getCardSize() {
    return 2;
  }
}

// Define element by TAG only
if (!customElements.get(TAG)) {
  customElements.define(TAG, WineyardTileButton);
}

/**
 * IMPORTANT:
 * - Register in picker WITHOUT "custom:" so HA can create the element.
 * - StubConfig uses YAML_TYPE with "custom:".
 */
registerCustomCard({
  type: TAG,
  name: "Wineyard Tile Button (2x2)",
  description: "2x2 tile button with icon, title and subtitle.",
  preview: true,
});

export {};
