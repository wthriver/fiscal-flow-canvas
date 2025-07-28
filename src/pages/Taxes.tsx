import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calculator, FileText, TrendingUp, Calendar } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { TaxRateDialog } from "@/components/taxes/TaxRateDialog";
import { DataTable, Column } from "@/components/common/DataTable";
import { TaxRate } from "@/types/company";

const Taxes: React.FC = () => {
  const { currentCompany, addTaxRate, updateTaxRate, deleteTaxRate } = useCompany();
  const [isTaxRateDialogOpen, setIsTaxRateDialogOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);

  const taxRates = currentCompany?.taxRates || [];
  const invoices = currentCompany?.invoices || [];
  const expenses = currentCompany?.expenses || [];

  // Calculate tax summaries
  const totalTaxCollected = invoices.reduce((sum, invoice) => {
    const rate = 0.08; // Default 8% tax rate
    const amount = invoice.amount || invoice.total || 0;
    return sum + (amount * rate);
  }, 0);

  const totalTaxPaid = expenses.reduce((sum, expense) => {
    const amount = typeof expense.amount === 'string' 
      ? parseFloat(expense.amount.replace(/[^0-9.-]+/g, "")) 
      : expense.amount;
    return sum + (amount * 0.08); // Assuming 8% tax on expenses
  }, 0);

  const taxOwed = totalTaxCollected - totalTaxPaid;

  const taxRateColumns: Column<TaxRate>[] = [
    {
      key: 'name',
      header: 'Tax Name',
      sortable: true
    },
    {
      key: 'rate',
      header: 'Rate',
      sortable: true,
      render: (value) => `${value}%`
    },
    {
      key: 'description',
      header: 'Description'
    },
    {
      key: 'isDefault',
      header: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Default' : 'Active'}
        </Badge>
      )
    }
  ];

  const handleAddTaxRate = () => {
    setEditingTaxRate(null);
    setIsTaxRateDialogOpen(true);
  };

  const handleEditTaxRate = (taxRate: TaxRate) => {
    setEditingTaxRate(taxRate);
    setIsTaxRateDialogOpen(true);
  };

  const handleSaveTaxRate = (taxRateData: Partial<TaxRate>) => {
    if (editingTaxRate) {
      updateTaxRate({ ...editingTaxRate, ...taxRateData } as TaxRate);
    } else {
      const newTaxRate: TaxRate = {
        id: `tax-${Date.now()}`,
        name: taxRateData.name!,
        rate: taxRateData.rate!,
        description: taxRateData.description || '',
        isDefault: taxRateData.isDefault ?? false
      };
      addTaxRate(newTaxRate);
    }
    setIsTaxRateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tax Management</h1>
          <p className="text-muted-foreground">Manage tax rates and track tax obligations</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalTaxCollected.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Paid</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalTaxPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">On expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Tax Owed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${taxOwed >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(taxOwed).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {taxOwed >= 0 ? 'Amount owed' : 'Overpaid'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Rates</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxRates.length}</div>
            <p className="text-xs text-muted-foreground">Active rates</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rates" className="w-full">
        <TabsList>
          <TabsTrigger value="rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="reports">Tax Reports</TabsTrigger>
          <TabsTrigger value="filings">Tax Filings</TabsTrigger>
        </TabsList>

        <TabsContent value="rates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tax Rates</h2>
            <Button onClick={handleAddTaxRate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Tax Rate
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <DataTable
                data={taxRates}
                columns={taxRateColumns}
                onEdit={handleEditTaxRate}
                onDelete={(taxRate) => deleteTaxRate(taxRate.id)}
                searchPlaceholder="Search tax rates..."
                emptyMessage="No tax rates found. Add your first tax rate to get started."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Tax Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                     <span>Total Sales:</span>
                     <span>${invoices.reduce((sum, inv) => {
                       const amount = inv.amount || inv.total || 0;
                       return sum + amount;
                     }, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Collected:</span>
                    <span>${totalTaxCollected.toLocaleString()}</span>
                  </div>
                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Tax Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                     <span>Total Expenses:</span>
                     <span>${expenses.reduce((sum, exp) => {
                       const amount = typeof exp.amount === 'string' 
                         ? parseFloat(exp.amount.toString().replace(/[^0-9.-]+/g, "")) 
                         : exp.amount;
                       return sum + amount;
                     }, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Paid:</span>
                    <span>${totalTaxPaid.toLocaleString()}</span>
                  </div>
                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="filings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tax Filings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming tax filings</p>
                <Button className="mt-4">Schedule Filing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TaxRateDialog
        open={isTaxRateDialogOpen}
        onOpenChange={setIsTaxRateDialogOpen}
        taxRate={editingTaxRate}
        onSave={() => setIsTaxRateDialogOpen(false)}
      />
    </div>
  );
};

export default Taxes;