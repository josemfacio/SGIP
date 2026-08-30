"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTransactions } from "../store/transaction.slice";

export function useTransactions() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((current) => current.transactions);
  const [type, setType] = useState(0),
    [status, setStatus] = useState(0);
  const refresh = useCallback(async () => {
    await dispatch(fetchTransactions({ type: type || undefined, status: status || undefined }));
  }, [dispatch, type, status]);
  useEffect(() => {
    void dispatch(fetchTransactions({ type: type || undefined, status: status || undefined }));
  }, [dispatch, type, status]);
  return { ...state, type, status, setType, setStatus, refresh };
}
