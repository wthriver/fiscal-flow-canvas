
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const RecurringInvoices = () => {
  const recurringInvoices = [
    { id: "1", client: "Acme Corp", amount: "$1,200.00", frequency: "Monthly", nextDate: "2025-06-15", status: "Active" },
    { id: "2", client: "Globex Industries", amount: "$2,500.00", frequency: "Quarterly", nextDate: "2025-08-01", status: "Active" },
    { id: "3", client: "Wayne Enterprises", amount: "$5,000.00", frequency: "Monthly", nextDate: "2025-06-10", status: "Active" },
    { id: "4", client: "Stark Industries", amount: "$1,800.00", frequency: "Biweekly", nextDate: "2025-05-28", status: "Paused" },
    { id: "5", client: "Oscorp", amount: "$3,200.00", frequency: "Monthly", nextDate: "2025-06-05", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recurring Invoices</h2>
        <Button>New Recurring Invoice</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Recurring Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.frequency}</TableCell>
                  <TableCell>{invoice.nextDate}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Active" ? "default" : "secondary"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
