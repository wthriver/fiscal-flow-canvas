
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, DollarSign, Euro, PoundSterling, GaugeCircle } from "lucide-react";
import { toast } from "sonner";

export const MultiCurrencySettings: React.FC = () => {
  const [multiCurrencyEnabled, setMultiCurrencyEnabled] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [autoUpdateRates, setAutoUpdateRates] = useState(true);

  const handleSaveSettings = () => {
    toast.success("Multi-currency settings saved", {
      description: "Your currency preferences have been updated"
    });
  };

  const handleAddCurrency = () => {
    toast.success("Currency added", {
      description: "Japanese Yen (JPY) has been added to your currencies"
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold">Multi-Currency Settings</h1>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Currency Configuration</CardTitle>
            <CardDescription>Manage your currency settings and exchange rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Enable Multi-Currency</div>
                <div className="text-sm text-muted-foreground">Allow transactions in multiple currencies</div>
              </div>
              <Switch 
                checked={multiCurrencyEnabled} 
                onCheckedChange={setMultiCurrencyEnabled} 
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-2">Base Currency</label>
                <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select base currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                    <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-2">Exchange Rate Source</label>
                <Select defaultValue="ecb">
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecb">European Central Bank</SelectItem>
                    <SelectItem value="fed">Federal Reserve</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-2">Rate Refresh Frequency</label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <div className="font-medium">Auto-update Exchange Rates</div>
                <div className="text-sm text-muted-foreground">Automatically update rates from selected source</div>
              </div>
              <Switch 
                checked={autoUpdateRates} 
                onCheckedChange={setAutoUpdateRates} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Exchange Rate Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">May 1, 2025 09:15 AM</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="font-medium">European Central Bank</p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Update Rates Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Currencies</CardTitle>
          <CardDescription>Currencies you can use in transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Exchange Rate</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>US Dollar</TableCell>
                  <TableCell>USD</TableCell>
                  <TableCell>$</TableCell>
                  <TableCell>1.0000</TableCell>
                  <TableCell>May 1, 2025</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Base Currency
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Euro</TableCell>
                  <TableCell>EUR</TableCell>
                  <TableCell>€</TableCell>
                  <TableCell>0.9243</TableCell>
                  <TableCell>May 1, 2025</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>British Pound</TableCell>
                  <TableCell>GBP</TableCell>
                  <TableCell>£</TableCell>
                  <TableCell>0.7852</TableCell>
                  <TableCell>May 1, 2025</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Canadian Dollar</TableCell>
                  <TableCell>CAD</TableCell>
                  <TableCell>$</TableCell>
                  <TableCell>1.3575</TableCell>
                  <TableCell>May 1, 2025</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleAddCurrency}>Add Currency</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency Display Settings</CardTitle>
            <CardDescription>Configure how currencies are displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display Format</label>
              <Select defaultValue="symbol-before">
                <SelectTrigger>
                  <SelectValue placeholder="Select display format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="symbol-before">Symbol before amount ($ 100.00)</SelectItem>
                  <SelectItem value="symbol-after">Symbol after amount (100.00 $)</SelectItem>
                  <SelectItem value="code-before">Code before amount (USD 100.00)</SelectItem>
                  <SelectItem value="code-after">Code after amount (100.00 USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Digit Grouping</label>
              <Select defaultValue="comma">
                <SelectTrigger>
                  <SelectValue placeholder="Select digit grouping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comma">1,000,000.00</SelectItem>
                  <SelectItem value="period">1.000.000,00</SelectItem>
                  <SelectItem value="space">1 000 000.00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Decimal Places</label>
              <Select defaultValue="2">
                <SelectTrigger>
                  <SelectValue placeholder="Select decimal places" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 (100)</SelectItem>
                  <SelectItem value="1">1 (100.0)</SelectItem>
                  <SelectItem value="2">2 (100.00)</SelectItem>
                  <SelectItem value="3">3 (100.000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Currency Conversion Settings</CardTitle>
            <CardDescription>Configure conversion behaviors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Default Conversion Behavior</label>
              <Select defaultValue="transaction-date">
                <SelectTrigger>
                  <SelectValue placeholder="Select conversion behavior" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transaction-date">Use rate from transaction date</SelectItem>
                  <SelectItem value="report-date">Use rate from report date</SelectItem>
                  <SelectItem value="average">Use average rate for period</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Gain/Loss Account</label>
              <Select defaultValue="fx-gainloss">
                <SelectTrigger>
                  <SelectValue placeholder="Select gain/loss account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fx-gainloss">Foreign Exchange Gain/Loss</SelectItem>
                  <SelectItem value="other-income">Other Income</SelectItem>
                  <SelectItem value="other-expense">Other Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <div className="font-medium">Record Currency Gain/Loss</div>
                <div className="text-sm text-muted-foreground">Automatically calculate and record FX differences</div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
