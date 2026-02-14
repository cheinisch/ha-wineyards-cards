class WineyardsSecurityOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    this._config = {
      title: "Security",
      alarm_entity: "alarm_control_panel.alarmo",
      locks_entity: null,
      windows_entity: null,
      ...config,
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this.shadowRoot || !this._config || !this._hass) return;

    const cfg = this._config;
    const hass = this._hass;

    const alarm = cfg.alarm_entity ? hass.states[cfg.alarm_entity] : undefined;
    const locks = cfg.locks_entity ? hass.states[cfg.locks_entity] : undefined;
    const windows = cfg.windows_entity ? hass.states[cfg.windows_entity] : undefined;

    const alarmState = alarm?.state ?? "unknown";
    const lockState = locks?.state ?? "unknown";
    const windowsState = windows?.state ?? "unknown";

    this.shadowRoot.innerHTML = `
      <ha-card class="wy-card">
        <div class="wy-wrap">

          <div class="wy-title">${cfg.title}</div>

          <div class="wy-grid">

            <div class="wy-item">
              <ha-icon icon="mdi:shield-outline"></ha-icon>
              <div class="wy-label">Alarm</div>
              <div class="wy-state">${alarmState}</div>
            </div>

            <div class="wy-item">
              <ha-icon icon="mdi:lock-outline"></ha-icon>
              <div class="wy-label">Locks</div>
              <div class="wy-state">${lockState}</div>
            </div>

            <div class="wy-item">
              <ha-icon icon="mdi:window-closed-variant"></ha-icon>
              <div class="wy-label">Windows</div>
              <div class="wy-state">${windowsState}</div>
            </div>

          </div>
        </div>

        <style>
          .wy-card{
            background:#2c2f36;
            border-radius:18px;
            padding:18px 20px;
            color:#fff;
            font-family: var(--primary-font-family);
            box-shadow:none;
          }

          .wy-wrap{
            display:flex;
            flex-direction:column;
            width:100%;
          }

          .wy-title{
            width:100%;
            font-size:20px;
            font-weight:300;
            margin:0 0 14px 0;
          }

          .wy-grid{
            display:grid;
            grid-template-columns: repeat(3, 1fr);
            width:100%;
            text-align:center;
          }

          .wy-item{
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:6px;
          }

          ha-icon{
            width:28px;
            height:28px;
            opacity:0.95;
          }

          .wy-label{
            font-size:13px;
            font-weight:300;
            opacity:0.7;
          }

          .wy-state{
            font-size:16px;
            font-weight:400;
          }
        </style>
      </ha-card>
    `;
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("wineyards-security-overview-v2", WineyardsSecurityOverview);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "wineyards-security-overview",
  name: "Wineyards Security Overview",
  description: "Security overview with Windows instead of Garage",
});
