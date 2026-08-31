"use client";

import { useState } from "react";
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
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredItems = items.filter((transaction) => {
    const transactionDate = transaction.createdAt.slice(0, 10);
    const matchesQuery =
      !normalizedQuery ||
      transaction.description?.toLocaleLowerCase().includes(normalizedQuery) ||
      transaction.loanId?.toLocaleLowerCase().includes(normalizedQuery) ||
      transaction.idempotencyKey.toLocaleLowerCase().includes(normalizedQuery);
    const matchesFrom = !dateFrom || transactionDate >= dateFrom;
    const matchesTo = !dateTo || transactionDate <= dateTo;
    return matchesQuery && matchesFrom && matchesTo;
  });
  const hasFilters = Boolean(query || dateFrom || dateTo || type || status);
  const clearFilters = () => {
    setQuery("");
    setDateFrom("");
    setDateTo("");
    setType(0);
    setStatus(0);
  };
  if (error) return <ErrorMessage message={error} onRetry={() => void refresh()} />;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {!compact && (
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            <input
              className={`${selectClass} min-w-52 flex-1`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Descripción o préstamo..."
              aria-label="Filtrar transacciones por texto"
            />
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
            <label className="flex items-center gap-2 text-[11px] text-slate-400">
              Desde
              <input
                className={selectClass}
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={(event) => setDateFrom(event.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-[11px] text-slate-400">
              Hasta
              <input
                className={selectClass}
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(event) => setDateTo(event.target.value)}
              />
            </label>
            {hasFilters && (
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                onClick={clearFilters}
              >
                Limpiar
              </button>
            )}
          </div>
          <span className="text-[11px] whitespace-nowrap text-slate-400">
            {filteredItems.length} registros
          </span>
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
            {filteredItems.slice(0, compact ? 5 : undefined).map((tx) => (
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
        {!loading && !filteredItems.length && (
          <EmptyState text="No hay transacciones para mostrar." />
        )}
      </div>
    </section>
  );
}
