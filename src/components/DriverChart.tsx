"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/i18n";
import { annualPoints, multiple, type DriversFile } from "@/lib/drivers";

const RED = "#d80621";
const INK = "#0a0f1e";

interface Line { key: string; pts: { year: number; v: number }[]; color: string; width: number; dash?: string }

function Chart({
  lines,
  tickEvery,
  height = 380,
  endValueFmt,
}: {
  lines: Line[];
  tickEvery: number;
  height?: number;
  endValueFmt: (v: number) => string;
}) {
  const W = 920, H = height, P = { l: 64, r: 88, t: 16, b: 36 };
  const years = lines[0].pts.map((p) => p.year);
  const all = lines.flatMap((l) => l.pts.map((p) => p.v));
  const min = Math.min(...all) * 0.96;
  const max = Math.max(...all) * 1.04;
  const n = years.length;
  const x = (i: number) => P.l + (i / (n - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);
  const path = (pts: { year: number; v: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  // end labels with simple collision avoidance
  const ends = lines
    .map((l) => ({ l, v: l.pts[l.pts.length - 1].v, y: y(l.pts[l.pts.length - 1].v) }))
    .sort((a, b) => b.y - a.y);
  const placed: { l: Line; v: number; y: number }[] = [];
  for (const e of ends) {
    let yy = e.y;
    for (const p of placed) {
      if (Math.abs(yy - p.y) < 18) yy = p.y + 18;
    }
    placed.push({ ...e, y: yy });
  }
  const ticks = years.filter((yr) => (yr - years[0]) % tickEvery === 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={P.l} x2={W - P.r} y1={P.t + f * (H - P.t - P.b)} y2={P.t + f * (H - P.t - P.b)} stroke={INK} strokeOpacity={0.08} />
      ))}
      {ticks.map((yr) => {
        const i = years.indexOf(yr);
        return (
          <text key={yr} x={x(i)} y={H - 12} textAnchor="middle" fontSize={12} fill={INK} opacity={0.55}>
            {yr}
          </text>
        );
      })}
      {lines.map((l) => (
        <g key={l.key}>
          <path d={path(l.pts)} fill="none" stroke={l.color} strokeWidth={l.width} strokeDasharray={l.dash} />
          <circle cx={x(n - 1)} cy={y(l.pts[l.pts.length - 1].v)} r={4} fill={l.color} />
        </g>
      ))}
      {placed.map(({ l, v, y: yy }) => (
        <text key={l.key} x={W - P.r + 8} y={yy + 4} fontSize={12.5} fontWeight={600} fill={l.color}>
          {endValueFmt(v)}
        </text>
      ))}
    </svg>
  );
}

const MAIN_ORDER = [
  { key: "nhpi_house_only_toronto", values: "values_1981_base" as const, color: RED, width: 3 },
  { key: "cuwr_toronto_composite_incl_supplements", values: "values_1981_base" as const, color: INK, width: 2.5 },
  { key: "ippi_fabricated_metal", values: "values_1981_base" as const, color: "#1a73e8", width: 2 },
  { key: "ippi_readymix_concrete", values: "values_1981_base" as const, color: "#e8710a", width: 2 },
  { key: "ippi_softwood_lumber", values: "values_1981_base" as const, color: "#188038", width: 2 },
  { key: "ippi_total", values: "values_1981_base" as const, color: "#6b7280", width: 2 },
];

