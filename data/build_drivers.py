"""Build drivers.json for canada-housing-cost-drivers.

Rules (from research):
- Never mix index levels with percent-change tables: all inputs here are "-01" level tables.
- Annual panel 1981-2026: January value for monthly series; Q1 for quarterly BCPI
  (labelled as Q1, NOT January).
- Rebase to 1981=100 for presentation where 1981 exists; otherwise rebase to the
  first available reference period and record it in metadata.
- Unadjusted series only. Record extraction date.
"""
import json, csv, datetime
from pathlib import Path

RAW = Path.home() / "workspace/canada-housing-cost-drivers/data/raw"
OUT = Path.home() / "workspace/canada-housing-cost-drivers/data/drivers.json"
EXTRACTED = datetime.date(2026, 10, 10).isoformat()

def load_csv(path, usecols):
    with open(path, encoding="utf-8-sig") as f:
        return list(csv.DictReader(f, fieldnames=None))

def monthly_january(rows, geo, dim_col, dim_val, vector_note=""):
    """Return {year: (value, vector, status, symbol, uom)} for January observations."""
    out = {}
    for r in rows:
        if r["GEO"] != geo or r[dim_col] != dim_val:
            continue
        d = r["REF_DATE"]
        if not d.endswith("-01"):
            continue
        y = int(d[:4])
        v = r["VALUE"].strip()
        if v in ("", ".."):
            out[y] = (None, r["VECTOR"], r["STATUS"], r["SYMBOL"], r["UOM"])
        else:
            out[y] = (float(v), r["VECTOR"], r["STATUS"], r["SYMBOL"], r["UOM"])
    return out

def quarterly_q1(rows, geo, bldg, division):
    out = {}
    for r in rows:
        if r["GEO"] != geo or r["Type of building"] != bldg or r["Division"] != division:
            continue
        d = r["REF_DATE"]
        m = int(d[5:7])
        if m not in (1, 2, 3):
            continue
        y = int(d[:4])
        v = r["VALUE"].strip()
        if v in ("", ".."):
            out[y] = (None, r["VECTOR"], r["STATUS"], r["SYMBOL"], r["UOM"])
        else:
            out[y] = (float(v), r["VECTOR"], r["STATUS"], r["SYMBOL"], r["UOM"])
    return out

def rebase(obs, base_year):
    """obs: {year: (value, ...)}. Returns {year: rebased} with base_year=100.
    Panel is trimmed to 1981-2026 even when the source table starts earlier."""
    obs = {y: v for y, v in obs.items() if 1981 <= y <= 2026}
    base = obs.get(base_year, (None,))[0]
    assert base, f"no base value for {base_year}"
    return {str(y): round(v / base * 100, 2) if v is not None else None
            for y, (v, *_rest) in obs.items()}

def series_meta(obs, table_id, title, geography, native_freq, native_base,
                vector, rebase_year, period_label, notes):
    obs = {y: v for y, v in obs.items() if 1981 <= y <= 2026}
    years = sorted(obs)
    vals = [obs[y][0] for y in years]
    return {
        "statcan_table": table_id,
        "title": title,
        "vector": vector,
        "geography": geography,
        "native_frequency": native_freq,
        "native_base": native_base,
        "panel_period": period_label,
        "rebase_year": rebase_year,
        "coverage": f"{years[0]}-{years[-1]}",
        "n_observations": len(years),
        "missing_years": [y for y in years if obs[y][0] is None],
        "e_flag_years": [y for y in years if obs[y][2] == "E"],
        "extraction_date": EXTRACTED,
        "notes": notes,
    }

series = {}

# ---- 1. NHPI house-only, Toronto CMA (target series, from existing decomposition) ----
nhpi = json.load(open(Path.home() / "workspace/canada-land-housing/data/nhpi_decomposition.json"))
house = {int(o["d"][:4]): o["v"] for o in nhpi["series"]["Toronto, Ontario"]["House only"] if o["d"].endswith("-01")}
obs = {y: (v, "reuse:nhpi_decomposition.json", "", "", "Index") for y, v in house.items()}
series["nhpi_house_only_toronto"] = {
    "meta": series_meta(obs, "18-10-0205-01",
        "New Housing Price Index, house only", "Toronto, Ontario (CMA)",
        "Monthly", "December 2016=100", "reuse:nhpi_decomposition.json",
        1981, "January", "Target series. Reused from canada-land-housing decomposition; not re-downloaded."),
    "values_1981_base": rebase(obs, 1981),
}

