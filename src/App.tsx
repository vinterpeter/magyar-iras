import { useState } from 'react';
import { Menu } from './components/Menu';
import { Practice } from './components/Practice';

export type Mode = 'letter' | 'word';

type Selection = {
  mode: Mode;
  items: string[];
  label: string;
};

export default function App() {
  const [sel, setSel] = useState<Selection | null>(null);

  if (!sel) {
    return (
      <Menu
        onPick={(mode, items, label) => setSel({ mode, items, label })}
      />
    );
  }

  return (
    <Practice
      mode={sel.mode}
      items={sel.items}
      label={sel.label}
      onBack={() => setSel(null)}
    />
  );
}
