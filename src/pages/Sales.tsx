import React, { useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EstimateDialog } from "@/components/sales/EstimateDialog";
import { toast } from "sonner";
import { PlusCircle, FileText, Clock, Check, X, ArrowRight, Search, Filter, Download, MoreHorizontal } from "lucide-react";

// New interfaces for sales management
interface SaleFormData {
  id?: string;
  date: string;
  customer: string;
  items: {
    id: string;
    product: string;
    quantity: number;
    price: string;
    total: string;
  }[];
  amount: string;
  status: string;
  paymentStatus?: string;
}

const Sales: React.FC = () => {
  const { currentCompany, updateCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("sales");
  const [newSaleDialogOpen, setNewSaleDialogOpen] = useState(false);
  const [editSaleDialogOpen, setEditSaleDialogOpen] = useState(false);
  const [viewSaleDialogOpen, setViewSaleDialogOpen] = useState(false);
  const [estimateDialogOpen, setEstimateDialogOpen] = useState(false);
  const [viewEstimateDialogOpen, setViewEstimateDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [newSale, setNewSale] = useState<SaleFormData>({
    date: new Date().toISOString().split('T')[0],
    customer: "",
    items: [
      {
        id: `item-${Date.now()}`,
        product: "",
        quantity: 1,
        price: "$0.00",
        total: "$0.00"
      }
    ],
    amount: "$0.00",
    status: "Processing",
  });
  
  // Filter sales based on search term
  const filteredSales = (currentCompany.sales || []).filter(sale => 
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter estimates based on search term
  const filteredEstimates = (currentCompany.estimates || []).filter(estimate => 
    estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total sales for the week
  const salesThisWeek = filteredSales.reduce((total, sale) => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    if (saleDate >= weekAgo && saleDate <= today) {
      // Extract numeric value from formatted string (e.g., "$1,250.00" to 1250.00)
      const amount = parseFloat(sale.amount.replace(/[^0-9.-]+/g, "") || "0");
      return total + amount;
    }
    return total;
  }, 0);

  // Count pending orders
  const pendingOrders = filteredSales.filter(sale => 
    sale.status === "Processing" || sale.status === "On Hold"
  ).length;

  const handleCreateEstimate = () => {
    setEstimateDialogOpen(true);
  };

  const handleViewEstimate = (id: string) => {
    const estimate = currentCompany.estimates?.find(e => e.id === id);
    if (estimate) {
      setSelectedEstimate(estimate);
      setViewEstimateDialogOpen(true);
    }
  };

  const handleConvertToSale = (estimateId: string) => {
    const estimate = currentCompany.estimates?.find(e => e.id === estimateId);
    if (!estimate) return;
    
    // Create a new sale from the estimate
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      customer: estimate.customer,
      amount: estimate.amount,
      items: estimate.items.map(item => ({
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        product: item.description,
        quantity: item.quantity,
        price: item.unitPrice,
        total: item.amount
      })),
      status: "Processing",
      paymentStatus: "Pending"
    };
    
    // Update the estimate status
    const updatedEstimates = (currentCompany.estimates || []).map(est => 
      est.id === estimateId ? { ...est, status: "Converted" } : est
    );
    
    // Add the new sale and update estimates
    const updatedSales = [...(currentCompany.sales || []), newSale];
    updateCompany(currentCompany.id, { 
      sales: updatedSales,
      estimates: updatedEstimates
    });
    
    toast.success("Estimate converted to sale successfully!");
    setViewEstimateDialogOpen(false);
  };

  const handleAddItem = () => {
    setNewSale({
      ...newSale,
      items: [
        ...newSale.items,
        {
          id: `item-${Date.now()}`,
          product: "",
          quantity: 1,
          price: "$0.00",
          total: "$0.00"
        }
      ]
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...newSale.items];
    updatedItems.splice(index, 1);
    
    // Recalculate total
    const newTotal = updatedItems.reduce((total, item) => {
      const itemTotal = parseFloat(item.total.replace(/[^0-9.-]+/g, "") || "0");
      return total + itemTotal;
    }, 0);
    
    setNewSale({
      ...newSale,
      items: updatedItems,
      amount: `$${newTotal.toFixed(2)}`
    });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...newSale.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // If price or quantity changed, recalculate total
    if (field === "price" || field === "quantity") {
      const price = field === "price" 
        ? parseFloat(value.toString().replace(/[^0-9.-]+/g, "") || "0") 
        : parseFloat(updatedItems[index].price.replace(/[^0-9.-]+/g, "") || "0");
      
      const quantity = field === "quantity" 
        ? Number(value) 
        : updatedItems[index].quantity;
      
      const itemTotal = price * quantity;
      updatedItems[index].total = `$${itemTotal.toFixed(2)}`;
      
      // Update sale total
      const newTotal = updatedItems.reduce((total, item) => {
        const subTotal = parseFloat(item.total.replace(/[^0-9.-]+/g, "") || "0");
        return total + subTotal;
      }, 0);
      
      setNewSale({
        ...newSale,
        items: updatedItems,
        amount: `$${newTotal.toFixed(2)}`
      });
    } else {
      setNewSale({
        ...newSale,
        items: updatedItems
      });
    }
  };

  const handleCreateSale = () => {
    setNewSaleDialogOpen(true);
  };

  const handleSaveNewSale = () => {
    if (!newSale.customer || newSale.items.some(item => !item.product)) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const saleToAdd: Sale = {
      id: `sale-${Date.now()}`,
      ...newSale,
      paymentStatus: "Pending"
    };
    
    const updatedSales = [...(currentCompany.sales || []), saleToAdd];
    updateCompany(currentCompany.id, { sales: updatedSales });
    
    toast.success("Sale created successfully!");
    setNewSaleDialogOpen(false);
    setNewSale({
      date: new Date().toISOString().split('T')[0],
      customer: "",
      items: [
        {
          id: `item-${Date.now()}`,
          product: "",
          quantity: 1,
          price: "$0.00",
          total: "$0.00"
        }
      ],
      amount: "$0.00",
      status: "Processing",
    });
  };

  const handleViewSale = (id: string) => {
    const sale = currentCompany.sales?.find(s => s.id === id);
    if (sale) {
      setSelectedSale(sale);
      setViewSaleDialogOpen(true);
    }
  };

  const handleEditSale = (id: string) => {
    const sale = currentCompany.sales?.find(s => s.id === id);
    if (sale) {
      setSelectedSale(sale);
      setEditSaleDialogOpen(true);
    }
  };

  const handleUpdateSale = () => {
    if (!selectedSale) return;
    
    const updatedSales = (currentCompany.sales || []).map(sale => 
      sale.id === selectedSale.id ? selectedSale : sale
    );
    
    updateCompany(currentCompany.id, { sales: updatedSales });
    
    toast.success("Sale updated successfully");
    setEditSaleDialogOpen(false);
    setSelectedSale(null);
  };

  const handleDeleteSale = (id: string) => {
    const updatedSales = (currentCompany.sales || []).filter(
      sale => sale.id !== id
    );
    
    updateCompany(currentCompany.id, { sales: updatedSales });
    
    toast.success("Sale deleted successfully");
  };

  const handleMarkAsPaid = (id: string) => {
    const updatedSales = (currentCompany.sales || []).map(sale => 
      sale.id === id 
        ? { ...sale, paymentStatus: "Paid", status: "Completed" } 
        : sale
    );
    
    updateCompany(currentCompany.id, { sales: updatedSales });
    
    toast.success("Sale marked as paid");
  };

  const handleViewInvoice = (id: string) => {
    toast.info(`Viewing invoice for sale ${id}`, {
      description: "Invoice details would be displayed here"
    });
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
            onClick={() => setNewSaleDialogOpen(true)}
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
            <CardTitle className="text-2xl text-primary">{filteredEstimates.length}</CardTitle>
            <CardDescription>Active Estimates</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales and estimates..."
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

      <Tabs defaultValue="sales" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Sales Orders</TabsTrigger>
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="mt-4">
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
                              onClick={() => {
                                setSelectedSale(sale);
                                setViewSaleDialogOpen(true);
                              }}
                            >
                              <ShoppingCart size={16} />
                              <span className="sr-only">View Order</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => {
                                toast.info(`Viewing invoice for ${sale.id}`, {
                                  description: "Invoice details would be displayed here"
                                });
                              }}
                            >
                              <FileText size={16} />
                              <span className="sr-only">Invoice</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit size={16} />
                                  <span className="sr-only">More Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedSale(sale);
                                    setEditSaleDialogOpen(true);
                                  }}
                                >
                                  Edit Sale
                                </DropdownMenuItem>
                                {sale.paymentStatus !== "Paid" && (
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      const updatedSales = (currentCompany.sales || []).map(s => 
                                        s.id === sale.id 
                                          ? { ...s, paymentStatus: "Paid", status: "Completed" } 
                                          : s
                                      );
                                      
                                      updateCompany(currentCompany.id, { sales: updatedSales });
                                      toast.success("Sale marked as paid");
                                    }}
                                  >
                                    Mark as Paid
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => {
                                    const updatedSales = (currentCompany.sales || []).filter(
                                      s => s.id !== sale.id
                                    );
                                    
                                    updateCompany(currentCompany.id, { sales: updatedSales });
                                    toast.success("Sale deleted successfully");
                                  }}
                                  className="text-red-600"
                                >
                                  Delete Sale
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
        </TabsContent>
        
        <TabsContent value="estimates" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Estimates</CardTitle>
              <CardDescription>View and manage sales estimates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estimate #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstimates && filteredEstimates.length > 0 ? (
                    filteredEstimates.map((estimate) => (
                      <TableRow key={estimate.id}>
                        <TableCell className="font-medium">{estimate.estimateNumber}</TableCell>
                        <TableCell>{estimate.date}</TableCell>
                        <TableCell>{estimate.customer}</TableCell>
                        <TableCell>{estimate.amount}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            estimate.status === "Accepted" 
                              ? "bg-green-100 text-green-800" 
                              : estimate.status === "Draft" 
                                ? "bg-blue-100 text-blue-800"
                                : estimate.status === "Converted"
                                  ? "bg-purple-100 text-purple-800"
                                  : estimate.status === "Declined" 
                                    ? "bg-red-100 text-red-800" 
                                    : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {estimate.status}
                          </span>
                        </TableCell>
                        <TableCell>{estimate.expiryDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleViewEstimate(estimate.id)}
                            >
                              <FileText size={16} />
                              <span className="sr-only">View Estimate</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit size={16} />
                                  <span className="sr-only">More Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => handleConvertToSale(estimate.id)}
                                  disabled={estimate.status === "Converted"}
                                >
                                  Convert to Sale
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    const updatedEstimates = (currentCompany.estimates || []).map(e => 
                                      e.id === estimate.id 
                                        ? { ...e, status: "Accepted" } 
                                        : e
                                    );
                                    
                                    updateCompany(currentCompany.id, { estimates: updatedEstimates });
                                    toast.success("Estimate marked as accepted");
                                  }}
                                  disabled={estimate.status === "Converted" || estimate.status === "Accepted"}
                                >
                                  Mark as Accepted
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    const updatedEstimates = (currentCompany.estimates || []).map(e => 
                                      e.id === estimate.id 
                                        ? { ...e, status: "Declined" } 
                                        : e
                                    );
                                    
                                    updateCompany(currentCompany.id, { estimates: updatedEstimates });
                                    toast.success("Estimate marked as declined");
                                  }}
                                  disabled={estimate.status === "Converted" || estimate.status === "Declined"}
                                >
                                  Mark as Declined
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    const updatedEstimates = (currentCompany.estimates || []).filter(
                                      e => e.id !== estimate.id
                                    );
                                    
                                    updateCompany(currentCompany.id, { estimates: updatedEstimates });
                                    toast.success("Estimate deleted successfully");
                                  }}
                                  className="text-red-600"
                                >
                                  Delete Estimate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No estimates found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create estimate dialog */}
      {estimateDialogOpen && (
        <EstimateDialog 
          isOpen={estimateDialogOpen}
          onClose={() => setEstimateDialogOpen(false)}
        />
      )}

      {/* View Estimate Dialog */}
      <Dialog open={viewEstimateDialogOpen} onOpenChange={setViewEstimateDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>View Estimate</DialogTitle>
            <DialogDescription>
              Estimate details
            </DialogDescription>
          </DialogHeader>
          {selectedEstimate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimate #</p>
                  <p>{selectedEstimate.estimateNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{selectedEstimate.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p>{selectedEstimate.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={
                    selectedEstimate.status === "Accepted" 
                      ? "bg-green-100 text-green-800" 
                      : selectedEstimate.status === "Draft" 
                        ? "bg-blue-100 text-blue-800"
                        : selectedEstimate.status === "Converted"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                  }>
                    {selectedEstimate.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                  <p>{selectedEstimate.expiryDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold">{selectedEstimate.amount}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEstimate.items && selectedEstimate.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice}</TableCell>
                        <TableCell className="text-right">{item.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {selectedEstimate.notes && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm">{selectedEstimate.notes}</p>
                </div>
              )}
              
              {selectedEstimate.termsAndConditions && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Terms & Conditions</h3>
                  <p className="text-sm">{selectedEstimate.termsAndConditions}</p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setViewEstimateDialogOpen(false)}>Close</Button>
                <div className="space-x-2">
                  {selectedEstimate.status !== "Converted" && selectedEstimate.status !== "Declined" && (
                    <Button 
                      onClick={() => handleConvertToSale(selectedEstimate.id)}
                      className="gap-2"
                    >
                      <span>Convert to Sale</span>
                      <ArrowRight size={16} />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Send PDF to email
                      toast.success("Estimate PDF sent to customer email");
                    }}
                  >
                    Email Estimate
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create New Sale Dialog */}
      <Dialog open={newSaleDialogOpen} onOpenChange={setNewSaleDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Sale</DialogTitle>
            <DialogDescription>
              Add a new sale to your records.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Date*
              </label>
              <Input 
                id="date" 
                className="col-span-3" 
                type="date"
                value={newSale.date}
                onChange={(e) => setNewSale({...newSale, date: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="customer" className="text-right">
                Customer*
              </label>
              <select
                id="customer"
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={newSale.customer}
                onChange={(e) => setNewSale({...newSale, customer: e.target.value})}
              >
                <option value="">Select Customer</option>
                {currentCompany.customers?.map(customer => (
                  <option key={customer.id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <select
                id="status"
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={newSale.status}
                onChange={(e) => setNewSale({...newSale, status: e.target.value})}
              >
                <option value="Processing">Processing</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Items</h3>
                <Button size="sm" variant="outline" onClick={handleAddItem}>Add Item</Button>
              </div>
              <div className="space-y-4">
                {newSale.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <label htmlFor={`product-${index}`} className="text-xs mb-1 block">
                        Product*
                      </label>
                      <Input 
                        id={`product-${index}`} 
                        value={item.product}
                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor={`qty-${index}`} className="text-xs mb-1 block">
                        Qty
                      </label>
                      <Input 
                        id={`qty-${index}`} 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor={`price-${index}`} className="text-xs mb-1 block">
                        Price
                      </label>
                      <Input 
                        id={`price-${index}`} 
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <label htmlFor={`total-${index}`} className="text-xs mb-1 block">
                        Total
                      </label>
                      <Input 
                        id={`total-${index}`} 
                        value={item.total}
                        readOnly
                      />
                    </div>
                    <div className="col-span-1 flex items-end justify-center">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-9 px-2 text-red-500"
                        onClick={() => handleRemoveItem(index)}
                        disabled={newSale.items.length === 1}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="text-xl font-bold">{newSale.amount}</div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSaleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewSale}>Create Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Sale Dialog */}
      <Dialog open={viewSaleDialogOpen} onOpenChange={setViewSaleDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>View Sale Details</DialogTitle>
            <DialogDescription>
              Sale information and item details
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order #</p>
                  <p>{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{selectedSale.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p>{selectedSale.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={
                    selectedSale.status === "Completed" 
                      ? "bg-green-100 text-green-800" 
                      : selectedSale.status === "Processing" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-yellow-100 text-yellow-800"
                  }>
                    {selectedSale.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                  <Badge className={
                    selectedSale.paymentStatus === "Paid" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }>
                    {selectedSale.paymentStatus || "Pending"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold">{selectedSale.amount}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items && selectedSale.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell className="text-right">{item.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setViewSaleDialogOpen(false)}>Close</Button>
                <div className="space-x-2">
                  {selectedSale.paymentStatus !== "Paid" && (
                    <Button 
                      onClick={() => {
                        handleMarkAsPaid(selectedSale.id);
                        setViewSaleDialogOpen(false);
                      }}
                    >
                      Mark as Paid
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleViewInvoice(selectedSale.id);
                    }}
                  >
                    View Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Sale Dialog */}
      <Dialog open={editSaleDialogOpen} onOpenChange={setEditSaleDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
            <DialogDescription>
              Update sale information and items
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-date" className="text-right">
                  Date
                </label>
                <Input 
                  id="edit-date" 
                  className="col-span-3" 
                  type="date"
                  value={selectedSale.date}
                  onChange={(e) => setSelectedSale({...selectedSale, date: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-customer" className="text-right">
                  Customer
                </label>
                <select
                  id="edit-customer"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedSale.customer}
                  onChange={(e) => setSelectedSale({...selectedSale, customer: e.target.value})}
                >
                  <option value="">Select Customer</option>
                  {currentCompany.customers?.map(customer => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-status" className="text-right">
                  Status
                </label>
                <select
                  id="edit-status"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedSale.status}
                  onChange={(e) => setSelectedSale({...selectedSale, status: e.target.value})}
                >
                  <option value="Processing">Processing</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-payment" className="text-right">
                  Payment Status
                </label>
                <select
                  id="edit-payment"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={selectedSale.paymentStatus || "Pending"}
                  onChange={(e) => setSelectedSale({...selectedSale, paymentStatus: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-amount" className="text-right">
                  Total Amount
                </label>
                <Input 
                  id="edit-amount" 
                  className="col-span-3"
                  value={selectedSale.amount}
                  onChange={(e) => setSelectedSale({...selectedSale, amount: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSaleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSale}>Update Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
