class WineyardsSecurityOverview extends HTMLElement {
  setConfig(config) {
    this._config = {
      title: "Security",
      alarm_entity: "alarm_control_panel.alarmo",
      locks_entity: null,
      garage_entity: null,
      ...config,
    };
  }

  set hass(hass) {
    const cfg = this._config;

    const alarm = cfg.alarm_entity ? hass.states[cfg.alarm_entity] : undefined;
    const locks = cfg.locks_entity ? hass.states[cfg.locks_entity] : undefined;
    const garage = cfg.garage_entity ? hass.states[cfg.garage_entity] : undefined;

    const alarmState = alarm?.state ?? "unknown";
    const lockState = locks?.state ?? "unknown";
    const garageState = garage?.state ?? "unknown";

    this.innerHTML = `
      <ha-card class="wy-sec-card">
        <div class="wy-sec-wrap">

          <div class="wy-sec-title">${cfg.title}</div>

          <div class="wy-sec-grid">
            <div class="wy-sec-item">
              <ha-icon icon="mdi:shield-outline"></ha-icon>
              <div class="wy-sec-label">Alarm</div>
              <div class="wy-sec-state">${alarmState}</div>
            </div>

            <div class="wy-sec-item">
              <ha-icon icon="mdi:lock-outline"></ha-icon>
              <div class="wy-sec-label">Locks</div>
              <div class="wy-sec-state">${lockState}</div>
            </div>

            <div class="wy-sec-item">
              <ha-icon icon="mdi:garage"></ha-icon>
              <div class="wy-sec-label">Garage</div>
              <div class="wy-sec-state">${garageState}</div>
            </div>
          </div>

        </div>

        <style>
          .wy-sec-card{
            background:#2c2f36;
            border-radius:18px;
            padding:18px 20px;
            color:#fff;
            font-family: var(--primary-font-family);
            box-shadow:none;
          }

          .wy-sec-wrap{
            display:block;
            width:100%;
          }

          .wy-sec-title{
            width:100%;
            font-size:20px;
            font-weight:300;
            margin-bottom:14px;
            line-height:1.2;
          }

          .wy-sec-grid{
            width:100%;
            display:grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
            text-align:center;
          }

          .wy-sec-item{
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:flex-start;
            gap:6px;
            min-width:0;
          }

          .wy-sec-item ha-icon{
            width:28px;
            height:28px;
            opacity:0.95;
          }

          .wy-sec-label{
            font-size:13px;
            font-weight:300;
            opacity:0.7;
            line-height:1.1;
          }

          .wy-sec-state{
            font-size:16px;
            font-weight:400;
            line-height:1.1;
            text-transform: none;
          }
        </style>
      </ha-card>
    `;
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("wineyards-security-overview", WineyardsSecurityOverview);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "wineyards-security-overview",
  name: "Wineyards Security Overview",
  description: "Security overview with 3 equal columns",
});
