
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Transaction } from "@/types/company";
import { safeStringReplace } from "@/utils/typeHelpers";

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  bankAccountId: string;
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({ 
  isOpen, 
  onClose, 
  transaction,
  bankAccountId 
}) => {
  const { addTransaction, updateTransaction } = useCompany();
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || "",
    amount: safeStringReplace(transaction?.amount || "", /[^0-9.-]+/g, ""),
    category: transaction?.category || "",
    type: transaction?.type || "Deposit" as "Deposit" | "Withdrawal" | "Credit" | "Debit",
    reference: transaction?.reference || "",
    memo: transaction?.memo || ""
  });

  const handleSave = () => {
    if (!formData.description || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    const formattedAmount = formData.type === "Deposit" || formData.type === "Credit" 
      ? `+$${amount.toFixed(2)}` 
      : `-$${amount.toFixed(2)}`;

    const transactionData: Transaction = {
      id: transaction?.id || `txn-${Date.now()}`,
      date: formData.date,
      description: formData.description,
      amount: formattedAmount,
      category: formData.category,
      account: bankAccountId,
      reconciled: transaction?.reconciled || false,
      type: formData.type,
      reference: formData.reference,
      memo: formData.memo
    };

    if (transaction) {
      updateTransaction(transaction.id, transactionData);
      toast.success("Transaction updated successfully!");
    } else {
      addTransaction(transactionData);
      toast.success("Transaction added successfully!");
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          <DialogDescription>
            {transaction ? 'Update transaction details' : 'Add a new transaction to your account'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="date" className="text-right">Date*</label>
            <Input
              id="date"
              type="date"
              className="col-span-3"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right">Description*</label>
            <Input
              id="description"
              className="col-span-3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Transaction description"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="type" className="text-right">Type*</label>
            <Select onValueChange={(value) => setFormData({...formData, type: value as any})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={formData.type || "Select type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deposit">Deposit</SelectItem>
                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="Debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="amount" className="text-right">Amount*</label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              className="col-span-3"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="category" className="text-right">Category</label>
            <Input
              id="category"
              className="col-span-3"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="Transaction category"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="reference" className="text-right">Reference</label>
            <Input
              id="reference"
              className="col-span-3"
              value={formData.reference}
              onChange={(e) => setFormData({...formData, reference: e.target.value})}
              placeholder="Reference number"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {transaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
