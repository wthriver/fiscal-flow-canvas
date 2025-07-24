import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, TrendingUp, FileText, Users, DollarSign } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { EstimateDialog } from "@/components/sales/EstimateDialog";
import { SaleDialog } from "@/components/sales/SaleDialog";
import { DataTable, Column } from "@/components/common/DataTable";
import { Estimate, Sale } from "@/types/company";

const Sales: React.FC = () => {
  const { currentCompany, addEstimate, addSale, updateEstimate, updateSale, deleteEstimate, deleteSale } = useCompany();
  const [isEstimateDialogOpen, setIsEstimateDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const estimates = currentCompany?.estimates || [];
  const sales = currentCompany?.sales || [];

  const totalEstimateValue = estimates.reduce((sum, est) => sum + (est.total || 0), 0);
  const totalSalesValue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const conversionRate = estimates.length > 0 ? (sales.length / estimates.length) * 100 : 0;

  const estimateColumns: Column<Estimate>[] = [
    {
      key: 'id',
      header: 'Estimate #',
      sortable: true
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'validUntil',
      header: 'Valid Until',
      sortable: true
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (value) => `$${(value || 0).toLocaleString()}`
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'Accepted' ? 'default' : value === 'Pending' ? 'secondary' : 'destructive'}>
          {value}
        </Badge>
      )
    }
  ];

  const saleColumns: Column<Sale>[] = [
    {
      key: 'id',
      header: 'Sale #',
      sortable: true
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (value) => `$${(value || 0).toLocaleString()}`
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'Completed' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    }
  ];

  const handleAddEstimate = () => {
    setEditingEstimate(null);
    setIsEstimateDialogOpen(true);
  };

  const handleEditEstimate = (estimate: Estimate) => {
    setEditingEstimate(estimate);
    setIsEstimateDialogOpen(true);
  };

  const handleSaveEstimate = (estimateData: Partial<Estimate>) => {
    if (editingEstimate) {
      updateEstimate({ ...editingEstimate, ...estimateData } as Estimate);
    } else {
      const newEstimate: Estimate = {
        id: `est-${Date.now()}`,
        customer: estimateData.customer!,
        date: estimateData.date || new Date().toISOString().split('T')[0],
        validUntil: estimateData.validUntil!,
        total: estimateData.total || 0,
        status: estimateData.status || 'Pending',
        items: estimateData.items || []
      };
      addEstimate(newEstimate);
    }
    setIsEstimateDialogOpen(false);
  };

  const handleAddSale = () => {
    setEditingSale(null);
    setIsSaleDialogOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setIsSaleDialogOpen(true);
  };

  const handleSaveSale = (saleData: Partial<Sale>) => {
    if (editingSale) {
      updateSale({ ...editingSale, ...saleData } as Sale);
    } else {
      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        customer: saleData.customer!,
        date: saleData.date || new Date().toISOString().split('T')[0],
        total: saleData.total || 0,
        status: saleData.status || 'Pending',
        items: saleData.items || []
      };
      addSale(newSale);
    }
    setIsSaleDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales & Estimates</h1>
          <p className="text-muted-foreground">Manage estimates and track sales</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estimates.length}</div>
            <p className="text-xs text-muted-foreground">${totalEstimateValue.toLocaleString()} value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
            <p className="text-xs text-muted-foreground">${totalSalesValue.toLocaleString()} revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Estimates to sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sale Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${sales.length > 0 ? (totalSalesValue / sales.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="estimates" className="w-full">
        <TabsList>
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="estimates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Estimates</h2>
            <Button onClick={handleAddEstimate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Estimate
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <DataTable
                data={estimates}
                columns={estimateColumns}
                onEdit={handleEditEstimate}
                onDelete={(estimate) => deleteEstimate(estimate.id)}
                searchPlaceholder="Search estimates..."
                emptyMessage="No estimates found. Create your first estimate to get started."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sales</h2>
            <Button onClick={handleAddSale}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Sale
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <DataTable
                data={sales}
                columns={saleColumns}
                onEdit={handleEditSale}
                onDelete={(sale) => deleteSale(sale.id)}
                searchPlaceholder="Search sales..."
                emptyMessage="No sales recorded. Record your first sale to get started."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EstimateDialog
        open={isEstimateDialogOpen}
        onOpenChange={setIsEstimateDialogOpen}
        estimate={editingEstimate}
        onSave={handleSaveEstimate}
      />

      <SaleDialog
        open={isSaleDialogOpen}
        onOpenChange={setIsSaleDialogOpen}
        sale={editingSale}
        onSave={handleSaveSale}
      />
    </div>
  );
};

export default Sales;