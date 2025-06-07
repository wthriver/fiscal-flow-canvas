
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { TaxRate } from "@/types/company";

interface TaxRateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taxRate?: TaxRate | null;
}

export const TaxRateDialog: React.FC<TaxRateDialogProps> = ({ 
  isOpen, 
  onClose, 
  taxRate 
}) => {
  const { addTaxRate, updateTaxRate } = useCompany();
  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    description: "",
    category: "",
    jurisdiction: "",
    effectiveDate: new Date().toISOString().split('T')[0],
    isDefault: false
  });

  useEffect(() => {
    if (taxRate && isOpen) {
      setFormData({
        name: taxRate.name || "",
        rate: taxRate.rate?.toString() || "",
        description: taxRate.description || "",
        category: taxRate.category || "",
        jurisdiction: taxRate.jurisdiction || "",
        effectiveDate: taxRate.effectiveDate || new Date().toISOString().split('T')[0],
        isDefault: taxRate.isDefault || false
      });
    } else if (!taxRate && isOpen) {
      setFormData({
        name: "",
        rate: "",
        description: "",
        category: "",
        jurisdiction: "",
        effectiveDate: new Date().toISOString().split('T')[0],
        isDefault: false
      });
    }
  }, [taxRate, isOpen]);

  const handleSave = () => {
    if (!formData.name || !formData.rate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const rateValue = parseFloat(formData.rate);
    if (isNaN(rateValue) || rateValue < 0) {
      toast.error("Please enter a valid tax rate");
      return;
    }

    const taxRateData: TaxRate = {
      id: taxRate?.id || `tax-${Date.now()}`,
      name: formData.name,
      rate: rateValue,
      description: formData.description,
      category: formData.category,
      jurisdiction: formData.jurisdiction,
      effectiveDate: formData.effectiveDate,
      isDefault: formData.isDefault
    };

    if (taxRate) {
      updateTaxRate(taxRateData);
      toast.success("Tax rate updated successfully!");
    } else {
      addTaxRate(taxRateData);
      toast.success("Tax rate added successfully!");
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{taxRate ? 'Edit Tax Rate' : 'Add New Tax Rate'}</DialogTitle>
          <DialogDescription>
            {taxRate ? 'Update tax rate details' : 'Configure a new tax rate for your business'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Name*</label>
            <Input
              className="col-span-3"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Tax rate name (e.g., Sales Tax, VAT)"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Rate (%)*</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              className="col-span-3"
              value={formData.rate}
              onChange={(e) => setFormData({...formData, rate: e.target.value})}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Category</label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                <SelectItem value="VAT">VAT (Value Added Tax)</SelectItem>
                <SelectItem value="Income Tax">Income Tax</SelectItem>
                <SelectItem value="Property Tax">Property Tax</SelectItem>
                <SelectItem value="Excise Tax">Excise Tax</SelectItem>
                <SelectItem value="Use Tax">Use Tax</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Jurisdiction</label>
            <Input
              className="col-span-3"
              value={formData.jurisdiction}
              onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
              placeholder="Federal, State, County, City"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Effective Date</label>
            <Input
              type="date"
              className="col-span-3"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium">Description</label>
            <Textarea
              className="col-span-3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description of when this tax rate applies"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Default Rate</label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({...formData, isDefault: checked as boolean})}
              />
              <label htmlFor="isDefault" className="text-sm">
                Use as default tax rate for new transactions
              </label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {taxRate ? 'Update Rate' : 'Add Rate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
