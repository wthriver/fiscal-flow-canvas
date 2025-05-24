
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Check, Plus, Settings, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BankConnection {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  status: "Connected" | "Disconnected" | "Error";
  lastSync: string;
  autoSync: boolean;
}

export const BankingIntegration = () => {
  const [connections, setConnections] = useState<BankConnection[]>([
    {
      id: "conn-1",
      bankName: "Chase Bank",
      accountType: "Checking",
      accountNumber: "****1234",
      status: "Connected",
      lastSync: "2025-05-24 09:30 AM",
      autoSync: true
    },
    {
      id: "conn-2",
      bankName: "Wells Fargo",
      accountType: "Savings",
      accountNumber: "****5678",
      status: "Connected",
      lastSync: "2025-05-24 08:15 AM",
      autoSync: false
    }
  ]);

  const [newConnection, setNewConnection] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking"
  });

  const handleAddConnection = () => {
    if (!newConnection.bankName || !newConnection.accountNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const connection: BankConnection = {
      id: `conn-${Date.now()}`,
      bankName: newConnection.bankName,
      accountType: newConnection.accountType,
      accountNumber: `****${newConnection.accountNumber.slice(-4)}`,
      status: "Connected",
      lastSync: new Date().toLocaleString(),
      autoSync: true
    };

    setConnections(prev => [connection, ...prev]);
    setNewConnection({
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "checking"
    });
    toast.success("Bank account connected successfully");
  };

  const handleSync = (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, lastSync: new Date().toLocaleString() }
        : conn
    ));
    toast.success("Account synced successfully");
  };

  const toggleAutoSync = (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, autoSync: !conn.autoSync }
        : conn
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected": return "default";
      case "Error": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Banking Integration</h2>
        <p className="text-muted-foreground">Connect and manage your bank accounts</p>
      </div>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connections">Bank Connections</TabsTrigger>
          <TabsTrigger value="rules">Bank Rules</TabsTrigger>
          <TabsTrigger value="feeds">Transaction Feeds</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Bank Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={newConnection.bankName}
                    onChange={(e) => setNewConnection({...newConnection, bankName: e.target.value})}
                    placeholder="e.g., Chase Bank"
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <select
                    id="accountType"
                    value={newConnection.accountType}
                    onChange={(e) => setNewConnection({...newConnection, accountType: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit Card</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={newConnection.accountNumber}
                    onChange={(e) => setNewConnection({...newConnection, accountNumber: e.target.value})}
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    value={newConnection.routingNumber}
                    onChange={(e) => setNewConnection({...newConnection, routingNumber: e.target.value})}
                    placeholder="Routing number"
                  />
                </div>
              </div>
              <Button onClick={handleAddConnection} className="mt-4">
                Connect Account
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div key={connection.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{connection.bankName}</p>
                          <p className="text-sm text-muted-foreground">
                            {connection.accountType} • {connection.accountNumber}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(connection.status)}>
                        {connection.status === "Connected" && <Check className="h-3 w-3 mr-1" />}
                        {connection.status === "Error" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {connection.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                          Last sync: {connection.lastSync}
                        </p>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={connection.autoSync}
                            onCheckedChange={() => toggleAutoSync(connection.id)}
                          />
                          <span className="text-sm">Auto-sync</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleSync(connection.id)}>
                          Sync Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bank Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set up automatic categorization rules for imported transactions
              </p>
              <Button className="mt-4">Create New Rule</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Feeds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View and manage automatic transaction imports
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
