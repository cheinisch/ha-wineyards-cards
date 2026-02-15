const TYPE = "wineyards-security-overview";

class WineyardsSecurityOverviewEditor extends HTMLElement {
  private _hass: any;
  private _config: any;
  private _built = false;

  constructor() {
    super();
  }

  setConfig(config: any) {
    this._config = {
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

      ...config,
    };
    this._buildOrSync();
  }

  set hass(hass: any) {
    this._hass = hass;
    this._buildOrSync();
  }

  private _buildOrSync() {
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
      const alarmPicker: any = this.querySelector('ha-entity-picker[label="Alarm entity"]');
      const groupPicker: any = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]');
      const windowsPicker: any = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');

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

  private _syncValues(hasIconPicker: boolean) {
    const cfg = this._config;

    const title: any = this.querySelector('ha-textfield[label="Title"]');
    const timeout: any = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]');

    const alarmPicker: any = this.querySelector('ha-entity-picker[label="Alarm entity"]');
    const groupPicker: any = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]');
    const windowsPicker: any = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');

    const groupTitle: any = this.querySelector('ha-textfield[label="Doors/Windows title"]');
    const windowsLabel: any = this.querySelector('ha-textfield[label="Windows label"]');

    const doorsIconEl: any = hasIconPicker
      ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]')
      : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]');

    const windowsIconEl: any = hasIconPicker
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

  private _attachListeners(hasIconPicker: boolean) {
    const title: any = this.querySelector('ha-textfield[label="Title"]');
    const timeout: any = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]');

    const alarmPicker: any = this.querySelector('ha-entity-picker[label="Alarm entity"]');
    const groupPicker: any = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]');
    const windowsPicker: any = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');

    const groupTitle: any = this.querySelector('ha-textfield[label="Doors/Windows title"]');
    const windowsLabel: any = this.querySelector('ha-textfield[label="Windows label"]');

    const doorsIconEl: any = hasIconPicker
      ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]')
      : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]');

    const windowsIconEl: any = hasIconPicker
      ? this.querySelector('ha-icon-picker[label="Windows icon"]')
      : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]');

    title?.addEventListener("change", (e: any) => this._update({ title: e.target.value }));

    timeout?.addEventListener("change", (e: any) => {
      const v = Number(e.target.value);
      this._update({ pending_timeout_s: Number.isFinite(v) ? v : 30 });
    });

    alarmPicker?.addEventListener("value-changed", (e: any) =>
      this._update({ alarm_entity: e.detail?.value || "" })
    );
    groupPicker?.addEventListener("value-changed", (e: any) =>
      this._update({ doors_windows_entity: e.detail?.value || "" })
    );
    windowsPicker?.addEventListener("value-changed", (e: any) =>
      this._update({ windows_entity: e.detail?.value || "" })
    );

    groupTitle?.addEventListener("change", (e: any) => this._update({ doors_windows_title: e.target.value }));
    windowsLabel?.addEventListener("change", (e: any) => this._update({ windows_label: e.target.value }));

    doorsIconEl?.addEventListener("value-changed", (e: any) =>
      this._update({ doors_windows_icon: e.detail?.value ?? e.target.value })
    );
    doorsIconEl?.addEventListener("change", (e: any) =>
      this._update({ doors_windows_icon: e.target.value })
    );

    windowsIconEl?.addEventListener("value-changed", (e: any) =>
      this._update({ windows_icon: e.detail?.value ?? e.target.value })
    );
    windowsIconEl?.addEventListener("change", (e: any) =>
      this._update({ windows_icon: e.target.value })
    );
  }

  private _update(patch: any) {
    this._config = { ...this._config, ...patch, type: TYPE };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

if (!customElements.get("wineyards-security-overview-editor")) {
  customElements.define("wineyards-security-overview-editor", WineyardsSecurityOverviewEditor);
}

export {};
