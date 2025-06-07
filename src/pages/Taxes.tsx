
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaxCalculator } from "@/components/taxes/TaxCalculator";
import { TaxRateDialog } from "@/components/taxes/TaxRateDialog";
import { useCompany } from "@/contexts/CompanyContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Taxes: React.FC = () => {
  const { currentCompany, deleteTaxRate } = useCompany();
  const [isTaxRateDialogOpen, setIsTaxRateDialogOpen] = useState(false);
  const [selectedTaxRate, setSelectedTaxRate] = useState(null);

  const handleEditTaxRate = (taxRate: any) => {
    setSelectedTaxRate(taxRate);
    setIsTaxRateDialogOpen(true);
  };

  const handleDeleteTaxRate = (taxRateId: string) => {
    deleteTaxRate(taxRateId);
    toast.success("Tax rate deleted successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tax Management</h1>
        <Button onClick={() => setIsTaxRateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Tax Rate
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Rates</CardTitle>
            <CardDescription>Manage your tax rates and calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentCompany.taxRates?.map((taxRate) => (
                <div key={taxRate.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{taxRate.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {taxRate.rate}% - {taxRate.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
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
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {!currentCompany.taxRates?.length && (
                <p className="text-center text-muted-foreground py-8">
                  No tax rates configured yet. Add your first tax rate to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <TaxCalculator />
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
