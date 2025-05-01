
import React, { useState } from "react";
import { NewExpenseDialog } from "@/components/expenses/NewExpenseDialog";
import { FilterDialog } from "@/components/expenses/FilterDialog";
import { ExportDialog } from "@/components/expenses/ExportDialog";
import { DigitalReceiptCapture } from "@/components/expenses/DigitalReceiptCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { expenseCategories } from "@/utils/expenseCategories";
import { Plus, Filter, Download, Camera } from "lucide-react";

const Expenses = () => {
  const { currentCompany } = useCompany();
  const { expenses } = currentCompany;
  const [isNewExpenseDialogOpen, setIsNewExpenseDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsNewExpenseDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Expense
          </Button>
          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("receipts")}>
            <Camera className="mr-2 h-4 w-4" />
            Scan Receipt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$5,525.00</p>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Unpaid</CardTitle>
            <CardDescription>Pending expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$925.00</p>
            <p className="text-xs text-muted-foreground">2 unpaid expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Category</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Rent</p>
            <p className="text-xs text-muted-foreground">$4,000.00 (72.4%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expense Count</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">-3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="receipts">Digital Receipts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expense.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : expense.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {expense.status}
                    </span>
                  </TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="receipts">
          <DigitalReceiptCapture />
        </TabsContent>
      </Tabs>

      <NewExpenseDialog
        open={isNewExpenseDialogOpen}
        onOpenChange={setIsNewExpenseDialogOpen}
      />
      
      <FilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
      />
      
      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        expensesCount={expenses.length}
      />
    </div>
  );
};

export default Expenses;
