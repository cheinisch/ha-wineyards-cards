import { registerCustomCard } from "../../shared/picker";

const TYPE = "wineyards-security-overview";
const EDITOR = "wineyards-security-overview-editor";

type Config = {
  title?: string;
  alarm_entity: string;
  pending_timeout_s?: number;

  doors_windows_entity?: string;
  doors_windows_title?: string;
  doors_windows_icon?: string;

  windows_entity?: string;
  windows_label?: string;
  windows_icon?: string;
};

class WineyardsSecurityOverview extends HTMLElement {
  private _hass: any;
  private _config!: Config;

  private _unsubCallService: null | (() => void) = null;
  private _pendingArm = false;
  private _pendingUntil = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static getConfigElement() {
    return document.createElement(EDITOR);
  }

  // Picker-stabil: ohne custom:
  static getStubConfig() {
    return {
      type: TYPE,
      title: "Security",
      alarm_entity: "",
      pending_timeout_s: 30,

      doors_windows_entity: "",
      doors_windows_title: "Doors / Windows",
      doors_windows_icon: "mdi:door",

      windows_entity: "",
      windows_label: "Windows",
      windows_icon: "mdi:window-closed-variant",
    };
  }

  setConfig(config: Config) {
    if (!config) throw new Error("Invalid config");
    if (!config.alarm_entity) throw new Error("alarm_entity is required");

    this._config = {
      title: "Security",
      alarm_entity: "",
      pending_timeout_s: 30,

      doors_windows_entity: "",
      doors_windows_title: "Doors / Windows",
      doors_windows_icon: "mdi:door",

      windows_entity: "",
      windows_label: "Windows",
      windows_icon: "mdi:window-closed-variant",

      ...config,
    };

    this._render();
  }

  set hass(hass: any) {
    this._hass = hass;

    if (!this._unsubCallService && hass?.connection?.subscribeEvents) {
      hass.connection
        .subscribeEvents((ev: any) => this._onHaEvent(ev), "call_service")
        .then((unsub: any) => (this._unsubCallService = unsub))
        .catch(() => (this._unsubCallService = null));
    }

    this._render();
  }

  disconnectedCallback() {
    try {
      this._unsubCallService?.();
    } catch (_) {}
    this._unsubCallService = null;
  }

  private _onHaEvent(ev: any) {
    const cfg = this._config;
    if (!cfg || !this._hass) return;
    if (!ev?.data) return;

    const { domain, service, service_data } = ev.data;
    if (domain !== "alarm_control_panel") return;
    if (service !== "alarm_arm_away") return;

    const ent = cfg.alarm_entity;
    const ids = service_data?.entity_id;
    const matches = ids === ent || (Array.isArray(ids) && ids.includes(ent));
    if (!matches) return;

    const timeoutMs = Math.max(5, Number(cfg.pending_timeout_s || 30)) * 1000;
    this._pendingArm = true;
    this._pendingUntil = Date.now() + timeoutMs;
    this._render();
  }

