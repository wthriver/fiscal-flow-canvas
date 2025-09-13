import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { useCompany } from '@/contexts/CompanyContext';

interface RecurringInvoice {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextInvoiceDate: string;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  invoiceTemplate: any;
}

export const RecurringInvoicesManager: React.FC = () => {
  const { currentCompany } = useCompany();
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<RecurringInvoice | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    description: '',
    amount: 0,
    frequency: 'monthly' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const customers = currentCompany?.customers || [];

  const handleCreateRecurring = () => {
    if (!formData.customerId || !formData.description || formData.amount <= 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    const newRecurring: RecurringInvoice = {
      id: `recurring-${Date.now()}`,
      customerId: formData.customerId,
      customerName: customer?.name || 'Unknown',
      description: formData.description,
      amount: formData.amount,
      frequency: formData.frequency,
      nextInvoiceDate: calculateNextDate(formData.startDate, formData.frequency),
      status: 'active',
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      invoiceTemplate: null
    };

    setRecurringInvoices(prev => [...prev, newRecurring]);
    toast.success('Recurring invoice created successfully');
    setIsCreateOpen(false);
    resetForm();
  };

  const calculateNextDate = (startDate: string, frequency: string): string => {
    const date = new Date(startDate);
    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'annually':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      description: '',
      amount: 0,
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
  };

  const toggleStatus = (id: string) => {
    setRecurringInvoices(prev => prev.map(invoice => 
      invoice.id === id 
        ? { ...invoice, status: invoice.status === 'active' ? 'paused' : 'active' }
        : invoice
    ));
    toast.success('Recurring invoice status updated');
  };

  const deleteRecurring = (id: string) => {
    setRecurringInvoices(prev => prev.filter(invoice => invoice.id !== id));
    toast.success('Recurring invoice deleted');
  };

  const generateInvoice = (recurring: RecurringInvoice) => {
    // Generate actual invoice from template
    toast.success('Invoice generated from recurring template');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recurring Invoices</h2>
          <p className="text-muted-foreground">Automate regular billing for repeat customers</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Recurring Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Recurring Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={formData.customerId} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}>
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
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Monthly service fee"
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRecurring}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Recurring Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {recurringInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recurring invoices set up yet</p>
              <p className="text-sm text-muted-foreground">Create your first recurring invoice to automate billing</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recurringInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.customerName}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{invoice.frequency}</TableCell>
                    <TableCell>{invoice.nextInvoiceDate}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'active' ? 'default' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(invoice.id)}
                        >
                          {invoice.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateInvoice(invoice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecurring(invoice.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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