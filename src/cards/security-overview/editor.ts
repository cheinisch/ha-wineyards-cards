const TYPE = "wineyards-security-overview";

class WineyardsSecurityOverviewEditor extends HTMLElement {
  private _hass: any;
  private _config: any;
  private _built = false;

  // cached element refs (wichtig: nicht jedes Mal querySelector)
  private _el: {
    title?: any;
    timeout?: any;

    alarmPicker?: any;
    groupPicker?: any;
    windowsPicker?: any;

    groupTitle?: any;
    windowsLabel?: any;

    doorsIconEl?: any;
    windowsIconEl?: any;

    hasIconPicker: boolean;
  } = { hasIconPicker: false };

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

    // Wichtig: NICHT jedes Mal blind alles neu setzen.
    // Wir syncen später mit Guard-Checks.
    this._buildOrSync();
  }

  private _buildOrSync() {
    if (!this._hass || !this._config) return;

    const hasIconPicker = !!customElements.get("ha-icon-picker");
    this._el.hasIconPicker = hasIconPicker;

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
            Wenn eine Gruppe gesetzt ist, zeigt die Karte offene Türen/Fenster.
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

      // cache refs
      this._el.title = this.querySelector('ha-textfield[label="Title"]');
      this._el.timeout = this.querySelector('ha-textfield[label="Pending timeout (seconds)"]');

      this._el.alarmPicker = this.querySelector('ha-entity-picker[label="Alarm entity"]');
      this._el.groupPicker = this.querySelector('ha-entity-picker[label="Doors/Windows group (group.*)"]');
      this._el.windowsPicker = this.querySelector('ha-entity-picker[label="Windows entity (optional)"]');

      this._el.groupTitle = this.querySelector('ha-textfield[label="Doors/Windows title"]');
      this._el.windowsLabel = this.querySelector('ha-textfield[label="Windows label"]');

      this._el.doorsIconEl = hasIconPicker
        ? this.querySelector('ha-icon-picker[label="Doors/Windows icon"]')
        : this.querySelector('ha-textfield[label="Doors/Windows icon (mdi:...)"]');

      this._el.windowsIconEl = hasIconPicker
        ? this.querySelector('ha-icon-picker[label="Windows icon"]')
        : this.querySelector('ha-textfield[label="Windows icon (mdi:...)"]');

      // configure pickers once
      if (this._el.alarmPicker) {
        this._el.alarmPicker.hass = this._hass;
        this._el.alarmPicker.includeDomains = ["alarm_control_panel"];
      }
      if (this._el.groupPicker) {
        this._el.groupPicker.hass = this._hass;
        this._el.groupPicker.includeDomains = ["group"];
      }
      if (this._el.windowsPicker) {
        this._el.windowsPicker.hass = this._hass;
        this._el.windowsPicker.includeDomains = ["binary_sensor", "cover", "lock", "sensor"];
      }

      this._attachListeners();
      this._built = true;
    } else {
      // hass kann sich ändern (z.B. reconnect) -> nur hass in pickern aktualisieren
      if (this._el.alarmPicker) this._el.alarmPicker.hass = this._hass;
      if (this._el.groupPicker) this._el.groupPicker.hass = this._hass;
      if (this._el.windowsPicker) this._el.windowsPicker.hass = this._hass;
    }

    this._syncValues();
  }

  private _isFocused(el: any) {
    // HA Komponenten nutzen teils Shadow DOM – wir checken grob:
    const active = (this.getRootNode() as any)?.activeElement || document.activeElement;
    return el === active || (el?.contains && el.contains(active));
  }

  private _setIfChanged(el: any, next: any) {
    if (!el) return;
    if (this._isFocused(el)) return;

    const cur = el.value ?? "";
    const n = next ?? "";

    if (String(cur) !== String(n)) {
      el.value = n;
    }
  }

  private _syncValues() {
    const cfg = this._config;

    this._setIfChanged(this._el.title, cfg.title ?? "Security");
    this._setIfChanged(this._el.timeout, String(Number(cfg.pending_timeout_s ?? 30)));

    this._setIfChanged(this._el.alarmPicker, cfg.alarm_entity || "");
    this._setIfChanged(this._el.groupPicker, cfg.doors_windows_entity || "");
    this._setIfChanged(this._el.windowsPicker, cfg.windows_entity || "");

    this._setIfChanged(this._el.groupTitle, cfg.doors_windows_title ?? "Doors / Windows");
    this._setIfChanged(this._el.windowsLabel, cfg.windows_label ?? "Windows");

    this._setIfChanged(this._el.doorsIconEl, cfg.doors_windows_icon ?? "mdi:door");
    this._setIfChanged(this._el.windowsIconEl, cfg.windows_icon ?? "mdi:window-closed-variant");
  }

  private _attachListeners() {
    // Textfelder: input ist “flüssiger” als change
    this._el.title?.addEventListener("input", (e: any) =>
      this._update({ title: e.target.value })
    );

    this._el.timeout?.addEventListener("input", (e: any) => {
      const v = Number(e.target.value);
      this._update({ pending_timeout_s: Number.isFinite(v) ? v : 30 });
    });

    // Entity Picker feuert value-changed
    this._el.alarmPicker?.addEventListener("value-changed", (e: any) =>
      this._update({ alarm_entity: e.detail?.value || "" })
    );
    this._el.groupPicker?.addEventListener("value-changed", (e: any) =>
      this._update({ doors_windows_entity: e.detail?.value || "" })
    );
    this._el.windowsPicker?.addEventListener("value-changed", (e: any) =>
      this._update({ windows_entity: e.detail?.value || "" })
    );

    this._el.groupTitle?.addEventListener("input", (e: any) =>
      this._update({ doors_windows_title: e.target.value })
    );
    this._el.windowsLabel?.addEventListener("input", (e: any) =>
      this._update({ windows_label: e.target.value })
    );

    // Icon Picker: value-changed; Textfield: input
    this._el.doorsIconEl?.addEventListener("value-changed", (e: any) =>
      this._update({ doors_windows_icon: e.detail?.value ?? e.target.value })
    );
    this._el.doorsIconEl?.addEventListener("input", (e: any) =>
      this._update({ doors_windows_icon: e.target.value })
    );

    this._el.windowsIconEl?.addEventListener("value-changed", (e: any) =>
      this._update({ windows_icon: e.detail?.value ?? e.target.value })
    );
    this._el.windowsIconEl?.addEventListener("input", (e: any) =>
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
