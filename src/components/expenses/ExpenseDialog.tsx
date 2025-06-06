
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Expense } from "@/types/company";

interface ExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export const ExpenseDialog: React.FC<ExpenseDialogProps> = ({ 
  isOpen, 
  onClose, 
  expense 
}) => {
  const { addExpense, updateExpense } = useCompany();
  const [formData, setFormData] = useState({
    date: expense?.date || new Date().toISOString().split('T')[0],
    vendor: expense?.vendor || "",
    category: expense?.category || "",
    amount: expense ? (typeof expense.amount === 'string' ? expense.amount.replace(/[^0-9.-]+/g, "") : expense.amount.toString()) : "",
    description: expense?.description || "",
    status: expense?.status || "Pending",
    paymentMethod: expense?.paymentMethod || "",
    billNumber: expense?.billNumber || "",
    dueDate: expense?.dueDate || ""
  });

  const handleSave = () => {
    if (!formData.vendor || !formData.amount || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const expenseData: Expense = {
      id: expense?.id || `exp-${Date.now()}`,
      date: formData.date,
      vendor: formData.vendor,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      status: formData.status,
      paymentMethod: formData.paymentMethod,
      billNumber: formData.billNumber,
      dueDate: formData.dueDate
    };

    if (expense) {
      updateExpense(expenseData);
      toast.success("Expense updated successfully!");
    } else {
      addExpense(expenseData);
      toast.success("Expense added successfully!");
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {expense ? 'Update expense details' : 'Record a new business expense'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Date*</label>
            <Input
              type="date"
              className="col-span-3"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Vendor*</label>
            <Input
              className="col-span-3"
              value={formData.vendor}
              onChange={(e) => setFormData({...formData, vendor: e.target.value})}
              placeholder="Vendor name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Category*</label>
            <Select onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.category || "Select category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Meals">Meals</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Amount*</label>
            <Input
              type="number"
              step="0.01"
              className="col-span-3"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Status</label>
            <Select onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.status || "Select status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right">Description*</label>
            <Textarea
              className="col-span-3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Expense description"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {expense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
