const TYPE = "wineyard-tile-button";

class WineyardTileButtonEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    this._config = config || {};
    this._config.type = TYPE;
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <div style="padding:8px;">
        <p>Basic Editor (extend as needed)</p>
      </div>
    `;
  }
}

if (!customElements.get("wineyard-tile-button-editor")) {
  customElements.define("wineyard-tile-button-editor", WineyardTileButtonEditor);
}

export {};