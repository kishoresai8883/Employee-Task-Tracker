import React, { createContext, useCallback, useEffect, useState } from 'react';
import { User, LoginFormData, SignupFormData } from '../types';
import { generateId } from '../utils/helpers';
import { 
  getUserByEmail, 
  storeUser, 
  storeAuth, 
  getStoredAuth, 
  removeAuth, 
  getUserById 
} from '../utils/api';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (data: LoginFormData) => Promise<{ success: boolean; message: string }>;
  signup: (data: SignupFormData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => void;
  isAdmin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize the app with default users if none exist
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    
    if (!storedUsers || JSON.parse(storedUsers).length === 0) {
      const defaultUsers = [
        {
          id: generateId(),
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          avatar: 'https://source.unsplash.com/random/100x100/?portrait,1',
        },
        {
          id: generateId(),
          name: 'John Employee',
          email: 'john@example.com',
          role: 'employee',
          avatar: 'https://source.unsplash.com/random/100x100/?portrait,2',
        },
        {
          id: generateId(),
          name: 'Jane Employee',
          email: 'jane@example.com',
          role: 'employee',
          avatar: 'https://source.unsplash.com/random/100x100/?portrait,3',
        },
      ];
      
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(users);
  }, []);

  const checkAuth = useCallback(() => {
    setLoading(true);
    const userId = getStoredAuth();
    
    if (userId) {
      const foundUser = getUserById(userId);
      if (foundUser) {
        setUser(foundUser);
        setIsAdmin(foundUser.role === 'admin');
      } else {
        removeAuth();
        setUser(null);
        setIsAdmin(false);
      }
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (data: LoginFormData): Promise<{ success: boolean; message: string }> => {
    // For demo purposes, we're not checking passwords
    const foundUser = getUserByEmail(data.email);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(foundUser.role === 'admin');
      storeAuth(foundUser.id);
      return { success: true, message: 'Login successful!' };
    }
    
    return { success: false, message: 'Invalid email or password.' };
  };

  const signup = async (data: SignupFormData): Promise<{ success: boolean; message: string }> => {
    const existingUser = getUserByEmail(data.email);
    
    if (existingUser) {
      return { success: false, message: 'Email is already in use.' };
    }
    
    if (data.password !== data.confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }
    
    const newUser: User = {
      id: generateId(),
      name: data.name,
      email: data.email,
      role: 'employee', // Default role is employee
      avatar: `https://source.unsplash.com/random/100x100/?portrait,${Math.floor(Math.random() * 100)}`,
    };
    
    storeUser(newUser);
    storeAuth(newUser.id);
    setUser(newUser);
    setIsAdmin(false); // New users are always employees
    
    // Update the users list
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    removeAuth();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        signup,
        logout,
        checkAuth,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};