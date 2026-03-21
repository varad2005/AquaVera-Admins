import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [role, setRole] = useState<Role | null>(user?.role || null);
  
  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
  };

  // Keep role in sync with user.role
  React.useEffect(() => {
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
      setUser
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
