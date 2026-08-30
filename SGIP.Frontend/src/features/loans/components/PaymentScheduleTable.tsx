import { formatCurrency, formatDate } from "@/lib/formatters";
import type { PaymentSchedule } from "../types/loan.types";
export function PaymentScheduleTable({
  schedule,
  preview = false,
}: {
  schedule: PaymentSchedule[];
  preview?: boolean;
}) {
  const rows = preview ? schedule.slice(0, 4) : schedule;
  return (
    <div className={`overflow-x-auto ${preview ? "" : "max-h-[520px]"}`}>
      <table className="w-full min-w-[650px] border-collapse text-left">
        <thead>
          <tr>
            {["N°", "FECHA DE PAGO", "CUOTA TOTAL", "CAPITAL", "INTERÉS", "SALDO"].map((head) => (
              <th
                key={head}
                className="border-y border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-extrabold tracking-wider text-slate-400"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.paymentNumber}>
              <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                #{row.paymentNumber}
              </td>
              <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                {formatDate(row.dueDate)}
              </td>
              <td className="border-b border-slate-100 px-5 py-4 text-xs font-extrabold text-slate-700">
                {formatCurrency(row.totalPayment)}
              </td>
              <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                {formatCurrency(row.principal)}
              </td>
              <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                {formatCurrency(row.interest)}
              </td>
              <td className="border-b border-slate-100 px-5 py-4 text-xs text-slate-500">
                {formatCurrency(row.remainingBalance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
