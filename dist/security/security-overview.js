class WineyardsSecurityOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    this._config = {
      title: "Security",
      alarm_entity: "alarm_control_panel.alarmo",
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

    const alarm = hass.states[cfg.alarm_entity];
    const windows = cfg.windows_entity ? hass.states[cfg.windows_entity] : undefined;

    const alarmState = alarm?.state ?? "unknown";
    const windowsState = windows?.state ?? "unknown";

    const isActive = alarmState !== "disarmed";

    const statusColor = isActive ? "#4caf50" : "#f44336";
    const statusText = isActive ? "Aktiv" : "Inaktiv";

    const actionText = isActive ? "Deaktivieren" : "Aktivieren";
    const actionIcon = isActive ? "mdi:shield-off" : "mdi:shield-check";

    this.shadowRoot.innerHTML = `
      <ha-card class="wy-card">
        <div class="wy-wrap">

          <div class="wy-title">${cfg.title}</div>

          <div class="wy-grid">

            <!-- STATUS -->
            <div class="wy-item status" style="--status-color:${statusColor}">
              <ha-icon icon="${isActive ? "mdi:shield-lock" : "mdi:shield-off"}"></ha-icon>
              <div class="wy-label">Alarm</div>
              <div class="wy-state">${statusText}</div>
            </div>

            <!-- ACTION -->
            <div class="wy-item action">
              <ha-icon icon="${actionIcon}"></ha-icon>
              <div class="wy-label">${actionText}</div>
            </div>

            <!-- WINDOWS -->
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
            cursor:pointer;
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
            font-weight:500;
          }

          .status ha-icon,
          .status .wy-state{
            color: var(--status-color);
          }

          .action:hover{
            opacity:0.8;
          }
        </style>
      </ha-card>
    `;

    // Click Verhalten
    const actionEl = this.shadowRoot.querySelector(".action");
    if (actionEl) {
      actionEl.onclick = () => {
        if (isActive) {
          hass.callService("alarm_control_panel", "alarm_disarm", {
            entity_id: cfg.alarm_entity
          });
        } else {
          hass.callService("alarm_control_panel", "alarm_arm_away", {
            entity_id: cfg.alarm_entity
          });
        }
      };
    }
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("wineyards-security-overview-v3", WineyardsSecurityOverview);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "wineyards-security-overview",
  name: "Wineyards Security Overview",
  description: "Security overview with dynamic activate/deactivate",
});
