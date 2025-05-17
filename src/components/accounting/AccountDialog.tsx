
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  subtype: string;
  balance: number;
}

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onSave: (account: Account) => void;
}

export function AccountDialog({ open, onOpenChange, account, onSave }: AccountDialogProps) {
  const [formData, setFormData] = useState<Account>({
    id: '',
    code: '',
    name: '',
    type: 'Asset',
    subtype: 'Current Asset',
    balance: 0
  });

  // Reset form data when dialog opens
  useEffect(() => {
    if (account) {
      setFormData(account);
    } else {
      setFormData({
        id: '',
        code: '',
        name: '',
        type: 'Asset',
        subtype: 'Current Asset',
        balance: 0
      });
    }
  }, [account, open]);

  const handleChange = (field: keyof Account, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || `account-${Date.now()}`
    });
  };

  const getSubtypeOptions = (type: string) => {
    switch (type) {
      case 'Asset':
        return ['Current Asset', 'Fixed Asset', 'Intangible Asset', 'Other Asset'];
      case 'Liability':
        return ['Current Liability', 'Long-term Liability', 'Other Liability'];
      case 'Equity':
        return ['Equity', 'Retained Earnings', 'Owner Investment', 'Owner Drawing'];
      case 'Revenue':
        return ['Income', 'Other Income'];
      case 'Expense':
        return ['Cost of Sales', 'Operating Expense', 'Other Expense'];
      default:
        return [''];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{account ? 'Edit Account' : 'Add Account'}</DialogTitle>
            <DialogDescription>
              {account ? 'Update the account details below.' : 'Enter the account details below.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Account Code
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Account Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => {
                  handleChange('type', value);
                  handleChange('subtype', getSubtypeOptions(value)[0]);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asset">Asset</SelectItem>
                  <SelectItem value="Liability">Liability</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subtype" className="text-right">
                Subtype
              </Label>
              <Select
                value={formData.subtype}
                onValueChange={(value) => handleChange('subtype', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent>
                  {getSubtypeOptions(formData.type).map((subtype) => (
                    <SelectItem key={subtype} value={subtype}>
                      {subtype}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance
              </Label>
              <div className="relative col-span-3">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="balance"
                  type="number"
                  value={formData.balance}
                  onChange={(e) => handleChange('balance', parseFloat(e.target.value) || 0)}
                  className="pl-7"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{account ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
