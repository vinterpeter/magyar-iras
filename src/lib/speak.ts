let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined;

function pickHungarianVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    cachedVoice = null;
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  const hu = voices.find(v => v.lang?.toLowerCase().startsWith('hu'));
  cachedVoice = hu ?? null;
  return cachedVoice;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // voices load asynchronously
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = undefined;
  };
}

export function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'hu-HU';
    u.rate = 0.85;
    const v = pickHungarianVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}
