
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface VendorBill {
  id: string;
  billNumber: string;
  vendor: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Draft" | "Pending Approval" | "Approved" | "Paid" | "Overdue";
  category: string;
  description: string;
}

export const VendorBillManagement = () => {
  const [bills, setBills] = useState<VendorBill[]>([
    {
      id: "bill-1",
      billNumber: "BILL-001",
      vendor: "CloudHost Services",
      date: "2025-05-15",
      dueDate: "2025-06-15",
      amount: 299.99,
      status: "Approved",
      category: "Software & Subscriptions",
      description: "Monthly hosting and cloud services"
    },
    {
      id: "bill-2",
      billNumber: "BILL-002",
      vendor: "Office Furniture Pro",
      date: "2025-05-18",
      dueDate: "2025-06-02",
      amount: 1250.00,
      status: "Pending Approval",
      category: "Office Equipment",
      description: "Desk chairs and standing desks"
    },
    {
      id: "bill-3",
      billNumber: "BILL-003",
      vendor: "Legal Associates LLC",
      date: "2025-05-10",
      dueDate: "2025-05-25",
      amount: 2500.00,
      status: "Overdue",
      category: "Professional Services",
      description: "Contract review and legal consultation"
    }
  ]);

  const [newBill, setNewBill] = useState({
    billNumber: "",
    vendor: "",
    date: "",
    dueDate: "",
    amount: "",
    category: "",
    description: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateBill = () => {
    if (!newBill.billNumber || !newBill.vendor || !newBill.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bill: VendorBill = {
      id: `bill-${Date.now()}`,
      billNumber: newBill.billNumber,
      vendor: newBill.vendor,
      date: newBill.date || new Date().toISOString().split('T')[0],
      dueDate: newBill.dueDate,
      amount: parseFloat(newBill.amount),
      status: "Draft",
      category: newBill.category,
      description: newBill.description
    };

    setBills(prev => [bill, ...prev]);
    setNewBill({
      billNumber: "",
      vendor: "",
      date: "",
      dueDate: "",
      amount: "",
      category: "",
      description: ""
    });
    setIsDialogOpen(false);
    toast.success("Bill created successfully");
  };

  const updateBillStatus = (billId: string, newStatus: VendorBill["status"]) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId ? { ...bill, status: newStatus } : bill
    ));
    toast.success(`Bill status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "default";
      case "Approved": return "default";
      case "Pending Approval": return "secondary";
      case "Overdue": return "destructive";
      default: return "outline";
    }
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const overdueAmount = bills
    .filter(bill => bill.status === "Overdue")
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Bills</p>
                <p className="text-xl font-semibold">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue Amount</p>
                <p className="text-xl font-semibold text-red-600">${overdueAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Bills</p>
                <p className="text-xl font-semibold">{bills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendor Bills</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Bill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Bill</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billNumber">Bill Number</Label>
                      <Input
                        id="billNumber"
                        value={newBill.billNumber}
                        onChange={(e) => setNewBill({...newBill, billNumber: e.target.value})}
                        placeholder="BILL-004"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor">Vendor</Label>
                      <Input
                        id="vendor"
                        value={newBill.vendor}
                        onChange={(e) => setNewBill({...newBill, vendor: e.target.value})}
                        placeholder="Vendor name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Bill Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newBill.date}
                        onChange={(e) => setNewBill({...newBill, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newBill.dueDate}
                        onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newBill.amount}
                        onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newBill.category} onValueChange={(value) => setNewBill({...newBill, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                          <SelectItem value="Software & Subscriptions">Software & Subscriptions</SelectItem>
                          <SelectItem value="Professional Services">Professional Services</SelectItem>
                          <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newBill.description}
                      onChange={(e) => setNewBill({...newBill, description: e.target.value})}
                      placeholder="Bill description"
                    />
                  </div>
                  <Button onClick={handleCreateBill} className="w-full">
                    Create Bill
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.billNumber}</TableCell>
                  <TableCell>{bill.vendor}</TableCell>
                  <TableCell>{bill.date}</TableCell>
                  <TableCell>{bill.dueDate}</TableCell>
                  <TableCell>${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>{bill.category}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={bill.status} onValueChange={(value: VendorBill["status"]) => updateBillStatus(bill.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
