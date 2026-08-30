"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLoans } from "../store/loan.slice";

export function useLoans(autoLoad = true) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((current) => current.loans);
  const refresh = useCallback(async () => {
    await dispatch(fetchLoans());
  }, [dispatch]);
  useEffect(() => {
    if (autoLoad && !state.initialized && !state.loading) void dispatch(fetchLoans());
  }, [autoLoad, dispatch, state.initialized, state.loading]);
  return { ...state, refresh };
}
