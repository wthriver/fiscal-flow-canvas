
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCompany } from "@/contexts/CompanyContext";
import { Plus, Search, Filter, Calendar, DollarSign, FileText, Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const VendorBillManagement: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewBillForm, setShowNewBillForm] = useState(false);

  // Enhanced demo vendor bills
  const vendorBills = currentCompany.vendorBills || [
    {
      id: "vb-001",
      billNumber: "BILL-2025-001",
      vendor: "Office Supplies Inc.",
      vendorId: "vendor-001",
      date: "2025-01-25",
      dueDate: "2025-02-24",
      amount: 1485.75,
      status: "Pending Approval" as const,
      category: "Office Supplies",
      description: "Monthly office supplies and equipment order",
      poNumber: "PO-2025-001",
      items: [
        {
          id: "item-1",
          description: "Printer Paper (50 reams)",
          quantity: 50,
          unitCost: 8.99,
          total: 449.50,
          accountId: "acc-5000"
        },
        {
          id: "item-2",
          description: "Ink Cartridges (HP LaserJet)",
          quantity: 12,
          unitCost: 85.50,
          total: 1026.00,
          accountId: "acc-5000"
        }
      ]
    },
    {
      id: "vb-002",
      billNumber: "BILL-2025-002",
      vendor: "CloudHost Services",
      vendorId: "vendor-002",
      date: "2025-01-20",
      dueDate: "2025-02-19",
      amount: 599.99,
      status: "Approved" as const,
      category: "Software & Subscriptions",
      description: "Monthly cloud hosting and backup services",
      items: [
        {
          id: "item-3",
          description: "Enterprise Cloud Hosting",
          quantity: 1,
          unitCost: 399.99,
          total: 399.99,
          accountId: "acc-5000"
        },
        {
          id: "item-4",
          description: "Backup & Security Services",
          quantity: 1,
          unitCost: 200.00,
          total: 200.00,
          accountId: "acc-5000"
        }
      ]
    },
    {
      id: "vb-003",
      billNumber: "BILL-2025-003",
      vendor: "Legal Services LLC",
      vendorId: "vendor-003",
      date: "2025-01-15",
      dueDate: "2025-01-30",
      amount: 2750.00,
      status: "Overdue" as const,
      category: "Professional Services",
      description: "Legal consultation and contract review services",
      items: [
        {
          id: "item-5",
          description: "Legal Consultation",
          quantity: 10,
          unitCost: 275.00,
          total: 2750.00,
          accountId: "acc-5000"
        }
      ]
    },
    {
      id: "vb-004",
      billNumber: "BILL-2025-004",
      vendor: "Maintenance Corp",
      vendorId: "vendor-004",
      date: "2025-01-10",
      dueDate: "2025-02-09",
      amount: 850.00,
      status: "Paid" as const,
      category: "Maintenance & Repairs",
      description: "Office equipment maintenance and repairs",
      paidDate: "2025-01-15",
      items: [
        {
          id: "item-6",
          description: "HVAC System Maintenance",
          quantity: 1,
          unitCost: 500.00,
          total: 500.00,
          accountId: "acc-5000"
        },
        {
          id: "item-7",
          description: "Office Equipment Repairs",
          quantity: 1,
          unitCost: 350.00,
          total: 350.00,
          accountId: "acc-5000"
        }
      ]
    }
  ];

  const filteredBills = vendorBills.filter(bill => {
    const matchesSearch = bill.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-500";
      case "Pending Approval": return "bg-yellow-500";
      case "Approved": return "bg-blue-500";
      case "Paid": return "bg-green-500";
      case "Overdue": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotals = () => {
    const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
    const pendingAmount = filteredBills.filter(b => b.status === "Pending Approval").reduce((sum, bill) => sum + bill.amount, 0);
    const overdueAmount = filteredBills.filter(b => b.status === "Overdue").reduce((sum, bill) => sum + bill.amount, 0);
    const paidAmount = filteredBills.filter(b => b.status === "Paid").reduce((sum, bill) => sum + bill.amount, 0);

    return { totalAmount, pendingAmount, overdueAmount, paidAmount };
  };

  const totals = calculateTotals();

  const handleApproveBill = (billId: string) => {
    toast.success("Bill approved successfully");
  };

  const handlePayBill = (billId: string) => {
    toast.success("Bill marked as paid");
  };

  const handleDeleteBill = (billId: string) => {
    toast.success("Bill deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vendor Bill Management</h2>
          <p className="text-muted-foreground">Track and manage vendor bills and payments</p>
        </div>
        <Button onClick={() => setShowNewBillForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredBills.length} bills
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredBills.filter(b => b.status === "Pending Approval").length} bills
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Bills</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totals.overdueAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredBills.filter(b => b.status === "Overdue").length} bills overdue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.paidAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredBills.filter(b => b.status === "Paid").length} bills paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Pending Approval">Pending Approval</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bills Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PO Number</TableHead>
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
                  <TableCell>{formatCurrency(bill.amount)}</TableCell>
                  <TableCell>{bill.category}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                  </TableCell>
                  <TableCell>{bill.poNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      {bill.status === "Pending Approval" && (
                        <Button variant="outline" size="sm" onClick={() => handleApproveBill(bill.id)}>
                          Approve
                        </Button>
                      )}
                      {bill.status === "Approved" && (
                        <Button variant="outline" size="sm" onClick={() => handlePayBill(bill.id)}>
                          Pay
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleDeleteBill(bill.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bill Details */}
      {filteredBills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bill Details - {filteredBills[0].billNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Vendor Information</h4>
                <p><strong>Vendor:</strong> {filteredBills[0].vendor}</p>
                <p><strong>Description:</strong> {filteredBills[0].description}</p>
                <p><strong>Category:</strong> {filteredBills[0].category}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Information</h4>
                <p><strong>Total Amount:</strong> {formatCurrency(filteredBills[0].amount)}</p>
                <p><strong>Due Date:</strong> {filteredBills[0].dueDate}</p>
                <p><strong>Status:</strong> <Badge className={getStatusColor(filteredBills[0].status)}>{filteredBills[0].status}</Badge></p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Line Items</h4>
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
                  {filteredBills[0].items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                      <TableCell>{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
