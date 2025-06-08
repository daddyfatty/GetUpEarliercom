import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

// Simple auth simulation for testing
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('demo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    const demoUser: User = {
      id: `user_${Date.now()}`,
      email,
      firstName: email.split('@')[0],
      lastName: 'Demo'
    };
    setUser(demoUser);
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}