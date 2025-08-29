import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Globe, 
  Key, 
  Mail, 
  FileText, 
  CreditCard, 
  Download, 
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Send,
  Settings,
  Users
} from "lucide-react";

export const CustomerPortal = () => {
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("customer-1");

  const customers = [
    { 
      id: "customer-1", 
      name: "Acme Corporation", 
      email: "billing@acme.com", 
      portalAccess: true,
      lastLogin: "2 hours ago",
      totalInvoices: 12,
      outstandingBalance: 15420.50
    },
    { 
      id: "customer-2", 
      name: "TechStart Inc", 
      email: "finance@techstart.com", 
      portalAccess: true,
      lastLogin: "1 day ago",
      totalInvoices: 8,
      outstandingBalance: 8750.00
    },
    { 
      id: "customer-3", 
      name: "Global Solutions", 
      email: "ap@globalsol.com", 
      portalAccess: false,
      lastLogin: "Never",
      totalInvoices: 5,
      outstandingBalance: 0
    }
  ];

  const portalInvoices = [
    { 
      id: "INV-001", 
      date: "2024-01-15", 
      amount: 5420.50, 
      status: "Paid", 
      dueDate: "2024-02-15",
      viewedByCustomer: true,
      paidDate: "2024-01-20"
    },
    { 
      id: "INV-002", 
      date: "2024-01-20", 
      amount: 3200.00, 
      status: "Overdue", 
      dueDate: "2024-02-20",
      viewedByCustomer: true,
      paidDate: null
    },
    { 
      id: "INV-003", 
      date: "2024-01-25", 
      amount: 6800.00, 
      status: "Pending", 
      dueDate: "2024-02-25",
      viewedByCustomer: false,
      paidDate: null
    }
  ];

  const customerMessages = [
    {
      id: 1,
      from: "Acme Corporation",
      subject: "Question about Invoice INV-002",
      message: "We need clarification on the line items in invoice INV-002...",
      timestamp: "2 hours ago",
      status: "unread"
    },
    {
      id: 2,
      from: "TechStart Inc",
      subject: "Payment confirmation needed",
      message: "We've made the payment for invoice INV-001, please confirm...",
      timestamp: "1 day ago", 
      status: "replied"
    }
  ];

  const portalSettings = [
    { key: "allowInvoiceViewing", label: "Allow Invoice Viewing", enabled: true },
    { key: "allowPayments", label: "Allow Online Payments", enabled: true },
    { key: "allowEstimateApproval", label: "Allow Estimate Approval", enabled: true },
    { key: "allowDocumentUpload", label: "Allow Document Upload", enabled: false },
    { key: "sendNotifications", label: "Send Email Notifications", enabled: true },
    { key: "requireLogin", label: "Require Customer Login", enabled: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Portal</h2>
          <p className="text-muted-foreground">Self-service portal for customer invoices and payments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="portal-enabled" 
              checked={portalEnabled}
              onCheckedChange={setPortalEnabled}
            />
            <Label htmlFor="portal-enabled">Portal Enabled</Label>
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Portal Settings
          </Button>
        </div>
      </div>

      {!portalEnabled && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <p className="text-orange-800">Customer Portal is disabled. Enable it to allow customers to view invoices and make payments online.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">With portal access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Invoices Viewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Online Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,220</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customer Access</TabsTrigger>
          <TabsTrigger value="invoices">Portal Invoices</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Portal Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Portal Access</CardTitle>
              <CardDescription>Manage which customers can access the portal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Last login: {customer.lastLogin} • {customer.totalInvoices} invoices
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {customer.outstandingBalance > 0 && (
                        <div className="text-right">
                          <p className="text-sm font-medium">${customer.outstandingBalance.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Outstanding</p>
                        </div>
                      )}
                      <Switch 
                        checked={customer.portalAccess}
                        onCheckedChange={() => {}} 
                      />
                      <Button variant="outline" size="sm">
                        <Key className="h-4 w-4 mr-2" />
                        Send Login
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portal Invoice Activity</CardTitle>
              <CardDescription>Track customer interactions with invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portalInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{invoice.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          Issued: {invoice.date} • Due: {invoice.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-2 text-xs">
                          {invoice.viewedByCustomer ? (
                            <span className="flex items-center text-blue-600">
                              <Eye className="h-3 w-3 mr-1" />
                              Viewed
                            </span>
                          ) : (
                            <span className="flex items-center text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              Not viewed
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={
                        invoice.status === 'Paid' ? 'default' : 
                        invoice.status === 'Overdue' ? 'destructive' : 'secondary'
                      }>
                        {invoice.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Resend
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Messages</CardTitle>
              <CardDescription>Messages and inquiries from customers via the portal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerMessages.map((message) => (
                  <div key={message.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{message.from}</h4>
                          <Badge variant={message.status === 'unread' ? 'destructive' : 'default'}>
                            {message.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <h5 className="text-sm font-medium mb-1">{message.subject}</h5>
                        <p className="text-sm text-muted-foreground">{message.message}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portal Configuration</CardTitle>
              <CardDescription>Configure customer portal features and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Portal Features</h4>
                {portalSettings.map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Switch 
                      id={setting.key}
                      checked={setting.enabled}
                      onCheckedChange={() => {}}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Portal Branding</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="portal-title">Portal Title</Label>
                    <Input id="portal-title" defaultValue="Customer Portal" />
                  </div>
                  <div>
                    <Label htmlFor="portal-url">Portal URL</Label>
                    <Input id="portal-url" defaultValue="portal.mycompany.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea 
                    id="welcome-message" 
                    placeholder="Welcome to our customer portal..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};