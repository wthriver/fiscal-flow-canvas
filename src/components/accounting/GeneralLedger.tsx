
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const GeneralLedger = () => {
  const entries = [
    { id: "1", date: "2025-05-10", account: "Cash", debit: "$1,500.00", credit: "", description: "Initial investment" },
    { id: "2", date: "2025-05-11", account: "Office Supplies", debit: "$250.00", credit: "", description: "Purchase of supplies" },
    { id: "3", date: "2025-05-11", account: "Accounts Payable", debit: "", credit: "$250.00", description: "Purchase of supplies" },
    { id: "4", date: "2025-05-12", account: "Consulting Revenue", debit: "", credit: "$2,000.00", description: "Client project completion" },
    { id: "5", date: "2025-05-12", account: "Accounts Receivable", debit: "$2,000.00", credit: "", description: "Client project completion" },
    { id: "6", date: "2025-05-15", account: "Rent Expense", debit: "$800.00", credit: "", description: "Monthly office rent" },
    { id: "7", date: "2025-05-15", account: "Cash", debit: "", credit: "$800.00", description: "Monthly office rent" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.account}</TableCell>
                  <TableCell>{entry.debit}</TableCell>
                  <TableCell>{entry.credit}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
