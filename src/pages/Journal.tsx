
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, Search, FileText, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Journal: React.FC = () => {
  // Sample journal entries
  const journalEntries = [
    { 
      id: "JE-001", 
      date: "2025-04-10", 
      memo: "Monthly Rent Payment", 
      debitAccount: "Rent Expense", 
      creditAccount: "Bank Account", 
      amount: "$2,500.00",
      status: "Posted"
    },
    { 
      id: "JE-002", 
      date: "2025-04-08", 
      memo: "Client Retainer", 
      debitAccount: "Bank Account", 
      creditAccount: "Unearned Revenue", 
      amount: "$5,000.00",
      status: "Posted"
    },
    { 
      id: "JE-003", 
      date: "2025-04-05", 
      memo: "Payroll Entry", 
      debitAccount: "Salary Expense", 
      creditAccount: "Bank Account", 
      amount: "$8,750.00",
      status: "Posted"
    },
    { 
      id: "JE-004", 
      date: "2025-04-03", 
      memo: "Utility Payment", 
      debitAccount: "Utilities Expense", 
      creditAccount: "Bank Account", 
      amount: "$345.67",
      status: "Posted"
    },
    { 
      id: "JE-005", 
      date: "2025-04-01", 
      memo: "Depreciation Expense", 
      debitAccount: "Depreciation Expense", 
      creditAccount: "Accumulated Depreciation", 
      amount: "$833.33",
      status: "Draft"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Journal Entries</h1>
          <p className="text-muted-foreground">Record and manage your manual journal entries</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>New Journal Entry</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search journal entries..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Date Range</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>Showing all manual journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Memo</TableHead>
                <TableHead>Debit Account</TableHead>
                <TableHead>Credit Account</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.id}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.memo}</TableCell>
                  <TableCell>{entry.debitAccount}</TableCell>
                  <TableCell>{entry.creditAccount}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.status === "Posted" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {entry.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText size={16} />
                      <span className="sr-only">View</span>
                    </Button>
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

export default Journal;
