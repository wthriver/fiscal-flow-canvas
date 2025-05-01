
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Globe, Plus, RefreshCw } from "lucide-react";

const MultiCurrency: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold">Multi-Currency</h1>
          <p className="text-muted-foreground">Manage multiple currencies for international operations</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Currency</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Base Currency</CardTitle>
            <CardDescription>All transactions are converted to this currency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-xl">USD - US Dollar</p>
                <p className="text-sm text-muted-foreground">Last updated: Today at 9:00 AM</p>
              </div>
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Exchange Rate Provider</CardTitle>
            <CardDescription>Source of currency exchange rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-xl">Open Exchange Rates</p>
                <p className="text-sm text-muted-foreground">Updates hourly</p>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>Update Now</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Currencies</CardTitle>
            <CardDescription>Currencies used in your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl">4</p>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">View All</SelectItem>
                  <SelectItem value="add">Add New</SelectItem>
                  <SelectItem value="manage">Manage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="exchange-rates">
        <TabsList>
          <TabsTrigger value="exchange-rates">Exchange Rates</TabsTrigger>
          <TabsTrigger value="currency-accounts">Currency Accounts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="exchange-rates" className="border rounded-md p-4 mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Current Exchange Rates</h2>
              <p className="text-sm text-muted-foreground">Last updated: May 1, 2025 9:00 AM</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Rate (to USD)</TableHead>
                  <TableHead>Inverse</TableHead>
                  <TableHead>Last Change</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Euro</TableCell>
                  <TableCell>EUR</TableCell>
                  <TableCell>0.92</TableCell>
                  <TableCell>1.09</TableCell>
                  <TableCell>+0.003 (0.3%)</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">British Pound</TableCell>
                  <TableCell>GBP</TableCell>
                  <TableCell>0.80</TableCell>
                  <TableCell>1.25</TableCell>
                  <TableCell>-0.005 (0.6%)</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Canadian Dollar</TableCell>
                  <TableCell>CAD</TableCell>
                  <TableCell>1.35</TableCell>
                  <TableCell>0.74</TableCell>
                  <TableCell>+0.002 (0.1%)</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Japanese Yen</TableCell>
                  <TableCell>JPY</TableCell>
                  <TableCell>150.25</TableCell>
                  <TableCell>0.007</TableCell>
                  <TableCell>-0.75 (0.5%)</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="flex justify-end">
              <Button variant="outline" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>Update Exchange Rates</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="currency-accounts" className="border rounded-md p-4 mt-4">
          <h2 className="text-xl font-bold mb-4">Currency Accounts</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Balance (Native)</TableHead>
                <TableHead>Balance (USD)</TableHead>
                <TableHead>Last Transaction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">EUR</TableCell>
                <TableCell>Euro Operating Account</TableCell>
                <TableCell>€4,500.00</TableCell>
                <TableCell>$4,891.30</TableCell>
                <TableCell>Apr 28, 2025</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GBP</TableCell>
                <TableCell>UK Business Account</TableCell>
                <TableCell>£2,300.00</TableCell>
                <TableCell>$2,875.00</TableCell>
                <TableCell>Apr 30, 2025</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CAD</TableCell>
                <TableCell>Canadian Operations</TableCell>
                <TableCell>$5,800.00</TableCell>
                <TableCell>$4,296.30</TableCell>
                <TableCell>May 1, 2025</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="settings" className="border rounded-md p-4 mt-4">
          <h2 className="text-xl font-bold mb-4">Currency Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rounding Rules</CardTitle>
                  <CardDescription>How currency conversions are rounded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Exchange rate decimals</p>
                      <p>4 places</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Amount rounding</p>
                      <p>2 places</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Rounding method</p>
                      <p>Banker's rounding</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gain/Loss Accounts</CardTitle>
                  <CardDescription>Where to record currency fluctuations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p>Realized gains</p>
                      <p>7010 - Foreign Exchange Gain</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Realized losses</p>
                      <p>7020 - Foreign Exchange Loss</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Unrealized gains/losses</p>
                      <p>7030 - Unrealized Currency Effects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Auto-Updates</CardTitle>
                <CardDescription>When exchange rates are automatically updated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p>Update frequency</p>
                    <p>Daily at 9:00 AM</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Weekend updates</p>
                    <p>Disabled</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Rate provider</p>
                    <p>Open Exchange Rates API</p>
                  </div>
                  <div className="flex justify-between">
                    <p>API key status</p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Valid</span>
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

export default MultiCurrency;
