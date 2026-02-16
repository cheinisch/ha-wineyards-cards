import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";

export interface ValueConfig {
  label: string;
  entity: string;
  unit?: string;
  icon?: string;
  min: number;
  max: number;
  decimals?: number;
}

export interface WineyardClimateCardConfig {
  type: string;

  title?: string;
  icon?: string; // top-right icon

  // Main (big) value
  main_entity: string;
  main_unit?: string;
  main_decimals?: number;

  // Graph
  graph_entity?: string; // defaults to main_entity
  graph_hours?: number; // default 12
  graph_points?: number; // default 48

  // Bottom values (Option A = exactly 2)
  value_1: ValueConfig;
  value_2: ValueConfig;
}

@customElement("wineyard-climate-card")
export class WineyardClimateCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: WineyardClimateCardConfig;

  // sparkline cache
  @state() private _series: number[] | null = null;
  @state() private _seriesFetchedAt = 0;
  private _fetchInFlight: Promise<void> | null = null;

  static getConfigElement(): LovelaceCardEditor {
    return document.createElement("wineyard-climate-card-editor") as LovelaceCardEditor;
  }

  static getStubConfig(): WineyardClimateCardConfig {
    return {
      type: "custom:wineyard-climate-card",
      title: "Indoor Climate",
      icon: "mdi:thermometer",

      main_entity: "sensor.wohnzimmer_temperature",
      main_unit: "°C",
      main_decimals: 0,

      graph_entity: "sensor.wohnzimmer_temperature",
      graph_hours: 12,
      graph_points: 48,

      value_1: {
        label: "Humidity",
        entity: "sensor.wohnzimmer_humidity",
        unit: "%",
        min: 30,
        max: 70,
        decimals: 0,
      },
      value_2: {
        label: "PM2.5",
        entity: "sensor.wohnzimmer_pm25",
        unit: "µg/m³",
        min: 0,
        max: 25,
        decimals: 1,
      },
    };
  }

  public setConfig(config: WineyardClimateCardConfig): void {
    if (!config?.main_entity) throw new Error("main_entity is required");
    if (!config?.value_1?.entity) throw new Error("value_1.entity is required");
    if (!config?.value_2?.entity) throw new Error("value_2.entity is required");

    this._config = {
      graph_hours: 12,
      graph_points: 48,
      ...config,
      graph_entity: config.graph_entity ?? config.main_entity,
    };

    this._series = null;
    this._seriesFetchedAt = 0;
  }

  public getCardSize(): number {
    return 3;
  }

  protected updated(): void {
    const ge = this._config?.graph_entity;
    if (!ge || !this.hass) return;

    const now = Date.now();
    const cacheMs = 5 * 60 * 1000;
    if (!this._series || now - this._seriesFetchedAt > cacheMs) {
      void this._ensureSeries();
    }
  }

  private async _ensureSeries(): Promise<void> {
    if (this._fetchInFlight) return this._fetchInFlight;

    const entity = this._config.graph_entity;
    if (!entity) return;

    this._fetchInFlight = (async () => {
      try {
        const hours = this._config.graph_hours ?? 12;
        const points = this._config.graph_points ?? 48;

        const end = new Date();
        const start = new Date(end.getTime() - hours * 60 * 60 * 1000);

        const path =
          `history/period/${start.toISOString()}` +
          `?filter_entity_id=${encodeURIComponent(entity)}` +
          `&end_time=${encodeURIComponent(end.toISOString())}`;

        const result = (await this.hass.callApi("GET", path)) as any[];
        const items = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];

        const numeric = items
          .map((it) => parseFloat(it.state))
          .filter((v) => Number.isFinite(v));

        if (numeric.length === 0) {
          this._series = null;
        } else if (numeric.length <= points) {
          this._series = numeric;
        } else {
          const stride = Math.max(1, Math.floor(numeric.length / points));
          const ds: number[] = [];
          for (let i = 0; i < numeric.length; i += stride) ds.push(numeric[i]);
          this._series = ds.slice(0, points);
        }

        this._seriesFetchedAt = Date.now();
      } catch {
        this._series = null;
      } finally {
        this._fetchInFlight = null;
      }
    })();

    return this._fetchInFlight;
  }

  private _state(entityId?: string): string | null {
    if (!entityId) return null;
    const st = this.hass.states[entityId];
    if (!st) return null;
    return st.state;
  }

  private _num(entityId?: string): number | null {
    const s = this._state(entityId);
    if (s == null) return null;
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : null;
  }

  private _unitFromState(entityId?: string): string | null {
    if (!entityId) return null;
    const st = this.hass.states[entityId];
    if (!st) return null;
    return (st.attributes?.unit_of_measurement as string) ?? null;
  }

  private _formatNumber(value: number, decimals?: number): string {
    if (!Number.isFinite(value)) return "—";
    const d = decimals ?? 0;
    return value.toFixed(Math.max(0, Math.min(6, d)));
  }

  private _clamp01(v: number): number {
    return Math.max(0, Math.min(1, v));
  }

  private _percent(value: number, min: number, max: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || max === min) return 0;
    return this._clamp01((value - min) / (max - min));
  }

  // green(120) -> red(0)
  private _hslGreenToRed(p: number): string {
    const hue = (1 - p) * 120;
    return `hsl(${hue} 90% 55%)`;
  }

  private _colorFor(value: number, min: number, max: number): string {
    return this._hslGreenToRed(this._percent(value, min, max));
  }

  private _renderSparkline(): unknown {
    const series = this._series;
    if (!series || series.length < 2) {
      return html`<div class="graphPlaceholder"></div>`;
    }

    const w = 560;
    const h = 130;
    const pad = 0; // no padding

    const min = Math.min(...series);
    const max = Math.max(...series);
    const span = max - min || 1;

    const pts = series.map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return { x, y };
    });

    const dLine = `M ${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`;
    const dArea =
      `M ${pts[0].x.toFixed(1)} ${h}` +
      ` L ${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}` +
      ` L ${pts[pts.length - 1].x.toFixed(1)} ${h} Z`;

    return html`
      <svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="wyLineGrad" x1="0" x2="1">
            <stop offset="0%" stop-color="hsl(95 90% 60%)"></stop>
            <stop offset="45%" stop-color="hsl(75 90% 60%)"></stop>
            <stop offset="100%" stop-color="hsl(55 90% 60%)"></stop>
          </linearGradient>

          <linearGradient id="wyFillGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="hsl(95 90% 60% / .22)"></stop>
            <stop offset="100%" stop-color="hsl(95 90% 60% / 0)"></stop>
          </linearGradient>

          <filter id="wyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur"></feGaussianBlur>
            <feMerge>
              <feMergeNode in="blur"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>

        <path d="${dArea}" fill="url(#wyFillGrad)"></path>
        <path
          d="${dLine}"
          fill="none"
          stroke="url(#wyLineGrad)"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#wyGlow)"
        ></path>
      </svg>
    `;
  }

  /**
   * Dots like screenshot:
   * - 5 dots
   * - only ONE dot is "active" (not a progress bar)
   * - active dot color depends on where the value lies between min/max (green -> red)
   */
  private _renderDots(value: number | null, min: number, max: number): unknown {
    const dots = 5;

    if (value == null) {
      return html`
        <div class="dots">
          ${Array.from({ length: dots }).map(
            () => html`<span class="dot" style="background: var(--disabled-text-color); opacity:.30"></span>`
          )}
        </div>
      `;
    }

    const p = this._percent(value, min, max);
    const idx = Math.round(p * (dots - 1)); // 0..4

    return html`
      <div class="dots">
        ${Array.from({ length: dots }).map((_, i) => {
          const active = i === idx;
          const c = this._hslGreenToRed(i / (dots - 1));
          return html`<span
            class="dot"
            style="
              background:${active ? c : "color-mix(in srgb, var(--primary-text-color) 14%, transparent)"};
              opacity:${active ? "1" : ".55"};
            "
          ></span>`;
        })}
      </div>
    `;
  }

  private _renderBottomValue(v: ValueConfig): unknown {
    const num = this._num(v.entity);
    const unit = v.unit ?? this._unitFromState(v.entity) ?? "";

    const color = num == null ? "var(--secondary-text-color)" : this._colorFor(num, v.min, v.max);

    const label = v.label ?? "";
    const valueText = num == null ? "—" : this._formatNumber(num, v.decimals);

    return html`
      <div class="bottomCell">
        <div class="bottomLabel">${label}</div>

        <div class="bottomMid">
          <div class="bottomValueStack">
            <div class="bottomNumber" style="color:${color}">${valueText}</div>
            <div class="bottomUnit">${unit}</div>
          </div>

          <div class="bottomDots">
            ${this._renderDots(num, v.min, v.max)}
          </div>
        </div>
      </div>
    `;
  }

  protected render() {
    if (!this._config) return nothing;

    const title = this._config.title ?? "Indoor Climate";
    const icon = this._config.icon;

    const mainNum = this._num(this._config.main_entity);
    const mainUnit = this._config.main_unit ?? this._unitFromState(this._config.main_entity) ?? "";
    const mainText =
      mainNum == null
        ? "—"
        : `${this._formatNumber(mainNum, this._config.main_decimals)}${mainUnit ? " " + mainUnit : ""}`;

    return html`
      <ha-card class="cardRoot">
        <div class="cardInner">
          <div class="topRow">
            <div class="title">${title}</div>
            ${icon ? html`<ha-icon class="topIcon" icon="${icon}"></ha-icon>` : nothing}
          </div>

          <div class="mainValue">${mainText}</div>

          <div class="graphWrap">
            ${this._renderSparkline()}
          </div>

          <div class="bottomRow">
            ${this._renderBottomValue(this._config.value_1)}
            ${this._renderBottomValue(this._config.value_2)}
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card.cardRoot {
      border-radius: 26px;
      overflow: hidden;
      background: color-mix(in srgb, var(--ha-card-background, var(--card-background-color)) 92%, black);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
    }

    .cardInner {
      padding: 18px 18px 16px;
    }

    .topRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 6px;
    }

    .title {
      font-size: 18px;
      font-weight: 500;
      opacity: 0.72;
      letter-spacing: 0.2px;
    }

    .topIcon {
      opacity: 0.72;
      --mdc-icon-size: 22px;
    }

    .mainValue {
      font-size: 54px;
      font-weight: 300;
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin: 0 0 12px;
    }

    /* Graph: no padding/margin inside */
    .graphWrap {
      height: 130px;
      width: 100%;
      border-radius: 18px;
      overflow: hidden;
      background: color-mix(in srgb, var(--primary-background-color) 65%, transparent);
      padding: 0;
      margin: 0;
    }

    .spark {
      width: 100%;
      height: 100%;
      display: block;
      margin: 0;
    }

    .graphPlaceholder {
      width: 100%;
      height: 100%;
      opacity: 0.35;
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--primary-text-color) 10%, transparent),
        transparent
      );
    }

    /* Bottom like screenshot: two columns with center divider */
    .bottomRow {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      margin-top: 14px;
    }

    .bottomRow > .bottomCell:first-child {
      padding-right: 14px;
      border-right: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }

    .bottomRow > .bottomCell:last-child {
      padding-left: 14px;
    }

    .bottomCell {
      padding-top: 4px;
    }

    .bottomLabel {
      font-size: 14px;
      opacity: 0.65;
      margin-bottom: 8px;
    }

    .bottomMid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .bottomValueStack {
      display: grid;
      gap: 4px;
    }

    .bottomNumber {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1;
    }

    .bottomUnit {
      font-size: 12px;
      opacity: 0.6;
      line-height: 1;
    }

    .bottomDots {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .dots {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      display: inline-block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "wineyard-climate-card": WineyardClimateCard;
  }
}

// Registry entry
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "wineyard-climate-card",
  name: "Wineyard Climate Card",
  description: "Climate card with sparkline (no padding) and two min/max dot-scored values (green→red).",
});
