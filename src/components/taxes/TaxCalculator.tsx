
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCompany } from "@/contexts/CompanyContext";

export const TaxCalculator: React.FC = () => {
  const { currentCompany } = useCompany();
  const [amount, setAmount] = useState<string>("0");
  const [selectedTaxRate, setSelectedTaxRate] = useState<string>("");
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const calculateTax = (amount: number, taxRateId: string) => {
    const taxRate = currentCompany.taxRates.find(rate => rate.id === taxRateId);
    if (!taxRate) return 0;
    
    return (amount * taxRate.rate) / 100;
  };

  const handleCalculate = () => {
    if (!selectedTaxRate) {
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return;
    }

    const tax = calculateTax(numericAmount, selectedTaxRate);
    setCalculatedTax(tax);
    setTotal(numericAmount + tax);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tax Calculator</CardTitle>
        <CardDescription>Calculate taxes for any amount</CardDescription>
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
            <select
              id="tax-rate"
              className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={selectedTaxRate}
              onChange={(e) => setSelectedTaxRate(e.target.value)}
            >
              <option value="">Select Tax Rate</option>
              {currentCompany.taxRates.map((rate) => (
                <option key={rate.id} value={rate.id}>
                  {rate.name} ({rate.rate}%)
                </option>
              ))}
            </select>
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
                Tax ({currentCompany.taxRates.find(rate => rate.id === selectedTaxRate)?.rate}%):
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
    </Card>
  );
};
