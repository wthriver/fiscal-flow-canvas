import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Upload, CheckCircle, Clock, XCircle, Building2, Mail, Phone } from 'lucide-react';

interface VendorBill {
  id: string;
  vendorId: string;
  vendorName: string;
  billNumber: string;
  amount: number;
  dueDate: string;
  billDate: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'overdue' | 'rejected';
  description: string;
  attachments: string[];
  approver?: string;
  approvalDate?: string;
  lineItems: BillLineItem[];
  paymentTerms: string;
  discountAmount?: number;
  taxAmount: number;
}

interface BillLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  account: string;
  taxRate?: number;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  taxId: string;
  isActive: boolean;
  category: string;
}

interface ApprovalWorkflow {
  id: string;
  name: string;
  maxAmount: number;
  approvers: string[];
  isActive: boolean;
}

const SAMPLE_VENDORS: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Office Supplies Co.',
    email: 'billing@officesupplies.com',
    phone: '(555) 123-4567',
    address: '123 Supply St, Business City, BC 12345',
    paymentTerms: 'Net 30',
    taxId: '12-3456789',
    isActive: true,
    category: 'Office Supplies'
  },
  {
    id: 'vendor-2',
    name: 'Tech Solutions Ltd.',
    email: 'accounts@techsolutions.com',
    phone: '(555) 987-6543',
    address: '456 Technology Blvd, Tech City, TC 67890',
    paymentTerms: 'Net 15',
    taxId: '98-7654321',
    isActive: true,
    category: 'Technology'
  }
];

const SAMPLE_BILLS: VendorBill[] = [
  {
    id: 'bill-1',
    vendorId: 'vendor-1',
    vendorName: 'Office Supplies Co.',
    billNumber: 'INV-2024-001',
    amount: 1250.00,
    dueDate: '2024-02-15',
    billDate: '2024-01-15',
    status: 'pending_approval',
    description: 'Monthly office supplies order',
    attachments: ['invoice-001.pdf'],
    lineItems: [
      {
        id: 'li-1',
        description: 'Printer Paper (Box of 10)',
        quantity: 5,
        unitPrice: 50.00,
        total: 250.00,
        account: 'Office Supplies'
      },
      {
        id: 'li-2',
        description: 'Printer Cartridges',
        quantity: 10,
        unitPrice: 85.00,
        total: 850.00,
        account: 'Office Supplies'
      }
    ],
    paymentTerms: 'Net 30',
    taxAmount: 150.00
  },
  {
    id: 'bill-2',
    vendorId: 'vendor-2',
    vendorName: 'Tech Solutions Ltd.',
    billNumber: 'TS-2024-005',
    amount: 3500.00,
    dueDate: '2024-02-01',
    billDate: '2024-01-17',
    status: 'approved',
    description: 'Software licensing and support',
    attachments: ['license-invoice.pdf'],
    approver: 'John Smith',
    approvalDate: '2024-01-20',
    lineItems: [
      {
        id: 'li-3',
        description: 'Software License (Annual)',
        quantity: 1,
        unitPrice: 3000.00,
        total: 3000.00,
        account: 'Software'
      },
      {
        id: 'li-4',
        description: 'Support Services',
        quantity: 1,
        unitPrice: 500.00,
        total: 500.00,
        account: 'Professional Services'
      }
    ],
    paymentTerms: 'Net 15',
    taxAmount: 0
  }
];

const SAMPLE_WORKFLOWS: ApprovalWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Standard Approval',
    maxAmount: 1000,
    approvers: ['Manager'],
    isActive: true
  },
  {
    id: 'wf-2',
    name: 'High Value Approval',
    maxAmount: 10000,
    approvers: ['Manager', 'Director'],
    isActive: true
  }
];

