
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication functions for now - to be replaced with real auth later
const mockUsers = [
  { id: '1', email: 'user@example.com', password: 'password', name: 'Demo User' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('healingMiraclesUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('healingMiraclesUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('healingMiraclesUser');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        
        toast({
          title: "Welcome back!",
          description: `You've successfully logged in.`,
        });
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        toast({
          title: "Registration Failed",
          description: "Email already in use. Please try a different email.",
          variant: "destructive"
        });
        return false;
      }
      
      // Create new user
      const newUser = { id: String(Date.now()), email, password, name };
      mockUsers.push(newUser);
      
      // Log the user in
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword as User);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created and you're now logged in.",
      });
      
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userExists = mockUsers.some(u => u.email === email);
      
      if (userExists) {
        toast({
          title: "Password Reset Email Sent",
          description: "Check your inbox for instructions to reset your password.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "No account found with that email address.",
          variant: "destructive"
        });
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
