
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ForecastData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
}

export const ForecastingDashboard: React.FC = () => {
  const [forecastPeriod, setForecastPeriod] = useState('12');
  const [scenario, setScenario] = useState('conservative');

  const forecastData: ForecastData[] = [
    { month: 'Jan', revenue: 85000, expenses: 65000, profit: 20000, cashFlow: 18000 },
    { month: 'Feb', revenue: 92000, expenses: 68000, profit: 24000, cashFlow: 22000 },
    { month: 'Mar', revenue: 88000, expenses: 70000, profit: 18000, cashFlow: 16000 },
    { month: 'Apr', revenue: 95000, expenses: 72000, profit: 23000, cashFlow: 21000 },
    { month: 'May', revenue: 98000, expenses: 74000, profit: 24000, cashFlow: 22000 },
    { month: 'Jun', revenue: 102000, expenses: 76000, profit: 26000, cashFlow: 24000 },
    { month: 'Jul', revenue: 105000, expenses: 78000, profit: 27000, cashFlow: 25000 },
    { month: 'Aug', revenue: 108000, expenses: 80000, profit: 28000, cashFlow: 26000 },
    { month: 'Sep', revenue: 112000, expenses: 82000, profit: 30000, cashFlow: 28000 },
    { month: 'Oct', revenue: 115000, expenses: 84000, profit: 31000, cashFlow: 29000 },
    { month: 'Nov', revenue: 118000, expenses: 86000, profit: 32000, cashFlow: 30000 },
    { month: 'Dec', revenue: 125000, expenses: 88000, profit: 37000, cashFlow: 35000 }
  ];

  const calculateGrowthRate = (data: ForecastData[], field: keyof ForecastData) => {
    if (data.length < 2) return 0;
    const firstValue = data[0][field] as number;
    const lastValue = data[data.length - 1][field] as number;
    return ((lastValue - firstValue) / firstValue * 100);
  };

  const revenueGrowth = calculateGrowthRate(forecastData, 'revenue');
  const profitGrowth = calculateGrowthRate(forecastData, 'profit');
  const cashFlowGrowth = calculateGrowthRate(forecastData, 'cashFlow');

  const getTotalForYear = (field: keyof ForecastData) => {
    return forecastData.reduce((sum, month) => sum + (month[field] as number), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Forecasting</h2>
          <p className="text-muted-foreground">Predict future financial performance with scenario planning</p>
        </div>
        <div className="flex gap-2">
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="optimistic">Optimistic</SelectItem>
              <SelectItem value="realistic">Realistic</SelectItem>
              <SelectItem value="conservative">Conservative</SelectItem>
            </SelectContent>
          </Select>
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Projected Revenue</p>
                <p className="text-2xl font-bold">${getTotalForYear('revenue').toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+{revenueGrowth.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Projected Profit</p>
                <p className="text-2xl font-bold">${getTotalForYear('profit').toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+{profitGrowth.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Cash Flow</p>
                <p className="text-2xl font-bold">${getTotalForYear('cashFlow').toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+{cashFlowGrowth.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Forecast Period</p>
                <p className="text-2xl font-bold">{forecastPeriod}mo</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {scenario}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Expense Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit & Cash Flow Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                <Bar dataKey="cashFlow" fill="#8b5cf6" name="Cash Flow" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scenario Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-green-600 mb-2">Optimistic Scenario</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Growth:</span>
                  <span className="text-sm font-medium">+25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Profit Margin:</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cash Position:</span>
                  <span className="text-sm font-medium">Strong</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 border-blue-500 bg-blue-50">
              <h3 className="font-semibold text-blue-600 mb-2">Realistic Scenario</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Growth:</span>
                  <span className="text-sm font-medium">+15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Profit Margin:</span>
                  <span className="text-sm font-medium">26%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cash Position:</span>
                  <span className="text-sm font-medium">Stable</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Conservative Scenario</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Growth:</span>
                  <span className="text-sm font-medium">+8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Profit Margin:</span>
                  <span className="text-sm font-medium">22%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cash Position:</span>
                  <span className="text-sm font-medium">Cautious</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