export default function DriverChart() {
  const { t, lang } = useLang();
  const [data, setData] = useState<DriversFile | null>(null);

  useEffect(() => {
    fetch("/data/drivers.json").then((r) => r.json()).then(setData);
  }, []);

  const main = useMemo<Line[] | null>(() => {
    if (!data) return null;
    return MAIN_ORDER.map((c) => ({
      key: c.key,
      pts: annualPoints(data.series[c.key], c.values),
      color: c.color,
      width: c.width,
    }));
  }, [data]);

  const short = useMemo(() => {
    if (!data) return null;
    const s = data.series;
    const bcpiSd = annualPoints(s.bcpi_single_detached_toronto, "values_2017_base");
    const bcpiTh = annualPoints(s.bcpi_townhouse_toronto, "values_2017_base");
    // NHPI rebased to 2017=100 for comparison inside the BCPI window
    const nhpi81 = annualPoints(s.nhpi_house_only_toronto, "values_1981_base");
    const base2017 = nhpi81.find((p) => p.year === 2017)!.v;
    const nhpi17 = nhpi81.filter((p) => p.year >= 2017).map((p) => ({ year: p.year, v: (p.v / base2017) * 100 }));
    const iron = annualPoints(s.ippi_iron_steel, "values_2010_base");
    const ippi81 = annualPoints(s.ippi_total, "values_1981_base");
    const base2010 = ippi81.find((p) => p.year === 2010)!.v;
    const ippi10 = ippi81.filter((p) => p.year >= 2010).map((p) => ({ year: p.year, v: (p.v / base2010) * 100 }));
    return { bcpiSd, bcpiTh, nhpi17, iron, ippi10 };
  }, [data]);

  const fmtX = (m: number) => (lang === "fr" ? `${m.toFixed(2).replace(".", ",")}x` : `${m.toFixed(2)}x`);

  return (
    <section id="chart" className="bg-paper">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.chart.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.chart.title}</h2>
        <p className="mt-5 max-w-[720px] text-[18px] leading-relaxed text-ink/70">{t.chart.body}</p>

        <div className="mt-12 rounded-[24px] border border-line bg-paper-warm p-6 md:p-8">
          <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink/70">
            {t.chart.legend.map((l, i) => {
              const colors = [RED, INK, "#1a73e8", "#e8710a", "#188038", "#6b7280"];
              return (
                <span key={l.key} className="flex items-center gap-2">
                  <span className="inline-block h-1 w-6 rounded-full" style={{ background: colors[i] }} />
                  {l.label}
                </span>
              );
            })}
          </div>
          {main ? (
            <Chart
              lines={main}
              tickEvery={5}
              endValueFmt={(v) => fmtX(v / 100)}
            />
          ) : (
            <p className="text-ink/50">…</p>
          )}
          <p className="mt-4 max-w-[760px] text-[13px] leading-relaxed text-ink/55">{t.chart.chartNote}</p>
        </div>

        <div className="mt-8">
          <h3 className="display text-[28px]">{t.chart.shortTitle}</h3>
          <p className="mt-2 max-w-[720px] text-[15px] leading-relaxed text-ink/65">{t.chart.shortBody}</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[24px] border border-line bg-paper-warm p-6 md:p-8">
              <h4 className="display text-[22px]">{t.chart.bcpiTitle}</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{t.chart.bcpiNote}</p>
              <div className="mt-4">
                {short ? (
                  <Chart
                    height={300}
                    tickEvery={3}
                    lines={[
                      { key: "bcpiSd", pts: short.bcpiSd, color: "#1a73e8", width: 2.5 },
                      { key: "bcpiTh", pts: short.bcpiTh, color: "#e8710a", width: 2.5 },
                      { key: "nhpi17", pts: short.nhpi17, color: RED, width: 2, dash: "6 4" },
                    ]}
                    endValueFmt={(v) => fmtX(v / 100)}
                  />
                ) : (
                  <p className="text-ink/50">…</p>
                )}
              </div>
            </div>
            <div className="rounded-[24px] border border-line bg-paper-warm p-6 md:p-8">
              <h4 className="display text-[22px]">{t.chart.steelTitle}</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{t.chart.steelNote}</p>
              <div className="mt-4">
                {short ? (
                  <Chart
                    height={300}
                    tickEvery={4}
                    lines={[
                      { key: "iron", pts: short.iron, color: "#6b7280", width: 2.5 },
                      { key: "ippi10", pts: short.ippi10, color: INK, width: 2, dash: "6 4" },
                    ]}
                    endValueFmt={(v) => fmtX(v / 100)}
                  />
                ) : (
                  <p className="text-ink/50">…</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function chartMultiples(data: DriversFile | null) {
  if (!data) return null;
  const m = (k: string) => multiple(annualPoints(data.series[k], "values_1981_base"));
  return { nhpi: m("nhpi_house_only_toronto"), cuwr: m("cuwr_toronto_composite_incl_supplements") };
}
