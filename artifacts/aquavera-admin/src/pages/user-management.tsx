import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useUsers, useAddUser, useDeleteUser, useFarmers } from "@/hooks/use-mock-api";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { Shield, MoreHorizontal, UserPlus, Trash2, X, Search, MapPin, Droplets } from "lucide-react";
import { useRole } from "@/context/role-context";
import { User } from "@/data/mock-data";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function UserManagement() {
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const { data: farmers, isLoading: isLoadingFarmers } = useFarmers();
  const addUserMutation = useAddUser();
  const deleteUserMutation = useDeleteUser();
  
  const [activeTab, setActiveTab] = useState<'Farmers' | 'Sub-Admins' | 'Admins'>('Farmers');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '', role: 'Sub-Admin', status: 'Active' });
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUserMutation.mutate(newUser as any, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewUser({ name: '', email: '', phone: '', password: '', role: 'Sub-Admin', status: 'Active' });
      }
    });
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const isFarmersTab = activeTab === 'Farmers';
  const displayData = isFarmersTab ? farmers : users;
  const isLoading = isFarmersTab ? isLoadingFarmers : isLoadingUsers;

  const filteredData = displayData?.filter((u: any) => {
    if (!isFarmersTab) {
      if (activeTab === 'Sub-Admins' && u.role !== 'Sub-Admin') return false;
      if (activeTab === 'Admins' && u.role !== 'Admin') return false;
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) || 
        u.id.toLowerCase().includes(q) ||
        (isFarmersTab && (u.village?.toLowerCase().includes(q) || u.district?.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <AppLayout>
      <>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1 text-sm">Control access, roles, and view system users.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New System User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      required 
                      value={newUser.name} 
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                      placeholder="e.g. Rajesh Kumar" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input 
                        required 
                        type="email"
                        value={newUser.email} 
                        onChange={e => setNewUser({...newUser, email: e.target.value})}
                        placeholder="admin@example.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input 
                        required 
                        value={newUser.phone} 
                        onChange={e => setNewUser({...newUser, phone: e.target.value})}
                        placeholder="9876543210" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input 
                      required 
                      type="password"
                      value={newUser.password} 
                      onChange={e => setNewUser({...newUser, password: e.target.value})}
                      placeholder="••••••••" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Role</label>
                    <select 
                      className="w-full p-2 bg-background border rounded-md text-sm"
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="Sub-Admin">Sub-Admin</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={addUserMutation.isPending}>
                      {addUserMutation.isPending ? "Creating..." : "Create User"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
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
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {isFarmersTab ? 'Location' : 'Role'}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {isFarmersTab ? 'Connections' : 'Status'}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {isFarmersTab ? 'Last Sync' : 'Last Login'}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading {activeTab.toLowerCase()}...</td>
                  </tr>
                ) : filteredData?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No {activeTab.toLowerCase()} found.</td>
                  </tr>
                ) : (
                  filteredData?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">{item.id}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isFarmersTab ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.village}, {item.district}</span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">
                            {item.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isFarmersTab ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.activeConnections > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            <div className="flex items-center gap-1 text-xs font-medium">
                              <Droplets className="w-3.5 h-3.5 text-blue-500" />
                              <span>{item.activeConnections} Active</span>
                            </div>
                          </div>
                        ) : (
                          <StatusBadge status={item.status} type="user" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {isFarmersTab 
                          ? (item.lastConnection ? format(new Date(item.lastConnection), 'MMM dd, HH:mm') : 'Never')
                          : (item.lastLogin ? format(new Date(item.lastLogin), 'MMM dd, HH:mm') : 'Never')
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteUser(item.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete {isFarmersTab ? 'Farmer' : 'User'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    </AppLayout>
  );
}
