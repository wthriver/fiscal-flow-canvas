
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Download, Filter, Edit, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { EstimateDialog } from "@/components/sales/EstimateDialog";
import { SaleDialog } from "@/components/sales/SaleDialog";
import { safeStringReplace } from "@/utils/typeHelpers";
import { Sale, Estimate } from "@/types/company";
import { useToast } from "@/hooks/use-toast";

const SalesPage: React.FC = () => {
  const { currentCompany, addSale, updateSale, deleteSale, addEstimate, updateEstimate, deleteEstimate } = useCompany();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("estimates");
  const [isEstimateDialogOpen, setIsEstimateDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [searchText, setSearchText] = useState("");
  
  // Get data from company
  const estimates = currentCompany?.estimates || [];
  const salesData: Sale[] = currentCompany?.sales || [];
  const customers = currentCompany?.customers || [];
  
  // Filter data based on search
  const filteredEstimates = estimates.filter(estimate => 
    estimate.customer?.toLowerCase().includes(searchText.toLowerCase()) ||
    estimate.id.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const filteredSales = salesData.filter(sale => 
    sale.customer.toLowerCase().includes(searchText.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchText.toLowerCase())
  );
  
  // Calculate totals
  const totalEstimatesValue = estimates.reduce((total, estimate) => total + estimate.total, 0);
  const totalSalesValue = salesData.reduce((total, sale) => {
    const amount = typeof sale.amount === 'string'
      ? parseFloat(safeStringReplace(sale.amount, /[^0-9.-]/g, ""))
      : sale.amount || 0;
    return total + amount;
  }, 0);
  
  const handleCreateSale = (saleData: Sale) => {
    try {
      if (editingSale) {
        updateSale!(saleData);
        toast({
          title: "Sale Updated",
          description: "Sale has been updated successfully.",
        });
      } else {
        addSale!(saleData);
        toast({
          title: "Sale Created",
          description: "New sale has been created successfully.",
        });
      }
      setIsSaleDialogOpen(false);
      setEditingSale(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save sale. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateEstimate = (estimateData: Estimate) => {
    try {
      if (editingEstimate) {
        updateEstimate(estimateData);
        toast({
          title: "Estimate Updated",
          description: "Estimate has been updated successfully.",
        });
      } else {
        addEstimate(estimateData);
        toast({
          title: "Estimate Created",
          description: "New estimate has been created successfully.",
        });
      }
      setIsEstimateDialogOpen(false);
      setEditingEstimate(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save estimate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setIsSaleDialogOpen(true);
  };

  const handleEditEstimate = (estimate: Estimate) => {
    setEditingEstimate(estimate);
    setIsEstimateDialogOpen(true);
  };

  const handleDeleteSale = (saleId: string) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      deleteSale!(saleId);
      toast({
        title: "Sale Deleted",
        description: "Sale has been deleted successfully.",
      });
    }
  };

  const handleDeleteEstimate = (estimateId: string) => {
    if (confirm("Are you sure you want to delete this estimate?")) {
      deleteEstimate(estimateId);
      toast({
        title: "Estimate Deleted",
        description: "Estimate has been deleted successfully.",
      });
    }
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sales Management</h1>
          <p className="text-muted-foreground">Manage your estimates, sales, and orders</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "estimates" ? (
            <Button onClick={() => setIsEstimateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Estimate
            </Button>
          ) : (
            <Button onClick={() => setIsSaleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">${totalSalesValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft Estimates</p>
                <p className="text-2xl font-bold">{estimates.filter(e => e.status === "Draft").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimates Value</p>
                <p className="text-2xl font-bold">${totalEstimatesValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab}...`}
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="estimates" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="estimates">
          <Card>
            <CardHeader>
              <CardTitle>Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstimates.length > 0 ? (
                      filteredEstimates.map((estimate) => (
                        <TableRow key={estimate.id}>
                          <TableCell>{estimate.id.substring(0, 8)}</TableCell>
                          <TableCell>{estimate.customer}</TableCell>
                          <TableCell>{estimate.date}</TableCell>
                          <TableCell>{estimate.expiryDate}</TableCell>
                          <TableCell className="text-right">${estimate.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              estimate.status === "Accepted" ? "bg-green-100 text-green-800" :
                              estimate.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
                              estimate.status === "Sent" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {estimate.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditEstimate(estimate)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteEstimate(estimate.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No estimates found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.length > 0 ? (
                      filteredSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.id.substring(0, 8)}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell className="text-right">
                            ${typeof sale.amount === 'number' 
                               ? sale.amount.toFixed(2)
                               : parseFloat(safeStringReplace(sale.amount, /[^0-9.-]/g, "")).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              sale.status === "Completed" ? "bg-green-100 text-green-800" :
                              sale.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {sale.status}
                            </span>
                          </TableCell>
                          <TableCell>{sale.paymentMethod || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSale(sale)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSale(sale.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No sales found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <EstimateDialog
        isOpen={isEstimateDialogOpen}
        onClose={() => {
          setIsEstimateDialogOpen(false);
          setEditingEstimate(null);
        }}
        onSave={handleCreateEstimate}
        estimate={editingEstimate}
      />

      <SaleDialog
        open={isSaleDialogOpen}
        onOpenChange={(open) => {
          setIsSaleDialogOpen(open);
          if (!open) setEditingSale(null);
        }}
        onSubmit={handleCreateSale}
        customers={customers}
        sale={editingSale}
      />
    </div>
  );
};

export default SalesPage;
