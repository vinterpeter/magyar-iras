import { LESSONS, FULL_ALPHABET, VOWELS, COMMON_WORDS } from '../data/lessons';
import type { Mode } from '../App';

type Props = {
  onPick: (mode: Mode, items: string[], label: string) => void;
};

export function Menu({ onPick }: Props) {
  return (
    <div className="min-h-full px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto">
      <header className="mb-4 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-700 tracking-tight">
          Magyar írás <span className="text-amber-500">·</span> Zéténynek
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Válassz egy leckét, és gyakorolj!
        </p>
      </header>

      <section className="mb-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Gyors gyakorlás
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <QuickCard
            color="bg-amber-100 ring-amber-300"
            title="Magánhangzók"
            sample="a á e é i…"
            onClick={() => onPick('letter', VOWELS, 'Magánhangzók')}
          />
          <QuickCard
            color="bg-violet-100 ring-violet-300"
            title="Teljes ábécé"
            sample="a á b c cs…"
            onClick={() => onPick('letter', FULL_ALPHABET, 'Teljes ábécé')}
          />
          <QuickCard
            color="bg-emerald-100 ring-emerald-300"
            title="Vegyes szavak"
            sample="mama · alma…"
            onClick={() => onPick('word', COMMON_WORDS, 'Vegyes szavak')}
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Leckék <span className="font-normal lowercase text-slate-400">— Betűbarangoló</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {LESSONS.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onPickLetters={() =>
                onPick('letter', lesson.letters, lesson.title)
              }
              onPickWords={() =>
                onPick('word', lesson.words, lesson.title)
              }
            />
          ))}
        </div>
      </section>

      <footer className="mt-6 text-center text-xs text-slate-400">
        Toll vagy ujj — rajzold át a halvány betűt a vonalrendszerben!
      </footer>
    </div>
  );
}

function QuickCard({
  color,
  title,
  sample,
  onClick,
}: {
  color: string;
  title: string;
  sample: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl ring-2 px-3 py-2 transition active:scale-95 ${color}`}
    >
      <div className="text-xs sm:text-sm font-bold text-slate-700 truncate">
        {title}
      </div>
      <div className="text-xs text-slate-500 truncate mt-0.5">{sample}</div>
    </button>
  );
}

function LessonCard({
  lesson,
  onPickLetters,
  onPickWords,
}: {
  lesson: { title: string; letters: string[]; words: string[]; pages: string };
  onPickLetters: () => void;
  onPickWords: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white ring-2 ring-sky-200 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className="text-xl sm:text-2xl text-slate-600 truncate"
          style={{ fontFamily: '"Playwrite HU", cursive' }}
        >
          {lesson.letters.join(' ')}
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-bold text-slate-700">{lesson.title.split(' – ')[0]}</div>
          <div className="text-[10px] text-slate-400">{lesson.pages}. o.</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPickLetters}
          className="flex-1 rounded-xl bg-sky-100 ring-2 ring-sky-300 px-2 py-1.5 text-xs sm:text-sm font-bold text-sky-800 active:scale-95"
        >
          Betűk · {lesson.letters.length}
        </button>
        <button
          onClick={onPickWords}
          className="flex-1 rounded-xl bg-emerald-100 ring-2 ring-emerald-300 px-2 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 active:scale-95"
        >
          Szavak · {lesson.words.length}
        </button>
      </div>
    </div>
  );
}
