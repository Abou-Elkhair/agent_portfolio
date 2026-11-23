import {useEffect} from 'react';
import {Download, X} from 'lucide-react';
import {PROFILE} from '../data/portfolioData';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CvModal({isOpen, onClose}: CvModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Abouelkhair Rady Offline Curriculum Vitae"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030208]/75 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="sc-glass-elevated flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-950/10 dark:border-[#9093bd]/15 bg-white/95 dark:bg-[#08061c]/95 px-6 py-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
              Offline Document · PDF
            </p>
            <h2 className="text-lg font-extrabold text-[#0f0e24] dark:text-[#f4f5ff]">
              {PROFILE.name} — Curriculum Vitae
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={PROFILE.cvUrl}
              download="Abouelkhair-Rady-Mohamed-CV.pdf"
              className="sc-cta inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download PDF</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close CV viewer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-950/15 dark:border-[#9093bd]/25 bg-white dark:bg-[#0b0463]/40 text-[#0f0e24] dark:text-[#f4f5ff] hover:border-[#5452c1] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#e9ebfb] dark:bg-[#050313]">
          <iframe
            src={PROFILE.cvUrl}
            title="Abouelkhair Rady Curriculum Vitae PDF"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
