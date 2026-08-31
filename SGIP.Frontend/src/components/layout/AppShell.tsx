"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUsers } from "@/features/users/context/UserProvider";

const links = [
  { href: "/", label: "Resumen", icon: "⌂" },
  { href: "/loans/simulate", label: "Simulador", icon: "◫" },
  { href: "/loans", label: "Préstamos", icon: "▤" },
  { href: "/transactions", label: "Transacciones", icon: "⇄" },
  { href: "/users", label: "Usuarios", icon: "U" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeUser } = useUsers();
  const [open, setOpen] = useState(false);
  return (
    <main className="flex min-h-screen bg-slate-50 text-slate-800">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#0d1f3c] px-4 py-6 text-white transition-transform duration-200 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link
          href="/"
          className="flex h-14 items-center gap-3 px-2 text-xl font-extrabold"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 font-serif shadow-lg shadow-blue-950/30">
            S
          </span>
          <span>SGIP</span>
        </Link>
        <p className="mt-7 mb-3 px-3 text-[10px] font-extrabold tracking-[0.18em] text-slate-500">
          GESTIÓN FINANCIERA
        </p>
        <nav className="grid gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${active ? "bg-blue-900/60 text-white shadow-[inset_3px_0_0_#6e90ff]" : "text-slate-400 hover:bg-blue-900/40 hover:text-white"}`}
              >
                <span className="w-6 text-center text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 flex items-center gap-2 border-t border-blue-900 pt-4">
          <span className="grid size-9 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">
            {activeUser?.name.slice(0, 2).toUpperCase() ?? "--"}
          </span>
          <span className="grid text-xs">
            <strong>{activeUser?.name ?? "Sin usuario"}</strong>
            <small className="text-slate-500">Usuario activo</small>
          </span>
          <b className="ml-auto text-slate-500">⋮</b>
        </div>
      </aside>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/60 md:hidden"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />
      )}
      <section className="min-w-0 flex-1 md:ml-60">
        <header className="sticky top-0 z-20 flex h-[72px] items-center border-b border-slate-200 bg-white px-4 md:px-8">
          <button
            type="button"
            className="mr-3 text-xl md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <div className="hidden w-full max-w-sm items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 text-slate-400 sm:flex">
            <span className="text-lg">⌕</span>
            <input
              className="h-10 w-full bg-transparent text-sm outline-none"
              aria-label="Buscar"
              placeholder="Buscar préstamos o transacciones..."
            />
          </div>
          <div className="ml-auto flex items-center gap-5">
            <span className="grid size-9 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">
              {activeUser?.name.slice(0, 8) ?? "Usuario"}
            </span>
          </div>
        </header>
        <div className="mx-auto max-w-[1560px] p-4 sm:p-6 lg:p-9">{children}</div>
      </section>
    </main>
  );
}
