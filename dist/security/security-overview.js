/**
 * Wineyards Security Overview (with Visual Editor)
 *
 * Columns:
 *  1) Alarm Status  (green=aktiv / red=inaktiv / orange=wird aktiviert) -> opens More-Info (via event)
 *  2) Aktivieren / Deaktivieren (dynamic)
 *     - Aktivieren: opens Alarm More-Info popup (Zuhause/Abwesend etc.)
 *     - Deaktivieren: calls alarm_disarm
 *  3) Windows (optional) -> opens More-Info if entity set
 *
 * Pending logic:
 * - We listen to HA websocket event "call_service".
 * - If alarm_control_panel.alarm_arm_away is called for our entity, we show "Wird aktiviert" (orange)
 *   until the entity state becomes armed_* (or timeout).
 */

class WineyardsSecurityOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._unsubCallService = null;
    this._pendingArm = false;
    this._pendingUntil = 0;
  }

  static getConfigElement() {
    return document.createElement("wineyards-security-overview-editor");
  }

  static getStubConfig() {
    return {
      title: "Security",
      alarm_entity: "alarm_control_panel.alarmo",
      windows_entity: "",
      windows_label: "Windows",
      pending_timeout_s: 30,
    };
  }

  setConfig(config) {
    if (!config || !config.alarm_entity) {
      throw new Error("alarm_entity is required (e.g. alarm_control_panel.alarmo)");
    }
    this._config = {
      title: "Security",
      windows_entity: "",
      windows_label: "Windows",
      pending_timeout_s: 30,
      ...config,
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;

    // Subscribe once to detect service calls from the popup (arm_away)
    if (!this._unsubCallService && hass?.connection?.subscribeEvents) {
      hass.connection
        .subscribeEvents((ev) => this._onHaEvent(ev), "call_service")
        .then((unsub) => (this._unsubCallService = unsub))
        .catch(() => {
          // If subscription fails, card still works; pending state just won't be shown.
          this._unsubCallService = null;
        });
    }

    this._render();
  }

  disconnectedCallback() {
    try {
      this._unsubCallService?.();
    } catch (_) {}
    this._unsubCallService = null;
  }

  _onHaEvent(ev) {
    // ev.data: { domain, service, service_data }
    const cfg = this._config;
    if (!cfg || !this._hass) return;
    if (!ev?.data) return;

    const { domain, service, service_data } = ev.data;
    if (domain !== "alarm_control_panel") return;

    // Only trigger pending when user chooses "Abwesend" (away) in the popup
    if (service !== "alarm_arm_away") return;

    const ent = cfg.alarm_entity;
    const ids = service_data?.entity_id;
    const matches =
      ids === ent ||
      (Array.isArray(ids) && ids.includes(ent));

    if (!matches) return;

    // Set pending state (orange) until entity becomes armed_* or timeout
    const timeoutMs = Math.max(5, Number(cfg.pending_timeout_s || 30)) * 1000;
    this._pendingArm = true;
    this._pendingUntil = Date.now() + timeoutMs;
    this._render();
  }

  _openMoreInfo(entityId) {
    if (!entityId) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _render() {
    if (!this.shadowRoot || !this._config || !this._hass) return;

    const cfg = this._config;
    const hass = this._hass;

    const alarm = cfg.alarm_entity ? hass.states[cfg.alarm_entity] : undefined;
    const windows = cfg.windows_entity ? hass.states[cfg.windows_entity] : undefined;

    const alarmState = alarm?.state ?? "unknown";

    const now = Date.now();
    const timedOut = this._pendingArm && now > (this._pendingUntil || 0);

    // Clear pending if timeout or alarm reached armed_* state
    const isArmedState = typeof alarmState === "string" && alarmState.startsWith("armed_");
    if (timedOut || isArmedState) {
      this._pendingArm = false;
      this._pendingUntil = 0;
    }

    const isInactive =
      alarmState === "disarmed" ||
      alarmState === "unknown" ||
      alarmState === "unavailable";

    // Status display priority: pending -> active -> inactive
    const showPending = this._pendingArm && !isArmedState;
    const isActive = !isInactive && !showPending;

    const statusColor = showPending ? "#ff9800" : isActive ? "#4caf50" : "#f44336";
    const statusText = showPending ? "Wird aktiviert" : isActive ? "Aktiv" : "Inaktiv";
    const statusIcon = showPending ? "mdi:shield-sync-outline" : isActive ? "mdi:shield-lock" : "mdi:shield-off";

    const actionText = isActive || showPending ? "Deaktivieren" : "Aktivieren";
    const actionIcon = isActive || showPending ? "mdi:shield-off-outline" : "mdi:shield-check";

    const windowsLabel = (cfg.windows_label || "Windows").trim() || "Windows";
    const windowsState = this._formatWindowsState(windows?.state ?? "unknown");

    this.shadowRoot.innerHTML = `
      <ha-card class="wy-card">
        <div class="wy-wrap">
          <div class="wy-title">${this._escapeHtml(cfg.title)}</div>

          <div class="wy-grid">

            <!-- 1) STATUS -->
            <div class="wy-item wy-status" style="--status-color:${statusColor}" role="button" tabindex="0">
              <ha-icon icon="${statusIcon}"></ha-icon>
              <div class="wy-label">Alarm</div>
              <div class="wy-state">${statusText}</div>
            </div>

            <!-- 2) ACTION -->
            <div class="wy-item wy-action" role="button" tabindex="0">
              <ha-icon icon="${actionIcon}"></ha-icon>
              <div class="wy-label">${actionText}</div>
              <div class="wy-state wy-muted">${this._escapeHtml(this._formatAlarmState(alarmState))}</div>
            </div>

            <!-- 3) WINDOWS -->
            <div class="wy-item wy-windows ${cfg.windows_entity ? "" : "wy-disabled"}" role="button" tabindex="0">
              <ha-icon icon="mdi:window-closed-variant"></ha-icon>
              <div class="wy-label">${this._escapeHtml(windowsLabel)}</div>
              <div class="wy-state">${this._escapeHtml(windowsState)}</div>
            </div>

          </div>
        </div>

        <style>
          .wy-card{
            background: var(--ha-card-background, var(--card-background-color));
            border-radius: var(--ha-card-border-radius, 12px);
            padding:18px 20px;
            color: var(--primary-text-color);
            font-family: var(--primary-font-family);
            box-shadow: var(--ha-card-box-shadow, var(--card-box-shadow));
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
            line-height:1.2;
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
            user-select:none;
            min-width:0;
            -webkit-tap-highlight-color: transparent;
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
            line-height:1.1;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            max-width:100%;
          }
          .wy-state{
            font-size:16px;
            font-weight:500;
            line-height:1.1;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            max-width:100%;
          }
          .wy-muted{
            font-size:12px;
            font-weight:300;
            opacity:0.6;
          }
          .wy-status ha-icon,
          .wy-status .wy-state{
            color: var(--status-color);
          }
          .wy-item:hover{ opacity:0.88; }
          .wy-item:active{ transform: scale(0.98); }
          .wy-disabled{
            opacity:0.55;
            cursor:default;
          }
        </style>
      </ha-card>
    `;

    const statusEl = this.shadowRoot.querySelector(".wy-status");
    const actionEl = this.shadowRoot.querySelector(".wy-action");
    const windowsEl = this.shadowRoot.querySelector(".wy-windows");

    statusEl?.addEventListener("click", () => this._openMoreInfo(cfg.alarm_entity));

    actionEl?.addEventListener("click", () => {
      // While pending we allow immediate disarm
      if (isActive || showPending) {
        hass.callService("alarm_control_panel", "alarm_disarm", { entity_id: cfg.alarm_entity });
      } else {
        // Activate -> open popup
        this._openMoreInfo(cfg.alarm_entity);
      }
    });

    windowsEl?.addEventListener("click", () => {
      if (!cfg.windows_entity) return;
      this._openMoreInfo(cfg.windows_entity);
    });

    // Keyboard accessibility
    const keyHandler = (el, fn) => {
      if (!el) return;
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fn();
        }
      });
    };

    keyHandler(statusEl, () => this._openMoreInfo(cfg.alarm_entity));
    keyHandler(actionEl, () => {
      if (isActive || showPending) {
        hass.callService("alarm_control_panel", "alarm_disarm", { entity_id: cfg.alarm_entity });
      } else {
        this._openMoreInfo(cfg.alarm_entity);
      }
    });
    keyHandler(windowsEl, () => {
      if (!cfg.windows_entity) return;
      this._openMoreInfo(cfg.windows_entity);
    });
  }

  _formatAlarmState(state) {
    if (!state) return "unknown";
    switch (state) {
      case "disarmed": return "deaktiviert";
      case "arming": return "wird aktiviert";
      case "armed_home": return "zuhause";
      case "armed_away": return "abwesend";
      case "armed_night": return "nacht";
      case "armed_vacation": return "urlaub";
      default: return state;
    }
  }

  _formatWindowsState(state) {
    if (!state) return "unknown";
    if (state === "on") return "open";
    if (state === "off") return "closed";
    return state;
  }

  _escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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
  description: "Security overview with editor + activate popup + pending status + direct disarm",
});

