import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loanService } from "../services/loan.service";
import type { Loan } from "../types/loan.types";

interface LoanState {
  items: Loan[];
  loading: boolean;
  initialized: boolean;
  error: string | null;
}
const initialState: LoanState = { items: [], loading: false, initialized: false, error: null };
export const fetchLoans = createAsyncThunk("loans/fetchAll", loanService.getAll);

const slice = createSlice({
  name: "loans",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.items = action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.error.message || "No se pudieron cargar los préstamos";
      }),
});
export default slice.reducer;
