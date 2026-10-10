"use client";

import { useLang } from "@/i18n";

export default function Sources() {
  const { t } = useLang();
  return (
    <section id="sources" className="bg-paper-warm">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.sources.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.sources.title}</h2>
        <p className="mt-5 max-w-[720px] text-[18px] leading-relaxed text-ink/70">{t.sources.body}</p>

        <div className="mt-12 space-y-4">
          {t.sources.tables.map((tb) => (
            <div key={tb.id} className="rounded-[20px] border border-line bg-paper p-6">
              <code className="font-mono text-[15px] font-semibold text-canada">{tb.id}</code>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink/65">{tb.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[24px] border border-line bg-paper p-6 md:p-8">
          <h3 className="display text-[26px]">{t.sources.gapsTitle}</h3>
          <ul className="mt-5 space-y-4">
            {t.sources.gaps.map((g) => (
              <li key={g.slice(0, 40)} className="flex gap-3 text-[15px] leading-relaxed text-ink/70">
                <span className="mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full bg-canada" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-5 text-[14px] leading-relaxed text-ink/60">{t.sources.keenable}</p>
        </div>
      </div>
    </section>
  );
}
