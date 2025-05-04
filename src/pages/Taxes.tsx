
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TaxCalculator } from "@/components/taxes/TaxCalculator";

const Taxes: React.FC = () => {
  const [taxYear, setTaxYear] = useState("2023");
  const [income, setIncome] = useState("50000");
  const [filingStatus, setFilingStatus] = useState("single");
  const [taxLiability, setTaxLiability] = useState<number | null>(null);

  const calculateTaxes = () => {
    // Basic tax calculation logic (simplified)
    let taxRate = 0.25; // Default tax rate
    if (filingStatus === "married") {
      taxRate = 0.15;
    }

    const calculatedTax = parseFloat(income) * taxRate;
    setTaxLiability(calculatedTax);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tax Calculator</CardTitle>
          <CardDescription>Estimate your tax liability.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="tax-year" className="text-right">
              Tax Year
            </label>
            <Input id="tax-year" value={taxYear} onChange={(e) => setTaxYear(e.target.value)} className="col-span-2" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="income" className="text-right">
              Income
            </label>
            <Input id="income" value={income} onChange={(e) => setIncome(e.target.value)} className="col-span-2" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="filing-status" className="text-right">
              Filing Status
            </label>
            <select id="filing-status" value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="col-span-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset</Button>
          <Button onClick={calculateTaxes}>Calculate</Button>
        </CardFooter>
      </Card>

      {taxLiability !== null && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Tax Liability</CardTitle>
            <CardDescription>Estimated tax for {taxYear}.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              ${taxLiability.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      )}
      
      <TaxCalculator />
    </div>
  );
};

export default Taxes;
