
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";
import { format } from "date-fns";
import { expenseCategories } from "@/utils/expenseCategories";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { currentCompany, addTransaction } = useCompany();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = useState("");
  const [account, setAccount] = useState(currentCompany.accounts[0]?.name || "");
  const [category, setCategory] = useState(expenseCategories[0] || "");
  const [amount, setAmount] = useState("");
  const [isIncome, setIsIncome] = useState(false);

  const handleAddTransaction = () => {
    if (!description || !amount || !account || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const formattedAmount = isIncome ? `+$${amountValue.toFixed(2)}` : `-$${amountValue.toFixed(2)}`;

    const newTransaction = {
      id: `tx${Date.now().toString().slice(-6)}`,
      date,
      description,
      account,
      category,
      amount: formattedAmount,
      reconciled: false
    };

    addTransaction(newTransaction);
    toast.success("Transaction added successfully");
    
    // Reset form
    setDescription("");
    setAmount("");
    setIsIncome(false);
    setCategory(expenseCategories[0] || "");
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of the new transaction for {currentCompany.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction-date">Date</Label>
              <Input
                id="transaction-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction-account">Account</Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger id="transaction-account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {currentCompany.accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.name}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-description">Description</Label>
            <Input
              id="transaction-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="transaction-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select value={isIncome ? "income" : "expense"} onValueChange={(value) => setIsIncome(value === "income")}>
                <SelectTrigger id="transaction-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-amount">Amount</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground">
                $
              </span>
              <Input
                id="transaction-amount"
                type="number"
                min="0.01"
                step="0.01"
                className="rounded-l-none"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddTransaction}>Add Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
