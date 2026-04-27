import { LESSONS, FULL_ALPHABET, VOWELS, COMMON_WORDS } from '../data/lessons';
import type { Mode } from '../App';

type Props = {
  onPick: (mode: Mode, items: string[], label: string) => void;
};

export function Menu({ onPick }: Props) {
  return (
    <div className="min-h-full p-4 sm:p-8 max-w-5xl mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-amber-700 tracking-tight">
          Magyar írás
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600">
          Szia Zétény! Válassz egy leckét, és gyakorolj!
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-lg font-bold text-slate-700 mb-3 px-1">
          Gyors gyakorlás
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <QuickCard
            color="bg-amber-100 ring-amber-300"
            title="Magánhangzók"
            sample="a á e é i í"
            onClick={() => onPick('letter', VOWELS, 'Magánhangzók')}
          />
          <QuickCard
            color="bg-violet-100 ring-violet-300"
            title="Teljes ábécé"
            sample="a á b c cs d…"
            onClick={() => onPick('letter', FULL_ALPHABET, 'Teljes ábécé')}
          />
          <QuickCard
            color="bg-emerald-100 ring-emerald-300"
            title="Vegyes szavak"
            sample="mama • alma • ház"
            onClick={() => onPick('word', COMMON_WORDS, 'Vegyes szavak')}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-3 px-1">
          Leckék <span className="font-normal text-slate-400">(Betűbarangoló munkafüzet)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      <footer className="mt-10 text-center text-xs text-slate-400">
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
      className={`text-left rounded-2xl ring-2 p-4 transition active:scale-95 ${color}`}
    >
      <div className="text-sm font-bold text-slate-700">{title}</div>
      <div className="mt-1 text-sm text-slate-600 truncate">{sample}</div>
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
    <div className="rounded-3xl bg-white ring-2 ring-sky-200 p-4 shadow-sm">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-base font-bold text-slate-800">{lesson.title}</h3>
        <span className="text-xs text-slate-400">{lesson.pages}. oldal</span>
      </div>
      <div className="font-[Playwrite_HU] text-2xl text-slate-500 mb-3 truncate" style={{ fontFamily: '"Playwrite HU", cursive' }}>
        {lesson.letters.join(' ')}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPickLetters}
          className="flex-1 rounded-xl bg-sky-100 ring-2 ring-sky-300 px-3 py-2 text-sm font-bold text-sky-800 active:scale-95"
        >
          Betűk ({lesson.letters.length})
        </button>
        <button
          onClick={onPickWords}
          className="flex-1 rounded-xl bg-emerald-100 ring-2 ring-emerald-300 px-3 py-2 text-sm font-bold text-emerald-800 active:scale-95"
        >
          Szavak ({lesson.words.length})
        </button>
      </div>
    </div>
  );
}
