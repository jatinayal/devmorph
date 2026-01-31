import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/project/projectSlice';
import projectsReducer from '../features/project/projectsSlice';
import projectActionReducer from '../features/projectactions/pActionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    projectaction: projectActionReducer,
    projects: projectsReducer
  },
});

export default store;
