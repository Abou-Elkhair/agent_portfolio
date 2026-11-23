import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  ArrowUpRight,
  FileText,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import {CASE_STUDIES, CaseSlug} from '../data/portfolioData';
import {Lang, UI_COPY} from '../data/i18n';

interface PortfolioChatbotProps {
  lang: Lang;
  activeCaseSlug: CaseSlug | null;
  open: boolean;
  onToggleOpen: (open: boolean) => void;
  onSelectCase: (slug: CaseSlug) => void;
  onOpenCv: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedCaseSlugs?: CaseSlug[];
  suggestCv?: boolean;
  recommendedQuestions?: string[];
  isError?: boolean;
  retryPrompt?: string;
}

export function PortfolioChatbot({
  lang,
  activeCaseSlug,
  open,
  onToggleOpen,
  onSelectCase,
  onOpenCv,
}: PortfolioChatbotProps) {
  const t = UI_COPY[lang];
  const activeCase = CASE_STUDIES.find((c) => c.slug === activeCaseSlug) || null;
  const welcomeContent = activeCase
    ? lang === 'ar'
      ? `اسأل أي شيء عن مشروع ${activeCase.title} أو بقية أعمال أبو الخير. كل الإجابات موثقة من بيانات البورتفوليو.`
      : `Ask anything about ${activeCase.title} (${activeCase.domain}) or Abouelkhair’s broader portfolio.`
    : t.agentSubtitleIdle;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: welcomeContent,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: `welcome-${activeCaseSlug || 'home'}-${lang}`,
        role: 'assistant',
        content: welcomeContent,
      },
    ]);
  }, [activeCaseSlug, lang, welcomeContent]);

  useEffect(() => {
    if (open) {
      scrollEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggleOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onToggleOpen]);

  const starterPrompts = activeCase
    ? lang === 'ar'
      ? [
          `ما هي مشكلة تجربة المستخدم الأساسية في ${activeCase.title}؟`,
          `لخّص نتائج البحث والاستراتيجية في ${activeCase.title}`,
          `كيف يرتبط مشروع ${activeCase.title} بمسيرته المهنية؟`,
        ]
      : [
          `What was the core UX problem in ${activeCase.title}?`,
          `Summarize the research findings and strategy for ${activeCase.title}`,
          `How does ${activeCase.title} connect to his overall career?`,
        ]
    : [];

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = nextMessages
        .filter((m) => !m.id.startsWith('welcome') && !m.isError)
        .map((m) => ({role: m.role, content: m.content}));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          messages: apiMessages,
          caseContext: activeCaseSlug,
          lang,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.error === 'string'
            ? data.error
            : `Request failed (${res.status})`,
        );
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          typeof data.reply === 'string'
            ? data.reply
            : 'No response returned from the portfolio assistant.',
        relatedCaseSlugs: Array.isArray(data.relatedCaseSlugs)
          ? data.relatedCaseSlugs
          : [],
        suggestCv: Boolean(data.suggestCv),
        recommendedQuestions: Array.isArray(data.recommendedQuestions)
          ? data.recommendedQuestions
          : [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorText =
        err instanceof Error
          ? err.message
          : lang === 'ar'
            ? 'تعذر الاتصال بالمساعد حالياً.'
            : 'Unable to reach the portfolio assistant right now.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: errorText,
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
    void sendMessage(input);
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: welcomeContent,
      },
    ]);
    setInput('');
  };

  if (!activeCaseSlug) return null;

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="fixed bottom-5 end-5 z-40 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Case Study AI Assistant"
            initial={{opacity: 0, y: 18, scale: 0.94}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 16, scale: 0.94}}
            transition={{type: 'spring', stiffness: 320, damping: 28}}
            className="sc-glass-elevated flex h-[min(560px,calc(100vh-6rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#111520] px-4 py-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4f46e5] text-white">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[13px] font-bold text-[#111827] dark:text-[#f3f4f6] truncate">
                    {activeCase?.title || t.agentTitle}
                  </h2>
                  <p className="text-[11px] text-[#64748b] dark:text-[#94a3b8] truncate">
                    {t.agentSubtitleIdle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={resetChat}
                  aria-label={t.newBriefing}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] dark:border-[#232838] text-[#64748b] hover:text-[#4f46e5] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleOpen(false)}
                  aria-label="Close"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] dark:border-[#232838] text-[#64748b] hover:text-[#4f46e5] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="thin-scroll flex-1 overflow-y-auto px-3.5 py-4 space-y-3.5 bg-[#f8f9fb] dark:bg-[#0b0e14]">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                        isUser
                          ? 'sc-cta rounded-ee-sm text-white'
                          : msg.isError
                            ? 'border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-200'
                            : 'border border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#131722] text-[#111827] dark:text-[#f3f4f6] rounded-es-sm'
                      }`}
                    >
                      {msg.content}
                      {msg.isError && msg.retryPrompt && (
                        <div className="mt-2">
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => void sendMessage(msg.retryPrompt!)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/35 bg-white/80 dark:bg-[#111520] px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-200 hover:border-rose-500 cursor-pointer disabled:opacity-50"
                          >
                            <RotateCcw className="w-3 h-3" aria-hidden="true" />
                            <span>{t.retryLabel}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {!isUser &&
                      ((msg.relatedCaseSlugs && msg.relatedCaseSlugs.length > 0) ||
                        msg.suggestCv) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.relatedCaseSlugs
                            ?.filter((s) => s !== activeCaseSlug)
                            .map((slug) => {
                              const cs = CASE_STUDIES.find((c) => c.slug === slug);
                              if (!cs) return null;
                              return (
                                <button
                                  key={slug}
                                  type="button"
                                  onClick={() => onSelectCase(slug)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#4f46e5]/30 bg-[#eef2ff] dark:bg-[#1e1b4b] px-2.5 py-1 text-[11px] font-semibold text-[#4338ca] dark:text-[#c7d2fe] cursor-pointer"
                                >
                                  <span>{cs.title}</span>
                                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                                </button>
                              );
                            })}
                          {msg.suggestCv && (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenCv();
                                onToggleOpen(false);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#4f46e5]/30 bg-[#eef2ff] dark:bg-[#1e1b4b] px-2.5 py-1 text-[11px] font-semibold text-[#4338ca] dark:text-[#c7d2fe] cursor-pointer"
                            >
                              <FileText className="w-3 h-3" aria-hidden="true" />
                              <span>{t.offlineCv}</span>
                            </button>
                          )}
                        </div>
                      )}

                    {!isUser &&
                      msg.recommendedQuestions &&
                      msg.recommendedQuestions.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1 w-full">
                          {msg.recommendedQuestions.map((rec) => (
                            <button
                              key={rec}
                              type="button"
                              disabled={loading}
                              onClick={() => void sendMessage(rec)}
                              className="rounded-lg border border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#131722] px-2.5 py-1.5 text-start text-[11px] font-medium text-[#3730a3] dark:text-[#c7d2fe] hover:border-[#4f46e5] cursor-pointer disabled:opacity-50"
                            >
                              {rec}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}

              {messages.length === 1 && !loading && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                    {t.starterHeading}
                  </p>
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="w-full rounded-xl border border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#131722] px-3 py-2 text-start text-xs font-medium text-[#111827] dark:text-[#f3f4f6] hover:border-[#4f46e5] cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="rounded-xl border border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#131722] px-3 py-2 text-[11px] font-mono text-[#4f46e5] dark:text-[#818cf8]">
                  {t.searchingLabel}
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-[#e5e7eb] dark:border-[#232838] bg-[#ffffff] dark:bg-[#111520] p-3"
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
                className="flex-1 rounded-xl border border-[#e5e7eb] dark:border-[#2a3042] bg-[#f8f9fb] dark:bg-[#0b0e14] px-3 py-2 text-[13px] text-[#111827] dark:text-[#f3f4f6] focus:border-[#4f46e5] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t.sendLabel}
                className="sc-cta inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl disabled:opacity-45 cursor-pointer"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => onToggleOpen(!open)}
        className="sc-cta inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        <span>
          {t.askAiAboutCase} {activeCase?.title}
        </span>
      </button>
    </div>
  );
}
