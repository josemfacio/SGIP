"use client";

import Link from "next/link";
import { useState } from "react";
import { LOAN_STATUSES, LOAN_TYPES } from "@/constants/loan.constants";
import { EmptyState, ErrorMessage, LoadingState } from "@/components/ui/Feedback";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useLoans } from "../hooks/useLoans";

const filters: [number, string][] = [
  [0, "Todos"],
  [1, "Pendientes"],
  [2, "Aprobados"],
  [3, "Rechazados"],
  [4, "Activos"],
];
export function LoanList({ compact = false }: { compact?: boolean }) {
  const { items, loading, error, refresh } = useLoans(!compact);
  const [status, setStatus] = useState(0);
  const loans = status ? items.filter((item) => item.status === status) : items;
  if (error) return <ErrorMessage message={error} onRetry={() => void refresh()} />;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {!compact && (
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-full gap-1 overflow-x-auto">
            {filters.map(([value, label]) => (
              <button
                key={value}
                className={`rounded-lg px-3 py-2 text-[11px] whitespace-nowrap transition ${status === value ? "bg-blue-50 font-bold text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
                onClick={() => setStatus(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400">{loans.length} resultados</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr>
              {["SOLICITANTE", "MONTO", "TIPO", "PLAZO", "CUOTA", "ESTADO", "FECHA"].map((head) => (
                <th
                  key={head}
                  className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.slice(0, compact ? 5 : undefined).map((loan) => (
              <tr key={loan.id} className="hover:bg-blue-50/30">
                <td className="border-b border-slate-100 px-5 py-4">
                  <Link
                    href={`/loans/${loan.id}`}
                    className="flex items-center gap-2 text-xs font-bold text-slate-700"
                  >
                    <i className="grid size-7 place-items-center rounded-lg bg-blue-50 text-[9px] text-blue-700 not-italic">
                      {loan.userId.slice(0, 2).toUpperCase()}
                    </i>
                    {loan.userId}
                  </Link>
                </td>
                <td className="border-b border-slate-100 px-5 py-4 text-xs font-extrabold text-slate-700">
                  {formatCurrency(loan.amount)}
                </td>
                <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                  {LOAN_TYPES[loan.loanType]}
                </td>
                <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                  {loan.term} meses
                </td>
                <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                  {formatCurrency(loan.monthlyPayment)}
                </td>
                <td className="border-b border-slate-100 px-5 py-4">
                  <StatusBadge value={loan.status} labels={LOAN_STATUSES} />
                </td>
                <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                  {formatDate(loan.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <LoadingState />}
        {!loading && !loans.length && <EmptyState text="No hay préstamos para mostrar." />}
      </div>
    </section>
  );
}
