import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/Admin/axios';

interface Permission {
  id: number;
  name: string;
  display_name: string;
  guard_name: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  permissions?: Permission[];
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  cart_id: number | null;
  created_at: string;
  roles: Role[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  roles: string[];
  permissions: string[];
  isLoading: boolean;
  login: (token: string, userId: number) => Promise<void>;
  logout: () => void;
  hasPermission: (permissionName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: number) => {
    try {
      const response = await api.get<{ data: UserProfile }>(`/users/${userId}`);
      const userData = response.data.data;
      setUser(userData);
      
      const roleNames = userData.roles.map((r) => r.name);
      setRoles(roleNames);

      const permissionNames = userData.roles.reduce<string[]>((acc, r) => {
        if (r.permissions) {
          r.permissions.forEach((p) => {
            if (!acc.includes(p.name)) acc.push(p.name);
          });
        }
        return acc;
      }, []);
      setPermissions(permissionNames);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('nouh_carting_roken');
    const userId = localStorage.getItem('nouh_carting_user_id');
    if (token && userId) {
      fetchUserProfile(Number(userId));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string, userId: number) => {
    localStorage.setItem('nouh_carting_roken', token);
    localStorage.setItem('nouh_carting_user_id', String(userId));
    setIsLoading(true);
    await fetchUserProfile(userId);
  };

  const logout = () => {
    localStorage.removeItem('nouh_carting_roken');
    localStorage.removeItem('nouh_carting_user_id');
    setUser(null);
    setRoles([]);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  const hasPermission = (permissionName: string) => {
    return permissions.includes(permissionName);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        roles,
        permissions,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
