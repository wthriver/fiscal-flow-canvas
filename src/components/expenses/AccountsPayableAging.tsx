
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const AccountsPayableAging = () => {
  const payables = [
    { 
      id: "1", 
      vendor: "Office Supply Co.", 
      invoiceNumber: "INV-2025-001", 
      total: "$1,250.00", 
      due: "2025-05-30",
      age: "Current",
      status: "Pending"
    },
    { 
      id: "2", 
      vendor: "Tech Solutions Inc", 
      invoiceNumber: "INV-2024-089", 
      total: "$3,500.00", 
      due: "2025-05-10",
      age: "1-30 days",
      status: "Overdue"
    },
    { 
      id: "3", 
      vendor: "Marketing Experts", 
      invoiceNumber: "INV-2024-156", 
      total: "$2,800.00", 
      due: "2025-04-15",
      age: "31-60 days",
      status: "Overdue"
    },
    { 
      id: "4", 
      vendor: "Consulting Partners", 
      invoiceNumber: "INV-2024-201", 
      total: "$5,000.00", 
      due: "2025-03-01",
      age: "61-90 days",
      status: "Overdue"
    },
    { 
      id: "5", 
      vendor: "Legal Services LLC", 
      invoiceNumber: "INV-2024-032", 
      total: "$2,200.00", 
      due: "2025-02-15",
      age: ">90 days",
      status: "Overdue"
    },
  ];

  const agingSummary = [
    { period: "Current", amount: "$1,250.00" },
    { period: "1-30 days", amount: "$3,500.00" },
    { period: "31-60 days", amount: "$2,800.00" },
    { period: "61-90 days", amount: "$5,000.00" },
    { period: ">90 days", amount: "$2,200.00" },
    { period: "Total", amount: "$14,750.00" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {agingSummary.map((item, index) => (
          <Card key={index} className={index === 5 ? "bg-muted" : ""}>
            <CardContent className="p-4">
              <div className="text-sm font-medium">{item.period}</div>
              <div className="text-xl font-bold mt-1">{item.amount}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Accounts Payable Aging</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payables.map((payable) => (
                <TableRow key={payable.id}>
                  <TableCell>{payable.vendor}</TableCell>
                  <TableCell>{payable.invoiceNumber}</TableCell>
                  <TableCell>{payable.total}</TableCell>
                  <TableCell>{payable.due}</TableCell>
                  <TableCell>{payable.age}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={payable.status === "Pending" ? "outline" : "destructive"}
                    >
                      {payable.status}
                    </Badge>
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
