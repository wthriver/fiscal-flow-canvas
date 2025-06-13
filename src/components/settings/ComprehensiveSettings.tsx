
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building, 
  Users, 
  Shield, 
  Bell, 
  Globe, 
  Key, 
  Database, 
  FileText,
  Settings,
  Lock,
  Eye,
  Trash2,
  Plus,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

interface SecurityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
}

export const ComprehensiveSettings: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@company.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-10 14:30'
    },
    {
      id: '2',
      name: 'Jane Manager',
      email: 'manager@company.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-10 10:15'
    },
    {
      id: '3',
      name: 'Bob User',
      email: 'user@company.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-01-08 16:45'
    }
  ]);

  const [securityLogs] = useState<SecurityLog[]>([
    {
      id: '1',
      action: 'Login',
      user: 'admin@company.com',
      timestamp: '2024-01-10 14:30:15',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      action: 'Failed Login Attempt',
      user: 'unknown@domain.com',
      timestamp: '2024-01-10 13:45:22',
      ip: '203.0.113.1',
      status: 'failed'
    },
    {
      id: '3',
      action: 'Password Change',
      user: 'manager@company.com',
      timestamp: '2024-01-10 11:20:30',
      ip: '192.168.1.105',
      status: 'success'
    }
  ]);

  const [companySettings, setCompanySettings] = useState({
    name: 'Acme Corporation',
    address: '123 Business St',
    city: 'Business City',
    state: 'BC',
    zip: '12345',
    phone: '(555) 123-4567',
    email: 'info@acme.com',
    website: 'www.acme.com',
    taxId: '12-3456789',
    fiscalYearEnd: 'December 31'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordComplexity: true,
    sessionTimeout: 30,
    ipRestrictions: false,
    auditLogging: true,
    dataEncryption: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    invoiceReminders: true,
    paymentAlerts: true,
    securityAlerts: true,
    systemUpdates: false
  });

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
    viewer: 'bg-gray-100 text-gray-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  const logStatusColors = {
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  const handleUpdateCompanySettings = () => {
    toast.success("Company settings updated successfully");
  };

  const handleUpdateSecuritySettings = () => {
    toast.success("Security settings updated successfully");
  };

  const handleUpdateNotificationSettings = () => {
    toast.success("Notification settings updated successfully");
  };

  const handleInviteUser = () => {
    toast.success("User invitation sent");
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast.success("User status updated");
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success("User deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your company settings, users, and security preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Backup</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Compliance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <p className="text-sm text-muted-foreground">Update your company details and business information</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={companySettings.taxId}
                    onChange={(e) => setCompanySettings({...companySettings, taxId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={companySettings.city}
                    onChange={(e) => setCompanySettings({...companySettings, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={companySettings.state}
                    onChange={(e) => setCompanySettings({...companySettings, state: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={companySettings.zip}
                    onChange={(e) => setCompanySettings({...companySettings, zip: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscalYear">Fiscal Year End</Label>
                  <Select 
                    value={companySettings.fiscalYearEnd} 
                    onValueChange={(value) => setCompanySettings({...companySettings, fiscalYearEnd: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="December 31">December 31</SelectItem>
                      <SelectItem value="March 31">March 31</SelectItem>
                      <SelectItem value="June 30">June 30</SelectItem>
                      <SelectItem value="September 30">September 30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleUpdateCompanySettings}>
                  Save Company Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
                  </div>
                  <Button onClick={handleInviteUser}>
                    <Plus className="mr-2 h-4 w-4" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={roleColors[user.role]}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[user.status]}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeactivateUser(user.id)}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Configure security and access controls</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all user logins</p>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password Complexity</Label>
                    <p className="text-sm text-muted-foreground">Require strong passwords</p>
                  </div>
                  <Switch 
                    checked={securitySettings.passwordComplexity}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, passwordComplexity: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Restrictions</Label>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                  </div>
                  <Switch 
                    checked={securitySettings.ipRestrictions}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, ipRestrictions: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all user activities</p>
                  </div>
                  <Switch 
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, auditLogging: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout.toString()} 
                    onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(value)})}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleUpdateSecuritySettings}>
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Logs</CardTitle>
                <p className="text-sm text-muted-foreground">Recent security events and activities</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.ip}</TableCell>
                        <TableCell>
                          <Badge className={logStatusColors[log.status]}>{log.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Configure how you receive notifications</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch 
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Invoice Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send automatic invoice reminders</p>
                </div>
                <Switch 
                  checked={notificationSettings.invoiceReminders}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, invoiceReminders: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Payment Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when payments are received</p>
                </div>
                <Switch 
                  checked={notificationSettings.paymentAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, paymentAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive security-related notifications</p>
                </div>
                <Switch 
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, securityAlerts: checked})}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleUpdateNotificationSettings}>
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
                <p className="text-sm text-muted-foreground">Manage data backups and recovery options</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic daily backups</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Recent Backups</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Full Backup - January 10, 2024</p>
                        <p className="text-sm text-muted-foreground">Size: 2.4 GB</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Download</Button>
                        <Button size="sm" variant="outline">Restore</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Full Backup - January 9, 2024</p>
                        <p className="text-sm text-muted-foreground">Size: 2.3 GB</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Download</Button>
                        <Button size="sm" variant="outline">Restore</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button>Create Backup Now</Button>
                  <Button variant="outline">Upload Backup</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Certifications</CardTitle>
                <p className="text-sm text-muted-foreground">Manage compliance requirements and certifications</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">SOX Compliance</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Enabled</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sarbanes-Oxley compliance controls are active
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">GDPR Compliance</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Enabled</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Data protection and privacy controls are active
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">PCI DSS</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending Certification</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Payment card industry data security standards
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">ISO 27001</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Not Certified</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Information security management system
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Compliance Reports</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Annual Compliance Report 2024</p>
                        <p className="text-sm text-muted-foreground">Generated on January 1, 2024</p>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Quarterly Security Assessment Q4 2023</p>
                        <p className="text-sm text-muted-foreground">Generated on December 31, 2023</p>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button>Generate Compliance Report</Button>
                  <Button variant="outline">Schedule Assessment</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
