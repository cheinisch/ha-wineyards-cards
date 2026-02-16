// src/cards/tile-button/editor.ts
import { LitElement, html, css, nothing } from "lit";

const CARD_TAG = "wineyard-tile-button";
const YAML_TYPE = `custom:${CARD_TAG}`;

type TapActionType = "more-info" | "toggle" | "navigate" | "call-service" | "none";

type TapAction =
  | { action: "more-info" }
  | { action: "toggle" }
  | { action: "navigate"; navigation_path?: string }
  | { action: "call-service"; service?: string; service_data?: Record<string, any> }
  | { action: "none" };

export type WineyardTileButtonConfig = {
  type?: string;

  entity?: string;
  icon?: string;
  title?: string;
  subtitle?: string;

  tap_action?: TapAction;

  // group behavior
  count_domains?: string[]; // default: ["light"]
  show_off_duration?: boolean; // default: true
  show_on_total?: boolean; // default: false
  on_label?: string; // default: "on"
  off_label?: string; // default: "Off"

  layout_options?: {
    grid_columns?: number;
    grid_rows?: number;
  };
};

class WineyardTileButtonEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass: any;
  private _config: WineyardTileButtonConfig = {};

  static styles = css`
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

  setConfig(config: WineyardTileButtonConfig) {
    const c = { ...(config || {}) };

    // Normalize type so YAML always becomes custom:...
    const inType = (c.type || "").trim();
    c.type = inType === "" || inType === CARD_TAG || inType === YAML_TYPE ? YAML_TYPE : YAML_TYPE;

    // Defaults (editor-side)
    if (!c.tap_action) c.tap_action = { action: "more-info" };
    if (!c.count_domains || !Array.isArray(c.count_domains) || c.count_domains.length === 0) {
      c.count_domains = ["light"];
    }
    if (c.show_off_duration === undefined) c.show_off_duration = true;
    if (c.show_on_total === undefined) c.show_on_total = false;
    if (!c.on_label) c.on_label = "on";
    if (!c.off_label) c.off_label = "Off";

    this._config = c;
  }

  private _fire(config: WineyardTileButtonConfig) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _setValue(path: string, value: any) {
    const parts = path.split(".");
    const cfg: any = { ...this._config };

    let cur: any = cfg;
    for (let i = 0; i < parts.length - 1; i++) {
      const k = parts[i];
      cur[k] = { ...(cur[k] ?? {}) };
      cur = cur[k];
    }

    const last = parts[parts.length - 1];

    if (value === "" || value === undefined || value === null) {
      delete cur[last];
    } else {
      cur[last] = value;
    }

    cfg.type = YAML_TYPE;
    this._config = cfg;
    this._fire(this._config);
  }

  private _getValue(path: string): any {
    const parts = path.split(".");
    let cur: any = this._config;
    for (const p of parts) cur = cur?.[p];
    return cur;
  }

  private _onText(path: string, e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this._setValue(path, v);
  }

  private _onNumber(path: string, e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    const n = Number(raw);
    this._setValue(path, Number.isFinite(n) ? n : undefined);
  }

  private _onBool(path: string, e: Event) {
    const checked = (e.target as any).checked ?? (e.target as HTMLInputElement).checked;
    this._setValue(path, !!checked);
  }

  private _onEntityPicked(e: any) {
    this._setValue("entity", e?.detail?.value ?? "");
  }

  private _onIconPicked(e: any) {
    this._setValue("icon", e?.detail?.value ?? "");
  }

  private _onTapActionSelected(e: any) {
    const action = (e?.target?.value ?? e?.detail?.value ?? "more-info") as TapActionType;
    const prev = (this._config.tap_action ?? { action: "more-info" }) as any;

    let next: TapAction;
    if (action === "navigate") next = { action, navigation_path: prev.navigation_path ?? "" };
    else if (action === "call-service")
      next = { action, service: prev.service ?? "", service_data: prev.service_data ?? undefined };
    else next = { action } as any;

    this._setValue("tap_action", next);
  }

  private _parseDomains(csv: string): string[] {
    return (csv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  private _stringifyJson(v: any): string {
    if (!v) return "";
    try {
      return JSON.stringify(v);
    } catch {
      return "";
    }
  }

  private _onServiceDataJson(e: Event) {
    const raw = (e.target as HTMLInputElement).value?.trim();
    if (!raw) {
      this._setValue("tap_action.service_data", undefined);
      return;
    }
    try {
      const obj = JSON.parse(raw);
      this._setValue("tap_action.service_data", obj);
    } catch {
      // ignore while typing invalid JSON
    }
  }

  private _tapActionExtra(action: TapActionType) {
    if (action === "navigate") {
      return html`
        <ha-textfield
          label="Navigation path"
          .value=${this._getValue("tap_action.navigation_path") ?? ""}
          @input=${(e: Event) => this._onText("tap_action.navigation_path", e)}
        ></ha-textfield>
        <div class="hint">Beispiel: /lovelace/home</div>
      `;
    }

    if (action === "call-service") {
      return html`
        <ha-textfield
          label="Service (domain.service)"
          .value=${this._getValue("tap_action.service") ?? ""}
          @input=${(e: Event) => this._onText("tap_action.service", e)}
        ></ha-textfield>

        <ha-textfield
          label="Service data (JSON)"
          .value=${this._stringifyJson(this._getValue("tap_action.service_data"))}
          @input=${(e: Event) => this._onServiceDataJson(e)}
        ></ha-textfield>

        <div class="hint">Beispiel: {"entity_id":"light.kitchen","brightness":200}</div>
      `;
    }

    return nothing;
  }

  render() {
    if (!this.hass) return html``;

    const action = (this._getValue("tap_action.action") ?? "more-info") as TapActionType;

    const domainsCsv = (this._config.count_domains ?? ["light"]).join(",");

    return html`
      <div class="root">
        <div class="section">
          <div class="section-title">Basic</div>
          <div class="row">
            <ha-entity-picker
              label="Entity"
              .hass=${this.hass}
              .value=${this._config.entity ?? ""}
              @value-changed=${(e: any) => this._onEntityPicked(e)}
              allow-custom-entity
            ></ha-entity-picker>

            <ha-icon-picker
              label="Icon (optional)"
              .hass=${this.hass}
              .value=${this._config.icon ?? ""}
              @value-changed=${(e: any) => this._onIconPicked(e)}
            ></ha-icon-picker>

            <ha-textfield
              label="Title (optional)"
              .value=${this._config.title ?? ""}
              @input=${(e: Event) => this._onText("title", e)}
            ></ha-textfield>

            <ha-textfield
              label="Subtitle (optional)"
              .value=${this._config.subtitle ?? ""}
              @input=${(e: Event) => this._onText("subtitle", e)}
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
              .value=${action}
              @selected=${(e: any) => this._onTapActionSelected(e)}
              @closed=${(e: any) => this._onTapActionSelected(e)}
            >
              <mwc-list-item value="more-info">More info</mwc-list-item>
              <mwc-list-item value="toggle">Toggle</mwc-list-item>
              <mwc-list-item value="navigate">Navigate</mwc-list-item>
              <mwc-list-item value="call-service">Call service</mwc-list-item>
              <mwc-list-item value="none">None</mwc-list-item>
            </ha-select>

            ${this._tapActionExtra(action)}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Group / Collection subtitle</div>

          <div class="row">
            <ha-textfield
              label="Count domains (comma separated)"
              .value=${domainsCsv}
              @input=${(e: Event) =>
                this._setValue(
                  "count_domains",
                  this._parseDomains((e.target as HTMLInputElement).value)
                )}
            ></ha-textfield>
            <div class="hint">Beispiele: light | light,switch | switch</div>

            <div class="switchrow">
              <div class="label">
                <div class="t">Show total</div>
                <div class="s">9/12 on statt 9 Lights on</div>
              </div>
              <ha-switch
                .checked=${this._config.show_on_total ?? false}
                @change=${(e: Event) => this._onBool("show_on_total", e)}
              ></ha-switch>
            </div>

            <div class="switchrow">
              <div class="label">
                <div class="t">Show off duration</div>
                <div class="s">Off – 10m, wenn alle aus</div>
              </div>
              <ha-switch
                .checked=${this._config.show_off_duration ?? true}
                @change=${(e: Event) => this._onBool("show_off_duration", e)}
              ></ha-switch>
            </div>

            <ha-textfield
              label='On label (default: "on")'
              .value=${this._config.on_label ?? "on"}
              @input=${(e: Event) => this._onText("on_label", e)}
            ></ha-textfield>

            <ha-textfield
              label='Off label (default: "Off")'
              .value=${this._config.off_label ?? "Off"}
              @input=${(e: Event) => this._onText("off_label", e)}
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
              @change=${(e: Event) =>
                this._setValue("layout_options.grid_columns", Number((e.target as any).value))}
            ></ha-textfield>

            <ha-textfield
              label="Layout rows (Sections, default 2)"
              type="number"
              .value=${String(this._config.layout_options?.grid_rows ?? 2)}
              @change=${(e: Event) =>
                this._setValue("layout_options.grid_rows", Number((e.target as any).value))}
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
}

if (!customElements.get("wineyard-tile-button-editor")) {
  customElements.define("wineyard-tile-button-editor", WineyardTileButtonEditor);
}

export {};
