export type Role = 'admin' | 'employee';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  assigneeName: string;
  createdById: string;
  createdByName: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
};

export type Comment = {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
};

export type TaskFormData = {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  deadline: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type TaskFilter = {
  status?: string;
  priority?: string;
  assigneeId?: string;
  search?: string;
};

export type Notification = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
};