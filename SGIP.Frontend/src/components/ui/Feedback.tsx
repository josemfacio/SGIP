export function LoadingState() {
  return (
    <div className="grid gap-2 p-5" aria-label="Cargando">
      {[1, 2, 3].map((row) => (
        <span key={row} className="h-7 animate-pulse rounded-md bg-slate-100" />
      ))}
    </div>
  );
}
export function EmptyState({ text }: { text: string }) {
  return (
    <div className="grid place-items-center gap-2 p-10 text-center text-slate-400">
      <span className="text-2xl">◇</span>
      <p className="text-xs">{text}</p>
    </div>
  );
}
export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mb-6 flex flex-col items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 sm:flex-row sm:items-center">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-amber-300 font-extrabold">
        !
      </span>
      <p className="grid flex-1 text-xs">
        <strong>No fue posible completar la consulta</strong>
        {message}
      </p>
      {onRetry && (
        <button
          className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-bold"
          onClick={onRetry}
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
