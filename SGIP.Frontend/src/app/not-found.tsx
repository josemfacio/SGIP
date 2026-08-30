import Link from "next/link";
export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-content-center justify-items-center gap-3 text-center">
      <span className="text-6xl font-black text-blue-200">404</span>
      <h3 className="text-xl font-extrabold text-slate-900">Página no encontrada</h3>
      <p className="mb-3 text-sm text-slate-500">La dirección solicitada no existe.</p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
      >
        Volver al resumen
      </Link>
    </div>
  );
}
