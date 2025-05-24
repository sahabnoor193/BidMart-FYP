import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    singlePayment: null,
}

const PaymentSlice = createSlice({
  name: 'payments',
    initialState,
    reducers: {
      setSinglePayment: (state, action) => {
        state.singlePayment = action.payload;
      },
    }
})

export const { setSinglePayment } = PaymentSlice.actions;

export default PaymentSlice.reducer;