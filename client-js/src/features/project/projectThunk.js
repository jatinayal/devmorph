import { createAsyncThunk } from '@reduxjs/toolkit';

const API = import.meta.env.VITE_API_URL || 'https://devmorph-server.onrender.com/api';

export const createProject = createAsyncThunk(
  'user/project',
  async ({ input }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ initial_prompt: input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProjectCode = createAsyncThunk(
  'user/code/project',
  async ({ enhanceResponse, projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/project/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enhanceResponse: enhanceResponse, projectId: projectId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProjectRevisionCode = createAsyncThunk(
  'user/revisioncode/project',
  async ({ enhanceResponse, projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/project/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enhanceResponse: enhanceResponse, projectId: projectId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getProject = createAsyncThunk(
  'user/get/project',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/project/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getAllProject = createAsyncThunk(
  'user/all/project',
  async ({ pagee, limit }) => {
    try {
      const res = await fetch(`${API}/project/projects/published?page=${pagee}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUserProject = createAsyncThunk(
  'user/user/project',
  async () => {
    try {
      const res = await fetch(`${API}/user/projects`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getPublishedProject = createAsyncThunk(
  'user/pulish/project',
  async ({ projectId }) => {
    try {
      const res = await fetch(`${API}/project/projects/published/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'projects/fetch',
  async ({ pagee, limit }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API}/user/projects?page=${pagee}&limit=${limit}`,
        { credentials: 'include' }
      );

      const data = await res.json();
      if (!res.ok) throw new Error('Fetch failed');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
