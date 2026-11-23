import {useEffect, useMemo, useRef, useState} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  Compass,
  Expand,
  FileText,
  Globe,
  Layers,
  Moon,
  RotateCcw,
  Send,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import {
  CAREER_HISTORY,
  CASE_STUDIES,
  CaseCategory,
  CaseSlug,
  PARTNERS,
  PROFILE,
  SELECTED_SCREENS,
  ScreenSlide,
} from '../data/portfolioData';
import {
  CAREER_AR_LABELS,
  CASE_AR_SUMMARIES,
  Lang,
  UI_COPY,
} from '../data/i18n';
import {ResilientImage} from './ResilientImage';

interface AgentWorkspaceProps {
  theme: 'dark' | 'light';
  lang: Lang;
  onChangeTheme: (theme: 'dark' | 'light') => void;
  onChangeLang: (lang: Lang) => void;
  onSelectCase: (slug: CaseSlug) => void;
  onInspectScreen: (items: ScreenSlide[], index: number) => void;
  onOpenCv: () => void;
}

interface AgentTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedCaseSlugs?: CaseSlug[];
  relatedScreenIds?: string[];
  relatedCareerIds?: string[];
  showPartners?: boolean;
  suggestCv?: boolean;
  recommendedQuestions?: string[];
  isError?: boolean;
  retryPrompt?: string;
}

type InspectorTab = 'focus' | 'cases' | 'screens' | 'career' | 'about';

