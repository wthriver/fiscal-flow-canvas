
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Target, Calendar, PieChart } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useBudget } from "./hooks/useBudget";
import { NewBudgetDialog } from "./components/NewBudgetDialog";
import { EditCategoryDialog } from "./components/EditCategoryDialog";
import { BudgetTable } from "./components/BudgetTable";

export const BudgetingDashboard: React.FC = () => {
  const { currentCompany } = useCompany();
  const {
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
    handleCreateBudget,
    handleSaveNewBudget,
    handleAddCategory,
    handleRemoveCategory,
    handleUpdateActual,
    handleEditCategory,
    handleUpdateCategory,
    formatCurrency
  } = useBudget();
  
  const budgets = currentCompany.budgets || [];
  
  const getStatusColor = (budget: any) => {
    const percentUsed = budget.categories ? 
      (budget.categories.reduce((sum: number, cat: any) => sum + (cat.actual || 0), 0) / 
       budget.categories.reduce((sum: number, cat: any) => sum + (cat.budgeted || 0), 0)) * 100 : 0;
    
    if (percentUsed > 90) return 'bg-red-100 text-red-800';
    if (percentUsed > 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const totalBudgeted = budgets.reduce((sum, budget) => {
    return sum + (budget.categories?.reduce((catSum: number, cat: any) => catSum + (cat.budgeted || 0), 0) || 0);
  }, 0);

  const totalActual = budgets.reduce((sum, budget) => {
    return sum + (budget.categories?.reduce((catSum: number, cat: any) => catSum + (cat.actual || 0), 0) || 0);
  }, 0);

  const totalVariance = totalBudgeted - totalActual;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">Monitor and control your financial planning</p>
        </div>
        <Button onClick={handleCreateBudget}>
          <Target className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all budgets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalActual.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Spent so far</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            {totalVariance >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getVarianceColor(totalVariance)}`}>
              ${Math.abs(totalVariance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalVariance >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets.filter(b => b.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Currently tracking</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Budget Overview</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="management">Budget Management</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {budgets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Budget Name</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Budgeted</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgets.map((budget) => {
                      const budgeted = budget.categories?.reduce((sum: number, cat: any) => sum + (cat.budgeted || 0), 0) || 0;
                      const actual = budget.categories?.reduce((sum: number, cat: any) => sum + (cat.actual || 0), 0) || 0;
                      const variance = budgeted - actual;
                      const progress = budgeted > 0 ? (actual / budgeted) * 100 : 0;

                      return (
                        <TableRow key={budget.id}>
                          <TableCell className="font-medium">{budget.name}</TableCell>
                          <TableCell>{budget.period}</TableCell>
                          <TableCell>${budgeted.toLocaleString()}</TableCell>
                          <TableCell>${actual.toLocaleString()}</TableCell>
                          <TableCell className={getVarianceColor(variance)}>
                            ${Math.abs(variance).toLocaleString()}
                            {variance >= 0 ? ' under' : ' over'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={Math.min(progress, 100)} className="w-16" />
                              <span className="text-sm">{Math.round(progress)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(budget)}>
                              {budget.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8">
                  <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No budgets created yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first budget to start tracking your financial goals</p>
                  <Button onClick={handleCreateBudget}>
                    <Target className="h-4 w-4 mr-2" />
                    Create Your First Budget
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          {budgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{budget.name}</CardTitle>
                  <Badge variant={budget.status === 'Active' ? 'default' : 'secondary'}>
                    {budget.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <BudgetTable
                  budget={budget}
                  handleUpdateActual={handleUpdateActual}
                  handleEditCategory={handleEditCategory}
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {budgets.length > 0 && budgets.some(b => b.categories && b.categories.length > 0) ? (
                <div className="space-y-6">
                  {budgets.map((budget) => (
                    budget.categories && budget.categories.length > 0 && (
                      <div key={budget.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-4">{budget.name}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Budgeted</TableHead>
                              <TableHead>Actual</TableHead>
                              <TableHead>Progress</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {budget.categories.map((category: any) => (
                              <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>
                                  <Badge variant={category.type === 'income' ? 'default' : 'secondary'}>
                                    {category.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>${(category.budgeted || 0).toLocaleString()}</TableCell>
                                <TableCell>${(category.actual || 0).toLocaleString()}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Progress 
                                      value={category.budgeted > 0 ? Math.min((category.actual / category.budgeted) * 100, 100) : 0} 
                                      className="w-16" 
                                    />
                                    <span className="text-sm">
                                      {category.budgeted > 0 ? Math.round((category.actual / category.budgeted) * 100) : 0}%
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No budget categories found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Income vs Expenses</h4>
                    <div className="space-y-2">
                      {budgets.map((budget) => {
                        const income = budget.categories?.filter((c: any) => c.type === 'income').reduce((sum: number, c: any) => sum + (c.actual || 0), 0) || 0;
                        const expenses = budget.categories?.filter((c: any) => c.type === 'expense').reduce((sum: number, c: any) => sum + (c.actual || 0), 0) || 0;
                        return (
                          <div key={budget.id} className="flex justify-between">
                            <span className="text-sm">{budget.name}</span>
                            <span className={`text-sm font-medium ${income > expenses ? 'text-green-600' : 'text-red-600'}`}>
                              ${(income - expenses).toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Budget Utilization</h4>
                    <div className="space-y-2">
                      {budgets.map((budget) => {
                        const budgeted = budget.categories?.reduce((sum: number, cat: any) => sum + (cat.budgeted || 0), 0) || 0;
                        const actual = budget.categories?.reduce((sum: number, cat: any) => sum + (cat.actual || 0), 0) || 0;
                        const utilization = budgeted > 0 ? (actual / budgeted) * 100 : 0;
                        return (
                          <div key={budget.id} className="flex justify-between items-center">
                            <span className="text-sm">{budget.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={Math.min(utilization, 100)} className="w-12" />
                              <span className="text-sm">{Math.round(utilization)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
