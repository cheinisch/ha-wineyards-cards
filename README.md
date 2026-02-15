# Wineyards Cards

## Installation (HACS)
1. Add this repository to HACS (Frontend).
2. Install Wineyards Cards.
3. Add the resource:

url: /hacsfiles/ha-wineyards-cards/dist/wineyards.js
type: module

## Example Usage

type: wineyard-tile-button
entity: light.kitchen
icon: mdi:lightbulb
title: Kitchen
subtitle: 2 Lights On
tap_action:
  action: toggle

Manual YAML also works:

type: custom:wineyard-tile-button
entity: light.kitchen
icon: mdi:lightbulb
title: Kitchen
subtitle: 2 Lights On
tap_action:
  action: toggle
