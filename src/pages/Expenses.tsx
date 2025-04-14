
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ViewButton, 
  FilterButton, 
  ExportButton, 
  DateRangeButton, 
  ActionDropdown 
} from "@/components/common/ActionButtons";
import { useCompany } from "@/contexts/CompanyContext";
import { Expense } from "@/contexts/CompanyContext";
import { NewExpenseDialog } from "@/components/expenses/NewExpenseDialog";
import { FilterDialog } from "@/components/expenses/FilterDialog";
import { ExportDialog } from "@/components/expenses/ExportDialog";
import { DateRangeDialog } from "@/components/invoices/DateRangeDialog";

const Expenses: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  // Dialog open states
  const [newExpenseDialogOpen, setNewExpenseDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);
  
  // Filter expenses based on search text, status, and date range
  const filteredExpenses = currentCompany.expenses.filter(expense => {
    // Search text filter
    const matchesSearch = 
      expense.id.toLowerCase().includes(searchText.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchText.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchText.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      selectedStatus === "all" || 
      expense.status.toLowerCase() === selectedStatus.toLowerCase() ||
      (selectedStatus === "office-supplies" && expense.category === "Office Supplies") ||
      (selectedStatus === "utilities" && expense.category === "Utilities") ||
      (selectedStatus === "rent" && expense.category === "Rent") ||
      (selectedStatus === "travel" && expense.category === "Travel") ||
      (selectedStatus === "software" && expense.category === "Software");
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from || dateRange.to) {
      const expenseDate = new Date(expense.date);
      
      if (dateRange.from && dateRange.to) {
        matchesDateRange = expenseDate >= dateRange.from && expenseDate <= dateRange.to;
      } else if (dateRange.from) {
        matchesDateRange = expenseDate >= dateRange.from;
      } else if (dateRange.to) {
        matchesDateRange = expenseDate <= dateRange.to;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Event handlers
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };

  // Custom button components for our dialogs
  const CustomFilterButton = () => (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-9"
      onClick={() => setFilterDialogOpen(true)}
    >
      Filter
    </Button>
  );

  const CustomExportButton = () => (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-9"
      onClick={() => setExportDialogOpen(true)}
    >
      Export
    </Button>
  );

  const CustomDateRangeButton = () => (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-9"
      onClick={() => setDateRangeDialogOpen(true)}
    >
      Date Range
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track and manage {currentCompany.name}'s business expenses</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setNewExpenseDialogOpen(true)}
        >
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CustomDateRangeButton />
          <CustomFilterButton />
          <CustomExportButton />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>You have {currentCompany.expenses.length} total expenses</CardDescription>
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
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.vendor}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expense.status === "Approved" || expense.status === "Paid"
                          ? "bg-green-100 text-green-800" 
                          : expense.status === "Pending" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-red-100 text-red-800"
                      }`}>
                        {expense.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <ViewButton id={expense.id} type="Expense" />
                        <ActionDropdown id={expense.id} type="Expense" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    {searchText || selectedStatus !== "all" || dateRange.from || dateRange.to
                      ? "No expenses found matching your search or filters"
                      : "No expenses found for this company."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NewExpenseDialog 
        open={newExpenseDialogOpen} 
        onOpenChange={setNewExpenseDialogOpen} 
      />
      
      <FilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen}
        onApplyFilter={setSelectedStatus}
        currentFilter={selectedStatus}
      />
      
      <ExportDialog 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen}
        expensesCount={filteredExpenses.length}
      />
      
      <DateRangeDialog 
        open={dateRangeDialogOpen} 
        onOpenChange={setDateRangeDialogOpen}
        onApplyDateRange={handleDateRangeChange}
        currentDateRange={dateRange}
      />
    </div>
  );
};

export default Expenses;
