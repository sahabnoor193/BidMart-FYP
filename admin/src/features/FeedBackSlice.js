import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const submitFeedback = createAsyncThunk(
  'feedbacks/submit',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/feedback', feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllFeedbacks = createAsyncThunk(
  'feedbacks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchApprovedFeedbacks = createAsyncThunk(
  'feedbacks/fetchApproved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback/approved');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const approveFeedback = createAsyncThunk(
  'feedbacks/approve',
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/feedback/${feedbackId}/approve`);
      return { id: feedbackId, updatedFeedback: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const declineFeedback = createAsyncThunk(
  'feedbacks/decline',
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/feedback/${feedbackId}/decline`);
      return { id: feedbackId, updatedFeedback: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedbacks/delete',
  async (feedbackId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${feedbackId}`);
      return feedbackId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedbacks',
  initialState: {
    allFeedbacks: [],
    approvedFeedbacks: [],
    singleFeedback: null,  
    loading: false,
    error: null,
    operationStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    currentFeedback: null
  },
  reducers: {
    resetFeedbackState: (state) => {
      state.loading = false;
      state.error = null;
      state.operationStatus = 'idle';
    },
    setCurrentFeedback: (state, action) => {
      state.currentFeedback = action.payload;
    },
    setSingleFeedback: (state, action) => {
      state.singleFeedback = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit Feedback
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.operationStatus = 'loading';
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.loading = false;
        state.operationStatus = 'succeeded';
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to submit feedback';
        state.operationStatus = 'failed';
      })
      
      // Fetch All Feedbacks
      .addCase(fetchAllFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.allFeedbacks = action.payload;
      })
      .addCase(fetchAllFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch feedbacks';
      })
      
      // Fetch Approved Feedbacks
      .addCase(fetchApprovedFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovedFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedFeedbacks = action.payload;
      })
      .addCase(fetchApprovedFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch approved feedbacks';
      })
      
      // Approve Feedback
      .addCase(approveFeedback.pending, (state) => {
        state.loading = true;
        state.operationStatus = 'loading';
      })
      .addCase(approveFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.operationStatus = 'succeeded';
        // Update in allFeedbacks array
        state.allFeedbacks = state.allFeedbacks.map(feedback => 
          feedback._id === action.payload.id ? action.payload.updatedFeedback : feedback
        );
        // Add to approvedFeedbacks if not already there
        if (!state.approvedFeedbacks.some(f => f._id === action.payload.id)) {
          state.approvedFeedbacks.unshift(action.payload.updatedFeedback);
        }
      })
      .addCase(approveFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to approve feedback';
        state.operationStatus = 'failed';
      })
      
      // Decline Feedback
      .addCase(declineFeedback.pending, (state) => {
        state.loading = true;
        state.operationStatus = 'loading';
      })
      .addCase(declineFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.operationStatus = 'succeeded';
        // Update in allFeedbacks array
        state.allFeedbacks = state.allFeedbacks.map(feedback => 
          feedback._id === action.payload.id ? action.payload.updatedFeedback : feedback
        );
        // Remove from approvedFeedbacks if present
        state.approvedFeedbacks = state.approvedFeedbacks.filter(
          feedback => feedback._id !== action.payload.id
        );
      })
      .addCase(declineFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to decline feedback';
        state.operationStatus = 'failed';
      })
      
      // Delete Feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.loading = true;
        state.operationStatus = 'loading';
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.operationStatus = 'succeeded';
        // Remove from allFeedbacks
        state.allFeedbacks = state.allFeedbacks.filter(
          feedback => feedback._id !== action.payload
        );
        // Remove from approvedFeedbacks
        state.approvedFeedbacks = state.approvedFeedbacks.filter(
          feedback => feedback._id !== action.payload
        );
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete feedback';
        state.operationStatus = 'failed';
      });
  }
});

// Export actions
export const { resetFeedbackState, setCurrentFeedback ,setSingleFeedback } = feedbackSlice.actions;

// Export selectors
export const selectAllFeedbacks = (state) => state.feedbacks.allFeedbacks;
export const selectApprovedFeedbacks = (state) => state.feedbacks.approvedFeedbacks;
export const selectFeedbackLoading = (state) => state.feedbacks.loading;
export const selectFeedbackError = (state) => state.feedbacks.error;
export const selectOperationStatus = (state) => state.feedbacks.operationStatus;
export const selectCurrentFeedback = (state) => state.feedbacks.currentFeedback;

export default feedbackSlice.reducer;