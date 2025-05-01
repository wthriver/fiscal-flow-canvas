
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { HardDrive, Search, Plus, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

const Integrations: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  
  const integrations = currentCompany.integrations;

  const integrationCategories = [
    {
      name: "Banking & Financial",
      integrations: [
        { name: "Plaid", description: "Connect bank accounts", installed: true },
        { name: "Stripe", description: "Payment processing", installed: true },
        { name: "PayPal", description: "Online payments", installed: false },
        { name: "Square", description: "Point of sale", installed: false },
      ]
    },
    {
      name: "E-commerce",
      integrations: [
        { name: "Shopify", description: "Online store integration", installed: false },
        { name: "WooCommerce", description: "WordPress store integration", installed: false },
        { name: "Amazon", description: "Amazon marketplace", installed: false },
        { name: "eBay", description: "eBay marketplace", installed: false },
      ]
    },
    {
      name: "Productivity",
      integrations: [
        { name: "Google Workspace", description: "Google docs and email", installed: false },
        { name: "Microsoft 365", description: "Office and email", installed: false },
        { name: "Slack", description: "Team communication", installed: false },
        { name: "Asana", description: "Project management", installed: false },
      ]
    },
    {
      name: "CRM & Sales",
      integrations: [
        { name: "Salesforce", description: "CRM platform", installed: false },
        { name: "HubSpot", description: "Marketing and sales", installed: false },
        { name: "Zendesk", description: "Customer support", installed: false },
        { name: "Mailchimp", description: "Email marketing", installed: false },
      ]
    },
  ];
  
  const filteredIntegrations = integrations.filter(
    integration => integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   integration.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect your account with other services</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Integration</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Connections</CardTitle>
            <CardDescription>Currently connected services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{integrations.filter(i => i.status === "Active").length}</p>
              <HardDrive className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Last Sync</CardTitle>
            <CardDescription>Most recent data synchronization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bank Data via Plaid</p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>Sync Now</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Available Integrations</CardTitle>
            <CardDescription>Ready to connect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">50+</p>
              <Button variant="outline" size="sm">Browse Marketplace</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..." 
          className="pl-8 w-full sm:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:w-80 mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="border rounded-md p-4">
          <h2 className="text-xl font-bold mb-4">Active Integrations</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Integration</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Sync</TableHead>
                <TableHead className="hidden lg:table-cell">Sync Frequency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIntegrations.length > 0 ? (
                filteredIntegrations.map((integration) => (
                  <TableRow key={integration.id}>
                    <TableCell className="font-medium">{integration.name}</TableCell>
                    <TableCell>{integration.provider}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {integration.status === "Active" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : integration.status === "Error" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <span className="h-4 w-4 rounded-full bg-gray-300" />
                        )}
                        <span>{integration.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(integration.lastSync).toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell">{integration.syncFrequency}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchTerm ? "No integrations matching your search" : "No active integrations found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="available" className="space-y-6">
          {integrationCategories.map((category) => (
            <div key={category.name} className="space-y-4">
              <h2 className="text-xl font-bold">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.integrations.map((integration) => (
                  <Card key={integration.name} className={integration.installed ? "border-primary/30 bg-primary/5" : ""}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {integration.name}
                        {integration.installed && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant={integration.installed ? "outline" : "default"} size="sm" className="w-full">
                        {integration.installed ? "Configure" : "Connect"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="all" className="border rounded-md p-4">
          <h2 className="text-xl font-bold mb-4">All Integrations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Banking & Financial</CardTitle>
                <CardDescription>Connect your financial accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <div className="flex gap-2 items-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Plaid</span>
                  </div>
                  <Button variant="ghost" size="sm">Configure</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <div className="flex gap-2 items-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Stripe</span>
                  </div>
                  <Button variant="ghost" size="sm">Configure</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>PayPal</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>Square</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>E-commerce</CardTitle>
                <CardDescription>Connect your online stores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>Shopify</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>WooCommerce</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>Amazon</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Productivity</CardTitle>
                <CardDescription>Connect your productivity tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>Google Workspace</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>Microsoft 365</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>Slack</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>CRM & Sales</CardTitle>
                <CardDescription>Connect your customer management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>Salesforce</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>HubSpot</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                  <span>Zendesk</span>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
