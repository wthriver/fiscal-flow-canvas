
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, CheckCircle, AlertCircle, Settings } from "lucide-react";

const Integrations: React.FC = () => {
  const integrations = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept online payments and manage transactions',
      category: 'Payments',
      status: 'connected',
      lastSync: '2 minutes ago',
      enabled: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Alternative payment processing solution',
      category: 'Payments',
      status: 'available',
      lastSync: null,
      enabled: false
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Sync e-commerce sales and inventory',
      category: 'E-commerce',
      status: 'connected',
      lastSync: '1 hour ago',
      enabled: true
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Customer relationship management',
      category: 'CRM',
      status: 'error',
      lastSync: '3 days ago',
      enabled: true
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows between apps',
      category: 'Automation',
      status: 'connected',
      lastSync: '30 minutes ago',
      enabled: true
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Receive notifications in your workspace',
      category: 'Communication',
      status: 'available',
      lastSync: null,
      enabled: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      case 'available':
        return <Badge variant="outline">Available</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect your favorite apps and automate your workflow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-xl font-semibold">3</p>
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
                <p className="text-xl font-semibold">1</p>
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
                <p className="text-xl font-semibold">25+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                  <Badge variant="outline" className="mt-2">{integration.category}</Badge>
                </div>
                <Switch 
                  checked={integration.enabled} 
                  disabled={integration.status === 'available'}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(integration.status)}
                </div>
                
                {integration.lastSync && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last sync</span>
                    <span className="text-sm">{integration.lastSync}</span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {integration.status === 'available' ? (
                    <Button size="sm" className="w-full">Connect</Button>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                      {integration.status === 'error' && (
                        <Button size="sm" variant="outline">Retry</Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
