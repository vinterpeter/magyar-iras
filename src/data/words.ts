export type WordGroup = {
  id: string;
  title: string;
  words: string[];
};

export const WORD_GROUPS: WordGroup[] = [
  {
    id: 'csalad',
    title: 'Család',
    words: ['anya', 'apa', 'baba', 'mama', 'papa', 'nagyi'],
  },
  {
    id: 'allatok',
    title: 'Állatok',
    words: ['kutya', 'cica', 'hal', 'madár', 'béka', 'ló', 'nyúl', 'méh'],
  },
  {
    id: 'gyumolcs',
    title: 'Gyümölcsök',
    words: ['alma', 'körte', 'banán', 'szilva', 'eper', 'dinnye'],
  },
  {
    id: 'szamok',
    title: 'Számok',
    words: ['egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc', 'tíz'],
  },
  {
    id: 'szinek',
    title: 'Színek',
    words: ['piros', 'kék', 'zöld', 'sárga', 'fehér', 'fekete', 'lila', 'barna'],
  },
  {
    id: 'mindennapi',
    title: 'Mindennap',
    words: ['ház', 'fa', 'kéz', 'láb', 'fej', 'szem', 'autó', 'iskola', 'könyv', 'toll'],
  },
];
