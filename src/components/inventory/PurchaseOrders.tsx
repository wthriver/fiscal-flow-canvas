
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Truck, FileText, Calendar, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCompany } from "@/contexts/CompanyContext";

// Sample purchase orders for demonstration
const PURCHASE_ORDERS = [
  {
    id: "po-001",
    poNumber: "PO-2025-0001",
    vendor: "Office Supply Co.",
    createdDate: "2025-05-02",
    expectedDate: "2025-05-12",
    total: "$2,350.00",
    status: "open",
    items: [
      { id: "item-1", name: "Printer Paper", sku: "PP-001", quantity: 20, unitPrice: "$24.99", total: "$499.80" },
      { id: "item-2", name: "Ink Cartridges", sku: "IC-002", quantity: 10, unitPrice: "$45.00", total: "$450.00" },
      { id: "item-3", name: "Desk Organizers", sku: "DO-003", quantity: 15, unitPrice: "$12.00", total: "$180.00" }
    ]
  },
  {
    id: "po-002",
    poNumber: "PO-2025-0002",
    vendor: "Tech Distributors Inc.",
    createdDate: "2025-05-05",
    expectedDate: "2025-05-20",
    total: "$4,850.00",
    status: "partially-received",
    items: [
      { id: "item-4", name: "Monitors", sku: "MON-001", quantity: 5, unitPrice: "$250.00", total: "$1,250.00" },
      { id: "item-5", name: "Keyboards", sku: "KB-002", quantity: 10, unitPrice: "$45.00", total: "$450.00" },
      { id: "item-6", name: "Laptops", sku: "LT-003", quantity: 2, unitPrice: "$1,200.00", total: "$2,400.00" }
    ]
  },
  {
    id: "po-003",
    poNumber: "PO-2025-0003",
    vendor: "Furniture Warehouse",
    createdDate: "2025-04-25",
    expectedDate: "2025-05-25",
    total: "$3,750.00",
    status: "received",
    items: [
      { id: "item-7", name: "Office Chairs", sku: "OC-001", quantity: 5, unitPrice: "$250.00", total: "$1,250.00" },
      { id: "item-8", name: "Standing Desks", sku: "SD-002", quantity: 2, unitPrice: "$750.00", total: "$1,500.00" },
      { id: "item-9", name: "Filing Cabinets", sku: "FC-003", quantity: 2, unitPrice: "$500.00", total: "$1,000.00" }
    ]
  },
  {
    id: "po-004",
    poNumber: "PO-2025-0004",
    vendor: "Computer Systems LLC",
    createdDate: "2025-05-08",
    expectedDate: "2025-05-30",
    total: "$8,250.00",
    status: "draft",
    items: [
      { id: "item-10", name: "Server Equipment", sku: "SE-001", quantity: 1, unitPrice: "$5,500.00", total: "$5,500.00" },
      { id: "item-11", name: "Network Switches", sku: "NS-002", quantity: 3, unitPrice: "$750.00", total: "$2,250.00" },
      { id: "item-12", name: "UPS Battery Backup", sku: "UPS-003", quantity: 1, unitPrice: "$500.00", total: "$500.00" }
    ]
  }
];

