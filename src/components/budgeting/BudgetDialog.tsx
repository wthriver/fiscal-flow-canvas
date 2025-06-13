import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Budget, BudgetCategory } from "@/types/company";
import { Plus, Trash2 } from "lucide-react";

interface BudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget | null;
}

export const BudgetDialog: React.FC<BudgetDialogProps> = ({ 
  isOpen, 
  onClose, 
  budget 
}) => {
  const { addBudget, updateBudget } = useCompany();
  const [formData, setFormData] = useState({
    name: budget?.name || "",
    period: budget?.period || "Monthly",
    startDate: budget?.startDate || new Date().toISOString().split('T')[0],
    endDate: budget?.endDate || "",
    status: budget?.status || "Draft"
  });

  const [categories, setCategories] = useState<BudgetCategory[]>(
    budget?.categories || []
  );

  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    budgeted: 0
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name,
        period: budget.period,
        startDate: budget.startDate || new Date().toISOString().split('T')[0],
        endDate: budget.endDate || "",
        status: budget.status || "Draft"
      });
      setCategories(budget.categories || []);
    } else {
      setFormData({
        name: "",
        period: "Monthly",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        status: "Draft"
      });
      setCategories([]);
    }
  }, [budget, isOpen]);

  const handleAddCategory = () => {
    if (!newCategory.name || newCategory.budgeted <= 0) {
      toast.error("Please provide category name and amount");
      return;
    }

    const category: BudgetCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      type: newCategory.type,
      budgeted: newCategory.budgeted,
      actual: 0
    };

    setCategories([...categories, category]);
    setNewCategory({
      name: "",
      type: "expense",
      budgeted: 0
    });
    toast.success("Category added");
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success("Category removed");
  };

  const calculateTotals = () => {
    const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
    const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);
    return { totalBudgeted, totalActual };
  };

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (categories.length === 0) {
      toast.error("Please add at least one budget category");
      return;
    }

    const { totalBudgeted, totalActual } = calculateTotals();

    const budgetData: Budget = {
      id: budget?.id || `budget-${Date.now()}`,
      name: formData.name,
      amount: totalBudgeted, // Required field
      category: "General", // Required field
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status as 'Draft' | 'Active' | 'Completed',
      categories: categories,
      totalBudgeted: `$${totalBudgeted.toFixed(2)}`,
      totalActual: `$${totalActual.toFixed(2)}`,
      variance: `$${(totalBudgeted - totalActual).toFixed(2)}`
    };

    if (budget) {
      updateBudget(budgetData);
      toast.success("Budget updated successfully!");
    } else {
      addBudget(budgetData);
      toast.success("Budget created successfully!");
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
          <DialogDescription>
            {budget ? 'Update budget details and categories' : 'Set up a new budget plan with categories'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Budget Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Budget Name*</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter budget name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Period</label>
              <Select value={formData.period} onValueChange={(value) => setFormData({...formData, period: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date*</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date*</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Category Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Add Budget Category</h3>
            <div className="grid grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="e.g., Marketing, Salaries"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newCategory.type} onValueChange={(value: "income" | "expense") => setNewCategory({...newCategory, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Budgeted Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newCategory.budgeted}
                  onChange={(e) => setNewCategory({...newCategory, budgeted: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              <Button onClick={handleAddCategory} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Categories Table */}
          {categories.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Budgeted</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.type}
                        </span>
                      </TableCell>
                      <TableCell>${category.budgeted.toFixed(2)}</TableCell>
                      <TableCell>${category.actual.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={
                          category.budgeted - category.actual >= 0 ? 'text-green-600' : 'text-red-600'
                        }>
                          ${(category.budgeted - category.actual).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Totals */}
              <div className="border-t p-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Budgeted: ${calculateTotals().totalBudgeted.toFixed(2)}</span>
                  <span>Total Actual: ${calculateTotals().totalActual.toFixed(2)}</span>
                  <span className={
                    calculateTotals().totalBudgeted - calculateTotals().totalActual >= 0 ? 'text-green-600' : 'text-red-600'
                  }>
                    Variance: ${(calculateTotals().totalBudgeted - calculateTotals().totalActual).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {budget ? 'Update Budget' : 'Create Budget'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
