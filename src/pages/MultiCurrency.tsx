
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

const MultiCurrency: React.FC = () => {
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0000, change: 0, isBase: true },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.8500, change: 1.2, isBase: false },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.7200, change: -0.5, isBase: false },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.3500, change: 0.8, isBase: false },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.5200, change: -1.1, isBase: false },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50, change: 2.3, isBase: false }
  ];

  const transactions = [
    { id: 1, date: '2025-05-24', description: 'Invoice Payment', originalAmount: '€2,125.00', convertedAmount: '$2,500.00', rate: 0.8500 },
    { id: 2, date: '2025-05-23', description: 'Office Supplies', originalAmount: '£720.00', convertedAmount: '$1,000.00', rate: 0.7200 },
    { id: 3, date: '2025-05-22', description: 'Software License', originalAmount: 'C$675.00', convertedAmount: '$500.00', rate: 1.3500 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Multi-Currency</h1>
          <p className="text-muted-foreground">Manage multiple currencies and exchange rates</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add Currency
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Base Currency</p>
                <p className="text-xl font-semibold">USD</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Active Currencies</p>
                <p className="text-xl font-semibold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-xl font-semibold">2 min ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exchange Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.code}>
                  <TableCell className="flex items-center gap-2">
                    <span className="text-lg">{currency.symbol}</span>
                    <span className="font-medium">{currency.name}</span>
                  </TableCell>
                  <TableCell className="font-mono">{currency.code}</TableCell>
                  <TableCell className="font-mono">{currency.rate.toFixed(4)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {currency.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : currency.change < 0 ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : null}
                      <span className={currency.change > 0 ? 'text-green-500' : currency.change < 0 ? 'text-red-500' : 'text-gray-500'}>
                        {currency.change > 0 ? '+' : ''}{currency.change.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {currency.isBase ? (
                      <Badge variant="default">Base</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Multi-Currency Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Original Amount</TableHead>
                <TableHead>Converted Amount</TableHead>
                <TableHead>Exchange Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="font-mono">{transaction.originalAmount}</TableCell>
                  <TableCell className="font-mono">{transaction.convertedAmount}</TableCell>
                  <TableCell className="font-mono">{transaction.rate.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiCurrency;
