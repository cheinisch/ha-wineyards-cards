class WineyardTileButton extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    this.config = {
      icon: config.icon || "mdi:lightbulb",
      title: config.title || "Title",
      entity: config.entity,
      show_active_count: config.show_active_count || false,
      show_last_changed: config.show_last_changed || false,
      custom_secondary: config.custom_secondary || null,
    };
  }

  set hass(hass) {
    const entity = hass.states[this.config.entity];
    if (!entity) return;

    const isOn = entity.state !== "off";

    let secondaryText = "";

    // 🔥 Active lights count
    if (this.config.show_active_count) {
      const lights = Object.values(hass.states).filter(
        e => e.entity_id.startsWith("light.") && e.state === "on"
      );
      secondaryText = `${lights.length} Lights On`;
    }

    // ⏱ Last changed
    if (this.config.show_last_changed) {
      const lastChanged = new Date(entity.last_changed);
      const diff = Math.floor((Date.now() - lastChanged) / 60000);
      secondaryText += secondaryText
        ? ` • ${diff} min ago`
        : `${diff} min ago`;
    }

    // ✏ Custom secondary overrides everything
    if (this.config.custom_secondary) {
      secondaryText = this.config.custom_secondary;
    }

    this.innerHTML = `
      <ha-card class="wineyard-card">
        <div class="container">
          <div class="icon ${isOn ? "active" : ""}">
            <ha-icon icon="${this.config.icon}"></ha-icon>
          </div>
          <div class="text">
            <div class="title">${this.config.title}</div>
            <div class="secondary">${secondaryText}</div>
          </div>
        </div>
      </ha-card>
    `;

    this.querySelector("ha-card").onclick = () => {
      hass.callService("homeassistant", "toggle", {
        entity_id: this.config.entity,
      });
    };
  }

  static get styles() {
    return `
      .wineyard-card {
        padding: 20px;
        border-radius: 24px;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .icon {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--card-background-color);
      }

      .icon ha-icon {
        --mdc-icon-size: 28px;
        color: var(--primary-text-color);
      }

      .icon.active ha-icon {
        color: var(--accent-color);
      }

      .title {
        font-size: 1.3rem;
        font-weight: 500;
      }

      .secondary {
        opacity: 0.6;
        font-size: 0.95rem;
        margin-top: 4px;
      }
    `;
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("wineyard-tile-button", WineyardTileButton);
