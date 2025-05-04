
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useBudget } from "./hooks/useBudget";
import { BudgetCard } from "./components/BudgetCard";
import { NewBudgetDialog } from "./components/NewBudgetDialog";
import { EditCategoryDialog } from "./components/EditCategoryDialog";
import { BudgetTable } from "./components/BudgetTable";
import { BudgetSummary } from "./components/BudgetSummary";
import { BudgetAnalysis } from "./components/BudgetAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BudgetingDashboard: React.FC = () => {
  const {
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
  } = useBudget();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budgeting</h1>
          <p className="text-muted-foreground">Manage and track {currentCompany.name}'s financial budgets</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => toast.info("Downloading budget report...")}
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateBudget}
          >
            <PlusCircle size={16} />
            <span>New Budget</span>
          </Button>
        </div>
      </div>
      
      {currentCompany.budgets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentCompany.budgets.slice(0, 3).map(budget => {
              const budgetCalculations = calculateBudgetActuals(budget);
              return (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  calculations={budgetCalculations}
                />
              );
            })}
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue={currentCompany.budgets[0]?.id}>
                <TabsList className="mb-4">
                  {currentCompany.budgets.map(budget => (
                    <TabsTrigger key={budget.id} value={budget.id}>
                      {budget.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {currentCompany.budgets.map(budget => {
                  const calculatedBudget = calculateBudgetActuals(budget);
                  
                  // Prepare chart data
                  const chartData = budget.categories.map(category => ({
                    name: category.name,
                    budgeted: parseFloat(category.budgetedAmount.replace(/[^0-9.-]+/g, "") || "0"),
                    actual: parseFloat(category.actualAmount.replace(/[^0-9.-]+/g, "") || "0")
                  }));
                  
                  return (
                    <TabsContent key={budget.id} value={budget.id}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                          <div className="lg:col-span-3">
                            <BudgetTable 
                              budget={budget}
                              handleUpdateActual={handleUpdateActual}
                              handleEditCategory={handleEditCategory}
                            />
                            
                            <BudgetSummary calculatedBudget={calculatedBudget} />
                          </div>
                          
                          <BudgetAnalysis chartData={chartData} />
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 size={48} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Budgets Created</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Create your first budget to start tracking your finances against your goals.
            </p>
            <Button onClick={handleCreateBudget}>Create Your First Budget</Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <NewBudgetDialog
        open={newBudgetDialogOpen}
        onOpenChange={setNewBudgetDialogOpen}
        newBudget={newBudget}
        setNewBudget={setNewBudget}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleSaveNewBudget={handleSaveNewBudget}
        handleAddCategory={handleAddCategory}
        handleRemoveCategory={handleRemoveCategory}
        formatCurrency={formatCurrency}
      />
      
      <EditCategoryDialog
        open={editCategoryDialogOpen}
        onOpenChange={setEditCategoryDialogOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleUpdateCategory={handleUpdateCategory}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};
