
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, Shield, Bell, CreditCard, Users, Building, 
  Globe, Database, Lock, AlertTriangle, CheckCircle 
} from "lucide-react";
import { toast } from "sonner";
import { RoleBasedAccess } from "@/components/auth/RoleBasedAccess";

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high";
}

interface NotificationSetting {
  id: string;
  category: string;
  name: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
}

export const ComprehensiveSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  const securityPolicies: SecurityPolicy[] = [
    {
      id: "password",
      name: "Strong Password Policy",
      description: "Require complex passwords with minimum 8 characters",
      enabled: true,
      severity: "high"
    },
    {
      id: "2fa",
      name: "Two-Factor Authentication",
      description: "Require 2FA for all admin users",
      enabled: true,
      severity: "high"
    },
    {
      id: "session",
      name: "Session Timeout",
      description: "Auto-logout after 30 minutes of inactivity",
      enabled: true,
      severity: "medium"
    },
    {
      id: "ip-whitelist",
      name: "IP Address Restrictions",
      description: "Restrict access to specific IP addresses",
      enabled: false,
      severity: "high"
    }
  ];

  const notificationSettings: NotificationSetting[] = [
    {
      id: "invoices",
      category: "Finance",
      name: "Invoice payments received",
      email: true,
      inApp: true,
      sms: false
    },
    {
      id: "expenses",
      category: "Finance", 
      name: "Large expense approvals",
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: "security",
      category: "Security",
      name: "Failed login attempts",
      email: true,
      inApp: true,
      sms: true
    },
    {
      id: "backups",
      category: "System",
      name: "Backup status updates",
      email: false,
      inApp: true,
      sms: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const toggleSecurityPolicy = (id: string) => {
    toast.success("Security policy updated");
  };

  const updateNotificationSetting = (id: string, channel: string, value: boolean) => {
    toast.success("Notification setting updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Comprehensive Settings
          </h2>
          <p className="text-muted-foreground">Manage all system settings and configurations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>Basic company details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <Input defaultValue="Acme Corporation" />
                </div>
                <div>
                  <label className="text-sm font-medium">Industry</label>
                  <Select defaultValue="technology">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Company Size</label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">1-50 employees</SelectItem>
                      <SelectItem value="medium">51-200 employees</SelectItem>
                      <SelectItem value="large">201-1000 employees</SelectItem>
                      <SelectItem value="enterprise">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Time Zone</label>
                  <Select defaultValue="est">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Company Address</label>
                <Textarea placeholder="123 Business St, Suite 100" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date Format</label>
                  <Select defaultValue="mdy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Number Format</label>
                  <Select defaultValue="us">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">1,234.56 (US)</SelectItem>
                      <SelectItem value="eu">1.234,56 (EU)</SelectItem>
                      <SelectItem value="space">1 234,56 (Space)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Save Regional Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Policies
              </CardTitle>
              <CardDescription>Configure security requirements and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityPolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {policy.enabled ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <h4 className="font-medium">{policy.name}</h4>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(policy.severity)}>
                        {policy.severity} priority
                      </Badge>
                    </div>
                    <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
                      <Switch
                        checked={policy.enabled}
                        onCheckedChange={() => toggleSecurityPolicy(policy.id)}
                      />
                    </RoleBasedAccess>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Access Control
              </CardTitle>
              <CardDescription>Manage user access and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Require approval for new users</h4>
                  <p className="text-sm text-muted-foreground">Admin approval required for new account creation</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable audit logging</h4>
                  <p className="text-sm text-muted-foreground">Log all user actions for security monitoring</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <label className="text-sm font-medium">Session timeout (minutes)</label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="120">120</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Update Access Control</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 pb-2 border-b">
                  <div className="font-medium">Notification</div>
                  <div className="font-medium text-center">Email</div>
                  <div className="font-medium text-center">In-App</div>
                  <div className="font-medium text-center">SMS</div>
                </div>
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="grid grid-cols-4 gap-4 items-center">
                    <div>
                      <div className="font-medium">{setting.name}</div>
                      <div className="text-xs text-muted-foreground">{setting.category}</div>
                    </div>
                    <div className="text-center">
                      <Switch
                        checked={setting.email}
                        onCheckedChange={(value) => updateNotificationSetting(setting.id, "email", value)}
                      />
                    </div>
                    <div className="text-center">
                      <Switch
                        checked={setting.inApp}
                        onCheckedChange={(value) => updateNotificationSetting(setting.id, "inApp", value)}
                      />
                    </div>
                    <div className="text-center">
                      <Switch
                        checked={setting.sms}
                        onCheckedChange={(value) => updateNotificationSetting(setting.id, "sms", value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-semibold">Professional Plan</h4>
                  <p className="text-sm text-muted-foreground">$49/month • Next billing: Jan 15, 2025</p>
                </div>
                <Badge>Active</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <div className="flex items-center gap-2 mt-1 p-3 border rounded-md">
                    <CreditCard className="h-4 w-4" />
                    <span>•••• •••• •••• 4242</span>
                    <Badge variant="outline" className="ml-auto">Expires 12/26</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Billing Email</label>
                  <Input defaultValue="billing@company.com" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Update Payment Method</Button>
                <Button variant="outline">Download Invoice</Button>
                <Button variant="outline">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integration Settings
              </CardTitle>
              <CardDescription>Configure global integration preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-sync enabled</h4>
                  <p className="text-sm text-muted-foreground">Automatically sync data from connected apps</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Webhook retries</h4>
                  <p className="text-sm text-muted-foreground">Retry failed webhook deliveries</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <label className="text-sm font-medium">Sync frequency</label>
                <Select defaultValue="15">
                  <SelectTrigger className="w-48 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Save Integration Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Advanced Configuration
              </CardTitle>
              <CardDescription>Advanced system settings for technical users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Debug mode</h4>
                      <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">API rate limiting</h4>
                      <p className="text-sm text-muted-foreground">Limit API requests per minute</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Data retention period</label>
                    <Select defaultValue="365">
                      <SelectTrigger className="w-48 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="1095">3 years</SelectItem>
                        <SelectItem value="1825">5 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="text-red-600 border-red-200">
                        Export All Data
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-200">
                        Reset System Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </RoleBasedAccess>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