  private _openMoreInfo(entityId: string) {
    if (!entityId) return;
    const ev: any = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  private _getEntity(id: string) {
    if (!id || !this._hass) return undefined;
    return this._hass.states[id];
  }

  private _isOpenState(ent: any) {
    const s = ent?.state;
    return s === "on" || s === "open" || s === "opening";
  }

  private _getGroupMembers(groupId: string) {
    const ent = this._getEntity(groupId);
    const ids = ent?.attributes?.entity_id;
    return Array.isArray(ids) ? ids : [];
  }

  private _formatName(entityId: string) {
    const ent = this._getEntity(entityId);
    return ent?.attributes?.friendly_name || entityId;
  }

  private _formatAlarmState(state: string) {
    switch (state) {
      case "disarmed":
        return "deaktiviert";
      case "arming":
        return "wird aktiviert";
      case "armed_home":
        return "zuhause";
      case "armed_away":
        return "abwesend";
      case "armed_night":
        return "nacht";
      case "armed_vacation":
        return "urlaub";
      default:
        return state || "unknown";
    }
  }

  private _formatQuickState(state: string) {
    if (!state) return "unknown";
    if (state === "on") return "open";
    if (state === "off") return "closed";
    return state;
  }

  private _escapeHtml(str: any) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  private _render() {
    if (!this.shadowRoot || !this._config || !this._hass) return;

    const cfg = this._config;
    const alarm = this._getEntity(cfg.alarm_entity);
    const alarmState: string = alarm?.state ?? "unknown";

    const now = Date.now();
    const isArmedState = typeof alarmState === "string" && alarmState.startsWith("armed_");
    const isArmingState = alarmState === "arming";
    const timedOut = this._pendingArm && now > (this._pendingUntil || 0);

    if (timedOut || isArmedState) {
      this._pendingArm = false;
      this._pendingUntil = 0;
    }
    if (isArmingState) this._pendingArm = true;

    const showPending = this._pendingArm && !isArmedState;

    const isInactive =
      alarmState === "disarmed" || alarmState === "unknown" || alarmState === "unavailable";

    const isActive = !isInactive && !showPending;

    const statusColor = showPending ? "#ff9800" : isActive ? "#4caf50" : "#f44336";
    const statusText = showPending ? "Wird aktiviert" : isActive ? "Aktiv" : "Inaktiv";
    const statusIcon = showPending
      ? "mdi:shield-sync-outline"
      : isActive
      ? "mdi:shield-lock"
      : "mdi:shield-off";

    const actionText = isActive || showPending ? "Deaktivieren" : "Aktivieren";
    const actionIcon = isActive || showPending ? "mdi:shield-off-outline" : "mdi:shield-check";

    const groupId = (cfg.doors_windows_entity || "").trim();
    const quickId = (cfg.windows_entity || "").trim();
    const usesGroup = !!groupId;

    const col3Title = usesGroup
      ? ((cfg.doors_windows_title || "Doors / Windows").trim() || "Doors / Windows")
      : ((cfg.windows_label || "Windows").trim() || "Windows");

    const col3Icon = usesGroup
      ? (cfg.doors_windows_icon || "mdi:door")
      : (cfg.windows_icon || "mdi:window-closed-variant");

    let col3State = "nicht gesetzt";
    let chipsHtml = "";

    if (usesGroup) {
      const members = this._getGroupMembers(groupId);
      const openMembers = members
        .map((id) => ({ id, ent: this._getEntity(id) }))
        .filter((x) => this._isOpenState(x.ent));

      col3State = openMembers.length === 0 ? "Keine offen" : `${openMembers.length} offen`;

      const openNames = openMembers.slice(0, 4).map((x) => this._escapeHtml(this._formatName(x.id)));
      chipsHtml =
        openNames.length > 0
          ? `<div class="wy-openlist">${openNames.map((n) => `<span class="wy-chip">${n}</span>`).join("")}</div>`
          : `<div class="wy-openlist wy-muted2"></div>`;
    } else if (quickId) {
      const quickEnt = this._getEntity(quickId);
      col3State = this._formatQuickState(quickEnt?.state ?? "unknown");
      chipsHtml = `<div class="wy-openlist wy-muted2"></div>`;
    }

    this.shadowRoot.innerHTML = `
      <ha-card class="wy-card">
        <div class="wy-wrap">
          <div class="wy-title">${this._escapeHtml(cfg.title)}</div>

          <div class="wy-grid">
            <div class="wy-item wy-status" style="--status-color:${statusColor}">
              <ha-icon icon="${statusIcon}"></ha-icon>
              <div class="wy-label">Alarm</div>
              <div class="wy-state">${statusText}</div>
            </div>

            <div class="wy-item wy-action" role="button" tabindex="0">
              <ha-icon icon="${actionIcon}"></ha-icon>
              <div class="wy-label">${this._escapeHtml(actionText)}</div>
              <div class="wy-state wy-muted">${this._escapeHtml(this._formatAlarmState(alarmState))}</div>
            </div>

            <div class="wy-item wy-col3 ${(usesGroup || quickId) ? "" : "wy-disabled"}" role="button" tabindex="0">
              <ha-icon icon="${this._escapeHtml(col3Icon)}"></ha-icon>
              <div class="wy-label">${this._escapeHtml(col3Title)}</div>
              <div class="wy-state">${this._escapeHtml(col3State)}</div>
              ${chipsHtml}
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
          .wy-wrap{ display:flex; flex-direction:column; width:100%; }
          .wy-title{ width:100%; font-size:20px; font-weight:300; margin:0 0 14px 0; line-height:1.2; }
          .wy-grid{ display:grid; grid-template-columns: repeat(3, 1fr); width:100%; text-align:center; }
          .wy-item{ display:flex; flex-direction:column; align-items:center; gap:6px; user-select:none; min-width:0; -webkit-tap-highlight-color: transparent; padding: 2px 4px; }
          .wy-status{ cursor:default; }
          .wy-action, .wy-col3{ cursor:pointer; }
          ha-icon{ width:28px; height:28px; opacity:0.95; }
          .wy-label{ font-size:13px; font-weight:300; opacity:0.7; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
          .wy-state{ font-size:16px; font-weight:500; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
          .wy-muted{ font-size:12px; font-weight:300; opacity:0.6; }
          .wy-muted2{ font-size:11px; font-weight:300; opacity:0.55; }
          .wy-status ha-icon, .wy-status .wy-state{ color: var(--status-color); }
          .wy-openlist{ display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin-top: 2px; max-width:100%; }
          .wy-chip{ font-size: 10px; line-height: 1; padding: 4px 6px; border-radius: 999px; background: rgba(255,255,255,0.08); color: var(--primary-text-color); max-width: 100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .wy-action:hover, .wy-col3:hover{ opacity:0.88; }
          .wy-action:active, .wy-col3:active{ transform: scale(0.98); }
          .wy-disabled{ opacity:0.55; cursor:default; }
        </style>
      </ha-card>
    `;

    const actionEl = this.shadowRoot.querySelector(".wy-action") as HTMLElement | null;
    const col3El = this.shadowRoot.querySelector(".wy-col3") as HTMLElement | null;

    actionEl?.addEventListener("click", () => {
      if (!this._hass) return;
      if (isActive || showPending) {
        this._hass.callService("alarm_control_panel", "alarm_disarm", { entity_id: cfg.alarm_entity });
      } else {
        this._openMoreInfo(cfg.alarm_entity);
      }
    });

    col3El?.addEventListener("click", () => {
      const target = groupId || quickId;
      if (!target) return;
      this._openMoreInfo(target);
    });
  }

  getCardSize() {
    return 2;
  }
}

if (!customElements.get(TYPE)) customElements.define(TYPE, WineyardsSecurityOverview);

registerCustomCard({
  type: TYPE,
  name: "Wineyards Security Overview",
  description: "3-column security overview with doors/windows group + icon selection + stable editor",
  preview: true,
});

export {};
