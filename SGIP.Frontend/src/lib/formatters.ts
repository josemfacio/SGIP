export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(value);
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value),
  );
export const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
