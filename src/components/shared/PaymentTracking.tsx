import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, DollarSign, Calendar, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { useCompany } from '@/contexts/CompanyContext';

interface Payment {
  id: string;
  invoiceId?: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  method: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'other';
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  notes?: string;
  processingFee?: number;
  depositAccount?: string;
}

export const PaymentTracking: React.FC = () => {
  const { currentCompany } = useCompany();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    invoiceId: '',
    customerId: '',
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'cash' as const,
    reference: '',
    notes: '',
    processingFee: 0,
    depositAccount: ''
  });

  const customers = currentCompany?.customers || [];
  const invoices = currentCompany?.invoices || [];
  const bankAccounts = currentCompany?.bankAccounts || [];

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: Banknote },
    { value: 'check', label: 'Check', icon: Calendar },
    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: DollarSign },
    { value: 'other', label: 'Other', icon: DollarSign }
  ];

  const handleCreatePayment = () => {
    if (!formData.customerId || formData.amount <= 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      invoiceId: formData.invoiceId || undefined,
      customerId: formData.customerId,
      customerName: customer?.name || 'Unknown',
      amount: formData.amount,
      paymentDate: formData.paymentDate,
      method: formData.method,
      reference: formData.reference || undefined,
      status: 'completed',
      notes: formData.notes || undefined,
      processingFee: formData.processingFee || undefined,
      depositAccount: formData.depositAccount || undefined
    };

    setPayments(prev => [...prev, newPayment]);
    toast.success('Payment recorded successfully');
    setIsCreateOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      invoiceId: '',
      customerId: '',
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      method: 'cash',
      reference: '',
      notes: '',
      processingFee: 0,
      depositAccount: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMethodIcon = (method: string) => {
    const methodObj = paymentMethods.find(m => m.value === method);
    const Icon = methodObj?.icon || DollarSign;
    return <Icon className="h-4 w-4" />;
  };

  const totalPayments = payments.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0
  );

  const totalFees = payments.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + (payment.processingFee || 0) : sum, 0
  );

  const netAmount = totalPayments - totalFees;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment Tracking</h2>
          <p className="text-muted-foreground">Record and track customer payments</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select 
                  value={formData.customerId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="invoice">Invoice (Optional)</Label>
                <Select 
                  value={formData.invoiceId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, invoiceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific invoice</SelectItem>
                    {invoices
                      .filter(inv => inv.customerId === formData.customerId || inv.customer === customers.find(c => c.id === formData.customerId)?.name)
                      .map(invoice => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.id} - ${invoice.total}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentDate">Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select 
                  value={formData.method} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <method.icon className="h-4 w-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reference">Reference/Check #</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="Check number, transaction ID, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="processingFee">Processing Fee</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    step="0.01"
                    value={formData.processingFee || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, processingFee: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="depositAccount">Deposit To</Label>
                  <Select 
                    value={formData.depositAccount} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, depositAccount: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePayment}>
                  Record Payment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter(p => p.status === 'completed').length} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total fees paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              After processing fees
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payments recorded yet</p>
              <p className="text-sm text-muted-foreground">Record your first payment to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell className="font-medium">{payment.customerName}</TableCell>
                    <TableCell>{payment.invoiceId || '-'}</TableCell>
                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.method)}
                        <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{payment.reference || '-'}</TableCell>
                    <TableCell>
                      <Badge className={`text-white ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};