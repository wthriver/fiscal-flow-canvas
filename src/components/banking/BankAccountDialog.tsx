import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BankAccount } from "@/types/company";

interface BankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (accountData: BankAccount) => void;
  account?: BankAccount | null;
}

export const BankAccountDialog: React.FC<BankAccountDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  account,
}) => {
  const [formData, setFormData] = useState({
    name: account?.name || "",
    bankName: account?.bankName || "",
    accountNumber: account?.accountNumber || "",
    routingNumber: account?.routingNumber || "",
    type: account?.type || "Checking",
    balance: account?.balance ? String(account.balance).replace(/[$,]/g, '') : "0",
    isActive: account?.isActive ?? true
  });

  const resetForm = () => {
    setFormData({
      name: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      type: "Checking",
      balance: "0",
      isActive: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.bankName || !formData.accountNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const accountData: BankAccount = {
      id: account?.id || `bank-${Date.now()}`,
      name: formData.name,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      routingNumber: formData.routingNumber,
      type: formData.type as "Checking" | "Savings" | "Credit" | "Investment",
      balance: parseFloat(formData.balance) || 0,
      isActive: formData.isActive,
      openingDate: account?.openingDate || new Date().toISOString().split('T')[0],
      transactions: account?.transactions || []
    };

    onSubmit(accountData);
    toast.success(account ? "Bank account updated successfully" : "Bank account created successfully");
    resetForm();
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{account ? "Edit Bank Account" : "Add New Bank Account"}</DialogTitle>
          <DialogDescription>
            {account ? "Update bank account details" : "Connect a new bank account to your business"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name*</Label>
                <Input
                  id="account-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Business Checking"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name*</Label>
                <Input
                  id="bank-name"
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  placeholder="Chase Bank"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number*</Label>
                <Input
                  id="account-number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input
                  id="routing-number"
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
                  placeholder="021000021"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger id="account-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Checking">Checking</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    className="rounded-l-none"
                    value={formData.balance}
                    onChange={(e) => setFormData({...formData, balance: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.isActive ? "active" : "inactive"} 
                onValueChange={(value) => setFormData({...formData, isActive: value === "active"})}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {account ? "Update Account" : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};