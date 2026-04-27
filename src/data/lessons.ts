export type Lesson = {
  id: string;
  title: string;
  letters: string[];
  words: string[];
  pages: string;
};

// Tanítási sorrend a Betűbarangoló (OH-MIR01MA2) munkafüzet alapján.
export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: '1. – a, i, í',
    letters: ['a', 'i', 'í'],
    words: ['ia', 'ai', 'ami', 'ima'],
    pages: '3–5',
  },
  {
    id: 'l2',
    title: '2. – m, l',
    letters: ['m', 'l'],
    words: ['ma', 'mi', 'la', 'li', 'il', 'lim', 'am', 'im'],
    pages: '6–9',
  },
  {
    id: 'l3',
    title: '3. – o, ó, e',
    letters: ['o', 'ó', 'e'],
    words: ['ól', 'ló', 'lom', 'olló', 'em', 'me', 'le', 'elem', 'alma', 'alom'],
    pages: '10–15',
  },
  {
    id: 'l4',
    title: '4. – t, z',
    letters: ['t', 'z'],
    words: ['ott', 'itt', 'olt', 'tó', 'toll', 'tol', 'az', 'ez', 'mez', 'tíz', 'izzó'],
    pages: '16–19',
  },
  {
    id: 'l5',
    title: '5. – n, s',
    letters: ['n', 's'],
    words: ['nem', 'on', 'ont', 'enni', 'sas', 'is', 'só', 'esti', 'mese'],
    pages: '20–25',
  },
  {
    id: 'l6',
    title: '6. – k, á, p',
    letters: ['k', 'á', 'p'],
    words: ['aki', 'neki', 'kos', 'tál', 'lát', 'lap', 'kap', 'pata', 'póló', 'kapa', 'lepke', 'pók'],
    pages: '26–33',
  },
  {
    id: 'l7',
    title: '7. – u, ú, j',
    letters: ['u', 'ú', 'j'],
    words: ['út', 'tűr', 'apu', 'kapu', 'kút', 'puma', 'jó', 'ujj', 'jut', 'sajt', 'utazó'],
    pages: '34–39',
  },
  {
    id: 'l8',
    title: '8. – sz, é, v',
    letters: ['sz', 'é', 'v'],
    words: ['szó', 'szól', 'szem', 'szín', 'tesz', 'él', 'néz', 'méz', 'év', 'éves', 'új', 'vasút'],
    pages: '40–45',
  },
  {
    id: 'l9',
    title: '9. – c, h',
    letters: ['c', 'h'],
    words: ['cél', 'cica', 'vaj', 'levél', 'zene', 'hat', 'méh', 'hét', 'ház'],
    pages: '46–51',
  },
  {
    id: 'l10',
    title: '10. – ö, ő, d, r',
    letters: ['ö', 'ő', 'd', 'r'],
    words: ['öl', 'lő', 'jön', 'de', 'dél', 'dió', 'dal', 'híd', 'medve', 'arat', 'erre', 'arra', 'lassú'],
    pages: '52–59',
  },
  {
    id: 'l11',
    title: '11. – ü, ű, f, g',
    letters: ['ü', 'ű', 'f', 'g'],
    words: ['ül', 'sült', 'szűrő', 'fűr', 'kefe', 'fül', 'kifli', 'gól', 'zúg', 'zöld', 'virág'],
    pages: '60–65',
  },
  {
    id: 'l12',
    title: '12. – ny, cs, b',
    letters: ['ny', 'cs', 'b'],
    words: ['nyúl', 'nyel', 'ennyi', 'csibe', 'csacsi', 'meccs', 'baba', 'bab', 'borsó', 'bögre'],
    pages: '66–71',
  },
  {
    id: 'l13',
    title: '13. – ty, zs, gy',
    letters: ['ty', 'zs', 'gy'],
    words: ['tyúk', 'ponty', 'atya', 'konty', 'zsír', 'rozs', 'pezsgő', 'gyík', 'hegy', 'meggy', 'galamb', 'hangya'],
    pages: '72–77',
  },
  {
    id: 'l14',
    title: '14. – dzs, ly, dz',
    letters: ['dzs', 'ly', 'dz'],
    words: ['dzsungel', 'lándzsa', 'nindzsa', 'lyuk', 'gally', 'ibolya', 'edz', 'edző', 'bodza', 'madzag'],
    pages: '80–87',
  },
  {
    id: 'l15',
    title: '15. – x, q, w, y',
    letters: ['x', 'q', 'w', 'y'],
    words: ['maxi', 'foxi', 'quartett', 'web', 'watt', 'yard'],
    pages: '88–89',
  },
];

export const FULL_ALPHABET = [
  'a', 'á', 'b', 'c', 'cs', 'd', 'dz', 'dzs', 'e', 'é',
  'f', 'g', 'gy', 'h', 'i', 'í', 'j', 'k', 'l', 'ly',
  'm', 'n', 'ny', 'o', 'ó', 'ö', 'ő', 'p', 'q', 'r',
  's', 'sz', 't', 'ty', 'u', 'ú', 'ü', 'ű', 'v', 'w',
  'x', 'y', 'z', 'zs',
];

export const VOWELS = ['a', 'á', 'e', 'é', 'i', 'í', 'o', 'ó', 'ö', 'ő', 'u', 'ú', 'ü', 'ű'];

export const COMMON_WORDS = [
  'mama', 'papa', 'apa', 'anya', 'baba', 'cica', 'kutya',
  'alma', 'körte', 'banán', 'eper',
  'ház', 'fa', 'kéz', 'láb', 'fej', 'szem',
  'nap', 'hold', 'csillag', 'felhő',
  'piros', 'kék', 'zöld', 'sárga',
  'egy', 'kettő', 'három', 'öt', 'tíz',
];
