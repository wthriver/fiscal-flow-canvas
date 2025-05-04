
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, ShoppingCart, FileText, CalendarIcon, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterButton, ExportButton } from "@/components/common/ActionButtons";
import { toast } from "sonner";
import { handleDateRange } from "@/utils/navigationUtils";
import { useCompany } from "@/contexts/CompanyContext";

const Sales: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter sales based on search term
  const filteredSales = currentCompany.sales?.filter(sale => 
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate total sales for the week
  const salesThisWeek = filteredSales.reduce((total, sale) => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    if (saleDate >= weekAgo && saleDate <= today) {
      // Extract numeric value from formatted string (e.g., "$1,250.00" to 1250.00)
      const amount = parseFloat(sale.total?.replace(/[^0-9.-]+/g, "") || sale.amount.replace(/[^0-9.-]+/g, "") || "0");
      return total + amount;
    }
    return total;
  }, 0);

  // Count pending orders
  const pendingOrders = filteredSales.filter(sale => 
    sale.status === "Processing" || sale.status === "On Hold"
  ).length;

  const handleCreateEstimate = () => {
    toast.info("Create estimate modal would open here");
  };

  const handleCreateSale = () => {
    toast.info("Create sale modal would open here");
  };

  const handleViewSale = (id: string) => {
    toast.info(`Viewing sale ${id}`);
  };

  const handleViewInvoice = (id: string) => {
    toast.info(`Viewing invoice for sale ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s sales orders and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleCreateEstimate}
          >
            <Tag size={16} />
            <span>Create Estimate</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateSale}
          >
            <PlusCircle size={16} />
            <span>New Sale</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">${salesThisWeek.toFixed(2)}</CardTitle>
            <CardDescription>Sales This Week</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredSales.length}</CardTitle>
            <CardDescription>Total Orders</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{pendingOrders}</CardTitle>
            <CardDescription>Pending Orders</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-primary">+12.5%</CardTitle>
            <CardDescription>vs. Last Week</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleDateRange("Sales")}
          >
            <CalendarIcon size={16} />
            <span>Date Range</span>
          </Button>
          <FilterButton type="Sales" />
          <ExportButton type="Sales" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>View and manage {currentCompany.name}'s recent sales orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.items?.length || 0}</TableCell>
                    <TableCell>{sale.total || sale.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : sale.status === "Processing" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {sale.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.paymentStatus === "Paid" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {sale.paymentStatus || "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewSale(sale.id)}
                        >
                          <ShoppingCart size={16} />
                          <span className="sr-only">View Order</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewInvoice(sale.id)}
                        >
                          <FileText size={16} />
                          <span className="sr-only">Invoice</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No sales found for {currentCompany.name}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
