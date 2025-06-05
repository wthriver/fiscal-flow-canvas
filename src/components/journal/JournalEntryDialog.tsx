
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  debits: Array<{ account: string; amount: number }>;
  credits: Array<{ account: string; amount: number }>;
  status: 'Draft' | 'Posted';
}

interface JournalEntryDialogProps {
  onSave: (entry: JournalEntry) => void;
  editEntry?: JournalEntry;
  children: React.ReactNode;
}

export const JournalEntryDialog: React.FC<JournalEntryDialogProps> = ({ onSave, editEntry, children }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: editEntry?.date || new Date().toISOString().split('T')[0],
    description: editEntry?.description || '',
    reference: editEntry?.reference || '',
    debits: editEntry?.debits || [{ account: '', amount: 0 }],
    credits: editEntry?.credits || [{ account: '', amount: 0 }],
    status: editEntry?.status || 'Draft' as 'Draft' | 'Posted'
  });

  const accounts = [
    'Cash', 'Accounts Receivable', 'Inventory', 'Equipment', 'Accounts Payable',
    'Revenue', 'Cost of Goods Sold', 'Rent Expense', 'Utilities Expense', 'Salaries Expense'
  ];

  const addDebitLine = () => {
    setFormData(prev => ({
      ...prev,
      debits: [...prev.debits, { account: '', amount: 0 }]
    }));
  };

  const addCreditLine = () => {
    setFormData(prev => ({
      ...prev,
      credits: [...prev.credits, { account: '', amount: 0 }]
    }));
  };

  const removeDebitLine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      debits: prev.debits.filter((_, i) => i !== index)
    }));
  };

  const removeCreditLine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      credits: prev.credits.filter((_, i) => i !== index)
    }));
  };

  const updateDebit = (index: number, field: 'account' | 'amount', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      debits: prev.debits.map((debit, i) => 
        i === index ? { ...debit, [field]: value } : debit
      )
    }));
  };

  const updateCredit = (index: number, field: 'account' | 'amount', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      credits: prev.credits.map((credit, i) => 
        i === index ? { ...credit, [field]: value } : credit
      )
    }));
  };

  const getTotalDebits = () => formData.debits.reduce((sum, debit) => sum + Number(debit.amount), 0);
  const getTotalCredits = () => formData.credits.reduce((sum, credit) => sum + Number(credit.amount), 0);
  const isBalanced = () => Math.abs(getTotalDebits() - getTotalCredits()) < 0.01;

  const handleSave = () => {
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!isBalanced()) {
      toast.error("Debits and credits must be equal");
      return;
    }

    const entry: JournalEntry = {
      id: editEntry?.id || `JE-${Date.now()}`,
      date: formData.date,
      description: formData.description,
      reference: formData.reference,
      debits: formData.debits.filter(d => d.account && d.amount > 0),
      credits: formData.credits.filter(c => c.account && c.amount > 0),
      status: formData.status
    };

    onSave(entry);
    setOpen(false);
    toast.success(editEntry ? "Journal entry updated" : "Journal entry created");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editEntry ? 'Edit' : 'New'} Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="Invoice #, Bill #, etc."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this transaction..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Debits */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Debits</h4>
                <Button type="button" variant="outline" size="sm" onClick={addDebitLine}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.debits.map((debit, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Select
                      value={debit.account}
                      onValueChange={(value) => updateDebit(index, 'account', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account} value={account}>{account}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      value={debit.amount}
                      onChange={(e) => updateDebit(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-32"
                      placeholder="0.00"
                    />
                    {formData.debits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDebitLine(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="text-right font-semibold">
                  Total: ${getTotalDebits().toFixed(2)}
                </div>
              </div>
            </div>

            {/* Credits */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Credits</h4>
                <Button type="button" variant="outline" size="sm" onClick={addCreditLine}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.credits.map((credit, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Select
                      value={credit.account}
                      onValueChange={(value) => updateCredit(index, 'account', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account} value={account}>{account}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      value={credit.amount}
                      onChange={(e) => updateCredit(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-32"
                      placeholder="0.00"
                    />
                    {formData.credits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCreditLine(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="text-right font-semibold">
                  Total: ${getTotalCredits().toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-sm ${isBalanced() ? 'text-green-600' : 'text-red-600'}`}>
                {isBalanced() ? '✓ Balanced' : '⚠ Out of balance'}
              </span>
              <Select
                value={formData.status}
                onValueChange={(value: 'Draft' | 'Posted') => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Posted">Posted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!isBalanced()}>
                {editEntry ? 'Update' : 'Save'} Entry
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
