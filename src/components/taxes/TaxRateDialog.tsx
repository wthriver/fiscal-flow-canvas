
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { TaxRate } from "@/types/company";

interface TaxRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxRate: TaxRate | null;
  onSave: () => void;
}

export const TaxRateDialog: React.FC<TaxRateDialogProps> = ({
  open,
  onOpenChange,
  taxRate,
  onSave,
}) => {
  const { currentCompany, updateCompany } = useCompany();
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (taxRate) {
      setName(taxRate.name);
      setRate(taxRate.rate.toString());
      setDescription(taxRate.description || "");
      setJurisdiction(taxRate.jurisdiction || "");
      setEffectiveDate(taxRate.effectiveDate || "");
      setIsDefault(taxRate.isDefault || false);
    } else {
      // Reset form for new tax rate
      setName("");
      setRate("");
      setDescription("");
      setJurisdiction("");
      setEffectiveDate("");
      setIsDefault(false);
    }
  }, [taxRate, open]);

  const handleSave = () => {
    if (!name || !rate) {
      toast.error("Please fill in the required fields");
      return;
    }

    const rateNumber = parseFloat(rate);
    if (isNaN(rateNumber) || rateNumber < 0) {
      toast.error("Please enter a valid tax rate");
      return;
    }

    const newTaxRate: TaxRate = {
      id: taxRate?.id || `tax-${Date.now()}`,
      name,
      rate: rateNumber,
      description,
      jurisdiction,
      effectiveDate,
      isDefault,
    };

    const existingTaxRates = currentCompany.taxRates || [];
    let updatedTaxRates;

    if (taxRate) {
      // Update existing tax rate
      updatedTaxRates = existingTaxRates.map(t => 
        t.id === taxRate.id ? newTaxRate : t
      );
    } else {
      // Add new tax rate
      updatedTaxRates = [...existingTaxRates, newTaxRate];
    }

    // If this is set as default, remove default from others
    if (isDefault) {
      updatedTaxRates = updatedTaxRates.map(t => 
        t.id === newTaxRate.id ? t : { ...t, isDefault: false }
      );
    }

    updateCompany({
      ...currentCompany,
      taxRates: updatedTaxRates,
    });

    toast.success(taxRate ? "Tax rate updated successfully" : "Tax rate created successfully");
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{taxRate ? "Edit Tax Rate" : "Add Tax Rate"}</DialogTitle>
          <DialogDescription>
            {taxRate ? "Update the tax rate information" : "Create a new tax rate for your company"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tax-name">Name *</Label>
            <Input
              id="tax-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sales Tax, VAT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-rate">Rate (%) *</Label>
            <Input
              id="tax-rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g., 8.25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-description">Description</Label>
            <Textarea
              id="tax-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this tax rate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-jurisdiction">Jurisdiction</Label>
            <Input
              id="tax-jurisdiction"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="e.g., California, New York City"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-effective-date">Effective Date</Label>
            <Input
              id="tax-effective-date"
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="tax-default"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked as boolean)}
            />
            <Label htmlFor="tax-default">Set as default tax rate</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {taxRate ? "Update" : "Create"} Tax Rate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
