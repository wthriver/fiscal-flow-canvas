
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Save } from "lucide-react";
import { toast } from "sonner";

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: {
      invoices: true,
      payments: true,
      system: true,
      marketing: false,
    },
    push: {
      invoices: true,
      payments: true,
      system: false,
      marketing: false,
    }
  });

  const handleToggle = (channel: 'email' | 'push', type: 'invoices' | 'payments' | 'system' | 'marketing') => {
    setNotifications({
      ...notifications,
      [channel]: {
        ...notifications[channel],
        [type]: !notifications[channel][type]
      }
    });
  };

  const saveNotificationSettings = () => {
    toast.success("Notification preferences saved");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>Manage how and when you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Invoice Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications about new and due invoices</p>
              </div>
              <Switch 
                checked={notifications.email.invoices} 
                onCheckedChange={() => handleToggle('email', 'invoices')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications when payments are made or due</p>
              </div>
              <Switch 
                checked={notifications.email.payments} 
                onCheckedChange={() => handleToggle('email', 'payments')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications about system updates and maintenance</p>
              </div>
              <Switch 
                checked={notifications.email.system} 
                onCheckedChange={() => handleToggle('email', 'system')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Receive news, tips, and promotional offers</p>
              </div>
              <Switch 
                checked={notifications.email.marketing} 
                onCheckedChange={() => handleToggle('email', 'marketing')} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Invoice Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications about new and due invoices</p>
              </div>
              <Switch 
                checked={notifications.push.invoices} 
                onCheckedChange={() => handleToggle('push', 'invoices')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications when payments are made or due</p>
              </div>
              <Switch 
                checked={notifications.push.payments} 
                onCheckedChange={() => handleToggle('push', 'payments')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications about system updates and maintenance</p>
              </div>
              <Switch 
                checked={notifications.push.system} 
                onCheckedChange={() => handleToggle('push', 'system')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Notifications</p>
                <p className="text-sm text-muted-foreground">Receive news, tips, and promotional offers</p>
              </div>
              <Switch 
                checked={notifications.push.marketing} 
                onCheckedChange={() => handleToggle('push', 'marketing')} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={saveNotificationSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
