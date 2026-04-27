import { LOWERCASE_GROUPS, UPPERCASE_GROUPS } from '../data/letters';
import { WORD_GROUPS } from '../data/words';
import type { Mode } from '../App';

type Props = {
  onPick: (mode: Mode, items: string[], label: string) => void;
};

export function Menu({ onPick }: Props) {
  return (
    <div className="min-h-full p-6 sm:p-10 max-w-5xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-700 tracking-tight">
          Magyar írás
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Szia Zétény! Válassz, mit gyakorolsz!
        </p>
      </header>

      <Section title="Kisbetűk">
        {LOWERCASE_GROUPS.map(g => (
          <Card
            key={g.id}
            title={g.title}
            count={g.letters.length}
            sample={g.letters.slice(0, 5).join(' ')}
            color="bg-rose-100 ring-rose-300 hover:bg-rose-200"
            onClick={() => onPick('letter', g.letters, g.title)}
          />
        ))}
      </Section>

      <Section title="Nagybetűk">
        {UPPERCASE_GROUPS.map(g => (
          <Card
            key={g.id}
            title={g.title}
            count={g.letters.length}
            sample={g.letters.slice(0, 5).join(' ')}
            color="bg-sky-100 ring-sky-300 hover:bg-sky-200"
            onClick={() => onPick('letter', g.letters, g.title)}
          />
        ))}
      </Section>

      <Section title="Szavak">
        {WORD_GROUPS.map(g => (
          <Card
            key={g.id}
            title={g.title}
            count={g.words.length}
            sample={g.words.slice(0, 3).join(' • ')}
            color="bg-emerald-100 ring-emerald-300 hover:bg-emerald-200"
            onClick={() => onPick('word', g.words, g.title)}
          />
        ))}
      </Section>

      <footer className="mt-10 text-center text-sm text-slate-400">
        Toll vagy ujj — rajzold át a halvány betűket!
      </footer>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-slate-700 mb-3 px-1">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </section>
  );
}

function Card({
  title,
  sample,
  count,
  color,
  onClick,
}: {
  title: string;
  sample: string;
  count: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-3xl ring-2 p-5 transition active:scale-95 ${color}`}
    >
      <div className="text-lg font-bold text-slate-800">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{count} elem</div>
      <div className="mt-3 font-bold text-2xl text-slate-700 truncate">
        {sample}
      </div>
    </button>
  );
}
