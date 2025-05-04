
import { useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { Budget, BudgetCategory } from "@/contexts/CompanyContext";
import { toast } from "sonner";

export const useBudget = () => {
  const { currentCompany, updateCompany, updateBudget } = useCompany();
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
    totalBudgeted: "$0.00",
    totalActual: "$0.00"
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    budgetedAmount: "$0.00"
  });

  // Calculate budget actuals and variance
  const calculateBudgetActuals = (budget: Budget) => {
    let totalBudgeted = 0;
    let totalActual = 0;
    
    budget.categories.forEach(category => {
      totalBudgeted += parseFloat(category.budgetedAmount.replace(/[^0-9.-]+/g, "") || "0");
      totalActual += parseFloat(category.actualAmount.replace(/[^0-9.-]+/g, "") || "0");
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
      categories: newBudget.categories.map(cat => ({
        ...cat,
        actualAmount: "$0.00",
        variance: cat.budgetedAmount
      })),
      variance: "$0.00" // Add the missing variance field
    });
    
    const budgetToAdd: Budget = {
      id: `budget-${Date.now()}`,
      name: newBudget.name,
      period: newBudget.period,
      startDate: newBudget.startDate,
      endDate: newBudget.endDate,
      categories: newBudget.categories.map(cat => ({
        id: `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: cat.name,
        budgetedAmount: cat.budgetedAmount,
        actualAmount: "$0.00",
        variance: cat.budgetedAmount
      })),
      totalBudgeted: calculatedBudget.totalBudgeted,
      totalActual: calculatedBudget.totalActual,
      variance: calculatedBudget.variance
    };
    
    updateCompany(currentCompany.id, {
      budgets: [...currentCompany.budgets, budgetToAdd]
    });
    
    toast.success("Budget created successfully");
    setNewBudgetDialogOpen(false);
    setNewBudget({
      name: "",
      period: "Monthly",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      categories: [],
      totalBudgeted: "$0.00",
      totalActual: "$0.00"
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.budgetedAmount) {
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
          budgetedAmount: newCategory.budgetedAmount,
          actualAmount: "$0.00",
          variance: newCategory.budgetedAmount
        }
      ]
    });
    
    setNewCategory({
      name: "",
      budgetedAmount: "$0.00"
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

  const handleUpdateActual = (budgetId: string, categoryId: string, actualAmount: string) => {
    const budget = currentCompany.budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    const numericActual = parseFloat(actualAmount.replace(/[^0-9.-]+/g, "") || "0");
    const formattedActual = `$${numericActual.toFixed(2)}`;
    
    const updatedCategories = budget.categories.map(category => {
      if (category.id === categoryId) {
        const budgetedAmount = parseFloat(category.budgetedAmount.replace(/[^0-9.-]+/g, "") || "0");
        const variance = `$${(budgetedAmount - numericActual).toFixed(2)}`;
        
        return {
          ...category,
          actualAmount: formattedActual,
          variance
        };
      }
      return category;
    });
    
    const calculatedBudget = calculateBudgetActuals({
      ...budget,
      categories: updatedCategories
    });
    
    updateBudget(budgetId, {
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
    
    updateBudget(selectedBudget.id, {
      categories: updatedCategories,
      totalBudgeted: calculatedBudget.totalBudgeted,
      totalActual: calculatedBudget.totalActual,
      variance: calculatedBudget.variance
    });
    
    toast.success("Category updated successfully");
    setEditCategoryDialogOpen(false);
  };

  // Format currency numbers
  const formatCurrency = (value: string): string => {
    if (!value) return "$0.00";
    
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, "") || "0");
    return `$${numericValue.toFixed(2)}`;
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
