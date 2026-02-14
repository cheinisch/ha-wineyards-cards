class WineyardsClimateCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("Temperature entity required");
    }
    this._config = config;
  }

  set hass(hass) {
    const temp = hass.states[this._config.entity]?.state || "--";
    const humidity = hass.states[this._config.humidity]?.state || "--";
    const co2 = hass.states[this._config.co2]?.state || "--";
    const chemicals = hass.states[this._config.chemicals]?.state || "--";
    const pm25 = hass.states[this._config.pm25]?.state || "--";

    this.innerHTML = `
      <ha-card>
        <div class="container">

          <div class="header">
            <div>
              <div class="title">Indoor Climate</div>
              <div class="temp">${temp}°</div>
            </div>
            <ha-icon icon="mdi:thermometer"></ha-icon>
          </div>

          <div class="graph">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#cddc39"/>
                  <stop offset="100%" stop-color="#4caf50"/>
                </linearGradient>
              </defs>
              <path
                d="M0,15 C10,10 20,20 30,15 40,10 50,18 60,22 70,25 80,18 100,12"
                fill="none"
                stroke="url(#grad)"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div class="stats">
            ${this._item("Humidity", humidity, "%")}
            ${this._item("CO₂", co2, "ppm")}
            ${this._item("Chemicals", chemicals, "ppb")}
            ${this._item("PM2.5", pm25, "µg/m³")}
          </div>

        </div>

        <style>
          ha-card {
            background: #2c2f36;
            border-radius: 18px;
            padding: 20px;
            color: #fff;
            font-family: var(--primary-font-family);
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .title {
            font-size: 18px;
            font-weight: 300;
            opacity: 0.7;
          }

          .temp {
            font-size: 48px;
            font-weight: 200;
            margin-top: 4px;
          }

          .graph {
            height: 90px;
            margin-top: 10px;
          }

          .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-top: 20px;
            text-align: center;
          }

          .stat-title {
            font-size: 14px;
            opacity: 0.6;
            font-weight: 300;
          }

          .stat-value {
            font-size: 22px;
            font-weight: 300;
            margin-top: 4px;
          }

          .stat-unit {
            font-size: 12px;
            opacity: 0.5;
          }
        </style>
      </ha-card>
    `;
  }

  _item(title, value, unit) {
    return `
      <div>
        <div class="stat-title">${title}</div>
        <div class="stat-value">${value}</div>
        <div class="stat-unit">${unit}</div>
      </div>
    `;
  }

  getCardSize() {
    return 4;
  }
}

customElements.define("wineyards-climate-card", WineyardsClimateCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "wineyards-climate-card",
  name: "Wineyards Climate Card",
  description: "Modern indoor climate overview"
});
