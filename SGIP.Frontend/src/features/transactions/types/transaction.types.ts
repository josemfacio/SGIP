export type TransactionType = 1 | 2 | 3;
export type TransactionStatus = 1 | 2 | 3;

export interface Transaction {
  id: string;
  idempotencyKey: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  loanId: string | null;
  description: string | null;
  createdAt: string;
}

export interface TransactionInput {
  idempotencyKey: string;
  type: TransactionType;
  amount: number;
  loanId: string | null;
  description: string;
}
