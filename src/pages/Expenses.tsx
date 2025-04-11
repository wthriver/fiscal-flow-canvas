
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Receipt, Filter, Download, Search, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Expenses: React.FC = () => {
  // Sample expense data
  const expenses = [
    { id: "EXP-001", category: "Office Supplies", vendor: "Staples", date: "2025-04-09", amount: "$150.00", status: "Approved" },
    { id: "EXP-002", category: "Travel", vendor: "Uber", date: "2025-04-07", amount: "$48.75", status: "Pending" },
    { id: "EXP-003", category: "Utilities", vendor: "Electric Company", date: "2025-04-05", amount: "$235.40", status: "Approved" },
    { id: "EXP-004", category: "Software", vendor: "Adobe", date: "2025-04-02", amount: "$59.99", status: "Approved" },
    { id: "EXP-005", category: "Meals", vendor: "Restaurant Corp", date: "2025-03-30", amount: "$87.50", status: "Denied" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track and manage your business expenses</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>Add Expense</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <CalendarIcon size={16} />
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
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>You have {expenses.length} total expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expense.status === "Approved" 
                        ? "bg-green-100 text-green-800" 
                        : expense.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                    }`}>
                      {expense.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Receipt size={16} />
                      <span className="sr-only">View Receipt</span>
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

export default Expenses;
