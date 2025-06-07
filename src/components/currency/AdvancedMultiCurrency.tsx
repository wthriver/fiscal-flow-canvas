
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign, TrendingUp, RefreshCw, Settings, Globe } from "lucide-react";
import { toast } from "sonner";
import { RoleBasedAccess } from "@/components/auth/RoleBasedAccess";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  lastUpdated: string;
  isActive: boolean;
  isBaseCurrency: boolean;
}

interface ExchangeRateRule {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fixedRate?: number;
  markup: number;
  autoUpdate: boolean;
}

export const AdvancedMultiCurrency: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, lastUpdated: "2025-01-10 10:00", isActive: true, isBaseCurrency: true },
    { code: "EUR", name: "Euro", symbol: "€", rate: 0.85, lastUpdated: "2025-01-10 10:00", isActive: true, isBaseCurrency: false },
    { code: "GBP", name: "British Pound", symbol: "£", rate: 0.75, lastUpdated: "2025-01-10 10:00", isActive: true, isBaseCurrency: false },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.25, lastUpdated: "2025-01-10 10:00", isActive: false, isBaseCurrency: false },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.35, lastUpdated: "2025-01-10 10:00", isActive: true, isBaseCurrency: false }
  ]);

  const [exchangeRules, setExchangeRules] = useState<ExchangeRateRule[]>([
    { id: "1", fromCurrency: "USD", toCurrency: "EUR", markup: 2.5, autoUpdate: true },
    { id: "2", fromCurrency: "USD", toCurrency: "GBP", markup: 1.8, autoUpdate: true },
    { id: "3", fromCurrency: "EUR", toCurrency: "GBP", fixedRate: 0.88, markup: 0, autoUpdate: false }
  ]);

  const [newCurrencyDialog, setNewCurrencyDialog] = useState(false);
  const [rateRuleDialog, setRateRuleDialog] = useState(false);
  const [convertAmount, setConvertAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  const activeCurrencies = currencies.filter(c => c.isActive);
  const baseCurrency = currencies.find(c => c.isBaseCurrency);

  const refreshExchangeRates = async () => {
    toast.info("Refreshing exchange rates...");
    // Simulate API call
    setTimeout(() => {
      setCurrencies(prev => prev.map(currency => ({
        ...currency,
        rate: currency.isBaseCurrency ? 1.0 : currency.rate + (Math.random() - 0.5) * 0.1,
        lastUpdated: new Date().toLocaleString()
      })));
      toast.success("Exchange rates updated successfully");
    }, 1500);
  };

  const convertCurrency = (amount: number, from: string, to: string): number => {
    const fromRate = currencies.find(c => c.code === from)?.rate || 1;
    const toRate = currencies.find(c => c.code === to)?.rate || 1;
    return (amount / fromRate) * toRate;
  };

  const toggleCurrencyStatus = (code: string) => {
    if (currencies.find(c => c.code === code)?.isBaseCurrency) {
      toast.error("Cannot disable base currency");
      return;
    }
    
    setCurrencies(prev => prev.map(currency => 
      currency.code === code 
        ? { ...currency, isActive: !currency.isActive }
        : currency
    ));
    toast.success("Currency status updated");
  };

  const setBaseCurrency = (code: string) => {
    setCurrencies(prev => prev.map(currency => ({
      ...currency,
      isBaseCurrency: currency.code === code,
      isActive: true // Auto-enable when setting as base
    })));
    toast.success(`${code} set as base currency`);
  };

  const addCurrency = (newCurrency: Omit<Currency, 'lastUpdated'>) => {
    const currency: Currency = {
      ...newCurrency,
      lastUpdated: new Date().toLocaleString()
    };
    setCurrencies(prev => [...prev, currency]);
    toast.success("Currency added successfully");
    setNewCurrencyDialog(false);
  };

  const calculatedConversion = convertAmount ? 
    convertCurrency(parseFloat(convertAmount), fromCurrency, toCurrency) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Multi-Currency Management
          </h2>
          <p className="text-muted-foreground">Manage currencies, exchange rates, and conversions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshExchangeRates} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Rates
          </Button>
          <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
            <Dialog open={newCurrencyDialog} onOpenChange={setNewCurrencyDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
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
                      <label className="text-sm font-medium">Currency Code</label>
                      <Input placeholder="JPY" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Symbol</label>
                      <Input placeholder="¥" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Currency Name</label>
                    <Input placeholder="Japanese Yen" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Exchange Rate</label>
                    <Input type="number" step="0.0001" placeholder="110.25" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setNewCurrencyDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      addCurrency({
                        code: "JPY",
                        name: "Japanese Yen",
                        symbol: "¥",
                        rate: 110.25,
                        isActive: true,
                        isBaseCurrency: false
                      });
                    }}>
                      Add Currency
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </RoleBasedAccess>
        </div>
      </div>

      {/* Currency Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Currency Converter
          </CardTitle>
          <CardDescription>Convert between different currencies in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
                placeholder="100.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">From</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeCurrencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">To</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeCurrencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Converted Amount</div>
                <div className="text-lg font-semibold">
                  {currencies.find(c => c.code === toCurrency)?.symbol}{calculatedConversion.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Management */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Management</CardTitle>
          <CardDescription>
            Manage active currencies and exchange rates. Base currency: {baseCurrency?.name} ({baseCurrency?.code})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Exchange Rate</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow key={currency.code}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{currency.symbol}</span>
                        <div>
                          <div className="font-medium">{currency.name}</div>
                          {currency.isBaseCurrency && (
                            <Badge variant="default" className="text-xs">Base Currency</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-medium">{currency.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {currency.isBaseCurrency ? "1.0000" : currency.rate.toFixed(4)}
                        </span>
                        {!currency.isBaseCurrency && (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {currency.lastUpdated}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={currency.isActive}
                          onCheckedChange={() => toggleCurrencyStatus(currency.code)}
                          disabled={currency.isBaseCurrency}
                        />
                        <span className="text-sm">
                          {currency.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
                          {!currency.isBaseCurrency && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setBaseCurrency(currency.code)}
                            >
                              Set as Base
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </RoleBasedAccess>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rate Rules */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Exchange Rate Rules</CardTitle>
              <CardDescription>Configure custom exchange rate rules and markups</CardDescription>
            </div>
            <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
              <Button onClick={() => setRateRuleDialog(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </RoleBasedAccess>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exchangeRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="font-medium">
                    {rule.fromCurrency} → {rule.toCurrency}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {rule.fixedRate ? `Fixed Rate: ${rule.fixedRate}` : `Markup: ${rule.markup}%`}
                  </div>
                  <Badge variant={rule.autoUpdate ? "default" : "secondary"}>
                    {rule.autoUpdate ? "Auto Update" : "Manual"}
                  </Badge>
                </div>
                <RoleBasedAccess allowedRoles={["Admin", "Owner"]}>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline" className="text-red-600">Remove</Button>
                  </div>
                </RoleBasedAccess>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
