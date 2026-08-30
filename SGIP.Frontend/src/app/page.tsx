"use client";

import Link from "next/link";
import { LoanList } from "@/features/loans/components/LoanList";
import { useLoans } from "@/features/loans/hooks/useLoans";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { formatCurrency } from "@/lib/formatters";
import { PageHeading } from "@/components/ui/PageHeading";

const toneClasses: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
};
export default function HomePage() {
  const { items: loans, loading } = useLoans();
  const { items: transactions } = useTransactions();
  const active = loans.filter((loan) => loan.status === 2 || loan.status === 4);
  const pending = loans.filter((loan) => loan.status === 1);
  const payments = transactions.filter((tx) => tx.type === 2 && tx.status === 2);
  return (
    <>
      <PageHeading
        eyebrow="PANEL PRINCIPAL"
        title="Buenos días, José"
        description="Aquí tienes el panorama financiero de hoy."
      >
        <Link
          href="/loans/simulate"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 sm:w-auto"
        >
          ＋ Simular préstamo
        </Link>
      </PageHeading>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Cartera activa"
          value={formatCurrency(active.reduce((sum, loan) => sum + loan.amount, 0))}
          note={`${active.length} préstamos vigentes`}
          tone="blue"
          loading={loading}
        />
        <Stat
          label="Solicitudes pendientes"
          value={String(pending.length)}
          note={pending.length ? "Requieren revisión" : "Todo al día"}
          tone="amber"
          loading={loading}
        />
        <Stat
          label="Pagos recibidos"
          value={formatCurrency(payments.reduce((sum, tx) => sum + tx.amount, 0))}
          note="Transacciones completadas"
          tone="green"
          loading={loading}
        />
        <Stat
          label="Total gestionado"
          value={formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}
          note={`${loans.length} solicitudes registradas`}
          tone="violet"
          loading={loading}
        />
      </div>
      <div className="flex items-center justify-between px-1 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Solicitudes recientes</h3>
          <p className="text-xs text-slate-400">Últimos préstamos registrados</p>
        </div>
        <Link className="text-xs font-bold text-blue-600 hover:text-blue-700" href="/loans">
          Ver todos →
        </Link>
      </div>
      <LoanList compact />
    </>
  );
}
function Stat({
  label,
  value,
  note,
  tone,
  loading,
}: {
  label: string;
  value: string;
  note: string;
  tone: string;
  loading: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`float-right grid size-10 place-items-center rounded-xl ${toneClasses[tone]}`}
      >
        ◈
      </div>
      <p className="mb-2 text-xs text-slate-500">{label}</p>
      {loading ? (
        <span className="mb-2 block h-7 w-32 animate-pulse rounded bg-slate-100" />
      ) : (
        <h2 className="mb-1 text-2xl font-extrabold text-slate-900">{value}</h2>
      )}
      <small className="text-[11px] text-slate-400">{note}</small>
    </article>
  );
}