/* -----------------------------
 * Lovelace Visual Editor
 * ----------------------------- */
class WineyardsSecurityOverviewEditor extends HTMLElement {
  setConfig(config) {
    this._config = {
      title: "Security",
      alarm_entity: "",
      windows_entity: "",
      windows_label: "Windows",
      pending_timeout_s: 30,
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
  const windows = cfg.windows_entity ? hass.states[cfg.windows_entity] : undefined;

  const alarmState = alarm?.state ?? "unknown";

  const now = Date.now();
  const timedOut = this._pendingArm && now > (this._pendingUntil || 0);
  const isArmedState = typeof alarmState === "string" && alarmState.startsWith("armed_");

  if (timedOut || isArmedState) {
    this._pendingArm = false;
    this._pendingUntil = 0;
  }

  const isInactive =
    alarmState === "disarmed" ||
    alarmState === "unknown" ||
    alarmState === "unavailable";

  const showPending = this._pendingArm && !isArmedState;
  const isActive = !isInactive && !showPending;

  const statusColor = showPending ? "#ff9800" : isActive ? "#4caf50" : "#f44336";
  const statusText = showPending ? "Wird aktiviert" : isActive ? "Aktiv" : "Inaktiv";
  const statusIcon = showPending ? "mdi:shield-sync-outline" : isActive ? "mdi:shield-lock" : "mdi:shield-off";

  const actionText = isActive || showPending ? "Deaktivieren" : "Aktivieren";
  const actionIcon = isActive || showPending ? "mdi:shield-off-outline" : "mdi:shield-check";

  const windowsLabel = (cfg.windows_label || "Windows").trim() || "Windows";
  const windowsState = this._formatWindowsState(windows?.state ?? "unknown");

  this.shadowRoot.innerHTML = `
    <ha-card class="wy-card">
      <div class="wy-wrap">
        <div class="wy-title">${this._escapeHtml(cfg.title)}</div>

        <div class="wy-grid">

          <!-- STATUS (NO BUTTON) -->
          <div class="wy-item wy-status" style="--status-color:${statusColor}">
            <ha-icon icon="${statusIcon}"></ha-icon>
            <div class="wy-label">Alarm</div>
            <div class="wy-state">${statusText}</div>
          </div>

          <!-- ACTION -->
          <div class="wy-item wy-action" role="button" tabindex="0">
            <ha-icon icon="${actionIcon}"></ha-icon>
            <div class="wy-label">${actionText}</div>
            <div class="wy-state wy-muted">${this._escapeHtml(this._formatAlarmState(alarmState))}</div>
          </div>

          <!-- WINDOWS -->
          <div class="wy-item wy-windows ${cfg.windows_entity ? "" : "wy-disabled"}" role="button" tabindex="0">
            <ha-icon icon="mdi:window-closed-variant"></ha-icon>
            <div class="wy-label">${this._escapeHtml(windowsLabel)}</div>
            <div class="wy-state">${this._escapeHtml(windowsState)}</div>
          </div>

        </div>
      </div>

      <style>
        .wy-card{
          background: var(--ha-card-background, var(--card-background-color));
          border-radius: var(--ha-card-border-radius, 12px);
          padding:18px 20px;
          color: var(--primary-text-color);
          font-family: var(--primary-font-family);
          box-shadow: var(--ha-card-box-shadow, var(--card-box-shadow));
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
          line-height:1.2;
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
          user-select:none;
          min-width:0;
        }

        /* STATUS IS NOT CLICKABLE */
        .wy-status{
          cursor:default;
        }

        /* ACTION + WINDOWS ARE BUTTONS */
        .wy-action,
        .wy-windows{
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

        .wy-muted{
          font-size:12px;
          font-weight:300;
          opacity:0.6;
        }

        .wy-status ha-icon,
        .wy-status .wy-state{
          color: var(--status-color);
        }

        .wy-action:hover,
        .wy-windows:hover{
          opacity:0.88;
        }

        .wy-disabled{
          opacity:0.55;
          cursor:default;
        }
      </style>
    </ha-card>
  `;

  const actionEl = this.shadowRoot.querySelector(".wy-action");
  const windowsEl = this.shadowRoot.querySelector(".wy-windows");

  actionEl?.addEventListener("click", () => {
    if (isActive || showPending) {
      hass.callService("alarm_control_panel", "alarm_disarm", { entity_id: cfg.alarm_entity });
    } else {
      this._openMoreInfo(cfg.alarm_entity);
    }
  });

  windowsEl?.addEventListener("click", () => {
    if (!cfg.windows_entity) return;
    this._openMoreInfo(cfg.windows_entity);
  });
}


  _emit() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("wineyards-security-overview-editor", WineyardsSecurityOverviewEditor);
