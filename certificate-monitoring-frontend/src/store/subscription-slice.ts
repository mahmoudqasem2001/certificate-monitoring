
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface SubscriptionState {
  loading: boolean;
  error: string | null;
}

interface SubscriptionFormType{
    domain : string;
    email : string;
  }



export const subscribeToDomain = createAsyncThunk<void , SubscriptionFormType>(
  'subscription/subscribeToDomain',
  async ( {domain, email}: SubscriptionFormType, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/subscribe', JSON.stringify({ domain, email }));
        return response.data;
      } catch (error) {
      return rejectWithValue('Failed to subscribe');
    }
  }
);

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: { loading: false, error: null } as SubscriptionState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(subscribeToDomain.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(subscribeToDomain.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(subscribeToDomain.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default subscriptionSlice.reducer;
