
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCompany } from "@/contexts/CompanyContext";
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

interface VendorBill {
  id: string;
  billNumber: string;
  vendor: string;
  vendorId?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Draft" | "Pending Approval" | "Approved" | "Paid" | "Overdue";
  category: string;
  description: string;
  poNumber?: string;
  items?: BillItem[];
  approvedBy?: string;
  paidDate?: string;
}

interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  total: number;
  accountId?: string;
}

export const VendorBillManagement = () => {
  const { currentCompany, addExpense } = useCompany();
  const [newBillOpen, setNewBillOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [billForm, setBillForm] = useState({
    billNumber: "",
    vendor: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    amount: "",
    category: "",
    description: "",
    poNumber: ""
  });

  // Get vendor bills from company expenses or create initial data
  const getVendorBills = (): VendorBill[] => {
    const expenses = currentCompany?.expenses || [];
    const existingBills = expenses
      .filter(expense => expense.vendor && expense.category)
      .map(expense => ({
        id: expense.id,
        billNumber: expense.id,
        vendor: expense.vendor,
        vendorId: expense.id,
        date: expense.date,
        dueDate: expense.date, // Use same date if no due date
        amount: typeof expense.amount === 'string' 
          ? parseFloat(expense.amount.replace(/[$,]/g, '')) || 0
          : expense.amount,
        status: expense.status === 'Paid' ? 'Paid' as const : 'Pending Approval' as const,
        category: expense.category,
        description: expense.description || 'No description',
        poNumber: expense.id
      }));

    // Add some sample bills if none exist
    if (existingBills.length === 0) {
      return [
    {
      id: "VB-001",
      billNumber: "BILL-2024-001",
      vendor: "Office Supplies Inc",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 1250.00,
      status: "Pending Approval",
      category: "Office Supplies",
      description: "Monthly office supplies order",
      poNumber: "PO-001"
    },
    {
      id: "VB-002",
      billNumber: "BILL-2024-002",
      vendor: "Electric Company",
      date: "2024-01-10",
      dueDate: "2024-01-25",
      amount: 450.00,
      status: "Overdue",
      category: "Utilities",
      description: "Monthly electricity bill"
    },
    {
      id: "VB-003",
      billNumber: "BILL-2024-003",
      vendor: "Software Solutions LLC",
      date: "2024-01-20",
      dueDate: "2024-02-20",
      amount: 2500.00,
      status: "Approved",
      category: "Software",
      description: "Annual software licensing"
      }
    ];
  }
  
  return existingBills.length > 0 ? existingBills : [
    {
      id: "VB-001",
      billNumber: "BILL-2024-001",
      vendor: "Office Supplies Inc",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 1250.00,
      status: "Pending Approval" as const,
      category: "Office Supplies",
      description: "Monthly office supplies order",
      poNumber: "PO-001"
    },
    {
      id: "VB-002",
      billNumber: "BILL-2024-002",
      vendor: "Electric Company",
      date: "2024-01-10",
      dueDate: "2024-01-25",
      amount: 450.00,
      status: "Overdue" as const,
      category: "Utilities",
      description: "Monthly electricity bill"
    },
    {
      id: "VB-003",
      billNumber: "BILL-2024-003",
      vendor: "Software Solutions LLC",
      date: "2024-01-20",
      dueDate: "2024-02-20",
      amount: 2500.00,
      status: "Approved" as const,
      category: "Software",
      description: "Annual software licensing"
    }
  ];
};

const vendorBills = getVendorBills();

const handleCreateBill = () => {
  if (!billForm.billNumber || !billForm.vendor || !billForm.amount || !billForm.category) {
    toast.error("Please fill in all required fields");
    return;
  }

  const newExpense = {
    id: billForm.billNumber || `VB-${Date.now()}`,
    date: billForm.date,
    category: billForm.category,
    vendor: billForm.vendor,
    amount: parseFloat(billForm.amount),
    status: 'Pending' as const,
    paymentMethod: 'Vendor Bill',
    description: billForm.description || `Bill from ${billForm.vendor}`
  };

  addExpense(newExpense);
  toast.success("Vendor bill created successfully");
  
  // Reset form
  setBillForm({
    billNumber: "",
    vendor: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    amount: "",
    category: "",
    description: "",
    poNumber: ""
  });
  
  setNewBillOpen(false);
};

  const getStatusIcon = (status: VendorBill["status"]) => {
    switch (status) {
      case "Draft":
        return <FileText className="h-4 w-4" />;
      case "Pending Approval":
        return <Clock className="h-4 w-4" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4" />;
      case "Paid":
        return <CheckCircle className="h-4 w-4" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: VendorBill["status"]) => {
    switch (status) {
      case "Draft":
        return "secondary";
      case "Pending Approval":
        return "outline";
      case "Approved":
        return "default";
      case "Paid":
        return "default";
      case "Overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredBills = filterStatus === "all" ? vendorBills : vendorBills.filter(bill => 
    bill.status.toLowerCase().replace(" ", "-") === filterStatus
  );

  const getTotalByStatus = (status: string) => {
    return vendorBills
      .filter(bill => status === "all" || bill.status.toLowerCase().replace(" ", "-") === status)
      .reduce((sum, bill) => sum + bill.amount, 0);
  };

  const handleApproveBill = (billId: string) => {
    toast.success("Bill approved successfully");
  };

  const handlePayBill = (billId: string) => {
    toast.success("Bill payment processed");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vendor Bill Management</h2>
          <p className="text-muted-foreground">Track and manage vendor bills and payments</p>
        </div>
        <Dialog open={newBillOpen} onOpenChange={setNewBillOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Vendor Bill</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bill Number*</Label>
                <Input 
                  placeholder="BILL-2024-004" 
                  value={billForm.billNumber}
                  onChange={(e) => setBillForm({...billForm, billNumber: e.target.value})}
                />
              </div>
              <div>
                <Label>Vendor*</Label>
                <Input 
                  placeholder="Enter vendor name" 
                  value={billForm.vendor}
                  onChange={(e) => setBillForm({...billForm, vendor: e.target.value})}
                />
              </div>
              <div>
                <Label>Bill Date*</Label>
                <Input 
                  type="date" 
                  value={billForm.date}
                  onChange={(e) => setBillForm({...billForm, date: e.target.value})}
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input 
                  type="date" 
                  value={billForm.dueDate}
                  onChange={(e) => setBillForm({...billForm, dueDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Amount*</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground">
                    $
                  </span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01"
                    min="0"
                    className="rounded-l-none"
                    value={billForm.amount}
                    onChange={(e) => setBillForm({...billForm, amount: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Category*</Label>
                <Select value={billForm.category} onValueChange={(value) => setBillForm({...billForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Bill description..." 
                  value={billForm.description}
                  onChange={(e) => setBillForm({...billForm, description: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label>PO Number (Optional)</Label>
                <Input 
                  placeholder="PO-001" 
                  value={billForm.poNumber}
                  onChange={(e) => setBillForm({...billForm, poNumber: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setNewBillOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBill}>
                Create Bill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getTotalByStatus("all").toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              {vendorBills.length} bills
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-600">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${getTotalByStatus("pending-approval").toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${getTotalByStatus("approved").toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${getTotalByStatus("paid").toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${getTotalByStatus("overdue").toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vendor Bills</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bills</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending-approval">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
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
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.billNumber}</TableCell>
                  <TableCell>{bill.vendor}</TableCell>
                  <TableCell>{bill.date}</TableCell>
                  <TableCell>{bill.dueDate}</TableCell>
                  <TableCell>${bill.amount.toLocaleString()}</TableCell>
                  <TableCell>{bill.category}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(bill.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(bill.status)}
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {bill.status === "Pending Approval" && (
                        <Button size="sm" onClick={() => handleApproveBill(bill.id)}>
                          Approve
                        </Button>
                      )}
                      {bill.status === "Approved" && (
                        <Button size="sm" onClick={() => handlePayBill(bill.id)}>
                          Pay
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
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
