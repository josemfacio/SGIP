"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoans } from "@/features/loans/hooks/useLoans";
import { formatCurrency } from "@/lib/formatters";
import { transactionSchema, type TransactionFormValues } from "../schemas/transaction.schema";
import { transactionService } from "../services/transaction.service";
import type { TransactionType } from "../types/transaction.types";
const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
export function TransactionForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => Promise<unknown>;
  onCancel: () => void;
}) {
  const { items: loans } = useLoans();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 2, amount: 0, loanId: "", description: "" },
  });
  const submit = async (data: TransactionFormValues) => {
    setApiError("");
    try {
      await transactionService.create({
        idempotencyKey: crypto.randomUUID(),
        type: data.type as TransactionType,
        amount: data.amount,
        loanId: data.loanId || null,
        description: data.description,
      });
      await onCreated();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "No se pudo registrar");
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)}>
      <label className="mt-5 grid gap-2 text-xs font-bold text-slate-600">
        Tipo
        <select className={fieldClass} {...register("type", { valueAsNumber: true })}>
          <option value="1">Desembolso</option>
          <option value="2">Pago</option>
          <option value="3">Transferencia</option>
        </select>
      </label>
      <label className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
        Monto
        <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
          <span className="grid place-items-center border-r border-slate-200 bg-slate-50 px-3 text-slate-500">
            Bs
          </span>
          <input
            className="w-full px-3 py-2.5 text-sm outline-none"
            type="number"
            min="0.01"
            step="0.01"
            {...register("amount", { valueAsNumber: true })}
          />
        </div>
        {errors.amount && <span className="text-[11px] text-red-600">{errors.amount.message}</span>}
      </label>
      <label className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
        Préstamo relacionado (opcional)
        <select className={fieldClass} {...register("loanId")}>
          <option value="">Sin préstamo</option>
          {loans.map((loan) => (
            <option value={loan.id} key={loan.id}>
              {loan.userId} · {formatCurrency(loan.amount)}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
        Descripción
        <textarea
          className={fieldClass}
          rows={3}
          placeholder="Detalle del movimiento"
          {...register("description")}
        />
      </label>
      {apiError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{apiError}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Registrar"}
        </button>
      </div>
    </form>
  );
}
