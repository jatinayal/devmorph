import { createAsyncThunk } from '@reduxjs/toolkit';

const API = import.meta.env.VITE_API_URL || 'https://devmorphs.onrender.com/api';


export const saveProject = createAsyncThunk(
  'user/save/project',
  async ({ projectId, code }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/${projectId}/save`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'user/delete/project',
  async ( projectId , { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/${projectId}`, {
        method: 'DELETE',
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

export const togglePublish = createAsyncThunk(
  'user/toggle/publish/project',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/publish/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProjectRevision = createAsyncThunk(
  'user/revision/project',
  async ({ input, projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/${projectId}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message:input }),
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
  'user/revision/code/project',
  async ({ enhanceResponse, projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/revision/code`, {
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

export const switchProjectVersion = createAsyncThunk(
  'user/switch/version/project',
  async ({ projectId, versionId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId: projectId, versionId: versionId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addProjectComment = createAsyncThunk(
  'user/comment/project',
  async ({ projectId, content }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/comment/project/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getProjectComment = createAsyncThunk(
  'user/comment/get/project',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/comment/project/${projectId}`, {
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
