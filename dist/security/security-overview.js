/**
 * Wineyards Security Overview (with Visual Editor)
 * OLD layout (3 columns) + NEW settings + stable editor (Firefox)
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

  setConfig(config) {
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

  set hass(hass) {
    this._hass = hass;

    if (!this._unsubCallService && hass?.connection?.subscribeEvents) {
      hass.connection
        .subscribeEvents((ev) => this._onHaEvent(ev), "call_service")
        .then((unsub) => (this._unsubCallService = unsub))
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

  _onHaEvent(ev) {
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

  _openMoreInfo(entityId) {
    if (!entityId) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _getEntity(id) {
    if (!id || !this._hass) return undefined;
    return this._hass.states[id];
  }

  _isOpenState(ent) {
    const s = ent?.state;
    return s === "on" || s === "open" || s === "opening";
  }

  _getGroupMembers(groupId) {
    const ent = this._getEntity(groupId);
    const ids = ent?.attributes?.entity_id;
    return Array.isArray(ids) ? ids : [];
  }

  _formatName(entityId) {
    const ent = this._getEntity(entityId);
    return ent?.attributes?.friendly_name || entityId;
  }

  _formatAlarmState(state) {
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

  _formatQuickState(state) {
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

  _render() {
    if (!this.shadowRoot || !this._config || !this._hass) return;

    const cfg = this._config;
    const alarm = this._getEntity(cfg.alarm_entity);
    const alarmState = alarm?.state ?? "unknown";

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

    const actionEl = this.shadowRoot.querySelector(".wy-action");
    const col3El = this.shadowRoot.querySelector(".wy-col3");

    actionEl?.addEventListener("click", () => {
      if (isActive || showPending) {
        hass.callService("alarm_control_panel", "alarm_disarm", { entity_id: cfg.alarm_entity });
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

customElements.define("wineyards-security-overview", WineyardsSecurityOverview);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "wineyards-security-overview",
  name: "Wineyards Security Overview",
  description: "3-column security overview with doors/windows group + icon selection + stable editor",
});

/* -----------------------------
 * Visual Editor (FIXED: real entity pickers shown)
 * ----------------------------- */
class WineyardsSecurityOverviewEditor extends HTMLElement {
  constructor() {
    super();
    this._built = false;
  }

  setConfig(config) {
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
    this._buildOrSync();
  }

  set hass(hass) {
    this._hass = hass;
    this._buildOrSync();
  }

  _buildOrSync() {
    if (!this._hass || !this._config) return;

    const hasIconPicker = !!customElements.get("ha-icon-picker");

    if (!this._built) {
      this.innerHTML = `
        <div class="wy-editor">
          <ha-textfield class="wy-input" label="Title"></ha-textfield>

          <ha-entity-picker class="wy-input" label="Alarm entity"></ha-entity-picker>

          <ha-textfield class="wy-input" label="Pending timeout (seconds)" type="number"></ha-textfield>

          <div class="wy-sep">Doors / Windows (Group preferred)</div>

          <ha-entity-picker class="wy-input" label="Doors/Windows group (group.*)"></ha-entity-picker>

          <ha-textfield class="wy-input" label="Doors/Windows title"></ha-textfield>

          ${
            hasIconPicker
              ? `<ha-icon-picker class="wy-input" label="Doors/Windows icon"></ha-icon-picker>`
              : `<ha-textfield class="wy-input" label="Doors/Windows icon (mdi:...)"></ha-textfield>`
          }

          <div class="wy-sep">Fallback (single entity)</div>

          <ha-entity-picker class="wy-input" label="Windows entity (optional)"></ha-entity-picker>

          <ha-textfield class="wy-input" label="Windows label"></ha-textfield>

          ${
            hasIconPicker
              ? `<ha-icon-picker class="wy-input" label="Windows icon"></ha-icon-picker>`
              : `<ha-textfield class="wy-input" label="Windows icon (mdi:...)"></ha-textfield>`
          }

          <div class="wy-hint">
            Wenn eine <b>Gruppe</b> gesetzt ist, zeigt die Karte offene Türen/Fenster.
            Ohne Gruppe nutzt sie optional die einzelne Windows-Entität als schnelle Anzeige.
          </div>
        </div>

        <style>
          .wy-editor{ display:grid; gap:16px; }
          .wy-input{ width:100%; }
          .wy-sep{ opacity:0.7; font-size:12px; margin-top:4px; }
          .wy-hint{ opacity:0.7; font-size:12px; line-height:1.35; }
        </style>
      `;

      // configure pickers
      const alarmPicker = this.querySelector('ha-entity-picker[label="Alarm entity"]');
      const groupPicker = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]');
      const windowsPicker = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');

      if (alarmPicker) {
        alarmPicker.hass = this._hass;
        alarmPicker.includeDomains = ["alarm_control_panel"];
      }
      if (groupPicker) {
        groupPicker.hass = this._hass;
        groupPicker.includeDomains = ["group"];
      }
      if (windowsPicker) {
        windowsPicker.hass = this._hass;
        windowsPicker.includeDomains = ["binary_sensor", "cover", "lock", "sensor"];
      }

      this._attachListeners(hasIconPicker);
      this._built = true;
    }

