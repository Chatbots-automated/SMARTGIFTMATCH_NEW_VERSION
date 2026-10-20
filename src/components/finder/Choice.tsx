export function ChoiceGrid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const grid = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[cols];
  return <div className={`grid gap-2.5 ${cols === 4 ? grid : `grid-cols-2 ${grid}`}`}>{children}</div>;
}

export function Choice({
  selected,
  onClick,
  children,
  disabled,
  big,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  big?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-2xl border-2 px-4 text-left text-[15px] font-medium transition",
        big ? "py-6 text-center" : "py-3.5",
        selected ? "border-brand bg-brand-soft text-ink" : "border-line bg-white hover:border-brand/60",
        "disabled:cursor-not-allowed disabled:opacity-40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
