
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { format, subMonths, parseISO } from "date-fns";
import { useCompany } from "@/contexts/CompanyContext";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-finance-blue-600">
          Income: ${payload[0].value?.toLocaleString()}
        </p>
        <p className="text-finance-red-500">
          Expenses: ${payload[1].value?.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

const RevenueChart: React.FC = () => {
  const { currentCompany } = useCompany();
  
  // Generate chart data based on company revenue
  const generateData = () => {
    const result = [];
    const currentDate = new Date();
    const baseIncome = currentCompany.revenue.current / 6; // Distribute over 6 months
    const baseExpense = baseIncome * (1 - (currentCompany.profitMargin.value / 100)); // Calculate expenses based on profit margin
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      // Create some variability in the data
      const variabilityFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
      
      result.push({
        month: format(date, "MMM"),
        income: Math.round(baseIncome * variabilityFactor),
        expenses: Math.round(baseExpense * variabilityFactor),
      });
    }
    
    return result;
  };

  const data = generateData();

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>Revenue & Expenses</CardTitle>
        <CardDescription>{currentCompany.name}'s financial performance over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3182ce" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e53e3e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#e53e3e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#3182ce" 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="#e53e3e" 
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
