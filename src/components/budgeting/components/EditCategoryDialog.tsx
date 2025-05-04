
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BudgetCategory } from "@/contexts/CompanyContext";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: BudgetCategory | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<BudgetCategory | null>>;
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update budget category details.
          </DialogDescription>
        </DialogHeader>
        
        {selectedCategory && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category-name" className="text-right">
                Category Name
              </label>
              <Input 
                id="category-name" 
                value={selectedCategory.name}
                onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="budgeted-amount" className="text-right">
                Budgeted Amount
              </label>
              <Input 
                id="budgeted-amount" 
                value={selectedCategory.budgetedAmount}
                onChange={(e) => setSelectedCategory({
                  ...selectedCategory, 
                  budgetedAmount: formatCurrency(e.target.value)
                })}
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="actual-amount" className="text-right">
                Actual Amount
              </label>
              <Input 
                id="actual-amount" 
                value={selectedCategory.actualAmount}
                onChange={(e) => setSelectedCategory({
                  ...selectedCategory, 
                  actualAmount: formatCurrency(e.target.value)
                })}
                className="col-span-3" 
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpdateCategory}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
