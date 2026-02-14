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
            background:#2c2f36 !important;
            border-radius:18px !important;
            padding:18px 20px !important;
            color:#fff !important;
            font-family: var(--primary-font-family) !important;
            box-shadow:none !important;
          }

          /* Erzwinge Spalten-Layout, egal was global drauf wirkt */
          .wy-sec-wrap{
            display:flex !important;
            flex-direction:column !important;
            width:100% !important;
            min-width:0 !important;
          }

          .wy-sec-title{
            display:block !important;
            width:100% !important;
            font-size:20px !important;
            font-weight:300 !important;
            margin:0 0 14px 0 !important;
            line-height:1.2 !important;
          }

          .wy-sec-grid{
            display:grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            width:100% !important;
            text-align:center !important;
          }

          .wy-sec-item{
            display:flex !important;
            flex-direction:column !important;
            align-items:center !important;
            justify-content:flex-start !important;
            gap:6px !important;
            min-width:0 !important;
          }

          .wy-sec-item ha-icon{
            width:28px !important;
            height:28px !important;
            opacity:0.95 !important;
          }

          .wy-sec-label{
            font-size:13px !important;
            font-weight:300 !important;
            opacity:0.7 !important;
            line-height:1.1 !important;
          }

          .wy-sec-state{
            font-size:16px !important;
            font-weight:400 !important;
            line-height:1.1 !important;
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
