import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  user: any; // Replace with proper User type
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider?: string, options?: any) => Promise<any>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const session = await authService.getSession();
        if (session) {
          setUser(session.user || session);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up session change listener if supported by auth library
    // This is where we'd handle token refresh or session changes
  }, []);

  const signIn = async (provider = 'email', options = {}) => {
    try {
      const result = await authService.signIn(provider, options);
      if (!result?.error) {
        // Get updated session after sign in
        const session = await authService.getSession();
        if (session) {
          setUser(session.user || session);
          setIsAuthenticated(true);
        }
      }
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const session = await authService.getSession();
      if (session) {
        setUser(session.user || session);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    initializeAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};