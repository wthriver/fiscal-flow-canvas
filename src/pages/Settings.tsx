
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, User, Building, CreditCard, Lock, Globe, Bell, Mail, FileText, Users, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings: React.FC = () => {
  const settingsCategories = [
    {
      title: "Account",
      icon: User,
      items: [
        { name: "Your Profile", description: "Manage your personal information", icon: User },
        { name: "Security", description: "Password and authentication settings", icon: Lock },
        { name: "Notifications", description: "Configure your notification preferences", icon: Bell },
        { name: "Connected Apps", description: "Manage connected applications and services", icon: Globe },
      ]
    },
    {
      title: "Company",
      icon: Building,
      items: [
        { name: "Company Information", description: "Business name, address, and logo", icon: Building },
        { name: "Users & Permissions", description: "Manage users and access control", icon: Users },
        { name: "Fiscal Year", description: "Set your fiscal year and accounting periods", icon: Calendar },
        { name: "Chart of Accounts", description: "Customize your accounts structure", icon: FileText },
      ]
    },
    {
      title: "Billing",
      icon: CreditCard,
      items: [
        { name: "Subscription", description: "View and change your subscription plan", icon: CreditCard },
        { name: "Payment Methods", description: "Manage your payment methods", icon: CreditCard },
        { name: "Billing History", description: "View past invoices and receipts", icon: FileText },
        { name: "Email Receipts", description: "Configure receipt emails", icon: Mail },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Eastern Time (US & Canada)" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button className="flex items-center gap-1">
              <Check size={16} />
              <span>Save Changes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {settingsCategories.map((category, idx) => (
          <Card key={idx} className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-primary" />
                <CardTitle>{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between h-auto py-3 px-4 hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="flex items-start gap-2 text-left">
                        <item.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium block">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.description}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Settings;
