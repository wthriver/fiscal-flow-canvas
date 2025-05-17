
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompany } from "@/contexts/CompanyContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
}

export const TaxCalculator: React.FC = () => {
  const { currentCompany, addTaxRate, updateTaxRate, deleteTaxRate } = useCompany();
  const [amount, setAmount] = useState<string>("0");
  const [selectedTaxRate, setSelectedTaxRate] = useState<string>("");
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  // Tax rate management
  const [taxRateDialogOpen, setTaxRateDialogOpen] = useState(false);
  const [currentTaxRate, setCurrentTaxRate] = useState<TaxRate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taxRateToDelete, setTaxRateToDelete] = useState<TaxRate | null>(null);

  // Make sure taxRates exists with a default value
  const taxRates = currentCompany.taxRates || [];

  const calculateTax = (amount: number, taxRateId: string) => {
    const taxRate = taxRates.find(rate => rate.id === taxRateId);
    if (!taxRate) return 0;
    
    return (amount * taxRate.rate) / 100;
  };

  const handleCalculate = () => {
    if (!selectedTaxRate) {
      toast.error("Please select a tax rate");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    const tax = calculateTax(numericAmount, selectedTaxRate);
    setCalculatedTax(tax);
    setTotal(numericAmount + tax);
  };

  const handleAddTaxRate = () => {
    setCurrentTaxRate(null);
    setTaxRateDialogOpen(true);
  };

  const handleEditTaxRate = (taxRate: TaxRate) => {
    setCurrentTaxRate(taxRate);
    setTaxRateDialogOpen(true);
  };

  const handleDeleteTaxRate = (taxRate: TaxRate) => {
    setTaxRateToDelete(taxRate);
    setDeleteDialogOpen(true);
  };

  const handleSaveTaxRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTaxRate) return;

    if (currentTaxRate.id) {
      // Update existing tax rate
      updateTaxRate(currentTaxRate.id, currentTaxRate);
      toast.success(`Tax rate "${currentTaxRate.name}" updated successfully`);
    } else {
      // Add new tax rate
      const newTaxRate = {
        ...currentTaxRate,
        id: `tax-${Date.now()}`
      };
      addTaxRate(newTaxRate);
      toast.success(`Tax rate "${newTaxRate.name}" created successfully`);
    }
    setTaxRateDialogOpen(false);
  };

  const confirmDeleteTaxRate = () => {
    if (taxRateToDelete) {
      deleteTaxRate(taxRateToDelete.id);
      toast.success(`Tax rate "${taxRateToDelete.name}" deleted successfully`);
      // If the deleted tax rate was selected, reset the selection
      if (selectedTaxRate === taxRateToDelete.id) {
        setSelectedTaxRate("");
        setCalculatedTax(null);
        setTotal(null);
      }
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Tax Calculator</CardTitle>
            <CardDescription>Calculate taxes for any amount</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddTaxRate}>
            <Plus className="h-4 w-4 mr-1" /> Add Tax Rate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="amount" className="text-right text-sm">
            Amount
          </label>
          <div className="col-span-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="tax-rate" className="text-right text-sm">
            Tax Rate
          </label>
          <div className="col-span-3">
            <div className="flex gap-2">
              <select
                id="tax-rate"
                className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={selectedTaxRate}
                onChange={(e) => setSelectedTaxRate(e.target.value)}
              >
                <option value="">Select Tax Rate</option>
                {taxRates.map((rate) => (
                  <option key={rate.id} value={rate.id}>
                    {rate.name} ({rate.rate}%)
                  </option>
                ))}
              </select>
              {selectedTaxRate && (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-9 h-9 p-0"
                    onClick={() => {
                      const taxRate = taxRates.find(rate => rate.id === selectedTaxRate);
                      if (taxRate) handleEditTaxRate(taxRate);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-9 h-9 p-0"
                    onClick={() => {
                      const taxRate = taxRates.find(rate => rate.id === selectedTaxRate);
                      if (taxRate) handleDeleteTaxRate(taxRate);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">Calculate</Button>

        {calculatedTax !== null && total !== null && (
          <div className="border rounded-md p-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">
                Tax ({taxRates.find(rate => rate.id === selectedTaxRate)?.rate || 0}%):
              </span>
              <span>${calculatedTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        This is for estimation purposes only. Actual taxes may vary.
      </CardFooter>

      {/* Tax Rate Dialog */}
      <Dialog open={taxRateDialogOpen} onOpenChange={setTaxRateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSaveTaxRate}>
            <DialogHeader>
              <DialogTitle>{currentTaxRate?.id ? 'Edit Tax Rate' : 'Add Tax Rate'}</DialogTitle>
              <DialogDescription>
                {currentTaxRate?.id ? 'Update the tax rate details below.' : 'Enter the tax rate details below.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={currentTaxRate?.name || ''}
                  onChange={(e) => setCurrentTaxRate(prev => prev ? { ...prev, name: e.target.value } : { name: e.target.value, rate: 0, id: '' })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rate" className="text-right">
                  Rate (%)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentTaxRate?.rate || ''}
                  onChange={(e) => setCurrentTaxRate(prev => prev ? { ...prev, rate: parseFloat(e.target.value) || 0 } : { name: '', rate: parseFloat(e.target.value) || 0, id: '' })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={currentTaxRate?.description || ''}
                  onChange={(e) => setCurrentTaxRate(prev => prev ? { ...prev, description: e.target.value } : { name: '', rate: 0, description: e.target.value, id: '' })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentTaxRate?.id ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tax Rate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tax rate "{taxRateToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTaxRate} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
