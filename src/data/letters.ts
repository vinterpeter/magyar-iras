export type LetterGroup = {
  id: string;
  title: string;
  letters: string[];
};

export const LOWERCASE_GROUPS: LetterGroup[] = [
  {
    id: 'magan',
    title: 'Magánhangzók',
    letters: ['a', 'á', 'e', 'é', 'i', 'í', 'o', 'ó', 'ö', 'ő', 'u', 'ú', 'ü', 'ű'],
  },
  {
    id: 'massalhangzo-egyszeru',
    title: 'Egyszerű mássalhangzók',
    letters: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z'],
  },
  {
    id: 'kettos',
    title: 'Kettős és hármas betűk',
    letters: ['cs', 'dz', 'dzs', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'],
  },
];

export const UPPERCASE_GROUPS: LetterGroup[] = [
  {
    id: 'magan-nagy',
    title: 'Magánhangzók',
    letters: ['A', 'Á', 'E', 'É', 'I', 'Í', 'O', 'Ó', 'Ö', 'Ő', 'U', 'Ú', 'Ü', 'Ű'],
  },
  {
    id: 'massalhangzo-nagy',
    title: 'Egyszerű mássalhangzók',
    letters: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'],
  },
  {
    id: 'kettos-nagy',
    title: 'Kettős és hármas betűk',
    letters: ['Cs', 'Dz', 'Dzs', 'Gy', 'Ly', 'Ny', 'Sz', 'Ty', 'Zs'],
  },
];
