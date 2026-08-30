import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { transactionService, type TransactionFilters } from "../services/transaction.service";
import type { Transaction } from "../types/transaction.types";

interface TransactionState {
  items: Transaction[];
  loading: boolean;
  initialized: boolean;
  error: string | null;
}
const initialState: TransactionState = {
  items: [],
  loading: false,
  initialized: false,
  error: null,
};
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  (filters?: TransactionFilters) => transactionService.getAll(filters),
);

const slice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.error.message || "No se pudieron cargar las transacciones";
      }),
});
export default slice.reducer;
