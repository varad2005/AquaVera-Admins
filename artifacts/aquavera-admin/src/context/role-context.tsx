import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'Admin' | 'Sub-Admin';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: Role;
  department: string;
  id: string;
}

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
  user: UserProfile;
}

const ADMIN_PROFILE: UserProfile = {
  id: "AV-ADM-001",
  name: "Varad Deshmukh",
  email: "admin@aquavera.gov.in",
  phone: "+91 88888 77777",
  role: "Admin",
  department: "Water Allocation Board"
};

const SUB_ADMIN_PROFILE: UserProfile = {
  id: "AV-SUB-042",
  name: "Rajesh Soni",
  email: "subadmin@aquavera.gov.in",
  phone: "+91 99999 66666",
  role: "Sub-Admin",
  department: "Regional Irrigation Office"
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Admin');
  
  const user = role === 'Admin' ? ADMIN_PROFILE : SUB_ADMIN_PROFILE;

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole, 
      isAdmin: role === 'Admin',
      user: user
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
