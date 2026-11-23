import {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, MotionConfig, motion} from 'motion/react';
import {CASE_STUDIES, CaseSlug, ScreenSlide} from './data/portfolioData';
import {Lang} from './data/i18n';
import {AgentWorkspace} from './components/AgentWorkspace';
import {CaseStudyView} from './components/CaseStudyView';
import {LightboxModal} from './components/LightboxModal';
import {CvModal} from './components/CvModal';
import {PortfolioChatbot} from './components/PortfolioChatbot';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [lang, setLang] = useState<Lang>('en');
  const [activeCaseSlug, setActiveCaseSlug] = useState<CaseSlug | null>(null);
  const [caseAiOpen, setCaseAiOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{
    items: ScreenSlide[];
    index: number;
  } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0b0e14' : '#f8f9fb');
    }
  }, [theme, lang]);

  const activeCase = useMemo(
    () => CASE_STUDIES.find((c) => c.slug === activeCaseSlug) || null,
    [activeCaseSlug],
  );

  const returnToAgent = () => {
    setActiveCaseSlug(null);
    setCaseAiOpen(false);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const openCase = (slug: CaseSlug) => {
    setActiveCaseSlug(slug);
    setCaseAiOpen(false);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const inspectScreens = (items: ScreenSlide[], index: number) => {
    setLightbox({items, index});
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#f8f9fb] dark:bg-[#0b0e14] text-[#111827] dark:text-[#f3f4f6]">
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeCase ? (
              <motion.div
                key={`case-${activeCase.slug}`}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
              >
                <CaseStudyView
                  study={activeCase}
                  lang={lang}
                  onBackHome={returnToAgent}
                  onSelectCase={openCase}
                  onInspectScreen={inspectScreens}
                  onOpenCaseAi={() => setCaseAiOpen(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="agent-studio"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.22}}
              >
                <AgentWorkspace
                  theme={theme}
                  lang={lang}
                  onChangeTheme={setTheme}
                  onChangeLang={setLang}
                  onSelectCase={openCase}
                  onInspectScreen={inspectScreens}
                  onOpenCv={() => setCvOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {lightbox && (
          <LightboxModal
            items={lightbox.items}
            activeIndex={lightbox.index}
            onChangeIndex={(index) =>
              setLightbox((prev) => (prev ? {...prev, index} : null))
            }
            onClose={() => setLightbox(null)}
          />
        )}

        <CvModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />

        <PortfolioChatbot
          lang={lang}
          activeCaseSlug={activeCaseSlug}
          open={caseAiOpen}
          onToggleOpen={setCaseAiOpen}
          onSelectCase={openCase}
          onOpenCv={() => setCvOpen(true)}
        />
      </div>
    </MotionConfig>
  );
}

export default App;
