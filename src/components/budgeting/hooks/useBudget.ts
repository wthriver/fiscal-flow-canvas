
import { useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { Budget, BudgetCategory } from "@/types/company";
import { toast } from "sonner";

export const useBudget = () => {
  const { currentCompany, updateBudget, addBudget } = useCompany();
  const [newBudgetDialogOpen, setNewBudgetDialogOpen] = useState(false);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [newBudget, setNewBudget] = useState({
    name: "",
    period: "Monthly",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    categories: [] as BudgetCategory[],
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    budgeted: 0,
  });

  // Calculate budget actuals and variance
  const calculateBudgetActuals = (budget: Budget) => {
    let totalBudgeted = 0;
    let totalActual = 0;
    
    budget.categories.forEach(category => {
      totalBudgeted += category.budgeted;
      totalActual += category.actual;
    });
    
    const variance = totalBudgeted - totalActual;
    const variancePercent = totalBudgeted > 0 ? (variance / totalBudgeted) * 100 : 0;
    
    return {
      totalBudgeted: `$${totalBudgeted.toFixed(2)}`,
      totalActual: `$${totalActual.toFixed(2)}`,
      variance: `$${variance.toFixed(2)}`,
      variancePercent: variancePercent.toFixed(1)
    };
  };

  const handleCreateBudget = () => {
    setNewBudgetDialogOpen(true);
  };

  const handleSaveNewBudget = () => {
    if (!newBudget.name) {
      toast.error("Please provide a budget name");
      return;
    }

    const calculatedBudget = calculateBudgetActuals({
      ...newBudget,
      id: `budget-${Date.now()}`,
      status: "Active",
      categories: newBudget.categories
    });
    
    const budgetToAdd: Budget = {
      id: `budget-${Date.now()}`,
      name: newBudget.name,
      period: newBudget.period,
      startDate: newBudget.startDate,
      endDate: newBudget.endDate,
      status: "Active",
      categories: newBudget.categories.map(cat => ({
        id: `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: cat.name,
        type: cat.type || "expense",
        budgeted: cat.budgeted,
        actual: 0
      })),
      totalBudgeted: calculatedBudget.totalBudgeted,
      totalActual: calculatedBudget.totalActual,
      variance: calculatedBudget.variance
    };
    
    addBudget(budgetToAdd);
    
    toast.success("Budget created successfully");
    setNewBudgetDialogOpen(false);
    setNewBudget({
      name: "",
      period: "Monthly",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      categories: [],
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name || newCategory.budgeted <= 0) {
      toast.error("Please provide a category name and budgeted amount");
      return;
    }
    
    setNewBudget({
      ...newBudget,
      categories: [
        ...newBudget.categories,
        {
          id: `temp-${Date.now()}`,
          name: newCategory.name,
          type: newCategory.type,
          budgeted: newCategory.budgeted,
          actual: 0
        }
      ]
    });
    
    setNewCategory({
      name: "",
      type: "expense",
      budgeted: 0
    });
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = [...newBudget.categories];
    updatedCategories.splice(index, 1);
    setNewBudget({
      ...newBudget,
      categories: updatedCategories
    });
  };

  const handleUpdateActual = (budgetId: string, categoryId: string, actualAmount: number) => {
    if (!currentCompany.budgets) return;
    
    const budget = currentCompany.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    const updatedCategories = budget.categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          actual: actualAmount
        };
      }
      return category;
    });
    
    const calculatedBudget = calculateBudgetActuals({
      ...budget,
      categories: updatedCategories
    });
    
    updateBudget({
      ...budget,
      categories: updatedCategories,
      totalActual: calculatedBudget.totalActual,
      variance: calculatedBudget.variance
    });
    
    toast.success("Budget updated");
  };

  const handleEditCategory = (budget: Budget, categoryId: string) => {
    const category = budget.categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    setSelectedBudget(budget);
    setSelectedCategory(category);
    setEditCategoryDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!selectedBudget || !selectedCategory) return;
    
    const updatedCategories = selectedBudget.categories.map(category => 
      category.id === selectedCategory.id ? selectedCategory : category
    );
    
    const calculatedBudget = calculateBudgetActuals({
      ...selectedBudget,
      categories: updatedCategories
    });
    
    updateBudget({
      ...selectedBudget,
      categories: updatedCategories,
      totalBudgeted: calculatedBudget.totalBudgeted,
      totalActual: calculatedBudget.totalActual,
      variance: calculatedBudget.variance
    });
    
    toast.success("Category updated successfully");
    setEditCategoryDialogOpen(false);
  };

  // Format currency numbers
  const formatCurrency = (value: number): string => {
    if (!value) return "$0.00";
    return `$${value.toFixed(2)}`;
  };

  return {
    currentCompany,
    newBudgetDialogOpen,
    setNewBudgetDialogOpen,
    editCategoryDialogOpen,
    setEditCategoryDialogOpen,
    selectedBudget,
    selectedCategory,
    setSelectedCategory,
    newBudget,
    setNewBudget,
    newCategory,
    setNewCategory,
    calculateBudgetActuals,
    handleCreateBudget,
    handleSaveNewBudget,
    handleAddCategory,
    handleRemoveCategory,
    handleUpdateActual,
    handleEditCategory,
    handleUpdateCategory,
    formatCurrency
  };
};
