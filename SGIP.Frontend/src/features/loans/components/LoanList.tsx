"use client";

import Link from "next/link";
import { useState } from "react";
import { LOAN_STATUSES, LOAN_TYPES } from "@/constants/loan.constants";
import { EmptyState, ErrorMessage, LoadingState } from "@/components/ui/Feedback";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useLoans } from "../hooks/useLoans";
import { useUsers } from "@/features/users/context/UserProvider";

const filterClass =
  "mt-2 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-normal tracking-normal text-slate-600 outline-none focus:border-blue-500";
interface LoanListProps {
  compact?: boolean;
  statusFilter?: number[];
}

export function LoanList({ compact = false, statusFilter }: LoanListProps) {
  const { items, loading, error, refresh } = useLoans(!compact);
  const { users } = useUsers();
  const [status, setStatus] = useState(0);
  const [query, setQuery] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("");
  const [loanType, setLoanType] = useState(0);
  const [term, setTerm] = useState(0);
  const [minimumPayment, setMinimumPayment] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const userNames = new Map(users.map((user) => [user.userId, user.name]));
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const loans = items.filter((item) => {
    const matchesExternalStatus = !statusFilter || statusFilter.includes(item.status);
    const matchesStatus = !status || item.status === status;
    const matchesAmount = !minimumAmount || item.amount >= Number(minimumAmount);
    const matchesType = !loanType || item.loanType === loanType;
    const matchesTerm = !term || item.term === term;
    const matchesPayment = !minimumPayment || item.monthlyPayment >= Number(minimumPayment);
    const matchesDate = !createdDate || item.createdAt.slice(0, 10) === createdDate;
    const userName = userNames.get(item.userId) ?? item.userId;
    const matchesQuery =
      !normalizedQuery ||
      userName.toLocaleLowerCase().includes(normalizedQuery) ||
      item.userId.toLocaleLowerCase().includes(normalizedQuery);
    return (
      matchesExternalStatus &&
      matchesStatus &&
      matchesAmount &&
      matchesType &&
      matchesTerm &&
      matchesPayment &&
      matchesDate &&
      matchesQuery
    );
  });
  const hasFilters = Boolean(
    query || minimumAmount || loanType || term || minimumPayment || status || createdDate,
  );
  const clearFilters = () => {
    setQuery("");
    setMinimumAmount("");
    setLoanType(0);
    setTerm(0);
    setMinimumPayment("");
    setStatus(0);
    setCreatedDate("");
  };
  if (error) return <ErrorMessage message={error} onRetry={() => void refresh()} />;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400">
                SOLICITANTE
                {!compact && (
                  <input
                    className={filterClass}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Nombre o código"
                  />
                )}
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400">
                MONTO
                {!compact && (
                  <input
                    className={filterClass}
                    type="number"
                    min="0"
                    value={minimumAmount}
                    onChange={(event) => setMinimumAmount(event.target.value)}
                    placeholder="Mínimo"
                  />
                )}
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400">
                TIPO
                {!compact && (
                  <select
                    className={filterClass}
                    value={loanType}
                    onChange={(event) => setLoanType(Number(event.target.value))}
                  >
                    <option value="0">Todos</option>
                    <option value="1">Cuota fija</option>
                    <option value="2">Decreciente</option>
                  </select>
                )}
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400">
                PLAZO
                {!compact && (
                  <select
                    className={filterClass}
                    value={term}
                    onChange={(event) => setTerm(Number(event.target.value))}
                  >
                    <option value="0">Todos</option>
                    {[6, 12, 18, 24, 36, 48, 60].map((value) => (
                      <option key={value} value={value}>
                        {value} meses
                      </option>
                    ))}
                  </select>
                )}
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400">
                CUOTA
                {!compact && (
                  <input
                    className={filterClass}
                    type="number"
                    min="0"
                    value={minimumPayment}
                    onChange={(event) => setMinimumPayment(event.target.value)}
                    placeholder="Mínima"
                  />
                )}
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400">
                ESTADO
                {!compact && (
                  <select
                    className={filterClass}
                    value={status}
                    onChange={(event) => setStatus(Number(event.target.value))}
                  >
                    <option value="0">Todos</option>
                    <option value="1">Pendiente</option>
                    <option value="2">Aprobado</option>
                    <option value="3">Rechazado</option>
                    <option value="4">Activo</option>
                  </select>
                )}
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400">
                FECHA
                {!compact && (
                  <input
                    className={filterClass}
                    type="date"
                    value={createdDate}
                    onChange={(event) => setCreatedDate(event.target.value)}
                  />
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {loans.slice(0, compact ? 5 : undefined).map((loan) => {
              const userName = userNames.get(loan.userId) ?? loan.userId;
              return (
                <tr key={loan.id} className="hover:bg-blue-50/30">
                  <td className="border-b border-slate-100 px-5 py-4">
                    <Link
                      href={`/loans/${loan.id}`}
                      className="flex items-center gap-2 text-xs font-bold text-slate-700"
                    >
                      <i className="grid size-7 place-items-center rounded-lg bg-blue-50 text-[9px] text-blue-700 not-italic">
                        {userName.slice(0, 2).toUpperCase()}
                      </i>
                      <span className="grid">
                        <strong>{userName}</strong>
                        <small className="font-normal text-slate-400">{loan.userId}</small>
                      </span>
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
              );
            })}
          </tbody>
        </table>
        {loading && <LoadingState />}
        {!loading && !loans.length && <EmptyState text="No hay préstamos para mostrar." />}
      </div>
      {!compact && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <span className="text-[11px] text-slate-400">{loans.length} resultados</span>
          {hasFilters && (
            <button
              type="button"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </section>
  );
}
