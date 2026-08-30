import { apiRequest } from "@/lib/api";
import type { Transaction, TransactionInput } from "../types/transaction.types";

export interface TransactionFilters {
  type?: number;
  status?: number;
}

export const transactionService = {
  getAll: (filters: TransactionFilters = {}) => {
    const query = new URLSearchParams();
    if (filters.type) query.set("type", String(filters.type));
    if (filters.status) query.set("status", String(filters.status));
    return apiRequest<Transaction[]>(`/api/transactions${query.size ? `?${query}` : ""}`);
  },
  getById: (id: string) => apiRequest<Transaction>(`/api/transactions/${id}`),
  create: (input: TransactionInput) =>
    apiRequest<Transaction>("/api/transactions", { method: "POST", body: JSON.stringify(input) }),
};
