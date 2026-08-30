"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { loanSchema, type LoanFormValues } from "../schemas/loan.schema";
import { loanService } from "../services/loan.service";
import type { LoanSimulation, LoanType } from "../types/loan.types";
import { PaymentScheduleTable } from "./PaymentScheduleTable";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
export function LoanSimulator() {
  const router = useRouter();
  const [result, setResult] = useState<LoanSimulation | null>(null);
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: { amount: 10000, term: 12, loanType: 1 },
  });
  const values = watch();
  const calculate = async (data: LoanFormValues) => {
    setApiError("");
    try {
      setResult(await loanService.simulate({ ...data, loanType: data.loanType as LoanType }));
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "No se pudo simular");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      void handleSubmit(calculate)();
    }, 450);
    return () => clearTimeout(timer);
  }, [values.amount, values.term, values.loanType]);
  const requestLoan = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await loanService.create({
        userId: "user-123",
        amount: result.amount,
        term: result.term,
        loanType: Number(values.loanType) as LoanType,
      });
      router.push("/loans");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "No se pudo registrar");
      setSaving(false);
    }
  };
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(320px,0.8fr)_minmax(420px,1.2fr)]">
      <form
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit(calculate)}
      >
        <h3 className="text-base font-extrabold text-slate-900">Condiciones del préstamo</h3>
        <p className="mt-1 text-xs text-slate-400">Los resultados se actualizan automáticamente.</p>
        <label className="mt-6 grid gap-2 text-xs font-bold text-slate-600">Monto solicitado</label>
        <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
          <span className="grid place-items-center border-r border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
            Bs
          </span>
          <input
            className="w-full px-3 py-2.5 text-sm outline-none"
            type="number"
            min="500"
            max="50000"
            {...register("amount", { valueAsNumber: true })}
          />
        </div>
        {errors.amount && (
          <span className="mt-1 block text-[11px] text-red-600">{errors.amount.message}</span>
        )}
        <label className="mt-5 grid gap-2 text-xs font-bold text-slate-600">
          Plazo
          <select className={inputClass} {...register("term", { valueAsNumber: true })}>
            {[6, 12, 18, 24, 36, 48, 60].map((term) => (
              <option key={term} value={term}>
                {term} meses
              </option>
            ))}
          </select>
        </label>
        {errors.term && (
          <span className="mt-1 block text-[11px] text-red-600">{errors.term.message}</span>
        )}
        <label className="mt-5 grid gap-2 text-xs font-bold text-slate-600">
          Tipo de cuota
          <select className={inputClass} {...register("loanType", { valueAsNumber: true })}>
            <option value="1">Cuota fija</option>
            <option value="2" disabled>
              Cuota decreciente (próximamente)
            </option>
          </select>
        </label>
        {apiError && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{apiError}</p>
        )}
        <button
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Calculando..." : "Calcular"}
        </button>
      </form>
      <section className="min-h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#10294e] to-[#0a1c38] p-6 text-white shadow-sm">
        <p className="text-[10px] font-extrabold tracking-[0.16em] text-blue-300">
          RESULTADO ESTIMADO
        </p>
        {result ? (
          <>
            <div className="grid border-b border-blue-900 py-8 text-center">
              <small className="text-xs text-slate-400">Cuota mensual</small>
              <strong className="my-2 text-3xl font-extrabold sm:text-4xl">
                {formatCurrency(result.monthlyPayment)}
              </strong>
              <span className="text-xs text-slate-400">durante {result.term} meses</span>
            </div>
            <div className="grid grid-cols-2 border-b border-blue-900">
              <div className="grid gap-2 border-r border-blue-900 p-5 text-center">
                <small className="text-[10px] text-slate-400">Tasa efectiva anual</small>
                <b>{formatPercent(result.annualEffectiveRate)}</b>
              </div>
              <div className="grid gap-2 p-5 text-center">
                <small className="text-[10px] text-slate-400">Total aproximado</small>
                <b>
                  {formatCurrency(result.schedule.reduce((sum, row) => sum + row.totalPayment, 0))}
                </b>
              </div>
            </div>
            <div className="-mx-6 py-4">
              <h4 className="mb-2 px-6 text-xs font-bold">Primeras cuotas</h4>
              <PaymentScheduleTable schedule={result.schedule} preview />
            </div>
            <button
              className="w-full rounded-lg bg-blue-100 px-4 py-2.5 text-sm font-bold text-blue-800 hover:bg-white disabled:cursor-wait disabled:opacity-60"
              onClick={requestLoan}
              disabled={saving}
            >
              {saving ? "Registrando..." : "Solicitar préstamo"}
            </button>
          </>
        ) : (
          <div className="grid min-h-[420px] place-content-center justify-items-center px-8 text-center text-slate-400">
            <span className="text-5xl text-blue-400">◫</span>
            <h3 className="mt-4 mb-2 text-lg font-bold text-white">Preparando simulación</h3>
            <p className="max-w-xs text-xs leading-5">
              Ingresa un monto válido para calcular la cuota y el cronograma.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