const ALL_SCREENS_BY_ID = new Map<string, ScreenSlide>([
  ...SELECTED_SCREENS.map((s): [string, ScreenSlide] => [s.id, s]),
  ...CASE_STUDIES.flatMap((cs) =>
    cs.screens.map((s): [string, ScreenSlide] => [
      s.id,
      {...s, product: s.product || cs.title},
    ]),
  ),
]);

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function AgentWorkspace({
  theme,
  lang,
  onChangeTheme,
  onChangeLang,
  onSelectCase,
  onInspectScreen,
  onOpenCv,
}: AgentWorkspaceProps) {
  const t = UI_COPY[lang];
  const isRtl = lang === 'ar';

  const [turns, setTurns] = useState<AgentTurn[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('focus');
  const [featuredSlug, setFeaturedSlug] = useState<CaseSlug>('e-invest');
  const [caseFilter, setCaseFilter] = useState<CaseCategory>('all');
  const [screenFilter, setScreenFilter] = useState<'all' | 'web' | 'mobile'>('all');
  const [openCareerId, setOpenCareerId] = useState<string>(CAREER_HISTORY[0].id);

  const feedEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const orbStageRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, {stiffness: 140, damping: 20, mass: 0.6});
  const smoothY = useSpring(mouseY, {stiffness: 140, damping: 20, mass: 0.6});
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);

  const latestAssistant = useMemo(() => {
    for (let i = turns.length - 1; i >= 0; i -= 1) {
      if (turns[i].role === 'assistant' && !turns[i].isError) {
        return turns[i];
      }
    }
    return null;
  }, [turns]);

  useEffect(() => {
    if (turns.length > 0) {
      feedEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }, [turns, loading]);

  useEffect(() => {
    if (!latestAssistant) return;
    if (latestAssistant.relatedCaseSlugs?.length) {
      setFeaturedSlug(latestAssistant.relatedCaseSlugs[0]);
      setInspectorTab('focus');
    } else if (latestAssistant.relatedCareerIds?.length) {
      setOpenCareerId(latestAssistant.relatedCareerIds[0]);
      setInspectorTab('career');
    } else if (latestAssistant.showPartners) {
      setInspectorTab('about');
    }
  }, [latestAssistant]);

  const activeCase =
    CASE_STUDIES.find((c) => c.slug === featuredSlug) || CASE_STUDIES[0];
  const mainScreen =
    activeCase.previewScreens.find((s) => s.role === 'main') ||
    activeCase.previewScreens[0];

  const activeCaseDisplay = useMemo(() => {
    if (lang === 'ar') {
      const ar = CASE_AR_SUMMARIES[activeCase.slug];
      return {
        domain: ar.domain,
        headline: ar.headline,
        lead: ar.lead,
      };
    }
    return {
      domain: activeCase.domain,
      headline: `${activeCase.headline} ${activeCase.headlineItalic}`,
      lead: activeCase.lead,
    };
  }, [activeCase, lang]);

  const filteredCases = useMemo(() => {
    if (caseFilter === 'all') return CASE_STUDIES;
    return CASE_STUDIES.filter((c) => c.category === caseFilter);
  }, [caseFilter]);

  const filteredScreens = useMemo(() => {
    if (screenFilter === 'all') return SELECTED_SCREENS;
    return SELECTED_SCREENS.filter((s) => s.category === screenFilter);
  }, [screenFilter]);

  const sendPrompt = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    const userTurn: AgentTurn = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const nextTurns = [...turns, userTurn];
    setTurns(nextTurns);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = nextTurns
        .filter((tItem) => !tItem.isError)
        .map((tItem) => ({role: tItem.role, content: tItem.content}));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: apiMessages, lang}),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === 'string'
            ? data.error
            : `Request failed (${res.status})`,
        );
      }

      const aiTurn: AgentTurn = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          typeof data.reply === 'string'
            ? data.reply
            : 'No grounded answer returned from portfolio records.',
        relatedCaseSlugs: Array.isArray(data.relatedCaseSlugs)
          ? data.relatedCaseSlugs
          : [],
        relatedScreenIds: Array.isArray(data.relatedScreenIds)
          ? data.relatedScreenIds
          : [],
        relatedCareerIds: Array.isArray(data.relatedCareerIds)
          ? data.relatedCareerIds
          : [],
        showPartners: Boolean(data.showPartners),
        suggestCv: Boolean(data.suggestCv),
        recommendedQuestions: Array.isArray(data.recommendedQuestions)
          ? data.recommendedQuestions
          : [],
      };

      setTurns((prev) => [...prev, aiTurn]);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : lang === 'ar'
            ? 'تعذر الاتصال بمساعد البورتفوليو حالياً.'
            : 'Unable to reach the Portfolio AI Agent right now.';
      setTurns((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: message,
          isError: true,
          retryPrompt: trimmed,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendPrompt(input);
  };

  const resetSession = () => {
    setTurns([]);
    setInput('');
    setFeaturedSlug('e-invest');
    setInspectorTab('focus');
    inputRef.current?.focus();
  };

  return (
    <section
      id="agent"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-[#f8f9fb] dark:bg-[#0b0e14] text-[#111827] dark:text-[#f3f4f6]"
    >
      {/* Crisp AI Studio Top Bar (Compact Studio Chrome) */}
      <header className="border-b border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#111520] px-4 sm:px-6">
        <div className="mx-auto flex h-13 max-w-[1480px] items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#4f46e5] text-white">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
            <span className="text-[13px] font-bold tracking-tight truncate">
              {t.name}
            </span>
            <span className="text-xs text-[#64748b] dark:text-[#94a3b8] hidden md:inline truncate">
              · {t.role}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {turns.length > 0 && (
              <button
                type="button"
                onClick={resetSession}
                className="sc-glass inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#475569] dark:text-[#cbd5e1] hover:border-[#4f46e5]/50 hover:text-[#4f46e5] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t.newBriefing}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCv}
              className="sc-glass inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#1e293b] dark:text-[#e2e8f0] hover:border-[#4f46e5]/50 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#4f46e5] dark:text-[#818cf8]" aria-hidden="true" />
              <span>{t.offlineCv}</span>
            </button>

            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="sc-glass hidden sm:inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#1e293b] dark:text-[#e2e8f0] hover:border-[#4f46e5]/50 transition-colors"
            >
              <span>{t.linkedin}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#4f46e5] dark:text-[#818cf8]" aria-hidden="true" />
            </a>

            {/* Bilingual Language Toggle */}
            <div
              role="group"
              aria-label="Language"
              className="sc-glass inline-flex items-center rounded-lg p-0.5"
            >
              <button
                type="button"
                onClick={() => onChangeLang('en')}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#4f46e5] text-white'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                <Globe className="w-3 h-3" aria-hidden="true" />
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeLang('ar')}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-[#4f46e5] text-white'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                <span>عربي</span>
              </button>
            </div>

            {/* Light / Dark Mode Switcher */}
            <div
              role="group"
              aria-label="Theme"
              className="sc-glass inline-flex items-center rounded-lg p-0.5"
            >
              <button
                type="button"
                onClick={() => onChangeTheme('light')}
                aria-label={t.lightMode}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#4f46e5] text-white'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3" aria-hidden="true" />
                <span className="hidden md:inline">{t.lightMode}</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeTheme('dark')}
                aria-label={t.darkMode}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#4f46e5] text-white'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                <Moon className="w-3 h-3" aria-hidden="true" />
                <span className="hidden md:inline">{t.darkMode}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Proportional Studio Split: Smaller Chat Sidebar (col-span-4) + Larger Portfolio Stage (col-span-8) */}
      <div className="mx-auto w-full max-w-[1480px] flex-1 p-3 sm:p-4 lg:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* SMALLER CHAT SIDEBAR (lg:col-span-4) */}
        <aside
          aria-label={t.agentTitle}
          className="lg:col-span-4 sc-glass-elevated flex flex-col justify-between overflow-hidden rounded-2xl min-h-[480px] lg:h-[calc(100dvh-5.5rem)]"
        >
          {/* Compact Chat Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] dark:border-[#232838] px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-[13px] font-bold text-[#111827] dark:text-[#f3f4f6] truncate">
                {t.agentTitle}
              </h2>
              <p className="text-[11px] text-[#64748b] dark:text-[#94a3b8] truncate">
                {loading ? t.agentSubtitleBusy : t.agentSubtitleIdle}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#4f46e5] dark:text-[#818cf8] shrink-0">
              AI
            </span>
          </div>

          {/* Chat Feed */}
          <div className="thin-scroll flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
            {turns.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#e5e7eb] dark:border-[#232838] bg-[#f8f9fb] dark:bg-[#161b26] p-3.5 space-y-1.5">
                  <div className="text-[13px] font-bold text-[#111827] dark:text-[#f3f4f6]">
                    {t.heroHeadline}{' '}
                    <span className="text-[#4f46e5] dark:text-[#818cf8]">
                      {t.heroHeadlineItalic}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#475569] dark:text-[#94a3b8]">
                    {t.heroDescription}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                    {t.starterHeading}
                  </p>
                  <div className="space-y-2">
                    {t.briefings.map((brief) => (
                      <button
                        key={brief.title}
                        type="button"
                        onClick={() => void sendPrompt(brief.prompt)}
                        className="w-full rounded-xl border border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#131722] p-3 text-start hover:border-[#4f46e5]/60 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#111827] dark:text-[#f3f4f6] group-hover:text-[#4f46e5] dark:group-hover:text-[#818cf8]">
                            {brief.title}
                          </span>
                          <ArrowUpRight
                            className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#4f46e5] shrink-0"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                          {brief.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {turns.map((turn) => {
                  if (turn.role === 'user') {
                    return (
                      <motion.div
                        key={turn.id}
                        initial={{opacity: 0, y: 6}}
                        animate={{opacity: 1, y: 0}}
                        className="flex justify-end"
                      >
                        <div className="sc-cta max-w-[88%] rounded-2xl rounded-ee-sm px-3.5 py-2.5 text-[13px] leading-snug text-white">
                          {turn.content}
                        </div>
                      </motion.div>
                    );
                  }

                  const referencedCases = (turn.relatedCaseSlugs || [])
                    .map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
                    .filter((c): c is NonNullable<typeof c> => Boolean(c));

                  const referencedScreens = (turn.relatedScreenIds || [])
                    .map((id) => ALL_SCREENS_BY_ID.get(id))
                    .filter((s): s is ScreenSlide => Boolean(s));

                  const referencedCareers = (turn.relatedCareerIds || [])
                    .map((id) => CAREER_HISTORY.find((c) => c.id === id))
                    .filter((c): c is NonNullable<typeof c> => Boolean(c));

                  return (
                    <motion.div
                      key={turn.id}
                      initial={{opacity: 0, y: 8}}
                      animate={{opacity: 1, y: 0}}
                      className="space-y-2.5"
                    >
                      <div
                        className={`rounded-2xl rounded-es-sm p-3.5 text-[13px] leading-relaxed whitespace-pre-line ${
                          turn.isError
                            ? 'border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-200'
                            : 'border border-[#e5e7eb] dark:border-[#232838] bg-[#f8f9fb] dark:bg-[#161b26] text-[#111827] dark:text-[#f3f4f6]'
                        }`}
                      >
                        {turn.content}
                        {turn.isError && turn.retryPrompt && (
                          <div className="mt-2.5">
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => void sendPrompt(turn.retryPrompt!)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/35 bg-white/80 dark:bg-[#111520] px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-200 hover:border-rose-500 cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw className="w-3 h-3" aria-hidden="true" />
                              <span>{t.retryLabel}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {referencedCases.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {referencedCases.map((cs) => (
                            <button
                              key={cs.slug}
                              type="button"
                              onClick={() => onSelectCase(cs.slug)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#4f46e5]/30 bg-[#eef2ff] dark:bg-[#1e1b4b] px-2.5 py-1 text-[11px] font-semibold text-[#4338ca] dark:text-[#c7d2fe] hover:border-[#4f46e5] cursor-pointer"
                            >
                              <span>{cs.title}</span>
                              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                            </button>
                          ))}
                        </div>
                      )}

                      {referencedScreens.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5">
                          {referencedScreens.slice(0, 2).map((scr, idx) => (
                            <button
                              key={scr.id}
                              type="button"
                              onClick={() => onInspectScreen(referencedScreens, idx)}
                              className="sc-glass group overflow-hidden rounded-lg p-1.5 text-start hover:border-[#4f46e5]/60 cursor-zoom-in"
                            >
                              <ResilientImage
                                src={scr.src}
                                alt={scr.alt}
                                className="h-16 w-full object-cover object-top rounded"
                              />
                              <div className="mt-1 text-[10px] font-semibold truncate">
                                {scr.title}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {referencedCareers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {referencedCareers.map((job) => (
                            <button
                              key={job.id}
                              type="button"
                              onClick={() => {
                                setOpenCareerId(job.id);
                                setInspectorTab('career');
                              }}
                              className="sc-glass rounded-lg px-2.5 py-1 text-[11px] font-medium text-[#334155] dark:text-[#cbd5e1] hover:border-[#4f46e5] cursor-pointer"
                            >
                              {job.company}
                            </button>
                          ))}
                        </div>
                      )}

                      {(turn.showPartners || turn.suggestCv) && (
                        <div className="flex flex-wrap gap-1.5">
                          {turn.showPartners && (
                            <button
                              type="button"
                              onClick={() => setInspectorTab('about')}
                              className="sc-glass rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[#4338ca] dark:text-[#a5b4fc] cursor-pointer"
                            >
                              {t.inspectPartners}
                            </button>
                          )}
                          {turn.suggestCv && (
                            <button
                              type="button"
                              onClick={onOpenCv}
                              className="sc-cta rounded-lg px-2.5 py-1 text-[11px] font-semibold cursor-pointer"
                            >
                              {t.openOfflineCv}
                            </button>
                          )}
                        </div>
                      )}

                      {turn.recommendedQuestions &&
                        turn.recommendedQuestions.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                              {t.recommendedHeading}
                            </p>
                            <div className="flex flex-col gap-1">
                              {turn.recommendedQuestions.map((rec) => (
                                <button
                                  key={rec}
                                  type="button"
                                  disabled={loading}
                                  onClick={() => void sendPrompt(rec)}
                                  className="rounded-lg border border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#131722] px-2.5 py-1.5 text-start text-[11px] font-medium text-[#3730a3] dark:text-[#c7d2fe] hover:border-[#4f46e5] transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {rec}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                    </motion.div>
                  );
                })}

                {loading && (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#e5e7eb] dark:border-[#232838] bg-[#f8f9fb] dark:bg-[#161b26] px-3 py-2 text-[11px] font-mono text-[#4f46e5] dark:text-[#818cf8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4f46e5] animate-ping" />
                    <span>{t.searchingLabel}</span>
                  </div>
                )}

                <div ref={feedEndRef} />
              </div>
            )}
          </div>

          {/* Compact Chat Composer */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#111520] p-3 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              maxLength={600}
              disabled={loading}
              aria-label={t.inputPlaceholder}
              className="flex-1 rounded-xl border border-[#e5e7eb] dark:border-[#2a3042] bg-[#f8f9fb] dark:bg-[#0b0e14] px-3 py-2.5 text-[13px] text-[#111827] dark:text-[#f3f4f6] placeholder:text-[#64748b] dark:placeholder:text-[#64748b] focus:border-[#4f46e5] focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={t.sendLabel}
              className="sc-cta inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </aside>

        {/* LARGER DISPLAYED PORTFOLIO STAGE (lg:col-span-8) */}
        <section
          aria-label="Portfolio showcase stage"
          className="lg:col-span-8 sc-glass-elevated flex flex-col justify-between overflow-hidden rounded-2xl p-4 sm:p-6 min-h-[540px] lg:h-[calc(100dvh-5.5rem)]"
        >
          {/* Spacious 5-Tab Bar + Metric Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] dark:border-[#232838] pb-3.5">
            <div
              role="tablist"
              aria-label="Portfolio sections"
              className="flex flex-wrap items-center gap-1 rounded-xl bg-[#f1f5f9] dark:bg-[#0b0e14] p-1 border border-[#e5e7eb] dark:border-[#232838]"
            >
              {(
                [
                  {id: 'focus', label: t.tabs.focus, icon: Sparkles},
                  {id: 'cases', label: t.tabs.cases, icon: Compass},
                  {id: 'screens', label: t.tabs.screens, icon: Layers},
                  {id: 'career', label: t.tabs.career, icon: Briefcase},
                  {id: 'about', label: t.tabs.about, icon: User},
                ] as const
              ).map((tab) => {
                const active = inspectorTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setInspectorTab(tab.id)}
                    className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'text-white'
                        : 'text-[#475569] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="studio-stage-tab"
                        transition={{type: 'spring', stiffness: 360, damping: 30}}
                        className="absolute inset-0 rounded-lg bg-[#4f46e5] shadow-sm"
                      />
                    )}
                    <Icon className="relative z-10 w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono text-[#64748b] dark:text-[#94a3b8] tabular-nums">
              <span>06 {t.stats.cases}</span>
              <span>·</span>
              <span>07 {t.stats.teams}</span>
              <span>·</span>
              <span>16 {t.stats.partners}</span>
              <span>·</span>
              <span>24 {t.stats.screens}</span>
            </div>
          </div>

          {/* Spacious Stage Content */}
          <div className="flex-1 overflow-hidden pt-5 flex flex-col">
            <AnimatePresence mode="wait">
              {/* TAB 1: WIDE SUPERCONSCIOUS SPOTLIGHT STAGE */}
              {inspectorTab === 'focus' && (
                <motion.div
                  key="stage-focus"
                  ref={orbStageRef}
                  onPointerMove={(e) => {
                    const rect = orbStageRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
                    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
                  }}
                  onPointerLeave={() => {
                    mouseX.set(0);
                    mouseY.set(0);
                  }}
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.24}}
                  style={{perspective: 1000}}
                  className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center overflow-y-auto thin-scroll pr-1"
                >
                  {/* Orbital Preview Sub-Stage */}
                  <div className="md:col-span-6 relative flex items-center justify-center min-h-[320px] rounded-2xl border border-[#e5e7eb] dark:border-[#232838] bg-gradient-to-br from-[#f8faff] via-[#eef2ff] to-[#e0e7ff]/60 dark:from-[#0e1222] dark:via-[#111528] dark:to-[#0b0e14] p-6 overflow-hidden">
                    <div
                      aria-hidden="true"
                      className="animate-aura-breathe pointer-events-none absolute h-64 w-64 rounded-full blur-2xl"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(79,70,229,0.22) 50%, transparent 78%)',
                      }}
                    />
                    <div
                      aria-hidden="true"
                      className="animate-orbit-slow pointer-events-none absolute h-[290px] w-[290px] rounded-full border border-[#4f46e5]/20 dark:border-[#818cf8]/20"
                    >
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#4f46e5]" />
                    </div>
                    <div
                      aria-hidden="true"
                      className="animate-orbit-reverse pointer-events-none absolute h-[230px] w-[230px] rounded-full border border-dashed border-[#4f46e5]/20 dark:border-[#818cf8]/20"
                    />

                    <motion.div
                      style={{rotateX, rotateY, transformStyle: 'preserve-3d'}}
                      className="relative z-10 flex justify-center w-full"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectCase(activeCase.slug)}
                        className={`overflow-hidden rounded-2xl border border-[#4f46e5]/30 bg-white dark:bg-[#0b0e14] p-1.5 shadow-[0_20px_50px_rgba(30,27,75,0.22)] transition-transform hover:-translate-y-1 cursor-pointer ${
                          activeCase.previewFormat === 'web'
                            ? 'w-full max-w-[360px]'
                            : 'w-[195px] sm:w-[215px]'
                        }`}
                      >
                        <ResilientImage
                          src={mainScreen.src}
                          alt={mainScreen.alt}
                          loading="eager"
                          className={
                            activeCase.previewFormat === 'web'
                              ? 'w-full h-56 object-cover object-top rounded-xl'
                              : 'w-full h-72 object-cover object-top rounded-xl'
                          }
                        />
                      </button>
                    </motion.div>
                  </div>

                  {/* Active Project Brief & Switcher Sub-Stage */}
                  <div className="md:col-span-6 flex flex-col justify-between gap-5">
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-[#4f46e5] dark:text-[#818cf8] tabular-nums">
                        {activeCase.number} · {activeCaseDisplay.domain}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#f3f4f6]">
                        {activeCase.title}
                      </h1>
                      <p className="text-sm font-semibold text-[#3730a3] dark:text-[#a5b4fc]">
                        {activeCaseDisplay.headline}
                      </p>
                      <p className="text-[13px] leading-relaxed text-[#475569] dark:text-[#94a3b8]">
                        {activeCaseDisplay.lead}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {activeCase.meta.slice(0, 3).map((m) => (
                        <div
                          key={m.label}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#e5e7eb] dark:border-[#232838] bg-[#f8f9fb] dark:bg-[#161b26] px-3.5 py-2 text-xs"
                        >
                          <span className="font-mono text-[#64748b] dark:text-[#94a3b8]">
                            {m.label}
                          </span>
                          <span className="font-semibold text-[#111827] dark:text-[#f3f4f6] text-end">
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectCase(activeCase.slug)}
                        className="sc-cta inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                      >
                        <span>{t.openCase}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void sendPrompt(
                            lang === 'ar'
                              ? `اشرح لي تفاصيل دراسة حالة ${activeCase.title} والأبحاث والحلول.`
                              : `Walk me through ${activeCase.title}: research, user problems, and design decisions.`,
                          )
                        }
                        className="sc-glass inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#111827] dark:text-[#f3f4f6] hover:border-[#4f46e5] cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#4f46e5]" aria-hidden="true" />
                        <span>{t.askAiShort}</span>
                      </button>
                    </div>

                    {/* Featured Project Switcher */}
                    <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#f1f5f9] dark:bg-[#0b0e14] p-1 border border-[#e5e7eb] dark:border-[#232838]">
                      {(['e-invest', '7salty', 'sas-vaya'] as CaseSlug[]).map(
                        (slug) => {
                          const cs = CASE_STUDIES.find((c) => c.slug === slug)!;
                          const active = featuredSlug === slug;
                          return (
                            <button
                              key={slug}
                              type="button"
                              onClick={() => setFeaturedSlug(slug)}
                              className={`rounded-lg py-1.5 px-2 text-xs font-semibold transition-colors truncate cursor-pointer ${
                                active
                                  ? 'bg-[#4f46e5] text-white'
                                  : 'text-[#475569] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-white'
                              }`}
                            >
                              {cs.title}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ALL 6 CASE STUDIES GRID */}
              {inspectorTab === 'cases' && (
                <motion.div
                  key="stage-cases"
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.24}}
                  className="flex-1 flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        {id: 'all', label: t.filters.allCases},
                        {id: 'fintech', label: t.filters.fintech},
                        {id: 'enterprise', label: t.filters.enterprise},
                        {id: 'consumer', label: t.filters.consumer},
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCaseFilter(f.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                          caseFilter === f.id
                            ? 'bg-[#4f46e5] text-white'
                            : 'sc-glass text-[#475569] dark:text-[#94a3b8]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="thin-scroll flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
                    {filteredCases.map((cs) => {
                      const thumb =
                        cs.previewScreens.find((p) => p.role === 'main') ||
                        cs.previewScreens[0];
                      const csCopy =
                        lang === 'ar'
                          ? CASE_AR_SUMMARIES[cs.slug]
                          : {domain: cs.domain, headline: cs.subtitle, lead: cs.lead};
                      return (
                        <article
                          key={cs.slug}
                          className="sc-glass rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-[#4f46e5]/50 transition-colors"
                        >
                          <div className="space-y-3">
                            {thumb && (
                              <button
                                type="button"
                                onClick={() => onSelectCase(cs.slug)}
                                className="w-full h-44 overflow-hidden rounded-xl border border-[#e5e7eb] dark:border-[#232838] bg-[#f8f9fb] dark:bg-[#0b0e14] flex items-center justify-center p-2 cursor-pointer"
                              >
                                <ResilientImage
                                  src={thumb.src}
                                  alt={thumb.alt}
                                  className="h-full w-auto object-contain rounded-lg"
                                />
                              </button>
                            )}
                            <div>
                              <div className="text-[11px] font-mono text-[#4f46e5] dark:text-[#818cf8]">
                                {cs.number} · {csCopy.domain}
                              </div>
                              <h3 className="text-base font-extrabold text-[#111827] dark:text-[#f3f4f6] mt-0.5">
                                {cs.title}
                              </h3>
                              <p className="text-xs text-[#475569] dark:text-[#94a3b8] line-clamp-2 mt-1">
                                {csCopy.lead}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e5e7eb] dark:border-[#232838]">
                            <button
                              type="button"
                              onClick={() =>
                                void sendPrompt(
                                  lang === 'ar'
                                    ? `اشرح ${cs.title}: المشكلة ونتائج البحث والحل التصميمي.`
                                    : `Explain ${cs.title}: problem, research evidence, and design solution.`,
                                )
                              }
                              className="text-xs font-semibold text-[#475569] dark:text-[#cbd5e1] hover:text-[#4f46e5] cursor-pointer"
                            >
                              {t.askAiShort}
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectCase(cs.slug)}
                              className="sc-cta inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
                            >
                              <span>{t.openCaseShort}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: ALL 24 SCREENS */}
              {inspectorTab === 'screens' && (
                <motion.div
                  key="stage-screens"
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.24}}
                  className="flex-1 flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        {id: 'all', label: t.filters.allScreens},
                        {id: 'web', label: t.filters.web},
                        {id: 'mobile', label: t.filters.mobile},
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setScreenFilter(f.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                          screenFilter === f.id
                            ? 'bg-[#4f46e5] text-white'
                            : 'sc-glass text-[#475569] dark:text-[#94a3b8]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="thin-scroll flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 pr-1">
                    {filteredScreens.map((scr, idx) => (
                      <button
                        key={scr.id}
                        type="button"
                        onClick={() => onInspectScreen(filteredScreens, idx)}
                        className="sc-glass group rounded-2xl p-3 text-start hover:border-[#4f46e5]/55 cursor-zoom-in"
                      >
                        <div className="relative h-40 w-full overflow-hidden rounded-xl bg-[#f1f5f9] dark:bg-[#0b0e14] flex items-center justify-center p-2">
                          <ResilientImage
                            src={scr.src}
                            alt={scr.alt}
                            className="h-full w-auto object-contain rounded transition-transform duration-300 group-hover:scale-105"
                          />
                          <span className="absolute top-2 end-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/95 dark:bg-[#111520]/95 text-[#111827] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            <Expand className="w-3 h-3" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="mt-2.5 text-xs font-bold text-[#111827] dark:text-[#f3f4f6] truncate">
                          {scr.title}
                        </div>
                        <div className="text-[11px] text-[#64748b] dark:text-[#94a3b8] truncate">
                          {scr.product}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: CAREER TIMELINE (07 TEAMS) */}
              {inspectorTab === 'career' && (
                <motion.div
                  key="stage-career"
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.24}}
                  className="thin-scroll flex-1 overflow-y-auto space-y-3 pr-1"
                >
                  {CAREER_HISTORY.map((job) => {
                    const isOpen = openCareerId === job.id;
                    const arJob = lang === 'ar' ? CAREER_AR_LABELS[job.id] : null;
                    return (
                      <div
                        key={job.id}
                        className={`sc-glass rounded-2xl overflow-hidden transition-colors ${
                          isOpen ? 'border-[#4f46e5]/55' : ''
                        }`}
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenCareerId(isOpen ? '' : job.id)}
                          className="w-full p-4 flex items-center justify-between gap-4 text-start cursor-pointer"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-baseline gap-2.5">
                              <span className="text-sm font-extrabold text-[#111827] dark:text-[#f3f4f6]">
                                {job.company}
                              </span>
                              <span className="text-[11px] font-mono text-[#4f46e5] dark:text-[#818cf8]">
                                {job.period}
                              </span>
                            </div>
                            <p className="text-xs text-[#475569] dark:text-[#94a3b8]">
                              {arJob ? arJob.role : job.role}
                            </p>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-[#64748b] shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </button>

                        {isOpen && (
                          <div className="border-t border-[#e5e7eb] dark:border-[#232838] px-4 py-4 space-y-3 bg-[#f8f9fb]/60 dark:bg-[#0e121b]/60">
                            <p className="text-[13px] leading-relaxed text-[#111827] dark:text-[#e2e8f0]">
                              {arJob ? arJob.summary : job.lede}
                            </p>
                            <ul className="space-y-1.5">
                              {job.points.map((pt) => (
                                <li
                                  key={pt}
                                  className="flex items-start gap-2 text-xs text-[#475569] dark:text-[#94a3b8]"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#4f46e5] shrink-0" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                            {job.projects && job.projects.length > 0 && (
                              <div className="pt-1 space-y-2">
                                <div className="text-[10px] font-mono uppercase tracking-wider text-[#4f46e5] dark:text-[#818cf8]">
                                  {t.caseLabels.keyHighlights}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {job.projects.map((p) => (
                                    <div
                                      key={p.name}
                                      className="rounded-xl border border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#131722] p-2.5"
                                    >
                                      <div className="text-xs font-bold text-[#111827] dark:text-[#f3f4f6]">
                                        {p.name}
                                      </div>
                                      <div className="text-[11px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                                        {p.summary}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                void sendPrompt(
                                  lang === 'ar'
                                    ? `أخبرني أكثر عن إنجازات أبو الخير في شركة ${job.company}.`
                                    : `Tell me more about Abouelkhair’s impact and shipped work at ${job.company}.`,
                                )
                              }
                              className="text-xs font-semibold text-[#4f46e5] dark:text-[#818cf8] hover:underline cursor-pointer"
                            >
                              {t.caseLabels.askAboutRole} →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* TAB 5: ABOUT, CAPABILITIES & ALL 16 PARTNERS */}
              {inspectorTab === 'about' && (
                <motion.div
                  key="stage-about"
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.24}}
                  className="thin-scroll flex-1 overflow-y-auto space-y-5 pr-1"
                >
                  <div className="sc-glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#4f46e5] dark:text-[#818cf8]">
                        {t.about.profileEyebrow}
                      </p>
                      <h3 className="text-lg font-extrabold text-[#111827] dark:text-[#f3f4f6]">
                        {t.name}
                      </h3>
                      <p className="text-[13px] leading-relaxed text-[#475569] dark:text-[#94a3b8]">
                        {t.about.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={onOpenCv}
                        className="sc-cta inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.openOfflineCv}</span>
                      </button>
                      <a
                        href={PROFILE.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="sc-glass inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-semibold"
                      >
                        <span>{t.linkedin}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                      {t.about.capabilitiesEyebrow}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {t.about.capabilities.map((cap, idx) => (
                        <div key={cap} className="sc-glass rounded-xl p-3.5 space-y-1">
                          <div className="text-[10px] font-mono text-[#4f46e5] dark:text-[#818cf8]">
                            0{idx + 1}
                          </div>
                          <div className="text-xs font-bold text-[#111827] dark:text-[#f3f4f6]">
                            {cap}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                      {t.about.partnersEyebrow}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {PARTNERS.map((partner) => (
                        <div
                          key={partner.id}
                          className={`sc-glass flex h-16 items-center justify-center rounded-xl px-3 py-2 ${
                            partner.darkBg
                              ? '!bg-[#0b0e14] dark:!bg-[#0b0e14] border-[#334155]'
                              : ''
                          }`}
                        >
                          {partner.logo ? (
                            <div
                              className={`flex items-center justify-center w-full h-full rounded-lg px-2 ${
                                partner.darkBg ? '' : 'dark:bg-white/95 dark:py-1'
                              }`}
                            >
                              <ResilientImage
                                src={partner.logo}
                                alt={partner.name}
                                className="max-h-8 w-auto max-w-[120px] object-contain"
                              />
                            </div>
                          ) : (
                            <span
                              className="text-xs font-bold tracking-tight truncate"
                              style={{color: partner.accent || '#4f46e5'}}
                            >
                              {partner.wordmark || partner.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </section>
  );
}
