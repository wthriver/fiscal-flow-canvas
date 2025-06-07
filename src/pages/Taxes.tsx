
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaxRateDialog } from "@/components/taxes/TaxRateDialog";
import { useCompany } from "@/contexts/CompanyContext";
import { Plus, Edit, Trash2, Calculator, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Taxes: React.FC = () => {
  const { currentCompany, deleteTaxRate } = useCompany();
  const [isTaxRateDialogOpen, setIsTaxRateDialogOpen] = useState(false);
  const [selectedTaxRate, setSelectedTaxRate] = useState(null);
  
  // Tax Calculator State
  const [calculatorAmount, setCalculatorAmount] = useState("");
  const [selectedTaxRateId, setSelectedTaxRateId] = useState("");
  const [calculatedTax, setCalculatedTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleEditTaxRate = (taxRate: any) => {
    setSelectedTaxRate(taxRate);
    setIsTaxRateDialogOpen(true);
  };

  const handleDeleteTaxRate = (taxRateId: string) => {
    if (confirm("Are you sure you want to delete this tax rate?")) {
      deleteTaxRate(taxRateId);
      toast.success("Tax rate deleted successfully!");
    }
  };

  const calculateTax = () => {
    const amount = parseFloat(calculatorAmount) || 0;
    const taxRate = currentCompany.taxRates?.find(rate => rate.id === selectedTaxRateId);
    
    if (!taxRate) {
      toast.error("Please select a tax rate");
      return;
    }

    const tax = (amount * taxRate.rate) / 100;
    const total = amount + tax;
    
    setCalculatedTax(tax);
    setTotalAmount(total);
    
    toast.success("Tax calculated successfully!");
  };

  // Calculate tax summary from existing data
  const calculateTaxSummary = () => {
    const totalInvoices = currentCompany.invoices?.length || 0;
    const totalInvoiceAmount = currentCompany.invoices?.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.amount?.replace(/[^0-9.-]+/g, "") || "0");
    }, 0) || 0;

    const defaultTaxRate = currentCompany.taxRates?.find(rate => rate.isDefault);
    const estimatedTaxes = defaultTaxRate ? (totalInvoiceAmount * defaultTaxRate.rate / 100) : 0;

    return {
      totalInvoices,
      totalInvoiceAmount,
      estimatedTaxes,
      taxRatesCount: currentCompany.taxRates?.length || 0
    };
  };

  const taxSummary = calculateTaxSummary();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tax Management</h1>
          <p className="text-muted-foreground">Manage tax rates, calculate taxes, and track compliance</p>
        </div>
        <Button onClick={() => setIsTaxRateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Tax Rate
        </Button>
      </div>

      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-xl font-semibold">{taxSummary.totalInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-semibold">${taxSummary.totalInvoiceAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Taxes</p>
                <p className="text-xl font-semibold">${taxSummary.estimatedTaxes.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Tax Rates</p>
                <p className="text-xl font-semibold">{taxSummary.taxRatesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {/* Tax Rates Management */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Rates Management</CardTitle>
            <CardDescription>Configure and manage your tax rates</CardDescription>
          </CardHeader>
          <CardContent>
            {currentCompany.taxRates?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Name</TableHead>
                    <TableHead>Rate (%)</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCompany.taxRates.map((taxRate) => (
                    <TableRow key={taxRate.id}>
                      <TableCell className="font-medium">
                        {taxRate.name}
                        {taxRate.isDefault && (
                          <Badge variant="secondary" className="ml-2">Default</Badge>
                        )}
                      </TableCell>
                      <TableCell>{taxRate.rate}%</TableCell>
                      <TableCell>{taxRate.category || 'N/A'}</TableCell>
                      <TableCell>{taxRate.jurisdiction || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>{taxRate.effectiveDate || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTaxRate(taxRate)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTaxRate(taxRate.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No tax rates configured yet. Add your first tax rate to get started.
                </p>
                <Button onClick={() => setIsTaxRateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tax Rate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Calculator
            </CardTitle>
            <CardDescription>Calculate taxes using your configured tax rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Amount ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1000.00"
                    value={calculatorAmount}
                    onChange={(e) => setCalculatorAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tax Rate</label>
                  <Select value={selectedTaxRateId} onValueChange={setSelectedTaxRateId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax rate" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentCompany.taxRates?.map((taxRate) => (
                        <SelectItem key={taxRate.id} value={taxRate.id}>
                          {taxRate.name} ({taxRate.rate}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={calculateTax} className="w-full">
                    Calculate Tax
                  </Button>
                </div>
              </div>
              
              {calculatedTax > 0 && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Amount</p>
                    <p className="text-xl font-semibold">${calculatedTax.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Original Amount</p>
                    <p className="text-xl font-semibold">${parseFloat(calculatorAmount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-semibold">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <TaxRateDialog
        isOpen={isTaxRateDialogOpen}
        onClose={() => {
          setIsTaxRateDialogOpen(false);
          setSelectedTaxRate(null);
        }}
        taxRate={selectedTaxRate}
      />
    </div>
  );
};

export default Taxes;
