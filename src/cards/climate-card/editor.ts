import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import type { WineyardClimateCardConfig } from "./card";

@customElement("wineyard-climate-card-editor")
export class WineyardClimateCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: WineyardClimateCardConfig;

  public setConfig(config: WineyardClimateCardConfig): void {
    this._config = {
      graph_hours: 12,
      graph_points: 48,
      ...config,
      graph_entity: config.graph_entity ?? config.main_entity,
    };
  }

  private _emit(config: WineyardClimateCardConfig) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onMainChanged(ev: CustomEvent) {
    const value = ev.detail?.value as WineyardClimateCardConfig;
    if (!value) return;

    const merged: WineyardClimateCardConfig = {
      graph_hours: 12,
      graph_points: 48,
      ...value,
      type: this._config?.type ?? value.type,
      graph_entity: value.graph_entity ?? value.main_entity,
    };

    this._config = merged;
    this._emit(this._config);
  }

  private _onValue1Changed(ev: CustomEvent) {
    const value = ev.detail?.value as { value_1: any };
    const next = { ...this._config, value_1: value.value_1 };
    this._config = next;
    this._emit(this._config);
  }

  private _onValue2Changed(ev: CustomEvent) {
    const value = ev.detail?.value as { value_2: any };
    const next = { ...this._config, value_2: value.value_2 };
    this._config = next;
    this._emit(this._config);
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;

    const mainSchema: any[] = [
      { name: "title", label: "Title", selector: { text: {} } },
      { name: "icon", label: "Top right icon", selector: { icon: {} } },

      { type: "divider" },
      { type: "section", label: "Main value" },
      { name: "main_entity", label: "Main entity", selector: { entity: {} } },
      { name: "main_unit", label: "Unit (optional)", selector: { text: {} } },
      {
        name: "main_decimals",
        label: "Decimals",
        selector: { number: { min: 0, max: 6, step: 1, mode: "box" } },
      },

      { type: "divider" },
      { type: "section", label: "Graph" },
      { name: "graph_entity", label: "Graph entity (optional)", selector: { entity: {} } },
      {
        name: "graph_hours",
        label: "Hours",
        selector: { number: { min: 1, max: 72, step: 1, mode: "box" } },
      },
      {
        name: "graph_points",
        label: "Points",
        selector: { number: { min: 10, max: 200, step: 1, mode: "box" } },
      },
    ];

    const valueSchema: any[] = [
      { name: "label", label: "Label", selector: { text: {} } },
      { name: "entity", label: "Entity", selector: { entity: {} } },
      { name: "unit", label: "Unit (optional)", selector: { text: {} } },
      { name: "icon", label: "Icon (optional)", selector: { icon: {} } },
      { name: "min", label: "Min", selector: { number: { mode: "box" } } },
      { name: "max", label: "Max", selector: { number: { mode: "box" } } },
      {
        name: "decimals",
        label: "Decimals",
        selector: { number: { min: 0, max: 6, step: 1, mode: "box" } },
      },
    ];

    return html`
      <div class="wrap">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${mainSchema}
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
              selector: { object: { schema: valueSchema } },
            },
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
              selector: { object: { schema: valueSchema } },
            },
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

  static styles = css`
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
}

declare global {
  interface HTMLElementTagNameMap {
    "wineyard-climate-card-editor": WineyardClimateCardEditor;
  }
}
