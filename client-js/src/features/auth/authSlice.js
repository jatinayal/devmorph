import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser, fetchMe, logoutUser } from './authThunk';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      // LOGIN
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ME
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      // LOGOUT
      .addCase(logoutUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
