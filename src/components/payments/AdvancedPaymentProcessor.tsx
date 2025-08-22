import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Building2, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'ach' | 'check' | 'wire_transfer';
  name: string;
  accountNumber: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

interface PaymentTerm {
  id: string;
  name: string;
  days: number;
  discountDays?: number;
  discountPercent?: number;
  isDefault: boolean;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
  reference: string;
  fees: number;
}

const SAMPLE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'credit_card',
    name: 'Business Visa',
    accountNumber: '****4242',
    isDefault: true,
    status: 'active'
  },
  {
    id: 'pm-2',
    type: 'ach',
    name: 'Business Checking',
    accountNumber: '****1234',
    isDefault: false,
    status: 'active'
  }
];

const SAMPLE_PAYMENT_TERMS: PaymentTerm[] = [
  { id: 'pt-1', name: 'Net 15', days: 15, isDefault: false },
  { id: 'pt-2', name: 'Net 30', days: 30, isDefault: true },
  { id: 'pt-3', name: '2/10 Net 30', days: 30, discountDays: 10, discountPercent: 2, isDefault: false },
  { id: 'pt-4', name: 'Due on Receipt', days: 0, isDefault: false }
];

const SAMPLE_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    invoiceId: 'INV-001',
    amount: 1250.00,
    method: 'Credit Card',
    status: 'completed',
    date: '2024-01-15',
    reference: 'ch_1234567890',
    fees: 36.25
  },
  {
    id: 'pay-2',
    invoiceId: 'INV-002',
    amount: 850.00,
    method: 'ACH',
    status: 'processing',
    date: '2024-01-14',
    reference: 'ach_0987654321',
    fees: 5.00
  }
];

export const AdvancedPaymentProcessor: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(SAMPLE_PAYMENT_METHODS);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(SAMPLE_PAYMENT_TERMS);
  const [payments, setPayments] = useState<Payment[]>(SAMPLE_PAYMENTS);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcessPayment = async (amount: number, method: string) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Processed",
        description: `$${amount.toFixed(2)} payment processed via ${method}`,
      });
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'default',
      failed: 'destructive'
    } as const;
    
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'credit_card': return <CreditCard className="h-4 w-4" />;
      case 'ach': return <Building2 className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Processing</h1>
          <p className="text-muted-foreground">Manage payments, methods, and terms</p>
        </div>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Process Payment
        </Button>
      </div>

      {/* Payment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,100.00</div>
            <p className="text-xs text-muted-foreground">+20.1% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Pending transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$41.25</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="terms">Payment Terms</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Track and manage payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">${payment.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payment.invoiceId} • {payment.method}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">{payment.date}</div>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure your payment processing methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getMethodIcon(method.type)}
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.accountNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && <Badge variant="secondary">Default</Badge>}
                      <Badge variant={method.status === 'active' ? 'default' : 'secondary'}>
                        {method.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Add Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
              <CardDescription>Manage customer payment terms and discounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentTerms.map((term) => (
                  <div key={term.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{term.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Due in {term.days} days
                        {term.discountDays && term.discountPercent && 
                          ` • ${term.discountPercent}% discount if paid within ${term.discountDays} days`
                        }
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {term.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Add Payment Term</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment processing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="autoprocess">Auto-process recurring payments</Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="late-fee">Late Payment Fee (%)</Label>
                <Input id="late-fee" type="number" placeholder="2.5" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grace-period">Grace Period (days)</Label>
                <Input id="grace-period" type="number" placeholder="3" />
              </div>
              
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};