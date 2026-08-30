"use client";

import { TRANSACTION_STATUSES, TRANSACTION_TYPES } from "@/constants/transaction.constants";
import { EmptyState, ErrorMessage, LoadingState } from "@/components/ui/Feedback";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useTransactions } from "../hooks/useTransactions";
const selectClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
const cellClass = "border-b border-slate-100 px-5 py-4 text-xs text-slate-500";
export function TransactionList({ compact = false }: { compact?: boolean }) {
  const { items, loading, error, type, status, setType, setStatus, refresh } = useTransactions();
  if (error) return <ErrorMessage message={error} onRetry={() => void refresh()} />;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {!compact && (
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <select
              className={selectClass}
              aria-label="Filtrar por tipo"
              value={type}
              onChange={(event) => setType(+event.target.value)}
            >
              <option value="0">Todos los tipos</option>
              <option value="1">Desembolsos</option>
              <option value="2">Pagos</option>
              <option value="3">Transferencias</option>
            </select>
            <select
              className={selectClass}
              aria-label="Filtrar por estado"
              value={status}
              onChange={(event) => setStatus(+event.target.value)}
            >
              <option value="0">Todos los estados</option>
              <option value="1">Pendientes</option>
              <option value="2">Completadas</option>
              <option value="3">Fallidas</option>
            </select>
          </div>
          <span className="text-[11px] text-slate-400">{items.length} registros</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr>
              {["TIPO", "DESCRIPCIÓN", "PRÉSTAMO", "FECHA", "ESTADO", "MONTO"].map((head) => (
                <th
                  key={head}
                  className={`border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400 ${head === "MONTO" ? "text-right" : ""}`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.slice(0, compact ? 5 : undefined).map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50">
                <td className={cellClass}>
                  <b className="text-slate-700">{TRANSACTION_TYPES[tx.type]}</b>
                </td>
                <td className={cellClass}>{tx.description || "Sin descripción"}</td>
                <td className={`${cellClass} font-mono`}>
                  {tx.loanId ? tx.loanId.slice(0, 8) : "—"}
                </td>
                <td className={cellClass}>{formatDate(tx.createdAt)}</td>
                <td className={cellClass}>
                  <StatusBadge value={tx.status} labels={TRANSACTION_STATUSES} />
                </td>
                <td className={`${cellClass} text-right font-extrabold text-slate-700`}>
                  {formatCurrency(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <LoadingState />}
        {!loading && !items.length && <EmptyState text="No hay transacciones para mostrar." />}
      </div>
    </section>
  );
}
