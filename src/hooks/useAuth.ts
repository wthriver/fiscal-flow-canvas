
import { useState, useContext, createContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return mock auth for demo purposes
    return {
      user: {
        id: "1",
        name: "John Smith",
        email: "john@company.com",
        role: "Admin",
        permissions: ["full_access", "user_management", "financial_data"]
      },
      hasRole: (role: string) => ["Admin", "Owner"].includes(role),
      hasPermission: (permission: string) => true,
      login: async () => {},
      logout: () => {}
    };
  }
  return context;
};
