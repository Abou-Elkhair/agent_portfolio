import {useEffect} from 'react';
import {ChevronLeft, ChevronRight, X} from 'lucide-react';
import {ScreenSlide} from '../data/portfolioData';
import {ResilientImage} from './ResilientImage';

interface LightboxModalProps {
  items: ScreenSlide[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}

export function LightboxModal({
  items,
  activeIndex,
  onChangeIndex,
  onClose,
}: LightboxModalProps) {
  const active = items[activeIndex];

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && items.length > 1) {
        onChangeIndex((activeIndex + 1) % items.length);
      }
      if (e.key === 'ArrowLeft' && items.length > 1) {
        onChangeIndex((activeIndex - 1 + items.length) % items.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, activeIndex, items.length, onChangeIndex, onClose]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={active.title || active.alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030208]/85 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="sc-glass-elevated relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-indigo-950/10 dark:border-[#9093bd]/15 bg-white/95 dark:bg-[#08061c]/95 px-6 py-4">
          <div className="min-w-0">
            {active.product && (
              <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#5452c1] dark:text-[#9093bd]">
                {active.product}
              </p>
            )}
            <h3 className="text-base sm:text-lg font-extrabold text-[#0f0e24] dark:text-[#f4f5ff] truncate">
              {active.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[#4c4e75] dark:text-[#9093bd] tabular-nums pr-2">
              {activeIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close screen preview"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-950/15 dark:border-[#9093bd]/25 bg-white dark:bg-[#0b0463]/40 text-[#0f0e24] dark:text-[#f4f5ff] hover:border-[#5452c1] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-auto bg-[#e9ebfb]/70 dark:bg-[#050313] p-6 sm:p-10">
          {items.length > 1 && (
            <button
              type="button"
              onClick={() =>
                onChangeIndex((activeIndex - 1 + items.length) % items.length)
              }
              aria-label="Previous screen"
              className="sc-glass absolute left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#0f0e24] dark:text-[#f4f5ff] hover:border-[#5452c1] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <ResilientImage
            src={active.src}
            alt={active.alt}
            loading="eager"
            className="max-h-[68vh] w-auto max-w-full rounded-2xl object-contain shadow-[0_24px_60px_rgba(11,4,99,0.3)]"
          />

          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
              aria-label="Next screen"
              className="sc-glass absolute right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#0f0e24] dark:text-[#f4f5ff] hover:border-[#5452c1] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {active.caption && (
          <div className="border-t border-indigo-950/10 dark:border-[#9093bd]/15 bg-white/95 dark:bg-[#08061c]/95 px-6 py-3.5 text-center text-xs sm:text-sm text-[#4c4e75] dark:text-[#9093bd]">
            {active.caption}
          </div>
        )}
      </div>
    </div>
  );
}
