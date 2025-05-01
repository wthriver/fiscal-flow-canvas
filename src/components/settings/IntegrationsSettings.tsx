
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Search, Check } from "lucide-react";

export const IntegrationsSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("installed");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Mock integration data
  const installedIntegrations = [
    {
      id: "stripe",
      name: "Stripe",
      description: "Payment processing for online businesses",
      category: "Payments",
      status: "Connected",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "E-commerce platform for online stores",
      category: "E-commerce",
      status: "Connected",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/shopify.svg",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Business communication platform",
      category: "Communication",
      status: "Connected",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg",
    }
  ];

  const availableIntegrations = [
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Marketing automation platform and email marketing service",
      category: "Marketing",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mailchimp.svg",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Online payments system",
      category: "Payments",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg",
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Customer relationship management platform",
      category: "CRM",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/salesforce.svg",
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Inbound marketing, sales, and service software",
      category: "CRM",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/hubspot.svg",
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Video communications platform",
      category: "Communication",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/zoom.svg",
    },
    {
      id: "asana",
      name: "Asana",
      description: "Web and mobile application designed to help teams organize work",
      category: "Project Management",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/asana.svg",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "File hosting service",
      category: "Storage",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/dropbox.svg",
    },
    {
      id: "googleads",
      name: "Google Ads",
      description: "Online advertising platform",
      category: "Marketing",
      icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googleads.svg",
    }
  ];

  const connectIntegration = (id: string, name: string) => {
    toast.success(`Connected to ${name}`, {
      description: "Your account is now linked"
    });
  };

  const disconnectIntegration = (id: string, name: string) => {
    toast.success(`Disconnected from ${name}`, {
      description: "Your account has been unlinked"
    });
  };

  // Filter integrations based on search term
  const filteredInstalled = installedIntegrations.filter(
    integration => integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAvailable = availableIntegrations.filter(
    integration => integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-4">
          <TabsTrigger value="installed">Installed ({installedIntegrations.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableIntegrations.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="installed" className="space-y-4">
          {filteredInstalled.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No integrations found</p>
              </CardContent>
            </Card>
          ) : (
            filteredInstalled.map(integration => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md">
                    <img 
                      src={integration.icon} 
                      alt={integration.name} 
                      className="h-8 w-8"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <span className="mt-1 sm:mt-0 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {integration.status}
                      </span>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => disconnectIntegration(integration.id, integration.name)}>
                    Disconnect
                  </Button>
                  <Button variant="outline" size="sm">Configure</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="available" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAvailable.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No integrations found</p>
              </CardContent>
            </Card>
          ) : (
            filteredAvailable.map(integration => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md">
                    <img 
                      src={integration.icon} 
                      alt={integration.name} 
                      className="h-8 w-8"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription className="text-xs">{integration.category}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => connectIntegration(integration.id, integration.name)}
                  >
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Categories</CardTitle>
              <CardDescription>Browse integrations by category</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {["Payments", "E-commerce", "CRM", "Marketing", "Communication", "Project Management", "Storage", "Accounting", "Human Resources"].map(category => (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {[...installedIntegrations, ...availableIntegrations]
                        .filter(i => i.category === category)
                        .length} integrations
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">Browse</Button>
                  </CardFooter>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
