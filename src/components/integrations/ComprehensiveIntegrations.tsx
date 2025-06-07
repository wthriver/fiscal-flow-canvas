
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Settings, ExternalLink, CheckCircle, AlertCircle, Clock, 
  Zap, CreditCard, ShoppingCart, Users, Mail, Calendar,
  Database, Cloud, BarChart, FileText, Globe
} from "lucide-react";
import { toast } from "sonner";
import { RoleBasedAccess } from "@/components/auth/RoleBasedAccess";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  status: "connected" | "disconnected" | "error" | "pending";
  lastSync: string | null;
  autoSync: boolean;
  settings: Record<string, any>;
  icon: React.ReactNode;
  features: string[];
  setupComplexity: "easy" | "medium" | "advanced";
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  lastTriggered: string | null;
  totalCalls: number;
}

export const ComprehensiveIntegrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newWebhookDialog, setNewWebhookDialog] = useState(false);

  const integrations: Integration[] = [
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments, manage subscriptions, and handle transactions",
      category: "payments",
      provider: "Stripe Inc.",
      status: "connected",
      lastSync: "2 minutes ago",
      autoSync: true,
      settings: { apiKey: "sk_***", webhookSecret: "whsec_***" },
      icon: <CreditCard className="h-6 w-6" />,
      features: ["Payment Processing", "Subscription Management", "Dispute Handling"],
      setupComplexity: "easy"
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "Sync e-commerce sales, inventory, and customer data",
      category: "ecommerce",
      provider: "Shopify Inc.",
      status: "connected",
      lastSync: "15 minutes ago",
      autoSync: true,
      settings: { apiKey: "***", shop: "example.myshopify.com" },
      icon: <ShoppingCart className="h-6 w-6" />,
      features: ["Order Sync", "Inventory Management", "Customer Data"],
      setupComplexity: "medium"
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "CRM integration for customer and lead management",
      category: "crm",
      provider: "Salesforce.com",
      status: "error",
      lastSync: "3 days ago",
      autoSync: false,
      settings: { instanceUrl: "https://example.salesforce.com", clientId: "***" },
      icon: <Users className="h-6 w-6" />,
      features: ["Contact Sync", "Lead Management", "Opportunity Tracking"],
      setupComplexity: "advanced"
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing and customer communication",
      category: "marketing",
      provider: "Mailchimp",
      status: "disconnected",
      lastSync: null,
      autoSync: false,
      settings: {},
      icon: <Mail className="h-6 w-6" />,
      features: ["Email Campaigns", "Audience Management", "Analytics"],
      setupComplexity: "easy"
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows between 5000+ apps",
      category: "automation",
      provider: "Zapier Inc.",
      status: "connected",
      lastSync: "1 hour ago",
      autoSync: true,
      settings: { apiKey: "***" },
      icon: <Zap className="h-6 w-6" />,
      features: ["Workflow Automation", "Data Sync", "Trigger Actions"],
      setupComplexity: "medium"
    },
    {
      id: "quickbooks",
      name: "QuickBooks Online",
      description: "Accounting and financial data synchronization",
      category: "accounting",
      provider: "Intuit Inc.",
      status: "disconnected",
      lastSync: null,
      autoSync: false,
      settings: {},
      icon: <FileText className="h-6 w-6" />,
      features: ["Chart of Accounts Sync", "Transaction Import", "Customer Data"],
      setupComplexity: "advanced"
    }
  ];

  const webhooks: WebhookEndpoint[] = [
    {
      id: "webhook-1",
      name: "Payment Notifications",
      url: "https://api.example.com/webhooks/payments",
      events: ["payment.succeeded", "payment.failed", "subscription.updated"],
      status: "active",
      lastTriggered: "5 minutes ago",
      totalCalls: 1247
    },
    {
      id: "webhook-2",
      name: "Order Updates",
      url: "https://api.example.com/webhooks/orders",
      events: ["order.created", "order.updated", "order.cancelled"],
      status: "active",
      lastTriggered: "2 hours ago",
      totalCalls: 856
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "payments", label: "Payments" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "crm", label: "CRM" },
    { value: "marketing", label: "Marketing" },
    { value: "automation", label: "Automation" },
    { value: "accounting", label: "Accounting" }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || integration.category === categoryFilter;
    
    if (activeTab === "connected") {
      return matchesSearch && matchesCategory && integration.status === "connected";
    }
    if (activeTab === "available") {
      return matchesSearch && matchesCategory && integration.status === "disconnected";
    }
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <ExternalLink className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: "default",
      disconnected: "secondary",
      error: "destructive",
      pending: "outline"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "easy": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "advanced": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const toggleIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (integration.status === "connected") {
      toast.success(`${integration.name} disconnected`);
    } else {
      toast.success(`${integration.name} connected successfully`);
    }
  };

  const syncIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (integration) {
      toast.info(`Syncing ${integration.name}...`);
      setTimeout(() => {
        toast.success(`${integration.name} synced successfully`);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Integration Hub
          </h2>
          <p className="text-muted-foreground">Connect your favorite apps and automate workflows</p>
        </div>
        <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Custom Integration
          </Button>
        </RoleBasedAccess>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-xl font-semibold">
                  {integrations.filter(i => i.status === "connected").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-xl font-semibold">50+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-xl font-semibold">
                  {integrations.filter(i => i.status === "error").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Auto-Sync</p>
                <p className="text-xl font-semibold">
                  {integrations.filter(i => i.autoSync).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {integration.icon}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{integration.provider}</p>
                      </div>
                    </div>
                    {getStatusIcon(integration.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{integration.features.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(integration.status)}
                      <span className={`text-xs ${getComplexityColor(integration.setupComplexity)}`}>
                        {integration.setupComplexity} setup
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => toggleIntegration(integration.id)}
                    >
                      {integration.status === "connected" ? "Disconnect" : "Connect"}
                    </Button>
                    {integration.status === "connected" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => syncIntegration(integration.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {integration.icon}
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(integration.status)}
                          <Switch 
                            checked={integration.autoSync} 
                            onCheckedChange={() => {}} 
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {integration.lastSync}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => syncIntegration(integration.id)}>
                          Sync Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Webhook Endpoints</h3>
              <p className="text-sm text-muted-foreground">Manage incoming webhook URLs and events</p>
            </div>
            <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
              <Dialog open={newWebhookDialog} onOpenChange={setNewWebhookDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Webhook Endpoint</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Webhook Name</label>
                      <Input placeholder="Payment Notifications" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Endpoint URL</label>
                      <Input placeholder="https://api.example.com/webhooks/payments" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Events</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["payment.succeeded", "payment.failed", "order.created", "customer.updated"].map(event => (
                          <label key={event} className="flex items-center space-x-2">
                            <input type="checkbox" />
                            <span className="text-sm">{event}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setNewWebhookDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        toast.success("Webhook endpoint created");
                        setNewWebhookDialog(false);
                      }}>
                        Create Webhook
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </RoleBasedAccess>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{webhook.name}</h4>
                      <p className="text-sm text-muted-foreground font-mono">{webhook.url}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {webhook.events.map((event, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                          {webhook.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {webhook.totalCalls} calls • Last: {webhook.lastTriggered}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">Test</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure global integration preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-sync enabled integrations</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data from connected integrations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Send webhook failure notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when webhook deliveries fail
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data retention period</h4>
                  <p className="text-sm text-muted-foreground">
                    How long to keep integration logs and data
                  </p>
                </div>
                <Select defaultValue="90">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
