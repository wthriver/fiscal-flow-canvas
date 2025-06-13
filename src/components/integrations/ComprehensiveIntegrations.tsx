
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plug, 
  ShoppingCart, 
  CreditCard, 
  Mail, 
  Smartphone, 
  Database, 
  Cloud, 
  Settings,
  Check,
  X,
  Plus,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'payment' | 'marketing' | 'productivity' | 'accounting' | 'other';
  icon: React.ReactNode;
  isConnected: boolean;
  status: 'active' | 'error' | 'pending' | 'disconnected';
  lastSync?: string;
  config?: Record<string, any>;
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  isEnabled: boolean;
}

export const ComprehensiveIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Shopify',
      description: 'Sync orders, customers, and inventory with your Shopify store',
      category: 'ecommerce',
      icon: <ShoppingCart className="h-5 w-5" />,
      isConnected: true,
      status: 'active',
      lastSync: '2024-01-10 14:30',
      config: { storeUrl: 'mystore.shopify.com', apiKey: '***' }
    },
    {
      id: '2',
      name: 'Stripe',
      description: 'Process payments and sync transaction data',
      category: 'payment',
      icon: <CreditCard className="h-5 w-5" />,
      isConnected: true,
      status: 'active',
      lastSync: '2024-01-10 15:00',
      config: { publishableKey: 'pk_***', webhookUrl: 'configured' }
    },
    {
      id: '3',
      name: 'Mailchimp',
      description: 'Sync customer data for email marketing campaigns',
      category: 'marketing',
      icon: <Mail className="h-5 w-5" />,
      isConnected: false,
      status: 'disconnected'
    },
    {
      id: '4',
      name: 'PayPal',
      description: 'Accept PayPal payments and sync transactions',
      category: 'payment',
      icon: <CreditCard className="h-5 w-5" />,
      isConnected: false,
      status: 'disconnected'
    },
    {
      id: '5',
      name: 'Salesforce',
      description: 'Sync customer and lead data with Salesforce CRM',
      category: 'productivity',
      icon: <Database className="h-5 w-5" />,
      isConnected: false,
      status: 'disconnected'
    }
  ]);

  const [apiEndpoints] = useState<APIEndpoint[]>([
    {
      id: '1',
      name: 'Get Customers',
      method: 'GET',
      endpoint: '/api/customers',
      description: 'Retrieve all customers',
      isEnabled: true
    },
    {
      id: '2',
      name: 'Create Invoice',
      method: 'POST',
      endpoint: '/api/invoices',
      description: 'Create a new invoice',
      isEnabled: true
    },
    {
      id: '3',
      name: 'Update Transaction',
      method: 'PUT',
      endpoint: '/api/transactions/{id}',
      description: 'Update transaction details',
      isEnabled: true
    },
    {
      id: '4',
      name: 'Get Reports',
      method: 'GET',
      endpoint: '/api/reports',
      description: 'Generate financial reports',
      isEnabled: false
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [connectionForm, setConnectionForm] = useState<Record<string, string>>({});

  const categoryIcons = {
    ecommerce: <ShoppingCart className="h-4 w-4" />,
    payment: <CreditCard className="h-4 w-4" />,
    marketing: <Mail className="h-4 w-4" />,
    productivity: <Database className="h-4 w-4" />,
    accounting: <Database className="h-4 w-4" />,
    other: <Plug className="h-4 w-4" />
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    disconnected: 'bg-gray-100 text-gray-800'
  };

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConnectionForm({});
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(integrations.map(int => 
      int.id === integrationId 
        ? { ...int, isConnected: false, status: 'disconnected', lastSync: undefined }
        : int
    ));
    toast.success("Integration disconnected");
  };

  const handleSaveConnection = () => {
    if (!selectedIntegration) return;

    // Simulate connection process
    setIntegrations(integrations.map(int => 
      int.id === selectedIntegration.id 
        ? { 
            ...int, 
            isConnected: true, 
            status: 'active',
            lastSync: new Date().toLocaleString(),
            config: connectionForm
          }
        : int
    ));
    
    setSelectedIntegration(null);
    toast.success(`${selectedIntegration.name} connected successfully`);
  };

  const handleSync = (integrationId: string) => {
    setIntegrations(integrations.map(int => 
      int.id === integrationId 
        ? { ...int, lastSync: new Date().toLocaleString() }
        : int
    ));
    toast.success("Sync completed");
  };

  const connectedCount = integrations.filter(int => int.isConnected).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations & API</h1>
        <p className="text-muted-foreground">Connect with third-party services and manage API access</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{connectedCount}</CardTitle>
            <p className="text-sm text-muted-foreground">Connected Integrations</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{integrations.length}</CardTitle>
            <p className="text-sm text-muted-foreground">Available Integrations</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{apiEndpoints.filter(ep => ep.isEnabled).length}</CardTitle>
            <p className="text-sm text-muted-foreground">Active API Endpoints</p>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {integration.icon}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge className={`mt-1 ${statusColors[integration.status]}`}>
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {categoryIcons[integration.category]}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  
                  {integration.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Last sync: {integration.lastSync}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    {integration.isConnected ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleSync(integration.id)}>
                          Sync Now
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDisconnect(integration.id)}>
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => handleConnect(integration)}>
                            Connect
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Connect {integration.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {integration.name === 'Shopify' && (
                              <>
                                <div>
                                  <Label>Store URL</Label>
                                  <Input
                                    placeholder="mystore.shopify.com"
                                    value={connectionForm.storeUrl || ''}
                                    onChange={(e) => setConnectionForm({...connectionForm, storeUrl: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label>API Key</Label>
                                  <Input
                                    type="password"
                                    placeholder="Enter your Shopify API key"
                                    value={connectionForm.apiKey || ''}
                                    onChange={(e) => setConnectionForm({...connectionForm, apiKey: e.target.value})}
                                  />
                                </div>
                              </>
                            )}
                            {integration.name === 'Stripe' && (
                              <>
                                <div>
                                  <Label>Publishable Key</Label>
                                  <Input
                                    placeholder="pk_..."
                                    value={connectionForm.publishableKey || ''}
                                    onChange={(e) => setConnectionForm({...connectionForm, publishableKey: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label>Secret Key</Label>
                                  <Input
                                    type="password"
                                    placeholder="sk_..."
                                    value={connectionForm.secretKey || ''}
                                    onChange={(e) => setConnectionForm({...connectionForm, secretKey: e.target.value})}
                                  />
                                </div>
                              </>
                            )}
                            {integration.name === 'Mailchimp' && (
                              <div>
                                <Label>API Key</Label>
                                <Input
                                  type="password"
                                  placeholder="Enter your Mailchimp API key"
                                  value={connectionForm.apiKey || ''}
                                  onChange={(e) => setConnectionForm({...connectionForm, apiKey: e.target.value})}
                                />
                              </div>
                            )}
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSaveConnection}>
                                Connect
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your API endpoints and access controls
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint) => (
                  <div key={endpoint.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{endpoint.method}</Badge>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={endpoint.isEnabled}
                        onCheckedChange={() => {
                          toast.success(`${endpoint.name} ${endpoint.isEnabled ? 'disabled' : 'enabled'}`);
                        }}
                      />
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">API Documentation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Access our comprehensive API documentation to integrate with your applications.
                </p>
                <Button size="sm" variant="outline">
                  View Documentation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhooks</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure webhooks to receive real-time notifications
                  </p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Invoice Created</h4>
                    <p className="text-sm text-muted-foreground">https://api.example.com/webhooks/invoice-created</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <span className="text-xs text-muted-foreground">Last triggered: 2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Test</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Payment Received</h4>
                    <p className="text-sm text-muted-foreground">https://api.example.com/webhooks/payment-received</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <span className="text-xs text-muted-foreground">Last triggered: 1 day ago</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Test</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable API Access</Label>
                    <p className="text-sm text-muted-foreground">Allow external applications to access your data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require API Key</Label>
                    <p className="text-sm text-muted-foreground">Require API key for all requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Rate Limiting</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requests/hour</SelectItem>
                      <SelectItem value="1000">1,000 requests/hour</SelectItem>
                      <SelectItem value="10000">10,000 requests/hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">Restrict API access to specific IP addresses</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Webhook Signatures</Label>
                    <p className="text-sm text-muted-foreground">Sign webhook payloads for verification</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>API Key Rotation</Label>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Generate New Key</Button>
                    <Button size="sm" variant="outline">Rotate Keys</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
