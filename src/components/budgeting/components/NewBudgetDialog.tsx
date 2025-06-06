
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BudgetCategory } from "@/types/company";

interface NewBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newBudget: {
    name: string;
    period: "Monthly" | "Quarterly" | "Annual";
    startDate: string;
    endDate: string;
    categories: BudgetCategory[];
    totalBudgeted: string;
    totalActual: string;
  };
  setNewBudget: React.Dispatch<React.SetStateAction<{
    name: string;
    period: "Monthly" | "Quarterly" | "Annual";
    startDate: string;
    endDate: string;
    categories: BudgetCategory[];
    totalBudgeted: string;
    totalActual: string;
  }>>;
  newCategory: {
    name: string;
    type: "income" | "expense";
    budgeted: number;
    budgetedAmount: string;
  };
  setNewCategory: (category: any) => void;
  handleSaveNewBudget: () => void;
  handleAddCategory: () => void;
  handleRemoveCategory: (index: number) => void;
  formatCurrency: (value: string) => string;
}

export const NewBudgetDialog: React.FC<NewBudgetDialogProps> = ({
  open,
  onOpenChange,
  newBudget,
  setNewBudget,
  newCategory,
  setNewCategory,
  handleSaveNewBudget,
  handleAddCategory,
  handleRemoveCategory,
  formatCurrency
}) => {
  const totalBudgeted = newBudget.categories.reduce((sum, cat) => sum + cat.budgeted, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Set up a new budget to track income and expenses.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget-name" className="text-right">
              Budget Name*
            </Label>
            <Input 
              id="budget-name" 
              placeholder="Q2 2025 Operating Budget"
              value={newBudget.name}
              onChange={(e) => setNewBudget({...newBudget, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget-period" className="text-right">
              Period*
            </Label>
            <Select 
              value={newBudget.period} 
              onValueChange={(value: "Monthly" | "Quarterly" | "Annual") => 
                setNewBudget({...newBudget, period: value})
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-date" className="text-right">
              Start Date*
            </Label>
            <Input 
              id="start-date" 
              type="date"
              value={newBudget.startDate}
              onChange={(e) => setNewBudget({...newBudget, startDate: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-date" className="text-right">
              End Date*
            </Label>
            <Input 
              id="end-date" 
              type="date"
              value={newBudget.endDate}
              onChange={(e) => setNewBudget({...newBudget, endDate: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Budget Categories</h3>
              <div className="text-sm text-muted-foreground">
                Total: <span className="font-semibold">${totalBudgeted.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-2 mb-4 p-3 border rounded-lg bg-muted/20">
              <div className="col-span-4">
                <Label htmlFor="category-name" className="text-xs mb-1 block">
                  Category Name
                </Label>
                <Input 
                  id="category-name" 
                  placeholder="Rent"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="category-type" className="text-xs mb-1 block">
                  Type
                </Label>
                <Select 
                  value={newCategory.type} 
                  onValueChange={(value: "income" | "expense") => 
                    setNewCategory({...newCategory, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label htmlFor="category-amount" className="text-xs mb-1 block">
                  Budget Amount
                </Label>
                <Input 
                  id="category-amount" 
                  placeholder="$0.00"
                  value={newCategory.budgetedAmount}
                  onChange={(e) => setNewCategory({
                    ...newCategory, 
                    budgetedAmount: e.target.value
                  })}
                />
              </div>
              <div className="col-span-2 flex items-end">
                <Button size="sm" onClick={handleAddCategory} className="w-full">
                  Add
                </Button>
              </div>
            </div>
            
            {newBudget.categories.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newBudget.categories.map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <Badge variant={category.type === 'income' ? 'default' : 'secondary'}>
                            {category.type}
                          </Badge>
                        </TableCell>
                        <TableCell>${category.budgeted.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveCategory(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-6 border rounded-md text-muted-foreground bg-muted/10">
                <p className="mb-2">No categories added yet</p>
                <p className="text-sm">Add categories above to complete your budget setup</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveNewBudget}
            disabled={!newBudget.name || newBudget.categories.length === 0}
          >
            Create Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
