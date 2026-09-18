import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'Admin' | 'Sub-Admin' | 'Farmer';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: Role;
  department?: string;
  id: string;
  isProfileComplete?: number;
  aadhaar?: string;
  landRecordId?: string;
  plotNumber?: string;
  state?: string;
  city?: string;
  taluka?: string;
  pinCode?: string;
  surveyNumber?: string;
}

interface RoleContextType {
  role: Role | null;
  setRole: (role: Role) => void;
  isAdmin: boolean;
  isFarmer: boolean;
  isSubAdmin: boolean;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch session on mount
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setRole(data.role);
      })
      .catch(() => {
        setUser(null);
        setRole(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  const handleSetRole = (newRole: Role) => {
    // We only update state, but backend is the true source of authority now
    setRole(newRole);
  };

  useEffect(() => {
    if (user) {
      setRole(user.role);
    } else {
      setRole(null);
    }
  }, [user]);

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole: handleSetRole, 
      isAdmin: role === 'Admin',
      isFarmer: role === 'Farmer',
      isSubAdmin: role === 'Sub-Admin',
      user,
      setUser,
      isLoading
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
