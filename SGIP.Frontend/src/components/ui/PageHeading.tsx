export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-[10px] font-extrabold tracking-[0.16em] text-blue-600">{eyebrow}</p>
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}
