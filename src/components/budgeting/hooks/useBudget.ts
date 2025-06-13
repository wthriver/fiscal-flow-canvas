
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
    period: "Monthly" as "Monthly" | "Quarterly" | "Annual",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    categories: [] as BudgetCategory[],
    totalBudgeted: "$0.00",
    totalActual: "$0.00"
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    budgeted: 0,
    budgetedAmount: "$0.00"
  });

  // Calculate budget actuals and variance
  const calculateBudgetActuals = (budget: Budget) => {
    let totalBudgeted = 0;
    let totalActual = 0;
    
    budget.categories?.forEach(category => {
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

    if (newBudget.categories.length === 0) {
      toast.error("Please add at least one budget category");
      return;
    }

    // Calculate totals from categories
    const totalBudgeted = newBudget.categories.reduce((sum, cat) => sum + cat.budgeted, 0);
    
    const budgetToAdd: Budget = {
      id: `budget-${Date.now()}`,
      name: newBudget.name,
      amount: totalBudgeted, // Required field
      category: "General", // Required field
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
      totalBudgeted: `$${totalBudgeted.toFixed(2)}`,
      totalActual: "$0.00",
      variance: `$${totalBudgeted.toFixed(2)}`
    };
    
    addBudget(budgetToAdd);
    
    toast.success("Budget created successfully");
    setNewBudgetDialogOpen(false);
    
    // Reset form
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
    if (!newCategory.name || newCategory.budgeted <= 0) {
      toast.error("Please provide a category name and budgeted amount");
      return;
    }
    
    const categoryToAdd: BudgetCategory = {
      id: `temp-${Date.now()}`,
      name: newCategory.name,
      type: newCategory.type,
      budgeted: newCategory.budgeted,
      actual: 0
    };
    
    setNewBudget({
      ...newBudget,
      categories: [...newBudget.categories, categoryToAdd]
    });
    
    setNewCategory({
      name: "",
      type: "expense",
      budgeted: 0,
      budgetedAmount: "$0.00"
    });
    
    toast.success("Category added");
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = [...newBudget.categories];
    updatedCategories.splice(index, 1);
    setNewBudget({
      ...newBudget,
      categories: updatedCategories
    });
    toast.success("Category removed");
  };

  const handleUpdateActual = (budgetId: string, categoryId: string, actualAmount: number) => {
    if (!currentCompany.budgets) return;
    
    const budget = currentCompany.budgets.find(b => b.id === budgetId);
    if (!budget || !budget.categories) return;
    
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
    if (!budget.categories) return;
    
    const category = budget.categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    setSelectedBudget(budget);
    setSelectedCategory({
      ...category,
      budgetedAmount: `$${category.budgeted.toFixed(2)}`,
      actualAmount: `$${category.actual.toFixed(2)}`
    });
    setEditCategoryDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!selectedBudget || !selectedCategory || !selectedBudget.categories) return;
    
    const budgetedValue = parseFloat(selectedCategory.budgetedAmount?.replace(/[^0-9.-]+/g, "") || "0");
    const actualValue = parseFloat(selectedCategory.actualAmount?.replace(/[^0-9.-]+/g, "") || "0");
    
    const updatedCategories = selectedBudget.categories.map(category => 
      category.id === selectedCategory.id 
        ? {
            ...category,
            name: selectedCategory.name,
            budgeted: budgetedValue,
            actual: actualValue
          }
        : category
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
    setSelectedCategory(null);
    setSelectedBudget(null);
  };

  // Format currency numbers
  const formatCurrency = (value: string): string => {
    const numValue = parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
    return `$${numValue.toFixed(2)}`;
  };

  // Update newCategory budgeted amount when budgetedAmount changes
  const updateNewCategoryAmount = (amount: string) => {
    const numValue = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
    setNewCategory({
      ...newCategory,
      budgetedAmount: formatCurrency(amount),
      budgeted: numValue
    });
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
    setNewCategory: (category: any) => {
      if (category.budgetedAmount !== undefined) {
        updateNewCategoryAmount(category.budgetedAmount);
      } else {
        setNewCategory(category);
      }
    },
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
