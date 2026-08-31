"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { TransactionList } from "@/features/transactions/components/TransactionList";
import { fetchTransactions } from "@/features/transactions/store/transaction.slice";
import { useAppDispatch } from "@/store/hooks";
export default function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 sm:w-auto"
          onClick={() => setOpen(true)}
        >
          + Nueva transacción
        </button>
      </div>
      <TransactionList />
      {open && (
        <Modal title="Nueva transacción" onClose={() => setOpen(false)}>
          <TransactionForm
            onCancel={() => setOpen(false)}
            onCreated={async () => {
              await dispatch(fetchTransactions()).unwrap();
              setOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}
