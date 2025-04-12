
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Shield, 
  Mail, 
  MoreVertical,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Accountant" | "Viewer";
  status: "Active" | "Pending" | "Suspended";
  lastActive: string;
}

export function UsersPermissionsSettings() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "Just now"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Manager",
      status: "Active",
      lastActive: "2 hours ago"
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      role: "Accountant",
      status: "Active",
      lastActive: "Yesterday"
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Viewer",
      status: "Pending",
      lastActive: "Never"
    }
  ]);
  
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Manager" | "Accountant" | "Viewer">("Viewer");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleInviteUser = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    // Add the new user with pending status
    const newUser: User = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: "Pending",
      lastActive: "Never"
    };
    
    setUsers([...users, newUser]);
    setInviteDialogOpen(false);
    setInviteEmail("");
    setInviteRole("Viewer");
    
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const saveUserChanges = () => {
    if (!editingUser) return;
    
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setIsEditDialogOpen(false);
    setEditingUser(null);
    toast.success("User updated successfully");
  };

  const resendInvitation = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
  };

  const removeUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("User removed successfully");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Users & Permissions</CardTitle>
        </div>
        <CardDescription>Manage users and their access to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
        
        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-muted py-3 px-4 text-sm font-medium">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Last Active</div>
            <div className="col-span-1"></div>
          </div>
          
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-12 items-center border-t py-3 px-4">
              <div className="col-span-4">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
              <div className="col-span-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'Admin' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
                    : user.role === 'Manager'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : user.role === 'Accountant'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="col-span-2">
                {user.status === 'Active' ? (
                  <span className="inline-flex items-center text-xs">
                    <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                    Active
                  </span>
                ) : user.status === 'Pending' ? (
                  <span className="inline-flex items-center text-xs text-amber-600">
                    <span className="mr-1 h-2 w-2 rounded-full bg-amber-500"></span>
                    Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <XCircle className="mr-1 h-3 w-3 text-gray-400" />
                    Suspended
                  </span>
                )}
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {user.lastActive}
              </div>
              <div className="col-span-1 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Edit Permissions
                    </DropdownMenuItem>
                    {user.status === 'Pending' && (
                      <DropdownMenuItem onClick={() => resendInvitation(user.email)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Invitation
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={() => removeUser(user.id)}
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {/* Invite User Dialog */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite User</DialogTitle>
              <DialogDescription>
                Send an invitation to a team member to join your account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={inviteRole} 
                  onValueChange={(value) => setInviteRole(value as "Admin" | "Manager" | "Accountant" | "Viewer")}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Accountant">Accountant</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteUser}>
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editingUser.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRole">Role</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser({...editingUser, role: value as "Admin" | "Manager" | "Accountant" | "Viewer"})}
                  >
                    <SelectTrigger id="editRole">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editingUser.status} 
                    onValueChange={(value) => setEditingUser({...editingUser, status: value as "Active" | "Pending" | "Suspended"})}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveUserChanges}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
