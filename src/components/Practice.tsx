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
    // 'small' — füzetsor stílus, többszörös ismétlés
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
    if (!r) return;
    if (!r.hasInk) return;
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

  const handleSpeak = () => speak(current);

  return (
    <div className="min-h-full flex flex-col p-3 sm:p-6">
      <header className="flex items-center justify-between gap-3 mb-3">
        <button
          onClick={onBack}
          className="rounded-full bg-white ring-2 ring-amber-200 px-4 py-2 text-base font-semibold text-amber-700 active:scale-95"
        >
          ← Vissza
        </button>
        <div className="text-center">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-base font-bold text-slate-700">
            {index + 1} / {items.length}
          </div>
        </div>
        <button
          onClick={handleSpeak}
          className="rounded-full bg-white ring-2 ring-amber-200 px-4 py-2 text-base font-semibold text-amber-700 active:scale-95"
          title="Hallgasd meg"
        >
          🔊 Hang
        </button>
      </header>

      <div className="flex justify-center mb-2">
        <SizeToggle value={size} onChange={setSize} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-full flex justify-center">
          <WritingCanvas
            ref={canvasRef}
            template={current}
            width={width}
            height={height}
            repeat={repeat}
          />
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => canvasRef.current?.undo()}
            className="rounded-2xl bg-white ring-2 ring-slate-300 px-5 py-3 text-base font-semibold text-slate-700 active:scale-95"
          >
            ↶ Vissza
          </button>
          <button
            onClick={() => canvasRef.current?.clear()}
            className="rounded-2xl bg-white ring-2 ring-slate-300 px-5 py-3 text-base font-semibold text-slate-700 active:scale-95"
          >
            🧽 Törlés
          </button>
          <button
            onClick={handleEvaluate}
            className="rounded-2xl bg-emerald-500 ring-2 ring-emerald-600 px-6 py-3 text-base font-bold text-white active:scale-95 shadow"
          >
            ✓ Kész!
          </button>
        </div>
      </div>

      <nav className="flex justify-between items-center pt-3">
        <button
          onClick={handlePrev}
          className="rounded-full bg-amber-100 ring-2 ring-amber-300 px-5 py-3 text-base font-bold text-amber-800 active:scale-95"
        >
          ← Előző
        </button>
        <div
          className="text-3xl text-slate-500 tracking-wide"
          style={{ fontFamily: '"Playwrite HU", cursive' }}
        >
          {current}
        </div>
        <button
          onClick={handleNext}
          className="rounded-full bg-amber-100 ring-2 ring-amber-300 px-5 py-3 text-base font-bold text-amber-800 active:scale-95"
        >
          Következő →
        </button>
      </nav>

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

function SizeToggle({
  value,
  onChange,
}: {
  value: Size;
  onChange: (v: Size) => void;
}) {
  const base =
    'px-5 py-2 text-sm font-bold rounded-full transition active:scale-95';
  return (
    <div className="inline-flex bg-white ring-2 ring-amber-200 rounded-full p-1 gap-1">
      <button
        onClick={() => onChange('big')}
        className={`${base} ${
          value === 'big'
            ? 'bg-amber-500 text-white shadow'
            : 'text-amber-700'
        }`}
      >
        Nagy
      </button>
      <button
        onClick={() => onChange('small')}
        className={`${base} ${
          value === 'small'
            ? 'bg-amber-500 text-white shadow'
            : 'text-amber-700'
        }`}
      >
        Kicsi (sor)
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
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="flex justify-center mb-3">
          <Stars count={result.stars} />
        </div>
        <div className="text-3xl font-extrabold text-slate-800 mb-1">
          {ENCOURAGEMENT[result.stars]}
        </div>
        <div className="text-slate-500 mb-6">
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
