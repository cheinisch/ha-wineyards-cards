class WineyardsSecurityOverview extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  set hass(hass) {
    const alarm = hass.states["alarm_control_panel.alarmo"];
    const locks = hass.states["lock.house_locks"];
    const garage = hass.states["cover.garage_doors"];

    const alarmState = alarm?.state || "unknown";
    const lockState = locks?.state || "unknown";
    const garageState = garage?.state || "unknown";

    this.innerHTML = `
      <ha-card>
        <div class="container">

          <!-- HEADER -->
          <div class="header">
            Security
          </div>

          <!-- ITEMS -->
          <div class="items">

            <div class="item">
              <ha-icon icon="mdi:shield-outline"></ha-icon>
              <div class="label">Alarm</div>
              <div class="state">${alarmState}</div>
            </div>

            <div class="item">
              <ha-icon icon="mdi:lock-outline"></ha-icon>
              <div class="label">Locks</div>
              <div class="state">${lockState}</div>
            </div>

            <div class="item">
              <ha-icon icon="mdi:garage"></ha-icon>
              <div class="label">Garage</div>
              <div class="state">${garageState}</div>
            </div>

          </div>
        </div>

        <style>
          ha-card {
            background: #2c2f36;
            border-radius: 18px;
            padding: 20px;
            color: white;
            font-family: var(--primary-font-family);
          }

          .header {
            font-size: 20px;
            font-weight: 300;
            margin-bottom: 20px;
          }

          .items {
            display: flex;
            justify-content: space-between;
            text-align: center;
          }

          .item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }

          ha-icon {
            width: 28px;
            height: 28px;
            opacity: 0.9;
          }

          .label {
            font-size: 14px;
            opacity: 0.7;
            font-weight: 300;
          }

          .state {
            font-size: 16px;
            font-weight: 400;
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
  description: "Minimal security overview card"
});
