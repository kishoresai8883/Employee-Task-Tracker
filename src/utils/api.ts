/*import axios from 'axios';
import { Task, User, Notification } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User operations
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  return data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.post('/users', userData);
  return data;
};

// Auth operations
export const login = async (credentials: { email: string; password: string }) => {
  const { data } = await api.post('/auth/login', credentials);
  localStorage.setItem('token', data.token);
  return data.user;
};

export const register = async (userData: { name: string; email: string; password: string }) => {
  const { data } = await api.post('/auth/register', userData);
  localStorage.setItem('token', data.token);
  return data.user;
};

// Task operations
export const getTasks = async (): Promise<Task[]> => {
  const { data } = await api.get('/tasks');
  return data;
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
  const { data } = await api.put(`/tasks/${taskId}`, taskData);
  return data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

// Error handler
export const handleAPIError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred',
    };
  }
  return {
    success: false,
    message: 'An unexpected error occurred',
  };
};*/

import axios from 'axios';
import { User, Task, LoginFormData, SignupFormData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Storage Keys
const AUTH_KEY = 'auth_token';
const USERS_KEY = 'users';
const TASKS_KEY = 'tasks';

// Auth Storage Operations
export const getStoredAuth = (): string | null => {
  return localStorage.getItem(AUTH_KEY);
};

export const storeAuth = (token: string): void => {
  localStorage.setItem(AUTH_KEY, token);
};

export const removeAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

// User Storage Operations
export const getUserById = (userId: string): User | null => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return users.find((user: User) => user.id === userId) || null;
};

export const getUserByEmail = (email: string): User | null => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  return users.find((user: User) => user.email === email) || null;
};

export const storeUser = (user: User): void => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const index = users.findIndex((u: User) => u.id === user.id);
  
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Task Storage Operations
export const getStoredTasks = (): Task[] => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const storeTask = (task: Task): void => {
  const tasks = getStoredTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  
  if (index >= 0) {
    tasks[index] = task;
  } else {
    tasks.push(task);
  }
  
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const removeTask = (taskId: string): void => {
  const tasks = getStoredTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
};

export const getTaskById = (taskId: string): Task | null => {
  const tasks = getStoredTasks();
  return tasks.find(task => task.id === taskId) || null;
};

// API Endpoints (for future MongoDB integration)
api.interceptors.request.use((config) => {
  const token = getStoredAuth();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error Handler
export const handleAPIError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred',
    };
  }
  return {
    success: false,
    message: 'An unexpected error occurred',
  };
};