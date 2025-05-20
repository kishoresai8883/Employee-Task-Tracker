import { format, isToday, isTomorrow, addDays, isPast } from 'date-fns';
import { Task, User } from '../types';

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format date for display
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  } else if (isTomorrow(dateObj)) {
    return `Tomorrow at ${format(dateObj, 'h:mm a')}`;
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
};

// Check if a deadline is approaching (within 2 days)
export const isDeadlineApproaching = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  const twoDaysFromNow = addDays(new Date(), 2);
  
  return deadlineDate <= twoDaysFromNow && !isPast(deadlineDate);
};

// Check if a deadline is past
export const isDeadlinePast = (deadline: string): boolean => {
  return isPast(new Date(deadline));
};

// Format the task priority for display
export const formatPriority = (priority: string): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

// Get tasks count by status
export const getTasksCountByStatus = (tasks: Task[]): Record<string, number> => {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
};

// Get tasks count by priority
export const getTasksCountByPriority = (tasks: Task[]): Record<string, number> => {
  return tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
};

// Get color class based on task status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-warning-100 text-warning-800';
    case 'in-progress':
      return 'bg-accent-100 text-accent-800';
    case 'completed':
      return 'bg-success-100 text-success-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get color class based on task priority
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-error-100 text-error-800';
    case 'medium':
      return 'bg-warning-100 text-warning-800';
    case 'low':
      return 'bg-success-100 text-success-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Sort tasks by different criteria
export const sortTasks = (tasks: Task[], sortBy: string): Task[] => {
  const sortedTasks = [...tasks];
  
  switch (sortBy) {
    case 'deadline':
      return sortedTasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    case 'priority':
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return sortedTasks.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);
    case 'status':
      const statusOrder = { 'pending': 0, 'in-progress': 1, 'completed': 2 };
      return sortedTasks.sort((a, b) => statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]);
    case 'newest':
      return sortedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sortedTasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    default:
      return sortedTasks;
  }
};

// Filter users by role
export const filterUsersByRole = (users: User[], role: string): User[] => {
  if (!role || role === 'all') return users;
  return users.filter(user => user.role === role);
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Format timestamp
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return format(date, 'MMM d, yyyy h:mm a');
};