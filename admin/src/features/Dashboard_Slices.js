import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching users
export const fetchAllUsers = createAsyncThunk(
  'dashboard/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/getAllUsers');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  active: 'Dashboard',
  user_Data: [],
  selectedUser: null,  // Stores complete user object
  user_Email: null,
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActive: (state, action) => {
      state.active = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.user_Email = action.payload?.email;
    },
    resetSelectedUser: (state) => {
      state.selectedUser = null;
      state.user_Email = null;
    },
    setUserEmail: (state, action) => {
      state.user_Email = action.payload;
    }
    // setActive: (state, action) => {
    //   state.active = action.payload;
    // },
    // setSelectedUser: (state, action) => {
    //   state.selectedUser = action.payload;
    //   state.user_Email = action.payload?.email; // Maintain email for compatibility
    // },
    // resetSelectedUser: (state) => {
    //   state.selectedUser = null;
    //   state.user_Email = null;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.user_Data = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      });
  }
});

export const { setActive, setSelectedUser, resetSelectedUser , setUserEmail } = dashboardSlice.actions;
export default dashboardSlice.reducer;
// import { createSlice  } from "@reduxjs/toolkit";

//  const initialState = {
//   active: 'Dashboard',
//   user_Data: [],
//   loading : false,
//   error:null
  
//  }

//  const DashboardSlice = createSlice({
//   name : "Dashboard",
//   initialState,
//   reducers : {
//     setActive : ( state , action ) => {
//       state.active = action.payload
//     },
//     setUserData : ( state , action) => {
//       state.user_Email = action.payload
//       state.loading = false;
//     },
//     setLoading : ( state ) => {
//       state.loading = true
//     } , 
//     setError : ( state , action ) => {
//       state.error = action.payload;
//       state.loading = false;
//     }

//   }

//  })

//  export const { setActive , setUserData ,setLoading , setError } = DashboardSlice.actions 

//  export default DashboardSlice.reducer