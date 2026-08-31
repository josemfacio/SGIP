import Link from "next/link";
import { LoanList } from "@/features/loans/components/LoanList";

export default function LoansPage() {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link
          href="/loans/simulate"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 sm:w-auto"
        >
          + Nueva simulación
        </Link>
      </div>
      <LoanList />
    </>
  );
}
