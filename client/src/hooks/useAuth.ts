import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isAdmin?: boolean;
}

// Development auth - keeps user permanently logged in during development
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-login for development - create a persistent demo user
    const developmentUser: User = {
      id: "dev_user_1",
      email: "developer@getupear.lier.com",
      firstName: "Developer",
      lastName: "User",
      isAdmin: true
    };
    
    setUser(developmentUser);
    localStorage.setItem('demo_user', JSON.stringify(developmentUser));
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    const demoUser: User = {
      id: `user_${Date.now()}`,
      email,
      firstName: email.split('@')[0],
      lastName: 'Demo',
      isAdmin: email.includes('admin')
    };
    setUser(demoUser);
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    // In development, immediately re-login to stay authenticated
    const developmentUser: User = {
      id: "dev_user_1",
      email: "developer@getupear.lier.com",
      firstName: "Developer",
      lastName: "User",
      isAdmin: true
    };
    setUser(developmentUser);
    localStorage.setItem('demo_user', JSON.stringify(developmentUser));
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    logout
  };
}