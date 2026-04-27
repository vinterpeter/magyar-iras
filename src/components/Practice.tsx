import { useEffect, useMemo, useRef, useState } from 'react';
import { WritingCanvas, type WritingCanvasHandle, type EvalResult } from './WritingCanvas';
import { Stars } from './Stars';
import { speak } from '../lib/speak';
import type { Mode } from '../App';

type Props = {
  mode: Mode;
  items: string[];
  label: string;
  onBack: () => void;
};

const ENCOURAGEMENT: Record<number, string> = {
  4: 'Tökéletes! 🌟',
  3: 'Nagyon szép!',
  2: 'Ügyes vagy! Próbáld újra még szebben.',
  1: 'Próbáld újra, menni fog!',
};

type Size = 'big' | 'small';

export function Practice({ mode, items, label, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState<Size>('big');
  const [result, setResult] = useState<EvalResult | null>(null);
  const canvasRef = useRef<WritingCanvasHandle>(null);

  const current = items[index];

  const { width, height, repeat } = useMemo(() => {
    if (size === 'big') {
      if (mode === 'word') {
        const w = Math.min(1800, Math.max(800, current.length * 180 + 220));
        return { width: w, height: 460, repeat: 1 };
      }
      return { width: 600, height: 520, repeat: 1 };
    }
    if (mode === 'word') {
      const r = current.length <= 3 ? 4 : current.length <= 5 ? 3 : 2;
      return { width: 1500, height: 220, repeat: r };
    }
    return { width: 1500, height: 220, repeat: 6 };
  }, [mode, current, size]);

  useEffect(() => {
    setResult(null);
    canvasRef.current?.clear();
  }, [index, size]);

  const handleEvaluate = () => {
    const r = canvasRef.current?.evaluate();
    if (!r || !r.hasInk) return;
    setResult(r);
  };

  const handleNext = () => {
    setResult(null);
    canvasRef.current?.clear();
    setIndex(i => (i + 1) % items.length);
  };

  const handlePrev = () => {
    setResult(null);
    canvasRef.current?.clear();
    setIndex(i => (i - 1 + items.length) % items.length);
  };

  const handleRetry = () => {
    setResult(null);
    canvasRef.current?.clear();
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between gap-2 px-2 sm:px-4 py-2 shrink-0">
        <IconButton onClick={onBack} aria="Vissza a menübe">
          <span className="text-base">←</span>
          <span className="hidden sm:inline ml-1 font-semibold">Menü</span>
        </IconButton>

        <div className="flex items-center gap-3 min-w-0">
          <div className="text-center min-w-0">
            <div className="text-xs text-slate-500 truncate max-w-[40vw]">
              {label}
            </div>
            <div className="text-sm font-bold text-slate-700">
              {index + 1} / {items.length}
            </div>
          </div>
          <SizeToggle value={size} onChange={setSize} />
        </div>

        <IconButton onClick={() => speak(current)} aria="Hallgasd meg">
          <span className="text-base">🔊</span>
        </IconButton>
      </header>

      <main className="flex-1 flex items-center justify-center min-h-0 px-2">
        <WritingCanvas
          ref={canvasRef}
          template={current}
          width={width}
          height={height}
          repeat={repeat}
        />
      </main>

      <footer className="flex items-center justify-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 shrink-0 flex-wrap">
        <ToolBtn onClick={handlePrev} variant="amber">← Előző</ToolBtn>
        <ToolBtn onClick={() => canvasRef.current?.undo()} variant="slate">↶</ToolBtn>
        <ToolBtn onClick={() => canvasRef.current?.clear()} variant="slate">🧽</ToolBtn>
        <ToolBtn onClick={handleEvaluate} variant="emerald">✓ Kész!</ToolBtn>
        <ToolBtn onClick={handleNext} variant="amber">Következő →</ToolBtn>
      </footer>

      {result && (
        <ResultOverlay
          result={result}
          onRetry={handleRetry}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

function IconButton({
  onClick,
  children,
  aria,
}: {
  onClick: () => void;
  children: React.ReactNode;
  aria: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      className="shrink-0 rounded-full bg-white ring-2 ring-amber-200 px-3 py-2 text-amber-700 active:scale-95"
    >
      {children}
    </button>
  );
}

function ToolBtn({
  onClick,
  children,
  variant,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant: 'slate' | 'amber' | 'emerald';
}) {
  const styles: Record<typeof variant, string> = {
    slate:
      'bg-white ring-2 ring-slate-300 text-slate-700 px-3 py-2 text-sm sm:text-base',
    amber:
      'bg-amber-100 ring-2 ring-amber-300 text-amber-800 px-3 py-2 text-sm sm:text-base font-bold',
    emerald:
      'bg-emerald-500 ring-2 ring-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 text-base font-bold shadow',
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl active:scale-95 transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function SizeToggle({
  value,
  onChange,
}: {
  value: Size;
  onChange: (v: Size) => void;
}) {
  const base =
    'px-3 py-1 text-xs sm:text-sm font-bold rounded-full transition active:scale-95';
  return (
    <div className="inline-flex bg-white ring-2 ring-amber-200 rounded-full p-0.5 gap-0.5 shrink-0">
      <button
        onClick={() => onChange('big')}
        className={`${base} ${
          value === 'big' ? 'bg-amber-500 text-white shadow' : 'text-amber-700'
        }`}
      >
        Nagy
      </button>
      <button
        onClick={() => onChange('small')}
        className={`${base} ${
          value === 'small' ? 'bg-amber-500 text-white shadow' : 'text-amber-700'
        }`}
      >
        Sor
      </button>
    </div>
  );
}

function ResultOverlay({
  result,
  onRetry,
  onNext,
}: {
  result: EvalResult;
  onRetry: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
        <div className="flex justify-center mb-3">
          <Stars count={result.stars} />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1">
          {ENCOURAGEMENT[result.stars]}
        </div>
        <div className="text-slate-500 mb-5">
          Pontszám: <span className="font-bold text-slate-700">{result.score}</span>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="rounded-2xl bg-white ring-2 ring-slate-300 px-5 py-3 text-base font-semibold text-slate-700 active:scale-95"
          >
            🔁 Újra
          </button>
          <button
            onClick={onNext}
            className="rounded-2xl bg-emerald-500 ring-2 ring-emerald-600 px-6 py-3 text-base font-bold text-white active:scale-95 shadow"
          >
            Következő →
          </button>
        </div>
      </div>
    </div>
  );
}
