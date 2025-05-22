import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useCompany, Sale } from "@/contexts/CompanyContext";
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, CalendarIcon, ShoppingCart } from "lucide-react";
import { format } from "date-fns";

const Sales: React.FC = () => {
  const { currentCompany, addSale, updateSale, deleteSale } = useCompany();
  const [activeTab, setActiveTab] = useState("sales");
  const [searchText, setSearchText] = useState("");
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Filter sales based on search text
  const filteredSales = (currentCompany?.sales || []).filter(sale => 
    !searchText || 
    sale.id.toLowerCase().includes(searchText.toLowerCase()) ||
    (sale.customer?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  // Filter estimates
  const filteredEstimates = (currentCompany?.estimates || []).filter(estimate => 
    !searchText || 
    estimate.id.toLowerCase().includes(searchText.toLowerCase()) ||
    (estimate.customer?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  const handleCreateSale = () => {
    const newSale = {
      id: `sale-${Date.now()}`,
      customerId: currentCompany.customers[0]?.id || "",
      customer: currentCompany.customers[0]?.name || "Customer",
      amount: "$0.00",
      date: new Date().toISOString().split('T')[0],
      items: [],
      status: "Draft"
    };
    
    addSale(newSale);
    toast.success("Sale added successfully");
  };

  const handleUpdateSaleStatus = (saleId: string, status: string) => {
    updateSale(saleId, { status });
    toast.success(`Sale status updated to ${status}`);
  };

  const handleDeleteSale = (saleId: string) => {
    deleteSale(saleId);
    toast.success("Sale deleted successfully");
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Manage sales, quotes, and customer orders</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsNewSaleOpen(true)}
        >
          <PlusCircle size={16} />
          <span>New Sale</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${(currentCompany?.sales || []).reduce((sum, sale) => {
              const amount = parseFloat(sale.amount.replace(/[^0-9.-]+/g, "")) || 0;
              return sum + amount;
            }, 0).toLocaleString()}</CardTitle>
            <CardDescription>Total Sales</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{(currentCompany?.sales || []).length}</CardTitle>
            <CardDescription>Total Orders</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{(currentCompany?.estimates || []).length}</CardTitle>
            <CardDescription>Quotes / Estimates</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{(currentCompany?.sales || []).filter(s => s.status === "Completed").length}</CardTitle>
            <CardDescription>Completed Orders</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales and orders..."
            className="w-full sm:w-[300px] pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => {}}
              >
                <CalendarIcon size={16} />
                <span>{date ? format(date, "PP") : "Filter by Date"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            Filter
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Sales Orders</TabsTrigger>
          <TabsTrigger value="estimates">Quotes & Estimates</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.amount}</TableCell>
                        <TableCell>
                          <Badge className={`
                            ${sale.status === "Completed" ? "bg-green-100 text-green-800" : 
                              sale.status === "Processing" ? "bg-blue-100 text-blue-800" : 
                                sale.status === "Draft" ? "bg-gray-100 text-gray-800" : 
                                  "bg-yellow-100 text-yellow-800"}
                          `}>
                            {sale.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <ShoppingCart size={16} className="mr-1" />
                            <span>{sale.items?.length || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Edit Sale
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateSaleStatus(sale.id, "Completed")}
                              >
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateSaleStatus(sale.id, "Processing")}
                              >
                                Mark as Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateSaleStatus(sale.id, "Draft")}
                              >
                                Mark as Draft
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteSale(sale.id)}
                                className="text-red-600"
                              >
                                Delete Sale
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        {searchText ? "No sales found matching your search criteria" : "No sales found. Create your first sale."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estimates" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estimate #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstimates.length > 0 ? (
                    filteredEstimates.map((estimate) => (
                      <TableRow key={estimate.id}>
                        <TableCell className="font-medium">{estimate.estimateNumber || estimate.id}</TableCell>
                        <TableCell>{estimate.customer}</TableCell>
                        <TableCell>{estimate.date}</TableCell>
                        <TableCell>{estimate.expiryDate}</TableCell>
                        <TableCell>{estimate.amount}</TableCell>
                        <TableCell>
                          <Badge className={`
                            ${estimate.status === "Accepted" ? "bg-green-100 text-green-800" : 
                              estimate.status === "Sent" ? "bg-blue-100 text-blue-800" : 
                                estimate.status === "Draft" ? "bg-gray-100 text-gray-800" : 
                                  "bg-yellow-100 text-yellow-800"}
                          `}>
                            {estimate.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                View Estimate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Edit Estimate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Convert to Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as Accepted
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as Rejected
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                              >
                                Delete Estimate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        {searchText ? "No estimates found matching your search criteria" : "No estimates found. Create your first estimate."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sale</DialogTitle>
            <DialogDescription>
              Add a new sale or order to your records
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="customer" className="text-right">
                Customer
              </label>
              <select 
                id="customer" 
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              >
                {currentCompany.customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Date
              </label>
              <Input 
                id="date" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <select 
                id="status" 
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                defaultValue="Draft"
              >
                <option value="Draft">Draft</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSaleOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              handleCreateSale();
              setIsNewSaleOpen(false);
            }}>Create Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
