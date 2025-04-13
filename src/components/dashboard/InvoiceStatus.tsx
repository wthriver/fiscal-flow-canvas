
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useCompany } from "@/contexts/CompanyContext";

const InvoiceStatus: React.FC = () => {
  const { currentCompany } = useCompany();
  
  // Calculate invoice status data based on current company
  const calculateInvoiceStatusData = () => {
    // Count invoices by status
    const paidCount = currentCompany.invoices.filter(inv => inv.status === "Paid").length;
    const pendingCount = currentCompany.invoices.filter(inv => inv.status === "Pending" || inv.status === "Outstanding").length;
    const overdueCount = currentCompany.invoices.filter(inv => inv.status === "Overdue").length;
    
    const total = Math.max(paidCount + pendingCount + overdueCount, 1); // Avoid division by zero
    
    return [
      { name: "Paid", value: (paidCount / total) * 100, color: "#16a34a" },
      { name: "Unpaid", value: (pendingCount / total) * 100, color: "#f97316" },
      { name: "Overdue", value: (overdueCount / total) * 100, color: "#dc2626" },
    ];
  };

  const data = calculateInvoiceStatusData();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Invoice Status</CardTitle>
        <CardDescription>Summary of {currentCompany.name}'s invoice status</CardDescription>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                // Ensure value is a number before calling toFixed
                return [typeof value === 'number' ? `${value.toFixed(0)}%` : `${value}%`, "Percentage"];
              }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvoiceStatus;
