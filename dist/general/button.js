/* Wineyard Tile Button (2x2) + GUI Editor (picker-stabil)
 *
 * File: /config/www/dev/general/button.js
 * Resource: /local/dev/general/button.js?v=1   (type: module)
 *
 * In HA UI Picker wird es als:
 *  type: wineyard-tile-button
 * angelegt (stabil).
 *
 * Manuell kannst du weiterhin schreiben:
 *  type: custom:wineyard-tile-button
 * (falls dein HA das im YAML korrekt mappt).
 */

const WY_TYPE = "wineyard-tile-button";
const WY_EDITOR = "wineyard-tile-button-editor";

/* -----------------------------
 * Helpers
 * ----------------------------- */

function wyDeepClone(obj) {
  return obj ? JSON.parse(JSON.stringify(obj)) : obj;
}

function wyEmit(target, type, detail, options = {}) {
  target.dispatchEvent(
    new CustomEvent(type, {
      detail,
      bubbles: options.bubbles ?? true,
      composed: options.composed ?? true,
    })
  );
}

function wyNormalizeTapAction(tap_action) {
  const t = tap_action || {};
  const action = t.action || "more-info";
  const out = { action };

  if (action === "call-service") {
    if (t.service) out.service = String(t.service);
    if (t.service_data && typeof t.service_data === "object") out.service_data = t.service_data;
  }
  return out;
}

/* -----------------------------
 * Card
 * ----------------------------- */

