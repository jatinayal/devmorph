import { createAsyncThunk } from '@reduxjs/toolkit';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Not authenticated');
      const data = await res.json();
      return data.user;
    } catch {
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      const res = await fetch(`${API}/auth/logout`, {
        method: 'POST',
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

export const buyCredits = createAsyncThunk(
  'credits/buy',
  async ({ planId, transactionNumber }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId, transactionNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getPayments = createAsyncThunk(
  'payments',
  async () => {
    try {
      const res = await fetch(`${API}/admin/payments`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return err.message;
    }
  }
);

export const updateAPayment = createAsyncThunk(
  'payment/status',
  async ({ paymentId, status }) => {
    try {
      const res = await fetch(`${API}/admin/payment/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return err.message;
    }
  }
);
