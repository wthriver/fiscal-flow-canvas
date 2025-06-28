
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calculator, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { TaxRateDialog } from "@/components/taxes/TaxRateDialog";
import { safeNumberParse } from "@/utils/typeHelpers";
import { TaxRate } from "@/types/company";

const Taxes: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("overview");
  const [isTaxRateDialogOpen, setIsTaxRateDialogOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);

  const taxRates = currentCompany?.taxRates || [];
  const invoices = currentCompany?.invoices || [];
  const expenses = currentCompany?.expenses || [];

  // Calculate tax statistics
  const totalTaxCollected = invoices.reduce((sum, invoice) => {
    return sum + (invoice.taxAmount || 0);
  }, 0);

  const totalTaxableIncome = invoices.reduce((sum, invoice) => {
    return sum + invoice.total;
  }, 0);

  const totalDeductibleExpenses = expenses
    .filter(expense => expense.status === 'Paid')
    .reduce((sum, expense) => {
      const amount = safeNumberParse(expense.amount);
      return sum + amount;
    }, 0);

  const estimatedTaxLiability = totalTaxableIncome * 0.25; // Simplified calculation

  // Get default tax rate
  const defaultTaxRate = taxRates.find(rate => rate.isDefault);

  const handleAddTaxRate = () => {
    setEditingTaxRate(null);
    setIsTaxRateDialogOpen(true);
  };

  const handleEditTaxRate = (taxRate: TaxRate) => {
    setEditingTaxRate(taxRate);
    setIsTaxRateDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tax Management</h1>
          <p className="text-muted-foreground">
            Manage tax rates, compliance, and calculations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button onClick={handleAddTaxRate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tax Rate
          </Button>
        </div>
      </div>

      {/* Tax Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTaxCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {invoices.length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxable Income</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTaxableIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deductible Expenses</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeductibleExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Tax deductions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Liability</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${estimatedTaxLiability.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Estimated tax due
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Summary</CardTitle>
                <CardDescription>Current period tax information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gross Revenue</span>
                    <span className="font-medium">${totalTaxableIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Deductible Expenses</span>
                    <span className="font-medium">-${totalDeductibleExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Net Taxable Income</span>
                    <span className="font-medium">
                      ${(totalTaxableIncome - totalDeductibleExpenses).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estimated Tax Liability</span>
                      <span className="font-bold text-lg">${estimatedTaxLiability.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Tax Rates</CardTitle>
                <CardDescription>Currently configured tax rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {taxRates.slice(0, 5).map((rate) => (
                    <div key={rate.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{rate.name}</span>
                        {rate.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <span className="font-medium">{rate.rate}%</span>
                    </div>
                  ))}
                  {taxRates.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tax rates configured</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Tax Breakdown</CardTitle>
              <CardDescription>Tax collected and paid by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['January', 'February', 'March', 'April', 'May', 'June'].map((month) => {
                  // This is a simplified example - in a real app, you'd calculate actual monthly data
                  const monthlyTax = totalTaxCollected / 6; // Simplified calculation
                  
                  return (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{month}</span>
                      <span className="font-medium">${monthlyTax.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tax Rates</CardTitle>
                  <CardDescription>Manage your tax rates and jurisdictions</CardDescription>
                </div>
                <Button onClick={handleAddTaxRate}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Tax Rate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxRates.map((rate) => (
                  <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{rate.name}</span>
                        {rate.isDefault && (
                          <Badge variant="default" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rate.description || 'No description'}
                        {rate.jurisdiction && ` • ${rate.jurisdiction}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{rate.rate}%</div>
                      {rate.effectiveDate && (
                        <div className="text-xs text-muted-foreground">
                          Effective: {rate.effectiveDate}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTaxRate(rate)}
                      className="ml-2"
                    >
                      Edit
                    </Button>
                  </div>
                ))}
                {taxRates.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tax rates configured</p>
                    <Button onClick={handleAddTaxRate} className="mt-2">
                      Add Your First Tax Rate
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Reports</CardTitle>
                <CardDescription>Generate various tax reports for compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Sales Tax Report</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Detailed breakdown of sales tax collected
                    </p>
                    <Button variant="outline" size="sm">Generate Report</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Income Tax Summary</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Summary of taxable income and deductions
                    </p>
                    <Button variant="outline" size="sm">Generate Report</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Quarterly Tax Report</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Quarterly tax filing report
                    </p>
                    <Button variant="outline" size="sm">Generate Report</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Annual Tax Summary</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Year-end tax summary and analysis
                    </p>
                    <Button variant="outline" size="sm">Generate Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Compliance</CardTitle>
                <CardDescription>Ensure your tax compliance is up to date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Quarterly Filing</p>
                      <p className="text-sm text-muted-foreground">Next due: March 31, 2024</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sales Tax Remittance</p>
                      <p className="text-sm text-muted-foreground">Monthly filing required</p>
                    </div>
                    <Badge variant="default">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Annual Tax Return</p>
                      <p className="text-sm text-muted-foreground">Due: April 15, 2024</p>
                    </div>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
