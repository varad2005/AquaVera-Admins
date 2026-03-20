import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useUsers } from "@/hooks/use-mock-api";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Shield, MoreHorizontal, UserPlus } from "lucide-react";
import { useRole } from "@/context/role-context";

export default function UserManagement() {
  const { data: users, isLoading } = useUsers();
  const [activeTab, setActiveTab] = useState<'Farmers' | 'Sub-Admins' | 'Admins'>('Farmers');
  const { isAdmin } = useRole();

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Shield className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You do not have administrative privileges to view this page.</p>
        </div>
      </AppLayout>
    );
  }

  const filteredUsers = users?.filter(u => {
    if (activeTab === 'Farmers') return u.role === 'Farmer';
    if (activeTab === 'Sub-Admins') return u.role === 'Sub-Admin';
    if (activeTab === 'Admins') return u.role === 'Admin';
    return true;
  });

  return (
    <AppLayout>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Control access, roles, and view system users.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="flex border-b border-border px-4 pt-4 bg-muted/20">
          {['Farmers', 'Sub-Admins', 'Admins'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-card sticky top-0 z-10 border-b border-border shadow-sm shadow-black/5">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User / ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading users...</td>
                </tr>
              ) : filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No users found in this category.</td>
                </tr>
              ) : (
                filteredUsers?.map(user => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.id}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.status} type="user" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {format(new Date(user.lastLogin), 'MMM dd, HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
