# Housing Cost Drivers: what drove Toronto's 4.6x construction-cost rise, 1981-2026

An Open Nshipyard civic data project. We split Toronto's New Housing Price Index into house-only and land-only, then matched the house-only series against union wages, materials prices, and building prices from 1981 to 2026.

Headline finding: Toronto union construction wages rose 4.55x from 1981 to 2026, tracking the 4.64x construction-cost rise almost exactly. Materials rose less: fabricated metal 4.01x, concrete 3.66x, lumber 3.11x (all national).

## Run it

```bash
npm install
npm run dev
```

Production build: `npm run build`.

## Data

`public/data/drivers.json` holds nine rebased series with table IDs, vectors, geography, and coverage metadata. `data/BUILD_NOTE.md` documents how the series were built, what could not be built (development charges, code-compliance costs, Toronto-residential productivity, contractor margins), and the caveats.

All index series come from Statistics Canada -01 level tables, extracted 2026-10-10. Driver research came from three Keenable SELECT reports run 2026-10-10.

## Author

**Tuppenney Dackam**

- X: https://x.com/tuppenneydackam
- GitHub: https://github.com/tuppenneydx
