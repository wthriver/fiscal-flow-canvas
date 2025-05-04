
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { useCompany } from "@/contexts/CompanyContext";

const RevenueChart = () => {
  const { currentCompany } = useCompany();

  // Sample data if the real data is not available
  const defaultData = [
    { month: "Jan", revenue: 4000, profit: 1240 },
    { month: "Feb", revenue: 3000, profit: 900 },
    { month: "Mar", revenue: 5000, profit: 1500 },
    { month: "Apr", revenue: 8000, profit: 2800 },
    { month: "May", revenue: 7000, profit: 2100 },
    { month: "Jun", revenue: 9000, profit: 3150 },
  ];

  // Current year revenue (use actual data or default)
  const currentRevenue = currentCompany.revenue && Array.isArray(currentCompany.revenue) ? 0 : 
    currentCompany.revenue?.current || 0;
  
  const profitMargin = currentCompany.profitMargin && Array.isArray(currentCompany.profitMargin) ? 30 : 
    currentCompany.profitMargin?.value || 30;

  // Calculate profit based on revenue and profit margin
  const currentYearData = defaultData.map(item => ({
    ...item,
    profit: Math.round(item.revenue * (profitMargin / 100))
  }));

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 shadow-md rounded-md">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-sm text-green-600">
            Revenue: ${payload[0].value?.toLocaleString()}
          </p>
          <p className="text-sm text-blue-600">
            Profit: ${payload[1].value?.toLocaleString()}
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue & Profit</CardTitle>
        <CardDescription>
          Year-to-date financial performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentYearData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#3B82F6"
                fill="url(#colorProfit)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
