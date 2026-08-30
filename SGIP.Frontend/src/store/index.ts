import { configureStore } from "@reduxjs/toolkit";
import loans from "@/features/loans/store/loan.slice";
import transactions from "@/features/transactions/store/transaction.slice";

export const makeStore = () => configureStore({ reducer: { loans, transactions } });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