export const PurchaseOrders: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [isNewPODialogOpen, setIsNewPODialogOpen] = useState(false);
  const [isViewPODialogOpen, setIsViewPODialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<typeof PURCHASE_ORDERS[0] | null>(null);
  
  // Filter purchase orders based on search and filters
  const filteredPOs = PURCHASE_ORDERS.filter(po => {
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || po.status === statusFilter;
    
    // Simple date range filter - could be more complex in real implementation
    let matchesDateRange = true;
    if (dateRangeFilter === "this-month") {
      matchesDateRange = po.createdDate.startsWith("2025-05");
    } else if (dateRangeFilter === "last-month") {
      matchesDateRange = po.createdDate.startsWith("2025-04");
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });
  
  const handleCreatePO = () => {
    toast.success("Purchase order created", {
      description: "PO-2025-0005 has been created as a draft"
    });
    setIsNewPODialogOpen(false);
  };
  
  const handleViewPO = (po: typeof PURCHASE_ORDERS[0]) => {
    setSelectedPO(po);
    setIsViewPODialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "open":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Open</Badge>;
      case "partially-received":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Partially Received</Badge>;
      case "received":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Received</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Purchase Orders</h2>
          <p className="text-muted-foreground">Create and manage purchase orders for vendors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsNewPODialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Orders</p>
                <p className="text-2xl font-bold">
                  {PURCHASE_ORDERS.filter(po => po.status === "open").length}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <FileText size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders This Month</p>
                <p className="text-2xl font-bold">
                  {PURCHASE_ORDERS.filter(po => po.createdDate.startsWith("2025-05")).length}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                <Calendar size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ordered Value</p>
                <p className="text-2xl font-bold">
                  ${PURCHASE_ORDERS.reduce((sum, po) => {
                    return sum + parseFloat(po.total.replace(/[^0-9.-]+/g, "") || "0");
                  }, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Truck size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>Manage your vendor orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="partially-received">Partially Received</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.length > 0 ? (
                  filteredPOs.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>{po.vendor}</TableCell>
                      <TableCell>{po.createdDate}</TableCell>
                      <TableCell>{po.expectedDate}</TableCell>
                      <TableCell className="text-right">{po.total}</TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPO(po)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No purchase orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredPOs.length} of {PURCHASE_ORDERS.length} purchase orders
          </div>
        </CardFooter>
      </Card>
      
      {/* New Purchase Order Dialog */}
      <Dialog open={isNewPODialogOpen} onOpenChange={setIsNewPODialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new purchase order for a vendor
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="vendor">Vendor*</label>
                <Select>
                  <SelectTrigger id="vendor">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office-supply">Office Supply Co.</SelectItem>
                    <SelectItem value="tech-distributors">Tech Distributors Inc.</SelectItem>
                    <SelectItem value="furniture">Furniture Warehouse</SelectItem>
                    <SelectItem value="computer-systems">Computer Systems LLC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="po-date">Date*</label>
                <Input id="po-date" type="date" defaultValue="2025-05-14" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="po-number">PO Number</label>
                <Input id="po-number" defaultValue="PO-2025-0005" readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <label htmlFor="expected-date">Expected Delivery Date</label>
                <Input id="expected-date" type="date" />
              </div>
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="rounded-md border mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pp-001">Printer Paper (PP-001)</SelectItem>
                            <SelectItem value="ic-002">Ink Cartridges (IC-002)</SelectItem>
                            <SelectItem value="do-003">Desk Organizers (DO-003)</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>PP-001</TableCell>
                      <TableCell className="text-center">
                        <Input 
                          type="number" 
                          min="1" 
                          defaultValue="1" 
                          className="w-16 text-center mx-auto" 
                        />
                      </TableCell>
                      <TableCell className="text-right">$24.99</TableCell>
                      <TableCell className="text-right">$24.99</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" size="sm" className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              
              <div className="flex justify-end">
                <div className="w-1/2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>$24.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%):</span>
                    <span>$2.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">$31.99</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes">Notes</label>
              <textarea 
                id="notes" 
                className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Additional notes for the vendor"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPODialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary">
              Save as Draft
            </Button>
            <Button onClick={handleCreatePO}>
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Purchase Order Dialog */}
      {selectedPO && (
        <Dialog open={isViewPODialogOpen} onOpenChange={setIsViewPODialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Purchase Order {selectedPO.poNumber}</DialogTitle>
              <DialogDescription>
                Created on {selectedPO.createdDate} | {getStatusBadge(selectedPO.status)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Vendor</h3>
                  <p>{selectedPO.vendor}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Expected Delivery</h3>
                  <p>{selectedPO.expectedDate}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="rounded-md border mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPO.items.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{item.unitPrice}</TableCell>
                          <TableCell className="text-right">{item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end">
                  <div className="w-1/2 space-y-2">
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">{selectedPO.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Print</Button>
                <Button variant="outline">Email to Vendor</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPO.status === "draft" && (
                  <Button>Send Purchase Order</Button>
                )}
                {(selectedPO.status === "open" || selectedPO.status === "partially-received") && (
                  <Button>Receive Items</Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
