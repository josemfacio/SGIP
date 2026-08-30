import { apiRequest } from "@/lib/api";
import type { Loan, LoanInput, LoanSimulation, PaymentSchedule } from "../types/loan.types";

export const loanService = {
  getAll: (userId?: string) =>
    apiRequest<Loan[]>(`/api/loans${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`),
  getById: (id: string) => apiRequest<Loan>(`/api/loans/${id}`),
  getSchedule: (id: string) => apiRequest<PaymentSchedule[]>(`/api/loans/${id}/schedule`),
  simulate: (input: Omit<LoanInput, "userId">) =>
    apiRequest<LoanSimulation>("/api/loans/simulate", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  create: (input: LoanInput) =>
    apiRequest<Loan>("/api/loans", { method: "POST", body: JSON.stringify(input) }),
  approve: (id: string) => apiRequest<Loan>(`/api/loans/${id}/approve`, { method: "PATCH" }),
  reject: (id: string) => apiRequest<Loan>(`/api/loans/${id}/reject`, { method: "PATCH" }),
};
