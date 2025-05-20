import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Task, TaskFormData, TaskFilter } from '../types';
import { generateId, formatDate } from '../utils/helpers';
import { getStoredTasks, storeTask, removeTask, getTaskById } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  createTask: (data: TaskFormData) => Promise<{ success: boolean; message: string; taskId?: string }>;
  updateTask: (taskId: string, data: TaskFormData) => Promise<{ success: boolean; message: string }>;
  deleteTask: (taskId: string) => Promise<{ success: boolean; message: string }>;
  getTask: (taskId: string) => Task | undefined;
  updateTaskStatus: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => Promise<{ success: boolean; message: string }>;
  addComment: (taskId: string, text: string) => Promise<{ success: boolean; message: string }>;
  fetchTasks: () => void;
  setFilter: (filter: TaskFilter) => void;
  filter: TaskFilter;
}

export const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<TaskFilter>({});
  const { user } = useAuth();

  const fetchTasks = useCallback(() => {
    setLoading(true);
    const storedTasks = getStoredTasks();
    setTasks(storedTasks);
    setLoading(false);
  }, []);

  // Load tasks from localStorage on mount
  useEffect(() => {
    // Create some sample tasks if none exist
    const storedTasks = localStorage.getItem('tasks');
    
    if (!storedTasks || JSON.parse(storedTasks).length === 0) {
      const defaultTasks: Task[] = [
        {
          id: generateId(),
          title: 'Complete project documentation',
          description: 'Finalize all project documentation for the client handover.',
          status: 'pending',
          priority: 'high',
          assigneeId: JSON.parse(localStorage.getItem('users') || '[]')[1]?.id || '',
          assigneeName: JSON.parse(localStorage.getItem('users') || '[]')[1]?.name || '',
          createdById: JSON.parse(localStorage.getItem('users') || '[]')[0]?.id || '',
          createdByName: JSON.parse(localStorage.getItem('users') || '[]')[0]?.name || '',
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
        },
        {
          id: generateId(),
          title: 'Review code changes',
          description: 'Review and approve the latest code changes for the upcoming release.',
          status: 'in-progress',
          priority: 'medium',
          assigneeId: JSON.parse(localStorage.getItem('users') || '[]')[2]?.id || '',
          assigneeName: JSON.parse(localStorage.getItem('users') || '[]')[2]?.name || '',
          createdById: JSON.parse(localStorage.getItem('users') || '[]')[0]?.id || '',
          createdByName: JSON.parse(localStorage.getItem('users') || '[]')[0]?.name || '',
          deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          comments: [
            {
              id: generateId(),
              text: 'I found some issues with the authentication flow. Please check.',
              userId: JSON.parse(localStorage.getItem('users') || '[]')[0]?.id || '',
              userName: JSON.parse(localStorage.getItem('users') || '[]')[0]?.name || '',
              createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            }
          ],
        },
        {
          id: generateId(),
          title: 'Update website content',
          description: 'Update the company website with new content for the product launch.',
          status: 'completed',
          priority: 'low',
          assigneeId: JSON.parse(localStorage.getItem('users') || '[]')[1]?.id || '',
          assigneeName: JSON.parse(localStorage.getItem('users') || '[]')[1]?.name || '',
          createdById: JSON.parse(localStorage.getItem('users') || '[]')[0]?.id || '',
          createdByName: JSON.parse(localStorage.getItem('users') || '[]')[0]?.name || '',
          deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          comments: [
            {
              id: generateId(),
              text: 'All content has been updated and reviewed by the marketing team.',
              userId: JSON.parse(localStorage.getItem('users') || '[]')[1]?.id || '',
              userName: JSON.parse(localStorage.getItem('users') || '[]')[1]?.name || '',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ],
        },
      ];
      
      localStorage.setItem('tasks', JSON.stringify(defaultTasks));
    }
    
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks when the filter changes or tasks update
  useEffect(() => {
    if (!tasks.length) {
      setFilteredTasks([]);
      return;
    }
    
    let result = [...tasks];
    
    // Filter by status
    if (filter.status && filter.status !== 'all') {
      result = result.filter(task => task.status === filter.status);
    }
    
    // Filter by priority
    if (filter.priority && filter.priority !== 'all') {
      result = result.filter(task => task.priority === filter.priority);
    }
    
    // Filter by assignee
    if (filter.assigneeId && filter.assigneeId !== 'all') {
      result = result.filter(task => task.assigneeId === filter.assigneeId);
    }
    
    // Filter by search text
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by user role (employee sees only their tasks)
    if (user && user.role === 'employee') {
      result = result.filter(task => task.assigneeId === user.id);
    }
    
    setFilteredTasks(result);
  }, [tasks, filter, user]);

  const createTask = async (data: TaskFormData): Promise<{ success: boolean; message: string; taskId?: string }> => {
    if (!user) return { success: false, message: 'You must be logged in to create a task.' };
    
    try {
      const newTask: Task = {
        id: generateId(),
        ...data,
        assigneeName: JSON.parse(localStorage.getItem('users') || '[]').find(u => u.id === data.assigneeId)?.name || '',
        createdById: user.id,
        createdByName: user.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
      };
      
      storeTask(newTask);
      setTasks(prev => [...prev, newTask]);
      
      return { success: true, message: 'Task created successfully!', taskId: newTask.id };
    } catch (error) {
      return { success: false, message: 'Failed to create task.' };
    }
  };

  const updateTask = async (taskId: string, data: TaskFormData): Promise<{ success: boolean; message: string }> => {
    const existingTask = getTaskById(taskId);
    
    if (!existingTask) {
      return { success: false, message: 'Task not found.' };
    }
    
    try {
      const updatedTask: Task = {
        ...existingTask,
        ...data,
        assigneeName: JSON.parse(localStorage.getItem('users') || '[]').find(u => u.id === data.assigneeId)?.name || '',
        updatedAt: new Date().toISOString(),
      };
      
      storeTask(updatedTask);
      
      setTasks(prev =>
        prev.map(task => (task.id === taskId ? updatedTask : task))
      );
      
      return { success: true, message: 'Task updated successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to update task.' };
    }
  };

  const deleteTask = async (taskId: string): Promise<{ success: boolean; message: string }> => {
    try {
      removeTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      return { success: true, message: 'Task deleted successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to delete task.' };
    }
  };

  const getTask = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  };

  const updateTaskStatus = async (taskId: string, status: 'pending' | 'in-progress' | 'completed'): Promise<{ success: boolean; message: string }> => {
    const existingTask = getTaskById(taskId);
    
    if (!existingTask) {
      return { success: false, message: 'Task not found.' };
    }
    
    try {
      const updatedTask: Task = {
        ...existingTask,
        status,
        updatedAt: new Date().toISOString(),
      };
      
      storeTask(updatedTask);
      
      setTasks(prev =>
        prev.map(task => (task.id === taskId ? updatedTask : task))
      );
      
      return { success: true, message: 'Task status updated successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to update task status.' };
    }
  };

  const addComment = async (taskId: string, text: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'You must be logged in to add a comment.' };
    
    const existingTask = getTaskById(taskId);
    
    if (!existingTask) {
      return { success: false, message: 'Task not found.' };
    }
    
    try {
      const newComment = {
        id: generateId(),
        text,
        userId: user.id,
        userName: user.name,
        createdAt: new Date().toISOString(),
      };
      
      const updatedTask: Task = {
        ...existingTask,
        comments: [...existingTask.comments, newComment],
        updatedAt: new Date().toISOString(),
      };
      
      storeTask(updatedTask);
      
      setTasks(prev =>
        prev.map(task => (task.id === taskId ? updatedTask : task))
      );
      
      return { success: true, message: 'Comment added successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to add comment.' };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        loading,
        createTask,
        updateTask,
        deleteTask,
        getTask,
        updateTaskStatus,
        addComment,
        fetchTasks,
        setFilter,
        filter,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};