
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, UserPlus, Shield, Settings, Users, Crown } from "lucide-react";
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
  phone?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  isSystem?: boolean;
  userCount?: number;
}

export const UserManagement = () => {
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  // Mock users data
  const users: User[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john@company.com",
      role: "Owner",
      permissions: ["full_access"],
      status: "Active",
      lastLogin: "2024-01-25 09:30 AM",
      department: "Management",
      phone: "+1 555-0123"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Admin",
      permissions: ["user_management", "financial_data", "reports"],
      status: "Active",
      lastLogin: "2024-01-25 08:45 AM",
      department: "Finance",
      phone: "+1 555-0124"
    },
    {
      id: "3",
      name: "Mike Davis",
      email: "mike@company.com",
      role: "Manager",
      permissions: ["team_management", "basic_reports"],
      status: "Active",
      lastLogin: "2024-01-24 05:20 PM",
      department: "Operations"
    },
    {
      id: "4",
      name: "Emily Wilson",
      email: "emily@company.com",
      role: "User",
      permissions: ["basic_access"],
      status: "Inactive",
      lastLogin: "2024-01-20 02:15 PM",
      department: "Sales"
    }
  ];

  // Mock roles data
  const roles: Role[] = [
    {
      id: "owner",
      name: "Owner",
      permissions: ["full_access"],
      description: "Complete access to all features and settings",
      isSystem: true,
      userCount: 1
    },
    {
      id: "admin",
      name: "Admin",
      permissions: ["user_management", "financial_data", "reports", "settings"],
      description: "Administrative access with user management capabilities",
      isSystem: true,
      userCount: 1
    },
    {
      id: "manager",
      name: "Manager",
      permissions: ["team_management", "basic_reports", "project_access"],
      description: "Team management and reporting access",
      isSystem: true,
      userCount: 1
    },
    {
      id: "user",
      name: "User",
      permissions: ["basic_access", "time_tracking"],
      description: "Standard user access for daily operations",
      isSystem: true,
      userCount: 1
    },
    {
      id: "viewer",
      name: "Viewer",
      permissions: ["read_only"],
      description: "Read-only access to reports and data",
      isSystem: true,
      userCount: 0
    }
  ];

  const allPermissions = [
    { id: "full_access", name: "Full Access", description: "Complete system access" },
    { id: "user_management", name: "User Management", description: "Manage users and roles" },
    { id: "financial_data", name: "Financial Data", description: "Access financial records" },
    { id: "reports", name: "Reports", description: "Generate and view reports" },
    { id: "settings", name: "Settings", description: "Modify system settings" },
    { id: "team_management", name: "Team Management", description: "Manage team members" },
    { id: "project_access", name: "Project Access", description: "Access project data" },
    { id: "basic_access", name: "Basic Access", description: "Standard user features" },
    { id: "time_tracking", name: "Time Tracking", description: "Track time and attendance" },
    { id: "read_only", name: "Read Only", description: "View-only access" }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "Admin":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "Manager":
        return <Settings className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={newRoleOpen} onOpenChange={setNewRoleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role Name</Label>
                    <Input placeholder="Custom Role" />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input placeholder="Department" />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input placeholder="Role description..." />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {allPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox id={permission.id} />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setNewRoleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("Role created successfully");
                  setNewRoleOpen(false);
                }}>
                  Create Role
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="John Doe" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@company.com" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Phone (Optional)</Label>
                  <Input placeholder="+1 555-0123" />
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern (EST)</SelectItem>
                      <SelectItem value="cst">Central (CST)</SelectItem>
                      <SelectItem value="mst">Mountain (MST)</SelectItem>
                      <SelectItem value="pst">Pacific (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setNewUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("User invitation sent successfully");
                  setNewUserOpen(false);
                }}>
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-600">Pending Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => u.status === "Pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{roles.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("users")}
        >
          Users
        </Button>
        <Button
          variant={activeTab === "roles" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("roles")}
        >
          Roles & Permissions
        </Button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
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
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Permissions
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role.name)}
                        <div>
                          <div className="font-medium">{role.name}</div>
                          {role.isSystem && (
                            <Badge variant="outline" className="text-xs">System</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm">{role.description}</p>
                    </TableCell>
                    <TableCell>{role.userCount}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" disabled={role.isSystem}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Permissions
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
