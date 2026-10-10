"use client";

import { useLang } from "@/i18n";

export default function DriverRanking() {
  const { t } = useLang();
  return (
    <section id="drivers" className="bg-paper-warm">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.drivers.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.drivers.title}</h2>
        <p className="mt-5 max-w-[720px] text-[18px] leading-relaxed text-ink/70">{t.drivers.body}</p>
        <div className="mt-12 space-y-5">
          {t.drivers.items.map((d, i) => {
            const isOpen = i === 1 || i === 2;
            return (
              <div key={d.title} className="rounded-[24px] border border-line bg-paper p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-5">
                    <span className="display text-[40px] text-canada">{i + 1}</span>
                    <div className="max-w-[760px]">
                      <h3 className="display text-[26px]">{d.title}</h3>
                      <p className="mt-2 text-[16px] leading-relaxed text-ink/70">{d.body}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ${
                      isOpen ? "bg-emerald-600/10 text-emerald-800" : "bg-canada/10 text-canada-dark"
                    }`}
                  >
                    {isOpen ? t.drivers.openBadge : t.drivers.surveyBadge}
                  </span>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-ink/55">{d.badge}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
