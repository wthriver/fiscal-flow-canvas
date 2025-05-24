
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Users, Shield, Settings, Plus, Key } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Manager" | "User" | "Viewer";
  permissions: string[];
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
  department: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "user-1",
      name: "John Admin",
      email: "admin@company.com",
      role: "Admin",
      permissions: ["full_access", "user_management", "financial_data"],
      status: "Active",
      lastLogin: "2025-05-24",
      department: "Management"
    },
    {
      id: "user-2",
      name: "Jane Manager",
      email: "manager@company.com",
      role: "Manager",
      permissions: ["financial_data", "reports", "invoices"],
      status: "Active",
      lastLogin: "2025-05-23",
      department: "Finance"
    },
    {
      id: "user-3",
      name: "Bob User",
      email: "user@company.com",
      role: "User",
      permissions: ["invoices", "expenses"],
      status: "Active",
      lastLogin: "2025-05-22",
      department: "Sales"
    }
  ]);

  const [roles] = useState<Role[]>([
    {
      id: "role-1",
      name: "Owner",
      permissions: ["full_access", "user_management", "financial_data", "settings", "billing"],
      description: "Full system access"
    },
    {
      id: "role-2",
      name: "Admin",
      permissions: ["user_management", "financial_data", "settings", "reports"],
      description: "Administrative access"
    },
    {
      id: "role-3",
      name: "Manager",
      permissions: ["financial_data", "reports", "invoices", "expenses"],
      description: "Management access"
    },
    {
      id: "role-4",
      name: "User",
      permissions: ["invoices", "expenses", "time_tracking"],
      description: "Standard user access"
    },
    {
      id: "role-5",
      name: "Viewer",
      permissions: ["view_reports"],
      description: "Read-only access"
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    department: ""
  });

  const [isNewUserOpen, setIsNewUserOpen] = useState(false);

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in required fields");
      return;
    }

    const role = roles.find(r => r.name === newUser.role);
    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as User["role"],
      permissions: role?.permissions || [],
      status: "Pending",
      lastLogin: "Never",
      department: newUser.department
    };

    setUsers(prev => [user, ...prev]);
    setNewUser({
      name: "",
      email: "",
      role: "User",
      department: ""
    });
    setIsNewUserOpen(false);
    toast.success("User invitation sent");
  };

  const updateUserStatus = (userId: string, status: User["status"]) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
    toast.success(`User status updated to ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Inactive": return "secondary";
      case "Pending": return "secondary";
      default: return "secondary";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner": return "destructive";
      case "Admin": return "default";
      case "Manager": return "default";
      case "User": return "secondary";
      case "Viewer": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name} - {role.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  placeholder="e.g., Finance, Sales, Marketing"
                />
              </div>
              <Button onClick={handleCreateUser} className="w-full">
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-semibold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-xl font-semibold">{users.filter(u => u.status === "Active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-xl font-semibold">{users.filter(u => u.role === "Admin" || u.role === "Owner").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold">{users.filter(u => u.status === "Pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.status === "Active"}
                        onCheckedChange={(checked) => 
                          updateUserStatus(user.id, checked ? "Active" : "Inactive")
                        }
                      />
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit Permissions
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
