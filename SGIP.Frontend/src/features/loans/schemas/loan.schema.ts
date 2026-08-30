import { z } from "zod";

export const loanSchema = z.object({
  amount: z
    .number()
    .min(500, "El monto mínimo es Bs 500")
    .max(50000, "El monto máximo es Bs 50.000"),
  term: z
    .number()
    .int()
    .min(6, "El plazo mínimo es 6 meses")
    .max(60, "El plazo máximo es 60 meses"),
  loanType: z.union([z.literal(1), z.literal(2)], "Selecciona un tipo de préstamo"),
});
export type LoanFormValues = z.infer<typeof loanSchema>;
