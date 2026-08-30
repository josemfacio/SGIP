import { z } from "zod";

export const transactionSchema = z.object({
  type: z.number().refine((value) => [1, 2, 3].includes(value), "Selecciona un tipo"),
  amount: z.number().positive("El monto debe ser mayor a cero"),
  loanId: z.string(),
  description: z.string().max(250, "Máximo 250 caracteres"),
});
export type TransactionFormValues = z.infer<typeof transactionSchema>;
