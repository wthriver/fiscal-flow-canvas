
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCompany } from "@/contexts/CompanyContext";

const InvoiceStatus = () => {
  const { currentCompany } = useCompany();
  
  // Calculate counts for different invoice statuses with safety checks
  const invoices = currentCompany?.invoices || [];
  
  const invoiceStatusCounts = {
    paid: invoices.filter(inv => inv.status === "Paid").length,
    pending: invoices.filter(inv => ["Draft", "Sent", "Viewed"].includes(inv.status)).length,
    overdue: invoices.filter(inv => inv.status === "Overdue").length,
  };
  
  const total = Object.values(invoiceStatusCounts).reduce((a, b) => a + b, 0);
  
  // Calculate percentages
  const percentages = {
    paid: total > 0 ? (invoiceStatusCounts.paid / total * 100) : 0,
    pending: total > 0 ? (invoiceStatusCounts.pending / total * 100) : 0,
    overdue: total > 0 ? (invoiceStatusCounts.overdue / total * 100) : 0,
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Invoice Status</CardTitle>
        <CardDescription>
          {total} total invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Paid</div>
            <div className="font-medium">{invoiceStatusCounts.paid}</div>
          </div>
          <Progress value={percentages.paid} className="h-2 bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Pending</div>
            <div className="font-medium">{invoiceStatusCounts.pending}</div>
          </div>
          <Progress value={percentages.pending} className="h-2 bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Overdue</div>
            <div className="font-medium">{invoiceStatusCounts.overdue}</div>
          </div>
          <Progress value={percentages.overdue} className="h-2 bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceStatus;
