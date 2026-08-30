"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { ErrorMessage, LoadingState } from "@/components/ui/Feedback";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LOAN_STATUSES, LOAN_TYPES } from "@/constants/loan.constants";
import { PaymentScheduleTable } from "@/features/loans/components/PaymentScheduleTable";
import { loanService } from "@/features/loans/services/loan.service";
import type { Loan, PaymentSchedule } from "@/features/loans/types/loan.types";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatters";

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<Loan | null>(null),
    [schedule, setSchedule] = useState<PaymentSchedule[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const load = async () => {
    setError("");
    try {
      const [data, rows] = await Promise.all([
        loanService.getById(id),
        loanService.getSchedule(id),
      ]);
      setLoan(data);
      setSchedule(rows);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo cargar el préstamo");
    }
  };
  useEffect(() => {
    void load();
  }, [id]);
  const decide = async (action: "approve" | "reject") => {
    setBusy(true);
    try {
      await loanService[action](id);
      await load();
    } finally {
      setBusy(false);
    }
  };
  if (error) return <ErrorMessage message={error} onRetry={() => void load()} />;
  if (!loan) return <LoadingState />;
  return (
    <div className="grid gap-5">
      <Link className="text-xs font-bold text-blue-600 hover:text-blue-700" href="/loans">
        ← Volver a préstamos
      </Link>
      <PageHeading
        eyebrow="DETALLE DE PRÉSTAMO"
        title={formatCurrency(loan.amount)}
        description={`Solicitud ${loan.id}`}
      >
        <StatusBadge value={loan.status} labels={LOAN_STATUSES} />
      </PageHeading>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
          <Detail label="Solicitante" value={loan.userId} />
          <Detail label="Tipo" value={LOAN_TYPES[loan.loanType]} />
          <Detail label="Plazo" value={`${loan.term} meses`} />
          <Detail label="Tasa anual" value={formatPercent(loan.interestRate)} />
          <Detail label="Cuota mensual" value={formatCurrency(loan.monthlyPayment)} />
          <Detail label="Registrado" value={formatDate(loan.createdAt)} />
        </div>
        {loan.status === 1 && (
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 disabled:cursor-wait disabled:opacity-60"
              disabled={busy}
              onClick={() => void decide("reject")}
            >
              Rechazar
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
              disabled={busy}
              onClick={() => void decide("approve")}
            >
              Aprobar solicitud
            </button>
          </div>
        )}
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Cronograma completo</h3>
            <p className="text-xs text-slate-400">{schedule.length} cuotas programadas</p>
          </div>
        </div>
        <PaymentScheduleTable schedule={schedule} />
      </section>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 bg-white p-4 text-xs">
      <small className="text-slate-400">{label}</small>
      <strong className="text-slate-700">{value}</strong>
    </div>
  );
}
