
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCompany } from "@/contexts/CompanyContext";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from "recharts";
import { ArrowUp, ArrowDown, CircleDollarSign } from "lucide-react";

const getForecastData = (transactions: any[], invoices: any[], expenses: any[]) => {
  // Current month + next 5 months
  const months = [];
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push(month.toLocaleString('default', { month: 'short', year: '2-digit' }));
  }
  
  // Generate forecast data based on historical transactions and upcoming invoices/expenses
  return months.map((month, index) => {
    let expectedIncome = 10000 + Math.random() * 5000; // Base income + random variation
    let expectedExpenses = 8000 + Math.random() * 3000; // Base expenses + random variation
    
    if (index === 0) {
      // Current month - use more accurate data from transactions
      expectedIncome = transactions
        .filter(t => t.type === "Credit")
        .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")), 0);
      expectedExpenses = transactions
        .filter(t => t.type === "Debit")
        .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")), 0);
    }
    
    // Add upcoming invoices for future months
    if (index > 0) {
      const futureMonth = new Date(today.getFullYear(), today.getMonth() + index, 1);
      const futureMonthEnd = new Date(today.getFullYear(), today.getMonth() + index + 1, 0);
      
      const dueInvoices = invoices.filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        return dueDate >= futureMonth && dueDate <= futureMonthEnd;
      });
      
      const futureExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= futureMonth && expenseDate <= futureMonthEnd;
      });
      
      dueInvoices.forEach(invoice => {
        expectedIncome += parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""));
      });
      
      futureExpenses.forEach(expense => {
        expectedExpenses += parseFloat(expense.amount.replace(/[^0-9.-]+/g, ""));
      });
    }
    
    const cashFlow = expectedIncome - expectedExpenses;
    
    return {
      name: month,
      income: Math.round(expectedIncome),
      expenses: Math.round(expectedExpenses),
      cashFlow: Math.round(cashFlow),
    };
  });
};

export const CashFlowForecasting = () => {
  const { currentCompany } = useCompany();
  const { transactions, invoices } = currentCompany;
  const expenses = currentCompany.expenses || [];
  
  const [timeRange, setTimeRange] = useState("6months");
  
  const forecastData = getForecastData(transactions, invoices, expenses);
  const currentMonthData = forecastData[0];
  
  const sumIncome = forecastData.reduce((sum, item) => sum + item.income, 0);
  const sumExpenses = forecastData.reduce((sum, item) => sum + item.expenses, 0);
  const netCashFlow = sumIncome - sumExpenses;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Cash Flow Forecast</h2>
        <div className="flex items-center gap-4">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Next 3 months</SelectItem>
              <SelectItem value="6months">Next 6 months</SelectItem>
              <SelectItem value="12months">Next 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Projected Income</CardTitle>
            <CardDescription>Next 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${sumIncome.toLocaleString()}</span>
              <span className="flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                4.3%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Projected Expenses</CardTitle>
            <CardDescription>Next 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${sumExpenses.toLocaleString()}</span>
              <span className="flex items-center text-red-600">
                <ArrowDown className="h-4 w-4 mr-1" />
                2.1%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Cash Flow</CardTitle>
            <CardDescription>Next 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${netCashFlow.toLocaleString()}</span>
              <span className="flex items-center text-green-600">
                <CircleDollarSign className="h-4 w-4 mr-1" />
                +6.8%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Projection</CardTitle>
          <CardDescription>Forecasted income, expenses, and net cash flow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={forecastData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                <Bar dataKey="cashFlow" name="Net Cash Flow" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Health</CardTitle>
            <CardDescription>Key metrics and financial indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Cash Flow Ratio</span>
                <span className="font-bold">1.24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Burn Rate</span>
                <span className="font-bold">${Math.round(currentMonthData.expenses / 30).toLocaleString()}/day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Runway</span>
                <span className="font-bold">8.3 months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Quick Ratio</span>
                <span className="font-bold">2.1</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Recommendations</CardTitle>
            <CardDescription>Actions to improve your cash position</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded text-blue-700 mr-2 mt-1">•</div>
                <p>Consider invoicing more frequently to improve cash flow timing</p>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded text-blue-700 mr-2 mt-1">•</div>
                <p>Follow up on overdue invoices totaling $3,250</p>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded text-blue-700 mr-2 mt-1">•</div>
                <p>Review recurring expenses to find potential savings</p>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded text-blue-700 mr-2 mt-1">•</div>
                <p>Set aside funds for quarterly tax payments in August</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
