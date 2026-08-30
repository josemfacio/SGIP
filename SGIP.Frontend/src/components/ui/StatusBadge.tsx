const tones: Record<number, string> = {
  1: "bg-amber-50 text-amber-700",
  2: "bg-emerald-50 text-emerald-700",
  3: "bg-red-50 text-red-700",
  4: "bg-emerald-50 text-emerald-700",
};
export function StatusBadge({ value, labels }: { value: number; labels: Record<number, string> }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${tones[value] ?? "bg-slate-100 text-slate-600"}`}
    >
      <i className="size-1.5 rounded-full bg-current" />
      {labels[value] || "Desconocido"}
    </span>
  );
}
