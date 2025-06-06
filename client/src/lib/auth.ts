import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  subscriptionTier: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    const data = await response.json();
    
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    }
    
    throw new Error("Login failed");
  },

  async register(userData: RegisterData): Promise<User> {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    const data = await response.json();
    
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    }
    
    throw new Error("Registration failed");
  },

  logout(): void {
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.isAdmin : false;
  },
};
