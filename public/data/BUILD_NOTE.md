# Build note: canada-housing-cost-drivers data layer

Question: what drove the ~4.5x rise in Toronto construction costs, 1981-2026?
Target series: NHPI house-only, Toronto CMA (table 18-10-0205-01 levels, reused from
`~/workspace/canada-land-housing/data/nhpi_decomposition.json`, not re-downloaded).

Extraction date: 2026-10-10. Raw zips/CSVs retained in `data/raw/`
(18100289, 18100266, 18100139, 18100140). Nothing was committed, pushed, or deployed.

## Series built (all from StatCan -01 level tables; no percent-change tables used)

| Key | Table | Vector | Geography | Native freq / base | Panel | Coverage | 1981->last multiple |
|---|---|---|---|---|---|---|---|
| nhpi_house_only_toronto | 18-10-0205-01 | reuse:nhpi_decomposition.json | Toronto CMA | Monthly / Dec 2016=100 | January | 1981-2026 (46 obs) | 4.64x |
| cuwr_toronto_composite_incl_supplements | 18-10-0140-01 | v1014033144 | Toronto CMA | Monthly / 2015=100 | January | 1981-2026 (46 obs) | 4.55x |
| ippi_fabricated_metal | 18-10-0266-01 | v1230996189 | Canada (national) | Monthly / Jan 2020=100 | January | 1981-2026 (46 obs) | 4.01x |
| ippi_readymix_concrete | 18-10-0266-01 | v1230996317 | Canada (national) | Monthly / Jan 2020=100 | January | 1981-2026 (46 obs) | 3.66x |
| ippi_total | 18-10-0266-01 | v1230996007 | Canada (national) | Monthly / Jan 2020=100 | January | 1981-2026 (46 obs) | 3.12x |
| ippi_softwood_lumber | 18-10-0266-01 | v1230996125 | Canada (national) | Monthly / Jan 2020=100 | January | 1981-2026 (46 obs) | 3.11x |
| bcpi_single_detached_toronto | 18-10-0289-01 | v1617912708 | Toronto CMA | Quarterly / 2023=100 | Q1 (labelled Q1, not January) | 2017-2026 (10 obs) | 2.33x (2017 base) |
| bcpi_townhouse_toronto | 18-10-0289-01 | v1617912732 | Toronto CMA | Quarterly / 2023=100 | Q1 (labelled Q1, not January) | 2017-2026 (10 obs) | 2.32x (2017 base) |
| ippi_iron_steel | 18-10-0266-01 | v1230996166 | Canada (national) | Monthly / Jan 2020=100 | January | 2010-2026 (17 obs) | 1.54x (2010 base) |

Details:
- CUWR uses "Construction union wage rate indexes including selected pay supplements",
  Composite (all-trades aggregate), Toronto. Chosen over basic rates as closer to
  employer labour cost. Union trades in selected metros only: label as a union
  wage-scale proxy, not all-worker earnings.
- IPPI product choices: softwood lumber [24112]; fabricated metal products and
  construction materials [P63] (P-level aggregate, full 1981 run); ready-mixed
  concrete [46512]; total IPPI as a general input-price proxy. Each is a single
  StatCan-linked vector across the NAPCS redesign, so no manual splicing was needed.
- IPPI is factory-gate producer prices: treat as an upstream price shock, not
  builder acquisition cost.
- BCPI uses Division composite for each building type. Rebased to 2017=100 because
  no 1981 observation exists; its multiple is NOT comparable to the 1981-based ones.

## Could NOT build (gaps)

- Toronto residential construction productivity, 1981-2026: no StatCan series at that
  granularity. The cited facts (output per hour -0.4%/yr 2000-2024; $6-8B lost-productivity
  cost) come from CSLS and CMHC analytical reports, not a downloadable series.
- Development charges / municipal fees, longitudinal: no StatCan table for any period.
  The 700%-rise and $82,600/unit figures are CHBA municipal-benchmarking surveys.
- Building-code compliance cost series: none exists in open data.
- Contractor profit margins: baked into BCPI's selling-price concept, never published
  separately.
- Iron/steel products before 2010: detailed IPPI products (e.g. [312]) start 2010 in
  18-10-0266-01. Archived tables (e.g. 18-10-0097-01 fabricated structural steel,
  annual 1977-1995) were not pulled.
- BCPI Toronto residential before 2017: building-type detail starts 2017 in
  18-10-0289-01; there is no homogeneous 1981-2026 residential BCPI.
- Regional lumber/concrete detail ends 2013 in archived tables; the panel uses
  national IPPI, labelled national.

## Suspicious values / caveats

- NHPI house-only January panel gives 4.64x (Jan 1981 -> Jan 2026). The 4.52x cited in
  the original chart used the August 2026 observation (102.2 / 22.6). Difference is the
  timing rule (January panel), not a data change.
- Softwood lumber January values are volatile: 2021 = 508.2, 2022 = 617.6
  (1981=100), falling back to 311.4 by Jan 2026. January observations catch the
  pandemic spike; an annual-average panel would look smoother.
- No missing values ("..") and no E (use-with-caution) flags in any built series.
  Cement [46511] was considered but carries E flags, so ready-mixed concrete [46512]
  was used instead.
- CUWR basic vs including-supplements indexes sit at different levels in 1981
  (34.6 vs 28.7, native 2015=100); rebasing to 1981=100 neutralizes this, but the two
  variants are not interchangeable in levels.
- Toronto CMA = GEO "Toronto, Ontario" throughout. City of Toronto / CMA-part rows do
  not appear in these tables, so no exclusion filtering was needed beyond the GEO match.
