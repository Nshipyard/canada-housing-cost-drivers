export interface SeriesMeta {
  statcan_table: string;
  title: string;
  vector: string;
  geography: string;
  native_frequency: string;
  native_base: string;
  panel_period: string;
  rebase_year: number;
  coverage: string;
  n_observations: number;
  missing_years: string[];
  e_flag_years: string[];
  extraction_date: string;
  notes: string;
}

export interface DriverSeries {
  meta: SeriesMeta;
  values_1981_base?: Record<string, number>;
  values_2017_base?: Record<string, number>;
  values_2010_base?: Record<string, number>;
}

export interface DriversFile {
  project: string;
  question: string;
  target: string;
  normalization_rules: string[];
  series: Record<string, DriverSeries>;
}

/** Annual values sorted by year for a series, using the given values key. */
export function annualPoints(s: DriverSeries, key: "values_1981_base" | "values_2017_base" | "values_2010_base"): { year: number; v: number }[] {
  const vals = s[key];
  if (!vals) return [];
  return Object.entries(vals)
    .map(([y, v]) => ({ year: Number(y), v }))
    .sort((a, b) => a.year - b.year);
}

/** Multiple of the last observation over the first, e.g. 4.64. */
export function multiple(pts: { year: number; v: number }[]): number {
  if (pts.length < 2) return 1;
  return pts[pts.length - 1].v / pts[0].v;
}
