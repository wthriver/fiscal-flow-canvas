
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  reference: string;
}

export const PaymentProcessor = () => {
  const [payments, setPayments] = useState<Payment[]>([
    { id: "pay-1", invoiceId: "INV-001", amount: 1250.00, method: "Credit Card", status: "Completed", date: "2025-05-20", reference: "CC-12345" },
    { id: "pay-2", invoiceId: "INV-002", amount: 500.00, method: "ACH", status: "Pending", date: "2025-05-22", reference: "ACH-67890" },
  ]);

  const [newPayment, setNewPayment] = useState({
    invoiceId: "",
    amount: "",
    method: "Credit Card",
    reference: ""
  });

  const handleProcessPayment = () => {
    if (!newPayment.invoiceId || !newPayment.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      invoiceId: newPayment.invoiceId,
      amount: parseFloat(newPayment.amount),
      method: newPayment.method,
      status: "Completed",
      date: new Date().toISOString().split('T')[0],
      reference: newPayment.reference || `${newPayment.method.replace(' ', '')}-${Date.now()}`
    };

    setPayments(prev => [payment, ...prev]);
    setNewPayment({ invoiceId: "", amount: "", method: "Credit Card", reference: "" });
    toast.success("Payment processed successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Process Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceId">Invoice ID</Label>
              <Input
                id="invoiceId"
                value={newPayment.invoiceId}
                onChange={(e) => setNewPayment({...newPayment, invoiceId: e.target.value})}
                placeholder="INV-001"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="method">Payment Method</Label>
              <Select value={newPayment.method} onValueChange={(value) => setNewPayment({...newPayment, method: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="ACH">ACH Transfer</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                value={newPayment.reference}
                onChange={(e) => setNewPayment({...newPayment, reference: e.target.value})}
                placeholder="Optional"
              />
            </div>
          </div>
          <Button onClick={handleProcessPayment} className="mt-4">
            <DollarSign className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{payment.invoiceId}</p>
                    <p className="text-sm text-muted-foreground">{payment.method} • {payment.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${payment.amount.toFixed(2)}</p>
                  <Badge variant={payment.status === "Completed" ? "default" : "secondary"}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
