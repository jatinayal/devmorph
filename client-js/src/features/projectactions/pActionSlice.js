import { createSlice } from '@reduxjs/toolkit';
import { deleteProject, saveProject, togglePublish } from './pActionThunk';

const projectActionSlice = createSlice({
  name: 'projectaction',
  initialState: {
    project: null,
    loading: true,
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
       // SAVE_PROJRCT
      .addCase(saveProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(saveProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // TOGGLE_PUBLISH
      .addCase(togglePublish.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublish.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(togglePublish.rejected, (state, action) => {
        state.loading = false;
      })
       // DELETE_PUBLISH
      .addCase(deleteProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export const { clearError, logout } = projectActionSlice.actions;
export default projectActionSlice.reducer;
