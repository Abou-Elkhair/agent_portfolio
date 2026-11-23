import {motion, useScroll, useSpring} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  Quote,
} from 'lucide-react';
import {
  CASE_STUDIES,
  CaseSlug,
  CaseStudy,
  ScreenSlide,
} from '../data/portfolioData';
import {ResilientImage} from './ResilientImage';

import {Lang, UI_COPY} from '../data/i18n';

interface CaseStudyViewProps {
  study: CaseStudy;
  lang: Lang;
  onBackHome: () => void;
  onSelectCase: (slug: CaseSlug) => void;
  onInspectScreen: (items: ScreenSlide[], index: number) => void;
  onOpenCaseAi: () => void;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function CaseStudyView({
  study,
  lang,
  onBackHome,
  onSelectCase,
  onInspectScreen,
  onOpenCaseAi,
}: CaseStudyViewProps) {
  const t = UI_COPY[lang];
  const {scrollYProgress} = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  const currentIndex = CASE_STUDIES.findIndex((c) => c.slug === study.slug);
  const prevStudy =
    CASE_STUDIES[(currentIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
  const nextStudy = CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length];

  const leftPreview = study.previewScreens.find((s) => s.role === 'left');
  const mainPreview = study.previewScreens.find((s) => s.role === 'main');
  const rightPreview = study.previewScreens.find((s) => s.role === 'right');

  const anchors = [
    {id: 'case-brief', label: t.caseLabels.overview, show: true},
    {id: 'case-legacy', label: t.caseLabels.legacy, show: Boolean(study.legacyEvidence)},
    {id: 'case-research', label: t.caseLabels.research, show: Boolean(study.research)},
    {id: 'case-evidence', label: t.caseLabels.evidence, show: Boolean(study.stats || study.quotes)},
    {id: 'case-strategy', label: t.caseLabels.strategy, show: Boolean(study.strategy || study.highlights)},
    {id: 'case-screens', label: t.caseLabels.screens, show: true},
  ].filter((a) => a.show);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <article
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="relative bg-[#f8f9fb] dark:bg-[#0b0e14]"
    >
      {/* Reading Progress Beam */}
      <motion.div
        aria-hidden="true"
        style={{scaleX}}
        className="fixed top-0 left-0 right-0 z-30 h-[3px] origin-left bg-gradient-to-r from-[#4338ca] via-[#4f46e5] to-[#6366f1]"
      />

      {/* Case Study Hero */}
      <header className="relative overflow-hidden border-b border-[#e5e7eb] dark:border-[#232838] bg-gradient-to-b from-[#ffffff] via-[#f8f9fb] to-[#eef2ff]/40 dark:from-[#0b0e14] dark:via-[#111520] dark:to-[#0b0e14] pt-8 pb-16 sm:pt-12 sm:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full blur-3xl opacity-35"
          style={{
            background:
              'radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 75%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <motion.button
              type="button"
              whileHover={{x: lang === 'ar' ? 2 : -2}}
              whileTap={{scale: 0.97}}
              onClick={onBackHome}
              className="sc-glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-[#111827] dark:text-[#f3f4f6] hover:border-[#4f46e5] transition-colors cursor-pointer"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />
              <span>{t.backToStudio}</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-[0.12em] text-[#4f46e5] dark:text-[#818cf8] tabular-nums">
                {study.number} · {study.domain}
              </span>
              <button
                type="button"
                onClick={onOpenCaseAi}
                className="sc-cta inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer"
              >
                <span>{t.askAiAboutCase} {study.title}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{opacity: 0, y: 18}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.55, ease: EASE_OUT}}
              className="lg:col-span-6 space-y-6"
            >
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                  {study.title} — {study.subtitle}
                </p>
                <h1 className="text-[clamp(2.2rem,4.5vw,3.9rem)] font-extrabold leading-[1.03] tracking-[-0.035em] text-[#0f0e24] dark:text-[#f4f5ff]">
                  {study.headline}{' '}
                  <em className="font-serif italic font-normal text-[#5452c1] dark:text-[#8f92e8]">
                    {study.headlineItalic}
                  </em>
                </h1>
              </div>

              <p className="text-base sm:text-lg leading-relaxed text-[#4c4e75] dark:text-[#9093bd] max-w-xl">
                {study.lead}
              </p>

              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-indigo-950/10 dark:border-[#9093bd]/15">
                {study.meta.map((item) => (
                  <div key={item.label} className="pt-3 space-y-1">
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-[#5452c1] dark:text-[#9093bd]">
                      {item.label}
                    </dt>
                    <dd className="text-xs sm:text-sm font-semibold text-[#0f0e24] dark:text-[#f4f5ff]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Layered Product Stage */}
            <motion.div
              initial={{opacity: 0, y: 20, scale: 0.97}}
              animate={{opacity: 1, y: 0, scale: 1}}
              transition={{duration: 0.65, delay: 0.1, ease: EASE_OUT}}
              className="lg:col-span-6"
            >
              <div className="sc-glass-elevated group relative overflow-hidden rounded-3xl p-6 sm:p-8 flex items-center justify-center min-h-[340px] sm:min-h-[390px]">
                <div
                  aria-hidden="true"
                  className="animate-aura-breathe pointer-events-none absolute h-68 w-68 rounded-full blur-2xl"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(101,104,187,0.52) 0%, rgba(24,16,169,0.28) 55%, transparent 78%)',
                  }}
                />

                {study.previewFormat === 'web' ? (
                  <div className="relative z-10 w-full flex items-center justify-center">
                    {leftPreview && (
                      <div className="hidden sm:block absolute left-0 top-4 w-[54%] rounded-xl overflow-hidden border border-indigo-950/15 dark:border-[#9093bd]/25 bg-white dark:bg-[#07051b] shadow-lg -rotate-2 opacity-80 transition-all duration-500 group-hover:-translate-x-2.5 group-hover:-rotate-6">
                        <ResilientImage
                          src={leftPreview.src}
                          alt={leftPreview.alt}
                          loading="eager"
                          className="w-full h-44 object-cover object-top"
                        />
                      </div>
                    )}
                    {rightPreview && (
                      <div className="hidden sm:block absolute right-0 bottom-2 w-[52%] rounded-xl overflow-hidden border border-indigo-950/15 dark:border-[#9093bd]/25 bg-white dark:bg-[#07051b] shadow-lg rotate-2 opacity-80 transition-all duration-500 group-hover:translate-x-2.5 group-hover:rotate-6">
                        <ResilientImage
                          src={rightPreview.src}
                          alt={rightPreview.alt}
                          loading="eager"
                          className="w-full h-44 object-cover object-top"
                        />
                      </div>
                    )}
                    {mainPreview && (
                      <button
                        type="button"
                        onClick={() => onInspectScreen(study.screens, 0)}
                        aria-label={`Inspect ${study.title} screens`}
                        className="relative z-10 w-[88%] sm:w-[82%] rounded-2xl overflow-hidden border border-[#5452c1]/35 dark:border-[#9093bd]/30 bg-white dark:bg-[#07051b] p-1.5 shadow-[0_24px_60px_rgba(11,4,99,0.35)] cursor-zoom-in transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]"
                      >
                        <ResilientImage
                          src={mainPreview.src}
                          alt={mainPreview.alt}
                          loading="eager"
                          className="w-full h-56 sm:h-64 object-cover object-top rounded-xl"
                        />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-5 pt-4">
                    {leftPreview && (
                      <div className="hidden sm:block w-28 md:w-32 translate-y-3 -rotate-3 rounded-2xl overflow-hidden border border-indigo-950/15 dark:border-[#9093bd]/25 bg-white dark:bg-[#07051b] shadow-lg transition-all duration-500 group-hover:-translate-x-2 group-hover:-rotate-6">
                        <ResilientImage
                          src={leftPreview.src}
                          alt={leftPreview.alt}
                          loading="eager"
                          className="w-full h-52 object-cover object-top"
                        />
                      </div>
                    )}
                    {mainPreview && (
                      <button
                        type="button"
                        onClick={() => onInspectScreen(study.screens, 0)}
                        aria-label={`Inspect ${study.title} screens`}
                        className="relative z-10 w-40 sm:w-44 md:w-48 rounded-2xl overflow-hidden border border-[#5452c1]/35 dark:border-[#9093bd]/35 bg-white dark:bg-[#07051b] p-1.5 shadow-[0_24px_60px_rgba(11,4,99,0.35)] cursor-zoom-in transition-transform duration-500 group-hover:-translate-y-2.5 group-hover:scale-[1.02]"
                      >
                        <ResilientImage
                          src={mainPreview.src}
                          alt={mainPreview.alt}
                          loading="eager"
                          className="w-full h-64 sm:h-72 object-cover object-top rounded-xl"
                        />
                      </button>
                    )}
                    {rightPreview && (
                      <div className="hidden sm:block w-28 md:w-32 translate-y-3 rotate-3 rounded-2xl overflow-hidden border border-indigo-950/15 dark:border-[#9093bd]/25 bg-white dark:bg-[#07051b] shadow-lg transition-all duration-500 group-hover:translate-x-2 group-hover:rotate-6">
                        <ResilientImage
                          src={rightPreview.src}
                          alt={rightPreview.alt}
                          loading="eager"
                          className="w-full h-52 object-cover object-top"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Section Jump Anchors */}
          <nav
            aria-label="Case study sections"
            className="mt-10 flex flex-wrap items-center gap-2 border-t border-indigo-950/10 dark:border-[#9093bd]/15 pt-6"
          >
            {anchors.map((anchor) => (
              <motion.button
                key={anchor.id}
                type="button"
                whileHover={{y: -1}}
                whileTap={{scale: 0.96}}
                onClick={() => jumpTo(anchor.id)}
                className="sc-glass rounded-xl px-3.5 py-2 text-xs font-semibold text-[#4c4e75] dark:text-[#9093bd] hover:text-[#1810a9] dark:hover:text-white hover:border-[#5452c1]/50 transition-colors cursor-pointer"
              >
                {anchor.label}
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      {/* Brief & Pillars */}
      <motion.section
        id="case-brief"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, amount: 0.15}}
        transition={{duration: 0.5, ease: EASE_OUT}}
        className="border-b border-indigo-950/10 dark:border-[#9093bd]/15 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
              {study.brief.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0f0e24] dark:text-[#f4f5ff]">
              {study.brief.heading}
            </h2>
            <p className="text-base leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
              {study.brief.body}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {study.brief.pillars.map((pillar) => (
              <motion.div
                key={pillar.label}
                whileHover={{y: -3}}
                className="sc-glass rounded-2xl p-6 space-y-2 transition-colors hover:border-[#5452c1]/45"
              >
                <div className="text-xs font-mono uppercase tracking-[0.12em] text-[#5452c1] dark:text-[#8f92e8]">
                  {pillar.label}
                </div>
                <p className="text-sm sm:text-base font-medium leading-relaxed text-[#0f0e24] dark:text-[#f4f5ff]">
                  {pillar.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Legacy Evidence (E-Invest) */}
      {study.legacyEvidence && (
        <motion.section
          id="case-legacy"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.1}}
          transition={{duration: 0.5, ease: EASE_OUT}}
          className="border-b border-indigo-950/10 dark:border-[#9093bd]/15 bg-[#f2f3fd] dark:bg-[#050313] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 space-y-12">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                {study.legacyEvidence.eyebrow}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f0e24] dark:text-[#f4f5ff]">
                {study.legacyEvidence.heading}
              </h2>
              <p className="text-base leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                {study.legacyEvidence.body}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {study.legacyEvidence.legacyShots.map((shot) => (
                  <figure key={shot.src} className="sc-glass rounded-2xl p-3 space-y-2">
                    <ResilientImage
                      src={shot.src}
                      alt={shot.alt}
                      className="w-full h-64 object-contain rounded-xl bg-white dark:bg-[#07051b]"
                    />
                    <figcaption className="text-xs text-center font-medium text-[#4c4e75] dark:text-[#9093bd]">
                      {shot.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {study.legacyEvidence.signals.map((sig) => (
                  <motion.div
                    key={sig.index}
                    whileHover={{y: -3}}
                    className="sc-glass rounded-2xl p-5 space-y-2 transition-colors hover:border-[#5452c1]/45"
                  >
                    <span className="text-xs font-mono text-[#5452c1] dark:text-[#8f92e8] tabular-nums">
                      {sig.index}
                    </span>
                    <h3 className="text-base font-bold text-[#0f0e24] dark:text-[#f4f5ff]">
                      {sig.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                      {sig.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#5452c1] dark:text-[#9093bd]">
                {study.legacyEvidence.reviewsLabel}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {study.legacyEvidence.reviews.map((rev) => (
                  <div key={rev.src} className="sc-glass rounded-2xl p-3">
                    <ResilientImage
                      src={rev.src}
                      alt={rev.alt}
                      className="w-full h-24 object-contain rounded-xl bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Research Findings */}
      {study.research && (
        <motion.section
          id="case-research"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.12}}
          transition={{duration: 0.5, ease: EASE_OUT}}
          className="border-b border-indigo-950/10 dark:border-[#9093bd]/15 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 space-y-10">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                {study.research.eyebrow}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f0e24] dark:text-[#f4f5ff]">
                {study.research.heading}
              </h2>
              <p className="text-base leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                {study.research.body}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {study.research.findings.map((finding) => (
                <motion.div
                  key={finding.title}
                  whileHover={{y: -3}}
                  className="sc-glass rounded-2xl p-6 space-y-2.5 transition-colors hover:border-[#5452c1]/45"
                >
                  <div className="text-xs font-mono text-[#5452c1] dark:text-[#8f92e8] tabular-nums">
                    {finding.index}
                  </div>
                  <h3 className="text-lg font-bold text-[#0f0e24] dark:text-[#f4f5ff]">
                    {finding.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                    {finding.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {study.research.note && (
              <p className="text-xs italic text-[#4c4e75] dark:text-[#9093bd]">
                {study.research.note}
              </p>
            )}
          </div>
        </motion.section>
      )}

      {/* Survey Stats & Quotes */}
      {(study.stats || study.quotes) && (
        <motion.section
          id="case-evidence"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.12}}
          transition={{duration: 0.5, ease: EASE_OUT}}
          className="border-b border-indigo-950/10 dark:border-[#9093bd]/15 bg-[#f2f3fd] dark:bg-[#050313] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 space-y-14">
            {study.stats && (
              <div className="space-y-8">
                <div className="max-w-3xl space-y-3">
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                    {study.stats.eyebrow}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f0e24] dark:text-[#f4f5ff]">
                    {study.stats.heading}
                  </h2>
                  <p className="text-base leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                    {study.stats.body}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {study.stats.items.map((metric) => (
                    <motion.div
                      key={metric.label}
                      whileHover={{y: -3}}
                      className="sc-glass rounded-2xl p-6 space-y-1.5 transition-colors hover:border-[#5452c1]/45"
                    >
                      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#1810a9] dark:text-[#8f92e8] tabular-nums">
                        {metric.value}
                      </div>
                      <div className="text-sm font-bold text-[#0f0e24] dark:text-[#f4f5ff]">
                        {metric.label}
                      </div>
                      {metric.detail && (
                        <div className="text-xs text-[#4c4e75] dark:text-[#9093bd]">
                          {metric.detail}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {study.stats.note && (
                  <p className="text-sm text-[#4c4e75] dark:text-[#9093bd] max-w-3xl">
                    {study.stats.note}
                  </p>
                )}
              </div>
            )}

            {study.quotes && (
              <div className="space-y-8">
                <div className="max-w-2xl space-y-2">
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                    {study.quotes.eyebrow}
                  </p>
                  <h3 className="text-2xl font-extrabold text-[#0f0e24] dark:text-[#f4f5ff]">
                    {study.quotes.heading}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {study.quotes.items.map((q) => (
                    <blockquote
                      key={q.quote}
                      className="sc-glass rounded-2xl p-6 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <Quote
                          className="w-5 h-5 text-[#5452c1] dark:text-[#8f92e8]"
                          aria-hidden="true"
                        />
                        <p className="font-serif italic text-base leading-relaxed text-[#0f0e24] dark:text-[#f4f5ff]">
                          “{q.quote}”
                        </p>
                      </div>
                      <cite className="not-italic text-xs font-mono text-[#4c4e75] dark:text-[#9093bd]">
                        — {q.cite}
                      </cite>
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Strategy, Highlights & Web Direction */}
      {(study.strategy || study.highlights || study.webDirection) && (
        <motion.section
          id="case-strategy"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.12}}
          transition={{duration: 0.5, ease: EASE_OUT}}
          className="border-b border-indigo-950/10 dark:border-[#9093bd]/15 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 space-y-14">
            {study.strategy && (
              <div className="space-y-8">
                <div className="max-w-3xl space-y-2">
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                    {study.strategy.eyebrow}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f0e24] dark:text-[#f4f5ff]">
                    {study.strategy.heading}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {study.strategy.items.map((item) => (
                    <motion.div
                      key={item.title}
                      whileHover={{y: -3}}
                      className="sc-glass rounded-2xl p-6 space-y-2.5 transition-colors hover:border-[#5452c1]/45"
                    >
                      <div className="text-xs font-mono text-[#5452c1] dark:text-[#8f92e8]">
                        {item.index}
                      </div>
                      <h3 className="text-base font-bold text-[#0f0e24] dark:text-[#f4f5ff]">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                        {item.body}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {study.strategy.table && (
                  <div className="sc-glass overflow-hidden rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-indigo-950/10 dark:border-[#9093bd]/15 bg-indigo-950/5 dark:bg-[#0b0463]/30">
                          <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[#5452c1] dark:text-[#9093bd]">
                            {study.strategy.table.headers[0]}
                          </th>
                          <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[#5452c1] dark:text-[#9093bd]">
                            {study.strategy.table.headers[1]}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {study.strategy.table.rows.map(([signal, response]) => (
                          <tr
                            key={signal}
                            className="border-b border-indigo-950/8 dark:border-[#9093bd]/12 last:border-b-0"
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-[#0f0e24] dark:text-[#f4f5ff] align-top">
                              {signal}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#4c4e75] dark:text-[#9093bd] align-top">
                              {response}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {study.highlights && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 sc-glass rounded-2xl p-6 sm:p-8 space-y-5">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                      {study.highlights.eyebrow}
                    </p>
                    <h3 className="mt-1.5 text-2xl font-extrabold text-[#0f0e24] dark:text-[#f4f5ff]">
                      {study.highlights.heading}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {study.highlights.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-center gap-3 text-sm sm:text-base font-medium text-[#0f0e24] dark:text-[#f4f5ff]"
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#5452c1]/15 text-[#5452c1] dark:text-[#8f92e8] shrink-0">
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {study.highlights.marketNote && (
                  <div className="lg:col-span-6 sc-glass rounded-2xl p-6 sm:p-8 space-y-3">
                    <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                      {study.highlights.marketNote.eyebrow}
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#0f0e24] dark:text-[#f4f5ff]">
                      {study.highlights.marketNote.heading}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                      {study.highlights.marketNote.body}
                    </p>
                  </div>
                )}
              </div>
            )}

            {study.webDirection && (
              <div className="sc-glass rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                    {study.webDirection.eyebrow}
                  </p>
                  <h3 className="text-2xl font-extrabold text-[#0f0e24] dark:text-[#f4f5ff]">
                    {study.webDirection.heading}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                    {study.webDirection.body}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {study.webDirection.domains.map((dom) => (
                      <div
                        key={dom}
                        className="rounded-xl border border-indigo-950/10 dark:border-[#9093bd]/18 bg-white/75 dark:bg-[#07051b]/75 px-4 py-3 text-xs sm:text-sm font-semibold text-[#0f0e24] dark:text-[#f4f5ff]"
                      >
                        {dom}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl border border-indigo-950/10 dark:border-[#9093bd]/20 bg-gradient-to-br from-[#e9ebff] to-[#dfe2fb] dark:from-[#120d3f] dark:to-[#07051a] p-6 flex flex-col justify-center space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#5452c1] dark:text-[#8f92e8]">
                    System Principle
                  </span>
                  <h4 className="text-xl font-extrabold text-[#0f0e24] dark:text-[#f4f5ff]">
                    {study.webDirection.principleHeading}
                  </h4>
                  <p className="text-sm leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                    {study.webDirection.principleBody}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Product Screens Gallery */}
      <section
        id="case-screens"
        className="border-b border-indigo-950/10 dark:border-[#9093bd]/15 bg-[#f2f3fd] dark:bg-[#050313] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
              {study.carouselHeading.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f0e24] dark:text-[#f4f5ff]">
              {study.carouselHeading.heading}
            </h2>
            <p className="text-base leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
              {study.carouselHeading.body}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {study.screens.map((screen, idx) => {
              const isWeb = screen.format === 'web';
              return (
                <motion.figure
                  key={screen.id}
                  initial={{opacity: 0, y: 18}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, amount: 0.12}}
                  transition={{duration: 0.42, delay: idx * 0.04, ease: EASE_OUT}}
                  whileHover={{y: -4}}
                  className="sc-glass group rounded-3xl p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-[#5452c1]/55 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => onInspectScreen(study.screens, idx)}
                    aria-label={`Inspect ${screen.title} full resolution`}
                    className="relative w-full overflow-hidden rounded-2xl border border-indigo-950/10 dark:border-[#9093bd]/20 bg-gradient-to-br from-[#e9ebff] to-[#dfe2fb] dark:from-[#120d3f] dark:to-[#07051a] p-3 flex items-center justify-center cursor-zoom-in"
                  >
                    <ResilientImage
                      src={screen.src}
                      alt={screen.alt}
                      className={`rounded-xl shadow-md transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
                        isWeb
                          ? 'w-full h-56 object-cover object-top'
                          : 'w-auto h-72 object-contain'
                      }`}
                    />
                    <span className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 dark:bg-[#07051b]/95 text-[#0f0e24] dark:text-[#f4f5ff] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </button>

                  <figcaption className="space-y-1 px-1">
                    <div className="text-xs font-mono text-[#5452c1] dark:text-[#8f92e8]">
                      {screen.title}
                    </div>
                    <p className="text-sm text-[#4c4e75] dark:text-[#9093bd]">
                      {screen.caption}
                    </p>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reflection */}
      {study.reflection && (
        <motion.section
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.15}}
          transition={{duration: 0.5, ease: EASE_OUT}}
          className="border-b border-indigo-950/10 dark:border-[#9093bd]/15 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 space-y-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                {study.reflection.eyebrow}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f0e24] dark:text-[#f4f5ff]">
                {study.reflection.heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {study.reflection.items.map((item) => (
                <div key={item.title} className="sc-glass rounded-2xl p-6 space-y-2">
                  <h3 className="text-base font-bold text-[#0f0e24] dark:text-[#f4f5ff]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4c4e75] dark:text-[#9093bd]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Prev / Next Case Switcher */}
      <nav
        aria-label="Adjacent case studies"
        className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            type="button"
            whileHover={{x: lang === 'ar' ? 3 : -3}}
            whileTap={{scale: 0.99}}
            onClick={() => onSelectCase(prevStudy.slug)}
            className="sc-glass group flex items-center justify-between gap-4 rounded-2xl p-6 text-start hover:border-[#4f46e5]/55 transition-colors cursor-pointer"
          >
            <div className="space-y-1 min-w-0">
              <span className="text-xs font-mono text-[#4f46e5] dark:text-[#818cf8]">
                {t.caseLabels.prevCase} · {prevStudy.number}
              </span>
              <div className="text-lg font-extrabold text-[#111827] dark:text-[#f3f4f6] truncate">
                {prevStudy.title}
              </div>
              <div className="text-xs text-[#6b7280] dark:text-[#9ca3af] truncate">
                {prevStudy.domain}
              </div>
            </div>
            <ArrowLeft
              className={`w-5 h-5 text-[#4f46e5] dark:text-[#818cf8] shrink-0 transition-transform ${
                lang === 'ar' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'
              }`}
              aria-hidden="true"
            />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{x: lang === 'ar' ? -3 : 3}}
            whileTap={{scale: 0.99}}
            onClick={() => onSelectCase(nextStudy.slug)}
            className="sc-glass group flex items-center justify-between gap-4 rounded-2xl p-6 text-start hover:border-[#4f46e5]/55 transition-colors cursor-pointer"
          >
            <div className="space-y-1 min-w-0">
              <span className="text-xs font-mono text-[#4f46e5] dark:text-[#818cf8]">
                {t.caseLabels.nextCase} · {nextStudy.number}
              </span>
              <div className="text-lg font-extrabold text-[#111827] dark:text-[#f3f4f6] truncate">
                {nextStudy.title}
              </div>
              <div className="text-xs text-[#6b7280] dark:text-[#9ca3af] truncate">
                {nextStudy.domain}
              </div>
            </div>
            <ArrowRight
              className={`w-5 h-5 text-[#4f46e5] dark:text-[#818cf8] shrink-0 transition-transform ${
                lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
              }`}
              aria-hidden="true"
            />
          </motion.button>
        </div>
      </nav>
    </article>
  );
}
