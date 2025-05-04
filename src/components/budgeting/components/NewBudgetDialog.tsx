
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BudgetCategory } from "@/contexts/CompanyContext";
import { toast } from "sonner";

interface NewBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newBudget: {
    name: string;
    period: string;
    startDate: string;
    endDate: string;
    categories: BudgetCategory[];
    totalBudgeted: string;
    totalActual: string;
  };
  setNewBudget: React.Dispatch<React.SetStateAction<{
    name: string;
    period: string;
    startDate: string;
    endDate: string;
    categories: BudgetCategory[];
    totalBudgeted: string;
    totalActual: string;
  }>>;
  newCategory: {
    name: string;
    budgetedAmount: string;
  };
  setNewCategory: React.Dispatch<React.SetStateAction<{
    name: string;
    budgetedAmount: string;
  }>>;
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription>
            Set up a new budget to track income and expenses.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="budget-name" className="text-right">
              Budget Name*
            </label>
            <Input 
              id="budget-name" 
              placeholder="Q2 2025 Operating Budget"
              value={newBudget.name}
              onChange={(e) => setNewBudget({...newBudget, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="budget-period" className="text-right">
              Period*
            </label>
            <select
              id="budget-period"
              value={newBudget.period}
              onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
              className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="start-date" className="text-right">
              Start Date*
            </label>
            <Input 
              id="start-date" 
              type="date"
              value={newBudget.startDate}
              onChange={(e) => setNewBudget({...newBudget, startDate: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="end-date" className="text-right">
              End Date*
            </label>
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
              <div className="flex items-end gap-2">
                <div>
                  <label htmlFor="category-name" className="text-xs mb-1 block">
                    Category Name
                  </label>
                  <Input 
                    id="category-name" 
                    placeholder="Rent"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="category-amount" className="text-xs mb-1 block">
                    Budget Amount
                  </label>
                  <Input 
                    id="category-amount" 
                    placeholder="$0.00"
                    value={newCategory.budgetedAmount}
                    onChange={(e) => setNewCategory({
                      ...newCategory, 
                      budgetedAmount: formatCurrency(e.target.value)
                    })}
                  />
                </div>
                <Button size="sm" onClick={handleAddCategory}>Add</Button>
              </div>
            </div>
            
            {newBudget.categories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Budgeted Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newBudget.categories.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.budgetedAmount}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveCategory(index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-4 border rounded-md text-muted-foreground">
                No categories added yet. Add categories to complete your budget.
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSaveNewBudget}>Create Budget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
