import {configureStore} from '@reduxjs/toolkit';
import DashboardSlice from "../features/Dashboard_Slices"
import productsReducer from "../features/Products_Slice"
import feedbackReducer from "../features/FeedBackSlice"
import PaymentSlice from "../features/Payment_Slice";

const store = configureStore({
reducer : {
  dashboard : DashboardSlice,
  products: productsReducer,
  feedback: feedbackReducer,
  payments: PaymentSlice,
}
})

export default store