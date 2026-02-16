// src/cards/tile-button/card.ts
import { registerCustomCard } from "../../shared/picker";
import "./editor";

const TAG = "wineyard-tile-button";          // Custom element tag (MUST be without "custom:")
const YAML_TYPE = `custom:${TAG}`;           // Lovelace type (with "custom:")
const EDITOR_TAG = "wineyard-tile-button-editor";

type TapAction =
  | { action: "more-info" }
  | { action: "toggle" }
  | { action: "navigate"; navigation_path: string }
  | { action: "call-service"; service: string; service_data?: Record<string, any> }
  | { action: "none" };

export type WineyardTileButtonConfig = {
  type?: string;

  entity?: string;
  icon?: string;
  title?: string;

  /**
   * If set => always shown as-is.
   * If empty/undefined => auto subtitle based on entity domain/group/climate/etc.
   */
  subtitle?: string;

  tap_action?: TapAction;

  /**
   * Group behavior:
   * - If entity has attributes.entity_id, we treat it like a collection.
   * - We count "on" members.
   */
  count_domains?: string[];         // default: ["light"]
  show_off_duration?: boolean;      // default: true
  show_on_total?: boolean;          // default: false  -> "9/12 on"
  on_label?: string;               // default: "on"
  off_label?: string;              // default: "Off"

  /**
   * Sections layout default (optional; HA may store it separately)
   */
  layout_options?: {
    grid_columns?: number;
    grid_rows?: number;
  };
};

class WineyardTileButton extends HTMLElement {
  private _hass: any;
  private _config!: WineyardTileButtonConfig;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  static getLayoutOptions() {
    return { grid_columns: 2, grid_rows: 2 };
  }

  static getStubConfig(): WineyardTileButtonConfig {
    return {
      type: YAML_TYPE,
      layout_options: { grid_columns: 2, grid_rows: 2 },

      entity: "",
      icon: "mdi:lightbulb",
      title: "Kitchen Lights",
      // subtitle intentionally omitted => auto
      tap_action: { action: "more-info" },

      count_domains: ["light"],
      show_off_duration: true,
      show_on_total: false,
      on_label: "on",
      off_label: "Off",
    };
  }

  setConfig(config: WineyardTileButtonConfig) {
    if (!config) throw new Error("Invalid config");

    // Normalize type so older configs without custom: still work
    const inType = (config.type || "").trim();
    const normalizedType =
      inType === "" || inType === TAG || inType === YAML_TYPE ? YAML_TYPE : YAML_TYPE;

    this._config = {
      type: normalizedType,
      entity: "",
      icon: "",
      title: "",
      subtitle: undefined,
      tap_action: { action: "more-info" },

      count_domains: ["light"],
      show_off_duration: true,
      show_on_total: false,
      on_label: "on",
      off_label: "Off",

      layout_options: config.layout_options ?? { grid_columns: 2, grid_rows: 2 },

      ...config,
      type: normalizedType,
    };

    this._render();
  }

  set hass(hass: any) {
    this._hass = hass;
    this._render();
  }

  // ---------- helpers (subtitle + actions) ----------

  private _escapeHtml(v: any) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  private _domain(entityId: string): string {
    const i = entityId.indexOf(".");
    return i > 0 ? entityId.slice(0, i) : "";
  }

  private _minutesSince(iso?: string): number {
    const t = iso ? Date.parse(iso) : NaN;
    if (!Number.isFinite(t)) return 0;
    return Math.max(0, Math.floor((Date.now() - t) / 60000));
  }

  private _isGroupLike(ent: any): boolean {
    const ids = ent?.attributes?.entity_id;
    return Array.isArray(ids) && ids.length > 0;
  }

  /**
   * Generic "is on/active" check.
   * Extend anytime you want better domain semantics.
   */
  private _isOnState(domain: string, state: string): boolean {
    if (!state) return false;

    // Most HA domains use on/off
    if (state === "on") return true;

    // domain-specific active states
    if (domain === "cover") return state === "open" || state === "opening";
    if (domain === "lock") return state === "unlocked";
    if (domain === "media_player") return state === "playing";
    if (domain === "alarm_control_panel") return state !== "disarmed";
    if (domain === "climate") return state !== "off" && state !== "idle";

    // vacuum example: treat "cleaning" as active, but not docked
    if (domain === "vacuum") return state === "cleaning" || state === "returning";

    return false;
  }

