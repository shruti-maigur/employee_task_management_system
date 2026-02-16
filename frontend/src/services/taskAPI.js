// ============================================================
// Axios API Configuration
// File: frontend/src/services/taskAPI.js
// ============================================================

import axios from 'axios';

// Create axios instance with default config
const taskAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================
taskAPI.interceptors.request.use(
  (config) => {
    // You can add auth tokens here in the future
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
taskAPI.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Response error:', errorMessage);
    return Promise.reject(error);
  }
);

// ============================================================
// API METHODS
// ============================================================

/**
 * Fetch all tasks
 */
export const getAllTasks = async () => {
  try {
    return await taskAPI.get('/tasks');
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch a single task by ID
 */
export const getTaskById = async (id) => {
  try {
    return await taskAPI.get(`/tasks/${id}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  try {
    return await taskAPI.post('/tasks', taskData);
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (id, taskData) => {
  try {
    return await taskAPI.put(`/tasks/${id}`, taskData);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (id) => {
  try {
    return await taskAPI.delete(`/tasks/${id}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async () => {
  try {
    return await taskAPI.get('/health');
  } catch (error) {
    throw error;
  }
};

export default taskAPI;
