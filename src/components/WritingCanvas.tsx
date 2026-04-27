import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

export type EvalResult = {
  coverage: number;
  outside: number;
  score: number;
  stars: number;
  hasInk: boolean;
};

export type WritingCanvasHandle = {
  clear: () => void;
  undo: () => void;
  evaluate: () => EvalResult;
};

type Point = { x: number; y: number; pressure: number };
type Stroke = Point[];

type Props = {
  template: string;
  width: number;
  height: number;
  repeat?: number;
};

// Vonalrendszer: 4 zóna függőlegesen, mint a Betűbarangolóban
const TOP_RATIO = 0.10;        // felső segédvonal (felszárak teteje)
const X_HEIGHT_RATIO = 0.42;   // x-magasság (kis kerek betűk teteje)
const BASELINE_RATIO = 0.72;   // alapvonal
const BOTTOM_RATIO = 0.96;     // alsó segédvonal (alszárak alja)

// Playwrite HU em-arányok (becsült)
const FONT_ASC_FRACTION = 0.72;   // felszár / em (cap height + ascender)
const FONT_DESC_FRACTION = 0.30;  // alszár / em

const TEMPLATE_COLOR = '#bfdbfe';     // halvány kék — mint a könyvben
const INK_COLOR = '#1e3a8a';          // sötétkék toll
const ALPHA_THRESHOLD = 30;
const FONT_FAMILY = '"Playwrite HU", "Playwrite Magyarország", cursive';

