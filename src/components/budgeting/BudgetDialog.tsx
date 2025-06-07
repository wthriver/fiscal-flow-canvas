
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Budget, BudgetCategory } from "@/types/company";

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

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const budgetData: Budget = {
      id: budget?.id || `budget-${Date.now()}`,
      name: formData.name,
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      categories: budget?.categories || [
        {
          id: `cat-${Date.now()}-1`,
          name: "Revenue",
          type: "income",
          budgeted: 0,
          actual: 0
        },
        {
          id: `cat-${Date.now()}-2`,
          name: "Operating Expenses",
          type: "expense",
          budgeted: 0,
          actual: 0
        }
      ]
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
          <DialogDescription>
            {budget ? 'Update budget details' : 'Set up a new budget plan'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Name*</label>
            <Input
              className="col-span-3"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Budget name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Period</label>
            <Select onValueChange={(value) => setFormData({...formData, period: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.period || "Select period"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Start Date*</label>
            <Input
              type="date"
              className="col-span-3"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">End Date*</label>
            <Input
              type="date"
              className="col-span-3"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Status</label>
            <Select onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.status || "Select status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
