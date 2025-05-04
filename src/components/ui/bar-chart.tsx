
import * as React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface BarChartProps {
  data: any[];
  xField: string;
  yField: string[] | string;
  colors?: string[];
  height?: number;
  category?: string;
}

export function BarChart({
  data,
  xField,
  yField,
  colors = ["#3b82f6", "#94a3b8"],
  height = 350,
  category,
}: BarChartProps) {
  const yFields = Array.isArray(yField) ? yField : [yField];
  
  // Generate configuration
  const config = yFields.reduce((acc, field, index) => {
    acc[field] = {
      label: field,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer className="h-[350px] w-full" config={config}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey={xField}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          width={40}
        />
        <ChartTooltip
          content={({ active, payload }) => (
            <ChartTooltipContent 
              active={active} 
              payload={payload} 
              labelKey={category || xField}
            />
          )}
        />
        <Legend />
        {yFields.map((field, index) => (
          <Bar
            key={field}
            dataKey={field}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
            barSize={25}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}
