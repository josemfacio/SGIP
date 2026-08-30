export type LoanType = 1 | 2;
export type LoanStatus = 1 | 2 | 3 | 4;

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  term: number;
  interestRate: number;
  loanType: LoanType;
  status: LoanStatus;
  monthlyPayment: number;
  createdAt: string;
}

export interface PaymentSchedule {
  paymentNumber: number;
  dueDate: string;
  totalPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanSimulation {
  amount: number;
  term: number;
  annualEffectiveRate: number;
  monthlyEffectiveRate: number;
  monthlyPayment: number;
  schedule: PaymentSchedule[];
}

export interface LoanInput {
  userId: string;
  amount: number;
  term: number;
  loanType: LoanType;
}
