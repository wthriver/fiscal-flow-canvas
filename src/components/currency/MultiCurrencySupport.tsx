
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, DollarSign, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  isActive: boolean;
  lastUpdated: string;
}

interface ExchangeRateHistory {
  date: string;
  rate: number;
  change: number;
}

export const MultiCurrencySupport = () => {
  const [newCurrencyOpen, setNewCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Mock currency data
  const currencies: Currency[] = [
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      exchangeRate: 1.0,
      isBaseCurrency: true,
      isActive: true,
      lastUpdated: "2024-01-25 14:30:00"
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      exchangeRate: 0.85,
      isBaseCurrency: false,
      isActive: true,
      lastUpdated: "2024-01-25 14:30:00"
    },
    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
      exchangeRate: 0.73,
      isBaseCurrency: false,
      isActive: true,
      lastUpdated: "2024-01-25 14:30:00"
    },
    {
      code: "JPY",
      name: "Japanese Yen",
      symbol: "¥",
      exchangeRate: 110.25,
      isBaseCurrency: false,
      isActive: true,
      lastUpdated: "2024-01-25 14:30:00"
    },
    {
      code: "CAD",
      name: "Canadian Dollar",
      symbol: "C$",
      exchangeRate: 1.25,
      isBaseCurrency: false,
      isActive: false,
      lastUpdated: "2024-01-25 14:30:00"
    }
  ];

  // Mock exchange rate history
  const exchangeRateHistory: Record<string, ExchangeRateHistory[]> = {
    EUR: [
      { date: "2024-01-25", rate: 0.85, change: 0.02 },
      { date: "2024-01-24", rate: 0.83, change: -0.01 },
      { date: "2024-01-23", rate: 0.84, change: 0.01 },
      { date: "2024-01-22", rate: 0.83, change: -0.02 },
      { date: "2024-01-21", rate: 0.85, change: 0.01 }
    ],
    GBP: [
      { date: "2024-01-25", rate: 0.73, change: -0.01 },
      { date: "2024-01-24", rate: 0.74, change: 0.01 },
      { date: "2024-01-23", rate: 0.73, change: 0.00 },
      { date: "2024-01-22", rate: 0.73, change: 0.02 },
      { date: "2024-01-21", rate: 0.71, change: -0.01 }
    ]
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.exchangeRate || 1;
    return (amount / fromRate) * toRate;
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return `${currency?.symbol || '$'}${amount.toLocaleString()}`;
  };

  const refreshExchangeRates = () => {
    toast.success("Exchange rates updated successfully");
  };

  const activeCurrencies = currencies.filter(c => c.isActive);
  const baseCurrency = currencies.find(c => c.isBaseCurrency);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Multi-Currency Support</h2>
          <p className="text-muted-foreground">Manage currencies and exchange rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshExchangeRates}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Rates
          </Button>
          <Dialog open={newCurrencyOpen} onOpenChange={setNewCurrencyOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Currency
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Currency</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Currency Code</Label>
                    <Input placeholder="AUD" />
                  </div>
                  <div>
                    <Label>Currency Name</Label>
                    <Input placeholder="Australian Dollar" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Symbol</Label>
                    <Input placeholder="A$" />
                  </div>
                  <div>
                    <Label>Exchange Rate (to {baseCurrency?.code})</Label>
                    <Input type="number" step="0.0001" placeholder="1.4500" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Activate this currency</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setNewCurrencyOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("Currency added successfully");
                  setNewCurrencyOpen(false);
                }}>
                  Add Currency
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Base Currency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{baseCurrency?.code}</div>
            <p className="text-sm text-muted-foreground">{baseCurrency?.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCurrencies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date(baseCurrency?.lastUpdated || "").toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currency Converter */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Amount</Label>
              <Input type="number" placeholder="1000" defaultValue="1000" />
            </div>
            <div>
              <Label>From</Label>
              <Select defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>To</Label>
              <Select defaultValue="EUR">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(convertAmount(1000, "USD", "EUR"), "EUR")}
              </div>
              <p className="text-sm text-muted-foreground">Converted amount</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.code}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {currency.code}
                        {currency.isBaseCurrency && (
                          <Badge variant="default">Base</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currency.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-lg">{currency.symbol}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {currency.exchangeRate.toFixed(4)}
                      </span>
                      {!currency.isBaseCurrency && (
                        <div className="flex items-center">
                          {Math.random() > 0.5 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={currency.isActive ? "default" : "secondary"}>
                      {currency.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {new Date(currency.lastUpdated).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      {!currency.isBaseCurrency && (
                        <Button size="sm" variant="outline">
                          {currency.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Exchange Rate History */}
      <Card>
        <CardHeader>
          <CardTitle>Exchange Rate History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeCurrencies.filter(c => !c.isBaseCurrency).map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {exchangeRateHistory[selectedCurrency] && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeRateHistory[selectedCurrency].map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell className="font-mono">{entry.rate.toFixed(4)}</TableCell>
                    <TableCell className={entry.change >= 0 ? "text-green-600" : "text-red-600"}>
                      {entry.change >= 0 ? "+" : ""}{entry.change.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      {entry.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