export const WritingCanvas = forwardRef<WritingCanvasHandle, Props>(
  function WritingCanvas({ template, width, height, repeat = 1 }, ref) {
    const linesRef = useRef<HTMLCanvasElement | null>(null);
    const templateRef = useRef<HTMLCanvasElement | null>(null);
    const userRef = useRef<HTMLCanvasElement | null>(null);
    const strokesRef = useRef<Stroke[]>([]);
    const currentStrokeRef = useRef<Stroke | null>(null);

    const renderLines = () => {
      const c = linesRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const topY = Math.round(height * TOP_RATIO);
      const xHeightY = Math.round(height * X_HEIGHT_RATIO);
      const baselineY = Math.round(height * BASELINE_RATIO);
      const bottomY = Math.round(height * BOTTOM_RATIO);
      const margin = 16;

      // x-magasság vonal (szaggatott halvány)
      ctx.setLineDash([6, 8]);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(margin, xHeightY);
      ctx.lineTo(width - margin, xHeightY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Felső segédvonal
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin, topY);
      ctx.lineTo(width - margin, topY);
      ctx.stroke();

      // Alapvonal (vastagabb, hangsúlyos)
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(margin, baselineY);
      ctx.lineTo(width - margin, baselineY);
      ctx.stroke();

      // Alsó segédvonal
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin, bottomY);
      ctx.lineTo(width - margin, bottomY);
      ctx.stroke();
    };

    const renderTemplate = async () => {
      const c = templateRef.current;
      if (!c) return;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const baselineY = Math.round(height * BASELINE_RATIO);
      const ascenderZone = (BASELINE_RATIO - TOP_RATIO) * height;
      const descenderZone = (BOTTOM_RATIO - BASELINE_RATIO) * height;

      // Olyan méret, hogy MIND a felszár (felső segédvonalig), MIND az alszár
      // (alsó segédvonalig) beférjen — a kisebbik dimenzió döntse el.
      let fontSize = Math.floor(
        Math.min(
          ascenderZone / FONT_ASC_FRACTION,
          descenderZone / FONT_DESC_FRACTION,
        ),
      );

      try {
        await document.fonts.load(`400 ${fontSize}px "Playwrite HU"`);
      } catch {
        /* nem fatális */
      }

      ctx.font = `400 ${fontSize}px ${FONT_FAMILY}`;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'center';

      // Vízszintes elhelyezés: ismétlés esetén több slot, egyébként egy slot középre
      const margin = 24;
      const slots = Math.max(1, repeat);
      const slotWidth = (width - margin * 2) / slots;

      // Ha túl széles a sablon a slothoz, kicsinyítjük
      let measured = ctx.measureText(template).width;
      const maxSlotWidth = slotWidth * 0.85;
      if (measured > maxSlotWidth) {
        fontSize = Math.floor((fontSize * maxSlotWidth) / measured);
        ctx.font = `400 ${fontSize}px ${FONT_FAMILY}`;
      }

      ctx.fillStyle = TEMPLATE_COLOR;
      for (let i = 0; i < slots; i++) {
        const x = margin + slotWidth * (i + 0.5);
        ctx.fillText(template, x, baselineY);
      }
    };

    const renderUserStrokes = () => {
      const c = userRef.current;
      if (!c) return;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = INK_COLOR;
      ctx.fillStyle = INK_COLOR;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (const stroke of strokesRef.current) {
        if (stroke.length === 0) continue;
        if (stroke.length === 1) {
          const p = stroke[0];
          const r = 8 + (p.pressure || 0.5) * 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        for (let i = 1; i < stroke.length; i++) {
          const a = stroke[i - 1];
          const b = stroke[i];
          const avgPressure = ((a.pressure || 0.5) + (b.pressure || 0.5)) / 2;
          ctx.lineWidth = 12 + avgPressure * 14;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    };

    useEffect(() => {
      renderLines();
      void renderTemplate();
      renderUserStrokes();
      // re-render template once fonts are loaded (in case it loaded during initial render)
      const onFontsLoaded = () => void renderTemplate();
      document.fonts.addEventListener('loadingdone', onFontsLoaded);
      return () => {
        document.fonts.removeEventListener('loadingdone', onFontsLoaded);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template, width, height, repeat]);

    const toCanvasCoords = (e: React.PointerEvent) => {
      const c = userRef.current!;
      const r = c.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) * width) / r.width,
        y: ((e.clientY - r.top) * height) / r.height,
        pressure: e.pressure > 0 ? e.pressure : 0.5,
      };
    };

    const onPointerDown = (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      const p = toCanvasCoords(e);
      const stroke: Stroke = [p];
      strokesRef.current.push(stroke);
      currentStrokeRef.current = stroke;
      renderUserStrokes();
    };

    const onPointerMove = (e: React.PointerEvent) => {
      if (!currentStrokeRef.current) return;
      e.preventDefault();
      const p = toCanvasCoords(e);
      currentStrokeRef.current.push(p);
      renderUserStrokes();
    };

    const onPointerUp = () => {
      currentStrokeRef.current = null;
    };

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          strokesRef.current = [];
          currentStrokeRef.current = null;
          renderUserStrokes();
        },
        undo: () => {
          strokesRef.current.pop();
          currentStrokeRef.current = null;
          renderUserStrokes();
        },
        evaluate: () => {
          const tCtx = templateRef.current!.getContext('2d')!;
          const uCtx = userRef.current!.getContext('2d')!;
          const tData = tCtx.getImageData(0, 0, width, height).data;
          const uData = uCtx.getImageData(0, 0, width, height).data;
          let templatePx = 0;
          let userPx = 0;
          let intersection = 0;
          let outside = 0;
          for (let i = 3; i < tData.length; i += 4) {
            const tOn = tData[i] > ALPHA_THRESHOLD;
            const uOn = uData[i] > ALPHA_THRESHOLD;
            if (tOn) templatePx++;
            if (uOn) userPx++;
            if (tOn && uOn) intersection++;
            else if (uOn) outside++;
          }
          const coverage = templatePx > 0 ? intersection / templatePx : 0;
          const outsideRatio = userPx > 0 ? outside / userPx : 0;
          const rawScore = coverage * 140 - outsideRatio * 50;
          const score = Math.max(0, Math.min(100, Math.round(rawScore)));
          const stars =
            score >= 90 ? 4 : score >= 70 ? 3 : score >= 45 ? 2 : 1;
          return {
            coverage,
            outside: outsideRatio,
            score,
            stars,
            hasInk: userPx > 50,
          };
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [width, height],
    );

    return (
      <div
        className="relative rounded-3xl bg-white shadow-md ring-2 ring-amber-200 overflow-hidden"
        style={{
          width: '100%',
          aspectRatio: `${width} / ${height}`,
          maxWidth: width,
          maxHeight: '100%',
          touchAction: 'none',
        }}
      >
        <canvas
          ref={linesRef}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <canvas
          ref={templateRef}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        <canvas
          ref={userRef}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>
    );
  },
);
