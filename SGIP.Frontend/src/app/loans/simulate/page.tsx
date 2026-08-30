import { PageHeading } from "@/components/ui/PageHeading";
import { LoanSimulator } from "@/features/loans/components/LoanSimulator";
export default function SimulatePage() {
  return (
    <>
      <PageHeading
        eyebrow="HERRAMIENTA FINANCIERA"
        title="Simulador de préstamo"
        description="Proyecta una cuota y revisa el cronograma antes de registrar la solicitud."
      />
      <LoanSimulator />
    </>
  );
}
