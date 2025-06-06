
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetCategory } from "@/types/company";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: (BudgetCategory & { budgetedAmount?: string; actualAmount?: string }) | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<(BudgetCategory & { budgetedAmount?: string; actualAmount?: string }) | null>>;
  handleUpdateCategory: () => void;
  formatCurrency: (value: string) => string;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  open,
  onOpenChange,
  selectedCategory,
  setSelectedCategory,
  handleUpdateCategory,
  formatCurrency
}) => {
  if (!selectedCategory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update budget category details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-name" className="text-right">
              Category Name
            </Label>
            <Input 
              id="category-name" 
              value={selectedCategory.name}
              onChange={(e) => setSelectedCategory({
                ...selectedCategory, 
                name: e.target.value
              })}
              className="col-span-3" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-type" className="text-right">
              Type
            </Label>
            <Select
              value={selectedCategory.type}
              onValueChange={(value: "income" | "expense") => 
                setSelectedCategory({
                  ...selectedCategory, 
                  type: value
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budgeted-amount" className="text-right">
              Budgeted Amount
            </Label>
            <Input 
              id="budgeted-amount" 
              value={selectedCategory.budgetedAmount || `$${selectedCategory.budgeted.toFixed(2)}`}
              onChange={(e) => setSelectedCategory({
                ...selectedCategory, 
                budgetedAmount: formatCurrency(e.target.value)
              })}
              className="col-span-3" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="actual-amount" className="text-right">
              Actual Amount
            </Label>
            <Input 
              id="actual-amount" 
              value={selectedCategory.actualAmount || `$${selectedCategory.actual.toFixed(2)}`}
              onChange={(e) => setSelectedCategory({
                ...selectedCategory, 
                actualAmount: formatCurrency(e.target.value)
              })}
              className="col-span-3" 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpdateCategory}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