    this._syncValues(hasIconPicker);
  }

  _syncValues(hasIconPicker) {
    const cfg = this._config;

    const title = this.querySelector('ha-textfield[label="Title"]');
    const timeout = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]');

    const alarmPicker = this.querySelector('ha-entity-picker[label="Alarm entity"]');
    const groupPicker = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]');
    const windowsPicker = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');

    const groupTitle = this.querySelector('ha-textfield[label="Doors/Windows title"]');
    const windowsLabel = this.querySelector('ha-textfield[label="Windows label"]');

    const doorsIconEl = hasIconPicker
      ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]')
      : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]');

    const windowsIconEl = hasIconPicker
      ? this.querySelector('ha-icon-picker[label="Windows icon"]')
      : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]');

    if (title) title.value = cfg.title ?? "Security";
    if (timeout) timeout.value = String(Number(cfg.pending_timeout_s ?? 30));

    if (alarmPicker) {
      alarmPicker.hass = this._hass;
      alarmPicker.value = cfg.alarm_entity || "";
    }
    if (groupPicker) {
      groupPicker.hass = this._hass;
      groupPicker.value = cfg.doors_windows_entity || "";
    }
    if (windowsPicker) {
      windowsPicker.hass = this._hass;
      windowsPicker.value = cfg.windows_entity || "";
    }

    if (groupTitle) groupTitle.value = cfg.doors_windows_title ?? "Doors / Windows";
    if (windowsLabel) windowsLabel.value = cfg.windows_label ?? "Windows";

    if (doorsIconEl) doorsIconEl.value = cfg.doors_windows_icon ?? "mdi:door";
    if (windowsIconEl) windowsIconEl.value = cfg.windows_icon ?? "mdi:window-closed-variant";
  }

  _attachListeners(hasIconPicker) {
    const title = this.querySelector('ha-textfield[label="Title"]');
    const timeout = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]');

    const alarmPicker = this.querySelector('ha-entity-picker[label="Alarm entity"]');
    const groupPicker = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]');
    const windowsPicker = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');

    const groupTitle = this.querySelector('ha-textfield[label="Doors/Windows title"]');
    const windowsLabel = this.querySelector('ha-textfield[label="Windows label"]');

    const doorsIconEl = hasIconPicker
      ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]')
      : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]');

    const windowsIconEl = hasIconPicker
      ? this.querySelector('ha-icon-picker[label="Windows icon"]')
      : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]');

    title?.addEventListener("change", (e) => this._update({ title: e.target.value }));

    timeout?.addEventListener("change", (e) => {
      const v = Number(e.target.value);
      this._update({ pending_timeout_s: Number.isFinite(v) ? v : 30 });
    });

    alarmPicker?.addEventListener("value-changed", (e) =>
      this._update({ alarm_entity: e.detail?.value || "" })
    );
    groupPicker?.addEventListener("value-changed", (e) =>
      this._update({ doors_windows_entity: e.detail?.value || "" })
    );
    windowsPicker?.addEventListener("value-changed", (e) =>
      this._update({ windows_entity: e.detail?.value || "" })
    );

    groupTitle?.addEventListener("change", (e) => this._update({ doors_windows_title: e.target.value }));
    windowsLabel?.addEventListener("change", (e) => this._update({ windows_label: e.target.value }));

    doorsIconEl?.addEventListener("value-changed", (e) =>
      this._update({ doors_windows_icon: e.detail?.value ?? e.target.value })
    );
    doorsIconEl?.addEventListener("change", (e) =>
      this._update({ doors_windows_icon: e.target.value })
    );

    windowsIconEl?.addEventListener("value-changed", (e) =>
      this._update({ windows_icon: e.detail?.value ?? e.target.value })
    );
    windowsIconEl?.addEventListener("change", (e) =>
      this._update({ windows_icon: e.target.value })
    );
  }

  _update(patch) {
    this._config = { ...this._config, ...patch };
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