  private _titleForDomain(domain: string, count: number): string {
    const map: Record<string, string> = {
      light: "Light",
      switch: "Switch",
      fan: "Fan",
      cover: "Cover",
      lock: "Lock",
      media_player: "Player",
      vacuum: "Vacuum",
      climate: "Climate",
    };

    const base = map[domain] ?? "Device";
    return count === 1 ? base : `${base}s`;
  }

  private _formatClimateSubtitle(ent: any): string {
    const mode = String(ent?.state ?? "").toLowerCase();
    const target = ent?.attributes?.temperature;

    // HA usually provides the unit in hass config
    const unit =
      this._hass?.config?.unit_system?.temperature === "°F" ? "°F" : "°";

    const niceMode =
      mode === "heat"
        ? "Heat"
        : mode === "cool"
        ? "Cool"
        : mode === "auto"
        ? "Auto"
        : mode === "off"
        ? "Off"
        : mode
        ? mode.charAt(0).toUpperCase() + mode.slice(1)
        : "Climate";

    if (target !== undefined && target !== null && target !== "") {
      return `${niceMode} \u2013 ${target}${unit}`;
    }

    return niceMode;
  }

  private _buildGroupSubtitle(ent: any): string {
    const cfg = this._config;
    const hass = this._hass;

    const memberIds: string[] = ent?.attributes?.entity_id ?? [];
    const domains = (cfg.count_domains?.length ? cfg.count_domains : ["light"]).map(String);

    let on = 0;
    let total = 0;

    for (const id of memberIds) {
      const d = this._domain(id);
      if (!d) continue;
      if (domains.length && !domains.includes(d)) continue;

      const e = hass?.states?.[id];
      if (!e) continue;

      total++;
      if (this._isOnState(d, e.state)) on++;
    }

    // If nothing matched selected domains, fall back to all members
    if (total === 0) {
      for (const id of memberIds) {
        const d = this._domain(id);
        const e = hass?.states?.[id];
        if (!e) continue;
        total++;
        if (this._isOnState(d, e.state)) on++;
      }
    }

    if (on > 0) {
      const label = cfg.on_label ?? "on";

      if (cfg.show_on_total) return `${on}/${total} ${label}`;

      // If exactly one domain configured, use "9 Lights on"
      if ((cfg.count_domains?.length ?? 0) === 1) {
        const d = cfg.count_domains![0];
        const name = this._titleForDomain(d, on);
        return `${on} ${name} ${label}`;
      }

      // Generic
      return `${on} ${label}`;
    }

    // all off
    const offLabel = cfg.off_label ?? "Off";
    if (cfg.show_off_duration === false) return offLabel;

    const mins = this._minutesSince(ent?.last_changed);
    return `${offLabel}${mins > 0 ? ` \u2013 ${mins}m` : ""}`;
  }

  private _buildSubtitle(ent: any): string {
    const cfg = this._config;

    // Explicit subtitle always wins (even if empty string -> show empty)
    if (cfg.subtitle !== undefined && cfg.subtitle !== null && String(cfg.subtitle).trim() !== "") {
      return String(cfg.subtitle);
    }

    if (!ent) return "";

    const entityId = (cfg.entity || "").trim();
    const domain = this._domain(entityId);

    // Climate: Heat – 21°
    if (domain === "climate") return this._formatClimateSubtitle(ent);

    // Group-like: count on members / show off duration
    if (this._isGroupLike(ent)) return this._buildGroupSubtitle(ent);

    // Default: show state
    return String(ent.state ?? "");
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
      const domain = this._domain(entityId);
      if (!domain) return;
      hass.callService(domain, "toggle", { entity_id: entityId });
      return;
    }

    if (action === "navigate") {
      const path = (cfg.tap_action as any)?.navigation_path;
      if (path) {
        history.pushState(null, "", path);
        window.dispatchEvent(new Event("location-changed"));
      }
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

  // ---------- render ----------

  private _render() {
    if (!this.shadowRoot || !this._config) return;

    const cfg = this._config;
    const hass = this._hass;

    const ent = hass?.states?.[cfg.entity || ""] ?? null;

    const icon = cfg.icon || ent?.attributes?.icon || "mdi:gesture-tap-button";
    const title = cfg.title || ent?.attributes?.friendly_name || "Title";
    const subtitle = this._buildSubtitle(ent);

    // Keep HTML safe
    const safeIcon = this._escapeHtml(icon);
    const safeTitle = this._escapeHtml(title);
    const safeSubtitle = this._escapeHtml(subtitle);

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

// Define custom element by TAG only
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
  description:
    "2x2 tile button with icon, title and smart subtitle (groups, climate, etc.).",
  preview: true,
});

export {};
