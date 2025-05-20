import { Task, User, Notification } from '../types';

// User related storage
export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const storeUser = (user: User): void => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('users', JSON.stringify(users));
};

export const removeUser = (userId: string): void => {
  const users = getStoredUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  localStorage.setItem('users', JSON.stringify(filteredUsers));
};

export const getUserById = (userId: string): User | undefined => {
  const users = getStoredUsers();
  return users.find(user => user.id === userId);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getStoredUsers();
  return users.find(user => user.email === email);
};

// Task related storage
export const getStoredTasks = (): Task[] => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

export const storeTask = (task: Task): void => {
  const tasks = getStoredTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const removeTask = (taskId: string): void => {
  const tasks = getStoredTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(filteredTasks));
};

export const getTaskById = (taskId: string): Task | undefined => {
  const tasks = getStoredTasks();
  return tasks.find(task => task.id === taskId);
};

export const getTasksByAssignee = (assigneeId: string): Task[] => {
  const tasks = getStoredTasks();
  return tasks.filter(task => task.assigneeId === assigneeId);
};

export const getTasksByCreator = (creatorId: string): Task[] => {
  const tasks = getStoredTasks();
  return tasks.filter(task => task.createdById === creatorId);
};

// Auth related storage
export const storeAuth = (userId: string): void => {
  localStorage.setItem('currentUser', userId);
};

export const getStoredAuth = (): string | null => {
  return localStorage.getItem('currentUser');
};

export const removeAuth = (): void => {
  localStorage.removeItem('currentUser');
};

// Notifications related storage
export const getStoredNotifications = (userId: string): Notification[] => {
  const key = `notifications_${userId}`;
  const notifications = localStorage.getItem(key);
  return notifications ? JSON.parse(notifications) : [];
};

export const storeNotification = (userId: string, notification: Notification): void => {
  const notifications = getStoredNotifications(userId);
  notifications.push(notification);
  localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
};

export const markNotificationAsRead = (userId: string, notificationId: string): void => {
  const notifications = getStoredNotifications(userId);
  const updatedNotifications = notifications.map(notif => 
    notif.id === notificationId ? { ...notif, read: true } : notif
  );
  localStorage.setItem(`notifications_${userId}`, JSON.stringify(updatedNotifications));
};

export const clearNotifications = (userId: string): void => {
  localStorage.removeItem(`notifications_${userId}`);
};
