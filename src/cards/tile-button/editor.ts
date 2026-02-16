import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

const ELEMENT = "wineyard-tile-button";
const CARD_TYPE = `custom:${ELEMENT}`;

type TapAction = "more-info" | "toggle" | "navigate" | "call-service" | "none";

export type TileButtonConfig = {
  type?: string;

  entity?: string;
  icon?: string;
  title?: string;
  subtitle?: string;

  tap_action?: {
    action?: TapAction;
    navigation_path?: string;

    service?: string;
    service_data?: Record<string, any>;
  };
};

@customElement("wineyard-tile-button-editor")
export class WineyardTileButtonEditor extends LitElement {
  @property({ attribute: false }) public hass: any;
  @state() private _config: TileButtonConfig = {};

  static styles = css`
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

  public setConfig(config: TileButtonConfig): void {
    this._config = { ...config };
    // erzwinge stabilen Typ
    this._config.type = CARD_TYPE;
  }

  private _value(path: string): any {
    const parts = path.split(".");
    let cur: any = this._config;
    for (const p of parts) cur = cur?.[p];
    return cur;
  }

  private _setValue(path: string, value: any): void {
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

    cfg.type = CARD_TYPE;
    this._config = cfg;

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onInput(e: Event, path: string) {
    const target = e.target as HTMLInputElement;
    this._setValue(path, target.value);
  }

  private _onSelect(e: Event, path: string) {
    const target = e.target as HTMLSelectElement;
    this._setValue(path, target.value);
  }

  private _renderTapActionExtra(action: TapAction) {
    if (action === "navigate") {
      return html`
        <ha-textfield
          label="Navigation path"
          .value=${this._value("tap_action.navigation_path") ?? ""}
          @input=${(e: Event) => this._onInput(e, "tap_action.navigation_path")}
        ></ha-textfield>
        <div class="hint">Beispiel: /lovelace/home</div>
      `;
    }

    if (action === "call-service") {
      return html`
        <ha-textfield
          label="Service (domain.service)"
          .value=${this._value("tap_action.service") ?? ""}
          @input=${(e: Event) => this._onInput(e, "tap_action.service")}
        ></ha-textfield>

        <ha-textfield
          label="Service data (JSON)"
          .value=${this._stringify(this._value("tap_action.service_data"))}
          @input=${(e: Event) => this._onServiceDataJson(e)}
        ></ha-textfield>

        <div class="hint">Beispiel: {"entity_id":"light.kitchen","brightness":200}</div>
      `;
    }

    return nothing;
  }

  private _stringify(v: any): string {
    if (!v) return "";
    try {
      return JSON.stringify(v);
    } catch (_) {
      return "";
    }
  }

  private _onServiceDataJson(e: Event) {
    const v = (e.target as HTMLInputElement).value?.trim();
    if (!v) {
      this._setValue("tap_action.service_data", undefined);
      return;
    }
    try {
      const obj = JSON.parse(v);
      this._setValue("tap_action.service_data", obj);
    } catch {
      // bei invalid JSON: nicht überschreiben (User tippt noch)
    }
  }

  protected render() {
    if (!this.hass) return html``;

    const action: TapAction = (this._value("tap_action.action") ?? "more-info") as TapAction;

    return html`
      <div class="row">
        <ha-entity-picker
          label="Entity"
          .hass=${this.hass}
          .value=${this._config.entity ?? ""}
          @value-changed=${(e: CustomEvent) => this._setValue("entity", e.detail.value)}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-icon-picker
          label="Icon"
          .hass=${this.hass}
          .value=${this._config.icon ?? "mdi:lightbulb"}
          @value-changed=${(e: CustomEvent) => this._setValue("icon", e.detail.value)}
        ></ha-icon-picker>

        <ha-textfield
          label="Title"
          .value=${this._config.title ?? ""}
          @input=${(e: Event) => this._onInput(e, "title")}
        ></ha-textfield>

        <ha-textfield
          label="Subtitle"
          .value=${this._config.subtitle ?? ""}
          @input=${(e: Event) => this._onInput(e, "subtitle")}
        ></ha-textfield>

        <ha-select
          label="Tap action"
          .value=${action}
          @selected=${(e: Event) => this._onSelect(e, "tap_action.action")}
          @closed=${(e: Event) => this._onSelect(e, "tap_action.action")}
        >
          <mwc-list-item value="more-info">More info</mwc-list-item>
          <mwc-list-item value="toggle">Toggle</mwc-list-item>
          <mwc-list-item value="navigate">Navigate</mwc-list-item>
          <mwc-list-item value="call-service">Call service</mwc-list-item>
          <mwc-list-item value="none">None</mwc-list-item>
        </ha-select>

        ${this._renderTapActionExtra(action)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "wineyard-tile-button-editor": WineyardTileButtonEditor;
  }
}