class WineyardTileButton extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._hass = null;
    this.attachShadow({ mode: "open" });
  }

  // ✅ 2x2 in Sections/Grid layout
  static getLayoutOptions() {
    return { grid_columns: 2, grid_rows: 2 };
  }

  // ✅ Stub MUST be without custom: (prevents <custom:...> creation)
  static getStubConfig() {
    return {
      type: WY_TYPE,
      entity: "",
      icon: "mdi:radiator",
      title: "Main Floor",
      subtitle: "Heat • 75°",
      tap_action: { action: "more-info" },
    };
  }

  static getConfigElement() {
    return document.createElement(WY_EDITOR);
  }

  setConfig(config) {
    if (!config) throw new Error(`${WY_TYPE}: config is required`);

    this._config = {
      entity: config.entity ?? null,
      icon: config.icon ?? null,
      title: config.title ?? config.name ?? "Title",
      subtitle: config.subtitle ?? "",
      tap_action: wyNormalizeTapAction(config.tap_action),
    };

    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 4;
  }

  _render() {
    if (!this._config) return;

    const hass = this._hass;
    const entity = (hass && this._config.entity) ? hass.states[this._config.entity] : null;

    const icon =
      this._config.icon ||
      entity?.attributes?.icon ||
      "mdi:gesture-tap-button";

    const title =
      this._config.title ||
      entity?.attributes?.friendly_name ||
      "Title";

    const subtitle = String(this._config.subtitle ?? "");

    const isActive = entity
      ? (entity.state !== "off" && entity.state !== "idle" && entity.state !== "unavailable")
      : false;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }

        ha-card {
          border-radius: 16px;
          padding: 16px;
          height: 100%;
          min-height: 150px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          transition: transform 120ms ease;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }
        ha-card:active { transform: scale(0.99); }

        .wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
          width: 100%;
        }

        .icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        ha-icon {
          --mdc-icon-size: 30px;
          color: var(--primary-text-color);
          opacity: 0.95;
          transition: color 120ms ease, opacity 120ms ease;
        }

        .active ha-icon {
          color: var(--accent-color);
          opacity: 1;
        }

        .title {
          font-size: 1.08rem;
          font-weight: 650;
          line-height: 1.2;
          color: var(--primary-text-color);
        }

        .subtitle {
          font-size: 0.92rem;
          opacity: 0.65;
          color: var(--primary-text-color);
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>

      <ha-card>
        <div class="wrap ${isActive ? "active" : ""}">
          <div class="icon"><ha-icon icon="${icon}"></ha-icon></div>
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">${subtitle}</div>
          </div>
        </div>
      </ha-card>
    `;

    this.shadowRoot.querySelector("ha-card").onclick = () => this._handleTap();
  }

  _handleTap() {
    const hass = this._hass;
    if (!hass) return;

    const entityId = this._config?.entity;
    const tap = this._config?.tap_action || { action: "more-info" };
    const action = tap.action || "more-info";

    if (action === "none") return;

    if (action === "more-info") {
      if (!entityId) return;
      const ev = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId };
      this.dispatchEvent(ev);
      return;
    }

    if (action === "toggle") {
      if (!entityId) return;
      hass.callService("homeassistant", "toggle", { entity_id: entityId });
      return;
    }

    if (action === "call-service") {
      const svc = tap.service;
      if (!svc) return;
      const [domain, service] = String(svc).split(".", 2);
      if (!domain || !service) return;
      hass.callService(domain, service, { ...(tap.service_data || {}) });
    }
  }
}

/* -----------------------------
 * GUI Editor
 * ----------------------------- */

class WineyardTileButtonEditor extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  setConfig(config) {
    this._config = wyDeepClone(config) || {};
    this._config.tap_action = wyNormalizeTapAction(this._config.tap_action);

    // ✅ keep type picker-safe while editing
    this._config.type = WY_TYPE;

    this._render();
  }

  _render() {
    if (!this.shadowRoot) return;

    const cfg = this._config || {};
    const tap = wyNormalizeTapAction(cfg.tap_action);
    const showService = tap.action === "call-service";

    this.shadowRoot.innerHTML = `
      <style>
        .grid { display:grid; grid-template-columns:1fr; gap:12px; padding:4px 0; }
        .hint { opacity:0.7; font-size:12px; line-height:1.3; }
        ha-textfield, ha-select, ha-entity-picker, ha-icon-picker { width:100%; }
        .serviceWrap { display:${showService ? "grid" : "none"}; gap:12px; }
      </style>

      <div class="grid">
        <ha-entity-picker
          label="Entity"
          .hass=${this._hass}
          .value=${cfg.entity || ""}
          allow-custom-entity
        ></ha-entity-picker>

        <div>
          <ha-icon-picker
            label="Icon"
            .hass=${this._hass}
            .value=${cfg.icon || ""}
          ></ha-icon-picker>
          <div class="hint">Leer lassen = Icon vom Entity / Default</div>
        </div>

        <ha-textfield label="Text (Title)" .value=${cfg.title ?? ""}></ha-textfield>
        <ha-textfield label="Subtext (Subtitle)" .value=${cfg.subtitle ?? ""}></ha-textfield>

        <ha-select label="Tap action">
          <mwc-list-item value="more-info" ?selected=${tap.action === "more-info"}>More info</mwc-list-item>
          <mwc-list-item value="toggle" ?selected=${tap.action === "toggle"}>Toggle</mwc-list-item>
          <mwc-list-item value="call-service" ?selected=${tap.action === "call-service"}>Call service</mwc-list-item>
          <mwc-list-item value="none" ?selected=${tap.action === "none"}>None</mwc-list-item>
        </ha-select>

        <div class="serviceWrap">
          <ha-textfield
            label="Service (domain.service)"
            .value=${tap.service ?? ""}
            placeholder="light.turn_on"
          ></ha-textfield>

          <ha-textfield
            label='Service data (JSON)'
            .value=${tap.service_data ? JSON.stringify(tap.service_data) : ""}
            placeholder='{"entity_id":"light.kitchen"}'
          ></ha-textfield>

          <div class="hint">Service data muss gültiges JSON sein. Leer = kein service_data.</div>
        </div>
      </div>
    `;

    const entityPicker = this.shadowRoot.querySelector("ha-entity-picker");
    const iconPicker = this.shadowRoot.querySelector("ha-icon-picker");
    const titleField = this.shadowRoot.querySelectorAll("ha-textfield")[0];
    const subtitleField = this.shadowRoot.querySelectorAll("ha-textfield")[1];
    const tapSelect = this.shadowRoot.querySelector("ha-select");
    const serviceField = this.shadowRoot.querySelectorAll("ha-textfield")[2];
    const serviceDataField = this.shadowRoot.querySelectorAll("ha-textfield")[3];

    entityPicker?.addEventListener("value-changed", (e) => this._setValue("entity", e.detail.value || ""));
    iconPicker?.addEventListener("value-changed", (e) => this._setValue("icon", e.detail.value || ""));
    titleField?.addEventListener("input", (e) => this._setValue("title", e.target.value));
    subtitleField?.addEventListener("input", (e) => this._setValue("subtitle", e.target.value));

    tapSelect?.addEventListener("selected", (e) => {
      const action = e.target.value;
      const nextTap = wyNormalizeTapAction({ ...(this._config.tap_action || {}), action });
      this._setValue("tap_action", nextTap);
      this._render();
    });

    serviceField?.addEventListener("input", (e) => {
      const nextTap = wyNormalizeTapAction({ ...(this._config.tap_action || {}), service: e.target.value });
      this._setValue("tap_action", nextTap);
    });

    serviceDataField?.addEventListener("input", (e) => {
      const raw = e.target.value;

      if (!raw || !raw.trim()) {
        const next = { ...(this._config.tap_action || {}) };
        delete next.service_data;
        this._setValue("tap_action", wyNormalizeTapAction(next));
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        const next = { ...(this._config.tap_action || {}), service_data: parsed };
        this._setValue("tap_action", wyNormalizeTapAction(next));
      } catch {
        // ignore invalid JSON while typing
      }
    });
  }

  _setValue(key, value) {
    const cfg = wyDeepClone(this._config) || {};
    cfg[key] = value;

    // keep editor safe
    cfg.type = WY_TYPE;

    this._config = cfg;
    wyEmit(this, "config-changed", { config: cfg });
  }
}

/* -----------------------------
 * Define + picker registration (NO custom:)
 * ----------------------------- */

if (!customElements.get(WY_TYPE)) customElements.define(WY_TYPE, WineyardTileButton);
if (!customElements.get(WY_EDITOR)) customElements.define(WY_EDITOR, WineyardTileButtonEditor);

// Picker entry MUST be without custom:
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === WY_TYPE)) {
  window.customCards.push({
    type: WY_TYPE,
    name: "Wineyard Tile Button (2x2)",
    description: "2x2 tile button with icon, title, subtitle + GUI editor (picker-stabil).",
  });
}
