
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Budget, BudgetCategory } from "@/types/company";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

interface BudgetTableProps {
  budget: Budget;
  handleUpdateActual: (budgetId: string, categoryId: string, actual: number) => void;
  handleEditCategory: (budget: Budget, categoryId: string) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({
  budget,
  handleUpdateActual,
  handleEditCategory,
}) => {
  return (
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
          const budgeted = category.budgeted;
          const actual = category.actual;
          const variance = budgeted - actual;
          const percentUsed = budgeted > 0 ? (actual / budgeted) * 100 : 0;
          
          return (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>${budgeted.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-24"
                    value={actual}
                    type="number"
                    onChange={(e) => handleUpdateActual(
                      budget.id, 
                      category.id, 
                      parseFloat(e.target.value)
                    )}
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
                    ${Math.abs(variance).toFixed(2)}
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
  );
};
