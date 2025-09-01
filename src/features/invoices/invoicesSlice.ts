import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';
import { Invoice } from '../../model/Interfaces/IInvoice';

export interface DateRange {
  start_date: string;
  end_date: string;
}

interface InvoicesState {
  data: Invoice[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: InvoicesState = {
  data: [],
  loading: 'idle',
  error: null,
};

export const fetchInvoices = createAsyncThunk<
  Invoice[],
  DateRange,
  { rejectValue: string }
>(
  'invoices/fetchInvoices',
  async (dateRange, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Invoice[]>('/invoices', dateRange);
      return response.data;
    } catch (err: unknown) {
        if (err instanceof Error) {
        return rejectWithValue(`Failed to fetch invoices due to: ${err.message}`);
        }
        return rejectWithValue('Failed to fetch invoices due to an unknown error.');
    }
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
        state.loading = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message || null;
      });
  },
});

export default invoicesSlice.reducer;