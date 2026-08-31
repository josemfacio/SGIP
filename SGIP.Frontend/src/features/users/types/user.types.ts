export interface User {
  userId: string;
  name: string;
  email: string;
  monthlyIncome: number;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  monthlyIncome: number;
}
