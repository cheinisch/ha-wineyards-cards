class WineyardsAlarmSmall extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("Entity required");
    }
    this._config = config;
  }

  set hass(hass) {
    const entity = hass.states[this._config.entity];
    if (!entity) return;

    const state = entity.state;
    const isArmed = state !== "disarmed";

    const color = isArmed ? "#4caf50" : "#f44336";
    const label = isArmed ? "Armed" : "Disarmed";
    const icon = isArmed ? "mdi:shield-lock" : "mdi:shield-off";

    this.innerHTML = `
      <ha-card>
        <div class="row">
          <div class="status" style="color:${color}">
            <ha-icon icon="${icon}"></ha-icon>
            <span>${label}</span>
          </div>
          <button class="btn arm">Aktivieren</button>
          <button class="btn disarm">Deaktivieren</button>
        </div>

        <style>
          ha-card {
            background: #2c2f36;
            border-radius: 14px;
            padding: 12px 16px;
            color: white;
            font-family: var(--primary-font-family);
          }

          .row {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 16px;
            font-weight: 300;
            margin-right: auto;
          }

          .btn {
            background: #3a3f47;
            border: none;
            border-radius: 8px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 300;
            color: white;
            cursor: pointer;
            transition: 0.2s;
          }

          .btn:hover {
            background: #4a4f57;
          }
        </style>
      </ha-card>
    `;

    // Aktionen
    this.querySelector(".arm").onclick = () => {
      hass.callService("alarm_control_panel", "alarm_arm_away", {
        entity_id: this._config.entity
      });
    };

    this.querySelector(".disarm").onclick = () => {
      hass.callService("alarm_control_panel", "alarm_disarm", {
        entity_id: this._config.entity
      });
    };

    this.querySelector(".info").onclick = () => {
      hass.moreInfo(this._config.entity);
    };
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("wineyards-alarm-small", WineyardsAlarmSmall);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "wineyards-alarm-small",
  name: "Wineyards Alarm Small",
  description: "Compact alarm control row"
});
