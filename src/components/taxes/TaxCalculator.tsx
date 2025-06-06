import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { TaxRate } from "@/types/company";

export const TaxCalculator = () => {
  const { currentCompany, addTaxRate, updateTaxRate, deleteTaxRate } = useCompany();
  const [taxRates, setTaxRates] = useState<TaxRate[]>(currentCompany.taxRates || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTaxRate, setCurrentTaxRate] = useState<TaxRate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rate: 0,
    description: "",
    category: "Sales Tax",
  });

  // Update taxRates when currentCompany changes
  useEffect(() => {
    setTaxRates(currentCompany.taxRates || []);
  }, [currentCompany]);

  const taxCategories = [
    "Sales Tax",
    "Income Tax",
    "Property Tax",
    "Value Added Tax",
    "Other",
  ];

  const handleOpenDialog = (taxRate?: TaxRate) => {
    if (taxRate) {
      setCurrentTaxRate(taxRate);
      setFormData({
        name: taxRate.name,
        rate: taxRate.rate,
        description: taxRate.description || "",
        category: taxRate.category || "Sales Tax",
      });
    } else {
      setCurrentTaxRate(null);
      setFormData({
        name: "",
        rate: 0,
        description: "",
        category: "Sales Tax",
      });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (currentTaxRate) {
      // Update existing tax rate
      const updatedTaxRate = {
        ...currentTaxRate,
        ...formData,
        isDefault: currentTaxRate.isDefault || false
      };
      updateTaxRate(updatedTaxRate);
      setTaxRates(taxRates.map(tr => tr.id === currentTaxRate.id ? updatedTaxRate : tr));
    } else {
      // Add new tax rate
      const newTaxRate: TaxRate = {
        id: `tax-${Date.now()}`,
        name: formData.name,
        rate: formData.rate,
        isDefault: false,
        description: formData.description,
        category: formData.category
      };
      addTaxRate(newTaxRate);
      setTaxRates([...taxRates, newTaxRate]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTaxRate(id);
    setTaxRates(taxRates.filter(tr => tr.id !== id));
  };

  const calculateTax = (amount: number, rate: number) => {
    return (amount * rate / 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tax Rates</CardTitle>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <Plus className="mr-1 h-4 w-4" /> Add Tax Rate
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxRates && taxRates.length > 0 ? (
                taxRates.map((taxRate) => (
                  <TableRow key={taxRate.id}>
                    <TableCell>{taxRate.name}</TableCell>
                    <TableCell>{taxRate.rate}%</TableCell>
                    <TableCell>{taxRate.category || 'N/A'}</TableCell>
                    <TableCell>{taxRate.description || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(taxRate)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(taxRate.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No tax rates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="tax-rate">Tax Rate</Label>
                <Select>
                  <SelectTrigger id="tax-rate">
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxRates && taxRates.map((taxRate) => (
                      <SelectItem key={taxRate.id} value={taxRate.id}>
                        {taxRate.name} ({taxRate.rate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full">Calculate Tax</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentTaxRate ? "Edit Tax Rate" : "Add New Tax Rate"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Tax Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., GST"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rate">Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={(e) => handleChange("rate", parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 7.5"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{currentTaxRate ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
