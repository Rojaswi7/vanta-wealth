# Vanta: private wealth, concept product

A concept wealth app for high-net-worth families: a marketing landing page and an interactive dashboard demo.

- **Portfolio**: consolidated net worth with a 1M–5Y range chart, allocation vs. policy with drift bands, income by month, sortable holdings
- **Goals**: probability of full funding per goal, with live sliders for contribution, risk and target
- **Insights**: ranked signals (concentration, drift, tax-loss harvesting, idle cash, capital calls) with dollar impact and a rebalance preview
- **Command palette** (⌘K / Ctrl K), privacy mode (`H`), dark/light theme (`T`), `G` then `P`/`G`/`I` to switch views
- **Accessible charts**: keyboard-readable crosshairs (← →), screen-reader summaries, and a table view for every chart

All households, holdings and figures are illustrative.

## Run and build

No dependencies are needed to run it. Open `index.html` through the built file:

```
node build.mjs          # writes dist/index.html (what Vercel serves)
node build.mjs --pdf    # also prints Vanta.pdf (needs Chrome or Edge, and `npm install`)
```

Deployed on Vercel with the settings in `vercel.json`.
