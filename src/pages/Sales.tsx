import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompany } from "@/contexts/CompanyContext";
import { EstimateDialog } from "@/components/sales/EstimateDialog";
import { safeReplaceForNumber } from "@/components/timetracking/utils/timeTrackingUtils";

// Define a type for sales to fix the import issue
interface Sale {
  id: string;
  date: string;
  customer: string;
  amount: number | string;
  status: string;
  items?: any[];
}

const SalesPage: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("estimates");
  const [isEstimateDialogOpen, setIsEstimateDialogOpen] = useState(false);
  
  // Get sales data from company
  const estimates = currentCompany?.estimates || [];
  const salesData: Sale[] = currentCompany?.sales || [];
  
  // Calculate total estimates value
  const totalEstimatesValue = estimates.reduce((total, estimate) => {
    return total + estimate.total;
  }, 0);
  
  // Calculate total sales value
  const totalSalesValue = salesData.reduce((total, sale) => {
    const amount = typeof sale.amount === 'string'
      ? parseFloat(safeReplaceForNumber(sale.amount))
      : sale.amount || 0;
    return total + amount;
  }, 0);
  
  const handleCreateSale = () => {
    // This would typically open a dialog to create a sale
    console.log("Create sale clicked");
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
            <Button onClick={handleCreateSale}>
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
                <p className="text-sm font-medium text-muted-foreground">Active Estimates</p>
                <p className="text-2xl font-bold">{estimates.filter(e => e.status === "Pending").length}</p>
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
      
      <Tabs defaultValue="estimates" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="estimates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Estimates</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search estimates..."
                    className="pl-8 w-[200px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estimates.length > 0 ? (
                      estimates.map((estimate) => (
                        <TableRow key={estimate.id}>
                          <TableCell>{estimate.id.substring(0, 8)}</TableCell>
                          <TableCell>{estimate.customer}</TableCell>
                          <TableCell>{estimate.date}</TableCell>
                          <TableCell>{estimate.expiryDate}</TableCell>
                          <TableCell className="text-right">${estimate.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              estimate.status === "Approved" ? "bg-green-100 text-green-800" :
                              estimate.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {estimate.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Sales</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sales..."
                    className="pl-8 w-[200px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.length > 0 ? (
                      salesData.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.id.substring(0, 8)}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell className="text-right">
                            ${typeof sale.amount === 'number' 
                               ? sale.amount.toFixed(2)
                               : parseFloat(safeReplaceForNumber(sale.amount)).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              sale.status === "Completed" ? "bg-green-100 text-green-800" :
                              sale.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {sale.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
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
        onClose={() => setIsEstimateDialogOpen(false)}
      />
    </div>
  );
};

export default SalesPage;
