
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompany } from "@/contexts/CompanyContext";
import { Plus, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  date: string;
  expectedDate: string;
  status: "Draft" | "Sent" | "Partially Received" | "Received" | "Cancelled";
  total: number;
  items: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export const PurchaseOrderManagement = () => {
  const { currentCompany } = useCompany();
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  
  // Mock purchase orders data
  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "po-1",
      poNumber: "PO-2025-001",
      vendor: "Office Supplies Inc",
      date: "2025-01-15",
      expectedDate: "2025-01-22",
      status: "Sent",
      total: 1250.00,
      items: [
        { id: "1", description: "Office Chairs", quantity: 5, unitCost: 200, total: 1000 },
        { id: "2", description: "Desk Lamps", quantity: 5, unitCost: 50, total: 250 }
      ]
    },
    {
      id: "po-2",
      poNumber: "PO-2025-002",
      vendor: "Tech Solutions Ltd",
      date: "2025-01-10",
      expectedDate: "2025-01-17",
      status: "Partially Received",
      total: 3500.00,
      items: [
        { id: "3", description: "Laptops", quantity: 2, unitCost: 1500, total: 3000 },
        { id: "4", description: "Monitors", quantity: 2, unitCost: 250, total: 500 }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Sent": return "bg-blue-100 text-blue-800";
      case "Partially Received": return "bg-yellow-100 text-yellow-800";
      case "Received": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Received": return <CheckCircle className="h-4 w-4" />;
      case "Cancelled": return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleCreatePO = () => {
    toast.success("Purchase order created successfully");
    setIsNewPOOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Purchase Orders</h2>
          <p className="text-muted-foreground">Manage vendor purchase orders</p>
        </div>
        <Button onClick={() => setIsNewPOOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {purchaseOrders.filter(po => po.status === "Sent").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Partially Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {purchaseOrders.filter(po => po.status === "Partially Received").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${purchaseOrders.reduce((sum, po) => sum + po.total, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.poNumber}</TableCell>
                  <TableCell>{po.vendor}</TableCell>
                  <TableCell>{po.date}</TableCell>
                  <TableCell>{po.expectedDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(po.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(po.status)}
                        {po.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>${po.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPO(po)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Purchase Order {po.poNumber}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Vendor Information</h4>
                              <p>{po.vendor}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Order Details</h4>
                              <p>Date: {po.date}</p>
                              <p>Expected: {po.expectedDate}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Items</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Description</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Unit Cost</TableHead>
                                  <TableHead>Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {po.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.unitCost}</TableCell>
                                    <TableCell>${item.total}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New PO Dialog */}
      <Dialog open={isNewPOOpen} onOpenChange={setIsNewPOOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor1">Office Supplies Inc</SelectItem>
                  <SelectItem value="vendor2">Tech Solutions Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expected-date">Expected Delivery Date</Label>
              <Input type="date" id="expected-date" />
            </div>
            <Button onClick={handleCreatePO} className="w-full">
              Create Purchase Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
