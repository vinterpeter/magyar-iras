type Props = { count: number; total?: number };

export function Stars({ count, total = 4 }: Props) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            i < count
              ? 'text-yellow-400 drop-shadow-sm'
              : 'text-slate-300'
          }
          style={{ fontSize: 'clamp(28px, 6vw, 56px)', lineHeight: 1 }}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}
