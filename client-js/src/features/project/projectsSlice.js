import { createSlice } from "@reduxjs/toolkit";
import { fetchProjects } from "./projectThunk";

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
  },
  reducers: {
    resetProjects: (state) => {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.list = [] 
        state.loading = false;
        state.list.push(...action.payload.projects);
        state.hasMore = action.payload.pagination.hasMore;
        state.page = action.payload.pagination.page;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError, logout } = projectsSlice.actions;
export default projectsSlice.reducer;