# ---- 2. BCPI Toronto, single-detached & townhouse, Division composite (2017+ only) ----
bcpi_rows = load_csv(RAW / "18100289.csv", None)
for key, bldg in [("bcpi_single_detached_toronto", "Single-detached house [621112]"),
                  ("bcpi_townhouse_toronto", "Townhouse [621112]")]:
    obs = quarterly_q1(bcpi_rows, "Toronto, Ontario", bldg, "Division composite")
    vec = obs[sorted(obs)[0]][1]
    uom = obs[sorted(obs)[0]][4]
    series[key] = {
        "meta": series_meta(obs, "18-10-0289-01",
            f"Building construction price indexes, {bldg.split(' [')[0].lower()}, Division composite",
            "Toronto, Ontario (CMA)", "Quarterly", uom, vec,
            2017, "Q1 (labelled Q1, not January)",
            "Modern residential BCPI building-type detail starts 2017; no homogeneous "
            "1981-2026 residential BCPI exists in this table. Rebasing to 2017=100 because "
            "no 1981 observation exists."),
        "values_2017_base": rebase(obs, 2017),
    }

# ---- 3. IPPI by product, national ----
ippi_rows = load_csv(RAW / "18100266.csv", None)
DIM = "North American Product Classification System (NAPCS)"
ippi_specs = [
    ("ippi_softwood_lumber", "Softwood lumber (except tongue and groove and other edge worked lumber) [24112]",
     "Softwood lumber", 1981),
    ("ippi_fabricated_metal", "Fabricated metal products and construction materials [P63]",
     "Fabricated metal products and construction materials (P-level aggregate)", 1981),
    ("ippi_readymix_concrete", "Ready-mixed concrete [46512]", "Ready-mixed concrete", 1981),
    ("ippi_total", "Total, Industrial product price index (IPPI)", "Total IPPI", 1981),
    ("ippi_iron_steel", "Basic and semi-finished iron or steel products [312]",
     "Basic and semi-finished iron or steel products", 2010),
]
for key, prod, short, rb in ippi_specs:
    obs = monthly_january(ippi_rows, "Canada", DIM, prod)
    vec = obs[sorted(obs)[0]][1]
    uom = obs[sorted(obs)[0]][4]
    rk = f"values_{rb}_base"
    series[key] = {
        "meta": series_meta(obs, "18-10-0266-01",
            f"Industrial product price index, {short}", "Canada (national; IPPI is national-only)",
            "Monthly", uom, vec, rb, "January",
            ("Single vector across NAPCS redesign; StatCan linked vintage. "
             "Factory-gate producer prices: treat as upstream price shock, not builder acquisition cost. "
             + ("Detailed iron/steel products only start 2010; no 1981-2009 series in this table." if rb == 2010 else ""))),
        rk: rebase(obs, rb),
    }

# ---- 4. CUWR Toronto composite, including selected pay supplements ----
cuwr_rows = load_csv(RAW / "18100140.csv", None)
obs = {}
for r in cuwr_rows:
    if r["GEO"] != "Toronto, Ontario" or r["Construction trades"] != "Composite":
        continue
    if r["Type of wage indexes"] != "Construction union wage rate indexes including selected pay supplements":
        continue
    d = r["REF_DATE"]
    if not d.endswith("-01"):
        continue
    y = int(d[:4])
    v = r["VALUE"].strip()
    obs[y] = (None if v in ("", "..") else float(v), r["VECTOR"], r["STATUS"], r["SYMBOL"], r["UOM"])
vec = obs[sorted(obs)[0]][1]
uom = obs[sorted(obs)[0]][4]
series["cuwr_toronto_composite_incl_supplements"] = {
    "meta": series_meta(obs, "18-10-0140-01",
        "Construction union wage rate index, composite, including selected pay supplements",
        "Toronto, Ontario (CMA)", "Monthly", uom, vec, 1981, "January",
        "Composite = all-trades aggregate for Toronto. 'Including selected pay supplements' "
        "chosen as closer to employer labour cost than basic rates. Union trades in selected "
        "metros only: label as union wage-scale proxy, not all-worker earnings."),
    "values_1981_base": rebase(obs, 1981),
}

doc = {
    "project": "canada-housing-cost-drivers",
    "question": "What drove the 4.5x rise in Toronto construction costs, 1981-2026?",
    "target": "NHPI house-only, Toronto CMA (4.52x); land-only 2.90x",
    "normalization_rules": [
        "Levels only: every input is a StatCan -01 level table; no percent-change tables used.",
        "Rebased to 1981=100 where a 1981 observation exists; otherwise to first available year (recorded per series).",
        "Annual panel: January value for monthly series; Q1 for quarterly BCPI (labelled Q1, never January).",
        "Unadjusted series throughout.",
        "Toronto CMA = GEO 'Toronto, Ontario'; City of Toronto / CMA-part rows excluded (none present in these tables).",
        "No splicing of discontinued predecessors was needed: each built series is a single StatCan-linked vector.",
    ],
    "series": series,
}
OUT.write_text(json.dumps(doc, indent=2))
print("wrote", OUT)
for k, s in series.items():
    m = s["meta"]
    vals = list(s.values())[1]
    yrs = sorted(vals, key=int)
    first, last = vals[yrs[0]], vals[yrs[-1]]
    mult = (last / first) if (first and last) else None
    print(f"{k}: {m['coverage']} n={m['n_observations']} missing={m['missing_years']} eflags={m['e_flag_years']} multiple={round(mult,2) if mult else None}")
