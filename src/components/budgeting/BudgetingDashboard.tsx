
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, BarChart3, FileText, Calendar, Filter, ArrowRight, ArrowDown, ArrowUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Budget, BudgetCategory } from "@/contexts/CompanyContext";
import { BarChart } from "@/components/ui/chart";

export const BudgetingDashboard: React.FC = () => {
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
      }))
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
              const actualPercent = parseFloat(budgetCalculations.totalBudgeted.replace(/[^0-9.-]+/g, "")) > 0 
                ? (parseFloat(budgetCalculations.totalActual.replace(/[^0-9.-]+/g, "")) / parseFloat(budgetCalculations.totalBudgeted.replace(/[^0-9.-]+/g, ""))) * 100
                : 0;
              
              return (
                <Card key={budget.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{budget.name}</CardTitle>
                    <CardDescription>
                      {budget.period} ({budget.startDate} to {budget.endDate})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Budget: {budgetCalculations.totalBudgeted}</span>
                      <span>Actual: {budgetCalculations.totalActual}</span>
                    </div>
                    <Progress value={actualPercent} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        <span className={parseFloat(budgetCalculations.variance) >= 0 ? "text-green-600" : "text-red-600"}>
                          {parseFloat(budgetCalculations.variance) >= 0 ? "Under" : "Over"} by {budgetCalculations.variance}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {parseFloat(budgetCalculations.variancePercent) >= 0 ? "+" : ""}{budgetCalculations.variancePercent}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Budget Details</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Calendar size={16} />
                    <span>Select Period</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Filter size={16} />
                    <span>Filter</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Category</TableHead>
                                  <TableHead>Budgeted</TableHead>
                                  <TableHead>Actual</TableHead>
                                  <TableHead>Variance</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {budget.categories.map((category) => {
                                  const budgetedAmount = parseFloat(category.budgetedAmount.replace(/[^0-9.-]+/g, "") || "0");
                                  const actualAmount = parseFloat(category.actualAmount.replace(/[^0-9.-]+/g, "") || "0");
                                  const variance = budgetedAmount - actualAmount;
                                  const percentUsed = budgetedAmount > 0 ? (actualAmount / budgetedAmount) * 100 : 0;
                                  
                                  return (
                                    <TableRow key={category.id}>
                                      <TableCell className="font-medium">{category.name}</TableCell>
                                      <TableCell>{category.budgetedAmount}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <Input
                                            className="w-24"
                                            value={category.actualAmount}
                                            onChange={(e) => handleUpdateActual(budget.id, category.id, e.target.value)}
                                          />
                                          <div className="w-16 text-xs">
                                            {percentUsed.toFixed(1)}%
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1">
                                          {variance >= 0 ? (
                                            <ArrowDown className="h-4 w-4 text-green-500" />
                                          ) : (
                                            <ArrowUp className="h-4 w-4 text-red-500" />
                                          )}
                                          <span className={variance >= 0 ? "text-green-600" : "text-red-600"}>
                                            {`$${Math.abs(variance).toFixed(2)}`}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => handleEditCategory(budget, category.id)}
                                        >
                                          Edit
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                            
                            <div className="mt-4 p-4 border rounded-lg">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <div className="text-sm text-muted-foreground">Total Budgeted</div>
                                  <div className="text-lg font-bold">{calculatedBudget.totalBudgeted}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">Total Actual</div>
                                  <div className="text-lg font-bold">{calculatedBudget.totalActual}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">Variance</div>
                                  <div className={`text-lg font-bold ${parseFloat(calculatedBudget.variance) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {calculatedBudget.variance} ({calculatedBudget.variancePercent}%)
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-2">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Budget Analysis</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="h-80">
                                  <BarChart 
                                    data={chartData}
                                    xField="name"
                                    yField={["budgeted", "actual"]}
                                    colors={["#94a3b8", "#3b82f6"]}
                                    category="name"
                                  />
                                </div>
                                <div className="flex justify-center gap-8 mt-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                    <span className="text-sm">Budgeted</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm">Actual</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <div className="mt-4">
                              <Button 
                                className="w-full flex items-center justify-center gap-2"
                                variant="outline"
                                onClick={() => toast.info("Generating detailed report...")}
                              >
                                <FileText size={16} />
                                <span>Generate Detailed Report</span>
                                <ArrowRight size={16} />
                              </Button>
                            </div>
                          </div>
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

      {/* Create New Budget Dialog */}
      <Dialog open={newBudgetDialogOpen} onOpenChange={setNewBudgetDialogOpen}>
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
            <Button variant="outline" onClick={() => setNewBudgetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewBudget}>Create Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
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
            <Button variant="outline" onClick={() => setEditCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
