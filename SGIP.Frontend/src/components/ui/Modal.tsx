export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-5">
      <button
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <section className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white px-6 pb-6 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 py-5">
          <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
          <button
            className="grid size-8 place-items-center rounded-full bg-slate-100 text-xl text-slate-500 hover:bg-slate-200"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