export const VendorBillManagement: React.FC = () => {
  const [bills, setBills] = useState<VendorBill[]>(SAMPLE_BILLS);
  const [vendors, setVendors] = useState<Vendor[]>(SAMPLE_VENDORS);
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(SAMPLE_WORKFLOWS);
  const [selectedBill, setSelectedBill] = useState<VendorBill | null>(null);
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: VendorBill['status']) => {
    const variants = {
      draft: 'secondary',
      pending_approval: 'default',
      approved: 'default',
      paid: 'default',
      overdue: 'destructive',
      rejected: 'destructive'
    } as const;
    
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: VendorBill['status']) => {
    switch (status) {
      case 'approved': case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending_approval': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue': case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleApproveBill = (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'approved', approver: 'Current User', approvalDate: new Date().toISOString().split('T')[0] }
        : bill
    ));
    toast({
      title: "Bill Approved",
      description: "The bill has been approved and is ready for payment",
    });
  };

  const handleRejectBill = (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId ? { ...bill, status: 'rejected' } : bill
    ));
    toast({
      title: "Bill Rejected",
      description: "The bill has been rejected",
      variant: "destructive"
    });
  };

  const calculateTotalBills = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const getPendingBillsCount = () => {
    return bills.filter(bill => bill.status === 'pending_approval').length;
  };

  const getOverdueBillsCount = () => {
    return bills.filter(bill => bill.status === 'overdue').length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bill Management</h1>
          <p className="text-muted-foreground">Manage vendor bills and approval workflows</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Bills
          </Button>
          <Dialog open={isNewBillOpen} onOpenChange={setIsNewBillOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                New Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Bill</DialogTitle>
                <DialogDescription>Enter vendor bill information</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billNumber">Bill Number</Label>
                  <Input id="billNumber" placeholder="INV-2024-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billDate">Bill Date</Label>
                  <Input id="billDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Amount</Label>
                  <Input id="tax" type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Bill description" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewBillOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsNewBillOpen(false)}>Create Bill</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateTotalBills().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All unpaid bills</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingBillsCount()}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOverdueBillsCount()}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.filter(v => v.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Vendor relationships</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="workflows">Approval Workflows</TabsTrigger>
          <TabsTrigger value="portal">Vendor Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Bills</CardTitle>
              <CardDescription>Track and approve vendor bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(bill.status)}
                      <div>
                        <div className="font-medium">{bill.billNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {bill.vendorName} • Due: {bill.dueDate} • ${bill.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {bill.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(bill.status)}
                      {bill.status === 'pending_approval' && (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleApproveBill(bill.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectBill(bill.id)}>
                            Reject
                          </Button>
                        </div>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setSelectedBill(bill)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>Manage vendor information and payment terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Building2 className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {vendor.category} • {vendor.paymentTerms}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{vendor.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{vendor.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={vendor.isActive ? 'default' : 'secondary'}>
                        {vendor.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Add Vendor</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflows</CardTitle>
              <CardDescription>Configure bill approval processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{workflow.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Up to ${workflow.maxAmount.toLocaleString()} • {workflow.approvers.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Add Workflow</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Portal</CardTitle>
              <CardDescription>Self-service portal for vendor bill submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">Vendor Bill Upload</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vendors can submit bills electronically through the portal
                </p>
                <Button className="mt-4">Configure Portal</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Portal Features</h4>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Electronic bill submission</li>
                    <li>• Payment status tracking</li>
                    <li>• Document management</li>
                    <li>• Automated notifications</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Integration Options</h4>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Email receipt processing</li>
                    <li>• OCR for data extraction</li>
                    <li>• API for vendor systems</li>
                    <li>• Workflow automation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bill Detail Dialog */}
      {selectedBill && (
        <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Bill Details - {selectedBill.billNumber}</DialogTitle>
              <DialogDescription>{selectedBill.vendorName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bill Date</Label>
                  <div className="text-sm">{selectedBill.billDate}</div>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <div className="text-sm">{selectedBill.dueDate}</div>
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <div className="text-sm">{selectedBill.paymentTerms}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="text-sm">{getStatusBadge(selectedBill.status)}</div>
                </div>
              </div>
              
              <div>
                <Label>Line Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedBill.lineItems.map((item) => (
                    <div key={item.id} className="flex justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.account}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <div className="space-y-1">
                  <div>Subtotal: ${(selectedBill.amount - selectedBill.taxAmount).toFixed(2)}</div>
                  <div>Tax: ${selectedBill.taxAmount.toFixed(2)}</div>
                  <div className="font-bold">Total: ${selectedBill.amount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};