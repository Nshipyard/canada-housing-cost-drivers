"use client";

import { useLang } from "@/i18n";

export default function PolicyLevers() {
  const { t } = useLang();
  return (
    <section id="levers" className="bg-paper">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.levers.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.levers.title}</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.levers.items.map((l) => (
            <div key={l.title} className="rounded-[24px] bg-ink p-7 text-white md:p-8">
              <h3 className="display text-[26px]">{l.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">{l.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
